#!/usr/bin/env python3
"""Monta app/data/questoes/<nivel>.js a partir dos lotes revisados em research/_work/questoes/.

Ordem de preferência por lote: <nivel>-<k>.rev2.json (2ª revisão) > .rev1.json > (nunca usa lote sem revisão).
Renumera ids como <nivel>-0001… em ordem estável, descarta duplicatas por enunciado e valida o básico.
"""
import glob, json, os, re, sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = os.path.join(ROOT, "research", "_work", "questoes")
OUT = os.path.join(ROOT, "app", "data", "questoes")
NIVEIS = ["arrais", "mestre", "capitao", "vela", "travessia", "radio"]


def norm(t):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", t or "")).strip().lower()


def main():
    os.makedirs(OUT, exist_ok=True)
    resumo = {}
    for nivel in NIVEIS:
        lotes = sorted({re.sub(r"\.(rev1|rev2)?\.?json$", "", os.path.basename(f)) for f in glob.glob(os.path.join(Q, f"{nivel}-*.json"))})
        todas, vistos, descartes, sem_rev = [], set(), 0, []
        for lote in lotes:
            arq = None
            for suf in (".rev2.json", ".rev1.json"):
                p = os.path.join(Q, lote + suf)
                if os.path.exists(p):
                    arq = p
                    break
            if not arq:
                sem_rev.append(lote)
                continue
            dados = json.load(open(arq, encoding="utf-8"))
            qs = dados["questoes"] if isinstance(dados, dict) else dados
            for q in qs:
                k = norm(q.get("enunciado"))
                alts = q.get("alternativas") or []
                ok = (k and k not in vistos and 3 <= len(alts) <= 5 and isinstance(q.get("correta"), int)
                      and 0 <= q["correta"] < len(alts) and len(norm(q.get("explicacao"))) >= 40 and q.get("referencia") and q.get("tema"))
                if not ok:
                    descartes += 1
                    continue
                vistos.add(k)
                q = {c: q[c] for c in ["tema", "dificuldade", "enunciado", "alternativas", "correta", "explicacao", "referencia", "fonte_url", "figura", "fixa", "intl"] if c in q and q[c] not in (None, "")}
                q["nivel"] = nivel
                todas.append(q)
        if not todas:
            continue
        for i, q in enumerate(todas, 1):
            q["id"] = f"{nivel}-{i:04d}"
        ordem = ["id", "nivel", "tema", "dificuldade", "enunciado", "alternativas", "correta", "explicacao", "referencia", "fonte_url", "figura", "fixa", "intl"]
        todas = [{c: q[c] for c in ordem if c in q} for q in todas]
        with open(os.path.join(OUT, f"{nivel}.js"), "w", encoding="utf-8") as f:
            f.write(f"/* Banco de questões — {nivel}. Gerado por tools/build_questoes.py em {date.today().isoformat()} a partir de\n"
                    f"   research/_work/questoes/ (cada lote passou por duas revisões de instrutor). Conteúdo CC BY-SA 4.0. */\n")
            f.write(f"VL.dado('questoes/{nivel}', " + json.dumps(todas, ensure_ascii=False, indent=0) + ");\n")
        temas = {}
        for q in todas:
            temas[q["tema"]] = temas.get(q["tema"], 0) + 1
        resumo[nivel] = {"questoes": len(todas), "descartadas": descartes, "lotes_sem_revisao": sem_rev, "temas": temas}
    print(json.dumps(resumo, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
