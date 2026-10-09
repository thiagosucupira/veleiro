/* Marés: tábua de EXEMPLO no formato da Tábua das Marés da DHN (horas e alturas de preamar e baixa-mar, acima
   do Nível de Redução), curva da maré, altura num horário pelo método do cosseno (o mesmo das Tabelas I e II da
   DHN) e pela regra dos doze avos, comparação dos dois, folga abaixo da quilha, altura de maré necessária,
   janela de horário para passar num baixio e sizígia x quadratura num mini-diagrama Sol–Terra–Lua.
   Modo exercício com problemas gerados e correção passo a passo.

   As marés são FICTÍCIAS (modelo simples M2 + S2 + K1 de um porto semidiurno); as fases da Lua são reais,
   calculadas pelo algoritmo de Meeus (Astronomical Algorithms, 2ª ed., cap. 49). Nunca use para navegar:
   a tábua oficial é a da DHN/CHM (https://www.marinha.mil.br/chm/tabuas-de-mare).

   Referências: Manual de Navegação da Marinha do Brasil, Vol. I (DHN, 2ª rev. 2023), cap. 10 (itens 10.1.3 a
   10.1.10); Carta 12000 (INT 1), DHN — alturas de secagem sublinhadas, acima do NR.

   opts (todas opcionais):
     modo:      'explorar' (padrão) | 'exercicio'
     vista:     'altura' (padrão) | 'baixio' | 'lua'
     inicio:    primeiro dia da tábua, 'AAAA-MM-DD' (padrão: hoje)
     dia:       índice do dia selecionado, 0 a 6 (padrão 0)
     sondagem:  profundidade da carta em m (padrão 1,2; negativa = altura de secagem)
     calado:    calado do barco em m (padrão 1,8)
     folga:     folga desejada abaixo da quilha em m (padrão 0,5)
     exercicio: tipo inicial: 'altura-cos' (padrão) | 'altura-12' | 'folga' | 'necessaria' | 'janela' | 'conceitos'

   Exemplo de bloco de lição:
     {t:'widget', w:'mares', opts:{vista:'baixio', sondagem:-0.4, calado:1.6}}
     {t:'widget', w:'mares', opts:{modo:'exercicio', exercicio:'janela'}} */
(function () {
  'use strict';
  var h = VL.h;
  var RAD = Math.PI / 180;
  var FUSO = 3;   // hora legal de Brasília: UTC = hora local + 3 h
  // modelo do porto fictício (m e graus); fases escolhidas para a maior maré ~1,5 dia após a Lua nova/cheia
  var MOD = { Z0: 1.70, M2: 1.25, gM: 90, S2: 0.42, gS: 126.6, K1: 0.06, gK: 40 };
  var SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var FASES = ['Lua nova', 'Quarto crescente', 'Lua cheia', 'Quarto minguante'];
  var DOZE = [0, 1, 3, 6, 9, 11, 12];   // doze avos acumulados ao fim de cada "hora de maré"

  /* ---------------- fases da Lua (Meeus, cap. 49) ---------------- */
  function sn(x) { return Math.sin(x * RAD); }
  function cs(x) { return Math.cos(x * RAD); }
  function faseJDE(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    var jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;
    var E = 1 - 0.002516 * T - 0.0000074 * T2;
    var M = 2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3;
    var Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4;
    var F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4;
    var O = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;
    var q = Math.round((k - Math.floor(k)) * 4) % 4, c;
    if (q === 0 || q === 2) {
      var a = q === 0 ? [-0.40720, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208] : [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209];
      c = a[0] * sn(Mp) + a[1] * E * sn(M) + a[2] * sn(2 * Mp) + a[3] * sn(2 * F) + a[4] * E * sn(Mp - M) + a[5] * E * sn(Mp + M) + a[6] * E * E * sn(2 * M) -
        0.00111 * sn(Mp - 2 * F) - 0.00057 * sn(Mp + 2 * F) + 0.00056 * E * sn(2 * Mp + M) - 0.00042 * sn(3 * Mp) + 0.00042 * E * sn(M + 2 * F) +
        0.00038 * E * sn(M - 2 * F) - 0.00024 * E * sn(2 * Mp - M) - 0.00017 * sn(O) - 0.00007 * sn(Mp + 2 * M) + 0.00004 * sn(2 * Mp - 2 * F) +
        0.00004 * sn(3 * M) + 0.00003 * sn(Mp + M - 2 * F) + 0.00003 * sn(2 * Mp + 2 * F) - 0.00003 * sn(Mp + M + 2 * F) + 0.00003 * sn(Mp - M + 2 * F) -
        0.00002 * sn(Mp - M - 2 * F) - 0.00002 * sn(3 * Mp + M) + 0.00002 * sn(4 * Mp);
    } else {
      c = -0.62801 * sn(Mp) + 0.17172 * E * sn(M) - 0.01183 * E * sn(Mp + M) + 0.00862 * sn(2 * Mp) + 0.00804 * sn(2 * F) + 0.00454 * E * sn(Mp - M) +
        0.00204 * E * E * sn(2 * M) - 0.00180 * sn(Mp - 2 * F) - 0.00070 * sn(Mp + 2 * F) - 0.00040 * sn(3 * Mp) - 0.00034 * E * sn(2 * Mp - M) +
        0.00032 * E * sn(M + 2 * F) + 0.00032 * E * sn(M - 2 * F) - 0.00028 * E * E * sn(Mp + 2 * M) + 0.00027 * E * sn(2 * Mp + M) - 0.00017 * sn(O) -
        0.00005 * sn(Mp - M - 2 * F) + 0.00004 * sn(2 * Mp + 2 * F) - 0.00004 * sn(Mp + M + 2 * F) + 0.00004 * sn(Mp - 2 * M) + 0.00003 * sn(Mp + M - 2 * F) +
        0.00003 * sn(3 * M) + 0.00002 * sn(2 * Mp - 2 * F) + 0.00002 * sn(Mp - M + 2 * F) - 0.00002 * sn(3 * Mp + M);
      var W = 0.00306 - 0.00038 * E * cs(M) + 0.00026 * cs(Mp) - 0.00002 * cs(Mp - M) + 0.00002 * cs(Mp + M) + 0.00002 * cs(2 * F);
      c += q === 1 ? W : -W;
    }
    var A = [299.77 + 0.107408 * k - 0.009173 * T2, 251.88 + 0.016321 * k, 251.83 + 26.651886 * k, 349.42 + 36.412478 * k, 84.66 + 18.206239 * k,
      141.74 + 53.303771 * k, 207.14 + 2.453732 * k, 154.84 + 7.306860 * k, 34.52 + 27.261239 * k, 207.19 + 0.121824 * k, 291.34 + 1.844379 * k,
      161.72 + 24.198154 * k, 239.56 + 25.513099 * k, 331.55 + 3.592518 * k];
    var Ac = [0.000325, 0.000165, 0.000164, 0.000126, 0.000110, 0.000062, 0.000060, 0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000035, 0.000023];
    for (var i = 0; i < 14; i++) c += Ac[i] * sn(A[i]);
    return jde + c;
  }
  /** Fases entre dois dias julianos (UT ≈ TT − 69 s). */
  function fasesEntre(jd0, jd1) {
    var out = [], k0 = Math.floor((jd0 - 2451550.09766) / 29.530588861) - 1;
    for (var k = k0; k < k0 + 40; k++) {
      for (var q = 0; q < 4; q++) { var j = faseJDE(k + q / 4) - 69 / 86400; if (j > jd1) return out; if (j >= jd0) out.push({ jd: j, tipo: q }); }
    }
    return out;
  }

  /* ---------------- formatação ---------------- */
  function num(x, c) { return VL.fmt.num(x, c).replace('-', '−'); }   // sinal de menos tipográfico
  function m1(x) { return num(Math.round(x * 10) / 10, 1) + ' m'; }
  function m2(x) { return num(Math.round(x * 100) / 100, 2) + ' m'; }
  function hhmm(t) { t = ((Math.round(t) % 1440) + 1440) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + String(t % 60).padStart(2, '0'); }
  function dur(min) { min = Math.round(min); return Math.floor(min / 60) + 'h' + String(min % 60).padStart(2, '0'); }
  function lerNum(v) { if (v == null) return NaN; v = String(v).trim().replace(',', '.').replace(/[\u2212\u2013]/g, '-'); return v === '' ? NaN : Number(v); }
  function lerHora(v) { var s = String(v || '').replace(/\D/g, ''); if (s.length < 3 || s.length > 4) return NaN; s = s.padStart(4, '0'); var hh = +s.slice(0, 2), mm = +s.slice(2); return hh > 24 || mm > 59 ? NaN : hh * 60 + mm; }
  function aleat(a, b) { return a + Math.random() * (b - a); }
  function escolha(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function intl(txt) { return VL.settings.get('intl') ? ' (' + txt + ')' : ''; }
  function reduzMov() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------------- motor de marés ---------------- */
  function criarMare(Y, Mo, D) {
    var jd0 = Date.UTC(Y, Mo - 1, D) / 86400000 + 2440587.5 + FUSO / 24;   // 00:00 hora local do dia 0
    var fases = fasesEntre(jd0 - 45, jd0 + 45);
    function elong(t) {
      var jd = jd0 + t / 1440;
      for (var i = 0; i < fases.length - 1; i++) { var a = fases[i], b = fases[i + 1]; if (jd >= a.jd && jd < b.jd) return a.tipo * 90 + 90 * (jd - a.jd) / (b.jd - a.jd); }
      return 0;
    }
    function modelo(t) {
      var H = 15 * (t / 60) - 180, Dg = elong(t);
      return MOD.Z0 + MOD.M2 * cs(2 * H - 2 * Dg - MOD.gM) + MOD.S2 * cs(2 * H - MOD.gS) + MOD.K1 * cs(H - MOD.gK);
    }
    var ext = [], prev = modelo(-1441), cur = modelo(-1440);
    for (var t = -1440; t < 9 * 1440; t++) {
      var nx = modelo(t + 1);
      if ((cur - prev) * (nx - cur) < 0) ext.push({ t: t, h: Math.round(cur * 10) / 10, tipo: nx < cur ? 'PM' : 'BM' });
      prev = cur; cur = nx;
    }
    var dias = [];
    for (var d = 0; d < 7; d++) {
      var dt = new Date(Date.UTC(Y, Mo - 1, D + d));
      var evs = ext.filter(function (e) { return e.t >= d * 1440 && e.t < (d + 1) * 1440; });
      var fz = fases.filter(function (f) { return f.jd >= jd0 + d && f.jd < jd0 + d + 1; })[0] || null;
      dias.push({ d: d, data: dt, rot: SEM[dt.getUTCDay()] + ' ' + String(dt.getUTCDate()).padStart(2, '0') + '/' + String(dt.getUTCMonth() + 1).padStart(2, '0'), eventos: evs, fase: fz ? { tipo: fz.tipo, hora: Math.round((fz.jd - jd0 - d) * 1440) } : null });
    }
    function seg(t) { for (var i = 0; i < ext.length - 1; i++) if (t >= ext[i].t && t < ext[i + 1].t) return { a: ext[i], b: ext[i + 1] }; return { a: ext[0], b: ext[1] }; }
    function fracCos(x) { return (1 - Math.cos(Math.PI * x)) / 2; }
    function fracDoze(x) { var u = Math.max(0, Math.min(6, x * 6)), i = Math.min(5, Math.floor(u)); return (DOZE[i] + (u - i) * (DOZE[i + 1] - DOZE[i])) / 12; }
    function hCos(t) { var s = seg(t), x = (t - s.a.t) / (s.b.t - s.a.t); return s.a.h + (s.b.h - s.a.h) * fracCos(x); }
    function hDoze(t) { var s = seg(t), x = (t - s.a.t) / (s.b.t - s.a.t); return s.a.h + (s.b.h - s.a.h) * fracDoze(x); }
    function janelas(nec, t0, t1) {
      var out = [], dentro = false, ini = 0;
      for (var tt = t0; tt <= t1; tt++) {
        var ok = hCos(tt) >= nec - 1e-9;
        if (ok && !dentro) { dentro = true; ini = tt; }
        if (!ok && dentro) { dentro = false; out.push({ ini: ini, fim: tt - 1 }); }
      }
      if (dentro) out.push({ ini: ini, fim: t1 });
      return out;
    }
    function idade(t) {
      var jd = jd0 + t / 1440, ult = null;
      for (var i = 0; i < fases.length; i++) if (fases[i].tipo === 0 && fases[i].jd <= jd) ult = fases[i];
      return ult ? jd - ult.jd : 0;
    }
    return { ext: ext, dias: dias, fases: fases, seg: seg, hCos: hCos, hDoze: hDoze, fracCos: fracCos, fracDoze: fracDoze, janelas: janelas, idade: idade, elong: elong, ano: Y };
  }

  /* ---------------- ícone da fase (como vista do Hemisfério Sul) ---------------- */
  function iconeLua(D, r, cls) {
    D = ((D % 360) + 360) % 360;
    var g = h('g', { class: 'mr-lua-ico ' + (cls || '') });
    g.appendChild(h('circle', { r: r, class: 'mr-lua-escura' }));
    var crescente = D < 180, cosD = Math.cos(D * RAD), rx = Math.abs(cosD) * r, foice = cosD > 0;
    if (D > 1 && D < 359) {
      // Hemisfério Sul: na fase crescente a parte iluminada fica à ESQUERDA
      var limbo = crescente ? 0 : 1, term = crescente ? (foice ? 1 : 0) : (foice ? 0 : 1);
      var d = 'M0 ' + (-r) + 'A' + r + ' ' + r + ' 0 0 ' + limbo + ' 0 ' + r + 'A' + rx.toFixed(2) + ' ' + r + ' 0 0 ' + term + ' 0 ' + (-r) + 'Z';
      g.appendChild(h('path', { d: d, class: 'mr-lua-clara' }));
    }
    g.appendChild(h('circle', { r: r, class: 'mr-lua-borda' }));
    return g;
  }

  VL.widgets.define('mares', {
    css: ['assets/css/widgets/mares.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var vivo = true;
      var hoje = (opts.inicio && /^\d{4}-\d{2}-\d{2}$/.test(opts.inicio) ? opts.inicio : VL.hoje()).split('-').map(Number);
      var M = criarMare(hoje[0], hoje[1], hoje[2]);
      var est = {
        modo: opts.modo === 'exercicio' ? 'exercicio' : 'explorar',
        vista: ['altura', 'baixio', 'lua'].indexOf(opts.vista) >= 0 ? opts.vista : 'altura',
        dia: Math.max(0, Math.min(6, opts.dia | 0)),
        t: null,
        sond: opts.sondagem != null && !isNaN(+opts.sondagem) ? +opts.sondagem : 1.2,
        calado: opts.calado != null && !isNaN(+opts.calado) ? +opts.calado : 1.8,
        folga: opts.folga != null && !isNaN(+opts.folga) ? +opts.folga : 0.5,
        D: null,            // elongação da Lua no diagrama (graus)
        ex: null, acertos: 0, tentativas: 0,
      };
      function tPadrao() { // meio da primeira enchente do dia
        var evs = M.dias[est.dia].eventos;
        for (var i = 0; i < evs.length; i++) if (evs[i].tipo === 'BM') { var s = M.seg(evs[i].t); return Math.round((s.a.t + (s.b.t - s.a.t) * 0.45) / 5) * 5; }
        return est.dia * 1440 + 600;
      }
      est.t = tPadrao();
      est.D = M.elong(est.dia * 1440 + 720);

      var inst = VL.ui.instrumento({ titulo: 'Marés: tábua de exemplo, curva, altura num horário e folga abaixo da quilha (Manual de Navegação da MB, Vol. I, cap. 10)', controlesAntes: true });
      el.appendChild(inst.raiz);

      /* ---------------- topo ---------------- */
      var modoSeg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['exercicio', 'Exercício']].forEach(function (m) { modoSeg.appendChild(h('button', { type: 'button', 'data-m': m[0], onclick: function () { definirModo(m[0]); } }, m[1])); });
      var vistaSeg = h('div', { class: 'segmented mr-vistas', role: 'group', 'aria-label': 'O que estudar' });
      [['altura', 'Altura num horário'], ['baixio', 'Passar no baixio'], ['lua', 'Sizígia e quadratura']].forEach(function (v) { vistaSeg.appendChild(h('button', { type: 'button', 'data-v': v[0], onclick: function () { est.vista = v[0]; renderTudo(); } }, v[1])); });
      var placar = h('span', { class: 'mr-placar', 'aria-live': 'polite' });
      inst.controles.appendChild(h('div', { class: 'mr-topo' }, modoSeg, vistaSeg, placar));

      /* ---------------- aviso e tábua ---------------- */
      var aviso = h('p', { class: 'mr-aviso' },
        h('b', null, 'Tábua de exemplo: marés fictícias, não use para navegar.'), ' As fases da Lua são reais (cálculo astronômico). Para planejar, consulte a ',
        h('a', { href: 'https://www.marinha.mil.br/chm/tabuas-de-mare', target: '_blank', rel: 'noopener' }, 'Tábua das Marés oficial da DHN (CHM)'), '.');
      var tabua = h('section', { class: 'mr-tabua', 'aria-label': 'Tábua das marés de exemplo' });
      var graf = h('div', { class: 'mr-graf' });
      var painel = h('div', { class: 'mr-painel' });
      inst.corpo.appendChild(aviso); inst.corpo.appendChild(tabua); inst.corpo.appendChild(graf); inst.corpo.appendChild(painel);

      function desenharTabua() {
        tabua.innerHTML = '';
        var di = M.dias[0].data, df = M.dias[6].data;
        tabua.appendChild(h('div', { class: 'mr-tabua-cab' },
          h('p', { class: 'mr-tabua-porto' }, 'Porto de Treinamento (fictício) — ' + M.ano),
          h('p', null, 'Maré semidiurna (como nos portos de Vitória, ES, para o norte) · Fuso +03: hora legal de Brasília (UTC = hora local + 3 h)'),
          h('p', null, 'Instituição: exemplo do app · Componentes: 3 (modelo simplificado) · Nível médio: ' + num(MOD.Z0, 2) + ' m acima do NR · Carta: de treinamento'),
          h('p', { class: 'mr-tabua-periodo' }, 'Previsão de ' + VL.fmt.data(new Date(di.getUTCFullYear(), di.getUTCMonth(), di.getUTCDate())) + ' a ' + VL.fmt.data(new Date(df.getUTCFullYear(), df.getUTCMonth(), df.getUTCDate())) + '. Hora com 4 algarismos; altura em metros acima do Nível de Redução' + intl('chart datum') + '.')));
        var grade = h('div', { class: 'mr-dias', role: 'list' });
        M.dias.forEach(function (dd) {
          var linhas = dd.eventos.map(function (e) { return h('span', { class: 'mr-ev mr-ev-' + e.tipo.toLowerCase() }, h('span', { class: 'mr-ev-h' }, hhmm(e.t)), h('span', { class: 'mr-ev-a' }, num(e.h, 1))); });
          var rotA = dd.rot + ': ' + dd.eventos.map(function (e) { return (e.tipo === 'PM' ? 'preamar ' : 'baixa-mar ') + hhmm(e.t) + ', ' + num(e.h, 1) + ' m'; }).join('; ') + (dd.fase ? '; ' + FASES[dd.fase.tipo] + ' às ' + hhmm(dd.fase.hora) : '');
          var ic = null;
          if (dd.fase) { ic = h('svg', { class: 'mr-fase-svg', viewBox: '-9 -9 18 18', width: 16, height: 16, 'aria-hidden': 'true' }, iconeLua(dd.fase.tipo * 90, 7.5)); }
          var b = h('button', { type: 'button', class: 'mr-dia', 'aria-pressed': String(dd.d === est.dia), 'aria-label': rotA, title: dd.fase ? FASES[dd.fase.tipo] + ' às ' + hhmm(dd.fase.hora) : null, onclick: function () { selDia(dd.d); } },
            h('span', { class: 'mr-dia-cab' }, h('span', { class: 'mr-dia-rot' }, dd.rot), ic), linhas);
          grade.appendChild(h('div', { role: 'listitem' }, b));
        });
        tabua.appendChild(grade);
        tabua.appendChild(h('p', { class: 'mr-tabua-leg' }, 'Toque num dia para ver a curva. Símbolos de fase (Lua como vista do Hemisfério Sul): ',
          legLua(0), ' nova, ', legLua(90), ' quarto crescente, ', legLua(180), ' cheia, ', legLua(270), ' quarto minguante. Altura negativa = abaixo do NR.'));
      }
      function legLua(D) { return h('svg', { class: 'mr-fase-svg', viewBox: '-9 -9 18 18', width: 14, height: 14, 'aria-hidden': 'true' }, iconeLua(D, 7.5)); }
      function selDia(d) {
        var off = est.t - est.dia * 1440;
        est.dia = d; est.t = d * 1440 + off;
        est.D = M.elong(d * 1440 + 720);
        renderTudo();
      }

      /* ---------------- gráfico da curva ---------------- */
      var gs = { W: 600, H: 280, x0: 40, x1: 590, y0: 22, y1: 250, ymin: -0.5, ymax: 4 };
      var svgG = h('svg', { class: 'mr-svg', role: 'img' });
      var gFundo = h('g'), gCursor = h('g', { class: 'mr-cursor' });
      svgG.appendChild(gFundo); svgG.appendChild(gCursor);
      var legGraf = h('p', { class: 'mr-leg-graf' });
      var faixa = h('input', { type: 'range', min: '0', max: '1435', step: '5', class: 'mr-faixa', 'aria-label': 'Horário no dia selecionado' });
      var faixaRot = h('span', { class: 'mr-faixa-rot', 'aria-hidden': 'true' });
      graf.appendChild(svgG);
      graf.appendChild(h('label', { class: 'mr-faixa-box' }, h('span', null, 'Horário'), faixa, faixaRot));
      graf.appendChild(legGraf);
      faixa.addEventListener('input', function () { est.t = est.dia * 1440 + Number(faixa.value); atualizarCursor(); atualizarPainel(); });

      function X(t) { return gs.x0 + (t - est.dia * 1440) / 1440 * (gs.x1 - gs.x0); }
      function Y(v) { return gs.y1 - (v - gs.ymin) / (gs.ymax - gs.ymin) * (gs.y1 - gs.y0); }
      function precisaLinha() { return (est.modo === 'explorar' && est.vista === 'baixio') || (est.modo === 'exercicio' && est.ex && est.ex.marcas && est.ex.marcas.nec != null && est.ex.revelado); }
      function nec() { return est.modo === 'exercicio' && est.ex && est.ex.marcas ? est.ex.marcas.nec : est.calado + est.folga - est.sond; }
      function desenharGrafico() {
        var W = Math.max(300, Math.round(graf.clientWidth || 600));
        var estreita = W < 540;
        gs.W = W; gs.H = estreita ? 250 : 300; gs.x0 = estreita ? 36 : 44; gs.x1 = W - 10; gs.y0 = 26; gs.y1 = gs.H - 28;
        svgG.setAttribute('viewBox', '0 0 ' + W + ' ' + gs.H); svgG.setAttribute('width', W); svgG.setAttribute('height', gs.H);
        var d0 = est.dia * 1440, d1 = d0 + 1440;
        var hs = M.ext.filter(function (e) { return e.t > d0 - 800 && e.t < d1 + 800; }).map(function (e) { return e.h; });
        var lo = Math.min.apply(null, hs), hi = Math.max.apply(null, hs);
        var linhaN = precisaLinha() ? nec() : null;
        gs.ymin = Math.floor(Math.min(lo, 0, linhaN != null ? linhaN : 0) * 2 - 1) / 2;
        gs.ymax = Math.ceil(Math.max(hi, linhaN != null ? linhaN : 0) * 2 + 1) / 2;
        while (gFundo.firstChild) gFundo.removeChild(gFundo.firstChild);
        // água sob a curva (cosseno)
        var dC = '', dD = '', area = 'M' + gs.x0 + ' ' + gs.y1;
        for (var t = d0; t <= d1; t += 4) {
          var x = X(t).toFixed(1), yc = Y(M.hCos(t)).toFixed(1), yd = Y(M.hDoze(t)).toFixed(1);
          dC += (t === d0 ? 'M' : 'L') + x + ' ' + yc; dD += (t === d0 ? 'M' : 'L') + x + ' ' + yd; area += 'L' + x + ' ' + yc;
        }
        area += 'L' + gs.x1 + ' ' + gs.y1 + 'Z';
        // janelas para passar
        if (linhaN != null) {
          M.janelas(linhaN, d0, d1).forEach(function (j) { gFundo.appendChild(h('rect', { x: X(j.ini).toFixed(1), y: gs.y0, width: Math.max(1, X(j.fim) - X(j.ini)).toFixed(1), height: gs.y1 - gs.y0, class: 'mr-janela' })); });
        }
        gFundo.appendChild(h('path', { d: area, class: 'mr-agua' }));
        // grade
        var passoY = gs.ymax - gs.ymin > 4 ? 1 : 0.5, gr = '';
        for (var v = Math.ceil(gs.ymin / passoY) * passoY; v <= gs.ymax + 1e-9; v += passoY) {
          gr += 'M' + gs.x0 + ' ' + Y(v).toFixed(1) + 'H' + gs.x1;
          gFundo.appendChild(h('text', { x: gs.x0 - 6, y: Y(v).toFixed(1), dy: '0.35em', 'text-anchor': 'end', class: 'mr-eixo-txt' }, num(Math.abs(v) < 1e-9 ? 0 : v, passoY < 1 ? 1 : 0)));
        }
        var passoX = estreita ? 360 : 180;
        for (var tx = 0; tx <= 1440; tx += 60) {
          gr += 'M' + X(d0 + tx).toFixed(1) + ' ' + gs.y0 + 'V' + gs.y1;
          if (tx % passoX === 0) gFundo.appendChild(h('text', { x: X(d0 + tx).toFixed(1), y: gs.y1 + 16, 'text-anchor': tx === 0 ? 'start' : tx === 1440 ? 'end' : 'middle', class: 'mr-eixo-txt' }, tx === 1440 ? '2400' : hhmm(tx)));
        }
        gFundo.insertBefore(h('path', { d: gr, class: 'mr-grade' }), gFundo.firstChild);
        gFundo.appendChild(h('text', { x: gs.x0 - 6, y: gs.y0 - 10, 'text-anchor': 'start', class: 'mr-eixo-txt mr-eixo-un' }, 'altura (m)'));
        // NR e NM
        gFundo.appendChild(h('line', { x1: gs.x0, x2: gs.x1, y1: Y(0), y2: Y(0), class: 'mr-nr' }));
        gFundo.appendChild(h('text', { x: gs.x0 + 4, y: Y(0) + 13, 'text-anchor': 'start', class: 'mr-nr-txt' }, estreita ? 'NR = 0' : 'NR (nível de redução) = 0'));
        gFundo.appendChild(h('line', { x1: gs.x0, x2: gs.x1, y1: Y(MOD.Z0), y2: Y(MOD.Z0), class: 'mr-nm' }));
        nmTxt = h('text', { x: gs.x1 - 4, y: Y(MOD.Z0) - 5, 'text-anchor': 'end', class: 'mr-nm-txt' }, 'NM ' + num(MOD.Z0, 2) + ' m');
        gFundo.appendChild(nmTxt);
        if (linhaN != null) {
          gFundo.appendChild(h('line', { x1: gs.x0, x2: gs.x1, y1: Y(linhaN), y2: Y(linhaN), class: 'mr-nec' }));
          gFundo.appendChild(h('text', { x: gs.x0 + 6, y: Y(linhaN) - 6, class: 'mr-nec-txt' }, 'altura necessária ' + m2(linhaN)));
        }
        gFundo.appendChild(h('path', { d: dD, class: 'mr-curva-doze' }));
        gFundo.appendChild(h('path', { d: dC, class: 'mr-curva' }));
        // PM e BM
        M.ext.filter(function (e) { return e.t >= d0 && e.t < d1; }).forEach(function (e) {
          var x = X(e.t), y = Y(e.h), pm = e.tipo === 'PM';
          gFundo.appendChild(h('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.6, class: 'mr-ext' }));
          // rótulo com fundo (a linha do NR e a grade não atravessam o texto) e sempre dentro do gráfico
          var rotTxt = e.tipo + ' ' + hhmm(e.t) + ' · ' + num(e.h, 1), gRot = h('g', { class: 'mr-ext-rot' });
          var tEl = h('text', { y: (pm ? y - 9 : y + 17).toFixed(1), 'text-anchor': 'middle', class: 'mr-ext-txt' }, rotTxt);
          gRot.appendChild(tEl); gFundo.appendChild(gRot);
          var larg = 0; try { larg = tEl.getComputedTextLength(); } catch (er) { larg = 0; }
          if (!larg) larg = rotTxt.length * 6.6;
          var tx2 = Math.max(gs.x0 + larg / 2 + 3, Math.min(gs.x1 - larg / 2 - 3, x));
          tEl.setAttribute('x', tx2.toFixed(1));
          gRot.insertBefore(h('rect', { x: (tx2 - larg / 2 - 3).toFixed(1), y: ((pm ? y - 9 : y + 17) - 10).toFixed(1), width: (larg + 6).toFixed(1), height: 13.5, rx: 3, class: 'mr-ext-fundo' }), tEl);
        });
        svgG.setAttribute('aria-label', 'Curva da maré de ' + M.dias[est.dia].rot + ', de 0000 a 2400. ' + M.dias[est.dia].eventos.map(function (e) { return (e.tipo === 'PM' ? 'Preamar ' : 'Baixa-mar ') + hhmm(e.t) + ' com ' + num(e.h, 1) + ' m'; }).join('. ') + '.');
        legGraf.innerHTML = '<span class="mr-leg-l mr-leg-cos"></span> curva pelo método do cosseno (o mesmo das Tabelas I e II da DHN) &nbsp; <span class="mr-leg-l mr-leg-doze"></span> regra dos doze avos' + VL.esc(intl('rule of twelfths')) +
          (linhaN != null ? ' &nbsp; <span class="mr-leg-q mr-leg-jan"></span> dá para passar' : '');
        atualizarCursor();
      }
      var nmTxt = null;
      function colide(a, b) { return a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height; }
      function atualizarCursor() {
        if (nmTxt) nmTxt.style.visibility = '';
        while (gCursor.firstChild) gCursor.removeChild(gCursor.firstChild);
        var mostrar = est.modo === 'explorar' && est.vista !== 'lua' || (est.modo === 'exercicio' && est.ex && est.ex.revelado && est.ex.marcas && est.ex.marcas.t != null);
        faixa.value = String(Math.max(0, Math.min(1435, est.t - est.dia * 1440)));
        faixaRot.textContent = hhmm(est.t);
        faixa.parentNode.hidden = est.modo !== 'explorar' || est.vista === 'lua';
        if (!mostrar) return;
        var t = est.modo === 'exercicio' ? est.ex.marcas.t : est.t;
        var x = X(t), hc = M.hCos(t), y = Y(hc);
        gCursor.appendChild(h('line', { x1: x.toFixed(1), x2: x.toFixed(1), y1: gs.y0, y2: gs.y1, class: 'mr-cur-linha' }));
        gCursor.appendChild(h('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 5, class: 'mr-cur-pt' }));
        var dir = x > (gs.x0 + gs.x1) / 2 ? -1 : 1;
        var txt = hhmm(t) + ': ' + m2(hc);
        var tx = h('text', { x: (x + dir * 9).toFixed(1), y: Math.max(gs.y0 + 12, y - 12).toFixed(1), 'text-anchor': dir > 0 ? 'start' : 'end', class: 'mr-cur-txt' }, txt);
        gCursor.appendChild(tx);
        // o rótulo do cursor tem prioridade: o do nível médio some enquanto os dois se tocam
        try { if (nmTxt && colide(tx.getBBox(), nmTxt.getBBox())) nmTxt.style.visibility = 'hidden'; } catch (er) { /* sem layout */ }
      }
      // arrastar o horário no gráfico
      var arr = null;
      function tDoEvento(e) {
        var r = svgG.getBoundingClientRect(); var x = (e.clientX - r.left) * (gs.W / r.width);
        var t = (x - gs.x0) / (gs.x1 - gs.x0) * 1440; return Math.max(0, Math.min(1435, Math.round(t / 5) * 5));
      }
      svgG.addEventListener('pointerdown', function (e) {
        if (est.modo !== 'explorar' || est.vista === 'lua') return;
        arr = e.pointerId; try { svgG.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
        est.t = est.dia * 1440 + tDoEvento(e); atualizarCursor(); atualizarPainel();
      });
      svgG.addEventListener('pointermove', function (e) { if (arr !== e.pointerId) return; est.t = est.dia * 1440 + tDoEvento(e); atualizarCursor(); atualizarPainel(); });
      function fimArr(e) { if (arr === e.pointerId) arr = null; }
      svgG.addEventListener('pointerup', fimArr); svgG.addEventListener('pointercancel', fimArr);

      /* ---------------- explicações reutilizadas ---------------- */
      function infoSeg(t) {
        var s = M.seg(t), Dm = s.b.t - s.a.t, A = Math.abs(s.b.h - s.a.h), dt = t - s.a.t, sobe = s.b.h > s.a.h;
        return { s: s, D: Dm, A: A, dt: dt, sobe: sobe, x: dt / Dm };
      }
      function passosCos(t, curto) {
        var i = infoSeg(t), ang = 180 * i.x, f = M.fracCos(i.x), hc = M.hCos(t);
        var p = [];
        p.push('Às ' + hhmm(t) + ' a maré está ' + (i.sobe ? 'enchendo' : 'vazando') + ': entre a ' + i.s.a.tipo + ' das ' + hhmm(i.s.a.t) + ' (' + m1(i.s.a.h) + ') e a ' + i.s.b.tipo + ' das ' + hhmm(i.s.b.t) + ' (' + m1(i.s.b.h) + ').');
        if (!curto) p.push('Duração da ' + (i.sobe ? 'enchente' : 'vazante') + ': D = ' + hhmm(i.s.b.t) + ' − ' + hhmm(i.s.a.t) + ' = ' + dur(i.D) + ' (' + i.D + ' min). Amplitude: A = ' + num(Math.max(i.s.a.h, i.s.b.h), 1) + ' − ' + num(Math.min(i.s.a.h, i.s.b.h), 1) + ' = ' + m1(i.A) + '.');
        p.push('Tempo desde a ' + i.s.a.tipo + ': t = ' + dur(i.dt) + ' (' + i.dt + ' min). Ângulo = 180° × t ÷ D = 180° × ' + i.dt + ' ÷ ' + i.D + ' = ' + num(ang, 1) + '°.');
        p.push('Fração da amplitude = (1 − cos ' + num(ang, 1) + '°) ÷ 2 = ' + num(f, 3) + '.');
        p.push((i.sobe ? 'h = BM + A × fração = ' + num(i.s.a.h, 1) + ' + ' + num(i.A, 1) : 'h = PM − A × fração = ' + num(i.s.a.h, 1) + ' − ' + num(i.A, 1)) + ' × ' + num(f, 3) + ' = ' + m2(hc) + '.');
        return p;
      }
      function passosDoze(t) {
        var i = infoSeg(t), hm = i.D / 6, u = i.dt / hm, k = Math.min(5, Math.floor(u)), fr = M.fracDoze(i.x), hd = M.hDoze(t);
        var por = [1, 2, 3, 3, 2, 1];
        var acum = k === 0 ? 'ainda na primeira hora' : k === 1 ? '1/12 na primeira hora' : por.slice(0, k).join(' + ') + ' = ' + DOZE[k] + '/12 nas ' + k + ' primeiras horas';
        var p = [];
        p.push('"Hora de maré" = D ÷ 6 = ' + dur(i.D) + ' ÷ 6 = ' + dur(hm) + '.');
        p.push('t = ' + dur(i.dt) + ' = ' + num(u, 2) + ' horas de maré.');
        p.push('A maré ' + (i.sobe ? 'sobe' : 'desce') + ' 1, 2, 3, 3, 2 e 1 doze avos da amplitude em cada hora de maré: ' + acum + (u - k > 0.005 ? '; na ' + (k + 1) + 'ª hora, ' + num(u - k, 2) + ' × ' + por[k] + '/12' : '') + '. Total: ' + num(fr * 12, 2) + '/12 = ' + num(fr, 3) + '.');
        p.push((i.sobe ? 'h = ' + num(i.s.a.h, 1) + ' + ' : 'h = ' + num(i.s.a.h, 1) + ' − ') + num(i.A, 1) + ' × ' + num(fr, 3) + ' = ' + m2(hd) + '.');
        return p;
      }
      function lista(ps) { return h('ol', { class: 'mr-passos' }, ps.map(function (p) { return h('li', null, p); })); }

      /* ---------------- painel: altura num horário ---------------- */
      var refAltura = 'Manual de Navegação da MB, Vol. I, item 10.1.9 b: as Tabelas I e II das Tábuas das Marés supõem curva sinusoidal (o método do cosseno dá o mesmo resultado). Na costa do Brasil, só devem ser usadas de Vitória (ES) para o norte; onde a curva não é sinusoidal, dê margem de segurança de 10% da amplitude. A regra dos doze avos é uma aproximação ensinada em cursos de vela; não está nas Tábuas da DHN.';
      function painelAltura() {
        painel.innerHTML = '';
        var t = est.t, hc = M.hCos(t), hd = M.hDoze(t), dif = Math.round((hd - hc) * 100);
        painel.appendChild(h('div', { class: 'mr-leitura', 'aria-live': 'polite' },
          h('div', { class: 'mr-num' }, h('span', { class: 'mr-num-rot' }, 'Às ' + hhmm(t) + ', pelo cosseno'), h('b', null, m2(hc))),
          h('div', { class: 'mr-num' }, h('span', { class: 'mr-num-rot' }, 'pelos doze avos'), h('b', null, m2(hd))),
          h('div', { class: 'mr-num' }, h('span', { class: 'mr-num-rot' }, 'diferença'), h('b', null, (dif === 0 ? '0' : (dif > 0 ? '+' : '−') + Math.abs(dif)) + ' cm'))));
        var cols = h('div', { class: 'mr-cols' },
          h('section', null, h('h4', null, 'Método do cosseno'), lista(passosCos(t))),
          h('section', null, h('h4', null, 'Regra dos doze avos (1-2-3-3-2-1)'), lista(passosDoze(t))));
        painel.appendChild(cols);
        painel.appendChild(h('p', { class: 'mr-nota' }, 'Os dois métodos dão o mesmo valor na metade da enchente ou vazante. Perto da preamar e da baixa-mar a diferença cresce um pouco, mas raramente passa de 10 cm. Arraste no gráfico ou use a barra de horário.'));
        painel.appendChild(h('p', { class: 'mr-ref' }, refAltura));
      }

      /* ---------------- painel: passar no baixio ---------------- */
      var corteSvg = h('svg', { class: 'mr-corte', viewBox: '0 0 300 210', role: 'img' });
      function campo(rot, attrs, suf) {
        var inp = h('input', Object.assign({ type: 'text', inputmode: 'decimal', autocomplete: 'off' }, attrs));
        return { el: h('label', { class: 'mr-campo' }, h('span', { class: 'mr-campo-rot' }, rot), h('span', { class: 'mr-campo-in' }, inp, suf ? h('span', { class: 'mr-suf' }, suf) : null)), inp: inp };
      }
      var saidaBaixio;
      function painelBaixio() {
        painel.innerHTML = '';
        var cs1 = campo('Profundidade na carta', { 'aria-label': 'Profundidade na carta (sondagem), em metros', value: num(Math.abs(est.sond), 1) }, 'm');
        var sec = h('input', { type: 'checkbox', 'aria-label': 'É altura de secagem (número sublinhado na carta)' }); sec.checked = est.sond < 0;
        var cc = campo('Calado do barco', { 'aria-label': 'Calado do barco, em metros', value: num(est.calado, 1) }, 'm');
        var cf = campo('Folga desejada abaixo da quilha', { 'aria-label': 'Folga desejada abaixo da quilha, em metros', value: num(est.folga, 1) }, 'm');
        function ler() {
          var s = lerNum(cs1.inp.value), c = lerNum(cc.inp.value), f = lerNum(cf.inp.value);
          if ([s, c, f].some(isNaN) || c < 0 || f < 0 || Math.abs(s) > 200) return;
          est.sond = sec.checked ? -Math.abs(s) : Math.abs(s); est.calado = c; est.folga = f;
          desenharGrafico(); escreverBaixio();
        }
        [cs1, cc, cf].forEach(function (c) { c.inp.addEventListener('input', ler); });
        sec.addEventListener('change', ler);
        painel.appendChild(h('div', { class: 'mr-form' },
          h('div', { class: 'mr-linha' }, cs1.el, cc.el, cf.el),
          h('label', { class: 'mr-check' }, sec, h('span', null, 'É altura de secagem: o número está ', h('u', null, 'sublinhado'), ' na carta (o fundo fica acima do NR e descobre na baixa-mar)'))));
        var grade = h('div', { class: 'mr-baixio' }, h('figure', { class: 'mr-corte-fig' }, corteSvg, h('figcaption', null, 'Corte no horário escolhido (fora de escala na horizontal).')));
        saidaBaixio = h('div', { class: 'mr-baixio-saida', 'aria-live': 'polite' });
        grade.appendChild(saidaBaixio);
        painel.appendChild(grade);
        painel.appendChild(h('p', { class: 'mr-ref' }, 'Profundidade disponível = profundidade da carta + altura da maré (Manual de Navegação da MB, Vol. I, item 10.1.9 b, exemplo 2). Alturas de secagem aparecem sublinhadas e estão acima do NR (Carta 12000, DHN). A folga abaixo da quilha (FAQ) mínima em canais e portos é definida pela autoridade portuária (Manual, cap. 1). Some margem para ondas, balanço e erro da previsão: a maré real pode ficar abaixo da prevista com vento ou pressão alta.'));
        escreverBaixio();
      }
      function escreverBaixio() {
        if (!saidaBaixio) return;
        var t = est.t, hc = M.hCos(t), disp = est.sond + hc, faq = disp - est.calado, nc = est.calado + est.folga - est.sond;
        var d0 = est.dia * 1440, js = M.janelas(nc, d0, d0 + 1439);
        var jt;
        if (!js.length) jt = 'Neste dia a maré não chega a ' + m2(nc) + ': não dá para passar com essa folga.';
        else if (js.length === 1 && js[0].ini === d0 && js[0].fim === d0 + 1439) jt = 'Dá para passar a qualquer hora deste dia.';
        else jt = 'Dá para passar ' + js.map(function (j) { return (j.ini === d0 ? 'de 0000' : 'das ' + hhmm(j.ini)) + (j.fim >= d0 + 1439 ? ' até 2400' : ' às ' + hhmm(j.fim)); }).join(', ').replace(/, ([^,]*)$/, ' e $1') + '.';
        var faqCls = faq < 0 ? 'mr-mau' : faq < est.folga ? 'mr-alerta' : 'mr-bom';
        saidaBaixio.innerHTML = '';
        saidaBaixio.appendChild(h('ol', { class: 'mr-passos' },
          h('li', null, 'Altura da maré às ' + hhmm(t) + ' (cosseno): ' + m2(hc) + '.'),
          h('li', null, 'Profundidade disponível = ' + (est.sond < 0 ? '−' + num(-est.sond, 1) + ' (secagem)' : num(est.sond, 1)) + ' + ' + num(hc, 2) + ' = ' + m2(disp) + '.'),
          h('li', { class: faqCls }, 'Folga abaixo da quilha' + intl('under-keel clearance') + ' = ' + num(disp, 2) + ' − ' + num(est.calado, 1) + ' (calado) = ' + m2(faq) + (faq < 0 ? ': o barco encalha.' : faq < est.folga ? ': menor que a folga desejada.' : '.')),
          h('li', null, 'Altura de maré necessária = calado + folga − profundidade da carta = ' + num(est.calado, 1) + ' + ' + num(est.folga, 1) + ' − (' + num(est.sond, 1) + ') = ', h('b', null, m2(nc)), '.'),
          h('li', null, h('b', null, jt), ' (faixas verdes no gráfico)')));
        desenharCorte(hc, disp, faq);
      }
      function desenharCorte(hc, disp, faq) {
        var s = corteSvg; while (s.firstChild) s.removeChild(s.firstChild);
        var topo = Math.max(hc, 0) + 0.6 + Math.max(0, -faq), base = Math.min(-est.sond, 0, hc - est.calado) - 0.5;
        var y0 = 14, y1 = 196, Yc = function (v) { return y1 - (v - base) / (topo - base) * (y1 - y0); };
        var xb0 = 18, xb1 = 282, yFundo = Yc(-est.sond), ySup = Yc(hc), yNR = Yc(0), yQuilha = Yc(hc - est.calado);
        s.appendChild(h('rect', { x: xb0, y: ySup, width: xb1 - xb0, height: Math.max(0, yFundo - ySup), class: 'mr-corte-agua' }));
        s.appendChild(h('path', { d: 'M' + xb0 + ' ' + yFundo.toFixed(1) + 'C 90 ' + (yFundo - 3).toFixed(1) + ' 210 ' + (yFundo + 3).toFixed(1) + ' ' + xb1 + ' ' + yFundo.toFixed(1) + 'V' + y1 + 'H' + xb0 + 'Z', class: 'mr-corte-fundo' }));
        s.appendChild(h('line', { x1: xb0, x2: xb1, y1: yNR, y2: yNR, class: 'mr-nr' }));
        s.appendChild(h('text', { x: xb0 + 2, y: yNR + 12, 'text-anchor': 'start', class: 'mr-corte-txt mr-corte-nr' }, 'NR'));
        s.appendChild(h('line', { x1: xb0, x2: xb1, y1: ySup, y2: ySup, class: 'mr-corte-sup' }));
        // barco (casco e quilha), flutuando ou apoiado no fundo
        var cx = 150, yLinha = faq < 0 ? ySup + (yFundo - yQuilha) : ySup, yQ = Math.min(yQuilha, yFundo);
        var cascoTopo = yLinha - 16;
        s.appendChild(h('path', { d: 'M' + (cx - 58) + ' ' + cascoTopo.toFixed(1) + 'L' + (cx + 58) + ' ' + cascoTopo.toFixed(1) + 'L' + (cx + 46) + ' ' + (yLinha + 8).toFixed(1) + 'Q ' + cx + ' ' + (yLinha + 16).toFixed(1) + ' ' + (cx - 46) + ' ' + (yLinha + 8).toFixed(1) + 'Z', class: 'mr-corte-casco' }));
        s.appendChild(h('path', { d: 'M' + (cx - 7) + ' ' + (yLinha + 12).toFixed(1) + 'L' + (cx - 4) + ' ' + yQ.toFixed(1) + 'H' + (cx + 4) + 'L' + (cx + 7) + ' ' + (yLinha + 12).toFixed(1) + 'Z', class: 'mr-corte-casco' }));
        // cotas
        function cota(x, ya, yb, txt, cls) {
          if (Math.abs(yb - ya) < 2) return;
          s.appendChild(h('path', { d: 'M' + (x - 4) + ' ' + ya.toFixed(1) + 'h8M' + (x - 4) + ' ' + yb.toFixed(1) + 'h8M' + x + ' ' + ya.toFixed(1) + 'V' + yb.toFixed(1), class: 'mr-cota ' + (cls || '') }));
          s.appendChild(h('text', { x: x + 6, y: ((ya + yb) / 2).toFixed(1), dy: '0.35em', class: 'mr-corte-txt ' + (cls || '') }, txt));
        }
        cota(42, yNR, ySup, 'maré ' + num(hc, 2), '');
        if (est.sond >= 0) cota(42, yNR, yFundo, 'carta ' + num(est.sond, 1), ''); else cota(42, yFundo, yNR, 'secagem ' + num(-est.sond, 1), '');
        cota(cx + 64, yLinha, yLinha + (yQuilha - ySup), 'calado ' + num(est.calado, 1), '');
        if (faq >= 0) cota(cx + 18, yQuilha, yFundo, 'folga ' + num(faq, 2), faq < est.folga ? 'mr-alerta' : 'mr-bom');
        else {
          // encalhado: a quilha apoia no fundo e o casco sobe o que falta de água
          s.appendChild(h('text', { x: cx + 12, y: (yFundo - 8).toFixed(1), 'text-anchor': 'start', class: 'mr-corte-txt mr-mau' }, 'encalha: faltam ' + num(-faq, 2) + ' m'));
        }
        s.setAttribute('aria-label', 'Corte: maré ' + num(hc, 2) + ' m, profundidade disponível ' + num(disp, 2) + ' m, calado ' + num(est.calado, 1) + ' m, folga ' + num(faq, 2) + ' m.');
      }

      /* ---------------- painel: sizígia e quadratura ---------------- */
      var luaSvg = h('svg', { class: 'mr-lua-svg', viewBox: '0 0 360 230', role: 'img' });
      var animId = 0, animUlt = 0, visivel = true;
      function painelLua() {
        painel.innerHTML = '';
        var faixaLua = h('input', { type: 'range', min: '0', max: '354', step: '3', value: String(Math.round(est.D / 3) * 3), class: 'mr-faixa', 'aria-label': 'Ângulo entre a Lua e o Sol (fase da Lua)' });
        faixaLua.addEventListener('input', function () { pararAnim(); est.D = Number(faixaLua.value); desenharLua(); });
        var botoes = h('div', { class: 'btn-row' });
        FASES.forEach(function (nome, i) { botoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { pararAnim(); est.D = i * 90; desenharLua(); } }, nome)); });
        botoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { pararAnim(); est.D = M.elong(est.dia * 1440 + 720); desenharLua(); } }, 'Dia da tábua'));
        var btAnim = reduzMov() ? null : h('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false', onclick: function () { if (animId) pararAnim(); else iniciarAnim(); } }, 'Animar um mês');
        if (btAnim) botoes.appendChild(btAnim);
        painel._btAnim = btAnim; painel._faixa = faixaLua;
        var txt = h('div', { class: 'mr-lua-txt', 'aria-live': 'polite' });
        painel._txt = txt;
        painel.appendChild(h('div', { class: 'mr-lua' }, h('figure', { class: 'mr-lua-fig' }, luaSvg, h('figcaption', null, 'Vista de cima do Polo Norte, fora de escala. O contorno azul em volta da Terra mostra, exagerado, o "inchaço" da maré.')),
          h('div', { class: 'mr-lua-ctl' }, h('label', { class: 'mr-faixa-box' }, h('span', null, 'Fase'), faixaLua), botoes, txt)));
        painel.appendChild(h('p', { class: 'mr-ref' }, 'Manual de Navegação da MB, Vol. I, itens 10.1.3 (sizígia e quadratura) e 10.1.6 (idade da Lua: sizígias com idade 0 e 14; quadraturas com 7 e 21). A força de maré do Sol é pouco menos da metade da força da Lua (cerca de 46%, Bowditch, The American Practical Navigator, cap. Tides); o diagrama usa a teoria do equilíbrio. Nos portos reais a resposta vem com atraso e muda de lugar para lugar.'));
        desenharLua();
      }
      function desenharLua() {
        var s = luaSvg; while (s.firstChild) s.removeChild(s.firstChild);
        var D = ((est.D % 360) + 360) % 360, cx = 222, cy = 115, R = 82, k = 0.46;
        // Sol à esquerda
        var sol = h('g', { class: 'mr-sol', transform: 'translate(30 115)' });
        for (var i = 0; i < 12; i++) { var a = i * 30 * RAD; sol.appendChild(h('line', { x1: (Math.cos(a) * 22).toFixed(1), y1: (Math.sin(a) * 22).toFixed(1), x2: (Math.cos(a) * 29).toFixed(1), y2: (Math.sin(a) * 29).toFixed(1), class: 'mr-sol-raio' })); }
        sol.appendChild(h('circle', { r: 18, class: 'mr-sol-disco' }));
        s.appendChild(sol);
        s.appendChild(h('text', { x: 30, y: 164, 'text-anchor': 'middle', class: 'mr-lua-rot' }, 'Sol'));
        s.appendChild(h('circle', { cx: cx, cy: cy, r: R, class: 'mr-orbita' }));
        // envelope de maré: soma das deformações da Lua e do Sol
        var am = 180 + D, d = '';
        for (var th = 0; th <= 360; th += 4) {
          var rr = 31 + 10 * (Math.cos(2 * (th - am) * RAD) + k * Math.cos(2 * (th - 180) * RAD)) / (1 + k);
          var px = cx + rr * Math.cos(th * RAD), py = cy - rr * Math.sin(th * RAD);
          d += (th ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
        }
        s.appendChild(h('path', { d: d + 'Z', class: 'mr-envelope' }));
        s.appendChild(h('circle', { cx: cx, cy: cy, r: 18, class: 'mr-terra' }));
        s.appendChild(h('text', { x: cx, y: cy, dy: '0.35em', 'text-anchor': 'middle', class: 'mr-lua-rot mr-terra-rot' }, 'Terra'));
        // Lua: metade voltada para o Sol iluminada
        var mx = cx + R * Math.cos(am * RAD), my = cy - R * Math.sin(am * RAD);
        s.appendChild(h('line', { x1: cx, y1: cy, x2: mx.toFixed(1), y2: my.toFixed(1), class: 'mr-eixo-lua' }));
        var lua = h('g', { transform: 'translate(' + mx.toFixed(1) + ' ' + my.toFixed(1) + ')' });
        lua.appendChild(h('circle', { r: 10, class: 'mr-lua-escura' }));
        lua.appendChild(h('path', { d: 'M0 -10 A10 10 0 0 0 0 10 Z', class: 'mr-lua-clara' }));
        lua.appendChild(h('circle', { r: 10, class: 'mr-lua-borda' }));
        s.appendChild(lua);
        s.appendChild(h('text', { x: mx.toFixed(1), y: (my + (my > cy ? 24 : -16)).toFixed(1), 'text-anchor': 'middle', class: 'mr-lua-rot' }, 'Lua'));
        // fase vista da Terra (Hemisfério Sul)
        var ic = h('g', { transform: 'translate(318 32)' }, iconeLua(D, 14));
        s.appendChild(ic);
        s.appendChild(h('text', { x: 356, y: 64, 'text-anchor': 'end', class: 'mr-lua-rot mr-lua-peq' }, 'vista do Brasil'));
        var amp = Math.sqrt(1 + k * k + 2 * k * Math.cos(2 * D * RAD)) / (1 + k);
        var idade = D / 360 * 29.53;
        var nome = Math.abs(((D + 22.5) % 360)) < 45 ? 'Lua nova' : Math.abs(D - 90) < 22.5 ? 'quarto crescente' : Math.abs(D - 180) < 22.5 ? 'Lua cheia' : Math.abs(D - 270) < 22.5 ? 'quarto minguante' : D < 180 ? 'Lua crescente' : 'Lua minguante';
        var c2 = Math.cos(2 * D * RAD), tipo = c2 > 0.7 ? 'sizigia' : c2 < -0.7 ? 'quadratura' : 'transicao';
        s.setAttribute('aria-label', 'Sol, Terra e Lua: ' + nome + ', idade da Lua cerca de ' + num(idade, 1) + ' dias. Amplitude relativa ' + Math.round(amp * 100) + '%.');
        var txt = painel._txt; if (!txt) return;
        if (painel._faixa && document.activeElement !== painel._faixa) painel._faixa.value = String(Math.round(D / 3) * 3);
        txt.innerHTML = '';
        txt.appendChild(h('p', { class: 'mr-lua-nome' }, h('b', null, nome.charAt(0).toUpperCase() + nome.slice(1)), ' · idade da Lua ≈ ' + num(idade, 1) + ' dias'));
        txt.appendChild(h('div', { class: 'mr-amp' }, h('span', { class: 'mr-amp-rot' }, 'Amplitude da maré (relativa)'), VL.ui.medidor(amp), h('span', { class: 'mr-amp-v' }, Math.round(amp * 100) + '%')));
        txt.appendChild(h('p', null, tipo === 'sizigia' ? 'Sizígia' + intl('spring tide') + ': Sol, Terra e Lua alinhados. As forças de maré se somam: preamares mais altas, baixa-mares mais baixas, maior amplitude. São as marés de águas vivas.' :
          tipo === 'quadratura' ? 'Quadratura' + intl('neap tide') + ': Lua e Sol a 90° vistos da Terra. As forças atuam em ângulo reto e uma tira parte da outra: preamares mais baixas, baixa-mares mais altas, menor amplitude. São as marés de águas mortas.' :
            'Entre sizígia e quadratura: a amplitude vai ' + ((D % 180) < 90 ? 'diminuindo rumo à quadratura.' : 'aumentando rumo à sizígia.')));
        var amps = M.dias.map(function (dd) { var e = dd.eventos; var mx2 = 0; for (var i = 1; i < e.length; i++) mx2 = Math.max(mx2, Math.abs(e[i].h - e[i - 1].h)); return mx2; });
        txt.appendChild(h('p', { class: 'mr-nota' }, 'Na tábua de exemplo, a amplitude vai de ' + m1(Math.min.apply(null, amps)) + ' a ' + m1(Math.max.apply(null, amps)) + ' nesta semana. Neste porto fictício a maior maré vem cerca de um dia e meio depois da Lua nova ou cheia; esse atraso muda de porto para porto.'));
      }
      function iniciarAnim() {
        if (reduzMov()) return;
        animUlt = 0;
        var bt = painel._btAnim; if (bt) { bt.setAttribute('aria-pressed', 'true'); bt.textContent = 'Parar'; }
        var passo = function (ts) {
          if (!vivo || !animId) return;
          if (visivel) {
            if (animUlt) est.D = (est.D + (ts - animUlt) / 1000 * 36) % 360;   // um mês em 10 s
            animUlt = ts; desenharLua();
          } else animUlt = 0;
          animId = requestAnimationFrame(passo);
        };
        animId = requestAnimationFrame(passo);
      }
      function pararAnim() {
        if (animId) cancelAnimationFrame(animId); animId = 0;
        var bt = painel._btAnim; if (bt) { bt.setAttribute('aria-pressed', 'false'); bt.textContent = 'Animar um mês'; }
      }
      var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; }) : null;
      if (io) io.observe(inst.raiz);

      /* ---------------- exercícios ---------------- */
      var TIPOS = [
        ['altura-cos', 'Altura num horário (método do cosseno)'],
        ['altura-12', 'Altura num horário (regra dos doze avos)'],
        ['folga', 'Folga abaixo da quilha'],
        ['necessaria', 'Altura de maré necessária'],
        ['janela', 'Horário para passar no baixio'],
        ['conceitos', 'Conceitos: sizígia, quadratura, NR'],
      ];
      function diaAleat() { return Math.floor(Math.random() * 7); }
      function tempoNoMeio(d, fmin, fmax, quer) {
        for (var k = 0; k < 60; k++) {
          var evs = M.ext.filter(function (e) { return e.t >= d * 1440 && e.t < d * 1440 + 1440 && (!quer || e.tipo === quer); });
          if (!evs.length) { d = diaAleat(); continue; }
          var e = escolha(evs), s = M.seg(e.t + 1), t = Math.round((s.a.t + (s.b.t - s.a.t) * aleat(fmin, fmax)) / 5) * 5;
          if (t >= d * 1440 && t < d * 1440 + 1440) return { d: d, t: t, s: s };
        }
        var s2 = M.seg(d * 1440 + 600); return { d: d, t: d * 1440 + 600, s: s2 };
      }
      function r1(x) { return Math.round(x * 10) / 10; }
      var CONCEITOS = [
        { q: 'Em que fases da Lua acontecem as marés de sizígia (águas vivas)?', alt: ['Lua nova e Lua cheia', 'Quarto crescente e quarto minguante', 'Só na Lua cheia', 'As fases da Lua não influem na maré'], c: 0,
          exp: 'Na Lua nova e na cheia, Sol, Terra e Lua ficam alinhados e as forças de maré se somam: maior amplitude. Nos quartos (quadratura) elas atuam em ângulo reto. A Lua nova também dá sizígia, não só a cheia.', ref: 'Manual de Navegação da MB, Vol. I, item 10.1.3' },
        { q: 'Na quadratura (quarto crescente ou minguante), como ficam a preamar e a baixa-mar?', alt: ['Preamar mais baixa e baixa-mar mais alta: amplitude menor', 'Preamar mais alta e baixa-mar mais baixa: amplitude maior', 'As duas mais altas que a média', 'Só há uma preamar por dia'], c: 0,
          exp: 'Na quadratura a força do Sol tira parte da força da Lua: preamares abaixo da média e baixa-mares acima da média (águas mortas). Amplitude maior é sizígia; a maré continua semidiurna.', ref: 'Manual de Navegação da MB, Vol. I, item 10.1.3' },
        { q: 'As profundidades (sondagens) das cartas náuticas brasileiras estão referidas a que nível?', alt: ['Ao Nível de Redução, normalmente a média das baixa-mares de sizígia (MLWS)', 'Ao nível médio do mar', 'À preamar média de sizígia', 'À menor maré já registrada no porto'], c: 0,
          exp: 'O Nível de Redução (NR) das cartas brasileiras corresponde normalmente ao nível médio das baixa-mares de sizígia: um nível abaixo do qual o mar raramente desce. Por isso a altura da maré quase sempre se soma à profundidade da carta.', ref: 'Manual de Navegação da MB, Vol. I, item 10.1.7' },
        { q: 'Numa maré semidiurna, qual o intervalo médio entre duas preamares seguidas?', alt: ['12 h 25 min', '12 h 00 min', '24 h 50 min', '6 h 13 min'], c: 0,
          exp: 'O dia lunar dura 24 h 50 min; com duas preamares por dia lunar, elas se repetem a cada 12 h 25 min, e entre preamar e baixa-mar há cerca de 6 h 13 min. Por isso a maré atrasa cerca de 50 min por dia.', ref: 'Manual de Navegação da MB, Vol. I, itens 10.1.3 e 10.1.10' },
        { q: 'Na carta, uma sondagem sublinhada (o número 0,8 com um traço embaixo) indica:', alt: ['Altura de secagem: o fundo fica 0,8 m acima do NR e descobre na baixa-mar', 'Profundidade de 0,8 m abaixo do NR, pouco confiável', 'Profundidade de 8 m', 'Profundidade medida na preamar'], c: 0,
          exp: 'Algarismos sublinhados são alturas acima do NR em bancos e rochas que cobrem e descobrem (estirâncio). Para saber a água disponível, subtraia a secagem da altura da maré.', ref: 'Carta 12000 (INT 1), DHN: alturas de secagem' },
        { q: 'Até onde, na costa do Brasil, a DHN recomenda usar as Tabelas I e II (altura da maré num instante)?', alt: ['De Vitória (ES) para o norte, onde a maré é semidiurna', 'Em toda a costa, inclusive no Sul', 'Só nos portos do Sul', 'Só na Baía de Guanabara'], c: 0,
          exp: 'As tabelas supõem curva sinusoidal. Do Espírito Santo para o sul a maré tem desigualdades diurnas e a curva não é sinusoidal; aí o resultado é só aproximado e se recomenda margem de 10% da amplitude.', ref: 'Manual de Navegação da MB, Vol. I, item 10.1.9 b' },
        { q: 'Uma tábua mostra a baixa-mar com altura −0,1 m. O que isso quer dizer?', alt: ['A maré fica 0,1 m abaixo do NR: há menos água que a profundidade da carta', 'Erro de impressão: a maré nunca é negativa', 'A maré fica 0,1 m acima do nível médio', 'Que a corrente de maré inverte 0,1 nó'], c: 0,
          exp: 'As alturas da tábua são cotas acima do NR; quando o número é negativo, a maré estará abaixo do NR e a profundidade real será menor que a da carta.', ref: 'Manual de Navegação da MB, Vol. I, item 10.1.9' },
      ];
      var gerar = {
        'altura-cos': function () {
          var p = tempoNoMeio(diaAleat(), 0.12, 0.88), hc = M.hCos(p.t);
          return { dia: p.d, marcas: { t: p.t },
            enunciado: 'Pela tábua de exemplo, qual a altura da maré em <b>' + M.dias[p.d].rot + ' às ' + hhmm(p.t) + '</b>? Use o <b>método do cosseno</b>. Responda em metros (tolerância ±0,1 m).',
            campos: [{ id: 'h', rot: 'Altura', suf: 'm', certo: hc, tol: 0.1 }], passos: passosCos(p.t), ref: refAltura };
        },
        'altura-12': function () {
          var p = tempoNoMeio(diaAleat(), 0.12, 0.88), hd = M.hDoze(p.t);
          return { dia: p.d, marcas: { t: p.t, doze: true },
            enunciado: 'Pela tábua de exemplo, qual a altura da maré em <b>' + M.dias[p.d].rot + ' às ' + hhmm(p.t) + '</b>? Use a <b>regra dos doze avos</b>. Responda em metros (tolerância ±0,1 m).',
            campos: [{ id: 'h', rot: 'Altura', suf: 'm', certo: hd, tol: 0.1 }], passos: [passosCos(p.t, true)[0]].concat(['Duração e amplitude: D = ' + dur(p.s.b.t - p.s.a.t) + ', A = ' + m1(Math.abs(p.s.b.h - p.s.a.h)) + '.']).concat(passosDoze(p.t)), ref: refAltura };
        },
        'folga': function () {
          var p = tempoNoMeio(diaAleat(), 0.1, 0.9), sond = r1(aleat(0.8, 3.5)), cal = escolha([1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]);
          var hc = M.hCos(p.t), faq = sond + hc - cal;
          return { dia: p.d, marcas: { t: p.t, sond: sond, calado: cal },
            enunciado: 'Seu veleiro tem <b>calado de ' + m1(cal) + '</b>. Em <b>' + M.dias[p.d].rot + ' às ' + hhmm(p.t) + '</b> você vai passar sobre um ponto com <b>' + m1(sond) + '</b> na carta. Qual será a folga abaixo da quilha? Calcule a maré pelo método do cosseno (tolerância ±0,1 m; folga negativa = encalha).',
            campos: [{ id: 'faq', rot: 'Folga abaixo da quilha', suf: 'm', certo: faq, tol: 0.1 }],
            passos: passosCos(p.t).concat(['Profundidade disponível = profundidade da carta + altura da maré = ' + num(sond, 1) + ' + ' + num(hc, 2) + ' = ' + m2(sond + hc) + '.', 'Folga = profundidade disponível − calado = ' + num(sond + hc, 2) + ' − ' + num(cal, 1) + ' = ' + m2(faq) + (faq < 0 ? ': o barco encalha.' : '.')]),
            ref: 'Manual de Navegação da MB, Vol. I, item 10.1.9 b, exemplo 2.' };
        },
        'necessaria': function () {
          var cal = escolha([1.2, 1.4, 1.5, 1.6, 1.8, 1.9, 2.1]), fol = escolha([0.3, 0.4, 0.5, 0.6]), sec = Math.random() < 0.4, sond = sec ? -r1(aleat(0.2, 0.9)) : r1(aleat(0.3, 1.8));
          var nc = cal + fol - sond;
          return { dia: est.dia, marcas: { nec: nc, sond: sond, calado: cal, folga: fol },
            enunciado: 'Na carta, o baixio da barra mostra ' + (sec ? '<b><u>' + num(-sond, 1) + '</u></b> (número sublinhado)' : '<b>' + num(sond, 1) + '</b>') + '. Seu barco cala <b>' + m1(cal) + '</b> e você quer <b>' + m1(fol) + '</b> de folga abaixo da quilha. Qual a altura de maré necessária para passar? (tolerância ±0,05 m)',
            campos: [{ id: 'nc', rot: 'Altura de maré necessária', suf: 'm', certo: nc, tol: 0.05 }],
            passos: [sec ? 'O número sublinhado é altura de secagem: o fundo fica ' + m1(-sond) + ' acima do NR. Na conta ele entra negativo: −' + num(-sond, 1) + ' m.' : 'A profundidade da carta está referida ao NR: ' + m1(sond) + ' abaixo do NR.',
              'Para a quilha passar com folga, a água precisa ter calado + folga = ' + num(cal, 1) + ' + ' + num(fol, 1) + ' = ' + m1(cal + fol) + ' de profundidade.',
              'Altura de maré necessária = calado + folga − profundidade da carta = ' + num(cal + fol, 1) + ' − (' + num(sond, 1) + ') = ' + m2(nc) + '.',
              'Na tábua, procure os horários em que a maré está acima de ' + m2(nc) + ' (faixa verde no gráfico).'],
            ref: 'Manual de Navegação da MB, Vol. I, item 10.1.9 b; Carta 12000 (INT 1), alturas de secagem.' };
        },
        'janela': function () {
          var p = tempoNoMeio(diaAleat(), 0.5, 0.5, 'BM'), s = p.s, A = s.b.h - s.a.h;
          var cal = escolha([1.4, 1.5, 1.6, 1.8, 1.9, 2.0]), fol = escolha([0.3, 0.4, 0.5]);
          var alvo = s.a.h + A * aleat(0.25, 0.75), sond = r1(cal + fol - alvo), nc = cal + fol - sond;
          var f = (nc - s.a.h) / A, ang = Math.acos(1 - 2 * f) / RAD, tc = s.a.t + (s.b.t - s.a.t) * ang / 180;
          return { dia: p.d, marcas: { t: Math.round(tc), nec: nc, sond: sond, calado: cal, folga: fol },
            enunciado: 'Em <b>' + M.dias[p.d].rot + '</b>, depois da baixa-mar das <b>' + hhmm(s.a.t) + '</b>, você quer cruzar uma barra com ' + (sond < 0 ? '<b><u>' + num(-sond, 1) + '</u></b> (sublinhado)' : '<b>' + m1(sond) + '</b>') + ' na carta. Calado ' + m1(cal) + ', folga desejada ' + m1(fol) + '. A partir de que horas a maré permite passar? Use o método do cosseno. Responda com 4 algarismos (tolerância ±10 min).',
            campos: [{ id: 'hora', rot: 'Horário', tipo: 'hora', certo: tc, tol: 10 }],
            passos: ['Altura necessária = ' + num(cal, 1) + ' + ' + num(fol, 1) + ' − (' + num(sond, 1) + ') = ' + m2(nc) + '.',
              'Enchente: BM ' + hhmm(s.a.t) + ' (' + m1(s.a.h) + ') até PM ' + hhmm(s.b.t) + ' (' + m1(s.b.h) + '). D = ' + dur(s.b.t - s.a.t) + ' (' + (s.b.t - s.a.t) + ' min), A = ' + m1(A) + '.',
              'Fração da amplitude que precisa subir: (' + num(nc, 2) + ' − ' + num(s.a.h, 1) + ') ÷ ' + num(A, 1) + ' = ' + num(f, 3) + '.',
              'Pelo cosseno: fração = (1 − cos θ) ÷ 2, então cos θ = 1 − 2 × ' + num(f, 3) + ' = ' + num(1 - 2 * f, 3) + ' e θ = ' + num(ang, 1) + '°.',
              'Tempo depois da BM = D × θ ÷ 180° = ' + (s.b.t - s.a.t) + ' × ' + num(ang, 1) + ' ÷ 180 = ' + Math.round(tc - s.a.t) + ' min = ' + dur(tc - s.a.t) + '. Horário: ' + hhmm(s.a.t) + ' + ' + dur(tc - s.a.t) + ' = ' + hhmm(tc) + '.',
              'Na prática, chegue um pouco depois e confira a profundidade no ecobatímetro: a previsão pode errar com vento e pressão.'],
            ref: 'Manual de Navegação da MB, Vol. I, item 10.1.9 b (curva sinusoidal das Tabelas I e II).' };
        },
        'conceitos': function () {
          var q = escolha(CONCEITOS), ordem = VL.embaralhar([0, 1, 2, 3]);
          return { dia: est.dia, marcas: {}, mc: { q: q, ordem: ordem }, enunciado: q.q, campos: [], passos: [q.exp], ref: q.ref };
        },
      };
      var exSel = h('select', { 'aria-label': 'Tipo de exercício', onchange: function () { novoEx(exSel.value); } });
      TIPOS.forEach(function (t) { exSel.appendChild(h('option', { value: t[0] }, t[1])); });
      var exFb, exIn = {};
      function novoEx(tipo) {
        if (!gerar[tipo]) tipo = 'altura-cos';
        exSel.value = tipo;
        est.ex = gerar[tipo](); est.ex.tipo = tipo; est.ex.revelado = false; est.ex.contado = false;
        est.dia = est.ex.dia;
        renderTudo();
      }
      function painelEx() {
        var ex = est.ex; painel.innerHTML = '';
        painel.appendChild(h('label', { class: 'mr-campo mr-campo-largo' }, h('span', { class: 'mr-campo-rot' }, 'Exercício'), exSel));
        painel.appendChild(h('div', { class: 'mr-enunciado', html: ex.enunciado }));
        exIn = {};
        exFb = h('div', { class: 'mr-feedback', 'aria-live': 'polite' });
        if (ex.mc) {
          var ul = h('ul', { class: 'alternativas' });
          ex.mc.ordem.forEach(function (i, pos) {
            var b = h('button', { type: 'button', class: 'alternativa', 'data-i': String(i), onclick: function () { responderMC(i); } }, h('span', { class: 'alternativa-letra' }, 'abcd'[pos]), h('span', null, ex.mc.q.alt[i]));
            ul.appendChild(h('li', null, b));
          });
          painel.appendChild(ul);
          painel.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { novoEx('conceitos'); } }, 'Outra pergunta')));
          painel.appendChild(exFb);
          return;
        }
        var linha = h('div', { class: 'mr-linha' });
        ex.campos.forEach(function (c) {
          var cc = campo(c.rot, { 'aria-label': c.rot + (c.tipo === 'hora' ? ', com 4 algarismos, por exemplo 0930' : ', em metros'), placeholder: c.tipo === 'hora' ? '0930' : '0,0', inputmode: c.tipo === 'hora' ? 'numeric' : 'decimal' }, c.suf);
          exIn[c.id] = cc; linha.appendChild(cc.el);
        });
        painel.appendChild(linha);
        painel.appendChild(h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { corrigir(true); } }, 'Corrigir'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { corrigir(false); } }, 'Ver solução'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { novoEx(est.ex.tipo); } }, 'Novo problema')));
        painel.appendChild(exFb);
        if (ex.revelado && ex.fbHtml) exFb.innerHTML = ex.fbHtml;
      }
      function responderMC(i) {
        var ex = est.ex, ok = i === ex.mc.q.c;
        VL.$$('.alternativa', painel).forEach(function (b) {
          var j = Number(b.getAttribute('data-i')); b.disabled = true;
          if (j === ex.mc.q.c) b.setAttribute('data-res', 'certa'); else if (j === i) b.setAttribute('data-res', 'errada');
        });
        if (!ex.contado) { ex.contado = true; est.tentativas++; if (ok) est.acertos++; }
        exFb.innerHTML = '<p class="mr-res" data-ok="' + (ok ? 1 : 0) + '">' + (ok ? 'Certo!' : 'Ainda não.') + '</p><p>' + VL.esc(ex.mc.q.exp) + '</p><p class="mr-ref">' + VL.esc(ex.mc.q.ref) + '.</p>';
        atualizarPlacar();
      }
      function corrigir(comResposta) {
        var ex = est.ex, okTudo = true, itens = [];
        for (var k = 0; k < ex.campos.length; k++) {
          var c = ex.campos[k], inp = exIn[c.id].inp, v = c.tipo === 'hora' ? lerHora(inp.value) : lerNum(inp.value);
          if (comResposta && isNaN(v)) { exFb.innerHTML = '<p>' + (c.tipo === 'hora' ? 'Digite o horário com 4 algarismos, por exemplo 0930.' : 'Digite um número, por exemplo 1,8.') + '</p>'; return; }
          var certoTxt = c.tipo === 'hora' ? hhmm(c.certo) : m2(c.certo);
          if (comResposta) {
            var err = c.tipo === 'hora' ? Math.abs(((v - (((c.certo % 1440) + 1440) % 1440)) + 720 + 1440) % 1440 - 720) : Math.abs(v - c.certo);
            var ok = err <= c.tol + 1e-9; if (!ok) okTudo = false;
            exIn[c.id].el.setAttribute('data-res', ok ? 'certa' : 'errada');
            itens.push(VL.esc(c.rot) + ': ' + (ok ? 'certo (' + certoTxt + ')' : 'o certo é ' + certoTxt + (c.tipo === 'hora' ? ' (você errou por ' + Math.round(err) + ' min)' : ' (diferença de ' + m2(err) + ')')));
          } else itens.push(VL.esc(c.rot) + ': ' + certoTxt);
        }
        if (comResposta && !ex.contado) { ex.contado = true; est.tentativas++; if (okTudo) est.acertos++; }
        var html = '<p class="mr-res"' + (comResposta ? ' data-ok="' + (okTudo ? 1 : 0) + '"' : '') + '>' + (comResposta ? (okTudo ? 'Certo!' : 'Ainda não.') : 'Solução') + '</p><p>' + itens.join('<br>') + '</p>' +
          '<p class="mr-res-sub">Resolução comentada</p><ol class="mr-passos">' + ex.passos.map(function (p) { return '<li>' + VL.esc(p) + '</li>'; }).join('') + '</ol><p class="mr-ref">' + VL.esc(ex.ref) + '</p>';
        ex.revelado = true; ex.fbHtml = html;
        exFb.innerHTML = html;
        desenharGrafico();
        atualizarPlacar();
      }
      function atualizarPlacar() { placar.textContent = est.modo === 'exercicio' ? 'Acertos: ' + est.acertos + ' de ' + est.tentativas : ''; }

      /* ---------------- composição ---------------- */
      function atualizarPainel() {
        if (est.modo === 'exercicio') return;
        if (est.vista === 'altura') { var s = painel.querySelector('.mr-leitura'); if (s) painelAltura(); }
        else if (est.vista === 'baixio') escreverBaixio();
      }
      function renderTudo() {
        if (!vivo) return;
        VL.$$('button', modoSeg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === est.modo)); });
        VL.$$('button', vistaSeg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.vista)); });
        vistaSeg.hidden = est.modo !== 'explorar';
        if (est.vista !== 'lua' || est.modo !== 'explorar') pararAnim();
        desenharTabua();
        graf.hidden = est.modo === 'explorar' && est.vista === 'lua';
        if (!graf.hidden) desenharGrafico();
        if (est.modo === 'exercicio') painelEx();
        else if (est.vista === 'altura') painelAltura();
        else if (est.vista === 'baixio') painelBaixio();
        else painelLua();
        atualizarPlacar();
      }
      function definirModo(m) {
        est.modo = m;
        if (m === 'exercicio' && !est.ex) { novoEx(opts.exercicio || 'altura-cos'); return; }
        if (m === 'explorar' && (est.t < est.dia * 1440 || est.t >= est.dia * 1440 + 1440)) est.t = tPadrao();
        renderTudo();
      }

      var ro = window.ResizeObserver ? new ResizeObserver(function () { if (!graf.hidden && Math.abs((graf.clientWidth || 0) - gs.W) > 2) desenharGrafico(); }) : null;
      if (ro) ro.observe(graf);
      var offSet = VL.on('settings', function () { renderTudo(); });
      definirModo(est.modo);

      return function () {
        vivo = false; pararAnim();
        if (ro) ro.disconnect(); if (io) io.disconnect();
        offSet();
      };
    },
  });
})();
