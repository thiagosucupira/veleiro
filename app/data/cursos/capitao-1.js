/* Curso Capitão-Amador — parte 1 (módulos m1 a m4).
   m1 Tempo e fusos horários · m2 A esfera celeste e o Almanaque Náutico · m3 Passagem meridiana do Sol ·
   m4 Além da prova: retas de altura e derrotas oceânicas.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 1.2 (Navegação Astronômica), alíneas a) I e II, b) e c);
   m4 vai além do programa (é preparo para a travessia e para a trilha RYA/ASA).
   Fontes técnicas: Miguens, Navegação: a Ciência e a Arte, vol. II — Navegação astronômica e derrotas (DHN,
   1ª rev. 2021); Almanaque Náutico (DHN); Bowditch, The American Practical Navigator (NGA Pub. 9).
   Fatos regulatórios só por bloco {t:'fato'} ou fonte com ref (ids de research/_work/research_*.json e de
   research/_work/research_extra_capitao-1.json).
   EXTRATOS DE ALMANAQUE: todos os extratos do Almanaque Náutico e da Tábua A2 mostrados aqui são SIMULADOS
   (calculados por fórmulas astronômicas de baixa precisão, ~0,1′) e servem só para treinar o método. Nunca
   reproduzem páginas reais do ANB; para navegar e para a prova use o Almanaque Náutico do ano, da DHN.
   Exemplos numéricos conferidos por cálculo (scripts de conferência fora do repositório). */
(function () {
  'use strict';

  var U = {
    mig2: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf',
    mig1: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf',
    normam: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf',
    provas: 'https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador',
    cpa2026: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/CPA-II-2026-MATRIZ.pdf',
    lei12876: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12876.htm',
    dec9772: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/decreto/d9772.htm',
    bowditch: 'https://msi.nga.mil/Publications/APN',
  };
  function mig2(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. II (DHN, 1ª rev. 2021), ' + loc, url: U.mig2 }; }
  function mig1(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), ' + loc, url: U.mig1 }; }
  function bow(loc) { return { txt: 'Bowditch, The American Practical Navigator (NGA Pub. 9), ' + loc, url: U.bowditch }; }

  /* questão: alternativas em ordem fixa quando fixa=true (valores numéricos crescentes, como na prova) */
  function q(id, tema, dif, enunciado, alternativas, correta, explicacao, referencia, url, fixa) {
    var o = { id: 'cpa1-' + id, nivel: 'capitao', tema: tema, dificuldade: dif, enunciado: enunciado,
      alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
    if (url) o.fonte_url = url;
    if (fixa) o.fixa = true;
    return o;
  }
  /* blocos curtos */
  function P(html) { return { t: 'p', html: html }; }
  function H(txt) { return { t: 'h', txt: txt }; }
  function L(itens, ordenada) { var b = { t: 'lista', itens: itens }; if (ordenada) b.ordenada = true; return b; }
  function C(tipo, titulo, html) { return { t: 'callout', tipo: tipo, titulo: titulo, html: html }; }
  function TB(cab, linhas, legenda) { var b = { t: 'tabela', cab: cab, linhas: linhas }; if (legenda) b.legenda = legenda; return b; }
  function FIG(svgStr, legenda) { return { t: 'figura', svg: svgStr, legenda: legenda }; }
  function CHK(qs, titulo) { var b = { t: 'check', questoes: qs }; if (titulo) b.titulo = titulo; return b; }
  function FT(itens) { return { t: 'fontes', itens: itens }; }
  function FATO(ref, html) { return { t: 'fato', ref: ref, html: html }; }
  function TERM(ids) { return { t: 'termos', ids: ids }; }
  function WID(w, opts, legenda) { var b = { t: 'widget', w: w, opts: opts || {} }; if (legenda) b.legenda = legenda; return b; }
  function SIM() {
    return C('nota', 'Extrato simulado', 'As tabelas e páginas desta lição são <b>simuladas</b> para treino: foram calculadas por fórmulas astronômicas e têm o mesmo formato do Almanaque Náutico, mas <b>não são páginas reais</b>. Na prova e no mar use o Almanaque Náutico do ano, da DHN.');
  }

  /* SVG inline: viewBox, largura 100%, só tokens de cor, texto de 16 unidades (≥ 12 px no celular). */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" role="img" style="max-width:' + (maxw || 520) +
      'px;display:block;margin:0 auto;font-size:16px" xmlns="http://www.w3.org/2000/svg"><title>' + titulo + '</title>' + corpo + '</svg>';
  }
  var TX = 'fill="var(--ink)"';
  var MG = 'stroke="var(--magenta)"';
  var INK = 'stroke="var(--ink)"';
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.fill || 'var(--ink)') + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.bold ? ' font-weight="700"' : '') + (o.size ? ' font-size="' + o.size + '"' : '') +
      (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>';
  }
  function rad(g) { return g * Math.PI / 180; }

  /* Diagrama de tempo (visto do polo sul celeste, como no Manual da DHN): a esfera gira para o Oeste no sentido
     anti-horário; Greenwich fica no alto. Ângulos medidos a partir do meridiano superior, para Oeste (anti-horário).
     o: {cx, cy, r, lonW (graus, longitude oeste do observador), ahg (graus, AHG do astro), astro (rótulo),
         estrela: bool (o astro é uma estrela: mostra também o Ponto Vernal), ahgPV, mostrarHora: bool} */
  function diagTempo(o) {
    var cx = o.cx || 200, cy = o.cy || 160, r = o.r || 120;
    function pt(ang, rr) { var a = rad(90 + ang); return [cx + rr * Math.cos(a), cy - rr * Math.sin(a)]; }
    function arco(a0, a1, rr, cor, w) {
      var p0 = pt(a0, rr), p1 = pt(a1, rr), grande = (a1 - a0) > 180 ? 1 : 0;
      return '<path d="M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + rr + ' ' + rr + ' 0 ' + grande + ' 0 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + '" fill="none" stroke="' + cor + '" stroke-width="' + (w || 2) + '"/>';
    }
    function rotulo(ang, rr, t, op) {
      var p = pt(ang, rr), dx = p[0] - cx, an = Math.abs(dx) < 12 ? 'middle' : (dx < 0 ? 'end' : 'start');
      var x = p[0] + (an === 'end' ? -4 : an === 'start' ? 4 : 0);
      return txt(x.toFixed(1), (p[1] + 5).toFixed(1), t, { anchor: an, bold: op && op.bold, fill: op && op.fill });
    }
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--sea-1)" stroke="var(--sea-3)" stroke-width="1.5"/>';
    // meridiano de Greenwich: linha toda (superior em cima, inferior em baixo)
    var g0 = pt(0, r), g1 = pt(180, r);
    s += '<line x1="' + g0[0] + '" y1="' + g0[1] + '" x2="' + g1[0] + '" y2="' + g1[1] + '" ' + INK + ' stroke-width="1.5" stroke-dasharray="5 4"/>';
    s += txt(g0[0], g0[1] - 8, 'Greenwich', { anchor: 'middle', bold: true });
    if (o.lonW != null) {
      var l0 = pt(o.lonW, r), l1 = pt(o.lonW + 180, r);
      s += '<line x1="' + l0[0].toFixed(1) + '" y1="' + l0[1].toFixed(1) + '" x2="' + l1[0].toFixed(1) + '" y2="' + l1[1].toFixed(1) + '" ' + INK + ' stroke-width="1.5"/>';
      s += rotulo(o.lonW, r + 8, 'local', { bold: true });
      s += arco(0, o.lonW, r * 0.22, 'var(--ink)', 2);
      s += rotulo(o.lonW / 2, r * 0.22 + 12, 'λ');
    }
    if (o.ahg != null) {
      var a = pt(o.ahg, r);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + a[0].toFixed(1) + '" y2="' + a[1].toFixed(1) + '" ' + MG + ' stroke-width="2.5"/>';
      s += '<circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="7" fill="var(--magenta)"/>';
      s += rotulo(o.ahg, r + 14, o.astro || 'astro', { bold: true });
      s += arco(0, o.ahg, r * 0.50, 'var(--magenta)', 2.5);
      s += rotulo(o.ahg / 2, r * 0.50 + 12, 'AHG', { bold: true, fill: 'var(--magenta)' });
      if (o.lonW != null) {
        s += arco(o.lonW, o.ahg, r * 0.78, 'var(--ink)', 2);
        s += rotulo((o.lonW + o.ahg) / 2, r * 0.78 + 12, 'AHL');
      }
    }
    if (o.ahgPV != null && o.ahg != null) {
      s += arco(o.ahgPV, o.ahg, r * 0.78, 'var(--ink)', 2);
      s += rotulo((o.ahgPV + o.ahg) / 2, r * 0.78 + 12, 'ARV', {});
    }
    if (o.ahgPV != null) {
      var v = pt(o.ahgPV, r);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + v[0].toFixed(1) + '" y2="' + v[1].toFixed(1) + '" ' + INK + ' stroke-width="2" stroke-dasharray="2 4"/>';
      s += rotulo(o.ahgPV, r + 14, 'γ', { bold: true });
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="var(--ink)"/>';
    return s;
  }


  /* Plano do meridiano do observador (norte à esquerda, sul à direita). Ângulos medidos a partir do horizonte Sul,
     no sentido anti-horário: Zênite = 90°. Equador celeste (lado do zênite) em 90° − φ; astro de declinação δ em
     90° + δ − φ; polo elevado em 180° − φ (φ ≥ 0) ou −φ (φ < 0). φ e δ com sinal (N positivo).
     o: {cx, cy, r, lat, dec, astro: rótulo, poles: bool, arcos: ['z','dec','lat'], nomeLat, nomeDec} */
  function meridPlano(o) {
    var cx = o.cx || 220, cy = o.cy || 135, r = o.r || 105, lat = o.lat, dec = o.dec;
    function pt(a, rr) { return [cx + rr * Math.cos(rad(a)), cy - rr * Math.sin(rad(a))]; }
    function f(v) { return v.toFixed(1); }
    function seg(a0, a1, rr, cor, w, dash) {
      var p0 = pt(a0, rr), p1 = pt(a1, rr), lo = Math.min(a0, a1), hi = Math.max(a0, a1);
      var A = a0 < a1 ? p0 : p1, B = a0 < a1 ? p1 : p0;
      return '<path d="M' + f(A[0]) + ' ' + f(A[1]) + ' A' + rr + ' ' + rr + ' 0 ' + ((hi - lo) > 180 ? 1 : 0) + ' 0 ' + f(B[0]) + ' ' + f(B[1]) + '" fill="none" stroke="' + cor + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
    }
    function rot(a, rr, t, op) {
      var p = pt(a, rr), dx = p[0] - cx, an = Math.abs(dx) < 10 ? 'middle' : (dx < 0 ? 'end' : 'start');
      var x = p[0] + (an === 'end' ? -3 : an === 'start' ? 3 : 0), y = p[1] + (Math.abs(p[1] - cy) < 6 ? 5 : (p[1] < cy ? -2 : 13));
      return txt(f(x), f(y), t, { anchor: an, bold: op && op.bold, fill: op && op.fill, size: op && op.size });
    }
    var aEq = 90 - lat, aB = 90 + dec - lat, aPol = lat >= 0 ? 180 - lat : -lat;
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--sea-1)" stroke="var(--sea-3)" stroke-width="1.5"/>';
    s += '<line x1="' + (cx - r) + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" ' + INK + ' stroke-width="1.5"/>';
    s += txt(cx - r - 6, cy + 5, 'N', { anchor: 'end', bold: true }) + txt(cx + r + 6, cy + 5, 'S', { anchor: 'start', bold: true });
    var z0 = pt(90, r);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + f(z0[0]) + '" y2="' + f(z0[1]) + '" ' + INK + ' stroke-width="1.2" stroke-dasharray="4 4"/>';
    s += '<circle cx="' + f(z0[0]) + '" cy="' + f(z0[1]) + '" r="3.5" fill="var(--ink)"/>' + txt(f(z0[0]), f(z0[1] - 8), 'Z', { anchor: 'middle', bold: true });
    var e0 = pt(aEq, r), e1 = pt(aEq + 180, r);
    s += '<line x1="' + f(e0[0]) + '" y1="' + f(e0[1]) + '" x2="' + f(e1[0]) + '" y2="' + f(e1[1]) + '" ' + INK + ' stroke-width="2"/>';
    s += rot(aEq + 180, r + 6, 'equador', {});
    if (o.poles) {
      var p0 = pt(aPol, r), p1 = pt(aPol + 180, r);
      s += '<line x1="' + f(p0[0]) + '" y1="' + f(p0[1]) + '" x2="' + f(p1[0]) + '" y2="' + f(p1[1]) + '" ' + INK + ' stroke-width="1.2" stroke-dasharray="2 4"/>';
      s += '<circle cx="' + f(p0[0]) + '" cy="' + f(p0[1]) + '" r="3.5" fill="var(--ink)"/>' + rot(aPol, r + 8, 'polo elevado', {});
    }
    var b = pt(aB, r);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" ' + MG + ' stroke-width="2.5"/>';
    s += '<circle cx="' + f(b[0]) + '" cy="' + f(b[1]) + '" r="7" fill="var(--magenta)"/>';
    var lb = pt(aB, r + 14), lbx = lb[0] - cx, lbAn = Math.abs(lbx) < 10 ? 'middle' : (lbx < 0 ? 'end' : 'start');
    s += txt(f(lb[0] + (lbAn === 'end' ? -3 : lbAn === 'start' ? 3 : 0) + (o.astroDx || 0)), f(lb[1] + (Math.abs(lb[1] - cy) < 6 ? 5 : (lb[1] < cy ? -2 : 13))), o.astro || 'Sol', { anchor: lbAn, bold: true, fill: 'var(--magenta)' });
    var arcos = o.arcos || [];
    if (arcos.indexOf('latpolo') >= 0) {
      var q0 = lat >= 0 ? aPol : 0, q1 = lat >= 0 ? 180 : aPol;
      s += seg(q0, q1, r * 0.93, 'var(--ink)', 2); s += rot((q0 + q1) / 2, r + 12, o.nomeLat || 'φ', {});
    }
    if (arcos.indexOf('lat') >= 0) { s += seg(Math.min(aEq, 90), Math.max(aEq, 90), r * 0.93, 'var(--ink)', 2); s += rot((aEq + 90) / 2, r + 12, o.nomeLat || 'φ', {}); }
    if (arcos.indexOf('dec') >= 0) { s += seg(Math.min(aEq, aB), Math.max(aEq, aB), r * 0.80, 'var(--ink)', 2); s += rot((aEq + aB) / 2, r * 0.66, o.nomeDec || 'δ', {}); }
    if (arcos.indexOf('z') >= 0) { s += seg(Math.min(90, aB), Math.max(90, aB), r * 0.52, 'var(--magenta)', 3); s += rot((90 + aB) / 2, r * 0.38, 'z', { fill: 'var(--magenta)', bold: true }); }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="var(--ink)"/>';
    return s;
  }

  var M = [];

/* Extratos simulados do Almanaque Náutico (gerados por cálculo; ver aviso no topo do arquivo). */
var ANB_PAGINA_0930 = TB(["HMG","AHG 29/09","Dec","AHG 30/09","Dec","AHG 01/10","Dec"], [["12h","002° 25,5′","S 2° 31,5′","002° 30,4′","S 2° 54,8′","002° 35,3′","S 3° 18,1′"],["13h","017° 25,7′","S 2° 32,5′","017° 30,6′","S 2° 55,8′","017° 35,5′","S 3° 19,0′"],["14h","032° 25,9′","S 2° 33,4′","032° 30,8′","S 2° 56,7′","032° 35,7′","S 3° 20,0′"],["15h","047° 26,1′","S 2° 34,4′","047° 31,0′","S 2° 57,7′","047° 35,9′","S 3° 21,0′"],["16h","062° 26,3′","S 2° 35,4′","062° 31,3′","S 2° 58,7′","062° 36,1′","S 3° 21,9′"],["⋮","⋮","⋮","⋮","⋮","⋮","⋮"],["d","","+1,0","","+1,0","","+1,0"],["SD","","16,0′","","16,0′","","16,0′"],["Eq. tempo 00h","","+09m32s","","+09m52s","","+10m11s"],["Eq. tempo 12h","","+09m42s","","+10m02s","","+10m21s"],["Pass. Mer.","","11h 50m","","11h 50m","","11h 50m"]], "EXEMPLO SIMULADO: coluna do Sol da página diária de 29, 30 de setembro e 1º de outubro de 2026 (só as horas de 12h a 16h; a página real traz as 24 horas). AHG em graus e minutos de arco, Dec com o nome N ou S, d em minutos de arco por hora, SD em minutos de arco. Não é uma página real do ANB.");
var ANB_MIN42 = TB(["Segundos","Sol: acréscimo ao AHG (42 min)","d","corr. d (42 min)"], [["00s","10° 30,0′","0,5","0,4"],["05s","10° 31,3′","0,8","0,6"],["10s","10° 32,5′","0,9","0,6"],["15s","10° 33,8′","1,0","0,7"],["20s","10° 35,0′","1,1","0,8"],["30s","10° 37,5′","1,5","1,1"],["40s","10° 40,0′","2,0","1,4"],["50s","10° 42,5′","",""],["59s","10° 44,8′","",""]], "EXEMPLO SIMULADO: parte da página amarela de acréscimos e correções do minuto 42. O acréscimo para 42 min 00 s é 10° 30,0′ (15′ por minuto); cada segundo soma 0,25′. A correção d é d × 42/60.");
var ANB_A2 = TB(["Altura aparente","Out–Mar limbo inferior","Out–Mar limbo superior","Abr–Set limbo inferior","Abr–Set limbo superior"], [["10° – 12°","+11,4","−20,9","+11,2","−20,7"],["12° – 14°","+12,1","−20,2","+11,9","−20,0"],["14° – 16°","+12,7","−19,6","+12,5","−19,4"],["16° – 18°","+13,1","−19,2","+12,9","−19,0"],["18° – 20°","+13,4","−18,9","+13,2","−18,7"],["20° – 22°","+13,7","−18,6","+13,5","−18,4"],["22° – 24°","+14,0","−18,3","+13,8","−18,1"],["24° – 26°","+14,2","−18,1","+14,0","−17,9"],["26° – 28°","+14,3","−18,0","+14,1","−17,8"],["28° – 30°","+14,5","−17,8","+14,3","−17,6"],["30° – 33°","+14,7","−17,6","+14,5","−17,4"],["33° – 36°","+14,8","−17,5","+14,6","−17,3"],["36° – 40°","+15,0","−17,3","+14,8","−17,1"],["40° – 45°","+15,2","−17,1","+15,0","−16,9"],["45° – 50°","+15,3","−17,0","+15,1","−16,8"],["50° – 55°","+15,5","−16,8","+15,3","−16,6"],["55° – 60°","+15,6","−16,7","+15,4","−16,5"],["60° – 63°","+15,7","−16,6","+15,5","−16,4"],["63° – 66°","+15,7","−16,6","+15,5","−16,4"],["66° – 69°","+15,8","−16,5","+15,6","−16,3"],["69° – 72°","+15,8","−16,5","+15,6","−16,3"],["72° – 75°","+15,9","−16,4","+15,7","−16,2"],["75° – 80°","+16,0","−16,3","+15,8","−16,1"],["80° – 85°","+16,0","−16,3","+15,8","−16,1"],["85° – 90°","+16,1","−16,2","+15,9","−16,0"]], "EXEMPLO SIMULADO da Tábua A2 (correção de altura do Sol, em minutos de arco, a somar à altura aparente). Os valores incluem refração, semidiâmetro e paralaxe, e foram calculados para o meio de cada faixa. A tábua real tem faixas e valores próprios: use a do seu Almanaque.");
var ANB_DIP = TB(["Elevação","Depressão","Elevação","Depressão","Elevação","Depressão"], [["1,0 m","−1,8′","1,5 m","−2,2′","2,0 m","−2,5′"],["2,4 m","−2,7′","2,8 m","−2,9′","3,0 m","−3,0′"],["3,2 m","−3,1′","3,6 m","−3,3′","4,0 m","−3,5′"],["4,5 m","−3,7′","5,0 m","−3,9′","6,0 m","−4,3′"],["7,0 m","−4,7′","8,0 m","−5,0′","9,0 m","−5,3′"],["10,0 m","−5,6′","12,0 m","−6,1′","14,0 m","−6,6′"],["16,0 m","−7,0′","18,0 m","−7,5′","20,0 m","−7,9′"]], "EXEMPLO SIMULADO da depressão aparente do horizonte, calculada por dp = 1,76′ × √(elevação em metros), arredondada a 0,1′. Sempre negativa.");
var ANB_ARCO = TB(["Graus","Tempo","Minutos de arco → segundos"], [["40°","2h 40m","0′ → 0 s"],["41°","2h 44m","1′ → 4 s"],["42°","2h 48m","2′ → 8 s"],["43°","2h 52m","3′ → 12 s"],["44°","2h 56m","4′ → 16 s"],["45°","3h 00m","5′ → 20 s"],["46°","3h 04m","6′ → 24 s"],["47°","3h 08m","7′ → 28 s"]], "EXEMPLO SIMULADO de um trecho da Tabela de Conversão de Arco em Tempo (1° = 4 min; 1′ = 4 s).");

/* Blocos encadeados gerados por cálculo (extratos simulados). */
var B1_QS = [q("m3b1-1", "Astronomia: passagem meridiana do Sol", 2, "Pelo Almanaque Náutico do dia 18 de março de 2026 e pela posição estimada na passagem meridiana, a hora legal (HLeg) prevista, aproximada ao minuto, para a culminação do Sol é:", ["07h 41m","10h 08m","12h 27m","12h 35m","16h 35m"], 3, "Na página do Almanaque, a passagem meridiana é 12h 08m (hora média local). A longitude estimada 036° 40,0′ vale 02h 26m 40s; HMG = HML + λ = 12h 08m + 02h 26m 40s = 14h 34m 40s. O fuso vem da longitude: 36° 40,0′ ÷ 15 dá fuso +2; Hleg = HMG − fuso = 12h 34m 40s, ou 12h 35m. A alternativa A subtrai a longitude da hora média local (aplica a fórmula de longitude Leste a uma longitude Oeste). A alternativa B esquece de converter a longitude em tempo e somá-la à hora média local. A alternativa C parte de 12h00 e esquece a equação do tempo: a passagem meridiana tem de sair do Almanaque. A alternativa E soma o fuso em vez de subtraí-lo ao passar da HMG para a hora legal.", "Miguens, vol. II, item 25.3 (1º método)", U.mig2, true),
  q("m3b1-2", "Astronomia: passagem meridiana do Sol", 2, "Para a HMG da observação, a declinação do Sol, obtida no Almanaque (extrato anexo), é:", ["S 0° 47,1′","S 0° 47,5′","N 0° 47,5′","S 0° 48,1′","S 0° 49,3′"], 1, "HMG da observação 14h 35m 17s: entra-se com a hora inteira 14h. Dec tabelada S 0° 48,1′; d = −1,0; correção para 35 min = d × 35/60 = −0,6′ (o valor da declinação diminui, então subtrai-se). Dec = S 0° 48,1′ − 0,6′ = S 0° 47,5′. A alternativa A usa a declinação da hora inteira seguinte, sem interpolar. A alternativa C acerta o valor, mas troca o nome da declinação (N por S ou S por N). A alternativa D esquece a correção d (usa o valor tabelado da hora inteira). A alternativa E soma a correção d duas vezes.", "Miguens, vol. II, item 23.4", U.mig2, true),
  q("m3b1-3", "Astronomia: passagem meridiana do Sol", 2, "Com a posição estimada e a declinação do Sol na HMG da observação, a distância zenital prevista do Sol na culminação é:", ["16° 56,9′","16° 57,5′","18° 32,5′","72° 15,0′","73° 02,5′"], 1, "Na passagem meridiana, z = |φ − δ| se latitude e declinação têm o mesmo nome, e z = φ + δ se têm nomes contrários. Aqui ambas são Sul: z = 16° 57,5′. A alternativa A usa a declinação tabelada, sem a correção d. A alternativa C soma latitude e declinação, como se tivessem nomes contrários. A alternativa D calcula a colatitude (90° − φ), que não é a distância zenital. A alternativa E dá a altura, não a distância zenital (z = 90° − a).", "Miguens, vol. II, item 25.4", U.mig2, true),
  q("m3b1-5", "Astronomia: passagem meridiana do Sol", 3, "Considerando a observação do limbo inferior do Sol, a altura verdadeira (a) calculada é:", ["73° 09,8′","73° 10,0′","73° 12,4′","73° 13,1′","73° 16,2′"], 1, "ai 72° 58,4′ − 1,2′ (ei) = ao 72° 57,2′; − 3,1′ (dp para 3,2 m) = a ap 72° 54,1′; + 15,9′ (c, Tábua A2, Out–Mar, limbo inferior) = a 73° 10,0′. A alternativa A entra na coluna errada da Tábua A2 (outro semestre do ano). A alternativa C aplica o erro instrumental com o sinal trocado. A alternativa D esquece a depressão do horizonte (elevação do olho). A alternativa E soma a depressão em vez de subtraí-la (ela é sempre negativa).", "Miguens, vol. II, itens 22.2 e 22.3.1", U.mig2, true),
  q("m3b1-6", "Astronomia: passagem meridiana do Sol", 3, "Com a altura verdadeira obtida, a latitude meridiana calculada é:", ["16° 02,5′ N","17° 37,5′ S","17° 37,5′ N","17° 45,0′ S","17° 53,4′ S"], 1, "z = 90° − a = 89° 60,0′ − 73° 10,0′ = 16° 50,0′. O Sol está ao Norte do observador (a declinação, S 0° 47,5′, está mais ao Norte do que a latitude estimada), então φ = δ − z (com δ negativa para o Sul e positiva para o Norte): φ = −0° 47,5′ − 16° 50,0′ = 17° 37,5′ S. A alternativa A aplica a regra do outro caso (o sinal de z muda quando o Sol está do outro lado do observador). A alternativa C acerta o valor, mas dá o nome (N ou S) errado à latitude. A alternativa D usa a distância zenital prevista, e não a da altura observada. A alternativa E usa a altura aparente (sem a correção da Tábua A2) no lugar da verdadeira.", "Miguens, vol. II, item 25.4", U.mig2, true),
  q("m3b1-7", "Astronomia: passagem meridiana do Sol", 3, "A longitude meridiana calculada, considerando que a HMG informada é a da passagem meridiana, é:", ["019° 10,3′ W","027° 59,6′ W","036° 40,0′ W","036° 48,9′ W","036° 48,9′ E"], 3, "Na passagem meridiana, AHL = 0, e a longitude Oeste é igual ao AHG. AHG = 027° 59,6′ (às 14h) + acréscimo de 35 min 17 s (35 × 15′ = 8° 45,0′ mais 17 × 0,25′ = 4,25′, ou 8° 49,3′) = 036° 48,9′. Como é menor que 180°, a longitude é Oeste: 036° 48,9′ W. A alternativa A subtrai o acréscimo em vez de somá-lo. A alternativa B usa o AHG da hora inteira, sem o acréscimo de minutos e segundos. A alternativa C repete a longitude estimada, sem usar o AHG do Almanaque. A alternativa E acerta o valor do AHG, mas dá o nome errado à longitude.", "Miguens, vol. II, itens 26.5 e 26.6", U.mig2, true)];
var B2_QS = [q("m3b2-1", "Astronomia: passagem meridiana do Sol", 2, "Pelo Almanaque Náutico do dia 24 de novembro de 2026 e pela posição estimada na passagem meridiana, a hora legal (HLeg) prevista, aproximada ao minuto, para a culminação do Sol é:", ["06h 13m","08h 47m","11h 21m","11h 34m","17h 21m"], 2, "Na página do Almanaque, a passagem meridiana é 11h 47m (hora média local). A longitude estimada 038° 30,0′ vale 02h 34m 00s; HMG = HML + λ = 11h 47m + 02h 34m 00s = 14h 21m 00s. O fuso vem da longitude: 38° 30,0′ ÷ 15 dá fuso +3; Hleg = HMG − fuso = 11h 21m 00s, ou 11h 21m. A alternativa A subtrai a longitude da hora média local (aplica a fórmula de longitude Leste a uma longitude Oeste). A alternativa B esquece de converter a longitude em tempo e somá-la à hora média local. A alternativa D parte de 12h00 e esquece a equação do tempo: a passagem meridiana tem de sair do Almanaque. A alternativa E soma o fuso em vez de subtraí-lo ao passar da HMG para a hora legal.", "Miguens, vol. II, item 25.3 (1º método)", U.mig2, true),
  q("m3b2-2", "Astronomia: passagem meridiana do Sol", 2, "Para a HMG da observação, a declinação do Sol, obtida no Almanaque (extrato anexo), é:", ["S 20° 36,8′","S 20° 37,0′","S 20° 37,2′","N 20° 37,2′","S 20° 37,5′"], 2, "HMG da observação 14h 19m 56s: entra-se com a hora inteira 14h. Dec tabelada S 20° 37,0′; d = +0,5; correção para 19 min = d × 19/60 = +0,2′ (o valor da declinação cresce). Dec = S 20° 37,2′. A alternativa A aplica a correção d com o sinal trocado. A alternativa B esquece a correção d (usa o valor tabelado da hora inteira). A alternativa D acerta o valor, mas troca o nome da declinação (N por S ou S por N). A alternativa E usa a declinação da hora inteira seguinte, sem interpolar.", "Miguens, vol. II, item 23.4", U.mig2, true),
  q("m3b2-4a", "Astronomia: passagem meridiana do Sol", 2, "Com a posição estimada, a altura verdadeira prevista para o Sol na culminação é:", ["35° 27,2′","54° 32,8′","55° 32,8′","84° 12,5′","84° 13,0′"], 1, "a = 90° − z = 89° 60,0′ − 35° 27,2′ = 54° 32,8′. A alternativa A responde com a distância zenital, em vez da altura. A alternativa C esquece o “empréstimo” de 60′ ao subtrair de 90° (erra 1° na resposta). A alternativa D usa a declinação da hora seguinte. A alternativa E usa a declinação tabelada, sem a correção d.", "Miguens, vol. II, item 25.4", U.mig2, true),
  q("m3b2-4b", "Astronomia: passagem meridiana do Sol", 3, "Para ajudar a localizar o Sol com o sextante, o navegante quis prever a altura instrumental (do limbo inferior) a ler na culminação, com a elevação do olho e o erro instrumental informados. O valor previsto é:", ["54° 12,0′","54° 17,3′","54° 19,0′","54° 22,6′","54° 29,3′"], 2, "Para prever a altura instrumental, desfaz-se a cadeia de correções: a = 54° 32,8′; a ap = a − c = 54° 32,8′ − 15,5′ = 54° 17,3′; ao = a ap − dp = 54° 17,3′ + 3,5′ (dp = −3,5′) = 54° 20,8′; ai = ao − ei = 54° 20,8′ − 1,8′ = 54° 19,0′. A alternativa A subtrai a depressão em vez de somá-la (esquece que o caminho é o inverso). A alternativa B aplica a correção A2 com o sinal certo mas esquece a depressão e o erro instrumental. A alternativa D aplica o erro instrumental com o sinal do cálculo direto (soma o ei em vez de subtraí-lo ao voltar da altura observada para a instrumental). A alternativa E só subtrai a depressão, e esquece a correção da Tábua A2.", "Miguens, vol. II, item 25.6", U.mig2, true),
  q("m3b2-5", "Astronomia: passagem meridiana do Sol", 3, "Considerando a observação do limbo inferior do Sol, a altura verdadeira (a) calculada é:", ["54° 35,2′","54° 38,6′","54° 38,8′","54° 42,3′","54° 45,8′"], 2, "ai 54° 25,0′ + 1,8′ (ei) = ao 54° 26,8′; − 3,5′ (dp para 4,0 m) = a ap 54° 23,3′; + 15,5′ (c, Tábua A2, Out–Mar, limbo inferior) = a 54° 38,8′. A alternativa A aplica o erro instrumental com o sinal trocado. A alternativa B entra na coluna errada da Tábua A2 (outro semestre do ano). A alternativa D esquece a depressão do horizonte (elevação do olho). A alternativa E soma a depressão em vez de subtraí-la (ela é sempre negativa).", "Miguens, vol. II, itens 22.2 e 22.3.1", U.mig2, true),
  q("m3b2-6", "Astronomia: passagem meridiana do Sol", 3, "Com a altura verdadeira obtida, a latitude meridiana calculada é:", ["14° 44,0′ N","14° 44,0′ S","14° 50,0′ N","14° 59,5′ N","55° 58,4′ S"], 0, "z = 90° − a = 89° 60,0′ − 54° 38,8′ = 35° 21,2′. O Sol está ao Sul do observador (a declinação, S 20° 37,2′, está mais ao Sul do que a latitude estimada), então φ = δ + z (com δ negativa para o Sul e positiva para o Norte): φ = −20° 37,2′ + 35° 21,2′ = 14° 44,0′ N. A alternativa B acerta o valor, mas dá o nome (N ou S) errado à latitude. A alternativa C usa a distância zenital prevista, e não a da altura observada. A alternativa D usa a altura aparente (sem a correção da Tábua A2) no lugar da verdadeira. A alternativa E aplica a regra do outro caso (o sinal de z muda quando o Sol está do outro lado do observador).", "Miguens, vol. II, item 25.4", U.mig2, true),
  q("m3b2-7", "Astronomia: passagem meridiana do Sol", 3, "A longitude meridiana calculada, considerando que a HMG informada é a da passagem meridiana, é:", ["028° 20,6′ W","033° 19,6′ W","038° 18,6′ W","038° 18,6′ E","038° 30,0′ W"], 2, "Na passagem meridiana, AHL = 0, e a longitude Oeste é igual ao AHG. AHG = 033° 19,6′ (às 14h) + acréscimo de 19 min 56 s (4° 59,0′) = 038° 18,6′. Como é menor que 180°, a longitude é Oeste: 038° 18,6′ W. A alternativa A subtrai o acréscimo em vez de somá-lo. A alternativa B usa o AHG da hora inteira, sem o acréscimo de minutos e segundos. A alternativa D acerta o valor do AHG, mas dá o nome errado à longitude. A alternativa E repete a longitude estimada, sem usar o AHG do Almanaque.", "Miguens, vol. II, itens 26.5 e 26.6", U.mig2, true)];
var B1_PAG = TB(["HMG","AHG","Dec"], [["14h","027° 59,6′","S 0° 48,1′"],["15h","042° 59,8′","S 0° 47,1′"],["d (do dia)","","−1,0"],["SD","","16,1′"],["Eq. tempo 12h","","−08m03s"],["Pass. Mer.","","12h 08m"]], "EXEMPLO SIMULADO: página do Almanaque para 18/03/2026 (coluna do Sol, só as horas necessárias). AHG em graus e minutos de arco; d em minutos de arco por hora; SD em minutos de arco.");
var B2_PAG = TB(["HMG","AHG","Dec"], [["14h","033° 19,6′","S 20° 37,0′"],["15h","048° 19,4′","S 20° 37,5′"],["d (do dia)","","+0,5"],["SD","","16,2′"],["Eq. tempo 12h","","+13m20s"],["Pass. Mer.","","11h 47m"]], "EXEMPLO SIMULADO: página do Almanaque para 24/11/2026 (coluna do Sol, só as horas necessárias). AHG em graus e minutos de arco; d em minutos de arco por hora; SD em minutos de arco.");
var B1_DADOS = TB(["Dado","Valor"], [["Posição estimada na culminação","17° 45,0′ S, 036° 40,0′ W"],["Elevação do olho","3,2 m"],["Erro instrumental do sextante (ei)","−1,2′"],["HMG da observação","14h 35m 17s do mesmo dia"],["Limbo observado","inferior"],["Altura instrumental (ai)","72° 58,4′"]]);
var B2_DADOS = TB(["Dado","Valor"], [["Posição estimada na culminação","14° 50,0′ N, 038° 30,0′ W"],["Elevação do olho","4,0 m"],["Erro instrumental do sextante (ei)","+1,8′"],["HMG da observação","14h 19m 56s do mesmo dia"],["Limbo observado","inferior"],["Altura instrumental (ai)","54° 25,0′"]]);

/* Figura do transporte da reta da manhã (coordenadas em milhas relativas ao PE da manhã). */
var FIG_M3L5 = svg("0 0 440 356", "Transporte da reta de altura da manhã até o meio-dia e cruzamento com a latitude meridiana", "<rect x=\"8\" y=\"8\" width=\"424\" height=\"236\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"12\" y1=\"150.5\" x2=\"428\" y2=\"150.5\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"7 4\"/><line x1=\"222.5\" y1=\"198.7\" x2=\"149.6\" y2=\"14.6\" stroke=\"var(--ink)\" stroke-width=\"2\"/><line x1=\"112.6\" y1=\"242.2\" x2=\"39.7\" y2=\"58.1\" stroke=\"var(--magenta)\" stroke-width=\"3\"/><line x1=\"228.0\" y1=\"90.0\" x2=\"116.9\" y2=\"130.4\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"2 4\"/><circle cx=\"228.0\" cy=\"90.0\" r=\"5\" fill=\"var(--ink)\"/><circle cx=\"116.9\" cy=\"130.4\" r=\"5\" fill=\"var(--sea-1)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><circle cx=\"76.3\" cy=\"150.5\" r=\"7\" fill=\"var(--magenta)\"/><line x1=\"228.0\" y1=\"90.0\" x2=\"289.4\" y2=\"65.7\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"295.4\" y=\"69.7\" fill=\"var(--ink)\" font-size=\"14\">Sol</text><line x1=\"14\" y1=\"268\" x2=\"40\" y2=\"268\" stroke=\"var(--ink)\" stroke-width=\"2\"/><text x=\"48\" y=\"273\" fill=\"var(--ink)\" font-size=\"14\">reta da manhã</text><line x1=\"230\" y1=\"268\" x2=\"256\" y2=\"268\" stroke=\"var(--magenta)\" stroke-width=\"3\"/><text x=\"264\" y=\"273\" fill=\"var(--ink)\" font-size=\"14\">reta transportada</text><line x1=\"14\" y1=\"290\" x2=\"40\" y2=\"290\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"7 4\"/><text x=\"48\" y=\"295\" fill=\"var(--ink)\" font-size=\"14\">latitude meridiana</text><line x1=\"230\" y1=\"290\" x2=\"256\" y2=\"290\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"2 4\"/><text x=\"264\" y=\"295\" fill=\"var(--ink)\" font-size=\"14\">percurso do navio</text><circle cx=\"27\" cy=\"312\" r=\"6\" fill=\"var(--magenta)\"/><text x=\"48\" y=\"317\" fill=\"var(--ink)\" font-size=\"14\">posição ao meio-dia</text><circle cx=\"243\" cy=\"312\" r=\"5\" fill=\"var(--ink)\"/><text x=\"264\" y=\"317\" fill=\"var(--ink)\" font-size=\"14\">PE da manhã</text><circle cx=\"27\" cy=\"334\" r=\"5\" fill=\"var(--sea-1)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><text x=\"48\" y=\"339\" fill=\"var(--ink)\" font-size=\"14\">PE transportado</text><line x1=\"230\" y1=\"334\" x2=\"256\" y2=\"334\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"264\" y=\"339\" fill=\"var(--ink)\" font-size=\"14\">direção do Sol (Az 068°)</text>");

/* Figura Mercator: ortodrômica, loxodrômica e mista (Boa Esperança - Tasmânia). */
var FIG_M4L5 = svg("0 0 440 362", "Carta de Mercator com a ortodrômica curva para o polo, a loxodrômica reta e a derrota mista limitada em 45° S entre o Cabo da Boa Esperança e a Tasmânia", "<rect x=\"46\" y=\"14\" width=\"384\" height=\"240\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"46\" y1=\"65.3\" x2=\"430\" y2=\"65.3\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"42\" y=\"70.3\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"end\">40° S</text><line x1=\"46\" y1=\"124.8\" x2=\"430\" y2=\"124.8\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"42\" y=\"129.8\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"end\">50° S</text><line x1=\"46\" y1=\"198.4\" x2=\"430\" y2=\"198.4\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"42\" y=\"203.4\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"end\">60° S</text><line x1=\"100.9\" y1=\"14\" x2=\"100.9\" y2=\"254\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"100.9\" y=\"272\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"middle\">30° E</text><line x1=\"183.1\" y1=\"14\" x2=\"183.1\" y2=\"254\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"183.1\" y=\"272\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"middle\">60° E</text><line x1=\"265.4\" y1=\"14\" x2=\"265.4\" y2=\"254\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"265.4\" y=\"272\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"middle\">90° E</text><line x1=\"347.7\" y1=\"14\" x2=\"347.7\" y2=\"254\" stroke=\"var(--sea-3)\" stroke-width=\"1\"/><text x=\"347.7\" y=\"272\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"middle\">120° E</text><line x1=\"46\" y1=\"93.8\" x2=\"430\" y2=\"93.8\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><line x1=\"68.9\" y1=\"38.9\" x2=\"421.3\" y2=\"86.4\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><polyline points=\"68.9,38.9 72.3,46.4 75.8,53.9 79.5,61.6 83.3,69.3 87.3,77.0 91.5,84.9 95.8,92.8 100.4,100.7 105.2,108.7 110.2,116.6 115.5,124.6 121.1,132.6 127.0,140.6 133.2,148.4 139.7,156.2 146.5,163.8 153.8,171.2 161.4,178.3 169.3,185.1 177.7,191.5 186.4,197.4 195.5,202.8 205.0,207.6 214.7,211.6 224.7,214.8 235.0,217.2 245.3,218.7 255.8,219.3 266.2,218.9 276.6,217.6 286.9,215.4 296.9,212.3 306.8,208.4 316.3,203.8 325.4,198.6 334.2,192.7 342.7,186.4 350.7,179.7 358.4,172.6 365.7,165.3 372.6,157.7 379.2,150.0 385.5,142.1 391.4,134.2 397.0,126.2 402.4,118.2 407.5,110.2 412.3,102.3 416.9,94.3 421.3,86.4\" fill=\"none\" stroke=\"var(--magenta)\" stroke-width=\"3\"/><polyline points=\"68.9,38.9 74.1,43.4 79.4,47.9 84.9,52.2 90.5,56.4 96.2,60.5 102.0,64.4 108.0,68.1 114.0,71.6 120.2,75.0 126.5,78.1 132.9,80.9 139.4,83.5 146.0,85.9 152.6,87.9 159.4,89.7 166.2,91.1 173.0,92.3 179.9,93.1 186.9,93.6 193.8,93.8 193.8,93.8 375.2,93.8 375.2,93.8 377.6,93.7 379.9,93.7 382.2,93.6 384.6,93.5 386.9,93.3 389.2,93.1 391.6,92.8 393.9,92.6 396.2,92.2 398.5,91.9 400.8,91.5 403.1,91.1 405.4,90.6 407.7,90.1 410.0,89.6 412.3,89.0 414.6,88.4 416.8,87.8 419.1,87.1 421.3,86.4\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2.5\" stroke-dasharray=\"2 4\"/><circle cx=\"68.9\" cy=\"38.9\" r=\"5\" fill=\"var(--ink)\"/><circle cx=\"421.3\" cy=\"86.4\" r=\"5\" fill=\"var(--ink)\"/><text x=\"76.9\" y=\"30.9\" fill=\"var(--ink)\" font-size=\"14\">Boa Esperança</text><text x=\"413.3\" y=\"76.4\" fill=\"var(--ink)\" font-size=\"14\" text-anchor=\"end\">Tasmânia</text><line x1=\"40\" y1=\"296\" x2=\"70\" y2=\"296\" stroke=\"var(--magenta)\" stroke-width=\"3\"/><text x=\"80\" y=\"301\" fill=\"var(--ink)\" font-size=\"14\">ortodrômica</text><line x1=\"40\" y1=\"318\" x2=\"70\" y2=\"318\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><text x=\"80\" y=\"323\" fill=\"var(--ink)\" font-size=\"14\">loxodrômica (reta)</text><line x1=\"40\" y1=\"340\" x2=\"70\" y2=\"340\" stroke=\"var(--ink)\" stroke-width=\"2.5\" stroke-dasharray=\"2 4\"/><text x=\"80\" y=\"345\" fill=\"var(--ink)\" font-size=\"14\">mista, limite 45° S</text>");

  /* ==================================================================================================
     m1 — Tempo e fusos horários (Anexo 5-A, 1.2 a, I)
     ================================================================================================== */

  /* l1: linha do tempo do meio-dia verdadeiro */
  var FIG_M1L1 = svg('0 0 440 160', 'Linha do tempo: o Sol verdadeiro cruza o meridiano entre 11h 44m e 12h 14m de hora média local ao longo do ano',
    '<line x1="30" y1="80" x2="410" y2="80" ' + INK + ' stroke-width="2"/>' +
    '<line x1="220" y1="62" x2="220" y2="98" ' + MG + ' stroke-width="3"/>' +
    txt(220, 50, '12h 00m', { anchor: 'middle', bold: true, fill: 'var(--magenta)' }) +
    // marcadores: x = 30 + (min desde 11h40) * 9.5
    '<circle cx="63.7" cy="80" r="6" fill="var(--magenta)"/>' + txt(63.7, 116, '3 nov', { anchor: 'middle' }) + txt(63.7, 136, '11h 44m', { anchor: 'middle' }) +
    '<circle cx="185.5" cy="80" r="6" fill="var(--magenta)"/>' + txt(185.5, 116, '14 mai', { anchor: 'middle' }) + txt(185.5, 136, '11h 56m', { anchor: 'middle' }) +
    '<circle cx="282.4" cy="80" r="6" fill="var(--magenta)"/>' + txt(282.4, 116, '26 jul', { anchor: 'middle' }) + txt(282.4, 136, '12h 07m', { anchor: 'middle' }) +
    '<circle cx="354.9" cy="80" r="6" fill="var(--magenta)"/>' + txt(354.9, 116, '11 fev', { anchor: 'middle' }) + txt(354.9, 136, '12h 14m', { anchor: 'middle' }) +
    txt(30, 30, 'antes das 12h', { size: 15 }) + txt(410, 30, 'depois das 12h', { anchor: 'end', size: 15 }));

  M.push({
    id: 'm1', titulo: 'Tempo e fusos horários',
    resumo: 'Hora e longitude são a mesma medida. Sol verdadeiro e Sol médio, equação do tempo, hora média local (HML), hora média de Greenwich (HMG), hora legal, fusos, horário de verão e linha de data, com muitas conversões resolvidas.',
    licoes: [
      {
        id: 'l1', titulo: 'Sol verdadeiro, Sol médio e a hora a bordo', minutos: 10,
        objetivos: [
          'Explicar por que 15° de longitude valem 1 hora e por que 4 segundos de erro valem 1′ de longitude.',
          'Diferenciar Sol verdadeiro de Sol médio e hora verdadeira local (HVL) de hora média local (HML).',
          'Saber o que é a hora média de Greenwich (HMG) e por que ela é o relógio do navegante.',
        ],
        blocos: [
          P('Na navegação astronômica, <b>hora</b> e <b>longitude</b> são a mesma coisa vista de dois lados. A Terra gira 360° em 24 horas. Logo, o Sol “anda” 15° de longitude por hora, ou 1° a cada 4 minutos. Quem sabe a hora exata em Greenwich e mede onde o Sol está no céu sabe em que longitude está.'),
          FATO('normas-85', 'No programa do Capitão-Amador, a Navegação Astronômica começa por <b>medida de tempo e fusos</b>, passa pelo uso do Almanaque Náutico e termina no cálculo da hora legal da passagem meridiana do Sol e na posição pela meridiana.'),
          H('O Sol verdadeiro é um relógio ruim'),
          P('O <b>Sol verdadeiro</b> é o Sol que você vê. O <b>dia verdadeiro</b> é o intervalo entre duas passagens consecutivas do centro dele pelo meridiano do lugar. Quando o centro do Sol cruza o <b>meridiano superior</b>, são <b>12 horas verdadeiras</b> no local: é o meio-dia verdadeiro. A hora assim contada chama-se <b>hora verdadeira local (HVL)</b>.'),
          P('O problema é que esse dia não tem sempre a mesma duração. Há duas causas: a órbita da Terra é uma elipse (a Terra anda mais depressa perto do periélio, em janeiro, e mais devagar no afélio, em julho), e o Sol percorre a eclíptica, que é inclinada em relação ao equador, enquanto a hora é medida sobre o equador. O resultado é um relógio que adianta e atrasa ao longo do ano. Nenhum relógio mecânico acompanharia isso.'),
          H('O Sol médio é a solução'),
          P('Para ter dias iguais, inventou-se o <b>Sol médio</b>: um astro imaginário que percorre o equador celeste em movimento uniforme, com a velocidade média do Sol verdadeiro. Ele dá uma volta a cada 24 horas exatas. A hora contada por ele é a <b>hora média local (HML)</b>: são 12h médias quando o Sol médio cruza o meridiano superior do lugar.'),
          TB(['', 'Sol verdadeiro', 'Sol médio'], [
            ['Existe?', 'Sim, é o que se observa', 'Não, é uma referência imaginária'],
            ['Duração do dia', 'Varia ao longo do ano', 'Exatamente 24 h'],
            ['Hora do lugar', 'Hora verdadeira local (HVL)', 'Hora média local (HML)'],
            ['Em Greenwich', 'HVG', 'HMG'],
            ['Usado em', 'Observação do Sol no céu', 'Relógios, almanaque, hora legal'],
          ]),
          FIG(FIG_M1L1, 'Em que hora média local o Sol verdadeiro cruza o meridiano. Em novembro ele chega cerca de 16 minutos antes do meio-dia do relógio; em fevereiro, cerca de 14 minutos depois. Valores aproximados, calculados para 2026.'),
          H('HMG: o relógio do navegante'),
          P('Quando o meridiano de referência é o de <b>Greenwich</b>, a hora média chama-se <b>hora média de Greenwich (HMG)</b>. Para a navegação, ela equivale ao Tempo Universal (TU) e, na prática, à hora UTC que os receptores GNSS mostram. As posições dos astros no Almanaque Náutico são tabeladas em função da HMG.'),
          C('dica', 'Por que o relógio precisa ser bom', 'Como 15° valem 1 hora, 1′ de arco vale 4 segundos de tempo. Um erro de <b>4 segundos</b> na hora da observação desloca a reta de posição em <b>1′</b>, isto é, cerca de 1 milha no Equador. Por isso o navegante confere o relógio de observação com o sinal horário (ou com o receptor GNSS) antes de cada série de alturas.'),
          TERM(['hora-media-de-greenwich', 'hora-legal', 'fuso-horario', 'equacao-do-tempo', 'cronometro']),
          CHK([
            q('m1l1-1', 'Astronomia: tempo e fusos', 1, 'Quantos graus de longitude correspondem a 1 hora de tempo?',
              ['1°.', '4°.', '15°.', '24°.'], 2,
              'A Terra gira 360° em 24 horas, então 360° ÷ 24 = 15° por hora. Os 4 que aparecem na alternativa B são os minutos de tempo que valem 1° (1° = 4 min), o inverso da relação. 24 é o número de horas do dia, não de graus.',
              'Miguens, vol. II, item 19.4.1', U.mig2),
            q('m1l1-2', 'Astronomia: tempo e fusos', 2, 'Um erro de 4 segundos na hora de uma observação astronômica desloca a reta de posição em aproximadamente quanto?',
              ['0,25′.', '1′.', '4′.', '15′.'], 1,
              '1 segundo de tempo vale 0,25′ de arco (15′ de arco = 1 minuto de tempo = 60 segundos). Logo 4 s valem 4 × 0,25′ = 1′. A alternativa A é o valor para 1 segundo; a C confunde segundos com minutos de arco; a D é o arco de 1 minuto de tempo.',
              'Miguens, vol. II, item 19.4.1', U.mig2),
            q('m1l1-3', 'Astronomia: tempo e fusos', 1, 'Por que a hora legal não é baseada no Sol verdadeiro?',
              ['Porque o Sol verdadeiro só é visível de dia.', 'Porque o dia verdadeiro não tem duração constante ao longo do ano.', 'Porque o Sol verdadeiro gira ao redor da Terra mais depressa no inverno.', 'Porque o Sol verdadeiro não cruza o meridiano de Greenwich.'], 1,
              'A órbita elíptica e a inclinação da eclíptica fazem a duração do dia verdadeiro variar; por isso se usa o Sol médio, de movimento uniforme. A visibilidade (A) não é a razão; o Sol não gira ao redor da Terra mais depressa no inverno (C), é a Terra que varia de velocidade orbital; e o Sol verdadeiro cruza todos os meridianos (D).',
              'Miguens, vol. II, itens 19.3.1 e 19.3.2', U.mig2),
          ]),
          FT([mig2('cap. 19, itens 19.2 a 19.3.2 e 19.4.1'), mig2('item 19.11.1 (escalas de tempo: TU e HMG)')]),
        ],
      },
      {
        id: 'l2', titulo: 'Equação do tempo e hora verdadeira local', minutos: 10,
        objetivos: [
          'Definir a equação do tempo e seu sinal.',
          'Calcular a HML da passagem do Sol pelo meridiano a partir da ET.',
          'Reconhecer, na curva anual, quando o Sol chega mais cedo e mais tarde.',
        ],
        blocos: [
          P('A diferença entre a hora verdadeira e a hora média, no mesmo instante e lugar, é a <b>equação do tempo (ET)</b>:'),
          P('<b>ET = hora verdadeira − hora média</b>'),
          P('Se a ET é <b>positiva</b>, o Sol verdadeiro está <i>adiantado</i> em relação ao Sol médio: ele cruza o meridiano antes de 12h do relógio médio. Se a ET é <b>negativa</b>, o Sol está atrasado e cruza depois das 12h. No instante da passagem meridiana, a hora verdadeira local é 12h00m00s, então:'),
          P('<b>HML da passagem = 12h − ET</b>'),
          FIG(svg('-14 0 454 250', 'Equação do tempo ao longo do ano: máximo de +16 minutos em novembro e mínimo de −14 minutos em fevereiro',
            '<line x1="40" y1="110" x2="420" y2="110" ' + INK + ' stroke-width="1.5"/>' +
            '<line x1="40" y1="20" x2="40" y2="200" ' + INK + ' stroke-width="1.5"/>' +
            '<path d="M40.0 128.6 L45.2 140.4 L50.4 151.2 L55.6 160.7 L60.8 168.7 L66.0 175.1 L71.2 179.8 L76.4 182.7 L81.6 183.8 L86.8 183.3 L92.1 181.2 L97.3 177.7 L102.5 173.0 L107.7 167.2 L112.9 160.6 L118.1 153.4 L123.3 145.7 L128.5 137.9 L133.7 130.1 L138.9 122.6 L144.1 115.5 L149.3 109.0 L154.5 103.3 L159.7 98.6 L164.9 95.0 L170.1 92.5 L175.3 91.2 L180.5 91.2 L185.8 92.4 L191.0 94.8 L196.2 98.1 L201.4 102.4 L206.6 107.3 L211.8 112.7 L217.0 118.4 L222.2 124.0 L227.4 129.3 L232.6 134.1 L237.8 138.2 L243.0 141.3 L248.2 143.3 L253.4 144.1 L258.6 143.6 L263.8 141.8 L269.0 138.7 L274.2 134.4 L279.5 128.9 L284.7 122.3 L289.9 114.9 L295.1 106.6 L300.3 97.9 L305.5 88.7 L310.7 79.5 L315.9 70.2 L321.1 61.3 L326.3 52.9 L331.5 45.2 L336.7 38.4 L341.9 32.8 L347.1 28.5 L352.3 25.7 L357.5 24.5 L362.7 25.1 L367.9 27.5 L373.2 31.7 L378.4 37.8 L383.6 45.5 L388.8 54.9 L394.0 65.5 L399.2 77.2 L404.4 89.7 L409.6 102.5 L414.8 115.4 L419.0 125.5" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
            txt(34, 28, '+16′', { anchor: 'end', size: 15 }) + txt(34, 114, '0', { anchor: 'end', size: 15 }) + txt(34, 188, '−14′', { anchor: 'end', size: 15 }) +
            txt(40, 222, 'jan', { anchor: 'middle', size: 15 }) + txt(104, 222, 'mar', { anchor: 'middle', size: 15 }) + txt(168, 222, 'mai', { anchor: 'middle', size: 15 }) +
            txt(231, 222, 'jul', { anchor: 'middle', size: 15 }) + txt(294, 222, 'set', { anchor: 'middle', size: 15 }) + txt(357, 222, 'nov', { anchor: 'middle', size: 15 }) +
            '<circle cx="357.5" cy="24.5" r="5" fill="var(--magenta)"/>' + txt(350, 18, '3 nov: +16′ 27″', { anchor: 'end', size: 15 }) +
            '<circle cx="81.6" cy="183.8" r="5" fill="var(--magenta)"/>' + txt(92, 205, '11 fev: −14′ 12″', { size: 15 }) +
            '<circle cx="180.5" cy="91.2" r="5" fill="var(--magenta)"/>' +
            '<circle cx="253.4" cy="144.1" r="5" fill="var(--magenta)"/>'),
            'Equação do tempo ao meio-dia de Greenwich, ao longo de 2026 (valores aproximados, minutos de tempo). Ela se anula por volta de 15 de abril, 13 de junho, 1º de setembro e 25 de dezembro. O máximo local de maio (+3,6′) e o mínimo local de julho (−6,5′) completam a curva.'),
          P('A curva tem dois máximos e dois mínimos por ano porque soma dois efeitos: a órbita elíptica da Terra (um ciclo por ano) e a inclinação da eclíptica (dois ciclos por ano). Entre o máximo de novembro e o mínimo de fevereiro, o meio-dia verdadeiro varia de 11h 43m 33s a 12h 14m 12s, quase meia hora (30m 39s) de diferença na hora do relógio.'),
          H('Onde achar a ET no Almanaque Náutico'),
          P('O Almanaque Náutico traz a ET de cada dia em Greenwich, para <b>00h e 12h de HMG</b>, na parte de baixo da página do Sol e da Lua. A própria página traz também a <b>passagem meridiana (Pass. Mer.)</b>, que é a hora média local em que o Sol cruza o meridiano, já calculada como 12h − ET. Como a ET varia pouco ao longo de um dia, o valor de Greenwich vale, na prática, para qualquer lugar da Terra. Isso será a base do cálculo da hora legal da passagem meridiana, no módulo 3.'),
          C('nota', 'Confira a convenção na sua edição', 'A posição exata dessas linhas na página, e a forma de indicar o sinal da ET, podem mudar de edição para edição. Use sempre a legenda da própria página. Uma conferência rápida nunca falha: em <b>novembro</b> o Sol chega ao meridiano antes das 12h (ET positiva); em <b>fevereiro</b>, depois (ET negativa).'),
          H('Exemplos resolvidos'),
          TB(['Dia (2026)', 'ET ao meio-dia de Greenwich', 'HML da passagem = 12h − ET'], [
            ['3 de novembro', '+16 min 27 s', '12h 00m 00s − 16m 27s = <b>11h 43m 33s</b> (≈ 11h 44m)'],
            ['11 de fevereiro', '−14 min 12 s', '12h 00m 00s + 14m 12s = <b>12h 14m 12s</b> (≈ 12h 14m)'],
            ['29 de junho', '−3 min 31 s', '12h 00m 00s + 3m 31s = <b>12h 03m 31s</b> (≈ 12h 04m)'],
            ['30 de setembro', '+10 min 02 s', '12h 00m 00s − 10m 02s = <b>11h 49m 58s</b> (≈ 11h 50m)'],
          ], 'Valores calculados por fórmula de baixa precisão para este curso (precisão de cerca de 5 segundos). No Almanaque a passagem vem arredondada ao minuto.'),
          C('seguranca', 'Erro clássico', 'Trocar o sinal da ET: somar quando devia subtrair. O teste de bom senso resolve: em novembro a HML da passagem tem de ser <b>menor</b> que 12h; em fevereiro, <b>maior</b>. Se o resultado contradiz a estação, o sinal está trocado.'),
          CHK([
            q('m1l2-1', 'Astronomia: tempo e fusos', 1, 'A equação do tempo (ET) é definida como:',
              ['hora média − hora verdadeira.', 'hora verdadeira − hora média.', 'hora legal − hora média de Greenwich.', 'hora sideral − hora média.'], 1,
              'ET = hora verdadeira − hora média, no mesmo instante e lugar; é assim que o Almanaque Náutico a tabela (HVG − HMG). A alternativa A é a definição com sinal trocado e produziria o erro clássico no cálculo da passagem meridiana. As C e D são outras diferenças de tempo, sem relação com a ET.',
              'Miguens, vol. II, item 19.8', U.mig2),
            q('m1l2-2', 'Astronomia: tempo e fusos', 2, 'Em uma data em que a ET vale +14 min 20 s, a que hora média local o Sol cruza o meridiano superior?',
              ['11h 45m 40s.', '12h 14m 20s.', '11h 14m 20s.', '12h 45m 40s.'], 0,
              'HML = 12h − ET = 12h 00m 00s − 14m 20s = 11h 45m 40s. ET positiva significa Sol adiantado: ele chega antes das 12h. A alternativa B soma a ET (sinal trocado). C e D erram a conta dos minutos (subtraem 45 min ou somam 45 min).',
              'Miguens, vol. II, itens 19.8 e 25.3', U.mig2),
            q('m1l2-3', 'Astronomia: tempo e fusos', 2, 'Observando a curva anual da ET, em qual período o meio-dia verdadeiro ocorre mais cedo (antes das 12h do relógio médio)?',
              ['De janeiro a meados de abril.', 'Por volta de fevereiro.', 'Por volta de novembro.', 'Em julho.'], 2,
              'A ET é máxima e positiva (cerca de +16 min) no início de novembro: o Sol chega ao meridiano por volta de 11h 44m. Em fevereiro a ET é mínima e negativa (cerca de −14 min), então o Sol chega depois das 12h. Em julho a ET é negativa (cerca de −6 min).',
              'Miguens, vol. II, item 19.8; curva calculada para 2026', U.mig2),
          ]),
          FT([mig2('cap. 19, item 19.8 (equação do tempo)'), mig2('cap. 25, item 25.3, 2º método')]),
        ],
      },
      {
        id: 'l3', titulo: 'Arco em tempo, longitude e hora média de Greenwich', minutos: 12,
        objetivos: [
          'Converter longitude (arco) em tempo e tempo em arco.',
          'Aplicar HMG = HML + λ (W) e HMG = HML − λ (E), cuidando da data.',
          'Calcular a diferença de hora entre dois lugares pela diferença de longitude.',
        ],
        blocos: [
          P('A relação 360° = 24 h gera uma tabela que o navegante usa o tempo todo:'),
          TB(['Arco', 'Tempo'], [
            ['360°', '24 h'], ['15°', '1 h'], ['1°', '4 min'], ['15′', '1 min'], ['1′', '4 s'], ['0,25′ (15″)', '1 s'],
          ], 'Os mesmos números servem nos dois sentidos. O Almanaque Náutico traz, nas páginas amarelas, a Tabela de Conversão de Arco em Tempo; na prova ela vem em anexo.'),
          H('Convertendo longitude em tempo'),
          P('Há dois caminhos: dividir por 15 ou multiplicar por 4. O segundo costuma ser mais fácil de fazer de cabeça: graus × 4 dão <i>minutos</i>; minutos de arco × 4 dão <i>segundos</i>.'),
          L([
            '<b>043° 10,0′ W</b>: 43 × 4 = 172 min = 2h 52m; 10′ × 4 = 40 s. Resultado: <b>2h 52m 40s</b>.',
            '<b>025° 47,5′ W</b>: 25 × 4 = 100 min = 1h 40m; 47,5′ × 4 = 190 s = 3m 10s. Resultado: <b>1h 43m 10s</b>.',
            '<b>028° 34,5′ W</b>: 28 × 4 = 112 min = 1h 52m; 34,5′ × 4 = 138 s = 2m 18s. Resultado: <b>1h 54m 18s</b>.',
            'No sentido inverso, <b>8h 12m 20s</b>: 8 h = 120°; 12 min = 3°; 20 s = 5′. Resultado: <b>123° 05′</b>.',
          ]),
          C('dica', 'Arredonde ao fim', 'Converta com segundos e arredonde o resultado final ao minuto, como na prova. Arredondar longitude antes de converter acumula erro.'),
          H('Hora média local e hora média de Greenwich'),
          P('O Sol médio gira para Oeste. Por isso, quanto mais a Oeste você está, mais “cedo” é a hora local. Se a sua longitude é 43° W, a sua hora média local está 2h 52m <i>atrás</i> da de Greenwich. A fórmula geral é:'),
          P('<b>HMG = HML + λ (W)</b> &nbsp; e &nbsp; <b>HMG = HML − λ (E)</b>'),
          P('Com a longitude convertida em tempo. Ou, numa só fórmula, <b>HMG − HML = λ</b>, com λ positiva para Oeste e negativa para Leste.'),
          FIG(svg('0 0 440 372', 'Diagrama de tempo: Greenwich no alto, meridiano local a oeste, Sol médio; AHG, AHL e a longitude',
            diagTempo({ cx: 220, cy: 160, r: 118, lonW: 40, ahg: 115, astro: 'Sol médio' }) +
            txt(220, 310, 'Visto do polo sul celeste: a esfera gira', { anchor: 'middle', size: 14 }) +
            txt(220, 328, 'para o Oeste, no sentido anti-horário.', { anchor: 'middle', size: 14 }) +
            txt(220, 346, 'HMG = AHG + 12 h · HML = AHL + 12 h', { anchor: 'middle', size: 14 }) +
            txt(220, 364, 'HMG − HML = AHG − AHL = λ', { anchor: 'middle', size: 14 })),
            'Diagrama de tempo. Os ângulos são contados para Oeste a partir do meridiano superior. O Sol médio está a 115° do meridiano de Greenwich (AHG) e a 75° do meridiano local (AHL); a longitude do lugar é 40° W. Como AHG − AHL = λ, vale HMG − HML = λ.'),
          H('Exemplos'),
          L([
            '<b>1.</b> No meridiano 038° 15,0′ W, a HML é 11h 50m. Longitude em tempo: 38 × 4 = 152 min = 2h 32m; 15′ × 4 = 60 s = 1m. λ = 2h 33m. HMG = 11h 50m + 2h 33m = <b>14h 23m</b>.',
            '<b>2.</b> Em 032° 25,0′ E, a HML é 09h 10m. λ = 2h 09m 40s (E). HMG = 09h 10m − 2h 09m 40s = <b>07h 00m 20s</b>.',
            '<b>3.</b> Cuidado com a data. No dia 10, em 040° 00,0′ W, a HML é 22h 40m. λ = 2h 40m. HMG = 22h 40m + 2h 40m = 25h 20m = <b>01h 20m do dia 11</b>.',
            '<b>4.</b> Diferença de hora entre dois lugares: Recife (cerca de 035° W) e Lisboa (cerca de 009° W) têm diferença de longitude de 26°, ou 1h 44m. Lisboa, a leste, tem hora <i>mais adiantada</i>: quando em Recife é 10h 00m (hora média local), em Lisboa é 11h 44m (hora média local).',
          ]),
          C('seguranca', 'Regra do “quem está a leste”', 'A hora é sempre mais adiantada <b>a Leste</b> e mais atrasada <b>a Oeste</b>. Se o seu resultado de HMG ficou <i>menor</i> que a sua HML em uma longitude Oeste, você subtraiu em vez de somar.'),
          CHK([
            q('m1l3-1', 'Astronomia: tempo e fusos', 1, 'A longitude 043° 10,0′ W, expressa em unidades de tempo, vale:',
              ['2h 52m 40s.', '2h 52m 10s.', '2h 53m 40s.', '2h 43m 10s.'], 0,
              '43° × 4 min = 172 min = 2h 52m; 10′ × 4 s = 40 s; total 2h 52m 40s. A alternativa B toma 10′ como 10 s (esquece que 1′ = 4 s); a C erra a conta dos graus; a D troca “43” por 43 minutos.',
              'Miguens, vol. II, item 19.4.1', U.mig2),
            q('m1l3-2', 'Astronomia: tempo e fusos', 2, 'Em 050° 00,0′ W a hora média local é 09h 30m. A hora média de Greenwich é:',
              ['06h 10m.', '12h 30m.', '12h 50m.', '15h 50m.'], 2,
              '50° = 3h 20m. Para longitude Oeste, HMG = HML + λ = 09h 30m + 3h 20m = 12h 50m. A alternativa A subtrai a longitude (fórmula de Leste); a B usa λ = 3h 00m (erra a conversão: 50° não são 45°); a D soma o dobro da longitude.',
              'Miguens, vol. II, item 19.4.2', U.mig2),
            q('m1l3-3', 'Astronomia: tempo e fusos', 2, 'No dia 10, em 040° W, a hora média local é 22h 40m. Qual a HMG e a data?',
              ['20h 00m do dia 10.', '25h 20m do dia 10.', '01h 20m do dia 11.', '19h 20m do dia 10.'], 2,
              'λ = 40° = 2h 40m. HMG = 22h 40m + 2h 40m = 25h 20m, que excede 24 h: subtrai-se 24 h e adianta-se 1 dia, resultando 01h 20m do dia 11. A alternativa A subtrai a longitude; a B esquece de passar para o dia seguinte; a D subtrai e erra a conta.',
              'Miguens, vol. II, item 19.4.2', U.mig2),
          ]),
          FT([mig2('cap. 19, itens 19.4.1 a 19.4.3')]),
        ],
      },
      {
        id: 'l4', titulo: 'Fusos horários e hora legal', minutos: 12,
        objetivos: [
          'Determinar o fuso de uma posição e o seu sinal pela convenção brasileira.',
          'Usar Hleg = HMG − fuso e HMG = Hleg + fuso.',
          'Conhecer os fusos legais do Brasil e a diferença entre fuso teórico e hora legal.',
        ],
        blocos: [
          P('Se cada lugar usasse a sua própria hora média local, cada cidade teria um relógio diferente e uma viagem de ônibus mudaria a hora a cada quilômetro. A solução foi dividir a Terra em <b>24 fusos horários</b> de 15° de largura. Dentro de um fuso, todos usam a mesma hora, a <b>hora legal (Hleg)</b>: a hora média do meridiano central do fuso. A hora só muda, de 1 em 1 hora, quando se passa de um fuso para outro.'),
          H('Como achar o fuso de uma posição'),
          L([
            'Os meridianos centrais dos fusos são os múltiplos de 15° (0°, 15°, 30°, 45°…). Cada fuso vai 7,5° para cada lado do central.',
            '<b>Divida a longitude por 15.</b> Se o resto for <b>menor que 7,5°</b>, o fuso é o quociente. Se o resto for <b>maior que 7,5°</b>, o fuso é o quociente + 1.',
            '<b>O sinal do fuso</b> (convenção da DHN): positivo a <b>Oeste</b> de Greenwich, negativo a <b>Leste</b>. Cada fuso tem também uma letra: N (+1) a Y (+12) a Oeste; A (−1) a M (−12) a Leste (a letra J não é usada); Z (zero) é Greenwich.',
          ], true),
          P('O <b>número do fuso é o que se soma à hora legal para obter a HMG</b>: <b>HMG = Hleg + fuso</b>, e portanto <b>Hleg = HMG − fuso</b>, sempre com o sinal do fuso. Exemplo clássico: Brasília, longitude 047° 50′ W. 47° 50′ ÷ 15 dá quociente 3 e resto 2° 50′, menor que 7,5°. O fuso é <b>+3 (P, “Papa”)</b>. Uma Hleg de 0800P corresponde a 0800 + 3 = <b>1100Z</b> de HMG.'),
          C('nota', 'Atenção ao sinal', 'Muitos sites e GNSS escrevem “UTC−3” para o horário de Brasília. É a mesma coisa que o fuso <b>+3</b> do Manual da DHN: o sinal é o inverso. Na prova e no Almanaque Náutico brasileiro, o fuso de Brasília é +3 e Hleg = HMG − (+3) = HMG − 3 h.'),
          TB(['Fuso', 'Letra', 'Meridiano central', 'Exemplo de lugar'], [
            ['+5', 'R', '075° W', 'Costa leste dos EUA (hora padrão)'],
            ['+4', 'Q', '060° W', 'Barbados'],
            ['+3', 'P', '045° W', 'Brasília e a maior parte do Brasil'],
            ['+2', 'O', '030° W', 'Fernando de Noronha, Geórgia do Sul'],
            ['+1', 'N', '015° W', 'Cabo Verde (hora legal)'],
            ['0', 'Z', '000°', 'Greenwich (hora padrão); a HMG'],
            ['−1', 'A', '015° E', 'Europa central (hora padrão)'],
          ], 'Os lugares são exemplos de hora legal em uso; confirme a hora legal do local antes de navegar, pois os países mudam as suas.'),
          H('Os fusos legais do Brasil'),
          P('Os países não seguem à risca os meridianos: as fronteiras de estados e países decidem. O Brasil tem hoje quatro fusos legais:'),
          FATO('extra-fechamento-cvtr-11', 'Primeiro fuso: hora de Greenwich menos 2 horas (fuso +2, letra O). O Decreto nº 2.784/1913 o aplica a <i>Fernando de Noronha</i> e à ilha da <i>Trindade</i>; o Manual de Navegação da DHN inclui também o arquipélago de <i>São Pedro e São Paulo</i>, e a prática naval segue esse uso.'),
          FATO('extra-fechamento-cvtr-10', 'Segundo fuso: Greenwich menos 3 horas (+3, P): Distrito Federal e os estados inteiros (não só o litoral) RS, SC, PR, SP, RJ, MG, ES, GO, TO, BA, SE, AL, PE, PB, RN, CE, PI, MA, PA e AP. Terceiro: menos 4 horas (+4, Q): MT, MS, RO, RR e o leste do Amazonas. Quarto: menos 5 horas (+5, R): Acre e o oeste do Amazonas.'),
          FIG(svg('0 0 440 240', 'Fusos teóricos do Atlântico entre 70° W e 10° E, com cidades de exemplo',
            // x = 20 + (lonW_neg + 70) * 5 ; lon -70 -> 20 ; lon 10 -> 420
            '<rect x="32.5" y="60" width="75" height="40" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<rect x="107.5" y="60" width="75" height="40" fill="var(--sea-2)" stroke="var(--sea-3)"/>' +
            '<rect x="182.5" y="60" width="75" height="40" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<rect x="257.5" y="60" width="75" height="40" fill="var(--sea-2)" stroke="var(--sea-3)"/>' +
            '<rect x="332.5" y="60" width="75" height="40" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            txt(70, 85, 'Q +4', { anchor: 'middle', bold: true }) + txt(145, 85, 'P +3', { anchor: 'middle', bold: true }) +
            txt(220, 85, 'O +2', { anchor: 'middle', bold: true }) + txt(295, 85, 'N +1', { anchor: 'middle', bold: true }) +
            txt(370, 85, 'Z 0', { anchor: 'middle', bold: true }) +
            '<g stroke="var(--magenta)" stroke-width="2"><line x1="72" y1="100" x2="72" y2="116"/><line x1="194" y1="100" x2="194" y2="116"/><line x1="208" y1="100" x2="208" y2="116"/><line x1="293" y1="100" x2="293" y2="140"/><line x1="245" y1="100" x2="245" y2="164"/></g>' +
            txt(72, 134, 'Barbados', { anchor: 'middle', size: 15 }) + txt(192, 134, 'Natal', { anchor: 'end', size: 15 }) + txt(210, 134, 'Noronha', { anchor: 'start', size: 15 }) +
            txt(293, 158, 'Las Palmas', { anchor: 'middle', size: 15 }) + txt(245, 182, 'Mindelo', { anchor: 'middle', size: 15 }) +
            txt(20, 50, '70° W', { size: 14 }) + txt(420, 50, '10° E', { anchor: 'end', size: 14 }) +
            txt(20, 212, 'Faixas teóricas de 15°. Natal, Mindelo e Las Palmas', { size: 14 }) +
            txt(20, 230, 'usam hora legal diferente da faixa em que caem.', { size: 14 })),
            'Fusos teóricos (pelo meridiano) na rota do Atlântico. Natal (35° 12′ W) cai na faixa +2, mas o Brasil usa +3. Mindelo (24° 59′ W) cai na faixa +2, mas Cabo Verde usa +1. Las Palmas (15° 25′ W) cai na faixa +1, mas as Canárias usam a hora de Greenwich.'),
          H('No mar: a hora de bordo'),
          P('No mar, a tradição é manter a hora do fuso <b>teórico</b> em que o navio está e mudar o relógio de 1 hora ao cruzar o limite do fuso. Navegando para <b>Oeste</b>, os relógios são <b>atrasados</b>; navegando para <b>Leste</b>, são <b>adiantados</b>. Nas marinhas, adianta-se o relógio no quarto de 0000 às 0400 e atrasa-se no de 1800 às 2100. Na vela de cruzeiro cada tripulação decide; o importante é o navegante sempre saber converter a hora do relógio em HMG.'),
          P('Para registrar eventos, a marinha usa o <b>grupo data-hora</b>: dia (2 dígitos), hora e minuto (4 dígitos), letra do fuso, mês (3 letras) e ano (2 dígitos). Por exemplo, <b>150730P SET 26</b> é 15 de setembro de 2026, às 07h 30m, hora do fuso +3 (P).'),
          CHK([
            q('m1l4-1', 'Astronomia: tempo e fusos', 1, 'Qual o fuso horário (teórico) da longitude 038° 15′ W?',
              ['+2 (O).', '+3 (P).', '+4 (Q).', '−3 (C).'], 1,
              '38° 15′ ÷ 15 dá quociente 2 e resto 8° 15′, maior que 7,5°; então o fuso é 2 + 1 = 3. Oeste é positivo: +3 (P). A alternativa A esquece de somar 1; a C usa o fuso errado; a D troca o sinal (fuso negativo é Leste).',
              'Miguens, vol. II, item 19.3.3', U.mig2),
            q('m1l4-2', 'Astronomia: tempo e fusos', 1, 'Um iate no fuso +3 (P) registra Hleg = 0800. A HMG correspondente é:',
              ['0500Z.', '0800Z.', '1100Z.', '1300Z.'], 2,
              'HMG = Hleg + fuso = 0800 + 3 = 1100Z. A alternativa A subtrai o fuso (é a conversão no sentido contrário); a B ignora o fuso; a D usa fuso +5.',
              'Miguens, vol. II, item 19.4.3', U.mig2),
            q('m1l4-3', 'Astronomia: tempo e fusos', 2, 'A HMG é 21h 00m. Qual a hora legal em Nápoles, no fuso −1 (A)?',
              ['20h 00m (A).', '22h 00m (A).', '00h 00m (A).', '18h 00m (A).'], 1,
              'Hleg = HMG − fuso = 21h − (−1) = 22h. Leste tem hora adiantada em relação a Greenwich. A alternativa A trata o fuso como +1; a C erra a soma; a D subtrai 3 horas sem motivo.',
              'Miguens, vol. II, item 19.5', U.mig2),
            q('m1l4-4', 'Astronomia: tempo e fusos', 2, 'Natal (RN) está em 35° 12′ W. Qual a relação entre o fuso teórico e a hora legal em uso?',
              ['Coincidem: o fuso teórico é +3.', 'O fuso teórico é +2, mas a hora legal é a do fuso +3 (decreto).', 'O fuso teórico é +4 e a hora legal é +3.', 'O fuso teórico é +3 e a hora legal é +2.'], 1,
              '35° 12′ ÷ 15 dá 2 e resto 5° 12′ (menor que 7,5°): o fuso teórico é +2. Mas o Brasil usa a hora de Brasília (+3) em todo o Rio Grande do Norte e em quase todo o país, por lei, e não por meridiano. Daí a diferença entre a hora legal (que vale no dia a dia) e o fuso teórico (que o navio em alto-mar costuma seguir).',
              'Miguens, vol. II, itens 19.3.3 e 19.11.3', U.mig2),
          ]),
          FT([
            mig2('cap. 19, itens 19.3.3, 19.4.3, 19.5, 19.6 e 19.7'),
            { txt: 'Lei nº 12.876/2013 (fusos do Brasil)', url: U.lei12876, ref: 'extra-fechamento-cvtr-10' },
            mig2('item 19.11.3 (hora legal e oficial do Brasil)'),
          ]),
        ],
      },
      {
        id: 'l5', titulo: 'Conversões de hora: exemplos resolvidos', minutos: 14,
        objetivos: [
          'Percorrer a “escada do tempo” (HVL, HML, HMG, Hleg) em ambos os sentidos.',
          'Resolver conversões com mudança de data.',
          'Cometer menos erros nas contas de hora da prova.',
        ],
        blocos: [
          P('Quase todo problema de astronomia começa com uma conversão de hora. Se você domina a escada abaixo, o resto fica mecânico.'),
          FIG(svg('0 0 440 330', 'Escada do tempo: hora verdadeira local, hora média local, hora média de Greenwich e hora legal, com as fórmulas de ida e volta',
            '<rect x="14" y="10" width="170" height="46" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)"/>' + txt(99, 40, 'HVL', { anchor: 'middle', bold: true }) +
            '<rect x="14" y="94" width="170" height="46" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)"/>' + txt(99, 124, 'HML', { anchor: 'middle', bold: true }) +
            '<rect x="14" y="178" width="170" height="46" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)"/>' + txt(99, 208, 'HMG', { anchor: 'middle', bold: true }) +
            '<rect x="14" y="262" width="170" height="46" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)"/>' + txt(99, 292, 'Hleg', { anchor: 'middle', bold: true }) +
            '<g ' + MG + ' stroke-width="2.5" fill="none"><line x1="99" y1="58" x2="99" y2="92"/><line x1="99" y1="142" x2="99" y2="176"/><line x1="99" y1="226" x2="99" y2="260"/></g>' +
            '<g fill="var(--magenta)"><path d="M93 86 L99 96 L105 86 Z"/><path d="M93 170 L99 180 L105 170 Z"/><path d="M93 254 L99 264 L105 254 Z"/></g>' +
            txt(200, 70, 'descendo: HML = HVL − ET', { size: 15 }) + txt(200, 88, 'subindo: HVL = HML + ET', { size: 15 }) +
            txt(200, 154, 'descendo: HMG = HML + λ (W)', { size: 15 }) + txt(200, 172, 'ou HMG = HML − λ (E)', { size: 15 }) +
            txt(200, 238, 'descendo: Hleg = HMG − fuso', { size: 15 }) + txt(200, 256, 'subindo: HMG = Hleg + fuso', { size: 15 })),
            'Sempre passe pela HMG quando for de uma hora local para outra. O sinal do fuso é o do Manual da DHN (+ a Oeste). Se o resultado ultrapassar 24 h, subtraia 24 h e some 1 dia à data; se ficar negativo, some 24 h e subtraia 1 dia.'),
          H('Exemplos'),
          P('<b>1. Hleg → HMG (fuso +3).</b> Hleg = 08h 15m do dia 14 de março. HMG = 08h 15m + 3h = <b>11h 15m do dia 14</b>.'),
          P('<b>2. HMG → Hleg em Fernando de Noronha (fuso +2).</b> HMG = 21h 40m. Hleg = 21h 40m − 2h = <b>19h 40m</b>.'),
          P('<b>3. Virada de dia para a frente.</b> Hleg = 22h 30m do dia 14, fuso +3. HMG = 22h 30m + 3h = 25h 30m = <b>01h 30m do dia 15</b>.'),
          P('<b>4. Virada de dia para trás.</b> HMG = 01h 20m do dia 15, fuso +3. Hleg = 01h 20m − 3h = −1h 40m. Soma-se 24 h e tira-se 1 dia: <b>22h 20m do dia 14</b>.'),
          P('<b>5. Do relógio de bordo ao almanaque.</b> No mar, longitude 026° W, o relógio marca 15h 20m 10s do dia 3 de maio e o fuso teórico é +2 (26° ÷ 15 = 1, resto 11° &gt; 7,5°). HMG = 15h 20m 10s + 2h = <b>17h 20m 10s</b>. O argumento de entrada no almanaque é a hora inteira anterior, <b>17h</b>, e restam 20m 10s para os acréscimos.'),
          P('<b>6. De um lugar para outro.</b> Em Salvador (fuso +3), Hleg = 18h 00m. Que hora é em Lisboa em dezembro (fuso 0)? HMG = 18h + 3h = 21h 00m; Hleg Lisboa = 21h 00m − 0 = <b>21h 00m</b>.'),
          P('<b>7. Pela hora média local (o caminho da passagem meridiana).</b> HML = 11h 50m, longitude 043° 10′ W (2h 52m 40s). HMG = 11h 50m + 2h 52m 40s = 14h 42m 40s. Hleg (+3) = 14h 42m 40s − 3h = <b>11h 42m 40s</b> (11h 43m ao minuto).'),
          P('<b>8. Pela hora verdadeira.</b> Em 06 de novembro, ET = +16m 24s; longitude 028° 34,5′ W (1h 54m 18s), fuso +2. HVL = 12h 00m 00s. HML = 12h − 16m 24s = 11h 43m 36s. HMG = 11h 43m 36s + 1h 54m 18s = 13h 37m 54s. Hleg = 13h 37m 54s − 2h = <b>11h 37m 54s</b>, ou 11h 38m ao minuto. (Exemplo do Manual da DHN.)'),
          P('<b>9. Passagem de fuso em viagem.</b> Rumo a Oeste, o navio cruza o limite do fuso +2 para o +3 às 04h 00m de Hleg (+2). Os relógios passam a marcar 03h 00m (+3). A HMG não muda: 06h 00m nos dois casos.'),
          C('dica', 'Verificação de 5 segundos', 'Todo resultado de conversão tem de passar em um teste de bom senso. Indo para o <b>fuso +3</b> a partir da HMG, a hora legal <i>diminui</i> 3 horas; indo para um fuso <b>negativo</b>, a hora legal <i>aumenta</i>. Em longitude <b>Oeste</b>, a HMG é sempre <i>maior</i> que a HML.'),
          CHK([
            q('m1l5-1', 'Astronomia: tempo e fusos', 1, 'Hleg = 22h 30m do dia 14 de março, no fuso +3. A HMG e a data são:',
              ['19h 30m do dia 14.', '01h 30m do dia 15.', '01h 30m do dia 14.', '22h 30m do dia 14.'], 1,
              'HMG = 22h 30m + 3h = 25h 30m; como passa de 24 h, subtrai-se 24 h e soma-se 1 dia: 01h 30m do dia 15. A alternativa A subtrai o fuso; a C acerta a hora mas esquece a data; a D ignora o fuso.',
              'Miguens, vol. II, item 19.5', U.mig2),
            q('m1l5-2', 'Astronomia: tempo e fusos', 2, 'HML = 11h 50m na longitude 043° 10′ W, fuso +3. A hora legal correspondente, ao minuto, é:',
              ['11h 43m.', '11h 57m.', '14h 43m.', '08h 57m.'], 0,
              'λ = 2h 52m 40s. HMG = 11h 50m + 2h 52m 40s = 14h 42m 40s; Hleg = HMG − 3h = 11h 42m 40s ≈ 11h 43m. A alternativa B é a HML mais 7 minutos (não faz sentido físico); a C esquece de tirar o fuso (é a HMG); a D subtrai a longitude e o fuso.',
              'Miguens, vol. II, item 25.3', U.mig2),
            q('m1l5-3', 'Astronomia: tempo e fusos', 2, 'Num dia de ET = −3m 26s, a longitude é 035° 31,8′ W e o fuso é +2. Qual a hora legal em que o Sol cruza o meridiano?',
              ['12h 26m.', '11h 26m.', '12h 03m.', '14h 26m.'], 0,
              'HML = 12h − (−3m 26s) = 12h 03m 26s. λ = 2h 22m 07s. HMG = 12h 03m 26s + 2h 22m 07s = 14h 25m 33s; Hleg = 14h 25m 33s − 2h = 12h 25m 33s ≈ 12h 26m. A alternativa B erra o sinal da ET e do fuso; a C é a HML; a D é a HMG com arredondamento.',
              'Miguens, vol. II, item 25.3 (exemplo do 2º método)', U.mig2),
            q('m1l5-4', 'Astronomia: tempo e fusos', 2, 'HMG = 01h 20m do dia 15. A hora legal no fuso +3 e a data são:',
              ['22h 20m do dia 14.', '04h 20m do dia 15.', '22h 20m do dia 15.', '01h 20m do dia 14.'], 0,
              'Hleg = 01h 20m − 3h = −1h 40m; somam-se 24 h e subtrai-se 1 dia: 22h 20m do dia 14. A alternativa B soma o fuso (sentido errado); a C esquece de recuar a data; a D ignora o fuso.',
              'Miguens, vol. II, item 19.5', U.mig2),
          ]),
          FT([mig2('cap. 19, itens 19.4.2, 19.5 e 19.6'), mig2('cap. 25, item 25.3')]),
        ],
      },
      {
        id: 'l6', titulo: 'Horário de verão e linha internacional de data', minutos: 10,
        objetivos: [
          'Tratar o horário de verão como um deslocamento de fuso.',
          'Explicar a situação atual do horário de verão no Brasil.',
          'Aplicar a regra de mudança de data ao cruzar o meridiano de 180°.',
        ],
        blocos: [
          H('Horário de verão'),
          P('Alguns países adiantam os relógios em 1 hora no verão. Para o navegante, isso significa apenas que o lugar <b>passa a usar o fuso vizinho, a Leste</b>. Se o Rio de Janeiro estiver no horário de verão, deixa de usar o fuso +3 (P) e passa ao +2 (O). A fórmula é a mesma, com o fuso novo: Hleg = HMG − fuso.'),
          FATO('extra-capitao-1-03', 'O Brasil <b>não adota horário de verão</b> desde que o Decreto nº 9.772, de 25 de abril de 2019, o encerrou no território nacional.'),
          P('Isso não vale para todo o mundo. Em países que o adotam, o fuso usado no verão é um a menos que o padrão: Portugal continental, que no inverno usa a hora de Greenwich (fuso 0), usa no verão o fuso −1 (A). Se o seu destino usa horário de verão na data da sua chegada, conte com isso na conversão.'),
          C('seguranca', 'Tábua das Marés e Almanaque', 'O Almanaque Náutico usa <b>sempre a HMG</b>, sem horário de verão. A Tábua das Marés da DHN traz as horas no <b>fuso padrão</b> do porto. Se há horário de verão em vigor onde você está, o relógio do porto estará uma hora adiantada em relação às tábuas: converta antes de usar.'),
          H('A linha internacional de mudança de data'),
          P('O meridiano de <b>180°</b> divide ao meio o último fuso. A metade em longitudes Oeste (até 180° W) é o fuso <b>+12 (Y)</b>; a metade em longitudes Leste (até 180° E), o <b>−12 (M)</b>. Os dois diferem em 24 horas: os relógios marcam <b>a mesma hora, mas em dias diferentes</b>. Por convenção, um novo dia começa quando o Sol médio passa pelo meridiano inferior de Greenwich, isto é, em 180°.'),
          FIG(svg('0 0 440 256', 'Linha internacional de mudança de data: ao cruzar 180° para oeste soma-se um dia; para leste, subtrai-se um dia',
            '<rect x="20" y="40" width="200" height="120" fill="var(--sea-2)" stroke="var(--sea-3)"/>' +
            '<rect x="220" y="40" width="200" height="120" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<line x1="220" y1="30" x2="220" y2="170" ' + MG + ' stroke-width="3"/>' +
            txt(220, 24, '180°', { anchor: 'middle', bold: true }) +
            txt(120, 76, 'Longitudes E', { anchor: 'middle', bold: true }) + txt(120, 98, 'fuso −12 (M)', { anchor: 'middle' }) + txt(120, 124, 'dia 15', { anchor: 'middle', bold: true }) +
            txt(320, 76, 'Longitudes W', { anchor: 'middle', bold: true }) + txt(320, 98, 'fuso +12 (Y)', { anchor: 'middle' }) + txt(320, 124, 'dia 14', { anchor: 'middle', bold: true }) +
            '<path d="M392 146 L248 146" stroke="var(--ink)" stroke-width="2.5" fill="none"/><path d="M256 138 L244 146 L256 154 Z" fill="var(--ink)"/>' +
            txt(420, 186, 'navegando para Oeste: +1 dia', { anchor: 'end', size: 15 }) +
            '<path d="M248 214 L392 214" stroke="var(--ink)" stroke-width="2.5" fill="none"/><path d="M384 206 L396 214 L384 222 Z" fill="var(--ink)"/>' +
            txt(20, 242, 'navegando para Leste: −1 dia', { size: 15 })),
            'Mesmo instante (HMG), duas datas. Ao cruzar 180° para Oeste (da faixa +12 para a −12), o relógio fica igual e a data avança. Para Leste, a data recua.'),
          P('<b>Exemplo.</b> Um veleiro no Pacífico, em Hleg = 23h 00m do dia 14 no fuso +12 (Y), cruza 180° rumo a Oeste. HMG = 23h 00m + 12h = 35h 00m = 11h 00m do dia 15. No fuso −12 (M): Hleg = 11h 00m + 12h = 23h 00m <b>do dia 15</b>. O relógio continua em 23h 00m, mas o calendário pulou um dia.'),
          P('<b>Exemplo de ETA em HMG.</b> Planejar em HMG evita confusão com fusos e datas, como recomenda o Manual da DHN. Um veleiro parte de Mindelo (fuso +1) às 10h 00m do dia 5 e estima 14 dias e 6 horas de travessia até Barbados (fuso +4). HMG de partida = 10h + 1h = 11h do dia 5. HMG de chegada = 11h do dia 5 + 14d 6h = 17h do dia 19. Hora legal de chegada = 17h − 4h = <b>13h 00m do dia 19</b>, no fuso +4.'),
          P('Na travessia do Atlântico não existe linha de data. O que existe é o ajuste dos relógios, algumas vezes ao longo da rota. De Mindelo (hora de Cabo Verde, fuso +1) a Barbados (fuso +4), os relógios são atrasados três vezes, uma hora cada.'),
          CHK([
            q('m1l6-1', 'Astronomia: tempo e fusos', 1, 'Qual o efeito do horário de verão sobre o fuso usado pelo lugar?',
              ['O lugar passa ao fuso vizinho a Leste e adianta os relógios em 1 hora.', 'O lugar passa ao fuso vizinho a Oeste e atrasa os relógios em 1 hora.', 'A hora média de Greenwich também é adiantada em 1 hora.', 'Nenhum: o horário de verão só vale para a navegação interior.'], 0,
              'O fuso do horário de verão é o vizinho a Leste, e os relógios são adiantados de 1 hora (Rio de Janeiro iria de +3 a +2). A alternativa B descreve o oposto; a C está errada porque a HMG não depende de legislação local; a D é inventada.',
              'Miguens, vol. II, item 19.3.4', U.mig2),
            q('m1l6-2', 'Astronomia: tempo e fusos', 2, 'Um navio cruza o meridiano de 180° rumo a Oeste. Em relação à data, o que se faz?',
              ['Subtrai-se um dia.', 'Soma-se um dia (os relógios ficam iguais).', 'Repete-se a data e atrasa-se o relógio em 24 h.', 'Nada: a data só muda à meia-noite.'], 1,
              'Navegando para Oeste, passa-se da faixa +12 (Y) para a −12 (M), que está 24 horas adiantada: a data avança um dia. Navegando para Leste, repete-se (subtrai-se) um dia.',
              'Miguens, vol. II, item 19.3.3', U.mig2),
            q('m1l6-3', 'Astronomia: tempo e fusos', 2, 'Em Lisboa, no verão, o fuso em uso é −1 (A). A HMG é 13h 00m. A hora legal é:',
              ['12h 00m.', '13h 00m.', '14h 00m.', '16h 00m.'], 2,
              'Hleg = HMG − fuso = 13h − (−1) = 14h. Quem está a Leste tem hora adiantada. A alternativa A trata o fuso como +1; a B ignora o horário de verão; a D usa fuso −3.',
              'Miguens, vol. II, itens 19.3.4 e 19.5', U.mig2),
          ]),
          FT([
            mig2('cap. 19, itens 19.3.3 (linha de mudança de data) e 19.3.4 (hora de verão)'),
            { txt: 'Decreto nº 9.772/2019 (fim do horário de verão)', url: U.dec9772, ref: 'extra-capitao-1-03' },
          ]),
        ],
      },
    ],
  });

  /* ==================================================================================================
     m2 — A esfera celeste e o Almanaque Náutico (Anexo 5-A, 1.2 a, II)
     ================================================================================================== */

  var FIG_M2L1 = svg('0 0 440 290', 'Plano do meridiano de um observador a 35° S: zênite, horizonte, polo sul elevado a 35° e equador celeste; um astro de declinação 12° S cruza o meridiano a 23° do zênite',
    meridPlano({ cx: 200, cy: 140, r: 105, lat: -35, dec: -12, poles: true, arcos: ['latpolo', 'dec', 'z'] }) +
    txt(10, 268, 'φ = latitude = altura do polo elevado', { size: 14 }) +
    txt(10, 286, 'δ = declinação · z = distância zenital', { size: 14 }));

  var FIG_M2L4 = svg('0 0 440 346', 'Triângulo de posição visto do polo elevado: lados PZ, PA e ZA, ângulo no polo t',
    '<circle cx="220" cy="175" r="126" fill="none" stroke="var(--sea-3)" stroke-width="1.5" stroke-dasharray="6 4"/>' +
    '<line x1="220" y1="175" x2="220" y2="38" ' + INK + ' stroke-width="1.5" stroke-dasharray="4 4"/>' +
    // P no centro; Z em cima a 94 px (colatitude 67°); A a 112 px (distância polar 80°) com t = 30° para W (horário)
    '<polygon points="220,175 220,81 276,78" fill="var(--magenta)" fill-opacity=".10" stroke="none"/>' +
    '<line x1="220" y1="175" x2="220" y2="81" ' + INK + ' stroke-width="2.5"/>' +
    '<line x1="220" y1="175" x2="317" y2="119" ' + INK + ' stroke-width="2.5"/>' +
    '<line x1="220" y1="81" x2="317" y2="119" ' + MG + ' stroke-width="3"/>' +
    '<path d="M220 140 A35 35 0 0 1 250 157" fill="none" stroke="var(--magenta)" stroke-width="2.5"/>' +
    '<circle cx="220" cy="175" r="5" fill="var(--ink)"/><circle cx="220" cy="81" r="6" fill="var(--ink)"/><circle cx="317" cy="119" r="7" fill="var(--magenta)"/>' +
    txt(212, 194, 'P (polo elevado)', { anchor: 'end', bold: true }) + txt(212, 78, 'Z (zênite)', { anchor: 'end', bold: true }) + txt(327, 117, 'A (astro)', { bold: true, fill: 'var(--magenta)' }) +
    txt(206, 132, 'PZ = 90° − φ', { anchor: 'end', size: 15 }) + txt(284, 190, 'PA = 90° − δ', { size: 15, anchor: 'start' }) +
    txt(236, 70, 'ZA = z = 90° − a', { size: 15, fill: 'var(--magenta)', anchor: 'start' }) +
    txt(256, 150, 't', { bold: true, fill: 'var(--magenta)' }) +
    txt(10, 318, 'Esquema fora de escala. O círculo tracejado é o', { size: 14 }) +
    txt(10, 336, 'equador celeste; t é o ângulo no polo.', { size: 14 }));

  var FIG_M2L5 = svg('0 0 440 330', 'Mapa de uma abertura do Almanaque Náutico: página da esquerda com ponto vernal, planetas e estrelas; página da direita com Sol, Lua, crepúsculos, passagem meridiana e equação do tempo; abaixo, as páginas amarelas',
    '<rect x="8" y="8" width="208" height="212" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)" stroke-width="1.5"/>' +
    '<rect x="224" y="8" width="208" height="212" rx="6" fill="var(--sea-1)" stroke="var(--sea-3)" stroke-width="1.5"/>' +
    txt(112, 32, 'Página da esquerda', { anchor: 'middle', bold: true, size: 15 }) +
    txt(20, 62, 'Ponto vernal: AHGγ', { size: 15 }) + txt(20, 86, 'Vênus, Marte, Júpiter,', { size: 15 }) + txt(20, 106, 'Saturno: AHG e Dec', { size: 15 }) +
    txt(20, 136, 'Estrelas (57): ARV e', { size: 15 }) + txt(20, 156, 'Dec, de 3 em 3 dias', { size: 15 }) + txt(20, 192, 'Hora a hora, 3 dias', { size: 15 }) +
    txt(328, 32, 'Página da direita', { anchor: 'middle', bold: true, size: 15 }) +
    txt(236, 62, 'Sol: AHG, Dec, d, SD', { size: 15, bold: true, fill: 'var(--magenta)' }) + txt(236, 86, 'Lua: AHG, Dec, v, d, PH', { size: 15 }) +
    txt(236, 116, 'Crepúsculos, nascer e pôr', { size: 15 }) + txt(236, 140, 'Pass. Mer. (Sol e Lua)', { size: 15, bold: true, fill: 'var(--magenta)' }) +
    txt(236, 164, 'Equação do tempo', { size: 15, bold: true, fill: 'var(--magenta)' }) + txt(236, 188, 'Fases da Lua', { size: 15 }) +
    '<rect x="8" y="236" width="424" height="40" rx="6" fill="var(--nav-yellow)" fill-opacity=".30" stroke="var(--sea-3)" stroke-width="1.5"/>' +
    txt(220, 254, 'Páginas amarelas: acréscimos e correções', { anchor: 'middle', size: 15, bold: true }) + txt(220, 270, '(um quadro por minuto) · conversão de arco em tempo', { anchor: 'middle', size: 14 }) +
    '<rect x="8" y="284" width="424" height="38" rx="6" fill="var(--sea-2)" stroke="var(--sea-3)" stroke-width="1.5"/>' +
    txt(220, 302, 'Tábua A2 (alturas de 10° a 90°) e outras', { anchor: 'middle', size: 15 }) + txt(220, 318, 'tábuas de correção de altura e depressão do horizonte', { anchor: 'middle', size: 14 }));

  var FIG_M2L6 = svg('0 0 440 340', 'Seis passos do relógio ao AHL e à declinação do Sol: converter a hora, entrar no Almanaque, ler AHG e Dec, somar acréscimo e correção d, e subtrair a longitude',
    caixa(60, 6, 320, 40, ['1. Hleg → HMG (HMG = Hleg + fuso)']) + seta(220, 46, 70) +
    caixa(60, 70, 320, 40, ['2. Data + hora inteira de HMG']) + seta(220, 110, 134) +
    caixa(60, 134, 320, 40, ['3. Página diária: AHG, Dec e d']) + seta(220, 174, 198) +
    caixa(60, 198, 320, 40, ['4. Página amarela: acréscimo e corr. d']) + seta(220, 238, 262) +
    caixa(60, 262, 320, 40, ['5. AHG e Dec no instante'], true) +
    txt(220, 326, '6. AHL = AHG − λ (W)  ou  AHG + λ (E)', { anchor: 'middle', size: 15 }));

  M.push({
    id: 'm2', titulo: 'A esfera celeste e o Almanaque Náutico',
    resumo: 'O mapa do céu: esfera celeste, coordenadas horizontais, horárias e equatoriais, ponto vernal, ascensão reta versa, o triângulo de posição e o uso do Almanaque Náutico (com extratos simulados) para achar AHG e declinação.',
    licoes: [
      {
        id: 'l1', titulo: 'A esfera celeste e seus pontos de referência', minutos: 12,
        objetivos: [
          'Nomear os pontos e círculos da esfera celeste: zênite, nadir, horizonte, polos, equador e meridiano.',
          'Explicar o movimento diurno aparente dos astros.',
          'Demonstrar que a altura do polo elevado é igual à latitude do observador.',
        ],
        blocos: [
          P('Os astros estão a distâncias gigantescas, mas para navegar importa apenas a <b>direção</b> em que eles aparecem. Por isso o navegante trabalha como se todos estivessem “colados” na face interna de uma esfera de raio enorme, centrada na Terra: a <b>esfera celeste</b>. Ela é um modelo, e funciona muito bem.'),
          H('Pontos e círculos que você precisa saber de cor'),
          L([
            '<b>Zênite (Z)</b>: o ponto da esfera diretamente acima da sua cabeça. O oposto, embaixo dos seus pés, é o <b>nadir</b>.',
            '<b>Horizonte celeste</b>: o círculo a 90° do zênite, o plano horizontal que passa por você.',
            '<b>Polos celestes</b>: onde o eixo de rotação da Terra, prolongado, toca a esfera. O <b>polo elevado</b> é o que fica acima do horizonte: o Norte, para quem está no hemisfério Norte; o Sul, para quem está no hemisfério Sul. Em quase todo o Brasil (ao sul do Equador) é o polo sul celeste; o Cruzeiro do Sul ajuda a achá-lo.',
            '<b>Equador celeste</b>: a projeção do equador da Terra na esfera, a 90° dos polos.',
            '<b>Meridiano do observador</b>: o círculo máximo que passa pelos polos e pelo zênite. A metade do lado do zênite é o <b>meridiano superior</b>; a outra, o <b>inferior</b>.',
            '<b>Círculo horário</b> de um astro: o meridiano celeste que passa por ele. <b>Vertical</b> do astro: o círculo máximo que passa pelo zênite e pelo astro.',
          ]),
          TERM(['esfera-celeste', 'zenite', 'nadir', 'horizonte', 'polo-celeste', 'equador-celeste']),
          H('O movimento diurno'),
          P('A Terra gira de Oeste para Leste; por isso a esfera celeste parece girar de <b>Leste para Oeste</b> em torno do eixo dos polos, uma volta a cada dia. Cada astro percorre um círculo paralelo ao equador, o <b>paralelo de declinação</b> (ou círculo diurno). Ele nasce no setor leste, sobe, cruza o meridiano superior e desce até se pôr no setor oeste. Quando cruza o meridiano superior, o astro está na sua maior altura: é a <b>culminação</b>, ou <b>passagem meridiana superior</b>. É esse instante que o Capitão-Amador aprende a prever e a observar.'),
          H('A regra de ouro: altura do polo = latitude'),
          FIG(FIG_M2L1, 'Plano do meridiano de um observador a 35° S (norte à esquerda, sul à direita). O polo sul elevado está a 35° acima do horizonte; o equador celeste cruza o meridiano a 35° do zênite, no lado norte. O astro desenhado tem declinação 12° S e culmina a 23° do zênite.'),
          P('Olhe a figura. O ângulo entre o horizonte e o polo elevado é igual ao ângulo entre o zênite e o equador: ambos são a <b>latitude</b> do observador. Em outras palavras:'),
          P('<b>altura do polo elevado = latitude do observador</b> (e o equador celeste cruza o meridiano a uma distância do zênite igual à latitude).'),
          P('Essa é a base de toda a latitude pela passagem meridiana. Se um astro com declinação δ cruza o meridiano, a distância dele ao zênite é a diferença entre a latitude e a declinação: <b>z = |φ − δ|</b> quando ambas têm o mesmo nome. No exemplo da figura, 35° S − 12° S = 23°.'),
          WID('esfera-celeste', { lat: -23, vista: 'observador', astro: 'sol' }, 'Gire a esfera: veja o horizonte, o meridiano, o equador celeste e o arco diurno do Sol. Mude a hora e acompanhe a culminação.'),
          CHK([
            q('m2l1-1', 'Astronomia: esfera celeste e almanaque', 1, 'Um observador está na latitude 30° S. A altura do polo elevado é:',
              ['0°, no horizonte.', '30°, o polo sul.', '30°, o polo norte.', '60°, o polo sul.'], 1,
              'A altura do polo elevado é igual à latitude, e o polo elevado tem o mesmo nome da latitude: no hemisfério Sul, o polo Sul, a 30° do horizonte. A alternativa C troca o polo; a D confunde a altura do polo (30°) com a do equador sobre o horizonte (60°); a A só vale no equador.',
              'Miguens, vol. II, cap. 17', U.mig2),
            q('m2l1-2', 'Astronomia: esfera celeste e almanaque', 2, 'Um astro de declinação 0° (sobre o equador celeste) cruza o meridiano para um observador em 20° N. Qual a sua altura na culminação?',
              ['20°.', '70°.', '90°.', '110°.'], 1,
              'O equador cruza o meridiano a 20° do zênite, então o astro está a z = 20° do zênite e a altura é a = 90° − 20° = 70°. A alternativa A confunde z com a; a C só vale em latitude 0°; a D passa de 90°, impossível para altura.',
              'Miguens, vol. II, item 25.4', U.mig2),
            q('m2l1-3', 'Astronomia: esfera celeste e almanaque', 1, 'O meridiano superior do observador é:',
              ['O círculo que passa pelo zênite e pelo astro.', 'A semicircunferência do meridiano do lugar que contém o zênite.', 'O equador celeste.', 'O horizonte.'], 1,
              'O meridiano do observador passa pelos polos e pelo zênite; a metade que contém o zênite é a superior. A alternativa A descreve o vertical do astro; a C é o círculo a 90° dos polos; a D é o círculo a 90° do zênite.',
              'Miguens, vol. II, cap. 17', U.mig2),
          ]),
          FT([mig2('cap. 17 (A Terra e seus movimentos; a esfera celeste)'), mig2('cap. 18 (sistemas de coordenadas), item 18.4.1'), mig2('cap. 25, itens 25.1 e 25.4')]),
        ],
      },
      {
        id: 'l2', titulo: 'Coordenadas horizontais e horárias', minutos: 13,
        objetivos: [
          'Definir altura, distância zenital, azimute, declinação, ângulo horário local e em Greenwich, e ângulo no polo.',
          'Converter AHG em AHL conforme a longitude (W ou E).',
          'Dizer em que lado do meridiano está o astro a partir do AHL.',
        ],
        blocos: [
          P('Para dizer onde um astro está, precisamos de duas medidas, como a latitude e a longitude fazem na Terra. Há três sistemas de coordenadas que você vai usar. Nesta lição, dois.'),
          H('Coordenadas horizontais: onde o astro está para você'),
          L([
            '<b>Altura (a)</b>: o arco do vertical entre o horizonte e o astro, de 0° a 90°. É a medida que o sextante faz.',
            '<b>Distância zenital (z)</b>: o arco entre o zênite e o astro. <b>z = 90° − a</b>.',
            '<b>Azimute (Az)</b>: o ângulo entre o Norte verdadeiro e o vertical do astro, contado de 000° a 360° no sentido horário. Na passagem meridiana o azimute do Sol é 000° (Sol ao norte de você) ou 180° (ao sul).',
          ]),
          P('Essas coordenadas dependem do lugar e do instante: o mesmo astro tem alturas diferentes para quem está em dois pontos distintos.'),
          H('Coordenadas horárias: a posição em relação ao meridiano'),
          L([
            '<b>Declinação (δ)</b>: o arco do círculo horário entre o equador celeste e o astro, de 0° a 90°, <b>N</b> ou <b>S</b>. É a “latitude” do astro.',
            '<b>Ângulo horário local (AHL)</b>: o arco do equador, ou o ângulo no polo, entre o <b>meridiano superior do observador</b> e o círculo horário do astro, contado <b>para Oeste</b>, de 000° a 360°.',
            '<b>Ângulo horário em Greenwich (AHG)</b>: o mesmo, mas a partir do meridiano de Greenwich. É o que o almanaque tabela.',
            '<b>Ângulo no polo (t)</b>: o AHL contado de 000° a 180°, para Oeste ou Leste. Se AHL &lt; 180°, t = AHL e o astro está a Oeste; se AHL &gt; 180°, t = 360° − AHL e o astro está a Leste.',
          ]),
          P('Como o meridiano do lugar está “λ” graus de Greenwich, o AHL e o AHG diferem justamente pela longitude:'),
          P('<b>AHL = AHG − λ (W)</b> &nbsp; e &nbsp; <b>AHL = AHG + λ (E)</b>'),
          P('Se o resultado ficar negativo, some 360°. Se passar de 360°, subtraia 360°. No instante da passagem meridiana, o AHL é zero, e por isso a longitude do observador é o próprio AHG do Sol: <b>λ (W) = AHG</b>.'),
          FIG(svg('0 0 440 372', 'Diagrama de tempo com o Sol: AHG, AHL e longitude',
            diagTempo({ cx: 220, cy: 160, r: 118, lonW: 28, ahg: 73, astro: 'Sol' }) +
            txt(220, 318, 'AHL = AHG − λ (W): 73° − 28° = 45°', { anchor: 'middle', size: 14 }) +
            txt(220, 336, 'O Sol está a 45° a Oeste do meridiano local:', { anchor: 'middle', size: 14 }) +
            txt(220, 354, 'são cerca de 3 horas depois do meio-dia verdadeiro.', { anchor: 'middle', size: 14 })),
            'O mesmo diagrama de tempo da lição de HMG, agora com um Sol cujo AHG é 073° e um observador em 028° W. Cada 15° de AHL equivalem a 1 hora de hora verdadeira depois (ou antes) do meio-dia.'),
          P('No caso do Sol, o AHL conta a hora verdadeira: <b>HVL = AHL + 12 h</b>. Com o AHL do Sol em 045° (3 h), a hora verdadeira local é 15h.'),
          H('Exemplos'),
          L([
            '<b>1.</b> AHG = 058° 10,0′, λ = 043° 10,0′ W → AHL = 058° 10,0′ − 043° 10,0′ = <b>015° 00,0′</b>. O astro está a 15° a Oeste do meridiano (t = 15° W).',
            '<b>2.</b> AHG = 020° 00,0′, λ = 050° 00,0′ W → 20° − 50° = −30°; somando 360°, AHL = <b>330°</b>. Como AHL &gt; 180°, o astro está a Leste, a t = 360° − 330° = 30° E.',
            '<b>3.</b> AHG = 300° 30,0′, λ = 060° 15,0′ E → 300° 30′ + 60° 15′ = 360° 45′; tirando 360°, AHL = <b>000° 45,0′</b>. O astro acabou de passar o meridiano: 45′ de arco são 3 minutos de tempo.',
            '<b>4.</b> AHG = 043° 03,3′, λ = 043° 10,0′ W → AHL = 043° 03,3′ − 043° 10,0′ = −6,7′ = <b>359° 53,3′</b>. O Sol ainda não chegou ao meridiano: falta 6,7′ de arco, ou 27 segundos de tempo.',
          ]),
          C('dica', 'O teste do nome da longitude', 'Quando o astro está <i>exatamente</i> no meridiano, AHG e longitude Oeste são iguais; para longitude Leste, AHG = 360° − λ. Isso é usado para calcular a longitude na passagem meridiana (módulo 3).'),
          TERM(['declinacao-do-astro', 'angulo-horario', 'azimute', 'altura', 'distancia-zenital']),
          CHK([
            q('m2l2-1', 'Astronomia: esfera celeste e almanaque', 1, 'Qual a relação correta entre AHL, AHG e longitude Oeste (λ)?',
              ['AHL = AHG + λ.', 'AHL = AHG − λ.', 'AHL = λ − AHG.', 'AHL = 360° − AHG − λ.'], 1,
              'O meridiano do lugar está λ a Oeste de Greenwich, então o ângulo horário local é menor: AHL = AHG − λ (W). A alternativa A vale para longitude Leste; C e D são fórmulas sem fundamento.',
              'Miguens, vol. II, item 18.2', U.mig2),
            q('m2l2-2', 'Astronomia: esfera celeste e almanaque', 2, 'AHG do Sol = 032° 30,8′; longitude 043° 10,0′ W. Qual o AHL e o lado do meridiano em que está o Sol?',
              ['010° 39,2′, a Oeste.', '010° 39,2′, a Leste.', '349° 20,8′, a Leste.', '075° 40,8′, a Oeste.'], 2,
              'AHL = 32° 30,8′ − 43° 10,0′ = −10° 39,2′; somando 360°, AHL = 349° 20,8′. Como é maior que 180°, o Sol está a Leste: ainda não passou pelo meridiano (t = 10° 39,2′ E). A alternativa A esquece de somar 360° e troca o lado; a B dá o ângulo no polo t no lugar do AHL; a D soma a longitude em vez de subtrair.',
              'Miguens, vol. II, item 18.2', U.mig2),
            q('m2l2-3', 'Astronomia: esfera celeste e almanaque', 1, 'Qual a distância zenital de um astro cuja altura é 67° 17,6′?',
              ['22° 42,4′.', '67° 17,6′.', '157° 17,6′.', '22° 17,6′.'], 0,
              'z = 90° − a = 89° 60,0′ − 67° 17,6′ = 22° 42,4′. Atenção ao empréstimo de 60′: 90° vale 89° 60′. A alternativa D esquece o empréstimo; a B repete a altura; a C soma em vez de subtrair.',
              'Miguens, vol. II, item 25.4', U.mig2),
            q('m2l2-4', 'Astronomia: esfera celeste e almanaque', 2, 'O AHL do Sol é 045°. A hora verdadeira local é aproximadamente:',
              ['09h.', '12h.', '15h.', '21h.'], 2,
              'HVL = AHL + 12 h, e 45° valem 3 h (15° = 1 h): HVL = 15h. A alternativa A seria o AHL de 315° (3 h antes do meio-dia); a B é o AHL = 0; a D seria 135°.',
              'Miguens, vol. II, item 19.3.1', U.mig2),
          ]),
          FT([mig2('cap. 18, itens 18.2 (coordenadas horárias) e 18.4 (horizontais)'), mig2('cap. 19, item 19.3.1')]),
        ],
      },
      {
        id: 'l3', titulo: 'Coordenadas equatoriais: ponto vernal, ascensão reta e ângulo sideral', minutos: 13,
        objetivos: [
          'Explicar o ponto vernal e a ascensão reta versa (ARV), chamada de ângulo sideral no mundo inglês.',
          'Calcular o AHG de uma estrela: AHG* = AHGγ + ARV*.',
          'Entender por que estrelas têm coordenadas quase fixas e o Sol não.',
        ],
        blocos: [
          P('Os ângulos horários são ótimos para a navegação, mas têm um defeito para tabelar estrelas: mudam o tempo todo, porque a esfera gira. Para fixar a posição de uma estrela entre as outras, usa-se um terceiro sistema, ligado às próprias estrelas: as <b>coordenadas equatoriais</b>.'),
          H('O ponto vernal'),
          P('O Sol caminha pela esfera, ao longo de um ano, sobre um círculo inclinado cerca de 23,4° em relação ao equador celeste: a <b>eclíptica</b>. Os dois círculos se cruzam em dois pontos. Aquele em que o Sol passa do hemisfério Sul para o Norte, no equinócio de março, é o <b>ponto vernal</b> (γ, ou Áries). Ele funciona como o “meridiano de Greenwich do céu”: é a origem para medir as coordenadas das estrelas. O ponto vernal gira com a esfera, junto com as estrelas.'),
          H('Ascensão reta e ascensão reta versa'),
          P('A <b>declinação</b> (δ) já conhecemos. A segunda coordenada é a <b>ascensão reta (AR)</b>: o arco do equador entre o círculo horário do ponto vernal e o do astro, contado para <b>Leste</b>, de 000° a 360° (os astrônomos usam também horas). Os almanaques de navegação preferem medir para <b>Oeste</b>, como os ângulos horários. Essa medida é a <b>ascensão reta versa (ARV)</b>, que o almanaque inglês chama de <i>sidereal hour angle</i>, ou ângulo sideral:'),
          P('<b>ARV = 360° − AR</b>'),
          P('Para as 57 estrelas de navegação, o Almanaque Náutico dá a ARV e a Dec, que praticamente não variam durante vários dias (variam bem devagar, por causa da precessão dos equinócios; por isso cada ano tem a sua tabela).'),
          FIG(svg('0 0 440 372', 'Diagrama de tempo com o ponto vernal e uma estrela: AHG da estrela é AHG do ponto vernal mais a ascensão reta versa',
            diagTempo({ cx: 220, cy: 160, r: 118, ahg: 230, ahgPV: 120, astro: 'estrela' }) +
            txt(220, 318, 'AHG da estrela = AHGγ + ARV', { anchor: 'middle', size: 14 }) +
            txt(220, 336, 'AHGγ = 120°; ARV = 110°; AHG* = 230°', { anchor: 'middle', size: 14 }) +
            txt(220, 354, 'AHL* = AHLγ + ARV (com o mesmo raciocínio)', { anchor: 'middle', size: 14 })),
            'O ponto vernal (γ) e uma estrela giram juntos. O ângulo entre os dois, medido para Oeste, é a ARV da estrela, que é constante. O ângulo horário em Greenwich da estrela é, portanto, o do ponto vernal acrescido da ARV.'),
          H('Como o almanaque entrega o AHG de uma estrela'),
          P('O almanaque tabela, para cada hora inteira de HMG, o <b>AHG do ponto vernal (AHGγ)</b>. Para uma estrela, você soma a ARV dela:'),
          P('<b>AHG* = AHGγ + ARV*</b> &nbsp; (se passar de 360°, subtraia 360°)'),
          P('<b>Exemplo (dados simulados).</b> Em 15 de outubro de 2026, HMG = 21h 12m. O almanaque dá AHGγ às 21h = 339° 24,2′. O acréscimo do ponto vernal para 12 minutos (15° 02,5′ por hora) é 3° 00,5′, logo AHGγ às 21h 12m = 342° 24,7′. A ARV de Acrux (Cruzeiro do Sul) é 172° 58,4′ e a Dec é 63° 14,8′ S (posição média de 2026, da precessão a partir das coordenadas J2000 da estrela). Então AHG* = 342° 24,7′ + 172° 58,4′ = 515° 23,1′, ou <b>155° 23,1′</b> (tirando 360°). Para um observador em 030° 00,0′ W, AHL* = 155° 23,1′ − 030° 00,0′ = <b>125° 23,1′</b>. Acrux está a Oeste do meridiano, a t = 125° 23,1′ W.'),
          C('nota', 'Dados simulados', 'Os números acima foram calculados por fórmula para treinar o método (tempo sideral médio e precessão). Para navegar, use as páginas e a lista de estrelas do Almanaque Náutico do ano.'),
          H('Dia sideral e o céu que muda'),
          P('O <b>tempo sideral</b> é medido pelo ângulo horário do ponto vernal (AHLγ). O <b>dia sideral</b>, o intervalo entre duas passagens do ponto vernal pelo mesmo meridiano, dura cerca de <b>23h 56m</b>, cerca de 3 min 56 s menos que o dia solar médio. É por isso que as estrelas nascem e se põem cerca de 4 minutos mais cedo a cada dia, e que o céu noturno muda ao longo do ano.'),
          H('O Sol, a Lua e os planetas'),
          P('Para astros do Sistema Solar, a declinação e a ARV mudam o tempo todo. Por isso o almanaque dá, para o <b>Sol</b>, a <b>Lua</b> e os <b>4 planetas de navegação</b> (Vênus, Marte, Júpiter e Saturno), o <b>AHG e a Dec de hora em hora</b>. A declinação do Sol varia entre cerca de 23,4° S (solstício de dezembro) e 23,4° N (solstício de junho), e vale zero nos equinócios de março e setembro.'),
          TERM(['esfera-celeste', 'posicao-geografica-do-astro']),
          CHK([
            q('m2l3-1', 'Astronomia: esfera celeste e almanaque', 1, 'A ascensão reta versa (ARV) de um astro é:',
              ['O ângulo horário do astro em Greenwich.', '360° − ascensão reta, contada para Oeste a partir do ponto vernal.', 'O arco do equador entre o astro e o horizonte.', 'A declinação do astro somada ao AHL.'], 1,
              'ARV = 360° − AR, o arco do equador entre o círculo horário do ponto vernal e o do astro, contado para Oeste. A alternativa A descreve o AHG; a C mistura equador e horizonte; a D não é uma coordenada.',
              'Miguens, vol. II, item 18.3', U.mig2),
            q('m2l3-2', 'Astronomia: esfera celeste e almanaque', 2, 'AHGγ = 100° e ARV da estrela = 300°. O AHG da estrela é:',
              ['040°.', '200°.', '400°.', '140°.'], 0,
              'AHG* = AHGγ + ARV* = 100° + 300° = 400°; subtraindo 360°, AHG* = 040°. A alternativa C esquece de reduzir ao intervalo 0–360°; a B subtrai (300° − 100°); a D usa a diferença com sinal trocado.',
              'Miguens, vol. II, item 18.3', U.mig2),
            q('m2l3-3', 'Astronomia: esfera celeste e almanaque', 1, 'Por que o almanaque dá o AHG e a Dec do Sol hora a hora, mas só a ARV e a Dec (fixas) das estrelas?',
              ['Porque o Sol é mais brilhante que as estrelas.', 'Porque as coordenadas equatoriais das estrelas variam muito devagar e as do Sol variam rápido.', 'Porque estrelas não têm declinação.', 'Porque o Sol não tem ângulo horário.'], 1,
              'As estrelas estão fixas na esfera celeste (suas ARV e Dec mudam só pela precessão); o Sol, a Lua e os planetas se movem em relação a elas. A alternativa A é irrelevante; C e D são falsas, pois todo astro tem declinação e ângulo horário.',
              'Miguens, vol. II, itens 18.3 e 23.2', U.mig2),
            q('m2l3-4', 'Astronomia: esfera celeste e almanaque', 2, 'Por que as estrelas nascem e se põem cerca de 4 minutos mais cedo a cada dia?',
              ['Porque o dia sideral é cerca de 3 min 56 s mais curto que o dia solar médio.', 'Porque a órbita da Terra é elíptica.', 'Porque o ponto vernal se desloca para o Leste.', 'Porque a refração aumenta no inverno.'], 0,
              'A Terra completa uma rotação em relação às estrelas em 23h 56m, antes de completar uma em relação ao Sol. As outras causas não produzem esse avanço diário de ~4 min.',
              'Miguens, vol. II, item 19.9', U.mig2),
          ]),
          FT([mig2('cap. 18, item 18.3 (coordenadas equatoriais)'), mig2('cap. 19, item 19.9 (tempo sideral)'), mig2('cap. 23, itens 23.2 e 23.7')]),
        ],
      },
      {
        id: 'l4', titulo: 'O triângulo de posição', minutos: 12,
        objetivos: [
          'Identificar os vértices, lados e ângulos do triângulo de posição.',
          'Escrever a relação entre altura, latitude, declinação e ângulo no polo.',
          'Mostrar por que, na passagem meridiana, o triângulo desaparece e o cálculo fica simples.',
        ],
        blocos: [
          P('Toda a navegação astronômica se resume a resolver um triângulo desenhado na esfera celeste: o <b>triângulo de posição</b> (também chamado triângulo astronômico). Ele junta as coordenadas do observador, as do astro e a hora.'),
          H('Os vértices e os lados'),
          L([
            '<b>P</b>: o polo elevado.',
            '<b>Z</b>: o zênite do observador.',
            '<b>A</b>: o astro.',
          ]),
          TB(['Lado', 'Vale', 'Significa'], [
            ['PZ', '90° − φ', 'colatitude do observador'],
            ['PA', '90° − δ (mesmo nome do polo) ou 90° + δ (nome contrário)', 'distância polar do astro'],
            ['ZA', '90° − a', 'distância zenital z'],
          ]),
          P('O <b>ângulo em P</b> é o ângulo no polo t, derivado do AHL. O <b>ângulo em Z</b> é o azimute do astro (contado do polo elevado). Quando se conhecem três elementos, os outros se calculam por trigonometria esférica.'),
          FIG(FIG_M2L4, 'Esquema do triângulo de posição, visto do polo elevado. P é o centro; o círculo tracejado é o equador celeste. O lado ZA é a distância zenital do astro (magenta).'),
          P('Na prática, o problema é sempre o mesmo. Você conhece a <b>latitude estimada</b> (lado PZ), a <b>declinação</b> do astro (lado PA, tirada do Almanaque) e o <b>ângulo no polo</b> (a partir do AHL, que vem do AHG e da longitude: se AHL = 030°, t = 30° W; se AHL = 330°, t = 30° E). Os elementos que faltam, e que se calculam, são o lado ZA (a distância zenital, portanto a altura) e o ângulo em Z (o azimute).'),
          H('A fórmula da altura'),
          P('A lei dos cossenos da trigonometria esférica, aplicada ao triângulo, dá a altura que o astro teria para um observador dado:'),
          P('<b>sen a = sen φ · sen δ + cos φ · cos δ · cos t</b>'),
          P('Com φ e δ de mesmo nome (os dois N ou os dois S), os dois termos têm o mesmo sinal; com nomes contrários, o primeiro termo é negativo (use φ e δ com sinal, N positivo). É a base da reta de altura do módulo 4.'),
          P('<b>Exemplo.</b> Observador em φ = 23° S, Sol com δ = 10° S, ângulo no polo t = 30° W (AHL = 030°). sen a = sen 23° · sen 10° + cos 23° · cos 10° · cos 30° = 0,0678 + 0,7850 = 0,8528, logo <b>a = 58° 31,8′</b>, ou z = 31° 28,2′. Na culminação (t = 0°) a mesma fórmula dá a = 77°: z = 13° = 23° − 10°.'),
          H('Na passagem meridiana, o triângulo desaparece'),
          P('Quando o astro cruza o meridiano superior, o ângulo no polo é zero. Os três vértices P, Z e A ficam sobre o mesmo círculo máximo, o meridiano, e o triângulo vira uma linha. A fórmula se reduz a <b>z = |φ − δ|</b>, sem trigonometria. É por isso que a prova de Capitão-Amador cobra a passagem meridiana e não a reta de altura completa: dá para fazer só com soma e subtração.'),
          WID('esfera-celeste', { lat: -23, vista: 'observador', astro: 'sol', hora: 15 }, 'Veja o triângulo de posição Polo-Zênite-Astro para o Sol em diferentes horas. Procure o momento em que ele se achata, na passagem meridiana.'),
          CHK([
            q('m2l4-1', 'Astronomia: esfera celeste e almanaque', 1, 'Quais são os vértices do triângulo de posição?',
              ['Polo elevado, zênite e astro.', 'Polo norte, polo sul e astro.', 'Zênite, nadir e astro.', 'Observador, Greenwich e astro.'], 0,
              'O triângulo de posição liga o polo elevado, o zênite do observador e o astro. As outras opções misturam pontos que não formam esse triângulo.',
              'Miguens, vol. II, item 20.2', U.mig2),
            q('m2l4-2', 'Astronomia: esfera celeste e almanaque', 2, 'Para um observador em φ = 25° S, qual o comprimento do lado PZ?',
              ['25°.', '65°.', '115°.', '90°.'], 1,
              'PZ é a colatitude: 90° − 25° = 65°. A alternativa A confunde com a própria latitude (altura do polo); a C usaria nomes contrários, o que não acontece com PZ; a D é o lado do equador ao polo.',
              'Miguens, vol. II, item 20.3', U.mig2),
            q('m2l4-3', 'Astronomia: esfera celeste e almanaque', 2, 'Qual o ângulo no polo na passagem meridiana superior?',
              ['0°.', '90°.', '180°.', 'Igual à latitude.'], 0,
              'No instante da passagem pelo meridiano superior, o círculo horário do astro coincide com o meridiano e o ângulo no polo (e o AHL) vale zero. A alternativa C seria a passagem meridiana inferior.',
              'Miguens, vol. II, item 25.1', U.mig2),
            q('m2l4-4', 'Astronomia: esfera celeste e almanaque', 2, 'Na passagem meridiana, a distância zenital do astro, com latitude e declinação de mesmo nome, é:',
              ['z = φ + δ.', 'z = |φ − δ|.', 'z = 90° − φ − δ.', 'z = φ × δ.'], 1,
              'Com o triângulo reduzido a um arco do meridiano, a distância entre o zênite (φ) e o astro (δ) é a diferença entre as duas latitudes celestes, quando de mesmo nome. A soma (A) só valeria com nomes contrários.',
              'Miguens, vol. II, item 25.4', U.mig2),
          ]),
          FT([mig2('cap. 20, itens 20.2 a 20.5 (triângulo de posição)'), mig2('cap. 25, item 25.1'), bow('cap. “Navigational Astronomy”: the navigational triangle')]),
        ],
      },
      {
        id: 'l5', titulo: 'O Almanaque Náutico Brasileiro: o que traz e como é organizado', minutos: 12,
        objetivos: [
          'Dizer o que o Almanaque Náutico fornece e como é organizado.',
          'Reconhecer as páginas diárias, as páginas amarelas e as tábuas de correção de altura.',
          'Ler uma página simulada com a coluna do Sol.',
        ],
        blocos: [
          P('O <b>Almanaque Náutico</b> é a publicação que diz onde cada astro está, em cada instante. Sem ele, a observação do Sol é só um ângulo; com ele, o ângulo vira posição. O brasileiro (publicação DN 5) é editado pela Diretoria de Hidrografia e Navegação (DHN) e, segundo o Manual de Navegação da Marinha (Vol. II, revisão de 2021), segue desde 1957 o mesmo formato do almanaque inglês e do americano.'),
          FATO('tecnico-193', 'Segundo o Manual de Navegação da Marinha do Brasil, Vol. II (1ª Revisão, 2021, cap. 16), o Almanaque Náutico Brasileiro (publicação DN 5) é editado pela DHN desde 1944 e, a partir de 1957, adotou formato idêntico ao Almanaque Náutico inglês/americano.'),
          FATO('tecnico-138', 'Ele fornece os dados do Sol, da Lua, de 4 planetas (Vênus, Marte, Júpiter e Saturno) e de 57 estrelas para a navegação astronômica.'),
          FATO('tecnico-137', 'Para 2026 é a 82ª edição; o Almanaque está disponível para compra na EMGEPRON, não em download gratuito na página.'),
          C('seguranca', 'Use o Almanaque do ano certo', 'Os dados do Almanaque valem para <b>um ano</b>. Navegar com o de outro ano dá erros de minutos de arco, que viram milhas de erro. Leve o do ano da viagem, e o do ano seguinte se a travessia virar o ano.'),
          H('Como ele é organizado'),
          L([
            '<b>Páginas diárias</b>: três dias por abertura (duas páginas lado a lado). A <b>página da esquerda</b> traz o ponto vernal (AHGγ), os planetas e as estrelas; a <b>da direita</b> traz o <b>Sol</b> e a <b>Lua</b>, com os crepúsculos, o nascer e o pôr do Sol e da Lua, a <b>passagem meridiana</b> do Sol e da Lua, a <b>equação do tempo</b> e a fase da Lua.',
            '<b>Páginas amarelas</b> de “acréscimos e correções”: uma tábua para cada minuto (de 0 a 59), em duas partes. A da esquerda dá o acréscimo ao AHG do Sol e planetas, do ponto vernal e da Lua para os segundos; a da direita dá as correções v (ângulo horário) e d (declinação).',
            '<b>Tábuas de correção de altura</b>: a A2 (alturas de 10° a 90°, Sol, estrelas e planetas) e outras para alturas pequenas, para a refração fora do padrão e para a Lua; a depressão do horizonte também está nessas tábuas. A numeração e a ordem das tábuas variam de edição para edição: confira no seu volume.',
            '<b>Tabela de conversão de arco em tempo</b>, a lista das 57 estrelas com ARV e Dec, e outras tábuas (crepúsculos, Estrela Polar etc.).',
          ]),
          P('A numeração das páginas varia de edição para edição; use o índice do seu volume. A precisão tabular do Almanaque é de <b>0,1′</b>.'),
          FATO('programa-64', 'Na prova CPA-I/2026, as questões 1 a 8 partem de uma mesma situação de passagem meridiana do Sol e são resolvidas com anexos do Almanaque Náutico Brasileiro.'),
          P('Nas provas de 2025 e 2026 que analisamos, os anexos foram sempre extratos do Almanaque: a tábua A2 de correção de altura, a página diária da data do problema, os acréscimos e correções e a conversão de arco em tempo. É exatamente o que você vai treinar aqui, com extratos simulados.'),
          FIG(FIG_M2L5, 'Mapa de uma abertura do Almanaque: o que fica em cada página. Em magenta, o que você usa no bloco da passagem meridiana.'),
          SIM(),
          H('Uma página simulada: a coluna do Sol'),
          P('A tabela abaixo reproduz a <i>estrutura</i> da coluna do Sol para três dias, mas com valores calculados por fórmula. Observe: <b>AHG</b> (graus e minutos de arco) e <b>Dec</b> (com N ou S) para cada hora de HMG; embaixo, o <b>d</b> (quanto a declinação muda em uma hora, com sinal: positivo se o número da declinação cresce), o <b>SD</b> (semidiâmetro do Sol), a <b>equação do tempo</b> às 00h e às 12h e a <b>passagem meridiana (Pass. Mer.)</b>, que é a hora média local em que o Sol cruza o meridiano.'),
          ANB_PAGINA_0930,
          H('Duas leituras rápidas'),
          L([
            '<b>Passagem meridiana de 30/09</b>: 11h 50m. É a HML em que o Sol cruza o meridiano em qualquer lugar da Terra (valor de Greenwich; vale na prática para qualquer longitude).',
            '<b>Declinação do Sol em 30/09, às 14h</b>: S 2° 56,7′, e ela cresce em 1,0′ por hora (d = +1,0): o Sol caminha para o Sul, rumo ao solstício de dezembro.',
          ]),
          P('O mesmo extrato mostra que o AHG do Sol aumenta cerca de 15° por hora: das 13h às 14h de 30/09, de 017° 30,6′ para 032° 30,8′, são 15° 00,2′. Os 0,2′ a mais vêm de o Sol verdadeiro adiantar-se um pouco em relação ao Sol médio nessa época, como diz a equação do tempo.'),
          FATO('tecnico-139', 'O CHM também mantém uma página “Dados Astronômicos”, com dados por localidade e mês (ex.: Belém, Rio de Janeiro, Santos, Salvador).'),
          CHK([
            q('m2l5-1', 'Astronomia: esfera celeste e almanaque', 1, 'No Almanaque Náutico, qual a precisão tabular das coordenadas (AHG e Dec)?',
              ['1°.', '1′.', '0,1′.', '0,01′.'], 2,
              'O Almanaque dá AHG e declinação com precisão tabular de 0,1′ (décimo de minuto de arco), suficiente para a navegação. As outras alternativas ou são grosseiras demais (A, B) ou finas demais (D).',
              'Miguens, vol. II, item 23.2', U.mig2),
            q('m2l5-2', 'Astronomia: esfera celeste e almanaque', 1, 'Os argumentos de entrada nas páginas diárias do Almanaque são:',
              ['A longitude e a latitude estimadas.', 'A data e a hora média de Greenwich inteira (a menor e mais próxima).', 'A altura observada e o azimute.', 'O nome do astro e a hora legal.'], 1,
              'Entra-se com a data e com o valor inteiro da HMG imediatamente anterior ao instante da observação; os minutos e segundos entram nas páginas amarelas. A hora legal tem de ser convertida em HMG antes, e a posição só entra depois.',
              'Miguens, vol. II, item 23.2', U.mig2),
            q('m2l5-3', 'Astronomia: esfera celeste e almanaque', 2, 'Na coluna do Sol da página diária, qual dos dados dispensa a conversão de longitude para valer em qualquer lugar da Terra, com boa aproximação?',
              ['O AHG.', 'A passagem meridiana (Pass. Mer.), que é uma hora média local.', 'A altura do Sol.', 'O azimute do Sol.'], 1,
              'A passagem meridiana é tabelada como hora média local (HML) e pode ser usada, com boa aproximação, em qualquer longitude; o AHG é de Greenwich e precisa da longitude para virar AHL; altura e azimute nem constam da página.',
              'Miguens, vol. II, item 25.3', U.mig2),
          ]),
          FT([
            mig2('cap. 23, itens 23.1 a 23.4 (uso do Almanaque Náutico)'),
            { txt: 'Almanaque Náutico, DHN (compra na EMGEPRON)', url: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/almanaque-nautico', ref: 'tecnico-137' },
            { txt: 'Provas do Capitão-Amador (anexos do ANB), DPC', url: U.provas, ref: 'programa-64' },
          ]),
        ],
      },
      {
        id: 'l6', titulo: 'Entrando no Almanaque: AHG e declinação do Sol', minutos: 14,
        objetivos: [
          'Calcular o AHG e a declinação do Sol para qualquer HMG, com acréscimos e correção d.',
          'Passar da hora legal à HMG, entrar no almanaque e chegar ao AHL.',
          'Evitar os erros de sinal da correção d.',
        ],
        blocos: [
          P('Este é o cálculo que abre o bloco da prova e que você fará centenas de vezes. Ele tem sempre os mesmos seis passos:'),
          L([
            'Converter a hora do relógio em <b>HMG</b> (e achar a data de Greenwich).',
            'Abrir a página do dia e entrar com a <b>hora inteira</b> de HMG (a menor e mais próxima).',
            'Anotar <b>AHG</b> e <b>Dec</b> da hora inteira, e o <b>d</b> do dia.',
            'Na página amarela do <b>minuto</b>, ler o <b>acréscimo</b> do AHG para os segundos (Sol/planetas).',
            'Na mesma página, ler a <b>correção d</b> para o d do dia. Seu sinal é o de d: se a declinação do Sol aumenta (em número), some; se diminui, subtraia.',
            'Somar: AHG = AHG da hora + acréscimo; Dec = Dec da hora ± correção d. Se quiser, subtrair a longitude para obter o AHL.',
          ], true),
          FIG(FIG_M2L6, 'Fluxo de cálculo: do relógio ao AHL do Sol.'),
          SIM(),
          ANB_MIN42,
          P('O acréscimo de AHG do Sol/planetas é sempre <b>15° por hora</b>: 15′ por minuto e 0,25′ por segundo. Você pode calcular de cabeça, sem tabela: 42 min × 15′ = 10° 30,0′; 10 s × 0,25′ = 2,5′. A correção d é d × (minutos / 60), em minutos de arco. Os segundos não entram na correção d.'),
          H('Exemplo 1: HMG dada (30 de setembro de 2026, HMG = 14h 42m 10s)'),
          TB(['Passo', 'Cálculo', 'Resultado'], [
            ['AHG às 14h', 'da página do dia 30', '032° 30,8′'],
            ['Acréscimo (42 min 10 s)', '10° 30,0′ + 2,5′', '+ 10° 32,5′'],
            ['<b>AHG do Sol</b>', '032° 30,8′ + 10° 32,5′', '<b>043° 03,3′</b>'],
            ['Dec às 14h', 'da página do dia 30', 'S 02° 56,7′'],
            ['d (dia 30)', '+1,0; correção para 42 min = 1,0 × 42/60', '+ 0,7′'],
            ['<b>Dec do Sol</b>', 'S 02° 56,7′ + 0,7′', '<b>S 02° 57,4′</b>'],
          ]),
          P('Observação: a declinação é Sul e o número cresce (d positivo), então a correção é somada ao valor da tabela. Se o d fosse negativo, subtrairíamos.'),
          H('Exemplo 2: a partir da hora legal'),
          P('Em 29 de setembro de 2026, no fuso +3, o relógio marca Hleg = 11h 25m 40s. HMG = 11h 25m 40s + 3h = <b>14h 25m 40s</b>. Entra-se com 14h.'),
          TB(['Passo', 'Resultado'], [
            ['AHG às 14h (dia 29)', '032° 25,9′'],
            ['Acréscimo (25 min 40 s): 25 × 15′ = 6° 15,0′; 40 s × 0,25′ = 10,0′', '+ 6° 25,0′'],
            ['<b>AHG</b>', '<b>038° 50,9′</b>'],
            ['Dec às 14h', 'S 02° 33,4′'],
            ['Correção d (d = +1,0; 25 min): 1,0 × 25/60 = 0,4′', '+ 0,4′'],
            ['<b>Dec</b>', '<b>S 02° 33,8′</b>'],
          ]),
          H('Exemplo 3: do AHG ao AHL'),
          P('Do Exemplo 1, o AHG é 043° 03,3′. Para um observador em 043° 10,0′ W, AHL = 043° 03,3′ − 043° 10,0′ = −6,7′, isto é, <b>359° 53,3′</b>: o Sol está 6,7′ (27 segundos de tempo) a Leste do meridiano, falta pouco para a passagem. Para um observador em 032° 25,0′ E (no Oceano Índico), AHL = 043° 03,3′ + 032° 25,0′ = <b>075° 28,3′</b>: o Sol está 75° a Oeste, cerca de 5 horas depois do meio-dia.'),
          C('seguranca', 'Os cinco erros de sempre', 'Esquecer de converter Hleg em HMG · usar a <b>hora inteira seguinte</b> em vez da anterior · somar a correção d quando d é negativo · ler o d de outro dia · tratar o nome da declinação (N/S) como sinal da correção. Em dúvida, pergunte: “o número da declinação cresce ou diminui da hora inteira para a seguinte?”. A correção tem esse sinal.'),
          CHK([
            q('m2l6-1', 'Astronomia: esfera celeste e almanaque', 2, 'Em 30/09 (extrato simulado), AHG do Sol às 14h = 032° 30,8′. Qual o AHG às 14h 42m 10s?',
              ['042° 30,8′.', '043° 03,3′.', '043° 33,3′.', '047° 31,0′.'], 1,
              'O acréscimo para 42 min 10 s do Sol é 42 × 15′ = 10° 30,0′ mais 10 × 0,25′ = 2,5′, ou seja, 10° 32,5′. AHG = 032° 30,8′ + 10° 32,5′ = 043° 03,3′. A alternativa A esquece os 32,5′ de acréscimo (não só minutos); a C erra a soma dos graus; a D é o AHG tabelado às 15h.',
              'Miguens, vol. II, item 23.4', U.mig2, true),
            q('m2l6-2', 'Astronomia: esfera celeste e almanaque', 2, 'Dec do Sol às 14h = S 02° 56,7′, d = +1,0, minutos = 42. A declinação às 14h 42m é:',
              ['S 02° 56,0′.', 'S 02° 56,7′.', 'S 02° 57,4′.', 'S 02° 58,7′.'], 2,
              'A correção d é 1,0 × 42/60 = 0,7′. Como d é positivo (o valor da declinação cresce), soma-se: 02° 56,7′ + 0,7′ = 02° 57,4′ S. A alternativa A subtrai a correção; a B esquece a correção; a D é a do valor de 16h (usaria a hora errada).',
              'Miguens, vol. II, item 23.4', U.mig2, true),
            q('m2l6-3', 'Astronomia: esfera celeste e almanaque', 2, 'Em 29/09, Hleg = 11h 25m 40s no fuso +3. Qual a HMG e a hora inteira com que se entra na página?',
              ['08h 25m 40s e 08h.', '14h 25m 40s e 14h.', '14h 25m 40s e 15h.', '11h 25m 40s e 11h.'], 1,
              'HMG = Hleg + fuso = 11h 25m 40s + 3h = 14h 25m 40s. Entra-se com a hora inteira imediatamente anterior ao instante: 14h. A alternativa A subtrai o fuso; a C usa a hora inteira seguinte; a D ignora o fuso.',
              'Miguens, vol. II, itens 23.2 e 23.4', U.mig2),
            q('m2l6-4', 'Astronomia: esfera celeste e almanaque', 2, 'AHG do Sol = 043° 03,3′; longitude = 032° 25,0′ E. O AHL é:',
              ['010° 38,3′.', '075° 28,3′.', '284° 31,7′.', '350° 21,7′.'], 1,
              'Para longitude Leste, AHL = AHG + λ = 043° 03,3′ + 032° 25,0′ = 075° 28,3′. A alternativa A subtrai (fórmula de Oeste); C e D são o complemento, de quando se confunde o lado do meridiano.',
              'Miguens, vol. II, item 23.2', U.mig2, true),
          ]),
          FT([mig2('cap. 23, itens 23.2 a 23.4 (exemplos de AHG e Dec do Sol)')]),
        ],
      },
    ],
  });

  /* ==================================================================================================
     m3 — Passagem meridiana do Sol (Anexo 5-A, 1.2 b e c)
     ================================================================================================== */

  function caixa(x, y, w, h, linhas, destaque) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (destaque ? 'var(--sea-2)' : 'var(--sea-1)') + '" stroke="var(--sea-3)"/>';
    linhas.forEach(function (l, i) { s += txt(x + w / 2, y + 22 + i * 19, l, { anchor: 'middle', size: 15, bold: i === 0 && destaque }); });
    return s;
  }
  function seta(x, y0, y1) { return '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y1 - 8) + '" ' + MG + ' stroke-width="2.5"/><path d="M' + (x - 6) + ' ' + (y1 - 10) + ' L' + x + ' ' + y1 + ' L' + (x + 6) + ' ' + (y1 - 10) + ' Z" fill="var(--magenta)"/>'; }

  var FIG_M3L1 = svg('0 0 440 360', 'Roteiro do bloco da prova: de um lado a previsão antes da observação, do outro o cálculo com a altura observada, ambos terminando na posição',
    txt(110, 22, 'Antes de observar', { anchor: 'middle', bold: true }) + txt(330, 22, 'Depois de observar', { anchor: 'middle', bold: true }) +
    caixa(10, 34, 200, 62, ['1. Hora legal da', 'passagem (Pass. Mer.', '+ λ − fuso)']) +
    caixa(10, 120, 200, 62, ['2. Declinação do Sol', 'para a HMG', '(AHG, Dec, d)']) +
    caixa(10, 206, 200, 62, ['3. z = |φ − δ|', 'altura prevista', 'a = 90° − z']) +
    seta(110, 96, 120) + seta(110, 182, 206) +
    caixa(230, 34, 200, 62, ['4. ai → ao → a ap', '→ a verdadeira', '(ei, dp, c da A2)']) +
    caixa(230, 120, 200, 62, ['5. z = 90° − a', 'φ = δ ± z', '(regra do Sol N/S)']) +
    caixa(230, 206, 200, 62, ['6. λ = AHG', '(W se AHG ≤ 180°,', 'E se maior)']) +
    seta(330, 96, 120) + seta(330, 182, 206) +
    '<line x1="110" y1="268" x2="110" y2="296" ' + MG + ' stroke-width="2.5"/><line x1="330" y1="268" x2="330" y2="296" ' + MG + ' stroke-width="2.5"/>' +
    '<line x1="110" y1="296" x2="330" y2="296" ' + MG + ' stroke-width="2.5"/><line x1="220" y1="296" x2="220" y2="308" ' + MG + ' stroke-width="2.5"/>' +
    caixa(70, 310, 300, 42, ['Posição: φ meridiana, λ meridiana'], true));

  var FIG_M3L3 = svg('0 0 440 330', 'Cadeia de correções da altura: altura instrumental, observada, aparente e verdadeira, com o sinal de cada correção',
    caixa(10, 6, 200, 40, ['ai: altura instrumental']) +
    seta(110, 46, 82) + txt(126, 70, 'ei, com o seu sinal', { size: 15 }) +
    caixa(10, 82, 200, 40, ['ao: altura observada']) +
    seta(110, 122, 158) + txt(126, 146, 'dp, sempre negativa', { size: 15 }) +
    caixa(10, 158, 200, 40, ['a ap: altura aparente']) +
    seta(110, 198, 234) + txt(126, 222, 'c da Tábua A2', { size: 15 }) +
    caixa(10, 234, 200, 40, ['a: altura verdadeira'], true) +
    txt(10, 296, 'c é + no limbo inferior e − no limbo superior.', { size: 14 }) +
    txt(10, 314, 'Entrada da A2: a ap, semestre do ano e limbo.', { size: 14 }));

  function figCaso(lat, dec, legenda, titulo, dx) {
    return svg('0 0 440 312', titulo, meridPlano({ cx: 220, cy: 145, r: 105, lat: lat, dec: dec, poles: false, arcos: ['lat', 'dec', 'z'], astro: 'Sol', astroDx: dx || 0 }) +
      txt(10, 304, legenda, { size: 14 }));
  }
  var FIG_CASO1 = figCaso(-30, -10, 'Sol ao Norte do zênite: φ = δ − z (δ e φ negativas)', 'Latitude e declinação de mesmo nome, latitude maior: o Sol está entre o observador e o equador', -26);
  var FIG_CASO2 = figCaso(12, 23, 'Sol ao Norte do zênite: φ = δ − z (δ e φ positivas)', 'Latitude e declinação de mesmo nome, declinação maior: o Sol passa ao norte do zênite, no hemisfério norte');
  var FIG_CASO3 = figCaso(12, -18, 'Sol ao Sul do zênite: φ = δ + z (δ negativa, φ positiva)', 'Latitude norte e declinação sul: o Sol passa ao sul do zênite');

  M.push({
    id: 'm3', titulo: 'Passagem meridiana do Sol',
    resumo: 'O coração da prova: prever a hora da passagem meridiana, medir e corrigir a altura, calcular a latitude (com as regras de sinal para todos os casos) e a longitude, e combinar tudo numa posição. Termina com dois blocos completos no estilo da prova.',
    licoes: [
      {
        id: 'l1', titulo: 'O bloco da prova e o plano de ataque', minutos: 10,
        objetivos: [
          'Saber o peso do bloco de astronomia e como a prova de Capitão-Amador o apresenta.',
          'Memorizar a sequência de cálculo, da hora legal à posição.',
          'Ter uma “cola” de fórmulas para treinar, sem esquecer nenhuma.',
        ],
        blocos: [
          P('Este é o módulo que decide o seu resultado. Nas provas de 2025 e 2026 que analisamos, o bloco de astronomia foi sempre o mesmo assunto, no começo do caderno: a <b>passagem meridiana do Sol</b>, resolvida com extratos do Almanaque Náutico. Dominar este bloco vale de 1,25 a 2 pontos, e muita gente erra por detalhes de sinal que você vai aprender a evitar.'),
          FATO('normas-78', 'O exame de Capitão-Amador é uma prova escrita com 40 questões, com duração máxima de quatro horas.'),
          FATO('normas-79', 'A prova vale 10,0 pontos, e é aprovado quem alcança pelo menos 5,0.'),
          FATO('programa-62', 'No caderno da CPA-II/2026, cada questão vale 0,25 ponto, num total de 10,0 pontos.'),
          FATO('programa-63', 'As provas de CPA usam múltipla escolha com cinco alternativas (A a E).'),
          FATO('programa-64', 'Na CPA-I/2026, as questões 1 a 8 partem de uma mesma situação de passagem meridiana do Sol e são resolvidas com anexos do Almanaque Náutico Brasileiro.'),
          P('Cada questão vale 0,25, então são 20 acertos para chegar aos 5,0 de aprovação, e o bloco de astronomia sozinho pode render 8 × 0,25 = 2,0 pontos. Nas provas de 2025 e 2026 que analisamos, esse bloco teve de 5 a 8 questões (12,5% a 20% do total).'),
          H('A situação típica (parafraseada)'),
          P('A prova descreve um veleiro em travessia, em uma data, com a <b>posição estimada</b> para a hora da culminação do Sol, a <b>elevação do olho</b> do observador, o <b>erro instrumental</b> do sextante, a <b>HMG da observação</b> e a <b>altura instrumental</b> do limbo inferior do Sol. Em seguida vêm de 5 a 8 perguntas encadeadas, sempre na mesma lógica:'),
          L([
            'a <b>hora legal prevista</b> da culminação;',
            'a <b>declinação</b> do Sol e a <b>distância zenital</b> (ou a <b>altura</b>) previstas para a posição estimada;',
            'a <b>altura verdadeira</b> a partir da altura instrumental lida;',
            'a <b>latitude meridiana</b> e a <b>longitude</b> calculadas, às vezes o <b>azimute</b> do Sol;',
            'perguntas conceituais sobre o sextante e a observação (erros, limbo, técnica).',
          ]),
          P('As alternativas são números próximos entre si, diferindo de poucos minutos de arco. Um erro de sinal custa a questão e, como a resposta de uma alimenta a seguinte, pode custar várias. A saída é um método fixo, sempre o mesmo.'),
          FIG(FIG_M3L1, 'A sequência de cálculo do bloco. À esquerda, o que se prevê antes de observar (para estar pronto e conferir). À direita, o que se calcula com a altura observada. As duas colunas se encontram na posição.'),
          H('A cola de fórmulas'),
          TB(['Passo', 'Fórmula', 'Lição'], [
            ['Fuso', '|λ| ÷ 15; se o resto passar de 7,5°, some 1. Oeste é positivo.', 'm1 l4'],
            ['HML da passagem', 'Pass. Mer. do Almanaque (= 12h − ET)', 'm1 l2, m3 l2'],
            ['HMG e hora legal', 'HMG = HML + λ (W) ou − λ (E); Hleg = HMG − fuso', 'm1 l3-l5'],
            ['AHG e Dec do Sol', 'AHG = AHG da hora + acréscimo (min e s); Dec = Dec da hora ± corr. d', 'm2 l6'],
            ['Altura verdadeira', 'ao = ai + ei; a ap = ao + dp (dp negativa); a = a ap + c', 'm3 l3'],
            ['Distância zenital', 'z = 90° − a', 'm3 l3'],
            ['Latitude meridiana', 'φ = δ − z (Sol ao Norte); φ = δ + z (Sol ao Sul). N positivo, S negativo.', 'm3 l4'],
            ['Longitude meridiana', 'λ (W) = AHG, se AHG ≤ 180°; λ (E) = 360° − AHG', 'm3 l5'],
          ]),
          H('Material e tempo'),
          FATO('normas-80', 'Na prova de Capitão-Amador o candidato leva protocolo de inscrição, documento de identificação, caneta azul ou preta e material de desenho (lápis, régua paralela e/ou esquadros, compasso e borracha).'),
          C('aconfirmar', 'Calculadora', 'A lista de material da norma, acima, <b>não cita calculadora</b>. Confirme com a Capitania onde fará a prova o que é permitido e treine as contas no papel, sem calculadora. Todas as contas deste módulo são somas e subtrações de graus e minutos, e se fazem à mão.'),
          C('dica', 'Gestão de tempo', 'São 4 horas para 40 questões, 6 minutos por questão em média. As contas de astronomia são mecânicas: faça-as com calma e o bloco com método. Ganhe tempo nas questões de memória e reserve o último quarto de hora para conferir os sinais.'),
          CHK([
            q('m3l1-1', 'Astronomia: passagem meridiana do Sol', 1, 'Cada questão da prova vale 0,25 ponto, e a nota mínima de aprovação é 5,0. Quantos acertos, no mínimo, são necessários nas 40 questões?',
              ['5.', '10.', '20.', '25.'], 2,
              '5,0 ÷ 0,25 = 20 acertos. Os outros números não decorrem das regras: 5 é a própria nota mínima, não o número de acertos; 10 acertos valeriam só 2,5 pontos; 25 corresponderia a 6,25 pontos.',
              'NORMAM-211, Anexo 5-A, item 1; caderno CPA-II/2026', U.normam),
            q('m3l1-2', 'Astronomia: passagem meridiana do Sol', 2, 'Qual a ordem lógica de cálculo no bloco da passagem meridiana?',
              ['Latitude, altura verdadeira, declinação, hora legal.', 'Hora legal prevista, declinação do Sol, altura verdadeira, latitude e longitude.', 'Longitude, latitude, hora legal, azimute.', 'Altura instrumental, hora legal, latitude, declinação.'], 1,
              'A ordem natural é prever a hora e a declinação (que dependem do Almanaque e da posição estimada), corrigir a altura medida para obter a altura verdadeira e só então combinar altura e declinação para chegar à latitude, e o AHG para a longitude. As outras ordens tentam usar um dado antes de tê-lo calculado.',
              'Miguens, vol. II, itens 25.3 a 25.5', U.mig2),
            q('m3l1-3', 'Astronomia: passagem meridiana do Sol', 2, 'Qual a relação da latitude meridiana com a declinação do Sol e a distância zenital, quando o Sol passa ao Norte do observador?',
              ['φ = δ + z.', 'φ = δ − z (N positivo).', 'φ = z − δ, sempre.', 'φ = 90° − δ.'], 1,
              'Se o Sol está ao Norte do zênite, o ponto subsolar tem latitude maior que a do observador: δ = φ + z, logo φ = δ − z, com N positivo. A alternativa A vale com o Sol ao Sul; a C só vale em um dos casos (nomes contrários) e com a convenção de nomes; a D é a colatitude do astro, sem relação.',
              'Miguens, vol. II, item 25.4', U.mig2),
          ]),
          FT([
            { txt: 'NORMAM-211/DPC, Anexo 5-A, item 1 (exame de Capitão-Amador)', url: U.normam, ref: 'normas-78' },
            { txt: 'Provas do Capitão-Amador, DPC (2017-2026)', url: U.provas, ref: 'programa-64' },
            mig2('cap. 25, itens 25.3 a 25.6'),
          ]),
        ],
      },
      {
        id: 'l2', titulo: 'Hora legal da passagem meridiana (processo aproximado)', minutos: 14,
        objetivos: [
          'Calcular a hora legal da passagem meridiana superior do Sol pelos dois métodos do Manual da DHN.',
          'Tratar o navio em movimento projetando a posição estimada.',
          'Resolver o caso de longitude Leste, com fuso negativo.',
        ],
        blocos: [
          P('Para observar a altura meridiana, você precisa estar com o sextante na mão <b>antes</b> de o Sol cruzar o meridiano. O navegante calcula então a hora legal em que isso acontece. O cálculo é <b>aproximado</b>, porque usa a posição estimada, e isso basta: a altura do Sol varia muito devagar perto do meridiano.'),
          H('1º método: a passagem meridiana do Almanaque'),
          P('A página diária do Almanaque dá, para cada um dos três dias, a <b>hora média local (HML)</b> em que o Sol cruza o meridiano. O valor de Greenwich pode ser usado, com boa aproximação, em qualquer longitude. Daí:'),
          L([
            'Leia no Almanaque a <b>HML da passagem (Pass. Mer.)</b> da data.',
            'Converta a <b>longitude estimada</b> em tempo.',
            '<b>HMG = HML + λ (W)</b> ou <b>HML − λ (E)</b>.',
            'Descubra o <b>fuso</b> da longitude e calcule <b>Hleg = HMG − fuso</b>.',
            'Arredonde ao minuto.',
          ], true),
          P('<b>Exemplo 1 (navio parado ou posição estimada dada).</b> Em 30 de setembro de 2026 o Almanaque (extrato simulado, lição 5 do módulo 2) dá Pass. Mer. = 11h 50m. A posição estimada é 25° 40,0′ S, 043° 10,0′ W.'),
          TB(['Passo', 'Cálculo'], [
            ['HML da passagem', '11h 50m'],
            ['λ em tempo (43° 10,0′ W)', '2h 52m 40s'],
            ['HMG = HML + λ (W)', '11h 50m + 2h 52m 40s = 14h 42m 40s'],
            ['Fuso (43° 10′ ÷ 15 = 2, resto 13° 10′ &gt; 7,5°)', '+3'],
            ['Hleg = HMG − 3 h', '11h 42m 40s ≈ <b>11h 43m</b>'],
          ]),
          H('2º método: hora verdadeira e equação do tempo'),
          P('O resultado é o mesmo, partindo do meio-dia verdadeiro: HVL = 12h 00m, e a hora média é HML = HVL − ET (lição 2 do módulo 1). A equação do tempo vem do Almanaque, às 12h de Greenwich do dia. <b>Exemplo 2.</b> Em 6 de novembro de 2019, o Manual da DHN usa ET = +16m 24s: HML = 12h − 16m 24s = 11h 43m 36s; para 28° 34,5′ W (1h 54m 18s) e fuso +2, HMG = 13h 37m 54s e Hleg = 11h 37m 54s, ou <b>11h 38m</b>. As duas formas dão o mesmo resultado dentro de um minuto.'),
          H('Navio em movimento: projete a posição'),
          P('Se o navio se move, a longitude na hora da passagem não é a da manhã. Faça a projeção:'),
          L([
            'Tome a HML da passagem como hora provisória, e calcule o <b>intervalo</b> desde a última posição conhecida.',
            'Calcule a <b>distância</b> (d = V × t) e a <b>posição estimada</b> para aquele instante (por rumo e distância na carta ou por fórmula).',
            'Converta a HML em Hleg para essa posição, como no 1º método.',
            'Uma segunda aproximação quase nunca é necessária: 1 milha de erro em longitude muda a hora em 4 segundos, no máximo.',
          ], true),
          P('<b>Exemplo 3.</b> Em 10 de novembro de 2026 às 08h 00m (Hleg), a posição é 12° 30,0′ S, 031° 20,0′ W; rumo 255°, 6,0 nós. Pass. Mer. do dia: 11h 44m (simulado). Intervalo: 11h 44m − 08h 00m = 3h 44m = 3,73 h; distância: 6,0 × 3,73 = 22,4′. Pela estima, Δφ = 22,4 × cos 255° = −5,8′ (para o Sul) e apartamento = 22,4 × sen 255° = −21,6′ (para Oeste), logo Δλ = 21,6′ ÷ cos 12,5° = 22,2′ W. Posição às 11h 44m: 12° 35,8′ S, 031° 42,2′ W. λ = 2h 06m 49s ≈ 2h 07m. HMG = 11h 44m + 2h 07m = 13h 51m; fuso +2 (31° 42′ ÷ 15 = 2, resto 1° 42′). <b>Hleg = 13h 51m − 2h = 11h 51m.</b> (O intervalo foi tomado de forma aproximada, sem converter as 08h 00m de Hleg em HML. A diferença é de uns 5 minutos de tempo, cerca de meia milha, e não muda a hora legal ao minuto.)'),
          P('Na prática, o navegante começa a observar cerca de <b>5 minutos antes</b> da hora calculada e segue até 5 minutos depois, para compensar o erro da estima.'),
          H('Longitude Leste: fuso negativo'),
          P('<b>Exemplo 4.</b> Em 21 de junho de 2026, no Índico, posição 12° 00,0′ S, 055° 30,0′ E. Pass. Mer. = 12h 02m (simulado). λ = 3h 42m 00s. Como a longitude é Leste, HMG = HML − λ = 12h 02m − 3h 42m = 08h 20m. Fuso: 55° 30′ ÷ 15 = 3, resto 10° 30′ &gt; 7,5°, logo 4; Leste é negativo: −4. Hleg = HMG − (−4) = 08h 20m + 4h = <b>12h 20m</b>. Note que, para o Leste, a hora legal fica depois do meio-dia, e a HMG, antes.'),
          WID('reta-altura', { aba: 'hora', modo: 'exercicio' }, 'Treine a hora legal da passagem meridiana com problemas gerados e correção passo a passo (Almanaque simulado).'),
          CHK([
            q('m3l2-1', 'Astronomia: passagem meridiana do Sol', 2, 'Pass. Mer. do dia = 11h 50m; posição estimada 025° 40′ S, 043° 10′ W; fuso +3. A hora legal prevista da culminação é, ao minuto:',
              ['11h 43m.', '11h 50m.', '12h 03m.', '12h 13m.', '14h 43m.'], 0,
              'λ = 2h 52m 40s; HMG = 11h 50m + 2h 52m 40s = 14h 42m 40s; Hleg = 14h 42m 40s − 3 h = 11h 42m 40s ≈ 11h 43m. A alternativa B é a HML menos o fuso (esquece a longitude); a E é a HMG (esquece de subtrair o fuso); a C e a D são horas perto do meio-dia que não saem de nenhuma combinação correta dos passos (por exemplo, partir de 12h00 em vez da Pass. Mer. do Almanaque).',
              'Miguens, vol. II, item 25.3', U.mig2, true),
            q('m3l2-2', 'Astronomia: passagem meridiana do Sol', 2, 'No Índico, em 055° 30′ E e fuso −4, a Pass. Mer. do dia é 12h 02m. A hora legal da culminação é:',
              ['04h 20m.', '08h 20m.', '12h 20m.', '16h 20m.', '12h 02m.'], 2,
              'HMG = 12h 02m − 3h 42m = 08h 20m (longitude Leste subtrai). Hleg = HMG − fuso = 08h 20m − (−4) = 12h 20m. A alternativa A subtrai o fuso e erra o sinal; a B é a HMG; a D soma o fuso de novo à hora legal já pronta; a E é a HML.',
              'Miguens, vol. II, itens 19.4.2 e 25.3', U.mig2, true),
            q('m3l2-3', 'Astronomia: passagem meridiana do Sol', 1, 'Por que, para um navio em movimento, a hora legal da passagem meridiana se calcula com a posição estimada <i>para o instante da passagem</i> e não com a posição da manhã?',
              ['Porque o Almanaque só vale para o instante exato da passagem.', 'Porque a longitude muda com o deslocamento do navio e a hora da culminação depende da longitude.', 'Porque a latitude define a hora da culminação.', 'Porque o Sol se move mais depressa de manhã.'], 1,
              'O instante do meio-dia local depende da longitude: cada grau de longitude a Oeste atrasa a passagem em 4 minutos. A latitude não altera a hora da culminação (C); o Almanaque vale para o dia todo (A); e a velocidade aparente do Sol é a mesma (D).',
              'Miguens, vol. II, item 25.3', U.mig2),
            q('m3l2-4', 'Astronomia: passagem meridiana do Sol', 1, 'Em geral, quando o navegante deve começar a observar o Sol em relação à hora legal prevista da passagem meridiana?',
              ['Exatamente na hora prevista.', 'Cerca de 5 minutos antes.', 'Uma hora antes.', 'Só depois que o Sol começa a descer.'], 1,
              'Como a hora é prevista com aproximação, começa-se cerca de 5 minutos antes e continua-se até cerca de 5 minutos depois, adotando a maior altura. Esperar a hora exata (A) ou o Sol descer (D) faz perder a culminação; uma hora antes (C) é cedo demais.',
              'Miguens, vol. II, itens 25.3 e 25.6', U.mig2),
          ]),
          FT([mig2('cap. 25, item 25.3 (métodos aproximados) e exemplos'), mig2('cap. 19, itens 19.4 a 19.8')]),
        ],
      },
      {
        id: 'l3', titulo: 'Altura meridiana: do sextante à altura verdadeira', minutos: 15,
        objetivos: [
          'Aplicar, na ordem e com o sinal certo, o erro instrumental, a depressão do horizonte e a correção da Tábua A2.',
          'Ler a Tábua A2 pelo semestre do ano e pelo limbo.',
          'Descrever a técnica de observação e determinar o erro instrumental pelo Sol.',
        ],
        blocos: [
          P('O sextante mede a <b>altura instrumental (ai)</b>, o ângulo entre o horizonte visível e o Sol. Para chegar à altura que entra no cálculo, a <b>altura verdadeira (a)</b>, a do <i>centro</i> do Sol sobre o horizonte verdadeiro, é preciso corrigir os erros do instrumento e do ambiente. A cadeia é sempre a mesma:'),
          FIG(FIG_M3L3, 'A cadeia de correções. Na entrada da Tábua A2 usa-se a altura aparente.'),
          L([
            '<b>Erro instrumental (ei)</b>: erro residual do paralelismo dos espelhos, com a alidade em zero. Aplica-se <b>com o seu sinal</b>: ao = ai + ei.',
            '<b>Depressão do horizonte (dp)</b>: como o olho está acima do mar, o horizonte visível fica abaixo do horizonte verdadeiro. <b>Sempre negativa</b>: dp = −1,76′ × √(elevação em metros). Na prática, subtrai-se o valor da depressão: a ap = ao + dp, com dp negativa.',
            '<b>Correção da Tábua A2 (c)</b>: reúne <b>refração</b> (negativa), <b>semidiâmetro</b> (positivo no limbo inferior, negativo no superior) e <b>paralaxe</b> (positiva). Entra-se com a altura aparente, o semestre do ano (Out–Mar ou Abr–Set) e o limbo. No limbo inferior c é positiva (cerca de +15′ a +16′ para alturas acima de 40°); no superior é negativa (cerca de −16′ a −18′ para alturas acima de 30°). a = a ap + c.',
          ]),
          SIM(),
          ANB_DIP,
          ANB_A2,
          H('Exemplo A: limbo inferior, abril–setembro (estilo da prova)'),
          P('30 de setembro de 2026. Altura instrumental do limbo inferior 67° 18,2′; ei = −0,6′; elevação do olho 3,6 m.'),
          TB(['Passo', 'Cálculo', 'Valor'], [
            ['ai', '', '67° 18,2′'],
            ['ei', 'aplicado com o sinal', '− 0,6′'],
            ['<b>ao</b>', '67° 18,2′ − 0,6′', '<b>67° 17,6′</b>'],
            ['dp (3,6 m)', '−1,76′ × √3,6 = −3,3′', '− 3,3′'],
            ['<b>a ap</b>', '67° 17,6′ − 3,3′', '<b>67° 14,3′</b>'],
            ['c (A2, abr–set, limbo inf., faixa 66°–69°)', 'da tabela', '+ 15,6′'],
            ['<b>a (verdadeira)</b>', '67° 14,3′ + 15,6′', '<b>67° 29,9′</b>'],
          ]),
          H('Exemplo B: limbo superior, outubro–março'),
          P('5 de dezembro de 2026. Altura instrumental do limbo <i>superior</i> 60° 38,4′; ei = +1,1′; elevação do olho 2,4 m.'),
          TB(['Passo', 'Cálculo', 'Valor'], [
            ['ao', '60° 38,4′ + 1,1′', '60° 39,5′'],
            ['dp (2,4 m)', '−1,76′ × √2,4', '− 2,7′'],
            ['a ap', '60° 39,5′ − 2,7′', '60° 36,8′'],
            ['c (A2, out–mar, limbo sup., faixa 60°–63°)', 'da tabela', '− 16,6′'],
            ['<b>a (verdadeira)</b>', '60° 36,8′ − 16,6′', '<b>60° 20,2′</b>'],
          ]),
          H('Exemplo C: prever a altura instrumental para estar pronto'),
          P('Dá para prever a altura que o sextante vai marcar e, assim, achar o Sol mais depressa. 18 de março de 2026, posição estimada 17° 45,0′ S, declinação S 0° 47,6′ (para a HMG da passagem), elevação do olho 3,2 m, ei = −1,2′, limbo inferior. Faz-se a cadeia ao contrário:'),
          TB(['Passo', 'Cálculo', 'Valor'], [
            ['z', '|17° 45,0′ − 0° 47,6′| (mesmo nome)', '16° 57,4′'],
            ['a prevista', '90° − 16° 57,4′', '73° 02,6′'],
            ['a ap', 'a − c = 73° 02,6′ − 15,9′', '72° 46,7′'],
            ['ao', 'a ap − dp = 72° 46,7′ + 3,1′ (dp = −3,1′)', '72° 49,8′'],
            ['<b>ai</b>', 'ao − ei = 72° 49,8′ + 1,2′', '<b>72° 51,0′</b>'],
          ]),
          H('A técnica de observação'),
          L([
            'Verifique o <b>erro instrumental</b> antes de cada série, visando o horizonte.',
            'Cerca de <b>5 minutos antes</b> da hora prevista, comece a acompanhar o Sol. Use sempre os <b>filtros</b>. Observe o <b>limbo inferior</b> (só o superior se o inferior estiver encoberto ou mal definido).',
            '<b>Balance o sextante</b>, girando-o em torno do eixo ótico: a altura certa é a do ponto mais baixo do arco descrito pela imagem. Uma altura medida fora do vertical é sempre <i>maior</i> que a verdadeira.',
            'Quando o Sol parar de subir e “morder” o horizonte, ele culminou. Anote a altura máxima e a hora do cronômetro.',
            'Nunca observe o Sol com altura menor que 15°: a refração é incerta.',
          ]),
          P('Por que cinco minutos de folga? Porque a altura perto do meridiano varia muito pouco. Para 25° 40′ S e Sol a S 2° 57′, a altura cai só <b>0,3′</b> em 2 minutos, <b>0,7′</b> em 3 minutos e <b>1,9′</b> em 5 minutos de tempo, em relação ao máximo. É por isso que o máximo é fácil de identificar, mas a sua <i>hora</i> exata não (e a longitude por ela fica menos precisa, como veremos).'),
          H('Determinando o erro instrumental pelo Sol'),
          P('O método mais preciso usa o próprio Sol, com a alidade perto do zero. Faça a imagem refletida tangenciar a direta, primeiro com o índice à <b>direita</b> do zero (leitura L1 = 60′ − leitura do tambor) e depois à <b>esquerda</b> (L2 = leitura do tambor), de preferência com a média de 3 leituras de cada. Então <b>ei = (L1 − L2) ÷ 2</b>. A conferência é o semidiâmetro: <b>SD = (L1 + L2) ÷ 4</b>, que deve ser quase igual ao SD do Almanaque. <b>Exemplo:</b> L1 = 30′ 30″ e L2 = 33′ 30″ dão ei = −1,5′ e SD = 16,0′, compatível com o SD do dia (16,0′ no extrato simulado). Se o ei passar de 3′, refaça a retificação do sextante.'),
          CHK([
            q('m3l3-1', 'Astronomia: passagem meridiana do Sol', 2, 'ai = 48° 12,6′ (limbo inferior), ei = +1,8′, elevação do olho 4,0 m (dp = −3,5′). A altura aparente (a ap) é:',
              ['48° 07,3′.', '48° 10,9′.', '48° 12,6′.', '48° 14,4′.', '48° 17,9′.'], 1,
              'ao = 48° 12,6′ + 1,8′ = 48° 14,4′; a ap = ao − 3,5′ = 48° 10,9′. A alternativa A aplica o ei com o sinal trocado (12,6′ − 1,8′ − 3,5′); a C é a própria altura instrumental, sem correção; a D é a altura observada, esquecendo a depressão; a E soma a depressão em vez de subtraí-la.',
              'Miguens, vol. II, item 22.2', U.mig2, true),
            q('m3l3-2', 'Astronomia: passagem meridiana do Sol', 1, 'Em que sentido atua a depressão do horizonte (dp) na altura?',
              ['Sempre positiva, soma-se.', 'Sempre negativa, subtrai-se.', 'Depende do hemisfério.', 'Depende do limbo observado.'], 1,
              'Como o olho está acima do mar, o horizonte visível está abaixo do verdadeiro: a altura medida é maior do que deveria, e a correção é sempre negativa e cresce com a elevação do olho. Não depende de hemisfério nem de limbo.',
              'Miguens, vol. II, item 22.2 b)', U.mig2),
            q('m3l3-3', 'Astronomia: passagem meridiana do Sol', 2, 'Qual o sinal da correção principal c da Tábua A2 no limbo superior do Sol?',
              ['Positivo, cerca de +16′.', 'Negativo, cerca de −16′ a −18′.', 'Nulo.', 'Positivo no verão e negativo no inverno.'], 1,
              'Para o limbo superior, o semidiâmetro tem de ser subtraído (o limbo está acima do centro do Sol), e a refração também é subtraída: c fica em torno de −16′ a −18′. No limbo inferior c é positiva, pois o semidiâmetro é somado.',
              'Miguens, vol. II, itens 22.2 d) e 22.3.1', U.mig2),
            q('m3l3-4', 'Astronomia: passagem meridiana do Sol', 2, 'Na determinação do erro instrumental pelo Sol, as leituras médias foram L1 = 29′ 06″ e L2 = 33′ 42″. O erro instrumental é:',
              ['+2,3′.', '−2,3′.', '+31,4′.', '−31,4′.'], 1,
              'ei = (L1 − L2) ÷ 2 = (29′ 06″ − 33′ 42″) ÷ 2 = −4′ 36″ ÷ 2 = −2′ 18″ = −2,3′. A alternativa A troca L1 e L2 (sinal invertido); C e D confundem o ei com a média das leituras.',
              'Miguens, vol. II, item 21.2.8', U.mig2),
            q('m3l3-5', 'Astronomia: passagem meridiana do Sol', 2, 'Por que se balança o sextante (gira-se em torno do eixo ótico) ao medir a altura do Sol?',
              ['Para refrescar o instrumento.', 'Para achar o vertical do astro: fora do vertical, a altura medida sai maior que a verdadeira.', 'Para eliminar o erro instrumental.', 'Para reduzir a depressão do horizonte.'], 1,
              'No balanço o Sol descreve um arco; o ponto mais baixo desse arco é o do vertical, onde a altura é a correta. O erro instrumental e a depressão são tratados por cálculo, não pelo balanço.',
              'Miguens, vol. II, item 21.2.9 e)', U.mig2),
          ]),
          WID('sextante', { aba: 'correcoes' }, 'Veja a cadeia de correções, passo a passo, e treine com o exercício completo (medir o erro, observar o Sol e corrigir a altura).'),
          FT([mig2('cap. 21, itens 21.2.2 a 21.2.9 (sextante)'), mig2('cap. 22, itens 22.2 e 22.3.1 (correções das alturas do Sol)'), mig2('cap. 25, item 25.6 (normas para a observação meridiana)')]),
        ],
      },
    ],
  });

  /* m3 — lições 4 a 6 */
  M[2].licoes.push(
    {
      id: 'l4', titulo: 'Latitude meridiana: regras de sinal para todos os casos', minutos: 14,
      objetivos: [
        'Decidir se o Sol passa ao Norte ou ao Sul do zênite.',
        'Aplicar a regra única φ = δ ± z, com N positivo e S negativo, a qualquer combinação de nomes.',
        'Reconhecer os três casos do Manual da DHN e conferir o resultado com a latitude estimada.',
      ],
      blocos: [
        P('A latitude meridiana é a joia da observação. A conta é uma soma ou uma subtração, mas é aqui que se perdem mais pontos, porque são muitos casos: latitude Norte ou Sul, declinação Norte ou Sul, Sol ao Norte ou ao Sul de você. Em vez de decorar cada caso, vamos usar <b>uma regra só</b>.'),
        H('A ideia: o ponto subsolar'),
        P('O <b>ponto subsolar</b> é o ponto da Terra que tem o Sol exatamente no zênite. A latitude dele é a <b>declinação do Sol (δ)</b>. A distância zenital <b>z</b> é o quanto você está longe dele, medido ao longo do meridiano. Logo:'),
        L([
          'Se o ponto subsolar está ao <b>Sul</b> de você (o Sol passa ao Sul do zênite, azimute 180°), a sua latitude é a dele <i>mais</i> z: <b>φ = δ + z</b>.',
          'Se o ponto subsolar está ao <b>Norte</b> de você (o Sol passa ao Norte do zênite, azimute 000°), a sua latitude é a dele <i>menos</i> z: <b>φ = δ − z</b>.',
        ]),
        P('<b>Convenção de sinais:</b> latitude e declinação <b>Norte são positivas</b> e <b>Sul, negativas</b>. O sinal do resultado dá o nome: positivo é Norte, negativo é Sul. A distância zenital z é sempre positiva.'),
        H('Passo 1: o Sol está ao Norte ou ao Sul de você?'),
        P('Compare a declinação com a <b>latitude estimada</b> (ambas com sinal). Se <b>δ &gt; φ estimada</b> (δ mais ao Norte), o Sol passa ao Norte do zênite e o azimute é 000°. Se <b>δ &lt; φ estimada</b>, passa ao Sul e o azimute é 180°. Faça esse teste sempre; ele define a conta.'),
        H('Passo 2: calcule z e aplique a regra'),
        P('Com a altura verdadeira (a) já corrigida, <b>z = 90° − a</b> (lembre-se de que 90° = 89° 60′). Aplique a regra do passo 1.'),
        H('Os três casos do Manual da DHN'),
        P('O Manual da DHN descreve os casos com nomes, em módulo. A regra única os contém todos. As figuras mostram o plano do meridiano do observador (norte à esquerda). Elas são esquemas: os ângulos estão exagerados.'),
        FIG(FIG_CASO1, '1º caso: latitude e declinação de mesmo nome e latitude maior. O Sol fica entre o observador e o equador. No hemisfério Sul, é o Sol ao Norte do zênite: φ = δ − z com sinais, ou, em módulo, Lat = Dec + z.'),
        FIG(FIG_CASO2, '2º caso: latitude e declinação de mesmo nome e declinação maior. O Sol passa ao Norte do zênite, no hemisfério Norte: φ = δ − z, em módulo Lat = Dec − z.'),
        FIG(FIG_CASO3, '3º caso: nomes contrários. Latitude Norte e declinação Sul: o Sol passa ao Sul do zênite, φ = δ + z (δ negativa), em módulo Lat = z − Dec, com o nome da latitude contrário ao da declinação.'),
        TB(['Caso', 'Em módulo (Manual)', 'Regra única (com sinais)'], [
          ['1º: mesmo nome, Lat &gt; Dec', 'Lat = Dec + z', 'Sul: φ = δ − z · Norte: φ = δ + z'],
          ['2º: mesmo nome, Dec &gt; Lat', 'Lat = Dec − z', 'Norte: φ = δ − z · Sul: φ = δ + z'],
          ['3º: nomes contrários', 'Lat = z − Dec; nome contrário ao da Dec', 'Lat N, Dec S: φ = δ + z · Lat S, Dec N: φ = δ − z'],
        ], 'No 1º caso o Sol está entre você e o equador; no 2º, o Sol está “além” do equador em relação a você, mais perto do polo; no 3º, ele está no outro hemisfério.'),
        H('Exemplos (todos com extratos simulados)'),
        L([
          '<b>1. Lat S, Dec S, latitude maior.</b> Estimada 17° 45′ S; δ = S 0° 47,6′; z = 16° 49,9′. δ = −0° 47,6′ &gt; φe = −17° 45′: Sol ao Norte (Az 000°). φ = −0° 47,6′ − 16° 49,9′ = −17° 37,5′ = <b>17° 37,5′ S</b>.',
          '<b>2. Lat N, Dec N, declinação maior.</b> Estimada 14° N; δ = N 23° 10,0′; z = 8° 40,0′. δ = +23° 10′ &gt; φe: Sol ao Norte (Az 000°). φ = 23° 10,0′ − 8° 40,0′ = <b>14° 30,0′ N</b>.',
          '<b>3. Lat N, Dec N, latitude maior.</b> Estimada 33° N; δ = N 12° 15,0′; z = 20° 45,0′. δ = +12° 15′ &lt; φe: Sol ao Sul (Az 180°). φ = 12° 15,0′ + 20° 45,0′ = <b>33° 00,0′ N</b>.',
          '<b>4. Lat N, Dec S (nomes contrários).</b> Estimada 14° 50′ N; δ = S 20° 37,2′; z = 35° 21,2′. δ = −20° 37′ &lt; φe: Sol ao Sul (Az 180°). φ = −20° 37,2′ + 35° 21,2′ = +14° 44,0′ = <b>14° 44,0′ N</b>.',
          '<b>5. Lat S, Dec N (nomes contrários).</b> Estimada 5° S; δ = N 19° 00,0′; z = 24° 20,0′. δ = +19° &gt; φe = −5°: Sol ao Norte (Az 000°). φ = 19° 00,0′ − 24° 20,0′ = −5° 20,0′ = <b>5° 20,0′ S</b>.',
        ]),
        C('seguranca', 'O teste de coerência', 'A latitude meridiana tem de ficar <b>perto da latitude estimada</b>: diferença de alguns minutos de arco, no máximo de poucas dezenas. Se deu uma diferença de graus, ou o nome está errado (N/S), ou a regra do Sol N/S foi trocada, ou a conta de z tem erro de 1° (“empréstimo” de 60′). Refaça antes de marcar.'),
        C('nota', 'Dois casos especiais', 'Quando a declinação é <b>quase igual à latitude e de mesmo nome</b>, o Sol passa perto do zênite (altura perto de 90°): o azimute varia muito depressa, e é difícil achar o vertical do astro; use o azimute calculado e a agulha para orientar a observação. A <b>passagem meridiana inferior</b> (Lat = 180° − (Dec + z)) só é observável com o Sol visível à meia-noite, dentro dos círculos polares; o programa do Capitão-Amador cita só a passagem meridiana <i>superior</i>.'),
        CHK([
          q('m3l4-1', 'Astronomia: passagem meridiana do Sol', 2, 'Estimada 22° S; declinação S 5° 10,0′; z = 16° 40,0′. A latitude meridiana é:',
            ['11° 30,0′ S.', '21° 50,0′ S.', '21° 50,0′ N.', '21° 50,0′ S, com o Sol ao Sul.'], 1,
            'A declinação (−5° 10′) é maior que a latitude estimada (−22°): o Sol passa ao Norte, e φ = δ − z = −5° 10′ − 16° 40′ = −21° 50′, ou 21° 50,0′ S. A alternativa A usa z − δ (conta do caso de nomes contrários); a C erra o nome; a D chega ao número certo, mas afirma o Sol ao Sul, que contradiz a regra.',
            'Miguens, vol. II, item 25.4', U.mig2),
          q('m3l4-2', 'Astronomia: passagem meridiana do Sol', 2, 'Estimada 14° 50′ N; declinação S 20° 30,0′; z = 35° 20,0′. A latitude meridiana é:',
            ['14° 50,0′ S.', '14° 50,0′ N.', '55° 50,0′ N.', '14° 50,0′ N, com Sol ao Norte.'], 1,
            'A declinação é Sul (−20° 30′) e a latitude é Norte: o Sol está ao Sul, e φ = δ + z = −20° 30′ + 35° 20′ = +14° 50′, Norte. A alternativa A erra o nome; a C soma as duas em módulo (20° 30′ + 35° 20′), que só valeria se a latitude fosse maior que a soma; a D afirma o Sol ao Norte, o que não procede.',
            'Miguens, vol. II, item 25.4', U.mig2),
          q('m3l4-3', 'Astronomia: passagem meridiana do Sol', 2, 'Estimada 15° N; declinação N 22° 00,0′; z = 8° 00,0′. Qual a latitude e o azimute do Sol?',
            ['14° 00,0′ N e azimute 180°.', '14° 00,0′ N e azimute 000°.', '30° 00,0′ N e azimute 180°.', '14° 00,0′ S e azimute 000°.'], 1,
            'δ = +22° é maior que φe = +15°, então o Sol passa ao Norte (azimute 000°) e φ = δ − z = 22° − 8° = 14° N. Na A, o azimute está trocado; na C, soma-se z (conta do Sol ao Sul); na D, o nome está trocado.',
            'Miguens, vol. II, item 25.4', U.mig2),
          q('m3l4-4', 'Astronomia: passagem meridiana do Sol', 3, 'Estimada 5° S; declinação N 19° 00,0′; z = 24° 20,0′. A latitude meridiana é:',
            ['5° 20,0′ N.', '5° 20,0′ S.', '43° 20,0′ S.', '5° 20,0′ S, com o Sol ao Sul.'], 1,
            'δ = +19° é maior que φe = −5°: o Sol passa ao Norte, e φ = δ − z = 19° − 24° 20′ = −5° 20′, ou 5° 20,0′ S. A alternativa A erra o nome (esquece o sinal negativo); a C soma em vez de subtrair; a D afirma o Sol ao Sul.',
            'Miguens, vol. II, item 25.4', U.mig2),
          q('m3l4-5', 'Astronomia: passagem meridiana do Sol', 1, 'Como se decide se o Sol passa ao Norte ou ao Sul do zênite?',
            ['Pelo mês do ano.', 'Pela hora legal.', 'Comparando, com os sinais, a declinação do Sol com a latitude estimada.', 'Olhando a sombra do mastro.'], 2,
            'Se δ é maior (mais ao Norte) que φ, o Sol passa ao Norte; se menor, ao Sul. O mês do ano (A) ajuda, mas não decide sozinho (depende de δ e de φ); a hora legal não tem relação; a sombra (D) funciona na prática, mas não é o método de cálculo.',
            'Miguens, vol. II, item 25.4, observações', U.mig2),
        ]),
        FT([mig2('cap. 25, itens 25.4 e 25.5 (latitude meridiana e exemplos)'), mig2('cap. 25, item 25.6 (casos de Sol perto do zênite)')]),
      ],
    },
    {
      id: 'l5', titulo: 'Longitude e posição: da meridiana ao ponto', minutos: 14,
      objetivos: [
        'Calcular a longitude na passagem meridiana pelo AHG, com o nome certo (W ou E).',
        'Conhecer o limite desse método e quando usar a reta da manhã transportada.',
        'Obter a posição ao meio-dia pelo cruzamento da reta da manhã transportada com a latitude meridiana.',
      ],
      blocos: [
        P('A latitude meridiana dá uma <b>linha</b> (um paralelo). Para ter uma <b>posição</b>, falta cruzar com outra linha. Há dois caminhos: a longitude calculada pela própria passagem meridiana (que a prova cobra) e a reta de altura da manhã, transportada até o meio-dia (que se usa na prática).'),
        H('Longitude pelo AHG na passagem meridiana'),
        P('No instante em que o Sol cruza o meridiano superior, o AHL é zero. Como AHL = AHG − λ (W), temos AHG = λ (W). Em palavras: <b>a longitude do observador é o AHG do Sol naquele instante</b>:'),
        L([
          'Se AHG ≤ 180°: <b>λ = AHG, W</b>.',
          'Se AHG &gt; 180°: <b>λ = 360° − AHG, E</b>.',
        ]),
        P('O AHG sai do Almanaque com a <b>HMG da passagem</b> (lição 6 do módulo 2: AHG da hora inteira mais o acréscimo de minutos e segundos). <b>Exemplo 1:</b> HMG = 14h 42m 10s de 30/09/2026: AHG = 032° 30,8′ + 10° 32,5′ = 043° 03,3′ → <b>λ = 043° 03,3′ W</b>. <b>Exemplo 2:</b> numa travessia no Índico, o AHG do Sol na passagem é 304° 40,0′ → λ = 360° − 304° 40,0′ = <b>055° 20,0′ E</b>.'),
        P('Perceba o que falta ao método: ele só funciona se você <b>conhece com exatidão o instante da passagem meridiana</b>, e esse instante é justamente difícil de medir, porque a altura é quase constante ao redor dele (menos de 2′ de variação em 5 minutos, vimos na lição 3). Um erro de 1 minuto no instante vira 15′ de longitude, e 4 segundos de erro de relógio vira 1′. Na prova, a HMG que o enunciado dá é tratada como a da passagem. No mar, use este valor com desconfiança e prefira cruzar a latitude com uma reta de longitude de verdade, como a da manhã.'),
        H('A reta da manhã transportada'),
        P('De manhã, com o Sol com altura entre 15° e 60°, mais ou menos, e azimute longe do Norte e do Sul, mede-se uma altura e calcula-se a reta de altura (módulo 4): uma linha perpendicular ao azimute do Sol. Ao meio-dia, <b>transporta-se</b> essa reta pelo deslocamento do navio e cruza-se com a latitude meridiana.'),
        P('Em milhas, com a reta de altura definida por seu <b>azimute Az</b> e pela <b>diferença de alturas Δa</b> (em minutos de arco, positiva se a altura observada é maior que a calculada; o ponto está a Δa milhas do ponto de partida, em direção ao Sol se for positiva):'),
        L([
          'Calcule a distância percorrida desde a observação, <b>d = V × t</b>, no rumo C.',
          'A reta transportada fica à distância <b>Rd = Δa + d × cos(C − Az)</b> do ponto de partida (PE da manhã), medida na direção do azimute. Rd positivo está em direção ao Sol.',
          'No meio-dia, calcule <b>y = φ meridiana − φ do PE</b> (em minutos de arco, Norte positivo).',
          'A reta transportada cruza o paralelo em <b>x = (Rd − y × cos Az) ÷ sen Az</b> milhas para Leste do PE (negativo é Oeste).',
          'A longitude é <b>λ = λ do PE + x ÷ cos φ médio</b>, com x em minutos de arco.',
        ], true),
        H('Exemplo completo'),
        P('22 de abril de 2026, fuso +2. De manhã, às 08h 30m, o PE é 09° 57,0′ S, 031° 09,0′ W. Com HMG = 10h 30m, o Almanaque simulado dá AHG = 337° 52,0′ e Dec = N 12° 16,5′. Calculando o triângulo de posição para o PE (m4), obtém-se <b>Hc = 32° 35,6′</b> e <b>Az = 068,4°</b>. A altura verdadeira observada é <b>Ho = 32° 27,4′</b>. Então <b>Δa = Ho − Hc = −8,2′</b> (o Sol está mais baixo que o previsto: a reta fica 8,2′ <i>afastando-se</i> do Sol, na direção 248,4°).'),
        P('O navio segue no rumo 250° a 6,0 nós. A passagem meridiana é às 12h 05m: de 08h 30m a 12h 05m são 3h 35m e d = 21,5′. Rd = −8,2′ + 21,5′ × cos(250° − 68,4°) = −8,2′ + 21,5′ × cos 181,6° = −8,2′ − 21,5′ = <b>−29,7′</b>.'),
        P('Ao meio-dia, a observação da meridiana dá <b>φ = 10° 08,0′ S</b>. y = φ − φPE = −10° 08,0′ + 9° 57,0′ = −11,0′. x = (−29,7′ − (−11,0′) × cos 68,4°) ÷ sen 68,4° = (−29,7′ + 4,0′) ÷ 0,930 = <b>−27,6′</b> (Oeste). Com φ médio = 10° 03′, cos = 0,985: Δλ = 27,6′ ÷ 0,985 = 28,0′ W. λ = 031° 09,0′ W + 28,0′ = <b>031° 37,0′ W</b>.'),
        P('<b>Posição ao meio-dia verdadeiro: 10° 08,0′ S, 031° 37,0′ W.</b> (No cenário simulado, é exatamente a posição verdadeira.)'),
        FIG(FIG_M3L5, 'Plotagem em milhas, com o PE da manhã na origem (norte para cima). A reta da manhã (preta) é perpendicular ao azimute do Sol. Ela é transportada pelo deslocamento do navio (pontilhado) e cruza a latitude meridiana (tracejada) na posição ao meio-dia.'),
        C('dica', 'Se não houver reta da manhã', 'Use a latitude meridiana com a longitude estimada <b>para o instante da passagem</b> (a do navegante pela estima, não a da manhã). É menos confiável, mas é a posição que o seu registro deve trazer, junto com a hora.'),
        WID('reta-altura', { aba: 'reta' }, 'Calcule retas de altura e veja a plotagem. Duas retas dão a posição; aqui a segunda é o paralelo da latitude meridiana.'),
        CHK([
          q('m3l5-1', 'Astronomia: passagem meridiana do Sol', 2, 'AHG do Sol na passagem meridiana = 043° 03,3′. A longitude é:',
            ['043° 03,3′ E.', '043° 03,3′ W.', '316° 56,7′ W.', '316° 56,7′ E.'], 1,
            'AHG &lt; 180° significa longitude Oeste igual ao AHG: 043° 03,3′ W. A alternativa A troca o nome; C e D aplicam 360° − AHG, que serve para AHG &gt; 180° e, nesse caso, dá longitude Leste.',
            'Miguens, vol. II, itens 26.5 e 26.6', U.mig2),
          q('m3l5-2', 'Astronomia: passagem meridiana do Sol', 2, 'AHG do Sol na passagem meridiana = 304° 40,0′. A longitude é:',
            ['304° 40,0′ W.', '055° 20,0′ W.', '055° 20,0′ E.', '304° 40,0′ E.'], 2,
            'AHG &gt; 180° dá longitude Leste: λ = 360° − 304° 40,0′ = 055° 20,0′ E. A alternativa A e D usam o AHG sem a redução ao hemisfério; a B tem o valor certo com o nome errado.',
            'Miguens, vol. II, item 26.6', U.mig2),
          q('m3l5-3', 'Astronomia: passagem meridiana do Sol', 2, 'Por que a longitude obtida só pelo instante da altura máxima é pouco precisa?',
            ['Porque o AHG não é tabelado com precisão.', 'Porque a altura do Sol varia muito pouco perto do meridiano, e um erro de 1 min no instante vale 15′ de longitude.', 'Porque o sextante não mede alturas altas.', 'Porque a longitude depende da latitude.'], 1,
            'Perto da culminação a altura é praticamente constante, então o instante exato da passagem é incerto em um ou dois minutos, e cada minuto de tempo vale 15′ de arco. O AHG é tabelado a 0,1′ (A); o sextante mede até 120° (C); a longitude pelo AHG não depende da latitude (D).',
            'Miguens, vol. II, item 26.6', U.mig2),
          q('m3l5-4', 'Astronomia: passagem meridiana do Sol', 3, 'Δa = +5,0′; o navio percorreu 12′ no rumo 120°; o azimute do Sol na manhã foi 060°. A distância Rd da reta transportada, em direção ao Sol, é:',
            ['+5,0′.', '+11,0′.', '−1,0′.', '+17,0′.'], 1,
            'Rd = Δa + d × cos(C − Az) = 5,0′ + 12′ × cos 60° = 5,0′ + 6,0′ = 11,0′. A alternativa A esquece o deslocamento; C subtrai 6,0′; D soma d inteiro sem projetar no azimute.',
            'Miguens, vol. II, cap. 29, item 29.1.1', U.mig2),
        ]),
        FT([mig2('cap. 26, itens 26.5 e 26.6 (longitude na passagem meridiana)'), mig2('cap. 29, item 29.1 (transporte de retas de posição; posição ao meio-dia)')]),
      ],
    },
    {
      id: 'l6', titulo: 'Treino final: dois blocos encadeados no estilo da prova', minutos: 15,
      objetivos: [
        'Resolver um bloco encadeado completo, com 8 questões, em ordem e com os anexos.',
        'Treinar os dois cenários mais comuns: Sol ao Norte, com latitude Sul, e nomes contrários, com latitude Norte.',
        'Encontrar o seu próprio padrão de erro.',
      ],
      blocos: [
        P('Hora de simular a prova. Use lápis e papel, sem calculadora, e <b>siga a sequência</b> da lição 1: cada questão alimenta a seguinte. Os dados do Almanaque e da Tábua A2 aparecem como extratos simulados, e o fuso você determina pela longitude. Reserve 20 a 25 minutos por bloco, que é mais ou menos o ritmo que a prova pede.'),
        SIM(),
        H('Bloco 1: Sol ao Norte, latitude Sul'),
        P('No dia <b>18 de março de 2026</b>, o veleiro “Maré Alta”, em travessia de Vitória (ES) para o Arquipélago de Fernando de Noronha, passando por fora do banco dos Abrolhos, preparou-se para determinar a posição astronômica na passagem meridiana do Sol (culminação). Para o cálculo prévio, considerou a posição estimada indicada abaixo. Observou o limbo inferior do Sol.'),
        B1_DADOS,
        B1_PAG,
        ANB_A2,
        ANB_DIP,
        CHK(B1_QS.concat([
          q('m3b1-8', 'Astronomia: passagem meridiana do Sol', 2, 'No instante da culminação, o azimute verdadeiro do Sol, na situação do bloco 1, é:',
            ['000°.', '045°.', '090°.', '180°.', '270°.'], 0,
            'Na passagem meridiana o azimute é 000° (Sol ao Norte) ou 180° (Sol ao Sul). Aqui a declinação (S 0° 47′) está mais ao Norte do que a latitude (17° S): o Sol passa ao Norte do zênite, azimute 000°. 090° e 270° seriam o Sol no nascer e no pôr; 045° não ocorre na culminação; 180° valeria para o Sol ao Sul.',
            'Miguens, vol. II, item 25.1', U.mig2, true),
          q('m3b1-9', 'Astronomia: passagem meridiana do Sol', 2, 'O erro instrumental (ei) do sextante é:',
            ['o erro de leitura do tambor do micrômetro, por falta de precisão do vernier.', 'o erro residual de paralelismo dos espelhos grande e pequeno, com a alidade em zero; deve ser determinado antes de cada série e aplicado com o seu sinal.', 'a diferença entre o horizonte visível e o verdadeiro, causada pela elevação do olho.', 'o desvio da agulha magnética transferido para o sextante.', 'o erro de perpendicularismo do espelho grande, que se corrige com a Tábua A2.'], 1,
            'O erro instrumental é o erro residual que sobra depois da retificação do paralelismo entre o espelho grande e o pequeno, com o índice em zero; determina-se de preferência antes de cada série e computa-se na altura verdadeira. A alternativa C é a depressão do horizonte (dp); a E mistura retificação e tábua; A e D não são erros do sextante nesse sentido.',
            'Miguens, vol. II, itens 21.2.7 b) e 22.2 a)', U.mig2),
        ]), 'Questões do bloco 1'),
        H('Bloco 2: nomes contrários, latitude Norte'),
        P('No dia <b>24 de novembro de 2026</b>, o veleiro “Calmaria”, em travessia de Mindelo (Cabo Verde) a Bridgetown (Barbados), preparou-se para a passagem meridiana do Sol. Considerou a posição estimada indicada abaixo, observou o limbo inferior e pretende também prever a altura instrumental.'),
        B2_DADOS,
        B2_PAG,
        ANB_A2,
        ANB_DIP,
        CHK(B2_QS.concat([
          q('m3b2-8', 'Astronomia: passagem meridiana do Sol', 2, 'Qual a conduta recomendada para observar a altura meridiana do Sol com o sextante?',
            ['Observar uma só vez, exatamente na hora legal calculada, com o sextante parado.', 'Começar cerca de 5 minutos antes da hora prevista, balancear o sextante, acompanhar o Sol até parar de subir e adotar a maior altura, anotando a hora.', 'Usar o limbo superior, que é mais nítido, e dispensar os filtros.', 'Esperar o Sol descer, para ter certeza da hora legal.', 'Inclinar o sextante para esconder o horizonte e ver melhor o Sol.'], 1,
            'A hora é prevista com aproximação, e a altura é quase constante junto ao meridiano: começa-se antes e adota-se a maior altura, balanceando para achar o vertical. A alternativa A depende de uma hora que é só estimada; C é perigosa (nunca se visa o Sol sem filtros; o limbo inferior é o preferido); D perde a culminação; E impede a colimação com o horizonte.',
            'Miguens, vol. II, itens 21.2.9 e 25.6', U.mig2),
        ]), 'Questões do bloco 2'),
        WID('reta-altura', { aba: 'latitude', modo: 'exercicio' }, 'Mais treino: o widget gera cenários completos (Almanaque simulado, posição estimada, sextante) e corrige a latitude e a longitude meridianas passo a passo.'),
        H('O que fazer com os erros'),
        P('Anote, para cada questão errada, a <b>causa</b>: sinal do fuso, hora inteira errada no Almanaque, correção d, ei, dp, coluna da A2, nome da latitude. Em geral cada pessoa erra sempre nas mesmas duas ou três coisas. Quando você as conhece, vira uma lista de conferência. Repita os blocos na semana seguinte e depois com o widget de exercícios da lição 2 e 3.'),
        C('dica', 'Bloco de verificação em 1 minuto', 'Antes de passar à questão seguinte, confira: (1) a hora legal fica perto das 12h? (2) a declinação tem o nome certo? (3) z + a = 90°? (4) a latitude fica perto da estimada? (5) a longitude é a estimada ± poucos minutos? Se um item falha, volte.'),
        FT([
          mig2('cap. 25, itens 25.3 a 25.6'), mig2('cap. 26, itens 26.5 e 26.6'),
          { txt: 'Provas do Capitão-Amador, DPC (para treinar com o ANB real)', url: U.provas, ref: 'programa-64' },
        ]),
      ],
    }
  );

  /* ==================================================================================================
     m4 — Além da prova: retas de altura e derrotas oceânicas (vai além do Anexo 5-A, 1.2; preparo para a travessia)
     ================================================================================================== */

  function INTL(b) { b.intl = true; return b; }

  var FIG_M4L1 = svg('0 0 440 330', 'Círculo de alturas iguais centrado no ponto subsolar, com a reta de altura tangente e a posição estimada a uma distância Δa dela',
    '<path d="M86 175 A190 190 0 0 0 354 175" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
    '<line x1="70" y1="230" x2="370" y2="230" ' + INK + ' stroke-width="2.5"/>' +
    '<line x1="220" y1="40" x2="220" y2="290" ' + INK + ' stroke-width="1.5" stroke-dasharray="5 4"/>' +
    '<circle cx="220" cy="40" r="9" fill="var(--magenta)"/>' +
    txt(236, 34, 'PG: ponto subsolar', { bold: true, fill: 'var(--magenta)' }) + txt(236, 54, '(o Sol está no zênite)', { size: 14 }) +
    '<circle cx="220" cy="282" r="6" fill="var(--ink)"/>' + txt(232, 296, 'PE: posição estimada', { size: 15 }) +
    '<path d="M214 100 L220 88 L226 100 Z" fill="var(--ink)"/>' + txt(204, 112, 'Az', { anchor: 'end', bold: true }) +
    '<line x1="170" y1="230" x2="170" y2="282" ' + INK + ' stroke-width="1.5"/><line x1="165" y1="230" x2="175" y2="230" ' + INK + ' stroke-width="1.5"/><line x1="165" y1="282" x2="175" y2="282" ' + INK + ' stroke-width="1.5"/>' +
    txt(160, 262, 'Δa', { anchor: 'end', bold: true }) +
    txt(380, 226, 'reta de altura', { anchor: 'end', size: 15 }) + txt(374, 160, 'círculo de alturas iguais', { anchor: 'end', size: 15 }) +
    txt(10, 322, 'Raio do círculo: z = 90° − Ho. Cada 1′ de arco é 1 milha.', { size: 14 }));

  var FIG_M4L3 = svg('0 0 440 270', 'Crepúsculos: depressão do centro do Sol de 0° a 18° abaixo do horizonte, com a faixa conveniente para o sextante entre 3° e 9°',
    '<rect x="150" y="20" width="270" height="48" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<rect x="150" y="68" width="270" height="48" fill="var(--sea-2)" stroke="var(--sea-3)"/>' +
    '<rect x="150" y="116" width="270" height="48" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<rect x="150" y="164" width="270" height="48" fill="var(--sea-3)" stroke="var(--sea-3)"/>' +
    '<rect x="150" y="44" width="270" height="48" fill="var(--magenta)" fill-opacity=".20" stroke="var(--magenta)" stroke-width="2.5"/>' +
    txt(10, 14, 'Centro do Sol', { size: 14 }) +
    txt(145, 24, '0°', { anchor: 'end' }) + txt(145, 72, '−6°', { anchor: 'end' }) + txt(145, 120, '−12°', { anchor: 'end' }) + txt(145, 168, '−18°', { anchor: 'end' }) +
    txt(145, 48, '−3°', { anchor: 'end', size: 14 }) + txt(145, 96, '−9°', { anchor: 'end', size: 14 }) +
    txt(405, 40, 'civil', { anchor: 'end' }) + txt(405, 112, 'náutico', { anchor: 'end' }) + txt(405, 160, 'astronômico', { anchor: 'end' }) +
    txt(405, 196, 'noite', { anchor: 'end' }) +
    txt(10, 236, 'Faixa magenta: horizonte visível e estrelas ao', { size: 14 }) + txt(10, 254, 'sextante (Sol de 3° a 9° abaixo do horizonte).', { size: 14 }) +
    '<line x1="150" y1="20" x2="420" y2="20" ' + INK + ' stroke-width="2"/>');

  var FIG_M4L4 = svg('0 0 440 300', 'Dois triângulos retângulos: o da navegação plana, com distância, Δφ e apartamento; e o de Mercator, com Δm e Δλ',
    '<path d="M60 250 L60 60 L200 250 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
    txt(50, 160, 'Δφ', { anchor: 'end', bold: true }) + txt(130, 272, 'apartamento', { anchor: 'middle', size: 15 }) + txt(142, 148, 'd', { bold: true, fill: 'var(--magenta)' }) +
    '<path d="M60 95 A35 35 0 0 0 80.8 88.2" fill="none" stroke="var(--magenta)" stroke-width="2.5"/>' + txt(66, 112, 'R', { bold: true, fill: 'var(--magenta)' }) +
    txt(10, 38, 'Estima (lat. média)', { bold: true, size: 15 }) +
    '<path d="M270 250 L270 60 L410 250 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
    txt(260, 160, 'Δm', { anchor: 'end', bold: true }) + txt(340, 272, 'Δλ', { anchor: 'middle', bold: true }) + txt(352, 148, 'd', { bold: true, fill: 'var(--magenta)' }) +
    '<path d="M270 95 A35 35 0 0 0 290.8 88.2" fill="none" stroke="var(--magenta)" stroke-width="2.5"/>' + txt(276, 112, 'R', { bold: true, fill: 'var(--magenta)' }) +
    txt(230, 38, 'Mercator', { bold: true, size: 15 }));

  M.push({
    id: 'm4', titulo: 'Além da prova: retas de altura e derrotas oceânicas',
    resumo: 'O que a prova não cobra, mas a travessia exige: a reta de altura de Marcq Saint-Hilaire, a posição por duas ou três retas, os crepúsculos e as estrelas, e as derrotas oceânicas: loxodrômica, ortodrômica e mista, e quando cada uma convém.',
    licoes: [
      {
        id: 'l1', titulo: 'A reta de altura: a ideia de Marcq Saint-Hilaire', minutos: 13,
        objetivos: [
          'Explicar o círculo de alturas iguais e por que ele vira uma reta na carta.',
          'Definir a diferença de alturas Δa e plotar a reta (“toward” ou “away”).',
          'Saber por que o método usa uma posição estimada (ou assumida).',
        ],
        blocos: [
          C('nota', 'Este módulo vai além do programa', 'O Anexo 5-A do Capitão-Amador cobra a passagem meridiana. Retas de altura e derrotas oceânicas <b>não são cobradas</b> no exame, mas são o que faz a navegação astronômica servir de verdade no mar: uma posição por estrelas no crepúsculo, ou uma reta do Sol em qualquer hora do dia. É também a base dos cursos RYA e ASA.'),
          P('A passagem meridiana só funciona perto do meio-dia. A <b>reta de altura</b> serve a qualquer hora e a qualquer astro. A ideia é simples e bonita.'),
          H('O círculo de alturas iguais'),
          P('Quando o Sol está a 60° de altura, ele está a z = 30° do zênite. Isso significa que você está a 30° de arco, 1.800 milhas, do <b>ponto subsolar (PG)</b>, o ponto da Terra que tem o Sol no zênite. Todos que medem 60° naquele instante estão sobre um <b>círculo</b> com centro no PG e raio z = 90° − a. É o <b>círculo de alturas iguais</b> (ou círculo de posição). A sua posição é um ponto desse círculo.'),
          P('Num círculo de 1.800 milhas de raio, um pedaço de poucas dezenas de milhas é praticamente uma reta, perpendicular à direção do PG: o <b>azimute</b> do astro. É a <b>reta de altura</b>.'),
          FIG(FIG_M4L1, 'O círculo de alturas iguais (magenta) é tangente à reta de altura (preta). A distância entre a posição estimada (PE) e a reta é a diferença de alturas Δa, medida sobre o azimute.'),
          H('O método da altura estimada'),
          P('O oficial da Marinha francesa Marcq Saint-Hilaire propôs, no século XIX, um jeito prático de plotar essa reta, que é o usado até hoje (método do <b>vertical estimado</b>, ou “do intercepto”):'),
          L([
            'Meça a altura do astro e anote a hora (HMG). Corrija a altura: obtém-se a <b>altura verdadeira observada (Ho)</b>.',
            'Escolha uma <b>posição estimada (ou assumida)</b> e, com o Almanaque, calcule a <b>altura calculada (Hc)</b> e o <b>azimute (Az)</b> que o astro teria <i>nessa posição</i>. (Lição seguinte.)',
            'Calcule a <b>diferença de alturas</b>: <b>Δa = Ho − Hc</b>, em minutos de arco (= milhas).',
            'Na carta, a partir da posição estimada, trace o azimute <b>em direção ao astro</b>. Marque Δa milhas: <b>em direção ao astro (toward) se Δa for positiva</b>; <b>no sentido contrário (away) se for negativa</b>.',
            'Por esse ponto, trace a <b>perpendicular ao azimute</b>: é a reta de altura. Você está sobre ela.',
          ], true),
          C('dica', 'Para não trocar toward e away', 'Se você mediu uma altura <b>maior</b> do que a calculada, o astro está mais alto: você está <b>mais perto</b> do ponto subsolar, então a reta fica na direção dele (toward). Se mediu <b>menos</b>, está mais longe (away). Em inglês, a regra costuma ser decorada como “Ho Mo To”: Ho more than Hc, toward.'),
          P('<b>Exemplo.</b> Na lição 5 do módulo 3, Ho = 32° 27,4′ e Hc = 32° 35,6′, e Az = 068,4°. Δa = −8,2′: a reta fica 8,2 milhas a partir da posição estimada, na direção oposta ao Sol, isto é, rumo 248,4°, e é perpendicular a 068,4° (direção 158,4°/338,4°).'),
          P('Por que usar uma posição estimada em vez de calcular a posição direto? Porque o triângulo de posição, para a posição verdadeira, não pode ser resolvido sem saber onde você está. O método contorna: calcula para um ponto <i>perto</i> e corrige pela diferença de alturas. Se a estimada estiver a algumas dezenas de milhas, a aproximação “reta” é excelente.'),
          WID('reta-altura', { aba: 'reta' }, 'Calcule e plote uma reta de altura. Mude a posição estimada e veja a reta não mudar: só o ponto determinativo se move sobre ela.'),
          INTL(FATO('internacional-18', 'O RYA Yachtmaster Ocean Theory tem 40 h mais exame e cobre navegação astronômica, sextante, meteorologia mundial e planejamento oceânico; pode ser feito online.')),
          INTL(FATO('internacional-139', 'O ASA 107 ensina navegação pelo Sol, pela Lua, pelas estrelas e pelos planetas: uso do sextante, correções de altura e plotagem de retas de altura.')),
          CHK([
            q('m4l1-1', 'Astronomia: retas de altura', 1, 'Qual o raio, em milhas, do círculo de alturas iguais quando a altura verdadeira do Sol é 60°?',
              ['60.', '900.', '1.800.', '5.400.'], 2,
              'Raio = z = 90° − 60° = 30° de arco; como 1° = 60′ = 60 milhas, são 1.800 milhas. A alternativa A é a altura, em graus; B é z em minutos pela metade; D é 90° em milhas.',
              'Miguens, vol. II, item 27.2', U.mig2),
            q('m4l1-2', 'Astronomia: retas de altura', 2, 'Em que direção se plota a reta de altura em relação ao azimute do astro?',
              ['Paralela ao azimute.', 'Perpendicular ao azimute.', 'A 45° do azimute.', 'Na direção do Norte verdadeiro.'], 1,
              'A reta de altura é a tangente ao círculo de alturas iguais, e a tangente é perpendicular ao raio, isto é, à direção do astro (o azimute). Paralela ao azimute (A) seria a própria direção do astro.',
              'Miguens, vol. II, item 27.4', U.mig2),
            q('m4l1-3', 'Astronomia: retas de altura', 2, 'Ho = 45° 10,0′ e Hc = 45° 16,5′. O que se faz com Δa?',
              ['Δa = +6,5′: marca-se 6,5′ em direção ao astro.', 'Δa = −6,5′: marca-se 6,5′ afastando-se do astro.', 'Δa = +6,5′: marca-se 6,5′ afastando-se.', 'Δa = −6,5′: marca-se 6,5′ em direção ao astro.'], 1,
              'Δa = Ho − Hc = 45° 10,0′ − 45° 16,5′ = −6,5′. Altura observada menor que a calculada: o observador está mais longe do astro (away), então a reta fica 6,5′ no sentido oposto ao azimute. As outras trocam o sinal ou o sentido.',
              'Miguens, vol. II, item 27.5', U.mig2),
          ]),
          FT([mig2('cap. 27, itens 27.1 a 27.6 (linha de posição astronômica ou reta de altura)'), bow('cap. “Sight Reduction” (intercept method)')]),
        ],
      },
      {
        id: 'l2', titulo: 'Calculando a reta de altura', minutos: 13,
        objetivos: [
          'Calcular Hc e Az pelas fórmulas e entender como as tábuas fazem o mesmo.',
          'Passar do azimute calculado ao azimute verdadeiro conforme o lado do astro.',
          'Conhecer as fontes de erro de uma reta de altura.',
        ],
        blocos: [
          P('Para plotar a reta você precisa de Hc e Az: a altura e o azimute que o astro teria na posição estimada, no instante da observação. Eles saem do triângulo de posição.'),
          H('Os dados e as fórmulas'),
          L([
            'Da observação: <b>HMG</b>, para entrar no Almanaque. Dele saem <b>AHG</b> e <b>Dec</b> do astro (módulo 2).',
            'Da posição estimada: <b>φ</b> e <b>λ</b>. Calcule <b>AHL = AHG − λ (W)</b> ou <b>AHG + λ (E)</b>.',
            '<b>sen Hc = sen φ · sen δ + cos φ · cos δ · cos AHL</b> (φ e δ com sinal, N positivo).',
            '<b>cos Z = (sen δ − sen φ · sen Hc) ÷ (cos φ · cos Hc)</b>, Z entre 0° e 180°.',
            '<b>Azimute verdadeiro</b>: se AHL &lt; 180° (astro a Oeste), <b>Az = 360° − Z</b>; se AHL &gt; 180° (astro a Leste), <b>Az = Z</b>.',
          ]),
          H('Exemplo resolvido'),
          P('Dados da lição 5 do módulo 3: φ = 09° 57,0′ S (−9,95°), λ = 031° 09,0′ W; HMG 10h 30m de 22/04/2026 (extrato simulado): AHG = 337° 52,0′, Dec = N 12° 16,5′.'),
          TB(['Passo', 'Cálculo', 'Resultado'], [
            ['AHL', '337° 52,0′ − 031° 09,0′', '306° 43,0′ (astro a Leste)'],
            ['sen φ · sen δ', '(−0,17279) × (0,21260)', '−0,03674'],
            ['cos φ · cos δ · cos AHL', '(0,98496) × (0,97714) × (0,59786)', '+0,57540'],
            ['sen Hc', '−0,03674 + 0,57540', '0,53867'],
            ['<b>Hc</b>', 'arcsen 0,53867', '<b>32° 35,6′</b>'],
            ['cos Z', '(0,21260 − (−0,17279) × 0,53867) ÷ (0,98496 × 0,84252)', '0,36836 → Z = 68,4°'],
            ['<b>Az</b>', 'AHL &gt; 180°: Az = Z', '<b>068,4°</b>'],
          ]),
          P('Com Ho = 32° 27,4′, Δa = −8,2′. É a reta que vimos na lição anterior.'),
          H('E as tábuas?'),
          P('Antes das calculadoras, o navegante usava tábuas, que são o mesmo triângulo resolvido de antemão para todas as combinações de latitude, declinação e ângulo horário. No Brasil, segundo o Manual de Navegação da Marinha (Vol. II, revisão de 2021), os navios da MB usam, na navegação astronômica, apenas a <b>Tábua Radler</b>, da publicação DN4-2 (<i>Tábuas para Navegação Astronômica</i>, DHN).'),
          FATO('tecnico-194', 'Segundo o Manual de Navegação da Marinha do Brasil, Vol. II (1ª Revisão, 2021, cap. 28, item 28.1), os navios da MB empregam, na navegação astronômica, unicamente a “Tábua Radler para Navegação Astronômica”, contida na publicação DN4-2 “Tábuas para Navegação Astronômica”, da DHN.'),
          P('A Radler divide o triângulo em dois triângulos retângulos, baixando de A uma perpendicular ao meridiano do observador. Entra-se com a <b>declinação</b> e o <b>ângulo no polo t₁</b> e obtém-se dois números, <b>a</b> e <b>b</b>; combina-se <b>b</b> com a latitude para formar <b>C</b> (soma ou diferença, conforme os nomes e o valor de t₁); entra-se de novo com <b>a</b> e <b>C</b> e lê-se a altura tabular e o azimute quadrantal. Para facilitar, escolhe-se uma <b>longitude assumida</b> que dê AHL em graus inteiros e uma <b>latitude assumida</b> que dê C inteiro.'),
          C('dica', 'Hoje: calculadora, aplicativo ou programa', 'Calculadoras científicas e aplicativos resolvem as duas fórmulas acima. Conheça o método das tábuas (ele não faz parte do programa do Anexo 5-A, item 1.2, mas é o seu plano B sem eletrônica), mas, para a travessia, tenha pelo menos uma calculadora com as fórmulas e uma tábua impressa de reserva.'),
          H('De onde vêm os erros'),
          L([
            '<b>Hora</b>: 4 segundos de erro deslocam a reta em 1′ (módulo 1).',
            '<b>Erro instrumental</b> mal determinado e <b>elevação do olho</b> errada (dp).',
            '<b>Horizonte</b> mal definido (nevoeiro, ondas, falso horizonte à noite) e <b>refração anormal</b> com altura baixa (abaixo de 15°: não observe).',
            '<b>Erro de balanço</b> do sextante: altura medida fora do vertical é sempre maior.',
            '<b>Erro de conta</b>: sinal da declinação, AHL fora de 0–360°, Δa com sinal trocado.',
          ]),
          WID('reta-altura', { aba: 'reta', modo: 'exercicio' }, 'Gere exercícios de reta de altura: o gabarito mostra AHL, Hc, Az e Δa passo a passo.'),
          CHK([
            q('m4l2-1', 'Astronomia: retas de altura', 2, 'φ = 0°, δ = 0° e AHL = 60°. Qual a altura calculada (Hc)?',
              ['0°.', '30°.', '60°.', '90°.'], 1,
              'sen Hc = sen 0° · sen 0° + cos 0° · cos 0° · cos 60° = 0,5, logo Hc = 30°. (Um astro sobre o equador, visto do equador, sobe 15° por hora: 4 horas depois da culminação, 60° de AHL, restam 30° de altura.)',
              'Miguens, vol. II, item 27.6.2', U.mig2),
            q('m4l2-2', 'Astronomia: retas de altura', 2, 'O AHL de um astro é 250°. O astro está a Leste ou a Oeste do meridiano e como se obtém o azimute?',
              ['A Oeste; Az = 360° − Z.', 'A Leste; Az = Z.', 'A Leste; Az = 360° − Z.', 'A Oeste; Az = Z.'], 1,
              'AHL maior que 180° significa que o astro ainda não chegou ao meridiano superior: está a Leste, e o azimute é o próprio Z (entre 0° e 180°). Com AHL menor que 180°, o astro está a Oeste e Az = 360° − Z.',
              'Miguens, vol. II, itens 18.2 e 27.6.2', U.mig2),
            q('m4l2-3', 'Astronomia: retas de altura', 2, 'Qual das fontes de erro abaixo desloca a reta de altura em exatamente 1′ para cada 4 segundos?',
              ['Erro do relógio na hora da observação.', 'Elevação do olho errada em 1 m.', 'Refração anormal.', 'Erro de arredondamento da declinação.'], 0,
              '15′ de arco valem 1 minuto de tempo; 4 s de tempo valem 1′ de arco. O erro do relógio desloca o AHG nessa proporção. Os outros erros não têm essa relação fixa.',
              'Miguens, vol. II, item 19.4.1', U.mig2),
          ]),
          FT([mig2('cap. 27, item 27.6 (cálculo dos elementos da reta de altura)'), mig2('cap. 28, itens 28.1 e 28.2 (Tábua Radler)'), { txt: 'Publicações da DHN: Almanaque Náutico e DN4-2', url: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes', ref: 'tecnico-194' }]),
        ],
      },
      {
        id: 'l3', titulo: 'Posição por duas ou mais retas: Sol, crepúsculos e estrelas', minutos: 14,
        objetivos: [
          'Obter a posição pelo cruzamento de retas e escolher bem o espaçamento em azimute.',
          'Definir crepúsculo civil, náutico e astronômico e achar a faixa de observação das estrelas.',
          'Montar uma rotina diária simples com o Sol e as estrelas.',
        ],
        blocos: [
          H('Duas retas dão uma posição, três dão confiança'),
          P('Uma reta de altura é uma linha. Duas retas, de astros diferentes, se cruzam num ponto: a posição. Mas duas retas sempre se cruzam, e você não percebe se alguma tem erro. Por isso o Manual recomenda sempre que possível <b>três retas</b>.'),
          L([
            '<b>Duas retas</b>: o ângulo de cruzamento ideal é 90°, isto é, astros com <b>azimutes separados por 90°</b>. Com 30° de separação, o erro máximo da posição é cerca de <b>2,7 vezes maior</b>. Não observe dois astros com diferença de azimute menor que 30°.',
            '<b>Três retas</b>: astros igualmente espaçados no horizonte, com <b>azimutes a cerca de 120°</b> uns dos outros (retas a 60°). Assim, um erro sistemático nas alturas não desloca o centro do triângulo.',
            '<b>Observações sucessivas</b>: se o navio se deslocou mais que uns 1′ entre a primeira e a última observação, transporte as retas anteriores para o instante da última (como na lição 5 do módulo 3).',
          ]),
          H('O Sol ao longo do dia'),
          P('Com o Sol sozinho, a rotina clássica do dia é: <b>reta da manhã</b> (Sol longe do meridiano, bom ângulo com a de meio-dia); <b>latitude meridiana</b> ao meio-dia; <b>reta da tarde</b>. Transportam-se as retas para o instante da última e obtém-se uma posição “ao meio-dia verdadeiro” e outra no fim da tarde. É uma posição de baixo custo (só o Sol, o relógio e o sextante).'),
          H('Os crepúsculos'),
          P('As estrelas só aparecem ao sextante quando o céu escurece o suficiente, mas o horizonte ainda precisa estar visível. A janela é estreita: os crepúsculos.'),
          L([
            '<b>Crepúsculo civil</b>: do pôr do Sol (limbo superior tangente ao horizonte) até o instante em que o centro do Sol está 6° abaixo do horizonte. Os planetas e as estrelas mais brilhantes aparecem, e o horizonte está bem definido.',
            '<b>Crepúsculo náutico</b>: na definição da DHN (Manual de Navegação, Vol. II, item 24.3), vai do pôr do Sol até o instante em que o centro do Sol está 12° abaixo do horizonte, ou seja, inclui o civil (de manhã, vai dos 12° até o nascer). Muitas publicações estrangeiras chamam de náutico só a faixa de 6° a 12°. Nos instantes tabulados do fim do náutico, o horizonte normalmente está invisível, escuro demais para o sextante.',
            '<b>Crepúsculo astronômico</b>: de 12° a 18° abaixo. Sem utilidade prática para a navegação: o céu já está quase tão escuro quanto de noite.',
          ]),
          FIG(FIG_M4L3, 'Os crepúsculos pela depressão do centro do Sol. A faixa conveniente ao sextante, com horizonte visível e estrelas, fica entre 3° e 9° abaixo do horizonte: centrada no instante do crepúsculo civil.'),
          P('O Almanaque tabela, por latitude, o <b>início do crepúsculo civil matutino</b>, o <b>nascer do Sol</b>, o <b>pôr do Sol</b> e o <b>fim do civil vespertino</b>. O <b>período conveniente</b> para observar tem a duração da diferença entre o crepúsculo civil e o nascer (ou o pôr) do Sol, <b>centrado no instante do crepúsculo civil</b>. Exemplo do Manual (Rio de Janeiro, 6/11/2019): início do civil 04h 40m e nascer 05h 05m, diferença de 25 min; a faixa é de 04h 28m a 04h 52m. À tarde: pôr 18h 09m e fim do civil 18h 33m (24 min), faixa de 18h 21m a 18h 45m.'),
          TB(['Latitude e data', 'Civil', 'Náutico', 'Astronômico'], [
            ['0°, equinócio', '21 min', '24 min', '24 min'],
            ['23° S, equinócio', '22 min', '26 min', '26 min'],
            ['35° S, equinócio', '25 min', '29 min', '30 min'],
            ['35° S, solstício de junho', '28 min', '32 min', '31 min'],
            ['35° S, solstício de dezembro', '30 min', '37 min', '41 min'],
          ], 'Duração, em minutos, de cada etapa do crepúsculo vespertino (do pôr do Sol ao fim do civil; do fim do civil ao fim do náutico; e assim por diante), calculada por fórmula para este curso. Quanto mais longe do equador, mais longos.'),
          H('Preparar o céu e observar'),
          L([
            '<b>Prepare o céu</b> antes: com o Almanaque, o identificador de estrelas (<i>Star Finder</i>) ou um aplicativo, liste 4 a 6 astros bem espaçados em azimute, com altura entre cerca de 30° e 60°. Com o azimute e a altura previstos, você acha a estrela no sextante antes de vê-la a olho nu.',
            'Evite alturas <b>menores que 15°</b> (refração incerta) ou <b>maiores que 60–70°</b> (difícil achar o vertical).',
            'À tarde, observe <b>cedo</b> e comece pelos astros do <b>Leste</b>, pois o horizonte do Leste escurece primeiro. De manhã, comece pelos astros <b>mais fracos</b>, que somem primeiro, e pelos do Leste.',
            'Tome <b>3 ou 5 alturas</b> de cada astro, rapidamente, e use a média das alturas e das horas. Mais do que isso cansa o olho e o braço, e não melhora a média.',
            'Verifique o <b>erro instrumental</b> antes da série (pelo horizonte) e retifique se passar de 3,0′.',
            'Com mar grosso, observe do ponto <b>mais alto</b> do barco; com bruma e horizonte curto, do <b>mais baixo</b>.',
          ]),
          WID('esfera-celeste', { lat: -23, vista: 'observador', astro: 'acrux', hora: 19 }, 'O céu do observador no crepúsculo: escolha estrelas e veja altura e azimute. Acrux e as outras do Cruzeiro do Sul são ótimas para o hemisfério Sul.'),
          INTL(FATO('internacional-44', 'Para o Yachtmaster Ocean, o RYA exige ter feito navegação astronômica no mar, no mínimo meridiana (sun-run-sun) e verificação da agulha por astro.')),
          CHK([
            q('m4l3-1', 'Astronomia: retas de altura', 1, 'Qual o espaçamento em azimute ideal para três astros observados nos crepúsculos?',
              ['Todos no mesmo azimute.', 'Cerca de 120° entre eles.', 'Cerca de 10° entre eles.', 'Dois no Norte e um no Sul.'], 1,
              'Com azimutes espaçados de 120°, as retas se cruzam a 60° e os erros sistemáticos nas alturas não deslocam o centro do triângulo. Astros no mesmo azimute (A) ou muito juntos (C) dão retas quase paralelas, que se cruzam mal.',
              'Miguens, vol. II, item 29.6.4', U.mig2),
            q('m4l3-2', 'Astronomia: retas de altura', 2, 'O centro do Sol está 8° abaixo do horizonte. Em que etapa do crepúsculo vespertino estamos e é possível usar o sextante nas estrelas?',
              ['Crepúsculo civil, e é impossível usar o sextante.', 'Crepúsculo náutico; é possível, pois o horizonte ainda é visível (depressão entre 3° e 9°).', 'Crepúsculo astronômico; é a melhor hora.', 'Noite; não há mais horizonte.'], 1,
              'Com o Sol 8° abaixo, já passou o fim do crepúsculo civil (6°) e ainda não acabou o náutico (12°): estamos no crepúsculo náutico, na definição da DHN e na dos almanaques estrangeiros. As estrelas são observáveis com o Sol entre 3° e 9° abaixo, e o horizonte só desaparece com depressão maior que 9°; aos 8° ainda há horizonte útil.',
              'Miguens, vol. II, itens 24.3 e 29.7', U.mig2),
            q('m4l3-3', 'Astronomia: retas de altura', 2, 'Em geral, por que se evita observar estrelas com altura menor que 15°?',
              ['Porque as estrelas ficam muito brilhantes.', 'Por causa da refração anormal e incerta perto do horizonte.', 'Porque o sextante não mede alturas pequenas.', 'Porque a posição estimada não é conhecida.'], 1,
              'Perto do horizonte a refração é grande e muda com a temperatura e a pressão, o que gera erros na altura. O sextante mede alturas pequenas (C), mas os valores não são confiáveis.',
              'Miguens, vol. II, item 21.2.9', U.mig2),
            q('m4l3-4', 'Astronomia: retas de altura', 2, 'No Rio de Janeiro, o início do crepúsculo civil da manhã é 04h 40m e o nascer do Sol, 05h 05m. A faixa recomendada para observar vai de:',
              ['04h 28m a 04h 52m.', '04h 40m a 05h 05m.', '04h 15m a 04h 40m.', '05h 05m a 05h 30m.'], 0,
              'O período conveniente dura a diferença entre o crepúsculo civil e o nascer (25 min) e é centrado no instante do início do civil: 04h 40m ± 12m = 04h 28m a 04h 52m. A alternativa B é só o período entre os dois eventos; C e D estão deslocadas.',
              'Miguens, vol. II, item 24.5', U.mig2),
          ]),
          FT([mig2('cap. 24, itens 24.3 a 24.5 (crepúsculos)'), mig2('cap. 29, itens 29.6 e 29.7 (retas múltiplas; recomendações nos crepúsculos)'), mig2('cap. 30 (identificação de astros e preparo do céu)')]),
        ],
      },
      {
        id: 'l4', titulo: 'Derrotas: estima, latitude média e latitudes crescidas', minutos: 13,
        objetivos: [
          'Calcular rumo e distância pela navegação estimada com a latitude média.',
          'Aplicar o método das latitudes crescidas (Mercator) à derrota loxodrômica.',
          'Escolher o método conforme o tamanho da perna.',
        ],
        blocos: [
          P('Uma <b>derrota</b> é o caminho que o navio segue. A <b>loxodrômica</b> é a que mantém o <b>rumo constante</b>: ela corta todos os meridianos no mesmo ângulo. Na carta de Mercator é uma <b>reta</b>, e é por isso que foi essa carta que ganhou os mares. Na Terra, é uma espiral que se aproxima dos polos. O barco com piloto automático em rumo fixo faz uma loxodrômica.'),
          H('Pernas curtas: a latitude média'),
          P('Numa perna curta ou perto do equador, a Terra é “plana” o suficiente. A diferença de latitude Δφ é um deslocamento Norte-Sul em milhas (1′ = 1 milha). Para o deslocamento Leste-Oeste, é preciso converter a diferença de longitude em milhas: o <b>apartamento</b>, que encolhe com o cosseno da latitude, porque os meridianos convergem.'),
          L([
            'Δφ = φ₂ − φ₁ (′, Norte positivo) e Δλ = λ₂ − λ₁ (′, Leste positivo, pelo caminho mais curto).',
            '<b>Apartamento</b> = Δλ × cos φm, com φm = (φ₁ + φ₂) ÷ 2.',
            '<b>tan R = apartamento ÷ Δφ</b> e <b>d = √(Δφ² + apartamento²)</b>, ou d = Δφ ÷ cos R.',
            'O ângulo R é quadrantal (do Norte ou do Sul para Leste ou Oeste): NE = R; SE = 180° − R; SW = 180° + R; NW = 360° − R.',
          ]),
          H('Pernas longas: as latitudes crescidas'),
          P('Na carta de Mercator, a escala de latitude cresce com a latitude. Os pontos têm “latitudes crescidas” m (em minutos), que em vez de Δφ definem o deslocamento N-S da carta. Para a esfera:'),
          P('<b>m = 7915,7045 × log tan (45° + φ/2)</b> (minutos; logaritmo decimal, Sul negativo)'),
          P('As tábuas de latitudes crescidas e os programas dão o valor, com o elipsoide da Terra. O rumo e a distância saem do triângulo de Mercator:'),
          P('<b>tan R = Δλ ÷ Δm</b> &nbsp; e &nbsp; <b>d = Δφ ÷ cos R</b>'),
          FIG(FIG_M4L4, 'À esquerda, o triângulo da estima (apartamento como cateto horizontal). À direita, o de Mercator: o cateto vertical é Δm, a diferença de latitudes crescidas, e o horizontal é Δλ. O ângulo R e a distância são calculados da mesma forma.'),
          H('Exemplo: Natal a Mindelo'),
          P('De Natal (5° 45,0′ S, 35° 10,0′ W) a Mindelo, em Cabo Verde (16° 54,0′ N, 25° 05,0′ W):'),
          TB(['', 'Latitude média', 'Latitudes crescidas'], [
            ['Δφ', '5° 45′ S → 16° 54′ N = 1.359,0′ N', 'idem'],
            ['Δλ', '10° 05′ E = 605,0′ E', 'idem'],
            ['Valores de m', '—', 'm₁ = −345,6′; m₂ = +1.029,0′; Δm = 1.374,6′'],
            ['Apartamento / tan R', 'φm = 5,575° N; 605,0′ × 0,99527 = 602,1′; tan R = 602,1 ÷ 1.359,0 = 0,4430', 'tan R = 605,0 ÷ 1.374,6 = 0,4401'],
            ['Rumo (NE)', '<b>023,9°</b>', '<b>023,8°</b>'],
            ['Distância', '√(1.359,0² + 602,1²) = <b>1.486,4 milhas</b>', '1.359,0 ÷ cos 23,8° = <b>1.484,8 milhas</b>'],
          ], 'Natal–Mindelo: a latitude média erra a distância em 1,6 milha (0,1%). Para os fins da navegação, são equivalentes. A 6 nós, são 247 horas, cerca de 10 dias e 7 horas.'),
          P('Na perna <b>Rio de Janeiro a Cidade do Cabo</b> (22° 57′ S, 43° 09′ W a 33° 51′ S, 18° 24′ E), a latitude média dá 3.313,7 milhas; as latitudes crescidas, 3.306,1: 7,6 milhas de diferença, 0,2%. A latitude média perde precisão quando a perna é longa em longitude e a latitude é alta. Perto dos polos, nunca a use.'),
          C('seguranca', 'Lembretes', 'Longitude: use sempre o caminho mais curto (Δλ no máximo 180°). Nunca confunda o rumo calculado (quadrantal) com o rumo verdadeiro. E lembre-se de que o rumo calculado é <b>verdadeiro</b>: para o leme, converta em rumo da agulha com a declinação e o desvio (curso de Mestre-Amador).'),
          WID('derrota-calc', { aba: 'estima', abas: ['estima', 'derrotas', 'exercicios'], exercicio: 'estima' }, 'Calcule rumo e distância pela latitude média e pelas latitudes crescidas e compare. A aba de exercícios gera problemas com correção passo a passo.'),
          CHK([
            q('m4l4-1', 'Derrotas', 1, 'A derrota loxodrômica é aquela em que:',
              ['A distância é a mínima possível.', 'O rumo é constante.', 'O navio segue um círculo máximo.', 'A latitude é constante.'], 1,
              'A loxodrômica corta os meridianos sempre no mesmo ângulo, isto é, mantém o rumo constante, e é uma reta na carta de Mercator. A distância mínima (A) e o círculo máximo (C) são da ortodrômica; latitude constante (D) é só o caso particular de rumo 090° ou 270°, um paralelo.',
              'Miguens, vol. II, item 33.2', U.mig2),
            q('m4l4-2', 'Derrotas', 2, 'Δφ = 1.200′ N e Δλ = 600′ E, com latitude média de 30° (cos 30° = 0,866). Qual o rumo pela latitude média?',
              ['026,6°.', '023,4°.', '030,0°.', '045,0°.'], 1,
              'Apartamento = 600′ × 0,866 = 519,6′; tan R = 519,6 ÷ 1.200 = 0,433 e R = 23,4° (NE, 023,4°). A alternativa A esquece de multiplicar Δλ pelo cosseno (tan R = 0,5); C e D não decorrem da conta.',
              'Miguens, vol. II, item 33.4', U.mig2),
            q('m4l4-3', 'Derrotas', 2, 'Natal–Mindelo: Δφ = 1.359,0′ e R = 023,8° (cos R = 0,9153). A distância loxodrômica é:',
              ['1.359,0 × 0,9153 = 1.243,9 milhas.', '1.359,0 ÷ 0,9153 = 1.484,8 milhas.', '1.359,0 + 605,0 = 1.964,0 milhas.', '605,0 ÷ 0,9153 = 661,0 milhas.'], 1,
              'No triângulo de Mercator, d = Δφ ÷ cos R, pois Δφ é o cateto adjacente ao ângulo R e d, a hipotenusa. Multiplicar (A) daria um cateto menor; somar os catetos (C) não é uma distância; dividir Δλ (D) mistura unidades.',
              'Miguens, vol. II, item 33.5', U.mig2),
            q('m4l4-4', 'Derrotas', 2, 'Por que a distância em milhas entre dois pontos pela diferença de longitude exige o cosseno da latitude?',
              ['Porque os paralelos ficam menores em direção aos polos, e 1′ de longitude vale menos de 1 milha fora do equador.', 'Porque a Terra é um elipsoide.', 'Porque o Sol varia a declinação.', 'Porque o rumo muda.'], 0,
              'Os meridianos convergem para os polos, então o comprimento de 1° de longitude diminui com o cosseno da latitude. Só no equador 1′ de longitude é 1 milha. A forma elipsoidal (B) é um refinamento menor.',
              'Miguens, vol. II, item 33.4', U.mig2),
          ]),
          FT([mig2('cap. 33, itens 33.1 a 33.5 (derrota loxodrômica, estimada composta, latitudes crescidas)'), bow('cap. “The Sailings”: plane, traverse and Mercator sailing')]),
        ],
      },
      {
        id: 'l5', titulo: 'Ortodrômica x loxodrômica: quando cada uma convém', minutos: 14,
        objetivos: [
          'Descrever a ortodrômica (círculo máximo), seu vértice e a variação de rumo.',
          'Calcular quanto se economiza e quando a diferença importa.',
          'Entender a derrota mista e por que, num veleiro, o vento manda mais que a geometria.',
        ],
        blocos: [
          P('A <b>ortodrômica</b> é o arco de <b>círculo máximo</b> entre dois pontos: o caminho <b>mais curto</b> sobre a esfera. Para andar por ela, o rumo vai mudando continuamente: o rumo inicial é diferente do final. Na carta de Mercator ela é uma <b>curva</b>, que se afasta da reta e “abraça” o polo mais próximo.'),
          H('As fórmulas'),
          L([
            'Distância: <b>cos d = sen φ₁ · sen φ₂ + cos φ₁ · cos φ₂ · cos Δλ</b> (d em graus; × 60 = milhas).',
            'Rumo inicial: <b>tan Ri = sen Δλ ÷ (cos φ₁ · tan φ₂ − sen φ₁ · cos Δλ)</b>.',
            '<b>Vértice</b>: o ponto de maior latitude da derrota, onde ela corta o meridiano em ângulo reto (rumo 090° ou 270°): cos φv = cos φ₁ · sen Ri.',
          ]),
          P('A rotina na prática: calcule a ortodrômica e depois <b>seus pontos intermediários</b>, por exemplo a cada 10° de longitude, e navegue em <b>loxodrômicas curtas</b> entre eles, que é fácil para o piloto automático. Os plotters e os ECDIS fazem isso para você.'),
          H('Quanto se ganha?'),
          TB(['Perna', 'Ortodrômica', 'Loxodrômica', 'Diferença'], [
            ['Natal a Mindelo', '1.484,8 milhas', '1.484,8', '0,0'],
            ['Mindelo a Granada', '2.150,8', '2.153,2', '2,4'],
            ['Antígua a Horta (reta direta)', '2.162,5', '2.169,5', '7,0'],
            ['Las Palmas a Rodney Bay', '2.670,7', '2.680,6', '9,9'],
            ['Rio de Janeiro a Cidade do Cabo', '3.266,5', '3.306,1', '39,6'],
            ['Boa Esperança a Tasmânia', '5.302,8', '5.969,4', '666,6'],
          ], 'Distâncias em milhas, Terra esférica, calculadas com o widget de derrotas deste curso (pontos nos portos de partida e chegada). A loxodrômica nunca é mais curta que a ortodrômica.'),
          P('O padrão é claro. A diferença é <b>nula ao longo de um meridiano e do equador</b> e cresce com a <b>latitude</b> e com a <b>extensão em longitude</b>. Na travessia do Atlântico entre Cabo Verde e o Caribe ou entre as Canárias e Santa Lúcia, a diferença é de poucas milhas em milhares. Rio a Cidade do Cabo já poupa 40 milhas, mais de 6 horas a 6 nós. Nos oceanos austrais, a economia é de centenas de milhas, mas o círculo máximo pode levar o navio a latitudes de gelo e temporal.'),
          H('A derrota mista'),
          P('Para aproveitar a ortodrômica sem ir longe demais, fixa-se uma <b>latitude limite</b>. A derrota mista tem três trechos: uma <b>ortodrômica</b> até a latitude limite, um trecho ao longo do <b>paralelo</b> (loxodrômica, rumo 090° ou 270°) e outra <b>ortodrômica</b> até o destino. No exemplo da figura, a ortodrômica de Boa Esperança à Tasmânia chegaria ao vértice a cerca de 62° S, um absurdo para um veleiro. Com limite de 45° S, a derrota mista fica em 5.676,7 milhas: 373,9 milhas a mais que a ortodrômica pura, mas 292,7 milhas a menos que a loxodrômica.'),
          FIG(FIG_M4L5, 'Carta de Mercator entre o Cabo da Boa Esperança e a Tasmânia. A loxodrômica (preta) é reta; a ortodrômica (magenta) se curva em direção ao polo; a mista com limite de 45° S (pontilhada) usa o círculo máximo até o limite, segue o paralelo e volta a um círculo máximo.'),
          WID('globo-rotas', { preset: 'rio-cabo', ventos: true }, 'No globo, a ortodrômica parece “reta” e a loxodrômica, curva. Compare as duas e ligue a camada de ventos para ver por que o vento decide a derrota.'),
          H('O vento manda mais que a geometria'),
          P('Num veleiro, a derrota de verdade é decidida pelo <b>vento</b>, pelas <b>correntes</b>, pelos <b>sistemas meteorológicos</b> e pelo limite de segurança do barco. O alísio manda na rota para o Caribe; as altas pressões e os sistemas frontais mandam nas latitudes médias. A ortodrômica serve de <b>referência</b>: ela diz o quanto de “estrada” o seu trajeto desperdiça em relação ao mínimo. O planejamento usa as <b>Cartas Piloto</b> e a previsão (módulo de travessia), e a geometria ajuda a definir os pontos de passagem e a estimar prazos.'),
          L([
            'Use a <b>ortodrômica</b> (ou a mista) em pernas longas, em latitudes médias e altas, e quando o vento permitir seguir perto dela.',
            'Use a <b>loxodrômica</b> em pernas curtas, perto do equador ou ao longo de meridianos, e quando o piloto automático ou o vento pedem rumo fixo.',
            'Defina <b>latitudes limite</b> e <b>pontos de passagem</b> a cada 10° de longitude, e aceite que o vento os deslocará.',
          ]),
          INTL(FATO('internacional-41', 'O RYA Yachtmaster Ocean exige uma passagem qualificante de pelo menos 600 milhas, das quais ao menos 200 a mais de 50 milhas de terra.')),
          WID('derrota-calc', { aba: 'derrotas', preset: 'arc' }, 'Calcule a derrota do ARC (Las Palmas a Santa Lúcia): distância, rumos e pontos intermediários.'),
          CHK([
            q('m4l5-1', 'Derrotas', 1, 'Qual das derrotas é sempre a mais curta entre dois pontos da esfera?',
              ['Loxodrômica.', 'Ortodrômica.', 'Mista com latitude limite.', 'A que segue o paralelo.'], 1,
              'O arco de círculo máximo (ortodrômica) é o menor caminho sobre a esfera. As outras são mais longas ou iguais (a loxodrômica só coincide com ela ao longo de um meridiano ou do equador).',
              'Miguens, vol. II, item 33.6', U.mig2),
            q('m4l5-2', 'Derrotas', 2, 'Qual a diferença típica de distância entre a loxodrômica e a ortodrômica em uma travessia do Atlântico entre Cabo Verde e o Caribe (cerca de 2.100 milhas, em latitude baixa)?',
              ['Cerca de 200 milhas.', 'Cerca de 2 a 10 milhas.', 'Cerca de 600 milhas.', 'Nenhuma: são sempre idênticas.'], 1,
              'Em latitudes baixas e pernas de poucos milhares de milhas, a diferença é muito pequena (Mindelo–Granada: 2,4 milhas; Las Palmas–Rodney Bay: 9,9). Nos oceanos austrais, com latitudes altas, a diferença chega a centenas de milhas.',
              'Cálculo com o widget de derrotas; Miguens, vol. II, cap. 33', U.mig2),
            q('m4l5-3', 'Derrotas', 2, 'Em uma derrota mista, qual a função da latitude limite?',
              ['Define a hora do vértice.', 'Evita que o círculo máximo leve o navio a latitudes inseguras: ele segue o paralelo limite por um trecho.', 'Aumenta a distância sem motivo.', 'Obriga o rumo a ser 000°.'], 1,
              'A mista combina o círculo máximo, que economiza distância, com um trecho de paralelo (rumo 090° ou 270°) na latitude escolhida, para ficar longe de regiões perigosas (gelo, mau tempo).',
              'Miguens, vol. II, item 33.7', U.mig2),
            q('m4l5-4', 'Derrotas', 2, 'O vértice de uma derrota ortodrômica é:',
              ['O ponto de partida.', 'O ponto de maior latitude da derrota (a ortodrômica o corta em rumo 090° ou 270°).', 'O ponto de menor latitude da derrota.', 'O ponto onde ela cruza o equador.'], 1,
              'O vértice é o ponto em que o círculo máximo atinge a maior latitude (em módulo): ali ele é paralelo ao equador e o rumo é leste ou oeste. A ortodrômica pode ter o vértice fora do trecho navegado.',
              'Miguens, vol. II, item 33.7.2', U.mig2),
          ]),
          FT([mig2('cap. 33, itens 33.6 e 33.7 (ortodrômica, vértice e derrota mista)'), bow('cap. “The Sailings”: great-circle sailing'), { txt: 'Atlas de Cartas Piloto (DHN, CHM)', url: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3' }]),
        ],
      },
    ],
  });

  VL.dado('cursos/capitao-1', { modulos: M });
})();
