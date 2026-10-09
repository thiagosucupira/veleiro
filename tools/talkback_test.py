#!/usr/bin/env python3
"""Com o TalkBack ligado no Android, abre rotas no Chrome (via DevTools) e lê a árvore de acessibilidade que o
TalkBack anuncia (uiautomator dump). Conta controles clicáveis sem nome falado. Grava docs/qa/talkback.md."""
import pathlib, subprocess, datetime, re, xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "http://10.0.2.2:8790/"
import sys
ROTAS = sys.argv[1:] or ["roteiro", "arrais/m5/l2", "simulados/arrais/prova", "simulados/flashcards/arrais", "locais", "glossario", "lab/ripeam-luzes", "sobre", "mestre/m3/l12", "capitao/m3/l2", "vela/m6/l3", "travessia", "radio/m2/l1", "simulados"]
A = ["adb", "-s", "emulator-5554"]
def dump():
    subprocess.run(A + ["shell", "uiautomator", "dump", "/sdcard/v.xml"], capture_output=True, timeout=60)
    return subprocess.run(A + ["exec-out", "cat", "/sdcard/v.xml"], capture_output=True, timeout=60).stdout.decode("utf-8", "replace")
linhas, total_sem = [], 0
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:9444"); pg = b.contexts[0].pages[0]
    cdp = b.contexts[0].new_cdp_session(pg); cdp.send('Network.clearBrowserCache')
    for r in ROTAS:
        subprocess.run(A + ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", BASE + "?t=" + str(len(linhas)) + "#/" + r, "com.android.chrome"], capture_output=True)
        pg.wait_for_timeout(5000)
        pg = [x for x in b.contexts[0].pages if ("#/" + r) in x.url][-1] if any(("#/" + r) in x.url for x in b.contexts[0].pages) else pg
        if r.endswith("/prova"):
            bt = pg.get_by_role("button", name=re.compile("^Começar", re.I))
            if bt.count(): bt.first.click(); pg.wait_for_timeout(1500)
        web, raiz = [], None
        for tentativa in range(6):
            pg.wait_for_timeout(1500)
            try:
                raiz = ET.fromstring(dump())
            except ET.ParseError:
                continue
            web = [n for n in raiz.iter("node") if n.get("package") == "com.android.chrome"]
            if len(web) > 30: break
            pg.wait_for_timeout(2500)
        vis = lambda n: n.get("bounds") not in ("[0,0][0,0]",) and not (n.get("resource-id") or "").startswith("com.android.chrome:id")
        cliq = [n for n in web if n.get("clickable") == "true" and n.get("class") != "android.webkit.WebView" and vis(n)]
        sem = [n for n in cliq if not (n.get("text") or n.get("content-desc"))]
        falados = [(n.get("text") or n.get("content-desc")) for n in cliq if (n.get("text") or n.get("content-desc"))]
        total_sem += len(sem)
        for n in sem: print("SEM NOME", r, n.get("class"), n.get("bounds"), n.get("resource-id"))
        linhas.append(f"| {r} | {len(web)} | {len(cliq)} | {len(sem)} | {'; '.join(x[:40] for x in falados[:6])} |")
md = ["# Teste com leitor de tela real (TalkBack, Android)", "", f"{datetime.date.today()} — Android 15 (emulador), Chrome 124, TalkBack ativo.",
      "Para cada rota, a árvore de acessibilidade que o TalkBack anuncia foi lida com `uiautomator dump`; conta-se os controles clicáveis sem nome falado.", "",
      f"**Controles clicáveis sem nome falado: {total_sem}.**", "", "| Rota | Nós na página | Clicáveis | Sem nome | Exemplos do que o TalkBack fala |", "|---|---|---|---|---|"] + linhas
(ROOT / "docs" / "qa" / "talkback.md").write_text("\n".join(md) + "\n")
print("sem nome:", total_sem); print("\n".join(linhas))
