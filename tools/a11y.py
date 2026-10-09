#!/usr/bin/env python3
"""Auditoria de acessibilidade (axe-core) em todas as abas, claro e escuro. Uso: python3 tools/a11y.py <caminho/axe.min.js>
Grava docs/qa/acessibilidade.md. axe-core é injetado só no teste (não faz parte do app)."""
import json, pathlib, sys, datetime
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = (ROOT / "app" / "index.html").as_uri()
AXE = sys.argv[1]
ROTAS = ["roteiro", "arrais", "arrais/m5/l2", "mestre/m3/l12", "capitao/m3/l2", "vela/m6/l3", "travessia", "radio/m2/l1", "locais", "simulados", "simulados/arrais", "simulados/flashcards", "glossario", "sobre", "sobre/fontes"]
linhas, total = [], {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    for dark in (False, True):
        ctx = b.new_context(color_scheme="dark" if dark else "light", locale="pt-BR")
        ctx.add_init_script("localStorage.setItem('veleiro.v1.settings', JSON.stringify({onboarded:true}))")
        ctx.route("**/*", lambda r, q: r.continue_() if q.url.startswith(("file:", "data:", "blob:")) else r.abort())
        pg = ctx.new_page()
        for rota in ROTAS:
            pg.goto(APP + "#/" + rota); pg.wait_for_timeout(2500)
            pg.add_script_tag(path=AXE)
            r = pg.evaluate("""async () => { const r = await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
                return r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, alvo: v.nodes.slice(0,2).map(n => n.target.join(' '))})); }""")
            modo = "escuro" if dark else "claro"
            for v in r:
                total[(v["id"], v["impact"])] = total.get((v["id"], v["impact"]), 0) + v["n"]
            linhas.append(f"| {rota} | {modo} | {len(r)} | " + "; ".join(f"{v['id']} ({v['impact']}, {v['n']})" for v in r) + " |")
        ctx.close()
    b.close()
md = [f"# Acessibilidade (axe-core, WCAG 2.1 A/AA)", "", f"Gerado por tools/a11y.py em {datetime.date.today()}.", "",
      "| Rota | Tema | Regras violadas | Detalhe |", "|---|---|---|---|"] + linhas + ["", "## Total por regra", ""] + [f"- {k[0]} ({k[1]}): {n} nós" for k, n in sorted(total.items(), key=lambda x: -x[1])]
(ROOT / "docs" / "qa" / "acessibilidade.md").write_text("\n".join(md) + "\n")
print(json.dumps({f"{k[0]}|{k[1]}": n for k, n in total.items()}, ensure_ascii=False))
