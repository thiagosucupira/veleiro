/* Widget "esfera-celeste" — esfera celeste em 3D (Three.js), vista de fora ou do observador.
   Mostra horizonte, zênite/nadir, polos, equador celeste, meridiano, eclíptica, o Sol na data
   escolhida com seu arco diurno, estrelas de navegação (J2000 precessadas para a data) e o
   triângulo de posição Polo-Zênite-Astro com altura e azimute calculados.

   opts (todas opcionais; padrões entre parênteses):
     { lat: -22.9        (latitude do observador, −60…+60; padrão: a da base do usuário ou Rio de Janeiro),
       lon: -43.17       (longitude, E positiva),
       data: 'AAAA-MM-DD' (hoje),
       hora: 20          (hora média local, 0–24),
       vista: 'fora' | 'observador'  ('fora'),
       modo: 'explorar' | 'desafio'  ('explorar'),
       astro: 'sirius' | 'sol' | 'canopus' | …  (astro selecionado ao abrir; ids na lista ESTRELAS),
       titulo: 'texto da legenda' }

   Exemplo de bloco de lição:
     { t: 'widget', w: 'esfera-celeste', opts: { lat: -23, vista: 'observador', astro: 'acrux' } }

   Fórmulas: Sol pelas "low precision formulas" do Astronomical Almanac (precisão ~0,01° em
   declinação); tempo sideral médio de Greenwich (USNO); precessão IAU 1976 (Meeus, cap. 21);
   altura e azimute pelo triângulo de posição (Miguens, Navegação: a Ciência e a Arte, vol. II). */
(function () {
  'use strict';
  var h = VL.h;
  var RAD = Math.PI / 180;

  /* ------------------------------------------------------------------ astronomia */
  function n360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function n180(x) { x = n360(x); return x > 180 ? x - 360 : x; }
  function jdDeData(iso, horasUT) {
    var p = iso.split('-').map(Number);
    return Date.UTC(p[0], p[1] - 1, p[2]) / 86400000 + 2440587.5 + horasUT / 24;
  }
  function sol(jd) {
    var n = jd - 2451545.0;
    var L = n360(280.460 + 0.9856474 * n), g = n360(357.528 + 0.9856003 * n);
    var lam = L + 1.915 * Math.sin(g * RAD) + 0.020 * Math.sin(2 * g * RAD);
    var eps = 23.439 - 0.0000004 * n;
    var dec = Math.asin(Math.sin(eps * RAD) * Math.sin(lam * RAD)) / RAD;
    var ar = n360(Math.atan2(Math.cos(eps * RAD) * Math.sin(lam * RAD), Math.cos(lam * RAD)) / RAD);
    return { dec: dec, ar: ar, eotMin: n180(L - ar) * 4, eps: eps };
  }
  function tsmg(jd) { return n360((18.697374558 + 24.06570982441908 * (jd - 2451545.0)) * 15); }
  function precessar(ar, dec, jd) {
    var T = (jd - 2451545) / 36525, s = 1 / 3600;
    var ze = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T * T * T) * s;
    var z = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T * T * T) * s;
    var th = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T * T * T) * s;
    var A = Math.cos(dec * RAD) * Math.sin((ar + ze) * RAD);
    var B = Math.cos(th * RAD) * Math.cos(dec * RAD) * Math.cos((ar + ze) * RAD) - Math.sin(th * RAD) * Math.sin(dec * RAD);
    var C = Math.sin(th * RAD) * Math.cos(dec * RAD) * Math.cos((ar + ze) * RAD) + Math.cos(th * RAD) * Math.sin(dec * RAD);
    return { ar: n360(Math.atan2(A, B) / RAD + z), dec: Math.asin(C) / RAD };
  }
  /** Altura e azimute a partir de latitude, AHL e declinação (graus). */
  function alturaAzimute(phi, ahl, dec) {
    var sa = Math.sin(phi * RAD) * Math.sin(dec * RAD) + Math.cos(phi * RAD) * Math.cos(dec * RAD) * Math.cos(ahl * RAD);
    var a = Math.asin(Math.max(-1, Math.min(1, sa))) / RAD;
    var az = n360(Math.atan2(-Math.cos(dec * RAD) * Math.sin(ahl * RAD),
      Math.cos(phi * RAD) * Math.sin(dec * RAD) - Math.sin(phi * RAD) * Math.cos(dec * RAD) * Math.cos(ahl * RAD)) / RAD);
    return { a: a, az: az };
  }

  /* Estrelas: AR (h m s) e Dec (° ′ ″) J2000, catálogo Hipparcos; magnitude visual. */
  var ESTRELAS = [
    ['sirius', 'Sirius', 'Cão Maior', [6, 45, 8.92], [-16, 42, 58.0], -1.46, 'A estrela mais brilhante do céu noturno.'],
    ['canopus', 'Canopus', 'Quilha', [6, 23, 57.11], [-52, 41, 44.4], -0.74, 'A segunda mais brilhante. No Brasil passa alta no céu nas noites de verão.'],
    ['rigilkent', 'Rigil Kentaurus', 'Centauro', [14, 39, 36.49], [-60, 50, 2.4], -0.27, 'Alfa do Centauro. Com Hadar, aponta para o Cruzeiro do Sul.'],
    ['arcturus', 'Arcturus', 'Boieiro', [14, 15, 39.67], [19, 10, 56.7], -0.05, 'A mais brilhante do hemisfério norte celeste.'],
    ['vega', 'Vega', 'Lira', [18, 36, 56.34], [38, 47, 1.3], 0.03, 'Muito brilhante, baixa no céu do norte para quem está no Brasil.'],
    ['capella', 'Capella', 'Cocheiro', [5, 16, 41.36], [45, 59, 52.8], 0.08, 'Vista baixa no horizonte norte nas noites de verão no Sul do Brasil.'],
    ['rigel', 'Rigel', 'Órion', [5, 14, 32.27], [-8, 12, 5.9], 0.13, 'O "pé" azulado de Órion.'],
    ['procyon', 'Procyon', 'Cão Menor', [7, 39, 18.12], [5, 13, 30.0], 0.34, 'Forma com Sirius e Betelgeuse o "triângulo de inverno" do hemisfério norte.'],
    ['achernar', 'Achernar', 'Erídano', [1, 37, 42.85], [-57, 14, 12.3], 0.46, 'Fim do rio Erídano. Só é circumpolar no extremo sul do Brasil, ao sul de cerca de 33° S.'],
    ['betelgeuse', 'Betelgeuse', 'Órion', [5, 55, 10.31], [7, 24, 25.4], 0.42, 'Supergigante vermelha; brilho variável.'],
    ['hadar', 'Hadar', 'Centauro', [14, 3, 49.41], [-60, 22, 22.9], 0.61, 'Beta do Centauro.'],
    ['altair', 'Altair', 'Águia', [19, 50, 46.99], [8, 52, 6.0], 0.76, 'Perto do equador celeste (δ ≈ 9° N): nasce quase no Leste.'],
    ['acrux', 'Acrux', 'Cruzeiro do Sul', [12, 26, 35.90], [-63, 5, 56.7], 0.76, 'O pé do Cruzeiro do Sul (no Brasil, "Estrela de Magalhães").'],
    ['aldebaran', 'Aldebaran', 'Touro', [4, 35, 55.24], [16, 30, 33.5], 0.86, 'O "olho" alaranjado do Touro.'],
    ['antares', 'Antares', 'Escorpião', [16, 29, 24.46], [-26, 25, 55.2], 0.96, 'O coração avermelhado do Escorpião.'],
    ['spica', 'Spica', 'Virgem', [13, 25, 11.58], [-11, 9, 40.8], 0.97, 'Perto da eclíptica: a Lua e os planetas passam perto dela.'],
    ['pollux', 'Pollux', 'Gêmeos', [7, 45, 18.95], [28, 1, 34.3], 1.14, 'A mais brilhante dos Gêmeos.'],
    ['fomalhaut', 'Fomalhaut', 'Peixe Austral', [22, 57, 39.05], [-29, 37, 20.1], 1.16, 'Estrela brilhante e solitária no céu de primavera do Brasil.'],
    ['deneb', 'Deneb', 'Cisne', [20, 41, 25.92], [45, 16, 49.2], 1.25, 'Cauda do Cisne; baixa no horizonte norte para quem está no Brasil.'],
    ['mimosa', 'Mimosa', 'Cruzeiro do Sul', [12, 47, 43.27], [-59, 41, 19.6], 1.25, 'Braço leste do Cruzeiro (Beta Crucis).'],
    ['regulus', 'Regulus', 'Leão', [10, 8, 22.31], [11, 58, 2.0], 1.35, 'Fica quase sobre a eclíptica.'],
    ['gacrux', 'Gacrux', 'Cruzeiro do Sul', [12, 31, 9.96], [-57, 6, 47.6], 1.64, 'Topo do Cruzeiro (no Brasil, "Rubídea"); é avermelhada.'],
    ['deltacru', 'Pálida', 'Cruzeiro do Sul', [12, 15, 8.72], [-58, 44, 56.1], 2.79, 'Delta Crucis, braço oeste do Cruzeiro.'],
    ['epscru', 'Intrometida', 'Cruzeiro do Sul', [12, 21, 21.61], [-60, 24, 4.1], 3.59, 'Épsilon Crucis, a pequena estrela fora da cruz.'],
    ['polaris', 'Polaris', 'Ursa Menor', [2, 31, 49.09], [89, 15, 50.8], 1.98, 'A menos de 1° do polo norte celeste. Do hemisfério sul fica abaixo do horizonte.'],
  ].map(function (e) {
    var ar = (e[3][0] + e[3][1] / 60 + e[3][2] / 3600) * 15;
    var sg = e[4][0] < 0 ? -1 : 1;
    var dec = sg * (Math.abs(e[4][0]) + e[4][1] / 60 + e[4][2] / 3600);
    return { id: e[0], nome: e[1], const: e[2], ar0: ar, dec0: dec, mag: e[5], nota: e[6], tipo: 'estrela' };
  });
  var CRUZEIRO = ['acrux', 'mimosa', 'gacrux', 'deltacru', 'epscru'];
  var CIDADES = [
    { nome: 'Belém', lat: -1.455, lon: -48.49 },
    { nome: 'Fortaleza', lat: -3.72, lon: -38.54 },
    { nome: 'Salvador', lat: -12.97, lon: -38.51 },
    { nome: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
    { nome: 'Florianópolis', lat: -27.6, lon: -48.55 },
    { nome: 'Rio Grande', lat: -32.04, lon: -52.1 },
  ];

  /* ------------------------------------------------------------------ formatação */
  function num(x, c) { return x.toFixed(c).replace('.', ','); }
  function gm(x, c, pad3) {
    c = c == null ? 1 : c;
    var d = Math.floor(x + 1e-9), m = (x - d) * 60, mr = Number(m.toFixed(c));
    if (mr >= 60) { d += 1; mr = 0; }
    var ds = pad3 ? String(d).padStart(3, '0') : String(d);
    return ds + '° ' + (mr < 10 ? '0' : '') + num(mr, c) + '′';
  }
  function fLat(v) { return Math.abs(v) < 1e-6 ? '0° 00,0′' : gm(Math.abs(v)) + ' ' + (v > 0 ? 'N' : 'S'); }
  function fLon(v) { return gm(Math.abs(v), 1, true) + ' ' + (v >= 0 ? 'E' : 'W'); }
  function fDec(v) { return gm(Math.abs(v)) + ' ' + (v >= 0 ? 'N' : 'S'); }
  function fAng(v) { return (v < 0 ? '−' : '') + gm(Math.abs(v)); }
  function fAz(v) { var r = Math.round(n360(v) * 10) / 10; if (r >= 360) r = 0; return num(r, 1).padStart(5, '0') + '°'; }
  function fHora(hh) {
    hh = ((hh % 24) + 24) % 24; var t = Math.round(hh * 60) % 1440;
    return String(Math.floor(t / 60)).padStart(2, '0') + 'h ' + String(t % 60).padStart(2, '0') + 'min';
  }
  function fAR(ar) { var t = Math.round(ar / 15 * 3600); var hh = Math.floor(t / 3600), mm = Math.floor(t % 3600 / 60), ss = t % 60; return hh + 'h ' + String(mm).padStart(2, '0') + 'm ' + String(ss).padStart(2, '0') + 's'; }
  function hojeISO() { return VL.hoje ? VL.hoje() : new Date().toISOString().slice(0, 10); }

  /* ------------------------------------------------------------------ textos */
  var ELEMENTOS = {
    zenite: { t: 'Zênite (Z)', en: 'zenith', x: 'O ponto do céu bem acima da sua cabeça, na vertical do lugar. Fica a 90° do horizonte em todas as direções. A distância zenital de um astro é z = 90° − a.' },
    nadir: { t: 'Nadir', en: 'nadir', x: 'O ponto oposto ao zênite, bem abaixo dos seus pés, do outro lado da esfera.' },
    horizonte: { t: 'Horizonte', en: 'celestial horizon', x: 'O plano que passa pelo observador e é perpendicular à vertical. Divide o céu na metade visível e na escondida. A altura (a) de um astro é medida a partir dele, de 0° a 90°; o azimute (Az), no horizonte, a partir do Norte, de 000° a 360° pelo Leste.' },
    polos: { t: 'Polos celestes (PN e PS)', en: 'celestial poles', x: 'Os prolongamentos do eixo da Terra no céu. O céu parece girar em torno deles. O polo acima do horizonte é o polo elevado, e sua altura é igual à latitude do observador.' },
    equador: { t: 'Equador celeste', en: 'celestial equator', x: 'O prolongamento do equador da Terra no céu, a 90° dos polos. A declinação (δ) de um astro é medida a partir dele, para N ou S, como a latitude na Terra.' },
    meridiano: { t: 'Meridiano do observador', en: 'observer’s meridian', x: 'O círculo que passa pelos polos e pelo seu zênite e corta o horizonte nos pontos Norte e Sul. Quando um astro cruza o meridiano, está na passagem meridiana (culminação): é a maior altura do dia.' },
    ecliptica: { t: 'Eclíptica', en: 'ecliptic', x: 'O caminho aparente do Sol entre as estrelas ao longo do ano, inclinado cerca de 23,4° em relação ao equador. Por isso a declinação do Sol varia entre 23,4° S e 23,4° N.' },
    arco: { t: 'Arco diurno', en: 'diurnal circle', x: 'O caminho de um astro no céu ao longo de um dia: um círculo paralelo ao equador celeste. Para o Sol, a parte acima do horizonte é o dia. Estrelas cujo círculo fica todo acima do horizonte são circumpolares.' },
    vernal: { t: 'Ponto vernal (γ)', en: 'first point of Aries', x: 'Onde o Sol cruza o equador indo para o norte (por volta de 20 de março). É a origem da ascensão reta (AR) e do ângulo horário sideral (AHS = 360° − AR) das estrelas.' },
    triangulo: { t: 'Triângulo de posição', en: 'navigational triangle', x: 'Triângulo esférico com vértices no polo elevado (P), no zênite (Z) e no astro (A). Lados: PZ = 90° − φ (colatitude), PA = distância polar (90° − δ, com δ contada para o lado do polo elevado) e ZA = 90° − a (distância zenital). O ângulo em P é o ângulo no polo (t), que vem do AHL; o ângulo em Z dá o azimute.' },
    cardeais: { t: 'Pontos cardeais', en: 'cardinal points', x: 'Norte (N), Leste (E), Sul (S) e Oeste (W) no horizonte, como nas cartas náuticas. O meridiano corta o horizonte em N e S; o equador celeste corta em E e W.' },
    angulos: { t: 'Ângulo horário (AHG e AHL)', en: 'GHA and LHA', x: 'Ângulo medido no equador celeste, para oeste, do meridiano de Greenwich (AHG) ou do seu meridiano (AHL) até o círculo horário do astro. Cresce cerca de 15° por hora. AHL = AHG + longitude E, ou AHG − longitude W.' },
  };
  var PONTOS_TXT = { zenite: 'zenite', nadir: 'nadir', pn: 'polos', ps: 'polos', N: 'cardeais', E: 'cardeais', S: 'cardeais', W: 'cardeais', vernal: 'vernal' };
  var PONTOS_NOME = { zenite: 'Zênite', nadir: 'Nadir', pn: 'Polo Norte celeste', ps: 'Polo Sul celeste', N: 'Norte', E: 'Leste', S: 'Sul', W: 'Oeste', vernal: 'Ponto vernal' };

  /** Testa WebGL sem acionar o Three.js (evita erros no console quando não há suporte). */
  function temWebGL() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ widget */
  VL.widgets.define('esfera-celeste', {
    css: ['assets/css/widgets/esfera-celeste.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [];
      var intl = !!VL.settings.get('intl');
      var reduzMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var latBase = VL.settings.get('lat'), lonBase = VL.settings.get('lon');
      var st = {
        lat: isFinite(+opts.lat) && opts.lat != null && opts.lat !== '' ? Math.max(-60, Math.min(60, +opts.lat)) : (latBase != null && Math.abs(latBase) <= 60 ? +latBase : -22.91),
        lon: isFinite(+opts.lon) && opts.lon != null && opts.lon !== '' ? n180(+opts.lon) : (lonBase != null ? +lonBase : -43.17),
        data: /^\d{4}-\d{2}-\d{2}$/.test(opts.data || '') && isFinite(Date.parse(opts.data)) ? opts.data : hojeISO(),
        hml: isFinite(+opts.hora) && opts.hora != null && opts.hora !== '' ? Math.max(0, Math.min(24, +opts.hora)) : 20,
        vista: opts.vista === 'observador' ? 'obs' : 'fora',
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        sel: opts.astro || null,
        nomes: true, ecl: true, arco: true, tri: true, cruz: false,
        tocando: false,
      };
      function en(t) { return intl && t ? ' (' + t + ')' : ''; }

      /* ---------- moldura e controles ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Esfera celeste: o céu visto do seu lugar', controlesAntes: true });
      el.appendChild(ins.raiz);
      var segVista = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Ponto de vista' });
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['fora', 'Vista de fora'], ['obs', 'Vista do observador']].forEach(function (v) {
        segVista.appendChild(h('button', { type: 'button', 'data-v': v[0], 'aria-pressed': String(st.vista === v[0]), onclick: function () { mudarVista(v[0]); } }, v[1]));
      });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (v) {
        segModo.appendChild(h('button', { type: 'button', 'data-m': v[0], 'aria-pressed': String(st.modo === v[0]), onclick: function () { mudarModo(v[0]); } }, v[1]));
      });
      ins.controles.appendChild(segVista);
      ins.controles.appendChild(segModo);
      ins.legenda.appendChild(h('span', { class: 'ec-fonte' }, 'Fórmulas: Astronomical Almanac (Sol), USNO (tempo sideral), Meeus cap. 21 (precessão); Miguens, Navegação: a Ciência e a Arte, vol. II (DHN).'));

      var cena = h('div', { class: 'ec-cena' });
      var canvasBox = h('div', { class: 'ec-canvas cena-3d', role: 'img', 'aria-label': 'Esfera celeste em 3D. Arraste para girar, use a lista de astros abaixo para escolher um astro.' });
      var rotulos = h('div', { class: 'ec-rotulos', 'aria-hidden': 'true' });
      var hud = h('div', { class: 'ec-hud', 'aria-live': 'polite' });
      var dica = h('div', { class: 'ec-dica' }, 'Arraste para girar. Toque num astro ou num ponto.');
      cena.appendChild(canvasBox); cena.appendChild(rotulos); cena.appendChild(hud); cena.appendChild(dica);
      ins.corpo.appendChild(cena);
      var paineis = h('div', { class: 'ec-paineis' });
      ins.corpo.appendChild(paineis);

      /* ---------- painel: observador ---------- */
      var latOut = h('output', { class: 'ec-valor' });
      var latIn = h('input', { type: 'range', min: '-60', max: '60', step: '0.5', value: String(st.lat), 'aria-label': 'Latitude do observador' });
      latIn.addEventListener('input', function () { st.lat = +latIn.value; atualizarTudo(); });
      var lonOut = h('output', { class: 'ec-valor' });
      var lonIn = h('input', { type: 'range', min: '-180', max: '180', step: '0.5', value: String(st.lon), 'aria-label': 'Longitude do observador' });
      lonIn.addEventListener('input', function () { st.lon = +lonIn.value; atualizarTudo(); });
      var chips = h('div', { class: 'chip-list ec-chips' });
      CIDADES.forEach(function (c) {
        chips.appendChild(h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: function () {
          st.lat = c.lat; st.lon = c.lon; latIn.value = String(Math.round(c.lat * 2) / 2); lonIn.value = String(Math.round(c.lon * 2) / 2); atualizarTudo();
        } }, c.nome));
      });
      paineis.appendChild(h('section', { class: 'ec-bloco', 'aria-label': 'Observador' },
        h('h4', null, 'Onde você está'),
        h('label', { class: 'ec-campo' }, h('span', null, 'Latitude (φ)'), latOut), latIn,
        h('label', { class: 'ec-campo' }, h('span', null, 'Longitude (λ)'), lonOut), lonIn,
        chips));

      /* ---------- painel: data e hora ---------- */
      var dataIn = h('input', { type: 'date', value: st.data, 'aria-label': 'Data', class: 'ec-data' });
      dataIn.addEventListener('change', function () { if (/^\d{4}-\d{2}-\d{2}$/.test(dataIn.value)) { st.data = dataIn.value; atualizarTudo(); } });
      var horaOut = h('output', { class: 'ec-valor' });
      var horaIn = h('input', { type: 'range', min: '0', max: '24', step: '0.0833333', value: String(st.hml), 'aria-label': 'Hora média local' });
      horaIn.addEventListener('input', function () { st.hml = +horaIn.value; atualizarTudo(); });
      var btPlay = h('button', { type: 'button', class: 'btn btn-primary', 'aria-pressed': 'false', onclick: function () { alternarPlay(); } }, 'Girar o céu');
      var btMenos = h('button', { type: 'button', class: 'btn btn-ghost', 'aria-label': 'Voltar uma hora', onclick: function () { passo(-1); } }, '−1 h');
      var btMais = h('button', { type: 'button', class: 'btn btn-ghost', 'aria-label': 'Avançar uma hora', onclick: function () { passo(1); } }, '+1 h');
      var btAgora = h('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { agora(); } }, 'Agora');
      var tempos = h('dl', { class: 'ec-dl' });
      paineis.appendChild(h('section', { class: 'ec-bloco', 'aria-label': 'Data e hora' },
        h('h4', null, 'Data e hora'),
        h('label', { class: 'ec-campo' }, h('span', null, 'Dia'), dataIn),
        h('label', { class: 'ec-campo' }, h('span', null, 'Hora média local (HML)'), horaOut), horaIn,
        h('div', { class: 'btn-row' }, btPlay, btMenos, btMais, btAgora),
        tempos));

      /* ---------- painel: camadas ---------- */
      function sw(rot, chave) {
        var i = h('input', { type: 'checkbox', role: 'switch' });
        i.checked = !!st[chave];
        i.addEventListener('change', function () { st[chave] = i.checked; aplicarCamadas(); marcar(); });
        return h('label', { class: 'switch ec-switch' }, i, h('span', null, rot));
      }
      paineis.appendChild(h('section', { class: 'ec-bloco', 'aria-label': 'Mostrar' },
        h('h4', null, 'Mostrar'),
        sw('Nomes das estrelas', 'nomes'), sw('Eclíptica', 'ecl'), sw('Arco diurno do Sol', 'arco'),
        sw('Triângulo de posição', 'tri'), sw('Achar o polo sul pelo Cruzeiro', 'cruz')));

      /* ---------- painel: astro / elementos / desafio ---------- */
      var selAstro = h('select', { 'aria-label': 'Escolher astro', class: 'ec-select' });
      selAstro.appendChild(h('option', { value: '' }, 'Escolha um astro…'));
      selAstro.appendChild(h('option', { value: 'sol' }, 'Sol'));
      ESTRELAS.slice().sort(function (a, b) { return a.nome.localeCompare(b.nome); }).forEach(function (e) {
        selAstro.appendChild(h('option', { value: e.id }, e.nome + ' (' + e.const + ')'));
      });
      selAstro.addEventListener('change', function () { selecionar(selAstro.value || null); });
      var infoAstro = h('div', { class: 'ec-info', 'aria-live': 'polite' });
      var blocoAstro = h('section', { class: 'ec-bloco ec-bloco-largo', 'aria-label': 'Astro selecionado' },
        h('h4', null, 'Astro ou ponto selecionado'), selAstro, infoAstro);
      var elChips = h('div', { class: 'chip-list' });
      var elTexto = h('div', { class: 'ec-eltexto', 'aria-live': 'polite' });
      var blocoEl = h('section', { class: 'ec-bloco ec-bloco-largo', 'aria-label': 'Elementos da esfera' },
        h('h4', null, 'Elementos da esfera celeste'), elChips, elTexto);
      var blocoDesafio = h('section', { class: 'ec-bloco ec-bloco-largo ec-desafio', 'aria-label': 'Desafio', hidden: true });
      paineis.insertBefore(blocoDesafio, paineis.firstChild);
      paineis.insertBefore(blocoAstro, paineis.firstChild);
      paineis.appendChild(blocoEl);
      var elAtivo = null;
      function montarChipsElementos() {
        elChips.innerHTML = '';
        Object.keys(ELEMENTOS).forEach(function (k) {
          elChips.appendChild(h('button', { type: 'button', class: 'chip', 'aria-pressed': String(elAtivo === k), onclick: function () { mostrarElemento(k); } }, ELEMENTOS[k].t));
        });
      }
      function mostrarElemento(k) {
        elAtivo = k;
        VL.$$('button', elChips).forEach(function (b, i) { b.setAttribute('aria-pressed', String(Object.keys(ELEMENTOS)[i] === k)); });
        var E = ELEMENTOS[k];
        elTexto.innerHTML = '';
        elTexto.appendChild(h('p', null, h('strong', null, E.t + en(E.en) + '. '), E.x));
        destacar(k);
      }
      montarChipsElementos();

      /* ---------- estado astronômico ---------- */
      var ast = {};
      function calcular() {
        var hmg = st.hml - st.lon / 15;
        var jd = jdDeData(st.data, hmg);
        var s = sol(jd);
        var gst = tsmg(jd);
        var lst = n360(gst + st.lon);
        var jd0 = jdDeData(st.data, 12);
        if (ast.jdPrec == null || Math.abs(ast.jdPrec - jd0) > 0.5) {
          ESTRELAS.forEach(function (e) { var p = precessar(e.ar0, e.dec0, jd0); e.ar = p.ar; e.dec = p.dec; });
          ast.jdPrec = jd0;
        }
        ast.jd = jd; ast.hmg = hmg; ast.sol = s; ast.gst = gst; ast.lst = lst;
      }
      function corpo(id) {
        if (id === 'sol') return { id: 'sol', nome: 'Sol', ar: ast.sol.ar, dec: ast.sol.dec, tipo: 'sol', nota: 'Declinação calculada para o dia e a hora escolhidos.' };
        for (var i = 0; i < ESTRELAS.length; i++) if (ESTRELAS[i].id === id) return ESTRELAS[i];
        return null;
      }
      function posCorpo(c) {
        var ahg = n360(ast.gst - c.ar), ahl = n360(ahg + st.lon);
        var aa = alturaAzimute(st.lat, ahl, c.dec);
        return { ahg: ahg, ahl: ahl, a: aa.a, az: aa.az, ahs: n360(360 - c.ar) };
      }

      /* ---------- textos dos painéis ---------- */
      function atualizarPaineis() {
        latOut.textContent = fLat(st.lat);
        lonOut.textContent = fLon(st.lon);
        horaOut.textContent = fHora(st.hml);
        var dia = '';
        if (ast.hmg < 0) dia = ' (dia anterior)'; else if (ast.hmg >= 24) dia = ' (dia seguinte)';
        tempos.innerHTML = '';
        [['HMG (Greenwich)', fHora(ast.hmg) + dia], ['Hora sideral local', fHora(ast.lst / 15)],
          ['AHG do ponto vernal (γ)', gm(ast.gst, 1, true)], ['Declinação do Sol', fDec(ast.sol.dec)]].forEach(function (r) {
          tempos.appendChild(h('dt', null, r[0])); tempos.appendChild(h('dd', null, r[1]));
        });
        hud.textContent = fLat(st.lat) + '  ·  ' + st.data.split('-').reverse().join('/') + '  ·  HML ' + fHora(st.hml);
        atualizarInfo(); resumoSel();
      }
      function linha(dl, a, b) { dl.appendChild(h('dt', null, a)); dl.appendChild(h('dd', null, b)); }
      function atualizarInfo() {
        infoAstro.innerHTML = '';
        if (!st.sel) { infoAstro.appendChild(h('p', { class: 'muted' }, 'Toque num astro na esfera ou escolha na lista para ver declinação, ângulos horários, altura e azimute.')); return; }
        if (PONTOS_TXT[st.sel]) { infoPonto(st.sel); return; }
        var c = corpo(st.sel); if (!c) return;
        var p = posCorpo(c);
        var acima = p.a > 0;
        infoAstro.appendChild(h('p', { class: 'ec-nome' }, h('strong', null, c.nome), c.const ? h('span', { class: 'muted' }, ' · ' + c.const + (c.mag != null ? ' · magnitude ' + num(c.mag, 1).replace('-', '−') : '')) : null));
        if (c.nota) infoAstro.appendChild(h('p', { class: 'ec-nota' }, c.nota));
        var dl = h('dl', { class: 'ec-dl' });
        linha(dl, 'Declinação (δ)', fDec(c.dec));
        if (c.tipo === 'sol') linha(dl, 'Ascensão reta (AR)', fAR(c.ar));
        else linha(dl, 'Ângulo horário sideral (AHS)' + en('SHA'), gm(p.ahs, 1, true));
        linha(dl, 'AHG' + en('GHA'), gm(p.ahg, 1, true));
        linha(dl, 'AHL' + en('LHA') + ' = AHG ' + (st.lon >= 0 ? '+ λ E' : '− λ W'), gm(p.ahl, 1, true));
        var t = p.ahl <= 180 ? p.ahl : 360 - p.ahl;
        linha(dl, 'Ângulo no polo (t)', gm(t, 1) + (p.ahl <= 180 ? ' W' : ' E'));
        linha(dl, 'Altura (a)' + en('altitude'), fAng(p.a));
        linha(dl, 'Azimute verdadeiro (Az)' + en('Zn'), fAz(p.az));
        linha(dl, 'Distância zenital (z = 90° − a)', gm(90 - p.a, 1));
        infoAstro.appendChild(dl);
        var estado = acima ? 'Acima do horizonte' : 'Abaixo do horizonte (não visível agora)';
        var circ = Math.abs(c.dec) >= 90 - Math.abs(st.lat) && c.dec * st.lat > 0;
        var nunca = Math.abs(c.dec) >= 90 - Math.abs(st.lat) && c.dec * st.lat < 0;
        infoAstro.appendChild(h('p', { class: 'ec-estado', 'data-ok': acima ? '1' : '0' }, estado + (circ ? '. Nesta latitude é circumpolar: nunca se põe.' : nunca ? '. Nesta latitude nunca nasce.' : '.')));
        if (c.tipo === 'sol') infoSol(c);
        infoAstro.appendChild(infoTriangulo(c, p));
      }
      function infoSol(c) {
        var d = c.dec, phi = st.lat;
        var x = -Math.tan(phi * RAD) * Math.tan(d * RAD);
        var E = ast.sol.eotMin / 60;
        var pms = 12 - E;
        var dl = h('dl', { class: 'ec-dl' });
        linha(dl, 'Passagem meridiana (HML)', fHora(pms));
        linha(dl, 'Altura na passagem meridiana', gm(90 - Math.abs(phi - d), 1));
        if (x > -1 && x < 1) {
          var H0 = Math.acos(x) / RAD;
          var amp = Math.acos(Math.max(-1, Math.min(1, Math.sin(d * RAD) / Math.cos(phi * RAD)))) / RAD;
          linha(dl, 'Nascer (HML) e azimute', fHora(pms - H0 / 15) + ' · ' + fAz(amp));
          linha(dl, 'Pôr (HML) e azimute', fHora(pms + H0 / 15) + ' · ' + fAz(360 - amp));
          linha(dl, 'Duração do dia', fHora(2 * H0 / 15).replace('min', ' min'));
        } else linha(dl, 'Neste dia', x <= -1 ? 'o Sol não se põe' : 'o Sol não nasce');
        infoAstro.appendChild(dl);
        infoAstro.appendChild(h('p', { class: 'ec-nota' }, 'Nascer e pôr do centro do Sol no horizonte, sem refração: o nascer e o pôr visíveis diferem alguns minutos.'));
      }
      function infoTriangulo(c, p) {
        var poloN = st.lat >= 0;
        var pd = poloN ? 90 - c.dec : 90 + c.dec;
        var t = p.ahl <= 180 ? p.ahl : 360 - p.ahl;
        var box = h('details', { class: 'ec-tri' });
        box.appendChild(h('summary', null, 'Triângulo de posição P·Z·A'));
        var dl = h('dl', { class: 'ec-dl' });
        linha(dl, 'PZ = 90° − φ (colatitude)', gm(90 - Math.abs(st.lat), 1));
        linha(dl, 'PA = distância polar', gm(pd, 1));
        linha(dl, 'ZA = 90° − a (distância zenital)', gm(90 - p.a, 1));
        linha(dl, 'Ângulo em P = t', gm(t, 1));
        box.appendChild(dl);
        var sphi = Math.sin(st.lat * RAD), sd = Math.sin(c.dec * RAD), cphi = Math.cos(st.lat * RAD), cd = Math.cos(c.dec * RAD), ch = Math.cos(p.ahl * RAD);
        box.appendChild(h('p', { class: 'ec-formula' },
          'sen a = sen φ · sen δ + cos φ · cos δ · cos AHL', h('br'),
          '= ' + num(sphi, 4) + ' × ' + num(sd, 4) + ' + ' + num(cphi, 4) + ' × ' + num(cd, 4) + ' × ' + num(ch, 4) + ' = ' + num(Math.sin(p.a * RAD), 4), h('br'),
          'a = ' + fAng(p.a)));
        box.appendChild(h('p', { class: 'ec-nota' }, 'Polo elevado: ' + (poloN ? 'Norte' : 'Sul') + ' (o mesmo nome da latitude). Fonte: Miguens, Navegação: a Ciência e a Arte, vol. II.'));
        return box;
      }
      function infoPonto(id) {
        var k = PONTOS_TXT[id], E = ELEMENTOS[k];
        infoAstro.appendChild(h('p', { class: 'ec-nome' }, h('strong', null, PONTOS_NOME[id])));
        infoAstro.appendChild(h('p', null, E.x));
        if (id === 'pn' || id === 'ps') {
          var alt = id === 'pn' ? st.lat : -st.lat;
          infoAstro.appendChild(h('p', { class: 'ec-estado', 'data-ok': alt > 0 ? '1' : '0' }, 'Altura deste polo: ' + fAng(alt) + (alt > 0 ? ' — é o polo elevado (igual à latitude).' : alt < 0 ? ' — está abaixo do horizonte.' : ' — no horizonte (observador no equador).')));
        }
      }

      /* ---------- Three.js ---------- */
      var T, renderer, cssR, scene, camera, controls, grupoCeu, mats = [], geos = [], texs = [];
      var obj = {};
      var rodando = false, visivel = true, sujo = true, raf = 0, ultimo = 0;
      var falhou = false, lim3d = [], recriacoes = 0;
      var olhar = { yaw: 180, pitch: 22, fov: 70 };

      function cor(token) { return new T.Color(VL.cssVar(token) || '#888888'); }
      function mat(Tipo, token, extra) {
        var m = new Tipo(Object.assign({ color: cor(token) }, extra || {}));
        m.userData.token = token; mats.push(m); return m;
      }
      function geo(g) { geos.push(g); return g; }
      function rotulo(txt, classe, centro) {
        var d = h('div', { class: 'ec-rot ' + (classe || '') }, txt);
        var o = new T.CSS2DObject(d);
        if (centro) o.center.set(centro[0], centro[1]);
        return o;
      }
      function horiz(az, alt) { return new T.Vector3(Math.sin(az * RAD) * Math.cos(alt * RAD), Math.sin(alt * RAD), -Math.cos(az * RAD) * Math.cos(alt * RAD)); }
      function eqLocal(ar, dec) { return new T.Vector3(Math.cos(dec * RAD) * Math.cos(ar * RAD), Math.cos(dec * RAD) * Math.sin(ar * RAD), Math.sin(dec * RAD)); }
      /* anel com versão grossa (vista de fora) e fina (vista de dentro) */
      var aneis = [];
      function anel(token, tubo) {
        var m = mat(T.MeshBasicMaterial, token);
        var g = new T.Group();
        var a = new T.Mesh(geo(new T.TorusGeometry(1, tubo, 6, 160)), m);
        var b = new T.Mesh(geo(new T.TorusGeometry(1, tubo * 0.32, 4, 240)), m);
        a.userData.fora = true; b.userData.obs = true;
        g.add(a); g.add(b); aneis.push(g);
        return g;
      }
      function tuboPontos(pts, raio, m) {
        var curva = new T.CatmullRomCurve3(pts, false);
        var g = new T.TubeGeometry(curva, Math.max(8, pts.length * 2), raio, 6, false);
        return new T.Mesh(g, m);
      }
      function arcoGC(u, v, n) {
        var w = Math.acos(Math.max(-1, Math.min(1, u.dot(v)))), pts = [];
        if (w < 1e-4) return [u.clone(), v.clone()];
        for (var i = 0; i <= n; i++) {
          var t = i / n, a = Math.sin((1 - t) * w) / Math.sin(w), b = Math.sin(t * w) / Math.sin(w);
          pts.push(u.clone().multiplyScalar(a).add(v.clone().multiplyScalar(b)));
        }
        return pts;
      }
      function trocarMalha(nome, nova, pai) {
        var velha = obj[nome];
        if (velha) { (velha.parent || scene).remove(velha); if (velha.geometry) velha.geometry.dispose(); }
        obj[nome] = nova;
        if (nova) (pai || scene).add(nova);
      }

      function iniciar3D(THREE) {
        T = THREE;
        if (!vivo) return;
        if (!temWebGL()) { semWebGL(); return; }
        try {
          renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
        } catch (e) { semWebGL(); return; }
        if (!renderer || !renderer.getContext()) { semWebGL(); return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        canvasBox.appendChild(renderer.domElement);
        renderer.domElement.style.touchAction = 'none';
        /* perda do contexto WebGL: aviso, restauração (Three.js recria os recursos) ou recriação da cena (VL.gl3d, core/ui.js) */
        var vigia = VL.gl3d.vigiar(renderer.domElement, canvasBox, {
          restaurou: function () { redimensionar(); marcar(); },
          recriar: function () {
            if (!vivo || ++recriacoes > 2) return false;
            desmontar3D(); iniciar3D(T);
            return !!renderer;
          },
          falhou: function () { desmontar3D(); semWebGL(); },
        });
        lim3d.push(vigia.parar);
        cssR = new T.CSS2DRenderer({ element: rotulos });
        scene = new T.Scene();
        camera = new T.PerspectiveCamera(36, 1.6, 0.005, 50);
        controls = new T.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false; controls.enableDamping = false;
        controls.minDistance = 1.9; controls.maxDistance = 7;
        controls.rotateSpeed = 0.7;
        controls.addEventListener('change', marcar);

        /* casca e grade */
        obj.casca = new T.Mesh(geo(new T.SphereGeometry(1, 64, 40)), mat(T.MeshBasicMaterial, '--sea-2', { transparent: true, opacity: 0.10, side: T.DoubleSide, depthWrite: false }));
        scene.add(obj.casca);
        /* horizonte */
        obj.horizonte = new T.Mesh(geo(new T.CircleGeometry(1, 96)), mat(T.MeshBasicMaterial, '--sea-3', { transparent: true, opacity: 0.34, side: T.DoubleSide, depthWrite: false }));
        obj.horizonte.rotation.x = -Math.PI / 2;
        scene.add(obj.horizonte);
        obj.mar = new T.Mesh(geo(new T.CircleGeometry(1.02, 96)), mat(T.MeshBasicMaterial, '--sea-3', { side: T.DoubleSide }));
        obj.mar.rotation.x = -Math.PI / 2; obj.mar.position.y = -0.003; obj.mar.visible = false;
        scene.add(obj.mar);
        obj.horizBorda = anel('--ink', 0.006);
        obj.horizBorda.rotation.x = Math.PI / 2;
        scene.add(obj.horizBorda);
        /* meridiano (plano N-Z-S) */
        obj.meridiano = anel('--ink-2', 0.0045);
        obj.meridiano.rotation.y = Math.PI / 2;
        scene.add(obj.meridiano);
        /* vertical Z-Nadir */
        var gv = geo(new T.BufferGeometry().setFromPoints([new T.Vector3(0, -1, 0), new T.Vector3(0, 1, 0)]));
        obj.vertical = new T.Line(gv, mat(T.LineBasicMaterial, '--ink-3', { transparent: true, opacity: 0.7 }));
        scene.add(obj.vertical);
        /* pontos */
        var gPonto = geo(new T.SphereGeometry(0.022, 16, 12));
        obj.zen = new T.Mesh(gPonto, mat(T.MeshBasicMaterial, '--ink')); obj.zen.position.set(0, 1, 0); scene.add(obj.zen);
        obj.nad = new T.Mesh(gPonto, mat(T.MeshBasicMaterial, '--ink-3')); obj.nad.position.set(0, -1, 0); scene.add(obj.nad);
        obj.rZen = rotulo('Zênite', 'ec-rot-ponto', [-0.12, 0.5]); obj.rZen.position.set(0, 1, 0); scene.add(obj.rZen);
        obj.rNad = rotulo('Nadir', 'ec-rot-ponto ec-dim', [-0.12, 0.5]); obj.rNad.position.set(0, -1, 0); scene.add(obj.rNad);
        obj.card = {};
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(function (c) {
          var r = rotulo(c[0], 'ec-rot-card'); r.position.copy(horiz(c[1], 0).multiplyScalar(1.09)); scene.add(r); obj.card[c[0]] = r;
        });
        /* observador */
        var barco = new T.Group();
        var casco = new T.Mesh(geo(new T.SphereGeometry(0.05, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)), mat(T.MeshBasicMaterial, '--magenta'));
        casco.scale.set(0.45, 0.5, 1); barco.add(casco);
        var vela = new T.Mesh(geo(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, -0.02), new T.Vector3(0, 0.1, -0.005), new T.Vector3(0, 0, 0.035)])), mat(T.MeshBasicMaterial, '--magenta', { side: T.DoubleSide, transparent: true, opacity: 0.8 }));
        barco.add(vela);
        obj.barco = barco; scene.add(barco);
        obj.rVoce = rotulo('você', 'ec-rot-voce', [0.5, -0.6]); obj.rVoce.position.set(0, 0.04, 0); scene.add(obj.rVoce);

        /* céu (gira com o tempo sideral) */
        grupoCeu = new T.Group(); scene.add(grupoCeu);
        obj.equador = anel('--ok', 0.0055);
        grupoCeu.add(obj.equador);
        obj.paralelos = new T.Group();
        [-60, -30, 30, 60].forEach(function (d) {
          var m = new T.Mesh(geo(new T.TorusGeometry(Math.cos(d * RAD), 0.0016, 4, 120)), mat(T.MeshBasicMaterial, '--line', { transparent: true, opacity: 0.55 }));
          m.position.z = Math.sin(d * RAD); obj.paralelos.add(m);
        });
        for (var hc = 0; hc < 12; hc++) {
          var mh = new T.Mesh(geo(new T.TorusGeometry(1, 0.0014, 4, 120)), mat(T.MeshBasicMaterial, '--line', { transparent: true, opacity: 0.45 }));
          mh.rotation.x = Math.PI / 2; mh.rotation.y = hc * Math.PI / 12; obj.paralelos.add(mh);
        }
        grupoCeu.add(obj.paralelos);
        obj.ecliptica = anel('--land-ink', 0.0045);
        grupoCeu.add(obj.ecliptica);
        obj.eixo = new T.Line(geo(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, -1.12), new T.Vector3(0, 0, 1.12)])), mat(T.LineBasicMaterial, '--ink-2'));
        grupoCeu.add(obj.eixo);
        obj.pn = new T.Mesh(gPonto, mat(T.MeshBasicMaterial, '--ink')); obj.pn.position.set(0, 0, 1); grupoCeu.add(obj.pn);
        obj.ps = new T.Mesh(gPonto, mat(T.MeshBasicMaterial, '--ink')); obj.ps.position.set(0, 0, -1); grupoCeu.add(obj.ps);
        obj.rPN = rotulo('PN', 'ec-rot-ponto', [-0.2, 0.5]); obj.rPN.position.set(0, 0, 1.0); grupoCeu.add(obj.rPN);
        obj.rPS = rotulo('PS', 'ec-rot-ponto', [-0.2, 0.5]); obj.rPS.position.set(0, 0, -1.0); grupoCeu.add(obj.rPS);
        obj.vernal = new T.Mesh(geo(new T.SphereGeometry(0.014, 12, 8)), mat(T.MeshBasicMaterial, '--aviso')); obj.vernal.position.set(1, 0, 0); grupoCeu.add(obj.vernal);
        obj.rVernal = rotulo('γ', 'ec-rot-ponto ec-rot-gama', [-0.3, 0.5]); obj.rVernal.position.set(1, 0, 0); grupoCeu.add(obj.rVernal);

        /* estrelas */
        var gEst = geo(new T.SphereGeometry(1, 12, 8));
        obj.matEst = mat(T.MeshBasicMaterial, '--ink');
        obj.estrelas = {};
        ESTRELAS.forEach(function (e) {
          var m = new T.Mesh(gEst, obj.matEst);
          m.userData.r = Math.max(0.0075, Math.min(0.026, 0.017 - 0.0048 * e.mag));
          m.scale.setScalar(m.userData.r);
          var r = rotulo(e.nome, 'ec-rot-est' + (e.mag > 1.7 ? ' ec-rot-fraca' : ''), [-0.14, 0.5]);
          r.element.setAttribute('data-mag', String(e.mag));
          grupoCeu.add(m); grupoCeu.add(r);
          obj.estrelas[e.id] = { malha: m, rot: r };
        });
        obj.cruzLinhas = new T.LineSegments(geo(new T.BufferGeometry()), mat(T.LineBasicMaterial, '--ink-2'));
        grupoCeu.add(obj.cruzLinhas);
        obj.rCruz = rotulo('Cruzeiro do Sul', 'ec-rot-const', [0.5, -0.9]); grupoCeu.add(obj.rCruz);
        obj.matExt = mat(T.LineDashedMaterial, '--magenta', { dashSize: 0.03, gapSize: 0.02 });
        /* Sol */
        obj.sol = new T.Mesh(geo(new T.SphereGeometry(0.045, 24, 16)), mat(T.MeshBasicMaterial, '--nav-yellow'));
        obj.solAro = new T.Mesh(geo(new T.TorusGeometry(0.052, 0.004, 6, 48)), mat(T.MeshBasicMaterial, '--aviso'));
        grupoCeu.add(obj.sol); obj.sol.add(obj.solAro);
        obj.rSol = rotulo('Sol', 'ec-rot-sol', [-0.25, 0.5]); grupoCeu.add(obj.rSol);
        /* seleção */
        obj.anel = rotulo('', 'ec-anel'); scene.add(obj.anel); obj.anel.visible = false;
        obj.matTri = mat(T.MeshBasicMaterial, '--magenta');
        obj.matAzAlt = mat(T.MeshBasicMaterial, '--magenta', { transparent: true, opacity: 0.75 });
        obj.matArcoSol = mat(T.MeshBasicMaterial, '--aviso');
        obj.matArcoSolB = mat(T.LineDashedMaterial, '--aviso', { dashSize: 0.025, gapSize: 0.02, transparent: true, opacity: 0.8 });
        obj.matArcoEst = mat(T.LineDashedMaterial, '--magenta', { dashSize: 0.02, gapSize: 0.02, transparent: true, opacity: 0.75 });
        obj.rP = rotulo('P', 'ec-rot-tri'); obj.rZ = rotulo('Z', 'ec-rot-tri'); obj.rA = rotulo('A', 'ec-rot-tri');
        scene.add(obj.rP); scene.add(obj.rZ); scene.add(obj.rA);
        obj.rAz = rotulo('Az', 'ec-rot-tri ec-rot-ang'); scene.add(obj.rAz);
        obj.rAlt = rotulo('a', 'ec-rot-tri ec-rot-ang'); scene.add(obj.rAlt);

        /* eventos de ponteiro */
        var dom = renderer.domElement;
        var toques = {}, inicio = null, pinca = null;
        dom.addEventListener('pointerdown', function (ev) {
          toques[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
          inicio = { x: ev.clientX, y: ev.clientY, t: Date.now(), yaw: olhar.yaw, pitch: olhar.pitch, n: Object.keys(toques).length };
          if (st.vista === 'obs') { try { dom.setPointerCapture(ev.pointerId); } catch (e) { /* ok */ } }
          var ids = Object.keys(toques);
          if (ids.length === 2) { var a = toques[ids[0]], b = toques[ids[1]]; pinca = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: olhar.fov }; }
        });
        dom.addEventListener('pointermove', function (ev) {
          if (!toques[ev.pointerId]) return;
          toques[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
          if (st.vista !== 'obs' || !inicio) return;
          var ids = Object.keys(toques);
          if (ids.length >= 2 && pinca) {
            var a = toques[ids[0]], b = toques[ids[1]];
            var d = Math.hypot(a.x - b.x, a.y - b.y);
            olhar.fov = Math.max(30, Math.min(100, pinca.fov * pinca.d / Math.max(20, d)));
          } else {
            var k = olhar.fov / Math.max(200, dom.clientHeight);
            olhar.yaw = n360(inicio.yaw - (ev.clientX - inicio.x) * k);
            olhar.pitch = Math.max(-10, Math.min(89, inicio.pitch + (ev.clientY - inicio.y) * k));
          }
          aplicarCamera(); marcar();
        });
        function fim(ev) {
          var eraUnico = Object.keys(toques).length === 1;
          delete toques[ev.pointerId];
          if (Object.keys(toques).length < 2) pinca = null;
          if (inicio && eraUnico && inicio.n === 1 && Math.hypot(ev.clientX - inicio.x, ev.clientY - inicio.y) < 7 && Date.now() - inicio.t < 600) tocar(ev);
          if (!Object.keys(toques).length) inicio = null;
        }
        dom.addEventListener('pointerup', fim);
        dom.addEventListener('pointercancel', function (ev) { delete toques[ev.pointerId]; pinca = null; inicio = null; });
        dom.addEventListener('wheel', function (ev) {
          if (st.vista !== 'obs') return;
          ev.preventDefault();
          olhar.fov = Math.max(30, Math.min(100, olhar.fov * (ev.deltaY > 0 ? 1.08 : 0.93)));
          aplicarCamera(); marcar();
        }, { passive: false });

        var ro = new ResizeObserver(function () { redimensionar(); });
        ro.observe(canvasBox);
        lim3d.push(function () { ro.disconnect(); });
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (ents) { visivel = ents[0].isIntersecting; if (visivel) marcar(); });
          io.observe(canvasBox);
          lim3d.push(function () { io.disconnect(); });
        }
        lim3d.push(VL.on('tema', function () { setTimeout(aplicarCores, 30); }));
        mudarVista(st.vista, true);
        redimensionar();
        atualizarTudo();
      }

      /* desfaz a cena 3D inteira (ao sair do widget ou antes de recriá-la depois de uma perda de contexto WebGL) */
      function desmontar3D() {
        var l = lim3d; lim3d = [];
        l.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (renderer) {
          ['ext', 'triPZ', 'triZA', 'triAP', 'triAz', 'triAlt'].forEach(function (n) { if (obj[n] && obj[n].geometry) obj[n].geometry.dispose(); });
          ['arcoSolA', 'arcoSolB'].forEach(function (n) { if (obj[n]) obj[n].traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); });
          if (obj.cruzLinhas) obj.cruzLinhas.geometry.dispose();
          geos.forEach(function (g) { g.dispose(); });
          mats.forEach(function (m) { m.dispose(); });
          texs.forEach(function (t) { t.dispose(); });
          if (controls) controls.dispose();
          renderer.dispose();
          VL.gl3d.soltar(renderer);
          if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        rotulos.innerHTML = '';
        renderer = cssR = scene = camera = controls = grupoCeu = null;
        obj = {}; aneis = []; mats = []; geos = []; texs = [];
        sujo = true;
      }

      function semWebGL() {
        falhou = true;
        canvasBox.classList.remove('cena-3d');
        canvasBox.classList.add('ec-sem3d');
        canvasBox.appendChild(h('p', { class: 'callout callout-aconfirmar' }, 'Seu navegador não abriu a cena 3D (WebGL). Abaixo está o desenho da esfera no plano do meridiano; os cálculos continuam funcionando no painel.'));
        canvasBox.appendChild(figuraMeridiano());
        dica.hidden = true;
        atualizarTudo();
      }
      function figuraMeridiano() {
        var phi = st.lat, S = 'http://www.w3.org/2000/svg';
        var svg = h('svg', { viewBox: '-130 -130 260 260', class: 'svg-interativo ec-svg', role: 'img', 'aria-label': 'Esfera no plano do meridiano' });
        var p = function (ang, r) { return [Math.cos(ang * RAD) * (r || 100), -Math.sin(ang * RAD) * (r || 100)]; };
        svg.appendChild(h('circle', { cx: 0, cy: 0, r: 100, fill: 'none', stroke: 'var(--ink)' }));
        svg.appendChild(h('line', { x1: -112, y1: 0, x2: 112, y2: 0, stroke: 'var(--ink)', 'stroke-width': 2 }));
        var ang = phi >= 0 ? 180 - phi : -phi;
        var a1 = p(ang, 112), a2 = p(ang + 180, 112);
        svg.appendChild(h('line', { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: 'var(--ink-2)', 'stroke-dasharray': '4 3' }));
        var e1 = p(ang + 90, 100), e2 = p(ang - 90, 100);
        svg.appendChild(h('line', { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], stroke: 'var(--ok)', 'stroke-width': 2 }));
        var tx = function (x, y, t) { var n = h('text', { x: x, y: y, 'font-size': 11, fill: 'var(--ink)' }); n.textContent = t; return n; };
        svg.appendChild(tx(4, -104, 'Zênite'));
        svg.appendChild(tx(-128, -6, 'N')); svg.appendChild(tx(116, -6, 'S'));
        var pe = p(ang, 100); svg.appendChild(tx(pe[0] + 4, pe[1] - 4, phi >= 0 ? 'PN' : 'PS'));
        svg.appendChild(tx(e1[0] + 4, e1[1], 'Equador'));
        svg.appendChild(tx(-125, 125, 'Altura do polo elevado = |φ| = ' + gm(Math.abs(phi), 0)));
        void S;
        return svg;
      }

      function redimensionar() {
        if (!renderer) return;
        var w = canvasBox.clientWidth || 300, hh = canvasBox.clientHeight || 300;
        var mudouLarg = (largura < 560) !== (w < 560) || (largura < 760) !== (w < 760) || (largura < 1000) !== (w < 1000);
        largura = w;
        if (mudouLarg && obj.estrelas) aplicarCamadas();
        renderer.setSize(w, hh, false);
        renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
        cssR.setSize(w, hh);
        camera.aspect = w / hh;
        aplicarCamera(true);
        marcar();
      }
      function aplicarCamera(reposicionar) {
        if (!camera) return;
        if (st.vista === 'obs') {
          /* em tela retrato, olhar.fov vale para a largura */
          camera.fov = camera.aspect < 1 ? Math.min(120, 2 * Math.atan(Math.tan(olhar.fov / 2 * RAD) / camera.aspect) / RAD) : olhar.fov;
          camera.position.set(0, 0.004, 0);
          var alvo = horiz(olhar.yaw, olhar.pitch);
          camera.up.set(0, 1, 0);
          camera.lookAt(alvo.x, alvo.y + 0.004, alvo.z);
        } else {
          camera.fov = 36;
          if (reposicionar) {
            var tan = Math.tan(camera.fov / 2 * RAD), asp = Math.min(1, camera.aspect);
            var dist = (asp < 0.95 ? 1.3 : 1.28) / (tan * asp);
            var dir = camera.position.lengthSq() > 0.5 ? camera.position.clone().normalize() : horiz(100, 22);
            camera.position.copy(dir.multiplyScalar(Math.max(controls.minDistance, Math.min(controls.maxDistance, dist))));
          }
          controls.target.set(0, 0, 0);
          controls.update();
        }
        camera.updateProjectionMatrix();
      }
      function mudarVista(v, inicial) {
        st.vista = v;
        VL.$$('button', segVista).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); });
        resumoSel();
        if (!renderer) return;
        controls.enabled = v !== 'obs';
        if (v === 'obs') {
          var polo = st.lat >= 0 ? 0 : 180;
          var cs = st.sel && ast.sol ? corpo(st.sel) : null, pcs = cs ? posCorpo(cs) : null;
          if (pcs && pcs.a > 0) { olhar.yaw = pcs.az; olhar.pitch = Math.max(10, Math.min(60, pcs.a - 25)); }
          else if (!inicial) { olhar.yaw = polo; olhar.pitch = Math.max(15, Math.abs(st.lat) * 0.8); }
        } else {
          camera.position.copy(horiz(100, 22));
        }
        aplicarCamera(true);
        aplicarCamadas();
        aplicarCores();
        marcar();
      }

      function aplicarCores() {
        if (!renderer) return;
        mats.forEach(function (m) { if (m.userData.token) m.color.set(VL.cssVar(m.userData.token) || '#888'); });
        atualizarCeu();
        marcar();
      }
      function atualizarCeu() {
        if (!renderer) return;
        var escuro = VL.settings.temaEscuro();
        if (st.vista === 'obs') {
          var hs = ast.sol ? posCorpo(corpo('sol')).a : -30;
          var dia = cor(escuro ? '--sea-3' : '--sea-2'), noite = cor(escuro ? '--paper' : '--ink');
          var k = Math.max(0, Math.min(1, (hs + 12) / 18));
          var c = noite.clone().lerp(dia, k);
          renderer.setClearColor(c, 1);
          var marDia = cor('--sea-3'), marNoite = noite.clone().lerp(marDia, escuro ? 0.4 : 0.16);
          obj.mar.material.color.copy(marNoite.lerp(marDia, k));
          var claro = k > 0.55;
          obj.matEst.color.set(VL.cssVar(claro ? '--ink' : '--nav-white'));
          rotulos.setAttribute('data-ceu', claro ? 'dia' : 'noite');
          rotulos.style.setProperty('--ec-sombra', VL.cssVar(escuro ? '--paper' : '--ink'));
        } else {
          renderer.setClearColor(cor('--paper'), 1);
          obj.matEst.color.set(VL.cssVar('--ink'));
          rotulos.setAttribute('data-ceu', 'fora');
        }
      }
      function aplicarCamadas() {
        if (!renderer) return;
        var fora = st.vista !== 'obs';
        obj.casca.visible = fora;
        obj.horizonte.visible = fora;
        obj.mar.visible = !fora;
        obj.nad.visible = fora; obj.rNad.visible = fora;
        obj.vertical.visible = fora;
        obj.barco.visible = fora; obj.rVoce.visible = fora;
        obj.eixo.visible = fora;
        obj.ecliptica.visible = st.ecl;
        obj.paralelos.visible = fora;
        ESTRELAS.forEach(function (e) { obj.estrelas[e.id].rot.visible = mostraNome(e); });
        var escala = fora ? 1 : 0.55;
        ESTRELAS.forEach(function (e) { var m = obj.estrelas[e.id].malha; m.scale.setScalar(m.userData.r * escala); });
        obj.sol.scale.setScalar(fora ? 1 : 0.6);
        aneis.forEach(function (g) { g.children.forEach(function (c) { c.visible = fora ? !!c.userData.fora : !!c.userData.obs; }); });
        [obj.pn, obj.ps, obj.zen].forEach(function (m) { m.scale.setScalar(fora ? 1 : 0.3); });
        [obj.rP, obj.rZ, obj.rA].forEach(function (r) { r.center.set(fora ? 0.5 : 1.6, fora ? 0.5 : 1.25); });
        if (obj.arcoSolA) obj.arcoSolA.visible = st.arco;
        if (obj.arcoSolB) obj.arcoSolB.visible = st.arco && fora;
        if (obj.ext) obj.ext.visible = st.cruz;
        atualizarSelecao3D();
      }

      /* reconstrói as partes que dependem de latitude e data */
      function atualizarGeometria() {
        if (!renderer) return;
        var eps = ast.sol.eps;
        obj.ecliptica.rotation.set(eps * RAD, 0, 0);
        /* Cruzeiro */
        var P = {}; CRUZEIRO.forEach(function (id) { var e = corpo(id); P[id] = eqLocal(e.ar, e.dec); });
        obj.cruzLinhas.geometry.dispose();
        obj.cruzLinhas.geometry = new T.BufferGeometry().setFromPoints([P.acrux, P.gacrux, P.mimosa, P.deltacru]);
        obj.rCruz.position.copy(P.acrux.clone().add(P.gacrux).add(P.mimosa).add(P.deltacru).multiplyScalar(0.25).normalize());
        /* prolongamento 4,5x de Gacrux para Acrux */
        var u = P.gacrux.clone().normalize(), v = P.acrux.clone().normalize();
        var w = Math.acos(u.dot(v)), eixo = new T.Vector3().crossVectors(u, v).normalize(), pts = [];
        for (var i = 0; i <= 40; i++) pts.push(u.clone().applyAxisAngle(eixo, w * 5.5 * i / 40));
        var gExt = new T.BufferGeometry().setFromPoints(pts);
        var ext = new T.Line(gExt, obj.matExt); ext.computeLineDistances();
        trocarMalha('ext', ext, grupoCeu);
        ext.visible = st.cruz;
        /* posições das estrelas */
        ESTRELAS.forEach(function (e) {
          var p = eqLocal(e.ar, e.dec);
          obj.estrelas[e.id].malha.position.copy(p);
          obj.estrelas[e.id].rot.position.copy(p);
        });
        /* arco diurno do Sol (fixo para o observador ao longo do dia) */
        arcoDiurno(ast.sol.dec, 'arcoSolA', 'arcoSolB', obj.matArcoSol, obj.matArcoSolB, st.arco);
      }
      function arcoDiurno(dec, nA, nB, mA, mB, vis) {
        var acima = [], abaixo = [], seg = [], segB = [];
        var rr = Math.cos(dec * RAD);
        for (var i = 0; i <= 180; i++) {
          var H = i * 2;
          var aa = alturaAzimute(st.lat, H, dec);
          var p = horiz(aa.az, aa.a);
          if (aa.a >= 0) { seg.push(p); if (segB.length) { abaixo.push(segB); segB = []; } } else { segB.push(p); if (seg.length) { acima.push(seg); seg = []; } }
        }
        if (seg.length) acima.push(seg); if (segB.length) abaixo.push(segB);
        /* junta o primeiro e o último trechos quando o círculo dá a volta */
        if (acima.length > 1 && alturaAzimute(st.lat, 0, dec).a >= 0) { acima[0] = acima.pop().concat(acima[0]); }
        if (abaixo.length > 1 && alturaAzimute(st.lat, 0, dec).a < 0) { abaixo[0] = abaixo.pop().concat(abaixo[0]); }
        void rr;
        var gA = new T.Group();
        acima.forEach(function (s) { if (s.length > 1) gA.add(tuboPontos(s, 0.0055, mA)); });
        var gB = new T.Group();
        abaixo.forEach(function (s) { if (s.length > 1) { var l = new T.Line(new T.BufferGeometry().setFromPoints(s), mB); l.computeLineDistances(); gB.add(l); } });
        [nA, nB].forEach(function (n) { var velho = obj[n]; if (velho) { scene.remove(velho); velho.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); } });
        obj[nA] = gA; obj[nB] = gB; scene.add(gA); scene.add(gB);
        gA.visible = vis; gB.visible = vis && st.vista !== 'obs';
      }

      /* orienta o grupo do céu pelo tempo sideral local */
      var mBase;
      function orientarCeu() {
        if (!renderer) return;
        var phi = st.lat * RAD, L = ast.lst * RAD;
        var M = new T.Vector3(0, Math.cos(phi), Math.sin(phi)), E = new T.Vector3(1, 0, 0), P = new T.Vector3(0, Math.sin(phi), -Math.cos(phi));
        var x = M.clone().multiplyScalar(Math.cos(L)).sub(E.clone().multiplyScalar(Math.sin(L)));
        var y = M.clone().multiplyScalar(Math.sin(L)).add(E.clone().multiplyScalar(Math.cos(L)));
        mBase = mBase || new T.Matrix4();
        mBase.makeBasis(x, y, P);
        grupoCeu.quaternion.setFromRotationMatrix(mBase);
        grupoCeu.updateMatrixWorld(true);
        var ps = eqLocal(ast.sol.ar, ast.sol.dec);
        obj.sol.position.copy(ps); obj.rSol.position.copy(ps);
        obj.solAro.lookAt(new T.Vector3(0, 0, 0));
        /* dims para o que está abaixo do horizonte */
        var tmp = new T.Vector3();
        ESTRELAS.forEach(function (e) {
          var o = obj.estrelas[e.id]; o.malha.getWorldPosition(tmp);
          o.rot.element.classList.toggle('ec-dim', tmp.y < 0);
        });
        obj.sol.getWorldPosition(tmp); obj.rSol.element.classList.toggle('ec-dim', tmp.y < 0);
        obj.pn.getWorldPosition(tmp); obj.rPN.element.classList.toggle('ec-dim', tmp.y < -0.01);
        obj.ps.getWorldPosition(tmp); obj.rPS.element.classList.toggle('ec-dim', tmp.y < -0.01);
        var longo = largura >= 760;
        obj.rPN.element.textContent = 'PN' + (st.lat >= 0 && longo ? ' (elevado)' : '');
        obj.rPS.element.textContent = 'PS' + (st.lat < 0 && longo ? ' (elevado)' : '');
        atualizarCeu();
        atualizarSelecao3D();
      }
      function posMundo(id) {
        var t = new T.Vector3();
        if (id === 'sol') { obj.sol.getWorldPosition(t); return t; }
        if (obj.estrelas[id]) { obj.estrelas[id].malha.getWorldPosition(t); return t; }
        var pts = { zenite: [0, 1, 0], nadir: [0, -1, 0] };
        if (pts[id]) return t.set(pts[id][0], pts[id][1], pts[id][2]);
        if (id === 'pn') { obj.pn.getWorldPosition(t); return t; }
        if (id === 'ps') { obj.ps.getWorldPosition(t); return t; }
        if (id === 'vernal') { obj.vernal.getWorldPosition(t); return t; }
        var card = { N: 0, E: 90, S: 180, W: 270 };
        if (card[id] != null) return horiz(card[id], 0);
        return null;
      }
      /* nomes: todos no computador; no celular só as mais brilhantes (as outras aparecem ao tocar) */
      var largura = 800;
      function mostraNome(e) {
        if (e.id === st.sel) return true;
        if (!st.nomes) return false;
        if (e.id === 'deltacru' || e.id === 'epscru') return st.cruz || largura >= 1000;
        if (largura < 560) return e.mag <= 0.5 || e.id === 'acrux';
        if (largura < 760 && (e.id === 'mimosa' || e.id === 'gacrux')) return st.cruz;
        return true;
      }
      function atualizarSelecao3D() {
        if (!renderer) return;
        var id = st.sel, ehAstro = id && (id === 'sol' || obj.estrelas[id]);
        ESTRELAS.forEach(function (e) { obj.estrelas[e.id].rot.visible = mostraNome(e); obj.estrelas[e.id].rot.element.classList.toggle('ec-sel', e.id === id); });
        if (!id) { obj.anel.visible = false; limparTri(); return; }
        var p = posMundo(id);
        obj.anel.visible = !!p; if (p) obj.anel.position.copy(p);
        if (ehAstro && st.tri) desenharTri(p); else limparTri();
      }
      function limparTri() {
        ['triPZ', 'triZA', 'triAP', 'triAz', 'triAlt', 'arcoEst'].forEach(function (n) { trocarMalha(n, null); });
        obj.rP.visible = obj.rZ.visible = obj.rA.visible = obj.rAz.visible = obj.rAlt.visible = false;
      }
      function desenharTri(A) {
        var Z = new T.Vector3(0, 1, 0);
        var P = (st.lat >= 0 ? obj.pn : obj.ps).getWorldPosition(new T.Vector3());
        var a = A.clone().normalize();
        var fora = st.vista !== 'obs', k = fora ? 1 : 0.32;
        trocarMalha('triPZ', tuboPontos(arcoGC(P, Z, 24), 0.0075 * k, obj.matTri));
        trocarMalha('triZA', tuboPontos(arcoGC(Z, a, 24), 0.0075 * k, obj.matTri));
        trocarMalha('triAP', tuboPontos(arcoGC(a, P, 24), 0.0075 * k, obj.matTri));
        /* azimute no horizonte (do Norte, pelo Leste) e altura no círculo vertical */
        var c = corpo(st.sel), pc = posCorpo(c);
        var mult = fora ? 1.09 : 1;
        obj.rP.position.copy(P).multiplyScalar(mult); obj.rZ.position.copy(Z).multiplyScalar(mult); obj.rA.position.copy(a).multiplyScalar(mult);
        var pe = horiz(pc.az, 0), pts = [], n = Math.max(2, Math.round(pc.az / 6));
        for (var i = 0; i <= n; i++) pts.push(horiz(pc.az * i / n, 0).multiplyScalar(1.0));
        var mAz = tuboPontos(pts, 0.0035 * k, obj.matAzAlt); trocarMalha('triAz', mAz);
        if (pc.a > -89) trocarMalha('triAlt', tuboPontos(arcoGC(pe, a, 16), 0.0035 * k, obj.matAzAlt)); else trocarMalha('triAlt', null);
        obj.rAz.position.copy(horiz(pc.az / 2, 0).multiplyScalar(1.06));
        obj.rAz.element.textContent = 'Az ' + Math.round(pc.az) + '°';
        obj.rAlt.position.copy(horiz(pc.az, pc.a / 2).multiplyScalar(1.04));
        obj.rAlt.element.textContent = 'a ' + (pc.a < 0 ? '−' : '') + Math.abs(Math.round(pc.a)) + '°';
        obj.rP.visible = obj.rZ.visible = obj.rA.visible = true;
        obj.rAz.visible = obj.rAlt.visible = true;
        obj.triPZ.visible = obj.triZA.visible = obj.triAP.visible = true;
      }
      var destaqueT = 0;
      function destacar(k) {
        if (!renderer) return;
        if (k === 'ecliptica' && !st.ecl) { st.ecl = true; aplicarCamadas(); }
        if (k === 'arco' && !st.arco) { st.arco = true; aplicarCamadas(); }
        if (k === 'triangulo' && !(st.sel && (st.sel === 'sol' || obj.estrelas[st.sel]))) {
          var vis = ESTRELAS.filter(function (e) { return posCorpo(e).a > 20; });
          selecionar(vis.length ? vis[0].id : 'sol');
        }
        var alvo = { horizonte: [obj.horizBorda], meridiano: [obj.meridiano], equador: [obj.equador], ecliptica: [obj.ecliptica], polos: [obj.pn, obj.ps, obj.eixo], zenite: [obj.zen], nadir: [obj.nad], arco: [obj.arcoSolA], vernal: [obj.vernal], triangulo: [obj.triPZ, obj.triZA, obj.triAP], cardeais: [obj.horizBorda], angulos: [obj.equador, obj.meridiano] }[k] || [];
        clearTimeout(destaqueT);
        aplicarCores();
        var mag = VL.cssVar('--magenta');
        alvo.forEach(function (o) { if (o) o.traverse(function (x) { if (x.material && x.material.color) x.material.color.set(mag); }); });
        if (k === 'cardeais') ['N', 'E', 'S', 'W'].forEach(function (c) { obj.card[c].element.classList.add('ec-real'); });
        marcar();
        destaqueT = setTimeout(function () { ['N', 'E', 'S', 'W'].forEach(function (c) { obj.card[c].element.classList.remove('ec-real'); }); aplicarCores(); }, 1800);
      }

      /* ---------- seleção por toque ---------- */
      function candidatos() {
        var l = ['sol'].concat(ESTRELAS.map(function (e) { return e.id; }));
        if (st.vista !== 'obs') l = l.concat(['zenite', 'nadir', 'pn', 'ps', 'N', 'E', 'S', 'W', 'vernal']);
        else l = l.concat(['zenite', 'pn', 'ps', 'N', 'E', 'S', 'W']);
        return l;
      }
      function tocar(ev) {
        var r = renderer.domElement.getBoundingClientRect();
        var mx = ev.clientX - r.left, my = ev.clientY - r.top, melhor = null, dmin = 30;
        candidatos().forEach(function (id) {
          var p = posMundo(id); if (!p) return;
          var q = p.clone().project(camera);
          if (q.z > 1 || q.z < -1) return;
          if (st.vista === 'obs' && p.y < -0.02 && id !== 'nadir') return;
          var sx = (q.x + 1) / 2 * r.width, sy = (1 - q.y) / 2 * r.height;
          var d = Math.hypot(sx - mx, sy - my);
          if (id.length === 1 || id === 'zenite' || id === 'nadir' || id === 'pn' || id === 'ps' || id === 'vernal') d += 4;
          if (d < dmin) { dmin = d; melhor = id; }
        });
        if (st.modo === 'desafio' && desafio.esperaToque) { desafio.responderToque(melhor); return; }
        selecionar(melhor);
      }
      function resumoSel() {
        if (!st.sel) { dica.textContent = st.vista === 'obs' ? 'Arraste para olhar em volta; pinça ou roda do mouse para aproximar. Toque num astro.' : 'Arraste para girar a esfera. Toque num astro ou num ponto.'; return; }
        if (PONTOS_TXT[st.sel]) { dica.textContent = PONTOS_NOME[st.sel] + ': veja a explicação abaixo.'; return; }
        var c = corpo(st.sel); if (!c) return;
        var p = posCorpo(c);
        dica.textContent = c.nome + ': a ' + fAng(p.a) + ' · Az ' + fAz(p.az) + ' · AHL ' + gm(p.ahl, 0, true) + ' · δ ' + fDec(c.dec);
      }
      function selecionar(id) {
        st.sel = id || null;
        selAstro.value = id && (id === 'sol' || corpo(id)) ? id : '';
        atualizarInfo(); resumoSel();
        atualizarSelecao3D();
        marcar();
      }

      /* ---------- tempo ---------- */
      function avancarHoras(dh) {
        var x = st.hml + dh, dias = 0;
        while (x >= 24) { x -= 24; dias++; }
        while (x < 0) { x += 24; dias--; }
        st.hml = x;
        if (dias) {
          var p = st.data.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + dias));
          st.data = d.toISOString().slice(0, 10); dataIn.value = st.data;
        }
        horaIn.value = String(st.hml);
      }
      function passo(dh) { avancarHoras(dh); atualizarTudo(); }
      function agora() {
        var ms = Date.now() + st.lon / 15 * 3600000, d = new Date(ms);
        st.data = d.toISOString().slice(0, 10); dataIn.value = st.data;
        st.hml = d.getUTCHours() + d.getUTCMinutes() / 60; horaIn.value = String(st.hml);
        atualizarTudo();
      }
      function alternarPlay(forcar) {
        rodando = forcar != null ? forcar : !rodando;
        btPlay.setAttribute('aria-pressed', String(rodando));
        btPlay.textContent = rodando ? 'Pausar' : 'Girar o céu';
        ultimo = 0; marcar();
      }
      if (reduzMov) btPlay.title = 'Movimento reduzido: use também os botões de 1 hora para avançar passo a passo.';

      var ultimaGeo = '';
      function atualizarTudo() {
        calcular();
        var chave = st.lat + '|' + st.data;
        if (renderer && chave !== ultimaGeo) { atualizarGeometria(); ultimaGeo = chave; }
        if (renderer) { orientarCeu(); }
        atualizarPaineis();
        if (st.modo === 'desafio') desafio.atualizar();
        marcar();
      }

      /* esconde rótulos abaixo do horizonte (vista do observador) e esmaece os do lado de trás (vista de fora) */
      var _v = null, _c = null;
      function filtrarRotulos() {
        _v = _v || new T.Vector3(); _c = _c || new T.Vector3();
        var obs = st.vista === 'obs';
        _c.copy(camera.position).normalize();
        scene.traverse(function (o) {
          if (!o.isCSS2DObject) return;
          o.getWorldPosition(_v);
          var cl = o.element.classList;
          cl.toggle('ec-oculto', obs && _v.y < -0.015);
          cl.toggle('ec-tras', !obs && _v.lengthSq() > 0.5 && _v.clone().normalize().dot(_c) < -0.25);
        });
      }

      /* esconde rótulos que se sobrepõem, mantendo os mais importantes (selecionado, pontos, astros mais brilhantes) */
      function prioridade(e) {
        var c = e.classList;
        if (c.contains('ec-anel')) return -1;
        var p = c.contains('ec-sel') ? 300 : c.contains('ec-rot-card') ? 120 : c.contains('ec-rot-sol') ? 115 : c.contains('ec-rot-ponto') ? 110 :
          c.contains('ec-rot-tri') ? 100 : c.contains('ec-rot-voce') ? 90 : c.contains('ec-rot-const') ? 20 :
          c.contains('ec-rot-est') ? 60 - 8 * (+e.getAttribute('data-mag') || 0) : 40;
        if (c.contains('ec-tras')) p -= 45;
        if (c.contains('ec-dim')) p -= 10;
        return p;
      }
      function desembaralhar() {
        var itens = [];
        VL.$$('.ec-rot', rotulos).forEach(function (e) {
          e.classList.remove('ec-colide');
          if (e.style.display === 'none' || e.classList.contains('ec-oculto') || !e.textContent) return;
          var p = prioridade(e); if (p < 0) return;
          var r = e.getBoundingClientRect(); if (!r.width) return;
          itens.push({ e: e, p: p, r: r });
        });
        itens.sort(function (a, b) { return b.p - a.p; });
        var postos = [];
        itens.forEach(function (it) {
          var r = it.r, bate = postos.some(function (q) { return r.left < q.right - 1 && r.right > q.left + 1 && r.top < q.bottom - 1 && r.bottom > q.top + 1; });
          if (bate) it.e.classList.add('ec-colide'); else postos.push(r);
        });
      }

      /* ---------- laço de desenho ---------- */
      function marcar() { sujo = true; if (!raf && renderer) raf = requestAnimationFrame(quadro); }
      function quadro(t) {
        raf = 0;
        if (!renderer || !visivel) return;
        if (rodando) {
          var dt = ultimo ? Math.min(0.1, (t - ultimo) / 1000) : 0; ultimo = t;
          avancarHoras(dt * 1.0);
          calcular(); orientarCeu();
          if (Math.floor(t / 250) !== Math.floor((t - dt * 1000) / 250)) atualizarPaineis();
          sujo = true;
        }
        if (sujo) { renderer.render(scene, camera); filtrarRotulos(); cssR.render(scene, camera); desembaralhar(); sujo = false; }
        if (rodando) raf = requestAnimationFrame(quadro);
      }

      /* ---------- modos ---------- */
      function mudarModo(m) {
        st.modo = m;
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
        blocoDesafio.hidden = m !== 'desafio';
        blocoAstro.hidden = m === 'desafio';
        blocoEl.hidden = m === 'desafio';
        if (m === 'desafio') { alternarPlay(false); desafio.novo(); }
        else { desafio.esperaToque = false; }
      }

      /* ---------- desafio ---------- */
      var desafio = (function () {
        var D = { esperaToque: false, n: 0, acertos: 0, total: 6, q: null };
        var cab = h('div', { class: 'ec-des-cab' });
        var enun = h('p', { class: 'ec-des-enun' });
        var resp = h('div', { class: 'ec-des-resp' });
        var fb = h('div', { class: 'ec-des-fb', 'aria-live': 'polite' });
        var btProx = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { proxima(); } }, 'Próxima');
        blocoDesafio.appendChild(h('h4', null, 'Desafio da esfera celeste'));
        blocoDesafio.appendChild(cab); blocoDesafio.appendChild(enun); blocoDesafio.appendChild(resp); blocoDesafio.appendChild(fb);
        blocoDesafio.appendChild(h('div', { class: 'btn-row' }, btProx));
        function visiveis(minAlt) {
          return ESTRELAS.filter(function (e) { return posCorpo(e).a > (minAlt || 12); });
        }
        function opcoes(lista, certa, explic, ref) {
          resp.innerHTML = '';
          D.esperaToque = false;
          VL.embaralhar(lista).forEach(function (txt) {
            resp.appendChild(h('button', { type: 'button', class: 'alternativa', onclick: function (ev) {
              VL.$$('button', resp).forEach(function (b) { b.disabled = true; if (b.textContent === certa) b.setAttribute('data-res', 'certa'); });
              var ok = txt === certa;
              if (!ok) ev.currentTarget.setAttribute('data-res', 'errada');
              corrigir(ok, explic, ref);
            } }, txt));
          });
        }
        function pedirToque(alvo, explic, ref, nomeAlvo) {
          resp.innerHTML = '';
          D.esperaToque = true;
          D.alvo = alvo; D.explic = explic; D.ref = ref; D.nomeAlvo = nomeAlvo;
          dica.textContent = enun.textContent;
          resp.appendChild(h('p', { class: 'muted' }, 'Toque na esfera. Dica: na vista de fora você vê a esfera inteira.'));
          resp.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { D.responderToque(null); } }, 'Não sei, mostrar'));
        }
        D.responderToque = function (id) {
          if (!D.esperaToque) return;
          D.esperaToque = false;
          var ok = id != null && (D.alvo.indexOf(id) >= 0);
          setTimeout(resumoSel, 0);
          resp.innerHTML = '';
          resp.appendChild(h('p', null, id ? 'Você tocou: ' + (PONTOS_NOME[id] || (corpo(id) || {}).nome || id) + '.' : 'Resposta mostrada.'));
          selecionar(D.alvo[0]);
          corrigir(ok, D.explic, D.ref);
        };
        function corrigir(ok, explic, ref) {
          D.n++; if (ok) D.acertos++;
          fb.innerHTML = '';
          fb.appendChild(h('div', { class: 'explicacao' },
            h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não foi dessa vez.'),
            h('p', null, explic),
            ref ? h('p', { class: 'small muted' }, ref) : null));
          btProx.hidden = false;
          btProx.textContent = D.n >= D.total ? 'Ver resultado' : 'Próxima';
          cab.textContent = 'Questão ' + D.n + ' de ' + D.total + ' · acertos: ' + D.acertos;
        }
        var geradores = [
          function () {
            var alvos = [['zenite', 'no zênite', 'O zênite é o ponto bem acima do observador, na vertical. Na vista de fora, é o topo da esfera, acima do barquinho.'],
              [st.lat >= 0 ? 'pn' : 'ps', 'no polo celeste elevado', 'O polo elevado é o que está acima do horizonte: no hemisfério sul, o Polo Sul celeste (PS). Sua altura é igual à latitude.'],
              ['S', 'no ponto cardeal Sul', 'O meridiano do observador corta o horizonte em N e S. O Sul fica do lado do polo sul celeste.'],
              ['E', 'no ponto cardeal Leste', 'O Leste (E) é onde o equador celeste corta o horizonte do lado em que os astros nascem.']];
            var a = alvos[Math.floor(Math.random() * alvos.length)];
            enun.textContent = 'Toque em ' + a[1] + '.';
            if (renderer && st.vista === 'obs') mudarVista('fora');
            pedirToque([a[0]], a[2], 'Miguens, vol. II, cap. 17 (esfera celeste).', a[1]);
          },
          function () {
            var phi = Math.abs(st.lat);
            var certa = Math.round(phi) + '°';
            var cands = [certa, Math.round(90 - phi) + '°', '0°', Math.round(Math.min(90, phi * 2)) + '°', '90°'];
            cands = cands.filter(function (x, i) { return cands.indexOf(x) === i; });
            cands = cands.slice(0, 4);
            while (cands.length < 4) cands.push(String(Math.round(phi + 7 * cands.length)) + '°');
            enun.textContent = 'Você está na latitude ' + fLat(st.lat) + '. A que altura acima do horizonte fica o polo celeste elevado?';
            opcoes(cands, certa, 'A altura do polo elevado é igual à latitude do observador (em valor absoluto): a = |φ| = ' + gm(phi, 1) + '. Por isso, em Belém o polo sul celeste fica rente ao horizonte e em Rio Grande, a cerca de 32°.', 'Miguens, vol. II: altura do polo = latitude.');
          },
          function () {
            var vis = visiveis(15).filter(function (e) { return CRUZEIRO.indexOf(e.id) < 0 || e.id === 'acrux'; });
            if (!vis.length) { geradores[1](); return; }
            var e = vis[Math.floor(Math.random() * vis.length)];
            enun.textContent = 'Toque na estrela ' + e.nome + ' (' + e.const + '). Os nomes estão ' + (st.nomes ? 'visíveis' : 'ocultos') + '.';
            var p = posCorpo(e);
            pedirToque([e.id], e.nome + ' está a ' + fAng(p.a) + ' de altura, no azimute ' + fAz(p.az) + '. Sua declinação é ' + fDec(e.dec) + '.', 'Coordenadas: catálogo Hipparcos (J2000), precessadas para a data.');
          },
          function () {
            var d = ast.sol.dec, phi = st.lat;
            var certa = Math.round(90 - Math.abs(phi - d));
            var ds = [certa, Math.round(90 - Math.abs(phi) - Math.abs(d)), Math.round(90 - Math.abs(phi + d)), Math.round(Math.abs(phi - d))];
            var vistos = {}, lista = [];
            ds.forEach(function (x) { x = Math.max(0, Math.min(90, x)); var s = x + '°'; if (!vistos[s]) { vistos[s] = 1; lista.push(s); } });
            var k = 3; while (lista.length < 4) { var s = (certa + k) + '°'; if (!vistos[s] && certa + k <= 90) { vistos[s] = 1; lista.push(s); } k = -k + (k < 0 ? 4 : 0); }
            enun.textContent = 'Hoje (' + st.data.split('-').reverse().join('/') + ') a declinação do Sol é ' + fDec(d) + '. Na sua latitude (' + fLat(phi) + '), qual a altura do Sol na passagem meridiana, arredondada?';
            opcoes(lista, certa + '°', 'Na passagem meridiana, a distância zenital é a diferença entre latitude e declinação (com sinais: N positivo, S negativo): z = |φ − δ| = ' + gm(Math.abs(phi - d), 1) + '. A altura é a = 90° − z = ' + gm(90 - Math.abs(phi - d), 1) + '.', 'Miguens, vol. II: latitude pela passagem meridiana.');
          },
          function () {
            var lista = VL.embaralhar(ESTRELAS.filter(function (e) { return e.id !== 'polaris'; })).slice(0, 1).concat([corpo(st.lat < 0 ? 'acrux' : 'capella')]);
            var e = lista[Math.random() < 0.5 ? 0 : 1];
            var lim = 90 - Math.abs(st.lat);
            var circ = Math.abs(e.dec) >= lim && e.dec * st.lat > 0;
            var nunca = Math.abs(e.dec) >= lim && e.dec * st.lat < 0;
            enun.textContent = 'Na latitude ' + fLat(st.lat) + ', a estrela ' + e.nome + ' (δ = ' + fDec(e.dec) + ') é circumpolar, ou seja, nunca se põe?';
            var certa = circ ? 'Sim, nunca se põe' : nunca ? 'Não: ela nem chega a nascer' : 'Não: ela nasce e se põe';
            opcoes(['Sim, nunca se põe', 'Não: ela nasce e se põe', 'Não: ela nem chega a nascer'], certa,
              'Uma estrela é circumpolar quando a sua declinação, para o lado do polo elevado, é maior que a colatitude: |δ| ≥ 90° − |φ| = ' + gm(lim, 1) + ', com δ do mesmo nome da latitude. Se for do nome contrário e maior que esse limite, ela nunca nasce. ' + e.nome + ': |δ| = ' + gm(Math.abs(e.dec), 1) + '.',
              'Miguens, vol. II: astros circumpolares.');
            selecionar(e.id);
          },
          function () {
            var d = ast.sol.dec;
            var certa = Math.abs(d) < 0.3 ? 'Praticamente no Leste' : d > 0 ? 'A leste, desviado para o Norte' : 'A leste, desviado para o Sul';
            var amp = Math.asin(Math.max(-1, Math.min(1, Math.sin(d * RAD) / Math.cos(st.lat * RAD)))) / RAD;
            enun.textContent = 'Hoje a declinação do Sol é ' + fDec(d) + '. Em que direção ele nasce para você?';
            opcoes(['A leste, desviado para o Norte', 'A leste, desviado para o Sul', 'Praticamente no Leste'], certa,
              'O Sol nasce exatamente no Leste só quando a declinação é zero (equinócios). Com declinação ' + (d >= 0 ? 'Norte' : 'Sul') + ', ele nasce desviado para o ' + (d >= 0 ? 'Norte' : 'Sul') + ', em qualquer latitude. Aqui a amplitude é sen Amp = sen δ / cos φ ≈ ' + num(Math.abs(amp), 1).replace('.', ',') + '°, então o azimute do nascer é cerca de ' + fAz(90 - amp) + '.',
              'Miguens, vol. II: amplitude no nascer e no pôr.');
          },
          function () {
            var vis = visiveis(5);
            if (vis.length < 3) { geradores[1](); return; }
            var quatro = VL.embaralhar(vis).slice(0, Math.min(4, vis.length));
            var melhor = quatro.slice().sort(function (a, b) { return Math.abs(n180(posCorpo(a).ahl)) - Math.abs(n180(posCorpo(b).ahl)); })[0];
            enun.textContent = 'Qual destas estrelas está mais perto de passar pelo meridiano agora (AHL mais perto de 0°)?';
            opcoes(quatro.map(function (e) { return e.nome; }), melhor.nome,
              'A passagem meridiana superior acontece quando AHL = 0°. ' + quatro.map(function (e) { return e.nome + ': AHL ' + gm(posCorpo(e).ahl, 0, true).replace(' 00′', ''); }).join('; ') + '. Quem tem AHL perto de 360° vai passar em breve; perto de 0°, acabou de passar.',
              'AHL = AHG + λE ou AHG − λW.');
          },
        ];
        function proxima() {
          if (D.n > D.total) { D.novo(); return; }
          if (D.n >= D.total) { fim(); return; }
          fb.innerHTML = ''; btProx.hidden = true;
          cab.textContent = 'Questão ' + (D.n + 1) + ' de ' + D.total + ' · acertos: ' + D.acertos;
          var g = D.fila.shift();
          g();
        }
        function fim() {
          enun.textContent = 'Resultado: ' + D.acertos + ' de ' + D.total + '.';
          resp.innerHTML = '';
          fb.innerHTML = '';
          fb.appendChild(h('p', null, D.acertos >= 5 ? 'Muito bem: você já se orienta na esfera celeste.' : 'Volte ao modo Explorar, toque nos elementos e leia as explicações. Depois tente de novo.'));
          btProx.hidden = false; btProx.textContent = 'Novo desafio';
          D.n = D.total + 1;
        }
        D.novo = function () {
          D.n = 0; D.acertos = 0;
          var gs = falhou ? geradores.filter(function (g, i) { return i !== 0 && i !== 2; }) : geradores;
          D.fila = VL.embaralhar(gs).slice(0, D.total);
          while (D.fila.length < D.total) D.fila.push(gs[Math.floor(Math.random() * gs.length)]);
          proxima();
        };
        D.atualizar = function () { /* questões usam o estado no momento em que são geradas */ };
        return D;
      })();

      /* ---------- configurações (trilha internacional) ---------- */
      limpezas.push(VL.on('settings', function (s) { var novo = !!(s && s.intl); if (novo !== intl) { intl = novo; montarChipsElementos(); if (elAtivo) mostrarElemento(elAtivo); atualizarInfo(); } }));

      /* ---------- início ---------- */
      calcular();
      if (st.sel && !(st.sel === 'sol' || corpo(st.sel))) st.sel = null;
      selAstro.value = st.sel && (st.sel === 'sol' || corpo(st.sel)) ? st.sel : '';
      atualizarPaineis();
      if (st.modo === 'desafio') mudarModo('desafio');
      var vivo = true;
      VL.libs.three().then(function (THREE) { if (vivo) iniciar3D(THREE); }).catch(function () { if (vivo) semWebGL(); });

      return function limpar() {
        vivo = false;
        rodando = false;
        if (raf) cancelAnimationFrame(raf);
        clearTimeout(destaqueT);
        limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
        desmontar3D();
        el.innerHTML = '';
      };
    },
  });
})();
