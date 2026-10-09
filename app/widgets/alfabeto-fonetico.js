/* alfabeto-fonetico — alfabeto fonético e código de algarismos da UIT (Regulamento de Radiocomunicações, Apêndice 14,
   Rev. CMR-23), com a pronúncia oficial ("spoken as", sílabas tônicas sublinhadas), uma leitura aproximada em
   português (não oficial), conversor para soletrar nome do barco, indicativo ou MMSI e três treinos com cronômetro e
   placar: soletrar, ouvir e digitar (voz sintética do navegador, com alternativa só visual) e contra o relógio.

   Fontes citadas na interface:
   - UIT, Regulamento de Radiocomunicações (RR), edição de 2024, Vol. 2, Apêndice 14 (Rev. CMR-23):
     §1 tabela de letras (nota 1: sílabas tônicas sublinhadas); §2 algarismos e sinais (nota 2: todas as sílabas com a
     mesma ênfase); §3 estações do mesmo país, entre si, podem usar outra tabela reconhecida pela sua administração.
   - RR, Art. 32, n.º 32.7 (usar o Apêndice 14) e nota 32.7.1 (as pronúncias de algarismos do Apêndice 14 e das Frases
     Padronizadas de Comunicação Marítima da IMO, SMCP, são diferentes).
   - Anatel, Material de apoio ao exame de Radiotelefonista, versão 2026-03, item 2.1.9.1 (grafa PENTAFIVE; o RR grafa
     Pantafive — seguimos o RR).

   Expõe VL.fonetico = { LETRAS, ALGARISMOS, POR_CHAR, soletrar(texto, {algarismos}), voz } para outros widgets
   (widgets/vhf-sim.js usa para soletrar indicativo e MMSI).

   opts de mount (todos opcionais):
     modo:       'tabela' | 'soletrar' | 'ouvir' | 'relogio'      aba inicial (padrão 'tabela')
     modos:      ['tabela', 'soletrar', 'ouvir', 'relogio']        abas exibidas (padrão: todas)
     tabela:     'letras' | 'algarismos'                           grupo inicial da tabela (padrão 'letras')
     texto:      'Albatroz PQ4821'                                 texto inicial do conversor
     algarismos: 'uit' | 'simples'                                 como soletrar algarismos (padrão 'uit')
     leituraBr:  true                                              mostra a leitura aproximada em português
     ouvir:      { n: 10, tipo: 'indicativos' | 'palavras' | 'mmsi' | 'misto' }      (padrão n 10, tipo 'misto')
     relogio:    { segundos: 60, direcao: 'letra' | 'palavra', resposta: 'tocar' | 'digitar', algarismos: false }
     titulo:     legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'alfabeto-fonetico', opts:{}}
     {t:'widget', w:'alfabeto-fonetico', opts:{modo:'soletrar', texto:'Maresia PQ7310'}}
     {t:'widget', w:'alfabeto-fonetico', opts:{modo:'ouvir', modos:['ouvir'], ouvir:{n:8, tipo:'indicativos'}}}
     {t:'widget', w:'alfabeto-fonetico', opts:{modo:'relogio', modos:['tabela','relogio'], relogio:{segundos:60}}} */
(function () {
  'use strict';
  var h = VL.h;

  /* ---------- Dados (RR, Apêndice 14) ----------
     fala: sílabas separadas por espaço; "_" antes da sílaba = tônica (sublinhada no RR, nota 1).
     br: leitura aproximada em português, feita para este app (não é oficial). */
  function L(c, palavra, fala, ou, br, alt, tts) {
    return { c: c, palavra: palavra, fala: fala, ou: ou || null, br: br, alt: alt || [], tts: tts || palavra, tipo: 'letra' };
  }
  var LETRAS = [
    L('A', 'Alfa', '_AL FAH', null, 'ál-fa', ['alpha']),
    L('B', 'Bravo', '_BRAH VOH', null, 'brá-vou'),
    L('C', 'Charlie', '_CHAR LEE', '_SHAR LEE', 'tchár-li ou xár-li'),
    L('D', 'Delta', '_DELL TAH', null, 'dél-ta'),
    L('E', 'Echo', '_ECK OH', null, 'é-cou'),
    L('F', 'Foxtrot', '_FOKS TROT', null, 'fócs-trót'),
    L('G', 'Golf', 'GOLF', null, 'gólf'),
    L('H', 'Hotel', 'HOH _TELL', null, 'hou-tél (h aspirado)'),
    L('I', 'India', '_IN DEE AH', null, 'ín-di-a'),
    L('J', 'Juliett', '_JEW LEE _ETT', null, 'djú-li-ét', ['juliet'], 'Juliet'),
    L('K', 'Kilo', '_KEY LOH', null, 'kí-lou'),
    L('L', 'Lima', '_LEE MAH', null, 'lí-ma'),
    L('M', 'Mike', 'MIKE', null, 'máik'),
    L('N', 'November', 'NO _VEM BER', null, 'nou-vém-ber'),
    L('O', 'Oscar', '_OSS CAH', null, 'ós-ca'),
    L('P', 'Papa', 'PAH _PAH', null, 'pa-pá'),
    L('Q', 'Quebec', 'KEH _BECK', null, 'kê-béc', [], 'keh beck'),
    L('R', 'Romeo', '_ROW ME OH', null, 'rôu-mi-ou'),
    L('S', 'Sierra', 'SEE _AIR RAH', null, 'si-é-ra'),
    L('T', 'Tango', '_TANG GO', null, 'tán-gou'),
    L('U', 'Uniform', '_YOU NEE FORM', '_OO NEE FORM', 'iú-ni-fórm ou ú-ni-fórm'),
    L('V', 'Victor', '_VIK TAH', null, 'vík-ta'),
    L('W', 'Whiskey', '_WISS KEY', null, 'uís-qui', ['whisky']),
    L('X', 'X-ray', '_ECKS _RAY', null, 'écs-rêi', ['xray', 'x ray']),
    L('Y', 'Yankee', '_YANG KEY', null, 'ién-qui'),
    L('Z', 'Zulu', '_ZOO LOO', null, 'zú-lu'),
  ];
  function A(c, palavra, fala, br, simples, simplesPt, tts, alt) {
    return { c: c, palavra: palavra, fala: fala, br: br, simples: simples, simplesPt: simplesPt, tts: tts, alt: alt || [], tipo: 'algarismo' };
  }
  var ALGARISMOS = [
    A('0', 'Nadazero', 'NAH-DAH-ZAY-ROH', 'ná-dá-zê-rôu', 'zero', 'zero', 'nah dah zay roh'),
    A('1', 'Unaone', 'OO-NAH-WUN', 'u-ná-uân', 'one', 'um', 'oo nah wun'),
    A('2', 'Bissotwo', 'BEES-SOH-TOO', 'bís-sôu-tu', 'two', 'dois', 'bees soh too'),
    A('3', 'Terrathree', 'TAY-RAH-TREE', 'tê-rá-tri', 'three', 'três', 'tay rah tree'),
    A('4', 'Kartefour', 'KAR-TAY-FOWER', 'car-tê-fáuer', 'four', 'quatro', 'kar tay fower'),
    A('5', 'Pantafive', 'PAN-TAH-FIVE', 'pan-tá-fáiv', 'five', 'cinco', 'pan tah five', ['pentafive']),
    A('6', 'Soxisix', 'SOK-SEE-SIX', 'sóc-si-síks', 'six', 'seis', 'sok see six'),
    A('7', 'Setteseven', 'SAY-TAY-SEVEN', 'sê-tê-séven', 'seven', 'sete', 'say tay seven'),
    A('8', 'Oktoeight', 'OK-TOH-AIT', 'óc-tôu-êit', 'eight', 'oito', 'ok toh ait'),
    A('9', 'Novenine', 'NO-VAY-NINER', 'nôu-vê-náiner', 'nine', 'nove', 'no vay niner'),
    A('.', 'Decimal', 'DAY-SEE-MAL', 'dê-si-mál', 'decimal', 'vírgula', 'day see mal'),
    A('stop', 'Stop', 'STOP', 'stóp', 'stop', 'ponto', 'stop'),
  ];
  ALGARISMOS[10].rotulo = 'vírgula decimal'; ALGARISMOS[11].rotulo = 'ponto final';
  var POR_CHAR = {};
  LETRAS.forEach(function (x) { POR_CHAR[x.c] = x; });
  ALGARISMOS.forEach(function (x) { POR_CHAR[x.c] = x; });

  var REF_AP14 = 'RR, Apêndice 14 (Rev. CMR-23)';

  /* ---------- Soletrar ---------- */
  /** Converte texto em itens {c, item, sep} — letras sem acento, algarismos, vírgula/ponto entre algarismos = Decimal,
      ponto no fim de frase = Stop, espaço/hífen = separador. */
  function soletrar(texto) {
    var s = VL.semAcento(texto || '').toUpperCase();
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (/[A-Z0-9]/.test(ch)) { out.push({ c: ch, item: POR_CHAR[ch] }); continue; }
      if (ch === ',' || ch === '.') {
        var antes = /[0-9]/.test(s[i - 1] || ''), depois = /[0-9]/.test(s[i + 1] || '');
        if (antes && depois) { out.push({ c: ch, item: POR_CHAR['.'] }); continue; }
        if (ch === '.') { out.push({ c: '.', item: POR_CHAR.stop }); continue; }
      }
      if ((ch === ' ' || ch === '-' || ch === '/') && out.length && !out[out.length - 1].sep) out.push({ sep: true });
    }
    while (out.length && out[out.length - 1].sep) out.pop();
    return out;
  }
  /** Palavra a dizer para um item: algarismos 'uit' (Apêndice 14) ou 'simples' (um a um, em inglês). */
  function palavraDe(item, algarismos) {
    if (item.tipo === 'algarismo' && algarismos === 'simples') return item.simples;
    return item.palavra;
  }
  function ttsDe(item, algarismos) {
    if (item.tipo === 'algarismo' && algarismos === 'simples') return item.simples;
    return item.tts;
  }

  /* ---------- Voz sintética (Web Speech API), opcional ---------- */
  var voz = (function () {
    function ok() { try { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; } catch (e) { return false; } }
    function escolher(lang) {
      try {
        var vs = window.speechSynthesis.getVoices() || [];
        var base = lang.slice(0, 2);
        return vs.filter(function (v) { return v.lang === lang; })[0] || vs.filter(function (v) { return (v.lang || '').slice(0, 2) === base; })[0] || null;
      } catch (e) { return null; }
    }
    function parar() { try { if (ok()) window.speechSynthesis.cancel(); } catch (e) { /* sem voz */ } }
    /** falar(['Alfa', 'Bravo'], {lang, rate, aoComecar(i), aoTerminar()}) — cada parte vira uma fala; devolve true se tentou. */
    function falar(partes, o) {
      o = o || {};
      if (!ok() || !partes.length) return false;
      parar();
      var lang = o.lang || 'en-GB', v = escolher(lang), feitos = 0;
      partes.forEach(function (txt, i) {
        var u = new window.SpeechSynthesisUtterance(txt);
        u.lang = v ? v.lang : lang; if (v) u.voice = v;
        u.rate = o.rate || 0.9; u.pitch = 1;
        u.onstart = function () { if (o.aoComecar) o.aoComecar(i); };
        u.onend = u.onerror = function () { feitos++; if (feitos === partes.length && o.aoTerminar) o.aoTerminar(); };
        try { window.speechSynthesis.speak(u); } catch (e) { /* ignora */ }
      });
      return true;
    }
    return { ok: ok, falar: falar, parar: parar, temVozIngles: function () { return !!escolher('en-GB') || !!escolher('en-US'); } };
  })();

  VL.fonetico = { LETRAS: LETRAS, ALGARISMOS: ALGARISMOS, POR_CHAR: POR_CHAR, soletrar: soletrar, palavraDe: palavraDe, ttsDe: ttsDe, voz: voz, REF: REF_AP14 };

  /* ---------- Utilidades ---------- */
  function norm(s) { return VL.semAcento(s || '').replace(/[^a-z0-9]/g, ''); }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function seg(ms) { return VL.fmt.num(ms / 1000, 1) + ' s'; }
  function falaNode(fala) {
    var span = h('span', { class: 'af-fala' });
    fala.split(' ').forEach(function (sil, i) {
      if (i) span.appendChild(document.createTextNode(' '));
      if (sil.charAt(0) === '_') span.appendChild(h('span', { class: 'af-tonica' }, sil.slice(1)));
      else span.appendChild(document.createTextNode(sil));
    });
    return span;
  }
  function falaTxt(fala) { return fala.replace(/_/g, ''); }
  /* Fato verificado de data/fontes.js (link + selo automático); enquanto o arquivo não foi gerado, mostra a citação. */
  function fonteOu(ref, txt) {
    var f = VL.data.fontes && VL.data.fontes.fatos && VL.data.fontes.fatos[ref];
    return f ? VL.ui.fonte(ref) : h('span', { class: 'fonte-ref' }, '(' + txt + ')');
  }
  function aceita(item, resp) {
    var r = norm(resp);
    if (!r) return false;
    if (r === norm(item.palavra)) return true;
    return item.alt.some(function (a) { return norm(a) === r; });
  }

  var PALAVRAS = ['ILHABELA', 'PARATY', 'ABROLHOS', 'BUZIOS', 'ANGRA', 'NORONHA', 'ITAJAI', 'SANTOS', 'VITORIA', 'SALVADOR', 'RECIFE',
    'NATAL', 'BELEM', 'GAIVOTA', 'ALBATROZ', 'MARESIA', 'BOMBORDO', 'BORESTE', 'TRAVESSIA', 'VELEIRO', 'JANGADA', 'ESCUNA', 'FAROL', 'QUILHA', 'XAREU'];
  var LETRAS_IND = 'PQRSTUVWXY';
  function gerarItem(tipo) {
    var t = tipo === 'misto' ? sortear(['indicativos', 'indicativos', 'palavras', 'mmsi']) : tipo;
    var i, s;
    if (t === 'palavras') return sortear(PALAVRAS);
    if (t === 'mmsi') { s = '710'; for (i = 0; i < 6; i++) s += Math.floor(Math.random() * 10); return s; }
    s = 'P' + sortear(LETRAS_IND.split(''));
    for (i = 0; i < 4; i++) s += Math.floor(Math.random() * 10);
    return s;
  }

  /* ---------- Widget ---------- */
  VL.widgets.define('alfabeto-fonetico', {
    css: ['assets/css/widgets/alfabeto-fonetico.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var pref = VL.store.get('alfabeto-fonetico.pref', {}) || {};
      var recordes = VL.store.get('alfabeto-fonetico.recordes', {}) || {};
      var TODOS = ['tabela', 'soletrar', 'ouvir', 'relogio'];
      var modos = (Array.isArray(opts.modos) ? opts.modos : TODOS).filter(function (m) { return TODOS.indexOf(m) >= 0; });
      if (!modos.length) modos = TODOS;
      var est = {
        modo: modos.indexOf(opts.modo) >= 0 ? opts.modo : modos[0],
        tabela: opts.tabela === 'algarismos' ? 'algarismos' : 'letras',
        alg: opts.algarismos === 'simples' ? 'simples' : (pref.alg === 'simples' && !opts.algarismos ? 'simples' : 'uit'),
        br: opts.leituraBr != null ? !!opts.leituraBr : (pref.br != null ? !!pref.br : true),
        visivel: true,
      };
      var oOuvir = Object.assign({ n: 10, tipo: 'misto' }, opts.ouvir || {});
      var oRel = Object.assign({ segundos: 60, direcao: 'letra', resposta: null, algarismos: false }, opts.relogio || {});
      var grosso = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      if (!oRel.resposta) oRel.resposta = grosso ? 'tocar' : 'digitar';
      var timers = [];
      function depois(fn, ms) { var t = setTimeout(function () { timers = timers.filter(function (x) { return x !== t; }); fn(); }, ms); timers.push(t); return t; }
      function salvarPref() { VL.store.set('alfabeto-fonetico.pref', { br: est.br, alg: est.alg }); }
      function salvarRec() { VL.store.set('alfabeto-fonetico.recordes', recordes); }
      var temVoz = voz.ok();

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Alfabeto fonético e algarismos da UIT', controlesAntes: true });
      ins.raiz.classList.add('af-raiz');
      var segModo = h('div', { class: 'segmented af-modos', role: 'tablist', 'aria-label': 'Modo do alfabeto fonético' });
      var ROT = { tabela: 'Tabela', soletrar: 'Soletrar', ouvir: 'Ouvir e digitar', relogio: 'Contra o relógio' };
      modos.forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', role: 'tab', 'data-v': m, onclick: function () { trocarModo(m); } }, ROT[m]));
      });
      if (modos.length > 1) ins.controles.appendChild(segModo);
      var vistas = {};
      TODOS.forEach(function (m) { vistas[m] = h('div', { class: 'af-vista af-vista-' + m, role: 'tabpanel', hidden: true }); ins.corpo.appendChild(vistas[m]); });
      ins.legenda.appendChild(h('span', { class: 'af-fonte' }, 'Fonte: UIT, Regulamento de Radiocomunicações, Apêndice 14 (Rev. CMR-23).'));
      var vozInfo = h('span', { class: 'af-voz-info' }, temVoz ? 'Voz: sintetizador do seu aparelho (a pronúncia pode variar).' : 'Seu navegador não tem voz sintética: os treinos funcionam no modo visual.');
      ins.legenda.appendChild(vozInfo);
      el.appendChild(ins.raiz);

      /* ===== Tabela ===== */
      var tabCab = h('div', { class: 'af-linha' });
      var segTab = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Grupo da tabela' });
      [['letras', 'Letras'], ['algarismos', 'Algarismos e sinais']].forEach(function (g) {
        segTab.appendChild(h('button', { type: 'button', 'data-v': g[0], onclick: function () { est.tabela = g[0]; desenharTabela(); } }, g[1]));
      });
      var swBr = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Mostrar leitura aproximada em português', onchange: function () { est.br = swBr.checked; salvarPref(); ins.raiz.setAttribute('data-br', est.br ? '1' : '0'); } });
      swBr.checked = est.br;
      tabCab.appendChild(segTab);
      tabCab.appendChild(h('label', { class: 'switch af-switch' }, swBr, h('span', null, 'Leitura em português')));
      var grade = h('div', { class: 'af-grade', role: 'list' });
      var tabNotas = h('div', { class: 'af-notas' });
      vistas.tabela.appendChild(tabCab);
      vistas.tabela.appendChild(h('p', { class: 'af-dica' }, temVoz ? 'Toque numa carta para ouvir. ' : '', 'As sílabas sublinhadas são as tônicas, como no Regulamento de Radiocomunicações.'));
      vistas.tabela.appendChild(grade);
      vistas.tabela.appendChild(tabNotas);
      ins.raiz.setAttribute('data-br', est.br ? '1' : '0');

      var cartaAtiva = null;
      function tocarItem(item, btn) {
        if (cartaAtiva) cartaAtiva.removeAttribute('data-falando');
        cartaAtiva = btn; if (btn) btn.setAttribute('data-falando', '1');
        if (!temVoz) return;
        voz.falar([item.tts], { aoTerminar: function () { if (btn) btn.removeAttribute('data-falando'); } });
        depois(function () { if (btn) btn.removeAttribute('data-falando'); }, 1600);
      }
      function carta(item) {
        var rot = item.tipo === 'letra' ? item.c : (item.rotulo || item.c);
        var b = h('button', { type: 'button', class: 'af-carta', role: 'listitem', 'data-tipo': item.tipo,
          'aria-label': rot + ': ' + item.palavra + '. Pronúncia: ' + falaTxt(item.fala) + (item.ou ? ' ou ' + falaTxt(item.ou) : '') + (temVoz ? '. Toque para ouvir.' : ''),
          onclick: function () { tocarItem(item, b); } },
          h('span', { class: 'af-c' + (item.tipo === 'algarismo' && item.c.length > 1 ? ' af-c-longo' : '') }, item.c === '.' ? ',' : (item.c === 'stop' ? 'fim' : item.c)),
          h('span', { class: 'af-palavra' }, item.palavra),
          h('span', { class: 'af-falas' }, falaNode(item.fala), item.ou ? h('span', { class: 'af-ou' }, ' ou ') : null, item.ou ? falaNode(item.ou) : null),
          h('span', { class: 'af-br', 'aria-hidden': 'true' }, '≈ ' + item.br),
          item.rotulo ? h('span', { class: 'af-rot' }, item.rotulo) : null);
        return b;
      }
      function desenharTabela() {
        VL.$$('button', segTab).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.tabela)); });
        grade.innerHTML = ''; tabNotas.innerHTML = '';
        (est.tabela === 'letras' ? LETRAS : ALGARISMOS).forEach(function (it) { grade.appendChild(carta(it)); });
        grade.setAttribute('aria-label', est.tabela === 'letras' ? 'Letras do alfabeto fonético' : 'Algarismos e sinais');
        if (est.tabela === 'letras') {
          tabNotas.appendChild(VL.ui.callout('nota', 'Como está no Regulamento', h('div', null,
            h('p', null, 'Use esta tabela para soletrar indicativos de chamada, abreviaturas e palavras (', REF_AP14, ', §1). A grafia oficial é ', h('b', null, 'Alfa'), ' e ', h('b', null, 'Juliett'), '. A coluna de pronúncia é a do Regulamento ("spoken as"); para C e U ele aceita duas formas.'),
            h('p', null, 'A leitura com "≈" é só uma ajuda em português, feita para este app: não é oficial.'))));
        } else {
          tabNotas.appendChild(VL.ui.callout('nota', 'Algarismos no padrão da UIT', h('div', null,
            h('p', null, 'Para soletrar algarismos e sinais, o Regulamento manda usar estas palavras (', REF_AP14, ', §2). Diga todas as sílabas com a mesma ênfase (nota 2). "Decimal" é a vírgula decimal; "Stop", o ponto final.'),
            h('p', null, 'O material de apoio da Anatel para o exame de radiotelefonista (versão 2026-03) grafa "PENTAFIVE". O texto do Regulamento grafa ', h('b', null, 'Pantafive'), ' (PAN-TAH-FIVE). Aqui seguimos o Regulamento.'))));
          tabNotas.appendChild(VL.ui.callout('dica', 'Uso corrente', h('div', null,
            h('p', null, 'Na prática, fora das situações em que é preciso soletrar, muitos operadores dizem os algarismos um a um, de forma simples: em inglês ("one, two, three…") ou, entre estações brasileiras, em português. O próprio Regulamento lembra que a pronúncia dos algarismos do Apêndice 14 é diferente da usada nas Frases Padronizadas de Comunicação Marítima da IMO (RR, nota 32.7.1).'),
            h('p', null, 'Estações do mesmo país, falando entre si, podem usar outra tabela reconhecida pela sua administração (', REF_AP14, ', §3). Não encontramos uma tabela brasileira oficial para isso ', VL.ui.seloQ(null, 'Não localizamos ato da Anatel que reconheça outra tabela para uso entre estações brasileiras. Confirme na sua formação de radioperador.'), '.'))));
        }
      }

      /* ===== Soletrar ===== */
      var entrada = h('input', { type: 'text', class: 'af-entrada', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', maxlength: '40',
        value: opts.texto || pref.texto || 'Albatroz PQ4821', 'aria-describedby': null, oninput: function () { desenharSoletrar(); } });
      var idEnt = 'af-ent-' + Math.random().toString(36).slice(2, 8);
      entrada.id = idEnt;
      var segAlg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Como dizer os algarismos' });
      [['uit', 'Algarismos da UIT'], ['simples', 'Algarismos simples']].forEach(function (g) {
        segAlg.appendChild(h('button', { type: 'button', 'data-v': g[0], onclick: function () { est.alg = g[0]; salvarPref(); desenharSoletrar(); } }, g[1]));
      });
      var exemplos = h('div', { class: 'chip-list af-exemplos', role: 'group', 'aria-label': 'Exemplos' });
      [['Albatroz', 'nome do barco'], ['PQ4821', 'indicativo fictício'], ['710123456', 'MMSI fictício'], ['156,8', 'frequência']].forEach(function (x) {
        exemplos.appendChild(h('button', { type: 'button', class: 'chip', title: x[1], onclick: function () { entrada.value = x[0]; desenharSoletrar(); } }, x[0]));
      });
      var saida = h('ol', { class: 'af-saida', 'aria-label': 'Soletração' });
      var roteiro = h('p', { class: 'af-roteiro', 'aria-live': 'polite' });
      var btnOuvirSol = h('button', { type: 'button', class: 'btn btn-primary', hidden: !temVoz, onclick: function () { ouvirSoletrar(); } }, VL.icon('play', 18), 'Ouvir');
      var btnPararSol = h('button', { type: 'button', class: 'btn btn-ghost', hidden: !temVoz, onclick: function () { voz.parar(); marcarFalando(-1); } }, VL.icon('pausa', 18), 'Parar');
      vistas.soletrar.appendChild(h('div', { class: 'af-campo' },
        h('label', { for: idEnt, class: 'field-label' }, 'Nome do barco, indicativo ou MMSI'), entrada, exemplos));
      vistas.soletrar.appendChild(h('div', { class: 'af-linha' }, segAlg, btnOuvirSol, btnPararSol));
      vistas.soletrar.appendChild(saida);
      vistas.soletrar.appendChild(roteiro);
      vistas.soletrar.appendChild(h('p', { class: 'af-dica' }, 'Letras com acento ou cedilha são soletradas sem o sinal (Ç vira C). Vírgula ou ponto entre algarismos vira "Decimal"; ponto final vira "Stop". O MMSI de estação de navio brasileira começa por 710, o código do Brasil ',
        fonteOu('normas-175', 'NORMAM-211/DPC, art. 4.23.6 d'), '.'));

      /* treino de soletrar */
      var tre = { alvo: '', t0: 0, acertos: 0, total: 0 };
      var treAlvo = h('p', { class: 'af-alvo', 'aria-live': 'polite' });
      var treResp = h('input', { type: 'text', class: 'af-entrada', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false',
        'aria-label': 'Escreva as palavras-código, separadas por espaço', placeholder: 'ex.: Papa Quebec Kartefour…',
        onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); conferirTreino(); } } });
      var treFb = h('div', { class: 'af-fb', 'aria-live': 'polite' });
      var trePlacar = h('p', { class: 'af-placar' });
      var treBox = h('section', { class: 'af-treino', 'aria-label': 'Treino de soletrar' },
        h('h3', { class: 'af-h' }, 'Treino: soletre você'),
        h('p', { class: 'af-dica' }, 'Escreva as palavras-código do alfabeto, separadas por espaço. Para os algarismos, use as palavras da UIT (Nadazero, Unaone…).'),
        treAlvo, treResp,
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { conferirTreino(); } }, 'Conferir'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { novoTreino(); } }, 'Outro')),
        treFb, trePlacar);
      vistas.soletrar.appendChild(treBox);

      function marcarFalando(i) {
        VL.$$('.af-tok', saida).forEach(function (li, k) { if (k === i) li.setAttribute('data-falando', '1'); else li.removeAttribute('data-falando'); });
      }
      function desenharSoletrar() {
        VL.$$('button', segAlg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.alg)); });
        try { pref.texto = entrada.value; VL.store.set('alfabeto-fonetico.pref', { br: est.br, alg: est.alg, texto: entrada.value }); } catch (e) { /* ignora */ }
        var itens = soletrar(entrada.value);
        saida.innerHTML = '';
        var palavras = [];
        itens.forEach(function (x) {
          if (x.sep) { saida.appendChild(h('li', { class: 'af-sep', 'aria-label': 'espaço' })); palavras.push('/'); return; }
          var p = palavraDe(x.item, est.alg);
          palavras.push(p);
          saida.appendChild(h('li', { class: 'af-tok', 'data-tipo': x.item.tipo },
            h('span', { class: 'af-tok-c' }, x.item.c === 'stop' ? '.' : x.c), h('span', { class: 'af-tok-p' }, p)));
        });
        roteiro.textContent = itens.length ? 'Diga: ' + palavras.join(' ').replace(/ \/ /g, ' · ') : 'Escreva algo para soletrar.';
      }
      function ouvirSoletrar() {
        var itens = soletrar(entrada.value).filter(function (x) { return !x.sep; });
        var partes = itens.map(function (x) { return ttsDe(x.item, est.alg); });
        voz.falar(partes, { rate: 0.85, aoComecar: function (i) { marcarFalando(i); }, aoTerminar: function () { marcarFalando(-1); } });
      }
      function novoTreino() {
        tre.alvo = gerarItem(sortear(['indicativos', 'palavras']));
        tre.t0 = Date.now();
        treAlvo.innerHTML = '';
        treAlvo.appendChild(h('span', null, 'Soletre: '));
        treAlvo.appendChild(h('b', { class: 'af-alvo-txt' }, tre.alvo));
        treResp.value = ''; treFb.innerHTML = '';
      }
      function conferirTreino() {
        if (!tre.alvo) return;
        var alvo = soletrar(tre.alvo).filter(function (x) { return !x.sep; });
        var resp = (treResp.value || '').trim().split(/[\s,;]+/).filter(Boolean);
        var dt = Date.now() - tre.t0;
        var ok = alvo.length === resp.length;
        treFb.innerHTML = '';
        var lista = h('ol', { class: 'af-saida af-saida-fb' });
        alvo.forEach(function (x, i) {
          var certo = !!resp[i] && aceita(x.item, resp[i]);
          if (!certo) ok = false;
          var nota = certo && x.item.c === '5' && norm(resp[i]) === 'pentafive' ? ' (no RR: Pantafive)' : '';
          lista.appendChild(h('li', { class: 'af-tok', 'data-res': certo ? 'certa' : 'errada' },
            h('span', { class: 'af-tok-c' }, x.c), h('span', { class: 'af-tok-p' }, x.item.palavra + nota),
            !certo ? h('span', { class: 'af-tok-voce' }, resp[i] ? 'você: ' + resp[i] : 'faltou') : null));
        });
        tre.total++; if (ok) tre.acertos++;
        treFb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo, em ' + seg(dt) + '.' : 'Quase. Compare palavra por palavra:'));
        treFb.appendChild(lista);
        if (resp.length > alvo.length) treFb.appendChild(h('p', { class: 'af-dica' }, 'Você escreveu palavras a mais.'));
        trePlacar.textContent = 'Placar: ' + tre.acertos + ' de ' + tre.total + '.';
        if (ok) depois(novoTreino, 1800);
      }

      /* ===== Ouvir e digitar ===== */
      var ouv = { n: Math.max(3, Math.min(30, oOuvir.n | 0 || 10)), tipo: oOuvir.tipo, i: 0, acertos: 0, item: '', t0: 0, tempos: [], ativo: false, respondido: false, visual: !temVoz, lento: false };
      var selTipo = h('select', { class: 'af-sel', 'aria-label': 'O que vai ouvir', onchange: function () { ouv.tipo = selTipo.value; } });
      [['misto', 'Misto'], ['indicativos', 'Indicativos'], ['palavras', 'Palavras'], ['mmsi', 'MMSI (9 algarismos)']].forEach(function (o) {
        var op = h('option', { value: o[0] }, o[1]); if (o[0] === ouv.tipo) op.selected = true; selTipo.appendChild(op);
      });
      var swVisual = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Mostrar as palavras em vez de ouvir', onchange: function () { ouv.visual = swVisual.checked; mostrarDica(); } });
      swVisual.checked = ouv.visual;
      var ouvTopo = h('div', { class: 'af-linha' },
        h('label', { class: 'af-campo-in' }, h('span', { class: 'af-rotulo' }, 'Treinar'), selTipo),
        h('label', { class: 'switch af-switch' }, swVisual, h('span', null, temVoz ? 'Ler em vez de ouvir' : 'Modo visual (sem voz)')));
      if (!temVoz) swVisual.disabled = true;
      var ouvPainel = h('div', { class: 'af-painel', 'aria-live': 'polite' });
      var ouvDica = h('ol', { class: 'af-saida af-saida-dica', hidden: true });
      var ouvResp = h('input', { type: 'text', class: 'af-entrada af-entrada-grande', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', maxlength: '20',
        'aria-label': 'Digite as letras e algarismos que você ouviu', placeholder: 'ex.: PQ4821',
        onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); if (ouv.respondido) proximoOuvir(); else conferirOuvir(); } } });
      var ouvFb = h('div', { class: 'af-fb', 'aria-live': 'polite' });
      var ouvRel = h('p', { class: 'af-relogio', 'aria-live': 'off' }, '0,0 s');
      var ouvPlacar = h('p', { class: 'af-placar' });
      var btnComecar = h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { comecarOuvir(); } }, 'Começar rodada');
      var btnDeNovo = h('button', { type: 'button', class: 'btn btn-ghost', hidden: true, onclick: function () { tocarOuvir(false); } }, VL.icon('reiniciar', 18), 'Ouvir de novo');
      var btnLento = h('button', { type: 'button', class: 'btn btn-ghost', hidden: true, onclick: function () { tocarOuvir(true); } }, 'Mais devagar');
      var btnConf = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { if (ouv.respondido) proximoOuvir(); else conferirOuvir(); } }, 'Conferir');
      var ouvJogo = h('div', { class: 'af-jogo', hidden: true },
        h('div', { class: 'spread' }, h('p', { class: 'af-contador' }), ouvRel),
        ouvDica, ouvResp,
        h('div', { class: 'btn-row' }, btnConf, btnDeNovo, btnLento),
        ouvFb);
      vistas.ouvir.appendChild(ouvTopo);
      vistas.ouvir.appendChild(h('p', { class: 'af-dica' }, temVoz
        ? 'A voz diz um indicativo, uma palavra ou um MMSI usando o alfabeto fonético. Digite o que entendeu. Se não ouvir nada, ligue "Ler em vez de ouvir".'
        : 'Você lê as palavras-código e digita as letras e algarismos que elas representam.'));
      vistas.ouvir.appendChild(ouvPainel);
      ouvPainel.appendChild(btnComecar);
      vistas.ouvir.appendChild(ouvJogo);
      vistas.ouvir.appendChild(ouvPlacar);

      var relTick = null;
      function pararRelogio() { if (relTick) { clearInterval(relTick); relTick = null; } }
      function iniciarRelogio(fnAtual) { pararRelogio(); relTick = setInterval(fnAtual, 100); }
      function mostrarDica() {
        if (!ouv.item) return;
        var itens = soletrar(ouv.item).filter(function (x) { return !x.sep; });
        ouvDica.innerHTML = '';
        itens.forEach(function (x) { ouvDica.appendChild(h('li', { class: 'af-tok af-tok-so' }, h('span', { class: 'af-tok-p' }, x.item.palavra))); });
        ouvDica.hidden = !ouv.visual && !ouv.respondido;
        btnDeNovo.hidden = btnLento.hidden = ouv.visual || !temVoz;
      }
      function tocarOuvir(lento) {
        if (ouv.visual || !temVoz) return;
        var itens = soletrar(ouv.item).filter(function (x) { return !x.sep; });
        voz.falar(itens.map(function (x) { return x.item.tts; }), { rate: lento ? 0.62 : 0.88 });
      }
      function comecarOuvir() {
        ouv.i = 0; ouv.acertos = 0; ouv.tempos = []; ouv.ativo = true;
        btnComecar.hidden = true; ouvJogo.hidden = false; ouvPlacar.textContent = '';
        proximoOuvir();
      }
      function proximoOuvir() {
        if (ouv.i >= ouv.n) { fimOuvir(); return; }
        ouv.i++; ouv.respondido = false;
        ouv.item = gerarItem(ouv.tipo);
        VL.$('.af-contador', ouvJogo).textContent = 'Item ' + ouv.i + ' de ' + ouv.n + ' · acertos: ' + ouv.acertos;
        ouvResp.value = ''; ouvResp.disabled = false; ouvFb.innerHTML = ''; btnConf.hidden = false; btnConf.textContent = 'Conferir';
        mostrarDica();
        ouv.t0 = Date.now();
        iniciarRelogio(function () { ouvRel.textContent = seg(Date.now() - ouv.t0); });
        tocarOuvir(false);
        try { ouvResp.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
      }
      function conferirOuvir() {
        if (!ouv.ativo || ouv.respondido) return;
        var dt = Date.now() - ouv.t0; pararRelogio(); ouvRel.textContent = seg(dt);
        var r = VL.semAcento(ouvResp.value).toUpperCase().replace(/[^A-Z0-9]/g, '');
        var ok = r === ouv.item;
        ouv.respondido = true; ouvResp.disabled = true;
        if (ok) { ouv.acertos++; ouv.tempos.push(dt); }
        ouvFb.innerHTML = '';
        ouvFb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo: ' + ouv.item + ' (' + seg(dt) + ').' : 'Era ' + ouv.item + (r ? '; você digitou ' + r : '') + '.'));
        mostrarDica(); ouvDica.hidden = false;
        btnConf.textContent = ouv.i >= ouv.n ? 'Ver resultado' : 'Próximo';
        VL.$('.af-contador', ouvJogo).textContent = 'Item ' + ouv.i + ' de ' + ouv.n + ' · acertos: ' + ouv.acertos;
        try { btnConf.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
      }
      function fimOuvir() {
        ouv.ativo = false; pararRelogio(); voz.parar();
        ouvJogo.hidden = true; btnComecar.hidden = false; btnComecar.textContent = 'Jogar de novo';
        var media = ouv.tempos.length ? ouv.tempos.reduce(function (a, b) { return a + b; }, 0) / ouv.tempos.length : 0;
        var chave = 'ouvir-' + ouv.tipo + (ouv.visual ? '-visual' : '');
        var rec = recordes[chave];
        var novo = !rec || ouv.acertos > rec.acertos || (ouv.acertos === rec.acertos && media && media < rec.media);
        if (novo && ouv.acertos) { recordes[chave] = { acertos: ouv.acertos, n: ouv.n, media: Math.round(media) }; salvarRec(); }
        ouvPlacar.innerHTML = '';
        ouvPlacar.appendChild(h('span', null, 'Resultado: ' + ouv.acertos + ' de ' + ouv.n + (media ? ', tempo médio dos acertos ' + seg(media) : '') + '. '));
        var r2 = recordes[chave];
        if (r2) ouvPlacar.appendChild(h('span', { class: novo && ouv.acertos ? 'af-recorde' : '' }, (novo && ouv.acertos ? 'Novo recorde neste aparelho! ' : 'Recorde neste aparelho: ') + r2.acertos + ' de ' + r2.n + ', média ' + seg(r2.media) + '.'));
      }

      /* ===== Contra o relógio ===== */
      var rel = { seg: Math.max(15, Math.min(300, oRel.segundos | 0 || 60)), direcao: oRel.direcao === 'palavra' ? 'palavra' : 'letra', resposta: oRel.resposta === 'tocar' ? 'tocar' : 'digitar',
        alg: !!oRel.algarismos, semTempo: false, ativo: false, fim: 0, pts: 0, erros: 0, item: null, ultimo: null, tick: null };
      var segDir = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Direção' });
      [['letra', 'Letra para palavra'], ['palavra', 'Palavra para letra']].forEach(function (g) {
        segDir.appendChild(h('button', { type: 'button', 'data-v': g[0], onclick: function () { if (rel.ativo) return; rel.direcao = g[0]; desenharRelogioCfg(); } }, g[1]));
      });
      var segResp = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Como responder' });
      [['tocar', 'Tocar na resposta'], ['digitar', 'Digitar']].forEach(function (g) {
        segResp.appendChild(h('button', { type: 'button', 'data-v': g[0], onclick: function () { if (rel.ativo) return; rel.resposta = g[0]; desenharRelogioCfg(); } }, g[1]));
      });
      var chkAlg = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Incluir algarismos', onchange: function () { rel.alg = chkAlg.checked; } });
      chkAlg.checked = rel.alg;
      var chkSem = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Treinar sem limite de tempo', onchange: function () { rel.semTempo = chkSem.checked; desenharRelogioCfg(); } });
      var relCfg = h('div', { class: 'af-cfg' }, segDir, segResp,
        h('label', { class: 'switch af-switch' }, chkAlg, h('span', null, 'Incluir algarismos')),
        h('label', { class: 'switch af-switch' }, chkSem, h('span', null, 'Sem limite de tempo')));
      var relRelogio = h('p', { class: 'af-relogio af-relogio-grande', role: 'timer', 'aria-live': 'off' });
      var relPts = h('p', { class: 'af-contador' });
      var relPergunta = h('p', { class: 'af-pergunta', 'aria-live': 'polite' });
      var relOpcoes = h('div', { class: 'af-opcoes', role: 'group', 'aria-label': 'Respostas' });
      var relResp = h('input', { type: 'text', class: 'af-entrada af-entrada-grande', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false',
        'aria-label': 'Sua resposta', onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); responderRel(relResp.value); } } });
      var relFb = h('p', { class: 'af-fb-curto', 'aria-live': 'polite' });
      var btnRelIni = h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { comecarRel(); } }, 'Começar');
      var btnRelFim = h('button', { type: 'button', class: 'btn btn-ghost', hidden: true, onclick: function () { fimRel(true); } }, 'Encerrar');
      var relRes = h('div', { class: 'af-placar', 'aria-live': 'polite' });
      var relJogo = h('div', { class: 'af-jogo', hidden: true }, h('div', { class: 'spread' }, relPts, relRelogio), relPergunta, relOpcoes, relResp, relFb);
      vistas.relogio.appendChild(relCfg);
      vistas.relogio.appendChild(h('div', { class: 'btn-row' }, btnRelIni, btnRelFim));
      vistas.relogio.appendChild(relJogo);
      vistas.relogio.appendChild(relRes);

      function desenharRelogioCfg() {
        VL.$$('button', segDir).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === rel.direcao)); });
        VL.$$('button', segResp).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === rel.resposta)); });
        btnRelIni.textContent = rel.semTempo ? 'Começar treino livre' : 'Começar (' + rel.seg + ' s)';
        var chave = 'relogio-' + rel.direcao + '-' + rel.resposta;
        relRes.textContent = recordes[chave] ? 'Recorde neste aparelho: ' + recordes[chave] + ' acertos em ' + rel.seg + ' s.' : '';
      }
      function poolRel() { return rel.alg ? LETRAS.concat(ALGARISMOS.slice(0, 10)) : LETRAS; }
      function novaPerguntaRel() {
        var pool = poolRel(), it;
        do { it = sortear(pool); } while (pool.length > 1 && it === rel.ultimo);
        rel.item = it; rel.ultimo = it;
        relPergunta.innerHTML = '';
        if (rel.direcao === 'letra') relPergunta.appendChild(h('span', { class: 'af-pergunta-c' }, it.c));
        else relPergunta.appendChild(h('span', { class: 'af-pergunta-p' }, it.palavra));
        relOpcoes.innerHTML = '';
        relOpcoes.hidden = rel.resposta !== 'tocar'; relResp.hidden = rel.resposta !== 'digitar';
        if (rel.resposta === 'tocar') {
          var mesmos = pool.filter(function (x) { return x.tipo === it.tipo && x !== it; });
          var ops = VL.embaralhar([it].concat(VL.embaralhar(mesmos).slice(0, 3)));
          ops.forEach(function (o) {
            relOpcoes.appendChild(h('button', { type: 'button', class: 'btn af-opcao', onclick: function () { responderRel(o === it ? '__ok__' : (rel.direcao === 'letra' ? o.palavra : o.c)); } },
              rel.direcao === 'letra' ? o.palavra : o.c));
          });
        } else {
          relResp.value = '';
          relResp.placeholder = rel.direcao === 'letra' ? 'palavra-código' : 'letra ou algarismo';
          try { relResp.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
        }
      }
      function responderRel(r) {
        if (!rel.ativo || !rel.item) return;
        var it = rel.item, ok;
        if (r === '__ok__') ok = true;
        else if (rel.direcao === 'letra') ok = aceita(it, r);
        else ok = VL.semAcento(r).toUpperCase().replace(/[^A-Z0-9]/g, '') === it.c;
        if (ok) { rel.pts++; relFb.textContent = 'Certo: ' + it.c + ' = ' + it.palavra + '.'; relFb.setAttribute('data-ok', '1'); }
        else { rel.erros++; relFb.textContent = 'Não: ' + it.c + ' = ' + it.palavra + ' (' + falaTxt(it.fala) + ').'; relFb.setAttribute('data-ok', '0'); }
        relPts.textContent = 'Acertos: ' + rel.pts + ' · erros: ' + rel.erros;
        novaPerguntaRel();
      }
      function atualizarRel() {
        if (rel.semTempo) { relRelogio.textContent = 'sem limite'; return; }
        var falta = Math.max(0, rel.fim - Date.now());
        relRelogio.textContent = VL.fmt.min(Math.ceil(falta / 1000));
        relRelogio.setAttribute('data-alerta', falta < 10000 ? '1' : '0');
        if (falta <= 0) fimRel(false);
      }
      function comecarRel() {
        rel.ativo = true; rel.pts = 0; rel.erros = 0; rel.ultimo = null;
        rel.fim = Date.now() + rel.seg * 1000;
        relCfg.hidden = true; btnRelIni.hidden = true; btnRelFim.hidden = false; relJogo.hidden = false; relRes.textContent = ''; relFb.textContent = '';
        relPts.textContent = 'Acertos: 0 · erros: 0';
        novaPerguntaRel(); atualizarRel();
        if (rel.tick) clearInterval(rel.tick);
        rel.tick = setInterval(atualizarRel, 200);
      }
      function fimRel(manual) {
        if (!rel.ativo) return;
        rel.ativo = false; if (rel.tick) { clearInterval(rel.tick); rel.tick = null; }
        relCfg.hidden = false; btnRelIni.hidden = false; btnRelFim.hidden = true; relJogo.hidden = true;
        desenharRelogioCfg();
        var chave = 'relogio-' + rel.direcao + '-' + rel.resposta;
        var txt = 'Resultado: ' + rel.pts + ' acertos e ' + rel.erros + ' erros' + (rel.semTempo ? '.' : ' em ' + rel.seg + ' s.');
        relRes.innerHTML = '';
        relRes.appendChild(h('span', null, txt + ' '));
        if (!rel.semTempo && !manual && rel.pts > (recordes[chave] || 0)) {
          recordes[chave] = rel.pts; salvarRec();
          relRes.appendChild(h('span', { class: 'af-recorde' }, 'Novo recorde neste aparelho!'));
        } else if (recordes[chave]) relRes.appendChild(h('span', null, 'Recorde: ' + recordes[chave] + '.'));
      }

      /* ===== Modo ===== */
      function trocarModo(m) {
        voz.parar(); pararRelogio(); if (rel.ativo) fimRel(true);
        est.modo = m;
        VL.$$('button', segModo).forEach(function (b) { var on = b.getAttribute('data-v') === m; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-selected', String(on)); });
        TODOS.forEach(function (k) { vistas[k].hidden = k !== m; });
        if (m === 'tabela') desenharTabela();
        if (m === 'soletrar') { desenharSoletrar(); if (!tre.alvo) novoTreino(); }
        if (m === 'relogio') desenharRelogioCfg();
        if (m === 'ouvir' && ouv.ativo) iniciarRelogio(function () { if (!ouv.respondido) ouvRel.textContent = seg(Date.now() - ouv.t0); });
      }

      /* vozes chegam depois em alguns navegadores */
      function aoVozes() { /* só para escolher a voz certa na próxima fala */ }
      if (temVoz && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', aoVozes);
      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (ents) {
          est.visivel = ents[ents.length - 1].isIntersecting;
          if (!est.visivel) voz.parar();
        }, { threshold: 0 });
        io.observe(ins.raiz);
      }
      trocarModo(est.modo);

      return function limpar() {
        voz.parar(); pararRelogio();
        if (rel.tick) clearInterval(rel.tick);
        timers.forEach(clearTimeout); timers = [];
        if (temVoz && window.speechSynthesis.removeEventListener) window.speechSynthesis.removeEventListener('voiceschanged', aoVozes);
        if (io) io.disconnect();
      };
    },
  });
})();
