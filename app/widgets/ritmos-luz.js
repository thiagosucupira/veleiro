/* Widget "ritmos-luz": decodificador de característica de luz (faróis, faroletes e boias).
   Também expõe VL.luz (analisador, gerador de fases, lâmpada e linha do tempo), reutilizado por "boias-iala".

   Fontes usadas (citadas na interface):
   - Lista de Faróis (DH2), DHN/CHM, 40ª ed. (2026–2027), Introdução, itens 3.1 (termos), 3.3 (características das luzes),
     3.5 (alcances; D = 1,927(√H + √h)) e 4.2 (Região "B"). A numeração dos itens foi conferida no PDF da 40ª ed. em
     2026-10-09. As durações "típicas" de lampejo e eclipse usadas na animação vêm de fases detalhadas reais publicadas
     nessa Lista (ex.: R(3) B 10s = 0,4–0,6 ×2, 0,4–7,6: nº 214, Ilha das Onças, conferido na 40ª ed.).
   - IALA, Sistema de Balizamento Marítimo, Região B (a DHN assinou o acordo de 1980 e optou pela Região B:
     Lista de Faróis, item 4.1).
   - IALA, Recomendação O-133 (boia de naufrágio de emergência: Bu 1 s, 0,5 s, Y 1 s, 0,5 s).

   opts de mount (todas opcionais):
     caracteristica: 'Fl(3) W 15s 12M'   característica inicial do decodificador (notação da carta ou da Lista de Faróis)
     modo: 'decodificar' | 'desafio'     aba inicial (padrão 'decodificar')
     exemplos: true                      false esconde os botões de exemplo
   Formatos aceitos pelo analisador: Fl, LFl, Oc, Iso, F, Q, VQ, UQ, IQ, IVQ, IUQ, Mo(X), FFl, Al, Dir, grupos (3) e (2+1),
     "+LFl", cores W R G Y Bu (ou WRG juntas), período "15s", altitude "21m", alcance "12M"; e a notação da Lista de Faróis
     (Lp, LpL, R, MR, UR, B, E, V, A, Az, Alt.). "R" é resolvido pelo contexto (rápida na Lista × vermelha na carta).

   Exemplos de bloco de lição:
     { t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Q(6)+LFl W 15s' } }
     { t: 'widget', w: 'ritmos-luz', opts: { modo: 'desafio' } }

   API reutilizável (outros widgets): VL.luz.analisar(txt), VL.luz.fases(c), VL.luz.faseEm(fs, t), VL.luz.formatar(c, 'intl'|'pt'),
     VL.luz.significado(c), VL.luz.lampada(host, o), VL.luz.linhaTempo(host). Carregue com scripts: ['widgets/ritmos-luz.js']
     e css: ['assets/css/widgets/ritmos-luz.css']. */
(function () {
  'use strict';
  var h = VL.h;
  var seq = 0;
  function uid(p) { seq += 1; return (p || 'rl') + '-' + seq + '-' + Math.random().toString(36).slice(2, 7); }
  function arred(x, c) { var f = Math.pow(10, c == null ? 1 : c); return Math.round(x * f) / f; }
  function num(x, c) { return VL.fmt.num(arred(x, c == null ? 1 : c), 0).replace(/^-0$/, '0'); }
  function numS(x) { var r = arred(x, 2); return VL.fmt.num(r, r % 1 === 0 ? 0 : (Math.round(r * 10) === r * 10 ? 1 : 2)); }
  function intl() { return !!VL.settings.get('intl'); }
  function en(txt) { return h('span', { class: 'rl-en', 'data-intl': 'on' }, ' (' + txt + ')'); }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /* ------------------------------------------------------------------ */
  /* Vocabulário                                                         */
  /* ------------------------------------------------------------------ */
  var CORES = {
    W: { nome: 'branca', en: 'white', pt: 'B', css: '--nav-white' },
    R: { nome: 'encarnada (vermelha)', en: 'red', pt: 'E', css: '--nav-red' },
    G: { nome: 'verde', en: 'green', pt: 'V', css: '--nav-green' },
    Y: { nome: 'amarela', en: 'yellow', pt: 'A', css: '--nav-yellow' },
    Bu: { nome: 'azul', en: 'blue', pt: 'Az', css: '--bz-azul-luz' },
  };
  var COR_PT = { B: 'W', E: 'R', V: 'G', A: 'Y', AZ: 'Bu', AM: 'Y' };
  var COR_INTL = { W: 'W', R: 'R', G: 'G', Y: 'Y', BU: 'Bu' };

  var RITMOS = {
    F: { nome: 'fixa', en: 'fixed', pt: 'F', desc: 'Luz contínua: não apaga.' },
    Oc: { nome: 'ocultação', en: 'occulting', pt: 'Oc', desc: 'A luz fica acesa mais tempo do que apagada. Os apagões curtos (ocultações) têm a mesma duração.' },
    Iso: { nome: 'isofásica', en: 'isophase', pt: 'Iso', desc: 'Tempo de luz igual ao tempo de escuridão.' },
    Fl: { nome: 'lampejo', en: 'flashing', pt: 'Lp', desc: 'A luz fica apagada mais tempo do que acesa. Os lampejos têm a mesma duração e se repetem menos de 50 vezes por minuto.' },
    LFl: { nome: 'lampejo longo', en: 'long-flashing', pt: 'LpL', desc: 'Lampejo que dura 2 segundos ou mais.' },
    Q: { nome: 'rápida', en: 'quick', pt: 'R', desc: 'Lampejos repetidos de 50 a 79 vezes por minuto. Aqui animada a 60 por minuto (1 por segundo).' },
    VQ: { nome: 'muito rápida', en: 'very quick', pt: 'MR', desc: 'Lampejos repetidos de 80 a 159 vezes por minuto. Aqui animada a 120 por minuto (2 por segundo).' },
    UQ: { nome: 'ultrarrápida', en: 'ultra quick', pt: 'UR', desc: 'Lampejos repetidos de 160 a 299 vezes por minuto. Aqui animada a 240 por minuto.' },
    IQ: { nome: 'rápida interrompida', en: 'interrupted quick', pt: 'RIn', desc: 'Sequência de lampejos rápidos cortada, a intervalos regulares, por um eclipse longo.' },
    IVQ: { nome: 'muito rápida interrompida', en: 'interrupted very quick', pt: 'MRIn', desc: 'Sequência de lampejos muito rápidos cortada por um eclipse longo.' },
    IUQ: { nome: 'ultrarrápida interrompida', en: 'interrupted ultra quick', pt: 'URIn', desc: 'Sequência de lampejos ultrarrápidos cortada por um eclipse longo.' },
    Mo: { nome: 'código Morse', en: 'Morse code', pt: 'Mo', desc: 'Lampejos curtos (pontos) e longos (traços) formam uma letra do código Morse.' },
    FFl: { nome: 'fixa e lampejo', en: 'fixed and flashing', pt: 'FLp', desc: 'Luz fixa fraca com lampejos mais fortes por cima.' },
  };
  /* palavras reconhecidas (minúsculas) */
  var PAL_INTL = { f: 'F', oc: 'Oc', iso: 'Iso', fl: 'Fl', lfl: 'LFl', q: 'Q', vq: 'VQ', uq: 'UQ', iq: 'IQ', ivq: 'IVQ', iuq: 'IUQ', mo: 'Mo', ffl: 'FFl' };
  var PAL_COMUM = { f: 1, oc: 1, iso: 1, mo: 1 }; /* iguais nas duas notações */
  var PAL_PT = { lp: 'Fl', lpl: 'LFl', mr: 'VQ', ur: 'UQ', rin: 'IQ', mrin: 'IVQ', urin: 'IUQ', flp: 'FFl' };
  var MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.' };
  /* ciclo (s) e duração do lampejo (s) das luzes rápidas — valores de fases reais da Lista de Faróis */
  var RAPIDA = { Q: { ciclo: 1.0, lp: 0.3 }, VQ: { ciclo: 0.5, lp: 0.2 }, UQ: { ciclo: 0.25, lp: 0.1 } };
  var BASE_INTERROMPIDA = { IQ: 'Q', IVQ: 'VQ', IUQ: 'UQ' };

  /* ------------------------------------------------------------------ */
  /* Analisador                                                          */
  /* ------------------------------------------------------------------ */
  function tokenizar(s) {
    var out = [], i = 0, n = s.length, m;
    while (i < n) {
      var resto = s.slice(i), ch = s[i];
      if ((m = /^(\d+(?:[.,]\d+)?)\s*(seg|sec|NM|milhas|mn|s|M|m)?/.exec(resto)) && /\d/.test(ch)) {
        var v = parseFloat(m[1].replace(',', '.')), u = m[2] || '';
        var t = u === 'm' ? 'altitude' : (u === 'M' || u === 'NM' || u === 'milhas' || u === 'mn') ? 'alcance' : u ? 'periodo' : 'numero';
        out.push({ t: t, v: v, txt: m[0].replace(/\s+/g, '') });
        i += m[0].length; continue;
      }
      if (ch === '(') {
        var j = s.indexOf(')', i);
        if (j < 0) { out.push({ t: 'grupo', v: s.slice(i + 1).trim(), txt: s.slice(i) + ')', aberto: true }); break; }
        out.push({ t: 'grupo', v: s.slice(i + 1, j).replace(/\s+/g, ''), txt: '(' + s.slice(i + 1, j).replace(/\s+/g, '') + ')' });
        i = j + 1; continue;
      }
      if (ch === '+') { out.push({ t: 'mais', txt: '+' }); i++; continue; }
      if ((m = /^[A-Za-zÀ-ÿ]+/.exec(resto))) { out.push({ t: 'palavra', v: m[0], txt: m[0] }); i += m[0].length; continue; }
      if (/[\s.,;:·\-–—\/]/.test(ch)) { i++; continue; }
      out.push({ t: 'estranho', v: ch, txt: ch }); i++;
    }
    return out;
  }
  /* tenta decompor uma palavra em códigos de cor: "WRG" → W,R,G; "BuY" → Bu,Y; "BE" → B,E (Lista de Faróis) */
  function decomporCores(w) {
    var res = [], i = 0, U = w.toUpperCase();
    while (i < U.length) {
      var dois = U.slice(i, i + 2), um = U[i];
      if (dois === 'BU') { res.push({ c: 'Bu', pt: false }); i += 2; continue; }
      if (dois === 'AZ') { res.push({ c: 'Bu', pt: true }); i += 2; continue; }
      if (dois === 'AM') { res.push({ c: 'Y', pt: true }); i += 2; continue; }
      if (COR_INTL[um] && um !== 'B') { res.push({ c: COR_INTL[um], pt: false, ambigua: um === 'R' }); i++; continue; }
      if (COR_PT[um]) { res.push({ c: COR_PT[um], pt: true }); i++; continue; }
      return null;
    }
    return res.length ? res : null;
  }

  /**
   * VL.luz.analisar('Fl(3) W 15s 12M') → característica normalizada:
   * {ok, erro, notacao: 'intl'|'pt'|'misto', ritmo, grupos, morse, extra, alt, dir, cores[], periodo, periodoInformado,
   *  altitude, alcance, avisos[], pecas[{txt, titulo, desc}]}
   */
  function analisar(entrada) {
    var s = String(entrada || '').trim();
    var c = { entrada: s, ok: false, erro: null, notacao: 'intl', ritmo: null, grupos: null, morse: null, extra: null, alt: false, dir: false, cores: [], periodo: null, periodoInformado: false, altitude: null, alcance: null, avisos: [], pecas: [] };
    if (!s) { c.erro = 'Digite uma característica, por exemplo Fl(3) W 15s.'; return c; }
    var tk = tokenizar(s);
    /* 1ª passada: sinais de cada notação, para resolver "R" (rápida na Lista de Faróis × vermelha nas cartas) */
    var sinaisPt = 0, sinaisIntl = 0;
    tk.forEach(function (t) {
      if (t.t !== 'palavra') return;
      var w = t.v.toLowerCase();
      if (PAL_PT[w] || w === 'alt') sinaisPt++;
      else if (PAL_COMUM[w]) return;
      else if (PAL_INTL[w] || w === 'al') sinaisIntl++;
      else if (w !== 'r' && w !== 'dir') {
        var cs = decomporCores(t.v);
        if (cs) cs.forEach(function (x) { if (x.pt) sinaisPt++; else if (!x.ambigua) sinaisIntl++; });
      }
    });
    var usouPt = false, usouIntl = false, ultimoRitmo = null, esperandoExtra = false, desconhecidas = [];
    function poeRitmo(r, txt, pt) {
      if (esperandoExtra && c.ritmo) { c.extra = { ritmo: r, txt: txt }; ultimoRitmo = 'extra'; esperandoExtra = false; }
      else if (!c.ritmo) { c.ritmo = r; ultimoRitmo = 'base'; }
      else c.avisos.push('Mais de um ritmo informado ("' + txt + '"); usamos só o primeiro.');
      if (pt) usouPt = true; else usouIntl = true;
    }
    for (var k = 0; k < tk.length; k++) {
      var t = tk[k];
      if (t.t === 'palavra') {
        var w = t.v.toLowerCase(), usouIntlAntes = usouIntl;
        if (w === 'al' || w === 'alt') { c.alt = true; if (w === 'alt') usouPt = true; else usouIntl = true; continue; }
        if (w === 'dir') { c.dir = true; continue; }
        if (w === 'r') {
          var comoRapida = !c.ritmo && !(c.alt && sinaisIntl > 0) && (sinaisPt >= sinaisIntl);
          if (esperandoExtra) comoRapida = true;
          if (comoRapida) { poeRitmo('Q', 'R', true); continue; }
          c.cores.push('R'); usouIntl = true; continue;
        }
        if (PAL_PT[w]) { poeRitmo(PAL_PT[w], t.v, true); continue; }
        if (PAL_INTL[w]) { poeRitmo(PAL_INTL[w], t.v, false); if (PAL_COMUM[w]) usouIntl = usouIntlAntes; continue; }
        var cs = decomporCores(t.v);
        if (cs) { cs.forEach(function (x) { c.cores.push(x.c); if (x.pt) usouPt = true; else if (!x.ambigua) usouIntl = true; }); continue; }
        /* ritmo colado na cor: "FlG", "LpV" */
        var achou = false;
        for (var L = Math.min(4, t.v.length - 1); L >= 1 && !achou; L--) {
          var pre = t.v.slice(0, L).toLowerCase(), pos = t.v.slice(L);
          var r = PAL_PT[pre] || PAL_INTL[pre], cs2 = decomporCores(pos);
          if (r && cs2) { poeRitmo(r, t.v.slice(0, L), !!PAL_PT[pre]); cs2.forEach(function (x) { c.cores.push(x.c); }); achou = true; }
        }
        if (!achou) desconhecidas.push(t.v);
        continue;
      }
      if (t.t === 'grupo') {
        var g = t.v;
        if (ultimoRitmo == null) { c.avisos.push('Parênteses "' + t.txt + '" sem ritmo antes; ignorado.'); continue; }
        var alvo = ultimoRitmo === 'extra' ? c.extra : c;
        var ritmoAlvo = ultimoRitmo === 'extra' ? c.extra.ritmo : c.ritmo;
        if (ritmoAlvo === 'Mo') {
          var letras = g.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (!letras) { c.avisos.push('Código Morse sem letra.'); continue; }
          alvo.morse = letras;
        } else if (/^\d+(\+\d+)*$/.test(g)) {
          alvo.grupos = g.split('+').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
          if (!alvo.grupos.length) alvo.grupos = null;
        } else c.avisos.push('Não entendemos o grupo "' + t.txt + '".');
        continue;
      }
      if (t.t === 'mais') { if (c.ritmo) esperandoExtra = true; continue; }
      if (t.t === 'periodo') { c.periodo = t.v; c.periodoInformado = true; continue; }
      if (t.t === 'altitude') { c.altitude = t.v; continue; }
      if (t.t === 'alcance') { if (c.alcance == null) c.alcance = t.v; continue; }
      if (t.t === 'numero') {
        if (c.periodo == null && c.ritmo) { c.periodo = t.v; c.periodoInformado = true; c.avisos.push('Número "' + t.txt + '" sem unidade: entendemos como período em segundos.'); }
        else c.avisos.push('Número "' + t.txt + '" sem unidade (use s, m ou M); ignorado.');
        continue;
      }
      if (t.t === 'estranho') desconhecidas.push(t.v);
    }
    if (desconhecidas.length) c.avisos.push('Não reconhecido: ' + desconhecidas.map(function (x) { return '"' + x + '"'; }).join(', ') + '.');
    c.notacao = usouPt && usouIntl ? 'misto' : usouPt ? 'pt' : 'intl';
    if (c.notacao === 'misto') c.avisos.push('Você misturou a notação das cartas (internacional) com a da Lista de Faróis. Entendemos assim mesmo.');
    if (!c.ritmo) {
      if (c.alt || c.dir) c.ritmo = 'F';
      else { c.erro = 'Faltou o ritmo (por exemplo Fl, Oc, Iso, Q, LFl, Mo… ou, na Lista de Faróis, Lp, R, MR, LpL).'; return c; }
    }
    if (c.extra && !(c.extra.ritmo === 'LFl')) c.avisos.push('Combinação incomum: ' + c.ritmo + ' + ' + c.extra.ritmo + '. A única combinação padronizada é Q(6)+LFl / VQ(6)+LFl (cardinal sul).');
    if (!c.cores.length) { c.cores = ['W']; c.corOmitida = true; }
    /* a Lista de Faróis repete a cor em cada parte ("R(6) B. + LpL. B."): sem alternância, cores repetidas são uma só */
    if (!c.alt) c.cores = c.cores.filter(function (k, i) { return c.cores.indexOf(k) === i; });
    if (c.ritmo === 'Mo' && !c.morse) { c.morse = 'A'; c.avisos.push('Mo sem letra: usamos Mo(A).'); }
    if (c.dir && c.alt) c.avisos.push('Luz direcional alternada: animamos a alternância.');
    validar(c);
    c.pecas = explicar(c);
    c.ok = true;
    return c;
  }

  function nLampejos(gr) { return (gr || [1]).reduce(function (a, b) { return a + b; }, 0); }
  function periodoPadrao(c) {
    var r = c.ritmo, n = nLampejos(c.grupos);
    if (r === 'Fl') return n > 1 ? (n >= 4 ? 15 : 10) : 5;
    if (r === 'LFl') return 10;
    if (r === 'Oc' || r === 'Iso') return 4;
    if (r === 'Mo') return 8;
    if (r === 'FFl') return 10;
    if (RAPIDA[r]) { if (!c.grupos && !c.extra) return RAPIDA[r].ciclo; if (c.extra) return r === 'Q' ? 15 : 10; return r === 'Q' ? (n <= 3 ? 10 : 15) : (n <= 3 ? 5 : 10); }
    if (BASE_INTERROMPIDA[r]) return 10;
    return null;
  }
  function validar(c) {
    var r = c.ritmo;
    var continua = r === 'F' || (RAPIDA[r] && !c.grupos && !c.extra);
    if (continua) {
      if (RAPIDA[r] && c.periodoInformado && Math.abs(c.periodo - RAPIDA[r].ciclo) > 0.35) c.avisos.push(RITMOS[r].nome[0].toUpperCase() + RITMOS[r].nome.slice(1) + ' contínua não tem período de grupo; ignoramos "' + numS(c.periodo) + ' s".');
      if (RAPIDA[r]) c.periodo = RAPIDA[r].ciclo;
      if (r === 'F' && !c.alt) c.periodo = null;
    }
    if (c.alt && r === 'F' && !c.periodo) c.periodo = c.cores.length === 2 && c.cores[0] === 'Bu' && c.cores[1] === 'Y' ? 3 : 4;
    if (!c.periodo && !continua) {
      c.periodo = periodoPadrao(c);
      if (c.periodo) c.avisos.push('Faltou o período; usamos ' + numS(c.periodo) + ' s só para animar.');
    }
    var P = c.periodo;
    if (r === 'Fl' && !c.alt && P && nLampejos(c.grupos) === 1 && P <= 1.2) c.avisos.push('Lampejos a cada ' + numS(P) + ' s dão ' + Math.round(60 / P) + ' por minuto: isso já é luz rápida (Q), não lampejo (Fl).');
    if (r === 'LFl' && P && P < 4) c.avisos.push('Lampejo longo dura no mínimo 2 s; um período de ' + numS(P) + ' s fica apertado.');
    if (RAPIDA[r] && (c.grupos || c.extra)) {
      var n = nLampejos(c.grupos) * 1, ciclo = RAPIDA[r].ciclo;
      var precisa = n * ciclo + (c.extra ? 2 + 1 : 0.5);
      if (P && precisa > P) c.avisos.push('Com ' + RITMOS[r].nome + ' (' + Math.round(60 / ciclo) + ' por minuto), ' + n + ' lampejos' + (c.extra ? ' mais o lampejo longo' : '') + ' não cabem bem em ' + numS(P) + ' s.');
    }
    if (c.cores.length > 1 && !c.alt) c.setor = true;
  }

  /* explicação peça por peça */
  function explicar(c) {
    var p = [], R = RITMOS[c.ritmo];
    function grupoTxt(gr) { return '(' + gr.join('+') + ')'; }
    if (c.dir) p.push({ txt: 'Dir', titulo: 'Luz direcional', en: 'directional light', desc: 'Exibe a luz num setor bem estreito para marcar uma direção (por exemplo, o eixo de um canal). Pode ter setores de outras cores dos lados.' });
    if (c.alt) p.push({ txt: c.notacao === 'pt' ? 'Alt' : 'Al', titulo: 'Alternada', en: 'alternating', desc: 'A luz muda de cor, alternando entre as cores indicadas.' });
    var rTxt = (c.notacao === 'pt' ? R.pt : c.ritmo) + (c.grupos ? grupoTxt(c.grupos) : '') + (c.morse ? '(' + c.morse + ')' : '');
    var titulo = R.nome[0].toUpperCase() + R.nome.slice(1), desc = R.desc;
    if (c.grupos && c.grupos.length > 1) { titulo = 'Grupo composto de ' + R.nome + ' ' + grupoTxt(c.grupos); desc += ' ' + grupoTxt(c.grupos) + ' = grupos diferentes em sequência: ' + c.grupos.join(', depois ') + ', e então o eclipse longo.'; }
    else if (c.grupos && c.grupos[0] > 1) { titulo = 'Grupo de ' + c.grupos[0] + (c.ritmo === 'Oc' ? ' ocultações' : ' lampejos') + (RAPIDA[c.ritmo] ? ' (' + R.nome + ')' : ''); desc += ' (' + c.grupos[0] + ') = ' + c.grupos[0] + (c.ritmo === 'Oc' ? ' ocultações seguidas, depois luz longa.' : ' lampejos seguidos, depois um eclipse longo.'); }
    if (c.morse) { titulo = 'Código Morse, letra ' + c.morse; desc += ' ' + c.morse.split('').map(function (l) { return l + ' = ' + (MORSE[l] || '?').replace(/\./g, '·').replace(/-/g, '—'); }).join('; ') + ' (· ponto curto, — traço longo).'; }
    p.push({ txt: rTxt, titulo: titulo, en: R.en, desc: desc, alt: (c.notacao === 'pt' ? c.ritmo : R.pt) + (c.grupos ? grupoTxt(c.grupos) : '') + (c.morse ? '(' + c.morse + ')' : '') });
    if (c.extra) {
      var E = RITMOS[c.extra.ritmo];
      p.push({ txt: '+' + (c.notacao === 'pt' ? E.pt : c.extra.ritmo), titulo: 'Mais um ' + E.nome, en: E.en, desc: 'Depois do grupo vem um ' + E.nome + (c.extra.ritmo === 'LFl' ? ' (2 s ou mais). Q(6)+LFl e VQ(6)+LFl são exclusivas do sinal cardinal sul.' : '.') });
    }
    var cs = c.cores.map(function (k) { return CORES[k]; });
    var corTxt = c.cores.map(function (k) { return c.notacao === 'pt' ? CORES[k].pt : k; }).join('');
    var corDesc = cs.map(function (x, i) { return (c.notacao === 'pt' ? x.pt : c.cores[i]) + ' = ' + x.nome; }).join('; ') + '.';
    if (c.corOmitida) p.push({ txt: '(sem cor)', titulo: 'Branca', en: 'white', desc: 'Sem letra de cor, a luz é branca: nas cartas, a letra W costuma ser omitida quando a luz é só branca.' });
    else p.push({ txt: corTxt, titulo: cs.length > 1 ? (c.alt ? 'Cores que se alternam' : (c.dir ? 'Cores dos setores' : 'Luz de setores')) : 'Cor ' + cs[0].nome, en: cs.map(function (x) { return x.en; }).join(', '), desc: corDesc + (c.notacao !== 'pt' ? ' Na Lista de Faróis da DHN: ' + c.cores.map(function (k) { return CORES[k].pt; }).join(', ') + '.' : ' Nas cartas (notação internacional): ' + c.cores.join(', ') + '.') + (cs.length > 1 && !c.alt ? ' Cada cor aparece num setor do horizonte: a cor que você vê depende de onde está. Os limites dos setores estão na carta e na Lista de Faróis (marcações verdadeiras, do mar para o sinal).' : '') });
    if (c.periodo && !(RAPIDA[c.ritmo] && !c.grupos && !c.extra) && c.ritmo !== 'F' || (c.alt && c.periodo)) {
      p.push({ txt: numS(c.periodo) + 's', titulo: 'Período de ' + numS(c.periodo) + ' segundos', en: 'period', desc: 'Tempo que o ciclo completo leva para se repetir. Cronometre do início de um grupo até o início do seguinte.' + (c.periodoInformado ? '' : ' (Não informado: usamos um valor só para animar.)') });
    }
    if (c.altitude != null) p.push({ txt: numS(c.altitude) + 'm', titulo: 'Altitude de ' + numS(c.altitude) + ' m', en: 'elevation', desc: 'Altura do foco da luz acima do nível médio do mar. Junto com a altura dos seus olhos, define o alcance geográfico.' });
    if (c.alcance != null) p.push({ txt: numS(c.alcance) + 'M', titulo: 'Alcance de ' + numS(c.alcance) + ' milhas náuticas', en: 'range', desc: 'Distância de onde a luz pode ser vista, em milhas náuticas (1 M = 1.852 m). Na Lista de Faróis da DHN, o alcance luminoso é calculado para visibilidade meteorológica de 18,4 milhas; com tempo pior, você verá a luz mais perto.' });
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* Fases (durações em segundos)                                        */
  /* ------------------------------------------------------------------ */
  function fasesUnidade(c, P, cor) {
    var r = c.ritmo, f = [];
    function on(d, nivel) { if (d > 0) f.push({ on: true, dur: d, cor: cor, nivel: nivel || 1 }); }
    function off(d) { if (d > 0) f.push({ on: false, dur: d, cor: cor, nivel: 0 }); }
    function completa() {
      var soma = f.reduce(function (a, x) { return a + x.dur; }, 0);
      var falta = P - soma;
      if (falta > 1e-6) { if (f.length && !f[f.length - 1].on) f[f.length - 1].dur += falta; else off(falta); }
    }
    if (r === 'F') { on(P); return f; }
    if (r === 'Iso') { on(P / 2); off(P / 2); return f; }
    if (r === 'Oc') {
      var gr = c.grupos || [1], nE = nLampejos(gr);
      var e = P <= 2.5 ? 0.5 : (P <= 12 ? 1.0 : 1.5);
      var lin = e, lentre = 2 * e;
      var escuro = nE * e, claroCurto = (nE - gr.length) * lin + (gr.length - 1) * lentre;
      if (escuro + claroCurto > P * 0.62) { var k = (P * 0.62) / (escuro + claroCurto); e *= k; lin *= k; lentre *= k; }
      escuro = nE * e; claroCurto = (nE - gr.length) * lin + (gr.length - 1) * lentre;
      on(P - escuro - claroCurto);
      gr.forEach(function (n, gi) {
        for (var j = 0; j < n; j++) { off(e); if (j < n - 1) on(lin); }
        if (gi < gr.length - 1) on(lentre);
      });
      return f;
    }
    if (r === 'Fl' || r === 'LFl') {
      var grp = c.grupos || [1], n = nLampejos(grp);
      var d = r === 'LFl' ? 2.0 : (P <= 3 ? 0.3 : (P <= 10 || n > 3 ? 0.5 : 1.0));
      var ei = r === 'LFl' ? 2.0 : (P <= 6 ? 0.5 : 1.0);
      var eg = r === 'LFl' ? 3.0 : ei * 2 + (P <= 6 ? 0.5 : 0);
      var uso = n * d + (n - grp.length) * ei + (grp.length - 1) * eg;
      var lim = r === 'LFl' ? 0.8 : 0.6;
      if (uso > P * lim) { var q = (P * lim) / uso; d *= q; ei *= q; eg *= q; }
      grp.forEach(function (nn, gi) {
        for (var j = 0; j < nn; j++) { on(d); if (j < nn - 1) off(ei); }
        if (gi < grp.length - 1) off(eg);
      });
      completa(); return f;
    }
    if (RAPIDA[r]) {
      var ciclo = RAPIDA[r].ciclo, lp = RAPIDA[r].lp;
      if (!c.grupos && !c.extra) { on(lp); off(ciclo - lp); return f; }
      var nq = nLampejos(c.grupos || [1]);
      var precisa = nq * ciclo + (c.extra ? 2.0 + 0.5 : 0.3);
      if (precisa > P) { var s = P / precisa; ciclo *= s; lp *= s; }
      for (var i = 0; i < nq; i++) { on(lp); off(ciclo - lp); }
      if (c.extra) on(c.extra.ritmo === 'LFl' ? Math.min(2.0, P * 0.2) : lp);
      completa(); return f;
    }
    if (BASE_INTERROMPIDA[r]) {
      var b = RAPIDA[BASE_INTERROMPIDA[r]], nI = Math.max(2, Math.floor((P * 0.6) / b.ciclo));
      for (var ii = 0; ii < nI; ii++) { on(b.lp); off(b.ciclo - b.lp); }
      completa(); return f;
    }
    if (r === 'Mo') {
      var letras = (c.morse || 'A').split(''), u = 0.5;
      var unidades = 0;
      letras.forEach(function (l, li) { var cod = MORSE[l] || '.'; cod.split('').forEach(function (s2, si) { unidades += s2 === '-' ? 3 : 1; if (si < cod.length - 1) unidades += 1; }); if (li < letras.length - 1) unidades += 3; });
      if (unidades * u > P * 0.7) u = (P * 0.7) / unidades;
      letras.forEach(function (l, li) {
        var cod = MORSE[l] || '.';
        cod.split('').forEach(function (s2, si) { on(s2 === '-' ? 3 * u : u); if (si < cod.length - 1) off(u); });
        if (li < letras.length - 1) off(3 * u);
      });
      completa(); return f;
    }
    if (r === 'FFl') {
      var nF = nLampejos(c.grupos || [1]), dF = P <= 4 ? 0.3 : 0.6, eF = 0.6;
      on(Math.max(0.2, P - nF * dF - (nF - 1) * eF), 0.32);
      for (var jj = 0; jj < nF; jj++) { on(dF, 1); if (jj < nF - 1) on(eF, 0.32); }
      return juntar(f);
    }
    on(P); return f;
  }
  function juntar(f) {
    var out = [];
    f.forEach(function (x) {
      var u = out[out.length - 1];
      if (u && u.on === x.on && u.cor === x.cor && u.nivel === x.nivel) u.dur += x.dur; else out.push(Object.assign({}, x));
    });
    return out;
  }
  /**
   * VL.luz.fases(c, corSetor?) → {lista:[{on, dur, cor, nivel, ini}], periodo, janela, ilustrativa}
   * Luz de setores: usa corSetor (ou a 1ª cor). Alternada: um subperíodo para cada cor da sequência.
   */
  function fases(c, corSetor) {
    var P = c.periodo || 4, lista = [];
    if (c.alt) {
      var seqc = c.cores.length > 1 ? c.cores : [c.cores[0], c.cores[0]];
      if (c.ritmo === 'F' && seqc.length === 2 && seqc[0] === 'Bu' && seqc[1] === 'Y') {
        /* IALA O-133: Bu 1,0 s + 0,5 s + Y 1,0 s + 0,5 s */
        var esc = P / 3;
        lista = [{ on: true, dur: 1 * esc, cor: 'Bu', nivel: 1 }, { on: false, dur: 0.5 * esc, cor: 'Bu', nivel: 0 }, { on: true, dur: 1 * esc, cor: 'Y', nivel: 1 }, { on: false, dur: 0.5 * esc, cor: 'Y', nivel: 0 }];
      } else {
        var sub = P / seqc.length;
        seqc.forEach(function (k) { lista = lista.concat(fasesUnidade(c, sub, k)); });
        lista = juntar(lista);
      }
    } else {
      var cor = corSetor && c.cores.indexOf(corSetor) >= 0 ? corSetor : c.cores[0];
      lista = fasesUnidade(c, P, cor);
    }
    var t = 0;
    lista.forEach(function (x) { x.ini = t; t += x.dur; });
    var continua = c.ritmo === 'F' && !c.alt;
    var rapidaContinua = RAPIDA[c.ritmo] && !c.grupos && !c.extra;
    return { lista: lista, periodo: t, janela: continua ? 4 : (rapidaContinua ? 4 : t), continua: continua, rapidaContinua: rapidaContinua, ilustrativa: c.ritmo !== 'F' && c.ritmo !== 'Iso' };
  }
  function faseEm(fs, t) {
    var P = fs.periodo, x = ((t % P) + P) % P, L = fs.lista;
    for (var i = 0; i < L.length; i++) if (x < L[i].ini + L[i].dur || i === L.length - 1) return { i: i, f: L[i], x: x };
    return { i: 0, f: L[0], x: x };
  }

  /* "Fase detalhada" no formato da Lista de Faróis: "B. 0,5 – Ecl. 1,5" */
  function faseDetalhada(c, fs) {
    var L = fs.lista, linhas = [], atual = null;
    L.forEach(function (x) {
      if (x.on) { if (atual) linhas.push(atual); atual = { cor: x.cor, luz: x.dur, ecl: 0, nivel: x.nivel }; }
      else if (atual) atual.ecl += x.dur;
      else linhas.push({ cor: null, luz: 0, ecl: x.dur });
    });
    if (atual) linhas.push(atual);
    if (c.ritmo === 'FFl') return null;
    function d1(x) { var r = arred(x, 2); return VL.fmt.num(r, Math.round(r * 10) === r * 10 ? 1 : 2); }
    return linhas.map(function (l) { return (l.cor ? CORES[l.cor].pt + '. ' + d1(l.luz) : '') + (l.ecl > 0.001 ? (l.cor ? ' – ' : '') + 'Ecl. ' + d1(l.ecl) : ''); });
  }

  function formatar(c, notacao) {
    if (!c || !c.ritmo) return '';
    var pt = notacao === 'pt', R = RITMOS[c.ritmo], partes = [];
    if (c.dir) partes.push(pt ? 'L. dir.' : 'Dir');
    var base = (pt ? R.pt : c.ritmo) + (c.grupos ? '(' + c.grupos.join('+') + ')' : '') + (c.morse ? '(' + c.morse + ')' : '');
    if (c.ritmo === 'F' && (c.alt || c.dir)) base = '';
    if (c.extra) base += '+' + (pt ? RITMOS[c.extra.ritmo].pt : c.extra.ritmo);
    if (pt) { if (base) partes.push(base); if (c.alt) partes.push('Alt.'); }
    else { if (c.alt) partes.push('Al'); if (base) partes.push(base); }
    var cores = c.cores.map(function (k) { return pt ? CORES[k].pt : k; });
    partes.push(pt ? cores.join('') + '.' : cores.join(''));
    var continua = c.ritmo === 'F' && !c.alt || (RAPIDA[c.ritmo] && !c.grupos && !c.extra);
    if (c.periodo && !continua) partes.push(numS(c.periodo) + 's');
    if (c.altitude != null) partes.push(numS(c.altitude) + 'm');
    if (c.alcance != null) partes.push(numS(c.alcance) + 'M');
    return partes.join(' ');
  }

  /* Significado no Sistema de Balizamento IALA, Região B (boias e balizas) */
  function significado(c) {
    if (!c || !c.ok) return null;
    var r = c.ritmo, cores = c.cores, P = c.periodo, gr = c.grupos, n = nLampejos(gr);
    var so = function (k) { return cores.length === 1 && cores[0] === k; };
    var perto = function (a, b) { return P && Math.abs(P - b) < 0.6; };
    if (c.alt && cores.indexOf('Bu') >= 0 && cores.indexOf('Y') >= 0) return { id: 'naufragio', txt: 'Lampejos alternados azul e amarelo: boia de naufrágio de emergência (IALA, Recomendação O-133). Nenhum outro sinal usa luz azul.', ref: 'IALA O-133' };
    if (so('W')) {
      if ((r === 'Q' || r === 'VQ') && !gr && !c.extra) return { id: 'cardinal-n', txt: 'Luz branca ' + RITMOS[r].nome + ' contínua: ritmo do sinal cardinal norte (passe ao norte dele). Novos perigos também são assinalados com luz rápida ou muito rápida.', ref: 'Lista de Faróis, item 4.2' };
      if ((r === 'Q' || r === 'VQ') && gr && gr.length === 1 && n === 3 && !c.extra) return { id: 'cardinal-l', txt: 'Grupo de 3: sinal cardinal leste (passe a leste). Padrão: ' + (r === 'Q' ? 'Q(3) W 10s, na Lista de Faróis R (3) B 10s' : 'VQ(3) W 5s, na Lista de Faróis MR (3) B 5s') + (perto(P, r === 'Q' ? 10 : 5) ? '.' : ' — atenção: o período padrão é ' + (r === 'Q' ? '10' : '5') + ' s.'), ref: 'Lista de Faróis, item 4.2' };
      if ((r === 'Q' || r === 'VQ') && gr && n === 6 && c.extra && c.extra.ritmo === 'LFl') return { id: 'cardinal-s', txt: '6 lampejos e um lampejo longo: sinal cardinal sul (passe ao sul). Padrão: ' + (r === 'Q' ? 'Q(6)+LFl 15s' : 'VQ(6)+LFl 10s') + (perto(P, r === 'Q' ? 15 : 10) ? '.' : ' — atenção ao período.'), ref: 'Lista de Faróis, item 4.2' };
      if ((r === 'Q' || r === 'VQ') && gr && gr.length === 1 && n === 9 && !c.extra) return { id: 'cardinal-o', txt: 'Grupo de 9: sinal cardinal oeste (passe a oeste). Padrão: ' + (r === 'Q' ? 'Q(9) 15s' : 'VQ(9) 10s') + (perto(P, r === 'Q' ? 15 : 10) ? '.' : ' — atenção ao período.'), ref: 'Lista de Faróis, item 4.2' };
      if (r === 'Fl' && gr && gr.length === 1 && n === 2) return { id: 'perigo-isolado', txt: 'Dois lampejos brancos: em boias e balizas, sinal de perigo isolado (perigo pequeno com águas navegáveis em volta). Faróis também podem usar Fl(2).', ref: 'Lista de Faróis, item 4.2' };
      if (r === 'Iso' || r === 'Oc' && !gr || (r === 'LFl' && !gr && perto(P, 10)) || (r === 'Mo' && c.morse === 'A')) return { id: 'aguas-seguras', txt: 'Em boias e balizas, este é um ritmo de sinal de águas seguras (Iso, Oc, LFl 10s ou Mo(A)): há água navegável em volta, como no meio de um canal ou numa aterragem. Faróis e alinhamentos também usam Iso e Oc.', ref: 'Lista de Faróis, item 4.2' };
      return { id: null, txt: 'Luz branca sem significado reservado no balizamento IALA: comum em faróis e faroletes. Identifique pelo nome e posição na carta e na Lista de Faróis.', ref: '' };
    }
    if ((so('G') || so('R')) && r === 'Fl' && gr && gr.length === 2 && gr[0] === 2 && gr[1] === 1) return { id: so('G') ? 'canal-pref-boreste' : 'canal-pref-bombordo', txt: so('G') ? 'Verde Fl(2+1): sinal de canal preferencial a boreste (bombordo modificado). Para seguir o canal principal, deixe-o a bombordo ao entrar.' : 'Encarnada Fl(2+1): sinal de canal preferencial a bombordo (boreste modificado). Para seguir o canal principal, deixe-o a boreste ao entrar.', ref: 'Lista de Faróis, item 4.2' };
    if (so('G')) return { id: 'bombordo', txt: 'Luz verde: na Região B, sinal lateral de bombordo — quem entra vindo do mar deixa-o a bombordo (à esquerda). Qualquer ritmo, exceto Fl(2+1).', ref: 'Lista de Faróis, item 4.2' };
    if (so('R')) return { id: 'boreste', txt: 'Luz encarnada: na Região B, sinal lateral de boreste — quem entra vindo do mar deixa-o a boreste (à direita). Qualquer ritmo, exceto Fl(2+1).', ref: 'Lista de Faróis, item 4.2' };
    if (so('Y')) {
      var reservado = (r === 'LFl' && perto(P, 10)) || (r === 'Mo' && (c.morse === 'A' || c.morse === 'U')) || RAPIDA[r] || r === 'Iso';
      return { id: 'especial', txt: 'Luz amarela: sinal especial (área ou característica indicada na carta: cabo submarino, exercícios, recreação…).' + (reservado ? ' Atenção: este ritmo não é dos previstos para sinais especiais (a Lista de Faróis lista Oc, Fl exceto LFl 10s, Fl(4), Fl(5), Fl(6), Fl(…+…) e Mo exceto A ou U).' : ''), ref: 'Lista de Faróis, item 4.2' };
    }
    if (c.setor || c.dir) return { id: null, txt: 'Luz de setores: comum em faróis e luzes de alinhamento. A cor indica em que setor você está; confira os limites na carta.', ref: '' };
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Componentes visuais reutilizáveis                                   */
  /* ------------------------------------------------------------------ */
  function corCss(k) { return 'var(' + (CORES[k] ? CORES[k].css : '--nav-white') + ')'; }

  /** Lâmpada animada. host: elemento; o: {tamanho, rotulo, aoMudar(info), autoplay} → controlador */
  function lampada(host, o) {
    o = o || {};
    var gid = uid('brilho');
    var svg = h('svg', { viewBox: '0 0 120 120', class: 'rl-lamp-svg', role: 'img', 'aria-label': o.rotulo || 'Lâmpada mostrando o ritmo da luz' });
    var defs = h('defs');
    var grad = h('radialGradient', { id: gid, cx: '50%', cy: '50%', r: '50%' },
      h('stop', { offset: '0%', 'stop-color': 'currentColor', 'stop-opacity': '0.95' }),
      h('stop', { offset: '28%', 'stop-color': 'currentColor', 'stop-opacity': '0.55' }),
      h('stop', { offset: '62%', 'stop-color': 'currentColor', 'stop-opacity': '0.14' }),
      h('stop', { offset: '100%', 'stop-color': 'currentColor', 'stop-opacity': '0' }));
    defs.appendChild(grad); svg.appendChild(defs);
    var g = h('g', { class: 'rl-lamp-g' });
    var brilho = h('circle', { cx: 60, cy: 60, r: 56, fill: 'url(#' + gid + ')', class: 'rl-lamp-brilho' });
    var lente = h('circle', { cx: 60, cy: 60, r: 11, class: 'rl-lamp-lente' });
    var anel = h('circle', { cx: 60, cy: 60, r: 15, class: 'rl-lamp-anel' });
    g.appendChild(brilho); g.appendChild(anel); g.appendChild(lente);
    svg.appendChild(g);
    host.appendChild(svg);
    var est = { fs: null, t: 0, tocando: false, raf: 0, ultimo: 0, visivel: true, iFase: -1, cor: null };
    function aplicar() {
      if (!est.fs) return;
      var q = faseEm(est.fs, est.t), f = q.f;
      var cor = corCss(f.cor);
      /* a cor vai no <svg>: o gradiente do brilho usa currentColor, que é herdado dos ancestrais do gradiente */
      if (cor !== est.cor) { svg.style.color = cor; est.cor = cor; }
      var nivel = f.on ? f.nivel : 0;
      brilho.style.opacity = String(nivel);
      lente.style.fill = f.on ? cor : 'var(--bz-lente-apagada)';
      lente.style.opacity = f.on ? String(0.55 + 0.45 * nivel) : '1';
      if (q.i !== est.iFase) { est.iFase = q.i; if (o.aoFase) o.aoFase(q); }
      if (o.aoQuadro) o.aoQuadro(est.t, q);
    }
    function quadro(agora) {
      est.raf = 0;
      if (!est.tocando || !est.visivel || document.hidden) return;
      if (est.ultimo) est.t += Math.min(0.1, (agora - est.ultimo) / 1000);
      est.ultimo = agora;
      aplicar();
      est.raf = requestAnimationFrame(quadro);
    }
    function agendar() { if (!est.raf && est.tocando && est.visivel && !document.hidden) { est.ultimo = 0; est.raf = requestAnimationFrame(quadro); } }
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { est.visivel = es[es.length - 1].isIntersecting; if (est.visivel) agendar(); }, { threshold: 0.01 });
      io.observe(svg);
    }
    function aoVisibilidade() { if (!document.hidden) agendar(); }
    document.addEventListener('visibilitychange', aoVisibilidade);
    var ctl = {
      svg: svg,
      definir: function (fs, manterTempo) { est.fs = fs; est.iFase = -1; if (!manterTempo) est.t = 0; aplicar(); },
      tocar: function () { est.tocando = true; agendar(); if (o.aoEstado) o.aoEstado(true); },
      pausar: function () { est.tocando = false; if (est.raf) cancelAnimationFrame(est.raf); est.raf = 0; if (o.aoEstado) o.aoEstado(false); },
      tocando: function () { return est.tocando; },
      tempo: function () { return est.t; },
      irPara: function (t) { est.t = Math.max(0, t); aplicar(); },
      passo: function (dir) {
        if (!est.fs) return;
        var P = est.fs.periodo, L = est.fs.lista, q = faseEm(est.fs, est.t), base = est.t - q.x;
        var i = q.i + (dir < 0 ? -1 : 1), extra = 0;
        if (i < 0) { i = L.length - 1; extra = -P; } else if (i >= L.length) { i = 0; extra = P; }
        est.t = Math.max(0, base + extra + L[i].ini + 1e-4); aplicar();
      },
      reiniciar: function () { est.t = 0; est.iFase = -1; aplicar(); },
      destruir: function () { ctl.pausar(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', aoVisibilidade); },
    };
    return ctl;
  }

  /** Linha do tempo de um período (redesenha conforme a largura). → {definir(fs), cursor(t), destruir} */
  function linhaTempo(host, o) {
    o = o || {};
    var svg = h('svg', { class: 'rl-tl', role: 'img', 'aria-label': 'Linha do tempo de um período: barras coloridas são luz; trechos escuros são eclipse.' });
    host.appendChild(svg);
    var est = { fs: null, w: 0 }, cursor = null, ALT = 88, y0 = 30, hb = 28, mx = 8;
    function desenhar() {
      var w = Math.max(220, host.clientWidth || 320);
      est.w = w;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + ALT);
      svg.setAttribute('width', w); svg.setAttribute('height', ALT);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (!est.fs) return;
      var fs = est.fs, J = fs.janela, larg = w - 2 * mx, esc = larg / J;
      svg.appendChild(h('rect', { x: mx, y: y0, width: larg, height: hb, rx: 3, class: 'rl-tl-noite' }));
      var reps = Math.ceil(J / fs.periodo + 1e-6);
      for (var r = 0; r < reps; r++) {
        fs.lista.forEach(function (f) {
          var x0 = (r * fs.periodo + f.ini), x1 = x0 + f.dur;
          if (x0 >= J) return;
          x1 = Math.min(x1, J);
          if (!f.on) return;
          var ww = Math.max(2, (x1 - x0) * esc), alt = f.nivel < 1 ? hb * 0.42 : hb - 6;
          svg.appendChild(h('rect', { x: mx + x0 * esc, y: y0 + (hb - alt) / 2, width: ww, height: alt, rx: 1.5, style: { fill: corCss(f.cor) }, class: 'rl-tl-luz' }));
        });
      }
      var passo = J <= 6 ? 0.5 : J <= 12 ? 1 : J <= 30 ? 2 : 5;
      var rot = esc * passo < 26 ? 2 : 1;
      for (var i = 0, s = 0; s <= J + 1e-6; s = arred(s + passo, 3), i++) {
        var x = mx + s * esc;
        var maior = i % rot === 0;
        svg.appendChild(h('line', { x1: x, x2: x, y1: y0 + hb + 2, y2: y0 + hb + (maior ? 8 : 5), class: 'rl-tl-tick' }));
        if (maior) svg.appendChild(h('text', { x: x, y: y0 + hb + 20, class: 'rl-tl-txt', 'text-anchor': s === 0 ? 'start' : (s >= J - 1e-6 ? 'end' : 'middle') }, numS(s) + (s >= J - 1e-6 ? ' s' : '')));
      }
      if (!fs.continua && !fs.rapidaContinua) {
        svg.appendChild(h('path', { d: 'M' + mx + ' 25 V19 H' + (mx + larg) + ' V25', class: 'rl-tl-colchete' }));
        var rotP = 'período ' + numS(fs.periodo) + ' s', wr = rotP.length * 7 + 12;
        svg.appendChild(h('rect', { x: mx + larg / 2 - wr / 2, y: 10, width: wr, height: 16, class: 'rl-tl-fundo' }));
        svg.appendChild(h('text', { x: mx + larg / 2, y: 23, 'text-anchor': 'middle', class: 'rl-tl-txt rl-tl-per' }, rotP));
      } else {
        svg.appendChild(h('text', { x: mx, y: 22, class: 'rl-tl-txt rl-tl-per' }, fs.continua ? 'luz contínua (4 s mostrados)' : 'ritmo contínuo (4 s mostrados)'));
      }
      cursor = h('line', { x1: mx, x2: mx, y1: y0 - 4, y2: y0 + hb + 4, class: 'rl-tl-cursor' });
      svg.appendChild(cursor);
    }
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { if (Math.abs((host.clientWidth || 0) - est.w) > 2) desenhar(); }) : null;
    if (ro) ro.observe(host);
    return {
      definir: function (fs) { est.fs = fs; desenhar(); },
      cursor: function (t) {
        if (!cursor || !est.fs) return;
        var J = est.fs.janela, x = mx + (((t % J) + J) % J) * ((est.w - 2 * mx) / J);
        cursor.setAttribute('x1', x); cursor.setAttribute('x2', x);
      },
      destruir: function () { if (ro) ro.disconnect(); },
    };
  }

  VL.luz = {
    CORES: CORES, RITMOS: RITMOS, MORSE: MORSE,
    analisar: analisar, fases: fases, faseEm: faseEm, formatar: formatar, significado: significado, faseDetalhada: faseDetalhada,
    lampada: lampada, linhaTempo: linhaTempo, corCss: corCss,
  };

  /* ------------------------------------------------------------------ */
  /* Widget                                                              */
  /* ------------------------------------------------------------------ */
  var EXEMPLOS = ['Fl(3) W 15s 12M', 'Oc R 4s', 'Iso G 6s', 'Q(6)+LFl W 15s', 'Mo(A) W 8s', 'Al WR 6s', 'LFl G 10s', 'VQ(9) W 10s', 'Fl(2+1) G 6s', 'Fl WRG 5s 21m 14M', 'Lp(2) B 10s', 'R(3) B 10s'];
  /* desafio: características realistas (todas existem no balizamento IALA ou na Lista de Faróis) */
  var DESAFIO = ['Fl G 3s', 'Fl R 3s', 'Fl(2) R 6s', 'Fl(2+1) G 6s', 'Fl(2+1) R 6s', 'Q W', 'VQ W', 'Q(3) W 10s', 'VQ(3) W 5s', 'Q(6)+LFl W 15s', 'VQ(6)+LFl W 10s', 'Q(9) W 15s', 'VQ(9) W 10s', 'Fl(2) W 10s', 'Iso W 2s', 'Oc W 4s', 'LFl W 10s', 'Mo(A) W 5s', 'Fl Y 3s', 'Fl(3) W 10s', 'Oc R 4s', 'Iso G 2s', 'Fl(4) Y 12s', 'Q G', 'Al Bu Y 3s', 'Fl W 6s'];

  VL.widgets.define('ritmos-luz', {
    css: ['assets/css/widgets/ritmos-luz.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpar = [];
      var inst = VL.ui.instrumento({ titulo: 'Ritmos de luz: decodificador', controlesAntes: true });
      el.appendChild(inst.raiz);
      inst.raiz.classList.add('rl');
      var modo = opts.modo === 'desafio' ? 'desafio' : 'decodificar';
      var seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['decodificar', 'Decodificar'], ['desafio', 'Desafio']].forEach(function (m) {
        seg.appendChild(h('button', { type: 'button', 'aria-pressed': String(modo === m[0]), 'data-m': m[0], onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      inst.controles.appendChild(seg);
      inst.legenda.appendChild(h('span', { class: 'rl-fonte' }, 'Fontes: Lista de Faróis (DH2), DHN, itens 3.3 e 4.2; IALA, Sistema de Balizamento Marítimo, Região B.'));
      var corpo = h('div', { class: 'rl-corpo' });
      inst.corpo.appendChild(corpo);

      var atual = null;
      function trocarModo(m) {
        modo = m;
        VL.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
        if (atual) { atual(); atual = null; }
        corpo.innerHTML = '';
        atual = m === 'desafio' ? montarDesafio(corpo) : montarDecodificar(corpo);
      }

      /* ---------------- Decodificar ---------------- */
      function montarDecodificar(box) {
        var fim = [];
        var grade = h('div', { class: 'rl-grade' });
        var noite = h('div', { class: 'rl-noite' });
        var lampHost = h('div', { class: 'rl-lamp' });
        var relogio = h('p', { class: 'rl-relogio', 'aria-live': 'off' }, '');
        var estadoFase = h('p', { class: 'rl-fase-txt' }, '');
        var bPlay = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Pausar' }, VL.icon('pausa', 18));
        var bAnt = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Fase anterior' }, VL.icon('esquerda', 18));
        var bProx = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Próxima fase' }, VL.icon('direita', 18));
        var bRe = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Voltar ao início do período' }, VL.icon('reiniciar', 18));
        var setorBox = h('div', { class: 'rl-setores', hidden: true });
        noite.appendChild(lampHost);
        noite.appendChild(estadoFase);
        noite.appendChild(relogio);
        noite.appendChild(h('div', { class: 'rl-botoes' }, bAnt, bPlay, bProx, bRe));
        noite.appendChild(setorBox);

        var info = h('div', { class: 'rl-info' });
        var idIn = uid('rl-in');
        var entrada = h('input', { type: 'text', id: idIn, class: 'rl-entrada', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', value: opts.caracteristica || 'Fl(3) W 15s 12M', 'aria-describedby': idIn + '-d' });
        var form = h('form', { class: 'rl-form', onsubmit: function (e) { e.preventDefault(); atualizar(); } },
          h('label', { for: idIn, class: 'field-label' }, 'Característica da luz'),
          h('div', { class: 'rl-linha-in' }, entrada, h('button', { type: 'submit', class: 'btn btn-primary' }, 'Decodificar')),
          h('p', { class: 'field-hint', id: idIn + '-d' }, 'Como aparece na carta (Fl, Q, W, R, G…) ou na Lista de Faróis da DHN (Lp, R, MR, B, E, V…).'));
        info.appendChild(form);
        if (opts.exemplos !== false) {
          var chips = h('div', { class: 'chip-list rl-exemplos', role: 'group', 'aria-label': 'Exemplos' });
          EXEMPLOS.forEach(function (x) { chips.appendChild(h('button', { type: 'button', class: 'chip', onclick: function () { entrada.value = x; atualizar(); } }, x)); });
          info.appendChild(chips);
        }
        var saida = h('div', { class: 'rl-saida', 'aria-live': 'polite' });
        var tlHost = h('div', { class: 'rl-tl-host' });
        var tlCap = h('p', { class: 'rl-tl-cap' }, '');
        grade.classList.add('rl-dec');
        grade.appendChild(info);
        grade.appendChild(h('div', { class: 'rl-esq' }, noite, h('div', { class: 'rl-tl-wrap' }, h('p', { class: 'rl-tl-tit' }, 'Um período, segundo a segundo'), tlHost, tlCap)));
        grade.appendChild(saida);
        box.appendChild(grade);

        var tl = linhaTempo(tlHost);
        var c = null, fs = null, corSetor = null;
        var lamp = lampada(lampHost, {
          aoQuadro: function (t) { tl.cursor(t); relogio.textContent = 't = ' + num(t, 1) + ' s'; },
          aoFase: function (q) {
            var f = q.f;
            estadoFase.textContent = f.on ? (f.nivel < 1 ? 'luz fixa fraca' : 'luz ' + CORES[f.cor].nome.replace(' (vermelha)', '')) + ' · ' + numS(f.dur) + ' s' : 'eclipse · ' + numS(f.dur) + ' s';
          },
          aoEstado: function (tocando) { bPlay.innerHTML = ''; bPlay.appendChild(VL.icon(tocando ? 'pausa' : 'play', 18)); bPlay.setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar'); },
        });
        bPlay.onclick = function () { if (lamp.tocando()) lamp.pausar(); else lamp.tocar(); };
        bAnt.onclick = function () { lamp.pausar(); lamp.passo(-1); };
        bProx.onclick = function () { lamp.pausar(); lamp.passo(1); };
        bRe.onclick = function () { lamp.reiniciar(); };

        function atualizar() {
          c = analisar(entrada.value);
          saida.innerHTML = '';
          if (!c.ok) {
            saida.appendChild(h('p', { class: 'rl-erro' }, c.erro));
            return;
          }
          if (!c.setor && !c.dir) corSetor = null;
          else if (!corSetor || c.cores.indexOf(corSetor) < 0) corSetor = c.cores[0];
          fs = fases(c, corSetor);
          lamp.definir(fs);
          tl.definir(fs);
          /* setores */
          setorBox.innerHTML = '';
          setorBox.hidden = !(c.setor || c.dir);
          if (c.setor || c.dir) {
            setorBox.appendChild(h('span', { class: 'rl-setor-tit' }, 'Visto do setor:'));
            var sg = h('div', { class: 'segmented rl-seg-noite', role: 'group', 'aria-label': 'Setor de onde a luz é vista' });
            c.cores.forEach(function (k) {
              sg.appendChild(h('button', { type: 'button', 'aria-pressed': String(k === corSetor), onclick: function () { corSetor = k; fs = fases(c, corSetor); lamp.definir(fs, true); tl.definir(fs); VL.$$('button', sg).forEach(function (b, i) { b.setAttribute('aria-pressed', String(c.cores[i] === k)); }); } }, CORES[k].nome.replace(' (vermelha)', '')));
            });
            setorBox.appendChild(sg);
          }
          /* cabeçalho com as duas notações */
          var cab = h('div', { class: 'rl-notacoes' },
            h('div', null, h('span', { class: 'rl-not-rot' }, 'Na carta'), h('strong', { class: 'rl-not-v' }, formatar(c, 'intl'))),
            h('div', null, h('span', { class: 'rl-not-rot' }, 'Na Lista de Faróis (DHN)'), h('strong', { class: 'rl-not-v' }, formatar(c, 'pt'))));
          saida.appendChild(cab);
          var dl = h('dl', { class: 'rl-pecas' });
          c.pecas.forEach(function (p) {
            dl.appendChild(h('div', { class: 'rl-peca' },
              h('dt', null, h('span', { class: 'rl-peca-cod' }, p.txt), h('span', { class: 'rl-peca-tit' }, p.titulo, p.en ? en(p.en) : null)),
              h('dd', null, p.desc)));
          });
          saida.appendChild(dl);
          var sig = significado(c);
          if (sig) saida.appendChild(h('div', { class: 'rl-sig' }, h('strong', null, 'No balizamento: '), sig.txt, sig.ref ? h('span', { class: 'rl-ref' }, ' ' + sig.ref + '.') : null));
          if (c.altitude != null) saida.appendChild(calcAlcance(c));
          if (c.avisos.length) saida.appendChild(h('ul', { class: 'rl-avisos' }, c.avisos.map(function (a) { return h('li', null, a); })));
          var fd = faseDetalhada(c, fs);
          tlCap.innerHTML = '';
          if (fd) {
            tlCap.appendChild(h('span', null, (fs.ilustrativa ? 'Fase detalhada típica, no formato da Lista de Faróis: ' : 'Fase detalhada: ')));
            tlCap.appendChild(h('span', { class: 'rl-fd' }, fd.join(' · ')));
            if (fs.ilustrativa) tlCap.appendChild(h('span', null, '. A duração exata de cada lampejo de um sinal real está na Lista de Faróis.'));
          } else tlCap.textContent = 'Luz fixa fraca com lampejos mais fortes (a fase detalhada real está na Lista de Faróis).';
          if (!reduzMov() && !lamp.tocando()) lamp.tocar();
        }
        atualizar();
        if (reduzMov()) { lamp.pausar(); estadoFase.textContent += ''; noite.appendChild(h('p', { class: 'rl-rm' }, 'Animação parada (movimento reduzido). Use os botões para tocar ou avançar fase a fase.')); }
        else lamp.tocar();
        fim.push(function () { lamp.destruir(); tl.destruir(); });
        return function () { fim.forEach(function (f) { f(); }); };
      }

      function calcAlcance(c) {
        var H = c.altitude, idR = uid('rl-olho');
        var olho = h('input', { type: 'range', min: '1', max: '20', step: '0.5', value: '2', id: idR });
        var out = h('output', { for: idR, class: 'rl-alc-out' });
        function calc() {
          var hh = parseFloat(olho.value), D = 1.927 * (Math.sqrt(H) + Math.sqrt(hh));
          out.innerHTML = '';
          out.appendChild(document.createTextNode('Olho a ' + numS(hh) + ' m: alcance geográfico ≈ 1,927 × (√' + numS(H) + ' + √' + numS(hh) + ') = '));
          out.appendChild(h('strong', null, num(D, 1) + ' M'));
          if (c.alcance != null) out.appendChild(document.createTextNode(D < c.alcance ? '. Menor que o alcance luminoso (' + numS(c.alcance) + ' M): a curvatura da Terra esconde a luz antes.' : '. Maior que o alcance luminoso (' + numS(c.alcance) + ' M): quem limita é a intensidade da luz.'));
        }
        olho.addEventListener('input', calc);
        calc();
        return h('div', { class: 'rl-alc' },
          h('label', { for: idR, class: 'field-label' }, 'Altura dos seus olhos acima da água'),
          olho, out,
          h('p', { class: 'rl-ref' }, 'Fórmula da Lista de Faróis (DHN), item 3.5: D = 1,927 (√H + √h), com H e h em metros e D em milhas. A Lista usa olho a 5 m; num veleiro pequeno, 2 m é mais realista.'));
      }

      /* ---------------- Desafio ---------------- */
      function montarDesafio(box) {
        var fim = [];
        var placar = { certas: 0, total: 0 };
        var grade = h('div', { class: 'rl-grade' });
        var noite = h('div', { class: 'rl-noite' });
        var lampHost = h('div', { class: 'rl-lamp' });
        var relogio = h('p', { class: 'rl-relogio' }, 't = 0 s');
        var bPlay = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Pausar' }, VL.icon('pausa', 18));
        var bRe = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Recomeçar a observação' }, VL.icon('reiniciar', 18));
        noite.appendChild(lampHost);
        noite.appendChild(h('p', { class: 'rl-fase-txt' }, 'Observe e cronometre'));
        noite.appendChild(relogio);
        noite.appendChild(h('div', { class: 'rl-botoes' }, bPlay, bRe));
        var painel = h('div', { class: 'rl-info' });
        var enun = h('p', { class: 'rl-desafio-enun' }, 'Que característica esta luz está mostrando?');
        var idAj = uid('rl-aj');
        var ajuda = h('input', { type: 'checkbox', id: idAj });
        var opcoes = h('div', { class: 'rl-opcoes', role: 'group', 'aria-label': 'Alternativas' });
        var fb = h('div', { class: 'rl-fb', 'aria-live': 'polite' });
        var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true }, 'Próxima luz');
        var plac = h('p', { class: 'rl-placar' }, '');
        painel.appendChild(enun);
        painel.appendChild(h('label', { class: 'switch rl-ajuda', for: idAj }, ajuda, 'Mostrar a linha do tempo (mais fácil)'));
        painel.appendChild(opcoes);
        painel.appendChild(fb);
        painel.appendChild(h('div', { class: 'btn-row' }, prox));
        painel.appendChild(plac);
        grade.appendChild(noite); grade.appendChild(painel);
        box.appendChild(grade);
        var tlHost = h('div', { class: 'rl-tl-host' });
        var tlWrap = h('div', { class: 'rl-tl-wrap', hidden: true }, h('p', { class: 'rl-tl-tit' }, 'Um período'), tlHost);
        box.appendChild(tlWrap);
        var tl = linhaTempo(tlHost);
        var lamp = lampada(lampHost, {
          rotulo: 'Luz misteriosa piscando',
          aoQuadro: function (t) { tl.cursor(t); relogio.textContent = 't = ' + num(t, 1) + ' s'; },
          aoEstado: function (tocando) { bPlay.innerHTML = ''; bPlay.appendChild(VL.icon(tocando ? 'pausa' : 'play', 18)); bPlay.setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar'); },
        });
        bPlay.onclick = function () { if (lamp.tocando()) lamp.pausar(); else lamp.tocar(); };
        bRe.onclick = function () { lamp.reiniciar(); if (!lamp.tocando()) lamp.tocar(); };
        ajuda.addEventListener('change', function () { tlWrap.hidden = !ajuda.checked; if (ajuda.checked && atualC) tl.definir(atualFs); });
        var atualC = null, atualFs = null, ultimo = null, respondida = false;
        function chave(c) { return formatar(c, 'intl'); }
        function distratores(c) {
          var pool = DESAFIO.map(analisar).filter(function (x) { return chave(x) !== chave(c); });
          var mesmaCor = pool.filter(function (x) { return x.cores.join() === c.cores.join(); });
          var mesmoRitmo = pool.filter(function (x) { return x.ritmo === c.ritmo || nLampejos(x.grupos) === nLampejos(c.grupos); });
          var out = [], vistos = {};
          function add(lista, n) { VL.embaralhar(lista).forEach(function (x) { if (out.length < n && !vistos[chave(x)]) { vistos[chave(x)] = 1; out.push(x); } }); }
          add(mesmaCor, 2); add(mesmoRitmo, 3); add(pool, 3);
          /* variações plausíveis do próprio período */
          return out.slice(0, 3);
        }
        function nova() {
          respondida = false;
          var cand = DESAFIO.filter(function (x) { return x !== ultimo; });
          var esc = cand[Math.floor(Math.random() * cand.length)];
          ultimo = esc;
          atualC = analisar(esc);
          atualFs = fases(atualC);
          lamp.definir(atualFs);
          tl.definir(atualFs);
          var ops = VL.embaralhar([atualC].concat(distratores(atualC)));
          opcoes.innerHTML = '';
          fb.innerHTML = '';
          prox.hidden = true;
          ops.forEach(function (o) {
            var b = h('button', { type: 'button', class: 'alternativa rl-alt' }, h('span', { class: 'rl-alt-cod' }, formatar(o, 'intl')), h('span', { class: 'rl-alt-pt' }, formatar(o, 'pt')));
            b.addEventListener('click', function () { responder(o, b); });
            opcoes.appendChild(b);
          });
          if (!reduzMov()) lamp.tocar(); else lamp.pausar();
        }
        function responder(o, b) {
          if (respondida) return;
          respondida = true;
          var ok = chave(o) === chave(atualC);
          placar.total++; if (ok) placar.certas++;
          VL.$$('button', opcoes).forEach(function (x) {
            x.disabled = true;
            var cod = VL.$('.rl-alt-cod', x).textContent;
            if (cod === chave(atualC)) x.setAttribute('data-res', 'certa');
            else if (x === b) x.setAttribute('data-res', 'errada');
          });
          var sig = significado(atualC);
          var expl = descreverObservacao(atualC, atualFs);
          fb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não foi essa. Era ' + chave(atualC) + '.'));
          fb.appendChild(h('p', null, expl));
          if (sig) fb.appendChild(h('p', { class: 'rl-sig' }, sig.txt));
          plac.textContent = 'Acertos: ' + placar.certas + ' de ' + placar.total;
          prox.hidden = false;
          prox.focus();
        }
        prox.addEventListener('click', nova);
        nova();
        if (reduzMov()) noite.appendChild(h('p', { class: 'rl-rm' }, 'Movimento reduzido: toque em tocar para ver a luz piscar.'));
        fim.push(function () { lamp.destruir(); tl.destruir(); });
        return function () { fim.forEach(function (f) { f(); }); };
      }

      function descreverObservacao(c, fs) {
        var r = c.ritmo, R = RITMOS[r], cor = CORES[c.cores[0]].nome.replace(' (vermelha)', '');
        if (c.alt) return 'A luz alterna ' + c.cores.map(function (k) { return CORES[k].nome.replace(' (vermelha)', ''); }).join(' e ') + ', repetindo a cada ' + numS(fs.periodo) + ' s.';
        if (RAPIDA[r] && !c.grupos && !c.extra) return 'Luz ' + cor + ' piscando sem parar, ' + Math.round(60 / RAPIDA[r].ciclo) + ' vezes por minuto: ' + R.nome + ' contínua.';
        if (RAPIDA[r]) return nLampejos(c.grupos) + ' lampejos ' + (r === 'Q' ? 'rápidos (1 por segundo)' : 'muito rápidos (2 por segundo)') + (c.extra ? ', um lampejo longo de 2 s' : '') + ' e escuro até completar ' + numS(fs.periodo) + ' s.';
        if (r === 'Iso') return 'Luz ' + cor + ' acesa e apagada por tempos iguais (' + numS(fs.periodo / 2) + ' s cada): isofásica.';
        if (r === 'Oc') return 'Luz ' + cor + ' acesa a maior parte do tempo, com um apagão curto a cada ' + numS(fs.periodo) + ' s: ocultação.';
        if (r === 'LFl') return 'Um lampejo ' + cor + ' longo (2 s) a cada ' + numS(fs.periodo) + ' s: lampejo longo.';
        if (r === 'Mo') return 'Um lampejo curto e um longo (· —), letra A em Morse, a cada ' + numS(fs.periodo) + ' s.';
        if (r === 'Fl') return (nLampejos(c.grupos) > 1 ? 'Grupo ' + (c.grupos.length > 1 ? 'composto (' + c.grupos.join('+') + ')' : 'de ' + c.grupos[0] + ' lampejos') : 'Um lampejo') + ' ' + cor + (nLampejos(c.grupos) > 1 ? '' : '') + ', com o ciclo se repetindo a cada ' + numS(fs.periodo) + ' s.';
        return formatar(c, 'intl');
      }

      trocarModo(modo);
      limpar.push(function () { if (atual) atual(); });
      return function () { limpar.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } }); };
    },
  });
})();
