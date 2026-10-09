#!/usr/bin/env python3
"""Checa (em paralelo) os sites de TODOS os locais pesquisados e grava research/_work/sitecheck.json
{id: {topico, site_status, site_title, fonte_status, fonte_title}}. Uso: python3 tools/check_sites_all.py"""
import glob, json, os, re, subprocess
from concurrent.futures import ThreadPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
memo = {}
def checar(url):
    if not url: return ("sem url", "")
    if url in memo: return memo[url]
    try:
        if "marinha.mil.br" in url:
            r = subprocess.run(["curl", "-s", "-G", "localhost:8799/page", "--data-urlencode", "url=" + url], capture_output=True, text=True, timeout=90)
            d = json.loads(r.stdout); res = (str(d.get("status")), (d.get("title") or "")[:100])
        else:
            r = subprocess.run(["curl", "-skL", "--max-time", "20", "-A", UA, "-o", "-", "-w", "\n__STATUS__%{http_code}", url], capture_output=True, timeout=30)
            out = r.stdout.decode("utf-8", errors="replace")
            st = out.rsplit("__STATUS__", 1)[-1].strip() if "__STATUS__" in out else "?"
            m = re.search(r"<title[^>]*>(.*?)</title>", out, re.S | re.I)
            res = (st, re.sub(r"\s+", " ", m.group(1)).strip()[:100] if m else "")
    except Exception as e:
        res = ("erro", str(e)[:80])
    memo[url] = res
    return res
itens = []
for f in sorted(glob.glob(os.path.join(W, "research_*.json"))):
    k = re.search(r"research_(.+)\.json$", f).group(1)
    d = json.load(open(f)); d = d if isinstance(d, dict) else {}
    for l in d.get("locais") or []: itens.append((k, l))
def um(par):
    k, l = par
    s = checar(l.get("site")); fo = checar(l.get("fonte_url")) if l.get("fonte_url") and l.get("fonte_url") != l.get("site") else s
    return l["id"], {"topico": k, "site_status": s[0], "site_title": s[1], "fonte_status": fo[0], "fonte_title": fo[1]}
ARQ = os.path.join(W, "sitecheck.json")
res = json.load(open(ARQ)) if os.path.exists(ARQ) else {}
pend = [p for p in itens if p[1]["id"] not in res]
import threading
trava = threading.Lock()
def um_salva(par):
    i, v = um(par)
    with trava:
        res[i] = v
        if len(res) % 10 == 0:
            json.dump(res, open(ARQ, "w"), ensure_ascii=False, indent=0)
with ThreadPoolExecutor(int(os.environ.get("THREADS", "16"))) as ex:
    list(ex.map(um_salva, pend))
json.dump(res, open(ARQ, "w"), ensure_ascii=False, indent=0)
ok = sum(1 for v in res.values() if v["site_status"].startswith("2"))
print(json.dumps({"locais": len(res), "site_2xx": ok, "outros": {i: v["site_status"] for i, v in res.items() if not v["site_status"].startswith("2")}}, ensure_ascii=False)[:3000])
