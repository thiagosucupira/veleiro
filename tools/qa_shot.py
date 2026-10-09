#!/usr/bin/env python3
"""Captura telas do app (file://) e coleta erros de console/rede.

Uso:
  python3 tools/qa_shot.py --out /tmp/shots roteiro arrais/m1/l1 simulados
  python3 tools/qa_shot.py --out /tmp/shots --mobile --dark locais
  python3 tools/qa_shot.py --out /tmp/shots --offline roteiro   (bloqueia toda rede externa)
  python3 tools/qa_shot.py --out /tmp/shots --click "text=Começar" roteiro
  python3 tools/qa_shot.py --out /tmp/shots "roteiro@@text=Começar" locais   (clica só na rota roteiro)

--click vale para TODAS as rotas da chamada. Para clicar só numa, escreva "rota@@seletor" no lugar da rota
(o seletor é Playwright; pode repetir a mesma rota com seletores diferentes).

Cada rota vira <out>/<rota>_<desktop|mobile>_<light|dark>.png. Imprime um JSON por rota com
erros de console, exceções de página, requisições externas e falhas de carga.
Usa o Google Chrome do sistema (channel="chrome").
"""
import argparse, json, os, pathlib, sys
from playwright.sync_api import sync_playwright

APP = pathlib.Path(__file__).resolve().parent.parent / "app" / "index.html"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("rotas", nargs="*", default=["roteiro"])
    ap.add_argument("--out", default="/tmp/veleiro-shots")
    ap.add_argument("--mobile", action="store_true")
    ap.add_argument("--dark", action="store_true")
    ap.add_argument("--offline", action="store_true", help="aborta qualquer requisição que não seja file://")
    ap.add_argument("--wait", type=int, default=1500, help="ms de espera após carregar")
    ap.add_argument("--full", action="store_true", help="captura a página inteira")
    ap.add_argument("--click", action="append", default=[], help="seletor Playwright para clicar antes da captura, em todas as rotas (para uma só, use rota@@seletor)")
    ap.add_argument("--fresh", action="store_true", help="não pula as boas-vindas")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"])
        vp = {"width": 390, "height": 844} if a.mobile else {"width": 1440, "height": 900}
        ctx = b.new_context(viewport=vp, device_scale_factor=2 if a.mobile else 1, color_scheme="dark" if a.dark else "light",
                            is_mobile=a.mobile, has_touch=a.mobile, locale="pt-BR")
        if not a.fresh:
            ctx.add_init_script("try{var s=JSON.parse(localStorage.getItem('veleiro.v1.settings')||'{}');s.onboarded=true;localStorage.setItem('veleiro.v1.settings',JSON.stringify(s));}catch(e){}")
        for arg in a.rotas:
            rota, _, sel_rota = arg.partition("@@")
            cliques = a.click + ([sel_rota] if sel_rota else [])
            pg = ctx.new_page()
            log = {"rota": rota, "console": [], "pageerrors": [], "externas": [], "falhas": []}
            pg.on("console", lambda m, log=log: log["console"].append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
            pg.on("pageerror", lambda e, log=log: log["pageerrors"].append(str(e)))
            pg.on("requestfailed", lambda r, log=log: log["falhas"].append(f"{r.url} {r.failure}"))

            def rota_handler(route, request, log=log):
                if not request.url.startswith("file://") and not request.url.startswith("data:") and not request.url.startswith("blob:"):
                    log["externas"].append(request.url)
                    if a.offline:
                        return route.abort()
                return route.continue_()
            pg.route("**/*", rota_handler)
            pg.goto(APP.as_uri() + "#/" + rota)
            pg.wait_for_timeout(a.wait)
            for sel in cliques:
                try:
                    pg.click(sel, timeout=4000)
                    pg.wait_for_timeout(800)
                except Exception as e:
                    log["pageerrors"].append(f"click {sel}: {e}")
            nome = rota.replace("/", "_").replace("?", "_") or "home"
            if sel_rota:
                nome += "_" + "".join(c if c.isalnum() else "-" for c in sel_rota)[:30]
            arq = os.path.join(a.out, f"{nome}_{'mobile' if a.mobile else 'desktop'}_{'dark' if a.dark else 'light'}.png")
            pg.screenshot(path=arq, full_page=a.full)
            log["shot"] = arq
            log["h1"] = pg.eval_on_selector_all("h1", "els => els.map(e => e.innerText).slice(0,3)")
            log["overflowX"] = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
            print(json.dumps(log, ensure_ascii=False))
            pg.close()
        b.close()


if __name__ == "__main__":
    sys.exit(main())
