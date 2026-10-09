#!/usr/bin/env python3
"""Gera app/data/manifesto.js: lista dos arquivos de dados (nomes para VL.carregarDado) e dos widgets existentes.
Rode depois de qualquer build de dados. Evita que o app peça arquivos inexistentes (erro no console em file://)."""
import glob, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
dados = sorted(os.path.relpath(f, os.path.join(APP, "data"))[:-3] for f in glob.glob(os.path.join(APP, "data", "**", "*.js"), recursive=True)
               if not f.endswith("manifesto.js"))
widgets = sorted(os.path.basename(f)[:-3] for f in glob.glob(os.path.join(APP, "widgets", "*.js")))
open(os.path.join(APP, "data", "manifesto.js"), "w").write("/* Gerado por tools/build_manifesto.py. Não edite à mão. */\nVL.dado('manifesto', " + json.dumps({"dados": dados, "widgets": widgets}, ensure_ascii=False) + ");\n")
print(len(dados), "dados,", len(widgets), "widgets")
