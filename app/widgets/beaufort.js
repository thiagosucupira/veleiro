/* beaufort — escala Beaufort 0 a 12 com o mar desenhado (SVG animado) e um veleiro de cruzeiro em escala (modelo de ~32 pés, como exemplo).

   Para cada força: velocidade (nós, km/h, m/s), termo usado pela Marinha do Brasil, aspecto do mar, altura provável das
   ondas em mar aberto, estado do mar na escala Douglas e uma ORIENTAÇÃO GERAL de vela para um veleiro de cruzeiro (referência: um barco de ~32 pés)
   (quando rizar etc.). A orientação é marcada na interface como geral, não como regra.

   Fontes citadas na interface:
   - Termos e faixas em nós: Centro de Hidrografia da Marinha (CHM), "Escala Beaufort" (fonte do CHM: WMO nº 8, vol. III, 2023)
     https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf
   - Estado do mar: CHM, "Escala Douglas" (WMO nº 8, vol. III, 2023)
     https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_douglas.pdf
   - Aspecto do mar, km/h, m/s e altura provável das ondas (e altura máxima provável): tabela de especificação da escala
     Beaufort da OMM (WMO nº 8). A própria OMM avisa: é só um guia para mar aberto, longe da terra; perto da costa e em
     águas abrigadas as ondas são menores e mais íngremes.
   - Formato "VENTO NE/NW 5/7" do boletim Meteoromarinha (CHM), conferido no boletim publicado em 2026-10-08.

   opts de mount (todos opcionais):
     forca:    4            força inicial (0 a 12)
     modo:     'explorar' | 'quiz'     padrão 'explorar'
     quiz:     true         mostra o botão do quiz (false = só explorar)
     barco:    true         desenha o veleiro de cruzeiro (exemplo de ~32 pés) na cena
     orientacao: true       mostra a orientação geral de vela
     questoes: 8            número de perguntas por rodada do quiz
     titulo:   texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'beaufort', opts:{forca:5}}
     {t:'widget', w:'beaufort', opts:{modo:'quiz', questoes:10}}
     {t:'widget', w:'beaufort', opts:{forca:7, quiz:false}} */
(function () {
  'use strict';
  var h = VL.h;
  var seq = 0;
  function uid(p) { seq += 1; return (p || 'bf') + '-' + seq + '-' + Math.random().toString(36).slice(2, 6); }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function num(x) { return VL.fmt.num(x, x % 1 ? 1 : 0); }
  function svg(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    return el;
  }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- Tabela (CHM / OMM) ---------- */
  // kn: faixa em nós (CHM). kmh e ms: faixas da OMM. hp/hm: altura provável e máxima provável (m), mar aberto.
  var F = [
    { f: 0, pt: 'Calmaria', en: 'calm', kn: [0, 1], kmh: '< 1', ms: '0 a 0,2', hp: 0, hm: 0,
      mar: 'Mar espelhado.' },
    { f: 1, pt: 'Bafagem', en: 'light air', kn: [1, 3], kmh: '1 a 5', ms: '0,3 a 1,5', hp: 0.1, hm: 0.1,
      mar: 'Pequenas rugas na água, com aspecto de escamas, sem cristas de espuma.' },
    { f: 2, pt: 'Aragem', en: 'light breeze', kn: [4, 6], kmh: '6 a 11', ms: '1,6 a 3,3', hp: 0.2, hm: 0.3,
      mar: 'Marolas pequenas, ainda curtas mas bem visíveis. As cristas têm aspecto vítreo e não arrebentam.' },
    { f: 3, pt: 'Fraco', en: 'gentle breeze', kn: [7, 10], kmh: '12 a 19', ms: '3,4 a 5,4', hp: 0.6, hm: 1,
      mar: 'Marolas grandes; as cristas começam a arrebentar. Espuma de aspecto vítreo e, talvez, alguns carneirinhos esparsos.' },
    { f: 4, pt: 'Moderado', en: 'moderate breeze', kn: [11, 16], kmh: '20 a 28', ms: '5,5 a 7,9', hp: 1, hm: 1.5,
      mar: 'Ondas pequenas, que vão ficando mais longas. Carneirinhos bastante frequentes.' },
    { f: 5, pt: 'Fresco', en: 'fresh breeze', kn: [17, 21], kmh: '29 a 38', ms: '8,0 a 10,7', hp: 2, hm: 2.5,
      mar: 'Ondas moderadas, de forma longa mais marcada. Muitos carneirinhos e, às vezes, alguns borrifos.' },
    { f: 6, pt: 'Muito fresco', en: 'strong breeze', kn: [22, 27], kmh: '39 a 49', ms: '10,8 a 13,8', hp: 3, hm: 4,
      mar: 'Começam a se formar ondas grandes. As cristas de espuma branca ficam mais extensas por toda parte. Provavelmente há borrifos.' },
    { f: 7, pt: 'Forte', en: 'near gale', kn: [28, 33], kmh: '50 a 61', ms: '13,9 a 17,1', hp: 4, hm: 5.5,
      mar: 'O mar se encapela. A espuma branca das ondas que arrebentam começa a ser soprada em faixas na direção do vento.' },
    { f: 8, pt: 'Muito forte', en: 'gale', kn: [34, 40], kmh: '62 a 74', ms: '17,2 a 20,7', hp: 5.5, hm: 7.5,
      mar: 'Ondas moderadamente altas e mais longas. As bordas das cristas se desfazem em borrifos e a espuma é soprada em faixas bem marcadas na direção do vento.' },
    { f: 9, pt: 'Duro', en: 'severe gale', kn: [41, 47], kmh: '75 a 88', ms: '20,8 a 24,4', hp: 7, hm: 10,
      mar: 'Ondas altas. Faixas densas de espuma na direção do vento. As cristas começam a tombar e rolar. Os borrifos podem atrapalhar a visibilidade.' },
    { f: 10, pt: 'Muito duro', en: 'storm', kn: [48, 55], kmh: '89 a 102', ms: '24,5 a 28,4', hp: 9, hm: 12.5,
      mar: 'Ondas muito altas, com cristas longas e pendentes. A espuma, em grandes placas, é soprada em faixas brancas densas e a superfície do mar fica esbranquiçada. O rolar das ondas fica pesado, como pancadas. Visibilidade prejudicada.' },
    { f: 11, pt: 'Tempestuoso', en: 'violent storm', kn: [56, 63], kmh: '103 a 117', ms: '28,5 a 32,6', hp: 11.5, hm: 16,
      mar: 'Ondas excepcionalmente altas (navios pequenos e médios podem sumir de vista atrás delas). O mar fica coberto de longas placas brancas de espuma e as bordas das cristas viram espuma. Visibilidade prejudicada.' },
    { f: 12, pt: 'Furacão', en: 'hurricane', kn: [64, null], kmh: '118 ou mais', ms: '32,7 ou mais', hp: 14, hm: null,
      mar: 'O ar fica cheio de espuma e borrifos. O mar fica todo branco com os borrifos soprados. Visibilidade muito prejudicada.' },
  ];
  // Escala Douglas (CHM): limite superior de cada código, em metros (o limite superior entra no código: 4,0 m = mar 5).
  var DOUGLAS = [
    { c: 0, pt: 'calmo', ate: 0 }, { c: 1, pt: 'encrespado', ate: 0.1 }, { c: 2, pt: 'suave', ate: 0.5 },
    { c: 3, pt: 'fraco', ate: 1.25 }, { c: 4, pt: 'moderado', ate: 2.5 }, { c: 5, pt: 'grosso', ate: 4 },
    { c: 6, pt: 'muito grosso', ate: 6 }, { c: 7, pt: 'alto', ate: 9 }, { c: 8, pt: 'muito alto', ate: 14 },
    { c: 9, pt: 'fenomenal', ate: Infinity },
  ];
  function douglas(hm) { for (var i = 0; i < DOUGLAS.length; i++) if (hm <= DOUGLAS[i].ate) return DOUGLAS[i]; return DOUGLAS[9]; }
  function faixaNos(d) {
    if (d.f === 0) return 'menos de 1 nó';
    if (d.kn[1] == null) return d.kn[0] + ' nós ou mais';
    return d.kn[0] + ' a ' + d.kn[1] + ' nós';
  }
  function forcaDeNos(kn) {
    if (!(kn >= 0)) return null;
    var r = Math.round(kn);
    if (kn < 1) return 0;
    for (var i = 1; i < F.length; i++) { var d = F[i]; if (d.kn[1] == null || r <= d.kn[1]) return i; }
    return 12;
  }

  /* ---------- Orientação geral para um veleiro de cruzeiro (referência: ~32 pés; não é regra) ---------- */
  // vela: {g: rizos na grande (0..3, -1 = arriada), gen: fração da genoa aberta (0..1), torm: tormentim}
  var VELA = [
    { vela: { g: -1, gen: 0 }, adern: 0, resumo: 'Sem vento para velejar',
      itens: ['Motor, ou espere o vento entrar.', 'Com o balanço do mar, a retranca e as velas batem: amarre a retranca e baixe ou enrole o que não está trabalhando.'] },
    { vela: { g: 0, gen: 1 }, adern: 2, resumo: 'Pano todo, quase sem governo',
      itens: ['Vela leve (balão assimétrico) se houver, ou motor.', 'Movimentos suaves a bordo para não tirar o pouco vento das velas.'] },
    { vela: { g: 0, gen: 1 }, adern: 5, resumo: 'Pano todo',
      itens: ['O barco anda devagar. Bom momento para treinar a regulagem fina das velas.'] },
    { vela: { g: 0, gen: 1 }, adern: 10, resumo: 'Pano todo',
      itens: ['Velejada tranquila, com pouca adernada. Ótimo para aprender.'] },
    { vela: { g: 0, gen: 1 }, adern: 16, resumo: 'Pano todo; prepare o 1º rizo',
      itens: ['A maioria dos barcos ainda leva pano todo, mas na orça o barco já aderna bem.', 'Com tripulação iniciante, perto do anoitecer ou se a previsão é de mais vento, deixe o 1º rizo preparado (ou já colocado).'] },
    { vela: { g: 1, gen: 0.8 }, adern: 18, resumo: '1º rizo na grande e genoa um pouco enrolada',
      itens: ['Faixa típica do 1º rizo, principalmente na orça, onde o vento aparente é maior que o real.', 'Colete e linha de vida para ir ao convés; feche gaiutas por causa dos borrifos.'] },
    { vela: { g: 2, gen: 0.55 }, adern: 20, resumo: '2º rizo e genoa bem reduzida',
      itens: ['Ondas de 3 m deixam a navegação cansativa: tudo peado dentro do barco e refeições simples.', 'Reduza o pano antes de manobrar: cambar ou jaibar com pano demais é onde as coisas quebram.'] },
    { vela: { g: 3, gen: 0.35 }, adern: 20, resumo: '3º rizo e vela de proa pequena',
      itens: ['Ninguém no convés sem estar preso à linha de vida.', 'Avalie mudar de rumo para aliviar o barco, ou capear para descansar a tripulação.', 'Não é dia para sair do porto num barco deste tamanho.'] },
    { vela: { g: 3, gen: 0, torm: true }, adern: 18, resumo: 'Mau tempo: 3º rizo e tormentim',
      itens: ['Tormentim e grande no 3º rizo (ou vela de capa), ou só o tormentim.', 'Capear ou correr com o tempo, conforme o mar e o espaço livre a sotavento.', 'Escotilhas fechadas, tripulação presa e revezando o descanso.'] },
    { vela: { g: -1, gen: 0, torm: true }, adern: 12, resumo: 'Tormentim ou árvore seca',
      itens: ['Tática de mau tempo: capear, ou correr com o tempo com pouquíssimo pano, usando âncora de arrasto (drogue) se o barco atravessar nas ondas.', 'A maior ameaça são as cristas que arrebentam: vigie o mar e governe com cuidado.'] },
    { vela: { g: -1, gen: 0 }, adern: 8, resumo: 'Sobrevivência: árvore seca',
      itens: ['Sobrevivência. A defesa de verdade é a previsão do tempo: um plano de cruzeiro não deve incluir estas condições.', 'Árvore seca, âncora de arrasto ou de capa conforme o barco, tudo fechado, tripulação presa e descansando em turnos.'] },
    { vela: { g: -1, gen: 0 }, adern: 8, resumo: 'Sobrevivência: árvore seca',
      itens: ['Sobrevivência. Peça ajuda cedo (rádio, EPIRB) se o barco ou a tripulação estiverem em risco.'] },
    { vela: { g: -1, gen: 0 }, adern: 8, resumo: 'Sobrevivência: árvore seca',
      itens: ['Condição de furacão. Nenhum barco de cruzeiro deve estar no mar por escolha.'] },
  ];

  /* ---------- Cena: mar em perfil, em escala com o veleiro ---------- */
  var W = 800, H = 360, NIVEL = 236, ESC = 13; // ESC: pixels por metro
  var G = 9.81;

  function Cena(o) {
    var raiz = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'bf-cena', role: 'img' });
    var idG = uid('bf-ceu'), idM = uid('bf-mar'), idClip = uid('bf-clip');
    var defs = svg('defs');
    var gCeu = svg('linearGradient', { id: idG, x1: '0', y1: '0', x2: '0', y2: '1' });
    gCeu.appendChild(svg('stop', { offset: '0', class: 'bf-ceu-a' }));
    gCeu.appendChild(svg('stop', { offset: '1', class: 'bf-ceu-b' }));
    var gMar = svg('linearGradient', { id: idM, x1: '0', y1: '0', x2: '0', y2: '1' });
    gMar.appendChild(svg('stop', { offset: '0', class: 'bf-mar-a' }));
    gMar.appendChild(svg('stop', { offset: '1', class: 'bf-mar-b' }));
    var clip = svg('clipPath', { id: idClip }); clip.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H }));
    defs.appendChild(gCeu); defs.appendChild(gMar); defs.appendChild(clip);
    raiz.appendChild(defs);
    var mundo = svg('g', { 'clip-path': 'url(#' + idClip + ')' });
    raiz.appendChild(mundo);
    mundo.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#' + idG + ')' }));
    var nuvens = svg('g', { class: 'bf-nuvens' });
    mundo.appendChild(nuvens);
    var gVentoAr = svg('g', { class: 'bf-vento-ar' });
    var pLonge = svg('path', { class: 'bf-onda bf-onda-3' });
    var pMeio = svg('path', { class: 'bf-onda bf-onda-2' });
    var pPerto = svg('path', { class: 'bf-onda bf-onda-1', fill: 'url(#' + idM + ')' });
    var pBranco = svg('path', { class: 'bf-mar-branco', opacity: 0 });
    var reflexo = svg('g', { class: 'bf-reflexo' });
    var gEspLonge = svg('g', { class: 'bf-espuma bf-espuma-longe' });
    var gBarco = svg('g', { class: 'bf-barco' });
    var gFaixas = svg('g', { class: 'bf-faixas' });
    var gEsp = svg('g', { class: 'bf-espuma' });
    var gBorr = svg('g', { class: 'bf-borrifos' });
    var nevoa = svg('rect', { x: 0, y: 0, width: W, height: H, class: 'bf-nevoa', opacity: 0 });
    mundo.appendChild(pLonge); mundo.appendChild(pMeio); mundo.appendChild(gEspLonge);
    mundo.appendChild(gBarco); mundo.appendChild(pPerto); mundo.appendChild(pBranco); mundo.appendChild(reflexo);
    mundo.appendChild(gFaixas); mundo.appendChild(gEsp); mundo.appendChild(gBorr); mundo.appendChild(gVentoAr); mundo.appendChild(nevoa);
    // escala e rótulos (posicionados por ajustar(), conforme a largura visível)
    var gEscala = svg('g', { class: 'bf-escala' });
    gEscala.appendChild(svg('rect', { x: -6, y: -34, width: 10 * ESC + 14, height: 44, rx: 4, class: 'bf-escala-fundo' }));
    gEscala.appendChild(svg('path', { d: 'M0 -6v6h' + (10 * ESC) + 'v-6', class: 'bf-escala-linha' }));
    var tEsc = svg('text', { x: 0, y: -14, class: 'bf-escala-txt' }); tEsc.textContent = '10 m';
    gEscala.appendChild(tEsc);
    mundo.appendChild(gEscala);
    var gVentoSeta = svg('g', { class: 'bf-vento-seta' });
    gVentoSeta.appendChild(svg('rect', { x: -8, y: -6, width: 124, height: 40, rx: 4, class: 'bf-escala-fundo' }));
    gVentoSeta.appendChild(svg('path', { d: 'M4 20h96m-10-7l10 7-10 7', class: 'bf-seta-vento' }));
    var tVento = svg('text', { x: 4, y: 9, class: 'bf-escala-txt' }); tVento.textContent = 'vento';
    gVentoSeta.appendChild(tVento);
    mundo.appendChild(gVentoSeta);
    var vb = { x: 0, w: W };
    function ajustar(px) {
      var estreita = px > 0 && px < 600;
      vb = estreita ? { x: 120, w: 520 } : { x: 0, w: W };
      raiz.setAttribute('viewBox', vb.x + ' 0 ' + vb.w + ' ' + H);
      raiz.style.aspectRatio = vb.w + ' / ' + H;
      var k = estreita ? 1.3 : 1;
      gEscala.setAttribute('transform', 'translate(' + (vb.x + 22) + ' ' + (H - 14) + ') scale(' + k + ')');
      gVentoSeta.setAttribute('transform', 'translate(' + (vb.x + vb.w - 124 * k - 8) + ' ' + 14 + ') scale(' + k + ')');
    }
    ajustar(0);

    var est = { forca: 4, t: 0, barco: o.barco !== false, comps: [], esp: [], borr: [], faixas: [], nuv: [], ar: [], semente: 1 };
    var rnd = (function () { var s = 12345; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();

    function montarComps(f) {
      var d = F[f], Hm = d.hp, comps = [];
      // comprimento de onda para desenhar (m): mais longo com mais vento; inclinação típica de mar de vento
      var L = Math.max(2.2, Hm * (Hm > 3 ? 7.5 : 10) + 3);
      var base = Hm * ESC / 2; // amplitude em px da componente principal
      comps.push({ A: base * 0.78, L: L, fase: 0.3, q: f >= 6 ? 0.55 : 0.35 });
      comps.push({ A: base * (f >= 8 ? 0.4 : 0.32), L: L * 0.61, fase: 2.1, q: 0.3 });
      comps.push({ A: base * (f >= 8 ? 0.22 : 0.16), L: L * 0.37, fase: 4.0, q: 0.2 });
      if (f >= 6) comps.push({ A: base * 0.1, L: L * 0.21, fase: 5.2, q: 0.15 });
      if (f >= 1 && f <= 3) comps.push({ A: [0, 0.7, 1.1, 1.4][f], L: 0.9, fase: 1, q: 0 });
      comps.forEach(function (c) {
        c.k = 2 * Math.PI / (c.L * ESC);                // rad/px
        c.w = Math.sqrt(G * 2 * Math.PI / c.L);          // rad/s (águas profundas)
      });
      est.comps = comps;
      est.envelope = d.hm && d.hp ? (d.hm / d.hp - 1) : 0.3;
    }
    function superficie(x, t, escalaA, escalaK, desloc) {
      // soma de ondas de Gerstner aproximada: devolve y (px) relativo ao nível
      var y = 0, dx = 0;
      var env = 1 + est.envelope * 0.5 * Math.max(0, Math.sin(x * 0.0021 - t * 0.17 + desloc));
      for (var i = 0; i < est.comps.length; i++) {
        var c = est.comps[i], k = c.k * escalaK, th = k * x - c.w * Math.sqrt(escalaK) * t + c.fase + desloc;
        y += -c.A * escalaA * env * Math.cos(th);
        dx += c.q * c.A * escalaA * Math.sin(th);
      }
      return { y: y, dx: dx };
    }
    function caminhoOnda(base, escalaA, escalaK, desloc, t, fechar) {
      var pts = [], passo = 6;
      for (var x = -24; x <= W + 24; x += passo) {
        var s = superficie(x, t, escalaA, escalaK, desloc);
        pts.push([x - s.dx, base + s.y]);
      }
      var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) d += 'L' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
      if (fechar) d += 'L' + (W + 24) + ' ' + (H + 4) + 'L-24 ' + (H + 4) + 'Z';
      return d;
    }
    function yPerto(x, t) { var s = superficie(x, t, 1, 1, 0); return NIVEL + s.y; }

    function desenharBarco(t) {
      while (gBarco.firstChild) gBarco.removeChild(gBarco.firstChild);
      if (!est.barco) return;
      var f = est.forca, v = VELA[f].vela, cx = 330;
      var yc = yPerto(cx, t), ya = yPerto(cx - 40, t), yb = yPerto(cx + 40, t);
      var pitch = Math.atan2(yb - ya, 80) * 180 / Math.PI * 0.85;
      var adern = VELA[f].adern;
      var balanço = f >= 2 ? Math.sin(t * 0.9) * Math.min(6, f * 0.5) : 0;
      var g = svg('g', { transform: 'translate(' + cx + ' ' + (yc + 3).toFixed(1) + ') rotate(' + (pitch + balanço * 0.25).toFixed(2) + ')' });
      var m = function (x, y) { return (x * ESC).toFixed(1) + ' ' + (-y * ESC).toFixed(1); };
      // casco (proa à direita)
      g.appendChild(svg('path', { class: 'bf-casco', d: 'M' + m(-4.55, 1.05) + 'Q' + m(0, 0.95) + ' ' + m(4.9, 1.25) + 'L' + m(3.7, -0.15) + 'Q' + m(0, -0.45) + ' ' + m(-4.35, -0.1) + 'Z' }));
      g.appendChild(svg('path', { class: 'bf-faixa-casco', d: 'M' + m(-4.45, 0.62) + 'Q' + m(0, 0.5) + ' ' + m(4.45, 0.78) }));
      g.appendChild(svg('path', { class: 'bf-cabine', d: 'M' + m(-1.9, 1.0) + 'L' + m(-1.7, 1.62) + 'L' + m(1.0, 1.66) + 'L' + m(1.6, 1.05) + 'Z' }));
      var mastroX = 1.0, topo = 13.4, retY = 2.15, retX = -3.6;
      // adernamento visto de lado: o mastro se inclina para sotavento (inclinação a partir do convés)
      var yd = (-1.1 * ESC).toFixed(1), inc = -(adern + balanço * 0.6);
      var mastro = svg('g', { transform: 'translate(0 ' + yd + ') skewX(' + inc.toFixed(2) + ') translate(0 ' + (-yd) + ')' });
      mastro.appendChild(svg('path', { class: 'bf-estai', d: 'M' + m(4.75, 1.2) + 'L' + m(mastroX, topo) + 'L' + m(-4.4, 1.05) }));
      mastro.appendChild(svg('path', { class: 'bf-mastro', d: 'M' + m(mastroX, 1.1) + 'L' + m(mastroX, topo) }));
      // vela grande
      if (v.g >= 0) {
        var reduz = v.g * 1.55, cabeca = topo - 0.5 - reduz;
        var bolsa = f <= 1 ? 0.1 : 0.55;
        mastro.appendChild(svg('path', { class: 'bf-vela', d: 'M' + m(mastroX - 0.1, retY + 0.1) + 'L' + m(mastroX - 0.1, cabeca) + 'Q' + m(retX * 0.55 - bolsa, (cabeca + retY) * 0.5) + ' ' + m(retX + 0.15, retY + 0.15) + 'Z' }));
        for (var r = 0; r < v.g; r++) mastro.appendChild(svg('path', { class: 'bf-rizo', d: 'M' + m(mastroX - 0.1, retY + 0.25 + r * 0.18) + 'L' + m(retX + 0.25, retY + 0.3 + r * 0.18) }));
      } else {
        mastro.appendChild(svg('path', { class: 'bf-vela-ferrada', d: 'M' + m(mastroX - 0.1, retY + 0.2) + 'L' + m(retX + 0.4, retY + 0.25) }));
      }
      mastro.appendChild(svg('path', { class: 'bf-retranca', d: 'M' + m(mastroX, retY) + 'L' + m(retX, retY) }));
      // genoa (ou tormentim) no estai de proa
      var amura = [4.55, 1.35];
      if (v.gen > 0) {
        var s = v.gen, punho = [amura[0] + (-2.4 - amura[0]) * s, 1.8 + (1 - s) * 2.2];
        var testa = [amura[0] + (mastroX + 0.15 - amura[0]) * (0.25 + 0.72 * Math.sqrt(s)), amura[1] + (topo - 0.8 - amura[1]) * (0.25 + 0.72 * Math.sqrt(s))];
        mastro.appendChild(svg('path', { class: 'bf-vela bf-genoa', d: 'M' + m(amura[0], amura[1]) + 'L' + m(testa[0], testa[1]) + 'Q' + m((testa[0] + punho[0]) / 2 - 0.4 * s, (testa[1] + punho[1]) / 2 - 0.3) + ' ' + m(punho[0], punho[1]) + 'Z' }));
        if (s < 1) mastro.appendChild(svg('path', { class: 'bf-enrolada', d: 'M' + m(amura[0], amura[1]) + 'L' + m(mastroX + (amura[0] - mastroX) * 0.08, topo - 0.9) }));
      } else if (v.torm) {
        var tt = [amura[0] - 1.6, amura[1] + 4.6];
        mastro.appendChild(svg('path', { class: 'bf-vela bf-tormentim', d: 'M' + m(amura[0] - 0.2, amura[1] + 0.3) + 'L' + m(tt[0], tt[1]) + 'L' + m(amura[0] - 2.4, amura[1] + 0.5) + 'Z' }));
        mastro.appendChild(svg('path', { class: 'bf-enrolada', d: 'M' + m(amura[0], amura[1]) + 'L' + m(mastroX + (amura[0] - mastroX) * 0.08, topo - 0.9) }));
      } else {
        mastro.appendChild(svg('path', { class: 'bf-enrolada', d: 'M' + m(amura[0], amura[1]) + 'L' + m(mastroX + (amura[0] - mastroX) * 0.08, topo - 0.9) }));
      }
      g.appendChild(mastro);
      gBarco.appendChild(g);
    }

    function novaEspuma(t, perto) {
      // nasce numa crista da camada de perto
      var melhor = null;
      for (var tent = 0; tent < 6; tent++) {
        var x = rnd() * (W + 80) - 40, y = yPerto(x, t), y1 = yPerto(x - 8, t), y2 = yPerto(x + 8, t);
        if (y <= y1 && y <= y2) { melhor = x; break; }
        if (melhor == null || y < yPerto(melhor, t)) melhor = x;
      }
      return { x: melhor, nasc: t, vida: 1.4 + rnd() * 2.2, tam: 0.7 + rnd() * 0.8, perto: perto };
    }
    function velCrista() { var c = est.comps[0]; return c ? c.w / c.k : 0; } // px/s

    function passo(t, dt) {
      var f = est.forca, d = F[f];
      var dPerto = caminhoOnda(NIVEL, 1, 1, 0, t, true);
      pPerto.setAttribute('d', dPerto);
      if (f >= 9) pBranco.setAttribute('d', dPerto);
      pBranco.setAttribute('opacity', String([0, 0, 0, 0, 0, 0, 0, 0, 0, 0.12, 0.3, 0.45, 0.62][f]));
      pMeio.setAttribute('d', caminhoOnda(NIVEL - 30, 0.5, 1.7, 1.3, t, true));
      pLonge.setAttribute('d', caminhoOnda(NIVEL - 52, 0.26, 3.1, 2.6, t, true));
      // reflexo do mar espelhado
      reflexo.setAttribute('opacity', f === 0 ? '1' : '0');
      // espuma nas cristas: taxa por força (carneirinhos)
      var taxa = [0, 0, 0, 0.6, 2.2, 4.5, 7, 10, 13, 16, 20, 24, 30][f];
      if (dt > 0) {
        var n = taxa * dt; while (n > 0) { if (rnd() < n) est.esp.push(novaEspuma(t, true)); n -= 1; }
      }
      var vc = velCrista();
      est.esp = est.esp.filter(function (e) { return t - e.nasc < e.vida; });
      while (gEsp.firstChild) gEsp.removeChild(gEsp.firstChild);
      est.esp.forEach(function (e) {
        var idade = (t - e.nasc) / e.vida, x = e.x + vc * (t - e.nasc) * 0.9, y = yPerto(x, t);
        var r = (3 + f * 1.3) * e.tam * (idade < 0.2 ? idade / 0.2 : 1);
        var op = idade < 0.6 ? 0.95 : 0.95 * (1 - (idade - 0.6) / 0.4);
        gEsp.appendChild(svg('path', { d: 'M' + (x - r * 2.2).toFixed(1) + ' ' + (y + 1).toFixed(1) + 'q' + (r * 0.8).toFixed(1) + ' ' + (-r * 0.9).toFixed(1) + ' ' + (r * 2.2).toFixed(1) + ' ' + (-r * 0.5).toFixed(1) + 'q' + (r * 1.2).toFixed(1) + ' ' + (r * 0.2).toFixed(1) + ' ' + (r * 2).toFixed(1) + ' ' + (r * 1.1).toFixed(1) + 'q' + (-r * 2).toFixed(1) + ' ' + (r * 0.6).toFixed(1) + ' ' + (-r * 4.2).toFixed(1) + ' ' + (-r * 0.6).toFixed(1) + 'z', opacity: op.toFixed(2) }));
      });
      // carneirinhos na camada do meio (mais longe, menores)
      while (gEspLonge.firstChild) gEspLonge.removeChild(gEspLonge.firstChild);
      if (f >= 3) {
        var nl = Math.round([0, 0, 0, 2, 5, 9, 13, 16, 20, 24, 28, 32, 36][f]);
        for (var i = 0; i < nl; i++) {
          var fase = (i * 0.618 + Math.floor(t * 0.35 + i * 0.37) * 0.271) % 1;
          var xl = fase * (W + 40) - 20 + vc * 0.4 * ((t * 0.35 + i * 0.37) % 1) * 3;
          var vida = (t * 0.35 + i * 0.37) % 1;
          var yl = NIVEL - 30 + superficie(xl, t, 0.5, 1.7, 1.3).y;
          gEspLonge.appendChild(svg('ellipse', { cx: xl.toFixed(1), cy: (yl + 1).toFixed(1), rx: (2 + f * 0.6).toFixed(1), ry: (0.8 + f * 0.12).toFixed(1), opacity: (Math.sin(vida * Math.PI) * 0.85).toFixed(2) }));
        }
      }
      // faixas de espuma soprada (força 7 em diante)
      while (gFaixas.firstChild) gFaixas.removeChild(gFaixas.firstChild);
      if (f >= 7) {
        var nf = [0, 0, 0, 0, 0, 0, 0, 7, 13, 20, 28, 36, 44][f];
        for (var j = 0; j < nf; j++) {
          var xb = ((j * 97.3 + t * (6 + f)) % (W + 120)) - 60;
          var prof = 10 + (j * 37 % 80);
          var yb = yPerto(xb, t) + prof;
          var comp = 16 + (j * 13 % 30) + f * 2;
          gFaixas.appendChild(svg('path', { d: 'M' + xb.toFixed(1) + ' ' + yb.toFixed(1) + 'h' + comp, opacity: (0.35 + (j % 3) * 0.18).toFixed(2) }));
        }
      }
      // borrifos (força 8 em diante; alguns a partir de 5)
      var taxaB = [0, 0, 0, 0, 0, 2, 6, 12, 30, 50, 70, 90, 120][f];
      if (dt > 0) {
        var nb = taxaB * dt;
        while (nb > 0) {
          if (rnd() < nb) {
            var e0 = novaEspuma(t, true), xb0 = e0.x;
            est.borr.push({ x: xb0, y: yPerto(xb0, t) - 2, vx: 30 + rnd() * (f * 9), vy: -(18 + rnd() * f * 5), nasc: t, vida: 0.7 + rnd() * 0.9, r: 0.8 + rnd() * 1.4 });
          }
          nb -= 1;
        }
        est.borr.forEach(function (b) { b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 60 * dt; });
      }
      est.borr = est.borr.filter(function (b) { return t - b.nasc < b.vida && b.x < W + 20; });
      while (gBorr.firstChild) gBorr.removeChild(gBorr.firstChild);
      est.borr.forEach(function (b) {
        var id = (t - b.nasc) / b.vida;
        gBorr.appendChild(svg('circle', { cx: b.x.toFixed(1), cy: b.y.toFixed(1), r: b.r.toFixed(1), opacity: (0.9 * (1 - id)).toFixed(2) }));
      });
      // linhas de vento no ar
      while (gVentoAr.firstChild) gVentoAr.removeChild(gVentoAr.firstChild);
      if (f >= 2) {
        var nv = Math.min(18, 2 + f * 1.4), velAr = 40 + d.kn[0] * 9;
        for (var q = 0; q < nv; q++) {
          var xv = ((q * 173.7 + t * velAr) % (W + 200)) - 100;
          var yv = 40 + (q * 53 % 150);
          gVentoAr.appendChild(svg('path', { d: 'M' + xv.toFixed(1) + ' ' + yv + 'h' + (14 + f * 5), opacity: (0.18 + 0.04 * Math.min(f, 8)).toFixed(2) }));
        }
      }
      nevoa.setAttribute('opacity', String([0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0.12, 0.22, 0.32, 0.5][f]));
      desenharBarco(t);
    }

    function nuvensPara(f) {
      while (nuvens.firstChild) nuvens.removeChild(nuvens.firstChild);
      var n = f <= 2 ? 2 : f <= 5 ? 4 : 6;
      var esc = f >= 8 ? 'bf-nuvem bf-nuvem-pesada' : 'bf-nuvem';
      for (var i = 0; i < n; i++) {
        var x = 60 + i * (W / n) + (i % 2) * 40, y = 40 + (i % 3) * 22 + (f >= 8 ? 10 : 0), s = 0.8 + (i % 3) * 0.25 + f * 0.04;
        var g = svg('g', { class: esc, transform: 'translate(' + x + ' ' + y + ') scale(' + s.toFixed(2) + ')' });
        g.appendChild(svg('ellipse', { cx: 0, cy: 0, rx: 46, ry: 13 }));
        g.appendChild(svg('ellipse', { cx: -16, cy: -9, rx: 22, ry: 13 }));
        g.appendChild(svg('ellipse', { cx: 14, cy: -12, rx: 26, ry: 16 }));
        nuvens.appendChild(g);
      }
      // reflexo (força 0)
      while (reflexo.firstChild) reflexo.removeChild(reflexo.firstChild);
      for (var k = 0; k < 14; k++) {
        reflexo.appendChild(svg('path', { d: 'M' + (30 + (k * 211) % (W - 80)) + ' ' + (NIVEL + 16 + (k * 29) % 100) + 'h' + (30 + (k * 17) % 60) }));
      }
    }

    return {
      el: raiz,
      definir: function (f, t) { est.forca = f; montarComps(f); nuvensPara(f); est.esp = []; est.borr = []; est.t = t || 0; passo(est.t, 0); raiz.setAttribute('aria-label', 'Mar com vento força ' + f + ' (' + F[f].pt.toLowerCase() + '): ' + F[f].mar + (est.barco ? ' Veleiro de cruzeiro com ' + VELA[f].resumo.toLowerCase() + '.' : '')); },
      passo: function (t, dt) { est.t = t; passo(t, dt); },
      barco: function (b) { est.barco = b; desenharBarco(est.t); },
      ajustar: ajustar,
    };
  }

  /* ---------- Quiz ---------- */
  function gerarQuestoes(n) {
    var tipos = ['ver', 'nos', 'termo', 'onda', 'aspecto', 'boletim', 'ver', 'nos', 'aspecto', 'vela'];
    var lista = [], usados = {};
    for (var i = 0; i < n * 3 && lista.length < n; i++) {
      var tipo = tipos[(i + Math.floor(Math.random() * tipos.length)) % tipos.length];
      var q = criarQuestao(tipo);
      if (!q || usados[q.chave]) continue;
      usados[q.chave] = 1; lista.push(q);
    }
    return lista;
  }
  function distratoresForca(f, longe) {
    var cand = [];
    for (var k = 0; k <= 12; k++) if (k !== f && Math.abs(k - f) >= (longe ? 2 : 1) && Math.abs(k - f) <= 4) cand.push(k);
    return VL.embaralhar(cand).slice(0, 3);
  }
  function criarQuestao(tipo) {
    var f, d, alts, cor;
    if (tipo === 'ver') {
      f = sortear([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]); d = F[f];
      alts = VL.embaralhar([f].concat(distratoresForca(f, true)));
      return { chave: 'ver' + f, tipo: tipo, forca: f, cena: true,
        enunciado: 'Olhe o mar na cena (em mar aberto). Que força Beaufort ela mostra?',
        alternativas: alts.map(function (k) { return 'Força ' + k + ' (' + F[k].pt.toLowerCase() + ')'; }), correta: alts.indexOf(f),
        explicacao: 'Força ' + f + ', ' + d.pt.toLowerCase() + ': ' + d.mar + ' Altura provável das ondas: ' + (d.hp ? num(d.hp) + ' m' : 'nenhuma') + '.' };
    }
    if (tipo === 'nos') {
      f = sortear([2, 3, 4, 5, 6, 7, 8, 9, 10]); d = F[f];
      var kn = d.kn[0] + Math.floor(Math.random() * (d.kn[1] - d.kn[0] + 1));
      alts = VL.embaralhar([f].concat(distratoresForca(f)));
      return { chave: 'nos' + kn, tipo: tipo, forca: f,
        enunciado: 'O anemômetro marca vento médio de ' + kn + ' nós. Que força é essa na escala Beaufort?',
        alternativas: alts.map(function (k) { return 'Força ' + k; }), correta: alts.indexOf(f),
        explicacao: 'A força ' + f + ' (' + d.pt.toLowerCase() + ') vai de ' + faixaNos(d) + '. Use o vento médio, não a rajada.' };
    }
    if (tipo === 'termo') {
      f = sortear([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]); d = F[f];
      var outros = VL.embaralhar(F.filter(function (x) { return x.f !== f && Math.abs(x.f - f) <= 3; })).slice(0, 3);
      var ops = VL.embaralhar([d].concat(outros));
      return { chave: 'termo' + f, tipo: tipo, forca: f,
        enunciado: 'Nos boletins da Marinha, que nome tem o vento de força ' + f + ' (' + faixaNos(d) + ')?',
        alternativas: ops.map(function (x) { return x.pt; }), correta: ops.indexOf(d),
        explicacao: 'Força ' + f + ' é "' + d.pt.toLowerCase() + '" na tabela do Centro de Hidrografia da Marinha. Repare que "fraco" é força 3 e "forte" é força 7: os nomes não seguem a linguagem do dia a dia.' };
    }
    if (tipo === 'onda') {
      f = sortear([3, 4, 5, 6, 7, 8, 9, 10]); d = F[f];
      var alturas = VL.embaralhar(F.filter(function (x) { return x.hp && x.f !== f && Math.abs(x.f - f) <= 3; })).slice(0, 3);
      var opsO = VL.embaralhar([d].concat(alturas));
      return { chave: 'onda' + f, tipo: tipo, forca: f,
        enunciado: 'Em mar aberto, longe da costa, qual a altura provável das ondas com vento força ' + f + '?',
        alternativas: opsO.map(function (x) { return num(x.hp) + ' m'; }), correta: opsO.indexOf(d),
        explicacao: 'Pela tabela da OMM, força ' + f + ' dá ondas de cerca de ' + num(d.hp) + ' m (máxima provável ' + num(d.hm) + ' m). Perto da costa e em águas abrigadas as ondas são menores, mas mais curtas e íngremes.' };
    }
    if (tipo === 'aspecto') {
      f = sortear([1, 3, 4, 5, 7, 8, 9, 11, 12]); d = F[f];
      alts = VL.embaralhar([f].concat(distratoresForca(f)));
      return { chave: 'asp' + f, tipo: tipo, forca: f,
        enunciado: 'Você observa: "' + d.mar + '" Que força é essa?',
        alternativas: alts.map(function (k) { return 'Força ' + k + ' (' + F[k].pt.toLowerCase() + ')'; }), correta: alts.indexOf(f),
        explicacao: 'É a descrição do mar para a força ' + f + ' (' + faixaNos(d) + ').' };
    }
    if (tipo === 'boletim') {
      var casos = [['SE/E', 'SE', 'E', 5, 6], ['NE/NW', 'NE', 'NW', 5, 7], ['SW/S', 'SW', 'S', 6, 8], ['E/NE', 'E', 'NE', 3, 5]];
      var c = sortear(casos), a = F[c[3]], b = F[c[4]];
      var certa = 'Vento soprando de ' + c[1] + ' a ' + c[2] + ', força ' + c[3] + ' a ' + c[4] + ' (' + a.kn[0] + ' a ' + b.kn[1] + ' nós)';
      var ops2 = VL.embaralhar([certa,
        'Vento soprando para ' + c[1] + ' e ' + c[2] + ', de ' + c[3] + ' a ' + c[4] + ' nós',
        'Ondas de ' + c[1] + '/' + c[2] + ' com ' + c[3] + ' a ' + c[4] + ' m de altura',
        'Vento de ' + c[1] + ' a ' + c[2] + ' com rajadas de ' + c[3] + ' a ' + c[4] + ' nós']);
      return { chave: 'bol' + c[0], tipo: tipo,
        enunciado: 'No boletim Meteoromarinha está escrito: "VENTO ' + c[0] + ' ' + c[3] + '/' + c[4] + '". O que isso quer dizer?',
        alternativas: ops2, correta: ops2.indexOf(certa),
        explicacao: 'O boletim dá a direção de onde o vento sopra (de ' + c[1] + ' a ' + c[2] + ') e a força Beaufort mínima e máxima (' + c[3] + ' a ' + c[4] + '). Força ' + c[3] + ' começa em ' + a.kn[0] + ' nós e força ' + c[4] + ' vai até ' + b.kn[1] + ' nós. As ondas vêm numa frase separada ("ONDAS DE …").' };
    }
    if (tipo === 'vela') {
      var opsV = ['Colocar o 1º rizo e enrolar um pouco da genoa agora, ainda com luz', 'Seguir com pano todo e rizar só se o vento passar de 30 nós', 'Arriar todas as velas e seguir a motor', 'Soltar as escotas para o barco adernar menos e manter o pano'];
      var certaV = opsV[0], emb = VL.embaralhar(opsV);
      return { chave: 'vela', tipo: tipo, forca: 5,
        enunciado: 'Num veleiro de cruzeiro (por exemplo, de 32 pés), no contravento, o vento médio subiu para 18 nós e vai anoitecer. Pela orientação geral, o que é mais prudente?',
        alternativas: emb, correta: emb.indexOf(certaV),
        explicacao: '18 nós é força 5 (fresco). Na orça o vento aparente é maior que o real, e rizar de dia, com calma, é muito mais seguro que à noite. Esperar 30 nós é tarde demais; seguir a motor desperdiça a vela sem necessidade; soltar escotas faz as velas baterem e não reduz o esforço. Orientação geral: cada barco e tripulação tem seus limites.' };
    }
    return null;
  }

  VL.widgets.define('beaufort', {
    css: ['assets/css/widgets/beaufort.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var est = {
        forca: clamp(Math.round(Number(opts.forca != null ? opts.forca : 4)) || 0, 0, 12),
        modo: opts.modo === 'quiz' && opts.quiz !== false ? 'quiz' : 'explorar',
        animar: !reduzMov(), visivel: true,
      };
      if (opts.forca === 0) est.forca = 0;
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Escala Beaufort: o vento, o mar e as velas', controlesAntes: true });
      ins.raiz.classList.add('bf-raiz');
      el.appendChild(ins.raiz);

      /* controles gerais */
      var segModo = h('div', { class: 'segmented bf-modo', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['quiz', 'Quiz']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      var btnAnim = h('button', { type: 'button', class: 'btn btn-ghost bf-anim', onclick: function () { est.animar = !est.animar; atualizarAnim(); } });
      var btnPassoMar = h('button', { type: 'button', class: 'btn btn-ghost bf-passo', title: 'Avança o mar meio segundo', onclick: function () { tempo += 0.5; cena.passo(tempo, 0.5); if (cenaQ) cenaQ.passo(tempo, 0.5); } }, 'Avançar o mar');
      if (opts.quiz !== false) ins.controles.appendChild(segModo);
      var ctlAnim = h('div', { class: 'bf-ctl-anim' }, btnAnim, btnPassoMar);
      ins.controles.appendChild(ctlAnim);
      function mostrarCtlAnim() { ctlAnim.hidden = !(est.modo === 'explorar' || cenaQ); }

      var vExp = h('div', { class: 'bf-explorar' });
      var vQuiz = h('div', { class: 'bf-quiz' });
      ins.corpo.appendChild(h('div', { class: 'bf-corpo' }, vExp, vQuiz));
      var leg = h('span', { class: 'bf-fonte' }, 'Termos e faixas em nós: Centro de Hidrografia da Marinha (OMM nº 8). Aspecto do mar e ondas: tabela da OMM, para mar aberto. Ilustração em escala com um veleiro de cruzeiro de exemplo, de 32 pés (≈ 9,8 m).');
      ins.legenda.appendChild(leg);

      /* ---------- Explorar ---------- */
      var cena = Cena({ barco: opts.barco !== false });
      var cenaCx = h('div', { class: 'bf-cena-caixa' }, cena.el);
      var tituloF = h('h3', { class: 'bf-titulo', 'aria-live': 'polite' });
      var velF = h('p', { class: 'bf-vel' });
      var faixa = h('input', { type: 'range', min: '0', max: '12', step: '1', class: 'bf-faixa', 'aria-label': 'Força do vento na escala Beaufort' });
      var menos = h('button', { type: 'button', class: 'btn btn-icon bf-mm', 'aria-label': 'Diminuir a força', onclick: function () { definir(est.forca - 1); } }, VL.icon('esquerda'));
      var mais = h('button', { type: 'button', class: 'btn btn-icon bf-mm', 'aria-label': 'Aumentar a força', onclick: function () { definir(est.forca + 1); } }, VL.icon('direita'));
      var marcas = h('div', { class: 'bf-marcas', 'aria-hidden': 'true' });
      for (var i = 0; i <= 12; i++) marcas.appendChild(h('span', { 'data-f': String(i) }, String(i)));
      faixa.addEventListener('input', function () { definir(Number(faixa.value)); });
      var inpNos = h('input', { type: 'number', min: '0', max: '150', step: '1', inputmode: 'numeric', class: 'bf-nos', 'aria-label': 'Velocidade do vento em nós' });
      var saidaNos = h('span', { class: 'bf-nos-saida', 'aria-live': 'polite' });
      inpNos.addEventListener('input', function () {
        var v = parseFloat(String(inpNos.value).replace(',', '.'));
        var fz = forcaDeNos(v);
        if (fz == null) { saidaNos.textContent = ''; return; }
        saidaNos.textContent = 'força ' + fz;
        definir(fz, true);
      });
      var regua = h('div', { class: 'bf-regua' },
        h('div', { class: 'bf-regua-linha' }, menos, h('div', { class: 'bf-faixa-caixa' }, faixa, marcas), mais),
        h('label', { class: 'bf-conv' }, h('span', null, 'Converter nós em força'), inpNos, h('span', { class: 'bf-un' }, 'nós'), saidaNos));

      var ddMar = h('p', { class: 'bf-mar' });
      var ddOnda = h('div', { class: 'bf-onda-v' });
      var ddDouglas = h('p', { class: 'bf-douglas' });
      var velaTit = h('p', { class: 'bf-vela-tit' });
      var velaLista = h('ul', { class: 'bf-vela-lista' });
      var boxVela = h('section', { class: 'bf-caixa bf-caixa-vela', 'aria-label': 'Orientação geral de vela' },
        h('h4', null, 'No veleiro de cruzeiro ', h('span', { class: 'bf-geral' }, 'orientação geral, não regra')),
        velaTit, velaLista,
        h('p', { class: 'bf-miudo' }, 'Os exemplos de pano valem para um cruzeiro de ~32 pés (≈ 9,75 m): barcos maiores costumam aguentar mais vento antes de rizar, os menores, menos. Depende do barco (peso, lastro, plano vélico), do ângulo do vento (na orça o vento aparente é maior), do mar, das rajadas e da experiência da tripulação. Regra de bolso dos velejadores: se pensou em rizar, já é hora.'));
      var boxMar = h('section', { class: 'bf-caixa', 'aria-label': 'Aspecto do mar' },
        h('h4', null, 'Aspecto do mar'), ddMar,
        h('div', { class: 'bf-numeros' }, ddOnda), ddDouglas,
        h('p', { class: 'bf-miudo' }, 'A OMM avisa: a tabela é só um guia para mar aberto, longe da terra. Perto da costa, com vento de terra, ou em águas abrigadas, as ondas são menores e mais íngremes.'));
      var boxBol = h('p', { class: 'bf-boletim' });
      var tabela = montarTabela();
      vExp.appendChild(h('div', { class: 'bf-topo' }, h('div', { class: 'bf-cab' }, tituloF, velF), regua));
      vExp.appendChild(cenaCx);
      vExp.appendChild(h('div', { class: 'bf-grade' }, boxMar, opts.orientacao === false ? null : boxVela));
      vExp.appendChild(boxBol);
      vExp.appendChild(tabela);

      function montarTabela() {
        var tb = h('tbody');
        F.forEach(function (d) {
          tb.appendChild(h('tr', { 'data-f': String(d.f), onclick: function () { definir(d.f); cenaCx.scrollIntoView({ block: 'nearest', behavior: reduzMov() ? 'auto' : 'smooth' }); } },
            h('td', null, h('button', { type: 'button', class: 'bf-tab-btn', 'aria-label': 'Ver força ' + d.f }, String(d.f))),
            h('td', null, d.pt, h('span', { class: 'bf-en', 'data-intl': 'on' }, ' (' + d.en + ')')),
            h('td', { class: 'bf-num' }, d.f === 0 ? '< 1' : d.kn[1] == null ? '≥ 64' : d.kn[0] + '–' + d.kn[1]),
            h('td', { class: 'bf-num' }, d.hp ? num(d.hp) + (d.hm && d.hm !== d.hp ? ' (' + num(d.hm) + ')' : '') : '–'),
            h('td', null, VELA[d.f].resumo)));
        });
        return h('details', { class: 'bf-tabela' },
          h('summary', null, 'Tabela completa (forças 0 a 12)'),
          h('div', { class: 'table-wrap' }, h('table', { class: 'tabela' },
            h('thead', null, h('tr', null, h('th', null, 'Força'), h('th', null, 'Termo'), h('th', null, 'Nós'), h('th', null, 'Ondas (m)'), h('th', null, 'Veleiro de cruzeiro (geral; ex.: 32 pés)'))), tb)),
          h('p', { class: 'bf-miudo' }, 'Ondas: altura provável e, entre parênteses, a máxima provável, em mar aberto (OMM).'));
      }

      function definir(f, deNos) {
        f = clamp(Math.round(f), 0, 12);
        est.forca = f;
        var d = F[f], dg = douglas(d.hp);
        faixa.value = String(f);
        faixa.setAttribute('aria-valuetext', 'Força ' + f + ', ' + d.pt.toLowerCase() + ', ' + faixaNos(d));
        if (!deNos) { inpNos.value = ''; saidaNos.textContent = ''; }
        tituloF.textContent = '';
        tituloF.appendChild(h('span', { class: 'bf-num-f' }, 'Força ' + f));
        tituloF.appendChild(document.createTextNode(' ' + d.pt));
        tituloF.appendChild(h('span', { class: 'bf-en', 'data-intl': 'on' }, ' (' + d.en + ')'));
        velF.textContent = faixaNos(d) + ' · ' + d.kmh + ' km/h · ' + d.ms + ' m/s';
        ddMar.textContent = d.mar;
        ddOnda.innerHTML = '';
        ddOnda.appendChild(h('div', { class: 'bf-stat' }, h('span', { class: 'bf-stat-v' }, d.hp ? num(d.hp) + ' m' : '0 m'), h('span', { class: 'bf-stat-l' }, 'altura provável')));
        ddOnda.appendChild(h('div', { class: 'bf-stat' }, h('span', { class: 'bf-stat-v' }, d.hm == null ? '–' : num(d.hm) + ' m'), h('span', { class: 'bf-stat-l' }, 'máxima provável')));
        ddDouglas.textContent = 'Na escala Douglas (estado do mar, CHM), ' + (d.hp ? 'ondas de ' + num(d.hp) + ' m' : 'mar sem ondas') + ' = mar ' + dg.c + ', ' + dg.pt + '.';
        var v = VELA[f];
        velaTit.textContent = v.resumo + '.';
        velaLista.innerHTML = '';
        v.itens.forEach(function (t) { velaLista.appendChild(h('li', null, t)); });
        boxBol.innerHTML = '';
        boxBol.appendChild(h('strong', null, 'No boletim da Marinha: '));
        boxBol.appendChild(document.createTextNode(f === 0
          ? 'o Meteoromarinha escreve o vento como "VENTO NE/NW 3/5": de onde sopra (de NE a NW) e a força Beaufort mínima e máxima. Calmaria é força 0.'
          : 'o Meteoromarinha escreve o vento como "VENTO NE/NW ' + (f - 1) + '/' + f + '": de onde sopra (de NE a NW) e a força Beaufort mínima e máxima (aqui, ' + (f - 1) + ' a ' + f + ').'));
        VL.$$('tr[data-f]', tabela).forEach(function (tr) { tr.setAttribute('aria-current', tr.getAttribute('data-f') === String(f) ? 'true' : 'false'); });
        VL.$$('span[data-f]', marcas).forEach(function (s) { s.classList.toggle('bf-marca-on', s.getAttribute('data-f') === String(f)); });
        menos.disabled = f === 0; mais.disabled = f === 12;
        ins.raiz.setAttribute('data-forca', String(f));
        cena.definir(f, tempo);
      }

      /* ---------- Animação ---------- */
      var tempo = 0, ultimo = null, raf = null;
      function quadro(ts) {
        raf = null;
        if (!est.animar || !est.visivel) { ultimo = null; return; }
        if (ultimo == null) ultimo = ts;
        var dt = Math.min(0.05, (ts - ultimo) / 1000); ultimo = ts;
        tempo += dt;
        if (est.modo === 'explorar') cena.passo(tempo, dt);
        else if (cenaQ) cenaQ.passo(tempo, dt);
        raf = requestAnimationFrame(quadro);
      }
      function atualizarAnim() {
        btnAnim.textContent = est.animar ? 'Pausar o mar' : 'Animar o mar';
        btnAnim.setAttribute('aria-pressed', String(est.animar));
        btnPassoMar.hidden = est.animar;
        if (est.animar && est.visivel && !raf) { ultimo = null; raf = requestAnimationFrame(quadro); }
        if (!est.animar && raf) { cancelAnimationFrame(raf); raf = null; }
      }
      var ro = null;
      function medir() { var w = ins.corpo.clientWidth; cena.ajustar(w); if (cenaQ) cenaQ.ajustar(w); }
      if ('ResizeObserver' in window) { ro = new ResizeObserver(medir); ro.observe(ins.corpo); }
      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (ents) { est.visivel = ents[0].isIntersecting && !document.hidden; atualizarAnim(); }, { threshold: 0.05 });
        io.observe(ins.corpo);
      }
      function aoVisib() { est.visivel = !document.hidden; atualizarAnim(); }
      document.addEventListener('visibilitychange', aoVisib);
      var mqRed = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      function aoMudarMov() { if (mqRed.matches) { est.animar = false; atualizarAnim(); } }
      if (mqRed && mqRed.addEventListener) mqRed.addEventListener('change', aoMudarMov);

      /* ---------- Quiz ---------- */
      var cenaQ = null, quiz = { lista: [], i: 0, acertos: 0, resp: false };
      var nQ = clamp(Number(opts.questoes) || 8, 3, 20);
      function novoQuiz() { quiz = { lista: gerarQuestoes(nQ), i: 0, acertos: 0, resp: false }; mostrarQuestao(); }
      function mostrarQuestao() {
        vQuiz.innerHTML = '';
        if (quiz.i >= quiz.lista.length) { mostrarResultado(); return; }
        var q = quiz.lista[quiz.i];
        quiz.resp = false;
        var cab = h('div', { class: 'bf-quiz-cab' },
          h('span', { class: 'bf-quiz-n' }, 'Pergunta ' + (quiz.i + 1) + ' de ' + quiz.lista.length),
          h('span', { class: 'bf-quiz-p' }, quiz.acertos + (quiz.acertos === 1 ? ' acerto' : ' acertos')));
        vQuiz.appendChild(cab);
        vQuiz.appendChild(VL.ui.medidor(quiz.i / quiz.lista.length));
        if (q.cena) {
          cenaQ = Cena({ barco: false });
          cenaQ.ajustar(ins.corpo.clientWidth);
          vQuiz.appendChild(h('div', { class: 'bf-cena-caixa bf-cena-quiz' }, cenaQ.el));
          cenaQ.definir(q.forca, tempo);
        } else cenaQ = null;
        mostrarCtlAnim();
        vQuiz.appendChild(h('p', { class: 'questao-enunciado bf-enunciado' }, q.enunciado));
        var lista = h('div', { class: 'alternativas', role: 'radiogroup', 'aria-label': 'Alternativas' });
        var expl = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        var prox = h('button', { type: 'button', class: 'btn btn-primary bf-prox', hidden: true, onclick: function () { quiz.i++; mostrarQuestao(); } }, quiz.i + 1 < quiz.lista.length ? 'Próxima pergunta' : 'Ver resultado');
        q.alternativas.forEach(function (txt, k) {
          var b = h('button', { type: 'button', class: 'alternativa', role: 'radio', 'aria-checked': 'false', onclick: function () { responder(k); } },
            h('span', { class: 'alternativa-letra' }, 'ABCD'[k]), h('span', null, txt));
          lista.appendChild(b);
        });
        function responder(k) {
          if (quiz.resp) return;
          quiz.resp = true;
          var ok = k === q.correta;
          if (ok) quiz.acertos++;
          VL.$$('.alternativa', lista).forEach(function (b, j) {
            b.disabled = true;
            if (j === q.correta) b.setAttribute('data-res', 'certa');
            else if (j === k) b.setAttribute('data-res', 'errada');
            if (j === k) b.setAttribute('aria-checked', 'true');
          });
          expl.hidden = false;
          expl.innerHTML = '';
          expl.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não é essa.'));
          expl.appendChild(h('p', { class: 'mb-0' }, q.explicacao));
          if (q.forca != null) expl.appendChild(h('button', { type: 'button', class: 'btn btn-quiet btn-sm bf-ver', onclick: function () { trocarModo('explorar'); definir(q.forca); } }, 'Ver a força ' + q.forca + ' no modo explorar'));
          prox.hidden = false;
          prox.focus();
        }
        vQuiz.appendChild(lista);
        vQuiz.appendChild(expl);
        vQuiz.appendChild(h('div', { class: 'btn-row bf-quiz-rodape' }, prox));
      }
      function mostrarResultado() {
        cenaQ = null; mostrarCtlAnim();
        var frac = quiz.acertos / quiz.lista.length;
        vQuiz.appendChild(h('div', { class: 'resultado', 'data-aprovado': frac >= 0.7 ? '1' : '0' },
          h('p', { class: 'stat-v' }, quiz.acertos + ' de ' + quiz.lista.length),
          h('p', null, frac >= 0.7 ? 'Bom olho para o mar. Repita para ver outras perguntas.' : 'Vale rever a tabela no modo explorar e tentar de novo.'),
          h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn btn-primary', onclick: novoQuiz }, 'Nova rodada'),
            h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarModo('explorar'); } }, 'Voltar a explorar'))));
      }

      function trocarModo(m) {
        est.modo = m;
        vExp.hidden = m !== 'explorar'; vQuiz.hidden = m !== 'quiz';
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        ins.raiz.setAttribute('data-modo', m);
        if (m === 'quiz' && !quiz.lista.length) novoQuiz();
        if (m === 'quiz' && cenaQ == null && quiz.lista.length) { /* mantém a pergunta atual */ }
        if (m === 'explorar') cena.passo(tempo, 0);
        mostrarCtlAnim();
      }

      medir();
      definir(est.forca);
      trocarModo(est.modo);
      atualizarAnim();

      return function limpar() {
        est.animar = false;
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        if (io) io.disconnect();
        if (ro) ro.disconnect();
        document.removeEventListener('visibilitychange', aoVisib);
        if (mqRed && mqRed.removeEventListener) mqRed.removeEventListener('change', aoMudarMov);
      };
    },
  });

  // Exposto para testes (node) e reutilização por outros widgets.
  VL.beaufort = { TABELA: F, DOUGLAS: DOUGLAS, douglas: douglas, forcaDeNos: forcaDeNos, VELA: VELA };
})();
