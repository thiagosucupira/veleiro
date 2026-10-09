/* mareacao — mareação de um veleiro de cruzeiro (exemplo de ~32 pés), vista de cima.
   O aluno gira o barco (arrastando, teclado ou botões orçar/arribar) e caça/folga a escota.
   A rosa dos pontos de vela é relativa ao vento VERDADEIRO (que sopra do topo da cena).
   As birutas (tell-tales) reagem ao ângulo de ataque ao vento APARENTE:
     ângulo de ataque = ângulo do vento aparente (a partir da proa) − ângulo da vela (a partir da linha de centro).
     < 0°  → vela panejando (folgada demais);  0–10° → biruta de barlavento levanta (cace ou arribe);
     10–25° → birutas paralelas (fluxo certo); > 25° → biruta de sotavento cai/gira (estol: folgue ou orce).
     Com o vento aparente a mais de ~105° da proa não há fluxo colado possível: a vela trabalha por arrasto
     e o certo é folgar até perto do brandal.
   Triângulo de velocidades: vento verdadeiro + vento do deslocamento (igual e oposto à velocidade do barco)
     = vento aparente.  AWS = √(VV² + VB² + 2·VV·VB·cos TWA);  AWA = atan2(VV·sen TWA, VV·cos TWA + VB).
   Velocidade do barco: polar APROXIMADA de um cruzeiro de exemplo, de 32 pés (≈ 9,75 m; velocidade de casco ≈ 7 nós; no seu barco, ≈ 2,43 × √LWL),
     com mar calmo e velas bem reguladas, multiplicada por uma eficiência de regulagem. Didático, não é a
     polar de um barco específico. Zona morta do modelo: 35° de cada lado do vento verdadeiro.
   Simplificação: a escota controla as duas velas (grande e genoa) ao mesmo tempo.

   opts de mount (todos opcionais):
     modo:     'explorar' | 'desafio'                                   padrão 'explorar'
     vento:    velocidade do vento verdadeiro em nós (4 a 25)            padrão 12
     proa:     ângulo do vento verdadeiro em relação à proa, em graus;
               positivo = vento entrando por boreste, negativo = por bombordo   padrão 60
     escota:   0 (toda caçada) a 100 (toda folgada)                      padrão 50
     desafios: lista de ids, na ordem: 'traves','birutas','cerrada','largo','popa','aparente'
               padrão: todos
     titulo:   legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'mareacao', opts:{proa:90, escota:10}}
     {t:'widget', w:'mareacao', opts:{modo:'desafio', desafios:['traves','birutas','aparente']}} */
(function () {
  'use strict';
  var h = VL.h, NS = 'http://www.w3.org/2000/svg', D2R = Math.PI / 180;
  var contador = 0;

  function S(tag, a) {
    var e = document.createElementNS(NS, tag);
    if (a) for (var k in a) if (a[k] != null) e.setAttribute(k, a[k]);
    for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return e;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function n180(a) { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function nos(x) { return VL.fmt.num(x, 1) + ' nós'; }
  function graus(x) { return Math.round(x) + '°'; }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /* ---------------------------------------------------------------- modelo */
  var POL_TWS = [4, 6, 8, 10, 12, 16, 20, 25];
  var POL_TWA = [0, 35, 38, 42, 45, 52, 60, 75, 90, 110, 120, 135, 150, 165, 180];
  var POL = [
    [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
    [1.0, 1.6, 2.0, 2.3, 2.5, 2.7, 2.8, 2.8], [2.4, 3.6, 4.3, 4.8, 5.1, 5.4, 5.5, 5.5],
    [2.8, 4.0, 4.8, 5.4, 5.8, 6.1, 6.2, 6.1], [3.1, 4.4, 5.3, 5.9, 6.2, 6.5, 6.6, 6.5],
    [3.3, 4.7, 5.6, 6.2, 6.5, 6.8, 6.9, 6.9], [3.5, 5.0, 5.9, 6.4, 6.8, 7.1, 7.3, 7.3],
    [3.5, 5.0, 6.0, 6.5, 6.9, 7.3, 7.5, 7.6], [3.4, 4.9, 5.9, 6.5, 6.9, 7.4, 7.8, 8.0],
    [3.2, 4.6, 5.6, 6.3, 6.8, 7.4, 7.8, 8.1], [2.7, 4.0, 5.0, 5.8, 6.4, 7.1, 7.6, 8.0],
    [2.3, 3.4, 4.3, 5.1, 5.8, 6.6, 7.2, 7.6], [2.0, 3.0, 3.9, 4.6, 5.3, 6.2, 6.8, 7.2],
    [1.9, 2.8, 3.6, 4.3, 5.0, 5.9, 6.5, 7.0],
  ];
  var ZONA_MORTA = 35, DMIN = 12, DMAX = 80;
  function idx(arr, v) { v = clamp(v, arr[0], arr[arr.length - 1]); for (var i = 0; i < arr.length - 2 && v > arr[i + 1]; i++); return { i: i, f: (v - arr[i]) / (arr[i + 1] - arr[i]) }; }
  function polar(twa, tws) {
    if (tws < 4) return polar(twa, 4) * tws / 4;
    var a = idx(POL_TWA, twa), b = idx(POL_TWS, tws);
    var l0 = POL[a.i][b.i] * (1 - b.f) + POL[a.i][b.i + 1] * b.f, l1 = POL[a.i + 1][b.i] * (1 - b.f) + POL[a.i + 1][b.i + 1] * b.f;
    return l0 * (1 - a.f) + l1 * a.f;
  }
  function polarMax(tws) { var m = 0; for (var t = 40; t <= 180; t += 5) m = Math.max(m, polar(t, tws)); return m; }
  function aparente(tws, twa, bs) {
    var x = tws * Math.cos(twa * D2R) + bs, y = tws * Math.sin(twa * D2R);
    return { aws: Math.hypot(x, y), awa: Math.atan2(y, x) / D2R };
  }
  function anguloVela(esc) { return DMIN + (DMAX - DMIN) * esc / 100; }
  function eficiencia(awa, d) {
    var alfa = awa - d;
    if (awa - DMAX > 25) { var falta = DMAX - d; if (falta <= 6) return { ef: 1, est: 'arrasto' }; return { ef: Math.max(0.45, 1 - 0.012 * falta), est: 'arrastoCacada' }; }
    if (alfa < 0) return { ef: 0.1 + 0.25 * clamp((alfa + 15) / 15, 0, 1), est: 'panejando' };
    if (alfa < 10) return { ef: 0.6 + 0.04 * alfa, est: 'barlavento' };
    if (alfa <= 25) return { ef: 1 - 0.0012 * (alfa - 17) * (alfa - 17), est: 'fluxo' };
    return { ef: Math.max(0.45, 0.92 - 0.018 * (alfa - 25)), est: 'sotavento' };
  }
  /** rho: vento relativo à proa (−180..180, + = boreste). esc: 0..100. bsForcada: opcional (demonstração). */
  function calcular(tws, rho, esc, bsForcada) {
    var twa = Math.abs(rho), lado = rho >= 0 ? 1 : -1, d = anguloVela(esc), p = polar(twa, tws);
    var r = { tws: tws, rho: rho, twa: twa, lado: lado, d: d, pol: p };
    var ap, e;
    if (bsForcada != null) {
      r.bs = bsForcada; ap = aparente(tws, twa, r.bs); e = twa < ZONA_MORTA ? { ef: 0, est: 'novento' } : eficiencia(ap.awa, d);
    } else if (twa < ZONA_MORTA) {
      r.bs = 0; ap = aparente(tws, twa, 0); e = { ef: 0, est: 'novento' };
    } else {
      var bs = p;
      for (var i = 0; i < 40; i++) { ap = aparente(tws, twa, bs); e = eficiencia(ap.awa, d); bs += 0.5 * (p * e.ef - bs); }
      r.bs = bs; ap = aparente(tws, twa, bs); e = eficiencia(ap.awa, d);
    }
    r.aws = ap.aws; r.awa = ap.awa; r.alfa = ap.awa - d; r.est = e.est; r.ef = e.ef;
    r.velaVis = Math.min(d, ap.awa);
    r.vmg = r.bs * Math.cos(twa * D2R);
    r.setor = setorDe(twa);
    return r;
  }

  function melhorEscota(tws, rho) {
    var best = 50, v = -1;
    for (var e = 0; e <= 100; e += 2) { var r = calcular(tws, rho, e); if (r.bs > v + 1e-6) { v = r.bs; best = e; } }
    return best;
  }

  var SETORES = [
    { id: 'morta', a: 0, b: 35, nome: 'Zona morta', linhas: ['zona morta'], en: 'no-go zone', txt: 'Proa perto demais do vento: as velas panejam e o barco para. Também se diz "estar no vento" ou "aproado".' },
    { id: 'cerrada', a: 35, b: 55, nome: 'Bolina cerrada', linhas: ['bolina', 'cerrada'], en: 'close-hauled', txt: 'O mais perto do vento que o barco consegue andar bem: velas bem caçadas.' },
    { id: 'folgada', a: 55, b: 80, nome: 'Bolina folgada', linhas: ['bolina', 'folgada'], en: 'close reach', txt: 'Entre a bolina cerrada e o través: velas um pouco folgadas.' },
    { id: 'traves', a: 80, b: 100, nome: 'Través', linhas: ['través'], en: 'beam reach', txt: 'Vento entrando a cerca de 90°, pelo lado (pelo través) do barco.' },
    { id: 'largo', a: 100, b: 160, nome: 'Largo', linhas: ['largo'], en: 'broad reach', txt: 'Vento por trás do través; perto de 135° diz-se vento pela alheta. Velas bem folgadas.' },
    { id: 'popa', a: 160, b: 181, nome: 'Popa rasa', linhas: ['popa', 'rasa'], en: 'run', txt: 'Vento por trás, pela popa. A vela trabalha empurrada; cuidado com o jaibe involuntário.' },
  ];
  function setorDe(twa) { for (var i = 0; i < SETORES.length; i++) if (twa < SETORES[i].b) return SETORES[i]; return SETORES[SETORES.length - 1]; }

  var BIRUTAS = {
    fluxo: { rot: 'Birutas paralelas: fluxo certo', tipo: 'ok', txt: 'O ar corre colado pelos dois lados da vela. A regulagem está certa para este rumo.' },
    barlavento: { rot: 'A biruta de barlavento levanta', tipo: 'aviso', txt: 'A biruta do lado do vento sobe e dança: a vela está folgada demais para este rumo (ou você orçou). Cace a escota, ou arribe um pouco.' },
    sotavento: { rot: 'A biruta de sotavento cai', tipo: 'aviso', txt: 'A biruta do lado de dentro da curva (vista através da vela) cai ou gira: a vela está caçada demais e o fluxo descola (estol). Folgue a escota, ou orce um pouco.' },
    panejando: { rot: 'Vela panejando', tipo: 'erro', txt: 'A vela bate como bandeira: está tão folgada que o vento passa sem empurrar. Cace até a testa parar de panejar.' },
    novento: { rot: 'No vento: zona morta', tipo: 'erro', txt: 'Com a proa a menos de 35° do vento verdadeiro (neste modelo) nenhuma regulagem enche as velas. Arribe para sair da zona morta.' },
    arrasto: { rot: 'Vento de popa: vela empurrada', tipo: 'ok', txt: 'Com o vento aparente vindo de trás não existe fluxo colado: a vela trabalha por arrasto e as birutas caem, o que é normal. Folgada ao máximo, até perto do brandal, está certo.' },
    arrastoCacada: { rot: 'Vento de popa: vela caçada demais', tipo: 'aviso', txt: 'Com o vento por trás, a vela caçada pega menos vento. Folgue a escota até a vela ficar quase de través ao vento (perto do brandal).' },
  };

  var DESAFIOS = {
    traves: {
      titulo: 'Coloque o barco em través', inicio: { proa: 30, escota: 50 },
      enunciado: 'O barco está aproado, dentro da zona morta. Gire o barco até o vento verdadeiro entrar a 90° do lado (través), por qualquer bordo.',
      ok: function (r) { return r.twa >= 80 && r.twa <= 100; },
      certo: function (r) { return 'Través: o vento verdadeiro entra a ' + graus(r.twa) + ' da proa. Repare que o vento aparente está mais à proa (' + graus(r.awa) + '), porque o barco anda.'; },
      dica: function (r) { return r.twa < 80 ? 'Ainda está orçado demais: arribe (afaste a proa do vento) até ' + '90°.' : 'Passou do través: orce (aproxime a proa do vento) até 90°.'; },
    },
    birutas: {
      titulo: 'Cace até as birutas ficarem paralelas', inicio: { proa: -65, escota: 100 },
      enunciado: 'O barco está em bolina folgada com a escota toda folgada. Sem mudar o rumo, cace a escota até as duas birutas correrem paralelas.',
      ok: function (r) { return r.est === 'fluxo' && r.twa >= 55 && r.twa <= 80; },
      certo: function (r) { return 'Birutas paralelas com a vela a ' + graus(r.d) + ' da linha de centro e o vento aparente a ' + graus(r.awa) + ': ângulo de ataque de ' + graus(r.alfa) + '. O barco anda a ' + nos(r.bs) + '.'; },
      dica: function (r) { if (r.twa < 55 || r.twa > 80) return 'Mantenha a bolina folgada (55° a 80° do vento) e mexa só na escota.'; return BIRUTAS[r.est] ? BIRUTAS[r.est].txt : ''; },
    },
    cerrada: {
      titulo: 'Orce até a bolina cerrada sem entrar na zona morta', inicio: { proa: 100, escota: 60 },
      enunciado: 'Orce (traga a proa para perto do vento) até a bolina cerrada e cace a escota para manter as birutas paralelas. Se entrar na zona morta, o barco para.',
      ok: function (r) { return r.twa >= 38 && r.twa < 55 && r.est === 'fluxo'; },
      certo: function (r) { return 'Bolina cerrada a ' + graus(r.twa) + ' do vento, velas caçadas. Ganho para barlavento (VMG): ' + nos(r.vmg) + '. Orçar mais faria o barco perder velocidade e, abaixo de 35°, parar.'; },
      dica: function (r) { if (r.twa < 35) return 'Você entrou na zona morta: arribe um pouco.'; if (r.twa >= 55) return 'Ainda dá para orçar mais.'; return BIRUTAS[r.est] ? BIRUTAS[r.est].txt : ''; },
    },
    largo: {
      titulo: 'Arribe para um largo e folgue a escota', inicio: { proa: -50, escota: 20 },
      enunciado: 'Arribe (afaste a proa do vento) até um largo, entre 110° e 150° do vento, e folgue a escota até a vela trabalhar bem.',
      ok: function (r) { return r.twa >= 110 && r.twa <= 150 && (r.est === 'fluxo' || r.est === 'arrasto'); },
      certo: function (r) { return 'Largo a ' + graus(r.twa) + ' do vento, a ' + nos(r.bs) + '. Ao arribar o vento aparente foi para trás e a vela precisou ser folgada.'; },
      dica: function (r) { if (r.twa < 110 || r.twa > 150) return 'Coloque a proa entre 110° e 150° do vento verdadeiro.'; return BIRUTAS[r.est] ? BIRUTAS[r.est].txt : ''; },
    },
    popa: {
      titulo: 'Popa rasa com a vela bem folgada', inicio: { proa: 120, escota: 40 },
      enunciado: 'Arribe até a popa rasa (vento entrando por trás, a mais de 160° da proa) e folgue a escota até perto do brandal.',
      ok: function (r) { return r.twa >= 160 && r.est === 'arrasto'; },
      certo: function () { return 'Popa rasa com a vela folgada. Atenção: com o vento tão por trás, uma pequena guinada ou onda pode passar a retranca de bordo com violência (jaibe involuntário). Muitos preferem um largo e fazem jaibes controlados.'; },
      dica: function (r) { if (r.twa < 160) return 'Arribe mais: a proa precisa ficar a mais de 160° do vento.'; return BIRUTAS[r.est] ? BIRUTAS[r.est].txt : ''; },
    },
    aparente: {
      titulo: 'Por que o vento aparente fica mais à proa quando aceleramos?', tipo: 'pergunta', inicio: { proa: 60, escota: 25 },
      enunciado: 'Toque em "Ver acontecer" para acelerar o barco do zero até a velocidade de cruzeiro e observe o triângulo. Depois escolha a explicação certa.',
      alternativas: [
        { txt: 'Porque o barco em movimento cria um vento que sopra da proa (o vento do deslocamento), que se soma ao vento verdadeiro.', certa: true, por: 'Isso. O vento do deslocamento tem a velocidade do barco e vem sempre de proa. Quanto mais rápido, mais ele puxa a soma (o vento aparente) para a frente, e em bolina ou través também a deixa mais forte. Por isso, ao acelerar, é preciso caçar as velas.' },
        { txt: 'Porque o vento verdadeiro muda de direção quando o barco acelera.', certa: false, por: 'Não: o vento verdadeiro não depende do barco. O que muda é o vento sentido a bordo, que é a soma do verdadeiro com o vento do deslocamento.' },
        { txt: 'Porque a vela desvia o vento para a frente.', certa: false, por: 'Não: a vela desvia o fluxo atrás dela, mas o vento aparente é o mesmo que a biruta do topo do mastro mostra mesmo com as velas arriadas e o barco a motor.' },
      ],
    },
  };
  var ORDEM_DES = ['traves', 'birutas', 'cerrada', 'largo', 'popa', 'aparente'];

  /* ---------------------------------------------------------------- widget */
  VL.widgets.define('mareacao', {
    css: ['assets/css/widgets/mareacao.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var uid = 'mr' + (++contador);
      var limpezas = [];
      var st = {
        tws: clamp(opts.vento != null ? +opts.vento : 12, 4, 25),
        rho: n180(opts.proa != null ? +opts.proa : 60),
        esc: 50,
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        bsDemo: null,
      };
      st.esc = opts.escota != null ? clamp(+opts.escota, 0, 100) : melhorEscota(st.tws, st.rho);
      var listaDes = (Array.isArray(opts.desafios) && opts.desafios.length ? opts.desafios : ORDEM_DES).filter(function (k) { return DESAFIOS[k]; });
      if (!listaDes.length) listaDes = ORDEM_DES.slice();
      var des = { i: 0, feitos: {}, resp: null };
      var ultimo = null, visivel = true;

      /* ---------- moldura ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Mareação: rumo em relação ao vento, regulagem das velas e vento aparente', controlesAntes: true });
      el.appendChild(ins.raiz);
      ins.raiz.classList.add('mr-raiz');
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafios']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], 'aria-pressed': String(st.modo === m[0]), onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      ins.controles.appendChild(segModo);
      ins.legenda.appendChild(h('span', { class: 'mr-fonte' }, 'Modelo didático: triângulo de velocidades (soma de vetores) e polar aproximada de um veleiro de cruzeiro de exemplo (~32 pés). Faixas da rosa aproximadas: cada barco tem a sua zona morta.'));

      /* ---------- cena principal ---------- */
      var svg = S('svg', { class: 'mr-cena svg-interativo', viewBox: '0 0 440 490', role: 'slider', tabindex: '0', 'aria-label': 'Barco visto de cima. Arraste em volta do barco ou use as setas para girar a proa.', 'aria-valuemin': '-180', 'aria-valuemax': '180' });
      var gRosa = S('g', { class: 'mr-rosa' });
      var gVento = S('g', { class: 'mr-vento' });
      var gBarco = S('g', { class: 'mr-barco' });
      var gAp = S('g', { class: 'mr-ap' });
      svg.appendChild(gRosa); svg.appendChild(gVento); svg.appendChild(gAp); svg.appendChild(gBarco);
      var CX = 220, CY = 266, R1 = 118, R2 = 200;
      function pt(ang, r) { return [CX + r * Math.sin(ang * D2R), CY - r * Math.cos(ang * D2R)]; }
      function setorPath(a, b, ra, rb) {
        var p1 = pt(a, rb), p2 = pt(b, rb), p3 = pt(b, ra), p4 = pt(a, ra), g = Math.abs(b - a) > 180 ? 1 : 0;
        return 'M' + p1 + 'A' + rb + ',' + rb + ' 0 ' + g + ' 1 ' + p2 + 'L' + p3 + 'A' + ra + ',' + ra + ' 0 ' + g + ' 0 ' + p4 + 'Z';
      }
      var setorEls = {};
      SETORES.forEach(function (s) {
        var b = Math.min(s.b, 180);
        var els = [];
        [[s.a, b], [-b, -s.a]].forEach(function (par, k) {
          if (s.id === 'morta' && k === 1) return;
          var a0 = s.id === 'morta' ? -s.b : par[0], a1 = s.id === 'morta' ? s.b : par[1];
          var p = S('path', { d: setorPath(a0, a1, R1, R2), class: 'mr-setor mr-setor-' + s.id });
          gRosa.appendChild(p); els.push(p);
        });
        setorEls[s.id] = els;
      });
      /* divisórias e marcas de 10° */
      for (var g10 = 0; g10 < 360; g10 += 10) {
        var pa = pt(g10, R2), pb = pt(g10, R2 + (g10 % 30 === 0 ? 7 : 4));
        gRosa.appendChild(S('line', { x1: pa[0], y1: pa[1], x2: pb[0], y2: pb[1], class: 'mr-marca' }));
      }
      SETORES.forEach(function (s) {
        if (s.a === 0) return;
        [s.a, -s.a].forEach(function (a) { var p1 = pt(a, R1), p2 = pt(a, R2); gRosa.appendChild(S('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: 'mr-div' })); });
      });
      gRosa.appendChild(S('circle', { cx: CX, cy: CY, r: R1, class: 'mr-anel' }));
      gRosa.appendChild(S('circle', { cx: CX, cy: CY, r: R2, class: 'mr-anel' }));
      var rotEls = {};
      SETORES.forEach(function (s) {
        var mid = s.id === 'morta' ? 0 : (s.a + Math.min(s.b, 180)) / 2;
        var lados = s.id === 'morta' || s.id === 'popa' ? [mid] : [mid, -mid];
        rotEls[s.id] = [];
        lados.forEach(function (m) {
          var p = pt(m, (R1 + R2) / 2), t = S('text', { x: p[0], y: p[1] - (s.linhas.length - 1) * 8.5 + 5, class: 'mr-rot-setor', 'text-anchor': 'middle' });
          s.linhas.forEach(function (ln, i) { t.appendChild(S('tspan', { x: p[0], dy: i ? 17 : 0 }, ln)); });
          gRosa.appendChild(t); rotEls[s.id].push(t);
        });
      });
      gRosa.appendChild(S('text', { x: 10, y: 484, class: 'mr-rot-amura' }, 'amura de boreste'));
      gRosa.appendChild(S('text', { x: 430, y: 484, class: 'mr-rot-amura', 'text-anchor': 'end' }, 'amura de bombordo'));

      /* vento verdadeiro (do topo) */
      gVento.appendChild(S('line', { x1: CX, y1: 6, x2: CX, y2: 50, class: 'mr-vv' }));
      gVento.appendChild(S('polygon', { points: (CX - 8) + ',44 ' + (CX + 8) + ',44 ' + CX + ',60', class: 'mr-vv-ponta' }));
      var txtVV = S('text', { x: CX - 16, y: 24, class: 'mr-rot-vv', 'text-anchor': 'end' });
      gVento.appendChild(txtVV);
      [285, 345, 405].forEach(function (x) {
        gVento.appendChild(S('path', { d: 'M' + x + ',10 v26 m-5,-7 l5,7 l5,-7', class: 'mr-linha-vento' }));
      });

      /* barco (proa para cima no desenho local) */
      var casco = S('path', { class: 'mr-casco', d: 'M0,-64 C15,-48 22,-20 22,8 L20,56 Q0,60 -20,56 L-22,8 C-22,-20 -15,-48 0,-64 Z' });
      var cockpit = S('path', { class: 'mr-cockpit', d: 'M-10,24 L10,24 L11,50 L-11,50 Z' });
      var cabine = S('path', { class: 'mr-cabine', d: 'M-12,-26 Q0,-34 12,-26 L13,22 L-13,22 Z' });
      var genoa = S('path', { class: 'mr-vela mr-genoa' });
      var grande = S('path', { class: 'mr-vela mr-grande' });
      var retranca = S('line', { class: 'mr-retranca' });
      var mastro = S('circle', { r: 3.2, cx: 0, cy: -16, class: 'mr-mastro' });
      var proaMarca = S('circle', { r: 3, cx: 0, cy: -64, class: 'mr-proa' });
      gBarco.appendChild(casco); gBarco.appendChild(cabine); gBarco.appendChild(cockpit);
      gBarco.appendChild(genoa); gBarco.appendChild(retranca); gBarco.appendChild(grande); gBarco.appendChild(mastro); gBarco.appendChild(proaMarca);
      var alca = S('circle', { r: 26, cx: 0, cy: -86, class: 'mr-alca' });
      var alcaSeta = S('path', { d: 'M-14,-92 A16,16 0 0 1 14,-92 M10,-97 l4,5 l-6,2 M-10,-97 l-4,5 l6,2', class: 'mr-alca-seta' });
      gBarco.appendChild(alca); gBarco.appendChild(alcaSeta);
      /* vento aparente no barco */
      var apLinha = S('line', { class: 'mr-va' }), apPonta = S('polygon', { class: 'mr-va-ponta' }), apTxt = S('text', { class: 'mr-rot-va', 'text-anchor': 'middle' }, 'aparente');
      gAp.appendChild(apLinha); gAp.appendChild(apPonta); gAp.appendChild(apTxt);

      var dicaCena = h('p', { class: 'mr-dica-cena' }, 'Arraste em volta do barco para girar a proa.');
      var cenaWrap = h('div', { class: 'mr-cena-wrap' }, svg, dicaCena);

      /* ---------- painel lateral ---------- */
      var lado = h('div', { class: 'mr-lado' });
      var desBox = h('section', { class: 'mr-des', 'aria-label': 'Desafio', hidden: true });
      var leit = h('section', { class: 'mr-bloco mr-leituras', 'aria-label': 'Leituras' });
      var mareTit = h('p', { class: 'mr-mare' });
      var mareTxt = h('p', { class: 'mr-mare-txt' });
      var grade = h('dl', { class: 'mr-dl' });
      function linhaDl(rot, extra) { var dd = h('dd'); grade.appendChild(h('div', null, h('dt', null, rot, extra || null), dd)); return dd; }
      var ddAmura = linhaDl('Amura');
      var ddVV = linhaDl('Vento verdadeiro', h('span', { 'data-intl': 'on', class: 'mr-en' }, ' (true wind)'));
      var ddBS = linhaDl('Velocidade do barco');
      var ddVA = linhaDl('Vento aparente', h('span', { 'data-intl': 'on', class: 'mr-en' }, ' (apparent wind)'));
      var ddVela = linhaDl('Vela / ataque');
      var ddVMG = linhaDl('Ganho a barlavento', h('span', { 'data-intl': 'on', class: 'mr-en' }, ' (VMG)'));
      leit.appendChild(mareTit); leit.appendChild(mareTxt); leit.appendChild(grade);
      var aviso = h('p', { class: 'mr-aviso', hidden: true });
      leit.appendChild(aviso);

      /* triângulo de velocidades (proa para cima) */
      var tri = S('svg', { class: 'mr-tri', viewBox: '0 0 300 300', role: 'img', 'aria-label': 'Triângulo de velocidades com a proa para cima' });
      var tGrid = S('g', { class: 'mr-tri-grade' });
      tri.appendChild(tGrid);
      var TX = 150, TY = 156;
      var eixoProa = S('line', { x1: TX, y1: 14, x2: TX, y2: 290, class: 'mr-tri-eixo' });
      var rotProa = S('text', { x: TX + 5, y: 24, class: 'mr-tri-proa' }, 'proa');
      tGrid.appendChild(eixoProa); tGrid.appendChild(rotProa);
      var tBarco = S('path', { class: 'mr-tri-barco', d: 'M' + TX + ',' + (TY - 18) + ' c6,6 8,14 8,22 l-1,14 h-14 l-1,-14 c0,-8 2,-16 8,-22 z' });
      tri.appendChild(tBarco);
      var tArco = S('path', { class: 'mr-tri-arco' });
      tri.appendChild(tArco);
      function seta(cls) { var g = S('g', { class: cls }); var l = S('line'), p = S('polygon'), t = S('text', { 'text-anchor': 'middle' }); g.appendChild(l); g.appendChild(p); g.appendChild(t); tri.appendChild(g); return { g: g, l: l, p: p, t: t }; }
      var sVV = seta('mr-s-vv'), sVD = seta('mr-s-vd'), sVA = seta('mr-s-va');
      var tAng = S('text', { class: 'mr-tri-ang', 'text-anchor': 'middle' });
      tri.appendChild(tAng);
      var btnDemo = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: demo }, 'Ver acontecer');
      var demoTxt = h('p', { class: 'mr-demo-txt', 'aria-live': 'polite' });
      var triBox = h('section', { class: 'mr-bloco mr-tri-box', 'aria-label': 'Triângulo de velocidades' },
        h('h4', null, 'Triângulo de velocidades'),
        h('p', { class: 'mr-legenda-tri' },
          h('span', { class: 'mr-chave mr-chave-vv' }), 'verdadeiro ',
          h('span', { class: 'mr-chave mr-chave-vd' }), 'do deslocamento ',
          h('span', { class: 'mr-chave mr-chave-va' }), 'aparente'),
        tri, h('div', { class: 'mr-linha' }, btnDemo), demoTxt);

      /* birutas */
      var bir = S('svg', { class: 'mr-bir', viewBox: '0 0 300 150', role: 'img', 'aria-label': 'Birutas da genoa vistas do cockpit' });
      var bPano = S('path', { class: 'mr-bir-pano' });
      var bEstai = S('line', { x1: 42, y1: 6, x2: 34, y2: 146, class: 'mr-bir-estai' });
      bir.appendChild(bPano); bir.appendChild(bEstai);
      var bPares = [];
      [32, 76, 120].forEach(function (y, i) {
        var sot = S('path', { class: 'mr-bir-sot' }), bar = S('path', { class: 'mr-bir-bar' });
        bir.appendChild(sot); bir.appendChild(bar);
        bPares.push({ y: y, x: 78 - i * 3, sot: sot, bar: bar });
      });
      var birEst = h('p', { class: 'mr-bir-est' });
      var birTxt = h('p', { class: 'mr-bir-txt' });
      var birBox = h('section', { class: 'mr-bloco mr-bir-box', 'aria-label': 'Birutas da genoa' },
        h('h4', null, 'Birutas da genoa', h('span', { 'data-intl': 'on', class: 'mr-en' }, ' (telltales)')),
        bir,
        h('p', { class: 'mr-legenda-tri' }, h('span', { class: 'mr-chave mr-chave-bar' }), 'barlavento (do lado do vento) ', h('span', { class: 'mr-chave mr-chave-sot' }), 'sotavento (vista através do pano)'),
        birEst, birTxt);

      lado.appendChild(desBox); lado.appendChild(leit); lado.appendChild(birBox);

      /* ---------- ajustes ---------- */
      var inpVento = h('input', { type: 'range', min: '4', max: '25', step: '1', value: String(st.tws), 'aria-label': 'Velocidade do vento verdadeiro em nós' });
      var outVento = h('output', { class: 'mr-val' });
      inpVento.addEventListener('input', function () { st.tws = +inpVento.value; pararDemo(); atualizar(); });
      var inpEsc = h('input', { type: 'range', min: '0', max: '100', step: '1', value: String(st.esc), 'aria-label': 'Escota: de toda caçada (0) a toda folgada (100)' });
      var outEsc = h('output', { class: 'mr-val' });
      inpEsc.addEventListener('input', function () { st.esc = +inpEsc.value; pararDemo(); atualizar(); });
      function btn(txt, aria, fn) { return h('button', { type: 'button', class: 'btn btn-ghost', 'aria-label': aria, onclick: fn }, txt); }
      var bOrcar = btn('Orçar', 'Orçar: trazer a proa 5° para perto do vento', function () { girar(-1); });
      var bArribar = btn('Arribar', 'Arribar: afastar a proa 5° do vento', function () { girar(1); });
      var bCacar = btn('Caçar', 'Caçar a escota um pouco', function () { setEsc(st.esc - 5); });
      var bFolgar = btn('Folgar', 'Folgar a escota um pouco', function () { setEsc(st.esc + 5); });
      var outProa = h('output', { class: 'mr-val' });
      var ajustes = h('div', { class: 'mr-ajustes' },
        h('div', { class: 'mr-aj' }, h('span', { class: 'mr-aj-rot' }, 'Leme: ', outProa), h('div', { class: 'mr-linha' }, bOrcar, bArribar)),
        h('div', { class: 'mr-aj' }, h('label', { class: 'mr-aj-rot' }, 'Escota: ', outEsc), h('div', { class: 'mr-linha mr-linha-esc' }, bCacar, inpEsc, bFolgar)),
        h('div', { class: 'mr-aj' }, h('label', { class: 'mr-aj-rot' }, 'Vento verdadeiro: ', outVento), inpVento));
      var vivo = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });

      ins.corpo.appendChild(h('div', { class: 'mr-grade' }, h('div', { class: 'mr-col-cena' }, cenaWrap, ajustes, triBox), lado, vivo));

      /* ---------- interação ---------- */
      function setEsc(v) { st.esc = clamp(Math.round(v), 0, 100); inpEsc.value = String(st.esc); pararDemo(); atualizar(); }
      /** sentido: −1 = orçar (para o vento), +1 = arribar */
      function girar(sentido) {
        var lado0 = st.rho >= 0 ? 1 : -1;
        var twa = Math.abs(st.rho) + sentido * 5;
        if (twa > 180) { twa = 360 - twa; lado0 = -lado0; }
        if (twa < 0) { twa = -twa; lado0 = -lado0; }
        st.rho = n180(lado0 * twa);
        pararDemo(); atualizar();
      }
      function pontoSvg(ev) {
        var m = svg.getScreenCTM(); if (!m) return null;
        var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
        return p.matrixTransform(m.inverse());
      }
      var arrasto = null;
      function aoMover(ev) {
        if (!arrasto) return;
        var p = pontoSvg(ev); if (!p) return;
        var dx = p.x - CX, dy = p.y - CY;
        if (Math.hypot(dx, dy) < 8) return;
        var psi = Math.atan2(dx, -dy) / D2R;
        st.rho = Math.round(n180(-psi));
        atualizar();
      }
      svg.addEventListener('pointerdown', function (ev) {
        var p = pontoSvg(ev); if (!p) return;
        if (Math.hypot(p.x - CX, p.y - CY) > R2 + 20) return;
        arrasto = { id: ev.pointerId };
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura */ }
        pararDemo();
        svg.classList.add('mr-arrastando');
        aoMover(ev);
        ev.preventDefault();
      });
      svg.addEventListener('pointermove', aoMover);
      function soltar() { arrasto = null; svg.classList.remove('mr-arrastando'); }
      svg.addEventListener('pointerup', soltar);
      svg.addEventListener('pointercancel', soltar);
      svg.addEventListener('keydown', function (ev) {
        var k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') {
          ev.preventDefault();
          var psi = -st.rho + (k === 'ArrowRight' ? 5 : -5);
          st.rho = n180(-psi); pararDemo(); atualizar();
        } else if (k === 'ArrowUp' || k === 'ArrowDown') { ev.preventDefault(); girar(k === 'ArrowUp' ? -1 : 1); }
      });

      /* ---------- desenho ---------- */
      function velaPath(x0, y0, comp, ang, ladoSot, bolsa, panejo, t) {
        /* ang: ângulo da vela a partir da linha de centro (graus, popa = 0) para o bordo ladoSot */
        var dx = ladoSot * Math.sin(ang * D2R), dy = Math.cos(ang * D2R);
        var x1 = x0 + comp * dx, y1 = y0 + comp * dy;
        var nx = ladoSot * Math.cos(ang * D2R), ny = -Math.sin(ang * D2R);
        if (panejo) {
          var d = 'M' + r1(x0) + ',' + r1(y0);
          for (var i = 1; i <= 10; i++) {
            var f = i / 10, amp = 4.5 * Math.sin(Math.PI * f) * Math.sin(f * 9 + t * 0.018);
            d += ' L' + r1(x0 + comp * dx * f + nx * amp) + ',' + r1(y0 + comp * dy * f + ny * amp);
          }
          return d;
        }
        var cxp = x0 + comp * dx * 0.4 + nx * comp * bolsa, cyp = y0 + comp * dy * 0.4 + ny * comp * bolsa;
        return 'M' + r1(x0) + ',' + r1(y0) + ' Q' + r1(cxp) + ',' + r1(cyp) + ' ' + r1(x1) + ',' + r1(y1);
      }
      function birutaPath(x0, y0, modo, t, fase) {
        var ang, amp, len = 46, onda = 0.16;
        if (modo === 'reta') { ang = 0; amp = 1.4; }
        else if (modo === 'sobe') { ang = -48 + 10 * Math.sin(t * 0.011 + fase); amp = 4.5; onda = 0.22; }
        else if (modo === 'cai') { ang = 62 + 18 * Math.sin(t * 0.006 + fase); amp = 3; len = 34; }
        else if (modo === 'pendurada') { ang = 80 + 4 * Math.sin(t * 0.004 + fase); amp = 1.2; len = 36; }
        else { ang = 50 * Math.sin(t * 0.017 + fase * 2.3); amp = 6; onda = 0.25; }
        var ca = Math.cos(ang * D2R), sa = Math.sin(ang * D2R), d = 'M' + x0 + ',' + y0;
        for (var i = 1; i <= 9; i++) {
          var s = i / 9 * len, w = amp * (i / 9) * Math.sin(s * onda - t * 0.02 + fase);
          d += ' L' + r1(x0 + s * ca - w * sa) + ',' + r1(y0 + s * sa + w * ca);
        }
        return d;
      }
      var tAnim = 0;
      function desenhar(r) {
        var psi = -r.rho; /* proa (graus, horário a partir do topo); vento do topo */
        gBarco.setAttribute('transform', 'translate(' + CX + ',' + CY + ') rotate(' + r1(psi) + ')');
        var sot = -r.lado; /* sotavento: contrário ao lado de onde vem o vento */
        var panejo = r.est === 'panejando' || r.est === 'novento';
        var aVis = r.est === 'novento' ? Math.min(r.awa, 25) : r.velaVis;
        var t = reduzMov() ? 0 : tAnim;
        /* grande: retranca a partir do mastro (0,−16), comprimento 58 */
        var ang = clamp(aVis, 0, 86);
        retranca.setAttribute('x1', 0); retranca.setAttribute('y1', -16);
        retranca.setAttribute('x2', r1(58 * sot * Math.sin(ang * D2R))); retranca.setAttribute('y2', r1(-16 + 58 * Math.cos(ang * D2R)));
        grande.setAttribute('d', velaPath(0, -16, 58, ang, sot, 0.11, panejo, t));
        genoa.setAttribute('d', velaPath(0, -60, 70, clamp(ang + 2, 0, 80), sot, 0.12, panejo, t + 300));
        var cls = 'mr-vela-' + (r.est === 'fluxo' || r.est === 'arrasto' ? 'ok' : panejo ? 'pan' : 'mal');
        grande.setAttribute('class', 'mr-vela mr-grande ' + cls); genoa.setAttribute('class', 'mr-vela mr-genoa ' + cls);
        /* setores */
        SETORES.forEach(function (s) {
          var on = s.id === r.setor.id;
          setorEls[s.id].forEach(function (p) { p.classList.toggle('mr-ativo', on); });
          rotEls[s.id].forEach(function (p) { p.classList.toggle('mr-ativo', on); });
        });
        /* vento aparente no mundo: vem de psi + lado·awa */
        var aw = psi + r.lado * r.awa, pa = pt(aw, 110), pb = pt(aw, 78);
        apLinha.setAttribute('x1', r1(pa[0])); apLinha.setAttribute('y1', r1(pa[1])); apLinha.setAttribute('x2', r1(pb[0])); apLinha.setAttribute('y2', r1(pb[1]));
        var ux = (pb[0] - pa[0]) / 30, uy = (pb[1] - pa[1]) / 30;
        apPonta.setAttribute('points', r1(pb[0] + ux * 9) + ',' + r1(pb[1] + uy * 9) + ' ' + r1(pb[0] - uy * 6) + ',' + r1(pb[1] + ux * 6) + ' ' + r1(pb[0] + uy * 6) + ',' + r1(pb[1] - ux * 6));
        var pt3 = pt(aw, 96), off = 14;
        apTxt.setAttribute('x', r1(pt3[0] + uy * off * (r.lado))); apTxt.setAttribute('y', r1(pt3[1] - ux * off * (r.lado) + 4));
        txtVV.textContent = 'vento verdadeiro · ' + VL.fmt.num(r.tws, 0) + ' nós';

        /* triângulo: escala fixa para cada vento; o desenho é centrado no quadro */
        var esc = 240 / (r.tws + polarMax(r.tws));
        var ufx = Math.sin(r.rho * D2R), ufy = -Math.cos(r.rho * D2R); /* de onde vem o verdadeiro (tela, proa p/ cima) */
        var Q2 = [0, 0], Q1 = [0, -r.bs * esc], Q0 = [ufx * r.tws * esc, -r.bs * esc + ufy * r.tws * esc];
        var minx = Math.min(Q0[0], Q1[0], Q2[0]), maxx = Math.max(Q0[0], Q1[0], Q2[0]), miny = Math.min(Q0[1], Q1[1], Q2[1] - 30), maxy = Math.max(Q0[1], Q1[1], Q2[1] + 22);
        var ox = 150 - (minx + maxx) / 2, oy = 150 - (miny + maxy) / 2;
        function T(q) { return [q[0] + ox, q[1] + oy]; }
        var P0 = T(Q0), P1 = T(Q1), P2 = T(Q2);
        var G = [(P0[0] + P1[0] + P2[0]) / 3, (P0[1] + P1[1] + P2[1]) / 3];
        tBarco.setAttribute('transform', 'translate(' + r1(P2[0] - TX) + ',' + r1(P2[1] - (TY - 18) + 6) + ')');
        eixoProa.setAttribute('x1', r1(P2[0])); eixoProa.setAttribute('x2', r1(P2[0])); eixoProa.setAttribute('y2', r1(P2[1]));
        rotProa.setAttribute('x', r1(P2[0] + 5));
        function porSeta(sx, a, b, rot, ladoTxt) {
          sx.l.setAttribute('x1', r1(a[0])); sx.l.setAttribute('y1', r1(a[1])); sx.l.setAttribute('x2', r1(b[0])); sx.l.setAttribute('y2', r1(b[1]));
          var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          sx.g.style.display = L < 2 ? 'none' : '';
          if (L < 2) return;
          var ux2 = (b[0] - a[0]) / L, uy2 = (b[1] - a[1]) / L;
          sx.p.setAttribute('points', r1(b[0]) + ',' + r1(b[1]) + ' ' + r1(b[0] - ux2 * 11 - uy2 * 5.5) + ',' + r1(b[1] - uy2 * 11 + ux2 * 5.5) + ' ' + r1(b[0] - ux2 * 11 + uy2 * 5.5) + ',' + r1(b[1] - uy2 * 11 - ux2 * 5.5));
          var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
          /* rótulo para fora do triângulo (oposto ao centroide); se degenerado, para o lado pedido */
          var nx = -uy2, ny = ux2;
          var dG = (mx - G[0]) * nx + (my - G[1]) * ny;
          if (Math.abs(dG) > 1.5) { if (dG < 0) { nx = -nx; ny = -ny; } } else { nx *= ladoTxt; ny *= ladoTxt; }
          var tx = clamp(mx + nx * 20, 36, 264), ty = clamp(my + ny * 20 + 5, 16, 292);
          sx.t.setAttribute('x', r1(tx)); sx.t.setAttribute('y', r1(ty)); sx.t.textContent = rot;
        }
        var ladoT = r.lado >= 0 ? 1 : -1;
        porSeta(sVV, P0, P1, VL.fmt.num(r.tws, 0) + ' nós', -ladoT);
        porSeta(sVD, P1, P2, VL.fmt.num(r.bs, 1) + ' nós', ladoT);
        porSeta(sVA, P0, P2, VL.fmt.num(r.aws, 1) + ' nós', ladoT);
        /* arco do ângulo aparente a partir da proa */
        var ra = 30, a1 = r.lado * r.awa;
        var q0 = [P2[0], P2[1] - ra], q1 = [P2[0] + ra * Math.sin(a1 * D2R), P2[1] - ra * Math.cos(a1 * D2R)];
        tArco.setAttribute('d', 'M' + r1(q0[0]) + ',' + r1(q0[1]) + ' A' + ra + ',' + ra + ' 0 0 ' + (r.lado > 0 ? 1 : 0) + ' ' + r1(q1[0]) + ',' + r1(q1[1]));
        var am = a1 / 2, qa = [P2[0] + (ra + 16) * Math.sin(am * D2R), P2[1] - (ra + 16) * Math.cos(am * D2R) + 5];
        tAng.setAttribute('x', r1(qa[0])); tAng.setAttribute('y', r1(qa[1])); tAng.textContent = graus(r.awa);

        /* birutas */
        var mb = 'reta', ms = 'reta';
        if (r.est === 'barlavento') { mb = 'sobe'; }
        else if (r.est === 'sotavento') { ms = 'cai'; }
        else if (r.est === 'panejando' || r.est === 'novento') { mb = 'caos'; ms = 'caos'; }
        else if (r.est === 'arrasto' || r.est === 'arrastoCacada') { mb = 'pendurada'; ms = 'pendurada'; }
        bPares.forEach(function (p, i) {
          var mbi = mb, msi = ms;
          /* em cima a vela torce mais: no limite, a biruta de cima reage primeiro */
          if (r.est === 'fluxo' && i === 0 && r.alfa < 12) mbi = 'sobe';
          if (r.est === 'fluxo' && i === 2 && r.alfa > 23) msi = 'cai';
          p.bar.setAttribute('d', birutaPath(p.x, p.y, mbi, t, i * 1.7));
          p.sot.setAttribute('d', birutaPath(p.x + 2, p.y + 3, msi, t + 200, i * 2.1 + 1));
        });
        var corBar = r.lado > 0 ? 'mr-cor-verde' : 'mr-cor-verm', corSot = r.lado > 0 ? 'mr-cor-verm' : 'mr-cor-verde';
        bPares.forEach(function (p) { p.bar.setAttribute('class', 'mr-bir-bar ' + corBar); p.sot.setAttribute('class', 'mr-bir-sot ' + corSot); });
        var dp = 'M42,6 C' + (panejo ? '70,30 50,60 72,80 S48,120 34,146' : '58,40 58,100 34,146') + ' L300,146 L300,6 Z';
        if (panejo && t) { var w = 8 * Math.sin(t * 0.02); dp = 'M42,6 C' + r1(66 + w) + ',30 ' + r1(50 - w) + ',60 ' + r1(70 + w) + ',80 S' + r1(48 - w) + ',120 34,146 L300,146 L300,6 Z'; }
        bPano.setAttribute('d', dp);
      }

      function atualizar() {
        var r = calcular(st.tws, st.rho, st.esc, st.bsDemo);
        ultimo = r;
        desenhar(r);
        var s = r.setor;
        mareTit.textContent = s.nome;
        if (VL.settings.get('intl')) mareTit.appendChild(h('span', { class: 'mr-en' }, ' (' + s.en + ')'));
        mareTxt.textContent = s.txt;
        ddAmura.textContent = r.twa >= 179.5 ? 'vento exatamente pela popa' : (r.lado > 0 ? 'amurado a boreste' : 'amurado a bombordo') + ' (vento entra por ' + (r.lado > 0 ? 'boreste' : 'bombordo') + ')';
        ddVV.textContent = nos(r.tws) + ' · ' + graus(r.twa) + ' da proa';
        ddBS.textContent = nos(r.bs) + (st.bsDemo != null ? ' (demonstração)' : '');
        ddVA.textContent = nos(r.aws) + ' · ' + graus(r.awa) + ' da proa';
        ddVela.textContent = graus(r.velaVis) + ' da linha de centro · ataque ' + (r.est === 'novento' ? 'sem efeito' : graus(r.alfa));
        ddVMG.textContent = r.vmg >= 0 ? nos(r.vmg) + ' para barlavento' : nos(-r.vmg) + ' para sotavento';
        var b = BIRUTAS[r.est];
        birEst.textContent = b.rot; birEst.setAttribute('data-tipo', b.tipo);
        birTxt.textContent = b.txt;
        var avisoTxt = '';
        if (r.twa >= 165) avisoTxt = 'Vento quase pela popa: risco de jaibe involuntário. A retranca pode cruzar o cockpit com violência; mantenha a cabeça abaixo dela e considere uma retenida (preventer).';
        else if (r.twa >= 35 && r.twa < 40) avisoTxt = 'Orçado demais: na beira da zona morta o barco perde muita velocidade. Arribe alguns graus.';
        aviso.hidden = !avisoTxt; aviso.textContent = avisoTxt;
        outVento.textContent = nos(st.tws);
        outEsc.textContent = st.esc <= 3 ? 'toda caçada' : st.esc >= 97 ? 'toda folgada' : st.esc + '% folgada';
        outProa.textContent = graus(r.twa) + ' do vento, por ' + (r.lado > 0 ? 'boreste' : 'bombordo');
        svg.setAttribute('aria-valuenow', String(Math.round(r.rho)));
        svg.setAttribute('aria-valuetext', 'Vento a ' + graus(r.twa) + ' da proa por ' + (r.lado > 0 ? 'boreste' : 'bombordo') + ', ' + s.nome + '. ' + b.rot + '.');
        anunciar(s.nome + '. ' + b.rot + '.');
        if (st.modo === 'desafio') atualizarDesafio(false);
        precisaAnimar();
      }

      var anuncioT = null, ultimoAnuncio = '';
      function anunciar(txt) {
        if (txt === ultimoAnuncio) return;
        clearTimeout(anuncioT);
        anuncioT = setTimeout(function () { ultimoAnuncio = txt; vivo.textContent = txt; }, 700);
      }
      limpezas.push(function () { clearTimeout(anuncioT); });

      /* ---------- animação (birutas e panejo) ---------- */
      var raf = null;
      function precisaAnimar() {
        if (reduzMov() || !visivel || raf) return;
        raf = requestAnimationFrame(passo);
      }
      function passo(ts) {
        raf = null;
        if (!visivel || reduzMov()) return;
        tAnim = ts;
        if (ultimo) desenhar(ultimo);
        raf = requestAnimationFrame(passo);
      }
      limpezas.push(function () { if (raf) cancelAnimationFrame(raf); raf = null; });
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (ents) { visivel = ents[0].isIntersecting; if (visivel) precisaAnimar(); });
        io.observe(ins.raiz);
        limpezas.push(function () { io.disconnect(); });
      }

      /* ---------- demonstração: acelerar do zero ---------- */
      var demoAnim = null;
      function pararDemo() {
        if (demoAnim) { cancelAnimationFrame(demoAnim); demoAnim = null; }
        if (st.bsDemo != null) { st.bsDemo = null; }
        btnDemo.textContent = 'Ver acontecer';
      }
      function demo() {
        if (demoAnim) { pararDemo(); atualizar(); return; }
        var alvo = calcular(st.tws, st.rho, st.esc).bs;
        var parado = calcular(st.tws, st.rho, st.esc, 0);
        var andando = calcular(st.tws, st.rho, st.esc);
        demoTxt.textContent = 'Parado: aparente = verdadeiro (' + graus(parado.awa) + ', ' + nos(parado.aws) + '). A ' + nos(andando.bs) + ': aparente a ' + graus(andando.awa) + ' da proa, com ' + nos(andando.aws) + '.';
        if (alvo < 0.2) { demoTxt.textContent = 'Na zona morta o barco não anda: saia dela primeiro.'; return; }
        if (reduzMov()) { atualizar(); return; }
        var t0 = performance.now(), dur = 3200;
        btnDemo.textContent = 'Parar';
        var f = function (agora) {
          var k = clamp((agora - t0) / dur, 0, 1);
          st.bsDemo = alvo * k; atualizar();
          if (k < 1) demoAnim = requestAnimationFrame(f);
          else { demoAnim = null; st.bsDemo = null; btnDemo.textContent = 'Ver de novo'; atualizar(); }
        };
        demoAnim = requestAnimationFrame(f);
      }
      limpezas.push(function () { if (demoAnim) cancelAnimationFrame(demoAnim); });

      /* ---------- desafios ---------- */
      function trocarModo(m) {
        st.modo = m;
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        desBox.hidden = m !== 'desafio';
        if (m === 'desafio') iniciarDesafio(des.i);
        else atualizar();
      }
      function iniciarDesafio(i) {
        des.i = (i + listaDes.length) % listaDes.length; des.resp = null;
        var d = DESAFIOS[listaDes[des.i]];
        st.rho = n180(d.inicio.proa); st.esc = d.inicio.escota; inpEsc.value = String(st.esc);
        pararDemo();
        desBox.innerHTML = '';
        var feitos = Object.keys(des.feitos).length;
        desBox.appendChild(h('p', { class: 'mr-des-n' }, 'Desafio ' + (des.i + 1) + ' de ' + listaDes.length + (feitos ? ' · ' + feitos + ' resolvido' + (feitos > 1 ? 's' : '') : '')));
        desBox.appendChild(h('h4', null, d.titulo));
        desBox.appendChild(h('p', null, d.enunciado));
        var fb = h('div', { class: 'mr-des-fb', 'aria-live': 'polite' });
        if (d.tipo === 'pergunta') {
          var lista = h('div', { class: 'mr-alts', role: 'group', 'aria-label': 'Alternativas' });
          VL.embaralhar(d.alternativas).forEach(function (a) {
            lista.appendChild(h('button', { type: 'button', class: 'alternativa', onclick: function (ev) {
              VL.$$('.alternativa', lista).forEach(function (b) { b.removeAttribute('data-res'); });
              ev.currentTarget.setAttribute('data-res', a.certa ? 'certa' : 'errada');
              fb.innerHTML = '';
              fb.appendChild(h('p', { class: 'mr-fb-' + (a.certa ? 'ok' : 'erro') }, h('strong', null, a.certa ? 'Certo. ' : 'Ainda não. '), a.por));
              if (a.certa) des.feitos[listaDes[des.i]] = true;
            } }, a.txt));
          });
          desBox.appendChild(lista);
        } else {
          desBox.appendChild(h('div', { class: 'mr-linha' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { atualizarDesafio(true); } }, 'Verificar')));
        }
        desBox.appendChild(fb);
        des.fb = fb;
        desBox.appendChild(h('div', { class: 'mr-linha mr-des-nav' },
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { iniciarDesafio(des.i - 1); } }, 'Anterior'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { iniciarDesafio(des.i); } }, 'Recomeçar'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { iniciarDesafio(des.i + 1); } }, 'Próximo')));
        atualizar();
      }
      function atualizarDesafio(verificar) {
        var d = DESAFIOS[listaDes[des.i]];
        if (!d || d.tipo === 'pergunta' || !ultimo || !verificar) return;
        var r = ultimo, fb = des.fb;
        fb.innerHTML = '';
        if (d.ok(r)) {
          des.feitos[listaDes[des.i]] = true;
          fb.appendChild(h('p', { class: 'mr-fb-ok' }, h('strong', null, 'Certo. '), d.certo(r)));
        } else {
          fb.appendChild(h('p', { class: 'mr-fb-erro' }, h('strong', null, 'Ainda não. '), d.dica(r)));
        }
      }

      limpezas.push(VL.on('settings', function () { atualizar(); }));
      if (st.modo === 'desafio') trocarModo('desafio'); else atualizar();

      return function () { limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } }); };
    },
  });
})();
