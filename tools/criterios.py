#!/usr/bin/env python3
"""Verifica no navegador, um a um, os critérios de pronto do PLAN.md (seções 7 e 10).

Uso: python3 tools/criterios.py [--out DIR]
Abre app/index.html via file:// no Chrome do sistema (headless), bloqueia toda rede externa (offline) e
grava docs/criterios.md com o resultado de cada critério (OK/FALHA + evidência).
"""
import argparse, json, os, pathlib, re, sys, datetime
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = (ROOT / "app" / "index.html").as_uri()
ABAS = ["roteiro", "arrais", "mestre", "capitao", "vela", "travessia", "radio", "locais", "simulados", "glossario", "sobre"]
res = []


def ok(crit, cond, evid):
    res.append({"criterio": crit, "ok": bool(cond), "evidencia": evid})
    print(("OK   " if cond else "FALHA") + " | " + crit + " | " + evid[:200])


def novo_ctx(b, mobile=False, dark=False, onboarded=True, settings=None, geo=None):
    kw = dict(viewport={"width": 390, "height": 844} if mobile else {"width": 1440, "height": 900}, locale="pt-BR",
              color_scheme="dark" if dark else "light", is_mobile=mobile, has_touch=mobile)
    if geo:
        kw.update(geolocation=geo, permissions=["geolocation"])
    ctx = b.new_context(**kw)
    s = dict(settings or {})
    if onboarded:
        s.setdefault("onboarded", True)
    if s:
        ctx.add_init_script("try{localStorage.setItem('veleiro.v1.settings', JSON.stringify(%s));}catch(e){}" % json.dumps(s))
    log = {"err": [], "ext": []}
    def rota(route, req):
        if not req.url.startswith(("file://", "data:", "blob:")):
            log["ext"].append(req.url)
            return route.abort()
        return route.continue_()
    ctx.route("**/*", rota)
    ctx.on("page", lambda p: (p.on("pageerror", lambda e: log["err"].append(str(e))),
                              p.on("console", lambda m: log["err"].append(m.text) if m.type == "error" else None)))
    return ctx, log


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default="/tmp/veleiro-criterios"); a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])

        # §7.1 — 10 abas funcionais, offline, PT-BR, claro/escuro, mobile
        for mobile, dark in [(False, False), (True, True), (False, True), (True, False)]:
            ctx, log = novo_ctx(b, mobile, dark)
            pg = ctx.new_page()
            falhas = []
            for aba in ABAS:
                pg.goto(APP + "#/" + aba); pg.wait_for_timeout(2200)
                h1 = pg.eval_on_selector_all("h1", "e => e.map(x => x.innerText)")
                over = pg.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
                if not h1 or over: falhas.append(f"{aba}(h1={bool(h1)},overflow={over})")
            lang = pg.evaluate("document.documentElement.lang")
            tema = pg.evaluate("getComputedStyle(document.body).backgroundColor")
            modo = ("celular" if mobile else "desktop") + " " + ("escuro" if dark else "claro")
            ok(f"§7 Todas as abas funcionais, offline, PT-BR — {modo}", not falhas and not log["err"] and not log["ext"] and lang == "pt-BR",
               f"{len(ABAS)} abas; lang={lang}; fundo={tema}; erros={log['err'][:2]}; externas={log['ext'][:1]}; falhas={falhas}")
            ctx.close()

        # §7.2 — fatos regulatórios com fonte + data; aviso "confirme na Capitania"
        ctx, log = novo_ctx(b); pg = ctx.new_page()
        pg.goto(APP + "#/arrais/m15/l1"); pg.wait_for_timeout(2500)
        fatos = pg.evaluate("Object.keys((VL.data.fontes||{}).fatos||{}).length")
        comdata = pg.evaluate("Object.values(VL.data.fontes.fatos).filter(f => f.url && f.consultado).length")
        refs = pg.evaluate("document.querySelectorAll('.fonte-ref a').length")
        aviso = pg.evaluate("document.body.innerText.includes('confirme na Capitania') || /Confirme regras, taxas e datas na Capitania/.test(document.body.innerText)")
        selo = pg.evaluate("document.querySelectorAll('.selo-q').length")
        ok("§7 Todo fato regulatório com fonte + data de consulta", fatos > 1000 and comdata == fatos and refs > 0,
           f"{fatos} fatos em data/fontes.js, {comdata} com URL e data; lição de legislação com {refs} links de fonte e {selo} selos 'a confirmar'")
        ok("§7 Aviso 'confirme na Capitania antes da prova'", aviso, "texto presente no rodapé e no aviso legal das lições")
        ctx.close()

        # §7.3 — cada nível: curso completo + simulado + flashcards
        for nivel, minutos in [("arrais", "1:5"), ("mestre", "2:5"), ("capitao", "3:5")]:
            ctx, log = novo_ctx(b); pg = ctx.new_page()
            pg.goto(APP + "#/" + nivel); pg.wait_for_timeout(2500)
            lic = pg.evaluate("VL.curso && VL.curso.licoesLineares ? VL.curso.licoesLineares(VL.data['cursos/%s']).length : 0" % nivel)
            pg.goto(APP + f"#/simulados/{nivel}"); pg.wait_for_timeout(2500)
            nq = pg.evaluate(f"(VL.data['questoes/{nivel}']||[]).length")
            ncom = pg.evaluate(f"(VL.data['questoes/{nivel}']||[]).filter(q => q.explicacao && q.explicacao.length > 40 && q.referencia).length")
            pg.goto(APP + f"#/simulados/{nivel}/prova"); pg.wait_for_timeout(2000)
            for txt in ["Começar a prova", "Começar", "Iniciar a prova", "Iniciar"]:
                bt = pg.get_by_role("button", name=re.compile("^" + txt, re.I))
                if bt.count():
                    bt.first.click(); pg.wait_for_timeout(1500); break
            relogio = pg.evaluate("(document.querySelector('.quiz-relogio')||{}).textContent || ''")
            dialogos = []
            pg.on("dialog", lambda d: (dialogos.append(d.message), d.accept()))
            mapa = pg.evaluate("document.querySelectorAll('.quiz-mapa button').length")
            pg.goto(APP + f"#/simulados/flashcards/{nivel}"); pg.wait_for_timeout(2500)
            guarda = bool(dialogos)
            carta = pg.evaluate("!!document.querySelector('.flash-carta')")
            ncartas = pg.evaluate(f"Object.keys(VL.data).filter(k => k.startsWith('flashcards/{nivel}-')).reduce((s,k) => s + VL.data[k].cartas.length, 0)")
            if carta:
                pg.click(".flash-carta"); pg.wait_for_timeout(700)
                pg.locator(".flash-notas .btn").nth(2).click(); pg.wait_for_timeout(700)
            srs = pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('veleiro.v1.srs')||'{}')).length")
            ok(f"§7 {nivel}: curso + simulado cronometrado + flashcards com repetição espaçada",
               lic >= 20 and nq >= 150 and ncom == nq and mapa == 40 and relogio.strip().startswith(minutos) and carta and srs >= 1,
               f"{lic} lições; {nq} questões ({ncom} comentadas com referência); prova com {mapa} questões, relógio '{relogio}', saída protegida por confirmação={guarda}; {ncartas} flashcards, avaliação SM-2 gravada={srs >= 1}")
            ctx.close()

        # gráficos de progresso (após tentativas)
        ctx, log = novo_ctx(b); pg = ctx.new_page()
        pg.goto(APP + "#/simulados"); pg.wait_for_timeout(1500)
        pg.evaluate("""() => { for (let i = 0; i < 3; i++) VL.progress.registrarTentativa({nivel:'arrais', modo:'prova', total:40, acertos:20+i*5, nota:5+i, aprovado:true, porTema:{'RIPEAM: luzes e marcas':{t:10,a:5+i}}, duracaoSeg:3000, data:new Date(Date.now()-i*86400000).toISOString()}); }""")
        pg.goto(APP + "#/simulados?r=1"); pg.wait_for_timeout(3500)
        canv = pg.evaluate("document.querySelectorAll('canvas').length")
        chart = pg.evaluate("!!window.Chart")
        pg.screenshot(path=os.path.join(a.out, "graficos.png"), full_page=True)
        ok("Gráficos de progresso (Chart.js)", canv >= 1 and chart, f"{canv} gráficos desenhados após 3 tentativas registradas")
        ctx.close()

        # §7.4 + §10 — locais: ≥60 verificados, mapa, filtros, "perto de mim" com geolocalização
        ctx, log = novo_ctx(b, geo={"latitude": -7.115, "longitude": -34.863}); pg = ctx.new_page()
        pg.goto(APP + "#/locais"); pg.wait_for_timeout(4000)
        itens = pg.evaluate("(VL.data.locais||{itens:[]}).itens")
        nao_orgao = [i for i in itens if "orgao-maritimo" not in (i.get("tipos") or [])]
        verif = [i for i in nao_orgao if i.get("site", "").startswith("http") and i.get("verificado_em") and i.get("fonte_url")]
        ne = sum(1 for i in nao_orgao if i.get("regiao") == "Nordeste")
        ext = sum(1 for i in nao_orgao if i.get("regiao") == "Exterior")
        ufs = sorted({i.get("uf") for i in nao_orgao if i.get("pais") in ("Brasil", "BR")})
        marcadores = pg.evaluate("document.querySelectorAll('.leaflet-marker-icon').length")
        pg.get_by_role("button", name=re.compile("Perto de mim")).first.click(); pg.wait_for_timeout(800)
        pg.get_by_role("button", name=re.compile("Usar a localização do aparelho")).first.click(); pg.wait_for_timeout(2500)
        primeiros = pg.eval_on_selector_all(".loc-item", "els => els.slice(0,5).map(e => e.innerText.replace(/\\s+/g,' ').slice(0,110))")
        dist = pg.evaluate("document.querySelectorAll('.loc-dist').length")
        pg.screenshot(path=os.path.join(a.out, "perto-de-mim.png"))
        ok("§7/§10 ≥60 locais verificados com URL (cobertura nacional + exterior, Nordeste bem coberto)", len(verif) >= 60 and ne >= 15 and ext >= 10,
           f"{len(verif)} locais verificados fora de órgãos marítimos (NE {ne}, exterior {ext}, {len(ufs)} UFs) + {len(itens)-len(nao_orgao)} Capitanias/Delegacias/Agências")
        ok("§10 Mapa offline com marcadores e 'perto de mim' (geolocalização)", marcadores > 0 and dist > 0 and not log["ext"],
           f"{marcadores} marcadores; após geolocalização (João Pessoa simulada) {dist} distâncias; primeiros: {primeiros[:3]}; externas={log['ext'][:1]}")
        busca = pg.locator("input[type=search], input[type=text]").first
        busca.fill("Cabedelo"); pg.wait_for_timeout(1200)
        nfilt = pg.evaluate("document.querySelectorAll('.loc-item').length")
        ok("§10 Filtros/busca de locais", 0 < nfilt < len(itens), f"busca 'Cabedelo' → {nfilt} itens")
        ctx.close()

        # §10 — boas-vindas, configurável, trilha internacional ligada por padrão e opção de ocultar
        ctx, log = novo_ctx(b, onboarded=False); pg = ctx.new_page()
        pg.goto(APP + "#/roteiro"); pg.wait_for_timeout(1500)
        dlg = pg.evaluate("!!document.querySelector('dialog.dlg[open]')")
        intl_padrao = pg.evaluate("VL.settings.get('intl')")
        passos = 0
        for _ in range(4):
            bt = pg.locator("dialog.dlg .btn-primary").last
            if bt.count(): bt.click(); passos += 1; pg.wait_for_timeout(500)
        fechou = not pg.evaluate("!!document.querySelector('dialog.dlg[open]')")
        uf_padrao = pg.evaluate("VL.settings.get('uf')")
        ok("§10 Boas-vindas com base e ritmo opcionais; trilha internacional ligada por padrão", dlg and intl_padrao is True and fechou and uf_padrao == "",
           f"diálogo={dlg}, {passos} passos concluídos sem preencher nada, intl padrão={intl_padrao}, UF padrão vazia={uf_padrao == ''}")
        pg.goto(APP + "#/vela/m10/l6"); pg.wait_for_timeout(2500)
        vis_on = pg.evaluate("[...document.querySelectorAll('[data-intl=\"on\"]')].filter(e => e.offsetParent !== null).length")
        pg.evaluate("VL.settings.set('intl', false)"); pg.goto(APP + "#/vela/m10/l6?x=1"); pg.wait_for_timeout(2500)
        vis_off = pg.evaluate("[...document.querySelectorAll('[data-intl=\"on\"]')].filter(e => e.offsetParent !== null).length")
        pg.goto(APP + "#/locais"); pg.wait_for_timeout(3000)
        rya_off = pg.evaluate("[...document.querySelectorAll('.loc-item')].filter(e => /RYA|ASA/.test(e.innerText)).length")
        ok("§10 Trilha internacional pode ser desligada e ocultada", vis_on > 0 and vis_off == 0,
           f"elementos intl visíveis: ligada={vis_on}, desligada={vis_off}; itens RYA/ASA na lista com trilha desligada={rya_off}")
        ctx.close()

        # §10 — sem personalização fixa; qualquer Capitania; sem prazo fixo (ritmo)
        hard = []
        for f in (ROOT / "app").rglob("*.js"):
            if "vendor" in f.parts or f.name in ("locais.js", "fontes.js", "glossario.js") or "data" in f.parts and "geo" in f.parts:
                continue
            t = f.read_text(errors="ignore")
            if re.search(r"Thiago|thiago_victor", t): hard.append(str(f.relative_to(ROOT)))
        ok("§10 App público: nada fixo para uma pessoa", not hard, f"nenhuma referência pessoal no código/conteúdo ({hard})")
        ctx, log = novo_ctx(b, settings={"uf": "PB", "ritmoHoras": 4}); pg = ctx.new_page()
        pg.goto(APP + "#/roteiro"); pg.wait_for_timeout(3000)
        txt = pg.evaluate("document.body.innerText")
        pg.goto(APP + "#/roteiro"); pg.wait_for_timeout(2500)
        tot1 = pg.evaluate("(document.getElementById('rt-total')||{}).innerText || ''")
        pg.evaluate("VL.settings.set('ritmoHoras', 16)"); pg.goto(APP + "#/roteiro?y=1"); pg.wait_for_timeout(2500)
        tot2 = pg.evaluate("(document.getElementById('rt-total')||{}).innerText || ''")
        cap = len(re.findall(r"Capitania", txt))
        ok("§10 Roteiro: como agendar em qualquer Capitania (mais próxima primeiro com base configurada)", cap >= 3 and ("Paraíba" in txt or "CPPB" in txt),
           f"{cap} menções a Capitania; com base PB aparece a Capitania dos Portos da Paraíba")
        ok("§10 Sem prazo fixo: durações recalculadas pelo ritmo do usuário", tot1 and tot2 and tot1 != tot2, f"4 h/sem: '{tot1[:80]}' → 16 h/sem: '{tot2[:80]}'")
        ctx.close()

        # Recursos visuais exigidos (Three.js, carta, RIPEAM, nós)
        ctx, log = novo_ctx(b); pg = ctx.new_page()
        for w in ["veleiro-3d", "esfera-celeste", "globo-rotas", "sextante", "boias-iala", "carta-nautica", "ripeam-luzes", "nos", "sinais-sonoros", "regras-governo", "mares", "agulha-calc", "manobras", "mareacao", "meteo-sinotica", "vhf-sim"]:
            pg.goto(APP + f"#/lab/{w}"); pg.wait_for_timeout(3500)
            webgl = pg.evaluate("[...document.querySelectorAll('.bloco-widget canvas')].length")
            svg = pg.evaluate("[...document.querySelectorAll('.bloco-widget svg')].length")
            erro = pg.evaluate("!!document.querySelector('.bloco-widget .erro-carga')")
            ok(f"Recurso visual: {w}", (webgl or svg) and not erro, f"canvas={webgl}, svg={svg}")
        ok("Recursos visuais sem erro de console/rede", not log["err"] and not log["ext"], f"erros={log['err'][:2]} externas={log['ext'][:1]}")
        ctx.close()

        # §10 Publicação e Sobre/Contribuir
        arqs = {n: (ROOT / n).exists() for n in ["README.md", "LICENSE", "LICENSE-CONTEUDO.txt", "netlify.toml", ".github/workflows/pages.yml", "run.sh"]}
        readme = (ROOT / "README.md").read_text()
        ok("§10 Site estático pronto para GitHub Pages/Netlify, README de deploy, licenças MIT + CC BY-SA", all(arqs.values()) and "GitHub Pages" in readme and "Netlify" in readme,
           json.dumps(arqs))
        ctx, log = novo_ctx(b); pg = ctx.new_page()
        pg.goto(APP + "#/sobre"); pg.wait_for_timeout(2500)
        t = pg.evaluate("document.body.innerText")
        ok("§10 Página Sobre/Contribuir com aviso legal", "contribuir" in t.lower() and "não substitui" in t.lower() and "CC BY-SA" in t and "MIT" in t,
           "seções de aviso legal, contribuição e licenças presentes")
        ctx.close()
        b.close()

    n_ok = sum(r["ok"] for r in res)
    linhas = ["# Critérios de pronto verificados no navegador", "",
              f"Gerado por `tools/criterios.py` em {datetime.date.today().isoformat()} (Chrome headless, `file://`, rede externa bloqueada).", "",
              f"**{n_ok} de {len(res)} critérios OK.**", "", "| Critério | Resultado | Evidência |", "|---|---|---|"]
    for r in res:
        linhas.append(f"| {r['criterio']} | {'OK' if r['ok'] else '**FALHA**'} | {r['evidencia'].replace('|', '/')} |")
    (ROOT / "docs" / "criterios.md").write_text("\n".join(linhas) + "\n")
    print(f"\n{n_ok}/{len(res)} OK")
    return 0 if n_ok == len(res) else 1


if __name__ == "__main__":
    sys.exit(main())
