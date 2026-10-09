#!/usr/bin/env python3
"""Gera docs/widgets.md com o comentário de cabeçalho de cada app/widgets/<nome>.js (opts e exemplos)."""
import glob, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = ["# Widgets (simuladores e visualizações)", "", "Gerado por `tools/build_widgets_doc.py` a partir do cabeçalho de cada arquivo em `app/widgets/`.",
       "Use num bloco de lição: `{t:'widget', w:'<nome>', opts:{...}}`. Teste isolado: `#/lab/<nome>?opts=<json>`.", ""]
for f in sorted(glob.glob(os.path.join(ROOT, "app", "widgets", "*.js"))):
    s = open(f, encoding="utf-8").read()
    m = re.match(r"\s*/\*(.*?)\*/", s, re.S)
    cab = m.group(1).strip() if m else "(sem cabeçalho)"
    cab = "\n".join(l.strip().lstrip("*").rstrip() for l in cab.splitlines())
    out += [f"## {os.path.basename(f)[:-3]}", "", f"`app/widgets/{os.path.basename(f)}` — {os.path.getsize(f)//1024} KB", "", "```", cab[:6000], "```", ""]
open(os.path.join(ROOT, "docs", "widgets.md"), "w", encoding="utf-8").write("\n".join(out))
print(len(glob.glob(os.path.join(ROOT, "app", "widgets", "*.js"))), "widgets")
