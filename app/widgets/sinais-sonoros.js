/* sinais-sonoros — sinais sonoros do RIPEAM-72 (Regras 32 a 37 e Anexos III e IV), sintetizados com Web Audio.
   Cada sinal aparece numa linha do tempo (duração real dos apitos; o intervalo de até 1 ou 2 minutos entre as
   repetições é desenhado comprimido e pode ser "acelerado" 12 vezes). O áudio só começa depois de um clique.

   Fontes citadas na interface:
   - RIPEAM-72 (COLREG), texto promulgado pelo Decreto 80.068/1977, com as emendas do Decreto 10.901/2021
     (Regra 33(a) com o gongo para 100 m ou mais; Regra 35 renumerada com o novo parágrafo (i) para 12 a 20 m;
     Anexo III, Seção 1, alcance audível por comprimento).
   - Regra 32 (definições: curto ≈ 1 s, longo 4 a 6 s), 33 (equipamento), 34 (manobra e advertência),
     35 (visibilidade restrita), 36 (chamar a atenção), 37 e Anexo IV (sinais de perigo).
   - Anexo III, Seção 1(b): frequência fundamental do apito por comprimento (70–200 Hz para 200 m ou mais;
     130–350 Hz de 75 a 200 m; 250–700 Hz abaixo de 75 m). Os intervalos entre apitos de um mesmo sinal não são
     fixados pelo RIPEAM (exceto os ~2 s da Regra 35(b)); aqui usamos 1 s, como nos sinais luminosos da Regra 34(b).

   opts de mount (todos opcionais):
     modo:     'explorar' | 'desafio'                              padrão 'explorar'
     grupo:    'manobra' | 'cerracao' | 'perigo' | 'equipamento'   aba inicial no modo explorar, padrão 'manobra'
     sinal:    id do sinal pré-selecionado (m1 m2 m3 m5 u1 u2 u3 c1 · v1 … v10 · p1 p2 p3 · e1 … e4)
     desafio:  'ouvir' | 'dar'                                     tipo de desafio inicial, padrão 'ouvir'
     grupos:   ['manobra', 'cerracao', 'perigo']                   grupos sorteados no desafio
     acelerar: false                                               intervalos passam 12× mais rápido
     titulo:   texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'sinais-sonoros', opts:{grupo:'cerracao', sinal:'v3'}}
     {t:'widget', w:'sinais-sonoros', opts:{modo:'desafio', desafio:'dar', grupos:['cerracao']}} */
(function () {
  'use strict';
  var h = VL.h;
  var FATOR = 12;

  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function en(txt) { return txt ? h('span', { class: 'ss-en', 'data-intl': 'on' }, ' (' + txt + ')') : null; }
  function mmss(s) { s = Math.max(0, Math.floor(s)); var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function num(x) { return VL.fmt.num(x, x % 1 ? 1 : 0); }

  /* ---------- Elementos sonoros ---------- */
  var DUR = { C: 1, L: 5, p: 0.25, t: 0.75, S: 5, G: 5, b: 0.25, X: 0.35, K: 12 };
  var APITO = { C: 1, L: 1, p: 1, t: 1, K: 1 };
  var NOME_EL = {
    C: 'apito curto, cerca de 1 s', L: 'apito longo, de 4 a 6 s (aqui 5 s)', p: 'ponto do código Morse', t: 'traço do código Morse',
    S: 'sino tocado rapidamente, cerca de 5 s', G: 'gongo tocado rapidamente, cerca de 5 s', b: 'badalada isolada no sino',
    X: 'tiro ou explosão', K: 'som contínuo do apito ou buzina de nevoeiro',
  };
  var ROT_EL = { C: 'curto', L: 'longo', p: '', t: '', S: 'sino', G: 'gongo', b: '', X: 'tiro', K: 'contínuo' };

  /* Itens: 'C', 'L'…; número = pausa (s) antes do próximo; objeto {k, outra:true, rot}.
     Pausa padrão: 1 s entre apitos e entre badaladas; 0,8 s nos demais casos. */
  function montarSeq(itens, pausaPadrao) {
    var els = [], t = 0, pend = null;
    itens.forEach(function (it) {
      if (typeof it === 'number') { pend = it; return; }
      var o = typeof it === 'string' ? { k: it } : Object.assign({}, it);
      if (els.length) {
        var ant = els[els.length - 1].k;
        t += pend != null ? pend : pausaPadrao != null ? pausaPadrao : ((APITO[o.k] && APITO[ant]) || (o.k === 'b' && ant === 'b') ? 1 : 0.8);
      }
      pend = null;
      o.t = t; o.d = o.d || DUR[o.k];
      els.push(o); t += o.d;
    });
    return els;
  }
  var MORSE_SOS = ['p', 0.25, { k: 'p', rot: 'S' }, 0.25, 'p', 0.75, 't', 0.25, { k: 't', rot: 'O' }, 0.25, 't', 0.75, 'p', 0.25, { k: 'p', rot: 'S' }, 0.25, 'p'];

  /* ---------- Catálogo ---------- */
  var GRUPOS = {
    manobra: { rotulo: 'Manobra e advertência', regra: 'Regra 34', ctx: 'Em boa visibilidade, uma embarcação à vista dá este sinal. O que ela está dizendo?' },
    cerracao: { rotulo: 'Visibilidade restrita', regra: 'Regra 35', ctx: 'Na cerração, você ouve este sinal sem ver de onde vem. Que embarcação é?' },
    perigo: { rotulo: 'Perigo', regra: 'Regra 37', ctx: 'Você ouve este sinal. O que ele significa?' },
    equipamento: { rotulo: 'Apito, sino e gongo', regra: 'Regras 32 e 33' },
  };
  var ORDEM_GRUPOS = ['manobra', 'cerracao', 'perigo', 'equipamento'];

  var C2 = 'a cada 2 minutos, no máximo', C1 = 'a cada 1 minuto, no máximo';
  var CATALOGO = [
    { id: 'm1', g: 'manobra', seq: ['C'], padrao: 'um curto', resp: 'Estou guinando para boreste', en: 'I am altering my course to starboard', regra: 'Regra 34(a)(i)', luz: true,
      quem: 'Embarcação de propulsão mecânica, em movimento e à vista de outra, ao guinar.' },
    { id: 'm2', g: 'manobra', seq: ['C', 'C'], padrao: 'dois curtos', resp: 'Estou guinando para bombordo', en: 'I am altering my course to port', regra: 'Regra 34(a)(ii)', luz: true,
      quem: 'Embarcação de propulsão mecânica, em movimento e à vista de outra, ao guinar.' },
    { id: 'm3', g: 'manobra', seq: ['C', 'C', 'C'], padrao: 'três curtos', resp: 'Estou dando máquinas a ré', en: 'I am operating astern propulsion', regra: 'Regra 34(a)(iii)', luz: true,
      quem: 'Embarcação de propulsão mecânica, à vista de outra.', nota: 'Dar máquinas a ré não quer dizer que ela já esteja andando para trás: ainda pode ter seguimento avante.' },
    { id: 'm5', g: 'manobra', seq: ['C', 'C', 'C', 'C', 'C'], pausa: 0.4, padrao: 'cinco ou mais curtos e rápidos', resp: 'Não entendo suas intenções, ou duvido que sua manobra evite o abalroamento', en: 'doubt signal', regra: 'Regra 34(d)', luz: true,
      quem: 'Qualquer embarcação, inclusive veleiro, quando duas se aproximam à vista uma da outra.', nota: 'Pode ser reforçado por cinco ou mais lampejos curtos e rápidos.' },
    { id: 'u1', g: 'manobra', seq: ['L', 'L', 'C'], padrao: 'dois longos e um curto', resp: 'Pretendo ultrapassá-lo pelo seu boreste', en: 'I intend to overtake you on your starboard side', regra: 'Regra 34(c)(i)',
      quem: 'Num canal estreito ou via de acesso, quem quer ultrapassar e precisa que a outra abra espaço (Regra 9(e)(i)).' },
    { id: 'u2', g: 'manobra', seq: ['L', 'L', 'C', 'C'], padrao: 'dois longos e dois curtos', resp: 'Pretendo ultrapassá-lo pelo seu bombordo', en: 'I intend to overtake you on your port side', regra: 'Regra 34(c)(i)',
      quem: 'Num canal estreito ou via de acesso, quem quer ultrapassar e precisa que a outra abra espaço (Regra 9(e)(i)).' },
    { id: 'u3', g: 'manobra', seq: ['L', 'C', 'L', 'C'], padrao: 'longo, curto, longo, curto', resp: 'Concordo com a sua ultrapassagem', en: 'agreement to be overtaken', regra: 'Regra 34(c)(ii)',
      quem: 'Resposta de quem vai ser ultrapassada, num canal estreito.', nota: 'Se estiver em dúvida, em vez de concordar ela dá cinco ou mais curtos (Regra 9(e)(i)).' },
    { id: 'c1', g: 'manobra', seq: ['L', 3, { k: 'L', outra: true, rot: 'resposta' }], padrao: 'um longo', resp: 'Estou chegando a uma curva ou a um trecho encoberto', en: 'nearing a bend', regra: 'Regra 34(e)',
      quem: 'Qualquer embarcação ao chegar a uma curva ou trecho de canal onde outras possam estar escondidas por um obstáculo.', nota: 'Quem estiver do outro lado e ouvir responde também com um longo (em contorno, na linha do tempo).' },

    { id: 'v1', g: 'cerracao', seq: ['L'], intervalo: 120, padrao: 'um longo', resp: 'Propulsão mecânica com seguimento', en: 'power-driven vessel making way', regra: 'Regra 35(a)',
      quem: 'Embarcação de propulsão mecânica com seguimento, isto é, andando na água.' },
    { id: 'v2', g: 'cerracao', seq: ['L', 2, 'L'], intervalo: 120, padrao: 'dois longos, com cerca de 2 s entre eles', resp: 'Propulsão mecânica parada, sem seguimento', en: 'power-driven vessel underway but stopped', regra: 'Regra 35(b)',
      quem: 'Embarcação de propulsão mecânica em movimento (não fundeada nem amarrada), mas parada e sem seguimento.' },
    { id: 'v3', g: 'cerracao', seq: ['L', 'C', 'C'], intervalo: 120, padrao: 'um longo e dois curtos', resp: 'Sem governo, manobra restrita, restrita pelo calado, a vela, pescando, rebocando ou empurrando', en: 'NUC, RAM, CBD, sailing, fishing, towing or pushing', regra: 'Regra 35(c) e (d)',
      quem: 'Sem governo, com capacidade de manobra restrita, restrita devido ao calado, a vela, engajada na pesca, ou rebocando ou empurrando outra.', nota: 'Também a que pesca fundeada e a de manobra restrita fundeada, no lugar do sino (Regra 35(d)).' },
    { id: 'v4', g: 'cerracao', seq: [{ k: 'L', outra: true, rot: 'rebocador' }, { k: 'C', outra: true }, { k: 'C', outra: true }, 2, 'L', 'C', 'C', 'C'], intervalo: 120, padrao: 'um longo e três curtos', resp: 'Embarcação rebocada, a última do reboque, tripulada', en: 'vessel towed', regra: 'Regra 35(e)',
      quem: 'A embarcação rebocada (ou a última, se houver mais de uma), quando tiver tripulação.', nota: 'Se possível, logo depois do sinal do rebocador (em contorno, na linha do tempo): longo e dois curtos seguidos de longo e três curtos indicam um reboque.' },
    { id: 'v5', g: 'cerracao', seq: ['S'], intervalo: 60, padrao: 'sino tocado rapidamente por cerca de 5 s', resp: 'Fundeada, com menos de 100 m', en: 'vessel at anchor', regra: 'Regra 35(g)',
      quem: 'Embarcação fundeada com menos de 100 m.', nota: 'De 12 a 20 m, pode trocar o sino por outro sinal sonoro eficiente a cada 2 minutos, no máximo (Regra 35(i)).' },
    { id: 'v6', g: 'cerracao', seq: ['S', 0.3, 'G'], intervalo: 60, padrao: 'sino a vante por cerca de 5 s e, logo depois, gongo a ré por cerca de 5 s', resp: 'Fundeada, com 100 m ou mais', en: 'vessel at anchor, 100 m or more', regra: 'Regra 35(g)',
      quem: 'Embarcação fundeada com 100 m ou mais: o sino na proa, o gongo na popa.' },
    { id: 'v7', g: 'cerracao', seq: ['C', 'L', 'C'], padrao: 'curto, longo, curto', resp: 'Fundeada, avisando quem se aproxima', en: 'warning from vessel at anchor', regra: 'Regra 35(g)',
      quem: 'Embarcação fundeada que quer avisar sua posição e a possibilidade de abalroamento a quem se aproxima.', nota: 'É opcional e vem além do sino.' },
    { id: 'v8', g: 'cerracao', seq: ['b', 'b', 'b', 0.8, 'S', 0.8, 'b', 'b', 'b'], intervalo: 60, padrao: 'três badaladas, sino rápido por cerca de 5 s, três badaladas', resp: 'Encalhada', en: 'vessel aground', regra: 'Regra 35(h)',
      quem: 'Embarcação encalhada com menos de 100 m.', nota: 'Pode também dar um sinal de apito apropriado (Regra 35(h)).' },
    { id: 'v9', g: 'cerracao', seq: ['b', 'b', 'b', 0.8, 'S', 0.8, 'b', 'b', 'b', 0.3, 'G'], intervalo: 60, padrao: 'três badaladas, sino rápido, três badaladas e, logo depois, gongo a ré', resp: 'Encalhada, com 100 m ou mais', en: 'vessel aground, 100 m or more', regra: 'Regra 35(h) e (g)',
      quem: 'Embarcação encalhada com 100 m ou mais.' },
    { id: 'v10', g: 'cerracao', seq: [{ k: 'L', rot: 'longo' }, 1.5, 'C', 'C', 'C', 'C'], intervalo: 120, padrao: 'um longo e, como identidade, quatro curtos', resp: 'Praticagem em serviço, com seguimento', en: 'pilot vessel identity signal', regra: 'Regra 35(a) e (k)',
      quem: 'Embarcação de praticagem em serviço: além do sinal normal (Regra 35(a), (b) ou (g)), pode dar quatro curtos como sinal de identidade.' },

    { id: 'p1', g: 'perigo', seq: ['K'], padrao: 'som contínuo de qualquer aparelho de sinalização de nevoeiro', resp: 'Pedido de socorro: som contínuo de nevoeiro', en: 'continuous sounding with any fog-signalling apparatus', regra: 'Regra 37 e Anexo IV, 1(b)',
      quem: 'Embarcação em perigo, pedindo socorro.', nota: 'Na linha do tempo, 12 s; na vida real, sem parar.' },
    { id: 'p2', g: 'perigo', seq: ['X'], intervalo: 60, intTxt: 'a intervalos de cerca de 1 minuto', padrao: 'tiro de canhão ou outro sinal explosivo', resp: 'Pedido de socorro: tiro ou explosão a cada minuto', en: 'gun or other explosive signal', regra: 'Regra 37 e Anexo IV, 1(a)',
      quem: 'Embarcação em perigo, pedindo socorro.' },
    { id: 'p3', g: 'perigo', seq: MORSE_SOS, padrao: 'SOS em código Morse: três pontos, três traços, três pontos', resp: 'Pedido de socorro: SOS em código Morse', en: 'SOS', regra: 'Regra 37 e Anexo IV, 1(d)',
      quem: 'Embarcação em perigo, por qualquer meio de sinalização: apito, luz, rádio.', nota: 'O RIPEAM não fixa a duração dos pontos e traços; o traço vale três pontos, como no Morse.' },

    { id: 'e1', g: 'equipamento', seq: ['C'], padrao: 'apito curto', resp: 'Apito curto: cerca de 1 segundo', en: 'short blast', regra: 'Regra 32(b)', quem: 'A unidade dos sinais de manobra.' },
    { id: 'e2', g: 'equipamento', seq: ['L'], padrao: 'apito longo', resp: 'Apito longo: de 4 a 6 segundos', en: 'prolonged blast', regra: 'Regra 32(c)', quem: 'Aqui, 5 s. Conte devagar: "mil e um, mil e dois…".' },
    { id: 'e3', g: 'equipamento', seq: ['S'], padrao: 'sino tocado rapidamente', resp: 'Sino', en: 'bell', regra: 'Regra 33(a)', quem: 'Obrigatório com 20 m ou mais; usado fundeada e encalhada.' },
    { id: 'e4', g: 'equipamento', seq: ['G'], padrao: 'gongo tocado rapidamente', resp: 'Gongo', en: 'gong', regra: 'Regra 33(a)', quem: 'Obrigatório com 100 m ou mais, com tom que não se confunda com o do sino.' },
  ];
  var POR_ID = {};
  CATALOGO.forEach(function (s) {
    s.els = montarSeq(s.seq, s.pausa);
    s.intTxt = s.intTxt || (s.intervalo === 120 ? C2 : s.intervalo === 60 ? C1 : '');
    POR_ID[s.id] = s;
  });
  var NENHUM = { id: 'nenhum', padrao: 'nenhum sinal de manobra', resp: 'Nenhum sinal de manobra', els: [], intTxt: '' };

  var DAR = [
    { p: 'Você comanda uma lancha, à vista de outra embarcação, e vai guinar para boreste.', r: 'm1' },
    { p: 'Você comanda uma lancha, à vista de outra embarcação, e vai guinar para bombordo.', r: 'm2' },
    { p: 'Num barco a motor, à vista de outro, você engrena a ré para parar.', r: 'm3' },
    { p: 'Um navio se aproxima, à vista, e você não entende o que ele pretende fazer.', r: 'm5' },
    { p: 'Num canal estreito, você quer ultrapassar o barco da frente pelo boreste dele, e ele precisa abrir espaço.', r: 'u1' },
    { p: 'Num canal estreito, você quer ultrapassar o barco da frente pelo bombordo dele, e ele precisa abrir espaço.', r: 'u2' },
    { p: 'Num canal estreito, o barco de trás pediu para ultrapassar você, e você concorda.', r: 'u3' },
    { p: 'Você vai entrar numa curva do canal, e a margem esconde quem vem do outro lado.', r: 'c1' },
    { p: 'Na cerração, você navega num barco a motor de 15 m, com seguimento.', r: 'v1' },
    { p: 'Na cerração, você parou as máquinas do seu barco a motor de 15 m, e ele já está sem seguimento.', r: 'v2' },
    { p: 'Na cerração, seu veleiro de 14 m navega só a vela.', r: 'v3' },
    { p: 'Na cerração, seu pesqueiro de 20 m está pescando de arrasto.', r: 'v3' },
    { p: 'Na cerração, seu rebocador está rebocando uma balsa.', r: 'v3' },
    { p: 'Na cerração, você está a bordo da balsa rebocada, a última do reboque.', r: 'v4' },
    { p: 'Na cerração, seu barco de 30 m está fundeado.', r: 'v5' },
    { p: 'Na cerração, seu navio de 150 m está fundeado.', r: 'v6' },
    { p: 'Na cerração, seu barco de 30 m encalhou num banco de areia.', r: 'v8' },
    { p: 'Seu veleiro navega só a vela, à vista de outra embarcação, e você vai guinar para boreste.', r: 'nenhum', dist: ['m1', 'm5', 'u1'],
      exp: 'Os sinais de manobra da Regra 34(a) são de embarcação de propulsão mecânica. Navegando só a vela, você não dá sinal para guinar; se tiver dúvida sobre a intenção da outra, aí sim dá cinco curtos (Regra 34(d)).' },
  ];

  /* ---------- Motor de áudio (Web Audio, criado só após clique) ---------- */
  function Motor() {
    var ctx = null, master = null, ruido = null, vol = 0.6, mudo = false, timers = [], buses = [];
    function garantir() {
      if (ctx) { if (ctx.state === 'suspended' && ctx.resume) ctx.resume(); return ctx; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.25;
      master = ctx.createGain(); master.gain.value = mudo ? 0 : vol * vol;
      master.connect(comp); comp.connect(ctx.destination);
      return ctx;
    }
    function aplicar() { if (master) master.gain.setTargetAtTime(mudo ? 0 : vol * vol, ctx.currentTime, 0.02); }
    function novoBus() { var g = ctx.createGain(); g.connect(master); var b = { g: g, fontes: [] }; buses.push(b); return b; }
    function soltar(b, imediato) {
      var i = buses.indexOf(b); if (i >= 0) buses.splice(i, 1);
      var t = ctx.currentTime;
      if (imediato) { try { b.g.gain.cancelScheduledValues(t); b.g.gain.setValueAtTime(b.g.gain.value, t); b.g.gain.linearRampToValueAtTime(0, t + 0.04); } catch (e) { /* ok */ } }
      b.fontes.forEach(function (f) { try { f.stop(imediato ? t + 0.06 : 0); } catch (e) { /* já parou */ } });
      var tm = setTimeout(function () { try { b.g.disconnect(); } catch (e) { /* ok */ } b.fontes = []; }, 200);
      timers.push(tm);
    }
    function soltarDepois(b, seg) { var tm = setTimeout(function () { soltar(b, false); }, seg * 1000); timers.push(tm); }
    function osc(b, tipo, f, t0, t1) { var o = ctx.createOscillator(); o.type = tipo; o.frequency.setValueAtTime(f, t0); o.start(t0); o.stop(t1); b.fontes.push(o); return o; }

    function apito(b, t, d, f0) {
      var env = ctx.createGain(), lp = ctx.createBiquadFilter(), mix = ctx.createGain();
      var at = Math.min(0.05, d / 4), rel = Math.min(0.09, d / 3);
      env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(1, t + at);
      env.gain.setValueAtTime(1, t + d - rel); env.gain.exponentialRampToValueAtTime(0.0001, t + d);
      lp.type = 'lowpass'; lp.frequency.value = Math.min(4200, f0 * 7); lp.Q.value = 0.6;
      mix.gain.value = 0.2;
      [['sawtooth', 1, 0.5], ['sawtooth', 1.004, 0.45], ['sine', 0.5, 0.35], ['square', 2, 0.06]].forEach(function (p) {
        var o = osc(b, p[0], f0 * p[1] * 0.97, t, t + d + 0.02), g = ctx.createGain();
        o.frequency.exponentialRampToValueAtTime(f0 * p[1], t + Math.min(0.09, d / 2));
        g.gain.value = p[2]; o.connect(g); g.connect(lp);
      });
      lp.connect(env); env.connect(mix); mix.connect(b.g);
    }
    var P_SINO = [[0.5, 0.25, 2.4], [1, 1, 1.7], [1.19, 0.45, 1.25], [1.5, 0.3, 0.95], [2, 0.4, 0.8], [2.51, 0.2, 0.5], [2.99, 0.15, 0.38]];
    var P_GONGO = [[1, 1, 3.2], [1.48, 0.55, 2.5], [2.09, 0.45, 2], [2.56, 0.3, 1.6], [3.14, 0.28, 1.2], [4.12, 0.16, 0.8]];
    function golpe(b, t, amp, f, parciais, esc, glide) {
      parciais.forEach(function (p) {
        var dec = p[2] * esc, o = osc(b, 'sine', f * p[0] * (glide ? 1.015 : 1), t, t + dec * 1.6 + 0.05), g = ctx.createGain();
        if (glide) o.frequency.exponentialRampToValueAtTime(f * p[0], t + 0.4);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp * p[1] * 0.16, t + 0.004); g.gain.setTargetAtTime(0, t + 0.004, dec / 3);
        o.connect(g); g.connect(b.g);
      });
    }
    function sinoRapido(b, t, d) { for (var s = 0, i = 0; s < d - 0.05; s += 0.17, i++) golpe(b, t + s, i % 2 ? 0.8 : 1, 740, P_SINO, s > d - 0.3 ? 1.6 : 0.7); }
    function gongoRapido(b, t, d) { for (var s = 0, i = 0; s < d - 0.05; s += 0.3, i++) golpe(b, t + s, i % 2 ? 0.75 : 1, 165, P_GONGO, s > d - 0.4 ? 1.2 : 0.55, true); }
    function tiro(b, t) {
      if (!ruido) { var n = ctx.sampleRate * 2; ruido = ctx.createBuffer(1, n, ctx.sampleRate); var dd = ruido.getChannelData(0); for (var i = 0; i < n; i++) dd[i] = Math.random() * 2 - 1; }
      var src = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = ruido; lp.type = 'lowpass'; lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(140, t + 0.9);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1.1, t + 0.006); g.gain.setTargetAtTime(0, t + 0.006, 0.32);
      src.connect(lp); lp.connect(g); g.connect(b.g); src.start(t); src.stop(t + 2); b.fontes.push(src);
      var o = osc(b, 'sine', 70, t, t + 0.9), g2 = ctx.createGain();
      o.frequency.exponentialRampToValueAtTime(34, t + 0.5);
      g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(0.9, t + 0.005); g2.gain.setTargetAtTime(0, t + 0.005, 0.18);
      o.connect(g2); g2.connect(b.g);
    }
    function elemento(b, e, t, f0) {
      var f = e.outra ? f0 * 1.26 : f0;
      if (APITO[e.k]) apito(b, t, e.d, f);
      else if (e.k === 'S') sinoRapido(b, t, e.d);
      else if (e.k === 'G') gongoRapido(b, t, e.d);
      else if (e.k === 'b') golpe(b, t, 1, 740, P_SINO, 1.5);
      else if (e.k === 'X') tiro(b, t);
    }
    return {
      garantir: garantir,
      pronto: function () { return !!ctx; },
      agora: function () { return ctx ? ctx.currentTime : 0; },
      vol: function (v) { vol = v; aplicar(); },
      mudo: function (m) { mudo = m; aplicar(); },
      /* toca uma lista de elementos a partir de t0 (tempo do AudioContext); devolve o "bus" para parar */
      tocar: function (els, t0, f0, fim) {
        var b = novoBus();
        els.forEach(function (e) { elemento(b, e, t0 + e.t, f0); });
        soltarDepois(b, Math.max(0, t0 - ctx.currentTime) + fim + 3.5);
        return b;
      },
      parar: function (b) { if (b && ctx) soltar(b, true); },
      pararTudo: function () { if (ctx) buses.slice().forEach(function (b) { soltar(b, true); }); },
      fechar: function () { timers.forEach(clearTimeout); timers = []; if (ctx) { try { ctx.close(); } catch (e) { /* ok */ } } ctx = null; },
    };
  }

  /* ---------- Linha do tempo (SVG) ---------- */
  function fimSom(els) {
    var f = 0;
    els.forEach(function (e) { var cauda = e.k === 'S' || e.k === 'G' ? 0.9 : e.k === 'b' ? 0.9 : e.k === 'X' ? 1 : 0.25; f = Math.max(f, e.t + e.d + cauda); });
    return f;
  }
  function desenharLinha(svg, sinal, o) {
    o = o || {};
    var els = o.semOutra ? sinal.els.filter(function (e) { return !e.outra; }) : sinal.els;
    if (o.semOutra && els.length && els[0].t > 0) { var t0 = els[0].t; els = els.map(function (e) { return Object.assign({}, e, { t: e.t - t0 }); }); }
    var W = o.W || 600, mini = !!o.mini, H = mini ? 26 : 112;
    var mL = mini ? 1 : 14, mR = mini ? 1 : 16;
    var lin = Math.max(fimSom(els), 1), I = mini ? 0 : (sinal.intervalo || 0);
    var fant = I ? Math.min(lin, 5.5) : 0, brk = I ? Math.min(84, W * 0.2) : 0;
    /* escala: no mínimo 8 s de eixo (6 s com intervalo), para um apito curto não parecer perdido */
    var vao = mini ? lin : Math.max(lin + fant, I ? 6 : 8);
    var k = (W - mL - mR - brk) / vao;
    k = Math.min(k, mini ? 8 : 110);
    var yM = mini ? 13 : 52, hh = mini ? 12 : 26;
    function X(t) { if (!I || t <= lin) return mL + t * k; if (t < I) return mL + lin * k + (t - lin) / (I - lin) * brk; return mL + lin * k + brk + (t - I) * k; }
    var s = '';
    if (!mini) {
      var tFim = I ? I + fant : Math.max(lin, vao), xFim = X(tFim);
      s += '<line class="ss-eixo" x1="' + mL + '" y1="' + (yM + 30) + '" x2="' + xFim.toFixed(1) + '" y2="' + (yM + 30) + '"/>';
      var passo = k < 12 ? 5 : 1, rotPasso = k < 12 ? 10 : k < 30 ? 5 : 1;
      for (var t = 0; t <= (I ? lin : tFim) + 1e-6; t += passo) {
        var xt = X(t), maior = Math.abs(t / rotPasso - Math.round(t / rotPasso)) < 1e-6;
        s += '<line class="ss-tique" x1="' + xt.toFixed(1) + '" y1="' + (yM + 30) + '" x2="' + xt.toFixed(1) + '" y2="' + (yM + (maior ? 37 : 34)) + '"/>';
        if (maior) s += '<text class="ss-tempo" x="' + xt.toFixed(1) + '" y="' + (yM + 50) + '" text-anchor="middle">' + num(t) + ' s</text>';
      }
      if (I) {
        var xb = X(lin), xb2 = X(I);
        s += '<rect class="ss-quebra-fundo" x="' + (xb + 4).toFixed(1) + '" y="' + (yM - 22) + '" width="' + Math.max(0, xb2 - xb - 8).toFixed(1) + '" height="56" rx="4"/>';
        [xb + 10, xb2 - 10].forEach(function (xq) { s += '<line class="ss-quebra" x1="' + (xq - 4).toFixed(1) + '" y1="' + (yM + 36) + '" x2="' + (xq + 4).toFixed(1) + '" y2="' + (yM + 24) + '"/>'; });
        s += '<text class="ss-quebra-txt" x="' + ((xb + xb2) / 2).toFixed(1) + '" y="' + (yM - 4) + '" text-anchor="middle">até</text>';
        s += '<text class="ss-quebra-txt ss-forte" x="' + ((xb + xb2) / 2).toFixed(1) + '" y="' + (yM + 12) + '" text-anchor="middle">' + (I === 120 ? '2 min' : '1 min') + '</text>';
        s += '<text class="ss-tempo ss-forte" x="' + xb2.toFixed(1) + '" y="' + (yM + 50) + '" text-anchor="middle">' + mmss(I) + '</text>';
        s += '<text class="ss-rot-el ss-rot-fant" x="' + (xb2 + 2).toFixed(1) + '" y="' + (yM - hh / 2 - 6) + '">repete</text>';
      }
    }
    function desenharEl(e, i, deslT, fantasma) {
      var x = X(e.t + deslT), w = Math.max(mini ? 1.6 : 2.4, e.d * k);
      if (fantasma && e.t + deslT > I + fant) return '';
      if (fantasma) w = Math.min(w, X(I + fant) - x);
      var cls = 'ss-el' + (e.outra ? ' ss-outra' : '') + (fantasma ? ' ss-fantasma' : '') + (!fantasma && o.ativo === i ? ' ss-ativo' : '') + (!fantasma && o.feitos != null && i < o.feitos ? ' ss-feito' : '');
      var r = '<g class="' + cls + '">';
      if (APITO[e.k]) {
        var hy = e.k === 'p' || e.k === 't' ? hh * 0.7 : hh;
        r += '<rect class="ss-apito" x="' + x.toFixed(1) + '" y="' + (yM - hy / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hy.toFixed(1) + '" rx="' + Math.min(mini ? 2 : 5, w / 2).toFixed(1) + '"/>';
        if (e.k === 'K' && !fantasma) for (var q = 1; q <= 4; q++) r += '<rect class="ss-apito" x="' + (x + w + q * 5).toFixed(1) + '" y="' + (yM - hy / 2).toFixed(1) + '" width="2.4" height="' + hy.toFixed(1) + '" opacity="' + (1 - q * 0.22).toFixed(2) + '"/>';
      } else if (e.k === 'S' || e.k === 'G') {
        r += '<rect class="ss-banda' + (e.k === 'G' ? ' ss-banda-g' : '') + '" x="' + x.toFixed(1) + '" y="' + (yM - hh / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hh + '" rx="' + (mini ? 2 : 4) + '"/>';
        var dt = e.k === 'S' ? 0.17 : 0.3, passoG = Math.max(dt, (mini ? 2.6 : 3.2) / k);
        if (e.k === 'S') { for (var u = 0; u < e.d - 0.05; u += passoG) r += '<line class="ss-golpe" x1="' + (x + u * k + 1).toFixed(1) + '" y1="' + (yM - hh * 0.32).toFixed(1) + '" x2="' + (x + u * k + 1).toFixed(1) + '" y2="' + (yM + hh * 0.32).toFixed(1) + '"/>'; }
        else {
          var pts = [];
          for (var v = 0; v <= w; v += 1.5) pts.push((x + v).toFixed(1) + ',' + (yM + Math.sin(v / (mini ? 2 : 3.2)) * hh * 0.26).toFixed(1));
          r += '<polyline class="ss-onda" points="' + pts.join(' ') + '"/>';
        }
      } else if (e.k === 'b') {
        r += '<line class="ss-badalo" x1="' + (x + 1).toFixed(1) + '" y1="' + (yM - hh * 0.55).toFixed(1) + '" x2="' + (x + 1).toFixed(1) + '" y2="' + (yM + hh * 0.5).toFixed(1) + '"/>';
        r += '<circle class="ss-badalo-c" cx="' + (x + 1).toFixed(1) + '" cy="' + (yM - hh * 0.55).toFixed(1) + '" r="' + (mini ? 2 : 3.6) + '"/>';
      } else if (e.k === 'X') {
        var R = mini ? 6 : 13, pp = [];
        for (var a = 0; a < 16; a++) { var rr = a % 2 ? R * 0.45 : R, ang = a * Math.PI / 8; pp.push((x + 2 + Math.sin(ang) * rr).toFixed(1) + ',' + (yM - Math.cos(ang) * rr).toFixed(1)); }
        r += '<polygon class="ss-tiro" points="' + pp.join(' ') + '"/>';
      }
      if (!mini && !fantasma) {
        var rot = e.rot || ROT_EL[e.k];
        var larg = rot ? rot.length * 6.4 + 4 : 0;
        if (rot && (w >= larg || e.rot || e.k === 'X')) r += '<text class="ss-rot-el" x="' + (x + (e.k === 'X' ? 2 : w / 2)).toFixed(1) + '" y="' + (yM - hh / 2 - (e.k === 'X' ? 6 : 6)).toFixed(1) + '" text-anchor="middle">' + VL.esc(rot) + '</text>';
      }
      return r + '</g>';
    }
    els.forEach(function (e, i) { s += desenharEl(e, i, 0, false); });
    if (I) els.forEach(function (e, i) { s += desenharEl(e, i, I, true); });
    if (!mini && o.cursor != null && !o.semCursor) {
      var xc = X(o.cursor);
      s += '<line class="ss-cursor" x1="' + xc.toFixed(1) + '" y1="' + (yM - 30) + '" x2="' + xc.toFixed(1) + '" y2="' + (yM + 32) + '"/>';
      s += '<path class="ss-cursor-p" d="M' + (xc - 5).toFixed(1) + ' ' + (yM - 36) + ' L' + (xc + 5).toFixed(1) + ' ' + (yM - 36) + ' L' + xc.toFixed(1) + ' ' + (yM - 29) + ' Z"/>';
    }
    var Wv = mini ? Math.ceil(X(lin) + mR) : W;
    svg.setAttribute('viewBox', '0 0 ' + Wv + ' ' + H);
    svg.setAttribute('width', mini ? String(Wv) : '100%');
    svg.setAttribute('height', String(H));
    svg.innerHTML = s;
    return { els: els, lin: lin, I: I };
  }

  function descricaoAcessivel(sinal) {
    var partes = sinal.els.map(function (e) { return (e.outra ? '(' + (e.rot || 'outra embarcação') + ') ' : '') + NOME_EL[e.k]; });
    return 'Padrão: ' + (partes.length ? partes.join('; ') : 'nenhum som') + (sinal.intTxt ? '. Repete ' + sinal.intTxt + '.' : '.');
  }

  /* ---------- Widget ---------- */
  VL.widgets.define('sinais-sonoros', {
    css: ['assets/css/widgets/sinais-sonoros.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var motor = Motor();
      var pref = VL.store.get('sinais-sonoros.pref', {}) || {};
      var est = {
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        grupo: GRUPOS[opts.grupo] ? opts.grupo : (POR_ID[opts.sinal] ? POR_ID[opts.sinal].g : 'manobra'),
        sel: null, acelerar: !!opts.acelerar,
        vol: typeof pref.vol === 'number' ? pref.vol : 0.6, mudo: !!pref.mudo, f0: pref.f0 || 220,
        tipoDes: opts.desafio === 'dar' ? 'dar' : 'ouvir',
        grupos: (Array.isArray(opts.grupos) ? opts.grupos : ['manobra', 'cerracao', 'perigo']).filter(function (g) { return g !== 'equipamento' && GRUPOS[g]; }),
        visivel: true,
      };
      if (!est.grupos.length) est.grupos = ['manobra', 'cerracao', 'perigo'];
      est.sel = POR_ID[opts.sinal] && POR_ID[opts.sinal].g === est.grupo ? opts.sinal : primeiroDo(est.grupo);
      motor.vol(est.vol); motor.mudo(est.mudo);
      var des = { n: 0, acertos: 0, total: 0, item: null, respondido: false };
      function primeiroDo(g) { for (var i = 0; i < CATALOGO.length; i++) if (CATALOGO[i].g === g) return CATALOGO[i].id; return 'm1'; }
      function salvarPref() { VL.store.set('sinais-sonoros.pref', { vol: est.vol, mudo: est.mudo, f0: est.f0 }); }

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Sinais sonoros: ouça, veja o ritmo e reconheça', controlesAntes: true });
      ins.raiz.classList.add('ss-raiz');

      /* Controles gerais */
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      var btnAcel = h('button', { type: 'button', class: 'btn btn-ghost ss-acel', 'aria-pressed': String(est.acelerar), title: 'Os intervalos de 1 ou 2 minutos entre as repetições passam 12 vezes mais rápido. Os apitos continuam com a duração real.',
        onclick: function () { est.acelerar = !est.acelerar; btnAcel.setAttribute('aria-pressed', String(est.acelerar)); btnAcel.textContent = est.acelerar ? 'Tempo acelerado (12×)' : 'Acelerar o tempo'; } }, est.acelerar ? 'Tempo acelerado (12×)' : 'Acelerar o tempo');
      var faixaVol = h('input', { type: 'range', min: '0', max: '100', step: '1', class: 'ss-vol', 'aria-label': 'Volume' });
      faixaVol.value = String(Math.round(est.vol * 100));
      faixaVol.addEventListener('input', function () { est.vol = Number(faixaVol.value) / 100; motor.vol(est.vol); });
      faixaVol.addEventListener('change', salvarPref);
      var inpMudo = h('input', { type: 'checkbox', role: 'switch' }); inpMudo.checked = est.mudo;
      inpMudo.addEventListener('change', function () { est.mudo = inpMudo.checked; motor.mudo(est.mudo); salvarPref(); });
      var selApito = h('select', { class: 'ss-sel', 'aria-label': 'Som do apito: tamanho da embarcação' },
        h('option', { value: '110' }, 'navio de 200 m ou mais (grave)'),
        h('option', { value: '220' }, 'de 75 a 200 m (médio)'),
        h('option', { value: '440' }, 'menos de 75 m (agudo)'));
      selApito.value = String(est.f0);
      selApito.addEventListener('change', function () { est.f0 = Number(selApito.value); salvarPref(); });
      ins.controles.appendChild(h('div', { class: 'ss-linha' },
        segModo, btnAcel,
        h('label', { class: 'ss-campo-vol' }, h('span', { class: 'ss-rot' }, 'Volume'), faixaVol),
        h('label', { class: 'switch ss-switch' }, inpMudo, h('span', null, 'Silenciar')),
        h('label', { class: 'ss-campo-apito' }, h('span', { class: 'ss-rot' }, 'Apito de'), selApito)));

      /* Estrutura do corpo */
      var vExp = h('div', { class: 'ss-explorar' });
      var vDes = h('div', { class: 'ss-desafio' });
      var aviso = h('p', { class: 'ss-aviso', role: 'status', hidden: true });
      ins.corpo.appendChild(h('div', { class: 'ss-corpo' }, aviso, vExp, vDes));
      ins.legenda.appendChild(h('span', { class: 'ss-fonte' }, 'RIPEAM-72, Regras 32 a 37 e Anexos III e IV (Decretos 80.068/1977 e 10.901/2021). Sons sintetizados, só para estudo.'));
      el.appendChild(ins.raiz);

      /* ---------- Reprodução ---------- */
      var play = null; // {sinal, els, lin, I, inicio, tsim, ciclo, bus, alvo, ultimo, semOutra, unico}
      var timer = null;
      var passoIdx = 0;
      function semAudio() {
        aviso.hidden = false;
        aviso.textContent = 'Seu navegador não liberou o som (Web Audio). Você ainda pode estudar pelo desenho: a linha do tempo mostra a duração de cada apito.';
      }
      function iniciarCiclo() {
        var ctx = motor.garantir();
        play.inicio = (ctx ? motor.agora() : performance.now() / 1000) + 0.06;
        play.tsim = 0; play.ciclo++;
        if (ctx) play.bus = motor.tocar(play.els, play.inicio, est.f0, play.lin);
      }
      function agoraS() { return motor.pronto() ? motor.agora() : performance.now() / 1000; }
      function tocar(sinal, alvo, o) {
        parar(true);
        o = o || {};
        var ctx = motor.garantir();
        if (!ctx) semAudio();
        var els = o.semOutra ? sinal.els.filter(function (e) { return !e.outra; }) : sinal.els;
        if (o.semOutra && els.length && els[0].t > 0) { var t0 = els[0].t; els = els.map(function (e) { return Object.assign({}, e, { t: e.t - t0 }); }); }
        play = { sinal: sinal, els: els, lin: fimSom(els), I: o.unico ? 0 : (sinal.intervalo || 0), ciclo: 0, alvo: alvo, semOutra: !!o.semOutra, aoFim: o.aoFim };
        iniciarCiclo();
        play.ultimo = agoraS();
        timer = setInterval(tique, 40);
        anunciar('Tocando: ' + sinal.padrao + '.');
        tique();
      }
      function parar(silencioso) {
        if (timer) { clearInterval(timer); timer = null; }
        if (play) {
          motor.parar(play.bus);
          var alvo = play.alvo, fim = play.aoFim; play = null;
          if (alvo && alvo.aoParar) alvo.aoParar();
          if (fim) fim();
          if (!silencioso) anunciar('Parado.');
        }
      }
      function tique() {
        if (!play) return;
        var agora = agoraS(), dt = agora - play.ultimo; play.ultimo = agora;
        var real = agora - play.inicio;
        if (real < play.lin) play.tsim = Math.max(0, real);
        else play.tsim = Math.max(play.tsim, play.lin) + dt * (est.acelerar ? FATOR : 1);
        if (play.I && play.tsim >= play.I) { motor.parar(null); iniciarCiclo(); }
        else if (!play.I && real >= play.lin) { var a = play.alvo; play.tsim = play.lin; if (a && a.aoTique && est.visivel) a.aoTique(play); parar(true); return; }
        if (play.alvo && play.alvo.aoTique && est.visivel) play.alvo.aoTique(play);
      }
      function ativoEm(els, t) { for (var i = 0; i < els.length; i++) { var e = els[i]; if (t >= e.t && t < e.t + Math.max(e.d, 0.3)) return i; } return -1; }
      function feitosEm(els, t) { var n = 0; els.forEach(function (e) { if (t >= e.t + Math.max(e.d, 0.3)) n++; }); return n; }
      var vivo = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
      ins.corpo.appendChild(vivo);
      function anunciar(t) { vivo.textContent = t; }

      /* ---------- Player do modo explorar ---------- */
      var abas = h('div', { class: 'segmented ss-abas', role: 'tablist', 'aria-label': 'Grupos de sinais' });
      ORDEM_GRUPOS.forEach(function (g) {
        abas.appendChild(h('button', { type: 'button', role: 'tab', 'data-g': g, onclick: function () { if (est.grupo === g) return; parar(true); est.grupo = g; est.sel = primeiroDo(g); passoIdx = 0; montarExplorar(); } },
          GRUPOS[g].rotulo, h('span', { class: 'ss-aba-sep', 'aria-hidden': 'true' }, ' · '), h('span', { class: 'ss-aba-regra' }, GRUPOS[g].regra)));
      });
      var pTitulo = h('h3', { class: 'ss-titulo' });
      var pRegra = h('p', { class: 'ss-regra' });
      var pQuem = h('p', { class: 'ss-quem' });
      var svgLinha = h('svg', { class: 'ss-linha-svg', role: 'img', xmlns: 'http://www.w3.org/2000/svg' });
      var lampada = h('div', { class: 'ss-lampada', 'aria-hidden': 'true' }, h('span', { class: 'ss-lamp' }), h('small', null, 'luz de manobra'));
      var relogio = h('p', { class: 'ss-relogio', 'aria-hidden': 'true' });
      var btnTocar = h('button', { type: 'button', class: 'btn btn-primary ss-tocar', onclick: function () {
        if (play && play.alvo === player) { parar(); return; }
        passoIdx = 0; btnPasso.textContent = 'Passo a passo'; tocar(POR_ID[est.sel], player);
        atualizarBotao();
      } }, 'Ouvir');
      var btnPasso = h('button', { type: 'button', class: 'btn btn-ghost', onclick: passoAPasso }, 'Passo a passo');
      var pPadrao = h('p', { class: 'ss-padrao' });
      var pNota = h('div', { class: 'ss-notas' });
      var playerEl = h('section', { class: 'ss-player', 'aria-label': 'Sinal selecionado' },
        h('div', { class: 'ss-player-cab' }, h('div', null, pTitulo, pRegra), lampada),
        pQuem,
        h('div', { class: 'ss-linha-caixa' }, svgLinha),
        h('div', { class: 'ss-acoes' }, btnTocar, btnPasso, relogio),
        pPadrao, pNota);
      var cartoes = h('div', { class: 'ss-cartoes', role: 'list' });
      var notaGrupo = h('div', { class: 'ss-nota-grupo' });
      vExp.appendChild(abas); vExp.appendChild(playerEl); vExp.appendChild(cartoes); vExp.appendChild(notaGrupo);

      var larg = { exp: 600, des: 600 };
      var player = {
        aoTique: function (p) { desenharPlayer(p); },
        aoParar: function () { desenharPlayer(null); atualizarBotao(); },
      };
      function atualizarBotao() {
        var tocando = play && play.alvo === player;
        btnTocar.textContent = tocando ? 'Parar' : 'Ouvir';
        btnTocar.setAttribute('aria-pressed', String(!!tocando));
      }
      function desenharPlayer(p, passoAtivo) {
        var s = POR_ID[est.sel];
        var rm = reduzMov();
        var o = { W: larg.exp };
        if (p) {
          o.ativo = ativoEm(p.els, p.tsim); o.feitos = feitosEm(p.els, p.tsim);
          o.cursor = p.tsim; o.semCursor = rm;
          var total = (p.ciclo - 1) * (p.I || 0) + p.tsim;
          var txt = 'Tempo ' + mmss(total);
          if (p.I && p.tsim >= p.lin) txt += ' · próximo sinal em ' + mmss(Math.ceil(p.I - p.tsim)) + (est.acelerar ? ' (acelerado)' : '');
          if (p.I && p.ciclo > 1) txt += ' · repetição ' + p.ciclo;
          relogio.textContent = txt;
          var ae = o.ativo >= 0 ? p.els[o.ativo] : null;
          lampada.classList.toggle('ss-acesa', !!(s.luz && ae && APITO[ae.k]));
        } else if (passoAtivo != null) {
          o.ativo = passoAtivo;
          relogio.textContent = 'Elemento ' + (passoAtivo + 1) + ' de ' + s.els.length + ': ' + NOME_EL[s.els[passoAtivo].k];
          lampada.classList.toggle('ss-acesa', !!(s.luz && APITO[s.els[passoAtivo].k]));
        } else {
          relogio.textContent = s.intervalo ? 'Repete ' + s.intTxt + '. Toque em Ouvir; o sinal se repete até você parar.' : '';
          lampada.classList.remove('ss-acesa');
        }
        desenharLinha(svgLinha, s, o);
      }
      var passoBus = null, passoTm = null;
      function passoAPasso() {
        var s = POR_ID[est.sel];
        parar(true); atualizarBotao();
        if (!s.els.length) return;
        if (passoIdx >= s.els.length) passoIdx = 0;
        var i = passoIdx, e = s.els[i];
        var ctx = motor.garantir();
        if (!ctx) semAudio();
        else {
          if (passoBus) motor.parar(passoBus);
          var e0 = Object.assign({}, e, { t: 0 });
          passoBus = motor.tocar([e0], motor.agora() + 0.04, est.f0, e.d + 1);
        }
        desenharPlayer(null, i);
        if (passoTm) clearTimeout(passoTm);
        passoTm = setTimeout(function () { lampada.classList.remove('ss-acesa'); }, e.d * 1000 + 60);
        anunciar('Elemento ' + (i + 1) + ' de ' + s.els.length + ': ' + NOME_EL[e.k] + '.');
        passoIdx = i + 1;
        btnPasso.textContent = passoIdx >= s.els.length ? 'Recomeçar o passo a passo' : 'Próximo elemento (' + (passoIdx + 1) + ' de ' + s.els.length + ')';
      }
      function selecionar(id, tocarJa) {
        parar(true);
        est.sel = id; passoIdx = 0;
        preencherPlayer();
        VL.$$('.ss-cartao', cartoes).forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-id') === id)); });
        if (tocarJa) { tocar(POR_ID[id], player); atualizarBotao(); }
        if (tocarJa && playerEl.getBoundingClientRect().top < 0) playerEl.scrollIntoView({ block: 'nearest', behavior: reduzMov() ? 'auto' : 'smooth' });
      }
      function preencherPlayer() {
        var s = POR_ID[est.sel];
        pTitulo.innerHTML = '';
        pTitulo.appendChild(document.createTextNode(s.g === 'cerracao' || s.g === 'perigo' || s.g === 'equipamento' ? s.resp : '"' + s.resp + '"'));
        var e = en(s.en); if (e) pTitulo.appendChild(e);
        pRegra.innerHTML = '';
        pRegra.appendChild(h('span', { class: 'chip' }, 'RIPEAM, ' + s.regra));
        pQuem.textContent = s.quem || '';
        pPadrao.innerHTML = '';
        pPadrao.appendChild(h('strong', null, 'Padrão: '));
        pPadrao.appendChild(document.createTextNode(s.padrao + (s.intTxt ? ', ' + s.intTxt : '') + '.'));
        pNota.innerHTML = '';
        if (s.nota) pNota.appendChild(h('p', { class: 'ss-nota' }, s.nota));
        if (s.luz) pNota.appendChild(h('p', { class: 'ss-nota' }, 'Qualquer embarcação pode repetir estes sinais com uma luz branca circular: cada lampejo com cerca de 1 s, 1 s entre lampejos e pelo menos 10 s entre um sinal e outro (Regra 34(b)).'));
        lampada.hidden = !s.luz;
        svgLinha.setAttribute('aria-label', 'Linha do tempo. ' + descricaoAcessivel(s));
        btnPasso.textContent = 'Passo a passo';
        atualizarBotao();
        desenharPlayer(null);
      }
      function montarExplorar() {
        VL.$$('button', abas).forEach(function (b) { var on = b.getAttribute('data-g') === est.grupo; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-selected', String(on)); });
        cartoes.innerHTML = '';
        CATALOGO.filter(function (s) { return s.g === est.grupo; }).forEach(function (s) {
          var mini = h('svg', { class: 'ss-mini', 'aria-hidden': 'true', xmlns: 'http://www.w3.org/2000/svg' });
          desenharLinha(mini, s, { mini: true });
          var c = h('button', { type: 'button', class: 'ss-cartao', role: 'listitem', 'data-id': s.id, 'aria-pressed': String(s.id === est.sel),
            'aria-label': (s.g === 'manobra' ? '"' + s.resp + '"' : s.resp) + '. ' + s.padrao + (s.intTxt ? ', ' + s.intTxt : '') + '. ' + s.regra + '. Toque para ouvir.',
            onclick: function () { selecionar(s.id, true); } },
            h('span', { class: 'ss-cartao-mini' }, mini),
            h('span', { class: 'ss-cartao-pad' }, s.padrao),
            h('span', { class: 'ss-cartao-sig' }, s.g === 'manobra' ? '"' + s.resp + '"' : s.resp),
            h('span', { class: 'ss-cartao-reg' }, s.regra.replace('Regra 37 e ', '') + (s.intTxt ? ' · ' + s.intTxt : '')));
          cartoes.appendChild(c);
        });
        montarNotaGrupo();
        preencherPlayer();
      }
      function montarNotaGrupo() {
        notaGrupo.innerHTML = '';
        var g = est.grupo;
        if (g === 'manobra') {
          notaGrupo.appendChild(h('h4', null, 'Quando usar'));
          notaGrupo.appendChild(h('ul', { class: 'ss-lista' },
            h('li', null, 'Só com as embarcações à vista uma da outra. Na cerração valem os sinais da Regra 35.'),
            h('li', null, 'Um, dois e três curtos são de embarcação de propulsão mecânica (Regra 34(a)). Navegando só a vela, o veleiro não dá esses sinais.'),
            h('li', null, 'Os sinais de ultrapassagem valem em canal estreito ou via de acesso, quando a ultrapassada precisa manobrar para abrir espaço (Regra 9(e)).'),
            h('li', null, 'Cinco curtos e a curva com um longo servem para qualquer embarcação (Regra 34(d) e (e)).')));
        } else if (g === 'cerracao') {
          notaGrupo.appendChild(h('h4', null, 'Lembretes da Regra 35'));
          notaGrupo.appendChild(h('ul', { class: 'ss-lista' },
            h('li', null, 'Valem de dia ou de noite, sempre que a visibilidade estiver restrita: cerração, nevoeiro, chuva forte, fumaça.'),
            h('li', null, 'Empurrador e empurrada unidos de forma rígida contam como uma só embarcação de propulsão mecânica (Regra 35(f)).'),
            h('li', null, 'De 12 a 20 m, a embarcação não é obrigada a dar os sinais de sino, mas então deve dar outro sinal sonoro eficiente a cada 2 minutos, no máximo (Regra 35(i)). Com menos de 12 m, vale o mesmo para todos os sinais desta regra (Regra 35(j)).'),
            h('li', null, 'Ouvir o sinal não diz a direção nem a distância com segurança: o som engana na cerração. Reduza a velocidade (Regra 19).')));
        } else if (g === 'perigo') {
          notaGrupo.appendChild(h('h4', null, 'Outros sinais de perigo (Anexo IV), além dos sonoros'));
          notaGrupo.appendChild(h('ul', { class: 'ss-lista ss-lista-2' },
            h('li', null, 'Foguetes ou granadas com estrelas vermelhas, lançados um de cada vez, a intervalos curtos.'),
            h('li', null, 'A palavra "Mayday" falada no rádio.'),
            h('li', null, 'O sinal NC do Código Internacional de Sinais.'),
            h('li', null, 'Bandeira quadrada com uma bola, ou algo parecido, acima ou abaixo dela.'),
            h('li', null, 'Chamas a bordo, como de um barril de óleo queimando.'),
            h('li', null, 'Foguete com paraquedas ou facho de mão de luz vermelha.'),
            h('li', null, 'Fumaça de cor laranja.'),
            h('li', null, 'Levantar e baixar devagar, várias vezes, os braços estendidos para os lados.'),
            h('li', null, 'Alerta de socorro por chamada seletiva digital (DSC), por satélite (Inmarsat ou outro serviço móvel por satélite), radiobaliza (EPIRB) ou transponder de radar (SART).')));
          notaGrupo.appendChild(h('p', { class: 'ss-nota' }, 'É proibido usar qualquer desses sinais, ou outro que se confunda com eles, a não ser para pedir socorro (Anexo IV, 2). Para só chamar a atenção, use luz ou som que não se confunda com nenhum sinal do RIPEAM, ou um holofote apontado para o perigo, sem ofuscar ninguém (Regra 36).'));
        } else {
          notaGrupo.appendChild(h('h4', null, 'O que cada embarcação deve ter (Regra 33)'));
          var tb = h('table', { class: 'tabela ss-tabela' },
            h('thead', null, h('tr', null, h('th', null, 'Comprimento'), h('th', null, 'Equipamento'), h('th', null, 'Apito: frequência fundamental e alcance audível'))),
            h('tbody', null,
              h('tr', null, h('td', null, 'menos de 12 m'), h('td', null, 'não é obrigada a ter apito nem sino, mas precisa de outro meio de fazer sinal sonoro eficiente (Regra 33(b))'), h('td', null, '—')),
              h('tr', null, h('td', null, '12 a 20 m'), h('td', null, 'apito'), h('td', null, '250 a 700 Hz; 0,5 milha')),
              h('tr', null, h('td', null, '20 a 75 m'), h('td', null, 'apito e sino'), h('td', null, '250 a 700 Hz; 1 milha')),
              h('tr', null, h('td', null, '75 a 100 m'), h('td', null, 'apito e sino'), h('td', null, '130 a 350 Hz; 1,5 milha')),
              h('tr', null, h('td', null, '100 a 200 m'), h('td', null, 'apito, sino e gongo (tom diferente do sino)'), h('td', null, '130 a 350 Hz; 1,5 milha')),
              h('tr', null, h('td', null, '200 m ou mais'), h('td', null, 'apito, sino e gongo'), h('td', null, '70 a 200 Hz; 2 milhas'))));
          notaGrupo.appendChild(h('div', { class: 'table-wrap' }, tb));
          notaGrupo.appendChild(h('p', { class: 'ss-nota' }, 'Frequências: Anexo III, Seção 1(b). Alcance audível: Anexo III, Seção 1(c), com ar calmo e ruído de fundo normal; é só uma referência. O sino ou o gongo podem ser trocados por equipamento com o mesmo som, desde que o acionamento manual continue possível (Regra 33(a)). Use o seletor "Apito de" acima para ouvir a diferença.'));
        }
      }

      /* ---------- Desafio ---------- */
      var segDes = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Tipo de desafio' });
      [['ouvir', 'Ouvir e identificar'], ['dar', 'Que sinal dar?']].forEach(function (m) {
        segDes.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { if (est.tipoDes === m[0]) return; est.tipoDes = m[0]; des.n = 0; des.acertos = 0; des.total = 0; novoDesafio(); } }, m[1]));
      });
      var placar = h('p', { class: 'ss-placar' });
      var desCorpo = h('div', { class: 'ss-des-corpo' });
      vDes.appendChild(h('div', { class: 'ss-des-topo' }, segDes, placar));
      vDes.appendChild(desCorpo);
      var desLinha = null;
      var desAlvo = {
        aoTique: function (p) { if (desLinha && des.respondido) desenharLinha(desLinha, des.item.s, { W: larg.des, semOutra: true, ativo: ativoEm(p.els, p.tsim), feitos: feitosEm(p.els, p.tsim), cursor: p.tsim, semCursor: reduzMov() }); atualizarOuvir(); },
        aoParar: function () { if (desLinha && des.respondido) desenharLinha(desLinha, des.item.s, { W: larg.des, semOutra: true }); atualizarOuvir(); },
      };
      var btnOuvir = null;
      function atualizarOuvir() {
        if (!btnOuvir) return;
        var t = play && play.alvo === desAlvo;
        btnOuvir.textContent = t ? 'Parar' : (des.ouviu ? 'Ouvir de novo' : 'Ouvir o sinal');
      }
      function placarTxt() { return 'Questão ' + des.n + ' · acertos: ' + des.acertos + ' de ' + des.total; }
      function sortearDesafio() {
        var ant = des.item && des.item.chave;
        for (var tent = 0; tent < 30; tent++) {
          var it;
          if (est.tipoDes === 'ouvir') {
            var pool = CATALOGO.filter(function (s) { return est.grupos.indexOf(s.g) >= 0; });
            var s = sortear(pool);
            var dist = CATALOGO.filter(function (x) { return x.g === s.g && x.id !== s.id; });
            if (dist.length < 3) dist = dist.concat(CATALOGO.filter(function (x) { return x.g === 'cerracao' && x.resp !== s.resp; }));
            dist = VL.embaralhar(dist).slice(0, 3);
            it = { chave: s.id, s: s, ctx: GRUPOS[s.g].ctx, opcoes: VL.embaralhar(dist.concat([s])) };
          } else {
            var poolD = DAR.filter(function (d) { var r = d.r === 'nenhum' ? 'manobra' : POR_ID[d.r].g; return est.grupos.indexOf(r) >= 0; });
            if (!poolD.length) poolD = DAR;
            var d = sortear(poolD), certo = d.r === 'nenhum' ? NENHUM : POR_ID[d.r];
            var ds;
            if (d.dist) ds = d.dist.map(function (id) { return POR_ID[id]; });
            else {
              var g = POR_ID[d.r].g;
              ds = CATALOGO.filter(function (x) { return x.g === g && x.id !== d.r && x.padrao !== certo.padrao; });
              ds = VL.embaralhar(ds).slice(0, 3);
            }
            it = { chave: d.p, d: d, s: certo, opcoes: VL.embaralhar(ds.concat([certo])) };
          }
          if (it.chave !== ant) return it;
        }
        return it;
      }
      function novoDesafio() {
        parar(true);
        des.item = sortearDesafio(); des.n++; des.respondido = false; des.ouviu = false;
        VL.$$('button', segDes).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.tipoDes)); });
        placar.textContent = placarTxt();
        desCorpo.innerHTML = ''; desLinha = null; btnOuvir = null;
        var it = des.item;
        if (est.tipoDes === 'ouvir') {
          desCorpo.appendChild(h('p', { class: 'ss-des-ctx' }, it.ctx));
          btnOuvir = h('button', { type: 'button', class: 'btn btn-primary ss-ouvir', onclick: function () {
            if (play && play.alvo === desAlvo) { parar(); return; }
            des.ouviu = true; tocar(it.s, desAlvo, { semOutra: true, unico: true }); atualizarOuvir();
          } }, 'Ouvir o sinal');
          var dica = h('button', { type: 'button', class: 'btn btn-quiet ss-dica-btn', onclick: function () {
            dica.remove();
            var sv = h('svg', { class: 'ss-linha-svg', role: 'img', 'aria-label': 'Dica: ' + descricaoAcessivel(it.s), xmlns: 'http://www.w3.org/2000/svg' });
            desenharLinha(sv, it.s, { W: larg.des, semOutra: true });
            caixaDica.appendChild(h('div', { class: 'ss-linha-caixa' }, sv));
            caixaDica.appendChild(h('p', { class: 'ss-miudo' }, 'Dica: o desenho mostra o ritmo, sem dizer o nome.'));
          } }, 'Sem som? Ver o ritmo');
          var caixaDica = h('div', { class: 'ss-dica' });
          desCorpo.appendChild(h('div', { class: 'btn-row' }, btnOuvir, dica));
          desCorpo.appendChild(caixaDica);
          var grade = h('div', { class: 'ss-opcs', role: 'group', 'aria-label': 'Alternativas' });
          it.opcoes.forEach(function (s) {
            grade.appendChild(h('button', { type: 'button', class: 'ss-opc', 'data-id': s.id, onclick: function () { responder(s, grade); } }, s.g === 'manobra' ? '"' + s.resp + '"' : s.resp));
          });
          desCorpo.appendChild(grade);
        } else {
          desCorpo.appendChild(h('p', { class: 'ss-des-ctx' }, it.d.p));
          desCorpo.appendChild(h('p', { class: 'ss-miudo' }, 'Que sinal você dá? Toque em "ouvir" para escutar cada alternativa antes de responder.'));
          var lista = h('div', { class: 'ss-opcs ss-opcs-dar', role: 'group', 'aria-label': 'Alternativas' });
          it.opcoes.forEach(function (s) {
            var mini = h('svg', { class: 'ss-mini', 'aria-hidden': 'true', xmlns: 'http://www.w3.org/2000/svg' });
            if (s.els.length) desenharLinha(mini, s, { mini: true, semOutra: true });
            var bo = h('button', { type: 'button', class: 'ss-opc ss-opc-dar', 'data-id': s.id, onclick: function () { responder(s, lista); } },
              s.els.length ? h('span', { class: 'ss-cartao-mini' }, mini) : null,
              h('span', null, s.id === 'nenhum' ? 'Nenhum sinal de manobra' : s.padrao + (s.intTxt ? ', ' + s.intTxt : '')));
            var bt = s.els.length ? h('button', { type: 'button', class: 'btn btn-ghost btn-sm ss-ouvir-opc', 'aria-label': 'Ouvir: ' + s.padrao, onclick: function () { tocar(s, desAlvo, { semOutra: true, unico: true }); } }, 'ouvir') : h('span', { class: 'ss-ouvir-vazio' });
            lista.appendChild(h('div', { class: 'ss-opc-linha' }, bt, bo));
          });
          desCorpo.appendChild(lista);
        }
      }
      function responder(s, grade) {
        if (des.respondido) return;
        var it = des.item, ok = s.id === it.s.id || (est.tipoDes === 'dar' && s.padrao === it.s.padrao);
        des.respondido = true; des.total++; if (ok) des.acertos++;
        placar.textContent = placarTxt();
        VL.$$('.ss-opc', grade).forEach(function (b) {
          b.disabled = true;
          var id = b.getAttribute('data-id');
          if (id === it.s.id) b.setAttribute('data-res', 'certa');
          else if (id === s.id) b.setAttribute('data-res', 'errada');
        });
        var c = it.s;
        var fb = h('div', { class: 'ss-fb' });
        fb.appendChild(h('p', { class: 'ss-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não é esse.'));
        if (c.id === 'nenhum') fb.appendChild(h('p', null, it.d.exp));
        else {
          var linha1 = h('p', null, h('strong', null, (c.g === 'manobra' ? '"' + c.resp + '"' : c.resp)), en(c.en), ': ' + c.padrao + (c.intTxt ? ', ' + c.intTxt : '') + '. ', h('span', { class: 'chip' }, 'RIPEAM, ' + c.regra));
          fb.appendChild(linha1);
          if (c.quem) fb.appendChild(h('p', null, c.quem));
          if (!ok && s.id !== 'nenhum' && s.els && s.els.length) fb.appendChild(h('p', { class: 'ss-miudo' }, 'A que você escolheu (' + s.padrao + (s.intTxt ? ', ' + s.intTxt : '') + ') quer dizer: ' + (s.g === 'manobra' ? '"' + s.resp + '"' : s.resp.charAt(0).toLowerCase() + s.resp.slice(1)) + ' (' + s.regra + ').'));
          desLinha = h('svg', { class: 'ss-linha-svg', role: 'img', 'aria-label': 'Linha do tempo. ' + descricaoAcessivel(c), xmlns: 'http://www.w3.org/2000/svg' });
          desenharLinha(desLinha, c, { W: larg.des, semOutra: true });
          fb.appendChild(h('div', { class: 'ss-linha-caixa' }, desLinha));
        }
        var acoes = h('div', { class: 'btn-row' });
        if (c.els.length && est.tipoDes === 'dar') acoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { tocar(c, desAlvo, { semOutra: true, unico: true }); } }, 'Ouvir a resposta'));
        var prox = h('button', { type: 'button', class: 'btn btn-primary', onclick: novoDesafio }, 'Próxima');
        acoes.appendChild(prox);
        fb.appendChild(acoes);
        desCorpo.appendChild(fb);
        prox.focus({ preventScroll: true });
        if (fb.getBoundingClientRect().bottom > window.innerHeight) fb.scrollIntoView({ block: 'nearest', behavior: reduzMov() ? 'auto' : 'smooth' });
      }

      /* ---------- Modo ---------- */
      function trocarModo(m) {
        parar(true);
        est.modo = m;
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        vExp.hidden = m !== 'explorar'; vDes.hidden = m !== 'desafio';
        ins.raiz.setAttribute('data-modo', m);
        if (m === 'explorar') montarExplorar();
        else { des.n = 0; des.acertos = 0; des.total = 0; novoDesafio(); }
      }

      /* ---------- Tamanho, visibilidade e limpeza ---------- */
      var ro = new ResizeObserver(function () {
        var w1 = Math.round(svgLinha.parentNode.clientWidth || 0), w2 = Math.round(desCorpo.clientWidth || 0);
        var mudou = false;
        if (w1 > 100 && w1 !== larg.exp) { larg.exp = w1; mudou = true; }
        if (w2 > 100 && w2 !== larg.des) { larg.des = w2; mudou = true; }
        if (!mudou) return;
        if (est.modo === 'explorar') desenharPlayer(play && play.alvo === player ? play : null);
        else if (desLinha && des.respondido) desenharLinha(desLinha, des.item.s, { W: larg.des, semOutra: true });
      });
      ro.observe(ins.corpo);
      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (ents) {
          var vis = ents[ents.length - 1].isIntersecting;
          est.visivel = vis;
          if (!vis && play) parar(true);
        }, { threshold: 0 });
        io.observe(ins.raiz);
      }
      var mqRed = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      function aoMudarMov() { if (est.modo === 'explorar') desenharPlayer(play && play.alvo === player ? play : null); }
      if (mqRed && mqRed.addEventListener) mqRed.addEventListener('change', aoMudarMov);

      vExp.hidden = est.modo !== 'explorar'; vDes.hidden = est.modo !== 'desafio';
      VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.modo)); });
      ins.raiz.setAttribute('data-modo', est.modo);
      larg.exp = Math.max(280, Math.round(ins.corpo.clientWidth - 40) || 600);
      larg.des = larg.exp;
      if (est.modo === 'explorar') montarExplorar(); else novoDesafio();

      return function limpar() {
        parar(true);
        if (passoTm) clearTimeout(passoTm);
        ro.disconnect(); if (io) io.disconnect();
        if (mqRed && mqRed.removeEventListener) mqRed.removeEventListener('change', aoMudarMov);
        motor.fechar();
      };
    },
  });

  // Exposto para testes (node) e reutilização.
  VL.sinaisSonoros = { CATALOGO: CATALOGO, POR_ID: POR_ID, DAR: DAR, montarSeq: montarSeq, fimSom: fimSom };
})();
