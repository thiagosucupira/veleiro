"""Local fetch service that reads Cloudflare-protected pages through a real Chrome.

Chrome must already be running with --remote-debugging-port=9333 and have passed
the Cloudflare challenge. Endpoints (GET, localhost:8799):
  /page?url=U          -> navigate a tab, return JSON {url,title,text,links:[{href,text}]}
  /pdf?url=U           -> in-page fetch (same-origin cookies), save PDF, return JSON {path,pages,text}
  /health              -> ok
Results are cached under CACHE_DIR keyed by URL hash.
"""
import asyncio, base64, hashlib, json, os, subprocess, sys
from urllib.parse import urlparse
from aiohttp import web
from playwright.async_api import async_playwright

CACHE_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)
SEM = asyncio.Semaphore(3)
STATE = {}


def key(url, kind):
    return os.path.join(CACHE_DIR, kind + "_" + hashlib.sha1(url.encode()).hexdigest()[:16])


async def get_ctx():
    if "ctx" not in STATE:
        pw = await async_playwright().start()
        browser = await pw.chromium.connect_over_cdp("http://localhost:9333")
        STATE["pw"], STATE["browser"], STATE["ctx"] = pw, browser, browser.contexts[0]
    return STATE["ctx"]


async def wait_challenge(page):
    for _ in range(20):
        t = await page.title()
        if "Um momento" not in t and "Just a moment" not in t:
            return True
        await page.wait_for_timeout(1500)
    return False


async def handle_page(request):
    url = request.query["url"]
    cache = key(url, "page") + ".json"
    if os.path.exists(cache) and request.query.get("fresh") != "1":
        return web.Response(text=open(cache).read(), content_type="application/json")
    async with SEM:
        ctx = await get_ctx()
        page = await ctx.new_page()
        try:
            resp = await page.goto(url, timeout=60000, wait_until="domcontentloaded")
            ok = await wait_challenge(page)
            await page.wait_for_timeout(1500)
            data = {
                "url": page.url,
                "status": resp.status if resp else None,
                "challenge_passed": ok,
                "title": await page.title(),
                "text": await page.inner_text("body"),
                "links": await page.eval_on_selector_all(
                    "a[href]", "els => els.map(e => ({href: e.href, text: (e.innerText||'').trim().slice(0,200)}))"),
            }
        except Exception as e:  # report, never crash the service
            data = {"url": url, "error": str(e)}
        finally:
            await page.close()
    out = json.dumps(data, ensure_ascii=False)
    if "error" not in data and data.get("challenge_passed"):
        open(cache, "w").write(out)
    return web.Response(text=out, content_type="application/json")


async def handle_pdf(request):
    url = request.query["url"]
    base = key(url, "pdf")
    if os.path.exists(base + ".json") and request.query.get("fresh") != "1":
        return web.Response(text=open(base + ".json").read(), content_type="application/json")
    origin = "{0.scheme}://{0.netloc}/".format(urlparse(url))
    direct = url.replace("://www.marinha.mil.br/", "://assets.marinha.mil.br/")
    proc = await asyncio.create_subprocess_exec("curl", "-sk", "-L", "--max-time", "120", "-A",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36", "-o", base + ".pdf", direct)
    await proc.wait()
    if os.path.exists(base + ".pdf") and open(base + ".pdf", "rb").read(4) == b"%PDF":
        subprocess.run(["pdftotext", "-layout", base + ".pdf", base + ".txt"], check=False)
        info = subprocess.run(["pdfinfo", base + ".pdf"], capture_output=True, text=True).stdout
        pages = next((l.split()[-1] for l in info.splitlines() if l.startswith("Pages")), None)
        data = {"url": url, "fetched_from": direct, "pdf_path": base + ".pdf", "text_path": base + ".txt", "pages": pages,
                "text": open(base + ".txt", errors="replace").read() if os.path.exists(base + ".txt") else ""}
        out = json.dumps(data, ensure_ascii=False)
        open(base + ".json", "w").write(out)
        return web.Response(text=out, content_type="application/json")
    async with SEM:
        ctx = await get_ctx()
        page = await ctx.new_page()
        try:
            await page.goto(origin, timeout=60000, wait_until="domcontentloaded")
            await wait_challenge(page)
            b64 = await page.evaluate(
                """async (u) => { const r = await fetch(u, {credentials: 'include'});
                     if (!r.ok) return 'ERR' + r.status;
                     const buf = new Uint8Array(await r.arrayBuffer()); let s = '';
                     for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
                     return btoa(s); }""", url)
            if b64.startswith("ERR"):
                data = {"url": url, "error": "http " + b64[3:]}
            else:
                raw = base64.b64decode(b64)
                open(base + ".pdf", "wb").write(raw)
                if not raw.startswith(b"%PDF"):
                    data = {"url": url, "error": "not a pdf", "head": raw[:300].decode("latin-1")}
                else:
                    subprocess.run(["pdftotext", "-layout", base + ".pdf", base + ".txt"], check=False)
                    info = subprocess.run(["pdfinfo", base + ".pdf"], capture_output=True, text=True).stdout
                    pages = next((l.split()[-1] for l in info.splitlines() if l.startswith("Pages")), None)
                    data = {"url": url, "pdf_path": base + ".pdf", "text_path": base + ".txt", "pages": pages,
                            "text": open(base + ".txt", errors="replace").read() if os.path.exists(base + ".txt") else ""}
        except Exception as e:
            data = {"url": url, "error": str(e)}
        finally:
            await page.close()
    out = json.dumps(data, ensure_ascii=False)
    if "error" not in data:
        open(base + ".json", "w").write(out)
    return web.Response(text=out, content_type="application/json")


async def health(_):
    return web.Response(text="ok")


app = web.Application()
app.add_routes([web.get("/page", handle_page), web.get("/pdf", handle_pdf), web.get("/health", health)])
web.run_app(app, host="127.0.0.1", port=8799)
