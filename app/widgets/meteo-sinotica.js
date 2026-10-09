/* meteo-sinotica — carta sinótica de superfície ESQUEMÁTICA e interativa (SVG + D3).

   O campo de pressão é um modelo simples (centros de alta e baixa somados, com cavados em V ao longo das frentes),
   desenhado com isóbaras a cada 4 hPa. Não é previsão: serve para aprender a LER uma carta. Ao tocar num ponto, o
   widget mostra a direção do vento à superfície, a força relativa (espaçamento das isóbaras), uma estimativa pelo
   vento geostrófico e, nos cenários com tempo, a tendência (pressão e rondada do vento nas próximas horas).

   Física usada (e mostrada na interface):
   - Vento geostrófico: paralelo às isóbaras, com Vg = Δp / (ρ · f · Δn), ρ ≈ 1,2 kg/m³, f = 2Ω sen(latitude).
     No Hemisfério Sul a força de Coriolis desvia o ar para a ESQUERDA: o vento gira no sentido HORÁRIO em volta da
     baixa e ANTI-HORÁRIO em volta da alta (o contrário do Hemisfério Norte).
   - Atrito à superfície: o vento cruza as isóbaras em direção à baixa, cerca de 15° sobre o mar e 30° ou mais sobre a
     terra, e fica mais fraco (regra prática: cerca de 70% do geostrófico sobre o mar).
   - Lei de Buys-Ballot adaptada ao Hemisfério Sul: de costas para o vento, a baixa fica à DIREITA (no Norte, à esquerda).
   - Perto do equador f → 0: a fórmula não vale e o ângulo com as isóbaras aumenta (aqui, de forma esquemática).
   - Ciclogênese explosiva ("ciclone bomba"): queda de 24 hPa em 24 h × sen(lat)/sen(60°) (Sanders e Gyakum, 1980).
   Simbologia: CHM, "Simbologia" (Manual de Códigos, OMM nº 306): A azul, B vermelho, frente fria (triângulos azuis),
   quente (semicírculos vermelhos), oclusa (roxa, alternados do mesmo lado), quase-estacionária (alternados em lados
   opostos), cavado (tracejado), crista (zigue-zague), ZCIT (faixa hachurada).
   Fontes oficiais (links): CHM/Marinha — Cartas Sinóticas, Simbologia, Meteoromarinha, Avisos de Mau Tempo.

   opts de mount (todos opcionais):
     cenario:   'esquematico' | 'frente' | 'asas' | 'alisios' | 'ciclone'    padrão 'frente'
     cenarios:  ['frente', 'asas']   restringe os cenários oferecidos
     hemisferio:'S' | 'N'            só no cenário esquemático (padrão 'S')
     hora:      0                    hora inicial nos cenários com tempo (0 a 48, de 3 em 3)
     ponto:     [-48.55, -27.6]      [lon, lat] do ponto inicial (padrão: depende do cenário)
     ventos:    true                 mostra o campo de setas de vento sobre o mar
     modo:      'explorar' | 'desafio'
     questoes:  6                    perguntas por rodada no desafio
     titulo:    texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'meteo-sinotica', opts:{cenario:'frente'}}
     {t:'widget', w:'meteo-sinotica', opts:{cenario:'esquematico', hemisferio:'N'}}
     {t:'widget', w:'meteo-sinotica', opts:{modo:'desafio', cenarios:['frente','ciclone']}} */
(function () {
  'use strict';
  var h = VL.h;
  var OMEGA = 7.2921e-5, RHO = 1.2, KN = 1.943844; // m/s → nós
  var KM_GRAU = 111.2;
  var seq = 0;
  function uid(p) { seq += 1; return (p || 'ms') + '-' + seq + '-' + Math.random().toString(36).slice(2, 6); }
  function svg(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
    return el;
  }
  function txt(x, y, s, cls, extra) { var t = svg('text', Object.assign({ x: x.toFixed(1), y: y.toFixed(1), class: cls }, extra || {})); t.textContent = s; return t; }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }
  function norm360(a) { return ((a % 360) + 360) % 360; }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  var ROSA16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  var ROSA8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var NOME8 = { N: 'norte', NE: 'nordeste', E: 'leste', SE: 'sudeste', S: 'sul', SW: 'sudoeste', W: 'oeste', NW: 'noroeste' };
  function rumo16(a) { return ROSA16[Math.round(norm360(a) / 22.5) % 16]; }
  function rumo8(a) { return ROSA8[Math.round(norm360(a) / 45) % 8]; }
  function difAng(a, b) { var d = norm360(a - b); return d > 180 ? d - 360 : d; }
  var BF = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64]; // limite inferior (nós) das forças 1 a 12
  function beaufort(kn) { var f = 0; for (var i = 0; i < BF.length; i++) if (kn >= BF[i] - 0.5) f = i + 1; return f; }
  function latTxt(lat) { var a = Math.abs(lat), g = Math.floor(a), m = Math.round((a - g) * 60); if (m === 60) { g++; m = 0; } return g + '°' + (m < 10 ? '0' : '') + m + "'" + (lat < 0 ? 'S' : 'N'); }
  function lonTxt(lon) { var a = Math.abs(lon), g = Math.floor(a), m = Math.round((a - g) * 60); if (m === 60) { g++; m = 0; } return g + '°' + (m < 10 ? '0' : '') + m + "'" + (lon < 0 ? 'W' : 'E'); }

  /* ======================================================================
     Cenários. Coordenadas [lon, lat] no Hemisfério Sul. Centros: amp em hPa acima (A) ou abaixo (B) da base, sig em km.
     Frentes: pts e vel (graus por hora, por vértice ou um só), dip = profundidade do cavado em V (hPa), mov = sentido do
     deslocamento (onde ficam os símbolos), quente = lado do ar quente (frente quase-estacionária).
     ====================================================================== */
  function lin(a, b) { return function (t) { return a + b * t; }; }
  var CIDADES = [
    ['Rio Grande', -52.1, -32.03], ['Porto Alegre', -51.2, -30.03], ['Florianópolis', -48.55, -27.6], ['Paranaguá', -48.5, -25.52],
    ['Santos', -46.33, -23.96], ['Rio de Janeiro', -43.2, -22.9], ['Vitória', -40.3, -20.3], ['Salvador', -38.5, -12.97],
    ['Recife', -34.9, -8.05], ['Natal', -35.2, -5.8], ['Fortaleza', -38.5, -3.72], ['São Luís', -44.3, -2.53], ['Belém', -48.5, -1.45],
    ['Montevidéu', -56.2, -34.9], ['Buenos Aires', -58.4, -34.6], ['Fernando de Noronha', -32.42, -3.85],
  ];
  var CENARIOS = {
    esquematico: {
      nome: 'Esquemático', titulo: 'Baixa com frentes e alta (esquemático)', ext: [-46, -62, 14, -22], terra: false, tempo: false, hemi: true,
      ponto: [-6, -38], aguas: [[-16, -57, 'Oceano (esquemático)']],
      resumo: 'Uma baixa com frente oclusa, quente e fria, o fim da frente fria parado (quase-estacionário) e duas altas. Sem continentes, para ver só a mecânica. Troque o hemisfério: o desenho vira o espelho norte-sul e o vento passa a girar ao contrário.',
      centros: [
        { tipo: 'B', lon: lin(-18, 0), lat: lin(-49, 0), amp: lin(-19, 0), sig: 520 },
        { tipo: 'A', lon: lin(-4, 0), lat: lin(-29, 0), amp: lin(12, 0), sig: 1300 },
        { tipo: 'A', lon: lin(-36, 0), lat: lin(-45, 0), amp: lin(9, 0), sig: 650 },
      ],
      frentes: [
        { tipo: 'oclusa', pts: [[-18, -48.6], [-16.2, -46.6], [-13, -45.2]], dip: 3, mov: [0.6, 0.3] },
        { tipo: 'quente', pts: [[-13, -45.2], [-7, -44.7], [-1, -43.2], [5, -41.2]], dip: 2.6, mov: [0.4, -1] },
        { tipo: 'fria', pts: [[-13, -45.2], [-15.5, -40.5], [-19.5, -35.5], [-24.5, -31.6]], dip: 3.6, mov: [1, 0.7] },
        { tipo: 'estacionaria', pts: [[-24.5, -31.6], [-30.5, -28.6], [-37, -27]], dip: 1.4, quente: [0.4, 1] },
      ],
    },
    frente: {
      nome: 'Frente fria no Sul/Sudeste', titulo: 'Passagem de frente fria no Sul e no Sudeste', ext: [-70, -45, -30, -15], terra: true, tempo: true,
      ponto: [-48.2, -27.8], aguas: [[-36, -36, 'Oceano Atlântico']],
      resumo: 'Uma baixa no mar com frente fria avançando para nordeste, e a alta pós-frontal vindo da Argentina. Antes da frente: vento de NE, depois N e NW, e a pressão cai. Na passagem: pancadas, trovoadas e rajadas, e o vento ronda rápido para SW. Depois: pressão subindo, ar mais frio e seco, e o vento vai para S e SE à medida que a alta avança para o mar.',
      centros: [
        { tipo: 'B', lon: lin(-44.6, 0.45), lat: lin(-41.6, -0.05), amp: function (t) { return -17 - 0.05 * t; }, sig: 650 },
        { tipo: 'B', lon: lin(-46, 0.42), lat: lin(-37, 0.02), amp: lin(-4, 0), sig: 1300, oculto: true },
        { tipo: 'A', lon: lin(-20, 0), lat: lin(-29, 0), amp: lin(11, 0), sig: 1500 },
        { tipo: 'A', lon: lin(-62.4, 0.3), lat: lin(-38.6, 0.12), amp: function (t) { return 8.5 + 0.06 * t; }, sig: 750 },
      ],
      frentes: [
        { tipo: 'fria', pts: [[-44, -40.5], [-46.5, -36.5], [-50, -32], [-54, -28.2], [-58.5, -25]], vel: [[0.45, -0.05], [0.4, 0.08], [0.33, 0.16], [0.31, 0.175], [0.28, 0.17]], dip: 7, w: 170, asim: [5, 0.5], mov: [1, 0.6] },
        { tipo: 'quente', pts: [[-44, -40.5], [-40, -39.8], [-35.5, -40.3], [-31, -41.5]], vel: [0.45, -0.06], dip: 2.2, w: 150, mov: [0.5, -1] },
      ],
    },
    asas: {
      nome: 'Alta Subtropical do Atlântico Sul', titulo: 'Alta Subtropical do Atlântico Sul (ASAS)', ext: [-62, -45, -5, 0], terra: true, tempo: false,
      ponto: [-41, -23.5], aguas: [[-26, -40, 'Oceano Atlântico Sul']],
      resumo: 'A ASAS é um centro de alta pressão quase permanente no Atlântico Sul, que se desloca um pouco ao longo do ano. Em volta dela o ar gira no sentido anti-horário: no litoral do Sudeste o vento chega de NE e E; no Nordeste, de E e SE (os alísios). Sob a alta o tempo é firme e o vento, mais fraco perto do centro.',
      centros: [
        { tipo: 'A', lon: lin(-17, 0), lat: lin(-28, 0), amp: lin(13, 0), sig: 1750 },
        { tipo: 'B', lon: lin(-62, 0), lat: lin(-24, 0), amp: lin(-7, 0), sig: 750 },
      ],
      frentes: [
        { tipo: 'crista', pts: [[-21, -27], [-30, -25.2], [-38.5, -23.2]], dip: -1.2 },
      ],
      faixas: [],
    },
    alisios: {
      nome: 'Alísios no Nordeste', titulo: 'Alísios e Zona de Convergência Intertropical', ext: [-55, -25, -12, 12], terra: true, tempo: false,
      ponto: [-33.5, -7.5], aguas: [[-24, -18, 'Oceano Atlântico']],
      resumo: 'Os alísios de SE sopram da Alta Subtropical do Atlântico Sul para a Zona de Convergência Intertropical (ZCIT), a faixa de baixa pressão, nuvens e pancadas perto do equador. Ao norte da ZCIT sopram os alísios de NE. Perto do equador a força de Coriolis é fraca: o vento cruza as isóbaras com ângulo grande e a regra de Buys-Ballot perde a validade.',
      centros: [
        { tipo: 'A', lon: lin(-15, 0), lat: lin(-27, 0), amp: lin(12, 0), sig: 1500 },
        { tipo: 'A', lon: lin(-34, 0), lat: lin(30, 0), amp: lin(10, 0), sig: 1500, fora: true },
      ],
      frentes: [],
      faixas: [{ tipo: 'zcit', lat: 6.5, amp: 4.5, larg: 4.5 }],
    },
    ciclone: {
      nome: 'Ciclone extratropical', titulo: 'Ciclone extratropical se aprofundando no litoral do Sul', ext: [-68, -48, -28, -20], terra: true, tempo: true, bomba: true,
      ponto: [-49.3, -30.6], aguas: [[-35, -44, 'Oceano Atlântico']],
      resumo: 'Uma baixa que se forma junto à costa do Rio Grande do Sul e do Uruguai e se aprofunda rápido enquanto vai para o mar. As isóbaras ficam muito juntas: vento forte de S e SW no litoral do Sul, mar grosso e ressaca. Quando a pressão no centro cai muito depressa, fala-se em ciclogênese explosiva ("ciclone bomba").',
      centros: [
        { tipo: 'B', lon: lin(-50.5, 0.3), lat: lin(-33, -0.06), amp: function (t) { return -5 - Math.min(24, Math.max(0, t)) * (20 / 24) - Math.max(0, t - 24) * 0.05; }, sig: 430 },
        { tipo: 'A', lon: lin(-22, 0), lat: lin(-29, 0), amp: lin(11, 0), sig: 1400 },
        { tipo: 'A', lon: lin(-66, 0.2), lat: lin(-42, 0.1), amp: function (t) { return 7 + 0.07 * t; }, sig: 700 },
      ],
      frentes: [
        { tipo: 'fria', pts: [[-49.7, -32.6], [-51.4, -29.6], [-54, -26.8], [-57.5, -24.2]], vel: [[0.3, -0.06], [0.29, 0.05], [0.25, 0.1], [0.2, 0.1]], dip: 3, w: 150, asim: [2.2, 0.6], mov: [1, 0.5] },
        { tipo: 'quente', pts: [[-49.7, -32.6], [-46, -32.1], [-42, -32.9]], vel: [[0.3, -0.06], [0.3, -0.07], [0.29, -0.08]], dip: 1.8, w: 150, mov: [0.5, -1] },
      ],
    },
  };
  var ORDEM = ['frente', 'asas', 'alisios', 'ciclone', 'esquematico'];
  var HORAS = { min: 0, max: 48, passo: 3, desloc: -12 }; // hora mostrada 0..48 = tempo do modelo −12..36 h

  /* ---------- Estado do modelo num instante ---------- */
  function estado(cen, tm, hem) {
    var sgn = hem === 'N' ? -1 : 1; // espelho norte-sul (só no esquemático)
    var E = { centros: [], frentes: [], faixas: [], latRef: (cen.ext[1] + cen.ext[3]) / 2 * sgn };
    cen.centros.forEach(function (c) {
      E.centros.push({ tipo: c.tipo, lon: c.lon(tm), lat: c.lat(tm) * sgn, amp: c.amp(tm), sig: c.sig, fora: c.fora, oculto: c.oculto });
    });
    cen.frentes.forEach(function (f) {
      var pts = f.pts.map(function (p, i) {
        var v = f.vel ? (Array.isArray(f.vel[0]) ? f.vel[i] : f.vel) : [0, 0];
        return [p[0] + v[0] * tm, (p[1] + v[1] * tm) * sgn];
      });
      E.frentes.push({ tipo: f.tipo, pts: pts, dip: f.dip || 0, w: f.w, taper: f.taper, c: f.c, asim: f.asim, mov: f.mov ? [f.mov[0], f.mov[1] * sgn] : null, quente: f.quente ? [f.quente[0], f.quente[1] * sgn] : null });
    });
    (cen.faixas || []).forEach(function (z) { E.faixas.push({ tipo: z.tipo, lat: z.lat * sgn, amp: z.amp, larg: z.larg }); });
    var cosR = Math.cos(rad(E.latRef));
    E.km = function (lon, lat) { return [lon * KM_GRAU * cosR, lat * KM_GRAU]; };
    E.frentes.forEach(function (f) {
      f.km = f.pts.map(function (p) { return E.km(p[0], p[1]); });
      var L = 0; f.cum = [0];
      for (var i = 1; i < f.km.length; i++) { L += Math.hypot(f.km[i][0] - f.km[i - 1][0], f.km[i][1] - f.km[i - 1][1]); f.cum.push(L); }
      f.L = L || 1;
      f.mvKm = f.mov ? [f.mov[0] * KM_GRAU * cosR, f.mov[1] * KM_GRAU] : null;
    });
    return E;
  }
  function base(lat) { var a = Math.abs(lat); return 1013 - 0.45 * Math.max(0, a - 38); }
  function distPoli(f, x, y) {
    var best = Infinity, sAt = 0, lado = 0;
    for (var i = 1; i < f.km.length; i++) {
      var ax = f.km[i - 1][0], ay = f.km[i - 1][1], bx = f.km[i][0], by = f.km[i][1];
      var dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
      var u = clamp(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1);
      var px = ax + u * dx, py = ay + u * dy, d = Math.hypot(x - px, y - py);
      if (d < best) {
        best = d; sAt = (f.cum[i - 1] + u * Math.sqrt(l2)) / f.L;
        // lado: positivo se o ponto está à frente da frente (no sentido em que ela anda)
        lado = f.mvKm ? (x - px) * f.mvKm[0] + (y - py) * f.mvKm[1] : 0;
      }
    }
    return [best, sAt, lado];
  }
  function pressao(E, lon, lat) {
    var p = base(lat), q = E.km(lon, lat);
    for (var i = 0; i < E.centros.length; i++) {
      var c = E.centros[i], k = E.km(c.lon, c.lat);
      // distância corrigida pela latitude média do par (o fator do E.km usa a latitude de referência)
      var dx = (q[0] - k[0]) * Math.cos(rad((lat + c.lat) / 2)) / Math.cos(rad(E.latRef)), dy = q[1] - k[1];
      p += c.amp * Math.exp(-(dx * dx + dy * dy) / (2 * c.sig * c.sig));
    }
    for (var j = 0; j < E.frentes.length; j++) {
      var f = E.frentes[j];
      if (!f.dip) continue;
      var ds = distPoli(f, q[0], q[1]);
      // cavado em V com o fundo arredondado (largura finita da zona frontal, f.c km)
      var cz = f.c || 60, de = Math.sqrt(ds[0] * ds[0] + cz * cz) - cz;
      // frente fria: a pressão cai devagar à frente dela (cavado pré-frontal largo) e sobe rápido atrás (f.asim = [à frente, atrás])
      var lw = (f.w || 120) * (f.asim ? (ds[2] > 0 ? f.asim[0] : f.asim[1]) : 1);
      p -= f.dip * (1 - (f.taper != null ? f.taper : 0.45) * ds[1]) * Math.exp(-de / lw);
    }
    for (var z = 0; z < E.faixas.length; z++) {
      var fx = E.faixas[z];
      p -= fx.amp * Math.exp(-Math.pow((lat - fx.lat) / fx.larg, 2));
    }
    return p;
  }
  /* Vento à superfície num ponto. sobreTerra muda o ângulo de atrito. */
  function vento(E, lon, lat, sobreTerra) {
    var d = 0.08;
    var mx = KM_GRAU * 1000 * Math.cos(rad(lat)), my = KM_GRAU * 1000;
    var gx = (pressao(E, lon + d, lat) - pressao(E, lon - d, lat)) * 100 / (2 * d * mx); // Pa/m
    var gy = (pressao(E, lon, lat + d) - pressao(E, lon, lat - d)) * 100 / (2 * d * my);
    var g = Math.hypot(gx, gy) || 1e-12;
    var n = [-gx / g, -gy / g]; // para a baixa (leste, norte)
    var aLat = Math.abs(lat);
    var alfaBase = sobreTerra ? 30 : 15;
    var alfa = alfaBase + (90 - alfaBase) * Math.pow(Math.max(0, 1 - aLat / 20), 2);
    var s = lat < 0 ? 1 : -1; // Sul: gira n no sentido anti-horário; Norte: horário
    var ang = s * rad(90 - alfa);
    var v = [n[0] * Math.cos(ang) - n[1] * Math.sin(ang), n[0] * Math.sin(ang) + n[1] * Math.cos(ang)];
    var angG = s * rad(90);
    var vg = [n[0] * Math.cos(angG) - n[1] * Math.sin(angG), n[0] * Math.sin(angG) + n[1] * Math.cos(angG)];
    var f = 2 * OMEGA * Math.sin(rad(aLat));
    var vgMs = aLat >= 15 ? g / (RHO * f) : null;
    var para = norm360(deg(Math.atan2(v[0], v[1])));
    return {
      p: pressao(E, lon, lat), v: v, vg: vg, n: n, alfa: alfa, para: para, de: norm360(para + 180),
      espKm: 400 / g / 1000, // distância entre isóbaras de 4 hPa (km)
      vgKn: vgMs != null ? vgMs * KN : null, vsKn: vgMs != null && !sobreTerra ? vgMs * KN * 0.7 : null,
      grad: g, terra: !!sobreTerra, lat: lat,
    };
  }

  /* ---------- Geometria de desenho ---------- */
  function catmull(pts, passo) {
    if (pts.length < 2) return pts.slice();
    var out = [], n = pts.length;
    function P(i) { return pts[clamp(i, 0, n - 1)]; }
    for (var i = 0; i < n - 1; i++) {
      var p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      var seg = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), m = Math.max(2, Math.ceil(seg / (passo || 4)));
      for (var k = 0; k < m; k++) {
        var t = k / m, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(pts[n - 1]);
    return out;
  }
  function caminho(pts, fechar) {
    if (!pts.length) return '';
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) d += 'L' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
    return d + (fechar ? 'Z' : '');
  }
  function acumulado(pts) { var c = [0]; for (var i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; }
  function noPonto(pts, cum, s) {
    var i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
    var a = pts[i - 1], b = pts[i], l = (cum[i] - cum[i - 1]) || 1, u = (s - cum[i - 1]) / l;
    var tx = (b[0] - a[0]) / l, ty = (b[1] - a[1]) / l;
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, tx: tx, ty: ty };
  }

  VL.widgets.define('meteo-sinotica', {
    css: ['assets/css/widgets/meteo-sinotica.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var lista = (Array.isArray(opts.cenarios) ? opts.cenarios : ORDEM).filter(function (c) { return CENARIOS[c]; });
      if (!lista.length) lista = ORDEM.slice();
      var est = {
        cen: CENARIOS[opts.cenario] && lista.indexOf(opts.cenario) >= 0 ? opts.cenario : lista[0],
        hem: opts.hemisferio === 'N' ? 'N' : 'S',
        hora: clamp(Math.round((Number(opts.hora) || 0) / 3) * 3, HORAS.min, HORAS.max),
        ventos: opts.ventos !== false,
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        ponto: null, W: 0, tocando: null, vivo: true,
      };
      var d3 = null, proj = null, E = null, terra = null;
      var limpezas = [];

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Carta sinótica de superfície (esquemática)', controlesAntes: true });
      ins.raiz.classList.add('ms-raiz');
      el.appendChild(ins.raiz);
      var carregando = h('p', { class: 'ms-carregando', role: 'status' }, 'Carregando a carta…');
      ins.corpo.appendChild(carregando);

      /* ---------- Controles ---------- */
      var segModo = h('div', { class: 'segmented ms-modo', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (m) { segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1])); });
      var selCen = h('select', { class: 'ms-sel', 'aria-label': 'Cenário' });
      lista.forEach(function (id) { selCen.appendChild(h('option', { value: id }, CENARIOS[id].nome)); });
      selCen.value = est.cen;
      selCen.addEventListener('change', function () { trocarCenario(selCen.value); });
      var segHem = h('div', { class: 'segmented ms-hem', role: 'group', 'aria-label': 'Hemisfério' });
      [['S', 'Hemisfério Sul'], ['N', 'Hemisfério Norte']].forEach(function (m) { segHem.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { if (est.hem === m[0]) return; est.hem = m[0]; if (est.ponto) est.ponto = [est.ponto[0], -est.ponto[1]]; recalcular(); } }, m[1])); });
      var notaHem = h('span', { class: 'ms-nota-hem' }, 'Cenário real do Hemisfério Sul');
      var swVentos = h('input', { type: 'checkbox', role: 'switch' }); swVentos.checked = est.ventos;
      swVentos.addEventListener('change', function () { est.ventos = swVentos.checked; desenhar(); });
      ins.controles.appendChild(h('div', { class: 'ms-ctl' },
        segModo,
        h('label', { class: 'ms-campo' }, h('span', { class: 'ms-rot' }, 'Cenário'), selCen),
        segHem, notaHem,
        h('label', { class: 'switch ms-sw' }, swVentos, h('span', null, 'Setas de vento'))));

      /* ---------- Estrutura ---------- */
      var mapaCx = h('div', { class: 'ms-mapa-cx' });
      var painel = h('div', { class: 'ms-painel', 'aria-live': 'polite' });
      var tempoCx = h('div', { class: 'ms-tempo' });
      var legenda = h('div', { class: 'ms-legenda' });
      var resumoCen = h('p', { class: 'ms-resumo' });
      var cidadesCx = h('div', { class: 'ms-cidades' });
      var desCx = h('div', { class: 'ms-desafio' });
      var porque = h('details', { class: 'ms-porque' }, h('summary', null, 'Por que o vento gira assim?'), h('div', { class: 'ms-porque-corpo' }));
      var fontes = h('div', { class: 'ms-fontes' },
        h('p', { class: 'ms-fontes-t' }, 'Cartas e boletins oficiais (Marinha do Brasil, Centro de Hidrografia da Marinha):'),
        h('ul', null,
          h('li', null, h('a', { href: 'https://www.marinha.mil.br/chm/cartassinoticas', target: '_blank', rel: 'noopener' }, 'Cartas sinóticas'), ' — análises de superfície publicadas pelo Serviço Meteorológico Marinho'),
          h('li', null, h('a', { href: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_simbologia_0.pdf', target: '_blank', rel: 'noopener' }, 'Simbologia da carta sinótica'), ' (PDF, base: OMM nº 306)'),
          h('li', null, h('a', { href: 'https://www.marinha.mil.br/chm/dados-do-smm-meteoromarinha/previsao-24-horas', target: '_blank', rel: 'noopener' }, 'Meteoromarinha'), ' — previsão por área (ALFA a HOTEL e áreas oceânicas)'),
          h('li', null, h('a', { href: 'https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo', target: '_blank', rel: 'noopener' }, 'Avisos de mau tempo')))) ;
      var vExp = h('div', { class: 'ms-exp' },
        h('div', { class: 'ms-cols' }, h('div', { class: 'ms-col-mapa' }, mapaCx, tempoCx, cidadesCx), h('div', { class: 'ms-col-info' }, resumoCen, painel, porque)),
        legenda, fontes);
      ins.corpo.appendChild(h('div', { class: 'ms-corpo' }, vExp, desCx));
      ins.legenda.appendChild(h('span', null, 'Modelo esquemático para estudo, não é previsão. Simbologia: CHM / OMM nº 306. Vento à superfície: cerca de 15° de cruzamento das isóbaras sobre o mar e 30° sobre a terra (regra prática).'));

      VL.$('.ms-porque-corpo', porque).appendChild(h('div', null,
        h('p', null, 'A Terra gira por baixo do ar. Para quem está nela, todo vento é desviado: para a ', h('strong', null, 'esquerda no Hemisfério Sul'), ' e para a direita no Norte (força de Coriolis).'),
        h('p', null, 'O ar corre da alta para a baixa, mas é desviado no caminho. No Sul, quem entra na baixa vira para a esquerda e o conjunto gira no ', h('strong', null, 'sentido horário em volta da baixa'), ' e anti-horário em volta da alta. No Norte, é o contrário.'),
        h('p', null, 'Longe do chão, o vento corre quase paralelo às isóbaras (vento geostrófico). Perto da superfície, o atrito freia o ar e ele cruza as isóbaras em direção à baixa: cerca de 15° sobre o mar, 30° ou mais sobre a terra.'),
        h('p', null, h('strong', null, 'Lei de Buys-Ballot no Hemisfério Sul: '), 'de costas para o vento, a baixa pressão fica à sua direita, um pouco à frente. No Norte, à esquerda.'),
        h('p', { class: 'mb-0' }, h('strong', null, 'Isóbaras juntas = vento forte. '), 'Pela fórmula do vento geostrófico, Vg = Δp ÷ (ρ · f · Δn): metade da distância entre as isóbaras, o dobro do vento. Na mesma distância, perto do equador o vento é maior (f menor) e, a menos de uns 15° de latitude, a fórmula deixa de valer.')));

      /* ---------- Carregar libs e dados ---------- */
      Promise.all([VL.libs.d3(), VL.load('data/geo/world_land_110m.js')]).then(function (r) {
        if (!est.vivo) return;
        d3 = r[0]; terra = VL.geo && VL.geo.land110m;
        carregando.remove();
        trocarCenario(est.cen, true);
        if (opts.ponto && opts.ponto.length === 2) { est.ponto = [Number(opts.ponto[0]), Number(opts.ponto[1])]; atualizarPainel(); desenharSonda(); }
        trocarModo(est.modo);
        if ('ResizeObserver' in window) {
          var ro = new ResizeObserver(function () { var w = Math.round(mapaCx.clientWidth); if (w && Math.abs(w - est.W) > 4) desenhar(); });
          ro.observe(mapaCx); limpezas.push(function () { ro.disconnect(); });
        }
      }).catch(function (e) {
        console.error(e);
        carregando.textContent = 'Não foi possível carregar a carta (biblioteca D3 ou dados geográficos).';
      });

      function cenario() { return CENARIOS[est.cen]; }
      function tModelo() { return est.hora + HORAS.desloc; }
      function trocarCenario(id, primeira) {
        est.cen = id; selCen.value = id;
        var c = cenario();
        if (!c.hemi) est.hem = 'S';
        est.ponto = c.ponto.slice();
        if (est.hem === 'N') est.ponto[1] = -est.ponto[1];
        if (!primeira) est.hora = 0;
        pararAnim();
        recalcular();
        montarCidades();
        if (est.modo === 'desafio' && !primeira) novoDesafio();
      }
      function recalcular() {
        E = estado(cenario(), tModelo(), est.hem);
        VL.$$('button', segHem).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.hem)); b.disabled = !cenario().hemi; });
        segHem.hidden = !cenario().hemi; notaHem.hidden = !!cenario().hemi;
        resumoCen.innerHTML = '';
        resumoCen.appendChild(h('strong', null, cenario().titulo + '. '));
        resumoCen.appendChild(document.createTextNode(cenario().resumo));
        if (est.cen === 'esquematico' && est.hem === 'N') resumoCen.appendChild(h('span', { class: 'ms-hem-nota' }, ' No Hemisfério Norte o vento gira no sentido anti-horário em volta da baixa, e a frente fria fica ao sul da baixa.'));
        desenhar();
        montarTempo();
        atualizarPainel();
      }

      /* ---------- Desenho da carta ---------- */
      var svgEl = null, gSonda = null, gDes = null, idClip = uid('ms-clip'), ids = {};
      function sobreTerra(lon, lat) {
        if (!cenario().terra || !terra || !d3) return false;
        var fs = terra.features;
        for (var i = 0; i < fs.length; i++) if (d3.geoContains(fs[i], [lon, lat])) return true;
        return false;
      }
      function desenhar() {
        if (!d3 || !E) return;
        var c = cenario(), ext = c.ext.slice();
        if (est.hem === 'N') ext = [ext[0], -ext[3], ext[2], -ext[1]];
        var W = Math.max(280, Math.round(mapaCx.clientWidth || 600));
        est.W = W;
        var pontos = { type: 'MultiPoint', coordinates: [[ext[0], ext[1]], [ext[2], ext[1]], [ext[2], ext[3]], [ext[0], ext[3]], [(ext[0] + ext[2]) / 2, ext[1]], [(ext[0] + ext[2]) / 2, ext[3]]] };
        proj = d3.geoMercator().fitWidth(W, pontos);
        var b = d3.geoPath(proj).bounds(pontos);
        var H = Math.round(b[1][1] - b[0][1]);
        proj.translate([proj.translate()[0], proj.translate()[1] - b[0][1]]);
        proj.clipExtent([[0, 0], [W, H]]);
        var path = d3.geoPath(proj);
        var raiz = svg('svg', { class: 'ms-svg svg-interativo', viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'application', tabindex: '0',
          'aria-label': 'Carta sinótica: ' + c.titulo + '. Toque num ponto do mar para ver o vento. Com o teclado, use as setas para mover o ponto.' });
        var defs = svg('defs');
        var cp = svg('clipPath', { id: idClip }); cp.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H })); defs.appendChild(cp);
        var idH = uid('ms-hach');
        var pat = svg('pattern', { id: idH, width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
        pat.appendChild(svg('rect', { x: 0, y: 0, width: 3, height: 9, class: 'ms-zcit-traco' }));
        defs.appendChild(pat);
        var idSeta = uid('ms-seta'), idSetaC = uid('ms-setac'), idGiro = uid('ms-giro');
        ids = { seta: idSeta, campo: idSetaC, giro: idGiro };
        var mk = svg('marker', { id: idSeta, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' });
        mk.appendChild(svg('path', { d: 'M0 0L10 5L0 10z', class: 'ms-ponta' })); defs.appendChild(mk);
        var mk2 = svg('marker', { id: idSetaC, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 4.5, markerHeight: 4.5, orient: 'auto' });
        mk2.appendChild(svg('path', { d: 'M0 0L10 5L0 10z', class: 'ms-ponta-campo' })); defs.appendChild(mk2);
        var mk3 = svg('marker', { id: idGiro, viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' });
        mk3.appendChild(svg('path', { d: 'M0 0L10 5L0 10z', class: 'ms-ponta-giro' })); defs.appendChild(mk3);
        raiz.appendChild(defs);
        var g = svg('g', { 'clip-path': 'url(#' + idClip + ')' });
        raiz.appendChild(g);
        g.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, class: 'ms-mar' }));
        g.appendChild(svg('path', { d: path(d3.geoGraticule().step([10, 10]).extent([[ext[0] - 20, ext[1] - 20], [ext[2] + 20, ext[3] + 20]])()), class: 'ms-grat' }));
        if (c.terra && terra) g.appendChild(svg('path', { d: path(terra), class: 'ms-terra' }));
        // ZCIT
        E.faixas.forEach(function (z) {
          if (z.tipo !== 'zcit') return;
          var y1 = proj([0, z.lat + 1.6])[1], y2 = proj([0, z.lat - 1.6])[1];
          g.appendChild(svg('rect', { x: 0, y: Math.min(y1, y2), width: W, height: Math.abs(y2 - y1), fill: 'url(#' + idH + ')', class: 'ms-zcit' }));
          g.appendChild(txt(W - 8, Math.min(y1, y2) - 5, 'ZCIT', 'ms-rotulo-zcit', { 'text-anchor': 'end' }));
        });
        // isóbaras
        desenharIsobaras(g, ext, W, H);
        // águas (itálico)
        (c.aguas || []).forEach(function (a) {
          var lat = est.hem === 'N' ? -a[1] : a[1];
          var p = proj([a[0], lat]); if (!p) return;
          g.appendChild(txt(p[0], p[1], a[2], 'ms-agua', { 'text-anchor': 'middle' }));
        });
        // campo de vento
        if (est.ventos) desenharCampo(g, W, H);
        // frentes
        E.frentes.forEach(function (f) { desenharFrente(g, f); });
        // centros
        E.centros.forEach(function (ct) {
          if (ct.oculto) return;
          var p = proj([ct.lon, ct.lat]); if (!p || p[0] < -20 || p[0] > W + 20 || p[1] < -20 || p[1] > H + 20) return;
          var pc = Math.round(pressao(E, ct.lon, ct.lat));
          var gc = svg('g', { class: 'ms-centro ms-centro-' + ct.tipo, transform: 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')' });
          // seta circular mostrando o sentido do giro do vento
          var hor = (ct.tipo === 'B') === (ct.lat < 0); // horário na tela?
          var r = 30, a0 = -150, a1 = 150;
          var p0 = [r * Math.cos(rad(a0)), r * Math.sin(rad(a0))], p1 = [r * Math.cos(rad(a1)), r * Math.sin(rad(a1))];
          // SVG: sweep 1 = sentido horário na tela (norte para cima, leste à direita: igual ao geográfico)
          var dArc = hor
            ? 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 1 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1)
            : 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 1 0 ' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1);
          gc.appendChild(svg('path', { d: dArc, class: 'ms-giro', 'marker-end': 'url(#' + idGiro + ')' }));
          gc.appendChild(txt(0, 9, ct.tipo, 'ms-letra', { 'text-anchor': 'middle' }));
          gc.appendChild(txt(0, 26, String(pc), 'ms-valor', { 'text-anchor': 'middle' }));
          var tt = svg('title'); tt.textContent = (ct.tipo === 'A' ? 'Alta' : 'Baixa') + ' de ' + pc + ' hPa; o vento gira no sentido ' + (hor ? 'horário' : 'anti-horário');
          gc.appendChild(tt);
          g.appendChild(gc);
        });
        // cidades
        var caixas = []; // caixas dos rótulos já desenhados: rótulo que bate em outro não é desenhado (o ponto fica, com título)
        function bate(r) { return caixas.some(function (q) { return r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]; }); }
        if (c.terra) CIDADES.forEach(function (cd) {
          var p = proj([cd[1], cd[2]]); if (!p || p[0] < 4 || p[0] > W - 4 || p[1] < 4 || p[1] > H - 4) return;
          var pt = svg('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 2.6, class: 'ms-cidade-p' });
          var tc = svg('title'); tc.textContent = cd[0]; pt.appendChild(tc);
          g.appendChild(pt);
          var larg = cd[0].length * 6.4 + 4, dir0 = p[0] > W - larg - 12, escolha = null;
          [dir0, !dir0].some(function (dir) {
            var x0 = dir ? p[0] - 5 - larg : p[0] + 5, r = [x0, p[1] - 9, x0 + larg, p[1] + 5];
            if (r[0] < 2 || r[2] > W - 2 || bate(r)) return false;
            escolha = { dir: dir, r: r }; return true;
          });
          if (!escolha) return;
          caixas.push(escolha.r);
          g.appendChild(txt(p[0] + (escolha.dir ? -5 : 5), p[1] + 4, cd[0], 'ms-cidade', { 'text-anchor': escolha.dir ? 'end' : 'start' }));
        });
        // rótulos de lat/lon
        var gl = svg('g', { class: 'ms-grat-rot' });
        for (var lo = Math.ceil(ext[0] / 10) * 10; lo <= ext[2]; lo += 10) { var px = proj([lo, ext[1]]); if (px && px[0] > 16 && px[0] < W - 16) gl.appendChild(txt(px[0], H - 5, Math.abs(lo) + '°' + (lo < 0 ? 'W' : lo > 0 ? 'E' : ''), 'ms-grat-t', { 'text-anchor': 'middle' })); }
        for (var la = Math.ceil(ext[1] / 10) * 10; la <= ext[3]; la += 10) { var py = proj([ext[0], la]); if (py && py[1] > 14 && py[1] < H - 18) gl.appendChild(txt(5, py[1] - 3, Math.abs(la) + '°' + (la < 0 ? 'S' : la > 0 ? 'N' : ''), 'ms-grat-t')); }
        g.appendChild(gl);
        gSonda = svg('g', { class: 'ms-sonda' }); g.appendChild(gSonda);
        gDes = svg('g', { class: 'ms-des-marcas' }); g.appendChild(gDes);
        // interação
        raiz.addEventListener('pointerdown', aoTocar);
        raiz.addEventListener('keydown', aoTecla);
        mapaCx.innerHTML = '';
        mapaCx.appendChild(raiz);
        svgEl = raiz;
        desenharSonda();
        desenharMarcasDesafio();
        montarLegenda();
      }

      function desenharIsobaras(g, ext, W, H) {
        var passo = Math.max(0.25, (ext[2] - ext[0]) / 150);
        var nx = Math.ceil((ext[2] - ext[0]) / passo) + 3, ny = Math.ceil((ext[3] - ext[1]) / passo) + 3;
        var lon0 = ext[0] - passo, lat0 = ext[3] + passo;
        var vals = new Array(nx * ny), mn = Infinity, mx = -Infinity;
        for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
          var p = pressao(E, lon0 + i * passo, lat0 - j * passo);
          vals[j * nx + i] = p; if (p < mn) mn = p; if (p > mx) mx = p;
        }
        var niveis = [];
        for (var v = Math.ceil(mn / 4) * 4; v <= mx; v += 4) niveis.push(v);
        var cont = d3.contours().size([nx, ny]).thresholds(niveis)(vals);
        var gi = svg('g', { class: 'ms-isobaras' }), gr = svg('g', { class: 'ms-isob-rot' });
        var ocupados = [];
        E.centros.forEach(function (ct) { var p = proj([ct.lon, ct.lat]); if (p) ocupados.push([p[0] - 34, p[1] - 30, p[0] + 34, p[1] + 34]); });
        function livre(bx) { for (var k = 0; k < ocupados.length; k++) { var o = ocupados[k]; if (bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1]) return false; } return true; }
        function paraTela(pt) { return proj([lon0 + (pt[0] - 0.5) * passo, lat0 - (pt[1] - 0.5) * passo]); }
        function borda(pt) { return pt[0] <= 0 || pt[1] <= 0 || pt[0] >= nx || pt[1] >= ny; }
        cont.forEach(function (c) {
          c.coordinates.forEach(function (poly) {
            poly.forEach(function (anel) {
              // corta os trechos que correm pela borda da grade
              var linhas = [], atual = [];
              for (var k = 0; k < anel.length - 1; k++) {
                var a = anel[k], b = anel[k + 1];
                if (borda(a) && borda(b)) { if (atual.length > 1) linhas.push(atual); atual = []; continue; }
                if (!atual.length) atual.push(a);
                atual.push(b);
              }
              if (atual.length > 1) linhas.push(atual);
              var fechado = linhas.length === 1 && !anel.some(borda);
              linhas.forEach(function (ln) {
                var pts = ln.map(paraTela).filter(Boolean);
                if (pts.length < 2) return;
                var suave = fechado ? d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))(pts.slice(0, -1)) : d3.line().curve(d3.curveCatmullRom.alpha(0.5))(pts);
                gi.appendChild(svg('path', { d: suave, class: 'ms-isobara' + (c.value % 8 === 0 ? ' ms-isobara-8' : '') }));
                // rótulo
                var L = 0; for (var q = 1; q < pts.length; q++) L += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
                if (L < 90) return;
                var cand = [0.5, 0.3, 0.7, 0.15, 0.85];
                for (var ci = 0; ci < cand.length; ci++) {
                  var idx = Math.floor(pts.length * cand[ci]), pt = pts[idx];
                  if (!pt || pt[0] < 26 || pt[0] > W - 26 || pt[1] < 14 || pt[1] > H - 22) continue;
                  var bx = [pt[0] - 19, pt[1] - 9, pt[0] + 19, pt[1] + 9];
                  if (!livre(bx)) continue;
                  ocupados.push([bx[0] - 30, bx[1] - 14, bx[2] + 30, bx[3] + 14]);
                  gr.appendChild(txt(pt[0], pt[1] + 4, String(c.value), 'ms-isob-t', { 'text-anchor': 'middle' }));
                  break;
                }
              });
            });
          });
        });
        g.appendChild(gi); g.appendChild(gr);
      }

      function desenharCampo(g, W, H) {
        var gc = svg('g', { class: 'ms-campo' });
        var esp = W < 480 ? 40 : 46;
        for (var y = esp * 0.6; y < H - 10; y += esp) {
          for (var x = esp * 0.6 + ((Math.round(y / esp) % 2) ? esp / 2 : 0); x < W - 8; x += esp) {
            var ll = proj.invert([x, y]); if (!ll) continue;
            if (sobreTerra(ll[0], ll[1])) continue;
            var w = vento(E, ll[0], ll[1], false);
            var forte = w.vgKn != null ? clamp(w.vgKn * 0.7 / 30, 0.25, 1) : clamp(w.grad / 0.0012, 0.25, 1);
            var L = 8 + 13 * forte;
            var dx = w.v[0] * L, dy = -w.v[1] * L;
            gc.appendChild(svg('path', { d: 'M' + (x - dx / 2).toFixed(1) + ' ' + (y - dy / 2).toFixed(1) + 'L' + (x + dx / 2).toFixed(1) + ' ' + (y + dy / 2).toFixed(1), 'marker-end': 'url(#' + ids.campo + ')' }));
          }
        }
        g.appendChild(gc);
      }

      function desenharFrente(g, f) {
        var tela = f.pts.map(function (p) { return proj(p); }).filter(Boolean);
        if (tela.length < 2) return;
        var den = catmull(tela, 3), cum = acumulado(den), L = cum[cum.length - 1];
        var gf = svg('g', { class: 'ms-frente ms-f-' + f.tipo });
        if (f.tipo === 'cavado') { gf.appendChild(svg('path', { d: caminho(den), class: 'ms-f-linha ms-f-tracejada' })); g.appendChild(gf); return; }
        if (f.tipo === 'crista') {
          // zigue-zague ao longo da linha
          var zz = [], amp = 5, paso = 9, s = 0, lado = 1;
          while (s <= L) { var q = noPonto(den, cum, s); zz.push([q.x - q.ty * amp * lado, q.y + q.tx * amp * lado]); lado = -lado; s += paso; }
          gf.appendChild(svg('path', { d: caminho(zz), class: 'ms-f-linha ms-f-zz' }));
          g.appendChild(gf); return;
        }
        if (f.tipo === 'estacionaria') {
          // segmentos alternados vermelho/azul
          var segL = 26;
          for (var s0 = 0, kk = 0; s0 < L; s0 += segL, kk++) {
            var pedaco = [], s1 = Math.min(L, s0 + segL);
            for (var ss = s0; ss <= s1; ss += 3) { var qq = noPonto(den, cum, ss); pedaco.push([qq.x, qq.y]); }
            gf.appendChild(svg('path', { d: caminho(pedaco), class: 'ms-f-linha ' + (kk % 2 ? 'ms-f-cor-fria' : 'ms-f-cor-quente') }));
          }
        } else {
          gf.appendChild(svg('path', { d: caminho(den), class: 'ms-f-linha' }));
        }
        // lado dos símbolos: sentido do deslocamento (ou lado do ar quente) projetado na tela
        var ref = f.mov || f.quente || [0, 1];
        var meio = f.pts[Math.floor(f.pts.length / 2)];
        var pA = proj(meio), pB = proj([meio[0] + ref[0], meio[1] + ref[1]]);
        var vx = pB[0] - pA[0], vy = pB[1] - pA[1];
        var esp = 30, tam = 7.5;
        var k2 = 0;
        for (var s2 = esp * 0.6; s2 < L - 6; s2 += esp, k2++) {
          var p = noPonto(den, cum, s2);
          var nxp = -p.ty, nyp = p.tx; // normal à esquerda do traçado (na tela)
          var lado2 = (nxp * vx + nyp * vy) >= 0 ? 1 : -1;
          var tipoS;
          if (f.tipo === 'fria') tipoS = 'tri';
          else if (f.tipo === 'quente') tipoS = 'semi';
          else if (f.tipo === 'oclusa') tipoS = k2 % 2 ? 'semi' : 'tri';
          else if (f.tipo === 'estacionaria') { tipoS = k2 % 2 ? 'tri' : 'semi'; if (tipoS === 'semi') lado2 = -lado2; }
          var cls = f.tipo === 'estacionaria' ? (tipoS === 'tri' ? 'ms-simb ms-f-cor-fria-f' : 'ms-simb ms-f-cor-quente-f') : 'ms-simb';
          var a = [p.x - p.tx * tam, p.y - p.ty * tam], b = [p.x + p.tx * tam, p.y + p.ty * tam];
          var nX = nxp * lado2, nY = nyp * lado2;
          if (tipoS === 'tri') {
            gf.appendChild(svg('path', { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + (p.x + nX * tam * 1.25).toFixed(1) + ' ' + (p.y + nY * tam * 1.25).toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + 'Z', class: cls }));
          } else {
            // semicírculo do lado n: varredura escolhida pelo produto vetorial
            var sweep = (p.tx * nY - p.ty * nX) > 0 ? 0 : 1;
            gf.appendChild(svg('path', { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'A' + tam + ' ' + tam + ' 0 0 ' + sweep + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + 'Z', class: cls }));
          }
        }
        g.appendChild(gf);
      }

      /* ---------- Sonda (ponto escolhido) ---------- */
      function desenharSonda() {
        if (!gSonda || !proj || !est.ponto) return;
        while (gSonda.firstChild) gSonda.removeChild(gSonda.firstChild);
        if (est.modo === 'desafio') return;
        var p = proj(est.ponto); if (!p) return;
        var terraP = sobreTerra(est.ponto[0], est.ponto[1]);
        var w = vento(E, est.ponto[0], est.ponto[1], terraP);
        var L = 46;
        // isóbara (tangente = direção geostrófica)
        var gx = w.vg[0], gy = -w.vg[1];
        gSonda.appendChild(svg('path', { d: 'M' + (p[0] - gx * L).toFixed(1) + ' ' + (p[1] - gy * L).toFixed(1) + 'L' + (p[0] + gx * L).toFixed(1) + ' ' + (p[1] + gy * L).toFixed(1), class: 'ms-sonda-isob' }));
        // arco do ângulo
        var a1 = Math.atan2(gy, gx), a2 = Math.atan2(-w.v[1], w.v[0]), r = 30;
        var dA = difAng(deg(a2), deg(a1));
        var q1 = [p[0] + r * Math.cos(a1), p[1] + r * Math.sin(a1)], q2 = [p[0] + r * Math.cos(a2), p[1] + r * Math.sin(a2)];
        gSonda.appendChild(svg('path', { d: 'M' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 0 ' + (dA > 0 ? 1 : 0) + ' ' + q2[0].toFixed(1) + ' ' + q2[1].toFixed(1), class: 'ms-sonda-arco' }));
        var am = a1 + rad(dA) / 2;
        gSonda.appendChild(txt(p[0] + (r + 12) * Math.cos(am), p[1] + (r + 12) * Math.sin(am) + 4, Math.round(Math.abs(dA)) + '°', 'ms-sonda-ang', { 'text-anchor': 'middle' }));
        // vento (de onde vem → para onde vai)
        var vx = w.v[0], vy = -w.v[1], Lv = 40;
        gSonda.appendChild(svg('path', { d: 'M' + (p[0] - vx * Lv).toFixed(1) + ' ' + (p[1] - vy * Lv).toFixed(1) + 'L' + (p[0] + vx * Lv * 0.9).toFixed(1) + ' ' + (p[1] + vy * Lv * 0.9).toFixed(1), class: 'ms-sonda-vento', 'marker-end': 'url(#' + ids.seta + ')' }));
        gSonda.appendChild(svg('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 5.5, class: 'ms-sonda-p' }));
        var rot = 'vento de ' + rumo16(w.de);
        var tx = p[0] - vx * Lv - (vx > 0 ? 6 : -6), ty = p[1] - vy * Lv - 8;
        gSonda.appendChild(txt(clamp(tx, 30, est.W - 30), clamp(ty, 14, 9999), rot, 'ms-sonda-rot', { 'text-anchor': 'middle' }));
      }
      function aoTocar(e) {
        if (!proj) return;
        var r = svgEl.getBoundingClientRect();
        var x = (e.clientX - r.left) * (est.W / r.width), y = (e.clientY - r.top) * (est.W / r.width);
        var ll = proj.invert([x, y]); if (!ll) return;
        if (est.modo === 'desafio') { tocarDesafio(ll, [x, y]); return; }
        est.ponto = [ll[0], ll[1]];
        desenharSonda(); atualizarPainel();
      }
      function aoTecla(e) {
        if (est.modo === 'desafio' || !est.ponto) return;
        var d = e.shiftKey ? 5 : 1, m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
        if (!m) return;
        e.preventDefault();
        est.ponto = [est.ponto[0] + m[0], clamp(est.ponto[1] + m[1], -80, 80)];
        desenharSonda(); atualizarPainel();
      }

      /* ---------- Painel de leitura ---------- */
      function classe(espKm, lat) {
        // espaçamento entre isóbaras de 4 hPa → intensidade relativa (ajustada pela latitude, como na fórmula)
        var k = espKm * Math.sin(rad(Math.max(15, Math.abs(lat)))) / Math.sin(rad(40));
        if (k > 900) return 'fraco';
        if (k > 450) return 'moderado';
        if (k > 230) return 'forte';
        return 'muito forte';
      }
      function atualizarPainel() {
        if (!E || !est.ponto) return;
        painel.innerHTML = '';
        if (est.modo === 'desafio') return;
        var lon = est.ponto[0], lat = est.ponto[1];
        var terraP = sobreTerra(lon, lat);
        var w = vento(E, lon, lat, terraP);
        var hs = lat < 0;
        painel.appendChild(h('p', { class: 'ms-p-local' }, latTxt(lat) + ' ' + lonTxt(lon) + (terraP ? ' · sobre a terra' : ' · sobre o mar')));
        painel.appendChild(h('div', { class: 'ms-p-vento' },
          h('span', { class: 'ms-p-dir' }, 'Vento de ' + rumo16(w.de)),
          h('span', { class: 'ms-p-graus' }, String(Math.round(w.de)).padStart(3, '0') + '° · sopra para ' + rumo16(w.para))));
        var linhas = [];
        linhas.push(['Pressão', VL.fmt.num(w.p, 0) + ' hPa']);
        linhas.push(['Isóbaras (4 hPa)', 'a cerca de ' + VL.fmt.num(Math.round(w.espKm / 10) * 10, 0) + ' km: vento ' + classe(w.espKm, lat)]);
        if (w.vgKn != null && !terraP) {
          var vs = w.vsKn, fz = beaufort(vs);
          linhas.push(['Estimativa', 'geostrófico ' + Math.round(w.vgKn) + ' nós; à superfície do mar ~' + Math.round(vs) + ' nós (força ' + fz + ')']);
          var d1 = rumo8(w.de), base45 = Math.floor(norm360(w.de) / 45) * 45, outro = rumo8(d1 === rumo8(base45) ? base45 + 45 : base45);
          linhas.push(['Em boletim', 'algo como "VENTO ' + d1 + '/' + outro + ' ' + Math.max(0, fz - 1) + '/' + fz + '"']);
        } else if (Math.abs(lat) < 15) {
          linhas.push(['Estimativa', 'perto do equador a fórmula do vento geostrófico não vale (Coriolis fraca): use a previsão']);
        } else {
          linhas.push(['Estimativa', 'sobre a terra o atrito e o relevo mudam muito o vento: sem número']);
        }
        linhas.push(['Ângulo com a isóbara', Math.round(w.alfa) + '° para dentro da baixa (' + (terraP ? 'terra' : 'mar') + (Math.abs(lat) < 20 ? ', perto do equador' : '') + ')']);
        var dl = h('dl', { class: 'ms-p-dl' });
        linhas.forEach(function (l) { dl.appendChild(h('dt', null, l[0])); dl.appendChild(h('dd', null, l[1])); });
        painel.appendChild(dl);
        painel.appendChild(h('p', { class: 'ms-p-bb' }, Math.abs(lat) < 5 ? 'Perto do equador a regra de Buys-Ballot não funciona bem.' :
          (hs ? 'Buys-Ballot (Hemisfério Sul): de costas para este vento, a baixa fica à sua direita, um pouco à frente.' : 'Buys-Ballot (Hemisfério Norte): de costas para este vento, a baixa fica à sua esquerda, um pouco à frente.')));
        if (cenario().tempo) painel.appendChild(tendencia(lon, lat, terraP));
      }
      function tendencia(lon, lat, terraP) {
        var cx = h('div', { class: 'ms-tend' });
        var t0 = est.hora, pontos = [];
        [-6, -3, 0, 3, 6, 9, 12, 18, 24].forEach(function (dh) {
          var hh = t0 + dh; if (hh < HORAS.min - 12 || hh > HORAS.max + 12) return;
          var Et = estado(cenario(), hh + HORAS.desloc, est.hem);
          var w = vento(Et, lon, lat, terraP);
          pontos.push({ dh: dh, p: w.p, de: w.de, vs: w.vsKn });
        });
        var agora = pontos.filter(function (q) { return q.dh === 0; })[0], antes = pontos.filter(function (q) { return q.dh === -3; })[0];
        var tend = antes ? agora.p - antes.p : 0;
        var tTxt = Math.abs(tend) < 0.5 ? 'estável' : tend < 0 ? 'caindo' : 'subindo';
        cx.appendChild(h('p', { class: 'ms-tend-t' }, h('strong', null, 'Tendência: '), 'pressão ' + tTxt + ' (' + (tend > 0 ? '+' : '') + VL.fmt.num(tend, 1) + ' hPa nas últimas 3 h)'));
        var tab = h('div', { class: 'ms-tend-fila', role: 'list' });
        pontos.forEach(function (q) {
          var seta = svg('svg', { viewBox: '-12 -12 24 24', width: 24, height: 24, class: 'ms-tend-seta', 'aria-hidden': 'true' },
            svg('path', { d: 'M0 -8L0 8M-4.5 3L0 8L4.5 3', transform: 'rotate(' + (q.de).toFixed(0) + ')' }));
          tab.appendChild(h('div', { class: 'ms-tend-c' + (q.dh === 0 ? ' ms-tend-agora' : ''), role: 'listitem', 'aria-label': (q.dh === 0 ? 'agora' : (q.dh > 0 ? 'em ' + q.dh + ' h' : 'há ' + (-q.dh) + ' h')) + ': vento de ' + rumo16(q.de) + ', ' + Math.round(q.p) + ' hPa' },
            h('span', { class: 'ms-tend-h' }, q.dh === 0 ? 'agora' : (q.dh > 0 ? '+' : '') + q.dh + ' h'), seta, h('span', { class: 'ms-tend-d' }, rumo8(q.de)), h('span', { class: 'ms-tend-p' }, String(Math.round(q.p)))));
        });
        cx.appendChild(tab);
        // rondada nas próximas 24 h (soma das variações, com sinal)
        var fut = pontos.filter(function (q) { return q.dh >= 0; }), giro = 0;
        for (var i = 1; i < fut.length; i++) giro += difAng(fut[i].de, fut[i - 1].de);
        if (fut.length > 1) {
          var ini = rumo8(fut[0].de), fim = rumo8(fut[fut.length - 1].de);
          cx.appendChild(h('p', { class: 'ms-tend-r' }, Math.abs(giro) < 40 ? 'Nas próximas ' + fut[fut.length - 1].dh + ' h o vento fica mais ou menos de ' + ini + '.' :
            'Nas próximas ' + fut[fut.length - 1].dh + ' h o vento ronda de ' + ini + ' para ' + fim + ', no sentido ' + (giro < 0 ? 'anti-horário' : 'horário') + ' (' + Math.round(Math.abs(giro)) + '°).' +
            (giro < -60 && lat < 0 ? ' No Hemisfério Sul, é o giro típico da passagem de uma frente fria.' : '')));
        }
        return cx;
      }

      /* ---------- Tempo ---------- */
      var animTm = null;
      var faixa = h('input', { type: 'range', min: String(HORAS.min), max: String(HORAS.max), step: String(HORAS.passo), class: 'ms-faixa', 'aria-label': 'Hora da carta' });
      var horaTxt = h('span', { class: 'ms-hora' });
      var btnMenos = h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Voltar 3 horas', onclick: function () { pararAnim(); mudarHora(est.hora - 3); } }, VL.icon('esquerda'));
      var btnMais = h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Avançar 3 horas', onclick: function () { pararAnim(); mudarHora(est.hora + 3); } }, VL.icon('direita'));
      var btnPlay = h('button', { type: 'button', class: 'btn btn-ghost ms-play', onclick: function () { if (animTm) pararAnim(); else tocarAnim(); } });
      faixa.addEventListener('input', function () { pararAnim(); mudarHora(Number(faixa.value)); });
      function montarTempo() {
        tempoCx.innerHTML = '';
        if (!cenario().tempo) { tempoCx.hidden = true; return; }
        tempoCx.hidden = false;
        faixa.value = String(est.hora);
        horaTxt.textContent = '+' + est.hora + ' h';
        faixa.setAttribute('aria-valuetext', est.hora + ' horas desde o início');
        btnPlay.textContent = animTm ? 'Pausar' : 'Passar o tempo';
        tempoCx.appendChild(h('div', { class: 'ms-tempo-linha' }, h('span', { class: 'ms-rot' }, 'Hora da carta'), horaTxt, btnMenos, h('div', { class: 'ms-faixa-cx' }, faixa), btnMais, btnPlay));
      }
      function mudarHora(hh) {
        est.hora = clamp(hh, HORAS.min, HORAS.max);
        E = estado(cenario(), tModelo(), est.hem);
        desenhar(); montarTempo(); atualizarPainel();
      }
      function tocarAnim() {
        if (est.hora >= HORAS.max) est.hora = HORAS.min - 3;
        animTm = setInterval(function () {
          if (!visivel) return;
          if (est.hora >= HORAS.max) { pararAnim(); return; }
          mudarHora(est.hora + 3);
        }, reduzMov() ? 1400 : 800);
        montarTempo();
      }
      function pararAnim() { if (animTm) { clearInterval(animTm); animTm = null; } if (cenario().tempo) { btnPlay.textContent = 'Passar o tempo'; } }
      var visivel = true, io = null;
      if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; }, { threshold: 0.05 }); io.observe(ins.raiz); }

      /* ---------- Cidades (alternativa acessível ao toque) ---------- */
      function montarCidades() {
        cidadesCx.innerHTML = '';
        if (!proj || !cenario().terra) return;
        var c = cenario(), ext = c.ext;
        var vis = CIDADES.filter(function (cd) { return cd[1] > ext[0] + 1 && cd[1] < ext[2] - 1 && cd[2] > ext[1] + 1 && cd[2] < ext[3] - 1; });
        if (!vis.length) return;
        var cl = h('div', { class: 'chip-list' });
        vis.forEach(function (cd) {
          cl.appendChild(h('button', { type: 'button', class: 'chip ms-chip', onclick: function () {
            // ponto no mar, um pouco ao largo da cidade
            var alvo = [cd[1] + 0.6, cd[2] - 0.2];
            for (var k = 0; k < 6 && sobreTerra(alvo[0], alvo[1]); k++) alvo[0] += 0.5;
            est.ponto = alvo; if (est.modo !== 'explorar') trocarModo('explorar');
            desenharSonda(); atualizarPainel();
          } }, 'ao largo de ' + cd[0]));
        });
        cidadesCx.appendChild(h('p', { class: 'ms-rot ms-cid-t' }, 'Escolher um lugar'));
        cidadesCx.appendChild(cl);
      }

      /* ---------- Legenda ---------- */
      function montarLegenda() {
        legenda.innerHTML = '';
        var usados = {};
        E.frentes.forEach(function (f) { usados[f.tipo] = 1; });
        E.faixas.forEach(function (z) { usados[z.tipo] = 1; });
        var itens = [
          ['A', 'Alta pressão (anticiclone)', 'H'], ['B', 'Baixa pressão (ciclone)', 'L'], ['isob', 'Isóbara (hPa, de 4 em 4)'],
          ['fria', 'Frente fria'], ['quente', 'Frente quente'], ['oclusa', 'Frente oclusa'], ['estacionaria', 'Frente quase-estacionária'],
          ['cavado', 'Cavado'], ['crista', 'Crista'], ['zcit', 'ZCIT (Zona de Convergência Intertropical)'], ['seta', 'Vento à superfície (setas)'],
        ].filter(function (it) { return ['A', 'B', 'isob', 'seta'].indexOf(it[0]) >= 0 || usados[it[0]]; });
        var ul = h('ul', { class: 'ms-leg-lista' });
        itens.forEach(function (it) {
          var s = svg('svg', { viewBox: '0 0 64 24', width: 64, height: 24, class: 'ms-leg-svg', 'aria-hidden': 'true' });
          if (it[0] === 'A' || it[0] === 'B') s.appendChild(txt(22, 19, it[0], 'ms-letra ms-letra-' + it[0], { 'text-anchor': 'middle' }));
          else if (it[0] === 'isob') { s.appendChild(svg('path', { d: 'M2 14C20 6 44 22 62 12', class: 'ms-isobara' })); }
          else if (it[0] === 'seta') { s.appendChild(svg('path', { d: 'M14 12H46M40 7L46 12L40 17', class: 'ms-leg-seta' })); }
          else if (it[0] === 'zcit') { s.appendChild(svg('rect', { x: 2, y: 6, width: 60, height: 12, class: 'ms-zcit ms-zcit-leg' })); }
          else {
            var gtmp = svg('g');
            var f = { tipo: it[0], pts: null };
            desenharSimbLegenda(gtmp, it[0]);
            s.appendChild(gtmp);
          }
          ul.appendChild(h('li', null, s, h('span', null, it[1], it[2] ? h('span', { class: 'ms-en', 'data-intl': 'on' }, ' (' + (it[0] === 'A' ? 'high, H' : 'low, L') + ')') : null)));
        });
        legenda.appendChild(h('p', { class: 'ms-leg-t' }, 'Legenda'));
        legenda.appendChild(ul);
      }
      function desenharSimbLegenda(g, tipo) {
        var y = 15, cls = 'ms-frente ms-f-' + tipo;
        var gf = svg('g', { class: cls });
        if (tipo === 'cavado') { gf.appendChild(svg('path', { d: 'M2 ' + y + 'H62', class: 'ms-f-linha ms-f-tracejada' })); g.appendChild(gf); return; }
        if (tipo === 'crista') { gf.appendChild(svg('path', { d: 'M2 ' + y + 'l5 -5l5 10l5 -10l5 10l5 -10l5 10l5 -10l5 10l5 -10l5 10l5 -5', class: 'ms-f-linha ms-f-zz' })); g.appendChild(gf); return; }
        if (tipo === 'estacionaria') {
          gf.appendChild(svg('path', { d: 'M2 ' + y + 'H22', class: 'ms-f-linha ms-f-cor-quente' }));
          gf.appendChild(svg('path', { d: 'M22 ' + y + 'H42', class: 'ms-f-linha ms-f-cor-fria' }));
          gf.appendChild(svg('path', { d: 'M42 ' + y + 'H62', class: 'ms-f-linha ms-f-cor-quente' }));
          gf.appendChild(svg('path', { d: 'M5 ' + y + 'A7 7 0 0 0 19 ' + y + 'Z', class: 'ms-simb ms-f-cor-quente-f' }));
          gf.appendChild(svg('path', { d: 'M25 ' + y + 'L32 ' + (y - 9) + 'L39 ' + y + 'Z', class: 'ms-simb ms-f-cor-fria-f' }));
          gf.appendChild(svg('path', { d: 'M45 ' + y + 'A7 7 0 0 0 59 ' + y + 'Z', class: 'ms-simb ms-f-cor-quente-f' }));
          g.appendChild(gf); return;
        }
        gf.appendChild(svg('path', { d: 'M2 ' + y + 'H62', class: 'ms-f-linha' }));
        var xs = [12, 32, 52];
        xs.forEach(function (x, i) {
          var t = tipo === 'fria' ? 'tri' : tipo === 'quente' ? 'semi' : (i % 2 ? 'semi' : 'tri');
          if (t === 'tri') gf.appendChild(svg('path', { d: 'M' + (x - 7) + ' ' + y + 'L' + x + ' ' + (y - 9) + 'L' + (x + 7) + ' ' + y + 'Z', class: 'ms-simb' }));
          else gf.appendChild(svg('path', { d: 'M' + (x - 7) + ' ' + y + 'A7 7 0 0 1 ' + (x + 7) + ' ' + y + 'Z', class: 'ms-simb' }));
        });
        g.appendChild(gf);
      }

      /* ---------- Desafio ---------- */
      var des = { lista: [], i: 0, acertos: 0, q: null, resp: false, marcas: [] };
      var nQ = clamp(Number(opts.questoes) || 6, 3, 12);
      function pontoMar(minGrad) {
        var c = cenario(), ext = c.ext;
        for (var k = 0; k < 200; k++) {
          var lon = ext[0] + 2 + Math.random() * (ext[2] - ext[0] - 4), lat = ext[1] + 2 + Math.random() * (ext[3] - ext[1] - 4);
          if (est.hem === 'N') lat = -lat;
          if (sobreTerra(lon, lat)) continue;
          if (Math.abs(lat) < 12) continue;
          var p = proj([lon, lat]); if (!p || p[0] < 30 || p[0] > est.W - 30 || p[1] < 30) continue;
          var w = vento(E, lon, lat, false);
          if (minGrad && w.grad < minGrad) continue;
          return { lon: lon, lat: lat, w: w };
        }
        return null;
      }
      function gerarDesafio() {
        var qs = [];
        var c = cenario();
        // 1) direção num ponto
        var P = pontoMar(0.0006);
        if (P) {
          var certa = rumo8(P.w.de), espelho = rumo8(norm360(P.w.de + 2 * difAng(norm360(deg(Math.atan2(P.w.n[0], P.w.n[1]))) + 180, P.w.de))), oposto = rumo8(P.w.de + 180);
          var ops = [certa];
          [espelho, oposto, rumo8(P.w.de + 90), rumo8(P.w.de - 90)].forEach(function (o) { if (ops.indexOf(o) < 0 && ops.length < 4) ops.push(o); });
          ops = VL.embaralhar(ops);
          qs.push({ tipo: 'ponto', marcas: [{ ll: [P.lon, P.lat], rot: 'P' }], enun: 'De onde sopra o vento no ponto P (sobre o mar)?', alts: ops.map(function (o) { return 'De ' + o + ' (' + NOME8[o] + ')'; }), certa: ops.indexOf(certa),
            expl: 'O vento em P vem de ' + rumo16(P.w.de) + ': quase paralelo às isóbaras, cruzando-as cerca de ' + Math.round(P.w.alfa) + '° em direção à baixa. ' + (P.lat < 0 ? 'No Hemisfério Sul, de costas para o vento, a baixa fica à direita.' : 'No Hemisfério Norte, de costas para o vento, a baixa fica à esquerda.') + ' Cuidado com o erro comum de usar a regra do outro hemisfério.' });
        }
        // 2) onde é mais forte
        var A = null, B = null;
        for (var k = 0; k < 60 && !B; k++) {
          var a = pontoMar(0.0003), b = pontoMar(0.0003);
          if (!a || !b) continue;
          var pa = proj([a.lon, a.lat]), pb = proj([b.lon, b.lat]);
          if (Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) < 90) continue;
          var ka = a.w.grad / Math.sin(rad(Math.abs(a.lat))), kb = b.w.grad / Math.sin(rad(Math.abs(b.lat)));
          if (ka / kb > 1.8 || kb / ka > 1.8) { A = a; B = b; }
        }
        if (A && B) {
          var kA = A.w.grad / Math.sin(rad(Math.abs(A.lat))), kB = B.w.grad / Math.sin(rad(Math.abs(B.lat)));
          var mais = kA > kB ? 0 : 1;
          qs.push({ tipo: 'forca', marcas: [{ ll: [A.lon, A.lat], rot: '1' }, { ll: [B.lon, B.lat], rot: '2' }], enun: 'Em qual dos pontos o vento deve ser mais forte?', alts: ['No ponto 1', 'No ponto 2', 'Igual nos dois', 'Não dá para saber pela carta'], certa: mais,
            expl: 'Onde as isóbaras estão mais juntas o gradiente de pressão é maior, e o vento também. No ponto 1 as isóbaras estão a cerca de ' + Math.round(A.w.espKm / 10) * 10 + ' km uma da outra; no ponto 2, a cerca de ' + Math.round(B.w.espKm / 10) * 10 + ' km.' });
        }
        // 3) toque onde o vento sopra de X
        var Q = pontoMar(0.0005);
        if (Q) {
          var alvo = rumo8(Q.w.de);
          qs.push({ tipo: 'toque', alvo: alvo, enun: 'Toque no mapa, sobre o mar, num lugar onde o vento sopra de ' + alvo + ' (' + NOME8[alvo] + ').', alts: null,
            expl: 'Siga as isóbaras: o vento corre quase paralelo a elas, ' + (E.centros.some(function (ct) { return ct.lat < 0; }) ? 'girando no sentido horário em volta da baixa e anti-horário em volta da alta (Hemisfério Sul)' : 'girando no sentido anti-horário em volta da baixa e horário em volta da alta (Hemisfério Norte)') + '.' });
        }
        // 4) conceituais
        var hs = est.hem === 'S';
        var fixas = [
          { enun: 'No Hemisfério Sul, de costas para o vento, onde fica a baixa pressão?', alts: ['À direita, um pouco à frente', 'À esquerda, um pouco à frente', 'Bem atrás de você', 'Bem à sua frente'], certa: 0, expl: 'É a lei de Buys-Ballot adaptada ao Sul: o vento gira no sentido horário em volta da baixa, então ela fica à direita de quem está de costas para o vento. O "um pouco à frente" vem do atrito, que faz o vento cruzar as isóbaras para dentro da baixa.' },
          { enun: 'Uma frente fria se aproxima de Florianópolis. Como o vento costuma rondar?', alts: ['De NE para N, NW e depois SW (sentido anti-horário)', 'De NE para E, SE e depois S (sentido horário)', 'Fica de SW o tempo todo', 'De SW para W, NW e depois N'], certa: 0, expl: 'Antes da frente o vento vem de NE e N; perto dela, de NW; na passagem ronda rápido para SW e depois S. No Hemisfério Sul esse giro é no sentido anti-horário (no Norte, a frente fria faz o vento rondar no sentido horário).' },
          { enun: 'No litoral de Santa Catarina a pressão cai depressa e o vento ronda de NE para NW. O que esperar?', alts: ['Frente fria chegando: pancadas, rajadas e vento virando para SW e S', 'A Alta Subtropical se aproximando: tempo bom e vento fraco', 'Fim da frente: vento de SE e pressão subindo', 'Nada de especial: é só a brisa da tarde'], certa: 0, expl: 'Pressão caindo com vento de NW é o sinal clássico de frente fria se aproximando no Sul e Sudeste. Confira o boletim Meteoromarinha e os avisos de mau tempo da Marinha antes de sair.' },
          { enun: 'Em volta de uma alta pressão no Hemisfério Sul, o vento gira…', alts: ['no sentido anti-horário, saindo um pouco para fora', 'no sentido horário, entrando para o centro', 'no sentido horário, saindo para fora', 'sem girar, direto para fora'], certa: 0, expl: 'No Sul, a alta gira no sentido anti-horário (o contrário da baixa) e o atrito faz o ar sair um pouco do centro. É assim que a Alta Subtropical do Atlântico Sul manda vento de NE para o Sudeste e de E/SE para o Nordeste.' },
          { enun: 'Que símbolo representa uma frente quente na carta sinótica?', alts: ['Linha vermelha com semicírculos', 'Linha azul com triângulos', 'Linha roxa com triângulos e semicírculos do mesmo lado', 'Triângulos azuis e semicírculos vermelhos em lados opostos'], certa: 0, expl: 'Frente quente: semicírculos vermelhos, do lado para onde ela anda. Triângulos azuis = frente fria; roxa com os dois símbolos do mesmo lado = oclusa; alternados em lados opostos = quase-estacionária (simbologia da OMM usada pelo CHM).' },
          { enun: 'Duas regiões têm o mesmo espaçamento entre isóbaras, uma a 45°S e outra a 20°S. Onde o vento geostrófico é maior?', alts: ['A 20°S', 'A 45°S', 'É igual', 'Depende só da temperatura'], certa: 0, expl: 'Na fórmula Vg = Δp ÷ (ρ · f · Δn), o f = 2Ω sen(latitude) é menor perto do equador. Com o mesmo gradiente, a 20°S o vento sai maior. Perto do equador (menos de uns 15°) a fórmula deixa de valer.' },
        ];
        if (c.tempo) fixas.unshift({ enun: 'Use o controle "Hora da carta". Num ponto à frente da frente fria, o que acontece com a pressão até a frente passar?', alts: ['Cai, e volta a subir depois da passagem', 'Sobe sem parar', 'Fica igual', 'Sobe, e cai depois da passagem'], certa: 0, expl: 'A frente fica num cavado (pressão mais baixa). Antes dela a pressão cai; depois, com o ar frio e a alta pós-frontal, sobe. Por isso o barômetro é um aliado: queda rápida pede atenção.', tempo: true });
        VL.embaralhar(fixas).slice(0, Math.max(2, nQ - qs.length)).forEach(function (q) {
          var idx = VL.embaralhar(q.alts.map(function (_, i) { return i; }));
          qs.push({ tipo: 'conceito', enun: q.enun, alts: idx.map(function (i) { return q.alts[i]; }), certa: idx.indexOf(q.certa), expl: q.expl });
        });
        return qs.slice(0, nQ);
      }
      function novoDesafio() { des = { lista: gerarDesafio(), i: 0, acertos: 0, q: null, resp: false, marcas: [] }; mostrarDesafio(); }
      function mostrarDesafio() {
        desCx.innerHTML = '';
        des.marcas = [];
        if (des.i >= des.lista.length) {
          desenharMarcasDesafio();
          desCx.appendChild(h('div', { class: 'resultado', 'data-aprovado': des.acertos / des.lista.length >= 0.7 ? '1' : '0' },
            h('p', { class: 'stat-v' }, des.acertos + ' de ' + des.lista.length),
            h('p', null, 'Troque o cenário e jogue de novo: as perguntas sobre o mapa mudam.'),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novoDesafio }, 'Nova rodada'), h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarModo('explorar'); } }, 'Voltar a explorar'))));
          return;
        }
        var q = des.q = des.lista[des.i]; des.resp = false;
        des.marcas = (q.marcas || []).slice();
        desenharMarcasDesafio();
        desCx.appendChild(h('div', { class: 'ms-des-cab' }, h('span', null, 'Pergunta ' + (des.i + 1) + ' de ' + des.lista.length), h('strong', null, des.acertos + (des.acertos === 1 ? ' acerto' : ' acertos'))));
        desCx.appendChild(VL.ui.medidor(des.i / des.lista.length));
        desCx.appendChild(h('p', { class: 'questao-enunciado ms-enun' }, q.enun));
        var expl = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { des.i++; mostrarDesafio(); } }, des.i + 1 < des.lista.length ? 'Próxima pergunta' : 'Ver resultado');
        des.mostrar = function (ok, extra) {
          des.resp = true; if (ok) des.acertos++;
          expl.hidden = false; expl.innerHTML = '';
          expl.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não é essa.'));
          if (extra) expl.appendChild(h('p', null, extra));
          expl.appendChild(h('p', { class: 'mb-0' }, q.expl));
          prox.hidden = false; prox.focus();
        };
        if (q.alts) {
          var lista2 = h('div', { class: 'alternativas', role: 'radiogroup', 'aria-label': 'Alternativas' });
          q.alts.forEach(function (t, k) {
            lista2.appendChild(h('button', { type: 'button', class: 'alternativa', role: 'radio', 'aria-checked': 'false', onclick: function () {
              if (des.resp) return;
              VL.$$('.alternativa', lista2).forEach(function (b, j) { b.disabled = true; if (j === q.certa) b.setAttribute('data-res', 'certa'); else if (j === k) b.setAttribute('data-res', 'errada'); if (j === k) b.setAttribute('aria-checked', 'true'); });
              if (q.tipo === 'ponto') revelarVentos();
              des.mostrar(k === q.certa);
            } }, h('span', { class: 'alternativa-letra' }, 'ABCD'[k]), h('span', null, t)));
          });
          desCx.appendChild(lista2);
        } else {
          desCx.appendChild(h('p', { class: 'ms-dica-toque' }, 'Toque direto na carta acima. As setas de vento ficam escondidas até você responder.'));
        }
        desCx.appendChild(expl);
        desCx.appendChild(h('div', { class: 'btn-row ms-des-rodape' }, prox));
      }
      function tocarDesafio(ll, xy) {
        var q = des.q; if (!q || q.tipo !== 'toque' || des.resp) return;
        if (sobreTerra(ll[0], ll[1])) { VL.ui.toast('Toque sobre o mar.'); return; }
        var w = vento(E, ll[0], ll[1], false);
        var dif = Math.abs(difAng(w.de, ROSA8.indexOf(q.alvo) * 45));
        var ok = dif <= 30;
        des.marcas.push({ ll: ll, rot: ok ? 'certo' : 'aqui', ok: ok, w: w });
        revelarVentos();
        des.mostrar(ok, 'No ponto que você tocou o vento vem de ' + rumo16(w.de) + (ok ? '.' : ' (pedimos de ' + q.alvo + ', com até 30° de folga).'));
      }
      var ventosAntes = null;
      function revelarVentos() { if (!est.ventos) { est.ventos = true; desenhar(); } }
      function desenharMarcasDesafio() {
        if (!gDes || !proj) return;
        while (gDes.firstChild) gDes.removeChild(gDes.firstChild);
        if (est.modo !== 'desafio') return;
        des.marcas.forEach(function (m) {
          var p = proj(m.ll); if (!p) return;
          if (m.w) {
            var vx = m.w.v[0], vy = -m.w.v[1], L = 36;
            gDes.appendChild(svg('path', { d: 'M' + (p[0] - vx * L).toFixed(1) + ' ' + (p[1] - vy * L).toFixed(1) + 'L' + (p[0] + vx * L * 0.9).toFixed(1) + ' ' + (p[1] + vy * L * 0.9).toFixed(1), class: 'ms-sonda-vento', 'marker-end': 'url(#' + ids.seta + ')' }));
          }
          gDes.appendChild(svg('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 11, class: 'ms-des-alvo' + (m.ok === false ? ' ms-des-erro' : m.ok ? ' ms-des-ok' : '') }));
          if (m.rot && m.rot.length <= 2) gDes.appendChild(txt(p[0], p[1] + 4.5, m.rot, 'ms-des-rot', { 'text-anchor': 'middle' }));
        });
      }

      function trocarModo(m) {
        est.modo = m;
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        ins.raiz.setAttribute('data-modo', m);
        desCx.hidden = m !== 'desafio';
        painel.hidden = m === 'desafio'; porque.hidden = m === 'desafio'; cidadesCx.hidden = m === 'desafio';
        if (m === 'desafio') {
          ventosAntes = est.ventos; est.ventos = false; swVentos.checked = false;
          pararAnim(); desenhar(); novoDesafio();
          // o desafio mostra a carta logo acima das perguntas
          vExp.classList.add('ms-exp-desafio');
        } else {
          vExp.classList.remove('ms-exp-desafio');
          if (ventosAntes != null) { est.ventos = ventosAntes; swVentos.checked = est.ventos; ventosAntes = null; }
          desenhar(); atualizarPainel();
        }
      }

      return function limpar() {
        est.vivo = false;
        pararAnim();
        if (io) io.disconnect();
        limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
      };
    },
  });

  VL.meteoSinotica = { CENARIOS: CENARIOS, estado: estado, pressao: pressao, vento: vento, beaufort: beaufort, rumo16: rumo16 };
})();
