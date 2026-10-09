/* manobras — animações passo a passo, vistas de cima (ou de perfil, no rizo), das manobras básicas de um veleiro de cruzeiro
   (o desenho usa um barco de ~32 pés como exemplo; vale para qualquer tamanho): cambar por davante, jaibe (controlado e acidental), capear, rizar a grande (1º e 2º rizos),
   homem ao mar (parada rápida e manobra do oito) e fundear (com calculadora de filame).
   Convenção do desenho: o vento VERDADEIRO sopra sempre do alto da figura para baixo; rumo 0° = proa ao vento,
   rumo positivo = proa virada para a direita da tela (vento entrando por bombordo, "amura de bombordo"),
   rumo negativo = vento entrando por boreste. Cada etapa tem: comando de voz, tarefa de cada tripulante e explicação.
   Reduced-motion: sem animação contínua; os botões "Anterior"/"Próxima" pulam direto de etapa em etapa.
   Orientação de seamanship fundamentada nas fontes de research/mob.md. O quadro `recomenda` ("O que este curso recomenda") diz qual método e qual lado usar num veleiro de cruzeiro e por quê, sem esconder as variantes; treine a manobra com seu instrutor e sua tripulação.
   Homem ao mar: cada variante tem um `trajeto` integrado por trechos (rumo final, distância, velocidade final, deriva), de onde saem a posição,
   a proa (sempre tangente ao caminho), o tempo e a deriva da pessoa; `vb` e `s` podem ser da variante; `lifesling`, `regua`, `escala` e
   `diagLados` ligam o cabo do Lifesling, a régua de comprimentos, a barra de escala e o esquema dos dois lados de recolhimento.

   opts de mount (todos opcionais):
     manobra:   'cambar' | 'jaibe' | 'capear' | 'rizar' | 'mob' | 'fundear'               padrão 'cambar'
     variante:  jaibe: 'controlado' | 'acidental';  rizar: '1' | '2';  mob: 'parada-rapida' | 'oito'
                (as demais manobras só têm uma)                                             padrão a primeira
     etapa:     etapa inicial, 0 (ponto de partida) até o número de etapas                  padrão 0
     modo:      'explorar' | 'desafio'  (desafio = ordenar as etapas + perguntas explicadas) padrão 'explorar'
     seletor:   true | false  (mostra os botões para trocar de manobra e de variante)       padrão true
     tocar:     true para começar tocando (ignorado com prefers-reduced-motion)             padrão false
     titulo:    legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'manobras', opts:{manobra:'cambar'}}
     {t:'widget', w:'manobras', opts:{manobra:'jaibe', variante:'acidental', seletor:false}}
     {t:'widget', w:'manobras', opts:{manobra:'mob', variante:'oito', modo:'desafio'}} */
(function () {
  'use strict';
  var h = VL.h, NS = 'http://www.w3.org/2000/svg', D2R = Math.PI / 180;

  function S(tag, a) {
    var e = document.createElementNS(NS, tag);
    if (a) for (var k in a) if (a[k] != null) e.setAttribute(k, a[k]);
    for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return e;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, f) { return a + (b - a) * f; }
  function n180(a) { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function en(t) { return h('span', { 'data-intl': 'on', class: 'man-en' }, ' (' + t + ')'); }
  function vazio(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  /* ------------------------------------------------------------------ interpolação de quadros-chave */
  var ALFA = ['pv', 'bv', 'mk', 'sl', 'sr', 'av', 'ca', 'ck', 'pg', 'fl', 'dn', 'pl', 'hk', 'v', 'ab', 'rg', 'lc'];
  function normalizar(kfs) {
    var out = kfs.map(function (k) { return Object.assign({}, k); });
    var chaves = {};
    out.forEach(function (k) { for (var c in k) chaves[c] = 1; });
    Object.keys(chaves).forEach(function (c) {
      var i, prim = -1;
      for (i = 0; i < out.length; i++) if (out[i][c] != null) { prim = i; break; }
      if (out[0][c] == null) out[0][c] = ALFA.indexOf(c) >= 0 ? 0 : out[prim][c];
      for (i = 1; i < out.length; i++) if (out[i][c] == null) out[i][c] = out[i - 1][c];
    });
    return out;
  }
  function cr(p0, p1, p2, p3, t) {
    var t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  }
  function posEm(kfs, p) {
    var N = kfs.length - 1, i = Math.min(Math.floor(p + 1e-9), N - 1), f = p - i;
    if (i < 0) { i = 0; f = 0; }
    var a = kfs[Math.max(i - 1, 0)], b = kfs[i], c = kfs[i + 1], d = kfs[Math.min(i + 2, N)];
    return { x: cr(a.x, b.x, c.x, d.x, f), y: cr(a.y, b.y, c.y, d.y, f) };
  }
  /* trajeto integrado (homem ao mar): cada etapa é um trecho com rumo final, distância, velocidade final e deriva a sotavento.
     A partir disso saem a posição, a proa (sempre tangente ao caminho, a menos da deriva) e o tempo de cada quadro-chave, e com o
     tempo a deriva da pessoa. Unidade de desenho = 9,75 m (barco de exemplo, de 32 pés) / (124 × escala do barco). */
  var LOA_M = 9.75, MS_POR_NO = 0.5144;
  function compilarTrajeto(tj, s) {
    var un = LOA_M / (124 * s), kn = MS_POR_NO / un, n = 24;
    var x = tj.ini.x, y = tj.ini.y, h0 = tj.ini.h, v0 = tj.ini.v, t = 0;
    var ks = [{ x: x, y: y, h: h0, v: v0, t: 0 }], rota = [{ x: x, y: y, h: h0 }];
    tj.segs.forEach(function (sg) {
      var dt = sg.d / (kn * (v0 + sg.v) / 2), k, hm;
      for (k = 0; k < n; k++) {
        hm = (h0 + (sg.h - h0) * (k + 0.5) / n) * D2R;
        x += sg.d / n * Math.sin(hm); y += -sg.d / n * Math.cos(hm) + (sg.lee || 0) / n;
        rota.push({ x: x, y: y, h: h0 + (sg.h - h0) * (k + 1) / n });
      }
      t += dt; h0 = sg.h; v0 = sg.v;
      ks.push({ x: x, y: y, h: h0, v: v0, t: t });
    });
    return { ks: ks, rota: rota, n: n, kn: kn };
  }
  function posRota(tj, p) {
    var q = clamp(p, 0, tj.ks.length - 1) * tj.n, i = Math.min(Math.floor(q + 1e-9), tj.rota.length - 2), f = q - i;
    var a = tj.rota[i], b = tj.rota[i + 1];
    return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), h: lerp(a.h, b.h, f) };
  }
  function estadoEm(kfs, passos, p, tj) {
    var N = kfs.length - 1;
    p = clamp(p, 0, N);
    var i = Math.min(Math.floor(p + 1e-9), N - 1), f = p - i;
    var a = kfs[i], b = kfs[i + 1], snap = (passos[i] && passos[i].snap) || [];
    var e = {};
    for (var c in a) {
      if (typeof a[c] !== 'number') { e[c] = a[c]; continue; }
      var ff = snap.indexOf(c) >= 0 ? smooth((f - ((passos[i] && passos[i].sn != null ? passos[i].sn : 0.66) - 0.11)) / 0.22) : f;
      e[c] = c === 'h' ? a.h + n180(b.h - a.h) * ff : lerp(a[c], b[c], ff);
    }
    if (a.x != null) {
      var ps = tj ? posRota(tj, p) : posEm(kfs, p);
      e.x = ps.x; e.y = ps.y;
      if (tj) e.h = ps.h;
    }
    e.i = i; e.f = f;
    return e;
  }

  function pontoDeVela(hd) {
    var t = Math.abs(n180(hd));
    if (t < 35) return 'zona morta (no vento)';
    if (t < 55) return 'bolina cerrada';
    if (t < 80) return 'bolina folgada';
    if (t < 100) return 'través';
    if (t < 160) return 'largo';
    return 'popa rasa';
  }
  function leitura(e, semPonto) {
    var hd = n180(e.h), t = Math.abs(hd), s;
    if (t < 4) s = 'Proa ao vento';
    else s = 'Proa a ' + Math.round(t) + '° do vento';
    if (t >= 4 && t <= 176) s += ' · amura de ' + (hd < 0 ? 'boreste' : 'bombordo');
    if (!semPonto) s += ' · ' + pontoDeVela(hd);
    if (e.v != null && e.v >= 0) s += ' · cerca de ' + VL.fmt.num(Math.abs(e.v), 1) + ' nós';
    return s;
  }

  /* ------------------------------------------------------------------ dados das manobras */
  function K(x, y, hd, b, g, extra) { return Object.assign({ x: x, y: y, h: hd, b: b, g: g }, extra || {}); }
  /* quadro-chave sem posição: a posição, a proa e a velocidade vêm do trajeto integrado (homem ao mar) */
  function Q(b, g, extra) { return Object.assign({ b: b, g: g }, extra || {}); }

  var VOZ_COMANDANTE = 'Comandante';

  /* fontes do homem ao mar (pesquisa registrada em research/mob.md, consultada em 2026-10-08) */
  var F_MOB = {
    uss2020: { txt: 'US Sailing, York et al., A Study Evaluating MOB Return and Recovery in the 21st Century (2020)', url: 'https://www.ussailing.org/wp-content/uploads/2024/05/2020.New-Study-Evaluating-MOB-Return-and-Recovery-in-the-21st-Century.pdf' },
    sas: { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1)', url: 'https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf' },
    qs: { txt: 'US Sailing, Quick-Stop Rescue (2016)', url: 'https://www.ussailing.org/news/quick-stop-rescue/' },
    sim: { txt: 'US Sailing, Rousmaniere, Final Report 2005 Crew Overboard Rescue Symposium', url: 'https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf' },
    hanson: { txt: 'US Sailing, Arthur B. Hanson Rescue Medal, caso Trisha (2004)', url: 'https://www.ussailing.org/wp-content/uploads/2018/01/5_15_04.pdf' },
    rya: { txt: 'RYA, Man overboard', url: 'https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/' },
    pbo: { txt: 'Practical Boat Owner, Man overboard turns: getting back to the casualty in the water (RYA reach-tack-reach e RORC quick-stop)', url: 'https://www.pbo.co.uk/seamanship/man-overboard-turns-getting-back-to-the-casualty-in-the-water-104939' },
    osr: { txt: 'World Sailing, Offshore Special Regulations 2026-2027, itens 4.22 e 6.04', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf' },
  };
  /* o que todas as fontes consultadas ensinam (vale para as duas técnicas) */
  var CONSENSO_MOB = [
    'Gritar “homem ao mar” e o lado, e manter alguém olhando e apontando para a pessoa. Com tripulação pequena, que não permite um vigia fixo, ficar perto dela pesa ainda mais (US Sailing; RYA).',
    'Lançar flutuação já, e tudo o mais que flutue ao alcance: ajuda a pessoa e marca o local (US Sailing 2020, recomendação I; Safety at Sea).',
    'Marcar o ponto no botão MOB do GNSS ou do plotter (RYA; World Sailing OSR 4.22.2, categorias 1 e 2: gravar a posição em até 10 s) e alertar pelo VHF: canal 16 ou alerta de socorro DSC (RYA). No Brasil, o canal 16 é o de escuta de socorro.',
    'Diminuir a velocidade e ficar perto: “a distância é o inimigo” (US Sailing, Safety at Sea; RYA: reduzir ou parar o barco).',
    'Voltar devagar e com controle, sem passar direto pela pessoa (US Sailing 2020, achado 2 e “Minor changes” 3; simpósio de 2005).',
    'Motor em ponto morto até ter certeza de que não há cabo na água, e em ponto morto ou desligado junto da pessoa, por causa da hélice (Safety at Sea; RYA).',
    'Fazer o contato com cabo, boia com retinida ou Lifesling, sem encostar o casco na pessoa (US Sailing 2020, recomendação II).',
    'Treinar no próprio barco, com vento leve e forte, de dia e de noite, com todos no leme (US Sailing 2020, recomendação IV; World Sailing OSR 6.04: treino anual).',
  ];

  /* recomendação explícita do curso (julgamento do curso a partir das fontes; ver research/mob.md, "Recomendação adotada pelo app") */
  var RECOMENDA_MOB = {
    intro: 'Esta é a escolha do curso para um veleiro de cruzeiro, tirada das fontes abaixo; não é norma da Marinha do Brasil. Nenhuma fonte diz que existe um único método certo para todos os casos (Safety at Sea do US Sailing), por isso as variantes seguem descritas, com a fonte de cada uma, nos outros quadros.',
    itens: [
      ['Tripulação reduzida (casal, três ou quatro pessoas)', 'Parada rápida como primeira resposta, com o Lifesling lançado já na fase de giro, se o barco tiver. Ela mantém o barco perto da pessoa, e “a distância é o inimigo” (Safety at Sea v. 7.1). No estudo de 2020, sistemas sem quick-stop ou parecido tiveram resultados piores; com 4 pessoas ou menos pode não haver vigia fixo, e então ficar perto pesa ainda mais. No simpósio de 2005, a maioria dos organizadores a considerou a melhor manobra para a maioria dos acidentes.'],
      ['Tripulação que dá conta de manobrar e boa visibilidade', 'Manobra do oito (reach-tack-reach). Afastar-se alguns comprimentos dá tempo de preparar velas e cabo e evita o jaibe, e a chegada em bolina folgada deixa frear só folgando a escota (RYA, via Practical Boat Owner). A condição “boa visibilidade” é critério deste curso, não das fontes: ao se afastar, a pessoa fica mais longe, e de noite ou com onda é mais fácil perdê-la de vista (o estudo de 2020 aponta a noite como o caso mais difícil). Na dúvida, parada rápida.'],
      ['Aproximação final, em qualquer método', 'Em bolina folgada, devagar, com a velocidade controlada pelas escotas: folgue até as velas panejarem para frear. Mire na menor velocidade que ainda deixe governar; a referência mais prudente é 1 nó (regra de Annapolis; o Safety at Sea pede não arrastar a pessoa a mais de 1 nó), embora as vítimas do simpósio de 2005 tenham aceitado 2 a 3 nós. O olhar do timoneiro fica na pessoa, não no velocímetro; a genoa vai arriada ou enrolada, para as escotas soltas não machucarem; motor em ponto morto ou desligado perto da pessoa.'],
      ['Lado do recolhimento', 'Deixe a pessoa a sotavento do barco (o barco fica a barlavento dela), como o RYA ensina: o barco faz abrigo e, ao perder velocidade, é levado até a pessoa em vez de se afastar, e do lado de sotavento a borda fica mais perto da água (Practical Boat Owner). O simpósio de 2005 também descreve a chegada com o barco a barlavento da pessoa, e quase todas as vítimas dos testes preferiram assim. Escolha o costado baixo, perto da popa: é a escolha prática do curso, não uma frase do RYA (a borda ali costuma ser a mais baixa e o cockpit fica perto). Ali também fica o hélice, então motor em ponto morto ou desligado.'],
      ['Quando a variante a barlavento convém', 'Pessoa a barlavento do barco é o que descrevem o US Sailing em 2004 (quick-stop, caso Trisha) e o RORC (via Practical Boat Owner). Convém quando o barco, ao perder velocidade, correria sobre a pessoa mais depressa do que você controla: barco com muito arrasto do vento (o relato de 2004 diz que, num trimarã, um casco poderia ter atingido a pessoa na cabeça pelo lado de sotavento) ou mar duro, em que o simpósio de 2005 avisa que o barco a barlavento pode ser jogado com violência sobre a pessoa. Em qualquer dos lados vale o mesmo princípio: parar perto, na altura do través, e fazer o contato por cabo ou Lifesling, sem usar o casco.'],
    ],
    fecho: 'Treine a manobra com seu instrutor e sua tripulação, no seu barco, pelos dois lados, com vento leve e forte e à noite. O simpósio de 2005 avisa que o “método perfeito” de um barco pode valer só para ele.',
  };

  var QUIZ_CAMBAR = [
    { p: 'Quando o tripulante da genoa solta a escota que estava trabalhando?', alt: [
      'Antes de começar a orçar, para o barco ir mais devagar.',
      'Quando a genoa começa a panejar, com a proa chegando perto do vento.',
      'Só depois que o barco já está inteiro no novo bordo.',
      'Nunca: a genoa passa sozinha para o outro lado.'], certa: 1,
      por: 'Solte quando a genoa começar a panejar, isto é, quando ela já perdeu a força. Soltar cedo demais tira a potência e o barco pode parar no vento; soltar tarde demais deixa o vento prender a vela contra o mastro e os brandais.' },
    { p: 'De uma bolina cerrada num bordo até a bolina cerrada no outro, quanto o rumo do barco muda, aproximadamente?', alt: ['Uns 45°.', 'Uns 90°.', '180°.', 'Uns 30°.'], certa: 1,
      por: 'O ângulo de bolina cerrada é de cerca de 45° para cada lado do vento (varia de barco para barco). Somando os dois lados, o giro total fica perto de 90°, entre 70° e 100° na prática.' },
    { p: 'O barco parou com a proa no vento no meio do cambar e não completa a virada. O que fazer?', alt: [
      'Soltar todas as escotas e esperar o vento girar.',
      'Dar ré com o leme invertido e caçar a genoa do bordo antigo, a contravento, para empurrar a proa para o novo bordo.',
      'Ligar o motor a toda força, mantendo o leme como está.',
      'Cambar em roda (jaibe) imediatamente.'], certa: 1,
      por: 'A genoa a contravento empurra a proa para o lado certo, e o leme invertido para ré ajuda a proa a cair. Depois que a proa cai e o barco ganha velocidade, volte o leme ao centro e passe a genoa para a escota nova.' },
  ];

  var QUIZ_JAIBE = [
    { p: 'Por que se caça a escota da grande até a retranca ficar perto do centro antes do jaibe controlado?', alt: [
      'Para o barco andar mais depressa durante a manobra.',
      'Porque assim a retranca cruza o barco curto e devagar, em vez de varrer o cockpit com a escota toda aberta.',
      'Porque a retranca só passa para o outro bordo se estiver no centro.',
      'Não é preciso caçar: a escota deve ficar toda folgada.'], certa: 1,
      por: 'Com a escota toda aberta a retranca percorre um arco enorme e ganha muita velocidade. Quase no centro ela percorre só um pedaço pequeno e fica sob controle da escota. Depois de cruzar, folga-se devagar.' },
    { p: 'O que é um jaibe acidental (involuntário)?', alt: [
      'Quando o barco cambia por davante sem aviso.',
      'Quando a popa passa pelo vento sem querer, com a escota toda aberta, e a retranca cruza de uma vez.',
      'Um jaibe feito com a genoa enrolada.',
      'O mesmo que capear.'], certa: 1,
      por: 'Em rumos de popa, um descuido no leme ou uma onda pode fazer o vento passar para o outro lado da vela. A retranca vara o barco com força: ela pode ferir ou derrubar alguém, quebrar o equipamento ou fazer o barco atravessar.' },
    { p: 'Para que serve a trinca da retranca (preventer)?', alt: [
      'Para o jaibe acidental não acontecer: ela segura a retranca aberta no bordo em que está.',
      'Para ajudar o jaibe controlado.',
      'Para enrolar a genoa.',
      'Para rizar a grande.'], certa: 0,
      por: 'A trinca prende a retranca para a frente e para o lado, de modo que um jaibe involuntário não a faça varrer o barco. Por isso ela deve ser tirada antes de um jaibe de propósito e recolocada depois.' },
  ];

  var QUIZ_CAPEAR = [
    { p: 'No capeamento, o que acontece com a genoa?', alt: [
      'Ela é solta e panejando livremente.',
      'Fica a contravento: o vento a empurra de frente, e isso faz a proa cair, contra o efeito do leme.',
      'É arriada no convés.',
      'É enrolada por completo.'], certa: 1,
      por: 'Na manobra de capear se cambia sem soltar a escota da genoa. A genoa fica a contravento e tenta fazer a proa arribar. O leme todo orçando tenta fazer a proa orçar. As duas forças se equilibram e o barco fica quase parado.' },
    { p: 'Para que serve capear?', alt: [
      'Para ir mais rápido de través.',
      'Para fazer uma pausa segura: almoçar, rizar com calma, esperar a maré, aliviar o barco em tempo duro.',
      'Para ancorar sem âncora.',
      'Para cambar mais rápido.'], certa: 1,
      por: 'Capeando o barco fica estável, com pouca banda e movimento mais calmo, em um rumo fixo cerca de 50° a 60° do vento. É uma pausa, não uma parada total: o barco ainda deriva devagar.' },
    { p: 'O barco capeado fica completamente parado?', alt: ['Sim, como se estivesse fundeado.', 'Não: continua derivando devagar a sotavento e avançando um pouco.', 'Sim, mas só com a grande.', 'Depende da cor da vela.'], certa: 1,
      por: 'Ele ainda se move devagar (em geral cerca de 1 nó ou menos) e deriva para sotavento. Por isso é preciso manter vigilância e espaço livre a sotavento.' },
  ];

  var QUIZ_RIZAR = [
    { p: 'Qual o melhor momento para rizar?', alt: [
      'Quando o vento já está muito forte e o barco quase deitando.',
      'Cedo: quando o vento está aumentando ou se prevê que vai aumentar, antes que seja difícil.',
      'Só depois que a vela rasgar.',
      'Nunca, é só ir mais rápido.'], certa: 1,
      por: 'Rizar cedo é manobra; rizar tarde é emergência. Com vento mais calmo a vela sai da pressão com mais facilidade e a tripulação trabalha com mais segurança. Se está em dúvida, rize.' },
    { p: 'Por que se orça o barco (ou se capeia) antes de arriar a adriça para rizar?', alt: [
      'Porque assim a vela fica sem pressão e o trabalho no mastro fica mais fácil e seguro.',
      'Porque assim o barco anda mais depressa.',
      'Porque a adriça só solta com a vela cheia.',
      'Não é necessário orçar.'], certa: 0,
      por: 'Com a proa perto do vento e a escota folgada, a grande panejar com pouca força, a vela desce sem lutar contra o vento e a retranca não é lançada para os lados.' },
    { p: 'Qual a função do amantilho (topping lift) durante o rizo?', alt: [
      'Segurar a retranca para que ela não caia no cockpit quando se solta o burro e se arria a vela.',
      'Puxar a vela para cima.',
      'Prender o olhal do rizo no gancho.',
      'Controlar a escota.'], certa: 0,
      por: 'O amantilho vai do topo do mastro ao fim da retranca. Quando se solta o burro (vang), é ele que segura o peso da retranca. Sem ele, a retranca cai sobre quem estiver no cockpit.' },
  ];

  var QUIZ_MOB_RAPIDA = [
    { p: 'Qual a única tarefa de quem viu a pessoa cair?', alt: [
      'Assumir o leme.',
      'Gritar "Homem ao mar!" e apontar para a pessoa, sem tirar o olho dela até ser recolhida.',
      'Ligar o motor.',
      'Soltar as velas.'], certa: 1,
      por: 'No mar a pessoa some entre as ondas em segundos. Um tripulante apontando o tempo todo é a melhor ajuda para o barco voltar ao lugar certo. As demais tarefas são distribuídas entre os outros.' },
    { p: 'Por que na parada rápida se cambia sem soltar a escota da genoa?', alt: [
      'Para ir mais rápido.',
      'Porque a genoa a contravento segura o barco perto da pessoa e evita que ele se afaste.',
      'Porque a genoa é mais forte que a grande.',
      'Porque assim o motor desliga sozinho.'], certa: 1,
      por: 'A genoa a contravento freia o barco e o mantém perto da queda, mesmo com ele continuando a girar: depois do cambar ele arriba, passa a sotavento da pessoa, jaiba e volta em bolina folgada, sempre perto e com a pessoa à vista.' },
    { p: 'Depois de cambar com a genoa a contravento, o que o barco faz no quick-stop descrito pelo US Sailing?', alt: [
      'Fica de capa ao lado da pessoa até a tripulação estar pronta.',
      'Continua girando: arriba até o vento quase pela popa, passa a sotavento da pessoa, jaiba e volta em bolina folgada.',
      'Segue em linha reta por quatro comprimentos e cambia de novo.',
      'Para na hora, com a proa no vento, e dá ré até a pessoa.'], certa: 1,
      por: 'É a descrição do US Sailing (quick-stop de 2016, Safety at Sea e caso Trisha, de 2004). O simpósio de 2005 registra barcos que ficaram em capa logo acima da pessoa, mas é uma variação, e não o desenho do quick-stop.' },
    { p: 'Quando se arria ou se enrola a genoa no quick-stop?', alt: [
      'Antes de cambar, para a manobra ficar mais fácil.',
      'Quando a pessoa fica atrás do través, e só se a tripulação for completa: arriar velas leva o barco para longe.',
      'Nunca: a genoa fica içada até a pessoa estar a bordo.',
      'Logo depois que a pessoa é recolhida.'], certa: 1,
      por: 'O US Sailing (2016) manda baixar ou enrolar a vela de proa quando a pessoa está atrás do través, e o Safety at Sea acrescenta que isso só vale com tripulação completa, porque o tempo gasto arriando afasta o barco. Já as vítimas do simpósio de 2005 pediram a genoa arriada antes da aproximação final, para as escotas soltas não machucarem.' },
    { p: 'Qual o botão que você aperta logo que a pessoa cai?', alt: ['O botão MOB do GPS ou plotter, que grava a posição.', 'O botão de rádio FM.', 'O botão do piloto automático para trocar de rota.', 'Nenhum, não é necessário.'], certa: 0,
      por: 'O botão MOB grava a posição da queda e mostra rumo e distância de volta. Ele marca só onde a pessoa caiu: com corrente e vento ela deriva, e por isso o vigia continua apontando. O alerta pelo VHF (alerta de socorro DSC ou voz no canal 16) é outra tarefa, do navegador.' },
    { p: 'Você ligou o motor para voltar à pessoa. Em que posição fica o câmbio até ter certeza de que não há cabo nem escota na água?', alt: ['Em ponto morto.', 'Adiante, devagar.', 'Em ré, para frear o barco.', 'Tanto faz, a hélice é protegida.'], certa: 0,
      por: 'A orientação do US Sailing é ligar o motor mas mantê-lo em ponto morto até saber que não há linhas na água, e a do RYA é deixá-lo em ponto morto ou desligado junto à pessoa. Um cabo na hélice tira o motor da manobra, e a hélice girando perto da pessoa a fere.' },
  ];

  var QUIZ_MOB_OITO = [
    { p: 'Na manobra do oito, por que se segue de través por alguns comprimentos de barco antes de cambar?', alt: [
      'Para ganhar espaço e tempo de preparar a volta: a aproximação final sai mais controlada.',
      'Porque é regra do RIPEAM.',
      'Para esquecer a pessoa na água.',
      'Porque o barco não consegue cambar antes disso.'], certa: 0,
      por: 'A distância dá tempo de recolher, preparar e ajustar o rumo da volta. Perto demais exige uma volta apertada e difícil; longe demais faz perder a pessoa de vista, sobretudo à noite. O desenho usa 4 comprimentos; o simpósio do US Sailing de 2005 cita de 2 a 5, conforme a variação, e o valor muda com o mar e o barco.' },
    { p: 'No traçado do desenho, o que o barco faz depois do cambar na manobra do oito?', alt: [
      'Arriba até o largo, desce para sotavento cruzando a própria esteira de ida e só então orça até a bolina folgada para voltar à pessoa.',
      'Segue direto para a pessoa em bolina cerrada.',
      'Para de capa e espera a tripulação.',
      'Dá um jaibe imediato e volta em popa rasa.'], certa: 0,
      por: 'É o que dá a forma de oito: o barco cruza a esteira de ida, passa a sotavento dela e volta em bolina folgada, com a pessoa a sotavento do barco na versão do RYA. O traçado é um esquema; o real depende do vento, do mar e do barco.' },
    { p: 'Em que ponto de vela é feita a aproximação final à pessoa?', alt: ['Em bolina folgada (close reach): para frear basta orçar e folgar as escotas.', 'Em popa rasa, com jaibe no final.', 'Em bolina cerrada o tempo todo.', 'Em zona morta, com as velas cheias.'], certa: 0,
      por: 'Em bolina folgada o timoneiro acelera ou freia só com o leme e as escotas, e as velas panejando fazem o barco perder a força. É o que dizem o simpósio de 2005 (as manobras costumam terminar em bolina folgada) e o RYA, descrito pela Practical Boat Owner.' },
    { p: 'Na versão do RYA, a pessoa fica a sotavento do barco na aproximação final. Qual o motivo dado?', alt: [
      'O barco faz abrigo do vento e deriva devagar em direção à pessoa, e não para longe dela.',
      'Porque o vento empurra a pessoa para longe do barco.',
      'Porque assim se evita o uso do motor.',
      'Porque o RIPEAM manda.'], certa: 0,
      por: 'É o motivo apresentado para o RYA: o casco faz abrigo e o barco, ao parar, tende a ir para cima da pessoa, não para longe. Em outras escolas o recolhimento é a barlavento (RORC, US Sailing de 2004), e em mar duro o barco a barlavento pode ser jogado sobre a pessoa. O curso recomenda o lado de sotavento do barco e deixa o de barlavento para barco de muito arrasto ou mar duro; treine os dois com seu instrutor e sua tripulação.' },
  ];


  var QUIZ_FUNDEAR = [
    { p: 'Em que direção a proa deve apontar ao se aproximar do ponto de fundeio?', alt: [
      'Contra o vento (ou contra a corrente, se ela for mais forte que o vento).',
      'A favor do vento.',
      'De través ao vento.',
      'Tanto faz.'], certa: 0,
      por: 'Com a proa contra o vento ou a corrente o barco fica controlável a baixa velocidade e, ao dar ré, o cabo se estende bem esticado atrás do barco, sem se enrolar na âncora.' },
    { p: 'Profundidade de 6 m agora, com subida de maré de 2 m ainda por vir e altura da proa sobre a água de 1,2 m. Para uma relação de 5 para 1, quantos metros de filame largar?', alt: ['Cerca de 31 m.', 'Cerca de 36 m.', 'Cerca de 40 m.', 'Cerca de 46 m.'], certa: 3,
      por: 'Filame = relação × (profundidade na preamar + altura da proa) = 5 × (6 + 2 + 1,2) = 5 × 9,2 = 46 m. Quem calcula só com os 6 m de agora (5 × 6 = 30 m) fica curto quando a maré subir.' },
    { p: 'O que significa garrar?', alt: ['Soltar a âncora.', 'A âncora arrastando pelo fundo, e o barco se mexendo sem querer.', 'Içar a âncora.', 'Marcar o ponto de fundeio.'], certa: 1,
      por: 'Garrar é a âncora perder a tença e arrastar pelo fundo. Sinais: as marcações em terra mudam, o alarme do GPS toca ou o barco muda de posição em relação aos outros fundeados.' },
  ];

  var MAN = {};

  /* ---- cambar por davante ---- */
  MAN.cambar = {
    id: 'cambar', rot: 'Cambar por davante', en: 'tacking', tipo: 'planta', s: 0.5, vb: [90, 190, 240, 264],
    quando: 'É a manobra para mudar de bordo com a proa passando pelo vento. Serve para avançar contra o vento em zigue-zague (bordejar) e para mudar de rumo de bolina.',
    fonte: 'Prática de seamanship. Antes de qualquer manobra: vigilância visual e auditiva permanente, RIPEAM, Regra 5.',
    variantes: [{
      id: 'normal', rot: 'Cambar',
      inicio: 'Bolina cerrada com vento por boreste (amura de boreste). Ao final, o vento entrará por bombordo. O giro total é de cerca de 90°.',
      kfs: [
        K(250, 395, -45, -14, -12, { v: 6.1 }),
        K(222, 366, -45, -14, -12, { v: 6.0 }),
        K(200, 326, 0, 0, 0, { fl: 0.8, v: 3.4 }),
        K(210, 292, 40, 12, 30, { fl: 0.5, v: 3.0 }),
        K(245, 246, 45, 14, 12, { v: 5.6 }),
      ],
      passos: [
        { t: 'Preparar para cambar', vozes: [[VOZ_COMANDANTE, 'Preparar para cambar!', 'Ready about?'], ['Tripulação', 'Pronto!', 'Ready!']],
          txt: 'O comandante avisa e olha em volta, principalmente para onde a proa vai virar: durante a manobra o barco perde velocidade e ocupa espaço. Cada um vai ao seu posto e confirma. A escota nova da genoa (a de boreste, que vai trabalhar no novo bordo) já está com voltas na catraca e a escota atual (a de bombordo, a de sotavento) fica livre para correr. A grande vira sozinha; só a escota dela precisa estar livre.',
          tarefas: [['Timoneiro', 'Manter a bolina cerrada, olhar o horizonte nos dois bordos e escolher o momento. Só avisa "Cambando!" depois do "Pronto!" de todos.'], ['Tripulante da genoa', 'Deixar a escota nova com algumas voltas na catraca e a manivela à mão; a escota atual livre, sem nós, pronta para correr.'], ['Tripulante da grande', 'Verificar se a escota da grande e o carro (se tiver) correm livres; abaixar a cabeça quando a retranca for cruzar.']] },
        { t: 'Cambando: orçar até o vento', vozes: [[VOZ_COMANDANTE, 'Cambando!', 'Lee-oh! (Helm’s a-lee)']],
          txt: 'O timoneiro leva o leme a sotavento de forma firme e contínua (com a cana, empurra-a para sotavento; com a roda, gira para o lado de onde sopra o vento). A proa vai orçando, a velocidade cai e as velas começam a perder a pressão: a genoa e a grande panejam quando a proa chega perto do vento. Ainda não se solta nada. Não exagere o leme: leme todo freia o barco.',
          tarefas: [['Timoneiro', 'Um giro suave e contínuo do leme, olhando a proa e a genoa.'], ['Tripulante da genoa', 'Esperar. Olhar a testa (borda da frente) da genoa: ela vai começar a panejar.'], ['Tripulante da grande', 'Esperar, abaixado, longe do arco da retranca.']],
          regra: 'Giro total: cerca de 90° de rumo (45° de cada lado do vento, em geral).' },
        { t: 'A proa passa pelo vento', vozes: [['Tripulante da genoa', 'Folgando!', 'Letting go!']],
          txt: 'Quando a genoa começa a panejar, o tripulante solta a escota antiga de uma vez (sem puxar de volta). A proa atravessa o vento, a genoa passa rente ao mastro para o outro lado e a grande atravessa o barco com a retranca, devagar e sozinha. O timoneiro continua o giro até chegar a um rumo de bolina cerrada no novo bordo.',
          tarefas: [['Tripulante da genoa', 'Soltar a escota antiga quando a genoa panejar e deixá-la correr até a vela passar para o outro lado. Não deixe a escota enroscar.'], ['Timoneiro', 'Continuar o giro até o rumo de bolina cerrada do novo bordo e então endireitar o leme.'], ['Tripulante da grande', 'Cabeça baixa; a retranca cruza sozinha, perto do centro do barco.']],
          seg: 'Cuidado com a cabeça, os dedos e as escotas soltas: no cambar a genoa e as escotas batem.' },
        { t: 'Cace a genoa e retome a velocidade', vozes: [[VOZ_COMANDANTE, 'Cace a genoa!', 'Trim the jib!'], ['Tripulante da genoa', 'Caçando!']],
          txt: 'Com a genoa já no novo bordo, o tripulante caça a nova escota: primeiro rápido, com as mãos, e depois com a manivela da catraca até a vela ficar bem caçada para bolina cerrada. O timoneiro pode arribar uma ou duas vezes (um pouquinho) para acelerar e depois orçar até o rumo certo de bolina. Termine arrumando a escota antiga.',
          tarefas: [['Tripulante da genoa', 'Caçar rápido com as mãos e terminar com a manivela; cunhar a escota e arrumar a antiga, sem nós.'], ['Timoneiro', 'Arribar um pouco para recuperar velocidade e só então voltar ao rumo de bolina.'], ['Tripulante da grande', 'Ajustar a escota e o carro para o novo bordo, se necessário.']],
          dica: 'Se o barco parar com a proa no vento (está "no vento", ou "in irons"): gire o leme ao contrário, cace a genoa do bordo antigo (a contravento) para empurrar a proa para o novo bordo e, quando a proa cair e houver velocidade, volte o leme ao centro e passe a escota.' },
      ],
      quiz: QUIZ_CAMBAR,
    }],
  };

  /* ---- jaibe ---- */
  MAN.jaibe = {
    id: 'jaibe', rot: 'Jaibe (cambar em roda)', en: 'jibe / gybe', tipo: 'planta', s: 0.5, vb: [13, 20, 254, 280],
    quando: 'Mudar de bordo passando a popa pelo vento: a retranca atravessa o barco com o vento por trás. É a manobra de rumos de popa e largo, e a mais perigosa se feita sem controle.',
    fonte: 'Prática de seamanship. A trinca da retranca (preventer) e o jaibe controlado são boa prática ensinada pelas escolas de vela.',
    variantes: [
      {
        id: 'controlado', rot: 'Jaibe controlado',
        inicio: 'Vento pela alheta de bombordo (a cerca de 150° da proa) e a retranca aberta a boreste. Ao final, o vento entra pela alheta de boreste.',
        kfs: [
          K(110, 60, 150, 60, 55, { v: 5.5 }),
          K(150, 104, 165, 10, 22, { v: 5.5 }),
          K(170, 152, 180, 4, 5, { fl: 0.3, v: 5.2 }),
          K(170, 200, 195, -14, -25, { fl: 0.3, v: 5.2 }),
          K(146, 258, 210, -60, -55, { v: 5.5 }),
        ],
        passos: [
          { t: 'Preparar para jaibe', vozes: [[VOZ_COMANDANTE, 'Preparar para jaibe!', 'Stand by to gybe!'], ['Tripulação', 'Pronto!', 'Ready!']],
            txt: 'Antes de cruzar, todos saem do arco da retranca e abaixam a cabeça. Se houver trinca da retranca (preventer), solte-a. O tripulante da grande caça a escota até a retranca ficar perto da linha de centro: assim ela vai cruzar curto e devagar, sob controle. Se a genoa estiver aberta de um lado, enrole-a em parte ou deixe a escota pronta para passar.',
            tarefas: [['Timoneiro', 'Manter o rumo de popa e checar o vento e o espaço livre.'], ['Tripulante da grande', 'Retirar a trinca, caçar a escota até a retranca ficar quase no centro, com a escota nas mãos.'], ['Tripulante da genoa', 'Enrolar um pouco a genoa ou deixar as escotas prontas para o novo bordo.']],
            seg: 'A retranca em movimento é perigosa: ninguém fica no arco dela durante o jaibe.' },
          { t: 'Arribar até a popa passar pelo vento', vozes: [[VOZ_COMANDANTE, 'Jaibando!', 'Gybe-oh!']],
            txt: 'O timoneiro arriba de forma lenta e firme, olhando o catavento, até a popa chegar à linha do vento. A vela perde a pressão por um instante. Aqui ainda não se solta a escota: a retranca está no centro.',
            tarefas: [['Timoneiro', 'Arribar com suavidade, sem pressa e sem soltar o leme; observar o catavento.'], ['Tripulante da grande', 'Segurar a escota, sem soltar nem puxar.']] },
          { t: 'A retranca atravessa o barco', vozes: [],
            txt: 'Quando o vento passa para o outro lado da vela, a retranca atravessa o barco. Como já estava perto do centro e presa pela escota, o arco é curto e lento. O tripulante da grande acompanha com a escota nas mãos.',
            tarefas: [['Tripulante da grande', 'Acompanhar o movimento com a escota nas mãos, sem soltar de repente.'], ['Timoneiro', 'Continuar arribando devagar até a vela pegar o vento do novo lado.']] },
          { t: 'Folgar a escota com controle', vozes: [[VOZ_COMANDANTE, 'Folga a grande!', 'Ease the main!'], ['Tripulante da grande', 'Folgando!']],
            txt: 'A vela já está do novo lado. O tripulante da grande folga a escota aos poucos, até a retranca ficar bem aberta a bombordo e a vela trabalhando bem. Recoloque a trinca da retranca se o trecho for longo e o mar estiver agitado. O timoneiro mantém o rumo e evita arribar demais.',
            tarefas: [['Tripulante da grande', 'Folgar aos poucos, com a escota passando pela catraca com algumas voltas, e recolocar a trinca.'], ['Timoneiro', 'Acertar o rumo de largo ou de popa e checar o catavento.']] },
        ],
        quiz: QUIZ_JAIBE,
      },
      {
        id: 'acidental', rot: 'Jaibe acidental (o que evitar)',
        inicio: 'Mesmo rumo de popa, mas sem aviso e com a escota da grande toda aberta. Veja o que acontece quando ninguém controla a retranca.',
        kfs: [
          K(110, 60, 150, 60, 55, { v: 5.5 }),
          K(140, 95, 165, 60, 55, { v: 5.5 }),
          K(165, 140, 182, 62, 50, { fl: 0.6, pg: 0.4, v: 5.4 }),
          K(168, 185, 192, -62, -55, { pg: 1, v: 5.0 }),
          K(150, 235, 205, -62, -55, { pg: 1, v: 4.4 }),
        ],
        passos: [
          { t: 'Descuido em rumo de popa', vozes: [],
            txt: 'Vento por trás, a grande toda aberta e ninguém olhando o catavento. Uma onda, uma distração ou um erro no leme faz a popa começar a se aproximar da linha do vento.',
            tarefas: [['Quem está no leme', 'Distraído: o rumo vai arribando sem perceber.'], ['Tripulação', 'Ninguém foi avisado; alguém pode estar no arco da retranca.']] },
          { t: 'O vento passa para o outro lado da vela', vozes: [],
            txt: 'A popa chega à linha do vento. A vela perde a pressão e paneja, mas a retranca continua a boreste, toda aberta. É o último instante em que ainda seria possível corrigir com o leme.',
            tarefas: [['Quem está no leme', 'Arribar de volta imediatamente é a correção, antes de o vento pegar do outro lado.']] },
          { t: 'A retranca varre o barco', vozes: [['Quem viu', 'Cuidado com a retranca!', 'Boom!']], snap: ['b', 'g'],
            txt: 'O vento pega a vela do lado errado e a retranca cruza o barco toda de uma vez, com a escota toda aberta. O arco é enorme e o movimento é violento.',
            tarefas: [['Todos', 'Quem estiver no arco da retranca pode ser atingido; segure-se e abaixe-se.']],
            seg: 'Um jaibe acidental pode ferir gravemente ou derrubar alguém no mar.' },
          { t: 'Consequências', vozes: [],
            txt: 'A retranca pode ferir ou jogar uma pessoa ao mar, quebrar o burro, a retranca ou o mastro, rasgar a vela e fazer o barco atravessar (broaching). Depois: estabilizar o rumo, ver se alguém se feriu, avaliar o dano e só então decidir o que fazer.',
            tarefas: [['Comandante', 'Estabilizar o rumo, contar a tripulação e checar feridos e danos.']],
            dica: 'Para evitar: olhe o catavento, use a trinca da retranca em rumos de popa, e faça o jaibe sempre de propósito, com aviso e controle.' },
        ],
        quiz: QUIZ_JAIBE,
      },
    ],
  };

  /* ---- capear ---- */
  MAN.capear = {
    id: 'capear', rot: 'Capear', en: 'heave-to', tipo: 'planta', s: 0.5, vb: [110, 236, 220, 242],
    quando: 'Fazer o barco ficar quase parado e estável, em um rumo fixo, para almoçar, rizar com calma, esperar a maré, aliviar o barco em tempo duro ou simplesmente descansar.',
    fonte: 'Prática de seamanship. O ponto de equilíbrio (cerca de 50° a 60° do vento) varia de barco para barco: pratique em tempo bom antes de precisar.',
    variantes: [{
      id: 'normal', rot: 'Capear',
      inicio: 'Bolina cerrada com vento por boreste. A manobra é um cambar em que a escota da genoa não é solta.',
      kfs: [
        K(270, 395, -45, -14, -12, { v: 6.1 }),
        K(246, 368, -45, -14, -12, { v: 6.0 }),
        K(226, 334, 0, 0, -12, { fl: 0.7, v: 3.2 }),
        K(232, 308, 38, 25, -12, { fl: 0.4, v: 1.6 }),
        K(238, 300, 56, 30, -12, { sl: 0.6, v: 1.1 }),
        K(258, 322, 56, 30, -12, { sl: 1, v: 1.0 }),
      ],
      passos: [
        { t: 'Preparar para capear', vozes: [[VOZ_COMANDANTE, 'Preparar para capear!', 'Stand by to heave-to!'], ['Tripulação', 'Pronto!', 'Ready!']],
          txt: 'É como um cambar, mas com uma diferença: a escota da genoa não será solta. Combine isso com todos, olhe o espaço livre a sotavento (o barco vai derivar) e deixe a cana ou a roda a postos.',
          tarefas: [['Timoneiro', 'Checar o espaço livre, principalmente a sotavento, e combinar a manobra.'], ['Tripulante da genoa', 'Saber que não deve soltar a escota quando a genoa panejar.']] },
        { t: 'Cambar sem soltar a genoa', vozes: [[VOZ_COMANDANTE, 'Cambando! Não solta a genoa!', 'Tacking! Leave the jib!']],
          txt: 'O timoneiro orça como num cambar. A grande passa para o outro lado sozinha. A genoa, que não foi solta, vai ser empurrada pelo vento contra o mastro e os brandais.',
          tarefas: [['Timoneiro', 'Orçar firme até a proa passar pelo vento.'], ['Tripulante da genoa', 'Não soltar a escota! Segurar firme.']] },
        { t: 'A genoa fica a contravento', vozes: [],
          txt: 'O vento pega a genoa pelo lado de fora e a empurra para trás: ela fica a contravento (backed). Essa força tenta fazer a proa cair, afastando-se do vento. Ao mesmo tempo, a grande ainda quer fazer o barco orçar.',
          tarefas: [['Tripulante da grande', 'Folgar um pouco a escota da grande para ela perder a força e deixar de puxar o barco para o vento.'], ['Timoneiro', 'Observar a proa cair.']] },
        { t: 'Leme contra a genoa', vozes: [[VOZ_COMANDANTE, 'Leme todo orçando!', 'Helm down!']],
          txt: 'O timoneiro vira o leme todo para orçar (cana a sotavento; na roda, gira para o lado do vento) e o prende nessa posição. A genoa a contravento tenta fazer a proa cair; o leme tenta fazê-la orçar. As duas forças se equilibram.',
          tarefas: [['Timoneiro', 'Prender o leme todo orçando (a cana a sotavento, com uma linha ou o freio da roda).'], ['Tripulante da grande', 'Ajustar a escota da grande até o barco ficar estável.']] },
        { t: 'O barco fica estável e deriva devagar', vozes: [],
          txt: 'O barco fica com a proa cerca de 50° a 60° do vento, quase parado: avança bem devagar e deriva para sotavento a cerca de 1 nó ou menos. A deriva deixa uma "esteira" lisa a barlavento, que acalma as ondas contra o casco. Agora é só aproveitar a pausa, sem esquecer da vigilância.',
          tarefas: [['Todos', 'Manter vigilância: o barco continua derivando.'], ['Comandante', 'Para voltar a navegar: soltar a escota da genoa a contravento, caçar do outro lado, centralizar o leme e arribar até ganhar velocidade.']],
          seg: 'O barco continua derivando: vigie o tráfego e os perigos a sotavento. A vigilância (RIPEAM, Regra 5) continua obrigatória.' },
      ],
      quiz: QUIZ_CAPEAR,
    }],
  };

  /* ---- rizar (vista de perfil) ---- */
  function kfRizo(hd, dn, pl, fl, vg, tl, es, hk) { return { h: hd, dn: dn, pl: pl, fl: fl, vg: vg, tl: tl, es: es, hk: hk }; }
  var KF_RIZO = [
    kfRizo(-50, 0, 0, 0, 1, 0, 0, 0),
    kfRizo(-50, 0, 0, 0, 1, 0, 0, 0),
    kfRizo(-20, 0, 0, 0.7, 1, 0, 1, 0),
    kfRizo(-20, 0, 0, 0.7, 0, 1, 1, 0),
    kfRizo(-20, 1, 0, 0.7, 0, 1, 1, 0),
    kfRizo(-20, 1, 0, 0.35, 0, 1, 1, 1),
    kfRizo(-20, 1, 1, 0.15, 0, 1, 1, 1),
    kfRizo(-50, 1, 1, 0, 1, 0, 0, 1),
  ];
  var PASSOS_RIZO = [
    { t: 'Rize antes de precisar', vozes: [[VOZ_COMANDANTE, 'Vamos rizar. Todos de colete!', 'We’re going to reef. Lifejackets on!']], ativo: [],
      txt: 'Sinais para rizar: banda grande, leme pesado, barco querendo orçar sozinho, vela panejando nas rajadas e vento aumentando. Se a previsão for de mais vento, rize cedo (no porto ou ao amanhecer). Rizar cedo é manobra; rizar tarde é emergência. Todos de colete salva-vidas e, no mar aberto, com cinto e talabarte presos ao barco.',
      tarefas: [['Comandante', 'Decidir cedo e avisar todos. Escolher quem trabalha no mastro e quem fica no leme.'], ['Todos', 'Colete salva-vidas. No mar aberto ou à noite, cinto e talabarte presos ao cabo de vida.']] },
    { t: 'Orçar e aliviar a vela', vozes: [[VOZ_COMANDANTE, 'Orçando para rizar!']], ativo: ['escota'],
      txt: 'O timoneiro leva a proa para perto do vento (ou usa o motor, ou capeia) e o tripulante folga a escota da grande até ela panejar com pouca força. Sem a pressão do vento, a vela desce com facilidade e a retranca não balança.',
      tarefas: [['Timoneiro', 'Manter a proa perto do vento, com o motor engrenado em ponto morto se for preciso, olhando o rumo.'], ['Tripulante da grande', 'Folgar a escota até a vela panejar com calma.']] },
    { t: 'Firmar o amantilho e soltar o burro', vozes: [], ativo: ['amantilho', 'burro'],
      txt: 'Firme o amantilho para a retranca não cair no cockpit e solte o burro (vang), para a retranca poder subir e descer sem ficar presa. O amantilho vai do alto do mastro ao fim da retranca.',
      tarefas: [['Tripulante do mastro', 'Caçar o amantilho e soltar o burro.']] },
    { t: 'Arriar a adriça até o olhal do rizo', vozes: [['Tripulante do mastro', 'Arriando a adriça!']], ativo: ['adriça'],
      txt: 'Solte a adriça da grande, mantendo-a sob controle na mão, até o olhal do rizo na frente da vela (punho de amura do rizo) chegar ao nível do gancho, junto ao mastro. A vela desce e o pano fica caindo sobre a retranca. Cuidado para não arriar demais.',
      tarefas: [['Tripulante do mastro', 'Arriar a adriça devagar e parar quando o olhal do rizo chegar ao gancho.']] },
    { t: 'Prender o olhal e caçar a adriça', vozes: [['Tripulante do mastro', 'Olhal preso!']], ativo: ['adriça', 'gancho'],
      txt: 'Encaixe o olhal do rizo no gancho de amura. Em seguida cace a adriça de novo até a frente da vela (a testa) ficar esticada, sem rugas. A frente do rizo agora é firme.',
      tarefas: [['Tripulante do mastro', 'Prender o olhal no gancho e caçar a adriça até a testa ficar esticada.']] },
    { t: 'Caçar o carregador do rizo', vozes: [['Tripulante do mastro', 'Caçando o carregador!']], ativo: ['carregador'],
      txt: 'Puxe a linha do rizo (carregador, ou linha de rizo da valuma) até o olhal de popa do rizo descer até a retranca e ser puxado para trás, o suficiente para esticar o pé da vela e deixar a valuma (borda de trás) reta. O pano que sobra fica em uma bolsa sobre a retranca. Se houver tiras (rizeiros), passe-as entre a vela e a retranca, bem soltas, só para o pano não flutuar.',
      tarefas: [['Tripulante do mastro', 'Caçar o carregador até o pé da vela esticar e a valuma ficar reta.'], ['Tripulante da grande', 'Ajudar com a escota, se for preciso.']] },
    { t: 'Soltar o amantilho e voltar a navegar', vozes: [[VOZ_COMANDANTE, 'Arriba! Caça a grande!']], ativo: ['escota', 'burro', 'amantilho'],
      txt: 'Solte o amantilho, cace o burro, cace a escota e arribe até o rumo desejado. Veja se a banda diminuiu e o leme ficou leve. Se ainda estiver pesado, rize de novo (2º rizo) ou reduza a genoa. Recolha todos os cabos soltos.',
      tarefas: [['Tripulante do mastro', 'Soltar o amantilho, caçar o burro e recolher os cabos soltos.'], ['Tripulante da grande', 'Caçar a escota e acertar a vela.'], ['Timoneiro', 'Arribar ao rumo; verificar banda e leme.']] },
  ];
  MAN.rizar = {
    id: 'rizar', rot: 'Rizar a vela grande', en: 'reefing', tipo: 'perfil', vb: [0, 0, 400, 440],
    quando: 'Diminuir a área da vela grande quando o vento aumenta. Cada rizo tira, em geral, de um quarto a um terço da área (varia de vela para vela). Rize cedo: é muito mais fácil com 18 nós do que com 30.',
    fonte: 'Prática de seamanship, para o sistema de rizos com linhas passadas (slab reefing). Outros sistemas (enrolador na retranca, vela enrolável no mastro) mudam os passos.',
    variantes: [
      { id: '1', rot: '1º rizo', q: 0.15, inicio: 'Grande içada inteira, em bolina, com vento forte entrando. O primeiro rizo reduz um pouco a área.', kfs: KF_RIZO, passos: PASSOS_RIZO, quiz: QUIZ_RIZAR },
      { id: '2', rot: '2º rizo', q: 0.30, inicio: 'Grande içada inteira, com vento muito forte. O segundo rizo reduz mais a área; o mesmo passo a passo, com o olhal mais alto na vela.', kfs: KF_RIZO, passos: PASSOS_RIZO, quiz: QUIZ_RIZAR },
    ],
  };

  /* ---- homem ao mar ---- */
  var TAR_MOB_1 = [
    ['Quem viu', 'Gritar "Homem ao mar!" e o lado em que a pessoa caiu. Apontar para a pessoa e NÃO parar de apontar, nem de olhar para ela, até ela estar a bordo. Esta é a única tarefa dessa pessoa. Se a tripulação for pequena e não houver vigia fixo, ficar perto da pessoa pesa ainda mais.'],
    ['Segundo tripulante', 'Lançar já o salva-vidas (boia ferradura ou circular), o poste de marcação com luz, se o barco tiver, e tudo o mais que flutue ao alcance. Isso ajuda a pessoa e marca o local.'],
    ['Navegador', 'Apertar o botão MOB do GPS/plotter (marca a posição na hora) e anotar a hora. Alertar pelo VHF: com DSC, o alerta de socorro (Distress); por voz, o canal 16. Mayday ou Pan-Pan conforme a situação, e pergunte-se já se há outro barco por perto que possa ajudar.'],
    ['Timoneiro/comandante', 'Manter a calma, assumir o comando e conduzir a manobra. Pode ligar o motor, mas só em ponto morto até ter certeza de que não há cabo nem escota na água, para não enrolar na hélice.'],
  ];

  /* O caminho do barco é integrado por trechos (uma etapa = um trecho): rumo no fim, distância em unidades de desenho
     (1 comprimento do barco = 44,6), velocidade no fim em nós e deriva a sotavento. A proa acompanha o caminho; o tempo,
     a posição da pessoa e a velocidade mostrada saem daí. Pessoa e boia derivam para sotavento (para baixo). */
  var DERIVA_MOB = { vel: 0.2, pessoa: [142, 133], boia: [124, 141] };
  var MARCA_MOB = [142, 133];

  MAN.mob = {
    id: 'mob', rot: 'Homem ao mar', en: 'man overboard (MOB)', tipo: 'planta', s: 0.36, vb: [50, 38, 320, 170],
    quando: 'Alguém cai na água. O objetivo é manter a pessoa à vista, marcar a posição e levar o barco para perto dela até o resgate. Há mais de uma técnica ensinada. As duas abaixo seguem as fontes listadas; a escolha do curso está no quadro “O que este curso recomenda”, e o que é consenso e o que varia entre escolas, nos quadros “O que todas as fontes ensinam” e “Onde as escolas divergem”.',
    fonte: 'Fontes: US Sailing (estudo de 2020, orientação do Comitê de Segurança no Mar, simpósio de 2005), RYA e Practical Boat Owner. Não é norma da Marinha do Brasil: o método de aproximação e de içamento varia com o barco, o mar e a tripulação, então treine a manobra com seu instrutor e sua tripulação. Os traçados são esquemas com o vento sempre do alto da figura; a distância, a velocidade e a deriva do desenho são ilustrativas.',
    selo: false,
    consenso: CONSENSO_MOB,
    recomenda: RECOMENDA_MOB,
    fontes: [F_MOB.sas, F_MOB.uss2020, F_MOB.qs, F_MOB.sim, F_MOB.hanson, F_MOB.rya, F_MOB.pbo, F_MOB.osr],
    variantes: [
      {
        id: 'parada-rapida', rot: 'Parada rápida', en: 'quick-stop',
        vb: [24, 26, 196, 232], marca: MARCA_MOB, escala: [30, 250],
        lifesling: { de: 2, comp: 165, raio: 32, leg: [140, 238] },
        diagLados: 'qs',
        inicio: 'Navegando em través, com vento por bombordo (vindo do alto da figura). Uma pessoa cai pelo lado de boreste, o de sotavento. O barco orça logo, cambia sem soltar a escota da genoa, continua girando até ter o vento quase pela popa, passa a sotavento da pessoa, jaiba e volta em bolina folgada até parar ao lado dela. A pessoa e a boia derivam devagar para sotavento (para baixo); o X marca no GPS onde ela caiu, não onde ela está agora.',
        variacoes: [
          ['Quick-stop ou oito', 'O US Sailing ensina o quick-stop como base, porque o barco fica perto da pessoa (estudo de 2020 e Safety at Sea). O RYA ensina o oito (reach-tack-reach), que se afasta e evita o jaibe (Practical Boat Owner). No simpósio de 2005 a maioria dos organizadores preferiu o quick-stop; um deles preferiu variações sem jaibe, e um dos relatores anotou que, nos testes daquele ano, o Fast Return tendeu a levar ao contato em até 2 minutos, contra até 4 do quick-stop. Os testes foram em mar sem ondas oceânicas. Recomendação do curso: parada rápida com tripulação reduzida; oito quando há tripulação para manobrar e boa visibilidade (quadro “O que este curso recomenda”).', F_MOB.sim],
          ['Parar a barlavento ou a sotavento da pessoa', 'O desenho da parada rápida termina como o quick-stop do US Sailing (caso Trisha, 2004): o barco abaixo da pessoa, que fica do lado de barlavento do barco. O RYA e as pessoas que fizeram o papel de vítima no simpósio de 2005 (quase por unanimidade) preferem o contrário, o barco a barlavento da pessoa, que fica do lado de sotavento, com o barco derivando até ela; em mar muito duro o barco pode ser jogado sobre a pessoa. O quick-stop do RORC (Practical Boat Owner) também deixa a pessoa a barlavento. O texto de 2004 relata um caso em que o casco de um trimarã teria atingido a pessoa se a aproximação fosse por sotavento. O esquema no alto deste quadro mostra os dois lados. Recomendação do curso: terminar com a pessoa a sotavento do barco (lado A do esquema), como o RYA; este desenho segue o US Sailing de 2004 (lado B), que convém com barco de muito arrasto do vento ou em mar duro.', F_MOB.pbo],
          ['Girar em volta ou ficar de capa', 'O desenho segue o quick-stop descrito pelo US Sailing (2016, Safety at Sea, caso Trisha): depois do cambar o barco continua girando, arriba até o vento quase pela popa, passa abaixo da pessoa, jaiba e volta em bolina folgada. O simpósio de 2005 registra barcos que ficaram em capa logo acima da pessoa antes de lançar o cabo; essa pausa em capa não está no desenho.', F_MOB.qs],
          ['Arriar as velas ou não', 'O Safety at Sea do US Sailing desaconselha arriar todas as velas antes de voltar, porque o tempo gasto afasta o barco: arriar só a genoa, quando a tripulação é completa, e circular com a grande, ainda caçada. Já as vítimas do simpósio de 2005 pediram que a genoa fosse arriada ou enrolada antes da aproximação final, para as escotas soltas não machucarem.', F_MOB.sas],
          ['Motor ou só vela', 'O US Sailing (2016) descreve o quick-stop “só sob vela, a menos que não haja vento para manobrar”. Já o Safety at Sea (versão 7.1) diz para não hesitar em usar o motor, que hoje é mais confiável, e treinar também sem ele, caso falhe. Em qualquer caso: ponto morto até as linhas estarem livres, e com o cabo do Lifesling na água o motor pede ainda mais cuidado.', F_MOB.sas],
          ['Como fazer o contato', 'O US Sailing recomenda conectar a pessoa por um cabo ou Lifesling (circular em volta dela com o cabo se arrastando, a pelo menos meio comprimento de barco; última etapa do desenho), e desaconselha trazê-la ao costado. O RYA, descrito pela Practical Boat Owner, para ao lado da pessoa para alcançá-la com um croque ou cabo.', F_MOB.uss2020],
        ],
        trajeto: {
          ini: { x: 84, y: 125, h: 90, v: 6.0 }, queda: 1, deriva: DERIVA_MOB,
          segs: [
            { h: 90, d: 56, v: 6.0 },                       /* 1 queda: o barco ainda avança alguns segundos */
            { h: 48, d: 43.4, v: 5.0 },                     /* 2 orçar até a bolina cerrada */
            { h: -48, d: 51.2, v: 2.8, lee: 1.3 },          /* 3 cambar, genoa a contravento */
            { h: -155, d: 110.3, v: 3.2, lee: 3.7 },        /* 4 continuar girando até o vento quase pela popa */
            { h: -169.1, d: 98.3, v: 3.6, lee: 4 },         /* 5 descer e passar a sotavento da pessoa */
            { h: -238.3, d: 30.9, v: 3.4, lee: 3 },         /* 6 jaibar */
            { h: -299.6, d: 35.3, v: 2.6, lee: 2 },         /* 7 orçar até a bolina folgada, apontar para a pessoa */
            { h: -299.6, d: 58.1, v: 0.6, lee: 1 },         /* 8 parar ao lado */
            { h: -299.6, d: 0.01, v: 0.6 },                 /* 9 alternativa com Lifesling (o barco fica onde parou) */
          ],
        },
        kfs: [
          Q(46, 42, { pv: 0, bv: 0, mk: 0, gs: 1, ab: 0 }),
          Q(46, 42, { pv: 1, bv: 1, mk: 1 }),
          Q(14, 12),
          Q(-14, 12, { ab: 1, fl: 0.45 }),
          Q(-14, 12, { ab: 1, fl: 0.25 }),
          Q(-14, 12, { ab: 1, fl: 0.1, gs: 0 }),
          Q(14, 12, { ab: 0, fl: 0.1 }),
          Q(30, 12, { fl: 0.05 }),
          Q(46, 12, { fl: 0.85 }),
          Q(46, 12, { fl: 0.85, rg: 1, lc: 1 }),
        ],
        passos: [
          { t: 'Homem ao mar!', vozes: [['Quem viu', 'Homem ao mar, a boreste!', 'Man overboard, starboard side!'], [VOZ_COMANDANTE, 'Ouvido! Apontem a pessoa!']],
            txt: 'No mesmo instante: gritar o aviso e o lado, apontar para a pessoa, lançar o salva-vidas e o poste de marcação, e marcar o ponto no GPS. O barco ainda avança alguns segundos no mesmo rumo, enquanto cada um faz a sua parte; a pessoa e a boia já começam a derivar para sotavento.',
            tarefas: TAR_MOB_1 },
          { t: 'Orçar logo e caçar para a bolina cerrada', vozes: [[VOZ_COMANDANTE, 'Orçando! Caça para a bolina cerrada!']],
            txt: 'Sem esperar as outras tarefas terminarem, o timoneiro orça e as escotas são caçadas até a bolina cerrada. O US Sailing define o quick-stop como a redução imediata da velocidade do barco virando para o lado do vento (barlavento): é orçar logo que mantém o barco perto da pessoa. Quem aponta continua apontando.',
            tarefas: [['Timoneiro', 'Orçar sem demora, até a bolina cerrada.'], ['Tripulantes das escotas', 'Caçar a genoa e a grande para a bolina cerrada.'], ['Quem aponta', 'Não perder a pessoa de vista nem baixar o braço.']] },
          { t: 'Cambar sem soltar a escota da genoa', vozes: [[VOZ_COMANDANTE, 'Cambando! Não solta a genoa!']], snap: ['b', 'ab'], sn: 0.5,
            txt: 'O barco cambia por davante sem mexer nas escotas (Safety at Sea, US Sailing): a genoa fica a contravento (aquartelada, empurrada pelo vento contra o mastro) e freia o barco, que segue girando devagar em vez de se afastar. O motor pode ser ligado, mas fica em ponto morto até haver certeza de que não há cabo na água. Se o barco tem Lifesling, é agora que ele vai à água: o cabo flutuante (em amarelo no desenho) passa a ser arrastado atrás do barco.',
            tarefas: [['Timoneiro', 'Cambar e seguir girando; a grande passa sozinha para o outro bordo.'], ['Tripulante da genoa', 'Não soltar a escota da genoa.'], ['Tripulante livre', 'Lançar o Lifesling, se houver. Ligar o motor só em ponto morto, se for usá-lo.']] },
          { t: 'Continuar girando até o vento quase pela popa', vozes: [[VOZ_COMANDANTE, 'Arribando! Segurem as escotas!']],
            txt: 'O timoneiro continua a virar no mesmo sentido, arribando, sem folgar as velas, até ter o vento quase pela popa (US Sailing, quick-stop de 2016). A genoa segue a contravento e a grande, caçada, mantém o barco sob controle. O barco anda devagar e a pessoa fica para o lado de bombordo.',
            tarefas: [['Timoneiro', 'Seguir arribando, sem pressa, até o vento ficar quase pela popa.'], ['Tripulantes das escotas', 'Manter as escotas como estão, sem folgar.'], ['Quem aponta', 'Informar a direção e a distância da pessoa.']] },
          { t: 'Passar a sotavento da pessoa', vozes: [[VOZ_COMANDANTE, 'Genoa abaixo! Preparar para jaibe!']], snap: ['gs'], sn: 0.62,
            txt: 'O barco desce com o vento quase pela popa e passa a sotavento da pessoa, abaixo dela no desenho (US Sailing, caso Trisha, 2004: arribar e passar abaixo da pessoa). Quando a pessoa fica atrás do través, a genoa é arriada ou enrolada (US Sailing, 2016). O Safety at Sea só aconselha isso com tripulação completa e sem perder tempo: arriar velas leva o barco para longe.',
            tarefas: [['Timoneiro', 'Passar abaixo da pessoa e se preparar para o jaibe.'], ['Tripulante da genoa', 'Arriar ou enrolar a genoa quando a pessoa passar do través para trás, se a tripulação for completa.'], ['Tripulante da grande', 'Manter a escota caçada: a retranca fica perto do centro e cruza curto e devagar.']] },
          { t: 'Jaibar', vozes: [[VOZ_COMANDANTE, 'Jaibando!', 'Gybe-oh!']], snap: ['b'], sn: 0.16,
            txt: 'Com a pessoa atrás do través, o timoneiro jaiba (US Sailing, 2016): a popa passa pelo vento e a retranca cruza o barco. Como a grande não foi folgada, ela passa perto do centro, curta e sob controle. Logo depois do jaibe o timoneiro já começa a orçar.',
            tarefas: [['Timoneiro', 'Jaibar com aviso e começar a orçar logo em seguida.'], ['Tripulante da grande', 'Acompanhar a escota com as mãos; folgar aos poucos depois que a retranca cruzar.'], ['Todos', 'Cabeça baixa e fora do arco da retranca.']],
            seg: 'A retranca em movimento é perigosa: ninguém fica no arco dela durante o jaibe.' },
          { t: 'Orçar até a bolina folgada e apontar para a pessoa', vozes: [[VOZ_COMANDANTE, 'Orçando! Apontando para a pessoa!']],
            txt: 'Depois do jaibe o barco orça até a bolina folgada, o rumo da aproximação final (Isler, US Sailing: “de longe o rumo mais seguro”; simpósio de 2005: as manobras costumam terminar em bolina folgada, a baixa velocidade). O US Sailing manda governar na direção da pessoa “como se fosse pegar uma boia de amarração”, e prepara o contato: cabo, boia com retinida ou Lifesling.',
            tarefas: [['Timoneiro', 'Orçar até a bolina folgada, apontar para a pessoa como para uma boia de amarração e controlar a velocidade com as escotas.'], ['Quem aponta', 'Informar direção e distância até o fim.'], ['Tripulação', 'Preparar o cabo de arremesso, a boia com retinida ou o Lifesling.']] },
          { t: 'Parar ao lado da pessoa', vozes: [[VOZ_COMANDANTE, 'Folga! Parando ao lado!']],
            txt: 'O barco chega devagar e para ao lado da pessoa, folgando as velas até panejarem ou dando-as atrás (US Sailing, 2016), com a pessoa do lado de barlavento do barco, como no desenho do US Sailing (caso Trisha, 2004); o curso recomenda terminar com a pessoa a sotavento (quadro “O que este curso recomenda”). O contato é por cabo, boia com retinida ou Lifesling, sem encostar o casco nela; na final, motor em ponto morto ou desligado. As fontes variam na velocidade de contato, de 1 a 3 nós, e o Safety at Sea pede para não arrastar a pessoa a mais de 1 nó. Depois de a pessoa estar presa ao barco, pare o barco e recolha: Lifesling com uma adriça, escada, rampa de popa ou talha; inconsciente, içar na horizontal; depois verifique sinais de hipotermia e peça ajuda médica, se for preciso. Um quick-stop bem executado leva de 60 a 120 s da queda até parar ao lado da pessoa (caso Trisha).',
            tarefas: [['Timoneiro', 'Parar o barco ao lado da pessoa, sem passar direto e sem encostar o casco; motor em ponto morto perto dela.'], ['Tripulação', 'Lançar o cabo ou o Lifesling, puxar a pessoa com cuidado e checar o estado dela.']],
            seg: 'Recolher a pessoa é a parte mais difícil. Em cinco dos oito casos do estudo do US Sailing em que o barco voltou e a pessoa morreu, foram necessárias várias passadas para o contato, e em alguns o casco atingiu a pessoa. Treine o içamento com seu instrutor e sua tripulação, com a técnica que o seu barco permite.' },
          { t: 'Com Lifesling: circular a pessoa até o cabo cruzá-la', vozes: [],
            txt: 'Com Lifesling, o Safety at Sea ensina a conectar a pessoa circulando em volta dela, a pelo menos meio comprimento de barco, para não bater o casco nela: o cabo flutuante vai arrastando atrás do barco e a volta continua até o cabo passar por ela, que o agarra. No desenho o círculo tracejado tem raio de cerca de três quartos de comprimento (do centro do barco), e o cabo tem 36 m, o mínimo previsto nas regras especiais de oceano da World Sailing (item 4.22) para um barco de 32 pés (World Sailing; confira o valor para o comprimento do seu barco). O barco fica onde parou: só o círculo e o cabo aparecem, porque esta etapa é a alternativa à anterior e não uma etapa a mais. Sob vela, um círculo completo em torno da pessoa obriga a passar pelo vento (cambar) e pela popa (jaibe), como o giro das etapas 3 a 6. Depois do contato, pare o barco (sem arrastar a pessoa a mais de 1 nó) e recolha.',
            tarefas: [['Timoneiro', 'Circular a pessoa a pelo menos meio comprimento de barco, com motor em ponto morto ou desligado por causa do cabo na água.'], ['Tripulação', 'Deixar o cabo correr e, quando ele passar pela pessoa, ajudá-la a vestir ou agarrar o Lifesling; depois puxá-la com cuidado.']] },
        ],
        quiz: QUIZ_MOB_RAPIDA,
      },
      {
        id: 'oito', rot: 'Manobra do oito', en: 'figure-of-eight',
        vb: [52, 24, 330, 162], marca: MARCA_MOB, escala: [334, 176, 'esq'],
        regua: { x: 140, y: 100, n: 4 },
        diagLados: 'oito',
        inicio: 'Navegando em través, com vento por bombordo (vindo do alto da figura). Uma pessoa cai pelo lado de boreste, o de sotavento. O barco se afasta em través por alguns comprimentos, orça e cambia, arriba até cruzar a própria esteira de ida e passar a sotavento dela, e volta em bolina folgada até parar com a pessoa a sotavento do barco (versão do RYA). A pessoa e a boia derivam devagar para sotavento (para baixo).',
        variacoes: [
          ['Quantos comprimentos de afastamento', 'O desenho usa 4 comprimentos (a régua conta desde a queda); a 4 ou 5 nós, os 20 segundos citados correspondem a uns 4 a 5 comprimentos de um barco de 32 pés (cerca de 40 a 50 m); num barco maior, são menos comprimentos. O simpósio do US Sailing de 2005 descreve o Figure 8 com cerca de 5, o Fast Return com cerca de 2,5 e o Deep Beam Reach com 2. Quanto mais curto, mais perto fica a pessoa, mas a tripulação tem menos tempo para se preparar. Um dos autores do relatório prefere medir o afastamento em tempo (por exemplo, 20 segundos), porque estimar comprimentos sob estresse é difícil.', F_MOB.sim],
          ['Cambar primeiro ou arribar', 'O Safety at Sea do US Sailing observa que quem cambia logo no início do oito fica mais perto da pessoa do que quem apenas arriba, e que a Marinha dos EUA (Navy) adota o cambar primeiro como protocolo. A Practical Boat Owner descreve o oito do RYA com capa e arriamento da genoa antes de se afastar alguns comprimentos; o desenho arria a genoa durante o afastamento, sem parar o barco.', F_MOB.sas],
          ['Pessoa a sotavento ou a barlavento', 'O desenho do oito termina como o RYA (via Practical Boat Owner): o barco a barlavento da pessoa, que fica do lado de sotavento, e o casco faz abrigo, de modo que o barco deriva devagar para ela e não para longe. O simpósio de 2005 registra a preferência quase unânime pelo barco a barlavento da pessoa. O quick-stop do RORC e o texto do US Sailing de 2004 usam o outro lado, a pessoa a barlavento do barco (é o que mostra o desenho da parada rápida). Em mar duro, o barco a barlavento pode ser jogado sobre a pessoa. O esquema no alto deste quadro mostra os dois lados. Recomendação do curso: este é o lado que o curso recomenda (A do esquema).', F_MOB.pbo],
          ['Velocidade de contato', 'Não há consenso numérico: as pessoas que fizeram a vítima no simpósio de 2005 aceitaram de 2 a 3 nós, mas a regra da Academia Naval dos EUA é 1 nó. O Safety at Sea pede para não arrastar a pessoa a mais de 1 nó, e o relatório do simpósio lembra que o olhar do timoneiro é para a pessoa, não para o velocímetro.', F_MOB.sim],
          ['Como fazer o contato', 'O RYA, descrito pela Practical Boat Owner, para ao lado da pessoa, com croque ou cabo. O US Sailing recomenda conectar a pessoa por cabo ou Lifesling, a certa distância, para não atingi-la com o casco.', F_MOB.uss2020],
        ],
        trajeto: {
          ini: { x: 84, y: 125, h: 90, v: 6.0 }, queda: 1, deriva: DERIVA_MOB,
          segs: [
            { h: 90, d: 56, v: 6.0 },                       /* 1 queda */
            { h: 90, d: 178.6, v: 4.5 },                    /* 2 afastar-se em través (4 comprimentos) */
            { h: -48, d: 72, v: 3.0, lee: 1.5 },            /* 3 orçar e cambar */
            { h: -126.3, d: 53.8, v: 3.2, lee: 2 },         /* 4 arribar até o largo */
            { h: -153.9, d: 74.9, v: 3.8, lee: 4 },         /* 5 descer, cruzar a esteira de ida, passar a sotavento */
            { h: -60.2, d: 57.3, v: 3.2, lee: 1.5 },        /* 6 orçar até a bolina folgada, apontar para a pessoa */
            { h: -60.2, d: 24.6, v: 2.0, lee: 1 },          /* 7 aproximar controlando a velocidade com a escota */
            { h: -60.2, d: 20.8, v: 0.6, lee: 1 },          /* 8 parar ao lado, pessoa a sotavento */
          ],
        },
        kfs: [
          Q(46, 42, { pv: 0, bv: 0, mk: 0, gs: 1, ab: 0 }),
          Q(46, 42, { pv: 1, bv: 1, mk: 1 }),
          Q(30, 28, { gs: 0 }),
          Q(-14, 28, { fl: 0.5 }),
          Q(-48, 28, { fl: 0.15 }),
          Q(-62, 28, { fl: 0.1 }),
          Q(-30, 28, { fl: 0 }),
          Q(-22, 28, { fl: 0 }),
          Q(-46, 28, { fl: 0.85 }),
        ],
        passos: [
          { t: 'Homem ao mar!', vozes: [['Quem viu', 'Homem ao mar, a boreste!', 'Man overboard, starboard side!'], [VOZ_COMANDANTE, 'Ouvido! Apontem a pessoa!']],
            txt: 'No mesmo instante: gritar o aviso e o lado, apontar para a pessoa, lançar o salva-vidas e o poste de marcação, e marcar o ponto no GPS. O barco segue no mesmo rumo, de través, enquanto cada um faz a sua parte; a pessoa e a boia já começam a derivar para sotavento.',
            tarefas: TAR_MOB_1 },
          { t: 'Afastar-se de través por 2 a 5 comprimentos', vozes: [[VOZ_COMANDANTE, 'Seguindo em través! Caça a grande, arria a genoa!']],
            txt: 'O barco segue em través, em linha reta, com a grande caçada e a genoa arriada ou enrolada (o RYA, segundo a Practical Boat Owner: caçar a grande, baixar ou enrolar a genoa e se afastar alguns comprimentos). A régua do desenho conta os comprimentos desde a queda e o barco vira em 4; as fontes vão de 2 (Deep Beam Reach) a 5 (Figure 8) no simpósio de 2005, ou cerca de 20 s se preferir medir em tempo (a 4 ou 5 nós, uns 4 a 5 comprimentos). A distância dá tempo de preparar a volta, mas afasta o barco da pessoa. Quem aponta continua apontando.',
            tarefas: [['Timoneiro', 'Manter o través em linha reta, contando comprimentos ou segundos.'], ['Tripulante da genoa', 'Arriar ou enrolar a genoa.'], ['Tripulante da grande', 'Caçar a escota da grande.'], ['Navegador', 'Acompanhar o GPS e se preparar para chamar socorro.']] },
          { t: 'Orçar e cambar', vozes: [[VOZ_COMANDANTE, 'Preparar para cambar!', 'Ready about?'], [VOZ_COMANDANTE, 'Cambando!', 'Lee-oh!']], snap: ['b'], sn: 0.65,
            txt: 'No ponto escolhido o timoneiro orça até a bolina cerrada e cambia por davante, como num cambar comum (no simpósio de 2005, o Figure 8 cambia depois de cerca de 5 comprimentos). Sem a genoa içada, só a grande passa para o outro bordo. O vento passa a entrar por boreste e o barco fica acima (a barlavento) da linha de ida.',
            tarefas: [['Timoneiro', 'Orçar até a bolina cerrada e cambiar.'], ['Tripulante da grande', 'Cabeça baixa: a retranca cruza sozinha, perto do centro.'], ['Quem aponta', 'Seguir apontando.']] },
          { t: 'Arribar até o largo', vozes: [[VOZ_COMANDANTE, 'Arribando! Folga a grande!']],
            txt: 'Passado o cambar, o timoneiro arriba, sem pressa, até um rumo de largo (vento pela alheta), e a grande vai sendo folgada conforme o barco arriba. O barco ainda está acima da pessoa e vai descer para sotavento.',
            tarefas: [['Timoneiro', 'Arribar até o largo, sem exagero.'], ['Tripulante da grande', 'Folgar a escota aos poucos, conforme o barco arriba.']] },
          { t: 'Descer para sotavento e cruzar a esteira de ida', vozes: [],
            txt: 'O barco desce para sotavento, com o vento pela alheta, e cruza a própria esteira de ida: é por esse cruzamento que o percurso lembra um oito. Ele segue um pouco além, para ficar a sotavento da esteira antes de voltar. Quem aponta continua indicando direção e distância.',
            tarefas: [['Timoneiro', 'Seguir o rumo de largo, cruzar a esteira de ida e ficar a sotavento dela, preparando a volta.'], ['Quem aponta', 'Informar direção e distância.']] },
          { t: 'Orçar até a bolina folgada e apontar para a pessoa', vozes: [[VOZ_COMANDANTE, 'Orçando! Preparar para recolher!']],
            txt: 'Já a sotavento da esteira de ida, o barco orça até a bolina folgada e aponta para um ponto um pouco acima da pessoa, para chegar a barlavento dela: é a aproximação do RYA (via Practical Boat Owner), em que o barco faz abrigo do vento e deriva devagar na direção da pessoa, em vez de se afastar. Em mar duro, porém, o barco a barlavento pode ser jogado sobre a pessoa (simpósio de 2005).',
            tarefas: [['Timoneiro', 'Orçar até a bolina folgada e apontar para a barlavento da pessoa.'], ['Tripulação', 'Preparar o cabo de arremesso, a boia com retinida ou o Lifesling.']] },
          { t: 'Controlar a velocidade com a escota', vozes: [],
            txt: 'Em bolina folgada o timoneiro acelera caçando a escota da grande e freia folgando-a, deixando a vela panejar (RYA, via Practical Boat Owner). A genoa já está arriada: as escotas soltas não machucam a pessoa (simpósio de 2005). Motor, se usado, em ponto morto ou desligado.',
            tarefas: [['Timoneiro', 'Aproximar devagar, olhando a pessoa e não o velocímetro, e dosar a escota.'], ['Quem aponta', 'Informar direção e distância.']] },
          { t: 'Parar ao lado, com a pessoa a sotavento', vozes: [[VOZ_COMANDANTE, 'Folga! Parando ao lado!']],
            txt: 'O barco para ao lado da pessoa, que fica do lado de sotavento do barco (RYA): o casco faz abrigo e, ao parar, o barco tende a ir na direção dela e não para longe. As velas panejam, o que ajuda a parar. Motor em ponto morto ou desligado (cuidado com a hélice). Faça o contato com cabo, boia com retinida ou Lifesling, sem encostar o casco, e traga a pessoa a bordo com o equipamento do seu barco, na horizontal se estiver inconsciente. Depois, checar hipotermia e outros ferimentos.',
            tarefas: [['Timoneiro', 'Parar com a pessoa a sotavento, ao alcance, sem passar direto.'], ['Tripulação', 'Lançar o cabo ou o Lifesling e puxar a pessoa com cuidado; depois, checar o estado dela.']],
            seg: 'Aproximação e içamento variam com o barco e o mar: treine a manobra com seu instrutor e sua tripulação. No estudo do US Sailing de 2020, passar rápido demais pela pessoa e várias passadas para o contato estão entre os erros que pioraram o resultado.' },
        ],
        quiz: QUIZ_MOB_OITO,
      },
    ],
  };

  /* ---- fundear ---- */
  MAN.fundear = {
    id: 'fundear', rot: 'Fundear', en: 'anchoring', tipo: 'planta', s: 0.34, vb: [0, 0, 400, 440], semVelas: true,
    ancora: { x: 200, y: 190, raio: 148 },
    quando: 'Deixar o barco seguro no fundo, preso pela âncora, para dormir, almoçar ou nadar. Uma boa escolha do local e do filame é metade do trabalho.',
    fonte: 'Orientação geral de seamanship. Relações de filame e tamanho da âncora variam com o fundo, a âncora e o tempo. Luz e marca de fundeio: RIPEAM, Regra 30.',
    selo: true,
    variantes: [{
      id: 'normal', rot: 'Fundear',
      inicio: 'Chegando ao fundeadouro com as velas recolhidas e o motor ligado. O vento sopra da terra para o mar.',
      kfs: [
        K(200, 415, 0, 0, 0, { v: 3.0, mk: 0, sr: 0, av: 0, ca: 0, ck: 0 }),
        K(200, 415, 0, 0, 0, { v: 0, mk: 1, sr: 0.5 }),
        K(200, 212, 0, 0, 0, { v: 1.5, mk: 1, sr: 0.5 }),
        K(200, 212, 0, 0, 0, { v: 0, av: 1, ca: 1 }),
        K(200, 324, 0, 0, 0, { v: -0.8, sr: 1, mk: 0 }),
        K(200, 329, 0, 0, 0, { v: 0, ck: 1 }),
      ],
      passos: [
        { t: 'Escolher o local', vozes: [[VOZ_COMANDANTE, 'Vamos fundear aqui: boa profundidade, abrigo e espaço para girar.']],
          txt: 'Procure, na carta, um local abrigado do vento e das ondas, com fundo de areia ou lama (onde a âncora pega bem, ou "tem boa tença"), profundidade suficiente mesmo na baixa-mar e espaço para o barco girar à vontade em volta da âncora. Veja o raio do círculo de giro (borneio): o barco gira conforme o vento e a corrente. Fique longe de outros barcos, de cabos submarinos, de pedras e de áreas proibidas.',
          tarefas: [['Comandante/navegador', 'Estudar a carta (profundidade na baixa-mar, natureza do fundo, perigos, áreas proibidas) e marcar o ponto de fundeio. Conferir a previsão de vento e de maré.'], ['Vigia', 'Olhar a volta: outros barcos fundeados, boias, cabos e redes de pesca.']] },
        { t: 'Aproximar contra o vento', vozes: [[VOZ_COMANDANTE, 'Aproximando, devagar. Proa ao vento.']],
          txt: 'Aproxime-se do ponto de fundeio com a proa contra o vento (ou contra a corrente, se ela for mais forte), devagar e pelo rumo reto. Olhe a sonda: confira a profundidade. Velocidade baixa dá controle e deixa o barco parar sobre o ponto.',
          tarefas: [['Timoneiro', 'Aproximar com a proa contra o vento, em marcha lenta, e parar o barco sobre o ponto.'], ['Tripulante da proa', 'Preparar a âncora e o cabo ou a corrente, soltando o que prende a âncora no rolo da proa.'], ['Navegador', 'Cantar a profundidade e a distância até o ponto.']] },
        { t: 'Parar e arriar a âncora', vozes: [['Tripulante da proa', 'Arriando a âncora!'], [VOZ_COMANDANTE, 'Âncora no fundo?'], ['Tripulante da proa', 'No fundo!']],
          txt: 'Com o barco parado sobre o ponto, arria-se a âncora (sem lançar de forma brusca) até tocar o fundo. O cabo ou a corrente vai descendo sem enroscar. Só depois que a âncora toca o fundo o barco começa a andar de ré.',
          tarefas: [['Tripulante da proa', 'Arriar a âncora com a mão ou pelo molinete até o fundo e avisar. Cuidado com os dedos e o pé.'], ['Timoneiro', 'Manter o barco parado e a proa contra o vento.']] },
        { t: 'Dar ré e filar', vozes: [['Tripulante da proa', 'Filame na marca! (conte as marcas do cabo)', 'Scope marked!']],
          txt: 'O barco anda devagar de ré, e a âncora vai ficando para trás enquanto se larga o filame (o cabo ou a corrente), até a quantidade planejada. Uma regra prática é largar de 5 a 7 vezes a profundidade (medida da proa até o fundo). O cabo deve ficar esticado, sem se enrolar na âncora. Veja a calculadora de filame abaixo.',
          tarefas: [['Tripulante da proa', 'Largar o filame aos poucos, contando as marcas do cabo, e travar o molinete na marca certa.'], ['Timoneiro', 'Dar ré devagar, em linha reta.']] },
        { t: 'Cravar e conferir', vozes: [[VOZ_COMANDANTE, 'Ré a meia força para cravar!'], ['Navegador', 'Marcações firmes, não garrou.']],
          txt: 'Com o filame travado, dê ré a meia força para a âncora cravar, sentindo o cabo esticar e o barco parar. Depois confira se não está garrando (arrastando): olhe duas marcações em terra, em direções bem diferentes. Se a posição mudar, a âncora está garrando. Ligue o alarme de fundeio do GPS e, à noite, acenda a luz de fundeio.',
          tarefas: [['Navegador', 'Escolher duas marcações em terra, em direções diferentes, e conferir. Ligar o alarme de fundeio do GPS.'], ['Tripulação', 'Acender a luz de fundeio à noite, ou içar a marca de dia, se o barco precisar.']],
          regra: 'RIPEAM, Regra 30: embarcações fundeadas mostram à noite uma luz branca visível em todo o horizonte e de dia uma bola preta na proa; embarcações com menos de 7 m ficam dispensadas, salvo perto de canais, fundeadouros ou onde outras embarcações navegam.' },
      ],
      quiz: QUIZ_FUNDEAR,
    }],
  };

  var ORDEM_MAN = ['cambar', 'jaibe', 'capear', 'rizar', 'mob', 'fundear'];

  /* ------------------------------------------------------------------ barco (vista de cima) */
  var CASCO = 'M0,-64 C15,-48 22,-20 22,8 L20,56 Q0,60 -20,56 L-22,8 C-22,-20 -15,-48 0,-64 Z';
  function criarBarco(esc, semVelas) {
    var g = S('g', { class: 'man-barco' });
    var casco = S('path', { class: 'man-casco', d: CASCO });
    var cockpit = S('path', { class: 'man-cockpit', d: 'M-10,24 L10,24 L11,50 L-11,50 Z' });
    var cabine = S('path', { class: 'man-cabine', d: 'M-12,-26 Q0,-34 12,-26 L13,22 L-13,22 Z' });
    var genoa = S('path', { class: 'man-vela man-genoa' });
    var grande = S('path', { class: 'man-vela man-grande' });
    var retranca = S('line', { class: 'man-retranca' });
    var mastro = S('circle', { r: 3.2, cx: 0, cy: -16, class: 'man-mastro' });
    var proa = S('circle', { r: 3.4, cx: 0, cy: -64, class: 'man-proa' });
    var perigo = S('path', { class: 'man-arco-perigo' });
    [casco, cabine, cockpit, perigo, genoa, retranca, grande, mastro, proa].forEach(function (n) { g.appendChild(n); });
    if (semVelas) { genoa.style.display = 'none'; grande.style.display = 'none'; retranca.style.display = 'none'; perigo.style.display = 'none'; }
    function curva(x0, y0, x1, y1, fx, fy, bul, fl, fase) {
      var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      if (nx * fx + ny * fy < 0) { nx = -nx; ny = -ny; }
      var n = 20, d = '', i, t, off, mx, my;
      for (i = 0; i <= n; i++) {
        t = i / n;
        off = bul * len * 4 * t * (1 - t) * (1 - fl);
        if (fl > 0.02) off += fl * (4 + 0.12 * len) * Math.sin(t * 9.4 + fase) * Math.sin(Math.PI * t);
        mx = x0 + dx * t + nx * off; my = y0 + dy * t + ny * off;
        d += (i ? 'L' : 'M') + r1(mx) + ',' + r1(my);
      }
      return d;
    }
    function set(e, fase) {
      g.setAttribute('transform', 'translate(' + r1(e.x) + ',' + r1(e.y) + ') rotate(' + r1(e.h) + ') scale(' + esc + ')');
      if (semVelas) return;
      var hr = e.h * D2R, fx = Math.sin(hr), fy = Math.cos(hr), fl = clamp(e.fl || 0, 0, 1);
      var br = (e.b || 0) * D2R, gr = (e.g || 0) * D2R;
      var mx = 0, my = -16, ex = mx + 50 * Math.sin(br), ey = my + 50 * Math.cos(br);
      retranca.setAttribute('x1', mx); retranca.setAttribute('y1', my); retranca.setAttribute('x2', r1(ex)); retranca.setAttribute('y2', r1(ey));
      grande.setAttribute('d', curva(mx, my, ex, ey, fx, fy, 0.17, fl, fase));
      /* gs: tamanho da genoa (1 = içada, 0 = arriada ou enrolada); ab: genoa a contravento (a barriga vira para ré) */
      var gs = e.gs == null ? 1 : clamp(e.gs, 0, 1), ab = clamp(e.ab || 0, 0, 1);
      genoa.style.display = gs < 0.04 ? 'none' : '';
      var tx = 0, ty = -58, cx = tx + 62 * gs * Math.sin(gr), cy = ty + 62 * gs * Math.cos(gr);
      genoa.setAttribute('d', curva(tx, ty, cx, cy, fx, fy, 0.14 * (1 - 2 * ab), fl * 0.9, fase * 1.3 + 1));
      var pg = e.pg || 0;
      if (pg > 0.05) {
        var a0 = 70 * D2R, rr = 54, x1 = mx + rr * Math.sin(a0), y1 = my + rr * Math.cos(a0), x2 = mx - rr * Math.sin(a0), y2 = my + rr * Math.cos(a0);
        perigo.setAttribute('d', 'M' + mx + ',' + my + ' L' + r1(x1) + ',' + r1(y1) + ' A' + rr + ',' + rr + ' 0 0 1 ' + r1(x2) + ',' + r1(y2) + ' Z');
        perigo.style.opacity = String(clamp(pg, 0, 1));
      } else perigo.style.opacity = '0';
    }
    return { g: g, set: set };
  }

  /* ------------------------------------------------------------------ widget */
  VL.widgets.define('manobras', {
    css: ['assets/css/widgets/manobras.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [];
      // nomes alternativos aceitos nas lições e no glossário
      var ALIAS_MAN = { 'homem-ao-mar': 'mob', 'homem_ao_mar': 'mob', 'mdo': 'mob', 'tack': 'cambar', 'cambar-por-davante': 'cambar', 'cambar-em-roda': 'jaibe' };
      var manIni = ALIAS_MAN[opts.manobra] || opts.manobra;
      var st = {
        man: MAN[manIni] ? manIni : 'cambar',
        vi: 0, modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        p: 0, tocando: false, vel: 1, reduz: reduzMov(), visivel: true,
        passoMostrado: -1, subDes: 'ordenar',
      };
      function manAtual() { return MAN[st.man]; }
      function varAtual() { return manAtual().variantes[st.vi]; }
      (function () {
        var v = manAtual().variantes, i;
        if (opts.variante != null) for (i = 0; i < v.length; i++) if (v[i].id === String(opts.variante)) st.vi = i;
      })();

      var DUR = 3.4, HOLD = 1.8;
      var raf = 0, ultimo = 0, hold = 0, fase = 0;

      /* ---------- esqueleto ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Manobras de um veleiro de cruzeiro, passo a passo' });
      el.appendChild(ins.raiz);
      ins.raiz.classList.add('man-raiz');

      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], 'aria-pressed': String(st.modo === m[0]), onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      ins.controles.appendChild(segModo);
      ins.legenda.appendChild(h('span', { class: 'man-fonte' }, 'Orientação fundamentada nas fontes citadas no quadro do widget, não norma. Cada barco, tripulação e condição de mar pede ajustes: treine a manobra com seu instrutor e sua tripulação antes de usar no mar.'));

      var seletorBox = h('div', { class: 'man-seletor' });
      var chips = h('div', { class: 'man-chips', role: 'group', 'aria-label': 'Escolha a manobra' });
      ORDEM_MAN.forEach(function (id) {
        chips.appendChild(h('button', { type: 'button', class: 'chip man-chip', 'data-man': id, 'aria-pressed': String(id === st.man), onclick: function () { trocarManobra(id); } }, MAN[id].rot));
      });
      var variantesBox = h('div', { class: 'man-variantes' });
      if (opts.seletor !== false) { seletorBox.appendChild(chips); seletorBox.appendChild(variantesBox); }
      ins.corpo.appendChild(seletorBox);

      var grade = h('div', { class: 'man-grade' });
      var colCena = h('div', { class: 'man-col-cena' });
      var lado = h('div', { class: 'man-lado' });
      grade.appendChild(colCena); grade.appendChild(lado);
      ins.corpo.appendChild(grade);

      var svgBox = h('div', { class: 'man-cena-wrap' });
      var svg = S('svg', { class: 'man-cena', viewBox: '0 0 400 440', role: 'img', 'aria-label': 'Animação da manobra, vista de cima' });
      svgBox.appendChild(svg);
      var leit = h('p', { class: 'man-leitura', 'aria-live': 'polite' });
      colCena.appendChild(svgBox);
      colCena.appendChild(leit);

      /* transporte */
      var btnIni = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { pausar(); irPara(0); } }, 'Recomeçar');
      var btnAnt = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { pausar(); var q = Math.ceil(st.p - 1e-6) - 1; irPara(Math.max(0, q)); } }, 'Anterior');
      var btnTocar = h('button', { type: 'button', class: 'btn btn-primary man-tocar', onclick: function () { alternar(); } }, 'Tocar');
      var btnProx = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { pausar(); irPara(Math.floor(st.p + 1e-6) + 1); } }, 'Próxima');
      var linhaBtns = h('div', { class: 'man-linha man-transp' }, btnIni, btnAnt, btnTocar, btnProx);
      var rng = h('input', { type: 'range', min: '0', max: '100', step: '1', value: '0', class: 'man-rng', 'aria-label': 'Linha do tempo da manobra', oninput: function () { pausar(); st.p = (Number(rng.value) / 100); atualizar(); } });
      var segVel = h('div', { class: 'segmented man-vel', role: 'group', 'aria-label': 'Velocidade da animação' });
      [[0.5, '0,5×'], [1, '1×'], [2, '2×']].forEach(function (v) {
        segVel.appendChild(h('button', { type: 'button', 'data-v': String(v[0]), 'aria-pressed': String(v[0] === 1), onclick: function () { st.vel = v[0]; VL.$$('button', segVel).forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-v')) === st.vel)); }); } }, v[1]));
      });
      var linhaRng = h('div', { class: 'man-linha man-linha-rng' }, rng, segVel);
      colCena.appendChild(linhaBtns);
      colCena.appendChild(linhaRng);

      /* ---------- compilação por manobra/variante ---------- */
      function compilar() {
        var v = varAtual();
        if (!v._k) {
          var kfs = v.kfs;
          if (v.trajeto) {
            var tj = compilarTrajeto(v.trajeto, escDe(manAtual(), v)), tq = tj.ks[v.trajeto.queda].t, dv = v.trajeto.deriva;
            v._tj = tj;
            kfs = v.kfs.map(function (kf, i) {
              var o = Object.assign({}, kf, { x: tj.ks[i].x, y: tj.ks[i].y, h: tj.ks[i].h, v: tj.ks[i].v });
              if (dv) {
                var dd = Math.max(0, tj.ks[i].t - tq) * dv.vel * tj.kn;
                o.px = dv.pessoa[0]; o.py = dv.pessoa[1] + dd; o.bx = dv.boia[0]; o.by = dv.boia[1] + dd;
              }
              return o;
            });
          }
          v._k = normalizar(kfs);
        }
        return v._k;
      }
      function posU(k, u) { var tj = varAtual()._tj; return tj ? posRota(tj, u) : posEm(k, u); }
      function nPassos() { return varAtual().passos.length; }

      /* ---------- cena ---------- */
      var cena = null;
      /* o quadro (vb) e a escala do barco (s) podem ser da variante: o quick-stop e o oito ocupam áreas bem diferentes */
      function vbDe(m, v) { return (v && v.vb) || m.vb || [0, 0, 400, 440]; }
      function escDe(m, v) { return v && v.s != null ? v.s : m.s; }
      function montarCena() {
        vazio(svg);
        cena = { tipo: manAtual().tipo };
        var m = manAtual(), v = varAtual();
        var vb = vbDe(m, v);
        svg.setAttribute('viewBox', vb.join(' '));
        svg.style.aspectRatio = vb[2] + ' / ' + vb[3];
        svg.style.setProperty('--man-k', String(r1(vb[2] / 400 * 1000) / 1000));
        svg.appendChild(S('rect', { x: vb[0], y: vb[1], width: vb[2], height: vb[3], class: 'man-mar' }));
        if (m.tipo === 'planta') montarPlanta(m, v); else montarPerfil(m, v);
      }

      function seta(g, x, y, c) {
        g.appendChild(S('path', { d: 'M' + x + ',' + y + ' v26 m-5,-7 l5,7 l5,-7', class: c || 'man-linha-vento' }));
      }

      function montarPlanta(m, v) {
        var k = compilar();
        if (m.id === 'fundear') {
          var gT = S('g', { class: 'man-deco' });
          gT.appendChild(S('path', { class: 'man-terra', d: 'M0,0 L400,0 L400,38 Q360,52 330,48 Q290,34 250,40 Q210,50 160,46 Q110,36 80,40 Q40,48 0,44 Z' }));
          gT.appendChild(S('text', { x: 200, y: 22, class: 'man-rot-terra', 'text-anchor': 'middle' }, 'terra (abrigo)'));
          svg.appendChild(gT);
          var refs = [[70, 42, 'ref. 1'], [330, 48, 'ref. 2']];
          refs.forEach(function (r) {
            svg.appendChild(S('path', { class: 'man-ref', d: 'M' + r[0] + ',' + (r[1] - 6) + ' l5,10 h-10 z' }));
            svg.appendChild(S('text', { x: r[0], y: r[1] + 18, class: 'man-rot', 'text-anchor': 'middle' }, r[2]));
          });
          /* outro barco fundeado */
          var og = S('g', { class: 'man-outro', transform: 'translate(345,375) rotate(20) scale(0.34)' });
          og.appendChild(S('path', { class: 'man-casco', d: CASCO }));
          svg.appendChild(S('circle', { cx: 345, cy: 375, r: 50, class: 'man-giro-outro' }));
          svg.appendChild(og);
          svg.appendChild(S('text', { x: 345, y: 436, class: 'man-rot', 'text-anchor': 'middle' }, 'outro barco'));
        }
        var vbw = vbDe(m, v);
        var gVento = S('g', { class: 'man-vento', transform: 'translate(' + vbw[0] + ',' + vbw[1] + ') scale(' + r1(vbw[2] / 400 * 1000) / 1000 + ')' });
        var wy = m.id === 'fundear' ? 56 : 10;
        gVento.appendChild(S('line', { x1: 24, y1: wy, x2: 24, y2: wy + 40, class: 'man-vv' }));
        gVento.appendChild(S('polygon', { points: '16,' + (wy + 34) + ' 32,' + (wy + 34) + ' 24,' + (wy + 50), class: 'man-vv-ponta' }));
        gVento.appendChild(S('text', { x: 38, y: wy + 28, class: 'man-rot-vv' }, 'vento'));
        if (m.id !== 'fundear') [130, 230, 330].forEach(function (x) { seta(gVento, x, 10); });
        svg.appendChild(gVento);

        /* rota prevista */
        var N = k.length - 1, dp = '', u;
        for (u = 0; u <= N + 1e-9; u += 0.05) { var q = posU(k, Math.min(u, N)); dp += (u ? 'L' : 'M') + r1(q.x) + ',' + r1(q.y); }
        cena.prevista = S('path', { class: 'man-prevista', d: dp });
        cena.trilha = S('path', { class: 'man-trilha' });
        svg.appendChild(cena.prevista); svg.appendChild(cena.trilha);

        /* extras */
        var gE = S('g', { class: 'man-extras' });
        var a = m.ancora;
        cena.sr = a ? S('circle', { cx: a.x, cy: a.y, r: a.raio, class: 'man-giro' }) : null;
        if (cena.sr) gE.appendChild(cena.sr);
        cena.srRot = a ? S('text', { x: a.x, y: a.y + a.raio + 16, class: 'man-rot', 'text-anchor': 'middle' }, 'círculo de giro (borneio)') : null;
        if (cena.srRot) gE.appendChild(cena.srRot);
        cena.ck = [];
        if (m.id === 'fundear') for (var ci = 0; ci < 2; ci++) { var cl = S('line', { class: 'man-marcacao' }); gE.appendChild(cl); cena.ck.push(cl); }
        cena.cabo = m.id === 'fundear' ? S('line', { class: 'man-cabo' }) : null;
        if (cena.cabo) gE.appendChild(cena.cabo);
        cena.ancora = null;
        if (a) {
          cena.ancora = S('g', { class: 'man-ancora', transform: 'translate(' + a.x + ',' + a.y + ')' });
          cena.ancora.appendChild(S('path', { d: 'M0,-8 v18 M-7,-2 h14 M-9,4 q0,9 9,9 q9,0 9,-9', class: 'man-ancora-tr' }));
          cena.ancora.appendChild(S('circle', { cx: 0, cy: -11, r: 3, class: 'man-ancora-tr' }));
          gE.appendChild(cena.ancora);
          cena.alvo = S('g', { class: 'man-alvo', transform: 'translate(' + a.x + ',' + a.y + ')' });
          cena.alvo.appendChild(S('path', { d: 'M-9,0 h18 M0,-9 v18', class: 'man-alvo-tr' }));
          cena.alvo.appendChild(S('circle', { r: 6, class: 'man-alvo-tr' }));
          cena.alvo.appendChild(S('text', { x: 12, y: -6, class: 'man-rot' }, 'ponto de fundeio'));
          gE.appendChild(cena.alvo);
        }
        cena.marca = null;
        if (m.id === 'mob') {
          var mk = v.marca || [142, 133], Lb = 124 * escDe(m, v);
          /* régua de comprimentos de barco (afastamento do oito) e barra de escala */
          if (v.regua) {
            var rg = v.regua, gR = S('g', { class: 'man-regua' });
            gR.appendChild(S('line', { x1: rg.x, y1: rg.y, x2: r1(rg.x + rg.n * Lb), y2: rg.y, class: 'man-regua-tr' }));
            for (var ri = 0; ri <= rg.n; ri++) {
              gR.appendChild(S('line', { x1: r1(rg.x + ri * Lb), y1: rg.y - 4, x2: r1(rg.x + ri * Lb), y2: rg.y + 4, class: 'man-regua-tr' }));
              if (ri) gR.appendChild(S('text', { x: r1(rg.x + ri * Lb), y: rg.y - 7, class: 'man-rot', 'text-anchor': 'middle' }, String(ri)));
            }
            gR.appendChild(S('text', { x: r1(rg.x + rg.n * Lb / 2), y: rg.y + 16, class: 'man-rot', 'text-anchor': 'middle' }, 'comprimentos do barco'));
            gE.appendChild(gR);
          }
          if (v.escala) {
            var gEs = S('g', { class: 'man-regua' });
            gEs.appendChild(S('line', { x1: v.escala[0], y1: v.escala[1], x2: r1(v.escala[0] + Lb), y2: v.escala[1], class: 'man-regua-tr' }));
            gEs.appendChild(S('line', { x1: v.escala[0], y1: v.escala[1] - 4, x2: v.escala[0], y2: v.escala[1] + 4, class: 'man-regua-tr' }));
            gEs.appendChild(S('line', { x1: r1(v.escala[0] + Lb), y1: v.escala[1] - 4, x2: r1(v.escala[0] + Lb), y2: v.escala[1] + 4, class: 'man-regua-tr' }));
            gEs.appendChild(v.escala[2] === 'esq'
              ? S('text', { x: r1(v.escala[0] - 6), y: v.escala[1] + 4, class: 'man-rot', 'text-anchor': 'end' }, '1 comprimento do barco')
              : S('text', { x: r1(v.escala[0] + Lb + 6), y: v.escala[1] + 4, class: 'man-rot' }, '1 comprimento do barco'));
            gE.appendChild(gEs);
          }
          cena.deriva = S('path', { class: 'man-deriva' });
          gE.appendChild(cena.deriva);
          cena.anel = null; cena.ls = null;
          if (v.lifesling) {
            cena.anel = S('g', { class: 'man-anel' });
            cena.anel.appendChild(S('circle', { r: v.lifesling.raio, class: 'man-anel-c' }));
            gE.appendChild(cena.anel);
            cena.ls = S('g', { class: 'man-ls' });
            cena.ls.appendChild(S('path', { class: 'man-ls-halo' }));
            cena.ls.appendChild(S('path', { class: 'man-ls-cabo' }));
            cena.ls.appendChild(S('circle', { r: 3.6, class: 'man-ls-anel' }));
            gE.appendChild(cena.ls);
            /* legenda fixa do cabo, no canto, para não competir com os outros rótulos */
            var lg = v.lifesling.leg;
            cena.lsLeg = S('g', { class: 'man-ls' });
            cena.lsLeg.appendChild(S('line', { x1: lg[0], y1: lg[1], x2: lg[0] + 14, y2: lg[1], class: 'man-ls-halo' }));
            cena.lsLeg.appendChild(S('line', { x1: lg[0], y1: lg[1], x2: lg[0] + 14, y2: lg[1], class: 'man-ls-cabo' }));
            cena.lsLeg.appendChild(S('text', { x: lg[0] + 19, y: lg[1] + 4, class: 'man-rot' }, 'cabo do Lifesling'));
            gE.appendChild(cena.lsLeg);
          }
          cena.marca = S('g', { class: 'man-marca-mob', transform: 'translate(' + mk[0] + ',' + mk[1] + ')' });
          cena.marca.appendChild(S('path', { d: 'M-6,-6 L6,6 M6,-6 L-6,6', class: 'man-marca-tr' }));
          cena.marca.appendChild(S('text', { x: -10, y: 4, class: 'man-rot man-rot-mk', 'text-anchor': 'end' }, 'MOB no GPS'));
          gE.appendChild(cena.marca);
          cena.boia = S('g', { class: 'man-boia' });
          cena.boia.appendChild(S('circle', { r: 5, class: 'man-boia-anel' }));
          cena.boia.appendChild(S('text', { x: -9, y: 12, class: 'man-rot', 'text-anchor': 'end' }, 'boia'));
          gE.appendChild(cena.boia);
          cena.pessoa = S('g', { class: 'man-pessoa' });
          cena.pessoa.appendChild(S('circle', { r: 4.6, class: 'man-pessoa-c' }));
          cena.pessoa.appendChild(S('path', { d: 'M-8,3 Q0,-3 8,3', class: 'man-pessoa-br' }));
          cena.pessoa.appendChild(S('text', { x: 11, y: 4, class: 'man-rot' }, 'pessoa na água'));
          gE.appendChild(cena.pessoa);
        }
        cena.slick = null;
        if (m.id === 'capear') {
          cena.slick = S('g', { class: 'man-esteira' });
          [0, 1, 2].forEach(function (i) { cena.slick.appendChild(S('path', { d: 'M-24,' + (-34 - i * 10) + ' q24,-10 48,0', class: 'man-esteira-tr' })); });
          cena.slick.appendChild(S('text', { x: 30, y: -38, class: 'man-rot' }, 'esteira lisa'));
          gE.appendChild(cena.slick);
        }
        svg.appendChild(gE);

        cena.barco = criarBarco(escDe(m, v), !!m.semVelas);
        svg.appendChild(cena.barco.g);
        cena.mesRot = null;
      }

      /* ---- perfil (rizar) ---- */
      var PF = { xm: 112, H0: 80, yb: 326, xc: 212, deck: 360 };
      function montarPerfil(m, v) {
        var c = cena;
        /* casco e convés */
        svg.appendChild(S('path', { class: 'man-casco-perfil', d: 'M30,' + PF.deck + ' L360,' + PF.deck + ' Q342,396 292,404 L74,404 Q42,398 30,' + PF.deck + ' Z' }));
        svg.appendChild(S('path', { class: 'man-cockpit-perfil', d: 'M215,' + PF.deck + ' L300,' + PF.deck + ' L296,380 L220,380 Z' }));
        svg.appendChild(S('rect', { class: 'man-cabine-perfil', x: 36, y: PF.deck - 14, width: 52, height: 14, rx: 3 }));
        /* mastro */
        svg.appendChild(S('rect', { class: 'man-mastro-perfil', x: PF.xm - 3, y: 62, width: 6, height: PF.deck - 62 }));
        svg.appendChild(S('circle', { cx: PF.xm, cy: 62, r: 3.5, class: 'man-mastro-topo' }));
        /* vela (fundo) */
        c.bolsa = S('path', { class: 'man-bolsa' });
        c.vela = S('path', { class: 'man-pano-perfil' });
        c.rizos = [S('line', { class: 'man-rizo-linha' }), S('line', { class: 'man-rizo-linha' })];
        svg.appendChild(c.bolsa); svg.appendChild(c.vela); c.rizos.forEach(function (r) { svg.appendChild(r); });
        c.retranca = S('line', { class: 'man-retranca-perfil', x1: PF.xm, y1: PF.yb, x2: PF.xc + 8, y2: PF.yb });
        svg.appendChild(c.retranca);
        /* linhas */
        function grupo(nome, rot, rx, ry, anchor) {
          var g = S('g', { class: 'man-linha-cabo', 'data-cabo': nome });
          var p = S('path', { class: 'man-cabo-tr' });
          var t = S('text', { x: rx, y: ry, class: 'man-rot man-rot-cabo', 'text-anchor': anchor || 'start' }, rot);
          g.appendChild(p); g.appendChild(t); svg.appendChild(g);
          return { g: g, p: p, t: t };
        }
        c.cAdr = grupo('adriça', 'adriça', PF.xm - 12, 150, 'end');
        c.cAma = grupo('amantilho', 'amantilho', 172, 190, 'start');
        c.cBur = grupo('burro', 'burro', 152, 350, 'start');
        c.cEsc = grupo('escota', 'escota', 232, 349, 'start');
        c.cCar = grupo('carregador', 'carregador do rizo', 224, 316, 'start');
        c.cGan = grupo('gancho', 'gancho', PF.xm - 12, PF.yb + 4, 'end');
        c.gancho = S('circle', { cx: PF.xm, cy: PF.yb, r: 4.5, class: 'man-gancho' });
        svg.appendChild(c.gancho);
        /* mini-bússola */
        var mg = S('g', { class: 'man-mini', transform: 'translate(332,100)' });
        mg.appendChild(S('circle', { r: 50, class: 'man-mini-c' }));
        mg.appendChild(S('path', { d: 'M0,-44 v18 m-5,-7 l5,7 l5,-7', class: 'man-mini-v' }));
        c.miniBarco = criarBarco(0.3, false);
        mg.appendChild(c.miniBarco.g);
        mg.appendChild(S('text', { x: 0, y: 66, class: 'man-rot', 'text-anchor': 'middle' }, 'visto de cima'));
        svg.appendChild(mg);
      }

      function atualizarPerfil(e, v) {
        var c = cena, q = v.q || 0.15;
        var H0 = PF.H0, yb = PF.yb, xm = PF.xm, xc = PF.xc, Hr = q * (yb - H0);
        var dn = clamp(e.dn || 0, 0, 1), pl = clamp(e.pl || 0, 0, 1), fl = clamp(e.fl || 0, 0, 1);
        var head = { x: xm, y: H0 + Hr * dn };
        var Rx = xc - q * (xc - xm);
        var cx = lerp(xc, Rx, dn * (1 - pl)), cy = yb;
        /* valuma (borda de trás) como curva, com leve barriga, balançando se paneja */
        var n = 22, d = 'M' + xm + ',' + yb + ' L' + xm + ',' + r1(head.y), i, t, px, py, off;
        var dx = cx - head.x, dy = cy - head.y, len = Math.hypot(dx, dy) || 1, nx = dy / len, ny = -dx / len;
        for (i = 0; i <= n; i++) {
          t = i / n;
          off = 10 * Math.sin(Math.PI * t) * (1 - fl * 0.4);
          if (fl > 0.02) off += fl * 7 * Math.sin(t * 11 + fase * 1.4) * Math.sin(Math.PI * t);
          px = head.x + dx * t + nx * off; py = head.y + dy * t + ny * off;
          d += ' L' + r1(px) + ',' + r1(py);
        }
        d += ' Z';
        c.vela.setAttribute('d', d);
        /* bolsa de pano sobre a retranca */
        var vis = dn;
        c.bolsa.setAttribute('d', 'M' + xm + ',' + yb + ' Q' + r1((xm + xc) / 2) + ',' + r1(yb + 16 * vis) + ' ' + xc + ',' + yb + ' Z');
        c.bolsa.style.opacity = String(vis);
        /* linhas de rizo na vela */
        [0.15, 0.30].forEach(function (qq, k) {
          var yy = yb - qq * (yb - H0) + Hr * dn, lin = c.rizos[k];
          if (yy < yb - 3 && yy > head.y + 6) {
            var ff = (yy - head.y) / (cy - head.y), xx = head.x + (cx - head.x) * ff;
            lin.setAttribute('x1', xm); lin.setAttribute('y1', r1(yy)); lin.setAttribute('x2', r1(xx)); lin.setAttribute('y2', r1(yy));
            lin.style.display = '';
          } else lin.style.display = 'none';
        });
        /* retranca */
        var tl = clamp(e.tl || 0, 0, 1), vg = clamp(e.vg == null ? 1 : e.vg, 0, 1), es = clamp(e.es || 0, 0, 1);
        c.retranca.setAttribute('y2', yb);
        /* cabos */
        var top = 62;
        c.cAdr.p.setAttribute('d', 'M' + (xm - 6) + ',' + r1(head.y) + ' L' + (xm - 6) + ',' + top + ' M' + (xm - 6) + ',' + top + ' L' + (xm - 6) + ',' + (PF.deck - 6));
        var slackT = (1 - tl) * 26;
        c.cAma.p.setAttribute('d', 'M' + xm + ',' + top + ' Q' + r1(lerp(xm, xc + 8, 0.5) + 6 + slackT) + ',' + r1(lerp(top, yb, 0.5) + slackT * 0.3) + ' ' + (xc + 8) + ',' + yb);
        var slackV = (1 - vg) * 16;
        c.cBur.p.setAttribute('d', 'M' + (xm + 4) + ',' + (PF.deck - 2) + ' Q' + r1(lerp(xm, 150, 0.5) + 6 + slackV) + ',' + r1(lerp(PF.deck, yb, 0.5) + slackV) + ' 150,' + (yb + 2));
        var slackE = es * 18;
        c.cEsc.p.setAttribute('d', 'M' + (xc + 8) + ',' + (yb + 2) + ' Q' + r1(xc + 8 + slackE) + ',' + r1(lerp(yb, PF.deck, 0.5)) + ' ' + (xc + 8) + ',' + (PF.deck - 1));
        var clewDraw = cx, crl = pl;
        c.cCar.p.setAttribute('d', 'M' + r1(clewDraw) + ',' + (yb + 5) + ' L' + (xc + 8) + ',' + (yb + 5) + ' L' + (xm + 6) + ',' + (yb + 5) + ' L' + (xm + 6) + ',' + (PF.deck - 6));
        c.cCar.g.style.opacity = (e.dn || 0) > 0.5 ? '1' : '0.45';
        c.cGan.p.setAttribute('d', 'M' + (xm - 4) + ',' + yb + ' h-12');
        c.gancho.setAttribute('class', 'man-gancho' + ((e.hk || 0) > 0.5 ? ' man-gancho-ok' : ''));
        /* destaque do passo */
        var ativos = (v.passos[e.i] && v.passos[e.i].ativo) || [];
        if (e.i < 0 || st.p <= 0) ativos = [];
        [['adriça', c.cAdr], ['amantilho', c.cAma], ['burro', c.cBur], ['escota', c.cEsc], ['carregador', c.cCar], ['gancho', c.cGan]].forEach(function (par) {
          par[1].g.classList.toggle('man-ativo', ativos.indexOf(par[0]) >= 0);
        });
        /* mini */
        c.miniBarco.set({ x: 0, y: 0, h: e.h, b: -12, g: -10, fl: fl, pg: 0 }, fase);
      }

      function atualizarPlanta(e, m, v) {
        var c = cena, k = compilar();
        c.barco.set(e, fase);
        /* trilha até o ponto atual */
        var d = '', u, N = k.length - 1, lim = st.p;
        for (u = 0; u < lim; u += 0.05) { var q = posU(k, u); d += (u ? 'L' : 'M') + r1(q.x) + ',' + r1(q.y); }
        d += (d ? 'L' : 'M') + r1(e.x) + ',' + r1(e.y);
        c.trilha.setAttribute('d', lim > 0 ? d : '');
        if (c.sr) { c.sr.style.opacity = String(clamp(e.sr || 0, 0, 1)); c.sr.classList.toggle('man-giro-pleno', (e.sr || 0) > 0.9); c.srRot.style.opacity = String(clamp(e.sr || 0, 0, 1)); }
        if (c.alvo) c.alvo.style.opacity = String(clamp(e.mk || 0, 0, 1));
        if (c.ancora) c.ancora.style.opacity = String(clamp(e.av || 0, 0, 1));
        if (c.cabo) {
          var hr = e.h * D2R, bx = e.x + Math.sin(hr) * 64 * escDe(m, v), by = e.y - Math.cos(hr) * 64 * escDe(m, v);
          c.cabo.setAttribute('x1', r1(bx)); c.cabo.setAttribute('y1', r1(by)); c.cabo.setAttribute('x2', m.ancora.x); c.cabo.setAttribute('y2', m.ancora.y);
          c.cabo.style.opacity = String(clamp(e.ca || 0, 0, 1));
        }
        if (c.ck && c.ck.length) {
          var refs = [[70, 42], [330, 48]];
          c.ck.forEach(function (ln, i) {
            ln.setAttribute('x1', r1(e.x)); ln.setAttribute('y1', r1(e.y)); ln.setAttribute('x2', refs[i][0]); ln.setAttribute('y2', refs[i][1] + 4);
            ln.style.opacity = String(clamp(e.ck || 0, 0, 1) * 0.9);
          });
        }
        if (c.marca) c.marca.style.opacity = String(clamp(e.mk || 0, 0, 1));
        if (c.deriva) {
          var mk0 = v.marca || [142, 133];
          c.deriva.setAttribute('d', 'M' + mk0[0] + ',' + mk0[1] + ' L' + r1(e.px || 0) + ',' + r1(e.py || 0));
          c.deriva.style.opacity = String(clamp(e.pv || 0, 0, 1) * clamp(e.mk || 0, 0, 1));
        }
        if (c.anel) {
          c.anel.setAttribute('transform', 'translate(' + r1(e.px || 0) + ',' + r1(e.py || 0) + ')');
          c.anel.style.opacity = String(clamp(e.rg || 0, 0, 1));
        }
        if (c.ls) atualizarLifesling(e, m, v, k);
        if (c.boia) { c.boia.setAttribute('transform', 'translate(' + r1(e.bx || 0) + ',' + r1(e.by || 0) + ')'); c.boia.style.opacity = String(clamp(e.bv || 0, 0, 1)); }
        if (c.pessoa) { c.pessoa.setAttribute('transform', 'translate(' + r1(e.px || 0) + ',' + r1(e.py || 0) + ')'); c.pessoa.style.opacity = String(clamp(e.pv || 0, 0, 1)); }
        if (c.slick) { c.slick.setAttribute('transform', 'translate(' + r1(e.x) + ',' + r1(e.y) + ')'); c.slick.style.opacity = String(clamp(e.sl || 0, 0, 1)); }
      }

      /* cabo flutuante do Lifesling: segue a esteira do barco desde o lançamento; com `lc` o trecho de trás é puxado para a pessoa */
      function atualizarLifesling(e, m, v, k) {
        var c = cena, LS = v.lifesling, g = c.ls;
        if (!LS || st.p <= LS.de + 1e-6) { g.style.opacity = '0'; c.lsLeg.style.opacity = '0'; return; }
        var esc = escDe(m, v), meio = 56 * esc, hr = e.h * D2R, fx = Math.sin(hr), fy = -Math.cos(hr);
        var lc = clamp(e.lc || 0, 0, 1), pts = [[e.x - fx * meio, e.y - fy * meio]], acc = 0, ant = { x: e.x, y: e.y }, u, q, w, ult;
        for (u = st.p - 0.03; u > LS.de - 0.03; u -= 0.03) {
          q = posU(k, Math.max(u, LS.de));
          acc += Math.hypot(q.x - ant.x, q.y - ant.y); ant = q;
          if (acc > meio) {
            w = lc * smooth((acc - meio) / Math.max(1, LS.comp - meio));
            pts.push([q.x + ((e.px || 0) - q.x) * w, q.y + ((e.py || 0) - q.y) * w]);
          }
          if (acc >= LS.comp) break;
        }
        var d = '', i;
        for (i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + r1(pts[i][0]) + ',' + r1(pts[i][1]);
        ult = pts[pts.length - 1];
        g.childNodes[0].setAttribute('d', d); g.childNodes[1].setAttribute('d', d);
        g.childNodes[2].setAttribute('cx', r1(ult[0])); g.childNodes[2].setAttribute('cy', r1(ult[1]));
        g.style.opacity = '1'; c.lsLeg.style.opacity = '1';
      }

      /* ---------- atualização por quadro ---------- */
      function atualizar() {
        var m = manAtual(), v = varAtual(), k = compilar(), N = k.length - 1;
        st.p = clamp(st.p, 0, N);
        var e = estadoEm(k, v.passos, st.p, v._tj);
        if (m.tipo === 'planta') atualizarPlanta(e, m, v); else atualizarPerfil(e, v);
        leit.textContent = leitura(e, !!m.semVelas);
        if (m.id === 'mob' && (e.pv || 0) > 0.5) leit.textContent += ' · pessoa a ' + VL.fmt.num(Math.hypot(e.x - e.px, e.y - e.py) / (124 * escDe(m, v)), 1) + ' comprimentos';
        rng.max = String(N * 100); rng.value = String(Math.round(st.p * 100));
        var idx = st.p <= 1e-6 ? 0 : Math.min(N, Math.ceil(st.p - 1e-6));
        rng.setAttribute('aria-valuetext', idx === 0 ? 'Ponto de partida' : 'Etapa ' + idx + ' de ' + N);
        btnAnt.disabled = st.p <= 1e-6; btnIni.disabled = st.p <= 1e-6;
        btnProx.disabled = st.p >= N - 1e-6;
        if (idx !== st.passoMostrado) { st.passoMostrado = idx; if (st.modo === 'explorar') renderPasso(idx); marcarPontos(idx); }
        btnTocar.textContent = st.tocando ? 'Pausar' : (st.p >= N - 1e-6 ? 'Rever' : 'Tocar');
        btnTocar.setAttribute('aria-pressed', String(st.tocando));
        svg.setAttribute('aria-label', 'Animação da manobra ' + m.rot.toLowerCase() + ', ' + (m.tipo === 'planta' ? 'vista de cima' : 'vista de perfil') + '. ' + (idx === 0 ? 'Ponto de partida.' : 'Etapa ' + idx + ' de ' + N + ': ' + v.passos[idx - 1].t + '.'));
      }

      function temFlog() {
        if (st.reduz || !cena) return false;
        var m = manAtual(), v = varAtual(), e = estadoEm(compilar(), v.passos, st.p, v._tj);
        return (e.fl || 0) > 0.02;
      }
      function pedir() { if (!raf && st.visivel) raf = requestAnimationFrame(loop); }
      function loop(t) {
        raf = 0;
        if (!st.visivel) { ultimo = 0; return; }
        var dt = ultimo ? Math.min(0.06, (t - ultimo) / 1000) : 0; ultimo = t;
        if (!st.reduz) fase += dt * 9;
        if (st.tocando) {
          if (hold > 0) hold -= dt;
          else {
            var N = nPassos(), antes = st.p;
            st.p = Math.min(N, st.p + dt * st.vel / DUR);
            if (Math.floor(st.p + 1e-9) > Math.floor(antes + 1e-9) && st.p < N) { st.p = Math.floor(st.p + 1e-9); hold = HOLD / st.vel; }
            if (st.p >= N) { st.p = N; st.tocando = false; }
          }
        }
        atualizar();
        if (st.tocando || temFlog()) raf = requestAnimationFrame(loop); else ultimo = 0;
      }
      function tocar() {
        if (st.reduz) return;
        if (st.p >= nPassos() - 1e-6) st.p = 0;
        st.tocando = true; hold = 0; ultimo = 0; pedir();
      }
      function pausar() { st.tocando = false; }
      function alternar() { if (st.tocando) { pausar(); atualizar(); } else tocar(); }
      function irPara(p) { st.p = clamp(p, 0, nPassos()); hold = 0; atualizar(); pedir(); }

      /* ---------- painel lateral ---------- */
      var infoBox = h('section', { class: 'man-bloco man-info', 'aria-label': 'Sobre a manobra' });
      var pontos = h('div', { class: 'man-pontos', role: 'group', 'aria-label': 'Etapas' });
      var passoBox = h('section', { class: 'man-bloco man-passo', 'aria-live': 'polite' });
      var extraBox = h('div', { class: 'man-extra' });
      var desBox = h('section', { class: 'man-bloco man-des', hidden: true, 'aria-label': 'Desafio' });
      var escopoBox = h('section', { class: 'man-bloco man-escopo', hidden: true, 'aria-label': 'Quanto filame largar' });
      lado.appendChild(infoBox);
      lado.appendChild(pontos);
      lado.appendChild(passoBox);
      lado.appendChild(extraBox);
      lado.appendChild(desBox);
      lado.appendChild(escopoBox);

      /* esquema dos dois lados de recolhimento: A = barco a barlavento (pessoa a sotavento do barco), B = pessoa a barlavento do barco */
      function diagramaLados(ativo) {
        var fig = h('figure', { class: 'man-lados' });
        var sv = S('svg', { class: 'man-lados-svg', viewBox: '0 0 300 124', role: 'img', 'aria-label': 'Dois jeitos de parar ao lado da pessoa, com o vento vindo do alto: A, o barco acima da pessoa, que fica a sotavento do barco; B, a pessoa acima do barco, a barlavento dele.' });
        sv.appendChild(S('rect', { x: 0, y: 0, width: 300, height: 124, class: 'man-mar' }));
        sv.appendChild(S('line', { x1: 150, y1: 0, x2: 150, y2: 124, class: 'man-lados-div' }));
        [['A', 0, 77, 52, -60, -46, -26, 62, 78], ['B', 150, 77, 80, 60, 46, 26, 62, 54]].forEach(function (d) {
          var ox = d[1];
          sv.appendChild(S('line', { x1: ox + 16, y1: 18, x2: ox + 16, y2: 48, class: 'man-vv' }));
          sv.appendChild(S('polygon', { points: (ox + 10) + ',42 ' + (ox + 22) + ',42 ' + (ox + 16) + ',54', class: 'man-vv-ponta' }));
          sv.appendChild(S('text', { x: ox + 26, y: 40, class: 'man-rot' }, 'vento'));
          sv.appendChild(S('text', { x: ox + 75, y: 14, class: 'man-rot man-lados-letra', 'text-anchor': 'middle' }, d[0] === 'A' ? 'A (recomendado)' : d[0]));
          var bq = criarBarco(0.32, false);
          bq.set({ x: ox + d[2], y: d[3], h: d[4], b: d[5], g: d[6], fl: 0.8, gs: 0 }, 0);
          sv.appendChild(bq.g);
          var pg = S('g', { class: 'man-pessoa-mini', transform: 'translate(' + (ox + d[7]) + ',' + d[8] + ')' });
          pg.appendChild(S('circle', { r: 4.6, class: 'man-pessoa-c' }));
          pg.appendChild(S('path', { d: 'M-8,3 Q0,-3 8,3', class: 'man-pessoa-br' }));
          sv.appendChild(pg);
          sv.appendChild(S('text', { x: ox + d[7] + (d[0] === 'A' ? -10 : 10), y: d[8] + (d[0] === 'A' ? 14 : -8), class: 'man-rot', 'text-anchor': d[0] === 'A' ? 'end' : 'start' }, 'pessoa'));
          if (d[0] === ativo) sv.appendChild(S('text', { x: ox + 75, y: 118, class: 'man-rot man-rot-mk', 'text-anchor': 'middle' }, 'o desenho desta manobra'));
        });
        fig.appendChild(sv);
        fig.appendChild(h('figcaption', null,
          h('b', null, 'A (recomendado pelo curso).'), ' Barco a barlavento, pessoa a sotavento do barco: RYA (Practical Boat Owner) e quase unanimidade das vítimas no simpósio de 2005. ',
          h('b', null, 'B.'), ' Pessoa a barlavento do barco: quick-stop do RORC (Practical Boat Owner) e do US Sailing de 2004; convém com barco de muito arrasto do vento ou em mar duro. Esquema sem escala, com o vento sempre do alto.'));
        return fig;
      }
      function renderInfo() {
        var m = manAtual(), v = varAtual();
        vazio(infoBox);
        infoBox.appendChild(h('h4', null, m.rot, m.en ? en(m.en) : null, v.rot && m.variantes.length > 1 ? h('span', { class: 'man-var-rot' }, ' · ' + v.rot + (v.en ? '' : '')) : null));
        if (v.en) infoBox.querySelector('h4').appendChild(en(v.en));
        infoBox.appendChild(h('p', { class: 'man-quando' }, m.quando));
        var fonteP = h('p', { class: 'man-fonte-man' }, m.fonte);
        if (m.selo) fonteP.appendChild(document.createTextNode(' ')), fonteP.appendChild(VL.ui.seloQ('orientação geral', 'Técnica de seamanship ensinada de formas ligeiramente diferentes; não é norma. Treine a manobra com seu instrutor e sua tripulação.'));
        infoBox.appendChild(fonteP);
        if (m.recomenda) {
          var dr = h('details', { class: 'man-detalhes man-recomenda', open: true }, h('summary', null, 'O que este curso recomenda'));
          dr.appendChild(h('p', null, m.recomenda.intro));
          dr.appendChild(h('dl', null, m.recomenda.itens.map(function (x) {
            return h('div', null, h('dt', null, x[0]), h('dd', null, x[1]));
          })));
          dr.appendChild(h('p', { class: 'man-recomenda-fecho' }, m.recomenda.fecho));
          infoBox.appendChild(dr);
        }
        if (m.consenso) {
          var dc = h('details', { class: 'man-detalhes' }, h('summary', null, 'O que todas as fontes ensinam'));
          dc.appendChild(h('ul', null, m.consenso.map(function (t) { return h('li', null, t); })));
          infoBox.appendChild(dc);
        }
        if (v.variacoes) {
          var dv = h('details', { class: 'man-detalhes' }, h('summary', null, 'Onde as escolas divergem'));
          if (v.diagLados) dv.appendChild(diagramaLados(v.diagLados === 'qs' ? 'B' : 'A'));
          dv.appendChild(h('dl', null, v.variacoes.map(function (x) {
            return h('div', null, h('dt', null, x[0]), h('dd', null, x[1]));
          })));
          infoBox.appendChild(dv);
        }
        if (m.fontes) {
          var df = h('details', { class: 'man-detalhes' }, h('summary', null, 'Fontes consultadas'));
          df.appendChild(h('ul', null, m.fontes.map(function (f) {
            return h('li', null, h('a', { href: f.url, target: '_blank', rel: 'noopener noreferrer' }, f.txt));
          })));
          infoBox.appendChild(df);
        }
      }
      function renderVariantes() {
        vazio(variantesBox);
        var m = manAtual();
        if (m.variantes.length < 2) { variantesBox.style.display = 'none'; return; }
        variantesBox.style.display = '';
        var seg = h('div', { class: 'man-chips', role: 'group', 'aria-label': 'Variante da manobra' });
        m.variantes.forEach(function (v, i) {
          seg.appendChild(h('button', { type: 'button', class: 'chip man-chip man-chip-var', 'aria-pressed': String(i === st.vi), onclick: function () { trocarVariante(i); } }, v.rot));
        });
        variantesBox.appendChild(seg);
      }
      function renderPontos() {
        vazio(pontos);
        var N = nPassos();
        pontos.appendChild(h('button', { type: 'button', class: 'man-ponto man-ponto-0', 'data-i': '0', 'aria-label': 'Ponto de partida', onclick: function () { pausar(); irPara(0); } }, 'Início'));
        for (var i = 1; i <= N; i++) (function (i) {
          pontos.appendChild(h('button', { type: 'button', class: 'man-ponto', 'data-i': String(i), 'aria-label': 'Etapa ' + i + ': ' + varAtual().passos[i - 1].t, onclick: function () { pausar(); irPara(i); } }, String(i)));
        })(i);
      }
      function marcarPontos(idx) {
        VL.$$('.man-ponto', pontos).forEach(function (b) {
          var i = Number(b.getAttribute('data-i'));
          b.setAttribute('aria-pressed', String(i === idx));
          b.classList.toggle('man-feito', i < idx);
        });
      }
      function vozItem(vz) {
        return h('li', { class: 'man-voz' },
          h('span', { class: 'man-voz-quem' }, vz[0]),
          h('span', { class: 'man-voz-fala' }, '“' + vz[1] + '”', vz[2] ? en(vz[2]) : null));
      }
      function renderPasso(idx) {
        var v = varAtual(), N = nPassos();
        vazio(passoBox); vazio(extraBox);
        if (idx === 0) {
          passoBox.appendChild(h('h4', null, 'Ponto de partida'));
          passoBox.appendChild(h('p', { class: 'man-txt' }, v.inicio));
          passoBox.appendChild(h('p', { class: 'man-dica-cena' }, 'Toque em "Tocar" para ver a manobra, ou em "Próxima" para avançar etapa por etapa. Você também pode arrastar a linha do tempo.'));
          return;
        }
        var ps = v.passos[idx - 1];
        passoBox.appendChild(h('h4', null, h('span', { class: 'man-num' }, 'Etapa ' + idx + ' de ' + N), ' ', ps.t));
        if (ps.vozes && ps.vozes.length) {
          var ul = h('ul', { class: 'man-vozes', 'aria-label': 'Vozes de comando' });
          ps.vozes.forEach(function (vz) { ul.appendChild(vozItem(vz)); });
          passoBox.appendChild(ul);
        }
        passoBox.appendChild(h('p', { class: 'man-txt' }, ps.txt));
        if (ps.tarefas && ps.tarefas.length) {
          var dl = h('dl', { class: 'man-tarefas' });
          ps.tarefas.forEach(function (t) { dl.appendChild(h('div', null, h('dt', null, t[0]), h('dd', null, t[1]))); });
          passoBox.appendChild(h('p', { class: 'man-sub' }, 'Quem faz o quê'));
          passoBox.appendChild(dl);
        }
        if (ps.regra) extraBox.appendChild(h('p', { class: 'man-regra' }, h('strong', null, 'Referência: '), ps.regra));
        if (ps.seg) extraBox.appendChild(VL.ui.callout('seguranca', 'Segurança', ps.seg));
        if (ps.dica) extraBox.appendChild(VL.ui.callout('dica', 'Dica', ps.dica));
      }

      /* ---------- calculadora de filame (fundear) ---------- */
      var esc = { prof: 6, mare: 0, rel: 5 };
      var ALT_PROA = 1.2, COMP_BARCO = 9.75;
      function renderEscopo() {
        vazio(escopoBox);
        if (st.man !== 'fundear' || st.modo !== 'explorar') { escopoBox.hidden = true; return; }
        escopoBox.hidden = false;
        var prof = h('input', { type: 'range', min: '2', max: '20', step: '0.5', value: String(esc.prof), 'aria-label': 'Profundidade agora, em metros' });
        var mare = h('input', { type: 'range', min: '0', max: '4', step: '0.5', value: String(esc.mare), 'aria-label': 'Quanto a maré ainda vai subir, em metros' });
        var rel = h('input', { type: 'range', min: '2', max: '10', step: '0.5', value: String(esc.rel), 'aria-label': 'Relação filame para profundidade' });
        var vProf = h('span', { class: 'man-val' }), vMare = h('span', { class: 'man-val' }), vRel = h('span', { class: 'man-val' });
        var sv = S('svg', { class: 'man-esc-svg', viewBox: '0 0 360 150', role: 'img', 'aria-label': 'Corte lateral da âncora, do cabo e do barco' });
        var res = h('p', { class: 'man-esc-res', 'aria-live': 'polite' });
        var faixa = h('p', { class: 'man-esc-faixa' });
        escopoBox.appendChild(h('h4', null, 'Quanto filame largar? ', VL.ui.seloQ('orientação geral', 'Regra prática, não norma: a relação ideal depende do tipo de âncora e de cabo, do fundo, do vento e do mar.')));
        escopoBox.appendChild(h('p', { class: 'man-esc-intro' }, 'Filame é o comprimento de cabo (ou corrente) largado. Calcula-se pela profundidade que haverá na preamar, mais a altura da proa sobre a água.'));
        escopoBox.appendChild(h('label', { class: 'man-esc-aj' }, h('span', null, 'Profundidade agora: ', vProf), prof));
        escopoBox.appendChild(h('label', { class: 'man-esc-aj' }, h('span', null, 'A maré ainda vai subir: ', vMare), mare));
        escopoBox.appendChild(h('label', { class: 'man-esc-aj' }, h('span', null, 'Relação filame/profundidade: ', vRel), rel));
        escopoBox.appendChild(sv);
        escopoBox.appendChild(res);
        escopoBox.appendChild(faixa);
        escopoBox.appendChild(h('p', { class: 'man-esc-nota' }, 'Faixas que se costuma ensinar: abaixo de 3:1, curto demais; 3:1 a 5:1, só com corrente e tempo bom; 5:1 a 7:1, faixa geral recomendada; acima de 7:1, vento forte ou fundo ruim (mais espaço de giro). Desenho simplificado: com cabo reto, sem a curva da corrente.'));
        function calc() {
          esc.prof = Number(prof.value); esc.mare = Number(mare.value); esc.rel = Number(rel.value);
          vProf.textContent = VL.fmt.num(esc.prof, 1) + ' m'; vMare.textContent = '+' + VL.fmt.num(esc.mare, 1) + ' m'; vRel.textContent = VL.fmt.num(esc.rel, 1) + ' para 1';
          var hh = esc.prof + esc.mare + ALT_PROA, L = esc.rel * hh;
          var H = Math.sqrt(Math.max(0, L * L - hh * hh)), R = H + COMP_BARCO;
          res.innerHTML = '';
          res.appendChild(h('span', null, 'Largar cerca de ', h('strong', null, VL.fmt.num(Math.ceil(L), 0) + ' m'), ' de filame (', VL.fmt.num(esc.rel, 1), ' × ', VL.fmt.num(hh, 1), ' m). O barco pode girar num círculo de raio de cerca de ', h('strong', null, VL.fmt.num(Math.ceil(R), 0) + ' m'), ', contando o comprimento do barco de exemplo (', VL.fmt.num(COMP_BARCO, 2), ' m; some a diferença se o seu for maior).'));
          var tipo, txt;
          if (esc.rel < 3) { tipo = 'erro'; txt = 'Curto demais: a âncora tende a ser puxada para cima e pode garrar.'; }
          else if (esc.rel < 5) { tipo = 'aviso'; txt = 'Mínimo: só com corrente, fundo bom e tempo calmo.'; }
          else if (esc.rel <= 7) { tipo = 'ok'; txt = 'Faixa geral recomendada.'; }
          else { tipo = 'aviso'; txt = 'Bom para vento forte ou fundo ruim, mas pede muito espaço de giro: confira os vizinhos.'; }
          faixa.setAttribute('data-tipo', tipo); faixa.textContent = txt;
          /* corte lateral, escala uniforme */
          vazio(sv);
          var sc = Math.min(11, 300 / (H + COMP_BARCO + 4), 90 / hh);
          var yAgua = 30, xA = 24, xB = xA + H * sc, ySolo = yAgua + (esc.prof + esc.mare) * sc;
          var yPre = yAgua - esc.mare * sc;
          sv.appendChild(S('rect', { x: 0, y: yPre, width: 360, height: ySolo - yPre + 40, class: 'man-esc-agua' }));
          sv.appendChild(S('path', { d: 'M0,' + yPre + ' H360', class: 'man-esc-linha-agua' }));
          if (esc.mare > 0) sv.appendChild(S('text', { x: 354, y: yPre - 4, class: 'man-rot', 'text-anchor': 'end' }, 'preamar'));
          sv.appendChild(S('path', { d: 'M0,' + r1(ySolo) + ' H360 V150 H0 Z', class: 'man-esc-fundo' }));
          var yHull = yPre;
          sv.appendChild(S('path', { class: 'man-esc-casco', d: 'M' + r1(xB) + ',' + r1(yHull - ALT_PROA * sc) + ' L' + r1(xB + COMP_BARCO * sc) + ',' + r1(yHull - 0.9 * sc) + ' L' + r1(xB + COMP_BARCO * sc - 0.8 * sc) + ',' + r1(yHull + 0.8 * sc) + ' L' + r1(xB + 1.2 * sc) + ',' + r1(yHull + 0.8 * sc) + ' Z' }));
          sv.appendChild(S('line', { x1: r1(xB), y1: r1(yHull - ALT_PROA * sc), x2: xA, y2: r1(ySolo), class: 'man-esc-cabo' }));
          var cA = S('g', { transform: 'translate(' + xA + ',' + r1(ySolo) + ')' });
          cA.appendChild(S('path', { d: 'M0,-7 v12 M-5,-3 h10 M-6,1 q0,6 6,6 q6,0 6,-6', class: 'man-ancora-tr' })); sv.appendChild(cA);
          sv.appendChild(S('line', { x1: xA, y1: r1(ySolo + 16), x2: r1(xB), y2: r1(ySolo + 16), class: 'man-esc-cota' }));
          sv.appendChild(S('text', { x: r1((xA + xB) / 2), y: r1(ySolo + 29), class: 'man-rot', 'text-anchor': 'middle' }, 'distância horizontal ≈ ' + VL.fmt.num(Math.round(H), 0) + ' m'));
          sv.appendChild(S('line', { x1: r1(xB + COMP_BARCO * sc + 10), y1: yPre, x2: r1(xB + COMP_BARCO * sc + 10), y2: r1(ySolo), class: 'man-esc-cota' }));
          sv.appendChild(S('text', { x: r1(xB + COMP_BARCO * sc + 14), y: r1((yPre + ySolo) / 2 + 4), class: 'man-rot' }, VL.fmt.num(esc.prof + esc.mare, 1) + ' m'));
        }
        [prof, mare, rel].forEach(function (i) { i.addEventListener('input', calc); });
        calc();
      }

      /* ---------- desafio ---------- */
      var des = { ord: null, q: 0, acertos: 0, resp: null };
      function renderDesafio() {
        vazio(desBox);
        var v = varAtual(), m = manAtual();
        desBox.appendChild(h('h4', null, 'Desafio: ' + m.rot + (m.variantes.length > 1 ? ' · ' + v.rot : '')));
        var seg = h('div', { class: 'segmented man-seg-des', role: 'group', 'aria-label': 'Tipo de desafio' });
        [['ordenar', 'Ordene as etapas'], ['perguntas', 'Perguntas']].forEach(function (p) {
          seg.appendChild(h('button', { type: 'button', 'aria-pressed': String(st.subDes === p[0]), onclick: function () { st.subDes = p[0]; renderDesafio(); } }, p[1]));
        });
        desBox.appendChild(seg);
        if (st.subDes === 'ordenar') desOrdenar(v); else desPerguntas(v);
      }
      function primeiraFrase(t) { var i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; }
      function desOrdenar(v) {
        var N = v.passos.length;
        if (!des.ord || des.ord.v !== v) {
          var ids = []; for (var i = 0; i < N; i++) ids.push(i);
          var emb = VL.embaralhar ? VL.embaralhar(ids) : ids.slice().reverse();
          if (emb.join() === ids.join()) emb = ids.slice().reverse();
          des.ord = { v: v, ordem: emb, certos: [], msg: null, ok: false };
        }
        var o = des.ord;
        desBox.appendChild(h('p', { class: 'man-des-enun' }, 'Toque nas etapas na ordem em que elas acontecem, do começo ao fim da manobra. Cada acerto vem com uma explicação.'));
        var lista = h('div', { class: 'man-ord', role: 'group', 'aria-label': 'Etapas embaralhadas' });
        o.ordem.forEach(function (i) {
          var pos = o.certos.indexOf(i);
          var b = h('button', { type: 'button', class: 'alternativa man-ord-b', disabled: pos >= 0 ? true : null, 'data-res': pos >= 0 ? 'certa' : null, onclick: function () { escolher(i); } },
            h('span', { class: 'alternativa-letra' }, pos >= 0 ? String(pos + 1) : '?'), h('span', null, v.passos[i].t));
          lista.appendChild(b);
        });
        desBox.appendChild(lista);
        var fb = h('div', { class: 'man-des-fb', 'aria-live': 'polite' });
        if (o.msg) fb.appendChild(o.msg);
        desBox.appendChild(fb);
        desBox.appendChild(h('div', { class: 'man-linha' }, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { des.ord = null; renderDesafio(); } }, 'Embaralhar de novo'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { trocarModo('explorar'); } }, 'Ver a animação')));
        function escolher(i) {
          var esp = o.certos.length;
          if (i === esp) {
            o.certos.push(i);
            if (o.certos.length === N) { o.msg = h('p', { class: 'man-fb-ok' }, h('strong', null, 'Certo, na ordem inteira. '), 'Você ordenou todas as etapas. Agora faça as perguntas para fixar os porquês.'); o.ok = true; }
            else o.msg = h('p', { class: 'man-fb-ok' }, h('strong', null, 'Certo. '), primeiraFrase(v.passos[i].txt));
          } else {
            o.msg = h('p', { class: 'man-fb-erro' }, h('strong', null, 'Ainda não. '), 'Pense no que vem logo depois de "', esp ? v.passos[esp - 1].t : 'o ponto de partida', '". Dica sobre a etapa seguinte: ', primeiraFrase(v.passos[esp].txt));
          }
          renderDesafio();
        }
      }
      function desPerguntas(v) {
        var qz = v.quiz || [];
        if (!qz.length) { desBox.appendChild(h('p', null, 'Esta manobra não tem perguntas.')); return; }
        if (des.v !== v) { des.v = v; des.q = 0; des.acertos = 0; des.resp = null; des.ordemAlt = {}; }
        if (des.q >= qz.length) {
          desBox.appendChild(h('p', { class: 'man-des-enun' }, h('strong', null, 'Você acertou ' + des.acertos + ' de ' + qz.length + ' perguntas.'), des.acertos === qz.length ? ' Muito bem!' : ' Releia as explicações e veja a animação de novo.'));
          desBox.appendChild(h('div', { class: 'man-linha' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { des.v = null; renderDesafio(); } }, 'Refazer'),
            h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarModo('explorar'); } }, 'Ver a animação')));
          return;
        }
        var q = qz[des.q];
        desBox.appendChild(h('p', { class: 'man-des-n' }, 'Pergunta ' + (des.q + 1) + ' de ' + qz.length));
        desBox.appendChild(h('p', { class: 'man-des-enun' }, q.p));
        var ordem = des.ordemAlt[des.q];
        if (!ordem) { var ids = q.alt.map(function (_, i) { return i; }); ordem = VL.embaralhar ? VL.embaralhar(ids) : ids; des.ordemAlt[des.q] = ordem; }
        var lista = h('div', { class: 'man-alts', role: 'group', 'aria-label': 'Alternativas' });
        ordem.forEach(function (i, pos) {
          var res = des.resp != null ? (i === q.certa ? 'certa' : (i === des.resp ? 'errada' : null)) : null;
          lista.appendChild(h('button', { type: 'button', class: 'alternativa', disabled: des.resp != null ? true : null, 'data-res': res, onclick: function () {
            des.resp = i; if (i === q.certa) des.acertos++; renderDesafio();
          } }, h('span', { class: 'alternativa-letra' }, String.fromCharCode(65 + pos)), h('span', null, q.alt[i])));
        });
        desBox.appendChild(lista);
        if (des.resp != null) {
          var ok = des.resp === q.certa;
          desBox.appendChild(h('p', { class: ok ? 'man-fb-ok' : 'man-fb-erro' }, h('strong', null, ok ? 'Certo. ' : 'Ainda não. '), q.por));
          desBox.appendChild(h('div', { class: 'man-linha' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { des.q++; des.resp = null; renderDesafio(); } }, des.q + 1 >= qz.length ? 'Ver resultado' : 'Próxima pergunta')));
        }
      }

      /* ---------- trocas de modo, manobra e variante ---------- */
      function aplicarModo() {
        var ex = st.modo === 'explorar';
        pontos.hidden = !ex; passoBox.hidden = !ex; extraBox.hidden = !ex; desBox.hidden = ex;
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === st.modo)); });
        renderEscopo();
      }
      function trocarModo(mm) {
        st.modo = mm; pausar();
        aplicarModo();
        if (mm === 'desafio') renderDesafio(); else { st.passoMostrado = -1; atualizar(); }
      }
      function recarregar() {
        pausar(); st.p = 0; st.passoMostrado = -1; hold = 0;
        des.ord = null; des.v = null; des.q = 0; des.acertos = 0; des.resp = null;
        renderInfo(); renderVariantes(); renderPontos();
        montarCena(); aplicarModo();
        if (st.modo === 'desafio') renderDesafio();
        VL.$$('.man-chip', chips).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-man') === st.man)); });
        atualizar(); pedir();
      }
      function trocarManobra(id) { if (id === st.man) return; st.man = id; st.vi = 0; recarregar(); }
      function trocarVariante(i) { if (i === st.vi) return; st.vi = i; recarregar(); }

      /* ---------- ciclo de vida ---------- */
      var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      function aoMudarMov() {
        st.reduz = reduzMov();
        btnTocar.hidden = st.reduz; segVel.hidden = st.reduz;
        if (st.reduz) pausar();
        atualizar();
      }
      if (mq && mq.addEventListener) { mq.addEventListener('change', aoMudarMov); limpezas.push(function () { mq.removeEventListener('change', aoMudarMov); }); }
      var io = null;
      if (window.IntersectionObserver) {
        io = new IntersectionObserver(function (es) { st.visivel = es[0].isIntersecting; if (st.visivel) pedir(); }, { threshold: 0.01 });
        io.observe(el);
        limpezas.push(function () { io.disconnect(); });
      }
      limpezas.push(function () { if (raf) cancelAnimationFrame(raf); raf = 0; st.tocando = false; });

      recarregar();
      aoMudarMov();
      if (opts.etapa != null && !isNaN(Number(opts.etapa))) irPara(clamp(Number(opts.etapa), 0, nPassos()));
      if (opts.tocar && !st.reduz) tocar();

      return function () { limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } }); };
    },
  });
})();
