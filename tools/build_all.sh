#!/usr/bin/env bash
# Regenera todos os dados derivados e valida. Uso: tools/build_all.sh
set -e
cd "$(dirname "$0")/.."
python3 tools/build_fontes.py
python3 tools/build_locais.py
[ -d research/_work/questoes ] && python3 tools/build_questoes.py || true
ls app/data/flashcards/*.js >/dev/null 2>&1 && python3 tools/build_indice.py || true
python3 tools/build_widgets_doc.py
python3 tools/build_manifesto.py
node tools/validate.mjs || true
