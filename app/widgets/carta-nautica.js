/* Carta náutica de treinamento — costa FICTÍCIA no estilo das cartas da DHN.
   SVG com pan/zoom (mouse, toque e pinça), escalas de latitude/longitude nas bordas (minutos e décimos),
   rosa dos rumos verdadeiros e magnéticos com a declinação e a variação anual, isóbatas de 2/5/10/20/50 m,
   sondagens em itálico, faróis com característica, boias IALA B e perigos (rocha, casco soçobrado).
   Ferramentas: régua paralela (rumo verdadeiro), compasso de pontas secas (distância na escala de latitudes),
   plotar/ler coordenadas, marcações (LDP, posição por 2 ou 3 marcações, triângulo de incerteza, transporte de
   LDP), navegação estimada (com corrente opcional) e triângulo de corrente (rumo a governar, abatimento).
   Modo exercício: problemas gerados (tolerância ±2° e ±0,2 M) com correção passo a passo e solução na carta;
   marcações sucessivas com ângulo dobrado na proa (22,5°/45°, 30°/60°, 45°/90° = través, Manual 6.3.4); as derrotas
   sorteadas ficam em água de 3 m ou mais e longe de pedras e cascos.

   Referências: Manual de Navegação da Marinha do Brasil, Vol. I — Navegação costeira, estimada e em águas
   restritas (DHN, 2ª revisão 2023), caps. 2 a 6; Carta 12000 (INT 1), DHN, 5ª ed. 2022.

   opts (todas opcionais):
     modo:       'explorar' (padrão) | 'exercicio'
     ferramenta: 'mover' (padrão) | 'regua' | 'compasso' | 'posicao' | 'marcacao' | 'estima' | 'corrente'
     exercicio:  tipo inicial no modo exercício: 'rumo-dist' (padrão) | 'ler' | 'plotar' | 'marcacoes' |
                 'estima' | 'corrente' | 'sucessivas'
     altura:     altura da carta em px (padrão: automática, ~62% da tela no celular)

   Exemplo de bloco de lição:
     {t:'widget', w:'carta-nautica', opts:{modo:'exercicio', exercicio:'marcacoes'}}
     {t:'widget', w:'carta-nautica', opts:{ferramenta:'regua'}} */
(function () {
  'use strict';
  var h = VL.h;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var RAD = Math.PI / 180;

  /* ====================================================================================
     1. Geografia da carta (projeção de Mercator esférica, em minutos de arco)
     ==================================================================================== */
  var LAT_S = -24, LAT_N = -(23 + 40 / 60);        // 24°00'S a 23°40'S
  var LON_W = -(44 + 24 / 60), LON_E = -44;        // 044°24'W a 044°00'W
  var GX = 24, GY = 20;                            // extensão em minutos de longitude/latitude
  var RT = 3437.7468;                              // raio da Terra em minutos de arco (partes meridionais)
  function mp(lat) { return RT * Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2)); }
  var MP_N = mp(LAT_N), MP_S = mp(LAT_S), CH = MP_N - MP_S;  // altura da carta em unidades de carta
  // unidades de carta: x = minutos de longitude a partir da borda W; y = partes meridionais a partir da borda N (para baixo)
  function paraCarta(lat, lon) { return { x: (lon - LON_W) * 60, y: MP_N - mp(lat) }; }
  function daCarta(x, y) {
    var m = MP_N - y;
    return { lat: (2 * Math.atan(Math.exp(m / RT)) - Math.PI / 2) / RAD, lon: LON_W + x / 60 };
  }
  function deG(gx, gy) { return { lat: LAT_S + gy / 60, lon: LON_W + gx / 60 }; }
  function paraG(lat, lon) { return { gx: (lon - LON_W) * 60, gy: (lat - LAT_S) * 60 }; }

  /** Loxodromia: rumo verdadeiro (°) e distância (M) de p1 a p2 ({lat, lon} em graus). */
  function rumoDist(p1, p2) {
    var dlat = (p2.lat - p1.lat) * 60, dlon = (p2.lon - p1.lon) * 60, dpsi = mp(p2.lat) - mp(p1.lat);
    var C = Math.atan2(dlon, dpsi) / RAD; if (C < 0) C += 360;
    var q = Math.abs(dpsi) > 1e-9 ? dlat / dpsi : Math.cos(p1.lat * RAD);
    return { rumo: C, dist: Math.sqrt(dlat * dlat + q * q * dlon * dlon) };
  }
  /** Ponto de chegada pela loxodromia a partir de p, rumo C (°) e distância d (M). */
  function destino(p, C, d) {
    var dlat = d * Math.cos(C * RAD), lat2 = p.lat + dlat / 60, dpsi = mp(lat2) - mp(p.lat);
    var q = Math.abs(dpsi) > 1e-9 ? dlat / dpsi : Math.cos(p.lat * RAD);
    return { lat: lat2, lon: p.lon + (d * Math.sin(C * RAD) / q) / 60 };
  }
  function norm360(a) { a = a % 360; return a < 0 ? a + 360 : a; }
  function difAng(a, b) { var d = norm360(a - b); return d > 180 ? d - 360 : d; }

  /* ---------- Declinação magnética da carta (valor fictício, plausível para o litoral Sudeste) ---------- */
  var DEC = { graus: 22, min: 10, lado: 'W', ano: 2025, varMin: 7, varLado: 'W' };
  function decNoAno(ano) {
    var base = (DEC.graus + DEC.min / 60) * (DEC.lado === 'E' ? 1 : -1);    // E positivo, W negativo
    var va = (DEC.varMin / 60) * (DEC.varLado === 'E' ? 1 : -1);
    return base + va * (ano - DEC.ano);
  }

  /* ====================================================================================
     2. Campo de profundidades da costa fictícia (determinístico)
     ==================================================================================== */
  function hash2(i, j) { var n = Math.sin(i * 127.1 + j * 311.7 + 74.7) * 43758.5453123; return n - Math.floor(n); }
  function ruido2(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
  }
  function fbm(x, y, oct) { var s = 0, a = 0.5, f = 1; for (var i = 0; i < oct; i++) { s += a * ruido2(x * f, y * f); f *= 2.03; a *= 0.5; } return s; }
  function g1(x, c, s) { var t = (x - c) / s; return Math.exp(-t * t); }
  function sig(t) { return 1 / (1 + Math.exp(-t)); }
  function gaussRot(x, y, cx, cy, sa, sb, ang) {
    var a = ang * RAD, dx = x - cx, dy = y - cy;
    var u = dx * Math.cos(a) + dy * Math.sin(a), v = -dx * Math.sin(a) + dy * Math.cos(a);
    return Math.exp(-(u * u) / (sa * sa) - (v * v) / (sb * sb));
  }
  function segW(px, py, pts, w0, w1) {
    var best = 1e9, total = 0, L = [], i, acc = 0;
    for (i = 0; i < pts.length - 1; i++) { var l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(l); total += l; }
    for (i = 0; i < pts.length - 1; i++) {
      var ax = pts[i][0], ay = pts[i][1], dx = pts[i + 1][0] - ax, dy = pts[i + 1][1] - ay;
      var t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
      var dist = Math.hypot(ax + t * dx - px, ay + t * dy - py);
      var w = w0 + (w1 - w0) * ((acc + t * L[i]) / total);
      best = Math.min(best, dist / w); acc += L[i];
    }
    return best;
  }
  function linhaCosta(x) {
    return 15.0 + 2.6 * g1(x, 10.8, 2.0) + 1.0 * g1(x, 13.3, 1.4) - 1.2 * g1(x, 22.2, 1.8) - 0.9 * g1(x, 1.6, 1.0) +
      0.35 * g1(x, 5.2, 1.2) + 0.7 * fbm(x * 0.5 + 3.1, 0.7, 5);
  }
  /** Profundidade (m, positiva no mar; negativa = altitude em terra) nas coordenadas de projeto. */
  function campo(gx, gy) {
    var c = linhaCosta(gx) + 0.42 * fbm(gx * 1.9 + 11, gy * 1.9 + 2, 5);
    var d = c - gy;
    var z = d > 0 ? 64 * (1 - Math.exp(-d / 10)) : d * 45;
    if (z > 0) {
      z *= 1 - 0.5 * g1(gx, 11.2, 3.3) * sig((gy - 12.2) / 1.2);
      z += 2.4 * fbm(gx * 0.7 + 5, gy * 0.7 + 9, 3) * Math.min(1, d / 2);
    }
    var rn = segW(gx, gy, [[18.3, 11.3], [18.85, 12.9], [19.6, 15.2]], 0.55, 1.6);
    z -= 70 * Math.exp(-rn * rn) * (1 + 0.3 * fbm(gx * 2.4, gy * 2.4, 4));
    z -= 60 * gaussRot(gx, gy, 6.2, 7.5, 1.3, 0.8, -12) * (1 + 0.2 * fbm(gx * 2.5 + 7, gy * 2.5, 3));
    z -= 44 * gaussRot(gx, gy, 7.95, 6.85, 0.42, 0.33, 0);
    z -= 17 * gaussRot(gx, gy, 10.2, 12.3, 1.05, 0.42, 35);
    z -= 5.2 * gaussRot(gx, gy, 13.2, 15.2, 0.95, 0.5, -20);
    z -= 160 * g1(Math.hypot(gx - 3.6, gy - 18.3), 0, 1.3);
    z -= 120 * g1(Math.hypot(gx - 21.6, gy - 16.6), 0, 1.0);
    var rk = 31 * gaussRot(gx, gy, 14.6, 9.7, 0.33, 0.25, 20) + 14 * gaussRot(gx, gy, 4.7, 6.35, 0.22, 0.2, 0);
    if (z > 0.3 && rk > 0.01) z = Math.max(z - rk, 0.4);
    return z;
  }

  /* ---------- Feições da carta (coordenadas de projeto gx/gy) ---------- */
  var FEICOES = [
    { id: 'farol-vigia', tipo: 'farol', nome: 'Farol da Ponta do Vigia', g: [18.22, 11.42], car: 'Lp(2) 10s 48m 17M', notavel: true, art: 'o', rotDx: 10, rotDy: 16 },
    { id: 'farol-gaivota', tipo: 'farol', nome: 'Farol da Ilha da Gaivota', g: [5.95, 7.72], car: 'Lp(3) 12s 41m 12M', notavel: true, art: 'o', rotDx: -8, rotDy: -14, rotAnc: 'end' },
    { id: 'farolete', tipo: 'farolete', nome: 'Farolete do molhe da Vila do Porto', g: [11.25, 17.05], car: 'Lp E 4s 7m 4M', notavel: true, art: 'o', rotDx: 10, rotDy: 4 },
    { id: 'torre', tipo: 'notavel', nome: 'Torre da igreja da Vila do Porto', g: [10.55, 18.35], rot: 'Torre', notavel: true, art: 'a' },
    { id: 'antena', tipo: 'antena', nome: 'Antena do Morro Alto', g: [21.6, 16.6], rot: 'Ant.', notavel: true, art: 'a' },
    { id: 'facho', tipo: 'pico', nome: 'Pico do Morro do Facho', g: [3.6, 18.3], alt: '212', notavel: true, art: 'o' },
    { id: 'b-as', tipo: 'boia-as', nome: 'Boia de águas seguras da Barra', g: [12.3, 11.0], car: 'LpL 10s', rot: 'Barra' },
    { id: 'b-1', tipo: 'boia-be', nome: 'Boia 1 (lateral de boreste)', g: [12.3, 13.1], car: 'Lp E 3s', rot: '1' },
    { id: 'b-2', tipo: 'boia-bb', nome: 'Boia 2 (lateral de bombordo)', g: [11.3, 13.0], car: 'Lp V 3s', rot: '2' },
    { id: 'b-3', tipo: 'boia-be', nome: 'Boia 3 (lateral de boreste)', g: [12.25, 14.75], car: 'Lp E 3s', rot: '3' },
    { id: 'b-4', tipo: 'boia-bb', nome: 'Boia 4 (lateral de bombordo)', g: [11.05, 14.7], car: 'Lp V 3s', rot: '4' },
    { id: 'b-w', tipo: 'cardinal-w', nome: 'Boia cardinal Oeste da Laje Preta', g: [14.05, 9.75], car: 'MR(9) 10s' },
    { id: 'b-pi', tipo: 'perigo-isolado', nome: 'Boia de perigo isolado do casco soçobrado', g: [21.08, 11.7], car: 'Lp(2) 5s' },
    { id: 'laje', tipo: 'rocha-cd', nome: 'Laje Preta (rocha que cobre e descobre)', g: [14.6, 9.7] },
    { id: 'pedra-ilhote', tipo: 'rocha-sub', nome: 'Pedra do Ilhote (rocha submersa perigosa)', g: [4.7, 6.35] },
    { id: 'casco', tipo: 'casco', nome: 'Casco soçobrado, profundidade mínima 4,2 m', g: [20.88, 11.82], prof: 4.2 },
  ];
  var NOMES = [
    { t: 'Ponta do Vigia', g: [19.2, 12.6], terra: true },
    { t: 'Ilha da Gaivota', g: [6.3, 8.55], terra: true },
    { t: 'Vila do Porto', g: [10.0, 19.25], terra: true },
    { t: 'Morro do Facho', g: [3.6, 18.85], terra: true },
    { t: 'Morro Alto', g: [21.6, 17.3], terra: true },
    { t: 'Ponta da Restinga', g: [1.55, 13.55], terra: true },
    { t: 'Enseada dos Pilotos', g: [8.4, 15.6], agua: true, grande: true },
    { t: 'Canal da Gaivota', g: [6.0, 11.4], agua: true },
    { t: 'Baixio do Meio', g: [9.3, 11.75], agua: true },
    { t: 'Coroa do Leste', g: [14.2, 15.75], agua: true },
    { t: 'Laje Preta', g: [15.25, 10.05], agua: true },
    { t: 'Oceano Atlântico', g: [13.5, 3.0], agua: true, grande: true },
  ];
  var ROSA_G = [20.4, 8.1];   // centro da rosa dos rumos (coordenadas de projeto)

  var CARAC = {
    'Lp(2) 10s 48m 17M': 'Grupo de 2 lampejos, luz branca (sem letra de cor = branca), período de 10 segundos, foco a 48 m de altitude, alcance nominal de 17 milhas.',
    'Lp(3) 12s 41m 12M': 'Grupo de 3 lampejos brancos a cada 12 segundos, foco a 41 m, alcance nominal de 12 milhas.',
    'Lp E 4s 7m 4M': 'Lampejo encarnado (vermelho) a cada 4 segundos, foco a 7 m, alcance nominal de 4 milhas.',
    'LpL 10s': 'Lampejo longo branco a cada 10 segundos: ritmo de sinal de águas seguras.',
    'Lp E 3s': 'Lampejo encarnado a cada 3 segundos: sinal lateral de boreste (IALA B).',
    'Lp V 3s': 'Lampejo verde a cada 3 segundos: sinal lateral de bombordo (IALA B).',
    'MR(9) 10s': 'Grupo de 9 lampejos muito rápidos, a cada 10 segundos: sinal cardinal Oeste.',
    'Lp(2) 5s': 'Grupo de 2 lampejos brancos: sinal de perigo isolado.',
  };
  var EXPLICA = {
    'farol': 'Farol: o ponto preto é a posição; a gota magenta é o símbolo de luz.',
    'farolete': 'Farolete (luz menor) no molhe.',
    'boia-be': 'IALA B (Brasil): encarnada, cônica, marca de tope cone; deixe por boreste ao entrar vindo do mar. Recebe número ímpar.',
    'boia-bb': 'IALA B (Brasil): verde, cilíndrica, marca de tope cilindro; deixe por bombordo ao entrar vindo do mar. Recebe número par.',
    'boia-as': 'Águas seguras: listras verticais encarnadas e brancas, marca de tope uma esfera encarnada. Indica águas navegáveis em volta (início de canal, aterragem).',
    'cardinal-w': 'Cardinal Oeste: amarela com faixa preta, dois cones ponta a ponta. Passe a oeste dela.',
    'perigo-isolado': 'Perigo isolado: preta com faixa encarnada, duas esferas pretas. O perigo fica sob a boia; há águas navegáveis em volta.',
    'rocha-cd': 'Rocha que cobre e descobre com a maré (símbolo de asterisco).',
    'rocha-sub': 'Rocha submersa perigosa à navegação (cruz dentro de linha pontilhada de perigo).',
    'casco': 'Casco soçobrado com profundidade mínima conhecida, dentro de linha pontilhada de perigo.',
    'notavel': 'Ponto notável: bom para tirar marcações.',
    'antena': 'Antena: ponto notável, bom para marcações.',
    'pico': 'Pico com altitude em metros: ponto notável para marcações.',
  };

  /* ====================================================================================
     3. Utilidades
     ==================================================================================== */
  function S(tag, attrs) {
    var el = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null && attrs[k] !== false) el.setAttribute(k, attrs[k]);
    for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c == null) continue; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return el;
  }
  function num(n, casas) { return VL.fmt.num(n, casas); }
  function fmtRumo(v) {
    var r = Math.round(norm360(v) * 2) / 2; if (r >= 360) r -= 360;
    var i = Math.floor(r), s = String(i).padStart(3, '0');
    return s + (r - i ? ',5' : '') + '°';
  }
  function fmtRumoInt(v) { var r = Math.round(norm360(v)) % 360; return String(r).padStart(3, '0') + '°'; }
  function fmtCoord(v, tipo) {
    var a = Math.abs(v), g = Math.floor(a), m = Math.round((a - g) * 600) / 10;
    if (m >= 60) { g += 1; m -= 60; }
    var gs = tipo === 'lat' ? String(g).padStart(2, '0') : String(g).padStart(3, '0');
    var ms = m.toFixed(1).replace('.', ','); if (m < 10) ms = '0' + ms;
    return gs + '°' + ms + "'" + (tipo === 'lat' ? (v < 0 ? 'S' : 'N') : (v < 0 ? 'W' : 'E'));
  }
  function fmtPos(p) { return fmtCoord(p.lat, 'lat') + ' ' + fmtCoord(p.lon, 'lon'); }
  function fmtGM(dec) { // declinação: 22°24'W
    var a = Math.abs(dec), g = Math.floor(a), m = Math.round((a - g) * 60); if (m === 60) { g++; m = 0; }
    return g + '°' + String(m).padStart(2, '0') + "'" + (dec < 0 ? 'W' : 'E');
  }
  function fmtDist(d) { return num(Math.round(d * 10) / 10, 1) + ' M'; }
  function fmtHora(min) { min = ((Math.round(min) % 1440) + 1440) % 1440; return String(Math.floor(min / 60)).padStart(2, '0') + String(min % 60).padStart(2, '0'); }
  function lerNum(v) { if (v == null) return NaN; v = String(v).trim().replace(',', '.').replace(/[\u2212\u2013]/g, '-'); return v === '' ? NaN : Number(v); }
  function aleat(a, b) { return a + Math.random() * (b - a); }
  function escolha(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function nos(v) { return num(v, 1) + (Math.abs(v) >= 2 ? ' nós' : ' nó'); }
  function intl(txt) { return VL.settings.get('intl') ? ' (' + txt + ')' : ''; }
  function sondagemTxt(z) {
    // sondagens em metros; abaixo de 21 m o decímetro aparece subscrito (Carta 12000, seção I)
    var d = Math.floor(z * 10) / 10;
    if (d < 21) { var i = Math.floor(d), dm = Math.round((d - i) * 10); return { i: String(i), dm: dm ? String(dm) : '' }; }
    return { i: String(Math.floor(d)), dm: '' };
  }
  function reduzMovimento() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ====================================================================================
     4. Widget
     ==================================================================================== */
  VL.widgets.define('carta-nautica', {
    css: ['assets/css/widgets/carta-nautica.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var vivo = true;
      var limpezas = [];
      var inst = VL.ui.instrumento({ titulo: 'Carta de treinamento: costa fictícia no estilo DHN. Não use para navegação.', controlesAntes: true });
      el.appendChild(inst.raiz);
      inst.corpo.appendChild(VL.ui.carregando('Desenhando a carta…'));
      return VL.libs.d3().then(function (d3) {
        if (!vivo) return function () {};
        inst.corpo.innerHTML = '';
        return montar(d3);
      });

      function montar(d3) {
        /* ---------------- grade do campo e contornos ---------------- */
        var NXg = 240, NYg = 200, DGX = GX / NXg, DGY = GY / NYg;
        var grade = new Float64Array(NXg * NYg);
        for (var j = 0; j < NYg; j++) for (var i = 0; i < NXg; i++) grade[j * NXg + i] = campo((i + 0.5) * DGX, GY - (j + 0.5) * DGY);
        function profundidade(lat, lon) { var g = paraG(lat, lon); return campo(g.gx, g.gy); }
        function ptGradeCarta(px, py) { // coordenada de contorno d3 (em células) para unidades de carta
          var gx = Math.max(0, Math.min(GX, px * DGX)), gy = Math.max(0, Math.min(GY, GY - py * DGY));
          var ll = deG(gx, gy); return paraCarta(ll.lat, ll.lon);
        }
        function caminho(multi) {
          var s = '';
          multi.coordinates.forEach(function (poly) {
            poly.forEach(function (ring) {
              ring.forEach(function (p, k) { var c = ptGradeCarta(p[0], p[1]); s += (k ? 'L' : 'M') + c.x.toFixed(3) + ' ' + c.y.toFixed(3); });
              s += 'Z';
            });
          });
          return s;
        }
        var gen = d3.contours().size([NXg, NYg]).smooth(true);
        var cont = {};
        [0, 2, 5, 10, 20, 50].forEach(function (t) { cont[t] = gen.thresholds([t])(grade)[0]; });
        var neg = new Float64Array(grade.length); for (var q = 0; q < grade.length; q++) neg[q] = -grade[q];
        var terra = gen.thresholds([0])(neg)[0];
        var topo = gen.thresholds([50, 100, 150])(neg);

        /* ---------------- estado ---------------- */
        var est = {
          modo: opts.modo === 'exercicio' ? 'exercicio' : 'explorar',
          ferramenta: opts.ferramenta || 'mover',
          desenhos: [],          // objetos do usuário
          solucao: [],           // desenho da solução do exercício
          resposta: null,        // ponto marcado como resposta
          medida: null,          // régua/compasso em andamento
          ano: new Date().getFullYear(),
          origem: null,          // ponto de partida (estima/corrente)
          sel: null,             // feição selecionada
          ex: null,              // exercício atual
          acertos: 0, tentativas: 0,
        };
        var vis = { k: 1, tx: 0, ty: 0, W: 300, H: 300, fit: 1 };
        var M = { l: 30, r: 10, t: 10, b: 30 };   // margens (escalas)

        /* ---------------- estrutura de controles ---------------- */
        var modoSeg = h('div', { class: 'segmented cn-modo', role: 'group', 'aria-label': 'Modo' });
        [['explorar', 'Explorar'], ['exercicio', 'Exercício']].forEach(function (m) {
          modoSeg.appendChild(h('button', { type: 'button', 'aria-pressed': String(est.modo === m[0]), 'data-m': m[0], onclick: function () { definirModo(m[0]); } }, m[1]));
        });
        var anoSel = h('label', { class: 'cn-ano' }, 'Ano',
          h('input', { type: 'number', min: '2000', max: '2100', value: String(est.ano), 'aria-label': 'Ano da navegação (para atualizar a declinação)', onchange: function (e) { var v = parseInt(e.target.value, 10); if (v > 1900 && v < 2200) { est.ano = v; atualizarDecInfo(); render(); } } }));
        var decInfo = h('span', { class: 'cn-decinfo' });
        var btDesfazer = h('button', { type: 'button', class: 'cn-ferr cn-acao', title: 'Desfazer o último traçado', 'aria-label': 'Desfazer o último traçado', onclick: function () { est.desenhos.pop(); est.medida = null; render(); atualizarPainel(); } }, 'Desfazer');
        var btLimpar = h('button', { type: 'button', class: 'cn-ferr cn-acao', title: 'Apagar todos os traçados', 'aria-label': 'Apagar todos os traçados', onclick: function () { est.desenhos = []; est.medida = null; est.origem = null; est.resposta = null; render(); atualizarPainel(); } }, 'Limpar');
        inst.controles.appendChild(h('div', { class: 'cn-topo' }, modoSeg, h('div', { class: 'cn-topo-dir' }, anoSel, decInfo), h('div', { class: 'cn-topo-acoes' }, btDesfazer, btLimpar)));

        var ferramentas = [
          ['mover', 'Mover', 'Mover e consultar a carta'],
          ['regua', 'Régua', 'Régua paralela: traçar rumo'],
          ['compasso', 'Compasso', 'Compasso de pontas secas: medir distância'],
          ['posicao', 'Posição', 'Plotar ou ler coordenadas'],
          ['marcacao', 'Marcação', 'Marcações e linhas de posição'],
          ['estima', 'Estima', 'Navegação estimada'],
          ['corrente', 'Corrente', 'Triângulo de corrente'],
        ];
        var barra = h('div', { class: 'cn-barra', role: 'toolbar', 'aria-label': 'Ferramentas de plotagem' });
        ferramentas.forEach(function (f) {
          barra.appendChild(h('button', { type: 'button', class: 'cn-ferr', 'data-f': f[0], 'aria-pressed': String(est.ferramenta === f[0]), title: f[2], 'aria-label': f[2], onclick: function () { definirFerramenta(f[0]); } }, f[1]));
        });
        inst.controles.appendChild(barra);
        // no celular a barra é uma faixa rolável; o esmaecido à direita avisa que há mais ferramentas
        function marcarFimBarra() { barra.setAttribute('data-fim', String(barra.scrollLeft + barra.clientWidth >= barra.scrollWidth - 2)); }
        barra.addEventListener('scroll', marcarFimBarra, { passive: true });

        /* ---------------- SVG ---------------- */
        var uid = 'cn' + Math.random().toString(36).slice(2, 8);
        var svg = S('svg', { class: 'cn-svg svg-interativo', tabindex: '0', role: 'application', 'aria-label': 'Carta náutica de treinamento. Use as setas para mover, mais e menos para aproximar, zero para ajustar.' });
        var defs = S('defs');
        var clip = S('clipPath', { id: uid + '-clip' }); var clipR = S('rect'); clip.appendChild(clipR); defs.appendChild(clip);
        function marcador(id, cls) {
          var m = S('marker', { id: uid + '-' + id, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' });
          m.appendChild(S('path', { d: 'M0 0 L10 5 L0 10 z', class: cls })); defs.appendChild(m);
        }
        marcador('seta', 'cn-seta'); marcador('seta-sol', 'cn-seta-sol'); marcador('seta-cor', 'cn-seta-cor');
        svg.appendChild(defs);
        var gGeo = S('g', { class: 'cn-geo' });
        var gGeoClip = S('g', { 'clip-path': 'url(#' + uid + '-clip)' }, gGeo);
        var gSim = S('g', { class: 'cn-sim', 'clip-path': 'url(#' + uid + '-clip)' });
        var gPlot = S('g', { class: 'cn-plot', 'clip-path': 'url(#' + uid + '-clip)' });
        var gBorda = S('g', { class: 'cn-borda' });
        var gHud = S('g', { class: 'cn-hud' });
        var fora = S('rect', { class: 'cn-fora', x: 0, y: 0, width: '100%', height: '100%' });
        svg.appendChild(fora);
        svg.appendChild(gGeoClip); svg.appendChild(gSim); svg.appendChild(gPlot); svg.appendChild(gBorda); svg.appendChild(gHud);

        // geometria (em unidades de carta; traços não escalam)
        var NSS = { 'vector-effect': 'non-scaling-stroke' };
        function pathGeo(d, cls) { var p = S('path', Object.assign({ d: d, class: cls }, NSS)); gGeo.appendChild(p); return p; }
        pathGeo('M0 0H' + GX + 'V' + CH + 'H0Z', 'cn-tinta-0');
        pathGeo(caminho(cont[5]), 'cn-tinta-5');
        pathGeo(caminho(cont[10]), 'cn-tinta-10');
        [2, 5, 10, 20, 50].forEach(function (t) { pathGeo(caminho(cont[t]), 'cn-isobata cn-iso-' + t); });
        pathGeo(caminho(terra), 'cn-terra');
        topo.forEach(function (c) { pathGeo(caminho(c), 'cn-topo-curva'); });
        // reticulado a cada 5'
        var ret = '';
        for (var xm = 5; xm < GX; xm += 5) ret += 'M' + xm + ' 0V' + CH;
        for (var ym = 5; ym < GY; ym += 5) { var yy = paraCarta(LAT_S + ym / 60, LON_W).y; ret += 'M0 ' + yy.toFixed(3) + 'H' + GX; }
        pathGeo(ret, 'cn-reticulado');

        /* ---------------- camada de símbolos (espaço de tela) ---------------- */
        var nomesAgua = [];
        var simbolos = [];   // {g, c: {x,y}, nivel, el}
        function addSim(lat, lon, node, nivel, extra) {
          var c = paraCarta(lat, lon);
          var o = Object.assign({ c: c, el: node, nivel: nivel || 0 }, extra || {});
          gSim.appendChild(node); simbolos.push(o); return o;
        }
        // rótulos de isóbatas
        function rotuloIsobata(t) {
          var multi = cont[t], cands = [];
          multi.coordinates.forEach(function (poly) {
            poly.forEach(function (ring) {
              for (var k = 6; k < ring.length - 6; k += 9) {
                var a = ring[k - 3], b = ring[k + 3], p = ring[k];
                if (p[0] < 4 || p[0] > NXg - 4 || p[1] < 4 || p[1] > NYg - 4) continue;
                cands.push({ p: p, a: a, b: b });
              }
            });
          });
          // escolhe até 3 pontos espalhados
          var esc = [];
          var alvos = [[0.25, 0.6], [0.55, 0.45], [0.85, 0.65], [0.4, 0.2], [0.7, 0.2]];
          alvos.forEach(function (al) {
            var best = null, bd = 1e9;
            cands.forEach(function (c) { var dd = Math.hypot(c.p[0] / NXg - al[0], c.p[1] / NYg - al[1]); if (dd < bd) { bd = dd; best = c; } });
            if (best && bd < 0.18 && esc.every(function (e) { return Math.hypot(e.p[0] - best.p[0], e.p[1] - best.p[1]) > 40; })) esc.push(best);
          });
          esc.forEach(function (c) {
            var ca = ptGradeCarta(c.a[0], c.a[1]), cb = ptGradeCarta(c.b[0], c.b[1]), cp = ptGradeCarta(c.p[0], c.p[1]);
            var ang = Math.atan2(cb.y - ca.y, cb.x - ca.x) / RAD; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
            var ll = daCarta(cp.x, cp.y);
            var g = S('g', { class: 'cn-isorot' }, S('text', { transform: 'rotate(' + ang.toFixed(1) + ')', 'text-anchor': 'middle', dy: '0.35em' }, String(t)));
            addSim(ll.lat, ll.lon, g, 1, { isorot: true });
          });
        }
        [5, 10, 20, 50].forEach(rotuloIsobata);

        // sondagens: grade com jitter, só no mar, longe de símbolos
        (function () {
          var rnd = (function (s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })(20251007);
          var passo = 0.55, evitar = FEICOES.map(function (f) { return f.g; });
          var caixas = [];  // áreas de rótulos importantes (em minutos)
          FEICOES.forEach(function (f) { if (f.tipo === 'farol' || f.tipo === 'farolete') caixas.push(f.rotAnc === 'end' ? [f.g[0] - 3.6, f.g[1] - 0.2, f.g[0] + 0.2, f.g[1] + 0.8] : [f.g[0] - 0.2, f.g[1] - 0.8, f.g[0] + 3.6, f.g[1] + 0.2]); });
          NOMES.forEach(function (n) { if (n.agua) { var w = n.t.length * 0.13 + 0.3; caixas.push([n.g[0] - w, n.g[1] - 0.3, n.g[0] + w, n.g[1] + 0.3]); } });
          for (var j0 = 0, gy = 0.4; gy < GY - 0.2; gy += passo, j0++) {
            for (var i0 = 0, gx = 0.4; gx < GX - 0.2; gx += passo, i0++) {
              var px = gx + (rnd() - 0.5) * passo * 0.6, py = gy + (rnd() - 0.5) * passo * 0.6;
              var z = campo(px, py);
              if (z < 0.6) continue;
              var perto = evitar.some(function (e) { return Math.hypot(e[0] - px, e[1] - py) < 0.42; }) || Math.hypot(ROSA_G[0] - px, ROSA_G[1] - py) < 3.4 ||
                caixas.some(function (c) { return px > c[0] && px < c[2] && py > c[1] && py < c[3]; });
              if (perto) continue;
              var st = sondagemTxt(z);
              var tx = S('text', { 'text-anchor': 'middle', dy: '0.35em' }, st.i);
              if (st.dm) tx.appendChild(S('tspan', { class: 'cn-dm', dy: '0.3em', dx: '0.5' }, st.dm));
              var ll = deG(px, py);
              // nível 0: grade de 2,2'; nível 1: 1,1'; nível 2: 0,55' (aparecem conforme o zoom)
              var nivel = (i0 % 4 === 0 && j0 % 4 === 0) ? 0 : (i0 % 2 === 0 && j0 % 2 === 0) ? 1 : 2;
              if (z < 5 && nivel === 2 && (i0 + j0) % 2 === 0) nivel = 1;   // águas rasas aparecem antes
              addSim(ll.lat, ll.lon, S('g', { class: 'cn-sond' }, tx), nivel, { sond: true });
            }
          }
        })();

        // nomes
        NOMES.forEach(function (n) {
          var ll = deG(n.g[0], n.g[1]);
          var cls = 'cn-nome' + (n.agua ? ' cn-nome-agua' : ' cn-nome-terra') + (n.grande ? ' cn-nome-grande' : '');
          var oNome = addSim(ll.lat, ll.lon, S('g', { class: cls }, S('text', { 'text-anchor': 'middle', dy: '0.35em' }, n.t)), 1, { rotulo: true, kMin: n.grande ? 0 : n.terra ? 18 : 22, nomeAgua: n.agua ? n.t.length * (n.grande ? 9.4 : 6.8) + 8 : 0, nomeAlt: n.grande ? 18 : 15 });
          if (n.agua) nomesAgua.push(oNome);
        });

        // símbolos de feições
        function simboloFeicao(f) {
          var g = S('g', { class: 'cn-feicao cn-f-' + f.tipo, 'data-id': f.id });
          var flare = function () { return S('path', { class: 'cn-flare', d: 'M0 0 C 3 -5 6 -12 4 -17 C 2 -21 -3 -20 -3 -15 C -3 -10 -1 -5 0 0 Z', transform: 'rotate(28)' }); };
          switch (f.tipo) {
            case 'farol':
            case 'farolete':
              g.appendChild(flare());
              g.appendChild(S('circle', { r: f.tipo === 'farol' ? 3 : 2.3, class: 'cn-pt' }));
              break;
            case 'notavel':
              g.appendChild(S('circle', { r: 4.5, class: 'cn-notavel' })); g.appendChild(S('circle', { r: 1.3, class: 'cn-pt' }));
              break;
            case 'antena':
              g.appendChild(S('path', { d: 'M0 0 L0 -12 M-4 -9 L0 -12 L4 -9 M-3 0 H3', class: 'cn-traco' })); g.appendChild(S('circle', { r: 1.6, class: 'cn-pt' }));
              break;
            case 'pico':
              g.appendChild(S('circle', { r: 1.8, class: 'cn-pt' }));
              g.appendChild(S('text', { x: 5, dy: '0.35em', class: 'cn-alt' }, f.alt));
              break;
            case 'boia-be':  // cônica encarnada
              g.appendChild(S('path', { d: 'M-5 0 H5', class: 'cn-traco' }));
              g.appendChild(S('path', { d: 'M-4.2 -1.5 L0 -11 L4.2 -1.5 Z', class: 'cn-boia-e', transform: 'rotate(15)' }));
              g.appendChild(S('circle', { r: 1.5, class: 'cn-pt-boia' }));
              g.appendChild(flare());
              break;
            case 'boia-bb':  // cilíndrica verde
              g.appendChild(S('path', { d: 'M-5 0 H5', class: 'cn-traco' }));
              g.appendChild(S('rect', { x: -3.6, y: -10, width: 7.2, height: 8.5, class: 'cn-boia-v', transform: 'rotate(15)' }));
              g.appendChild(S('circle', { r: 1.5, class: 'cn-pt-boia' }));
              g.appendChild(flare());
              break;
            case 'boia-as':
              g.appendChild(S('path', { d: 'M-5 0 H5', class: 'cn-traco' }));
              var gb = S('g', { transform: 'rotate(15)' });
              gb.appendChild(S('path', { d: 'M-3.5 -1.5 L-2.5 -10 L2.5 -10 L3.5 -1.5 Z', class: 'cn-boia-branca' }));
              gb.appendChild(S('path', { d: 'M-1 -1.5 L-0.7 -10 L0.7 -10 L1 -1.5 Z', class: 'cn-boia-e-sem' }));
              gb.appendChild(S('circle', { cy: -12.8, r: 2.2, class: 'cn-boia-e' }));
              g.appendChild(gb); g.appendChild(S('circle', { r: 1.5, class: 'cn-pt-boia' })); g.appendChild(flare());
              break;
            case 'cardinal-w':
              g.appendChild(S('path', { d: 'M-5 0 H5', class: 'cn-traco' }));
              var gc = S('g', { transform: 'rotate(15)' });
              gc.appendChild(S('path', { d: 'M-3.2 -1.5 L-2.4 -11 L2.4 -11 L3.2 -1.5 Z', class: 'cn-boia-a' }));
              gc.appendChild(S('path', { d: 'M-2.9 -4.6 L-2.6 -7.9 L2.6 -7.9 L2.9 -4.6 Z', class: 'cn-preto' }));
              gc.appendChild(S('path', { d: 'M-3 -11.5 L0 -15 L3 -11.5 Z M-3 -18.5 L0 -15 L3 -18.5 Z', class: 'cn-preto' }));
              g.appendChild(gc); g.appendChild(S('circle', { r: 1.5, class: 'cn-pt-boia' })); g.appendChild(flare());
              break;
            case 'perigo-isolado':
              g.appendChild(S('path', { d: 'M-5 0 H5', class: 'cn-traco' }));
              var gp = S('g', { transform: 'rotate(15)' });
              gp.appendChild(S('path', { d: 'M-3.2 -1.5 L-2.4 -11 L2.4 -11 L3.2 -1.5 Z', class: 'cn-preto' }));
              gp.appendChild(S('path', { d: 'M-2.9 -4.8 L-2.6 -7.6 L2.6 -7.6 L2.9 -4.8 Z', class: 'cn-boia-e-sem' }));
              gp.appendChild(S('circle', { cy: -13.2, r: 1.9, class: 'cn-preto' })); gp.appendChild(S('circle', { cy: -17.4, r: 1.9, class: 'cn-preto' }));
              g.appendChild(gp); g.appendChild(S('circle', { r: 1.5, class: 'cn-pt-boia' })); g.appendChild(flare());
              break;
            case 'rocha-cd': // asterisco (cobre e descobre)
              g.appendChild(S('path', { d: 'M-5 0 H5 M0 -5 V5 M-3.6 -3.6 L3.6 3.6 M-3.6 3.6 L3.6 -3.6', class: 'cn-rocha' }));
              break;
            case 'rocha-sub':
              g.appendChild(S('circle', { r: 8, class: 'cn-perigo' }));
              g.appendChild(S('path', { d: 'M-4 0 H4 M0 -4 V4', class: 'cn-rocha' }));
              break;
            case 'casco':
              g.appendChild(S('ellipse', { rx: 15, ry: 9, class: 'cn-perigo' }));
              g.appendChild(S('text', { 'text-anchor': 'middle', dy: '0.35em', class: 'cn-wk' }, '4', S('tspan', { class: 'cn-dm', dy: '0.3em' }, '2'), S('tspan', { dy: '-0.3em', dx: '2' }, 'Wk')));
              break;
          }
          return g;
        }
        function rotuloFeicao(f) {
          var g = S('g', { class: 'cn-rotf' });
          var boia = f.tipo.indexOf('boia') === 0 || f.tipo === 'cardinal-w' || f.tipo === 'perigo-isolado';
          if (f.car) {
            var t = S('text', { class: 'cn-car', x: f.rotDx != null ? f.rotDx : 8, y: f.rotDy != null ? f.rotDy : -9, 'text-anchor': f.rotAnc || 'start' }, f.car);
            if (boia && f.rot) t.appendChild(S('tspan', { class: 'cn-car-num' }, '  "' + f.rot + '"'));
            g.appendChild(t);
          } else if (f.rot && f.tipo !== 'pico') {
            g.appendChild(S('text', { class: 'cn-car', x: 8, y: 4 }, f.rot));
          }
          return g;
        }
        var feicaoEl = {};
        FEICOES.forEach(function (f) {
          var ll = deG(f.g[0], f.g[1]); f.lat = ll.lat; f.lon = ll.lon;
          var o = addSim(ll.lat, ll.lon, simboloFeicao(f), 0, { feicao: f });
          feicaoEl[f.id] = o;
          var boia = f.tipo.indexOf('boia') === 0 || f.tipo === 'cardinal-w' || f.tipo === 'perigo-isolado';
          var rf = rotuloFeicao(f);
          if (rf.firstChild) addSim(ll.lat, ll.lon, rf, 1, { rotulo: true, kMin: f.tipo === 'farol' ? 18 : boia ? 46 : 22 });
          if (boia && f.rot) addSim(ll.lat, ll.lon, S('g', { class: 'cn-rotf' }, S('text', { class: 'cn-car cn-car-num', x: 7, y: 9 }, '"' + f.rot + '"')), 1, { rotulo: true, kMin: 22, kMax: 46 });
        });

        // rosa dos rumos (tamanho fixo em tela, ancorada na carta)
        var rosa = { g: S('g', { class: 'cn-rosa' }), R: 70 };
        var rosaLL = deG(ROSA_G[0], ROSA_G[1]);
        var rosaObj = addSim(rosaLL.lat, rosaLL.lon, rosa.g, 0, { rosa: true });
        var rosaExtra = S('g', { class: 'cn-rosa-extra' });
        function desenharRosa() {
          var R = rosa.R, g = rosa.g; while (g.firstChild) g.removeChild(g.firstChild);
          var dec = decNoAno(DEC.ano);   // a rosa impressa traz a declinação do ano da carta
          g.appendChild(S('circle', { r: R, class: 'cn-rosa-anel' }));
          g.appendChild(S('circle', { r: R * 0.83, class: 'cn-rosa-anel' }));
          g.appendChild(S('circle', { r: R * 0.62, class: 'cn-rosa-anel cn-rosa-mag' }));
          g.appendChild(S('circle', { r: R * 0.5, class: 'cn-rosa-anel cn-rosa-mag' }));
          var tk = '', tkm = '', passo = R >= 62 ? 1 : 2;
          for (var a = 0; a < 360; a += passo) {
            var L = a % 10 === 0 ? 0.1 : a % 5 === 0 ? 0.065 : 0.035, s = Math.sin(a * RAD), c = -Math.cos(a * RAD);
            tk += 'M' + (s * R).toFixed(2) + ' ' + (c * R).toFixed(2) + 'L' + (s * R * (1 - L)).toFixed(2) + ' ' + (c * R * (1 - L)).toFixed(2);
            if (a % 5 === 0) {
              var am = a + dec, sm = Math.sin(am * RAD), cm = -Math.cos(am * RAD), Lm = a % 10 === 0 ? 0.09 : 0.05;
              tkm += 'M' + (sm * R * 0.62).toFixed(2) + ' ' + (cm * R * 0.62).toFixed(2) + 'L' + (sm * R * (0.62 - Lm)).toFixed(2) + ' ' + (cm * R * (0.62 - Lm)).toFixed(2);
            }
          }
          g.appendChild(S('path', { d: tk, class: 'cn-rosa-tick' }));
          g.appendChild(S('path', { d: tkm, class: 'cn-rosa-tick cn-rosa-mag' }));
          var passoNum = R >= 60 ? 30 : 90;
          for (var b = 0; b < 360; b += passoNum) {
            var sb = Math.sin(b * RAD), cb = -Math.cos(b * RAD);
            g.appendChild(S('text', { x: (sb * R * 0.74).toFixed(1), y: (cb * R * 0.74).toFixed(1), dy: '0.35em', 'text-anchor': 'middle', class: 'cn-rosa-num' }, String(b)));
            if (R >= 100) {
              var bm = b + dec, sbm = Math.sin(bm * RAD), cbm = -Math.cos(bm * RAD);
              g.appendChild(S('text', { x: (sbm * R * 0.43).toFixed(1), y: (cbm * R * 0.43).toFixed(1), dy: '0.35em', 'text-anchor': 'middle', class: 'cn-rosa-num cn-rosa-num-mag' }, String(b)));
            }
          }
          // norte verdadeiro: estrela
          g.appendChild(S('path', { d: 'M0 ' + (-R - 9) + ' L3 ' + (-R - 2) + ' L0 ' + (-R - 4) + ' L-3 ' + (-R - 2) + ' Z', class: 'cn-rosa-norte' }));
          // norte magnético: seta + anotação de declinação ao longo do eixo (Carta 12000, B 70)
          var gm = S('g', { transform: 'rotate(' + dec.toFixed(2) + ')' });
          gm.appendChild(S('path', { d: 'M0 ' + (-R * 0.5) + ' L0 ' + (R * 0.5), class: 'cn-rosa-eixo' }));
          gm.appendChild(S('path', { d: 'M0 ' + (-R * 0.5 - 1) + ' l-3.5 7 l3.5 -2 l3.5 2 z', class: 'cn-rosa-seta' }));
          var txt = DEC.graus + '°' + String(DEC.min).padStart(2, '0') + "'" + DEC.lado + ' ' + DEC.ano + ' (' + DEC.varMin + "'" + DEC.varLado + ')';
          // legenda da declinação: 12 px, em duas linhas horizontais logo abaixo da rosa (ao longo do eixo ela
          // precisaria de ~7 px para caber dentro do anel); o halo mantém a leitura sobre o mar
          var txtL1 = DEC.graus + '°' + String(DEC.min).padStart(2, '0') + "'" + DEC.lado + ' ' + DEC.ano;
          var txtL2 = '(variação anual ' + DEC.varMin + "'" + DEC.varLado + ')';
          var tdec = S('text', { class: 'cn-rosa-dec', 'text-anchor': 'middle', x: 0, y: R + 22 }, S('tspan', { x: 0 }, 'Decl. ' + txtL1), S('tspan', { x: 0, dy: '1.15em' }, txtL2));
          g.appendChild(gm);
          g.appendChild(tdec);
          g.appendChild(rosaExtra);
        }

        // HUD: aviso permanente e botões de zoom
        var aviso = S('g', { class: 'cn-aviso' });
        var avisoBg = S('rect', { rx: 3 });
        var avisoT1 = S('text', {}, 'Carta de treinamento: costa fictícia');
        var avisoT2 = S('text', {}, 'Não use para navegação. Profundidades em metros (NR).');
        aviso.appendChild(avisoBg); aviso.appendChild(avisoT1); aviso.appendChild(avisoT2);
        gHud.appendChild(aviso);
        var gTraco = S('g', { class: 'cn-traco-vivo' }); gHud.appendChild(gTraco);

        var corpo = h('div', { class: 'cn-corpo' });
        corpo.appendChild(svg);
        var zoomBox = h('div', { class: 'cn-zoom' },
          h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Aproximar', title: 'Aproximar', onclick: function () { zoomEm(vis.W / 2, vis.H / 2, 1.5); } }, '+'),
          h('button', { type: 'button', class: 'btn btn-icon', 'aria-label': 'Afastar', title: 'Afastar', onclick: function () { zoomEm(vis.W / 2, vis.H / 2, 1 / 1.5); } }, '−'),
          h('button', { type: 'button', class: 'btn btn-icon cn-zoom-fit', 'aria-label': 'Mostrar a carta inteira', title: 'Mostrar a carta inteira', onclick: function () { ajustar(); } }, VL.icon('alvo', 18)));
        corpo.appendChild(zoomBox);
        var leitura = h('div', { class: 'cn-leitura', 'aria-live': 'polite' }, 'Toque ou passe o cursor na carta para ler as coordenadas.');
        var dica = h('div', { class: 'cn-dica' });
        inst.corpo.appendChild(corpo);
        inst.corpo.appendChild(h('div', { class: 'cn-rodape-carta' }, leitura));

        var painel = h('div', { class: 'cn-painel' });
        var painelEx = h('div', { class: 'cn-painel-ex' });
        var info = h('div', { class: 'cn-info', 'aria-live': 'polite' });
        inst.legenda.insertBefore(h('div', { class: 'cn-paineis' }, dica, painel, painelEx, info), inst.legenda.firstChild);
        inst.legenda.appendChild(legendaCarta());

        /* ---------------- vista: transformar e redesenhar ---------------- */
        function tela(c) { return { x: c.x * vis.k + vis.tx, y: c.y * vis.k + vis.ty }; }
        function deTela(sx, sy) { return { x: (sx - vis.tx) / vis.k, y: (sy - vis.ty) / vis.k }; }
        function llTela(ll) { return tela(paraCarta(ll.lat, ll.lon)); }
        function telaLL(sx, sy) { var c = deTela(sx, sy); return daCarta(c.x, c.y); }

        function medir() {
          var w = Math.max(280, Math.round(corpo.clientWidth || 320));
          var vh = window.innerHeight || 800;
          var hAlt = opts.altura || (w < 560 ? Math.round(Math.max(380, Math.min(560, vh * 0.62))) : Math.round(Math.max(360, Math.min(w * 1.02, Math.min(760, vh * 0.74)))));
          var mudou = w !== vis.W || hAlt !== vis.H;
          vis.W = w; vis.H = hAlt;
          var estreita = w < 560;
          M = estreita ? { l: 26, r: 8, t: 8, b: 26 } : { l: 34, r: 14, t: 14, b: 30 };
          svg.setAttribute('viewBox', '0 0 ' + w + ' ' + hAlt);
          svg.setAttribute('width', w); svg.setAttribute('height', hAlt);
          svg.style.height = hAlt + 'px';
          if (!rosa.g.firstChild) desenharRosa();
          vis.fit = Math.min((w - M.l - M.r) / GX, (hAlt - M.t - M.b) / CH);
          return mudou;
        }
        function ajustar(inicial) {
          var Wc = vis.W - M.l - M.r, Hc = vis.H - M.t - M.b, kW = Wc / GX, kH = Hc / CH;
          if (inicial === true && vis.W < 560) {
            vis.k = Math.max(kW, kH);   // celular: preenche a altura e centra na entrada da enseada
            var cc = paraCarta(deG(12.5, 12).lat, deG(12.5, 12).lon);
            vis.tx = M.l + Wc / 2 - cc.x * vis.k; vis.ty = M.t + (Hc - CH * vis.k) / 2;
          } else {
            vis.k = inicial === true && CH * kW <= Hc * 1.35 ? kW : vis.fit;
            vis.tx = M.l + (Wc - GX * vis.k) / 2;
            vis.ty = inicial === true ? M.t : M.t + (Hc - CH * vis.k) / 2;
          }
          render();
        }
        function limitar() {
          vis.k = Math.max(vis.fit * 0.85, Math.min(vis.fit * 16, vis.k));
          var cx = (M.l + vis.W - M.r) / 2, cy = (M.t + vis.H - M.b) / 2;
          vis.tx = Math.min(cx, Math.max(cx - GX * vis.k, vis.tx));
          vis.ty = Math.min(cy, Math.max(cy - CH * vis.k, vis.ty));
        }
        function zoomEm(sx, sy, f) {
          var c = deTela(sx, sy);
          vis.k *= f; limitar();
          vis.tx = sx - c.x * vis.k; vis.ty = sy - c.y * vis.k; limitar(); render();
        }
        function centrarEm(ll, kMin) {
          if (kMin && vis.k < kMin) vis.k = kMin;
          var c = paraCarta(ll.lat, ll.lon);
          vis.tx = (M.l + vis.W - M.r) / 2 - c.x * vis.k; vis.ty = (M.t + vis.H - M.b) / 2 - c.y * vis.k; limitar(); render();
        }

        var rafId = 0;
        function render() { if (!rafId) rafId = requestAnimationFrame(function () { rafId = 0; if (vivo) desenhar(); }); }
        function desenhar() {
          limitar();
          gGeo.setAttribute('transform', 'matrix(' + vis.k + ' 0 0 ' + vis.k + ' ' + vis.tx + ' ' + vis.ty + ')');
          var xmin = M.l - 60, xmax = vis.W - M.r + 60, ymin = M.t - 60, ymax = vis.H - M.b + 60;
          var espac = [2.2 * vis.k, 1.1 * vis.k, 0.55 * vis.k];   // espaçamento das sondagens em px por nível
          var R = Math.round(Math.max(44, Math.min(120, 2.3 * vis.k)));
          if (Math.abs(R - rosa.R) > 3) { rosa.R = R; desenharRosa(); }
          desenharBordas();
          desenharAviso();
          var ocupados = [], sondas = [];
          if (vis.avisoBox) ocupados.push({ x: vis.avisoBox.x - 4, y: vis.avisoBox.y - 4, w: vis.avisoBox.w + 8, h: vis.avisoBox.h + 8 });
          for (var i = 0; i < simbolos.length; i++) {
            var s = simbolos[i], p = tela(s.c), vis1;
            if (s.sond) vis1 = espac[s.nivel] >= 30;
            else if (s.rotulo) vis1 = vis.k >= s.kMin && (!s.kMax || vis.k < s.kMax);
            else vis1 = s.nivel === 0 || vis.k >= 34;
            vis1 = vis1 && p.x > xmin && p.x < xmax && p.y > ymin && p.y < ymax;
            if (s.rosa && !mostrarRosa) vis1 = false;
            if (vis1 && s.sond) { sondas.push({ s: s, p: p }); continue; }
            s.el.style.display = vis1 ? '' : 'none';
            if (vis1) {
              s.el.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
              if (s.rotulo || s.isorot) ocupados.push(caixaDe(s, p));
              else if (s.rosa) ocupados.push({ x: p.x - Math.max(rosa.R, 66) - 6, y: p.y - rosa.R - 10, w: 2 * Math.max(rosa.R, 66) + 12, h: 2 * rosa.R + 62 });
            }
          }
          for (var j = 0; j < sondas.length; j++) {
            var q = sondas[j], sx = q.p.x, sy = q.p.y;
            var oculta = tocaOcupado({ x: sx - 10, y: sy - 8, w: 22, h: 18 }, ocupados);
            q.s.el.style.display = oculta ? 'none' : '';
            if (!oculta) q.s.el.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
          }
          desenharPlot();
        }

        var mostrarRosa = true;
        // sondagens não podem ficar sob o aviso fixo, a rosa, nomes nem rótulos visíveis: cada rótulo visível entra em
        // `ocupados` (caixa em px de tela, via getBBox guardado em cache) e as sondagens que o tocam somem naquele quadro
        function caixaDe(s, p) {
          if (!s.bb) { try { var b = s.el.getBBox(); s.bb = { x: b.x, y: b.y, w: b.width, h: b.height }; } catch (e) { s.bb = { x: -20, y: -8, w: 40, h: 16 }; } }
          return { x: p.x + s.bb.x - 3, y: p.y + s.bb.y - 3, w: s.bb.w + 6, h: s.bb.h + 6 };
        }
        function tocaOcupado(sb, ocupados) {
          for (var i = 0; i < ocupados.length; i++) {
            var o = ocupados[i];
            if (sb.x < o.x + o.w && sb.x + sb.w > o.x && sb.y < o.y + o.h && sb.y + sb.h > o.y) return true;
          }
          return false;
        }
        /* ---------------- escalas de latitude e longitude nas bordas ---------------- */
        function desenharBordas() {
          var g = gBorda; while (g.firstChild) g.removeChild(g.firstChild);
          var x0 = Math.max(M.l, vis.tx), x1 = Math.min(vis.W - M.r, vis.tx + GX * vis.k), y0 = Math.max(M.t, vis.ty), y1 = Math.min(vis.H - M.b, vis.ty + CH * vis.k), BW = 7;
          clipR.setAttribute('x', x0); clipR.setAttribute('y', y0); clipR.setAttribute('width', Math.max(0, x1 - x0)); clipR.setAttribute('height', Math.max(0, y1 - y0));
          vis.cb = { x0: x0, x1: x1, y0: y0, y1: y1 };
          g.appendChild(S('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, class: 'cn-moldura' }));
          var tl = telaLL(x0, y0), br = telaLL(x1, y1);
          var latMin = Math.max(LAT_S, br.lat), latMax = Math.min(LAT_N, tl.lat), lonMin = Math.max(LON_W, tl.lon), lonMax = Math.min(LON_E, br.lon);
          var pxMin = vis.k;  // pixels por minuto de longitude
          var escolheD = function (px, need) { var op = [1, 2, 5, 10]; for (var q = 0; q < op.length; q++) if (op[q] * px >= need) return op[q]; return 20; };
          var dLab = escolheD(pxMin * 1.09, 54), dLabLon = escolheD(pxMin, 66);
          var blocos = '', blocosB = '', ticks = '';
          // latitude: bordas esquerda e direita
          var m0 = Math.floor(latMin * 60), m1 = Math.ceil(latMax * 60);
          for (var m = m0; m < m1; m++) {
            var ya = llTela({ lat: m / 60, lon: LON_W }).y, yb = llTela({ lat: (m + 1) / 60, lon: LON_W }).y;
            var yA = Math.max(y0, Math.min(y1, ya)), yB = Math.max(y0, Math.min(y1, yb));
            if (Math.abs(yA - yB) < 0.5) continue;
            var cheio = ((m % 2) + 2) % 2 === 0;
            var r = 'M' + (x0 - BW) + ' ' + yB.toFixed(1) + 'H' + x0 + 'V' + yA.toFixed(1) + 'H' + (x0 - BW) + 'Z' + 'M' + x1 + ' ' + yB.toFixed(1) + 'H' + (x1 + BW) + 'V' + yA.toFixed(1) + 'H' + x1 + 'Z';
            if (cheio) blocos += r; else blocosB += r;
            if (pxMin > 26) for (var dd = 1; dd < 10; dd++) {
              var yt = llTela({ lat: (m + dd / 10) / 60, lon: LON_W }).y; if (yt < y0 || yt > y1) continue;
              var L = dd === 5 ? 6 : 3.5;
              ticks += 'M' + x0 + ' ' + yt.toFixed(1) + 'h' + L + 'M' + x1 + ' ' + yt.toFixed(1) + 'h-' + L;
            }
          }
          for (m = Math.ceil(latMin * 60); m <= Math.floor(latMax * 60); m++) {
            if (((m % dLab) + dLab) % dLab) continue;
            var yl = llTela({ lat: m / 60, lon: LON_W }).y; if (yl < y0 + 4 || yl > y1 - 4) continue;
            var a = Math.abs(m), gg = Math.floor(a / 60), mm = a % 60;
            g.appendChild(S('text', { class: 'cn-escala-txt', transform: 'translate(' + (x0 - BW - 4) + ' ' + yl.toFixed(1) + ') rotate(-90)', 'text-anchor': 'middle' }, (mm === 0 ? gg + '°' : gg + '°' + String(mm).padStart(2, '0') + "'") + 'S'));
          }
          // longitude: bordas inferior e superior
          m0 = Math.floor(lonMin * 60); m1 = Math.ceil(lonMax * 60);
          for (m = m0; m < m1; m++) {
            var xa = llTela({ lat: LAT_S, lon: m / 60 }).x, xb = llTela({ lat: LAT_S, lon: (m + 1) / 60 }).x;
            var xA = Math.max(x0, Math.min(x1, xa)), xB = Math.max(x0, Math.min(x1, xb));
            if (Math.abs(xA - xB) < 0.5) continue;
            var ch = ((m % 2) + 2) % 2 === 0;
            var rr = 'M' + xA.toFixed(1) + ' ' + y1 + 'V' + (y1 + BW) + 'H' + xB.toFixed(1) + 'V' + y1 + 'Z' + 'M' + xA.toFixed(1) + ' ' + y0 + 'V' + (y0 - BW) + 'H' + xB.toFixed(1) + 'V' + y0 + 'Z';
            if (ch) blocos += rr; else blocosB += rr;
            if (pxMin > 26) for (var de = 1; de < 10; de++) {
              var xt = llTela({ lat: LAT_S, lon: (m + de / 10) / 60 }).x; if (xt < x0 || xt > x1) continue;
              var L2 = de === 5 ? 6 : 3.5;
              ticks += 'M' + xt.toFixed(1) + ' ' + y1 + 'v-' + L2 + 'M' + xt.toFixed(1) + ' ' + y0 + 'v' + L2;
            }
          }
          for (m = Math.ceil(lonMin * 60); m <= Math.floor(lonMax * 60); m++) {
            if (((m % dLabLon) + dLabLon) % dLabLon) continue;
            var xl = llTela({ lat: LAT_S, lon: m / 60 }).x; if (xl < x0 + 14 || xl > x1 - 14) continue;
            var b = Math.abs(m), g2 = Math.floor(b / 60), m2 = b % 60;
            g.appendChild(S('text', { class: 'cn-escala-txt', x: xl.toFixed(1), y: y1 + BW + 12, 'text-anchor': 'middle' }, (m2 === 0 ? String(g2).padStart(3, '0') + '°' : String(g2).padStart(3, '0') + '°' + String(m2).padStart(2, '0') + "'") + 'W'));
          }
          g.insertBefore(S('path', { d: blocosB, class: 'cn-escala-b' }), g.firstChild);
          g.insertBefore(S('path', { d: blocos, class: 'cn-escala-p' }), g.firstChild);
          g.appendChild(S('path', { d: ticks, class: 'cn-escala-tick' }));
          g.appendChild(S('rect', { x: x0 - BW, y: y0 - BW, width: x1 - x0 + 2 * BW, height: y1 - y0 + 2 * BW, class: 'cn-moldura-ext' }));
          // compasso levado à escala de latitudes
          var md = est.medida && est.medida.tipo === 'compasso' ? est.medida : ultimo('compasso');
          if (md && md.dist > 0.01) {
            var latMed = (md.a.lat + md.b.lat) / 2;
            var ya1 = llTela({ lat: latMed - md.dist / 120, lon: LON_W }).y, ya2 = llTela({ lat: latMed + md.dist / 120, lon: LON_W }).y;
            g.appendChild(S('path', { d: 'M' + (x0 - BW - 3) + ' ' + ya1.toFixed(1) + 'h' + (BW + 9) + 'M' + (x0 - BW - 3) + ' ' + ya2.toFixed(1) + 'h' + (BW + 9) + 'M' + (x0 + 3) + ' ' + ya1.toFixed(1) + 'V' + ya2.toFixed(1), class: 'cn-escala-med' }));
          }
        }
        function ultimo(tipo) { for (var i = est.desenhos.length - 1; i >= 0; i--) if (est.desenhos[i].tipo === tipo) return est.desenhos[i]; return null; }

        function desenharAviso() {
          var estreita = vis.W < 560, cb = vis.cb || { x0: M.l, y1: vis.H - M.b };
          var x = cb.x0 + 6, y = cb.y1 - 6 - (estreita ? 22 : 36);
          avisoT1.setAttribute('x', x + 6); avisoT1.setAttribute('y', y + 14);
          avisoT2.setAttribute('x', x + 6); avisoT2.setAttribute('y', y + 28);
          avisoT1.textContent = estreita ? 'Treinamento: não use para navegação' : 'Carta de treinamento: costa fictícia';
          avisoT2.textContent = estreita ? '' : 'Não use para navegação. Profundidades em metros, reduzidas ao NR.';
          var l1 = avisoT1.getComputedTextLength ? avisoT1.getComputedTextLength() : 180, l2 = estreita ? 0 : (avisoT2.getComputedTextLength ? avisoT2.getComputedTextLength() : 180);
          avisoBg.setAttribute('x', x); avisoBg.setAttribute('y', y); avisoBg.setAttribute('width', Math.max(l1, l2) + 12); avisoBg.setAttribute('height', estreita ? 21 : 36);
          vis.avisoBox = { x: x, y: y, w: Math.max(l1, l2) + 12, h: estreita ? 21 : 36 };
        }

        /* ---------------- camada de plotagem do usuário ---------------- */
        function linhaTela(a, b, cls, extra) { var pa = llTela(a), pb = llTela(b); return S('line', Object.assign({ x1: pa.x.toFixed(1), y1: pa.y.toFixed(1), x2: pb.x.toFixed(1), y2: pb.y.toFixed(1), class: cls }, extra || {})); }
        function textoTela(ll, txt, cls, dx, dy, anc) { var p = llTela(ll); return S('text', { x: (p.x + (dx || 0)).toFixed(1), y: (p.y + (dy || 0)).toFixed(1), class: cls, 'text-anchor': anc || 'start' }, txt); }
        function rotuloLinha(a, b, txt, cls, lado) {
          var pa = llTela(a), pb = llTela(b), mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
          var ang = Math.atan2(pb.y - pa.y, pb.x - pa.x) / RAD; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
          return S('text', { transform: 'translate(' + mx.toFixed(1) + ' ' + my.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')', y: lado === 'baixo' ? 14 : -6, 'text-anchor': 'middle', class: cls }, txt);
        }
        function marcaPonto(ll, estilo, rot) {
          var p = llTela(ll), g = S('g', { transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')', class: 'cn-pto cn-pto-' + estilo });
          if (estilo === 'obs') { g.appendChild(S('circle', { r: 6, class: 'cn-pto-c' })); g.appendChild(S('circle', { r: 1.6, class: 'cn-pto-d' })); }
          else if (estilo === 'est') { g.appendChild(S('path', { d: 'M-6 0 A6 6 0 0 1 6 0 Z', class: 'cn-pto-c' })); g.appendChild(S('circle', { r: 1.6, class: 'cn-pto-d' })); }
          else if (estilo === 'ec') { g.appendChild(S('path', { d: 'M0 -7 L7 0 L0 7 L-7 0 Z', class: 'cn-pto-c' })); g.appendChild(S('circle', { r: 1.6, class: 'cn-pto-d' })); }
          else if (estilo === 'resp') { g.appendChild(S('path', { d: 'M-7 -7 L7 7 M-7 7 L7 -7', class: 'cn-pto-x' })); }
          else if (estilo === 'certo') { g.appendChild(S('circle', { r: 7, class: 'cn-pto-c' })); g.appendChild(S('circle', { r: 2, class: 'cn-pto-d' })); }
          else if (estilo === 'alvo') { g.appendChild(S('circle', { r: 8, class: 'cn-pto-c' })); g.appendChild(S('path', { d: 'M-12 0 H-4 M4 0 H12 M0 -12 V-4 M0 4 V12', class: 'cn-pto-x' })); }
          else { g.appendChild(S('circle', { r: 4, class: 'cn-pto-c' })); g.appendChild(S('path', { d: 'M-9 0 H9 M0 -9 V9', class: 'cn-pto-x' })); }
          if (rot) g.appendChild(S('text', { x: 9, y: -8, class: 'cn-pto-rot' }, rot));
          return g;
        }
        function desenharObjeto(o, grupo, sol) {
          var cls = sol ? ' cn-sol' : '';
          switch (o.tipo) {
            case 'regua':
              grupo.appendChild(linhaTela(o.a, o.b, 'cn-linha' + cls));
              if (o.semRot) break;   // linha colinear a um vetor já rotulado (triângulo de corrente)
              grupo.appendChild(rotuloLinha(o.a, o.b, 'R ' + fmtRumoInt(o.rumo).replace('°', ''), 'cn-linha-rot' + cls));
              grupo.appendChild(rotuloLinha(o.a, o.b, 'd = ' + fmtDist(o.dist), 'cn-linha-rot cn-linha-sub' + cls, 'baixo'));
              break;
            case 'compasso':
              var pa = llTela(o.a), pb = llTela(o.b), mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2, L = Math.hypot(pb.x - pa.x, pb.y - pa.y);
              var nx = -(pb.y - pa.y) / (L || 1), ny = (pb.x - pa.x) / (L || 1); if (ny > 0) { nx = -nx; ny = -ny; }
              var hx = mx + nx * Math.min(90, L * 0.42), hy = my + ny * Math.min(90, L * 0.42);
              grupo.appendChild(S('path', { d: 'M' + pa.x.toFixed(1) + ' ' + pa.y.toFixed(1) + 'L' + hx.toFixed(1) + ' ' + hy.toFixed(1) + 'L' + pb.x.toFixed(1) + ' ' + pb.y.toFixed(1), class: 'cn-compasso' + cls }));
              grupo.appendChild(S('circle', { cx: hx.toFixed(1), cy: hy.toFixed(1), r: 3.5, class: 'cn-compasso-pino' }));
              grupo.appendChild(S('text', { x: hx.toFixed(1), y: (hy - 8).toFixed(1), 'text-anchor': 'middle', class: 'cn-linha-rot' + cls }, 'd = ' + fmtDist(o.dist)));
              break;
            case 'ponto':
              grupo.appendChild(marcaPonto(o.p, o.estilo || 'pin', o.rot));
              break;
            case 'ldp':
              var fim = destino(o.obj, norm360(o.mv + 180), o.comp || 14);
              grupo.appendChild(linhaTela(o.ini || o.obj, fim, 'cn-ldp' + (o.transp ? ' cn-ldp-transp' : '') + cls));
              var meio = destino(o.obj, norm360(o.mv + 180), Math.min(3.2, (o.comp || 14) * 0.4));
              grupo.appendChild(rotuloLinha(meio, destino(meio, norm360(o.mv + 180), 0.6), (o.hora ? o.hora + '  ' : '') + 'M ' + fmtRumo(o.mv).replace('°', '') + (o.transp ? ' (transp.)' : ''), 'cn-ldp-rot' + cls));
              break;
            case 'vetor':
              var ln = linhaTela(o.a, o.b, 'cn-vetor cn-vetor-' + o.v + cls, { 'marker-end': 'url(#' + uid + '-' + (o.v === 'cor' ? 'seta-cor' : sol ? 'seta-sol' : 'seta') + ')' });
              grupo.appendChild(ln);
              if (o.rot) grupo.appendChild(rotuloLinha(o.a, o.b, o.rot, 'cn-linha-rot cn-vrot-' + o.v + cls, o.lado));
              break;
            case 'tri':
              var pts = o.pts.map(function (p) { var t = llTela(p); return t.x.toFixed(1) + ',' + t.y.toFixed(1); }).join(' ');
              grupo.appendChild(S('polygon', { points: pts, class: 'cn-tri' + cls }));
              break;
            case 'arco':
              var c = llTela(o.c), pr = llTela(destino(o.c, 90, o.r)), rp = Math.abs(pr.x - c.x);
              grupo.appendChild(S('circle', { cx: c.x.toFixed(1), cy: c.y.toFixed(1), r: rp.toFixed(1), class: 'cn-arco' + cls }));
              break;
          }
        }
        function desenharPlot() {
          var g = gPlot; while (g.firstChild) g.removeChild(g.firstChild);
          est.desenhos.forEach(function (o) { desenharObjeto(o, g, false); });
          est.solucao.forEach(function (o) { desenharObjeto(o, g, true); });
          if (est.medida) desenharObjeto(est.medida, g, false);
          if (est.origem) g.appendChild(marcaPonto(est.origem, 'alvo', 'partida'));
          if (est.resposta) g.appendChild(marcaPonto(est.resposta, 'resp', 'sua resposta'));
          if (est.ex && est.ex.mostrar) est.ex.mostrar.forEach(function (o) { desenharObjeto(o, g, false); });
          if (est.sel) { var p = llTela(est.sel); g.appendChild(S('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 13, class: 'cn-sel' })); }
          // régua transportada para a rosa
          while (rosaExtra.firstChild) rosaExtra.removeChild(rosaExtra.firstChild);
          var rg = est.medida && est.medida.tipo === 'regua' ? est.medida : (est.ferramenta === 'regua' ? ultimo('regua') : null);
          if (rg && mostrarRosa) {
            var R = rosa.R, a = rg.rumo, s = Math.sin(a * RAD), c = -Math.cos(a * RAD);
            rosaExtra.appendChild(S('line', { x1: (-s * R).toFixed(1), y1: (-c * R).toFixed(1), x2: (s * R).toFixed(1), y2: (c * R).toFixed(1), class: 'cn-rosa-paralela' }));
            rosaExtra.appendChild(S('circle', { cx: (s * R).toFixed(1), cy: (c * R).toFixed(1), r: 4, class: 'cn-rosa-lido' }));
          }
        }

        /* ---------------- interação: ponteiros ---------------- */
        var ponteiros = {}, gesto = null;
        function ptSvg(e) { var r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) * (vis.W / r.width), y: (e.clientY - r.top) * (vis.H / r.height) }; }
        function dentro(p) { var cb = vis.cb || { x0: M.l, x1: vis.W - M.r, y0: M.t, y1: vis.H - M.b }; return p.x >= cb.x0 && p.x <= cb.x1 && p.y >= cb.y0 && p.y <= cb.y1; }
        function alvosSnap() {
          var lista = FEICOES.map(function (f) { return { lat: f.lat, lon: f.lon, f: f }; });
          est.desenhos.forEach(function (o) { if (o.tipo === 'ponto') lista.push(o.p); if (o.tipo === 'regua' || o.tipo === 'compasso') { lista.push(o.a); lista.push(o.b); } });
          if (est.ex && est.ex.pontos) est.ex.pontos.forEach(function (p) { lista.push(p); });
          if (est.origem) lista.push(est.origem);
          return lista;
        }
        function snap(p) {
          var best = null, bd = 16;
          alvosSnap().forEach(function (q) { var t = llTela(q); var d = Math.hypot(t.x - p.x, t.y - p.y); if (d < bd) { bd = d; best = q; } });
          return best ? { lat: best.lat, lon: best.lon, f: best.f } : telaLL(p.x, p.y);
        }
        function feicaoPerto(p, raio) {
          var best = null, bd = raio || 22;
          FEICOES.forEach(function (f) { var t = llTela(f); var d = Math.hypot(t.x - p.x, t.y - p.y); if (d < bd) { bd = d; best = f; } });
          return best;
        }
        svg.addEventListener('pointerdown', function (e) {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          svg.focus({ preventScroll: true });
          var p = ptSvg(e);
          ponteiros[e.pointerId] = p;
          try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
          var ids = Object.keys(ponteiros);
          if (ids.length === 2) {
            est.medida = null;
            var a = ponteiros[ids[0]], b = ponteiros[ids[1]];
            gesto = { tipo: 'pinca', d0: Math.hypot(a.x - b.x, a.y - b.y), k0: vis.k, c0: deTela((a.x + b.x) / 2, (a.y + b.y) / 2) };
            render(); return;
          }
          if (ids.length > 2) return;
          var f = est.ferramenta;
          if (est.modo === 'exercicio' && est.ex && est.ex.aguardaToque && f === 'mover') { gesto = { tipo: 'toque', p0: p, t0: Date.now(), resposta: true }; return; }
          if (f === 'regua' || f === 'compasso') {
            if (!dentro(p)) return;
            var a0 = snap(p);
            gesto = { tipo: 'medir', a: a0, p0: p };
            est.medida = { tipo: f, a: a0, b: a0, rumo: 0, dist: 0 };
            render(); return;
          }
          gesto = { tipo: 'pan', p0: p, tx0: vis.tx, ty0: vis.ty, t0: Date.now(), moveu: false };
        });
        svg.addEventListener('pointermove', function (e) {
          var p = ptSvg(e);
          if (dentro(p)) { var ll = telaLL(p.x, p.y); leitura.textContent = 'Cursor: ' + fmtPos(ll); }
          if (!ponteiros[e.pointerId]) return;
          ponteiros[e.pointerId] = p;
          if (!gesto) return;
          if (gesto.tipo === 'pinca') {
            var ids = Object.keys(ponteiros); if (ids.length < 2) return;
            var a = ponteiros[ids[0]], b = ponteiros[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
            vis.k = gesto.k0 * d / (gesto.d0 || 1); limitar();
            var mxp = (a.x + b.x) / 2, myp = (a.y + b.y) / 2;
            vis.tx = mxp - gesto.c0.x * vis.k; vis.ty = myp - gesto.c0.y * vis.k; render();
          } else if (gesto.tipo === 'pan') {
            var dx = p.x - gesto.p0.x, dy = p.y - gesto.p0.y;
            if (Math.abs(dx) + Math.abs(dy) > 4) gesto.moveu = true;
            if (gesto.moveu) { vis.tx = gesto.tx0 + dx; vis.ty = gesto.ty0 + dy; render(); }
          } else if (gesto.tipo === 'medir') {
            var bpt = snap(p);
            var rd = rumoDist(gesto.a, bpt);
            est.medida.b = bpt; est.medida.rumo = rd.rumo; est.medida.dist = rd.dist;
            mostrarMedida(est.medida, true);
            render();
          } else if (gesto.tipo === 'toque') {
            if (Math.hypot(p.x - gesto.p0.x, p.y - gesto.p0.y) > 8) { gesto = { tipo: 'pan', p0: p, tx0: vis.tx, ty0: vis.ty, moveu: true }; }
          }
        });
        function fimPonteiro(e) {
          if (!ponteiros[e.pointerId]) return;
          var p = ptSvg(e);
          delete ponteiros[e.pointerId];
          if (!gesto) return;
          var g = gesto;
          if (g.tipo === 'pinca') { if (Object.keys(ponteiros).length === 0) gesto = null; else { var id = Object.keys(ponteiros)[0]; gesto = { tipo: 'pan', p0: ponteiros[id], tx0: vis.tx, ty0: vis.ty, moveu: true }; } return; }
          gesto = null;
          if (g.tipo === 'medir') {
            var m = est.medida; est.medida = null;
            if (m && Math.hypot(llTela(m.b).x - llTela(m.a).x, llTela(m.b).y - llTela(m.a).y) > 8) {
              est.desenhos.push(m); mostrarMedida(m, false);
            } else if (m) { toque(p); }
            render(); return;
          }
          if (g.tipo === 'pan' && !g.moveu) toque(p);
          if (g.tipo === 'toque') toque(p, true);
        }
        svg.addEventListener('pointerup', fimPonteiro);
        svg.addEventListener('pointercancel', function (e) { delete ponteiros[e.pointerId]; gesto = null; est.medida = null; render(); });
        svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !ponteiros[e.pointerId]) leitura.textContent = 'Toque ou passe o cursor na carta para ler as coordenadas.'; });
        svg.addEventListener('wheel', function (e) {
          if (!e.ctrlKey && !e.metaKey) { mostrarDicaRoda(); return; }
          e.preventDefault();
          var p = ptSvg(e); zoomEm(p.x, p.y, Math.exp(-e.deltaY * 0.0022));
        }, { passive: false });
        var dicaRodaT = 0;
        function mostrarDicaRoda() {
          if (Date.now() - dicaRodaT < 4000) return; dicaRodaT = Date.now();
          leitura.textContent = 'Para aproximar a carta, use Ctrl + roda do mouse, a pinça ou os botões + e −.';
        }
        svg.addEventListener('keydown', function (e) {
          var passo = 40, usou = true;
          if (e.key === 'ArrowLeft') vis.tx += passo; else if (e.key === 'ArrowRight') vis.tx -= passo;
          else if (e.key === 'ArrowUp') vis.ty += passo; else if (e.key === 'ArrowDown') vis.ty -= passo;
          else if (e.key === '+' || e.key === '=') { zoomEm(vis.W / 2, vis.H / 2, 1.4); return e.preventDefault(); }
          else if (e.key === '-' || e.key === '_') { zoomEm(vis.W / 2, vis.H / 2, 1 / 1.4); return e.preventDefault(); }
          else if (e.key === '0') { ajustar(); return e.preventDefault(); }
          else usou = false;
          if (usou) { e.preventDefault(); render(); }
        });

        function toque(p, respostaForcada) {
          if (!dentro(p)) return;
          var ll = telaLL(p.x, p.y);
          if (est.modo === 'exercicio' && est.ex && est.ex.aguardaToque && (respostaForcada || est.ferramenta === 'mover' || est.ferramenta === 'posicao')) {
            est.resposta = ll; render(); exAtualizarResposta(); return;
          }
          var f = est.ferramenta;
          if (f === 'mover') {
            var ft = feicaoPerto(p);
            if (ft) { est.sel = ft; mostrarFeicao(ft); } else { est.sel = null; info.innerHTML = ''; }
            render(); return;
          }
          if (f === 'posicao') { est.desenhos.push({ tipo: 'ponto', p: ll, estilo: 'pin', rot: fmtPos(ll) }); leitura.textContent = 'Ponto: ' + fmtPos(ll); render(); return; }
          if (f === 'marcacao') { var fm = feicaoPerto(p, 26); if (fm && fm.notavel) { selMarc.value = fm.id; est.sel = fm; render(); mostrarFeicao(fm); } return; }
          if (f === 'estima' || f === 'corrente') { var sp = snap(p); est.origem = { lat: sp.lat, lon: sp.lon }; render(); atualizarPainel(); }
        }

        function mostrarMedida(m, vivoM) {
          if (m.tipo === 'regua') {
            var dec = decNoAno(est.ano), rmg = norm360(m.rumo - dec);
            leitura.textContent = 'Rumo verdadeiro R ' + fmtRumo(m.rumo) + ' (recíproca ' + fmtRumo(m.rumo + 180) + ') · Rmg ' + fmtRumo(rmg) + ' · d = ' + fmtDist(m.dist);
            if (!vivoM) info.innerHTML = '<p><b>Rumo verdadeiro: ' + fmtRumo(m.rumo) + '</b>. Lido na rosa dos rumos verdadeiros (anel externo), no sentido do traçado. A recíproca é ' + fmtRumo(m.rumo + 180) + ': cuidado para não ler o lado errado.</p>' +
              '<p>Rumo magnético: Rmg = Rv ± Dec mg = ' + fmtRumo(m.rumo) + (dec < 0 ? ' + ' : ' − ') + num(Math.round(Math.abs(dec) * 2) / 2, 1) + '° (' + (dec < 0 ? 'W' : 'E') + ') = <b>' + fmtRumo(rmg) + '</b>. Do verdadeiro para o magnético, declinação W soma e E subtrai (declinação de ' + fmtGM(dec) + ', atualizada para ' + est.ano + '). Distância: ' + fmtDist(m.dist) + '.</p>' +
              '<p class="cn-ref">Manual de Navegação da MB, Vol. I, Apêndice A ao Cap. 2 (problemas C e D) e item 3.2.5.</p>';
          } else {
            leitura.textContent = 'Distância d = ' + fmtDist(m.dist) + ' (medida na escala de latitudes, na latitude média)';
            if (!vivoM) info.innerHTML = '<p><b>Distância: ' + fmtDist(m.dist) + '</b>. Leve a abertura do compasso à <b>escala de latitudes</b> (borda lateral), na altura da latitude média dos dois pontos: 1 minuto de latitude = 1 milha náutica. Nunca meça na escala de longitudes. A marca magenta na borda esquerda mostra a abertura.</p>' +
              '<p class="cn-ref">Manual de Navegação da MB, Vol. I, Apêndice A ao Cap. 2, problema E.</p>';
          }
        }
        function mostrarFeicao(f) {
          var html = '<p><b>' + VL.esc(f.nome) + '</b> · ' + fmtPos(f) + '</p>';
          if (f.car) html += '<p>Na carta: <b class="cn-mono">' + VL.esc(f.car) + '</b>' + (VL.settings.get('intl') ? ' <span class="muted">(internacional: ' + VL.esc(carIntl(f.car)) + ')</span>' : '') + '. ' + VL.esc(CARAC[f.car] || '') + '</p>';
          if (EXPLICA[f.tipo]) html += '<p>' + VL.esc(EXPLICA[f.tipo]) + '</p>';
          html += '<p class="cn-ref">Abreviaturas nacionais da Carta 12000 (INT 1), seção P: Lp = lampejo, LpL = lampejo longo, MR = muito rápida, E = encarnada, V = verde. Balizamento IALA Região B (Manual de Navegação da MB, Vol. I, item 13.3).</p>';
          info.innerHTML = html;
        }
        function carIntl(c) {
          return c.replace(/LpL/g, 'LFl').replace(/Lp/g, 'Fl').replace(/MR/g, 'VQ').replace(/ E /g, ' R ').replace(/ V /g, ' G ');
        }

        /* ---------------- modos e ferramentas ---------------- */
        function definirModo(m) {
          est.modo = m;
          VL.$$('button', modoSeg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
          est.solucao = []; est.resposta = null;
          if (m === 'exercicio') { if (!est.ex) novoExercicio(opts.exercicio || 'rumo-dist'); else renderEx(); }
          else { est.ex = null; painelEx.innerHTML = ''; }
          painelEx.hidden = m !== 'exercicio';
          render();
        }
        function definirFerramenta(f) {
          est.ferramenta = f; est.sel = null; est.medida = null;
          VL.$$('.cn-ferr[data-f]', barra).forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === f));
            // barra rolável do celular: traz a ferramenta escolhida para a vista (sem rolar a página)
            if (b.getAttribute('data-f') === f && barra.scrollWidth > barra.clientWidth + 1) {
              if (b.offsetLeft < barra.scrollLeft || b.offsetLeft + b.offsetWidth > barra.scrollLeft + barra.clientWidth) barra.scrollLeft = Math.max(0, b.offsetLeft - 8);
            }
          });
          marcarFimBarra();
          svg.setAttribute('data-ferramenta', f);
          atualizarPainel(); render();
        }
        function atualizarDecInfo() {
          var d = decNoAno(est.ano);
          // no celular só aparece a parte final ("Dec mg em 2026: 22°17'W"); a anotação completa está na rosa e no título
          decInfo.innerHTML = '';
          decInfo.appendChild(h('span', { class: 'cn-dec-carta' }, 'Carta: Dec ' + DEC.graus + '°' + String(DEC.min).padStart(2, '0') + "'" + DEC.lado + ' (' + DEC.ano + '), variação anual ' + DEC.varMin + "'" + DEC.varLado + ' · '));
          decInfo.appendChild(h('span', { class: 'cn-dec-curto' }, 'Dec mg '));
          decInfo.appendChild(h('span', null, 'em ' + est.ano + ': ' + fmtGM(d)));
          decInfo.title = 'Carta: ' + DEC.graus + '°' + DEC.min + "'" + DEC.lado + ' ' + DEC.ano + ', variação anual ' + DEC.varMin + "'" + DEC.varLado + '. ' + (est.ano - DEC.ano) + ' ano(s) × ' + DEC.varMin + "'" + DEC.varLado;
        }

        var selMarc;
        function campoNum(rot, attrs, sufixo) {
          var inp = h('input', Object.assign({ type: 'text', inputmode: 'decimal', autocomplete: 'off' }, attrs));
          return { el: h('label', { class: 'cn-campo' }, h('span', null, rot), h('span', { class: 'cn-campo-in' }, inp, sufixo ? h('span', { class: 'cn-suf' }, sufixo) : null)), inp: inp };
        }
        function atualizarPainel() {
          var f = est.ferramenta; painel.innerHTML = ''; dica.innerHTML = '';
          var txt = {
            mover: 'Arraste para mover a carta. Pinça, Ctrl + roda do mouse ou os botões + e − aproximam. Toque num farol, boia ou perigo para ver o que o símbolo significa.',
            regua: 'Régua paralela' + intl('parallel rule') + ': arraste de um ponto a outro. O rumo verdadeiro é lido na rosa dos rumos verdadeiros, para onde a régua "transporta" a direção (linha tracejada na rosa). Pontas grudam em faróis, boias e pontos.',
            compasso: 'Compasso de pontas secas' + intl('dividers') + ': arraste entre dois pontos. A distância vem da escala de latitudes, na latitude média: 1\' de latitude = 1 milha náutica (M).',
            posicao: 'Toque na carta para ler a latitude e a longitude de um ponto, ou digite coordenadas para plotar.',
            marcacao: 'Marcação: escolha um ponto notável e a marcação observada. A linha de posição (LDP) sai do objeto no sentido oposto ao da marcação. Duas ou três LDP dão a posição.',
            estima: 'Navegação estimada' + intl('dead reckoning') + ': toque na carta para o ponto de partida (ou use o último ponto). Informe rumo, velocidade e tempo.',
            corrente: 'Triângulo de corrente: toque na carta para o ponto de partida. Escolha o problema e informe os dados.',
          }[f];
          dica.appendChild(h('p', { class: 'cn-dica-txt' }, txt));
          if (f === 'posicao') painelPosicao();
          else if (f === 'marcacao') painelMarcacao();
          else if (f === 'estima') painelEstima();
          else if (f === 'corrente') painelCorrente();
        }
        function camposCoord(prefixo) {
          var lg = campoNum('Lat (graus)', { 'aria-label': prefixo + 'latitude, graus', value: '23', size: 3 }, '°');
          var lm = campoNum('min', { 'aria-label': prefixo + 'latitude, minutos', placeholder: '50,0', size: 4 }, "' S");
          var og = campoNum('Long (graus)', { 'aria-label': prefixo + 'longitude, graus', value: '044', size: 3 }, '°');
          var om = campoNum('min', { 'aria-label': prefixo + 'longitude, minutos', placeholder: '12,0', size: 4 }, "' W");
          return {
            el: h('div', { class: 'cn-linha-campos' }, lg.el, lm.el, og.el, om.el),
            ler: function () {
              var a = lerNum(lg.inp.value), b = lerNum(lm.inp.value), c = lerNum(og.inp.value), d = lerNum(om.inp.value);
              if ([a, b, c, d].some(isNaN) || b >= 60 || d >= 60) return null;
              return { lat: -(a + b / 60), lon: -(c + d / 60) };
            },
          };
        }
        function painelPosicao() {
          var cc = camposCoord('Plotar: ');
          var msg = h('p', { class: 'cn-msg', 'aria-live': 'polite' });
          painel.appendChild(h('div', { class: 'cn-form' }, cc.el, h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn btn-primary', onclick: function () {
              var p = cc.ler();
              if (!p) { msg.textContent = 'Preencha graus e minutos (minutos de 0 a 59,9).'; return; }
              if (p.lat < LAT_S || p.lat > LAT_N || p.lon < LON_W || p.lon > LON_E) { msg.textContent = 'Esse ponto fica fora desta carta (23°40\'S a 24°00\'S; 044°00\'W a 044°24\'W).'; return; }
              est.desenhos.push({ tipo: 'ponto', p: p, estilo: 'pin', rot: fmtPos(p) });
              msg.textContent = 'Plotado: ' + fmtPos(p) + '. Com a régua paralela, marca-se o paralelo da latitude; com o compasso, a longitude na escala de longitudes.';
              centrarEm(p, vis.fit * 2);
            } }, 'Plotar ponto')), msg));
        }
        function notaveis() { return FEICOES.filter(function (f) { return f.notavel; }); }
        function painelMarcacao() {
          selMarc = h('select', { 'aria-label': 'Ponto notável marcado' });
          notaveis().forEach(function (f) { selMarc.appendChild(h('option', { value: f.id }, f.nome)); });
          if (est.sel && est.sel.notavel) selMarc.value = est.sel.id;
          var mv = campoNum('Marcação', { 'aria-label': 'Marcação em graus', placeholder: '045', size: 4 }, '°');
          var tipo = h('select', { 'aria-label': 'Tipo de marcação' }, h('option', { value: 'v' }, 'verdadeira (Mv)'), h('option', { value: 'mg' }, 'magnética (Mmg)'));
          var hr = campoNum('Hora (opcional)', { 'aria-label': 'Hora da observação', placeholder: '0930', size: 4 });
          var msg = h('div', { class: 'cn-msg', 'aria-live': 'polite' });
          painel.appendChild(h('div', { class: 'cn-form' },
            h('div', { class: 'cn-linha-campos' }, h('label', { class: 'cn-campo cn-campo-largo' }, h('span', null, 'Ponto notável'), selMarc), mv.el, h('label', { class: 'cn-campo' }, h('span', null, 'Tipo'), tipo), hr.el),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () {
              var v = lerNum(mv.inp.value); var f = FEICOES.filter(function (x) { return x.id === selMarc.value; })[0];
              if (isNaN(v) || v < 0 || v >= 360) { msg.textContent = 'Digite a marcação entre 000 e 359,5 graus.'; return; }
              var dec = decNoAno(est.ano), verd = tipo.value === 'mg' ? norm360(v + dec) : v;
              est.desenhos.push({ tipo: 'ldp', obj: { lat: f.lat, lon: f.lon }, mv: verd, hora: hr.inp.value.trim(), nome: f.nome });
              msg.innerHTML = (tipo.value === 'mg' ? '<p>Mv = Mmg ± Dec mg = ' + fmtRumo(v) + (dec < 0 ? ' − ' : ' + ') + num(Math.round(Math.abs(dec) * 2) / 2, 1) + '° (' + (dec < 0 ? 'W' : 'E') + ') = <b>' + fmtRumo(verd) + '</b>. Do magnético para o verdadeiro, declinação W subtrai e E soma. Só se traçam na carta marcações verdadeiras (Manual de Navegação da MB, Vol. I, item 3.2.5).</p>' : '') + analisarLdps();
              render();
            } }, 'Traçar LDP'))),
            h('details', { class: 'cn-det' }, h('summary', null, 'Transportar uma LDP (marcações sucessivas)'), formTransporte()), msg);
        }
        function formTransporte() {
          var r = campoNum('Rumo navegado', { 'aria-label': 'Rumo verdadeiro navegado entre as marcações', placeholder: '090', size: 4 }, '°');
          var d = campoNum('Distância', { 'aria-label': 'Distância navegada entre as marcações, em milhas', placeholder: '2,5', size: 4 }, 'M');
          var msg = h('p', { class: 'cn-msg' });
          return h('div', { class: 'cn-form' },
            h('p', { class: 'cn-dica-txt' }, 'Para usar a primeira LDP num instante posterior, ela é deslocada paralelamente, no rumo e pela distância navegados entre as duas observações. O cruzamento da LDP transportada com a nova LDP dá a posição (Manual de Navegação da MB, Vol. I, item 6.3.2).'),
            h('div', { class: 'cn-linha-campos' }, r.el, d.el),
            h('button', { type: 'button', class: 'btn', onclick: function () {
              var ldps = est.desenhos.filter(function (o) { return o.tipo === 'ldp' && !o.transp; });
              var rv = lerNum(r.inp.value), dv = lerNum(d.inp.value);
              if (!ldps.length) { msg.textContent = 'Trace primeiro a LDP que será transportada.'; return; }
              if (isNaN(rv) || isNaN(dv) || dv <= 0) { msg.textContent = 'Informe o rumo e a distância navegados.'; return; }
              var base = ldps[0], novoObj = destino(base.obj, rv, dv);
              est.desenhos.push({ tipo: 'ldp', obj: novoObj, mv: base.mv, transp: true, hora: base.hora, comp: 14 });
              est.desenhos.push({ tipo: 'vetor', a: base.obj, b: novoObj, v: 'sup', rot: 'R ' + fmtRumoInt(rv).replace('°', '') + ' · ' + fmtDist(dv) });
              msg.textContent = 'LDP de ' + (base.hora || 'antes') + ' transportada ' + fmtDist(dv) + ' no rumo ' + fmtRumo(rv) + '. A posição é o cruzamento com a LDP mais recente.';
              render();
            } }, 'Transportar a primeira LDP'), msg);
        }
        function intersecao(l1, l2) { // LDPs como retas na carta (Mercator)
          var a = paraCarta(l1.obj.lat, l1.obj.lon), b = paraCarta(l2.obj.lat, l2.obj.lon);
          var d1 = { x: Math.sin(l1.mv * RAD), y: -Math.cos(l1.mv * RAD) }, d2 = { x: Math.sin(l2.mv * RAD), y: -Math.cos(l2.mv * RAD) };
          var den = d1.x * d2.y - d1.y * d2.x; if (Math.abs(den) < 1e-6) return null;
          var t = ((b.x - a.x) * d2.y - (b.y - a.y) * d2.x) / den;
          var c = { x: a.x + d1.x * t, y: a.y + d1.y * t }; return daCarta(c.x, c.y);
        }
        function analisarLdps() {
          var ldps = est.desenhos.filter(function (o) { return o.tipo === 'ldp'; });
          est.desenhos = est.desenhos.filter(function (o) { return o.tipo !== 'tri' && !(o.tipo === 'ponto' && o.auto); });
          if (ldps.length < 2) return '<p>Trace mais uma LDP para obter a posição.</p>';
          var ult = ldps.slice(-3);
          if (ult.length === 2 || ldps.length === 2) {
            var p = intersecao(ult[ult.length - 2], ult[ult.length - 1]);
            if (!p) return '<p>As duas LDP são paralelas: escolha objetos com marcações bem diferentes.</p>';
            var ang = Math.abs(difAng(ult[ult.length - 2].mv, ult[ult.length - 1].mv)); if (ang > 90) ang = 180 - ang;
            est.desenhos.push({ tipo: 'ponto', p: p, estilo: 'obs', rot: 'posição', auto: true });
            return '<p>Posição pelo cruzamento: <b>' + fmtPos(p) + '</b>. Ângulo entre as LDP: ' + Math.round(ang) + '°' + (ang < 30 ? ' (pequeno: a posição fica imprecisa; o ideal é perto de 90°).' : '.') + '</p>';
          }
          var p12 = intersecao(ult[0], ult[1]), p23 = intersecao(ult[1], ult[2]), p13 = intersecao(ult[0], ult[2]);
          if (!p12 || !p23 || !p13) return '<p>Há LDP paralelas; não forma triângulo.</p>';
          var lado = Math.max(rumoDist(p12, p23).dist, rumoDist(p23, p13).dist, rumoDist(p12, p13).dist);
          var cen = { lat: (p12.lat + p23.lat + p13.lat) / 3, lon: (p12.lon + p23.lon + p13.lon) / 3 };
          est.desenhos.push({ tipo: 'tri', pts: [p12, p23, p13] });
          est.desenhos.push({ tipo: 'ponto', p: cen, estilo: 'obs', rot: 'centro', auto: true });
          return '<p>Três LDP formaram um <b>triângulo de incerteza</b>' + intl('cocked hat') + ' com lado maior de ' + fmtDist(lado) + '. Centro: <b>' + fmtPos(cen) + '</b>.</p>' +
            '<ul class="cn-lista"><li>Pequeno: adote o centro.</li><li>Perto de um perigo: adote o vértice mais próximo do perigo e confirme logo com outra posição.</li><li>Grande: abandone e obtenha outra posição.</li></ul>' +
            '<p class="cn-ref">Causas: marcações não simultâneas, erro de leitura, desvio da agulha errado, objeto mal identificado, erro de plotagem ou da carta (Manual de Navegação da MB, Vol. I, item 4.5.4).</p>';
        }
        function origemOuUltimo() {
          if (est.origem) return est.origem;
          for (var i = est.desenhos.length - 1; i >= 0; i--) if (est.desenhos[i].tipo === 'ponto') return est.desenhos[i].p;
          return null;
        }
        function painelEstima() {
          var r = campoNum('Rumo (Rv)', { 'aria-label': 'Rumo verdadeiro', placeholder: '090', size: 4 }, '°');
          var v = campoNum('Velocidade', { 'aria-label': 'Velocidade na superfície, em nós', placeholder: '6', size: 4 }, 'nós');
          var t = campoNum('Tempo', { 'aria-label': 'Tempo navegado, em minutos', placeholder: '60', size: 4 }, 'min');
          var cr = campoNum('Rcor (opcional)', { 'aria-label': 'Rumo da corrente (para onde ela vai)', placeholder: '—', size: 4 }, '°');
          var cv = campoNum('velcor', { 'aria-label': 'Velocidade da corrente, em nós', placeholder: '—', size: 4 }, 'nós');
          var msg = h('div', { class: 'cn-msg', 'aria-live': 'polite' });
          painel.appendChild(h('div', { class: 'cn-form' }, h('div', { class: 'cn-linha-campos' }, r.el, v.el, t.el, cr.el, cv.el),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () {
              var o = origemOuUltimo(), rv = lerNum(r.inp.value), vv = lerNum(v.inp.value), tv = lerNum(t.inp.value);
              if (!o) { msg.textContent = 'Toque na carta para marcar o ponto de partida.'; return; }
              if ([rv, vv, tv].some(isNaN) || vv <= 0 || tv <= 0) { msg.textContent = 'Preencha rumo, velocidade e tempo.'; return; }
              var d = vv * tv / 60, pe = destino(o, rv, d);
              est.desenhos.push({ tipo: 'ponto', p: o, estilo: 'obs' });
              est.desenhos.push({ tipo: 'vetor', a: o, b: pe, v: 'sup', rot: 'R ' + fmtRumoInt(rv).replace('°', '') + ' · ' + nos(vv) });
              est.desenhos.push({ tipo: 'ponto', p: pe, estilo: 'est', rot: 'estimada' });
              var html = '<p>Distância navegada: d = v × t = ' + nos(vv) + ' × ' + tv + ' min ÷ 60 = <b>' + fmtDist(d) + '</b>. Posição estimada: <b>' + fmtPos(pe) + '</b>.</p>';
              var rc = lerNum(cr.inp.value), vc = lerNum(cv.inp.value);
              if (!isNaN(rc) && !isNaN(vc) && vc > 0) {
                var dc = vc * tv / 60, pec = destino(pe, rc, dc);
                est.desenhos.push({ tipo: 'vetor', a: pe, b: pec, v: 'cor', rot: 'corrente ' + fmtRumoInt(rc).replace('°', '') + ' · ' + nos(vc) });
                est.desenhos.push({ tipo: 'ponto', p: pec, estilo: 'ec', rot: 'EC' });
                html += '<p>Aplicando a corrente (' + fmtRumo(rc) + ', ' + nos(vc) + ', durante ' + tv + ' min = ' + fmtDist(dc) + ') obtém-se a <b>posição estimada corrigida (EC)</b>: ' + fmtPos(pec) + '. Na carta ela é um losango com a hora e "EC".</p>';
              }
              html += '<p class="cn-ref">Manual de Navegação da MB, Vol. I, Cap. 5 (itens 5.2 e 5.5). Símbolos de posição usados aqui: círculo = observada, semicírculo = estimada, losango = estimada corrigida (EC).</p>';
              msg.innerHTML = html; est.origem = pe; render();
            } }, 'Plotar estima'))), msg);
        }
        function painelCorrente() {
          var tipo = h('select', { 'aria-label': 'Problema de corrente' },
            h('option', { value: 'governar' }, 'Rumo a governar (quero ir para um ponto)'),
            h('option', { value: 'fundo' }, 'Rumo e velocidade no fundo (governo num rumo)'));
          var alvo = h('select', { 'aria-label': 'Destino' }); alvo.appendChild(h('option', { value: '' }, 'Destino: escolha'));
          FEICOES.filter(function (f) { return f.tipo.indexOf('boia') === 0 || f.tipo === 'cardinal-w' || f.tipo === 'perigo-isolado'; }).forEach(function (f) { alvo.appendChild(h('option', { value: f.id }, f.nome)); });
          var rn = campoNum('RN (rumo na superfície)', { 'aria-label': 'Rumo verdadeiro na superfície', placeholder: '000', size: 4 }, '°');
          var vn = campoNum('velN', { 'aria-label': 'Velocidade na superfície, nós', placeholder: '6', size: 4 }, 'nós');
          var rc = campoNum('Rcor', { 'aria-label': 'Rumo da corrente, para onde ela vai', placeholder: '090', size: 4 }, '°');
          var vc = campoNum('velcor', { 'aria-label': 'Velocidade da corrente, nós', placeholder: '1,5', size: 4 }, 'nós');
          var ab = campoNum('Abatimento pelo vento', { 'aria-label': 'Abatimento pelo vento em graus', placeholder: '0', size: 3 }, '°');
          var abl = h('select', { 'aria-label': 'Bordo para onde o vento empurra' }, h('option', { value: '1' }, 'para BE'), h('option', { value: '-1' }, 'para BB'));
          var msg = h('div', { class: 'cn-msg', 'aria-live': 'polite' });
          function ajustarCampos() { var g = tipo.value === 'governar'; alvo.parentNode.hidden = !g; rn.el.hidden = g; }
          tipo.addEventListener('change', ajustarCampos);
          painel.appendChild(h('div', { class: 'cn-form' },
            h('div', { class: 'cn-linha-campos' }, h('label', { class: 'cn-campo cn-campo-largo' }, h('span', null, 'Problema'), tipo), h('label', { class: 'cn-campo cn-campo-largo' }, h('span', null, 'Destino'), alvo)),
            h('div', { class: 'cn-linha-campos' }, rn.el, vn.el, rc.el, vc.el),
            h('div', { class: 'cn-linha-campos' }, ab.el, h('label', { class: 'cn-campo' }, h('span', null, 'Vento empurra'), abl)),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () {
              var o = origemOuUltimo(); if (!o) { msg.textContent = 'Toque na carta para marcar o ponto de partida.'; return; }
              var velN = lerNum(vn.inp.value), Rc = lerNum(rc.inp.value), Vc = lerNum(vc.inp.value), abt = lerNum(ab.inp.value) || 0, lado = Number(abl.value);
              if (isNaN(velN) || velN <= 0 || isNaN(Rc) || isNaN(Vc) || Vc < 0) { msg.textContent = 'Preencha velN, Rcor e velcor.'; return; }
              var r = tipo.value === 'governar' ? resolverGovernar(o, alvo.value, velN, Rc, Vc, abt * lado) : resolverFundo(o, lerNum(rn.inp.value), velN, Rc, Vc, abt * lado);
              if (r.erro) { msg.textContent = r.erro; return; }
              est.solucao = []; r.objs.forEach(function (x) { est.desenhos.push(x); });
              msg.innerHTML = r.html; render();
            } }, 'Resolver'))), msg);
          ajustarCampos();
        }
        /** Lado do rótulo de uma linha a→b que fica longe do ponto p (o outro vértice do triângulo). */
        function ladoLonge(a, b, p) {
          var A = paraCarta(a.lat, a.lon), B = paraCarta(b.lat, b.lon), P = paraCarta(p.lat, p.lon);
          var ang = Math.atan2(B.y - A.y, B.x - A.x) / RAD; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
          var nx = -Math.sin(ang * RAD), ny = Math.cos(ang * RAD);   // direção "baixo" do texto girado
          return (P.x - (A.x + B.x) / 2) * nx + (P.y - (A.y + B.y) / 2) * ny > 0 ? 'cima' : 'baixo';
        }
        function vetorDe(r, v) { return { x: v * Math.sin(r * RAD), y: v * Math.cos(r * RAD) }; }
        function angDe(v) { return norm360(Math.atan2(v.x, v.y) / RAD); }
        /** Rumo a governar: dados Rfd desejado (para o destino), velN, corrente e abatimento (graus, + = para BE). */
        function calcGovernar(rfd, velN, Rc, Vc) {
          var g = vetorDe(rfd, 1), c = vetorDe(Rc, Vc), gc = g.x * c.x + g.y * c.y, disc = gc * gc - (Vc * Vc - velN * velN);
          if (disc < 0) return null;
          var vg = gc + Math.sqrt(disc); if (vg <= 0) return null;
          var w = { x: vg * g.x - c.x, y: vg * g.y - c.y };
          return { rn: angDe(w), velfd: vg };
        }
        function resolverGovernar(o, alvoId, velN, Rc, Vc, abt) {
          var f = FEICOES.filter(function (x) { return x.id === alvoId; })[0];
          if (!f) return { erro: 'Escolha o destino.' };
          var rd = rumoDist(o, f), s = calcGovernar(rd.rumo, velN, Rc, Vc);
          if (!s) return { erro: 'Com essa corrente o barco não consegue seguir esse rumo no fundo (a corrente é forte demais).' };
          var proa = norm360(s.rn - abt);
          var c1 = destino(o, Rc, Vc), fim = destino(o, rd.rumo, s.velfd);
          var objs = [
            { tipo: 'regua', a: o, b: { lat: f.lat, lon: f.lon }, rumo: rd.rumo, dist: rd.dist, semRot: true },
            { tipo: 'vetor', a: o, b: c1, v: 'cor', rot: 'corrente 1 h', lado: ladoLonge(o, c1, fim) },
            { tipo: 'arco', c: c1, r: velN },
            { tipo: 'vetor', a: c1, b: fim, v: 'sup', rot: 'RN ' + fmtRumoInt(s.rn).replace('°', ''), lado: ladoLonge(c1, fim, o) },
            { tipo: 'vetor', a: o, b: fim, v: 'fd', rot: 'Rfd ' + fmtRumoInt(rd.rumo).replace('°', '') + ' · ' + nos(s.velfd), lado: ladoLonge(o, fim, c1) },
          ];
          var tempo = rd.dist / s.velfd * 60;
          var html = '<ol class="cn-passos">' +
            '<li>Trace o rumo no fundo desejado, do ponto de partida ao destino: Rfd = ' + fmtRumo(rd.rumo) + ', ' + fmtDist(rd.dist) + '.</li>' +
            '<li>Do ponto de partida, trace o vetor corrente de 1 hora: ' + fmtRumo(Rc) + ', ' + num(Vc, 1) + ' M.</li>' +
            '<li>Da ponta do vetor corrente, abra o compasso com a velocidade do barco (' + num(velN, 1) + ' M) e corte a linha do rumo no fundo.</li>' +
            '<li>A direção da ponta da corrente até esse corte é o <b>rumo na superfície RN = ' + fmtRumo(s.rn) + '</b>. A distância do ponto de partida ao corte é a <b>velocidade no fundo = ' + nos(s.velfd) + '</b>.</li>' +
            (abt ? '<li>Abatimento pelo vento de ' + Math.abs(abt) + '° para ' + (abt > 0 ? 'BE' : 'BB') + ': o barco escorrega a sotavento, então a proa deve ficar ' + Math.abs(abt) + '° para ' + (abt > 0 ? 'BB' : 'BE') + ' do RN. <b>Proa a governar = ' + fmtRumo(proa) + '</b> (verdadeira).</li>' : '') +
            '<li>Tempo até o destino: ' + fmtDist(rd.dist) + ' ÷ ' + nos(s.velfd) + ' ≈ ' + Math.round(tempo) + ' min.</li></ol>' +
            '<p class="cn-ref">Triângulo de corrente estimado (Manual de Navegação da MB, Vol. I, itens 5.6 e 5.7). O Manual inclui o vento entre os fatores da "corrente"; aqui o abatimento pelo vento' + intl('leeway') + ' é separado porque o veleiro o sente muito.</p>';
          return { objs: objs, html: html };
        }
        function resolverFundo(o, rnv, velN, Rc, Vc, abt) {
          if (isNaN(rnv)) return { erro: 'Informe o rumo na superfície (RN).' };
          var rnEf = norm360(rnv + abt), w = vetorDe(rnEf, velN), c = vetorDe(Rc, Vc), gv = { x: w.x + c.x, y: w.y + c.y };
          var rfd = angDe(gv), vfd = Math.hypot(gv.x, gv.y);
          var p1 = destino(o, rnEf, velN), p2 = destino(p1, Rc, Vc);
          var objs = [
            { tipo: 'vetor', a: o, b: p1, v: 'sup', rot: 'RN ' + fmtRumoInt(rnEf).replace('°', '') + ' · ' + nos(velN), lado: ladoLonge(o, p1, p2) },
            { tipo: 'vetor', a: p1, b: p2, v: 'cor', rot: 'corrente', lado: ladoLonge(p1, p2, o) },
            { tipo: 'vetor', a: o, b: p2, v: 'fd', rot: 'Rfd ' + fmtRumoInt(rfd).replace('°', '') + ' · ' + nos(vfd), lado: ladoLonge(o, p2, p1) },
            { tipo: 'ponto', p: p2, estilo: 'ec', rot: 'EC 1 h' },
          ];
          var abtF = difAng(rfd, rnv);
          var html = '<ol class="cn-passos">' +
            (abt ? '<li>Com abatimento pelo vento de ' + Math.abs(abt) + '° para ' + (abt > 0 ? 'BE' : 'BB') + ', o caminho na água fica em ' + fmtRumo(rnEf) + '.</li>' : '') +
            '<li>Trace o vetor superfície de 1 hora: ' + fmtRumo(rnEf) + ', ' + num(velN, 1) + ' M.</li>' +
            '<li>Da ponta dele, trace o vetor corrente: ' + fmtRumo(Rc) + ', ' + num(Vc, 1) + ' M.</li>' +
            '<li>O vetor fundo vai do ponto de partida à ponta da corrente: <b>Rfd = ' + fmtRumo(rfd) + '</b>, <b>velfd = ' + nos(vfd) + '</b>. O abatimento (ângulo entre RN e Rfd) é ' + Math.abs(Math.round(abtF)) + '° para ' + (abtF >= 0 ? 'BE' : 'BB') + '.</li></ol>' +
            '<p class="cn-ref">Manual de Navegação da MB, Vol. I, itens 5.5 (termos) e 5.6 (triângulo de corrente estimado).</p>';
          return { objs: objs, html: html };
        }

        /* ---------------- exercícios ---------------- */
        var TIPOS_EX = [
          ['rumo-dist', 'Rumo e distância'],
          ['ler', 'Ler coordenadas'],
          ['plotar', 'Plotar coordenadas'],
          ['marcacoes', 'Posição por marcações'],
          ['estima', 'Navegação estimada'],
          ['corrente', 'Rumo a governar com corrente'],
          ['sucessivas', 'Marcações sucessivas'],
        ];
        function pontoAgua(prof, margem) {
          for (var t = 0; t < 400; t++) {
            var gx = aleat(2, GX - 2), gy = aleat(1.5, GY - 4), z = campo(gx, gy);
            if (z < (prof || 6)) continue;
            var ll = deG(gx, gy);
            if (margem && FEICOES.some(function (f) { return f.tipo.indexOf('rocha') === 0 || f.tipo === 'casco' ? rumoDist(f, ll).dist < margem : false; })) continue;
            return ll;
          }
          return deG(12, 6);
        }
        function visivel(p, f) {
          // pico, antena e torre são elevados: aparecem por cima da terra baixa. Faróis e faroletes ao nível
          // da costa podem ficar escondidos atrás de uma ponta: a visada não pode cruzar terra.
          if (f.tipo === 'pico' || f.tipo === 'antena' || f.tipo === 'notavel') return true;
          var rd = rumoDist(p, f), n = Math.ceil(rd.dist / 0.15);
          for (var i = 1; i < n; i++) {
            var q = destino(p, rd.rumo, rd.dist * i / n); if (rumoDist(q, f).dist < 0.35) break;
            if (profundidade(q.lat, q.lon) < 0) return false;
          }
          return true;
        }
        function pontoAguaEm(gx0, gx1, gy0, gy1, prof) {
          for (var t = 0; t < 300; t++) { var gx = aleat(gx0, gx1), gy = aleat(gy0, gy1); if (campo(gx, gy) >= (prof || 5)) return deG(gx, gy); }
          return null;
        }
        /** A derrota a→b fica em água navegável (≥ 3 m) e longe de pedras e cascos? Ignora o trecho final junto ao destino. */
        function trajetoLimpa(a, b, folgaFim) {
          var rd = rumoDist(a, b), n = Math.ceil(rd.dist / 0.1), fimLivre = folgaFim == null ? 0.3 : folgaFim;
          for (var i = 1; i < n; i++) {
            var d = rd.dist * i / n; if (rd.dist - d < fimLivre) break;
            var q = destino(a, rd.rumo, d);
            if (profundidade(q.lat, q.lon) < 3) return false;
            if (FEICOES.some(function (f) { return (f.tipo.indexOf('rocha') === 0 || f.tipo === 'casco') && rumoDist(f, q).dist < 0.3; })) return false;
          }
          return true;
        }
        function nomeBoia(f) { return f.nome.replace(/ \(.*\)$/, ''); }

        var gerar = {
          'rumo-dist': function () {
            var cand = FEICOES.filter(function (f) { return f.tipo.indexOf('boia') === 0 || f.tipo === 'cardinal-w' || f.tipo === 'perigo-isolado'; });
            var A, B, rd, usaPonto = Math.random() < 0.5;
            for (var t = 0; t < 160; t++) {
              A = usaPonto ? pontoAgua(8, 0.5) : escolha(cand); B = escolha(cand.filter(function (c) { return c !== A; }));
              rd = rumoDist(A, B); if (rd.dist > 1.2 && rd.dist < 12 && trajetoLimpa(A, B)) break;
            }
            var de = A.nome ? 'da <b>' + VL.esc(nomeBoia(A)) + '</b>' : 'do <b>ponto A</b> (' + fmtPos(A) + ')';
            return {
              enunciado: 'Qual o rumo verdadeiro e a distância ' + de + ' até a <b>' + VL.esc(nomeBoia(B)) + '</b>?',
              campos: [['rumo', 'Rumo verdadeiro', '°'], ['dist', 'Distância', 'M']],
              pontos: [A, B], mostrar: A.nome ? [] : [{ tipo: 'ponto', p: A, estilo: 'pin', rot: 'A' }],
              centro: { lat: (A.lat + B.lat) / 2, lon: (A.lon + B.lon) / 2 },
              corrigir: function (r) {
                var e1 = Math.abs(difAng(r.rumo, rd.rumo)), e2 = Math.abs(r.dist - rd.dist), rec = Math.abs(difAng(r.rumo, rd.rumo + 180)) <= 2;
                return {
                  ok: e1 <= 2 && e2 <= 0.2,
                  res: 'Rumo ' + fmtRumoInt(rd.rumo) + ' e distância ' + fmtDist(rd.dist) + '.' + (rec ? ' Você leu a recíproca: confira o sentido, de A para B.' : ''),
                  erros: [e1 <= 2 ? 'rumo dentro da tolerância de 2°' : 'rumo com erro de ' + Math.round(e1) + '° (tolerância 2°)', e2 <= 0.2 ? 'distância dentro da tolerância de 0,2 M' : 'distância com erro de ' + num(e2, 1) + ' M (tolerância 0,2 M)'],
                  passos: ['Una os dois pontos com a régua paralela.', 'Leve a régua, sem girar, até o centro da rosa dos rumos verdadeiros e leia no sentido de A para B: ' + fmtRumoInt(rd.rumo) + '. A recíproca seria ' + fmtRumoInt(rd.rumo + 180) + '.', 'Abra o compasso de A a B e leve a abertura à escala de latitudes, na altura da latitude média: ' + fmtDist(rd.dist) + '.'],
                  sol: [{ tipo: 'regua', a: A, b: B, rumo: rd.rumo, dist: rd.dist }],
                  ref: 'Manual de Navegação da MB, Vol. I, Apêndice A ao Cap. 2, problemas D e E.',
                };
              },
            };
          },
          'ler': function () {
            var P = pontoAgua(3, 0);
            var Pr = { lat: Math.round(P.lat * 600) / 600, lon: Math.round(P.lon * 600) / 600 };
            return {
              enunciado: 'Quais as coordenadas do ponto <b>X</b> marcado na carta? Use as escalas das bordas (minutos e décimos).',
              campos: [['latg', 'Lat (graus)', '°', '23'], ['latm', 'min', "' S"], ['long', 'Long (graus)', '°', '044'], ['lonm', 'min', "' W"]],
              mostrar: [{ tipo: 'ponto', p: Pr, estilo: 'resp', rot: 'X' }], centro: Pr, zoom: 2.2,
              corrigir: function (r) {
                var lat = -(r.latg + r.latm / 60), lon = -(r.long + r.lonm / 60);
                var e1 = Math.abs(lat - Pr.lat) * 60, e2 = Math.abs(lon - Pr.lon) * 60;
                return {
                  ok: e1 <= 0.2 && e2 <= 0.2, res: 'O ponto X está em ' + fmtPos(Pr) + '.',
                  erros: ['latitude: erro de ' + num(e1, 1) + "' (tolerância 0,2')", 'longitude: erro de ' + num(e2, 1) + "' (tolerância 0,2')"],
                  passos: ['Com a régua paralela, leve o paralelo do ponto até a escala de latitudes (borda lateral) e leia graus, minutos e décimos.', 'Leve o meridiano do ponto até a escala de longitudes (borda de baixo) e leia.', 'Atenção: no Hemisfério Sul a latitude cresce para baixo na carta (para o Sul); a longitude W cresce para a esquerda (para o Oeste).'],
                  sol: [{ tipo: 'ponto', p: Pr, estilo: 'certo', rot: fmtPos(Pr) }],
                  ref: 'Manual de Navegação da MB, Vol. I, Apêndice A ao Cap. 2, problema B.',
                };
              },
            };
          },
          'plotar': function () {
            var P = pontoAgua(1, 0), Pr = { lat: Math.round(P.lat * 600) / 600, lon: Math.round(P.lon * 600) / 600 };
            return {
              enunciado: 'Plote o ponto <b>' + fmtPos(Pr) + '</b>: toque na carta onde ele fica (use o zoom para precisão).',
              toque: true, centro: null,
              corrigir: function (r, soSol) {
                if (!est.resposta && !soSol) return { semResposta: true };
                var e = est.resposta ? rumoDist(est.resposta, Pr).dist : 0;
                return {
                  ok: e <= 0.2, res: 'O ponto correto está marcado com o círculo.', erros: ['sua marca ficou a ' + fmtDist(e) + ' do ponto (tolerância 0,2 M)'],
                  passos: ['Na escala de latitudes, ache ' + fmtCoord(Pr.lat, 'lat') + ' e trace o paralelo com a régua.', 'Na escala de longitudes, ache ' + fmtCoord(Pr.lon, 'lon') + ' e leve a distância até o paralelo com o compasso.', 'O cruzamento é o ponto.'],
                  sol: [{ tipo: 'ponto', p: Pr, estilo: 'certo', rot: fmtPos(Pr) }],
                  ref: 'Manual de Navegação da MB, Vol. I, Apêndice A ao Cap. 2, problema A.',
                };
              },
            };
          },
          'marcacoes': function () {
            var n = Math.random() < 0.5 ? 2 : 3, mag = Math.random() < 0.4, P, objs, mvs, achou = false;
            function angulosBons(lista, nn) {
              for (var a = 0; a < nn; a++) for (var b = a + 1; b < nn; b++) { var d = Math.abs(difAng(lista[a], lista[b])); if (d > 90) d = 180 - d; if (d < (nn === 2 ? 40 : 30)) return false; }
              return true;
            }
            for (var t = 0; t < 900 && !achou; t++) {
              if (t === 450 && n === 3) n = 2;   // poucas combinações de três: cai para duas marcações
              P = pontoAgua(6, 0.6);
              var vis2 = notaveis().filter(function (f) { var d = rumoDist(P, f).dist; return d > 1 && d < 10 && visivel(P, f); });
              if (vis2.length < n) continue;
              for (var tt = 0; tt < 6 && !achou; tt++) {
                objs = VL.embaralhar(vis2).slice(0, n);
                mvs = objs.map(function (f) { return rumoDist(P, f).rumo; });
                achou = angulosBons(mvs, n);
              }
            }
            if (!achou) {   // garantia: posição fixa conhecida, ao largo da enseada
              n = 2; P = deG(12.0, 9.0);
              objs = [FEICOES[0], FEICOES[1]]; mvs = objs.map(function (f) { return rumoDist(P, f).rumo; });
            }
            var obs = mvs.map(function (m) { return Math.round(n === 3 ? m + aleat(-1.2, 1.2) : m); }).map(norm360);
            var dec = decNoAno(est.ano), hora = 600 + Math.floor(Math.random() * 600);
            // marcações magnéticas: o aluno converte com valores a meio grau (Manual, 3.2.5); a solução usa o mesmo cálculo
            if (mag) obs = obs.map(function (o) { return norm360(Math.round((o - dec) * 2) / 2 + Math.round(dec * 2) / 2); });
            var ldps = objs.map(function (f, i) { return { tipo: 'ldp', obj: { lat: f.lat, lon: f.lon }, mv: obs[i], hora: fmtHora(hora) }; });
            var resp;
            if (n === 2) resp = intersecao(ldps[0], ldps[1]);
            else { var a1 = intersecao(ldps[0], ldps[1]), a2 = intersecao(ldps[1], ldps[2]), a3 = intersecao(ldps[0], ldps[2]); resp = { lat: (a1.lat + a2.lat + a3.lat) / 3, lon: (a1.lon + a2.lon + a3.lon) / 3 }; }
            var lista = objs.map(function (f, i) {
              var v = mag ? norm360(obs[i] - dec) : obs[i];
              return '<li>' + VL.esc(f.nome) + ': ' + (mag ? 'Mmg ' : 'Mv ') + fmtRumo(Math.round(v * 2) / 2) + '</li>';
            }).join('');
            return {
              enunciado: 'Às ' + fmtHora(hora) + ' de ' + est.ano + ', um veleiro marcou, quase ao mesmo tempo:<ul class="cn-lista">' + lista + '</ul>' + (mag ? 'As marcações são <b>magnéticas</b>: converta usando a declinação da rosa, atualizada para ' + est.ano + '. ' : '') + 'Trace as LDP (ferramenta Marcação) e toque na carta na posição do barco.',
              toque: true, centro: resp,
              corrigir: function (r, soSol) {
                if (!est.resposta && !soSol) return { semResposta: true };
                var e = est.resposta ? rumoDist(est.resposta, resp).dist : 0;
                var passos = [];
                if (mag) passos.push('Declinação em ' + est.ano + ': ' + DEC.graus + '°' + String(DEC.min).padStart(2, '0') + "'" + DEC.lado + ' (' + DEC.ano + ') + ' + (est.ano - DEC.ano) + ' × ' + DEC.varMin + "'" + DEC.varLado + ' = ' + fmtGM(dec) + ' (arredonde a meio grau: ' + num(Math.round(Math.abs(dec) * 2) / 2, 1) + '° ' + (dec < 0 ? 'W' : 'E') + '). Mv = Mmg ± Dec mg; do magnético para o verdadeiro, W subtrai e E soma: ' + objs.map(function (f, i) { return fmtRumo(Math.round(norm360(obs[i] - dec) * 2) / 2) + (dec < 0 ? ' − ' : ' + ') + num(Math.round(Math.abs(dec) * 2) / 2, 1) + '° = ' + fmtRumo(Math.round(norm360(obs[i] - dec) * 2) / 2 + Math.round(dec * 2) / 2); }).join('; ') + '.');
                passos.push('Trace cada LDP a partir do objeto, no sentido oposto ao da marcação (o barco está "do outro lado" da linha). Escreva a hora e a marcação sobre a linha.');
                passos.push(n === 2 ? 'O cruzamento das duas LDP é a posição: ' + fmtPos(resp) + '.' : 'As três LDP formam um pequeno triângulo de incerteza; adote o centro: ' + fmtPos(resp) + '. Se estivesse perto de um perigo, você adotaria o vértice mais próximo dele.');
                return {
                  ok: e <= 0.2, res: 'A posição é ' + fmtPos(resp) + '.', erros: ['sua marca ficou a ' + fmtDist(e) + ' da posição (tolerância 0,2 M)'],
                  passos: passos, sol: ldps.concat([{ tipo: 'ponto', p: resp, estilo: 'certo', rot: fmtHora(hora) }]),
                  ref: 'Manual de Navegação da MB, Vol. I, itens 3.2.5 (conversão de marcações), 4.3 e 4.5.4 (triângulo de incerteza).',
                };
              },
            };
          },
          'estima': function () {
            var P0, rv, vv, tmin, P1;
            for (var t = 0; t < 200; t++) {
              P0 = pontoAgua(8, 0.5); rv = Math.round(aleat(0, 359)); vv = escolha([4, 4.5, 5, 5.5, 6, 6.5, 7, 8]); tmin = escolha([30, 40, 45, 50, 60, 75, 80, 90]);
              P1 = destino(P0, rv, vv * tmin / 60);
              var g1p = paraG(P1.lat, P1.lon);
              if (g1p.gx > 1 && g1p.gx < GX - 1 && g1p.gy > 1 && g1p.gy < GY - 1 && campo(g1p.gx, g1p.gy) > 3 && trajetoLimpa(P0, P1, 0)) break;
            }
            var h0 = 700 + Math.floor(Math.random() * 500), d = vv * tmin / 60;
            return {
              enunciado: 'Às ' + fmtHora(h0) + ' o barco estava no ponto <b>O</b> (' + fmtPos(P0) + '), governando no rumo verdadeiro ' + fmtRumoInt(rv) + ' a ' + num(vv, 1) + ' nós. Desconsidere a corrente. Toque na carta na posição estimada das ' + fmtHora(h0 + tmin) + '.',
              toque: true, mostrar: [{ tipo: 'ponto', p: P0, estilo: 'obs', rot: 'O ' + fmtHora(h0) }], pontos: [P0], centro: P0,
              corrigir: function (r, soSol) {
                if (!est.resposta && !soSol) return { semResposta: true };
                var e = est.resposta ? rumoDist(est.resposta, P1).dist : 0;
                return {
                  ok: e <= 0.2, res: 'A posição estimada das ' + fmtHora(h0 + tmin) + ' é ' + fmtPos(P1) + '.', erros: ['sua marca ficou a ' + fmtDist(e) + ' (tolerância 0,2 M)'],
                  passos: ['Tempo navegado: ' + tmin + ' min = ' + num(tmin / 60, 2) + ' h.', 'Distância: d = v × t = ' + num(vv, 1) + ' × ' + num(tmin / 60, 2) + ' = ' + fmtDist(d) + '.', 'Do ponto O, trace o rumo ' + fmtRumoInt(rv) + ' com a régua paralela e marque ' + fmtDist(d) + ' com o compasso (escala de latitudes).'],
                  sol: [{ tipo: 'vetor', a: P0, b: P1, v: 'sup', rot: 'R ' + fmtRumoInt(rv).replace('°', '') }, { tipo: 'ponto', p: P1, estilo: 'est', rot: fmtHora(h0 + tmin) }],
                  ref: 'Manual de Navegação da MB, Vol. I, itens 5.1 a 5.3 (regras da navegação estimada).',
                };
              },
            };
          },
          'corrente': function () {
            var A, B, rd, velN, Rc, Vc, s;
            for (var t = 0; t < 200; t++) {
              A = pontoAgua(8, 0.6); B = escolha(FEICOES.filter(function (f) { return f.tipo.indexOf('boia') === 0 || f.tipo === 'cardinal-w' || f.tipo === 'perigo-isolado'; }));
              rd = rumoDist(A, B); if (rd.dist < 2 || rd.dist > 9 || !trajetoLimpa(A, B)) continue;
              velN = escolha([5, 5.5, 6, 6.5, 7]); Rc = Math.round(aleat(0, 359) / 5) * 5; Vc = escolha([0.8, 1, 1.2, 1.5, 1.8, 2]);
              var dang = Math.abs(difAng(Rc, rd.rumo)); if (dang < 40 || dang > 140) continue;
              s = calcGovernar(rd.rumo, velN, Rc, Vc); if (s) break;
              s = null;
            }
            if (!s) {   // garantia: ao largo, rumo norte até a boia de águas seguras da Barra
              A = deG(12.3, 7.4); B = FEICOES.filter(function (f) { return f.id === 'b-as'; })[0];
              rd = rumoDist(A, B); velN = 6; Rc = 90; Vc = 1.2; s = calcGovernar(rd.rumo, velN, Rc, Vc);
            }
            return {
              enunciado: 'Do ponto <b>A</b> você quer ir até a <b>' + VL.esc(nomeBoia(B)) + '</b>. Velocidade do barco na superfície: ' + nos(velN) + '. Corrente estimada: Rcor ' + fmtRumoInt(Rc) + ', velcor ' + nos(Vc) + '. Qual o rumo na superfície (RN) a governar e a velocidade no fundo?',
              campos: [['rn', 'RN a governar', '°'], ['vfd', 'Velocidade no fundo', 'nós']],
              mostrar: [{ tipo: 'ponto', p: A, estilo: 'obs', rot: 'A' }], pontos: [A, B], centro: { lat: (A.lat + B.lat) / 2, lon: (A.lon + B.lon) / 2 },
              corrigir: function (r) {
                var e1 = Math.abs(difAng(r.rn, s.rn)), e2 = Math.abs(r.vfd - s.velfd);
                var sol = resolverGovernar(A, B.id, velN, Rc, Vc, 0);
                return {
                  ok: e1 <= 2 && e2 <= 0.2, res: 'RN = ' + fmtRumo(s.rn) + ' e velocidade no fundo = ' + nos(s.velfd) + '.',
                  erros: [e1 <= 2 ? 'RN dentro da tolerância de 2°' : 'RN com erro de ' + Math.round(e1) + '° (tolerância 2°)', e2 <= 0.2 ? 'velocidade no fundo dentro da tolerância' : 'velocidade no fundo com erro de ' + nos(e2) + ' (tolerância 0,2 nó)'],
                  html: sol.html, sol: sol.objs,
                  ref: '',
                };
              },
            };
          },
          'sucessivas': function () {
            var f, rv, dt, alfa, lado, P1, P2, d12, PT, ok = false;
            for (var t = 0; t < 300 && !ok; t++) {
              f = escolha(notaveis().filter(function (x) { return x.tipo === 'farol' || x.tipo === 'antena' || x.tipo === 'notavel'; }));
              alfa = escolha([22.5, 30, 45]); lado = Math.random() < 0.5 ? 1 : -1; rv = Math.round(aleat(0, 359)); dt = aleat(1.4, 3.5);
              // ponto pelo través: objeto a dt milhas, perpendicular ao rumo
              PT = destino(f, norm360(rv + 180 + lado * 90 * -1), dt);
              // Mp = ângulo entre a proa e o objeto. distância ao través x = dt / tan(Mp)
              var x1 = dt / Math.tan(alfa * RAD), x2 = dt / Math.tan(2 * alfa * RAD);
              P1 = destino(PT, norm360(rv + 180), x1); P2 = Math.abs(x2) < 1e-6 ? PT : destino(PT, norm360(rv + 180), x2);
              d12 = x1 - x2;
              var pr = [P1, P2, destino(P1, norm360(rv + 180), 1.5)];
              ok = pr.every(function (p) { var g = paraG(p.lat, p.lon); return g.gx > 0.8 && g.gx < GX - 0.8 && g.gy > 0.8 && g.gy < GY - 0.8 && campo(g.gx, g.gy) > 4; }) && visivel(P1, f) && visivel(P2, f);
              // a trajetória entre P1 e P2 deve ficar no mar
              if (ok) for (var k = 1; k < 10; k++) { var q = destino(P1, rv, d12 * k / 10), gq = paraG(q.lat, q.lon); if (campo(gq.gx, gq.gy) < 3) { ok = false; break; } }
            }
            var mv1 = rumoDist(P1, f).rumo, mv2 = rumoDist(P2, f).rumo;
            var bordo = difAng(mv1, rv) >= 0 ? 'BE' : 'BB';
            var vel = escolha([5, 6, 7, 8]), tmin = Math.round(d12 / vel * 60), od1 = Math.round(aleat(100, 900) * 10) / 10, od2 = od1 + Math.round(d12 * 10) / 10;
            var h1 = 800 + Math.floor(Math.random() * 400);
            var aTxt = num(alfa, alfa % 1 ? 1 : 0), a2Txt = num(2 * alfa, 0);   // 22,5° com vírgula
            return {
              enunciado: 'Navegando no rumo verdadeiro ' + fmtRumoInt(rv) + ', às ' + fmtHora(h1) + ' (odômetro ' + num(od1, 1) + ') você marca ' + (f.art || 'o') + ' <b>' + VL.esc(f.nome) + '</b> a ' + aTxt + '° por ' + bordo + ' (marcação polar). Às ' + fmtHora(h1 + tmin) + ' (odômetro ' + num(od2, 1) + ') a marcação polar dobra: ' + a2Txt + '° por ' + bordo + '. Toque na carta na posição das ' + fmtHora(h1 + tmin) + '.',
              toque: true, centro: P2,
              corrigir: function (r, soSol) {
                if (!est.resposta && !soSol) return { semResposta: true };
                var dd = Math.round(d12 * 10) / 10, Pc = destino(f, norm360(mv2 + 180), dd), e = est.resposta ? rumoDist(est.resposta, Pc).dist : 0;
                return {
                  ok: e <= 0.2, res: 'A posição das ' + fmtHora(h1 + tmin) + ' é ' + fmtPos(Pc) + '.', erros: ['sua marca ficou a ' + fmtDist(e) + ' (tolerância 0,2 M)'],
                  passos: [
                    'Marcação verdadeira no segundo instante: Mv = Rv ' + (bordo === 'BE' ? '+' : '−') + ' ' + a2Txt + '° = ' + fmtRumo(mv2) + '.',
                    'Quando a marcação polar dobra, o triângulo formado pelas duas posições e pelo objeto é isósceles: a distância ao objeto na 2ª marcação é igual à distância navegada.',
                    'Distância navegada = diferença de odômetro = ' + num(od2, 1) + ' − ' + num(od1, 1) + ' = ' + fmtDist(dd) + '.',
                    'Trace a LDP do objeto para o lado oposto à marcação de ' + fmtRumo(mv2) + ' (rumo ' + fmtRumo(mv2 + 180) + ' a partir do objeto) e marque ' + fmtDist(dd) + ' com o compasso.' + (alfa === 45 ? ' Com 45° e 90° (través), essa também é a distância pelo través.' : ''),
                  ],
                  sol: [{ tipo: 'ldp', obj: { lat: f.lat, lon: f.lon }, mv: mv2, hora: fmtHora(h1 + tmin), comp: 6 }, { tipo: 'arco', c: { lat: f.lat, lon: f.lon }, r: dd }, { tipo: 'vetor', a: P1, b: Pc, v: 'sup', rot: 'R ' + fmtRumoInt(rv).replace('°', '') }, { tipo: 'ponto', p: Pc, estilo: 'certo', rot: fmtHora(h1 + tmin) }],
                  ref: 'Manual de Navegação da MB, Vol. I, item 6.3.4 (marcações duplas: 22,5° e 45°, 30° e 60°, 45° e 90°).',
                };
              },
            };
          },
        };

        var exSel = h('select', { 'aria-label': 'Tipo de exercício', onchange: function () { novoExercicio(exSel.value); } });
        TIPOS_EX.forEach(function (t) { exSel.appendChild(h('option', { value: t[0] }, t[1])); });
        function novoExercicio(tipo) {
          if (!gerar[tipo]) tipo = 'rumo-dist';
          exSel.value = tipo;
          est.ex = gerar[tipo](); est.ex.tipo = tipo; est.ex.aguardaToque = !!est.ex.toque;
          est.solucao = []; est.resposta = null; est.desenhos = est.desenhos.filter(function () { return false; });
          if (est.ex.toque && est.ferramenta !== 'marcacao') definirFerramenta(tipo === 'marcacoes' ? 'marcacao' : 'mover');
          if (tipo === 'marcacoes') definirFerramenta('marcacao');
          if (est.ex.centro) centrarEm(est.ex.centro, vis.fit * (est.ex.zoom || 1.4)); else ajustar();
          renderEx();
        }
        var exFeedback, exInputs = {};
        function renderEx() {
          var ex = est.ex; painelEx.innerHTML = '';
          if (!ex) return;
          painelEx.appendChild(h('div', { class: 'cn-ex-topo' }, h('label', { class: 'cn-campo cn-campo-largo' }, h('span', null, 'Exercício'), exSel),
            h('span', { class: 'cn-placar', 'aria-live': 'polite' }, 'Acertos: ' + est.acertos + ' de ' + est.tentativas)));
          painelEx.appendChild(h('div', { class: 'cn-enunciado', html: ex.enunciado }));
          exInputs = {};
          if (ex.campos) {
            var linha = h('div', { class: 'cn-linha-campos' });
            ex.campos.forEach(function (c) { var cn = campoNum(c[1], { 'aria-label': c[1], value: c[3] || '', size: 4 }, c[2]); exInputs[c[0]] = cn.inp; linha.appendChild(cn.el); });
            painelEx.appendChild(linha);
          }
          if (ex.toque) painelEx.appendChild(h('p', { class: 'cn-dica-txt cn-resp-status' }, est.resposta ? 'Sua resposta: ' + fmtPos(est.resposta) + '. Toque de novo para mudar.' : (est.ferramenta === 'mover' ? 'Toque na carta para marcar sua resposta.' : 'Depois de traçar, volte à ferramenta Mover e toque na carta para marcar sua resposta.')));
          exFeedback = h('div', { class: 'cn-feedback', 'aria-live': 'polite' });
          painelEx.appendChild(h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn btn-primary', onclick: corrigirEx }, 'Corrigir'),
            h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { mostrarSolucao(true); } }, 'Ver solução'),
            h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { novoExercicio(est.ex.tipo); } }, 'Novo problema')));
          painelEx.appendChild(exFeedback);
        }
        function exAtualizarResposta() { var s = VL.$('.cn-resp-status', painelEx); if (s) s.textContent = 'Sua resposta: ' + fmtPos(est.resposta) + '. Toque de novo para mudar.'; }
        function lerResposta() {
          var r = {}, falta = false;
          Object.keys(exInputs).forEach(function (k) { r[k] = lerNum(exInputs[k].value); if (isNaN(r[k])) falta = true; });
          return falta ? null : r;
        }
        var corrigido = false;
        function corrigirEx() {
          var ex = est.ex; if (!ex) return;
          var r = ex.campos ? lerResposta() : {};
          if (ex.campos && !r) { exFeedback.innerHTML = '<p class="cn-msg">Preencha todos os campos.</p>'; return; }
          var c = ex.corrigir(r);
          if (c.semResposta) { exFeedback.innerHTML = '<p class="cn-msg">Toque na carta (ferramenta Mover) para marcar sua resposta.</p>'; return; }
          if (!ex.contado) { est.tentativas++; if (c.ok) est.acertos++; ex.contado = true; }
          mostrarCorrecao(c);
          var pl = VL.$('.cn-placar', painelEx); if (pl) pl.textContent = 'Acertos: ' + est.acertos + ' de ' + est.tentativas;
        }
        function mostrarSolucao() {
          var ex = est.ex; if (!ex) return;
          var resp = ex.campos ? lerResposta() : null, c = ex.corrigir(ex.campos ? (resp || fakeResp(ex)) : {}, true);
          // sem resposta digitada, a resposta "0" de mentira não pode virar "você leu a recíproca"
          if (ex.campos && !resp && c && c.res) c.res = c.res.replace(/\s*Você leu a recíproca[^.]*\./, '');
          mostrarCorrecao(c, true);
        }
        function fakeResp(ex) { var r = {}; ex.campos.forEach(function (c) { r[c[0]] = 0; }); return r; }
        function mostrarCorrecao(c, soSol) {
          if (c.semResposta) {  // ver solução sem ter respondido: mostra o desenho
            c = { ok: false, res: '', erros: [], passos: [], sol: [] };
          }
          var html = '';
          if (!soSol) html += '<p class="cn-res" data-ok="' + (c.ok ? 1 : 0) + '">' + (c.ok ? 'Certo!' : 'Ainda não.') + ' ' + VL.esc(c.res) + '</p>' + (c.erros && c.erros.length ? '<p class="cn-erros">' + c.erros.map(VL.esc).join('; ') + '.</p>' : '');
          else html += '<p class="cn-res">Solução: ' + VL.esc(c.res) + '</p>';
          if (c.html) html += c.html;
          else if (c.passos && c.passos.length) html += '<ol class="cn-passos">' + c.passos.map(function (p) { return '<li>' + VL.esc(p) + '</li>'; }).join('') + '</ol>';
          if (c.ref) html += '<p class="cn-ref">' + VL.esc(c.ref) + '</p>';
          exFeedback.innerHTML = html;
          est.solucao = c.sol || [];
          render();
        }

        /* ---------------- legenda ---------------- */
        function legendaCarta() {
          var d = h('details', { class: 'cn-legenda' });
          d.appendChild(h('summary', null, 'Legenda e fontes'));
          var itens = [
            ['farol', 'Farol: ponto preto + luz (gota magenta). Ex.: Lp(2) 10s 48m 17M'],
            ['boia-be', 'Boia lateral de boreste (IALA B): encarnada, cônica, número ímpar'],
            ['boia-bb', 'Boia lateral de bombordo (IALA B): verde, cilíndrica, número par'],
            ['boia-as', 'Águas seguras: listras encarnadas e brancas, esfera'],
            ['cardinal-w', 'Cardinal Oeste: passe a oeste dela'],
            ['perigo-isolado', 'Perigo isolado: duas esferas pretas'],
            ['rocha-cd', 'Rocha que cobre e descobre'],
            ['rocha-sub', 'Rocha submersa perigosa'],
            ['casco', 'Casco soçobrado com profundidade mínima'],
          ];
          var ul = h('ul', { class: 'cn-leg-lista' });
          itens.forEach(function (it) {
            var sv = S('svg', { width: 44, height: 34, viewBox: '-22 -24 44 34', class: 'cn-leg-svg', 'aria-hidden': 'true' });
            var f = { tipo: it[0], id: 'leg' }; var g = simboloFeicao(f); VL.$$('text', g).forEach(function (t) { if (!t.classList.contains('cn-wk')) t.remove(); }); sv.appendChild(g);
            ul.appendChild(h('li', null, sv, h('span', null, it[1])));
          });
          d.appendChild(ul);
          d.appendChild(h('p', null, 'Sondagens em metros, em itálico; o número pequeno é o decímetro (8', h('sub', null, '5'), ' = 8,5 m). As isóbatas de 2, 5, 10, 20 e 50 m separam as tintas de azul: mais escuro = mais raso. Luz sem letra de cor é branca. Rosa: anel externo verdadeiro, anel interno magnético, com a declinação e a variação anual escritas no eixo do norte magnético.'));
          d.appendChild(h('p', null, 'Símbolos de plotagem deste simulador: círculo = posição observada; semicírculo = estimada; losango = estimada corrigida (EC, conforme o Manual de Navegação da MB, item 5.7).'));
          d.appendChild(h('p', { class: 'cn-ref' }, 'Fontes: Carta 12000 (INT 1) — Símbolos, abreviaturas e termos usados nas cartas náuticas brasileiras, DHN, 5ª ed. 2022; Manual de Navegação da Marinha do Brasil, Vol. I, DHN, 2ª revisão 2023. Desenho simplificado: em caso de dúvida, vale a Carta 12000. ',
            h('a', { href: 'https://www.marinha.mil.br/chm/node/90119', target: '_blank', rel: 'noopener' }, 'Carta 12000 no CHM'), ' · ',
            h('a', { href: 'https://www.marinha.mil.br/dhn/npublicacoes', target: '_blank', rel: 'noopener' }, 'Manual de Navegação (DHN)')));
          return d;
        }

        /* ---------------- inicialização ---------------- */
        atualizarDecInfo();
        var ro = new ResizeObserver(function () { marcarFimBarra(); var antes = vis.fit; if (medir()) { if (!antes || Math.abs(vis.k - antes) < 1e-6 || vis.k < vis.fit) ajustar(); else render(); } });
        ro.observe(corpo);
        medir(); ajustar(true);
        definirFerramenta(est.ferramenta);
        painelEx.hidden = true;
        if (est.modo === 'exercicio') definirModo('exercicio');
        var offTema = VL.on('tema', function () { render(); });
        var offSet = VL.on('settings', function () { atualizarPainel(); });

        return function () {
          vivo = false;
          ro.disconnect(); offTema(); offSet();
          if (rafId) cancelAnimationFrame(rafId);
          limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
        };
      }
    },
  });
})();
