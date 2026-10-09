/* Widget "derrota-calc": calculadora passo a passo de derrotas (ortodrômica, loxodrômica,
   navegação estimada pela latitude média, conversões) com exercícios corrigidos.

   Este arquivo também publica VL.derrota — a matemática de derrotas e as travessias prontas —
   reutilizada pelo widget "globo-rotas" (que o carrega via scripts: ['widgets/derrota-calc.js']).

   opts (todas opcionais):
     aba:       'derrotas'   aba inicial: 'derrotas' | 'estima' | 'conversoes' | 'exercicios'
     abas:      null         lista das abas visíveis, ex.: ['derrotas', 'exercicios'] (padrão: todas)
     preset:    'rio-cabo'   travessia de VL.derrota.presets usada na aba Derrotas (a maior perna dela):
                             salvador-mindelo, recife-noronha, natal-mindelo, arc, mindelo-granada, rio-cabo,
                             cabo-rio, retorno, salvador-caribe, didatico-tasmania
     modelo:    'esfera'     latitudes crescidas: 'esfera' | 'elipsoide' (WGS-84, como nas tábuas)
     vel:       6            velocidade média em nós para os tempos de viagem
     passo:     10           intervalo dos pontos intermediários da ortodrômica: 5 | 10 (graus de longitude)
     exercicio: 'mix'        tipo inicial na aba Exercícios: 'orto' | 'lox' | 'estima' | 'conv' | 'tempo' | 'mix'
     titulo:    'Calculadora de derrotas'

   Exemplos de bloco de lição:
     { t: 'widget', w: 'derrota-calc', opts: { preset: 'arc' } }
     { t: 'widget', w: 'derrota-calc', opts: { aba: 'estima', abas: ['estima', 'exercicios'], exercicio: 'estima' } }

   Modelo: Terra esférica, 1 minuto de arco de círculo máximo = 1 milha náutica (1.852 m), como nas
   tábuas e nas provas. Latitudes crescidas: esfera (padrão) ou elipsoide WGS-84 (como nas tábuas).
   Referências: Bowditch, The American Practical Navigator (NGA Pub. 9), capítulo "The Sailings";
   Miguens, Navegação: a Ciência e a Arte, vol. II (DHN). */
(function () {
  'use strict';
  var VL = window.VL = window.VL || {};

  /* =====================================================================================
     1. Matemática de derrotas (pura, sem DOM) — VL.derrota
     ===================================================================================== */
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  var MIN_RAD = 10800 / Math.PI;               // minutos de arco por radiano (3437,7468)
  var E_WGS = Math.sqrt(0.00669437999014);     // excentricidade do elipsoide WGS-84
  var EPS = 1e-12;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function norm180(x) { var y = ((x + 180) % 360 + 360) % 360 - 180; return (y === -180 && x > 0) ? 180 : y; }
  function norm360(x) { var y = x % 360; if (y < 0) y += 360; if (y >= 359.9999999995) y = 0; return y; }
  function atanh(x) { return 0.5 * Math.log((1 + x) / (1 - x)); }

  function v3(p) { var f = p.lat * D2R, l = p.lon * D2R; return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function unit(a) { var l = len(a); return l < EPS ? [0, 0, 0] : [a[0] / l, a[1] / l, a[2] / l]; }
  function ang(a, b) { return Math.atan2(len(cross(a, b)), dot(a, b)); }
  function ll(v) { var u = unit(v); return { lat: Math.asin(clamp(u[2], -1, 1)) * R2D, lon: Math.atan2(u[1], u[0]) * R2D }; }

  /** Rumo inicial (0–360°) do círculo máximo de a para b. */
  function rumoEntre(a, b) {
    var f1 = a.lat * D2R, f2 = b.lat * D2R, dl = norm180(b.lon - a.lon) * D2R;
    var y = Math.sin(dl) * Math.cos(f2);
    var x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
    return norm360(Math.atan2(y, x) * R2D);
  }

  /** Distância em milhas (círculo máximo) entre dois pontos. */
  function milhasEntre(a, b) { return ang(v3(a), v3(b)) * MIN_RAD; }

  /** Ponto na ortodrômica a uma fração f (0–1) da distância. */
  function pontoOrto(a, b, f) {
    var va = v3(a), vb = v3(b), d = ang(va, vb);
    if (d < EPS) return { lat: a.lat, lon: a.lon };
    var s = Math.sin(d), k1 = Math.sin((1 - f) * d) / s, k2 = Math.sin(f * d) / s;
    return ll([k1 * va[0] + k2 * vb[0], k1 * va[1] + k2 * vb[1], k1 * va[2] + k2 * vb[2]]);
  }

  /** Erros de entrada comuns às duas derrotas. Devolve texto ou null. */
  function validarPar(a, b) {
    if (!a || !b || !isFinite(a.lat) || !isFinite(a.lon) || !isFinite(b.lat) || !isFinite(b.lon)) return 'Preencha as coordenadas dos dois pontos.';
    if (Math.abs(a.lat) > 90 || Math.abs(b.lat) > 90) return 'A latitude vai de 0° a 90° (N ou S).';
    if (Math.abs(a.lon) > 180 || Math.abs(b.lon) > 180) return 'A longitude vai de 0° a 180° (E ou W).';
    if (Math.abs(a.lat) > 89.5 || Math.abs(b.lat) > 89.5) return 'Pontos muito perto do polo: a loxodrômica não é definida ali. Use latitudes menores que 89,5°.';
    if (milhasEntre(a, b) < 0.05) return 'Os dois pontos são iguais (ou quase): não há derrota a calcular.';
    return null;
  }

  /**
   * Ortodrômica (círculo máximo) de a para b.
   * Devolve distância, rumos, termos da fórmula (para o passo a passo) e o vértice.
   */
  function ortodromica(a, b) {
    var f1 = a.lat * D2R, f2 = b.lat * D2R;
    var dlDeg = norm180(b.lon - a.lon), dl = dlDeg * D2R;
    var s1 = Math.sin(f1), s2 = Math.sin(f2), c1 = Math.cos(f1), c2 = Math.cos(f2), cdl = Math.cos(dl);
    var cosd = s1 * s2 + c1 * c2 * cdl;
    var va = v3(a), vb = v3(b);
    var dRad = ang(va, vb);
    var nRaw = cross(va, vb);
    var antipodas = len(nRaw) < 1e-9 && dot(va, vb) < 0;
    var ri = rumoEntre(a, b);
    var rf = norm360(rumoEntre(b, a) + 180);
    var r = {
      dlon: dlDeg, cosd: cosd, termo1: s1 * s2, termo2: c1 * c2 * cdl,
      dGraus: dRad * R2D, milhas: dRad * MIN_RAD,
      rumoInicial: ri, rumoFinal: rf, antipodas: antipodas,
      tgNum: Math.sin(dl), tgDen: c1 * Math.tan(f2) - s1 * cdl,
      vertice: null, verticeRumo: null,
    };
    if (antipodas) return r;
    var n = unit(nRaw);
    var nz = n[2];
    if (Math.abs(nz) > 1 - 1e-12) { r.equador = true; return r; } // derrota sobre o Equador: sem vértice
    var vN = unit([-nz * n[0], -nz * n[1], 1 - nz * nz]);
    var u = cross(n, va); // direção de partida, no plano do círculo máximo
    var cands = [vN, [-vN[0], -vN[1], -vN[2]]].map(function (v) {
      var th = Math.atan2(dot(v, u), dot(v, va));
      if (th < 0) th += 2 * Math.PI;
      var naDerrota = th <= dRad + 1e-9;
      var dist = naDerrota ? 0 : Math.min(th - dRad, 2 * Math.PI - th);
      var pos = naDerrota ? 'na' : (th - dRad < 2 * Math.PI - th ? 'depois' : 'antes');
      var p = ll(v);
      return { lat: p.lat, lon: p.lon, naDerrota: naDerrota, posicao: pos, distSegmento: dist * MIN_RAD, milhasDaPartida: th * MIN_RAD };
    });
    // vértice "da derrota": o que está entre os pontos; senão, o mais próximo do trecho
    r.vertice = cands[0].naDerrota ? cands[0] : cands[1].naDerrota ? cands[1] : (cands[0].distSegmento <= cands[1].distSegmento ? cands[0] : cands[1]);
    // vértice para onde aponta o rumo inicial (o das fórmulas clássicas cos φv = cos φ1 · sen Ri)
    var rumoNorte = Math.cos(ri * D2R) >= 0;
    r.verticeRumo = rumoNorte ? cands[0] : cands[1];
    r.verticeRumo.dlon = norm180(r.verticeRumo.lon - a.lon);
    return r;
  }

  /** Pontos da ortodrômica nas longitudes múltiplas de "passo" (fórmula tg φ = tg φv · cos(λ − λv)). */
  function pontosIntermediarios(a, b, passo) {
    var o = ortodromica(a, b);
    if (!o.vertice || o.antipodas) return null;
    var v = o.vertice, dl = o.dlon;
    if (Math.abs(90 - Math.abs(v.lat)) < 1e-6) return null; // derrota por um meridiano
    var lista = [{ lat: a.lat, lon: a.lon, extremo: 'partida' }];
    var sentido = dl >= 0 ? 1 : -1;
    var primeiro = sentido > 0 ? Math.floor(a.lon / passo) * passo + passo : Math.ceil(a.lon / passo) * passo - passo;
    var tgv = Math.tan(v.lat * D2R);
    for (var k = 0; k < 400; k++) {
      var lon = primeiro + sentido * k * passo;
      var desl = norm180(lon - a.lon) * sentido;
      if (desl >= Math.abs(dl) - 1e-9 || desl <= 0) { if (desl <= 0 && k === 0) continue; break; }
      var lat = Math.atan(tgv * Math.cos(norm180(lon - v.lon) * D2R)) * R2D;
      lista.push({ lat: lat, lon: norm180(lon) });
    }
    lista.push({ lat: b.lat, lon: b.lon, extremo: 'chegada' });
    var total = 0;
    for (var i = 0; i < lista.length - 1; i++) {
      var lx = loxodromica(lista[i], lista[i + 1], 'esfera');
      lista[i].rumoProx = lx.rumo; lista[i].distProx = lx.milhas; total += lx.milhas;
    }
    return { pontos: lista, somaLox: total, orto: o.milhas };
  }

  /** Latitude crescida, em minutos. modelo: 'esfera' | 'elipsoide' (WGS-84). */
  function latCrescida(lat, modelo) {
    var s = Math.sin(lat * D2R);
    if (modelo === 'elipsoide') return MIN_RAD * (atanh(s) - E_WGS * atanh(E_WGS * s));
    return MIN_RAD * atanh(s);
  }

  /** Loxodrômica (rumo constante) de a para b. */
  function loxodromica(a, b, modelo) {
    var dlat = (b.lat - a.lat) * 60;
    var dlon = norm180(b.lon - a.lon) * 60;
    var mc1 = latCrescida(a.lat, modelo), mc2 = latCrescida(b.lat, modelo);
    var dmc = mc2 - mc1;
    var r = { dlat: dlat, dlon: dlon, mc1: mc1, mc2: mc2, dmc: dmc, modelo: modelo || 'esfera' };
    if (Math.abs(dlat) < 1e-7) {
      r.paralelo = true;
      r.rumo = dlon >= 0 ? 90 : 270;
      r.q = Math.cos(a.lat * D2R);
      r.milhas = Math.abs(dlon) * r.q;
    } else {
      r.rumo = norm360(Math.atan2(dlon, dmc) * R2D);
      r.q = dlat / dmc;
      r.milhas = Math.sqrt(dlat * dlat + r.q * r.q * dlon * dlon);
      r.cosR = Math.cos(r.rumo * D2R);
    }
    return r;
  }

  /** Ponto na loxodrômica a uma fração f da distância (esfera). */
  function pontoLox(a, b, f) {
    var dlat = b.lat - a.lat, dlon = norm180(b.lon - a.lon);
    var lat = a.lat + f * dlat;
    if (Math.abs(dlat) < 1e-9) return { lat: lat, lon: norm180(a.lon + f * dlon) };
    var p1 = atanh(Math.sin(a.lat * D2R)), p2 = atanh(Math.sin(b.lat * D2R)), p = atanh(Math.sin(lat * D2R));
    return { lat: lat, lon: norm180(a.lon + dlon * (p - p1) / (p2 - p1)) };
  }

  /** Navegação estimada pela latitude média: partida + rumo + distância – chegada. */
  function estima(partida, rumo, milhas) {
    var dlat = milhas * Math.cos(rumo * D2R);       // minutos
    var ap = milhas * Math.sin(rumo * D2R);         // apartamento, milhas
    var lat2 = partida.lat + dlat / 60;
    var r = { dlat: dlat, ap: ap, lat2: lat2 };
    if (Math.abs(lat2) >= 89.5) { r.erro = 'A estima passa perto do polo: reduza a distância ou mude o rumo.'; return r; }
    r.latm = (partida.lat + lat2) / 2;
    r.dlon = ap / Math.cos(r.latm * D2R);           // minutos
    r.chegada = { lat: lat2, lon: norm180(partida.lon + r.dlon / 60) };
    // comparação com a loxodrômica exata (latitudes crescidas, esfera)
    var lonExata;
    if (Math.abs(dlat) < 1e-9) lonExata = partida.lon + (ap / Math.cos(partida.lat * D2R)) / 60;
    else lonExata = partida.lon + (latCrescida(lat2) - latCrescida(partida.lat)) * Math.tan(rumo * D2R) / 60;
    r.exata = { lat: lat2, lon: norm180(lonExata) };
    r.erroMilhas = milhasEntre(r.chegada, r.exata);
    return r;
  }

  /** Navegação estimada inversa (latitude média): dois pontos próximos – rumo e distância. */
  function estimaInversa(a, b) {
    var dlat = (b.lat - a.lat) * 60, latm = (a.lat + b.lat) / 2;
    var dlon = norm180(b.lon - a.lon) * 60;
    var ap = dlon * Math.cos(latm * D2R);
    return { dlat: dlat, dlon: dlon, latm: latm, ap: ap, rumo: norm360(Math.atan2(ap, dlat) * R2D), milhas: Math.sqrt(dlat * dlat + ap * ap) };
  }

  /* ---------- Terra (Natural Earth) — usa VL.geo.land50m ou land110m se já carregados ---------- */
  var cacheTerra = { fonte: null, polys: null };
  function poligonosTerra() {
    var fonte = VL.geo && (VL.geo.land50m || VL.geo.land110m);
    if (!fonte) return null;
    if (cacheTerra.fonte === fonte) return cacheTerra.polys;
    var polys = [];
    fonte.features.forEach(function (ft) {
      var g = ft.geometry, lista = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      lista.forEach(function (pl) {
        var b = [999, -999, 999, -999];
        pl[0].forEach(function (c) { if (c[0] < b[0]) b[0] = c[0]; if (c[0] > b[1]) b[1] = c[0]; if (c[1] < b[2]) b[2] = c[1]; if (c[1] > b[3]) b[3] = c[1]; });
        polys.push({ aneis: pl, bb: b });
      });
    });
    cacheTerra.fonte = fonte; cacheTerra.polys = polys;
    return polys;
  }
  function dentroAnel(x, y, r) {
    var c = false;
    for (var i = 0, j = r.length - 1; i < r.length; j = i++) {
      var xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  /** true se o ponto está em terra; null se a geografia ainda não foi carregada. */
  function naTerra(lat, lon) {
    var polys = poligonosTerra();
    if (!polys) return null;
    for (var i = 0; i < polys.length; i++) {
      var p = polys[i], b = p.bb;
      if (lon < b[0] || lon > b[1] || lat < b[2] || lat > b[3]) continue;
      if (dentroAnel(lon, lat, p.aneis[0])) {
        var buraco = false;
        for (var k = 1; k < p.aneis.length; k++) if (dentroAnel(lon, lat, p.aneis[k])) { buraco = true; break; }
        if (!buraco) return true;
      }
    }
    return false;
  }
  /** Fração da derrota (ortodrômica ou loxodrômica) que passa sobre terra, ignorando 5 milhas em cada ponta. */
  function cruzaTerra(a, b, tipo) {
    if (!poligonosTerra()) return null;
    var d = tipo === 'lox' ? loxodromica(a, b).milhas : milhasEntre(a, b);
    var n = Math.max(24, Math.min(400, Math.round(d / 8))), terra = 0, total = 0;
    for (var i = 1; i < n; i++) {
      var f = i / n;
      if (f * d < 5 || (1 - f) * d < 5) continue;
      var p = tipo === 'lox' ? pontoLox(a, b, f) : pontoOrto(a, b, f);
      total++;
      if (naTerra(p.lat, p.lon)) terra++;
    }
    return total ? terra / total : 0;
  }

  /* ---------- Formatação PT-BR ---------- */
  function num(x, casas) {
    var c = casas == null ? 1 : casas;
    var s = Math.abs(x).toFixed(c).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    var out = s.join(',');
    return (x < 0 && Number(Math.abs(x).toFixed(c)) !== 0 ? '−' : '') + out;
  }
  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }
  /** Graus e minutos com décimos: 13° 00,6′ S (casas = casas dos minutos). */
  function gm(valor, tipo, casas) {
    var c = casas == null ? 1 : casas;
    var hem = tipo === 'lat' ? (valor < 0 ? 'S' : 'N') : (valor < 0 ? 'W' : 'E');
    var a = Math.abs(valor), g = Math.floor(a), m = (a - g) * 60;
    var mr = Number(m.toFixed(c));
    if (mr >= 60) { g += 1; mr = 0; }
    if (tipo === 'lon' && g === 180) hem = (valor < 0 ? 'W' : 'E');
    if (g === 0 && mr === 0) hem = tipo === 'lat' ? '' : '';
    var ms = mr.toFixed(c).split('.');
    ms[0] = pad(ms[0], 2);
    return pad(g, tipo === 'lat' ? 2 : 3) + '° ' + ms.join(',') + '′' + (hem ? ' ' + hem : '');
  }
  function gms(valor, tipo) {
    var hem = tipo === 'lat' ? (valor < 0 ? 'S' : 'N') : (valor < 0 ? 'W' : 'E');
    var tot = Math.round(Math.abs(valor) * 36000) / 10; // décimos de segundo
    var g = Math.floor(tot / 3600), m = Math.floor((tot - g * 3600) / 60), s = tot - g * 3600 - m * 60;
    return pad(g, tipo === 'lat' ? 2 : 3) + '° ' + pad(m, 2) + '′ ' + pad(s.toFixed(1).split('.')[0], 2) + ',' + s.toFixed(1).split('.')[1] + '″ ' + hem;
  }
  function fmtPonto(p) { return gm(p.lat, 'lat') + '  ' + gm(p.lon, 'lon'); }
  /** Rumo circular de três algarismos: 052,3° */
  function fmtRumo(r, casas) {
    var c = casas == null ? 1 : casas;
    var v = Number(norm360(r).toFixed(c));
    if (v >= 360) v = 0;
    var s = v.toFixed(c).split('.');
    return pad(s[0], 3) + (c ? ',' + s[1] : '') + '°';
  }
  /** Rumo quadrantal: N 52,3° E */
  function quadrantal(r, casas) {
    var c = casas == null ? 1 : casas;
    r = norm360(r);
    var a, ns, ew;
    if (r <= 90) { ns = 'N'; ew = 'E'; a = r; }
    else if (r <= 180) { ns = 'S'; ew = 'E'; a = 180 - r; }
    else if (r <= 270) { ns = 'S'; ew = 'W'; a = r - 180; }
    else { ns = 'N'; ew = 'W'; a = 360 - r; }
    if (Number(a.toFixed(c)) === 0) return ns;
    if (Number(a.toFixed(c)) === 90) return ew;
    return ns + ' ' + num(a, c) + '° ' + ew;
  }
  function fmtMilhas(m) { return num(m, m >= 100 ? 0 : 1) + ' M'; }
  function fmtDuracao(horas) {
    if (!isFinite(horas)) return '—';
    var totMin = Math.round(horas * 60);
    var d = Math.floor(totMin / 1440), h = Math.floor((totMin % 1440) / 60), m = totMin % 60;
    var partes = [];
    if (d) partes.push(d + (d === 1 ? ' dia' : ' dias'));
    if (h) partes.push(h + ' h');
    if (m && d < 3) partes.push(m + ' min');
    return partes.length ? partes.join(' ') : '0 min';
  }

  /* ---------- Leitura de números e coordenadas digitadas ---------- */
  /** Aceita vírgula ou ponto como separador decimal. Devolve NaN se inválido. */
  function lerNumero(txt) {
    if (txt == null) return NaN;
    var s = String(txt).trim().replace(/\s+/g, '').replace(/−/g, '-');
    if (!s) return NaN;
    if (/,/.test(s) && /\./.test(s)) s = s.replace(/\./g, '').replace(',', '.'); // 1.234,5
    else if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');   // 2.700 (milhar, PT-BR)
    else s = s.replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return Number(s);
  }
  /**
   * Coordenada em texto livre: "13°00,5'S", "13 00.5 S", "-13,0083", "S 13 00 30", "038°32′W", "38 32 O".
   * tipo: 'lat' | 'lon'. Devolve {valor} ou {erro}.
   */
  function lerCoord(txt, tipo) {
    var s = String(txt || '').toUpperCase().replace(/−/g, '-').trim();
    if (!s) return { erro: 'Digite a coordenada.' };
    var hemM = s.match(/[NSEWLO]/g);
    if (hemM && hemM.length > 1) return { erro: 'Use só uma letra de hemisfério (N, S, E ou W).' };
    var hem = hemM ? hemM[0] : null;
    if (hem === 'L') hem = 'E';
    if (hem === 'O') hem = 'W';
    if (hem && tipo === 'lat' && /[EW]/.test(hem)) return { erro: 'Latitude usa N ou S.' };
    if (hem && tipo === 'lon' && /[NS]/.test(hem)) return { erro: 'Longitude usa E (ou L) ou W (ou O).' };
    var neg = /^\s*-/.test(s) || /[^\d]-\s*\d/.test(' ' + s.replace(/[NSEWLO]/g, ''));
    if (neg && hem) return { erro: 'Use o sinal de menos ou a letra do hemisfério, não os dois.' };
    var corpo = s.replace(/[NSEWLO]/g, ' ').replace(/[°º′'″"]/g, ' ').replace(/-/g, ' ');
    // vírgula decimal: "13 00,5" – 13 00.5
    corpo = corpo.replace(/(\d),(\d)/g, '$1.$2');
    var nums = corpo.trim().split(/[\s,;]+/).filter(Boolean);
    if (!nums.length || nums.length > 3) return { erro: 'Formato não reconhecido. Exemplos: 13° 00,5′ S · −13,0083 · 13 00 30 S' };
    var vals = nums.map(Number);
    if (vals.some(function (v) { return !isFinite(v) || v < 0; })) return { erro: 'Formato não reconhecido. Exemplos: 13° 00,5′ S · −13,0083 · 13 00 30 S' };
    if (vals.length > 1 && vals[0] % 1 !== 0) return { erro: 'Quando houver minutos, os graus devem ser inteiros.' };
    if (vals.length > 1 && vals[1] >= 60) return { erro: 'Os minutos vão de 0 a 59,9.' };
    if (vals.length > 2 && vals[1] % 1 !== 0) return { erro: 'Quando houver segundos, os minutos devem ser inteiros.' };
    if (vals.length > 2 && vals[2] >= 60) return { erro: 'Os segundos vão de 0 a 59,9.' };
    var v = vals[0] + (vals[1] || 0) / 60 + (vals[2] || 0) / 3600;
    var max = tipo === 'lat' ? 90 : 180;
    if (v > max) return { erro: tipo === 'lat' ? 'A latitude vai de 0° a 90°.' : 'A longitude vai de 0° a 180°.' };
    if (!hem && !neg && v !== 0 && vals.length > 1) return { erro: 'Falta o hemisfério: ' + (tipo === 'lat' ? 'N ou S.' : 'E ou W.') };
    if (hem === 'S' || hem === 'W' || neg) v = -v;
    return { valor: v };
  }

  /* ---------- Travessias prontas ----------
     Coordenadas APROXIMADAS de pontos ao largo dos portos (para estudo — não use para navegar).
     Pontos intermediários "ao largo" existem para que nenhuma perna atravesse terra. */
  function P(nome, latG, latM, latH, lonG, lonM, lonH, curto) {
    return { nome: nome, curto: curto || nome, lat: (latG + latM / 60) * (latH === 'S' ? -1 : 1), lon: (lonG + lonM / 60) * (lonH === 'W' ? -1 : 1) };
  }
  function aux(p) { p.aux = true; return p; } // ponto auxiliar (afastamento), sem rótulo no globo
  var PT = {
    salvador: P('Salvador (saída da Baía de Todos os Santos)', 13, 6, 'S', 38, 33, 'W', 'Salvador'),
    salvadorLargo: aux(P('ponto de afastamento a leste de Salvador', 13, 20, 'S', 36, 42, 'W', 'leste de Salvador')),
    salvadorSE: aux(P('ao largo de Salvador', 13, 15, 'S', 38, 20, 'W', 'ao largo de Salvador')),
    recife: P('Recife (ao largo do porto)', 8, 3, 'S', 34, 50, 'W', 'Recife'),
    noronha: P('Fernando de Noronha (Baía de Santo Antônio)', 3, 49, 'S', 32, 24, 'W', 'Fernando de Noronha'),
    natal: P('Natal (barra do Rio Potengi)', 5, 45, 'S', 35, 10, 'W', 'Natal'),
    mindelo: P('Mindelo, Cabo Verde (ao largo, no Canal de São Vicente)', 16, 54, 'N', 25, 5, 'W', 'Mindelo'),
    lasPalmas: P('Las Palmas de Gran Canaria (ao largo)', 28, 8, 'N', 15, 22, 'W', 'Las Palmas'),
    granCanariaSE: aux(P('a sudeste de Gran Canaria', 27, 40, 'N', 15, 15, 'W', 'sudeste de Gran Canaria')),
    rodney: P('Rodney Bay, Santa Lúcia (ao largo de Pigeon Island)', 14, 6, 'N', 60, 59, 'W', 'Rodney Bay'),
    granada: P('Granada (ao largo de Point Salines)', 11, 58, 'N', 61, 48, 'W', 'Granada'),
    rio: P('Rio de Janeiro (barra da Baía de Guanabara)', 22, 57, 'S', 43, 9, 'W', 'Rio de Janeiro'),
    cabo: P('Cidade do Cabo (Table Bay)', 33, 51, 'S', 18, 24, 'E', 'Cidade do Cabo'),
    antigua: P('Antígua (ao largo de St. John’s)', 17, 10, 'N', 61, 55, 'W', 'Antígua'),
    bermudas: P('Bermudas (ao largo de St. David’s)', 32, 22, 'N', 64, 37, 'W', 'Bermudas'),
    horta: P('Açores (ao largo da Horta, Faial)', 38, 30, 'N', 28, 36, 'W', 'Horta'),
    picoSul: aux(P('ao sul da ilha do Pico', 38, 20, 'N', 28, 35, 'W', 'sul do Pico')),
    lisboa: P('Lisboa (ao largo de Cascais)', 38, 40, 'N', 9, 26, 'W', 'Lisboa'),
    maceio: aux(P('ao largo de Maceió', 9, 50, 'S', 35, 12, 'W', 'ao largo de Maceió')),
    pernambuco: aux(P('ao largo de Pernambuco e da Paraíba', 7, 50, 'S', 34, 28, 'W', 'ao largo da Paraíba')),
    calcanhar: aux(P('ao largo do Cabo Calcanhar (RN)', 4, 50, 'S', 35, 15, 'W', 'Cabo Calcanhar')),
    fortaleza: P('Fortaleza (ao largo do Mucuripe)', 3, 40, 'S', 38, 28, 'W', 'Fortaleza'),
    para: aux(P('ao largo do Pará e do Maranhão', 1, 30, 'N', 45, 0, 'W', 'ao largo do Pará')),
    amapa: aux(P('ao largo do Amapá e da Guiana Francesa', 5, 40, 'N', 51, 0, 'W', 'ao largo do Amapá')),
    tobago: P('Tobago (ao largo de Crown Point)', 11, 6, 'N', 60, 52, 'W', 'Tobago'),
    boaEsperanca: P('ao sul do Cabo da Boa Esperança', 35, 0, 'S', 18, 20, 'E', 'Boa Esperança'),
    tasmania: P('ao sul da Tasmânia (Austrália)', 43, 45, 'S', 146, 50, 'E', 'Tasmânia'),
  };
  var PRESETS = [
    { id: 'salvador-mindelo', nome: 'Salvador – Mindelo (Cabo Verde)', pontos: [PT.salvador, PT.salvadorLargo, PT.mindelo],
      nota: 'A ortodrômica sai de um ponto de afastamento a leste de Salvador: a costa do Nordeste avança para leste e uma linha reta saindo da barra cortaria terra. Rota quase norte–sul e perto do Equador: ortodrômica e loxodrômica quase coincidem. A derrota cruza o Equador e a ZCIT (zona de calmarias); ao norte dela, os alísios de nordeste sopram de perto da proa.' },
    { id: 'recife-noronha', nome: 'Recife – Fernando de Noronha', pontos: [PT.recife, PT.noronha],
      nota: 'Percurso da Refeno (Regata Internacional Recife–Fernando de Noronha). Em distâncias curtas, perto do Equador, as duas derrotas são praticamente iguais: navegue pela loxodrômica, com rumo constante.' },
    { id: 'natal-mindelo', nome: 'Natal – Mindelo (Cabo Verde)', pontos: [PT.natal, PT.mindelo],
      nota: 'A travessia mais curta entre o Brasil e Cabo Verde. Cruza o Equador e a ZCIT; a diferença entre as duas derrotas é pequena porque a rota é quase norte–sul.' },
    { id: 'arc', nome: 'Las Palmas – Rodney Bay, Santa Lúcia (rota da ARC)', pontos: [PT.lasPalmas, PT.granCanariaSE, PT.rodney],
      nota: 'Rota da ARC (Atlantic Rally for Cruisers). A ortodrômica passa ao norte da loxodrômica, mas na prática os barcos descem primeiro para o sul em busca dos alísios de nordeste: a menor distância nem sempre é a derrota mais rápida.' },
    { id: 'mindelo-granada', nome: 'Mindelo – Granada (Caribe)', pontos: [PT.mindelo, PT.granada],
      nota: 'Travessia dentro da faixa dos alísios de nordeste, com vento de popa ou alheta. A diferença entre as derrotas é pequena porque as latitudes são baixas.' },
    { id: 'rio-cabo', nome: 'Rio de Janeiro – Cidade do Cabo', pontos: [PT.rio, PT.cabo],
      nota: 'Latitudes médias e grande diferença de longitude: aqui a ortodrômica economiza dezenas de milhas e desce mais para o sul. Velejadores costumam descer ainda mais, até os ventos de oeste, contornando a alta do Atlântico Sul.' },
    { id: 'cabo-rio', nome: 'Cidade do Cabo – Rio de Janeiro', pontos: [PT.cabo, PT.rio],
      nota: 'Percurso da regata Cape to Rio. No sentido leste–oeste os alísios de sudeste empurram o barco pela popa ou pela alheta durante boa parte do caminho.' },
    { id: 'retorno', nome: 'Antígua – Bermudas – Açores – Lisboa (retorno)', pontos: [PT.antigua, PT.bermudas, PT.horta, PT.picoSul, PT.lisboa],
      nota: 'Rota clássica de volta do Caribe para a Europa: em vez de bater contra os alísios, sobe-se até as Bermudas e os Açores para pegar os ventos de oeste. A temporada de furacões do Atlântico Norte vai de 1º de junho a 30 de novembro (NOAA).' },
    { id: 'salvador-caribe', nome: 'Salvador – Caribe pela costa (até Granada)', pontos: [PT.salvador, PT.salvadorSE, PT.maceio, PT.pernambuco, PT.calcanhar, PT.fortaleza, PT.para, PT.amapa, PT.tobago, PT.granada],
      nota: 'Rota ilustrativa pela costa, com pontos ao largo para não cortar terra (não é uma derrota planejada). A Corrente Norte do Brasil e os alísios ajudam a subir para noroeste ao longo da costa Norte. Na foz do Amazonas e nas Guianas há bancos de lama, corrente forte e pouca profundidade: mantenha distância da costa.' },
    { id: 'didatico-tasmania', nome: 'Exemplo didático: Cabo da Boa Esperança – Tasmânia', pontos: [PT.boaEsperanca, PT.tasmania],
      nota: 'Exemplo para ver o vértice: a ortodrômica desce até latitudes muito altas, com gelo e tempestades. Na prática usa-se uma latitude-limite: segue-se a ortodrômica até ela, depois o paralelo e outra ortodrômica (em inglês, composite sailing).' },
  ];

  VL.derrota = {
    D2R: D2R, R2D: R2D, MIN_RAD: MIN_RAD,
    norm180: norm180, norm360: norm360, v3: v3, ll: ll, ang: ang,
    rumoEntre: rumoEntre, milhasEntre: milhasEntre, pontoOrto: pontoOrto, pontoLox: pontoLox,
    validarPar: validarPar, naTerra: naTerra, cruzaTerra: cruzaTerra, ortodromica: ortodromica, loxodromica: loxodromica, latCrescida: latCrescida,
    pontosIntermediarios: pontosIntermediarios, estima: estima, estimaInversa: estimaInversa,
    num: num, gm: gm, gms: gms, fmtPonto: fmtPonto, fmtRumo: fmtRumo, quadrantal: quadrantal,
    fmtMilhas: fmtMilhas, fmtDuracao: fmtDuracao, lerNumero: lerNumero, lerCoord: lerCoord,
    pontos: PT, presets: PRESETS,
    /** Termo em inglês entre parênteses quando a trilha internacional está ligada. */
    intl: function (pt, en) { return (VL.settings && VL.settings.get && VL.settings.get('intl')) ? pt + ' (' + en + ')' : pt; },
  };

  /* =====================================================================================
     2. Widget "derrota-calc"
     ===================================================================================== */
  if (!VL.widgets || !VL.h) return;
  var h = VL.h, Dv = VL.derrota;
  var contador = 0;

  function T(pt, en) { return Dv.intl(pt, en); }
  function n4(x) { return Dv.num(x, 4); }
  function par(x) { return x < 0 ? '(' + n4(x) + ')' : n4(x); }
  function gd(x, c) { return Dv.num(x, c == null ? 4 : c) + '°'; }
  function mi(x, c) { return Dv.num(x, c == null ? 1 : c) + '′'; }
  function esc(s) { return VL.esc ? VL.esc(s) : String(s); }
  function nomeHem(x) { return { N: 'norte', S: 'sul', E: 'leste', W: 'oeste' }[x]; }
  function f(html) { return '<span class="dc-f">' + html + '</span>'; }
  var S1 = '<sub>1</sub>', S2 = '<sub>2</sub>';
  function ptHtml(p) { return '<span class="dc-nw">' + Dv.gm(p.lat, 'lat') + '</span> <span class="dc-nw">' + Dv.gm(p.lon, 'lon') + '</span>'; }
  /** Soma de coordenada como se faz no papel: v1 (graus, com sinal) + d (minutos, + = N ou E) = v2.
      Indo em direção ao Equador (ou a Greenwich) o valor diminui, então a conta é uma subtração. */
  function somaCoord(v1, dMin, v2, tipo) {
    var d = Math.abs(dMin), cruzou = Math.abs(v1) > 1e-9 && Math.abs(v2) > 1e-9 && (v1 < 0) !== (v2 < 0);
    if (cruzou && tipo === 'lon' && Math.abs(v1) > 90) return Dv.gm(v2, tipo) + ' (cruzou o meridiano de 180°)';
    if (cruzou) return mi(d) + ' − ' + mi(Math.abs(v1) * 60) + ' = ' + Dv.gm(v2, tipo) + ' (cruzou o ' + (tipo === 'lat' ? 'Equador' : 'meridiano de Greenwich') + ')';
    var mesmo = Math.abs(v1) < 1e-9 || (v1 > 0) === (dMin >= 0);
    return Dv.gm(v1, tipo) + (mesmo ? ' + ' : ' − ') + mi(d) + ' = ' + Dv.gm(v2, tipo);
  }

  /* ---------- Campos de coordenada: graus · minutos,décimos · hemisfério ---------- */
  function campoCoord(rotulo, tipo, aoMudar) {
    var max = tipo === 'lat' ? 90 : 180;
    var hems = tipo === 'lat' ? ['N', 'S'] : ['E', 'W'];
    var hem = hems[0];
    var g = h('input', { type: 'text', inputmode: 'numeric', class: 'dc-in dc-in-g', 'aria-label': rotulo + ', graus', autocomplete: 'off', spellcheck: 'false' });
    var m = h('input', { type: 'text', inputmode: 'decimal', class: 'dc-in dc-in-m', 'aria-label': rotulo + ', minutos (com décimos)', autocomplete: 'off', spellcheck: 'false' });
    var bts = hems.map(function (x) {
      return h('button', { type: 'button', 'aria-pressed': 'false', title: nomeHem(x), 'aria-label': rotulo + ': ' + nomeHem(x), onclick: function () { setHem(x); aoMudar(); } }, x);
    });
    var erro = h('p', { class: 'dc-erro-campo', 'aria-live': 'polite' });
    var el = h('div', { class: 'dc-coord' },
      h('span', { class: 'dc-coord-rot', 'aria-hidden': 'true' }, rotulo),
      h('div', { class: 'dc-coord-linha' }, g, h('span', { class: 'dc-un', 'aria-hidden': 'true' }, '°'), m, h('span', { class: 'dc-un', 'aria-hidden': 'true' }, '′'),
        h('div', { class: 'segmented dc-hem', role: 'group', 'aria-label': rotulo + ': hemisfério' }, bts)),
      erro);
    function setHem(x) { hem = x; bts.forEach(function (b, i) { b.setAttribute('aria-pressed', String(hems[i] === x)); }); }
    setHem(hem);
    g.addEventListener('input', aoMudar);
    m.addEventListener('input', aoMudar);
    function ler() {
      var gs = g.value.trim(), ms = m.value.trim();
      var res;
      if (!gs && !ms) res = { erro: 'Preencha os graus.' };
      else {
        var gv = gs ? Dv.lerNumero(gs) : 0, mv = ms ? Dv.lerNumero(ms) : 0;
        if (!isFinite(gv) || gv < 0 || gv % 1 !== 0) res = { erro: 'Graus: número inteiro de 0 a ' + max + '.', campo: g };
        else if (gv > max) res = { erro: 'Graus: o máximo é ' + max + '.', campo: g };
        else if (!isFinite(mv) || mv < 0 || mv >= 60) res = { erro: 'Minutos: de 0 a 59,9 (décimos com vírgula).', campo: m };
        else if (gv === max && mv > 0) res = { erro: (tipo === 'lat' ? 'A latitude' : 'A longitude') + ' não passa de ' + max + '°.', campo: m };
        else res = { valor: (gv + mv / 60) * (hem === hems[1] ? -1 : 1) };
      }
      erro.textContent = res.erro || '';
      g.setAttribute('aria-invalid', String(!!(res.erro && res.campo !== m)));
      m.setAttribute('aria-invalid', String(!!(res.erro && res.campo === m)));
      return res;
    }
    function set(v) {
      setHem(v < 0 ? hems[1] : hems[0]);
      var a = Math.abs(v), gg = Math.floor(a + 1e-9), mm = Number(((a - gg) * 60).toFixed(1));
      if (mm >= 60) { gg += 1; mm = 0; }
      g.value = String(gg);
      m.value = Dv.num(mm, 1);
      erro.textContent = '';
    }
    function limpar() { g.value = ''; m.value = ''; erro.textContent = ''; setHem(hems[0]); }
    return { el: el, ler: ler, set: set, limpar: limpar };
  }

  function campoPonto(titulo, aoMudar) {
    var la = campoCoord('Latitude', 'lat', aoMudar), lo = campoCoord('Longitude', 'lon', aoMudar);
    var nome = h('span', { class: 'dc-ponto-nome' });
    var el = h('fieldset', { class: 'dc-ponto' }, h('legend', null, titulo, ' ', nome), la.el, lo.el);
    return {
      el: el,
      ler: function () { var a = la.ler(), b = lo.ler(); if (a.erro || b.erro) return { erro: true }; return { ponto: { lat: a.valor, lon: b.valor } }; },
      set: function (p) { la.set(p.lat); lo.set(p.lon); nome.textContent = p.curto ? '· ' + p.curto : ''; },
      semNome: function () { nome.textContent = ''; },
      limpar: function () { la.limpar(); lo.limpar(); nome.textContent = ''; },
    };
  }

  function campoNumero(rotulo, unidade, valor, aoMudar, attrs) {
    var inp = h('input', Object.assign({ type: 'text', inputmode: 'decimal', class: 'dc-in dc-in-n', 'aria-label': rotulo + (unidade ? ' (' + unidade + ')' : ''), autocomplete: 'off', spellcheck: 'false', value: valor == null ? '' : String(valor) }, attrs || {}));
    if (aoMudar) inp.addEventListener('input', aoMudar);
    var el = h('label', { class: 'dc-num' }, h('span', { class: 'dc-coord-rot' }, rotulo), h('span', { class: 'dc-coord-linha' }, inp, unidade ? h('span', { class: 'dc-un' }, unidade) : null));
    return { el: el, inp: inp, valor: function () { return Dv.lerNumero(inp.value); } };
  }

  function segmentado(rotulo, itens, atual, aoEscolher) {
    var nav = h('div', { class: 'segmented dc-seg', role: 'group', 'aria-label': rotulo });
    var bts = itens.map(function (it) {
      return h('button', { type: 'button', 'aria-pressed': String(it.id === atual), onclick: function () { escolher(it.id); aoEscolher(it.id); } }, it.rotulo);
    });
    bts.forEach(function (b) { nav.appendChild(b); });
    function escolher(id) { bts.forEach(function (b, i) { b.setAttribute('aria-pressed', String(itens[i].id === id)); }); }
    nav.escolher = escolher;
    return nav;
  }

  /* ---------- Pernas dos exemplos prontos (para os seletores) ---------- */
  function pernasExemplos() {
    var out = [];
    Dv.presets.forEach(function (pr) {
      var pernas = [];
      for (var i = 0; i < pr.pontos.length - 1; i++) {
        var a = pr.pontos[i], b = pr.pontos[i + 1];
        if (Dv.milhasEntre(a, b) >= 250) pernas.push({ a: a, b: b });
      }
      out.push({ preset: pr, pernas: pernas });
    });
    return out;
  }

  /* ---------- Passo a passo ---------- */
  function passoDados(a, b, o) {
    var dlRaw = b.lon - a.lon;
    var txt = 'Convenção: latitudes N e longitudes E positivas; S e W negativas.' +
      f('φ' + S1 + ' = ' + gd(a.lat) + ' (' + Dv.gm(a.lat, 'lat') + ') · λ' + S1 + ' = ' + gd(a.lon) + ' (' + Dv.gm(a.lon, 'lon') + ')') +
      f('φ' + S2 + ' = ' + gd(b.lat) + ' (' + Dv.gm(b.lat, 'lat') + ') · λ' + S2 + ' = ' + gd(b.lon) + ' (' + Dv.gm(b.lon, 'lon') + ')') +
      f('Δλ = λ' + S2 + ' − λ' + S1 + ' = ' + gd(o.dlon) + ' (para ' + (o.dlon >= 0 ? 'leste, E' : 'oeste, W') + ')');
    if (Math.abs(dlRaw) > 180) txt += '<span class="dc-obs">A diferença direta passa de 180°: pelo caminho mais curto, a derrota cruza o antimeridiano (180°).</span>';
    return txt;
  }

  function passosOrto(a, b, o) {
    var ol = h('ol', { class: 'dc-passos' });
    function li(t, html) { ol.appendChild(h('li', null, h('strong', null, t), h('div', { html: html }))); }
    li('Dados', passoDados(a, b, o));
    var s1 = Math.sin(a.lat * Dv.D2R), s2 = Math.sin(b.lat * Dv.D2R), c1 = Math.cos(a.lat * Dv.D2R), c2 = Math.cos(b.lat * Dv.D2R), cdl = Math.cos(o.dlon * Dv.D2R);
    var dist = f('cos d = sen φ' + S1 + ' · sen φ' + S2 + ' + cos φ' + S1 + ' · cos φ' + S2 + ' · cos Δλ') +
      f('cos d = ' + par(s1) + ' · ' + par(s2) + ' + ' + par(c1) + ' · ' + par(c2) + ' · ' + par(cdl)) +
      f('cos d = ' + n4(o.termo1) + ' + ' + par(o.termo2) + ' = ' + Dv.num(o.cosd, 5)) +
      f('d = arccos ' + Dv.num(o.cosd, 5) + ' = ' + gd(o.dGraus) + ' = ' + mi(o.dGraus * 60) + ' = <b>' + Dv.num(o.milhas, 1) + ' milhas</b>') +
      '<span class="dc-obs">Cada minuto de arco de círculo máximo vale 1 milha náutica (1.852 m).' +
      (o.milhas < 60 ? ' Em distâncias curtas, o arccos fica impreciso na calculadora; o app usa uma fórmula equivalente mais estável.' : '') + '</span>';
    li('Distância ortodrômica', dist);
    if (o.antipodas) { li('Rumo inicial', 'Os pontos são antípodas (opostos no globo): existem infinitos círculos máximos entre eles e o rumo inicial não é definido.'); return ol; }
    var num = o.tgNum, den = o.tgDen;
    var angulo = Math.atan2(Math.abs(num), Math.abs(den)) * Dv.R2D;
    var ns = den >= 0 ? 'N' : 'S', ew = num >= 0 ? 'E' : 'W';
    var rumo = f('tg Ri = sen Δλ / (cos φ' + S1 + ' · tg φ' + S2 + ' − sen φ' + S1 + ' · cos Δλ)') +
      f('tg Ri = ' + n4(num) + ' / (' + n4(c1) + ' · ' + par(Math.tan(b.lat * Dv.D2R)) + ' − ' + par(s1) + ' · ' + par(cdl) + ') = ' + n4(num) + ' / ' + par(den)) +
      (Math.abs(den) < 1e-12 ? f('denominador zero → o ângulo é 90°') : f('arctg |' + n4(num / den) + '| = ' + Dv.num(angulo, 1) + '°')) +
      '<span class="dc-obs">Quadrante: o denominador é ' + (den >= 0 ? 'positivo, então o rumo é para o norte (N)' : 'negativo, então o rumo é para o sul (S)') +
      '; o seno de Δλ é ' + (num >= 0 ? 'positivo (leste, E)' : 'negativo (oeste, W)') + '.</span>' +
      f('Ri = ' + ns + ' ' + Dv.num(angulo, 1) + '° ' + ew + ' = <b>' + Dv.fmtRumo(o.rumoInicial) + '</b>');
    li('Rumo inicial', rumo);
    li('Rumo final', f('Rf = ' + Dv.fmtRumo(o.rumoFinal) + ' (' + Dv.quadrantal(o.rumoFinal) + ')') +
      '<span class="dc-obs">Na ortodrômica o rumo muda o tempo todo — por isso, na prática, ela é dividida em pernas de rumo constante (veja os pontos intermediários).</span>');
    var vtxt;
    if (o.equador) vtxt = 'A derrota segue o Equador: o círculo máximo é o próprio Equador e não há vértice.';
    else if (Math.abs(Math.sin(o.rumoInicial * Dv.D2R)) < 1e-9) vtxt = 'O rumo inicial é 000° ou 180°: a derrota segue um meridiano e o vértice é o polo.';
    else {
      var v = o.verticeRumo;
      var ri = o.rumoInicial * Dv.D2R;
      var cosv = c1 * Math.abs(Math.sin(ri));
      var latv = Math.acos(Math.min(1, cosv)) * Dv.R2D;
      var sdl = Math.abs(Math.cos(ri)) / Math.sin(latv * Dv.D2R);
      var asn = Math.asin(Math.min(1, sdl)) * Dv.R2D;
      var contrarios = (a.lat < 0) !== (v.lat < 0) && Math.abs(a.lat) > 1e-9;
      var dlv = Math.abs(v.dlon);
      vtxt = 'O vértice é o ponto do círculo máximo mais perto do polo; ali o rumo é exatamente 090° ou 270°.' +
        f('cos φv = cos φ' + S1 + ' · |sen Ri| = ' + n4(c1) + ' · ' + n4(Math.abs(Math.sin(ri))) + ' = ' + n4(cosv) + ' → φv = ' + Dv.num(latv, 2) + '° ' + (v.lat >= 0 ? 'N' : 'S')) +
        f('sen Δλv = |cos Ri| / sen φv = ' + n4(Math.abs(Math.cos(ri))) + ' / ' + n4(Math.sin(latv * Dv.D2R)) + ' = ' + n4(sdl) + ' → arcsen = ' + Dv.num(asn, 2) + '°') +
        (contrarios ? '<span class="dc-obs">A partida e o vértice estão em hemisférios diferentes, então Δλv = 180° − ' + Dv.num(asn, 2) + '° = ' + Dv.num(180 - asn, 2) + '°.</span>' : '') +
        f('Δλv = ' + Dv.num(dlv, 2) + '° para ' + (v.dlon >= 0 ? 'leste' : 'oeste') + ' → vértice em <b>' + ptHtml(v) + '</b>');
      if (v.naDerrota) vtxt += '<span class="dc-obs">O vértice fica <b>na derrota</b>, a ' + Dv.num(v.milhasDaPartida, 0) + ' milhas da partida.</span>';
      else vtxt += '<span class="dc-obs">O vértice fica <b>fora do trecho</b>, depois da chegada: entre os dois pontos a latitude só ' + (v.lat >= 0 ? 'aumenta para o norte' : 'aumenta para o sul') + '.</span>';
    }
    li(T('Vértice', 'vertex'), vtxt);
    return ol;
  }

  function passosLox(a, b, l) {
    var ol = h('ol', { class: 'dc-passos' });
    function li(t, html) { ol.appendChild(h('li', null, h('strong', null, t), h('div', { html: html }))); }
    li('Diferença de latitude e de longitude',
      f('Δφ = φ' + S2 + ' − φ' + S1 + ' = ' + mi(l.dlat) + ' (' + (l.dlat >= 0 ? 'para o norte' : 'para o sul') + ')') +
      f('Δλ = ' + mi(l.dlon) + ' (' + (l.dlon >= 0 ? 'para leste' : 'para oeste') + ')') +
      '<span class="dc-obs">Em minutos: 1° = 60′. Na latitude, 1′ = 1 milha.</span>');
    if (l.paralelo) {
      li('Mesmo paralelo', 'Os dois pontos estão na mesma latitude: a loxodrômica é o próprio paralelo.' +
        f('R = ' + Dv.fmtRumo(l.rumo, 0)) +
        f('d = Δλ′ · cos φ = ' + Dv.num(Math.abs(l.dlon), 1) + ' · ' + n4(l.q) + ' = <b>' + Dv.num(l.milhas, 1) + ' milhas</b>') +
        '<span class="dc-obs">Esta conta é o ' + T('apartamento', 'departure') + ': a distância leste–oeste medida sobre o paralelo.</span>');
      return ol;
    }
    var formula = l.modelo === 'elipsoide'
      ? f('φc = 7.915,7045 · log<sub>10</sub> tg(45° + φ/2) − 23,0136 · sen φ − 0,0514 · sen³ φ') + '<span class="dc-obs">Fórmula com a correção do elipsoide (WGS-84), a mesma das tábuas de latitudes crescidas.</span>'
      : f('φc = 7.915,7045 · log<sub>10</sub> tg(45° + φ/2)') + '<span class="dc-obs">Modelo esférico. As tábuas usam o elipsoide e dão valores um pouco menores (ex.: 30° → 1.876,9′ na tábua, 1.888,4′ na esfera); o rumo muda só décimos de grau.</span>';
    li(T('Latitudes crescidas', 'meridional parts'), formula +
      f('φc' + S1 + ' = ' + mi(l.mc1) + ' · φc' + S2 + ' = ' + mi(l.mc2)) +
      f('Δφc = φc' + S2 + ' − φc' + S1 + ' = ' + mi(l.dmc)));
    var ang = Math.atan2(Math.abs(l.dlon), Math.abs(l.dmc)) * Dv.R2D;
    li('Rumo', f('tg R = Δλ′ / Δφc = ' + Dv.num(l.dlon, 1) + ' / ' + Dv.num(l.dmc, 1) + ' = ' + n4(l.dlon / l.dmc)) +
      f('arctg ' + n4(Math.abs(l.dlon / l.dmc)) + ' = ' + Dv.num(ang, 1) + '°') +
      '<span class="dc-obs">Quadrante: Δφc ' + (l.dmc >= 0 ? 'positivo → N' : 'negativo → S') + '; Δλ ' + (l.dlon >= 0 ? 'para leste → E' : 'para oeste → W') + '.</span>' +
      f('R = ' + (l.dmc >= 0 ? 'N' : 'S') + ' ' + Dv.num(ang, 1) + '° ' + (l.dlon >= 0 ? 'E' : 'W') + ' = <b>' + Dv.fmtRumo(l.rumo) + '</b>'));
    var dtxt = f('d = Δφ′ / cos R = ' + Dv.num(Math.abs(l.dlat), 1) + ' / ' + n4(Math.abs(l.cosR)) + ' = <b>' + Dv.num(l.milhas, 1) + ' milhas</b>');
    if (Math.abs(l.cosR) < 0.03) dtxt += '<span class="dc-obs">Rumo quase leste–oeste: cos R é muito pequeno e um erro mínimo no rumo muda muito a distância. O app calcula d = √(Δφ′² + (q · Δλ′)²), com q = Δφ′/Δφc, que é a mesma conta sem esse problema.</span>';
    li('Distância loxodrômica', dtxt);
    return ol;
  }

  /* ---------- Mini carta de Mercator (SVG) ---------- */
  function cartaMercator() {
    var meu = ++contador;
    var W = 640, H = 380, ultimo = null;
    var svg = h('svg', { class: 'dc-carta', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Carta de Mercator com as duas derrotas' });
    var clipRect = h('rect', { x: 0, y: 0, width: W, height: H });
    svg.appendChild(h('defs', null, h('clipPath', { id: 'dc-clip-' + meu }, clipRect)));
    var g = h('g', { 'clip-path': 'url(#dc-clip-' + meu + ')' });
    svg.appendChild(g);
    var moldura = h('rect', { class: 'dc-carta-moldura', x: 0.5, y: 0.5, width: W - 1, height: H - 1 });
    svg.appendChild(moldura);
    function psi(lat) { var s = Math.sin(Math.max(-84, Math.min(84, lat)) * Dv.D2R); return 0.5 * Math.log((1 + s) / (1 - s)); }
    /* O viewBox acompanha a largura real: 1 unidade = 1 px, então o texto tem sempre o mesmo tamanho. */
    function medir() {
      var larg = svg.getBoundingClientRect().width;
      if (!larg && svg.parentNode) larg = svg.parentNode.getBoundingClientRect().width;
      W = Math.round(Math.max(300, Math.min(larg || 640, 1200)));
      H = Math.round(Math.max(240, Math.min(W * (W < 520 ? 0.78 : 0.56), 440)));
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      clipRect.setAttribute('width', W); clipRect.setAttribute('height', H);
      moldura.setAttribute('width', W - 1); moldura.setAttribute('height', H - 1);
    }

    function desenhar(a, b, o, wp) {
      ultimo = [a, b, o, wp];
      medir();
      while (g.firstChild) g.removeChild(g.firstChild);
      var orto = [], prev = a.lon, n = 120;
      for (var i = 0; i <= n; i++) {
        var p = Dv.pontoOrto(a, b, i / n);
        var lu = prev + Dv.norm180(p.lon - prev); prev = lu;
        orto.push([lu, p.lat]);
      }
      var bLon = a.lon + o.dlon;
      var lons = orto.map(function (q) { return q[0]; }), lats = orto.map(function (q) { return q[1]; });
      var x0 = Math.min.apply(null, lons), x1 = Math.max.apply(null, lons);
      var la0 = Math.min.apply(null, lats), la1 = Math.max.apply(null, lats);
      var y0 = psi(la0), y1 = psi(la1);
      var spanX = Math.max((x1 - x0) * Dv.D2R, 4 * Dv.D2R), spanY = Math.max(y1 - y0, 4 * Dv.D2R);
      var cx = (x0 + x1) / 2 * Dv.D2R, cy = (y0 + y1) / 2;
      var s = Math.min(W / (spanX * 1.3), H / (spanY * 1.45));
      var X0 = cx - W / (2 * s), Y1 = cy + H / (2 * s);
      var lonMin = X0 * Dv.R2D, lonMax = (cx + W / (2 * s)) * Dv.R2D;
      function pr(lon, lat) { return [(lon * Dv.D2R - X0) * s, (Y1 - psi(lat)) * s]; }
      function latDeY(y) { var ps = Y1 - y / s; return (2 * Math.atan(Math.exp(ps)) - Math.PI / 2) * Dv.R2D; }
      var latTop = latDeY(0), latBot = latDeY(H);
      // terra
      var land = VL.geo && (VL.geo.land50m || VL.geo.land110m);
      if (land) {
        var d = '';
        land.features.forEach(function (ft) {
          var gm = ft.geometry, polys = gm.type === 'Polygon' ? [gm.coordinates] : gm.coordinates;
          polys.forEach(function (poly) {
            var ring0 = poly[0], bx0 = 999, bx1 = -999, by0 = 999, by1 = -999;
            for (var k = 0; k < ring0.length; k++) { var c = ring0[k]; if (c[0] < bx0) bx0 = c[0]; if (c[0] > bx1) bx1 = c[0]; if (c[1] < by0) by0 = c[1]; if (c[1] > by1) by1 = c[1]; }
            if (by1 < latBot || by0 > latTop) return;
            [-360, 0, 360].forEach(function (off) {
              if (bx1 + off < lonMin || bx0 + off > lonMax) return;
              poly.forEach(function (ring) {
                for (var k2 = 0; k2 < ring.length; k2++) {
                  var q = pr(ring[k2][0] + off, ring[k2][1]);
                  d += (k2 ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1);
                }
                d += 'Z';
              });
            });
          });
        });
        if (d) g.appendChild(h('path', { class: 'dc-terra', d: d, 'fill-rule': 'evenodd' }));
      }
      // graticulado
      var spanDeg = lonMax - lonMin;
      var passo = spanDeg > 90 ? 20 : spanDeg > 40 ? 10 : spanDeg > 16 ? 5 : spanDeg > 6 ? 2 : 1;
      var gr = '';
      var rot = h('g', { class: 'dc-grat-rot' });
      var pxPasso = passo * Dv.D2R * s, cadaN = pxPasso < 56 ? Math.ceil(56 / pxPasso) : 1, kL = 0;
      for (var L = Math.ceil(lonMin / passo) * passo; L <= lonMax; L += passo) {
        var xa = pr(L, 0)[0];
        gr += 'M' + xa.toFixed(1) + ' 0V' + H;
        var Ln = Dv.norm180(L);
        if (Math.round(L / passo) % cadaN === 0 && xa > 34 && xa < W - 40) rot.appendChild(h('text', { x: xa + 4, y: H - 7 }, Math.abs(Ln) + '°' + (Ln === 0 || Math.abs(Ln) === 180 ? '' : Ln < 0 ? ' W' : ' E')));
        kL++;
      }
      var passoLat = passo;
      for (var B = Math.ceil(latBot / passoLat) * passoLat; B <= latTop; B += passoLat) {
        var ya = pr(lonMin, B)[1];
        gr += 'M0 ' + ya.toFixed(1) + 'H' + W;
        if (ya > 18 && ya < H - 24) rot.appendChild(h('text', { x: 5, y: ya - 4 }, Math.abs(B) + '°' + (B === 0 ? '' : B < 0 ? ' S' : ' N')));
      }
      g.appendChild(h('path', { class: 'dc-grat', d: gr }));
      if (latBot < 0 && latTop > 0) {
        var ye = pr(lonMin, 0)[1];
        g.appendChild(h('path', { class: 'dc-equador', d: 'M0 ' + ye.toFixed(1) + 'H' + W }));
      }
      g.appendChild(rot);
      // pontos intermediários
      if (wp) {
        var prevW = a.lon;
        wp.pontos.forEach(function (p, i) {
          if (i === 0 || i === wp.pontos.length - 1) return;
          var lu = prevW + Dv.norm180(p.lon - prevW); prevW = lu;
          var q = pr(lu, p.lat);
          g.appendChild(h('circle', { class: 'dc-wp', cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 4 }));
        });
      }
      // loxodrômica: reta na Mercator
      var pa = pr(a.lon, a.lat), pb = pr(bLon, b.lat);
      g.appendChild(h('path', { class: 'dc-lox', d: 'M' + pa[0].toFixed(1) + ' ' + pa[1].toFixed(1) + 'L' + pb[0].toFixed(1) + ' ' + pb[1].toFixed(1) }));
      // ortodrômica: curva
      g.appendChild(h('path', { class: 'dc-orto', d: orto.map(function (q, i) { var p2 = pr(q[0], q[1]); return (i ? 'L' : 'M') + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1); }).join('') }));
      // vértice
      if (o.vertice && o.vertice.naDerrota) {
        var vl = a.lon + Dv.norm180(o.vertice.lon - a.lon);
        var pv = pr(vl, o.vertice.lat);
        g.appendChild(h('path', { class: 'dc-vertice', d: 'M' + pv[0].toFixed(1) + ' ' + (pv[1] - 6).toFixed(1) + 'l6 6-6 6-6-6z' }));
        g.appendChild(h('text', { class: 'dc-rot-ponto dc-rot-vertice', x: pv[0].toFixed(1), y: (pv[1] + (o.vertice.lat >= 0 ? -12 : 24)).toFixed(1), 'text-anchor': 'middle' }, 'vértice'));
      }
      [[pa, a], [pb, b]].forEach(function (par2, i) {
        var q = par2[0];
        g.appendChild(h('circle', { class: 'dc-pt', cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 5 }));
        var nome = par2[1].curto || (i ? 'B' : 'A');
        var anc = q[0] > W * 0.7 ? 'end' : 'start';
        g.appendChild(h('text', { class: 'dc-rot-ponto', x: q[0] + (anc === 'end' ? -10 : 10), y: q[1] - 10, 'text-anchor': anc }, nome));
      });
      svg.setAttribute('aria-label', 'Carta de Mercator: a loxodrômica aparece como reta e a ortodrômica como curva voltada para o polo, de ' + (a.curto || 'A') + ' a ' + (b.curto || 'B') + '.');
    }
    return { el: svg, desenhar: desenhar, redesenhar: function () { if (ultimo) desenhar.apply(null, ultimo); }, largura: function () { return W; } };
  }

  /* ---------- Aba: ortodrômica × loxodrômica ---------- */
  function abaDerrotas(cont, est) {
    var exemplos = pernasExemplos();
    var sel = h('select', { class: 'dc-sel', 'aria-label': 'Exemplos prontos' });
    sel.appendChild(h('option', { value: '' }, 'Escolha um exemplo…'));
    exemplos.forEach(function (ex, i) {
      if (!ex.pernas.length) return;
      if (ex.pernas.length === 1) sel.appendChild(h('option', { value: i + ':0' }, ex.preset.nome));
      else {
        var og = h('optgroup', { label: ex.preset.nome });
        ex.pernas.forEach(function (pe, j) { og.appendChild(h('option', { value: i + ':' + j }, pe.a.curto + ' – ' + pe.b.curto)); });
        sel.appendChild(og);
      }
    });
    var pA = campoPonto('Partida', recalcular), pB = campoPonto('Chegada', recalcular);
    var trocar = h('button', { type: 'button', class: 'btn btn-ghost dc-trocar', onclick: function () {
      var ra = pA.ler(), rb = pB.ler();
      if (ra.erro || rb.erro) return;
      var na = est.a, nb = est.b;
      pA.set(Object.assign({}, rb.ponto, { curto: nb && nb.curto })); pB.set(Object.assign({}, ra.ponto, { curto: na && na.curto }));
      est.a = Object.assign({}, rb.ponto, { curto: nb && nb.curto }); est.b = Object.assign({}, ra.ponto, { curto: na && na.curto });
      sel.value = '';
      recalcular();
    } }, 'Trocar partida e chegada');
    var modeloSeg = segmentado('Latitudes crescidas', [{ id: 'esfera', rotulo: 'Esfera' }, { id: 'elipsoide', rotulo: 'Elipsoide (tábuas)' }], est.modelo, function (id) { est.modelo = id; recalcular(); });
    var vel = campoNumero('Velocidade média', 'nós', Dv.num(est.vel, 1), recalcular);
    var nota = h('p', { class: 'dc-nota' });
    var msg = h('p', { class: 'dc-msg', role: 'status', 'aria-live': 'polite' });
    var res = h('div', { class: 'dc-res' });
    var carta = cartaMercator();
    var cartaFig = h('figure', { class: 'dc-carta-fig' }, carta.el,
      h('figcaption', null, h('span', { class: 'dc-leg dc-leg-orto' }), T('Ortodrômica', 'great circle') + ': curva voltada para o polo. ', h('span', { class: 'dc-leg dc-leg-lox' }), T('Loxodrômica', 'rhumb line') + ': reta na carta de Mercator.'));
    var detO = h('details', { class: 'dc-det', open: true }, h('summary', null, 'Passo a passo da ' + T('ortodrômica', 'great circle')), h('div', { class: 'dc-det-corpo' }));
    var detL = h('details', { class: 'dc-det' }, h('summary', null, 'Passo a passo da ' + T('loxodrômica', 'rhumb line')), h('div', { class: 'dc-det-corpo' }));
    var passoSeg = segmentado('Intervalo de longitude', [{ id: 5, rotulo: 'a cada 5°' }, { id: 10, rotulo: 'a cada 10°' }], est.passo, function (id) { est.passo = id; recalcular(); });
    var detW = h('details', { class: 'dc-det' }, h('summary', null, 'Pontos intermediários para plotar na carta'), h('div', { class: 'dc-det-corpo' }));

    cont.appendChild(h('div', { class: 'dc-linha dc-topo' }, h('label', { class: 'dc-num dc-num-sel' }, h('span', { class: 'dc-coord-rot' }, 'Exemplo pronto'), sel), trocar));
    cont.appendChild(h('div', { class: 'dc-pontos' }, pA.el, pB.el));
    cont.appendChild(h('div', { class: 'dc-linha' }, h('div', { class: 'dc-num' }, h('span', { class: 'dc-coord-rot' }, T('Latitudes crescidas', 'meridional parts')), modeloSeg), vel.el));
    cont.appendChild(msg);
    cont.appendChild(res);
    cont.appendChild(nota);
    cont.appendChild(cartaFig);
    cont.appendChild(detO); cont.appendChild(detL); cont.appendChild(detW);
    cont.appendChild(h('p', { class: 'dc-fonte' }, 'Fórmulas: Bowditch, The American Practical Navigator (NGA Pub. 9), capítulo “The Sailings”; Miguens, Navegação: a Ciência e a Arte, vol. II (DHN). Modelo esférico: diferença em geral menor que 0,5% para o elipsoide WGS-84.'));

    sel.addEventListener('change', function () {
      if (!sel.value) return;
      var k = sel.value.split(':'), ex = exemplos[+k[0]], pe = ex.pernas[+k[1]];
      est.a = pe.a; est.b = pe.b; est.presetNota = ex.preset.nota;
      pA.set(pe.a); pB.set(pe.b);
      recalcular();
    });

    function aplicarEstado() {
      if (est.a) pA.set(est.a); if (est.b) pB.set(est.b);
      // sincroniza o seletor
      function igual(p, q) { return p && q && Math.abs(p.lat - q.lat) < 1e-6 && Math.abs(p.lon - q.lon) < 1e-6; }
      exemplos.forEach(function (ex, i) { ex.pernas.forEach(function (pe, j) { if (igual(pe.a, est.a) && igual(pe.b, est.b)) sel.value = i + ':' + j; }); });
    }

    function recalcular() {
      var ra = pA.ler(), rb = pB.ler();
      var v = vel.valor();
      res.innerHTML = '';
      nota.textContent = '';
      if (ra.erro || rb.erro) { msg.textContent = 'Confira os campos marcados.'; esconder(true); return; }
      var a = ra.ponto, b = rb.ponto;
      // mantém os nomes se os números não mudaram
      if (est.a && Math.abs(est.a.lat - a.lat) < 1e-6 && Math.abs(est.a.lon - a.lon) < 1e-6) a.curto = est.a.curto; else { pA.semNome(); est.presetNota = null; sel.value = ''; }
      if (est.b && Math.abs(est.b.lat - b.lat) < 1e-6 && Math.abs(est.b.lon - b.lon) < 1e-6) b.curto = est.b.curto; else { pB.semNome(); est.presetNota = null; sel.value = ''; }
      est.a = a; est.b = b;
      var erro = Dv.validarPar(a, b);
      if (erro) { msg.textContent = erro; esconder(true); return; }
      msg.textContent = '';
      esconder(false);
      var o = Dv.ortodromica(a, b), l = Dv.loxodromica(a, b, est.modelo);
      var velOk = isFinite(v) && v > 0 && v <= 60;
      if (isFinite(v) && v > 0) est.vel = v;
      var dif = l.milhas - o.milhas, pct = dif / o.milhas * 100;
      function card(classe, titulo, dist, linhas) {
        var dl = h('dl', { class: 'dc-kv' });
        linhas.forEach(function (x) { dl.appendChild(h('dt', null, x[0])); dl.appendChild(h('dd', { html: x[1] })); });
        return h('section', { class: 'dc-card ' + classe }, h('h3', null, titulo), h('p', { class: 'dc-big' }, Dv.num(dist, dist >= 100 ? 0 : 1), h('span', { class: 'dc-big-un' }, ' milhas')), dl);
      }
      var vtx = o.vertice ? (o.vertice.naDerrota ? ptHtml(o.vertice) : 'fora do trecho') : (o.equador ? 'sem vértice (Equador)' : '—');
      res.appendChild(card('dc-card-orto', T('Ortodrômica', 'great circle'), o.milhas, [
        ['Rumo inicial', Dv.fmtRumo(o.rumoInicial) + ' <span class="dc-q">' + Dv.quadrantal(o.rumoInicial) + '</span>'],
        ['Rumo final', Dv.fmtRumo(o.rumoFinal)],
        [T('Vértice', 'vertex'), vtx],
        ['Tempo', velOk ? Dv.fmtDuracao(o.milhas / v) : '—'],
      ]));
      res.appendChild(card('dc-card-lox', T('Loxodrômica', 'rhumb line'), l.milhas, [
        ['Rumo constante', Dv.fmtRumo(l.rumo) + ' <span class="dc-q">' + Dv.quadrantal(l.rumo) + '</span>'],
        ['Δφ · Δλ', mi(l.dlat) + ' · ' + mi(l.dlon)],
        ['Modelo', est.modelo === 'elipsoide' ? 'elipsoide WGS-84' : 'esfera'],
        ['Tempo', velOk ? Dv.fmtDuracao(l.milhas / v) : '—'],
      ]));
      var resumo;
      if (Math.abs(dif) < 0.05) resumo = 'As duas derrotas têm praticamente a mesma distância (diferença menor que 0,1 milha).';
      else if (dif > 0) resumo = 'A loxodrômica é <b>' + Dv.num(dif, dif < 10 ? 1 : 0) + ' milhas mais longa</b> (' + Dv.num(pct, pct < 1 ? 2 : 1) + '%)' + (velOk ? ', cerca de ' + Dv.fmtDuracao(dif / v) + ' a mais a ' + Dv.num(v, 1) + ' nós.' : '.');
      else resumo = 'Com o elipsoide, a loxodrômica deu ' + Dv.num(-dif, 1) + ' milha(s) a menos que a ortodrômica calculada na esfera: é efeito de misturar os dois modelos, não um atalho real.';
      res.appendChild(h('p', { class: 'dc-resumo', html: resumo + (velOk ? '' : ' <span class="dc-erro-campo">Velocidade inválida: use um número entre 0,1 e 60 nós.</span>') }));
      if (est.presetNota) nota.textContent = est.presetNota;
      var wp = Dv.pontosIntermediarios(a, b, est.passo);
      carta.desenhar(a, b, o, detW.open ? wp : null);
      var cO = detO.querySelector('.dc-det-corpo'), cL = detL.querySelector('.dc-det-corpo'), cW = detW.querySelector('.dc-det-corpo');
      cO.innerHTML = ''; cO.appendChild(passosOrto(a, b, o));
      cL.innerHTML = ''; cL.appendChild(passosLox(a, b, l));
      cW.innerHTML = '';
      cW.appendChild(h('p', null, 'Na carta de Mercator a ortodrômica é uma curva. Para segui-la, calcule pontos dela em longitudes redondas e navegue em linha reta (rumo constante) entre eles.'));
      cW.appendChild(h('p', { html: f('tg φ = tg φv · cos(λ − λv)') }));
      cW.appendChild(passoSeg);
      if (!wp || wp.pontos.length <= 2) {
        cW.appendChild(h('p', { class: 'dc-obs' }, Math.abs(o.dlon) < est.passo ? 'A diferença de longitude é menor que o intervalo escolhido: não há pontos intermediários. Navegue pela loxodrômica.' : 'Não foi possível calcular pontos intermediários para esta derrota (ela segue um meridiano ou o Equador).'));
      } else {
        var tb = h('tbody');
        wp.pontos.forEach(function (p, i) {
          tb.appendChild(h('tr', null, h('td', null, i === 0 ? 'partida' : i === wp.pontos.length - 1 ? 'chegada' : String(i)), h('td', null, Dv.gm(p.lat, 'lat')), h('td', null, Dv.gm(p.lon, 'lon')),
            h('td', null, p.rumoProx != null ? Dv.fmtRumo(p.rumoProx) : ''), h('td', null, p.distProx != null ? Dv.num(p.distProx, 1) : '')));
        });
        cW.appendChild(h('div', { class: 'table-wrap' }, h('table', { class: 'tabela dc-tab' },
          h('thead', null, h('tr', null, h('th', null, 'Ponto'), h('th', null, 'Latitude'), h('th', null, 'Longitude'), h('th', null, 'Rumo até o próximo'), h('th', null, 'Milhas'))), tb)));
        cW.appendChild(h('p', { class: 'dc-obs' }, 'Soma das pernas: ' + Dv.num(wp.somaLox, 1) + ' milhas, contra ' + Dv.num(wp.orto, 1) + ' da ortodrômica pura e ' + Dv.num(Dv.loxodromica(a, b, 'esfera').milhas, 1) + ' da loxodrômica direta.'));
      }
    }
    detW.addEventListener('toggle', function () { if (detW.open) recalcular(); });
    if (est.ro) { est.ro.disconnect(); est.ro = null; }
    if (window.ResizeObserver) {
      var largAnt = 0;
      est.ro = new ResizeObserver(function (ents) {
        var w = ents[0].contentRect.width;
        if (Math.abs(w - largAnt) > 8) { largAnt = w; if (!cartaFig.hidden) carta.redesenhar(); }
      });
      est.ro.observe(cartaFig);
    }
    function esconder(sim) { [cartaFig, detO, detL, detW].forEach(function (x) { x.hidden = sim; }); }
    aplicarEstado();
    recalcular();
  }

  /* ---------- Aba: navegação estimada (latitude média) ---------- */
  function abaEstima(cont, est) {
    var modo = est.modoEstima || 'chegada';
    var seg = segmentado('O que calcular', [{ id: 'chegada', rotulo: 'Ponto de chegada' }, { id: 'rumo', rotulo: 'Rumo e distância' }], modo, function (id) { est.modoEstima = id; desenhar(); });
    var area = h('div', { class: 'dc-estima' });
    cont.appendChild(h('p', { class: 'dc-intro' }, 'A ', h('b', null, T('navegação estimada', 'dead reckoning')), ' pela ', T('latitude média', 'mid-latitude sailing'), ' trata um trecho curto do mar como se fosse plano. Serve bem até umas 600 milhas, longe dos polos; para mais que isso, use a loxodrômica.'));
    cont.appendChild(seg);
    cont.appendChild(area);
    cont.appendChild(h('p', { class: 'dc-fonte' }, 'Método da latitude média: Bowditch, Pub. 9, “The Sailings” (mid-latitude sailing); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN).'));

    function desenhar() {
      area.innerHTML = '';
      if ((est.modoEstima || 'chegada') === 'chegada') chegada(); else rumoDist();
    }
    function chegada() {
      var p = campoPonto('Partida', calc);
      var rumo = campoNumero('Rumo verdadeiro', '°', est.eRumo != null ? Dv.num(est.eRumo, 0) : '045', calc);
      var forma = est.eForma || 'vt';
      var dist = campoNumero('Distância', 'milhas', est.eDist != null ? Dv.num(est.eDist, 1) : '', calc);
      var velo = campoNumero('Velocidade', 'nós', est.eVel != null ? Dv.num(est.eVel, 1) : '6', calc);
      var tempo = campoNumero('Tempo', 'horas', est.eTempo != null ? Dv.num(est.eTempo, 1) : '12', calc);
      var vtBox = h('div', { class: 'dc-linha' }, velo.el, tempo.el), dBox = h('div', { class: 'dc-linha' }, dist.el);
      var formaSeg = segmentado('Como informar a distância', [{ id: 'vt', rotulo: 'Velocidade e tempo' }, { id: 'd', rotulo: 'Distância' }], forma, function (id) { est.eForma = id; forma = id; vtBox.hidden = id !== 'vt'; dBox.hidden = id !== 'd'; calc(); });
      vtBox.hidden = forma !== 'vt'; dBox.hidden = forma !== 'd';
      var out = h('div', { class: 'dc-saida', 'aria-live': 'polite' });
      area.appendChild(h('div', { class: 'dc-pontos dc-pontos-1' }, p.el, h('fieldset', { class: 'dc-ponto' }, h('legend', null, 'Rumo e distância'), rumo.el, formaSeg, vtBox, dBox)));
      area.appendChild(out);
      p.set(est.ePartida || { lat: -(23 + 0 / 60), lon: -(43 + 10 / 60) });
      function calc() {
        out.innerHTML = '';
        var rp = p.ler(); if (rp.erro) return;
        var R = rumo.valor();
        if (!isFinite(R) || R < 0 || R >= 360) { out.appendChild(h('p', { class: 'dc-msg' }, 'Rumo: de 000° a 359,9°.')); return; }
        var d;
        if (forma === 'vt') {
          var vv = velo.valor(), tt = tempo.valor();
          if (!isFinite(vv) || vv <= 0 || vv > 60) { out.appendChild(h('p', { class: 'dc-msg' }, 'Velocidade: de 0,1 a 60 nós.')); return; }
          if (!isFinite(tt) || tt <= 0 || tt > 2000) { out.appendChild(h('p', { class: 'dc-msg' }, 'Tempo: horas, maior que zero (ex.: 7,5 para 7 h 30 min).')); return; }
          d = vv * tt; est.eVel = vv; est.eTempo = tt;
        } else {
          d = dist.valor();
          if (!isFinite(d) || d <= 0 || d > 6000) { out.appendChild(h('p', { class: 'dc-msg' }, 'Distância: de 0,1 a 6.000 milhas.')); return; }
          est.eDist = d;
        }
        est.ePartida = rp.ponto; est.eRumo = R;
        var e = Dv.estima(rp.ponto, R, d);
        if (e.erro) { out.appendChild(h('p', { class: 'dc-msg' }, e.erro)); return; }
        out.appendChild(h('div', { class: 'dc-destaque' }, h('span', { class: 'dc-coord-rot' }, 'Posição estimada de chegada'), h('p', { class: 'dc-big dc-big-pos', html: ptHtml(e.chegada) })));
        var ol = h('ol', { class: 'dc-passos' });
        function li(t, html) { ol.appendChild(h('li', null, h('strong', null, t), h('div', { html: html }))); }
        if (forma === 'vt') li('Distância navegada', f('d = velocidade × tempo = ' + Dv.num(est.eVel, 1) + ' nós × ' + Dv.num(est.eTempo, 2) + ' h = ' + Dv.num(d, 1) + ' milhas'));
        li('Diferença de latitude', f('Δφ = d · cos R = ' + Dv.num(d, 1) + ' · ' + par(Math.cos(R * Dv.D2R)) + ' = ' + mi(e.dlat) + ' (' + (e.dlat >= 0 ? 'N' : 'S') + ')') +
          f('φ' + S2 + ' = φ' + S1 + ' + Δφ = ' + somaCoord(rp.ponto.lat, e.dlat, e.lat2, 'lat')) +
          (Math.abs(rp.ponto.lat) > 1e-9 && (rp.ponto.lat < 0) !== (e.dlat < 0) ? '<span class="dc-obs">Indo para o ' + (e.dlat >= 0 ? 'norte com latitude sul' : 'sul com latitude norte') + ', o barco se aproxima do Equador e a latitude diminui: subtraia.</span>' : ''));
        li(T('Apartamento', 'departure'), f('ap = d · sen R = ' + Dv.num(d, 1) + ' · ' + par(Math.sin(R * Dv.D2R)) + ' = ' + Dv.num(e.ap, 1) + ' milhas' + (Math.abs(e.ap) < 0.05 ? ' (sem deslocamento leste–oeste)' : ' (' + (e.ap >= 0 ? 'para leste' : 'para oeste') + ')')) +
          '<span class="dc-obs">O apartamento é a distância leste–oeste em milhas. Para virar diferença de longitude, divide-se pelo cosseno da latitude média, porque os meridianos se aproximam em direção aos polos.</span>');
        li('Latitude média e diferença de longitude', f('φm = (φ' + S1 + ' + φ' + S2 + ') / 2 = ' + gd(e.latm, 3)) +
          f('Δλ = ap / cos φm = ' + Dv.num(e.ap, 1) + ' / ' + n4(Math.cos(e.latm * Dv.D2R)) + ' = ' + mi(e.dlon)) +
          f('λ' + S2 + ' = λ' + S1 + ' + Δλ = ' + somaCoord(rp.ponto.lon, e.dlon, e.chegada.lon, 'lon')));
        out.appendChild(ol);
        var cmp = 'Pela loxodrômica exata (latitudes crescidas) a chegada seria ' + Dv.fmtPonto(e.exata) + ', a ' + Dv.num(e.erroMilhas, 2) + ' milha(s) desta.';
        out.appendChild(h('p', { class: 'dc-obs' }, cmp));
        if (d > 600) out.appendChild(VL.ui.callout('seguranca', 'Distância grande para a estima plana', 'Com ' + Dv.num(d, 0) + ' milhas, o método da latitude média começa a errar. Para planejar, use a loxodrômica ou a ortodrômica na aba Derrotas.'));
      }
      calc();
    }
    function rumoDist() {
      var pA = campoPonto('Ponto A', calc), pB = campoPonto('Ponto B', calc);
      var out = h('div', { class: 'dc-saida', 'aria-live': 'polite' });
      area.appendChild(h('div', { class: 'dc-pontos' }, pA.el, pB.el));
      area.appendChild(out);
      pA.set(est.iA || { lat: -(8 + 3 / 60), lon: -(34 + 50 / 60) });
      pB.set(est.iB || { lat: -(3 + 49 / 60), lon: -(32 + 24 / 60) });
      function calc() {
        out.innerHTML = '';
        var ra = pA.ler(), rb = pB.ler(); if (ra.erro || rb.erro) return;
        var erro = Dv.validarPar(ra.ponto, rb.ponto); if (erro) { out.appendChild(h('p', { class: 'dc-msg' }, erro)); return; }
        est.iA = ra.ponto; est.iB = rb.ponto;
        var e = Dv.estimaInversa(ra.ponto, rb.ponto), l = Dv.loxodromica(ra.ponto, rb.ponto, 'esfera');
        out.appendChild(h('div', { class: 'dc-destaque' }, h('span', { class: 'dc-coord-rot' }, 'Rumo e distância pela latitude média'), h('p', { class: 'dc-big' }, Dv.fmtRumo(e.rumo) + ' · ' + Dv.num(e.milhas, 1) + ' milhas')));
        var ol = h('ol', { class: 'dc-passos' });
        function li(t, html) { ol.appendChild(h('li', null, h('strong', null, t), h('div', { html: html }))); }
        li('Diferenças', f('Δφ = ' + mi(e.dlat) + ' · Δλ = ' + mi(e.dlon)) + f('φm = ' + gd(e.latm, 3)));
        li(T('Apartamento', 'departure'), f('ap = Δλ′ · cos φm = ' + Dv.num(e.dlon, 1) + ' · ' + n4(Math.cos(e.latm * Dv.D2R)) + ' = ' + Dv.num(e.ap, 1) + ' milhas'));
        var ang = Math.atan2(Math.abs(e.ap), Math.abs(e.dlat)) * Dv.R2D;
        li('Rumo', f('tg R = ap / Δφ′ = ' + Dv.num(e.ap, 1) + ' / ' + Dv.num(e.dlat, 1) + ' → R = ' + (e.dlat >= 0 ? 'N' : 'S') + ' ' + Dv.num(ang, 1) + '° ' + (e.ap >= 0 ? 'E' : 'W') + ' = ' + Dv.fmtRumo(e.rumo)));
        li('Distância', f('d = √(Δφ′² + ap²) = √(' + Dv.num(e.dlat, 1) + '² + ' + Dv.num(e.ap, 1) + '²) = ' + Dv.num(e.milhas, 1) + ' milhas'));
        out.appendChild(ol);
        out.appendChild(h('p', { class: 'dc-obs' }, 'Loxodrômica exata: ' + Dv.fmtRumo(l.rumo) + ' · ' + Dv.num(l.milhas, 1) + ' milhas (diferença de ' + Dv.num(Math.abs(l.milhas - e.milhas), 2) + ' milha).'));
        if (e.milhas > 600) out.appendChild(VL.ui.callout('seguranca', 'Pontos muito distantes', 'Acima de umas 600 milhas, a latitude média deixa de ser boa aproximação. Use a aba Derrotas.'));
      }
      calc();
    }
    desenhar();
  }

  /* ---------- Aba: conversões ---------- */
  function abaConversoes(cont, est) {
    // coordenadas
    var tipo = est.cTipo || 'lat';
    var cIn = h('input', { type: 'text', class: 'dc-in dc-in-livre', 'aria-label': 'Coordenada em qualquer formato', value: est.cTxt || '13° 00,6′ S', autocomplete: 'off', spellcheck: 'false' });
    var cOut = h('div', { class: 'dc-conv-saida', 'aria-live': 'polite' });
    var tipoSeg = segmentado('Tipo de coordenada', [{ id: 'lat', rotulo: 'Latitude' }, { id: 'lon', rotulo: 'Longitude' }], tipo, function (id) { tipo = id; est.cTipo = id; coord(); });
    cIn.addEventListener('input', coord);
    function coord() {
      est.cTxt = cIn.value;
      var r = Dv.lerCoord(cIn.value, tipo);
      cOut.innerHTML = '';
      if (r.erro) { cOut.appendChild(h('p', { class: 'dc-msg' }, r.erro)); return; }
      var v = r.valor;
      [['Graus, minutos e décimos', Dv.gm(v, tipo, 1)], ['Graus, minutos e segundos', Dv.gms(v, tipo)], ['Graus decimais', Dv.num(v, 5) + '°'], [tipo === 'lat' ? 'Minutos de arco desde o Equador' : 'Minutos de arco desde Greenwich', Dv.num(Math.abs(v) * 60, 1) + '′' + (tipo === 'lat' ? ' = ' + Dv.num(Math.abs(v) * 60, 1) + ' milhas' : '')]].forEach(function (x) {
        cOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, x[0]), h('span', { class: 'dc-conv-v' }, x[1])));
      });
    }
    var sec1 = h('section', { class: 'dc-conv' }, h('h3', null, 'Coordenadas'),
      h('p', { class: 'dc-obs' }, 'Aceita 13° 00,6′ S · 13 00.6 S · −13,01 · 13 00 36 S · 038 32 W (ou O). Na navegação o padrão é graus, minutos e décimos de minuto.'),
      h('div', { class: 'dc-linha' }, tipoSeg), h('label', { class: 'dc-num dc-num-largo' }, h('span', { class: 'dc-coord-rot' }, 'Coordenada'), cIn), cOut);

    // distâncias
    var UNI_D = [{ id: 'M', rotulo: 'milhas náuticas', m: 1852 }, { id: 'km', rotulo: 'quilômetros', m: 1000 }, { id: 'mi', rotulo: 'milhas terrestres', m: 1609.344 }, { id: 'm', rotulo: 'metros', m: 1 }];
    var dIn = campoNumero('Valor', '', est.dVal || '100', convD);
    var dSel = h('select', { class: 'dc-sel', 'aria-label': 'Unidade de distância' }, UNI_D.map(function (u) { return h('option', { value: u.id }, u.rotulo); }));
    dSel.value = est.dUni || 'M';
    dSel.addEventListener('change', convD);
    var dOut = h('div', { class: 'dc-conv-saida', 'aria-live': 'polite' });
    function convD() {
      est.dVal = dIn.inp.value; est.dUni = dSel.value;
      dOut.innerHTML = '';
      var v = dIn.valor();
      if (!isFinite(v) || v < 0) { dOut.appendChild(h('p', { class: 'dc-msg' }, 'Digite um número (use vírgula para decimais).')); return; }
      var u = UNI_D.filter(function (x) { return x.id === dSel.value; })[0];
      var metros = v * u.m;
      UNI_D.forEach(function (x) { if (x.id !== u.id) dOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, x.rotulo), h('span', { class: 'dc-conv-v' }, Dv.num(metros / x.m, metros / x.m >= 1000 ? 0 : 2)))); });
    }
    var sec2 = h('section', { class: 'dc-conv' }, h('h3', null, 'Distâncias'),
      h('p', { class: 'dc-obs' }, '1 milha náutica = 1.852 m (exatos) = 1 minuto de latitude. A milha terrestre (1.609,344 m) não se usa no mar.'),
      h('div', { class: 'dc-linha' }, dIn.el, h('label', { class: 'dc-num' }, h('span', { class: 'dc-coord-rot' }, 'Unidade'), dSel)), dOut);

    // velocidades
    var UNI_V = [{ id: 'kn', rotulo: 'nós', ms: 1852 / 3600 }, { id: 'kmh', rotulo: 'km/h', ms: 1 / 3.6 }, { id: 'ms', rotulo: 'm/s', ms: 1 }];
    var vIn = campoNumero('Valor', '', est.vVal || '6', convV);
    var vSel = h('select', { class: 'dc-sel', 'aria-label': 'Unidade de velocidade' }, UNI_V.map(function (u) { return h('option', { value: u.id }, u.rotulo); }));
    vSel.value = est.vUni || 'kn';
    vSel.addEventListener('change', convV);
    var vOut = h('div', { class: 'dc-conv-saida', 'aria-live': 'polite' });
    function convV() {
      est.vVal = vIn.inp.value; est.vUni = vSel.value;
      vOut.innerHTML = '';
      var v = vIn.valor();
      if (!isFinite(v) || v < 0) { vOut.appendChild(h('p', { class: 'dc-msg' }, 'Digite um número (use vírgula para decimais).')); return; }
      var u = UNI_V.filter(function (x) { return x.id === vSel.value; })[0];
      var ms = v * u.ms;
      UNI_V.forEach(function (x) { if (x.id !== u.id) vOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, x.rotulo), h('span', { class: 'dc-conv-v' }, Dv.num(ms / x.ms, 2)))); });
      var nos = ms / UNI_V[0].ms;
      vOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, 'milhas por dia (24 h)'), h('span', { class: 'dc-conv-v' }, Dv.num(nos * 24, 0))));
    }
    var sec3 = h('section', { class: 'dc-conv' }, h('h3', null, 'Velocidades'),
      h('p', { class: 'dc-obs' }, '1 nó = 1 milha náutica por hora = 1,852 km/h. “Nós por hora” não existe: o nó já é uma velocidade.'),
      h('div', { class: 'dc-linha' }, vIn.el, h('label', { class: 'dc-num' }, h('span', { class: 'dc-coord-rot' }, 'Unidade'), vSel)), vOut);

    // tempo de viagem
    var tD = campoNumero('Distância', 'milhas', est.tD || '2.700', convT), tV = campoNumero('Velocidade média', 'nós', est.tV || '6', convT);
    var tS = h('input', { type: 'datetime-local', class: 'dc-in dc-in-data', 'aria-label': 'Data e hora de saída (opcional)', value: est.tS || '' });
    tS.addEventListener('input', convT);
    var tOut = h('div', { class: 'dc-conv-saida', 'aria-live': 'polite' });
    function convT() {
      est.tD = tD.inp.value; est.tV = tV.inp.value; est.tS = tS.value;
      tOut.innerHTML = '';
      var d = tD.valor(), v = tV.valor();
      if (!isFinite(d) || d <= 0) { tOut.appendChild(h('p', { class: 'dc-msg' }, 'Distância: número maior que zero.')); return; }
      if (!isFinite(v) || v <= 0 || v > 60) { tOut.appendChild(h('p', { class: 'dc-msg' }, 'Velocidade: de 0,1 a 60 nós.')); return; }
      var horas = d / v;
      tOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, 'Tempo = distância ÷ velocidade'), h('span', { class: 'dc-conv-v' }, Dv.num(horas, 1) + ' h = ' + Dv.fmtDuracao(horas))));
      tOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, 'Singradura (milhas em 24 h)'), h('span', { class: 'dc-conv-v' }, Dv.num(v * 24, 0) + ' milhas')));
      if (tS.value) {
        var dt = new Date(tS.value);
        if (!isNaN(dt.getTime())) {
          var ch = new Date(dt.getTime() + horas * 3600e3);
          tOut.appendChild(h('div', { class: 'dc-conv-item' }, h('span', { class: 'dc-coord-rot' }, 'Chegada estimada (mesmo fuso da saída)'), h('span', { class: 'dc-conv-v' }, ch.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }))));
        }
      }
    }
    var sec4 = h('section', { class: 'dc-conv' }, h('h3', null, 'Tempo de viagem'),
      h('p', { class: 'dc-obs' }, 'Use a velocidade média real da travessia (com calmarias e mar contra), não a velocidade máxima do barco.'),
      h('div', { class: 'dc-linha' }, tD.el, tV.el, h('label', { class: 'dc-num' }, h('span', { class: 'dc-coord-rot' }, 'Saída (opcional)'), tS)), tOut);

    cont.appendChild(h('div', { class: 'dc-conv-grade' }, sec1, sec2, sec3, sec4));
    coord(); convD(); convV(); convT();
  }

  /* ---------- Aba: exercícios ---------- */
  var TIPOS_EX = [
    { id: 'orto', rotulo: 'Ortodrômica' }, { id: 'lox', rotulo: 'Loxodrômica' }, { id: 'estima', rotulo: 'Estima' },
    { id: 'conv', rotulo: 'Conversões' }, { id: 'tempo', rotulo: 'Tempo de viagem' }, { id: 'mix', rotulo: 'Misturar' },
  ];
  function sorteia(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function aleat(a, b) { return a + Math.random() * (b - a); }
  function redMin(x) { return Math.round(x * 60) / 60; } // arredonda para minuto inteiro
  function portosEx() {
    var P2 = Dv.pontos;
    return [P2.salvador, P2.recife, P2.noronha, P2.natal, P2.mindelo, P2.lasPalmas, P2.rodney, P2.granada, P2.rio, P2.cabo, P2.antigua, P2.bermudas, P2.horta, P2.lisboa, P2.fortaleza, P2.tobago];
  }
  function parAleatorio(min, max) {
    // sem a geografia carregada não dá para conferir se o ponto está no mar: usa só os portos
    var semGeo = Dv.naTerra(0, 0) === null;
    for (var t = 0; t < 200; t++) {
      var a, b;
      if (semGeo || Math.random() < 0.5) { var ps = portosEx(); a = sorteia(ps); b = sorteia(ps); }
      else {
        var caixas = [[15, 45, -65, -15], [-40, -5, -40, 10], [-10, 20, -50, -20]];
        var c1 = sorteia(caixas), c2 = sorteia(caixas);
        a = { lat: redMin(aleat(c1[0], c1[1])), lon: redMin(aleat(c1[2], c1[3])) };
        b = { lat: redMin(aleat(c2[0], c2[1])), lon: redMin(aleat(c2[2], c2[3])) };
      }
      if (a === b) continue;
      var d = Dv.milhasEntre(a, b);
      if (!(d >= min && d <= max && Math.abs(a.lat - b.lat) > 0.5)) continue;
      if (!semGeo && (Dv.naTerra(a.lat, a.lon) || Dv.naTerra(b.lat, b.lon))) continue;
      if (!semGeo && (Dv.cruzaTerra(a, b, 'orto') > 0 || Dv.cruzaTerra(a, b, 'lox') > 0)) continue;
      return [a, b];
    }
    return [Dv.pontos.rio, Dv.pontos.cabo];
  }
  function nomeP(p) { return p.curto ? p.curto + ' (' + Dv.fmtPonto(p) + ')' : Dv.fmtPonto(p); }

  function gerarExercicio(tipo) {
    if (tipo === 'mix') tipo = sorteia(['orto', 'lox', 'estima', 'conv', 'tempo']);
    var ex = { tipo: tipo };
    if (tipo === 'orto' || tipo === 'lox') {
      var pr = parAleatorio(250, 3600);
      var a = pr[0], b = pr[1];
      var o = Dv.ortodromica(a, b), lE = Dv.loxodromica(a, b, 'esfera'), lT = Dv.loxodromica(a, b, 'elipsoide');
      ex.a = a; ex.b = b; ex.o = o; ex.lE = lE;
      if (tipo === 'orto') {
        ex.enunciado = 'Calcule a distância ortodrômica e o rumo inicial de <b>' + esc(nomeP(a)) + '</b> para <b>' + esc(nomeP(b)) + '</b>.';
        ex.campos = [
          { id: 'd', rotulo: 'Distância', un: 'milhas', certo: [o.milhas], tol: function (c) { return Math.max(2, c * 0.01); }, fmt: function (c) { return Dv.num(c, 1) + ' milhas'; } },
          { id: 'r', rotulo: 'Rumo inicial', un: '°', certo: [o.rumoInicial], angulo: true, tolAbs: 1, fmt: function (c) { return Dv.fmtRumo(c); } },
        ];
        ex.solucao = function () { return passosOrto(a, b, o); };
      } else {
        ex.enunciado = 'Calcule o rumo e a distância pela loxodrômica de <b>' + esc(nomeP(a)) + '</b> para <b>' + esc(nomeP(b)) + '</b>.';
        ex.campos = [
          { id: 'r', rotulo: 'Rumo', un: '°', certo: [lE.rumo, lT.rumo], angulo: true, tolAbs: 1, fmt: function (c) { return Dv.fmtRumo(c); } },
          { id: 'd', rotulo: 'Distância', un: 'milhas', certo: [lE.milhas, lT.milhas], tol: function (c) { return Math.max(2, c * 0.01); }, fmt: function (c) { return Dv.num(c, 1) + ' milhas'; } },
        ];
        ex.nota = 'Vale a resposta pela esfera ou pela tábua de latitudes crescidas (elipsoide).';
        ex.solucao = function () { return passosLox(a, b, lE); };
      }
    } else if (tipo === 'estima') {
      var p0 = { lat: redMin(aleat(-30, 30)), lon: redMin(aleat(-45, -20)) };
      var R = Math.round(aleat(0, 359));
      var v = Math.round(aleat(8, 16)) / 2, t = Math.round(aleat(6, 30));
      var d = v * t, e = Dv.estima(p0, R, d);
      ex.enunciado = 'Às 08h00 o barco estava em <b>' + Dv.fmtPonto(p0) + '</b>. Navegou no rumo verdadeiro <b>' + Dv.fmtRumo(R, 0) + '</b> a <b>' + Dv.num(v, 1) + ' nós</b> durante <b>' + t + ' horas</b>, sem corrente nem abatimento. Qual a posição estimada?';
      ex.campos = [
        { id: 'lat', rotulo: 'Latitude', coord: 'lat', certo: [e.chegada.lat, e.exata.lat], tolAbs: 1.5 / 60, fmt: function (c) { return Dv.gm(c, 'lat'); } },
        { id: 'lon', rotulo: 'Longitude', coord: 'lon', certo: [e.chegada.lon, e.exata.lon], tolAbs: 1.5 / 60, fmt: function (c) { return Dv.gm(c, 'lon'); } },
      ];
      ex.nota = 'Tolerância de 1,5′ em cada coordenada.';
      ex.solucao = function () {
        var ol = h('ol', { class: 'dc-passos' });
        function li(tt, html) { ol.appendChild(h('li', null, h('strong', null, tt), h('div', { html: html }))); }
        li('Distância', f('d = ' + Dv.num(v, 1) + ' × ' + t + ' = ' + Dv.num(d, 1) + ' milhas'));
        li('Δφ e apartamento', f('Δφ = d · cos R = ' + mi(e.dlat)) + f('ap = d · sen R = ' + Dv.num(e.ap, 1) + ' milhas'));
        li('Latitude de chegada', f('φ' + S2 + ' = ' + somaCoord(p0.lat, e.dlat, e.lat2, 'lat')));
        li('Longitude de chegada', f('φm = ' + gd(e.latm, 3) + ' · Δλ = ap / cos φm = ' + mi(e.dlon)) + f('λ' + S2 + ' = ' + somaCoord(p0.lon, e.dlon, e.chegada.lon, 'lon')));
        return ol;
      };
    } else if (tipo === 'conv') {
      var k = sorteia(['dec-gm', 'gm-dec', 'km-M', 'kn-kmh']);
      if (k === 'dec-gm') {
        var x = Math.round(aleat(1, 89) * 10000) / 10000;
        ex.enunciado = 'Escreva a latitude <b>' + Dv.num(x, 4) + '° S</b> em graus, minutos e décimos de minuto.';
        ex.campos = [{ id: 'lat', rotulo: 'Latitude', coord: 'lat', certo: [-x], tolAbs: 0.1 / 60 + 1e-9, fmt: function (c) { return Dv.gm(c, 'lat'); } }];
        ex.solucao = function () { var g = Math.floor(x), m = (x - g) * 60; return h('div', { html: f('graus = ' + g + '°') + f('minutos = 0,' + String(Math.round((x - g) * 10000)).padStart(4, '0') + ' × 60 = ' + Dv.num(m, 2) + '′') + f('→ ' + Dv.gm(-x, 'lat')) }); };
      } else if (k === 'gm-dec') {
        var gg = Math.round(aleat(1, 179)), mm = Math.round(aleat(0, 599)) / 10;
        var val = gg + mm / 60;
        ex.enunciado = 'Escreva a longitude <b>' + Dv.gm(-val, 'lon') + '</b> em graus decimais (W negativa).';
        ex.campos = [{ id: 'x', rotulo: 'Graus decimais', un: '°', certo: [-val], tolAbs: 0.0006, fmt: function (c) { return Dv.num(c, 4) + '°'; } }];
        ex.solucao = function () { return h('div', { html: f(gg + ' + ' + Dv.num(mm, 1) + ' / 60 = ' + Dv.num(val, 4) + '°') + f('Oeste → ' + Dv.num(-val, 4) + '°') }); };
      } else if (k === 'km-M') {
        var km = Math.round(aleat(20, 900));
        ex.enunciado = 'Quantas milhas náuticas são <b>' + km + ' km</b>?';
        ex.campos = [{ id: 'x', rotulo: 'Distância', un: 'milhas', certo: [km / 1.852], tolAbs: 0.15, fmt: function (c) { return Dv.num(c, 1) + ' milhas'; } }];
        ex.solucao = function () { return h('div', { html: f(km + ' km ÷ 1,852 = ' + Dv.num(km / 1.852, 2) + ' milhas') }); };
      } else {
        var kn = Math.round(aleat(8, 30)) / 2;
        ex.enunciado = 'Um barco faz <b>' + Dv.num(kn, 1) + ' nós</b>. Quanto é isso em km/h?';
        ex.campos = [{ id: 'x', rotulo: 'Velocidade', un: 'km/h', certo: [kn * 1.852], tolAbs: 0.1, fmt: function (c) { return Dv.num(c, 2) + ' km/h'; } }];
        ex.solucao = function () { return h('div', { html: f(Dv.num(kn, 1) + ' × 1,852 = ' + Dv.num(kn * 1.852, 2) + ' km/h') }); };
      }
    } else {
      var pr2 = sorteia(Dv.presets.filter(function (p) { return p.pontos.length === 2 || p.id === 'arc'; }));
      var tot = 0; for (var i = 0; i < pr2.pontos.length - 1; i++) tot += Dv.milhasEntre(pr2.pontos[i], pr2.pontos[i + 1]);
      tot = Math.round(tot);
      var vel = Math.round(aleat(8, 14)) / 2;
      var horas = tot / vel;
      ex.enunciado = 'A travessia <b>' + esc(pr2.nome) + '</b> tem cerca de <b>' + Dv.num(tot, 0) + ' milhas</b>. A uma média de <b>' + Dv.num(vel, 1) + ' nós</b>, quanto tempo leva? Responda em dias e horas.';
      ex.campos = [
        { id: 'dias', rotulo: 'Dias', un: 'dias', inteiro: true },
        { id: 'horas', rotulo: 'Horas', un: 'h' },
      ];
      ex.composto = { certo: horas, tolAbs: 1, fmt: function () { return Dv.fmtDuracao(horas) + ' (' + Dv.num(horas, 1) + ' h)'; } };
      ex.solucao = function () { return h('div', { html: f('t = ' + Dv.num(tot, 0) + ' ÷ ' + Dv.num(vel, 1) + ' = ' + Dv.num(horas, 1) + ' h') + f(Dv.num(horas, 1) + ' h ÷ 24 = ' + Math.floor(horas / 24) + ' dias e ' + Dv.num(horas - 24 * Math.floor(horas / 24), 1) + ' h') }); };
    }
    return ex;
  }

  function abaExercicios(cont, est) {
    var tipo = est.exTipo || 'mix';
    est.placar = est.placar || { certos: 0, total: 0 };
    var placar = h('p', { class: 'dc-placar', 'aria-live': 'polite' });
    var seg = segmentado('Tipo de exercício', TIPOS_EX, tipo, function (id) { tipo = id; est.exTipo = id; novo(); });
    seg.classList.add('dc-tipos');
    var area = h('div', { class: 'dc-ex' });
    cont.appendChild(h('p', { class: 'dc-intro' }, 'Resolva com papel, calculadora científica (ou tábuas) e confira. As respostas aceitam vírgula ou ponto. Tolerância: 1° no rumo e 1% na distância.'));
    cont.appendChild(seg);
    cont.appendChild(placar);
    cont.appendChild(area);
    function atualizaPlacar() { placar.textContent = est.placar.total ? 'Acertos nesta sessão: ' + est.placar.certos + ' de ' + est.placar.total : 'Nenhum exercício conferido ainda.'; }
    function novo() {
      var ex = gerarExercicio(tipo);
      area.innerHTML = '';
      area.appendChild(h('p', { class: 'dc-enunciado', html: ex.enunciado }));
      if (ex.nota) area.appendChild(h('p', { class: 'dc-obs' }, ex.nota));
      var campos = ex.campos.map(function (c) {
        if (c.coord) { var cc = campoCoord(c.rotulo, c.coord, function () {}); return { def: c, el: cc.el, ler: function () { var r = cc.ler(); return r.erro ? NaN : r.valor; } }; }
        var cn = campoNumero(c.rotulo, c.un, '', null);
        return { def: c, el: cn.el, ler: function () { return cn.valor(); } };
      });
      var grade = h('div', { class: 'dc-linha dc-ex-campos' }, campos.map(function (c) { return c.el; }));
      var fb = h('div', { class: 'dc-feedback', 'aria-live': 'polite' });
      var sol = h('details', { class: 'dc-det', hidden: true }, h('summary', null, 'Solução passo a passo'), h('div', { class: 'dc-det-corpo' }));
      var conferido = false;
      var btC = h('button', { type: 'button', class: 'btn btn-primary', onclick: conferir }, 'Conferir');
      var btS = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { mostrarSol(true); } }, 'Ver solução');
      var btN = h('button', { type: 'button', class: 'btn btn-quiet', onclick: novo }, 'Novo exercício');
      area.appendChild(grade);
      area.appendChild(h('div', { class: 'btn-row' }, btC, btS, btN));
      area.appendChild(fb);
      area.appendChild(sol);
      grade.addEventListener('keydown', function (e) { if (e.key === 'Enter') conferir(); });
      function mostrarSol(abrir) {
        var corpo = sol.querySelector('.dc-det-corpo');
        if (!corpo.firstChild) corpo.appendChild(ex.solucao());
        sol.hidden = false; if (abrir) sol.open = true;
      }
      function conferir() {
        var linhas = [], tudoCerto = true, faltou = false;
        if (ex.composto) {
          var dd = campos[0].ler(), hh = campos[1].ler();
          var vazio0 = !campos[0].el.querySelector('input').value.trim(), vazio1 = !campos[1].el.querySelector('input').value.trim();
          if ((vazio0 && vazio1) || (!vazio0 && !isFinite(dd)) || (!vazio1 && !isFinite(hh))) { fb.setAttribute('data-ok', '0'); fb.innerHTML = ''; fb.appendChild(h('p', null, 'Preencha dias e horas com números (ex.: 18 dias e 7,5 h).')); return; }
          if (!isFinite(dd)) dd = 0;
          if (!isFinite(hh)) hh = 0;
          var resp = dd * 24 + hh, ok = Math.abs(resp - ex.composto.certo) <= ex.composto.tolAbs;
          tudoCerto = ok;
          linhas.push((ok ? 'Certo: ' : 'Ainda não: ') + 'o tempo é ' + ex.composto.fmt() + (ok ? '.' : '; você respondeu ' + Dv.fmtDuracao(resp) + '.'));
        } else {
          campos.forEach(function (c) {
            var d = c.def, r = c.ler();
            if (!isFinite(r)) { faltou = true; tudoCerto = false; linhas.push(d.rotulo + ': resposta vazia ou inválida.'); return; }
            var melhor = Infinity, alvo = d.certo[0];
            d.certo.forEach(function (cv) {
              var dif = d.angulo ? Math.abs(Dv.norm180(r - cv)) : d.coord === 'lon' ? Math.abs(Dv.norm180(r - cv)) : Math.abs(r - cv);
              if (dif < melhor) { melhor = dif; alvo = cv; }
            });
            var tol = d.tol ? d.tol(alvo) : d.tolAbs;
            var ok = melhor <= tol;
            if (!ok) tudoCerto = false;
            var difTxt = d.angulo ? Dv.num(melhor, 1) + '°' : d.coord ? Dv.num(melhor * 60, 1) + '′' : d.un === 'milhas' ? Dv.num(melhor, 1) + ' milhas (' + Dv.num(melhor / alvo * 100, 1) + '%)' : Dv.num(melhor, 4);
            linhas.push(d.rotulo + ': ' + (ok ? 'certo' : 'diferença de ' + difTxt) + ' — resposta: ' + d.fmt(alvo) + '.');
          });
        }
        if (faltou) { fb.setAttribute('data-ok', '0'); fb.innerHTML = ''; fb.appendChild(h('p', null, 'Preencha todos os campos antes de conferir.')); linhas.forEach(function (x) { fb.appendChild(h('p', { class: 'dc-obs' }, x)); }); return; }
        if (!conferido) { conferido = true; est.placar.total++; if (tudoCerto) est.placar.certos++; atualizaPlacar(); }
        fb.setAttribute('data-ok', tudoCerto ? '1' : '0');
        fb.innerHTML = '';
        fb.appendChild(h('p', { class: 'dc-fb-tit' }, tudoCerto ? 'Correto.' : 'Confira a solução.'));
        linhas.forEach(function (x) { fb.appendChild(h('p', null, x)); });
        if (!tudoCerto) {
          var dica = { orto: 'Erros comuns: esquecer o sinal de S/W, usar Δλ pelo caminho longo, ou errar o quadrante do rumo (veja o sinal do denominador).', lox: 'Erros comuns: usar Δφ em vez da diferença de latitudes crescidas na tangente do rumo, ou esquecer de passar Δλ para minutos.', estima: 'Erros comuns: dividir o apartamento pelo cosseno da latitude de partida em vez da latitude média, ou trocar seno e cosseno.', conv: 'Lembre: minutos = parte decimal × 60; 1 milha = 1,852 km.', tempo: 'Tempo = distância ÷ velocidade; depois divida as horas por 24 para ter os dias.' }[ex.tipo];
          if (dica) fb.appendChild(h('p', { class: 'dc-obs' }, dica));
        }
        mostrarSol(!tudoCerto);
      }
      var primeiro = area.querySelector('input'); if (primeiro && est.focarEx) primeiro.focus();
      est.focarEx = true;
    }
    atualizaPlacar();
    novo();
  }

  Dv.cartaMercator = cartaMercator; // reutilizada pelo globo quando não há WebGL

  /* ---------- Montagem ---------- */
  VL.widgets.define('derrota-calc', {
    css: ['assets/css/widgets/derrota-calc.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var ABAS = [
        { id: 'derrotas', rotulo: 'Derrotas', render: abaDerrotas },
        { id: 'estima', rotulo: 'Estima', render: abaEstima },
        { id: 'conversoes', rotulo: 'Conversões', render: abaConversoes },
        { id: 'exercicios', rotulo: 'Exercícios', render: abaExercicios },
      ];
      if (Array.isArray(opts.abas) && opts.abas.length) ABAS = ABAS.filter(function (a) { return opts.abas.indexOf(a.id) >= 0; });
      var preset = Dv.presets.filter(function (p) { return p.id === (opts.preset || 'rio-cabo'); })[0] || Dv.presets[0];
      var pernas = [];
      for (var i = 0; i < preset.pontos.length - 1; i++) pernas.push([preset.pontos[i], preset.pontos[i + 1]]);
      pernas.sort(function (x, y) { return Dv.milhasEntre(y[0], y[1]) - Dv.milhasEntre(x[0], x[1]); });
      var est = {
        a: pernas[0][0], b: pernas[0][1], presetNota: preset.nota,
        modelo: opts.modelo === 'elipsoide' ? 'elipsoide' : 'esfera',
        vel: isFinite(opts.vel) && opts.vel > 0 ? Number(opts.vel) : 6,
        passo: opts.passo === 5 ? 5 : 10,
        exTipo: opts.exercicio || 'mix',
      };
      // 'orto' e 'lox' (usados no glossário) abrem a aba Derrotas, que mostra as duas derrotas e o passo a passo de cada uma
      var abaIni = opts.aba === 'orto' || opts.aba === 'lox' ? 'derrotas' : opts.aba;
      var atual = ABAS.some(function (a) { return a.id === abaIni; }) ? abaIni : ABAS[0].id;
      var inst = VL.ui.instrumento({ titulo: opts.titulo || 'Calculadora de derrotas', controlesAntes: true });
      var corpo = h('div', { class: 'dc' });
      inst.corpo.appendChild(corpo);
      if (ABAS.length > 1) {
        var abasSeg = segmentado('Seções da calculadora', ABAS, atual, function (id) { atual = id; desenhar(); });
        abasSeg.classList.add('dc-abas');
        inst.controles.appendChild(abasSeg);
      } else inst.controles.hidden = true;
      inst.legenda.appendChild(h('span', null, 'Esfera, 1′ = 1 milha · coordenadas dos exemplos aproximadas, só para estudo'));
      el.appendChild(inst.raiz);
      function desenhar() {
        if (est.ro) { est.ro.disconnect(); est.ro = null; }
        corpo.innerHTML = '';
        var aba = ABAS.filter(function (a) { return a.id === atual; })[0];
        aba.render(corpo, est);
      }
      var vivo = true;
      if (!VL.geo || !VL.geo.land110m) {
        VL.load('data/geo/world_land_110m.js').then(function () { if (vivo && atual === 'derrotas') desenhar(); }).catch(function () { /* a carta fica sem terra */ });
      }
      desenhar();
      var off = VL.on('settings', function () { desenhar(); });
      return function () { vivo = false; off(); if (est.ro) est.ro.disconnect(); el.innerHTML = ''; };
    },
  });
})();
