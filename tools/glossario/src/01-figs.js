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

