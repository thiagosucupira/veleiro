#!/usr/bin/env python3
"""Gera app/data/flashcards/indice.js listando todos os baralhos de app/data/flashcards/*.js.

Cada baralho chama VL.dado('flashcards/<arquivo>', {id, titulo, nivel, cartas}). O índice permite à aba
Simulados listar e juntar baralhos por nível sem ler o diretório (impossível em file://).
"""
import json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "app", "data", "flashcards")
NODE = r"""
const fs=require('fs');const out=[];global.VL={dado:(n,v)=>{out.push({n,v});return v}};
for(const f of process.argv.slice(1)){try{eval(fs.readFileSync(f,'utf8'))}catch(e){console.error(f,e.message)}}
console.log(JSON.stringify(out.map(o=>({nome:o.n,id:o.v.id,titulo:o.v.titulo,nivel:o.v.nivel,n:(o.v.cartas||[]).length}))));
"""
ORDEM = ["arrais", "mestre", "capitao", "vela", "travessia", "radio"]


def main():
    arqs = sorted(os.path.join(D, f) for f in os.listdir(D) if f.endswith(".js") and f != "indice.js")
    res = json.loads(subprocess.run(["node", "-e", NODE] + arqs, capture_output=True, text=True, check=True).stdout)
    decks = []
    for r in res:
        t = r["titulo"] or r["id"]
        m = re.match(r"^([a-zç]+)(?:-(\d+))?\s*:\s*(.*)$", t, re.I)
        if m and not t[:1].isupper():
            nomes = {"arrais": "Arrais", "mestre": "Mestre", "capitao": "Capitão", "capitão": "Capitão", "vela": "Vela", "travessia": "Travessia", "radio": "Rádio", "rádio": "Rádio"}
            parte = r["id"].split("-")[-1] if "-" in r["id"] else ""
            t = nomes.get(m.group(1).lower(), m.group(1).capitalize()) + (" " + parte if parte.isdigit() else "") + ": " + m.group(3)
        # título já com inicial maiúscula mas sem o número do baralho ("Mestre: ..."): insere o número do id (mestre-2 -> "Mestre 2: ...")
        m2 = re.match(r"^(Arrais|Mestre|Capitão|Vela|Travessia|Rádio)\s*:\s*(.*)$", t)
        parte2 = r["id"].split("-")[-1] if "-" in r["id"] else ""
        if m2 and parte2.isdigit():
            t = m2.group(1) + " " + parte2 + ": " + m2.group(2)
        decks.append({"id": r["id"], "titulo": t, "nivel": r["nivel"], "arquivo": r["nome"], "cartas": r["n"]})
    decks.sort(key=lambda d: (ORDEM.index(d["nivel"]) if d["nivel"] in ORDEM else 99, d["arquivo"]))
    with open(os.path.join(D, "indice.js"), "w", encoding="utf-8") as f:
        f.write("/* Gerado por tools/build_indice.py. Não edite à mão. */\n")
        f.write("VL.dado('flashcards/indice', " + json.dumps({"decks": decks}, ensure_ascii=False, indent=1) + ");\n")
    print(json.dumps({"baralhos": len(decks), "cartas": sum(d["cartas"] for d in decks),
                      "por_nivel": {n: sum(d["cartas"] for d in decks if d["nivel"] == n) for n in ORDEM}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
