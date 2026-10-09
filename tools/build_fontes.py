#!/usr/bin/env python3
"""Consolida a pesquisa verificada.

Entrada: research/_work/research_<tópico>.json (afirmações dos pesquisadores) e
         research/_work/verify_<tópico>_<lote>_<lente>.json (vereditos dos verificadores independentes).
Saída:   research/claims_verified.json, research/sources.md e app/data/fontes.js.

Regra: um fato só fica "confirmado" se TODAS as lentes de verificação (fonte + atualidade; o benchmark só tem
"fonte") disserem "confirmado". Qualquer divergência ou impossibilidade de verificar → "a confirmar".
Fatos corrigidos manualmente após checagem ficam em research/correcoes.json ({id: {status, claim?, nota}}).
"""
import glob, json, os, re, sys
from datetime import date
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")
TOPICOS = {
    "normas": "Habilitação de amadores (NORMAM-211, Cap. 5)",
    "programa": "Programa oficial das provas e provas antigas",
    "taxas": "Taxas, inscrição/agendamento e Capitanias",
    "radio": "Rádio, segurança e certificados complementares",
    "internacional": "Trilha internacional (RYA, ICC, ASA)",
    "travessia": "Travessia oceânica (OSR, rotas, meteorologia, SAR)",
    "tecnico": "Conteúdo técnico (RIPEAM, balizamento, publicações DHN)",
    "benchmark": "Benchmark de cursos online",
    "loc_ne": "Fatos levantados na pesquisa de locais — Nordeste",
    "loc_se": "Fatos levantados na pesquisa de locais — Sudeste",
    "loc_s": "Fatos levantados na pesquisa de locais — Sul",
    "loc_nco": "Fatos levantados na pesquisa de locais — Norte, Centro-Oeste e águas interiores",
    "loc_ext": "Fatos levantados na pesquisa de locais — exterior",
    "loc_regatas": "Fatos levantados na pesquisa de regatas, rallies e tripulação",
}
# Profundidade de verificação por risco (ver docs/decisoes.md): fatos regulatórios da lista do usuário → 2 lentes;
# conteúdo técnico, trilha internacional, travessia e fatos achados pelos pesquisadores de locais → 1 lente + checagem
# literal automática (tools/check_quotes.py). Benchmark não é exibido no app (referência de design, não verificado).
LENTES = {"benchmark": ["fonte"]}  # todos os demais tópicos exigem as duas lentes (fonte + atualidade)


def carregar(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def rotulo_fonte(url, locator):
    host = urlparse(url).netloc.replace("www.", "") if url else ""
    base = {
        "marinha.mil.br": "Marinha/DPC", "assets.marinha.mil.br": "Marinha/DPC", "gov.br": "gov.br", "anatel.gov.br": "Anatel",
        "rya.org.uk": "RYA", "sailing.org": "World Sailing", "asa.com": "ASA", "unece.org": "UNECE", "noaa.gov": "NOAA",
        "nhc.noaa.gov": "NOAA/NHC", "msi.nga.mil": "NGA", "itu.int": "UIT", "imo.org": "IMO", "worldcruising.com": "World Cruising Club",
    }.get(host, host)
    if "normam-211" in (url or "").lower():
        base = "NORMAM-211/DPC"
    loc = (locator or "").strip()
    return (base + (", " + loc if loc else ""))[:90]


def main():
    hoje = date.today().isoformat()
    correcoes = {}
    desempate = {}
    dp = os.path.join(ROOT, "research", "_work", "desempate.json")
    if os.path.exists(dp):
        desempate = carregar(dp)
    cp = os.path.join(ROOT, "research", "correcoes.json")
    if os.path.exists(cp):
        correcoes = carregar(cp)
    todos = []
    extras = sorted(re.search(r"research_(extra_.+)\.json$", f).group(1) for f in glob.glob(os.path.join(W, "research_extra_*.json")))
    for ex in extras:
        TOPICOS.setdefault(ex, "Fatos extras registrados pelos autores (" + ex.replace("extra_", "") + ")")
    for key in TOPICOS:
        rp = os.path.join(W, f"research_{key}.json")
        if not os.path.exists(rp):
            print(f"aviso: falta {rp}", file=sys.stderr)
            continue
        res = carregar(rp)
        if isinstance(res, list):
            res = {"claims": res}
        lentes = LENTES.get(key, ["fonte", "atual"])
        vereditos = {}
        for vp in glob.glob(os.path.join(W, f"verify_{key}_*_*.json")):
            m = re.search(rf"verify_{key}_(\d+)_(fonte|atual)\.json$", vp)
            if not m:
                continue
            ids_topico = {c["id"] for c in res.get("claims", [])}
            for v in carregar(vp).get("verdicts", []):
                if v["id"] not in ids_topico:
                    print(f"AVISO: {os.path.basename(vp)} traz id de outro tópico: {v['id']} (ignorado)", file=sys.stderr)
                    continue
                vereditos.setdefault(v["id"], {})[m.group(2)] = v
        for c in res.get("claims", []):
            vs = vereditos.get(c["id"], {})
            ok = all(vs.get(l, {}).get("verdict") == "confirmado" for l in lentes)
            status = "confirmado" if ok else "a confirmar"
            notas = []
            for l in lentes:
                v = vs.get(l)
                if not v:
                    notas.append(f"[{l}] sem veredito")
                elif v["verdict"] != "confirmado":
                    t = f"[{l}] {v['verdict']}"
                    if v.get("correction"):
                        t += f": {v['correction']}"
                    if v.get("notes"):
                        t += f" ({v['notes'][:300]})"
                    notas.append(t)
            item = dict(c, topico=key, status=status, verificacao=vs, nota="; ".join(notas))
            if c["id"] in desempate:
                dz = desempate[c["id"]]
                if dz.get("verdict") == "confirmado_com_correcao" and dz.get("claim_corrigida") and dz.get("evidence_url") and dz.get("evidence_quote"):
                    item["claim_original"] = item["claim"]
                    item["claim"] = dz["claim_corrigida"]
                    item["source_url"] = dz["evidence_url"]
                    item["quote"] = dz["evidence_quote"]
                    item["status"] = "confirmado"
                    item["nota"] = "Desempate (3º verificador): redação corrigida conforme a fonte. " + (dz.get("notes") or "")
                elif dz.get("notes"):
                    item["nota"] = (item.get("nota") or "") + " | Desempate: " + dz["notes"]
            if c["id"] in correcoes:
                cor = dict(correcoes[c["id"]])
                if cor.get("nota"):
                    item["nota"] = (item.get("nota") or "") + " | Conciliação no texto do app: " + cor.pop("nota")
                cor.pop("status", None)  # status só muda por verificação
                item.update(cor)
            todos.append(item)

    with open(os.path.join(ROOT, "research", "claims_verified.json"), "w", encoding="utf-8") as f:
        json.dump({"gerado": hoje, "fatos": todos}, f, ensure_ascii=False, indent=1)

    # sources.md
    linhas = [
        "# Fontes e fatos verificados",
        "",
        f"Gerado por `tools/build_fontes.py` em {hoje}. Cada fato foi levantado por um pesquisador e checado por dois",
        "verificadores independentes: um reabriu a fonte citada (lente \"fonte\") e outro procurou confirmação ou",
        "contradição em outras fontes oficiais e atuais (lente \"atualidade\"). Só é **confirmado** o fato aprovado nas duas.",
        "Qualquer divergência ou impossibilidade de verificar → **a confirmar** (selo amarelo no app).",
        "",
        "Data de consulta de todas as fontes: 2026-10-07, salvo indicação.",
        "",
    ]
    n_ok = sum(1 for t in todos if t["status"] == "confirmado")
    linhas += [f"**Total:** {len(todos)} fatos · {n_ok} confirmados · {len(todos) - n_ok} a confirmar.", ""]
    for key, titulo in TOPICOS.items():
        itens = [t for t in todos if t["topico"] == key]
        if not itens:
            continue
        linhas += [f"## {titulo}", "", "| ID | Fato | Fonte | Status | Observação |", "|---|---|---|---|---|"]
        for t in itens:
            fato = t["claim"].replace("|", "\\|").replace("\n", " ")
            fonte = f"[{rotulo_fonte(t['source_url'], t.get('locator'))}]({t['source_url']})" if t.get("source_url") else "—"
            obs = (t.get("nota") or "").replace("|", "\\|").replace("\n", " ")[:500]
            linhas.append(f"| {t['id']} | {fato} | {fonte} | {'confirmado' if t['status'] == 'confirmado' else '**a confirmar**'} | {obs} |")
        linhas.append("")
    with open(os.path.join(ROOT, "research", "sources.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")

    # app/data/fontes.js
    fatos = {}
    for t in todos:
        if t["topico"] == "benchmark":
            continue
        fatos[t["id"]] = {
            "txt": rotulo_fonte(t.get("source_url"), t.get("locator")),
            "claim": t["claim"],
            "url": t.get("source_url"),
            "locator": t.get("locator"),
            "quote": (t.get("quote") or "")[:300],
            "consultado": "2026-10-07",
            "status": t["status"],
            "nota": (t.get("nota") or "")[:400],
            "topico": t["topico"],
        }
    js = "/* Gerado por tools/build_fontes.py a partir de research/claims_verified.json. Não edite à mão. */\n"
    js += "VL.dado('fontes', " + json.dumps({"gerado": hoje, "fatos": fatos}, ensure_ascii=False, separators=(",", ":")) + ");\n"
    with open(os.path.join(ROOT, "app", "data", "fontes.js"), "w", encoding="utf-8") as f:
        f.write(js)
    print(json.dumps({"fatos": len(todos), "confirmados": n_ok, "a_confirmar": len(todos) - n_ok,
                      "por_topico": {k: sum(1 for t in todos if t["topico"] == k) for k in TOPICOS}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
