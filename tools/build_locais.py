#!/usr/bin/env python3
"""Gera app/data/locais.json e app/data/locais.js a partir dos locais pesquisados e verificados.

Entrada: research/_work/research_<chave>.json (campo "locais") e research/_work/verify_<chave>_loc<n>.json.
Regra: entra só o local com veredito independente "ok" ou "corrigir" (com as correções aplicadas).
"remover" ou sem veredito → fica de fora e é listado em research/locais_descartados.md.
Ajustes manuais: research/locais_manuais.json ({"adicionar": [...itens já verificados...], "remover": [ids]}).
"""
import glob, json, os, re
from datetime import date
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")
CAMPOS = ["id", "nome", "tipos", "cursos", "pratica", "cidade", "uf", "regiao", "pais", "lat", "lon", "coord_precisao",
          "site", "contato", "preco", "fonte_url", "evidencia", "verificado_em", "notas"]


def carregar(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def chave_dup(l):
    # Órgãos da Marinha (CP/CF/DL/AG) compartilham o domínio marinha.mil.br e o início do nome:
    # cada um é um local distinto, então a chave é o próprio id.
    if "orgao-maritimo" in (l.get("tipos") or []):
        return "om|" + str(l.get("id"))
    host = urlparse(l.get("site") or "").netloc.replace("www.", "").lower()
    nome = re.sub(r"[^a-z0-9]", "", (l.get("nome") or "").lower())
    return host + "|" + nome[:18]


def main():
    hoje = date.today().isoformat()
    aceitos, descartados, vistos = [], [], {}
    for rp in sorted(glob.glob(os.path.join(W, "research_*.json"))):
        key = re.search(r"research_(.+)\.json$", rp).group(1)
        res = carregar(rp)
        locais = res.get("locais") or []
        if not locais:
            continue
        vereditos = {}
        for vp in glob.glob(os.path.join(W, f"verify_{key}_loc*.json")):
            for v in carregar(vp).get("verdicts", []):
                vereditos[v["id"]] = v
        for l in locais:
            v = vereditos.get(l["id"])
            if not v or v["verdict"] == "remover":
                descartados.append((key, l, v))
                continue
            item = {k: l.get(k) for k in CAMPOS}
            if v["verdict"] == "corrigir":
                for k, val in (v.get("corrected_fields") or {}).items():
                    if k in CAMPOS:
                        item[k] = val
            item["verificacao"] = v.get("notes", "")[:300]
            item["origem"] = key
            dk = chave_dup(item)
            if dk in vistos:
                # mescla tipos/cursos do duplicado
                antigo = vistos[dk]
                antigo["tipos"] = sorted(set((antigo.get("tipos") or []) + (item.get("tipos") or [])))
                antigo["cursos"] = list(dict.fromkeys((antigo.get("cursos") or []) + (item.get("cursos") or [])))
                continue
            vistos[dk] = item
            aceitos.append(item)
    mp = os.path.join(ROOT, "research", "locais_manuais.json")
    if os.path.exists(mp):
        man = carregar(mp)
        rem = set(man.get("remover", []))
        aceitos = [a for a in aceitos if a["id"] not in rem]
        aceitos += man.get("adicionar", [])
    # Coordenadas aproximadas (centro do município) para locais físicos que a pesquisa deixou "sem-mapa".
    # Só vale quando lat/lon vieram vazias; ver research/locais_coords.json.
    cp = os.path.join(ROOT, "research", "locais_coords.json")
    if os.path.exists(cp):
        for lid, c in carregar(cp).items():
            if lid.startswith("_"):
                continue
            for a in aceitos:
                if a["id"] == lid and a.get("lat") in (None, ""):
                    a["lat"], a["lon"], a["coord_precisao"] = c["lat"], c["lon"], c.get("coord_precisao", "aprox-cidade")
    ids = {}
    for a in aceitos:
        if a["id"] in ids:
            a["id"] = a["id"] + "-" + str(len(ids))
        ids[a["id"]] = 1
    saida = {"gerado": hoje, "itens": aceitos}
    with open(os.path.join(ROOT, "app", "data", "locais.json"), "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)
    with open(os.path.join(ROOT, "app", "data", "locais.js"), "w", encoding="utf-8") as f:
        f.write("/* Gerado por tools/build_locais.py a partir de research/. Edite app/data/locais.json via pesquisa verificada. */\n")
        f.write("VL.dado('locais', " + json.dumps(saida, ensure_ascii=False, separators=(",", ":")) + ");\n")
    with open(os.path.join(ROOT, "research", "locais_descartados.md"), "w", encoding="utf-8") as f:
        f.write("# Locais descartados na verificação\n\nGerado por `tools/build_locais.py`. Motivo = nota do verificador independente.\n\n")
        for key, l, v in descartados:
            f.write(f"- **{l.get('nome')}** ({l.get('cidade')}/{l.get('uf')}, {key}) — {l.get('site')} — "
                    f"{'sem veredito' if not v else v['verdict'] + ': ' + (v.get('notes') or '')[:240]}\n")
    por_regiao, por_tipo = {}, {}
    for a in aceitos:
        por_regiao[a.get("regiao")] = por_regiao.get(a.get("regiao"), 0) + 1
        for t in a.get("tipos") or []:
            por_tipo[t] = por_tipo.get(t, 0) + 1
    nao_orgao = sum(1 for a in aceitos if "orgao-maritimo" not in (a.get("tipos") or []))
    print(json.dumps({"aceitos": len(aceitos), "sem_orgaos_maritimos": nao_orgao, "descartados": len(descartados),
                      "por_regiao": por_regiao, "por_tipo": por_tipo}, ensure_ascii=False))


if __name__ == "__main__":
    main()
