/* Widget "reta-altura" — navegação astronômica de cálculo, passo a passo, com exercícios corrigidos.
   Três abas:
     reta      → reta de altura pelo método de Marcq Saint-Hilaire (AHL, Hc, azimute, Δa = Ho − Hc) e
                 plotagem numa folha de plotagem SVG; duas ou três retas dão a posição observada.
     latitude  → latitude meridiana (e longitude) pela passagem meridiana do Sol, com a correção da
                 altura instrumental (ei, depressão, refração, semidiâmetro, paralaxe). É o recorte do
                 programa do Capitão-Amador (NORMAM-211, Anexo 5-A, item 1.2).
     hora      → hora legal (HLeg) aproximada da passagem meridiana superior do Sol (PMS).

   opts (todas opcionais):
     { aba: 'reta' | 'latitude' | 'hora'   (padrão 'reta'),
       modo: 'explorar' | 'exercicio'      (padrão 'explorar'),
       abas: ['reta','latitude','hora']    (quais abas mostrar; padrão todas),
       titulo: 'texto da legenda' }

   Exemplo de bloco de lição:
     { t: 'widget', w: 'reta-altura', opts: { aba: 'latitude', modo: 'exercicio' } }

   Dados de almanaque: SIMULADOS (calculados aqui por fórmulas aproximadas: Sol pelas "low precision
   formulas" do Astronomical Almanac, ~0,01°; estrelas J2000 do catálogo Hipparcos precessadas; tempo
   sideral do USNO). Servem para treinar. A fonte oficial é o Almanaque Náutico da DHN.
   Fórmulas: Miguens, Navegação: a Ciência e a Arte, vol. II (DHN); Bowditch, The American Practical
   Navigator (NGA Pub. 9), caps. "Navigational Astronomy" e "Sight Reduction". Depressão 1,76′√h e
   refração de Bennett (1982), como no Nautical Almanac.

   Também publica VL.navAstro (matemática pura, sem DOM), útil para outros widgets e para testes. */
(function () {
  'use strict';
  var VL = window.VL = window.VL || {};
  var h = VL.h;
  var RAD = Math.PI / 180;

  /* =====================================================================================
     1. Matemática (pura)
     ===================================================================================== */
  function n360(x) { x %= 360; if (x < 0) x += 360; return x >= 360 - 1e-12 ? 0 : x; }
  function n180(x) { x = n360(x); return x > 180 ? x - 360 : x; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function jdUT(iso, hUT) { var p = iso.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]) / 86400000 + 2440587.5 + hUT / 24; }
  /** Sol: declinação, ascensão reta, equação do tempo (min), semidiâmetro e paralaxe horizontal (′). */
  function sol(jd) {
    var n = jd - 2451545.0;
    var L = n360(280.460 + 0.9856474 * n), g = n360(357.528 + 0.9856003 * n);
    var lam = L + 1.915 * Math.sin(g * RAD) + 0.020 * Math.sin(2 * g * RAD);
    var eps = 23.439 - 0.0000004 * n;
    var dec = Math.asin(Math.sin(eps * RAD) * Math.sin(lam * RAD)) / RAD;
    var ar = n360(Math.atan2(Math.cos(eps * RAD) * Math.sin(lam * RAD), Math.cos(lam * RAD)) / RAD);
    var r = 1.00014 - 0.01671 * Math.cos(g * RAD) - 0.00014 * Math.cos(2 * g * RAD);
    return { dec: dec, ar: ar, eqt: n180(L - ar) * 4, sd: 959.63 / r / 60, ph: 8.794 / r / 60 };
  }
  function tsmg(jd) { return n360((18.697374558 + 24.06570982441908 * (jd - 2451545.0)) * 15); }
  function solEm(iso, hUT) { var jd = jdUT(iso, hUT), s = sol(jd); s.ahg = n360(tsmg(jd) - s.ar); s.ahgAries = tsmg(jd); return s; }
  function precessar(ar, dec, jd) {
    var T = (jd - 2451545) / 36525, s = 1 / 3600;
    var ze = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T * T * T) * s;
    var z = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T * T * T) * s;
    var th = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T * T * T) * s;
    var A = Math.cos(dec * RAD) * Math.sin((ar + ze) * RAD);
    var B = Math.cos(th * RAD) * Math.cos(dec * RAD) * Math.cos((ar + ze) * RAD) - Math.sin(th * RAD) * Math.sin(dec * RAD);
    var C = Math.sin(th * RAD) * Math.cos(dec * RAD) * Math.cos((ar + ze) * RAD) + Math.cos(th * RAD) * Math.sin(dec * RAD);
    return { ar: n360(Math.atan2(A, B) / RAD + z), dec: Math.asin(clamp(C, -1, 1)) / RAD };
  }
  /** AHL a partir do AHG e da longitude (E positiva, W negativa). */
  function ahlDe(ahg, lon) { return n360(ahg + lon); }
  /** Altura calculada e azimute (Z do Norte, regra AHL < 180° → Az = 360° − Z). */
  function hcAz(phi, dec, ahl) {
    var sf = Math.sin(phi * RAD), cf = Math.cos(phi * RAD), sd = Math.sin(dec * RAD), cd = Math.cos(dec * RAD);
    var sh = clamp(sf * sd + cf * cd * Math.cos(ahl * RAD), -1, 1), hc = Math.asin(sh) / RAD;
    var den = cf * Math.cos(hc * RAD);
    var cz = Math.abs(den) < 1e-12 ? 1 : clamp((sd - sf * sh) / den, -1, 1), Z = Math.acos(cz) / RAD;
    var oeste = n360(ahl) < 180 && n360(ahl) > 0;
    return { hc: hc, Z: Z, az: n360(oeste ? 360 - Z : Z), sh: sh, cz: cz, oeste: oeste, sf: sf, cf: cf, sd: sd, cd: cd, cahl: Math.cos(ahl * RAD) };
  }
  function dip(hm) { return 1.76 * Math.sqrt(Math.max(0, hm)); }
  /** Refração de Bennett, em minutos de arco, para altura aparente em graus (condições padrão: 10 °C, 1010 hPa). */
  function refr(ha) { var x = Math.max(ha, -0.9); return 1 / Math.tan((x + 7.31 / (x + 4.4)) * RAD); }
  /** Correção da altura instrumental: ai (graus), ei (′, com sinal), elevação do olho (m), SD e PH (′), limbo. */
  function corrigir(ai, ei, hm, sd, ph, limbo) {
    var ao = ai + ei / 60, dp = dip(hm), aa = ao - dp / 60, R = refr(aa), P = ph * Math.cos(aa * RAD);
    var s = limbo === 'sup' ? -sd : sd;
    return { ai: ai, ei: ei, ao: ao, dp: dp, aa: aa, R: R, SD: s, P: P, av: aa + (-R + s + P) / 60 };
  }
  /** Inverso de corrigir(): que ai dá esta av? */
  function inverter(av, ei, hm, sd, ph, limbo) {
    var s = limbo === 'sup' ? -sd : sd, aa = av;
    for (var i = 0; i < 40; i++) aa = av - (-refr(aa) + s + ph * Math.cos(aa * RAD)) / 60;
    return aa + dip(hm) / 60 - ei / 60;
  }
  /** Posição observada por mínimos quadrados: retas n·p = Δa (p em milhas, x para E, y para N). */
  function posicaoObservada(retas) {
    var a = 0, b = 0, c = 0, d = 0, e = 0;
    retas.forEach(function (r) {
      var nx = Math.sin(r.az * RAD), ny = Math.cos(r.az * RAD);
      a += nx * nx; b += nx * ny; c += ny * ny; d += nx * r.da; e += ny * r.da;
    });
    var det = a * c - b * b;
    if (retas.length < 2 || Math.abs(det) < 1e-6) return null;
    return { x: (d * c - b * e) / det, y: (a * e - b * d) / det };
  }
  function intersecao(r1, r2) { return posicaoObservada([r1, r2]); }
  function milhasParaLatLon(pe, x, y) {
    var lat = pe.lat + y / 60, latm = (pe.lat + lat) / 2;
    return { lat: lat, lon: n180(pe.lon + x / (60 * Math.cos(latm * RAD))) };
  }
  /* letras dos fusos (sinal brasileiro: HMG = HLeg + fuso; fuso +3 = UTC−3 = P) */
  var LETRAS_W = 'NOPQRSTUVWXY', LETRAS_E = 'ABCDEFGHIKLM';
  function letraFuso(f) { if (f === 0) return 'Z'; return f > 0 ? LETRAS_W[f - 1] : LETRAS_E[-f - 1]; }
  function fusoTeorico(lon) { return clamp(Math.round(-lon / 15), -12, 12); }

  /* Estrelas de navegação: AR (h m s) e Dec (° ′ ″) J2000, Hipparcos. */
  var ESTRELAS = [
    ['Sirius', [6, 45, 8.92], [-16, 42, 58.0]], ['Canopus', [6, 23, 57.11], [-52, 41, 44.4]],
    ['Rigil Kentaurus', [14, 39, 36.49], [-60, 50, 2.4]], ['Arcturus', [14, 15, 39.67], [19, 10, 56.7]],
    ['Vega', [18, 36, 56.34], [38, 47, 1.3]], ['Capella', [5, 16, 41.36], [45, 59, 52.8]],
    ['Rigel', [5, 14, 32.27], [-8, 12, 5.9]], ['Procyon', [7, 39, 18.12], [5, 13, 30.0]],
    ['Achernar', [1, 37, 42.85], [-57, 14, 12.3]], ['Betelgeuse', [5, 55, 10.31], [7, 24, 25.4]],
    ['Hadar', [14, 3, 49.41], [-60, 22, 22.9]], ['Altair', [19, 50, 46.99], [8, 52, 6.0]],
    ['Acrux', [12, 26, 35.90], [-63, 5, 56.7]], ['Aldebaran', [4, 35, 55.24], [16, 30, 33.5]],
    ['Antares', [16, 29, 24.46], [-26, 25, 55.2]], ['Spica', [13, 25, 11.58], [-11, 9, 40.8]],
    ['Pollux', [7, 45, 18.95], [28, 1, 34.3]], ['Fomalhaut', [22, 57, 39.05], [-29, 37, 20.1]],
    ['Deneb', [20, 41, 25.92], [45, 16, 49.2]], ['Regulus', [10, 8, 22.31], [11, 58, 2.0]],
    ['Peacock', [20, 25, 38.86], [-56, 44, 6.3]], ['Nunki', [18, 55, 15.93], [-26, 17, 48.2]],
  ].map(function (e) {
    var sg = e[2][0] < 0 ? -1 : 1;
    return { nome: e[0], ar: (e[1][0] + e[1][1] / 60 + e[1][2] / 3600) * 15, dec: sg * (Math.abs(e[2][0]) + e[2][1] / 60 + e[2][2] / 3600) };
  });

  function rng(seed) {
    var s = seed >>> 0;
    return function () { s += 0x6D2B79F5; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function r1(x) { return Math.round(x * 600) / 600; }      // arredonda graus ao décimo de minuto
  function dataMais(iso, dias) { var p = iso.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2] + dias)).toISOString().slice(0, 10); }

  /** Cenário de reta de altura: crepúsculo, três estrelas bem espalhadas em azimute, PE perto da posição verdadeira. */
  function cenarioReta(seed) {
    var R = rng(seed);
    for (var tent = 0; tent < 40; tent++) {
      var data = dataMais('2026-01-01', Math.floor(R() * 365));
      var lat = -34 + R() * 37, lon = -(29 + R() * 20);
      var manha = R() < 0.35, ut = null, passo = 2 / 60;
      for (var k = 0; k < 150; k++) {
        var hl = manha ? 7 - k * passo : 17 + k * passo;
        var u = hl - lon / 15;
        var s = solEm(data, u), a = hcAz(lat, s.dec, ahlDe(s.ahg, lon)).hc;
        if (manha ? a <= -9 : a <= -8.5) { ut = u; break; }
      }
      if (ut == null) continue;
      ut = Math.round(ut * 3600) / 3600;
      var dUT = data; if (ut >= 24) { ut -= 24; dUT = dataMais(data, 1); } else if (ut < 0) { ut += 24; dUT = dataMais(data, -1); }
      var jd = jdUT(dUT, ut), gst = tsmg(jd);
      var vis = ESTRELAS.map(function (e) {
        var p = precessar(e.ar, e.dec, jd), ahg = r1(n360(gst - p.ar)), dec = r1(p.dec);
        var c = hcAz(lat, dec, ahlDe(ahg, lon));
        return { nome: e.nome, ahg: ahg, dec: dec, a: c.hc, az: c.az };
      }).filter(function (e) { return e.a >= 18 && e.a <= 72; });
      if (vis.length < 3) continue;
      var melhor = null, nota = -1;
      for (var i = 0; i < vis.length; i++) for (var j = i + 1; j < vis.length; j++) for (var m = j + 1; m < vis.length; m++) {
        var t = [vis[i], vis[j], vis[m]], mn = 99;
        [[0, 1], [0, 2], [1, 2]].forEach(function (pr) { var d = Math.abs(n180(t[pr[0]].az - t[pr[1]].az)); mn = Math.min(mn, Math.min(d, 180 - d)); });
        if (mn > nota + 0.5 * R()) { nota = mn; melhor = t; }
      }
      if (nota < 35) continue;
      var dist = 4 + R() * 9, rumo = R() * 360;
      var pe = { lat: Math.round((lat + dist * Math.cos(rumo * RAD) / 60) * 60) / 60, lon: 0 };
      pe.lon = Math.round((lon + dist * Math.sin(rumo * RAD) / (60 * Math.cos(lat * RAD))) * 60) / 60;
      return {
        data: dUT, hmg: ut, manha: manha, pe: pe, verdade: { lat: lat, lon: lon },
        retas: melhor.sort(function (a, b) { return a.az - b.az; }).map(function (e) {
          return { nome: e.nome, ahg: e.ahg, dec: e.dec, ho: r1(hcAz(lat, e.dec, ahlDe(e.ahg, lon)).hc) };
        }),
      };
    }
    return null;
  }

  /** Extrato do almanaque simulado do Sol para um dia (valores arredondados como no almanaque). */
  function almanaqueSol(iso) {
    var s12 = solEm(iso, 12);
    var mp = 12 - s12.eqt / 60;
    var horas = [];
    for (var hh = 0; hh <= 24; hh++) { var s = solEm(iso, hh); horas.push({ h: hh, ahg: r1(s.ahg), dec: r1(s.dec) }); }
    return { data: iso, mpHML: Math.round(mp * 60) / 60, eqt: s12.eqt, sd: Math.round(s12.sd * 10) / 10, ph: 0.15, horas: horas };
  }
  /** Interpolação "de almanaque": AHG(hh) + 15°/h × fração; δ(hh) + d × fração. */
  function interpolarSol(alm, hUT) {
    var hh = Math.floor(hUT + 1e-9), f = hUT - hh;
    hh = clamp(hh, 0, 23);
    var a = alm.horas[hh], b = alm.horas[hh + 1];
    var acres = 15 * f;
    var d = b.dec - a.dec;
    return { hh: hh, f: f, ahgH: a.ahg, acres: acres, ahg: r1(n360(a.ahg + acres)), decH: a.dec, d: d, corrD: d * f, dec: r1(a.dec + d * f) };
  }

  /** Cenário do Capitão-Amador: passagem meridiana do Sol com PE, ei, elevação do olho e ai. */
  function cenarioMeridiana(seed) {
    var R = rng(seed);
    for (var tent = 0; tent < 40; tent++) {
      var data = dataMais('2026-01-01', Math.floor(R() * 365));
      var pe = { lat: Math.round((-33 + R() * 36) * 60) / 60, lon: -Math.round((30 + R() * 19) * 60) / 60 };
      var alm = almanaqueSol(data);
      var dist = 3 + R() * 9, rumo = R() * 360;
      var vd = { lat: pe.lat + dist * Math.cos(rumo * RAD) / 60, lon: pe.lon + dist * Math.sin(rumo * RAD) / (60 * Math.cos(pe.lat * RAD)) };
      /* instante verdadeiro da culminação: AHG = longitude W */
      var t = alm.mpHML - vd.lon / 15;
      for (var it = 0; it < 6; it++) { var s = solEm(data, t); t += n180(-vd.lon - s.ahg) / 15; }
      t = Math.round(t * 3600) / 3600;
      if (t < 0.2 || t > 23.8) continue;
      var ip = interpolarSol(alm, t);
      var z = Math.abs(vd.lat - ip.dec);
      if (z < 6 || z > 75) continue;
      var ei = Math.round((R() * 4 - 2) * 10) / 10;
      var hm = Math.round((1.8 + R() * 3.4) * 10) / 10;
      var avVerd = 90 - z;
      var ai = r1(inverter(avVerd, ei, hm, alm.sd, alm.ph, 'inf'));
      return { data: data, pe: pe, verdade: vd, alm: alm, hmg: t, ei: ei, hm: hm, ai: ai, fuso: fusoTeorico(pe.lon) };
    }
    return null;
  }
  /** Resolução "do navegante" do cenário (o gabarito usa os mesmos passos que o aluno). */
  function resolverMeridiana(c) {
    var lt = -c.pe.lon / 15;                               // longitude em tempo (W positiva), horas
    var hmgPrev = c.alm.mpHML + lt;
    var hlegPrev = Math.round((hmgPrev - c.fuso) * 60) / 60;
    var ip = interpolarSol(c.alm, c.hmg);
    var cor = corrigir(c.ai, c.ei, c.hm, c.alm.sd, c.alm.ph, 'inf');
    var av = r1(cor.av), z = 90 - av;
    var aoNorte = ip.dec > c.pe.lat;                       // Sol ao norte do observador
    var lat = aoNorte ? ip.dec - z : ip.dec + z;
    var lon = ip.ahg <= 180 ? -ip.ahg : 360 - ip.ahg;
    return { lt: lt, hmgPrev: hmgPrev, hlegPrev: n360(hlegPrev * 15) / 15, ip: ip, cor: cor, av: av, z: z, aoNorte: aoNorte, lat: lat, lon: lon, az: aoNorte ? 0 : 180 };
  }

  VL.navAstro = {
    n360: n360, n180: n180, jdUT: jdUT, sol: sol, solEm: solEm, tsmg: tsmg, precessar: precessar, ahlDe: ahlDe, hcAz: hcAz,
    dip: dip, refr: refr, corrigir: corrigir, inverter: inverter, posicaoObservada: posicaoObservada,
    milhasParaLatLon: milhasParaLatLon, letraFuso: letraFuso, fusoTeorico: fusoTeorico, almanaqueSol: almanaqueSol,
    interpolarSol: interpolarSol, cenarioReta: cenarioReta, cenarioMeridiana: cenarioMeridiana, resolverMeridiana: resolverMeridiana,
  };
  if (!VL.widgets || !VL.h) return;   /* uso em node (testes) */

  /* =====================================================================================
     2. Formatação PT-BR
     ===================================================================================== */
  function num(x, c) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(c).replace('.', ','); }
  /** 34° 05,6′ (pad3 → 034°) */
  function gm(x, c, pad3) {
    c = c == null ? 1 : c;
    var neg = x < 0; x = Math.abs(x);
    var d = Math.floor(x + 1e-12), m = (x - d) * 60, mr = Number(m.toFixed(c));
    if (mr >= 60) { d += 1; mr = 0; }
    var ds = pad3 ? String(d).padStart(3, '0') : String(d);
    return (neg ? '−' : '') + ds + '° ' + (mr < 10 ? '0' : '') + mr.toFixed(c).replace('.', ',') + '′';
  }
  function fLat(v) { return gm(Math.abs(v)) + ' ' + (v >= 0 ? 'N' : 'S'); }
  function fLon(v) { return gm(Math.abs(v), 1, true) + ' ' + (v >= 0 ? 'E' : 'W'); }
  function fDec(v) { return gm(Math.abs(v)) + ' ' + (v >= 0 ? 'N' : 'S'); }
  function fAz(v) { var r = Math.round(n360(v) * 10) / 10; if (r >= 360) r = 0; return r.toFixed(1).replace('.', ',').padStart(5, '0') + '°'; }
  function fMin(v, c) { return num(v, c == null ? 1 : c) + '′'; }
  function fMinS(v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',') + '′'; }
  function fHMS(hh) {
    hh = ((hh % 24) + 24) % 24; var t = Math.round(hh * 3600) % 86400;
    return String(Math.floor(t / 3600)).padStart(2, '0') + 'h ' + String(Math.floor(t % 3600 / 60)).padStart(2, '0') + 'm ' + String(t % 60).padStart(2, '0') + 's';
  }
  function fHM(hh) { hh = ((hh % 24) + 24) % 24; var t = Math.round(hh * 60) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + 'h ' + String(t % 60).padStart(2, '0') + 'm'; }
  function fTempoDur(hh) { var neg = hh < 0; hh = Math.abs(hh); var t = Math.round(hh * 3600); return (neg ? '−' : '') + Math.floor(t / 3600) + 'h ' + String(Math.floor(t % 3600 / 60)).padStart(2, '0') + 'm ' + String(t % 60).padStart(2, '0') + 's'; }
  function fData(iso) { return iso.split('-').reverse().join('/'); }
  function fFuso(f) { return (f > 0 ? '+' : f < 0 ? '−' : '') + Math.abs(f) + ' (' + letraFuso(f) + ')'; }
  function parseNum(s) {
    s = String(s == null ? '' : s).trim().replace(/\s/g, '').replace('−', '-').replace(',', '.');
    if (!/^[-+]?\d*\.?\d+$/.test(s)) return NaN;
    return Number(s);
  }

  /* =====================================================================================
     3. Componentes de formulário
     ===================================================================================== */
  /** Campo de ângulo: graus, minutos (décimos) e hemisfério opcional. get() devolve graus com sinal (S/W negativos). */
  function campoAng(o) {
    var hem = o.hem || null;
    var g = h('input', { type: 'text', inputmode: 'numeric', class: 'ra-in ra-in-g', 'aria-label': o.rotulo + ': graus', autocomplete: 'off' });
    var m = h('input', { type: 'text', inputmode: 'decimal', class: 'ra-in ra-in-m', 'aria-label': o.rotulo + ': minutos', autocomplete: 'off' });
    var sel = null;
    if (hem) { sel = h('select', { class: 'ra-sel ra-hem', 'aria-label': o.rotulo + ': ' + (hem[0] === 'N' ? 'Norte ou Sul' : 'Leste ou Oeste') }); hem.forEach(function (x) { sel.appendChild(h('option', { value: x }, x)); }); }
    var erro = h('p', { class: 'ra-erro-campo', 'aria-live': 'polite' });
    var fs = h('fieldset', { class: 'ra-campo' + (o.classe ? ' ' + o.classe : '') },
      h('legend', null, o.rotulo),
      h('div', { class: 'ra-ang' }, g, h('span', { class: 'ra-un' }, '°'), m, h('span', { class: 'ra-un' }, '′'), sel),
      o.dica ? h('p', { class: 'ra-dica' }, o.dica) : null, erro);
    var api = {
      el: fs,
      get: function () {
        var gv = parseNum(g.value), mv = m.value.trim() === '' ? 0 : parseNum(m.value);
        var ok = isFinite(gv) && gv >= 0 && Math.floor(gv) === gv && gv <= (o.max || 360) && isFinite(mv) && mv >= 0 && mv < 60;
        g.setAttribute('aria-invalid', String(!(isFinite(gv) && gv >= 0 && gv <= (o.max || 360) && Math.floor(gv) === gv)));
        m.setAttribute('aria-invalid', String(!(isFinite(mv) && mv >= 0 && mv < 60)));
        if (!ok) { erro.textContent = 'Use graus inteiros (0 a ' + (o.max || 360) + ') e minutos de 0 a 59,9.'; return NaN; }
        var v = gv + mv / 60;
        if (v > (o.max || 360) + 1e-9) { erro.textContent = 'Valor acima de ' + (o.max || 360) + '°.'; return NaN; }
        erro.textContent = '';
        if (sel && (sel.value === 'S' || sel.value === 'W')) v = -v;
        return v;
      },
      set: function (v) {
        if (v == null || !isFinite(v)) { g.value = ''; m.value = ''; return; }
        var neg = v < 0, a = Math.abs(v), d = Math.floor(a + 1e-12), mi = Math.round((a - d) * 600) / 10;
        if (mi >= 60) { d += 1; mi = 0; }
        g.value = String(d); m.value = mi.toFixed(1).replace('.', ',');
        if (sel) sel.value = hem[neg ? 1 : 0];
        g.removeAttribute('aria-invalid'); m.removeAttribute('aria-invalid'); erro.textContent = '';
      },
      limpar: function () { g.value = ''; m.value = ''; if (sel) sel.selectedIndex = 0; erro.textContent = ''; },
      on: function (fn) { [g, m, sel].forEach(function (x) { if (x) { x.addEventListener('input', fn); x.addEventListener('change', fn); } }); },
      focar: function () { g.focus(); },
      inputs: [g, m, sel],
    };
    return api;
  }
  /** Campo de hora: h m s (s opcional). get() em horas decimais. */
  function campoHora(o) {
    var hh = h('input', { type: 'text', inputmode: 'numeric', class: 'ra-in ra-in-h', 'aria-label': o.rotulo + ': horas', autocomplete: 'off' });
    var mm = h('input', { type: 'text', inputmode: 'numeric', class: 'ra-in ra-in-h', 'aria-label': o.rotulo + ': minutos', autocomplete: 'off' });
    var ss = o.semSeg ? null : h('input', { type: 'text', inputmode: 'numeric', class: 'ra-in ra-in-h', 'aria-label': o.rotulo + ': segundos', autocomplete: 'off' });
    var erro = h('p', { class: 'ra-erro-campo', 'aria-live': 'polite' });
    var fs = h('fieldset', { class: 'ra-campo' },
      h('legend', null, o.rotulo),
      h('div', { class: 'ra-ang' }, hh, h('span', { class: 'ra-un' }, 'h'), mm, h('span', { class: 'ra-un' }, 'm'), ss, ss ? h('span', { class: 'ra-un' }, 's') : null),
      o.dica ? h('p', { class: 'ra-dica' }, o.dica) : null, erro);
    return {
      el: fs,
      get: function () {
        var a = parseNum(hh.value), b = mm.value.trim() === '' ? 0 : parseNum(mm.value), c = !ss || ss.value.trim() === '' ? 0 : parseNum(ss.value);
        var ok = isFinite(a) && a >= 0 && a < 24 && isFinite(b) && b >= 0 && b < 60 && isFinite(c) && c >= 0 && c < 60;
        erro.textContent = ok ? '' : (ss ? 'Use horas de 0 a 23, minutos e segundos de 0 a 59.' : 'Use horas de 0 a 23 e minutos de 0 a 59.');
        hh.setAttribute('aria-invalid', String(!(isFinite(a) && a >= 0 && a < 24)));
        mm.setAttribute('aria-invalid', String(!(isFinite(b) && b >= 0 && b < 60)));
        if (ss) ss.setAttribute('aria-invalid', String(!(isFinite(c) && c >= 0 && c < 60)));
        return ok ? a + b / 60 + c / 3600 : NaN;
      },
      set: function (v) {
        if (v == null || !isFinite(v)) { hh.value = mm.value = ''; if (ss) ss.value = ''; return; }
        v = ((v % 24) + 24) % 24;
        var t = ss ? Math.round(v * 3600) % 86400 : (Math.round(v * 60) % 1440) * 60;
        hh.value = String(Math.floor(t / 3600)); mm.value = String(Math.floor(t % 3600 / 60)).padStart(2, '0'); if (ss) ss.value = String(t % 60).padStart(2, '0');
        erro.textContent = ''; [hh, mm, ss].forEach(function (x) { if (x) x.removeAttribute('aria-invalid'); });
      },
      limpar: function () { hh.value = mm.value = ''; if (ss) ss.value = ''; erro.textContent = ''; },
      on: function (fn) { [hh, mm, ss].forEach(function (x) { if (x) { x.addEventListener('input', fn); } }); },
    };
  }
  function campoNum(o) {
    var i = h('input', { type: 'text', inputmode: 'decimal', class: 'ra-in ra-in-n', 'aria-label': o.rotulo, autocomplete: 'off' });
    var erro = h('p', { class: 'ra-erro-campo', 'aria-live': 'polite' });
    var lab = h('label', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, o.rotulo), h('span', { class: 'ra-ang' }, i, o.un ? h('span', { class: 'ra-un' }, o.un) : null), o.dica ? h('span', { class: 'ra-dica' }, o.dica) : null, erro);
    return {
      el: lab,
      get: function () { var v = parseNum(i.value); var ok = isFinite(v) && (o.min == null || v >= o.min) && (o.max == null || v <= o.max); i.setAttribute('aria-invalid', String(!ok)); erro.textContent = ok ? '' : (o.msg || 'Número inválido.'); return ok ? v : NaN; },
      set: function (v) { i.value = v == null || !isFinite(v) ? '' : (o.sinal && v > 0 ? '+' : '') + num(v, o.casas == null ? 1 : o.casas); i.removeAttribute('aria-invalid'); erro.textContent = ''; },
      limpar: function () { i.value = ''; erro.textContent = ''; },
      on: function (fn) { i.addEventListener('input', fn); },
    };
  }
  function segmentado(rotulo, itens, valor, aoMudar) {
    var seg = h('div', { class: 'segmented ra-seg', role: 'group', 'aria-label': rotulo });
    var api = { el: seg, valor: valor, set: function (v) { api.valor = v; VL.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); } };
    itens.forEach(function (it) { seg.appendChild(h('button', { type: 'button', 'data-v': it[0], 'aria-pressed': String(it[0] === valor), onclick: function () { api.set(it[0]); if (aoMudar) aoMudar(it[0]); } }, it[1])); });
    return api;
  }
  /** Um passo do passo a passo: título, linhas (strings ou nós) e resultado em destaque. */
  function passo(n, titulo, linhas, res, nota) {
    return h('li', { class: 'ra-passo' },
      h('p', { class: 'ra-passo-t' }, h('span', { class: 'ra-passo-n' }, String(n)), titulo),
      (linhas || []).map(function (l) { return h('p', { class: 'ra-form' }, l); }),
      res ? h('p', { class: 'ra-res' }, res) : null,
      nota ? h('p', { class: 'ra-passo-nota' }, nota) : null);
  }
  function caixaFb(ok, titulo, corpo) {
    return h('div', { class: 'explicacao ra-fb' }, h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, titulo), corpo);
  }

  /* =====================================================================================
     4. Folha de plotagem (SVG)
     ===================================================================================== */
  var contadorFolha = 0;
  function Folha(aoTocar) {
    var W = 360, H = 360, M = 30, FAIXA = 26;
    var id = 'ra-clip-' + (++contadorFolha) + '-' + Math.floor(Math.random() * 1e6);
    var svg = h('svg', { viewBox: '0 0 ' + W + ' ' + (H + FAIXA), class: 'svg-interativo ra-folha', role: 'img', 'aria-label': 'Folha de plotagem' });
    var zoom = 1, dados = null;
    svg.addEventListener('click', function (ev) {
      if (!aoTocar || !dados || !dados.esc) return;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var ctm = svg.getScreenCTM(); if (!ctm) return;
      var p = pt.matrixTransform(ctm.inverse());
      aoTocar({ x: (p.x - W / 2) / dados.esc + dados.vc.x, y: -(p.y - H / 2) / dados.esc + dados.vc.y });
    });
    function ponto(x, y) { return [W / 2 + (x - dados.vc.x) * dados.esc, H / 2 - (y - dados.vc.y) * dados.esc]; }
    function linha(x1, y1, x2, y2, cls) { var a = ponto(x1, y1), b = ponto(x2, y2); return h('line', { x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1), class: cls }); }
    function texto(x, y, t, cls, anc) { var n = h('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': anc || 'start' }); n.textContent = t; return n; }
    function limites(p0, dp, lo, hi) {
      if (Math.abs(dp) < 1e-9) return p0 >= lo && p0 <= hi ? [-1e9, 1e9] : [1, -1];
      var s1 = (lo - p0) / dp, s2 = (hi - p0) / dp;
      return [Math.min(s1, s2), Math.max(s1, s2)];
    }
    function rotLat(v) { var a = Math.abs(v), d = Math.floor(a + 1e-9), m = Math.round((a - d) * 60); if (m === 60) { d++; m = 0; } return d + '°' + String(m).padStart(2, '0') + '′' + (v >= 0 ? 'N' : 'S'); }
    function rotLon(v) { var a = Math.abs(v), d = Math.floor(a + 1e-9), m = Math.round((a - d) * 60); if (m === 60) { d++; m = 0; } return d + '°' + String(m).padStart(2, '0') + '′' + (v >= 0 ? 'E' : 'W'); }
    function desenhar(d) {
      dados = d;
      svg.innerHTML = '';
      var pe = d.pe;
      var maxD = 4;
      d.retas.forEach(function (r) { maxD = Math.max(maxD, Math.abs(r.da)); });
      if (d.fix) maxD = Math.max(maxD, Math.hypot(d.fix.x, d.fix.y));
      if (d.marca) maxD = Math.max(maxD, Math.hypot(d.marca.x, d.marca.y));
      var Rv = Math.max(6, maxD * 1.45) / zoom;
      d.vc = d.fix && zoom > 1 ? { x: d.fix.x, y: d.fix.y } : d.fix ? { x: d.fix.x / 2, y: d.fix.y / 2 } : { x: 0, y: 0 };
      d.esc = (W / 2 - M) / Rv;
      d.Rv = Rv;
      var cosf = Math.cos(pe.lat * RAD);
      /* clip */
      var defs = h('defs', null, h('clipPath', { id: id }, h('rect', { x: 0, y: 0, width: W, height: H })));
      svg.appendChild(defs);
      svg.appendChild(h('rect', { x: 0, y: 0, width: W, height: H, class: 'ra-f-fundo' }));
      var g = h('g', { 'clip-path': 'url(#' + id + ')' });
      svg.appendChild(g);
      /* grade */
      var passos = [0.5, 1, 2, 5, 10, 15, 20, 30, 60], st = 60;
      for (var i = 0; i < passos.length; i++) { if (2 * Rv / passos[i] <= 9) { st = passos[i]; break; } }
      var vx0 = d.vc.x - (W / 2) / d.esc, vx1 = d.vc.x + (W / 2) / d.esc, vy0 = d.vc.y - (H / 2) / d.esc, vy1 = d.vc.y + (H / 2) / d.esc;
      var latMin = (pe.lat + vy0 / 60) * 60, latMax = (pe.lat + vy1 / 60) * 60;
      for (var la = Math.ceil(latMin / st) * st; la <= latMax; la += st) {
        var y = (la / 60 - pe.lat) * 60;
        g.appendChild(linha(vx0, y, vx1, y, 'ra-f-grade'));
        var py = ponto(0, y)[1];
        if (py > 12 && py < H - 22) g.appendChild(texto(4, py - 3, rotLat(la / 60), 'ra-f-rot'));
      }
      var lonMin = (pe.lon + vx0 / (60 * cosf)) * 60, lonMax = (pe.lon + vx1 / (60 * cosf)) * 60;
      var stl = st;
      while ((lonMax - lonMin) / stl > 7) { var ix = passos.indexOf(stl); stl = ix >= 0 && ix < passos.length - 1 ? passos[ix + 1] : stl * 2; }
      for (var lo = Math.ceil(lonMin / stl) * stl; lo <= lonMax; lo += stl) {
        var x = (lo / 60 - pe.lon) * 60 * cosf;
        g.appendChild(linha(x, vy0, x, vy1, 'ra-f-grade'));
        var px = ponto(x, 0)[0];
        if (px > 30 && px < W - 30) g.appendChild(texto(px, H - 5, rotLon(lo / 60), 'ra-f-rot', 'middle'));
      }
      /* rosa simples em volta da PE */
      var rr = Rv * 0.78;
      var c0 = ponto(0, 0);
      g.appendChild(h('circle', { cx: c0[0], cy: c0[1], r: (rr * d.esc).toFixed(1), class: 'ra-f-rosa' }));
      for (var az = 0; az < 360; az += 10) {
        var k = az % 90 === 0 ? 0.9 : az % 30 === 0 ? 0.94 : 0.97;
        g.appendChild(linha(rr * k * Math.sin(az * RAD), rr * k * Math.cos(az * RAD), rr * Math.sin(az * RAD), rr * Math.cos(az * RAD), 'ra-f-rosa-t'));
        if (az % 90 === 0) { var pl = ponto(rr * 1.08 * Math.sin(az * RAD), rr * 1.08 * Math.cos(az * RAD)); g.appendChild(texto(Math.max(pl[0], 66), pl[1] + 5, ['N', 'E', 'S', 'W'][az / 90], 'ra-f-card', 'middle')); }   /* 66: não cai sobre os rótulos de latitude da borda */
      }
      /* chapéu (3 retas) */
      if (d.retas.length === 3 && d.fix) {
        var pts = [];
        [[0, 1], [1, 2], [0, 2]].forEach(function (pr) { var q = intersecao(d.retas[pr[0]], d.retas[pr[1]]); if (q) pts.push(ponto(q.x, q.y)); });
        if (pts.length === 3) g.appendChild(h('polygon', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: 'ra-f-chapeu' }));
      }
      /* retas */
      d.retas.forEach(function (r, i) {
        var nx = Math.sin(r.az * RAD), ny = Math.cos(r.az * RAD), tx = ny, ty = -nx;
        var sel = i === d.sel;
        var L = Rv * 3;
        g.appendChild(linha(-nx * Rv * 0.95, -ny * Rv * 0.95, nx * Rv * 0.95, ny * Rv * 0.95, 'ra-f-az' + (sel ? ' ra-f-az-sel' : '')));
        /* seta para o astro */
        var pa = ponto(nx * Rv * 0.95, ny * Rv * 0.95), pb = ponto(nx * Rv * 0.83 + tx * Rv * 0.035, ny * Rv * 0.83 + ty * Rv * 0.035), pc = ponto(nx * Rv * 0.83 - tx * Rv * 0.035, ny * Rv * 0.83 - ty * Rv * 0.035);
        g.appendChild(h('polygon', { points: [pa, pb, pc].map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: 'ra-f-seta' + (sel ? ' ra-f-seta-sel' : '') }));
        var pn = ponto(nx * Rv * 0.99, ny * Rv * 0.99);
        var anc = nx > 0.3 ? 'end' : nx < -0.3 ? 'start' : 'middle';
        g.appendChild(texto(pn[0] + (anc === 'end' ? -4 : anc === 'start' ? 4 : 0), pn[1] + (ny > 0.3 ? 14 : ny < -0.3 ? -6 : 4), (r.nome || 'astro ' + (i + 1)), 'ra-f-astro' + (sel ? ' ra-f-astro-sel' : ''), anc));
        /* intercepto */
        if (Math.abs(r.da) > 0.01) g.appendChild(linha(0, 0, nx * r.da, ny * r.da, 'ra-f-int' + (sel ? ' ra-f-int-sel' : '')));
        var ix = nx * r.da, iy = ny * r.da;
        g.appendChild(linha(ix - tx * L, iy - ty * L, ix + tx * L, iy + ty * L, 'ra-f-lop' + (sel ? ' ra-f-lop-sel' : '')));
        var pi = ponto(ix, iy);
        g.appendChild(h('circle', { cx: pi[0].toFixed(1), cy: pi[1].toFixed(1), r: 2.6, class: 'ra-f-ipt' }));
        /* número da reta perto de uma das pontas visíveis (alterna as pontas para não amontoar) */
        var pa0 = ponto(ix, iy), pb0 = ponto(ix + tx, iy + ty), dx = pb0[0] - pa0[0], dy = pb0[1] - pa0[1];
        var lx = limites(pa0[0], dx, 16, W - 16), ly = limites(pa0[1], dy, 16, H - 34);
        var smin = Math.max(lx[0], ly[0]), smax = Math.min(lx[1], ly[1]);
        var pr1 = smin <= smax ? (i % 2 === 0 ? [pa0[0] + dx * smax, pa0[1] + dy * smax] : [pa0[0] + dx * smin, pa0[1] + dy * smin]) : pa0;
        g.appendChild(h('circle', { cx: pr1[0].toFixed(1), cy: pr1[1].toFixed(1), r: 11.5, class: 'ra-f-num-c' + (sel ? ' ra-f-num-sel' : '') }));
        g.appendChild(texto(pr1[0], pr1[1] + 5, String(i + 1), 'ra-f-num' + (sel ? ' ra-f-num-tsel' : ''), 'middle'));
      });
      /* PE (quadrado) */
      g.appendChild(h('rect', { x: (c0[0] - 5).toFixed(1), y: (c0[1] - 5).toFixed(1), width: 10, height: 10, class: 'ra-f-pe' }));
      g.appendChild(h('circle', { cx: c0[0], cy: c0[1], r: 1.6, class: 'ra-f-pe-c' }));
      g.appendChild(texto(c0[0] + 8, c0[1] + 16, 'PE', 'ra-f-pe-t'));
      if (d.fix && d.mostrarFix !== false) {
        var pf = ponto(d.fix.x, d.fix.y);
        g.appendChild(h('circle', { cx: pf[0].toFixed(1), cy: pf[1].toFixed(1), r: 6.5, class: 'ra-f-po' }));
        g.appendChild(h('circle', { cx: pf[0].toFixed(1), cy: pf[1].toFixed(1), r: 1.8, class: 'ra-f-po-c' }));
        g.appendChild(texto(pf[0] + 9, pf[1] - 8, 'PO', 'ra-f-po-t'));
      }
      if (d.marca) {
        var pm = ponto(d.marca.x, d.marca.y);
        g.appendChild(linha(d.marca.x - 4 / d.esc * 2, d.marca.y - 4 / d.esc * 2, d.marca.x + 4 / d.esc * 2, d.marca.y + 4 / d.esc * 2, 'ra-f-marca'));
        g.appendChild(linha(d.marca.x - 4 / d.esc * 2, d.marca.y + 4 / d.esc * 2, d.marca.x + 4 / d.esc * 2, d.marca.y - 4 / d.esc * 2, 'ra-f-marca'));
        g.appendChild(texto(pm[0] + 10, pm[1] + 14, 'você', 'ra-f-marca-t'));
      }
      /* escala */
      var esc = [1, 2, 5, 10, 20, 50].filter(function (v) { return v * d.esc <= 110; }).pop() || 1;
      svg.appendChild(h('rect', { x: 0, y: H, width: W, height: FAIXA, class: 'ra-f-faixa' }));
      svg.appendChild(h('line', { x1: 0, y1: H, x2: W, y2: H, class: 'ra-f-borda' }));
      var ex = 10, ey = H + 15;
      svg.appendChild(h('line', { x1: ex, y1: ey, x2: (ex + esc * d.esc).toFixed(1), y2: ey, class: 'ra-f-esc' }));
      [0, esc * d.esc].forEach(function (xx) { svg.appendChild(h('line', { x1: (ex + xx).toFixed(1), y1: ey - 4, x2: (ex + xx).toFixed(1), y2: ey + 4, class: 'ra-f-esc' })); });
      svg.appendChild(texto(ex + esc * d.esc + 8, ey + 4, esc + (esc === 1 ? ' milha' : ' milhas') + ' (1′ de latitude = 1 milha)', 'ra-f-rot'));
      var resumo = 'Folha de plotagem centrada na posição estimada ' + fLat(pe.lat) + ', ' + fLon(pe.lon) + '. ' +
        d.retas.map(function (r, i) { return 'Reta ' + (i + 1) + (r.nome ? ' (' + r.nome + ')' : '') + ': azimute ' + fAz(r.az) + ', Δa ' + fMinS(r.da) + '.'; }).join(' ');
      svg.setAttribute('aria-label', resumo);
    }
    return {
      el: svg,
      desenhar: desenhar,
      zoom: function (f) { zoom = f === 0 ? 1 : clamp(zoom * f, 0.5, 8); if (dados) desenhar(dados); },
      pxPorMilha: function () { return dados && dados.esc ? dados.esc * (svg.getBoundingClientRect().width || W) / W : 1; },
    };
  }

  /* Figura do plano do meridiano para a latitude meridiana */
  function figuraMeridiano(phi, dec, aoNorte, av) {
    var R = 100;
    var svg = h('svg', { viewBox: '-160 -136 320 164', class: 'svg-interativo ra-merid', role: 'img' });
    function P(p, r) { r = r || R; return [-Math.cos(p * RAD) * r, -Math.sin(p * RAD) * r]; }
    function arco(p1, p2, r, cls) {
      var a = P(p1, r), b = P(p2, r), grande = Math.abs(p2 - p1) > 180 ? 1 : 0, sw = p2 > p1 ? 1 : 0;
      return h('path', { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + grande + ' ' + sw + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), class: cls });
    }
    function t(x, y, s, cls, anc) { var n = h('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': anc || 'middle' }); n.textContent = s; return n; }
    var pSol = aoNorte ? av : 180 - av, pQ = 90 + phi, pZ = 90;
    svg.appendChild(h('path', { d: 'M-100 0 A100 100 0 0 1 100 0', class: 'ra-m-circ' }));
    svg.appendChild(h('line', { x1: -122, y1: 0, x2: 122, y2: 0, class: 'ra-m-horiz' }));
    svg.appendChild(t(-134, 4, 'N', 'ra-m-card')); svg.appendChild(t(134, 4, 'S', 'ra-m-card'));
    var rots = [{ p: 90, s: 'Zênite', cls: 'ra-m-rot' }];
    var z = P(pZ); svg.appendChild(h('circle', { cx: z[0], cy: z[1], r: 3, class: 'ra-m-pt' }));
    /* equador */
    if (pQ > 0 && pQ < 180) {
      var q = P(pQ), q2 = P(pQ + 180);
      svg.appendChild(h('line', { x1: q[0].toFixed(1), y1: q[1].toFixed(1), x2: (q2[0] * 0.2).toFixed(1), y2: (q2[1] * 0.2).toFixed(1), class: 'ra-m-eq' }));
      svg.appendChild(h('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 3, class: 'ra-m-eqpt' }));
      rots.push({ p: pQ, s: 'Equador', cls: 'ra-m-rot ra-m-rot-eq' });
    }
    /* polo elevado */
    var pp = phi >= 0 ? phi : 180 + phi, ppt = P(pp);
    svg.appendChild(h('line', { x1: 0, y1: 0, x2: ppt[0].toFixed(1), y2: ppt[1].toFixed(1), class: 'ra-m-eixo' }));
    rots.push({ p: pp, s: phi >= 0 ? 'PN' : 'PS', cls: 'ra-m-rot' });
    /* arcos */
    if (Math.abs(pSol - pZ) > 0.3) { svg.appendChild(arco(Math.min(pSol, pZ), Math.max(pSol, pZ), 84, 'ra-m-z')); var mz = P((pSol + pZ) / 2, 72); svg.appendChild(t(mz[0], mz[1] + 4, 'z', 'ra-m-tz')); }
    if (pQ > 0 && pQ < 180 && Math.abs(pSol - pQ) > 0.3) { svg.appendChild(arco(Math.min(pSol, pQ), Math.max(pSol, pQ), 93, 'ra-m-d')); var md = P((pSol + pQ) / 2, 60); svg.appendChild(t(md[0], md[1] + 4, 'δ', 'ra-m-td')); }
    if (pQ > 0 && pQ < 180 && Math.abs(pQ - pZ) > 0.3) { svg.appendChild(arco(Math.min(pQ, pZ), Math.max(pQ, pZ), 54, 'ra-m-f')); var mf = P((pQ + pZ) / 2, 40); svg.appendChild(t(mf[0], mf[1] + 4, 'φ', 'ra-m-tf')); }
    /* altura */
    svg.appendChild(arco(Math.min(pSol, aoNorte ? 0 : 180), Math.max(pSol, aoNorte ? 0 : 180), 30, 'ra-m-a'));
    var ma = P(aoNorte ? pSol / 2 : (pSol + 180) / 2, 20); svg.appendChild(t(ma[0], ma[1] + 4, 'av', 'ra-m-ta'));
    var s = P(pSol); svg.appendChild(h('line', { x1: 0, y1: 0, x2: s[0].toFixed(1), y2: s[1].toFixed(1), class: 'ra-m-raio' }));
    svg.appendChild(h('circle', { cx: s[0].toFixed(1), cy: s[1].toFixed(1), r: 7, class: 'ra-m-sol' }));
    rots.push({ p: pSol, s: 'Sol', cls: 'ra-m-rot ra-m-rot-sol' });
    /* afasta os rótulos externos uns dos outros (mínimo de 15° no arco) */
    rots.sort(function (a, b) { return a.p - b.p; });
    rots.forEach(function (r) { r.q = r.p; });
    for (var it = 0; it < 40; it++) {
      for (var i = 0; i < rots.length - 1; i++) {
        var gap = rots[i + 1].q - rots[i].q;
        if (gap < 15) { var e = (15 - gap) / 2; rots[i].q -= e; rots[i + 1].q += e; }
      }
      rots.forEach(function (r) { r.q = clamp(r.q, 9, 171); });
    }
    rots.forEach(function (r) {
      var pt = P(r.q, 120), anc = r.q < 70 ? 'end' : r.q > 110 ? 'start' : 'middle';
      if (Math.abs(r.q - r.p) > 3) { var a0 = P(r.p, 104), a1 = P(r.q, 113); svg.appendChild(h('line', { x1: a0[0].toFixed(1), y1: a0[1].toFixed(1), x2: a1[0].toFixed(1), y2: a1[1].toFixed(1), class: 'ra-m-guia' })); }
      svg.appendChild(t(pt[0], pt[1] + 4, r.s, r.cls, anc));
    });
    svg.appendChild(h('circle', { cx: 0, cy: 0, r: 3, class: 'ra-m-obs' }));
    svg.appendChild(t(0, 18, 'você', 'ra-m-voce'));
    svg.setAttribute('aria-label', 'Plano do meridiano: o Sol culmina ao ' + (aoNorte ? 'Norte' : 'Sul') + ' com altura ' + gm(av) + '; z é a distância zenital, δ a declinação e φ a latitude.');
    return svg;
  }

  /* =====================================================================================
     5. Widget
     ===================================================================================== */
  VL.widgets.define('reta-altura', {
    css: ['assets/css/widgets/reta-altura.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [];
      var intl = !!VL.settings.get('intl');
      var reduzMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function en(t) { return intl && t ? ' (' + t + ')' : ''; }
      var ABAS = [['reta', 'Reta de altura'], ['latitude', 'Latitude meridiana'], ['hora', 'Hora da meridiana']]
        .filter(function (a) { return !opts.abas || opts.abas.indexOf(a[0]) >= 0; });
      if (!ABAS.length) ABAS = [['reta', 'Reta de altura']];
      var st = {
        aba: ABAS.some(function (a) { return a[0] === opts.aba; }) ? opts.aba : ABAS[0][0],
        modo: opts.modo === 'exercicio' ? 'exercicio' : 'explorar',
      };
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Navegação astronômica: reta de altura e passagem meridiana', controlesAntes: true });
      el.appendChild(ins.raiz);
      var segAba = ABAS.length > 1 ? segmentado('Assunto', ABAS, st.aba, function (v) { st.aba = v; mostrar(); }) : null;
      var segModo = segmentado('Modo', [['explorar', 'Explorar'], ['exercicio', 'Exercício']], st.modo, function (v) { st.modo = v; mostrar(); });
      if (segAba) { segAba.el.classList.add('ra-abas'); ins.controles.appendChild(segAba.el); }
      ins.controles.appendChild(segModo.el);
      var aviso = h('p', { class: 'ra-aviso' },
        'Os dados de almanaque usados aqui são simulados e aproximados, só para treino. Na prova e no mar, use o Almanaque Náutico da DHN (fonte oficial).');
      ins.legenda.appendChild(h('span', { class: 'ra-fonte' }, 'Fórmulas: Miguens, Navegação: a Ciência e a Arte, vol. II (DHN); Bowditch, The American Practical Navigator (NGA Pub. 9). Programa do Capitão-Amador: NORMAM-211, Anexo 5-A, item 1.2 ',
        VL.ui.seloQ('a confirmar', 'Recorte do programa tirado da NORMAM-211 (Anexo 5-A, item 1.2: hora legal da passagem meridiana superior do Sol pelo processo aproximado e posição pela passagem meridiana), consultada pelo projeto em 2026-10-07. A norma muda: confirme a versão em vigor no site da DPC/Marinha.'), '.'));
      ins.corpo.appendChild(aviso);
      var paineis = {};
      function mostrar() {
        var chave = st.aba + '-' + st.modo;
        if (!paineis[chave]) { paineis[chave] = h('div', { class: 'ra-painel' }); ins.corpo.appendChild(paineis[chave]); CONSTRUIR[chave](paineis[chave]); }
        Object.keys(paineis).forEach(function (k) { paineis[k].hidden = k !== chave; });
      }

      /* ---------------------------------------------------------------- reta: explorar */
      function retaExplorar(box) {
        var cen = cenarioReta(2026) || { pe: { lat: -23.3, lon: -42.2 }, retas: [] };
        var retas = cen.retas.map(function (r) { return Object.assign({}, r); });
        var sel = 0;
        box.appendChild(h('p', { class: 'ra-intro' }, 'Cada estrela observada com o sextante dá uma reta de altura: uma linha onde o barco está. A partir da posição estimada (PE), calculamos a altura que o astro teria ali (Hc) e comparamos com a altura medida e corrigida (Ho). A diferença, em minutos de arco, é a distância em milhas até a reta.'));
        var grade = h('div', { class: 'ra-grade' });
        box.appendChild(grade);
        var col1 = h('div', { class: 'ra-col' }), col2 = h('div', { class: 'ra-col ra-col-folha' });
        grade.appendChild(col1); grade.appendChild(col2);
        var fLatPE = campoAng({ rotulo: 'Latitude (φ)', hem: ['N', 'S'], max: 89 });
        var fLonPE = campoAng({ rotulo: 'Longitude (λ)', hem: ['E', 'W'], max: 180 });
        fLatPE.set(cen.pe.lat); fLonPE.set(cen.pe.lon);
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Posição estimada (PE)' + en('DR / EP')), h('div', { class: 'ra-linha' }, fLatPE.el, fLonPE.el),
          h('p', { class: 'ra-dica' }, 'Exemplo: ' + (cen.manha ? 'crepúsculo matutino' : 'crepúsculo vespertino') + ' de ' + fData(cen.data || VL.hoje()) + ', HMG ' + fHMS(cen.hmg || 0) + '. Troque os valores à vontade.')));
        var chips = h('div', { class: 'chip-list ra-chips', role: 'group', 'aria-label': 'Retas' });
        var btAdd = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { if (retas.length >= 3) return; retas.push({ nome: '', ahg: retas.length ? retas[retas.length - 1].ahg : 0, dec: 0, ho: 30 }); sel = retas.length - 1; preencher(); calc(); } }, 'Adicionar reta');
        var btRem = h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { if (retas.length <= 1) return; retas.splice(sel, 1); sel = Math.max(0, sel - 1); preencher(); calc(); } }, 'Remover esta reta');
        var fNome = h('input', { type: 'text', class: 'ra-in ra-in-livre', 'aria-label': 'Nome do astro', placeholder: 'ex.: Sirius', maxlength: 24 });
        var fAHG = campoAng({ rotulo: 'AHG do astro' + en('GHA'), max: 360, dica: 'Estrela: AHG = AHG do ponto vernal (γ) + AHS da estrela.' });
        var fDecR = campoAng({ rotulo: 'Declinação (δ)' + en('Dec'), hem: ['N', 'S'], max: 90 });
        var fHo = campoAng({ rotulo: 'Altura verdadeira (Ho)', max: 90, dica: 'Altura do sextante já corrigida.' });
        var tituloReta = h('h4', null, 'Reta 1');
        col1.appendChild(h('section', { class: 'ra-bloco' }, tituloReta, chips,
          h('label', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, 'Astro'), fNome),
          h('div', { class: 'ra-linha' }, fAHG.el, fDecR.el, fHo.el),
          h('div', { class: 'btn-row' }, btAdd, btRem)));
        var folha = Folha(function (p) {
          /* tocar perto de uma reta seleciona */
          var melhor = -1, dm = 1e9;
          ultimas.forEach(function (r, i) { var d = Math.abs(Math.sin(r.az * RAD) * p.x + Math.cos(r.az * RAD) * p.y - r.da); if (d < dm) { dm = d; melhor = i; } });
          if (melhor >= 0 && dm * folha.pxPorMilha() < 26) { sel = melhor; preencher(); calc(); }
        });
        var ultimas = [];
        var resultado = h('div', { class: 'ra-resultado', 'aria-live': 'polite' });
        col2.appendChild(h('section', { class: 'ra-bloco ra-bloco-folha' },
          h('div', { class: 'spread' }, h('h4', null, 'Folha de plotagem' + en('plotting sheet')),
            h('div', { class: 'btn-row' },
              h('button', { type: 'button', class: 'btn btn-ghost btn-icon', 'aria-label': 'Aproximar', onclick: function () { folha.zoom(1.6); } }, '+'),
              h('button', { type: 'button', class: 'btn btn-ghost btn-icon', 'aria-label': 'Afastar', onclick: function () { folha.zoom(1 / 1.6); } }, '−'),
              h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { folha.zoom(0); } }, 'Ajustar'))),
          folha.el,
          h('p', { class: 'ra-legenda-folha' },
            h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-pe' }), 'posição estimada'),
            h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-az' }), 'azimute (seta para o astro)'),
            h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-lop' }), 'reta de altura'),
            h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-po' }), 'posição observada')),
          resultado));
        var passos = h('ol', { class: 'ra-passos', 'aria-live': 'polite' });
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Passo a passo da reta selecionada'), passos));

        function montarChips() {
          chips.innerHTML = '';
          retas.forEach(function (r, i) {
            chips.appendChild(h('button', { type: 'button', class: 'chip', 'aria-pressed': String(i === sel), onclick: function () { sel = i; preencher(); calc(); } }, 'Reta ' + (i + 1) + (r.nome ? ' · ' + r.nome : '')));
          });
          btAdd.disabled = retas.length >= 3; btRem.disabled = retas.length <= 1;
        }
        function preencher() {
          var r = retas[sel];
          fNome.value = r.nome || ''; fAHG.set(r.ahg); fDecR.set(r.dec); fHo.set(r.ho);
          tituloReta.textContent = 'Reta ' + (sel + 1) + ': dados do astro';
          montarChips();
        }
        function ler() {
          var r = retas[sel];
          r.nome = fNome.value.trim();
          var a = fAHG.get(), d = fDecR.get(), o = fHo.get();
          if (isFinite(a)) r.ahg = a; if (isFinite(d)) r.dec = d; if (isFinite(o)) r.ho = o;
          return isFinite(a) && isFinite(d) && isFinite(o);
        }
        function calc() {
          var okR = ler();
          var lat = fLatPE.get(), lon = fLonPE.get();
          montarChips();
          passos.innerHTML = '';
          if (!isFinite(lat) || !isFinite(lon)) { passos.appendChild(h('li', { class: 'ra-msg' }, 'Confira a posição estimada.')); return; }
          var pe = { lat: lat, lon: lon };
          var calcs = retas.map(function (r) { var ahl = ahlDe(r.ahg, lon), c = hcAz(lat, r.dec, ahl); return { r: r, ahl: ahl, c: c, da: (r.ho - c.hc) * 60 }; });
          var k = calcs[sel], r = k.r;
          if (!okR) passos.appendChild(h('li', { class: 'ra-msg' }, 'Há um campo inválido na reta: o cálculo usa o último valor válido.'));
          var oper = lon >= 0 ? '+' : '−';
          var soma = r.ahg + lon;
          passos.appendChild(passo(1, 'Ângulo horário local' + en('LHA') + ': AHL = AHG ' + (lon >= 0 ? '+ λ E' : '− λ W'),
            ['AHL = ' + gm(r.ahg, 1, true) + ' ' + oper + ' ' + gm(Math.abs(lon), 1, true) + ' = ' + gm(soma, 1, true) + (soma < 0 ? ' + 360°' : soma >= 360 ? ' − 360°' : '')],
            'AHL = ' + gm(k.ahl, 1, true) + (k.c.oeste ? ' (menor que 180°: o astro está a oeste do meridiano)' : ' (maior que 180°: o astro está a leste do meridiano)')));
          passos.appendChild(passo(2, 'Altura calculada' + en('Hc') + ' para a PE',
            ['sen Hc = sen φ · sen δ + cos φ · cos δ · cos AHL',
              '= (' + num(k.c.sf, 4) + ') × (' + num(k.c.sd, 4) + ') + (' + num(k.c.cf, 4) + ') × (' + num(k.c.cd, 4) + ') × (' + num(k.c.cahl, 4) + ')',
              '= ' + num(k.c.sh, 5)],
            'Hc = ' + gm(k.c.hc), 'Latitude e declinação Sul entram com sinal negativo.'));
          passos.appendChild(passo(3, 'Azimute verdadeiro' + en('Zn'),
            ['cos Z = (sen δ − sen φ · sen Hc) / (cos φ · cos Hc) = ' + num(k.c.cz, 4), 'Z = ' + num(k.c.Z, 1) + '°  (contado a partir do Norte)',
              k.c.oeste ? 'AHL < 180° (astro a oeste): Az = 360° − Z' : 'AHL > 180° (astro a leste): Az = Z'],
            'Az = ' + fAz(k.c.az)));
          var para = k.da >= 0;
          passos.appendChild(passo(4, 'Diferença de alturas' + en('intercept') + ': Δa = Ho − Hc',
            ['Δa = ' + gm(r.ho) + ' − ' + gm(k.c.hc) + ' = ' + fMinS(k.da)],
            'Δa = ' + num(Math.abs(k.da), 1) + ' milhas ' + (para ? 'para o astro' : 'contrário ao astro') + en(para ? 'toward' : 'away'),
            para ? 'Ho maior que Hc: o barco está mais perto do ponto subastral do que a PE. 1′ de altura = 1 milha.' : 'Ho menor que Hc: o barco está mais longe do astro do que a PE. 1′ de altura = 1 milha.'));
          passos.appendChild(passo(5, 'Plotar a reta',
            ['Da PE, trace o azimute ' + fAz(k.c.az) + '.', 'Meça ' + num(Math.abs(k.da), 1) + ' milhas ' + (para ? 'no sentido do astro' : 'no sentido oposto ao astro') + ' e marque o ponto determinativo.',
              'Pelo ponto, trace a perpendicular ao azimute: a reta de altura (rumos ' + fAz(n360(k.c.az + 90)).replace(',0°', '°') + ' e ' + fAz(n360(k.c.az - 90)).replace(',0°', '°') + ').'], null));
          var lst = calcs.map(function (q) { return { az: q.c.az, da: q.da, nome: q.r.nome }; });
          ultimas = lst;
          var fix = posicaoObservada(lst);
          folha.desenhar({ pe: pe, retas: lst, sel: sel, fix: fix });
          resultado.innerHTML = '';
          if (lst.length < 2) { resultado.appendChild(h('p', { class: 'ra-dica' }, 'Uma reta só diz que o barco está em algum ponto dela. Adicione outra reta para cruzar e obter a posição observada.')); return; }
          if (!fix) { resultado.appendChild(h('p', { class: 'ra-msg' }, 'As retas são paralelas: não se cruzam. Escolha astros com azimutes bem diferentes.')); return; }
          var pos = milhasParaLatLon(pe, fix.x, fix.y), dist = Math.hypot(fix.x, fix.y), rumo = n360(Math.atan2(fix.x, fix.y) / RAD);
          var corteMin = 90;
          for (var i = 0; i < lst.length; i++) for (var j = i + 1; j < lst.length; j++) { var dd = Math.abs(n180(lst[i].az - lst[j].az)); corteMin = Math.min(corteMin, Math.min(dd, 180 - dd)); }
          resultado.appendChild(h('div', { class: 'ra-cartao' },
            h('p', { class: 'ra-cartao-t' }, 'Posição observada (PO)' + en('fix')),
            h('p', { class: 'ra-cartao-v' }, fLat(pos.lat) + '   ' + fLon(pos.lon)),
            h('p', { class: 'ra-dica' }, 'A ' + num(dist, 1) + ' milhas da PE, no rumo ' + fAz(rumo) + '. ' + (lst.length === 3 ? 'Com três retas forma-se um pequeno triângulo (o "chapéu"); a posição é tomada no seu centro (aqui, por mínimos quadrados).' : 'É o cruzamento das duas retas.')),
            corteMin < 30 ? h('p', { class: 'ra-msg' }, 'Atenção: o menor ângulo de corte entre retas é ' + Math.round(corteMin) + '°. Abaixo de 30° um pequeno erro de altura desloca muito a posição.') : null));
        }
        [fLatPE, fLonPE, fAHG, fDecR, fHo].forEach(function (f) { f.on(calc); });
        fNome.addEventListener('input', calc);
        preencher(); calc();
      }

      /* ---------------------------------------------------------------- reta: exercício */
      function retaExercicio(box) {
        var placar = { feitos: 0, certos: 0 };
        var cab = h('div', { class: 'ra-ex-cab' }), corpo = h('div', { class: 'ra-ex-corpo' });
        box.appendChild(cab); box.appendChild(corpo);
        function novo() {
          var cen = null, tent = 0;
          while (!cen && tent++ < 10) cen = cenarioReta(Math.floor(Math.random() * 1e9));
          corpo.innerHTML = '';
          cab.textContent = 'Exercícios feitos: ' + placar.feitos + ' · etapas certas: ' + placar.certos;
          var pe = cen.pe;
          corpo.appendChild(h('p', { class: 'ra-enun' }, 'No ' + (cen.manha ? 'crepúsculo matutino' : 'crepúsculo vespertino') + ' de ' + fData(cen.data) + ', às HMG ' + fHMS(cen.hmg) + ', você observou três estrelas. Posição estimada: ' + fLat(pe.lat) + ', ' + fLon(pe.lon) + '.'));
          var tab = h('table', { class: 'tabela ra-tab' },
            h('thead', null, h('tr', null, h('th', null, 'Reta'), h('th', null, 'Astro'), h('th', null, 'AHG'), h('th', null, 'Declinação'), h('th', null, 'Ho'))),
            h('tbody', null, cen.retas.map(function (r, i) { return h('tr', null, h('td', null, String(i + 1)), h('td', null, r.nome), h('td', null, gm(r.ahg, 1, true)), h('td', null, fDec(r.dec)), h('td', null, gm(r.ho))); })));
          corpo.appendChild(h('div', { class: 'table-wrap' }, tab));
          corpo.appendChild(h('p', { class: 'ra-dica' }, 'Dados de almanaque simulados (AHG e δ já interpolados para a hora). Ho já está corrigida.'));
          /* etapa 1 */
          var r0 = cen.retas[0];
          var ahl = ahlDe(r0.ahg, pe.lon), c = hcAz(pe.lat, r0.dec, ahl), da = (r0.ho - c.hc) * 60;
          var fA = campoAng({ rotulo: 'AHL', max: 360 }), fH = campoAng({ rotulo: 'Hc', max: 90 });
          var fZ = campoNum({ rotulo: 'Azimute (Az)', un: '°', min: 0, max: 360, msg: 'Azimute de 0 a 360°.' });
          var fD = campoNum({ rotulo: 'Δa', un: 'milhas', min: 0, max: 600, msg: 'Valor em milhas, sem sinal.' });
          var fDir = h('select', { class: 'ra-sel', 'aria-label': 'Sentido do Δa' }, h('option', { value: '' }, 'sentido…'), h('option', { value: 'para' }, 'para o astro'), h('option', { value: 'contra' }, 'contrário ao astro'));
          var fb1 = h('div', { 'aria-live': 'polite' });
          var btC = h('button', { type: 'button', class: 'btn btn-primary' }, 'Conferir');
          var et1 = h('section', { class: 'ra-bloco' }, h('h4', null, 'Etapa 1 · Calcule a reta 1 (' + r0.nome + ')'),
            h('div', { class: 'ra-linha' }, fA.el, fH.el, fZ.el, h('div', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, 'Diferença de alturas'), h('span', { class: 'ra-ang' }, fD.el, fDir))),
            h('div', { class: 'btn-row' }, btC), fb1);
          corpo.appendChild(et1);
          var et2 = h('section', { class: 'ra-bloco', hidden: true });
          corpo.appendChild(et2);
          btC.addEventListener('click', function () {
            var vA = fA.get(), vH = fH.get(), vZ = fZ.get(), vD = fD.get(), dir = fDir.value;
            if (![vA, vH, vZ, vD].every(isFinite) || !dir) { fb1.innerHTML = ''; fb1.appendChild(h('p', { class: 'ra-msg' }, 'Preencha os quatro valores e o sentido do Δa antes de conferir.')); return; }
            var res = [
              ['AHL', isFinite(vA) && Math.abs(n180(vA - ahl)) * 60 <= 0.25, gm(ahl, 1, true)],
              ['Hc', isFinite(vH) && Math.abs(vH - c.hc) * 60 <= 0.7, gm(c.hc)],
              ['Azimute', isFinite(vZ) && Math.abs(n180(vZ - c.az)) <= 0.7, fAz(c.az)],
              ['Δa', isFinite(vD) && Math.abs(vD - Math.abs(da)) <= 0.7 && (Math.abs(da) < 0.5 || dir === (da >= 0 ? 'para' : 'contra')), num(Math.abs(da), 1) + ' milhas ' + (da >= 0 ? 'para o astro' : 'contrário ao astro')],
            ];
            var nOk = res.filter(function (x) { return x[1]; }).length;
            placar.certos += nOk;
            fb1.innerHTML = '';
            var ol = h('ol', { class: 'ra-passos ra-passos-gab' });
            var oper = pe.lon >= 0 ? '+' : '−';
            ol.appendChild(passo(1, 'AHL = AHG ' + oper + ' λ', ['AHL = ' + gm(r0.ahg, 1, true) + ' ' + oper + ' ' + gm(Math.abs(pe.lon), 1, true)], 'AHL = ' + gm(ahl, 1, true)));
            ol.appendChild(passo(2, 'sen Hc = sen φ sen δ + cos φ cos δ cos AHL', ['= (' + num(c.sf, 4) + ')(' + num(c.sd, 4) + ') + (' + num(c.cf, 4) + ')(' + num(c.cd, 4) + ')(' + num(c.cahl, 4) + ') = ' + num(c.sh, 5)], 'Hc = ' + gm(c.hc)));
            ol.appendChild(passo(3, 'cos Z = (sen δ − sen φ sen Hc) / (cos φ cos Hc)', ['Z = ' + num(c.Z, 1) + '°; ' + (c.oeste ? 'AHL < 180°: Az = 360° − Z' : 'AHL > 180°: Az = Z')], 'Az = ' + fAz(c.az)));
            ol.appendChild(passo(4, 'Δa = Ho − Hc', [gm(r0.ho) + ' − ' + gm(c.hc) + ' = ' + fMinS(da)], num(Math.abs(da), 1) + ' milhas ' + (da >= 0 ? 'para o astro' : 'contrário ao astro')));
            fb1.appendChild(caixaFb(nOk === 4, nOk === 4 ? 'Tudo certo.' : nOk + ' de 4 certos.',
              h('div', null, h('ul', { class: 'ra-conf' }, res.map(function (x) { return h('li', { 'data-ok': x[1] ? '1' : '0' }, x[0] + ': ' + (x[1] ? 'certo' : 'o correto é ' + x[2])); })),
                h('details', { class: 'ra-det', open: nOk < 4 }, h('summary', null, 'Ver a resolução'), ol))));
            btC.disabled = true;
            etapa2();
          });
          function etapa2() {
            et2.hidden = false; et2.innerHTML = '';
            var lst = cen.retas.map(function (r) { var a2 = ahlDe(r.ahg, pe.lon), c2 = hcAz(pe.lat, r.dec, a2); return { az: c2.az, da: (r.ho - c2.hc) * 60, nome: r.nome }; });
            var fix = posicaoObservada(lst);
            var tb = h('table', { class: 'tabela ra-tab' }, h('thead', null, h('tr', null, h('th', null, 'Reta'), h('th', null, 'Az'), h('th', null, 'Δa'))),
              h('tbody', null, lst.map(function (q, i) { return h('tr', null, h('td', null, (i + 1) + ' · ' + q.nome), h('td', null, fAz(q.az)), h('td', null, num(Math.abs(q.da), 1) + (q.da >= 0 ? ' para' : ' contrário'))); })));
            var fb2 = h('div', { 'aria-live': 'polite' });
            var feito = false;
            var folha = Folha(function (p) {
              if (feito) return;
              feito = true;
              var erro = Math.hypot(p.x - fix.x, p.y - fix.y), tol = Math.max(1.2, 0.07 * Math.max(8, Math.hypot(fix.x, fix.y)));
              var ok = erro <= tol;
              if (ok) placar.certos++;
              placar.feitos++;
              folha.desenhar({ pe: pe, retas: lst, sel: -1, fix: fix, marca: p });
              var pos = milhasParaLatLon(pe, fix.x, fix.y), real = cen.verdade;
              fb2.innerHTML = '';
              fb2.appendChild(caixaFb(ok, ok ? 'Boa posição.' : 'Ficou longe.',
                h('div', null,
                  h('p', null, 'Seu toque ficou a ' + num(erro, 1) + ' milhas da posição observada. A PO fica no cruzamento das retas (com três retas, no centro do pequeno triângulo).'),
                  h('p', null, h('strong', null, 'PO: ' + fLat(pos.lat) + ', ' + fLon(pos.lon)), '. A posição verdadeira usada para gerar o exercício era ' + fLat(real.lat) + ', ' + fLon(real.lon) + '.'),
                  h('p', { class: 'small muted' }, 'Método de Marcq Saint-Hilaire' + en('intercept method') + ' (Miguens, vol. II; Bowditch, cap. "Sight Reduction").'))));
              fb2.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novo }, 'Novo exercício')));
              cab.textContent = 'Exercícios feitos: ' + placar.feitos + ' · etapas certas: ' + placar.certos;
            });
            et2.appendChild(h('h4', null, 'Etapa 2 · Ache a posição observada'));
            et2.appendChild(h('p', null, 'As três retas já estão plotadas a partir da PE. Toque na folha onde fica a posição observada.'));
            et2.appendChild(h('div', { class: 'table-wrap' }, tb));
            et2.appendChild(h('div', { class: 'ra-folha-ex' }, folha.el));
            et2.appendChild(fb2);
            folha.desenhar({ pe: pe, retas: lst, sel: -1, fix: fix, mostrarFix: false });
            et2.scrollIntoView && et2.scrollIntoView({ block: 'nearest', behavior: reduzMov ? 'auto' : 'smooth' });
          }
        }
        novo();
      }

      /* ---------------------------------------------------------------- latitude: explorar */
      function latExplorar(box) {
        box.appendChild(h('p', { class: 'ra-intro' }, 'Na passagem meridiana (culminação) o Sol está exatamente no seu meridiano, na maior altura do dia, no azimute 000° ou 180°. Com a altura verdadeira e a declinação do almanaque, a latitude sai de uma conta de somar ou subtrair. A hora da culminação dá ainda a longitude.'));
        var grade = h('div', { class: 'ra-grade' });
        box.appendChild(grade);
        var col1 = h('div', { class: 'ra-col' }), col2 = h('div', { class: 'ra-col ra-col-folha' });
        grade.appendChild(col1); grade.appendChild(col2);
        var fDataL = h('input', { type: 'date', class: 'ra-in ra-in-data', 'aria-label': 'Data', value: VL.hoje() });
        var fHmg = campoHora({ rotulo: 'HMG da observação (culminação)' });
        var btAlm = h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, 'Preencher com o almanaque simulado');
        var fDec = campoAng({ rotulo: 'Declinação do Sol (δ)', hem: ['N', 'S'], max: 30 });
        var fAhg = campoAng({ rotulo: 'AHG do Sol', max: 360 });
        var fAi = campoAng({ rotulo: 'Altura instrumental (ai)', max: 90 });
        var fEi = campoNum({ rotulo: 'Erro instrumental (ei)', un: '′', sinal: true, min: -30, max: 30, msg: 'Use, por exemplo, −0,4 ou +1,3.' });
        var fHm = campoNum({ rotulo: 'Elevação do olho', un: 'm', min: 0, max: 60, msg: 'Altura do olho de 0 a 60 m.' });
        var fSd = campoNum({ rotulo: 'Semidiâmetro do Sol (SD)', un: '′', min: 15, max: 17, msg: 'O SD do Sol fica entre 15,7′ e 16,3′.' });
        var limbo = segmentado('Limbo observado', [['inf', 'Limbo inferior'], ['sup', 'Limbo superior']], 'inf', function () { calc(); });
        var lado = segmentado('Lado do Sol na culminação', [['N', 'Sol ao Norte (Az 000°)'], ['S', 'Sol ao Sul (Az 180°)']], 'N', function () { calc(); });
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Almanaque: dia e hora'),
          h('div', { class: 'ra-linha' }, h('label', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, 'Data'), fDataL), fHmg.el),
          h('div', { class: 'ra-linha' }, fDec.el, fAhg.el),
          h('div', { class: 'btn-row' }, btAlm),
          h('p', { class: 'ra-dica' }, 'No almanaque, a declinação e o AHG vêm de hora em hora: interpole para os minutos e segundos da HMG.')));
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Observação com o sextante'),
          h('div', { class: 'ra-linha' }, fAi.el, fEi.el, fHm.el, fSd.el), limbo.el, h('div', { class: 'ra-sep' }), lado.el,
          h('p', { class: 'ra-dica' }, 'Para saber o lado: compare sua latitude estimada com a declinação. Se você está ao sul do Sol (por exemplo, φ 23° S e δ 10° S), ele culmina ao Norte.')));
        var passos = h('ol', { class: 'ra-passos', 'aria-live': 'polite' });
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Passo a passo'), passos));
        var fig = h('div', { class: 'ra-fig' });
        var res = h('div', { class: 'ra-resultado', 'aria-live': 'polite' });
        col2.appendChild(h('section', { class: 'ra-bloco ra-bloco-folha' }, h('h4', null, 'O plano do meridiano'), fig,
          h('p', { class: 'ra-legenda-folha' }, h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-z' }), 'z: distância zenital'), h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-d' }), 'δ: declinação'), h('span', { class: 'ra-lg-item' }, h('span', { class: 'ra-lg ra-lg-f' }), 'φ: latitude')), res));
        /* valores iniciais: um caso coerente para o dia de hoje no litoral do Rio de Janeiro */
        function exemplo() {
          var iso = /^\d{4}-\d{2}-\d{2}$/.test(fDataL.value) ? fDataL.value : VL.hoje();
          var alm = almanaqueSol(iso), lonV = -(41 + 50 / 60), latV = -(23 + 5 / 60);
          var t = alm.mpHML - lonV / 15; for (var i = 0; i < 4; i++) t += n180(-lonV - solEm(iso, t).ahg) / 15;
          t = Math.round(t * 3600) / 3600;
          var ip = interpolarSol(alm, t);
          fHmg.set(t); fDec.set(ip.dec); fAhg.set(ip.ahg); fSd.set(alm.sd);
          fEi.set(-0.4); fHm.set(2.9);
          var av = 90 - Math.abs(latV - ip.dec);
          fAi.set(r1(inverter(av, -0.4, 2.9, alm.sd, alm.ph, 'inf')));
          lado.set(ip.dec > latV ? 'N' : 'S'); limbo.set('inf');
        }
        btAlm.addEventListener('click', function () {
          var iso = fDataL.value, t = fHmg.get();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || !isFinite(t)) return;
          var alm = almanaqueSol(iso), ip = interpolarSol(alm, t);
          fDec.set(ip.dec); fAhg.set(ip.ahg); fSd.set(alm.sd); calc();
          VL.ui.toast('δ, AHG e SD do almanaque simulado para ' + fData(iso) + ' às ' + fHMS(t) + '.');
        });
        fDataL.addEventListener('change', function () { exemplo(); calc(); });
        function calc() {
          passos.innerHTML = ''; res.innerHTML = ''; fig.innerHTML = '';
          var ai = fAi.get(), ei = fEi.get(), hm = fHm.get(), sd = fSd.get(), dec = fDec.get(), ahg = fAhg.get();
          if (![ai, ei, hm, sd, dec].every(isFinite)) { passos.appendChild(h('li', { class: 'ra-msg' }, 'Preencha os campos destacados.')); return; }
          var c = corrigir(ai, ei, hm, sd, 0.15, limbo.valor);
          passos.appendChild(passo(1, 'Altura observada: ao = ai + ei', [gm(ai) + ' ' + (ei >= 0 ? '+ ' : '− ') + num(Math.abs(ei), 1) + '′'], 'ao = ' + gm(c.ao),
            'O erro instrumental entra com o seu sinal. Ele se mede antes, alinhando o horizonte direto com o refletido.'));
          passos.appendChild(passo(2, 'Altura aparente: aa = ao − depressão do horizonte', ['dp = 1,76′ × √' + num(hm, 1) + ' m = ' + num(c.dp, 1) + '′'], 'aa = ' + gm(c.aa),
            'Do olho acima do mar, o horizonte visível fica abaixo do horizontal: sempre se subtrai.'));
          passos.appendChild(passo(3, 'Altura verdadeira: av = aa − refração ± semidiâmetro + paralaxe',
            ['R = cot(aa + 7,31 / (aa + 4,4)) = ' + num(c.R, 1) + '′  (Bennett, condições padrão)', 'SD = ' + (c.SD >= 0 ? '+' : '−') + num(Math.abs(c.SD), 1) + '′ (' + (limbo.valor === 'sup' ? 'limbo superior: subtrai' : 'limbo inferior: soma') + ')', 'P = 0,15′ × cos aa = +' + num(c.P, 1) + '′'],
            'av = ' + gm(c.av), 'O almanaque traz essas correções somadas numa tábua para o Sol. Os resultados podem diferir alguns décimos de minuto das tábuas do ANB.'));
          var avr = r1(c.av), z = 90 - avr, aoN = lado.valor === 'N';
          passos.appendChild(passo(4, 'Distância zenital: z = 90° − av', ['z = 90° − ' + gm(avr)], 'z = ' + gm(z)));
          var phi = aoN ? dec - z : dec + z;
          var nomeZ = aoN ? 'S' : 'N', nomeD = dec >= 0 ? 'N' : 'S';
          passos.appendChild(passo(5, 'Latitude meridiana',
            ['Com sinais (N +, S −): ' + (aoN ? 'Sol ao Norte → φ = δ − z' : 'Sol ao Sul → φ = δ + z'),
              'φ = (' + num(dec, 4) + '°) ' + (aoN ? '−' : '+') + ' ' + num(z, 4) + '° = ' + num(phi, 4) + '°',
              'Regra dos nomes: z recebe o nome contrário ao lado do Sol (' + nomeZ + '); δ é ' + nomeD + '. ' + (nomeZ === nomeD ? 'Nomes iguais: soma.' : 'Nomes contrários: subtrai, e fica o nome do maior.')],
            'φ = ' + fLat(phi)));
          if (isFinite(ahg)) {
            var lon = ahg <= 180 ? -ahg : 360 - ahg;
            passos.appendChild(passo(6, 'Longitude pela hora da culminação',
              ['Na culminação, AHL = 0°: o AHG do Sol é igual à longitude.', ahg <= 180 ? 'AHG ≤ 180°: λ = AHG, a oeste' : 'AHG > 180°: λ = 360° − AHG, a leste'],
              'λ = ' + fLon(lon), 'Exige a HMG exata da culminação (o instante de maior altura). Um erro de 4 s na hora dá 1′ de erro na longitude.'));
            res.appendChild(h('div', { class: 'ra-cartao' }, h('p', { class: 'ra-cartao-t' }, 'Posição pela passagem meridiana'), h('p', { class: 'ra-cartao-v' }, fLat(phi) + '   ' + fLon(lon))));
          } else res.appendChild(h('div', { class: 'ra-cartao' }, h('p', { class: 'ra-cartao-t' }, 'Latitude meridiana'), h('p', { class: 'ra-cartao-v' }, fLat(phi))));
          if (avr <= 0 || avr >= 90) return;
          fig.appendChild(figuraMeridiano(phi, dec, aoN, avr));
          var coerente = aoN ? dec > phi - 0.01 : dec < phi + 0.01;
          if (!coerente) res.appendChild(h('p', { class: 'ra-msg' }, 'Confira o lado do Sol: com essa declinação e essa latitude, o Sol culminaria do outro lado.'));
        }
        [fHmg, fDec, fAhg, fAi, fEi, fHm, fSd].forEach(function (f) { f.on(calc); });
        exemplo(); calc();
      }

      /* ---------------------------------------------------------------- latitude: exercício (estilo da prova) */
      function latExercicio(box) {
        var placar = { feitos: 0, certas: 0, total: 0 };
        var cab = h('div', { class: 'ra-ex-cab' }), corpo = h('div', { class: 'ra-ex-corpo' });
        box.appendChild(cab); box.appendChild(corpo);
        function novo() {
          var c = null, k = 0; while (!c && k++ < 10) c = cenarioMeridiana(Math.floor(Math.random() * 1e9));
          var sol = resolverMeridiana(c);
          corpo.innerHTML = '';
          cab.textContent = 'Situações resolvidas: ' + placar.feitos + (placar.total ? ' · respostas certas: ' + placar.certas + ' de ' + placar.total : '');
          corpo.appendChild(h('p', { class: 'ra-enun' },
            'Em ' + fData(c.data) + ', um veleiro está na posição estimada ' + fLat(c.pe.lat) + ', ' + fLon(c.pe.lon) + ' e usa a hora legal do fuso ' + fFuso(c.fuso) + '. ' +
            'Às HMG ' + fHMS(c.hmg) + ' o navegante observou o limbo inferior do Sol na passagem meridiana, com altura instrumental ai = ' + gm(c.ai) + '. ' +
            'Erro instrumental do sextante: ' + fMinS(c.ei) + '. Elevação do olho: ' + num(c.hm, 1) + ' m.'));
          /* extrato */
          var hh = Math.floor(c.hmg), linhas = [];
          for (var x = Math.max(0, hh - 1); x <= Math.min(24, hh + 2); x++) linhas.push(c.alm.horas[x]);
          corpo.appendChild(h('details', { class: 'ra-det ra-alm', open: true }, h('summary', null, 'Extrato do almanaque do Sol (simulado) para ' + fData(c.data)),
            h('div', { class: 'table-wrap' }, h('table', { class: 'tabela ra-tab' },
              h('thead', null, h('tr', null, h('th', null, 'HMG'), h('th', null, 'AHG'), h('th', null, 'Declinação'))),
              h('tbody', null, linhas.map(function (l) { return h('tr', null, h('td', null, String(l.h).padStart(2, '0') + 'h'), h('td', null, gm(l.ahg, 1, true)), h('td', null, fDec(l.dec))); })))),
            h('p', { class: 'ra-dica' }, 'Passagem meridiana (HML): ' + fHM(c.alm.mpHML) + ' · SD: ' + num(c.alm.sd, 1) + '′ · PH: 0,15′. Acréscimo do AHG do Sol: 15° por hora (15′ por minuto, 0,25′ por segundo).')));
          var fHl = campoHora({ rotulo: '1. HLeg prevista da culminação', semSeg: true });
          var fDe = campoAng({ rotulo: '2. Declinação na HMG da observação', hem: ['N', 'S'], max: 30 });
          var fAv = campoAng({ rotulo: '3. Altura verdadeira (av)', max: 90 });
          var fLa = campoAng({ rotulo: '4. Latitude meridiana', hem: ['N', 'S'], max: 89 });
          var fLo = campoAng({ rotulo: '5. Longitude na passagem meridiana', hem: ['E', 'W'], max: 180 });
          var fAz6 = segmentado('6. Azimute do Sol na passagem meridiana', [['0', '000°'], ['90', '090°'], ['180', '180°'], ['270', '270°']], '', null);
          var fb = h('div', { 'aria-live': 'polite' });
          var btC = h('button', { type: 'button', class: 'btn btn-primary' }, 'Conferir');
          corpo.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Responda'),
            h('div', { class: 'ra-linha' }, fHl.el, fDe.el, fAv.el), h('div', { class: 'ra-linha' }, fLa.el, fLo.el),
            h('div', { class: 'ra-campo' }, h('span', { class: 'ra-leg' }, '6. Azimute do Sol na passagem meridiana'), fAz6.el),
            h('div', { class: 'btn-row' }, btC), fb));
          btC.addEventListener('click', function () {
            var v1 = fHl.get(), v2 = fDe.get(), v3 = fAv.get(), v4 = fLa.get(), v5 = fLo.get(), v6 = fAz6.valor;
            if (![v1, v2, v3, v4, v5].every(isFinite) || !v6) { fb.innerHTML = ''; fb.appendChild(h('p', { class: 'ra-msg' }, 'Responda as seis perguntas antes de conferir (campos em branco ficam destacados).')); return; }
            var rs = [
              ['HLeg prevista', isFinite(v1) && Math.abs(n180((v1 - sol.hlegPrev) * 15)) / 15 * 60 <= 1.01, fHM(sol.hlegPrev) + ' (fuso ' + fFuso(c.fuso) + ')'],
              ['Declinação', isFinite(v2) && Math.abs(v2 - sol.ip.dec) * 60 <= 0.25, fDec(sol.ip.dec)],
              ['Altura verdadeira', isFinite(v3) && Math.abs(v3 - sol.av) * 60 <= 0.55, gm(sol.av)],
              ['Latitude', isFinite(v4) && Math.abs(v4 - sol.lat) * 60 <= 0.65, fLat(sol.lat)],
              ['Longitude', isFinite(v5) && Math.abs(n180(v5 - sol.lon)) * 60 <= 0.35, fLon(sol.lon)],
              ['Azimute', v6 === String(sol.az), sol.az === 0 ? '000°' : '180°'],
            ];
            var nOk = rs.filter(function (r) { return r[1]; }).length;
            placar.feitos++; placar.certas += nOk; placar.total += rs.length;
            var ol = h('ol', { class: 'ra-passos ra-passos-gab' });
            ol.appendChild(passo(1, 'Hora legal prevista da culminação (processo aproximado)', [
              'HML da passagem meridiana (almanaque): ' + fHM(c.alm.mpHML),
              'Longitude em tempo: ' + gm(Math.abs(c.pe.lon), 1, true) + ' ÷ 15 = ' + fTempoDur(Math.abs(sol.lt)) + (c.pe.lon < 0 ? ' (W: soma)' : ' (E: subtrai)'),
              'HMG = ' + fHM(c.alm.mpHML) + (c.pe.lon < 0 ? ' + ' : ' − ') + fTempoDur(Math.abs(sol.lt)) + ' = ' + fHMS(sol.hmgPrev),
              'HLeg = HMG − fuso = ' + fHMS(sol.hmgPrev) + ' − ' + c.fuso + 'h'], 'HLeg ≈ ' + fHM(sol.hlegPrev)));
            ol.appendChild(passo(2, 'Declinação na HMG da observação', [
              'δ às ' + String(sol.ip.hh).padStart(2, '0') + 'h = ' + fDec(sol.ip.decH) + '; variação na hora d = ' + fMinS(sol.ip.d * 60),
              'Correção = d × ' + num(sol.ip.f * 60, 1) + ' min / 60 = ' + fMinS(sol.ip.corrD * 60)], 'δ = ' + fDec(sol.ip.dec)));
            var co = sol.cor;
            ol.appendChild(passo(3, 'Altura verdadeira', [
              'ao = ai + ei = ' + gm(c.ai) + ' ' + fMinS(c.ei) + ' = ' + gm(co.ao),
              'aa = ao − dp = ' + gm(co.ao) + ' − ' + num(co.dp, 1) + '′ = ' + gm(co.aa),
              'av = aa − R + SD + P = ' + gm(co.aa) + ' − ' + num(co.R, 1) + '′ + ' + num(co.SD, 1) + '′ + ' + num(co.P, 1) + '′'], 'av = ' + gm(sol.av)));
            ol.appendChild(passo(4, 'Latitude meridiana', [
              'z = 90° − av = ' + gm(sol.z),
              sol.aoNorte ? 'O Sol (δ ' + fDec(sol.ip.dec) + ') fica ao norte da PE: φ = δ − z' : 'O Sol (δ ' + fDec(sol.ip.dec) + ') fica ao sul da PE: φ = δ + z'], 'φ = ' + fLat(sol.lat)));
            ol.appendChild(passo(5, 'Longitude', [
              'AHG às ' + String(sol.ip.hh).padStart(2, '0') + 'h = ' + gm(sol.ip.ahgH, 1, true) + '; acréscimo de ' + num(sol.ip.f * 60, 2) + ' min × 15′ = ' + gm(sol.ip.acres),
              'AHG = ' + gm(sol.ip.ahg, 1, true) + (sol.ip.ahg <= 180 ? ' → λ = AHG (W)' : ' → λ = 360° − AHG (E)')], 'λ = ' + fLon(sol.lon)));
            ol.appendChild(passo(6, 'Azimute', ['Na passagem meridiana o Sol está no meridiano: ' + (sol.aoNorte ? 'ao Norte (000°)' : 'ao Sul (180°)') + '.'], 'Az = ' + (sol.az === 0 ? '000°' : '180°')));
            fb.innerHTML = '';
            fb.appendChild(caixaFb(nOk === rs.length, nOk === rs.length ? 'Tudo certo.' : nOk + ' de ' + rs.length + ' certas.',
              h('div', null, h('ul', { class: 'ra-conf' }, rs.map(function (r) { return h('li', { 'data-ok': r[1] ? '1' : '0' }, r[0] + ': ' + (r[1] ? 'certo' : 'o correto é ' + r[2])); })),
                h('details', { class: 'ra-det', open: nOk < rs.length }, h('summary', null, 'Ver a resolução'), ol),
                h('p', { class: 'small muted' }, 'Tolerâncias: 1 min na hora; alguns décimos de minuto nos ângulos (as tábuas do ANB podem diferir um pouco destas fórmulas). Figura do meridiano: ver modo Explorar.'))));
            fb.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novo }, 'Nova situação')));
            btC.disabled = true;
            cab.textContent = 'Situações resolvidas: ' + placar.feitos + ' · respostas certas: ' + placar.certas + ' de ' + placar.total;
          });
        }
        novo();
      }

      /* ---------------------------------------------------------------- hora: explorar */
      function horaExplorar(box) {
        box.appendChild(h('p', { class: 'ra-intro' }, 'Para medir a altura na culminação, o navegante precisa saber de antemão a que horas o Sol vai passar pelo meridiano. O almanaque dá a hora média local (HML) da passagem em Greenwich; ela vale, aproximadamente, para qualquer meridiano. Depois é só converter a longitude em tempo e aplicar o fuso.'));
        var grade = h('div', { class: 'ra-grade' });
        box.appendChild(grade);
        var col1 = h('div', { class: 'ra-col' }), col2 = h('div', { class: 'ra-col ra-col-folha' });
        grade.appendChild(col1); grade.appendChild(col2);
        var fDt = h('input', { type: 'date', class: 'ra-in ra-in-data', 'aria-label': 'Data', value: VL.hoje() });
        var fLon = campoAng({ rotulo: 'Longitude estimada (λ)', hem: ['E', 'W'], max: 180 });
        var fMp = campoHora({ rotulo: 'HML da passagem meridiana (almanaque)', semSeg: true });
        var fFu = h('select', { class: 'ra-sel', 'aria-label': 'Fuso horário' });
        for (var f = -12; f <= 12; f++) fFu.appendChild(h('option', { value: String(f) }, fFuso(f)));
        var auto = h('input', { type: 'checkbox', role: 'switch' }); auto.checked = true;
        var info = h('p', { class: 'ra-dica' });
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Dados'),
          h('div', { class: 'ra-linha' }, h('label', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, 'Data'), fDt), fMp.el), info,
          h('div', { class: 'ra-linha' }, fLon.el, h('label', { class: 'ra-campo ra-campo-n' }, h('span', { class: 'ra-leg' }, 'Fuso (HMG = HLeg + fuso)'), fFu)),
          h('label', { class: 'switch ra-switch' }, auto, h('span', null, 'Fuso teórico pela longitude (múltiplos de 15°)'))));
        var passos = h('ol', { class: 'ra-passos', 'aria-live': 'polite' });
        col1.appendChild(h('section', { class: 'ra-bloco' }, h('h4', null, 'Passo a passo'), passos));
        var res = h('div', { class: 'ra-resultado', 'aria-live': 'polite' });
        var faixa = h('div', { class: 'ra-fig' });
        col2.appendChild(h('section', { class: 'ra-bloco ra-bloco-folha' }, h('h4', null, 'Do meridiano de Greenwich ao seu'), faixa, res,
          VL.ui.callout('dica', 'Por que 15° valem 1 hora', 'O Sol dá uma volta de 360° em 24 h: 15° por hora, 1° a cada 4 minutos, 1′ a cada 4 segundos. A oeste de Greenwich ele passa mais tarde (soma); a leste, mais cedo (subtrai).')));
        fLon.set(-(41 + 50 / 60));
        function preencherMp() { var iso = fDt.value; if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return; fMp.set(almanaqueSol(iso).mpHML); }
        fDt.addEventListener('change', function () { preencherMp(); calc(); });
        auto.addEventListener('change', calc);
        fFu.addEventListener('change', function () { auto.checked = false; calc(); });
        function calc() {
          passos.innerHTML = ''; res.innerHTML = ''; faixa.innerHTML = '';
          var lon = fLon.get(), mp = fMp.get();
          var iso = /^\d{4}-\d{2}-\d{2}$/.test(fDt.value) ? fDt.value : VL.hoje();
          var alm = almanaqueSol(iso);
          var e = alm.eqt, es = Math.round(Math.abs(e) * 60);
          info.textContent = 'Almanaque simulado para ' + fData(iso) + ': equação do tempo ' + (e >= 0 ? '+' : '−') + Math.floor(es / 60) + 'm ' + String(es % 60).padStart(2, '0') + 's, passagem meridiana ' + fHM(alm.mpHML) + ' (HML).';
          if (!isFinite(lon) || !isFinite(mp)) { passos.appendChild(h('li', { class: 'ra-msg' }, 'Preencha a longitude e a HML da passagem.')); return; }
          if (auto.checked) fFu.value = String(fusoTeorico(lon));
          var fu = Number(fFu.value), lt = -lon / 15, hmg = mp + lt, hleg = hmg - fu;
          passos.appendChild(passo(1, 'HML da passagem meridiana superior (PMS)', ['Tirada do almanaque para o dia: ' + fHM(mp) + '. É 12h menos a equação do tempo: o Sol verdadeiro adianta ou atrasa até 16 minutos em relação ao Sol médio.'], 'HML da PMS = ' + fHM(mp)));
          passos.appendChild(passo(2, 'Longitude em tempo', [gm(Math.abs(lon), 1, true) + ' ÷ 15 = ' + fTempoDur(Math.abs(lt)) + '  (1° = 4 min; 1′ = 4 s)'], 'λ = ' + fTempoDur(Math.abs(lt)) + ' ' + (lon < 0 ? 'W' : 'E')));
          passos.appendChild(passo(3, 'Hora de Greenwich: HMG = HML ' + (lon < 0 ? '+ λ W' : '− λ E'), [fHM(mp) + (lon < 0 ? ' + ' : ' − ') + fTempoDur(Math.abs(lt))], 'HMG da PMS = ' + fHMS(hmg) + (hmg >= 24 ? ' (dia seguinte)' : hmg < 0 ? ' (dia anterior)' : '')));
          passos.appendChild(passo(4, 'Hora legal: HLeg = HMG − fuso', [fHMS(hmg) + ' − (' + (fu >= 0 ? '+' : '−') + Math.abs(fu) + 'h)'], 'HLeg ≈ ' + fHM(hleg) + ' (fuso ' + fFuso(fu) + ')',
            'Processo aproximado: arredonde ao minuto. Com o barco em movimento, refaça a conta com a longitude estimada para a hora prevista.'));
          res.appendChild(h('div', { class: 'ra-cartao' }, h('p', { class: 'ra-cartao-t' }, 'Hora legal prevista da culminação'), h('p', { class: 'ra-cartao-v' }, fHM(hleg) + '  ' + letraFuso(fu))));
          faixa.appendChild(figuraFaixa(lon, mp, hmg, hleg, fu));
        }
        fLon.on(calc); fMp.on(calc);
        preencherMp(); calc();
      }
      /** Faixa horária: Greenwich, o meridiano do barco e o meridiano central do fuso (oeste à esquerda). */
      function figuraFaixa(lon, mp, hmg, hleg, fu) {
        var svg = h('svg', { viewBox: '0 0 320 160', class: 'svg-interativo ra-faixa', role: 'img', 'aria-label': 'Meridiano de Greenwich, meridiano do barco e meridiano central do fuso, com as horas correspondentes.' });
        var zm = -fu * 15, lmin = Math.min(0, lon, zm) - 10, lmax = Math.max(0, lon, zm) + 10;
        function X(l) { return 20 + (l - lmin) / (lmax - lmin) * 280; }
        function t(x, y, s, cls) { var anc = x < 70 ? 'start' : x > 250 ? 'end' : 'middle'; var n = h('text', { x: x.toFixed(1), y: y, class: cls, 'text-anchor': anc }); n.textContent = s; return n; }
        svg.appendChild(h('line', { x1: 10, y1: 118, x2: 310, y2: 118, class: 'ra-fx-eq' }));
        svg.appendChild(t(12, 112, 'W', 'ra-fx-rot')); svg.appendChild(t(308, 112, 'E', 'ra-fx-rot'));
        var xg = X(0), xb = X(lon), xf = X(zm);
        [[xg, 'ra-fx-g'], [xf, 'ra-fx-f'], [xb, 'ra-fx-b']].forEach(function (m) { svg.appendChild(h('line', { x1: m[0].toFixed(1), y1: 36, x2: m[0].toFixed(1), y2: 124, class: 'ra-fx-mer ' + m[1] })); });
        svg.appendChild(t(xg, 14, 'Greenwich', 'ra-fx-rot')); svg.appendChild(t(xg, 30, 'HMG ' + fHM(hmg), 'ra-fx-hora ra-fx-g'));
        svg.appendChild(t(xf, 140, 'meridiano do fuso ' + letraFuso(fu), 'ra-fx-rot')); svg.appendChild(t(xf, 155, 'HLeg ' + fHM(hleg), 'ra-fx-hora ra-fx-f'));
        svg.appendChild(h('circle', { cx: xb.toFixed(1), cy: 74, r: 9, class: 'ra-fx-sol' }));
        var dir = xb > 160 ? -1 : 1;
        var tb = h('text', { x: (xb + dir * 15).toFixed(1), y: 70, class: 'ra-fx-rot', 'text-anchor': dir < 0 ? 'end' : 'start' }); tb.textContent = 'Sol no meridiano do barco';
        var tb2 = h('text', { x: (xb + dir * 15).toFixed(1), y: 86, class: 'ra-fx-hora ra-fx-b', 'text-anchor': dir < 0 ? 'end' : 'start' }); tb2.textContent = 'HML ' + fHM(mp);
        svg.appendChild(tb); svg.appendChild(tb2);
        return svg;
      }

      /* ---------------------------------------------------------------- hora: exercício */
      function horaExercicio(box) {
        var placar = { feitos: 0, certos: 0 };
        var cab = h('div', { class: 'ra-ex-cab' }), corpo = h('div', { class: 'ra-ex-corpo' });
        box.appendChild(cab); box.appendChild(corpo);
        var LUGARES = [
          ['ao largo de Fernando de Noronha', -3.8, -32.4], ['ao largo de Salvador', -13.1, -38.3], ['ao largo de Cabo Frio', -23.1, -41.8],
          ['ao largo de Rio Grande', -32.3, -51.8], ['a caminho de Santa Helena', -15.9, -5.7], ['nos Açores', 37.8, -25.6],
          ['no Caribe, a leste das Antilhas', 14.5, -58.0], ['a caminho da Cidade do Cabo', -34.0, 18.0], ['na travessia do Atlântico Sul', -20.0, -20.0],
          ['ao largo de Vitória', -20.4, -40.0], ['ao largo de Fortaleza', -3.5, -38.4], ['nas ilhas Canárias', 28.2, -15.6]];
        function novo() {
          var L = LUGARES[Math.floor(Math.random() * LUGARES.length)];
          var iso = dataMais('2026-01-01', Math.floor(Math.random() * 365));
          var lon = Math.round((L[2] + (Math.random() * 2 - 1) * 1.5) * 60) / 60, lat = L[1];
          var fu = fusoTeorico(lon), alm = almanaqueSol(iso);
          var lt = -lon / 15, hmg = alm.mpHML + lt, hleg = hmg - fu;
          corpo.innerHTML = '';
          cab.textContent = 'Feitos: ' + placar.feitos + ' · certos: ' + placar.certos;
          corpo.appendChild(h('p', { class: 'ra-enun' }, 'Em ' + fData(iso) + ', um veleiro ' + L[0] + ' (PE ' + fLat(lat) + ', ' + fLon(lon) + ') usa a hora legal do fuso ' + fFuso(fu) + '. O almanaque dá a passagem meridiana do Sol às ' + fHM(alm.mpHML) + ' (HML). A que hora legal o Sol vai culminar?'));
          var fR = campoHora({ rotulo: 'HLeg da culminação', semSeg: true });
          var fb = h('div', { 'aria-live': 'polite' });
          var btC = h('button', { type: 'button', class: 'btn btn-primary' }, 'Conferir');
          corpo.appendChild(h('section', { class: 'ra-bloco' }, fR.el, h('div', { class: 'btn-row' }, btC), fb));
          btC.addEventListener('click', function () {
            var v = fR.get();
            if (!isFinite(v)) { fb.innerHTML = ''; fb.appendChild(h('p', { class: 'ra-msg' }, 'Escreva a hora (horas e minutos) antes de conferir.')); return; }
            var ok = isFinite(v) && Math.abs(n180((v - hleg) * 15)) / 15 * 60 <= 1.01;
            placar.feitos++; if (ok) placar.certos++;
            var ol = h('ol', { class: 'ra-passos ra-passos-gab' });
            ol.appendChild(passo(1, 'Longitude em tempo', [gm(Math.abs(lon), 1, true) + ' ÷ 15 = ' + fTempoDur(Math.abs(lt)) + ' ' + (lon < 0 ? 'W' : 'E')], null));
            ol.appendChild(passo(2, 'HMG = HML ' + (lon < 0 ? '+ λ W' : '− λ E'), [fHM(alm.mpHML) + (lon < 0 ? ' + ' : ' − ') + fTempoDur(Math.abs(lt)) + ' = ' + fHMS(hmg)], null));
            ol.appendChild(passo(3, 'HLeg = HMG − fuso', [fHMS(hmg) + ' − (' + (fu >= 0 ? '+' : '−') + Math.abs(fu) + 'h) = ' + fHMS(hleg)], 'HLeg ≈ ' + fHM(hleg) + ' ' + letraFuso(fu)));
            fb.innerHTML = '';
            fb.appendChild(caixaFb(ok, ok ? 'Certo.' : 'Não foi dessa vez: o correto é ' + fHM(hleg) + '.', ol));
            fb.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novo }, 'Outro')));
            btC.disabled = true;
            cab.textContent = 'Feitos: ' + placar.feitos + ' · certos: ' + placar.certos;
          });
        }
        novo();
      }

      var CONSTRUIR = {
        'reta-explorar': retaExplorar, 'reta-exercicio': retaExercicio,
        'latitude-explorar': latExplorar, 'latitude-exercicio': latExercicio,
        'hora-explorar': horaExplorar, 'hora-exercicio': horaExercicio,
      };
      mostrar();

      limpezas.push(VL.on('settings', function (s) {
        var novo = !!(s && s.intl);
        if (novo === intl) return;
        intl = novo;
        /* reconstrói os painéis de explorar para trocar os termos em inglês */
        Object.keys(paineis).forEach(function (k) { if (/explorar$/.test(k)) { paineis[k].remove(); delete paineis[k]; } });
        mostrar();
      }));
      return function limpar() { limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } }); el.innerHTML = ''; };
    },
  });
})();
