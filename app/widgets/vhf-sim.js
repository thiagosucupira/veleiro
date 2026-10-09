/* vhf-sim — simulador de rádio VHF marítimo com DSC (chamada seletiva digital), para leigos.
   Face do rádio com display, seletor de canal (arraste ou setas do teclado), teclas 16/9 e potência (25 W / 1 W),
   squelch, alto-falante com tráfego simulado, PTT e botão DISTRESS com tampa de mola (levantar a tampa e segurar).
   Três modos: explorar o rádio (cada canal com o uso do Apêndice 18 do RR), montar chamada (roteiro de fala com
   pronúncia, para MAYDAY, PAN PAN, SÉCURITÉ, rotina, DSC, MAYDAY RELAY, recibo, cancelamento de alerta falso,
   SEELONCE MAYDAY e SEELONCE FEENEE, com "transmissão" simulada e resposta de uma estação costeira FICTÍCIA)
   e desafio (qual chamada, ordenar o MAYDAY, qual canal).

   Fontes (citadas na interface):
   - UIT, Regulamento de Radiocomunicações (RR), edição de 2024 (CMR-23):
     Art. 32 (socorro: 32.1, 32.6, 32.7, 32.9, 32.10A, 32.13A a 32.13E, 32.16 a 32.19H, 32.23, 32.29, 32.29A, 32.46,
     32.47, 32.49, 32.51, 32.52, 32.53B a 32.53E); Art. 33 (urgência 33.9 a 33.15B; segurança 33.31 a 33.38B);
     Art. 52 (52.231, 52.239, 52.240, 52.241A, 52.244, 52.260: 25 W); Apêndice 14 (alfabeto e algarismos);
     Apêndice 15, Tabela 15-2 (canais 6, 13, 16, 70); Apêndice 18 (tabela de canais VHF e notas).
   - Recomendações UIT-R M.493-16 (botão de socorro: duas ações independentes, tampa de mola; natureza do perigo;
     padrões de fábrica; canal 6 sugerido para chamada entre navios), M.541-11 (alerta no 70 e depois voz no 16;
     repetição automática a cada 3,5 a 4,5 min; recibo; cancelamento), M.489-2 (até 25 W, redução fácil a 1 W) e
     M.1171-1 (chamada de rotina, resposta e troca para canal de trabalho).
   - NORMAM-211/DPC, art. 4.23.4 a (escuta no 16, ou no 70 se o rádio for DSC) — fato 'normas-150'.
   O GMDSS é o sistema da IMO (Convenção SOLAS, cap. IV); os procedimentos de rádio vêm do RR da UIT.
   Uso em português entre estações brasileiras e o canal 9 como canal de chamada aparecem com selo "a confirmar".
   Estação costeira, barcos, indicativos e MMSI usados nos exemplos são fictícios.

   opts de mount (todos opcionais):
     modo:      'explorar' | 'montar' | 'desafio'                 modo inicial (padrão 'explorar')
     modos:     ['explorar', 'montar', 'desafio']                  modos exibidos (padrão: os três)
     canal:     '16'                                               canal inicial
     mensagem:  'mayday' | 'panpan' | 'securite' | 'rotina' | 'dsc' | 'relay' | 'recibo' | 'cancelar' |
                'seelonce' | 'feenee'                              tipo inicial do construtor (padrão 'mayday')
     idioma:    'intl' | 'pt'                                      palavras de procedimento do roteiro (padrão 'intl')
     algarismos:'simples' | 'uit'                                  como dizer algarismos no roteiro (padrão 'simples')
     desafio:   'situacao' | 'ordem' | 'canal'                     tipo de desafio inicial (padrão 'situacao')
     n:         8                                                  perguntas por rodada no desafio
     segurar:   5                                                  segundos segurando o DISTRESS (padrão 5)
     trafego:   true                                               tráfego simulado no alto-falante
     barco:     { nome: 'Albatroz', indicativo: 'PQ4821', mmsi: '710123456', pessoas: 4 }   (fictícios)
     titulo:    legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'vhf-sim', opts:{}}
     {t:'widget', w:'vhf-sim', opts:{modo:'montar', mensagem:'mayday'}}
     {t:'widget', w:'vhf-sim', opts:{modo:'montar', modos:['montar'], mensagem:'securite'}}
     {t:'widget', w:'vhf-sim', opts:{modo:'desafio', modos:['desafio'], desafio:'ordem'}} */
(function () {
  'use strict';
  var h = VL.h;

  /* ===================== Canais (RR, Apêndice 18, Rev. CMR-19) =====================
     [canal, notas, MHz do navio, MHz da costeira, entre navios, portuário 1 freq., portuário 2 freq., corresp. pública] */
  var AP18 = [
    ['01', 'm', '156,050', '160,650', 0, 1, 1, 1], ['02', 'm', '156,100', '160,700', 0, 1, 1, 1], ['03', 'm', '156,150', '160,750', 0, 1, 1, 1],
    ['04', 'm', '156,200', '160,800', 0, 1, 1, 1], ['05', 'm', '156,250', '160,850', 0, 1, 1, 1], ['06', 'f', '156,300', '', 1, 0, 0, 0],
    ['07', 'm', '156,350', '160,950', 0, 1, 1, 1], ['08', '', '156,400', '', 1, 0, 0, 0], ['09', 'i', '156,450', '156,450', 1, 1, 0, 0],
    ['10', 'h q', '156,500', '156,500', 1, 1, 0, 0], ['11', 'q', '156,550', '156,550', 0, 1, 0, 0], ['12', '', '156,600', '156,600', 0, 1, 0, 0],
    ['13', 'k', '156,650', '156,650', 1, 1, 0, 0], ['14', '', '156,700', '156,700', 0, 1, 0, 0], ['15', 'g', '156,750', '156,750', 1, 1, 0, 0],
    ['16', 'f', '156,800', '156,800', 0, 0, 0, 0], ['17', 'g', '156,850', '156,850', 1, 1, 0, 0], ['18', 'm', '156,900', '161,500', 0, 1, 1, 1],
    ['19', 'm', '156,950', '161,550', 0, 1, 1, 1], ['20', 'm', '157,000', '161,600', 0, 1, 1, 1], ['21', 'y', '157,050', '161,650', 0, 1, 1, 1],
    ['22', 'y', '157,100', '161,700', 0, 1, 1, 1], ['23', 'y', '157,150', '161,750', 0, 1, 1, 1], ['24', 'w', '157,200', '161,800', 0, 1, 1, 1],
    ['25', 'w', '157,250', '161,850', 0, 1, 1, 1], ['26', 'w', '157,300', '161,900', 0, 1, 1, 1],
    ['60', 'm', '156,025', '160,625', 0, 1, 1, 1], ['61', 'm', '156,075', '160,675', 0, 1, 1, 1], ['62', 'm', '156,125', '160,725', 0, 1, 1, 1],
    ['63', 'm', '156,175', '160,775', 0, 1, 1, 1], ['64', 'm', '156,225', '160,825', 0, 1, 1, 1], ['65', 'm', '156,275', '160,875', 0, 1, 1, 1],
    ['66', 'm', '156,325', '160,925', 0, 1, 1, 1], ['67', 'h', '156,375', '156,375', 1, 1, 0, 0], ['68', '', '156,425', '156,425', 0, 1, 0, 0],
    ['69', '', '156,475', '156,475', 1, 1, 0, 0], ['70', 'f j', '156,525', '156,525', 0, 0, 0, 0], ['71', '', '156,575', '156,575', 0, 1, 0, 0],
    ['72', 'i', '156,625', '', 1, 0, 0, 0], ['73', 'h i', '156,675', '156,675', 1, 1, 0, 0], ['74', '', '156,725', '156,725', 0, 1, 0, 0],
    ['75', 'n', '156,775', '156,775', 0, 1, 0, 0], ['76', 'n', '156,825', '156,825', 0, 1, 0, 0], ['77', '', '156,875', '', 1, 0, 0, 0],
    ['78', 'm', '156,925', '161,525', 0, 1, 1, 1], ['79', 'm', '156,975', '161,575', 0, 1, 1, 1], ['80', 'y', '157,025', '161,625', 0, 1, 1, 1],
    ['81', 'y', '157,075', '161,675', 0, 1, 1, 1], ['82', 'y', '157,125', '161,725', 0, 1, 1, 1], ['83', 'y', '157,175', '161,775', 0, 1, 1, 1],
    ['84', 'w', '157,225', '161,825', 0, 1, 1, 1], ['85', 'w', '157,275', '161,875', 0, 1, 1, 1], ['86', 'w', '157,325', '161,925', 0, 1, 1, 1],
    ['87', 'zz', '157,375', '157,375', 0, 1, 0, 0], ['88', 'zz', '157,425', '157,425', 0, 1, 0, 0],
    ['1027', 'zz', '157,350', '157,350', 0, 1, 0, 0], ['1028', 'zz', '157,400', '157,400', 0, 1, 0, 0],
  ];
  var CANAIS = AP18.map(function (a) {
    return { c: a[0], notas: a[1] ? a[1].split(' ') : [], fn: a[2], fc: a[3], navios: !!a[4], porto1: !!a[5], porto2: !!a[6], publica: !!a[7] };
  });
  var POR_CANAL = {};
  CANAIS.forEach(function (c, i) { c.i = i; POR_CANAL[c.c] = c; });
  function duplex(c) { return !!c.fc && c.fc !== c.fn; }
  var NOTAS_AP18 = {
    g: 'Também para comunicações a bordo, com potência irradiada de até 1 W (nota g).',
    h: 'Na Europa e no Canadá, também para busca e salvamento e combate à poluição em áreas locais (nota h).',
    i: 'Um dos três canais preferidos para aeronaves leves e helicópteros falarem com navios (notas a e i).',
    q: 'Cuidado para não interferir no canal 70, que fica ao lado (nota q).',
    n: 'Só comunicações ligadas à navegação, com potência limitada a 1 W para proteger o 16 (nota n).',
    w: 'Faixa identificada para o VDES, sistema de troca de dados digitais; o uso analógico pode continuar até 1º de janeiro de 2030 onde a administração quiser (nota w).',
    y: 'Pode operar com uma ou com duas frequências, com coordenação entre administrações (nota y).',
    zz: 'Canal analógico de uma frequência para operações portuárias e movimento de navios (nota zz).',
    m: 'Pode operar com uma frequência só: a mais baixa, por navios e costeiras; a mais alta, só por costeiras (nota m).',
  };
  var ESPECIAL = {
    '16': { curto: 'Socorro, segurança e chamada', txt: [
      'Frequência internacional de socorro, segurança e chamada por voz (RR, Apêndice 15, Tabela 15-2, e n.º 52.231).',
      'Antes de falar, escute um pouco para ter certeza de que não há tráfego de socorro (RR 52.240). Fale pouco: no máximo 1 minuto (RR 52.239).',
      'Para conversar, chame no 16 e combine outro canal (UIT-R M.1171-1, §20). Aeronaves também podem usar o 16 para segurança (nota f).'] },
    '70': { curto: 'Somente DSC, nunca voz', txt: [
      'Exclusivo para chamada seletiva digital (DSC) de socorro, segurança e chamada (RR, Apêndice 18, nota j, e n.º 52.241A). Nunca use voz no 70.',
      'O rádio com DSC mantém escuta no 70 com um receptor próprio, mesmo quando você está em outro canal.'] },
    '06': { curto: 'Entre navios e busca e salvamento', txt: [
      'Canal entre navios. Também serve para navios e aeronaves em operações coordenadas de busca e salvamento (RR, Apêndice 15, Tabela 15-2; Apêndice 18, nota f).',
      'Nas chamadas DSC para outro barco, a UIT sugere o 6 como canal entre navios para a conversa (UIT-R M.493-16, Anexo 4, §5.4).'] },
    '13': { curto: 'Segurança da navegação, ponte a ponte', txt: [
      'Designado no mundo todo para comunicações de segurança da navegação, principalmente entre navios: é o canal "ponte a ponte" para combinar manobras (RR, Apêndice 15, Tabela 15-2; Apêndice 18, nota k).',
      'Também pode servir a operações portuárias, conforme a regra de cada país (nota k).'] },
    '09': { curto: 'Entre navios e operações portuárias', txt: [], q: true },
  };

  /* ===================== Dados das mensagens ===================== */
  var NATUREZAS = [ // UIT-R M.493-16, natureza do perigo (símbolos 100 a 110)
    { id: '107', dsc: 'não especificado', pt: 'EM PERIGO GRAVE E IMINENTE', en: 'IN GRAVE AND IMMINENT DANGER', dscEn: 'undesignated distress' },
    { id: '105', dsc: 'afundando', pt: 'AFUNDANDO', en: 'SINKING', dscEn: 'sinking' },
    { id: '101', dsc: 'alagamento', pt: 'ALAGANDO, ENTRANDO ÁGUA', en: 'FLOODING', dscEn: 'flooding' },
    { id: '100', dsc: 'incêndio ou explosão', pt: 'INCÊNDIO A BORDO', en: 'FIRE ON BOARD', dscEn: 'fire, explosion' },
    { id: '110', dsc: 'homem ao mar', pt: 'HOMEM AO MAR', en: 'MAN OVERBOARD', dscEn: 'man overboard' },
    { id: '102', dsc: 'abalroamento', pt: 'ABALROAMENTO', en: 'COLLISION', dscEn: 'collision' },
    { id: '103', dsc: 'encalhe', pt: 'ENCALHADO', en: 'AGROUND', dscEn: 'grounding' },
    { id: '104', dsc: 'adernando, com risco de emborcar', pt: 'ADERNANDO, RISCO DE EMBORCAR', en: 'LISTING, IN DANGER OF CAPSIZING', dscEn: 'listing, in danger of capsizing' },
    { id: '106', dsc: 'sem governo e à deriva', pt: 'SEM GOVERNO E À DERIVA', en: 'DISABLED AND ADRIFT', dscEn: 'disabled and adrift' },
    { id: '108', dsc: 'abandonando o barco', pt: 'ABANDONANDO O BARCO', en: 'ABANDONING SHIP', dscEn: 'abandoning ship' },
    { id: '109', dsc: 'pirataria ou assalto armado', pt: 'ATAQUE DE PIRATAS', en: 'PIRACY ATTACK', dscEn: 'piracy/armed robbery attack' },
  ];
  var POR_NAT = {}; NATUREZAS.forEach(function (n) { POR_NAT[n.id] = n; });
  var AUXILIOS = [
    { id: 'imediato', rot: 'auxílio imediato', pt: 'PRECISAMOS DE AUXÍLIO IMEDIATO', en: 'REQUIRE IMMEDIATE ASSISTANCE' },
    { id: 'resgate', rot: 'resgate da tripulação', pt: 'PRECISAMOS DE RESGATE DA TRIPULAÇÃO', en: 'REQUIRE RESCUE OF CREW' },
    { id: 'reboque', rot: 'reboque', pt: 'PRECISAMOS DE REBOQUE', en: 'REQUIRE TOW' },
    { id: 'bombas', rot: 'bombas de esgoto', pt: 'PRECISAMOS DE BOMBAS DE ESGOTO', en: 'REQUIRE PUMPS' },
    { id: 'medico', rot: 'assistência médica', pt: 'PRECISAMOS DE ASSISTÊNCIA MÉDICA', en: 'REQUIRE MEDICAL ASSISTANCE' },
  ];
  var POR_AUX = {}; AUXILIOS.forEach(function (a) { POR_AUX[a.id] = a; });
  var PROBLEMAS = [ // PAN PAN
    { id: 'motor', rot: 'motor parado, sem vento, à deriva lenta', pt: 'MOTOR PARADO, SEM VENTO, À DERIVA LENTA', en: 'ENGINE FAILURE, NO WIND, DRIFTING SLOWLY', aux: 'reboque' },
    { id: 'mastro', rot: 'mastro quebrado, sem propulsão', pt: 'MASTRO QUEBRADO, SEM PROPULSÃO', en: 'DISMASTED, NO PROPULSION', aux: 'reboque' },
    { id: 'leme', rot: 'leme avariado, sem governo', pt: 'LEME AVARIADO, SEM GOVERNO', en: 'RUDDER DAMAGED, UNABLE TO STEER', aux: 'reboque' },
    { id: 'medico', rot: 'tripulante ferido, precisa de orientação médica', pt: 'TRIPULANTE FERIDO, PRECISAMOS DE ORIENTAÇÃO MÉDICA', en: 'CREW MEMBER INJURED, REQUIRE MEDICAL ADVICE', aux: 'medico' },
  ];
  var POR_PROB = {}; PROBLEMAS.forEach(function (p) { POR_PROB[p.id] = p; });
  var AVISOS = [ // SÉCURITÉ
    { id: 'tronco', rot: 'tronco grande à deriva', pt: 'TRONCO GRANDE À DERIVA, PERIGOSO PARA A NAVEGAÇÃO', en: 'LARGE LOG ADRIFT, DANGEROUS TO NAVIGATION' },
    { id: 'rede', rot: 'rede de pesca à deriva, sem sinalização', pt: 'REDE DE PESCA À DERIVA, SEM SINALIZAÇÃO', en: 'UNMARKED FISHING NET ADRIFT' },
    { id: 'boia', rot: 'boia de sinalização apagada', pt: 'BOIA DE SINALIZAÇÃO DO CANAL APAGADA', en: 'CHANNEL BUOY UNLIT' },
    { id: 'conteiner', rot: 'contêiner à deriva', pt: 'CONTÊINER À DERIVA, PERIGOSO PARA A NAVEGAÇÃO', en: 'CONTAINER ADRIFT, DANGEROUS TO NAVIGATION' },
  ];
  var POR_AVISO = {}; AVISOS.forEach(function (a) { POR_AVISO[a.id] = a; });
  var DIRECOES = [['N', 'AO NORTE DE', 'NORTH OF'], ['NE', 'A NORDESTE DE', 'NORTHEAST OF'], ['E', 'A LESTE DE', 'EAST OF'], ['SE', 'A SUDESTE DE', 'SOUTHEAST OF'],
    ['S', 'AO SUL DE', 'SOUTH OF'], ['SW', 'A SUDOESTE DE', 'SOUTHWEST OF'], ['W', 'A OESTE DE', 'WEST OF'], ['NW', 'A NOROESTE DE', 'NORTHWEST OF']];
  var CANAIS_NAVIOS = ['06', '08', '72', '77'];

  /* Estações FICTÍCIAS dos exemplos */
  var COSTEIRA = { nome: 'COSTEIRA TREINO', mmsi: '007109990' };
  var GAIVOTA = { nome: 'GAIVOTA', mmsi: '710987654' };
  var MARINA = { nome: 'MARINA TREINO', canal: '68' };
  var ESTRELA = { nome: 'ESTRELA DO MAR', mmsi: '710555123', ind: 'PR7731' };

  var PW = {
    intl: { este: 'THIS IS', todos: 'ALL STATIONS', recebido: 'RECEIVED', cambio: 'OVER', fim: 'OUT', ind: 'CALL SIGN', pos: 'POSITION', pessoas: 'PERSONS ON BOARD',
      canal: 'CHANNEL', msgCanal: 'MESSAGE ON CHANNEL', cancelar: 'PLEASE CANCEL MY DISTRESS ALERT OF', milhas: 'MILES', utc: 'UTC' },
    pt: { este: 'AQUI É', todos: 'A TODAS AS ESTAÇÕES', recebido: 'RECEBIDO', cambio: 'CÂMBIO', fim: 'DESLIGO', ind: 'INDICATIVO', pos: 'POSIÇÃO', pessoas: 'PESSOAS A BORDO',
      canal: 'CANAL', msgCanal: 'MENSAGEM NO CANAL', cancelar: 'FAVOR CANCELAR MEU ALERTA DE SOCORRO DAS', milhas: 'MILHAS', utc: 'UTC' },
  };
  var PRON = { // pronúncia aproximada em português (não oficial); a base francesa vem do RR
    'MAYDAY': 'mê-dê (como o francês "m\'aider", RR 32.13BA)',
    'PAN PAN': 'pã pã (como o francês "panne", RR 33.10)',
    'SECURITE': 'sê-cu-ri-tê (como em francês, RR 33.33)',
    'MAYDAY RELAY': 'mê-dê ri-lêi',
    'SEELONCE MAYDAY': 'si-lãns mê-dê (francês "silence, m\'aider", RR 32.47)',
    'SEELONCE FEENEE': 'si-lãns fi-ní (francês "silence fini", RR 32.52)',
    'THIS IS': 'dis iz', 'ALL STATIONS': 'ól stêi-shâns', 'RECEIVED': 'ri-cívd', 'OVER': 'ôu-ver', 'OUT': 'áut',
    'PLEASE CANCEL MY DISTRESS ALERT OF': 'plíz kén-sel mái dis-trés a-lért óv',
  };

  /* ===================== Utilidades ===================== */
  function en(t) { return h('span', { class: 'vhf-en', 'data-intl': 'on' }, ' (' + t + ')'); }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function pad(n, k) { n = String(n == null ? '' : n).replace(/\D/g, ''); while (n.length < k) n = '0' + n; return n; }
  function utcAgora(d) { d = d || new Date(); return pad(d.getUTCHours(), 2) + pad(d.getUTCMinutes(), 2); }
  function utcBonito(hhmm) { return hhmm.slice(0, 2) + ':' + hhmm.slice(2) + ' UTC'; }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function fonteOu(ref, txt) {
    var f = VL.data.fontes && VL.data.fontes.fatos && VL.data.fontes.fatos[ref];
    return f ? VL.ui.fonte(ref) : h('span', { class: 'fonte-ref' }, '(' + txt + ')');
  }
  var DIG_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var DIG_PT = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  /** Diz letras pelo alfabeto fonético e algarismos um a um (simples) ou pelo código da UIT (Apêndice 14). */
  function dizer(str, lang, alg) {
    var F = VL.fonetico;
    return String(str || '').toUpperCase().split('').map(function (ch) {
      if (/[0-9]/.test(ch)) return alg === 'uit' ? F.POR_CHAR[ch].palavra : (lang === 'pt' ? DIG_PT : DIG_EN)[+ch];
      if (ch === ',' || ch === '.') return alg === 'uit' ? 'Decimal' : (lang === 'pt' ? 'vírgula' : 'decimal');
      var s = VL.semAcento(ch).toUpperCase();
      if (/[A-Z]/.test(s)) return F.POR_CHAR[s].palavra;
      return null;
    }).filter(Boolean).join(' ');
  }
  function minTxt(m) { var v = Math.max(0, Math.min(59.9, Number(String(m).replace(',', '.')) || 0)); return pad(Math.floor(v), 2) + ',' + Math.round((v % 1) * 10) % 10; }
  function posTxt(p) {
    if (p.modo === 'ref') return null;
    return pad(p.latG, 2) + '°' + minTxt(p.latM) + '\'' + p.latH + ' ' + pad(p.lonG, 3) + '°' + minTxt(p.lonM) + '\'' + (p.lonH === 'W' ? 'W' : 'E');
  }
  function posFala(p, lang) {
    var L = PW[lang];
    if (p.modo === 'ref') {
      var d = DIRECOES.filter(function (x) { return x[0] === p.dir; })[0] || DIRECOES[4];
      return L.pos + ' ' + (lang === 'pt' ? 'A ' + p.dist + ' ' + L.milhas + ' ' + d[1] : p.dist + ' ' + L.milhas + ' ' + d[2]) + ' ' + VL.semAcento(p.ponto || '').toUpperCase();
    }
    return L.pos + ' ' + posTxt(p);
  }
  function posDito(p, lang, alg) {
    if (p.modo === 'ref') return lang === 'pt' ? p.dist + ' milhas (diga o número normalmente)' : p.dist + ' miles';
    var gr = lang === 'pt' ? ' graus ' : ' degrees ', mi = lang === 'pt' ? ' minutos ' : ' minutes ';
    var ns = p.latH === 'S' ? (lang === 'pt' ? 'sul' : 'south') : (lang === 'pt' ? 'norte' : 'north');
    var ew = p.lonH === 'W' ? (lang === 'pt' ? 'oeste' : 'west') : (lang === 'pt' ? 'leste' : 'east');
    return dizer(pad(p.latG, 2), lang, alg) + gr + dizer(minTxt(p.latM), lang, alg) + mi + ns + ', ' + dizer(pad(p.lonG, 3), lang, alg) + gr + dizer(minTxt(p.lonM), lang, alg) + mi + ew;
  }
  function tres(x) { return [x, x, x].join(', '); }

  /* ===================== Geradores de roteiro =====================
     Cada parte: {rot, fala, dito?, pron?, ref}. Cada grupo: {titulo, canal, ref, partes}. */
  function P(rot, fala, ref, extra) { var o = { rot: rot, fala: fala, ref: ref || '' }; if (extra) Object.assign(o, extra); if (!o.pron && PRON[fala]) o.pron = PRON[fala]; return o; }
  function partesId(ctx, ref, comMmsi) {
    var L = PW[ctx.lang], B = ctx.B;
    var fala = L.ind + ' ' + B.ind + (comMmsi ? ', MMSI ' + B.mmsi : '');
    var dito = dizer(B.ind, ctx.lang, ctx.alg) + (comMmsi ? ' · MMSI ' + dizer(B.mmsi, ctx.lang, ctx.alg) : '');
    return P(comMmsi ? 'Indicativo de chamada e MMSI (o MMSI, se o alerta saiu por DSC)' : 'Indicativo de chamada', fala, ref, { dito: dito });
  }
  function outras(ctx, base) {
    var L = PW[ctx.lang], m = ctx.m, partes = [];
    if (m.pessoas) partes.push(m.pessoas + ' ' + L.pessoas);
    if (m.outras && m.outras.trim()) partes.push(VL.semAcento(m.outras.trim()).toUpperCase());
    return partes.join(', ') || base || '';
  }
  var GERA = {
    mayday: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, m = ctx.m, nat = POR_NAT[m.natureza] || POR_NAT['107'], aux = POR_AUX[m.auxilio] || POR_AUX.imediato;
      var nome = B.nome.toUpperCase();
      var g1 = { titulo: 'Chamada de socorro', canal: '16', ref: 'RR 32.13C', partes: [
        P('Sinal de socorro, três vezes', 'MAYDAY, MAYDAY, MAYDAY', 'RR 32.13C', { pron: PRON.MAYDAY }),
        P('"Aqui é"', L.este, 'RR 32.13C', { pron: PRON[L.este] }),
        P('Nome do barco, três vezes', tres(nome), 'RR 32.13C'),
        partesId(ctx, 'RR 32.13C', true)] };
      var g2 = { titulo: 'Mensagem de socorro', canal: '16', ref: 'RR 32.13D', partes: [
        P('Sinal de socorro', 'MAYDAY', 'RR 32.13D'),
        P('Nome, indicativo e MMSI', nome + ', ' + L.ind + ' ' + B.ind + ', MMSI ' + B.mmsi, 'RR 32.13D'),
        P(m.pos.modo === 'ref' ? 'Posição em relação a um ponto conhecido' : 'Posição (latitude e longitude)', posFala(m.pos, ctx.lang), 'RR 32.13D', { dito: posDito(m.pos, ctx.lang, ctx.alg) }),
        P('Natureza do perigo', ctx.lang === 'pt' ? nat.pt : nat.en, 'RR 32.13D'),
        P('Auxílio desejado', ctx.lang === 'pt' ? aux.pt : aux.en, 'RR 32.13D'),
        P('Outras informações úteis: pessoas a bordo, balsa, descrição do barco', outras(ctx), 'RR 32.13D'),
        P('Fim da fala: sua vez (uso corrente; não está no texto do RR)', L.cambio, '', { pron: PRON[L.cambio] })] };
      return [g1, g2];
    },
    panpan: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, m = ctx.m, nome = B.nome.toUpperCase();
      var prob = POR_PROB[m.problema] || PROBLEMAS[0], aux = POR_AUX[m.auxPan] || POR_AUX[prob.aux];
      var chamado = m.destino === 'costeira' ? COSTEIRA.nome : L.todos;
      var cab = [
        P('Sinal de urgência, três vezes', 'PAN PAN, PAN PAN, PAN PAN', 'RR 33.12', { pron: PRON['PAN PAN'] }),
        P(m.destino === 'costeira' ? 'Estação chamada, três vezes' : '"A todas as estações", três vezes', tres(chamado), 'RR 33.12', { pron: PRON[chamado] }),
        P('"Aqui é"', L.este, 'RR 33.12', { pron: PRON[L.este] }),
        P('Nome do barco, três vezes', tres(nome), 'RR 33.12'),
        partesId(ctx, 'RR 33.12', true)];
      var texto = [
        P('Posição', posFala(m.pos, ctx.lang), 'RR 33.12', { dito: posDito(m.pos, ctx.lang, ctx.alg) }),
        P('O problema', ctx.lang === 'pt' ? prob.pt : prob.en, 'RR 33.11'),
        P('Auxílio desejado', ctx.lang === 'pt' ? aux.pt : aux.en, ''),
        P('Outras informações', outras(ctx), ''),
        P('Fim da fala: sua vez (uso corrente)', L.cambio, '', { pron: PRON[L.cambio] })];
      if (m.canalTrabalho) {
        var ch = m.canalPan || '72';
        return [
          { titulo: 'Chamada de urgência no 16', canal: '16', ref: 'RR 33.12 e 33.9A', partes: cab.concat([
            P('Canal onde vai a mensagem (mensagem longa ou médica, RR 33.9A)', L.msgCanal + ' ' + ch, 'RR 33.12', { dito: dizer(ch, ctx.lang, ctx.alg) })]) },
          { titulo: 'Chamada e mensagem no canal ' + ch, canal: ch, ref: 'RR 33.12', partes: cab.map(function (p) { return Object.assign({}, p); }).concat(texto) }];
      }
      return [{ titulo: 'Chamada e mensagem de urgência no 16', canal: '16', ref: 'RR 33.12', partes: cab.concat(texto) }];
    },
    securite: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, m = ctx.m, nome = B.nome.toUpperCase();
      var av = POR_AVISO[m.aviso] || AVISOS[0];
      var cab = [
        P('Sinal de segurança, três vezes', 'SECURITE, SECURITE, SECURITE', 'RR 33.35', { pron: PRON.SECURITE }),
        P('"A todas as estações", três vezes', tres(L.todos), 'RR 33.35', { pron: PRON[L.todos] }),
        P('"Aqui é"', L.este, 'RR 33.35', { pron: PRON[L.este] }),
        P('Nome do barco, três vezes', tres(nome), 'RR 33.35'),
        partesId(ctx, 'RR 33.35', false)];
      var texto = [
        P('O aviso', ctx.lang === 'pt' ? av.pt : av.en, 'RR 33.34'),
        P('Onde', posFala(m.pos, ctx.lang), '', { dito: posDito(m.pos, ctx.lang, ctx.alg) }),
        P('Fim: ninguém precisa responder (uso corrente)', L.fim, '', { pron: PRON[L.fim] })];
      if (m.modoSec === 'trabalho') {
        var ch = m.canalSec || '13';
        return [
          { titulo: 'Anúncio de segurança no 16', canal: '16', ref: 'RR 33.31B e 33.32', partes: cab.concat([
            P('Canal onde vai a mensagem (RR 33.32)', L.msgCanal + ' ' + ch, 'RR 33.32', { dito: dizer(ch, ctx.lang, ctx.alg) })]) },
          { titulo: 'Chamada e mensagem no canal ' + ch, canal: ch, ref: 'RR 33.35', partes: cab.map(function (p) { return Object.assign({}, p); }).concat(texto) }];
      }
      return [{ titulo: 'Aviso curto no 16 (até 1 minuto)', canal: '16', ref: 'RR 33.32; UIT-R M.1171-1, §20(5)', partes: cab.concat(texto) }];
    },
    rotina: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, m = ctx.m, nome = B.nome.toUpperCase();
      var marina = m.chamado === 'marina';
      var outro = marina ? MARINA.nome : GAIVOTA.nome;
      var canalChamada = marina ? MARINA.canal : '16';
      var ch = marina ? MARINA.canal : (m.canalRot || '72');
      var assunto = VL.semAcento(m.assunto || '').toUpperCase() || (marina ? (ctx.lang === 'pt' ? 'PEDIMOS VAGA PARA ESTA NOITE' : 'REQUEST A BERTH FOR TONIGHT') : (ctx.lang === 'pt' ? 'VAMOS FUNDEAR NA ENSEADA DO NORTE' : 'WE WILL ANCHOR IN NORTH COVE'));
      var g1 = { titulo: marina ? 'Chamada no canal da marina (' + MARINA.canal + ', fictício)' : 'Chamada no 16', canal: canalChamada, ref: 'UIT-R M.1171-1, §8 e §20(4)', partes: [
        P('Estação chamada (até três vezes)', tres(outro), 'M.1171-1, §8(1)'),
        P('"Aqui é"', L.este, 'M.1171-1, §8(1)', { pron: PRON[L.este] }),
        P('Seu barco (até três vezes)', tres(nome), 'M.1171-1, §8(1)')] };
      if (!marina) g1.partes.push(P('Canal proposto para a conversa (entre navios)', L.canal + ' ' + ch, 'M.1171-1, §20(4)', { dito: dizer(ch, ctx.lang, ctx.alg) }));
      g1.partes.push(P('Sua vez (uso corrente)', L.cambio, '', { pron: PRON[L.cambio] }));
      var g2 = { titulo: marina ? 'Conversa no ' + ch : 'Conversa no canal ' + ch, canal: ch, ref: 'UIT-R M.1171-1, §8(4)', partes: [
        P('Quem você chama e quem fala (agora basta uma vez)', outro + ', ' + L.este + ' ' + nome, 'M.1171-1, §8(4)'),
        P('O assunto', assunto, ''),
        P('Sua vez (uso corrente)', L.cambio, '', { pron: PRON[L.cambio] })] };
      var g3 = { titulo: 'Para encerrar', canal: ch, ref: '', partes: [
        P('Despedida e encerramento: conversa terminada (uso corrente)', outro + ', ' + L.este + ' ' + nome + '. ' + L.fim, '', { pron: PRON[L.fim] })] };
      return [g1, g2, g3];
    },
    relay: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, m = ctx.m, nome = B.nome.toUpperCase();
      var nat = POR_NAT[m.natRelay] || POR_NAT['105'];
      var chamado = m.destRelay === 'todos' ? L.todos : COSTEIRA.nome;
      var outroNome = m.viu ? (ctx.lang === 'pt' ? 'BARCO NÃO IDENTIFICADO' : 'UNIDENTIFIED VESSEL') : ESTRELA.nome;
      return [
        { titulo: 'Chamada de retransmissão de socorro', canal: '16', ref: 'RR 32.19E', partes: [
          P('Sinal, três vezes', 'MAYDAY RELAY, MAYDAY RELAY, MAYDAY RELAY', 'RR 32.19E', { pron: PRON['MAYDAY RELAY'] }),
          P(m.destRelay === 'todos' ? '"A todas as estações", três vezes' : 'Nome da estação costeira, três vezes', tres(chamado), 'RR 32.19E', { pron: PRON[chamado] }),
          P('"Aqui é"', L.este, 'RR 32.19E', { pron: PRON[L.este] }),
          P('Seu barco (quem retransmite), três vezes', tres(nome), 'RR 32.19E'),
          partesId(ctx, 'RR 32.19E', true)] },
        { titulo: 'Mensagem: repita o que sabe do barco em perigo', canal: '16', ref: 'RR 32.19F', partes: [
          P('Sinal de socorro e o barco em perigo' + (m.viu ? ' (sem nome: diga como ele é, RR nota 32.19F.1)' : ''), 'MAYDAY, ' + outroNome + (m.viu ? '' : ', MMSI ' + ESTRELA.mmsi), 'RR 32.19F e 32.42',
            { dito: m.viu ? '' : 'MMSI ' + dizer(ESTRELA.mmsi, ctx.lang, ctx.alg) }),
          P('Posição do barco em perigo', posFala(m.posRelay, ctx.lang), 'RR 32.19F', { dito: posDito(m.posRelay, ctx.lang, ctx.alg) }),
          P('Natureza do perigo', ctx.lang === 'pt' ? nat.pt : nat.en, 'RR 32.19F'),
          P('Pessoas a bordo e auxílio', (m.pessoasRelay || 3) + ' ' + L.pessoas + ', ' + (ctx.lang === 'pt' ? POR_AUX.imediato.pt : POR_AUX.imediato.en), 'RR 32.19F'),
          P('Sua vez (uso corrente)', L.cambio, '', { pron: PRON[L.cambio] })] }];
    },
    recibo: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, nome = B.nome.toUpperCase();
      return [{ titulo: 'Recibo por voz de um MAYDAY', canal: '16', ref: 'RR 32.23', partes: [
        P('Sinal de socorro', 'MAYDAY', 'RR 32.23', { pron: PRON.MAYDAY }),
        P('Nome e indicativo (ou MMSI) de quem pediu socorro', ESTRELA.nome + ', ' + L.ind + ' ' + ESTRELA.ind, 'RR 32.23', { dito: dizer(ESTRELA.ind, ctx.lang, ctx.alg) }),
        P('"Aqui é"', L.este, 'RR 32.23', { pron: PRON[L.este] }),
        P('Seu nome e indicativo', nome + ', ' + L.ind + ' ' + B.ind, 'RR 32.23', { dito: dizer(B.ind, ctx.lang, ctx.alg) }),
        P('"Recebido"', L.recebido, 'RR 32.23', { pron: PRON[L.recebido] }),
        P('Sinal de socorro', 'MAYDAY', 'RR 32.23')] }];
    },
    cancelar: function (ctx) {
      var L = PW[ctx.lang], B = ctx.B, nome = B.nome.toUpperCase();
      var hora = ctx.m.horaAlerta || utcAgora();
      return [{ titulo: 'Cancelamento por voz no 16', canal: '16', ref: 'RR 32.53E', partes: [
        P('"A todas as estações", três vezes', tres(L.todos), 'RR 32.53E', { pron: PRON[L.todos] }),
        P('"Aqui é"', L.este, 'RR 32.53E', { pron: PRON[L.este] }),
        P('Nome do barco, três vezes', tres(nome), 'RR 32.53E'),
        partesId(ctx, 'RR 32.53E', true),
        P('Pedido de cancelamento com a hora UTC do alerta', L.cancelar + ' ' + hora + ' ' + L.utc, 'RR 32.53E', { pron: PRON[L.cancelar], dito: dizer(hora, ctx.lang, ctx.alg) + ' UTC' }),
        P('Sua vez (uso corrente)', L.cambio, '', { pron: PRON[L.cambio] })] }];
    },
    seelonce: function (ctx) {
      var L = PW[ctx.lang];
      return [{ titulo: 'O que você ouve (exemplo da costeira fictícia)', canal: '16', ref: 'RR 32.46 e 32.47', ouvir: true, partes: [
        P('Para todas as estações (ou para uma só estação)', tres(L.todos), 'RR 32.46', { pron: PRON[L.todos] }),
        P('"Aqui é" e quem impõe o silêncio', L.este + ' ' + COSTEIRA.nome, 'RR 32.46'),
        P('Ordem de silêncio', 'SEELONCE MAYDAY', 'RR 32.47', { pron: PRON['SEELONCE MAYDAY'] })] }];
    },
    feenee: function (ctx) {
      var L = PW[ctx.lang];
      var hora = utcAgora();
      return [{ titulo: 'O que você ouve (exemplo da costeira fictícia)', canal: '16', ref: 'RR 32.52', ouvir: true, partes: [
        P('Sinal de socorro', 'MAYDAY', 'RR 32.52', { pron: PRON.MAYDAY }),
        P('"A todas as estações", três vezes', tres(L.todos), 'RR 32.52', { pron: PRON[L.todos] }),
        P('"Aqui é"', L.este, 'RR 32.52', { pron: PRON[L.este] }),
        P('Quem controlou o socorro, três vezes', tres(COSTEIRA.nome), 'RR 32.52'),
        P('Hora em que a mensagem foi entregue', hora + ' ' + L.utc, 'RR 32.52', { dito: dizer(hora, ctx.lang, 'simples') + ' UTC' }),
        P('MMSI, nome e indicativo de quem estava em perigo', 'MMSI ' + ESTRELA.mmsi + ', ' + ESTRELA.nome + ', ' + L.ind + ' ' + ESTRELA.ind, 'RR 32.52'),
        P('Fim do silêncio', 'SEELONCE FEENEE', 'RR 32.52', { pron: PRON['SEELONCE FEENEE'] })] }];
    },
  };

  /* Resposta da estação (fictícia) a cada transmissão */
  function resposta(tipo, ctx, grupoIdx) {
    var L = PW[ctx.lang], nome = ctx.B.nome.toUpperCase(), m = ctx.m;
    if (tipo === 'mayday' || tipo === 'relay') return { de: COSTEIRA.nome, canal: '16', ref: 'forma do RR 32.23', linhas: [
      'MAYDAY', nome + ', ' + L.ind + ' ' + ctx.B.ind, L.este, COSTEIRA.nome + ', MMSI ' + COSTEIRA.mmsi, L.recebido, 'MAYDAY'],
      depois: ctx.lang === 'pt' ? nome + ', ' + COSTEIRA.nome + ': mantenha escuta no canal 16 e informe qualquer mudança. ' + L.cambio
        : nome + ', ' + COSTEIRA.nome + ': KEEP LISTENING ON CHANNEL 16 AND REPORT ANY CHANGE. ' + L.cambio };
    if (tipo === 'panpan') {
      if (m.canalTrabalho && grupoIdx === 0) return null;
      return { de: COSTEIRA.nome, canal: m.canalTrabalho ? (m.canalPan || '72') : '16', ref: 'forma de resposta da UIT-R M.1171-1, §14; o RR não fixa um recibo para urgência',
        linhas: [nome + ', ' + L.este + ' ' + COSTEIRA.nome, L.recebido + ' PAN PAN'],
        depois: ctx.lang === 'pt' ? 'Vamos acionar apoio. Mantenha escuta e informe se a situação piorar. ' + L.cambio : 'WE WILL ARRANGE ASSISTANCE. KEEP WATCH AND REPORT IF THE SITUATION GETS WORSE. ' + L.cambio };
    }
    if (tipo === 'rotina') {
      var marina = m.chamado === 'marina', outro = marina ? MARINA.nome : GAIVOTA.nome, ch = marina ? MARINA.canal : (m.canalRot || '72');
      if (grupoIdx === 0) return { de: outro, canal: marina ? MARINA.canal : '16', ref: 'resposta: UIT-R M.1171-1, §14 e §21', linhas: [nome + ', ' + L.este + ' ' + outro + (marina ? '' : ', ' + L.canal + ' ' + ch), L.cambio], muda: ch };
      if (grupoIdx === 1) return { de: outro, canal: ch, ref: 'exemplo', linhas: [nome + ', ' + L.este + ' ' + outro + (ctx.lang === 'pt' ? ': entendido.' : ': UNDERSTOOD.'), L.cambio] };
      return { de: outro, canal: ch, ref: 'exemplo', linhas: [nome + ', ' + L.este + ' ' + outro + '. ' + L.fim], volta16: true };
    }
    if (tipo === 'cancelar') return { de: COSTEIRA.nome, canal: '16', ref: 'exemplo', linhas: [nome + ', ' + L.este + ' ' + COSTEIRA.nome + (ctx.lang === 'pt' ? ': recebido o cancelamento.' : ': RECEIVED, ALERT CANCELLED.'), L.fim] };
    return null;
  }

  /* ===================== Desafios ===================== */
  var OP = { mayday: 'MAYDAY', panpan: 'PAN PAN', securite: 'SÉCURITÉ', rotina: 'Chamada de rotina', relay: 'MAYDAY RELAY' };
  var SITUACOES = [
    { p: 'Um tripulante caiu na água à noite e vocês já o perderam de vista.', r: 'mayday',
      e: 'Há perigo grave e iminente para uma pessoa, que precisa de auxílio imediato (RR 32.9). "Homem ao mar" é uma das naturezas de socorro do DSC (UIT-R M.493-16, símbolo 110).' },
    { p: 'Motor parado e sem vento. O barco deriva devagar e as pedras mais próximas estão a 2 milhas. Ninguém corre perigo agora, mas vocês vão precisar de reboque.', r: 'panpan',
      e: 'É urgente para a segurança do barco, mas o perigo não é grave nem iminente: PAN PAN (RR 33.11). Se a situação piorar, passe a MAYDAY.' },
    { p: 'A âncora garrou, o motor não pega, as ondas estão fortes e as pedras estão a 50 metros.', r: 'mayday',
      e: 'Agora o perigo é grave e iminente, e vocês precisam de auxílio imediato (RR 32.9): MAYDAY, com o alerta DSC primeiro.' },
    { p: 'Vocês passam por um tronco grande à deriva no meio do canal de navegação.', r: 'securite',
      e: 'É um perigo para a navegação dos outros: aviso de segurança, SÉCURITÉ (RR 33.34 e 33.34B). Como interessa a quem está por perto, anuncie por voz (RR 33.31A).' },
    { p: 'Um tripulante cortou a mão: o sangramento está controlado, mas vocês querem orientação médica.', r: 'panpan',
      e: 'Pedido de orientação médica pode ser precedido do sinal de urgência (RR 33.11A). Mensagem médica vai num canal de trabalho (RR 33.9A).' },
    { p: 'Começou um incêndio na casa de máquinas e vocês não conseguem apagar.', r: 'mayday',
      e: 'Incêndio fora de controle é perigo grave e iminente: MAYDAY (RR 32.9). No DSC, a natureza é "incêndio ou explosão" (M.493, símbolo 100).' },
    { p: 'Você ouve um MAYDAY no 16. Passam 5 minutos e nenhuma estação costeira nem outro barco responde.', r: 'relay', ops: ['relay', 'panpan', 'securite', 'nada'],
      e: 'Depois de 5 minutos sem recibo, acuse o recebimento ao barco em perigo e retransmita o socorro com MAYDAY RELAY a uma costeira, por qualquer meio (RR 32.17 e 32.29A).' },
    { p: 'Você vê um barco afundando perto de vocês. Ele não tem rádio.', r: 'relay',
      e: 'Quem sabe que outro barco está em perigo e que ele não consegue pedir socorro deve retransmitir: MAYDAY RELAY (RR 32.16 e 32.18).' },
    { p: 'Você quer combinar com um barco amigo o lugar do fundeio de hoje à noite.', r: 'rotina',
      e: 'Chamada de rotina: chame no 16 (ou por DSC individual), proponha um canal entre navios e mude para ele (UIT-R M.1171-1, §20(4)).' },
    { p: 'Você apertou o botão DISTRESS sem querer e o alerta saiu.', r: 'cancelar', ops: ['desligar', 'cancelar', 'nada', 'securite'],
      e: 'Cancele o alerta: pelo DSC, se o rádio permitir, e sempre por voz no 16 com a hora UTC do alerta (RR 32.53B a 32.53E; UIT-R M.541-11, A3-1.7). Desligar não desfaz o alerta já recebido. Normalmente, nenhuma ação é tomada contra quem informa e cancela um alerta falso (RR 32.10A).' },
    { p: 'O mastro quebrou. Ninguém se feriu e o barco não corre risco imediato, mas está sem propulsão a 10 milhas da costa.', r: 'panpan',
      e: 'Situação urgente para a segurança do barco, sem perigo grave e iminente: PAN PAN (RR 33.11).' },
    { p: 'Depois de um abalroamento, há um rombo e entra água mais rápido do que a bomba consegue tirar.', r: 'mayday',
      e: 'O barco pode afundar: perigo grave e iminente, MAYDAY (RR 32.9). Natureza no DSC: abalroamento ou alagamento (M.493).' },
    { p: 'À noite, você nota que uma boia de sinalização do canal está apagada.', r: 'securite',
      e: 'Informação importante para a segurança da navegação: SÉCURITÉ (RR 33.34).' },
    { p: 'Você precisa pedir à marina uma vaga para passar a noite.', r: 'rotina',
      e: 'Chamada de rotina, de preferência direto no canal de trabalho da marina, para não ocupar o 16 (UIT-R M.1171-1, §12(1)).' },
  ];
  var OP_EXTRA = { nada: 'Ficar quieto e só escutar', desligar: 'Desligar o rádio', cancelar: 'Cancelar pelo DSC e por voz no 16' };
  var CANAL_Q = [
    { p: 'Em que canal o rádio envia o alerta DSC de socorro?', ops: ['16', '70', '13', '06'], r: '70', e: 'O 70 é exclusivo para DSC de socorro, segurança e chamada (RR, Apêndice 18, nota j). O alerta sai nele (UIT-R M.541-11, A3-1.1).' },
    { p: 'Depois do alerta DSC, em que canal você fala o MAYDAY?', ops: ['70', '16', '06', '13'], r: '16', e: 'A voz vai no 16, o canal de socorro por radiotelefonia (RR 32.13C; UIT-R M.541-11, A3-1.3).' },
    { p: 'Um navio cruza à frente e você quer combinar a manobra ponte a ponte. Qual canal foi designado no mundo todo para a segurança da navegação?', ops: ['13', '16', '72', '70'], r: '13', e: 'O 13 é o canal de segurança da navegação, principalmente entre navios (RR, Apêndice 18, nota k).' },
    { p: 'Durante uma busca, um helicóptero de salvamento quer falar com o seu barco. Além do 16, que canal o Apêndice 15 indica para navios e aeronaves em busca e salvamento?', ops: ['06', '70', '24', '75'], r: '06', e: 'O 6 (156,300 MHz) serve para navios e aeronaves em operações coordenadas de busca e salvamento (RR, Apêndice 15, Tabela 15-2).' },
    { p: 'Você chamou um barco amigo no 16. Para que canal vocês devem passar para conversar?', ops: ['72', '16', '70', '24'], r: '72', e: 'Um canal entre navios, como o 72 (RR, Apêndice 18). O 16 é só para chamar; o 70 é só DSC; o 24 é duplex (duas frequências), e dois barcos não se ouvem nele.' },
    { p: 'Qual canal nunca deve ser usado para voz?', ops: ['70', '16', '13', '06'], r: '70', e: 'O 70 é exclusivo para DSC (RR, Apêndice 18, nota j).' },
    { p: 'Para falar entre a proa e o cockpit com potência de até 1 W, que canais o Apêndice 18 permite?', ops: ['15 e 17', '16 e 70', '75 e 76', '06 e 13'], r: '15 e 17', e: 'Os canais 15 e 17 também servem para comunicações a bordo, com até 1 W (RR, Apêndice 18, nota g).' },
    { p: 'Qual é a potência máxima de transmissão do rádio VHF de uma estação de navio?', ops: ['25 W', '1 W', '50 W', '100 W'], r: '25 W', e: 'A potência da estação de navio não pode passar de 25 W (RR 52.260), e o rádio deve reduzir fácil para 1 W ou menos nas curtas distâncias (UIT-R M.489-2, §1.2.4).' },
  ];

  /* ===================== Áudio (Web Audio, só depois de um toque) ===================== */
  function Audio() {
    var ctx = null, fonte = null;
    function abrir() {
      if (ctx) { if (ctx.state === 'suspended' && ctx.resume) ctx.resume(); return ctx; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { ctx = null; }
      return ctx;
    }
    function chiado(on) {
      if (!ctx) return;
      if (on && !fonte) {
        var n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        fonte = ctx.createBufferSource(); fonte.buffer = buf; fonte.loop = true;
        var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.5;
        var g = ctx.createGain(); g.gain.value = 0.03;
        fonte.connect(bp); bp.connect(g); g.connect(ctx.destination);
        fonte.start();
      } else if (!on && fonte) { try { fonte.stop(); } catch (e) { /* já parou */ } fonte.disconnect(); fonte = null; }
    }
    function bipe(f, dur, vol) {
      if (!ctx) return;
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(vol || 0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
    }
    function fechar() { chiado(false); if (ctx) { try { ctx.close(); } catch (e) { /* ignora */ } ctx = null; } }
    return { abrir: abrir, chiado: chiado, bipe: bipe, fechar: fechar, aberto: function () { return !!ctx; } };
  }

  var RUIDO = 2; // nível do chiado (0–10): squelch acima disso fecha o alto-falante quando ninguém fala
  var TRAFEGO = [ // exemplos fictícios de tráfego
    { canal: '16', forca: 3, de: 'um veleiro distante', txt: 'MARESIA, MARESIA, THIS IS BOREAL, CHANNEL 77, OVER.' },
    { canal: '16', forca: 7, de: 'uma lancha por perto', txt: 'BOREAL, THIS IS MARESIA, CHANNEL 77, OVER.' },
    { canal: '13', forca: 6, de: 'um navio de carga', txt: 'NAVIO EM SAÍDA DO CANAL, PASSO PELO SEU BOMBORDO. (exemplo)' },
    { canal: '77', forca: 5, de: 'Boreal e Maresia', txt: 'MARESIA, THIS IS BOREAL: ENCONTRO NA ENSEADA ÀS 18 HORAS. OVER.' },
    { canal: '16', forca: 2, de: 'uma estação muito fraca', txt: '…GAIVOTA… THIS IS… (sinal muito fraco)' },
  ];

  /* ===================== Widget ===================== */
  VL.widgets.define('vhf-sim', {
    css: ['assets/css/widgets/vhf-sim.css'],
    scripts: ['widgets/alfabeto-fonetico.js'],
    mount: function (el, opts) {
      opts = opts || {};
      var uid = Math.random().toString(36).slice(2, 8);
      var TODOS = ['explorar', 'montar', 'desafio'];
      var modos = (Array.isArray(opts.modos) ? opts.modos : TODOS).filter(function (m) { return TODOS.indexOf(m) >= 0; });
      if (!modos.length) modos = TODOS;
      var barcoSalvo = VL.store.get('vhf-sim.barco', null) || {};
      var oB = opts.barco || {};
      var B = {
        nome: oB.nome || barcoSalvo.nome || 'Albatroz',
        ind: (oB.indicativo || barcoSalvo.ind || 'PQ4821').toUpperCase(),
        mmsi: String(oB.mmsi || barcoSalvo.mmsi || '710123456'),
      };
      var SEG = Math.max(2, Math.min(10, Number(opts.segurar) || 5));
      var timers = [];
      function depois(fn, ms) { var t = setTimeout(function () { timers = timers.filter(function (x) { return x !== t; }); fn(); }, ms); timers.push(t); return t; }
      function cancelarTimer(t) { if (!t) return; clearTimeout(t); timers = timers.filter(function (x) { return x !== t; }); }

      var r = { // estado do rádio
        canal: POR_CANAL[opts.canal] ? opts.canal : (POR_CANAL[pad(opts.canal, 2)] ? pad(opts.canal, 2) : '16'),
        pot: 25, sq: 2, som: false, tx: false, txIni: 0,
        dsc: 'livre', tampa: false, segurando: false, segIni: 0, alertaHora: null, repeteEm: 0, ackTm: null, avisoTx: '',
        trafego: opts.trafego !== false, visivel: true, falandoRx: false, dscMsg: '',
      };
      var msg = {
        tipo: GERA[opts.mensagem] ? opts.mensagem : 'mayday',
        lang: opts.idioma === 'pt' ? 'pt' : 'intl', alg: opts.algarismos === 'uit' ? 'uit' : 'simples',
        natureza: '107', auxilio: 'imediato', pessoas: Math.max(1, Math.min(99, Number(oB.pessoas || barcoSalvo.pessoas) || 4)), outras: '',
        pos: { modo: 'coord', latG: 23, latM: '05,0', latH: 'S', lonG: 43, lonM: '10,0', lonH: 'W', dist: 3, dir: 'S', ponto: 'Ilha Rasa' },
        problema: 'motor', auxPan: '', destino: 'todos', canalTrabalho: false, canalPan: '72',
        aviso: 'tronco', modoSec: 'curto', canalSec: '13',
        chamado: 'barco', canalRot: '72', assunto: '',
        dscCat: 'rotina', dscDest: 'individual', dscMmsi: GAIVOTA.mmsi, dscCanal: '72',
        destRelay: 'costeira', natRelay: '105', pessoasRelay: 3, viu: false,
        posRelay: { modo: 'coord', latG: 23, latM: '07,5', latH: 'S', lonG: 43, lonM: '12,0', lonH: 'W', dist: 2, dir: 'E', ponto: 'Ilha Rasa' },
        horaAlerta: '', passo: false,
      };
      var est = { modo: modos.indexOf(opts.modo) >= 0 ? opts.modo : modos[0] };
      var audio = Audio();
      var voz = VL.fonetico ? VL.fonetico.voz : { ok: function () { return false; }, falar: function () { }, parar: function () { } };
      function ctxMsg() { return { B: { nome: B.nome, ind: B.ind, mmsi: B.mmsi }, lang: msg.lang, alg: msg.alg, m: msg }; }
      function salvarBarco() { VL.store.set('vhf-sim.barco', { nome: B.nome, ind: B.ind, mmsi: B.mmsi, pessoas: msg.pessoas }); }

      /* ---------- Moldura ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Rádio VHF marítimo com DSC (simulador)', controlesAntes: true });
      var raiz = ins.raiz; raiz.classList.add('vhf-raiz');
      var segModo = h('div', { class: 'segmented vhf-modos', role: 'tablist', 'aria-label': 'Modo do simulador de rádio' });
      var ROT_MODO = { explorar: 'Explorar o rádio', montar: 'Montar chamada', desafio: 'Desafio' };
      modos.forEach(function (m) { segModo.appendChild(h('button', { type: 'button', role: 'tab', 'data-v': m, onclick: function () { trocarModo(m); } }, ROT_MODO[m])); });
      if (modos.length > 1) ins.controles.appendChild(segModo);
      ins.legenda.appendChild(h('span', { class: 'vhf-fontes' }, 'Fontes: UIT, Regulamento de Radiocomunicações (ed. 2024), Art. 32, 33 e 52, Apêndices 14, 15 e 18; UIT-R M.493-16, M.541-11, M.489-2 e M.1171-1. Estações e números dos exemplos são fictícios.'));

      var grade = h('div', { class: 'vhf-grade' });
      var colRadio = h('div', { class: 'vhf-col-radio' });
      var colPainel = h('div', { class: 'vhf-col-painel' });
      grade.appendChild(colRadio); grade.appendChild(colPainel);
      ins.corpo.appendChild(grade);
      el.appendChild(raiz);

      /* ---------- Face do rádio ---------- */
      var lcd = {
        txrx: h('span', { class: 'vhf-ind vhf-ind-txrx' }, 'RX'),
        pot: h('span', { class: 'vhf-ind' }, '25 W'),
        dsc: h('span', { class: 'vhf-ind' }, 'DSC'),
        sq: h('span', { class: 'vhf-sq', 'aria-hidden': 'true' }),
        hora: h('span', { class: 'vhf-ind vhf-hora' }),
        canal: h('span', { class: 'vhf-lcd-canal' }),
        freq: h('span', { class: 'vhf-lcd-freq' }),
        uso: h('span', { class: 'vhf-lcd-uso' }),
        status: h('span', { class: 'vhf-lcd-status', role: 'status', 'aria-live': 'polite' }),
        pos: h('span', { class: 'vhf-lcd-pos' }),
      };
      for (var k = 0; k < 10; k++) lcd.sq.appendChild(h('i'));
      var tela = h('div', { class: 'vhf-lcd', 'aria-label': 'Display do rádio' },
        h('div', { class: 'vhf-lcd-topo' }, lcd.txrx, lcd.pot, lcd.dsc, h('span', { class: 'vhf-ind vhf-ind-sq' }, 'SQ ', lcd.sq), lcd.hora),
        h('div', { class: 'vhf-lcd-meio' }, h('span', { class: 'vhf-lcd-ch' }, 'canal'), lcd.canal, h('span', { class: 'vhf-lcd-lado' }, lcd.freq, lcd.uso)),
        lcd.status, lcd.pos);

      // seletor giratório de canal (role slider)
      var knobInd = h('span', { class: 'vhf-knob-ind' });
      var knob = h('div', { class: 'vhf-knob', role: 'slider', tabindex: '0', 'aria-label': 'Seletor de canal (arraste em círculo ou use as setas)',
        'aria-valuemin': '0', 'aria-valuemax': String(CANAIS.length - 1) }, knobInd);
      var btnMenos = h('button', { type: 'button', class: 'vhf-tecla vhf-tecla-seta', 'aria-label': 'Canal anterior', onclick: function () { passoCanal(-1); } }, VL.icon('baixo', 20));
      var btnMais = h('button', { type: 'button', class: 'vhf-tecla vhf-tecla-seta vhf-seta-cima', 'aria-label': 'Próximo canal', onclick: function () { passoCanal(1); } }, VL.icon('baixo', 20));
      var btn169 = h('button', { type: 'button', class: 'vhf-tecla', 'aria-label': 'Tecla 16/9: vai para o canal 16; de novo, para o 9', onclick: function () { tecla169(); } }, '16/9');
      var btnPot = h('button', { type: 'button', class: 'vhf-tecla', 'aria-label': 'Potência: alterna entre 25 W e 1 W', onclick: function () { trocarPot(); } }, 'Potência');
      var btnDscMenu = h('button', { type: 'button', class: 'vhf-tecla', 'aria-label': 'Menu DSC: compor uma chamada digital', onclick: function () { abrirMenuDsc(); } }, 'DSC');
      var sqIn = h('input', { type: 'range', min: '0', max: '10', step: '1', value: String(r.sq), class: 'vhf-sq-in', 'aria-label': 'Squelch (corta o chiado)', oninput: function () { r.sq = +sqIn.value; atualizarLcd(); atualizarSom(); } });
      var tampa = h('button', { type: 'button', class: 'vhf-tampa', 'aria-expanded': 'false', 'aria-label': 'Tampa do botão DISTRESS, fechada. Toque para levantar.', onclick: function () { abrirTampa(!r.tampa); } },
        h('span', { class: 'vhf-tampa-txt' }, 'DISTRESS'), h('span', { class: 'vhf-tampa-dica' }, 'levante a tampa'));
      var btnDistress = h('button', { type: 'button', class: 'vhf-distress', disabled: true, 'aria-label': 'Botão DISTRESS: segure ' + SEG + ' segundos para enviar o alerta de socorro' },
        h('span', null, 'DISTRESS'), h('small', null, 'segure ' + SEG + ' s'));
      var btnPtt = h('button', { type: 'button', class: 'vhf-ptt', 'aria-label': 'Falar (PTT): segure para transmitir, solte para ouvir' }, h('span', null, 'Falar'), h('small', null, 'segure (PTT)'));
      var radio = h('div', { class: 'vhf-radio', role: 'group', 'aria-label': 'Rádio VHF simulado' },
        h('div', { class: 'vhf-radio-topo' }, h('span', { class: 'vhf-marca' }, 'VHF marítimo · DSC classe D'), h('span', { class: 'vhf-grelha', 'aria-hidden': 'true' })),
        tela,
        h('div', { class: 'vhf-controles' },
          h('div', { class: 'vhf-sel' }, btnMenos, knob, btnMais),
          h('div', { class: 'vhf-teclas' }, btn169, btnPot, btnDscMenu),
          h('label', { class: 'vhf-sq-campo' }, h('span', null, 'Squelch'), sqIn),
          h('div', { class: 'vhf-baixo' },
            h('div', { class: 'vhf-distress-caixa' }, btnDistress, tampa),
            btnPtt)));
      colRadio.appendChild(radio);

      /* alto-falante e registro */
      var log = h('ol', { class: 'vhf-log', 'aria-live': 'polite', 'aria-label': 'Alto-falante e registro do rádio' });
      var logCaixa = h('section', { class: 'vhf-log-caixa', 'aria-label': 'Alto-falante e registro' },
        h('div', { class: 'vhf-log-cab' }, h('h3', { class: 'vhf-h' }, 'Alto-falante e registro'),
          h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { log.innerHTML = ''; logVazio(); } }, 'Limpar')),
        log);
      colRadio.appendChild(logCaixa);
      function logVazio() { if (!log.children.length) log.appendChild(h('li', { class: 'vhf-log-vazio' }, 'O que o rádio ouvir e transmitir aparece aqui.')); }
      function addLog(tipo, quem, txt, extra) {
        var v = VL.$('.vhf-log-vazio', log); if (v) v.remove();
        var li = h('li', { class: 'vhf-log-item', 'data-tipo': tipo },
          h('span', { class: 'vhf-log-quem' }, (extra && extra.canal ? 'Canal ' + extra.canal + ' · ' : '') + quem),
          h('span', { class: 'vhf-log-txt' }, txt),
          extra && extra.ref ? h('span', { class: 'vhf-log-ref' }, extra.ref) : null);
        log.appendChild(li);
        while (log.children.length > 60) log.removeChild(log.firstChild);
        log.scrollTop = log.scrollHeight;
        return li;
      }
      logVazio();

      /* ---------- Display ---------- */
      function usoCurto(c) {
        if (ESPECIAL[c.c] && ESPECIAL[c.c].curto) return ESPECIAL[c.c].curto;
        if (c.publica) return 'Correspondência pública e portuário (duplex)';
        if (c.navios && c.porto1) return 'Entre navios e portuário';
        if (c.navios) return 'Entre navios';
        return 'Operações portuárias';
      }
      function atualizarLcd() {
        var c = POR_CANAL[r.canal];
        lcd.canal.textContent = r.canal;
        lcd.freq.textContent = c.fn + ' MHz' + (duplex(c) ? ' · duplex' : ' · simplex');
        lcd.uso.textContent = usoCurto(c);
        lcd.pot.textContent = r.pot + ' W';
        lcd.txrx.textContent = r.tx ? 'TX' : 'RX';
        lcd.txrx.setAttribute('data-on', r.tx ? 'tx' : (r.falandoRx ? 'rx' : ''));
        lcd.dsc.setAttribute('data-on', r.dsc !== 'livre' ? '1' : '0');
        VL.$$('i', lcd.sq).forEach(function (seg, i) { seg.setAttribute('data-on', i < r.sq ? '1' : '0'); });
        lcd.hora.textContent = utcBonito(utcAgora());
        lcd.pos.textContent = (posTxt(msg.pos) || '23°05,0\'S 043°10,0\'W') + ' · MMSI ' + B.mmsi;
        var st;
        if (r.segurando) st = 'Segure… ' + VL.fmt.num(Math.max(0, SEG - (Date.now() - r.segIni) / 1000), 1) + ' s';
        else if (r.dsc === 'enviando') st = 'Enviando alerta de socorro no 70…';
        else if (r.dsc === 'aguardando') st = 'Alerta enviado · aguardando recibo · repete em ' + VL.fmt.min(Math.max(0, (r.repeteEm - Date.now()) / 1000));
        else if (r.dsc === 'ack') st = 'Recibo DSC recebido · fale o MAYDAY no 16';
        else if (r.dsc === 'voz') st = 'Socorro em andamento · escuta no 16';
        else if (r.dscMsg) st = r.dscMsg;
        else if (r.tx) st = 'Transmitindo… ' + Math.floor((Date.now() - r.txIni) / 1000) + ' s' + (r.avisoTx ? ' · ' + r.avisoTx : '');
        else st = r.canal === '70' ? 'Canal 70: só dados DSC' : (r.sq < RUIDO ? 'Chiado: squelch aberto' : 'Escuta no ' + r.canal + ' · DSC no 70');
        lcd.status.textContent = st;
        lcd.status.setAttribute('data-alerta', ['enviando', 'aguardando', 'ack'].indexOf(r.dsc) >= 0 || r.segurando ? '1' : '0');
        knob.setAttribute('aria-valuenow', String(POR_CANAL[r.canal].i));
        knob.setAttribute('aria-valuetext', 'Canal ' + r.canal + ', ' + usoCurto(c));
        knobInd.style.transform = 'rotate(' + (POR_CANAL[r.canal].i * 360 / CANAIS.length) + 'deg)';
        btnPot.setAttribute('aria-pressed', String(r.pot === 1));
        btnPot.setAttribute('aria-label', 'Potência: ' + r.pot + ' W. Toque para ' + (r.pot === 25 ? '1 W' : '25 W'));
        radio.setAttribute('data-tx', r.tx ? '1' : '0');
      }
      var relogioLcd = setInterval(function () { if (r.visivel) atualizarLcd(); }, 500);

      /* ---------- Canal, potência, 16/9 ---------- */
      function irCanal(c, motivo) {
        if (!POR_CANAL[c]) return;
        r.canal = c;
        if (POR_CANAL[c].notas.indexOf('n') >= 0 && r.pot !== 1) { r.pot = 1; if (motivo !== 'auto') addLog('sis', 'Rádio', 'Canal ' + c + ': potência reduzida para 1 W (RR, Apêndice 18, nota n).'); }
        atualizarLcd(); desenharCanal(); atualizarSom();
      }
      function passoCanal(d) { var i = (POR_CANAL[r.canal].i + d + CANAIS.length) % CANAIS.length; irCanal(CANAIS[i].c); }
      function tecla169() { irCanal(r.canal === '16' ? '09' : '16'); }
      function trocarPot() {
        if (POR_CANAL[r.canal].notas.indexOf('n') >= 0) { addLog('dica', 'Rádio', 'Nos canais 75 e 76 a potência fica em 1 W para proteger o 16 (RR, Apêndice 18, nota n).'); return; }
        r.pot = r.pot === 25 ? 1 : 25; atualizarLcd(); desenharCanal();
      }
      knob.addEventListener('keydown', function (e) {
        var mapa = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
        if (mapa[e.key]) { e.preventDefault(); passoCanal(mapa[e.key]); }
        else if (e.key === 'Home') { e.preventDefault(); irCanal(CANAIS[0].c); }
        else if (e.key === 'End') { e.preventDefault(); irCanal(CANAIS[CANAIS.length - 1].c); }
      });
      var giro = null;
      function anguloDe(e) { var b = knob.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI; }
      knob.addEventListener('pointerdown', function (e) { e.preventDefault(); try { knob.setPointerCapture(e.pointerId); } catch (x) { /* ignora */ } giro = { a: anguloDe(e), acc: 0, y: e.clientY }; knob.focus({ preventScroll: true }); });
      knob.addEventListener('pointermove', function (e) {
        if (!giro) return;
        var a = anguloDe(e), d = a - giro.a; if (d > 180) d -= 360; if (d < -180) d += 360;
        giro.a = a; giro.acc += d;
        while (giro.acc >= 24) { giro.acc -= 24; passoCanal(1); }
        while (giro.acc <= -24) { giro.acc += 24; passoCanal(-1); }
      });
      function fimGiro() { giro = null; }
      knob.addEventListener('pointerup', fimGiro); knob.addEventListener('pointercancel', fimGiro); knob.addEventListener('lostpointercapture', fimGiro);
      knob.addEventListener('wheel', function (e) { e.preventDefault(); passoCanal(e.deltaY < 0 ? 1 : -1); }, { passive: false });

      /* ---------- Som ---------- */
      function atualizarSom() {
        if (!r.som || !audio.aberto()) return;
        audio.chiado(r.visivel && !r.tx && r.sq < RUIDO && !r.falandoRx);
      }
      function bipe(f, d, v) { if (r.som) audio.bipe(f, d, v); }

      /* ---------- PTT ---------- */
      var pttTick = null;
      function pttDown(e) {
        if (e) e.preventDefault();
        if (r.tx) return;
        if (r.canal === '70') {
          addLog('erro', 'Rádio', 'Voz bloqueada: o canal 70 é só para DSC (RR, Apêndice 18, nota j). Para falar, vá para o 16.', { ref: 'RR, Apêndice 18, nota j' });
          r.dscMsg = 'Voz não permitida no 70'; atualizarLcd(); depois(function () { r.dscMsg = ''; atualizarLcd(); }, 2500);
          return;
        }
        r.tx = true; r.txIni = Date.now(); r.avisoTx = '';
        audio.chiado(false); bipe(1200, 0.05, 0.03);
        pttTick = setInterval(function () {
          var s = (Date.now() - r.txIni) / 1000;
          if (r.canal === '16' && s > 60 && !r.avisoTx) { r.avisoTx = 'mais de 1 min no 16'; }
          atualizarLcd();
        }, 250);
        atualizarLcd();
      }
      function pttUp() {
        if (!r.tx) return;
        var s = (Date.now() - r.txIni) / 1000;
        r.tx = false; if (pttTick) { clearInterval(pttTick); pttTick = null; }
        atualizarLcd(); atualizarSom();
        if (r.canal === '16' && (r.dsc === 'ack' || r.dsc === 'aguardando') && s >= 1) { transmitirMaydayVoz(); return; }
        var txt = 'Você transmitiu ' + VL.fmt.num(s, 1) + ' s no canal ' + r.canal + ' com ' + r.pot + ' W (simulado).';
        addLog('tx', 'Você', txt, { canal: r.canal });
        if (r.canal === '16' && s > 60) addLog('erro', 'Dica', 'No 16, as transmissões não podem passar de 1 minuto (RR 52.239).', { ref: 'RR 52.239' });
        else if (r.canal === '16') addLog('dica', 'Dica', 'No 16, só chame e combine outro canal para conversar (UIT-R M.1171-1, §20). Antes de falar, escute (RR 52.240).');
        else if (duplex(POR_CANAL[r.canal])) addLog('dica', 'Dica', 'O ' + r.canal + ' é duplex: você transmite em ' + POR_CANAL[r.canal].fn + ' MHz e a costeira em ' + POR_CANAL[r.canal].fc + ' MHz. Outro barco não ouve você neste canal.');
      }
      btnPtt.addEventListener('pointerdown', function (e) { try { btnPtt.setPointerCapture(e.pointerId); } catch (x) { /* ignora */ } pttDown(e); });
      btnPtt.addEventListener('pointerup', pttUp); btnPtt.addEventListener('pointercancel', pttUp); btnPtt.addEventListener('lostpointercapture', pttUp);
      btnPtt.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); pttDown(); } });
      btnPtt.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pttUp(); } });
      btnPtt.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      /* ---------- DISTRESS: tampa de mola + segurar ---------- */
      var tampaTm = null, segTick = null;
      function abrirTampa(abrir) {
        r.tampa = abrir;
        tampa.setAttribute('aria-expanded', String(abrir));
        tampa.setAttribute('aria-label', abrir ? 'Tampa do botão DISTRESS, aberta. Toque para fechar.' : 'Tampa do botão DISTRESS, fechada. Toque para levantar.');
        radio.setAttribute('data-tampa', abrir ? '1' : '0');
        btnDistress.disabled = !abrir;
        cancelarTimer(tampaTm); tampaTm = null;
        if (abrir) {
          addLog('sis', 'Rádio', 'Tampa levantada (primeira ação). Agora segure o DISTRESS por ' + SEG + ' s (segunda ação). A tampa tem mola e fecha sozinha se você não usar (UIT-R M.493-16, §11.2).');
          tampaTm = depois(function () { if (!r.segurando && r.tampa) { abrirTampa(false); addLog('sis', 'Rádio', 'A tampa fechou sozinha (mola).'); } }, 15000);
          try { btnDistress.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
        }
      }
      function segurarIni(e) {
        if (e) e.preventDefault();
        if (!r.tampa || r.segurando) return;
        if (['enviando', 'aguardando', 'ack'].indexOf(r.dsc) >= 0) { addLog('dica', 'Rádio', 'O alerta já foi enviado. O rádio repete sozinho até chegar o recibo (UIT-R M.541-11, A1-3.1.3.1).'); return; }
        r.segurando = true; r.segIni = Date.now();
        cancelarTimer(tampaTm); tampaTm = null;
        var ultimo = -1;
        segTick = setInterval(function () {
          var s = (Date.now() - r.segIni) / 1000;
          var inteiro = Math.floor(s); if (inteiro !== ultimo) { ultimo = inteiro; bipe(2100, 0.12, 0.05); }
          atualizarLcd();
          if (s >= SEG) { pararSegurar(); enviarAlerta(); }
        }, 100);
        atualizarLcd();
      }
      function pararSegurar() { r.segurando = false; if (segTick) { clearInterval(segTick); segTick = null; } }
      function segurarFim() {
        if (!r.segurando) return;
        var s = (Date.now() - r.segIni) / 1000;
        pararSegurar(); atualizarLcd();
        if (s < SEG) addLog('dica', 'Rádio', 'Você soltou com ' + VL.fmt.num(s, 1) + ' s: nada foi enviado. Ter de segurar evita alertas falsos.');
      }
      btnDistress.addEventListener('pointerdown', function (e) { if (btnDistress.disabled) return; try { btnDistress.setPointerCapture(e.pointerId); } catch (x) { /* ignora */ } segurarIni(e); });
      btnDistress.addEventListener('pointerup', segurarFim); btnDistress.addEventListener('pointercancel', segurarFim); btnDistress.addEventListener('lostpointercapture', segurarFim);
      btnDistress.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); segurarIni(); } });
      btnDistress.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); segurarFim(); } });
      btnDistress.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      function enviarAlerta() {
        var nat = POR_NAT[msg.natureza] || POR_NAT['107'];
        r.dsc = 'enviando'; r.alertaHora = utcAgora(); msg.horaAlerta = r.alertaHora; r.pot = 25;
        var canalAntes = r.canal; r.canal = '70';
        atualizarLcd(); desenharCanal();
        bipe(1300, 0.25, 0.07); depois(function () { bipe(2200, 0.25, 0.07); }, 260);
        addLog('tx', 'Você (DSC)', 'Alerta de socorro enviado: MMSI ' + B.mmsi + ', posição ' + (posTxt(msg.pos) || 'manual') + ', hora ' + utcBonito(r.alertaHora) + ', natureza: ' + nat.dsc + ', conversa por voz (radiotelefonia).',
          { canal: '70', ref: 'RR 32.13E; UIT-R M.541-11, A3-1.1' });
        depois(function () {
          if (r.dsc !== 'enviando') return;
          r.dsc = 'aguardando'; r.canal = '16'; r.repeteEm = Date.now() + (210 + Math.random() * 60) * 1000;
          abrirTampa(false);
          addLog('sis', 'Rádio', 'O rádio passou para o 16 e aguarda o recibo. Sem recibo, repete o alerta sozinho em 3,5 a 4,5 minutos (UIT-R M.541-11, A1-3.1.3.1).', { canal: '16' });
          if (canalAntes !== '16') addLog('sis', 'Rádio', 'Você estava no ' + canalAntes + '; o socorro por voz é no 16 (UIT-R M.541-11, A3-1.1).');
          atualizarLcd(); desenharCanal(); desenharPainel();
          r.ackTm = depois(receberAck, 5000 + Math.random() * 3000);
        }, 1500);
        desenharPainel();
      }
      function receberAck() {
        r.ackTm = null;
        if (r.dsc !== 'aguardando') return;
        r.dsc = 'ack';
        bipe(2200, 0.3, 0.08); depois(function () { bipe(1300, 0.3, 0.08); }, 320); depois(function () { bipe(2200, 0.3, 0.08); }, 640);
        addLog('rx', COSTEIRA.nome + ' (DSC)', 'Recibo do seu alerta de socorro (MMSI ' + COSTEIRA.mmsi + ', fictício). A repetição automática parou.',
          { canal: '70', ref: 'UIT-R M.541-11, A1-3.3.3 e A1-3.3.5' });
        addLog('dica', 'Próximo passo', 'Agora, no 16: aperte e segure Falar, diga o MAYDAY e solte (ou use "Montar chamada").', { canal: '16' });
        atualizarLcd(); desenharPainel();
      }
      function transmitirMaydayVoz() {
        cancelarTimer(r.ackTm); r.ackTm = null;
        var grupos = GERA.mayday(ctxMsg());
        grupos.forEach(function (g) { addLog('tx', 'Você', g.partes.map(function (p) { return p.fala; }).filter(Boolean).join(' · '), { canal: '16', ref: g.ref }); });
        var res = resposta('mayday', ctxMsg());
        r.dsc = 'voz'; atualizarLcd(); desenharPainel();
        depois(function () { mostrarResposta(res); }, 2200);
      }
      function cancelarAlerta() {
        if (['enviando', 'aguardando', 'ack', 'voz'].indexOf(r.dsc) < 0) return;
        cancelarTimer(r.ackTm); r.ackTm = null;
        addLog('tx', 'Você (DSC)', 'Autocancelamento enviado pelo DSC (um recibo com o seu próprio MMSI).', { canal: '70', ref: 'UIT-R M.541-11, A3-1.7.1' });
        r.dsc = 'livre'; r.canal = '16'; r.alertaHora = null; atualizarLcd(); desenharCanal();
        msg.tipo = 'cancelar';
        var ctx = ctxMsg();
        var g = GERA.cancelar(ctx)[0];
        depois(function () {
          addLog('tx', 'Você', g.partes.map(function (p) { return p.fala; }).join(' · '), { canal: '16', ref: 'RR 32.53E' });
          depois(function () { mostrarResposta(resposta('cancelar', ctx)); }, 1800);
        }, 900);
        if (est.modo === 'montar') desenharMontar(); else desenharPainel();
      }
      function mostrarResposta(res) {
        if (!res) return;
        r.falandoRx = true; atualizarSom(); atualizarLcd();
        addLog('rx', res.de + ' (fictícia)', res.linhas.join(' · '), { canal: res.canal, ref: res.ref });
        if (res.depois) depois(function () { addLog('rx', res.de + ' (fictícia)', res.depois, { canal: res.canal, ref: 'continuação (exemplo)' }); }, 1200);
        if (r.som && voz.ok()) voz.falar(res.linhas.concat(res.depois ? [res.depois] : []), { lang: msg.lang === 'pt' ? 'pt-BR' : 'en-GB', rate: 0.95 });
        depois(function () { r.falandoRx = false; atualizarSom(); atualizarLcd(); }, 2500);
        if (res.muda) depois(function () { irCanal(res.muda, 'auto'); addLog('sis', 'Rádio', 'Vocês combinaram o canal ' + res.muda + ': o rádio está nele agora.', { canal: res.muda }); }, 1500);
        if (res.volta16) depois(function () { irCanal('16', 'auto'); addLog('sis', 'Rádio', 'Conversa encerrada: de volta à escuta no 16 ' + '(NORMAM-211/DPC, art. 4.23.4 a).'); }, 1500);
      }

      /* ---------- Tráfego simulado ---------- */
      var trafIdx = 0, trafTm = null;
      function agendarTrafego(ms) { cancelarTimer(trafTm); trafTm = null; if (r.trafego && r.visivel) trafTm = depois(eventoTrafego, ms || 18000); }
      function eventoTrafego() {
        trafTm = null;
        if (!r.trafego || !r.visivel) return;
        var ev = TRAFEGO[trafIdx % TRAFEGO.length]; trafIdx++;
        if (r.tx || ['enviando', 'aguardando', 'ack', 'voz'].indexOf(r.dsc) >= 0) { agendarTrafego(); return; }
        if (ev.canal === r.canal) {
          if (ev.forca > r.sq) {
            addLog('rx', 'Alto-falante: ' + ev.de + ' (fictício)', ev.txt, { canal: ev.canal });
            r.falandoRx = true; atualizarSom(); atualizarLcd();
            depois(function () { r.falandoRx = false; atualizarSom(); atualizarLcd(); }, 2200);
          } else {
            addLog('dica', 'Squelch', 'Havia ' + ev.de + ' falando no ' + ev.canal + ', mas o squelch (' + r.sq + ') cortou o sinal (força ' + ev.forca + '). Baixe o squelch até o chiado voltar e suba só até ele parar.', { canal: ev.canal });
          }
        }
        agendarTrafego();
      }

      /* ===================== Painel: explorar ===================== */
      var painel = { explorar: h('div', { class: 'vhf-painel', role: 'tabpanel' }), montar: h('div', { class: 'vhf-painel', role: 'tabpanel' }), desafio: h('div', { class: 'vhf-painel', role: 'tabpanel' }) };
      TODOS.forEach(function (m) { painel[m].hidden = true; colPainel.appendChild(painel[m]); });

      var cartaoCanal = h('section', { class: 'vhf-cartao', 'aria-live': 'polite' });
      var cartaoAlerta = h('section', { class: 'vhf-cartao vhf-cartao-alerta', hidden: true });
      var rapidos = h('div', { class: 'chip-list vhf-rapidos', role: 'group', 'aria-label': 'Canais importantes' });
      [['16', 'socorro e chamada'], ['70', 'DSC'], ['06', 'entre navios e SAR'], ['13', 'ponte a ponte'], ['09', ''], ['72', 'entre navios'], ['77', 'entre navios'], ['15', 'a bordo'], ['24', 'duplex']].forEach(function (x) {
        rapidos.appendChild(h('button', { type: 'button', class: 'chip vhf-chip', 'data-c': x[0], onclick: function () { irCanal(x[0]); } }, h('b', null, x[0]), x[1] ? ' ' + x[1] : ''));
      });
      var swTraf = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Tráfego simulado no alto-falante', onchange: function () { r.trafego = swTraf.checked; agendarTrafego(4000); } });
      swTraf.checked = r.trafego;
      var swSom = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Som do rádio', onchange: function () {
        r.som = swSom.checked;
        if (r.som) { if (!audio.abrir()) { r.som = false; swSom.checked = false; addLog('erro', 'Rádio', 'Este navegador não toca sons sintetizados.'); } }
        else { audio.chiado(false); voz.parar(); }
        atualizarSom();
      } });
      var h1 = 12, h2 = 12;
      var alcanceTxt = h('p', { class: 'vhf-alcance', 'aria-live': 'polite' });
      function calcAlcance() {
        var d = 2.2 * (Math.sqrt(h1) + Math.sqrt(h2));
        alcanceTxt.textContent = 'Antenas a ' + h1 + ' m e ' + h2 + ' m: cerca de ' + VL.fmt.num(Math.round(d), 0) + ' milhas de alcance em linha de visada.';
      }
      var inH1 = h('input', { type: 'range', min: '1', max: '30', value: String(h1), 'aria-label': 'Altura da antena do seu barco, em metros', oninput: function () { h1 = +inH1.value; calcAlcance(); } });
      var inH2 = h('input', { type: 'range', min: '1', max: '150', value: String(h2), 'aria-label': 'Altura da antena da outra estação, em metros', oninput: function () { h2 = +inH2.value; calcAlcance(); } });
      calcAlcance();
      function det(titulo, corpo, aberto) { var d = h('details', { class: 'vhf-det' }, h('summary', null, titulo), corpo); if (aberto) d.open = true; return d; }
      painel.explorar.appendChild(h('div', { class: 'vhf-linha' },
        h('label', { class: 'switch vhf-switch' }, swSom, h('span', null, 'Som do rádio')),
        h('label', { class: 'switch vhf-switch' }, swTraf, h('span', null, 'Tráfego simulado'))));
      painel.explorar.appendChild(cartaoAlerta);
      painel.explorar.appendChild(cartaoCanal);
      painel.explorar.appendChild(h('h3', { class: 'vhf-h' }, 'Canais para conhecer'));
      painel.explorar.appendChild(rapidos);
      painel.explorar.appendChild(det('Potência: 25 W ou 1 W, e o alcance', h('div', null,
        h('p', null, 'A estação de navio transmite com no máximo 25 W (RR 52.260). O rádio deve reduzir fácil para 1 W ou menos, para curtas distâncias (UIT-R M.489-2, §1.2.4). Use 1 W para falar perto (marina, barco ao lado): você ocupa o canal numa área menor e gasta menos bateria.'),
        h('p', null, 'O VHF funciona em linha de visada: mais do que a potência, quem manda é a altura das antenas. Conta aproximada: alcance em milhas ≈ 2,2 × (√altura 1 + √altura 2), com as alturas em metros (horizonte rádio com a refração normal da atmosfera). Um rádio portátil na mão fica a cerca de 1,5 m.'),
        h('label', { class: 'vhf-faixa' }, h('span', null, 'Antena do seu barco'), inH1),
        h('label', { class: 'vhf-faixa' }, h('span', null, 'Antena da outra estação'), inH2),
        alcanceTxt)));
      painel.explorar.appendChild(det('Squelch: como ajustar', h('div', null,
        h('p', null, 'O squelch', en('squelch'), ' desliga o alto-falante quando ninguém está falando, para cortar o chiado. Gire até o chiado parar e pare ali. Se subir demais, ele corta também estações fracas, que podem ser um pedido de socorro distante.'),
        h('p', null, 'Experimente: deixe o rádio no 16 com o tráfego simulado ligado e mude o squelch. O registro mostra o que você ouviu e o que o squelch cortou.'))));
      painel.explorar.appendChild(det('Escuta obrigatória e o DSC', h('div', null,
        h('p', null, 'Navegando, o VHF deve ficar ligado e em escuta no canal 16, ou no 70 se for DSC ', fonteOu('normas-150', 'NORMAM-211/DPC, art. 4.23.4 a'), '. O RR pede escuta no 16 a quem só tem VHF, quando no mar (RR 52.244).'),
        h('p', null, 'O DSC', en('Digital Selective Calling'), ' manda chamadas digitais no 70: alerta de socorro com o seu MMSI e a posição, e chamadas de urgência, segurança e rotina. O rádio escuta o 70 o tempo todo com um receptor próprio (UIT-R M.541-11, A1-3.2). Sem o MMSI programado, o rádio não envia chamadas DSC.'),
        h('p', null, 'O GMDSS', en('Global Maritime Distress and Safety System'), ' é o sistema mundial de socorro da IMO (Convenção SOLAS, cap. IV). Em terra, ou com celular perto da costa, o SALVAMAR (Marinha) também atende pelo 185 ', fonteOu('radio-48', 'Marinha do Brasil, página "185 – Emergências Marítimas"'), '.'))));

      function desenharCanal() {
        var c = POR_CANAL[r.canal];
        VL.$$('.vhf-chip', rapidos).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === r.canal)); });
        cartaoCanal.innerHTML = '';
        cartaoCanal.appendChild(h('h3', { class: 'vhf-h vhf-h-canal' }, 'Canal ' + c.c, h('span', { class: 'vhf-h-freq' }, c.fn + ' MHz')));
        var tipo = duplex(c)
          ? 'Duas frequências (duplex): o navio transmite em ' + c.fn + ' MHz e a costeira em ' + c.fc + ' MHz. Dois barcos não se ouvem diretamente num canal duplex.'
          : (c.fc ? 'Uma frequência só (simplex): todos transmitem e recebem em ' + c.fn + ' MHz.' : 'Uma frequência só (simplex), só para navios: ' + c.fn + ' MHz.');
        cartaoCanal.appendChild(h('p', { class: 'vhf-tipo' }, tipo));
        var usos = h('ul', { class: 'vhf-usos', 'aria-label': 'Usos pelo Apêndice 18' });
        function uso(on, txt, ingles) { usos.appendChild(h('li', { 'data-on': on ? '1' : '0' }, h('span', { class: 'vhf-uso-marca', 'aria-hidden': 'true' }, on ? '●' : '○'), h('span', { class: 'visually-hidden' }, on ? 'sim: ' : 'não: '), txt, en(ingles))); }
        if (c.c === '16') usos.appendChild(h('li', { 'data-on': '1' }, h('span', { class: 'vhf-uso-marca', 'aria-hidden': 'true' }, '●'), 'Socorro, segurança e chamada', en('distress, safety and calling')));
        else if (c.c === '70') usos.appendChild(h('li', { 'data-on': '1' }, h('span', { class: 'vhf-uso-marca', 'aria-hidden': 'true' }, '●'), 'Chamada seletiva digital de socorro, segurança e chamada', en('DSC')));
        else {
          uso(c.navios, 'Entre navios', 'intership');
          uso(c.porto1, 'Operações portuárias e movimento de navios, uma frequência', 'port operations, single frequency');
          uso(c.porto2, 'Operações portuárias e movimento de navios, duas frequências', 'two frequency');
          uso(c.publica, 'Correspondência pública: ligações e mensagens via estação costeira', 'public correspondence');
        }
        cartaoCanal.appendChild(h('p', { class: 'vhf-mini' }, 'Usos pelo RR, Apêndice 18:'));
        cartaoCanal.appendChild(usos);
        var esp = ESPECIAL[c.c];
        if (esp) esp.txt.forEach(function (t) { cartaoCanal.appendChild(h('p', null, t)); });
        if (c.c === '09') {
          cartaoCanal.appendChild(h('p', null, 'Pelo Apêndice 18: entre navios e operações portuárias (uma frequência). É um dos três canais preferidos para aeronaves leves e helicópteros falarem com navios (notas a e i).'));
          cartaoCanal.appendChild(h('p', null, 'Em muitos rádios a tecla 16/9 alterna entre o 16 e um segundo canal de chamada que, de fábrica, é o 9: nos Estados Unidos o 9 é usado como canal de chamada de barcos de recreio. Não encontramos norma brasileira que dê esse uso ao 9 ', VL.ui.seloQ(null, 'Uso do canal 9 como canal de chamada no Brasil: não confirmado em norma da Anatel ou da Marinha.'), '.'));
        }
        c.notas.forEach(function (n) { if (NOTAS_AP18[n] && !(esp && (n === 'f' || n === 'j' || n === 'k' || n === 'i'))) cartaoCanal.appendChild(h('p', { class: 'vhf-nota' }, NOTAS_AP18[n])); });
        if (c.c === '15' || c.c === '17') cartaoCanal.appendChild(h('p', { class: 'vhf-nota' }, 'Nas águas de cada país, o uso a bordo segue também a regra nacional (nota g).'));
        if (r.pot === 25 && c.navios && c.c !== '16' && c.c !== '06') cartaoCanal.appendChild(h('p', { class: 'vhf-nota' }, 'Dica: para falar com um barco por perto, 1 W basta (UIT-R M.489-2, §1.2.4).'));
      }
      function desenharAlerta() {
        var ativo = ['enviando', 'aguardando', 'ack', 'voz'].indexOf(r.dsc) >= 0;
        cartaoAlerta.hidden = !ativo;
        if (!ativo) return;
        cartaoAlerta.innerHTML = '';
        var titulo = { enviando: 'Enviando o alerta de socorro', aguardando: 'Alerta enviado: aguardando recibo', ack: 'Recibo recebido: agora a voz no 16', voz: 'Socorro em andamento' }[r.dsc];
        cartaoAlerta.appendChild(h('h3', { class: 'vhf-h' }, titulo));
        var txt = {
          enviando: 'O rádio manda o alerta no 70 com o seu MMSI, a posição, a hora e a natureza do perigo.',
          aguardando: 'Você já pode falar o MAYDAY no 16 para chamar a atenção dos barcos por perto (RR 32.13A), ou esperar o recibo da costeira (UIT-R M.541-11, A3-1.3).',
          ack: 'Aperte e segure Falar, diga a chamada e a mensagem de socorro, e solte. Fale devagar e com clareza (RR 32.6).',
          voz: 'Mantenha escuta no 16 e siga as instruções da costeira. Durante o socorro, toda chamada começa com MAYDAY (RR 32.42).',
        }[r.dsc];
        cartaoAlerta.appendChild(h('p', null, txt));
        var row = h('div', { class: 'btn-row' });
        if (r.dsc !== 'voz') row.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { msg.tipo = 'mayday'; trocarModo('montar'); } }, 'Ver o roteiro do MAYDAY'));
        row.appendChild(h('button', { type: 'button', class: 'btn btn-danger', onclick: function () { cancelarAlerta(); } }, 'Cancelar: foi sem querer'));
        cartaoAlerta.appendChild(row);
      }

      /* ===================== Painel: montar chamada ===================== */
      var selTipo = h('select', { class: 'vhf-sel-tipo', id: 'vhf-tipo-' + uid, onchange: function () { msg.tipo = selTipo.value; desenharMontar(); } });
      var GRUPOS_TIPO = [['Pedir ajuda', ['mayday', 'panpan']], ['Avisar', ['securite']], ['Rotina', ['rotina', 'dsc']],
        ['Socorro de outro barco', ['relay', 'recibo']], ['Correções e silêncio', ['cancelar', 'seelonce', 'feenee']]];
      var ROT_TIPO = { mayday: 'MAYDAY: socorro', panpan: 'PAN PAN: urgência', securite: 'SÉCURITÉ: segurança', rotina: 'Chamada de rotina', dsc: 'Chamada DSC (digital)',
        relay: 'MAYDAY RELAY: retransmitir socorro', recibo: 'Recibo de MAYDAY', cancelar: 'Cancelar alerta falso', seelonce: 'SEELONCE MAYDAY: silêncio', feenee: 'SEELONCE FEENEE: fim do socorro' };
      var QUANDO = {
        mayday: 'Perigo grave e iminente para o barco ou para uma pessoa, com necessidade de auxílio imediato (RR 32.9). Ex.: afundando, incêndio fora de controle, homem ao mar.',
        panpan: 'Mensagem muito urgente sobre a segurança do barco ou de uma pessoa, sem perigo grave e iminente (RR 33.11). Ex.: sem propulsão longe de perigos, orientação médica (RR 33.11A).',
        securite: 'Aviso importante de navegação ou de meteorologia (RR 33.34): objeto perigoso à deriva, boia apagada.',
        rotina: 'Falar com outro barco ou com a marina: chame, combine um canal de trabalho e mude para ele (UIT-R M.1171-1).',
        dsc: 'Chamar um barco ou a costeira pelo MMSI sem ocupar o 16, ou anunciar urgência ou segurança a todos os navios (UIT-R M.493-16 e M.541-11).',
        relay: 'Outro barco está em perigo e não consegue pedir socorro, ou o MAYDAY dele ficou 5 minutos sem resposta (RR 32.16 a 32.19F e 32.29A).',
        recibo: 'Você ouviu um MAYDAY. Perto da costa, espere um pouco para a costeira responder primeiro (RR 32.29). Se ninguém responder em 5 minutos, acuse o recebimento e retransmita (RR 32.29A).',
        cancelar: 'O alerta saiu sem querer. Cancele pelo DSC, se o rádio permitir, e sempre por voz no 16 (RR 32.53B a 32.53E). Não desligue o rádio. Normalmente, nenhuma ação é tomada contra quem informa e cancela um alerta falso (RR 32.10A).',
        seelonce: 'Você vai ouvir isto da costeira, do centro de coordenação de salvamento ou de quem coordena a busca no local: pare de transmitir naquele canal (RR 32.46, 32.47 e 32.49) até ouvir SEELONCE FEENEE.',
        feenee: 'Você vai ouvir isto da estação que controlou o socorro: o tráfego de socorro acabou e o canal volta ao uso normal (RR 32.51 e 32.52).',
      };
      GRUPOS_TIPO.forEach(function (g) {
        var og = h('optgroup', { label: g[0] });
        g[1].forEach(function (t) { og.appendChild(h('option', { value: t }, ROT_TIPO[t])); });
        selTipo.appendChild(og);
      });
      var mQuando = h('p', { class: 'vhf-quando' });
      var mBarco = h('details', { class: 'vhf-det vhf-det-barco' });
      var mCampos = h('div', { class: 'vhf-campos' });
      var mSeq = h('section', { class: 'vhf-cartao vhf-seq' });
      var mRoteiro = h('section', { class: 'vhf-roteiro', 'aria-label': 'Roteiro de fala' });
      var mAcoes = h('div', { class: 'btn-row vhf-acoes' });
      var mPergunta = h('div', { class: 'vhf-pergunta', hidden: true });
      var segLang = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Idioma das palavras de procedimento' });
      [['intl', 'Internacional (inglês)'], ['pt', 'Português']].forEach(function (x) { segLang.appendChild(h('button', { type: 'button', 'data-v': x[0], onclick: function () { msg.lang = x[0]; desenharMontar(); } }, x[1])); });
      var segAlg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Como dizer os algarismos' });
      [['simples', 'Algarismos simples'], ['uit', 'Algarismos da UIT']].forEach(function (x) { segAlg.appendChild(h('button', { type: 'button', 'data-v': x[0], onclick: function () { msg.alg = x[0]; desenharMontar(); } }, x[1])); });
      var notaPt = h('p', { class: 'vhf-mini vhf-nota-pt' }, 'Português entre estações brasileiras: palavras de uso corrente ("aqui é", "câmbio") ', VL.ui.seloQ(null, 'Não localizamos norma brasileira que fixe estas palavras em português. Os sinais MAYDAY, PAN PAN, SECURITE e SEELONCE não se traduzem.'), '. Os sinais MAYDAY, PAN PAN e SECURITE não se traduzem.');
      painel.montar.appendChild(h('div', { class: 'vhf-campo' }, h('label', { for: 'vhf-tipo-' + uid, class: 'field-label' }, 'Tipo de chamada'), selTipo));
      painel.montar.appendChild(mQuando);
      painel.montar.appendChild(mBarco);
      painel.montar.appendChild(mCampos);
      painel.montar.appendChild(h('div', { class: 'vhf-linha' }, segLang, segAlg));
      painel.montar.appendChild(notaPt);
      painel.montar.appendChild(mSeq);
      painel.montar.appendChild(mRoteiro);
      painel.montar.appendChild(mPergunta);
      painel.montar.appendChild(mAcoes);

      function campoTexto(rot, valor, aoMudar, o) {
        o = o || {};
        var id = 'vhf-' + uid + '-' + Math.random().toString(36).slice(2, 7);
        var inp = h('input', { type: o.tipo || 'text', id: id, value: valor == null ? '' : String(valor), maxlength: o.max || '40', inputmode: o.modo || null, autocomplete: 'off', spellcheck: 'false',
          oninput: function () { aoMudar(inp.value); atualizarRoteiro(); } });
        if (o.min != null) { inp.min = o.min; inp.max = o.maxN; }
        return h('div', { class: 'vhf-campo' + (o.curto ? ' vhf-campo-curto' : '') }, h('label', { for: id, class: 'field-label' }, rot), inp, o.dica ? h('span', { class: 'field-hint' }, o.dica) : null);
      }
      function campoSel(rot, lista, valor, aoMudar, o) {
        o = o || {};
        var id = 'vhf-' + uid + '-' + Math.random().toString(36).slice(2, 7);
        var s = h('select', { id: id, onchange: function () { aoMudar(s.value); if (o.redesenhar) desenharMontar(); else atualizarRoteiro(); } });
        lista.forEach(function (x) { var op = h('option', { value: x[0] }, x[1]); if (String(x[0]) === String(valor)) op.selected = true; if (x[2]) op.disabled = true; s.appendChild(op); });
        return h('div', { class: 'vhf-campo' + (o.curto ? ' vhf-campo-curto' : '') }, h('label', { for: id, class: 'field-label' }, rot), s, o.dica ? h('span', { class: 'field-hint' }, o.dica) : null);
      }
      function campoPos(p, rot) {
        var box = h('fieldset', { class: 'vhf-pos' }, h('legend', null, rot || 'Posição'));
        var segP = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Como dar a posição' });
        [['coord', 'Latitude e longitude'], ['ref', 'Em relação a um ponto']].forEach(function (x) {
          segP.appendChild(h('button', { type: 'button', 'data-v': x[0], 'aria-pressed': String(p.modo === x[0]), onclick: function () { p.modo = x[0]; desenharMontar(); } }, x[1]));
        });
        box.appendChild(segP);
        if (p.modo === 'coord') {
          box.appendChild(h('div', { class: 'vhf-pos-linha' },
            campoTexto('Lat. graus', p.latG, function (v) { p.latG = Math.min(89, Math.max(0, parseInt(v, 10) || 0)); }, { curto: true, modo: 'numeric', max: '2' }),
            campoTexto('minutos', p.latM, function (v) { p.latM = v; }, { curto: true, modo: 'decimal', max: '4' }),
            campoSel('N/S', [['S', 'S'], ['N', 'N']], p.latH, function (v) { p.latH = v; }, { curto: true })));
          box.appendChild(h('div', { class: 'vhf-pos-linha' },
            campoTexto('Long. graus', p.lonG, function (v) { p.lonG = Math.min(180, Math.max(0, parseInt(v, 10) || 0)); }, { curto: true, modo: 'numeric', max: '3' }),
            campoTexto('minutos', p.lonM, function (v) { p.lonM = v; }, { curto: true, modo: 'decimal', max: '4' }),
            campoSel('E/W', [['W', 'W'], ['E', 'E']], p.lonH, function (v) { p.lonH = v; }, { curto: true })));
          box.appendChild(h('p', { class: 'field-hint' }, 'Leia no GPS ou na carta. Se não souber a posição, ou se não houver tempo, dê a posição em relação a um ponto conhecido (RR 32.13D).'));
        } else {
          box.appendChild(h('div', { class: 'vhf-pos-linha' },
            campoTexto('Milhas', p.dist, function (v) { p.dist = Math.max(0, Math.min(99, parseInt(v, 10) || 0)); }, { curto: true, modo: 'numeric', max: '2' }),
            campoSel('Direção', DIRECOES.map(function (d) { return [d[0], d[1].toLowerCase()]; }), p.dir, function (v) { p.dir = v; }, { curto: true }),
            campoTexto('Ponto conhecido', p.ponto, function (v) { p.ponto = v; }, { max: '30' })));
        }
        return box;
      }
      function desenharBarco() {
        mBarco.innerHTML = '';
        mBarco.appendChild(h('summary', null, 'Seu barco: ' + B.nome + ' · ' + B.ind + ' · MMSI ' + B.mmsi));
        var grid = h('div', { class: 'vhf-campos' },
          campoTexto('Nome do barco', B.nome, function (v) { B.nome = v.trim() || 'Albatroz'; salvarBarco(); VL.$('summary', mBarco).textContent = 'Seu barco: ' + B.nome + ' · ' + B.ind + ' · MMSI ' + B.mmsi; }, { max: '24' }),
          campoTexto('Indicativo de chamada', B.ind, function (v) { B.ind = (VL.semAcento(v).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'PQ4821'); salvarBarco(); }, { max: '8', dica: 'Vem na licença de estação da Anatel. Aqui, fictício.' }),
          campoTexto('MMSI', B.mmsi, function (v) { B.mmsi = (v.replace(/\D/g, '').slice(0, 9) || '710123456'); salvarBarco(); atualizarLcd(); }, { max: '9', modo: 'numeric', dica: '9 algarismos; no Brasil começa por 710. Aqui, fictício.' }),
          campoTexto('Pessoas a bordo', msg.pessoas, function (v) { msg.pessoas = Math.max(0, Math.min(99, parseInt(v, 10) || 0)); salvarBarco(); }, { max: '2', modo: 'numeric', curto: true }));
        mBarco.appendChild(grid);
      }
      function desenharCampos() {
        mCampos.innerHTML = '';
        var t = msg.tipo;
        if (t === 'mayday') {
          var cNat = campoSel('Natureza do perigo (vai no alerta DSC)', NATUREZAS.map(function (n) { return [n.id, n.dsc + (n.id === '107' ? ' (padrão de fábrica)' : '')]; }), msg.natureza, function (v) { msg.natureza = v; }, { dica: 'Sem escolha, o rádio envia "não especificado" (UIT-R M.493-16).' }); cNat.style.gridColumn = '1 / -1'; mCampos.appendChild(cNat);
          mCampos.appendChild(campoPos(msg.pos));
          mCampos.appendChild(campoSel('Auxílio desejado', AUXILIOS.map(function (a) { return [a.id, a.rot]; }), msg.auxilio, function (v) { msg.auxilio = v; }));
          mCampos.appendChild(campoTexto('Outras informações úteis', msg.outras, function (v) { msg.outras = v; }, { max: '80', dica: 'Ex.: balsa pronta, coletes vestidos, veleiro de cruzeiro, casco branco.' }));
        } else if (t === 'panpan') {
          mCampos.appendChild(campoSel('Para quem', [['todos', 'todas as estações'], ['costeira', 'a estação costeira (fictícia)']], msg.destino, function (v) { msg.destino = v; }));
          mCampos.appendChild(campoSel('O problema', PROBLEMAS.map(function (p) { return [p.id, p.rot]; }), msg.problema, function (v) { msg.problema = v; msg.auxPan = ''; if (v === 'medico') msg.canalTrabalho = true; }, { redesenhar: true }));
          mCampos.appendChild(campoPos(msg.pos));
          mCampos.appendChild(campoSel('Onde vai a mensagem', [['0', 'tudo no 16 (mensagem curta)'], ['1', 'anunciar no 16 e passar a um canal de trabalho']], msg.canalTrabalho ? '1' : '0', function (v) { msg.canalTrabalho = v === '1'; }, { redesenhar: true, dica: 'Mensagem longa ou médica vai num canal de trabalho (RR 33.9A).' }));
          if (msg.canalTrabalho) mCampos.appendChild(campoSel('Canal de trabalho', CANAIS_NAVIOS.map(function (c) { return [c, c]; }), msg.canalPan, function (v) { msg.canalPan = v; }, { curto: true, dica: 'Se a costeira responder, quem escolhe o canal é ela (UIT-R M.1171-1, §21(3)).' }));
          mCampos.appendChild(campoTexto('Outras informações', msg.outras, function (v) { msg.outras = v; }, { max: '80' }));
        } else if (t === 'securite') {
          mCampos.appendChild(campoSel('O aviso', AVISOS.map(function (a) { return [a.id, a.rot]; }), msg.aviso, function (v) { msg.aviso = v; }));
          mCampos.appendChild(campoPos(msg.pos, 'Onde está o perigo'));
          mCampos.appendChild(campoSel('Como transmitir', [['curto', 'aviso curto, tudo no 16 (até 1 minuto)'], ['trabalho', 'anunciar no 16 e passar a outro canal']], msg.modoSec, function (v) { msg.modoSec = v; }, { redesenhar: true,
            dica: 'Um aviso curto de segurança da navegação, de até 1 minuto, pode ir no 16 (UIT-R M.1171-1, §20(5)). Se for maior, use um canal de trabalho (RR 33.32).' }));
          if (msg.modoSec === 'trabalho') mCampos.appendChild(campoSel('Canal', [['13', '13 (segurança da navegação)'], ['06', '06'], ['72', '72']], msg.canalSec, function (v) { msg.canalSec = v; }, { curto: true }));
        } else if (t === 'rotina') {
          mCampos.appendChild(campoSel('Quem você chama', [['barco', 'veleiro Gaivota (fictício)'], ['marina', 'Marina Treino (fictícia, canal 68)']], msg.chamado, function (v) { msg.chamado = v; }, { redesenhar: true }));
          if (msg.chamado === 'barco') mCampos.appendChild(campoSel('Canal para conversar', CANAIS_NAVIOS.map(function (c) { return [c, c + ' (entre navios)']; }), msg.canalRot, function (v) { msg.canalRot = v; }, { curto: true }));
          else mCampos.appendChild(h('p', { class: 'field-hint' }, 'Chame a marina direto no canal de trabalho dela, para não ocupar o 16 (UIT-R M.1171-1, §12(1)). O canal de cada marina vem no guia da marina; o 68 aqui é fictício.'));
          mCampos.appendChild(campoTexto('Assunto', msg.assunto, function (v) { msg.assunto = v; }, { max: '60', dica: 'Deixe em branco para usar um exemplo.' }));
        } else if (t === 'dsc') {
          var cats = msg.dscDest === 'todos' ? [['seguranca', 'segurança'], ['urgencia', 'urgência'], ['rotina', 'rotina (não vale para todos os navios)', true]] : [['rotina', 'rotina'], ['seguranca', 'segurança'], ['urgencia', 'urgência']];
          if (msg.dscDest === 'todos' && msg.dscCat === 'rotina') msg.dscCat = 'seguranca';
          mCampos.appendChild(campoSel('Endereço', [['individual', 'individual (um MMSI)'], ['todos', 'todos os navios']], msg.dscDest, function (v) { msg.dscDest = v; }, { redesenhar: true,
            dica: 'Chamada para todos os navios não pode ser de rotina (UIT-R M.493-16, Anexo 4, §5.3).' }));
          mCampos.appendChild(campoSel('Categoria', cats, msg.dscCat, function (v) { msg.dscCat = v; }, { redesenhar: true }));
          if (msg.dscDest === 'individual') mCampos.appendChild(campoSel('Para quem (MMSI)', [[GAIVOTA.mmsi, 'veleiro Gaivota · ' + GAIVOTA.mmsi], [COSTEIRA.mmsi, 'Costeira Treino · ' + COSTEIRA.mmsi]], msg.dscMmsi, function (v) { msg.dscMmsi = v; }, { redesenhar: true, dica: 'MMSI de costeira começa por 00 (os dois exemplos são fictícios).' }));
          var listaCh = msg.dscDest === 'todos' ? [['16', '16']].concat(msg.dscCat === 'seguranca' ? [['13', '13']] : []) : (msg.dscMmsi === COSTEIRA.mmsi ? [['', 'a costeira escolhe']] : CANAIS_NAVIOS.map(function (c) { return [c, c]; }));
          if (!listaCh.some(function (x) { return x[0] === msg.dscCanal; })) msg.dscCanal = listaCh[0][0];
          mCampos.appendChild(campoSel('Canal para a conversa por voz', listaCh, msg.dscCanal, function (v) { msg.dscCanal = v; }, { curto: true,
            dica: msg.dscDest === 'todos' ? 'O anúncio diz em que canal vai a mensagem (RR 33.8B e 33.31C).' : 'Para outro barco, a UIT sugere um canal entre navios, como o 6 (UIT-R M.493-16, Anexo 4, §5.4).' }));
        } else if (t === 'relay') {
          mCampos.appendChild(campoSel('Como você soube', [['0', 'ouvi o MAYDAY do Estrela do Mar e ninguém respondeu em 5 min'], ['1', 'vi um barco em perigo que não consegue pedir socorro']], msg.viu ? '1' : '0', function (v) { msg.viu = v === '1'; }, { redesenhar: true }));
          mCampos.appendChild(campoSel('Para quem', [['costeira', 'a estação costeira (preferível)'], ['todos', 'todas as estações (se a costeira não responder)']], msg.destRelay, function (v) { msg.destRelay = v; }, { dica: 'Primeiro a costeira (RR 32.19D); a todos os navios, se não conseguir contato (RR 32.19H).' }));
          mCampos.appendChild(campoPos(msg.posRelay, 'Posição do barco em perigo'));
          mCampos.appendChild(campoSel('Natureza do perigo', NATUREZAS.map(function (n) { return [n.id, n.dsc]; }), msg.natRelay, function (v) { msg.natRelay = v; }));
          mCampos.appendChild(campoTexto('Pessoas a bordo dele', msg.pessoasRelay, function (v) { msg.pessoasRelay = Math.max(0, Math.min(99, parseInt(v, 10) || 0)); }, { curto: true, modo: 'numeric', max: '2' }));
        } else if (t === 'recibo') {
          mCampos.appendChild(VL.ui.callout('nota', 'Você ouviu no 16', h('p', null, 'MAYDAY, MAYDAY, MAYDAY, THIS IS ESTRELA DO MAR, ESTRELA DO MAR, ESTRELA DO MAR, CALL SIGN ' + ESTRELA.ind + ', MMSI ' + ESTRELA.mmsi + '. MAYDAY, ESTRELA DO MAR… SINKING, 3 PERSONS ON BOARD… OVER. (exemplo fictício)')));
        } else if (t === 'cancelar') {
          mCampos.appendChild(campoTexto('Hora UTC do alerta (hhmm)', msg.horaAlerta || r.alertaHora || utcAgora(), function (v) { msg.horaAlerta = pad(v.replace(/\D/g, '').slice(0, 4), 4); }, { curto: true, modo: 'numeric', max: '4', dica: 'O rádio mostra a hora do alerta no display.' }));
        }
      }
      function seqPassos() {
        var t = msg.tipo, enviado = !!r.alertaHora, ack = ['ack', 'voz'].indexOf(r.dsc) >= 0 || false, falou = r.dsc === 'voz';
        if (t === 'mayday') return { titulo: 'Sequência do socorro com rádio DSC', passos: [
          { t: 'Se der tempo, escolha a natureza do perigo (campo acima). Sem escolha, o alerta sai como "não especificado" (UIT-R M.493-16).', ok: msg.natureza !== '107' },
          { t: 'Levante a tampa e segure o DISTRESS por ' + SEG + ' s: o alerta DSC sai no 70 com MMSI, posição e hora (RR 32.13E; UIT-R M.541-11, A3-1.1).', ok: enviado },
          { t: 'O rádio vai para o 16. Espere o recibo DSC da costeira, ou fale logo para alertar os barcos por perto (RR 32.13A).', ok: ack },
          { t: 'Fale a chamada e a mensagem de socorro no 16 (roteiro abaixo), devagar e com clareza (RR 32.6).', ok: falou },
          { t: 'Mantenha escuta no 16. Se ninguém responder, repita.', ok: false }],
          rodape: 'Rádio sem DSC: comece direto pela voz no 16 (RR 32.13B).' };
        if (t === 'panpan') return { titulo: 'Sequência da urgência', passos: [
          { t: 'Com DSC: chamada de urgência para todos os navios (ou para a costeira), indicando o canal da mensagem (RR 33.8B). Use "Chamada DSC" para treinar.' },
          { t: 'Chamada de urgência por voz no 16 (RR 33.9 e 33.12).' },
          { t: 'Mensagem longa ou médica: passe ao canal de trabalho anunciado (RR 33.9A).' },
          { t: 'Quem recebe uma urgência para todas as estações não acusa o recebimento, mas fica ouvindo pelo menos 5 minutos (RR 33.15A e 33.15B).' }] };
        if (t === 'securite') return { titulo: 'Sequência do aviso de segurança', passos: [
          { t: 'Um aviso que só interessa a quem está por perto é anunciado por voz, sem DSC (RR 33.31A, b).' },
          { t: 'Anúncio no 16: SECURITE três vezes (RR 33.31B e 33.35).' },
          { t: 'A mensagem vai num canal de trabalho, quando possível; um aviso curto de navegação, de até 1 minuto, pode ir no 16 (RR 33.32; UIT-R M.1171-1, §20(5)).' },
          { t: 'Quem recebe não responde; escuta até saber que o aviso não é com ele (RR 33.38A e 33.38B).' }] };
        if (t === 'rotina') return { titulo: 'Sequência da chamada de rotina', passos: [
          { t: 'Escute antes, para ver se o canal está livre (RR 52.240).' },
          { t: 'Chame: nome do outro (até 3 vezes), "aqui é", seu nome (até 3 vezes) (UIT-R M.1171-1, §8(1)).' },
          { t: 'Proponha um canal entre navios e mude para ele (§20(4)). O 16 é só para chamar.' },
          { t: 'Depois do contato, o nome basta uma vez (§8(4)). Ao terminar, volte à escuta no 16.' }] };
        if (t === 'dsc') return { titulo: 'Como funciona a chamada DSC', passos: [
          { t: 'Escolha endereço, categoria e o canal da conversa. O rádio envia a chamada digital no 70 (UIT-R M.541-11).' },
          { t: 'Chamada individual: o outro rádio toca, ele aceita, e os dois rádios passam sozinhos para o canal combinado.' },
          { t: 'Para todos os navios (urgência ou segurança): depois do anúncio, a mensagem vai por voz no canal indicado.' }] };
        if (t === 'relay') return { titulo: 'Retransmitir o socorro de outro barco', passos: [
          { t: 'Você só retransmite se o socorro não teve recibo em 5 minutos ou se o barco em perigo não consegue se comunicar (RR 32.16 a 32.18).' },
          { t: 'Por voz no 16, de preferência para a costeira (RR 32.19D). Diga que você não está em perigo (RR 32.19A).' },
          { t: 'Não retransmita por DSC, para todos os navios, um alerta DSC que você recebeu (RR 32.19C). Se usar DSC, mande um relay individual para a costeira (RR 32.19B e 32.19G).' }] };
        if (t === 'recibo') return { titulo: 'Quando e como acusar o recebimento', passos: [
          { t: 'Perto da costa, espere um pouco: a costeira deve responder primeiro (RR 32.29).' },
          { t: 'Se ninguém responder em 5 minutos, acuse o recebimento ao barco em perigo e retransmita para uma costeira (RR 32.29A).' },
          { t: 'Recibo por voz no 16, no formato do RR 32.23 (roteiro abaixo). Barco não responde alerta DSC com DSC (UIT-R M.541-11, A3-1.2).' }] };
        if (t === 'cancelar') return { titulo: 'Cancelar um alerta falso', passos: [
          { t: 'Pelo DSC: autocancelamento, se o rádio tiver essa função (UIT-R M.541-11, A3-1.7.1).' },
          { t: 'Sempre por voz no 16, com a hora UTC do alerta (RR 32.53C a 32.53E).' },
          { t: 'Continue escutando o 16 e responda a quem chamar sobre o alerta (M.541-11, A3-1.7.3). Não desligue o rádio.' }] };
        if (t === 'seelonce') return { titulo: 'O que fazer', passos: [
          { t: 'Pare de transmitir naquele canal até ouvir SEELONCE FEENEE (RR 32.49).' },
          { t: 'Quem pode impor silêncio: o centro de coordenação de salvamento, quem coordena a busca no local ou a estação costeira envolvida (RR 32.46).' }],
          rodape: 'O material de apoio da Anatel para o exame de radiotelefonista (versão 2026-03) grafa "SILENCE MAYDAY" e diz que a estação em perigo também pode pedir silêncio. O texto atual do RR (CMR-23) grafa SEELONCE MAYDAY e lista apenas as estações acima. Aqui seguimos o RR.' };
        if (t === 'feenee') return { titulo: 'O que fazer', passos: [
          { t: 'O tráfego de socorro terminou: o canal volta ao uso normal (RR 32.51).' },
          { t: 'Até essa mensagem, quem não participa do socorro não transmite no canal (RR 32.49).' }] };
        return { titulo: '', passos: [] };
      }
      function desenharSeq() {
        var s = seqPassos();
        mSeq.innerHTML = '';
        mSeq.appendChild(h('h3', { class: 'vhf-h' }, s.titulo));
        var ol = h('ol', { class: 'vhf-passos' });
        s.passos.forEach(function (p) { ol.appendChild(h('li', { 'data-ok': p.ok ? '1' : '0' }, p.ok ? h('span', { class: 'vhf-ok' }, VL.icon('check', 16), h('span', { class: 'visually-hidden' }, 'feito: ')) : null, p.t)); });
        mSeq.appendChild(ol);
        if (s.rodape) mSeq.appendChild(h('p', { class: 'vhf-mini' }, s.rodape));
      }
      var transm = null; // transmissão em andamento (passo a passo)
      function atualizarRoteiro() {
        mRoteiro.innerHTML = '';
        if (msg.tipo === 'dsc') {
          mRoteiro.appendChild(h('div', { class: 'vhf-dsc-resumo' }, h('h3', { class: 'vhf-h' }, 'A chamada que o rádio vai enviar no 70'), resumoDsc()));
          return;
        }
        var grupos = GERA[msg.tipo](ctxMsg());
        mRoteiro.appendChild(h('h3', { class: 'vhf-h' }, grupos[0].ouvir ? 'A mensagem que você vai ouvir' : 'Roteiro de fala'));
        grupos.forEach(function (g, gi) {
          var sec = h('div', { class: 'vhf-grupo' }, h('p', { class: 'vhf-grupo-tit' }, g.titulo, h('span', { class: 'vhf-grupo-ref' }, (g.canal ? 'canal ' + g.canal + ' · ' : '') + g.ref)));
          var ol = h('ol', { class: 'vhf-partes' });
          g.partes.forEach(function (p, pi) {
            ol.appendChild(h('li', { class: 'vhf-parte', 'data-g': gi, 'data-p': pi },
              h('span', { class: 'vhf-parte-rot' }, p.rot, p.ref ? h('span', { class: 'vhf-parte-ref' }, ' · ' + p.ref) : null),
              h('span', { class: 'vhf-parte-fala' }, p.fala || '—'),
              p.dito ? h('span', { class: 'vhf-parte-dito' }, 'Diga: ' + p.dito) : null,
              p.pron ? h('span', { class: 'vhf-parte-pron' }, '≈ ' + p.pron) : null));
          });
          sec.appendChild(ol);
          mRoteiro.appendChild(sec);
        });
        mRoteiro.appendChild(h('p', { class: 'vhf-mini' }, 'Pronúncia com "≈": aproximação em português, não oficial. Fale devagar e com clareza, palavra por palavra (RR 32.6). Para soletrar, use o alfabeto fonético (RR 32.7 e Apêndice 14).'));
      }
      function resumoDsc() {
        var cat = { rotina: 'rotina', seguranca: 'segurança', urgencia: 'urgência' }[msg.dscCat];
        var para = msg.dscDest === 'todos' ? 'todos os navios' : (msg.dscMmsi === COSTEIRA.mmsi ? 'Costeira Treino, MMSI ' + COSTEIRA.mmsi : 'veleiro Gaivota, MMSI ' + GAIVOTA.mmsi);
        return h('dl', { class: 'vhf-dl' },
          h('dt', null, 'De'), h('dd', null, B.nome + ', MMSI ' + B.mmsi),
          h('dt', null, 'Para'), h('dd', null, para),
          h('dt', null, 'Categoria'), h('dd', null, cat),
          h('dt', null, 'Depois'), h('dd', null, 'conversa por voz' + (msg.dscCanal ? ' no canal ' + msg.dscCanal : ', no canal que a costeira indicar')));
      }
      function desenharAcoes() {
        mAcoes.innerHTML = '';
        var t = msg.tipo, ouvir = t === 'seelonce' || t === 'feenee';
        if (t === 'dsc') {
          mAcoes.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { enviarDsc(); } }, 'Enviar pelo rádio (simulado)'));
          return;
        }
        mAcoes.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { iniciarTransmissao(); } }, ouvir ? 'Ouvir no rádio (exemplo)' : 'Transmitir (simulado)'));
        var chk = h('input', { type: 'checkbox', role: 'switch', 'aria-label': 'Passo a passo: uma fala por vez', onchange: function () { msg.passo = chk.checked; } });
        chk.checked = msg.passo || reduzMov();
        msg.passo = chk.checked;
        mAcoes.appendChild(h('label', { class: 'switch vhf-switch' }, chk, h('span', null, 'Uma fala por vez')));
        if (voz.ok() && !ouvir) mAcoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { ouvirRoteiro(); } }, VL.icon('play', 18), 'Ouvir o roteiro'));
      }
      function ouvirRoteiro() {
        var falas = [];
        GERA[msg.tipo](ctxMsg()).forEach(function (g) { g.partes.forEach(function (p) { if (p.fala) falas.push(p.fala.replace(/°/g, ' ').replace(/'/g, ' ')); }); });
        voz.falar(falas, { lang: msg.lang === 'pt' ? 'pt-BR' : 'en-GB', rate: 0.85 });
      }
      function desenharMontar() {
        selTipo.value = msg.tipo;
        mQuando.textContent = QUANDO[msg.tipo];
        desenharBarco();
        desenharCampos();
        VL.$$('button', segLang).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === msg.lang)); });
        VL.$$('button', segAlg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === msg.alg)); });
        notaPt.hidden = msg.lang !== 'pt';
        segLang.parentNode.hidden = msg.tipo === 'dsc';
        desenharSeq();
        atualizarRoteiro();
        desenharAcoes();
        mPergunta.hidden = true; mPergunta.innerHTML = '';
      }

      /* ---------- Transmissão simulada ---------- */
      function marcarParte(gi, pi) {
        VL.$$('.vhf-parte', mRoteiro).forEach(function (li) { li.removeAttribute('data-agora'); if (+li.getAttribute('data-g') === gi && +li.getAttribute('data-p') === pi) li.setAttribute('data-agora', '1'); });
      }
      function iniciarTransmissao() {
        if (transm) pararTransmissao();
        var t = msg.tipo;
        if (t === 'mayday' && !r.alertaHora && !mPergunta.dataset.ok) {
          mPergunta.hidden = false; mPergunta.innerHTML = '';
          mPergunta.appendChild(VL.ui.callout('seguranca', 'Faltou o alerta DSC', h('div', null,
            h('p', null, 'Com rádio DSC, o primeiro passo é o alerta pelo botão DISTRESS: ele avisa a costeira e os barcos com o seu MMSI e a posição (RR 32.13A e 32.13E).'),
            h('div', { class: 'btn-row' },
              h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { mPergunta.hidden = true; abrirTampa(true); try { tampa.scrollIntoView({ block: 'center', behavior: reduzMov() ? 'auto' : 'smooth' }); } catch (e) { /* ignora */ } } }, 'Ir para o botão DISTRESS'),
              h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { mPergunta.dataset.ok = '1'; mPergunta.hidden = true; addLog('sis', 'Rádio', 'Rádio sem DSC: o socorro começa direto pela voz no 16 (RR 32.13B).'); iniciarTransmissao(); } }, 'Seguir só por voz (rádio sem DSC)')))));
          return;
        }
        if (t === 'cancelar' && r.dsc !== 'livre') { cancelarAlerta(); return; }
        var ctx = ctxMsg();
        var grupos = GERA[t](ctx);
        var ouvir = !!grupos[0].ouvir;
        transm = { grupos: grupos, gi: 0, pi: -1, ctx: ctx, tipo: t, ouvir: ouvir, tm: null };
        irCanal(grupos[0].canal, 'auto');
        if (t === 'mayday' || t === 'relay' || t === 'cancelar') { r.pot = 25; atualizarLcd(); }
        if (!ouvir && t === 'rotina' && msg.chamado === 'barco') addLog('sis', 'Rádio', 'Você escutou o 16 antes: canal livre (RR 52.240).', { canal: '16' });
        proximaParte();
      }
      function linhaTx() { return transm.ouvir ? 'rx' : 'tx'; }
      function proximaParte() {
        if (!transm) return;
        var g = transm.grupos[transm.gi];
        transm.pi++;
        if (transm.pi >= g.partes.length) { fimGrupo(); return; }
        var p = g.partes[transm.pi];
        marcarParte(transm.gi, transm.pi);
        if (!transm.ouvir) { r.tx = true; r.txIni = r.txIni && transm.pi ? r.txIni : Date.now(); }
        atualizarLcd();
        addLog(linhaTx(), transm.ouvir ? COSTEIRA.nome + ' (fictícia)' : 'Você', p.fala, { canal: g.canal, ref: transm.pi === 0 ? g.ref : '' });
        if (msg.passo) {
          mostrarBotaoProxima();
        } else transm.tm = depois(proximaParte, 650);
      }
      function mostrarBotaoProxima() {
        var b = VL.$('.vhf-prox', mAcoes);
        if (!b) {
          b = h('button', { type: 'button', class: 'btn btn-primary vhf-prox', onclick: function () { proximaParte(); } }, 'Próxima fala');
          mAcoes.insertBefore(b, mAcoes.firstChild);
        }
        try { b.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
      }
      function fimGrupo() {
        var t = transm.tipo, gi = transm.gi, ctx = transm.ctx;
        r.tx = false; r.txIni = 0; atualizarLcd(); atualizarSom();
        var temMais = gi + 1 < transm.grupos.length;
        var res = transm.ouvir || ((t === 'mayday' || t === 'relay' || t === 'securite') && temMais) ? null : resposta(t, ctx, gi);
        if (t === 'mayday') { if (r.dsc === 'aguardando' || r.dsc === 'ack') { cancelarTimer(r.ackTm); r.ackTm = null; } if (r.alertaHora) r.dsc = 'voz'; desenharSeq(); desenharAlerta(); }
        if (t === 'securite' && gi === transm.grupos.length - 1) depois(function () { addLog('sis', 'Rádio', 'Ninguém responde a um SÉCURITÉ para todas as estações, e está certo (RR 33.38A).'); }, 1200);
        if (t === 'panpan' && msg.destino === 'todos' && gi === transm.grupos.length - 1) depois(function () { addLog('dica', 'Dica', 'Barcos que ouvem uma urgência para todas as estações não acusam o recebimento (RR 33.15A). Aqui a costeira fictícia responde.'); }, 600);
        if (t === 'feenee') depois(function () { addLog('sis', 'Rádio', 'Fim do silêncio: o 16 volta ao uso normal (RR 32.51).'); }, 600);
        if (t === 'seelonce') depois(function () { addLog('dica', 'Dica', 'Agora fique quieto neste canal até ouvir SEELONCE FEENEE (RR 32.49).'); }, 600);
        var b = VL.$('.vhf-prox', mAcoes); if (b && !temMais) b.remove();
        if (res) {
          var espera = 1500;
          transm.tm = depois(function () {
            mostrarResposta(res);
            if (temMais) transm.tm = depois(function () { seguirGrupo(); }, (res.muda ? 1800 : 0) + 2600);
            else transm = null;
          }, espera);
        } else if (temMais) {
          transm.tm = depois(seguirGrupo, 1200);
        } else transm = null;
      }
      function seguirGrupo() {
        if (!transm) return;
        transm.gi++; transm.pi = -1;
        var g = transm.grupos[transm.gi];
        if (g.canal !== r.canal) { irCanal(g.canal, 'auto'); addLog('sis', 'Rádio', 'Você mudou para o canal ' + g.canal + '.', { canal: g.canal }); }
        proximaParte();
      }
      function pararTransmissao() { if (transm && transm.tm) cancelarTimer(transm.tm); transm = null; r.tx = false; atualizarLcd(); var b = VL.$('.vhf-prox', mAcoes); if (b) b.remove(); }

      function abrirMenuDsc() { if (modos.indexOf('montar') < 0) { addLog('dica', 'Rádio', 'O menu DSC compõe chamadas digitais: rotina, segurança e urgência.'); return; } msg.tipo = 'dsc'; trocarModo('montar'); }
      function enviarDsc() {
        if (['enviando', 'aguardando', 'ack'].indexOf(r.dsc) >= 0) { addLog('dica', 'Rádio', 'Há um alerta de socorro em andamento: o botão de socorro tem prioridade sobre tudo (UIT-R M.493-16, Anexo 4, §3.1).'); return; }
        var cat = { rotina: 'rotina', seguranca: 'segurança', urgencia: 'urgência' }[msg.dscCat];
        var todos = msg.dscDest === 'todos', costeira = !todos && msg.dscMmsi === COSTEIRA.mmsi;
        var canalAntes = r.canal; r.canal = '70'; atualizarLcd(); desenharCanal();
        addLog('tx', 'Você (DSC)', 'Chamada de ' + cat + (todos ? ' para todos os navios' : ' individual para ' + (costeira ? 'Costeira Treino' : 'veleiro Gaivota') + ', MMSI ' + msg.dscMmsi) + (msg.dscCanal ? ', voz no canal ' + msg.dscCanal : '') + '.',
          { canal: '70', ref: 'UIT-R M.541-11' });
        bipe(1700, 0.2, 0.05);
        depois(function () {
          if (todos) {
            irCanal(msg.dscCanal || '16', 'auto');
            addLog('sis', 'Rádio', 'Anúncio enviado. Quem recebe não acusa o recebimento por DSC (RR 33.15A e 33.38A). Agora faça a mensagem por voz no ' + r.canal + '.', { canal: r.canal });
            var prox = msg.dscCat === 'urgencia' ? 'panpan' : 'securite';
            mPergunta.hidden = false; mPergunta.innerHTML = '';
            mPergunta.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { msg.tipo = prox; if (prox === 'securite' && msg.dscCanal === '13') { msg.modoSec = 'trabalho'; msg.canalSec = '13'; } desenharMontar(); } }, 'Montar o ' + (prox === 'panpan' ? 'PAN PAN' : 'SÉCURITÉ') + ' por voz')));
            return;
          }
          var de = costeira ? COSTEIRA.nome : GAIVOTA.nome;
          var ch = msg.dscCanal || '25';
          addLog('rx', de + ' (DSC, fictício)', 'Recibo: pode atender, conversa no canal ' + ch + (costeira && !msg.dscCanal ? ' (a costeira escolheu)' : '') + '.', { canal: '70', ref: 'UIT-R M.541-11' });
          depois(function () {
            irCanal(ch, 'auto');
            addLog('sis', 'Rádio', 'O rádio passou sozinho para o canal ' + ch + '. Agora chame por voz: ' + de + ', ' + (msg.lang === 'pt' ? 'AQUI É ' : 'THIS IS ') + B.nome.toUpperCase() + ', ' + PW[msg.lang].cambio + '.', { canal: ch });
            if (canalAntes === ch) { /* nada */ }
          }, 900);
        }, 1600);
      }

      /* ===================== Painel: desafio ===================== */
      var des = { tipo: ['situacao', 'ordem', 'canal'].indexOf(opts.desafio) >= 0 ? opts.desafio : 'situacao', n: Math.max(3, Math.min(20, opts.n | 0 || 8)), i: 0, acertos: 0, fila: [], item: null, respondido: false, ordem: [] };
      var segDes = h('div', { class: 'segmented vhf-des-tipos', role: 'group', 'aria-label': 'Tipo de desafio' });
      [['situacao', 'Qual chamada?'], ['ordem', 'Ordene o MAYDAY'], ['canal', 'Qual canal?']].forEach(function (x) {
        segDes.appendChild(h('button', { type: 'button', 'data-v': x[0], onclick: function () { des.tipo = x[0]; novaRodada(); } }, x[1]));
      });
      var desPlacar = h('p', { class: 'vhf-placar', 'aria-live': 'polite' });
      var desCorpo = h('div', { class: 'vhf-des-corpo' });
      painel.desafio.appendChild(segDes);
      painel.desafio.appendChild(desPlacar);
      painel.desafio.appendChild(desCorpo);
      function placar() { desPlacar.textContent = des.tipo === 'ordem' ? 'Acertos: ' + des.acertos + ' de ' + des.i : 'Pergunta ' + Math.min(des.i, des.n) + ' de ' + des.n + ' · acertos: ' + des.acertos; }
      function novaRodada() {
        VL.$$('button', segDes).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === des.tipo)); });
        des.i = 0; des.acertos = 0;
        des.fila = des.tipo === 'situacao' ? VL.embaralhar(SITUACOES).slice(0, des.n) : des.tipo === 'canal' ? VL.embaralhar(CANAL_Q).slice(0, Math.min(des.n, CANAL_Q.length)) : [];
        if (des.tipo === 'canal') des.n2 = des.fila.length;
        proximaQuestao();
      }
      function proximaQuestao() {
        desCorpo.innerHTML = ''; des.respondido = false;
        if (des.tipo === 'ordem') { questaoOrdem(); placar(); return; }
        var total = des.fila.length;
        if (des.i >= total) { fimRodada(total); return; }
        des.item = des.fila[des.i]; des.i++;
        placar();
        var q = des.item;
        var ops;
        if (des.tipo === 'situacao') ops = (q.ops || (q.r === 'relay' ? ['mayday', 'relay', 'panpan', 'securite'] : ['mayday', 'panpan', 'securite', 'rotina'])).map(function (k) { return { k: k, t: OP[k] || OP_EXTRA[k] || k }; });
        else ops = VL.embaralhar(q.ops).map(function (k) { return { k: k, t: k.length <= 2 ? 'Canal ' + k : k }; });
        ops = VL.embaralhar(ops);
        var lista = h('ul', { class: 'alternativas', role: 'list' });
        var exp = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        ops.forEach(function (o, i) {
          var b = h('button', { type: 'button', class: 'alternativa', onclick: function () { responder(o.k, b); } },
            h('span', { class: 'alternativa-letra', 'aria-hidden': 'true' }, 'ABCDE'[i]), h('span', null, o.t));
          lista.appendChild(h('li', null, b));
        });
        desCorpo.appendChild(h('p', { class: 'questao-enunciado' }, q.p));
        desCorpo.appendChild(lista);
        desCorpo.appendChild(exp);
        function responder(k, b) {
          if (des.respondido) return;
          des.respondido = true;
          var certo = k === q.r;
          if (certo) des.acertos++;
          VL.$$('.alternativa', lista).forEach(function (x, i) {
            x.disabled = true;
            if (ops[i].k === q.r) x.setAttribute('data-res', 'certa');
            else if (x === b) x.setAttribute('data-res', 'errada');
          });
          exp.hidden = false; exp.innerHTML = '';
          exp.appendChild(h('p', { class: 'explicacao-res', 'data-ok': certo ? '1' : '0' }, certo ? 'Certo.' : 'Não. A resposta é ' + (OP[q.r] || OP_EXTRA[q.r] || (q.r.length <= 2 ? 'o canal ' + q.r : q.r)) + '.'));
          exp.appendChild(h('p', { class: 'mb-0' }, q.e));
          placar();
          desCorpo.appendChild(h('div', { class: 'btn-row vhf-des-prox' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { proximaQuestao(); } }, des.i >= des.fila.length ? 'Ver resultado' : 'Próxima')));
          try { VL.$('.vhf-des-prox .btn', desCorpo).focus({ preventScroll: true }); } catch (e) { /* ignora */ }
        }
      }
      function fimRodada(total) {
        desPlacar.textContent = 'Resultado: ' + des.acertos + ' de ' + total + '.';
        var rec = VL.store.get('vhf-sim.recorde.' + des.tipo, 0) || 0;
        var novo = des.acertos > rec;
        if (novo) VL.store.set('vhf-sim.recorde.' + des.tipo, des.acertos);
        desCorpo.appendChild(h('div', { class: 'resultado', 'data-aprovado': des.acertos >= Math.ceil(total * 0.7) ? '1' : '0' },
          h('p', { class: 'mb-0' }, des.acertos === total ? 'Perfeito: você escolheu certo em todas.' : (des.acertos >= Math.ceil(total * 0.7) ? 'Bom resultado. Revise as explicações das que errou.' : 'Revise as explicações e tente de novo.'),
            ' ', novo ? 'Novo recorde neste aparelho.' : (rec ? 'Recorde neste aparelho: ' + rec + '.' : ''))));
        desCorpo.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { novaRodada(); } }, 'Jogar de novo')));
      }
      function questaoOrdem() {
        var ctx = ctxMsg(), L = PW[ctx.lang], nome = B.nome.toUpperCase();
        var nat = POR_NAT[msg.natureza === '107' ? '105' : msg.natureza];
        var certas = [
          { id: 'a', t: 'MAYDAY, MAYDAY, MAYDAY' },
          { id: 'b', t: L.este + ' ("aqui é")' },
          { id: 'c', t: 'Nome do barco três vezes: ' + tres(nome) },
          { id: 'd', t: 'Indicativo e MMSI: ' + B.ind + ', ' + B.mmsi },
          { id: 'e', t: 'MAYDAY ' + nome + ', indicativo e MMSI (começa a mensagem)' },
          { id: 'f', t: 'Posição: ' + (posTxt(msg.pos) || '23°05,0\'S 043°10,0\'W') },
          { id: 'g', t: 'Natureza do perigo: ' + nat.dsc },
          { id: 'h', t: 'Auxílio desejado: auxílio imediato' },
          { id: 'i', t: 'Outras informações: ' + (msg.pessoas || 4) + ' pessoas a bordo' },
          { id: 'j', t: L.cambio + ' (sua vez)' },
        ];
        des.ordem = [];
        var pool = VL.embaralhar(certas);
        var resp = h('ol', { class: 'vhf-ordem-resp', 'aria-label': 'Sua ordem' });
        var banco = h('div', { class: 'vhf-ordem-banco', role: 'group', 'aria-label': 'Partes para ordenar' });
        var fb = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        var btnConf = h('button', { type: 'button', class: 'btn btn-primary', disabled: true, onclick: function () { conferir(); } }, 'Conferir');
        var btnLimpar = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { des.ordem = []; render(); } }, 'Recomeçar');
        desCorpo.appendChild(h('p', { class: 'questao-enunciado' }, 'Toque nas partes na ordem em que você fala: primeiro a chamada de socorro, depois a mensagem (RR 32.13C e 32.13D). Toque numa parte já escolhida para devolvê-la.'));
        desCorpo.appendChild(resp);
        desCorpo.appendChild(banco);
        desCorpo.appendChild(h('div', { class: 'btn-row' }, btnConf, btnLimpar));
        desCorpo.appendChild(fb);
        function render() {
          resp.innerHTML = ''; banco.innerHTML = '';
          des.ordem.forEach(function (it, i) {
            resp.appendChild(h('li', null, h('button', { type: 'button', class: 'vhf-peca vhf-peca-on', 'data-id': it.id, 'aria-label': (i + 1) + ': ' + it.t + '. Toque para devolver.', onclick: function () { if (des.respondido) return; des.ordem.splice(i, 1); render(); } },
              h('span', { class: 'vhf-peca-n' }, String(i + 1)), it.t)));
          });
          if (!des.ordem.length) resp.appendChild(h('li', { class: 'vhf-ordem-vazio' }, 'Sua sequência aparece aqui.'));
          pool.forEach(function (it) {
            if (des.ordem.indexOf(it) >= 0) return;
            banco.appendChild(h('button', { type: 'button', class: 'vhf-peca', onclick: function () { if (des.respondido) return; des.ordem.push(it); render(); } }, it.t));
          });
          btnConf.disabled = des.ordem.length !== certas.length || des.respondido;
        }
        function conferir() {
          des.respondido = true; des.i++;
          var erro = -1;
          des.ordem.forEach(function (it, i) { if (it.id !== certas[i].id && erro < 0) erro = i; });
          VL.$$('.vhf-peca-on', resp).forEach(function (b, i) { b.setAttribute('data-res', des.ordem[i].id === certas[i].id ? 'certa' : 'errada'); b.disabled = true; });
          if (erro < 0) des.acertos++;
          fb.hidden = false; fb.innerHTML = '';
          fb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': erro < 0 ? '1' : '0' }, erro < 0 ? 'Certo: esta é a ordem do Regulamento.' : 'A partir da parte ' + (erro + 1) + ', a ordem não bate. A ordem certa:'));
          if (erro >= 0) { var ol = h('ol', { class: 'vhf-ordem-certa' }); certas.forEach(function (c) { ol.appendChild(h('li', null, c.t)); }); fb.appendChild(ol); }
          fb.appendChild(h('p', { class: 'mb-0' }, 'Chamada (RR 32.13C): MAYDAY três vezes, "THIS IS", o nome três vezes, indicativo e MMSI. Mensagem (RR 32.13D): MAYDAY, nome, indicativo e MMSI, posição, natureza do perigo, auxílio desejado e outras informações úteis. O "OVER" no fim é uso corrente.'));
          placar();
          desCorpo.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { proximaQuestao(); } }, 'Embaralhar de novo')));
          btnConf.disabled = true;
        }
        render();
      }

      /* ===================== Modo ===================== */
      function desenharPainel() { desenharAlerta(); if (est.modo === 'montar') desenharSeq(); }
      function trocarModo(m) {
        if (modos.indexOf(m) < 0) return;
        if (transm) pararTransmissao();
        est.modo = m;
        raiz.setAttribute('data-modo', m);
        VL.$$('button', segModo).forEach(function (b) { var on = b.getAttribute('data-v') === m; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-selected', String(on)); });
        TODOS.forEach(function (k) { painel[k].hidden = k !== m; });
        if (m === 'explorar') { desenharCanal(); desenharAlerta(); }
        if (m === 'montar') desenharMontar();
        if (m === 'desafio' && !desCorpo.children.length) novaRodada();
      }

      /* ---------- Visibilidade e limpeza ---------- */
      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (ents) {
          var vis = ents[ents.length - 1].isIntersecting;
          if (vis === r.visivel) return;
          r.visivel = vis;
          if (!vis) { audio.chiado(false); voz.parar(); cancelarTimer(trafTm); trafTm = null; if (r.tx) pttUp(); }
          else { atualizarSom(); agendarTrafego(8000); }
        }, { threshold: 0 });
        io.observe(raiz);
      }
      function aoSairJanela() { if (r.tx) pttUp(); if (r.segurando) segurarFim(); }
      window.addEventListener('blur', aoSairJanela);

      atualizarLcd();
      trocarModo(est.modo);
      agendarTrafego(7000);

      return function limpar() {
        clearInterval(relogioLcd);
        if (pttTick) clearInterval(pttTick);
        if (segTick) clearInterval(segTick);
        timers.forEach(clearTimeout); timers = [];
        voz.parar(); audio.fechar();
        if (io) io.disconnect();
        window.removeEventListener('blur', aoSairJanela);
      };
    },
  });

  // Exposto para testes (node) e reutilização.
  VL.vhfSim = { CANAIS: CANAIS, POR_CANAL: POR_CANAL, GERA: GERA, SITUACOES: SITUACOES, CANAL_Q: CANAL_Q, NATUREZAS: NATUREZAS, dizer: dizer, posTxt: posTxt };
})();
