#!/usr/bin/env python3
"""Teste em Android real (Chrome do Android via ADB + DevTools). Pré: ./run.sh 8790 no host; emulador/aparelho com
adb forward tcp:9444 localabstract:chrome_devtools_remote. Grava docs/qa/android.md."""
import json, pathlib, datetime, subprocess
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "http://10.0.2.2:8790/"
ABAS = ["roteiro", "arrais", "arrais/m5/l2", "mestre", "capitao", "capitao/m3/l2", "vela", "vela/m2/l1", "travessia", "radio", "locais", "simulados", "simulados/arrais", "simulados/flashcards/arrais", "glossario", "sobre"]
modelo = subprocess.run(["adb", "shell", "getprop", "ro.product.model"], capture_output=True, text=True).stdout.strip()
versao = subprocess.run(["adb", "shell", "getprop", "ro.build.version.release"], capture_output=True, text=True).stdout.strip()
linhas, falhas = [], 0
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:9444")
    ctx = b.contexts[0]
    pg = ctx.pages[0] if ctx.pages else ctx.new_page()
    erros = []
    pg.on("pageerror", lambda e: erros.append(str(e)))
    pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
    pg.goto(BASE + "#/roteiro"); pg.wait_for_timeout(2500)
    pg.evaluate("localStorage.setItem('veleiro.v1.settings', JSON.stringify({onboarded:true}))")
    pg.reload(); pg.wait_for_timeout(2500)
    ua = pg.evaluate("navigator.userAgent")
    for aba in ABAS:
        erros.clear()
        pg.goto(BASE + "#/" + aba); pg.wait_for_timeout(3500)
        info = pg.evaluate("""() => ({h1: (document.querySelector('h1')||{}).innerText || '', w: innerWidth,
            over: document.documentElement.scrollWidth > innerWidth + 1,
            canvas: document.querySelectorAll('canvas').length, alvosPequenos: [...document.querySelectorAll('button, a.btn, input, select')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 32 || r.width < 32) && getComputedStyle(e).visibility !== 'hidden'; }).length})""")
        ok = info["h1"] and not info["over"] and not erros
        falhas += 0 if ok else 1
        linhas.append(f"| {aba} | {'OK' if ok else '**FALHA**'} | {info['h1'][:50]} | {info['w']} px | {info['over']} | {len(erros)} {erros[:1]} | {info['canvas']} |")
        pg.screenshot(path=f"/tmp/claude-1000/-home-sobranceiro/767d06b5-c8a6-4493-9ee3-da137f666222/scratchpad/and_{aba.replace('/','_')}.png")
md = ["# Teste em Android (Chrome do Android)", "", f"{datetime.date.today()} — aparelho: {modelo}, Android {versao}; navegador: {ua}.",
      "Servido por `./run.sh 8790` no computador; aberto no Chrome do Android em http://10.0.2.2:8790/ e controlado por DevTools (ADB).", "",
      f"**{len(ABAS) - falhas} de {len(ABAS)} rotas OK.**", "", "| Rota | Resultado | Título | Largura | Rolagem horizontal | Erros | Canvas |", "|---|---|---|---|---|---|---|"] + linhas
(ROOT / "docs" / "qa" / "android.md").write_text("\n".join(md) + "\n")
print(f"{len(ABAS)-falhas}/{len(ABAS)} OK")
