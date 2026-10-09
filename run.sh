#!/usr/bin/env bash
# Abre o app Veleiro. Uso: ./run.sh [porta]   (padrão 8000)
#   ./run.sh --file       abre direto via file:// (sem servidor)
#   ./run.sh --check      valida os dados (node tools/validate.mjs) e sai
#   ./run.sh --no-open [porta]   sobe o servidor sem abrir o navegador (ou VELEIRO_NO_OPEN=1)
#   ./run.sh --help       mostra esta ajuda
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$DIR/app"

abrir() {
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$1" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then open "$1"
  else echo "Abra no navegador: $1"; fi
}

NAO_ABRIR="${VELEIRO_NO_OPEN:-}"
case "${1:-}" in
  -h|--help)
    sed -n '2,6p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
  --no-open)
    NAO_ABRIR=1; shift ;;
esac

case "${1:-}" in
  --check)
    command -v node >/dev/null 2>&1 || { echo "Precisa do Node.js (node) para validar os dados." >&2; exit 1; }
    exec node "$DIR/tools/validate.mjs" ;;
  --file)
    echo "Abrindo file://$APP/index.html"
    abrir "file://$APP/index.html"; exit 0 ;;
  -*)
    echo "Opção desconhecida: $1 (use --help)" >&2; exit 2 ;;
esac

PORTA="${1:-8000}"
case "$PORTA" in (*[!0-9]*|'') echo "Porta inválida: $PORTA" >&2; exit 2 ;; esac
command -v python3 >/dev/null 2>&1 || { echo "Precisa do Python 3 para o servidor local. Alternativa: ./run.sh --file" >&2; exit 1; }
while (echo >/dev/tcp/127.0.0.1/"$PORTA") >/dev/null 2>&1; do PORTA=$((PORTA + 1)); done
URL="http://127.0.0.1:$PORTA/"
echo "Veleiro rodando em $URL  (Ctrl+C para parar)"
echo "Sem servidor, também funciona em: file://$APP/index.html"
if [ -z "$NAO_ABRIR" ]; then ( sleep 1; abrir "$URL" ) & fi
cd "$APP" && exec python3 -m http.server "$PORTA" --bind 127.0.0.1
