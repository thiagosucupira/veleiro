/* Widget "nos": nós e voltas de marinheiro animados passo a passo (SVG).

   Como funciona o desenho: cada cabo é uma linha central (curva Catmull-Rom) com um "z" (altura) em cada ponto
   de controle. Nos cruzamentos, o trecho que passa POR CIMA é redesenhado sobre o de baixo, com contorno e
   sombra; assim o aluno vê exatamente por onde o chicote passa e consegue repetir com um cabo de verdade.
   A animação "estende" o cabo ao longo do caminho final: a ponta (chicote, com falcaça) anda pela rota
   tracejada em magenta, e cada cruzamento por cima/por baixo da etapa é numerado e listado no painel.
   Voltas em objetos (poste, barra, cunho) são modeladas em 3D (ângulo em volta do eixo) e projetadas com uma
   leve inclinação, de modo que a parte de trás da volta fica realmente atrás do objeto.

   opts de mount (todas opcionais):
     no:        'lais-de-guia'          nó aberto ao montar. Ids: lais-de-guia, oito, direito, torto (o nó errado,
                                        para comparar), fiel, volta-redonda, escota, escota-dobrado, cunho
     nos:       ['lais-de-guia','oito'] restringe a galeria e o desafio a estes nós (padrão: todos)
     modo:      'aprender' | 'desafio'  aba inicial (padrão 'aprender')
     galeria:   true                    false esconde a galeria (fica só o nó de opts.no)
     desafio:   true                    false esconde a aba "Desafio: qual nó usar?"
     etapa:     0                       etapa inicial (0 = primeira)
     autoplay:  false                   começa tocando a animação (ignorado com prefers-reduced-motion)
     info:      true                    false esconde "Para que serve", vantagens e cuidados
     titulo:    'Nós e voltas, passo a passo'   título da moldura
     debug:     false                   (desenvolvimento) pontos de controle, cruzamentos e verificação no console

   Exemplos de bloco de lição:
     {t:'widget', w:'nos', opts:{no:'lais-de-guia'}}
     {t:'widget', w:'nos', opts:{no:'direito', galeria:false, desafio:false}}
     {t:'widget', w:'nos', opts:{modo:'desafio', nos:['lais-de-guia','oito','fiel','cunho','volta-redonda']}}

   Referência dos nós: Clifford W. Ashley, The Ashley Book of Knots (ABoK), 1944 — o número ABoK de cada nó
   aparece na interface. Desenhos esquemáticos, com o nó frouxo para mostrar cada cruzamento.
   Números ABoK conferidos em 2026-10-08 (nenhum foi inventado):
     lais de guia 1010 (animatedknots.com/bowline-knot: "# 1010, p 186"; Wikipédia, Bowline, caixa ABoK #1010);
     oito 520 (Wikipédia, Figure-eight knot, caixa ABoK #420, #520, #570; citação do nó de batente na p. 85 do ABoK);
     direito 1204 (Wikipédia, Reef knot, caixa ABoK, entre outros #1204 e #1402; animatedknots.com/reef-knot dá #1402, p 258, para o mesmo nó);
     torto 1206 (Wikipédia, Granny knot, caixa ABoK #1206);
     fiel 1177 e 1178 (Wikipédia, Clove hitch, caixa ABoK #1176 a #1180 e #1245; animatedknots.com/clove-hitch-knot dá #1245, p 224);
     volta redonda 1720 (animatedknots.com/round-turn-two-half-hitches-knot: "# 1720, p 296"; Wikipédia, caixa ABoK #1720);
     escota 1431 (animatedknots.com/sheet-bend-knot: "# 1431, p 262"; Wikipédia, Sheet bend);
     escota dobrado 1434 (Wikipédia, Sheet bend, caixa do double sheet bend: #488, #1434);
     cunho 1615 (Wikipédia, Cleat hitch, caixa ABoK #1615).
   URLs: https://www.animatedknots.com/<nó> e https://en.wikipedia.org/wiki/<Bowline|Figure-eight_knot|Reef_knot|Granny_knot|Clove_hitch|Round_turn_and_two_half-hitches|Sheet_bend|Cleat_hitch>.
   Um mesmo nó pode ter vários números no ABoK (um por capítulo/uso); aqui aparece o do capítulo do uso a bordo.
   API exposta para outros autores/testes: VL.nos = {NOS, prepararForma, sequencia}. */
(function () {
  'use strict';
  var h = VL.h;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var CONT = 1.5;          // espessura do contorno do cabo (unidades do viewBox, de cada lado)
  var seq = 0;
  function uid(p) { seq += 1; return (p || 'nos') + '-' + seq + '-' + Math.random().toString(36).slice(2, 6); }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function f1(x) { return Math.round(x * 10) / 10; }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function suave(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function rad(g) { return g * Math.PI / 180; }
  function svg(tag, attrs) {
    var el = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
    return el;
  }
  function deArt(s) { return /^o /.test(s) ? 'd' + s : /^a /.test(s) ? 'd' + s : 'de ' + s; }
  function en(txt) { return h('span', { class: 'nos-en', 'data-intl': 'on', lang: 'en' }, ' (' + txt + ')'); }

  /* ================================================================== */
  /* Geometria: Catmull-Rom centrípeta, comprimento de arco, cruzamentos */
  /* ================================================================== */
  function amostrar(pts, passo, w) {
    var n = pts.length, X = [], Y = [], Z = [], idx = [];
    function P(i) {
      var a, b;
      if (i < 0) { a = pts[0]; b = pts[1]; return [2 * a[0] - b[0], 2 * a[1] - b[1], a[2] || 0]; }
      if (i >= n) { a = pts[n - 1]; b = pts[n - 2]; return [2 * a[0] - b[0], 2 * a[1] - b[1], a[2] || 0]; }
      return [pts[i][0], pts[i][1], pts[i][2] || 0];
    }
    function d(a, b) { return Math.max(1e-3, Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]))); }
    for (var i = 0; i < n - 1; i++) {
      var p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      var t0 = 0, t1 = t0 + Math.sqrt(d(p0, p1)), t2 = t1 + Math.sqrt(d(p1, p2)), t3 = t2 + Math.sqrt(d(p2, p3));
      var m = Math.max(2, Math.ceil(d(p1, p2) / passo));
      idx[i] = X.length;
      for (var k = 0; k < m; k++) {
        var t = t1 + (t2 - t1) * k / m, c = [0, 0];
        for (var j = 0; j < 2; j++) {
          var A1 = (t1 - t) / (t1 - t0) * p0[j] + (t - t0) / (t1 - t0) * p1[j];
          var A2 = (t2 - t) / (t2 - t1) * p1[j] + (t - t1) / (t2 - t1) * p2[j];
          var A3 = (t3 - t) / (t3 - t2) * p2[j] + (t - t2) / (t3 - t2) * p3[j];
          var B1 = (t2 - t) / (t2 - t0) * A1 + (t - t0) / (t2 - t0) * A2;
          var B2 = (t3 - t) / (t3 - t1) * A2 + (t - t1) / (t3 - t1) * A3;
          c[j] = (t2 - t) / (t2 - t1) * B1 + (t - t1) / (t2 - t1) * B2;
        }
        X.push(c[0]); Y.push(c[1]); Z.push(p1[2] + (p2[2] - p1[2]) * k / m);
      }
    }
    idx[n - 1] = X.length;
    X.push(pts[n - 1][0]); Y.push(pts[n - 1][1]); Z.push(pts[n - 1][2] || 0);
    var S = [0];
    for (var q = 1; q < X.length; q++) S.push(S[q - 1] + Math.sqrt((X[q] - X[q - 1]) * (X[q] - X[q - 1]) + (Y[q] - Y[q - 1]) * (Y[q] - Y[q - 1])));
    // linha do brilho: deslocada para o lado da luz (vinda de cima, à esquerda)
    var HX = [], HY = [], N = X.length, kb = w * 0.2;
    for (var r = 0; r < N; r++) {
      var a0 = Math.max(0, r - 1), a1 = Math.min(N - 1, r + 1), tx = X[a1] - X[a0], ty = Y[a1] - Y[a0], tl = Math.sqrt(tx * tx + ty * ty) || 1;
      var nx = -ty / tl, ny = tx / tl, pr = nx * -0.6 + ny * -0.8;
      HX.push(X[r] + nx * pr * kb); HY.push(Y[r] + ny * pr * kb);
    }
    return { X: X, Y: Y, Z: Z, S: S, L: S[S.length - 1], idx: idx, w: w, HX: HX, HY: HY };
  }
  function busca(S, s) {
    var lo = 0, hi = S.length - 2;
    if (s <= 0) return 0;
    if (s >= S[S.length - 1]) return S.length - 2;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (S[mid] <= s) lo = mid; else hi = mid - 1; }
    return lo;
  }
  function ponto(c, s) {
    s = clamp(s, 0, c.L);
    var i = busca(c.S, s), ds = c.S[i + 1] - c.S[i], t = ds > 0 ? (s - c.S[i]) / ds : 0;
    return {
      x: c.X[i] + (c.X[i + 1] - c.X[i]) * t, y: c.Y[i] + (c.Y[i + 1] - c.Y[i]) * t,
      z: c.Z[i] + (c.Z[i + 1] - c.Z[i]) * t, a: Math.atan2(c.Y[i + 1] - c.Y[i], c.X[i + 1] - c.X[i]),
    };
  }
  /** caminho SVG do trecho [s0, s1] do cabo; brilho = true usa a linha do brilho */
  function trecho(c, s0, s1, brilho) {
    s0 = clamp(s0, 0, c.L); s1 = clamp(s1, 0, c.L);
    if (s1 - s0 < 0.05) return '';
    var X = brilho ? c.HX : c.X, Y = brilho ? c.HY : c.Y;
    var i0 = busca(c.S, s0), i1 = busca(c.S, s1);
    function em(i, s) { var ds = c.S[i + 1] - c.S[i], t = ds > 0 ? (s - c.S[i]) / ds : 0; return f1(X[i] + (X[i + 1] - X[i]) * t) + ' ' + f1(Y[i] + (Y[i + 1] - Y[i]) * t); }
    var d = 'M' + em(i0, s0);
    for (var i = i0 + 1; i <= i1; i++) d += 'L' + f1(X[i]) + ' ' + f1(Y[i]);
    d += 'L' + em(i1, s1);
    return d;
  }
  /** s (comprimento de arco) de um índice de ponto de controle (pode ser fracionário) */
  function sDoIndice(c, v) {
    if (v === 'fim' || v == null) return c.L;
    if (v <= 0) return 0;
    var n = c.idx.length - 1;
    if (v >= n) return c.L;
    var i = Math.floor(v), fr = v - i;
    var a = c.S[c.idx[i]], b = c.S[c.idx[i + 1]];
    return a + (b - a) * fr;
  }
  function cruzamentos(cabos) {
    var cel = 20, grade = {}, segs = [], res = [], vistos = {};
    cabos.forEach(function (c, ci) {
      for (var i = 0; i < c.X.length - 1; i++) {
        var id = segs.length;
        segs.push({ c: ci, i: i });
        var x0 = Math.floor(Math.min(c.X[i], c.X[i + 1]) / cel), x1 = Math.floor(Math.max(c.X[i], c.X[i + 1]) / cel);
        var y0 = Math.floor(Math.min(c.Y[i], c.Y[i + 1]) / cel), y1 = Math.floor(Math.max(c.Y[i], c.Y[i + 1]) / cel);
        for (var gx = x0; gx <= x1; gx++) for (var gy = y0; gy <= y1; gy++) { var k = gx + ',' + gy; (grade[k] = grade[k] || []).push(id); }
      }
    });
    Object.keys(grade).forEach(function (k) {
      var L = grade[k];
      for (var a = 0; a < L.length; a++) for (var b = a + 1; b < L.length; b++) {
        var A = segs[L[a]], B = segs[L[b]], cA = cabos[A.c], cB = cabos[B.c];
        if (cA.prop && cB.prop) continue;
        if (A.c === B.c && Math.abs(cA.S[A.i] - cA.S[B.i]) < cA.w * 2) continue;
        var key = L[a] < L[b] ? L[a] + ':' + L[b] : L[b] + ':' + L[a];
        if (vistos[key]) continue;
        vistos[key] = 1;
        var px = cA.X[A.i], py = cA.Y[A.i], qx = cA.X[A.i + 1], qy = cA.Y[A.i + 1];
        var rx = cB.X[B.i], ry = cB.Y[B.i], sx = cB.X[B.i + 1], sy = cB.Y[B.i + 1];
        var d1x = qx - px, d1y = qy - py, d2x = sx - rx, d2y = sy - ry, den = d1x * d2y - d1y * d2x;
        if (Math.abs(den) < 1e-9) continue;
        var t = ((rx - px) * d2y - (ry - py) * d2x) / den, u = ((rx - px) * d1y - (ry - py) * d1x) / den;
        if (t < 0 || t >= 1 || u < 0 || u >= 1) continue;
        var sa = cA.S[A.i] + (cA.S[A.i + 1] - cA.S[A.i]) * t, sb = cB.S[B.i] + (cB.S[B.i + 1] - cB.S[B.i]) * u;
        var za = cA.Z[A.i] + (cA.Z[A.i + 1] - cA.Z[A.i]) * t, zb = cB.Z[B.i] + (cB.Z[B.i + 1] - cB.Z[B.i]) * u;
        var sen = Math.abs(den) / (Math.sqrt(d1x * d1x + d1y * d1y) * Math.sqrt(d2x * d2x + d2y * d2y));
        var aOver = za > zb;
        res.push({
          o: aOver ? A.c : B.c, so: aOver ? sa : sb, zo: aOver ? za : zb,
          u: aOver ? B.c : A.c, su: aOver ? sb : sa, zu: aOver ? zb : za,
          x: px + d1x * t, y: py + d1y * t, sen: sen, dz: Math.abs(za - zb),
        });
      }
    });
    // o mesmo cruzamento pode aparecer duas vezes quando os dois cabos passam exatamente por um vértice
    var unicos = [];
    res.forEach(function (x) {
      var dup = unicos.some(function (y) {
        return ((y.o === x.o && y.u === x.u && Math.abs(y.so - x.so) < 3 && Math.abs(y.su - x.su) < 3) ||
          (y.o === x.u && y.u === x.o && Math.abs(y.so - x.su) < 3 && Math.abs(y.su - x.so) < 3));
      });
      if (!dup) unicos.push(x);
    });
    return unicos;
  }

  /* ================================================================== */
  /* Objetos em 3D: voltas em cilindros e projeção oblíqua               */
  /* ================================================================== */
  /* Pontos 3D [x, y, Z]: x para a direita, y para baixo, Z para fora da tela (frente). A projeção oblíqua
     (x + kx·Z, y + ky·Z) mostra a parte de trás de cada volta um pouco deslocada; z do desenho = Z. */
  function projetar(kx, ky) { return function (p) { return [f1(p[0] + kx * p[2]), f1(p[1] + ky * p[2]), f1(p[2])]; }; }
  /** volta em cilindro vertical (eixo em x = cx, Z = cz). a em graus: 0 = frente, 90 = direita, 180 = trás. */
  function cilV(cx, cz) { return function (a, y, r) { return [cx + r * Math.sin(rad(a)), y, cz + r * Math.cos(rad(a))]; }; }
  /** volta em cilindro horizontal (eixo em y = cy, Z = cz). a: 0 = frente, 90 = em cima, 180 = trás, 270 = embaixo. */
  function cilH(cy, cz) { return function (a, x, r) { return [x, cy - r * Math.sin(rad(a)), cz + r * Math.cos(rad(a))]; }; }
  /** Gera pontos ao longo de uma volta: quadros [a, coord, r] interpolados a cada `passo` graus. */
  function volta(fn, quadros, passo) {
    var out = [];
    for (var i = 0; i < quadros.length - 1; i++) {
      var A = quadros[i], B = quadros[i + 1], n = Math.max(1, Math.round(Math.abs(B[0] - A[0]) / (passo || 30)));
      for (var k = (i === 0 ? 0 : 1); k <= n; k++) {
        var t = k / n;
        out.push(fn(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t));
      }
    }
    return out;
  }

  /** Junta trechos de uma hélice (cada trecho termina onde o próximo começa). marcas[i] nomeia o ponto de junção
      depois do trecho i (usado como '#nome' nas etapas). */
  function encadear(trechos, marcas) {
    var out = [];
    trechos.forEach(function (t, i) {
      var ultimo = i === trechos.length - 1;
      for (var k = i === 0 ? 0 : 1; k < t.length - (ultimo ? 0 : 1); k++) out.push(t[k]);
      if (!ultimo) {
        if (marcas && marcas[i]) out.push('#' + marcas[i]);
        out.push(t[t.length - 1]);
      }
    });
    return out;
  }
  /** Volta do fiel (clove hitch) em torno de um eixo vertical x = cx: cinco trechos, do firme (direita) ao chicote
      (esquerda). Ângulo 0 = frente, 90 = direita, 180 = trás. A diagonal B passa por cima de A e de C (raio maior). */
  function trechosFiel(cx, y0, R, RB) {
    var f = cilV(cx, 0);
    return {
      C: volta(f, [[810, y0 + 162, R], [630, y0 + 178, R]], 30),
      Rb2: volta(f, [[630, y0 + 178, R], [450, y0 + 188, R]], 30),
      B: volta(f, [[450, y0 + 188, R], [420, y0 + 175.3, RB], [300, y0 + 124.7, RB], [270, y0 + 112, R]], 30),
      Rb1: volta(f, [[270, y0 + 112, R], [90, y0 + 142, R]], 30),
      A: volta(f, [[90, y0 + 142, R], [-90, y0 + 150, R]], 30),
    };
  }

  /* ================================================================== */
  /* Dados dos nós                                                       */
  /* ================================================================== */
  /* Cada cabo: lista de pontos. Formatos: [x, y], [x, y, z], ['nomeDoCruzamento', z] (usa X[nome]) e
     marcadores '#nome' (antes de um ponto) para citar aquele ponto nas etapas. z > 0 = por cima, z < 0 = por
     baixo. Cada etapa: ate = até onde cada cabo aparece ('#marca', 'fim', índice ou '#marca+0.5'). */
  var NOS = [];

  /* ---------- Lais de guia (bowline) — ABoK 1010 ---------- */
  NOS.push({
    id: 'lais-de-guia', nome: 'Lais de guia', en: 'bowline', tipo: 'Alça fixa', abok: '1010',
    vb: [40, 0, 320, 480], foco: [90, 110, 240, 250], w: 14,
    resumo: 'A alça que não corre nem aperta. O nó mais útil a bordo.',
    usos: 'Faz uma alça fixa na ponta do cabo. A bordo: amarrar a escota no punho da vela de proa, fazer uma alça para passar num cabeço ou numa argola e, num resgate, passar a alça por baixo dos braços de quem está na água.',
    vantagens: ['A alça não corre nem aperta sob carga: mantém o tamanho.', 'Desata fácil mesmo depois de muito esforço: basta dobrar para trás o "colar" que abraça o firme.', 'Rápido de fazer e fácil de conferir.'],
    cuidados: ['Pode se soltar sozinho quando fica frouxo e sacudindo (por exemplo, numa escota que bate). Deixe uma boa sobra de chicote e confira sempre.', 'Não se faz nem se desfaz com o cabo sob carga.', 'Confira o resultado: neste lais de guia comum, o chicote termina por dentro da alça grande.'],
    memoria: 'O coelho sai da toca, dá a volta na árvore e volta para a toca. A toca é a alça pequena; a árvore é o firme.',
    X: { x0: [200, 228], c1: [254, 305], c2: [241, 234], c3: [200, 150], c4: [156, 225], c5: [172, 253], c6: [203, 320] },
    cabos: [{
      cor: 'a', pts: [
        [200, -20], [200, 70], ['c3', 1], [200, 192], '#toca', ['x0', -1], [185, 240], ['c5', -1], [164, 276], [171, 302], [188, 316],
        ['c6', 1], [222, 322], [242, 315], ['c1', 1], [263, 288], [266, 265], [257, 244], ['c2', -1], [221, 228], '#cruza', ['x0', 1],
        '#alcap', [178, 222], ['c4', -1], [138, 237], [126, 259], [116, 300], [113, 350], [125, 404], [158, 446], '#baixo', [207, 465], [256, 455], [293, 420],
        [309, 372], [303, 337], '#sobe', [283, 317], ['c1', -1], [246, 272], ['c2', 1], [234, 203], '#arvore', [225, 173], [213, 155], ['c3', -1],
        [184, 148], [166, 155], '#volta', [154, 173], [150, 198], ['c4', 1], [163, 240], ['c5', 1], [186, 284], ['c6', -1], [210, 350], [214, 388],
      ],
    }],
    rotulos: [
      { txt: 'firme', cabo: 0, em: 1, dx: 14, dy: 0, ancora: 'start', etapas: [0, 1, 2, 3, 4, 5, 6] },
      { txt: 'chicote', cabo: 0, em: 'ponta', dx: 16, dy: 8, ancora: 'start', etapas: [0, 1, 2, 3, 4, 5] },
      { txt: 'alça pequena', cabo: 0, em: '#cruza', dx: 50, dy: 30, ancora: 'start', etapas: [1, 2] },
      { txt: 'alça', cabo: 0, em: '#baixo', dx: 0, dy: -60, ancora: 'middle', etapas: [2, 3, 6] },
    ],
    etapas: [
      { ate: ['#toca+1.4'], txt: 'O <b>firme</b> é a parte do cabo que vai levar a carga (aqui, para cima). O <b>chicote</b> é a ponta livre, com que você trabalha.' },
      { ate: ['#alcap'], txt: 'Faça uma <b>alça pequena</b> (a "toca do coelho"): a parte do lado do chicote passa <b>por cima</b> do firme.' },
      { ate: ['#sobe'], txt: 'Desça com o chicote e escolha o tamanho da <b>alça grande</b>. Traga a ponta de volta, por baixo da alça pequena.' },
      { ate: ['#arvore'], txt: 'O coelho sai da toca: passe o chicote pela alça pequena de baixo para cima. Ele entra <b>por baixo</b> e sai <b>por cima</b>.' },
      { ate: ['#volta'], txt: 'Dá a volta na árvore: leve o chicote <b>por trás</b> do firme.' },
      { ate: ['fim'], txt: 'Volta para a toca: desça o chicote pela alça pequena, ao lado de onde ele subiu. Ele passa <b>por cima</b> e sai <b>por baixo</b>.' },
      { ate: ['fim'], final: true, txt: 'Ajuste: segure o chicote junto com o lado da alça e puxe o firme. Confira: o chicote termina <b>por dentro</b> da alça grande, e o "colar" abraça o firme.' },
    ],
  });

  /* ---------- Nó de oito (figure-eight) — ABoK 520 ---------- */
  NOS.push({
    id: 'oito', nome: 'Nó de oito', en: 'figure-eight knot', tipo: 'Nó de trava (batente)', abok: '520',
    vb: [40, 0, 320, 480], foco: [110, 120, 210, 230], w: 14,
    resumo: 'Faz um "calombo" na ponta do cabo para ele não escapar.',
    usos: 'Faz um batente na ponta do cabo, para ela não fugir pelo moitão (polia), pela buzina ou pelo mordente. A bordo: na ponta das escotas e de outros cabos de laborar, antes de sair do porto.',
    vantagens: ['Fica maior e mais firme que o nó simples (o de "meia-volta"), e não estraga o cabo.', 'Desata com facilidade, mesmo depois de levar um tranco.', 'Fácil de reconhecer: tem a forma de um 8.'],
    cuidados: ['Deixe uma sobra de chicote de alguns centímetros depois do nó.', 'Atenção: em adriças e em alguns cabos, há quem prefira não ter nó na ponta (para o cabo poder correr numa emergência). Siga a orientação do comandante.'],
    memoria: 'Alça, volta por trás do firme, e entra pela frente na alça.',
    X: { a: [200, 238], b: [200, 160], c: [262, 237], d: [238, 334] },
    cabos: [{
      cor: 'a', pts: [
        [200, -20], [200, 80], ['b', 1], [200, 200], ['a', -1], '#solto', [200, 280], [209, 314], ['d', 1], [270, 328], [291, 302], [294, 268],
        [282, 247], ['c', -1], [232, 234], ['a', 1], '#alca', [170, 244], [146, 228], [137, 198], [149, 170], [173, 158], ['b', -1], '#tras', [230, 156],
        [260, 166], [278, 192], ['c', 1], [250, 285], ['d', -1], [233, 372], [229, 412],
      ],
    }],
    rotulos: [
      { txt: 'firme', cabo: 0, em: 1, dx: 14, dy: 0, ancora: 'start', etapas: [0, 1, 2, 3, 4] },
      { txt: 'chicote', cabo: 0, em: 'ponta', dx: 16, dy: 6, ancora: 'start', etapas: [0, 1, 2, 3] },
    ],
    etapas: [
      { ate: ['#solto'], txt: 'Segure o cabo com o <b>firme</b> para cima e o <b>chicote</b> (a ponta) para baixo.' },
      { ate: ['#alca'], txt: 'Faça uma alça: leve o chicote para a direita, para cima e cruze <b>por cima</b> do firme.' },
      { ate: ['#tras'], txt: 'Passe o chicote <b>por trás</b> do firme, de um lado para o outro.' },
      { ate: ['fim'], txt: 'Enfie o chicote na primeira alça pela frente: ele entra <b>por cima</b> e sai <b>por baixo</b>.' },
      { ate: ['fim'], final: true, txt: 'Ajuste puxando o firme e o chicote ao mesmo tempo. O nó fica com a forma de um 8.' },
    ],
  });

  /* ---------- Nó direito (reef knot) — ABoK 1204 — e nó torto (granny) — ABoK 1206 ---------- */
  /* Desenho clássico simétrico: as duas alças (seios) entrelaçadas. Cruzamentos: Lb/Lt = perna esquerda da alça
     azul com os dois ramos bege; Rb/Rt = perna direita da alça bege com os ramos azuis; BC/TC = meio, embaixo e em
     cima. Revelando os dois cabos a partir dos firmes, a meia-volta de baixo é "esquerda sobre a direita e por
     baixo" e a de cima, "direita sobre a esquerda e por baixo". Verificado pelo polinômio de Jones (pontas unidas
     por cima e firmes por baixo): direito = nó quadrado (trevo # trevo espelhado); torto = nó vovó (trevo # trevo). */
  function noDeRizar(torto) {
    // z da bege (cabo 0) em cada cruzamento; a azul tem o sinal oposto
    var zb = torto ? { Lb: -1, BC: 1, Rb: -1, Rt: 1, TC: -1, Lt: 1 } : { Lb: -1, BC: 1, Rb: -1, Rt: -1, TC: 1, Lt: -1 };
    function b(n) { return [n, zb[n]]; }
    function a(n) { return [n, -zb[n]]; }
    var bege = [[0, 154], [60, 154], b('Lb'), '#v0', [160, 154], b('BC'), '#v1', [232, 206], [264, 202], [278, 178], b('Rb'), '#v2', [278, 118],
      b('Rt'), [278, 50], [260, 26], [232, 22], b('TC'), '#v3', [160, 82], b('Lt'), [68, 82]];
    var azul = [[400, 154], [340, 154], a('Rb'), '#a0', [244, 154], a('BC'), '#a1', [164, 210], [132, 198], [122, 178], a('Lb'), '#a2', [122, 118],
      a('Lt'), [122, 54], [140, 30], [164, 26], a('TC'), '#a3', [244, 82], a('Rt'), [332, 82]];
    return [{ cor: 'a', pts: bege }, { cor: 'b', pts: azul }];
  }
  var X_RIZAR = { Lb: [122, 154], BC: [196, 180], Rb: [278, 154], Rt: [278, 82], TC: [196, 46], Lt: [122, 82] };
  NOS.push({
    id: 'direito', nome: 'Nó direito', en: 'reef knot', tipo: 'Nó de amarrar (em volta de algo)', abok: '1204',
    vb: [0, -6, 400, 240], foco: [92, 4, 216, 222], w: 14, X: X_RIZAR,
    resumo: 'Duas meias-voltas em sentidos opostos. Amarra em volta de algo e fica chato.',
    usos: 'Amarra as duas pontas de um mesmo cabo em volta de alguma coisa. A bordo: rizar a vela (amarrar as fitas de rizar em volta da vela enrolada na retranca), amarrar a vela ferrada, fechar um saco ou um embrulho.',
    vantagens: ['Fica chato e não incomoda.', 'Aperta bem em volta do que está amarrado.', 'Solta fácil: basta puxar uma das pontas para trás.'],
    cuidados: ['Não use para emendar dois cabos que vão levar carga: o nó pode virar e soltar. Para unir cabos, use o nó de escota.', 'Se as duas meias-voltas forem no mesmo sentido, sai o nó torto, que escorrega ou trava. Confira sempre.'],
    memoria: 'Esquerda sobre a direita e por baixo; direita sobre a esquerda e por baixo. As cores ajudam: cada cabo sai do mesmo lado por onde entrou.',
    cabos: noDeRizar(false),
    comparar: { id: 'torto', rotulo: 'Comparar com o nó torto (o jeito errado)' },
    rotulos: [
      { txt: 'ponta da esquerda', cabo: 0, em: 'ponta', dx: -8, dy: -20, ancora: 'end', etapas: [0] },
      { txt: 'ponta da direita', cabo: 1, em: 'ponta', dx: 8, dy: -20, ancora: 'start', etapas: [0] },
    ],
    etapas: [
      { ate: ['#v0', '#a0'], txt: 'Passe o cabo em volta do que vai amarrar (por exemplo, a vela enrolada na retranca). Uma ponta vem da esquerda e a outra da direita. As cores diferentes são só para você acompanhar cada ponta.' },
      { ate: ['#v0+1.6', '#a0+1.6'], ativo: [0], txt: '<b>Esquerda sobre a direita</b>: cruze a ponta da esquerda (bege) <b>por cima</b> da ponta da direita (azul).' },
      { ate: ['#v2', '#a2'], ativo: [0], txt: '<b>…e por baixo</b>: a bege passa <b>por baixo</b> da azul e sobe pela direita, enquanto a azul sobe pela esquerda. Esta é a primeira meia-volta. Agora a bege está à direita.' },
      { ate: ['#v3', '#a3'], ativo: [0], txt: '<b>Direita sobre a esquerda</b>: a ponta da direita (de novo a bege) faz a curva e cruza <b>por cima</b> da azul.' },
      { ate: ['fim', 'fim'], ativo: [0], txt: '<b>…e por baixo</b>: a bege passa <b>por baixo</b> da azul e sai pela esquerda, ao lado do seu firme. A azul sai pela direita.' },
      { ate: ['fim', 'fim'], final: true, txt: 'Aperte puxando as quatro partes. Confira: cada cabo forma uma alça, e a ponta e o firme de uma cor passam <b>do mesmo jeito</b> pela alça da outra (aqui, os dois ramos bege passam por baixo da perna esquerda da alça azul). O nó fica chato, com as pontas paralelas ao firme.' },
    ],
  });
  NOS.push({
    id: 'torto', nome: 'Nó torto (errado)', en: 'granny knot', tipo: 'Erro comum: não use', abok: '1206', oculto: true,
    vb: [0, -6, 400, 240], foco: [92, 4, 216, 222], w: 14, X: X_RIZAR,
    resumo: 'Parece o nó direito, mas as duas meias-voltas foram no mesmo sentido.',
    usos: 'Nenhum: é o erro mais comum ao tentar fazer o nó direito. Também é chamado de nó de vaca. Ele aparece quando as duas meias-voltas são feitas no mesmo sentido (esquerda sobre direita duas vezes).',
    vantagens: ['Nenhuma em relação ao nó direito.'],
    cuidados: ['Escorrega e pode soltar sozinho quando puxado; ou então trava e fica difícil de desfazer.', 'Como reconhecer: as pontas saem atravessadas em relação ao firme, e o nó fica torto em vez de chato.'],
    memoria: 'Se a segunda meia-volta repete a primeira, desfaça e refaça invertendo: direita sobre a esquerda.',
    cabos: noDeRizar(true),
    comparar: { id: 'direito', rotulo: 'Voltar ao nó direito (o certo)' },
    aviso: { tipo: 'seguranca', titulo: 'Este é o jeito errado', html: 'O nó torto pode soltar sem aviso. Compare com o nó direito: lá, a segunda meia-volta é feita no sentido contrário.' },
    etapas: [
      { ate: ['#v0', '#a0'], txt: 'Começo igual ao do nó direito: uma ponta vem da esquerda (bege) e a outra da direita (azul).' },
      { ate: ['#v0+1.6', '#a0+1.6'], ativo: [0], txt: '<b>Esquerda sobre a direita</b>: a bege cruza <b>por cima</b> da azul.' },
      { ate: ['#v2', '#a2'], ativo: [0], txt: '…e <b>por baixo</b>: a bege passa <b>por baixo</b> da azul e sobe pela direita. Primeira meia-volta, igual à do nó direito.' },
      { ate: ['#v3', '#a3'], ativo: [1], txt: 'O erro: <b>esquerda sobre a direita de novo</b>. Agora a ponta da esquerda é a azul, que faz a curva e cruza <b>por cima</b> da bege.' },
      { ate: ['fim', 'fim'], ativo: [1], txt: '…e <b>por baixo</b>: a azul passa <b>por baixo</b> da bege. A segunda meia-volta saiu no mesmo sentido da primeira.' },
      { ate: ['fim', 'fim'], final: true, txt: 'Resultado: nó torto. Repare na esquerda: o firme bege passa por baixo da perna da alça azul, mas a ponta bege passa por cima. As pontas ficam atravessadas, e o nó escorrega ou trava. Desfaça e refaça com a segunda meia-volta no sentido contrário.' },
    ],
  });


  /* ---------- Volta do fiel (clove hitch) — ABoK 1177 ---------- */
  /* Poste vertical em x = 200. Do firme (à direita) ao chicote (à esquerda): C (frente, sob a diagonal), volta por trás,
     B (a diagonal, POR CIMA de C e de A), volta por trás, A (frente, POR BAIXO da diagonal). Conferido com a foto do
     ABoK 11/1177 (USCG): duas voltas no poste, a segunda cruza por cima da primeira e o chicote sai sob o cruzamento. */
  var FIEL = trechosFiel(200, 0, 40, 48);
  NOS.push({
    id: 'fiel', nome: 'Volta do fiel', en: 'clove hitch', tipo: 'Volta em poste ou barra', abok: '1177 e 1178',
    vb: [40, 50, 320, 200], foco: [110, 70, 180, 150], w: 14,
    objetos: [{ tipo: 'poste', nome: 'o poste', w: 56, pts: [[200, 20], [200, 290]], cruza: true }],
    resumo: 'Duas voltas no poste, a segunda cruzando por cima da primeira. Rápida de fazer e de ajustar.',
    usos: 'Prende um cabo num poste, balaústre, tubo ou argola. A bordo: prender a defensa no balaústre ou no guarda-mancebo, dar a primeira volta provisória num cabeço, amarrar um cabo no pé de um mastro.',
    vantagens: ['Faz-se e desfaz-se em segundos, mesmo sem carga.', 'Dá para ajustar a altura: afrouxando a volta, ela desliza ao longo do poste.', 'Segura bem quando a força vem sempre no mesmo sentido.'],
    cuidados: ['Pode afrouxar e soltar sozinha quando o cabo sacode ou quando a força ora puxa, ora alivia. Para segurança extra, arremate com um cote (meia-volta) no firme.', 'Não use como única amarra de um barco no cais: use a volta redonda e dois cotes.', 'Em objetos lisos e escorregadios (um tubo molhado), ela pode deslizar.'],
    memoria: 'Duas voltas no poste. A segunda cruza por cima da primeira, e o chicote passa por baixo dessa diagonal.',
    cabos: [{
      cor: 'a', pts: encadear([
        [[360, 162, 0], [310, 162, 0], FIEL.C[0]], FIEL.C, FIEL.Rb2, FIEL.B, FIEL.Rb1, FIEL.A,
        [FIEL.A[FIEL.A.length - 1], [130, 150, 0], [100, 150, 0], [70, 150, 0]],
      ], ['poste', 'cend', 'b0', 'b1', 'a0', 'tail0']),
    }],
    rotulos: [
      { txt: 'firme', cabo: 0, em: 1, dx: 0, dy: -16, ancora: 'middle', etapas: [0, 1, 2, 3, 4] },
      { txt: 'chicote', cabo: 0, em: 'ponta', dx: 0, dy: -16, ancora: 'middle', etapas: [3, 4] },
    ],
    etapas: [
      { ate: ['#poste'], txt: 'O <b>firme</b> chega pela direita (é o lado que leva a carga). O <b>chicote</b> é a ponta livre. O poste pode ser um balaústre, um tubo ou um cabeço.' },
      { ate: ['#b0'], txt: '<b>Primeira volta:</b> passe o cabo pela <b>frente</b> do poste, da direita para a esquerda, e dê a volta por <b>trás</b>, voltando para o lado direito.' },
      { ate: ['#a0'], txt: '<b>Segunda volta:</b> suba em diagonal, cruzando <b>por cima</b> da primeira volta, e dê outra volta por <b>trás</b> do poste.' },
      { ate: ['fim'], txt: 'Traga o chicote pela frente de novo e enfie-o <b>por baixo</b> da diagonal (o cruzamento que você fez), saindo para a esquerda.' },
      { ate: ['fim'], final: true, txt: 'Aperte puxando o firme e o chicote. Confira: de frente aparece uma diagonal por cima, e o firme e o chicote saem em lados opostos, <b>os dois por baixo</b> da diagonal.' },
    ],
  });

  /* ---------- Volta redonda e dois cotes (round turn and two half hitches) — ABoK 1720 ---------- */
  /* Barra horizontal (y = 70); a hélice em torno dela usa projeção oblíqua para separar a frente do fundo.
     Depois da volta redonda, o chicote faz em volta do próprio firme (vertical em x = 250) duas meias-voltas no mesmo
     sentido, o mesmo desenho da volta do fiel. */
  var RT_H = cilH(70, 0), RT_P = projetar(0.7, 0);
  function RTh(q) { return volta(RT_H, q, 30).map(RT_P); }
  var RT_H1 = RTh([[270, 250, 34], [630, 298, 34]]), RT_H2 = RTh([[630, 298, 34], [990, 346, 34]]);
  var RT_C = trechosFiel(250, 180, 30, 38);
  NOS.push({
    id: 'volta-redonda', nome: 'Volta redonda e dois cotes', en: 'round turn and two half hitches', tipo: 'Amarra em barra, argola ou cabeço', abok: '1720',
    vb: [60, 10, 320, 450], foco: [175, 20, 190, 360], w: 14,
    objetos: [{ tipo: 'barra', nome: 'a barra', w: 28, pts: [[40, 70], [390, 70]], cruza: true }],
    resumo: 'A amarra mais segura para prender um cabo num ponto fixo. Solta mesmo sob carga.',
    usos: 'Prende a ponta de um cabo numa barra, argola, balaústre ou cabeço. A bordo: amarrar o cabo de um bote ou de uma defensa, o cabo de reboque, o cabo do barco numa argola do cais.',
    vantagens: ['A volta redonda (duas voltas) segura quase toda a força por atrito; os dois cotes só travam.', 'Dá para soltar o cabo aos poucos, mesmo com carga, e controlar o cabo ao largar.', 'Não escorrega em objetos lisos como a volta do fiel pode escorregar.'],
    cuidados: ['Faça a volta redonda (as duas voltas) antes dos cotes. Sem ela, vira só uma volta com cotes.', 'Os dois cotes devem ir no mesmo sentido; senão o resultado é um nó torto que trava ou escorrega.', 'Deixe uma sobra no chicote depois do segundo cote.'],
    memoria: 'Duas voltas na barra e, depois, dois cotes no mesmo sentido em volta do firme (como uma volta do fiel no próprio cabo).',
    cabos: [{
      cor: 'a', pts: encadear([
        [[250, 450, 0], [250, 420, 0], [250, 300, 0], [250, 150, 0], RT_H1[0]], RT_H1, RT_H2,
        [RT_H2[RT_H2.length - 1], [350, 160, 0], [348, 240, 0], [342, 300, 0], [328, 334, 0], [304, 342, 0], RT_C.C[0]],
        RT_C.C, RT_C.Rb2, RT_C.B, RT_C.Rb1, RT_C.A,
        [RT_C.A[RT_C.A.length - 1], [180, 330, 0], [140, 332, 0], [100, 333, 0]],
      ], ['sob', 'v1', 'v2', 'c0', 'cend', 'b0', 'b1', 'a0', 'tail0']),
    }],
    rotulos: [
      { txt: 'firme', cabo: 0, em: 1, dx: 14, dy: 0, ancora: 'start', etapas: [0, 1, 2, 3, 4, 5] },
      { txt: 'chicote', cabo: 0, em: 'ponta', dx: 0, dy: -16, ancora: 'middle', etapas: [5, 6] },
    ],
    etapas: [
      { ate: ['#sob'], txt: 'O <b>firme</b> sobe do barco (ou da carga) até a barra. O <b>chicote</b> é a ponta com que você trabalha.' },
      { ate: ['#v1'], txt: '<b>Primeira volta da volta redonda:</b> passe o chicote pela <b>frente</b> da barra, por cima dela, e volte por <b>trás</b>.' },
      { ate: ['#v2'], txt: '<b>Segunda volta:</b> repita. Duas voltas completas na barra é o que se chama de <b>volta redonda</b>. Agora o chicote desce ao lado do firme.' },
      { ate: ['#b0'], txt: '<b>Primeiro cote:</b> leve o chicote pela <b>frente</b> do firme, da direita para a esquerda, e dê a volta por <b>trás</b> dele.' },
      { ate: ['#a0'], txt: '<b>Segundo cote, no mesmo sentido:</b> cruze <b>por cima</b> da volta anterior, em diagonal, e dê outra volta por <b>trás</b> do firme.' },
      { ate: ['fim'], txt: 'Traga o chicote pela frente e enfie-o <b>por baixo</b> da diagonal, saindo para a esquerda. Os dois cotes juntos têm o desenho da volta do fiel.' },
      { ate: ['fim'], final: true, txt: 'Aperte os cotes junto ao firme. Para soltar, desfaça os cotes e vá largando a volta redonda aos poucos. Confira: duas voltas completas na barra e dois cotes no mesmo sentido.' },
    ],
  });

  /* ---------- Nó de escota (sheet bend) — ABoK 1431 — e dobrado (double sheet bend) — ABoK 1434 ---------- */
  /* A (bege, grosso) faz o seio: curva à direita, perna de cima = firme de A, perna de baixo = chicote de A.
     B (azul, fino) vem da direita: passa POR BAIXO da curva do seio, entra no buraco, sai POR CIMA da perna de baixo,
     dá a volta POR TRÁS das duas pernas (por baixo de ambas), volta POR CIMA da perna de cima, desce pelo meio do seio
     passando POR BAIXO da própria diagonal e POR CIMA da perna de baixo; o chicote de B sai para baixo, do mesmo
     lado do chicote de A. Conferido com a foto "Schotstek rechts" (Wikimedia) e o diagrama do ABoK 1431. */
  var X_ESC = { xb: [322, 121], ru1: [66, 85], ru2: [178, 75], rl1: [141, 173], rl2: [196, 193], rl3: [61, 134], dv: [207, 166] };
  NOS.push({
    id: 'escota', nome: 'Nó de escota', en: 'sheet bend', tipo: 'Nó de emenda (une dois cabos)', abok: '1431',
    vb: [-20, -10, 440, 285], foco: [20, 20, 320, 250], X: X_ESC,
    resumo: 'Une dois cabos, mesmo de grossuras diferentes. É o nó para amarrar a escota na vela.',
    usos: 'Une dois cabos, principalmente de grossuras diferentes, ou prende um cabo fino num seio ou olhal do cabo grosso. A bordo: prolongar uma escota ou um cabo de amarração e emendar cabos de reboque. O nome vem de escota (sheet em inglês): era o nó usado para amarrar a escota ao punho da vela de pano.',
    vantagens: ['Une cabos de grossuras diferentes, o que o nó direito não faz bem.', 'Fácil de desfazer, mesmo depois de levar carga.', 'Rápido de fazer; a ideia é a mesma do lais de guia.'],
    cuidados: ['Pode soltar-se quando está frouxo e sacudindo. Deixe os chicotes compridos e confira o nó.', 'Faça com os dois chicotes do mesmo lado. Com os chicotes em lados opostos, o nó fica mais fraco.', 'Em cabos muito diferentes na grossura ou muito escorregadios, prefira o nó de escota dobrado.'],
    memoria: 'O cabo fino sobe pelo seio do grosso, dá a volta por trás das duas pernas e passa por baixo de si mesmo.',
    cabos: [
      { cor: 'a', w: 15, pts: [[-10, 88], [20, 86], ['ru1', 1], [120, 85], [150, 80], ['ru2', -1], [210, 68], [245, 61], [275, 60], [303, 76], [319, 98], ['xb', 1], [317, 150], [296, 184], [270, 205], [245, 210], ['rl2', -1], [170, 185], ['rl1', -1], [120, 165], [95, 150], ['rl3', 1], [40, 125], [10, 114]] },
      { cor: 'b', w: 12, pts: [[395, 122], [350, 121], ['xb', -1], '#dentro', [292, 117], [245, 135], ['dv', 1], ['rl1', 1], [95, 177], [70, 172], [58, 156], '#esq', ['rl3', -1], [62, 110], ['ru1', -1], '#cima', [70, 67], [85, 48], [120, 35], [155, 45], ['ru2', 1], '#arco', [205, 115], '#desce', [212, 150], ['dv', -1], [200, 185], ['rl2', 1], [194, 225], [195, 257]] },
    ],
    rotulos: [
      { txt: 'firme de A', cabo: 0, em: 1, dx: 0, dy: -16, ancora: 'start', etapas: [0, 1] },
      { txt: 'chicote de A', cabo: 0, em: 'ponta', dx: 0, dy: 30, ancora: 'start', etapas: [0, 1, 2, 3, 4] },
      { txt: 'firme de B', cabo: 1, em: 1, dx: 0, dy: -16, ancora: 'middle', etapas: [1, 2, 3, 4] },
      { txt: 'chicote de B', cabo: 1, em: 'ponta', dx: 20, dy: 4, ancora: 'start', etapas: [1, 4] },
    ],
    etapas: [
      { ate: ['fim', 0], ativo: [0], txt: 'Com o cabo grosso (bege, A), faça um <b>seio</b>: a curva fica à direita e as duas pernas vão para a esquerda. A perna de cima é o firme de A; a de baixo é o chicote de A.' },
      { ate: ['fim', '#dentro+1'], ativo: [1], txt: 'O cabo fino (azul, B) chega pela direita. Passe o chicote de B <b>por baixo</b> da curva do seio, entrando pelo buraco do seio.' },
      { ate: ['fim', '#cima'], ativo: [1], txt: 'Dentro do seio, vá para baixo e passe <b>por cima</b> da perna de baixo. Depois dê a volta por <b>trás das duas pernas</b>: por baixo da perna de baixo e por baixo da perna de cima.' },
      { ate: ['fim', '#desce+1'], ativo: [1], txt: 'Volte <b>por cima</b> da perna de cima e desça pelo meio do seio.' },
      { ate: ['fim', 'fim'], ativo: [1], txt: 'Passe o chicote <b>por baixo</b> da própria volta (a diagonal que você fez no passo 3) e <b>por cima</b> da perna de baixo, saindo para baixo.' },
      { ate: ['fim', 'fim'], final: true, txt: 'Aperte puxando os dois firmes em sentidos contrários. Confira: os dois chicotes saem do <b>mesmo lado</b>, e B passa por trás das duas pernas do seio de A.' },
    ],
  });

  var X_ESC2 = { xb: [322, 121], ru1a: [66, 85], ru1b: [40, 85], ru2a: [178, 75], ru2b: [216, 67], rl1: [141, 173], rl2a: [184, 190], rl2b: [216, 200], rl3a: [61, 134], rl3b: [38, 124], dv1: [190, 168], dv2: [221, 149] };
  NOS.push({
    id: 'escota-dobrado', nome: 'Nó de escota dobrado', en: 'double sheet bend', tipo: 'Nó de emenda (une dois cabos)', abok: '1434',
    vb: [-20, -10, 440, 285], foco: [10, 5, 330, 270], X: X_ESC2,
    resumo: 'Nó de escota com uma volta a mais. Mais seguro para cabos muito diferentes ou escorregadios.',
    usos: 'Une dois cabos quando a diferença de grossura é grande, o cabo é liso ou a escota bate muito (por exemplo, na vela de proa). A bordo: emendar a escota e cabos de reboque com segurança.',
    vantagens: ['A volta a mais em volta das duas pernas aumenta o atrito e segura melhor.', 'Solta menos quando o cabo sacode.', 'Continua fácil de desfazer.'],
    cuidados: ['Faça com os dois chicotes do mesmo lado.', 'Aperte bem as duas voltas juntas antes de levar carga.', 'Confira o nó depois de cada vez que a escota bater muito.'],
    memoria: 'Igual ao nó de escota, mas o cabo fino dá duas voltas por trás das pernas antes de passar por baixo de si mesmo.',
    cabos: [
      { cor: 'a', w: 15, pts: [[-10, 88], [20, 86], ['ru1b', 1], ['ru1a', 1], [120, 85], [150, 80], ['ru2a', -1], [210, 68], ['ru2b', -1], [245, 61], [275, 60], [303, 76], [319, 98], ['xb', 1], [317, 150], [296, 184], [270, 205], [245, 210], ['rl2b', -1], [203, 195], ['rl2a', -1], [170, 185], ['rl1', -1], [120, 165], [95, 150], ['rl3a', 1], ['rl3b', 1], [10, 114]] },
      { cor: 'b', w: 12, pts: [[395, 122], [350, 121], ['xb', -1], '#dentro', [292, 117], [245, 135], ['dv2', 1], ['dv1', 1], ['rl1', 1], [95, 177], [70, 172], [58, 156], '#esq', ['rl3a', -1], [62, 110], ['ru1a', -1], '#cima', [70, 67], [85, 48], [120, 35], [155, 45], ['ru2a', 1], '#arco', [188, 110], [191, 145], '#desce', ['dv1', -1], [186, 180], ['rl2a', 1], [180, 215], '#fundo', [165, 230], [120, 236], [70, 228], [42, 205], [37, 160], '#esq2', ['rl3b', -1], [38, 100], ['ru1b', -1], '#cima2', [42, 60], [52, 34], [105, 18], [165, 20], [200, 42], ['ru2b', 1], '#arco2', [222, 100], [222, 130], '#desce2', ['dv2', -1], [219, 175], ['rl2b', 1], [214, 230], [216, 262]] },
    ],
    rotulos: [
      { txt: 'firme de B', cabo: 1, em: 1, dx: 0, dy: -16, ancora: 'middle', etapas: [1, 2, 3, 4, 5] },
      { txt: 'chicote de B', cabo: 1, em: 'ponta', dx: 20, dy: 4, ancora: 'start', etapas: [1, 4] },
    ],
    etapas: [
      { ate: ['fim', 0], ativo: [0], txt: 'Com o cabo grosso (bege, A), faça um <b>seio</b>: a curva fica à direita e as duas pernas vão para a esquerda.' },
      { ate: ['fim', '#dentro+1'], ativo: [1], txt: 'O cabo fino (azul, B) chega pela direita. Passe o chicote <b>por baixo</b> da curva do seio, entrando pelo buraco.' },
      { ate: ['fim', '#cima'], ativo: [1], txt: 'Vá <b>por cima</b> da perna de baixo e dê a volta por <b>trás das duas pernas</b> (por baixo de ambas).' },
      { ate: ['fim', '#cima2'], ativo: [1], txt: 'Suba por cima da perna de cima, desça pelo meio do seio, passe por baixo da diagonal e por cima da perna de baixo, e dê <b>mais uma volta</b> por trás das duas pernas. Essa volta a mais é o que faz o nó ser "dobrado".' },
      { ate: ['fim', 'fim'], ativo: [1], txt: 'Suba de novo <b>por cima</b> da perna de cima, desça pelo meio do seio, passe <b>por baixo</b> da diagonal e <b>por cima</b> da perna de baixo, saindo para baixo.' },
      { ate: ['fim', 'fim'], final: true, txt: 'Aperte as duas voltas juntas, puxando os firmes em sentidos contrários. Confira: duas voltas de B por trás das pernas e os dois chicotes do <b>mesmo lado</b>.' },
    ],
  });

  /* ---------- Volta de cunho (cleat hitch) — ABoK 1615 ---------- */
  /* Vista de cima. O cunho é a barra horizontal (y = 170) com um chifre em cada ponta; a placa é o pé. "Por baixo do
     chifre" = o cabo passa entre o chifre e a placa (por baixo da barra no desenho). Passos: volta no pé (por baixo dos
     dois chifres), um oito (duas diagonais por cima da barra em X) e a volta de trava (o chicote por baixo do cabo). */
  var X_CUN = { rh1: [316, 170], lh1: [80, 170], rh2: [290, 170], lh2: [112, 170], db1: [190, 170], db2: [210, 170], dd: [200, 178], tk: [92, 130] };
  NOS.push({
    id: 'cunho', nome: 'Volta de cunho', en: 'cleat hitch', tipo: 'Volta em cunho', abok: '1615',
    vb: [0, 0, 400, 270], foco: [40, 40, 320, 220], w: 14, X: X_CUN,
    objetos: [{ tipo: 'cunho', nome: 'o cunho', w: 30, pts: [[75, 170], [325, 170]], cruza: true }],
    decor: [
      { tipo: 'retangulo', x: 112, y: 126, w: 176, h: 88, rx: 8, classe: 'chapa' },
      { tipo: 'circulo', x: 126, y: 140, r: 4.5, classe: 'parafuso' }, { tipo: 'circulo', x: 274, y: 140, r: 4.5, classe: 'parafuso' },
      { tipo: 'circulo', x: 126, y: 200, r: 4.5, classe: 'parafuso' }, { tipo: 'circulo', x: 274, y: 200, r: 4.5, classe: 'parafuso' },
    ],
    resumo: 'A forma segura e rápida de amarrar e soltar um cabo num cunho.',
    usos: 'Prende um cabo (escota, adriça, espia) num cunho. A bordo: amarrar as espias do barco no cais ou no convés, a adriça depois de içar a vela, a escota de uma vela pequena.',
    vantagens: ['Segura bem sob carga e solta em segundos, mesmo com o cabo esticado.', 'O desenho em X distribui a força pelos dois chifres.', 'Fácil de conferir: o X por cima do cunho e a trava no fim.'],
    cuidados: ['Dê a primeira volta na base do cunho, por baixo do chifre, antes do X. Sem ela, o cabo pode escorregar.', 'Faça só um ou dois oitos: voltas demais travam o nó, que fica difícil de soltar.', 'A volta de trava (o chicote por baixo do cabo) impede que o nó se solte quando o cabo sacode. Não a esqueça.', 'Deixe uma sobra de chicote e nunca amarre com o cabo sob carga.', 'Desenho esquemático em vista de cima, com o nó frouxo. A forma exata da trava varia um pouco entre escolas de vela; o princípio (chicote preso por baixo do cabo) é o mesmo.'],
    memoria: 'Pé, X, trava: uma volta embaixo do chifre, um oito por cima e o chicote preso por baixo.',
    cabos: [{
      cor: 'a', pts: [
        [0, 14], [70, 36], [150, 62], [230, 88], [282, 112], '#r1', [306, 138], ['rh1', -1], [310, 200], [290, 226], [250, 238], [190, 242], [130, 238], [96, 222], [82, 196],
        ['lh1', -1], '#lh1e', [80, 150], ['tk', 1], [100, 112], '#d1a', [118, 106], [142, 120], [166, 142], ['db1', 1], ['dd', 1], [225, 192], [255, 205], [282, 206], [294, 192],
        ['rh2', -1], '#rh2e', [288, 148], [262, 150], [232, 157], ['db2', 2], ['dd', 2], [170, 196], [140, 204], [120, 198], [112, 185], ['lh2', -1], '#lh2e',
        [110, 150], [100, 138], ['tk', -1], [70, 122], [40, 114], [10, 108],
      ],
    }],
    rotulos: [
      { txt: 'firme', cabo: 0, em: 1, dx: 8, dy: -14, ancora: 'start', etapas: [0, 1, 2, 3, 4] },
      { txt: 'chicote', cabo: 0, em: 'ponta', dx: 0, dy: 28, ancora: 'start', etapas: [4, 5] },
    ],
    etapas: [
      { ate: ['#r1'], txt: 'O <b>firme</b> chega pela esquerda (da carga). O cunho está visto de cima: a barra com um chifre em cada ponta.' },
      { ate: ['#lh1e'], txt: '<b>Volta no pé:</b> leve o cabo por baixo do chifre mais distante (o da direita), dê a volta na base do cunho e passe por baixo do outro chifre.' },
      { ate: ['#rh2e'], txt: '<b>Primeira diagonal do X:</b> cruze <b>por cima</b> do cunho até o chifre da direita e passe por baixo dele.' },
      { ate: ['#lh2e'], txt: '<b>Segunda diagonal:</b> cruze de novo <b>por cima</b> do cunho, formando um X, e passe por baixo do chifre da esquerda.' },
      { ate: ['fim'], txt: '<b>Volta de trava:</b> passe o chicote <b>por baixo</b> do cabo que sobe do chifre da esquerda. Ele fica preso pelo próprio cabo.' },
      { ate: ['fim'], final: true, txt: 'Aperte puxando o firme. Confira: uma volta no pé, o X por cima do cunho e o chicote preso por baixo do cabo. Esta é a volta de trava (inverted half hitch).' },
    ],
  });

  /* ---------- Resolução dos dados ---------- */
  function resolver(no) {
    if (no._ok) return;
    no.cabos.forEach(function (cb) {
      var pts = [], marcas = {};
      cb.pts.forEach(function (p) {
        if (typeof p === 'string') { marcas[p.slice(1)] = pts.length; return; }
        if (typeof p[0] === 'string') {
          var q = no.X[p[0]];
          if (!q) throw new Error('nos: cruzamento "' + p[0] + '" não definido em ' + no.id);
          pts.push([q[0], q[1], p[1]]);
        } else pts.push([p[0], p[1], p[2] || 0]);
      });
      cb.r = pts; cb.marcas = marcas;
    });
    no._ok = true;
  }
  function indiceDe(no, ci, v) {
    if (v === 'fim' || v == null) return 'fim';
    if (typeof v === 'number') return v;
    var m = /^#([\w-]+)(?:\+([\d.]+))?$/.exec(v);
    if (!m) return 'fim';
    var i = no.cabos[ci].marcas[m[1]];
    if (i == null) throw new Error('nos: marca "' + v + '" não existe em ' + no.id);
    return i + (m[2] ? parseFloat(m[2]) : 0);
  }

  /** amostra cabos e objetos e calcula cruzamentos (uma vez por nó) */
  function prepararForma(no) {
    if (no._pronta) return no._pronta;
    resolver(no);
    var cabos = [];
    (no.objetos || []).forEach(function (o) {
      if (!o.cruza) return;
      var c = amostrar(o.pts.map(function (p) { return [p[0], p[1], 0]; }), 3, o.w);
      c.prop = true; c.obj = o;
      cabos.push(c);
    });
    var nProps = cabos.length;
    no.cabos.forEach(function (cb, i) {
      var c = amostrar(cb.r, 2.4, cb.w || no.w || 14);
      c.cor = cb.cor || 'a'; c.indice = i; c.def = cb;
      cabos.push(c);
    });
    var X = cruzamentos(cabos);
    X.forEach(function (x) {
      var wU = cabos[x.u].w, sen = Math.max(x.sen, 0.26), cos = Math.sqrt(1 - sen * sen), wO = cabos[x.o].w;
      // meio-comprimento do trecho redesenhado por cima: cobre a faixa inteira do cabo de baixo, inclusive os
      // cantos quando o cruzamento é oblíquo (a borda do de baixo corta a borda do de cima mais adiante)
      x.dO = ((wU / 2 + CONT) + (wO / 2 + CONT) * cos) / sen + 2.5;
      x.dU = ((wO / 2 + CONT) + (wU / 2 + CONT) * cos) / sen + 1;   // quanto o de baixo precisa avançar para "entrar"
      x.dSh1 = (wO / 2 + CONT + 1.8) / sen;                 // sombra sobre o de baixo (duas camadas, suaves)
      x.dSh2 = (wO / 2 + CONT + 4.2) / sen;
    });
    var cordas = cabos.filter(function (c) { return !c.prop; });
    // revelação (s) de cada etapa, por cabo
    var revs = no.etapas.map(function (et) {
      return cordas.map(function (c, ci) { var v = et.ate[ci]; return v === 0 ? 0 : sDoIndice(c, indiceDe(no, ci, v)); });
    });
    no._pronta = { cabos: cabos, cordas: cordas, nProps: nProps, X: X, revs: revs };
    return no._pronta;
  }

  /** Sequência de passagens (por cima / por baixo) da etapa k: o que o cabo que se move faz em cada cruzamento. */
  function sequencia(no, k) {
    var P = prepararForma(no), R0 = k > 0 ? P.revs[k - 1] : P.cordas.map(function () { return 0; }), R1 = P.revs[k];
    var np = P.nProps, out = [];
    function revIni(ci) { return ci < np ? Infinity : R0[ci - np]; }
    function revFim(ci) { return ci < np ? Infinity : R1[ci - np]; }
    function tempo(ci, s) { var a = R0[ci - np], b = R1[ci - np]; return b - a > 0.5 ? (s - a) / (b - a) : -1; }
    P.X.forEach(function (x) {
      var lados = [{ c: x.o, s: x.so, cima: true }, { c: x.u, s: x.su, cima: false }];
      var vis = lados.every(function (l) { return l.s <= revFim(l.c) + 0.01; });
      if (!vis) return;
      var ativo = no.etapas[k].ativo;
      var mov = lados.filter(function (l) { return l.c >= np && l.s > revIni(l.c) + 0.01 && (!ativo || ativo.indexOf(l.c - np) >= 0); });
      if (!mov.length) return;
      // quem passa por último é quem "faz" a passagem nesta etapa
      var ult = mov.length === 1 ? mov[0] : (tempo(mov[0].c, mov[0].s) >= tempo(mov[1].c, mov[1].s) ? mov[0] : mov[1]);
      var outro = ult === lados[0] ? lados[1] : lados[0];
      out.push({ x: x, cabo: ult.c, s: ult.s, t: tempo(ult.c, ult.s), cima: ult.cima, sobreObjeto: outro.c < np, objeto: outro.c < np ? P.cabos[outro.c].obj : null });
    });
    out.sort(function (a, b) { return a.t - b.t; });
    return out;
  }

  /* ================================================================== */
  /* Desenho                                                             */
  /* ================================================================== */
  function camadaCabo(g, c) {
    var el = {
      sombra: svg('path', { class: 'nos-sombra', 'stroke-width': c.w + 2 * CONT + 3, transform: 'translate(1.6 2.6)' }),
      contorno: svg('path', { class: 'nos-contorno', 'stroke-width': c.w + 2 * CONT }),
      corpo: svg('path', { class: 'nos-corpo nos-cor-' + c.cor, 'stroke-width': c.w }),
      brilho: svg('path', { class: 'nos-brilho nos-brilho-' + c.cor, 'stroke-width': Math.max(2, c.w * 0.28) }),
    };
    var gg = svg('g', null, el.sombra, el.contorno, el.corpo, el.brilho);
    g.appendChild(gg);
    el.g = gg;
    return el;
  }
  function camadaObjeto(g, c) {
    var o = c.obj, el = {};
    el.sombra = svg('path', { class: 'nos-sombra', 'stroke-width': o.w + 2 * CONT + 4, transform: 'translate(2 3.5)' });
    el.contorno = svg('path', { class: 'nos-obj-contorno nos-obj-' + o.tipo, 'stroke-width': o.w + 2 * CONT });
    el.corpo = svg('path', { class: 'nos-obj-corpo nos-obj-' + o.tipo, 'stroke-width': o.w });
    el.brilho = svg('path', { class: 'nos-obj-brilho nos-obj-' + o.tipo, 'stroke-width': Math.max(2, o.w * 0.18) });
    var gg = svg('g', null, el.sombra, el.contorno, el.corpo, el.brilho);
    g.appendChild(gg);
    el.g = gg;
    return el;
  }
  /** decoração fixa dos objetos (por baixo de tudo): base do cunho, parafusos, convés */
  function desenharDecor(no, g) {
    (no.decor || []).forEach(function (d) {
      if (d.tipo === 'retangulo') g.appendChild(svg('rect', { x: d.x, y: d.y, width: d.w, height: d.h, rx: d.rx || 0, class: 'nos-decor nos-decor-' + (d.classe || 'base') }));
      else if (d.tipo === 'circulo') g.appendChild(svg('circle', { cx: d.x, cy: d.y, r: d.r, class: 'nos-decor nos-decor-' + (d.classe || 'base') }));
      else if (d.tipo === 'caminho') g.appendChild(svg('path', { d: d.d, class: 'nos-decor nos-decor-' + (d.classe || 'base') }));
    });
  }

  /** Cria o desenhador de um nó: devolve {g, P, desenhar(R[], extra)} */
  function criarDesenho(no) {
    var P = prepararForma(no), cabos = P.cabos;
    var g = svg('g', { class: 'nos-forma' });
    var gFundo = svg('g', { class: 'nos-fundo' }), gObj = svg('g', { class: 'nos-objs' }), gHalo = svg('g', { class: 'nos-halo' });
    var gBase = svg('g', { class: 'nos-base' }), gPecas = svg('g', { class: 'nos-pecas' });
    var gRota = svg('g', { class: 'nos-rota' }), gMarc = svg('g', { class: 'nos-marcas' }), gRot = svg('g', { class: 'nos-rotulos' });
    [gFundo, gObj, gHalo, gBase, gPecas, gRota, gMarc, gRot].forEach(function (x) { g.appendChild(x); });
    desenharDecor(no, gFundo);
    var camadas = cabos.map(function (c) { return c.prop ? camadaObjeto(gObj, c) : camadaCabo(gBase, c); });
    cabos.forEach(function (c, i) {
      if (!c.prop) return;
      var d = trecho(c, 0, c.L), L = camadas[i];
      L.sombra.setAttribute('d', d); L.contorno.setAttribute('d', d); L.corpo.setAttribute('d', d);
      L.brilho.setAttribute('d', trecho(c, 0, c.L, true));
    });
    var halos = cabos.map(function (c) { if (c.prop) return null; var p = svg('path', { class: 'nos-halo-trilha', 'stroke-width': c.w + 10 }); gHalo.appendChild(p); return p; });
    var rotas = cabos.map(function (c) { if (c.prop) return null; var p = svg('path', { class: 'nos-rota-linha' }); gRota.appendChild(p); return p; });
    var setas = cabos.map(function (c) { if (c.prop) return null; var p = svg('path', { class: 'nos-rota-seta' }); gRota.appendChild(p); return p; });
    var pool = [];
    function peca(i) {
      while (pool.length <= i) {
        var el = {
          sombra2: svg('path', { class: 'nos-sombra-local nos-sombra-2' }),
          sombra1: svg('path', { class: 'nos-sombra-local nos-sombra-1' }),
          contorno: svg('path', { class: 'nos-contorno' }),
          corpo: svg('path', { class: 'nos-corpo' }),
          brilho: svg('path', { class: 'nos-brilho' }),
          f1: svg('path', { class: 'nos-falcaca' }),
        };
        el.g = svg('g', null, el.sombra2, el.sombra1, el.contorno, el.corpo, el.brilho, el.f1);
        gPecas.appendChild(el.g);
        pool.push(el);
      }
      return pool[i];
    }
    var EXT = 0.9; // corpo e brilho passam um pouco do contorno, para não aparecer emenda
    var np = P.nProps;

    /** rev: comprimento revelado por corda; extra: {trilha: [[s0,s1]|null], rota: [[s0,s1]|null]} */
    function desenhar(rev, extra) {
      extra = extra || {};
      var R = cabos.map(function (c, i) { return c.prop ? c.L : clamp(rev[i - np] == null ? c.L : rev[i - np], 0, c.L); });
      cabos.forEach(function (c, i) {
        if (c.prop) return;
        var L = camadas[i], d = R[i] > 0.5 ? trecho(c, 0, R[i]) : '';
        L.sombra.setAttribute('d', d); L.contorno.setAttribute('d', d); L.corpo.setAttribute('d', d);
        L.brilho.setAttribute('d', R[i] > 0.5 ? trecho(c, 0, R[i], true) : '');
        var tr = extra.trilha && extra.trilha[i - np];
        halos[i].setAttribute('d', tr && Math.min(tr[1], R[i]) - tr[0] > 1 ? trecho(c, tr[0], Math.min(tr[1], R[i])) : '');
        // rota tracejada à frente da ponta, com falhas onde o cabo vai passar por baixo de algo já visível
        var ro = extra.rota && extra.rota[i - np], dr = '', ds = '';
        if (ro && ro[1] - ro[0] > 2) {
          var gaps = [];
          P.X.forEach(function (x) {
            if (x.u === i && x.su > ro[0] && x.su < ro[1] && (x.o < np || x.so <= R[x.o] || (x.o === i && x.so < x.su))) gaps.push([x.su - x.dO, x.su + x.dO]);
          });
          gaps.sort(function (a, b) { return a[0] - b[0]; });
          var s = ro[0];
          gaps.forEach(function (gp) { if (gp[0] > s) dr += trecho(c, s, gp[0]); s = Math.max(s, gp[1]); });
          if (ro[1] > s) dr += trecho(c, s, ro[1] - 4);
          var pf = ponto(c, ro[1]), pa = ponto(c, Math.max(0, ro[1] - 6)), ang = Math.atan2(pf.y - pa.y, pf.x - pa.x), tam = 9;
          ds = 'M' + f1(pf.x + Math.cos(ang) * 3) + ' ' + f1(pf.y + Math.sin(ang) * 3) +
            'L' + f1(pf.x - Math.cos(ang - 0.5) * tam) + ' ' + f1(pf.y - Math.sin(ang - 0.5) * tam) +
            'L' + f1(pf.x - Math.cos(ang + 0.5) * tam) + ' ' + f1(pf.y - Math.sin(ang + 0.5) * tam) + 'Z';
        }
        rotas[i].setAttribute('d', dr); setas[i].setAttribute('d', ds);
      });
      // peças por cima (cruzamentos ativos) + pontas, em ordem de altura (z)
      var lista = [];
      P.X.forEach(function (x) {
        if (R[x.o] < x.so - x.dO || R[x.u] < x.su - x.dU) return;
        lista.push({ c: x.o, s0: Math.max(0, x.so - x.dO), s1: Math.min(x.so + x.dO, R[x.o]), z: x.zo, x: x });
      });
      cabos.forEach(function (c, i) {
        if (c.prop || R[i] < 1) return;
        lista.push({ c: i, s0: Math.max(0, R[i] - c.w * 1.1), s1: R[i], z: ponto(c, R[i]).z + 0.001, ponta: true });
      });
      lista.sort(function (a, b) { return a.z - b.z; });
      lista.forEach(function (it, k) {
        var el = peca(k), c = cabos[it.c], d = trecho(c, it.s0, it.s1);
        var e0 = it.s0 > 0 ? EXT : 0, e1 = it.s1 < R[it.c] - 0.01 ? EXT : 0;
        var dc = trecho(c, it.s0 - e0, it.s1 + e1);
        el.g.style.display = '';
        if (it.x) {
          var cu = cabos[it.x.u], Ru = R[it.x.u];
          el.sombra1.setAttribute('d', trecho(cu, it.x.su - it.x.dSh1, Math.min(Ru, it.x.su + it.x.dSh1)));
          el.sombra2.setAttribute('d', trecho(cu, it.x.su - it.x.dSh2, Math.min(Ru, it.x.su + it.x.dSh2)));
          el.sombra1.setAttribute('stroke-width', Math.max(1, cu.w - 0.6));
          el.sombra2.setAttribute('stroke-width', Math.max(1, cu.w - 0.6));
        } else { el.sombra1.setAttribute('d', ''); el.sombra2.setAttribute('d', ''); }
        if (c.prop) {
          el.contorno.setAttribute('class', 'nos-obj-contorno nos-obj-' + c.obj.tipo);
          el.corpo.setAttribute('class', 'nos-obj-corpo nos-obj-' + c.obj.tipo);
          el.brilho.setAttribute('class', 'nos-obj-brilho nos-obj-' + c.obj.tipo);
          el.contorno.setAttribute('stroke-width', c.w + 2 * CONT); el.corpo.setAttribute('stroke-width', c.w);
          el.brilho.setAttribute('stroke-width', Math.max(2, c.w * 0.18));
          el.contorno.setAttribute('d', d); el.corpo.setAttribute('d', dc);
          el.brilho.setAttribute('d', trecho(c, it.s0 - e0, it.s1 + e1, true));
          el.f1.setAttribute('d', '');
          return;
        }
        el.contorno.setAttribute('class', 'nos-contorno' + (it.ponta ? ' nos-redondo' : ''));
        el.corpo.setAttribute('class', 'nos-corpo nos-cor-' + c.cor + (it.ponta ? ' nos-redondo' : ''));
        el.brilho.setAttribute('class', 'nos-brilho nos-brilho-' + c.cor + (it.ponta ? ' nos-redondo' : ''));
        el.contorno.setAttribute('stroke-width', c.w + 2 * CONT); el.corpo.setAttribute('stroke-width', c.w);
        el.brilho.setAttribute('stroke-width', Math.max(2, c.w * 0.28));
        // o brilho passa um pouco do corpo: esconde a emenda (antisserrilhado) no fim da peça
        var b0 = it.s0 > 0 ? it.s0 - EXT - 1.8 : 0, b1 = it.s1 < R[it.c] - 0.01 ? it.s1 + EXT + 1.8 : it.s1;
        el.contorno.setAttribute('d', d); el.corpo.setAttribute('d', dc); el.brilho.setAttribute('d', trecho(c, b0, b1, true));
        if (it.ponta && it.s1 - it.s0 > c.w * 0.9) {
          // falcaça (whipping) na ponta: duas voltas finas
          var pf = ponto(c, Math.max(0, it.s1 - c.w * 0.45)), pg = ponto(c, Math.max(0, it.s1 - c.w * 0.85));
          var r = c.w / 2 + 0.3, df = '';
          [pf, pg].forEach(function (q) { var nx = -Math.sin(q.a) * r, ny = Math.cos(q.a) * r; df += 'M' + f1(q.x + nx) + ' ' + f1(q.y + ny) + 'L' + f1(q.x - nx) + ' ' + f1(q.y - ny); });
          el.f1.setAttribute('d', df);
        } else el.f1.setAttribute('d', '');
      });
      for (var k = lista.length; k < pool.length; k++) pool[k].g.style.display = 'none';
      return R;
    }
    return { g: g, P: P, desenhar: desenhar, gMarc: gMarc, gRot: gRot, cabos: cabos };
  }

  /** escolhe onde pôr o número de um cruzamento: longe dos cabos e de outros números */
  function lugarMarca(P, x, ocupados, raio) {
    var melhor = null, mv = -1;
    for (var k = 0; k < 16; k++) {
      var ang = k * Math.PI / 8 + 0.2, px = x.x + Math.cos(ang) * raio, py = x.y + Math.sin(ang) * raio, md = 1e9;
      P.cabos.forEach(function (c) {
        for (var i = 0; i < c.X.length; i += 3) {
          var dd = Math.sqrt((c.X[i] - px) * (c.X[i] - px) + (c.Y[i] - py) * (c.Y[i] - py)) - c.w / 2;
          if (dd < md) md = dd;
        }
      });
      ocupados.forEach(function (o) { var dd = Math.sqrt((o[0] - px) * (o[0] - px) + (o[1] - py) * (o[1] - py)) - 22; if (dd < md) md = dd; });
      if (md > mv) { mv = md; melhor = [px, py]; }
    }
    return melhor;
  }

  /* ================================================================== */
  /* Desafio: qual nó usar para…?                                        */
  /* ================================================================== */
  var DESAFIOS = [
    { id: 'escota-proa', txt: 'Amarrar a escota no punho de uma vela de proa moderna (buja ou genoa), com uma alça fixa que não corre.', certo: 'lais-de-guia',
      exp: 'O lais de guia faz uma alça fixa que não corre nem aperta e desata fácil depois de muito esforço. Por isso é o nó clássico da escota no punho da vela de proa.' },
    { id: 'resgate', txt: 'Fazer na ponta de um cabo uma alça que não corre, para passar por baixo dos braços de quem caiu na água.', certo: 'lais-de-guia',
      exp: 'O lais de guia não corre: a alça não aperta o peito da pessoa quando você puxa. Uma alça que corre (um laço) apertaria o peito.' },
    { id: 'moitao', txt: 'Impedir que a ponta da escota escape pelo moitão (polia) ou pela buzina.', certo: 'oito',
      exp: 'O nó de oito é um nó de trava (batente): faz um volume na ponta, maior que o nó simples, e desata fácil.' },
    { id: 'defensa', txt: 'Prender rapidamente a defensa no guarda-mancebo ou num balaústre, de um jeito fácil de ajustar a altura.', certo: 'fiel', evitar: ['volta-redonda'],
      exp: 'A volta do fiel se faz e se ajusta em segundos e segura bem enquanto há carga. Como pode afrouxar com sacudidas, muita gente arremata com um cote.' },
    { id: 'argola', txt: 'Amarrar o cabo do barco numa argola ou num cabeço do cais, de um jeito que dê para soltar mesmo com o cabo esticado.', certo: 'volta-redonda', evitar: ['fiel', 'cunho'],
      exp: 'A volta redonda segura quase toda a força do cabo pelo atrito; os dois cotes só travam. Você consegue desfazer os cotes e controlar o cabo mesmo sob carga.' },
    { id: 'unir', txt: 'Emendar dois cabos de grossuras diferentes, por exemplo para aumentar um cabo de reboque.', certo: 'escota', evitar: ['escota-dobrado'],
      exp: 'O nó de escota (singelo) une dois cabos, mesmo de grossuras diferentes: o cabo grosso faz o seio e o fino dá a volta. O nó direito não serve para unir cabos com carga: pode virar e soltar.' },
    { id: 'unir-forte', txt: 'Emendar dois cabos de grossuras muito diferentes, ou escorregadios, com mais segurança.', certo: 'escota-dobrado', evitar: ['escota'],
      exp: 'O nó de escota dobrado dá uma volta a mais em volta do seio do cabo grosso. Segura melhor quando a diferença de grossura é grande ou o cabo é liso.' },
    { id: 'cunho', txt: 'Prender a adriça ou a escota num cunho, de um jeito seguro e rápido de soltar.', certo: 'cunho',
      exp: 'A volta de cunho (uma volta redonda na base, voltas em oito e uma volta trincada no fim) segura bem e solta em segundos.' },
    { id: 'rizar', txt: 'Rizar a vela: amarrar as fitas de rizar em volta da vela enrolada na retranca.', certo: 'direito', evitar: ['torto'],
      exp: 'O nó direito é um nó de amarrar em volta de algo: fica chato, aperta bem e solta puxando uma das pontas. Era usado justamente para rizar.' },
  ];

  /* ================================================================== */
  /* Montagem                                                            */
  /* ================================================================== */
  VL.widgets.define('nos', {
    css: ['assets/css/widgets/nos.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var porId = {};
      NOS.forEach(function (n) { porId[n.id] = n; });
      var lista = (opts.nos && opts.nos.length ? opts.nos.map(function (id) { return porId[id]; }).filter(Boolean) : NOS.filter(function (n) { return !n.oculto; }));
      if (!lista.length) lista = NOS.filter(function (n) { return !n.oculto; });
      var noAtual = porId[opts.no] || lista[0];
      var limpezas = [];
      var semMov = reduzMov();
      var mqRM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      function aoMudarRM() { semMov = reduzMov(); if (semMov) pausar(); atualizarControles(); }
      if (mqRM) { if (mqRM.addEventListener) mqRM.addEventListener('change', aoMudarRM); else if (mqRM.addListener) mqRM.addListener(aoMudarRM); }
      limpezas.push(function () { if (mqRM) { if (mqRM.removeEventListener) mqRM.removeEventListener('change', aoMudarRM); else if (mqRM.removeListener) mqRM.removeListener(aoMudarRM); } });

      var inst = VL.ui.instrumento({ titulo: opts.titulo || 'Nós e voltas, passo a passo' });
      inst.raiz.classList.add('nos-inst');
      el.appendChild(inst.raiz);
      var raiz = h('div', { class: 'nos' });
      inst.corpo.appendChild(raiz);
      inst.legenda.appendChild(h('span', { class: 'nos-legenda-fonte' },
        'Desenhos esquemáticos, com o nó frouxo para mostrar cada cruzamento. Números ABoK: The Ashley Book of Knots (C. W. Ashley, 1944), conferidos no ',
        h('a', { href: 'https://www.animatedknots.com/', target: '_blank', rel: 'noopener' }, 'Animated Knots'),
        ' e na caixa de informações do verbete de cada nó na Wikipédia. Um nó pode ter mais de um número no livro.'));

      /* ---------- abas ---------- */
      var comDesafio = opts.desafio !== false && lista.length >= 3;
      var modo = opts.modo === 'desafio' && comDesafio ? 'desafio' : 'aprender';
      var abas = null, btAprender, btDesafio;
      if (comDesafio) {
        btAprender = h('button', { type: 'button', 'aria-pressed': 'true', onclick: function () { trocarModo('aprender'); } }, 'Aprender');
        btDesafio = h('button', { type: 'button', 'aria-pressed': 'false', onclick: function () { trocarModo('desafio'); } }, 'Desafio: qual nó usar?');
        abas = h('div', { class: 'segmented nos-abas', role: 'group', 'aria-label': 'Modo' }, btAprender, btDesafio);
        raiz.appendChild(abas);
      }
      var vAprender = h('div', { class: 'nos-aprender' }), vDesafio = h('div', { class: 'nos-desafio', hidden: true });
      raiz.appendChild(vAprender); raiz.appendChild(vDesafio);

      /* ---------- miniaturas ---------- */
      function miniatura(no, classe) {
        var P = prepararForma(no), f = no.foco || no.vb;
        var s = svg('svg', { viewBox: f.join(' '), class: classe || 'nos-mini', 'aria-hidden': 'true', focusable: 'false' });
        var D = criarDesenho(no);
        s.appendChild(D.g);
        D.desenhar(P.cordas.map(function (c) { return c.L; }));
        return s;
      }

      /* ---------- galeria ---------- */
      var galeria = null, cartoes = {};
      if (opts.galeria !== false && lista.length > 1) {
        galeria = h('div', { class: 'nos-galeria', role: 'list', 'aria-label': 'Escolha um nó' });
        lista.forEach(function (no) {
          var b = h('button', { type: 'button', class: 'nos-cartao', 'aria-pressed': 'false', onclick: function () { abrir(no); } },
            miniatura(no), h('span', { class: 'nos-cartao-nome' }, no.nome));
          cartoes[no.id] = b;
          galeria.appendChild(h('div', { role: 'listitem', class: 'nos-cartao-item' }, b));
        });
        vAprender.appendChild(galeria);
      }

      /* ---------- palco ---------- */
      var svgPalco = svg('svg', { class: 'nos-palco-svg', role: 'img', preserveAspectRatio: 'xMidYMid meet' });
      var tituloSvg = svg('title', { id: uid('nos-t') });
      svgPalco.appendChild(tituloSvg);
      svgPalco.setAttribute('aria-labelledby', tituloSvg.id);
      var gPalco = svg('g');
      svgPalco.appendChild(gPalco);
      var figura = h('div', { class: 'nos-figura', tabindex: '0', 'aria-label': 'Desenho do nó. Setas do teclado: etapa anterior e próxima; espaço: tocar ou pausar.' }, svgPalco);
      var contador = h('p', { class: 'nos-contador', 'aria-hidden': 'true' });
      figura.appendChild(contador);

      var nomeEl = h('h3', { class: 'nos-nome' });
      var metaEl = h('p', { class: 'nos-meta' });
      var resumoEl = h('p', { class: 'nos-resumo' });
      var etapaTit = h('p', { class: 'nos-etapa-tit' });
      var etapaTxt = h('p', { class: 'nos-etapa-txt' });
      var etapaBox = h('div', { class: 'nos-etapa', 'aria-live': 'polite' }, etapaTit, etapaTxt);
      var seqEl = h('ol', { class: 'nos-seq', 'aria-label': 'Por cima e por baixo nesta etapa' });

      var btAnt = h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Etapa anterior', title: 'Etapa anterior', onclick: function () { irPara(etapa - 1, false); } }, VL.icon('esquerda', 20));
      var icPlay = VL.icon('play', 20), icPausa = VL.icon('pausa', 20);
      var btPlay = h('button', { type: 'button', class: 'btn btn-primary nos-play', onclick: function () { if (tocando) pausar(); else tocar(); } });
      var btProx = h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Próxima etapa', title: 'Próxima etapa', onclick: function () { irPara(etapa + 1, !semMov); } }, VL.icon('direita', 20));
      var btRep = h('button', { type: 'button', class: 'btn btn-ghost nos-repetir', title: 'Repetir esta etapa', onclick: function () { repetir(); } }, VL.icon('reiniciar', 18), h('span', null, 'Repetir'));
      var controles = h('div', { class: 'nos-controles' }, btAnt, btPlay, btProx, btRep);
      var pontos = h('div', { class: 'nos-pontos', role: 'group', 'aria-label': 'Ir para a etapa' });
      var vels = [{ v: 0.5, t: 'Lenta' }, { v: 1, t: 'Normal' }, { v: 1.8, t: 'Rápida' }], velocidade = 1;
      var segVel = h('div', { class: 'segmented nos-vel', role: 'group', 'aria-label': 'Velocidade da animação' });
      vels.forEach(function (o) {
        segVel.appendChild(h('button', { type: 'button', 'aria-pressed': String(o.v === 1), onclick: function () {
          velocidade = o.v; VL.$$('button', segVel).forEach(function (b, i) { b.setAttribute('aria-pressed', String(vels[i].v === velocidade)); });
        } }, o.t));
      });
      var velBox = h('div', { class: 'nos-vel-box' }, h('span', { class: 'nos-vel-rot' }, 'Velocidade'), segVel);
      var avisoRM = h('p', { class: 'nos-aviso-rm', hidden: true }, 'Animação desligada porque seu aparelho pede menos movimento. Use Anterior e Próxima: cada etapa mostra em magenta o caminho do chicote.');
      var extraEl = h('div', { class: 'nos-extra' });
      var infoEl = h('div', { class: 'nos-info' });

      var painel = h('div', { class: 'nos-painel' }, nomeEl, metaEl, resumoEl, etapaBox, seqEl, controles, pontos, velBox, avisoRM, extraEl);
      var palco = h('div', { class: 'nos-palco' }, figura, painel);
      vAprender.appendChild(palco);
      if (opts.info !== false) vAprender.appendChild(infoEl);

      /* ---------- estado da animação ---------- */
      var D = null, P = null, etapa = 0, tocando = false, raf = 0, anim = null, esperar = 0, visivel = true, ultimoT = 0;
      var R0 = [], R1 = [], Ragora = [];

      function revDe(k) { return k < 0 ? P.cordas.map(function () { return 0; }) : P.revs[k]; }

      function abrir(no, et) {
        pararLoop(); tocando = false;
        noAtual = no;
        Object.keys(cartoes).forEach(function (id) { cartoes[id].setAttribute('aria-pressed', String(id === no.id)); });
        while (gPalco.firstChild) gPalco.removeChild(gPalco.firstChild);
        svgPalco.setAttribute('viewBox', no.vb.join(' '));
        svgPalco.style.aspectRatio = no.vb[2] + ' / ' + no.vb[3];
        D = criarDesenho(no); P = D.P;
        gPalco.appendChild(D.g);
        if (opts.debug) desenharDebug(no);
        nomeEl.textContent = no.nome; if (no.en) nomeEl.appendChild(en(no.en));
        metaEl.textContent = no.tipo + (no.abok ? ' · ABoK nº ' + no.abok : '');
        resumoEl.textContent = no.resumo || '';
        pontos.innerHTML = '';
        no.etapas.forEach(function (e, i) {
          pontos.appendChild(h('button', { type: 'button', class: 'nos-ponto', 'aria-label': 'Etapa ' + (i + 1), title: 'Etapa ' + (i + 1), onclick: function () { irPara(i, false); } }, h('span', null, String(i + 1))));
        });
        montarInfo(no);
        montarExtra(no);
        etapa = clamp(et == null ? 0 : et, 0, no.etapas.length - 1);
        mostrarEtapa(etapa, false);
      }

      function mostrarEtapa(k, animar) {
        etapa = k;
        var et = noAtual.etapas[k];
        R0 = revDe(k - 1); R1 = revDe(k);
        etapaTit.textContent = 'Etapa ' + (k + 1) + ' de ' + noAtual.etapas.length;
        etapaTxt.innerHTML = et.txt;
        contador.textContent = (k + 1) + '/' + noAtual.etapas.length;
        tituloSvg.textContent = noAtual.nome + ', etapa ' + (k + 1) + ': ' + etapaTxt.textContent;
        VL.$$('.nos-ponto', pontos).forEach(function (b, i) { b.setAttribute('aria-current', i === k ? 'step' : 'false'); b.setAttribute('data-feita', i < k ? '1' : '0'); });
        montarSeq(k);
        if (animar && !semMov && !et.final) {
          anim = { t: 0, dur: duracao() };
          Ragora = R0.slice();
          desenharEm(0);
          iniciarLoop();
        } else {
          anim = null;
          Ragora = R1.slice();
          desenharEm(1);
        }
        atualizarControles();
      }

      function duracao() {
        var m = 0;
        for (var i = 0; i < R0.length; i++) m = Math.max(m, R1[i] - R0[i]);
        return clamp(m / 150, 0.7, 6);
      }

      var seqAtual = [];
      function montarSeq(k) {
        seqAtual = sequencia(noAtual, k);
        seqEl.innerHTML = '';
        seqEl.hidden = !seqAtual.length || noAtual.etapas[k].final;
        seqAtual.forEach(function (p, i) {
          var alvo = p.sobreObjeto ? (p.objeto.nome || 'o objeto') : (P.cordas.length > 1 && p.x.o !== p.x.u ? 'o outro cabo' : 'o cabo');
          seqEl.appendChild(h('li', { class: 'nos-seq-item', 'data-cima': p.cima ? '1' : '0' },
            h('span', { class: 'nos-seq-n', 'aria-hidden': 'true' }, String(i + 1)),
            h('span', null, (p.cima ? 'por cima' : 'por baixo') + ' ' + deArt(alvo))));
        });
        if (opts.debug) console.log('[nos] ' + noAtual.id + ' etapa ' + (k + 1) + ': ' + seqAtual.map(function (p) { return (p.cima ? 'cima' : 'baixo') + (p.sobreObjeto ? '(obj)' : ''); }).join(', '));
      }

      function desenharMarcas(R) {
        var g = D.gMarc;
        while (g.firstChild) g.removeChild(g.firstChild);
        if (noAtual.etapas[etapa].final) return;
        var ocup = [], kNum = tamanhoMinimo(12.5) / 12.5;
        seqAtual.forEach(function (p, i) {
          var ci = p.cabo - P.nProps;
          if (R[ci] < p.s - 1) return;
          var pos = lugarMarca(P, p.x, ocup, P.cabos[p.cabo].w / 2 + 15 * Math.max(1, kNum));
          ocup.push(pos);
          g.appendChild(svg('line', { x1: f1(p.x.x), y1: f1(p.x.y), x2: f1(pos[0]), y2: f1(pos[1]), class: 'nos-marca-guia' }));
          g.appendChild(svg('circle', { cx: f1(pos[0]), cy: f1(pos[1]), r: f1(10.5 * kNum), class: 'nos-marca' + (p.cima ? ' nos-marca-cima' : ' nos-marca-baixo') }));
          var t = svg('text', { x: f1(pos[0]), y: f1(pos[1] + 4.3 * kNum), class: 'nos-marca-n', 'text-anchor': 'middle' });
          t.textContent = String(i + 1);
          if (kNum > 1) t.style.fontSize = f1(12.5 * kNum) + 'px';
          g.appendChild(t);
          var it = seqEl.children[i];
          if (it) it.setAttribute('data-feito', '1');
        });
      }

      function desenharRotulos(R) {
        var g = D.gRot;
        while (g.firstChild) g.removeChild(g.firstChild);
        var fsRot = tamanhoMinimo(15);
        (noAtual.rotulos || []).forEach(function (r) {
          if (r.etapas && r.etapas.indexOf(etapa) < 0) return;
          var c = P.cordas[r.cabo], s;
          if (r.em === 'ponta') s = R[r.cabo];
          else s = sDoIndice(c, indiceDe(noAtual, r.cabo, r.em));
          if (s > R[r.cabo] + 0.5 || R[r.cabo] < 1) return;
          var q = ponto(c, s);
          var t = svg('text', { x: f1(q.x + r.dx), y: f1(q.y + r.dy), class: 'nos-rotulo', 'text-anchor': r.ancora || 'start' });
          t.textContent = r.txt;
          if (fsRot > 15) t.style.fontSize = fsRot + 'px';
          g.appendChild(t);
        });
      }
      /* tamanho (em unidades do viewBox) que rende pelo menos 12,5 px na tela, para o texto não ficar miúdo no celular */
      function tamanhoMinimo(base) {
        try {
          var vbw = parseFloat((svgPalco.getAttribute('viewBox') || '').split(/\s+/)[2]), w = svgPalco.getBoundingClientRect().width;
          if (vbw > 0 && w > 0) return Math.max(base, Math.round(12.6 / (w / vbw) * 10) / 10);
        } catch (e) { /* mantém o padrão */ }
        return base;
      }

      function desenharEm(p) {
        var R = [];
        for (var i = 0; i < R0.length; i++) R.push(R0[i] + (R1[i] - R0[i]) * p);
        Ragora = R;
        var et = noAtual.etapas[etapa];
        var trilha = et.final ? null : R.map(function (r, i) { return R1[i] - R0[i] > 1 ? [R0[i], r] : null; });
        var rota = et.final || p >= 1 ? null : R.map(function (r, i) { return R1[i] - r > 1 ? [r, R1[i]] : null; });
        D.desenhar(R, { trilha: trilha, rota: rota });
        VL.$$('.nos-seq-item', seqEl).forEach(function (li) { li.setAttribute('data-feito', '0'); });
        desenharMarcas(R);
        desenharRotulos(R);
      }

      /* ---------- loop ---------- */
      function iniciarLoop() { if (!raf && visivel) { ultimoT = 0; raf = requestAnimationFrame(passo); } }
      function pararLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
      function passo(ts) {
        raf = 0;
        if (!visivel) return;
        var dt = ultimoT ? Math.min(0.05, (ts - ultimoT) / 1000) : 0;
        ultimoT = ts;
        if (anim) {
          anim.t += dt * velocidade;
          var p = clamp(anim.t / anim.dur, 0, 1);
          desenharEm(suave(p));
          if (p >= 1) { anim = null; esperar = tocando ? 1.1 : 0; atualizarControles(); }
        } else if (tocando) {
          esperar -= dt * Math.max(0.6, velocidade);
          if (esperar <= 0) {
            if (etapa < noAtual.etapas.length - 1) mostrarEtapa(etapa + 1, true);
            else { tocando = false; atualizarControles(); }
          }
        }
        if (anim || tocando) raf = requestAnimationFrame(passo);
      }

      function tocar() {
        if (semMov) return;
        tocando = true;
        if (etapa >= noAtual.etapas.length - 1) mostrarEtapa(0, false);
        if (!anim) { esperar = 0.35; }
        atualizarControles();
        iniciarLoop();
      }
      function pausar() { tocando = false; atualizarControles(); if (!anim) pararLoop(); }
      function repetir() {
        if (semMov) { mostrarEtapa(etapa, false); return; }
        mostrarEtapa(etapa, true);
      }
      function irPara(k, animar) {
        if (k < 0 || k >= noAtual.etapas.length) return;
        tocando = false;
        pararLoop();
        mostrarEtapa(k, animar);
      }

      function atualizarControles() {
        var n = noAtual.etapas.length;
        btAnt.disabled = etapa <= 0;
        btProx.disabled = etapa >= n - 1;
        btPlay.innerHTML = '';
        if (tocando) { btPlay.appendChild(icPausa.cloneNode(true)); btPlay.appendChild(h('span', null, 'Pausar')); btPlay.setAttribute('aria-label', 'Pausar a animação'); }
        else { btPlay.appendChild(icPlay.cloneNode(true)); btPlay.appendChild(h('span', null, etapa >= n - 1 ? 'Ver de novo' : 'Tocar')); btPlay.setAttribute('aria-label', etapa >= n - 1 ? 'Ver a animação de novo, desde o início' : 'Tocar a animação a partir desta etapa'); }
        btPlay.hidden = semMov; btRep.hidden = semMov; velBox.hidden = semMov; avisoRM.hidden = !semMov;
      }

      /* ---------- teclado e visibilidade ---------- */
      figura.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); irPara(etapa + 1, !semMov); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(etapa - 1, false); }
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (tocando) pausar(); else tocar(); }
      });
      var io = null;
      if (window.IntersectionObserver) {
        io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en2) {
            visivel = en2.isIntersecting;
            if (visivel && (anim || tocando)) iniciarLoop();
            if (!visivel) pararLoop();
          });
        });
        io.observe(figura);
      }
      limpezas.push(function () { if (io) io.disconnect(); pararLoop(); });

      /* ---------- informações ---------- */
      function montarInfo(no) {
        infoEl.innerHTML = '';
        if (opts.info === false) return;
        var g1 = h('section', { class: 'nos-info-bloco' }, h('h4', null, 'Para que serve'), h('p', null, no.usos));
        var g2 = h('section', { class: 'nos-info-bloco' }, h('h4', null, 'Vantagens'), h('ul', null, no.vantagens.map(function (t) { return h('li', null, t); })));
        var g3 = h('section', { class: 'nos-info-bloco' }, h('h4', null, 'Cuidados'), h('ul', null, no.cuidados.map(function (t) { return h('li', null, t); })));
        infoEl.appendChild(h('div', { class: 'nos-info-grade' }, g1, g2, g3));
        if (no.memoria) infoEl.appendChild(VL.ui.callout('dica', 'Para lembrar', no.memoria));
      }
      function montarExtra(no) {
        extraEl.innerHTML = '';
        if (no.aviso) extraEl.appendChild(VL.ui.callout(no.aviso.tipo || 'seguranca', no.aviso.titulo, no.aviso.html));
        if (no.comparar && porId[no.comparar.id]) {
          extraEl.appendChild(h('button', { type: 'button', class: 'btn btn-ghost nos-comparar', onclick: function () { abrir(porId[no.comparar.id]); figura.focus(); } }, no.comparar.rotulo));
        }
      }

      /* ---------- depuração ---------- */
      function desenharDebug(no) {
        var g = svg('g', { class: 'nos-debug' });
        P.cordas.forEach(function (c) {
          c.def.r.forEach(function (p, i) {
            g.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 2.2, fill: 'red' }));
            var t = svg('text', { x: p[0] + 3, y: p[1] - 3, 'font-size': 8, fill: 'red' }); t.textContent = i + (p[2] ? '(' + f1(p[2]) + ')' : ''); g.appendChild(t);
          });
        });
        P.X.forEach(function (x) {
          var bad = x.dz < 0.5 || x.sen < 0.3;
          g.appendChild(svg('circle', { cx: x.x, cy: x.y, r: 5, fill: 'none', stroke: bad ? 'orange' : 'blue', 'stroke-width': bad ? 2.5 : 1.2 }));
        });
        gPalco.appendChild(g);
        console.log('[nos] ' + no.id + ': ' + P.X.length + ' cruzamentos; duvidosos: ' + P.X.filter(function (x) { return x.dz < 0.5 || x.sen < 0.3; }).map(function (x) { return Math.round(x.x) + ',' + Math.round(x.y) + ' dz=' + x.dz.toFixed(2) + ' sen=' + x.sen.toFixed(2); }).join(' | '));
      }

      /* ---------- desafio ---------- */
      var desafioPronto = false, filaD = [], posD = 0, acertos = 0, feitas = 0;
      function trocarModo(m) {
        modo = m;
        if (btAprender) { btAprender.setAttribute('aria-pressed', String(m === 'aprender')); btDesafio.setAttribute('aria-pressed', String(m === 'desafio')); }
        vAprender.hidden = m !== 'aprender'; vDesafio.hidden = m !== 'desafio';
        if (m === 'desafio') { pausar(); if (!desafioPronto) iniciarDesafio(); }
      }
      function iniciarDesafio() {
        desafioPronto = true;
        var ids = lista.map(function (n) { return n.id; });
        filaD = VL.embaralhar(DESAFIOS.filter(function (d) { return ids.indexOf(d.certo) >= 0; }));
        posD = 0; acertos = 0; feitas = 0;
        mostrarPergunta();
      }
      function mostrarPergunta() {
        vDesafio.innerHTML = '';
        if (!filaD.length) { vDesafio.appendChild(h('p', null, 'Não há perguntas para os nós escolhidos.')); return; }
        if (posD >= filaD.length) {
          vDesafio.appendChild(h('div', { class: 'nos-fim' },
            h('p', { class: 'nos-fim-tit' }, 'Você acertou ' + acertos + ' de ' + feitas + '.'),
            h('p', null, acertos === feitas ? 'Muito bem: você já sabe escolher o nó certo para cada serviço.' : 'Revise os nós que errou na aba Aprender e tente de novo.'),
            h('button', { type: 'button', class: 'btn btn-primary', onclick: iniciarDesafio }, 'Recomeçar')));
          return;
        }
        var d = filaD[posD];
        var certo = porId[d.certo];
        var outros = VL.embaralhar(lista.filter(function (n) { return n.id !== d.certo && (d.evitar || []).indexOf(n.id) < 0 && !n.oculto; })).slice(0, 3);
        var opcoes = VL.embaralhar([certo].concat(outros));
        var fb = h('div', { class: 'nos-feedback', 'aria-live': 'polite' });
        var grade = h('div', { class: 'nos-opcoes', role: 'group', 'aria-label': 'Escolha o nó' });
        var respondido = false;
        opcoes.forEach(function (no) {
          var b = h('button', { type: 'button', class: 'nos-opcao', onclick: function () {
            if (respondido) return;
            respondido = true; feitas += 1;
            var ok = no.id === d.certo;
            if (ok) acertos += 1;
            VL.$$('.nos-opcao', grade).forEach(function (bb) {
              bb.disabled = true;
              if (bb === b) bb.setAttribute('data-res', ok ? 'certa' : 'errada');
              if (bb.getAttribute('data-id') === d.certo) bb.setAttribute('data-res', 'certa');
            });
            fb.appendChild(h('p', { class: 'nos-fb-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo: ' + certo.nome + '.' : 'Não. O nó certo é: ' + certo.nome + '.'));
            fb.appendChild(h('p', null, d.exp));
            if (!ok && no.id !== d.certo) fb.appendChild(h('p', { class: 'nos-fb-errado' }, h('b', null, no.nome + ': '), no.resumo));
            fb.appendChild(h('div', { class: 'btn-row' },
              h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { posD += 1; mostrarPergunta(); } }, posD + 1 < filaD.length ? 'Próxima pergunta' : 'Ver resultado'),
              h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarModo('aprender'); abrir(certo); figura.focus(); } }, 'Ver como se faz o ' + certo.nome.toLowerCase())));
          } }, miniatura(no, 'nos-mini nos-opcao-mini'), h('span', { class: 'nos-opcao-nome' }, no.nome, no.en ? en(no.en) : null));
          b.setAttribute('data-id', no.id);
          grade.appendChild(b);
        });
        vDesafio.appendChild(h('p', { class: 'nos-d-cont' }, 'Pergunta ' + (posD + 1) + ' de ' + filaD.length + (feitas ? ' · acertos: ' + acertos : '')));
        vDesafio.appendChild(h('p', { class: 'nos-d-perg' }, h('span', { class: 'nos-d-q' }, 'Qual nó usar para… '), d.txt));
        vDesafio.appendChild(grade);
        vDesafio.appendChild(fb);
      }

      /* ---------- início ---------- */
      abrir(noAtual, opts.etapa);
      if (modo === 'desafio') trocarModo('desafio');
      if (opts.autoplay && !semMov && modo === 'aprender') tocar();

      return function () {
        limpezas.forEach(function (fn) { try { fn(); } catch (e) { /* ignora */ } });
        tocando = false; anim = null;
        el.innerHTML = '';
      };
    },
  });
  VL.nos = { NOS: NOS, prepararForma: prepararForma, sequencia: sequencia, resolver: resolver, cilV: cilV, cilH: cilH, volta: volta, projetar: projetar };
})();
