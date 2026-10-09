#!/usr/bin/env python3
"""Imprime o pacote de evidência de um lote de afirmações para os verificadores.

Uso: python3 tools/verif_pack.py <tópico> <de> <até>     ex.: python3 tools/verif_pack.py normas 1 30
Para cada afirmação: texto, fonte, localizador, trecho citado e o resultado da checagem determinística
(research/_work/quotecheck.json): se o trecho foi achado literalmente na fonte e o contexto ao redor.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")


def main():
    topico, de, ate = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    d = json.load(open(os.path.join(W, f"research_{topico}.json")))
    d = d if isinstance(d, dict) else {"claims": d}
    qc = json.load(open(os.path.join(W, "quotecheck.json"))) if os.path.exists(os.path.join(W, "quotecheck.json")) else {}
    claims = d["claims"][de - 1: ate]
    for c in claims:
        q = qc.get(c["id"], {})
        print("=" * 100)
        print(f"ID: {c['id']}")
        print(f"AFIRMAÇÃO: {c['claim']}")
        print(f"FONTE: {c.get('source_url')}  |  LOCALIZADOR: {c.get('locator')}  |  oficial={c.get('official')}")
        print(f"TRECHO CITADO: {c.get('quote')}")
        if c.get("notes"):
            print(f"NOTAS DO PESQUISADOR: {c['notes'][:400]}")
        status = "ACHADO LITERALMENTE" if q.get("how") == "literal" else ("ACHADO (normalizado)" if q.get("how") == "normalizado" else ("SEM TRECHO" if q.get("how") == "sem-trecho" else "NÃO ACHADO no texto da fonte — abra a fonte"))
        print(f"CHECAGEM AUTOMÁTICA: {status}")
        if q.get("context"):
            print(f"CONTEXTO NA FONTE: …{q['context'][:800]}…")
    print("=" * 100)
    print(f"{len(claims)} afirmações ({claims[0]['id']} a {claims[-1]['id']})" if claims else "nenhuma")


if __name__ == "__main__":
    main()
