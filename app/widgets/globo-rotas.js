/* Widget "globo-rotas" — globo da Terra em 3D (Three.js) para comparar a ortodrômica (arco de
   círculo máximo, o caminho mais curto) com a loxodrômica (rumo constante) em travessias reais.
   Continentes desenhados a partir do Natural Earth 1:110m, graticulado de 10° e 30°, Equador e
   trópicos, nomes de águas em itálico, barquinhos que navegam as duas derrotas na mesma
   velocidade, camada esquemática de ventos (alísios, ventos de oeste, ZCIT) e modo desafio.

   opts (todas opcionais):
     preset:   'rio-cabo'   travessia pronta (ids de VL.derrota.presets): salvador-mindelo, recife-noronha,
                            natal-mindelo, arc, mindelo-granada, rio-cabo, cabo-rio, retorno,
                            salvador-caribe, didatico-tasmania
     presets:  null         lista de ids que aparecem no seletor (padrão: todas)
     pontos:   null         derrota livre, substitui o preset: [{lat:-22.95, lon:-43.15, nome:'Rio'}, {lat, lon}, ...]
                            (graus decimais; S e W negativos)
     modo:     'explorar'   'explorar' | 'desafio'
     desafios: ['lado', 'vertice', 'rumo', 'economia']   tipos de pergunta do modo desafio
     ventos:   false        começa com a camada esquemática de ventos e ZCIT ligada
     vel:      6            velocidade média em nós (tempos e barquinhos), de 2 a 20
     animar:   false        começa a animação sozinho (nunca com prefers-reduced-motion)
     detalhe:  true         false = fica só na costa 1:110m (não carrega a 1:50m, com ilhas pequenas como Cabo Verde)
     titulo:   'Globo: ortodrômica e loxodrômica'

   Exemplos de bloco de lição:
     { t: 'widget', w: 'globo-rotas', opts: { preset: 'arc', ventos: true } }
     { t: 'widget', w: 'globo-rotas', opts: { modo: 'desafio', desafios: ['lado', 'vertice'] } }
     { t: 'widget', w: 'globo-rotas', opts: { pontos: [{ lat: -3.8, lon: -32.4, nome: 'Noronha' }, { lat: 14.1, lon: -61, nome: 'Santa Lúcia' }] } }

   Matemática: VL.derrota (widgets/derrota-calc.js): Terra esférica, 1′ de arco de círculo máximo =
   1 milha náutica; rumos verdadeiros. Bowditch, The American Practical Navigator (NGA Pub. 9),
   "The Sailings"; Miguens, Navegação: a Ciência e a Arte (DHN).
   Ventos: esquema da circulação geral média da atmosfera — NÃO serve para planejar.
   Movimento reduzido (prefers-reduced-motion): sem animação contínua nem voo de câmera; avanço manual por dia. */
(function () {
  'use strict';
  var h = VL.h;
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  var TROPICO = 23.436; // obliquidade média da eclíptica em 2026 (≈ 23° 26′)
  var TIPOS = ['lado', 'vertice', 'rumo', 'economia'];

  /* Nomes de águas (convenção da carta: itálico). tipo 'mar' só aparece com zoom. */
  var AGUAS = [
    { nome: 'Atlântico Norte', lat: 44, lon: -50, tipo: 'oceano' },
    { nome: 'Atlântico Sul', lat: -21, lon: -10, tipo: 'oceano' },
    { nome: 'Pacífico Norte', lat: 30, lon: -150, tipo: 'oceano' },
    { nome: 'Pacífico Sul', lat: -28, lon: -125, tipo: 'oceano' },
    { nome: 'Oceano Índico', lat: -22, lon: 78, tipo: 'oceano' },
    { nome: 'Oceano Austral', lat: -61, lon: -25, tipo: 'oceano' },
    { nome: 'Oceano Ártico', lat: 83, lon: -10, tipo: 'oceano' },
    { nome: 'Mar do Caribe', lat: 15.5, lon: -76, tipo: 'mar' },
    { nome: 'Golfo do México', lat: 25.2, lon: -90.5, tipo: 'mar' },
    { nome: 'Mar dos Sargaços', lat: 27, lon: -55, tipo: 'mar' },
    { nome: 'Mar Mediterrâneo', lat: 34.5, lon: 18, tipo: 'mar' },
    { nome: 'Golfo da Guiné', lat: 1.5, lon: 3, tipo: 'mar' },
    { nome: 'Mar do Norte', lat: 56, lon: 3, tipo: 'mar' },
    { nome: 'Mar Arábico', lat: 14, lon: 64, tipo: 'mar' },
    { nome: 'Baía de Bengala', lat: 14, lon: 88, tipo: 'mar' },
    { nome: 'Mar da Tasmânia', lat: -38, lon: 160, tipo: 'mar' },
  ];

  /* Camada de ventos: posições médias, esquemáticas. dir = para onde o vento sopra (azimute). */
  var SETAS = [
    { lats: [12, 19, 26], lon: [-62, -20], passo: 9, dir: 235 },   // alísios de nordeste (Atlântico)
    { lats: [-4, -11], lon: [-32, 6], passo: 9, dir: 305 },        // alísios de sudeste (Atlântico)
    { lats: [-18], lon: [-28, 6], passo: 9, dir: 300 },
    { lats: [12, 20], lon: [-178, -112], passo: 11, dir: 240 },    // Pacífico Norte
    { lats: [-6, -14], lon: [-150, -86], passo: 11, dir: 300 },    // Pacífico Sul
    { lats: [-12, -20], lon: [55, 105], passo: 10, dir: 290 },     // Índico
    { lats: [44, 52], lon: [-58, -14], passo: 11, dir: 70 },       // ventos de oeste, hemisfério norte
    { lats: [42, 50], lon: [160, 228], passo: 12, dir: 70 },
    { lats: [-42, -50], lon: [-180, 165], passo: 15, dir: 105 },   // ventos de oeste, hemisfério sul
  ];
  var ZCIT = [[-52, 12, 2, 8], [160, 280, 4, 10]]; // [lon0, lon1, lat0, lat1] (lon > 180 = além do antimeridiano)

  /* Áreas de oceano para pares aleatórios do desafio. */
  var CAIXAS = [
    { lat: [22, 48], lon: [-68, -14] }, { lat: [-48, -18], lon: [-42, 12] }, { lat: [-48, -20], lon: [45, 110] },
    { lat: [24, 48], lon: [152, 228] }, { lat: [-50, -20], lon: [-170, -86] },
  ];

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ------------------------------------------------------------------ montagem */
  function montar(el, opts, remontar) {
    var Dv = VL.derrota;
    function T(pt, en) { return Dv.intl(pt, en); }
    var reduzido = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var vivo = true;
    var offs = [];
    var timers = [];
    var listaPresets = Dv.presets.filter(function (p) { return !Array.isArray(opts.presets) || opts.presets.indexOf(p.id) >= 0; });
    if (!listaPresets.length) listaPresets = Dv.presets.slice();
    var tipos = (Array.isArray(opts.desafios) ? opts.desafios : TIPOS).filter(function (t) { return TIPOS.indexOf(t) >= 0; });
    if (!tipos.length) tipos = TIPOS.slice();

    var st = {
      modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
      rota: null, meta: {}, pendente: null,
      ventos: !!opts.ventos,
      vel: isFinite(opts.vel) && opts.vel >= 2 && opts.vel <= 20 ? Number(opts.vel) : 6,
      prog: 0, tocando: false, ultimoT: null, durAnim: 12,
      visivel: true, voo: null,
      vis: { orto: true, lox: true, vertice: true, barcos: true },
      desafio: null, placar: { certos: 0, total: 0 }, n: 0, fila: [], ultimaChave: null,
    };

    /* ---------- moldura e controles ---------- */
    var inst = VL.ui.instrumento({ titulo: opts.titulo || 'Globo: ortodrômica e loxodrômica', controlesAntes: true });
    el.appendChild(inst.raiz);

    function segmentado(rotulo, itens, atual, aoEscolher) {
      var nav = h('div', { class: 'segmented gr-seg', role: 'group', 'aria-label': rotulo });
      var bts = itens.map(function (it) {
        return h('button', { type: 'button', 'aria-pressed': String(it.id === atual), onclick: function () { escolher(it.id); aoEscolher(it.id); } }, it.rotulo);
      });
      bts.forEach(function (b) { nav.appendChild(b); });
      function escolher(id) { bts.forEach(function (b, i) { b.setAttribute('aria-pressed', String(itens[i].id === id)); }); }
      nav.escolher = escolher;
      return nav;
    }

    var segModo = segmentado('Modo', [{ id: 'explorar', rotulo: 'Explorar' }, { id: 'desafio', rotulo: 'Desafio' }], st.modo, trocarModo);
    var sel = h('select', { class: 'gr-sel', 'aria-label': 'Travessia' });
    listaPresets.forEach(function (p) { sel.appendChild(h('option', { value: p.id }, p.nome)); });
    sel.appendChild(h('option', { value: 'livre' }, 'Pontos livres (toque no globo)'));
    var campoSel = h('label', { class: 'gr-campo gr-campo-sel' }, h('span', { class: 'gr-rot-campo' }, 'Travessia'), sel);
    var swVentos = h('input', { type: 'checkbox', 'aria-describedby': null });
    swVentos.checked = st.ventos;
    var swRot = h('label', { class: 'switch gr-sw' }, swVentos, h('span', null, 'Ventos e ZCIT (esquema)'));
    inst.controles.appendChild(h('div', { class: 'gr-ctrl' }, segModo, campoSel, swRot));

    /* ---------- palco 3D ---------- */
    var cena = h('div', { class: 'cena-3d gr-cena', tabindex: '0', role: 'group', 'aria-roledescription': 'globo interativo',
      'aria-label': 'Globo da Terra. Arraste para girar; pinça, Ctrl com a roda do mouse ou os botões aproximam. Teclado: setas giram, + e − aproximam, Enter marca o ponto do centro.' });
    var btMais = h('button', { type: 'button', class: 'btn btn-icon gr-zb', 'aria-label': 'Aproximar', title: 'Aproximar' }, '+');
    var btMenos = h('button', { type: 'button', class: 'btn btn-icon gr-zb', 'aria-label': 'Afastar', title: 'Afastar' }, '−');
    var btCentro = h('button', { type: 'button', class: 'btn btn-icon gr-zb', 'aria-label': 'Centralizar a derrota', title: 'Centralizar a derrota' }, VL.icon('alvo', 18));
    var zoomBox = h('div', { class: 'gr-zoom' }, btMais, btMenos, btCentro);
    var aviso = h('div', { class: 'gr-aviso', 'aria-hidden': 'true' });
    var carregando = h('p', { class: 'gr-carregando', role: 'status' }, 'Carregando o globo…');
    var palco = h('div', { class: 'gr-palco' }, cena, zoomBox, aviso, carregando);
    inst.corpo.appendChild(palco);

    /* ---------- conteúdo abaixo do globo ---------- */
    var dica = h('p', { class: 'gr-dica', 'aria-live': 'polite' });
    var btPlay = h('button', { type: 'button', class: 'btn btn-primary gr-play' }, VL.icon('play', 18), h('span', null, 'Animar'));
    var btVolta = h('button', { type: 'button', class: 'btn btn-ghost gr-passo', 'aria-label': 'Voltar um dia' }, '−1 dia');
    var btAvanca = h('button', { type: 'button', class: 'btn btn-ghost gr-passo', 'aria-label': 'Avançar um dia' }, '+1 dia');
    var rng = h('input', { type: 'range', min: '0', max: '1000', step: '1', value: '0', class: 'gr-rng', 'aria-label': 'Posição dos barquinhos ao longo da travessia' });
    var velSel = h('select', { class: 'gr-sel gr-sel-vel' });
    var vels = [4, 5, 6, 7, 8, 10];
    if (vels.indexOf(st.vel) < 0) { vels.push(st.vel); vels.sort(function (a, b) { return a - b; }); }
    vels.forEach(function (v) { velSel.appendChild(h('option', { value: String(v) }, Dv.num(v, v % 1 ? 1 : 0) + ' nós')); });
    velSel.value = String(st.vel);
    var status = h('p', { class: 'gr-status' });
    var anuncio = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
    var legLinhas = h('p', { class: 'gr-leg-linhas' },
      h('span', { class: 'gr-leg-item' }, h('span', { class: 'gr-leg gr-leg-orto', 'aria-hidden': 'true' }), h('span', { class: 'gr-leg-t-orto' })), ' ',
      h('span', { class: 'gr-leg-item' }, h('span', { class: 'gr-leg gr-leg-lox', 'aria-hidden': 'true' }), h('span', { class: 'gr-leg-t-lox' })));
    var barra = h('div', { class: 'gr-anim' },
      h('div', { class: 'gr-anim-l' }, btPlay, btVolta, btAvanca, h('label', { class: 'gr-campo gr-campo-vel' }, h('span', { class: 'gr-rot-campo' }, 'Velocidade média'), velSel)),
      rng, status, anuncio);
    if (reduzido) {
      // movimento reduzido no aparelho: sem animação contínua, só o passo a passo manual
      btPlay.hidden = true;
      barra.insertBefore(h('p', { class: 'gr-obs' }, 'Movimento reduzido ligado no aparelho: avance os barquinhos com +1 dia, −1 dia ou o controle deslizante.'), barra.firstChild);
    }
    var legVentos = h('div', { class: 'gr-ventos-leg' });
    var painel = h('div', { class: 'gr-painel' });
    var fonte = h('p', { class: 'gr-fonte' });
    var conteudo = h('div', { class: 'gr-conteudo' }, dica, legLinhas, barra, legVentos, painel, fonte);
    inst.corpo.appendChild(conteudo);
    inst.legenda.appendChild(h('span', null, 'Terra: Natural Earth (1:110m; 1:50m com zoom) · esfera, 1′ = 1 milha · coordenadas aproximadas, só para estudo'));

    function textosFixos() {
      legLinhas.querySelector('.gr-leg-t-orto').textContent = T('Ortodrômica', 'great circle') + ': caminho mais curto';
      legLinhas.querySelector('.gr-leg-t-lox').textContent = T('Loxodrômica', 'rhumb line') + ': rumo constante';
      legVentos.innerHTML = '';
      legVentos.appendChild(h('p', null, h('strong', null, 'Esquemático: use Pilot Charts reais para planejar. '),
        'Setas = ' + T('alísios', 'trade winds') + ' e ' + T('ventos de oeste', 'westerlies') + ' médios; faixa hachurada = ' + T('ZCIT', 'ITCZ') +
        ' (Zona de Convergência Intertropical, calmarias e aguaceiros); A = alta subtropical. No Atlântico a ZCIT fica em média perto de 5° N e muda com a estação: mais ao sul no início do ano, mais ao norte em agosto e setembro.'));
      legVentos.appendChild(h('p', { class: 'gr-obs' }, 'Para planejar uma travessia, consulte as Pilot Charts (NGA), o Ocean Passages for the World (UKHO, NP 136) e a previsão meteorológica.'));
      legVentos.hidden = !st.ventos;
      fonte.textContent = 'Fórmulas: Bowditch, The American Practical Navigator (NGA Pub. 9), “The Sailings”; Miguens, Navegação: a Ciência e a Arte (DHN). Rumos verdadeiros (sem declinação magnética). Terra esférica: diferença em geral menor que 0,5% para o elipsoide WGS-84.';
    }
    textosFixos();

    /* ---------- rota ---------- */
    function calcRota(pontos) {
      var pernas = [], totO = 0, totL = 0;
      for (var i = 0; i < pontos.length - 1; i++) {
        var a = pontos[i], b = pontos[i + 1];
        var o = Dv.ortodromica(a, b), l = Dv.loxodromica(a, b, 'esfera');
        pernas.push({ a: a, b: b, o: o, l: l, iniO: totO, iniL: totL });
        totO += o.milhas; totL += l.milhas;
      }
      return { pontos: pontos, pernas: pernas, orto: totO, lox: totL };
    }
    function posAoLongo(rota, tipo, s) {
      var ps = rota.pernas;
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i], comp = tipo === 'orto' ? p.o.milhas : p.l.milhas, ini = tipo === 'orto' ? p.iniO : p.iniL;
        if (s <= ini + comp || i === ps.length - 1) {
          var f = comp > 0 ? clamp((s - ini) / comp, 0, 1) : 1;
          return tipo === 'orto' ? Dv.pontoOrto(p.a, p.b, f) : Dv.pontoLox(p.a, p.b, f);
        }
      }
      return ps[0].a;
    }

    function presetPorId(id) { return listaPresets.filter(function (p) { return p.id === id; })[0] || Dv.presets.filter(function (p) { return p.id === id; })[0]; }

    function definirRota(pontos, meta, op) {
      op = op || {};
      st.rota = calcRota(pontos);
      st.meta = meta || {};
      st.prog = 0; rng.value = '0';
      pararAnimacao();
      st.durAnim = clamp(st.rota.lox / st.vel / 24 * 0.6, 6, 18);
      if (g3) { construirRota(); if (!op.semVoar) voarPara(vistaDe(st.rota), op.instantaneo); pedirQuadro(); }
      if (cartaPlana) desenharCarta();
      if (st.modo === 'explorar') painelResultados();
      atualizarStatus(true);
    }
    function carregarPreset(id, op) {
      var pr = presetPorId(id) || listaPresets[0];
      st.pendente = null;
      sel.value = pr.id;
      definirRota(pr.pontos, { nome: pr.nome, nota: pr.nota, id: pr.id }, op);
      dica.textContent = st.modo !== 'explorar' ? '' : cartaPlana ? 'Escolha outra travessia na lista.' : 'Arraste para girar o globo. Toque no oceano para marcar outra partida e chegada.';
    }

    /* ---------- painel de resultados (explorar) ---------- */
    function ptHtml(p) { return '<span class="gr-nw">' + Dv.gm(p.lat, 'lat') + '</span> <span class="gr-nw">' + Dv.gm(p.lon, 'lon') + '</span>'; }
    function nomePonto(p) { return p.curto || p.nome || 'ponto'; }
    function card(classe, titulo, milhas, linhas, nota) {
      var dl = h('dl', { class: 'gr-kv' });
      linhas.forEach(function (x) { dl.appendChild(h('dt', null, x[0])); dl.appendChild(h('dd', { html: x[1] })); });
      return h('section', { class: 'gr-card ' + classe }, h('h4', null, titulo),
        h('p', { class: 'gr-big' }, Dv.num(milhas, milhas >= 100 ? 0 : 1), h('span', { class: 'gr-big-un' }, ' milhas')),
        nota ? h('p', { class: 'gr-card-nota' }, nota) : null, dl);
    }
    function painelResultados() {
      painel.innerHTML = '';
      if (st.modo !== 'explorar') return;
      if (st.pendente) {
        painel.appendChild(h('p', { class: 'gr-msg' }, 'Partida marcada em ', h('b', { html: ptHtml(st.pendente) }), '. Toque no globo para marcar a chegada.'));
        return;
      }
      var r = st.rota; if (!r) return;
      var multi = r.pernas.length > 1, p0 = r.pernas[0], pN = r.pernas[r.pernas.length - 1];
      var tit = st.meta.nome || (nomePonto(r.pontos[0]) + ' – ' + nomePonto(r.pontos[r.pontos.length - 1]));
      painel.appendChild(h('h3', { class: 'gr-tit' }, tit));
      if (st.meta.livre) painel.appendChild(h('p', { class: 'gr-obs', html: 'Partida ' + ptHtml(p0.a) + ' · chegada ' + ptHtml(pN.b) }));
      var vtx = [];
      r.pernas.forEach(function (p) { if (p.o.vertice && p.o.vertice.naDerrota && Dv.milhasEntre(p.o.vertice, p.a) > 1 && Dv.milhasEntre(p.o.vertice, p.b) > 1) vtx.push(p); });
      var vtxTxt;
      if (vtx.length) vtxTxt = vtx.map(function (p) { return (multi ? nomePonto(p.a) + ' – ' + nomePonto(p.b) + ': ' : '') + ptHtml(p.o.vertice); }).join('<br>');
      else if (!multi && p0.o.equador) vtxTxt = 'sem vértice (Equador)';
      else vtxTxt = multi ? 'fora das pernas' : 'fora do trecho';
      // em travessias com várias pernas, os rumos mostrados são os da maior perna
      var pm = p0;
      r.pernas.forEach(function (p) { if (p.o.milhas > pm.o.milhas) pm = p; });
      var notaPerna = multi ? 'Total de ' + r.pernas.length + ' pernas. Rumos da maior: ' + nomePonto(pm.a) + ' – ' + nomePonto(pm.b) + '.' : null;
      var tempoRot = 'Tempo a ' + Dv.num(st.vel, st.vel % 1 ? 1 : 0) + ' nós';
      var linhasO = [], linhasL = [];
      linhasO.push(['Rumo inicial', Dv.fmtRumo(pm.o.rumoInicial) + ' <span class="gr-q">' + Dv.quadrantal(pm.o.rumoInicial) + '</span>']);
      linhasO.push(['Rumo final', Dv.fmtRumo(pm.o.rumoFinal)]);
      linhasO.push([T('Vértice', 'vertex'), vtxTxt]);
      linhasO.push([tempoRot, Dv.fmtDuracao(r.orto / st.vel)]);
      linhasL.push(['Rumo constante', Dv.fmtRumo(pm.l.rumo) + ' <span class="gr-q">' + Dv.quadrantal(pm.l.rumo) + '</span>']);
      linhasL.push([tempoRot, Dv.fmtDuracao(r.lox / st.vel)]);
      var grade = h('div', { class: 'gr-res' });
      grade.appendChild(card('gr-card-orto', T('Ortodrômica', 'great circle'), r.orto, linhasO, notaPerna));
      grade.appendChild(card('gr-card-lox', T('Loxodrômica', 'rhumb line'), r.lox, linhasL, notaPerna));
      painel.appendChild(grade);
      var dif = r.lox - r.orto, pct = r.orto > 0 ? dif / r.orto * 100 : 0, txt;
      if (dif < 0.05) txt = 'As duas derrotas têm praticamente a mesma distância (diferença menor que 0,1 milha).';
      else txt = 'A loxodrômica é <b>' + Dv.num(dif, dif < 10 ? 1 : 0) + ' milhas mais longa</b> (' + Dv.num(pct, pct < 1 ? 2 : 1) + '%): cerca de ' + Dv.fmtDuracao(dif / st.vel) + ' a mais a ' + Dv.num(st.vel, st.vel % 1 ? 1 : 0) + ' nós.';
      painel.appendChild(h('p', { class: 'gr-resumo', html: txt }));
      if (st.meta.nota) painel.appendChild(h('p', { class: 'gr-nota' }, st.meta.nota));
      // derrota livre: avisa se passa por terra
      if (st.meta.livre) {
        var t = Dv.cruzaTerra(p0.a, p0.b, 'orto'), tl = Dv.cruzaTerra(p0.a, p0.b, 'lox');
        var emTerra = [p0.a, p0.b].filter(function (p) { return Dv.naTerra(p.lat, p.lon); }).length;
        if (emTerra || t > 0 || tl > 0) {
          painel.appendChild(VL.ui.callout('seguranca', 'A derrota passa por terra',
            (emTerra ? 'Um dos pontos parece estar em terra. ' : '') + ((t > 0 || tl > 0) ? 'Pelo menos uma das linhas corta terra (na escala deste mapa). ' : '') +
            'No planejamento real, divida a travessia com pontos ao largo das costas e confira na carta náutica.'));
        }
      }
      if (multi) {
        var tb = h('tbody');
        r.pernas.forEach(function (p, i) {
          tb.appendChild(h('tr', null, h('td', null, (i + 1) + '. ' + nomePonto(p.a) + ' – ' + nomePonto(p.b)),
            h('td', null, Dv.num(p.o.milhas, p.o.milhas >= 100 ? 0 : 1)), h('td', null, Dv.fmtRumo(p.o.rumoInicial, 0)),
            h('td', null, Dv.num(p.l.milhas, p.l.milhas >= 100 ? 0 : 1)), h('td', null, Dv.fmtRumo(p.l.rumo, 0))));
        });
        tb.appendChild(h('tr', { class: 'gr-tot' }, h('td', null, 'Total'), h('td', null, Dv.num(r.orto, 0)), h('td', null, ''), h('td', null, Dv.num(r.lox, 0)), h('td', null, '')));
        painel.appendChild(h('details', { class: 'gr-det' }, h('summary', null, 'Pernas da travessia (' + r.pernas.length + ')'),
          h('div', { class: 'table-wrap' }, h('table', { class: 'tabela gr-tab' },
            h('thead', null, h('tr', null, h('th', null, 'Perna'), h('th', null, 'Orto (M)'), h('th', null, 'Rumo inicial'), h('th', null, 'Loxo (M)'), h('th', null, 'Rumo'))), tb)),
          h('p', { class: 'gr-obs' }, 'Pontos “ao largo” e de afastamento existem para que nenhuma perna corte terra. M = milhas náuticas.')));
      }
    }

    /* ---------- animação dos barquinhos ---------- */
    function rotuloPlay(icone, txt) { btPlay.innerHTML = ''; btPlay.appendChild(VL.icon(icone, 18)); btPlay.appendChild(h('span', null, txt)); }
    function pararAnimacao() { st.tocando = false; st.ultimoT = null; rotuloPlay(st.prog >= 1 ? 'reiniciar' : 'play', st.prog >= 1 ? 'Repetir' : (st.prog > 0 ? 'Continuar' : 'Animar')); }
    function tocar() {
      if (!st.rota) return;
      if (st.prog >= 1) st.prog = 0;
      st.tocando = true; st.ultimoT = null;
      rotuloPlay('pausa', 'Pausar');
      pedirQuadro();
    }
    btPlay.addEventListener('click', function () { if (st.tocando) pararAnimacao(); else tocar(); });
    function passoDia(sinal) {
      if (!st.rota || st.rota.lox <= 0) return;
      pararAnimacao();
      st.prog = clamp(st.prog + sinal * 24 * st.vel / st.rota.lox, 0, 1);
      rng.value = String(Math.round(st.prog * 1000));
      pararAnimacao(); atualizarStatus(true); pedirQuadro();
    }
    btVolta.addEventListener('click', function () { passoDia(-1); });
    btAvanca.addEventListener('click', function () { passoDia(1); });
    rng.addEventListener('input', function () { st.prog = Number(rng.value) / 1000; pararAnimacao(); atualizarStatus(true); pedirQuadro(); });
    velSel.addEventListener('change', function () {
      var v = Number(velSel.value); if (!isFinite(v) || v <= 0) return;
      st.vel = v;
      if (st.rota) st.durAnim = clamp(st.rota.lox / st.vel / 24 * 0.6, 6, 18);
      atualizarStatus(true); painelResultados();
    });
    var ultimoStatus = '';
    function atualizarStatus(forcar) {
      barra.hidden = !st.rota || st.modo !== 'explorar' || !!cartaPlana; // sem WebGL não há barquinhos
      if (!st.rota) { status.textContent = ''; return; }
      var r = st.rota, sL = st.prog * r.lox, horas = sL / st.vel;
      var faltaO = Math.max(0, r.orto - sL), faltaL = Math.max(0, r.lox - sL);
      var partes = ['Tempo navegado: ' + Dv.fmtDuracao(horas)];
      partes.push(T('Ortodrômica', 'great circle').split(' (')[0] + ': ' + (faltaO <= 0.05 ? 'chegou em ' + Dv.fmtDuracao(r.orto / st.vel) : 'faltam ' + Dv.num(faltaO, faltaO < 100 ? 1 : 0) + ' M'));
      partes.push(T('Loxodrômica', 'rhumb line').split(' (')[0] + ': ' + (faltaL <= 0.05 ? 'chegou em ' + Dv.fmtDuracao(r.lox / st.vel) : 'faltam ' + Dv.num(faltaL, faltaL < 100 ? 1 : 0) + ' M'));
      var txt = partes.join(' · ');
      if (forcar || txt !== ultimoStatus) { status.textContent = txt; ultimoStatus = txt; }
    }

    /* ---------- desafio ---------- */
    function legsPresets() {
      var out = [];
      Dv.presets.forEach(function (pr) {
        for (var i = 0; i < pr.pontos.length - 1; i++) {
          var a = pr.pontos[i], b = pr.pontos[i + 1];
          if (Dv.milhasEntre(a, b) >= 250) out.push({ a: a, b: b, chave: pr.id + ':' + i });
        }
      });
      return out;
    }
    function minuto(x) { return Math.round(x * 60) / 60; }
    function parAleatorio(filtro) {
      for (var t = 0; t < 500; t++) {
        var c = CAIXAS[Math.floor(Math.random() * CAIXAS.length)];
        var a = { lat: minuto(rnd(c.lat[0], c.lat[1])), lon: minuto(Dv.norm180(rnd(c.lon[0], c.lon[1]))), curto: 'Ponto A' };
        var b = { lat: minuto(rnd(c.lat[0], c.lat[1])), lon: minuto(Dv.norm180(rnd(c.lon[0], c.lon[1]))), curto: 'Ponto B' };
        var d = Dv.milhasEntre(a, b);
        if (d < 900 || d > 4200) continue;
        if (Dv.naTerra(a.lat, a.lon) || Dv.naTerra(b.lat, b.lon)) continue;
        var o = Dv.ortodromica(a, b), l = Dv.loxodromica(a, b, 'esfera');
        if (filtro(a, b, o, l)) return { a: a, b: b, o: o, l: l, chave: 'aleat' + t + ':' + Math.random() };
      }
      return null;
    }
    var FILTROS = {
      lado: function (a, b, o, l) { return a.lat * b.lat > 0 && Math.min(Math.abs(a.lat), Math.abs(b.lat)) >= 10 && Math.abs(o.dlon) >= 20 && l.milhas - o.milhas >= 5; },
      vertice: function (a, b, o) {
        var v = o.vertice; if (!v || !v.naDerrota) return false;
        var f = v.milhasDaPartida / o.milhas;
        return f > 0.15 && f < 0.85 && Math.abs(v.lat) - Math.max(Math.abs(a.lat), Math.abs(b.lat)) >= 0.8 && a.lat * b.lat > 0;
      },
      rumo: function (a, b, o, l) { return Math.abs(Dv.norm180(o.rumoInicial - l.rumo)) >= 4 && Math.abs(Dv.norm180(o.rumoFinal - l.rumo)) >= 4 && Math.abs(Dv.norm180(o.rumoInicial - o.rumoFinal)) >= 8; },
      economia: function (a, b, o, l) { return l.milhas - o.milhas >= 8; },
    };
    function sortearPar(tipo) {
      var cand = legsPresets().filter(function (x) {
        if (x.chave === st.ultimaChave) return false;
        var o = Dv.ortodromica(x.a, x.b), l = Dv.loxodromica(x.a, x.b, 'esfera');
        x.o = o; x.l = l;
        return FILTROS[tipo](x.a, x.b, o, l);
      });
      var par = null;
      if (cand.length && Math.random() < 0.55) par = cand[Math.floor(Math.random() * cand.length)];
      if (!par) par = parAleatorio(FILTROS[tipo]);
      if (!par && cand.length) par = cand[Math.floor(Math.random() * cand.length)];
      if (!par) { var pr = Dv.presets.filter(function (p) { return p.id === 'rio-cabo'; })[0]; par = { a: pr.pontos[0], b: pr.pontos[1], chave: 'rio' }; par.o = Dv.ortodromica(par.a, par.b); par.l = Dv.loxodromica(par.a, par.b, 'esfera'); }
      st.ultimaChave = par.chave;
      return par;
    }
    function nomeQ(p) { return '<b>' + VL.esc(p.curto || 'ponto') + '</b>'; }
    function trecho(a, b) { return '<span class="gr-trecho">Partida: ' + nomeQ(a) + ' · chegada: ' + nomeQ(b) + '</span>'; }
    function gerarPergunta(tipo) {
      var par = sortearPar(tipo), a = par.a, b = par.b, o = par.o, l = par.l;
      var q = { tipo: tipo, a: a, b: b, o: o, l: l };
      var dif = l.milhas - o.milhas, pct = dif / o.milhas * 100;
      var ref = 'Bowditch, Pub. 9, “The Sailings”; Miguens, Navegação: a Ciência e a Arte (DHN).';
      if (tipo === 'lado') {
        var norte = a.lat > 0;
        q.vis = { orto: false, lox: true, vertice: false, barcos: false };
        q.enunciado = trecho(a, b) + 'A linha tracejada é a ' + T('loxodrômica', 'rhumb line') + ', de rumo constante. Por onde passa a ' + T('ortodrômica', 'great circle') + ', o caminho mais curto?';
        q.alternativas = ['Ao norte da loxodrômica (do lado do polo Norte)', 'Ao sul da loxodrômica (do lado do polo Sul)', 'Exatamente por cima: as duas são a mesma linha'];
        q.correta = norte ? 0 : 1;
        q.explica = 'Com os dois pontos no hemisfério ' + (norte ? 'norte' : 'sul') + ', a ortodrômica se curva para o lado do polo ' + (norte ? 'Norte' : 'Sul') +
          ': ela corta caminho por latitudes mais altas, onde os meridianos estão mais próximos. Aqui ela é ' + Dv.num(dif, dif < 10 ? 1 : 0) + ' milhas mais curta (' + Dv.num(pct, 1) + '%). Na carta de Mercator, a ortodrômica aparece como uma curva voltada para o polo e a loxodrômica como reta.';
      } else if (tipo === 'vertice') {
        q.vis = { orto: true, lox: false, vertice: false, barcos: false };
        q.enunciado = trecho(a, b) + 'A linha magenta é a ' + T('ortodrômica', 'great circle') + '. Toque no globo onde fica o ' + T('vértice', 'vertex') + ': o ponto da derrota mais perto do polo.';
        q.toque = true;
        var v = o.vertice;
        q.tol = Math.max(150, o.milhas * 0.06);
        q.explica = function (palpite) {
          var d = Dv.milhasEntre(palpite, v);
          return 'Seu palpite ficou a ' + Dv.num(d, 0) + ' milhas do vértice (tolerância: ' + Dv.num(q.tol, 0) + ' milhas). O vértice está em ' + ptHtml(v) +
            ', a ' + Dv.num(v.milhasDaPartida, 0) + ' milhas da partida. Ali a derrota corre exatamente leste–oeste (rumo 090° ou 270°) e a latitude é a mais alta do caminho: cos φ<sub>v</sub> = cos φ<sub>1</sub> · |sen R<sub>i</sub>|.';
        };
      } else if (tipo === 'rumo') {
        q.vis = { orto: true, lox: true, vertice: false, barcos: false };
        q.enunciado = trecho(a, b) + 'Qual é o rumo inicial da ' + T('ortodrômica', 'great circle') + ', a linha magenta?';
        var vals = [o.rumoInicial, l.rumo, o.rumoFinal, Dv.norm360(o.rumoInicial + 180)];
        var ordem = VL.embaralhar([0, 1, 2, 3]);
        q.alternativas = ordem.map(function (k) { return Dv.fmtRumo(vals[k], 0) + ' (' + Dv.quadrantal(vals[k], 0) + ')'; });
        q.correta = ordem.indexOf(0);
        var entre = Math.abs(Dv.norm180(l.rumo - o.rumoInicial)) + Math.abs(Dv.norm180(o.rumoFinal - l.rumo)) - Math.abs(Dv.norm180(o.rumoFinal - o.rumoInicial)) < 0.5;
        q.explica = 'A ortodrômica sai no rumo ' + Dv.fmtRumo(o.rumoInicial, 0) + ' e chega no rumo ' + Dv.fmtRumo(o.rumoFinal, 0) + ': o rumo muda ao longo de todo o caminho. A loxodrômica mantém ' + Dv.fmtRumo(l.rumo, 0) +
          ' do começo ao fim' + (entre ? ', um valor entre os dois' : '') + '. ' + Dv.fmtRumo(Dv.norm360(o.rumoInicial + 180), 0) + ' seria o rumo oposto (a recíproca do rumo inicial). Fórmula: tg R<sub>i</sub> = sen Δλ / (cos φ<sub>1</sub> · tg φ<sub>2</sub> − sen φ<sub>1</sub> · cos Δλ).';
      } else {
        q.vis = { orto: true, lox: true, vertice: false, barcos: false };
        q.enunciado = trecho(a, b) + 'A linha magenta é a ' + T('ortodrômica', 'great circle') + '; a tracejada, a ' + T('loxodrômica', 'rhumb line') + '. Quantas milhas a ortodrômica economiza?';
        var certo = Math.round(dif);
        var cands = [certo, Math.round(dif * 5), Math.max(1, Math.round(dif / 5))];
        if (cands[2] === certo || cands[2] < 3) cands[2] = Math.round(dif * 12);
        var textos = cands.map(function (x) { return 'Cerca de ' + Dv.num(x, 0) + ' milhas'; });
        textos.push('Nada: as duas têm a mesma distância');
        var ord = VL.embaralhar([0, 1, 2, 3]);
        q.alternativas = ord.map(function (k) { return textos[k]; });
        q.correta = ord.indexOf(0);
        q.explica = 'Ortodrômica: ' + Dv.num(o.milhas, 0) + ' milhas; loxodrômica: ' + Dv.num(l.milhas, 0) + ' milhas. Economia de ' + Dv.num(dif, 0) + ' milhas (' + Dv.num(pct, 1) + '%), cerca de ' + Dv.fmtDuracao(dif / st.vel) + ' a ' + Dv.num(st.vel, 0) +
          ' nós. A diferença cresce com a latitude e com a diferença de longitude; em rotas quase norte–sul ou perto do Equador ela é pequena.';
      }
      q.ref = ref;
      return q;
    }
    function proximoTipo() {
      if (!st.fila.length) st.fila = VL.embaralhar(tipos);
      return st.fila.shift();
    }
    function novaPergunta() {
      st.n++;
      var q = gerarPergunta(proximoTipo());
      st.desafio = q;
      st.vis = q.vis;
      removerPalpite();
      definirRota([q.a, q.b], { nome: 'Desafio' });
      painelDesafio();
    }
    function painelDesafio() {
      var q = st.desafio; painel.innerHTML = '';
      if (!q) return;
      painel.appendChild(h('p', { class: 'gr-placar' }, 'Pergunta ' + st.n + ' · acertos: ' + st.placar.certos + ' de ' + st.placar.total));
      painel.appendChild(h('p', { class: 'gr-enun', html: q.enunciado }));
      var fb = h('div', { class: 'gr-fb', 'aria-live': 'polite' });
      var btProx = h('button', { type: 'button', class: 'btn btn-quiet', onclick: novaPergunta }, q.respondido ? 'Próxima pergunta' : 'Pular');
      if (q.alternativas) {
        var ul = h('ul', { class: 'alternativas gr-alts' });
        var bts = q.alternativas.map(function (txt, i) {
          var b = h('button', { type: 'button', class: 'alternativa', 'aria-checked': 'false', role: 'radio' },
            h('span', { class: 'alternativa-letra', 'aria-hidden': 'true' }, 'ABCD'[i]), h('span', null, txt));
          b.addEventListener('click', function () { responder(i); });
          ul.appendChild(h('li', null, b));
          return b;
        });
        ul.setAttribute('role', 'radiogroup');
        ul.setAttribute('aria-label', 'Alternativas');
        painel.appendChild(ul);
        q.bts = bts;
      } else {
        var btConf = h('button', { type: 'button', class: 'btn btn-primary', disabled: !q.palpite, onclick: function () { conferirToque(); } }, 'Conferir');
        q.btConf = btConf;
        painel.appendChild(h('p', { class: 'gr-obs' }, 'Gire e aproxime o globo à vontade. Com o teclado: gire com as setas e marque o ponto do centro com Enter.'));
        painel.appendChild(h('div', { class: 'btn-row' }, btConf));
      }
      painel.appendChild(fb);
      painel.appendChild(h('div', { class: 'btn-row gr-prox' }, btProx));
      q.fb = fb; q.btProx = btProx;
    }
    function revelar() {
      st.vis = { orto: true, lox: true, vertice: true, barcos: false };
      if (g3) { construirRota(); pedirQuadro(); }
      if (cartaPlana) desenharCarta();
    }
    function feedback(q, ok, html) {
      q.respondido = true;
      st.placar.total++; if (ok) st.placar.certos++;
      q.fb.setAttribute('data-ok', ok ? '1' : '0');
      q.fb.innerHTML = '';
      q.fb.appendChild(h('p', { class: 'gr-fb-tit' }, ok ? 'Correto.' : 'Ainda não.'));
      q.fb.appendChild(h('p', { html: html }));
      q.fb.appendChild(h('p', { class: 'gr-obs' }, 'Referência: ' + q.ref));
      q.btProx.textContent = 'Próxima pergunta';
      q.btProx.className = 'btn btn-primary';
      var placar = painel.querySelector('.gr-placar');
      if (placar) placar.textContent = 'Pergunta ' + st.n + ' · acertos: ' + st.placar.certos + ' de ' + st.placar.total;
      revelar();
    }
    function responder(i) {
      var q = st.desafio; if (!q || q.respondido) return;
      q.bts.forEach(function (b, k) {
        b.disabled = true;
        b.setAttribute('aria-checked', String(k === i));
        if (k === q.correta) b.setAttribute('data-res', 'certa');
        else if (k === i) b.setAttribute('data-res', 'errada');
      });
      feedback(q, i === q.correta, q.explica);
    }
    function conferirToque() {
      var q = st.desafio; if (!q || q.respondido || !q.palpite) return;
      var d = Dv.milhasEntre(q.palpite, q.o.vertice);
      if (q.btConf) q.btConf.disabled = true;
      feedback(q, d <= q.tol, q.explica(q.palpite));
    }

    /* ---------- modo ---------- */
    function trocarModo(m) {
      if (m === st.modo) return;
      st.modo = m;
      segModo.escolher(m);
      pararAnimacao();
      st.pendente = null;
      removerPalpite();
      var explorar = m === 'explorar';
      campoSel.hidden = !explorar; barra.hidden = !explorar; legLinhas.hidden = !explorar;
      legVentos.hidden = !st.ventos;
      if (explorar) {
        st.vis = { orto: true, lox: true, vertice: true, barcos: true };
        st.desafio = null;
        carregarPreset(sel.value === 'livre' ? (opts.preset || 'rio-cabo') : sel.value);
      } else {
        dica.textContent = '';
        novaPergunta();
      }
    }
    sel.addEventListener('change', function () {
      if (sel.value === 'livre') {
        st.pendente = null; st.rota = null; st.meta = { livre: true };
        if (g3) { construirRota(); pedirQuadro(); }
        painel.innerHTML = '';
        atualizarStatus(true);
        dica.textContent = 'Toque no oceano para marcar a partida. Depois, toque de novo para marcar a chegada.';
        return;
      }
      carregarPreset(sel.value);
    });
    swVentos.addEventListener('change', function () {
      st.ventos = swVentos.checked;
      legVentos.hidden = !st.ventos;
      if (g3) { ventosMesh.visible = st.ventos; pedirQuadro(); }
    });

    /* ---------- toque no globo ---------- */
    function aoTocar(p) {
      if (st.modo === 'desafio') {
        var q = st.desafio;
        if (q && q.toque && !q.respondido) { q.palpite = p; marcarPalpite(p); if (q.btConf) q.btConf.disabled = false; }
        return;
      }
      pararAnimacao();
      var terra = Dv.naTerra(p.lat, p.lon);
      if (!st.pendente) {
        st.pendente = { lat: p.lat, lon: p.lon, curto: 'Ponto A' };
        st.rota = null; st.meta = { livre: true };
        sel.value = 'livre';
        if (g3) { construirRota(); pedirQuadro(); }
        atualizarStatus(true);
        painelResultados();
        dica.textContent = 'Partida marcada. Agora toque no ponto de chegada.' + (terra ? ' Atenção: esse ponto parece estar em terra (na escala deste mapa).' : '');
      } else {
        var a = st.pendente, b = { lat: p.lat, lon: p.lon, curto: 'Ponto B' };
        var erro = Dv.validarPar(a, b);
        if (erro) { dica.textContent = erro; return; }
        st.pendente = null;
        definirRota([a, b], { nome: 'Derrota livre: ponto A – ponto B', livre: true });
        dica.textContent = (terra ? 'Atenção: a chegada parece estar em terra (na escala deste mapa). ' : '') + 'Toque de novo no globo para começar outra derrota.';
      }
    }

    /* =====================================================================================
       3D
       ===================================================================================== */
    var THREE = null, g3 = null, cartaPlana = null;
    var renderer, css, scene, camera, controls, globo, contorno, ventosMesh;
    var cvTerra, cvVentos, texTerra, texVentos, texTraco, matGlobo, matOrto, matLox, matGrat = {};
    var grpGrat, grpRota, malhasGrat = {}, linhasGrat = null, linhasRota = [];
    var rotulos = [], rotLinhas = [], barcoO = null, barcoL = null, palpiteObj = null;
    var raf = 0, ro = null, io = null, vigia = null, largura = 1, altura = 1, escalaAtual = 0;
    var tmpV, tmpV2, ray, ndc;
    var assinaturaTema = '', medidosAgora = false;

    function vec(lat, lon, r) {
      var f = lat * D2R, p = (lon + 180) * D2R, c = Math.cos(f);
      return new THREE.Vector3(-Math.cos(p) * c * r, Math.sin(f) * r, Math.sin(p) * c * r);
    }
    function latlonDe(v) {
      var l = v.length() || 1;
      var lat = Math.asin(clamp(v.y / l, -1, 1)) * R2D;
      var lon = Dv.norm180(Math.atan2(v.z, -v.x) * R2D - 180);
      return { lat: lat, lon: lon };
    }

    function cores() {
      var n = ['--sea-1', '--sea-2', '--sea-3', '--land', '--land-ink', '--ink', '--ink-2', '--ink-3', '--line', '--magenta', '--paper', '--surface'];
      var c = {};
      n.forEach(function (k) { c[k.slice(2)] = VL.cssVar(k) || '#888888'; });
      return c;
    }

    /* Caminhos da terra em coordenadas de textura equirretangular. */
    var cacheCaminhos = {}, usar50 = false, carregando50 = false;
    function fonteTerra() { return (usar50 && VL.geo.land50m) || VL.geo.land110m; }
    function caminhos(W, H) {
      var chave = W + (usar50 ? ':50' : ':110');
      if (cacheCaminhos[chave]) return cacheCaminhos[chave];
      // fill: terra; costa: linha de costa sem as bordas artificiais (antimeridiano e polo);
      // borda: só os anéis que encostam no antimeridiano (redesenhados deslocados de ±W)
      var fill = new Path2D(), costa = new Path2D(), borda = new Path2D();
      fonteTerra().features.forEach(function (ft) {
        var g = ft.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        polys.forEach(function (poly) {
          poly.forEach(function (ring) {
            var x0 = 999, x1 = -999;
            for (var j = 0; j < ring.length; j++) { if (ring[j][0] < x0) x0 = ring[j][0]; if (ring[j][0] > x1) x1 = ring[j][0]; }
            var naBorda = x0 < -177 || x1 > 177;
            for (var i = 0; i < ring.length; i++) {
              var x = (ring[i][0] + 180) / 360 * W, y = (90 - ring[i][1]) / 180 * H;
              if (i === 0) fill.moveTo(x, y); else fill.lineTo(x, y);
              var artificial = i > 0 && ((Math.abs(ring[i][0]) > 179.9 && Math.abs(ring[i - 1][0]) > 179.9) || (ring[i][1] < -89.9 && ring[i - 1][1] < -89.9) || Math.abs(ring[i][0] - ring[i - 1][0]) > 180);
              if (i === 0 || artificial) costa.moveTo(x, y); else costa.lineTo(x, y);
              if (naBorda) { if (i === 0 || artificial) borda.moveTo(x, y); else borda.lineTo(x, y); }
            }
            fill.closePath();
          });
        });
      });
      cacheCaminhos[chave] = { fill: fill, costa: costa, borda: borda };
      return cacheCaminhos[chave];
    }

    var cvHalo = null;
    // tela 2D na CPU: rasterizar caminhos longos (costa 1:50m) na GPU trava o processo gráfico em
    // aparelhos fracos; na CPU é previsível e o envio para a textura é uma cópia simples.
    function ctx2d(cv) { return cv.getContext('2d', { willReadFrequently: true }); }
    function desenharTerra(c) {
      var W = cvTerra.width, H = cvTerra.height, ctx = ctx2d(cvTerra), k = W / 4096;
      // faixa de água rasa junto à costa: suave, então vai numa tela de meia resolução (bem mais barato)
      var w2 = W / 2, h2 = H / 2;
      if (!cvHalo || cvHalo.width !== w2) { cvHalo = document.createElement('canvas'); cvHalo.width = w2; cvHalo.height = h2; }
      var hx = ctx2d(cvHalo), cmH = caminhos(w2, h2);
      hx.globalAlpha = 1; hx.fillStyle = c['sea-1']; hx.fillRect(0, 0, w2, h2);
      hx.lineJoin = 'round'; hx.lineCap = 'round';
      [[cmH.costa, 0], [cmH.borda, -w2], [cmH.borda, w2]].forEach(function (x) {
        hx.save(); hx.translate(x[1], 0);
        hx.strokeStyle = c['sea-2']; hx.lineWidth = 5.5 * k; hx.globalAlpha = 0.8; hx.stroke(x[0]);
        hx.strokeStyle = c['sea-3']; hx.lineWidth = 2 * k; hx.globalAlpha = 0.4; hx.stroke(x[0]);
        hx.restore();
      });
      ctx.globalAlpha = 1; ctx.imageSmoothingEnabled = true;
      ctx.drawImage(cvHalo, 0, 0, W, H);
      var cm = caminhos(W, H);
      ctx.fillStyle = c.land; ctx.fill(cm.fill, 'evenodd');
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = c['land-ink']; ctx.globalAlpha = 0.6; ctx.lineWidth = (usar50 ? 1.6 : 2.2) * k;
      [[cm.costa, 0], [cm.borda, -W], [cm.borda, W]].forEach(function (x) { ctx.save(); ctx.translate(x[1], 0); ctx.stroke(x[0]); ctx.restore(); });
      ctx.globalAlpha = 1;
    }

    function desenharVentos(c) {
      var W = cvVentos.width, H = cvVentos.height, ctx = ctx2d(cvVentos), k = W / 2048;
      ctx.clearRect(0, 0, W, H);
      function X(lon) { return (lon + 180) / 360 * W; }
      function Y(lat) { return (90 - lat) / 180 * H; }
      // ZCIT: faixa hachurada
      var retangulos = [];
      ZCIT.forEach(function (f) {
        var l0 = f[0], l1 = f[1];
        if (l1 > 180) { retangulos.push([l0, 180, f[2], f[3]]); retangulos.push([-180, l1 - 360, f[2], f[3]]); }
        else retangulos.push(f);
      });
      ctx.save();
      ctx.beginPath();
      retangulos.forEach(function (r) { ctx.rect(X(r[0]), Y(r[3]), X(r[1]) - X(r[0]), Y(r[2]) - Y(r[3])); });
      ctx.globalAlpha = 0.13; ctx.fillStyle = c['ink-2']; ctx.fill();
      ctx.clip();
      ctx.globalAlpha = 0.5; ctx.strokeStyle = c['ink-2']; ctx.lineWidth = 1.4 * k;
      ctx.beginPath();
      for (var x = -H; x < W; x += 7 * k) { ctx.moveTo(x, 0); ctx.lineTo(x + H, H); }
      ctx.stroke();
      ctx.restore();
      // setas
      ctx.strokeStyle = c['ink-2']; ctx.globalAlpha = 0.82; ctx.lineWidth = 2.2 * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      function ponto(lat, lon, e, n, kk) { return [X(lon + e * kk), Y(lat + n)]; }
      function seta(lat, lon, dir, comp) {
        var a = dir * D2R, e = Math.sin(a), n = Math.cos(a), kk = 1 / Math.cos(lat * D2R);
        var p0 = ponto(lat, lon, -e * comp / 2, -n * comp / 2, kk), p1 = ponto(lat, lon, e * comp / 2, n * comp / 2, kk);
        var hl = comp * 0.34;
        var a1 = a + 152 * D2R, a2 = a - 152 * D2R;
        var c1 = ponto(lat + n * comp / 2, lon + e * comp / 2 * kk, Math.sin(a1) * hl, Math.cos(a1) * hl, kk);
        var c2 = ponto(lat + n * comp / 2, lon + e * comp / 2 * kk, Math.sin(a2) * hl, Math.cos(a2) * hl, kk);
        ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.moveTo(c1[0], c1[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(c2[0], c2[1]);
        ctx.stroke();
      }
      SETAS.forEach(function (s) {
        s.lats.forEach(function (lat, i) {
          var desl = (i % 2) * s.passo / 2;
          for (var lon = s.lon[0] + desl; lon <= s.lon[1]; lon += s.passo) {
            var L = Dv.norm180(lon);
            seta(lat, L, s.dir, 4.2);
            if (L > 170) seta(lat, L - 360, s.dir, 4.2); // repete na borda da textura
            if (L < -170) seta(lat, L + 360, s.dir, 4.2);
          }
        });
      });
      // só sobre o mar
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'destination-out';
      var cm = caminhos(W, H);
      ctx.fill(cm.fill, 'evenodd');
      ctx.lineWidth = 6 * k; ctx.stroke(cm.costa);
      ctx.globalCompositeOperation = 'source-over';
    }

    function texturaTraco() {
      var cv = document.createElement('canvas'); cv.width = 64; cv.height = 4;
      var ctx = cv.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 38, 4);
      var t = new THREE.CanvasTexture(cv);
      t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
      return t;
    }

    /* Fitas (linhas com largura) deitadas sobre a esfera. linhas: [{pts:[Vector3 unitário], fechada}] */
    function geomFitas(linhas, larg, raio, periodo) {
      var pos = [], uv = [], idx = [], base = 0;
      linhas.forEach(function (ln) {
        var pts = ln.pts;
        if (ln.fechada) pts = pts.concat([pts[0]]);
        var n = pts.length; if (n < 2) return;
        var acum = 0, t = new THREE.Vector3(), s = new THREE.Vector3();
        for (var i = 0; i < n; i++) {
          var p = pts[i];
          var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
          if (ln.fechada && (i === 0 || i === n - 1)) { a = pts[n - 2]; b = pts[1]; }
          t.subVectors(b, a);
          s.crossVectors(t, p);
          if (s.lengthSq() < 1e-14) s.set(0, 0, 0); else s.normalize().multiplyScalar(larg / 2);
          if (i > 0) acum += p.distanceTo(pts[i - 1]);
          var cx = p.x * raio, cy = p.y * raio, cz = p.z * raio;
          pos.push(cx + s.x, cy + s.y, cz + s.z, cx - s.x, cy - s.y, cz - s.z);
          var u = periodo ? acum / periodo : 0;
          uv.push(u, 0, u, 1);
          if (i < n - 1) { var q = base + i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
        }
        base += n * 2;
      });
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    }

    function paralelo(lat, passo) { var pts = []; for (var lon = -180; lon < 180; lon += passo) pts.push(vec(lat, lon, 1)); return { pts: pts, fechada: true }; }
    function meridiano(lon, lim, passo) { var pts = []; for (var lat = -lim; lat <= lim + 1e-9; lat += passo) pts.push(vec(lat, lon, 1)); return { pts: pts }; }
    function prepararGrat() {
      var fino = [], grosso = [];
      for (var lat = -80; lat <= 80; lat += 10) {
        if (lat === 0) continue;
        (lat % 30 === 0 ? grosso : fino).push(paralelo(lat, 1));
      }
      for (var lon = -180; lon < 180; lon += 10) (lon % 30 === 0 ? grosso : fino).push(meridiano(lon, lon % 30 === 0 ? 88 : 80, 1));
      linhasGrat = {
        fino: fino, grosso: grosso,
        equador: [paralelo(0, 0.5)],
        tropicos: [paralelo(TROPICO, 0.5), paralelo(-TROPICO, 0.5)],
      };
    }
    var LARG = { fino: 0.8, grosso: 1.25, equador: 2, tropicos: 1.4, orto: 3.4, lox: 2.6 };
    function construirGrat() {
      var e = escalaAtual;
      ['fino', 'grosso', 'equador', 'tropicos'].forEach(function (k) {
        var m = malhasGrat[k];
        var g = geomFitas(linhasGrat[k], LARG[k] * e, 1.0007, k === 'tropicos' ? 10 * e : 0);
        if (m) { m.geometry.dispose(); m.geometry = g; }
        else {
          m = new THREE.Mesh(g, matGrat[k]); m.renderOrder = 2; malhasGrat[k] = m; grpGrat.add(m);
        }
      });
    }

    function amostra(fn, n) { var pts = []; for (var i = 0; i <= n; i++) { var p = fn(i / n); pts.push(vec(p.lat, p.lon, 1)); } return pts; }

    function limparGrupo(g) {
      while (g.children.length) { var c = g.children.pop(); if (c.geometry) c.geometry.dispose(); }
    }
    function construirFitasRota() {
      limparGrupo(grpRota);
      var e = escalaAtual;
      linhasRota.forEach(function (ln) {
        if (!st.vis[ln.tipo]) return;
        var lox = ln.tipo === 'lox';
        var g = geomFitas([{ pts: ln.pts }], LARG[ln.tipo] * e, lox ? 1.0016 : 1.0019, lox ? 13 * e : 0);
        var m = new THREE.Mesh(g, lox ? matLox : matOrto);
        m.renderOrder = 3;
        grpRota.add(m);
      });
    }

    /* ---------- rótulos (CSS2D) ---------- */
    function novoRotulo(el, lat, lon, ud) {
      var o = new THREE.CSS2DObject(el);
      o.position.copy(vec(lat, lon, 1.0));
      o.userData = Object.assign({ n: vec(lat, lon, 1), prio: 10, colide: true, ativo: true, w: 60 }, ud || {});
      scene.add(o);
      rotulos.push(o);
      rotulos.sort(function (a, b) { return b.userData.prio - a.userData.prio; });
      return o;
    }
    function removerRotulo(o) {
      if (!o) return;
      scene.remove(o);
      var i = rotulos.indexOf(o); if (i >= 0) rotulos.splice(i, 1);
    }
    function largTexto(txt, px) { return txt.length * px * 0.56 + 6; }
    function rotuloPonto(p, classe, prio, comTexto) {
      var txt = comTexto ? nomePonto(p) : '';
      var e = h('div', { class: 'gr-r gr-r-pt ' + classe }, h('i', { class: 'gr-pto' }), txt ? h('span', { class: 'gr-t' }, txt) : null);
      return novoRotulo(e, p.lat, p.lon, { prio: prio, rota: true, lado: !!txt, w: txt ? largTexto(txt, 14) : 10, tipoRect: 'lado', colide: !!txt, soTeste: !txt });
    }
    function criarRotulosFixos() {
      AGUAS.forEach(function (a) {
        var e = h('div', { class: 'gr-r gr-r-agua' + (a.tipo === 'mar' ? ' gr-r-mar' : '') }, a.nome);
        novoRotulo(e, a.lat, a.lon, { prio: a.tipo === 'mar' ? 20 : 40, w: largTexto(a.nome, a.tipo === 'mar' ? 12.5 : 14), tipoRect: 'centro', mar: a.tipo === 'mar' });
      });
      [['Equador', 0], ['Trópico de Câncer', TROPICO], ['Trópico de Capricórnio', -TROPICO]].forEach(function (x) {
        var e = h('div', { class: 'gr-r gr-r-linha' }, h('span', { class: 'gr-t' }, x[0]));
        var o = novoRotulo(e, x[1], 0, { prio: 30, latLinha: x[1], w: largTexto(x[0], 12), tipoRect: 'linha' });
        rotLinhas.push(o);
      });
      var NE = function () { return T('Alísios de nordeste', 'NE trades'); }, SE = function () { return T('Alísios de sudeste', 'SE trades'); };
      var WE = function () { return T('Ventos de oeste', 'westerlies'); };
      var V = [
        ['vento', NE, 21, -41], ['vento', SE, -9, -20], ['vento', WE, 51, -27], ['vento', WE, -46, -5], ['vento', WE, -46, 95],
        ['vento', NE, 16, -145], ['vento', SE, -10, -118], ['vento', SE, -16, 80],
        ['zcit', function () { return T('ZCIT', 'ITCZ') + ': calmarias'; }, 6.6, -30], ['zcit', function () { return T('ZCIT', 'ITCZ'); }, 8.5, -120],
        ['alta', function () { return 'Alta dos Açores'; }, 33, -38], ['alta', function () { return 'Alta do Atlântico Sul'; }, -29, -12],
      ];
      V.forEach(function (v) {
        var t = h('span', { class: 'gr-t' }, v[1]());
        var e = v[0] === 'alta'
          ? h('div', { class: 'gr-r gr-r-alta' }, h('b', { class: 'gr-a' }, 'A'), t)
          : h('div', { class: 'gr-r gr-r-vento' + (v[0] === 'zcit' ? ' gr-r-zcit' : '') }, t);
        novoRotulo(e, v[2], v[3], { prio: 50, ventos: true, w: largTexto(v[1](), 12.5), tipoRect: v[0] === 'alta' ? 'alta' : 'centro', texto: v[1], elTexto: t });
      });
      var svgBarco = function (classe, nome) {
        var box = h('div', { class: 'gr-barco-giro' });
        box.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 1.5C15.6 6 16.6 11 15.9 17.5L15 22.5H9L8.1 17.5C7.4 11 8.4 6 12 1.5Z"/><path class="gr-barco-mastro" d="M12 7.5V18"/></svg>';
        var e = h('div', { class: 'gr-r gr-r-barco ' + classe, title: nome }, box);
        return novoRotulo(e, 0, 0, { prio: 100, colide: false, barco: true });
      };
      barcoL = svgBarco('gr-barco-lox', 'Barquinho na loxodrômica');
      barcoO = svgBarco('gr-barco-orto', 'Barquinho na ortodrômica');
    }

    function textosRotulos() {
      rotulos.forEach(function (o) {
        var u = o.userData;
        if (u.texto && u.elTexto) { var t = u.texto(); u.elTexto.textContent = t; u.w = largTexto(t, 12.5); u.medido = false; }
      });
    }
    function construirRota() {
      // remove rótulos de rota anteriores
      rotulos.slice().forEach(function (o) { if (o.userData.rota) removerRotulo(o); });
      linhasRota = [];
      if (st.pendente) rotuloPonto(st.pendente, 'gr-r-a', 90, true);
      var r = st.rota;
      if (r) {
        r.pernas.forEach(function (p) {
          var n = clamp(Math.round(p.o.milhas / 10), 24, 900);
          linhasRota.push({ tipo: 'orto', pts: amostra(function (f) { return Dv.pontoOrto(p.a, p.b, f); }, n) });
          linhasRota.push({ tipo: 'lox', pts: amostra(function (f) { return Dv.pontoLox(p.a, p.b, f); }, n) });
          if (st.vis.vertice && p.o.vertice && p.o.vertice.naDerrota && Dv.milhasEntre(p.o.vertice, p.a) > 1 && Dv.milhasEntre(p.o.vertice, p.b) > 1) {
            // no vértice a derrota corre leste–oeste: o nome vai do lado do polo (acima no hemisfério norte), fora da linha
            var polN = p.o.vertice.lat >= 0;
            var e = h('div', { class: 'gr-r gr-r-pt gr-r-vertice gr-cima' }, h('i', { class: 'gr-pto' }), h('span', { class: 'gr-t' }, T('vértice', 'vertex')));
            novoRotulo(e, p.o.vertice.lat, p.o.vertice.lon, { prio: r.pernas.length > 1 ? 75 : 85, rota: true, acimaPref: polN, w: largTexto(T('vértice', 'vertex'), 13), tipoRect: 'vert' });
          }
        });
        var ult = r.pontos.length - 1;
        r.pontos.forEach(function (p, i) {
          var extremo = i === 0 || i === ult;
          if (p.aux && !extremo) rotuloPonto(p, 'gr-r-aux', 60, false);
          else rotuloPonto(p, extremo ? 'gr-r-extremo' : 'gr-r-escala', extremo ? 90 : 80, true);
        });
      }
      construirFitasRota();
    }

    function marcarPalpite(p) {
      removerPalpite();
      if (!g3) return;
      var e = h('div', { class: 'gr-r gr-r-pt gr-r-palpite' }, h('i', { class: 'gr-pto' }), h('span', { class: 'gr-t' }, 'seu palpite'));
      palpiteObj = novoRotulo(e, p.lat, p.lon, { prio: 95, lado: true, tipoRect: 'lado', w: largTexto('seu palpite', 14) });
      pedirQuadro();
    }
    function removerPalpite() { if (palpiteObj) { removerRotulo(palpiteObj); palpiteObj = null; } }

    /* ---------- câmera ---------- */
    function fovMeia(frac) {
      var fv = camera.fov * D2R, fh = 2 * Math.atan(Math.tan(fv / 2) * camera.aspect);
      return Math.min(fv, fh) / 2 * frac;
    }
    function dGlobo() { return 1 / Math.sin(fovMeia(0.9)); }
    function vistaDe(rota) {
      var pts = [];
      linhasRota.forEach(function (ln) { for (var i = 0; i < ln.pts.length; i += 4) pts.push(ln.pts[i]); });
      if (!pts.length) rota.pontos.forEach(function (p) { pts.push(vec(p.lat, p.lon, 1)); });
      var c = new THREE.Vector3();
      pts.forEach(function (p) { c.add(p); });
      if (c.lengthSq() < 1e-9) c.set(1, 0, 0);
      c.normalize();
      var maxAng = 0;
      pts.forEach(function (p) { maxAng = Math.max(maxAng, c.angleTo(p)); });
      maxAng = Math.max(maxAng, 2.5 * D2R);
      var d = Math.cos(maxAng) + Math.sin(maxAng) / Math.tan(fovMeia(0.74));
      var dm = dGlobo();
      if (maxAng > 65 * D2R || d > dm) d = dm;
      d = Math.max(d, 1.55);
      var ll = latlonDe(c);
      return { lat: ll.lat, lon: ll.lon, dist: d };
    }
    function voarPara(alvo, instantaneo) {
      if (!g3) return;
      if (instantaneo || reduzido) {
        camera.position.copy(vec(alvo.lat, alvo.lon, alvo.dist)); camera.lookAt(0, 0, 0);
        st.voo = null; pedirQuadro(); return;
      }
      var de = latlonDe(camera.position);
      var ang = vec(de.lat, de.lon, 1).angleTo(vec(alvo.lat, alvo.lon, 1));
      st.voo = { t0: null, dur: 700 + 600 * Math.min(1, ang / Math.PI), de: { lat: de.lat, lon: de.lon, r: camera.position.length() }, para: alvo, arco: ang };
      pedirQuadro();
    }
    function passoVoo(agora) {
      var v = st.voo;
      if (v.t0 == null) v.t0 = agora;
      var f = clamp((agora - v.t0) / v.dur, 0, 1), e = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
      var lat = v.de.lat + (v.para.lat - v.de.lat) * e;
      var lon = v.de.lon + Dv.norm180(v.para.lon - v.de.lon) * e;
      var r = v.de.r + (v.para.dist - v.de.r) * e + Math.sin(Math.PI * e) * Math.min(1.2, v.arco * 0.6);
      camera.position.copy(vec(lat, lon, Math.min(r, dGlobo() * 1.35))); camera.lookAt(0, 0, 0);
      if (f >= 1) st.voo = null;
    }
    function girar(dLat, dLon) {
      var ll = latlonDe(camera.position), r = camera.position.length();
      camera.position.copy(vec(clamp(ll.lat + dLat, -85, 85), ll.lon + dLon, r)); camera.lookAt(0, 0, 0);
      st.voo = null; pedirQuadro();
    }
    function aproximar(fator) {
      var r = clamp(camera.position.length() * fator, controls.minDistance, controls.maxDistance);
      camera.position.setLength(r); st.voo = null; pedirQuadro();
    }
    function escalaPx() { return 2 * Math.tan(camera.fov * D2R / 2) * Math.max(0.03, camera.position.length() - 1) / Math.max(1, altura); }

    function pick(ndcX, ndcY) {
      ndc.set(ndcX, ndcY);
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObject(globo, false)[0];
      return hit ? latlonDe(hit.point) : null;
    }

    /* ---------- quadro ---------- */
    function pedirQuadro() { if (!raf && st.visivel && vivo && g3) raf = requestAnimationFrame(quadro); }
    function quadro(agora) {
      raf = 0;
      if (!vivo || !g3) return;
      var continuar = false;
      if (st.voo) { passoVoo(agora); continuar = true; }
      if (controls.update()) continuar = true;
      if (st.tocando) {
        var dt = st.ultimoT == null ? 0 : Math.min(0.1, (agora - st.ultimoT) / 1000);
        st.ultimoT = agora;
        st.prog = Math.min(1, st.prog + dt / st.durAnim);
        rng.value = String(Math.round(st.prog * 1000));
        atualizarStatus(false);
        if (st.prog >= 1) {
          pararAnimacao();
          anuncio.textContent = 'Chegada. ' + status.textContent;
        } else continuar = true;
      }
      // perto da superfície: giro mais lento e plano de corte mais próximo
      var d = camera.position.length();
      controls.rotateSpeed = clamp((d - 1) / 2.4, 0.06, 1) * 0.85;
      var near = clamp((d - 1) * 0.25, 0.002, 0.2);
      if (Math.abs(near - camera.near) / camera.near > 0.1) { camera.near = near; camera.updateProjectionMatrix(); }
      if (d < 1.9) carregarDetalhe();
      var e = escalaPx();
      if (!escalaAtual || Math.abs(Math.log(e / escalaAtual)) > 0.18) { escalaAtual = e; construirGrat(); construirFitasRota(); }
      var anelPx = 1.3 * 2 * Math.tan(camera.fov * D2R / 2) * Math.sqrt(Math.max(0.01, d * d - 1)) / Math.max(1, altura);
      contorno.scale.setScalar(1 + anelPx);
      matGlobo.uniforms.limbo.value = (st.limbo || 0.16) * clamp((d - 1.15) / 1.4, 0, 1); // sombreado só com o globo inteiro à vista
      posicionarBarcos();
      atualizarRotulos();
      renderer.render(scene, camera);
      css.render(scene, camera);
      if (medidosAgora) { medidosAgora = false; continuar = true; } // reposiciona com as larguras medidas
      if (continuar) pedirQuadro();
    }

    function posicionarBarcos() {
      var r = st.rota, mostrar = !!(r && st.vis.barcos && st.modo === 'explorar' && (st.prog > 0 || st.tocando));
      [barcoO, barcoL].forEach(function (b) { b.userData.ativo = mostrar; });
      if (!mostrar) return;
      var sL = st.prog * r.lox, sO = Math.min(sL, r.orto);
      [[barcoO, 'orto', sO, r.orto], [barcoL, 'lox', sL, r.lox]].forEach(function (x) {
        var b = x[0], tipo = x[1], s = x[2], tot = x[3];
        var p = posAoLongo(r, tipo, s);
        var dlt = Math.max(0.5, tot * 0.003);
        var s1 = s + dlt > tot ? Math.max(0, tot - dlt) : s, s2 = s + dlt > tot ? tot : s + dlt;
        var q1 = posAoLongo(r, tipo, s1), q2 = posAoLongo(r, tipo, s2);
        b.position.copy(vec(p.lat, p.lon, 1.003));
        b.userData.n = vec(p.lat, p.lon, 1);
        var a1 = vec(q1.lat, q1.lon, 1).project(camera), a2 = vec(q2.lat, q2.lon, 1).project(camera);
        var dx = (a2.x - a1.x) * largura / 2, dy = -(a2.y - a1.y) * altura / 2;
        var ang = Math.atan2(dx, -dy) * R2D;
        var giro = b.element.firstChild;
        if (isFinite(ang)) giro.style.transform = 'rotate(' + ang.toFixed(1) + 'deg)';
      });
    }

    /* Retângulo (em px da tela) ocupado por rótulos de nome de água, linha ou alta pressão. */
    function retangulo(o, x, y) {
      var u = o.userData, w = u.w || 40, hh = 18;
      if (u.tipoRect === 'linha') return [x, y - hh, x + w + 6, y];
      if (u.tipoRect === 'alta') return [x - w / 2, y - 14, x + w / 2, y + 26];
      return [x - w / 2, y - hh / 2, x + w / 2, y + hh / 2];
    }
    /* Nomes de pontos: posições candidatas, em ordem de preferência. m: 'd' direita, 'e' esquerda, 'c' acima,
       'b' abaixo; dx desloca o texto acima/abaixo para a esquerda (−1) ou para a direita (1).
       'lado': à direita do marcador (à esquerda, se não couber), depois acima ou abaixo.
       'vert' (vértice): a derrota corre leste–oeste ali, então o nome vai acima ou abaixo, primeiro do lado do polo. */
    function candidatos(u, x, W) {
      var out = [], ver;
      if (u.tipoRect === 'lado') {
        var lado = x + 12 + (u.w || 40) > W - 2 ? 'e' : 'd';
        out.push({ m: lado, dx: 0 }, { m: lado === 'e' ? 'd' : 'e', dx: 0 });
        [0, -1, 1].forEach(function (dx) { out.push({ m: 'c', dx: dx }, { m: 'b', dx: dx }); });
        return out;
      }
      ver = u.acimaPref ? ['c', 'b'] : ['b', 'c'];
      ver.forEach(function (m) { [0, -1, 1].forEach(function (dx) { out.push({ m: m, dx: dx }); }); });
      return out;
    }
    function retCand(u, x, y, c) {
      var w = u.w || 40;
      if (c.m === 'd') return [x + 7, y - 10, x + 10 + w, y + 9];
      if (c.m === 'e') return [x - 10 - w, y - 10, x - 7, y + 9];
      var x0 = c.dx === 0 ? x - w / 2 : c.dx < 0 ? x - w + 6 : x - 6;
      return c.m === 'c' ? [x0, y - 26, x0 + w, y - 7] : [x0, y + 7, x0 + w, y + 26];
    }
    function aplicarCand(o, c) {
      var u = o.userData, chave = c.m + c.dx;
      if (u.chaveCand === chave) return;
      u.chaveCand = chave;
      var cl = o.element.classList, vertical = c.m === 'c' || c.m === 'b';
      cl.toggle('gr-esq', c.m === 'e'); cl.toggle('gr-cima', c.m === 'c'); cl.toggle('gr-baixo', c.m === 'b');
      cl.toggle('gr-vx-e', vertical && c.dx < 0); cl.toggle('gr-vx-d', vertical && c.dx > 0);
    }
    /* Largura real do texto (medida uma vez, quando o rótulo já está na tela); antes disso vale a estimativa. */
    function medirRotulo(o) {
      var alvo = o.element.querySelector('.gr-t') || o.element;
      var w = alvo.offsetWidth;
      if (w > 0) { o.userData.w = w + 4; o.userData.medido = true; medidosAgora = true; }
    }
    function sobrepoe(r, q) { return r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]; }
    function colide(r, ocup) {
      for (var j = 0; j < ocup.length; j++) if (sobrepoe(r, ocup[j])) return true;
      return false;
    }
    function livre(r, ocup, marcas, eu, W, H) {
      if (r[0] < 2 || r[2] > W - 2 || r[1] < 2 || r[3] > H - 2) return false;
      if (colide(r, ocup)) return false;
      for (var j = 0; j < marcas.length; j++) if (marcas[j].o !== eu && sobrepoe(r, marcas[j].r)) return false;
      return true;
    }
    function atualizarRotulos() {
      var cam = camera.position, d = cam.length();
      var cd = tmpV2.copy(cam).divideScalar(d), lim = 1 / d;
      // rótulos das linhas: deslizam junto com a vista, um pouco à esquerda do centro
      var centro = latlonDe(cd), horiz = Math.acos(clamp(lim, -1, 1)) * R2D;
      var lonLinha = centro.lon - Math.min(32, horiz * 0.55);
      rotLinhas.forEach(function (o) {
        var lat = o.userData.latLinha;
        o.position.copy(vec(lat, lonLinha, 1));
        o.userData.n = vec(lat, lonLinha, 1);
      });
      var W = largura, H = altura, ocup = [], marcas = [], i, o, u;
      // 1ª passada: projeta tudo e registra os marcadores de ponto (os nomes não podem cobri-los)
      for (i = 0; i < rotulos.length; i++) {
        o = rotulos[i]; u = o.userData; u.naTela = false;
        var ativo = u.ativo !== false && (!u.ventos || st.ventos) && (!u.mar || d < 2.7);
        if (!ativo) continue;
        if (!u.medido && o.visible) medirRotulo(o);
        var k = u.n.dot(cd) - lim;
        if (k < 0.012) continue;
        var v = tmpV.copy(o.position).project(camera);
        var x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
        if (x < -30 || x > W + 30 || y < -30 || y > H + 30) continue;
        u.naTela = true; u.x = x; u.y = y; u.k = k;
        if ((u.tipoRect === 'lado' || u.tipoRect === 'vert') && u.colide) marcas.push({ o: o, r: [x - 6, y - 6, x + 6, y + 6] });
      }
      // 2ª passada: coloca os textos por prioridade
      for (i = 0; i < rotulos.length; i++) {
        o = rotulos[i]; u = o.userData;
        if (!u.naTela) { o.visible = false; continue; }
        var px = u.x, py = u.y;
        if (u.soTeste && colide([px - 4, py - 4, px + 4, py + 4], ocup)) { o.visible = false; continue; } // ponto auxiliar sob um nome
        if (u.colide && (u.tipoRect === 'lado' || u.tipoRect === 'vert')) {
          // nome de ponto: tenta cada posição; se nenhuma estiver livre, some só o nome e o marcador fica
          var cs = candidatos(u, px, W), esc = null, rr = null;
          for (var c = 0; c < cs.length && !esc; c++) { var r = retCand(u, px, py, cs[c]); if (livre(r, ocup, marcas, o, W, H)) { esc = cs[c]; rr = r; } }
          aplicarCand(o, esc || cs[0]);
          if (!esc !== !!u.semTexto) { u.semTexto = !esc; o.element.classList.toggle('gr-sem-t', !esc); }
          if (rr) ocup.push(rr);
        } else if (u.colide) {
          var rc = retangulo(o, px, py);
          if (!livre(rc, ocup, marcas, o, W, H)) { o.visible = false; continue; }
          ocup.push(rc);
        }
        o.visible = true;
        var op = Math.min(1, u.k / 0.07);
        if (u.op !== op) { u.op = op; o.element.style.opacity = op.toFixed(2); }
      }
    }

    function aplicarTema(forcar) {
      if (!g3) return;
      var c = cores();
      var ass = c.paper + c['sea-1'] + c.land + c.magenta + c.ink;
      if (!forcar && ass === assinaturaTema) return;
      assinaturaTema = ass;
      desenharTerra(c); texTerra.needsUpdate = true;
      desenharVentos(c); texVentos.needsUpdate = true;
      matOrto.color.set(c.magenta);
      matLox.color.set(c.ink);
      matGrat.fino.color.set(c.line); matGrat.grosso.color.set(c['ink-3']);
      matGrat.equador.color.set(c['ink-2']); matGrat.tropicos.color.set(c['ink-2']);
      contorno.material.color.set(c['ink-3']);
      var escuro = VL.settings.temaEscuro();
      st.limbo = escuro ? 0.3 : 0.16;
      matGrat.fino.opacity = escuro ? 0.75 : 0.7;
      matGrat.grosso.opacity = escuro ? 0.7 : 0.5;
      pedirQuadro();
    }

    function redimensionar() {
      var w = cena.clientWidth, hh = cena.clientHeight;
      if (!w || !hh) return;
      if (w === largura && hh === altura) return;
      largura = w; altura = hh;
      renderer.setSize(w, hh, false);
      css.setSize(w, hh);
      camera.aspect = w / hh; camera.updateProjectionMatrix();
      controls.maxDistance = dGlobo() * 1.45;
      escalaAtual = 0;
      pedirQuadro();
    }

    var VS = 'varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n' +
      'void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }';
    var FS = 'uniform sampler2D mapa; uniform float limbo; varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n' +
      'void main(){ vec4 c = texture2D(mapa, vUv); float k = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);\n' +
      ' float s = 1.0 - limbo * (1.0 - pow(k, 0.55)); gl_FragColor = linearToOutputTexel(vec4(c.rgb * s, 1.0)); }';

    function iniciar3D(T3) {
      THREE = T3;
      var canvas = document.createElement('canvas');
      var ctxGL = null;
      try { ctxGL = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, stencil: false }); } catch (e) { ctxGL = null; }
      if (!ctxGL) { semWebGL(); return; }
      try { renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctxGL, antialias: true, alpha: true }); }
      catch (e) { semWebGL(); return; }
      g3 = true;
      tmpV = new THREE.Vector3(); tmpV2 = new THREE.Vector3(); ray = new THREE.Raycaster(); ndc = new THREE.Vector2();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      canvas.className = 'gr-canvas';
      cena.appendChild(canvas);
      /* perda do contexto WebGL: aviso, restauração (Three.js recria os recursos) ou recriação do globo (VL.gl3d, core/ui.js) */
      vigia = VL.gl3d.vigiar(canvas, palco, {
        restaurou: function () { pedirQuadro(); },
        recriar: remontar ? function () {
          if (!vivo || (opts._recr || 0) >= 2) return false;
          var o2 = Object.assign({}, opts, { modo: st.modo, ventos: st.ventos, vel: st.vel, animar: false, _recr: (opts._recr || 0) + 1 });
          if (st.rota && st.meta && st.meta.livre) o2.pontos = st.rota.pontos.map(function (p) { return { lat: p.lat, lon: p.lon, nome: p.curto || p.nome }; });
          else if (sel.value && sel.value !== 'livre') o2.preset = sel.value;
          remontar(o2);
          return true;
        } : null,
        falhou: function () { liberar3D(); semWebGL('A cena 3D foi interrompida pelo navegador e não voltou. Abaixo, a maior perna da derrota numa carta de Mercator.'); },
      });
      css = new THREE.CSS2DRenderer();
      css.domElement.className = 'gr-css';
      cena.appendChild(css.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, 0.05, 60);

      var maxTex = renderer.capabilities.maxTextureSize || 2048;
      var Wt = (maxTex >= 4096 && cena.clientWidth > 560) ? 4096 : 2048;
      cvTerra = document.createElement('canvas'); cvTerra.width = Wt; cvTerra.height = Wt / 2;
      cvVentos = document.createElement('canvas'); cvVentos.width = 2048; cvVentos.height = 1024;
      texTerra = new THREE.CanvasTexture(cvTerra); texTerra.colorSpace = THREE.SRGBColorSpace;
      texTerra.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      texVentos = new THREE.CanvasTexture(cvVentos); texVentos.colorSpace = THREE.SRGBColorSpace;
      texVentos.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      texTraco = texturaTraco();

      matGlobo = new THREE.ShaderMaterial({ uniforms: { mapa: { value: texTerra }, limbo: { value: 0.16 } }, vertexShader: VS, fragmentShader: FS });
      globo = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 100), matGlobo);
      scene.add(globo);
      contorno = new THREE.Mesh(new THREE.SphereGeometry(1, 120, 72), new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.BackSide }));
      scene.add(contorno);
      ventosMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 128, 80), new THREE.MeshBasicMaterial({ map: texVentos, transparent: true, depthWrite: false }));
      ventosMesh.renderOrder = 1; ventosMesh.visible = st.ventos;
      scene.add(ventosMesh);

      function matLinha(op, dash) {
        var m = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
        if (dash) { m.map = texTraco; m.alphaTest = 0.5; }
        return m;
      }
      matGrat = { fino: matLinha(0.7), grosso: matLinha(0.5), equador: matLinha(0.85), tropicos: matLinha(0.8, true) };
      matOrto = new THREE.MeshBasicMaterial({ color: 0xa0186b, side: THREE.DoubleSide });
      matLox = new THREE.MeshBasicMaterial({ color: 0x0f2a40, map: texTraco, alphaTest: 0.5, side: THREE.DoubleSide });
      grpGrat = new THREE.Group(); scene.add(grpGrat);
      grpRota = new THREE.Group(); scene.add(grpRota);
      prepararGrat();
      criarRotulosFixos();

      controls = new THREE.OrbitControls(camera, canvas);
      controls.enablePan = false; controls.enableDamping = !reduzido; controls.dampingFactor = 0.1;
      controls.minDistance = 1.18; controls.zoomSpeed = 0.8;
      controls.addEventListener('start', function () { st.voo = null; pedirQuadro(); });
      controls.addEventListener('change', pedirQuadro);

      // toque curto = marcar ponto (arrastar = girar)
      var toque = null, ativos = 0;
      canvas.addEventListener('pointerdown', function (e) {
        ativos++;
        toque = (ativos === 1 && (e.button === 0 || e.pointerType !== 'mouse')) ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId } : null;
      });
      function fimToque(e, cancel) {
        ativos = Math.max(0, ativos - 1);
        if (!cancel && toque && toque.id === e.pointerId) {
          var dx = e.clientX - toque.x, dy = e.clientY - toque.y;
          if (dx * dx + dy * dy < 64 && performance.now() - toque.t < 600) {
            var rc = canvas.getBoundingClientRect();
            var p = pick((e.clientX - rc.left) / rc.width * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
            if (p) aoTocar(p);
          }
        }
        toque = null;
      }
      canvas.addEventListener('pointerup', function (e) { fimToque(e, false); });
      canvas.addEventListener('pointercancel', function (e) { fimToque(e, true); });

      // roda do mouse: rola a página; Ctrl + roda (ou pinça no trackpad) aproxima
      palco.addEventListener('wheel', function (e) {
        if (e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
        mostrarAviso('Para aproximar, use Ctrl + roda do mouse ou os botões + e −.');
      }, { capture: true, passive: true });

      cena.addEventListener('keydown', function (e) {
        var d = camera.position.length(), passo = clamp((d - 1) * 4, 0.5, 8);
        if (e.key === 'ArrowLeft') girar(0, -passo);
        else if (e.key === 'ArrowRight') girar(0, passo);
        else if (e.key === 'ArrowUp') girar(passo, 0);
        else if (e.key === 'ArrowDown') girar(-passo, 0);
        else if (e.key === '+' || e.key === '=') aproximar(0.85);
        else if (e.key === '-' || e.key === '_') aproximar(1.18);
        else if (e.key === 'Enter' || e.key === ' ') { var p = pick(0, 0); if (p) aoTocar(p); }
        else return;
        e.preventDefault();
      });
      btMais.addEventListener('click', function () { aproximar(0.8); });
      btMenos.addEventListener('click', function () { aproximar(1.25); });
      btCentro.addEventListener('click', function () { if (st.rota) voarPara(vistaDe(st.rota)); else if (st.pendente) voarPara({ lat: st.pendente.lat, lon: st.pendente.lon, dist: dGlobo() }); });

      if (window.ResizeObserver) { ro = new ResizeObserver(function () { redimensionar(); }); ro.observe(cena); }
      if (window.IntersectionObserver) {
        io = new IntersectionObserver(function (ents) {
          var vis = ents[ents.length - 1].isIntersecting;
          st.visivel = vis;
          if (vis) { st.ultimoT = null; pedirQuadro(); }
          else if (raf) { cancelAnimationFrame(raf); raf = 0; }
        });
        io.observe(cena);
      }
      redimensionar();
      if (!largura || largura === 1) { largura = cena.clientWidth || 600; altura = cena.clientHeight || 400; renderer.setSize(largura, altura, false); css.setSize(largura, altura); camera.aspect = largura / altura; camera.updateProjectionMatrix(); }
      controls.maxDistance = dGlobo() * 1.45;
      aplicarTema(true);
      carregando.hidden = true;
      // rota inicial
      escalaAtual = escalaPx();
      construirGrat();
      if (st.rota) { construirRota(); voarPara(vistaDe(st.rota), true); }
      else camera.position.copy(vec(-10, -30, dGlobo()));
      camera.lookAt(0, 0, 0);
      pedirQuadro();
      if (opts.animar && !reduzido && st.modo === 'explorar') timers.push(setTimeout(function () { if (vivo) tocar(); }, 600));
      if (Wt >= 4096) timers.push(setTimeout(function () {
        if (!vivo) return;
        if (window.requestIdleCallback) window.requestIdleCallback(function () { if (vivo) carregarDetalhe(); }, { timeout: 3000 });
        else carregarDetalhe();
      }, 1500));
    }

    /* Costa 1:50m (ilhas como Cabo Verde e Açores): no computador logo depois de abrir; no celular só com zoom. */
    function carregarDetalhe() {
      if (usar50 || carregando50 || opts.detalhe === false || !g3) return;
      carregando50 = true;
      (VL.geo.land50m ? Promise.resolve() : VL.load('data/geo/world_land_50m.js')).then(function () {
        if (!vivo || !VL.geo.land50m) return;
        usar50 = true; aplicarTema(true);
      }).catch(function () { /* fica com 1:110m */ });
    }
    var timerAviso = 0;
    function mostrarAviso(txt) {
      aviso.textContent = txt;
      aviso.classList.add('gr-aviso-on');
      clearTimeout(timerAviso);
      timerAviso = setTimeout(function () { aviso.classList.remove('gr-aviso-on'); }, 1600);
    }

    /* ---------- sem WebGL: carta de Mercator plana ---------- */
    function desenharCarta() {
      if (!cartaPlana || !st.rota) return;
      var r = st.rota, maior = r.pernas[0];
      r.pernas.forEach(function (p) { if (p.o.milhas > maior.o.milhas) maior = p; });
      cartaPlana.desenhar(maior.a, maior.b, maior.o, null);
    }
    function semWebGL(msg) {
      g3 = null;
      carregando.hidden = true;
      cena.classList.add('gr-sem-gl');
      cena.removeAttribute('tabindex'); cena.removeAttribute('role'); cena.removeAttribute('aria-roledescription'); cena.removeAttribute('aria-label');
      zoomBox.hidden = true;
      cena.innerHTML = '';
      cena.appendChild(h('p', { class: 'gr-semgl-msg' }, msg || 'Este navegador não conseguiu abrir o globo 3D (WebGL desligado ou indisponível). Abaixo, a maior perna da derrota numa carta de Mercator: a ortodrômica aparece como curva e a loxodrômica como reta.'));
      if (Dv.cartaMercator) {
        VL.loadCSS('assets/css/widgets/derrota-calc.css');
        cartaPlana = Dv.cartaMercator();
        cena.appendChild(h('div', { class: 'gr-carta' }, cartaPlana.el));
        desenharCarta();
      }
      segModo.hidden = true;
      var opLivre = sel.querySelector('option[value="livre"]'); if (opLivre) opLivre.remove();
      if (sel.value === 'livre' || !sel.value) sel.value = listaPresets[0].id;
      if (st.modo !== 'explorar') trocarModo('explorar');
      else if (st.meta && st.meta.livre && !st.rota) carregarPreset(sel.value);
      dica.textContent = st.rota && st.meta.livre ? '' : 'Escolha outra travessia na lista.';
      atualizarStatus(true);
    }

    /* ---------- início ---------- */
    offs.push(VL.on('tema', function () { aplicarTema(false); }));
    offs.push(VL.on('settings', function () {
      aplicarTema(false);
      textosFixos();
      if (g3) { textosRotulos(); construirRota(); pedirQuadro(); }
      if (st.modo === 'explorar') painelResultados(); else if (st.desafio && !st.desafio.respondido) painelDesafio();
    }));

    var inicial = null;
    if (Array.isArray(opts.pontos) && opts.pontos.length >= 2) {
      var pts = opts.pontos.map(function (p, i) { return { lat: Number(p.lat), lon: Number(p.lon), curto: p.nome || ('Ponto ' + 'ABCDEFGHIJ'.charAt(i)) }; });
      var ok = pts.every(function (p) { return isFinite(p.lat) && isFinite(p.lon) && Math.abs(p.lat) <= 89.5 && Math.abs(p.lon) <= 180; });
      for (var i = 0; ok && i < pts.length - 1; i++) if (Dv.validarPar(pts[i], pts[i + 1])) ok = false;
      if (ok) inicial = pts;
    }
    campoSel.hidden = st.modo !== 'explorar'; barra.hidden = st.modo !== 'explorar'; legLinhas.hidden = st.modo !== 'explorar';
    if (st.modo === 'desafio') { st.modo = 'explorar'; trocarModo('desafio'); }
    else if (inicial) {
      sel.value = 'livre';
      definirRota(inicial, { nome: inicial[0].curto + ' – ' + inicial[inicial.length - 1].curto, livre: true });
      dica.textContent = 'Toque no oceano para marcar outra partida e chegada.';
    } else carregarPreset(opts.preset || 'rio-cabo');

    var precisaGeo = !(VL.geo && VL.geo.land110m);
    Promise.all([VL.libs.three(), precisaGeo ? VL.load('data/geo/world_land_110m.js') : null]).then(function (r) {
      if (!vivo) return;
      if (!VL.geo || !VL.geo.land110m) throw new Error('geografia indisponível');
      iniciar3D(r[0]);
      if (st.modo === 'explorar') painelResultados();
    }).catch(function (e) {
      if (!vivo) return;
      console.warn('globo-rotas:', e && e.message);
      semWebGL('Não foi possível carregar o globo 3D. Abaixo, a maior perna da derrota numa carta de Mercator.');
    });

    /* solta o renderer, as texturas e as geometrias (ao sair do widget ou quando a cena 3D não volta depois de uma perda de contexto) */
    function liberar3D() {
      if (vigia) { vigia.parar(); vigia = null; }
      if (raf) cancelAnimationFrame(raf); raf = 0;
      g3 = null;
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (controls) controls.dispose();
      var perdido = false;
      try { perdido = !!(renderer && renderer.getContext().isContextLost()); } catch (e) { perdido = false; }
      if (scene && !perdido) {   /* com o contexto perdido a GPU já liberou tudo; descartar de novo só gera avisos do WebGL */
        scene.traverse(function (o) {
          if (o.geometry) o.geometry.dispose();
          if (o.material) [].concat(o.material).forEach(function (m) { m.dispose(); });
        });
      }
      if (!perdido) [texTerra, texVentos, texTraco].forEach(function (t) { if (t) t.dispose(); });
      if (renderer) { renderer.dispose(); VL.gl3d.soltar(renderer); }
      renderer = null;
    }

    return function limpar() {
      vivo = false;
      if (raf) cancelAnimationFrame(raf); raf = 0;
      clearTimeout(timerAviso);
      timers.forEach(clearTimeout);
      offs.forEach(function (f) { try { f(); } catch (e) { /* já removido */ } });
      liberar3D();
      el.innerHTML = '';
    };
  }

  VL.widgets.define('globo-rotas', {
    css: ['assets/css/widgets/globo-rotas.css'],
    scripts: ['widgets/derrota-calc.js'],
    mount: function (el, opts) {
      /* se a cena 3D for recriada (perda de contexto WebGL que não volta), o widget é montado de novo com o estado atual */
      var atual = null;
      function ir(o) {
        atual = montar(el, o, function (o2) { var velho = atual; atual = null; if (velho) velho(); ir(o2); });
      }
      ir(opts || {});
      return function () { var l = atual; atual = null; if (l) l(); };
    },
  });
})();
