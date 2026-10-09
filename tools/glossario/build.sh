#!/bin/bash
# Monta app/data/glossario.js a partir das partes em src/ e confere a consistência.
D=$(cd "$(dirname "$0")" && pwd)
OUT=/home/sobranceiro/veleiro_certificacoes/app/data/glossario.js
cat "$D"/src/01-figs.js "$D"/src/02-base.js "$D"/src/[1-8][0-9]-*.js "$D"/src/99-fim.js > "$OUT"
node "$D/checa.js" "$OUT"
