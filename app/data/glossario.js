/* Glossário náutico do app "Veleiro" (aba #/glossario).
   VL.dado('glossario', {categorias:[{id, nome, curto}], termos:[{
     id        slug estável (os cursos linkam #/glossario/termo/<id>; não renomeie),
     termo     nome em PT-BR, en (termo em inglês, aparece só com a trilha internacional ligada),
     sin       [sinônimos de verdade e siglas] (aparecem em "Também se diz", entram na busca e viram ids alternativos),
     busca     [palavras só para a busca: verbo, antônimo, tipo, parte] (entram na busca e viram ids alternativos),
     categoria, def (HTML curto para leigo),
     ver       [ids relacionados], figura?: {svg (gerado sob demanda), legenda, destaque} — na fonte: fig: [figura, destaque],
               legenda e nota: false (quando o magenta da figura não é o próprio termo),
     widget?   {w, opts, rotulo} (simulador relacionado), fonte?: {txt, url, loc} ou [..] (regra oficial),
     link?     {txt, url} (página oficial), aconfirmar? (texto do selo "a confirmar"), intl? (só trilha internacional)
   }]}) e, logo depois, VL.dado('glossarioIndice', {id: termo}) — inclui os sinônimos como ids alternativos.
   Figuras: SVG em linha com currentColor e tokens de cor (var(--…)), legíveis nos temas claro e escuro.
   Para contribuir: definição curta e correta; fato de norma só com a fonte oficial e o localizador. */
(function () {
  'use strict';

  /* ===================== Figuras ===================== */
  var MG = 'var(--magenta)';
  var NAV_PRETO = 'var(--nav-black, #1c1f24)';
  var NAV_AZUL = 'var(--nav-blue, #1f5fbf)';
  function svg(vb, rotulo, corpo) {
    return '<svg class="gl-svg" viewBox="' + vb + '" role="img" aria-label="' + rotulo + '" xmlns="http://www.w3.org/2000/svg">' + corpo + '</svg>';
  }
  function tr(on, w) { return on ? 'stroke="' + MG + '" stroke-width="' + ((w || 1.6) + 2) + '"' : 'stroke="currentColor" stroke-width="' + (w || 1.6) + '"'; }
  /* rótulo com halo (legível sobre linhas) */
  function lb(x, y, txt, on, ancora, tam) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (ancora || 'start') + '" font-size="' + (tam || 14) + '" font-weight="' + (on ? 760 : 520) + '" fill="' + (on ? MG : 'currentColor') + '" stroke="var(--surface)" stroke-width="4" paint-order="stroke" stroke-linejoin="round">' + txt + '</text>';
  }
  function fio(x1, y1, x2, y2, on) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 1.6 : 1) + '" opacity="' + (on ? 1 : 0.6) + '"/>'; }
  function seta(x1, y1, x2, y2, cor, w) {
    var a = Math.atan2(y2 - y1, x2 - x1), L = 9, c = cor || 'currentColor';
    var p1 = (x2 - L * Math.cos(a - 0.4)).toFixed(1) + ',' + (y2 - L * Math.sin(a - 0.4)).toFixed(1);
    var p2 = (x2 - L * Math.cos(a + 0.4)).toFixed(1) + ',' + (y2 - L * Math.sin(a + 0.4)).toFixed(1);
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 1.8) + '"/><polygon points="' + x2 + ',' + y2 + ' ' + p1 + ' ' + p2 + '" fill="' + c + '"/>';
  }
  function cota(x1, y1, x2, y2, on) { /* seta dupla de dimensão */
    var c = on ? MG : 'currentColor', w = on ? 2.4 : 1.3;
    return seta((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, c, w) + seta((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, c, w);
  }
  function arco(cx, cy, r, a1, a2, on, cor) { /* ângulos em graus náuticos (0 = cima, horário) */
    var p = function (a) { var t = (a - 90) * Math.PI / 180; return [(cx + r * Math.cos(t)).toFixed(1), (cy + r * Math.sin(t)).toFixed(1)]; };
    var s = p(a1), e = p(a2), grande = Math.abs(a2 - a1) > 180 ? 1 : 0, sent = a2 > a1 ? 1 : 0;
    return '<path d="M' + s.join(',') + ' A' + r + ',' + r + ' 0 ' + grande + ' ' + sent + ' ' + e.join(',') + '" fill="none" stroke="' + (cor || (on ? MG : 'currentColor')) + '" stroke-width="' + (on ? 2.6 : 1.3) + '"/>';
  }
  function polar(cx, cy, r, a) { var t = (a - 90) * Math.PI / 180; return [+(cx + r * Math.cos(t)).toFixed(1), +(cy + r * Math.sin(t)).toFixed(1)]; }
  function setor(cx, cy, r, a1, a2, fill, stroke, op) {
    var s = polar(cx, cy, r, a1), e = polar(cx, cy, r, a2), grande = (a2 - a1) > 180 ? 1 : 0;
    return '<path d="M' + cx + ',' + cy + ' L' + s.join(',') + ' A' + r + ',' + r + ' 0 ' + grande + ' 1 ' + e.join(',') + ' Z" fill="' + fill + '" fill-opacity="' + (op == null ? 0.35 : op) + '" stroke="' + (stroke || fill) + '" stroke-width="1.4"/>';
  }
  /* barquinho visto de cima, apontando para cima; rumo em graus; lado da vela: +1 boreste, -1 bombordo */
  function barquinho(x, y, rumo, lado, abertura, esc, on) {
    var s = esc || 1, b = lado || 1, a = (abertura || 20) * Math.PI / 180;
    var bx = (b * Math.sin(a) * 17).toFixed(1), by = (-5 + Math.cos(a) * 17).toFixed(1);
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + rumo + ') scale(' + s + ')">' +
      '<path d="M0,-19 C8,-10 9,3 6,15 L-6,15 C-9,3 -8,-10 0,-19 Z" fill="var(--surface)" ' + tr(on, 1.4) + '/>' +
      '<line x1="0" y1="-5" x2="' + bx + '" y2="' + by + '" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-5" r="1.8" fill="currentColor"/></g>';
  }
  function ventoSeta(x, y, len, ang) { /* seta de vento soprando na direção ang (graus de tela) */
    var e = polar(x, y, len, ang);
    return seta(x, y, e[0], e[1], 'currentColor', 2);
  }
  var F = {};

  /* --- 1. Veleiro (sloop) de perfil, com a parte em destaque --- */
  var BARCO_ROT = {
    proa: [486, 186, 500, 150, 'Proa'], popa: [70, 200, 12, 150, 'Popa'], mastro: [300, 110, 318, 104, 'Mastro'],
    retranca: [200, 152, 168, 182, 'Retranca'], estai: [400, 112, 420, 92, 'Estai'], 'estai-de-popa': [170, 120, 30, 96, 'Estai de popa'],
    brandal: [295, 60, 238, 44, 'Brandal'], cruzeta: [292, 101, 236, 106, 'Cruzeta'], burro: [282, 160, 238, 132, 'Burro'],
    amantilho: [190, 99, 112, 70, 'Amantilho'], 'vela-grande': [230, 110, 200, 118, 'Vela grande'], genoa: [340, 140, 352, 132, 'Genoa'],
    buja: [380, 150, 390, 132, 'Buja'], quilha: [306, 290, 350, 304, 'Quilha'], leme: [130, 270, 60, 290, 'Leme'],
    casaria: [270, 175, 260, 160, 'Casaria'], cockpit: [140, 205, 100, 226, 'Cockpit'], conves: [420, 188, 410, 206, 'Convés'],
    costado: [380, 214, 400, 222, 'Costado'], 'obras-vivas': [330, 245, 360, 270, 'Obras vivas'], 'obras-mortas': [430, 205, 450, 222, 'Obras mortas'],
    'linha-dagua': [470, 228, 482, 250, 'Linha d’água'], pulpito: [476, 168, 450, 142, 'Púlpito de proa'], 'guarda-mancebo': [250, 174, 200, 165, 'Guarda-mancebo'],
    balaustre: [400, 180, 410, 166, 'Balaústre'], tope: [300, 22, 318, 18, 'Tope do mastro'], garlindeu: [300, 150, 318, 158, 'Garlindéu'], vigia: [265, 182, 252, 200, 'Vigia'],
    enora: [300, 172, 322, 182, 'Enora'], 'pulpito-de-popa': [84, 179, 24, 176, 'Púlpito de popa'],
    escota: [214, 190, 196, 274, 'Escotas'], adrica: [305, 70, 322, 66, 'Adriça da grande'],
  };
  /* Rótulos da vista com todas as partes: [alvo x, alvo y, rótulo x, rótulo y, âncora, com linha de chamada] */
  var BARCO_TODAS = {
    proa: [0, 0, 500, 150, 'start', false], popa: [0, 0, 12, 150, 'start', false],
    mastro: [301, 62, 322, 48, 'start', true], estai: [430, 137, 440, 108, 'start', true],
    'estai-de-popa': [100, 177, 14, 106, 'start', true], brandal: [294, 80, 262, 42, 'end', true],
    'vela-grande': [0, 0, 196, 132, 'start', false], genoa: [0, 0, 366, 162, 'start', false],
    retranca: [126, 154, 112, 170, 'end', true], casaria: [0, 0, 214, 168, 'start', false],
    cockpit: [120, 207, 24, 254, 'start', true], leme: [124, 276, 60, 292, 'start', true],
    quilha: [322, 292, 346, 306, 'start', true], 'linha-dagua': [462, 230, 470, 252, 'start', true],
  };
  F.barco = function (hl, opcoes) {
    var o = opcoes || {}, on = function (k) { return hl === k || (Array.isArray(hl) && hl.indexOf(k) >= 0); };
    var todos = hl === 'todas';
    var buja = on('buja');
    var b = '';
    var VIVAS = 'M90,228 L470,228 C460,240 432,250 400,252 C330,258 220,256 150,248 C120,244 100,238 92,232 Z';
    var CASCO = 'M70,200 L488,186 C482,206 476,220 468,232 C455,244 430,250 400,252 C330,258 220,256 150,248 C120,244 100,238 92,232 Z';
    b += '<rect x="0" y="228" width="560" height="102" fill="var(--sea-1)"/><line x1="0" y1="228" x2="560" y2="228" stroke="var(--sea-3)" stroke-width="1.4"/>';
    // obras vivas, quilha e leme
    b += '<path d="' + VIVAS + '" fill="' + (on('obras-vivas') ? 'var(--magenta-soft)' : 'var(--shoal-2)') + '" stroke="none"/>';
    b += '<path d="M262,255 L318,256 L334,314 L294,314 Z" fill="var(--shoal-2)" ' + tr(on('quilha')) + '/>';
    b += '<path d="M120,236 L142,240 L139,292 L123,292 Z" fill="var(--shoal-2)" ' + tr(on('leme')) + '/>';
    // casco (no destaque das obras mortas, só a parte acima da água fica rosada)
    var dc = on('costado') || on('obras-mortas');
    b += '<path d="' + CASCO + '" fill="' + (dc ? 'var(--magenta-soft)' : 'none') + '" ' + tr(dc) + '/>';
    if (on('obras-mortas')) b += '<path d="' + VIVAS + '" fill="var(--shoal-2)" stroke="none"/><path d="' + CASCO + '" fill="none" ' + tr(true) + '/><path d="M90,228 L470,228" stroke="' + MG + '" stroke-width="3"/>';
    b += '<line x1="70" y1="200" x2="488" y2="186" ' + tr(on('conves'), 2) + '/>';
    if (on('linha-dagua')) b += '<line x1="90" y1="228" x2="470" y2="228" stroke="' + MG + '" stroke-width="4"/>';
    // cockpit, casaria e vigias
    b += '<path d="M102,199 L104,211 L176,209 L178,197" fill="none" ' + tr(on('cockpit'), 1.3) + ' stroke-dasharray="' + (on('cockpit') ? '0' : '4 3') + '"/>';
    b += '<path d="M192,193 L206,176 L340,172 L352,188" fill="var(--surface)" ' + tr(on('casaria')) + '/>';
    [230, 265, 300].forEach(function (x, i) { b += '<ellipse cx="' + x + '" cy="' + (183 - i) + '" rx="7" ry="3.4" fill="var(--sea-2)" ' + tr(on('vigia'), 1.1) + '/>'; });
    // púlpitos, balaústres e guarda-mancebo
    b += '<path d="M462,187 L464,168 L484,166 L487,184" fill="none" ' + tr(on('pulpito'), 1.4) + '/>';
    b += '<path d="M73,199 L75,180 L96,178 L98,197" fill="none" ' + tr(on('pulpito-de-popa'), 1.4) + '/>';
    [[150, 176.5, 197.3], [400, 169.7, 189], [440, 168.6, 187.6]].forEach(function (s) { b += '<line x1="' + s[0] + '" y1="' + s[1] + '" x2="' + s[0] + '" y2="' + s[2] + '" ' + tr(on('balaustre'), 1.4) + '/>'; });
    b += '<line x1="96" y1="178" x2="464" y2="168" ' + tr(on('guarda-mancebo'), 1.1) + '/>';
    // velas
    b += '<path d="M298,30 L298,148 L116,150 Q196,86 298,30 Z" fill="' + (on('vela-grande') ? 'var(--magenta-soft)' : 'var(--paper)') + '" ' + tr(on('vela-grande'), 1.4) + '/>';
    b += '<path d="M310,36 L473,176 Q ' + (buja ? '410,182 342,173' : '380,190 284,180') + ' Q ' + (buja ? '334,96 310,36' : '300,100 310,36') + ' Z" fill="' + (on('genoa') || buja ? 'var(--magenta-soft)' : 'var(--paper)') + '" ' + tr(on('genoa') || buja, 1.4) + ' fill-opacity="0.92"/>';
    // aparelho por cima das velas, para ficar visível no perfil
    b += '<line x1="300" y1="22" x2="486" y2="186" ' + tr(on('estai'), 1.2) + '/>';
    b += '<line x1="300" y1="22" x2="72" y2="199" ' + tr(on('estai-de-popa'), 1.2) + '/>';
    b += '<polyline points="301,26 292,101 297,187" fill="none" ' + tr(on('brandal'), 1.1) + '/>';
    b += '<line x1="300" y1="101" x2="289" y2="101" ' + tr(on('cruzeta'), 2.4) + '/>';
    b += '<line x1="300" y1="22" x2="113" y2="152" ' + tr(on('amantilho'), 0.9) + ' stroke-dasharray="3 3"/>';
    // escotas (só no destaque): da genoa até a catraca do cockpit; da grande, da retranca ao carrinho
    if (on('escota')) {
      b += '<line x1="' + (buja ? 342 : 284) + '" y1="' + (buja ? 173 : 180) + '" x2="178" y2="196" stroke="' + MG + '" stroke-width="2.6"/>';
      b += '<line x1="150" y1="153" x2="150" y2="199" stroke="' + MG + '" stroke-width="2.6"/><circle cx="178" cy="196" r="3.5" fill="' + MG + '"/>';
    }
    // adriça da grande (só no destaque): do punho da adriça ao tope, desce pelo mastro e vem pela casaria até o cockpit
    if (on('adrica')) b += '<polyline points="298,31 302,23 305,30 305,170 194,190" fill="none" stroke="' + MG + '" stroke-width="2.4" stroke-linejoin="round"/><circle cx="194" cy="190" r="3.5" fill="' + MG + '"/>';
    // retranca, burro, mastro, garlindéu
    b += '<line x1="300" y1="150" x2="110" y2="154" ' + tr(on('retranca'), 3.4) + ' stroke-linecap="round"/>';
    b += '<line x1="299" y1="171" x2="262" y2="151.5" ' + tr(on('burro'), 1.5) + '/>';
    b += '<line x1="300" y1="172" x2="300" y2="22" ' + tr(on('mastro'), 3.2) + ' stroke-linecap="round"/>';
    b += '<circle cx="300" cy="150" r="' + (on('garlindeu') ? 5 : 3) + '" fill="' + (on('garlindeu') ? MG : 'currentColor') + '"/>';
    if (on('tope')) b += '<circle cx="300" cy="22" r="7" fill="none" stroke="' + MG + '" stroke-width="2.4"/>';
    if (on('enora')) b += '<rect x="292" y="168" width="16" height="8" fill="none" stroke="' + MG + '" stroke-width="2.4"/>';
    if (on('proa')) b += '<circle cx="482" cy="196" r="16" fill="none" stroke="' + MG + '" stroke-width="2.4"/>';
    if (on('popa')) b += '<circle cx="78" cy="212" r="18" fill="none" stroke="' + MG + '" stroke-width="2.4"/>';
    // rótulos
    var rot = '';
    if (todos) {
      Object.keys(BARCO_TODAS).forEach(function (k) {
        var r = BARCO_TODAS[k];
        if (r[5]) rot += fio(r[0], r[1], r[2] + (r[4] === 'end' ? 3 : -3), r[3] - 4, false);
        rot += lb(r[2], r[3], BARCO_ROT[k][4], false, r[4], 13);
      });
    } else {
      Object.keys(BARCO_ROT).forEach(function (k) {
        var r = BARCO_ROT[k];
        if (k === 'buja' && !buja) return;
        if (k === 'genoa' && buja) return;
        if (!(on(k) || k === 'proa' || k === 'popa')) return;
        var dest = on(k);
        if (dest && !(k === 'proa' || k === 'popa')) rot += fio(r[0], r[1], r[2] + (r[2] < r[0] ? 6 : -4), r[3] - 4, true);
        var anc = r[2] < r[0] - 20 ? 'end' : 'start';
        if (k === 'popa' || k === 'leme' || k === 'estai-de-popa' || k === 'pulpito-de-popa' || k === 'amantilho' || k === 'escota') anc = 'start';
        rot += lb(r[2], r[3], r[4], dest, anc, dest ? 15 : 13);
      });
    }
    return svg('0 0 560 330', o.rotulo || 'Veleiro de perfil' + (todos ? ' com as partes principais' : ''), b + rot);
  };

  /* --- 2. Direções relativas (vista de cima) --- */
  F.direcoes = function (hl) {
    var cx = 200, cy = 205, b = '';
    var dirs = [
      [0, 'proa', 'Proa', '000°'], [45, 'bochecha-be', 'Bochecha de BE', '045°'], [90, 'traves-be', 'Través de BE', '090°'],
      [135, 'alheta-be', 'Alheta de BE', '135°'], [180, 'popa', 'Popa', '180°'], [225, 'alheta-bb', 'Alheta de BB', '225°'],
      [270, 'traves-bb', 'Través de BB', '270°'], [315, 'bochecha-bb', 'Bochecha de BB', '315°']];
    var grupo = { bochecha: ['bochecha-be', 'bochecha-bb'], alheta: ['alheta-be', 'alheta-bb'], traves: ['traves-be', 'traves-bb'] };
    var ativos = grupo[hl] || [hl];
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="150" fill="none" stroke="var(--line)" stroke-width="1.2"/>';
    if (hl === 'bombordo') b += setor(cx, cy, 150, 180, 360, MG, MG, 0.12);
    if (hl === 'boreste') b += setor(cx, cy, 150, 0, 180, MG, MG, 0.12);
    dirs.forEach(function (d) {
      var on = ativos.indexOf(d[1]) >= 0, e = polar(cx, cy, 150, d[0]), t = polar(cx, cy, 168, d[0]);
      b += on ? seta(cx, cy, e[0], e[1], MG, 2.6) : '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.7"/>';
      var anc = d[0] === 0 || d[0] === 180 ? 'middle' : (d[0] < 180 ? 'start' : 'end');
      var dy = d[0] === 0 ? -6 : (d[0] === 180 ? 18 : (d[0] === 45 || d[0] === 315 ? -2 : (d[0] === 135 || d[0] === 225 ? 12 : 5)));
      b += lb(t[0], t[1] + dy, d[2], on, anc, on ? 15 : 13);
      b += lb(t[0], t[1] + dy + 15, d[3], on, anc, 12);
    });
    b += '<path d="M200,128 C226,156 233,192 230,232 L223,282 L177,282 L170,232 C167,192 174,156 200,128 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/>';
    b += '<path d="M200,128 C174,156 167,192 170,232 L177,282 L200,282 Z" fill="' + (hl === 'bombordo' ? 'var(--magenta-soft)' : 'none') + '" stroke="none"/>';
    b += '<path d="M200,128 C226,156 233,192 230,232 L223,282 L200,282 Z" fill="' + (hl === 'boreste' ? 'var(--magenta-soft)' : 'none') + '" stroke="none"/>';
    b += '<line x1="200" y1="132" x2="200" y2="280" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 3"/>';
    b += '<circle cx="183" cy="214" r="5" fill="var(--nav-red)"/><circle cx="217" cy="214" r="5" fill="var(--nav-green)"/>';
    b += lb(150, 252, 'BB', hl === 'bombordo', 'end', 15) + lb(250, 252, 'BE', hl === 'boreste', 'start', 15);
    b += lb(cx, 440, 'Bombordo (BB) à esquerda e boreste (BE) à direita de quem olha para a proa', false, 'middle', 12);
    return svg('-74 -6 548 456', 'Direções relativas em volta do barco, vistas de cima', b);
  };

  /* --- 3. Dimensões do casco --- */
  F.dimensoes = function (hl) {
    var on = function (k) { return hl === k; }, b = '';
    b += '<rect x="0" y="150" width="600" height="110" fill="var(--sea-1)"/><line x1="0" y1="150" x2="600" y2="150" stroke="var(--sea-3)" stroke-width="1.4"/>';
    // perfil
    b += '<path d="M24,112 L326,104 C320,124 314,140 304,152 C292,162 270,166 240,168 C180,172 110,170 70,164 C50,160 38,156 34,152 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>';
    b += '<path d="M160,170 L196,171 L206,214 L178,214 Z" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1.4"/>';
    b += '<path d="M56,161 L70,163 L68,196 L58,196 Z" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1.2"/>';
    if (on('linha-dagua')) b += '<line x1="34" y1="150" x2="306" y2="150" stroke="' + MG + '" stroke-width="4"/>';
    b += cota(24, 82, 326, 82, on('comprimento')) + '<line x1="24" y1="76" x2="24" y2="112" stroke="currentColor" stroke-width="0.8"/><line x1="326" y1="76" x2="326" y2="104" stroke="currentColor" stroke-width="0.8"/>';
    b += lb(175, 72, 'Comprimento total', on('comprimento'), 'middle', on('comprimento') ? 15 : 13);
    b += cota(222, 150, 222, 214, on('calado')) + '<line x1="206" y1="214" x2="230" y2="214" stroke="currentColor" stroke-width="0.8"/>';
    b += lb(232, 196, 'Calado', on('calado'), 'start', on('calado') ? 15 : 13);
    b += cota(296, 106, 296, 150, on('borda-livre')) + lb(286, 136, 'Borda livre', on('borda-livre'), 'end', on('borda-livre') ? 15 : 13);
    b += lb(40, 145, 'Linha d’água', on('linha-dagua'), 'start', on('linha-dagua') ? 15 : 13);
    // seção transversal
    b += '<path d="M410,110 L570,110 C568,140 560,162 540,172 C520,180 460,180 440,172 C420,162 412,140 410,110 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>';
    b += '<path d="M482,178 L498,178 L496,226 L484,226 Z" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1.3"/>';
    b += cota(410, 92, 570, 92, on('boca')) + '<line x1="410" y1="86" x2="410" y2="110" stroke="currentColor" stroke-width="0.8"/><line x1="570" y1="86" x2="570" y2="110" stroke="currentColor" stroke-width="0.8"/>';
    b += lb(490, 82, 'Boca', on('boca'), 'middle', on('boca') ? 15 : 13);
    b += cota(588, 110, 588, 179, on('pontal')) + '<line x1="540" y1="179" x2="596" y2="179" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/>';
    b += lb(584, 205, 'Pontal', on('pontal'), 'end', on('pontal') ? 15 : 13);
    b += cota(458, 150, 458, 226, on('calado')) + '<line x1="450" y1="226" x2="490" y2="226" stroke="currentColor" stroke-width="0.8"/>';
    b += cota(424, 110, 424, 150, on('borda-livre'));
    b += lb(175, 248, 'Perfil', false, 'middle', 12) + lb(490, 248, 'Seção a meio do barco', false, 'middle', 12);
    return svg('0 40 610 220', 'Dimensões do casco: comprimento, boca, calado, pontal e borda livre', b);
  };

  /* --- 4. Partes da vela --- */
  F.vela = function (hl) {
    var on = function (k) { return hl === k; }, b = '';
    b += '<path d="M120,24 L120,300 L330,300 Q300,150 120,24 Z" fill="' + (hl === 'vela' ? 'var(--magenta-soft)' : 'var(--paper)') + '" stroke="currentColor" stroke-width="1.6"/>';
    b += '<line x1="120" y1="24" x2="120" y2="300" ' + tr(on('testa') || on('tralha'), on('tralha') ? 3 : 1.6) + '/>';
    b += '<path d="M120,24 Q300,150 330,300" fill="none" ' + tr(on('valuma'), 1.6) + '/>';
    b += '<line x1="120" y1="300" x2="330" y2="300" ' + tr(on('esteira') || on('tralha'), on('tralha') ? 3 : 1.6) + '/>';
    // talas (perpendiculares à valuma)
    [[0.25], [0.45], [0.65], [0.82]].forEach(function (t) {
      var u = t[0], x = (1 - u) * (1 - u) * 120 + 2 * (1 - u) * u * 300 + u * u * 330, y = (1 - u) * (1 - u) * 24 + 2 * (1 - u) * u * 150 + u * u * 300;
      b += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x - 38).toFixed(1) + '" y2="' + (y + 10).toFixed(1) + '" ' + tr(on('tala'), 2.2) + ' stroke-linecap="round"/>';
    });
    // rizo
    b += '<line x1="120" y1="252" x2="316" y2="252" ' + tr(on('rizo'), 1) + ' stroke-dasharray="2 9"/>';
    [120, 316].forEach(function (x) { b += '<circle cx="' + x + '" cy="252" r="4" fill="var(--surface)" ' + tr(on('rizo'), 1.4) + '/>'; });
    b += '<circle cx="120" cy="24" r="5" fill="' + (on('punho-da-adrica') ? MG : 'currentColor') + '"/>';
    b += '<circle cx="120" cy="300" r="5" fill="' + (on('punho-da-amura') ? MG : 'currentColor') + '"/>';
    b += '<circle cx="330" cy="300" r="5" fill="' + (on('punho-da-escota') ? MG : 'currentColor') + '"/>';
    b += lb(132, 22, 'Punho da adriça', on('punho-da-adrica'), 'start', on('punho-da-adrica') ? 15 : 13);
    b += lb(108, 312, 'Punho da amura', on('punho-da-amura'), 'end', on('punho-da-amura') ? 15 : 13);
    b += lb(342, 312, 'Punho da escota', on('punho-da-escota'), 'start', on('punho-da-escota') ? 15 : 13);
    b += lb(108, 150, 'Testa', on('testa'), 'end', on('testa') ? 16 : 14);
    b += lb(262, 150, 'Valuma', on('valuma'), 'start', on('valuma') ? 16 : 14);
    b += lb(225, 330, 'Esteira', on('esteira'), 'middle', on('esteira') ? 16 : 14);
    if (on('tala')) b += lb(196, 200, 'Talas', true, 'end', 15);
    if (on('rizo')) b += lb(220, 244, 'Linha de rizo', true, 'middle', 15);
    if (on('tralha')) b += lb(130, 290, 'Tralha', true, 'start', 15);
    return svg('-24 0 494 340', 'Vela grande com testa, valuma, esteira e punhos', b);
  };

  /* --- 5. Pontos de vela --- */
  F.pontos = function (hl) {
    var cx = 230, cy = 238, R = 150, b = '';
    b += '<text x="' + cx + '" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Vento</text>';
    b += seta(cx, 28, cx, 74, 'currentColor', 2.4) + seta(cx - 40, 34, cx - 40, 70, 'currentColor', 1.6) + seta(cx + 40, 34, cx + 40, 70, 'currentColor', 1.6);
    b += setor(cx, cy, R, -45, 45, hl === 'zona-morta' ? MG : 'var(--ink-3)', 'none', hl === 'zona-morta' ? 0.22 : 0.16);
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="var(--line)" stroke-width="1"/>';
    var pts = [[45, 'bolina-cerrada', 'Bolina cerrada', 12], [70, 'bolina-folgada', 'Bolina folgada', 28], [95, 'traves', 'Través', 45], [140, 'largo', 'Largo', 65], [180, 'vento-em-popa', 'Popa', 85]];
    pts.forEach(function (p) {
      var on = hl === p[1] || hl === 'todos', q = polar(cx, cy, R, p[0]), ql = polar(cx, cy, R + 26, p[0]);
      b += barquinho(q[0], q[1], p[0], 1, p[3], 1.15, hl === p[1]);
      var anc = p[0] >= 170 ? 'middle' : 'start';
      b += lb(ql[0] + (anc === 'start' ? 4 : 0), ql[1] + (p[0] >= 170 ? 20 : 5), p[2], hl === p[1], anc, hl === p[1] ? 15 : 13);
      var m = polar(cx, cy, R, -p[0]);
      if (p[0] < 180) b += '<g opacity="0.45">' + barquinho(m[0], m[1], -p[0], -1, p[3], 1, false) + '</g>';
    });
    b += lb(cx, cy - 40, 'Zona morta', hl === 'zona-morta', 'middle', hl === 'zona-morta' ? 15 : 13);
    b += lb(cx, cy - 24, '(cerca de 45° para cada lado)', hl === 'zona-morta', 'middle', 11);
    return svg('40 0 500 446', 'Pontos de vela em relação ao vento', b);
  };

  /* --- 6. Barlavento e sotavento --- */
  F.barlavento = function (hl) {
    var b = '';
    b += '<rect x="0" y="0" width="200" height="220" fill="' + (hl === 'barlavento' ? 'var(--magenta-soft)' : 'transparent') + '"/>';
    b += '<rect x="220" y="0" width="200" height="220" fill="' + (hl === 'sotavento' ? 'var(--magenta-soft)' : 'transparent') + '"/>';
    [50, 110, 170].forEach(function (y) { b += seta(16, y, 92, y, 'currentColor', 2); });
    b += barquinho(210, 120, 0, 1, 40, 2.6, false);
    b += lb(100, 28, 'Barlavento', hl === 'barlavento', 'middle', 16) + lb(100, 206, 'de onde vem o vento', false, 'middle', 12);
    b += lb(330, 28, 'Sotavento', hl === 'sotavento', 'middle', 16) + lb(330, 206, 'para onde vai o vento', false, 'middle', 12);
    return svg('0 0 420 220', 'Lado de barlavento e lado de sotavento de um barco', b);
  };

  /* --- 7. Manobras: cambar, jaibe, bordejar ---
     Vento de cima (norte da figura). Regra conferida em cada barco: com o vento entrando por bombordo
     (amurado a bombordo) a retranca fica a boreste, e vice-versa. */
  F.manobra = function (tipo) {
    var b = '';
    b += '<text x="404" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Vento</text>';
    b += seta(404, 26, 404, 64, 'currentColor', 2.2) + seta(380, 28, 380, 56, 'currentColor', 1.4) + seta(428, 28, 428, 56, 'currentColor', 1.4);
    var trilha = function (d) { return '<path d="' + d + '" fill="none" stroke="' + MG + '" stroke-width="2.4" stroke-dasharray="6 4"/>'; };
    if (tipo === 'cambar') {
      b += trilha('M100,250 L200,150 C222,128 222,126 200,104 L120,24');
      b += barquinho(140, 210, 45, 1, 14, 1.5) + barquinho(216, 127, 0, 1, 0, 1.5, true) + barquinho(150, 54, 315, -1, 14, 1.5);
      b += lb(162, 228, 'amurado a bombordo', false, 'start', 12) + lb(170, 44, 'amurado a boreste', false, 'start', 12);
      b += lb(238, 124, 'a proa passa', true, 'start', 13) + lb(238, 140, 'pela linha do vento', true, 'start', 13);
      return svg('64 0 396 260', 'Cambar: mudar de bordo passando a proa pela linha do vento', b);
    }
    if (tipo === 'jaibe') {
      b += trilha('M90,20 L190,120 C212,142 212,144 190,166 L110,246');
      b += barquinho(130, 60, 135, 1, 70, 1.5) + barquinho(207, 143, 180, 1, 0, 1.5, true) + barquinho(140, 216, 225, -1, 70, 1.5);
      b += lb(152, 44, 'amurado a bombordo', false, 'start', 12) + lb(162, 236, 'amurado a boreste', false, 'start', 12);
      b += lb(230, 132, 'a popa passa pela', true, 'start', 13) + lb(230, 148, 'linha do vento e a', true, 'start', 13) + lb(230, 164, 'retranca cruza o barco', true, 'start', 13);
      return svg('64 0 396 260', 'Jaibe: mudar de bordo passando a popa pela linha do vento', b);
    }
    b += '<circle cx="200" cy="60" r="7" fill="none" stroke="currentColor" stroke-width="2"/>' + lb(214, 56, 'destino a barlavento', false, 'start', 12);
    b += trilha('M230,250 L170,190 L250,110 L205,65');
    b += barquinho(200, 220, 315, -1, 14, 1.3) + barquinho(210, 150, 45, 1, 14, 1.3) + barquinho(227, 87, 315, -1, 14, 1.3);
    b += lb(262, 160, 'bordos alternados,', true, 'start', 13) + lb(262, 176, 'cada um a uns 45°', true, 'start', 12) + lb(262, 191, 'do vento', true, 'start', 12);
    return svg('64 0 396 260', 'Bordejar: avançar contra o vento em ziguezague', b);
  };

  /* --- 8. Amarração ao cais --- */
  F.amarracao = function (hl) {
    var on = function (k) { return hl === k; }, b = '';
    b += '<rect x="0" y="0" width="470" height="196" fill="var(--sea-1)"/>';
    b += '<rect x="0" y="206" width="470" height="44" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>' + lb(452, 236, 'Cais', false, 'end', 13);
    b += '<path d="M118,182 L118,160 C150,146 280,144 318,152 C340,158 352,166 360,172 C352,180 340,186 318,192 C280,198 150,198 118,192 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/>';
    b += lb(234, 176, 'proa à direita', false, 'middle', 12);
    [170, 236, 300].forEach(function (x) { b += '<rect x="' + (x - 11) + '" y="194" width="22" height="10" rx="5" fill="' + (on('defensa') ? 'var(--magenta-soft)' : 'var(--shoal-2)') + '" ' + tr(on('defensa'), 1.2) + '/>'; });
    var cab = [
      ['lancante', 122, 186, 56, 214, 'Lançante de popa', 52, 236, 'end'],
      ['espringue', 150, 194, 262, 214, 'Espringue de popa', 0, 0],
      ['espringue', 314, 192, 196, 214, 'Espringue de proa', 0, 0],
      ['lancante', 356, 176, 420, 214, 'Lançante de proa', 424, 236, 'start'],
      ['traves', 236, 197, 236, 214, 'Través', 0, 0]];
    cab.forEach(function (c) {
      b += '<line x1="' + c[1] + '" y1="' + c[2] + '" x2="' + c[3] + '" y2="' + c[4] + '" ' + tr(on(c[0]), 1.6) + '/>';
      b += '<circle cx="' + c[3] + '" cy="' + c[4] + '" r="4" fill="currentColor"/>';
    });
    b += lb(14, 150, 'Lançante de popa', on('lancante'), 'start', on('lancante') ? 15 : 13) + fio(70, 154, 92, 196, on('lancante'));
    b += lb(456, 150, 'Lançante de proa', on('lancante'), 'end', on('lancante') ? 15 : 13) + fio(400, 154, 390, 193, on('lancante'));
    b += lb(234, 122, 'Espringues (cruzados)', on('espringue'), 'middle', on('espringue') ? 15 : 13) + fio(234, 128, 250, 203, on('espringue'));
    if (on('defensa')) b += lb(300, 232, 'Defensas', true, 'middle', 15);
    if (on('traves')) b += lb(236, 232, 'Través', true, 'middle', 15);
    return svg('0 104 470 146', 'Cabos de amarração de um barco atracado ao cais', b);
  };

  /* --- 9. Fundeio e filame --- */
  F.fundeio = function (hl) {
    var b = '';
    b += '<rect x="0" y="70" width="460" height="170" fill="var(--sea-1)"/><line x1="0" y1="70" x2="460" y2="70" stroke="var(--sea-3)" stroke-width="1.4"/>';
    b += '<path d="M0,210 C120,206 300,214 460,208 L460,250 L0,250 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>';
    b += '<path d="M40,58 L150,56 C146,66 140,74 132,80 L56,80 C48,74 44,66 40,58 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/><line x1="96" y1="56" x2="96" y2="8" stroke="currentColor" stroke-width="2"/>';
    b += '<path d="M146,64 C190,150 280,204 381,198" fill="none" ' + tr(hl === 'filame' || hl === 'amarra' || hl === 'fundear', 2) + ' stroke-dasharray="' + (hl === 'amarra' ? '0' : '5 2') + '"/>';
    var corAnc = hl === 'ancora' || hl === 'garrar' || hl === 'fundear' ? MG : 'currentColor';
    /* âncora unhada (desenho clássico, deitado): haste no fundo, arganéu do lado do barco e uma pata enterrada na areia */
    b += '<g transform="translate(394,201) rotate(-75) scale(1.8) translate(-12,-12)" fill="none" stroke="' + corAnc + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 10h8M5 14c0 4 3 7 7 7s7-3 7-7"/><path d="M3 15l2-2 2 2M17 15l2-2 2 2"/></g>';
    b += cota(176, 70, 176, 208, false);
    b += lb(186, 150, 'Profundidade', false, 'start', 13);
    b += lb(290, 158, hl === 'amarra' ? 'Amarra (corrente)' : 'Filame', hl === 'filame' || hl === 'amarra' || hl === 'fundear', 'start', hl === 'filame' ? 15 : 13);
    b += lb(398, 176, 'Âncora', hl === 'ancora' || hl === 'fundear', 'middle', 13);
    if (hl === 'garrar') b += seta(410, 228, 350, 228, MG, 2.2) + lb(380, 246, 'âncora arrastando', true, 'middle', 13);
    return svg('0 0 460 250', 'Barco fundeado: profundidade, filame e âncora', b);
  };

  /* --- 10. Maré: curva e níveis --- */
  F.mare = function (hl) {
    var on = function (k) { return hl === k; }, b = '', x0 = 50, x1 = 470, NR = 214;
    var y = function (h) { return NR - h * 64; }, X = function (t) { return x0 + (x1 - x0) * t / 12.4; };
    var h = function (t) { return 1.4 - 1.0 * Math.cos(2 * Math.PI * t / 12.4); };
    b += '<rect x="' + x0 + '" y="' + NR + '" width="' + (x1 - x0) + '" height="34" fill="var(--sea-1)"/>';
    b += '<path d="M' + x0 + ',248 C150,252 300,240 ' + x1 + ',250 L' + x1 + ',262 L' + x0 + ',262 Z" fill="var(--land)" stroke="currentColor" stroke-width="1"/>';
    var d = '';
    for (var t = 0; t <= 12.4001; t += 0.2) d += (d ? ' L' : 'M') + X(t).toFixed(1) + ',' + y(h(t)).toFixed(1);
    b += '<path d="' + d + ' L' + x1 + ',' + NR + ' L' + x0 + ',' + NR + ' Z" fill="var(--sea-2)" fill-opacity="0.55"/>';
    b += '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2"/>';
    b += '<line x1="' + x0 + '" y1="' + NR + '" x2="' + x1 + '" y2="' + NR + '" ' + tr(on('nivel-de-reducao'), 1.4) + ' stroke-dasharray="6 3"/>';
    b += lb(x0 + 4, NR - 6, 'Nível de redução (NR): zero da carta e da tábua', on('nivel-de-reducao'), 'start', on('nivel-de-reducao') ? 14 : 12);
    var pm = [X(6.2), y(2.4)], bm1 = [X(0), y(0.4)], bm2 = [X(12.4), y(0.4)];
    var doze = on('regra-dos-doze-avos');
    b += '<circle cx="' + pm[0] + '" cy="' + pm[1] + '" r="5" fill="' + (on('preamar') ? MG : 'currentColor') + '"/>' + (doze ? lb(pm[0] + 10, pm[1] - 8, 'PM', false, 'start', 13) : lb(pm[0], pm[1] - 12, 'Preamar (PM)', on('preamar'), 'middle', on('preamar') ? 15 : 13));
    b += '<circle cx="' + bm1[0] + '" cy="' + bm1[1] + '" r="5" fill="' + (on('baixa-mar') ? MG : 'currentColor') + '"/>' + (doze ? '' : lb(bm1[0] + 8, bm1[1] - 10, 'Baixa-mar (BM)', on('baixa-mar'), 'start', on('baixa-mar') ? 15 : 13));
    b += '<circle cx="' + bm2[0] + '" cy="' + bm2[1] + '" r="5" fill="currentColor"/>';
    b += cota(X(9.6), y(2.4), X(9.6), y(0.4), on('amplitude')) + '<line x1="' + pm[0] + '" y1="' + pm[1] + '" x2="' + X(10.2) + '" y2="' + pm[1] + '" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/><line x1="' + X(9) + '" y1="' + y(0.4) + '" x2="' + x1 + '" y2="' + y(0.4) + '" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/>';
    b += lb(X(9.8), y(1.6), 'Amplitude', on('amplitude'), 'start', on('amplitude') ? 15 : 13);
    b += cota(X(3.1), NR, X(3.1), y(h(3.1)), on('altura-da-mare')) + lb(X(3.1) + 8, y(0.9), 'Altura da maré', on('altura-da-mare'), 'start', on('altura-da-mare') ? 15 : 12);
    b += cota(X(11.3), NR, X(11.3), 249, on('sondagem')) + lb(X(11.3) - 8, 242, 'Sondagem', on('sondagem'), 'end', on('sondagem') ? 15 : 12);
    b += lb(X(2.6), y(2.0), 'Enchente', on('enchente'), 'end', on('enchente') ? 15 : 13) + lb(X(9.4), y(2.65), 'Vazante', on('vazante'), 'start', on('vazante') ? 15 : 13);
    if (on('enchente')) b += seta(X(1.6), y(0.75), X(4.4), y(1.95), MG, 2.2);
    if (on('vazante')) b += seta(X(7.9), y(2.2), X(10.8), y(0.8), MG, 2.2);
    if (on('estofo')) b += '<path d="M' + X(5.4) + ',' + (pm[1] - 4) + ' L' + X(7) + ',' + (pm[1] - 4) + '" stroke="' + MG + '" stroke-width="5" stroke-linecap="round"/>' + lb(pm[0], pm[1] + 22, 'Estofo', true, 'middle', 15);
    if (on('regra-dos-doze-avos')) {
      var acc = 0, partes = [1, 2, 3, 3, 2, 1];
      partes.forEach(function (p, i) {
        var hh = 0.4 + 2.0 * acc / 12; acc += p; var hh2 = 0.4 + 2.0 * acc / 12;
        var xa = X(i * 6.2 / 6), xb = X((i + 1) * 6.2 / 6);
        b += '<rect x="' + xa.toFixed(1) + '" y="' + y(hh2).toFixed(1) + '" width="' + (xb - xa - 2).toFixed(1) + '" height="' + (y(hh) - y(hh2)).toFixed(1) + '" fill="' + MG + '" fill-opacity="0.28" stroke="' + MG + '"/>';
        b += lb((xa + xb) / 2, y(hh2) - 4, p + '/12', true, 'middle', 12);
      });
    }
    b += lb(x0, 280, 'BM', false, 'start', 11) + lb(X(6.2), 280, 'cerca de 6 h 12 min', false, 'middle', 11) + lb(x1, 280, 'BM', false, 'end', 11);
    return svg('30 20 460 270', 'Curva da maré com preamar, baixa-mar, amplitude e nível de redução', b);
  };

  /* --- 11. Sizígia e quadratura --- */
  F.sizigia = function (hl) {
    var b = '';
    var painel = function (dx, titulo, quad, on) {
      var s = '<g transform="translate(' + dx + ',0)">';
      s += '<circle cx="34" cy="110" r="22" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="1.2"/>' + lb(34, 150, 'Sol', false, 'middle', 12);
      s += '<ellipse cx="160" cy="110" rx="' + (quad ? 30 : 50) + '" ry="' + (quad ? 40 : 30) + '" fill="var(--sea-2)" fill-opacity="0.7" stroke="' + (on ? MG : 'var(--sea-3)') + '" stroke-width="' + (on ? 2.6 : 1.4) + '"/>';
      s += '<circle cx="160" cy="110" r="20" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>' + lb(160, 115, 'Terra', false, 'middle', 11);
      if (quad) s += '<circle cx="160" cy="34" r="9" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1.2"/>' + lb(176, 38, 'Lua', false, 'start', 12);
      else s += '<circle cx="246" cy="110" r="9" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1.2"/>' + lb(246, 134, 'Lua cheia', false, 'middle', 11) + '<circle cx="96" cy="110" r="7" fill="var(--ink-3)"/>' + lb(96, 92, 'ou nova', false, 'middle', 11);
      s += '<line x1="58" y1="110" x2="' + (quad ? 136 : 236) + '" y2="110" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/>';
      s += lb(140, 196, titulo, on, 'middle', on ? 15 : 14) + '</g>';
      return s;
    };
    b += painel(0, 'Sizígia: marés maiores', false, hl === 'sizigia');
    b += painel(290, 'Quadratura: marés menores', true, hl === 'quadratura');
    return svg('0 10 570 200', 'Posições do Sol e da Lua na sizígia e na quadratura', b);
  };

  /* --- 12. Nortes: verdadeiro, magnético e da agulha --- */
  F.nortes = function (hl) {
    /* Exemplo: Rv 060°, declinação 20° W e desvio 6° W → Rmg 080° e Rag 086° (W soma; E subtrai). */
    var on = function (k) { return hl === k; }, cx = 190, cy = 290, b = '';
    var dec = -20, dag = -6, proa = 60;
    var ln = function (a, r, k, txt, w) { var e = polar(cx, cy, r, a); return (on(k) ? seta(cx, cy, e[0], e[1], MG, 2.6) : seta(cx, cy, e[0], e[1], 'currentColor', w || 1.6)) + lb(e[0], e[1] - 8, txt, on(k), 'middle', on(k) ? 15 : 13); };
    b += ln(0, 250, 'nv', 'Nv');
    b += ln(dec, 236, 'nm', 'Nm');
    b += ln(dec + dag, 222, 'nag', 'Nag');
    var e = polar(cx, cy, 230, proa);
    b += seta(cx, cy, e[0], e[1], 'currentColor', 3) + lb(e[0] + 8, e[1] + 4, 'Proa', false, 'start', 14);
    /* declinação (Nm–Nv) e desvio (Nag–Nm) */
    b += arco(cx, cy, 210, dec, 0, on('declinacao-magnetica')) + lb(cx + 8, 78, 'Dmg 20° W', on('declinacao-magnetica'), 'start', on('declinacao-magnetica') ? 14 : 12);
    b += arco(cx, cy, 150, dec + dag, dec, on('desvio-da-agulha')) + lb(polar(cx, cy, 150, -23)[0] - 8, polar(cx, cy, 150, -23)[1] + 6, 'Dag 6° W', on('desvio-da-agulha'), 'end', on('desvio-da-agulha') ? 14 : 12);
    /* rumos: cada arco termina na linha da proa; o rótulo fica logo depois do fim, do lado de baixo da linha */
    var rumo = function (r, de, k, txt) {
      var f = polar(cx, cy, r, proa);
      return arco(cx, cy, r, de, proa, on(k)) + lb(f[0] + 8, f[1] + 18, txt, on(k), 'start', on(k) ? 14 : 12);
    };
    b += rumo(62, 0, 'rumo-verdadeiro', 'Rv 060°');
    b += rumo(120, dec, 'rumo-magnetico', 'Rmg 080°');
    b += rumo(178, dec + dag, 'rumo-da-agulha', 'Rag 086°');
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="currentColor"/>';
    return svg('10 0 440 310', 'Norte verdadeiro, magnético e da agulha, com declinação, desvio e rumos', b);
  };

  /* --- 13. Marcação verdadeira e relativa --- */
  F.marcacao = function (hl) {
    var b = '', bx = 120, by = 230, fx = 300, fy = 90;
    b += '<path d="M240,30 C280,50 330,40 380,60 L380,0 L240,0 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>';
    b += '<path d="M' + (fx - 7) + ',' + (fy + 8) + ' L' + fx + ',' + (fy - 16) + ' L' + (fx + 7) + ',' + (fy + 8) + ' Z" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="1.2"/>' + lb(fx + 12, fy, 'Farol', false, 'start', 13);
    b += seta(bx, by, bx, by - 150, 'currentColor', 1.4) + lb(bx, by - 158, 'Nv', false, 'middle', 13);
    b += '<line x1="' + bx + '" y1="' + by + '" x2="' + fx + '" y2="' + fy + '" stroke="' + (hl ? MG : 'currentColor') + '" stroke-width="2" stroke-dasharray="7 4"/>';
    b += barquinho(bx, by, 330, 1, 10, 1.6);
    var p = polar(bx, by, 110, 330); b += '<line x1="' + bx + '" y1="' + by + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/>' + lb(p[0] - 4, p[1] - 4, 'Proa 330°', false, 'end', 12);
    b += arco(bx, by, 72, 0, 52, hl === 'marcacao') + lb(polar(bx, by, 80, 20)[0] + 2, polar(bx, by, 80, 20)[1] - 2, 'Marcação verdadeira 052°', hl === 'marcacao', 'start', hl === 'marcacao' ? 14 : 12);
    b += arco(bx, by, 46, -30, 52, hl === 'marcacao-relativa') + lb(polar(bx, by, 54, 75)[0] + 6, polar(bx, by, 54, 75)[1] + 14, 'Marcação relativa 082°', hl === 'marcacao-relativa', 'start', hl === 'marcacao-relativa' ? 14 : 12);
    return svg('0 0 400 260', 'Marcação verdadeira medida do norte e marcação relativa medida da proa', b);
  };

  /* --- 14. Linhas de posição, ponto e alinhamento --- */
  F.ldp = function (hl) {
    var b = '', P = [215, 205];
    b += '<path d="M0,0 L420,0 L420,40 C370,60 330,52 300,74 C270,96 220,70 170,62 C120,54 60,80 0,70 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>';
    if (hl === 'alinhamento') {
      b += '<rect x="196" y="24" width="10" height="26" fill="currentColor"/><rect x="200" y="56" width="8" height="12" fill="currentColor"/>';
      b += '<line x1="201" y1="30" x2="216" y2="250" stroke="' + MG + '" stroke-width="2.4" stroke-dasharray="8 4"/>';
      b += barquinho(214, 228, 4, 1, 10, 1.4, true);
      b += lb(222, 30, 'marca posterior (mais alta)', false, 'start', 12) + lb(222, 78, 'marca anterior', false, 'start', 12);
      b += lb(240, 210, 'Alinhamento:', true, 'start', 14) + lb(240, 226, 'as duas marcas, uma', true, 'start', 13) + lb(240, 242, 'atrás da outra', true, 'start', 13);
      return svg('0 0 420 260', 'Alinhamento de duas marcas em terra', b);
    }
    var marcas = [[70, 70, 'Farol A'], [330, 66, 'Torre B'], [400, 170, 'Ponta C']];
    marcas.forEach(function (m, i) {
      b += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="5" fill="currentColor"/>' + lb(m[0] + (i === 2 ? -8 : 8), m[1] + (i === 2 ? -10 : -8), m[2], false, i === 2 ? 'end' : 'start', 13);
      var dx = P[0] - m[0], dy = P[1] - m[1], k = 1.35, off = [[0, 0], [3, -2], [-2, 4]][i];
      var on = hl === 'ponto' || (hl === 'linha-de-posicao' && i === 0);
      b += '<line x1="' + m[0] + '" y1="' + m[1] + '" x2="' + (m[0] + dx * k + off[0] * 6) + '" y2="' + (m[1] + dy * k + off[1] * 6) + '" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 2.4 : 1.3) + '"/>';
    });
    if (hl === 'linha-de-posicao') b += lb(8, 150, 'Linha de posição', true, 'start', 15) + lb(8, 166, '(marcação do farol A)', true, 'start', 12);
    if (hl === 'ponto') b += '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="12" fill="none" stroke="' + MG + '" stroke-width="2.4"/>' + fio(P[0] + 8, P[1] + 10, 262, 266, true) + lb(266, 278, 'Ponto: cruzamento das linhas', true, 'middle', 14);
    b += '<rect x="' + (P[0] - 3) + '" y="' + (P[1] - 3) + '" width="6" height="6" fill="currentColor"/>';
    return svg('0 0 420 ' + (hl === 'ponto' ? 288 : 260), 'Três linhas de posição por marcação cruzando no ponto', b);
  };

  /* --- 15. Latitude e longitude --- */
  F.latlon = function (hl) {
    var on = function (k) { return hl === k; }, b = '', cx = 200, cy = 170, R = 140;
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.6"/>';
    [-60, -30, 30, 60].forEach(function (la) { var yy = cy - R * Math.sin(la * Math.PI / 180), rx = R * Math.cos(la * Math.PI / 180); b += '<ellipse cx="' + cx + '" cy="' + yy.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.22).toFixed(1) + '" fill="none" stroke="' + (on('paralelo') && la === -30 ? MG : 'var(--sea-3)') + '" stroke-width="' + (on('paralelo') && la === -30 ? 2.6 : 1) + '"/>'; });
    b += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + R + '" ry="' + (R * 0.22) + '" fill="none" ' + tr(on('equador'), 1.8) + '/>';
    [0.3, 0.75].forEach(function (k, i) { b += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (R * k) + '" ry="' + R + '" fill="none" stroke="var(--sea-3)" stroke-width="1"/>'; });
    b += '<path d="M' + cx + ',' + (cy - R) + ' A' + (R * 0.45) + ',' + R + ' 0 0 0 ' + cx + ',' + (cy + R) + '" fill="none" ' + tr(on('meridiano'), 1.8) + '/>';
    b += '<line x1="' + cx + '" y1="' + (cy - R) + '" x2="' + cx + '" y2="' + (cy + R) + '" stroke="currentColor" stroke-width="1.4"/>';
    b += lb(cx + 6, cy - R - 8, 'Polo Norte', false, 'start', 12) + lb(cx + 6, cy + R + 18, 'Polo Sul', false, 'start', 12);
    b += lb(cx + R + 6, cy + 4, 'Equador', on('equador'), 'start', on('equador') ? 15 : 13);
    b += lb(cx + 4, cy - R + 26, 'Meridiano de Greenwich (0°)', false, 'start', 12);
    if (on('meridiano')) b += lb(cx - R * 0.45 - 6, cy - 60, 'Meridiano', true, 'end', 15) + lb(cx - R * 0.45 - 6, cy - 44, 'do ponto P', true, 'end', 13);
    // ponto P a 30° S, a oeste de Greenwich
    var px = cx - R * 0.45 * Math.cos(30 * Math.PI / 180) * 0.98, py = cy - R * Math.sin(-30 * Math.PI / 180) + 4;
    var ex = cx - R * 0.45 + 2, ey = cy + 30;
    b += '<path d="M' + ex.toFixed(1) + ',' + (cy + 4) + ' Q' + (ex - 4).toFixed(1) + ',' + (cy + 40) + ' ' + px.toFixed(1) + ',' + py.toFixed(1) + '" fill="none" stroke="' + (on('latitude') ? MG : 'currentColor') + '" stroke-width="' + (on('latitude') ? 3.2 : 1.4) + '"/>';
    b += '<path d="M' + cx + ',' + (cy + R * 0.22) + ' Q' + (cx - 30) + ',' + (cy + R * 0.22 - 1) + ' ' + ex.toFixed(1) + ',' + (cy + R * 0.2).toFixed(1) + '" fill="none" stroke="' + (on('longitude') ? MG : 'currentColor') + '" stroke-width="' + (on('longitude') ? 3.2 : 1.4) + '"/>';
    b += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="' + MG + '"/>' + lb(px - 8, py + 18, 'P', true, 'end', 14);
    b += lb(ex - 8, cy + 62, 'Latitude', on('latitude'), 'end', on('latitude') ? 15 : 12) + lb(cx - 46, cy + 48, 'Longitude', on('longitude'), 'start', on('longitude') ? 15 : 12);
    if (on('paralelo')) b += lb(cx + R * 0.87 + 4, cy + R * 0.5 + 5, 'Paralelo de 30° S', true, 'start', 14);
    return svg('0 0 470 340', 'Globo com equador, meridianos, paralelos, latitude e longitude', b);
  };

  /* --- 16. Ortodromia e loxodromia (carta de Mercator) --- */
  F.ortoloxo = function (hl) {
    var b = '';
    b += '<rect x="20" y="20" width="400" height="220" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.4"/>';
    for (var i = 1; i < 8; i++) b += '<line x1="' + (20 + i * 50) + '" y1="20" x2="' + (20 + i * 50) + '" y2="240" stroke="var(--sea-3)" stroke-width="0.8"/>';
    [70, 120, 166, 206].forEach(function (yy) { b += '<line x1="20" y1="' + yy + '" x2="420" y2="' + yy + '" stroke="var(--sea-3)" stroke-width="0.8"/>'; });
    var A = [60, 190], B = [380, 150];
    b += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" ' + tr(hl === 'loxodromia', 2) + '/>';
    b += '<path d="M' + A[0] + ',' + A[1] + ' Q220,60 ' + B[0] + ',' + B[1] + '" fill="none" ' + tr(hl === 'ortodromia', 2) + ' stroke-dasharray="7 4"/>';
    b += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="5" fill="currentColor"/><circle cx="' + B[0] + '" cy="' + B[1] + '" r="5" fill="currentColor"/>' + lb(A[0] - 6, A[1] + 20, 'A', false, 'middle', 14) + lb(B[0] + 6, B[1] + 22, 'B', false, 'middle', 14);
    b += lb(230, 196, 'Loxodromia: rumo constante (reta)', hl === 'loxodromia', 'middle', hl === 'loxodromia' ? 14 : 12);
    b += lb(220, 92, 'Ortodromia: menor distância (curva)', hl === 'ortodromia', 'middle', hl === 'ortodromia' ? 14 : 12);
    b += lb(410, 36, 'polo', false, 'end', 11) + seta(398, 50, 398, 30, 'currentColor', 1.2);
    return svg('10 10 420 240', 'Ortodromia e loxodromia numa carta de Mercator do Hemisfério Norte', b);
  };

  /* --- 17. Setores das luzes de navegação (RIPEAM, Regra 21) --- */
  F.luzes = function (hl) {
    var cx = 210, cy = 200, b = '';
    var on = function (k) { return hl === k || hl === 'luzes-de-navegacao'; };
    b += setor(cx, cy, 160, -112.5, 112.5, on('luz-de-mastro') ? MG : 'var(--ink-3)', on('luz-de-mastro') ? MG : 'currentColor', on('luz-de-mastro') ? 0.12 : 0.08);
    b += setor(cx, cy, 120, -112.5, 0, 'var(--nav-red)', 'var(--nav-red)', on('luzes-de-bordos') ? 0.5 : 0.3);
    b += setor(cx, cy, 120, 0, 112.5, 'var(--nav-green)', 'var(--nav-green)', on('luzes-de-bordos') ? 0.5 : 0.3);
    b += setor(cx, cy, 110, 112.5, 247.5, on('luz-de-alcancado') ? MG : 'var(--shoal-2)', on('luz-de-alcancado') ? MG : 'currentColor', on('luz-de-alcancado') ? 0.2 : 0.6);
    b += '<path d="M210,160 C222,174 225,194 223,214 L219,238 L201,238 L197,214 C195,194 198,174 210,160 Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>';
    b += lb(cx, 30, 'Luz de mastro: branca, 225°', on('luz-de-mastro'), 'middle', on('luz-de-mastro') ? 15 : 13);
    b += lb(cx - 70, 130, 'Bombordo', on('luzes-de-bordos'), 'middle', 13) + lb(cx - 70, 146, 'vermelha 112,5°', on('luzes-de-bordos'), 'middle', 12);
    b += lb(cx + 70, 130, 'Boreste', on('luzes-de-bordos'), 'middle', 13) + lb(cx + 70, 146, 'verde 112,5°', on('luzes-de-bordos'), 'middle', 12);
    b += lb(cx, 300, 'Luz de alcançado: branca, 135°', on('luz-de-alcancado'), 'middle', on('luz-de-alcancado') ? 15 : 13);
    b += '<line x1="' + (cx - 160) + '" y1="' + cy + '" x2="' + (cx + 160) + '" y2="' + cy + '" stroke="currentColor" stroke-width="0.6" stroke-dasharray="2 3"/>' + lb(cx + 162, cy + 4, 'través', false, 'start', 11);
    return svg('20 14 400 300', 'Setores de visibilidade das luzes de navegação vistos de cima', b);
  };

  /* --- 18. Marcas cardinais (IALA) --- */
  function pilar(x, y, faixas, tope, rot, txtLuz, on) {
    var s = '<g transform="translate(' + x + ',' + y + ')">', h = 54 / faixas.length;
    faixas.forEach(function (c, i) { s += '<rect x="-13" y="' + (i * h).toFixed(1) + '" width="26" height="' + h.toFixed(1) + '" fill="' + c + '"/>'; });
    s += '<rect x="-13" y="0" width="26" height="54" fill="none" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 2.6 : 1.2) + '"/>';
    s += '<line x1="0" y1="0" x2="0" y2="-10" stroke="currentColor" stroke-width="1.6"/>';
    var cone = function (yb, cima) { return cima ? '<polygon points="-8,' + yb + ' 8,' + yb + ' 0,' + (yb - 12) + '" fill="' + NAV_PRETO + '" stroke="currentColor" stroke-width="0.8"/>' : '<polygon points="-8,' + (yb - 12) + ' 8,' + (yb - 12) + ' 0,' + yb + '" fill="' + NAV_PRETO + '" stroke="currentColor" stroke-width="0.8"/>'; };
    if (tope === 'N') s += cone(-24, true) + cone(-10, true);
    if (tope === 'S') s += cone(-24, false) + cone(-10, false);
    if (tope === 'L') s += cone(-24, true) + cone(-10, false);
    if (tope === 'O') s += cone(-24, false) + cone(-10, true);
    s += '<path d="M-17,54 L17,54 L13,62 L-13,62 Z" fill="var(--shoal-2)" stroke="currentColor" stroke-width="1"/>';
    s += lb(0, 80, rot, on, 'middle', 14) + lb(0, 95, txtLuz, false, 'middle', 11) + '</g>';
    return s;
  }
  F.cardinais = function (hl) {
    var on = hl === 'marca-cardinal', P = NAV_PRETO, A = 'var(--nav-yellow)', b = '';
    b += '<circle cx="230" cy="190" r="34" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4"/>';
    b += '<path d="M218,196 L224,182 L232,186 L240,180 L244,194 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>' + lb(230, 214, 'perigo', false, 'middle', 12);
    b += pilar(230, 38, [P, A], 'N', 'Norte', 'Q ou VQ contínua', on);
    b += pilar(390, 156, [P, A, P], 'L', 'Leste', 'Q(3) ou VQ(3)', on);
    b += pilar(230, 262, [A, P], 'S', 'Sul', 'Q(6)+LFl ou VQ(6)+LFl', on);
    b += pilar(70, 156, [A, P, A], 'O', 'Oeste', 'Q(9) ou VQ(9)', on);
    return svg('0 0 460 370', 'Marcas cardinais Norte, Leste, Sul e Oeste em volta de um perigo', b);
  };

  /* --- 19. Marcas laterais da Região B --- */
  F.laterais = function (hl) {
    var b = '', on = hl === 'marca-lateral' || hl === 'iala-regiao-b';
    b += '<rect x="0" y="0" width="460" height="230" fill="var(--sea-1)"/>';
    b += '<path d="M0,0 L120,0 C110,60 116,120 96,160 L0,170 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/><path d="M460,0 L340,0 C352,60 346,120 366,160 L460,170 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.2"/>';
    b += lb(230, 30, 'Porto', false, 'middle', 14);
    b += seta(230, 216, 230, 120, MG, 3) + lb(242, 206, 'entrando do mar', true, 'start', 13);
    // bombordo: verde cilíndrica
    b += '<g transform="translate(150,110)"><rect x="-14" y="-6" width="28" height="34" fill="var(--nav-green)" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 2.4 : 1.2) + '"/><line x1="0" y1="-6" x2="0" y2="-18" stroke="currentColor" stroke-width="1.6"/><rect x="-6" y="-30" width="12" height="12" fill="var(--nav-green)" stroke="currentColor" stroke-width="1"/></g>';
    b += lb(150, 160, 'Bombordo', on, 'middle', 14) + lb(150, 175, 'verde, cilíndrica', false, 'middle', 12);
    // boreste: vermelha cônica
    b += '<g transform="translate(310,110)"><path d="M-15,28 L15,28 L8,-8 L-8,-8 Z" fill="var(--nav-red)" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 2.4 : 1.2) + '"/><line x1="0" y1="-8" x2="0" y2="-18" stroke="currentColor" stroke-width="1.6"/><polygon points="-7,-18 7,-18 0,-31" fill="var(--nav-red)" stroke="currentColor" stroke-width="1"/></g>';
    b += lb(310, 160, 'Boreste', on, 'middle', 14) + lb(310, 175, 'vermelha, cônica', false, 'middle', 12);
    return svg('0 0 460 230', 'Marcas laterais do sistema IALA Região B vistas por quem entra do mar', b);
  };

  /* --- 20. Outras marcas: perigo isolado, águas seguras, especial, naufrágio --- */
  F.outras = function (hl) {
    var b = '', P = NAV_PRETO, V = 'var(--nav-red)', W = 'var(--nav-white)', Y = 'var(--nav-yellow)', Z = NAV_AZUL;
    var marca = function (x, k, nome, luz, faixasH, faixasV, tope) {
      var on = hl === k, s = '<g transform="translate(' + x + ',70)">';
      if (faixasH) { var h = 60 / faixasH.length; faixasH.forEach(function (c, i) { s += '<rect x="-14" y="' + (i * h) + '" width="28" height="' + h + '" fill="' + c + '"/>'; }); }
      if (faixasV) { var w = 28 / faixasV.length; faixasV.forEach(function (c, i) { s += '<rect x="' + (-14 + i * w) + '" y="0" width="' + w + '" height="60" fill="' + c + '"/>'; }); }
      s += '<rect x="-14" y="0" width="28" height="60" fill="none" stroke="' + (on ? MG : 'currentColor') + '" stroke-width="' + (on ? 2.6 : 1.2) + '"/><line x1="0" y1="0" x2="0" y2="-10" stroke="currentColor" stroke-width="1.6"/>' + tope;
      s += lb(0, 82, nome[0], on, 'middle', 13) + (nome[1] ? lb(0, 97, nome[1], on, 'middle', 13) : '') + lb(0, 116, luz, false, 'middle', 11) + '</g>';
      return s;
    };
    var esf = function (cy, cor) { return '<circle cx="0" cy="' + cy + '" r="6" fill="' + cor + '" stroke="currentColor" stroke-width="0.8"/>'; };
    b += marca(60, 'perigo-isolado', ['Perigo', 'isolado'], 'Fl(2) branca', [P, V, P], null, esf(-17, P) + esf(-30, P));
    b += marca(170, 'aguas-seguras', ['Águas', 'seguras'], 'Iso, Oc, LFl 10s ou Mo(A)', null, [V, W, V, W], esf(-17, V));
    b += marca(280, 'marca-especial', ['Marca', 'especial'], 'luz amarela', [Y], null, '<path d="M-7,-27 L7,-13 M7,-27 L-7,-13" stroke="' + Y + '" stroke-width="3.4"/><path d="M-7,-27 L7,-13 M7,-27 L-7,-13" stroke="currentColor" stroke-width="0.8" fill="none"/>');
    b += marca(390, 'marca-de-naufragio', ['Naufrágio', 'recente'], 'Al Bu Y', null, [Z, Y, Z, Y], '<path d="M0,-30 L0,-12 M-8,-21 L8,-21" stroke="' + Y + '" stroke-width="3.6"/>');
    return svg('0 30 450 170', 'Marcas de perigo isolado, águas seguras, especial e de naufrágio recente', b);
  };

  /* --- 21. Esfera celeste local --- */
  F.esfera = function (hl) {
    var on = function (k) { return hl === k; }, b = '', cx = 200, cy = 220;
    b += '<path d="M30,220 A170,170 0 0 1 370,220" fill="var(--sea-1)" fill-opacity="0.5" stroke="var(--line)" stroke-width="1"/>';
    b += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="170" ry="48" fill="var(--shoal)" fill-opacity="0.7" ' + tr(on('horizonte'), 1.6) + '/>';
    b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="50" ' + tr(on('zenite'), 1.2) + ' stroke-dasharray="4 3"/><line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="320" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4"/>';
    b += '<circle cx="' + cx + '" cy="50" r="' + (on('zenite') ? 6 : 4) + '" fill="' + (on('zenite') ? MG : 'currentColor') + '"/>' + lb(cx + 10, 46, 'Zênite', on('zenite'), 'start', on('zenite') ? 15 : 13);
    b += '<circle cx="' + cx + '" cy="320" r="' + (on('nadir') ? 6 : 4) + '" fill="' + (on('nadir') ? MG : 'currentColor') + '"/>' + lb(cx + 10, 324, 'Nadir', on('nadir'), 'start', on('nadir') ? 15 : 13);
    var H = [285, 261.6], S = [262, 116];
    b += '<path d="M' + H.join(',') + ' Q300,140 ' + cx + ',50" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>';
    b += '<path d="M' + H.join(',') + ' Q292,182 ' + S.join(',') + '" fill="none" ' + tr(on('altura'), 1.6) + '/>';
    b += '<path d="M' + S.join(',') + ' Q248,72 ' + cx + ',50" fill="none" ' + tr(on('distancia-zenital'), 1.6) + '/>';
    b += '<path d="M370,220 A170,48 0 0 1 ' + H.join(',') + '" fill="none" ' + tr(on('azimute'), on('azimute') ? 2.2 : 1.6) + '/>';
    b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + H[0] + '" y2="' + H[1] + '" stroke="currentColor" stroke-width="0.8"/><line x1="' + cx + '" y1="' + cy + '" x2="' + S[0] + '" y2="' + S[1] + '" stroke="currentColor" stroke-width="0.8"/>';
    b += '<path d="M' + S[0] + ',' + (S[1] - 9) + ' l2.6,6 6.4,.6 -4.8,4.2 1.4,6.2 -5.6,-3.2 -5.6,3.2 1.4,-6.2 -4.8,-4.2 6.4,-.6 Z" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="0.8"/>' + lb(S[0] + 12, S[1] - 4, 'Astro', false, 'start', 13);
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="currentColor"/>' + lb(cx - 6, cy + 16, 'Observador', false, 'end', 12);
    b += lb(22, 224, 'S', false, 'end', 14) + lb(378, 224, 'N', false, 'start', 14) + lb(cx, 286, 'E', false, 'middle', 14) + lb(cx, 166, 'W', false, 'middle', 12);
    b += lb(300, 196, 'Altura (a)', on('altura'), 'start', on('altura') ? 15 : 13);
    b += lb(236, 84, 'Distância zenital', on('distancia-zenital'), 'start', on('distancia-zenital') ? 14 : 12);
    b += lb(346, 266, 'Azimute (Az)', on('azimute'), 'start', on('azimute') ? 15 : 13) + lb(346, 281, 'do norte, pelo leste', on('azimute'), 'start', 11);
    b += lb(46, 198, 'Horizonte', on('horizonte'), 'start', on('horizonte') ? 15 : 13);
    return svg('0 30 470 300', 'Esfera celeste local com zênite, nadir, horizonte, altura e azimute de um astro', b);
  };

  /* --- 22. Sextante --- */
  F.sextante = function () {
    var b = '', O = [200, 46];
    var arc = function (r, a) { var t = a * Math.PI / 180; return [(O[0] + r * Math.cos(t)).toFixed(1), (O[1] + r * Math.sin(t)).toFixed(1)]; };
    var a1 = arc(220, 60), a2 = arc(220, 120);
    b += '<path d="M' + O.join(',') + ' L' + a2.join(',') + ' A220,220 0 0 0 ' + a1.join(',') + ' Z" fill="var(--shoal)" stroke="currentColor" stroke-width="1.8"/>';
    for (var g = 62; g <= 118; g += 4) { var p = arc(212, g), q = arc(220, g); b += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="currentColor" stroke-width="1"/>'; }
    var ia = arc(236, 100);
    b += '<line x1="' + O[0] + '" y1="' + O[1] + '" x2="' + ia[0] + '" y2="' + ia[1] + '" stroke="' + MG + '" stroke-width="5" stroke-linecap="round"/>';
    b += '<circle cx="' + ia[0] + '" cy="' + ia[1] + '" r="11" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>';
    b += '<rect x="186" y="30" width="28" height="12" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.4"/>';
    b += '<rect x="112" y="104" width="10" height="26" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.4" transform="rotate(-20 117 117)"/>';
    b += '<rect x="214" y="110" width="78" height="16" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1.6" transform="rotate(-8 253 118)"/>';
    b += lb(222, 26, 'Espelho grande', false, 'start', 13) + lb(104, 100, 'Espelho pequeno', false, 'end', 13) + lb(300, 108, 'Luneta', false, 'start', 13);
    b += lb(236, 228, 'Alidade', true, 'start', 13) + lb(ia[0] - 16, +ia[1] + 22, 'Tambor micrométrico', false, 'end', 13) + lb(318, 258, 'Limbo (arco graduado)', false, 'start', 13);
    return svg('-20 10 490 300', 'Sextante com espelhos, luneta, alidade, tambor e limbo', b);
  };

  /* --- 23. Centros de pressão no Hemisfério Sul --- */
  F.pressao = function (tipo) {
    var b = '', cx = 210, cy = 150, baixa = tipo !== 'alta';
    [40, 78, 116].forEach(function (r, i) { b += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (r * 1.35) + '" ry="' + r + '" fill="none" stroke="currentColor" stroke-width="1.4"/>' + lb(cx + r * 1.35 + 4, cy - 4, (baixa ? 1000 - i * -4 : 1024 - i * 4) + '', false, 'start', 11); });
    b += '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" font-size="30" font-weight="800" fill="' + MG + '">' + (baixa ? 'B' : 'A') + '</text>';
    for (var k = 0; k < 8; k++) {
      var ang = k * 45, r = 96, rx = r * 1.35, t = (ang - 90) * Math.PI / 180;
      var x = cx + rx * Math.cos(t), y = cy + r * Math.sin(t);
      var tx = -Math.sin(t) * rx, ty = Math.cos(t) * r, n = Math.sqrt(tx * tx + ty * ty); tx /= n; ty /= n;
      var ix = (cx - x), iy = (cy - y), m = Math.sqrt(ix * ix + iy * iy); ix /= m; iy /= m;
      // HS: baixa gira no sentido horário (convergindo); alta no anti-horário (divergindo)
      var dx = baixa ? (tx * 0.9 + ix * 0.4) : (-tx * 0.9 - ix * 0.4), dy = baixa ? (ty * 0.9 + iy * 0.4) : (-ty * 0.9 - iy * 0.4);
      b += seta((x - dx * 14).toFixed(1), (y - dy * 14).toFixed(1), (x + dx * 14).toFixed(1), (y + dy * 14).toFixed(1), 'currentColor', 1.8);
    }
    b += lb(cx, 296, 'Hemisfério Sul: ' + (baixa ? 'na baixa, o vento gira no sentido horário e converge' : 'na alta, o vento gira no sentido anti-horário e diverge'), false, 'middle', 12);
    return svg('0 20 420 290', baixa ? 'Centro de baixa pressão no Hemisfério Sul' : 'Centro de alta pressão no Hemisfério Sul', b);
  };

  /* --- 24. Frentes no Hemisfério Sul ---
     Os símbolos ficam do lado para onde a frente avança. Fria: triângulos para o ar quente (nordeste).
     Quente: semicírculos para o ar frio, que no Hemisfério Sul fica do lado do polo (sul). */
  F.frente = function (tipo) {
    var b = '', fria = tipo !== 'quente';
    b += '<rect x="0" y="0" width="460" height="230" fill="var(--sea-1)" fill-opacity="0.6"/>';
    var pts = fria ? [[60, 20], [150, 70], [240, 120], [330, 170], [410, 214]] : [[24, 96], [124, 104], [224, 112], [324, 120], [424, 128]];
    b += '<polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="' + (fria ? NAV_AZUL : 'var(--nav-red)') + '" stroke-width="3"/>';
    for (var i = 0; i < 4; i++) {
      var a = pts[i], c = pts[i + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], n = Math.sqrt(dx * dx + dy * dy), ux = dx / n, uy = dy / n, nx = uy, ny = -ux;
      if (fria) b += '<polygon points="' + (mx - ux * 12).toFixed(1) + ',' + (my - uy * 12).toFixed(1) + ' ' + (mx + ux * 12).toFixed(1) + ',' + (my + uy * 12).toFixed(1) + ' ' + (mx + nx * 16).toFixed(1) + ',' + (my + ny * 16).toFixed(1) + '" fill="' + NAV_AZUL + '"/>';
      else b += '<path d="M' + (mx - ux * 12).toFixed(1) + ',' + (my - uy * 12).toFixed(1) + ' A12,12 0 0 0 ' + (mx + ux * 12).toFixed(1) + ',' + (my + uy * 12).toFixed(1) + ' Z" fill="var(--nav-red)"/>';
    }
    if (fria) {
      b += lb(90, 190, 'Ar frio', true, 'middle', 16) + lb(90, 208, 'vento de S/SW, pressão subindo', false, 'middle', 11);
      b += lb(360, 56, 'Ar quente e úmido', false, 'middle', 15) + lb(360, 74, 'vento de N/NW, pressão caindo', false, 'middle', 11);
      b += seta(250, 166, 300, 116, MG, 2.6) + lb(306, 132, 'avança para nordeste', true, 'start', 12);
      b += seta(100, 150, 130, 112, 'currentColor', 1.8) + seta(330, 92, 360, 120, 'currentColor', 1.8);
    } else {
      b += lb(160, 46, 'Ar quente', true, 'middle', 16) + lb(160, 64, 'atrás da frente', false, 'middle', 11);
      b += lb(160, 176, 'Ar frio', false, 'middle', 15) + lb(160, 194, 'à frente, do lado do polo', false, 'middle', 11);
      b += seta(330, 54, 330, 152, MG, 2.6) + lb(342, 168, 'avança sobre', true, 'start', 12) + lb(342, 183, 'o ar frio', true, 'start', 12);
      b += lb(230, 220, 'O ar quente sobe devagar por cima do ar frio', false, 'middle', 12);
    }
    b += lb(452, 22, 'N', false, 'end', 13) + seta(440, 46, 440, 28, 'currentColor', 1.4);
    return svg('0 0 460 230', fria ? 'Frente fria avançando para nordeste no Hemisfério Sul' : 'Frente quente no Hemisfério Sul, com o ar frio do lado do polo', b);
  };

  /* --- 25. Vento real, vento do movimento e vento aparente --- */
  F.vento = function (hl) {
    /* barco rumando para cima (norte da figura) com o vento real entrando por boreste: retranca a bombordo */
    var b = '', S = [400, 70], V = [260, 70], M = [260, 170];
    b += barquinho(34, 204, 0, -1, 24, 1.7) + seta(34, 166, 34, 140, 'currentColor', 1.6) + lb(34, 132, 'rumo', false, 'middle', 12);
    b += seta(S[0], S[1], V[0], V[1], hl === 'vento-real' ? MG : 'currentColor', hl === 'vento-real' ? 3 : 2.2) + lb((S[0] + V[0]) / 2, S[1] - 10, 'Vento real', hl === 'vento-real', 'middle', hl === 'vento-real' ? 15 : 13);
    b += seta(V[0], V[1], M[0], M[1], 'currentColor', 2.2) + lb(V[0] - 8, 118, 'Vento do movimento', false, 'end', 12) + lb(V[0] - 8, 132, '(igual à velocidade do barco)', false, 'end', 11);
    b += seta(S[0], S[1], M[0], M[1], hl === 'vento-aparente' ? MG : 'currentColor', hl === 'vento-aparente' ? 3 : 2) + lb(346, 150, 'Vento aparente', hl === 'vento-aparente', 'start', hl === 'vento-aparente' ? 15 : 13);
    b += lb(240, 238, 'O vento aparente vem mais de proa que o real e, da bolina ao través,', false, 'middle', 11);
    b += lb(240, 252, 'é mais forte que ele; com vento de popa, fica mais fraco.', false, 'middle', 11);
    return svg('10 30 470 232', 'Triângulo de ventos: vento real, vento do movimento e vento aparente', b);
  };

  /* --- 26. Abatimento e triângulo de corrente --- */
  F.abatimento = function () {
    var b = '';
    [70, 130, 190].forEach(function (y) { b += seta(18, y, 72, y, 'currentColor', 1.8); });
    b += lb(44, 226, 'vento', false, 'middle', 12);
    b += barquinho(200, 196, 0, 1, 18, 1.8);
    b += seta(200, 170, 200, 40, 'currentColor', 1.6) + lb(194, 40, 'proa', false, 'end', 13);
    b += seta(200, 170, 236, 44, MG, 2.6) + lb(244, 50, 'caminho na água', true, 'start', 13);
    b += arco(200, 170, 80, 0, 16, true) + lb(222, 82, 'abatimento', true, 'start', 14);
    return svg('0 20 400 220', 'Abatimento: o vento empurra o barco para sotavento', b);
  };
  F.corrente = function (hl) {
    var b = '', A = [60, 220], B = [300, 70], C = [360, 150];
    b += seta(A[0], A[1], B[0], B[1], 'currentColor', 2.2) + lb(160, 128, 'Rumo e velocidade', false, 'end', 13) + lb(160, 144, 'na superfície', false, 'end', 13);
    b += seta(B[0], B[1], C[0], C[1], hl === 'corrente' ? MG : 'currentColor', hl === 'corrente' ? 3 : 2.2) + lb(338, 100, 'Corrente', hl === 'corrente', 'start', hl === 'corrente' ? 15 : 13) + lb(338, 116, '(para onde vai)', false, 'start', 11);
    b += seta(A[0], A[1], C[0], C[1], hl === 'rumo-no-fundo' ? MG : 'currentColor', hl === 'rumo-no-fundo' ? 3 : 2) + lb(222, 204, 'Rumo e velocidade no fundo', hl === 'rumo-no-fundo', 'middle', hl === 'rumo-no-fundo' ? 15 : 13);
    b += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="4" fill="currentColor"/>';
    return svg('20 50 400 190', 'Triângulo de corrente: superfície, corrente e fundo', b);
  };

  /* --- 27. Marcas diurnas (RIPEAM) --- */
  F.marcasDiurnas = function () {
    var b = '', K = 'currentColor';
    var bola = function (y) { return '<circle cx="0" cy="' + y + '" r="9" fill="' + K + '"/>'; };
    var coneB = function (y) { return '<polygon points="-10,' + (y - 9) + ' 10,' + (y - 9) + ' 0,' + (y + 9) + '" fill="' + K + '"/>'; };
    var coneC = function (y) { return '<polygon points="-10,' + (y + 9) + ' 10,' + (y + 9) + ' 0,' + (y - 9) + '" fill="' + K + '"/>'; };
    var los = function (y) { return '<polygon points="0,' + (y - 12) + ' 9,' + y + ' 0,' + (y + 12) + ' -9,' + y + '" fill="' + K + '"/>'; };
    var cil = function (y) { return '<rect x="-7" y="' + (y - 12) + '" width="14" height="24" fill="' + K + '"/>'; };
    var itens = [
      [bola(40), 'Fundeada', 'uma bola'], [coneB(40), 'A vela e a motor', 'cone, vértice para baixo'],
      [cil(40), 'Restrita pelo calado', 'cilindro'], [bola(28) + bola(52), 'Sem governo', 'duas bolas'],
      [bola(14) + los(40) + bola(66), 'Manobrabilidade', 'restrita'], [coneB(28) + coneC(52), 'Pescando', 'vértices unidos'],
      [los(40), 'Reboque', 'maior que 200 m'], [bola(14) + bola(40) + bola(66), 'Encalhada', 'três bolas']];
    itens.forEach(function (it, i) {
      var x = 72 + (i % 4) * 136, y = i < 4 ? 0 : 140;
      b += '<g transform="translate(' + x + ',' + y + ')">' + it[0] + lb(0, 100, it[1], false, 'middle', 13) + lb(0, 116, it[2], false, 'middle', 12) + '</g>';
    });
    return svg('0 0 544 270', 'Marcas diurnas do RIPEAM', b);
  };

  /* --- 28. Ondas --- */
  F.ondas = function (hl) {
    var b = '', d = '';
    for (var x = 10; x <= 450; x += 4) d += (d ? ' L' : 'M') + x + ',' + (110 - 40 * Math.sin((x - 10) / 220 * 2 * Math.PI)).toFixed(1);
    b += '<path d="' + d + ' L450,190 L10,190 Z" fill="var(--sea-2)" fill-opacity="0.6"/><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2"/>';
    b += '<line x1="10" y1="110" x2="450" y2="110" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/>';
    b += cota(65, 70, 285, 70, hl === 'comprimento-de-onda') + lb(175, 60, 'Comprimento (λ)', hl === 'comprimento-de-onda', 'middle', 13);
    b += cota(395, 70, 395, 150, hl === 'altura-de-onda') + lb(405, 112, 'Altura (H)', hl === 'altura-de-onda', 'start', 13);
    b += lb(65, 60, '', false) + lb(65, 88, 'crista', false, 'middle', 12) + lb(175, 168, 'cavado', false, 'middle', 12);
    b += lb(230, 212, 'Período (T): tempo entre duas cristas passando no mesmo ponto', false, 'middle', 12);
    return svg('0 40 480 180', 'Elementos de uma onda: crista, cavado, altura e comprimento', b);
  };

  /* --- 29. Triângulo do fogo --- */
  F.fogo = function () {
    var b = '<polygon points="180,30 330,250 30,250" fill="var(--erro-soft)" stroke="var(--erro)" stroke-width="2.4"/>';
    b += lb(92, 136, 'Combustível', false, 'end', 15) + lb(270, 136, 'Comburente', false, 'start', 15) + lb(270, 152, '(oxigênio do ar)', false, 'start', 12) + lb(180, 276, 'Calor', false, 'middle', 15);
    b += lb(180, 186, 'reação em', false, 'middle', 12) + lb(180, 202, 'cadeia', false, 'middle', 12);
    return svg('-10 10 380 280', 'Triângulo do fogo: combustível, comburente e calor', b);
  };

  /* --- 30. Trecho de carta náutica: isóbatas e sondagens --- */
  F.carta = function (hl) {
    var b = '';
    b += '<rect x="0" y="0" width="440" height="260" fill="var(--paper)"/>';
    b += '<path d="M0,0 L250,0 C230,40 200,60 170,90 C140,120 90,130 0,140 Z" fill="var(--sea-2)" fill-opacity="0.9"/>';
    b += '<path d="M0,0 L190,0 C175,30 150,50 125,70 C100,90 60,100 0,104 Z" fill="var(--land)" stroke="currentColor" stroke-width="1.4"/>';
    /* rótulos das isóbatas sobre a própria linha; cada sondagem fica do lado certo da sua isóbata (conferido) */
    b += '<path d="M250,0 C230,40 200,60 170,90 C140,120 90,130 0,140" fill="none" ' + tr(hl === 'isobata', 1.2) + '/>' + lb(184, 79, '5', hl === 'isobata', 'middle', 12);
    b += '<path d="M330,0 C300,60 260,100 220,130 C170,168 100,180 0,186" fill="none" ' + tr(hl === 'isobata', 1.2) + '/>' + lb(240, 119, '10', hl === 'isobata', 'middle', 12);
    b += '<path d="M440,30 C390,100 330,160 260,200 C200,230 120,236 0,240" fill="none" ' + (hl === 'isobata' ? tr(true, 1.2) : 'stroke="var(--sea-3)" stroke-width="1.2"') + '/>' + lb(300, 178, '20', hl === 'isobata', 'middle', 12);
    var s = [[80, 124, '3'], [138, 100, '4'], [60, 162, '7'], [176, 130, '8'], [120, 210, '14'], [270, 150, '12'], [340, 120, '17'], [360, 210, '23'], [226, 232, '21'], [400, 160, '25']];
    s.forEach(function (p) { b += '<text x="' + p[0] + '" y="' + p[1] + '" font-size="14" font-style="italic" text-anchor="middle" fill="' + (hl === 'sondagem' ? MG : 'currentColor') + '" font-weight="' + (hl === 'sondagem' ? 700 : 400) + '">' + p[2] + '</text>'; });
    b += '<text x="300" y="90" font-size="15" text-anchor="middle" fill="currentColor">+</text>' + lb(310, 82, 'pedra submersa', false, 'start', 11);
    if (hl === 'isobata') b += lb(420, 250, 'Isóbatas de 5, 10 e 20 m', true, 'end', 14);
    if (hl === 'sondagem') b += lb(420, 250, 'Sondagens em metros, abaixo do NR', true, 'end', 14);
    if (hl === 'carta-nautica') b += lb(420, 250, 'Trecho de carta de treinamento (fictícia)', true, 'end', 13);
    b += lb(40, 60, 'Terra', false, 'start', 13);
    return svg('0 0 440 260', 'Trecho fictício de carta náutica com terra, isóbatas e sondagens', b);
  };


  /* ===================== Categorias, fontes e ajudantes ===================== */
  var CONSULTA = '2026-10-07';
  var CATS = [
    { id: 'casco', nome: 'Casco e embarcação', curto: 'Casco' },
    { id: 'aparelho', nome: 'Mastreação e ferragens', curto: 'Mastreação' },
    { id: 'velas', nome: 'Velas', curto: 'Velas' },
    { id: 'manobra', nome: 'Manobra e mareação', curto: 'Manobra' },
    { id: 'marinharia', nome: 'Cabos, nós e âncoras', curto: 'Cabos e nós' },
    { id: 'navegacao', nome: 'Navegação e instrumentos', curto: 'Navegação' },
    { id: 'carta', nome: 'Cartas, marés e balizamento', curto: 'Cartas e marés' },
    { id: 'astro', nome: 'Navegação astronômica', curto: 'Astronomia' },
    { id: 'meteo', nome: 'Meteorologia e mar', curto: 'Meteorologia' },
    { id: 'ripeam', nome: 'RIPEAM: regras, luzes e sinais', curto: 'RIPEAM' },
    { id: 'seguranca', nome: 'Segurança e sobrevivência', curto: 'Segurança' },
    { id: 'radio', nome: 'Rádio e comunicações', curto: 'Rádio' },
    { id: 'legislacao', nome: 'Legislação e órgãos', curto: 'Legislação' },
    { id: 'prova', nome: 'Prova e estudo', curto: 'Prova' },
  ];

  /* Endereços oficiais conferidos em 2026-10-07 (ver também data/referencias.js). */
  var URL = {
    n211: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf',
    n212: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-212.pdf',
    lesta: 'https://www.planalto.gov.br/ccivil_03/leis/l9537.htm',
    rlesta: 'https://www.planalto.gov.br/ccivil_03/decreto/d2596.htm',
    lcp97: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp97.htm',
    iala: 'https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm',
    colreg: 'https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx',
    normas: 'https://www.marinha.mil.br/dpc/normas-autoridade-maritima-brasileira',
    capitanias: 'https://www.marinha.mil.br/dpc/localize-capitania/',
    indenizacoes: 'https://www.marinha.mil.br/dpc/tabelas-de-indenizacoes',
    dhn: 'https://www.marinha.mil.br/dhn/',
    chm: 'https://www.marinha.mil.br/chm/',
    carta12000: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/carta-12000-int-1',
    farois: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois',
    roteiros: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/roteiros',
    tabuas: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/tabuas-das-mares',
    correntesMare: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-2',
    cartasPiloto: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3',
    almanaque: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/almanaque-nautico',
    avisos: 'https://www.marinha.mil.br/chm/dados-do-segnav-aviso-aos-navegantes-tela',
    cartas: 'https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas',
    sinoticas: 'https://www.marinha.mil.br/chm/cartassinoticas',
    mauTempo: 'https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo',
    meteoromarinha: 'https://www.marinha.mil.br/chm/dados-do-smm-meteoromarinha/previsao-24-horas',
    salvamar: 'https://www.marinha.mil.br/salvamarbrasil/',
    infosar: 'https://infosar.decea.mil.br/',
    cospas: 'https://www.cospas-sarsat.int/',
    pilot: 'https://msi.nga.mil/Publications/APC',
    osr: 'https://www.sailing.org/inside-world-sailing/rules-regulations/offshore-special-regulations/',
    /* Fontes acrescentadas em 2026-10-09 (conferidas nessa data) */
    miguens1: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf',
    miguens3: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf',
    nws: 'https://forecast.weather.gov/glossary.php',
    noaaGiro: 'https://oceanservice.noaa.gov/facts/gyre.html',
    noaaRessurgencia: 'https://oceanservice.noaa.gov/facts/upwelling.html',
    wmm: 'https://www.ncei.noaa.gov/products/world-magnetic-model',
    solas: 'https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx',
    sar: 'https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Maritime-Search-and-Rescue-(SAR).aspx',
    imo: 'https://www.imo.org/en/About/Pages/Default.aspx',
    fadiga: 'https://wwwcdn.imo.org/localresources/en/OurWork/HumanElement/Documents/MSC.1-Circ.1598%20(2).pdf',
    swedishClub: 'https://www.swedishclub.com/uploads/2023/12/Bridge-Instructions-web_The-Swedish-Club.pdf',
    mcaPonte: 'https://assets.publishing.service.gov.uk/media/64b659a171749c000d89ed25/13._Deck_-_Management_of_Bridge_Operations_.pdf',
    niosh: 'https://www.cdc.gov/niosh/cold-stress/about/related-illness.html',
    medline: 'https://medlineplus.gov/dehydration.html',
    navarea5: 'https://iho.int/uploads/user/Inter-Regional%20Coordination/WWNWS/WWNWS16/WWNWS16_2024_3.2-V_EN_NAVAREA%20V%20Self%20Assessment.pdf',
    metarea5: 'https://wwmiws.wmo.int/index.php/metareas/affiche/5',
    infosar2: 'https://infosar.decea.mil.br/',
    brmcc: 'https://www2.fab.mil.br/brmcc/index.php/codificacao',
    publicacoesChm: 'https://www.marinha.mil.br/chm/dados-do-segnav/publicacoes',
    cpa2026: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/CPA-II-2026-MATRIZ.pdf',
    dpcCpa: 'https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador',
    npcpce: 'https://www.marinha.mil.br/cpce/sites/www.marinha.mil.br.cpce/files/upload/Anexo-3-A-da-NPCP-CE.pdf',
  };
  function n211(loc) { return { txt: 'NORMAM-211/DPC', url: URL.n211, loc: loc }; }
  function lesta(loc) { return { txt: 'Lei nº 9.537/1997 (LESTA)', url: URL.lesta, loc: loc }; }
  function mig1(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2ª rev. 2023)', url: URL.miguens1, loc: loc }; }
  function mig3(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. III (DHN, 1ª rev. 2026)', url: URL.miguens3, loc: loc }; }
  function nws(verbete) { return { txt: 'NOAA/NWS, Glossary', url: URL.nws, loc: 'verbete “' + verbete + '”' }; }
  function rip(regra) { return { txt: 'RIPEAM-72 (COLREG, IMO)', url: URL.colreg, loc: regra }; }

  /* t(id, termo, categoria, definição, {en, sin, ver, fig:[figura, destaque], legenda, widget, fonte, link, aconfirmar, intl}) */
  var T = [];
  function t(id, termo, cat, def, o) {
    var x = o || {};
    x.id = id; x.termo = termo; x.categoria = cat; x.def = def;
    T.push(x);
    return x;
  }

  /* ===================== Casco e embarcação ===================== */
  t('proa', 'Proa', 'casco', 'Parte da frente da embarcação. Também indica direção: <em>pela proa</em> quer dizer à frente do barco.',
    { en: 'bow', ver: ['popa', 'bochecha', 'roda-de-proa', 'avante'], fig: ['barco', 'proa'] });
  t('popa', 'Popa', 'casco', 'Parte de trás da embarcação. <em>Pela popa</em> quer dizer atrás do barco.',
    { en: 'stern', ver: ['proa', 'alheta', 'espelho-de-popa', 'a-re'], fig: ['barco', 'popa'] });
  t('bombordo', 'Bombordo', 'casco', 'Lado esquerdo da embarcação para quem está a bordo olhando para a proa. Abreviatura BB. À noite, esse lado é marcado pela luz vermelha.',
    { en: 'port', ver: ['boreste', 'luzes-de-bordos', 'traves'], fig: ['direcoes', 'bombordo'], widget: { w: 'ripeam-luzes', opts: { tipo: 'vela', aspecto: 270 }, rotulo: 'Ver as luzes de bordos' } });
  t('boreste', 'Boreste', 'casco', 'Lado direito da embarcação para quem está a bordo olhando para a proa. Abreviatura BE. À noite, esse lado é marcado pela luz verde. <em>Estibordo</em> é a forma usada em Portugal; no Brasil se diz boreste, que não se confunde com bombordo nas ordens de voz.',
    { en: 'starboard', sin: ['estibordo'], ver: ['bombordo', 'luzes-de-bordos', 'traves'], fig: ['direcoes', 'boreste'], widget: { w: 'ripeam-luzes', opts: { tipo: 'vela', aspecto: 90 }, rotulo: 'Ver as luzes de bordos' } });
  t('traves', 'Través', 'casco', 'Direção perpendicular à linha de proa e popa, a 90° da proa, por boreste ou por bombordo. Um farol <em>pelo través de boreste</em> está bem ao lado direito do barco.',
    { en: 'abeam (on the beam)', ver: ['bochecha', 'alheta', 'vento-de-traves', 'marcacao-relativa'], fig: ['direcoes', 'traves'] });
  t('bochecha', 'Bochecha', 'casco', 'Direção a meio caminho entre a proa e o través (45° da proa, de cada bordo). Também é a região do casco junto à proa, de cada lado.',
    { en: 'bow (on the port or starboard bow)', ver: ['proa', 'traves', 'alheta'], fig: ['direcoes', 'bochecha'] });
  t('alheta', 'Alheta', 'casco', 'Direção a meio caminho entre o través e a popa (135° da proa, de cada bordo). Também é a região do casco junto à popa, de cada lado.',
    { en: 'quarter', ver: ['popa', 'traves', 'bochecha'], fig: ['direcoes', 'alheta'] });
  t('meia-nau', 'Meia-nau', 'casco', 'Região central do casco, a meio caminho entre a proa e a popa. Também quer dizer na linha de centro, como na ordem <em>leme a meia-nau</em> (leme reto).',
    { en: 'amidships', sin: ['meio-navio'], ver: ['linha-de-centro', 'leme'] });
  t('linha-de-centro', 'Linha de centro', 'casco', 'Linha longitudinal (o eixo do barco) que corre de proa a popa pelo meio do casco e o divide em duas metades iguais, uma de cada bordo.',
    { en: 'centreline', sin: ['plano diametral', 'linha de proa e popa'], ver: ['meia-nau', 'bombordo', 'boreste'] });
  t('avante', 'Avante', 'casco', 'Para o lado da proa, ou à frente de um ponto do barco: o mastro fica a vante do cockpit. O oposto é <em>a ré</em>.',
    { en: 'forward, ahead', sin: ['a vante', 'de vante'], ver: ['a-re', 'proa'] });
  t('a-re', 'A ré', 'casco', 'Para o lado da popa, ou atrás de um ponto do barco. <em>Dar máquinas a ré</em> é usar o motor para andar para trás.',
    { en: 'aft, astern', sin: ['de ré'], ver: ['avante', 'popa'] });
  t('casco', 'Casco', 'casco', 'Corpo da embarcação, sem a mastreação e os equipamentos. É ele que flutua e dá forma ao barco.',
    { en: 'hull', ver: ['costado', 'obras-vivas', 'obras-mortas', 'quilha', 'monocasco'] });
  t('costado', 'Costado', 'casco', 'Cada um dos lados do casco, de bombordo e de boreste, principalmente a parte que fica acima da água.',
    { en: 'side, topsides', ver: ['casco', 'obras-mortas', 'borda'], fig: ['barco', 'costado'] });
  t('obras-vivas', 'Obras vivas', 'casco', 'Parte do casco que fica abaixo da linha d’água, sempre molhada. Também chamada de carena. É onde se aplica a tinta anti-incrustante.',
    { en: 'underwater body, bottom', sin: ['carena'], ver: ['obras-mortas', 'linha-dagua', 'calado'], fig: ['barco', 'obras-vivas'] });
  t('obras-mortas', 'Obras mortas', 'casco', 'Parte do casco acima da linha d’água, até a borda.',
    { en: 'topsides, upperworks', ver: ['obras-vivas', 'borda-livre', 'costado'], fig: ['barco', 'obras-mortas'] });
  t('linha-dagua', 'Linha d’água', 'casco', 'Linha em que a superfície da água encontra o casco. Separa as obras vivas das obras mortas e sobe quando o barco é carregado.',
    { en: 'waterline', sin: ['linha de flutuação'], ver: ['obras-vivas', 'obras-mortas', 'calado', 'borda-livre'], fig: ['dimensoes', 'linha-dagua'] });
  t('borda-livre', 'Borda livre', 'casco', 'Distância vertical da linha d’água até o convés, medida no costado. Quanto maior, mais difícil é a água do mar entrar no convés.',
    { en: 'freeboard', ver: ['linha-dagua', 'pontal', 'calado'], fig: ['dimensoes', 'borda-livre'] });
  t('calado', 'Calado', 'casco', 'Distância vertical da linha d’água até o ponto mais fundo do barco (em geral, a quilha). É a profundidade mínima de água para flutuar sem tocar o fundo. Num veleiro de cruzeiro de 32 pés (≈ 9,75 m), por exemplo, o calado costuma ficar entre 1,4 e 2 m; barcos maiores calam mais.',
    { en: 'draught (draft)', ver: ['quilha', 'sondagem', 'ecobatimetro', 'restrita-pelo-calado'], fig: ['dimensoes', 'calado'] });
  t('pontal', 'Pontal', 'casco', 'Altura do casco medida a meia-nau, do fundo (face de cima da quilha) até o convés.',
    { en: 'depth (moulded depth)', ver: ['calado', 'borda-livre', 'boca'], fig: ['dimensoes', 'pontal'] });
  t('boca', 'Boca', 'casco', 'Maior largura do casco.',
    { en: 'beam', sin: ['boca máxima'], ver: ['comprimento', 'pontal', 'calado'], fig: ['dimensoes', 'boca'] });
  t('comprimento', 'Comprimento', 'casco', 'Para a NORMAM-211, o comprimento da embarcação é “a distância horizontal entre os pontos extremos da proa a popa”, sem contar plataformas de mergulho, gurupés e apêndices parecidos. O comprimento na linha d’água é menor e é o que limita a velocidade de casco.',
    { en: 'length overall (LOA)', sin: ['comprimento total'], ver: ['pe', 'velocidade-de-casco', 'embarcacao-de-medio-porte', 'gurupes'], fig: ['dimensoes', 'comprimento'], fonte: n211('Glossário, p. VI') });
  t('pe', 'Pé (unidade)', 'casco', 'Unidade de comprimento usada para barcos: 1 pé = 0,3048 m. Por exemplo, um veleiro de 32 pés tem cerca de 9,75 m.',
    { en: 'foot (ft)', sin: ['pés'], ver: ['comprimento', 'embarcacao-de-medio-porte'] });
  t('quilha', 'Quilha', 'casco', 'Peça estrutural que corre pelo fundo do casco, de proa a popa. Nos veleiros, chama-se também quilha o apêndice fixo e pesado sob o casco: o lastro baixa o centro de gravidade e devolve o barco à posição normal, e a forma de lâmina reduz o abatimento.',
    { en: 'keel', ver: ['lastro', 'bolina', 'abatimento', 'calado', 'monocasco'], fig: ['barco', 'quilha'] });
  t('bolina', 'Bolina (prancha)', 'casco', 'Prancha móvel que desce por uma caixa no fundo de barcos pequenos, como o Optimist e o Laser, para reduzir o abatimento; sobe para navegar em águas rasas. Também é o nome dos pontos de vela em que se navega contra o vento (bolina cerrada e folgada).',
    { en: 'centreboard, daggerboard', ver: ['quilha', 'abatimento', 'bolina-cerrada'] });
  t('lastro', 'Lastro', 'casco', 'Peso colocado na parte baixa do barco, em geral chumbo ou ferro na quilha, para dar estabilidade e contrabalançar a força do vento nas velas.',
    { en: 'ballast', ver: ['quilha', 'estabilidade', 'banda'] });
  t('leme', 'Leme', 'casco', 'Lâmina móvel na popa, dentro da água, que faz o barco mudar de direção quando a água passa por ela. Só funciona com o barco em movimento pela água (com seguimento).',
    { en: 'rudder', ver: ['cana-do-leme', 'roda-de-leme', 'madre-do-leme', 'seguimento', 'governar'], fig: ['barco', 'leme'] });
  t('madre-do-leme', 'Madre do leme', 'casco', 'Eixo que liga a lâmina do leme ao sistema de governo (cana ou roda), atravessando o casco.',
    { en: 'rudder stock', ver: ['leme', 'cana-do-leme', 'roda-de-leme'] });
  t('cana-do-leme', 'Cana do leme', 'casco', 'Alavanca presa no alto da madre do leme. Para guinar, empurra-se a cana para o lado contrário ao que se quer ir: cana para bombordo, proa para boreste.',
    { en: 'tiller', ver: ['leme', 'roda-de-leme', 'governar'] });
  t('roda-de-leme', 'Roda de leme', 'casco', 'Roda que movimenta o leme por cabos ou por transmissão mecânica ou hidráulica. Funciona como o volante de um carro: gira-se para o lado em que se quer guinar. Também chamada de timão.',
    { en: 'wheel (steering wheel)', sin: ['timão', 'roda do leme'], ver: ['leme', 'cana-do-leme', 'malagueta', 'timoneiro'] });
  t('conves', 'Convés', 'casco', 'Piso de cima do casco, que fecha o barco por cima e onde se caminha a bordo.',
    { en: 'deck', ver: ['borda-livre', 'casaria', 'cockpit', 'linha-de-vida'], fig: ['barco', 'conves'] });
  t('cockpit', 'Cockpit', 'casco', 'Área rebaixada no convés, em geral a ré, onde ficam o timoneiro e a tripulação e de onde se manobram as velas. Num barco de mar, tem drenos que esvaziam sozinhos a água que entra.',
    { en: 'cockpit', sin: ['poço'], ver: ['conves', 'gaiuta', 'roda-de-leme'], fig: ['barco', 'cockpit'] });
  t('casaria', 'Casaria', 'casco', 'Parte da cabine que se eleva acima do convés, com as vigias. Dá altura por dentro e apoio para ferragens por fora.',
    { en: 'coachroof, deckhouse', sin: ['superestrutura', 'cabine'], ver: ['vigia', 'gaiuta', 'conves'], fig: ['barco', 'casaria'] });
  t('gaiuta', 'Gaiúta', 'casco', 'Tampa ou pequena cobertura sobre uma abertura no convés, que dá luz, ar ou acesso ao interior. Nos veleiros de cruzeiro, chama-se assim a entrada da cabine com tampa de correr e também as escotilhas de acrílico do convés.',
    { en: 'hatch, companionway hatch', ver: ['escotilha', 'casaria', 'cockpit'] });
  t('escotilha', 'Escotilha', 'casco', 'Abertura no convés com tampa estanque, para passar pessoas e material ou ventilar o interior. No mar com ondas, deve ficar fechada e travada.',
    { en: 'hatch', ver: ['gaiuta', 'vigia'] });
  t('vigia', 'Vigia', 'casco', 'Janela do casco ou da casaria, fixa ou de abrir, para luz e ventilação. Deve ficar bem fechada no mar.',
    { en: 'porthole, portlight', ver: ['casaria', 'escotilha'], fig: ['barco', 'vigia'] });
  t('balaustre', 'Balaústre', 'casco', 'Coluna metálica vertical, presa na borda do convés, que sustenta os guarda-mancebos.',
    { en: 'stanchion', ver: ['guarda-mancebo', 'pulpito'], fig: ['barco', 'balaustre'] });
  t('guarda-mancebo', 'Guarda-mancebo', 'casco', 'Cabo de aço ou fita esticada entre os balaústres e os púlpitos, em volta do convés, para evitar que alguém caia no mar. Não substitui o arnês preso à linha de vida.',
    { en: 'lifeline, guardrail', ver: ['balaustre', 'pulpito', 'linha-de-vida', 'arnes'], fig: ['barco', 'guarda-mancebo'] });
  t('pulpito', 'Púlpito', 'casco', 'Grade de tubo, em geral de aço inox, na proa (púlpito de proa) ou na popa (púlpito de popa), onde terminam os guarda-mancebos.',
    { en: 'pulpit (proa), pushpit (popa)', sin: ['púlpito de proa', 'púlpito de popa'], ver: ['guarda-mancebo', 'balaustre'], fig: ['barco', ['pulpito', 'pulpito-de-popa']] });
  t('cunho', 'Cunho', 'casco', 'Peça com dois braços, presa no convés, no cais ou no mastro, em que se dá volta a um cabo para prendê-lo.',
    { en: 'cleat', ver: ['volta-de-cunho', 'mordedor', 'cabeco'], widget: { w: 'nos', opts: { no: 'volta-de-cunho' }, rotulo: 'Ver a volta de cunho' } });
  t('buzina', 'Buzina', 'casco', 'Peça na borda, aberta ou fechada, por onde passa um cabo de amarração ou a amarra, guiando-o e protegendo-o do atrito.',
    { en: 'fairlead, chock', ver: ['espia', 'amarra', 'cunho'] });
  t('malagueta', 'Malagueta', 'casco', 'Pino de madeira ou de metal em que se dá volta a cabos, como nos veleiros antigos. Também se chamam malaguetas os punhos da roda do leme.',
    { en: 'belaying pin; spoke handle', ver: ['roda-de-leme', 'cunho'] });
  t('cabeco', 'Cabeço', 'casco', 'Coluna curta e robusta, no cais ou no convés, em que se passam as espias de amarração. A coluna de amarração do convés também é chamada de abita.',
    { en: 'bollard, bitt', sin: ['abita'], ver: ['espia', 'cunho', 'atracar'] });
  t('molinete', 'Molinete', 'casco', 'Guincho, manual ou elétrico, que recolhe e larga a amarra da âncora. Tem uma coroa em que os elos da corrente se encaixam.',
    { en: 'windlass', ver: ['amarra', 'ancora', 'paiol-da-amarra'] });
  t('paiol-da-amarra', 'Paiol da amarra', 'casco', 'Compartimento na proa onde fica guardada a amarra. O chicote da amarra deve ficar preso dentro dele.',
    { en: 'chain locker', ver: ['amarra', 'molinete'] });
  t('sentina', 'Sentina', 'casco', 'Parte mais baixa do interior do casco, onde se junta a água que entra a bordo. Deve ser vigiada e esgotada com a bomba de esgoto.',
    { en: 'bilge', sin: ['porão'], ver: ['bomba-de-esgoto', 'valvula-de-fundo'] });
  t('bomba-de-esgoto', 'Bomba de esgoto', 'casco', 'Bomba, manual ou elétrica, que tira a água da sentina para fora do barco. Para o mar aberto, é prudente ter uma manual que possa ser operada do cockpit, além da elétrica.',
    { en: 'bilge pump', sin: ['bomba de porão'], ver: ['sentina'] });
  t('espelho-de-popa', 'Espelho de popa', 'casco', 'Painel plano ou levemente curvo que fecha a popa do casco. Também se diz painel de popa.',
    { en: 'transom', ver: ['popa'] });
  t('roda-de-proa', 'Roda de proa', 'casco', 'Peça que fica no extremo de vante da quilha e dá forma à proa do casco.',
    { en: 'stem', ver: ['proa'] });
  t('borda', 'Borda', 'casco', 'Parte de cima do costado, onde o casco encontra o convés. <em>Borda falsa</em> é a mureta que continua o costado acima do convés.',
    { en: 'gunwale; bulwark (borda falsa)', ver: ['costado', 'conves', 'balaustre'] });
  t('anteparo', 'Anteparo', 'casco', 'Parede interna que divide o casco em compartimentos (a Marinha escreve <em>antepara</em>). Anteparos estanques ajudam a conter um alagamento.',
    { en: 'bulkhead', ver: ['casco'] });
  t('valvula-de-fundo', 'Válvula de fundo', 'casco', 'Registro que abre e fecha um furo no casco abaixo da linha d’água, como a entrada de água do motor, do banheiro e da pia. Feche-a quando não estiver em uso e deixe um tampão de madeira amarrado ao lado, para emergências.',
    { en: 'seacock, through-hull', sin: ['passa-casco'], ver: ['sentina', 'obras-vivas'] });
  t('banda', 'Banda', 'casco', 'Inclinação lateral do barco, causada pelo vento nas velas, por pesos mal distribuídos ou pelas ondas. <em>Adernar</em> é inclinar para um bordo.',
    { en: 'heel; list', sin: ['adernamento'], busca: ['adernar'], ver: ['estabilidade', 'lastro', 'rizo'] });
  t('estabilidade', 'Estabilidade', 'casco', 'Capacidade do barco de voltar à posição de equilíbrio depois que uma força, como o vento ou uma onda, o inclina. A NORMAM-211 chama de estabilidade intacta essa propriedade com o casco íntegro.',
    { en: 'stability', ver: ['lastro', 'banda', 'monocasco'], fonte: n211('Glossário, p. VII') });
  t('trim', 'Trim', 'casco', 'Inclinação do barco no sentido de proa e popa. Diz-se que está <em>embicado</em> quando a proa está mais funda e <em>apopado</em> quando a popa está mais funda.',
    { en: 'trim', sin: ['compasso'], ver: ['banda', 'arfagem'] });
  t('balanco', 'Balanço', 'casco', 'Movimento de vaivém do barco de um bordo para o outro, em torno do eixo de proa a popa.',
    { en: 'rolling', ver: ['arfagem', 'banda'] });
  t('arfagem', 'Arfagem', 'casco', 'Movimento em que a proa e a popa sobem e descem alternadamente ao passar pelas ondas. Quando é forte, com a proa mergulhando, diz-se que o barco <em>caturra</em>.',
    { en: 'pitching', busca: ['caturro', 'caturrar'], ver: ['balanco', 'trim'] });
  t('deslocamento', 'Deslocamento', 'casco', 'Peso total do barco, igual ao peso da água que ele desloca ao flutuar. Casco de deslocamento é o que navega dentro da água, sem planar, como o de um veleiro de cruzeiro.',
    { en: 'displacement', ver: ['velocidade-de-casco', 'planar'] });
  t('velocidade-de-casco', 'Velocidade de casco', 'casco', 'Velocidade a partir da qual um casco de deslocamento precisa de muito mais força para andar mais rápido, porque fica preso na própria onda que forma. Regra prática: cerca de 2,43 × √(comprimento na linha d’água em metros) nós. Por exemplo, um veleiro de 32 pés (≈ 9,75 m), com uns 8,5 m de linha d’água, chega a cerca de 7 nós; use o comprimento de linha d’água do seu barco.',
    { en: 'hull speed', ver: ['comprimento', 'deslocamento', 'no-velocidade'] });
  t('planar', 'Planar', 'casco', 'Navegar por cima da água, sustentado pela velocidade, como as lanchas e os barcos de regata leves. Um veleiro de cruzeiro pesado não plana.',
    { en: 'plane', ver: ['deslocamento', 'velocidade-de-casco'] });
  t('veleiro', 'Veleiro', 'casco', 'Embarcação movida principalmente pelo vento nas velas. Para o RIPEAM, um veleiro com o motor ligado e engrenado conta como embarcação de propulsão mecânica.',
    { en: 'sailing yacht, sailboat', ver: ['sloop', 'embarcacao-a-vela', 'embarcacao-de-propulsao-mecanica', 'veleiro-categoria'], fig: ['barco', 'todas'], legenda: 'Veleiro de cruzeiro do tipo sloop, de perfil, com as partes principais.' });
  t('sloop', 'Sloop', 'casco', 'Veleiro de um mastro com uma só vela de proa (genoa ou buja) além da vela grande. É o tipo mais comum nos veleiros de cruzeiro de 30 a 40 pés.',
    { en: 'sloop', ver: ['cutter', 'ketch', 'vela-grande', 'genoa'], fig: ['barco', 'todas'] });
  t('cutter', 'Cutter', 'casco', 'Veleiro de um mastro com duas velas de proa ao mesmo tempo, uma à frente da outra. Prático no cruzeiro oceânico, porque facilita reduzir o pano.',
    { en: 'cutter', ver: ['sloop', 'ketch', 'vela-de-proa'] });
  t('ketch', 'Ketch', 'casco', 'Veleiro de dois mastros em que o de ré (o mastro da mezena) é menor e fica a vante do leme. No <em>yawl</em>, a mezena é bem menor e fica a ré do leme.',
    { en: 'ketch; yawl', busca: ['yawl', 'mezena'], ver: ['sloop', 'cutter'] });
  t('catamara', 'Catamarã', 'casco', 'Embarcação de dois cascos unidos por uma plataforma. É mais estável e mais rápido em águas calmas que um monocasco do mesmo tamanho, mas, se virar, não volta sozinho.',
    { en: 'catamaran', ver: ['monocasco', 'estabilidade'] });
  t('monocasco', 'Monocasco', 'casco', 'Embarcação de um só casco. Um veleiro monocasco com quilha lastrada tende a voltar à posição normal mesmo depois de uma grande inclinação.',
    { en: 'monohull', ver: ['catamara', 'quilha', 'estabilidade'] });
  t('bote-de-apoio', 'Bote de apoio', 'casco', 'Bote pequeno, inflável ou rígido, usado para ir do veleiro fundeado até a terra. A NORMAM-211 o chama de embarcação auxiliar: embarcação miúda, com motor de popa de até 50 HP, se houver, com o mesmo nome do barco principal nos dois costados e o mesmo número de inscrição na popa.',
    { en: 'tender, dinghy', sin: ['embarcação auxiliar', 'bote auxiliar'], ver: ['embarcacao-miuda', 'fundear'], fonte: n211('Glossário, p. VI') });

  /* ===================== Mastreação e ferragens ===================== */
  t('mastro', 'Mastro', 'aparelho', 'Peça vertical, de alumínio, carbono ou madeira, que sustenta as velas. Fica em pé graças ao aparelho fixo: estais e brandais.',
    { en: 'mast', ver: ['estai', 'brandal', 'cruzeta', 'enora', 'tope-do-mastro', 'retranca'], fig: ['barco', 'mastro'] });
  t('tope-do-mastro', 'Tope do mastro', 'aparelho', 'Ponta de cima do mastro, onde ficam as roldanas das adriças, a antena do VHF, algumas luzes e a biruta.',
    { en: 'masthead', sin: ['tope'], ver: ['mastro', 'adrica', 'biruta', 'lanterna-tricolor'], fig: ['barco', 'tope'] });
  t('retranca', 'Retranca', 'aparelho', 'Pau horizontal articulado no mastro que prende a esteira da vela grande. No jaibe, cruza o barco com força: mantenha a cabeça abaixo dela.',
    { en: 'boom', ver: ['garlindeu', 'burro', 'amantilho', 'jaibe', 'vela-grande'], fig: ['barco', 'retranca'] });
  t('estai', 'Estai', 'aparelho', 'Cabo do aparelho fixo, em geral de aço, que segura o mastro para vante, do tope (ou perto dele) até a proa. A vela de proa corre ou se enrola nele.',
    { en: 'forestay', sin: ['estai de proa'], ver: ['estai-de-popa', 'brandal', 'vela-de-proa', 'enrolador'], fig: ['barco', 'estai'] });
  t('estai-de-popa', 'Estai de popa', 'aparelho', 'Cabo do aparelho fixo que segura o mastro para ré, do tope até a popa. Em muitos barcos é regulável, para curvar o mastro e ajustar a forma da vela grande.',
    { en: 'backstay', sin: ['backstay'], ver: ['estai', 'brandal', 'mastro'], fig: ['barco', 'estai-de-popa'] });
  t('brandal', 'Brandal', 'aparelho', 'Cabo do aparelho fixo que segura o mastro para os lados, um ou mais de cada bordo, preso ao casco por chapas fortes. Os brandais altos passam pelas pontas das cruzetas. Brandais e estais, juntos, formam a enxárcia.',
    { en: 'shroud', sin: ['enxárcia'], ver: ['cruzeta', 'esticador', 'chapa-de-brandal', 'aparelho-fixo'], fig: ['barco', 'brandal'] });
  t('cruzeta', 'Cruzeta', 'aparelho', 'Haste presa ao mastro, de cada lado, que afasta os brandais do mastro e melhora o ângulo com que eles o seguram.',
    { en: 'spreader', ver: ['brandal', 'mastro'], fig: ['barco', 'cruzeta'] });
  t('esticador', 'Esticador', 'aparelho', 'Peça com rosca, no pé de estais e brandais, usada para ajustar a tensão do aparelho fixo. Deve ficar travada com contrapino ou trava própria.',
    { en: 'turnbuckle, rigging screw', ver: ['brandal', 'estai', 'chapa-de-brandal'] });
  t('chapa-de-brandal', 'Chapa de brandal', 'aparelho', 'Ferragem forte, presa à estrutura do casco, onde se prende o pé de um brandal ou de um estai.',
    { en: 'chainplate', ver: ['brandal', 'esticador'] });
  t('enora', 'Enora', 'aparelho', 'Abertura reforçada no convés por onde o mastro passa até o fundo do casco, com vedação em volta. Quando o mastro se apoia sobre o convés, não há enora: o pé do mastro assenta numa base sobre ele.',
    { en: 'mast partners, mast collar', ver: ['mastro', 'carlinga'], fig: ['barco', 'enora'] });
  t('carlinga', 'Carlinga', 'aparelho', 'Encaixe ou base em que assenta o pé do mastro: um entalhe na sobrequilha, no fundo do casco, ou uma peça sobre o convés.',
    { en: 'mast step', ver: ['mastro', 'enora'] });
  t('aparelho-fixo', 'Aparelho fixo', 'aparelho', 'Conjunto dos cabos que mantêm o mastro em pé e não se mexem durante a navegação: estais, brandais e seus esticadores.',
    { en: 'standing rigging', ver: ['aparelho-de-laborar', 'estai', 'brandal', 'esticador'] });
  t('aparelho-de-laborar', 'Aparelho de laborar', 'aparelho', 'Conjunto dos cabos que se manobram para içar, regular e recolher as velas: adriças, escotas, amantilho, burro, cabos de rizo e outros. Em textos da Marinha, a expressão também designa o sistema de moitões e cabo (a talha) que multiplica a força.',
    { en: 'running rigging', sin: ['aparelho móvel', 'aparelho de manobra'], ver: ['aparelho-fixo', 'adrica', 'escota'] });
  t('adrica', 'Adriça', 'aparelho', 'Cabo usado para içar uma vela ou uma bandeira e mantê-la no alto. Corre por dentro ou por fora do mastro até o tope.',
    { en: 'halyard', ver: ['punho-da-adrica', 'catraca', 'mordedor', 'icar'], fig: ['barco', 'adrica'], legenda: 'Adriça da vela grande: sai do punho da adriça, passa no tope do mastro, desce por dentro dele e vem até o cockpit.' });
  t('escota', 'Escota', 'aparelho', 'Cabo que regula o ângulo da vela com o vento: caçar a escota fecha a vela, folgar abre. A escota da vela de proa prende-se no punho da escota; a da grande, na retranca.',
    { en: 'sheet', ver: ['cacar', 'folgar', 'mareacao', 'catraca', 'punho-da-escota', 'no-de-escota'], fig: ['barco', 'escota'], legenda: 'Escotas da genoa (até a catraca do cockpit) e da vela grande (da retranca ao carrinho).' });
  t('amantilho', 'Amantilho', 'aparelho', 'Cabo que sustenta a ponta de ré da retranca (ou o pau de spinnaker), principalmente quando a vela grande está arriada.',
    { en: 'topping lift', ver: ['retranca', 'pau-de-spinnaker'], fig: ['barco', 'amantilho'] });
  t('burro', 'Burro', 'aparelho', 'Talha ou haste entre o pé do mastro e a retranca que puxa a retranca para baixo. Controla a torção da vela grande e evita que a retranca suba nos ventos de largo e de popa.',
    { en: 'boom vang, kicking strap', ver: ['retranca', 'talha', 'vela-grande'], fig: ['barco', 'burro'] });
  t('garlindeu', 'Garlindéu', 'aparelho', 'Ferragem articulada que prende a retranca ao mastro e a deixa girar para os lados e para cima.',
    { en: 'gooseneck', ver: ['retranca', 'mastro'], fig: ['barco', 'garlindeu'] });
  t('carril', 'Carril', 'aparelho', 'Trilho no convés ou no mastro por onde corre um carrinho. O carril da escota da genoa muda o ponto de onde a escota puxa a vela; o da escota da grande (traveller) deixa a retranca ir para o lado sem subir.',
    { en: 'track; traveller', sin: ['traveller', 'trilho'], ver: ['escota', 'mareacao'] });
  t('catraca', 'Catraca', 'aparelho', 'Tambor com engrenagem e trava, girado por manivela, que dá força para caçar escotas e adriças sob carga. O cabo dá voltas no tambor no sentido dos ponteiros do relógio. Nunca deixe os dedos entre o cabo e o tambor.',
    { en: 'winch', sin: ['winch', 'guincho'], ver: ['manivela-da-catraca', 'escota', 'adrica', 'mordedor'] });
  t('manivela-da-catraca', 'Manivela da catraca', 'aparelho', 'Alavanca removível que se encaixa no alto da catraca para girá-la. Guarde-a no suporte: solta, ela cai no mar.',
    { en: 'winch handle', ver: ['catraca'] });
  t('mordedor', 'Mordedor', 'aparelho', 'Ferragem que trava um cabo sem precisar dar voltas. O de alavanca (stopper) segura adriças e escotas sob carga; o de cames (de mordaça) segura cabos mais leves.',
    { en: 'rope clutch, jammer; cam cleat', sin: ['stopper'], ver: ['catraca', 'cunho', 'adrica'] });
  t('moitao', 'Moitão', 'aparelho', 'Caixa com uma roldana por onde passa um cabo, para mudar a direção dele ou, combinado com outros, multiplicar a força. Com duas ou mais roldanas, chama-se cadernal.',
    { en: 'block', sin: ['polia'], busca: ['cadernal'], ver: ['patesca', 'talha'] });
  t('patesca', 'Patesca', 'aparelho', 'Moitão que se abre de lado, para meter o seio de um cabo sem passar a ponta. Útil para mudar o caminho de uma escota ou de um cabo de reboque.',
    { en: 'snatch block', ver: ['moitao', 'seio'] });
  t('talha', 'Talha', 'aparelho', 'Conjunto de moitões e cabo que multiplica a força de quem puxa: quanto mais roldanas, menos força e mais cabo para recolher. O burro e a escota da grande costumam ser talhas.',
    { en: 'tackle, purchase', ver: ['moitao', 'burro'] });
  t('manilha', 'Manilha', 'aparelho', 'Peça de metal em forma de U ou de lira, fechada por um pino roscado, que liga cabos, correntes e ferragens. Na âncora, trave o pino com arame para ele não se soltar.',
    { en: 'shackle', ver: ['mosquetao', 'ancora', 'amarra'] });
  t('mosquetao', 'Mosquetão', 'aparelho', 'Gancho com fecho de mola que abre e fecha rápido, usado em adriças, escotas e no cabo de segurança do arnês.',
    { en: 'snap shackle, carabiner', ver: ['manilha', 'arnes'] });
  t('sapatilho', 'Sapatilho', 'aparelho', 'Anel de metal, redondo ou oval, com canaleta na borda, colocado dentro de uma alça (mão) de cabo para protegê-la do desgaste.',
    { en: 'thimble', ver: ['alca', 'costura'] });
  t('pau-de-spinnaker', 'Pau de spinnaker', 'aparelho', 'Pau que se prende ao mastro e afasta para barlavento o punho de amura do balão ou, na asa de pombo, o punho de escota da vela de proa.',
    { en: 'spinnaker pole; whisker pole', sin: ['pau de balão'], ver: ['balao', 'asa-de-pombo', 'amantilho'] });
  t('gurupes', 'Gurupés', 'aparelho', 'Pau ou estrutura que se projeta à frente da proa, para prender a amura do gennaker, a âncora ou um estai. Não entra no comprimento da embarcação para a NORMAM-211.',
    { en: 'bowsprit', ver: ['gennaker', 'comprimento'] });
  t('biruta', 'Biruta', 'aparelho', 'Indicador de vento. A biruta do tope do mastro mostra o vento aparente; as birutas de fita, presas nas velas, mostram se o ar está correndo bem pelos dois lados da vela.',
    { en: 'wind indicator; telltales', busca: ['fitas de leitura', 'telltales'], ver: ['vento-aparente', 'mareacao'] });
  t('enrolador', 'Enrolador', 'aparelho', 'Sistema que enrola a vela de proa em volta do estai (ou a grande dentro do mastro ou da retranca), puxando um cabo do cockpit. Facilita reduzir o pano sem ir à proa.',
    { en: 'roller furler, furling system', ver: ['genoa', 'reduzir-pano', 'rizo'] });

  /* ===================== Velas ===================== */
  t('vela-grande', 'Vela grande', 'velas', 'Vela principal, presa ao mastro pela testa e à retranca pela esteira, a ré do mastro.',
    { en: 'mainsail', sin: ['grande', 'mestra'], ver: ['retranca', 'rizo', 'vela-de-proa', 'testa'], fig: ['barco', 'vela-grande'] });
  t('vela-de-proa', 'Vela de proa', 'velas', 'Qualquer vela presa ao estai, a vante do mastro: genoa, buja ou tormentim.',
    { en: 'headsail', ver: ['genoa', 'buja', 'tormentim', 'estai'], fig: ['barco', 'genoa'] });
  t('genoa', 'Genoa', 'velas', 'Vela de proa grande, que passa do mastro para ré e se sobrepõe à vela grande. Dá força em ventos fracos e médios; com vento forte, é enrolada em parte.',
    { en: 'genoa', ver: ['buja', 'vela-de-proa', 'enrolador'], fig: ['barco', 'genoa'] });
  t('buja', 'Buja', 'velas', 'Vela de proa menor, que não passa do mastro (ou passa pouco). Mais fácil de manobrar e boa para vento médio e forte.',
    { en: 'jib', ver: ['genoa', 'vela-de-proa'], fig: ['barco', 'buja'] });
  t('balao', 'Balão', 'velas', 'Vela grande, leve e simétrica, usada nos ventos de largo e de popa. É içada solta, sem estai, e aberta pelo pau de spinnaker.',
    { en: 'spinnaker', sin: ['spinnaker', 'spi'], ver: ['gennaker', 'pau-de-spinnaker', 'largo'] });
  t('gennaker', 'Gennaker', 'velas', 'Balão assimétrico, mais fácil de usar que o spinnaker: a amura fica presa na proa ou no gurupés e não precisa de pau. Rende do largo até perto da popa.',
    { en: 'gennaker, asymmetric spinnaker', sin: ['balão assimétrico'], ver: ['balao', 'gurupes'] });
  t('tormentim', 'Tormentim', 'velas', 'Vela de proa pequena e muito resistente, para vento muito forte. Com a vela de capa (uma vela grande pequena e reforçada), forma o velame de tempestade.',
    { en: 'storm jib; storm trysail (vela de capa)', sin: ['vela de tempestade', 'vela de capa'], ver: ['vela-de-proa', 'capear', 'rizo'] });
  t('testa', 'Testa', 'velas', 'Borda de vante da vela, a que fica junto ao mastro ou ao estai.',
    { en: 'luff', ver: ['valuma', 'esteira', 'tralha'], fig: ['vela', 'testa'] });
  t('valuma', 'Valuma', 'velas', 'Borda de ré da vela, livre, entre o punho da adriça e o punho da escota.',
    { en: 'leech', ver: ['testa', 'esteira', 'tala'], fig: ['vela', 'valuma'] });
  t('esteira', 'Esteira', 'velas', 'Borda de baixo da vela.',
    { en: 'foot', ver: ['testa', 'valuma', 'retranca'], fig: ['vela', 'esteira'] });
  t('punho-da-adrica', 'Punho da adriça', 'velas', 'Canto de cima da vela, onde se prende a adriça.',
    { en: 'head', ver: ['adrica', 'punho-da-amura', 'punho-da-escota'], fig: ['vela', 'punho-da-adrica'] });
  t('punho-da-amura', 'Punho da amura', 'velas', 'Canto de baixo e de vante da vela, preso junto ao mastro (na grande) ou à proa (na vela de proa).',
    { en: 'tack', ver: ['punho-da-adrica', 'punho-da-escota', 'amurado'], fig: ['vela', 'punho-da-amura'] });
  t('punho-da-escota', 'Punho da escota', 'velas', 'Canto de baixo e de ré da vela, onde se prende a escota (na vela de proa) ou a ponta da retranca (na grande).',
    { en: 'clew', ver: ['escota', 'punho-da-adrica', 'punho-da-amura'], fig: ['vela', 'punho-da-escota'] });
  t('tralha', 'Tralha', 'velas', 'Cabo ou fita costurado na borda da vela para reforçá-la, como o da testa da grande que corre no trilho do mastro.',
    { en: 'bolt rope', ver: ['testa', 'esteira'], fig: ['vela', 'tralha'] });
  t('tala', 'Tala', 'velas', 'Ripa fina e flexível, colocada em bolsos costurados na vela, que mantém a forma da valuma.',
    { en: 'batten', ver: ['valuma', 'vela-grande'], fig: ['vela', 'tala'] });
  t('rizo', 'Rizo', 'velas', 'Redução da área da vela grande para vento forte: baixa-se parte da vela e prende-se a parte de baixo pelos olhais e cabos de rizo. Rizar cedo, antes de o vento apertar, é sinal de bom marinheiro.',
    { en: 'reef', busca: ['rizar'], ver: ['reduzir-pano', 'enrolador', 'beaufort', 'tormentim'], fig: ['vela', 'rizo'] });
  t('bolsa-da-vela', 'Bolsa da vela', 'velas', 'Curvatura da vela, como a de uma asa. Vela mais cheia, com mais bolsa, dá força em vento fraco; vela mais plana rende melhor e aderna menos em vento forte.',
    { en: 'draft, camber, fullness', sin: ['perfil da vela', 'barriga'], ver: ['mareacao', 'estai-de-popa', 'burro'] });
  t('enfunar', 'Enfunar', 'velas', 'Encher a vela de vento, até ela ganhar a forma certa.',
    { en: 'fill (a sail)', ver: ['panejar', 'mareacao'] });
  t('panejar', 'Panejar', 'velas', 'Bater ou tremular da vela por falta de vento útil, quando está folgada demais ou com a proa muito perto do vento.',
    { en: 'luff, flog, flap', ver: ['enfunar', 'cacar', 'orcar', 'aproado'] });
  t('velame', 'Velame', 'velas', 'Conjunto das velas de um barco.',
    { en: 'sails, sail wardrobe', ver: ['vela-grande', 'vela-de-proa', 'area-velica'] });
  t('area-velica', 'Área vélica', 'velas', 'Área total das velas, em metros quadrados. Comparada ao deslocamento, indica se o barco é mais ou menos esperto em vento fraco.',
    { en: 'sail area', ver: ['velame', 'deslocamento'] });
  t('carangueja', 'Carangueja', 'velas', 'Verga que sustenta a parte de cima de uma vela de quatro lados, nos veleiros tradicionais.',
    { en: 'gaff', ver: ['vela-grande', 'mastro'] });

  /* ===================== Manobra e mareação ===================== */
  t('barlavento', 'Barlavento', 'manobra', 'Lado de onde vem o vento. O bordo de barlavento de um barco é o que recebe o vento primeiro.',
    { en: 'windward', ver: ['sotavento', 'regra-dos-veleiros', 'orcar'], fig: ['barlavento', 'barlavento'] });
  t('sotavento', 'Sotavento', 'manobra', 'Lado para onde vai o vento. Uma costa a sotavento, para onde o vento empurra o barco, é perigosa com mau tempo.',
    { en: 'leeward', ver: ['barlavento', 'abatimento'], fig: ['barlavento', 'sotavento'] });
  t('amurado', 'Amurado', 'manobra', 'Diz o lado por onde o vento entra no barco. Amurado a boreste: vento entrando por boreste, retranca a bombordo. Amurado a bombordo: o contrário. Para o RIPEAM, o bordo de barlavento é o oposto ao lado em que está a vela grande.',
    { en: 'on starboard tack; on port tack', busca: ['amura', 'bordo de amura'], ver: ['regra-dos-veleiros', 'cambar', 'jaibe', 'punho-da-amura'], fig: ['manobra', 'cambar'], legenda: 'Com o vento de cima, o barco de baixo está amurado a bombordo (vento entrando por bombordo, retranca a boreste); depois de cambar, fica amurado a boreste.', nota: false, fonte: rip('Regra 12 b)') });
  t('orcar', 'Orçar', 'manobra', 'Mudar o rumo aproximando a proa da direção de onde vem o vento.',
    { en: 'luff up, head up', ver: ['arribar', 'bolina-cerrada', 'aproado'] });
  t('arribar', 'Arribar', 'manobra', 'Mudar o rumo afastando a proa da direção do vento.',
    { en: 'bear away, head down', ver: ['orcar', 'largo', 'vento-em-popa'] });
  t('cambar', 'Cambar', 'manobra', 'Mudar de bordo passando a proa pela linha do vento: quem estava amurado a bombordo fica amurado a boreste, ou o contrário. É a virada usada para avançar contra o vento.',
    { en: 'tack, go about', sin: ['virar por davante'], busca: ['cambada'], ver: ['jaibe', 'bordejar', 'amurado', 'aproado'], fig: ['manobra', 'cambar'], widget: { w: 'manobras', opts: { manobra: 'cambar' }, rotulo: 'Abrir o simulador de manobras' } });
  t('jaibe', 'Jaibe', 'manobra', 'Mudar de bordo passando a popa pela linha do vento. A retranca cruza o barco de uma vez: controle-a caçando a escota da grande antes e folgando depois. O jaibe sem querer, comum com vento de popa e mar, é perigoso.',
    { en: 'gybe, jibe', sin: ['virar em roda'], busca: ['jaibar', 'jibe'], ver: ['cambar', 'retranca', 'vento-em-popa'], fig: ['manobra', 'jaibe'], widget: { w: 'manobras', opts: { manobra: 'jaibe' }, rotulo: 'Abrir o simulador de manobras' } });
  t('bordejar', 'Bordejar', 'manobra', 'Avançar contra o vento em ziguezague, cambando de tempos em tempos, porque nenhum veleiro navega direto contra o vento.',
    { en: 'beat (to windward)', ver: ['cambar', 'bordo', 'zona-morta', 'bolina-cerrada'], fig: ['manobra', 'bordejar'] });
  t('bordo', 'Bordo', 'manobra', 'Cada lado do barco (bombordo ou boreste). Também é cada trecho navegado entre duas viradas, ao bordejar.',
    { en: 'side; tack (leg)', ver: ['bordejar', 'bombordo', 'boreste'] });
  t('pontos-de-vela', 'Pontos de vela', 'manobra', 'Nomes do rumo do barco em relação ao vento: bolina cerrada, bolina folgada, través, largo e popa. Cada um pede uma regulagem de velas.',
    { en: 'points of sail', sin: ['mareações'], ver: ['bolina-cerrada', 'bolina-folgada', 'vento-de-traves', 'largo', 'vento-em-popa', 'zona-morta'], fig: ['pontos', 'todos'], widget: { w: 'mareacao', opts: {}, rotulo: 'Abrir o simulador de mareação' } });
  t('zona-morta', 'Zona morta', 'manobra', 'Setor de cerca de 45° para cada lado da direção do vento em que um veleiro de cruzeiro não consegue navegar: as velas panejam e o barco perde o seguimento.',
    { en: 'no-go zone', sin: ['ângulo morto'], ver: ['bolina-cerrada', 'aproado', 'bordejar'], fig: ['pontos', 'zona-morta'] });
  t('bolina-cerrada', 'Bolina cerrada', 'manobra', 'Ponto de vela mais próximo do vento em que se consegue navegar, em geral a 40° ou 45° do vento real num veleiro de cruzeiro, com as velas bem caçadas.',
    { en: 'close-hauled', ver: ['bolina-folgada', 'zona-morta', 'orcar', 'bordejar'], fig: ['pontos', 'bolina-cerrada'] });
  t('bolina-folgada', 'Bolina folgada', 'manobra', 'Ponto de vela entre a bolina cerrada e o través, com o vento a uns 60° da proa e as velas um pouco folgadas.',
    { en: 'close reach', ver: ['bolina-cerrada', 'vento-de-traves'], fig: ['pontos', 'bolina-folgada'] });
  t('vento-de-traves', 'Través (ponto de vela)', 'manobra', 'Ponto de vela com o vento entrando a 90° da proa, pelo través. Costuma ser um dos rumos mais rápidos e confortáveis de um veleiro de cruzeiro.',
    { en: 'beam reach', sin: ['vento de través'], ver: ['traves', 'bolina-folgada', 'largo'], fig: ['pontos', 'traves'] });
  t('largo', 'Largo', 'manobra', 'Ponto de vela com o vento entrando entre o través e a popa (cerca de 135° da proa), com as velas bem folgadas.',
    { en: 'broad reach', sin: ['vento largo'], ver: ['vento-de-traves', 'vento-em-popa', 'balao'], fig: ['pontos', 'largo'] });
  t('vento-em-popa', 'Popa (ponto de vela)', 'manobra', 'Ponto de vela com o vento vindo por trás. As velas ficam todas abertas, e há risco de jaibe sem querer se o vento passar para o outro lado da vela grande.',
    { en: 'run, running', sin: ['vento em popa', 'popa rasa'], ver: ['jaibe', 'asa-de-pombo', 'largo'], fig: ['pontos', 'vento-em-popa'] });
  t('asa-de-pombo', 'Asa de pombo', 'manobra', 'Navegar com vento em popa levando a vela grande de um lado e a vela de proa do outro, muitas vezes aberta pelo pau de spinnaker.',
    { en: 'goose-winging, wing on wing', ver: ['vento-em-popa', 'pau-de-spinnaker'] });
  t('aproado', 'Aproado', 'manobra', 'Diz-se do barco com a proa na direção do vento: as velas panejam e ele perde o seguimento. Ficar aproado no meio de uma cambada é um erro comum de quem está começando.',
    { en: 'head to wind, in irons', busca: ['aproar'], ver: ['zona-morta', 'cambar', 'aquartelar'] });
  t('cacar', 'Caçar', 'manobra', 'Puxar um cabo, em especial a escota, fechando a vela.',
    { en: 'sheet in, trim, haul in', ver: ['folgar', 'escota', 'catraca', 'mareacao'] });
  t('folgar', 'Folgar', 'manobra', 'Soltar aos poucos um cabo, em especial a escota, abrindo a vela.',
    { en: 'ease (out)', ver: ['cacar', 'escota', 'solecar'] });
  t('mareacao', 'Mareação', 'manobra', 'Ajuste das velas ao vento e ao rumo, caçando e folgando escotas e outros cabos. Marear bem é deixar as velas no ponto em que dão mais força sem panejar.',
    { en: 'sail trim', busca: ['marear'], ver: ['cacar', 'folgar', 'pontos-de-vela', 'biruta', 'bolsa-da-vela'], widget: { w: 'mareacao', opts: {}, rotulo: 'Abrir o simulador de mareação' } });
  t('aquartelar', 'Aquartelar', 'manobra', 'Deixar a vela de proa do lado de barlavento, cheia de vento ao contrário. Usa-se para ajudar a proa a cair durante a cambada e para capear.',
    { en: 'back (a sail)', ver: ['capear', 'cambar', 'aproado'] });
  t('capear', 'Capear', 'manobra', 'Manobra de mau tempo para quase parar o barco: com a vela de proa aquartelada, a grande folgada ou rizada e o leme preso na posição de orçar, o barco fica com a proa chegada ao vento e ao mar, com o vento à frente do través, quase parado e derivando devagar. Dá descanso à tripulação e tempo para resolver problemas.',
    { en: 'heave to', sin: ['pôr-se à capa', 'capa'], ver: ['aquartelar', 'tormentim', 'ancora-flutuante'] });
  t('fundear', 'Fundear', 'manobra', 'Lançar a âncora para manter o barco parado num lugar. Escolha um fundo que segure bem (areia, lama), abrigado do vento e com espaço para o barco girar em volta da âncora.',
    { en: 'anchor', ver: ['ancora', 'filame', 'garrar', 'unhar', 'suspender', 'luz-de-fundeio'], fig: ['fundeio', 'fundear'] });
  t('suspender', 'Suspender', 'manobra', 'Recolher a âncora para sair. Na linguagem da Marinha, suspender é também sair do porto ou do fundeadouro.',
    { en: 'weigh anchor; get under way', ver: ['fundear', 'molinete'] });
  t('filame', 'Filame', 'manobra', 'Comprimento de amarra ou de cabo que está fora, entre a proa e a âncora. Regra prática da Marinha: de 5 a 7 vezes a profundidade do local; o valor depende também do tipo de fundo.',
    { en: 'scope', ver: ['amarra', 'fundear', 'garrar', 'preamar'], fig: ['fundeio', 'filame'] });
  t('garrar', 'Garrar', 'manobra', 'Diz-se da âncora que se arrasta pelo fundo, deixando o barco ir embora. Depois de fundear, confira marcações de pontos de terra ou ligue o alarme de fundeio do GNSS.',
    { en: 'drag (anchor)', ver: ['unhar', 'fundear', 'filame', 'marcacao'], fig: ['fundeio', 'garrar'] });
  t('unhar', 'Unhar', 'manobra', 'Diz-se da âncora quando se enterra no fundo e segura o barco. Confirma-se dando máquinas a ré devagar, com o filame já largado.',
    { en: '(anchor) set, bite', ver: ['garrar', 'fundear', 'ancora'] });
  t('atracar', 'Atracar', 'manobra', 'Encostar a embarcação a um cais, a um píer ou a outra embarcação e prendê-la com cabos.',
    { en: 'berth, come alongside', ver: ['desatracar', 'espringue', 'lancante', 'defensa', 'amarrar'], fig: ['amarracao', 'nada'] });
  t('desatracar', 'Desatracar', 'manobra', 'Soltar os cabos e afastar a embarcação do cais. Um espringue bem usado ajuda a afastar a proa ou a popa.',
    { en: 'cast off, leave the berth', ver: ['atracar', 'espringue', 'largar'] });
  t('amarrar', 'Amarrar', 'manobra', 'Prender a embarcação com cabos a um cais, a uma boia de poita ou a outra embarcação.',
    { en: 'moor, make fast', ver: ['atracar', 'poita', 'espia'] });
  t('poita', 'Poita', 'manobra', 'Peso no fundo (bloco de concreto, âncora pesada ou corrente), ligado por corrente a uma boia na superfície, em que o barco fica amarrado.',
    { en: 'mooring (buoy)', ver: ['amarrar', 'croque', 'fundear'] });
  t('espringue', 'Espringue', 'manobra', 'Cabo de amarração que trabalha na diagonal, ao longo do costado: sai da proa e vai para ré, ou sai da popa e vai para vante. Impede o barco de andar para frente e para trás junto ao cais.',
    { en: 'spring (line)', ver: ['lancante', 'atracar', 'defensa'], fig: ['amarracao', 'espringue'] });
  t('lancante', 'Lançante', 'manobra', 'Cabo de amarração que prende o barco ao cais: o lançante de proa (a espia nº 1, na numeração da Marinha) sai da proa e o lançante de popa sai da popa.',
    { en: 'bow line; stern line', ver: ['espringue', 'atracar', 'espia'], fig: ['amarracao', 'lancante'] });
  t('defensa', 'Defensa', 'manobra', 'Almofada, em geral de plástico inflado, pendurada no costado para proteger o casco do cais ou de outro barco. Costuma ser presa ao balaústre com uma volta do fiel.',
    { en: 'fender', ver: ['atracar', 'volta-do-fiel', 'balaustre'], fig: ['amarracao', 'defensa'], widget: { w: 'nos', opts: { no: 'volta-do-fiel' }, rotulo: 'Ver a volta do fiel' } });
  t('croque', 'Croque', 'manobra', 'Vara com gancho na ponta, usada para pegar cabos e a boia da poita ou para afastar o barco.',
    { en: 'boathook', ver: ['poita', 'atracar'] });
  t('abatimento', 'Abatimento', 'manobra', 'Deslocamento lateral do barco para sotavento, causado pelo vento. O caminho do barco na água fica alguns graus a sotavento da proa, principalmente em bolina e com mar. Na navegação estimada da Marinha, é o ângulo entre o rumo na superfície e o rumo no fundo.',
    { en: 'leeway', ver: ['deriva', 'quilha', 'sotavento', 'rumo-no-fundo'], fig: ['abatimento', 'abatimento'] });
  t('deriva', 'Deriva', 'manobra', 'Deslocamento do barco causado pela corrente. Diz-se também que um barco sem motor e sem vela, levado pelo vento e pela corrente, está <em>à deriva</em>.',
    { en: 'drift', ver: ['corrente', 'abatimento', 'rumo-no-fundo'] });
  t('seguimento', 'Seguimento', 'manobra', 'Movimento do barco pela água, para vante ou para ré. Sem seguimento, o leme não atua e o barco não obedece.',
    { en: 'way (headway, sternway)', ver: ['leme', 'aproado', 'em-movimento'] });
  t('guinar', 'Guinar', 'manobra', 'Mudar o rumo, em geral de forma rápida ou com um ângulo grande.',
    { en: 'alter course, turn', busca: ['guinada'], ver: ['governar', 'sinais-sonoros'] });
  t('governar', 'Governar', 'manobra', 'Manter o barco no rumo desejado usando o leme.',
    { en: 'steer', ver: ['timoneiro', 'leme', 'piloto-automatico'] });
  t('timoneiro', 'Timoneiro', 'manobra', 'Quem está no leme governando o barco.',
    { en: 'helmsman, helm', ver: ['governar', 'roda-de-leme', 'cana-do-leme'] });
  t('vento-real', 'Vento real', 'manobra', 'Vento que sopra de fato, sentido por quem está parado. É o vento das previsões do tempo e o que define os pontos de vela.',
    { en: 'true wind', sin: ['vento verdadeiro'], ver: ['vento-aparente', 'pontos-de-vela', 'beaufort'], fig: ['vento', 'vento-real'] });
  t('vento-aparente', 'Vento aparente', 'manobra', 'Vento que se sente a bordo com o barco andando: a soma do vento real com o vento criado pelo movimento do barco. É por ele que se regulam as velas.',
    { en: 'apparent wind', ver: ['vento-real', 'biruta', 'mareacao'], fig: ['vento', 'vento-aparente'] });
  t('reduzir-pano', 'Reduzir o pano', 'manobra', 'Diminuir a área de vela, rizando a grande ou enrolando a vela de proa, quando o vento aumenta ou antes de anoitecer no mar.',
    { en: 'shorten sail, reduce sail', ver: ['rizo', 'enrolador', 'tormentim', 'borrasca'] });
  t('icar', 'Içar', 'manobra', 'Subir uma vela, uma bandeira ou um peso com um cabo. O contrário é <em>arriar</em>.',
    { en: 'hoist', busca: ['arriar'], ver: ['adrica', 'vela-grande'] });
  t('largar', 'Largar', 'manobra', 'Soltar de vez um cabo; também quer dizer sair do cais ou da poita.',
    { en: 'let go; cast off', ver: ['desatracar', 'folgar'] });

  /* ===================== Cabos, nós e âncoras ===================== */
  t('cabo', 'Cabo', 'marinharia', 'Nome de toda “corda” a bordo. Pode ser de fibra sintética, natural ou de aço, e cada um recebe o nome da sua função: adriça, escota, espia, amarra.',
    { en: 'rope, line', ver: ['chicote', 'seio', 'firme', 'no'] });
  t('chicote', 'Chicote', 'marinharia', 'Ponta de um cabo.',
    { en: 'end (of a rope)', ver: ['seio', 'firme', 'falcaca'] });
  t('seio', 'Seio', 'marinharia', 'Parte curva de um cabo, entre as pontas, em forma de U. Muitos nós podem ser dados “pelo seio”, sem usar o chicote.',
    { en: 'bight', ver: ['chicote', 'firme', 'patesca'] });
  t('firme', 'Firme', 'marinharia', 'Parte de um cabo que fica parada, presa ou sob tensão, oposta ao chicote que trabalha no nó.',
    { en: 'standing part', ver: ['chicote', 'seio'] });
  t('alca', 'Alça', 'marinharia', 'Laço formado por um cabo, fixo (como no lais de guia) ou feito por costura.',
    { en: 'loop, eye', ver: ['lais-de-guia', 'costura', 'sapatilho'] });
  t('volta', 'Volta', 'marinharia', 'Passagem completa de um cabo em torno de um objeto ou de outro cabo. Também é o nome de vários nós que prendem um cabo a um objeto, como a volta do fiel.',
    { en: 'turn; hitch', ver: ['volta-do-fiel', 'volta-redonda-e-dois-cotes', 'cote'] });
  t('no', 'Nó', 'marinharia', 'Entrelaçamento de um cabo para fazer uma alça, unir dois cabos ou impedir que o chicote escape. Bom nó de bordo é fácil de dar, seguro sob carga e fácil de desfazer depois. (Para a unidade de velocidade, veja <em>nó (velocidade)</em>.)',
    { en: 'knot', ver: ['lais-de-guia', 'no-de-oito', 'no-direito', 'no-de-escota', 'volta-do-fiel', 'no-velocidade'], widget: { w: 'nos', opts: {}, rotulo: 'Abrir os nós animados' } });
  t('lais-de-guia', 'Lais de guia', 'marinharia', 'Nó que forma uma alça fixa, que não corre nem aperta e é fácil de desfazer mesmo depois de muita carga. É o nó mais usado a bordo: prende a escota na vela, faz uma alça de amarração e pode ser passado em volta do peito de quem precisa ser içado.',
    { en: 'bowline', ver: ['no', 'alca', 'no-de-escota'], widget: { w: 'nos', opts: { no: 'lais-de-guia' }, rotulo: 'Ver o lais de guia passo a passo' } });
  t('no-de-oito', 'Nó de oito', 'marinharia', 'Nó de batente dado no chicote das escotas e das adriças para que não escapem das ferragens e dos moitões.',
    { en: 'figure-eight knot', ver: ['no', 'escota', 'moitao'], widget: { w: 'nos', opts: { no: 'no-de-oito' }, rotulo: 'Ver o nó de oito passo a passo' } });
  t('no-direito', 'Nó direito', 'marinharia', 'Nó que une os dois chicotes do mesmo cabo, usado para amarrar a parte rizada da vela. Não serve para unir cabos de grossuras diferentes nem sob carga forte. Se sair torto (nó de vaca), escorrega.',
    { en: 'reef knot, square knot', ver: ['rizo', 'no-de-escota'], widget: { w: 'nos', opts: { no: 'no-direito' }, rotulo: 'Ver o nó direito passo a passo' } });
  t('volta-do-fiel', 'Volta do fiel', 'marinharia', 'Volta rápida para prender um cabo a um balaústre, a um pau ou a uma argola, como a das defensas. Pode correr se a carga variar; reforce com um cote.',
    { en: 'clove hitch', ver: ['defensa', 'cote', 'volta'], widget: { w: 'nos', opts: { no: 'volta-do-fiel' }, rotulo: 'Ver a volta do fiel passo a passo' } });
  t('volta-redonda-e-dois-cotes', 'Volta redonda e dois cotes', 'marinharia', 'Volta completa em torno de uma argola ou de um pau seguida de dois cotes. Segura bem cargas fortes, mas pode recorrer: se o esforço for grande, abotoe o chicote.',
    { en: 'round turn and two half hitches', ver: ['cote', 'volta', 'amarrar'], widget: { w: 'nos', opts: { no: 'volta-redonda-e-dois-cotes' }, rotulo: 'Ver a volta redonda passo a passo' } });
  t('no-de-escota', 'Nó de escota', 'marinharia', 'Nó para unir dois cabos, mesmo de grossuras diferentes, ou prender um cabo a uma alça. Dobrado, com uma volta a mais, fica mais seguro.',
    { en: 'sheet bend', ver: ['no-direito', 'lais-de-guia', 'escota'], widget: { w: 'nos', opts: { no: 'no-de-escota' }, rotulo: 'Ver o nó de escota passo a passo' } });
  t('volta-de-cunho', 'Volta de cunho', 'marinharia', 'Modo de prender um cabo no cunho: uma volta na base, voltas em oito pelos braços e, no fim, uma volta virada por baixo que trava o cabo.',
    { en: 'cleat hitch', ver: ['cunho', 'amarrar'], widget: { w: 'nos', opts: { no: 'volta-de-cunho' }, rotulo: 'Ver a volta de cunho passo a passo' } });
  t('cote', 'Cote', 'marinharia', 'Volta singela em que uma parte do cabo morde a outra, em geral dada com o chicote. Quase nunca se usa só: serve para rematar outras voltas, como na volta redonda e dois cotes.',
    { en: 'half hitch', ver: ['volta-redonda-e-dois-cotes', 'volta-do-fiel'] });
  t('falcaca', 'Falcaça', 'marinharia', 'Acabamento feito com linha, fita ou calor (nos cabos sintéticos) no chicote, para ele não se desfazer.',
    { en: 'whipping', ver: ['chicote', 'costura'] });
  t('costura', 'Costura', 'marinharia', 'Emenda ou alça feita entrelaçando os cordões do próprio cabo, sem nó. Mantém mais da resistência do cabo do que um nó.',
    { en: 'splice', ver: ['alca', 'sapatilho', 'falcaca'] });
  t('aduchar', 'Aduchar', 'marinharia', 'Enrolar um cabo em voltas regulares, formando uma aducha, para guardá-lo arrumado e pronto para correr sem enroscar.',
    { en: 'coil', busca: ['aducha'], ver: ['cabo', 'retinida'] });
  t('tesar', 'Tesar', 'marinharia', 'Esticar um cabo, deixando-o firme. O contrário é <em>solecar</em>, dar folga.',
    { en: 'tension, haul taut', ver: ['solecar', 'cacar'] });
  t('solecar', 'Solecar', 'marinharia', 'Dar folga num cabo que estava teso.',
    { en: 'slack, ease', ver: ['tesar', 'folgar'] });
  t('bitola', 'Bitola', 'marinharia', 'Medida da grossura de um cabo. Nos cabos sintéticos de hoje, dá-se em geral pelo diâmetro em milímetros (nos de fibra natural, era comum a circunferência).',
    { en: 'size, diameter', ver: ['cabo'] });
  t('ancora', 'Âncora', 'marinharia', 'Peça pesada que, lançada ao fundo e ligada ao barco pela amarra, enterra-se e segura a embarcação. Há vários tipos, como as de arado e as de garras; cada uma segura melhor em certos fundos.',
    { en: 'anchor', sin: ['ferro'], ver: ['amarra', 'fundear', 'unhar', 'garrar', 'arinque', 'molinete'], fig: ['fundeio', 'ancora'] });
  t('amarra', 'Amarra', 'marinharia', 'Corrente, ou cabo, que liga a âncora ao barco. A corrente pesa, fica deitada no fundo e ajuda a âncora a segurar.',
    { en: 'anchor chain, rode', ver: ['ancora', 'filame', 'molinete', 'paiol-da-amarra'], fig: ['fundeio', 'amarra'] });
  t('arinque', 'Arinque', 'marinharia', 'Cabo fino com uma boia na ponta, preso à âncora. Marca onde ela está, mesmo se a âncora se perder, e pode ajudar a soltá-la se ficar presa em pedras.',
    { en: 'tripping line (with anchor buoy)', ver: ['ancora', 'fundear'] });
  t('espia', 'Espia', 'marinharia', 'Cabo grosso usado para amarrar o barco ao cais ou a outro barco.',
    { en: 'mooring line, warp', ver: ['lancante', 'espringue', 'cabeco', 'retinida'] });
  t('retinida', 'Retinida', 'marinharia', 'Cabo fino e leve, às vezes com um peso na ponta, que se arremessa para passar uma espia a outro barco ou ao cais. Também é o cabo flutuante amarrado à boia salva-vidas.',
    { en: 'heaving line', ver: ['espia', 'boia-circular'] });

  /* ===================== Navegação e instrumentos ===================== */
  var W_CARTA = function (ex, rot) { return { w: 'carta-nautica', opts: ex ? { modo: 'exercicio', exercicio: ex } : { modo: 'explorar' }, rotulo: rot || 'Abrir a carta náutica de treinamento' }; };
  t('navegacao-estimada', 'Navegação estimada', 'navegacao', 'Método de achar a posição a partir da última posição conhecida, do rumo, da velocidade e do tempo navegado. Usá-la sempre, mesmo com GNSS a bordo, ajuda a evitar erros grosseiros.',
    { en: 'dead reckoning', sin: ['estima'], ver: ['posicao-estimada', 'rumo', 'odometro', 'corrente'], widget: W_CARTA('estima', 'Praticar a navegação estimada na carta') });
  t('posicao-estimada', 'Posição estimada', 'navegacao', 'Posição calculada pela navegação estimada, marcada na carta com a hora ao lado. Pode ser corrigida para o efeito conhecido da corrente e do abatimento.',
    { en: 'dead reckoning position; estimated position', ver: ['navegacao-estimada', 'ponto', 'reta-de-altura'] });
  t('ponto', 'Ponto (posição observada)', 'navegacao', 'Posição determinada pelo cruzamento de duas ou mais linhas de posição tiradas ao mesmo tempo. <em>Fazer o ponto</em> é determinar a posição. É mais confiável que a posição estimada.',
    { en: 'fix', sin: ['posição observada'], busca: ['fazer o ponto'], ver: ['linha-de-posicao', 'triangulo-de-incerteza', 'posicao-estimada'], fig: ['ldp', 'ponto'], widget: W_CARTA('marcacoes', 'Praticar o ponto por marcações') });
  t('linha-de-posicao', 'Linha de posição', 'navegacao', 'Linha na carta sobre a qual o barco está, obtida por uma observação: uma marcação, um alinhamento, uma distância ou a altura de um astro. Abreviatura LDP.',
    { en: 'line of position (LOP)', sin: ['LDP'], ver: ['ponto', 'marcacao', 'alinhamento', 'reta-de-altura'], fig: ['ldp', 'linha-de-posicao'], widget: W_CARTA('marcacoes', 'Praticar linhas de posição') });
  t('alinhamento', 'Alinhamento', 'navegacao', 'Duas marcas fixas vistas uma atrás da outra. Dá uma linha de posição muito precisa e, nas entradas de barra e de porto, indica o caminho do canal.',
    { en: 'transit, range, leading line', ver: ['linha-de-posicao', 'marcacao'], fig: ['ldp', 'alinhamento'] });
  t('triangulo-de-incerteza', 'Triângulo de incerteza', 'navegacao', 'Pequeno triângulo formado quando três linhas de posição não se cruzam num ponto só. Quanto menor, melhor a observação; por segurança, considere o barco no vértice mais perto do perigo.',
    { en: 'cocked hat', ver: ['ponto', 'linha-de-posicao'] });
  t('marcacao', 'Marcação', 'navegacao', 'Direção em que se vê um objeto a partir do barco, medida em graus a partir do norte, de 000° a 360° no sentido dos ponteiros do relógio. Tira-se com a agulha de marcação ou com o radar.',
    { en: 'bearing', sin: ['marcação verdadeira'], ver: ['marcacao-relativa', 'linha-de-posicao', 'risco-de-abalroamento', 'agulha'], fig: ['marcacao', 'marcacao'], widget: W_CARTA('marcacoes', 'Praticar marcações na carta') });
  t('marcacao-relativa', 'Marcação relativa', 'navegacao', 'Direção de um objeto medida a partir da proa, de 000° a 360° no sentido horário. Marcação verdadeira = rumo verdadeiro + marcação relativa (tirando 360° se passar disso).',
    { en: 'relative bearing', ver: ['marcacao', 'traves', 'bochecha', 'alheta'], fig: ['marcacao', 'marcacao-relativa'] });
  t('rumo', 'Rumo', 'navegacao', 'Direção da proa do barco, medida em graus de 000° a 360°, no sentido dos ponteiros do relógio, a partir do norte. Escreve-se sempre com três algarismos: rumo 045°. Com corrente ou abatimento, o caminho real sobre o fundo pode ser outro.',
    { en: 'course; heading', busca: ['proa (direção)'], ver: ['rumo-verdadeiro', 'rumo-magnetico', 'rumo-da-agulha', 'rumo-no-fundo', 'derrota'], widget: W_CARTA('rumo-dist', 'Praticar rumo e distância na carta') });
  t('rumo-verdadeiro', 'Rumo verdadeiro', 'navegacao', 'Rumo medido a partir do norte verdadeiro (geográfico). É o que se traça na carta. Abreviatura Rv. Para converter: Rv = Rag + Dag + Dmg, somando os valores a leste (E) e subtraindo os a oeste (W).',
    { en: 'true course', sin: ['Rv'], ver: ['rumo-magnetico', 'rumo-da-agulha', 'declinacao-magnetica', 'desvio-da-agulha'], fig: ['nortes', 'rumo-verdadeiro'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('rumo-magnetico', 'Rumo magnético', 'navegacao', 'Rumo medido a partir do norte magnético, para onde aponta uma agulha sem desvio. Abreviatura Rmg. Rmg = Rv − Dmg (com a declinação leste positiva e a oeste negativa).',
    { en: 'magnetic course', sin: ['Rmg'], ver: ['rumo-verdadeiro', 'declinacao-magnetica', 'rumo-da-agulha'], fig: ['nortes', 'rumo-magnetico'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('rumo-da-agulha', 'Rumo da agulha', 'navegacao', 'Rumo que se lê na agulha de bordo, medido a partir do norte da agulha (que se afasta do norte verdadeiro pela declinação magnética e pelo desvio da agulha). Abreviatura Rag.',
    { en: 'compass course', sin: ['Rag'], ver: ['desvio-da-agulha', 'rumo-magnetico', 'agulha', 'linha-de-fe'], fig: ['nortes', 'rumo-da-agulha'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('declinacao-magnetica', 'Declinação magnética', 'navegacao', 'Ângulo entre o norte verdadeiro e o norte magnético num lugar, para leste (E) ou para oeste (W). Muda de lugar para lugar e devagar com os anos: a rosa da carta traz o valor e a variação anual. No litoral brasileiro ela é oeste; no Rio de Janeiro, por exemplo, passa de 22°.',
    { en: 'magnetic variation (declination)', sin: ['Dmg', 'variação magnética'], ver: ['desvio-da-agulha', 'rumo-magnetico', 'rosa-dos-ventos'], fig: ['nortes', 'declinacao-magnetica'] });
  t('desvio-da-agulha', 'Desvio da agulha', 'navegacao', 'Ângulo entre o norte magnético e o norte da agulha de bordo, causado por ferros, motor e eletrônicos do barco. Muda com a proa: anota-se numa tabela de desvios feita na compensação da agulha.',
    { en: 'deviation', sin: ['Dag'], busca: ['curva de desvios'], ver: ['declinacao-magnetica', 'rumo-da-agulha', 'agulha'], fig: ['nortes', 'desvio-da-agulha'] });
  t('agulha', 'Agulha', 'navegacao', 'Bússola de bordo. A agulha de governo fica fixa, à vista do timoneiro; a agulha de marcação é portátil, para tirar marcações de pontos de terra e de outros barcos.',
    { en: 'compass; hand-bearing compass', sin: ['bússola', 'agulha magnética'], busca: ['agulha de marcação'], ver: ['linha-de-fe', 'desvio-da-agulha', 'marcacao'] });
  t('linha-de-fe', 'Linha de fé', 'navegacao', 'Marca na agulha alinhada com a proa do barco. O rumo é lido na rosa da agulha em frente a ela.',
    { en: 'lubber line', ver: ['agulha', 'rumo-da-agulha'] });
  t('rosa-dos-ventos', 'Rosa dos ventos', 'navegacao', 'Círculo graduado de 000° a 360°, com os pontos cardeais e colaterais, impresso nas cartas náuticas. Traz o norte verdadeiro e, por dentro, o magnético, com a declinação e a variação anual.',
    { en: 'compass rose', sin: ['rosa dos rumos'], ver: ['pontos-cardeais', 'declinacao-magnetica', 'carta-nautica'] });
  t('pontos-cardeais', 'Pontos cardeais', 'navegacao', 'Norte (N), leste (E), sul (S) e oeste (W). Na navegação, usam-se E e W, como nas cartas e nas coordenadas. Os intercardeais (ou laterais) são NE, SE, SW e NW; os colaterais são as subdivisões seguintes, como NNE e ENE.',
    { en: 'cardinal points', busca: ['colaterais'], ver: ['rosa-dos-ventos', 'marca-cardinal', 'longitude'] });
  t('milha-nautica', 'Milha náutica', 'navegacao', 'Unidade de distância do mar: 1 milha náutica = 1.852 metros, cerca de um minuto de arco de latitude. Por isso as distâncias se medem na escala de latitudes, na lateral da carta. Abreviatura M ou MN.',
    { en: 'nautical mile (NM)', sin: ['milha', 'MN'], ver: ['no-velocidade', 'latitude', 'compasso-de-navegacao'] });
  t('no-velocidade', 'Nó (velocidade)', 'navegacao', 'Unidade de velocidade: 1 nó = 1 milha náutica por hora (1,852 km/h). Um veleiro de cruzeiro costuma andar de 5 a 7 nós (num de 32 pés, por exemplo); barcos maiores andam mais.',
    { en: 'knot (kn)', sin: ['nós'], ver: ['milha-nautica', 'velocidade-de-casco', 'odometro'] });
  t('singradura', 'Singradura', 'navegacao', 'Distância navegada em 24 horas. A NORMAM-211 também usa a palavra para a viagem a ser feita.',
    { en: 'day’s run; passage', ver: ['derrota', 'milha-nautica'] });
  t('derrota', 'Derrota', 'navegacao', 'Caminho planejado ou percorrido pela embarcação de um ponto a outro, traçado na carta como uma sequência de rumos e distâncias.',
    { en: 'route, track', ver: ['waypoint', 'ortodromica', 'loxodromica', 'rumo'], widget: { w: 'derrota-calc', opts: {}, rotulo: 'Abrir a calculadora de derrotas' } });
  t('ortodromica', 'Ortodrômica', 'navegacao', 'Caminho mais curto entre dois pontos da Terra, ao longo de um círculo máximo. Na carta de Mercator aparece como uma curva, e o rumo muda o tempo todo. Compensa nas travessias longas.',
    { en: 'great circle (route)', sin: ['ortodromia', 'círculo máximo'], ver: ['loxodromica', 'derrota', 'projecao-de-mercator'], fig: ['ortoloxo', 'ortodromia'], widget: { w: 'derrota-calc', opts: { aba: 'derrotas' }, rotulo: 'Calcular uma derrota ortodrômica' } });
  t('loxodromica', 'Loxodrômica', 'navegacao', 'Linha que corta todos os meridianos com o mesmo ângulo: navegar nela é manter o rumo constante. Na carta de Mercator é uma reta, mas é mais longa que a ortodrômica.',
    { en: 'rhumb line', sin: ['loxodromia'], ver: ['ortodromica', 'projecao-de-mercator', 'rumo'], fig: ['ortoloxo', 'loxodromia'], widget: { w: 'derrota-calc', opts: { aba: 'derrotas' }, rotulo: 'Calcular uma derrota loxodrômica' } });
  t('waypoint', 'Waypoint', 'navegacao', 'Ponto de passagem de uma derrota, com latitude e longitude, gravado no GNSS ou no plotter. Deve ficar em águas seguras, longe de perigos.',
    { en: 'waypoint', sin: ['ponto de passagem', 'ponto de derrota'], ver: ['derrota', 'gnss', 'plotter'] });
  t('latitude', 'Latitude', 'navegacao', 'Distância angular de um lugar ao equador, de 0° a 90°, para norte (N) ou para sul (S). Lê-se nas escalas laterais da carta. Um grau tem 60 minutos, e um minuto de latitude vale cerca de 1 milha náutica.',
    { en: 'latitude', ver: ['longitude', 'paralelo', 'equador', 'milha-nautica'], fig: ['latlon', 'latitude'] });
  t('longitude', 'Longitude', 'navegacao', 'Distância angular de um lugar ao meridiano de Greenwich, de 0° a 180°, para leste (E) ou para oeste (W). Lê-se nas escalas de cima e de baixo da carta. Todo o Brasil fica em longitude oeste.',
    { en: 'longitude', ver: ['latitude', 'meridiano', 'fuso-horario'], fig: ['latlon', 'longitude'] });
  t('paralelo', 'Paralelo', 'navegacao', 'Círculo da Terra paralelo ao equador. Todos os pontos de um paralelo têm a mesma latitude.',
    { en: 'parallel (of latitude)', ver: ['latitude', 'equador', 'meridiano'], fig: ['latlon', 'paralelo'] });
  t('meridiano', 'Meridiano', 'navegacao', 'Círculo máximo da Terra que contém os dois polos (usa-se a metade que liga um polo ao outro). Todos os pontos de um meridiano têm a mesma longitude; o de Greenwich é o meridiano de origem (0°).',
    { en: 'meridian', busca: ['meridiano de Greenwich'], ver: ['longitude', 'paralelo', 'passagem-meridiana'], fig: ['latlon', 'meridiano'] });
  t('equador', 'Equador', 'navegacao', 'Círculo máximo da Terra a meio caminho entre os polos, na latitude 0°. Divide os hemisférios norte e sul.',
    { en: 'equator', ver: ['latitude', 'equador-celeste', 'zcit'], fig: ['latlon', 'equador'] });
  t('carta-nautica', 'Carta náutica', 'navegacao', 'Mapa do mar feito para navegar: mostra profundidades, perigos, faróis, boias, a costa e as marcas de terra. No Brasil, as cartas oficiais são da DHN, da Marinha. Use a edição em vigor, corrigida pelos Avisos aos Navegantes.',
    { en: 'nautical chart', sin: ['carta'], ver: ['carta-12000', 'avisos-aos-navegantes', 'escala-da-carta', 'isobata', 'sondagem', 'dhn'], fig: ['carta', 'carta-nautica'], legenda: 'Trecho fictício, só para treino: terra, isóbatas de 5, 10 e 20 m e sondagens em metros. Nunca use para navegar.', nota: false, widget: W_CARTA(null), link: { txt: 'Cartas náuticas (CHM)', url: URL.cartas } });
  t('projecao-de-mercator', 'Projeção de Mercator', 'navegacao', 'Projeção usada na maioria das cartas náuticas: meridianos e paralelos são retas perpendiculares, e os rumos constantes aparecem como retas. A escala cresce com a latitude, por isso as distâncias se medem na escala de latitudes, na altura em que se está.',
    { en: 'Mercator projection', ver: ['loxodromica', 'ortodromica', 'milha-nautica', 'carta-nautica'], fig: ['ortoloxo', 'nada'] });
  t('escala-da-carta', 'Escala da carta', 'navegacao', 'Relação entre a medida na carta e no terreno, como 1:50.000. Carta de grande escala, como 1:25.000, mostra uma área pequena com muitos detalhes; a de pequena escala, uma área grande com poucos detalhes.',
    { en: 'chart scale', ver: ['carta-nautica'] });
  t('datum', 'Datum', 'navegacao', 'Modelo da forma da Terra usado para dar latitude e longitude. O GNSS usa o WGS-84: antes de plotar uma posição do GNSS, confira na carta qual datum ela usa e se pede alguma correção.',
    { en: 'datum (geodetic)', ver: ['gnss', 'carta-nautica', 'latitude'] });
  t('gnss', 'GNSS', 'navegacao', 'Sistemas de navegação por satélite, como o GPS (EUA), o Galileo (Europa), o GLONASS (Rússia) e o BeiDou (China). Dão a posição com erro de poucos metros, mas podem falhar: mantenha a navegação estimada e a carta em papel.',
    { en: 'GNSS (Global Navigation Satellite System)', busca: ['GPS'], ver: ['plotter', 'waypoint', 'datum', 'navegacao-estimada'] });
  t('radar', 'Radar', 'navegacao', 'Aparelho que emite ondas de rádio e mostra na tela os ecos de terra, navios e chuva, com distância e marcação. Funciona à noite e no nevoeiro, mas barcos pequenos de fibra refletem pouco.',
    { en: 'radar', ver: ['refletor-radar', 'sart', 'ais', 'marcacao'] });
  t('ais', 'AIS', 'navegacao', 'Sistema Automático de Identificação: transmissor e receptor em VHF que troca nome, posição, rumo e velocidade entre embarcações e estações de terra. A classe A é a dos navios; a classe B, a dos barcos de recreio.',
    { en: 'AIS (Automatic Identification System)', ver: ['radar', 'vhf', 'ais-mob', 'sart', 'mmsi'] });
  t('ecobatimetro', 'Ecobatímetro', 'navegacao', 'Instrumento que mede a profundidade sob o casco com pulsos de som. Pode ser regulado para mostrar a profundidade abaixo da quilha ou da superfície: saiba qual é a do seu barco.',
    { en: 'echo sounder, depth sounder', sin: ['sonda', 'profundímetro'], ver: ['calado', 'sondagem', 'isobata'] });
  t('odometro', 'Odômetro', 'navegacao', 'Instrumento que mede a velocidade e a distância percorrida pelo barco na água, em geral por uma pequena hélice ou roda no casco. Não inclui a corrente, que o GNSS percebe.',
    { en: 'log (speed log)', ver: ['no-velocidade', 'navegacao-estimada', 'rumo-no-fundo'] });
  t('plotter', 'Plotter', 'navegacao', 'Tela que mostra cartas eletrônicas com a posição do GNSS, a derrota e os waypoints. Ajuda muito, mas confira com a carta oficial e com a navegação estimada.',
    { en: 'chartplotter', sin: ['chartplotter'], busca: ['carta eletrônica'], ver: ['gnss', 'waypoint', 'carta-nautica'] });
  t('piloto-automatico', 'Piloto automático', 'navegacao', 'Aparelho elétrico que governa o barco sozinho, mantendo um rumo da agulha ou um ângulo com o vento. Com ele ligado, a vigilância continua obrigatória.',
    { en: 'autopilot', ver: ['piloto-de-vento', 'governar', 'vigilancia'] });
  t('piloto-de-vento', 'Piloto de vento', 'navegacao', 'Sistema mecânico na popa que governa o barco pelo vento aparente, sem gastar energia elétrica. Muito usado em travessias oceânicas.',
    { en: 'windvane self-steering', sin: ['leme de vento', 'cata-vento'], ver: ['piloto-automatico', 'vento-aparente'] });
  t('compasso-de-navegacao', 'Compasso de navegação', 'navegacao', 'Compasso de pontas secas usado para medir e transportar distâncias na carta, sempre comparando com a escala de latitudes.',
    { en: 'dividers', sin: ['compasso de pontas secas'], ver: ['regua-paralela', 'milha-nautica', 'carta-nautica'] });
  t('regua-paralela', 'Régua paralela', 'navegacao', 'Régua dupla articulada que leva uma direção da rosa da carta até outro ponto, para traçar rumos e marcações. O plotador paralelo, com roletes, faz o mesmo.',
    { en: 'parallel rule', busca: ['esquadros'], ver: ['compasso-de-navegacao', 'rosa-dos-ventos', 'rumo'] });
  t('rumo-no-fundo', 'Rumo e velocidade no fundo', 'navegacao', 'Direção e velocidade reais do barco em relação ao fundo: o rumo e a velocidade na água somados ao efeito da corrente (e do vento e do mar). São o COG e o SOG que o GNSS mostra.',
    { en: 'course over ground (COG); speed over ground (SOG)', sin: ['COG', 'SOG', 'velocidade no fundo'], busca: ['rumo na superfície'], ver: ['corrente', 'abatimento', 'triangulo-de-corrente', 'gnss'], fig: ['corrente', 'rumo-no-fundo'] });
  t('corrente', 'Corrente', 'navegacao', 'Movimento horizontal da água. Indica-se pela direção para onde ela vai (rumo da corrente) e pela velocidade em nós. Atenção: o vento é dado de onde vem; a corrente, para onde vai.',
    { en: 'current (set and drift)', ver: ['corrente-de-mare', 'deriva', 'triangulo-de-corrente', 'rumo-no-fundo'], fig: ['corrente', 'corrente'] });
  t('triangulo-de-corrente', 'Triângulo de corrente', 'navegacao', 'Construção na carta que soma o rumo e a velocidade na água com a corrente, para achar o rumo e a velocidade no fundo, ou o rumo a governar para compensar a corrente.',
    { en: 'current triangle (vector triangle)', ver: ['corrente', 'rumo-no-fundo', 'navegacao-estimada'], fig: ['corrente', 'nada'], widget: W_CARTA('corrente', 'Praticar o triângulo de corrente') });

  /* ===================== Cartas, marés e balizamento ===================== */
  t('mare', 'Maré', 'carta', 'Subida e descida periódica do nível do mar, causada principalmente pela atração da Lua e do Sol. Na maior parte do litoral brasileiro, é semidiurna: duas preamares e duas baixa-mares por dia, com cerca de 6 horas e 12 minutos entre elas.',
    { en: 'tide', ver: ['preamar', 'baixa-mar', 'amplitude', 'sizigia', 'tabua-das-mares'], fig: ['mare', 'nada'] });
  t('preamar', 'Preamar', 'carta', 'Nível mais alto que a maré alcança num ciclo. Abreviatura PM.',
    { en: 'high water (HW)', sin: ['PM', 'maré cheia'], ver: ['baixa-mar', 'amplitude', 'estofo'], fig: ['mare', 'preamar'] });
  t('baixa-mar', 'Baixa-mar', 'carta', 'Nível mais baixo que a maré alcança num ciclo. Abreviatura BM.',
    { en: 'low water (LW)', sin: ['BM', 'maré baixa'], ver: ['preamar', 'amplitude', 'nivel-de-reducao'], fig: ['mare', 'baixa-mar'] });
  t('amplitude', 'Amplitude da maré', 'carta', 'Diferença de altura entre uma preamar e a baixa-mar seguinte (ou anterior). É maior na sizígia e menor na quadratura. Exemplo do Manual de Navegação, em Salinópolis (PA): cerca de 4,7 m na sizígia de 13/3/2021 e 2,0 m na quadratura de 21/3/2021. A Tábua das Marés traz as alturas de cada porto.',
    { en: '(tidal) range', ver: ['preamar', 'baixa-mar', 'sizigia', 'quadratura', 'regra-dos-doze-avos'], fig: ['mare', 'amplitude'] });
  t('altura-da-mare', 'Altura da maré', 'carta', 'Altura do nível do mar acima do nível de redução num dado instante. A Tábua das Marés traz as alturas e as horas das preamares e das baixa-mares de cada dia.',
    { en: 'height of tide', ver: ['nivel-de-reducao', 'sondagem', 'tabua-das-mares'], fig: ['mare', 'altura-da-mare'] });
  t('nivel-de-reducao', 'Nível de redução', 'carta', 'Plano de referência a partir do qual se medem as sondagens da carta e as alturas da Tábua das Marés. Fica perto das baixa-mares mais baixas, para que quase sempre haja mais água do que a carta mostra. Abreviatura NR; o nível usado vem escrito na carta.',
    { en: 'chart datum', sin: ['NR'], ver: ['sondagem', 'altura-da-mare', 'baixa-mar'], fig: ['mare', 'nivel-de-reducao'] });
  t('enchente', 'Enchente', 'carta', 'Período em que a maré sobe, da baixa-mar até a preamar. A corrente de enchente é a que entra nos estuários e nas baías nesse período.',
    { en: 'flood (rising tide; flood stream)', ver: ['vazante', 'corrente-de-mare', 'estofo'], fig: ['mare', 'enchente'] });
  t('vazante', 'Vazante', 'carta', 'Período em que a maré desce, da preamar até a baixa-mar. A corrente de vazante é a que sai dos estuários e das baías.',
    { en: 'ebb (falling tide; ebb stream)', ver: ['enchente', 'corrente-de-mare', 'estofo'], fig: ['mare', 'vazante'] });
  t('estofo', 'Estofo', 'carta', 'Intervalo, perto da preamar ou da baixa-mar, em que o nível do mar fica praticamente estacionado. Em geral é a hora de corrente mínima, boa para entrar num canal. Mas em canais longos e estuários a corrente tem outro ritmo (em Santana, AP, ela é máxima na preamar): consulte as Cartas de Correntes de Maré.',
    { en: 'stand of the tide; slack water', ver: ['preamar', 'baixa-mar', 'corrente-de-mare'], fig: ['mare', 'estofo'] });
  t('sizigia', 'Sizígia', 'carta', 'Época da lua nova e da lua cheia, quando Sol, Terra e Lua ficam alinhados e as marés têm as maiores amplitudes. São as marés de águas vivas.',
    { en: 'spring tide', sin: ['águas vivas'], ver: ['quadratura', 'amplitude', 'mare'], fig: ['sizigia', 'sizigia'] });
  t('quadratura', 'Quadratura', 'carta', 'Época do quarto crescente e do quarto minguante, quando Sol e Lua formam ângulo reto com a Terra e as marés têm as menores amplitudes. São as marés de águas mortas.',
    { en: 'neap tide', sin: ['águas mortas'], ver: ['sizigia', 'amplitude', 'mare'], fig: ['sizigia', 'quadratura'] });
  t('regra-dos-doze-avos', 'Regra dos doze avos', 'carta', 'Regra prática para estimar a altura da maré entre a baixa-mar e a preamar: em cada uma das seis horas, a maré sobe 1, 2, 3, 3, 2 e 1 doze avos da amplitude (e desce do mesmo jeito). Vale para marés semidiurnas regulares.',
    { en: 'rule of twelfths', ver: ['amplitude', 'altura-da-mare', 'tabua-das-mares'], fig: ['mare', 'regra-dos-doze-avos'] });
  t('corrente-de-mare', 'Corrente de maré', 'carta', 'Corrente horizontal causada pela maré, que muda de sentido entre a enchente e a vazante. Pode ser forte em canais, barras e baías. A DHN publica Cartas de Correntes de Maré de alguns portos.',
    { en: 'tidal stream', ver: ['enchente', 'vazante', 'estofo', 'corrente'], link: { txt: 'Cartas de Correntes de Maré (CHM)', url: URL.correntesMare } });
  t('tabua-das-mares', 'Tábua das Marés', 'carta', 'Publicação da DHN com as horas e as alturas previstas das preamares e baixa-mares de portos do Brasil, referidas ao nível de redução. O CHM a disponibiliza no seu site.',
    { en: 'tide tables', ver: ['mare', 'altura-da-mare', 'nivel-de-reducao'], link: { txt: 'Tábuas das Marés (CHM)', url: URL.tabuas } });
  t('isobata', 'Isóbata', 'carta', 'Linha que liga pontos de mesma profundidade na carta, como as curvas de nível de um mapa de terra.',
    { en: 'depth contour', ver: ['sondagem', 'carta-nautica', 'ecobatimetro'], fig: ['carta', 'isobata'] });
  t('sondagem', 'Sondagem', 'carta', 'Número na carta que indica a profundidade naquele ponto, em metros, abaixo do nível de redução. A profundidade de verdade é a sondagem mais a altura da maré no momento.',
    { en: 'sounding (charted depth)', ver: ['nivel-de-reducao', 'altura-da-mare', 'isobata', 'calado'], fig: ['carta', 'sondagem'] });
  t('carta-12000', 'Carta 12000', 'carta', 'Publicação da DHN que explica os símbolos, as abreviaturas e os termos usados nas cartas náuticas brasileiras. Corresponde à carta INT 1 internacional.',
    { en: 'Chart 1 (INT 1)', sin: ['INT 1'], ver: ['carta-nautica', 'isobata'], link: { txt: 'Carta 12000 (INT 1), CHM', url: URL.carta12000 } });
  t('avisos-aos-navegantes', 'Avisos aos Navegantes', 'carta', 'Publicação da DHN com as correções das cartas e das publicações náuticas e com informações de segurança, como faróis apagados, perigos novos e obras. As cartas de bordo devem ser mantidas corrigidas por ela.',
    { en: 'Notices to Mariners', ver: ['carta-nautica', 'lista-de-farois'], link: { txt: 'Avisos aos Navegantes (CHM)', url: URL.avisos } });
  t('lista-de-farois', 'Lista de Faróis', 'carta', 'Publicação da DHN com a descrição dos faróis, faroletes e boias luminosas da costa, com a posição, a característica da luz, a altura e o alcance.',
    { en: 'List of Lights', ver: ['farol', 'caracteristica-da-luz', 'alcance'], link: { txt: 'Lista de Faróis (CHM)', url: URL.farois } });
  t('roteiro', 'Roteiro', 'carta', 'Publicação da DHN que descreve a costa, os portos, as barras, os perigos, os fundeadouros e os recursos de cada trecho do litoral. Completa a carta.',
    { en: 'Sailing Directions (Pilot)', ver: ['carta-nautica', 'lista-de-farois'], link: { txt: 'Roteiros (CHM)', url: URL.roteiros } });
  t('farol', 'Farol', 'carta', 'Estrutura fixa, com luz de característica própria, que serve de marca de dia e de noite. Pela definição da Marinha, o alcance luminoso noturno de um farol é maior que 10 milhas náuticas.',
    { en: 'lighthouse', ver: ['caracteristica-da-luz', 'alcance', 'lista-de-farois', 'marcacao'] });
  var W_LUZ = function (c, rot) { return { w: 'ritmos-luz', opts: { caracteristica: c }, rotulo: rot || 'Ver o ritmo da luz' }; };
  t('caracteristica-da-luz', 'Característica da luz', 'carta', 'Modo como a luz de um farol ou de uma boia acende e apaga, para ser identificada: ritmo, cor e período. Exemplo: Fl(3) W 15s (Lp(3) B 15s nas cartas brasileiras) são três lampejos brancos a cada 15 segundos.',
    { en: 'light characteristic', ver: ['lampejo', 'ocultacao', 'isofasica', 'luz-rapida', 'farol'], widget: W_LUZ('Fl(3) W 15s', 'Abrir o decodificador de luzes') });
  t('lampejo', 'Lampejo', 'carta', 'Luz que fica acesa por menos tempo do que apagada, em clarões. Abreviatura Lp. nas cartas brasileiras (Fl nas cartas INT, em inglês).',
    { en: 'flashing (Fl)', ver: ['caracteristica-da-luz', 'ocultacao', 'isofasica'], widget: W_LUZ('Fl W 5s') });
  t('ocultacao', 'Ocultação', 'carta', 'Luz que fica acesa por mais tempo do que apagada, com eclipses curtos. Abreviatura Oc.',
    { en: 'occulting (Oc)', ver: ['caracteristica-da-luz', 'lampejo', 'isofasica'], widget: W_LUZ('Oc W 4s') });
  t('isofasica', 'Isofásica', 'carta', 'Luz com tempos iguais de luz e de escuridão. Abreviatura Iso.',
    { en: 'isophase (Iso)', ver: ['caracteristica-da-luz', 'aguas-seguras'], widget: W_LUZ('Iso W 4s') });
  t('luz-rapida', 'Luz rápida', 'carta', 'Luz de lampejos rápidos e seguidos, de 50 a 79 por minuto (abreviatura R na Lista de Faróis; Q nas cartas INT). A muito rápida (MR; VQ nas cartas INT) tem de 80 a 159 lampejos por minuto. São as luzes das marcas cardinais.',
    { en: 'quick (Q); very quick (VQ)', sin: ['rápida'], busca: ['muito rápida'], ver: ['marca-cardinal', 'caracteristica-da-luz'], widget: W_LUZ('Q(3) 10s') });
  t('alcance', 'Alcance de uma luz', 'carta', 'Distância máxima em que uma luz pode ser vista. O alcance luminoso depende da intensidade da luz e da visibilidade; o geográfico, da altura da luz e do olho do observador, por causa da curvatura da Terra.',
    { en: 'range (luminous, geographical)', ver: ['farol', 'lista-de-farois'] });
  t('balizamento', 'Balizamento', 'carta', 'Sistema de boias e marcas que indica canais, perigos e áreas especiais. O Brasil adota o Sistema de Balizamento Marítimo da IALA, Região B, aprovado pelo Decreto nº 92.267, de 1986.',
    { en: 'buoyage (maritime buoyage system)', ver: ['iala-regiao-b', 'marca-lateral', 'marca-cardinal', 'perigo-isolado', 'aguas-seguras', 'marca-especial'], fig: ['laterais', 'nada'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' }, fonte: { txt: 'Decreto nº 92.267/1986', url: URL.iala, loc: 'art. 1º' } });
  t('iala-regiao-b', 'IALA Região B', 'carta', 'Região do sistema de balizamento da IALA usada nas Américas, no Japão, na Coreia e nas Filipinas. Nela, quem entra do mar deixa as marcas vermelhas por boreste e as verdes por bombordo, o contrário da Região A.',
    { en: 'IALA Region B', ver: ['balizamento', 'marca-lateral'], fig: ['laterais', 'iala-regiao-b'], fonte: { txt: 'Decreto nº 92.267/1986', url: URL.iala, loc: 'art. 1º' } });
  t('marca-lateral', 'Marca lateral', 'carta', 'Marca que indica os lados de um canal. Na Região B, para quem entra do mar: verde, cilíndrica, por bombordo; vermelha, cônica, por boreste. O sentido de entrada é o que vem do mar para o porto, ou o definido pela autoridade.',
    { en: 'lateral mark', ver: ['iala-regiao-b', 'balizamento', 'marca-cardinal'], fig: ['laterais', 'marca-lateral'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' } });
  t('marca-cardinal', 'Marca cardinal', 'carta', 'Marca que diz de que lado está a água segura em relação a um perigo, pelos pontos cardeais: passe ao norte de uma cardinal norte, ao sul de uma cardinal sul, e assim por diante. É preta e amarela, com tope de dois cones pretos, e tem luz branca rápida ou muito rápida.',
    { en: 'cardinal mark', ver: ['pontos-cardeais', 'luz-rapida', 'balizamento', 'perigo-isolado'], fig: ['cardinais', 'marca-cardinal'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' } });
  t('perigo-isolado', 'Marca de perigo isolado', 'carta', 'Marca posta sobre um perigo pequeno, com água navegável em volta. É preta com uma ou mais faixas vermelhas, tem tope de duas esferas pretas e luz branca Fl(2).',
    { en: 'isolated danger mark', ver: ['marca-cardinal', 'balizamento'], fig: ['outras', 'perigo-isolado'] });
  t('aguas-seguras', 'Marca de águas seguras', 'carta', 'Marca que indica água navegável em volta, como o meio de um canal ou a aproximação de um porto. Tem listras verticais vermelhas e brancas, tope de uma esfera vermelha e luz branca isofásica, de ocultação, de lampejo longo de 10 s ou Mo(A).',
    { en: 'safe water mark', ver: ['balizamento', 'isofasica'], fig: ['outras', 'aguas-seguras'] });
  t('marca-especial', 'Marca especial', 'carta', 'Marca amarela, com tope em X, que indica uma área ou coisa especial (cabo submarino, área de exercícios, emissário, área de recreio) e não serve de guia para a navegação. A luz, se houver, é amarela.',
    { en: 'special mark', ver: ['balizamento'], fig: ['outras', 'marca-especial'] });
  t('naufragio-recente', 'Marca de naufrágio recente', 'carta', 'Boia de listras verticais azuis e amarelas, com tope em cruz amarela e luz alternada azul e amarela, posta provisoriamente sobre um naufrágio novo, ainda fora das cartas.',
    { en: 'emergency wreck marking buoy', ver: ['balizamento', 'avisos-aos-navegantes'], fig: ['outras', 'marca-de-naufragio'] });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('latitude-media', 'Latitude média', 'navegacao', 'Latitude do paralelo que fica no meio entre dois lugares: a semissoma das latitudes, se os dois estão no mesmo hemisfério, ou a semidiferença, se estão em hemisférios diferentes (com o nome da maior). Na estima, serve para converter o apartamento em diferença de longitude: Δλ = apartamento ÷ cos φm.',
    { en: 'middle latitude (mean latitude)', sin: ['φm', 'paralelo médio'], ver: ['latitude', 'apartamento', 'navegacao-estimada', 'derrota'], fonte: mig1('definição de latitude média, PDF p. 29') });
  t('latitude-crescida', 'Latitude crescida', 'carta', 'Na projeção de Mercator, o comprimento do arco de meridiano entre o equador e um paralelo, medido em minutos de longitude (1 minuto do equador). Cresce mais depressa que a latitude: por isso a escala de latitudes da carta aumenta em direção aos polos e as distâncias só são verdadeiras se lidas na escala de latitudes, na altura do trecho.',
    { en: 'meridional parts', sin: ['latitudes crescidas'], ver: ['projecao-de-mercator', 'carta-nautica', 'escala-da-carta', 'latitude'], fonte: mig1('cap. 2, item 2.4.4, PDF p. 47') });
  t('apartamento', 'Apartamento', 'navegacao', 'Distância percorrida para leste ou para oeste, medida sobre o paralelo, em milhas. Calcula-se por apartamento = Δλ × cos φm, com Δλ em minutos de arco. Junto com a diferença de latitude, forma o triângulo da navegação plana (estima): tan R = apartamento ÷ Δφ.',
    { en: 'departure', ver: ['latitude-media', 'navegacao-estimada', 'rumo', 'derrota'] });
  t('navegacao-por-paralelo', 'Navegação por paralelo', 'navegacao', 'Método para quem não tem relógio preciso (e portanto não sabe a longitude): navega-se até a latitude do destino e segue-se por esse paralelo, para leste ou para oeste, até avistar a terra. A latitude é mantida constante, mas a rota costuma ser mais longa que a direta.',
    { en: 'parallel sailing (running down the latitude)', ver: ['latitude', 'longitude', 'paralelo', 'navegacao-estimada'] });
  t('plano-de-viagem', 'Plano de viagem', 'navegacao', 'Planejamento da viagem antes de sair: rota, pontos de passagem, distâncias, horários, abrigos e alternativas. Na navegação de esporte e recreio, o Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.',
    { en: 'passage plan (voyage plan)', ver: ['aviso-de-saida', 'navseg', 'derrota', 'janela-meteorologica'], fonte: n211('Cap. 4, art. 4.6.1, p. 4-3') });
  t('diario-de-bordo', 'Diário de bordo', 'navegacao', 'Livro em que se anotam, em ordem de hora, posições, rumos, velocidades, tempo e ocorrências da viagem. Alimenta a navegação estimada e ajuda a reconstituir o que aconteceu. O Manual de Navegação da Marinha relaciona o “Diário de Navegação” entre os livros e publicações de bordo.',
    { en: 'logbook', sin: ['diário de navegação'], ver: ['navegacao-estimada', 'posicao-estimada', 'barograma'], fonte: mig1('cap. 12, lista de publicações e livros de bordo, PDF p. 377') });

  /* ===================== Navegação astronômica ===================== */
  var W_ESFERA = { w: 'esfera-celeste', opts: { vista: 'observador' }, rotulo: 'Abrir a esfera celeste em 3D' };
  var W_RETA = { w: 'reta-altura', opts: {}, rotulo: 'Abrir o cálculo da reta de altura' };
  t('navegacao-astronomica', 'Navegação astronômica', 'astro', 'Achar a posição pela observação dos astros (Sol, Lua, planetas e estrelas) com o sextante, um relógio preciso e o Almanaque Náutico. Está no programa da prova de Capitão-Amador e é o plano B quando o GNSS falha.',
    { en: 'celestial navigation', ver: ['sextante', 'reta-de-altura', 'almanaque-nautico', 'passagem-meridiana', 'capitao-amador'], widget: W_RETA, fonte: n211('Anexo 5-A, item 1.1 a), p. 5-A-2') });
  t('sextante', 'Sextante', 'astro', 'Instrumento de reflexão, com dois espelhos, que mede o ângulo entre um astro e o horizonte com precisão de décimos de minuto de arco.',
    { en: 'sextant', ver: ['altura', 'horizonte', 'navegacao-astronomica'], fig: ['sextante', 'nada'], widget: { w: 'sextante', opts: {}, rotulo: 'Abrir o simulador de sextante' } });
  t('altura', 'Altura de um astro', 'astro', 'Ângulo vertical entre o horizonte e o astro, medido com o sextante. A altura lida no instrumento passa por correções (erro instrumental, depressão do horizonte, refração, semidiâmetro e paralaxe) até virar a altura verdadeira.',
    { en: 'altitude', ver: ['distancia-zenital', 'sextante', 'depressao-do-horizonte', 'reta-de-altura'], fig: ['esfera', 'altura'], widget: W_ESFERA });
  t('distancia-zenital', 'Distância zenital', 'astro', 'Ângulo entre o zênite e o astro: 90° menos a altura.',
    { en: 'zenith distance', ver: ['altura', 'zenite'], fig: ['esfera', 'distancia-zenital'] });
  t('azimute', 'Azimute', 'astro', 'Direção horizontal de um astro, medida do norte, pelo leste, de 000° a 360°. Comparar o azimute calculado do Sol com a marcação pela agulha dá o erro da agulha.',
    { en: 'azimuth', sin: ['Az'], ver: ['altura', 'marcacao', 'desvio-da-agulha'], fig: ['esfera', 'azimute'], widget: W_ESFERA });
  t('declinacao-do-astro', 'Declinação de um astro', 'astro', 'Distância angular do astro ao equador celeste, para norte ou para sul, como se fosse a latitude dele. O Almanaque Náutico dá o valor para cada hora. Não confunda com a declinação magnética.',
    { en: 'declination', ver: ['equador-celeste', 'angulo-horario', 'almanaque-nautico', 'declinacao-magnetica'], widget: W_ESFERA });
  t('angulo-horario', 'Ângulo horário', 'astro', 'Ângulo medido no equador celeste, para oeste, do meridiano de Greenwich (AHG) ou do meridiano do observador (AHL) até o meridiano do astro, de 0° a 360°. AHL = AHG + longitude leste, ou AHG − longitude oeste.',
    { en: 'hour angle (GHA, LHA)', sin: ['AHG', 'AHL'], ver: ['declinacao-do-astro', 'longitude', 'almanaque-nautico'], widget: W_ESFERA });
  t('passagem-meridiana', 'Passagem meridiana', 'astro', 'Momento em que o astro cruza o meridiano do observador e atinge a maior altura do dia. Com o Sol, permite achar a latitude de forma simples, a “meridiana” do meio-dia.',
    { en: 'meridian passage', sin: ['meridiana'], ver: ['latitude', 'altura', 'equacao-do-tempo', 'hora-legal'], widget: W_RETA });
  t('zenite', 'Zênite', 'astro', 'Ponto do céu exatamente acima do observador.',
    { en: 'zenith', ver: ['nadir', 'distancia-zenital', 'esfera-celeste'], fig: ['esfera', 'zenite'] });
  t('nadir', 'Nadir', 'astro', 'Ponto oposto ao zênite, exatamente abaixo do observador.',
    { en: 'nadir', ver: ['zenite', 'esfera-celeste'], fig: ['esfera', 'nadir'] });
  t('horizonte', 'Horizonte', 'astro', 'Linha em que o céu parece encontrar o mar. O horizonte visível fica um pouco abaixo do horizontal por causa da altura do olho do observador.',
    { en: 'horizon', ver: ['depressao-do-horizonte', 'altura', 'sextante'], fig: ['esfera', 'horizonte'] });
  t('depressao-do-horizonte', 'Depressão do horizonte', 'astro', 'Correção da altura do sextante pela altura do olho acima do mar: quanto mais alto o olho, mais o horizonte visível fica abaixo do horizontal.',
    { en: 'dip', ver: ['horizonte', 'altura', 'sextante'] });
  t('esfera-celeste', 'Esfera celeste', 'astro', 'Esfera imaginária, de raio infinito, centrada na Terra, onde parecem estar os astros. Tem polos, equador e meridianos, como a Terra.',
    { en: 'celestial sphere', ver: ['equador-celeste', 'polo-celeste', 'zenite', 'triangulo-de-posicao'], fig: ['esfera', 'nada'], widget: { w: 'esfera-celeste', opts: { vista: 'fora' }, rotulo: 'Abrir a esfera celeste em 3D' } });
  t('equador-celeste', 'Equador celeste', 'astro', 'Projeção do equador da Terra na esfera celeste. A declinação dos astros é medida a partir dele.',
    { en: 'celestial equator', ver: ['declinacao-do-astro', 'esfera-celeste', 'equador'], widget: W_ESFERA });
  t('polo-celeste', 'Polo celeste', 'astro', 'Cada um dos pontos da esfera celeste em volta dos quais o céu parece girar. A altura do polo celeste acima do horizonte é igual à latitude do observador.',
    { en: 'celestial pole', ver: ['cruzeiro-do-sul', 'latitude', 'esfera-celeste'], widget: W_ESFERA });
  t('almanaque-nautico', 'Almanaque Náutico', 'astro', 'Publicação anual da DHN com o AHG e a declinação do Sol, da Lua e dos planetas para cada hora do ano e, para as estrelas, a declinação, a ascensão reta versa e o AHG do Ponto Vernal, além das tábuas de correção das alturas.',
    { en: 'Nautical Almanac', ver: ['angulo-horario', 'declinacao-do-astro', 'navegacao-astronomica'], link: { txt: 'Almanaque Náutico (CHM)', url: URL.almanaque } });
  t('reta-de-altura', 'Reta de altura', 'astro', 'Linha de posição obtida pela altura de um astro. No método de Marcq Saint-Hilaire, compara-se a altura observada com a calculada para a posição estimada: a diferença (o intercepto) diz quantas milhas andar na direção do azimute para traçar a reta.',
    { en: 'position line (celestial line of position)', busca: ['Marcq Saint-Hilaire', 'intercepto'], ver: ['linha-de-posicao', 'altura', 'azimute', 'posicao-estimada'], widget: W_RETA });
  t('triangulo-de-posicao', 'Triângulo de posição', 'astro', 'Triângulo na esfera celeste com vértices no polo elevado, no zênite do observador e no astro. Resolvê-lo dá a altura e o azimute calculados.',
    { en: 'navigational triangle (PZX)', ver: ['reta-de-altura', 'esfera-celeste', 'zenite'], widget: W_ESFERA });
  t('posicao-geografica-do-astro', 'Posição geográfica do astro', 'astro', 'Ponto da Terra que tem o astro bem no zênite naquele instante. A latitude dele é a declinação do astro, e a longitude vem do AHG.',
    { en: 'geographical position (GP)', ver: ['declinacao-do-astro', 'angulo-horario', 'reta-de-altura'] });
  t('hora-legal', 'Hora legal', 'astro', 'Hora oficial do fuso em que se está. No mar, o comandante ajusta os relógios de bordo ao fuso da posição.',
    { en: 'zone time, standard time', ver: ['fuso-horario', 'hora-media-de-greenwich'] });
  t('fuso-horario', 'Fuso horário', 'astro', 'Faixa de 15° de longitude em que vale a mesma hora legal; cada fuso difere uma hora do vizinho. Em navegação, o fuso é dado pelo número de horas a somar à hora legal para ter a de Greenwich: o horário de Brasília é o fuso +3 (letra P).',
    { en: 'time zone (zone description)', ver: ['hora-legal', 'hora-media-de-greenwich', 'longitude'] });
  t('hora-media-de-greenwich', 'Hora Média de Greenwich', 'astro', 'Hora do meridiano de Greenwich, usada como referência na navegação astronômica e nas comunicações. Na prática, hoje se usa o UTC. Abreviatura HMG.',
    { en: 'Greenwich Mean Time (GMT); UTC', sin: ['HMG', 'GMT'], busca: ['UTC'], ver: ['fuso-horario', 'cronometro', 'angulo-horario'] });
  t('crepusculo-nautico', 'Crepúsculo náutico', 'astro', 'Período antes do nascer e depois do pôr do sol. Na definição da DHN, o da manhã começa quando o centro do Sol está 12° abaixo do horizonte e termina no nascer do Sol; o da tarde começa no pôr do Sol e termina aos 12°. O Almanaque Náutico tabula o início e o fim aos 12°, instantes em que o horizonte já está escuro demais para o sextante.',
    { en: 'nautical twilight', ver: ['sextante', 'horizonte'] });
  t('equacao-do-tempo', 'Equação do tempo', 'astro', 'Diferença entre o tempo solar verdadeiro e o tempo solar médio, que chega a cerca de 16 minutos ao longo do ano. É por isso que o Sol não passa no meridiano sempre ao meio-dia em ponto.',
    { en: 'equation of time', ver: ['passagem-meridiana', 'hora-legal'] });
  t('cronometro', 'Cronômetro', 'astro', 'Relógio de bordo muito preciso, acertado pela hora de Greenwich. É essencial na navegação astronômica: 4 segundos de erro na hora dão 1 minuto de erro na longitude.',
    { en: 'chronometer', ver: ['hora-media-de-greenwich', 'longitude', 'navegacao-astronomica'] });
  t('cruzeiro-do-sul', 'Cruzeiro do Sul', 'astro', 'Constelação do céu do sul usada para achar o polo sul celeste: prolongue o braço maior da cruz, de Gacrux para Acrux, cerca de 4,5 vezes o seu comprimento.',
    { en: 'Southern Cross (Crux)', ver: ['polo-celeste', 'latitude'] });

  /* ===================== Meteorologia e mar ===================== */
  var W_SINOT = { w: 'meteo-sinotica', opts: {}, rotulo: 'Abrir a carta sinótica interativa' };
  t('pressao-atmosferica', 'Pressão atmosférica', 'meteo', 'Peso do ar sobre a superfície, medido em hectopascais (hPa). O valor médio ao nível do mar é de cerca de 1013 hPa. Queda rápida da pressão anuncia mau tempo.',
    { en: 'atmospheric pressure', ver: ['barometro', 'isobara', 'baixa-pressao', 'alta-pressao'] });
  t('barometro', 'Barômetro', 'meteo', 'Instrumento que mede a pressão atmosférica. A bordo, mais importante que o valor é a tendência: uma queda de vários hectopascais em poucas horas indica vento forte chegando. Anote a pressão no diário de bordo.',
    { en: 'barometer', busca: ['barógrafo'], ver: ['pressao-atmosferica', 'baixa-pressao', 'frente-fria'] });
  t('isobara', 'Isóbara', 'meteo', 'Linha que liga pontos de mesma pressão na carta do tempo. Isóbaras próximas umas das outras indicam vento forte.',
    { en: 'isobar', ver: ['carta-sinotica', 'baixa-pressao', 'alta-pressao'], fig: ['pressao', 'baixa'], legenda: 'Isóbaras (linhas de mesma pressão, em hPa) em volta de um centro de baixa pressão no Hemisfério Sul.', nota: false, widget: W_SINOT });
  t('baixa-pressao', 'Baixa pressão', 'meteo', 'Área em que a pressão é menor que em volta, também chamada de ciclone ou depressão. Traz nuvens, chuva e vento. No Hemisfério Sul, o vento gira em volta dela no sentido dos ponteiros do relógio, entrando um pouco para o centro.',
    { en: 'low, depression, cyclone', sin: ['ciclone', 'depressão', 'centro de baixa'], ver: ['alta-pressao', 'ciclone-extratropical', 'lei-de-buys-ballot', 'forca-de-coriolis'], fig: ['pressao', 'baixa'], widget: W_SINOT });
  t('alta-pressao', 'Alta pressão', 'meteo', 'Área em que a pressão é maior que em volta, também chamada de anticiclone. Em geral traz tempo bom e vento fraco no centro. No Hemisfério Sul, o vento gira em volta dela no sentido anti-horário, saindo um pouco do centro.',
    { en: 'high, anticyclone', sin: ['anticiclone', 'centro de alta'], ver: ['baixa-pressao', 'asas', 'alisios'], fig: ['pressao', 'alta'], widget: W_SINOT });
  t('frente-fria', 'Frente fria', 'meteo', 'Borda de uma massa de ar frio que avança empurrando o ar quente, que sobe. No Sul e no Sudeste do Brasil, costuma chegar pelo sudoeste: antes dela, o vento ronda de nordeste para norte e noroeste e a pressão cai; na passagem, nuvens pesadas, chuva e rajadas; depois, vento de sul a sudoeste, frio e pressão subindo.',
    { en: 'cold front', ver: ['frente-quente', 'ciclone-extratropical', 'rondar', 'barometro'], fig: ['frente', 'fria'], legenda: 'A linha azul com triângulos é a frente fria; os triângulos apontam para onde ela avança.', nota: false, widget: W_SINOT });
  t('frente-quente', 'Frente quente', 'meteo', 'Borda de uma massa de ar quente que avança sobre o ar frio, subindo por cima dele. Traz nuvens em camadas e chuva fraca e contínua, com mudanças mais lentas que as de uma frente fria.',
    { en: 'warm front', ver: ['frente-fria', 'carta-sinotica'], fig: ['frente', 'quente'], legenda: 'A linha vermelha com semicírculos é a frente quente; os semicírculos apontam para onde ela avança, sobre o ar frio.', nota: false, widget: W_SINOT });
  t('ciclone-extratropical', 'Ciclone extratropical', 'meteo', 'Centro de baixa pressão que se forma fora dos trópicos, em geral ligado a frentes. No Sul e no Sudeste do Brasil, pode trazer vento muito forte e mar grosso. Acompanhe os avisos de mau tempo da Marinha.',
    { en: 'extratropical cyclone', ver: ['baixa-pressao', 'frente-fria', 'aviso-de-mau-tempo', 'ressaca'], widget: W_SINOT });
  t('ciclone-tropical', 'Ciclone tropical', 'meteo', 'Baixa pressão que se forma sobre mares quentes, sem frentes, com ventos muito fortes girando em volta de um olho. No Atlântico Norte, com vento médio de 64 nós ou mais, chama-se furacão; a temporada vai de junho a novembro. É raro no Atlântico Sul.',
    { en: 'tropical cyclone; hurricane', busca: ['furacão'], ver: ['baixa-pressao', 'pilot-charts', 'zcit'] });
  t('alisios', 'Alísios', 'meteo', 'Ventos constantes que sopram dos anticiclones subtropicais para o equador: de sudeste no Hemisfério Sul e de nordeste no Hemisfério Norte. São os ventos das travessias para o Caribe.',
    { en: 'trade winds', sin: ['ventos alísios'], ver: ['asas', 'zcit', 'pilot-charts'] });
  t('zcit', 'ZCIT', 'meteo', 'Zona de Convergência Intertropical: faixa perto do equador onde os alísios dos dois hemisférios se encontram. Tem calmarias, aguaceiros e trovoadas; os velejadores a chamam de doldrums. Muda de latitude ao longo do ano.',
    { en: 'ITCZ; doldrums', sin: ['Zona de Convergência Intertropical', 'doldrums'], ver: ['alisios', 'calmaria', 'cumulonimbo'] });
  t('asas', 'Alta Subtropical do Atlântico Sul', 'meteo', 'Grande anticiclone, quase fixo, sobre o Atlântico Sul. Gera o vento de nordeste comum no litoral do Sudeste e os alísios de leste e sudeste do Nordeste.',
    { en: 'South Atlantic Subtropical High', sin: ['ASAS', 'anticiclone do Atlântico Sul'], ver: ['alta-pressao', 'alisios', 'frente-fria'] });
  t('beaufort', 'Escala Beaufort', 'meteo', 'Escala de 0 a 12 que classifica a força do vento pela velocidade e pelo aspecto do mar. Força 4 (11 a 16 nós) é um bom vento para velejar; força 7 (28 a 33 nós) já é vento forte para um veleiro de cruzeiro.',
    { en: 'Beaufort scale', ver: ['rajada', 'calmaria', 'rizo', 'vento-real'], widget: { w: 'beaufort', opts: {}, rotulo: 'Abrir a escala Beaufort interativa' } });
  t('rajada', 'Rajada', 'meteo', 'Aumento brusco e passageiro da velocidade do vento, acima da média, que dura alguns segundos.',
    { en: 'gust', ver: ['borrasca', 'beaufort'] });
  t('calmaria', 'Calmaria', 'meteo', 'Ausência de vento: força 0 na escala Beaufort, menos de 1 nó.',
    { en: 'calm', ver: ['beaufort', 'zcit'] });
  t('borrasca', 'Borrasca', 'meteo', 'Vento forte e repentino que chega com uma nuvem pesada ou uma linha de chuva, dura de alguns minutos a cerca de meia hora e costuma mudar a direção do vento. Reduza o pano antes de ela chegar.',
    { en: 'squall', ver: ['rajada', 'cumulonimbo', 'reduzir-pano'] });
  t('cumulonimbo', 'Cumulonimbo', 'meteo', 'Nuvem de tempestade, muito alta, com topo em forma de bigorna. Traz trovoadas, raios, rajadas fortes e chuva intensa.',
    { en: 'cumulonimbus (Cb)', ver: ['borrasca', 'zcit'] });
  t('nevoeiro', 'Nevoeiro', 'meteo', 'Nuvem junto à superfície que reduz a visibilidade a menos de 1 km. No mar, o mais comum é o de advecção, quando ar quente e úmido passa sobre água mais fria. Use velocidade de segurança, radar e os sinais sonoros do RIPEAM.',
    { en: 'fog', ver: ['visibilidade-restrita', 'velocidade-de-seguranca', 'radar'] });
  t('marulho', 'Marulho', 'meteo', 'Ondas formadas longe dali, por ventos de outra região, que chegam regulares e longas, mesmo sem vento no local.',
    { en: 'swell', ver: ['vaga', 'onda', 'ressaca'] });
  t('vaga', 'Vaga', 'meteo', 'Ondas formadas pelo vento que sopra no local, mais curtas, irregulares e com cristas quebrando.',
    { en: 'wind sea, wind waves', ver: ['marulho', 'onda', 'pista'] });
  t('onda', 'Onda', 'meteo', 'Movimento da superfície do mar. A crista é o ponto mais alto; o cavado, o mais baixo; a altura é a distância vertical entre eles; o período, o tempo entre duas cristas passando no mesmo ponto.',
    { en: 'wave (crest, trough, height, period)', busca: ['crista', 'período'], ver: ['altura-significativa', 'marulho', 'vaga', 'cavado'], fig: ['ondas', 'nada'] });
  t('altura-significativa', 'Altura significativa', 'meteo', 'Média do terço mais alto das ondas. É o valor das previsões; ondas isoladas podem chegar a quase o dobro.',
    { en: 'significant wave height (Hs)', ver: ['onda', 'meteoromarinha'], fig: ['ondas', 'altura-de-onda'], legenda: 'A altura de cada onda vai do cavado à crista. A altura significativa é a média do terço mais alto das ondas.', nota: false });
  t('pista', 'Pista', 'meteo', 'Distância de mar aberto sobre a qual o vento sopra na mesma direção. Quanto maior a pista e mais tempo o vento sopra, maiores as ondas.',
    { en: 'fetch', ver: ['vaga', 'onda'] });
  t('ressaca', 'Ressaca', 'meteo', 'Agitação forte do mar junto à costa, com ondas grandes que avançam sobre as praias e quebram nas barras, em geral causada por ciclones e frentes frias distantes; a Marinha emite aviso de ressaca quando se esperam ondas de 2,5 m ou mais atingindo a costa. Barras e entradas de porto ficam perigosas.',
    { en: 'heavy swell, storm surf', ver: ['marulho', 'ciclone-extratropical', 'aviso-de-mau-tempo'] });
  t('brisa-maritima', 'Brisa marítima', 'meteo', 'Vento que sopra do mar para a terra durante o dia, quando a terra fica mais quente que a água. À noite pode surgir a brisa terrestre, no sentido contrário.',
    { en: 'sea breeze; land breeze', busca: ['brisa terrestre'], ver: ['vento-real'] });
  t('rondar', 'Rondar', 'meteo', 'Mudar de direção, falando do vento. Diz-se que o vento ronda pela direita (no sentido dos ponteiros do relógio, como de norte para leste) ou pela esquerda.',
    { en: 'veer (clockwise); back (anticlockwise)', ver: ['frente-fria', 'refrescar'] });
  t('refrescar', 'Refrescar', 'meteo', 'Aumentar de força, falando do vento.',
    { en: 'freshen, pick up', ver: ['rondar', 'reduzir-pano', 'beaufort'] });
  t('lei-de-buys-ballot', 'Lei de Buys-Ballot', 'meteo', 'Regra para achar o centro de baixa pressão: no Hemisfério Sul, de costas para o vento, a baixa fica à sua direita (no Hemisfério Norte, à esquerda).',
    { en: 'Buys Ballot’s law', ver: ['baixa-pressao', 'forca-de-coriolis'], fig: ['pressao', 'baixa'], legenda: 'No Hemisfério Sul, o vento gira no sentido horário em volta da baixa (B): de costas para o vento, ela fica à sua direita.', nota: false });
  t('forca-de-coriolis', 'Efeito de Coriolis', 'meteo', 'Efeito da rotação da Terra que desvia o vento e as correntes para a esquerda no Hemisfério Sul (para a direita no Norte). É por isso que o vento gira em volta das baixas e das altas.',
    { en: 'Coriolis effect', sin: ['força de Coriolis'], ver: ['baixa-pressao', 'alta-pressao', 'lei-de-buys-ballot'] });
  t('carta-sinotica', 'Carta sinótica', 'meteo', 'Mapa do tempo, numa hora, com a pressão (isóbaras), os centros de alta e de baixa e as frentes. A Marinha publica cartas sinóticas da área marítima do Brasil.',
    { en: 'synoptic chart, weather map', ver: ['isobara', 'frente-fria', 'baixa-pressao', 'grib'], widget: W_SINOT, link: { txt: 'Cartas sinóticas (CHM)', url: URL.sinoticas } });
  t('aviso-de-mau-tempo', 'Aviso de mau tempo', 'meteo', 'Aviso do Serviço Meteorológico Marinho, da Marinha, quando se esperam vento forte, mar agitado ou ressaca numa área. Consulte antes de sair e durante a viagem.',
    { en: 'gale warning, storm warning', ver: ['meteoromarinha', 'ciclone-extratropical', 'ressaca'], link: { txt: 'Avisos de mau tempo (CHM)', url: URL.mauTempo } });
  t('meteoromarinha', 'Meteoromarinha', 'meteo', 'Boletim de previsão do tempo para o mar, da Marinha do Brasil, com vento, ondas, visibilidade e avisos para as áreas da costa (área marítima METAREA V). É divulgado por rádio e no site do CHM.',
    { en: 'marine weather bulletin (METAREA V)', ver: ['aviso-de-mau-tempo', 'altura-significativa', 'navtex'], link: { txt: 'Previsão do tempo para o mar (CHM)', url: URL.meteoromarinha } });
  t('grib', 'GRIB', 'meteo', 'Formato de arquivo com previsões numéricas de vento, pressão e ondas, usado em travessias para planejar a rota. Mostra o resultado do modelo de computador, sem a análise de um meteorologista.',
    { en: 'GRIB file', ver: ['carta-sinotica', 'meteoromarinha', 'pilot-charts'] });
  t('pilot-charts', 'Cartas-piloto', 'meteo', 'Cartas com as médias mensais de vento, corrente, ondas e tempestades de cada oceano, feitas a partir de observações históricas. São a base para escolher a época e a rota de uma travessia. A DHN publica o Atlas de Cartas Piloto; as Pilot Charts dos EUA cobrem todos os oceanos.',
    { en: 'Pilot Charts', sin: ['Pilot Charts', 'Atlas de Cartas Piloto'], ver: ['alisios', 'ciclone-tropical', 'grib'], link: { txt: 'Pilot Charts (NGA, EUA)', url: URL.pilot } });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('hectopascal', 'Hectopascal', 'meteo', 'Unidade de pressão atmosférica usada nos boletins e nas cartas sinóticas. 1 hPa vale o mesmo que 1 milibar (mb): a Organização Meteorológica Mundial recomendou, a partir de 1982, passar do milibar para o hectopascal.',
    { en: 'hectopascal (hPa)', sin: ['hPa', 'milibar', 'mb'], ver: ['pressao-atmosferica', 'barometro', 'isobara'], fonte: [mig3('cap. 45, nota sobre mb e hPa, PDF p. 571'), nws('Hectopascal')] });
  t('umidade-relativa', 'Umidade relativa', 'meteo', 'Relação, em porcentagem, entre a quantidade de vapor d’água que há no ar e o máximo que ele pode conter àquela temperatura. Com 100% o ar está saturado. Como o ar frio contém menos vapor, a umidade relativa sobe quando o ar esfria, mesmo sem entrar vapor novo.',
    { en: 'relative humidity', ver: ['ponto-de-orvalho', 'psicrometro', 'nevoeiro'], fonte: [mig3('cap. 45, PDF p. 582'), nws('Relative Humidity')] });
  t('ponto-de-orvalho', 'Ponto de orvalho', 'meteo', 'Temperatura em que o ar, esfriando sem ganhar nem perder vapor d’água, chega à saturação. Se esfriar mais, o vapor começa a condensar (orvalho, nevoeiro, nuvem). Quanto mais perto o ponto de orvalho estiver da temperatura do ar, maior a chance de nevoeiro.',
    { en: 'dew point', ver: ['umidade-relativa', 'psicrometro', 'nevoeiro'], fonte: [mig3('cap. 45, PDF p. 582'), nws('Dew Point')] });
  t('psicrometro', 'Psicrômetro', 'meteo', 'Instrumento que mede a umidade do ar com dois termômetros iguais: um de bulbo seco e outro de bulbo úmido, envolto em gaze molhada, que esfria ao evaporar. Quanto maior a diferença entre as duas leituras, mais seco o ar; uma tabela converte a diferença em umidade relativa.',
    { en: 'psychrometer', ver: ['umidade-relativa', 'ponto-de-orvalho', 'barometro'], fonte: [mig3('cap. 45, PDF p. 583'), nws('Psychrometer')] });
  t('barograma', 'Barograma', 'meteo', 'Registro contínuo da pressão feito pelo barógrafo, que desenha a curva num papel preso a um tambor de relógio. Mostra com clareza a tendência barométrica (subindo, descendo ou estável), que importa mais para prever o tempo do que um valor isolado.',
    { en: 'barogram (barograph record)', ver: ['barometro', 'pressao-atmosferica', 'frente-fria'], fonte: [mig3('cap. 45, PDF p. 572'), nws('Barograph')] });
  t('massa-de-ar', 'Massa de ar', 'meteo', 'Grande volume de ar com temperatura e umidade quase uniformes na horizontal, que adquire essas características onde se forma (mar quente, continente frio…). As frentes marcam o encontro de massas de ar diferentes.',
    { en: 'air mass', ver: ['frente-fria', 'frente-quente', 'frente-oclusa'], fonte: [mig3('cap. 45, PDF p. 448 e seguintes'), nws('Air Mass')] });
  t('frente-oclusa', 'Frente oclusa', 'meteo', 'Frente formada quando uma frente fria alcança uma frente quente e uma das duas deixa de tocar o solo, subindo sobre a outra. Em geral está ligada a circulações ciclônicas (baixas).',
    { en: 'occluded front', sin: ['oclusão'], ver: ['frente-fria', 'frente-quente', 'ciclone-extratropical'], fonte: [mig3('cap. 45, PDF p. 625'), nws('Occluded Front')] });
  t('frente-estacionaria', 'Frente estacionária', 'meteo', 'Frente que quase não se desloca de uma carta sinótica para a seguinte: nem o ar frio nem o quente avança sobre o outro. No fim do ciclo de uma depressão extratropical, as frentes frias e quentes que sobraram costumam virar uma só frente estacionária.',
    { en: 'stationary front', ver: ['frente-fria', 'frente-quente', 'frente-oclusa', 'carta-sinotica'], fonte: [mig3('cap. 45, PDF p. 619'), nws('Quasi-stationary Front')] });
  t('linha-de-instabilidade', 'Linha de instabilidade', 'meteo', 'Linha de trovoadas (cumulonimbos) que se forma adiante de uma frente fria em avanço; a Marinha a classifica como trovoada pré-frontal. Quem navega perto dela deve esperar trovoadas, chuva forte e rajadas.',
    { en: 'squall line (pre-frontal)', sin: ['linha de tempestades'], ver: ['cumulonimbo', 'frente-fria', 'rajada', 'borrasca'], fonte: [mig3('cap. 45, PDF p. 629'), nws('Pre-Frontal Squall Line')] });
  t('oestes-predominantes', 'Oestes predominantes', 'meteo', 'Cinturão de ventos de oeste nas latitudes temperadas de cada hemisfério, do lado polar das altas subtropicais. No Hemisfério Sul os ventos sopram de noroeste ou de oeste. Nele, as depressões extratropicais se deslocam de oeste para leste.',
    { en: 'prevailing westerlies', sin: ['ventos de oeste', 'cinturão de vento do oeste'], ver: ['alisios', 'asas', 'ciclone-extratropical', 'forca-de-coriolis'], fonte: [mig3('cap. 45, PDF p. 568'), nws('Prevailing Westerlies')] });
  t('corrente-oceanica', 'Corrente oceânica', 'meteo', 'Movimento contínuo de grandes massas de água do oceano, movido pelo vento, pelas marés e pelas diferenças de temperatura e de salinidade da água. As correntes maiores e mais duradouras têm nome próprio, como a Corrente do Brasil. Não confunda com a corrente de maré, que muda de sentido com a maré.',
    { en: 'ocean current', sin: ['corrente marítima'], ver: ['giro', 'corrente-de-mare', 'forca-de-coriolis', 'pilot-charts'], fonte: { txt: 'NOAA, National Ocean Service: What is a gyre?', url: URL.noaaGiro, loc: 'frase “Wind, tides, and differences in temperature and salinity drive ocean currents”' } });
  t('giro', 'Giro oceânico', 'meteo', 'Grande sistema de correntes que gira em volta de uma bacia oceânica. Há cinco giros subtropicais principais: Pacífico Norte e Sul, Atlântico Norte e Sul, e Índico. No Hemisfério Sul o giro circula no sentido anti-horário.',
    { en: 'ocean gyre', sin: ['giro oceânico'], ver: ['corrente-oceanica', 'forca-de-coriolis', 'asas', 'pilot-charts'], fonte: { txt: 'NOAA, National Ocean Service: What is a gyre?', url: URL.noaaGiro, loc: 'os cinco giros subtropicais; o sentido segue a circulação dos ventos (Coriolis)' } });
  t('ressurgencia', 'Ressurgência', 'meteo', 'Subida de água fria, profunda e rica em nutrientes até a superfície, em geral quando o vento afasta a água superficial da costa. A temperatura da superfície do mar cai; o ar sobre ela esfria e pode surgir nevoeiro.',
    { en: 'upwelling', sin: ['afloramento'], ver: ['nevoeiro', 'corrente-oceanica', 'brisa-maritima'], fonte: [mig3('cap. 45, PDF p. 580'), { txt: 'NOAA, National Ocean Service: What is upwelling?', url: URL.noaaRessurgencia }] });
  t('nebulosidade', 'Nebulosidade', 'meteo', 'Quantidade do céu coberta por nuvens. Aumenta quando uma frente se aproxima e diminui depois da passagem da frente fria, junto com a queda da temperatura e da umidade relativa.',
    { en: 'cloud cover', sin: ['cobertura de nuvens'], ver: ['frente-fria', 'umidade-relativa', 'cumulonimbo'], fonte: mig3('cap. 45, sequência de uma frente fria nos mares austrais, PDF p. 451') });
  t('estado-do-mar', 'Estado do mar', 'meteo', 'Aspecto e agitação da superfície do mar num dado momento. Resultam do vento local, do marulho vindo de longe, das marés e correntes (vento contra a corrente levanta ondas maiores) e da chuva, que atenua o mar. Classifica-se pela escala Douglas, de 0 a 9.',
    { en: 'sea state', ver: ['escala-douglas', 'beaufort', 'marulho', 'altura-significativa'], fonte: mig3('cap. 45, itens a) a f), PDF p. 652') });
  t('escala-douglas', 'Escala Douglas', 'meteo', 'Escala de 0 a 9 que classifica o estado do mar, não o vento (quem classifica o vento é a escala Beaufort). Os graus 6, 7 e 8 valem para mar aberto; em águas rasas o grau não passa de 5, ou, em casos extremos, de 6 ou 7. O grau 9 é o mar desfeito, excepcional.',
    { en: 'Douglas sea scale', sin: ['escala do mar'], ver: ['estado-do-mar', 'beaufort', 'altura-significativa'], fonte: mig3('cap. 45, PDF p. 652 e 653, figura 45.67') });
  t('carneirinho', 'Carneirinho', 'meteo', 'Espuma branca das cristas que arrebentam, sinal de vento que levanta mar. A tabela Beaufort da DHN descreve “alguns carneiros” na força 3, “frequentes” na força 4 e “muitos” na força 5.',
    { en: 'whitecap', sin: ['carneiro', 'carneiros', 'carneirinhos'], ver: ['beaufort', 'onda', 'vaga', 'marulho'], fonte: mig3('cap. 45, tabela Beaufort, PDF p. 590') });
  t('isogonica', 'Linha isogônica', 'carta', 'Linha, traçada numa carta, que une pontos de mesma declinação magnética. Serve para achar a declinação da região onde se navega (a carta náutica traz a declinação na rosa, com a variação anual).',
    { en: 'isogonic line', sin: ['isógona'], ver: ['declinacao-magnetica', 'rosa-dos-ventos', 'rumo-magnetico'], fonte: [mig1('cap. 3, item 3.2.3, p. 3-6 (carta de isogônicas NOAA/NCEI)'), { txt: 'NOAA/NCEI, World Magnetic Model', url: URL.wmm }] });
  t('janela-meteorologica', 'Janela meteorológica', 'meteo', 'Intervalo de tempo bom, segundo as previsões, em que dá para sair ou fazer um trecho da viagem com segurança. Esperar a janela no porto é decisão de marinharia: a norma só manda o comandante conhecer as previsões antes de sair e ficar atento aos sinais de mau tempo.',
    { en: 'weather window', ver: ['meteoromarinha', 'carta-sinotica', 'aviso-de-mau-tempo', 'grib'], fonte: n211('art. 4.6.3, p. 4-3 (previsões antes de sair)') });
  t('cavado', 'Cavado', 'meteo', 'Região alongada de pressão relativamente baixa, em geral sem circulação fechada (por isso não é o mesmo que uma baixa). Nas cartas sinóticas aparece como uma dobra em “V” ou “U” nas isóbaras; um cavado pré-frontal costuma trazer mudança na direção do vento. Em ondas, “cavado” também é o ponto mais baixo da onda (ver Onda).',
    { en: 'trough', sin: ['cavado barométrico', 'cavado de pressão'], ver: ['isobara', 'baixa-pressao', 'carta-sinotica', 'frente-fria', 'onda'], fonte: [nws('Trough'), nws('Pre-Frontal Trough'), mig3('uso de “cavado circumpolar” nos mares antárticos, PDF p. 445')] });

  /* ===================== RIPEAM ===================== */
  var W_LUZES = function (tipo, aspecto, rot) { return { w: 'ripeam-luzes', opts: { tipo: tipo, aspecto: aspecto == null ? 35 : aspecto }, rotulo: rot || 'Abrir o simulador de luzes' }; };
  var W_GOV = { w: 'regras-governo', opts: {}, rotulo: 'Abrir o simulador de regras de governo' };
  t('ripeam', 'RIPEAM', 'ripeam', 'Regulamento Internacional para Evitar Abalroamento no Mar, de 1972 (em inglês, COLREG). Define quem manobra em cada encontro, as luzes, as marcas e os sinais sonoros. Vale no alto-mar e nas águas ligadas a ele navegáveis por navios.',
    { en: 'COLREGs (International Regulations for Preventing Collisions at Sea)', sin: ['RIPEAM-72', 'COLREG'], ver: ['regra-dos-veleiros', 'luzes-de-navegacao', 'sinais-sonoros', 'hierarquia-de-manobra'], fonte: rip('Regra 1 a)') });
  t('abalroamento', 'Abalroamento', 'ripeam', 'Colisão entre embarcações.',
    { en: 'collision', ver: ['risco-de-abalroamento', 'ripeam'] });
  t('embarcacao-de-propulsao-mecanica', 'Embarcação de propulsão mecânica', 'ripeam', 'Para o RIPEAM, qualquer embarcação movida por máquinas. Um veleiro usando o motor conta como propulsão mecânica, mesmo com as velas içadas.',
    { en: 'power-driven vessel', ver: ['embarcacao-a-vela', 'luz-de-mastro', 'veleiro'], fonte: rip('Regra 3 b)') });
  t('embarcacao-a-vela', 'Embarcação a vela', 'ripeam', 'Para o RIPEAM, qualquer embarcação navegando a vela, desde que a máquina, se houver, não esteja sendo usada.',
    { en: 'sailing vessel', ver: ['embarcacao-de-propulsao-mecanica', 'regra-dos-veleiros', 'lanterna-tricolor'], fonte: rip('Regra 3 c)'), widget: W_LUZES('vela', 35, 'Ver as luzes de um veleiro') });
  t('em-movimento', 'Em movimento', 'ripeam', 'Para o RIPEAM, a embarcação que não está fundeada, nem amarrada à terra, nem encalhada. Um barco parado à deriva está em movimento, mesmo sem seguimento.',
    { en: 'underway', ver: ['seguimento', 'luz-de-fundeio'], fonte: rip('Regra 3 i)') });
  t('vigilancia', 'Vigilância', 'ripeam', 'Obrigação de manter o tempo todo vigilância visual e auditiva, e por todos os meios disponíveis (como radar e AIS), para avaliar a situação e o risco de abalroamento.',
    { en: 'look-out', ver: ['risco-de-abalroamento', 'radar', 'ais', 'piloto-automatico'], fonte: rip('Regra 5') });
  t('velocidade-de-seguranca', 'Velocidade de segurança', 'ripeam', 'Velocidade que permite agir a tempo para evitar um abalroamento e parar a uma distância adequada, levando em conta a visibilidade, o tráfego, o vento, o mar, as correntes e a manobrabilidade do barco.',
    { en: 'safe speed', ver: ['visibilidade-restrita', 'nevoeiro', 'vigilancia'], fonte: rip('Regra 6') });
  t('risco-de-abalroamento', 'Risco de abalroamento', 'ripeam', 'Existe quando a marcação de uma embarcação que se aproxima não muda de forma apreciável. Na dúvida, considere que o risco existe.',
    { en: 'risk of collision', ver: ['marcacao', 'embarcacao-obrigada-a-manobrar', 'vigilancia'], fonte: rip('Regra 7') });
  t('embarcacao-obrigada-a-manobrar', 'Embarcação obrigada a manobrar', 'ripeam', 'A que deve sair do caminho da outra. Deve manobrar cedo e de forma bem clara e, num cruzamento, evitar passar pela proa da outra.',
    { en: 'give-way vessel', ver: ['embarcacao-que-mantem-rumo', 'rumos-cruzados', 'regra-dos-veleiros'], fonte: rip('Regras 15 e 16'), widget: W_GOV });
  t('embarcacao-que-mantem-rumo', 'Embarcação que mantém rumo e velocidade', 'ripeam', 'A que tem preferência: deve manter o rumo e a velocidade, mas pode manobrar se a outra não agir e deve manobrar se só a sua manobra puder evitar o abalroamento.',
    { en: 'stand-on vessel', ver: ['embarcacao-obrigada-a-manobrar', 'risco-de-abalroamento'], fonte: rip('Regra 17'), widget: W_GOV });
  t('ultrapassagem', 'Ultrapassagem', 'ripeam', 'Situação em que uma embarcação se aproxima de outra vindo de mais de 22,5° por ante a ré do través dela; à noite, veria só a luz de alcançado. Quem ultrapassa sai do caminho, seja a vela ou a motor.',
    { en: 'overtaking', ver: ['luz-de-alcancado', 'embarcacao-obrigada-a-manobrar'], fonte: rip('Regra 13'), widget: W_GOV });
  t('roda-a-roda', 'Roda a roda', 'ripeam', 'Duas embarcações de propulsão mecânica em rumos opostos ou quase opostos, com risco de abalroamento: as duas guinam para boreste e passam bombordo com bombordo.',
    { en: 'head-on situation', ver: ['rumos-cruzados', 'sinais-sonoros'], fonte: rip('Regra 14'), widget: W_GOV });
  t('rumos-cruzados', 'Rumos cruzados', 'ripeam', 'Duas embarcações de propulsão mecânica que se cruzam com risco de abalroamento: manobra a que tem a outra por boreste, evitando passar pela proa dela.',
    { en: 'crossing situation', ver: ['roda-a-roda', 'embarcacao-obrigada-a-manobrar'], fonte: rip('Regra 15'), widget: W_GOV });
  t('regra-dos-veleiros', 'Veleiros que se aproximam', 'ripeam', 'Com o vento em bordos diferentes, manobra quem está amurado a bombordo. Com o vento no mesmo bordo, manobra quem está a barlavento. Se um veleiro amurado a bombordo vê outro a barlavento e não sabe o bordo dele, manobra.',
    { en: 'sailing vessels (Rule 12)', busca: ['Regra 12'], ver: ['amurado', 'barlavento', 'hierarquia-de-manobra'], fonte: rip('Regra 12'), widget: W_GOV });
  t('hierarquia-de-manobra', 'Responsabilidades entre embarcações', 'ripeam', 'Ordem de quem sai do caminho de quem (fora dos canais estreitos, dos esquemas de separação e da ultrapassagem): a propulsão mecânica manobra para a vela; e as duas manobram para quem pesca, para a com capacidade de manobra restrita e para a sem governo.',
    { en: 'responsibilities between vessels (Rule 18)', busca: ['Regra 18'], ver: ['regra-dos-veleiros', 'sem-governo', 'manobrabilidade-restrita', 'engajada-na-pesca'], fonte: rip('Regra 18'), widget: W_GOV });
  t('canal-estreito', 'Canal estreito', 'ripeam', 'Nos canais estreitos, navegue o mais perto possível do lado de boreste do canal. Embarcações com menos de 20 m e veleiros não devem atrapalhar a passagem de quem só pode navegar dentro do canal.',
    { en: 'narrow channel', ver: ['restrita-pelo-calado', 'esquema-de-separacao-de-trafego'], fonte: rip('Regra 9') });
  t('esquema-de-separacao-de-trafego', 'Esquema de separação de tráfego', 'ripeam', 'Área com faixas de tráfego de sentido único, como uma rodovia no mar, perto de portos e cabos movimentados. Se precisar cruzá-lo, faça com a proa o mais perto possível de 90° com as faixas.',
    { en: 'traffic separation scheme (TSS)', ver: ['canal-estreito'], fonte: rip('Regra 10') });
  t('sem-governo', 'Embarcação sem governo', 'ripeam', 'A que, por uma circunstância excepcional, como avaria no leme ou na máquina, não pode manobrar como o RIPEAM manda. À noite mostra duas luzes circulares vermelhas em linha vertical; de dia, duas bolas pretas.',
    { en: 'vessel not under command (NUC)', ver: ['hierarquia-de-manobra', 'marcas-diurnas'], fonte: rip('Regras 3 f) e 27 a)'), widget: W_LUZES('sg', 35, 'Ver as luzes de quem está sem governo') });
  t('manobrabilidade-restrita', 'Capacidade de manobra restrita', 'ripeam', 'Embarcação que, pela natureza do trabalho (dragagem, cabo submarino, mergulho, certos reboques), não pode sair do caminho. Mostra luzes circulares vermelha, branca e vermelha em linha vertical; de dia, bola, losango e bola.',
    { en: 'vessel restricted in her ability to manoeuvre (RAM)', ver: ['hierarquia-de-manobra', 'marcas-diurnas'], fonte: rip('Regras 3 g) e 27 b)'), widget: W_LUZES('mr', 35, 'Ver as luzes de manobra restrita') });
  t('restrita-pelo-calado', 'Restrita devido ao seu calado', 'ripeam', 'Navio de propulsão mecânica que, pelo calado e pela profundidade disponível, não consegue se desviar do caminho. Pode mostrar três luzes circulares vermelhas em linha vertical ou, de dia, um cilindro. Veleiros não devem atrapalhar a passagem dele.',
    { en: 'vessel constrained by her draught (CBD)', ver: ['calado', 'canal-estreito', 'marcas-diurnas'], fonte: rip('Regras 3 h), 18 d) e 28'), widget: W_LUZES('cal', 35, 'Ver as luzes de quem está restrito pelo calado') });
  t('engajada-na-pesca', 'Embarcação engajada na pesca', 'ripeam', 'A que pesca com redes, linhas ou arrasto que restringem a manobra (não vale para linha de corrico). Luzes: verde sobre branca no arrasto; vermelha sobre branca na outra pesca. De dia, dois cones unidos pelos vértices.',
    { en: 'vessel engaged in fishing', ver: ['hierarquia-de-manobra', 'marcas-diurnas'], fonte: rip('Regras 3 d) e 26'), widget: W_LUZES('arrasto', 35, 'Ver as luzes de pesca') });
  t('luzes-de-navegacao', 'Luzes de navegação', 'ripeam', 'Luzes que as embarcações exibem do pôr ao nascer do sol e com visibilidade restrita, para mostrar o tipo e o tamanho, o que estão fazendo e de que lado se está a vê-las.',
    { en: 'navigation lights', ver: ['luz-de-mastro', 'luzes-de-bordos', 'luz-de-alcancado', 'lanterna-tricolor', 'luz-de-fundeio'], fig: ['luzes', 'luzes-de-navegacao'], fonte: rip('Regras 20 a 31'), widget: W_LUZES('vela', 35) });
  t('luz-de-mastro', 'Luz de mastro', 'ripeam', 'Luz branca na linha de centro, visível num setor de 225°, da proa até 22,5° por ante a ré do través de cada bordo. Indica embarcação de propulsão mecânica em movimento: um veleiro com o motor ligado deve acendê-la.',
    { sin: ['luz de tope'], en: 'masthead light', ver: ['luzes-de-bordos', 'embarcacao-de-propulsao-mecanica'], fig: ['luzes', 'luz-de-mastro'], fonte: [rip('Regras 21 a) e 23'), { txt: 'Capitania dos Portos do Ceará, NPCP-CE, Anexo 3-A (Marinha)', url: URL.npcpce, loc: 'item 11, b): a lista “Luzes de Navegação (BE/BB/Tope/Alcançado)” usa “Tope” ao lado das luzes de bordo e de alcançado, que são as luzes de mastro, de bordos e de popa da Regra 21' }], widget: W_LUZES('pm', 0, 'Ver as luzes de quem navega a motor') });
  t('luzes-de-bordos', 'Luzes de bordos', 'ripeam', 'Luz verde a boreste e vermelha a bombordo, cada uma visível num setor de 112,5°, da proa até 22,5° por ante a ré do través. Mostram de que lado se está vendo a embarcação.',
    { en: 'sidelights', sin: ['luzes de bordo', 'luzes laterais'], ver: ['bombordo', 'boreste', 'luz-de-alcancado'], fig: ['luzes', 'luzes-de-bordos'], fonte: rip('Regra 21 b)'), widget: W_LUZES('vela', 60) });
  t('luz-de-alcancado', 'Luz de alcançado', 'ripeam', 'Luz branca na popa, visível num setor de 135°, 67,5° para cada lado da popa. Quem a vê está atrás da embarcação, em posição de ultrapassar.',
    { en: 'sternlight', ver: ['ultrapassagem', 'luzes-de-bordos'], fig: ['luzes', 'luz-de-alcancado'], fonte: rip('Regra 21 c)'), widget: W_LUZES('vela', 180) });
  t('lanterna-tricolor', 'Lanterna tricolor', 'ripeam', 'Lanterna única no alto do mastro que junta as luzes de bordos e de alcançado. É permitida para veleiros com menos de 20 m navegando só a vela; com o motor ligado, não vale.',
    { en: 'tricolour lantern', ver: ['luzes-de-bordos', 'luz-de-alcancado', 'embarcacao-a-vela'], fonte: rip('Regra 25 b)'), widget: { w: 'ripeam-luzes', opts: { tipo: 'vela', aspecto: 35, opcoes: { tricolor: true } }, rotulo: 'Ver a lanterna tricolor' } });
  t('luz-de-fundeio', 'Luz de fundeio', 'ripeam', 'Luz branca circular que a embarcação fundeada exibe onde possa ser mais bem vista (duas, se tiver 50 m ou mais). De dia, mostra uma bola preta a vante.',
    { en: 'anchor light', ver: ['fundear', 'marcas-diurnas', 'em-movimento'], fonte: rip('Regra 30'), widget: W_LUZES('fundeada', 35, 'Ver as luzes de uma embarcação fundeada') });
  t('marcas-diurnas', 'Marcas diurnas', 'ripeam', 'Formas pretas (bolas, cones, cilindros e losangos) içadas de dia para indicar o que a embarcação está fazendo, como a bola de quem está fundeado ou o cone com o vértice para baixo de quem navega a vela e a motor.',
    { en: 'day shapes', ver: ['luz-de-fundeio', 'sem-governo', 'engajada-na-pesca'], fig: ['marcasDiurnas', 'nada'], fonte: rip('Regras 24 a 30'), widget: { w: 'ripeam-luzes', opts: { tipo: 'velamotor', dia: true }, rotulo: 'Ver as marcas diurnas' } });
  t('sinais-sonoros', 'Sinais sonoros de manobra', 'ripeam', 'Sinais de apito do RIPEAM. Apito curto dura cerca de 1 segundo; longo, de 4 a 6 segundos. Um curto: guinando para boreste; dois curtos: guinando para bombordo; três curtos: máquinas a ré; cinco ou mais curtos e rápidos: dúvida ou alerta.',
    { en: 'manoeuvring and warning signals', busca: ['apito'], ver: ['visibilidade-restrita', 'roda-a-roda'], fonte: rip('Regras 32 e 34'), widget: { w: 'sinais-sonoros', opts: {}, rotulo: 'Ouvir os sinais sonoros' } });
  t('visibilidade-restrita', 'Sinais em visibilidade restrita', 'ripeam', 'Com nevoeiro, chuva forte ou fumaça, além da velocidade de segurança, toca-se o apito a intervalos de até 2 minutos: um longo (motor com seguimento); dois longos (motor parado na água); um longo e dois curtos (veleiro, pesca, sem governo, manobra restrita e outros).',
    { en: 'sound signals in restricted visibility', ver: ['nevoeiro', 'velocidade-de-seguranca', 'sinais-sonoros', 'radar'], fonte: rip('Regras 19 e 35'), widget: { w: 'sinais-sonoros', opts: {}, rotulo: 'Ouvir os sinais sonoros' } });
  t('sinais-de-perigo', 'Sinais de perigo', 'ripeam', 'Sinais que indicam que uma embarcação está em perigo e precisa de socorro, como MAYDAY no rádio, alerta DSC, EPIRB, foguete ou facho vermelho, fumaça laranja e o movimento lento de subir e descer os braços abertos.',
    { en: 'distress signals', ver: ['mayday', 'pirotecnicos', 'epirb', 'dsc'], fonte: rip('Regra 37 e Anexo IV') });

  /* ===================== Segurança e sobrevivência ===================== */
  t('colete-salva-vidas', 'Colete salva-vidas', 'seguranca', 'Colete que mantém a pessoa flutuando com o rosto fora da água. A NORMAM-211 exige um para cada pessoa a bordo, com tamanhos para crianças: classe I na navegação oceânica, classe II na costeira e classe III ou V na interior (para embarcações de médio porte). Vista o seu à noite, com mar e sempre que estiver sozinho no convés.',
    { en: 'lifejacket', sin: ['colete'], ver: ['arnes', 'boia-circular', 'ais-mob', 'salvatagem'], fonte: n211('art. 4.14, p. 4-7') });
  t('boia-circular', 'Boia salva-vidas', 'seguranca', 'Boia em forma de anel ou de ferradura, para jogar a quem cai na água. A NORMAM-211 pede uma em embarcações de médio porte com menos de 12 m e duas a partir de 12 m, soltas em suportes. Fora da navegação interior, cada boia leva luz automática, e pelo menos uma tem retinida flutuante.',
    { en: 'lifebuoy', sin: ['boia circular', 'boia ferradura'], ver: ['homem-ao-mar', 'retinida', 'colete-salva-vidas'], fonte: n211('art. 4.15, p. 4-7 e 4-8') });
  t('balsa-salva-vidas', 'Balsa salva-vidas', 'seguranca', 'Embarcação de sobrevivência inflável, guardada num casulo ou bolsa, que infla ao ser lançada e puxada pelo cabo. A NORMAM-211 a exige na navegação oceânica, para todas as pessoas a bordo. A revisão é anual na balsa SOLAS e, nas outras, no prazo do fabricante, sempre em estação credenciada.',
    { en: 'liferaft', ver: ['abandono', 'palamenta', 'bolsa-de-abandono', 'sart'], fonte: n211('art. 4.13, p. 4-6 e 4-7') });
  t('palamenta', 'Palamenta', 'seguranca', 'Conjunto de equipamentos e mantimentos que acompanham uma embarcação de sobrevivência, como água, sinais pirotécnicos, faca, bomba de ar e material de reparo.',
    { en: 'liferaft equipment pack', ver: ['balsa-salva-vidas', 'bolsa-de-abandono'] });
  t('salvatagem', 'Salvatagem', 'seguranca', 'Conjunto dos equipamentos de salvamento e sobrevivência de uma embarcação: coletes, boias, balsas e sinais pirotécnicos.',
    { en: 'life-saving appliances', ver: ['colete-salva-vidas', 'boia-circular', 'balsa-salva-vidas', 'pirotecnicos'] });
  t('epirb', 'EPIRB', 'seguranca', 'Radiobaliza de emergência que, ativada sozinha (ao se soltar quando o barco afunda) ou à mão, transmite em 406 MHz para os satélites do COSPAS-SARSAT a identificação codificada (MMSI) e, nos modelos com GNSS, a posição. No Brasil, deve ser cadastrada no INFOSAR.',
    { en: 'EPIRB (Emergency Position-Indicating Radio Beacon)', sin: ['radiobaliza'], ver: ['plb', 'cospas-sarsat', 'infosar', 'mmsi', 'sinais-de-perigo'], fonte: n211('art. 4.23.6, p. 4-12 e 4-13') });
  t('plb', 'PLB', 'seguranca', 'Radiobaliza pessoal, pequena, para levar no colete. Funciona como a EPIRB (406 MHz, COSPAS-SARSAT), mas é ativada à mão e transmite por menos tempo.',
    { en: 'PLB (Personal Locator Beacon)', ver: ['epirb', 'ais-mob', 'cospas-sarsat'] });
  t('sart', 'SART', 'seguranca', 'Transponder de busca e salvamento levado para a balsa. O de radar responde ao radar dos navios e aparece na tela como uma linha de 12 pontos; o AIS-SART transmite a posição pelo AIS.',
    { en: 'SART (Search and Rescue Transponder)', ver: ['radar', 'ais', 'balsa-salva-vidas'] });
  t('ais-mob', 'AIS-MOB', 'seguranca', 'Pequeno transmissor AIS pessoal, preso ao colete, que dispara quando o colete infla e mostra a posição de quem caiu no AIS e no plotter do próprio barco e dos navios próximos. Alguns modelos também enviam alerta DSC.',
    { en: 'AIS MOB device', ver: ['homem-ao-mar', 'ais', 'plb', 'colete-salva-vidas'] });
  t('pirotecnicos', 'Pirotécnicos', 'seguranca', 'Sinais de socorro visuais: o foguete com paraquedas (estrela vermelha, sobe a cerca de 300 m), o facho manual (luz vermelha, para mostrar a posição de perto) e o sinal fumígeno laranja (de dia). Pela NORMAM-211: dois de cada na navegação costeira e quatro de cada na oceânica. Têm prazo de validade.',
    { en: 'pyrotechnics (flares, smoke signals)', sin: ['sinalizadores'], busca: ['foguete', 'facho', 'fumígeno'], ver: ['sinais-de-perigo', 'salvatagem', 'bolsa-de-abandono'], fonte: n211('arts. 4.16 e 4.17, p. 4-8 e 4-9') });
  t('refletor-radar', 'Refletor radar', 'seguranca', 'Peça metálica com faces que devolvem o sinal, içada no mastro para que o barco apareça melhor no radar dos navios. A NORMAM-211 exige refletor radar nas embarcações em navegação costeira ou oceânica.',
    { en: 'radar reflector', ver: ['radar', 'ais'], fonte: n211('art. 4.18.3, p. 4-9') });
  t('linha-de-vida', 'Linha de vida', 'seguranca', 'Cabo ou fita bem esticada no convés, independente em cada bordo, onde se prende o cabo de segurança do arnês para andar no convés sem se soltar.',
    { en: 'jackline, jackstay', sin: ['jackline'], ver: ['arnes', 'guarda-mancebo', 'homem-ao-mar'] });
  t('arnes', 'Arnês', 'seguranca', 'Cinto que veste o tronco, muitas vezes embutido no colete inflável, com um cabo curto e mosquetões para prender a pessoa à linha de vida ou a pontos fortes do barco. À noite e com mar, prenda-se antes de sair da cabine.',
    { en: 'harness and tether', busca: ['cabo de segurança', 'tirante'], ver: ['linha-de-vida', 'colete-salva-vidas', 'mosquetao'] });
  t('homem-ao-mar', 'Homem ao mar', 'seguranca', 'Situação em que alguém cai na água. Grite “homem ao mar”, aponte e não tire os olhos da pessoa, jogue a boia, marque a posição no GNSS (botão MOB) e faça a manobra de recolhimento. Num veleiro de cruzeiro com pouca gente (a referência do curso é um barco de ~32 pés), o curso recomenda a parada rápida (quick-stop) primeiro, o oito quando há tripulação e boa visibilidade, chegada lenta e a pessoa a sotavento do barco (como o RYA ensina); a barlavento (US Sailing, RORC) convém com muito arrasto do vento ou em mar duro, e a manobra se treina com seu instrutor e sua tripulação. A melhor proteção é não cair: use arnês e linha de vida.',
    { en: 'man overboard (MOB)', sin: ['MOB', 'pessoa ao mar'], ver: ['boia-circular', 'ais-mob', 'arnes', 'hipotermia', 'choque-termico'], widget: { w: 'manobras', opts: { manobra: 'mob' }, rotulo: 'Abrir o simulador de manobras' } });
  t('hipotermia', 'Hipotermia', 'seguranca', 'Queda perigosa da temperatura do corpo, pelo frio, pela água ou pelo vento. Começa com tremores e confusão. Na água fria, o corpo perde calor muito mais rápido que no ar: se puder, tire a pessoa da água na horizontal e aqueça-a aos poucos.',
    { en: 'hypothermia', ver: ['choque-termico', 'homem-ao-mar'] });
  t('choque-termico', 'Choque térmico', 'seguranca', 'Reação do corpo no primeiro minuto em água fria: um suspiro involuntário e respiração acelerada, que podem fazer engolir água. Regra prática 1-10-1: 1 minuto para controlar a respiração, cerca de 10 minutos de movimentos úteis e cerca de 1 hora até perder a consciência pela hipotermia.',
    { en: 'cold water shock (1-10-1)', ver: ['hipotermia', 'colete-salva-vidas'] });
  t('enjoo', 'Enjoo', 'seguranca', 'Mal-estar causado pelo movimento do barco, com náusea e sono. Ajuda olhar o horizonte, ficar no convés ao ar livre, comer pouco e leve e tomar o remédio antes de sair. Tripulante enjoado perde atenção e força: trate como risco de segurança.',
    { en: 'seasickness', sin: ['cinetose', 'mareio'], ver: ['arnes'] });
  t('classes-de-incendio', 'Classes de incêndio', 'seguranca', 'Classificação do fogo pelo material que queima, para escolher como apagar. Na NORMAM-211: classe A, sólidos que deixam resíduos (madeira, papel, almofadas, fibra de vidro, borracha e plásticos), a única em que a água pode ser usada com segurança; classe B, líquidos, gases e graxas inflamáveis; classe C, equipamentos e instalações elétricas energizados. Outras normas de incêndio também usam as classes D (metais) e K (óleo e gordura de cozinha).',
    { en: 'fire classes', ver: ['extintor', 'triangulo-do-fogo'], fonte: n211('art. 4.27.2, p. 4-14 e 4-15') });
  t('extintor', 'Extintor', 'seguranca', 'Aparelho portátil para combater princípios de incêndio. O rótulo indica a capacidade e as classes de fogo, como 2-A:20-B:C. A bordo, são comuns os de pó químico (BC ou ABC) e os de CO₂. Mire na base das chamas.',
    { en: 'fire extinguisher', ver: ['classes-de-incendio', 'triangulo-do-fogo'], fonte: n211('art. 4.27.3, p. 4-15') });
  t('triangulo-do-fogo', 'Triângulo do fogo', 'seguranca', 'Para haver fogo, é preciso combustível, comburente (o oxigênio do ar) e calor; com a reação em cadeia, forma-se o tetraedro do fogo. Apagar é tirar um desses elementos: resfriar, abafar ou isolar o combustível.',
    { en: 'fire triangle (fire tetrahedron)', busca: ['tetraedro do fogo'], ver: ['classes-de-incendio', 'extintor'], fig: ['fogo', 'nada'] });
  t('abandono', 'Abandono da embarcação', 'seguranca', 'Deixar o barco quando ele não pode mais ser salvo ou ficar a bordo ficou mais perigoso, em geral para a balsa salva-vidas. Antes, se houver tempo: pedido de socorro (MAYDAY, DSC), coletes, EPIRB e a bolsa de abandono. O ditado «só desça do barco para subir na balsa» é só uma regra de bolso: esperar até o naufrágio estar iminente pode ser tarde demais.',
    { en: 'abandon ship', ver: ['balsa-salva-vidas', 'bolsa-de-abandono', 'mayday', 'epirb'] });
  t('bolsa-de-abandono', 'Bolsa de abandono', 'seguranca', 'Bolsa estanque e flutuante, pronta perto da saída, com o que falta na balsa: VHF portátil, PLB, GNSS portátil, água, remédios, óculos, documentos e sinais extras.',
    { en: 'grab bag', ver: ['abandono', 'balsa-salva-vidas', 'palamenta', 'plb'] });
  t('ancora-flutuante', 'Âncora flutuante', 'seguranca', 'Cone ou paraquedas de lona lançado na água e preso ao barco por um cabo, para segurar a proa ao mar (âncora de mar) ou frear o barco pela popa (drogue) em mau tempo forte.',
    { en: 'sea anchor; drogue', sin: ['âncora de mar'], busca: ['drogue'], ver: ['capear', 'tormentim'] });
  t('osr', 'Regulamentos especiais para regatas oceânicas', 'seguranca', 'Normas de segurança da World Sailing para regatas de alto-mar (Offshore Special Regulations), divididas em categorias; as categorias 0 e 1 são as mais exigentes. Mesmo fora de regata, são um bom checklist para preparar um barco de cruzeiro oceânico.',
    { en: 'Offshore Special Regulations (OSR)', sin: ['OSR'], busca: ['World Sailing'], ver: ['salvatagem', 'balsa-salva-vidas', 'linha-de-vida'], intl: true, link: { txt: 'World Sailing: Offshore Special Regulations', url: URL.osr } });

  /* ===================== Rádio e comunicações ===================== */
  var W_VHF = { w: 'vhf-sim', opts: {}, rotulo: 'Abrir o simulador de VHF' };
  t('vhf', 'VHF', 'radio', 'Faixa de rádio usada nas comunicações marítimas de curto alcance (de 156 a 174 MHz). O alcance é o da linha de visada: de cerca de 5 milhas entre barcos pequenos a dezenas de milhas entre antenas altas ou com uma estação costeira em ponto alto.',
    { en: 'VHF (very high frequency) marine radio', ver: ['canal-16', 'canal-70', 'dsc', 'licenca-de-estacao'], widget: W_VHF });
  t('canal-16', 'Canal 16', 'radio', 'Canal de VHF (156,8 MHz) de socorro, urgência, segurança e chamada. Navegando, o VHF deve ficar ligado em escuta no canal 16, ou no 70 se o rádio tiver DSC. Depois do primeiro contato, passa-se para um canal de trabalho.',
    { en: 'channel 16', ver: ['canal-70', 'mayday', 'vhf'], fonte: n211('art. 4.23.4 a), p. 4-12'), widget: W_VHF });
  t('canal-70', 'Canal 70', 'radio', 'Canal de VHF (156,525 MHz) reservado à chamada seletiva digital (DSC). Não se fala nele: o rádio envia mensagens digitais, como o alerta de socorro com a posição.',
    { en: 'channel 70 (DSC)', ver: ['dsc', 'canal-16', 'mmsi'], fonte: n211('art. 4.23.4 a), p. 4-12') });
  t('dsc', 'DSC', 'radio', 'Chamada seletiva digital: função do rádio (VHF e MF/HF) que envia alertas e chamadas em formato digital, com o MMSI e a posição do GNSS. Um botão protegido, o Distress, envia o alerta de socorro.',
    { en: 'DSC (Digital Selective Calling)', sin: ['chamada seletiva digital'], ver: ['canal-70', 'mmsi', 'gmdss', 'sinais-de-perigo'], widget: W_VHF });
  t('mmsi', 'MMSI', 'radio', 'Número de 9 algarismos que identifica a estação de rádio do barco, programado no VHF com DSC, no AIS e na EPIRB. Os do Brasil começam por 710.',
    { en: 'MMSI (Maritime Mobile Service Identity)', ver: ['dsc', 'ais', 'epirb', 'licenca-de-estacao'], fonte: n211('art. 4.23.6 d), p. 4-13') });
  t('mayday', 'MAYDAY', 'radio', 'Palavra de socorro no rádio, dita três vezes, para perigo grave e iminente que exige ajuda imediata, como barco afundando, incêndio ou risco de vida. Tem prioridade sobre todas as outras comunicações; quem coordena o socorro pode impor silêncio no canal (SEELONCE MAYDAY).',
    { en: 'MAYDAY (distress)', ver: ['pan-pan', 'securite', 'canal-16', 'sinais-de-perigo'], widget: W_VHF });
  t('pan-pan', 'PAN-PAN', 'radio', 'Palavra de urgência, dita três vezes, para uma situação séria sem perigo imediato, como avaria no leme ou na máquina perto de perigos ou um tripulante doente.',
    { en: 'PAN-PAN (urgency)', ver: ['mayday', 'securite'], widget: W_VHF });
  t('securite', 'SÉCURITÉ', 'radio', 'Palavra de segurança, dita três vezes, antes de avisos à navegação e de meteorologia.',
    { en: 'SÉCURITÉ (safety)', ver: ['mayday', 'pan-pan', 'navtex'], widget: W_VHF });
  t('gmdss', 'GMDSS', 'radio', 'Sistema Marítimo Global de Socorro e Segurança: conjunto de equipamentos e procedimentos (DSC, satélites, EPIRB, SART, NAVTEX) que garante que um alerta de socorro chegue a terra e a outros navios de qualquer ponto do mar.',
    { en: 'GMDSS (Global Maritime Distress and Safety System)', ver: ['dsc', 'epirb', 'sart', 'navtex'] });
  t('renec', 'RENEC', 'radio', 'Rede Nacional de Estações Costeiras: as estações de rádio em terra, ao longo do litoral brasileiro, que atendem as embarcações. É assunto da prova de Mestre-Amador.',
    { en: 'Brazilian national coast station network', ver: ['estacao-costeira', 'vhf', 'mestre-amador'], fonte: n211('Anexo 5-A, item 2.1 m), p. 5-A-6'), aconfirmar: 'Quais estações estão ativas, quem as opera e em que canais: confirme na Capitania ou no CHM.' });
  t('estacao-costeira', 'Estação costeira', 'radio', 'Estação de rádio em terra do serviço móvel marítimo, que escuta os canais de socorro, transmite avisos e meteorologia e faz a ligação com o serviço de busca e salvamento.',
    { en: 'coast station', ver: ['renec', 'salvamar', 'vhf'] });
  t('hf-ssb', 'HF (SSB)', 'radio', 'Rádio de ondas curtas, de longo alcance (de centenas a milhares de milhas), usado em travessias oceânicas para socorro, meteorologia e contato com terra. A NORMAM-211 indica 4.125 kHz para chamada e escuta no Atlântico Sul.',
    { en: 'HF SSB radio', sin: ['SSB', 'rádio de ondas curtas'], ver: ['vhf', 'gmdss', 'licenca-de-estacao'], fonte: n211('art. 4.23.4 b), p. 4-12') });
  t('navtex', 'NAVTEX', 'radio', 'Sistema que transmite automaticamente, em 518 kHz, avisos aos navegantes, de meteorologia e de busca e salvamento, mostrados num receptor próprio. O alcance é de algumas centenas de milhas da estação.',
    { en: 'NAVTEX', ver: ['gmdss', 'meteoromarinha', 'avisos-aos-navegantes'] });
  t('alfabeto-fonetico', 'Alfabeto fonético', 'radio', 'Palavras-código internacionais para soletrar letras pelo rádio sem confusão: Alfa, Bravo, Charlie, Delta e assim por diante, até Zulu.',
    { en: 'phonetic alphabet', ver: ['vhf', 'indicativo-de-chamada'], widget: { w: 'alfabeto-fonetico', opts: {}, rotulo: 'Treinar o alfabeto fonético' } });
  t('indicativo-de-chamada', 'Indicativo de chamada', 'radio', 'Conjunto de letras e algarismos que identifica oficialmente a estação de rádio do barco, dado na licença da estação.',
    { en: 'call sign', ver: ['licenca-de-estacao', 'mmsi', 'alfabeto-fonetico'] });
  t('licenca-de-estacao', 'Licença de estação', 'radio', 'Licença da Anatel para a estação de rádio do barco (VHF, HF, AIS, EPIRB). A NORMAM-211 exige a Licença de Estação de Navio das embarcações que têm equipamentos de radiocomunicação.',
    { en: 'ship station licence', ver: ['mmsi', 'indicativo-de-chamada', 'vhf'], fonte: n211('art. 4.23.8, p. 4-13') });
  t('salvamar', 'SALVAMAR', 'radio', 'Centros de coordenação do Serviço de Busca e Salvamento da Marinha do Brasil (o SALVAMAR BRASIL, no Rio de Janeiro, supervisiona os regionais), que coordenam o resgate de pessoas no mar e nas águas interiores.',
    { en: 'Brazilian maritime search and rescue (MRCC)', sin: ['Salvamar Brasil'], busca: ['busca e salvamento'], ver: ['epirb', 'mayday', 'estacao-costeira'], link: { txt: 'Salvamar Brasil (Marinha)', url: URL.salvamar } });
  t('cospas-sarsat', 'COSPAS-SARSAT', 'radio', 'Sistema internacional de satélites que capta os sinais das radiobalizas de 406 MHz (EPIRB, PLB e as de aeronaves) e os encaminha aos centros de busca e salvamento.',
    { en: 'COSPAS-SARSAT', ver: ['epirb', 'plb', 'infosar'], link: { txt: 'Programa COSPAS-SARSAT', url: URL.cospas } });
  t('infosar', 'INFOSAR', 'radio', 'Serviço do DECEA, da Aeronáutica, para cadastrar radiobalizas de 406 MHz. Toda EPIRB deve ser cadastrada nele, e os dados devem ser atualizados ao vender o barco ou mudar de endereço ou telefone.',
    { en: 'Brazilian 406 MHz beacon registry', ver: ['epirb', 'plb', 'cospas-sarsat'], fonte: n211('art. 4.23.6 e) e f), p. 4-13'), link: { txt: 'INFOSAR (DECEA)', url: URL.infosar } });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('quarto-de-servico', 'Quarto de serviço', 'seguranca', 'Período em que uma parte da tripulação fica de serviço, cuidando da navegação, do leme e da vigia, enquanto os outros descansam. Numa travessia o barco navega as 24 horas, por isso a tripulação se reveza em quartos.',
    { en: 'watch', sin: ['quarto'], ver: ['quarto-de-cao', 'vigilancia', 'fadiga', 'ordens-do-comandante'] });
  t('quarto-de-cao', 'Quarto de cão', 'seguranca', 'Cada um dos dois quartos curtos, de 2 horas, em que se divide o quarto das 16 às 20 h. Com eles, a escala gira e ninguém fica sempre com o mesmo horário, principalmente o da madrugada.',
    { en: 'dog watch', sin: ['quartos de cão'], ver: ['quarto-de-servico', 'fadiga'] });
  t('ordens-do-comandante', 'Ordens do comandante', 'seguranca', 'Instruções que o comandante deixa para quem assume o quarto: as permanentes (standing orders), escritas e sempre válidas, e as especiais, para a situação do momento ou para a noite (night orders). Entre elas costumam estar os casos em que o comandante deve ser chamado na hora.',
    { en: 'master’s standing and night orders', sin: ['ordens permanentes', 'ordens da noite'], ver: ['quarto-de-servico', 'comandante', 'briefing', 'comunicacao-em-ciclo-fechado'], fonte: [{ txt: 'The Swedish Club, Bridge Instructions', url: URL.swedishClub, loc: 'itens 1.7 (ordens permanentes escritas e instruções especiais) e 2.11 (chamar o comandante segundo as ordens permanentes)' }, { txt: 'MCA (Reino Unido), Management of Bridge Operations', url: URL.mcaPonte, loc: 'tópico 1.2, “Masters standing and night orders”' }] });
  t('briefing', 'Briefing', 'seguranca', 'Reunião curta, antes de largar ou antes de uma manobra, em que o comandante combina com a tripulação o que vai ser feito: quem faz o quê, quais as palavras de comando, onde ficam os coletes e o que fazer num homem ao mar.',
    { en: 'briefing', sin: ['reunião de segurança'], ver: ['comunicacao-em-ciclo-fechado', 'gestao-de-recursos-da-equipe', 'homem-ao-mar'] });
  t('comunicacao-em-ciclo-fechado', 'Comunicação em ciclo fechado', 'seguranca', 'Forma de dar ordens em que quem recebe repete a ordem e quem mandou confirma que a repetição está certa, “fechando o ciclo”. Exemplo: “Guinar a boreste, rumo 355.” “Guinando a boreste, rumo 355.” “Correto.”',
    { en: 'closed-loop communication', sin: ['ciclo fechado', 'repetir a ordem'], ver: ['briefing', 'gestao-de-recursos-da-equipe', 'ordens-do-comandante'], fonte: { txt: 'The Swedish Club, Bridge Instructions', url: URL.swedishClub, loc: 'item 5.11 (exemplo de ordem, repetição e confirmação)' } });
  t('consciencia-situacional', 'Consciência situacional', 'seguranca', 'Saber o que acontece ao redor (perceber), entender o que isso significa (compreender) e prever o que vem a seguir (projetar). É o tripé da definição clássica de situation awareness, usada na aviação e na navegação.',
    { en: 'situational awareness', sin: ['consciência da situação'], ver: ['vigilancia', 'gestao-de-recursos-da-equipe', 'fadiga'], fonte: { txt: 'Endsley, M. R. (1995). Toward a theory of situation awareness in dynamic systems. Human Factors, 37(1), 32–64', url: 'https://doi.org/10.1518/001872095779049543' } });
  t('gestao-de-recursos-da-equipe', 'Gestão de recursos da equipe', 'seguranca', 'Uso organizado de tudo o que o barco tem, entre pessoas, equipamentos e informações, para navegar com segurança: dividir tarefas, comunicar com clareza, conferir uns aos outros e decidir em conjunto. A bordo de navios chama-se Bridge Resource Management (BRM), e vem do CRM da aviação.',
    { en: 'bridge resource management (BRM)', sin: ['BRM', 'CRM'], ver: ['comunicacao-em-ciclo-fechado', 'consciencia-situacional', 'briefing', 'fadiga'], fonte: { txt: 'MCA (Reino Unido), Management of Bridge Operations', url: URL.mcaPonte, loc: 'fala de “Bridge Resource Management skills” e de consciência situacional e fadiga entre os temas do curso' }, aconfirmar: 'O termo e a origem na aviação são de uso corrente; esta definição resume a prática e não uma norma brasileira.' });
  t('fadiga', 'Fadiga', 'seguranca', 'Estado de prejuízo físico ou mental causado por falta de sono, muito tempo acordado, horários que contrariam o relógio do corpo (ritmo circadiano) e esforço físico, mental ou emocional. Reduz a atenção e a capacidade de operar o barco com segurança.',
    { en: 'fatigue', ver: ['quarto-de-servico', 'quarto-de-cao', 'vigilancia', 'gestao-de-recursos-da-equipe'], fonte: { txt: 'IMO, MSC.1/Circ.1598 (Guidelines on fatigue mitigation and management, 2019)', url: URL.fadiga, loc: 'Anexo, introdução, item 1 (definição de fadiga)' } });
  t('desidratacao', 'Desidratação', 'seguranca', 'Falta de líquidos no corpo, quando se perde mais do que se repõe. No mar, as causas mais comuns são suor em excesso, vômito (enjoo), diarreia e pouca água bebida.',
    { en: 'dehydration', ver: ['hipertermia', 'enjoo', 'insolacao'], fonte: { txt: 'MedlinePlus (NIH, EUA): Dehydration', url: URL.medline, loc: 'seção “What causes dehydration?”' } });
  t('hipertermia', 'Hipertermia', 'seguranca', 'Temperatura do corpo acima do normal por excesso de calor, quando o corpo não consegue mais se resfriar. A exaustão pelo calor (dor de cabeça, náusea, tontura, fraqueza, suor intenso) pode evoluir para o golpe de calor, uma emergência.',
    { en: 'hyperthermia', ver: ['hipotermia', 'insolacao', 'desidratacao'], fonte: [nws('Heat Exhaustion'), nws('Heat Stroke')] });
  t('insolacao', 'Insolação', 'seguranca', 'Golpe de calor causado por exposição ao sol e ao calor: o corpo perde o controle da temperatura, a temperatura sobe depressa e o suor falha. É emergência médica, pois pode deixar sequela permanente ou matar se a pessoa não for tratada na hora.',
    { en: 'heat stroke (sunstroke)', sin: ['golpe de calor'], ver: ['hipertermia', 'desidratacao'], fonte: nws('Heat Stroke') });
  t('pe-de-imersao', 'Pé de imersão', 'seguranca', 'Lesão dos pés por tempo longo no frio e na umidade; pode ocorrer até com temperatura de cerca de 15 °C se os pés ficam sempre molhados. Dá vermelhidão, dormência ou dor de formigamento, câimbras, inchaço e bolhas; nos casos graves, gangrena. Primeiros socorros: tirar botas e meias molhadas, secar os pés e evitar andar sobre eles.',
    { en: 'immersion foot (trench foot)', ver: ['hipotermia', 'choque-termico'], fonte: { txt: 'CDC/NIOSH, Cold stress: related illnesses', url: URL.niosh, loc: 'seção “Trench foot”' } });
  t('liberador-hidrostatico', 'Liberador hidrostático', 'seguranca', 'Dispositivo que solta a balsa salva-vidas (ou a EPIRB) do suporte, sozinho, quando a embarcação afunda e a pressão da água chega a uma profundidade de poucos metros. A balsa sobe presa por um cabo ao barco e se infla.',
    { en: 'hydrostatic release unit (HRU)', sin: ['HRU'], ver: ['balsa-salva-vidas', 'epirb', 'abandono'], fonte: { txt: 'IMO, SOLAS e Código LSA (balsas salva-vidas)', url: URL.solas }, aconfirmar: 'A profundidade de liberação e a validade do dispositivo variam por modelo: confira o manual do fabricante e a vistoria.' });
  t('espelho-de-sinalizacao', 'Espelho de sinalização', 'seguranca', 'Espelho pequeno que reflete a luz do Sol para chamar a atenção de aeronaves e embarcações a grande distância, em dia de sol. Costuma fazer parte do equipamento das balsas salva-vidas.',
    { en: 'signalling mirror (heliograph)', sin: ['heliógrafo'], ver: ['pirotecnicos', 'balsa-salva-vidas', 'bolsa-de-abandono', 'facho-manual'], fonte: { txt: 'IMO, SOLAS e Código LSA (equipamento das balsas)', url: URL.solas }, aconfirmar: 'Nem toda balsa de recreio traz o espelho: confira a lista de equipamentos da sua.' });
  t('facho-manual', 'Facho manual', 'seguranca', 'Artefato pirotécnico, de acionamento manual, que emite luz vermelha de 15.000 candelas por 60 segundos. Serve para indicar a posição da embarcação de sobrevivência à noite, guiando navio ou aeronave. Na navegação costeira, a dotação de esporte e recreio é de dois fachos.',
    { en: 'red hand flare', sin: ['facho manual luz vermelha'], ver: ['pirotecnicos', 'abandono', 'balsa-salva-vidas', 'espelho-de-sinalizacao'], fonte: n211('Cap. 4, art. 4.16, alínea b), p. 4-8, e art. 4.17') });

  /* Rádio e GMDSS (acrescentados em 2026-10-09) */
  t('msi', 'MSI (informações de segurança marítima)', 'radio', 'Rede de transmissões, coordenada internacional e nacionalmente, com avisos de navegação e meteorológicos, previsões e outras mensagens urgentes de segurança, recebidas a bordo por equipamentos que monitoram as transmissões automaticamente (NAVTEX, SafetyNET).',
    { en: 'Maritime Safety Information (MSI)', sin: ['ISM', 'informações de segurança marítima'], ver: ['navarea', 'metarea', 'navtex', 'safetynet', 'gmdss'], fonte: mig3('cap. 47, PDF p. 689') });
  t('navarea', 'NAVAREA', 'radio', 'Cada uma das áreas em que o mundo é dividido para a divulgação de avisos náuticos, com um país coordenador. O Brasil coordena a NAVAREA V, limitada pela costa do Brasil, pelos paralelos 07°00’N e 35°50’S e pelo meridiano de 020°W.',
    { en: 'NAVAREA', ver: ['msi', 'metarea', 'safetynet', 'avisos-aos-navegantes', 'gmdss'], fonte: { txt: 'IHO, WWNWS-16 (2024), relatório da NAVAREA V', url: URL.navarea5, loc: 'item 1.1, p. 1 e 2' } });
  t('metarea', 'METAREA', 'radio', 'Cada uma das áreas em que o mundo é dividido para a divulgação de avisos e previsões meteorológicas marítimas, com um país coordenador. As áreas de meteorologia e as de avisos náuticos (NAVAREA) usam a mesma numeração.',
    { en: 'METAREA', ver: ['msi', 'navarea', 'metarea-v', 'meteoromarinha', 'gmdss'], fonte: [mig3('cap. 47, tabela de MSI por NAVAREA e METAREA, PDF p. 690'), { txt: 'WMO-IMO WWMIWS, METAREAs', url: URL.metarea5 }] });
  t('metarea-v', 'METAREA V', 'radio', 'Área de meteorologia marítima em que o Brasil é o serviço emissor: cobre as águas atlânticas a oeste de 20°W, de 35°50’S a 7°N, estreitando nas pontas até as fronteiras com o Uruguai (33°45’S) e com a Guiana Francesa (4°30’N). O boletim METEOROMARINHA é o produto dessa área.',
    { en: 'METAREA V', ver: ['metarea', 'meteoromarinha', 'navarea', 'aviso-de-mau-tempo'], fonte: { txt: 'WMO-IMO WWMIWS, METAREA V', url: URL.metarea5 } });
  t('safetynet', 'SafetyNET', 'radio', 'Serviço internacional automático de impressão direta, que usa os satélites da Inmarsat para divulgar a navios os avisos de navegação e meteorológicos, previsões, informações de busca e salvamento e outras mensagens urgentes. O receptor filtra o que interessa à área em que o navio está. Em 2023, a NAVAREA V o usava (Inmarsat, região AOR-E) para transmitir seus avisos.',
    { en: 'SafetyNET (Inmarsat EGC)', sin: ['EGC'], ver: ['msi', 'navarea', 'metarea', 'gmdss'], fonte: [mig3('cap. 47, item 47.3.3, PDF p. 738'), { txt: 'IHO, WWNWS-16 (2024), relatório da NAVAREA V', url: URL.navarea5, loc: 'itens 2.1 a 2.3, p. 3' }] });
  t('lista-de-auxilios-radio', 'Lista de Auxílios-Rádio', 'radio', 'Publicação náutica da DHN que reúne, entre outras informações, os canais de chamada em VHF e HF e dados das estações de rádio de interesse da navegação. Está na bibliografia recomendada do exame de Capitão-Amador.',
    { en: 'List of Radio Signals (Brazilian)', ver: ['roteiro', 'lista-de-farois', 'renec', 'estacao-costeira', 'msi'], fonte: [n211('Anexo 5-A, item 1.9, p. 5-A-4'), mig3('cap. 42, PDF p. 518')], link: { txt: 'Publicações do CHM', url: URL.publicacoesChm } });
  t('onda-ionosferica', 'Onda ionosférica', 'radio', 'Onda de rádio que sobe, reflete na ionosfera e volta à Terra, chegando muito além do horizonte. Também se chama onda celeste. É ela que dá ao HF o alcance de longa distância, que o VHF (de visada) não tem.',
    { en: 'sky wave (ionospheric wave)', sin: ['onda celeste'], ver: ['hf-ssb', 'vhf', 'dsc', 'gmdss'], fonte: mig3('cap. 34, PDF p. 35') });
  t('rcc', 'RCC (centro de coordenação de salvamento)', 'radio', 'Unidade que organiza e coordena as operações de busca e salvamento numa região. No mar costuma ser chamada de MRCC (Maritime Rescue Co-ordination Centre); no Brasil, o SALVAMAR BRASIL cumpre esse papel para o salvamento marítimo.',
    { en: 'Rescue Coordination Centre (RCC / MRCC)', sin: ['MRCC'], ver: ['salvamar', 'brmcc', 'cospas-sarsat', 'gmdss', 'mayday'], fonte: [mig3('sobre o MRCC (SALVAMAR BRASIL), PDF p. 168'), { txt: 'IMO, Convenção SAR', url: URL.sar }] });
  t('brmcc', 'BRMCC', 'radio', 'Centro Brasileiro de Controle de Missão: recebe os alertas das balizas de emergência de 406 MHz (EPIRB, PLB) e aciona as redes SALVAERO e SALVAMAR. Segundo o BRMCC, a EPIRB de embarcação que não é SOLAS pode ser codificada com o MMSI ou com o número de série; o PLB usa o número de série.',
    { en: 'Brazilian Mission Control Centre (BRMCC)', ver: ['epirb', 'plb', 'cospas-sarsat', 'infosar', 'rcc', 'salvamar'], fonte: [{ txt: 'INFOSAR (DECEA), página inicial, bloco “Emergência”', url: URL.infosar2 }, { txt: 'BRMCC (FAB/DECEA), página “Codificação”', url: URL.brmcc }] });

  /* ===================== Legislação e órgãos =====================
     Definições com fonte oficial (texto da norma ou da lei, com localizador). */
  t('autoridade-maritima', 'Autoridade Marítima', 'legislacao', 'Quem regula e fiscaliza a segurança da navegação e do tráfego aquaviário no Brasil. Pela LESTA, é exercida pela Marinha (o texto de 1997 fala em Ministério da Marinha); a Lei Complementar nº 97/1999 designa o Comandante da Marinha como Autoridade Marítima.',
    { en: 'Maritime Authority', ver: ['lesta', 'dpc', 'capitania-dos-portos', 'normam'], fonte: [lesta('art. 39'), { txt: 'Lei Complementar nº 97/1999', url: URL.lcp97, loc: 'art. 17, parágrafo único' }] });
  t('lesta', 'LESTA', 'legislacao', 'Lei de Segurança do Tráfego Aquaviário: a Lei nº 9.537, de 11 de dezembro de 1997. Define conceitos como amador, embarcação e comandante e dá à Autoridade Marítima o poder de criar normas e fiscalizar.',
    { en: 'Brazilian Waterway Traffic Safety Act', sin: ['Lei 9.537', 'Lei nº 9.537/1997'], ver: ['rlesta', 'autoridade-maritima', 'normam'], fonte: [lesta('arts. 2º e 39'), n211('Glossário, p. VIII')] });
  t('rlesta', 'RLESTA', 'legislacao', 'Regulamento de Segurança do Tráfego Aquaviário em Águas sob Jurisdição Nacional: o Decreto nº 2.596, de 18 de maio de 1998, que regulamenta a LESTA. Traz, entre outras coisas, as infrações e as penalidades, como multa e suspensão da habilitação. Conduzir embarcação sem habilitação é infração.',
    { en: 'regulation of the Waterway Traffic Safety Act', sin: ['Decreto 2.596', 'Decreto nº 2.596/1998'], ver: ['lesta', 'cha', 'inspecao-naval'], fonte: [{ txt: 'Decreto nº 2.596/1998 (RLESTA)', url: URL.rlesta, loc: 'Anexo, arts. 7º e 11' }, n211('Glossário, p. IX')] });
  t('normam', 'NORMAM', 'legislacao', 'Normas da Autoridade Marítima, publicadas pela Diretoria de Portos e Costas (DPC) e pela Diretoria de Hidrografia e Navegação (DHN). Cada uma, identificada por um número, trata de um assunto, como os amadores e o esporte e recreio (NORMAM-211) ou as motos aquáticas (NORMAM-212).',
    { en: 'Brazilian Maritime Authority Standards', ver: ['normam-211', 'normam-212', 'dpc', 'npcp'], link: { txt: 'Normas da Autoridade Marítima (DPC)', url: URL.normas } });
  t('normam-211', 'NORMAM-211/DPC', 'legislacao', 'Normas da Autoridade Marítima para Atividades de Esporte e Recreio. Trata das habilitações de amador (Arrais, Mestre e Capitão-Amador e Veleiro), das embarcações de esporte e recreio, dos equipamentos obrigatórios e das provas, com o programa e a bibliografia de cada uma.',
    { en: 'Brazilian rules for recreational boating', sin: ['NORMAM 211', 'NORMAM-211'], ver: ['normam', 'cha', 'arrais-amador', 'mestre-amador', 'capitao-amador'], fonte: n211('folha de rosto'), link: { txt: 'NORMAM-211/DPC (PDF)', url: URL.n211 } });
  t('normam-212', 'NORMAM-212/DPC', 'legislacao', 'Normas da Autoridade Marítima para Motos Aquáticas e Motonautas.',
    { en: 'Brazilian rules for personal watercraft', sin: ['NORMAM 212'], ver: ['motonauta', 'normam'], fonte: n211('Glossário, p. IX'), link: { txt: 'NORMAM-212/DPC (PDF)', url: URL.n212 } });
  t('dpc', 'DPC', 'legislacao', 'Diretoria de Portos e Costas, da Marinha do Brasil. Publica as NORMAM e, para o Capitão-Amador, divulga no seu site a programação do exame, a prova, o gabarito e a lista de aprovados.',
    { en: 'Directorate of Ports and Coasts', sin: ['Diretoria de Portos e Costas'], ver: ['normam', 'capitania-dos-portos', 'capitao-amador'], fonte: n211('Anexo 5-A, item 1 e), p. 5-A-1') });
  t('dhn', 'DHN', 'legislacao', 'Diretoria de Hidrografia e Navegação, da Marinha do Brasil, responsável pelas cartas náuticas e pelas publicações de auxílio à navegação do país, produzidas pelo Centro de Hidrografia da Marinha (CHM).',
    { en: 'Brazilian Hydrographic Office', sin: ['Diretoria de Hidrografia e Navegação'], ver: ['chm', 'carta-nautica', 'tabua-das-mares'], link: { txt: 'DHN (Marinha)', url: URL.dhn } });
  t('chm', 'CHM', 'legislacao', 'Centro de Hidrografia da Marinha. Produz e distribui as cartas náuticas, a Tábua das Marés, a Lista de Faróis, os Avisos aos Navegantes e, pelo Serviço Meteorológico Marinho, a previsão do tempo para o mar.',
    { en: 'Brazilian Navy Hydrographic Centre', sin: ['Centro de Hidrografia da Marinha'], busca: ['Serviço Meteorológico Marinho'], ver: ['dhn', 'meteoromarinha', 'avisos-aos-navegantes'], link: { txt: 'CHM (Marinha)', url: URL.chm } });
  t('capitania-dos-portos', 'Capitania dos Portos', 'legislacao', 'Organização da Marinha que representa a Autoridade Marítima numa área do litoral ou de um rio (as Capitanias Fluviais): fiscaliza a navegação, inscreve embarcações e cuida das habilitações. As provas de Arrais e de Mestre-Amador são programadas pelas Capitanias, Delegacias e Agências. Abreviatura CP.',
    { en: 'Harbour Master’s Office (Captaincy of Ports)', sin: ['CP', 'Capitania'], busca: ['Capitania Fluvial'], ver: ['delegacia', 'agencia', 'npcp', 'cha'], fonte: n211('Glossário, p. VI; Anexo 5-A, itens 2 b) e 3 a)'), link: { txt: 'Localize a Capitania mais próxima (DPC)', url: URL.capitanias } });
  t('delegacia', 'Delegacia da Capitania', 'legislacao', 'Delegacia da Capitania dos Portos (DL): unidade subordinada a uma Capitania, que atende uma parte da área dela.',
    { en: 'branch office of a Captaincy', sin: ['DL', 'Delegacia'], ver: ['capitania-dos-portos', 'agencia'], fonte: n211('Glossário, p. VI') });
  t('agencia', 'Agência da Capitania', 'legislacao', 'Agência da Capitania dos Portos (AG): unidade subordinada a uma Capitania dos Portos, que atende uma parte da área dela.',
    { en: 'agency of a Captaincy', sin: ['AG', 'Agência'], ver: ['capitania-dos-portos', 'delegacia'], fonte: n211('Glossário, p. V') });
  t('npcp', 'NPCP', 'legislacao', 'Normas e Procedimentos das Capitanias dos Portos (NPCP) e das Capitanias Fluviais (NPCF): regras de cada Capitania que completam as NORMAM para a sua região, como os limites das áreas de navegação interior.',
    { en: 'local Captaincy regulations', busca: ['NPCF'], ver: ['capitania-dos-portos', 'navegacao-interior', 'arrais-amador'], fonte: n211('Glossário, p. IX; art. 5.3.3 c), p. 5-1') });
  t('cha', 'CHA', 'legislacao', 'Carteira de Habilitação de Amador: documento, físico ou digital, que habilita a pessoa a conduzir embarcações de esporte e/ou recreio na categoria indicada. Levá-la a bordo é obrigatório.',
    { en: 'Brazilian recreational boating licence', sin: ['Carteira de Habilitação de Amador'], busca: ['habilitação'], ver: ['arrais-amador', 'mestre-amador', 'capitao-amador', 'veleiro-categoria', 'motonauta'], fonte: n211('Glossário, p. V; art. 5.3.3, p. 5-1') });
  t('amador', 'Amador', 'legislacao', 'Pela LESTA, todo aquele com habilitação certificada pela Autoridade Marítima para operar embarcações de esporte e recreio, em caráter não profissional.',
    { en: 'recreational (non-professional) skipper', ver: ['cha', 'lesta'], fonte: [lesta('art. 2º, I'), n211('art. 5.3, p. 5-1')] });
  t('arrais-amador', 'Arrais-Amador', 'legislacao', 'Categoria de amador (ARA) apta a conduzir embarcações nos limites da navegação interior, definidos nas NPCP/NPCF, exceto moto aquática. É a primeira etapa para quem quer comandar um veleiro de médio porte; exige um treinamento prático atestado.',
    { en: 'Brazilian inland waters skipper', sin: ['ARA', 'Arrais'], ver: ['mestre-amador', 'navegacao-interior', 'atestado-de-treinamento', 'cha'], fonte: n211('art. 5.3.3 c), p. 5-1; art. 5.4.1 f), p. 5-4') });
  t('mestre-amador', 'Mestre-Amador', 'legislacao', 'Categoria de amador (MSA) apta a conduzir embarcações entre portos nacionais e estrangeiros nos limites da navegação costeira (até 20 milhas náuticas), exceto moto aquática. Para fazer a prova, é preciso ser Arrais-Amador com a habilitação válida.',
    { en: 'Brazilian coastal skipper', sin: ['MSA', 'Mestre'], ver: ['arrais-amador', 'capitao-amador', 'navegacao-costeira'], fonte: n211('art. 5.3.3 b), p. 5-1; art. 5.4.1, Notas, p. 5-5') });
  t('capitao-amador', 'Capitão-Amador', 'legislacao', 'Categoria de amador (CPA) apta a conduzir embarcações entre portos nacionais e estrangeiros sem limite de afastamento da costa, exceto moto aquática: é a habilitação da travessia oceânica. Para fazer a prova, é preciso ser Mestre-Amador com a habilitação válida; o programa inclui navegação astronômica.',
    { en: 'Brazilian ocean skipper', sin: ['CPA', 'Capitão'], ver: ['mestre-amador', 'navegacao-oceanica', 'navegacao-astronomica', 'dpc'], fonte: n211('art. 5.3.3 a), p. 5-1; art. 5.4.1, Notas, p. 5-5; Anexo 5-A, item 1.1, p. 5-A-2') });
  t('motonauta', 'Motonauta', 'legislacao', 'Categoria de amador (MTA) apta a conduzir moto aquática nos limites da navegação interior. É regulada pela NORMAM-212 e não serve para outras embarcações.',
    { en: 'personal watercraft (jet ski) operator', sin: ['MTA'], ver: ['normam-212', 'cha'], fonte: n211('art. 5.3.3 d), p. 5-1') });
  t('veleiro-categoria', 'Veleiro (categoria de amador)', 'legislacao', 'Categoria de amador (VLA) apta a conduzir embarcações a vela sem propulsão a motor nos limites da navegação interior. É facultativa para embarcações miúdas de propulsão só a vela; sai com a declaração de conclusão de um curso de vela (Anexo 5-G).',
    { en: 'Brazilian inland sailing licence (sail-only boats)', sin: ['VLA', 'CHA-VLA'], ver: ['arrais-amador', 'embarcacao-miuda', 'veleiro'], fonte: n211('art. 5.3.3 e), p. 5-2; art. 5.5.2, p. 5-7; Anexo 5-G') });
  t('navegacao-interior', 'Navegação interior', 'legislacao', 'Navegação em águas abrigadas ou parcialmente abrigadas, como rios, lagos, baías, angras e canais. Divide-se em Área 1 (abrigada) e Área 2 (onde podem ocorrer ondas e ventos significativos). É o limite do Arrais-Amador e do Veleiro.',
    { en: 'inland (sheltered) waters navigation', ver: ['navegacao-costeira', 'arrais-amador', 'npcp'], fonte: n211('Glossário, p. VIII; art. 4.7, p. 4-4') });
  t('navegacao-costeira', 'Navegação costeira', 'legislacao', 'Navegação dentro dos limites de visibilidade da costa, até a distância máxima de 20 milhas náuticas. É o limite do Mestre-Amador.',
    { en: 'coastal navigation (up to 20 NM)', ver: ['navegacao-interior', 'navegacao-oceanica', 'mestre-amador'], fonte: n211('Glossário, p. VIII; art. 4.7, p. 4-4') });
  t('navegacao-oceanica', 'Navegação oceânica', 'legislacao', 'Navegação considerada sem restrições, além das 20 milhas náuticas da costa. Exige Capitão-Amador.',
    { en: 'ocean navigation (unrestricted)', ver: ['navegacao-costeira', 'capitao-amador'], fonte: n211('Glossário, p. VIII; art. 4.7, p. 4-4') });
  t('embarcacao', 'Embarcação', 'legislacao', 'Pela lei, qualquer construção, inclusive as plataformas flutuantes e, quando rebocadas, as fixas, sujeita a inscrição na Autoridade Marítima e capaz de se locomover na água, por meios próprios ou não, transportando pessoas ou cargas.',
    { en: 'vessel (legal definition)', ver: ['embarcacao-miuda', 'embarcacao-de-medio-porte', 'inscricao'], fonte: [lesta('art. 2º, V'), n211('Glossário, p. VI')] });
  t('embarcacao-miuda', 'Embarcação miúda', 'legislacao', 'Para a NORMAM-211, embarcação com comprimento igual ou menor que 6 metros.',
    { en: 'small craft (up to 6 m)', ver: ['embarcacao-de-medio-porte', 'veleiro-categoria', 'bote-de-apoio'], fonte: n211('Glossário, p. VII') });
  t('embarcacao-de-medio-porte', 'Embarcação de médio porte', 'legislacao', 'Para a NORMAM-211, embarcação com menos de 24 metros de comprimento, exceto as miúdas. Um veleiro de cruzeiro com mais de 6 m e menos de 24 m de comprimento (por exemplo, um de 32 pés, ≈ 9,75 m) é de médio porte.',
    { en: 'medium-sized craft (6 to 24 m)', ver: ['embarcacao-miuda', 'iate', 'comprimento'], fonte: n211('Glossário, p. VII') });
  t('iate', 'Iate', 'legislacao', 'Para a NORMAM-211, embarcação de esporte e/ou recreio com 24 metros ou mais de comprimento, também chamada de embarcação de grande porte.',
    { en: 'large yacht (24 m or more)', sin: ['embarcação de grande porte'], ver: ['embarcacao-de-medio-porte'], fonte: n211('Glossário, p. VII') });
  t('comandante', 'Comandante', 'legislacao', 'Também chamado de Mestre, Arrais ou Patrão: o tripulante responsável pela operação e pela manutenção da embarcação, em condições de segurança, extensivas à carga, aos tripulantes e às demais pessoas a bordo.',
    { en: 'master, skipper', sin: ['patrão'], ver: ['amador', 'tripulante', 'aviso-de-saida'], fonte: [lesta('art. 2º, IV'), n211('Glossário, p. VI')] });
  t('tripulante', 'Tripulante', 'legislacao', 'Todo amador ou profissional que exerce funções, embarcado, na operação da embarcação.',
    { en: 'crew member', busca: ['tripulação'], ver: ['comandante', 'lotacao'], fonte: n211('Glossário, p. X') });
  t('lotacao', 'Lotação', 'legislacao', 'Quantidade máxima de pessoas autorizadas a embarcar, incluindo a tripulação.',
    { en: 'maximum number of persons', ver: ['tripulante', 'colete-salva-vidas'], fonte: n211('Glossário, p. VIII') });
  t('inscricao', 'Inscrição da embarcação', 'legislacao', 'Cadastro da embarcação na Capitania, Delegacia ou Agência, com a atribuição do nome e do número de inscrição e a emissão do Título de Inscrição de Embarcação (TIE) digital.',
    { en: 'vessel registration (with the Captaincy)', ver: ['tie', 'registro-tribunal-maritimo', 'capitania-dos-portos'], fonte: n211('Glossário, p. VII') });
  t('tie', 'TIE', 'legislacao', 'Título de Inscrição de Embarcação: documento, hoje digital, que comprova a inscrição da embarcação na Autoridade Marítima, com o nome e o número dela.',
    { en: 'vessel registration certificate', sin: ['Título de Inscrição de Embarcação'], ver: ['inscricao', 'registro-tribunal-maritimo'], fonte: n211('Glossário, p. VII e IX') });
  t('registro-tribunal-maritimo', 'Registro no Tribunal Marítimo', 'legislacao', 'Cadastro da embarcação no Tribunal Marítimo, com número de registro e a Provisão de Registro da Propriedade Marítima (PRPM). Não é o mesmo que a inscrição na Capitania.',
    { en: 'registration of ownership (Maritime Court)', sin: ['PRPM'], busca: ['Tribunal Marítimo'], ver: ['inscricao', 'tie'], fonte: [n211('Glossário, p. IX'), lesta('art. 2º, XVIII')] });
  t('aviso-de-saida', 'Aviso de Saída', 'legislacao', 'Comunicação obrigatória feita pelo comandante, ou pela marina ou clube a que ele é filiado, antes de sair, para que a embarcação possa ser identificada e localizada em caso de socorro. Pode ser trocada pelo registro no aplicativo NAVSEG. A chegada também deve ser comunicada.',
    { en: 'departure notice (float plan)', ver: ['navseg', 'comandante', 'salvamar'], fonte: n211('art. 4.6, p. 4-3') });
  t('navseg', 'NAVSEG', 'legislacao', 'Aplicativo da Marinha do Brasil para celular em que o comandante registra o plano de navegação no lugar do formulário de Aviso de Saída. A marina ou clube de onde o barco sai e a Marinha passam a acompanhar a viagem. A Marinha recomenda o uso.',
    { en: 'Brazilian Navy float plan app', ver: ['aviso-de-saida', 'salvamar'], fonte: n211('art. 4.6.1, p. 4-3') });
  t('etn', 'ETN', 'legislacao', 'Estabelecimento de Treinamento Náutico: empresa que dá treinamentos práticos para a qualificação de amadores, exclusivamente em embarcações de esporte e/ou recreio.',
    { en: 'nautical training establishment', sin: ['Estabelecimento de Treinamento Náutico'], ver: ['atestado-de-treinamento', 'arrais-amador'], fonte: n211('Glossário, p. VII') });
  t('atestado-de-treinamento', 'Atestado de Treinamento Náutico', 'legislacao', 'Atestado de Treinamento Náutico para Arrais-Amador, no modelo do Anexo 5-E, com firma reconhecida em cartório ou assinatura digital pelo gov.br, que deve ser apresentado para a habilitação de Arrais-Amador.',
    { en: 'practical training certificate (Arrais-Amador)', ver: ['arrais-amador', 'etn'], fonte: n211('art. 5.4.1 f), p. 5-4') });
  t('gru', 'GRU', 'legislacao', 'Guia de Recolhimento da União: guia de pagamento federal usada para pagar os serviços da Marinha, como a inscrição na prova. A GRU paga por quem faltou ou foi reprovado não pode ser reutilizada num novo exame.',
    { en: 'federal payment slip', sin: ['Guia de Recolhimento da União'], ver: ['capitania-dos-portos', 'cha'], fonte: n211('Glossário, p. VII; Anexo 5-A, itens 1 h), 2 h) e 3 g)'), link: { txt: 'Tabelas de indenizações (DPC)', url: URL.indenizacoes } });
  t('dpem', 'DPEM', 'legislacao', 'Seguro Obrigatório de Danos Pessoais Causados por Embarcações ou por suas Cargas, criado pela Lei nº 8.374/1991.',
    { en: 'compulsory personal injury insurance for vessels', ver: ['inscricao'], fonte: n211('Glossário, p. VI'), aconfirmar: 'Como e onde contratar hoje, e quando ele é exigido: confirme na Capitania.' });
  t('inspecao-naval', 'Inspeção Naval', 'legislacao', 'Fiscalização feita pela Marinha do cumprimento da LESTA, das normas e dos atos internacionais ratificados pelo Brasil, para a salvaguarda da vida humana, a segurança da navegação e a prevenção da poluição por embarcações.',
    { en: 'naval inspection (maritime enforcement)', ver: ['vistoria', 'rlesta', 'cha'], fonte: [lesta('art. 2º, VII'), n211('Glossário, p. VIII')] });
  t('vistoria', 'Vistoria', 'legislacao', 'Verificação técnica e administrativa, eventual ou periódica, de que a embarcação cumpre as normas de segurança, de habitabilidade e de prevenção da poluição.',
    { en: 'survey', ver: ['inspecao-naval'], fonte: n211('Glossário, p. X') });
  t('areas-adjacentes-as-praias', 'Áreas adjacentes às praias', 'legislacao', 'Faixa em volta das praias, marítimas, fluviais ou lacustres, até 200 metros a partir da linha de arrebentação das ondas ou, em rios, lagos e lagoas, de onde começa o espelho d’água. A NORMAM-211 traz regras para a navegação nessa faixa, onde há banhistas.',
    { en: 'areas adjacent to beaches (200 m)', ver: ['velocidade-de-seguranca', 'npcp'], fonte: n211('Glossário, p. V') });
  t('ajb', 'AJB', 'legislacao', 'Águas Jurisdicionais Brasileiras: sigla usada nas normas para as águas em que o Brasil exerce jurisdição.',
    { en: 'Brazilian jurisdictional waters', ver: ['lesta', 'rlesta'], fonte: n211('Glossário, p. V') });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('imo', 'IMO', 'legislacao', 'Organização Marítima Internacional: agência das Nações Unidas, com sede em Londres, que cria as regras internacionais de segurança da navegação e de prevenção da poluição por navios, como a SOLAS, a MARPOL e o RIPEAM (COLREG).',
    { en: 'International Maritime Organization (IMO)', sin: ['OMI', 'Organização Marítima Internacional'], ver: ['solas', 'ripeam', 'gmdss'], fonte: { txt: 'IMO, página institucional', url: URL.imo }, link: { txt: 'IMO', url: URL.imo } });
  t('solas', 'SOLAS', 'legislacao', 'Convenção Internacional para a Salvaguarda da Vida Humana no Mar (1974), da IMO. Trata da construção, da salvatagem, das comunicações de rádio (GMDSS) e da segurança da navegação dos navios mercantes. Na Marinha, “embarcação SOLAS” exclui, entre outras, as de comprimento de regra menor que 24 m.',
    { en: 'SOLAS (International Convention for the Safety of Life at Sea)', ver: ['imo', 'gmdss', 'balsa-salva-vidas', 'embarcacao'], fonte: [{ txt: 'IMO, Convenção SOLAS', url: URL.solas }, mig1('cap. 12, nota sobre “embarcações SOLAS” (NORMAM-01), PDF p. 377')] });
  t('ciaga', 'CIAGA', 'legislacao', 'Centro de Instrução Almirante Graça Aranha, da Marinha do Brasil. Para o exame de Capitão-Amador, recebe os pedidos de revisão de prova e dá a decisão final.',
    { en: 'Almirante Graça Aranha Instruction Centre', ver: ['pedido-de-revisao', 'capitao-amador', 'dpc', 'gabarito'], fonte: n211('Anexo 5-A, Seção I, item 1, alínea g), p. 5-A-1') });

  /* ===================== Prova e estudo ===================== */
  t('gabarito', 'Gabarito', 'prova', 'Lista oficial das respostas certas de uma prova. Para o Capitão-Amador, a DPC publica no site a prova, o gabarito (primeiro o preliminar e depois o final) e a lista de aprovados.',
    { en: 'answer key', ver: ['pedido-de-revisao', 'simulado', 'ciaga', 'anb'], fonte: { txt: 'DPC, Exame para a Categoria de Capitão-Amador', url: URL.dpcCpa, loc: 'provas, gabaritos e listas de aprovados' } });
  t('pedido-de-revisao', 'Pedido de revisão de prova', 'prova', 'Requerimento com que o candidato ao CPA contesta questões ou o resultado: o prazo é de 7 dias úteis depois da divulgação oficial da prova e do gabarito, entregue à organização militar da inscrição. O CIAGA dá a decisão final.',
    { en: 'exam review request', sin: ['recurso da prova', 'revisão de prova'], ver: ['gabarito', 'ciaga', 'capitao-amador'], fonte: n211('Anexo 5-A, Seção I, item 1, alíneas f) e g), p. 5-A-1') });
  t('simulado', 'Simulado', 'prova', 'Prova de treino, no mesmo formato da real e com o tempo marcado, para medir o preparo e achar os assuntos fracos. Para o Capitão-Amador, as provas e os gabaritos antigos que a DPC publica servem de simulado.',
    { en: 'mock exam', ver: ['gabarito', 'afirmativa', 'distrator'], fonte: { txt: 'DPC, Exame para a Categoria de Capitão-Amador', url: URL.dpcCpa, loc: 'provas e gabaritos de 2017 em diante' } });
  t('afirmativa', 'Afirmativa', 'prova', 'Cada frase numerada (I, II, III…) que o candidato deve julgar como certa ou errada dentro de uma questão. A alternativa correta diz quais afirmativas são verdadeiras.',
    { en: 'statement (in a multiple-choice item)', ver: ['distrator', 'comando-negativo', 'simulado'] });
  t('distrator', 'Distrator', 'prova', 'Cada alternativa errada de uma questão de múltipla escolha. É escrita para parecer plausível a quem não domina a matéria, por isso vale eliminar primeiro as que contradizem algo que você sabe.',
    { en: 'distractor', ver: ['afirmativa', 'comando-negativo', 'gabarito'] });
  t('comando-negativo', 'Comando negativo', 'prova', 'Enunciado que pede a alternativa errada ou a exceção: “assinale a INCORRETA”, “NÃO é”, “em DESACORDO”. Sublinhe a palavra negativa e procure a única alternativa falsa: a certa é a única errada.',
    { en: 'negative stem (“EXCEPT” question)', ver: ['afirmativa', 'distrator', 'simulado'] });
  t('anb', 'ANB', 'prova', 'Almanaque Náutico Brasileiro. Nas provas de Capitão-Amador, os dados do almanaque vêm nos anexos fornecidos com a prova, chamados anexos ANB, para os cálculos de navegação astronômica.',
    { en: 'Brazilian Nautical Almanac (ANB)', ver: ['almanaque-nautico', 'navegacao-astronomica', 'capitao-amador', 'gabarito'], fonte: { txt: 'DPC, prova CPA-II/2026', url: URL.cpa2026, loc: 'p. 1 (“nos anexos do Almanaque Náutico Brasileiro (ANB)”)' } });

  /* ===================== Fontes de fatos verificados (acrescentadas no fechamento de 2026-10-09) =====================
     Verbetes que dizem algo medido ou normatizado (cores e formas do balizamento, regra dos doze avos, frequências,
     palavras de socorro, dotação de segurança) e não tinham `fonte`. Cada entrada aponta para um fato de
     research/claims_verified.json (data/fontes.js) já verificado por dois verificadores; o localizador é o do fato.
     Só entra onde o fato sustenta o que o verbete afirma; o resto do vocabulário geral continua sem fonte por verbete. */
  var FV = {
    "marca-lateral": [{ txt: "NORMAM-601/DHN (balizamento)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html", loc: "art. 3.2" }, { txt: "NORMAM-601/DHN (balizamento)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html", loc: "art. 3.3" }],
    "marca-cardinal": [{ txt: "Decreto nº 92.267/1986 (Anexo, sistema IALA)", url: "https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm", loc: "Anexo, item 3.1.3" }, { txt: "NORMAM-601/DHN (balizamento)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html", loc: "art. 3.7" }],
    "perigo-isolado": [{ txt: "NORMAM-601/DHN (balizamento)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html", loc: "art. 3.11" }],
    "aguas-seguras": [{ txt: "NORMAM-601/DHN (balizamento)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html", loc: "art. 3.12" }, { txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., quadro \"Águas Seguras\", p. XXIX (PDF p. 29)" }],
    "marca-especial": [{ txt: "Decreto nº 92.267/1986 (Anexo, sistema IALA)", url: "https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm", loc: "Anexo, item 6.2" }],
    "naufragio-recente": [{ txt: "IALA, Recomendação R1001", url: "https://www.iala.int/product/r1001/?download=true", loc: "IALA R1001 Ed. 2.0, item 2.6.2, p. 21" }, { txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., quadro \"Novos Perigos\", p. XXIX (PDF p. 29)" }],
    "regra-dos-doze-avos": [{ txt: "Wikipédia, Rule of twelfths (fonte secundária, não oficial)", url: "https://en.wikipedia.org/wiki/Rule_of_twelfths", loc: "Seção \"Approximation to a sine curve\" e \"Tides\"" }, { txt: "Wikipédia, Rule of twelfths (fonte secundária, não oficial)", url: "https://en.wikipedia.org/wiki/Rule_of_twelfths", loc: "Seção \"Tides\"" }],
    "nivel-de-reducao": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-19" }],
    "sondagem": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-19" }],
    "altura-da-mare": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-13" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-19" }],
    "alcance": [{ txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., Introdução, item 3.5 (Alcances), p. XX (PDF p. 20)" }],
    "datum": [{ txt: "CHM, Cartas Náuticas", url: "https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas", loc: "Página \"Cartas Náuticas\" (CHM)" }],
    "ais-mob": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 4.22.1 a) (Extrato Mo Cat. 1, p. 20)" }],
    "sart": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.2.8, p. 25" }],
    "plb": [{ txt: "DECEA, Central de Ajuda (INFOSAR)", url: "https://ajuda.decea.mil.br/base-de-conhecimento/quais-os-tipos-de-balizas-de-emergencias-que-existem-para-aeronaves-e-embarcacoes/", loc: "Central de Ajuda DECEA, artigo \"Quais os tipos de balizas de emergências...\" (categoria INFOSAR)" }],
    "arnes": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 5.01.1 (Extrato Mo Cat. 1, p. 23)" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 5.02.2–5.02.3 (Extrato Mo Cat. 1, p. 23)" }],
    "bolsa-de-abandono": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 4.21.1 e 4.21.2 (Extrato Mo Cat. 1), p. 20" }],
    "dsc": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "art. 4.24.2, alíneas b e c, p. 4-14" }, { txt: "RIPEAM-72 consolidado (DPC)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Anexo IV, item 1(l), p. 39" }],
    "mayday": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.1.9.3, p. 18" }, { txt: "RIPEAM-72 consolidado (DPC)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Anexo IV, item 1(d)-(f), p. 39" }],
    "pan-pan": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.1.9.3, p. 18" }],
    "securite": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.1.9.3, p. 18" }],
    "gmdss": [{ txt: "Anatel, Serviço Móvel Marítimo (GMDSS)", url: "https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo/em-1979-a-organizacao-maritima-internacional-imo-reconhecendo-a-necessidade-de-implementar-o-sistema-de-comunicacao-maritima-decidiu-dar-inicio-a-implantacao-de-um-novo-sistema-de-socorro-e-seguranca-conhecido-como-sistema-global-de-socorro-e-seguranca", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.2.12, p. 26" }, { txt: "Anatel, Serviço Móvel Marítimo (GMDSS)", url: "https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo/em-1979-a-organizacao-maritima-internacional-imo-reconhecendo-a-necessidade-de-implementar-o-sistema-de-comunicacao-maritima-decidiu-dar-inicio-a-implantacao-de-um-novo-sistema-de-socorro-e-seguranca-conhecido-como-sistema-global-de-socorro-e-seguranca", loc: "Anatel, Serviço Móvel Marítimo, página sobre o GMDSS, definição das áreas marítimas A1 e A2" }],
    "navtex": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 2.2.10, p. 26" }],
    "indicativo-de-chamada": [{ txt: "Resolução Anatel nº 777/2025 (RGST)", url: "https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777", loc: "art. 269" }, { txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03), item 1.4.2, p. 6" }],
    "homem-ao-mar": [{ txt: "US Sailing, Man Overboard Rescue Procedure (Isler, 2016)", url: "https://www.ussailing.org/news/man-overboard-rescue-procedure/", loc: "gritar, manter a pessoa à vista, jogar flutuação, marcar o ponto no GNSS e alertar pelo VHF" }, { txt: "RYA, Man overboard (segurança em água fria)", url: "https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/", loc: "alarme à tripulação, vigia designado, botão MOB e MAYDAY ou alerta DSC" }, { txt: "US Sailing, Quick-Stop Rescue (2016)", url: "https://www.ussailing.org/news/quick-stop-rescue/", loc: "manobra de volta" }, { txt: "US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1)", url: "https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf", loc: "quick-stop como base, Lifesling, vigia com 5 ou mais pessoas" }, { txt: "US Sailing, Rousmaniere, Final Report 2005 Crew Overboard Rescue Symposium", url: "https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf", loc: "aproximação final em bolina folgada, devagar, barco a barlavento da pessoa" }],
    "choque-termico": [{ txt: "RYA, Man overboard (segurança em água fria)", url: "https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/", loc: "choque térmico e tempo em água fria" }, { txt: "Cold Water Safety, a regra 1-10-1", url: "https://www.coldwatersafety.org/1-10-1-myth", loc: "origem (Giesbrecht) e os três tempos, com críticas" }],
  };
  T.forEach(function (x) { if (FV[x.id] && !x.fonte) x.fonte = FV[x.id]; });

  /* ===================== Fontes do lote 1 do glossário (casco e embarcação), 2026-10-09 =====================
     Cada verbete aponta para até três fontes consultadas: Marinha do Brasil (Manual de Navegação Vol. III, Apêndice 5;
     NORMAM-211; RIPEAM), World Sailing (Offshore Special Regulations), Dicionário Priberam e Wikipédia (secundária).
     O localizador traz a página, o item ou o verbete; o trecho literal de cada fonte está em
     research/_work/glossario_fontes_1.json. Só entram ids com fonte confirmada; 'casaria' ficou sem fonte. */
  var FV1 = {
    "proa": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/proa", loc: "verbete \"proa\", acepção 2" }, { txt: "Wikipédia PT, Proa (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Proa", loc: "abertura do artigo \"Proa\"" }],
    "popa": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/popa", loc: "verbete \"popa\", acepção 1" }, { txt: "Wikipédia PT, Popa (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Popa", loc: "abertura do artigo \"Popa\"" }],
    "bombordo": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-34" }, { txt: "RIPEAM-72 consolidado (DPC)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Regra 21(b)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bombordo", loc: "verbete \"bombordo\"" }],
    "boreste": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-34" }, { txt: "RIPEAM-72 consolidado (DPC)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Regra 21(b)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/boreste", loc: "verbete \"boreste\" (Brasil)" }],
    "traves": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"abeam\"" }],
    "bochecha": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, 'ângulo do alvo' (Mrel = 045º), p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bochecha", loc: "verbete \"bochecha\", acepção 3" }],
    "alheta": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, cap. 42, manobra em tormenta tropical (alheta = 135º relativos), p. 42-50" }],
    "meia-nau": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-26" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/meia-nau", loc: "verbete \"meia-nau\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"amidships\"" }],
    "linha-de-centro": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-26" }, { txt: "RIPEAM-72 consolidado (DPC)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Regra 21(a)" }],
    "avante": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/avante", loc: "verbete \"avante\", acepção 1" }],
    "a-re": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-26" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"aft\"" }],
    "casco": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-33" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/casco", loc: "verbete \"casco\", acepção 9" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"hull\"" }],
    "costado": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/costado", loc: "verbete \"costado\", acepção 2" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio (gunwale), p. A5-33" }],
    "obras-vivas": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/obras%20vivas", loc: "verbete \"obra\", locução \"obras vivas\"" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/carena", loc: "verbete \"carena\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"bottom\"" }],
    "obras-mortas": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/obras%20vivas", loc: "verbete \"obra\", locução \"obras mortas\"" }],
    "borda-livre": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-32" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Definições, p. VI" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"freeboard\"" }],
    "calado": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/calado", loc: "verbete \"calado\", acepção 10" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"draft\"" }],
    "pontal": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/pontal", loc: "verbete \"pontal\", acepção 1" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo, instruções do formulário (campo 22)" }],
    "boca": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Cap. 2, documentos para inscrição, alínea l, p. 2-10" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/boca", loc: "verbete \"boca\", acepção 16" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"beam\"" }],
    "pe": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 3, item de comprimento (equivalência de unidades), p. A3-3" }, { txt: "Wikipédia, Foot (unit) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Foot_(unit)", loc: "abertura do artigo \"Foot (unit)\"" }],
    "quilha": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Cap. 2, quadro de tipos de embarcação, nº 22 (Veleiro), p. 2-28" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"keel\"" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/quilha", loc: "verbete \"quilha\", acepção 1" }],
    "bolina": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Cap. 2, quadro de tipos de embarcação, nº 14 (Jangada), p. 2-27" }, { txt: "Wikipédia, Centreboard (fonte secundária)", url: "https://en.wikipedia.org/wiki/Centreboard", loc: "abertura do artigo \"Centreboard\"" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bolina", loc: "verbete \"bolina\", acepção 2" }],
    "lastro": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-31" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/lastro", loc: "verbete \"lastro\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"ballast\"" }],
    "leme": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-34" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/leme", loc: "verbete \"leme\", acepção 1" }],
    "cana-do-leme": [{ txt: "Wikipédia, Tiller (fonte secundária)", url: "https://en.wikipedia.org/wiki/Tiller", loc: "seção \"Watercraft\", artigo \"Tiller\"" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/tim%C3%A3o", loc: "verbete \"timão\", acepção 3" }],
    "roda-de-leme": [{ txt: "Wikipédia, Tiller (fonte secundária)", url: "https://en.wikipedia.org/wiki/Tiller", loc: "artigo \"Tiller\", legenda da figura de ordens de leme" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/leme", loc: "verbete \"leme\", acepção 2" }],
    "conves": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-32" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/conv%C3%A9s", loc: "verbete \"convés\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"deck\"" }],
    "cockpit": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.09.1(a)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"cockpit\"" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/cockpit", loc: "verbete \"cockpit\", acepção 2" }],
    "gaiuta": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/gaiuta", loc: "verbete \"gaiúta\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"companionway\"" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.08.4" }],
    "escotilha": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-33" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/escotilha", loc: "verbete \"escotilha\", acepção 1" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.08.2(a)" }],
    "vigia": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/vigia", loc: "verbete \"vigia\", acepção 7" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR, lista de verificação 3.08.3" }],
    "guarda-mancebo": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.14.1" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/guarda-mancebos", loc: "verbete \"guarda-mancebos\"" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"jackline\"" }],
    "pulpito": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.14.1(g)" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.14.1(h)" }],
    "cunho": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, manobras de espias, p. A5-13" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/cunho", loc: "verbete \"cunho\", acepção 6" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"cleat\"" }],
    "buzina": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, manobras de espias, p. A5-13" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"fairlead\"" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"chock\"" }],
    "malagueta": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/malagueta", loc: "verbete \"malagueta\", acepção 4" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/malagueta", loc: "verbete \"malagueta\", acepção 5" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"belaying pin\"" }],
    "cabeco": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, manobras de espias, p. A5-13" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, manobras de espias, p. A5-13" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/cabe%C3%A7o", loc: "verbete \"cabeço\", acepção 4" }],
    "molinete": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, fundeio, p. A5-22" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/molinete", loc: "verbete \"molinete\", acepção 4" }],
    "paiol-da-amarra": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, fundeio, p. A5-21" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, fundeio (bitter end), p. A5-20" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"chain locker\"" }],
    "sentina": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/sentina", loc: "verbete \"sentina\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"bilge\", acepção 2" }],
    "bomba-de-esgoto": [{ txt: "Wikipédia, Bilge pump (fonte secundária)", url: "https://en.wikipedia.org/wiki/Bilge_pump", loc: "abertura do artigo \"Bilge pump\"" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.23.1(b)" }],
    "borda": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio (gunwale), p. A5-33" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-31" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"gunwale\"" }],
    "anteparo": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-31" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/antepara", loc: "verbete \"antepara\"" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"bulkhead\"" }],
    "valvula-de-fundo": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 3.10" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf", loc: "OSR 4.03" }],
    "banda": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-33" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/banda", loc: "verbete \"banda\", acepção 10" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"heel\", acepção 1" }],
    "trim": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }],
    "arfagem": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, direções e marcações relativas, p. A5-27" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/arfagem", loc: "verbete \"arfagem\", acepção 3" }],
    "deslocamento": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, deslocamento e tonelagem, p. A5-28" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/deslocamento", loc: "verbete \"deslocamento\", acepção 2" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"displacement\"" }],
    "velocidade-de-casco": [{ txt: "Wikipédia, Hull speed (fonte secundária)", url: "https://en.wikipedia.org/wiki/Hull_speed", loc: "abertura do artigo \"Hull speed\"" }, { txt: "Wikipédia, Hull speed (fonte secundária)", url: "https://en.wikipedia.org/wiki/Hull_speed", loc: "seção \"Hull speed formula\", artigo \"Hull speed\"" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"hull speed\"" }],
    "planar": [{ txt: "Wikipédia, Planing (boat) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Planing_(boat)", loc: "abertura do artigo \"Planing (boat)\"" }],
  };
  T.forEach(function (x) { if (FV1[x.id] && !x.fonte) x.fonte = FV1[x.id]; });
  /* ===================== Fontes do vocabulário geral (lote 2: casco, aparelho e velas) =====================
     Verbetes de vocabulário náutico que não tinham `fonte`. Cada entrada aponta para um texto reconhecido e acessível
     (NORMAM-211, RIPEAM, dicionários Priberam e Infopédia, Wikipédia PT/EN) que define ou descreve o termo de forma
     compatível com a frase do verbete; o trecho literal de cada fonte está em research/_work/glossario_fontes_2.json.
     Fontes secundárias (Wikipédia, dicionários) sustentam o vocabulário; não são normativas. "Tormentim" ficou sem fonte. */
  var FV2 = {
    "veleiro": [{ txt: "NORMAM-211/DPC (Marinha do Brasil)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "item 2.15.4 (Tipos de Embarcações), tipo 22 \"Veleiro\"" }, { txt: "RIPEAM/COLREG 72 consolidado (CCA-IMO, Marinha do Brasil)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Regra 3 (Definições gerais), alínea (c)" }, { txt: "RIPEAM/COLREG 72 consolidado (CCA-IMO, Marinha do Brasil)", url: "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf", loc: "Regra 3 (Definições gerais), alínea (b)" }],
    "sloop": [{ txt: "Wikipedia EN, \"Sloop\"", url: "https://en.wikipedia.org/wiki/Sloop", loc: "abertura do artigo" }],
    "cutter": [{ txt: "Wikipedia EN, \"Cutter (boat)\"", url: "https://en.wikipedia.org/wiki/Cutter_(boat)", loc: "abertura do artigo, parágrafo sobre o aparelho" }],
    "ketch": [{ txt: "Wikipedia EN, \"Ketch\"", url: "https://en.wikipedia.org/wiki/Ketch", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Ketch\"", url: "https://pt.wikipedia.org/wiki/Ketch", loc: "abertura do artigo" }],
    "catamara": [{ txt: "NORMAM-211/DPC (Marinha do Brasil)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "item 2.15.4 (Tipos de Embarcações), tipo 18 \"Multicasco\"" }, { txt: "Wikipedia EN, \"Catamaran\"", url: "https://en.wikipedia.org/wiki/Catamaran", loc: "seção \"Performance characteristics\"" }, { txt: "Wikipedia EN, \"Capsizing\"", url: "https://en.wikipedia.org/wiki/Capsizing", loc: "seção sobre desvirar (\"righting\") veleiros" }],
    "monocasco": [{ txt: "Wikipédia PT, \"Monocasco\"", url: "https://pt.wikipedia.org/wiki/Monocasco", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Monohull\"", url: "https://en.wikipedia.org/wiki/Monohull", loc: "seção \"Fundamental concept\"" }],
    "mastro": [{ txt: "Wikipédia PT, \"Mastro (náutica)\"", url: "https://pt.wikipedia.org/wiki/Mastro_(n%C3%A1utica)", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Mastro (náutica)\"", url: "https://pt.wikipedia.org/wiki/Mastro_(n%C3%A1utica)", loc: "seção \"Fixação e cablagem de suporte\"" }],
    "tope-do-mastro": [{ txt: "Infopédia (Dicionário da Língua Portuguesa, Porto Editora), \"tope\"", url: "https://www.infopedia.pt/dicionarios/lingua-portuguesa-aao/tope", loc: "verbete \"tope\", acepção 8" }, { txt: "Dicionário Priberam da Língua Portuguesa, \"garlindéu\"", url: "https://dicionario.priberam.org/garlind%C3%A9u", loc: "verbete \"garlindéu\"" }, { txt: "Wikipedia EN, \"Mast (sailing)\"", url: "https://en.wikipedia.org/wiki/Mast_(sailing)", loc: "abertura do artigo" }],
    "retranca": [{ txt: "Wikipédia PT, \"Retranca\"", url: "https://pt.wikipedia.org/wiki/Retranca", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Retranca\"", url: "https://pt.wikipedia.org/wiki/Retranca", loc: "abertura do artigo, último parágrafo" }],
    "estai": [{ txt: "Wikipédia PT, \"Estai\"", url: "https://pt.wikipedia.org/wiki/Estai", loc: "abertura do artigo" }],
    "estai-de-popa": [{ txt: "Wikipédia PT, \"Estai\"", url: "https://pt.wikipedia.org/wiki/Estai", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Brandal\"", url: "https://pt.wikipedia.org/wiki/Brandal", loc: "seção \"Nomenclatura\"" }],
    "brandal": [{ txt: "Wikipédia PT, \"Brandal\"", url: "https://pt.wikipedia.org/wiki/Brandal", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Ovém\"", url: "https://pt.wikipedia.org/wiki/Ov%C3%A9m", loc: "abertura do artigo" }],
    "esticador": [{ txt: "Wikipédia PT, \"Esticador\"", url: "https://pt.wikipedia.org/wiki/Esticador", loc: "abertura do artigo" }],
    "chapa-de-brandal": [{ txt: "Wikipedia EN, \"Chainplate\"", url: "https://en.wikipedia.org/wiki/Chainplate", loc: "abertura do artigo" }],
    "enora": [{ txt: "Wikipédia PT, \"Enora\"", url: "https://pt.wikipedia.org/wiki/Enora", loc: "artigo inteiro" }, { txt: "Dicionário Priberam da Língua Portuguesa, \"enora\"", url: "https://dicionario.priberam.org/enora", loc: "verbete \"enora\", acepção 1" }],
    "adrica": [{ txt: "Dicionário Priberam da Língua Portuguesa, \"adriça\"", url: "https://dicionario.priberam.org/adri%C3%A7a", loc: "verbete \"adriça\"" }],
    "escota": [{ txt: "Wikipédia PT, \"Escota\"", url: "https://pt.wikipedia.org/wiki/Escota", loc: "abertura do artigo" }],
    "amantilho": [{ txt: "Wikipédia PT, \"Amantilho\"", url: "https://pt.wikipedia.org/wiki/Amantilho", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Topping lift\"", url: "https://en.wikipedia.org/wiki/Topping_lift", loc: "abertura do artigo" }],
    "burro": [{ txt: "Wikipédia PT, \"Aparelho (náutica)\"", url: "https://pt.wikipedia.org/wiki/Aparelho_(n%C3%A1utica)", loc: "seção \"Manobra corrente\"" }, { txt: "Wikipedia EN, \"Boom vang\"", url: "https://en.wikipedia.org/wiki/Boom_vang", loc: "abertura do artigo" }],
    "garlindeu": [{ txt: "Wikipédia PT, \"Garlindéu\"", url: "https://pt.wikipedia.org/wiki/Garlind%C3%A9u", loc: "artigo inteiro" }, { txt: "Wikipedia EN, \"Glossary of nautical terms\", verbete \"gooseneck\"", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"gooseneck\"" }],
    "carril": [{ txt: "Wikipedia EN, \"Traveller (nautical fitting)\"", url: "https://en.wikipedia.org/wiki/Traveller_(nautical_fitting)", loc: "segundo parágrafo" }],
    "manivela-da-catraca": [{ txt: "Wikipedia EN, \"Winch\"", url: "https://en.wikipedia.org/wiki/Winch", loc: "abertura do artigo" }],
    "mordedor": [{ txt: "Wikipédia PT, \"Mordedor\"", url: "https://pt.wikipedia.org/wiki/Mordedor", loc: "abertura do artigo" }, { txt: "Infopédia (Dicionário da Língua Portuguesa, Porto Editora), \"mordedor\"", url: "https://www.infopedia.pt/dicionarios/lingua-portuguesa-aao/mordedor", loc: "verbete \"mordedor\", nome masculino 1" }],
    "moitao": [{ txt: "Dicionário Priberam da Língua Portuguesa, \"moitão\"", url: "https://dicionario.priberam.org/moit%C3%A3o", loc: "verbete \"moitão\" 1" }, { txt: "Dicionário Priberam da Língua Portuguesa, \"cadernal\"", url: "https://dicionario.priberam.org/cadernal", loc: "verbete \"cadernal\", acepção 2" }, { txt: "Wikipedia EN, \"Glossary of nautical terms\", verbete \"block\"", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"block\"" }],
    "manilha": [{ txt: "Wikipédia PT, \"Manilha\"", url: "https://pt.wikipedia.org/wiki/Manilha", loc: "abertura do artigo" }],
    "mosquetao": [{ txt: "Wikipedia EN, \"Carabiner\"", url: "https://en.wikipedia.org/wiki/Carabiner", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Carabiner\"", url: "https://en.wikipedia.org/wiki/Carabiner", loc: "seção \"Use\"" }],
    "pau-de-spinnaker": [{ txt: "Wikipedia EN, \"Spinnaker pole\"", url: "https://en.wikipedia.org/wiki/Spinnaker_pole", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Spinnaker pole\"", url: "https://en.wikipedia.org/wiki/Spinnaker_pole", loc: "seção \"Rigging\"" }],
    "gurupes": [{ txt: "Wikipédia PT, \"Gurupés\"", url: "https://pt.wikipedia.org/wiki/Gurup%C3%A9s", loc: "artigo inteiro" }, { txt: "Wikipedia EN, \"Bowsprit\"", url: "https://en.wikipedia.org/wiki/Bowsprit", loc: "abertura do artigo" }, { txt: "NORMAM-211/DPC (Marinha do Brasil)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "item 1.7 (Definições), \"Comprimento da embarcação\"" }],
    "biruta": [{ txt: "Dicionário Priberam da Língua Portuguesa, \"biruta\"", url: "https://dicionario.priberam.org/biruta", loc: "verbete \"biruta\", acepção 1" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Tell-tales\"" }],
    "enrolador": [{ txt: "Wikipedia EN, \"Roller furling\"", url: "https://en.wikipedia.org/wiki/Roller_furling", loc: "abertura do artigo" }],
    "vela-grande": [{ txt: "Wikipédia PT, \"Vela grande\"", url: "https://pt.wikipedia.org/wiki/Vela_grande", loc: "artigo inteiro" }],
    "vela-de-proa": [{ txt: "Wikipédia PT, \"Vela de estai\"", url: "https://pt.wikipedia.org/wiki/Vela_de_estai", loc: "abertura do artigo" }],
    "genoa": [{ txt: "Wikipédia PT, \"Genoa (vela)\"", url: "https://pt.wikipedia.org/wiki/Genoa_(vela)", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Genoa (sail)\"", url: "https://en.wikipedia.org/wiki/Genoa_(sail)", loc: "abertura do artigo" }],
    "buja": [{ txt: "Wikipedia EN, \"Jib\"", url: "https://en.wikipedia.org/wiki/Jib", loc: "abertura do artigo" }, { txt: "Wikipedia EN, \"Genoa (sail)\"", url: "https://en.wikipedia.org/wiki/Genoa_(sail)", loc: "seção \"Definition\"" }, { txt: "Infopédia (Dicionário da Língua Portuguesa, Porto Editora), \"bujarrona\"", url: "https://www.infopedia.pt/dicionarios/lingua-portuguesa-aao/bujarrona", loc: "verbete \"bujarrona\", acepção 1 (a buja brasileira)" }],
    "balao": [{ txt: "Wikipédia PT, \"Spinnaker\"", url: "https://pt.wikipedia.org/wiki/Spinnaker", loc: "abertura do artigo" }, { txt: "Wikipédia PT, \"Spinnaker\"", url: "https://pt.wikipedia.org/wiki/Spinnaker", loc: "seção \"Características\"" }],
    "gennaker": [{ txt: "Wikipedia EN, \"Gennaker\"", url: "https://en.wikipedia.org/wiki/Gennaker", loc: "abertura do artigo" }],
    "testa": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Wikipedia EN, \"Glossary of nautical terms\", verbete \"luff\"", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"luff\", acepção 1" }],
    "valuma": [{ txt: "Wikipédia PT, \"Valuma\"", url: "https://pt.wikipedia.org/wiki/Valuma", loc: "abertura do artigo" }],
    "esteira": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "abertura da seção \"Edges\"" }],
    "punho-da-adrica": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção sobre os cantos (reforços)" }],
    "punho-da-amura": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Tack\"" }],
    "punho-da-escota": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Clew\"" }],
    "tralha": [{ txt: "Infopédia (Dicionário da Língua Portuguesa, Porto Editora), \"tralha\"", url: "https://www.infopedia.pt/dicionarios/lingua-portuguesa-aao/tralha", loc: "verbete \"tralha\", acepção 2" }, { txt: "Wikipedia EN, \"Bolt rope\"", url: "https://en.wikipedia.org/wiki/Bolt_rope", loc: "abertura do artigo" }],
    "tala": [{ txt: "Wikipédia PT, \"Valuma\"", url: "https://pt.wikipedia.org/wiki/Valuma", loc: "segundo parágrafo" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Battens\"" }],
    "rizo": [{ txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Ângulos e lados\"" }, { txt: "Dicionário Priberam da Língua Portuguesa, \"rizar\"", url: "https://dicionario.priberam.org/rizar", loc: "verbete \"rizar\"" }, { txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Reefing points\"" }],
    "bolsa-da-vela": [{ txt: "Wikipedia EN, \"Sail components\"", url: "https://en.wikipedia.org/wiki/Sail_components", loc: "seção \"Draft\"" }, { txt: "Wikipédia PT, \"Vela (náutica)\"", url: "https://pt.wikipedia.org/wiki/Vela_(n%C3%A1utica)", loc: "seção \"Vento e vela\"" }],
    "enfunar": [{ txt: "Dicionário Priberam da Língua Portuguesa, \"enfunar\"", url: "https://dicionario.priberam.org/enfunar", loc: "verbete \"enfunar\", acepção 1" }],
    "panejar": [{ txt: "Dicionário Priberam da Língua Portuguesa, \"panejar\"", url: "https://dicionario.priberam.org/panejar", loc: "verbete \"panejar\", acepção 3" }, { txt: "Wikipedia EN, \"Glossary of nautical terms\", verbete \"luffing\"", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"luffing\", acepção 2" }],
  };
  T.forEach(function (x) { if (FV2[x.id] && !x.fonte) x.fonte = FV2[x.id]; });

  /* ===================== Fontes do lote 3 do glossário (velas, manobra e marinharia), 2026-10-09 =====================
     Cada verbete aponta para até três fontes consultadas: Marinha do Brasil (Manual de Navegação Vol. I e III, incl. o
     vocabulário PT/EN do Apêndice 5 do Vol. III; NORMAM-211), Dicionário Priberam e Wikipédia/Wikcionário (secundárias).
     O localizador traz a página, o item ou o verbete; o trecho literal de cada fonte está em
     research/_work/glossario_fontes_3.json. Só entram ids com fonte confirmada; "lançante" ficou sem fonte. Onde a fonte só traz a equivalência
     PT/EN (carangueja, volta, alça, seio, lais de guia) o localizador diz isso. "Arte Naval" (Fonseca, SDM)
     só existe à venda em e-book, sem PDF oficial aberto; não foi usada. */
  var FV3 = {
    "velame": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Cap. 2, tabela de tipos de embarcação, item 22 (Veleiro)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/velame", loc: "verbete \"velame\", acepção 1" }],
    "area-velica": [{ txt: "Wikipédia, Sail area-displacement ratio (fonte secundária)", url: "https://en.wikipedia.org/wiki/Sail_area-displacement_ratio", loc: "abertura do artigo" }, { txt: "Wikipédia, Sail area-displacement ratio (fonte secundária)", url: "https://en.wikipedia.org/wiki/Sail_area-displacement_ratio", loc: "seção do índice SA/D" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"canvas\"" }],
    "carangueja": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de casco e aparelho, p. A5-32" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"gaff\", acepção 1" }],
    "barlavento": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/barlavento", loc: "verbete \"barlavento\", acepção 1" }, { txt: "Wikipédia, Windward and leeward (fonte secundária)", url: "https://en.wikipedia.org/wiki/Windward_and_leeward", loc: "abertura do artigo" }],
    "sotavento": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/sotavento", loc: "verbete \"sotavento\", acepção 1" }, { txt: "Wikipédia, Windward and leeward (fonte secundária)", url: "https://en.wikipedia.org/wiki/Windward_and_leeward", loc: "abertura do artigo" }, { txt: "Wikipédia, Lee shore (fonte secundária)", url: "https://en.wikipedia.org/wiki/Lee_shore", loc: "abertura do artigo" }],
    "orcar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/or%C3%A7ar", loc: "verbete \"orçar\", acepção 4 (Marinha)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"luff\", acepção 3" }],
    "arribar": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 8, item 8.4 (Efeitos do vento e da corrente sobre a curva de giro), p. 8-5" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/arribar", loc: "verbete \"arribar\", acepção 2 (Marinha)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"fall off\"" }],
    "cambar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/cambar", loc: "verbete \"cambar\", acepção 3 (Náutica)" }, { txt: "Wikipédia, Tacking (sailing) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Tacking_(sailing)", loc: "abertura do artigo" }],
    "jaibe": [{ txt: "Wikipédia, Jibe (fonte secundária)", url: "https://en.wikipedia.org/wiki/Jibe", loc: "abertura do artigo" }, { txt: "Wikipédia, Jibe (fonte secundária)", url: "https://en.wikipedia.org/wiki/Jibe", loc: "seção sobre jaibes acidentais" }],
    "bordejar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bordejar", loc: "verbete \"bordejar\", acepção 1 (Marinha)" }, { txt: "Wikipédia, Tacking (sailing) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Tacking_(sailing)", loc: "abertura do artigo" }],
    "bordo": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bordo", loc: "verbete \"bordo\", acepção 1 (Náutica)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/bordo", loc: "verbete \"bordo\", acepção 3" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"tack\", acepção 1" }],
    "pontos-de-vela": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }, { txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }],
    "zona-morta": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"Sailing craft and the wind\" (no-go zone)" }],
    "bolina-cerrada": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"The points of sail\"" }, { txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }],
    "bolina-folgada": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"The points of sail\"" }],
    "vento-de-traves": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"The points of sail\"" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"beam reach\"" }],
    "largo": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"The points of sail\"" }, { txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }],
    "vento-em-popa": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"The points of sail\"" }, { txt: "Wikipédia, Jibe (fonte secundária)", url: "https://en.wikipedia.org/wiki/Jibe", loc: "seção sobre jaibes acidentais" }],
    "asa-de-pombo": [{ txt: "Wikipédia, Wing and wing (fonte secundária)", url: "https://en.wikipedia.org/wiki/Wing_and_wing", loc: "abertura do artigo" }, { txt: "Wikipédia, Wing and wing (fonte secundária)", url: "https://en.wikipedia.org/wiki/Wing_and_wing", loc: "seção \"Description\"" }, { txt: "Wikipédia, Wing and wing (fonte secundária)", url: "https://en.wikipedia.org/wiki/Wing_and_wing", loc: "seção \"Description\"" }],
    "aproado": [{ txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"in irons\"" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo 4-B, item 6 (Procedimentos para fundear a embarcação)" }, { txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "seção \"Sailing craft and the wind\"" }],
    "cacar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/ca%C3%A7ar", loc: "verbete \"caçar\", acepção 6 (Náutica)" }, { txt: "Wikipédia, Sheet (sailing) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Sheet_(sailing)", loc: "seção \"Fore-and-aft rigs\"" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"trim\", acepção 2" }],
    "folgar": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), manobra de atracação, item \"Ease one\", p. A5-12" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/folgar", loc: "verbete \"folgar\", acepção 5" }],
    "mareacao": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/marear", loc: "verbete \"marear\", acepção 2 (Náutica)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/marea%C3%A7%C3%A3o", loc: "verbete \"mareação\", acepção 1" }],
    "aquartelar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/aquartelar", loc: "verbete \"aquartelar\", acepção 5 (Marinha)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"aback\"" }, { txt: "Wikipédia, Heaving to (fonte secundária)", url: "https://en.wikipedia.org/wiki/Heaving_to", loc: "seção \"Method\"" }],
    "capear": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, cap. 42, item 42.4.a (Manobra do navio com mau tempo), p. 42-22" }, { txt: "Wikipédia, Heaving to (fonte secundária)", url: "https://en.wikipedia.org/wiki/Heaving_to", loc: "seção \"Method\"" }, { txt: "Wikipédia, Heaving to (fonte secundária)", url: "https://en.wikipedia.org/wiki/Heaving_to", loc: "seção \"Method\"" }],
    "fundear": [{ txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo 4-B, item 6 (Procedimentos para fundear a embarcação)" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/fundear", loc: "verbete \"fundear\", acepção 2 (Náutica)" }],
    "suspender": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de fundeio, p. A5-21" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, cap. 42 (Navegação com mau tempo), p. 42-20" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"weigh anchor\"" }],
    "garrar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/garrar", loc: "verbete \"garrar\", acepção 1 (Náutica)" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de fundeio, p. A5-21" }],
    "unhar": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de fundeio, p. A5-21" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/unhar", loc: "verbete \"unhar\", acepção 5 (Náutica)" }],
    "atracar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/atracar", loc: "verbete \"atracar\", acepção 1" }],
    "desatracar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/desatracar", loc: "verbete \"desatracar\", acepção 1" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de atracação, p. A5-12" }],
    "amarrar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/amarrar", loc: "verbete \"amarrar\", acepção 1" }],
    "poita": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 13, equipamento de fundeio de uma boia, p. 13-8" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/poita", loc: "verbete \"poita\"" }],
    "espringue": [{ txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"spring\"" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de atracação, p. A5-14" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de atracação, p. A5-13" }],
    "defensa": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/defensa", loc: "verbete \"defensa\", acepção 2 (Náutica)" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de atracação, p. A5-13" }, { txt: "Wikipédia, Fender (boating) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Fender_(boating)", loc: "abertura do artigo" }],
    "croque": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/croque", loc: "verbete \"croque\", acepção 3 (Marinha)" }, { txt: "Wikipédia, Boat hook (fonte secundária)", url: "https://en.wikipedia.org/wiki/Boat_hook", loc: "abertura do artigo" }],
    "abatimento": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 5, item 5.5 (Termos empregados na navegação estimada), p. 5-6" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, cap. 42, mau tempo, p. 42-22" }, { txt: "Wikipédia, Leeway (fonte secundária)", url: "https://en.wikipedia.org/wiki/Leeway", loc: "abertura do artigo" }],
    "deriva": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/deriva", loc: "verbete \"deriva\", acepção 1" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de manobra, p. A5-64" }],
    "seguimento": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 8, item 8.9 (Fundeio de precisão), p. 8-19" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"way\"" }],
    "guinar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/guinar", loc: "verbete \"guinar\", acepção 2" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 1, item 1.2.2 (Plano de viagem), p. 1-4" }],
    "governar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/governar", loc: "verbete \"governar\", acepção 3" }],
    "timoneiro": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/timoneiro", loc: "verbete \"timoneiro\", acepção 1 (Náutica)" }, { txt: "Wikipédia, Helmsman (fonte secundária)", url: "https://en.wikipedia.org/wiki/Helmsman", loc: "abertura do artigo" }],
    "vento-real": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, cap. 14 (Navegação por radar), exemplo do diagrama de velocidades do vento, p. 14-75" }],
    "vento-aparente": [{ txt: "Wikipédia, Point of sail (fonte secundária)", url: "https://en.wikipedia.org/wiki/Point_of_sail", loc: "abertura do artigo" }, { txt: "Wikipédia, Apparent wind (fonte secundária)", url: "https://en.wikipedia.org/wiki/Apparent_wind", loc: "seção \"Definition of apparent wind\"" }],
    "reduzir-pano": [{ txt: "Wikipédia, Reefing (fonte secundária)", url: "https://en.wikipedia.org/wiki/Reefing", loc: "abertura do artigo" }, { txt: "Wikipédia, Reefing (fonte secundária)", url: "https://en.wikipedia.org/wiki/Reefing", loc: "seção \"Roller\"" }],
    "icar": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/i%C3%A7ar", loc: "verbete \"içar\", acepção 1" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"strike\" (oposto: arriar)" }],
    "largar": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), vocabulário de atracação, p. A5-12" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/largar", loc: "verbete \"largar\", acepção 5 (Marinha)" }],
    "cabo": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/cabo", loc: "verbete \"cabo\", acepção 7 (Náutica)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"line\"" }],
    "chicote": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/chicote", loc: "verbete \"chicote\", acepção 5 (Marinha)" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"bitter end\"" }],
    "seio": [{ txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/seio", loc: "verbete \"seio\", acepção 14 (Marinha)" }, { txt: "Wikipédia, Bight (knot) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Bight_(knot)", loc: "abertura do artigo" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), nós, p. A5-63" }],
    "firme": [{ txt: "Wikcionário PT, firme (fonte secundária)", url: "https://pt.wiktionary.org/wiki/firme", loc: "verbete \"firme\" (Náutica)" }, { txt: "Wikipédia, Glossary of nautical terms (M–Z) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete \"standing part\"" }],
    "alca": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), nós e costuras, p. A5-63" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"bight\", acepção 1" }, { txt: "Wikipédia, Bowline (fonte secundária)", url: "https://en.wikipedia.org/wiki/Bowline", loc: "abertura do artigo" }],
    "volta": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), nós e costuras, p. A5-63" }, { txt: "Wikipédia, Glossary of nautical terms (A–L) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(A%E2%80%93L)", loc: "verbete \"hitch\"" }],
    "no": [{ txt: "Wikipédia, Knot (fonte secundária)", url: "https://en.wikipedia.org/wiki/Knot", loc: "abertura do artigo" }, { txt: "Dicionário Priberam da Língua Portuguesa", url: "https://dicionario.priberam.org/n%C3%B3", loc: "verbete \"nó\", acepção 1" }],
    "lais-de-guia": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Apêndice 5 (Noções de Inglês Técnico-Marítimo), nós e costuras, p. A5-63" }, { txt: "Wikipédia, Bowline (fonte secundária)", url: "https://en.wikipedia.org/wiki/Bowline", loc: "abertura do artigo" }],
  };
  T.forEach(function (x) { if (FV3[x.id] && !x.fonte) x.fonte = FV3[x.id]; });
  /* ===================== Fontes do lote 4 do glossário (marinharia e navegação), 2026-10-09 =====================
     Cada verbete aponta para o trecho que sustenta a definição: Arte Naval (Fonseca, SDM/Marinha, capítulos publicados
     pela DPC), Manual de Navegação Vol. I e III (DHN), NORMAM-211/DPC e Carta 12000. Priberam e Wikipédia (fontes
     secundárias, marcadas como tal) só entram onde a Marinha não define o termo. O trecho literal de cada fonte está em
     research/_work/glossario_fontes_4.json. */
  var FV4 = {
    "no-de-oito": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.5 (volta de fiador, o nó em forma de oito), p. 381" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.5, p. 381" }],
    "no-direito": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.37 (nó direito) e 8.38 (nó torto), p. 392" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.38, p. 392" }],
    "volta-do-fiel": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.7 (volta de fiel singela), p. 382" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.57 (termos referentes aos cabos), verbete \"Fiéis\", p. 362" }],
    "volta-redonda-e-dois-cotes": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.9 (volta redonda e cotes), p. 382" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.9, p. 382" }],
    "no-de-escota": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.39 (nó de escota singelo) e 8.40 (dobrado), p. 392" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.40, p. 393" }],
    "volta-de-cunho": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.144 (dar volta a um cabo num cunho), p. 450" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.144, p. 451" }, { txt: "Wikipédia (EN), Cleat hitch (fonte secundária)", url: "https://en.wikipedia.org/wiki/Cleat_hitch", loc: "Cleat hitch, seção \"Tying\"" }],
    "falcaca": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.46 (falcaça), p. 395" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.22 (cabos sintéticos, náilon), p. 320" }],
    "costura": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.78 (costuras em cabos de fibra), p. 408" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "art. 8.78.b (vantagens das costuras), p. 409" }],
    "aduchar": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.13 (como colher um cabo), p. 311" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Apêndice VI (Minidicionário de termos náuticos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Apendice_VI_2005.pdf", loc: "verbete \"Aduchar\"" }],
    "tesar": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.57 (termos referentes aos cabos), verbete \"Tesar\", p. 362" }],
    "solecar": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.57 (termos referentes aos cabos), verbete \"Solecar\", p. 362" }],
    "bitola": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "Cap. 7, Seção B (cabos de fibra sintética), após o art. 7.23, p. 324" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.9 (medida dos cabos de fibra natural), p. 308" }],
    "ancora": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 1", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap1_2005_0.pdf", loc: "art. 1.152 (âncora), p. 41" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 10 (Aparelho de fundear e suspender)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap10_2005.pdf", loc: "art. 10.1, p. 519" }],
    "amarra": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 10 (Aparelho de fundear e suspender)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap10_2005.pdf", loc: "art. 10.11.a (amarra), p. 528" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 12 (Manobra do navio)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap12_2005.pdf", loc: "art. 12.42.2 (aproximação para o fundeio), p. 624" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 10 (Aparelho de fundear e suspender)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap10_2005.pdf", loc: "art. 10.11.a, p. 528" }],
    "arinque": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 10 (Aparelho de fundear e suspender)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap10_2005.pdf", loc: "art. 10.28.a (bóia de arinque), p. 545" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 10 (Aparelho de fundear e suspender)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap10_2005.pdf", loc: "art. 10.28.d, p. 545" }, { txt: "Wikipédia (EN), Anchor (fonte secundária)", url: "https://en.wikipedia.org/wiki/Anchor", loc: "Anchor, seção sobre o içamento (trip line)" }],
    "espia": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.57 (termos referentes aos cabos), verbete \"Espia\", p. 362" }],
    "retinida": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 12 (Manobra do navio)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap12_2005.pdf", loc: "art. 12.24 (notas sobre o emprego das espias), p. 604" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "art. 4.15 (dotação de boias salva-vidas), alínea \"Retinida\", p. 4-8" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 7 (Cabos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap7_2005.pdf", loc: "art. 7.27, p. 326" }],
    "navegacao-estimada": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 5.1 (conceito de navegação estimada), p. 5-1" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 5.1, p. 5-2" }],
    "posicao-estimada": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 5.1, p. 5-1" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 5.3 (regras para a navegação estimada), p. 5-3" }],
    "ponto": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.3 (determinação da posição no mar), p. 4-10" }],
    "linha-de-posicao": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.2, p. 4-4" }],
    "alinhamento": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.2.a (LDP alinhamento), p. 4-5" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.2.a, p. 4-5" }],
    "triangulo-de-incerteza": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.5.4 (triângulo de incerteza), p. 4-28" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.5.4, p. 4-28" }],
    "marcacao": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.8 (marcação verdadeira), p. 1-16" }],
    "marcacao-relativa": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.8 (marcação relativa), p. 1-16" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.8, p. 1-17" }],
    "rumo": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.8 (a direção no mar. Rumos e marcações), p. 1-14" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.8, p. 1-16" }],
    "rumo-verdadeiro": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.5 (conversão de rumos e marcações), exemplo 1 (e), p. 3-18" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.5, p. 3-15" }],
    "rumo-magnetico": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.1 (agulha magnética: descrição), p. 3-2" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.5, exemplo 4 (b), p. 3-17" }],
    "rumo-da-agulha": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.4.b (perturbações da agulha; desvios), p. 3-9" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.5, exemplo 2 (b), p. 3-16" }],
    "declinacao-magnetica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.3.b (conceito de declinação magnética), p. 3-5" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.3.b, p. 3-6" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.5, exemplo 2, p. 3-16" }],
    "desvio-da-agulha": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.4.b (desvio da agulha), p. 3-9" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.4.b, p. 3-10" }],
    "agulha": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.7 (agulhas magnéticas de bordo), p. 3-20" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.7, p. 3-19" }],
    "linha-de-fe": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 3.2.1, p. 3-2" }],
    "rosa-dos-ventos": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.6.1.e (rosa-dos-ventos ou rosa-dos-rumos), p. 2-31" }],
    "milha-nautica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.7.1 (a milha náutica), p. 1-12" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.7.1, p. 1-12" }, { txt: "Carta Náutica 12000 (INT 1), 5ª ed. (CHM/DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf", loc: "símbolo B 45 (milha náutica)" }],
    "no-velocidade": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.9 (a velocidade no mar), p. 1-18" }],
    "singradura": [{ txt: "Priberam, Dicionário (verbete \"singradura\")", url: "https://dicionario.priberam.org/singradura", loc: "verbete \"singradura\", acepção 1 (Marinha)" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "art. 4.6.2, p. 4-3" }],
    "derrota": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 4.1 (planejamento e traçado da derrota), p. 4-2" }],
    "ortodromica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.7.2 (ortodromia e loxodromia), p. 1-13" }],
    "loxodromica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.7.2 (ortodromia e loxodromia), p. 1-13" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.4.1 (a projeção de Mercator), p. 2-13" }],
    "waypoint": [{ txt: "Wikipédia (EN), Waypoint (fonte secundária)", url: "https://en.wikipedia.org/wiki/Waypoint", loc: "seção de abertura" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.7.1 (sistemas eletrônicos de exibição de cartas), p. 11-43" }],
    "latitude": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.6 (sistema de coordenadas geográficas), p. 1-11" }],
    "longitude": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.6, p. 1-11" }],
    "paralelo": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.5 (principais linhas, pontos e planos do globo terrestre), p. 1-10" }],
    "meridiano": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.5, p. 1-11" }],
    "equador": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.5, p. 1-10" }],
    "carta-nautica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.6.1 (a carta náutica), p. 2-26" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.6.1, p. 2-25" }],
    "projecao-de-mercator": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.4.3 (vantagens da projeção de Mercator), p. 2-10" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.4.3.a, p. 2-10" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 1.7.1, p. 1-12" }],
    "escala-da-carta": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.6.2 (escala da carta), p. 2-27" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 2.1, nota de rodapé 1, p. 2-2" }],
    "gnss": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "item 37.1 (introdução à navegação por satélites), p. 37-2" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "item 37.1, p. 37-2" }],
    "radar": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 14.1.2 (princípio de funcionamento), p. 14-3" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 14.2.3.a (alvos no mar: navios), p. 14-30" }],
    "ais": [{ txt: "Wikipédia (EN), Automatic identification system (fonte secundária)", url: "https://en.wikipedia.org/wiki/Automatic_identification_system", loc: "seção de abertura" }, { txt: "Wikipédia (EN), Automatic identification system (fonte secundária)", url: "https://en.wikipedia.org/wiki/Automatic_identification_system", loc: "seção \"Class B units\"" }],
    "ecobatimetro": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.5.2.c (medição de profundidades com o ecobatímetro), p. 11-35" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.5.2.a (princípio fundamental), p. 11-33" }],
    "odometro": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.3.1 (odômetros e velocímetros), p. 11-9" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.3.1, p. 11-9" }],
    "plotter": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.7.1 (sistema eletrônico de exibição de cartas náuticas), p. 11-41" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "item 11.7.1 (ECS), p. 11-42" }],
  };
  T.forEach(function (x) { if (FV4[x.id] && !x.fonte) x.fonte = FV4[x.id]; });
  /* ===================== Fontes do lote 5 (navegação, carta, astronomia, marés, luzes) =====================
     Cada verbete aponta para um trecho literal conferido por texto no Manual de Navegação (DHN, Vols. I a III), na
     Lista de Faróis (DHN, 40ª ed.), no site do CHM ou, onde a Marinha não define o termo (piloto automático, piloto de
     vento, número do Cruzeiro do Sul, valor da equação do tempo), em fonte secundária identificada como tal.
     Os trechos literais estão em research/_work/glossario_fontes_5.json. */
  var FV5 = {
    "piloto-automatico": [{ txt: "Wikipédia, Self-steering gear (fonte secundária)", url: "https://en.wikipedia.org/wiki/Self-steering_gear", loc: "Seção \"Electronic self-steering\"" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 15, RIPEAM Regra 5, p. 15-4" }],
    "piloto-de-vento": [{ txt: "Wikipédia, Self-steering gear (fonte secundária)", url: "https://en.wikipedia.org/wiki/Self-steering_gear", loc: "Seção \"Mechanical self-steering\"" }],
    "compasso-de-navegacao": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 11, item 11.6.2, p. 11-38" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 2, Apêndice 2A, p. 2-59" }],
    "regua-paralela": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 11, item 11.6.1, p. 11-36 e 11-37" }],
    "rumo-no-fundo": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 1, p. 1-15" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 1, p. 1-18" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 37, p. 37-13" }],
    "corrente": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 5, item 5.5, p. 5-6" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 5, item 5.4, p. 5-5" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-29" }],
    "triangulo-de-corrente": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 5, item 5.6, p. 5-8" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 5, item 5.5, p. 5-5" }],
    "mare": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.2, p. 10-2" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.4, p. 10-5 e 10-6" }],
    "preamar": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-8" }],
    "baixa-mar": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-8" }],
    "enchente": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-8" }],
    "vazante": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-8" }],
    "sizigia": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.3, p. 10-4" }],
    "quadratura": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.3, p. 10-4" }],
    "corrente-de-mare": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.2.1, p. 10-27" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.2, p. 10-28" }],
    "tabua-das-mares": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-13" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9, p. 10-13" }, { txt: "CHM, Tábuas de Maré", url: "https://www.marinha.mil.br/chm/tabuas-de-mare", loc: "Página \"Tábuas de Maré\" (CHM)" }],
    "isobata": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 4, p. 4-8" }],
    "carta-12000": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 12, item 12.3, p. 12-7" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 2, p. 2-37" }],
    "avisos-aos-navegantes": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 12, item 12.11, p. 12-31" }],
    "lista-de-farois": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 12, item 12.5, p. 12-10" }],
    "roteiro": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 12, item 12.4, p. 12-8" }],
    "farol": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.2, p. 13-3" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.2, p. 13-3" }],
    "caracteristica-da-luz": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.5 b, p. 13-13" }],
    "lampejo": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.5 b, p. 13-13" }, { txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., Introdução, item 3.3, p. XIV" }],
    "ocultacao": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.5 b, p. 13-13" }, { txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., Introdução, item 3.3, p. XIV" }],
    "isofasica": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 13, item 13.2.5 b, p. 13-13" }],
    "luz-rapida": [{ txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., Introdução, item 3.3, p. XV" }, { txt: "Lista de Faróis, 40ª ed. (DHN)", url: "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf", loc: "Lista de Faróis 40ª ed., Introdução, item 3.3, p. XV" }],
    "apartamento": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 17, p. 17-6" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 33, item 33.2, p. 33-7" }],
    "navegacao-por-paralelo": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 16, item 16.2, p. 16-17" }],
    "sextante": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 21, item 21.2.1, p. 21-2" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 21, p. 21-6" }],
    "altura": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.2, p. 18-9" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 22, item 22.2, p. 22-2" }],
    "distancia-zenital": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.2, p. 18-9" }],
    "azimute": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.2, p. 18-9" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, p. 19-1" }],
    "declinacao-do-astro": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.2, p. 18-2" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 23, item 23.2, p. 23-2" }],
    "angulo-horario": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.2, p. 18-2" }],
    "passagem-meridiana": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 25, item 25.1, p. 25-1" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 25, item 25.1, p. 25-2" }],
    "zenite": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.1, p. 18-7" }],
    "nadir": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.1, p. 18-7" }],
    "horizonte": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 18, item 18.4.1, p. 18-7" }],
    "depressao-do-horizonte": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 22, item 22.2 b, p. 22-2 e 22-3" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 22, item 22.2 b, p. 22-2" }],
    "esfera-celeste": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 17, item 17.2.2, p. 17-8" }],
    "equador-celeste": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 17, item 17.2.2, p. 17-8" }],
    "polo-celeste": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 17, item 17.2.2, p. 17-8" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 25, item 25.1, p. 25-2" }],
    "reta-de-altura": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 16, item 16.2, p. 16-24" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 16, item 16.2, p. 16-24" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 27, p. 27-3" }],
    "triangulo-de-posicao": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 20, item 20.3, p. 20-3" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 20, item 20.2, p. 20-2" }],
    "posicao-geografica-do-astro": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 27, p. 27-3" }],
    "hora-legal": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, p. 19-7" }],
    "fuso-horario": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, p. 19-7" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, p. 19-9" }],
    "hora-media-de-greenwich": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, p. 19-6" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, item 19.11.2, p. 19-23" }],
    "equacao-do-tempo": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, item 19.8, p. 19-16" }, { txt: "Wikipédia, Equation of time (fonte secundária)", url: "https://en.wikipedia.org/wiki/Equation_of_time", loc: "Seção \"Introduction\"" }],
    "cronometro": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 21, item 21.3.1, p. 21-19" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 21, p. 21-28" }],
    "cruzeiro-do-sul": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 30, p. 30-13" }, { txt: "Wikipédia, South Celestial Pole (fonte secundária)", url: "https://en.wikipedia.org/wiki/South_Celestial_Pole", loc: "Seção \"Method one: The Southern Cross\"" }],
    "pressao-atmosferica": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.1, p. 45-9" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 3, p. A3-7" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 41, p. 41-84" }],
  };
  T.forEach(function (x) { if (FV5[x.id] && !x.fonte) x.fonte = FV5[x.id]; });
  /* ===================== Fontes do lote 6 (meteorologia, segurança, rádio, legislação, prova) =====================
     Cada verbete aponta para um trecho literal conferido por texto no Manual de Navegação (DHN, Vol. III, caps. 42, 43 e 45),
     na NORMAM-701/DHN (meteorologia marítima), na NORMAM-201 e 211/DPC, nas cartas de serviços do CHM e da DHN, nas páginas da
     Marinha (SALVAMAR, Cartas Piloto), no material da Anatel, nas Offshore Special Regulations da World Sailing e, onde a Marinha
     não define o termo, em dicionário (Michaelis), Wikipédia (identificada como fonte secundária) ou guia de elaboração de itens.
     Os trechos literais estão em research/_work/glossario_fontes_6.json. */
  var FV6 = {
    "barometro": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.1, p. 45-10" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.5.6, p. 45-87" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.5.6, Tabela 45.3, p. 45-88" }],
    "isobara": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.1, p. 45-14" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-29" }],
    "baixa-pressao": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.1, p. 45-54" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.2, p. 45-55" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-29" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-29" }],
    "alta-pressao": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.1, p. 45-53" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.1, p. 45-53" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-29" }],
    "frente-fria": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 a, p. 45-64" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 a, p. 45-64" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.2, p. 45-61" }],
    "frente-quente": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 b, p. 45-65" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 b, p. 45-65" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 b, p. 45-65" }],
    "ciclone-extratropical": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "Anexo D, item 1 b), p. D-1" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.2, p. 45-60" }],
    "ciclone-tropical": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "Anexo D, item 1 d), p. D-2" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.2 a, p. 45-57" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, ciclones tropicais do Atlântico Norte, p. 42-35" }, { txt: "NOAA/NHC, Tropical cyclone climatology", url: "https://www.nhc.noaa.gov/climo/", loc: "seção sobre a temporada de furacões" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-42" }],
    "alisios": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }],
    "zcit": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.1 c, p. 45-16" }],
    "asas": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.4, p. 45-72" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.4, p. 45-72" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.1.3, p. 45-8" }],
    "beaufort": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 1.3 d), p. 1-2" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "Anexo B (Escala Beaufort), força 4, p. B-1" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "Anexo B (Escala Beaufort), força 7, p. B-1" }],
    "rajada": [{ txt: "Wikipédia PT, Lufada (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Lufada", loc: "introdução do artigo" }, { txt: "Wikipedia EN, Wind gust (fonte secundária)", url: "https://en.wikipedia.org/wiki/Wind_gust", loc: "introdução do artigo" }],
    "calmaria": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "Anexo B (Escala Beaufort), força 0, p. B-1" }, { txt: "Michaelis On-line, verbete «calmaria»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/calmaria/", loc: "verbete «calmaria», acepção 1" }],
    "borrasca": [{ txt: "Michaelis On-line, verbete «borrasca»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/borrasca/", loc: "verbete «borrasca», acepção 1" }, { txt: "Wikipedia EN, Squall (fonte secundária)", url: "https://en.wikipedia.org/wiki/Squall", loc: "introdução do artigo" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.4, p. 45-70" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.4, p. 45-71" }],
    "cumulonimbo": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.5, p. 45-44" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.5, p. 45-44" }, { txt: "Wikipédia PT, Cumulonimbo (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Cumulonimbo", loc: "seção sobre o desenvolvimento da nuvem" }],
    "nevoeiro": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.6 a, p. 45-45" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.6 a, p. 45-46" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.6 a, p. 45-48" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.6 a, p. 45-46" }],
    "marulho": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.6, p. 45-90" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.6, p. 45-91" }],
    "vaga": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.6, p. 45-90" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.6, p. 45-91" }],
    "onda": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-4" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-4" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-4" }],
    "altura-significativa": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-9" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 1.3 f), p. 1-2" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, tabela de relação com a altura significante, p. 42-9" }],
    "pista": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, p. 42-4" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.6, p. 45-90" }, { txt: "Wikipedia EN, Fetch (geography) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Fetch_(geography)", loc: "introdução do artigo" }],
    "ressaca": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 b) IV), p. 2-2" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "item 7.3.1 (produtos do Serviço Meteorológico Marinho, avisos de mau tempo)" }],
    "brisa-maritima": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-38" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-38" }],
    "rondar": [{ txt: "Michaelis On-line, verbete «rondar»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/rondar/", loc: "verbete «rondar», acepção 8" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.3 a, p. 45-64" }],
    "refrescar": [{ txt: "Michaelis On-line, verbete «refrescar»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/refrescar/", loc: "verbete «refrescar», acepção 6" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.3.2, p. 45-61" }],
    "lei-de-buys-ballot": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-28" }, { txt: "Wikipedia EN, Buys Ballot's law (fonte secundária)", url: "https://en.wikipedia.org/wiki/Buys_Ballot's_law", loc: "introdução do artigo" }],
    "forca-de-coriolis": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-27" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.4, p. 45-27" }],
    "carta-sinotica": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.5.4, p. 45-81" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 c), p. 2-2" }],
    "aviso-de-mau-tempo": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 b), p. 2-1" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 b) I), p. 2-1" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 b) II), p. 2-2" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "item 7.3.1 (produtos do Serviço Meteorológico Marinho)" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.5.2, p. 45-80" }],
    "meteoromarinha": [{ txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.2 a), p. 2-1" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.3 d), p. 2-2" }, { txt: "NORMAM-701/DHN (Meteorologia Marítima, 2023)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/normam/NORMAM-701.pdf", loc: "item 2.1, p. 2-1" }],
    "grib": [{ txt: "Wikipedia EN, GRIB (fonte secundária)", url: "https://en.wikipedia.org/wiki/GRIB", loc: "introdução do artigo" }, { txt: "Wikipedia EN, GRIB (fonte secundária)", url: "https://en.wikipedia.org/wiki/GRIB", loc: "introdução do artigo" }],
    "pilot-charts": [{ txt: "Marinha do Brasil, CHM: Cartas Piloto", url: "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3", loc: "página «Cartas Piloto»" }, { txt: "NOAA/NHC, Marine Climatology", url: "https://www.nhc.noaa.gov/marine/outreach/marine_climo.php", loc: "página «Marine Climatology»" }],
    "abalroamento": [{ txt: "Michaelis On-line, verbete «abalroamento»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/abalroamento/", loc: "verbete «abalroamento», acepção 4" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 45, item 45.2.6 a, p. 45-46" }],
    "palamenta": [{ txt: "NORMAM-201/DPC (Mar Aberto)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-201.pdf", loc: "Anexo 10-B, item 16, p. 10-B-3" }, { txt: "NORMAM-211/DPC (Esporte e Recreio)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo 5-A, item 2.1 o) II), p. 5-A-6" }, { txt: "46 CFR 160.151-21 (EUA, equipamento de balsas SOLAS conforme o LSA Code da IMO)", url: "https://www.ecfr.gov/current/title-46/chapter-I/subchapter-Q/part-160/subpart-160.151/section-160.151-21", loc: "§ 160.151-21, itens (b), (j), (k), (r), (s), (y) e (z): faca, sinais pirotécnicos, rações, água, kit de reparo e bomba" }],
    "salvatagem": [{ txt: "NORMAM-211/DPC (Esporte e Recreio)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo 5-A, item 2.1 o) II), p. 5-A-6" }, { txt: "NORMAM-211/DPC (Esporte e Recreio)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "item 4.8, p. 4-5" }],
    "linha-de-vida": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf", loc: "seção 1 (definições), p. 10" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf", loc: "regra 4.04.2, p. 28" }, { txt: "RYA, Man overboard (segurança em água fria)", url: "https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/", loc: "seção sobre prevenção" }],
    "hipotermia": [{ txt: "Wikipédia PT, Hipotermia (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Hipotermia", loc: "introdução do artigo" }, { txt: "Wikipédia PT, Hipotermia (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Hipotermia", loc: "introdução do artigo" }, { txt: "RYA, Man overboard (segurança em água fria)", url: "https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/", loc: "seção sobre recuperação a bordo" }],
    "enjoo": [{ txt: "Wikipedia EN, Motion sickness (fonte secundária)", url: "https://en.wikipedia.org/wiki/Motion_sickness", loc: "introdução do artigo" }, { txt: "Wikipedia EN, Motion sickness (fonte secundária)", url: "https://en.wikipedia.org/wiki/Motion_sickness", loc: "introdução do artigo" }, { txt: "Michaelis On-line, verbete «enjoo»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/enjoo/", loc: "verbete «enjoo», acepção 3" }],
    "triangulo-do-fogo": [{ txt: "Wikipédia PT, Triângulo do fogo (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Triângulo_do_fogo", loc: "introdução do artigo" }, { txt: "Wikipédia PT, Triângulo do fogo (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Triângulo_do_fogo", loc: "introdução do artigo" }, { txt: "Wikipedia EN, Fire triangle (fonte secundária)", url: "https://en.wikipedia.org/wiki/Fire_triangle", loc: "introdução do artigo" }],
    "ancora-flutuante": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, item d (âncora flutuante), p. 42-29" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, item d, p. 42-29" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 42, item d, p. 42-29" }, { txt: "Wikipedia EN, Sea anchor (fonte secundária)", url: "https://en.wikipedia.org/wiki/Sea_anchor", loc: "introdução do artigo" }],
    "osr": [{ txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf", loc: "capa, p. 1" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf", loc: "regra 2.01.1 (Category 0), p. 12" }, { txt: "World Sailing, Offshore Special Regulations 2026-2027", url: "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf", loc: "regra 2.01.2 (Category 1), p. 12" }],
    "vhf": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.1.2 (noções de propagação), p. 13" }, { txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.1.9.4 (escuta obrigatória), p. 19" }, { txt: "Wikipedia EN, Marine VHF radio (fonte secundária)", url: "https://en.wikipedia.org/wiki/Marine_VHF_radio", loc: "introdução do artigo" }],
    "alfabeto-fonetico": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.1.9.1, p. 15" }, { txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.1.9.1, p. 16" }],
    "salvamar": [{ txt: "Marinha do Brasil, SALVAMAR BRASIL: Estrutura SAR", url: "https://www.marinha.mil.br/salvamarbrasil/content/estrutura-sar", loc: "página «Estrutura SAR»" }, { txt: "Marinha do Brasil, SALVAMAR BRASIL: Estrutura SAR", url: "https://www.marinha.mil.br/salvamarbrasil/content/estrutura-sar", loc: "página «Estrutura SAR»" }, { txt: "Marinha do Brasil, SALVAMAR BRASIL: Histórico", url: "https://www.marinha.mil.br/salvamarbrasil/content/historico", loc: "página «Histórico», seção «SAR no Brasil»" }],
    "cospas-sarsat": [{ txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.2.5, p. 23" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice sobre o GMDSS, p. 47-4" }, { txt: "Wikipedia EN, Cospas-Sarsat (fonte secundária)", url: "https://en.wikipedia.org/wiki/Cospas-Sarsat", loc: "introdução do artigo" }],
    "quarto-de-servico": [{ txt: "Michaelis On-line, verbete «quarto»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/quarto/", loc: "verbete «quarto», acepção 7" }, { txt: "Wikipedia EN, Watchkeeping (fonte secundária)", url: "https://en.wikipedia.org/wiki/Watchkeeping", loc: "seção «Watch systems»" }],
    "quarto-de-cao": [{ txt: "Wikipedia EN, Dog watch (fonte secundária)", url: "https://en.wikipedia.org/wiki/Dog_watch", loc: "introdução do artigo" }, { txt: "Wikipedia EN, Dog watch (fonte secundária)", url: "https://en.wikipedia.org/wiki/Dog_watch", loc: "introdução do artigo" }],
    "briefing": [{ txt: "US Sailing / Cruising Club of America, Skipper's Pre-Departure Safety Briefing Checklist", url: "https://www.ussailing.org/wp-content/uploads/2024/03/Capts.-Safety-Briefing-Culture-of-Safety.pdf", loc: "item 4 (localização e uso dos equipamentos de segurança)" }, { txt: "RYA, Man overboard (segurança em água fria)", url: "https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/", loc: "seção sobre prevenção" }, { txt: "RYA, Passage planning", url: "https://www.rya.org.uk/water-safety/passage-planning-and-navigation/passage-planning/", loc: "seção sobre o plano de viagem" }, { txt: "Michaelis On-line, verbete «briefing»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/briefing/", loc: "verbete «briefing», acepção 1" }],
    "normam": [{ txt: "DPC/DHN, Comunicado de reorganização das NORMAM (2023)", url: "https://www.marinha.mil.br/cfpa/sites/www.marinha.mil.br.cfpa/files/2025-02/Comunicado%20Reorganiza%C3%A7%C3%A3o%20NORMAM.pdf", loc: "texto do comunicado" }, { txt: "Carta de Serviços ao Usuário da DHN (2019)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Carta-de-Servicos%20ao%20Usuario-DHN%20-ALT2019.pdf", loc: "tarefas da DHN, inciso VIII" }, { txt: "NORMAM-211/DPC (Esporte e Recreio)", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "folha de rosto da NORMAM-211/DPC" }],
    "dhn": [{ txt: "Carta de Serviços ao Usuário da DHN (2019)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Carta-de-Servicos%20ao%20Usuario-DHN%20-ALT2019.pdf", loc: "apresentação" }, { txt: "Carta de Serviços ao Usuário da DHN (2019)", url: "https://assets.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Carta-de-Servicos%20ao%20Usuario-DHN%20-ALT2019.pdf", loc: "tarefas da DHN, inciso VI" }],
    "chm": [{ txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "apresentação" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "tarefas do CHM, inciso XXII" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "tarefas do CHM, inciso IV" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "tarefas do CHM, inciso V" }, { txt: "Carta de Serviços ao Usuário do CHM (2026)", url: "https://assets.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/CARTA%20DE%20SERVICOS%20AO%20USUARIO_CHM-2026%20-%20APROVADA.pdf", loc: "item 7.1.2 (acesso aos dados e informações)" }],
    "afirmativa": [{ txt: "PUC-Rio (dissertação, Certificação Digital 1112733/CA), \"Tipos de Questão de Múltipla Escolha\", a partir do guia da SEE-MG", url: "https://www.maxwell.vrac.puc-rio.br/23892/23892_5.PDF", loc: "tipo 3 («questão de resposta múltipla»)" }, { txt: "Michaelis On-line, verbete «afirmativa»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/afirmativa/", loc: "verbete «afirmativa», acepção 3" }],
    "distrator": [{ txt: "INEP, Guia de Elaboração e Revisão de Itens, vol. 1 (2010)", url: "https://morretes.pr.gov.br/uploads/pagina/arquivos/GuiaelaboracaoitensINEP.pdf", loc: "item 2.3.2 (Distratores), p. 11" }, { txt: "INEP, Guia de Elaboração e Revisão de Itens, vol. 1 (2010)", url: "https://morretes.pr.gov.br/uploads/pagina/arquivos/GuiaelaboracaoitensINEP.pdf", loc: "item 2.3.2 (Distratores), p. 11" }],
    "comando-negativo": [{ txt: "PUC-Rio (dissertação, Certificação Digital 1112733/CA), \"Tipos de Questão de Múltipla Escolha\", a partir do guia da SEE-MG", url: "https://www.maxwell.vrac.puc-rio.br/23892/23892_5.PDF", loc: "tipo 4 («questão de foco negativo»)" }],
  };
  T.forEach(function (x) { if (FV6[x.id] && !x.fonte) x.fonte = FV6[x.id]; });
  /* ===================== Fontes do lote 7 (nomenclatura do casco e do aparelho, marés, astronomia, segurança, rádio) =====================
     Cada verbete aponta para um trecho literal conferido por texto no Manual de Navegação (DHN, Vols. I a III), na NORMAM-211/DPC,
     no livro Arte Naval (Fonseca, SDM/Marinha, caps. 2 a 12, publicado pela DPC), no material da Anatel, em dicionário (Michaelis) e,
     onde a Marinha não define o termo, na Wikipédia (identificada como fonte secundária) ou em artigo da imprensa náutica (Yachting
     Magazine). «Casaria» e «tormentim» não tiveram fonte reconhecida e continuam sem `fonte`. Os trechos literais estão em
     research/_work/glossario_fontes_7.json. */
  var FV7 = {
    "linha-dagua": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 2 (Geometria do navio)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap2_2005.pdf", loc: "Cap. 2, art. 2.2, p. 49" }, { txt: "Wikipédia PT, Linha de água (fonte secundária)", url: "https://pt.wikipedia.org/wiki/Linha_de_%C3%A1gua", loc: "introdução do artigo" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «waterline» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «waterline»" }],
    "madre-do-leme": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 6 (Estrutura do casco dos navios metálicos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap6_2005.pdf", loc: "Cap. 6, art. 6.34 a (1), p. 283" }, { txt: "Michaelis On-line, verbete «madre»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/madre/", loc: "verbete «madre», expressões («madre de leme»)" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «rudderstock» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «rudderstock»" }],
    "balaustre": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 6 (Estrutura do casco dos navios metálicos)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap6_2005.pdf", loc: "Cap. 6, art. 6.24 b (balaustrada), p. 262" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «stanchion» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «stanchion»" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-34" }],
    "espelho-de-popa": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 4 (Embarcações miúdas)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap4_2005.pdf", loc: "Cap. 4, art. 4.3.2 (peças de construção), p. 160" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «transom» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «transom»" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-35" }],
    "roda-de-proa": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 4 (Embarcações miúdas)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap4_2005.pdf", loc: "Cap. 4, art. 4.3.2 (peças de construção), p. 160" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «stem» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «stem»" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-34" }],
    "balanco": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 12 (Manobra do navio)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap12_2005.pdf", loc: "Cap. 12, art. 12.84 a, p. 685" }, { txt: "Michaelis On-line, verbete «balanço»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/balan%C3%A7o/", loc: "verbete «balanço», acepção 10 (Mar)" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «roll» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «roll»" }],
    "cruzeta": [{ txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «spreader» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «spreader»" }, { txt: "Wikipedia EN, Shroud (sailing) (fonte secundária)", url: "https://en.wikipedia.org/wiki/Shroud_(sailing)", loc: "segundo parágrafo" }],
    "carlinga": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 4 (Embarcações miúdas)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap4_2005.pdf", loc: "Cap. 4, art. 4.3.2 (peças de construção), p. 161" }, { txt: "Michaelis On-line, verbete «carlinga»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/carlinga/", loc: "verbete «carlinga», acepções 2 e 3" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «mast step» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «mast step»" }],
    "aparelho-fixo": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 11 (Aparelho de governo, mastreação e aparelhos de carga)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap11_2005.pdf", loc: "Cap. 11, art. 11.12, p. 570" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 11 (Aparelho de governo, mastreação e aparelhos de carga)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap11_2005.pdf", loc: "Cap. 11, art. 11.12, p. 571" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «standing rigging» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «standing rigging»" }],
    "aparelho-de-laborar": [{ txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «running rigging» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «running rigging»" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.13, p. 483 (sentido de talha)" }],
    "catraca": [{ txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «winch» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «winch»" }, { txt: "Wikipedia EN, Winch (fonte secundária)", url: "https://en.wikipedia.org/wiki/Winch", loc: "abertura do artigo" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, nomenclatura do navio, p. A5-35" }],
    "patesca": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.3 c, p. 478" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.13, p. 484" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «snatch block» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «snatch block»" }],
    "talha": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.13, p. 484" }, { txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.15 b, p. 486" }, { txt: "Michaelis On-line, verbete «talha»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/talha/", loc: "verbete «talha», acepção 7" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «tackle» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «tackle»" }],
    "sapatilho": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 9 (Poleame, aparelhos de laborar e acessórios)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap9_2005.pdf", loc: "Cap. 9, art. 9.29, p. 500" }, { txt: "Michaelis On-line, verbete «sapatilho»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/sapatilho/", loc: "verbete «sapatilho», acepção 2 (Náut)" }, { txt: "Wikipedia EN, Glossary of nautical terms (M–Z), verbete «thimble» (fonte secundária)", url: "https://en.wikipedia.org/wiki/Glossary_of_nautical_terms_(M%E2%80%93Z)", loc: "verbete «thimble»" }],
    "filame": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 8, p. 8-20" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 8, item 8.9 (fundeio de precisão), p. 8-17" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 39, item i (fundeio), p. 39-41" }, { txt: "NORMAM-211/DPC", url: "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf", loc: "Anexo 4-B, item 6 (Procedimentos para fundear a embarcação), p. 4-B-5" }],
    "lancante": [{ txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, termos associados às manobras de espias, p. A5-13" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Apêndice 5, ordens de manobra, item 33, p. A5-39" }, { txt: "Michaelis On-line, verbete «lançante»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/lancante/", loc: "verbete «lançante», acepção 1 (Náut)" }],
    "cote": [{ txt: "Arte Naval (Fonseca, SDM/Marinha), Cap. 8 (Trabalhos do marinheiro)", url: "https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Cap8_2005.pdf", loc: "Cap. 8, art. 8.6, p. 381" }, { txt: "Michaelis On-line, verbete «cote»", url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/cote/", loc: "verbete «cote», acepção 1 (Náut)" }],
    "pontos-cardeais": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 11, item 11.2.1, p. 11-3" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 1, item 1.8, p. 1-14" }],
    "amplitude": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-8" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.3, p. 10-4" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.9 (Tábuas das Marés), p. 10-16" }],
    "estofo": [{ txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.1.5, p. 10-9" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 8 (corrente e águas restritas), p. 8-5" }, { txt: "Manual de Navegação, Vol. I (DHN, 2ª rev. 2023)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf", loc: "Vol. I, Cap. 10, item 10.2.1, p. 10-27" }],
    "almanaque-nautico": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 23, item 23.2, p. 23-2" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 23, item 23.2, p. 23-2" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 22, item 22.3.4, p. 22-12" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 19, item 19.11.3, p. 19-24" }],
    "crepusculo-nautico": [{ txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 24, item 24.3, p. 24-5" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 24, item 24.3, p. 24-5" }, { txt: "Manual de Navegação, Vol. II (DHN, 1ª rev. 2021)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf", loc: "Vol. II, Cap. 24, item 24.3, p. 24-4" }],
    "abandono": [{ txt: "Yachting Magazine, Abandon Ship, Part Two: Leaving the Ship (Mario Vittone, ex-Guarda Costeira dos EUA, 2013)", url: "https://www.yachtingmagazine.com/abandon-ship-part-two-leaving-ship/", loc: "seção «When to Leave»" }, { txt: "Yachting Magazine, Abandon Ship, Part Two: Leaving the Ship (Mario Vittone, ex-Guarda Costeira dos EUA, 2013)", url: "https://www.yachtingmagazine.com/abandon-ship-part-two-leaving-ship/", loc: "seção «When to Leave»" }, { txt: "Yachting Magazine, Abandon Ship, Part Two: Leaving the Ship (Mario Vittone, ex-Guarda Costeira dos EUA, 2013)", url: "https://www.yachtingmagazine.com/abandon-ship-part-two-leaving-ship/", loc: "parágrafo final" }, { txt: "Manual de Navegação, Vol. III (DHN, 1ª rev. 2026)", url: "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf", loc: "Vol. III, Cap. 43, p. 43-1" }],
    "estacao-costeira": [{ txt: "Anatel, Tutorial para Licenciamento de Estações do Serviço Limitado Móvel Marítimo (jun. 2026)", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a", loc: "seção «Tipos de estação», p. 9 do PDF" }, { txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 1.4.5, p. 8" }, { txt: "Anatel, Material de apoio ao exame de Radiotelefonista", url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6", loc: "item 2.1.9.3, p. 18" }],
  };
  T.forEach(function (x) { if (FV7[x.id] && !x.fonte) x.fonte = FV7[x.id]; });
  /* ===================== Regra "nada inventado" (2026-10-09) =====================
     Depois de aplicadas as fontes verificadas (80–87), retira do glossário publicado todo verbete que continue sem
     fonte reconhecida conferida por um verificador independente, e limpa as referências "ver" a ele.
     Os verbetes retirados ficam listados em research/glossario_retirados.md. */
  (function () {
    var fora = {};
    T.forEach(function (x) { if (!x.fonte || (Array.isArray(x.fonte) && !x.fonte.length)) fora[x.id] = 1; });
    for (var i = T.length - 1; i >= 0; i--) if (fora[T[i].id]) T.splice(i, 1);
    T.forEach(function (x) { if (x.ver) x.ver = x.ver.filter(function (v) { return !fora[v]; }); });
  })();

  /* ===================== Montagem ===================== */
  function slug(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  var ids = {};
  T.forEach(function (x) { ids[x.id] = x; });
  /* Figuras: o SVG só é gerado quando alguém abre o termo. */
  T.forEach(function (x) {
    if (!x.fig) return;
    var f = x.fig, cache = null, fig = { legenda: x.legenda || null, destaque: x.nota !== false && !(f[1] == null || f[1] === 'nada' || f[1] === 'todas' || f[1] === 'todos') };
    Object.defineProperty(fig, 'svg', { enumerable: true, get: function () { if (cache === null) cache = F[f[0]](f[1]); return cache; } });
    x.figura = fig;
    delete x.fig; delete x.legenda; delete x.nota;
  });
  /* Sinônimos e palavras de busca viram ids alternativos (um curso pode linkar #/glossario/termo/estibordo).
     Os sinônimos vêm primeiro: se uma palavra serve a dois termos, ganha aquele de quem ela é sinônimo. */
  var alias = {};
  ['sin', 'busca'].forEach(function (campo) {
    T.forEach(function (x) {
      (x[campo] || []).forEach(function (s) { var k = slug(s); if (k && !ids[k] && !alias[k]) alias[k] = x.id; });
    });
  });
  VL.dado('glossario', { consultado: CONSULTA, categorias: CATS, termos: T, alias: alias, figuras: F });
  var indice = {};
  T.forEach(function (x) { indice[x.id] = x.termo; });
  Object.keys(alias).forEach(function (k) { indice[k] = ids[alias[k]].termo; });
  VL.dado('glossarioIndice', indice);
})();
