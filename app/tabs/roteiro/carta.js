/* Roteiro: a carta náutica estilizada. A habilitação vira uma derrota plotada: cada etapa é um waypoint numerado, a linha de
   rumo (magenta) liga os pontos, a terra fica na margem esquerda e o mar fica mais profundo, e mais livre, a cada etapa.
   As três faixas da carta são as três categorias da NORMAM-211: águas interiores (Arrais), costa até 20 milhas (Mestre)
   e oceano (Capitão). Layout vertical em todas as larguras: a derrota desce de cima para baixo. */
(function () {
  'use strict';
  var R = VL.roteiro, S = R.S;

  var T = 86, DY = 54, BAIXO = 82;
  var FX = [0.13, 0.21, 0.16, 0.35, 0.30, 0.44, 0.39, 0.50, 0.68, 0.81, 0.73, 0.88];
  var LH = 16;

  function lcg(seed) { var s = seed >>> 0; return function () { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; }; }
  function est(txt, px, peso) { return txt.length * px * (peso >= 600 ? 0.57 : 0.52); }
  function distSeg(px, py, x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }
  function quebrar(txt, maxW, px, peso) {
    var pal = txt.split(' '), linhas = [], atual = '';
    pal.forEach(function (p) {
      var t = atual ? atual + ' ' + p : p;
      if (est(t, px, peso) <= maxW || !atual) atual = t; else { linhas.push(atual); atual = p; }
    });
    if (atual) linhas.push(atual);
    return linhas.map(function (l) { return l.replace(/ /g, ' '); });
  }

  /* Veleiro (glifo 24x24 centrado em 0,0 depois de escalar) */
  function veleiro(esc, cls) {
    return S('g', { class: cls || 'rt-glifo', transform: 'scale(' + esc + ') translate(-12 -12)', 'aria-hidden': 'true' },
      S('path', { d: 'M12 3.2V16.6M3.5 17.6H20.5L17.6 21H6.4Z' }),
      S('path', { d: 'M12.9 4.4C17 8 18.2 12.2 18.2 16.2H12.9Z' }),
      S('path', { d: 'M11.2 6.2C7.6 9.2 6.3 12.8 6.3 16.2H11.2Z' }));
  }

  function rosa(cx, cy, r) {
    var g = S('g', { class: 'rt-rosa', 'aria-hidden': 'true' });
    g.appendChild(S('circle', { cx: cx, cy: cy, r: r, class: 'rt-rosa-aro' }));
    g.appendChild(S('circle', { cx: cx, cy: cy, r: r * 0.7, class: 'rt-rosa-aro' }));
    for (var a = 0; a < 360; a += 22.5) {
      var rad = (a - 90) * Math.PI / 180, r0 = r * (a % 45 === 0 ? 0.7 : 0.82);
      g.appendChild(S('line', { x1: cx + Math.cos(rad) * r0, y1: cy + Math.sin(rad) * r0, x2: cx + Math.cos(rad) * r, y2: cy + Math.sin(rad) * r, class: 'rt-rosa-tick' }));
    }
    function ponta(ang, comp, larg, cls) {
      var rad = (ang - 90) * Math.PI / 180, px = Math.cos(rad), py = Math.sin(rad);
      var tx = cx + px * comp, ty = cy + py * comp;
      var lx = cx - py * larg, ly = cy + px * larg, rx = cx + py * larg, ry = cy - px * larg;
      return S('polygon', { points: lx + ',' + ly + ' ' + tx + ',' + ty + ' ' + rx + ',' + ry, class: cls });
    }
    [45, 135, 225, 315].forEach(function (a) { g.appendChild(ponta(a, r * 0.62, r * 0.1, 'rt-rosa-i')); });
    [90, 180, 270].forEach(function (a) { g.appendChild(ponta(a, r * 1.02, r * 0.14, 'rt-rosa-c')); });
    g.appendChild(ponta(0, r * 1.18, r * 0.16, 'rt-rosa-n'));
    g.appendChild(S('text', { x: cx, y: cy - r * 1.18 - 5, class: 'rt-rosa-txt', 'text-anchor': 'middle', text: 'N' }));
    return g;
  }

  /**
   * Cria a carta dentro de `alvo`. ctx = { selecionar(id, {rolar}), selecionada() → id }.
   * Devolve { redesenhar(animar), destruir() }.
   */
  R.carta = function (alvo, ctx) {
    var svg = null, largura = 0, observador = null, primeira = true;

    function medir() { return Math.max(340, Math.min(560, Math.round(alvo.clientWidth || 360))); }

    function desenhar(animar) {
      var W = largura = medir();
      var etapas = R.etapas(), n = etapas.length;
      var H = T + (n - 1) * DY + BAIXO;
      var foco = document.activeElement && document.activeElement.getAttribute && svg && svg.contains(document.activeElement) ? document.activeElement.getAttribute('data-id') : null;
      var larga = W >= 440;
      var selId = ctx.selecionada();

      var xs = function (i) { return Math.round(FX[i] * W); };
      var ys = function (i) { return T + i * DY; };
      var xc = function (y) { return W * (0.045 + 0.018 * Math.sin(y / 61 + 0.8) + 0.010 * Math.sin(y / 23 + 2.1)); };
      var b1 = function (y) { return W * (0.305 + 0.025 * Math.sin(y / 97 + 0.4) + 0.012 * Math.sin(y / 31)); };
      var b2 = function (y) { return W * (0.46 + 0.03 * Math.sin(y / 121 + 1.7) + 0.012 * Math.sin(y / 43 + 0.5)); };
      var b3 = function (y) { return W * (0.60 + 0.018 * Math.sin(y / 137 + 0.9) + 0.008 * Math.sin(y / 47)); };

      var novo = S('svg', {
        class: 'rt-svg' + (animar ? ' rt-anima' : ''), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'group',
        'aria-label': 'Carta do roteiro: doze etapas do leigo à travessia transatlântica, da costa para o oceano',
      });
      novo.appendChild(S('title', { text: 'Roteiro da habilitação, plotado numa carta náutica estilizada' }));

      /* ---- fundo: terra, faixas de profundidade, linhas ---- */
      function faixa(fa, fb, cls) {
        var pts = [], y;
        for (y = 0; y <= H; y += 8) pts.push(fa(y).toFixed(1) + ',' + y);
        for (y = H; y >= 0; y -= 8) pts.push(fb(y).toFixed(1) + ',' + y);
        return S('polygon', { points: pts.join(' '), class: cls });
      }
      function linha(f, cls) {
        var pts = [];
        for (var y = 0; y <= H; y += 8) pts.push(f(y).toFixed(1) + ',' + y);
        return S('polyline', { points: pts.join(' '), class: cls, fill: 'none' });
      }
      var fundo = S('g', { 'aria-hidden': 'true' });
      fundo.appendChild(faixa(function () { return 0; }, xc, 'rt-terra'));
      fundo.appendChild(faixa(xc, b1, 'rt-mar3'));
      fundo.appendChild(faixa(b1, b2, 'rt-mar2'));
      fundo.appendChild(faixa(b2, b3, 'rt-mar1'));
      fundo.appendChild(linha(b1, 'rt-isobata'));
      fundo.appendChild(linha(b2, 'rt-isobata'));
      fundo.appendChild(linha(b3, 'rt-limite'));
      fundo.appendChild(linha(xc, 'rt-costa'));
      /* trapiche na largada */
      var y0 = ys(0), xp = xc(y0), x1 = xs(0);
      fundo.appendChild(S('path', { d: 'M' + xp + ' ' + (y0 - 4) + 'H' + (x1 - 17) + 'M' + xp + ' ' + (y0 + 4) + 'H' + (x1 - 17), class: 'rt-trapiche' }));
      fundo.appendChild(S('text', { x: 6, y: y0 + 34, class: 'rt-agua rt-halo', text: 'Largada' }));
      /* escala de latitude na borda esquerda */
      var esc = S('g', { class: 'rt-escala', 'aria-hidden': 'true' });
      for (var yy = 10; yy < H - 4; yy += 10) {
        var grande = (Math.round(yy / 10) % 10) === 0;
        esc.appendChild(S('line', { x1: 0, y1: yy, x2: grande ? 8 : 4, y2: yy }));
        if (larga && grande) esc.appendChild(S('text', { x: 11, y: yy + 4, text: (7 + Math.round(yy / 100)) + '°S' }));
      }
      fundo.appendChild(esc);

      /* ---- cabeçalhos das três faixas ---- */
      var cab = S('g', { class: 'rt-zonas' });
      var zonas = larga
        ? [[(0.045 + 0.305) * W / 2, 'Águas interiores', 'Arrais-Amador'], [(0.305 + 0.6) * W / 2, 'Costa, até 20 milhas', 'Mestre-Amador'], [(0.6 + 1) * W / 2, 'Oceano', 'Capitão-Amador']]
        : [[(0.045 + 0.305) * W / 2, 'Interior', 'Arrais'], [(0.305 + 0.6) * W / 2, 'Costa', 'Mestre'], [(0.6 + 1) * W / 2, 'Oceano', 'Capitão']];
      zonas.forEach(function (z) {
        cab.appendChild(S('text', { x: z[0], y: 30, class: 'rt-zona rt-agua', 'text-anchor': 'middle', text: z[1] }));
        cab.appendChild(S('text', { x: z[0], y: 48, class: 'rt-zona2', 'text-anchor': 'middle', text: z[2] }));
      });

      /* ---- geometria dos rótulos ---- */
      var atual = R.indiceAtual();
      var geo = etapas.map(function (e, i) {
        var x = xs(i), y = ys(i), estado = R.estadoDe(i);
        var wTit = est(e.rotulo, 14, 700);
        var roomR = W - x - 30, roomL = x - 30;
        var lado = roomR >= wTit ? 'd' : (roomL >= wTit ? 'e' : (roomR >= roomL ? 'd' : 'e'));
        var room = lado === 'd' ? roomR : roomL;
        var tit = quebrar(e.rotulo.replace(/(\d) h$/, '$1 h'), Math.min(room, 190), 14, 700);
        var sub = estado === 'feita' ? 'concluída' : R.durTxt(R.semanas(e));
        var linhas = tit.length + 1 + (estado === 'atual' ? 1 : 0);
        var w = Math.max.apply(null, tit.map(function (t) { return est(t, 14, 700); }).concat([est(sub, 12.5, 400), estado === 'atual' ? est('você está aqui', 12.5, 700) : 0]));
        var lx = lado === 'd' ? x + 26 : x - 26;
        return { e: e, i: i, x: x, y: y, estado: estado, lado: lado, tit: tit, sub: sub, linhas: linhas, w: w, lx: lx, rx: lado === 'd' ? lx : lx - w, top: y - linhas * LH / 2, h: linhas * LH };
      });

      /* ---- rosa dos ventos e sondagens ---- */
      var rr = larga ? 34 : 27, rcx = W - rr - 20, rcy = T + 2 * DY + 16;
      cab.appendChild(rosa(rcx, rcy, rr));

      /* rótulo do limite de 20 milhas, na vertical, no primeiro trecho da linha que não bate em rótulo de etapa nem na rosa */
      var txtLim = larga ? '20 milhas da costa' : '20 milhas', lenLim = est(txtLim, 13, 400) + 6;
      function sobra(a0, a1, b0, b1) { return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0)); }
      /* área de sobreposição do rótulo (vertical, termina em ye) com rótulos, discos e rosa */
      function colide(ye, xl) {
        var x0 = xl - 15, x1b = xl + 5, y0b = ye - lenLim, y1b = ye + 3, k, t = 0;
        for (k = 0; k < geo.length; k++) {
          var g = geo[k];
          t += sobra(x0, x1b, g.rx - 6, g.rx + g.w + 6) * sobra(y0b, y1b, g.top - 6, g.top + g.h + 6);
          t += sobra(x0, x1b, g.x - 26, g.x + 26) * sobra(y0b, y1b, g.y - 26, g.y + 26);
        }
        return t + sobra(x0, x1b, rcx - rr - 6, rcx + rr + 6) * sobra(y0b, y1b, rcy - rr - 14, rcy + rr + 14);
      }
      var yeLim = ys(2) + 38, xLim = b3(yeLim) + 5, melhor = Infinity, ye;
      for (ye = 62 + lenLim; ye <= H - 70; ye += 6) { var xt = b3(ye) + 5, c = colide(ye, xt); if (c < melhor) { melhor = c; yeLim = ye; xLim = xt; if (c === 0) break; } }
      fundo.appendChild(S('text', { x: xLim, y: yeLim, class: 'rt-agua rt-halo', transform: 'rotate(-90 ' + xLim + ' ' + yeLim + ')', text: txtLim }));

      var rnd = lcg(11), sond = [], alvoN = Math.round(W / 340 * 34), tent = 0;
      var gS = S('g', { class: 'rt-sondagens', 'aria-hidden': 'true' });
      while (sond.length < alvoN && tent++ < 2500) {
        var sx = 8 + rnd() * (W - 16), sy = 64 + rnd() * (H - 64 - 56);
        if (sx < xc(sy) + 12) continue;
        if (Math.hypot(sx - rcx, sy - rcy) < rr + 20) continue;
        if (sx > xLim - 22 && sx < xLim + 14 && sy > yeLim - lenLim - 12 && sy < yeLim + 12) continue;
        var ruim = false, k;
        for (k = 0; k < geo.length && !ruim; k++) {
          var g = geo[k];
          if (Math.hypot(sx - g.x, sy - g.y) < 32) ruim = true;
          if (sx > g.rx - 8 && sx < g.rx + g.w + 8 && sy > g.top - 8 && sy < g.top + g.h + 16) ruim = true;
        }
        for (k = 0; k < geo.length - 1 && !ruim; k++) if (distSeg(sx, sy, geo[k].x, geo[k].y, geo[k + 1].x, geo[k + 1].y) < 14) ruim = true;
        for (k = 0; k < sond.length && !ruim; k++) if (Math.hypot(sx - sond[k][0], sy - sond[k][1]) < 30) ruim = true;
        if (ruim) continue;
        sond.push([sx, sy]);
        var prof;
        if (sx < b1(sy)) prof = 2 + rnd() * 7; else if (sx < b2(sy)) prof = 10 + rnd() * 18; else if (sx < b3(sy)) prof = 30 + rnd() * 60; else prof = 100 + Math.round(rnd() * 80) * 10;
        var txt = prof < 20 ? VL.fmt.num(Math.round(prof * 10) / 10, 1) : String(Math.round(prof));
        gS.appendChild(S('text', { x: sx, y: sy, class: 'rt-sond', 'text-anchor': 'middle', text: txt }));
      }

      /* ---- derrota ---- */
      var pontos = geo.map(function (g) { return g.x + ',' + g.y; });
      var iniRota = (x1 - 17) + ',' + y0;
      var d = 'M' + iniRota + ' L' + pontos.join(' L');
      var defs = S('defs', null, S('mask', { id: 'rt-plot', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H },
        S('path', { d: d, class: 'rt-mask-path', pathLength: 1, fill: 'none', stroke: '#fff', 'stroke-width': 24, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })));
      var rota = S('g', { class: 'rt-rota', mask: 'url(#rt-plot)', 'aria-hidden': 'true' });
      rota.appendChild(S('line', { x1: x1 - 17, y1: y0, x2: geo[0].x, y2: geo[0].y, class: 'rt-perna', 'data-estado': R.feita(etapas[0].id) ? 'feita' : 'futura' }));
      for (var i = 0; i < n - 1; i++) {
        var est1 = R.feita(etapas[i].id) && R.feita(etapas[i + 1].id) ? 'feita' : (R.feita(etapas[i].id) ? 'proxima' : 'futura');
        rota.appendChild(S('line', { x1: geo[i].x, y1: geo[i].y, x2: geo[i + 1].x, y2: geo[i + 1].y, class: 'rt-perna', 'data-estado': est1 }));
      }
      /* comprimento acumulado para o atraso da animação de cada ponto */
      var comp = [0], tot = 0;
      for (i = 1; i < n; i++) { tot += Math.hypot(geo[i].x - geo[i - 1].x, geo[i].y - geo[i - 1].y); comp.push(tot); }

      /* ---- waypoints e rótulos ---- */
      var nos = S('g', { class: 'rt-nos' });
      geo.forEach(function (g) {
        var e = g.e, i = g.i, cha = e.tipo === 'cha', estado = g.estado;
        var raioDisco = estado === 'atual' ? 18 : 15;
        var sel = e.id === selId;
        var rotuloA11y = 'Etapa ' + e.n + ' de ' + n + ': ' + e.titulo + '. ' + (estado === 'feita' ? 'Concluída.' : estado === 'atual' ? 'Você está aqui.' : 'A fazer.') + ' ' + R.durTxt(R.semanas(e)) + ' no seu ritmo.';
        var no = S('g', {
          class: 'rt-no', tabindex: 0, role: 'button', 'aria-label': rotuloA11y, 'aria-pressed': sel ? 'true' : 'false',
          'data-id': e.id, 'data-estado': estado, 'data-sel': sel ? '1' : '0', 'data-cha': cha ? '1' : '0',
          style: { '--d': (animar ? Math.round(300 + comp[i] / tot * 2300) : 0) + 'ms' },
        });
        var hx0 = g.lado === 'd' ? g.x - 26 : g.rx - 8, hx1 = g.lado === 'd' ? g.lx + g.w + 8 : g.x + 26;
        var hy0 = Math.min(g.y - 26, g.top - 4), hy1 = Math.max(g.y + 26, g.top + g.h + 4);
        no.appendChild(S('rect', { x: hx0, y: hy0, width: hx1 - hx0, height: hy1 - hy0, class: 'rt-hit' }));
        var corpo = S('g', { class: 'rt-no-corpo' });
        corpo.appendChild(S('circle', { cx: g.x, cy: g.y, r: raioDisco + 8, class: 'rt-sel' }));
        if (cha) corpo.appendChild(S('circle', { cx: g.x, cy: g.y, r: raioDisco + 4.5, class: 'rt-anel' }));
        corpo.appendChild(S('circle', { cx: g.x, cy: g.y, r: raioDisco, class: 'rt-disco' }));
        if (estado === 'feita') corpo.appendChild(S('path', { d: 'M' + (g.x - 6) + ' ' + g.y + 'l4.4 4.6L' + (g.x + 6.4) + ' ' + (g.y - 5.2), class: 'rt-visto' }));
        else if (estado === 'atual') corpo.appendChild(S('g', { transform: 'translate(' + g.x + ' ' + g.y + ')' }, veleiro(0.95, 'rt-glifo')));
        else corpo.appendChild(S('text', { x: g.x, y: g.y + 0.5, class: 'rt-num', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(e.n) }));
        no.appendChild(corpo);
        var anc = g.lado === 'd' ? 'start' : 'end';
        var rot = S('text', { class: 'rt-rotulo', 'text-anchor': anc });
        var yb = g.top + 12;
        g.tit.forEach(function (t, k) { rot.appendChild(S('tspan', { x: g.lx, y: yb + k * LH, class: 'rt-tit', text: t })); });
        rot.appendChild(S('tspan', { x: g.lx, y: yb + g.tit.length * LH, class: 'rt-sub', text: g.sub }));
        if (estado === 'atual') rot.appendChild(S('tspan', { x: g.lx, y: yb + (g.tit.length + 1) * LH, class: 'rt-aqui', text: 'você está aqui' }));
        no.appendChild(rot);
        no.addEventListener('click', function (ev) { ev.preventDefault(); ctx.selecionar(e.id, { rolar: true }); });
        no.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ctx.selecionar(e.id, { rolar: true }); } });
        nos.appendChild(no);
      });

      /* ---- legenda ---- */
      var ly = H - 52, leg = S('g', { class: 'rt-legenda', 'aria-hidden': 'true', transform: 'translate(' + (larga ? 36 : 30) + ' 0)' });
      leg.appendChild(S('circle', { cx: 18, cy: ly, r: 7, class: 'rt-disco' }));
      leg.appendChild(S('text', { x: 31, y: ly + 4, text: 'etapa' }));
      leg.appendChild(S('circle', { cx: 100, cy: ly, r: 7, class: 'rt-disco' }));
      leg.appendChild(S('circle', { cx: 100, cy: ly, r: 11, class: 'rt-anel' }));
      leg.appendChild(S('text', { x: 118, y: ly + 4, text: 'habilitação da Marinha' }));
      leg.appendChild(S('circle', { cx: 18, cy: ly + 24, r: 7, class: 'rt-disco rt-disco-feito' }));
      leg.appendChild(S('path', { d: 'M13.6 ' + (ly + 24) + 'l3 3.2L22.6 ' + (ly + 20.4), class: 'rt-visto' }));
      leg.appendChild(S('text', { x: 31, y: ly + 28, text: 'concluída' }));
      leg.appendChild(S('circle', { cx: 100, cy: ly + 24, r: 9, class: 'rt-disco rt-disco-feito' }));
      leg.appendChild(S('g', { transform: 'translate(100 ' + (ly + 24) + ')' }, veleiro(0.6, 'rt-glifo-leg')));
      leg.appendChild(S('text', { x: 118, y: ly + 28, text: 'você está aqui' }));

      novo.appendChild(defs);
      novo.appendChild(fundo);
      novo.appendChild(gS);
      novo.appendChild(cab);
      novo.appendChild(rota);
      novo.appendChild(nos);
      novo.appendChild(leg);

      if (svg && svg.parentNode === alvo) alvo.replaceChild(novo, svg); else alvo.appendChild(novo);
      svg = novo;
      if (foco) { var f = svg.querySelector('[data-id="' + foco + '"]'); if (f) f.focus({ preventScroll: true }); }
    }

    desenhar(true);
    primeira = false;

    if (window.ResizeObserver) {
      observador = new ResizeObserver(function () {
        var w = medir();
        if (Math.abs(w - largura) >= 12) desenhar(false);
      });
      observador.observe(alvo);
    }

    return {
      redesenhar: function () { desenhar(false); },
      destruir: function () { if (observador) observador.disconnect(); },
    };
  };
})();
