#!/usr/bin/env python3
"""Confere se os sites dos locais abrem. Uso: python3 tools/check_sites.py <arquivo research_*.json> [id ...]
Imprime, por local: status HTTP e título do site e da fonte_url (marinha.mil.br via serviço local fetchsvc)."""
import json, re, subprocess, sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"


def checar(url):
    if not url:
        return "sem url", ""
    if "marinha.mil.br" in url:
        r = subprocess.run(["curl", "-s", "-G", "localhost:8799/page", "--data-urlencode", "url=" + url], capture_output=True, text=True, timeout=120)
        try:
            d = json.loads(r.stdout)
            return str(d.get("status")), (d.get("title") or "")[:90]
        except Exception:
            return "erro fetchsvc", ""
    r = subprocess.run(["curl", "-skL", "--max-time", "40", "-A", UA, "-o", "-", "-w", "\n__STATUS__%{http_code}", url], capture_output=True, timeout=60)
    out = r.stdout.decode("utf-8", errors="replace")
    st = out.rsplit("__STATUS__", 1)[-1].strip() if "__STATUS__" in out else "?"
    m = re.search(r"<title[^>]*>(.*?)</title>", out, re.S | re.I)
    return st, (re.sub(r"\s+", " ", m.group(1)).strip()[:90] if m else "")


d = json.load(open(sys.argv[1]))
ids = set(sys.argv[2:])
for l in d.get("locais", []):
    if ids and l["id"] not in ids:
        continue
    s1, t1 = checar(l.get("site"))
    s2, t2 = checar(l.get("fonte_url")) if l.get("fonte_url") != l.get("site") else (s1, t1)
    print(f"{l['id']} | site {s1} {t1!r} | fonte {s2} {t2!r} | {l.get('cidade')}/{l.get('uf')} ({l.get('lat')},{l.get('lon')})")
