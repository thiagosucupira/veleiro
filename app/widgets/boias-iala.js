/* Widget "boias-iala": Sistema de Balizamento Marítimo da IALA (AISM), Região B — o adotado no Brasil.
   Galeria com cada marca em 3D (Three.js, formas procedurais) e em SVG leve, ficha de cada marca com a luz animada,
   modo "entrando no porto" (decidir o lado de cada boia ou conduzir o barco pelo canal, de dia ou de noite)
   e desafio (identificar a marca pelo desenho, pela luz à noite ou dizer por onde passar).

   Fontes (citadas na interface):
   - Lista de Faróis (DHN), 40ª ed. (2026–2027, a vigente), Introdução, item 4: item 4.1 (o Brasil assinou o acordo de
     1980 e optou pela Região "B"; research/sources.md, tecnico-94) e quadros dos sinais (águas seguras, novos perigos,
     Região B de dia: tecnico-118, -125, -128). Página oficial: https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois
   - Os "exemplos reais" de luz (nº do sinal, característica e fase detalhada) foram conferidos um a um no PDF da 40ª ed.
     (LF-40ED-2026-2027-FOL-17-26, baixado de assets.marinha.mil.br em 2026-10-09; páginas do PDF entre parênteses):
     2616 Boia nº 2, Porto do Rio de Janeiro (p. 165); 2016 Boia nº 3, Vitória (p. 124); 90 Cação Grande (p. 38);
     355 Banco Ilha Nova (p. 51); 2049 Aribiri Cardinal Norte (p. 126); 214 Ilha das Onças (p. 44);
     351 Pedras Santo Antônio (p. 51); 222 Pedras Val-de-Cães Sul (p. 45); 268 Arsenal (p. 46);
     2614.2 Laje dos Meros (p. 165); 1746 Especial nº 1 (p. 109). Todos mantêm número, característica e fase.
     Os dois exemplos de águas seguras da 34ª ed. (nº 12 e 16, Barra Norte do Rio Amazonas) NÃO existem mais na 40ª ed.
     (a seção da Barra Norte começa no nº 28) e foram trocados por 504 São Marcos de Fora (LpL B 10s; p. 66) e
     2422 Cotunduba (Iso B 2s; p. 143). O Mo(A) passou a ser só ritmo permitido (a Introdução, quadro "Águas Seguras",
     o prevê: tecnico-118), porque não encontrei Mo(A) em nenhum sinal de águas seguras dos quadros da 40ª ed.
     Características mudam: a interface manda conferir os Avisos aos Navegantes.
   - IALA, Sistema de Balizamento Marítimo (MBS), Região B; IALA, Recomendação O-133 (boia de naufrágio de
     emergência: listras azuis e amarelas, cruz amarela, luz Al Bu Y — Bu 1 s, 0,5 s, Y 1 s, 0,5 s).
   - RIPEAM-72, Regra 9 (canais estreitos), citada na ficha de águas seguras.
   Reaproveita VL.luz (analisador, fases, lâmpada e linha do tempo) de widgets/ritmos-luz.js.

   opts de mount (todas opcionais):
     modo: 'galeria' | 'porto' | 'desafio'           aba inicial (padrão 'galeria')
     modos: ['galeria', 'porto', 'desafio']           abas exibidas (padrão: as três)
     marca: 'bombordo'                                marca inicial da galeria (ids abaixo)
     categorias: ['lateral', 'preferencial', 'cardinal', 'perigo', 'seguras', 'especial', 'novo']
                                                      filtra a galeria e o desafio (padrão: todas)
     tresD: true                                      false = só desenhos SVG (mais leve, sem Three.js)
     noite: false                                     começa a cena 3D e o porto à noite
     aviso: true                                      false esconde o quadro "Região B" do topo da galeria
     porto: 'decidir' | 'conduzir'                    submodo inicial do porto (padrão 'decidir')
     desafio: { n: 10, tipos: ['nome', 'luz', 'passar'] }   tamanho da rodada e tipos de pergunta
   ids das marcas: bombordo, boreste, pref-boreste, pref-bombordo, cardinal-n, cardinal-l, cardinal-s,
     cardinal-o, perigo-isolado, aguas-seguras, especial, naufragio

   Exemplos de bloco de lição:
     { t: 'widget', w: 'boias-iala', opts: { modo: 'galeria', marca: 'cardinal-s', categorias: ['cardinal'] } }
     { t: 'widget', w: 'boias-iala', opts: { modo: 'porto', modos: ['porto'], porto: 'conduzir' } }
     { t: 'widget', w: 'boias-iala', opts: { modo: 'desafio', modos: ['desafio'], desafio: { n: 8, tipos: ['luz'] } } } */
(function () {
  'use strict';
  var h = VL.h;
  var seq = 0;
  function uid(p) { seq += 1; return (p || 'bz') + '-' + seq + '-' + Math.random().toString(36).slice(2, 6); }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function en(txt) { return h('span', { class: 'rl-en', 'data-intl': 'on' }, ' (' + txt + ')'); }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function maiusc(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ------------------------------------------------------------------ */
  /* Vocabulário                                                         */
  /* ------------------------------------------------------------------ */
  var TINTA = {
    G: { css: '--nav-green', nome: 'verde' },
    R: { css: '--nav-red', nome: 'encarnada' },
    W: { css: '--nav-white', nome: 'branca' },
    Y: { css: '--nav-yellow', nome: 'amarela' },
    K: { css: '--bz-preta', nome: 'preta' },
    Bu: { css: '--bz-azul', nome: 'azul' },
  };
  function tinta(k) { return 'var(' + TINTA[k].css + ')'; }
  var LUZ_CSS = { W: '--nav-white', R: '--nav-red', G: '--nav-green', Y: '--nav-yellow', Bu: '--bz-azul-luz' };
  var LUZ_NOME = { W: 'branca', R: 'encarnada', G: 'verde', Y: 'amarela', Bu: 'azul' };

  var FORMAS = {
    lata: { nome: 'Cilíndrica (lata)', curto: 'Lata', en: 'can' },
    cone: { nome: 'Cônica', curto: 'Cônica', en: 'conical' },
    esferica: { nome: 'Esférica', curto: 'Esférica', en: 'spherical' },
    pilar: { nome: 'Pilar', curto: 'Pilar', en: 'pillar' },
    charuto: { nome: 'Charuto', curto: 'Charuto', en: 'spar' },
  };
  var CATS = [
    { id: 'lateral', nome: 'Laterais' },
    { id: 'preferencial', nome: 'Canal preferencial' },
    { id: 'cardinal', nome: 'Cardinais' },
    { id: 'perigo', nome: 'Perigo isolado' },
    { id: 'seguras', nome: 'Águas seguras' },
    { id: 'especial', nome: 'Especial' },
    { id: 'novo', nome: 'Perigo novo' },
  ];
  var PASSES = {
    bb: 'Deixar por bombordo (à esquerda)',
    be: 'Deixar por boreste (à direita)',
    N: 'Passar ao norte dela',
    L: 'Passar a leste dela',
    S: 'Passar ao sul dela',
    O: 'Passar a oeste dela',
    afastado: 'Por qualquer lado, com folga: o perigo está junto dela',
    qualquer: 'Por qualquer lado: há água navegável em volta',
    carta: 'Ver na carta o que ela indica: não é marca de rumo',
    longe: 'Passar longe: naufrágio recente, ainda fora das cartas',
  };
  var CONFLITA = { afastado: ['longe'], longe: ['afastado'] };

  var LF = 'Lista de Faróis (DHN, 40ª ed.), Introdução, item 4';
  /* Exemplos reais: Lista de Faróis, DHN, 40ª ed. (2026–2027) — [cor, luz (s), eclipse (s)] por fase */
  var LF_URL = 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf';
  var MARCAS = [
    {
      id: 'bombordo', cat: 'lateral', nome: 'Sinal lateral de bombordo', curto: 'Bombordo', en: 'port hand mark',
      pintura: { h: ['G'] }, formas: ['lata', 'pilar', 'charuto'], tope: 'cilindro',
      coresTxt: 'Verde.', formaTxt: 'Cilíndrica (lata), pilar ou charuto.', topeTxt: 'Um cilindro verde (se houver).',
      luzTxt: 'Verde, com qualquer ritmo, exceto Fl(2+1) — na Lista de Faróis, Lp (2+1).',
      indica: 'O lado esquerdo do canal para quem entra vindo do mar.',
      passar: 'Entrando do mar, deixe-a por bombordo (à sua esquerda). Saindo para o mar, ela fica por boreste.',
      dica: 'Na Região B, entrando do mar, o verde fica a bombordo e o encarnado a boreste.',
      passe: 'bb', ref: LF,
      luzes: [{ real: true, lf: 'Lp. V. 3s', intl: 'Fl G 3s', onde: 'Boia nº 2, Porto do Rio de Janeiro (RJ)', nr: '2616', f: [['G', 0.3, 2.7]] }, { car: 'Q G' }, { car: 'Oc G 4s' }, { car: 'Iso G 2s' }],
    },
    {
      id: 'boreste', cat: 'lateral', nome: 'Sinal lateral de boreste', curto: 'Boreste', en: 'starboard hand mark',
      pintura: { h: ['R'] }, formas: ['cone', 'pilar', 'charuto'], tope: 'cone',
      coresTxt: 'Encarnada (vermelha).', formaTxt: 'Cônica, pilar ou charuto.', topeTxt: 'Um cone encarnado com o vértice para cima (se houver).',
      luzTxt: 'Encarnada, com qualquer ritmo, exceto Fl(2+1).',
      indica: 'O lado direito do canal para quem entra vindo do mar.',
      passar: 'Entrando do mar, deixe-a por boreste (à sua direita). Saindo para o mar, ela fica por bombordo.',
      dica: 'Na Região B, entrando do mar, o encarnado fica a boreste. Na Região A (Europa, África, Austrália e boa parte da Ásia) é o contrário.',
      passe: 'be', ref: LF,
      luzes: [{ real: true, lf: 'Lp. E. 6s', intl: 'Fl R 6s', onde: 'Boia nº 3, canal de acesso ao Porto de Vitória (ES)', nr: '2016', f: [['R', 0.5, 5.5]] }, { car: 'Q R' }, { car: 'Fl(2) R 6s' }, { car: 'Oc R 4s' }],
    },
    {
      id: 'pref-boreste', cat: 'preferencial', nome: 'Canal preferencial a boreste', sub: 'bombordo modificado', curto: 'Pref. a boreste', en: 'preferred channel to starboard',
      pintura: { h: ['G', 'R', 'G'] }, formas: ['lata', 'pilar', 'charuto'], tope: 'cilindro',
      coresTxt: 'Verde com uma faixa larga horizontal encarnada.', formaTxt: 'Cilíndrica (lata), pilar ou charuto.', topeTxt: 'Um cilindro verde (se houver).',
      luzTxt: 'Verde, Fl(2+1): grupo de dois lampejos e depois um.',
      indica: 'Um ponto onde o canal se divide. O canal preferencial (o principal) segue por boreste da marca.',
      passar: 'Para seguir o canal preferencial, trate-a como uma verde: deixe-a por bombordo. Quem vai pelo canal secundário a deixa por boreste.',
      dica: 'A cor de fundo (verde) e o formato dizem como tratá-la no canal principal; a faixa da outra cor avisa que há uma bifurcação.',
      passe: 'bb', ref: LF,
      luzes: [{ real: true, lf: 'Lp (2+1) V. 6s', intl: 'Fl(2+1) G 6s', onde: 'Cação Grande, Rio Amazonas (AP)', nr: '90', f: [['G', 0.5, 0.5], ['G', 0.5, 1.5], ['G', 0.5, 2.5]] }],
    },
    {
      id: 'pref-bombordo', cat: 'preferencial', nome: 'Canal preferencial a bombordo', sub: 'boreste modificado', curto: 'Pref. a bombordo', en: 'preferred channel to port',
      pintura: { h: ['R', 'G', 'R'] }, formas: ['cone', 'pilar', 'charuto'], tope: 'cone',
      coresTxt: 'Encarnada com uma faixa larga horizontal verde.', formaTxt: 'Cônica, pilar ou charuto.', topeTxt: 'Um cone encarnado com o vértice para cima (se houver).',
      luzTxt: 'Encarnada, Fl(2+1): grupo de dois lampejos e depois um.',
      indica: 'Um ponto onde o canal se divide. O canal preferencial (o principal) segue por bombordo da marca.',
      passar: 'Para seguir o canal preferencial, trate-a como uma encarnada: deixe-a por boreste. Quem vai pelo canal secundário a deixa por bombordo.',
      dica: 'A cor de fundo (encarnada) e o formato dizem como tratá-la no canal principal; a faixa verde avisa que há uma bifurcação.',
      passe: 'be', ref: LF,
      luzes: [{ real: true, lf: 'Lp (2+1) E. 12s', intl: 'Fl(2+1) R 12s', onde: 'Banco Ilha Nova (PA)', nr: '355', f: [['R', 0.5, 0.5], ['R', 0.5, 2.5], ['R', 0.5, 7.5]] }],
    },
    {
      id: 'cardinal-n', cat: 'cardinal', nome: 'Sinal cardinal norte', curto: 'Cardinal norte', en: 'north cardinal mark',
      pintura: { h: ['K', 'Y'] }, formas: ['pilar', 'charuto'], tope: 'cones-n',
      coresTxt: 'Preta sobre amarela (preto em cima).', formaTxt: 'Pilar ou charuto.', topeTxt: 'Dois cones pretos, um sobre o outro, com os vértices para cima.',
      luzTxt: 'Branca, rápida (Q) ou muito rápida (VQ), piscando sem parar.',
      indica: 'As águas navegáveis ficam ao norte da marca; o perigo fica ao sul dela.',
      passar: 'Passe ao norte dela.',
      dica: 'Os cones apontam para cima (norte). As pontas dos cones apontam para onde está o preto. Luz contínua: como as 12 horas no relógio.',
      passe: 'N', ref: LF,
      luzes: [{ real: true, lf: 'R. B. 1s', intl: 'Q W', onde: 'Aribiri Cardinal Norte (ES)', nr: '2049', f: [['W', 0.3, 0.7]], continua: true }, { car: 'VQ W' }],
    },
    {
      id: 'cardinal-l', cat: 'cardinal', nome: 'Sinal cardinal leste', curto: 'Cardinal leste', en: 'east cardinal mark',
      pintura: { h: ['K', 'Y', 'K'] }, formas: ['pilar', 'charuto'], tope: 'cones-l',
      coresTxt: 'Preta com uma faixa larga horizontal amarela.', formaTxt: 'Pilar ou charuto.', topeTxt: 'Dois cones pretos, um sobre o outro, base com base.',
      luzTxt: 'Branca, Q(3) 10s ou VQ(3) 5s: grupos de 3 lampejos.',
      indica: 'As águas navegáveis ficam a leste da marca; o perigo fica a oeste dela.',
      passar: 'Passe a leste dela.',
      dica: '3 lampejos, como as 3 horas no relógio (leste). Os cones, base com base, apontam para cima e para baixo: o preto está em cima e embaixo.',
      passe: 'L', ref: LF,
      luzes: [{ real: true, lf: 'R (3) B. 10s', intl: 'Q(3) W 10s', onde: 'Ilha das Onças (PA)', nr: '214', f: [['W', 0.4, 0.6], ['W', 0.4, 0.6], ['W', 0.4, 7.6]] }, { car: 'VQ(3) W 5s' }],
    },
    {
      id: 'cardinal-s', cat: 'cardinal', nome: 'Sinal cardinal sul', curto: 'Cardinal sul', en: 'south cardinal mark',
      pintura: { h: ['Y', 'K'] }, formas: ['pilar', 'charuto'], tope: 'cones-s',
      coresTxt: 'Amarela sobre preta (amarelo em cima).', formaTxt: 'Pilar ou charuto.', topeTxt: 'Dois cones pretos, um sobre o outro, com os vértices para baixo.',
      luzTxt: 'Branca, Q(6)+LFl 15s ou VQ(6)+LFl 10s: 6 lampejos e um lampejo longo.',
      indica: 'As águas navegáveis ficam ao sul da marca; o perigo fica ao norte dela.',
      passar: 'Passe ao sul dela.',
      dica: '6 lampejos, como as 6 horas no relógio (sul). O lampejo longo no fim evita confundir os 6 com 3 ou 9.',
      passe: 'S', ref: LF,
      luzes: [{ real: true, lf: 'R (6) B. + LpL. B. 15s', intl: 'Q(6)+LFl W 15s', onde: 'Pedras Santo Antônio (PA)', nr: '351', f: [['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 2.0, 7.0]] },
        { real: true, lf: 'MR (6) B. + LpL. B. 10s', intl: 'VQ(6)+LFl W 10s', onde: 'Pedras Val-de-Cães Sul (PA)', nr: '222', f: [['W', 0.2, 0.3], ['W', 0.2, 0.3], ['W', 0.2, 0.3], ['W', 0.2, 0.3], ['W', 0.2, 0.3], ['W', 0.2, 0.3], ['W', 2.0, 5.0]] }],
    },
    {
      id: 'cardinal-o', cat: 'cardinal', nome: 'Sinal cardinal oeste', curto: 'Cardinal oeste', en: 'west cardinal mark',
      pintura: { h: ['Y', 'K', 'Y'] }, formas: ['pilar', 'charuto'], tope: 'cones-o',
      coresTxt: 'Amarela com uma faixa larga horizontal preta.', formaTxt: 'Pilar ou charuto.', topeTxt: 'Dois cones pretos, um sobre o outro, vértice com vértice.',
      luzTxt: 'Branca, Q(9) 15s ou VQ(9) 10s: grupos de 9 lampejos.',
      indica: 'As águas navegáveis ficam a oeste da marca; o perigo fica a leste dela.',
      passar: 'Passe a oeste dela.',
      dica: '9 lampejos, como as 9 horas no relógio (oeste). Os cones apontam um para o outro: o preto está no meio.',
      passe: 'O', ref: LF,
      luzes: [{ real: true, lf: 'R (9) B. 15s', intl: 'Q(9) W 15s', onde: 'Arsenal, canal de acesso ao Porto de Belém (PA)', nr: '268', f: [['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 0.7], ['W', 0.3, 6.7]] }, { car: 'VQ(9) W 10s' }],
    },
    {
      id: 'perigo-isolado', cat: 'perigo', nome: 'Sinal de perigo isolado', curto: 'Perigo isolado', en: 'isolated danger mark',
      pintura: { h: ['K', 'R', 'K'] }, formas: ['pilar', 'charuto'], tope: 'esferas2',
      coresTxt: 'Preta com uma ou mais faixas largas horizontais encarnadas.', formaTxt: 'Pilar ou charuto.', topeTxt: 'Duas esferas pretas, uma sobre a outra.',
      luzTxt: 'Branca, Fl(2): grupo de dois lampejos.',
      indica: 'Um perigo de tamanho limitado (uma pedra, um casco soçobrado) com águas navegáveis em toda a volta. A marca fica sobre o perigo ou junto dele.',
      passar: 'Pode passar por qualquer lado, mas com folga: o perigo está ali, junto da marca.',
      dica: 'Duas esferas e dois lampejos: "dois" lembra "perigo isolado".',
      passe: 'afastado', ref: LF,
      luzes: [{ real: true, lf: 'Lp (2) B. 5s', intl: 'Fl(2) W 5s', onde: 'Laje dos Meros, Porto do Rio de Janeiro (RJ)', nr: '2614.2', f: [['W', 0.5, 1.0], ['W', 0.5, 3.0]] }, { car: 'Fl(2) W 10s' }],
    },
    {
      id: 'aguas-seguras', cat: 'seguras', nome: 'Sinal de águas seguras', curto: 'Águas seguras', en: 'safe water mark',
      pintura: { v: ['R', 'W'], n: 8 }, formas: ['esferica', 'pilar', 'charuto'], tope: 'esfera',
      coresTxt: 'Faixas verticais encarnadas e brancas.', formaTxt: 'Esférica; ou pilar ou charuto com tope esférico.', topeTxt: 'Uma esfera encarnada (se houver).',
      luzTxt: 'Branca: isofásica (Iso), ocultação (Oc), lampejo longo a cada 10 s (LFl 10s) ou Morse letra A, Mo(A).',
      indica: 'Águas navegáveis em volta da marca: meio ou eixo de canal, ou aterragem (a marca que recebe quem chega do mar). Pode substituir uma cardinal ou lateral para indicar a aproximação de terra.',
      passar: 'Pode passar por qualquer lado. Num canal estreito, o RIPEAM (Regra 9) manda navegar pelo lado de boreste do canal; por isso uma marca de meio de canal costuma ficar por bombordo.',
      dica: 'Listras verticais e luz "calma" (Iso, Oc, LFl, Mo A): nada de grupos de lampejos.',
      passe: 'qualquer', ref: LF + '; RIPEAM, Regra 9',
      luzes: [{ real: true, lf: 'LpL. B. 10s', intl: 'LFl W 10s', onde: 'São Marcos de Fora (Águas Seguras), Baía de São Marcos (MA)', nr: '504', f: [['W', 2.0, 8.0]] },
        { real: true, lf: 'Iso. B. 2s', intl: 'Iso W 2s', onde: 'Cotunduba (Águas Seguras), Porto do Rio de Janeiro (RJ)', nr: '2422', f: [['W', 1.0, 1.0]] }, { car: 'Mo(A) W 5s' }, { car: 'Oc W 4s' }],
    },
    {
      id: 'especial', cat: 'especial', nome: 'Sinal especial', curto: 'Especial', en: 'special mark',
      pintura: { h: ['Y'] }, formas: ['pilar', 'charuto'], tope: 'x',
      coresTxt: 'Amarela.', formaTxt: 'Livre, desde que não se confunda com outros sinais.', topeTxt: 'Um X amarelo (se houver).',
      luzTxt: 'Amarela, com ritmo diferente dos reservados: Oc, Fl (menos LFl 10s), Fl(4), Fl(5), Fl(6), Fl(…+…) ou Mo (menos A e U).',
      indica: 'Não orienta a navegação: indica uma área ou característica mencionada na carta ou nos documentos náuticos — boias oceanográficas, separação de tráfego, área de despejo, exercícios militares, cabo ou tubulação submarina, área de recreação, prospecção, dragagem.',
      passar: 'Consulte a carta para saber o que ela indica e respeite a restrição da área (por exemplo, não fundeie sobre um cabo submarino).',
      dica: 'Amarelo com X: "atenção, área especial", não "passe por aqui".',
      passe: 'carta', ref: LF,
      luzes: [{ real: true, lf: 'Lp. A. 2s', intl: 'Fl Y 2s', onde: 'Especial nº 1 (BA)', nr: '1746', f: [['Y', 0.8, 1.2]] }, { car: 'Fl(4) Y 12s' }, { car: 'Oc Y 4s' }],
    },
    {
      id: 'naufragio', cat: 'novo', nome: 'Boia de naufrágio de emergência', curto: 'Naufrágio', en: 'emergency wreck marking buoy',
      pintura: { v: ['Bu', 'Y'], n: 8 }, formas: ['pilar', 'charuto'], tope: 'cruz',
      coresTxt: 'Listras verticais azuis e amarelas, em número igual (de 4 a 8).', formaTxt: 'Pilar ou charuto.', topeTxt: 'Uma cruz amarela, em pé.',
      luzTxt: 'Alternada azul e amarela: azul 1 s, escuro 0,5 s, amarelo 1 s, escuro 0,5 s (período de 3 s).',
      indica: 'Marca, de forma provisória, um naufrágio recente que ainda não está nas cartas (um "perigo novo"). Pode ter racon com a letra D em Morse e AIS.',
      passar: 'Passe longe e procure os Avisos aos Navegantes. Com o tempo ela é trocada por marcas permanentes (cardinais, laterais ou de perigo isolado).',
      dica: 'Azul só existe nesta marca: viu lampejo azul e amarelo alternado, é naufrágio novo.',
      passe: 'longe', ref: 'IALA, Recomendação O-133; Lista de Faróis (DHN, 40ª ed.), quadro "Novos Perigos", p. XXIX', fato: 'tecnico-125',
      luzes: [{ real: false, lf: null, intl: 'Al Bu Y 3s', onde: 'Padrão da IALA (Recomendação O-133)', f: [['Bu', 1.0, 0.5], ['Y', 1.0, 0.5]] }],
    },
  ];
  /* nome com artigo, para frases ("é o sinal…", "era a boia…") */
  function chamar(m) {
    var n = m.nome.charAt(0).toLowerCase() + m.nome.slice(1) + (m.sub ? ' (' + m.sub + ')' : '');
    if (m.cat === 'preferencial') return 'o sinal de ' + n;
    return (m.cat === 'novo' ? 'a ' : 'o ') + n;
  }
  var POR_ID = {};
  MARCAS.forEach(function (m) { POR_ID[m.id] = m; });

  /* ------------------------------------------------------------------ */
  /* Fases a partir da "fase detalhada" publicada                        */
  /* ------------------------------------------------------------------ */
  function fasesDe(luz) {
    if (luz.car) { var c = VL.luz.analisar(luz.car); return VL.luz.fases(c); }
    var L = [], t = 0;
    luz.f.forEach(function (x) {
      L.push({ on: true, dur: x[1], cor: x[0], nivel: 1, ini: t }); t += x[1];
      if (x[2] > 0) { L.push({ on: false, dur: x[2], cor: x[0], nivel: 0, ini: t }); t += x[2]; }
    });
    return { lista: L, periodo: t, janela: luz.continua ? 4 : t, continua: false, rapidaContinua: !!luz.continua, ilustrativa: false };
  }
  function rotuloLuz(luz) {
    if (luz.car) { var c = VL.luz.analisar(luz.car); return { intl: VL.luz.formatar(c, 'intl'), lf: VL.luz.formatar(c, 'pt') }; }
    return { intl: luz.intl, lf: luz.lf };
  }
  function faseDetalhadaTxt(luz) {
    function n(x) { return VL.fmt.num(x, 1); }
    var sig = { W: 'B', R: 'E', G: 'V', Y: 'A', Bu: 'Az' };
    return luz.f.map(function (x) { return sig[x[0]] + '. ' + n(x[1]) + ' – Ecl. ' + n(x[2]); }).join(' · ');
  }

  /* ------------------------------------------------------------------ */
  /* Desenho SVG (perfil lateral)                                        */
  /* ------------------------------------------------------------------ */
  var G2 = {
    lata: { top: 72, path: 'M30 118 V72 H70 V118 Z', hw: function () { return 20; } },
    cone: { top: 62, path: 'M28 118 V110 L47 62 H53 L72 110 V118 Z', hw: function (y) { return y >= 110 ? 22 : 3 + (y - 62) / 48 * 19; } },
    esferica: { top: 72, path: 'M40.4 118 A24 24 0 1 1 59.6 118 Z', hw: function (y) { var d = y - 96; return Math.sqrt(Math.max(0, 576 - d * d)); } },
    pilar: { top: 52, path: 'M22 118 L25 106 H36 L42 52 H58 L64 106 H75 L78 118 Z', hw: function (y) { return y >= 106 ? 25 + (y - 106) / 12 * 3 : 8 + (y - 52) / 54 * 6; } },
    charuto: { top: 46, path: 'M44 118 V52 Q44 46 50 46 Q56 46 56 52 V118 Z', hw: function () { return 6; } },
  };
  function svgTope(g, tope, b) {
    var K = tinta('K'), cl = 'bz-tope';
    function tri(x1, y1, x2, y2, x3, y3, cor) { g.appendChild(h('polygon', { points: [x1, y1, x2, y2, x3, y3].join(' '), class: cl, style: { fill: cor } })); }
    function bola(cx, cy, r, cor) { g.appendChild(h('circle', { cx: cx, cy: cy, r: r, class: cl, style: { fill: cor } })); }
    function traco(d, cor) {
      g.appendChild(h('path', { d: d, class: 'bz-tope-contorno' }));
      g.appendChild(h('path', { d: d, class: 'bz-tope-traco', style: { stroke: cor } }));
    }
    if (tope === 'cilindro') g.appendChild(h('rect', { x: 43, y: b - 16, width: 14, height: 16, class: cl, style: { fill: tinta('G') } }));
    else if (tope === 'cone') tri(41, b, 59, b, 50, b - 16, tinta('R'));
    else if (tope === 'cones-n') { tri(41, b, 59, b, 50, b - 13, K); tri(41, b - 16, 59, b - 16, 50, b - 29, K); }
    else if (tope === 'cones-s') { tri(41, b - 13, 59, b - 13, 50, b, K); tri(41, b - 29, 59, b - 29, 50, b - 16, K); }
    else if (tope === 'cones-l') { tri(41, b - 13, 59, b - 13, 50, b, K); tri(41, b - 16, 59, b - 16, 50, b - 29, K); }
    else if (tope === 'cones-o') { tri(41, b, 59, b, 50, b - 13, K); tri(41, b - 29, 59, b - 29, 50, b - 16, K); }
    else if (tope === 'esferas2') { bola(50, b - 6.5, 6.5, K); bola(50, b - 22, 6.5, K); }
    else if (tope === 'esfera') bola(50, b - 8, 8, tinta('R'));
    else if (tope === 'x') traco('M42 ' + (b - 16) + ' L58 ' + b + ' M58 ' + (b - 16) + ' L42 ' + b, tinta('Y'));
    else if (tope === 'cruz') traco('M50 ' + (b - 18) + ' V' + b + ' M41 ' + (b - 9) + ' H59', tinta('Y'));
  }
  /** Desenho lateral de uma marca. o: {forma, luz (cor da lanterna ou null), classe, rotulo} */
  function desenharMarca(m, o) {
    o = o || {};
    var forma = o.forma && G2[o.forma] && m.formas.indexOf(o.forma) >= 0 ? o.forma : m.formas[0];
    var F = G2[forma], idc = uid('bzc'), idg = uid('bzg');
    var svg = h('svg', { viewBox: '0 0 100 136', class: 'bz-marca-svg' + (o.classe ? ' ' + o.classe : ''), role: 'img', 'aria-label': o.rotulo || (m.nome + ', formato ' + FORMAS[forma].nome.toLowerCase()) });
    var defs = h('defs', null,
      h('clipPath', { id: idc }, h('path', { d: F.path })),
      h('linearGradient', { id: idg, x1: '0', x2: '1', y1: '0', y2: '0' },
        h('stop', { offset: '0', style: { 'stop-color': 'var(--bz-preta)', 'stop-opacity': '0.22' } }),
        h('stop', { offset: '0.32', style: { 'stop-color': 'var(--nav-white)', 'stop-opacity': '0.26' } }),
        h('stop', { offset: '0.6', style: { 'stop-color': 'var(--nav-white)', 'stop-opacity': '0' } }),
        h('stop', { offset: '1', style: { 'stop-color': 'var(--bz-preta)', 'stop-opacity': '0.34' } })));
    svg.appendChild(defs);
    /* água */
    if (o.agua !== false) svg.appendChild(h('rect', { x: 0, y: 118, width: 100, height: 18, class: 'bz-agua' }));
    /* mastro, lanterna e tope */
    var b = F.top - 12, g = h('g');
    g.appendChild(h('line', { x1: 50, x2: 50, y1: F.top, y2: b - (m.tope.indexOf('cones') === 0 || m.tope === 'esferas2' ? 14 : 4), class: 'bz-mastro' }));
    if (o.luz) {
      g.appendChild(h('rect', { x: 45.5, y: F.top - 9, width: 9, height: 7, rx: 1.5, class: 'bz-lanterna' }));
      g.appendChild(h('rect', { x: 47, y: F.top - 8, width: 6, height: 4, rx: 1, style: { fill: 'var(' + (LUZ_CSS[o.luz] || '--nav-white') + ')' } }));
    }
    svgTope(g, m.tope, b);
    svg.appendChild(g);
    /* corpo pintado */
    var corpo = h('g', { 'clip-path': 'url(#' + idc + ')' });
    var y0 = F.top - 1, y1 = 119;
    if (m.pintura.h) {
      var nb = m.pintura.h.length, alt = (118 - F.top) / nb;
      m.pintura.h.forEach(function (k, i) {
        corpo.appendChild(h('rect', { x: 0, y: i === 0 ? y0 - 2 : F.top + i * alt, width: 100, height: (i === 0 ? alt + 3 : alt) + (i === nb - 1 ? 4 : 0.2), style: { fill: tinta(k) } }));
      });
    } else {
      var n = m.pintura.n || 8, larg = 2 * Math.PI / n;
      for (var k = 0; k < n / 2; k++) {
        var ta = -Math.PI / 2 + k * larg, tb = ta + larg, esq = [], dir = [];
        for (var s = 0; s <= 14; s++) {
          var y = y0 + (y1 - y0) * s / 14, hw = F.hw(y) + 0.6;
          esq.push((50 + hw * Math.sin(ta)).toFixed(2) + ',' + y.toFixed(2));
          dir.unshift((50 + hw * Math.sin(tb)).toFixed(2) + ',' + y.toFixed(2));
        }
        corpo.appendChild(h('polygon', { points: esq.concat(dir).join(' '), style: { fill: tinta(m.pintura.v[k % m.pintura.v.length]) } }));
      }
    }
    corpo.appendChild(h('rect', { x: 0, y: 0, width: 100, height: 136, fill: 'url(#' + idg + ')' }));
    svg.appendChild(corpo);
    svg.appendChild(h('path', { d: F.path, class: 'bz-contorno' }));
    if (o.agua !== false) svg.appendChild(h('path', { d: 'M0 119 Q12.5 116.5 25 119 T50 119 T75 119 T100 119', class: 'bz-onda' }));
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* Cores resolvidas (para canvas/WebGL)                                */
  /* ------------------------------------------------------------------ */
  function resolvedor(el) {
    var cv = document.createElement('canvas'); cv.width = cv.height = 1;
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    return function (expr) {
      var p = document.createElement('span');
      p.style.color = expr; p.style.display = 'none';
      el.appendChild(p);
      var c = getComputedStyle(p).color;
      el.removeChild(p);
      if (!ctx) return [128, 128, 128];
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#808080'; ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      var d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
  }

  /* ------------------------------------------------------------------ */
  /* Cena 3D                                                             */
  /* ------------------------------------------------------------------ */
  /* perfis [raio, altura] do fundo para o topo (altura 0 = linha d'água), com pequenos chanfros nos cantos */
  var PERFIS = {
    lata: { top: 1.5, pts: [[0, -0.4], [0.75, -0.4], [0.75, 1.47], [0.72, 1.5], [0, 1.5]] },
    cone: { top: 1.95, pts: [[0, -0.4], [0.8, -0.4], [0.8, 0.12], [0.77, 0.18], [0.07, 1.92], [0.03, 1.95], [0, 1.95]] },
    esferica: { top: 1.45, esfera: { r: 0.9, cy: 0.55 } },
    pilar: { top: 2.7, pts: [[0, -0.4], [1.0, -0.4], [1.0, 0.33], [0.96, 0.38], [0.56, 0.44], [0.53, 0.5], [0.33, 2.6], [0.43, 2.61], [0.44, 2.66], [0.42, 2.7], [0, 2.7]] },
    charuto: { top: 3.3, pts: [[0, -0.4], [0.23, -0.4], [0.23, 3.1], [0.2, 3.2], [0.12, 3.28], [0, 3.3]] },
  };
  function perfilEsfera(r, cy) {
    var pts = [], i;
    var a0 = -Math.asin(Math.min(1, (cy + 0.4) / r));
    for (i = 0; i <= 28; i++) { var a = a0 + (Math.PI / 2 - a0) * i / 28; pts.push([r * Math.cos(a), cy + r * Math.sin(a)]); }
    pts[pts.length - 1][0] = 0;
    pts.unshift([0, pts[0][1]]);
    return pts;
  }
  function refinar(pts, ys) {
    var out = [pts[0]];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var cortes = ys.filter(function (y) { return (y > Math.min(a[1], b[1]) + 1e-6) && (y < Math.max(a[1], b[1]) - 1e-6); });
      cortes.sort(function (p, q) { return a[1] < b[1] ? p - q : q - p; });
      cortes.forEach(function (y) { var t = (y - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, y]); });
      out.push(b);
    }
    return out;
  }

  function temWebGL() {
    try {
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl2') || c.getContext('webgl');
      if (gl && gl.getExtension) { var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
      return !!gl;
    } catch (e) { return false; }
  }
  function criarCena(host, el, T, o) {
    var renderer;
    if (!temWebGL()) return null;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' }); } catch (e) { return null; }
    if (!renderer || !renderer.getContext()) { try { renderer.dispose(); } catch (e2) { /* nada */ } return null; }
    var cor = resolvedor(el);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var cv = renderer.domElement;
    cv.className = 'bz-canvas';
    cv.setAttribute('role', 'img');
    host.appendChild(cv);
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(35, 1, 0.1, 300);
    var controls = new T.OrbitControls(camera, cv);
    controls.enablePan = false; controls.enableDamping = false;
    controls.minDistance = 3.5; controls.maxDistance = 24;
    controls.minPolarAngle = Math.PI * 0.12; controls.maxPolarAngle = Math.PI * 0.485;
    controls.rotateSpeed = 0.8;
    /* roda do mouse: só aproxima com Ctrl (ou pinça no trackpad); sem Ctrl, a página rola normalmente */
    function filtroRoda(e) { if (!e.ctrlKey) e.stopPropagation(); }
    host.addEventListener('wheel', filtroRoda, true);

    var geos = [], mats = [], texs = [];
    function G(g) { geos.push(g); return g; }
    function M(m) { mats.push(m); return m; }
    function rgbT(arr, alvo) { (alvo || (alvo = new T.Color())).setRGB(arr[0] / 255, arr[1] / 255, arr[2] / 255, T.SRGBColorSpace); return alvo; }
    var paleta = {};
    function lerPaleta() {
      Object.keys(TINTA).forEach(function (k) { paleta[k] = rgbT(cor('var(' + TINTA[k].css + ')')); });
      Object.keys(LUZ_CSS).forEach(function (k) { paleta['luz' + k] = rgbT(cor('var(' + LUZ_CSS[k] + ')')); });
      paleta.ceuDia = rgbT(cor('color-mix(in srgb, var(--sea-1) 55%, var(--paper))'));
      paleta.marDia = rgbT(cor('color-mix(in srgb, var(--sea-3) 70%, var(--sea-2))'));
      paleta.ceuNoite = rgbT(cor('var(--bz-noite)'));
      paleta.marNoite = rgbT(cor('color-mix(in srgb, var(--bz-noite) 72%, var(--sea-3))'));
      paleta.chao = rgbT(cor('var(--sea-3)'));
      paleta.lua = rgbT(cor('color-mix(in srgb, var(--nav-white) 70%, var(--sea-3))'));
    }
    lerPaleta();

    var matCorpo = M(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0.0 }));
    var matTope = {};
    function mTope(k) { if (!matTope[k]) matTope[k] = M(new T.MeshStandardMaterial({ color: paleta[k].clone(), roughness: 0.55, metalness: 0 })); return matTope[k]; }
    var matMastro = M(new T.MeshStandardMaterial({ color: paleta.K.clone(), roughness: 0.5, metalness: 0.2 }));
    var matLente = M(new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0, emissive: 0x000000 }));
    var matMar = M(new T.MeshStandardMaterial({ color: paleta.marDia.clone(), roughness: 0.92, metalness: 0 }));
    var mar = new T.Mesh(G(new T.CircleGeometry(120, 64)), matMar);
    mar.rotation.x = -Math.PI / 2;
    scene.add(mar);
    var hemi = new T.HemisphereLight(0xffffff, paleta.chao.clone(), 1.25);
    scene.add(hemi);
    var sol = new T.DirectionalLight(0xffffff, 1.9);
    sol.position.set(5, 9, 7);
    scene.add(sol);
    var lanternaLuz = new T.PointLight(0xffffff, 0, 9, 1.6);
    scene.add(lanternaLuz);
    /* brilho da luz (sprite com gradiente radial) */
    var cvB = document.createElement('canvas'); cvB.width = cvB.height = 128;
    var cb = cvB.getContext('2d');
    var gr = cb.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,0.75)');
    gr.addColorStop(0.45, 'rgba(255,255,255,0.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    cb.fillStyle = gr; cb.fillRect(0, 0, 128, 128);
    var texB = new T.CanvasTexture(cvB); texs.push(texB);
    var matBrilho = M(new T.SpriteMaterial({ map: texB, color: 0xffffff, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 }));
    var brilho = new T.Sprite(matBrilho);
    scene.add(brilho);
    /* sombra de contato na linha d'água (mesmo gradiente, tingido com a cor preta da boia) */
    var matSombra = M(new T.MeshBasicMaterial({ map: texB, color: paleta.K.clone(), transparent: true, opacity: 0.5, depthWrite: false }));
    var sombra = new T.Mesh(G(new T.CircleGeometry(1, 40)), matSombra);
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.01;
    scene.add(sombra);

    var est = { m: null, forma: null, noite: !!o.noite, fs: null, t: 0, tocando: !reduzMov(), visivel: true, raf: 0, ultimo: 0, faseI: -1, pedido: 0, lente: null, alvoY: 1.4 };
    var boia = null, boiaGeos = [];

    function pintar(geo, pintura, topo) {
      var pos = geo.attributes.position, n = pos.count, cols = new Float32Array(n * 3);
      for (var i = 0; i < n; i += 3) {
        var x = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
        var y = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
        var z = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
        var k;
        if (pintura.h) {
          var nb = pintura.h.length, idx = Math.floor((topo - y) / (topo / nb));
          k = pintura.h[Math.max(0, Math.min(nb - 1, idx))];
        } else {
          var nv = pintura.n || 8, ph = (Math.atan2(x, z) + 2 * Math.PI) % (2 * Math.PI);
          k = pintura.v[Math.floor(ph / (2 * Math.PI / nv)) % pintura.v.length];
        }
        var c = paleta[k];
        for (var j = 0; j < 3; j++) { cols[(i + j) * 3] = c.r; cols[(i + j) * 3 + 1] = c.g; cols[(i + j) * 3 + 2] = c.b; }
      }
      geo.setAttribute('color', new T.BufferAttribute(cols, 3));
    }
    function malha(geo, mat, x, y, z) { boiaGeos.push(geo); var me = new T.Mesh(geo, mat); me.position.set(x || 0, y || 0, z || 0); return me; }
    function construirTope(grupo, tope, base) {
      var K = mTope('K');
      function cone(y, paraBaixo, mat) { var me = malha(new T.ConeGeometry(0.27, 0.42, 36), mat || K, 0, y, 0); if (paraBaixo) me.rotation.x = Math.PI; grupo.add(me); }
      function bola(y, r, mat) { grupo.add(malha(new T.SphereGeometry(r, 28, 18), mat, 0, y, 0)); }
      function barra(w, hh, y, rot, mat) { var me = malha(new T.BoxGeometry(w, hh, 0.09), mat, 0, y, 0); me.rotation.z = rot || 0; grupo.add(me); }
      var alto = 0.5;
      if (tope === 'cilindro') { grupo.add(malha(new T.CylinderGeometry(0.23, 0.23, 0.44, 32), mTope('G'), 0, base + 0.22, 0)); alto = 0.44; }
      else if (tope === 'cone') { cone(base + 0.23, false, mTope('R')); alto = 0.46; }
      else if (tope === 'cones-n') { cone(base + 0.21); cone(base + 0.75); alto = 0.96; }
      else if (tope === 'cones-s') { cone(base + 0.21, true); cone(base + 0.75, true); alto = 0.96; }
      else if (tope === 'cones-l') { cone(base + 0.21, true); cone(base + 0.75); alto = 0.96; }
      else if (tope === 'cones-o') { cone(base + 0.21); cone(base + 0.75, true); alto = 0.96; }
      else if (tope === 'esferas2') { bola(base + 0.2, 0.2, K); bola(base + 0.68, 0.2, K); alto = 0.88; }
      else if (tope === 'esfera') { bola(base + 0.25, 0.25, mTope('R')); alto = 0.5; }
      else if (tope === 'x') { barra(0.1, 0.66, base + 0.26, Math.PI / 4, mTope('Y')); barra(0.1, 0.66, base + 0.26, -Math.PI / 4, mTope('Y')); alto = 0.52; }
      else if (tope === 'cruz') { barra(0.1, 0.6, base + 0.3, 0, mTope('Y')); barra(0.6, 0.1, base + 0.3, 0, mTope('Y')); alto = 0.6; }
      return alto;
    }
    function limparBoia() {
      if (boia) scene.remove(boia);
      boiaGeos.forEach(function (g) { g.dispose(); });
      boiaGeos = []; boia = null;
    }
    function mostrar(m, forma) {
      est.m = m; est.forma = forma;
      limparBoia();
      boia = new T.Group();
      var P = PERFIS[forma];
      var pts = P.esfera ? perfilEsfera(P.esfera.r, P.esfera.cy) : P.pts.map(function (p) { return p.slice(); });
      if (m.pintura.h) {
        var nb = m.pintura.h.length, ys = [];
        for (var i = 1; i < nb; i++) ys.push(P.top - i * P.top / nb);
        pts = refinar(pts, ys);
      }
      var lg = new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), 64);
      var geo = lg.toNonIndexed(); lg.dispose();
      pintar(geo, m.pintura, P.top);
      boia.add(malha(geo, matCorpo));
      /* lanterna e mastro */
      var topo = P.top;
      boia.add(malha(new T.CylinderGeometry(0.14, 0.16, 0.08, 24), matMastro, 0, topo + 0.04, 0));
      var lente = malha(new T.CylinderGeometry(0.12, 0.12, 0.2, 24), matLente, 0, topo + 0.18, 0);
      boia.add(lente);
      boia.add(malha(new T.ConeGeometry(0.15, 0.08, 24), matMastro, 0, topo + 0.32, 0));
      var baseTope = topo + 0.62;
      var alto = construirTope(boia, m.tope, baseTope);
      var hMastro = baseTope - topo + (m.tope.indexOf('cones') === 0 || m.tope === 'esferas2' ? alto * 0.6 : 0.1);
      boia.add(malha(new T.CylinderGeometry(0.035, 0.035, hMastro, 8), matMastro, 0, topo + hMastro / 2, 0));
      scene.add(boia);
      var rmax = P.esfera ? P.esfera.r : Math.max.apply(null, P.pts.map(function (p) { return p[0]; }));
      sombra.scale.set(rmax * 2.1, rmax * 2.1, 1);
      est.lenteY = topo + 0.18;
      lanternaLuz.position.set(0, topo + 0.18, 0.05);
      brilho.position.set(0, topo + 0.18, 0);
      /* enquadramento */
      var total = baseTope + alto;
      est.alvoY = total * 0.47;
      var d = Math.max(6.2, total * 2.7);
      controls.target.set(0, est.alvoY, 0);
      var dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() < 0.01 || !est.posicionada) { dir.set(0.62, 0.2, 0.86); est.posicionada = true; }
      dir.normalize().multiplyScalar(d);
      camera.position.copy(controls.target).add(dir);
      controls.update();
      cv.setAttribute('aria-label', 'Modelo 3D: ' + m.nome + ', formato ' + FORMAS[forma].nome.toLowerCase() + '. Arraste para girar.');
      aplicarLuz(); pedir();
    }
    function aplicarAmbiente() {
      var noite = est.noite;
      scene.background = (noite ? paleta.ceuNoite : paleta.ceuDia).clone();
      scene.fog = new T.Fog(scene.background.getHex(), 26, 110);
      matMar.color.copy(noite ? paleta.marNoite : paleta.marDia);
      hemi.intensity = noite ? 0.16 : 1.25;
      sol.intensity = noite ? 0.22 : 1.9;
      sol.color.copy(noite ? paleta.lua : paleta.luzW);
    }
    function aplicarLuz() {
      var f = null;
      if (est.fs) { var q = VL.luz.faseEm(est.fs, est.t); f = q.f; if (q.i !== est.faseI) { est.faseI = q.i; if (o.aoFase) o.aoFase(f); } }
      var corK = f ? f.cor : 'W', c = paleta['luz' + corK] || paleta.luzW;
      var aceso = est.noite && f && f.on;
      matLente.color.copy(c).multiplyScalar(est.noite ? 0.25 : 0.75);
      matLente.emissive.copy(c).multiplyScalar(aceso ? 1.0 : (est.noite ? 0.02 : 0.08));
      lanternaLuz.color.copy(c);
      lanternaLuz.intensity = aceso ? 6 : 0;
      matBrilho.color.copy(c);
      matBrilho.opacity = aceso ? 1 : 0;
      var s = aceso ? 2.4 : 0.1;
      brilho.scale.set(s, s, 1);
    }
    function render() { est.pedido = 0; renderer.render(scene, camera); }
    function pedir() { if (!est.pedido) est.pedido = requestAnimationFrame(render); }
    function quadro(agora) {
      est.raf = 0;
      if (!(est.noite && est.tocando && est.visivel && !document.hidden && est.fs)) return;
      if (est.ultimo) est.t += Math.min(0.1, (agora - est.ultimo) / 1000);
      est.ultimo = agora;
      aplicarLuz();
      renderer.render(scene, camera);
      est.raf = requestAnimationFrame(quadro);
    }
    function agendar() { if (!est.raf && est.noite && est.tocando && est.visivel && !document.hidden) { est.ultimo = 0; est.raf = requestAnimationFrame(quadro); } }
    function parar() { if (est.raf) cancelAnimationFrame(est.raf); est.raf = 0; }
    controls.addEventListener('change', pedir);

    var ro = new ResizeObserver(function () {
      var w = host.clientWidth || 320, hh = host.clientHeight || Math.round(w * 0.8);
      renderer.setSize(w, hh, false);
      camera.aspect = w / hh; camera.updateProjectionMatrix();
      pedir();
    });
    ro.observe(host);
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { est.visivel = es[es.length - 1].isIntersecting; if (est.visivel) { agendar(); pedir(); } else parar(); }, { threshold: 0.01 });
      io.observe(host);
    }
    function aoVis() { if (!document.hidden) agendar(); }
    document.addEventListener('visibilitychange', aoVis);
    /* perda do contexto WebGL: aviso, restauração (Three.js recria os recursos) ou recriação da cena (VL.gl3d, core/ui.js) */
    var vigia = VL.gl3d.vigiar(cv, host, {
      restaurou: function () { renderer.setSize(host.clientWidth || 320, host.clientHeight || 256, false); pedir(); agendar(); },
      recriar: o.recriar,
      falhou: o.aoFalhar,
    });
    aplicarAmbiente();

    return {
      mostrar: mostrar,
      luz: function (fs) { est.fs = fs; est.t = 0; est.faseI = -1; aplicarLuz(); pedir(); },
      noite: function (v) { est.noite = !!v; aplicarAmbiente(); est.faseI = -1; aplicarLuz(); pedir(); if (est.noite) agendar(); else parar(); },
      tocar: function () { est.tocando = true; agendar(); },
      pausar: function () { est.tocando = false; parar(); },
      tocando: function () { return est.tocando; },
      passo: function () {
        if (!est.fs) return;
        var q = VL.luz.faseEm(est.fs, est.t), L = est.fs.lista, base = est.t - q.x, i = q.i + 1, extra = 0;
        if (i >= L.length) { i = 0; extra = est.fs.periodo; }
        est.t = base + extra + L[i].ini + 1e-4; aplicarLuz(); pedir();
      },
      recolorir: function () {
        lerPaleta();
        Object.keys(matTope).forEach(function (k) { matTope[k].color.copy(paleta[k]); });
        matMastro.color.copy(paleta.K);
        matSombra.color.copy(paleta.K);
        hemi.groundColor.copy(paleta.chao);
        aplicarAmbiente();
        if (est.m) mostrar(est.m, est.forma); else pedir();
      },
      destruir: function () {
        parar();
        if (est.pedido) cancelAnimationFrame(est.pedido);
        ro.disconnect(); if (io) io.disconnect();
        document.removeEventListener('visibilitychange', aoVis);
        host.removeEventListener('wheel', filtroRoda, true);
        vigia.parar();
        controls.dispose();
        limparBoia();
        geos.forEach(function (g) { g.dispose(); });
        mats.forEach(function (m) { m.dispose(); });
        texs.forEach(function (t) { t.dispose(); });
        renderer.dispose();
        VL.gl3d.soltar(renderer);
        if (cv.parentNode) cv.parentNode.removeChild(cv);
      },
    };
  }

  /* ------------------------------------------------------------------ */
  /* Ficha da marca                                                      */
  /* ------------------------------------------------------------------ */
  function fonteMarca(m) {
    var p = h('p', { class: 'bz-fonte' }, 'Fonte: ' + m.ref + '; IALA, Sistema de Balizamento Marítimo, Região B.');
    if (m.fato) {
      p.appendChild(document.createTextNode(' '));
      p.appendChild(VL.ui.fonte(m.fato));
    }
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* Mapa do porto (modo "entrando no porto")                            */
  /* ------------------------------------------------------------------ */
  var AGUA = [[0, 560], [0, 474], [70, 470], [124, 452], [138, 430], [140, 372], [120, 338], [100, 300], [98, 262], [112, 226], [132, 200], [128, 170],
    [94, 119], [62, 70], [48, 40], [20, 40], [20, 8], [86, 8], [100, 40], [136, 91], [160, 128], [182, 168], [208, 115], [248, 65], [262, 40], [262, 8],
    [340, 8], [340, 40], [318, 44], [288, 96], [248, 146], [232, 176], [250, 212], [240, 250], [232, 300], [226, 340], [226, 368], [222, 430], [238, 452], [290, 470], [360, 474], [360, 560]];
  var BAIXIO = [[236, 252], [264, 238], [292, 276], [288, 326], [252, 348], [232, 330], [232, 300]];
  var PEDRA = { x: 172, y: 248, r: 9 };
  var ESC_MAPA = 0.25;
  var PMARCAS = [
    { k: 'AS', id: 'aguas-seguras', x: 180, y: 500, forma: 'esferica', luz: 'LFl W 10s' },
    { k: 'G1', id: 'bombordo', x: 138, y: 430, forma: 'lata', luz: 'Fl G 3s' },
    { k: 'R1', id: 'boreste', x: 222, y: 430, forma: 'cone', luz: 'Fl R 3s' },
    { k: 'G2', id: 'bombordo', x: 140, y: 372, forma: 'lata', luz: 'Q G' },
    { k: 'R2', id: 'boreste', x: 226, y: 368, forma: 'cone', luz: 'Q R' },
    { k: 'CO', id: 'cardinal-o', x: 232, y: 300, forma: 'pilar', luz: 'Q(9) W 15s' },
    { k: 'ES', id: 'especial', x: 122, y: 270, forma: 'pilar', luz: 'Fl Y 5s' },
    { k: 'PI', id: 'perigo-isolado', x: 172, y: 248, forma: 'pilar', luz: 'Fl(2) W 5s' },
    { k: 'PB', id: 'pref-boreste', x: 182, y: 168, forma: 'pilar', luz: 'Fl(2+1) G 6s' },
    { k: 'G3', id: 'bombordo', x: 208, y: 115, forma: 'lata', luz: 'Fl G 4s' },
    { k: 'R3', id: 'boreste', x: 248, y: 146, forma: 'cone', luz: 'Fl R 4s' },
    { k: 'G4', id: 'bombordo', x: 248, y: 65, forma: 'lata', luz: 'Fl G 3s' },
    { k: 'R4', id: 'boreste', x: 288, y: 96, forma: 'cone', luz: 'Fl R 3s' },
    { k: 'Gs', id: 'bombordo', x: 94, y: 119, forma: 'lata', luz: 'Fl G 5s' },
    { k: 'Rs', id: 'boreste', x: 136, y: 91, forma: 'cone', luz: 'Fl R 5s' },
  ];
  var PM = {};
  PMARCAS.forEach(function (p) { PM[p.k] = p; });
  /* sequência do "decidir o lado": a ordem em que o barco encontra as marcas entrando do mar */
  var ROTEIRO = [
    { k: 'AS', ops: ['qualquer', 'be', 'afastado', 'N'], expl: 'É a marca de aterragem: águas seguras em volta. Passe por qualquer lado; na entrada do canal, mantenha-se do lado de boreste (RIPEAM, Regra 9).' },
    { k: 'G1', ops: ['bb', 'be', 'qualquer'], expl: 'Verde, cilíndrica: lateral de bombordo. Entrando do mar na Região B, deixe-a por bombordo (à esquerda).' },
    { k: 'R1', ops: ['bb', 'be', 'qualquer'], expl: 'Encarnada, cônica: lateral de boreste. Entrando do mar, deixe-a por boreste (à direita).' },
    { k: 'G2', ops: ['bb', 'be', 'O'], expl: 'Outra lateral de bombordo (verde). A luz rápida não muda o significado: a cor é que manda.' },
    { k: 'R2', ops: ['bb', 'be', 'L'], expl: 'Lateral de boreste (encarnada): deixe-a por boreste.' },
    { k: 'CO', ops: ['L', 'O', 'bb', 'afastado'], expl: 'Cardinal oeste (amarela com faixa preta, cones vértice com vértice, Q(9)): as águas boas ficam a oeste. O baixio está a leste dela.' },
    { k: 'ES', ops: ['carta', 'bb', 'afastado', 'be'], expl: 'Marca especial (amarela, X): não é de rumo. Aqui ela indica a área de um cabo submarino: não fundeie ali.' },
    { k: 'PI', ops: ['afastado', 'qualquer', 'S', 'be'], expl: 'Perigo isolado (preta e encarnada, duas esferas, Fl(2)): a pedra está junto da marca. Há água em volta: passe por qualquer lado, com folga.' },
    { k: 'PB', ops: ['bb', 'be', 'qualquer'], expl: 'Canal preferencial a boreste (verde com faixa encarnada). Para seguir o canal principal até o porto, trate-a como verde: deixe-a por bombordo. O canal da esquerda, para a marina, é o secundário.' },
    { k: 'G3', ops: ['bb', 'be', 'N'], expl: 'Já no canal principal: verde por bombordo.' },
    { k: 'R3', ops: ['bb', 'be', 'S'], expl: 'E a encarnada por boreste. Bem-vindo ao porto.' },
  ];

  function dentro(poly, x, y) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  function cruza(p1, p2, p3, p4) {
    function o(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
    var d1 = o(p3, p4, p1), d2 = o(p3, p4, p2), d3 = o(p1, p2, p3), d4 = o(p1, p2, p4);
    return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
  }
  function polyStr(p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); }

  /* ------------------------------------------------------------------ */
  /* Widget                                                              */
  /* ------------------------------------------------------------------ */
  VL.widgets.define('boias-iala', {
    css: ['assets/css/widgets/ritmos-luz.css', 'assets/css/widgets/boias-iala.css'],
    scripts: ['widgets/ritmos-luz.js'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [];
      var vivo = true;
      var cats = Array.isArray(opts.categorias) && opts.categorias.length ? opts.categorias : CATS.map(function (c) { return c.id; });
      var marcas = MARCAS.filter(function (m) { return cats.indexOf(m.cat) >= 0; });
      if (!marcas.length) marcas = MARCAS.slice();
      var modos = Array.isArray(opts.modos) && opts.modos.length ? opts.modos.filter(function (x) { return ['galeria', 'porto', 'desafio'].indexOf(x) >= 0; }) : ['galeria', 'porto', 'desafio'];
      if (!modos.length) modos = ['galeria'];
      var modo = modos.indexOf(opts.modo) >= 0 ? opts.modo : modos[0];
      var usar3D = opts.tresD !== false;

      var inst = VL.ui.instrumento({ titulo: 'Balizamento IALA, Região B (Brasil)', controlesAntes: true });
      inst.raiz.classList.add('bz');
      el.appendChild(inst.raiz);
      var seg = null;
      if (modos.length > 1) {
        seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
        var NOMES = { galeria: 'Galeria', porto: 'Entrando no porto', desafio: 'Desafio' };
        modos.forEach(function (m) { seg.appendChild(h('button', { type: 'button', 'aria-pressed': String(m === modo), 'data-m': m, onclick: function () { trocarModo(m); } }, NOMES[m])); });
        inst.controles.appendChild(seg);
      } else inst.controles.hidden = true;
      inst.legenda.appendChild(h('span', { class: 'bz-legfonte' }, 'Fontes: IALA, Sistema de Balizamento Marítimo, Região B; ',
        h('a', { href: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois', target: '_blank', rel: 'noopener' }, 'Lista de Faróis (DHN)'),
        ', 40ª edição (2026–2027), Introdução, item 4, e quadros dos sinais. O Brasil adota a Região B. Os sinais reais citados nas luzes (nº, característica e fase) foram conferidos nessa edição ',
        h('a', { href: LF_URL, target: '_blank', rel: 'noopener' }, '(PDF)'), '; confira os Avisos aos Navegantes.'));
      var corpo = h('div', { class: 'bz-corpo' });
      inst.corpo.appendChild(corpo);
      var atual = null;
      function trocarModo(m) {
        modo = m;
        if (seg) VL.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
        if (atual) { try { atual(); } catch (e) { console.error(e); } atual = null; }
        corpo.innerHTML = '';
        atual = m === 'porto' ? montarPorto(corpo) : m === 'desafio' ? montarDesafio(corpo) : montarGaleria(corpo);
      }

      /* ---------- lâmpada + linha do tempo (de ritmos-luz) ---------- */
      function blocoLuz(host, o) {
        o = o || {};
        var noite = h('div', { class: 'rl-noite bz-noite-luz' });
        var lampHost = h('div', { class: 'rl-lamp bz-lamp' });
        var txt = h('p', { class: 'rl-fase-txt' }, '');
        var bPlay = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Pausar' }, VL.icon('pausa', 18));
        var bProx = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Próxima fase' }, VL.icon('direita', 18));
        var bRe = h('button', { type: 'button', class: 'btn btn-icon rl-btn-noite', 'aria-label': 'Voltar ao início do período' }, VL.icon('reiniciar', 18));
        noite.appendChild(lampHost);
        noite.appendChild(txt);
        noite.appendChild(h('div', { class: 'rl-botoes' }, bPlay, bProx, bRe));
        host.appendChild(noite);
        var tlHost = null, tl = null;
        if (o.linha !== false) {
          tlHost = h('div', { class: 'rl-tl-host' });
          host.appendChild(h('div', { class: 'rl-tl-wrap bz-tl' }, tlHost));
          tl = VL.luz.linhaTempo(tlHost);
        }
        var lamp = VL.luz.lampada(lampHost, {
          rotulo: o.rotulo || 'Luz da marca',
          aoQuadro: function (t) { if (tl) tl.cursor(t); },
          aoFase: function (q) { var f = q.f; txt.textContent = o.semTexto ? '' : (f.on ? 'luz ' + (LUZ_NOME[f.cor] || '') + ' · ' + VL.fmt.num(f.dur, 1) + ' s' : 'eclipse · ' + VL.fmt.num(f.dur, 1) + ' s'); },
          aoEstado: function (tocando) { bPlay.innerHTML = ''; bPlay.appendChild(VL.icon(tocando ? 'pausa' : 'play', 18)); bPlay.setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar'); },
        });
        bPlay.onclick = function () { if (lamp.tocando()) lamp.pausar(); else lamp.tocar(); };
        bProx.onclick = function () { lamp.pausar(); lamp.passo(1); };
        bRe.onclick = function () { lamp.reiniciar(); };
        if (reduzMov()) noite.appendChild(h('p', { class: 'rl-rm' }, 'Movimento reduzido: toque em tocar ou avance fase a fase.'));
        return {
          definir: function (fs) { lamp.definir(fs); if (tl) tl.definir(fs); if (reduzMov()) lamp.pausar(); else lamp.tocar(); },
          ocultarTexto: function (v) { o.semTexto = v; },
          destruir: function () { lamp.destruir(); if (tl) tl.destruir(); },
        };
      }

      /* =================== GALERIA =================== */
      function montarGaleria(box) {
        var fim = [];
        var sel = POR_ID[opts.marca] && marcas.indexOf(POR_ID[opts.marca]) >= 0 ? POR_ID[opts.marca] : marcas[0];
        var formaSel = {};
        if (opts.aviso !== false) box.appendChild(VL.ui.callout('nota', 'Região B: vermelho a boreste, entrando do mar', 'O Brasil adota a <strong>Região B</strong> do Sistema IALA: entrando do mar, deixe o <strong>encarnado (vermelho) por boreste</strong> e o <strong>verde por bombordo</strong>. Na Região A (Europa, África, Austrália, boa parte da Ásia) as laterais têm as cores invertidas; as outras marcas são iguais. <span class="bz-ref">Lista de Faróis (DHN, 40ª ed.), Introdução, item 4.</span>'));
        /* tira de marcas */
        var tira = h('div', { class: 'bz-tira', role: 'group', 'aria-label': 'Escolha uma marca' });
        var botoes = {};
        CATS.forEach(function (c) {
          var ms = marcas.filter(function (m) { return m.cat === c.id; });
          if (!ms.length) return;
          var grupo = h('div', { class: 'bz-tira-grupo' }, h('p', { class: 'bz-tira-tit' }, c.nome));
          var linha = h('div', { class: 'bz-tira-linha' });
          ms.forEach(function (m) {
            var b = h('button', { type: 'button', class: 'bz-mini', 'aria-pressed': String(m === sel), 'aria-label': m.nome, onclick: function () { selecionar(m); } },
              desenharMarca(m, { classe: 'bz-mini-svg', rotulo: '' }), h('span', { class: 'bz-mini-txt' }, m.curto));
            b.firstChild.setAttribute('aria-hidden', 'true');
            botoes[m.id] = b;
            linha.appendChild(b);
          });
          grupo.appendChild(linha);
          tira.appendChild(grupo);
        });
        box.appendChild(tira);

        var gal = h('div', { class: 'bz-gal' });
        var palco = h('div', { class: 'bz-palco' });
        var cenaHost = h('div', { class: 'bz-cena' });
        var svgHost = h('div', { class: 'bz-cena-svg' });
        cenaHost.appendChild(svgHost);
        var aviso3d = h('p', { class: 'bz-aviso3d', hidden: true }, '');
        var dica3d = h('p', { class: 'bz-dica3d' }, usar3D ? 'Arraste para girar. Pinça (ou Ctrl + roda do mouse) para aproximar.' : '');
        var ctrlForma = h('div', { class: 'segmented bz-seg', role: 'group', 'aria-label': 'Formato' });
        var ctrlDia = h('div', { class: 'segmented bz-seg', role: 'group', 'aria-label': 'Hora do dia' });
        var noite = !!opts.noite;
        [['dia', 'Dia'], ['noite', 'Noite']].forEach(function (x) {
          ctrlDia.appendChild(h('button', { type: 'button', 'data-v': x[0], 'aria-pressed': String((x[0] === 'noite') === noite), onclick: function () { definirNoite(x[0] === 'noite'); } }, x[1]));
        });
        var noiteCtrl = h('div', { class: 'bz-noite-ctrl', hidden: true });
        var bNPlay = h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Pausar a luz' }, VL.icon('pausa', 18));
        var bNProx = h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Próxima fase da luz' }, VL.icon('direita', 18));
        var nTxt = h('span', { class: 'bz-noite-txt', 'aria-live': 'off' }, '');
        noiteCtrl.appendChild(bNPlay); noiteCtrl.appendChild(bNProx); noiteCtrl.appendChild(nTxt);
        palco.appendChild(cenaHost);
        palco.appendChild(h('div', { class: 'bz-palco-ctrl' }, ctrlForma, ctrlDia));
        palco.appendChild(noiteCtrl);
        var avisoNoite = h('p', { class: 'bz-aviso3d', hidden: true }, 'De noite, só a luz aparece. Veja a luz animada na ficha.');
        palco.appendChild(dica3d);
        palco.appendChild(aviso3d);
        palco.appendChild(avisoNoite);
        var ficha = h('div', { class: 'bz-ficha', 'aria-live': 'polite' });
        gal.appendChild(palco); gal.appendChild(ficha);
        box.appendChild(gal);

        var cena = null, luzAtual = null, blocoL = null;
        function semWebGL(msg) {
          if (cena) { try { cena.destruir(); } catch (e) { /* ok */ } cena = null; }
          cenaHost.classList.remove('bz-3d');
          svgHost.hidden = false;
          aviso3d.hidden = false;
          aviso3d.textContent = msg || 'Seu navegador não abriu a cena 3D (WebGL). Veja o desenho da marca acima.';
          dica3d.hidden = true;
          noiteCtrl.hidden = true;
          avisoNoite.hidden = !noite;
        }
        function desenharSVG() {
          var f = formaSel[sel.id] || sel.formas[0];
          svgHost.innerHTML = '';
          svgHost.appendChild(desenharMarca(sel, { forma: f, luz: luzAtual ? (fasesDe(luzAtual).lista[0].cor) : null, classe: 'bz-grande-svg' }));
        }
        function desenharPalco() {
          desenharSVG();
          if (cena) cena.mostrar(sel, formaSel[sel.id] || sel.formas[0]);
        }
        function montarForma() {
          ctrlForma.innerHTML = '';
          var f = formaSel[sel.id] || sel.formas[0];
          sel.formas.forEach(function (k) {
            ctrlForma.appendChild(h('button', { type: 'button', 'aria-pressed': String(k === f), title: FORMAS[k].nome + (VL.settings.get('intl') ? ' (' + FORMAS[k].en + ')' : ''), onclick: function () { formaSel[sel.id] = k; montarForma(); desenharPalco(); } }, FORMAS[k].curto));
          });
        }
        function definirNoite(v) {
          noite = v;
          VL.$$('button', ctrlDia).forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-v') === 'noite') === noite)); });
          cenaHost.classList.toggle('bz-cena-noite', noite);
          if (cena) { cena.noite(noite); noiteCtrl.hidden = !noite; atualizarBotaoNoite(); }
          else { avisoNoite.hidden = !noite; }
        }
        function atualizarBotaoNoite() {
          if (!cena) return;
          var t = cena.tocando();
          bNPlay.innerHTML = ''; bNPlay.appendChild(VL.icon(t ? 'pausa' : 'play', 18));
          bNPlay.setAttribute('aria-label', t ? 'Pausar a luz' : 'Tocar a luz');
        }
        bNPlay.onclick = function () { if (!cena) return; if (cena.tocando()) cena.pausar(); else cena.tocar(); atualizarBotaoNoite(); };
        bNProx.onclick = function () { if (!cena) return; cena.pausar(); cena.passo(); atualizarBotaoNoite(); };

        function escolherLuz(luz, chipsBox) {
          luzAtual = luz;
          var fs = fasesDe(luz);
          if (blocoL) blocoL.definir(fs);
          if (cena) cena.luz(fs);
          if (chipsBox) VL.$$('button', chipsBox).forEach(function (b, i) { b.setAttribute('aria-pressed', String(sel.luzes[i] === luz)); });
          var r = rotuloLuz(luz);
          var cap = VL.$('.bz-luz-cap', ficha);
          if (cap) {
            cap.innerHTML = '';
            cap.appendChild(h('span', null, 'Na carta: ', h('strong', null, r.intl), r.lf ? [' · na Lista de Faróis: ', h('strong', null, r.lf)] : ' · sem grafia correspondente na Lista de Faróis'));
            if (luz.f && luz.real) cap.appendChild(h('span', { class: 'bz-real' }, 'Sinal real: ' + luz.onde + ', Lista de Faróis nº ' + luz.nr + ' (40ª ed., 2026–2027). Fase detalhada publicada: ' + faseDetalhadaTxt(luz) + '. Características mudam: confira os Avisos aos Navegantes.'));
            else if (luz.f) cap.appendChild(h('span', { class: 'bz-real' }, luz.onde + '. Fase: ' + faseDetalhadaTxt(luz) + '.'));
            else cap.appendChild(h('span', { class: 'bz-real' }, 'Outro ritmo permitido para esta marca (durações típicas, só para animar).'));
          }
          if (svgHost.firstChild) desenharSVG();
        }
        function montarFicha() {
          if (blocoL) { blocoL.destruir(); blocoL = null; }
          ficha.innerHTML = '';
          var m = sel;
          ficha.appendChild(h('h3', { class: 'bz-ficha-tit' }, m.nome, m.sub ? h('span', { class: 'bz-sub' }, ' (' + m.sub + ')') : null, en(m.en)));
          ficha.appendChild(h('p', { class: 'bz-indica' }, h('strong', null, 'O que indica: '), m.indica));
          ficha.appendChild(h('div', { class: 'bz-passar' }, h('strong', null, 'Por onde passar: '), m.passar));
          var dl = h('dl', { class: 'bz-dl' });
          [['Cores', m.coresTxt], ['Formato', m.formaTxt], ['Tope', m.topeTxt], ['Luz', m.luzTxt]].forEach(function (x) { dl.appendChild(h('div', null, h('dt', null, x[0]), h('dd', null, x[1]))); });
          ficha.appendChild(dl);
          if (m.cat === 'cardinal') ficha.appendChild(h('p', { class: 'bz-nota' }, 'Os quatro quadrantes são limitados pelas marcações verdadeiras NW–NE, NE–SE, SE–SW e SW–NW, a partir do perigo. A marca fica no quadrante que dá nome a ela, e você navega nesse quadrante.'));
          if (m.dica) ficha.appendChild(h('p', { class: 'bz-dica' }, h('strong', null, 'Para lembrar: '), m.dica));
          /* luz */
          var luzBox = h('div', { class: 'bz-luz' });
          ficha.appendChild(h('h4', { class: 'bz-luz-tit' }, 'A luz, de noite'));
          var chips = h('div', { class: 'chip-list bz-luz-chips', role: 'group', 'aria-label': 'Característica da luz' });
          m.luzes.forEach(function (lz) {
            var r = rotuloLuz(lz);
            chips.appendChild(h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: function () { escolherLuz(lz, chips); } }, (lz.real ? 'Exemplo real: ' : '') + r.intl));
          });
          if (m.luzes.length > 1) ficha.appendChild(chips);
          ficha.appendChild(luzBox);
          blocoL = blocoLuz(luzBox, { rotulo: 'Luz de ' + m.nome });
          ficha.appendChild(h('p', { class: 'bz-luz-cap' }));
          if (m.cat === 'novo') {
            ficha.appendChild(VL.ui.callout('nota', 'Perigos novos no Brasil', h('div', null,
              h('p', null, 'A boia de naufrágio de emergência é da IALA (Recomendação O-133). A Lista de Faróis da DHN (40ª ed., quadro "Novos Perigos", p. XXIX) traz a marca com faixas verticais azul e amarela (pilar ou charuto), tope amarelo (a Lista escreve "formato de X"; a IALA o descreve como cruz amarela em pé, que é o que o desenho mostra) e luz azul e amarela alternando, que ela escreve "Oc. Alt. (3s)". As durações de 1 s e 0,5 s da animação seguem a Recomendação O-133. Para um perigo real, confira os Avisos aos Navegantes.'),
              h('p', null, 'O que a Lista de Faróis (Introdução, item 4) determina: perigos novos são balizados com os sinais comuns; a luz deve ter característica cardinal ou lateral rápida (R) ou muito rápida (MR); se o risco for grave, pelo menos um sinal é duplicado por outro idêntico; pode haver racon "D" (traço-ponto-ponto) mostrando 1 milha na tela do radar.'))));
          }
          ficha.appendChild(fonteMarca(m));
          escolherLuz(m.luzes[0], chips);
        }
        function selecionar(m) {
          sel = m;
          Object.keys(botoes).forEach(function (id) { botoes[id].setAttribute('aria-pressed', String(id === m.id)); });
          montarForma();
          montarFicha();
          desenharPalco();
        }
        selecionar(sel);
        if (sel !== marcas[0]) {
          requestAnimationFrame(function () {
            var b = botoes[sel.id];
            if (!b || tira.scrollWidth <= tira.clientWidth) return;
            var rb = b.getBoundingClientRect(), rt = tira.getBoundingClientRect();
            tira.scrollLeft += rb.left - rt.left - (rt.width - rb.width) / 2;
          });
        }
        definirNoite(noite);

        /* 3D */
        if (usar3D) {
          var tresT = null, recriacoes = 0;
          /* abre (ou reabre, depois de uma perda de contexto) a cena 3D e devolve o estado atual a ela */
          var abrirCena = function () {
            cena = criarCena(cenaHost, el, tresT, {
              noite: noite,
              aoFase: function (f) { nTxt.textContent = f.on ? 'luz ' + (LUZ_NOME[f.cor] || '') + ' acesa' : 'eclipse'; },
              aoFalhar: function () { semWebGL('A cena 3D foi interrompida pelo navegador e não voltou. Veja o desenho da marca.'); },
              recriar: function () {
                if (!vivo || !cenaHost.isConnected || ++recriacoes > 2) return false;
                if (cena) { try { cena.destruir(); } catch (e) { /* ok */ } cena = null; }
                if (!abrirCena()) return false;
                return true;
              },
            });
            if (!cena) return false;
            cenaHost.classList.add('bz-3d');
            svgHost.hidden = true;
            cena.mostrar(sel, formaSel[sel.id] || sel.formas[0]);
            if (luzAtual) cena.luz(fasesDe(luzAtual));
            cena.noite(noite);
            noiteCtrl.hidden = !noite;
            avisoNoite.hidden = true;
            atualizarBotaoNoite();
            return true;
          };
          VL.libs.three().then(function (T) {
            if (!vivo || !cenaHost.isConnected) return;
            tresT = T;
            if (!abrirCena()) semWebGL();
          }).catch(function () { semWebGL(); });
        } else { dica3d.hidden = true; }
        fim.push(VL.on('tema', function () { if (cena) cena.recolorir(); }));
        return function () {
          fim.forEach(function (f) { try { f(); } catch (e) { /* ok */ } });
          if (blocoL) blocoL.destruir();
          if (cena) cena.destruir();
          cena = null;
        };
      }

      /* =================== PORTO =================== */
      function montarPorto(box) {
        var fim = [];
        var sub = opts.porto === 'conduzir' ? 'conduzir' : 'decidir';
        var noite = !!opts.noite;
        var topo = h('div', { class: 'bz-porto-topo' });
        var segSub = h('div', { class: 'segmented bz-seg', role: 'group', 'aria-label': 'Atividade' });
        [['decidir', 'Decidir o lado'], ['conduzir', 'Conduzir o barco']].forEach(function (x) {
          segSub.appendChild(h('button', { type: 'button', 'data-v': x[0], 'aria-pressed': String(x[0] === sub), onclick: function () { trocarSub(x[0]); } }, x[1]));
        });
        var idN = uid('bzn');
        var chkNoite = h('input', { type: 'checkbox', id: idN });
        chkNoite.checked = noite;
        topo.appendChild(segSub);
        topo.appendChild(h('label', { class: 'switch bz-switch', for: idN }, chkNoite, 'De noite (só as luzes)'));
        box.appendChild(topo);
        var grade = h('div', { class: 'bz-porto' });
        var mapaBox = h('div', { class: 'bz-mapa-box' });
        var painel = h('div', { class: 'bz-painel' });
        grade.appendChild(mapaBox); grade.appendChild(painel);
        box.appendChild(grade);

        /* ---- mapa ---- */
        var svg = h('svg', { viewBox: '0 0 360 560', class: 'bz-mapa', role: 'img', 'aria-label': 'Carta simplificada de um canal de acesso, do mar (embaixo) até o porto (em cima, à direita) e a marina (em cima, à esquerda). Norte para cima.' });
        svg.appendChild(h('rect', { x: 0, y: 0, width: 360, height: 560, class: 'bz-terra' }));
        var ptsAgua = polyStr(AGUA);
        svg.appendChild(h('polygon', { points: ptsAgua, class: 'bz-raso1' }));
        svg.appendChild(h('polygon', { points: ptsAgua, class: 'bz-raso2' }));
        svg.appendChild(h('polygon', { points: ptsAgua, class: 'bz-fundo' }));
        svg.appendChild(h('polygon', { points: polyStr(BAIXIO), class: 'bz-baixio' }));
        svg.appendChild(h('text', { x: 262, y: 300, class: 'bz-mapa-agua', 'text-anchor': 'middle' }, 'baixio'));
        /* pedra (perigo isolado) */
        svg.appendChild(h('circle', { cx: PEDRA.x, cy: PEDRA.y, r: 13, class: 'bz-perigo-linha' }));
        /* cabo submarino */
        svg.appendChild(h('path', { d: 'M116 272 q-4 -6 -8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0 t-8 0', class: 'bz-cabo' }));
        svg.appendChild(h('text', { x: 58, y: 290, class: 'bz-mapa-agua bz-mapa-peq', 'text-anchor': 'middle' }, 'cabo submarino'));
        /* cais */
        svg.appendChild(h('rect', { x: 276, y: 6, width: 52, height: 7, class: 'bz-cais' }));
        svg.appendChild(h('rect', { x: 30, y: 6, width: 6, height: 20, class: 'bz-cais' }));
        svg.appendChild(h('rect', { x: 50, y: 6, width: 6, height: 20, class: 'bz-cais' }));
        svg.appendChild(h('rect', { x: 70, y: 6, width: 6, height: 20, class: 'bz-cais' }));
        svg.appendChild(h('text', { x: 300, y: 32, class: 'bz-mapa-rot', 'text-anchor': 'middle' }, 'Porto'));
        svg.appendChild(h('text', { x: 60, y: 37, class: 'bz-mapa-rot', 'text-anchor': 'middle' }, 'Marina'));
        svg.appendChild(h('text', { x: 108, y: 548, class: 'bz-mapa-agua', 'text-anchor': 'middle' }, 'mar aberto'));
        svg.appendChild(h('text', { x: 0, y: 0, transform: 'translate(250 104) rotate(-51)', class: 'bz-mapa-agua bz-mapa-peq', 'text-anchor': 'middle' }, 'canal principal'));
        svg.appendChild(h('text', { x: 0, y: 0, transform: 'translate(127 148) rotate(55)', class: 'bz-mapa-agua bz-mapa-peq', 'text-anchor': 'middle' }, 'canal secundário'));
        /* rosa simplificada: norte */
        svg.appendChild(h('g', { class: 'bz-norte', transform: 'translate(330 520)' },
          h('circle', { r: 15, class: 'bz-norte-c' }),
          h('path', { d: 'M0 -12 L5 4 L0 0 L-5 4 Z', class: 'bz-norte-s' }),
          h('text', { y: -17, 'text-anchor': 'middle', class: 'bz-norte-t' }, 'N')));
        /* rota percorrida */
        var rastro = h('polyline', { points: '', class: 'bz-rastro' });
        svg.appendChild(rastro);
        /* marcas */
        var gMarcas = h('g', { class: 'bz-marcas' });
        var nos = {};
        PMARCAS.forEach(function (p) {
          var m = POR_ID[p.id];
          var s = desenharMarca(m, { forma: p.forma, classe: 'bz-mapa-marca', rotulo: m.nome, agua: false });
          var esc = ESC_MAPA, w = 100 * esc, hh = 136 * esc;
          s.setAttribute('x', String(p.x - w / 2)); s.setAttribute('y', String(p.y - 118 * esc));
          s.setAttribute('width', String(w)); s.setAttribute('height', String(hh));
          var g = h('g', { class: 'bz-pm', 'data-k': p.k });
          g.appendChild(h('circle', { cx: p.x, cy: p.y, r: 2.2, class: 'bz-pm-ponto' }));
          g.appendChild(s);
          gMarcas.appendChild(g);
          nos[p.k] = g;
        });
        svg.appendChild(gMarcas);
        /* noite */
        var veu = h('rect', { x: 0, y: 0, width: 360, height: 560, class: 'bz-veu' });
        svg.appendChild(veu);
        var gLuzes = h('g', { class: 'bz-luzes' });
        var luzes = PMARCAS.map(function (p) {
          var c = VL.luz.analisar(p.luz), fs = VL.luz.fases(c);
          var y = p.y - (118 - (G2[p.forma].top - 5)) * ESC_MAPA;
          var cor = 'var(' + (LUZ_CSS[c.cores[0]] || '--nav-white') + ')';
          gLuzes.appendChild(h('circle', { cx: p.x, cy: p.y, r: 2.4, class: 'bz-luzm-pos' }));
          var gl = h('g', { class: 'bz-luzm' }, h('circle', { cx: p.x, cy: y, r: 11, class: 'bz-luzm-halo', style: { fill: cor } }), h('circle', { cx: p.x, cy: y, r: 3.6, class: 'bz-luzm-nucleo', style: { fill: cor } }));
          gLuzes.appendChild(gl);
          return { p: p, fs: fs, g: gl, desloc: Math.random() * 10 };
        });
        svg.appendChild(gLuzes);
        /* anel da marca atual */
        var anel = h('circle', { r: 16, class: 'bz-anel', cx: -50, cy: -50 });
        svg.appendChild(anel);
        /* barco */
        var barco = h('g', { class: 'bz-barco', tabindex: '0', role: 'button', 'aria-label': 'Seu barco. Arraste, toque na água para ir até lá, ou use as setas do teclado.' },
          h('circle', { r: 24, class: 'bz-barco-alvo' }),
          h('path', { d: 'M0 -11 C5 -6 5.5 2 4 10 L-4 10 C-5.5 2 -5 -6 0 -11 Z', class: 'bz-barco-casco' }),
          h('line', { x1: 0, y1: -4, x2: 0, y2: 7, class: 'bz-barco-retranca' }));
        svg.appendChild(barco);
        mapaBox.appendChild(svg);
        var legenda = h('p', { class: 'bz-mapa-leg' });
        mapaBox.appendChild(legenda);

        /* ---- noite: animação das luzes ---- */
        var anim = { raf: 0, t0: 0, visivel: true };
        function quadro(agora) {
          anim.raf = 0;
          if (!noite || !anim.visivel || document.hidden) return;
          if (!anim.t0) anim.t0 = agora;
          var t = (agora - anim.t0) / 1000;
          luzes.forEach(function (l) { var q = VL.luz.faseEm(l.fs, t + l.desloc); l.g.style.opacity = q.f.on ? '1' : '0.06'; });
          anim.raf = requestAnimationFrame(quadro);
        }
        function agendar() { if (!anim.raf && noite && anim.visivel && !document.hidden && !reduzMov()) anim.raf = requestAnimationFrame(quadro); }
        function aplicarNoite() {
          svg.classList.toggle('bz-mapa-noite', noite);
          legenda.textContent = noite
            ? 'Carta fictícia, de noite: só as luzes aparecem. Os anéis pequenos marcam a posição de cada sinal. Cada luz pisca no seu próprio ritmo. Norte para cima.'
            : 'Carta fictícia, para treino. Área lisa: canal de água funda. Faixa azulada junto à margem: raso. Linha pontilhada: perigo. A posição de cada marca é o pontinho na base do desenho. Norte para cima.';
          if (noite) {
            if (reduzMov()) luzes.forEach(function (l) { l.g.style.opacity = '1'; });
            agendar();
          } else if (anim.raf) { cancelAnimationFrame(anim.raf); anim.raf = 0; }
          if (sub === 'decidir') mostrarPasso();
        }
        chkNoite.addEventListener('change', function () { noite = chkNoite.checked; aplicarNoite(); });
        var io = null;
        if ('IntersectionObserver' in window) {
          io = new IntersectionObserver(function (es) { anim.visivel = es[es.length - 1].isIntersecting; if (anim.visivel) agendar(); }, { threshold: 0.01 });
          io.observe(svg);
        }
        function aoVis() { if (!document.hidden) agendar(); }
        document.addEventListener('visibilitychange', aoVis);
        fim.push(function () { if (anim.raf) cancelAnimationFrame(anim.raf); if (io) io.disconnect(); document.removeEventListener('visibilitychange', aoVis); });

        /* ---- estado comum ---- */
        var pos = { x: 200, y: 545, ang: 0 }, trilha = [[200, 545]], parado = false, feitos = {};
        function desenharBarco() { barco.setAttribute('transform', 'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ') rotate(' + pos.ang.toFixed(0) + ')'); }
        function desenharRastro() { rastro.setAttribute('points', trilha.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ')); }
        var painelAtual = null;
        function trocarSub(v) {
          sub = v;
          VL.$$('button', segSub).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); });
          if (painelAtual) { painelAtual(); painelAtual = null; }
          painel.innerHTML = '';
          painelAtual = v === 'conduzir' ? painelConduzir() : painelDecidir();
        }

        /* ---- decidir o lado ---- */
        var passoI = 0, resp = {}, respondido = false, blocoP = null;
        function contaAcertos() { return Object.keys(resp).filter(function (k) { return resp[k]; }).length; }
        function painelDecidir() {
          passoI = 0; resp = {};
          barco.style.display = 'none'; rastro.style.display = 'none';
          mostrarPasso();
          return function () { if (blocoP) { blocoP.destruir(); blocoP = null; } anel.setAttribute('cx', -50); anel.setAttribute('cy', -50); };
        }
        function mostrarPasso() {
          if (sub !== 'decidir') return;
          if (blocoP) { blocoP.destruir(); blocoP = null; }
          painel.innerHTML = '';
          respondido = false;
          if (passoI >= ROTEIRO.length) {
            var acertos = contaAcertos();
            anel.setAttribute('cx', -50); anel.setAttribute('cy', -50);
            painel.appendChild(h('div', { class: 'resultado', 'data-aprovado': acertos >= ROTEIRO.length - 2 ? '1' : '0' },
              h('p', { class: 'bz-res-tit' }, 'Você chegou ao porto: ' + acertos + ' de ' + ROTEIRO.length + ' decisões certas.'),
              h('p', null, acertos === ROTEIRO.length ? 'Perfeito. Agora tente de noite, só pelas luzes, ou conduza o barco.' : 'Reveja as marcas que errou na galeria e tente de novo.')));
            painel.appendChild(h('div', { class: 'btn-row' },
              h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { passoI = 0; resp = {}; mostrarPasso(); } }, 'Recomeçar'),
              h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarSub('conduzir'); } }, 'Conduzir o barco')));
            return;
          }
          var passo = ROTEIRO[passoI], p = PM[passo.k], m = POR_ID[p.id];
          anel.setAttribute('cx', p.x); anel.setAttribute('cy', p.y - 8);
          painel.appendChild(h('p', { class: 'bz-passo-n' }, 'Marca ' + (passoI + 1) + ' de ' + ROTEIRO.length + (noite ? ' · de noite' : '')));
          var vista = h('div', { class: 'bz-vista' });
          if (noite) {
            vista.classList.add('bz-vista-noite');
            blocoP = blocoLuz(vista, { rotulo: 'Luz da marca destacada no mapa', linha: false });
            blocoP.definir(VL.luz.fases(VL.luz.analisar(p.luz)));
            vista.appendChild(h('p', { class: 'bz-vista-cap' }, 'Você vê esta luz à frente, onde está o anel no mapa.'));
          } else {
            vista.appendChild(desenharMarca(m, { forma: p.forma, classe: 'bz-vista-svg' }));
            vista.appendChild(h('p', { class: 'bz-vista-cap' }, 'A marca destacada no mapa. Você está entrando, vindo do mar.'));
          }
          painel.appendChild(vista);
          painel.appendChild(h('p', { class: 'bz-pergunta' }, 'Como você passa por ela?'));
          var ops = h('div', { class: 'bz-ops' });
          var fb = h('div', { class: 'bz-fb', 'aria-live': 'polite' });
          var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { passoI++; mostrarPasso(); } }, passoI === ROTEIRO.length - 1 ? 'Ver resultado' : 'Próxima marca');
          VL.embaralhar(passo.ops).forEach(function (k) {
            var b = h('button', { type: 'button', class: 'alternativa bz-alt', 'data-k': k }, PASSES[k]);
            b.addEventListener('click', function () {
              if (respondido) return;
              respondido = true;
              var ok = k === m.passe;
              resp[passoI] = ok;
              VL.$$('button', ops).forEach(function (x) { x.disabled = true; if (x.getAttribute('data-k') === m.passe) x.setAttribute('data-res', 'certa'); else if (x === b) x.setAttribute('data-res', 'errada'); });
              fb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não. ' + PASSES[m.passe] + '.'));
              fb.appendChild(h('p', null, (noite ? 'Era ' + chamar(m) + ' (luz ' + VL.luz.formatar(VL.luz.analisar(p.luz), 'intl') + '). ' : '') + passo.expl));
              fb.appendChild(h('p', { class: 'bz-ref' }, m.ref + '.'));
              prox.hidden = false; prox.focus();
            });
            ops.appendChild(b);
          });
          painel.appendChild(ops);
          painel.appendChild(fb);
          painel.appendChild(h('div', { class: 'btn-row' }, prox));
        }

        /* ---- conduzir o barco ---- */
        var lista = null, msg = null;
        var ETAPAS = [
          { id: 'AS', txt: 'Passar a marca de águas seguras' },
          { id: 'P1', txt: 'Entrar entre o 1º par de laterais' },
          { id: 'P2', txt: 'Passar o 2º par' },
          { id: 'CO', txt: 'Passar a oeste da cardinal oeste' },
          { id: 'PI', txt: 'Passar com folga do perigo isolado' },
          { id: 'PB', txt: 'Na bifurcação, seguir o canal preferencial' },
          { id: 'P3', txt: 'Passar o 3º par' },
          { id: 'P4', txt: 'Passar o 4º par' },
          { id: 'FIM', txt: 'Chegar ao porto' },
        ];
        var PORTOES = [
          { id: 'P1', a: [138, 430], b: [222, 430] },
          { id: 'P2', a: [140, 372], b: [226, 368] },
          { id: 'P3', a: [208, 115], b: [248, 146] },
          { id: 'P4', a: [248, 65], b: [288, 96] },
          { id: 'PS', a: [94, 119], b: [136, 91] },
        ];
        function painelConduzir() {
          barco.style.display = ''; rastro.style.display = '';
          anel.setAttribute('cx', -50); anel.setAttribute('cy', -50);
          painel.appendChild(h('p', { class: 'bz-pergunta' }, 'Leve o barco do mar até o porto pelo canal certo.'));
          painel.appendChild(h('p', { class: 'bz-instr' }, 'Arraste o barco, ou toque na água para ele seguir em linha reta até ali. No teclado: foque o barco e use as setas.'));
          msg = h('div', { class: 'bz-msg', 'aria-live': 'polite' }, h('p', null, 'Você está no mar aberto, chegando. Procure a marca de aterragem.'));
          painel.appendChild(msg);
          lista = h('ol', { class: 'bz-etapas' });
          ETAPAS.forEach(function (e) { lista.appendChild(h('li', { 'data-id': e.id }, e.txt)); });
          painel.appendChild(lista);
          painel.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: reiniciarBarco }, VL.icon('reiniciar', 18), 'Recomeçar')));
          reiniciarBarco();
          return function () { };
        }
        function reiniciarBarco() {
          pos = { x: 200, y: 545, ang: 0 }; trilha = [[200, 545]]; parado = false; feitos = {};
          desenharBarco(); desenharRastro();
          barco.classList.remove('bz-encalhado');
          if (lista) VL.$$('li', lista).forEach(function (li) { li.removeAttribute('data-st'); });
          if (msg) { msg.innerHTML = ''; msg.appendChild(h('p', null, 'Você está no mar aberto, chegando. Procure a marca de aterragem.')); }
        }
        function marcar(id, st, texto, tipo) {
          if (feitos[id]) return;
          feitos[id] = st;
          if (lista) { var li = VL.$('li[data-id="' + id + '"]', lista); if (li) li.setAttribute('data-st', st); }
          dizer(texto, tipo || (st === 'ok' ? 'ok' : 'alerta'));
        }
        function dizer(texto, tipo) {
          if (!msg) return;
          msg.innerHTML = '';
          msg.appendChild(h('p', { class: 'bz-msg-' + (tipo || 'info') }, texto));
        }
        function maisPerto(x, y, filtro) {
          var best = null, bd = 1e9;
          PMARCAS.forEach(function (p) { if (filtro && !filtro(p)) return; var d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } });
          return { p: best, d: bd };
        }
        function encalhar(x, y, motivo) {
          parado = true;
          barco.classList.add('bz-encalhado');
          dizer(motivo + ' Toque em Recomeçar para tentar de novo.', 'erro');
        }
        function checar(a, q) {
          var x = q[0], y = q[1];
          if (Math.hypot(x - PEDRA.x, y - PEDRA.y) < PEDRA.r + 3) return { e: 'Bateu na pedra do perigo isolado. Há água em volta dele, mas o perigo está junto da marca: passe com folga.' };
          var mp = maisPerto(x, y);
          if (mp.d < 5.5) return { e: 'Bateu na marca (' + POR_ID[mp.p.id].nome.toLowerCase() + '). Passe com folga: a posição da marca é o pontinho na base do desenho.' };
          if (!dentro(AGUA, x, y)) {
            if (dentro(BAIXIO, x, y) || (x > 226 && y > 240 && y < 350)) return { e: 'Encalhou no baixio. A cardinal oeste manda passar a oeste dela: o perigo fica a leste.' };
            var lat = maisPerto(x, y, function (p) { return p.id === 'bombordo' || p.id === 'boreste' || p.id === 'pref-boreste'; });
            if (lat.p && lat.d < 70) {
              var mm = POR_ID[lat.p.id];
              if (mm.id === 'bombordo') return { e: 'Encalhou fora do canal, do lado da boia verde. Entrando do mar na Região B, a verde fica por bombordo (à esquerda): o canal está entre ela e a encarnada.' };
              if (mm.id === 'boreste') return { e: 'Encalhou fora do canal, do lado da boia encarnada. Entrando do mar na Região B, a encarnada fica por boreste (à direita).' };
              return { e: 'Encalhou na ponta entre os dois canais. A marca de canal preferencial fica justamente nessa ponta: passe de um lado ou do outro dela.' };
            }
            return { e: 'Encalhou no raso. Fique na água funda (branca) do canal.' };
          }
          /* eventos de passagem */
          if (!feitos.AS && a[1] >= 500 && y < 500) marcar('AS', 'ok', 'Passou a marca de águas seguras (aterragem). Agora procure o primeiro par de laterais: verde a bombordo, encarnada a boreste.');
          PORTOES.forEach(function (g) {
            if (!feitos[g.id] && cruza(a, q, g.a, g.b) && y < a[1] + 0.01) {
              if (g.id === 'PS') marcar('PS', 'ok', 'Você entrou no canal secundário, rumo à marina. Também é navegável, mas a missão é o porto pelo canal preferencial.', 'alerta');
              else marcar(g.id, 'ok', 'Boa: verde por bombordo, encarnada por boreste. Na Região B, entrando do mar, o encarnado fica a boreste.');
            }
          });
          if (!feitos.CO && a[1] >= 300 && y < 300 && x < 232) marcar('CO', 'ok', 'Passou a oeste da cardinal oeste, longe do baixio. Lembre: a marca cardinal fica no quadrante do nome dela, e você também.');
          if (!feitos.PI && a[1] >= PEDRA.y && y < PEDRA.y) {
            var dist = Math.abs(x - PEDRA.x);
            if (dist >= 18) marcar('PI', 'ok', 'Passou com folga do perigo isolado. Ele marca uma pedra com água navegável em toda a volta.');
            else marcar('PI', 'alerta', 'Passou perto demais do perigo isolado: a pedra está junto da marca. Dê mais folga.');
          }
          if (!feitos.PB && a[1] >= 168 && y < 168) {
            if (x > 182) marcar('PB', 'ok', 'Isso: deixou a marca de canal preferencial por bombordo e seguiu o canal principal, a boreste dela.');
            else marcar('PB', 'alerta', 'Você deixou a marca de canal preferencial por boreste e foi para o canal secundário (marina). O principal segue a boreste da marca.');
          }
          if (y < 40 && x > 255) return { fim: 'porto' };
          if (y < 44 && x < 105) return { fim: 'marina' };
          return null;
        }
        function irPara(alvo) {
          if (parado || sub !== 'conduzir') return;
          var a = [pos.x, pos.y], dx = alvo[0] - a[0], dy = alvo[1] - a[1], L = Math.hypot(dx, dy);
          if (L < 0.5) return;
          var n = Math.ceil(L / 2), ultimo = a;
          pos.ang = Math.atan2(dx, -dy) * 180 / Math.PI;
          for (var i = 1; i <= n; i++) {
            var q = [a[0] + dx * i / n, Math.min(556, a[1] + dy * i / n)];
            var r = checar(ultimo, q);
            pos.x = q[0]; pos.y = q[1];
            if (r && r.e) { trilha.push(q); encalhar(q[0], q[1], r.e); break; }
            ultimo = q;
            if (r && r.fim) {
              trilha.push(q);
              parado = true;
              if (r.fim === 'porto') {
                marcar('FIM', 'ok', '');
                var faltou = ETAPAS.filter(function (e) { return e.id !== 'FIM' && feitos[e.id] !== 'ok'; }).length;
                dizer('Chegou ao porto pelo canal preferencial.' + (faltou ? ' Reveja os itens em amarelo.' : ' Todas as marcas foram respeitadas.'), faltou ? 'alerta' : 'ok');
              } else dizer('Chegou à marina pelo canal secundário. Navegação correta, mas a missão era o porto: tente de novo e, na bifurcação, deixe a marca de canal preferencial por bombordo.', 'alerta');
              break;
            }
          }
          if (!r || !r.e) trilha.push([pos.x, pos.y]);
          if (trilha.length > 600) trilha.splice(1, trilha.length - 600);
          desenharBarco(); desenharRastro();
        }
        function ptSvg(e) {
          var m = svg.getScreenCTM();
          if (!m) return null;
          var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
          var r = pt.matrixTransform(m.inverse());
          return [Math.max(2, Math.min(358, r.x)), Math.max(2, Math.min(556, r.y))];
        }
        var arrasto = null;
        function aoDown(e) {
          if (sub !== 'conduzir') { var g = e.target.closest && e.target.closest('.bz-pm'); if (g) infoMarca(g.getAttribute('data-k')); return; }
          if (e.target.closest && e.target.closest('.bz-barco')) {
            arrasto = e.pointerId;
            try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
            e.preventDefault();
          }
        }
        function aoMove(e) { if (arrasto !== e.pointerId) return; var p = ptSvg(e); if (p) irPara(p); }
        function aoUp(e) {
          if (arrasto === e.pointerId) { arrasto = null; try { svg.releasePointerCapture(e.pointerId); } catch (er) { /* ok */ } return; }
        }
        function aoClick(e) {
          if (sub !== 'conduzir' || arrasto != null) return;
          if (e.target.closest && e.target.closest('.bz-barco')) return;
          var g = e.target.closest && e.target.closest('.bz-pm');
          if (g) { infoMarca(g.getAttribute('data-k')); return; }
          var p = ptSvg(e); if (p) irPara(p);
        }
        function infoMarca(k) {
          var p = PM[k], m = POR_ID[p.id];
          if (sub === 'conduzir') dizer(m.nome + ' (' + VL.luz.formatar(VL.luz.analisar(p.luz), 'intl') + '): ' + m.passar, 'info');
        }
        function aoTecla(e) {
          if (sub !== 'conduzir') return;
          var d = { ArrowUp: [0, -8], ArrowDown: [0, 8], ArrowLeft: [-8, 0], ArrowRight: [8, 0] }[e.key];
          if (!d) return;
          e.preventDefault();
          irPara([pos.x + d[0], pos.y + d[1]]);
        }
        svg.addEventListener('pointerdown', aoDown);
        svg.addEventListener('pointermove', aoMove);
        svg.addEventListener('pointerup', aoUp);
        svg.addEventListener('pointercancel', aoUp);
        svg.addEventListener('click', aoClick);
        barco.addEventListener('keydown', aoTecla);
        /* no celular, arrastar a partir do barco não deve rolar a página (tocar no resto do mapa rola normalmente) */
        function travaToque(e) { if (sub === 'conduzir' && e.cancelable) e.preventDefault(); }
        barco.addEventListener('touchstart', travaToque, { passive: false });
        fim.push(function () { barco.removeEventListener('touchstart', travaToque); });
        desenharBarco();
        aplicarNoite();
        trocarSub(sub);
        return function () {
          if (painelAtual) painelAtual();
          fim.forEach(function (f) { try { f(); } catch (e) { /* ok */ } });
        };
      }

      /* =================== DESAFIO =================== */
      function montarDesafio(box) {
        var cfg = opts.desafio || {};
        var N = Math.max(3, Math.min(30, cfg.n || 10));
        var tipos = Array.isArray(cfg.tipos) && cfg.tipos.length ? cfg.tipos.filter(function (t) { return ['nome', 'luz', 'passar'].indexOf(t) >= 0; }) : ['nome', 'luz', 'passar'];
        if (!tipos.length) tipos = ['nome', 'luz', 'passar'];
        var idN = uid('bzdn');
        var chk = h('input', { type: 'checkbox', id: idN });
        chk.checked = tipos.indexOf('luz') >= 0;
        var topo = h('div', { class: 'bz-porto-topo' }, tipos.indexOf('luz') >= 0 && tipos.length > 1 ? h('label', { class: 'switch bz-switch', for: idN }, chk, 'Incluir perguntas de noite (só a luz)') : null);
        box.appendChild(topo);
        var grade = h('div', { class: 'bz-des' });
        var vista = h('div', { class: 'bz-des-vista' });
        var painel = h('div', { class: 'bz-des-painel' });
        grade.appendChild(vista); grade.appendChild(painel);
        box.appendChild(grade);
        var bloco = null, i = 0, certas = 0, ultimo = null, respondida = false;
        var chaveRec = 'boias-iala.recorde.' + N, recorde = VL.store.get(chaveRec, null);
        function tiposAtivos() { return tipos.filter(function (t) { return t !== 'luz' || chk.checked || tipos.length === 1; }); }
        function nomeCurto(m) { return m.nome + (m.sub ? ' (' + m.sub + ')' : ''); }
        function distratoresMarca(m, n) {
          var mesmos = marcas.filter(function (x) { return x !== m && x.cat === m.cat; });
          var vizinhos = { lateral: ['preferencial'], preferencial: ['lateral'], cardinal: ['perigo'], perigo: ['cardinal', 'novo'], seguras: ['especial', 'perigo'], especial: ['novo', 'seguras'], novo: ['especial', 'perigo'] }[m.cat] || [];
          var viz = MARCAS.filter(function (x) { return x !== m && vizinhos.indexOf(x.cat) >= 0; });
          var resto = MARCAS.filter(function (x) { return x !== m; });
          var out = [];
          [VL.embaralhar(mesmos), VL.embaralhar(viz), VL.embaralhar(resto)].forEach(function (l) { l.forEach(function (x) { if (out.length < n && out.indexOf(x) < 0) out.push(x); }); });
          return out;
        }
        function nova() {
          if (bloco) { bloco.destruir(); bloco = null; }
          vista.innerHTML = ''; painel.innerHTML = '';
          vista.hidden = false;
          respondida = false;
          if (i >= N) { fimRodada(); return; }
          var ts = tiposAtivos(), tipo = sortear(ts);
          var cand = marcas.filter(function (m) { return m !== ultimo; });
          var m = sortear(cand.length ? cand : marcas);
          ultimo = m;
          var forma = sortear(m.formas), luz = sortear(m.luzes);
          painel.appendChild(h('p', { class: 'bz-passo-n' }, 'Pergunta ' + (i + 1) + ' de ' + N + ' · acertos: ' + certas));
          var enun, ops, correta;
          if (tipo === 'luz') {
            vista.classList.add('bz-des-noite');
            bloco = blocoLuz(vista, { rotulo: 'Luz misteriosa de uma marca', linha: false, semTexto: false });
            bloco.definir(fasesDe(luz));
            vista.appendChild(h('p', { class: 'bz-vista-cap' }, 'De noite, você vê esta luz numa boia. Cronometre o ciclo.'));
            enun = 'Que marca é esta, pela luz?';
            ops = VL.embaralhar([m].concat(distratoresMarca(m, 3)));
            correta = m.id;
          } else {
            vista.classList.remove('bz-des-noite');
            vista.appendChild(desenharMarca(m, { forma: forma, classe: 'bz-vista-svg bz-des-svg', rotulo: 'Marca misteriosa' }));
            if (tipo === 'nome') { enun = 'Que marca é esta?'; ops = VL.embaralhar([m].concat(distratoresMarca(m, 3))); correta = m.id; }
            else {
              enun = m.cat === 'preferencial' ? 'Entrando do mar e seguindo o canal preferencial, como você passa por esta marca?' : 'Entrando do mar, como você passa por esta marca?';
              var pool = Object.keys(PASSES).filter(function (k) { return k !== m.passe && (CONFLITA[m.passe] || []).indexOf(k) < 0; });
              var preferidos = { bb: ['be', 'qualquer'], be: ['bb', 'qualquer'], N: ['S', 'L', 'O'], S: ['N', 'L', 'O'], L: ['O', 'N', 'S'], O: ['L', 'N', 'S'], afastado: ['qualquer', 'bb'], qualquer: ['afastado', 'be'], carta: ['afastado', 'bb'], longe: ['carta', 'qualquer'] }[m.passe] || [];
              var esc = preferidos.slice(0, 2).concat(VL.embaralhar(pool.filter(function (k) { return preferidos.indexOf(k) < 0; }))).slice(0, 3);
              ops = VL.embaralhar([m.passe].concat(esc));
              correta = m.passe;
            }
          }
          painel.appendChild(h('p', { class: 'bz-pergunta' }, enun));
          var box2 = h('div', { class: 'bz-ops' });
          var fb = h('div', { class: 'bz-fb', 'aria-live': 'polite' });
          var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { i++; nova(); } }, i === N - 1 ? 'Ver resultado' : 'Próxima');
          ops.forEach(function (o) {
            var chave = typeof o === 'string' ? o : o.id;
            var b = h('button', { type: 'button', class: 'alternativa bz-alt', 'data-k': chave }, typeof o === 'string' ? PASSES[o] : nomeCurto(o));
            b.addEventListener('click', function () {
              if (respondida) return;
              respondida = true;
              var ok = chave === correta;
              if (ok) certas++;
              VL.$$('button', box2).forEach(function (x) { x.disabled = true; if (x.getAttribute('data-k') === correta) x.setAttribute('data-res', 'certa'); else if (x === b) x.setAttribute('data-res', 'errada'); });
              var r = rotuloLuz(luz);
              fb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não foi essa.'));
              var expl;
              if (tipo === 'luz') expl = 'Era ' + chamar(m) + ': luz ' + r.intl + (r.lf ? ' (na Lista de Faróis, ' + r.lf + ')' : '') + '. ' + m.luzTxt;
              else if (tipo === 'nome') expl = 'É ' + chamar(m) + '. Cores: ' + m.coresTxt.charAt(0).toLowerCase() + m.coresTxt.slice(1) + ' Tope: ' + m.topeTxt.charAt(0).toLowerCase() + m.topeTxt.slice(1);
              else expl = maiusc(chamar(m)) + ': ' + m.passar.charAt(0).toLowerCase() + m.passar.slice(1);
              fb.appendChild(h('p', null, expl));
              if (m.dica) fb.appendChild(h('p', { class: 'bz-dica' }, h('strong', null, 'Para lembrar: '), m.dica));
              fb.appendChild(h('p', { class: 'bz-ref' }, m.ref + '.'));
              prox.hidden = false; prox.focus();
            });
            box2.appendChild(b);
          });
          painel.appendChild(box2);
          painel.appendChild(fb);
          painel.appendChild(h('div', { class: 'btn-row' }, prox));
        }
        function fimRodada() {
          vista.classList.remove('bz-des-noite');
          vista.hidden = true;
          var novo = certas > 0 && (recorde == null || certas > recorde);
          if (novo) { recorde = certas; VL.store.set(chaveRec, certas); }
          painel.appendChild(h('div', { class: 'resultado', 'data-aprovado': certas >= Math.ceil(N * 0.7) ? '1' : '0' },
            h('p', { class: 'bz-res-tit' }, certas + ' de ' + N + ' certas.'),
            novo ? h('p', null, 'Seu melhor resultado até agora.') : (recorde ? h('p', null, 'Seu melhor até agora: ' + recorde + ' de ' + N + '.') : null),
            h('p', null, certas >= Math.ceil(N * 0.7) ? 'Bom trabalho. Treine também de noite, só pelas luzes.' : 'Volte à galeria, compare as marcas parecidas e tente de novo.')));
          painel.appendChild(h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { i = 0; certas = 0; nova(); } }, 'Nova rodada')));
        }
        nova();
        return function () { if (bloco) bloco.destruir(); };
      }

      trocarModo(modo);
      return function () {
        vivo = false;
        if (atual) { try { atual(); } catch (e) { /* ok */ } }
        limpezas.forEach(function (f) { try { f(); } catch (e) { /* ok */ } });
      };
    },
  });
})();
