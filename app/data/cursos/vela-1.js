/* Curso Vela prática e veleiro de cruzeiro — parte 1: como um veleiro anda, anatomia de um veleiro de cruzeiro,
   pontos de vela e regulagem, manobras sob vela, reduzir pano e mau tempo.
   Conteúdo técnico (não regulatório): cada lição cita a fonte técnica no fim. O curso não afirma exigência legal
   nenhuma; quando falar de equipamento obrigatório, o aluno deve consultar a NORMAM-211 (Arrais e Mestre).
   Recomendações de vela (quando rizar, o que fazer no mau tempo) são ORIENTAÇÃO GERAL, não regra: o barco, a
   tripulação e o mar mandam. IDs de lição únicos nesta parte (l1 a l26). */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ fontes técnicas reutilizáveis */
  var WIKI = 'https://en.wikipedia.org/wiki/';
  function wk(txt, pag) { return { txt: 'Wikipédia (inglês): ' + txt, url: WIKI + pag }; }
  var RYA = { txt: 'RYA, Sail Cruising Scheme e RYA Day Skipper & Watch Leader Handbook (Royal Yachting Association)', url: 'https://www.rya.org.uk/' };
  var USS = { txt: 'US Sailing, programa de cursos Basic Keelboat e Basic Cruising', url: 'https://www.ussailing.org/' };
  var MARCHAJ = { txt: 'Marchaj, C. A., Aero-Hydrodynamics of Sailing (Adlard Coles, 3ª ed. 2000)' };
  var MARCHAJ2 = { txt: 'Marchaj, C. A., Sail Performance: Techniques to Maximise Sail Power (Adlard Coles, 2ª ed. 2003)' };
  var GARRETT = { txt: 'Garrett, R., The Symmetry of Sailing: The Physics of Sailing for Yachtsmen (Adlard Coles, 1996)' };
  var CALDER = { txt: 'Calder, N., Boatowner’s Mechanical and Electrical Manual (International Marine/McGraw-Hill, 4ª ed. 2015)' };
  var COLES = { txt: 'Coles, K. A. e Bruce, P., Heavy Weather Sailing (Adlard Coles, 6ª ed. 2014)' };
  var PARDEY = { txt: 'Pardey, L. e L., The Storm Tactics Handbook (Pardey Books, 1999)' };
  var ABYC = { txt: 'ABYC, Standards and Technical Information Reports for Small Craft (American Boat & Yacht Council)', url: 'https://www.abycinc.org/' };
  var BEAUFORT = { txt: 'Centro de Hidrografia da Marinha (CHM), Escala Beaufort (fonte: WMO nº 8, vol. III, 2023)', url: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf' };
  var RIPEAM = { txt: 'RIPEAM-72 (COLREG), regras de governo e manobra: Regras 8, 12, 13, 14 e 15, texto da Marinha do Brasil (CCA-IMO)', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf' };

  /* ------------------------------------------------------------------ construtores de SVG */
  function fig(id, vb, titulo, corpo, mw) {
    var mk = function (suf, cor) {
      return '<marker id="' + id + suf + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + cor + '"/></marker>';
    };
    var vw = parseFloat(vb.split(' ')[2]);
    return '<div style="overflow-x:auto;max-width:100%"><svg viewBox="' + vb + '" width="100%" role="img" aria-labelledby="' + id + 't" style="min-width:' + Math.round(vw * 0.92) + 'px;max-width:' + (mw || 560) + 'px;display:block;margin:0 auto">' +
      '<title id="' + id + 't">' + titulo + '</title><defs>' + mk('-i', 'var(--ink)') + mk('-m', 'var(--magenta)') + mk('-b', 'var(--nav-blue)') + mk('-r', 'var(--nav-red)') + mk('-g', 'var(--nav-green)') + '</defs>' + corpo + '</svg></div>';
  }
  var COR = { i: 'var(--ink)', m: 'var(--magenta)', b: 'var(--nav-blue)', r: 'var(--nav-red)', g: 'var(--nav-green)' };
  // texto: o = {a: âncora, s: tamanho, c: cor, b: negrito, i: itálico, r: rotação}
  function T(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.s || 14) + '" fill="' + (o.c || 'var(--ink)') + '" text-anchor="' + (o.a || 'middle') + '"' +
      (o.b ? ' font-weight="700"' : '') + (o.i ? ' font-style="italic"' : '') + (o.h ? ' stroke="var(--paper)" stroke-width="4" paint-order="stroke"' : '') + (o.r ? ' transform="rotate(' + o.r + ' ' + x + ' ' + y + ')"' : '') + '>' + s + '</text>';
  }
  // linha/seta: o = {c: chave de COR, w: espessura, d: tracejado, m: marcador (id da figura) — põe ponta na extremidade final}
  function L(x1, y1, x2, y2, o) {
    o = o || {};
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (COR[o.c || 'i']) + '" stroke-width="' + (o.w || 2) + '"' +
      (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + (o.m ? ' marker-end="url(#' + o.m + '-' + (o.c || 'i') + ')"' : '') + ' stroke-linecap="round"/>';
  }
  // casco visto de cima, proa para cima, comprimento 94, boca 34 (unidades locais); centro em (x, y)
  var CASCO_D = 'M0 -50 C14 -34 18 -4 16 24 L12 44 L-12 44 L-16 24 C-18 -4 -14 -34 0 -50 Z';
  function barco(x, y, rot, esc, extra) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + (esc || 1) + ')">' +
      '<path d="' + CASCO_D + '" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="' + (2 / (esc || 1)) + '"/>' + (extra || '') + '</g>';
  }
  // ponteiro de vento: seta que sai de (x, y) apontando para onde o ar vai; ang = direção DE ONDE vem (graus, 0 = cima, horário)
  function dir(ang) { var a = ang * Math.PI / 180; return [Math.sin(a), -Math.cos(a)]; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function pt(cx, cy, ang, raio) { var d = dir(ang); return [r1(cx + d[0] * raio), r1(cy + d[1] * raio)]; }

  /* ================================================================== figuras do módulo 1 */
  // F1: triângulo de velocidades (vento real 12 nós a 60° da proa, barco a 6 nós)
  var F_TRIANGULO = fig('m1f1', '0 0 440 250', 'Triângulo de velocidades: o vento real somado ao vento do deslocamento dá o vento aparente',
    L(196, 160, 196, 14, { d: '5 5', w: 1.5 }) + T(196, 12, 'proa', { s: 14 }).replace('y="12"', 'y="11"') +
    L(300, 40, 199, 98, { c: 'b', w: 3, m: 'm1f1' }) +
    L(196, 100, 196, 156, { c: 'g', w: 3, m: 'm1f1' }) +
    L(300, 40, 199, 156, { c: 'm', w: 4, m: 'm1f1' }) +
    '<path d="M196 122 A38 38 0 0 1 220 128" fill="none" stroke="var(--ink)" stroke-width="1.5"/>' +
    T(226, 118, '41°', { a: 'start', b: 1 }) +
    T(186, 66, 'Vento real', { a: 'end', b: 1, c: 'var(--nav-blue)' }) + T(186, 83, '12 nós, a 60° da proa', { a: 'end' }) +
    T(186, 128, 'Vento do', { a: 'end', b: 1, c: 'var(--nav-green)' }) + T(186, 145, 'deslocamento: 6 nós', { a: 'end' }) +
    T(262, 126, 'Vento aparente', { a: 'start', b: 1, c: 'var(--magenta)' }) + T(262, 143, '15,9 nós, a 41° da proa', { a: 'start' }) +
    T(300, 30, 'de onde o vento sopra', { a: 'middle', s: 13 }) +
    T(220, 190, 'O vento do deslocamento é igual e oposto à velocidade do barco:', { a: 'middle', s: 13 }) +
    T(220, 208, 'aponta para trás, mesmo que o ar esteja parado.', { a: 'middle', s: 13 }) +
    T(220, 232, 'Real + deslocamento = aparente (soma de vetores).', { a: 'middle', s: 13, b: 1 }), 480);

  // F2: vela como asa na bolina (vento aparente a 40° da proa, vela a 22° da linha de centro, ângulo de ataque 18°)
  var F_ASA = fig('m1f2', '0 0 520 260', 'Vela como asa: o ar escoa pelos dois lados, a pressão fica menor do lado de sotavento e a força resultante empurra o barco para a frente e de lado',
    '<g transform="translate(70 0)">' +
    L(330, 30, 291, 76, { c: 'b', w: 2.5, m: 'm1f2' }) + L(372, 62, 333, 108, { c: 'b', w: 2.5, m: 'm1f2' }) + L(290, 6, 251, 52, { c: 'b', w: 2.5, m: 'm1f2' }) +
    T(388, 36, 'Vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) + T(388, 53, 'aparente', { a: 'start', c: 'var(--nav-blue)' }) +
    barco(200, 150, 0, 1.3) +
    L(200, 132, 229, 96.5, { d: '4 4', w: 1.4 }) + L(200, 132, 213, 98, { d: '4 4', w: 1.4 }) +
    '<path d="M213.5 98.6 A36 36 0 0 1 223.1 104.4" fill="none" stroke="var(--ink)" stroke-width="1.5"/>' +
    T(236, 98, 'ângulo', { a: 'start', s: 13 }) + T(236, 113, 'de ataque', { a: 'start', s: 13 }) +
    '<path d="M200 132 Q173.5 160.5 173 199" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/>' +
    '<circle cx="200" cy="132" r="4" fill="var(--ink)"/>' +
    T(160, 182, '−', { s: 22, b: 1, c: 'var(--nav-blue)' }) + T(194, 192, '+', { s: 20, b: 1, c: 'var(--nav-red)' }) +
    L(184, 164, 122, 130, { c: 'm', w: 3.4, m: 'm1f2' }) + L(184, 164, 184, 130, { w: 2, m: 'm1f2' }) + L(184, 164, 122, 164, { w: 2, m: 'm1f2' }) +
    L(184, 130, 122, 130, { d: '3 4', w: 1.2 }) + L(122, 130, 122, 164, { d: '3 4', w: 1.2 }) +
    T(112, 124, 'Força total', { a: 'end', b: 1, c: 'var(--magenta)' }) + T(176, 100, 'para a frente', { a: 'end', s: 13 }) + L(172, 104, 184, 126, { w: 1, d: '2 2' }) + T(116, 186, 'de lado', { a: 'end', s: 13 }) +
    '</g>' + T(260, 248, 'Baixa pressão (−) a sotavento, alta pressão (+) a barlavento', { s: 13 }), 560);

  // F3: vela na popa (vento por trás: a vela funciona por arrasto)
  var F_ARRASTO = fig('m1f3', '0 0 440 260', 'Vento por trás: a vela fica quase perpendicular ao vento e empurra o barco por arrasto, como uma parede',
    barco(200, 150, 0, 1.3) +
    '<path d="M200 132 Q236 118 274 130" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/>' +
    '<circle cx="200" cy="132" r="4" fill="var(--ink)"/>' +
    L(236, 250, 236, 160, { c: 'b', w: 2.5, m: 'm1f3' }) + L(262, 250, 262, 150, { c: 'b', w: 2.5, m: 'm1f3' }) + L(288, 250, 288, 150, { c: 'b', w: 2.5, m: 'm1f3' }) +
    T(306, 226, 'Vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) + T(306, 243, 'aparente', { a: 'start', c: 'var(--nav-blue)' }) +
    L(244, 124, 244, 62, { c: 'm', w: 3.4, m: 'm1f3' }) + T(256, 70, 'Força:', { a: 'start', b: 1, c: 'var(--magenta)' }) + T(256, 87, 'empurra para a frente', { a: 'start', s: 13 }) +
    T(112, 26, 'A vela quase não gera sustentação:', { a: 'start', s: 13 }) + T(112, 42, 'a força vem do ar que bate nela.', { a: 'start', s: 13 }), 520);

  // F4: abatimento (leeway)
  var F_ABATIMENTO = fig('m1f4', '0 0 440 270', 'Abatimento: o casco aponta para um lado, mas anda ligeiramente para sotavento; a quilha gera a força que resiste ao deslize lateral',
    barco(200, 170, 0, 1.15) +
    L(200, 108, 200, 24, { d: '5 5', w: 1.6 }) + T(204, 20, 'proa', { a: 'start' }) +
    L(200, 170, 178, 40, { c: 'm', w: 3.4, m: 'm1f4' }) + T(166, 36, 'caminho sobre a água', { a: 'end', b: 1, c: 'var(--magenta)' }) +
    '<path d="M200 70 A100 100 0 0 0 183.3 71.4" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
    T(208, 62, 'abatimento', { a: 'start', b: 1 }) +
    L(200, 150, 140, 150, { c: 'r', w: 3, m: 'm1f4' }) + T(132, 136, 'Força lateral', { a: 'end', c: 'var(--nav-red)', b: 1 }) + T(132, 153, 'da vela', { a: 'end', s: 13 }) +
    L(200, 196, 262, 196, { c: 'g', w: 3, m: 'm1f4' }) + T(270, 192, 'Resistência', { a: 'start', c: 'var(--nav-green)', b: 1 }) + T(270, 209, 'da quilha', { a: 'start', s: 13 }) +
    L(330, 100, 292, 144, { c: 'b', w: 2.5, m: 'm1f4' }) + T(318, 92, 'Vento', { a: 'middle', b: 1, c: 'var(--nav-blue)' }) +
    T(220, 248, 'Ângulo exagerado no desenho:', { s: 13 }) + T(220, 264, 'num cruzeiro bem regulado são poucos graus.', { s: 13 }), 520);

  // F5: banda e momento de endireitamento (vista de proa)
  var F_BANDA = (function () {
    var a = -20, ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
    function W(x, y) { return [r1(200 + x * ca - y * sa), r1(185 + x * sa + y * ca)]; }
    var G = W(0, 8), B = [170, 205], CE = W(0, -100);
    var casco = '<g transform="translate(200 185) rotate(' + a + ')">' +
      '<path d="M-55 -20 C-55 20 -30 45 0 45 C30 45 55 20 55 -20 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.4"/>' +
      '<path d="M-5 45 L-3 92 L3 92 L5 45 Z" fill="var(--ink-3)" stroke="var(--ink)" stroke-width="1.5"/><ellipse cx="0" cy="100" rx="15" ry="8" fill="var(--ink-2)" stroke="var(--ink)" stroke-width="1.5"/>' +
      '<line x1="0" y1="-20" x2="0" y2="-170" stroke="var(--ink)" stroke-width="3.5"/>' +
      '<path d="M0 -165 L0 -40 Q-34 -80 0 -165 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.6" opacity="0.95"/></g>';
    return fig('m1f5', '0 0 440 330', 'Banda: o peso do barco, aplicado no centro de gravidade, e o empuxo da água, aplicado no centro de carena deslocado para o lado que afunda (sotavento), formam um par de forças que endireita o barco; o vento na vela tenta incliná-lo',
      '<rect x="0" y="185" width="440" height="145" fill="var(--sea-2)" opacity="0.55"/><line x1="0" y1="185" x2="440" y2="185" stroke="var(--sea-3)" stroke-width="2"/>' +
      casco +
      '<rect x="0" y="185" width="440" height="145" fill="var(--sea-2)" opacity="0.28"/>' +
      L(CE[0], CE[1], CE[0] - 62, CE[1], { c: 'r', w: 3.2, m: 'm1f5' }) + T(CE[0] - 66, CE[1] - 24, 'Vento na vela', { a: 'end', b: 1, c: 'var(--nav-red)' }) + T(CE[0] - 66, CE[1] - 8, 'tenta inclinar', { a: 'end', s: 13 }) +
      L(G[0], G[1], G[0], G[1] + 62, { c: 'm', w: 3.2, m: 'm1f5' }) + '<circle cx="' + G[0] + '" cy="' + G[1] + '" r="5" fill="var(--magenta)"/>' +
      T(G[0] + 44, G[1] + 40, 'Peso (G)', { a: 'start', b: 1, c: 'var(--magenta)', h: 1 }) +
      L(B[0], B[1], B[0], B[1] - 64, { c: 'g', w: 3.2, m: 'm1f5' }) + '<circle cx="' + B[0] + '" cy="' + B[1] + '" r="5" fill="var(--nav-green)"/>' +
      T(B[0] - 10, B[1] + 20, 'Empuxo (B)', { a: 'end', b: 1, c: 'var(--nav-green)' }) +
      L(B[0], G[1] - 6, G[0], G[1] - 6, { d: '2 3', w: 1.6 }) + T((B[0] + G[0]) / 2, G[1] - 14, 'GZ', { s: 14, b: 1, h: 1 }) +
      T(300, 110, 'GZ: braço de', { a: 'start', s: 13 }) + T(300, 126, 'endireitamento.', { a: 'start', s: 13 }) + T(300, 142, 'Momento = peso × GZ', { a: 'start', s: 13 }) +
      T(220, 318, 'Vista de proa, banda de 20° (exagerada para o desenho)', { s: 13 }), 520);
  })();

  // F6: zona morta e bordejo
  var F_ZONA = fig('m1f6', '0 0 440 270', 'Zona morta: o veleiro não segue dentro de cerca de 45 graus de cada lado do vento; para ir contra o vento ele zigue-zagueia em bordos',
    '<path d="M110 160 L46.4 96.4 A90 90 0 0 1 173.6 96.4 Z" fill="var(--erro-soft)" stroke="var(--erro)" stroke-width="1.6" stroke-dasharray="5 4"/>' +
    barco(110, 185, 0, 0.55) +
    L(110, 6, 110, 56, { c: 'b', w: 3, m: 'm1f6' }) + T(124, 22, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
    T(110, 108, 'zona morta', { b: 1 }) + T(110, 124, '(sem avanço)', { s: 13 }) +
    '<path d="M110 178 L46.4 96.4" stroke="none"/>' +
    T(110, 245, 'a cerca de 45° do vento', { s: 13 }) + T(110, 261, 'para cada lado', { s: 13 }) +
    L(340, 238, 380, 198, { c: 'm', w: 3, m: 'm1f6' }) + L(380, 198, 340, 158, { c: 'm', w: 3, m: 'm1f6' }) + L(340, 158, 380, 118, { c: 'm', w: 3, m: 'm1f6' }) + L(380, 118, 340, 78, { c: 'm', w: 3, m: 'm1f6' }) +
    L(340, 238, 340, 78, { d: '4 5', w: 1.5 }) +
    '<circle cx="340" cy="238" r="5" fill="var(--ink)"/><circle cx="340" cy="78" r="5" fill="var(--ink)"/>' +
    T(318, 244, 'A', { b: 1 }) + T(318, 76, 'B', { b: 1 }) +
    L(340, 36, 340, 62, { c: 'b', w: 3, m: 'm1f6' }) + T(354, 44, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
    T(326, 156, '4 bordos', { a: 'end', s: 13 }) + T(326, 172, 'de 45°', { a: 'end', s: 13 }), 520);
  /* ================================================================== figuras do módulo 2 */
  // caixa com texto em até 3 linhas: box(x, y, w, h, [linhas], cor de borda, negrito)
  function box(x, y, w, h, linhas, cor, fundo) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (fundo || 'var(--sea-1)') + '" stroke="' + (cor || 'var(--ink)') + '" stroke-width="1.6"/>';
    var n = linhas.length, lh = 17, y0 = y + h / 2 - (n - 1) * lh / 2 + 5;
    linhas.forEach(function (t, i) { s += T(x + w / 2, r1(y0 + i * lh), t, { s: 14 }); });
    return s;
  }

  // F7: perfil do casco com as medidas básicas
  var F_PERFIL = fig('m2f1', '0 0 480 290', 'Perfil de um veleiro de cruzeiro (exemplo de 32 pés): casco, linha d’água, quilha com bulbo, leme, comprimento total, calado, obras vivas e obras mortas',
    '<rect x="0" y="138" width="480" height="132" fill="var(--sea-2)" opacity="0.45"/><line x1="10" y1="138" x2="470" y2="138" stroke="var(--sea-3)" stroke-width="2" stroke-dasharray="6 4"/>' +
    '<path d="M180 148 L262 148 L246 212 L226 212 Z" fill="var(--ink-3)" stroke="var(--ink)" stroke-width="2"/><ellipse cx="236" cy="218" rx="27" ry="8" fill="var(--ink-2)" stroke="var(--ink)" stroke-width="2"/>' +
    '<path d="M392 126 L410 122 L402 196 L388 190 Z" fill="var(--ink-3)" stroke="var(--ink)" stroke-width="2"/>' +
    '<path d="M48 108 Q235 126 428 106 L420 134 Q300 160 200 152 Q100 144 48 108 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.4"/>' +
    '<line x1="190" y1="120" x2="190" y2="16" stroke="var(--ink)" stroke-width="4"/><line x1="190" y1="100" x2="380" y2="100" stroke="var(--ink)" stroke-width="3"/>' +
    '<path d="M194 22 L194 96 L376 96 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.4" opacity="0.9"/>' +
    '<line x1="60" y1="108" x2="190" y2="18" stroke="var(--ink)" stroke-width="1.4"/><line x1="190" y1="16" x2="424" y2="106" stroke="var(--ink)" stroke-width="1.4"/>' +
    L(48, 272, 428, 272, { w: 1.6 }) + '<line x1="48" y1="266" x2="48" y2="278" stroke="var(--ink)" stroke-width="1.6"/><line x1="428" y1="266" x2="428" y2="278" stroke="var(--ink)" stroke-width="1.6"/>' +
    T(238, 266, 'comprimento total (ex.: ≈ 9,75 m, 32 pés)', { s: 13 }) +
    L(300, 139, 300, 218, { w: 1.6 }) + '<line x1="294" y1="218" x2="306" y2="218" stroke="var(--ink)" stroke-width="1.6"/>' + T(310, 184, 'calado', { a: 'start', s: 13 }) + T(310, 200, '≈ 1,8 m', { a: 'start', s: 13 }) +
    T(76, 98, 'proa', { s: 13 }) + T(436, 96, 'popa', { s: 13 }) +
    T(16, 188, 'obras vivas', { b: 1, s: 13, a: 'start' }) + T(16, 204, '(abaixo da linha d’água)', { s: 12, a: 'start' }) +
    T(40, 40, 'obras mortas', { b: 1, s: 13, a: 'start' }) + T(40, 56, '(acima da linha d’água)', { s: 12, a: 'start' }) + L(100, 62, 128, 114, { w: 1.2, d: '3 3' }) +
    T(292, 240, 'quilha com bulbo', { s: 13, a: 'start' }) + L(288, 236, 262, 222, { w: 1.2, d: '3 3' }) +
    T(414, 218, 'leme', { a: 'start', s: 13 }) +
    T(14, 132, 'linha d’água', { a: 'start', s: 12, h: 1 }), 560);

  // F8: anatomia da vela grande
  var F_VELA = fig('m2f2', '0 0 460 280', 'Anatomia de uma vela triangular: testa, valuma, esteira, punho da adriça, punho da amura, punho da escota, rizos e latas',
    '<line x1="146" y1="8" x2="146" y2="246" stroke="var(--ink)" stroke-width="5"/><line x1="146" y1="238" x2="340" y2="238" stroke="var(--ink)" stroke-width="4"/>' +
    '<path d="M152 22 L152 232 L332 232 Q262 118 152 22 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.4"/>' +
    '<line x1="152" y1="96" x2="226" y2="100" stroke="var(--ink-3)" stroke-width="2.4"/><line x1="152" y1="150" x2="262" y2="156" stroke="var(--ink-3)" stroke-width="2.4"/><line x1="152" y1="200" x2="296" y2="202" stroke="var(--ink-3)" stroke-width="2.4"/>' +
    '<line x1="152" y1="178" x2="316" y2="178" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 4"/><line x1="152" y1="126" x2="276" y2="126" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 4"/>' +
    '<circle cx="152" cy="22" r="4" fill="var(--ink)"/><circle cx="152" cy="232" r="4" fill="var(--ink)"/><circle cx="332" cy="232" r="4" fill="var(--ink)"/>' +
    T(166, 16, 'punho da adriça (cabeça)', { a: 'start', s: 13 }) +
    T(136, 124, 'testa', { a: 'end', b: 1, s: 14 }) + T(136, 140, '(luff)', { a: 'end', s: 12 }) +
    T(296, 84, 'valuma', { a: 'start', b: 1, s: 14 }) + T(296, 100, '(leech)', { a: 'start', s: 12 }) +
    T(240, 264, 'esteira (foot)', { s: 14, b: 1 }) +
    T(136, 258, 'punho da amura', { a: 'end', s: 13 }) + T(342, 258, 'punho da escota', { a: 'start', s: 13 }) +
    T(344, 168, 'rizos', { a: 'start', b: 1, s: 14, c: 'var(--magenta)' }) + T(344, 184, '(faixas com olhais)', { a: 'start', s: 12 }) +
    T(162, 88, 'latas', { a: 'start', s: 13, h: 1 }), 560);

  // F9: combustível e refrigeração de um motor diesel de centro
  var F_MOTOR = (function () {
    var s = '', c1 = 10, c2 = 232, w = 188, h = 42, dy = 58, y0 = 38;
    function col(x, tit, itens, cor) {
      var r = T(x + w / 2, 20, tit, { b: 1, s: 15 });
      itens.forEach(function (it, i) {
        r += box(x, y0 + i * dy, w, h, it, cor);
        if (i < itens.length - 1) r += L(x + w / 2, y0 + i * dy + h, x + w / 2, y0 + (i + 1) * dy - 2, { m: 'm2f3', c: cor === 'var(--nav-blue)' ? 'b' : 'i', w: 2 });
      });
      return r;
    }
    s += col(c1, 'Combustível', [['Tanque', '(respiro para fora)'], ['Pré-filtro com', 'separador de água'], ['Bomba de alimentação', '(manual para sangrar)'], ['Filtro fino do motor'], ['Bomba injetora'], ['Injetores']]);
    s += col(c2, 'Água do mar (arrefecimento)', [['Válvula de fundo', '(abrir antes de ligar)'], ['Filtro de água do mar', '(cesto transparente)'], ['Bomba de água do mar', '(impelidor de borracha)'], ['Trocador de calor', '(esfria o líquido do motor)'], ['Cotovelo de escape', '(mistura água e gases)'], ['Silencioso (waterlock)', 'e descarga pela popa']], 'var(--nav-blue)');
    // retorno ao tanque
    s += '<path d="M' + (c1 + w) + ' ' + (y0 + 5 * dy + h / 2) + ' H' + (c1 + w + 12) + ' V' + (y0 + h / 2) + ' H' + (c1 + w) + '" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#m2f3-i)"/>';
    s += T(220, 410, 'Setas: sentido do fluxo. Tracejado: o excesso de combustível volta ao tanque.', { s: 12 });
    return fig('m2f3', '0 0 440 424', 'Dois circuitos de um motor diesel de centro: o combustível, do tanque aos injetores, e a água do mar, da válvula de fundo à descarga pela popa', s, 560);
  })();

  // F10: sistema elétrico de 12 V
  var F_ELETRICA = fig('m2f4', '0 0 460 360', 'Sistema elétrico 12 V: fontes de carga, barramento com fusíveis, banco de serviço, bateria de partida, painel de distribuição e cargas',
    box(10, 8, 136, 46, ['Alternador', 'do motor'], 'var(--nav-green)') + box(162, 8, 136, 46, ['Painel solar +', 'regulador'], 'var(--nav-green)') + box(314, 8, 136, 46, ['Carregador de', 'cais (110/220 V)'], 'var(--nav-green)') +
    L(78, 54, 78, 84, { m: 'm2f4', w: 2 }) + L(230, 54, 230, 84, { m: 'm2f4', w: 2 }) + L(382, 54, 382, 84, { m: 'm2f4', w: 2 }) +
    '<rect x="10" y="86" width="440" height="14" rx="5" fill="var(--ink-3)" stroke="var(--ink)" stroke-width="1.4"/>' + T(230, 97, 'barramento de carga, com fusível junto a cada bateria', { s: 12, c: 'var(--surface, #fff)' }).replace('var(--surface, #fff)', 'var(--paper)') +
    L(100, 100, 100, 138, { m: 'm2f4', w: 2 }) + L(360, 100, 360, 138, { m: 'm2f4', w: 2 }) +
    box(24, 140, 150, 56, ['Banco de serviço', '(casa)', 'ciclo profundo'], 'var(--ink)') + box(286, 140, 150, 56, ['Bateria de', 'partida (motor)'], 'var(--ink)') +
    L(174, 168, 188, 168, { w: 2 }) + L(272, 168, 286, 168, { w: 2 }) + box(188, 148, 84, 40, ['separador', 'de carga'], 'var(--ink)') +
    L(100, 196, 100, 238, { m: 'm2f4', w: 2 }) + L(360, 196, 360, 238, { m: 'm2f4', w: 2 }) +
    box(24, 240, 150, 52, ['Painel de distribuição', 'fusíveis / disjuntores'], 'var(--ink)') + box(286, 240, 150, 52, ['Motor de partida', '(cabo grosso, curto)'], 'var(--ink)') +
    L(100, 292, 100, 316, { m: 'm2f4', w: 2 }) +
    box(24, 318, 410, 34, ['Cargas: luzes, instrumentos, rádio, geladeira, bombas'], 'var(--magenta)'), 560);

  // F11: passa-cascos e válvulas de fundo (vista de popa)
  var F_PASSACASCOS = fig('m2f5', '-90 0 640 290', 'Vista de popa de um casco com a linha d’água e os furos no casco: entrada de água do motor, entrada e saída do vaso sanitário, saída da pia e descarga da bomba de porão acima da linha d’água',
    '<rect x="-90" y="120" width="640" height="170" fill="var(--sea-2)" opacity="0.45"/><line x1="-80" y1="120" x2="540" y2="120" stroke="var(--sea-3)" stroke-width="2" stroke-dasharray="6 4"/>' +
    '<path d="M110 70 C110 180 160 250 230 250 C300 250 350 180 350 70 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.6"/>' +
    '<path d="M150 190 Q230 215 310 190" fill="none" stroke="var(--ink-3)" stroke-width="2" stroke-dasharray="3 4"/>' +
    '<circle cx="138" cy="176" r="8" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="186" cy="224" r="8" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="274" cy="224" r="8" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="322" cy="176" r="8" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/>' +
    '<circle cx="334" cy="100" r="7" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="1.6"/>' +
    L(130, 172, 70, 150, { w: 1.4 }) + T(66, 146, 'entrada de água', { a: 'end', s: 13 }) + T(66, 162, 'do motor', { a: 'end', s: 13 }) +
    L(180, 230, 120, 252, { w: 1.4 }) + T(116, 258, 'entrada do vaso', { a: 'end', s: 13 }) + T(116, 274, 'sanitário', { a: 'end', s: 13 }) +
    L(280, 230, 340, 252, { w: 1.4 }) + T(344, 258, 'saída do vaso', { a: 'start', s: 13 }) + T(344, 274, 'sanitário', { a: 'start', s: 13 }) +
    L(330, 172, 392, 150, { w: 1.4 }) + T(396, 146, 'saída da pia', { a: 'start', s: 13 }) + T(396, 162, 'e do chuveiro', { a: 'start', s: 13 }) +
    L(340, 96, 392, 76, { w: 1.4 }) + T(396, 72, 'descarga da bomba', { a: 'start', s: 13 }) + T(396, 88, 'de porão (alta)', { a: 'start', s: 13 }) +
    T(-80, 114, 'linha d’água', { a: 'start', s: 13 }) +
    '<circle cx="30" cy="30" r="7" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/>' + T(44, 35, 'furo abaixo da linha d’água, com válvula de fundo', { a: 'start', s: 13 }) +
    '<circle cx="30" cy="54" r="7" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="1.6"/>' + T(44, 59, 'furo acima da linha d’água', { a: 'start', s: 13 }), 560);
  /* ================================================================== figuras do módulo 3 */
  // F12: pontos de vela (roda com setores: à direita o barco recebe o vento por bombordo; boreste é o espelho)
  var F_PONTOS = (function () {
    var cx = 170, cy = 150, r1_ = 62, r2_ = 108, s = '';
    function P(r, a) { var p = pt(cx, cy, a, r); return p[0] + ' ' + p[1]; }
    function setor(a1, a2, fundo, lado) {
      var m = lado || 1;
      return '<path d="M' + P(r2_, m * a1) + ' A' + r2_ + ' ' + r2_ + ' 0 0 ' + (m > 0 ? 1 : 0) + ' ' + P(r2_, m * a2) + ' L' + P(r1_, m * a2) + ' A' + r1_ + ' ' + r1_ + ' 0 0 ' + (m > 0 ? 0 : 1) + ' ' + P(r1_, m * a1) + ' Z" fill="' + fundo + '" stroke="var(--ink)" stroke-width="1.2"/>';
    }
    var cores = ['var(--sea-1)', 'var(--sea-2)'];
    var lim = [40, 55, 80, 100, 150, 180];
    // zona morta
    s += '<path d="M' + cx + ' ' + cy + ' L' + P(r2_, -40) + ' A' + r2_ + ' ' + r2_ + ' 0 0 1 ' + P(r2_, 40) + ' Z" fill="var(--erro-soft)" stroke="var(--erro)" stroke-width="1.4" stroke-dasharray="5 4"/>';
    [1, -1].forEach(function (m) { for (var i = 0; i < lim.length - 1; i++) s += setor(lim[i], lim[i + 1], cores[i % 2], m); });
    s += T(cx, cy - 66, 'zona morta', { s: 13, b: 1 }) ;
    s += L(cx, 8, cx, 54, { c: 'b', w: 3, m: 'm3f1' }) + T(cx + 12, 22, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' });
    var mid = [47, 67, 90, 125, 165];
    mid.forEach(function (a) { var p = pt(cx, cy, a, 85); s += barco(p[0], p[1], a, 0.27); });
    var nomes = [['Bolina cerrada', '40° a 55°'], ['Bolina folgada', '55° a 80°'], ['Través', '80° a 100°'], ['Largo', '100° a 150°'], ['Popa', '150° a 180°']];
    var pos = [[47, 128], [70, 128], [90, 126], [125, 126], [165, 124]];
    pos.forEach(function (q, i) { var p = pt(cx, cy, q[0], q[1]); s += T(p[0], p[1] - (i === 0 ? 8 : 6), nomes[i][0], { a: 'start', b: 1, s: 14 }) + T(p[0], p[1] + 9, nomes[i][1], { a: 'start', s: 13 }); });
    s += T(8, 22, 'à esquerda,', { a: 'start', s: 13 }) + T(8, 38, 'boreste', { a: 'start', s: 13 }) + T(8, 54, '(espelho)', { a: 'start', s: 13 });
    s += T(cx + 40, cy + 130, '', { s: 12 });
    return fig('m3f1', '0 0 470 326', 'Pontos de vela: com o vento vindo do alto, a roda mostra a zona morta e os setores de bolina cerrada, bolina folgada, través, largo e popa, com ângulos aproximados do vento real a partir da proa',
      s + T(235, 302, 'Ângulos do vento real, a partir da proa:', { s: 12 }) + T(235, 317, 'limites aproximados, variam entre escolas e barcos.', { s: 12 }), 580);
  })();

  // F13: birutas da genoa (vista de cima, vento vindo de baixo; barlavento = embaixo)
  var F_BIRUTAS = (function () {
    function painel(x, tit, bar, sot, leg) {
      var r = '<g transform="translate(' + x + ' 0)">' +
        '<path d="M20 100 Q70 66 130 96" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/>' +
        '<circle cx="20" cy="100" r="3.5" fill="var(--ink)"/>' +
        '<path d="' + sot + '" fill="none" stroke="var(--nav-green)" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="' + bar + '" fill="none" stroke="var(--nav-red)" stroke-width="2.6" stroke-linecap="round"/>' +
        L(14, 150, 40, 122, { c: 'b', w: 2, m: 'm3f2' }) +
        T(75, 28, tit, { s: 14, b: 1 }) + T(75, 170, leg[0], { s: 12 }) + T(75, 185, leg[1], { s: 12 }) + T(75, 200, leg[2] || '', { s: 12 }) + '</g>';
      return r;
    }
    var okS = 'M44 86 L96 88', okB = 'M44 108 L96 104';
    var sB = 'M44 86 L68 80 Q82 70 78 84 Q92 92 100 80';           // sotavento em turbilhão
    var bB = 'M44 108 Q60 122 70 106 Q84 94 96 108';            // barlavento levantando
    return fig('m3f2', '0 0 470 232', 'Birutas da genoa vistas de cima: as duas paralelas mostram fluxo colado; a de barlavento dançando mostra pouco ângulo de ataque; a de sotavento dançando mostra estol',
      painel(0, 'Fluxo certo', okB, okS, ['as duas retas,', 'para trás', '']) +
      painel(160, 'Barlavento dança', bB, okS, ['vela folgada ou', 'proa alta demais:', 'cace ou arribe']) +
      painel(320, 'Sotavento dança', okB, sB, ['vela caçada ou', 'proa baixa demais:', 'folgue ou orce']) +
      T(235, 226, 'Verde: biruta de sotavento. Vermelha: biruta de barlavento.', { s: 12 }), 580);
  })();

  // F14: torção (vista de cima: três cordas) e bolsa (perfil)
  var F_TORCAO = fig('m3f3', '0 0 470 250', 'À esquerda, a torção: de baixo para cima a vela fica mais aberta, e as cordas da base, do meio e do topo formam ângulos diferentes com a linha de centro. À direita, a bolsa: a curvatura da vela e sua profundidade em relação à corda',
    L(60, 30, 60, 200, { d: '4 5', w: 1.4 }) + T(60, 24, 'proa', { s: 13 }) + '<circle cx="60" cy="50" r="4" fill="var(--ink)"/>' +
    L(60, 50, 98, 188, { w: 3.4 }) + L(60, 50, 124, 168, { w: 2.6, c: 'm' }) + L(60, 50, 146, 142, { w: 2.2, c: 'b' }) +
    T(104, 206, 'base (retranca)', { a: 'start', s: 13 }).replace('x="104"', 'x="70"').replace('y="206"', 'y="218"') +
    T(128, 164, 'meio', { a: 'start', s: 13, c: 'var(--magenta)' }) + T(150, 138, 'topo', { a: 'start', s: 13, c: 'var(--nav-blue)' }) +
    T(8, 244, 'Torção (vista de cima)', { b: 1, s: 14, a: 'start' }) +
    L(250, 142, 450, 142, { d: '5 4', w: 1.4 }) + T(450, 160, 'corda', { a: 'end', s: 13 }) +
    '<path d="M250 142 Q310 78 450 142" fill="none" stroke="var(--ink)" stroke-width="3.4" stroke-linecap="round"/>' +
    L(322, 142, 322, 100, { w: 1.6, m: 'm3f3' }) + L(322, 100, 322, 142, { w: 1.6, m: 'm3f3' }) +
    T(336, 74, 'bolsa', { a: 'start', b: 1, s: 14 }) + T(336, 90, '(profundidade)', { a: 'start', s: 12 }) +
    T(250, 176, 'testa', { a: 'middle', s: 13 }) + T(450, 176, 'valuma', { a: 'end', s: 13 }) +
    L(236, 120, 256, 138, { c: 'b', w: 2.4, m: 'm3f3' }) + T(232, 112, 'vento', { s: 13, c: 'var(--nav-blue)', b: 1 }) +
    T(350, 244, 'Bolsa (vista em corte)', { b: 1, s: 14 }), 580);
  /* ================================================================== figuras do módulo 4 */
  // F15: orçar e arribar
  var F_ORCAR = (function () {
    function arco(cx, cy, r, a1, a2, sw, cor) {
      var p1 = pt(cx, cy, a1, r), p2 = pt(cx, cy, a2, r);
      return '<path d="M' + p1[0] + ' ' + p1[1] + ' A' + r + ' ' + r + ' 0 0 ' + sw + ' ' + p2[0] + ' ' + p2[1] + '" fill="none" stroke="' + COR[cor] + '" stroke-width="3.2" marker-end="url(#m4f1-' + cor + ')"/>';
    }
    return fig('m4f1', '0 0 470 250', 'Orçar é virar a proa para o vento; arribar é virar a proa para longe do vento',
      L(235, 6, 235, 44, { c: 'b', w: 3, m: 'm4f1' }) + T(249, 22, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
      barco(110, 150, 60, 0.6) + arco(110, 150, 66, 62, 28, 0, 'm') +
      T(110, 56, 'Orçar', { b: 1, s: 16 }) + T(110, 232, 'a proa vai para o vento', { s: 13 }) +
      barco(360, 150, 60, 0.6) + arco(360, 150, 66, 58, 92, 1, 'm') +
      T(360, 56, 'Arribar', { b: 1, s: 16 }) + T(360, 232, 'a proa se afasta do vento', { s: 13 }), 580);
  })();

  // F16: cambar x jaibe (trajetórias)
  var F_CAMBJAIBE = fig('m4f2', '0 0 470 270', 'Cambar por davante: a proa cruza o vento; jaibe: a popa cruza o vento',
    L(110, 6, 110, 40, { c: 'b', w: 3, m: 'm4f2' }) + L(360, 6, 360, 40, { c: 'b', w: 3, m: 'm4f2' }) +
    T(124, 22, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) + T(374, 22, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
    '<path d="M70 230 C140 195 140 125 70 85" fill="none" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="7 5"/>' +
    barco(70, 230, 60, 0.4) + barco(70, 85, 300, 0.4) +
    T(112, 258, 'Cambar por davante', { b: 1, s: 14 }) + T(134, 150, 'a proa passa', { a: 'start', s: 13 }) + T(134, 166, 'pelo vento', { a: 'start', s: 13 }) +
    '<path d="M320 85 C390 120 390 190 320 230" fill="none" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="7 5"/>' +
    barco(320, 85, 120, 0.4) + barco(320, 230, 240, 0.4) +
    T(362, 258, 'Jaibe', { b: 1, s: 14 }) + T(306, 150, 'a popa passa', { a: 'end', s: 13 }) + T(306, 166, 'pelo vento', { a: 'end', s: 13 }), 580);

  // F17: preventer
  var F_PREVENTER = fig('m4f3', '0 0 470 270', 'Preventer: um cabo prende o fim da retranca à proa e volta ao cockpit, para impedir que a retranca atravesse o barco num jaibe acidental',
    L(180, 262, 180, 224, { c: 'b', w: 2.6, m: 'm4f3' }) + L(250, 262, 250, 224, { c: 'b', w: 2.6, m: 'm4f3' }) + L(320, 262, 320, 224, { c: 'b', w: 2.6, m: 'm4f3' }) + T(380, 246, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
    barco(180, 130, 0, 1.3) +
    '<path d="M180 108 Q226 100 262 128" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/><circle cx="180" cy="108" r="4" fill="var(--ink)"/>' +
    '<circle cx="180" cy="66" r="5" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.4"/>' +
    '<path d="M262 128 L180 66 L170 120 L170 168" fill="none" stroke="var(--magenta)" stroke-width="2.6" stroke-dasharray="6 4" marker-end="url(#m4f3-m)"/>' +
    T(262, 150, 'fim da retranca', { a: 'start', s: 13 }) + T(170, 70, 'roldana na proa', { a: 'end', s: 13 }) +
    T(150, 190, 'volta ao', { a: 'end', s: 13 }) + T(150, 206, 'cockpit', { a: 'end', s: 13 }) +
    T(292, 24, 'Preventer (tracejado):', { a: 'start', s: 13, c: 'var(--magenta)', b: 1 }) + T(292, 41, 'segura a retranca;', { a: 'start', s: 13 }) + T(292, 57, 'solta-se do cockpit,', { a: 'start', s: 13 }) + T(292, 73, 'mesmo sob carga', { a: 'start', s: 13 }), 580);
  /* ================================================================== figuras do módulo 5 */
  // F18: antes e depois do rizo (vista de lado)
  var F_RIZO = fig('m5f1', '0 0 480 270', 'Antes e depois de rizar: a vela inteira e a vela com um rizo, em que o olhal do rizo é preso no gancho de amura e o cabo do rizo traz o punho de escota para baixo, com o pano em excesso recolhido sobre a retranca',
    '<line x1="50" y1="10" x2="50" y2="226" stroke="var(--ink)" stroke-width="5"/><line x1="50" y1="214" x2="220" y2="214" stroke="var(--ink)" stroke-width="4"/>' +
    '<path d="M56 20 L56 210 L216 210 Q146 106 56 20 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.2"/>' +
    '<line x1="56" y1="148" x2="172" y2="148" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 4"/>' +
    T(132, 140, 'linha do rizo', { s: 13, c: 'var(--magenta)', h: 1 }) + T(130, 252, 'Vela inteira', { b: 1, s: 14 }) +
    '<line x1="290" y1="10" x2="290" y2="226" stroke="var(--ink)" stroke-width="5"/><line x1="290" y1="214" x2="460" y2="214" stroke="var(--ink)" stroke-width="4"/>' +
    '<path d="M296 20 L296 148 L456 208 Q392 100 296 20 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2.2"/>' +
    '<path d="M296 150 L296 208 L456 212 L456 208 Z" fill="var(--ink-3)" stroke="var(--ink)" stroke-width="1.4" opacity="0.7"/>' +
    '<circle cx="296" cy="148" r="6" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.6"/>' +
    L(440, 190, 456, 206, { c: 'm', w: 2.6, m: 'm5f1' }) +
    T(306, 128, 'gancho de amura', { a: 'start', s: 13, h: 1 }) +
    T(440, 168, 'cabo do rizo', { a: 'end', s: 13, c: 'var(--magenta)', h: 1 }) +
    T(372, 236, 'pano recolhido na retranca', { s: 12 }) + T(370, 258, 'Vela com um rizo', { b: 1, s: 14 }), 580);

  // F19: capear (barco com a genoa a contravento, grande folgada e leme orçando)
  var F_CAPEAR = fig('m5f2', '0 0 470 280', 'Barco capeado: proa a cerca de 50 a 60 graus do vento, genoa a contravento empurrando a proa para longe do vento, leme todo orçando e grande folgada; o barco deriva devagar e deixa uma esteira lisa a barlavento',
    '<path d="M0 0 L230 0 L230 170 L0 170 Z" fill="none"/>' +
    L(150, 6, 150, 46, { c: 'b', w: 3, m: 'm5f2' }) + T(164, 24, 'vento', { a: 'start', b: 1, c: 'var(--nav-blue)' }) +
    '<path d="M70 56 Q130 80 168 150 L120 190 Q70 130 70 56 Z" fill="var(--sea-2)" opacity="0.6"/>' + T(8, 100, 'esteira lisa', { a: 'start', s: 13 }) + T(8, 116, 'a barlavento', { a: 'start', s: 13 }) +
    barco(200, 150, 55, 1.2, '<path d="M0 -8 Q16 12 22 34" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/><path d="M0 -44 Q-10 -26 -22 -4" fill="none" stroke="var(--nav-red)" stroke-width="3.4" stroke-linecap="round"/>') +
    '<path d="M244 120 A70 70 0 0 1 270 180" fill="none" stroke="var(--nav-red)" stroke-width="3" marker-end="url(#m5f2-r)"/>' +
    T(282, 130, 'genoa a contravento:', { a: 'start', s: 13, c: 'var(--nav-red)', b: 1 }) + T(282, 146, 'a proa cai', { a: 'start', s: 13 }) +
    '<path d="M122 190 A60 60 0 0 1 168 214" fill="none" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m5f2-m)"/>' +
    T(116, 206, 'leme orçando:', { a: 'end', s: 13, c: 'var(--magenta)', b: 1 }) + T(116, 222, 'a proa sobe', { a: 'end', s: 13 }) +
    L(214, 168, 250, 244, { c: 'g', w: 3, m: 'm5f2' }) + T(256, 248, 'deriva lenta (≈ 1 nó ou menos)', { a: 'start', s: 13, c: 'var(--nav-green)' }) +
    T(310, 60, 'grande folgada', { a: 'start', s: 13 }) + L(308, 64, 236, 138, { w: 1, d: '3 3' }), 580);

  // F20: drogue (por trás) e âncora flutuante (pela proa)
  var F_DROGUE = (function () {
    function onda(y, a, ph) {
      var d = 'M0 ' + y;
      for (var x = 0; x <= 460; x += 10) d += ' L' + x + ' ' + r1(y + a * Math.sin((x + ph) / 22));
      return '<path d="' + d + '" fill="none" stroke="var(--sea-3)" stroke-width="3"/>';
    }
    function lado(x, y, flip) {
      var f = flip ? -1 : 1;
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + f + ' 1)"><path d="M-34 0 L36 -2 L28 12 L-26 12 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/><line x1="0" y1="-2" x2="0" y2="-44" stroke="var(--ink)" stroke-width="2.4"/></g>';
    }
    function cone(x, y) { return '<path d="M' + x + ' ' + y + ' l14 -8 l0 16 Z" fill="var(--magenta)" stroke="var(--ink)" stroke-width="1.2"/>'; }
    return fig('m5f3', '0 0 470 290', 'Acima, um barco correndo com o tempo com uma âncora de arrasto (drogue) rebocada pela popa; abaixo, um barco com a proa ao mar, seguro por uma âncora flutuante lançada pela proa',
      onda(60, 8, 0) + onda(150, 8, 30) +
      L(360, 20, 430, 20, { c: 'b', w: 2.4, m: 'm5f3' }) + T(462, 44, 'mar', { a: 'end', s: 13, c: 'var(--nav-blue)' }) +
      lado(260, 52, false) +
      '<line x1="224" y1="56" x2="120" y2="64" stroke="var(--ink)" stroke-width="1.6"/>' + cone(106, 66) + cone(86, 66) + cone(66, 66) + cone(46, 66) +
      T(36, 98, 'drogue: segura a popa e', { a: 'start', s: 13 }) + T(36, 114, 'modera a velocidade', { a: 'start', s: 13 }) +
      T(16, 22, 'Correr com o tempo', { a: 'start', s: 14, b: 1 }) + T(16, 138, 'Proa ao mar', { a: 'start', s: 14, b: 1 }) +
      lado(300, 160, true) +
      '<line x1="334" y1="164" x2="130" y2="182" stroke="var(--ink)" stroke-width="1.6"/>' +
      '<path d="M130 182 C96 160 96 206 130 182 Z" fill="var(--magenta)" stroke="var(--ink)" stroke-width="1.6"/><path d="M130 182 C100 170 100 194 130 182" fill="none" stroke="var(--ink)" stroke-width="1"/>' +
      T(36, 230, 'âncora flutuante: segura a proa', { a: 'start', s: 13 }) + T(36, 246, 'ao mar, o barco quase para', { a: 'start', s: 13 }) +
      T(300, 218, 'linha longa, com proteção', { a: 'start', s: 13 }) + T(300, 234, 'contra o atrito', { a: 'start', s: 13 }) +
      T(235, 280, 'Noções: o equipamento certo depende do barco; treine antes de precisar.', { s: 12 }), 580);
  })();
  VL.dado('cursos/vela-1', {
    modulos: [
      /* =============================================================================== M1 */
      {
        id: 'm1', titulo: 'Como um veleiro anda',
        resumo: 'A física que todo velejador precisa sentir: vento real e vento aparente, a vela como asa e como parede, o papel da quilha contra o abatimento, a banda e o momento de endireitamento, e por que o barco não segue contra o vento.',
        licoes: [
          /* ---------------------------------------------------------------- l1 */
          {
            id: 'l1', titulo: 'Vento real e vento aparente', minutos: 10,
            objetivos: [
              'Distinguir o vento real (ou verdadeiro) do vento aparente.',
              'Explicar por que o vento aparente fica mais forte e mais para a proa na bolina, e mais fraco na popa.',
              'Usar o triângulo de velocidades para estimar o vento aparente.',
            ],
            blocos: [
              { t: 'p', html: 'Num dia sem vento você anda de bicicleta e sente o ar no rosto. Esse ar não está parado em relação a você: <b>é você que se move através dele</b>. Num veleiro acontece a mesma coisa, e isso muda tudo no que se refere a velas.' },
              { t: 'p', html: 'O <b>vento real</b> (também chamado de <b>vento verdadeiro</b>) é o ar se movendo em relação à superfície da Terra: é o que uma bandeira num mastro fixo, no cais, mostraria. Nós o nomeamos pela direção <i>de onde ele sopra</i>: vento de nordeste vem do nordeste. O <b>vento aparente</b> é o ar que se move em relação ao <i>barco em movimento</i>. É esse que enche as velas, que o anemômetro de bordo mede e que a biruta no topo do mastro aponta.' },
              { t: 'termos', ids: ['vento-real', 'vento-aparente', 'zona-morta', 'pontos-de-vela'] },
              { t: 'h', txt: 'Como se obtém o vento aparente' },
              { t: 'p', html: 'Quando o barco anda, ele cria um “vento do deslocamento”: do mesmo tamanho da velocidade do barco e apontando para trás. O vento aparente é a <b>soma vetorial</b> do vento real com esse vento do deslocamento. Desenhando os dois vetores um depois do outro, o terceiro lado do triângulo é o vento aparente.' },
              { t: 'figura', svg: F_TRIANGULO, legenda: 'Exemplo: vento real de 12 nós entrando a 60° da proa e o barco a 6 nós. O ar que a vela sente tem 15,9 nós e vem de 41° da proa: mais forte e mais de frente que o vento real.' },
              { t: 'p', html: 'Em fórmulas (não precisa decorar): com vento real <i>VV</i>, velocidade do barco <i>VB</i> e ângulo do vento real <i>α</i> medido a partir da proa, a velocidade aparente é raiz de (<i>VV</i>² + <i>VB</i>² + 2·<i>VV</i>·<i>VB</i>·cos <i>α</i>). Os instrumentos fazem essa conta o tempo todo, no caminho inverso: medem o vento aparente e a velocidade do barco e calculam o vento real.' },
              { t: 'h', txt: 'O que isso significa na prática' },
              { t: 'tabela', cab: ['Ponto de vela', 'Vento real', 'Barco', 'Vento aparente'],
                linhas: [
                  ['Bolina (45° da proa)', '12 nós', '5,8 nós', '16,6 nós, a 31° da proa'],
                  ['Través (90°)', '12 nós', '6,9 nós', '13,8 nós, a 60° da proa'],
                  ['Largo (135°)', '12 nós', '6,4 nós', '8,7 nós, a 104° da proa'],
                  ['Popa (180°)', '12 nós', '5,0 nós', '7,0 nós, de trás'],
                ],
                legenda: 'Velocidades do barco da polar aproximada do simulador desta página (por exemplo, um cruzeiro de 32 pés, ≈9,75 m, em mar calmo e com velas bem reguladas). São didáticas: o seu barco terá outros números (barcos maiores, com mais comprimento de linha d’água, são mais rápidos), mas a tendência é a mesma.' },
              { t: 'lista', itens: [
                '<b>Na bolina</b>, o vento aparente é <b>mais forte</b> e vem <b>mais de proa</b> que o real. O barco aderna mais e o vento “parece” bem mais forte.',
                '<b>Na popa</b>, o vento aparente é <b>muito mais fraco</b>: o barco “foge” do vento. O dia parece ameno, as velas panejam menos e o cockpit fica quente.',
                '<b>Ao orçar</b> (virar para o vento), o aparente se fecha e cresce; <b>ao arribar</b> (virar para longe do vento), ele abre e diminui. O vento aparente é sempre mais de proa que o real, porque o deslocamento “puxa” o vento para a frente.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'A popa engana', html: 'Com vento real de 12 nós, o aparente é 7 nós na popa e quase 17 na bolina: a força nas velas varia com o <b>quadrado</b> da velocidade do vento, portanto é mais de cinco vezes maior na bolina. Quem navega descontraído na popa e vira para a bolina pega mais que o dobro do vento “de repente”. Antes de arribar para fugir de uma situação, ou de orçar para voltar, pense no que o vento aparente fará, e reduza pano <b>antes</b>.' },
              { t: 'widget', w: 'mareacao', opts: { proa: 60, vento: 12, escota: 40 }, legenda: 'Gire o barco devagar (arraste ou use os botões orçar e arribar). Acompanhe como o vento aparente (velocidade e ângulo) muda a cada ponto de vela, mesmo com o vento real constante.' },
              { t: 'check', questoes: [
                { id: 'vela1-l1-1', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 1,
                  enunciado: 'Um veleiro navega de bolina, a 5 nós, com vento real de 12 nós. Em comparação com o vento real, o vento aparente a bordo é:',
                  alternativas: ['Mais fraco e vem mais de popa.', 'Mais forte e vem mais de proa.', 'Igual em força, mas vem mais de proa.', 'Mais forte, mas vem do mesmo ângulo.'],
                  correta: 1,
                  explicacao: 'O vento aparente é a soma do vento real com o vento do deslocamento, que aponta para trás. Na bolina os dois vetores se somam em parte: o resultado é mais forte e, como o deslocamento “puxa” o ar para a proa, vem de um ângulo mais fechado. Na popa seria o contrário (mais fraco), e em nenhum caso ele tem a mesma força e o mesmo ângulo do vento real, a não ser com o barco parado.',
                  referencia: 'RYA Day Skipper Handbook (Sail), vento aparente; Marchaj, Aero-Hydrodynamics of Sailing' },
                { id: 'vela1-l1-2', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Com vento real de 15 nós, um barco corre em popa (vento real vindo exatamente de trás) a 6 nós. Que vento aparente os tripulantes sentem?',
                  alternativas: ['6 nós.', '9 nós.', '15 nós.', '21 nós.'],
                  correta: 1,
                  explicacao: 'Em popa total os vetores têm a mesma direção e sentidos opostos: o vento do deslocamento (6 nós, para trás) subtrai-se do vento real (15 nós, para a frente). 15 − 6 = 9 nós, vindo de trás. Dar 21 nós seria somar, o que só vale com o vento de proa. Dar 6 nós confundiria o vento aparente com o vento do deslocamento; 15 nós seria o vento real, que só vale com o barco parado.',
                  referencia: 'Triângulo de velocidades (soma vetorial); RYA Day Skipper Handbook' },
                { id: 'vela1-l1-3', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Qual vento enche as velas e é o que o anemômetro de um veleiro em movimento mede?',
                  alternativas: ['O vento real, medido em relação à Terra.', 'O vento aparente, medido em relação ao barco em movimento.', 'O vento do deslocamento, medido a partir do casco.', 'O vento geostrófico da carta sinótica.'],
                  correta: 1,
                  explicacao: 'O anemômetro está preso ao barco, e o ar que passa por ele é o aparente: a soma do real com o vento do deslocamento. O real só é obtido por cálculo (o instrumento subtrai a velocidade do barco). O vento do deslocamento é apenas uma das parcelas, e o vento geostrófico é um conceito de meteorologia em altitude, que não é medido a bordo.',
                  referencia: 'RYA Day Skipper Handbook (Sail); WMO, Guide to Instruments and Methods of Observation' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ, wk('Apparent wind', 'Apparent_wind'), wk('Wind triangle', 'Wind_triangle')] },
            ],
          },
          /* ---------------------------------------------------------------- l2 */
          {
            id: 'l2', titulo: 'A vela como asa e como parede', minutos: 11,
            objetivos: [
              'Explicar que, com o vento pela proa e pelo través, a vela funciona como uma asa (sustentação).',
              'Explicar que, com o vento por trás, a vela funciona sobretudo por arrasto.',
              'Relacionar o ângulo de ataque com a regulagem e as birutas.',
            ],
            blocos: [
              { t: 'p', html: 'Veleiros antigos de pano quadrado só andavam com o vento pela popa: a vela era uma <b>parede</b> empurrada pelo ar. A vela moderna faz algo bem mais esperto. Com o vento vindo da frente ou do lado, ela se comporta como uma <b>asa de avião posta de pé</b>, e é por isso que um veleiro consegue avançar a menos de 90° do vento e até chegar perto de 45° dele.' },
              { t: 'h', txt: 'Vela como asa: sustentação' },
              { t: 'p', html: 'A vela tem uma curvatura, a <b>bolsa</b>, e é posta em um pequeno <b>ângulo de ataque</b> em relação ao vento aparente (o ângulo entre a corda da vela e o fluxo do ar). O ar é desviado pela vela. Do lado convexo, o de <b>sotavento</b>, a pressão fica menor que a atmosférica; do lado côncavo, o de <b>barlavento</b>, fica um pouco maior. A diferença de pressão empurra a vela do lado de maior para o de menor pressão.' },
              { t: 'figura', svg: F_ASA, legenda: 'Bolina, vista de cima. A força total na vela é aproximadamente perpendicular ao vento aparente (sustentação) com uma pequena parcela no sentido do vento (arrasto). Ela se divide numa parte que empurra para a frente e numa parte, bem maior, que empurra de lado.' },
              { t: 'callout', tipo: 'nota', titulo: 'Atenção a uma explicação popular e errada', html: 'Muita gente aprendeu que “o ar percorre o caminho mais longo na parte curva e por isso precisa ir mais rápido”. A ideia de que as duas partes do ar “têm que chegar juntas” ao fim da vela não é verdadeira. O que importa é que a vela <b>desvia o ar</b> e que o fluxo acelerado do lado de sotavento tem menor pressão; as duas descrições (força de desvio do ar e diferença de pressão) são faces do mesmo fenômeno.' },
              { t: 'p', html: 'Repare no desenho: mesmo na bolina, quase toda a força vai <b>de lado</b>, e só uma parcela menor empurra para a frente. É por isso que o veleiro precisa de uma quilha (lição 3) e que, ao ceder a força lateral demais, ele <i>adorna</i> (lição 4).' },
              { t: 'h', txt: 'O ângulo de ataque: nem de menos, nem de mais' },
              { t: 'lista', itens: [
                '<b>Ângulo de ataque pequeno demais</b> (vela folgada demais para o rumo): o ar chega quase paralelo à vela, a biruta de barlavento levanta e, no limite, a testa da vela <b>bate</b> (a vela “paneja”). Perde-se força.',
                '<b>Ângulo certo</b>: o fluxo fica <b>colado</b> nos dois lados. As birutas dos dois lados ficam paralelas e para trás.',
                '<b>Ângulo de ataque grande demais</b> (vela caçada demais para aquele rumo): o fluxo <b>descola</b> do lado de sotavento e vira turbulência, o <b>estol</b>. A força cai, o arrasto sobe e o barco perde velocidade. As birutas de sotavento giram ou caem.',
              ] },
              { t: 'p', html: 'No simulador desta página, o ângulo de ataque ideal fica entre cerca de 10° e 25° e as birutas mostram isso. Na vida real a faixa varia com a vela, a força do vento e o mar, mas a lógica é a mesma: <b>folgue a escota até a vela começar a bater e então cace um pouco</b>.' },
              { t: 'h', txt: 'Vela como parede: arrasto' },
              { t: 'p', html: 'Quando o vento aparente vem de muito atrás (mais ou menos além de 100° da proa), não há mais como manter o fluxo colado: a vela está tão aberta que o ar não consegue dar a volta na curva. A vela funciona então <b>sobretudo por arrasto</b>, empurrada pelo ar como uma parede, e a regulagem certa é folgar até perto do brandal, abrir a vela o máximo possível. Para esses rumos existem velas próprias, como o balão e o gennaker, bem mais largas e curvas.' },
              { t: 'figura', svg: F_ARRASTO, legenda: 'Vento por trás: a vela está aberta, quase de través. A força empurra para a frente e nada de lado, e por isso o barco aderna pouco. A velocidade é limitada, porque o barco “foge” do próprio vento.' },
              { t: 'callout', tipo: 'dica', titulo: 'A prova na prática', html: 'Chegue no barco, solte a escota por completo e a vela vira uma bandeira. Cace devagar até o pano parar de bater, depois mais um pouco. Esse “ponto de bater” é a referência para toda a regulagem do curso. Quando o vento aparente muda (porque o vento ou o rumo mudaram), reencontre-o.' },
              { t: 'widget', w: 'mareacao', opts: { proa: 90, escota: 10, vento: 10 }, legenda: 'Com o barco de través e a escota quase toda folgada, as birutas mostram a vela batendo. Cace aos poucos até as birutas ficarem paralelas, e depois exagere para ver o estol.' },
              { t: 'check', questoes: [
                { id: 'vela1-l2-1', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 1,
                  enunciado: 'Na bolina, a vela de um veleiro funciona principalmente como:',
                  alternativas: ['Uma parede de pano, empurrada pelo vento como numa vela quadrada.', 'Uma asa, em que a diferença de pressão entre os dois lados gera a força.', 'Um paraquedas, que freia o ar e puxa o barco para a frente.', 'Um espelho, que reflete o vento para trás e dá impulso ao casco.'],
                  correta: 1,
                  explicacao: 'Com vento aparente pela proa ou pelo través, o ar escoa pelos dois lados da vela curva. O lado de sotavento fica com pressão menor, e a diferença de pressão gera a força, que é a sustentação de uma asa. Funcionar como parede (arrasto) só vale quando o vento vem de muito atrás. Paraquedas e espelho não descrevem o fenômeno.',
                  referencia: 'Marchaj, Aero-Hydrodynamics of Sailing; RYA Sail Cruising Syllabus' },
                { id: 'vela1-l2-2', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'A vela está caçada demais para o rumo, as birutas de sotavento giram ou caem e o barco perde velocidade. O que está acontecendo e o que fazer?',
                  alternativas: ['A vela está panejando; cace mais.', 'O fluxo descolou (estol); folgue a escota ou orce menos.', 'O vento diminuiu; mude para uma vela maior.', 'O leme está pesado; cace o burro.'],
                  correta: 1,
                  explicacao: 'Birutas de sotavento caindo ou girando mostram fluxo descolado, o estol: o ângulo de ataque ficou grande demais. A cura é reduzir o ângulo, folgando a escota (ou arribando um pouco). Caçar mais pioraria o estol; a vela batendo mostra o problema oposto. Trocar de vela ou mexer no burro não resolve um descolamento causado pelo ângulo.',
                  referencia: 'RYA Day Skipper Handbook (Sail), trimagem; Marchaj, Sail Performance' },
                { id: 'vela1-l2-3', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Quando o vento aparente vem de muito atrás, a vela funciona sobretudo:',
                  alternativas: ['Por sustentação, como na bolina.', 'Por arrasto, empurrada pelo ar como uma parede.', 'Por efeito Coriolis.', 'Por tensão superficial da água.'],
                  correta: 1,
                  explicacao: 'Com o vento muito aberto, o fluxo não consegue ficar colado na curva da vela, e a força vem do ar que bate nela: arrasto. A regulagem então é de vela aberta, escota folgada. Coriolis é uma força de grande escala na atmosfera, sem papel direto na vela, e a tensão superficial é irrelevante aqui.',
                  referencia: 'Marchaj, Aero-Hydrodynamics of Sailing; Garrett, The Symmetry of Sailing' },
              ] },
              { t: 'fontes', itens: [MARCHAJ, MARCHAJ2, GARRETT, RYA, wk('Lift (force)', 'Lift_(force)'), wk('Angle of attack', 'Angle_of_attack')] },
            ],
          },
          /* ---------------------------------------------------------------- l3 */
          {
            id: 'l3', titulo: 'Quilha, bolina e leme: contra o abatimento', minutos: 9,
            objetivos: [
              'Explicar o que é abatimento e por que a quilha o limita.',
              'Distinguir abatimento de deriva (corrente).',
              'Reconhecer os tipos de quilha e o que o leme faz a mais.',
            ],
            blocos: [
              { t: 'p', html: 'A lição anterior mostrou que, na bolina, a vela empurra o barco principalmente <b>de lado</b>. Se a água não impedisse, o barco iria de lado, como uma folha seca. O trabalho de quem impede isso é da <b>quilha</b> (ou da bolina móvel) e, em menor parte, do leme.' },
              { t: 'termos', ids: ['abatimento', 'deriva', 'quilha', 'bolina', 'leme', 'lastro'] },
              { t: 'h', txt: 'A quilha também é uma asa' },
              { t: 'p', html: 'A lâmina da quilha, dentro d’água, trabalha como uma asa sob a água. O barco não anda exatamente na direção em que a proa aponta: ele anda com uma pequena diferença angular, e é essa diferença, o <b>ângulo de ataque da quilha</b>, que faz a quilha gerar uma força lateral contrária à da vela. Essa diferença entre a direção da proa e o caminho que o barco realmente faz sobre a água é o <b>abatimento</b>.' },
              { t: 'figura', svg: F_ABATIMENTO, legenda: 'A vela empurra para sotavento e a quilha resiste. O equilíbrio exige que o barco ande levemente de lado, com a proa apontando um pouco mais para o vento que o caminho feito sobre a água.' },
              { t: 'p', html: 'Num cruzeiro bem regulado, na bolina, o abatimento fica na ordem de alguns graus. Ele <b>aumenta</b> com mar mexido, pouca velocidade (a quilha só gera força com fluxo de água), vela caçada demais, banda excessiva ou quilha pequena. Por isso, nas navegações de bolina o rumo realmente percorrido é o da proa corrigido pelo abatimento, algo que você vai aplicar também na navegação estimada.' },
              { t: 'callout', tipo: 'nota', titulo: 'Abatimento não é deriva', html: '<b>Abatimento</b> é o efeito do <i>vento</i> sobre o barco: ele escorrega para sotavento em relação à água. <b>Deriva</b> é o efeito da <i>corrente</i>: a própria água carrega o barco. Os dois podem existir ao mesmo tempo, e os dois se corrigem na carta, mas por razões diferentes.' },
              { t: 'h', txt: 'Tipos de quilha' },
              { t: 'tabela', cab: ['Tipo', 'Como é', 'Vantagem', 'Cuidado'],
                linhas: [
                  ['Quilha fixa de aleta, com ou sem bulbo (a mais comum em cruzeiros modernos)', 'Lâmina funda e curta, lastro (ferro ou chumbo) concentrado embaixo, leme separado', 'Boa bolina, boa estabilidade, rápida de manobrar', 'Calado grande; um encalhe bate forte no ponto onde a quilha se liga ao casco'],
                  ['Quilha longa', 'Quilha comprida, quase da proa à popa, leme preso a ela', 'Segue rumo reto, robusta, bom comportamento no mar', 'Pesada, lenta para virar, difícil de manobrar de ré'],
                  ['Bolina móvel (retrátil ou pivotante)', 'Lâmina que sobe e desce por uma caixa no casco', 'Calado pequeno para águas rasas e para encalhar na praia', 'Menos lastro fixo, exige atenção; não esqueça de baixar'],
                ],
                legenda: 'Os cruzeiros de série mais comuns hoje têm quilha fixa de aleta.' },
              { t: 'h', txt: 'O leme: governar, mas também ajudar' },
              { t: 'p', html: 'O leme também é uma pequena asa. Mudar seu ângulo gera uma força lateral na popa que gira o barco. Ele só governa se há <b>fluxo de água</b> passando por ele, ou seja, o barco precisa ter seguimento. Por isso, um veleiro parado (ou quase) não obedece ao leme, ponto importante em manobras de porto.' },
              { t: 'p', html: 'Com vento de bolina, os cruzeiros costumam ter tendência a <b>orçar</b> sozinhos: o timoneiro precisa segurar a cana do lado do vento (barlavento) para manter o rumo. Em inglês é o <i>weather helm</i>; entre velejadores brasileiros costuma-se dizer que o barco é “ardente”. Um pouco é bom, dá ao leme uma sensação de “peso” que ajuda a sentir o barco. Demais é sinal de pano mal regulado: banda, vela caçada demais ou grande mal regulada (módulo 3), que força o leme e cria arrasto.' },
              { t: 'callout', tipo: 'dica', titulo: 'Leme duro é um aviso', html: 'Se você precisa de muito esforço e muito ângulo de leme para segurar o rumo, o barco está dizendo que há pano demais, ou o pano está mal regulado. Folgue a grande (escota ou carrinho), reduza a genoa ou dê o primeiro rizo. Quase sempre o barco fica mais rápido <i>e</i> mais confortável.' },
              { t: 'check', questoes: [
                { id: 'vela1-l3-1', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 1,
                  enunciado: 'Qual é a função principal da quilha (ou da bolina) num veleiro?',
                  alternativas: ['Aumentar a área de vela exposta ao vento nos rumos de bolina.', 'Resistir ao abatimento com sua força lateral e, com o lastro, dar estabilidade.', 'Servir de apoio estrutural ao leme, que fica na popa do casco.', 'Dar mais velocidade ao barco quando o vento vem de popa.'],
                  correta: 1,
                  explicacao: 'A lâmina da quilha, como uma asa dentro d’água, gera a força lateral que equilibra a da vela e limita o abatimento; o lastro no seu fundo contribui para a estabilidade. A área de vela depende do aparelho, o leme é uma peça separada e, no vento de popa, a quilha pouco influencia a velocidade.',
                  referencia: 'RYA Day Skipper Handbook; Marchaj, Aero-Hydrodynamics of Sailing' },
                { id: 'vela1-l3-2', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Qual a diferença entre abatimento e deriva?',
                  alternativas: ['Não há diferença: os dois são o efeito da corrente.', 'Abatimento é o efeito do vento sobre o barco; deriva é o efeito da corrente.', 'Abatimento é o efeito da corrente; deriva é o do vento.', 'Abatimento ocorre só na popa; deriva só na bolina.'],
                  correta: 1,
                  explicacao: 'O abatimento nasce do vento empurrando o barco de lado em relação à água; a deriva é a água em si se movendo, levando o barco consigo. A navegação estima os dois separadamente. As outras alternativas trocam as causas ou criam restrições de ponto de vela que não existem (o abatimento é maior na bolina, mas não só nela).',
                  referencia: 'Miguens, Navegação: a Ciência e a Arte, vol. I (abatimento e corrente); glossário do app' },
                { id: 'vela1-l3-3', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Um veleiro parado, sem seguimento, com o leme todo virado, quase não muda de direção. Por quê?',
                  alternativas: ['O leme só gira a proa se houver fluxo de água passando por ele.', 'O leme é desligado quando a velocidade cai.', 'O vento sempre anula o efeito do leme.', 'O leme só funciona em barcos de roda.'],
                  correta: 0,
                  explicacao: 'O leme é um perfil hidrodinâmico: a força que gira o barco depende da velocidade da água sobre ele. Sem seguimento ele quase não reage; é por isso que se manobra no porto com um pouco de máquina ou de velocidade. Não existe “desligamento”, o vento não anula o leme por princípio e o princípio vale para roda ou cana.',
                  referencia: 'RYA Day Skipper Handbook; Marchaj, Aero-Hydrodynamics of Sailing' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ, wk('Keel', 'Keel'), wk('Fin keel', 'Fin_keel'), wk('Leeway', 'Leeway')] },
            ],
          },
          /* ---------------------------------------------------------------- l4 */
          {
            id: 'l4', titulo: 'Banda e momento de endireitamento', minutos: 10,
            objetivos: [
              'Explicar por que o barco aderna e por que ele não vira.',
              'Descrever o momento de endireitamento (peso × braço) e o que o limita.',
              'Aplicar a regra prática: a banda excessiva pede menos pano.',
            ],
            blocos: [
              { t: 'p', html: 'Toda força lateral na vela tenta <b>inclinar</b> o barco. A inclinação lateral é a <b>banda</b> (ou <b>adernamento</b>), e o barco aderna sempre para sotavento, o lado de onde o vento não vem. Entender como o barco resiste a essa inclinação é entender por que um veleiro de cruzeiro, mesmo muito deitado, volta à posição normal.' },
              { t: 'termos', ids: ['banda', 'estabilidade', 'lastro', 'borda-livre'] },
              { t: 'h', txt: 'Dois momentos que lutam' },
              { t: 'p', html: 'O vento empurra a vela, num ponto alto do mastro, e a quilha resiste, num ponto baixo. Essas duas forças, mesmo iguais e opostas, formam um <b>binário</b> que gira o barco: o <b>momento de inclinação</b>. Em sentido contrário age o <b>momento de endireitamento</b>, formado por outro binário:' },
              { t: 'lista', itens: [
                'o <b>peso</b> do barco, que age para baixo no <b>centro de gravidade (G)</b>, sempre baixo nos cruzeiros porque o lastro fica embaixo;',
                'o <b>empuxo</b> da água, que age para cima no <b>centro de carena (B)</b>, o centro do volume submerso. Ao adernar, o volume submerso muda de forma e B se desloca para o lado que afunda, o de sotavento.',
              ] },
              { t: 'figura', svg: F_BANDA, legenda: 'Quanto mais separadas ficam as duas linhas verticais (peso em G, empuxo em B), maior o braço GZ e mais forte o momento de endireitamento. O momento é o peso do barco vezes o braço GZ.' },
              { t: 'p', html: 'Dois fatores constroem o braço GZ: a <b>forma</b> do casco (um casco largo tem B que se desloca muito) e o <b>lastro</b> baixo (que mantém G fundo). Um casco largo é “duro” (resiste logo) quando levemente inclinado, mas costuma ter um ângulo de estabilidade nula menor. Um casco estreito e bem lastrado é mais “macio” no início, porém conserva a capacidade de voltar até ângulos maiores.' },
              { t: 'callout', tipo: 'nota', titulo: 'O barco não vira com facilidade', html: 'À medida que o ângulo aumenta, o braço GZ cresce até um máximo e depois diminui, até zerar num ângulo chamado de <b>ângulo de estabilidade nula</b>. Cruzeiros oceânicos bem concebidos têm esse ângulo bem acima de 90° (em geral entre cerca de 110° e 130° ou mais), mas o valor varia muito com o projeto. Passando dele, o barco tende a ficar emborcado. Não precisa decorar números: o que importa é que a estabilidade <b>não é infinita</b> e que o mar grosso pode levar o barco a ângulos grandes.' },
              { t: 'h', txt: 'Quanto de banda é bom' },
              { t: 'p', html: 'A força do vento cresce com o <b>quadrado</b> da sua velocidade: ao dobrar o vento, a força nas velas quadruplica. É por isso que o barco que andava confortável a 10 nós de repente “deita” a 20 nós. Como orientação geral, os cruzeiros de quilha costumam andar bem na bolina com cerca de 15° a 20° de banda. Acima disso, quase sempre perdem rendimento:' },
              { t: 'lista', itens: [
                'a área de vela vista pelo vento diminui e a vela é inclinada, com a força apontando mais para o lado;',
                'o leme, inclinado, trabalha pior e exige mais ângulo para segurar o rumo (o barco “ardente”), gerando arrasto;',
                'a quilha fica inclinada e perde eficiência contra o abatimento;',
                'a tripulação sofre: enjoo, perda de equilíbrio, risco de queda, coisas voando na cabine.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Banda excessiva pede menos pano, não mais coragem', html: 'Se a borda de sotavento está na água, se o leme tem que ir muito virado, ou se o cockpit já é um lugar difícil, reduza pano. As formas: folgar a escota da grande ou descer o carrinho a sotavento, esticar o estai de popa, o cunningham e a esteira para achatar a vela, rizar a grande, enrolar parte da genoa. É melhor reduzir cedo e depois largar pano que reduzir tarde e debaixo de rajada.' },
              { t: 'p', html: 'A distribuição dos pesos ajuda um pouco. Num veleiro de cruzeiro o efeito de levar a tripulação para barlavento é pequeno perto do momento do lastro, mas ainda ajuda em ventos leves; e guardar peso (água, âncora de reserva, ferramentas) baixo e no centro ajuda sempre.' },
              { t: 'widget', w: 'veleiro-3d', opts: { vento: 60, forca: 18, grupo: 'velas', vista: 'proa' }, legenda: 'Aumente a força do vento e veja a banda crescer. Depois acrescente um rizo na grande e enrole um pouco da genoa: a banda cai porque a área de vela diminui.' },
              { t: 'check', questoes: [
                { id: 'vela1-l4-1', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 1,
                  enunciado: 'O veleiro aderna sempre para:',
                  alternativas: ['Barlavento, o lado de onde vem o vento.', 'Sotavento, o lado oposto ao do vento.', 'Boreste.', 'O lado em que fica a retranca.'],
                  correta: 1,
                  explicacao: 'A força do vento nas velas empurra o barco para longe do vento, e o barco aderna para sotavento. Barlavento seria o lado em que ele “levanta”. Boreste ou bombordo dependem do bordo em que se navega, e a retranca fica ao lado de sotavento, mas só por consequência da regulagem, não por causa da banda.',
                  referencia: 'RYA Day Skipper Handbook (Sail)' },
                { id: 'vela1-l4-2', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'O vento sobe de 10 para 20 nós (dobra). Em termos aproximados, o que acontece com a força nas velas?',
                  alternativas: ['Dobra, porque a força é proporcional à velocidade.', 'Quadruplica, porque a força varia com o quadrado da velocidade.', 'Aumenta só uns 10%, por causa da inércia do barco.', 'Permanece igual, só muda a direção em que atua.'],
                  correta: 1,
                  explicacao: 'A pressão do vento sobre uma superfície varia com o quadrado da velocidade. Dobrar a velocidade (10 para 20 nós) leva a força a quatro vezes o valor, e é por isso que o aumento do vento é tão sentido no barco. Dobrar a força seria uma dependência linear; 10% ou nada mudar contradizem a física.',
                  referencia: 'Marchaj, Aero-Hydrodynamics of Sailing; RYA Day Skipper Handbook' },
                { id: 'vela1-l4-3', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'O momento de endireitamento de um veleiro é igual a:',
                  alternativas: ['Velocidade do vento vezes a área da vela.', 'Peso do barco vezes o braço de endireitamento (GZ).', 'Calado vezes boca.', 'Comprimento do mastro vezes o peso do lastro.'],
                  correta: 1,
                  explicacao: 'O momento de endireitamento é o binário formado pelo peso (em G) e pelo empuxo (em B), valendo peso (deslocamento) vezes o braço GZ. A primeira alternativa é uma força, não um momento de endireitamento; calado × boca e mastro × lastro não têm significado físico direto para a estabilidade.',
                  referencia: 'Estabilidade de embarcações (princípios); ISO 12217-2; RYA Yachtmaster Offshore Handbook' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ, { txt: 'ISO 12217-2, Small craft: stability and buoyancy assessment (embarcações a vela)' }, wk('Righting moment', 'Righting_moment'), wk('Metacentric height', 'Metacentric_height'), wk('Capsizing', 'Capsizing')] },
            ],
          },
          /* ---------------------------------------------------------------- l5 */
          {
            id: 'l5', titulo: 'Por que não se veleja contra o vento', minutos: 8,
            objetivos: [
              'Explicar a zona morta e por que ela existe.',
              'Calcular o custo de bordejar em distância.',
              'Reconhecer o barco “no vento” e como sair dele.',
            ],
            blocos: [
              { t: 'p', html: 'Ninguém consegue velejar <i>direto</i> contra o vento. Isso não tem nada a ver com o barco ser bom ou ruim: é a física da vela. Mas qualquer veleiro consegue chegar a um ponto que está <b>contra o vento</b>, se aceitar ir em zigue-zague.' },
              { t: 'termos', ids: ['zona-morta', 'bordejar', 'aproado', 'bolina-cerrada', 'orcar'] },
              { t: 'h', txt: 'A zona morta' },
              { t: 'p', html: 'Na lição 2 vimos que a vela gera força quase perpendicular ao vento aparente. Se o barco aponta cada vez mais para o vento, essa força aponta cada vez mais de lado e cada vez menos para a frente. Quando a proa chega a cerca de <b>40° a 50° do vento real</b> (um pouco menos em barcos de regata, mais em barcos pesados ou com mar), a parcela para a frente praticamente some, e o arrasto do casco ganha. É a <b>zona morta</b> (<i>no-go zone</i>, ou “aproado”, quando o barco está de fato com a proa no vento).' },
              { t: 'figura', svg: F_ZONA, legenda: 'À esquerda, a zona morta em torno do vento (45° é uma referência; o simulador usa 35° de cada lado). À direita, o caminho de A (de onde se parte) para B (diretamente contra o vento) em quatro bordos de 45°.' },
              { t: 'h', txt: 'Bordejar: quanto custa' },
              { t: 'p', html: 'Para ir de A a B diretamente contra o vento, o barco <b>bordeja</b>: segue com o vento de um bordo, depois vira de bordo (cambada, módulo 4) e segue com o vento do outro. Cada bordo a 45° do vento percorre 1 ÷ cos 45° ≈ <b>1,41 vez</b> a distância que realmente “ganha” contra o vento. Ou seja, para cada milha de avanço direto contra o vento, o barco navega cerca de <b>1,4 milha</b>, sem contar abatimento, ondas e corrente. Na prática, bem mais que isso.' },
              { t: 'callout', tipo: 'dica', titulo: 'Quantos bordos vale a pena dar?', html: 'Cada cambada custa velocidade (o barco desacelera e precisa recuperar). Com pouco vento ou mar mexido, prefira bordos mais longos e menos cambadas. Com vento regular e águas planas, bordos curtos e bem comandados mantêm o barco perto da linha direta. A escolha do lado também conta: um vento que roda a favor, uma corrente ou uma costa que desvia o vento podem fazer um bordo valer mais que o outro.' },
              { t: 'h', txt: 'Quando o barco “fica no vento”' },
              { t: 'p', html: 'Se a proa apontar para dentro da zona morta e o barco perder o seguimento, ele “para” e fica <b>aproado</b>, com as velas batendo (<i>in irons</i>). Sem seguimento, o leme não funciona. Para sair: folgue as escotas e segure a genoa (ou a testa dela) <b>contra o vento</b>, para o lado contrário àquele para onde você quer a proa. O vento a empurra e a proa cai. Lembre-se de que, enquanto o barco recua, o leme age ao contrário do normal. Assim que a proa cair e o vento entrar pelo lado certo, solte a genoa, cace as escotas e retome o governo.' },
              { t: 'h', txt: 'E a popa total?' },
              { t: 'p', html: 'O oposto da zona morta é a popa total (vento de trás). Ali não falta potência, mas há outro problema: um pequeno desvio faz o vento passar para o lado de trás da vela. É o <b>jaibe acidental</b>, que veremos no módulo 4. Por isso, na prática, velejadores raramente seguem direto em popa: preferem navegar ligeiramente abertos para um lado ou para o outro (“asa de pombo” ou em zigue-zague de popa).' },
              { t: 'widget', w: 'mareacao', opts: { modo: 'desafio', desafios: ['traves', 'cerrada', 'largo', 'popa'] }, legenda: 'Desafios: leve o barco aos principais pontos de vela e perceba onde a zona morta começa.' },
              { t: 'check', questoes: [
                { id: 'vela1-l5-1', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 1,
                  enunciado: 'Um veleiro de cruzeiro pode velejar diretamente contra o vento?',
                  alternativas: ['Sim, desde que tenha uma vela grande de bom tamanho.', 'Não: dentro de uns 40° a 50° do vento não há força para a frente, e ele precisa bordejar.', 'Sim, desde que tenha uma quilha profunda e bem lastrada.', 'Sim, com o motor desligado e a escota toda caçada.'],
                  correta: 1,
                  explicacao: 'A força da vela é quase perpendicular ao vento aparente: abaixo de certo ângulo, a parcela útil para a frente se anula e o arrasto vence. Isso independe do tamanho da vela, da quilha ou da escota. Daí a necessidade de bordejar (ou de usar o motor).',
                  referencia: 'RYA Day Skipper Handbook (Sail); Marchaj, Aero-Hydrodynamics of Sailing' },
                { id: 'vela1-l5-2', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Um barco precisa chegar a um ponto exatamente contra o vento, a 10 milhas, bordejando a 45° do vento para cada lado. Qual a distância mínima a navegar, sem considerar abatimento e correntes?',
                  alternativas: ['10 milhas.', 'Cerca de 14 milhas.', 'Cerca de 20 milhas.', 'Cerca de 7 milhas.'],
                  correta: 1,
                  explicacao: 'Cada bordo a 45° do vento “ganha” contra o vento só cos 45° ≈ 0,71 da distância percorrida. Logo, para ganhar 10 milhas é preciso navegar 10 ÷ 0,71 ≈ 14,1 milhas. Em condições reais, com abatimento e ondas, o total é maior. 10 milhas só seria possível sem zigue-zague e 7 milhas não é possível. Vinte milhas corresponderia a bordos a 60°, o que é um mau rumo de bolina.',
                  referencia: 'Trigonometria básica; RYA Day Skipper Handbook (Sail)' },
                { id: 'vela1-l5-3', nivel: 'vela', tema: 'Como o veleiro anda', dificuldade: 2,
                  enunciado: 'Qual das situações abaixo descreve um barco aproado (<i>in irons</i>)?',
                  alternativas: ['Proa apontando para o vento, velas batendo, sem seguimento e sem governo.', 'Barco navegando de bolina cerrada com a genoa bem caçada.', 'Barco com o vento de popa e as velas em asa de pombo.', 'Barco com a âncora fundeada.'],
                  correta: 0,
                  explicacao: 'Aproado é ficar com a proa no vento e dentro da zona morta, as velas batendo e o barco sem avanço nem leme. Bolina cerrada é o ponto de vela mais próximo do limite, mas ainda com avanço. Asa de pombo é ponto de popa e o fundeio é outra situação. A saída é segurar a genoa contra o vento, para o lado contrário ao de onde se quer a proa, e usar o leme ao contrário enquanto o barco recua, até a proa cair.',
                  referencia: 'RYA Day Skipper Handbook (Sail), cambar e aproar' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ, wk('Tacking (sailing)', 'Tacking_(sailing)'), wk('Point of sail', 'Point_of_sail')] },
            ],
          },
        ],
      },
      /* =============================================================================== M2 */
      {
        id: 'm2', titulo: 'Anatomia de um veleiro de cruzeiro',
        resumo: 'O barco por dentro e por fora: casco, quilha e leme; convés e cockpit; mastreação fixa e móvel e as velas; motor diesel de centro; eletricidade de 12 V; água, gás, banheiro marítimo e bombas de porão.',
        licoes: [
          /* ---------------------------------------------------------------- l6 */
          {
            id: 'l6', titulo: 'Casco, quilha e leme', minutos: 9,
            objetivos: [
              'Nomear as medidas básicas de um veleiro de cruzeiro e as partes do casco.',
              'Explicar a velocidade de casco e por que um cruzeiro de deslocamento tem um limite natural.',
              'Descrever os tipos de leme e o que fazer se o sistema de governo falhar.',
            ],
            blocos: [
              { t: 'p', html: 'Os números desta lição usam como <b>exemplo</b> um cruzeiro de <b>32 pés</b>, com cerca de <b>9,75 m</b> de comprimento total (1 pé = 0,3048 m), um porte muito comum entre os cruzeiros que cruzam oceanos com família ou com uma tripulação pequena: grande o bastante para ser confortável e seguro, pequeno o bastante para ser manobrado por duas pessoas. O seu barco pode ser menor ou maior: o vocabulário é o mesmo, só as medidas mudam. Antes de tocar nas peças, vale conhecer o vocabulário básico do casco.' },
              { t: 'termos', ids: ['comprimento', 'boca', 'calado', 'borda-livre', 'obras-vivas', 'obras-mortas', 'linha-dagua', 'deslocamento'] },
              { t: 'figura', svg: F_PERFIL, legenda: 'Perfil de um cruzeiro de 32 pés. As obras vivas ficam abaixo da linha d’água; as mortas, acima. A quilha com bulbo leva o lastro; o leme suspenso fica na popa.' },
              { t: 'tabela', cab: ['Medida', 'O que é', 'Ordem de grandeza (exemplo: 32 pés)'],
                linhas: [
                  ['Comprimento total (LOA)', 'Da ponta da proa à ponta da popa', 'cerca de 9,75 m'],
                  ['Comprimento na linha d’água (LWL)', 'Comprimento do casco no ponto em que ele toca a água', 'em torno de 8,0 a 8,7 m'],
                  ['Boca', 'Maior largura do casco', 'cerca de 3,0 a 3,4 m'],
                  ['Calado', 'Da linha d’água ao ponto mais fundo (quilha ou bulbo)', 'cerca de 1,4 a 2,0 m'],
                  ['Deslocamento', 'Peso total do barco, igual ao da água deslocada', 'cerca de 4 a 6 toneladas'],
                  ['Lastro', 'Peso fixo (ferro ou chumbo), na quilha', 'em geral 30% a 40% do deslocamento'],
                ],
                legenda: 'São faixas típicas, não a ficha de um barco específico. Os números do seu barco estão no manual do proprietário.' },
              { t: 'h', txt: 'Material do casco' },
              { t: 'p', html: 'A maioria dos cruzeiros de série é de <b>plástico reforçado com fibra de vidro (PRFV)</b>: leve, durável, fácil de reparar. Há também cascos de aço (resistente, pesado, enferruja), de alumínio (leve, muito resistente, sensível à corrosão galvânica), de madeira moldada com epóxi e, mais raramente, de ferrocimento. No PRFV, o convés é muitas vezes um <b>sanduíche</b> com núcleo leve (balsa ou espuma); se entrar água nele, o núcleo se deteriora. Por isso as ferragens do convés têm de ser bem vedadas.' },
              { t: 'p', html: 'As <b>obras vivas</b> recebem tinta antiincrustante, que dificulta a fixação de cracas e algas. Casco sujo é lento: um casco com crostas perde muito rendimento. Peças de metal em contato com a água do mar (hélice, eixo, passa-cascos) são protegidas por <b>ânodos de sacrifício</b> (os “zincos”), que corroem no lugar das peças. Eles precisam ser trocados quando metade já se foi.' },
              { t: 'h', txt: 'Velocidade de casco' },
              { t: 'p', html: 'Um casco de deslocamento anda empurrando a água e forma uma onda de proa e outra de popa. Quanto mais rápido, mais longa a onda; ao chegar ao tamanho do próprio casco, o barco fica “preso” em sua onda e passa a exigir uma quantidade enorme de potência para ganhar mais um pouco de velocidade. Esse limite prático é a <b>velocidade de casco</b>:' },
              { t: 'p', html: '<b>V<sub>casco</sub> ≈ 2,43 × √LWL</b> (nós, com LWL em metros), ou 1,34 × √LWL com LWL em pés. Por exemplo, num cruzeiro de 32 pés (≈9,75 m) com 8,5 m na linha d’água, dá cerca de <b>7 nós</b>; no seu barco, use o seu LWL (com 6,5 m dá cerca de 6,2 nós; com 12 m, cerca de 8,4 nós). Cruzeiros leves podem passar disso por instantes, descendo ondas, mas, em geral, é o teto de cruzeiro.' },
              { t: 'h', txt: 'Quilha: lastro e lâmina' },
              { t: 'p', html: 'A quilha faz dois trabalhos: o <b>lastro</b>, uma massa de ferro ou chumbo embaixo, mantém o centro de gravidade baixo e dá o momento de endireitamento (módulo 1, lição 4); e a <b>lâmina</b> gera a força lateral contra o abatimento (módulo 1, lição 3). Quanto mais fundo está o peso e mais longe do casco, maior o efeito do lastro. Por isso as quilhas de aleta com bulbo concentram o peso na parte de baixo.' },
              { t: 'h', txt: 'Leme e sistema de governo' },
              { t: 'lista', itens: [
                '<b>Leme suspenso</b> (<i>spade</i>): lâmina presa só pelo eixo (a madre do leme), na popa. Governa bem e é leve, mas é mais exposto a golpes e a cabos pescados.',
                '<b>Leme com skeg</b>: o leme tem uma barbatana (skeg) à frente que o protege e o apoia. É mais robusto, com um pouco menos de rendimento hidrodinâmico.',
                '<b>Leme preso à quilha longa</b>: tradicional, muito protegido, manobra mais lenta.',
              ] },
              { t: 'p', html: 'O leme é movido por uma <b>cana</b> ou uma <b>roda</b>. A roda aciona a madre por cabos de aço e polias, correntes ou hidráulica. Todo veleiro oceânico deveria ter uma <b>cana de emergência</b> que se encaixa na cabeça da madre e permite governar se a roda ou os cabos falharem. Teste-a antes de zarpar: ache o encaixe, ajuste-o e saiba onde está guardada.' },
              { t: 'callout', tipo: 'dica', titulo: 'Sinal de que o leme está pedindo cuidados', html: 'Folga excessiva na roda, ruídos ao virar, cabos de aço com fios soltos, vazamento na madre ou o barco que “esquece” de voltar ao centro: avise o responsável. O sistema de governo é a peça mais crítica do casco depois do próprio casco.' },
              { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'casco', parte: 'quilha', vista: 'lado' }, legenda: 'Clique nas partes do casco para ver o nome em português e em inglês, e gire o barco. Mude a vista para ver a quilha e o leme de perto.' },
              { t: 'check', questoes: [
                { id: 'vela1-l6-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'O que são as obras vivas de um veleiro?',
                  alternativas: ['A parte do casco abaixo da linha d’água.', 'A parte do casco e da cabine acima da linha d’água.', 'O mastro e as velas.', 'Os equipamentos eletrônicos de bordo.'],
                  correta: 0,
                  explicacao: 'As obras vivas são a parte submersa do casco, que recebe tinta antiincrustante e ânodos de proteção. A parte de cima é chamada de obras mortas. Mastro, velas e eletrônicos não têm essa denominação.',
                  referencia: 'Miguens, Navegação: a Ciência e a Arte, vol. I (nomenclatura do casco); glossário do app' },
                { id: 'vela1-l6-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Qual a velocidade de casco aproximada de um veleiro com 8,5 m de comprimento na linha d’água?',
                  alternativas: ['Cerca de 4 nós.', 'Cerca de 7 nós.', 'Cerca de 12 nós.', 'Cerca de 20 nós.'],
                  correta: 1,
                  explicacao: 'Com a regra V ≈ 2,43 × √LWL (LWL em metros): 2,43 × √8,5 ≈ 2,43 × 2,92 ≈ 7,1 nós. É o ponto em que o comprimento da onda formada pelo casco iguala o do casco, e o barco passa a exigir uma potência desproporcional para aumentar a velocidade. 4 nós é muito pouco para um cruzeiro com vento, e 12 e 20 nós só valem para cascos planantes.',
                  referencia: 'Glossário (velocidade de casco); Wikipédia, Hull speed' },
                { id: 'vela1-l6-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Para que serve a cana de emergência de um veleiro com roda de leme?',
                  alternativas: ['Para trocar o piloto automático.', 'Para governar o barco se a roda ou seus cabos falharem.', 'Para amarrar o barco no cais.', 'Para ajustar o ângulo da quilha.'],
                  correta: 1,
                  explicacao: 'A cana de emergência encaixa direto na cabeça da madre do leme e dispensa a roda e os cabos. Ela não serve de piloto automático, de defensa nem de ajuste da quilha, que é fixa.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, equipamento e emergências' },
              ] },
              { t: 'fontes', itens: [RYA, { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), nomenclatura do casco', url: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf' }, wk('Hull speed', 'Hull_speed'), wk('Fin keel', 'Fin_keel')] },
            ],
          },
          /* ---------------------------------------------------------------- l7 */
          {
            id: 'l7', titulo: 'Convés e cockpit', minutos: 9,
            objetivos: [
              'Nomear as peças do convés e do cockpit e dizer para que servem.',
              'Entender a lógica dos controles no cockpit (catracas, mordedores, escotas).',
              'Aplicar as regras de segurança do convés: arnês, linha de vida e “uma mão para o barco”.',
            ],
            blocos: [
              { t: 'p', html: 'Convés e cockpit são o seu local de trabalho. Quase tudo que acontece na navegação (e quase todos os acidentes) se dá aqui. Conhecer cada peça e a sua função é o primeiro passo para trabalhar rápido e seguro, principalmente à noite.' },
              { t: 'termos', ids: ['conves', 'gaiuta', 'escotilha', 'vigia', 'cockpit', 'catraca', 'mordedor', 'cunho', 'buzina', 'molinete', 'guarda-mancebo', 'balaustre', 'pulpito'] },
              { t: 'h', txt: 'Do convés ao cockpit' },
              { t: 'lista', itens: [
                '<b>Convés</b>: o piso de cima, com superfície antiderrapante. Os corredores laterais ao lado da cabine são os <b>passadiços</b>, por onde se vai à proa.',
                '<b>Casaria</b> (a cabine acima do convés), com <b>vigias</b> (janelas) e <b>escotilhas</b> (aberturas). No mar, todas fechadas e travadas: uma onda que entra por uma escotilha aberta pode alagar o interior.',
                '<b>Gaiuta</b>: a entrada da cabine, com porta de correr e tábuas (<i>washboards</i>) que se retiram no porto e se põem no lugar quando o mar encrespa.',
                '<b>Cockpit</b>: o poço de onde se governa e se manobra. Fica rebaixado e tem <b>ralos</b> (drenos) que mandam a água do mar para fora do casco por mangueiras. Mantenha-os desentupidos.',
                '<b>Paióis do cockpit</b>: compartimentos sob os bancos. Um deles é o do <b>gás</b>, que tem ventilação própria para fora do casco (lição 11). Outros guardam cabos, defensas e a âncora de reserva.',
              ] },
              { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'conves', parte: 'cockpit', vista: 'cima' }, legenda: 'Vista de cima: clique nas peças do convés e do cockpit e veja para que servem.' },
              { t: 'h', txt: 'Controles no cockpit' },
              { t: 'p', html: 'O cockpit reúne o <b>leme</b> (roda ou cana), as <b>catracas</b> (<i>winches</i>), os <b>mordedores</b> (<i>stoppers</i> ou <i>clutches</i>) e os instrumentos. A lógica é simples:' },
              { t: 'lista', itens: [
                '<b>Escotas da genoa</b> vão do punho da escota, passam por um <b>carrinho</b> que corre num carril no passadiço, e chegam às <b>catracas primárias</b>, uma de cada lado. Um bordo trabalha, e o outro fica folgado.',
                '<b>Escota da grande</b>: uma talha entre a retranca e um <b>carrinho</b> (o <i>traveller</i>), perto do cockpit; o cabo termina num mordedor ou numa catraca.',
                '<b>Adriças e cabos de rizo</b> descem pelo mastro até a cabine, passam por mordedores e vão a <b>catracas secundárias</b>.',
                '<b>Mordedores</b> seguram o cabo sob carga sem que se precise dar voltas. Soltam-se com a alavanca aberta; para soltar o cabo tensionado, primeiro alivie a carga na catraca.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Catraca: regras que poupam dedos', html: 'O cabo gira no tambor no sentido horário, com <b>duas a quatro voltas</b> para segurar. Nunca ponha os dedos entre o cabo e o tambor. Tire a manivela da catraca quando não estiver em uso (a manivela é pesada e pode atingir alguém numa guinada). Para soltar um cabo carregado, mantenha a mão no cabo, tire as voltas uma a uma e deixe o cabo escorregar, sem soltar de uma vez.' },
              { t: 'h', txt: 'Proa e segurança' },
              { t: 'p', html: 'Na proa ficam o <b>púlpito</b>, os <b>cunhos</b> e <b>buzinas</b> (para amarrar), o <b>escovém</b> (a guia por onde passa a amarra), o <b>molinete</b> (guincho que recolhe a âncora) e a entrada do <b>paiol da amarra</b>. Os <b>guarda-mancebos</b> são cabos de aço (ou cabo revestido) que correm sobre os <b>balaústres</b>, de cada lado, entre os púlpitos de proa e popa.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Guarda-mancebos não são para se apoiar', html: 'Eles evitam cair em muitos casos, mas não foram projetados para suportar o peso de uma pessoa lançada contra eles pela guinada de uma onda. A proteção de verdade é o <b>arnês</b> preso à <b>linha de vida</b> (uma fita ou cabo esticado de proa a popa em cada bordo, ou pontos fortes no cockpit).' },
              { t: 'lista', itens: [
                '<b>Uma mão para o barco, outra para você</b>: ao se deslocar, sempre com um apoio firme.',
                '<b>Arnês</b> preso antes de sair do cockpit à noite, com mar ou vento forte, ou quando estiver sozinho no convés. Como orientação geral, muitos comandantes exigem a regra para todos nessas situações.',
                '<b>Corpo baixo, pelo lado de barlavento</b>: com o barco adernado, vá à proa pelo passadiço mais alto (o de barlavento), agachado, com as linhas de vida à mão. Se escorregar, você cai para dentro do barco, não para o mar.',
                '<b>Cabos arrumados</b>: aduche as sobras e deixe os passadiços livres. Cabo solto é causa clássica de tropeço e de queda ao mar.',
              ] },
              { t: 'check', questoes: [
                { id: 'vela1-l7-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Para que servem os mordedores (<i>stoppers</i>) no cockpit?',
                  alternativas: ['Para içar a âncora.', 'Para segurar um cabo sob carga sem precisar dar voltas na catraca.', 'Para travar o leme.', 'Para fixar o motor ao casco.'],
                  correta: 1,
                  explicacao: 'O mordedor trava a adriça, o cabo de rizo ou a escota sob carga, liberando a catraca para outra tarefa. Içar âncora é trabalho do molinete, e travar o leme e fixar o motor não são funções dele.',
                  referencia: 'RYA Day Skipper Handbook (Sail); glossário do app (mordedor)' },
                { id: 'vela1-l7-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Qual a função dos ralos (drenos) do cockpit?',
                  alternativas: ['Alimentar a bomba de porão.', 'Escoar para o mar a água que cai no cockpit, por mangueiras que atravessam o casco.', 'Ventilar o paiol do gás.', 'Entrada de água para o motor.'],
                  correta: 1,
                  explicacao: 'Os ralos esgotam a água do mar ou da chuva que cai no cockpit, que é um poço, direto para fora do casco. Não alimentam bomba de porão, não ventilam o gás (isso é uma saída própria) e a água do motor entra por outra válvula de fundo.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, equipamento do convés' },
                { id: 'vela1-l7-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Qual a melhor proteção contra cair ao mar durante a noite, com mar mexido?',
                  alternativas: ['Apoiar-se nos guarda-mancebos.', 'Usar arnês preso a uma linha de vida ou a um ponto forte do barco.', 'Andar rápido pelo convés.', 'Usar sapatos de couro.'],
                  correta: 1,
                  explicacao: 'O arnês, preso a um ponto forte, impede a queda ao mar. Os guarda-mancebos não foram feitos para segurar o peso de uma pessoa lançada contra eles. Andar rápido aumenta o risco, e o calçado deve ser antiderrapante, o que não substitui o arnês.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, segurança e homem ao mar; World Sailing OSR' },
              ] },
              { t: 'fontes', itens: [RYA, USS, wk('Winch', 'Winch'), wk('Safety harness', 'Safety_harness')] },
            ],
          },
          /* ---------------------------------------------------------------- l8 */
          {
            id: 'l8', titulo: 'Mastreação e velas', minutos: 13,
            objetivos: [
              'Distinguir aparelho fixo e aparelho de laborar (móvel) e nomear suas peças.',
              'Identificar as velas de um cruzeiro e as partes de uma vela.',
              'Saber o que inspecionar no aparelho antes de zarpar.',
            ],
            blocos: [
              { t: 'p', html: 'O veleiro de cruzeiro mais comum é o <b>sloop</b>: um mastro, uma vela grande atrás dele e uma vela de proa na frente. É um aparelho simples e eficiente. Para entendê-lo, divida tudo em duas famílias: o que <b>mantém o mastro em pé</b> (aparelho fixo) e o que <b>move e regula as velas</b> (aparelho de laborar).' },
              { t: 'termos', ids: ['aparelho-fixo', 'aparelho-de-laborar', 'mastro', 'estai', 'brandal', 'cruzeta', 'esticador', 'adrica', 'escota', 'retranca'] },
              { t: 'h', txt: 'Aparelho fixo' },
              { t: 'lista', itens: [
                '<b>Mastro</b>, de alumínio na maioria dos barcos, apoiado na quilha (passante) ou no convés (sobre um suporte). No barco do simulador, cerca de 13,5 m acima do convés.',
                '<b>Estai de proa</b>: cabo de aço do topo do mastro à proa; segura o mastro para a frente e é onde a vela de proa trabalha, com seu enrolador.',
                '<b>Estai de popa</b>: do topo à popa; segura o mastro para trás. Em muitos barcos tem regulagem (esticador hidráulico ou talha) para curvar o mastro e achatar a vela grande.',
                '<b>Brandais</b>: seguram o mastro de lado. Os <b>altos</b> passam pelas pontas das <b>cruzetas</b>; os <b>baixos</b> vão à raiz delas. As cruzetas afastam os brandais e dão um ângulo melhor para segurar o mastro.',
                '<b>Esticadores</b>: peças roscadas que ajustam a tensão. Devem estar travadas com contrapino ou trava própria. Contrapinos expostos são cobertos com fita para não rasgar as velas.',
              ] },
              { t: 'p', html: 'No <b>mastro de topo</b> o estai de proa chega ao alto do mastro. No <b>fracionado</b>, chega a uma fração (por exemplo, sete oitavos) da altura, e o estai de popa regula a flexão do mastro com mais efeito. Ambos são comuns.' },
              { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'mastro', parte: 'brandais', vista: 'proa' }, legenda: 'Em vista de proa dá para ver como brandais e cruzetas seguram o mastro. Clique em cada peça.' },
              { t: 'h', txt: 'Aparelho de laborar' },
              { t: 'tabela', cab: ['Cabo ou peça', 'Para que serve'],
                linhas: [
                  ['Adriça da grande', 'Içar a vela grande e mantê-la esticada pela testa'],
                  ['Adriça da genoa', 'Içar a vela de proa pelo estai (com enrolador, ela sobe pela ranhura do perfil)'],
                  ['Escota da grande', 'Regular a abertura da vela grande, puxando a retranca'],
                  ['Escotas da genoa', 'Regular a abertura da genoa; uma de cada bordo'],
                  ['Burro (<i>vang</i>)', 'Puxar a retranca para baixo; controla a torção da grande'],
                  ['Amantilho', 'Segurar a ponta da retranca com a vela arriada'],
                  ['Cunningham', 'Puxar a testa da grande para baixo e ajustar a posição da bolsa'],
                  ['Cabo da esteira', 'Esticar a esteira (borda de baixo) da grande ao longo da retranca'],
                  ['Cabos de rizo', 'Baixar a vela até um rizo e prender o pano em excesso'],
                ],
                legenda: 'A regulagem de cada um desses cabos é assunto do módulo 3.' },
              { t: 'h', txt: 'As velas' },
              { t: 'lista', itens: [
                '<b>Vela grande</b>: presa ao mastro e à retranca. Tem <b>rizos</b>, para reduzir a área.',
                '<b>Genoa</b>: vela de proa grande, que passa do mastro para trás. Em cruzeiros costuma ser <b>enrolável</b>: um tambor no estai a enrola e permite reduzi-la a qualquer tamanho.',
                '<b>Buja</b>: vela de proa menor, que não ultrapassa o mastro (ou pouco), mais fácil de manobrar com vento forte.',
                '<b>Tormentim</b> e <b>vela de capa</b>: velas pequenas e reforçadas, de tempestade (módulo 5).',
                '<b>Balão</b>, <b>gennaker</b> ou <b>código zero</b>: velas leves e amplas, para os rumos de popa e largo, em vento fraco e médio.',
              ] },
              { t: 'figura', svg: F_VELA, legenda: 'Partes de uma vela triangular (a grande, neste desenho). A testa vai junto ao mastro; a valuma é a borda livre de trás; a esteira fica ao longo da retranca. Os três cantos se chamam punhos.' },
              { t: 'termos', ids: ['testa', 'valuma', 'esteira', 'punho-da-adrica', 'punho-da-amura', 'punho-da-escota', 'tala', 'rizo', 'genoa', 'buja', 'balao', 'gennaker'] },
              { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'velas', parte: 'rizos', vento: -60, forca: 16, rizo: 1 }, legenda: 'Veja a grande com um rizo e a genoa. Mexa a força do vento e os rizos para ver o efeito sobre a banda.' },
              { t: 'h', txt: 'Inspeção rápida antes de zarpar' },
              { t: 'lista', itens: [
                'Olhe o mastro de baixo para cima: <b>fios de aço soltos</b> (“cabelos”) nos cabos, esticadores sem trava, contrapinos faltando.',
                'Folga ou rachaduras nas <b>chapas de brandal</b> e nas ferragens do convés.',
                'Estado das velas: <b>costuras</b>, proteção ultravioleta da genoa enrolada, esfolados nos rizos e na valuma.',
                'Adriças e escotas sem pontos de desgaste e com os chicotes (pontas) bem acabados. Cabos de aço do aparelho fixo inspecionados periodicamente por um aparelhador; o prazo certo vem do fabricante e da experiência, não de uma regra única.',
                'Subida ao mastro: só com cadeirinha, uma linha de segurança e quem controle a adriça no convés. Nunca com o barco em movimento.',
              ] },
              { t: 'check', questoes: [
                { id: 'vela1-l8-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Qual cabo pertence ao aparelho fixo de um veleiro?',
                  alternativas: ['A adriça da vela grande.', 'O brandal.', 'A escota da genoa.', 'O burro.'],
                  correta: 1,
                  explicacao: 'O aparelho fixo reúne estais e brandais, que mantêm o mastro em pé. Adriça, escota e burro são do aparelho de laborar (móvel), manobrados durante a navegação.',
                  referencia: 'Glossário (aparelho fixo, aparelho de laborar); RYA Day Skipper Handbook' },
                { id: 'vela1-l8-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'A borda de uma vela triangular que fica junto ao mastro ou ao estai chama-se:',
                  alternativas: ['Valuma.', 'Esteira.', 'Testa.', 'Punho da escota.'],
                  correta: 2,
                  explicacao: 'A testa é a borda de vante (a da frente) da vela. A valuma é a borda livre de trás, a esteira é a borda de baixo, e o punho da escota é o canto onde se prende a escota.',
                  referencia: 'Glossário (testa, valuma, esteira); RYA Sail Cruising Syllabus' },
                { id: 'vela1-l8-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Qual a principal vantagem da genoa enrolável sobre a genoa de adriça?',
                  alternativas: ['Ser mais rápida em todos os ventos.', 'Reduzir a área aos poucos, do cockpit, sem ir à proa.', 'Dispensar o estai de proa.', 'Dispensar a escota.'],
                  correta: 1,
                  explicacao: 'O enrolador permite diminuir a vela puxando um cabo do cockpit, sem ninguém ir à proa, o que é uma grande vantagem de segurança. Mas uma genoa muito enrolada perde a forma, então não é mais rápida em todos os ventos. O estai e a escota continuam necessários.',
                  referencia: 'RYA Day Skipper Handbook; Wikipédia, Roller furling' },
              ] },
              { t: 'fontes', itens: [RYA, wk('Standing rigging', 'Standing_rigging'), wk('Running rigging', 'Running_rigging'), wk('Sail plan', 'Sail_plan'), wk('Roller furling', 'Roller_furling')] },
            ],
          },
          /* ---------------------------------------------------------------- l9 */
          {
            id: 'l9', titulo: 'Motor diesel de centro e seus cuidados', minutos: 13,
            objetivos: [
              'Descrever os circuitos de combustível e de água do mar do motor.',
              'Executar a checagem antes de dar partida e o que observar logo depois.',
              'Explicar o que é sangrar o sistema de combustível e para que serve o impelidor.',
            ],
            blocos: [
              { t: 'p', html: 'O motor de um veleiro de cruzeiro é, em geral, um <b>diesel de centro</b> (<i>inboard</i>): fica no interior do casco, quase no meio do barco, e move o hélice por um eixo e um câmbio. Num cruzeiro de 32 pés, por exemplo, tem tipicamente entre 20 e 40 cavalos e de 2 a 4 cilindros; barcos maiores levam motores mais potentes. Ele manobra o barco no porto, carrega as baterias e é a segurança de quem precisa sair de um aperto: por isso ele precisa funcionar sempre.' },
              { t: 'p', html: 'Diesel é um motor robusto. O que o para, quase sempre, é <b>ar ou água no combustível</b>, <b>entupimento do filtro de água do mar</b>, <b>impelidor quebrado</b>, <b>correia solta</b> ou <b>bateria fraca</b>. Conhecer os dois circuitos ajuda a descobrir qual falhou.' },
              { t: 'figura', svg: F_MOTOR, legenda: 'À esquerda, o caminho do combustível; à direita, o da água do mar que esfria o motor e sai pelo escape. O sistema de arrefecimento mais comum é o de circuito fechado: o motor é esfriado por um líquido com aditivo, e a água do mar esfria esse líquido no trocador de calor.' },
              { t: 'h', txt: 'O circuito de combustível' },
              { t: 'p', html: 'O diesel passa do tanque por um <b>pré-filtro com separador de água</b> (transparente, para ver a sujeira), depois por uma bomba de alimentação (que tem alavanca de acionamento manual), por um <b>filtro fino</b> no motor e chega à <b>bomba injetora</b>, que o envia aos injetores. O que não for usado volta ao tanque.' },
              { t: 'p', html: 'Se o ar entra nesse circuito (tanque seco, filtro trocado, mangueira com folga), o motor <b>perde força e para</b>. É preciso <b>sangrar</b> o sistema, ou seja, tirar o ar até o diesel sair sem bolhas. O procedimento exato varia por motor; o roteiro geral é:' },
              { t: 'lista', ordenada: true, itens: [
                'Verifique se há combustível no tanque e se a válvula do tanque está aberta.',
                'Abra o parafuso de sangria do filtro (ou afrouxe-o), bombeie a alavanca manual da bomba de alimentação até sair diesel sem bolhas e feche o parafuso.',
                'Repita no filtro seguinte e, se o manual mandar, na bomba injetora.',
                'Se o motor ainda não pegar, afrouxe a porca de um tubo de injeção e dê partida por poucos segundos, até sair diesel; reaperte. Siga o manual do seu motor.',
              ] },
              { t: 'callout', tipo: 'dica', titulo: 'Água no diesel é o grande vilão', html: 'Pelo copo do separador dá para ver água (que fica no fundo, por ser mais densa) ou borra. Drene-o periodicamente e sempre que abastecer em lugar duvidoso. Sujeira no tanque, em mar mexido, solta e entope o filtro justo na hora em que o motor é mais necessário. Leve filtros de reserva e saiba trocá-los.' },
              { t: 'h', txt: 'O circuito de água do mar' },
              { t: 'p', html: 'A água entra por uma <b>válvula de fundo</b>, passa por um <b>filtro</b> (um cesto que retém algas e plástico) e vai à <b>bomba de água do mar</b>. Essa bomba tem um rotor de borracha flexível, o <b>impelidor</b>. Ele é lubrificado pela própria água: <b>se o motor funcionar sem água, o impelidor queima em segundos</b> e o motor superaquece. O impelidor é peça de desgaste: troque-o no prazo do fabricante e leve um sobressalente com as ferramentas para a troca.' },
              { t: 'p', html: 'Depois da bomba, a água esfria o líquido do motor no trocador de calor e vai ao <b>cotovelo de escape</b>, onde se mistura aos gases. Segue por um <b>silencioso com reservatório (waterlock)</b> e sai pela popa. Em muitos barcos há uma <b>válvula quebra-sifão</b> (<i>vented loop</i>) no caminho da água, para impedir que o mar entre no motor pelo escape quando o barco aderna ou balança com o motor desligado.' },
              { t: 'h', txt: 'Antes de ligar, e logo depois' },
              { t: 'lista', itens: [
                '<b>Válvula de fundo</b> da entrada de água do motor <b>aberta</b> (esquecer isso queima o impelidor).',
                '<b>Óleo</b>: nível na vareta, entre as marcas, com o motor parado há alguns minutos. Cor escura é normal; cor de leite indica água; cheiro de diesel indica diluição.',
                '<b>Líquido de arrefecimento</b> no nível; <b>filtro de água do mar</b> limpo; <b>correias</b> com a tensão certa; <b>separador de água</b> sem água.',
                '<b>Câmbio em neutro</b> e cabos livres de hélice (pode haver cabo na água).',
                '<b>Logo depois da partida</b>: pressão do óleo normal, lâmpada do alternador apagada e <b>água saindo pelo escape</b>, em jatos regulares. Se não sair água, desligue na hora.',
                '<b>Ao parar</b>: deixe no ralenti por cerca de um minuto, desligue com a alavanca de parada, desligue a chave e feche a válvula de fundo se for deixar o barco sozinho (conforme o manual).',
              ] },
              { t: 'h', txt: 'Manutenção em linhas gerais' },
              { t: 'p', html: 'O manual do motor manda. Em linhas gerais, o <b>óleo e o filtro de óleo</b> costumam ser trocados na primeira vez com algumas dezenas de horas (muitos fabricantes pedem cerca de 50 h) e depois a cada 100 a 250 horas ou, no mínimo, uma vez por ano, mesmo com poucas horas de uso. O intervalo certo é o do manual. Também se trocam o filtro de combustível, o impelidor e os ânodos, e se inspecionam a gaxeta do eixo (pode gotejar um pouco, mas não deve jorrar) e a fixação do motor. Anote as horas no diário do motor: é assim que se vê um problema nascendo.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Gases e fogo', html: 'O escape de qualquer motor contém <b>monóxido de carbono</b>, gás sem cheiro que mata. Não deixe a popa fechada com o motor ligado, nem a cabine perto da saída do escape. A casa de máquinas deve ter extintor adequado (ou sistema fixo) e boa ventilação. Se o motor pegar fogo, feche o combustível e use o extintor pela abertura da casa de máquinas, sem abrir a tampa completa.' },
              { t: 'callout', tipo: 'nota', titulo: 'Banda e motor', html: 'Com banda forte e prolongada, a pega de óleo e a entrada de água do motor podem descobrir. O fabricante informa o ângulo máximo de operação contínua, que costuma ficar na faixa de 20° a 25°. Por isso, ao motorar com vento, reduza a banda (recolha pano ou orce menos).' },
              { t: 'check', questoes: [
                { id: 'vela1-l9-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'O que acontece se o motor funcionar sem a válvula de fundo de entrada de água aberta?',
                  alternativas: ['Nada, ele se esfria pelo ar.', 'A bomba de água do mar trabalha a seco, o impelidor queima e o motor superaquece.', 'O motor para por falta de combustível.', 'A bateria descarrega.'],
                  correta: 1,
                  explicacao: 'O impelidor de borracha é lubrificado e resfriado pela água que bombeia; sem água ele aquece, rasga e deixa de bombear, e o motor superaquece. O motor marítimo de centro não é refrigerado a ar, e a falta de água não esgota o combustível nem descarrega a bateria diretamente.',
                  referencia: 'Calder, Boatowner’s Mechanical and Electrical Manual, motores diesel' },
                { id: 'vela1-l9-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Um motor diesel perde força e para depois de o tanque ficar quase vazio. Mesmo reabastecido, não pega. A provável causa e a solução são:',
                  alternativas: ['Ar no circuito de combustível; é preciso sangrar o sistema.', 'Bateria sem carga; trocá-la.', 'Hélice enrolada; mergulhar para limpá-la.', 'Impelidor quebrado; trocá-lo.'],
                  correta: 0,
                  explicacao: 'Com o tanque quase seco, o ar entrou no circuito de combustível; mesmo cheio de novo, o motor não pega até que o ar seja expulso (sangria). Bateria fraca faria o motor de partida girar devagar, hélice enrolada afetaria o avanço do barco e impelidor quebrado causa superaquecimento, não falha de partida.',
                  referencia: 'Calder, Boatowner’s Mechanical and Electrical Manual; manuais Yanmar e Volvo Penta (sangria)' },
                { id: 'vela1-l9-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Logo após dar partida, o que é indispensável observar?',
                  alternativas: ['Que o barco esteja dando seguimento a vante.', 'Que haja água saindo pelo escape, a pressão do óleo normal e o alternador carregando.', 'Que a vela grande esteja içada.', 'Que o tanque de água doce esteja cheio.'],
                  correta: 1,
                  explicacao: 'Água no escape mostra que a bomba de água do mar funciona; pressão do óleo e carga do alternador mostram a saúde do motor. O seguimento vem depois de engatar o câmbio, e vela içada ou tanque de água doce não dizem nada sobre o motor.',
                  referencia: 'RYA Day Skipper Handbook; manual do fabricante do motor' },
              ] },
              { t: 'fontes', itens: [CALDER, RYA, { txt: 'Yanmar Marine, manuais de operação dos motores diesel marítimos', url: 'https://www.yanmar.com/' }, wk('Diesel engine', 'Diesel_engine'), wk('Impeller', 'Impeller')] },
            ],
          },
          /* ---------------------------------------------------------------- l10 */
          {
            id: 'l10', titulo: 'Elétrica 12 V, baterias e carregamento', minutos: 12,
            objetivos: [
              'Explicar a diferença entre bateria de partida e banco de serviço.',
              'Fazer um orçamento de energia simples (amperes × horas).',
              'Conhecer as fontes de carga e as precauções com fusíveis, fiação e a chave geral.',
            ],
            blocos: [
              { t: 'p', html: 'Um veleiro moderno depende de eletricidade: luzes, instrumentos, rádio, bombas, geladeira e, às vezes, piloto automático. A bordo, o padrão é <b>corrente contínua de 12 volts (12 V)</b>, armazenada em baterias. Quando a energia acaba, o barco vira outro: sem luz, sem VHF, sem plotter. O motor de partida também depende dela.' },
              { t: 'h', txt: 'Duas baterias, dois trabalhos' },
              { t: 'lista', itens: [
                '<b>Bateria de partida</b>: pequena, tem de entregar uma corrente muito alta por segundos para ligar o motor. Fica ligada só ao motor de partida (e ao alternador). Não deve ser descarregada pelos aparelhos da cabine.',
                '<b>Banco de serviço (casa)</b>: uma ou mais baterias de <b>ciclo profundo</b>, projetadas para fornecer corrente baixa por muito tempo e aguentar descargas profundas. Alimenta tudo na cabine e no cockpit.',
              ] },
              { t: 'p', html: 'Separá-las tem uma razão prática: <b>mesmo que você esgote o banco de serviço, a bateria de partida segue intacta</b> e o motor pode ser ligado para recarregar.' },
              { t: 'figura', svg: F_ELETRICA, legenda: 'Esquema simplificado. Todo condutor ligado a uma bateria precisa de fusível ou disjuntor perto do polo positivo. O separador de carga (diodo ou relé) liga os dois bancos só para a carga: a corrente do alternador chega a cada um, mas um banco não puxa energia do outro.' },
              { t: 'h', txt: 'Tipos de bateria' },
              { t: 'tabela', cab: ['Tipo', 'Característica', 'Cuidado'],
                linhas: [
                  ['Chumbo-ácido inundada (aberta)', 'A mais barata; precisa conferir o nível de água destilada', 'Emite gases: ventilar; não inclinar muito'],
                  ['AGM / gel (seladas)', 'Sem manutenção; menos gases; mais caras', 'Exigem regulagem de carga correta'],
                  ['Lítio (LiFePO₄)', 'Leve; aceita descargas fundas; muito mais cara', 'Exige sistema de gerenciamento (BMS) e carregadores compatíveis'],
                ],
                legenda: 'Em chumbo-ácido, a regra prática é usar no máximo cerca de metade da capacidade nominal antes de recarregar, para a bateria durar. Em lítio, a faixa útil é bem maior. Siga o fabricante.' },
              { t: 'h', txt: 'Amperes, horas e o orçamento de energia' },
              { t: 'p', html: 'A capacidade de uma bateria se mede em <b>ampères-hora (Ah)</b>: um banco de 200 Ah poderia fornecer 10 A por 20 horas (na teoria). O consumo de um equipamento é dado em ampères (A), ou em watts: <b>A = W ÷ V</b>. Um aparelho de 36 W em 12 V puxa 3 A. Ligado por 10 horas, gasta 30 Ah.' },
              { t: 'tabela', cab: ['Equipamento (exemplo)', 'Consumo médio', 'Horas por dia', 'Ah por dia'],
                linhas: [
                  ['Luzes de navegação em LED', '1 A', '10', '10'],
                  ['Instrumentos e plotter', '2 A', '24', '48'],
                  ['Geladeira (em regime)', '2 A', '24', '48'],
                  ['Piloto automático', '3 A', '12', '36'],
                  ['Luzes internas, bombas, carregar celular', '—', '—', '15'],
                  ['<b>Total</b>', '', '', '<b>cerca de 157</b>'],
                ],
                legenda: 'Números ilustrativos, só para mostrar o método; meça o seu barco com um monitor de bateria.' },
              { t: 'p', html: 'No exemplo, com um banco de 200 Ah de chumbo-ácido, você só pode usar cerca de 100 Ah antes de recarregar: <b>menos de um dia</b> de autonomia. Saídas: reduzir consumo (LED, geladeira bem isolada), aumentar o banco e aumentar as fontes de carga.' },
              { t: 'h', txt: 'Fontes de carga' },
              { t: 'lista', itens: [
                '<b>Alternador do motor</b>: carrega rápido, mas só com o motor ligado. Motorar apenas para carregar gasta combustível: planeje.',
                '<b>Painéis solares</b>, com regulador de carga (de preferência MPPT): carga silenciosa e constante durante o dia.',
                '<b>Gerador eólico ou hidrogerador</b>: úteis em travessias longas, conforme o vento ou a velocidade.',
                '<b>Carregador de cais</b> (110/220 V): carrega no porto. Exige cuidados com a ligação à terra do cais: veja o manual do carregador e use cabos e plugues marítimos.',
              ] },
              { t: 'p', html: 'Os carregadores se comportam em fases: a carga forte (<i>bulk</i>), a absorção (tensão perto de 14 a 14,8 V, conforme o tipo de bateria) e a flutuação (<i>float</i>, em torno de 13,2 a 13,8 V). Uma bateria de chumbo-ácido descansada e cheia marca em torno de 12,6 a 12,8 V, e perto de 12,2 V a meio caminho. Esses valores são referência: o fabricante dá os números certos.' },
              { t: 'h', txt: 'Fiação e segurança elétrica' },
              { t: 'lista', itens: [
                '<b>Fusível ou disjuntor</b> em cada circuito, e fusível principal junto à bateria. Fogo de origem elétrica é uma das causas de incêndio a bordo.',
                '<b>Bitola do fio</b>: depende da corrente e do comprimento. Fio fino demais esquenta e provoca queda de tensão. As normas de fiação náutica (como ABYC E-11) limitam a queda de tensão a cerca de 3% para circuitos essenciais (luzes de navegação, bombas de porão) e 10% para os demais.',
                '<b>Chave geral</b> (de duas posições ou seletora): <b>nunca desligue com o motor funcionando</b>. Com o alternador sem bateria, pode surgir tensão alta que danifica o alternador e a eletrônica.',
                '<b>Terminais bem apertados</b> e protegidos da maresia. Conexão frouxa gera calor e queda de tensão.',
                '<b>Ventilação</b> do compartimento das baterias: baterias de chumbo abertas liberam hidrogênio, que é explosivo. Nada de faísca ou chama por perto.',
              ] },
              { t: 'check', questoes: [
                { id: 'vela1-l10-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Por que um veleiro tem uma bateria de partida separada do banco de serviço?',
                  alternativas: ['Para que o consumo da cabine não impeça a partida do motor.', 'Para duplicar a voltagem.', 'Porque o motor só funciona com bateria de lítio.', 'Para economizar combustível.'],
                  correta: 0,
                  explicacao: 'Separar as baterias garante que, mesmo esgotando o banco de serviço, ainda exista energia para ligar o motor. As baterias de partida e serviço continuam em 12 V; o lítio não é requisito, e a separação não interfere no consumo de combustível.',
                  referencia: 'Calder, Boatowner’s Mechanical and Electrical Manual; ABYC E-11' },
                { id: 'vela1-l10-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Um refrigerador puxa 4 A e funciona 12 horas por dia. Quanto consome por dia?',
                  alternativas: ['16 Ah.', '48 Ah.', '3 Ah.', '480 Ah.'],
                  correta: 1,
                  explicacao: 'Consumo em Ah = corrente (A) × horas = 4 × 12 = 48 Ah por dia. 16 Ah somaria os valores, 3 Ah dividiria e 480 Ah seria um erro de ordem de grandeza.',
                  referencia: 'Eletricidade básica (A × h = Ah); Calder, Boatowner’s Mechanical and Electrical Manual' },
                { id: 'vela1-l10-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'Qual a regra sobre a chave geral das baterias com o motor em funcionamento?',
                  alternativas: ['Pode-se desligar à vontade.', 'Não desligue: o alternador sem bateria pode gerar sobretensão e se danificar.', 'Desligue sempre para economizar combustível.', 'Troque de posição a cada dez minutos.'],
                  correta: 1,
                  explicacao: 'O alternador precisa da bateria como carga estabilizadora; desligá-la com o motor funcionando pode causar picos de tensão que danificam o alternador e a eletrônica ligada. Desligar não economiza combustível, e alternar a chave sem necessidade só cria risco.',
                  referencia: 'Calder, Boatowner’s Mechanical and Electrical Manual; manuais de alternadores marítimos' },
              ] },
              { t: 'fontes', itens: [CALDER, ABYC, { txt: 'Victron Energy, Energy Unlimited (livro técnico sobre baterias e carga marítima)', url: 'https://www.victronenergy.com/upload/documents/Book-Energy-Unlimited-EN.pdf' }, wk('Lead–acid battery', 'Lead–acid_battery'), wk('Alternator', 'Alternator')] },
            ],
          },
          /* ---------------------------------------------------------------- l11 */
          {
            id: 'l11', titulo: 'Água, gás, banheiro marítimo e bombas de porão', minutos: 13,
            objetivos: [
              'Entender o sistema de água doce e os cuidados com os passa-cascos e válvulas de fundo.',
              'Aplicar as regras de segurança com o gás de cozinha (GLP) a bordo.',
              'Saber como funcionam o vaso sanitário marítimo e as bombas de porão.',
            ],
            blocos: [
              { t: 'p', html: 'Esta lição junta os sistemas de “casa” do barco: água, gás, banheiro e esgotamento. Eles têm algo em comum: <b>falham silenciosamente</b>, e algumas das falhas (gás acumulado, furo no casco aberto) estão entre os maiores perigos a bordo. Conhecê-los é parte da segurança.' },
              { t: 'h', txt: 'Furos no casco: passa-cascos e válvulas de fundo' },
              { t: 'p', html: 'Para levar água para dentro ou para fora, o casco precisa de furos: os <b>passa-cascos</b>. Cada um que fica <b>abaixo da linha d’água</b> deve ter uma <b>válvula de fundo</b> (<i>seacock</i>), um registro que fecha o furo. Se uma mangueira estourar, a válvula é a diferença entre um susto e um naufrágio.' },
              { t: 'figura', svg: F_PASSACASCOS, legenda: 'Furos típicos de um cruzeiro. Os de baixo (vermelhos) exigem válvula de fundo. A descarga da bomba de porão fica acima da linha d’água, para a água não voltar por ela.' },
              { t: 'lista', itens: [
                'Saiba <b>onde estão todas</b> as válvulas de fundo e treine abri-las e fechá-las. Elas devem girar com facilidade: se estiverem duras, faça a manutenção.',
                'Deixe, ao lado de cada válvula, um <b>tampão de madeira cônico</b> amarrado a ela: se uma mangueira se soltar, o tampão tapa o furo.',
                'Ao deixar o barco no fundeio ou no cais por muito tempo, <b>feche as válvulas</b> que não precisa, principalmente as do banheiro e as da pia.',
                'Nas mangueiras de saída que ficam perto da linha d’água, use uma <b>alça alta</b> (<i>loop</i>) acima do nível da água, para evitar que, com o barco adernado, a água entre pelo cano e inunde o interior.',
              ] },
              { t: 'h', txt: 'Água doce' },
              { t: 'p', html: 'A água doce fica em <b>tanques</b> (inox ou plástico de grau alimentar). Uma <b>bomba de pressão</b> elétrica leva a água às torneiras, e o ruído da bomba ligando sozinha, sem ninguém usar água, mostra vazamento. Tenha sempre uma <b>reserva</b> fora dos tanques (galões) para o caso de falha ou contaminação. Para beber, use água de procedência confiável, filtrada ou tratada, e desinfete o tanque periodicamente, conforme orientação do fabricante.' },
              { t: 'h', txt: 'Gás de cozinha (GLP)' },
              { t: 'p', html: 'O fogão do barco usa <b>GLP</b> (gás liquefeito de petróleo, o “gás de botijão”). O vapor de GLP é cerca de <b>1,5 a 2 vezes mais pesado que o ar</b>: se vaza, não sobe e se espalha, e <b>escorre para a sentina</b>, onde se acumula e basta uma faísca para explodir. Isso torna o gás um dos riscos mais sérios a bordo e justifica estas regras:' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Cilindro num paiol fechado para o interior do barco</b> e <b>com dreno que leva o gás para fora do casco</b>, acima da linha d’água. Assim, qualquer vazamento sai pelo costado e não escorre para a sentina.',
                '<b>Feche o registro no cilindro</b> depois de cozinhar (não só no fogão). Muitos barcos têm um registro com solenoide, acionado por um interruptor perto do fogão.',
                '<b>Mangueiras flexíveis</b> próprias para GLP, com data de validade, trocadas no prazo e inspecionadas por rachaduras.',
                '<b>Detector de gás</b> junto à sentina, que alarma ao menor vazamento.',
                '<b>Teste de vazamento</b> só com água e sabão nas conexões, <b>nunca com chama</b>.',
                'Se sentir cheiro de gás: <b>nada de interruptores, faíscas ou chamas</b> e nada de ligar a bomba de porão elétrica. Feche o cilindro, abra escotilhas e gaiuta para ventilar bastante e só procure o vazamento depois que o cheiro sumir.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Fogo a bordo: o gás é só um dos riscos', html: 'Em qualquer fogo, o primeiro ato é cortar o combustível: fechar o cilindro, a válvula do tanque, desligar a energia. Tenha extintores de fácil acesso (perto do fogão, na casa de máquinas e perto da saída) e uma manta antichama na cozinha. As normas aplicáveis aos equipamentos obrigatórios estão no curso Arrais e no Mestre.' },
              { t: 'h', txt: 'Vaso sanitário marítimo' },
              { t: 'p', html: 'O banheiro marítimo (<i>marine head</i>) usa uma <b>bomba manual</b> (ou elétrica) que puxa água do mar por uma válvula de fundo, enche a bacia e empurra o conteúdo para outra válvula de fundo (saída) ou para um <b>tanque de retenção</b>. Tem uma alavanca ou chave que alterna entre “lavar” e “secar” (<i>flush/dry</i>). Funciona bem, desde que você respeite as regras:' },
              { t: 'lista', itens: [
                'Use só o que passou pelo corpo e <b>papel próprio</b> em pouca quantidade. Papel e outros materiais entopem a bomba e as válvulas.',
                'Bombeie bastante depois de usar, em lavagem completa, para esvaziar a mangueira.',
                'Mantenha as válvulas de fundo e a <b>válvula de retenção em bico de pato</b> (joker valve) em dia. Com a válvula de entrada aberta e a saída abaixo da linha d’água, o vaso pode ser inundado por sifão quando o barco está adernado: o <i>loop</i> alto evita isso.',
                'A descarga de esgoto no mar tem regras e restrições locais e internacionais (veja o curso Arrais/Mestre e as normas do local). Informe-se antes de usar em águas abrigadas, marinas e perto de costa.',
              ] },
              { t: 'h', txt: 'Bombas de porão' },
              { t: 'p', html: 'Mesmo um barco bem cuidado recebe um pouco de água: pela gaxeta do eixo, pelas escotilhas, por chuva e salpicos. Ela vai para a <b>sentina</b> e deve ser removida. Os barcos têm normalmente duas bombas:' },
              { t: 'lista', itens: [
                '<b>Bomba elétrica submersível</b>, com chave de nível (boia) que liga sozinha, descarregando acima da linha d’água. Teste-a: levante a boia e confira se a bomba ronca e se expele água.',
                '<b>Bomba manual de diafragma</b>, que pode ser operada do cockpit, com a gaiuta fechada, sem eletricidade. É a que salva o barco quando a bateria acaba. Mantenha a alavanca à mão.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Água subindo na sentina: ache a origem', html: 'Se a bomba automática liga mais que o normal, <b>descubra de onde vem a água</b>. Prove a água: é doce (tanque, mangueira de água doce) ou salgada (casco, válvula, gaxeta, leme)? Feche as válvulas de fundo uma a uma, inspecione a gaxeta e o fundo. Se não conseguir estancar, chame a tripulação toda para ajudar a esgotar, prepare a comunicação (VHF) e avise a tempo.' },
              { t: 'check', questoes: [
                { id: 'vela1-l11-1', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Por que o gás de cozinha (GLP) é especialmente perigoso na sentina de um veleiro?',
                  alternativas: ['É mais leve que o ar e sobe para o convés.', 'É mais pesado que o ar, escorre para a sentina e se acumula, podendo explodir com uma faísca.', 'Corrói o casco de fibra.', 'Só queima com o motor ligado.'],
                  correta: 1,
                  explicacao: 'O vapor de GLP tem densidade maior que a do ar (cerca de 1,5 a 2 vezes) e se acumula nos pontos baixos, como a sentina. Uma faísca pode causar explosão. Por isso o cilindro fica em paiol com dreno para fora. Ele não é mais leve que o ar, não corrói a fibra e independe do motor.',
                  referencia: 'ISO 10239 (sistemas de GLP em embarcações); ABYC A-1' },
                { id: 'vela1-l11-2', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 1,
                  enunciado: 'Qual a função da válvula de fundo (seacock)?',
                  alternativas: ['Aumentar a pressão da água doce.', 'Fechar um furo do casco abaixo da linha d’água, caso uma mangueira se rompa.', 'Esvaziar o tanque de combustível.', 'Regular a ventilação do cockpit.'],
                  correta: 1,
                  explicacao: 'A válvula de fundo é um registro instalado em cada passa-casco abaixo da linha d’água. Fechada, impede a entrada de água se a mangueira soltar. Não tem relação com a pressão da água doce, combustível ou ventilação.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; Wikipédia, Seacock' },
                { id: 'vela1-l11-3', nivel: 'vela', tema: 'Anatomia do veleiro', dificuldade: 2,
                  enunciado: 'A bomba elétrica de porão pode falhar quando a bateria acaba. Que equipamento garante o esgotamento nesse caso?',
                  alternativas: ['Uma bomba manual operada do cockpit.', 'O motor de partida.', 'A bomba de água doce.', 'O alternador.'],
                  correta: 0,
                  explicacao: 'A bomba manual de diafragma não depende de energia e, ligada a uma mangueira com descarga alta, esgota a sentina com a força do tripulante. O motor de partida e o alternador não esgotam água, e a bomba de água doce depende de eletricidade e trabalha com outro circuito.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, equipamento de segurança' },
              ] },
              { t: 'fontes', itens: [RYA, ABYC, { txt: 'ISO 10239, Small craft: liquefied petroleum gas (LPG) systems' }, wk('Seacock', 'Seacock'), wk('Marine sanitation device', 'Marine_sanitation_device'), wk('Bilge pump', 'Bilge_pump')] },
            ],
          },
        ],
      },
      /* =============================================================================== M3 */
      {
        id: 'm3', titulo: 'Pontos de vela e regulagem',
        resumo: 'Os pontos de vela da bolina cerrada à popa, caçar e folgar, as birutas, os controles da grande e da genoa (carrinho, burro, cunningham, adriça, esteira), torção e bolsa, e o trabalho em equipe no cockpit.',
        licoes: [
          /* ---------------------------------------------------------------- l12 */
          {
            id: 'l12', titulo: 'Os pontos de vela', minutos: 10,
            objetivos: [
              'Nomear os pontos de vela e dar o ângulo aproximado do vento real de cada um.',
              'Dizer, para cada ponto, como ficam as velas, a banda e a sensação a bordo.',
              'Relacionar o ponto de vela com o bordo (amura) e com a regra de governo entre veleiros.',
            ],
            blocos: [
              { t: 'p', html: 'O <b>ponto de vela</b> é o rumo do barco em relação ao vento <b>real</b>, medido a partir da proa. Cada ponto pede uma regulagem diferente, dá uma sensação diferente a bordo e tem seu risco próprio. Aprender a reconhecê-los é o alfabeto da vela.' },
              { t: 'termos', ids: ['pontos-de-vela', 'bolina-cerrada', 'bolina-folgada', 'vento-de-traves', 'largo', 'vento-em-popa', 'asa-de-pombo', 'amurado'] },
              { t: 'figura', svg: F_PONTOS, legenda: 'A roda dos pontos de vela, com o vento vindo de cima. À direita o barco com vento por bombordo; à esquerda, o espelho, com vento por boreste. Os limites de ângulo são aproximados e variam entre escolas, barcos e condições.' },
              { t: 'tabela', cab: ['Ponto', 'Vento real a partir da proa', 'Velas', 'Como é a bordo'],
                linhas: [
                  ['<b>Bolina cerrada</b>', 'cerca de 40° a 55°', 'Muito caçadas, carrinho da grande no meio ou a barlavento', 'Mais banda, vento aparente forte, respingos; velocidade moderada'],
                  ['<b>Bolina folgada</b>', 'cerca de 55° a 80°', 'Caçadas, um pouco abertas', 'Boa velocidade; ainda com banda; mais fácil de levar'],
                  ['<b>Través</b>', 'cerca de 80° a 100°', 'Meio abertas', 'Rumo rápido e controlável; banda menor'],
                  ['<b>Largo</b>', 'cerca de 100° a 150°', 'Bem abertas; burro firme', 'Costuma ser o mais rápido e o mais confortável'],
                  ['<b>Popa</b>', 'cerca de 150° a 180°', 'Muito abertas; grande no limite do brandal; genoa em asa de pombo ou balão', 'Pouco vento aparente, rolagem; risco de jaibe acidental'],
                ],
                legenda: 'Bordo ou amura: diz-se que o barco está <b>amurado a boreste</b> quando o vento entra pelo lado direito (a vela grande fica a bombordo) e <b>amurado a bombordo</b> quando entra pela esquerda.' },
              { t: 'h', txt: 'Como se sente cada ponto' },
              { t: 'lista', itens: [
                '<b>Na bolina</b>, o vento aparente é forte, o barco aderna e bate nas ondas, e a tripulação sente “mais vento”. É o ponto que mais cansa e o que mais pede cuidado com a regulagem.',
                '<b>No través e no largo</b>, o barco anda mais rápido e mais “plano”, e o vento aparente é mais fraco. Esses rumos são os preferidos para viajar com conforto.',
                '<b>Na popa</b>, o vento aparente é fraco, o dia parece calmo, mas o barco pode rolar, e um desvio de rumo pode causar um <b>jaibe acidental</b> (módulo 4). Em vento forte, as ondas vindas de trás pedem atenção ao leme.',
              ] },
              { t: 'p', html: 'A <b>asa de pombo</b> (<i>wing-on-wing</i>) é o jeito de levar o barco em popa: a grande sai para um bordo e a genoa para o outro (às vezes com um tangone que a segura aberta). Funciona, mas é instável, porque se o vento passar para o outro lado da vela o jaibe é imediato. Muitos comandantes preferem navegar em zigue-zague, ligeiramente abertos de um lado e do outro, e dar jaibes controlados.' },
              { t: 'h', txt: 'Qual veleiro tem preferência?' },
              { t: 'p', html: 'O bordo (a amura) é o que decide quem manobra quando dois veleiros se aproximam. As regras completas estão no curso Arrais; aqui, o essencial da Regra 12 do RIPEAM:' },
              { t: 'fato', ref: 'tecnico-24', html: 'Entre dois veleiros com o vento de bordos diferentes, <b>o que recebe o vento por bombordo</b> deve manter-se fora do caminho do outro.' },
              { t: 'fato', ref: 'tecnico-25', html: 'Com o vento do mesmo bordo, o veleiro que está <b>a barlavento</b> deve manter-se fora do caminho do que está a sotavento.' },
              { t: 'fato', ref: 'tecnico-27', html: 'O bordo de barlavento é o oposto àquele em que está carregada a vela grande.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional: termos em inglês', html: 'Pontos de vela: <i>close-hauled</i> (bolina cerrada), <i>close reach</i> (bolina folgada), <i>beam reach</i> (través), <i>broad reach</i> (largo), <i>running</i> (popa), <i>no-go zone</i> (zona morta). Bordo: <i>starboard tack</i> (vento por boreste) e <i>port tack</i> (vento por bombordo). Manobras: <i>tack</i> (cambar) e <i>gybe</i> (jaibe). São os termos da RYA e da ASA.' },
              { t: 'widget', w: 'mareacao', opts: { proa: 135, escota: 70, vento: 12 }, legenda: 'Teste os pontos de vela: gire o barco devagar e observe como o vento aparente, a escota ideal e a velocidade mudam. Compare a bolina cerrada com o largo.' },
              { t: 'check', questoes: [
                { id: 'vela1-l12-1', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Um barco com o vento real entrando a cerca de 90° da proa está em qual ponto de vela?',
                  alternativas: ['Bolina cerrada.', 'Través.', 'Largo.', 'Popa.'],
                  correta: 1,
                  explicacao: 'O vento a 90° da proa é de través, o ponto em que o barco é mais fácil de levar. A bolina cerrada fica em torno de 40° a 55°, o largo entre 100° e 150°, e a popa de 150° a 180°.',
                  referencia: 'RYA Sail Cruising Syllabus (points of sail); glossário (vento de través)' },
                { id: 'vela1-l12-2', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Qual ponto de vela costuma ser o mais rápido e confortável para um cruzeiro?',
                  alternativas: ['Bolina cerrada, por causa do vento aparente mais forte.', 'Largo, com o vento aparente moderado e pouca banda.', 'Aproado, com as velas batendo.', 'Popa total, por ser o mais direto.'],
                  correta: 1,
                  explicacao: 'No largo, o barco ainda mantém um bom vento aparente e a vela funciona bem, com pouca banda, e a polar costuma mostrar aí as maiores velocidades. Na bolina cerrada, o vento aparente é forte, mas o barco é lento e banda muito. Aproado o barco para. Na popa total, a velocidade cai, porque o vento aparente é pequeno.',
                  referencia: 'Polares de cruzeiros (RYA Yachtmaster Offshore Handbook); simulador da aba' },
                { id: 'vela1-l12-3', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'Dois veleiros se aproximam, um com o vento por bombordo e o outro por boreste. Qual deve manter-se fora do caminho do outro?',
                  alternativas: ['O que está com o vento por boreste.', 'O que está com o vento por bombordo.', 'O mais rápido.', 'O que estiver mais perto da costa.'],
                  correta: 1,
                  explicacao: 'Pelo RIPEAM, Regra 12(a)(i), entre veleiros que recebem o vento de lados diferentes, o que o recebe por bombordo deve manter-se fora do caminho do outro. Velocidade e proximidade da costa não definem a preferência nessa regra.',
                  referencia: 'RIPEAM-72, Regra 12(a)(i)' },
              ] },
              { t: 'fontes', itens: [RYA, USS, { txt: 'RIPEAM-72, Regra 12 (embarcações a vela)', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf' }, wk('Point of sail', 'Point_of_sail')] },
            ],
          },
          /* ---------------------------------------------------------------- l13 */
          {
            id: 'l13', titulo: 'Caçar, folgar e ler as birutas', minutos: 9,
            objetivos: [
              'Aplicar a regra de ouro: folgue até a vela bater e cace até parar de bater.',
              'Ler as birutas da genoa e da grande e dizer o que fazer em cada caso.',
              'Distinguir vela panejando de vela em estol.',
            ],
            blocos: [
              { t: 'p', html: '<b>Caçar</b> é puxar a escota para fechar a vela em direção ao centro do barco. <b>Folgar</b> é soltá-la para abri-la. Regular a vela é encontrar a posição certa entre os dois, e o barco “diz” quando está certo, de três formas: a vela <b>bate</b>, as <b>birutas</b> sinalizam, ou o barco <b>aderna e perde velocidade</b>.' },
              { t: 'termos', ids: ['cacar', 'folgar', 'biruta', 'panejar', 'enfunar'] },
              { t: 'h', txt: 'A regra de ouro' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Folgue a escota</b> até a testa da vela começar a bater (a vela “paneja”).',
                '<b>Cace devagar</b>, até a batida parar. Esse é o ponto certo: a vela está o mais aberta possível sem bater.',
                'Se o vento ou o rumo mudaram, <b>repita</b>. Regulagem não se faz uma vez só.',
              ] },
              { t: 'p', html: 'A regra funciona porque, como vimos, a vela rende melhor com um ângulo de ataque pequeno, mas positivo. Folgar demais faz bater (força zero); caçar demais faz estolar (força que cai e arrasto que sobe). O ponto certo está no limiar entre os dois.' },
              { t: 'h', txt: 'As birutas da genoa' },
              { t: 'p', html: 'Perto da testa da genoa, a uns 20 cm da borda, há pequenas fitas de lã ou de tecido leve, uma de cada lado da vela. Elas são os “olhos” da vela. Em geral, há um par no terço de baixo, um par no meio e outro no terço de cima.' },
              { t: 'figura', svg: F_BIRUTAS, legenda: 'Birutas vistas de cima, com o vento vindo de baixo à esquerda (barlavento embaixo, sotavento em cima). A biruta que dança é a do lado em que o fluxo está com problema. Na figura, verde marca a biruta de sotavento e vermelha a de barlavento; na vela de verdade a cor segue o bordo (verde a boreste, vermelha a bombordo), não o lado do vento.' },
              { t: 'tabela', cab: ['O que acontece', 'Significa', 'O que fazer'],
                linhas: [
                  ['As duas biruta voam retas, para trás', 'Fluxo colado dos dois lados', 'Está certo. Mantenha.'],
                  ['A de <b>barlavento</b> levanta e dança', 'Ângulo de ataque pequeno: vela folgada para o rumo, ou proa alta demais', '<b>Cace</b> a escota ou <b>arribe</b> um pouco'],
                  ['A de <b>sotavento</b> cai, gira ou fica embolada', 'Ângulo de ataque grande: fluxo descolado (estol)', '<b>Folgue</b> a escota ou <b>orce</b> um pouco'],
                  ['As duas dançam', 'Vela muito folgada ou barco aproado', 'Cace; se persistir, arribe'],
                ],
                legenda: 'Truque para lembrar: a biruta que está dançando aponta o lado em que o fluxo falha. Barlavento levantou: aproxime a vela do centro do barco (cace) ou afaste a proa do vento (arribe). Sotavento caiu: afrouxe (folgue) ou aproxime a proa do vento (orce).' },
              { t: 'h', txt: 'As birutas da valuma da grande' },
              { t: 'p', html: 'Na grande, as birutas costumam ficar na valuma, nas pontas das latas. Elas mostram se o ar sai bem pela borda de trás. Se estão voando retas para trás, o fluxo está colado. Se desaparecem atrás da vela ou ficam grudadas do lado de sotavento, o fluxo sofre estol: <b>folgue a escota</b> (ou ceda o carrinho) para abrir a valuma.' },
              { t: 'callout', tipo: 'dica', titulo: 'Navegar pelas birutas', html: 'Na bolina, o timoneiro pode usar a biruta de barlavento da genoa como guia de rumo: se ela levanta, está orçando demais, e arriba um pouco; se a de sotavento cai, está arribando demais e orça um pouco. Muitos velejadores mantêm a biruta de barlavento “quase” levantando. Esse é o rumo mais próximo do vento que a vela aguenta sem começar a bater.' },
              { t: 'callout', tipo: 'nota', titulo: 'Vela panejando e vela em estol não são a mesma coisa', html: '<b>Panejar</b> é a vela batendo por falta de ângulo de ataque: o ar passa pelos dois lados, mas muito paralelo à vela. <b>Estol</b> é o oposto: a vela está muito fechada, e o fluxo descola e vira turbulência. Parecem iguais para quem olha de longe (barco lento, vela sem força), mas a cura é oposta: no panejar, caça-se; no estol, folga-se.' },
              { t: 'widget', w: 'mareacao', opts: { modo: 'desafio', desafios: ['birutas'] }, legenda: 'Desafio das birutas: ajuste a escota e o rumo até as birutas ficarem paralelas.' },
              { t: 'check', questoes: [
                { id: 'vela1-l13-1', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'A biruta de sotavento da genoa cai e gira, enquanto a de barlavento está reta. O que isso indica e o que fazer?',
                  alternativas: ['Estol por ângulo de ataque grande; folgar a escota ou orçar um pouco.', 'Vela folgada demais; caçar.', 'Fluxo certo; manter.', 'O barco está aproado; içar mais vela.'],
                  correta: 0,
                  explicacao: 'Biruta de sotavento caindo mostra fluxo descolado do lado de sotavento: o ângulo de ataque é grande demais. Soluções: folgar a escota ou orçar (aproximar a proa do vento), o que reduz o ângulo. Caçar mais agravaria. Fluxo certo teria as duas retas, e içar mais vela não resolve estol.',
                  referencia: 'RYA Sail Cruising Syllabus; Marchaj, Sail Performance' },
                { id: 'vela1-l13-2', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Qual é a regra de ouro para regular uma vela?',
                  alternativas: ['Cace sempre ao máximo para ganhar potência.', 'Folgue até a vela bater e depois cace até parar de bater.', 'Deixe a vela sempre folgada para evitar banda.', 'Regule só uma vez, no início da navegação.'],
                  correta: 1,
                  explicacao: 'O ponto certo está no limiar entre a vela batendo e o estol: folga-se até bater e caça-se até parar. Caçar sempre ao máximo causa estol; deixar sempre folgada perde potência; e a regulagem muda com o vento e o rumo, então se repete.',
                  referencia: 'RYA Day Skipper Handbook (Sail)' },
                { id: 'vela1-l13-3', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'A vela está batendo na testa e o barco mal anda. Qual das ações NÃO ajudaria?',
                  alternativas: ['Caçar a escota.', 'Arribar um pouco.', 'Orçar mais, para chegar mais perto do vento.', 'Verificar se a proa está dentro da zona morta.'],
                  correta: 2,
                  explicacao: 'Se a vela está batendo na testa, o ângulo de ataque é pequeno demais. Orçar mais reduz ainda mais o ângulo e aproxima o barco da zona morta. Caçar a escota, arribar e conferir se a proa está na zona morta são ações que ajudam.',
                  referencia: 'RYA Day Skipper Handbook (Sail); simulador da aba' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ2, wk('Telltale (sailing)', 'Telltale_(sailing)'), wk('Sheet (sailing)', 'Sheet_(sailing)')] },
            ],
          },
          /* ---------------------------------------------------------------- l14 */
          {
            id: 'l14', titulo: 'Os controles da grande e da genoa', minutos: 14,
            objetivos: [
              'Dizer o que faz cada controle: escota, carrinho, burro, cunningham, adriça, esteira, estai de popa.',
              'Escolher o ajuste para vento fraco, médio e forte.',
              'Regular o ponto de escotamento da genoa pelas birutas.',
            ],
            blocos: [
              { t: 'p', html: 'A vela grande tem vários controles. Parece muita coisa, mas cada um faz uma coisa só. Quando você entende o que cada um faz, regular deixa de ser mistério.' },
              { t: 'termos', ids: ['escota', 'carril', 'burro', 'adrica', 'esteira', 'bolsa-da-vela', 'estai-de-popa'] },
              { t: 'tabela', cab: ['Controle', 'O que faz', 'Quando mexer'],
                linhas: [
                  ['<b>Escota da grande</b>', 'Fecha ou abre a vela; com o carrinho no meio, também controla a <b>torção</b> (a tensão da valuma)', 'Todo o tempo: é o controle principal de potência'],
                  ['<b>Carrinho</b> (<i>traveller</i>)', 'Move a escota de lado: ajusta o ângulo da retranca sem mexer na torção', 'Bolina: vento fraco, mais para barlavento; vento forte, desça-o a sotavento para aliviar'],
                  ['<b>Burro</b>', 'Puxa a retranca para baixo: controla a torção da valuma, especialmente com a escota folgada', 'Do través à popa, firme, para a retranca não subir; na bolina, pouco ou nada'],
                  ['<b>Cunningham</b>', 'Puxa a testa para baixo e leva a bolsa para a frente, achatando a vela', 'Quando o vento aumenta ou aparecem vincos horizontais na testa'],
                  ['<b>Cabo da esteira</b>', 'Estica a esteira ao longo da retranca: vela mais plana embaixo', 'Mais firme com vento forte e bolina; mais folgado em vento fraco e popa'],
                  ['<b>Adriça</b>', 'Içar a vela e dar tensão na testa', 'Içada até a testa ficar sem dobras em vento fraco; um pouco mais em vento forte'],
                  ['<b>Estai de popa</b>', 'Curva o mastro e achata a vela grande; retesa o estai de proa', 'Na bolina, com vento médio a forte; folgue na popa'],
                ],
                legenda: 'Regras gerais. Cada barco tem seus controles e seus hábitos; aprenda os do barco em que você está.' },
              { t: 'h', txt: 'Carrinho e escota: duas funções diferentes' },
              { t: 'p', html: 'A <b>escota</b> puxa a retranca para baixo e para trás, e o <b>carrinho</b> a move para um lado ou para o outro. Na bolina, o que se deseja é a retranca perto do centro, e a vela com uma boa tensão na valuma. Se aumenta o vento e o barco adorna demais, <b>desça o carrinho a sotavento</b> e <b>folgue um pouco a escota</b>: a vela “alivia” a parte de cima, o barco endireita, e a valuma continua com tensão. Quando o vento diminui, suba o carrinho de volta.' },
              { t: 'h', txt: 'Burro, cunningham e esteira' },
              { t: 'lista', itens: [
                '<b>Burro</b>: com a escota folgada (largo e popa), é a tensão da valuma que vem do burro. Sem ele, a retranca sobe, a vela se abre em cima e se perde potência. Com ele muito firme, a vela fica achatada demais e o barco pode ficar duro de governar.',
                '<b>Cunningham</b>: vento forte empurra a bolsa para trás; o cunningham a traz de volta para a frente. Se aparecem vincos horizontais na testa, está solto demais; se a vela fica sem vincos e sem bolsa na frente, está firme demais.',
                '<b>Cabo da esteira</b>: com a esteira bem esticada a vela fica plana embaixo, o que reduz a força e a banda. Em vento fraco ou na popa, solte para dar bolsa e potência.',
              ] },
              { t: 'h', txt: 'Genoa: escota e carrinho' },
              { t: 'p', html: 'Cada genoa tem uma escota e um <b>carrinho</b> que corre num carril no passadiço, e o carrinho decide de onde a escota puxa a vela. A posição certa se acha pelas birutas: <b>faça o barco orçar devagar</b> e veja qual par de birutas da testa levanta primeiro.' },
              { t: 'tabela', cab: ['O que levanta primeiro (ao orçar)', 'Diagnóstico', 'Ajuste'],
                linhas: [
                  ['As de <b>cima</b>', 'Valuma muito aberta: vela com torção demais', 'Leve o carrinho para <b>frente</b> (fecha a valuma)'],
                  ['As de <b>baixo</b>', 'Esteira muito tensa e valuma fechada demais', 'Leve o carrinho para <b>trás</b> (abre a valuma)'],
                  ['Todas juntas', 'Vela regulada de modo equilibrado', 'Está certo'],
                ],
                legenda: 'A geometria é simples: com o carrinho à frente, a escota puxa mais para baixo (aperta a valuma); mais para trás, puxa mais para trás (aperta a esteira).' },
              { t: 'callout', tipo: 'dica', titulo: 'Uma coisa de cada vez', html: 'Mude um controle por vez e olhe o efeito (banda, velocidade, birutas) antes de mexer em outro. Quem mexe em tudo ao mesmo tempo não sabe o que funcionou.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Cuidado com a retranca e as escotas', html: 'Ao soltar a escota da grande sob carga, a retranca pode cair de lado com força. Mantenha a cabeça longe do arco da retranca. Nunca enrole o cabo na mão: use voltas na catraca e solte devagar.' },
              { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'velas', parte: 'escotas', vento: 40, forca: 14, vista: '34' }, legenda: 'Observe o aparelho de laborar: as escotas, o burro e a retranca. Mude o vento e veja como a vela se acomoda.' },
              { t: 'check', questoes: [
                { id: 'vela1-l14-1', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'O vento aumentou e o barco aderna demais na bolina. Qual a primeira providência de regulagem da grande?',
                  alternativas: ['Subir o carrinho a barlavento e caçar mais a escota.', 'Descer o carrinho a sotavento e folgar um pouco a escota.', 'Soltar o cunningham e o cabo da esteira.', 'Folgar o estai de popa e içar a vela.'],
                  correta: 1,
                  explicacao: 'Descer o carrinho e folgar um pouco a escota alivia a vela na parte de cima, reduz a banda e mantém alguma tensão na valuma. Subir o carrinho e caçar aumentaria a potência. Soltar cunningham e esteira daria mais bolsa (mais força), e folgar o estai de popa deixa a vela mais cheia.',
                  referencia: 'RYA Day Skipper Handbook (Sail), trimagem da grande' },
                { id: 'vela1-l14-2', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'Qual a função principal do burro (vang) numa navegação de largo?',
                  alternativas: ['Içar a vela grande.', 'Impedir que a retranca suba e controlar a torção, com a escota folgada.', 'Enrolar a genoa.', 'Fixar o mastro ao convés.'],
                  correta: 1,
                  explicacao: 'Com a escota folgada no largo, nada segura a retranca para baixo senão o burro. Ele mantém a valuma tensionada e controla a torção. Içar a vela é função da adriça, enrolar a genoa é do enrolador, e o mastro é fixado pelo aparelho fixo.',
                  referencia: 'Glossário (burro); RYA Sail Cruising Syllabus' },
                { id: 'vela1-l14-3', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 3,
                  enunciado: 'Ao orçar devagar na bolina, as birutas de cima da genoa levantam primeiro. Que ajuste de carrinho da escota da genoa é indicado?',
                  alternativas: ['Mover o carrinho para trás, o que abre mais a valuma.', 'Mover o carrinho para frente, o que fecha a valuma e reduz a torção.', 'Não mexer: é sinal de regulagem ótima.', 'Tirar a genoa e içar a vela de capa.'],
                  correta: 1,
                  explicacao: 'Birutas de cima levantando primeiro mostram que a parte alta está mais aberta (muita torção). Com o carrinho mais à frente, a escota puxa mais para baixo, aperta a valuma e reduz a torção. Mover para trás faria o contrário. A regulagem ótima teria todas as birutas levantando juntas.',
                  referencia: 'RYA Sail Cruising Syllabus; Marchaj, Sail Performance' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ2, wk('Boom vang', 'Boom_vang'), wk('Cunningham', 'Cunningham_(sailing)'), wk('Traveller (sailing)', 'Traveller_(sailing)'), wk('Mainsheet', 'Mainsheet')] },
            ],
          },
          /* ---------------------------------------------------------------- l15 */
          {
            id: 'l15', titulo: 'Torção e bolsa', minutos: 9,
            objetivos: [
              'Explicar por que toda vela tem torção e o que a controla.',
              'Definir bolsa e dizer como ela muda com o vento e o mar.',
              'Escolher a combinação de bolsa e torção para vento fraco, médio e forte.',
            ],
            blocos: [
              { t: 'p', html: 'Duas características definem a “forma” de uma vela e, por isso, o que ela faz: a <b>bolsa</b> (o quanto ela é curva) e a <b>torção</b> (o quanto a parte de cima é mais aberta que a de baixo). Quase toda regulagem é um jogo com esses dois números.' },
              { t: 'termos', ids: ['bolsa-da-vela', 'valuma', 'testa'] },
              { t: 'figura', svg: F_TORCAO, legenda: 'À esquerda, a torção vista de cima: as cordas (linhas retas do mastro à valuma) em três alturas formam ângulos diferentes com a linha de centro. À direita, a bolsa: a profundidade da curva em relação à corda.' },
              { t: 'h', txt: 'Por que a vela tem torção' },
              { t: 'p', html: 'O vento sopra mais forte à medida que se sobe, porque perto da superfície do mar o atrito o freia. O vento <b>aparente</b> em cima é mais forte e vem de um ângulo mais aberto do que o de baixo (a conta é a mesma do triângulo da lição 1). Para manter o ângulo de ataque parecido em toda a altura, a parte de cima precisa ficar mais aberta: a vela precisa ter <b>torção</b>. Uma vela sem torção estola em cima e rende pouco; com torção demais perde potência e “vaza” na valuma.' },
              { t: 'p', html: 'Os controles que mexem na torção são, na grande, a <b>escota</b>, o <b>burro</b> e o <b>carrinho</b>; na genoa, a <b>escota</b> e a posição do <b>carrinho</b>. Caçar aperta a valuma e diminui a torção; folgar solta a valuma e aumenta.' },
              { t: 'h', txt: 'Bolsa: o que é e o que controla' },
              { t: 'p', html: 'A bolsa é a profundidade da curva da vela, medida em relação à corda (a linha reta da testa à valuma). <b>Muita bolsa</b> dá potência e boa resposta em vento fraco, mas, com vento forte, cria força demais e banda. <b>Pouca bolsa</b> (vela plana) rende mais em vento forte, aderna menos e deixa o barco mais controlável. A posição da maior profundidade também importa: com vento forte ela tende a ir para trás, e os controles (cunningham, esteira, estai de popa) a trazem para a frente e achatam a vela.' },
              { t: 'tabela', cab: ['Vento', 'Bolsa', 'Torção', 'Como obter'],
                linhas: [
                  ['<b>Fraco</b> (até cerca de 8 nós)', 'Funda: vela cheia, para dar potência', 'Moderada a grande: o ar já é fraco em cima', 'Esteira e cunningham soltos; carrinho a barlavento; escota um pouco folgada'],
                  ['<b>Médio</b>', 'Média', 'Pequena: valuma fechada', 'Escota firme, carrinho no centro; cunningham só para tirar vincos; estai de popa ajustado'],
                  ['<b>Forte</b> (barco em excesso de pano)', 'Rasa: vela plana, para reduzir a força', 'Moderada a grande, para “vazar” em rajadas', 'Esteira e cunningham firmes; estai de popa tenso; carrinho para sotavento'],
                ],
                legenda: 'Padrões amplos, para uma vela de cruzeiro. Em marolas e ondas curtas, mais bolsa e mais torção ajudam o barco a não estolar nas ondas; em águas planas, a vela pode ir mais fechada.' },
              { t: 'callout', tipo: 'dica', titulo: 'Fitas na valuma contam a verdade sobre a torção', html: 'Se a biruta de cima da valuma da grande “some” atrás da vela quando as de baixo voam retas, a vela está muito fechada em cima. Folgue a escota ou ajuste o burro. Se a de cima voa reta e só a de baixo estola, a vela está caçada demais embaixo: o carrinho ajusta a parte de baixo da vela e a escota controla a valuma e a torção (NauticEd, abaixo), então desça o carrinho a sotavento.' },
              { t: 'callout', tipo: 'nota', titulo: 'Velas antigas e novas', html: 'O tecido envelhece, estica e perde a forma. Uma vela gasta tem mais bolsa, e mais para trás, do que a original, e isso limita o que os controles conseguem. Em vez de brigar com a vela, saiba o quanto ela já cedeu; um veleiro de cruzeiro com velas gastas tem de reduzir pano mais cedo.' },
              { t: 'check', questoes: [
                { id: 'vela1-l15-1', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Por que toda vela bem desenhada tem torção?',
                  alternativas: ['Para ficar mais bonita.', 'Porque o vento aparente em cima é mais forte e mais aberto, e a parte de cima precisa ficar mais aberta para manter o ângulo de ataque.', 'Para reduzir o peso da vela.', 'Porque o mastro é torto.'],
                  correta: 1,
                  explicacao: 'O vento sobe de força com a altura e o ângulo aparente se abre. Manter o ângulo de ataque semelhante da base ao topo exige uma vela mais aberta em cima: a torção. Nada tem a ver com estética, peso ou o mastro.',
                  referencia: 'RYA Sail Cruising Syllabus; Marchaj, Sail Performance' },
                { id: 'vela1-l15-2', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'Qual a combinação indicada em vento fraco?',
                  alternativas: ['Bolsa rasa e vela plana, com cunningham e esteira firmes.', 'Bolsa funda, com cunningham e esteira soltos, para dar potência.', 'Sem bolsa e sem torção.', 'Bolsa rasa e muito burro.'],
                  correta: 1,
                  explicacao: 'Em vento fraco falta força; a vela cheia (mais bolsa) gera mais potência. Cunningham e esteira soltos permitem essa bolsa. Vela plana e firme serve para vento forte, quando se quer reduzir a força.',
                  referencia: 'RYA Sail Cruising Syllabus; Marchaj, Sail Performance' },
                { id: 'vela1-l15-3', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'O cunningham e o cabo da esteira, quando bem firmes, servem principalmente para:',
                  alternativas: ['Aumentar a bolsa da vela.', 'Achatar a vela e levar a bolsa para a frente, reduzindo força em vento forte.', 'Içar a vela.', 'Substituir o burro.'],
                  correta: 1,
                  explicacao: 'Esticar a testa (cunningham) e a esteira achata a vela e leva a bolsa para a frente, o que reduz a força e a banda quando o vento aumenta. Aumentar a bolsa seria soltá-los. Içar é com a adriça, e o burro tem outra função.',
                  referencia: 'RYA Sail Cruising Syllabus; Wikipédia, Cunningham (sailing)' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ2, { txt: 'NauticEd, How to trim the mainsail: traveler or mainsheet (o carrinho reajusta a parte de baixo da vela; a escota, a valuma e a torção)', url: 'https://sailing-blog.nauticed.org/how-to-trim-the-mainsail-traveler-or-mainsheet/' }, wk('Cunningham', 'Cunningham_(sailing)'), wk('Sail plan', 'Sail_plan')] },
            ],
          },
          /* ---------------------------------------------------------------- l16 */
          {
            id: 'l16', titulo: 'Trabalho em equipe no cockpit', minutos: 8,
            objetivos: [
              'Distribuir funções no cockpit e usar chamadas claras antes de manobrar.',
              'Aplicar a rotina de preparar, avisar, executar e confirmar.',
              'Reconhecer os riscos do cockpit (catraca, retranca, cabos) e trabalhar sem se ferir.',
            ],
            blocos: [
              { t: 'p', html: 'Um cruzeiro pequeno ou médio (um 32 pés, por exemplo) pode ser levado por duas pessoas, mas toda manobra boa é de equipe. O barco anda bem quando cada um sabe o que fazer, quando fazer e o que o outro vai fazer. A diferença entre uma manobra elegante e uma confusão está quase sempre na <b>comunicação</b>, não na força.' },
              { t: 'fato', ref: 'tecnico-15', html: 'O RIPEAM (Regra 5) manda toda embarcação manter permanentemente vigilância visual e auditiva, por todos os meios disponíveis. É por isso que o cockpit sempre tem alguém olhando para fora.' },
              { t: 'h', txt: 'Quem faz o quê' },
              { t: 'lista', itens: [
                '<b>Comandante</b> (ou quem está no leme): governa, decide quando manobrar e dá os comandos.',
                '<b>Trimmer</b> (regulador): cuida das escotas, caça e folga e observa as birutas. Em barcos pequenos, uma só pessoa faz tudo; em maiores, há um trimmer para a genoa e outro para a grande.',
                '<b>Mão de proa / apoio</b>: ajuda na catraca, solta o carrinho e conduz tarefas no convés.',
                '<b>Vigia</b>: olhando ao redor, sem tocar nas escotas, avisa de barcos, boias, rajadas e linhas de nuvens. O leme não pode ser o único olhar para fora.',
              ] },
              { t: 'h', txt: 'A rotina: preparar, avisar, executar, confirmar' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Preparar</b>: antes de qualquer manobra, olhe o entorno e cada um vai ao seu posto. Cabos livres, voltas na catraca, manivela à mão, carrinhos acertados.',
                '<b>Avisar</b>: o comandante diz o que vai fazer (“Preparar para cambar”). Cada um responde (“Pronto a bombordo”, “Pronto na grande”). Sem resposta, não se começa.',
                '<b>Executar</b>: o comando de execução (“Cambando!”) é dito numa só voz, firme, depois da confirmação de todos.',
                '<b>Confirmar</b>: terminada a manobra, cada um diz que está pronto (“Genoa regulada”, “Grande regulada”) e o comandante ajusta o rumo.',
              ] },
              { t: 'callout', tipo: 'dica', titulo: 'Repita o que ouviu', html: 'No barulho do vento, a regra é repetir o comando antes de executar: “Cambar!” — “Cambar!”. Evita que o outro faça o inverso do que você pensou. Combine antes de sair quais palavras serão usadas, e use sempre as mesmas.' },
              { t: 'h', txt: 'Trabalhar com catraca e cabos' },
              { t: 'lista', itens: [
                'Quem <b>caça</b> a escota (o trimmer) puxa o cabo à mão e dá voltas; quem gira a manivela (o <i>grinder</i>) só começa quando o trimmer mandar.',
                '<b>Ao soltar</b> um cabo sob carga, mantenha a mão em volta do cabo, solte as voltas devagar e deixe-o correr, sem soltar de uma vez.',
                'Deixe os cabos arrumados em <b>aduchas</b>, não espalhados pelo cockpit. Cabo no chão é cabo que enrola num pé, e pé enrolado derruba.',
                'Fique <b>fora do arco da retranca</b> e fora do alcance das escotas, que podem chicotear, e longe da linha entre a catraca e a manivela.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'O cockpit também é lugar de risco', html: 'As lesões mais comuns de cockpit são <b>dedos presos em catraca</b>, <b>pancada de retranca</b>, <b>queimadura de cabo</b> e <b>queda por tropeço</b>. Luvas ajudam, mas não fazem milagre: respeite a ordem dos comandos. Em dúvida, pare e pergunte. Parar uma manobra é sempre mais barato que consertar uma.' },
              { t: 'widget', w: 'mareacao', opts: { modo: 'desafio' }, legenda: 'Desafio completo: percorra os pontos de vela e ajuste as velas conforme o enunciado. Faça como em equipe: antes de mexer, diga em voz alta o que vai fazer.' },
              { t: 'check', questoes: [
                { id: 'vela1-l16-1', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Qual a função do vigia no cockpit?',
                  alternativas: ['Ajudar a girar a manivela.', 'Observar ao redor e avisar sobre barcos, boias e rajadas, enquanto os outros trabalham.', 'Preparar a refeição.', 'Cuidar do motor.'],
                  correta: 1,
                  explicacao: 'O vigia garante que alguém esteja sempre olhando ao redor, o que é parte da obrigação de vigilância permanente do RIPEAM, Regra 5. Quem está no leme ou nas escotas tem a atenção presa ao barco.',
                  referencia: 'RIPEAM-72, Regra 5 (vigilância); RYA Day Skipper Handbook' },
                { id: 'vela1-l16-2', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 1,
                  enunciado: 'Qual a ordem recomendada de uma manobra em equipe?',
                  alternativas: ['Executar, avisar, preparar, confirmar.', 'Preparar, avisar, executar, confirmar.', 'Avisar, confirmar, preparar, executar.', 'Confirmar, executar, preparar, avisar.'],
                  correta: 1,
                  explicacao: 'Primeiro cada um se prepara e vai ao posto; depois o comandante avisa e a equipe responde; só então se executa; no fim, todos confirmam o resultado. Executar antes de avisar é a causa clássica de confusão e acidente.',
                  referencia: 'RYA Day Skipper Handbook (Sail), comunicação a bordo' },
                { id: 'vela1-l16-3', nivel: 'vela', tema: 'Pontos de vela e regulagem', dificuldade: 2,
                  enunciado: 'Ao soltar uma escota carregada numa catraca, qual a conduta mais segura?',
                  alternativas: ['Soltar tudo de uma vez.', 'Manter a mão no cabo, tirar as voltas uma a uma e deixar o cabo correr devagar.', 'Pôr os dedos entre o cabo e o tambor para sentir a tensão.', 'Deixar a manivela na catraca.'],
                  correta: 1,
                  explicacao: 'Controlar o cabo com a mão e soltar devagar evita que a escota dispare e atinja alguém ou que a vela bata com violência. Os dedos nunca vão entre o cabo e o tambor, e a manivela deve ser tirada da catraca assim que acabar o uso.',
                  referencia: 'RYA Day Skipper Handbook (Sail); glossário (catraca)' },
              ] },
              { t: 'fontes', itens: [RYA, USS, { txt: 'RIPEAM-72, Regra 5 (vigilância)', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf' }] },
            ],
          },
        ],
      },
      /* =============================================================================== M4 */
      {
        id: 'm4', titulo: 'Manobras sob vela',
        resumo: 'Orçar e arribar, cambar por davante, jaibe controlado, o perigo do jaibe acidental e o uso do preventer, como parar o barco e as vozes de comando que mantêm a equipe sincronizada.',
        licoes: [
          /* ---------------------------------------------------------------- l17 */
          {
            id: 'l17', titulo: 'Orçar e arribar', minutos: 8,
            objetivos: [
              'Definir orçar e arribar e dizer para que lado se move a cana ou a roda.',
              'Prever o que acontece com o vento aparente, as velas e a banda ao orçar ou arribar.',
              'Usar orçar e arribar para controlar a força do vento, em rajadas e calmarias.',
            ],
            blocos: [
              { t: 'p', html: 'Governar um veleiro é, o tempo todo, escolher o ângulo entre a proa e o vento. Os dois movimentos básicos têm nomes que você vai usar todo dia: <b>orçar</b>, virar a proa <b>para o vento</b>, e <b>arribar</b>, virar a proa <b>para longe do vento</b>.' },
              { t: 'termos', ids: ['orcar', 'arribar', 'barlavento', 'sotavento', 'cana-do-leme', 'roda-de-leme'] },
              { t: 'figura', svg: F_ORCAR, legenda: 'Com o vento vindo do alto, orçar é fechar o ângulo com o vento (a proa se aproxima do alto da figura); arribar é abri-lo.' },
              { t: 'h', txt: 'O que se faz com o leme' },
              { t: 'lista', itens: [
                '<b>Cana</b>: empurre-a para o lado <b>contrário</b> ao que você quer ir. Cana para <b>sotavento</b> faz o barco <b>orçar</b>; cana para <b>barlavento</b>, <b>arribar</b>. A proa vai para o lado oposto ao da cana.',
                '<b>Roda</b>: gire-a como o volante de um carro, <b>para o lado em que quer virar a proa</b>. Roda para o lado do vento: orça; para o lado contrário: arriba.',
                'O leme só age com o barco em movimento, e <b>pouco ângulo basta</b>: leme todo freia o barco e é o que se faz em emergência, não de rotina.',
              ] },
              { t: 'h', txt: 'O que muda quando se orça ou arriba' },
              { t: 'tabela', cab: ['', 'Orçar', 'Arribar'],
                linhas: [
                  ['<b>Vento aparente</b>', 'Mais forte e mais de proa', 'Mais fraco e mais de través'],
                  ['<b>Ângulo de ataque das velas</b>', 'Diminui (a vela tende a bater)', 'Aumenta (a vela tende a estolar)'],
                  ['<b>Banda</b>', 'Aumenta, enquanto a vela mantiver força', 'Diminui'],
                  ['<b>Velocidade</b>', 'Cai se for demais (zona morta)', 'Em geral sobe, até o largo'],
                  ['<b>Ajuste das velas</b>', 'Cace para acompanhar', 'Folgue para acompanhar'],
                ],
                legenda: 'Orçar e arribar vêm sempre emparelhados com caçar e folgar: virou a proa, regule as velas.' },
              { t: 'h', txt: 'Controlar a força do vento com o rumo' },
              { t: 'p', html: 'Orçar e arribar são os controles mais rápidos que você tem quando o vento muda de intensidade:' },
              { t: 'lista', itens: [
                '<b>Na rajada</b>, orce um pouco e folgue a escota da grande: o barco endireita, perde um pouco de velocidade e atravessa a rajada sem sustos. Passou a rajada, arribe e cace de volta.',
                '<b>Na calmaria</b>, arribe um pouco e cace: o barco ganha vento aparente e velocidade.',
                '<b>Para reduzir pano</b> (rizar, enrolar a genoa), orce ou capeie primeiro: o barco vai devagar, as velas perdem pressão, o trabalho no convés fica seguro.',
                '<b>Para um jaibe ou uma cambada</b>, o giro deve ser suave e contínuo, sem leme todo.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Arribar em popa com vento forte é perigoso', html: 'Ao arribar para o rumo de popa total, o vento aparente cai e a vela parece “aliviar”, mas o barco fica no limite do <b>jaibe acidental</b> (veja a lição 20). Com vento forte, arribe em etapas e olhe a biruta do mastro: se o vento aparente se aproximar de trás, reaproxime-se do vento.' },
              { t: 'widget', w: 'mareacao', opts: { proa: 45, escota: 10, vento: 14 }, legenda: 'Orce e arribe com os botões do simulador e observe o vento aparente, a escota ideal e a velocidade. Note o ponto onde a velocidade despenca ao orçar demais.' },
              { t: 'check', questoes: [
                { id: 'vela1-l17-1', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'Num veleiro com cana de leme, qual movimento da cana faz o barco orçar?',
                  alternativas: ['Empurrar a cana para o lado do vento (barlavento).', 'Empurrar a cana para o lado contrário ao do vento (sotavento).', 'Puxar a cana para o centro.', 'Soltar a cana.'],
                  correta: 1,
                  explicacao: 'A proa vira para o lado oposto ao da cana. Cana para sotavento faz a proa ir para barlavento, isto é, orçar. Cana para barlavento arriba. Puxar a cana ao centro apenas retoma o rumo reto, e soltar a cana deixa o barco sem governo, em geral orçando por conta própria.',
                  referencia: 'Glossário (cana do leme); RYA Day Skipper Handbook (Sail)' },
                { id: 'vela1-l17-2', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'Ao orçar com as velas na mesma posição, o ângulo de ataque delas:',
                  alternativas: ['Diminui, e a vela tende a bater.', 'Aumenta, e a vela tende a estolar.', 'Não se altera.', 'Fica negativo e inverte a banda.'],
                  correta: 0,
                  explicacao: 'Ao orçar, a proa se aproxima do vento aparente e a vela, parada, fica mais paralela a ele: o ângulo de ataque diminui e, no limite, ela bate. Para recuperar, caça-se a escota. Arribar faz o contrário (aumenta o ângulo). O ângulo muda, sim, e a banda não se inverte.',
                  referencia: 'RYA Day Skipper Handbook (Sail); Marchaj, Sail Performance' },
                { id: 'vela1-l17-3', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Uma rajada forte atinge o barco na bolina e ele aderna muito. A melhor reação imediata é:',
                  alternativas: ['Arribar e caçar a grande.', 'Orçar um pouco e folgar a escota da grande.', 'Içar mais pano.', 'Largar o leme e deixar o barco se ajeitar.'],
                  correta: 1,
                  explicacao: 'Orçar reduz o ângulo de ataque e a força, e folgar a escota alivia a vela: o barco endireita e atravessa a rajada. Arribar e caçar aumentaria a força, içar pano pioraria, e largar o leme faz o barco orçar sem controle e pode deixá-lo aproado.',
                  referencia: 'RYA Day Skipper Handbook (Sail), tempo duro' },
              ] },
              { t: 'fontes', itens: [RYA, MARCHAJ2, wk('Weather helm', 'Weather_helm')] },
            ],
          },
          /* ---------------------------------------------------------------- l18 */
          {
            id: 'l18', titulo: 'Cambar por davante', minutos: 11,
            objetivos: [
              'Descrever a cambada por davante passo a passo, com as vozes de comando.',
              'Dividir as tarefas entre timoneiro, genoa e grande.',
              'Evitar e resolver os erros comuns (ficar aproado, enrolar a escota).',
            ],
            blocos: [
              { t: 'p', html: 'Para ir contra o vento, o veleiro bordeja, e para mudar de bordo ele <b>cambia</b>: faz a proa passar pelo vento e o vento passa a entrar pelo outro lado. A cambada por davante (<i>tacking</i>) é a manobra mais comum de um veleiro e a que mais mostra a qualidade de um comandante: quem cambia bem não perde velocidade.' },
              { t: 'termos', ids: ['cambar', 'bordejar', 'aproado'] },
              { t: 'figura', svg: F_CAMBJAIBE, legenda: 'À esquerda, a cambada: a proa cruza o vento (a manobra tem, em geral, um giro de uns 90° no rumo). À direita, o jaibe (lição 19): a popa cruza o vento.' },
              { t: 'h', txt: 'O passo a passo' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Prepare.</b> Olhe ao redor, principalmente para onde a proa vai virar. Chegue com <b>velocidade</b> na bolina cerrada, com o barco bem regulado. Cada um vai ao seu posto: a escota nova da genoa com voltas na catraca; a escota atual livre para correr; a grande dispensa trabalho, ela vira sozinha.',
                '<b>Avise.</b> O comandante diz “Preparar para cambar!” e espera o “Pronto!” de todos.',
                '<b>Cambe.</b> “Cambando!”, e o timoneiro leva o leme para sotavento de forma firme e contínua. A proa orça e a genoa começa a panejar.',
                '<b>Solte a genoa.</b> Quando a genoa paneja, o tripulante diz “Folgando!” e solta a escota antiga de uma vez, sem puxar de volta. A proa passa pelo vento, a genoa cruza rente ao mastro e a grande atravessa devagar, perto do centro.',
                '<b>Cace.</b> “Caçando!”: primeiro rápido, à mão, e depois com a manivela, até a genoa ficar bem caçada na bolina cerrada do novo bordo.',
                '<b>Recupere.</b> O timoneiro arriba um pouco, para ganhar velocidade, e orça de volta ao rumo de bolina. Regule a grande e arrume a escota antiga.',
              ] },
              { t: 'widget', w: 'manobras', opts: { manobra: 'cambar' }, legenda: 'Passe as etapas com os botões e leia as vozes de comando e as tarefas de cada tripulante. Depois tente o modo desafio, em que você ordena as etapas.' },
              { t: 'h', txt: 'Erros comuns e como corrigi-los' },
              { t: 'tabela', cab: ['Erro', 'Consequência', 'Como evitar ou corrigir'],
                linhas: [
                  ['Girar o leme rápido e todo', 'Freia o barco; ele para dentro da zona morta', 'Giro suave, contínuo, e o mínimo de leme'],
                  ['Soltar a genoa cedo demais', 'A genoa bate antes da hora e o barco perde força', 'Soltar quando a genoa panejar e a proa estiver quase no vento'],
                  ['Soltar a genoa tarde demais', 'A genoa fica a contravento e trava a proa', 'Fique atento: o tripulante olha a testa da vela'],
                  ['Começar sem velocidade', 'A proa não chega do outro lado e o barco fica aproado', 'Chegar com velocidade; arribar antes para ganhar impulso'],
                  ['Ficar aproado (<i>in irons</i>)', 'Sem seguimento e sem governo', 'Veja o módulo 1, lição 5: segure a genoa contra o vento, para o lado contrário ao de onde quer a proa'],
                  ['Escota com nó ou volta presa', 'A genoa não passa; há risco de rasgá-la', 'Escotas arrumadas e livres antes de manobrar'],
                ],
                legenda: 'A cambada vira rotina com treino: faça-a até em vento fraco e mar calmo, antes de precisar dela com vento forte.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Cabeça baixa, dedos fora', html: 'No cambar, a genoa e as escotas batem e a retranca passa pelo centro. Ninguém fica no arco da retranca nem com os dedos entre o cabo e a catraca. Em vento forte, as escotas “chicoteiam”: afaste o corpo do raio delas.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional: comandos em inglês', html: '“Ready about?” (preparar para cambar), “Ready!” (pronto), “Lee-oh!” ou “Helm’s a-lee!” (cambando), “Let go the jib sheet” (largar a escota da genoa), “Trim the jib” (caçar a genoa). Em exames da RYA, você terá de dar os comandos em voz alta e com clareza.' },
              { t: 'check', questoes: [
                { id: 'vela1-l18-1', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'Qual a ordem correta dos comandos em uma cambada por davante?',
                  alternativas: ['“Cambando!” seguido de “Preparar para cambar!”.', '“Preparar para cambar!”, “Pronto!” e depois “Cambando!”.', '“Cambando!” e pronto, sem aviso.', '“Preparar para jaibe!” e depois “Cambando!”.'],
                  correta: 1,
                  explicacao: 'O comandante avisa (“Preparar para cambar!”), a tripulação responde (“Pronto!”) e só então se executa (“Cambando!”). Sem aviso, a equipe é surpreendida; “jaibe” é outra manobra, a da popa pelo vento.',
                  referencia: 'RYA Day Skipper Handbook (Sail), manobra de cambar' },
                { id: 'vela1-l18-2', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Quando se deve soltar a escota antiga da genoa numa cambada?',
                  alternativas: ['Antes de o leme ser virado.', 'Quando a genoa começa a panejar, perto de a proa passar pelo vento.', 'Só depois de a genoa passar para o outro lado.', 'Nunca: a genoa passa sozinha.'],
                  correta: 1,
                  explicacao: 'A genoa começa a bater quando a proa se aproxima do vento: é o momento de soltar, de uma vez, para que ela passe pelo mastro sem se prender. Soltar antes tira a força cedo demais; soltar depois deixa a genoa contra o vento, freando a proa, e ela não passa sozinha com a escota presa.',
                  referencia: 'RYA Day Skipper Handbook (Sail); manobras do app' },
                { id: 'vela1-l18-3', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'O barco parou com a proa no vento no meio da cambada, sem seguimento. Qual a solução?',
                  alternativas: ['Caçar tudo e esperar.', 'Segurar a genoa contra o vento para o lado contrário ao de onde se quer a proa, até ela cair e o barco andar.', 'Içar mais uma vela.', 'Ligar o motor e içar a âncora.'],
                  correta: 1,
                  explicacao: 'Com a genoa contra o vento (a contravento), o vento a empurra e a proa cai para o novo bordo. Quando o barco ganha seguimento, endireita-se o leme e cace-se a genoa do lado certo. Esperar de braços cruzados mantém o barco aproado e as outras opções não resolvem o problema.',
                  referencia: 'RYA Day Skipper Handbook (Sail); manobras do app' },
              ] },
              { t: 'fontes', itens: [RYA, USS, wk('Tacking (sailing)', 'Tacking_(sailing)')] },
            ],
          },
          /* ---------------------------------------------------------------- l19 */
          {
            id: 'l19', titulo: 'Jaibe controlado', minutos: 10,
            objetivos: [
              'Descrever o jaibe passo a passo, com as vozes de comando.',
              'Explicar por que a grande é caçada antes do jaibe e folgada depois.',
              'Decidir quando é mais prudente cambar em vez de dar jaibe.',
            ],
            blocos: [
              { t: 'p', html: 'O <b>jaibe</b> (<i>gybe</i>) é a mudança de bordo com a <b>popa</b> passando pelo vento. É o contrário da cambada: o barco vai, em vez de para o vento, para longe dele. É uma manobra bonita e prática, mas cheia de energia: a vela grande, que estava aberta, passa de um lado ao outro com o vento por trás. Se for feita sem controle, a retranca varre o cockpit.' },
              { t: 'termos', ids: ['jaibe', 'retranca', 'vento-em-popa', 'asa-de-pombo'] },
              { t: 'h', txt: 'A ideia central: levar a retranca ao centro antes' },
              { t: 'p', html: 'O que torna o jaibe seguro é <b>controlar a retranca</b> o tempo todo. Em vez de deixá-la voar de um lado a outro, o tripulante da grande <b>caça a escota até a retranca ficar quase no centro do barco</b>, antes de a popa passar pelo vento. A vela é, assim, “segurada” durante o cruzamento, e o arco da retranca fica pequeno e lento. Depois, <b>folga-se a escota</b> aos poucos, até a vela ficar aberta no novo bordo.' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Prepare.</b> “Preparar para jaibe!” Todos saem do arco da retranca e abaixam a cabeça. Se houver preventer, solte-o. Caça-se a grande até a retranca ficar quase centrada. Enrole parte da genoa ou deixe suas escotas prontas.',
                '<b>Arribe.</b> “Jaibando!” O timoneiro arriba devagar, olhando a biruta, até a popa chegar à linha do vento. Nada de pressa e nada de largar o leme.',
                '<b>Cruze.</b> Quando o vento passa para o outro lado da vela, a retranca cruza curta e devagar. O tripulante acompanha com a escota nas mãos, sem soltar de repente.',
                '<b>Folgue.</b> “Folga a grande!” A escota sai aos poucos, pela catraca, até a retranca ficar aberta no novo bordo. Se o trecho for longo, recoloque o preventer. O timoneiro acerta o rumo e evita arribar demais.',
              ] },
              { t: 'widget', w: 'manobras', opts: { manobra: 'jaibe', variante: 'controlado', seletor: false }, legenda: 'Etapa por etapa, o jaibe controlado: veja onde fica a retranca em cada momento e quem faz o quê.' },
              { t: 'h', txt: 'Depois do jaibe' },
              { t: 'p', html: 'A genoa também troca de lado. Se estiver em asa de pombo, ela passa sozinha ou com ajuda do tripulante, que passa a escota nova antes. Ao final, todos regulam as velas para o novo bordo, e o comandante confirma: “Grande regulada?” “Genoa regulada?”.' },
              { t: 'h', txt: 'Jaibe ou cambada?' },
              { t: 'p', html: 'Quando o vento está forte, o mar levantado e a tripulação cansada ou inexperiente, o jaibe é arriscado: a retranca é pesada, a rotação acelera com a onda por trás e a vela enche com violência. Uma alternativa prudente é <b>mudar de bordo cambando em vez de jaibando</b>: orçar até a proa passar pelo vento, cambar e arribar de volta ao rumo. Custa mais distância e mais tempo, mas a manobra acontece <b>contra o vento</b>, com as velas perdendo força e o barco devagar. Atenção: ao orçar de popa para o vento o barco passa pelo través e fica de lado para as ondas por alguns segundos; escolha o momento e faça o giro sem pressa. Como orientação geral, é o que muitos comandantes fazem acima de uns 25 nós de vento, ou sempre que não confiam no jaibe.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Ninguém no arco da retranca', html: 'Antes de qualquer jaibe, <b>olhe</b> e <b>fale</b>: “Atenção, jaibe!”. Quem está no cockpit abaixa a cabeça e se afasta da trajetória da retranca. Quando a retranca atinge uma pessoa, é uma pancada que pode fraturar o crânio ou lançá-la ao mar.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional: comandos em inglês', html: '“Stand by to gybe!” (preparar para jaibe), “Gybe-oh!” (jaibando), “Ease the main” (folgar a grande). Na RYA, o jaibe controlado é parte do exame Day Skipper e Yachtmaster.' },
              { t: 'check', questoes: [
                { id: 'vela1-l19-1', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'Por que se caça a escota da grande antes de um jaibe?',
                  alternativas: ['Para levar a retranca perto do centro e controlá-la durante o cruzamento.', 'Para aumentar a velocidade do barco.', 'Para desligar o piloto automático.', 'Para soltar o burro.'],
                  correta: 0,
                  explicacao: 'Com a retranca perto do centro, o arco que ela percorre ao cruzar é curto e lento, o que reduz o impacto e o risco de ferimento ou de dano ao aparelho. Não tem relação com velocidade, piloto automático ou burro.',
                  referencia: 'RYA Day Skipper Handbook (Sail), jaibe; manobras do app' },
                { id: 'vela1-l19-2', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Qual a diferença essencial entre cambar e jaibar?',
                  alternativas: ['No cambar a proa passa pelo vento; no jaibe a popa passa pelo vento.', 'No cambar a popa passa pelo vento; no jaibe a proa passa pelo vento.', 'São a mesma manobra com nomes diferentes.', 'O jaibe só se faz com motor.'],
                  correta: 0,
                  explicacao: 'Cambar é virar de bordo orçando, com a proa cruzando o vento; jaibar é virar de bordo arribando, com a popa cruzando o vento. Não são a mesma manobra, e o jaibe depende apenas das velas.',
                  referencia: 'Glossário (cambar, jaibe); RYA Day Skipper Handbook' },
                { id: 'vela1-l19-3', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Vento forte, mar grosso e tripulação inexperiente: qual a alternativa mais prudente para mudar de bordo vindo em popa?',
                  alternativas: ['Jaibar rápido, com a escota toda aberta.', 'Orçar, cambar e arribar de volta ao rumo, mudando de bordo contra o vento.', 'Içar o balão.', 'Parar e fundear.'],
                  correta: 1,
                  explicacao: 'A cambada acontece contra o vento, com as velas perdendo força e o barco devagar. Custa mais distância, mas é muito mais previsível que um jaibe com mar grosso. Jaibar rápido com a escota aberta é o pior caso; içar balão aumentaria a força.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, tempo duro' },
              ] },
              { t: 'fontes', itens: [RYA, USS, wk('Gybe', 'Gybe')] },
            ],
          },
          /* ---------------------------------------------------------------- l20 */
          {
            id: 'l20', titulo: 'Jaibe acidental e preventer', minutos: 10,
            objetivos: [
              'Explicar como acontece o jaibe acidental e por que é tão perigoso.',
              'Reconhecer as condições que o provocam e como evitá-lo.',
              'Descrever como montar e usar um preventer com segurança.',
            ],
            blocos: [
              { t: 'p', html: 'O <b>jaibe acidental</b> é aquele que ninguém mandou fazer. O barco corre em popa com a grande bem aberta; uma onda, uma distração ou uma rajada fazem a popa passar pela linha do vento, o vento pega a vela do lado errado e a retranca cruza o barco de uma vez, <b>com toda a abertura e toda a energia</b>. É uma das causas mais comuns de ferimentos graves a bordo e de quebra de equipamento.' },
              { t: 'widget', w: 'manobras', opts: { manobra: 'jaibe', variante: 'acidental', seletor: false }, legenda: 'Veja o jaibe acidental, quadro a quadro: sem aviso, sem escota segurando, a retranca varre o barco.' },
              { t: 'h', txt: 'Por que acontece' },
              { t: 'lista', itens: [
                '<b>Desatenção ao rumo</b> em popa, quando o barco “segue” sozinho e o leme é governado sem olhar o vento.',
                '<b>Ondas de popa</b> que giram a proa, ou um barco que “surfa” e perde a estabilidade direcional (<i>broaching</i>).',
                '<b>Rajadas</b> ou mudanças de vento que fazem o vento passar para o outro lado da vela.',
                '<b>Navegar “pela contra”</b> (<i>by the lee</i>): o vento já entra pelo mesmo lado em que está a retranca. Qualquer desvio pequeno provoca o jaibe.',
                '<b>Piloto automático</b> mal ajustado em popa, que arriba sozinho.',
              ] },
              { t: 'p', html: 'O que torna o jaibe acidental perigoso é a combinação da <b>massa da retranca</b> (de dezenas de quilos), da <b>velocidade com que ela cruza</b> e do <b>arco aberto</b>. Uma pessoa atingida na cabeça pode sofrer fratura de crânio ou ser lançada ao mar; um barco pode perder a retranca, rasgar a vela e até quebrar o mastro.' },
              { t: 'h', txt: 'Como evitar' },
              { t: 'lista', itens: [
                '<b>Olhe a biruta do topo do mastro</b> (ou o indicador de vento) regularmente e sempre que o mar mudar.',
                '<b>Não navegue em popa total</b> em vento forte ou com ondas: prefira rumos de largo, ligeiramente abertos, e dê jaibes controlados quando for preciso mudar de lado.',
                '<b>Use o preventer</b> sempre que o rumo for de popa e largo com a retranca aberta, principalmente com mar, à noite e em passagens longas.',
                '<b>Mantenha a tripulação fora do arco da retranca</b>. Em popa, o cockpit é lugar de risco.',
                '<b>Rize mais cedo</b>: com menos pano, o barco responde melhor e a retranca é menos violenta.',
              ] },
              { t: 'h', txt: 'O preventer' },
              { t: 'p', html: 'O <b>preventer</b> (também chamado de <b>trinca da retranca</b>) é um cabo que segura a retranca para a frente quando ela está aberta, impedindo que ela cruze o barco num jaibe acidental. Também ajuda em outro problema: o balanço do barco em popa, que faz a retranca balançar e a vela bater.' },
              { t: 'figura', svg: F_PREVENTER, legenda: 'Montagem típica: o cabo sai do fim da retranca, vai até uma roldana na proa (ou um cunho de proa) e volta ao cockpit, onde pode ser solto mesmo sob carga.' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Cabo resistente</b> e longo (suficiente para ir da retranca à proa e voltar ao cockpit), de boa resistência e de diâmetro igual ou próximo ao das escotas.',
                '<b>Ponto na retranca</b>: um olhal reforçado ou uma cinta apropriada, de preferência perto da <b>ponta</b> da retranca (o braço de alavanca maior exige menos força do cabo) ou no ponto indicado pelo fabricante.',
                '<b>Roldana (ou cunho) forte na proa</b> e retorno por fora de tudo, pelo lado de fora dos balaústres, até o cockpit.',
                '<b>Solto do cockpit, sob carga</b>: o cabo termina numa catraca ou num mordedor, para que alguém possa soltar o preventer sem ir à proa se algo der errado.',
                '<b>Folgue o preventer</b> antes de cambar, orçar ou fazer qualquer manobra em que a retranca tenha de ir para o outro lado.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'O preventer também pode ferir', html: 'Um preventer carregado segura a retranca com uma força enorme. Se o barco atravessar (<i>broach</i>) ou se uma onda vier de lado, a carga sobe. Por isso o ponto de fixação precisa ser forte, e <b>alguém deve poder soltá-lo do cockpit, sob carga</b>. Preventer preso só com nó, sem poder ser largado, é uma armadilha. Nunca prenda o preventer na amurada ou nos balaústres.' },
              { t: 'check', questoes: [
                { id: 'vela1-l20-1', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'O que é um jaibe acidental?',
                  alternativas: ['Uma mudança de bordo planejada, em vento fraco.', 'Uma passagem não intencional da popa pelo vento, na qual a retranca cruza o barco com toda a abertura.', 'Uma cambada em que a genoa fica presa.', 'Um jaibe com o motor ligado.'],
                  correta: 1,
                  explicacao: 'É o jaibe não planejado: o vento passa para o outro lado da vela e a retranca, solta e aberta, atravessa o barco de uma vez. É perigoso exatamente pelo arco grande e pela energia. As demais descrições são outras situações.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; manobras do app' },
                { id: 'vela1-l20-2', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Qual a principal função do preventer?',
                  alternativas: ['Içar a vela grande.', 'Segurar a retranca para a frente e impedir que cruze o barco num jaibe acidental.', 'Enrolar a genoa.', 'Fixar o leme.'],
                  correta: 1,
                  explicacao: 'O preventer prende a retranca no lado em que ela está aberta, de modo que, se o vento passar para o outro lado da vela, a retranca não varra o barco. Içar é com a adriça, enrolar a genoa é com o enrolador e fixar o leme é com o freio da roda ou o piloto.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; manobras do app' },
                { id: 'vela1-l20-3', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Qual cuidado é essencial na montagem do preventer?',
                  alternativas: ['Prendê-lo ao guarda-mancebo, que é um ponto alto e à mão.', 'Prendê-lo na retranca, passá-lo por uma roldana forte na proa e trazê-lo de volta ao cockpit, onde possa ser solto sob carga.', 'Fixá-lo com nó firme na proa, sem possibilidade de soltar, para ter mais segurança.', 'Deixá-lo solto e longo, para se ajustar sozinho.'],
                  correta: 1,
                  explicacao: 'O preventer prende-se na retranca, passa por uma roldana forte na proa e volta ao cockpit, onde se solta sob carga. O guarda-mancebo não foi feito para essa carga e pode ceder; um cabo que não pode ser largado é uma armadilha se o barco atravessar; e um cabo solto não segura nada.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, preventer' },
              ] },
              { t: 'fontes', itens: [RYA, COLES, wk('Gybe', 'Gybe'), wk('Boom (sailing)', 'Boom_(sailing)')] },
            ],
          },
          /* ---------------------------------------------------------------- l21 */
          {
            id: 'l21', titulo: 'Parar o barco e vozes de comando', minutos: 10,
            objetivos: [
              'Parar um veleiro sob vela de modos diferentes, conforme a necessidade.',
              'Usar o vocabulário de comando em português com as respostas certas.',
              'Aplicar a regra da aproximação: chegar sempre contra a corrente ou o vento mais forte.',
            ],
            blocos: [
              { t: 'p', html: 'Um veleiro não tem freio. Para parar, você precisa <b>tirar a força das velas</b> e deixar o atrito e a inércia fazerem o resto. Há várias maneiras, conforme a urgência e a situação, e saber qual usar é parte da arte de manobrar.' },
              { t: 'h', txt: 'Maneiras de parar sob vela' },
              { t: 'tabela', cab: ['Maneira', 'Como é', 'Para que serve'],
                linhas: [
                  ['<b>Aproar</b>', 'Orce até a proa chegar ao vento e folgue tudo: as velas batem e o barco perde o seguimento. Ele para, e depois pode recuar ou derivar.', 'Parar de rotina, aproximar de uma boia ou de um cais; parar para içar ou arriar velas'],
                  ['<b>Capear</b> (<i>heave-to</i>)', 'Cambar sem soltar a genoa e prender o leme todo orçando: o barco fica quase parado, a uns 50° a 60° do vento, estável, derivando de lado.', 'Almoçar, descansar, rizar com calma, esperar a luz do dia (veja o módulo 5)'],
                  ['<b>Folgar tudo, de través ou de largo</b>', 'Folgue as escotas até o barco ficar com as velas livres e quase sem força; ele perde velocidade sem aproar.', 'Reduzir velocidade com espaço, esperar outro barco'],
                  ['<b>Arriar as velas</b>', 'Recolher a genoa e arriar a grande. O motor passa a mover o barco.', 'Entrar em porto, fundear'],
                ],
                legenda: 'Em emergência (homem ao mar, cabos na hélice), a forma de parar depende do caso: o app trata disso em outra parte do curso.' },
              { t: 'p', html: 'Perceba que parar é, em quase todos os casos, <b>retirar a força</b> das velas, seja porque a proa foi ao vento, seja porque as velas foram abertas, seja porque foram arriadas. O barco, depois disso, leva um espaço de várias vezes o seu comprimento para parar de vez, e o espaço cresce com o peso, a velocidade, o vento e o mar. Teste isso em condições calmas, com uma boia como referência, antes de depender dessa distância.' },
              { t: 'h', txt: 'A regra da aproximação' },
              { t: 'p', html: 'Para chegar a uma boia, a um cais ou a um ponto de fundeio, <b>aproxime-se sempre contra o vento ou contra a corrente, o que for mais forte</b>. Assim, quando você tirar a força das velas (ou arriá-las) o barco para por si, mantendo o governo, porque o leme continua a ter fluxo de água. Chegar com o vento ou a corrente de popa significa chegar “empurrado”, sem ter como parar.' },
              { t: 'lista', itens: [
                'Chegue de <b>bolina folgada ou través</b>, com as velas um pouco folgadas, e orce no fim para parar.',
                'Controle a velocidade pelas <b>escotas</b>: folgue para frear, cace para ganhar velocidade.',
                'Em caso de dúvida, <b>arreie as velas</b> e chegue de motor: a segurança vale mais que a elegância.',
              ] },
              { t: 'h', txt: 'Vozes de comando' },
              { t: 'p', html: 'Uma voz de comando é uma ordem curta e clara. Para a equipe, ela precisa ter o mesmo sentido para todos. O comando é <b>repetido</b> pelo executante e <b>confirmado</b> no fim. Fale alto, sem pressa e sem gritar, e sempre em uma ordem previsível: “Aviso, resposta, execução”.' },
              { t: 'tabela', cab: ['Comando', 'Significado', 'Resposta ou ação'],
                linhas: [
                  ['“Preparar para cambar!”', 'Aviso da cambada', '“Pronto!”'],
                  ['“Cambando!”', 'Executar a cambada', 'Quem solta a genoa: “Folgando!”'],
                  ['“Cace a genoa!”', 'Fechar a vela de proa', '“Caçando!”, e “Pronto!” ao terminar'],
                  ['“Preparar para jaibe!”', 'Aviso do jaibe', '“Pronto!” (retranca no centro)'],
                  ['“Jaibando!”', 'Executar o jaibe', 'Cabeças baixas; escota nas mãos'],
                  ['“Folga a grande!”', 'Abrir a vela grande', '“Folgando!”'],
                  ['“Largar!” (ou “Larga!”)', 'Soltar o cabo por completo', 'Quem executa repete e solta'],
                  ['“Firme!”', 'Segurar o cabo e manter', 'Quem executa segura'],
                  ['“Içar!” / “Arriar!”', 'Subir ou descer a vela', '“Içando!” / “Arriando!”'],
                  ['“Orça!” / “Arriba!”', 'Virar a proa para o vento ou para longe dele', 'Timoneiro repete e executa'],
                  ['“Homem ao mar!”', 'Alguém caiu na água', 'Quem viu aponta e não para de apontar'],
                  ['“Cuidado com a retranca!”', 'Perigo imediato', 'Todos abaixam e se afastam do arco'],
                ],
                legenda: 'O vocabulário tem variações regionais e de barco para barco; o importante é combinar as palavras antes de sair e usar sempre as mesmas.' },
              { t: 'termos', ids: ['cacar', 'folgar', 'largar', 'icar', 'cunho'] },
              { t: 'callout', tipo: 'dica', titulo: 'Combine antes de sair', html: 'Antes de largar o cais, o comandante faz um “briefing” de dois minutos: quais as palavras de comando, quem faz o quê, onde ficam os coletes e o que se faz num homem ao mar. Esse minuto economiza sustos.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional: inglês de bordo', html: 'Aproar: <i>head to wind</i>. Capear: <i>heave-to</i>. Caçar: <i>sheet in</i> ou <i>trim</i>. Folgar: <i>ease</i>. Largar: <i>let go</i>. Firme: <i>hold</i>. Içar: <i>hoist</i>. Arriar: <i>lower</i> ou <i>drop</i>. Homem ao mar: <i>man overboard</i>. Em exame da RYA, a clareza dos comandos conta tanto quanto a manobra.' },
              { t: 'widget', w: 'manobras', opts: { manobra: 'cambar', modo: 'desafio' }, legenda: 'Desafio: ordene as etapas de uma cambada e responda às perguntas, com as vozes de comando certas.' },
              { t: 'check', questoes: [
                { id: 'vela1-l21-1', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'Qual a forma mais comum de parar um veleiro sob vela, quando há tempo e espaço?',
                  alternativas: ['Aproar: orçar até a proa ao vento e folgar as velas.', 'Cambar três vezes seguidas.', 'Arribar até o vento de popa.', 'Caçar toda a vela.'],
                  correta: 0,
                  explicacao: 'Colocar a proa ao vento e folgar as velas elimina a força que move o barco, e ele perde o seguimento. Cambar repetidamente não para; arribar faz o barco ganhar vento aparente menor, mas continua andando; caçar a vela dá mais força.',
                  referencia: 'RYA Day Skipper Handbook (Sail), parar o barco' },
                { id: 'vela1-l21-2', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 2,
                  enunciado: 'Vento e corrente empurram o barco no mesmo sentido. Para aproximar-se de uma boia de amarração, o mais seguro é chegar:',
                  alternativas: ['Contra o vento e a corrente, com as velas folgadas e a velocidade controlada.', 'Com o vento e a corrente pela popa, para ser empurrado até a boia.', 'Com o vento e a corrente de través, para derivar até a boia.', 'Em qualquer ângulo, porque a quilha segura o barco.'],
                  correta: 0,
                  explicacao: 'Chegar contra o vento e a corrente deixa que eles ajudem a frear o barco quando se tira a força das velas, e o leme continua com fluxo de água para governar. Com os dois pela popa, o barco chega “empurrado” e é difícil parar; de través, derivaria para o lado errado. A quilha não impede nada disso.',
                  referencia: 'RYA Day Skipper Handbook (Sail), amarração em boia' },
                { id: 'vela1-l21-3', nivel: 'vela', tema: 'Manobras sob vela', dificuldade: 1,
                  enunciado: 'O comandante diz “Preparar para cambar!”. O que a tripulação deve responder?',
                  alternativas: ['Nada, apenas obedecer depois.', '“Pronto!”, quando cada um estiver no seu posto.', '“Cambando!”.', '“Jaibando!”.'],
                  correta: 1,
                  explicacao: 'A confirmação (“Pronto!”) garante que todos entenderam e estão posicionados antes da execução. Responder “Cambando!” ou “Jaibando!” seria confundir as etapas e a manobra. Ficar calado impede o comandante de saber se é seguro seguir.',
                  referencia: 'RYA Day Skipper Handbook (Sail), comandos' },
              ] },
              { t: 'fontes', itens: [RYA, USS, wk('Heaving to', 'Heaving_to')] },
            ],
          },
        ],
      },
      /* =============================================================================== M5 */
      {
        id: 'm5', titulo: 'Reduzir pano e mau tempo',
        resumo: 'Quando e como reduzir pano (rizar a grande, enrolar a genoa), capear, correr com o tempo, noções de drogue e âncora flutuante e o preparo do barco para o mau tempo. Tudo aqui é orientação geral, não regra: o barco, a tripulação e o mar mandam.',
        licoes: [
          /* ---------------------------------------------------------------- l22 */
          {
            id: 'l22', titulo: 'Quando reduzir pano', minutos: 10,
            objetivos: [
              'Reconhecer os sinais de que o barco carrega pano demais.',
              'Usar a escala Beaufort como guia geral de quando reduzir pano.',
              'Aplicar a regra de reduzir cedo e antes de manobrar.',
            ],
            blocos: [
              { t: 'callout', tipo: 'nota', titulo: 'Orientação geral, não regra', html: 'Tudo neste módulo é orientação geral de boa prática. Cada barco, cada tripulação e cada mar pedem decisões próprias, e o comandante decide. Treine as manobras com um instrutor habilitado, em condições seguras, antes de precisar delas.' },
              { t: 'p', html: 'A regra mais repetida da vela de cruzeiro é: <b>reduza pano cedo</b>. Quem espera a rajada forte para rizar faz a manobra com o barco deitado, a vela batendo e a tripulação com medo. Quem rizou meia hora antes faz o mesmo trabalho com calma e navega com mais conforto, e quase sempre com a mesma velocidade, porque o barco com pano demais é lento: deitado, com o leme duro, perde-se rendimento.' },
              { t: 'termos', ids: ['reduzir-pano', 'rizo', 'enrolador', 'beaufort', 'rajada', 'banda'] },
              { t: 'h', txt: 'Sinais de pano demais' },
              { t: 'lista', itens: [
                '<b>Banda grande</b> e constante (bem acima de 20° na bolina), borda de sotavento perto da água.',
                '<b>Leme duro</b>: o barco “quer” orçar sozinho e você precisa de muito ângulo para segurar o rumo (ardência).',
                '<b>Velas estolando ou batendo nas rajadas</b>, com a sensação de que o barco “sufoca”.',
                '<b>Velocidade que não aumenta</b> mesmo com mais vento, ou que cai com mais pano.',
                '<b>Tripulação desconfortável</b>: enjoo, medo, dificuldade de se movimentar, coisas soltas na cabine.',
                '<b>Previsão de mais vento</b>, noite chegando ou cansaço da equipe: reduza antes, mesmo que o vento atual ainda não peça.',
              ] },
              { t: 'h', txt: 'A escala Beaufort como guia' },
              { t: 'p', html: 'A escala Beaufort relaciona a força do vento a sinais no mar. Dá para ler o vento sem instrumento e prever o que vem. A tabela abaixo é uma <b>orientação geral</b> para um veleiro de cruzeiro de porte médio (a tabela foi pensada num 32 pés, por exemplo; barcos menores tendem a reduzir pano antes e os maiores, um pouco depois), bem tripulado e na bolina. Com vento de popa, o vento aparente é muito menor, e uma força Beaufort de popa parece mais fraca do que é: pense no que vem quando você orçar.' },
              { t: 'tabela', cab: ['Beaufort (nós)', 'Mar', 'Orientação geral de pano'],
                linhas: [
                  ['<b>4</b> (11–16)', 'Pequenas ondas, carneiros frequentes', 'Pano todo'],
                  ['<b>5</b> (17–21)', 'Ondas moderadas, muitos carneiros', 'Pano todo ainda possível; prepare o 1º rizo. Com tripulação iniciante, pôr o rizo.'],
                  ['<b>6</b> (22–27)', 'Ondas grandes, cristas brancas, borrifos', '1º ou 2º rizo e genoa reduzida'],
                  ['<b>7</b> (28–33)', 'Mar encapelado, espuma em faixas', '2º ou 3º rizo e vela de proa pequena; dia para ficar no porto'],
                  ['<b>8</b> (34–40)', 'Ondas altas, cristas se desfazem', 'Velas de tempestade (tormentim e vela de capa), ou capear ou correr com o tempo'],
                  ['<b>9 ou mais</b> (41+)', 'Ondas altas a muito altas, espuma densa', 'Tática de sobrevivência: pouquíssimo pano ou nenhum, drogue ou âncora flutuante'],
                ],
                legenda: 'Faixas de vento em nós segundo a escala Beaufort (WMO nº 8, publicada pelo CHM). A coluna de pano é orientação geral para um cruzeiro de porte médio (exemplo: 32 pés); barco mais ou menos tenso, tripulação mais ou menos experiente e mar mais ou menos mexido mudam o ponto de reduzir.' },
              { t: 'widget', w: 'beaufort', opts: { forca: 6 }, legenda: 'Passe pelas forças de 0 a 12 e veja o mar, a altura das ondas e a orientação de vela para cada uma. A orientação é geral: marcada como tal no instrumento.' },
              { t: 'h', txt: 'Regras de prudência' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Reduza antes de manobrar.</b> Cambar, jaibar ou orçar com pano demais é onde as coisas quebram. Se você já pensou “talvez eu devesse rizar”, rize.',
                '<b>Reduza antes do anoitecer.</b> Rizar no escuro é mais difícil, e o cansaço da noite pesa. Deixe a vela pronta para a noite ainda de dia.',
                '<b>Reduza antes de ficar cansado.</b> O vento não tem pressa de passar. A tripulação cansada erra.',
                '<b>É mais fácil largar pano que reduzir.</b> Se rizou cedo demais, basta içar de novo quando o vento cair. O inverso, não.',
                '<b>Equipe de colete, arnês preso.</b> Reduzir pano exige trabalho no mastro e na proa, onde cair é mais fácil.',
              ] },
              { t: 'check', questoes: [
                { id: 'vela1-l22-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Qual a regra mais importante sobre reduzir pano?',
                  alternativas: ['Reduzir só quando as velas rasgarem.', 'Reduzir cedo, antes de o barco ficar sobrecarregado.', 'Reduzir sempre depois de anoitecer.', 'Nunca reduzir: velas grandes são mais rápidas.'],
                  correta: 1,
                  explicacao: 'Reduzir cedo permite fazer a manobra com calma e mantém o barco confortável e rápido. Esperar o dano ou a noite torna tudo mais difícil, e velas grandes demais deitam o barco e o fazem perder rendimento.',
                  referencia: 'RYA Day Skipper Handbook (Sail); Coles, Heavy Weather Sailing' },
                { id: 'vela1-l22-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Qual dos itens abaixo é um sinal clássico de pano demais?',
                  alternativas: ['Leme leve e velas sem estolar.', 'Banda grande e leme duro, com o barco querendo orçar.', 'Vento aparente fraco e popa.', 'Biruta alinhada e barco devagar.'],
                  correta: 1,
                  explicacao: 'Banda grande e leme duro (ardência) são os sinais mais confiáveis de pano demais. Leme leve e velas calmas indicam equilíbrio. Vento aparente fraco ou barco devagar não significam excesso de pano.',
                  referencia: 'RYA Day Skipper Handbook (Sail), rizar' },
                { id: 'vela1-l22-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Com vento de 24 nós (Beaufort 6) na bolina, o que a orientação geral para um veleiro de cruzeiro sugere?',
                  alternativas: ['Içar o balão.', '1º ou 2º rizo e genoa reduzida.', 'Pano todo, sem mudanças.', 'Arriar tudo e correr a motor sem vela.'],
                  correta: 1,
                  explicacao: 'Na força 6 (22 a 27 nós), a orientação geral é reduzir: um ou dois rizos na grande e a genoa enrolada em parte. Pano todo é para ventos bem mais fracos; balão em vento forte é perigoso; e arriar tudo e motorar só se justifica em condições bem piores.',
                  referencia: 'Escala Beaufort (CHM/WMO); RYA Day Skipper Handbook' },
              ] },
              { t: 'fontes', itens: [BEAUFORT, RYA, COLES] },
            ],
          },
          /* ---------------------------------------------------------------- l23 */
          {
            id: 'l23', titulo: 'Rizar a vela grande', minutos: 11,
            objetivos: [
              'Descrever a sequência para dar um rizo na grande, com rizos passados nos cabos.',
              'Explicar o papel de cada cabo: escota, amantilho, burro, adriça, cabo do rizo.',
              'Reconhecer os erros comuns ao rizar.',
            ],
            blocos: [
              { t: 'p', html: '<b>Rizar</b> é reduzir a área da vela grande, baixando-a até um dos rizos (as faixas de reforço com olhais) e prendendo o pano em excesso à retranca. Quase todos os cruzeiros têm de dois a três rizos; quanto de área cada um tira depende do corte da vela, por isso confira no seu barco. A sequência abaixo vale para o sistema mais comum, o de rizos passados nos cabos (<i>slab reefing</i>). Outros sistemas (vela enrolável no mastro ou na retranca) têm procedimentos próprios: aprenda o do seu barco.' },
              { t: 'termos', ids: ['rizo', 'amantilho', 'burro', 'adrica', 'punho-da-amura', 'punho-da-escota'] },
              { t: 'figura', svg: F_RIZO, legenda: 'À esquerda, a vela inteira, com a linha do primeiro rizo. À direita, depois do rizo: o olhal de amura está preso ao gancho, o cabo do rizo traz o punho de escota para baixo e para trás, e o pano que sobrou fica recolhido sobre a retranca.' },
              { t: 'h', txt: 'A sequência' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Decida cedo e avise.</b> “Vamos rizar. Todos de colete!” Quem vai ao mastro fica preso a um ponto firme. Quem fica no leme tem a tarefa de manter o barco estável.',
                '<b>Alivie a vela.</b> Aproxime a proa do vento (ou capeie, ou use o motor) e <b>folgue a escota</b> da grande até ela panejar com pouca força. Sem pressão, a vela desce com facilidade.',
                '<b>Firme o amantilho e solte o burro.</b> O amantilho (do topo do mastro ao fim da retranca) segura a retranca para ela não cair no cockpit. O burro solto deixa a retranca subir e descer sem ficar presa.',
                '<b>Arrie a adriça</b> até o olhal de amura do rizo (na frente da vela) chegar ao nível do gancho, junto ao mastro. Segure a adriça sob controle, sem soltá-la de uma vez.',
                '<b>Prenda o olhal no gancho</b> e <b>cace a adriça</b> de novo, até a testa ficar esticada, sem rugas.',
                '<b>Cace o cabo do rizo</b> (o que passa pelo olhal de popa do rizo, na valuma, e desce à retranca) até o pé da vela esticar e a valuma ficar reta. O pano que sobra fica numa bolsa sobre a retranca. Se houver tiras (rizeiros), passe-as por baixo da vela, <b>folgadas</b>, só para arrumar o pano: elas não suportam carga.',
                '<b>Volte à navegação.</b> Solte o amantilho, cace o burro e a escota, arribe até o rumo desejado. Veja se a banda diminuiu e o leme ficou leve; se não, vá ao 2º rizo ou reduza a genoa. Recolha todos os cabos soltos.',
              ] },
              { t: 'widget', w: 'manobras', opts: { manobra: 'rizar', variante: '1' }, legenda: 'A sequência do rizo, em vista de lado, com cada cabo destacado em cada etapa. Compare o 1º e o 2º rizo no seletor.' },
              { t: 'h', txt: 'O motivo de cada passo' },
              { t: 'lista', itens: [
                '<b>Folgar a escota antes</b>: com a vela cheia de vento não dá para baixar o pano; o atrito é enorme.',
                '<b>Amantilho e burro</b>: sem o amantilho, a retranca cai; com o burro preso, a retranca não sobe quando a vela desce.',
                '<b>Testa antes da valuma</b>: primeiro se prende e estica a frente da vela; depois se puxa o cabo do rizo. Fazer ao contrário deforma a vela e pode rasgá-la.',
                '<b>Cabo do rizo até o pé esticar</b>: se ficar frouxo, a bolsa fica funda e o pano “enche” de vento, o que anula o rizo.',
              ] },
              { t: 'h', txt: 'Erros comuns' },
              { t: 'tabela', cab: ['Erro', 'Consequência'],
                linhas: [
                  ['Rizar com a vela cheia de vento', 'Esforço enorme e desgaste da vela e dos cabos; risco de dano ao mastro e às ferragens'],
                  ['Esquecer o amantilho', 'A retranca cai no cockpit e pode ferir alguém'],
                  ['Esquecer de soltar o burro', 'A vela não desce e a manobra empaca'],
                  ['Caçar o cabo do rizo antes de esticar a testa', 'A vela fica deformada e torta, com a bolsa mal posta'],
                  ['Rizar com a tripulação sem arnês', 'Risco de queda no trabalho de mastro, em especial à noite'],
                  ['Esperar demais', 'A manobra vira emergência com o barco deitado e o vento forte'],
                ],
                legenda: 'Pratique em vento moderado, em águas abrigadas, até a sequência virar hábito. Se possível, marque nos cabos a posição de cada rizo.' },
              { t: 'callout', tipo: 'dica', titulo: 'Ensaie com o barco parado', html: 'Antes de sair, no cais ou no fundeio, passe cada cabo de rizo, confira se os olhais, as roldanas e os mordedores estão no lugar certo e se o cabo corre. Um cabo de rizo mal passado só se descobre na hora do vento forte.' },
              { t: 'check', questoes: [
                { id: 'vela1-l23-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Antes de arriar a vela para dar um rizo, o que se faz com a escota da grande?',
                  alternativas: ['Caça-se ao máximo.', 'Folga-se até a vela panejar com pouca força.', 'Solta-se de todo e deixa-se a retranca livre.', 'Não se mexe.'],
                  correta: 1,
                  explicacao: 'Com a vela panejando, a pressão do vento é pequena e a vela desce com facilidade, sem esforço nem danos. Caçar aumentaria a pressão; soltar tudo deixa a retranca balançando e, ainda assim, é preciso o amantilho; e não mexer na escota torna a manobra difícil.',
                  referencia: 'RYA Day Skipper Handbook (Sail), rizar; manobras do app' },
                { id: 'vela1-l23-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Para que serve o amantilho ao rizar?',
                  alternativas: ['Içar a vela.', 'Sustentar a ponta da retranca para ela não cair quando a vela é arriada.', 'Esticar a esteira.', 'Controlar a torção da vela.'],
                  correta: 1,
                  explicacao: 'Com a vela baixando, nada mais segura a retranca. O amantilho, do topo do mastro ao fim da retranca, a sustenta. A adriça iça a vela, o cabo da esteira estica a borda de baixo e o burro controla a torção.',
                  referencia: 'Glossário (amantilho); RYA Day Skipper Handbook' },
                { id: 'vela1-l23-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Qual a ordem correta ao fim do rizo, depois de prender o olhal de amura no gancho?',
                  alternativas: ['Caçar o cabo do rizo e depois a adriça.', 'Caçar a adriça até a testa ficar esticada e depois o cabo do rizo até o pé esticar.', 'Não é preciso caçar a adriça.', 'Soltar o burro e caçar a escota.'],
                  correta: 1,
                  explicacao: 'A testa vem primeiro (adriça), depois a valuma e o pé (cabo do rizo): assim a vela não se deforma. Inverter a ordem pode rasgar o pano e produzir uma bolsa mal posta. O burro é caçado no final, não antes.',
                  referencia: 'RYA Day Skipper Handbook (Sail); manobras do app' },
              ] },
              { t: 'fontes', itens: [RYA, COLES, wk('Reef (sailing)', 'Reef_(sailing)')] },
            ],
          },
          /* ---------------------------------------------------------------- l24 */
          {
            id: 'l24', titulo: 'Enrolar a genoa e equilibrar o pano', minutos: 9,
            objetivos: [
              'Enrolar a genoa corretamente e ajustar o carrinho depois.',
              'Equilibrar a grande e a vela de proa para manter o leme leve.',
              'Reconhecer quando é hora de trocar para uma vela menor.',
            ],
            blocos: [
              { t: 'p', html: 'A genoa enrolável é a ferramenta de redução mais rápida de um cruzeiro: puxa-se um cabo do cockpit e ela diminui. Mas, para usá-la bem, é preciso entender como ela se comporta e o que muda no equilíbrio do barco.' },
              { t: 'termos', ids: ['enrolador', 'genoa', 'buja', 'vela-de-proa'] },
              { t: 'h', txt: 'Como enrolar' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Alivie a vela.</b> Arribe um pouco, ou folgue a escota, para a genoa carregar menos pressão.',
                '<b>Puxe o cabo do enrolador</b> aos poucos, enquanto outra pessoa <b>folga a escota</b> devagar, mantendo uma <b>leve tensão</b> nela. Com a escota totalmente solta, a vela se enrola frouxa, com mau acabamento; com a escota muito tensa, o enrolador trava.',
                '<b>Pare</b> quando a área ficar a desejada. Prenda o cabo do enrolador num mordedor ou cunho: <b>nunca deixe o cabo solto</b>, pois a vela pode desenrolar sozinha com vento forte.',
                '<b>Reajuste a escota e o carrinho.</b> Com a vela menor, o punho de escota fica mais alto e mais perto do mastro: mova o <b>carrinho para a frente</b> para o ângulo de puxada continuar bom.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Cuidado com o enrolador', html: 'Mantenha mãos e corpo longe do tambor e das escotas ao enrolar, e <b>nunca desenrole a vela sem escota na mão</b>: um desenrolar descontrolado transforma a vela numa bandeira que chicoteia o convés. Na proa, vá com arnês.' },
              { t: 'h', txt: 'Genoa enrolada em demasia' },
              { t: 'p', html: 'A genoa é cortada para trabalhar inteira. Quando é enrolada muito, a vela fica com a bolsa funda e com o perfil “redondo” e rende mal na bolina, e o tecido enrolado em volta do estai cria uma grande “barriga”. A solução é <b>reduzir a grande primeiro</b>, ou então trocar a genoa por uma vela menor e mais plana: a <b>buja</b> ou, com vento muito forte, o <b>tormentim</b>. Em barcos com estai interno (<i>cutter</i>), a vela pequena já está pronta no estai interno.' },
              { t: 'h', txt: 'Equilíbrio: o que acontece com o leme' },
              { t: 'p', html: 'Cada vela empurra o barco num ponto próprio, e a soma dessas forças é o <b>centro de esforço</b>. Os projetistas põem esse centro um pouco à frente do <b>centro de resistência lateral</b> da quilha (o “avanço”); com o barco adernado, o ponto de aplicação da força das velas se desloca para sotavento, e o resultado é uma pequena tendência de orçar (um pouco de ardência, que dá “peso” ao leme). Se o centro de esforço vai demais para trás, o leme fica duro e o barco orça; se vai demais para frente, o barco fica mole e arriba.' },
              { t: 'tabela', cab: ['O que você faz', 'Efeito no equilíbrio', 'Sintoma que corrige'],
                linhas: [
                  ['<b>Rizar a grande</b>', 'O esforço vai para a frente: menos ardência', 'Leme duro, barco orçando, banda grande'],
                  ['<b>Enrolar a genoa</b>', 'O esforço vai para trás: mais ardência', 'Barco mole, arribando demais (pouco comum com pano forte)'],
                  ['<b>Reduzir as duas juntas</b>', 'Equilíbrio mantido, menos força', 'Pano demais em geral'],
                ],
                legenda: 'Regra prática: na bolina, quando o leme fica duro e o barco aderna, a grande é a primeira candidata a reduzir; quando o barco fica mole e o vento é muito forte, reduza a genoa e mantenha a grande. Em geral, reduzem-se as duas, em passos de “um pouco de cada”.' },
              { t: 'widget', w: 'veleiro-3d', opts: { vento: 50, forca: 20, rizo: 1, genoa: 40, grupo: 'velas', vista: '34' }, legenda: 'Teste o equilíbrio: com 20 nós, veja a banda com pano todo, depois com um rizo, depois com a genoa enrolada em 40%.' },
              { t: 'h', txt: 'Velas de tempestade (noções)' },
              { t: 'p', html: 'Para vento muito forte, existem velas de tempestade: o <b>tormentim</b> (<i>storm jib</i>, vela de proa pequena e muito resistente, de cor viva) e a <b>vela de capa</b> (<i>trysail</i>, uma pequena vela triangular, ligada ao mastro por uma pista própria, sem usar a retranca). Elas são para quem navega em mar aberto: têm de estar a bordo, testadas e prontas, e é preciso treinar a içá-las antes de precisar. Em vento muito forte, a combinação tormentim e vela de capa, ou apenas o tormentim, permite manter o barco governável.' },
              { t: 'check', questoes: [
                { id: 'vela1-l24-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Ao enrolar a genoa, qual o cuidado com a escota?',
                  alternativas: ['Soltá-la completamente.', 'Folgá-la devagar, mantendo uma leve tensão, enquanto se puxa o cabo do enrolador.', 'Caçá-la ao máximo.', 'Cortá-la.'],
                  correta: 1,
                  explicacao: 'Uma leve tensão faz a vela enrolar firme e uniforme. Sem tensão, a vela enrola frouxa e se danifica; com tensão forte, o enrolador pode travar. Cortar a escota não faz sentido.',
                  referencia: 'RYA Day Skipper Handbook (Sail); manuais de enroladores' },
                { id: 'vela1-l24-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Depois de enrolar parte da genoa, o que se faz com o carrinho da escota?',
                  alternativas: ['Nada.', 'Leva-se para a frente, para manter bom o ângulo de puxada da escota.', 'Leva-se para trás, para fechar a esteira.', 'Retira-se do carril.'],
                  correta: 1,
                  explicacao: 'Com a vela menor, o punho de escota sobe e se aproxima do mastro. Para continuar puxando num ângulo adequado, o carrinho vai para a frente. Para trás, a escota puxaria mais horizontalmente e esticaria demais a esteira.',
                  referencia: 'RYA Sail Cruising Syllabus; Marchaj, Sail Performance' },
                { id: 'vela1-l24-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'O barco está com a grande inteira e o leme fica duro, com banda grande. Qual a primeira providência de redução?',
                  alternativas: ['Dar um rizo na grande.', 'Içar a genoa maior.', 'Enrolar a genoa até quase nada e manter a grande inteira.', 'Soltar o estai de popa e o burro.'],
                  correta: 0,
                  explicacao: 'A grande, a ré do mastro, é a maior causadora do leme duro e da banda. Rizá-la leva o centro de esforço para a frente e alivia o leme. Uma genoa maior pioraria; enrolar a genoa (e manter a grande) agravaria a ardência; soltar o estai de popa e o burro deixa a vela mais cheia, com mais força.',
                  referencia: 'RYA Day Skipper Handbook (Sail); Marchaj, Sail Performance' },
              ] },
              { t: 'fontes', itens: [RYA, COLES, MARCHAJ2, wk('Roller furling', 'Roller_furling'), wk('Storm jib', 'Storm_jib'), wk('Trysail', 'Trysail')] },
            ],
          },
          /* ---------------------------------------------------------------- l25 */
          {
            id: 'l25', titulo: 'Capear (heave-to)', minutos: 10,
            objetivos: [
              'Explicar o que é capear e por que o barco fica estável.',
              'Descrever como entrar e sair do capeio.',
              'Reconhecer os usos e os limites da manobra.',
            ],
            blocos: [
              { t: 'p', html: '<b>Capear</b> (em inglês, <i>heave-to</i>) é uma maneira de fazer um veleiro ficar <b>quase parado e estável</b>, com a proa a cerca de 50° a 60° do vento, derivando devagar. É uma das manobras mais úteis da vela de cruzeiro, porque transforma um barco em movimento, deitado e sacudido, num barco calmo, onde se pode comer, descansar, rizar com tranquilidade ou pensar com calma. É uma espécie de “botão de pausa”.' },
              { t: 'termos', ids: ['capear'] },
              { t: 'h', txt: 'Como funciona' },
              { t: 'p', html: 'A manobra é uma cambada em que <b>a escota da genoa não é solta</b>. A proa passa pelo vento, mas a genoa fica <b>a contravento</b> (<i>backed</i>), isto é, o vento a empurra de frente e para trás e ela tenta <b>fazer a proa cair</b>, longe do vento. O leme, preso todo orçando, tenta <b>fazer a proa subir</b>. A grande, folgada, perde força. As forças se equilibram e o barco fica parado em um ângulo estável.' },
              { t: 'figura', svg: F_CAPEAR, legenda: 'Barco capeado: a genoa a contravento empurra a proa para longe do vento, o leme todo orçando a puxa de volta e a grande folgada só mantém um pouco de força. Resultado: o barco quase para, deriva de lado devagar e deixa uma esteira lisa a barlavento.' },
              { t: 'h', txt: 'Passo a passo' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Prepare.</b> “Preparar para capear!” Olhe o espaço livre a sotavento: o barco derivará. Explique que a escota da genoa <b>não será solta</b>.',
                '<b>Cambe sem soltar a genoa.</b> “Cambando! Não solta a genoa!” O timoneiro orça como na cambada. A genoa, retida, fica a contravento.',
                '<b>Folgue a grande</b> um pouco, para ela não puxar o barco para o vento.',
                '<b>Leme todo orçando.</b> Cana para sotavento (ou roda para o lado do vento) e prenda-a nessa posição, com um cabo ou com o freio da roda.',
                '<b>Ajuste.</b> Mexa na escota da grande e na posição do leme até o barco ficar estável: proa a uns 50° a 60° do vento e deriva lenta, de cerca de 1 nó ou menos.',
                '<b>Para sair</b>: solte a escota da genoa que estava a contravento, cace a do outro lado, centralize o leme e arribe até ganhar velocidade.',
              ] },
              { t: 'widget', w: 'manobras', opts: { manobra: 'capear' }, legenda: 'A manobra de capear, passo a passo. Observe o que faz a genoa e o que faz o leme em cada etapa, e depois repita no modo desafio.' },
              { t: 'h', txt: 'Para que serve' },
              { t: 'lista', itens: [
                '<b>Pausa</b>: refeição, descanso, esperar a luz do dia ou a maré.',
                '<b>Rizar ou trocar velas com calma</b>: o barco fica estável e parado, e o convés fica seguro.',
                '<b>Aliviar a tripulação</b> em tempo duro: o barco “estaciona” e a tripulação descansa em turnos.',
                '<b>Resolver um problema a bordo</b> com o barco parado, como um cabo na hélice ou um reparo.',
              ] },
              { t: 'h', txt: 'Limites' },
              { t: 'lista', itens: [
                '<b>Nem todo barco capeia igual.</b> Quilhas longas costumam capear com folga; muitos cruzeiros modernos de quilha de aleta também capeiam bem, mas alguns seguem para a frente mais do que o desejado ou ficam inquietos. <b>Pratique</b> com o seu barco, em tempo bom, para achar o ajuste (escota da grande, leme).',
                '<b>Espaço a sotavento.</b> O barco deriva, e perto de costa, de baixios ou de tráfego isso é um risco. Capear exige mar livre a sotavento.',
                '<b>Mar grosso.</b> Com ondas que quebram, capear com a genoa pode não bastar: pode ser preciso trocar a genoa por um tormentim a contravento e a grande por uma vela de capa (ou de pano reduzido), ou escolher outra tática (lição 26).',
                '<b>Vigilância.</b> O barco capeado continua derivando, e o RIPEAM continua valendo: mantenha vigia e as luzes certas.',
              ] },
              { t: 'callout', tipo: 'nota', titulo: 'Orientação geral', html: 'O ajuste fino do capeio (quanto folgar a grande, quanto de leme) é diferente em cada barco. Treine em vento moderado, com instrutor, e anote o ajuste do seu barco. Em tempo duro, a escolha entre capear, correr com o tempo ou outra tática depende do barco, da tripulação, do mar e do espaço disponível.' },
              { t: 'check', questoes: [
                { id: 'vela1-l25-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Qual a característica essencial de capear um veleiro?',
                  alternativas: ['Soltar a genoa e a grande ao mesmo tempo.', 'Cambar sem soltar a genoa, de modo que ela fique a contravento, e prender o leme orçando.', 'Arribar até a popa total e arriar as velas.', 'Ligar o motor em ré.'],
                  correta: 1,
                  explicacao: 'A genoa a contravento tenta fazer a proa cair e o leme todo orçando tenta fazê-la subir: o equilíbrio dessas duas forças deixa o barco quase parado. Soltar as velas, arribar à popa ou usar o motor em ré não produz esse equilíbrio.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; manobras do app' },
                { id: 'vela1-l25-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Quando o barco está capeado, ele:',
                  alternativas: ['Fica totalmente parado, sem deriva.', 'Fica quase parado, estável a 50° a 60° do vento, derivando lentamente de lado.', 'Corre a toda velocidade a favor das ondas.', 'Fica com a proa exatamente ao vento.'],
                  correta: 1,
                  explicacao: 'O capeio não é imobilidade total: o barco deriva devagar para sotavento (em torno de 1 nó ou menos), com a proa a uns 50° a 60° do vento. Por isso é preciso ter espaço livre a sotavento.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; manobras do app' },
                { id: 'vela1-l25-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Qual o maior cuidado antes de capear?',
                  alternativas: ['Que haja espaço livre a sotavento, pois o barco vai derivar.', 'Que o motor esteja desligado.', 'Que a âncora esteja pronta.', 'Que a genoa esteja rasgada.'],
                  correta: 0,
                  explicacao: 'O barco capeado deriva para sotavento, então o espaço livre nessa direção é essencial. Os demais itens não são exigências do capeio, e uma genoa rasgada não funcionaria para a manobra.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; Coles, Heavy Weather Sailing' },
              ] },
              { t: 'fontes', itens: [RYA, COLES, PARDEY, wk('Heaving to', 'Heaving_to')] },
            ],
          },
          /* ---------------------------------------------------------------- l26 */
          {
            id: 'l26', titulo: 'Correr com o tempo, drogue e âncora flutuante', minutos: 10,
            objetivos: [
              'Descrever a tática de correr com o tempo e seus riscos.',
              'Distinguir o drogue (âncora de arrasto, pela popa) da âncora flutuante (pela proa).',
              'Reconhecer que essas táticas exigem preparo, espaço e treino.',
            ],
            blocos: [
              { t: 'callout', tipo: 'nota', titulo: 'Noções, não receita', html: 'Esta lição apresenta noções. Táticas de tempo duro, drogues e âncoras flutuantes dependem do barco, da tripulação e do mar, e se aprendem com instrutor e prática. Quem planeja uma travessia deve estudar as obras citadas nas fontes e treinar a lançar o equipamento, em tempo bom, antes de precisar.' },
              { t: 'p', html: 'Quando o tempo é muito duro e o barco não pode ficar parado na bolina, há duas grandes famílias de tática: <b>ficar na proa ao mar</b> (capear, parar, segurar-se com uma âncora flutuante) ou <b>correr com o tempo</b>, indo com o vento e as ondas por trás. Cada uma tem prós e contras.' },
              { t: 'h', txt: 'Correr com o tempo' },
              { t: 'p', html: 'Correr com o tempo (<i>running off</i>) é governar com o vento e o mar pela popa, com pouco pano (às vezes só o tormentim ou até nenhum pano) e a velocidade controlada. O vento aparente é pequeno e o barco anda confortável, e se ganha milhas na direção do vento. Mas há riscos sérios:' },
              { t: 'lista', itens: [
                '<b>Atravessar</b> (<i>broaching</i>): uma onda gira a popa e o barco se coloca de través, deitando-se. Pode causar o emborcamento.',
                '<b>Surfar</b>: o barco acelera descendo as ondas, perde o leme e pode ficar fora de controle ou enterrar a proa.',
                '<b>Exige governo constante</b> e atento, e a tripulação se cansa. É uma tática que cobra do timoneiro.',
                '<b>Exige espaço</b>: você vai na direção do vento e pode ir em direção a uma costa.',
              ] },
              { t: 'p', html: 'Para correr bem, o barco precisa de <b>pouco pano</b> (o suficiente para governar, mas não tanto que o barco surfe), <b>leme em boa forma</b> e uma tripulação descansada. A velocidade é limitada pelas ondas: se o barco corre mais depressa que a onda, ele alcança a onda à frente e pode enterrar a proa; se corre devagar demais, a onda o ultrapassa, levanta a popa e o leme perde o efeito. Um <b>drogue</b> ajuda a manter a velocidade moderada e a popa alinhada com as ondas.' },
              { t: 'h', txt: 'Drogue (âncora de arrasto) e âncora flutuante' },
              { t: 'figura', svg: F_DROGUE, legenda: 'Em cima, um barco que corre com o tempo, com um drogue rebocado pela popa. Embaixo, um barco com a proa ao mar, preso por uma âncora flutuante lançada pela proa.' },
              { t: 'tabela', cab: ['', 'Drogue (âncora de arrasto)', 'Âncora flutuante (de capa, paraquedas)'],
                linhas: [
                  ['<b>Onde vai</b>', 'Pela popa, rebocado', 'Pela proa, lançada à frente do barco'],
                  ['<b>Para quê</b>', 'Frear o barco que corre com o tempo, manter a popa para as ondas e evitar atravessar', 'Manter a proa ao mar com o barco quase parado, quando não é mais possível governar'],
                  ['<b>Forma</b>', 'Cones, correntes ou uma série de pequenos cones em linha (série de drogues)', 'Paraquedas ou cone grande, com cabo comprido'],
                  ['<b>Cuidado</b>', 'Ponto de amarração forte na popa; o cabo não pode se enroscar no leme ou na hélice', 'Ponto de amarração forte na proa; cabo longo, com proteção contra atrito; recolher é difícil'],
                ],
                legenda: 'Noções: a escolha, o tamanho do equipamento e o modo de usar dependem do barco. Confira as obras recomendadas e o fabricante.' },
              { t: 'lista', itens: [
                'Os dois dispositivos existem para <b>reduzir o risco de o barco ser atingido de lado por uma onda</b> e para dar tempo à tripulação para descansar.',
                'Ambos exigem <b>pontos de fixação fortes</b> e <b>cabos longos e protegidos do atrito</b>: um cabo que parte, ou que fricciona na buzina, torna o dispositivo inútil.',
                'Ambos precisam ser <b>testados e ensaiados</b> antes: lançar um drogue numa tempestade, sem nunca ter feito isso, é um erro grave.',
                'Não há dispositivo universal: autores experientes divergem sobre qual é o melhor, e muita coisa depende do desenho do casco e do mar. Por isso, este é um assunto para estudar com cuidado nas fontes e conversar com instrutores experientes.',
              ] },
              { t: 'h', txt: 'Antes de tudo: evite estar lá' },
              { t: 'p', html: 'A melhor tática de mau tempo é <b>não estar lá</b>: previsão do tempo, janela de partida, abrigo à vista e a decisão de ficar no porto. As táticas desta lição são para o que sobra quando o planejamento falhou, e nunca devem ser parte do plano.' },
              { t: 'check', questoes: [
                { id: 'vela1-l26-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Qual a diferença básica entre um drogue e uma âncora flutuante?',
                  alternativas: ['O drogue é lançado pela popa para frear o barco que corre com o tempo; a âncora flutuante é lançada pela proa para manter a proa ao mar.', 'O drogue é lançado pela proa e a âncora flutuante pela popa.', 'São o mesmo equipamento com nomes diferentes.', 'O drogue só se usa com o motor ligado.'],
                  correta: 0,
                  explicacao: 'O drogue, rebocado pela popa, modera a velocidade e mantém a popa para as ondas; a âncora flutuante, lançada pela proa, segura o barco com a proa ao mar. Não são o mesmo equipamento, e nenhum depende do motor.',
                  referencia: 'Coles e Bruce, Heavy Weather Sailing; Pardey, The Storm Tactics Handbook' },
                { id: 'vela1-l26-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Qual o principal risco ao correr com o tempo em mar grosso?',
                  alternativas: ['Faltar vento.', 'Atravessar (broaching) ou surfar fora de controle numa onda.', 'O vento aparente muito forte.', 'O barco ficar parado.'],
                  correta: 1,
                  explicacao: 'Com o mar por trás, o barco pode ser girado para o través por uma onda (broaching) ou descer a onda fora de controle, e o risco inclui o emborcamento. Em corrida, o vento aparente é pequeno e o barco não fica parado, ao contrário do que sugerem as demais alternativas.',
                  referencia: 'Coles e Bruce, Heavy Weather Sailing' },
                { id: 'vela1-l26-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Qual a melhor “tática” de mau tempo?',
                  alternativas: ['Preparar-se para correr com o tempo.', 'Evitar estar no mar com tempo duro, por previsão, planejamento e escolha da janela.', 'Içar todo o pano para fugir mais rápido.', 'Ignorar a previsão.'],
                  correta: 1,
                  explicacao: 'A tática mais segura é evitar o mau tempo, com previsão, planejamento e decisão de ficar no porto. As táticas de tempo duro são o último recurso, e içar pano em excesso ou ignorar a previsão só aumenta o risco.',
                  referencia: 'RYA Yachtmaster Offshore Handbook, planejamento e meteorologia' },
              ] },
              { t: 'fontes', itens: [COLES, PARDEY, RYA, wk('Sea anchor', 'Sea_anchor'), wk('Broaching (sailing)', 'Broaching_(sailing)')] },
            ],
          },
          /* ---------------------------------------------------------------- l27 */
          {
            id: 'l27', titulo: 'Preparar o barco e a equipe para o mau tempo', minutos: 10,
            objetivos: [
              'Montar uma lista de preparo para tempo duro, dentro e fora do barco.',
              'Organizar a equipe: turnos, alimentação, segurança pessoal.',
              'Entender por que a decisão de se preparar vem antes da piora.',
            ],
            blocos: [
              { t: 'callout', tipo: 'nota', titulo: 'Lista de orientação geral', html: 'A lista abaixo é de orientação geral. Adapte-a ao seu barco, à sua tripulação e ao tipo de navegação; complemente-a com os requisitos oficiais que valem para a sua área de navegação.' },
              { t: 'p', html: 'Mau tempo raramente vem sem aviso. O que o torna perigoso é a combinação de vento forte e <b>preparo tardio</b>. A diferença entre um susto e um desastre costuma estar no que foi feito nas horas antes. O princípio é simples: <b>quando a previsão ou o céu mostrar que o tempo vai piorar, comece a se preparar, não espere a piora.</b>' },
              { t: 'termos', ids: ['aviso-de-mau-tempo', 'meteoromarinha', 'linha-de-vida', 'arnes', 'hipotermia', 'enjoo'] },
              { t: 'h', txt: 'Fora do barco: decisões' },
              { t: 'lista', itens: [
                '<b>Previsão</b>: confira os avisos de mau tempo e os boletins meteorológicos (como o Meteoromarinha, do CHM) e compare com o que você vê no céu e no mar.',
                '<b>Plano B</b>: tenha um porto de abrigo ou uma enseada protegida próxima, e decida a hora limite para ir até lá.',
                '<b>Comunicação</b>: avise alguém em terra do plano e da mudança. Confira o VHF, o rádio e os meios de socorro.',
                '<b>Navegação</b>: marque a posição com mais frequência, e escolha as rotas que não colocam o barco numa costa a sotavento.',
              ] },
              { t: 'h', txt: 'Dentro do barco: peação e estanqueidade' },
              { t: 'tabela', cab: ['Área', 'O que fazer'],
                linhas: [
                  ['<b>Interior</b>', 'Peie tudo que pode voar: panelas, ferramentas, livros, equipamento; baterias e objetos pesados bem presos; feche armários e gavetas com travas.'],
                  ['<b>Aberturas</b>', 'Escotilhas, vigias e gaiuta fechadas e travadas; tábuas da gaiuta no lugar; ventiladores fechados ou protegidos.'],
                  ['<b>Água e esgoto</b>', 'Bomba de porão automática e manual testadas; sentina limpa; válvulas de fundo que não estão em uso, fechadas.'],
                  ['<b>Gás e fogo</b>', 'Cilindro fechado quando não cozinhar; fogão com cardã (<i>gimbal</i>) livre enquanto se cozinha e travado quando fora de uso; extintores acessíveis.'],
                  ['<b>Convés</b>', 'Âncora, bote e botijões presos; cabos arrumados; linhas de vida montadas; velas de tempestade à mão.'],
                  ['<b>Motor e energia</b>', 'Combustível suficiente e sem água; filtro limpo; baterias carregadas; motor testado.'],
                  ['<b>Navegação e comunicações</b>', 'Cartas e plotter prontos; lanterna e binóculo à mão; VHF verificado; EPIRB e rádios portáteis acessíveis.'],
                ],
                legenda: 'Mau tempo faz o barco jogar, e o que está solto vira projétil. Teste a peação “sacudindo” os objetos, ou imaginando o barco de cabeça para baixo.' },
              { t: 'h', txt: 'A equipe' },
              { t: 'lista', itens: [
                '<b>Comida e água antes</b>: prepare uma refeição quente e leve, de fácil manuseio, e garrafas térmicas, antes de a piora chegar. Cozinhar em mau tempo é difícil; passar fome ou sede é pior.',
                '<b>Roupas e proteção</b>: agasalhos e roupa impermeável em camadas, luvas, gorro. Frio e molhado levam à <b>hipotermia</b>, que reduz o raciocínio e as forças.',
                '<b>Enjoo</b>: quem tende a enjoar deve tomar o remédio recomendado <b>antes</b>, não depois. Um tripulante enjoado perde a capacidade de ajudar.',
                '<b>Turnos de descanso</b>: ninguém aguenta muitas horas no leme. Combine turnos curtos e quem descansa, descansa de verdade.',
                '<b>Segurança pessoal</b>: coletes salva-vidas (de preferência com arnês) e <b>sempre presos</b> à linha de vida quando no convés ou no cockpit. À noite, ninguém sai sozinho.',
                '<b>Briefing</b>: o comandante explica a tática, as funções, as vozes de comando e o plano de “homem ao mar”.',
              ] },
              { t: 'h', txt: 'O que reduz o risco' },
              { t: 'lista', itens: [
                '<b>Reduza pano cedo</b> (lições 22 a 24) e <b>arrume a casa</b> antes de o vento subir.',
                '<b>Tenha o equipamento de tempestade a bordo e testado</b>: tormentim, vela de capa, drogue ou âncora flutuante, bem guardados e acessíveis.',
                '<b>Conheça o seu barco</b>: como ele reage a ondas, em que ângulo capeia melhor, o que acontece com o leme. Isso se aprende em dias de vento moderado, não na tempestade.',
                '<b>Mantenha a calma e a rotina</b>: horário de leme, refeições, relatórios de posição. A rotina ajuda a tripulação a manter a cabeça fria.',
              ] },
              { t: 'widget', w: 'beaufort', opts: { modo: 'quiz', questoes: 8 }, legenda: 'Teste seu olho para o vento: o quiz mostra o mar e você diz a força Beaufort, e confere a orientação geral de pano para cada uma.' },
              { t: 'check', questoes: [
                { id: 'vela1-l27-1', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Quando se deve começar a preparar o barco para o mau tempo?',
                  alternativas: ['Só depois que a tempestade chegar.', 'Assim que a previsão ou os sinais indicam piora, antes de o vento subir.', 'Quando algum equipamento quebrar.', 'Nunca: o barco se prepara sozinho.'],
                  correta: 1,
                  explicacao: 'Preparar-se antes da piora permite trabalhar com calma e segurança. Esperar o vento chegar ou algo quebrar transforma a preparação em emergência.',
                  referencia: 'RYA Yachtmaster Offshore Handbook; Coles, Heavy Weather Sailing' },
                { id: 'vela1-l27-2', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 1,
                  enunciado: 'Qual cuidado de equipe é importante antes de a piora chegar?',
                  alternativas: ['Cozinhar uma refeição quente e leve e preparar garrafas térmicas e roupa adequada.', 'Esvaziar o tanque de água.', 'Desligar todos os rádios.', 'Ancorar em águas abertas.'],
                  correta: 0,
                  explicacao: 'Comida, bebida quente e roupa adequada mantêm a tripulação eficiente e reduzem o risco de hipotermia e exaustão. As outras ações não ajudam a equipe e algumas (desligar rádios, esvaziar o tanque) prejudicam a segurança.',
                  referencia: 'RYA Yachtmaster Offshore Handbook' },
                { id: 'vela1-l27-3', nivel: 'vela', tema: 'Reduzir pano e mau tempo', dificuldade: 2,
                  enunciado: 'Por que “peiar” tudo dentro do barco antes do mau tempo?',
                  alternativas: ['Para o barco ficar mais bonito.', 'Porque com o barco jogando, objetos soltos viram projéteis e podem ferir a tripulação ou danificar o equipamento.', 'Para o barco ficar mais leve.', 'Porque a lei obriga.'],
                  correta: 1,
                  explicacao: 'Com o balanço e a banda, qualquer objeto solto é arremessado e pode ferir alguém ou quebrar equipamento. A peação não tem relação com estética ou peso, e aqui o motivo é a segurança prática, não uma exigência legal.',
                  referencia: 'RYA Yachtmaster Offshore Handbook' },
              ] },
              { t: 'fontes', itens: [RYA, COLES, BEAUFORT, { txt: 'World Sailing, Offshore Special Regulations (referência internacional de equipamento e preparo para navegação oceânica)', url: 'https://www.sailing.org/' }] },
            ],
          },
        ],
      },
    ],
  });
})();
