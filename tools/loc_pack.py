#!/usr/bin/env python3
"""Pacote de evidência de locais: python3 tools/loc_pack.py <tópico> <de> <até>
Mostra cada local (campos principais) com o resultado da checagem automática de sites (research/_work/sitecheck.json)."""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")
t, de, ate = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
d = json.load(open(os.path.join(W, f"research_{t}.json")))
sc = json.load(open(os.path.join(W, "sitecheck.json"))) if os.path.exists(os.path.join(W, "sitecheck.json")) else {}
ls = (d.get("locais") or [])[de - 1: ate]
for l in ls:
    s = sc.get(l["id"], {})
    print("=" * 90)
    print(f"ID: {l['id']} | {l['nome']} | {l.get('cidade')}/{l.get('uf')} {l.get('pais')} | regiao={l.get('regiao')}")
    print(f"tipos={l.get('tipos')} cursos={l.get('cursos')}")
    print(f"pratica: {l.get('pratica','')[:200]}")
    print(f"coords=({l.get('lat')},{l.get('lon')}) precisao={l.get('coord_precisao')}")
    print(f"site={l.get('site')}  ->  {s.get('site_status')} {s.get('site_title')!r}")
    print(f"fonte_url={l.get('fonte_url')}  ->  {s.get('fonte_status')} {s.get('fonte_title')!r}")
    print(f"evidencia (pesquisador): {l.get('evidencia','')[:300]}")
    if l.get('preco'): print(f"preco: {l['preco']}")
    if l.get('notas'): print(f"notas: {l['notas'][:200]}")
print(f"{len(ls)} locais")
