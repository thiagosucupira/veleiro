/* Curso Arrais-Amador — parte 3: módulos 10 a 16.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 3.1 a) VI a X, b), h), i), j) e Seção II (treinamento,
   itens 1.5 a 1.12 e 2.8). Fatos regulatórios só em blocos {t:'fato'} ou fontes com ref (ids de
   research/claims_verified.json; os "extra-arrais-3-NN" estão em research/_work/research_extra_arrais-3.json).
   Valores físicos e orientações de primeiros socorros citam a fonte técnica com URL no bloco "fontes". */
(function () {
  'use strict';

  var NORMAM = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var RLESTA = 'https://www.planalto.gov.br/ccivil_03/decreto/d2596.htm';
  var LESTA = 'https://www.planalto.gov.br/ccivil_03/leis/l9537.htm';
  var DPC_AMADOR = 'https://www.marinha.mil.br/dpc/navegador-amador';
  var FDS_GAS_A = 'https://www.vibraenergia.com.br/sites/default/files/2021-08/seguranca-gasolina-a-comum.pdf';
  var FDS_GAS_C = 'https://www.vibraenergia.com.br/sites/default/files/2021-08/seguranca-gasolina-C-22.pdf';
  var FDS_ETANOL = 'https://www.vibraenergia.com.br/sites/default/files/2026-07/FDS_PT_BR_Etanol%20Hidratado_rev1.pdf';
  var FDS_DIESEL_2025 = 'https://www.vibraenergia.com.br/sites/default/files/2025-08/FDS_PT_BR_%C3%93leo%20Diesel%20B%20S10.pdf';
  var FDS_DIESEL_2024 = 'https://vibraenergia.com.br/sites/default/files/pdfs/fispq-comb-oleodiesel-auto-oleodiesel-b-s10-v1224.pdf';
  var FDS_DIESEL_MAR = 'https://vibraenergia.com.br/sites/default/files/2024-07/fispq-comb-oleodiesel-maritimo-a-petrobras-verana.pdf';
  var CBMES = "https://cb.es.gov.br/Media/CBMES/PDF's/CEIB/GCE/Preven%C3%A7%C3%A3o%20e%20Combate%20a%20Inc%C3%AAndios%20-%20Apostila%20CFBP%202022.pdf";
  var MARINHA_K = 'https://portaldeperiodicos.marinha.mil.br/index.php/passadico/article/download/2408/2357/8818';
  var BOATUS_FOGO = 'https://boatus.com/expert-advice/expert-advice-archive/2022/february/how-to-handle-an-engine-compartment-fire';
  var BOATED_FOGO = 'https://www.boat-ed.com/iowa/studyGuide/If-a-Fire-Erupts-on-Your-Boat/10101301_35836/';
  var PA_ABAST = 'https://www.pa.gov/content/dam/copapwp-pagov/en/fishandboat/documents/education/activitiesandeducationportal/safefueling.pdf';
  var BOATUS_GAS = 'https://boatus.com/expert-advice/expert-advice-archive/2020/june/dangerous-gases-aboard';

  /* Questão no formato oficial (docs/arquitetura.md). */
  function Q(id, tema, dificuldade, enunciado, alternativas, correta, explicacao, referencia, url) {
    var q = { id: 'a3-' + id, nivel: 'arrais', tema: tema, dificuldade: dificuldade, enunciado: enunciado,
      alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
    if (url) q.fonte_url = url;
    return q;
  }
  /* Figura SVG acessível: viewBox estreito (texto legível no celular), cores só por tokens. */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" style="max-width:' + (maxw || 560) + 'px;display:block;margin:0 auto;font-family:inherit" role="img" xmlns="http://www.w3.org/2000/svg"><title>' + titulo + '</title>' + corpo + '</svg>';
  }

  var M = [];

  /* =====================================================================================
     MÓDULO 10 — Incêndio e combustíveis
     Programa: 3.1 a) VI, VII, VIII; treinamento teórico 1.8, 1.11, 1.12; prático 2.8.
     ===================================================================================== */
  M.push({
    id: 'm10', titulo: 'Incêndio e combustíveis',
    resumo: 'Como o fogo nasce e como se apaga, os pontos de fulgor e de ignição da gasolina, do etanol e do diesel, as classes de incêndio, os extintores e o abastecimento seguro.',
    licoes: [
      {
        id: 'l1', titulo: 'O fogo: tetraedro e pontos de temperatura', minutos: 10,
        objetivos: [
          'Citar os quatro elementos do fogo (o tetraedro).',
          'Ligar cada método de extinção ao elemento que ele retira.',
          'Diferenciar ponto de fulgor, ponto de combustão e ponto de ignição.'
        ],
        blocos: [
          { t: 'p', html: 'Fogo a bordo é uma das emergências mais graves. Você está cercado de água, mas longe do Corpo de Bombeiros. Um barco carrega combustível, gás de cozinha, baterias, tecidos e plástico. Um casco de fibra de vidro queima depressa e solta fumaça tóxica. Por isso o programa do Arrais cobra a prevenção e o combate a incêndio, inclusive o uso correto dos extintores.' },
          { t: 'h', txt: 'Os quatro elementos do fogo' },
          { t: 'p', html: 'Para existir fogo, três coisas precisam estar juntas. É o <strong>triângulo do fogo</strong>:' },
          { t: 'lista', itens: [
            '<strong>Combustível</strong>: o que queima. Gasolina, diesel, etanol, gás, madeira, tecido, fibra de vidro.',
            '<strong>Comburente</strong>: o oxigênio do ar, que alimenta a queima.',
            '<strong>Calor</strong>: a energia que inicia a queima. Uma faísca, uma chama, uma ponta de cigarro, um escapamento quente.'
          ] },
          { t: 'p', html: 'Depois que o fogo começa, surge um quarto elemento: a <strong>reação em cadeia</strong>. O calor das chamas aquece o combustível, que solta mais vapor, que alimenta mais chamas. Com ela, o modelo passa a ser o <strong>tetraedro do fogo</strong>. É por isso que um foco pequeno cresce sozinho se ninguém agir.' },
          { t: 'figura', svg: svg('0 0 360 250', 'Tetraedro do fogo: combustível, comburente e calor nos vértices e a reação em cadeia no centro, com o método de extinção que atua em cada um',
            '<polygon points="180,22 330,212 30,212" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<line x1="180" y1="22" x2="180" y2="150" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>' +
            '<line x1="30" y1="212" x2="180" y2="150" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>' +
            '<line x1="330" y1="212" x2="180" y2="150" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>' +
            '<circle cx="180" cy="150" r="9" fill="var(--magenta)"/>' +
            '<text x="180" y="16" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">CALOR</text>' +
            '<text x="196" y="56" font-size="12.5" fill="currentColor">tira-se com</text>' +
            '<text x="196" y="71" font-size="12.5" fill="currentColor">resfriamento</text>' +
            '<text x="30" y="234" text-anchor="start" font-size="14" font-weight="700" fill="currentColor">COMBUSTÍVEL</text>' +
            '<text x="30" y="248" font-size="12.5" fill="currentColor">isolamento</text>' +
            '<text x="330" y="234" text-anchor="end" font-size="14" font-weight="700" fill="currentColor">COMBURENTE</text>' +
            '<text x="330" y="248" text-anchor="end" font-size="12.5" fill="currentColor">abafamento</text>' +
            '<text x="180" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="var(--magenta)">reação em cadeia</text>' +
            '<text x="180" y="192" text-anchor="middle" font-size="12.5" fill="currentColor">quebra: pó químico</text>'),
            legenda: 'O tetraedro do fogo. Cada método de extinção atua em um elemento: resfriar tira o calor, abafar tira o oxigênio, isolar tira o combustível e o pó químico quebra a reação em cadeia.' },
          { t: 'h', txt: 'Como se apaga um fogo' },
          { t: 'lista', itens: [
            '<strong>Resfriamento</strong>: baixar a temperatura do material até ele parar de queimar. É o papel da água, que funciona bem em sólidos (madeira, tecido, papel).',
            '<strong>Abafamento</strong>: impedir o contato com o oxigênio. Espuma, gás carbônico (CO<sub>2</sub>), uma tampa sobre a panela ou um cobertor molhado fazem isso.',
            '<strong>Isolamento (retirada do material)</strong>: separar o combustível do fogo. Fechar o registro do gás ou a válvula de combustível, desligar a chave geral da bateria, afastar o que ainda não pegou fogo.',
            '<strong>Quebra da reação em cadeia</strong>: o pó químico interfere na química da chama e a interrompe.'
          ] },
          { t: 'h', txt: 'Fulgor, combustão e ignição' },
          { t: 'p', html: 'Um detalhe muda tudo: <strong>o líquido não queima; quem queima é o vapor</strong> que ele solta. Quanto mais quente o líquido, mais vapor. Os bombeiros definem três temperaturas, os "pontos notáveis":' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Ponto de fulgor</strong>: a menor temperatura em que o líquido solta vapor suficiente para pegar fogo <em>se houver uma chama ou faísca</em>. A chama dá um "flash", mas não se mantém se a fonte for retirada.',
            '<strong>Ponto de combustão</strong>: um pouco acima do fulgor. Agora o vapor pega fogo com a chama externa e <em>continua queimando</em> sem ela.',
            '<strong>Ponto de ignição</strong> (ou <strong>autoignição</strong>): a temperatura em que o vapor pega fogo <em>sozinho</em>, sem chama nem faísca, só pelo calor. Por exemplo, combustível pingando num coletor de escapamento muito quente.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Para a prova e para a vida', html: 'Quanto <strong>mais baixo o ponto de fulgor</strong>, mais perigoso é o combustível no dia a dia: ele já solta vapor inflamável na temperatura do ambiente. O ponto de ignição (autoignição) diz outra coisa: a partir de que temperatura de uma superfície o vapor acende sem faísca nenhuma.' },
          { t: 'termos', ids: ['triangulo-do-fogo', 'classes-de-incendio', 'extintor'] },
          { t: 'check', questoes: [
            Q('m10-l1-1', 'Combate a incêndio', 1, 'Qual elemento o extintor de <strong>pó químico</strong> ataca principalmente?',
              ['O combustível, retirando-o do local', 'O calor, resfriando o material', 'A reação em cadeia, interrompendo a química da chama', 'A umidade do ar'], 2,
              'O pó químico age sobretudo quebrando a reação em cadeia (e também abafa um pouco). Retirar o combustível é o isolamento, que se faz fechando válvulas ou afastando o material. Resfriar é o papel da água. Umidade não é elemento do fogo.',
              'Tetraedro do fogo; CBMES, Apostila CFBP 2022, itens 2.10 e 5.4', CBMES),
            Q('m10-l1-2', 'Combate a incêndio', 2, 'Ao fechar o registro do botijão de gás de um fogão em chamas, você está usando qual método de extinção?',
              ['Resfriamento', 'Isolamento (retirada do combustível)', 'Abafamento', 'Quebra da reação em cadeia'], 1,
              'Fechar o gás corta o combustível que alimenta a chama: é isolamento. Resfriamento tira calor (água). Abafamento tira o oxigênio (tampa, espuma, CO2). Quebra da reação em cadeia é a ação do pó químico.',
              'Métodos de extinção; CBMES, Apostila CFBP 2022, cap. 5', CBMES),
            Q('m10-l1-3', 'Combustíveis', 2, 'A temperatura mínima em que um líquido solta vapor capaz de pegar fogo com uma chama, mas sem manter a queima quando a chama é retirada, chama-se:',
              ['Ponto de ignição', 'Ponto de combustão', 'Ponto de ebulição', 'Ponto de fulgor'], 3,
              'Essa é a definição do ponto de fulgor: o vapor dá um "flash" e apaga. No ponto de combustão a chama se mantém. No ponto de ignição (autoignição) o vapor acende sozinho, sem chama. Ponto de ebulição é quando o líquido ferve e não define inflamabilidade.',
              'Pontos notáveis da combustão; CBMES, Apostila CFBP 2022, p. 35', CBMES)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Corpo de Bombeiros Militar do Espírito Santo, Prevenção e Combate a Incêndio, Apostila CFBP 2022 (tetraedro do fogo, pontos notáveis, métodos de extinção)', url: CBMES },
            { txt: 'NORMAM-211/DPC, Anexo 5-A: o treinamento de Arrais cobre combate a incêndio, pontos de ignição e de fulgor e abastecimento (Seção II, a, I, itens 1.11 e 1.12; texto vigente, Rev. 1)', url: NORMAM, ref: 'programa-46' }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Gasolina, etanol e diesel: quão perigosos são', minutos: 10,
        objetivos: [
          'Comparar os pontos de fulgor e de autoignição da gasolina, do etanol e do diesel.',
          'Explicar por que o vapor de gasolina se acumula no fundo do barco.',
          'Reconhecer por que a gasolina exige mais cuidado que o diesel a bordo.'
        ],
        blocos: [
          { t: 'p', html: 'Os valores abaixo vêm das Fichas com Dados de Segurança (FDS, antiga FISPQ) dos fabricantes brasileiros. Toda distribuidora publica a ficha de cada combustível. Os números variam um pouco de uma ficha para outra, conforme a formulação e o método de ensaio, mas a ordem de grandeza não muda.' },
          { t: 'tabela', cab: ['Combustível', 'Ponto de fulgor', 'Autoignição', 'O que isso significa'], linhas: [
            ['Gasolina', 'abaixo de −43 °C (gasolina A, sem etanol); abaixo de 0 °C (gasolina C, a dos postos)', '257 °C (gasolina A); acima de 250 °C', 'Solta vapor inflamável em <strong>qualquer</strong> temperatura do Brasil. Uma faísca basta.'],
            ['Etanol hidratado', '15 °C (vaso fechado)', '363 °C', 'Num dia comum (acima de 15 °C), já solta vapor que pega fogo com faísca.'],
            ['Óleo diesel', 'acima de 38 °C (ficha de 2024); 60 °C ou mais (fichas de 2025 e do diesel marítimo)', '225 °C ou mais', 'Na temperatura ambiente quase não forma vapor inflamável. Mas acende sozinho mais cedo que a gasolina numa superfície quente.']
          ], legenda: 'Valores das Fichas com Dados de Segurança citadas nas fontes desta lição. Vaso fechado é o método de ensaio usado nas fichas.' },
          { t: 'figura', svg: svg('0 0 360 250', 'Escala de temperatura comparando ponto de fulgor e autoignição da gasolina, do etanol e do diesel, com a faixa de temperatura ambiente destacada',
            '<rect x="124" y="40" width="15" height="150" fill="var(--nav-yellow)" opacity="0.35"/>' +
            '<circle cx="18" cy="16" r="6" fill="var(--magenta)"/><text x="29" y="21" font-size="13" fill="currentColor">ponto de fulgor</text>' +
            '<rect x="160" y="10" width="12" height="12" fill="currentColor"/><text x="178" y="21" font-size="13" fill="currentColor">autoignição</text>' +
            '<text x="4" y="75" font-size="13" font-weight="700" fill="currentColor">Gasolina</text>' +
            '<line x1="90" y1="70" x2="266" y2="70" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
            '<path d="M90 70 L80 70" stroke="var(--magenta)" stroke-width="3"/><path d="M80 70 l6 -5 v10z" fill="var(--magenta)"/>' +
            '<circle cx="90" cy="70" r="6" fill="var(--magenta)"/><rect x="260" y="64" width="12" height="12" fill="currentColor"/>' +
            '<text x="90" y="57" text-anchor="middle" font-size="12.5" fill="currentColor">&lt; −43</text><text x="266" y="57" text-anchor="middle" font-size="12.5" fill="currentColor">257</text>' +
            '<text x="4" y="125" font-size="13" font-weight="700" fill="currentColor">Etanol</text>' +
            '<line x1="124" y1="120" x2="328" y2="120" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
            '<circle cx="124" cy="120" r="6" fill="var(--magenta)"/><rect x="322" y="114" width="12" height="12" fill="currentColor"/>' +
            '<text x="124" y="107" text-anchor="middle" font-size="12.5" fill="currentColor">15</text><text x="328" y="107" text-anchor="middle" font-size="12.5" fill="currentColor">363</text>' +
            '<text x="4" y="175" font-size="13" font-weight="700" fill="currentColor">Diesel</text>' +
            '<line x1="150" y1="170" x2="247" y2="170" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
            '<line x1="137" y1="170" x2="150" y2="170" stroke="var(--magenta)" stroke-width="8" stroke-linecap="round"/>' +
            '<rect x="241" y="164" width="12" height="12" fill="currentColor"/>' +
            '<text x="144" y="157" text-anchor="middle" font-size="12.5" fill="currentColor">38 a 60</text><text x="247" y="157" text-anchor="middle" font-size="12.5" fill="currentColor">≥ 225</text>' +
            '<line x1="80" y1="205" x2="350" y2="205" stroke="currentColor" stroke-width="1.5"/>' +
            '<g font-size="12.5" fill="currentColor" text-anchor="middle">' +
            '<line x1="86" y1="201" x2="86" y2="209" stroke="currentColor"/><text x="86" y="224">−50</text>' +
            '<line x1="115" y1="201" x2="115" y2="209" stroke="currentColor"/><text x="115" y="224">0</text>' +
            '<line x1="174" y1="201" x2="174" y2="209" stroke="currentColor"/><text x="174" y="224">100</text>' +
            '<line x1="233" y1="201" x2="233" y2="209" stroke="currentColor"/><text x="233" y="224">200</text>' +
            '<line x1="291" y1="201" x2="291" y2="209" stroke="currentColor"/><text x="291" y="224">300</text>' +
            '<line x1="350" y1="201" x2="350" y2="209" stroke="currentColor"/><text x="342" y="224">400</text></g>' +
            '<text x="215" y="244" text-anchor="middle" font-size="12.5" fill="currentColor">temperatura (°C)</text>'),
            legenda: 'Pontos de fulgor (círculos) e de autoignição (quadrados). A faixa amarela marca 15 a 40 °C, a temperatura comum no Brasil. A gasolina e o etanol têm o fulgor dentro ou abaixo dela; o diesel, acima.' },
          { t: 'h', txt: 'O vapor desce e se esconde' },
          { t: 'p', html: 'O vapor da gasolina é <strong>3 a 4 vezes mais pesado que o ar</strong>, segundo a ficha de segurança. Ele não sobe e não some: escorre para baixo, como água, e se acumula na sentina, no porão do motor e nos paióis. Basta pouco vapor para formar mistura explosiva: a ficha indica que a gasolina queima com apenas <strong>1,3% a 7,1%</strong> de vapor no ar. Por isso o barco a gasolina com motor de centro precisa de exaustor (ventilação forçada) e de uma checagem pelo cheiro antes da partida.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Gasolina exige mais cuidado', html: 'Com ponto de fulgor abaixo de zero, a gasolina forma vapor inflamável em qualquer dia do ano. Qualquer faísca é suficiente: o motor de arranque, um interruptor, a bomba de porão, eletricidade estática. O diesel é bem mais seguro de armazenar, mas encharca o motor e o coletor de escapamento: um vazamento sobre uma peça a mais de 225 °C pode pegar fogo sem faísca.' },
          { t: 'fato', ref: 'extra-arrais-3-38', html: 'A própria NORMAM-211 usa o ponto de fulgor como critério: embarcações de esporte e recreio com 24 m ou mais não podem usar, na propulsão, combustível com ponto de fulgor abaixo de 60 °C, como álcool, gasolina e GLP.' },
          { t: 'p', html: 'Em barcos menores a gasolina é permitida e comum, sobretudo em motores de popa. Um veleiro de cruzeiro costuma ter motor diesel, mas leva gasolina para o motor do bote de apoio e GLP (gás de cozinha) para o fogão. Os três pedem cuidado.' },
          { t: 'check', questoes: [
            Q('m10-l2-1', 'Combustíveis', 1, 'Entre gasolina, etanol e diesel, qual tem o <strong>menor</strong> ponto de fulgor e por isso forma vapor inflamável em qualquer temperatura ambiente?',
              ['Diesel', 'Etanol', 'Gasolina', 'Os três têm o mesmo ponto de fulgor'], 2,
              'A gasolina tem ponto de fulgor abaixo de −43 °C (gasolina A) ou abaixo de 0 °C (gasolina C), bem abaixo de qualquer temperatura ambiente no Brasil. O etanol fica por volta de 15 °C e o diesel acima de 38 °C. Os valores são bem diferentes entre si.',
              'FDS Gasolina A (Petrobras, 2019) e Gasolina C (2020)', FDS_GAS_A),
            Q('m10-l2-2', 'Combustíveis', 2, 'Por que o vapor de gasolina é tão perigoso no porão do motor?',
              ['Porque é mais leve que o ar e sobe para a cabine', 'Porque é mais pesado que o ar e se acumula nas partes baixas do barco', 'Porque só pega fogo acima de 257 °C', 'Porque a água do porão o torna explosivo'], 1,
              'A densidade do vapor de gasolina é 3 a 4 vezes a do ar: ele escorre e se acumula na sentina e no porão. É mais pesado, não mais leve. Os 257 °C são a autoignição, que não importa quando há faísca, já que o fulgor é abaixo de −43 °C. A água não torna o vapor explosivo.',
              'FDS Gasolina A (Petrobras), seção 9: densidade de vapor 3 a 4 (ar = 1)', FDS_GAS_A),
            Q('m10-l2-3', 'Combustíveis', 3, 'Um vazamento de diesel pinga sobre o coletor de escapamento a cerca de 300 °C. O que pode acontecer?',
              ['Nada, pois o diesel só queima acima de 600 °C', 'O diesel pode pegar fogo sozinho, porque a autoignição dele fica por volta de 225 °C', 'O diesel apaga o calor do coletor e resfria o motor', 'Só pega fogo se houver uma faísca elétrica'], 1,
              'A temperatura de autoignição do diesel informada nas fichas é de 225 °C ou mais: uma superfície a 300 °C pode inflamá-lo sem faísca. Não existe esse limite de 600 °C. Diesel não resfria o coletor. A faísca é necessária só abaixo da autoignição.',
              'FDS Óleo Diesel B S10 (Vibra, 2025), seção 9', FDS_DIESEL_2025)
          ] },
          { t: 'fontes', itens: [
            { txt: 'FDS Gasolina A (Petróleo Brasileiro S.A., FISPQ Pb0029_p, 16/05/2019): fulgor < −43 °C, autoignição 257 °C, LII/LSI 1,3/7,1%, densidade de vapor 3–4', url: FDS_GAS_A },
            { txt: 'FISPQ Gasolina C 22 (Petrobras Distribuidora, BR0095, 30/10/2020): fulgor < 0 °C; autoignição da gasolina > 250 °C', url: FDS_GAS_C },
            { txt: 'FDS Etanol Hidratado Combustível (Vibra Energia, nº 3004, rev. 26/06/2026): fulgor 15 °C vaso fechado, autoignição 363 °C', url: FDS_ETANOL },
            { txt: 'FDS Óleo Diesel B S10 (Vibra Energia, nº 11009, 20/08/2025): fulgor ≥ 60 °C, autoignição ≥ 225 °C', url: FDS_DIESEL_2025 },
            { txt: 'FDS Óleo Diesel B S10 (Vibra Energia, nº 01011674, 04/12/2024): fulgor > 38 °C', url: FDS_DIESEL_2024 },
            { txt: 'FDS Óleo Diesel Marítimo A Petrobras Verana (01010053, 05/02/2024): fulgor 60 °C', url: FDS_DIESEL_MAR },
            { txt: 'NORMAM-211/DPC, art. 4.26.1 (combustível com fulgor < 60 °C vedado a partir de 24 m)', url: NORMAM, ref: 'extra-arrais-3-38' }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'Classes de incêndio e extintores', minutos: 12,
        objetivos: [
          'Identificar as classes de incêndio A, B, C (NORMAM-211) e as classes D e K.',
          'Escolher o extintor certo para cada classe e saber onde a água é proibida.',
          'Ler o rótulo de capacidade extintora e usar o extintor corretamente.'
        ],
        blocos: [
          { t: 'p', html: 'Escolher o extintor errado pode piorar o incêndio. Jogar água em óleo quente espalha o fogo. Jogar água num painel elétrico ligado pode dar choque em quem segura o extintor. Por isso os incêndios são divididos em <strong>classes</strong>, conforme o material que queima.' },
          { t: 'h', txt: 'As classes que a NORMAM-211 usa' },
          { t: 'fato', ref: 'extra-arrais-3-31', html: '<strong>Classe A</strong>: fogo em materiais sólidos que deixam resíduo (brasa e cinza), como madeira, papel, almofadas, fibra de vidro, borracha e plásticos. É a única classe em que a água pode ser usada com segurança.' },
          { t: 'fato', ref: 'extra-arrais-3-32', html: '<strong>Classe B</strong>: fogo em líquidos, gases e graxas inflamáveis (gasolina, diesel, álcool, óleo, GLP). <strong>Classe C</strong>: fogo em equipamentos e instalações elétricas energizados. Se a energia for desligada, o fogo passa a ser tratado como classe A.' },
          { t: 'p', html: 'As normas dos Corpos de Bombeiros e a ABNT usam ainda duas classes que aparecem menos a bordo:' },
          { t: 'lista', itens: [
            '<strong>Classe D</strong>: metais combustíveis (magnésio, titânio, sódio, lítio, alumínio em pó). Queimam muito quente e reagem violentamente com a água. Pedem pó especial.',
            '<strong>Classe K</strong>: óleo e gordura de cozinha. Óleo de fritura pode pegar fogo sozinho em temperatura alta e reacender depois de apagado. Nunca jogue água: tampe a panela e desligue o fogo.'
          ] },
          { t: 'h', txt: 'Que extintor usar em cada classe' },
          { t: 'tabela', cab: ['Extintor (agente)', 'Classe A', 'Classe B', 'Classe C', 'Como age'], linhas: [
            ['Água', 'sim', '<strong>não</strong>', '<strong>não</strong>', 'resfria'],
            ['Espuma mecânica', 'sim', 'sim', '<strong>não</strong> (conduz eletricidade)', 'abafa e resfria'],
            ['Gás carbônico (CO<sub>2</sub>)', 'pouco eficaz', 'sim', 'sim', 'abafa'],
            ['Pó químico BC', 'pouco eficaz', 'sim', 'sim', 'quebra a reação em cadeia'],
            ['Pó químico ABC', 'sim', 'sim', 'sim', 'quebra a reação e isola o sólido']
          ], legenda: 'Aplicação usual dos agentes extintores portáteis. A bordo de lanchas e veleiros, o mais comum é o pó químico (BC ou ABC).' },
          { t: 'fato', ref: 'extra-arrais-3-33', html: 'O rótulo traz a <strong>capacidade extintora</strong>, uma combinação de número e letra. A letra indica a classe de incêndio; o número, o tamanho relativo do fogo que o extintor apaga em ensaio. Exemplo: <strong>2-A:20-B:C</strong> serve para classe A (tamanho 2), classe B (tamanho 20) e classe C.' },
          { t: 'figura', svg: svg('0 0 360 150', 'Como ler o rótulo 2-A:20-B:C de um extintor',
            '<rect x="20" y="20" width="320" height="56" rx="10" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<text x="180" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="currentColor">2-A : 20-B : C</text>' +
            '<line x1="95" y1="80" x2="70" y2="104" stroke="var(--magenta)" stroke-width="2"/><line x1="185" y1="80" x2="180" y2="104" stroke="var(--magenta)" stroke-width="2"/><line x1="268" y1="80" x2="290" y2="104" stroke="var(--magenta)" stroke-width="2"/>' +
            '<text x="70" y="120" text-anchor="middle" font-size="13" fill="currentColor">sólidos,</text><text x="70" y="136" text-anchor="middle" font-size="13" fill="currentColor">tamanho 2</text>' +
            '<text x="180" y="120" text-anchor="middle" font-size="13" fill="currentColor">líquidos,</text><text x="180" y="136" text-anchor="middle" font-size="13" fill="currentColor">tamanho 20</text>' +
            '<text x="290" y="120" text-anchor="middle" font-size="13" fill="currentColor">elétrico:</text><text x="290" y="136" text-anchor="middle" font-size="13" fill="currentColor">pode usar</text>'),
            legenda: 'A letra C não tem número: ela só indica que o agente não conduz eletricidade.' },
          { t: 'h', txt: 'Quantos extintores o seu barco precisa' },
          { t: 'fato', ref: 'extra-arrais-3-35', html: 'Embarcação a motor com menos de 6 m está dispensada de extintor.' },
          { t: 'fato', ref: 'extra-arrais-3-36', html: 'De 6 m até menos de 12 m (cerca de 20 a 39 pés, por exemplo uma lancha de 25 pés ou um veleiro de 32 pés): <strong>dois extintores B-1 perto do motor e um B-1 no comando</strong>, nos locais recomendados pela norma. Com tanque portátil de até 27 litros, basta um B-1 perto do motor.' },
          { t: 'fato', ref: 'extra-arrais-3-37', html: 'Nessa faixa, valem também extintores com capacidade mínima 10-B:C ou 1-A:10B:C. A norma não recomenda pó ABC em barcos de alumínio, porque ele é corrosivo.' },
          { t: 'h', txt: 'Usando o extintor' },
          { t: 'lista', ordenada: true, itens: [
            'Dê o alarme e veja o que está queimando. Escolha o extintor da classe certa.',
            'Tire o pino ou o lacre e confira o manômetro (ponteiro na faixa verde) antes de se aproximar. O extintor portátil descarrega em poucos segundos: não gaste jato fora do fogo.',
            'Aproxime-se com o vento pelas costas, abaixado, sem se encurralar. Mantenha uma rota de fuga.',
            'Pó químico: jatos curtos, deixando a nuvem assentar sobre o foco. CO<sub>2</sub>: segure pela empunhadura (o difusor fica gelado) e forme uma nuvem sobre as chamas. Espuma: faça a espuma escorrer sobre o líquido, sem jogar o jato direto nele.',
            'Depois de apagar, vigie: o fogo pode reacender. Deite o extintor usado para ninguém pegá-lo vazio por engano.'
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'CO2 em espaço fechado', html: 'O CO<sub>2</sub> apaga o fogo tirando o oxigênio, e faz o mesmo com as pessoas. Depois de descarregá-lo numa cabine ou no porão do motor, ventile antes de entrar. Os extintores precisam de inspeção: confira o manômetro (ponteiro na faixa verde), o lacre e a validade da recarga.' },
          { t: 'check', questoes: [
            Q('m10-l3-1', 'Combate a incêndio', 1, 'Pela NORMAM-211, em qual classe de incêndio a água pode ser usada com segurança?',
              ['Classe A', 'Classe B', 'Classe C', 'Em todas, desde que em grande quantidade'], 0,
              'A NORMAM-211 diz que somente na classe A (sólidos que deixam resíduo) a água é segura. Na classe B ela espalha o líquido em chamas. Na classe C conduz eletricidade. Muita água não resolve esses dois problemas.',
              'NORMAM-211/DPC, art. 4.27.2', NORMAM),
            Q('m10-l3-2', 'Combate a incêndio', 2, 'O painel elétrico do barco pega fogo e a chave geral <strong>não</strong> pode ser desligada. Qual extintor usar?',
              ['Água', 'Espuma mecânica', 'Gás carbônico (CO2) ou pó químico', 'Qualquer um, porque a fibra de vidro não conduz eletricidade'], 2,
              'Equipamento energizado é classe C: use agente que não conduza eletricidade, como CO2 ou pó químico. Água e espuma conduzem corrente e podem eletrocutar quem combate. A fibra do casco não protege quem segura o jato.',
              'NORMAM-211/DPC, art. 4.27.2 c); CBMES, Apostila CFBP 2022, item 4.3', NORMAM),
            Q('m10-l3-3', 'Combate a incêndio', 2, 'No rótulo de um extintor está escrito <strong>2-A:20-B:C</strong>. Isso significa que ele:',
              ['Só serve para classe C', 'Serve para classes A, B e C', 'Tem 2 kg de pó e 20 bar de pressão', 'Serve para classe A e não deve ser usado em B'], 1,
              'A combinação de letras mostra as classes atendidas: A (tamanho 2), B (tamanho 20) e C. Os números são tamanhos relativos do fogo em ensaio, não peso nem pressão. O rótulo inclui a classe B, então ele serve para líquidos.',
              'NORMAM-211/DPC, arts. 4.27.1 e 4.27.3', NORMAM),
            Q('m10-l3-4', 'Combate a incêndio', 2, 'Quantos extintores a NORMAM-211 indica para uma lancha de 8 m com motor de centro e tanque fixo?',
              ['Nenhum, por ser embarcação pequena', 'Um B-1 no comando', 'Dois B-1 perto do motor e um B-1 no comando', 'Um extintor de água em cada cabine'], 2,
              'Para comprimento de 6 m a menos de 12 m, o art. 4.36.2 indica dois B-1 próximos ao motor e um B-1 no comando. Só barcos a motor com menos de 6 m são dispensados. Um único B-1 basta perto do motor apenas com tanque portátil de até 27 litros, e ainda há o do comando. Extintor de água não serve para fogo de combustível.',
              'NORMAM-211/DPC, art. 4.36.2', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, arts. 4.27 (classes e capacidade extintora) e 4.36 (dotação de extintores)', url: NORMAM, ref: 'extra-arrais-3-31' },
            { txt: 'CBMES, Prevenção e Combate a Incêndio, Apostila CFBP 2022, cap. 4 (classes A a D e K) e itens 15.8 e 15.9 (uso dos extintores)', url: CBMES },
            { txt: 'Revista Passadiço (Marinha do Brasil): incêndio classe K em óleos e gorduras', url: MARINHA_K }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Abastecimento seguro', minutos: 10,
        objetivos: [
          'Executar, na ordem, o procedimento seguro de abastecimento.',
          'Explicar a função do suspiro e da ventilação do compartimento do motor.',
          'Saber o que fazer depois de abastecer, antes de dar a partida.'
        ],
        blocos: [
          { t: 'p', html: 'Segundo a Guarda Costeira dos EUA (citada pela Pennsylvania Fish and Boat Commission), a maioria dos incêndios e explosões em barcos acontece <strong>durante ou depois do abastecimento</strong>. O motivo é o que você viu na lição anterior: o vapor de gasolina é pesado, se acumula embaixo e explode com uma faísca. Na NORMAM-211 em vigor, o treinamento prático do Arrais inclui verificar o nível do tanque e demonstrar o abastecimento correto, com ventilação e uso dos suspiros.' },
          { t: 'fato', ref: 'programa-46', html: 'Na NORMAM-211 em vigor (Rev. 1, 2026), o plano de treinamento teórico do Arrais-Amador (Anexo 5-A, Seção II, a, I) inclui o item 1.11 (pontos de ignição e de fulgor dos combustíveis: gasolina, etanol e diesel) e o 1.12 (procedimento para abastecimento de combustíveis das embarcações); o 2.8 trata da parte prática. O arquivo editável de anexos da DPC (ZIP) está desatualizado e termina em 1.10.' },
          { t: 'figura', svg: svg('0 0 360 200', 'Corte de uma lancha mostrando o bocal de abastecimento no convés, o tanque, a mangueira do suspiro saindo pelo costado e o vapor de combustível descendo para a sentina',
            '<path d="M20 70 L330 70 L300 150 Q180 175 60 150 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="0" y="125" width="360" height="75" fill="var(--sea-2)" opacity="0.45"/>' +
            '<rect x="150" y="98" width="90" height="34" rx="6" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>' +
            '<text x="195" y="120" text-anchor="middle" font-size="13" fill="currentColor">tanque</text>' +
            '<path d="M170 98 L170 70" stroke="currentColor" stroke-width="3"/><rect x="161" y="62" width="18" height="8" fill="currentColor"/>' +
            '<text x="170" y="52" text-anchor="middle" font-size="13" fill="currentColor">bocal</text>' +
            '<path d="M232 98 Q260 80 296 86" fill="none" stroke="var(--magenta)" stroke-width="2.5"/><circle cx="298" cy="86" r="4" fill="var(--magenta)"/>' +
            '<text x="300" y="60" text-anchor="middle" font-size="13" fill="var(--magenta)">suspiro</text><text x="300" y="75" text-anchor="middle" font-size="12.5" fill="currentColor">(no costado)</text>' +
            '<path d="M120 112 q-8 12 0 20 q8 8 0 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>' +
            '<path d="M100 112 q-8 12 0 20 q8 8 0 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>' +
            '<text x="40" y="104" font-size="12.5" fill="currentColor">vapor desce</text>' +
            '<text x="110" y="165" text-anchor="middle" font-size="12.5" fill="currentColor">sentina</text>'),
            legenda: 'O suspiro deixa sair o ar (e o vapor) do tanque enquanto ele enche. Se o combustível sair pelo suspiro, o tanque está cheio demais. O vapor que escapa no barco desce para a sentina.' },
          { t: 'h', txt: 'Antes de abastecer' },
          { t: 'lista', ordenada: true, itens: [
            'Confira o nível do tanque e calcule quanto cabe. Não confie só no marcador: conheça a capacidade do seu tanque.',
            'Atraque firme no posto. Desligue o motor, o fogão e todos os equipamentos elétricos que não forem essenciais.',
            'Ninguém fuma, e nada de chama ou faísca por perto. Desembarque os passageiros.',
            'Feche vigias, escotilhas e portas, para o vapor não entrar na cabine.',
            'Tenha um extintor à mão e material absorvente para algum respingo.',
            'Tanque portátil (de motor de popa ou do bote): leve-o para o cais e encha-o <strong>fora do barco</strong>.'
          ] },
          { t: 'h', txt: 'Durante o abastecimento' },
          { t: 'lista', ordenada: true, itens: [
            'Confirme que é o bocal de combustível (e não o da água ou o dos dejetos) e qual combustível o motor usa.',
            'Mantenha o bico encostado no bocal. Isso descarrega a eletricidade estática e evita faíscas.',
            'Observe o suspiro: ele precisa estar desobstruído. Combustível saindo por ele é sinal de tanque cheio.',
            'Não encha até a boca. O combustível dilata com o calor e transborda pelo suspiro.',
            'Não confie na trava automática da bomba. Fique de olho o tempo todo.'
          ] },
          { t: 'h', txt: 'Depois de abastecer' },
          { t: 'lista', ordenada: true, itens: [
            'Feche bem o bocal e limpe qualquer derrame no convés e na água.',
            'Abra escotilhas e vigias para ventilar.',
            'Barco a gasolina com motor de centro: ligue o <strong>exaustor</strong> por pelo menos 4 minutos antes da partida.',
            'Faça o teste do cheiro no porão do motor e na sentina. Sentiu cheiro de combustível? Não dê partida: continue ventilando e procure o vazamento.',
            'Só então dê a partida. Se o motor não pegar logo, pare e investigue: insistir no arranque com vapor no porão é a causa típica das explosões.'
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'O exaustor não faz milagre', html: 'O exaustor tira o vapor do ar do porão, mas não remove combustível derramado: enquanto houver poça, ela continua evaporando. Use o nariz antes da chave de partida.' },
          { t: 'callout', tipo: 'nota', titulo: 'Proteja a água também', html: 'Combustível derramado contamina rios, lagos e o mar. Use bandeja ou absorvente no bocal e no suspiro, e avise o posto se derramar.' },
          { t: 'check', questoes: [
            Q('m10-l4-1', 'Abastecimento', 1, 'Durante o abastecimento, o combustível começa a sair pelo suspiro do costado. Isso indica que:',
              ['O suspiro está entupido', 'O tanque está cheio e é hora de parar', 'O motor precisa ser ligado para esvaziar o tanque', 'É normal e pode continuar abastecendo'], 1,
              'O suspiro deixa o ar sair do tanque; se combustível sai por ele, o tanque chegou ao limite. Suspiro entupido faria o contrário: o combustível voltaria pelo bocal. Ligar o motor durante o abastecimento é proibido pela boa prática. Continuar enchendo causa derrame e vapor.',
              'NORMAM-211, Anexo 5-A, Seção II, item 2.8 (abastecimento e suspiros; texto vigente, Rev. 1); PA Fish and Boat Commission, Safe Fueling', PA_ABAST),
            Q('m10-l4-2', 'Abastecimento', 2, 'Qual destas atitudes está <strong>errada</strong> no abastecimento de uma lancha a gasolina?',
              ['Desembarcar os passageiros antes de abastecer', 'Manter o bico encostado no bocal', 'Encher o tanque portátil dentro da lancha para ganhar tempo', 'Ligar o exaustor antes de dar a partida'], 2,
              'O tanque portátil deve ser abastecido fora do barco, no cais, para o vapor não se acumular a bordo. Desembarcar passageiros, manter o bico encostado (contra estática) e ligar o exaustor antes da partida são procedimentos corretos.',
              'PA Fish and Boat Commission, Safe Fueling; BoatUS, Dangerous gases aboard', PA_ABAST),
            Q('m10-l4-3', 'Abastecimento', 2, 'Depois de abastecer, você sente cheiro de gasolina no porão do motor. O que fazer?',
              ['Dar a partida logo, porque o motor ligado puxa o vapor', 'Não dar a partida: ventilar, procurar e limpar o vazamento', 'Jogar água no porão para diluir o vapor', 'Fechar as escotilhas para o cheiro não incomodar'], 1,
              'Cheiro de gasolina significa vapor inflamável acumulado: o arranque pode provocar a faísca. Ventile e encontre a origem antes de qualquer partida. Água não neutraliza o vapor. Fechar as escotilhas prende o vapor.',
              'BoatUS, Dangerous gases aboard', BOATUS_GAS)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, itens 1.11, 1.12 e 2.8 (texto vigente, Rev. 1)', url: NORMAM, ref: 'programa-46' },
            { txt: 'Pennsylvania Fish and Boat Commission, Safe Fueling (orientação da Guarda Costeira dos EUA sobre abastecimento e exaustor)', url: PA_ABAST },
            { txt: 'BoatUS, Dangerous gases aboard (vapor de combustível e limites do exaustor)', url: BOATUS_GAS },
            { txt: 'FDS Gasolina A (Petrobras): vapor 3–4 vezes mais denso que o ar', url: FDS_GAS_A }
          ] }
        ]
      },
      {
        id: 'l5', titulo: 'Fogo a bordo: o que fazer', minutos: 9,
        objetivos: [
          'Seguir a sequência de ações diante de um incêndio a bordo.',
          'Posicionar o barco em relação ao vento para combater o fogo.',
          'Prevenir os incêndios mais comuns: motor, cozinha e parte elétrica.'
        ],
        blocos: [
          { t: 'p', html: 'Num barco, um foco pequeno vira um incêndio grande em poucos minutos. Num teste da BoatUS Foundation, uma lancha em chamas tinha só a proa como lugar seguro depois de 4 minutos. Agir rápido e na ordem certa faz a diferença.' },
          { t: 'h', txt: 'A sequência' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Alarme.</strong> Grite "fogo!" e diga onde. Todos vestem o colete salva-vidas.',
            '<strong>Pare o barco e corte o combustível</strong>: desligue o motor, feche a válvula de combustível e o registro do gás. Desligue a chave geral elétrica se o fogo for elétrico.',
            '<strong>Ponha o fogo a sotavento.</strong> Fogo na popa (motor): aproe ao vento. Fogo na proa: deixe o vento entrar pela popa. Assim o vento leva chamas e fumaça para longe das pessoas.',
            '<strong>Combata com o extintor certo</strong>, mirando a base das chamas, com o vento pelas costas.',
            '<strong>Peça ajuda cedo</strong>: VHF canal 16 (MAYDAY se houver perigo grave e iminente) ou telefone 185 do SALVAMAR. Não espere o fogo fugir do controle para chamar.',
            '<strong>Prepare o abandono</strong> se o fogo não ceder: bote ou balsa, colete, documentos e VHF portátil. Abandone pelo lado de barlavento, longe das chamas e do combustível na água.'
          ] },
          { t: 'figura', svg: svg('0 0 360 170', 'Dois barcos vistos de cima: com fogo na popa, o barco aproa ao vento; com fogo na proa, o vento entra pela popa. Em ambos a fumaça é levada para longe das pessoas',
            '<text x="180" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">vento</text>' +
            '<path d="M150 26 L210 26" stroke="currentColor" stroke-width="2"/><path d="M180 26 v14" stroke="currentColor" stroke-width="2"/><path d="M174 34 l6 8 l6 -8z" fill="currentColor"/>' +
            '<path d="M90 50 Q104 80 104 120 L76 120 Q76 80 90 50 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="90" cy="112" r="9" fill="var(--nav-red)"/><path d="M84 128 q6 10 0 20 M96 128 q6 10 0 20" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2"/>' +
            '<text x="90" y="166" text-anchor="middle" font-size="12.5" fill="currentColor">fogo na popa: aproe</text>' +
            '<path d="M270 120 Q256 90 256 50 L284 50 Q284 90 270 120 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="270" cy="108" r="9" fill="var(--nav-red)"/><path d="M264 124 q6 10 0 20 M276 124 q6 10 0 20" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2"/>' +
            '<text x="270" y="166" text-anchor="middle" font-size="12.5" fill="currentColor">fogo na proa: popa ao vento</text>'),
            legenda: 'O objetivo é deixar o fogo a sotavento das pessoas, para o vento não alimentar as chamas nem jogar a fumaça em quem combate.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Fogo no compartimento do motor: não abra a tampa', html: 'Abrir a tampa do motor de uma vez dá ao fogo uma golfada de oxigênio e pode transformar um foco abafado em labaredas. Corte o combustível e descarregue o extintor por uma abertura pequena (alguns barcos têm um furo próprio para isso, o "fire port") ou acione o sistema fixo, se houver.' },
          { t: 'h', txt: 'Prevenção' },
          { t: 'lista', itens: [
            '<strong>Motor</strong>: mangueiras e abraçadeiras de combustível em bom estado, sem vazamento, porão limpo e sem óleo. Panos sujos de óleo fora do porão.',
            '<strong>Parte elétrica</strong>: fusíveis do tamanho certo, cabos sem emendas improvisadas, baterias presas e com terminais protegidos.',
            '<strong>Cozinha</strong>: nunca deixe o fogão aceso sem ninguém olhando. Feche o registro do botijão depois de usar.',
            '<strong>Pessoas</strong>: proibido fumar perto de combustível e na hora do abastecimento.'
          ] },
          { t: 'fato', ref: 'extra-arrais-3-39', html: 'A NORMAM-211 manda guardar os botijões de gás de cozinha em área externa ou em compartimento não habitável, isolado das acomodações, seguro e arejado, com a válvula protegida do sol e longe de fontes de ignição. O GLP também é mais pesado que o ar.' },
          { t: 'check', questoes: [
            Q('m10-l5-1', 'Combate a incêndio', 2, 'Há fogo no motor de popa de uma lancha parada. Como posicionar a embarcação?',
              ['Com a popa ao vento', 'Com a proa ao vento, para o vento levar o fogo para a popa e para longe das pessoas', 'De través para o vento', 'A posição não importa'], 1,
              'Com o fogo na popa, aproar ao vento faz o vento levar chamas e fumaça para trás, longe de quem está na proa. Popa ao vento jogaria o fogo sobre o barco. De través espalha o fogo pelo convés. A posição importa muito.',
              'Boat-Ed (curso aprovado pela NASBLA), If a fire erupts on your boat', BOATED_FOGO),
            Q('m10-l5-2', 'Combate a incêndio', 2, 'Sai fumaça da tampa do compartimento do motor de centro. O que <strong>não</strong> fazer?',
              ['Cortar o combustível', 'Abrir a tampa de uma vez para ver o fogo', 'Usar o extintor por uma abertura pequena', 'Pedir ajuda pelo VHF'], 1,
              'Abrir a tampa joga oxigênio no fogo e pode fazê-lo explodir em chamas. Cortar o combustível, descarregar o extintor por uma abertura pequena e pedir ajuda são ações corretas.',
              'BoatUS, How to handle an engine compartment fire', BOATUS_FOGO),
            Q('m10-l5-3', 'Combate a incêndio', 1, 'Onde a NORMAM-211 manda instalar o botijão de gás de cozinha?',
              ['Dentro da cabine, perto do fogão, para encurtar a mangueira', 'Em área externa ou compartimento não habitável, isolado e arejado', 'No porão do motor, que é ventilado', 'Em qualquer lugar, desde que amarrado'], 1,
              'O art. 4.28.1 exige área externa ou compartimento não habitável, isolado, seguro e arejado, com a válvula protegida do sol. A cabine é habitável. O porão do motor tem fontes de ignição. Amarrar não basta.',
              'NORMAM-211/DPC, art. 4.28.1', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'BoatUS, How to handle an engine compartment fire (teste de queima da BoatUS Foundation e porta de incêndio)', url: BOATUS_FOGO },
            { txt: 'Boat-Ed, If a fire erupts on your boat (posicionar o fogo a sotavento)', url: BOATED_FOGO },
            { txt: 'NORMAM-211/DPC, art. 4.28 (instalações de gás de cozinha)', url: NORMAM, ref: 'extra-arrais-3-39' },
            { txt: 'SALVAMAR: atendimento 24 horas pelo telefone 185', url: 'https://www.marinha.mil.br/cpm/185', ref: 'radio-48' }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 11 — Salvatagem e sobrevivência
     Programa: 3.1 a) X e b); treinamento teórico 1.9 e 1.10.
     ===================================================================================== */
  var RIPEAM = 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf';
  var NSW_FRIO = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/emergencies/cold-and-hypothermia';
  var BOATUS_FRIO = 'https://www.boatus.org/study-guide/prep/cold-water/';
  var USCG_COLETE = 'https://www.uscgboating.org/recreational-boaters/life-jacket-wear-wearing-your-life-jacket.php';
  var RYA_COLETE = 'https://www.rya.org.uk/knowledge/safety/look-after-yourself/buoyancy-aids-lifejackets';
  var NSW_COLETE = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/lifejackets-and-safety-equipment/lifejacket-care';
  var NSW_CRIANCA = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/lifejackets-and-safety-equipment/children-and-lifejackets';
  var NSW_EQUIP = 'https://www.nsw.gov.au/driving-boating-and-transport/boating-and-marine/waterways-safety-and-rules/lifejackets-and-safety-equipment/essential-safety-equipment';
  var NSW_VIRAR = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/emergencies/capsizing-and-swamping';
  var NSW_MOB = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/emergencies/person-overboard';
  var NSW_FOGO = 'https://www.nsw.gov.au/driving-boating-and-transport/boating-and-marine/waterways-safety-and-rules/emergencies/fire-on-board';
  var MCGILL_1101 = 'https://www.mcgill.ca/oss/article/medical-did-you-know/professor-popsicles-physiological-proof';
  var NHS_HIPO = 'https://www.nhs.uk/conditions/hypothermia/';
  var SJA_HIPO = 'https://www.sja.org.uk/first-aid-advice/hypothermia/';

  M.push({
    id: 'm11', titulo: 'Salvatagem e sobrevivência',
    resumo: 'Coletes, boias, pirotécnicos, palamenta, botes e balsas; o que fazer ao cair na água fria e o material obrigatório por área de navegação.',
    licoes: [
      {
        id: 'l1', titulo: 'Coletes salva-vidas: classes, escolha e uso', minutos: 11,
        objetivos: [
          'Conhecer as cinco classes de material salva-vidas da NORMAM-211.',
          'Saber quantos coletes e de que classe o barco precisa em cada área.',
          'Vestir, ajustar e conservar um colete de espuma ou inflável.'
        ],
        blocos: [
          { t: 'p', html: 'O colete salva-vidas é o equipamento de segurança mais simples e o que mais salva vidas. Mas ele só funciona <strong>vestido e ajustado</strong>. Ninguém consegue vestir um colete depois de cair na água fria, no escuro, com o barco se afastando. Por isso o treinamento do Arrais insiste em como usar coletes e boias numa emergência.' },
          { t: 'h', txt: 'As classes de material salva-vidas' },
          { t: 'p', html: 'A NORMAM-211 classifica coletes, boias e balsas em classes, conforme o rigor da fabricação e o uso previsto:' },
          { t: 'fato', ref: 'extra-arrais-3-01', html: '<strong>Classe I</strong>: fabricado conforme a Convenção SOLAS (a convenção internacional de segurança dos navios). É o exigido na navegação oceânica.' },
          { t: 'fato', ref: 'extra-arrais-3-02', html: '<strong>Classe II</strong>: requisitos SOLAS abrandados, para a navegação costeira. <strong>Classe III</strong>: fabricado para a navegação interior.' },
          { t: 'fato', ref: 'extra-arrais-3-03', html: '<strong>Classe IV</strong>: para uso prolongado por quem trabalha junto à borda, com risco de cair. <strong>Classe V</strong>: para atividades esportivas (moto aquática, esqui aquático, windsurf, kitesurf, pesca esportiva), para embarcações de médio porte na navegação interior e para embarcações miúdas.' },
          { t: 'h', txt: 'Quantos e quais coletes' },
          { t: 'fato', ref: 'extra-arrais-3-04', html: 'O número de coletes deve ser <strong>pelo menos igual ao total de pessoas a bordo</strong>, com coletes de tamanho pequeno para as crianças.' },
          { t: 'fato', ref: 'extra-arrais-3-05', html: 'Navegação oceânica: coletes classe I (SOLAS). Navegação costeira: classe II.' },
          { t: 'fato', ref: 'extra-arrais-3-06', html: 'Navegação interior: embarcações de médio porte usam classe III ou V; as de grande porte, classe III; as miúdas, classe III ou V.' },
          { t: 'fato', ref: 'extra-arrais-3-07', html: 'Os coletes devem ficar guardados de modo a serem <strong>prontamente acessíveis</strong>, com o local claramente indicado. Nada de coletes no fundo do paiol, embaixo de cabos e defensas.' },
          { t: 'figura', svg: svg('0 0 360 230', 'Colete salva-vidas de espuma com gola, fivelas, cintas de ajuste, apito, faixas refletivas e cinta entre as pernas para crianças',
            '<path d="M120 40 Q150 20 165 40 L165 190 Q140 205 110 190 L100 70 Z" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M240 40 Q210 20 195 40 L195 190 Q220 205 250 190 L260 70 Z" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M165 40 Q180 58 195 40" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="104" y="120" width="152" height="9" fill="var(--sea-3)"/><rect x="104" y="160" width="152" height="9" fill="var(--sea-3)"/>' +
            '<rect x="172" y="117" width="16" height="15" rx="3" fill="currentColor"/><rect x="172" y="157" width="16" height="15" rx="3" fill="currentColor"/>' +
            '<rect x="112" y="80" width="40" height="8" fill="var(--nav-white)" stroke="currentColor"/><rect x="208" y="80" width="40" height="8" fill="var(--nav-white)" stroke="currentColor"/>' +
            '<circle cx="232" cy="104" r="6" fill="var(--nav-red)"/>' +
            '<path d="M180 196 Q180 214 180 222" stroke="var(--magenta)" stroke-width="5" stroke-dasharray="6 3"/>' +
            '<g font-size="13" fill="currentColor"><text x="8" y="40">gola</text><line x1="40" y1="36" x2="118" y2="44" stroke="currentColor"/>' +
            '<text x="8" y="88">refletivo</text><line x1="66" y1="84" x2="112" y2="84" stroke="currentColor"/>' +
            '<text x="8" y="128">cinta</text><line x1="44" y1="124" x2="104" y2="124" stroke="currentColor"/>' +
            '<text x="8" y="168">fivela</text><line x1="50" y1="164" x2="172" y2="164" stroke="currentColor"/>' +
            '<text x="300" y="108">apito</text><line x1="298" y1="104" x2="238" y2="104" stroke="currentColor"/>' +
            '<text x="198" y="222" fill="var(--magenta)">cinta entre as pernas</text></g>'),
            legenda: 'Partes de um colete de espuma. A cinta entre as pernas impede que uma criança escorregue para fora do colete.' },
          { t: 'h', txt: 'Espuma ou inflável' },
          { t: 'lista', itens: [
            '<strong>Espuma</strong>: flutua sempre, sem depender de mecanismo. É mais volumoso e mais quente. Bom para crianças e para quem não está acostumado.',
            '<strong>Inflável</strong>: leve e confortável, por isso é mais usado no dia a dia. Infla com um cilindro de CO<sub>2</sub>, automaticamente ao molhar ou ao puxar a alça. Exige verificação antes de cada uso e revisão periódica.'
          ] },
          { t: 'h', txt: 'Vestindo e ajustando' },
          { t: 'lista', ordenada: true, itens: [
            'Escolha pelo peso e tamanho indicados na etiqueta. Colete de adulto não serve em criança.',
            'Feche todos os fechos e fivelas e aperte as cintas até o colete ficar justo.',
            'Teste: aperte tudo e peça para alguém puxar o colete para cima pelos ombros. A Guarda Costeira dos EUA diz que o colete de espuma justo não pode subir acima do queixo ou das orelhas; o RYA, para coletes de flutuação, considera grande demais o que levanta mais de 50 mm. Passou disso: aperte as cintas ou troque por um tamanho menor.',
            'Criança: colete de espuma de tamanho certo, com cinta entre as pernas. A NORMAM-211 só pede coletes de tamanho pequeno para crianças e não fala de colete inflável para elas. Fora do Brasil o limite varia (o governo de Nova Gales do Sul, na Austrália, não recomenda inflável abaixo de 12 anos). Na dúvida, use espuma e leia o manual do fabricante.',
            'Inflável: confira se o cilindro de CO<sub>2</sub> está inteiro e bem rosqueado, se o cartucho automático está na validade e se a alça de acionamento está livre.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Quando vestir', html: 'Em barco pequeno e aberto, sempre. À noite, com mar ou vento forte, ao trabalhar sozinho no convés, ao atravessar uma barra e em qualquer situação de risco. Crianças, sempre que estiverem embarcadas. O comandante dá o exemplo.' },
          { t: 'p', html: '<strong>Cuidados</strong>: depois do uso, lave com água doce, deixe secar e guarde em local seco, ventilado e longe do sol. Não use colete como almofada ou defensa e mantenha-o longe de óleo e combustível.' },
          { t: 'termos', ids: ['colete-salva-vidas', 'salvatagem'] },
          { t: 'check', questoes: [
            Q('m11-l1-1', 'Salvatagem', 1, 'Qual classe de colete a NORMAM-211 exige na navegação <strong>costeira</strong>?',
              ['Classe I', 'Classe II', 'Classe III', 'Classe V'], 1,
              'Pelo art. 4.14, a navegação costeira pede coletes classe II. Classe I (SOLAS) é a da oceânica. Classes III e V são da navegação interior (a V também para esportes e miúdas).',
              'NORMAM-211/DPC, arts. 4.11 e 4.14', NORMAM),
            Q('m11-l1-2', 'Salvatagem', 1, 'Uma lancha de médio porte vai passear numa represa (navegação interior) com 6 pessoas, duas delas crianças. Qual dotação está correta?',
              ['Quatro coletes de adulto, porque crianças podem usar boia', 'Seis coletes classe III ou V, com dois de tamanho pequeno para as crianças', 'Seis coletes classe I', 'Nenhum, porque navegação interior dispensa coletes'], 1,
              'A norma exige pelo menos um colete por pessoa, com tamanho pequeno para crianças, e em médio porte na navegação interior a classe é III ou V. Faltar coletes é proibido. Classe I não é exigida na interior (seria permitida, mas não é a dotação mínima). A navegação interior não dispensa coletes.',
              'NORMAM-211/DPC, art. 4.14', NORMAM),
            Q('m11-l1-3', 'Salvatagem', 2, 'Como verificar se um colete de espuma está bem ajustado?',
              ['Se ele flutuar sozinho num balde', 'Puxando-o para cima pelos ombros: não pode subir até o queixo', 'Pela cor: coletes laranja sempre servem', 'Apertando só a fivela de cima'], 1,
              'O teste prático é puxar o colete pelos ombros: se sobe até o queixo ou as orelhas (Guarda Costeira dos EUA), ou levanta mais de 50 mm (RYA), está frouxo ou grande, e na água a pessoa pode escorregar para fora. Flutuar no balde não diz nada sobre o ajuste. A cor não define tamanho. Todas as fivelas e cintas precisam estar fechadas.',
              'U.S. Coast Guard, Life Jacket Wear (ajuste: não subir acima do queixo ou das orelhas); RYA, Buoyancy aids and lifejackets (levantar menos de 50 mm)', USCG_COLETE)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.11 (classes) e art. 4.14 (dotação de coletes)', url: NORMAM, ref: 'extra-arrais-3-04' },
            { txt: 'U.S. Coast Guard, Life Jacket Wear: o colete de espuma justo não sobe acima do queixo ou das orelhas', url: USCG_COLETE },
            { txt: 'RYA, Life jackets and buoyancy aids: teste de levantar o colete pelos ombros (mais de 50 mm é grande demais)', url: RYA_COLETE },
            { txt: 'Transport for NSW (governo de Nova Gales do Sul, Austrália), Lifejacket care: cuidados e verificação de coletes infláveis', url: NSW_COLETE },
            { txt: 'Transport for NSW (Austrália), Children and lifejackets: cinta entre as pernas; inflável não recomendado abaixo de 12 anos (orientação estrangeira, não é regra brasileira)', url: NSW_CRIANCA }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Boias circulares e pirotécnicos', minutos: 11,
        objetivos: [
          'Saber quantas boias o barco precisa e como elas devem ficar instaladas.',
          'Distinguir foguete com paraquedas, facho manual e sinal fumígeno.',
          'Usar os pirotécnicos com segurança e só em emergência.'
        ],
        blocos: [
          { t: 'h', txt: 'Boias salva-vidas' },
          { t: 'p', html: 'A boia salva-vidas (circular ou em ferradura) é feita para ser jogada a quem caiu na água. Ela dá flutuação imediata e marca o local, mesmo que a pessoa não a alcance de primeira.' },
          { t: 'fato', ref: 'extra-arrais-3-08', html: 'Embarcações miúdas (até 6 m) estão dispensadas de boia salva-vidas.' },
          { t: 'fato', ref: 'extra-arrais-3-09', html: 'Embarcações de médio porte com <strong>menos de 12 m</strong>: uma boia circular ou ferradura. Com <strong>12 m ou mais</strong>: duas. Grande porte: duas.' },
          { t: 'fato', ref: 'extra-arrais-3-10', html: 'A boia <strong>não pode ficar presa permanentemente</strong> ao barco. Ela fica em suporte fixo, de onde sai com um puxão, e o chicote da retinida não deve estar amarrado à embarcação.' },
          { t: 'fato', ref: 'extra-arrais-3-12', html: 'Pelo menos uma boia deve ter <strong>retinida flutuante</strong> com o dobro da altura em que fica guardada acima da linha d’água, ou 20 m, o que for maior.' },
          { t: 'fato', ref: 'extra-arrais-3-11', html: 'Cada boia deve ter <strong>dispositivo de iluminação automática</strong> (a luz que acende ao cair na água), exceto nas embarcações da navegação interior, que são dispensadas dele.' },
          { t: 'callout', tipo: 'dica', titulo: 'Jogue já', html: 'Quando alguém cai, jogue a boia na hora, perto da pessoa. Se ela tiver retinida, jogue além da pessoa e puxe o cabo até ela conseguir agarrar. Alguém aponta para a pessoa sem tirar os olhos dela até o resgate.' },
          { t: 'h', txt: 'Pirotécnicos' },
          { t: 'p', html: 'Pirotécnicos são sinais visuais para avisar que você está em perigo e mostrar onde está. A NORMAM-211 descreve três tipos:' },
          { t: 'figura', svg: svg('0 0 360 210', 'Os três pirotécnicos: foguete com paraquedas que sobe a 300 metros, facho manual de luz vermelha e sinal fumígeno laranja flutuante',
            '<rect x="0" y="160" width="360" height="50" fill="var(--sea-2)" opacity="0.5"/>' +
            '<path d="M60 160 L60 40" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>' +
            '<path d="M48 36 Q60 16 72 36 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="48" y1="36" x2="60" y2="50" stroke="currentColor"/><line x1="72" y1="36" x2="60" y2="50" stroke="currentColor"/>' +
            '<circle cx="60" cy="54" r="7" fill="var(--nav-red)"/>' +
            '<text x="60" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">foguete</text><text x="60" y="202" text-anchor="middle" font-size="12.5" fill="currentColor">sobe a 300 m</text>' +
            '<rect x="174" y="110" width="12" height="44" rx="3" fill="currentColor"/><circle cx="180" cy="102" r="10" fill="var(--nav-red)"/><circle cx="180" cy="102" r="17" fill="var(--nav-red)" opacity="0.3"/>' +
            '<text x="180" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">facho manual</text><text x="180" y="202" text-anchor="middle" font-size="12.5" fill="currentColor">luz vermelha, 60 s</text>' +
            '<rect x="288" y="150" width="24" height="14" rx="3" fill="currentColor"/>' +
            '<path d="M300 148 q-18 -20 -4 -40 q14 -20 -2 -44 q10 14 18 22 q12 18 -4 36 q-6 10 -8 26" fill="var(--nav-yellow)" opacity="0.85" stroke="currentColor" stroke-width="1"/>' +
            '<text x="300" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">fumígeno</text><text x="300" y="202" text-anchor="middle" font-size="12.5" fill="currentColor">fumaça laranja, de dia</text>'),
            legenda: 'Foguete para chamar atenção de longe; facho para mostrar a posição exata a quem já está por perto; fumígeno para ser visto de dia, inclusive de aeronaves.' },
          { t: 'fato', ref: 'extra-arrais-3-13', html: '<strong>Foguete manual estrela vermelha com paraquedas</strong>: ao atingir 300 m de altura, solta um paraquedas com luz vermelha de 30.000 candelas por 40 segundos. Serve para ser visto de longe.' },
          { t: 'fato', ref: 'extra-arrais-3-14', html: '<strong>Facho manual luz vermelha</strong>: luz vermelha de 15.000 candelas por 60 segundos, para indicar a posição à noite e guiar o navio ou a aeronave que vem resgatar.' },
          { t: 'fato', ref: 'extra-arrais-3-15', html: '<strong>Sinal fumígeno flutuante laranja</strong>: fumaça por 3 ou 15 minutos, para indicar de dia a posição de uma embarcação de sobrevivência ou de uma pessoa na água.' },
          { t: 'p', html: 'Quantos pirotécnicos levar depende da área:' },
          { t: 'fato', ref: 'extra-arrais-3-18', html: '<strong>Navegação interior</strong>: só as embarcações de grande porte precisam de pirotécnico, e é um facho manual.' },
          { t: 'fato', ref: 'extra-arrais-3-16', html: '<strong>Navegação costeira</strong>: dois foguetes com paraquedas, dois fachos manuais e dois sinais fumígenos laranja.' },
          { t: 'fato', ref: 'extra-arrais-3-17', html: '<strong>Navegação oceânica</strong>: quatro de cada tipo.' },
          { t: 'h', txt: 'Usando com segurança' },
          { t: 'lista', itens: [
            'Use só em emergência real. O RIPEAM (Anexo IV) proíbe usar sinais de perigo, ou sinais que possam ser confundidos com eles, fora de uma situação de perigo.',
            'Dispare quando houver chance de alguém ver: um barco ou avião à vista, a costa próxima, uma aeronave de busca. Um foguete disparado no vazio é um foguete a menos.',
            'Leia antes as instruções impressas no corpo do pirotécnico. Numa emergência, no escuro, não haverá tempo.',
            'Segure com o braço estendido para fora da borda, a sotavento, longe do rosto e do corpo. Foguete: aponte para cima, nunca para pessoas ou aeronaves próximas.',
            'Guarde os pirotécnicos em recipiente estanque e de fácil acesso. Eles têm prazo de validade impresso: troque antes de vencer e não jogue os vencidos no lixo comum.'
          ] },
          { t: 'p', html: 'O Anexo IV do RIPEAM lista outros sinais de perigo que você pode usar sem pirotécnico: levantar e abaixar lentamente os braços estendidos, o toque contínuo do apito ou buzina, a palavra MAYDAY no rádio e o alerta DSC no canal 70 do VHF.' },
          { t: 'termos', ids: ['boia-circular', 'pirotecnicos', 'sinais-de-perigo', 'retinida'] },
          { t: 'check', questoes: [
            Q('m11-l2-1', 'Salvatagem', 1, 'Qual pirotécnico é próprio para indicar sua posição <strong>de dia</strong>, inclusive a uma aeronave?',
              ['Facho manual luz vermelha', 'Foguete estrela vermelha com paraquedas', 'Sinal fumígeno flutuante laranja', 'Lanterna portátil'], 2,
              'O sinal fumígeno laranja é o pirotécnico diurno: a fumaça é bem visível de dia, inclusive do alto. O facho é para indicar a posição à noite. O foguete serve para chamar atenção de longe. Lanterna não é pirotécnico.',
              'NORMAM-211/DPC, art. 4.16', NORMAM),
            Q('m11-l2-2', 'Salvatagem', 2, 'Para a navegação <strong>costeira</strong>, a NORMAM-211 exige quantos pirotécnicos?',
              ['Um facho manual', 'Dois foguetes, dois fachos e dois fumígenos', 'Quatro foguetes, quatro fachos e quatro fumígenos', 'Nenhum, são apenas recomendados'], 1,
              'O art. 4.17 pede, na costeira, dois de cada tipo. Quatro de cada é a dotação da oceânica. Um facho manual é o exigido só para grande porte na navegação interior. Na costeira eles são obrigatórios.',
              'NORMAM-211/DPC, art. 4.17', NORMAM),
            Q('m11-l2-3', 'Salvatagem', 2, 'Sobre a boia salva-vidas de uma lancha de 9 m em navegação costeira, é correto:',
              ['Deve ficar amarrada ao balaústre com nó firme para não cair', 'Uma boia, em suporte fixo, de onde sai com um puxão, com dispositivo de iluminação automática', 'Duas boias, porque é médio porte', 'É dispensada, porque a lancha tem menos de 12 m'], 1,
              'Médio porte com menos de 12 m leva uma boia; fora da navegação interior ela precisa de luz automática; e não pode ficar presa permanentemente ao barco. Amarrada com nó, ela demora a sair na emergência. Duas boias são exigidas a partir de 12 m. Só as miúdas (até 6 m) são dispensadas.',
              'NORMAM-211/DPC, art. 4.15', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.15 (boias salva-vidas)', url: NORMAM, ref: 'extra-arrais-3-09' },
            { txt: 'NORMAM-211/DPC, arts. 4.16 e 4.17 (pirotécnicos: tipos e dotação)', url: NORMAM, ref: 'extra-arrais-3-16' },
            { txt: 'RIPEAM-72, Regra 37 e Anexo IV (sinais de perigo e proibição de uso indevido), texto da CCA-IMO', url: RIPEAM, ref: 'tecnico-89' },
            { txt: 'Transport for NSW, Essential safety equipment: uso dos pirotécnicos, recipiente estanque e validade', url: NSW_EQUIP }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'Palamenta, botes e balsas salva-vidas', minutos: 11,
        objetivos: [
          'Dizer o que é a palamenta e para que serve.',
          'Saber quando a balsa salva-vidas é obrigatória e como ela é mantida.',
          'Conhecer os passos básicos de um abandono e da bolsa de abandono.'
        ],
        blocos: [
          { t: 'h', txt: 'Palamenta' },
          { t: 'p', html: '<strong>Palamenta</strong> é o conjunto de equipamentos soltos que acompanham uma embarcação, sobretudo as miúdas e as de sobrevivência, para que ela possa ser usada: remos e toletes, croque, bartedouro (o balde ou vasilha para tirar água), ancorote com cabo, cabos de reboque e, numa balsa, o kit de sobrevivência que vem dentro dela (água, sinais, faca, bomba de ar, material de reparo, âncora flutuante).' },
          { t: 'p', html: 'Na prática do Arrais, "usar a palamenta" significa saber remar, esgotar a água e manobrar um bote de apoio sem motor. Parece pouco, mas é o que leva você de volta ao barco quando o motor de popa do bote falha.' },
          { t: 'h', txt: 'Botes orgânicos' },
          { t: 'p', html: '<strong>Bote orgânico</strong> é o bote que faz parte da dotação da embarcação: o bote de apoio (inflável ou rígido) usado para ir à terra e, numa emergência, para abandonar o barco. Ele não substitui uma balsa salva-vidas onde ela for exigida, porque não tem cobertura, palamenta de sobrevivência nem flutuação garantida em mar grosso.' },
          { t: 'h', txt: 'Balsas salva-vidas: quando são exigidas' },
          { t: 'fato', ref: 'travessia-114', html: 'Na <strong>navegação oceânica</strong>, a embarcação deve ter balsas salva-vidas infláveis para 100% das pessoas a bordo, podendo ser classe II.' },
          { t: 'fato', ref: 'extra-arrais-3-19', html: 'Na <strong>navegação costeira</strong>, a balsa é dispensada, mas a norma recomenda um bote inflável. Na <strong>navegação interior</strong>, as embarcações estão dispensadas de embarcações de sobrevivência.' },
          { t: 'fato', ref: 'extra-arrais-3-20', html: 'A balsa precisa de <strong>revisão</strong>: as SOLAS, todo ano; as homologadas pela NORMAM-321 ou pela ISO 9650-1, no prazo do fabricante. A data da revisão fica registrada no casulo (a caixa ou bolsa onde a balsa vem embalada).' },
          { t: 'figura', svg: svg('0 0 360 200', 'Balsa salva-vidas inflada, presa ao barco pela boça, com a âncora flutuante na água para reduzir a deriva',
            '<rect x="0" y="120" width="360" height="80" fill="var(--sea-2)" opacity="0.5"/>' +
            '<path d="M10 118 L120 118 L110 140 L20 140 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<text x="64" y="108" text-anchor="middle" font-size="13" fill="currentColor">barco</text>' +
            '<path d="M120 124 Q160 136 196 128" fill="none" stroke="var(--magenta)" stroke-width="2"/>' +
            '<text x="158" y="160" text-anchor="middle" font-size="12.5" fill="var(--magenta)">boça</text>' +
            '<ellipse cx="240" cy="128" rx="48" ry="12" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M196 126 Q240 60 284 126" fill="var(--nav-yellow)" fill-opacity="0.6" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="230" y="96" width="20" height="18" rx="3" fill="var(--surface)" stroke="currentColor"/>' +
            '<text x="240" y="62" text-anchor="middle" font-size="13" fill="currentColor">balsa com cobertura</text>' +
            '<path d="M288 130 Q318 140 330 160" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M322 160 l16 0 l-8 18 z" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
            '<text x="300" y="194" text-anchor="middle" font-size="12.5" fill="currentColor">âncora flutuante</text>'),
            legenda: 'A boça liga a balsa ao barco e é ela que, puxada até o fim, dispara a inflação. Depois do embarque, ela é cortada e a âncora flutuante reduz a deriva.' },
          { t: 'h', txt: 'Abandonar o barco: só em último caso' },
          { t: 'p', html: 'Um barco, mesmo avariado, costuma ser mais seguro e mais fácil de achar do que uma balsa ou uma pessoa na água. Abandone só quando ele estiver afundando, ou com fogo fora de controle. Se o barco virou mas flutua, <strong>fique junto dele</strong>.' },
          { t: 'lista', ordenada: true, itens: [
            'Peça socorro antes (MAYDAY no VHF canal 16, alerta DSC, EPIRB se houver). Todos de colete.',
            'Confira que a boça da balsa está presa ao barco. Lance a balsa a sotavento e puxe a boça até o fim e dê um tranco: ela infla.',
            'Traga a balsa para o costado. Embarque de preferência sem se molhar, os mais fracos primeiro. Leve a bolsa de abandono.',
            'Com todos a bordo, corte a boça com a faca da balsa e afaste-se do barco. Lance a âncora flutuante.',
            'Na balsa: feche a cobertura, esgote a água, mantenha todos juntos e secos, organize a vigia e economize os sinais para quando houver chance de serem vistos.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'A bolsa de abandono', html: 'Uma bolsa estanque, que flutua, pronta perto da saída: VHF portátil à prova d’água, EPIRB ou PLB, pirotécnicos, lanterna, água, remédios de uso contínuo, óculos, documentos e celular em saco estanque. Quem sai às pressas não tem tempo de procurar nada.' },
          { t: 'termos', ids: ['palamenta', 'balsa-salva-vidas', 'bote-de-apoio', 'abandono', 'ancora-flutuante'] },
          { t: 'check', questoes: [
            Q('m11-l3-1', 'Salvatagem', 1, 'Em qual área de navegação a NORMAM-211 exige balsa salva-vidas para 100% das pessoas a bordo?',
              ['Interior', 'Costeira', 'Oceânica', 'Em todas'], 2,
              'Só a navegação oceânica exige balsas para 100% das pessoas (art. 4.13). Na costeira ela é dispensada, com recomendação de bote inflável. Na interior, embarcações de sobrevivência são dispensadas.',
              'NORMAM-211/DPC, art. 4.13', NORMAM),
            Q('m11-l3-2', 'Salvatagem', 2, 'Seu barco virou num lago, mas continua flutuando, emborcado. O mais seguro em geral é:',
              ['Nadar até a margem, que parece perto', 'Ficar junto do barco, de colete, e chamar ajuda', 'Mergulhar para buscar objetos na cabine', 'Afastar-se do barco para não ser atingido'], 1,
              'O barco virado flutua, ajuda você a se manter fora da água e é muito mais fácil de ser achado. Distâncias na água enganam e nadar gasta calor e força. Mergulhar sob o casco é perigoso. Afastar-se só faz sentido em caso de fogo.',
              'Transport for NSW, Capsizing and swamping', NSW_VIRAR),
            Q('m11-l3-3', 'Salvatagem', 2, 'Na hora de lançar a balsa salva-vidas ao mar, o primeiro cuidado é:',
              ['Cortar a boça para ela não puxar o barco', 'Conferir que a boça está presa ao barco', 'Inflar a balsa no convés antes de lançá-la', 'Lançá-la a barlavento para ela ficar longe'], 1,
              'A boça precisa estar presa ao barco: é puxando-a que a balsa infla, e é por ela que você a traz para o costado. Cortada antes, a balsa vai embora com o vento. Inflar no convés pode prendê-la e danificá-la. Lança-se a sotavento, onde o barco a protege e ela não é empurrada contra o casco.',
              'NORMAM-211/DPC, Anexo 5-A, item 3.1 b) (balsas salva-vidas de abandono); instruções dos fabricantes de balsas', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.13 (embarcações de sobrevivência, homologação e revisão de balsas)', url: NORMAM, ref: 'extra-arrais-3-20' },
            { txt: 'Transport for NSW, Capsizing and swamping: ficar junto do barco virado; abandonar só em último caso', url: NSW_VIRAR },
            { txt: 'Transport for NSW, Fire on board: abandonar pelo lado de barlavento', url: NSW_FOGO }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Queda na água e hipotermia', minutos: 12,
        objetivos: [
          'Explicar as três fases da imersão em água fria (regra 1-10-1).',
          'Adotar as posições HELP e de agrupamento para poupar calor.',
          'Reconhecer e tratar a hipotermia com segurança.'
        ],
        blocos: [
          { t: 'p', html: 'Muita gente acha que água fria é problema só de país frio. Não é. No Sul do Brasil, no inverno, lagoas, represas e o mar ficam frios, e mesmo a água tropical tira calor do corpo muito mais depressa que o ar. Uma pessoa na água por muitas horas, à noite, esfria até em águas mornas. O treinamento do Arrais pede atenção especial à queda na água com hipotermia.' },
          { t: 'h', txt: 'A regra 1-10-1' },
          { t: 'p', html: 'O fisiologista Gordon Giesbrecht, da Universidade de Manitoba (Canadá), estudou voluntários em água muito fria e resumiu as fases da imersão numa regra fácil de lembrar:' },
          { t: 'tabela', cab: ['Fase', 'Tempo', 'O que acontece', 'O que fazer'], linhas: [
            ['<strong>1</strong>: choque térmico', 'cerca de 1 minuto', 'Um suspiro involuntário e respiração ofegante. Quem está com a cabeça debaixo d’água pode engolir água e se afogar.', 'Não lute nem nade. Flutue de costas, controle a respiração.'],
            ['<strong>10</strong>: incapacitação', 'cerca de 10 minutos', 'Os músculos de braços e pernas esfriam e perdem força e coordenação.', 'Use esses minutos para se salvar: subir no barco, segurar algo que flutue, sinalizar.'],
            ['<strong>1</strong>: hipotermia', 'cerca de 1 hora', 'A temperatura do corpo cai; depois de cerca de uma hora em água gelada, vem a perda de consciência.', 'Poupe calor: posição HELP ou agrupamento, fique quieto.']
          ], legenda: 'Os tempos são aproximados e foram medidos em água gelada (cerca de 6 °C). Em água menos fria, tudo demora mais; o colete muda tudo, porque mantém o rosto fora da água.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'A maioria morre antes da hipotermia', html: 'Segundo Giesbrecht, a maioria das mortes em água fria acontece logo no início, pelo choque térmico e pela incapacitação, e não pela hipotermia. Por isso o colete vestido é o que mais salva: ele segura sua cabeça fora da água no minuto do choque, quando você não controla a respiração.' },
          { t: 'h', txt: 'Poupando calor na água' },
          { t: 'p', html: 'Nadar e se agitar gastam calor depressa. Se não dá para sair da água, fique quieto e use estas posições (com colete):' },
          { t: 'figura', svg: svg('0 0 360 190', 'Posição HELP, com joelhos encolhidos e braços cruzados no peito, e posição de agrupamento, com várias pessoas abraçadas peito com peito',
            '<rect x="0" y="80" width="360" height="110" fill="var(--sea-2)" opacity="0.45"/><line x1="0" y1="80" x2="360" y2="80" stroke="currentColor" stroke-opacity="0.5"/>' +
            '<circle cx="90" cy="66" r="14" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M70 82 Q90 72 110 82 L112 126 Q90 134 68 126 Z" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M76 100 L104 112 M104 100 L76 112" stroke="currentColor" stroke-width="3"/>' +
            '<path d="M80 128 Q72 148 96 150 Q112 150 104 130" fill="none" stroke="currentColor" stroke-width="3"/>' +
            '<text x="90" y="174" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">HELP (sozinho)</text>' +
            '<g transform="translate(250 112)"><circle r="44" fill="none" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="5 4"/>' +
            '<circle cx="0" cy="-30" r="12" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/><circle cx="28" cy="10" r="12" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="-28" cy="10" r="12" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/><circle cx="0" cy="30" r="12" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/></g>' +
            '<text x="250" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">agrupamento (vários)</text>' +
            '<text x="250" y="40" text-anchor="middle" font-size="12.5" fill="currentColor">vista de cima</text>'),
            legenda: 'HELP vem do inglês "postura que reduz a perda de calor". No agrupamento, as pessoas se abraçam peito com peito, protegendo o tronco umas das outras.' },
          { t: 'lista', itens: [
            '<strong>Sozinho, posição HELP</strong>: encolha os joelhos junto ao peito e abrace-os (ou cruze os braços sobre o peito), mantendo-se encolhido e quieto. Protege as áreas que mais perdem calor: axilas, peito e virilha.',
            '<strong>Em grupo, agrupamento</strong>: juntem-se bem, peito com peito, braços em volta uns dos outros. Isso reduz a perda de calor e pode aumentar o tempo de sobrevivência em até 50%. Um grupo também é muito mais fácil de ser visto.',
            'Mantenha a roupa: a água que fica presa entre a roupa e a pele se aquece e retarda a perda de calor (BoatUS Foundation). Nadar gasta esse calor: pode reduzir o tempo de sobrevivência em quase 50%. Fique perto do barco ou de qualquer coisa que flutue. Só nade para a margem se ela estiver muito perto: distâncias na água enganam.'
          ] },
          { t: 'h', txt: 'Hipotermia: reconhecer e tratar' },
          { t: 'p', html: 'Hipotermia é a queda da temperatura do corpo abaixo de 35 °C (o normal é cerca de 37 °C). Sinais: tremores, pele pálida e fria, lábios arroxeados, fala arrastada, respiração lenta, cansaço e confusão. Na hipotermia grave a pessoa pode até parar de tremer, o que é um mau sinal.' },
          { t: 'lista', ordenada: true, itens: [
            'Tire a pessoa da água com cuidado e mantenha-a quieta e deitada. Movimentos bruscos podem piorar o quadro.',
            'Leve-a para um lugar abrigado do vento. Troque a roupa molhada por roupa seca, cobertor ou saco de dormir, cobrindo também a cabeça. Uma manta térmica (aluminizada) ajuda.',
            'Se estiver bem acordada, dê bebida morna sem álcool e algo doce.',
            '<strong>Não</strong> esfregue braços e pernas, <strong>não</strong> dê banho quente nem encoste bolsa de água quente na pele, <strong>não</strong> dê bebida alcoólica.',
            'Peça orientação e evacuação: hipotermia é emergência médica. Pelo VHF, chame no canal 16; pelo telefone, o 185 do SALVAMAR. Se a pessoa não respirar normalmente, comece a RCP (módulo de primeiros socorros).'
          ] },
          { t: 'termos', ids: ['hipotermia', 'choque-termico', 'homem-ao-mar'] },
          { t: 'check', questoes: [
            Q('m11-l4-1', 'Sobrevivência', 1, 'Na regra 1-10-1, o primeiro "1" corresponde a:',
              ['1 hora até a hipotermia', '1 minuto de choque térmico, para controlar a respiração', '1 quilômetro que se consegue nadar', '1 grau de queda na temperatura do corpo'], 1,
              'O primeiro "1" é o minuto do choque térmico, quando a respiração fica descontrolada e o risco é engolir água. O "10" são os minutos de movimentos úteis, e o último "1" é a hora até a perda de consciência pela hipotermia. Não se refere a distância nem a graus.',
              'Giesbrecht, princípio 1-10-1 (McGill Office for Science and Society)', MCGILL_1101),
            Q('m11-l4-2', 'Sobrevivência', 2, 'Três tripulantes de colete estão na água esperando resgate. O melhor a fazer é:',
              ['Nadar cada um numa direção para aumentar a chance de serem vistos', 'Juntar-se em agrupamento, peito com peito, e ficar quietos', 'Tirar a roupa molhada para ficarem mais leves', 'Nadar sem parar para manter o corpo aquecido'], 1,
              'O agrupamento reduz a perda de calor (até 50% mais tempo de sobrevivência) e o grupo é mais visível. Separar-se dificulta a busca. A roupa, mesmo molhada, retém calor. Nadar acelera a perda de calor.',
              'Transport for NSW, Cold water and hypothermia', NSW_FRIO),
            Q('m11-l4-3', 'Primeiros socorros', 2, 'Uma pessoa resgatada da água está tremendo, confusa e com fala arrastada. Qual atitude está <strong>errada</strong>?',
              ['Trocar a roupa molhada por roupa seca e cobri-la', 'Dar uma bebida morna e doce, se estiver bem acordada', 'Esfregar vigorosamente braços e pernas e dar um gole de cachaça', 'Abrigá-la do vento e mantê-la deitada e quieta'], 2,
              'Esfregar os membros e dar álcool pioram a hipotermia: o álcool aumenta a perda de calor e esfregar pode causar lesão e mandar sangue frio ao coração. Trocar a roupa, dar bebida morna (se acordada) e abrigar do vento são as condutas corretas.',
              'NHS, Hypothermia; St John Ambulance, Hypothermia', NHS_HIPO)
          ] },
          { t: 'fontes', itens: [
            { txt: 'McGill University, Office for Science and Society: Giesbrecht e o princípio 1-10-1', url: MCGILL_1101 },
            { txt: 'Transport for NSW, Cold water and hypothermia: choque térmico, posição HELP, agrupamento (até 50% mais tempo) e tratamento', url: NSW_FRIO },
            { txt: 'BoatUS Foundation, Cold Water: posição HELP, agrupamento, não tirar a roupa e não nadar', url: BOATUS_FRIO },
            { txt: 'NHS (Reino Unido), Hypothermia: abaixo de 35 °C, sinais e o que não fazer', url: NHS_HIPO },
            { txt: 'St John Ambulance, Hypothermia: tratamento em local abrigado', url: SJA_HIPO },
            { txt: 'Transport for NSW, Person overboard', url: NSW_MOB }
          ] }
        ]
      },
      {
        id: 'l5', titulo: 'Material obrigatório por área de navegação', minutos: 12,
        objetivos: [
          'Comparar a dotação mínima de segurança nas navegações interior, costeira e oceânica.',
          'Entender que a dotação segue a classificação do barco no TIE.',
          'Fazer a lista de verificação antes de sair.'
        ],
        blocos: [
          { t: 'p', html: 'A NORMAM-211 traz, nos arts. 4.33 a 4.35, quadros-resumo do que cada embarcação deve ter a bordo, conforme a área de navegação em que foi classificada. Antes da tabela, três regras gerais:' },
          { t: 'fato', ref: 'extra-arrais-3-21', html: 'Os itens dos quadros são de dotação e porte obrigatórios conforme a <strong>classificação da embarcação no seu TIE</strong> (Título de Inscrição de Embarcação), qualquer que seja a navegação que ela estiver fazendo naquele dia. Um barco classificado para navegação costeira deve ter o material da costeira mesmo passeando numa baía abrigada.' },
          { t: 'fato', ref: 'extra-arrais-3-28', html: 'A dotação da norma é a <strong>mínima</strong>, pensada para navegar com bom tempo. O comandante é responsável por ter equipamentos compatíveis com a área e com o número de pessoas a bordo.' },
          { t: 'fato', ref: 'extra-arrais-3-27', html: 'Os equipamentos devem ser homologados pela Autoridade Marítima, estar em bom estado e dentro do prazo de validade ou de revisão.' },
          { t: 'h', txt: 'Quadro comparativo (embarcação de médio porte, menos de 12 m)' },
          { t: 'p', html: 'Nos quadros da norma, a coluna de médio porte cobre as embarcações maiores que as miúdas (6 m) e menores que 24 m, onde estão a maioria das lanchas e dos veleiros de cruzeiro (um de 32 pés, cerca de 9,75 m, é um exemplo).' },
          { t: 'tabela', cab: ['Item', 'Interior', 'Costeira', 'Oceânica'], linhas: [
            ['Coletes (um por pessoa)', 'classe III ou V', 'classe II', 'classe I (SOLAS)'],
            ['Boia salva-vidas', '1, com retinida', '1, com retinida e luz automática', '1, com retinida e luz automática'],
            ['Pirotécnicos', 'dispensados', '2 foguetes, 2 fachos, 2 fumígenos', '4 foguetes, 4 fachos, 4 fumígenos'],
            ['Balsa salva-vidas', 'dispensada', 'dispensada (bote inflável recomendado)', 'para 100% das pessoas'],
            ['Extintores (6 a 12 m)', '2 B-1 perto do motor e 1 B-1 no comando', 'idem', 'idem'],
            ['Âncora com 20 m de cabo, apito, lanterna', 'obrigatórios', 'obrigatórios', 'obrigatórios'],
            ['Refletor radar e sino ou buzina', '—', 'obrigatórios', 'obrigatórios'],
            ['Rádio VHF', 'recomendado', 'fixo, obrigatório (com DSC)', 'fixo, obrigatório (com DSC), mais HF ou satelital'],
            ['GNSS (GPS)', '—', '1 aparelho', '2 aparelhos'],
            ['EPIRB 406 MHz', '—', '—', 'obrigatória']
          ], legenda: 'Resumo dos arts. 4.13 a 4.19, 4.24 e 4.33 a 4.36 da NORMAM-211. Cada linha corresponde a um fato listado nas fontes desta lição e nas lições anteriores. Confira sempre o texto da norma: os quadros também trazem bomba de esgoto, bandeira, quadros de regras, documentos e outros itens.' },
          { t: 'fato', ref: 'extra-arrais-3-30', html: 'Uma exceção útil: veleiros de classes padronizadas (Laser, Soling, Optimist e similares), navegando só de dia, estão dispensados do material do capítulo, <strong>exceto os coletes</strong>.' },
          { t: 'fato', ref: 'extra-arrais-3-29', html: 'O material de salvatagem dos barcos de esporte e recreio não precisa ser marcado com o nome do barco e pode ser emprestado de outra embarcação. Vai fazer uma travessia costeira com um barco de interior? Pegue emprestado o que falta.' },
          { t: 'h', txt: 'Antes de sair: a lista de verificação' },
          { t: 'p', html: 'O Anexo 5-F da NORMAM-211 traz uma lista de verificação para embarcações de esporte e recreio. Os itens de segurança:' },
          { t: 'fato', ref: 'extra-arrais-3-47', html: 'Verificar o material de salvatagem e se há coletes em número suficiente para todos que vão embarcar.' },
          { t: 'fato', ref: 'extra-arrais-3-52', html: 'Inspecionar o material contra incêndio: validade e estado de conservação dos extintores.' },
          { t: 'fato', ref: 'extra-arrais-3-49', html: 'Entregar o Aviso de Saída ao iate clube ou marina. Fora de clube ou marina, deixar alguém em terra sabendo para onde você vai e quando pretende voltar.' },
          { t: 'fato', ref: 'normas-158', html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.' },
          { t: 'termos', ids: ['tie', 'aviso-de-saida', 'navseg', 'salvatagem'] },
          { t: 'check', questoes: [
            Q('m11-l5-1', 'Salvatagem', 2, 'Uma lancha classificada no TIE para navegação costeira vai passear numa baía abrigada (área de navegação interior). Que material ela deve ter?',
              ['Só o da navegação interior, porque é onde está navegando', 'O da navegação costeira, porque a dotação segue a classificação do TIE', 'Nenhum material extra, só coletes', 'O da navegação oceânica'], 1,
              'A nota dos quadros da NORMAM-211 diz que a dotação segue a classificação no TIE, qualquer que seja a navegação do dia. Por isso vale a dotação costeira. A área do passeio define a habilitação mínima do condutor, não a dotação. Oceânica não é a classificação dela.',
              'NORMAM-211/DPC, arts. 4.13 e 4.35 (nota)', NORMAM),
            Q('m11-l5-2', 'Salvatagem', 2, 'Qual item é obrigatório na navegação <strong>oceânica</strong> e não é exigido na costeira para médio porte?',
              ['Coletes salva-vidas', 'Balsa salva-vidas para 100% das pessoas e EPIRB 406 MHz', 'Boia salva-vidas', 'Lanterna portátil'], 1,
              'Balsa para todos e EPIRB 406 MHz são exigências da oceânica; na costeira, a balsa é dispensada e a EPIRB não consta para médio porte. Coletes, boia e lanterna são exigidos nas duas (com classes diferentes de colete).',
              'NORMAM-211/DPC, arts. 4.13, 4.24.2 e tabelas 4.34 e 4.35', NORMAM),
            Q('m11-l5-3', 'Salvatagem', 1, 'Quem é responsável por dotar a embarcação de material de salvatagem compatível com a área e com o número de pessoas, além do mínimo da norma?',
              ['O fabricante do barco', 'A marina onde o barco fica', 'O comandante', 'A Capitania dos Portos'], 2,
              'A NORMAM-211 põe essa responsabilidade no comandante (arts. 4.3 e 4.8). O fabricante, a marina e a Capitania não respondem pela dotação de cada saída.',
              'NORMAM-211/DPC, arts. 4.3 e 4.8', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.14 e quadros 4.33 a 4.35 (coletes)', url: NORMAM, ref: 'extra-arrais-3-05' },
            { txt: 'NORMAM-211/DPC, art. 4.15 (boias)', url: NORMAM, ref: 'extra-arrais-3-11' },
            { txt: 'NORMAM-211/DPC, art. 4.17 (pirotécnicos)', url: NORMAM, ref: 'extra-arrais-3-17' },
            { txt: 'NORMAM-211/DPC, art. 4.13 (balsas)', url: NORMAM, ref: 'extra-arrais-3-19' },
            { txt: 'NORMAM-211/DPC, art. 4.36.2 (extintores de 6 a 12 m)', url: NORMAM, ref: 'extra-arrais-3-36' },
            { txt: 'NORMAM-211/DPC, art. 4.18 (âncora, apito, lanterna)', url: NORMAM, ref: 'extra-arrais-3-24' },
            { txt: 'NORMAM-211/DPC, art. 4.18 (refletor radar; sino ou buzina)', url: NORMAM, ref: 'extra-arrais-3-23' },
            { txt: 'NORMAM-211/DPC, art. 4.24.2 (rádio por área)', url: NORMAM, ref: 'normas-156' },
            { txt: 'NORMAM-211/DPC, art. 4.24.2 a) (oceânica: VHF/DSC, HF/DSC ou satelital, EPIRB)', url: NORMAM, ref: 'normas-155' },
            { txt: 'NORMAM-211/DPC, art. 4.19.2 (GNSS)', url: NORMAM, ref: 'extra-arrais-3-54' },
            { txt: 'NORMAM-211/DPC, Anexo 5-F (lista de verificação)', url: NORMAM, ref: 'extra-arrais-3-47' }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 12 — Primeiros socorros a bordo
     Programa: 3.1 a) IX; treinamento teórico 1.7; bibliografia: aplicativo da Cruz Vermelha (FICR).
     ===================================================================================== */
  var SJA = 'https://www.sja.org.uk/first-aid-advice/';
  var SJA_AVAL = SJA + 'primary-survey/';
  var SJA_LATERAL = SJA + 'recovery-position/';
  var SJA_RCP = SJA + 'cpr/';
  var SJA_AFOG = SJA + 'drowning/';
  var SJA_DEA = SJA + 'how-to-use-a-defibrillator/';
  var SJA_SANG = SJA + 'severe-bleeding/';
  var SJA_TORN = SJA + 'life-threatening-bleed/';
  var SJA_CHOQUE = SJA + 'shock/';
  var SJA_FRAT = SJA + 'fractures-and-broken-bones/';
  var SJA_QUEIM = SJA + 'burns-and-scalds/';
  var SJA_INSOL = SJA + 'heatstroke/';
  var SJA_DESID = SJA + 'dehydration/';
  var NHS_QUEIM = 'https://www.nhs.uk/conditions/burns-and-scalds/';
  var NHS_CALOR = 'https://www.nhs.uk/conditions/heat-exhaustion-heatstroke/';
  var NHS_ENJOO = 'https://www.nhs.uk/conditions/motion-sickness/';
  var SAMU = 'https://www.gov.br/saude/pt-br/composicao/saes/samu-192';
  var SALVAMAR_FAQ = 'https://www.marinha.mil.br/salvamarbrasil/node/49';
  var AVISO_CURSO = 'Este módulo ensina noções para agir até a ajuda chegar. <strong>Não substitui um curso presencial de primeiros socorros</strong>, com prática de RCP em manequim. Faça um: na Cruz Vermelha, no Corpo de Bombeiros, no SAMU ou numa escola credenciada.';

  M.push({
    id: 'm12', titulo: 'Primeiros socorros a bordo',
    resumo: 'Avaliar a vítima e pedir ajuda, afogamento e RCP, sangramentos, fraturas, queimaduras, calor, enjoo e o kit de primeiros socorros, com a ajuda que existe pelo rádio.',
    licoes: [
      {
        id: 'l1', titulo: 'Avaliar a vítima e pedir ajuda', minutos: 10,
        objetivos: [
          'Fazer a avaliação primária na ordem: perigo, resposta, vias aéreas, respiração, circulação.',
          'Saber como pedir ajuda no mar e em águas interiores.',
          'Colocar uma vítima inconsciente que respira na posição lateral de segurança.'
        ],
        blocos: [
          { t: 'callout', tipo: 'seguranca', titulo: 'Leia antes', html: AVISO_CURSO },
          { t: 'p', html: 'No barco, a ajuda demora. Um acidente que em terra teria uma ambulância em minutos, no mar ou num rio pode esperar horas. Por isso o treinamento do Arrais inclui exemplos práticos de primeiros socorros a bordo, e a bibliografia oficial da prova indica o aplicativo da Cruz Vermelha.' },
          { t: 'fato', ref: 'programa-43', html: 'A bibliografia recomendada para o Arrais-Amador inclui o aplicativo de primeiros socorros da Cruz Vermelha (FICR), disponível nas lojas de aplicativos.' },
          { t: 'fato', ref: 'extra-arrais-3-45', html: 'A NORMAM-211 remete as orientações de primeiros socorros ao aplicativo FICR e chama atenção para dois procedimentos: a respiração boca a boca e a aplicação de garrote (torniquete). Os dois aparecem neste módulo.' },
          { t: 'h', txt: 'A avaliação primária: P-R-A-B-C' },
          { t: 'figura', svg: svg('0 0 360 300', 'Fluxo da avaliação primária: perigo, resposta, vias aéreas, respiração e circulação, com as decisões de iniciar RCP ou colocar em posição lateral',
            '<g font-size="13" fill="currentColor">' +
            '<rect x="20" y="8" width="320" height="34" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="180" y="30" text-anchor="middle"><tspan font-weight="700">P</tspan>erigo: o local é seguro para você?</text>' +
            '<rect x="20" y="58" width="320" height="34" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="180" y="80" text-anchor="middle"><tspan font-weight="700">R</tspan>esposta: chame e toque nos ombros</text>' +
            '<rect x="20" y="108" width="320" height="34" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="180" y="130" text-anchor="middle"><tspan font-weight="700">A</tspan>: abra as vias aéreas (cabeça para trás)</text>' +
            '<rect x="20" y="158" width="320" height="34" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="180" y="180" text-anchor="middle"><tspan font-weight="700">B</tspan>: respira normalmente? (até 10 s)</text>' +
            '<rect x="10" y="222" width="160" height="50" rx="8" fill="var(--magenta)" fill-opacity="0.15" stroke="var(--magenta)" stroke-width="2"/><text x="90" y="243" text-anchor="middle" font-weight="700">não: peça ajuda</text><text x="90" y="261" text-anchor="middle">e comece a RCP</text>' +
            '<rect x="190" y="222" width="160" height="50" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="270" y="243" text-anchor="middle" font-weight="700">sim: C, sangramento?</text><text x="270" y="261" text-anchor="middle">e posição lateral</text>' +
            '<text x="180" y="292" text-anchor="middle" font-size="12.5">sangramento grave: comprima antes de seguir</text></g>' +
            '<path d="M180 42 v14 M180 92 v14 M180 142 v14" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M150 192 L95 220 M210 192 L265 220" stroke="currentColor" stroke-width="2"/>'),
            legenda: 'A avaliação primária em português: Perigo, Resposta, A (vias aéreas), B (respiração) e C (circulação). É a mesma sequência DR ABC ensinada nos cursos internacionais.' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Perigo</strong>: antes de tudo, o local é seguro? No barco: motor em neutro ou desligado (hélice!), fogo, fumaça, mar. Você ferido não ajuda ninguém.',
            '<strong>Resposta</strong>: chame a pessoa, toque nos ombros, pergunte "você está bem?". Não responde: está inconsciente e precisa de atenção imediata.',
            '<strong>Sangramento grave</strong>: se jorra sangue, comprima o ferimento primeiro (lição 3).',
            '<strong>Vias aéreas</strong>: uma mão na testa inclina a cabeça para trás; dois dedos da outra levantam o queixo.',
            '<strong>Respiração</strong>: olhe o peito, escute e sinta o ar no rosto, por no máximo 10 segundos. Respiração rara, ruidosa, em "puxadas" (gasping) <strong>não é normal</strong>: é sinal de parada cardíaca. Não respira normalmente: peça ajuda e comece a RCP (lição 2).',
            '<strong>Circulação</strong>: se respira, procure sangramentos e outros ferimentos, e mantenha a pessoa aquecida.'
          ] },
          { t: 'h', txt: 'Pedindo ajuda' },
          { t: 'lista', itens: [
            '<strong>Rádio VHF, canal 16</strong>: em emergência médica grave no mar, chame a Capitania, o SALVAMAR ou qualquer embarcação. Situação urgente sem risco imediato de vida: PAN PAN; perigo grave e iminente: MAYDAY (módulo de rádio).',
            '<strong>Telefone 185</strong>: SALVAMAR, o serviço de busca e salvamento da Marinha, 24 horas.',
            '<strong>Telefone 192</strong>: SAMU, quando você estiver perto da margem ou chegando a um cais com acesso de ambulância.',
            'Diga: quem você é, onde está (posição), o que aconteceu, quantas vítimas, como estão, e o que já foi feito.'
          ] },
          { t: 'fato', ref: 'radio-48', html: 'O SALVAMAR atende 24 horas pedidos de socorro vindos do mar, pelos sistemas de comunicações e pelo telefone 185.' },
          { t: 'fato', ref: 'travessia-108', html: 'Entre as emergências atendidas pelo SALVAMAR estão pessoas que adoecem a bordo e precisam de orientação médica ou de evacuação para um hospital em terra.' },
          { t: 'h', txt: 'Posição lateral de segurança' },
          { t: 'p', html: 'Vítima inconsciente que <strong>respira normalmente</strong> vai para a posição lateral: de lado, com a cabeça inclinada para trás. Assim a língua não fecha a garganta e o vômito escorre para fora. Ajoelhe-se ao lado, ponha o braço mais próximo dobrado em ângulo reto, traga o outro braço sobre o peito com o dorso da mão encostado na bochecha, dobre o joelho do lado oposto e role a pessoa na sua direção. Ajuste a perna de cima em ângulo reto e incline a cabeça para trás. Vigie a respiração até a ajuda chegar.' },
          { t: 'check', questoes: [
            Q('m12-l1-1', 'Primeiros socorros', 1, 'Qual é o <strong>primeiro</strong> passo da avaliação de uma vítima a bordo?',
              ['Verificar se ela respira', 'Garantir que o local é seguro para você e para ela', 'Começar as compressões no peito', 'Dar água para ela beber'], 1,
              'A avaliação começa pelo perigo: motor, hélice, fogo ou mar podem fazer de você mais uma vítima. Respiração e compressões vêm depois. Nunca dê nada para beber a quem pode estar inconsciente.',
              'St John Ambulance, Primary survey (DR ABC)', SJA_AVAL),
            Q('m12-l1-2', 'Primeiros socorros', 2, 'A vítima não responde e faz "puxadas" de ar raras e ruidosas. Isso significa que:',
              ['Ela está respirando bem e basta esperar', 'É sinal de parada cardíaca: peça ajuda e comece a RCP', 'Ela está dormindo', 'Você deve sacudi-la com força até acordar'], 1,
              'A respiração agônica (gasping) aparece nos primeiros minutos da parada cardíaca e não é respiração normal: a conduta é chamar ajuda e iniciar a RCP. Esperar perde minutos preciosos. Sacudir com força não ajuda.',
              'St John Ambulance, Primary survey (DR ABC)', SJA_AVAL),
            Q('m12-l1-3', 'Primeiros socorros', 1, 'Uma pessoa desmaiou, não responde, mas respira normalmente. Enquanto espera ajuda, você deve:',
              ['Deixá-la deitada de barriga para cima, com um travesseiro sob a cabeça', 'Colocá-la na posição lateral de segurança e vigiar a respiração', 'Iniciar compressões no peito', 'Sentá-la e dar água'], 1,
              'Inconsciente que respira vai para a posição lateral: a via aérea fica aberta e o vômito escorre. De barriga para cima, com a cabeça flexionada pelo travesseiro, a língua pode fechar a garganta. Compressões são para quem não respira normalmente. Não se dá líquido a inconsciente.',
              'St John Ambulance, Recovery position', SJA_LATERAL)
          ] },
          { t: 'fontes', itens: [
            { txt: 'St John Ambulance (Reino Unido), Primary survey (DR ABC), revisão clínica de 28/04/2025', url: SJA_AVAL },
            { txt: 'St John Ambulance, Recovery position', url: SJA_LATERAL },
            { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.2 e) (bibliografia: aplicativo da Cruz Vermelha)', url: NORMAM, ref: 'programa-43' },
            { txt: 'NORMAM-211/DPC, art. 4.21, Nota (aplicativo FICR)', url: NORMAM, ref: 'radio-93' },
            { txt: 'SALVAMAR Brasil, perguntas frequentes', url: SALVAMAR_FAQ, ref: 'travessia-108' },
            { txt: 'Ministério da Saúde, SAMU 192', url: SAMU }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Afogamento e RCP', minutos: 12,
        objetivos: [
          'Fazer compressões torácicas com profundidade e ritmo corretos.',
          'Saber por que o afogado precisa de ventilações logo no início.',
          'Usar o desfibrilador externo automático (DEA) se houver um.'
        ],
        blocos: [
          { t: 'callout', tipo: 'seguranca', titulo: 'Leia antes', html: AVISO_CURSO },
          { t: 'h', txt: 'Primeiro, não vire mais uma vítima' },
          { t: 'p', html: 'Quem pula na água para salvar alguém em pânico muitas vezes se afoga junto. Do barco ou da margem: <strong>jogue</strong> uma boia, um colete, um cabo; <strong>estenda</strong> um remo ou um croque; <strong>aproxime o barco</strong> com cuidado, motor em neutro perto da pessoa. Entre na água só se tiver treinamento e equipamento, e nunca sem colete.' },
          { t: 'h', txt: 'RCP no adulto' },
          { t: 'p', html: 'A <strong>reanimação cardiopulmonar (RCP)</strong> mantém sangue com oxigênio chegando ao cérebro até o coração voltar a bater ou a ajuda chegar. Ela é feita em quem não responde e não respira normalmente.' },
          { t: 'figura', svg: svg('0 0 360 190', 'Posição das mãos para as compressões: no centro do peito, braços retos, ombros sobre as mãos, afundando 5 a 6 centímetros, 100 a 120 vezes por minuto',
            '<rect x="20" y="150" width="320" height="10" fill="currentColor" opacity="0.25"/>' +
            '<ellipse cx="120" cy="138" rx="90" ry="16" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="232" cy="134" r="18" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="108" y="112" width="34" height="12" rx="5" fill="var(--magenta)"/>' +
            '<path d="M125 112 L125 50" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>' +
            '<circle cx="125" cy="34" r="16" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M160 70 v32" stroke="var(--magenta)" stroke-width="2.5"/><path d="M154 96 l6 10 l6 -10z" fill="var(--magenta)"/>' +
            '<g font-size="13" fill="currentColor"><text x="172" y="72">afunde 5 a 6 cm</text><text x="172" y="90">100 a 120 por minuto</text>' +
            '<text x="172" y="108">deixe o peito voltar</text><text x="20" y="182">braços retos, ombros sobre as mãos, centro do peito</text></g>'),
            legenda: 'Mãos sobrepostas no centro do peito, dedos entrelaçados, braços retos. O ritmo da música "Stayin’ Alive" ajuda a manter 100 a 120 compressões por minuto.' },
          { t: 'lista', ordenada: true, itens: [
            'Peça ajuda (rádio ou telefone no viva-voz) e mande alguém buscar um DEA, se houver. Não deixe a vítima sozinha para procurar o aparelho.',
            'Deite a vítima de costas numa superfície firme. Ajoelhe-se ao lado do peito.',
            'Mãos uma sobre a outra no centro do peito. Braços retos, ombros sobre as mãos.',
            'Comprima forte, <strong>5 a 6 cm</strong>, e solte deixando o peito voltar, num ritmo de <strong>100 a 120 por minuto</strong>.',
            'Se você foi treinado: após 30 compressões, dê 2 ventilações boca a boca (cabeça para trás, queixo levantado, nariz fechado, sopre até o peito subir). Se não foi treinado ou não consegue, faça só compressões contínuas.',
            'Não pare até a ajuda assumir, a pessoa voltar a respirar normalmente ou você não aguentar mais. Revezem a cada dois minutos, se houver mais gente.'
          ] },
          { t: 'h', txt: 'No afogamento, o ar vem primeiro' },
          { t: 'p', html: 'No afogado, o coração para porque faltou oxigênio. Por isso a sequência muda: depois de tirar a vítima da água e ver que ela não respira normalmente, <strong>abra as vias aéreas e dê 5 ventilações iniciais</strong>; depois siga com 30 compressões e 2 ventilações. É normal a vítima vomitar: vire-a de lado, limpe a boca e continue.' },
          { t: 'callout', tipo: 'dica', titulo: 'Afogado com frio', html: 'O afogado retirado de água fria quase sempre está também com hipotermia. Continue a RCP até a ajuda chegar: o frio protege o cérebro por mais tempo, e há casos de recuperação depois de RCP prolongada. Proteja-o do vento e troque a roupa molhada assim que possível.' },
          { t: 'h', txt: 'O desfibrilador (DEA)' },
          { t: 'p', html: 'O DEA analisa o ritmo do coração e, se necessário, dá um choque. Ele fala o que fazer: ligue-o e siga a voz. Seque o peito molhado antes de colar as pás (uma abaixo da clavícula direita e outra do lado esquerdo, abaixo da axila) e continue as compressões enquanto alguém as cola. Ninguém encosta na vítima na hora do choque. Marinas, clubes e navios de passageiros muitas vezes têm DEA: saiba onde fica.' },
          { t: 'termos', ids: ['homem-ao-mar', 'hipotermia'] },
          { t: 'check', questoes: [
            Q('m12-l2-1', 'Primeiros socorros', 1, 'Na RCP de um adulto, as compressões devem ter qual profundidade e ritmo?',
              ['1 a 2 cm, 60 por minuto', '5 a 6 cm, 100 a 120 por minuto', '10 cm, 200 por minuto', 'Profundidade livre, 30 por minuto'], 1,
              'A orientação é afundar o peito 5 a 6 cm, num ritmo de 100 a 120 por minuto, deixando o peito voltar. Compressões rasas ou lentas não fazem o sangue circular. Profundidade excessiva e ritmo de 200 não permitem o enchimento do coração.',
              'St John Ambulance, CPR (adulto)', SJA_RCP),
            Q('m12-l2-2', 'Primeiros socorros', 2, 'Por que, no afogamento, a RCP começa com ventilações?',
              ['Porque a água no pulmão precisa ser soprada para fora', 'Porque a parada do afogado é causada pela falta de oxigênio', 'Porque compressões fazem mal ao afogado', 'Porque é mais fácil para o socorrista'], 1,
              'No afogamento o coração para por falta de oxigênio, então levar ar logo no início é prioridade: por isso as 5 ventilações iniciais. Não se trata de soprar água para fora (nem se deve tentar retirá-la com manobras). As compressões continuam indispensáveis depois. Facilidade não é o critério.',
              'St John Ambulance, Drowning', SJA_AFOG),
            Q('m12-l2-3', 'Primeiros socorros', 2, 'Uma pessoa caiu no rio e está se debatendo a 10 m do barco. A primeira atitude correta é:',
              ['Pular na água e nadar até ela', 'Jogar uma boia ou colete e aproximar o barco com o motor em neutro perto dela', 'Acelerar o barco na direção dela', 'Esperar ela se cansar e parar de se debater'], 1,
              'Jogar flutuação e aproximar o barco com cuidado, em neutro perto da pessoa, resolve sem criar outra vítima. Pular na água para salvar alguém em pânico é como muita gente se afoga. Acelerar na direção dela arrisca atropelá-la com casco ou hélice. Esperar é inaceitável.',
              'Transport for NSW, Person overboard', NSW_MOB)
          ] },
          { t: 'fontes', itens: [
            { txt: 'St John Ambulance, CPR (adulto): 5 a 6 cm, 100 a 120 por minuto, 30:2 ou só compressões', url: SJA_RCP },
            { txt: 'St John Ambulance, Drowning: 5 ventilações iniciais antes das compressões', url: SJA_AFOG },
            { txt: 'St John Ambulance, How to use a defibrillator (DEA)', url: SJA_DEA },
            { txt: 'NORMAM-211/DPC, art. 4.21, Nota (respiração boca a boca e garrote)', url: NORMAM, ref: 'extra-arrais-3-45' },
            { txt: 'Transport for NSW, Person overboard (não pular atrás da vítima; motor em neutro)', url: NSW_MOB }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'Sangramentos, cortes e fraturas', minutos: 10,
        objetivos: [
          'Controlar um sangramento com pressão direta e curativo compressivo.',
          'Saber quando e como usar o torniquete (garrote).',
          'Imobilizar uma fratura e reconhecer o estado de choque.'
        ],
        blocos: [
          { t: 'callout', tipo: 'seguranca', titulo: 'Leia antes', html: AVISO_CURSO },
          { t: 'p', html: 'A bordo há muitas formas de se cortar e se machucar: faca, anzol, ferragens, cabos que correm, catracas, a hélice. Saber parar um sangramento é o primeiro socorro que mais salva vidas depois da RCP.' },
          { t: 'h', txt: 'Sangramento: pressão direta' },
          { t: 'lista', ordenada: true, itens: [
            'Proteja-se: use luvas, se houver.',
            'Exponha o ferimento e <strong>pressione firme</strong> com gaze ou um pano limpo. A própria vítima pode pressionar enquanto você pega o material.',
            'Objeto cravado no ferimento: <strong>não retire</strong>. Ele pode estar tampando o sangramento. Pressione dos lados dele.',
            'Prenda o curativo com uma atadura firme, mas sem cortar a circulação: aperte uma unha além da atadura; se a cor não voltar em 2 segundos, afrouxe e refaça.',
            'Se o sangue atravessar o curativo, não o tire: coloque outro por cima e pressione mais.',
            'Peça ajuda e trate o choque.'
          ] },
          { t: 'h', txt: 'Torniquete (garrote)' },
          { t: 'p', html: 'O torniquete é para o <strong>sangramento catastrófico de braço ou perna</strong> (amputação, corte profundo de hélice) que a pressão direta não controla. Coloque-o perto e acima do ferimento, nunca sobre uma articulação, e aperte até o sangramento parar. Avise a vítima: dói. Depois de colocado, <strong>não afrouxe</strong>, porque o sangramento volta. Anote o horário e informe a equipe de resgate. A NORMAM-211 chama atenção para esse procedimento: aprenda-o num curso, com um torniquete de verdade.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Hélice', html: 'Os ferimentos de hélice estão entre os mais graves dos acidentes náuticos. A melhor prevenção: motor em neutro ou desligado sempre que houver alguém na água perto da popa, e nunca deixe ninguém subir pela escada de popa com o motor engrenado.' },
          { t: 'h', txt: 'Estado de choque' },
          { t: 'p', html: 'Perda grande de sangue (ou de líquidos por queimadura ou vômito) leva ao <strong>choque</strong>: pele pálida, fria e úmida, suor, pulso rápido e fraco, respiração rápida, náusea, sede, agitação. Trate a causa, deite a pessoa sobre algo que a isole do frio, levante as pernas (exceto se houver fratura nelas ou na bacia), afrouxe roupas apertadas, cubra-a e acalme-a. Peça ajuda.' },
          { t: 'h', txt: 'Fraturas' },
          { t: 'lista', itens: [
            'Mantenha a vítima quieta e <strong>apoie a parte machucada</strong> segurando acima e abaixo da lesão. Use enchimento (roupas, toalhas) para acomodar.',
            'Tire anéis, relógios e o que aperte o membro antes que ele inche.',
            'Fratura exposta (osso para fora ou ferimento sobre a fratura): cubra com curativo limpo e pressione em volta, não sobre o osso.',
            'Imobilize: braço numa tipoia; perna presa à outra com ataduras largas ou numa tala improvisada (um remo acolchoado, um pedaço de madeira).',
            'Suspeita de lesão na coluna ou no pescoço (queda de altura, mergulho em água rasa): não movimente a vítima, a menos que haja perigo imediato.'
          ] },
          { t: 'check', questoes: [
            Q('m12-l3-1', 'Primeiros socorros', 1, 'Qual é a primeira medida para controlar um corte que sangra muito no antebraço?',
              ['Lavar com água do mar e deixar sangrar', 'Pressionar firme o ferimento com gaze ou pano limpo', 'Aplicar um torniquete no pulso', 'Passar álcool e deixar descoberto'], 1,
              'Pressão direta firme é o primeiro passo e resolve a maioria dos sangramentos. Deixar sangrar leva ao choque. O torniquete fica para sangramento catastrófico que a pressão não controla, e nunca sobre articulação como o pulso. Álcool não estanca o sangue.',
              'St John Ambulance, Severe bleeding', SJA_SANG),
            Q('m12-l3-2', 'Primeiros socorros', 2, 'Um pedaço de metal ficou cravado na perna de um tripulante. O correto é:',
              ['Puxar o metal para fora de uma vez', 'Deixar o objeto e pressionar dos lados dele', 'Empurrar o objeto mais para dentro', 'Cobrir com gelo direto na pele'], 1,
              'O objeto pode estar tampando o sangramento: deixe-o e pressione em volta, depois prenda o curativo. Retirá-lo pode causar hemorragia. Empurrá-lo aumenta a lesão. Gelo não controla esse sangramento.',
              'St John Ambulance, Severe bleeding', SJA_SANG),
            Q('m12-l3-3', 'Primeiros socorros', 2, 'Depois de colocado um torniquete num sangramento catastrófico, deve-se:',
              ['Afrouxá-lo a cada 5 minutos para o sangue circular', 'Mantê-lo apertado, anotar o horário e informar o resgate', 'Retirá-lo assim que a pessoa parar de reclamar da dor', 'Colocá-lo sobre o joelho, que é mais firme'], 1,
              'Uma vez colocado, o torniquete não deve ser afrouxado, pois o sangramento recomeça; anote o horário para a equipe médica. Afrouxar periodicamente ou retirá-lo por causa da dor desfaz o controle. Ele nunca vai sobre uma articulação.',
              'St John Ambulance, Life-threatening bleed', SJA_TORN)
          ] },
          { t: 'fontes', itens: [
            { txt: 'St John Ambulance, Severe bleeding (pressão direta, objeto cravado, teste de circulação)', url: SJA_SANG },
            { txt: 'St John Ambulance, Life-threatening bleed (torniquete)', url: SJA_TORN },
            { txt: 'St John Ambulance, Shock', url: SJA_CHOQUE },
            { txt: 'St John Ambulance, Fractures and broken bones', url: SJA_FRAT },
            { txt: 'NORMAM-211/DPC, art. 4.21, Nota (aplicação de garrote)', url: NORMAM, ref: 'extra-arrais-3-45' }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Queimaduras, calor, desidratação e enjoo', minutos: 11,
        objetivos: [
          'Resfriar e cobrir uma queimadura do jeito certo.',
          'Diferenciar exaustão pelo calor de insolação e agir em cada caso.',
          'Prevenir e tratar o enjoo e a desidratação a bordo.'
        ],
        blocos: [
          { t: 'callout', tipo: 'seguranca', titulo: 'Leia antes', html: AVISO_CURSO },
          { t: 'h', txt: 'Queimaduras' },
          { t: 'p', html: 'No barco, as queimaduras vêm do fogão, da água fervendo com o barco jogando, do escapamento, do fogo e do sol. O mais importante é <strong>resfriar rápido e por bastante tempo</strong>.' },
          { t: 'lista', ordenada: true, itens: [
            'Ponha a área queimada sob <strong>água corrente fria por pelo menos 20 minutos</strong>, o quanto antes (vale até 3 horas depois). A bordo, use a água doce do tanque ou garrafas. Sem água corrente, use compressas molhadas trocadas sempre.',
            'Tire anéis, relógios e roupas próximas antes de inchar, mas <strong>não arranque</strong> o que estiver grudado na pele.',
            'Depois de resfriar, cubra com <strong>filme plástico</strong> de cozinha colocado por cima, sem enrolar apertado (a área vai inchar). Mão ou pé: um saco plástico limpo.',
            '<strong>Não</strong> use gelo, pasta de dente, manteiga, pomadas ou cremes, e não estoure as bolhas.',
            'Queimadura grande, profunda, no rosto, nas mãos, nos genitais, química ou elétrica: emergência. Peça ajuda.'
          ] },
          { t: 'callout', tipo: 'nota', titulo: 'Queimadura com combustível', html: 'Pele com gasolina ou diesel deve ser lavada com bastante água e sabão. Roupa encharcada de combustível sai do corpo, longe de chamas: ela pode pegar fogo e mantém o produto em contato com a pele.' },
          { t: 'h', txt: 'Calor: exaustão e insolação' },
          { t: 'tabela', cab: ['', 'Exaustão pelo calor', 'Insolação (intermação)'], linhas: [
            ['Sinais', 'cansaço, tontura, dor de cabeça, náusea, muito suor, pele pálida e úmida, cãibras, sede', 'temperatura muito alta (acima de 40 °C), pele quente e seca (sem suor), respiração e pulso rápidos, confusão, convulsão, desmaio'],
            ['Gravidade', 'melhora em cerca de 30 minutos com resfriamento e líquidos', '<strong>emergência médica</strong>'],
            ['O que fazer', 'sombra e lugar fresco, tirar roupa extra, muita água (ou soro de reidratação), molhar e abanar a pele', 'peça ajuda já; resfrie o mais rápido possível: sombra, lençol molhado ou água fria na pele, abanar, compressas frias nas axilas e no pescoço; posição lateral se desmaiar']
          ], legenda: 'Se a exaustão não melhorar em 30 minutos de descanso, resfriamento e líquidos, trate como insolação.' },
          { t: 'h', txt: 'Desidratação' },
          { t: 'p', html: 'Sol, vento, enjoo e esforço desidratam rápido no barco, e a sede aparece tarde. Beba água regularmente, mesmo sem sede. Desidratado: descanso à sombra, água ou outros líquidos claros, soro de reidratação oral. Evite álcool e cafeína. Quem vomita sem parar e não consegue segurar líquidos precisa de orientação médica.' },
          { t: 'h', txt: 'Enjoo' },
          { t: 'p', html: 'O enjoo acontece porque o ouvido interno sente o balanço que os olhos não veem (dentro da cabine, por exemplo). Ele pode deixar qualquer pessoa incapaz de ajudar, e quem vomita perde líquido e fica fraco, com frio e desatento: um risco de queda na água.' },
          { t: 'lista', itens: [
            '<strong>Prevenção</strong>: fique no meio do barco (onde ele balança menos) e ao ar livre, olhe para o horizonte, evite ler ou usar o celular, coma leve antes de sair, sem álcool. Gengibre ajuda algumas pessoas. Remédios contra enjoo (comprimidos ou adesivos) funcionam melhor tomados <strong>antes</strong> de embarcar: peça orientação ao farmacêutico ou médico, porque muitos dão sono.',
            '<strong>A bordo</strong>: assumir o leme ajuda, porque você antecipa os movimentos. Mantenha o enjoado aquecido, hidratado e no convés, de colete, preso à linha de vida se for um veleiro em mar aberto, e nunca sozinho na borda para vomitar.'
          ] },
          { t: 'check', questoes: [
            Q('m12-l4-1', 'Primeiros socorros', 1, 'Um tripulante queimou a mão na panela. O primeiro socorro correto é:',
              ['Passar manteiga ou pasta de dente', 'Pôr a mão sob água corrente fria por pelo menos 20 minutos', 'Pôr gelo direto na queimadura', 'Estourar as bolhas para aliviar'], 1,
              'Água corrente fria por pelo menos 20 minutos resfria os tecidos e limita a lesão. Manteiga, pasta e cremes retêm calor e aumentam o risco de infecção. Gelo lesa ainda mais a pele. Bolhas não devem ser estouradas.',
              'St John Ambulance, Burns and scalds; NHS, Burns and scalds', SJA_QUEIM),
            Q('m12-l4-2', 'Primeiros socorros', 2, 'Depois de horas ao sol, uma pessoa está confusa, com pele quente e seca e temperatura muito alta. Isso indica:',
              ['Exaustão pelo calor leve, basta descansar', 'Insolação, uma emergência: resfrie rapidamente e peça ajuda', 'Enjoo comum', 'Hipotermia'], 1,
              'Pele quente e seca, temperatura acima de 40 °C e confusão são sinais de insolação, emergência médica: resfriar o mais rápido possível e pedir ajuda. Na exaustão a pele fica úmida, com muito suor, e a pessoa não fica confusa. Enjoo e hipotermia têm outros sinais.',
              'NHS, Heat exhaustion and heatstroke; St John Ambulance, Heatstroke', SJA_INSOL),
            Q('m12-l4-3', 'Primeiros socorros', 1, 'Qual destas atitudes ajuda a <strong>prevenir</strong> o enjoo?',
              ['Ficar na cabine lendo um livro', 'Ficar no meio do barco, ao ar livre, olhando para o horizonte', 'Tomar uma cerveja para relaxar', 'Fazer uma refeição pesada antes de sair'], 1,
              'No meio do barco o movimento é menor, e olhar o horizonte faz os olhos confirmarem o que o ouvido sente. Ler dentro da cabine é o que mais provoca enjoo. Álcool e refeição pesada pioram.',
              'NHS, Motion sickness', NHS_ENJOO)
          ] },
          { t: 'fontes', itens: [
            { txt: 'St John Ambulance, Burns and scalds (20 minutos de água corrente fria, filme plástico, sem gelo nem cremes)', url: SJA_QUEIM },
            { txt: 'NHS, Burns and scalds (resfriar até 3 horas depois; quando é emergência)', url: NHS_QUEIM },
            { txt: 'NHS, Heat exhaustion and heatstroke', url: NHS_CALOR },
            { txt: 'St John Ambulance, Heatstroke (acima de 40 °C; resfriamento)', url: SJA_INSOL },
            { txt: 'St John Ambulance, Dehydration', url: SJA_DESID },
            { txt: 'NHS, Motion sickness', url: NHS_ENJOO }
          ] }
        ]
      },
      {
        id: 'l5', titulo: 'O kit de primeiros socorros e a ajuda à distância', minutos: 9,
        objetivos: [
          'Montar e conservar um kit de primeiros socorros adequado ao barco.',
          'Saber o que a NORMAM-211 recomenda sobre medicamentos a bordo.',
          'Conhecer os caminhos para conseguir orientação médica pelo rádio.'
        ],
        blocos: [
          { t: 'fato', ref: 'radio-92', html: 'A NORMAM-211 põe no comandante a responsabilidade pelos medicamentos e pelo material de primeiros socorros compatíveis com a área de navegação e com as pessoas a bordo, e recomenda que embarcações de mar aberto com menos de 15 pessoas tenham a caixa de medicamentos do Anexo 4-C (item I).' },
          { t: 'fato', ref: 'extra-arrais-3-46', html: 'A caixa de medicamentos do Anexo 4-C inclui, entre outros itens, paracetamol 500 mg, álcool 70% para assepsia, loção de calamina, clorpromazina 25 mg, antiácidos, solução antisséptica e xilocaína gel. Alguns deles só são vendidos com receita: monte a caixa com orientação de um médico.' },
          { t: 'h', txt: 'Um kit prático para um barco de recreio' },
          { t: 'tabela', cab: ['Para', 'Itens'], linhas: [
            ['Proteção', 'luvas descartáveis, máscara (barreira) para ventilação boca a boca, manta térmica aluminizada'],
            ['Ferimentos', 'gaze, compressas, ataduras de crepe, esparadrapo, curativos adesivos, soro fisiológico para lavar, tesoura de ponta romba, pinça'],
            ['Sangramento grave', 'torniquete comercial (e treino para usá-lo), curativo compressivo'],
            ['Queimaduras', 'filme plástico, compressas'],
            ['Fraturas', 'tala moldável, bandagem triangular (tipoia)'],
            ['Remédios (com orientação médica)', 'analgésico e antitérmico, antialérgico, remédio para enjoo, soro de reidratação oral, os remédios de uso contínuo de cada tripulante'],
            ['Outros', 'termômetro, protetor solar, repelente, lanterna de cabeça, um guia de primeiros socorros impresso ou o aplicativo baixado no celular']
          ], legenda: 'Sugestão didática. O conteúdo deve crescer com a distância da costa, o tempo longe de socorro e o número de pessoas.' },
          { t: 'lista', itens: [
            'Guarde o kit numa caixa <strong>estanque</strong>, num local conhecido de todos e fácil de pegar.',
            'Confira as validades a cada temporada e reponha o que foi usado.',
            'Antes de sair, pergunte à tripulação sobre alergias, doenças e remédios de uso contínuo. Anote.',
            'Baixe o aplicativo de primeiros socorros antes de embarcar: no meio da baía pode não haver sinal de internet.'
          ] },
          { t: 'h', txt: 'Ajuda médica à distância' },
          { t: 'p', html: 'Longe da costa, a melhor ferramenta é o rádio. Pelo VHF (canal 16) ou pelo telefone 185, o SALVAMAR pode orientar o atendimento e, se necessário, coordenar a evacuação do doente. Tenha à mão, ao chamar: posição, idade e sexo da vítima, o que aconteceu, sinais (consciência, respiração, pulso, temperatura) e o que já foi feito.' },
          { t: 'fato', ref: 'travessia-108', html: 'O SALVAMAR atende também emergências de saúde a bordo: pessoas que adoecem e precisam de orientação médica ou de evacuação para hospital em terra.' },
          { t: 'callout', tipo: 'intl', titulo: 'Trilha internacional', html: 'Para cruzeiros longos, a referência mundial é o <em>International Medical Guide for Ships</em> da Organização Mundial da Saúde (3ª edição), feito para quem cuida da saúde a bordo sem médico, com ênfase nas primeiras 48 horas. Regatas oceânicas (regras OSR da World Sailing) exigem tripulantes com certificado de primeiros socorros; o RYA First Aid, de um dia, é um dos cursos aceitos.', intl: true },
          { t: 'fato', ref: 'travessia-123', html: 'O guia médico da OMS para navios orienta diagnóstico, tratamento e prevenção de problemas de saúde a bordo, sobretudo para tripulantes responsáveis pelos cuidados médicos em navios sem médico.', intl: true },
          { t: 'check', questoes: [
            Q('m12-l5-1', 'Primeiros socorros', 1, 'Pela NORMAM-211, quem responde pelos medicamentos e pelo material de primeiros socorros compatíveis com a navegação?',
              ['A Agência Nacional de Vigilância Sanitária, que fiscaliza cada barco', 'O comandante da embarcação', 'O fabricante do barco', 'A farmácia que vendeu os remédios'], 1,
              'O art. 4.22 diz que a responsabilidade é do comandante. A Anvisa define a dotação de medicamentos, mas não monta o kit de cada barco. Fabricante e farmácia não respondem pela dotação a bordo.',
              'NORMAM-211/DPC, art. 4.22', NORMAM),
            Q('m12-l5-2', 'Primeiros socorros', 2, 'Num veleiro a 15 milhas da costa, um tripulante passa mal e não melhora. Qual o caminho mais adequado para conseguir orientação médica?',
              ['Esperar chegar ao porto no dia seguinte', 'Chamar pelo VHF canal 16 ou telefonar para o 185 (SALVAMAR)', 'Procurar a resposta em redes sociais', 'Dar todos os remédios do kit até algum funcionar'], 1,
              'O SALVAMAR atende emergências de saúde a bordo, com orientação médica e evacuação se preciso, pelo rádio ou pelo 185. Esperar pode agravar o quadro. Redes sociais não são orientação médica. Medicar às cegas é perigoso.',
              'SALVAMAR Brasil, perguntas frequentes', SALVAMAR_FAQ),
            Q('m12-l5-3', 'Primeiros socorros', 1, 'Qual cuidado com o kit de primeiros socorros é o mais importante a bordo?',
              ['Deixá-lo trancado no porão para não molhar', 'Guardá-lo em caixa estanque, em local conhecido e de fácil acesso, conferindo as validades', 'Levar só remédios, porque curativos ocupam espaço', 'Mantê-lo na bolsa do comandante'], 1,
              'O kit precisa estar seco, à mão e completo, e todos devem saber onde fica. Trancado no porão ou na bolsa de uma pessoa, ele não aparece na hora da emergência. Curativos são tão importantes quanto remédios.',
              'NORMAM-211/DPC, art. 4.22; boas práticas de primeiros socorros', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.22 (medicamentos e material de primeiros socorros)', url: NORMAM, ref: 'radio-92' },
            { txt: 'NORMAM-211/DPC, Anexo 4-C (caixa de medicamentos)', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/NORMAM-211-Anexos_0.zip', ref: 'extra-arrais-3-46' },
            { txt: 'SALVAMAR Brasil, perguntas frequentes (emergências de saúde a bordo)', url: SALVAMAR_FAQ, ref: 'travessia-108' }
          ] },
          { t: 'fontes', intl: true, itens: [
            { txt: 'OMS, International Medical Guide for Ships, 3ª ed.', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-123' },
            { txt: 'RYA First Aid Course', url: 'https://www.rya.org.uk/course-finder/first-aid-course/', ref: 'radio-89' }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 13 — Rádio VHF
     Programa: 3.1 h); treinamento teórico 1.5 e 1.6; prático 2.1 (uso do VHF).
     ===================================================================================== */
  var ANATEL_GMDSS = 'https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo/em-1979-a-organizacao-maritima-internacional-imo-reconhecendo-a-necessidade-de-implementar-o-sistema-de-comunicacao-maritima-decidiu-dar-inicio-a-implantacao-de-um-novo-sistema-de-socorro-e-seguranca-conhecido-como-sistema-global-de-socorro-e-seguranca';
  var ANATEL_APOIO = 'https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6';
  var ANATEL_OPER = 'https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista';
  var ANATEL_SMM = 'https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo';
  var RGST = 'https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777';
  var UIT_RR = 'https://www.itu.int/pub/R-REG-RR';
  var NSW_ALERTA = 'https://www.nsw.gov.au/driving-boating-and-transport/waterways-safety-and-rules/emergencies/alerting-rescue-services';

  M.push({
    id: 'm13', titulo: 'Rádio VHF',
    resumo: 'O transceptor VHF fixo e portátil, os canais 16 e 70, a chamada de rotina, o alfabeto fonético e as mensagens de socorro, urgência e segurança.',
    licoes: [
      {
        id: 'l1', titulo: 'O VHF marítimo: fixo e portátil', minutos: 10,
        objetivos: [
          'Explicar por que o alcance do VHF depende da altura das antenas.',
          'Conhecer os controles de um transceptor VHF.',
          'Saber o que a NORMAM-211 pede do VHF fixo e do portátil.'
        ],
        blocos: [
          { t: 'p', html: 'O <strong>VHF marítimo</strong> é o rádio de bordo: um <strong>transceptor</strong> (transmite e recebe) que trabalha na faixa de 156 a 162 MHz. É com ele que você chama a marina, fala com outro barco, ouve avisos de mau tempo e, numa emergência, pede socorro. Diferente do celular, uma chamada no VHF é ouvida <strong>ao mesmo tempo</strong> por todos os barcos e estações em volta, inclusive por quem pode ajudar.' },
          { t: 'h', txt: 'Alcance: linha de visada' },
          { t: 'p', html: 'O VHF se propaga em <strong>linha de visada</strong>: o sinal vai quase em linha reta e é barrado pela curvatura da Terra, por morros e prédios. Por isso o alcance depende sobretudo da <strong>altura das antenas</strong>, e não tanto da potência. Duas lanchas com antena baixa conversam a poucas milhas. Uma estação costeira, com antena alta num morro, ouve muito mais longe: a <strong>área A1</strong> do sistema mundial de socorro (GMDSS) é justamente a que está dentro da cobertura de VHF de uma estação costeira, com alerta DSC contínuo. Como ordem de grandeza, a página da Anatel sobre o GMDSS fala em cerca de 20 milhas da costa, e o material de apoio ao exame da Anatel fala em 30 a 50 milhas. Os números diferem porque quem define a área real é cada país, conforme a cobertura das suas estações costeiras.' },
          { t: 'figura', svg: svg('0 0 360 170', 'Alcance do VHF: o sinal em linha reta entre as antenas é barrado pela curvatura da Terra; antenas mais altas alcançam mais longe',
            '<path d="M0 150 Q180 92 360 150" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<line x1="40" y1="135" x2="40" y2="70" stroke="currentColor" stroke-width="3"/><circle cx="40" cy="68" r="4" fill="var(--magenta)"/>' +
            '<text x="40" y="58" text-anchor="middle" font-size="12.5" fill="currentColor">estação costeira</text>' +
            '<line x1="300" y1="134" x2="300" y2="120" stroke="currentColor" stroke-width="2"/><circle cx="300" cy="118" r="3" fill="var(--magenta)"/>' +
            '<path d="M286 136 L314 136 L310 142 L290 142 Z" fill="currentColor"/>' +
            '<text x="300" y="164" text-anchor="middle" font-size="12.5" fill="currentColor">lancha</text>' +
            '<line x1="40" y1="68" x2="300" y2="118" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 4"/>' +
            '<line x1="200" y1="128" x2="300" y2="118" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>' +
            '<line x1="180" y1="120" x2="200" y2="128" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>' +
            '<text x="180" y="40" text-anchor="middle" font-size="13" fill="currentColor">linha de visada</text>' +
            '<text x="190" y="152" text-anchor="middle" font-size="12.5" fill="currentColor">curvatura da Terra</text>'),
            legenda: 'Antenas altas "enxergam" mais longe. É por isso que o VHF de um veleiro com antena no topo do mastro alcança mais que um portátil na mão.' },
          { t: 'h', txt: 'Fixo e portátil' },
          { t: 'fato', ref: 'normas-149', html: 'O transceptor VHF <strong>fixo</strong> deve ter potência mínima de <strong>25 W</strong>.' },
          { t: 'fato', ref: 'normas-173', html: 'O VHF <strong>portátil</strong> deve ter bateria para pelo menos <strong>quatro horas</strong> de operação, num ciclo de 1 minuto transmitindo para 9 escutando.' },
          { t: 'p', html: 'O fixo tem mais potência, usa a energia do barco e a antena alta: é o principal. O portátil é estanque (os bons flutuam), vai no bote, no colete e na bolsa de abandono, e funciona mesmo sem energia a bordo, mas com alcance menor.' },
          { t: 'fato', ref: 'normas-157', html: 'Veleiros com antena de VHF no topo do mastro devem ter uma <strong>antena de emergência</strong>, para o caso de o mastro quebrar.' },
          { t: 'h', txt: 'Os controles' },
          { t: 'figura', svg: svg('0 0 360 190', 'Painel de um transceptor VHF com mostrador do canal, botões de canal 16, potência alta e baixa, escuta dupla, silenciador, volume e o botão de socorro DSC protegido por tampa',
            '<rect x="10" y="20" width="340" height="120" rx="12" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="28" y="38" width="130" height="56" rx="6" fill="var(--surface)" stroke="currentColor"/>' +
            '<text x="93" y="78" text-anchor="middle" font-size="30" font-weight="700" fill="currentColor">16</text><text x="140" y="56" text-anchor="end" font-size="12.5" fill="currentColor">25 W</text>' +
            '<rect x="175" y="40" width="40" height="24" rx="5" fill="var(--surface)" stroke="currentColor"/><text x="195" y="57" text-anchor="middle" font-size="13" fill="currentColor">16</text>' +
            '<rect x="222" y="40" width="40" height="24" rx="5" fill="var(--surface)" stroke="currentColor"/><text x="242" y="57" text-anchor="middle" font-size="13" fill="currentColor">H/L</text>' +
            '<rect x="269" y="40" width="64" height="24" rx="5" fill="var(--surface)" stroke="currentColor"/><text x="301" y="57" text-anchor="middle" font-size="13" fill="currentColor">DUAL</text>' +
            '<circle cx="200" cy="108" r="17" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><circle cx="252" cy="108" r="17" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>' +
            '<rect x="286" y="88" width="48" height="40" rx="6" fill="var(--nav-red)" stroke="currentColor" stroke-width="2"/><text x="310" y="113" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--nav-white)">SOS</text>' +
            '<rect x="28" y="104" width="130" height="22" rx="4" fill="currentColor" opacity="0.15"/><text x="93" y="120" text-anchor="middle" font-size="12.5" fill="currentColor">microfone (PTT)</text>' +
            '<g font-size="12.5" fill="currentColor" text-anchor="middle"><text x="200" y="158">silenciador</text><text x="200" y="174">(squelch)</text><text x="252" y="158">volume</text><text x="310" y="158">DSC socorro</text><text x="310" y="174">(sob tampa)</text></g>'),
            legenda: 'Os nomes variam de um fabricante para outro, mas as funções são as mesmas.' },
          { t: 'lista', itens: [
            '<strong>Canal</strong> e tecla <strong>16</strong>: escolhe o canal; a tecla 16 leva direto ao canal de socorro e chamada.',
            '<strong>Volume</strong> e <strong>silenciador (squelch)</strong>: o silenciador corta o chiado de fundo. Gire até o chiado sumir, e não além, senão você deixa de ouvir chamadas fracas.',
            '<strong>Potência alta e baixa (H/L)</strong>: use a baixa para falar com quem está perto (no cais, na marina). As estações devem limitar a potência ao mínimo necessário, para não interferir nas outras.',
            '<strong>Escuta dupla (DUAL)</strong>: vigia o canal 16 enquanto você ouve outro canal.',
            '<strong>Botão de socorro DSC</strong>: protegido por tampa, envia um alerta digital de socorro com a identificação do barco (MMSI) e, se ligado ao GPS, a posição.',
            '<strong>Microfone (PTT)</strong>: aperte para falar, solte para ouvir. Enquanto você aperta, não ouve ninguém.'
          ] },
          { t: 'termos', ids: ['vhf', 'dsc', 'mmsi', 'canal-16'] },
          { t: 'check', questoes: [
            Q('m13-l1-1', 'Comunicações VHF', 1, 'O que mais aumenta o alcance de um rádio VHF marítimo?',
              ['Falar mais alto no microfone', 'A altura das antenas', 'Usar o canal 16', 'Ligar o silenciador no máximo'], 1,
              'O VHF trabalha em linha de visada: quanto mais altas as antenas, mais longe elas "se enxergam" sobre a curvatura da Terra. Falar alto não muda o alcance. O canal não muda a propagação. Silenciador no máximo só faz você deixar de ouvir sinais fracos.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.8', ANATEL_APOIO),
            Q('m13-l1-2', 'Comunicações VHF', 1, 'Pela NORMAM-211, qual a potência mínima do transceptor VHF fixo?',
              ['1 W', '5 W', '25 W', '100 W'], 2,
              'O art. 4.23.2 fixa a potência mínima do VHF fixo em 25 W. 1 W e 5 W são potências típicas de portáteis ou do modo de potência baixa. 100 W não é exigência para VHF.',
              'NORMAM-211/DPC, art. 4.23.2', NORMAM),
            Q('m13-l1-3', 'Comunicações VHF', 2, 'Por que um veleiro com antena de VHF no topo do mastro deve ter antena de emergência?',
              ['Para falar em dois canais ao mesmo tempo', 'Para continuar comunicando se o mastro quebrar', 'Porque o VHF portátil é proibido em veleiros', 'Para aumentar a potência para 50 W'], 1,
              'A NORMAM-211 exige a antena de emergência justamente para o caso de quebra do mastro, quando a antena principal se perde. Ela não permite dois canais ao mesmo tempo nem aumenta a potência. O portátil não é proibido.',
              'NORMAM-211/DPC, art. 4.24.2', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.23 (equipamentos de radiocomunicação: VHF fixo e portátil)', url: NORMAM, ref: 'normas-149' },
            { txt: 'NORMAM-211/DPC, art. 4.24.2 (antena de emergência)', url: NORMAM, ref: 'normas-157' },
            { txt: 'Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03): equipamentos, linha de visada, área A1 (30 a 50 milhas), DSC e potência mínima necessária', url: ANATEL_APOIO },
            { txt: 'Anatel, página do Serviço Móvel Marítimo sobre o GMDSS: definição das áreas A1 (cerca de 20 milhas) e A2', url: ANATEL_GMDSS }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Canais: 16, 70 e os de trabalho', minutos: 9,
        objetivos: [
          'Saber em que canal ficar em escuta enquanto navega.',
          'Usar o canal 16 só para chamar e para emergências.',
          'Escolher um canal de trabalho para a conversa.'
        ],
        blocos: [
          { t: 'fato', ref: 'normas-150', html: 'Navegando, o VHF deve ficar <strong>ligado e em escuta no canal 16</strong> (156,8 MHz), ou no <strong>canal 70</strong> (156,525 MHz) se o rádio tiver DSC.' },
          { t: 'tabela', cab: ['Canal', 'Para que serve'], linhas: [
            ['<strong>16</strong> (156,8 MHz)', 'Socorro, urgência, segurança e chamada. É o canal que todos escutam. Chame nele e mude para um canal de trabalho para conversar.'],
            ['<strong>70</strong> (156,525 MHz)', 'Só para chamadas digitais DSC (alertas de socorro e chamadas seletivas). <strong>Não se fala</strong> no canal 70.'],
            ['<strong>6</strong>', 'Entre embarcações; também usado na coordenação de busca e salvamento entre navios e aeronaves.'],
            ['<strong>13</strong>', 'Segurança da navegação entre embarcações (passadiço a passadiço): combinar manobras, avisar que vai cruzar um canal.'],
            ['8, 72, 77 e outros', 'Canais de comunicação entre embarcações, bons para conversas de trabalho.'],
            ['Canais locais', 'Marinas, iates clubes, praticagem e portos têm canais próprios, informados por eles e nas normas da Capitania (NPCP).']
          ], legenda: 'Canais do plano internacional de VHF marítimo (UIT, Regulamento de Radiocomunicações, Apêndice 18). Confira os canais usados na sua região com a marina e a Capitania.' },
          { t: 'h', txt: 'A disciplina do canal 16' },
          { t: 'lista', itens: [
            'O 16 é para <strong>chamar</strong>. Feito o contato, mude para um canal de trabalho combinado. A Anatel orienta que a chamada no 16 não passe de 1 minuto, exceto em socorro, urgência ou segurança.',
            'Antes de transmitir, <strong>escute</strong>: não atropele uma conversa em andamento, muito menos um pedido de socorro.',
            'É proibido testar alarme no canal 16, transmitir música, sinais contínuos ou conversas que não sejam do serviço marítimo.',
            'Se alguém está em perigo no 16, fique em silêncio, ouça e anote. Você pode ser a embarcação mais próxima.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Simplex', html: 'No VHF marítimo, entre barcos, só um fala de cada vez: quem aperta o botão do microfone ocupa o canal. Por isso cada fala termina com "câmbio" e é preciso soltar o botão para ouvir a resposta.' },
          { t: 'termos', ids: ['canal-16', 'canal-70', 'dsc'] },
          { t: 'check', questoes: [
            Q('m13-l2-1', 'Comunicações VHF', 1, 'Em qual canal o VHF deve ficar em escuta durante a navegação, se o rádio não tiver DSC?',
              ['Canal 9', 'Canal 13', 'Canal 16', 'Canal 70'], 2,
              'A NORMAM-211 manda manter escuta no canal 16 (156,8 MHz); o 70 é para rádios com DSC, que vigiam alertas digitais. O 13 é de segurança da navegação entre embarcações e o 9 não é o canal de escuta obrigatória.',
              'NORMAM-211/DPC, art. 4.23.4 a)', NORMAM),
            Q('m13-l2-2', 'Comunicações VHF', 2, 'Para que serve o canal 70?',
              ['Para conversas longas entre amigos', 'Para chamadas digitais DSC; não se transmite voz nele', 'Para pedir socorro por voz', 'Para falar com a marina'], 1,
              'O canal 70 (156,525 MHz) é reservado às chamadas seletivas digitais (DSC), inclusive alertas de socorro: não se fala nele. Socorro por voz é no 16. Conversas e contato com a marina vão para canais de trabalho.',
              'NORMAM-211/DPC, art. 4.23.4 a); UIT, RR, Apêndice 18', NORMAM),
            Q('m13-l2-3', 'Comunicações VHF', 2, 'Você chamou um amigo no canal 16 e ele respondeu. O que fazer?',
              ['Conversar no 16, que todos escutam', 'Combinar um canal de trabalho e mudar para ele', 'Desligar e telefonar', 'Passar para o canal 70'], 1,
              'O 16 é só para chamar e para emergências: feito o contato, combine e mude para um canal de trabalho entre embarcações. Conversar no 16 bloqueia o canal de socorro. Telefonar não é necessário. O 70 não aceita voz.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.2', ANATEL_APOIO)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.23.4 (escuta nos canais 16 e 70)', url: NORMAM, ref: 'normas-150' },
            { txt: 'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.2 (156,8 MHz: chamada e socorro; limite de 1 minuto) e 2.1.9.5 (disciplina)', url: ANATEL_APOIO },
            { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 18 (tabela de canais do VHF marítimo)', url: UIT_RR }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'Chamada de rotina e alfabeto fonético', minutos: 11,
        objetivos: [
          'Fazer uma chamada de rotina completa, do 16 ao canal de trabalho.',
          'Usar as palavras de procedimento (câmbio, terminado, repita).',
          'Soletrar nomes e números com o alfabeto fonético internacional.'
        ],
        blocos: [
          { t: 'p', html: 'Rádio marítimo tem um jeito próprio de falar: curto, claro e sempre na mesma ordem. Isso evita mal-entendidos com chiado, vento e sotaques diferentes, e libera o canal rápido.' },
          { t: 'h', txt: 'A chamada de rotina' },
          { t: 'lista', ordenada: true, itens: [
            'Escute o canal antes. Ninguém falando? Aperte o microfone, espere um segundo e fale devagar, com o microfone a uns 5 cm da boca.',
            'Chame: <strong>nome de quem você chama</strong> (até três vezes), <strong>"aqui"</strong>, <strong>seu nome</strong> (até três vezes), e "câmbio".',
            'Quando responderem, proponha um canal de trabalho e mudem.',
            'No canal de trabalho, chame de novo uma vez e dê a mensagem, curta. Termine cada fala com <strong>"câmbio"</strong>.',
            'Ao encerrar, diga <strong>"terminado"</strong>. Volte a escutar o 16.'
          ] },
          { t: 'figura', svg: svg('0 0 360 260', 'Exemplo de diálogo de rotina pelo VHF entre o veleiro Maresia e a Marina Boa Vista, com mudança do canal 16 para o canal 72',
            '<g font-size="13" fill="currentColor">' +
            '<rect x="10" y="10" width="270" height="44" rx="10" fill="var(--sea-1)" stroke="currentColor"/><text x="20" y="28">Marina Boa Vista, Marina Boa Vista,</text><text x="20" y="45">aqui veleiro Maresia. Câmbio. (16)</text>' +
            '<rect x="80" y="64" width="270" height="44" rx="10" fill="var(--magenta)" fill-opacity="0.12" stroke="var(--magenta)"/><text x="90" y="82">Maresia, aqui Marina Boa Vista.</text><text x="90" y="99">Passe para o canal 72. Câmbio.</text>' +
            '<rect x="10" y="118" width="270" height="28" rx="10" fill="var(--sea-1)" stroke="currentColor"/><text x="20" y="137">Canal 72. Câmbio.</text>' +
            '<rect x="10" y="156" width="270" height="44" rx="10" fill="var(--sea-1)" stroke="currentColor"/><text x="20" y="174">Boa Vista, Maresia. Chegada em</text><text x="20" y="191">30 minutos, pedimos vaga. Câmbio. (72)</text>' +
            '<rect x="80" y="210" width="270" height="44" rx="10" fill="var(--magenta)" fill-opacity="0.12" stroke="var(--magenta)"/><text x="90" y="228">Maresia, vaga no píer B.</text><text x="90" y="245">Boa Vista, terminado.</text></g>'),
            legenda: 'Nomes fictícios. A chamada no 16 é curta e só serve para combinar o canal de trabalho.' },
          { t: 'h', txt: 'Palavras de procedimento' },
          { t: 'tabela', cab: ['Palavra', 'Significa'], linhas: [
            ['<strong>Câmbio</strong>', 'Terminei de falar e espero sua resposta.'],
            ['<strong>Terminado</strong>', 'Fim da comunicação, não espero resposta. (Também se usa o código VA, VICTOR ALFA.)'],
            ['<strong>Repita</strong>', 'Não entendi, repita a mensagem (ou a parte indicada).'],
            ['<strong>Correção</strong>', 'Errei; a versão certa é a que vem a seguir.'],
            ['<strong>Aguarde</strong>', 'Espere, já respondo.'],
            ['<strong>Recebido</strong>', 'Recebi e entendi sua mensagem.']
          ] },
          { t: 'h', txt: 'O alfabeto fonético' },
          { t: 'p', html: 'Para soletrar o nome do barco, o indicativo de chamada ou uma posição, usa-se o <strong>alfabeto fonético internacional</strong>, em que cada letra tem uma palavra-código: A = ALFA, B = BRAVO, C = CHARLIE… Ele padroniza a pronúncia e evita confusão entre letras parecidas (B, D, P, T, V). Os algarismos também têm palavras próprias. Treine abaixo: escreva o nome de um barco e ouça como soletrar.' },
          { t: 'widget', w: 'alfabeto-fonetico', opts: { modo: 'soletrar', texto: 'Maresia PQ7310' }, legenda: 'Alfabeto fonético da UIT (Regulamento de Radiocomunicações, Apêndice 14). Use as abas para estudar a tabela e treinar contra o relógio.' },
          { t: 'callout', tipo: 'nota', titulo: 'Identifique-se sempre', html: 'Em toda comunicação diga quem você é: nome do barco e, se tiver, o indicativo de chamada recebido na licença da estação. Quem recebe uma chamada e tem dúvida de quem está chamando deve responder e pedir que repita a identificação.' },
          { t: 'termos', ids: ['alfabeto-fonetico', 'indicativo-de-chamada'] },
          { t: 'check', questoes: [
            Q('m13-l3-1', 'Comunicações VHF', 1, 'Ao terminar uma comunicação e não esperar mais resposta, você diz:',
              ['Câmbio', 'Terminado', 'Repita', 'Aguarde'], 1,
              'A Anatel indica que o fim de trabalho entre duas estações é marcado pela palavra "Terminado" (ou VICTOR ALFA). "Câmbio" pede resposta. "Repita" pede que a mensagem seja repetida. "Aguarde" pede para esperar.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.8', ANATEL_APOIO),
            Q('m13-l3-2', 'Comunicações VHF', 1, 'No alfabeto fonético internacional, as letras <strong>T</strong> e <strong>R</strong> são:',
              ['TOMATE e RIO', 'TANGO e ROMEO', 'TEXAS e ROMA', 'TÁXI e RÁDIO'], 1,
              'T é TANGO e R é ROMEO, como na abreviatura TR (TANGO ROMEO) citada no material da Anatel. As outras palavras não fazem parte do alfabeto e geram confusão no rádio.',
              'UIT, RR, Apêndice 14; Anatel, Material de apoio, item 2.1.9.1', ANATEL_APOIO),
            Q('m13-l3-3', 'Comunicações VHF', 2, 'Qual é a ordem correta de uma chamada de rotina?',
              ['Seu nome, "aqui", nome de quem você chama', 'Nome de quem você chama, "aqui", seu nome, "câmbio"', 'Só o seu nome, três vezes', '"Terminado", seu nome, nome de quem você chama'], 1,
              'Primeiro quem é chamado (até três vezes), depois "aqui" e o seu nome, e "câmbio" para passar a palavra. Inverter a ordem confunde quem escuta. Só o seu nome não diz com quem você quer falar. "Terminado" encerra a comunicação.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, itens 2.1.9.6 a 2.1.9.8', ANATEL_APOIO)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Anatel, Material de apoio ao exame de Radiotelefonista (2026-03): alfabeto fonético (2.1.9.1), identificação (2.1.9.6) e fim de trabalho (2.1.9.8)', url: ANATEL_APOIO },
            { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 14 (alfabeto fonético)', url: UIT_RR }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Socorro, urgência e segurança', minutos: 13,
        objetivos: [
          'Distinguir MAYDAY, PAN PAN e SECURITÉ e quando usar cada um.',
          'Transmitir uma mensagem de socorro completa, na ordem certa.',
          'Usar o alerta DSC e saber o que fazer ao ouvir um pedido de socorro.'
        ],
        blocos: [
          { t: 'p', html: 'Três palavras dão prioridade a uma mensagem sobre todas as outras. As comunicações sobre segurança da vida humana no mar têm <strong>prioridade absoluta</strong>.' },
          { t: 'tabela', cab: ['Palavra', 'Quando usar', 'Exemplos'], linhas: [
            ['<strong>MAYDAY</strong> (socorro)', 'Perigo <strong>grave e iminente</strong>, com necessidade de auxílio imediato.', 'barco afundando, incêndio fora de controle, pessoa ao mar que não se consegue recuperar, vítima em parada cardíaca'],
            ['<strong>PAN PAN</strong> (urgência)', 'Situação urgente relativa à segurança de uma embarcação ou pessoa, <strong>sem perigo grave iminente</strong>.', 'motor parado à deriva longe de perigo, tripulante doente precisando de orientação médica, avaria no leme'],
            ['<strong>SECURITÉ</strong> (segurança)', 'Aviso importante para a <strong>segurança da navegação</strong>.', 'tronco ou contêiner à deriva, boia apagada, aviso de mau tempo, rede de pesca atravessada num canal']
          ], legenda: 'Cada palavra é repetida três vezes no início da mensagem. MAYDAY vem do francês "m’aider" (me ajude), e a Anatel orienta pronunciá-lo como a expressão francesa.' },
          { t: 'h', txt: 'A mensagem de socorro (MAYDAY)' },
          { t: 'p', html: 'Fale devagar e com clareza, no canal 16, potência alta. Tenha a mensagem escrita perto do rádio, porque no aperto a gente esquece. A ordem:' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>MAYDAY, MAYDAY, MAYDAY</strong>.',
            '<strong>Aqui</strong> + nome da embarcação três vezes (e indicativo de chamada ou MMSI, se tiver).',
            '<strong>MAYDAY</strong> + nome da embarcação.',
            '<strong>Posição</strong>: latitude e longitude do GPS, ou marcação e distância de um ponto conhecido ("2 milhas ao sul da ponta de Itapuã").',
            '<strong>Natureza do perigo</strong>: o que está acontecendo ("incêndio no motor", "entrando água, afundando").',
            '<strong>Auxílio necessário</strong>: o que você precisa ("socorro imediato", "evacuação").',
            '<strong>Outras informações</strong>: número de pessoas a bordo, feridos, tipo e cor do barco, se vão abandonar para a balsa.',
            '<strong>Câmbio</strong>. Solte o microfone e escute. Sem resposta, repita.'
          ] },
          { t: 'callout', tipo: 'nota', titulo: 'Exemplo', html: '"MAYDAY, MAYDAY, MAYDAY. Aqui lancha Sereia, lancha Sereia, lancha Sereia. MAYDAY lancha Sereia. Posição: uma milha a leste da ilha do Mel. Entrando água pelo casco, afundando. Pedimos socorro imediato. Quatro pessoas a bordo, todas de colete. Lancha branca de 7 metros. Câmbio."' },
          { t: 'h', txt: 'O alerta DSC' },
          { t: 'p', html: 'Num rádio com DSC, o botão de socorro envia em poucos segundos um alerta digital com a identificação do barco (MMSI) e a posição, se o rádio estiver ligado ao GPS. Ele dispara alarme automático em todos os rádios DSC e estações costeiras ao alcance. Levante a tampa, mantenha o botão apertado até o rádio confirmar o envio (o manual diz quantos segundos) e, em seguida, <strong>transmita o MAYDAY por voz no canal 16</strong>. Disparou sem querer? Cancele pelo menu do rádio e avise imediatamente no canal 16 que foi um alarme falso.' },
          { t: 'widget', w: 'vhf-sim', opts: {}, legenda: 'Simulador de VHF: treine a chamada de rotina, a escolha do canal e as mensagens MAYDAY, PAN PAN e SECURITÉ.' },
          { t: 'h', txt: 'Ouviu um MAYDAY?' },
          { t: 'lista', itens: [
            '<strong>Pare de transmitir</strong> no canal e escute. Anote a posição, o nome e o problema.',
            'Espere a estação costeira, a Capitania ou o SALVAMAR responder. Se ninguém responder e você puder ajudar, responda e diga o que pode fazer e em quanto tempo chega.',
            'Se você ouvir um pedido de socorro que ninguém responde e não puder ajudar diretamente, retransmita a mensagem (MAYDAY RELAY) para alcançar quem possa.',
            'Quem coordena o socorro pode pedir silêncio no canal com <strong>SILENCE MAYDAY</strong>: a partir daí, só fala quem está envolvido no socorro.'
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'Sem rádio?', html: 'Pelo telefone, ligue <strong>185</strong> (SALVAMAR). Use também os sinais visuais de perigo: pirotécnicos e os braços estendidos subindo e descendo lentamente.' },
          { t: 'termos', ids: ['mayday', 'pan-pan', 'securite', 'salvamar', 'dsc'] },
          { t: 'check', questoes: [
            Q('m13-l4-1', 'Comunicações VHF', 1, 'O motor da sua lancha parou e ela está à deriva numa área sem perigo próximo, com tempo bom. Que tipo de mensagem usar para pedir reboque?',
              ['MAYDAY', 'PAN PAN', 'SECURITÉ', 'Nenhuma: use uma chamada de rotina para um amigo'], 1,
              'É uma situação urgente, sem perigo grave e iminente: PAN PAN. MAYDAY fica para perigo grave e iminente (afundando, fogo). SECURITÉ é aviso à navegação. Uma chamada de rotina também é possível para um conhecido, mas a mensagem de urgência é a resposta que o programa cobra para essa situação de segurança.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.3', ANATEL_APOIO),
            Q('m13-l4-2', 'Comunicações VHF', 2, 'Na mensagem de socorro, o que vem logo depois da identificação da embarcação?',
              ['O número de pessoas a bordo', 'A posição', 'A cor do barco', 'O nome do comandante'], 1,
              'Pela ordem indicada pela Anatel: sinal de socorro, identificação, posição, natureza do perigo, auxílio necessário e outras informações. A posição vem cedo porque, se a comunicação cair, é o dado mais importante para o resgate. Número de pessoas e cor do barco entram em "outras informações". O nome do comandante não é necessário.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.3', ANATEL_APOIO),
            Q('m13-l4-3', 'Comunicações VHF', 2, 'Você vê um tronco grande flutuando no meio do canal de acesso a um porto. Qual mensagem transmitir?',
              ['MAYDAY', 'PAN PAN', 'SECURITÉ', 'Nenhuma, o problema não é seu'], 2,
              'Um objeto à deriva que ameaça a navegação pede um aviso de segurança: SECURITÉ. Não há perigo grave e iminente para você (MAYDAY) nem urgência com seu barco (PAN PAN). Avisar os outros faz parte da boa marinharia.',
              'Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.3', ANATEL_APOIO),
            Q('m13-l4-4', 'Comunicações VHF', 2, 'Você aperta sem querer o botão de socorro DSC. O que fazer?',
              ['Desligar o rádio e não falar nada', 'Cancelar o alerta pelo rádio e avisar no canal 16 que foi alarme falso', 'Esperar o resgate chegar para explicar', 'Mandar outro alerta para anular o primeiro'], 1,
              'O alerta falso deve ser cancelado e anunciado logo no canal 16, para ninguém iniciar uma busca à toa. Desligar o rádio deixa o alerta no ar e todos sem notícia. Esperar o resgate desperdiça recursos de busca. Outro alerta só aumenta a confusão.',
              'RIPEAM, Anexo IV, item 2 (uso indevido de sinais de perigo); boa prática de operação DSC', RIPEAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Anatel, Material de apoio ao exame de Radiotelefonista, itens 2.1.9.3 (MAYDAY, PAN PAN, SECURITÉ), 2.1.9.5 (SILENCE MAYDAY) e 2.2.6 (DSC)', url: ANATEL_APOIO },
            { txt: 'Transport for NSW, Alerting rescue services (exemplo de mensagem MAYDAY e PAN PAN; retransmissão)', url: NSW_ALERTA },
            { txt: 'RIPEAM-72, Anexo IV (MAYDAY e alerta DSC como sinais de perigo)', url: RIPEAM, ref: 'tecnico-87' },
            { txt: 'SALVAMAR: telefone 185', url: 'https://www.marinha.mil.br/cpm/185', ref: 'radio-48' }
          ] }
        ]
      },
      {
        id: 'l5', titulo: 'Licença da estação, MMSI e certificado', minutos: 8,
        objetivos: [
          'Saber que o rádio de bordo precisa de licença da estação na Anatel.',
          'Entender o que são o indicativo de chamada e o MMSI.',
          'Diferenciar a licença da estação do certificado de operador.'
        ],
        blocos: [
          { t: 'p', html: 'O rádio marítimo é regulado pela Anatel, a agência de telecomunicações. Há duas coisas diferentes: a <strong>licença da estação</strong> (o rádio do barco) e o <strong>certificado do operador</strong> (a pessoa).' },
          { t: 'h', txt: 'Licença da estação' },
          { t: 'fato', ref: 'normas-152', html: 'Embarcações com equipamento de radiocomunicação devem obter a <strong>Licença de Estação de Navio</strong> na Anatel.' },
          { t: 'fato', ref: 'radio-28', html: 'Pela Anatel, o licenciamento passa por: cadastro no SEI, procuração eletrônica (se houver representante), acesso ao sistema Mosaico com a conta gov.br, autorização do Serviço de Interesse Restrito e licenciamento da estação no módulo MMAR.' },
          { t: 'fato', ref: 'radio-36', html: 'A estação recebe um <strong>indicativo de chamada</strong> quando é licenciada pela primeira vez.' },
          { t: 'fato', ref: 'radio-35', html: 'As estações que participam do sistema mundial de socorro (GMDSS) precisam de <strong>MMSI</strong>, o número de identificação de 9 dígitos que vai programado no rádio DSC.' },
          { t: 'fato', ref: 'normas-153', html: 'Os equipamentos de comunicações devem seguir as normas da Anatel (ou ser homologados no país de origem, se estrangeiros) e o Regulamento de Radiocomunicações do serviço móvel marítimo.' },
          { t: 'h', txt: 'Certificado de operador' },
          { t: 'fato', ref: 'radio-15', html: 'A NORMAM-211 não traz exigência de certificado de operador de rádio para o condutor amador: o conhecimento de VHF é cobrado dentro da prova da CHA.' },
          { t: 'fato', ref: 'radio-12', html: 'Já o regulamento da Anatel (RGST) exige certificado de radiotelegrafista ou radiotelefonista, emitido ou reconhecido pela Anatel, para operar estações do serviço móvel marítimo quando associadas ao GMDSS.' },
          { t: 'fato', ref: 'radio-02', html: 'O Certificado de Operador Radiotelefonista é gratuito, intransferível e tem validade indeterminada, segundo a página da Anatel.' },
          { t: 'fato', ref: 'radio-03', html: 'A inscrição para a prova é gratuita, no Sistema SEC da Anatel, com login gov.br, e as provas são online, conforme o calendário publicado.' },
          { t: 'callout', tipo: 'aconfirmar', titulo: 'Na dúvida, tire o certificado', html: 'Como o certificado é gratuito e a prova é online, vale a pena tirá-lo, sobretudo se o seu rádio tem DSC. A aba "Rádio e segurança" detalha as categorias e a prova.' },
          { t: 'callout', tipo: 'intl', titulo: 'Trilha internacional', html: 'No Reino Unido, o certificado mínimo para operar VHF e VHF/DSC é o RYA SRC (Short Range Certificate). Segundo o RYA, a autorização britânica limita a validade dele a embarcações do Reino Unido: ele não substitui a licença nem o certificado brasileiros.', intl: true },
          { t: 'check', questoes: [
            Q('m13-l5-1', 'Comunicações VHF', 1, 'Qual órgão emite a Licença de Estação de Navio para o rádio da sua embarcação?',
              ['A Capitania dos Portos', 'A Anatel', 'O Corpo de Bombeiros', 'A marina'], 1,
              'A NORMAM-211 manda obter a Licença de Estação de Navio na Anatel. A Capitania cuida da CHA e da inscrição do barco, não da licença do rádio. Bombeiros e marina não emitem licença de rádio.',
              'NORMAM-211/DPC, art. 4.23.8', NORMAM),
            Q('m13-l5-2', 'Comunicações VHF', 2, 'O que é o MMSI?',
              ['O número da CHA do condutor', 'O número de identificação do serviço móvel marítimo, programado no rádio DSC', 'A senha do aplicativo NAVSEG', 'O código do canal de socorro'], 1,
              'MMSI é a identidade numérica da estação no serviço móvel marítimo; vai programado no rádio DSC e identifica o barco nos alertas. Não tem relação com a CHA, com o NAVSEG nem com um canal.',
              'Resolução Anatel nº 777/2025 (RGST), art. 270; Anatel, Material de apoio, item 2.2.6', RGST)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 4.23.8 (Licença de Estação de Navio)', url: NORMAM, ref: 'normas-152' },
            { txt: 'Anatel, Serviço Móvel Marítimo (passo a passo do licenciamento)', url: ANATEL_SMM, ref: 'radio-28' },
            { txt: 'Anatel, Operador Radiotelefonista', url: ANATEL_OPER, ref: 'radio-02' },
            { txt: 'Resolução Anatel nº 777/2025 (RGST), arts. 269 a 271', url: RGST, ref: 'radio-12' }
          ] },
          { t: 'fontes', intl: true, itens: [
            { txt: 'RYA, Licensing onboard electronics (validade do SRC)', url: 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/', ref: 'radio-64' }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 14 — Estabilidade e mau tempo
     Programa: 3.1 i) (estabilidade, distribuição de peso, mau tempo, balanço, caturro e cabeceio).
     ===================================================================================== */
  var MIGUENS3 = 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf';
  var CHM_MET = 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologico';

  M.push({
    id: 'm14', titulo: 'Estabilidade e mau tempo',
    resumo: 'Por que o barco volta a ficar de pé, como distribuir o peso, o perigo da superfície livre, os movimentos de balanço, caturro e cabeceio e como enfrentar o mau tempo numa embarcação pequena.',
    licoes: [
      {
        id: 'l1', titulo: 'Por que o barco não vira: peso e empuxo', minutos: 10,
        objetivos: [
          'Explicar o centro de gravidade e o centro de carena (empuxo).',
          'Entender como surge o braço de endireitamento quando o barco aderna.',
          'Comparar a estabilidade de uma lancha e a de um veleiro com quilha lastrada.'
        ],
        blocos: [
          { t: 'p', html: '<strong>Estabilidade</strong> é a capacidade de o barco voltar à posição de equilíbrio depois que uma força, como o vento, uma onda ou o peso de uma pessoa, o inclina. Entender de onde ela vem ajuda a não destruí-la com uma carga mal colocada.' },
          { t: 'h', txt: 'Duas forças, dois pontos' },
          { t: 'lista', itens: [
            '<strong>Peso</strong>: todo o peso do barco (casco, motor, tanques, carga, pessoas) age para baixo como se estivesse concentrado num ponto, o <strong>centro de gravidade (G)</strong>.',
            '<strong>Empuxo</strong>: a água empurra o casco para cima com uma força igual ao peso do barco (é por isso que ele flutua). Essa força age no centro do volume submerso, o <strong>centro de carena (B)</strong>.'
          ] },
          { t: 'p', html: 'Com o barco reto, G e B ficam na mesma vertical e as forças se anulam. Quando o barco <strong>aderna</strong> (inclina para um bordo), a parte submersa muda de forma: o lado que afunda ganha volume e o centro de carena B corre para esse lado. G não muda, porque o peso não saiu do lugar. Peso para baixo e empuxo para cima passam a agir em verticais diferentes, e formam um binário que gira o barco de volta: é o <strong>braço de endireitamento</strong>.' },
          { t: 'figura', svg: svg('0 0 360 250', 'Corte transversal de um barco adernado: o centro de gravidade G fica no mesmo lugar, o centro de carena B se desloca para o bordo que afundou, e o peso e o empuxo formam o braço de endireitamento',
            '<rect x="0" y="130" width="360" height="120" fill="var(--sea-2)" opacity="0.45"/><line x1="0" y1="130" x2="360" y2="130" stroke="currentColor" stroke-opacity="0.6"/>' +
            '<g transform="rotate(-20 180 125)"><path d="M90 80 L270 80 L262 140 Q180 182 98 140 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2.5"/>' +
            '<rect x="172" y="160" width="16" height="50" fill="currentColor"/><path d="M164 210 h32 l-6 12 h-20 z" fill="currentColor"/>' +
            '<line x1="180" y1="80" x2="180" y2="10" stroke="currentColor" stroke-width="3"/>' +
            '<circle cx="180" cy="128" r="6" fill="var(--magenta)"/><text x="190" y="124" font-size="14" font-weight="700" fill="var(--magenta)">G</text></g>' +
            '<circle cx="156" cy="146" r="6" fill="currentColor"/><text x="144" y="152" text-anchor="end" font-size="14" font-weight="700" fill="currentColor">B</text>' +
            '<path d="M156 140 V98" stroke="currentColor" stroke-width="2.5"/><path d="M150 104 l6 -12 l6 12z" fill="currentColor"/><text x="166" y="106" font-size="12.5" fill="currentColor">empuxo</text>' +
            '<path d="M156 152 V200" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" stroke-opacity="0.7"/>' +
            '<path d="M181 134 V230" stroke="var(--magenta)" stroke-width="2.5"/><path d="M175 222 l6 12 l6 -12z" fill="var(--magenta)"/><text x="192" y="243" font-size="12.5" fill="var(--magenta)">peso</text>' +
            '<line x1="156" y1="196" x2="181" y2="196" stroke="currentColor" stroke-width="2"/><path d="M156 191 v10 M181 191 v10" stroke="currentColor" stroke-width="1.5"/>' +
            '<text x="148" y="194" text-anchor="end" font-size="12.5" fill="currentColor">braço de</text><text x="148" y="209" text-anchor="end" font-size="12.5" fill="currentColor">endireitamento</text>'),
            legenda: 'O barco aderna, B corre para o lado que afundou e o par peso e empuxo empurra o barco de volta. Quanto mais baixo o G, maior esse braço.' },
          { t: 'h', txt: 'G baixo é bom' },
          { t: 'p', html: 'Quanto <strong>mais baixo</strong> o centro de gravidade, maior o braço de endireitamento para a mesma inclinação. Peso alto (gente em pé no teto da cabine, carga no convés, um bote amarrado no alto) sobe o G e reduz a estabilidade. Peso baixo e no centro (no fundo, perto da linha de centro) ajuda.' },
          { t: 'lista', itens: [
            '<strong>Lancha</strong>: a estabilidade vem sobretudo da <strong>forma</strong> do casco, largo e chato. É muito estável enquanto está quase reta, mas, se adernar muito (por peso de um lado ou por uma onda), pode virar depressa.',
            '<strong>Veleiro de quilha</strong>: o <strong>lastro</strong> (chumbo ou ferro; num cruzeiro de 32 pés, por exemplo, às vezes uma tonelada ou mais, e mais ainda nos barcos maiores) fica na ponta da quilha e baixa muito o G. Ele aderna fácil com o vento, mas quanto mais aderna, mais forte o endireitamento, até ângulos grandes.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Rigidez e conforto', html: 'Um barco muito rígido (G muito baixo) balança rápido e de forma desconfortável; um barco "mole" balança devagar. O Manual de Navegação da Marinha explica: quanto maior a altura metacêntrica (a distância que mede a estabilidade inicial), maior a estabilidade e menor o período do balanço.' },
          { t: 'termos', ids: ['estabilidade', 'banda', 'lastro', 'quilha'] },
          { t: 'check', questoes: [
            Q('m14-l1-1', 'Estabilidade', 1, 'Quando um barco aderna, o que acontece com o centro de carena (B)?',
              ['Fica parado no mesmo lugar', 'Desloca-se para o bordo que afundou', 'Sobe até o convés', 'Desaparece'], 1,
              'O lado que afunda ganha volume submerso, e o centro desse volume, B, corre para esse bordo. Isso cria o braço de endireitamento junto com o peso, que age em G. B não fica parado nem sobe ao convés, e o empuxo não desaparece enquanto o barco flutua.',
              'Princípios de estabilidade; Manual de Navegação (Miguens), vol. III, cap. 42', MIGUENS3),
            Q('m14-l1-2', 'Estabilidade', 1, 'O que deixa um barco <strong>mais</strong> estável?',
              ['Peso alto, no teto da cabine', 'Peso baixo e perto da linha de centro', 'Pessoas em pé no convés', 'Carga amarrada num só bordo'], 1,
              'Peso baixo e centrado abaixa o centro de gravidade e aumenta o braço de endireitamento. Peso alto, pessoas em pé e carga num só bordo sobem o G ou fazem o barco adernar, reduzindo a estabilidade.',
              'Princípios de estabilidade; Manual de Navegação (Miguens), vol. III, item 42.4 c', MIGUENS3)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Manual de Navegação da Marinha do Brasil (Miguens), vol. III, 1ª revisão 2026, cap. 42 (altura metacêntrica, período de balanço, centro de gravidade baixo)', url: MIGUENS3 },
            { txt: 'NORMAM-211/DPC, Glossário (estabilidade intacta)', url: NORMAM }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Distribuição de peso, lotação e superfície livre', minutos: 10,
        objetivos: [
          'Distribuir pessoas e carga para manter o barco estável e equilibrado.',
          'Respeitar a lotação e saber onde ela está escrita.',
          'Explicar, em linguagem simples, o efeito de superfície livre.'
        ],
        blocos: [
          { t: 'h', txt: 'Lotação' },
          { t: 'fato', ref: 'extra-arrais-3-42', html: '<strong>Lotação</strong> é a quantidade máxima de pessoas autorizadas a embarcar, <strong>incluindo a tripulação</strong>.' },
          { t: 'fato', ref: 'extra-arrais-3-43', html: 'Nas embarcações de esporte e recreio com menos de 24 m, a lotação é determinada pelo estaleiro construtor. Se o dado do estaleiro não existir, ou se a embarcação for artesanal, a lotação segue as regras de passageiros e de peso máximo de carga das NORMAM-201 ou NORMAM-202 (art. 3.27.1).' },
          { t: 'fato', ref: 'extra-arrais-3-41', html: 'É <strong>proibido</strong> exceder a lotação estabelecida pelo construtor ou pela Capitania, que consta do TIE (o documento de inscrição do barco).' },
          { t: 'p', html: 'Sobrecarga afunda o barco, reduz a <strong>borda livre</strong> (a altura do costado acima da água) e deixa a água das ondas entrar com facilidade. E as pessoas pesam muito: dez adultos são perto de 800 kg.' },
          { t: 'h', txt: 'Arrumando o peso' },
          { t: 'lista', itens: [
            'Peso <strong>baixo e no centro</strong>: carga pesada no fundo, perto da linha de centro, nunca empilhada no convés.',
            'Distribua de <strong>bombordo a boreste</strong> para o barco não navegar adernado, e de <strong>proa a popa</strong> para não ficar abicado (proa funda) ou apopado (popa funda), o que muda o comportamento nas ondas.',
            'Em barco pequeno, as pessoas ficam <strong>sentadas</strong>. Ao embarcar num bote, pise no centro, abaixado, e entregue as coisas na mão em vez de pular com elas.',
            'Prenda (peie) tudo que pode correr: um peso que escorrega para um bordo numa guinada faz o barco adernar de repente.',
            'Ao recolher alguém da água, equilibre o peso do outro lado antes de puxar a pessoa pela borda. Num barco instável, recolha pela popa.'
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'Barco pequeno não se fundeia pela popa', html: 'A popa costuma ser mais baixa e larga. Fundeado pela popa, com vento ou correnteza, o barco pode embarcar água e encher. Fundeie sempre pela proa.' },
          { t: 'h', txt: 'Superfície livre' },
          { t: 'p', html: 'Um tanque <strong>pela metade</strong> é um perigo escondido. Quando o barco aderna, o líquido corre para o lado mais baixo, e o peso dele vai junto, ajudando a adernar ainda mais. É como carregar uma bandeja com água: cheia até a borda ou vazia, é fácil; com um pouco de água, ela corre de um lado para o outro e desequilibra. A mesma coisa vale para a água solta na sentina ou no fundo de um bote.' },
          { t: 'figura', svg: svg('0 0 360 170', 'Efeito de superfície livre: num tanque cheio o líquido não se move; num tanque pela metade, com o barco adernado, o líquido corre para o lado baixo e desloca o centro de gravidade',
            '<g transform="rotate(-12 90 90)"><rect x="30" y="50" width="120" height="70" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="2"/></g>' +
            '<text x="90" y="160" text-anchor="middle" font-size="13" fill="currentColor">cheio: não se move</text>' +
            '<defs><clipPath id="m14l2tanque"><rect x="210" y="50" width="120" height="70" rx="6" transform="rotate(-12 270 90)"/></clipPath></defs>' +
            '<rect x="190" y="90" width="160" height="60" fill="var(--sea-2)" clip-path="url(#m14l2tanque)"/>' +
            '<g transform="rotate(-12 270 90)"><rect x="210" y="50" width="120" height="70" rx="6" fill="none" stroke="currentColor" stroke-width="2"/></g>' +
            '<line x1="196" y1="90" x2="346" y2="90" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.6"/>' +
            '<path d="M262 74 q-18 -10 -36 0" fill="none" stroke="var(--magenta)" stroke-width="2.5"/><path d="M222 75 l11 -8 l2 12z" fill="var(--magenta)"/>' +
            '<text x="270" y="160" text-anchor="middle" font-size="13" fill="currentColor">pela metade: o líquido corre</text>'),
            legenda: 'A superfície do líquido fica sempre horizontal (linha tracejada). Com o barco adernado, o líquido de um tanque pela metade se acumula no lado mais baixo, desloca o centro de gravidade para esse lado e diminui a estabilidade.' },
          { t: 'lista', itens: [
            'Antes de sair com mau tempo previsto, deixe os tanques <strong>cheios ou vazios</strong>, evitando os pela metade.',
            'Mantenha a <strong>sentina seca</strong>: água acumulada no fundo é superfície livre e peso extra.',
            'Teste a bomba de esgoto antes de sair e saiba esgotar à mão.'
          ] },
          { t: 'fato', ref: 'extra-arrais-3-40', html: 'Embarcações de médio porte com menos de 12 m devem ter pelo menos uma bomba de esgoto, manual ou elétrica.' },
          { t: 'termos', ids: ['lotacao', 'borda-livre', 'trim', 'bomba-de-esgoto', 'sentina'] },
          { t: 'check', questoes: [
            Q('m14-l2-1', 'Estabilidade', 1, 'A lotação de uma embarcação inclui:',
              ['Só os passageiros', 'Passageiros e tripulação', 'Só a tripulação', 'Só os adultos'], 1,
              'A NORMAM-211 define lotação como a quantidade máxima de pessoas autorizadas a embarcar, incluindo a tripulação. Ela conta todas as pessoas a bordo, adultos e crianças.',
              'NORMAM-211/DPC, art. 1.7 (Definições)', NORMAM),
            Q('m14-l2-2', 'Estabilidade', 2, 'Por que um tanque de água ou combustível pela metade reduz a estabilidade?',
              ['Porque o tanque fica mais leve', 'Porque o líquido corre para o lado que aderna e leva o peso junto', 'Porque o ar do tanque empurra o barco', 'Não reduz; tanque pela metade é o ideal'], 1,
              'É o efeito de superfície livre: o líquido se move para o bordo mais baixo e desloca o centro de gravidade, ajudando o barco a adernar mais. Ficar mais leve não é o problema. O ar dentro do tanque não empurra o barco. O Manual de Navegação recomenda tanques cheios ou vazios.',
              'Manual de Navegação (Miguens), vol. III, item 42.3 e 42.4 c', MIGUENS3),
            Q('m14-l2-3', 'Estabilidade', 1, 'Onde se informa a lotação máxima de uma embarcação de esporte e recreio?',
              ['Ela é livre, a critério do comandante', 'No TIE, conforme a lotação definida pelo construtor ou pela Capitania', 'Na CHA do condutor', 'No contrato da marina'], 1,
              'O art. 4.3.6 proíbe exceder a lotação estabelecida pelo construtor ou pela Capitania, que consta do TIE. Ela não é livre, não aparece na CHA do condutor e não depende da marina.',
              'NORMAM-211/DPC, arts. 3.27.1 e 4.3.6', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, arts. 1.7, 3.27.1 e 4.3.6 (lotação)', url: NORMAM, ref: 'extra-arrais-3-41' },
            { txt: 'NORMAM-211/DPC, art. 4.29.1 (bomba de esgoto)', url: NORMAM, ref: 'extra-arrais-3-40' },
            { txt: 'Manual de Navegação (Miguens), vol. III, itens 42.3 e 42.4 (superfície livre, peiação, tanques cheios ou vazios)', url: MIGUENS3 },
            { txt: 'Transport for NSW, Capsizing and swamping (sobrecarga; não fundear barco pequeno pela popa)', url: NSW_VIRAR }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'Balanço, caturro e cabeceio', minutos: 10,
        objetivos: [
          'Definir balanço, caturro (arfagem) e cabeceio.',
          'Entender o perigo do sincronismo com as ondas.',
          'Mudar rumo ou velocidade para reduzir os movimentos.'
        ],
        blocos: [
          { t: 'p', html: 'Nas ondas, o barco se move de várias formas ao mesmo tempo. O programa do Arrais cobra três desses movimentos:' },
          { t: 'figura', svg: svg('0 0 360 210', 'Os três movimentos: balanço, oscilação de um bordo para o outro; caturro ou arfagem, proa e popa subindo e descendo; cabeceio, a proa oscilando para bombordo e boreste',
            '<g transform="translate(60 80)"><path d="M-40 -6 L40 -6 L32 22 Q0 34 -32 22 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M-48 -28 A54 54 0 0 1 48 -28" fill="none" stroke="var(--magenta)" stroke-width="2.5"/><path d="M42 -34 l8 8 l-10 2z" fill="var(--magenta)"/><path d="M-42 -34 l-8 8 l10 2z" fill="var(--magenta)"/>' +
            '<text x="0" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">balanço</text><text x="0" y="78" text-anchor="middle" font-size="12.5" fill="currentColor">de bordo a bordo</text><text x="0" y="94" text-anchor="middle" font-size="12.5" fill="currentColor">(visto de popa)</text></g>' +
            '<g transform="translate(180 80)"><path d="M-46 -2 L40 -8 Q48 -4 44 4 L-44 12 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M44 -30 v-0 M50 -36 v26" stroke="var(--magenta)" stroke-width="2.5"/><path d="M44 -32 l6 -8 l6 8z M44 -14 l6 8 l6 -8z" fill="var(--magenta)"/>' +
            '<path d="M-52 -26 v26" stroke="var(--magenta)" stroke-width="2.5"/><path d="M-58 -22 l6 -8 l6 8z M-58 -4 l6 8 l6 -8z" fill="var(--magenta)"/>' +
            '<text x="0" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">caturro</text><text x="0" y="78" text-anchor="middle" font-size="12.5" fill="currentColor">ou arfagem: proa e</text><text x="0" y="94" text-anchor="middle" font-size="12.5" fill="currentColor">popa sobem e descem</text></g>' +
            '<g transform="translate(300 80)"><path d="M0 -38 Q14 -14 12 26 L-12 26 Q-14 -14 0 -38 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M-26 -40 A40 40 0 0 1 26 -40" fill="none" stroke="var(--magenta)" stroke-width="2.5"/><path d="M20 -46 l9 6 l-10 4z" fill="var(--magenta)"/><path d="M-20 -46 l-9 6 l10 4z" fill="var(--magenta)"/>' +
            '<text x="0" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">cabeceio</text><text x="0" y="78" text-anchor="middle" font-size="12.5" fill="currentColor">a proa guina para</text><text x="0" y="94" text-anchor="middle" font-size="12.5" fill="currentColor">BB e BE (de cima)</text></g>'),
            legenda: 'Balanço é transversal; caturro (arfagem) é longitudinal; no cabeceio a proa oscila para os bordos, como uma guinada.' },
          { t: 'lista', itens: [
            '<strong>Balanço</strong>: a oscilação transversal, de um bordo para o outro. A <strong>amplitude</strong> é o ângulo total de um bordo ao outro (8° para boreste e 7° para bombordo dão 15°); o <strong>período</strong> é o tempo de uma oscilação completa. É forte com o mar pelo través.',
            '<strong>Caturro</strong> (ou <strong>arfagem</strong>): a oscilação longitudinal, com a proa e a popa subindo e descendo. Barcos curtos caturram mais. É forte com o mar pela proa, e a proa pode "enterrar" na onda.',
            '<strong>Cabeceio</strong>: a proa oscilando para bombordo e boreste, como guinadas. Aparece com mar de popa ou de alheta, quando a onda empurra a popa para um lado, e também no barco fundeado que "cabeceia" de um lado para o outro.'
          ] },
          { t: 'h', txt: 'Sincronismo: o balanço que cresce' },
          { t: 'p', html: 'Todo barco tem um <strong>período natural</strong> de balanço. Se as ondas chegam no mesmo ritmo, cada uma empurra no momento certo e o balanço cresce, mesmo com ondas pequenas, como empurrar uma criança num balanço. O Manual de Navegação da Marinha chama isso de <strong>sincronismo</strong>. A saída é <strong>mudar o rumo, a velocidade ou ambos</strong>, para mudar o ritmo em que o barco encontra as ondas.' },
          { t: 'h', txt: 'Atravessar ao mar' },
          { t: 'p', html: 'Com mar de popa, o barco pode "surfar" na frente de uma onda que quebra: o leme perde efeito, a proa cabeceia para um lado e o barco <strong>atravessa ao mar</strong>, ficando de lado no cavado da onda, onde a próxima onda pode emborcá-lo. Por isso, correndo com o mar, a velocidade deve ficar bem abaixo da velocidade das ondas, mas suficiente para governar.' },
          { t: 'termos', ids: ['balanco', 'arfagem', 'bochecha', 'alheta', 'traves'] },
          { t: 'check', questoes: [
            Q('m14-l3-1', 'Estabilidade', 1, 'O movimento de oscilação do barco no sentido <strong>longitudinal</strong>, com proa e popa subindo e descendo, chama-se:',
              ['Balanço', 'Caturro (arfagem)', 'Cabeceio', 'Abatimento'], 1,
              'Caturro ou arfagem é a oscilação longitudinal. Balanço é a transversal, de bordo a bordo. Cabeceio é a oscilação da proa para os bordos. Abatimento é o deslocamento lateral causado pelo vento.',
              'Manual de Navegação (Miguens), vol. III, item 42.3', MIGUENS3),
            Q('m14-l3-2', 'Estabilidade', 2, 'O barco balança cada vez mais, mesmo com ondas moderadas, no ritmo das ondas. O que fazer?',
              ['Manter rumo e velocidade, porque vai passar', 'Mudar o rumo, a velocidade ou ambos', 'Encher os tanques pela metade', 'Mandar todos para o lado de sotavento'], 1,
              'É o sincronismo entre o período natural do barco e o das ondas; mudar rumo ou velocidade muda o ritmo de encontro com as ondas e quebra a sincronia. Insistir mantém o balanço crescente. Tanques pela metade criam superfície livre. Concentrar gente num bordo faz o barco adernar.',
              'Manual de Navegação (Miguens), vol. III, item 42.3 (sincronismo)', MIGUENS3),
            Q('m14-l3-3', 'Estabilidade', 2, 'Navegando com o mar pela popa, o barco começa a "surfar" e a proa guina para um lado. Qual o risco?',
              ['Encalhar na onda', 'Atravessar ao mar e ficar de lado no cavado, podendo emborcar', 'Ganhar velocidade e chegar mais cedo', 'Nenhum, o leme fica mais eficiente'], 1,
              'Surfando, o leme perde efeito, a proa cabeceia e o barco pode atravessar ao mar, ficando de lado no cavado, onde pode emborcar. Por isso se reduz a velocidade bem abaixo da velocidade das ondas. Chegar mais cedo não compensa o risco. O leme fica menos eficiente, e não mais.',
              'Manual de Navegação (Miguens), vol. III, item 42.4 b', MIGUENS3)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Manual de Navegação da Marinha do Brasil (Miguens), vol. III, 1ª revisão 2026, cap. 42, itens 42.2 a 42.4 (balanço, caturro, sincronismo, cabecear e atravessar ao mar)', url: MIGUENS3 }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Enfrentando mau tempo numa embarcação pequena', minutos: 12,
        objetivos: [
          'Decidir sair ou não a partir da previsão do tempo.',
          'Preparar o barco e a tripulação quando o tempo vai piorar.',
          'Conduzir com segurança nas ondas: velocidade, ângulo e abrigo.'
        ],
        blocos: [
          { t: 'p', html: 'A melhor manobra de mau tempo é <strong>não estar lá</strong>. Muitos acidentes com barcos pequenos acontecem porque alguém saiu com previsão ruim ou não voltou a tempo quando o tempo virou.' },
          { t: 'h', txt: 'Antes de sair' },
          { t: 'fato', ref: 'extra-arrais-3-48', html: 'A lista de verificação da NORMAM-211 manda consultar a previsão do tempo nos sites da DHN e do CPTEC antes de sair. O programa do Arrais cita também o aplicativo "Boletim ao Mar".' },
          { t: 'fato', ref: 'travessia-96', html: 'O Centro de Hidrografia da Marinha emite <strong>aviso de mau tempo</strong> quando prevê vento de força 7 Beaufort ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa.' },
          { t: 'p', html: 'Um barco pequeno sofre muito antes do aviso de mau tempo. Num lago ou numa represa, com pouca distância para o vento criar ondas, elas ficam <strong>curtas e escarpadas</strong>, e o Manual de Navegação lembra que esse mar curto é o mais perigoso para barcos pequenos. Fique de olho no céu: trovoadas de fim de tarde (comuns no verão e na Amazônia) e a chegada de frentes frias no Sul e no Sudeste viram o vento e o levantam em minutos.' },
          { t: 'widget', w: 'beaufort', opts: { forca: 6, quiz: false }, legenda: 'Escala Beaufort: veja como o mar cresce com o vento. Num barco pequeno, o mar já incomoda bem antes da força 7, que é o limite do aviso de mau tempo da Marinha.' },
          { t: 'h', txt: 'Quando o tempo vai piorar' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Decida cedo</strong> voltar ou buscar abrigo, enquanto o mar ainda permite.',
            'Todos de <strong>colete</strong>. No veleiro, linha de vida e cinto de segurança (arnês) para quem vai ao convés.',
            '<strong>Feche</strong> escotilhas, vigias e gaiutas. <strong>Peie</strong> (prenda) tudo que pode voar ou correr.',
            'Esgote a sentina e evite tanques pela metade (superfície livre).',
            'No veleiro, <strong>rize cedo</strong>: reduzir pano antes de precisar é muito mais fácil e seguro.',
            'Avise pelo rádio sua posição e intenção. Mantenha o VHF ligado no 16 para ouvir avisos.',
            'Tenha à mão bomba de esgoto e balde, lanterna, pirotécnicos e a âncora pronta, caso o motor pare perto de pedras.'
          ] },
          { t: 'h', txt: 'Conduzindo nas ondas' },
          { t: 'lista', itens: [
            '<strong>Reduza a velocidade</strong>. O Manual de Navegação diz que os efeitos do mar grosso aumentam com a velocidade e que, com mau tempo, reduzir a velocidade é indispensável.',
            '<strong>Mar pela proa</strong>: receba as ondas pela bochecha (um pouco de lado da proa), com velocidade suficiente para governar. Bater de frente faz o barco caturrar e "enterrar" a proa.',
            '<strong>Evite o través</strong>: ondas de lado provocam balanço violento e podem emborcar um barco pequeno. Se precisar ir para um rumo de través, faça-o em zigue-zague, ora com as ondas pela bochecha, ora pela alheta.',
            '<strong>Mar pela popa</strong>: velocidade bem menor que a das ondas, para não surfar e atravessar ao mar; segure firme o leme.',
            '<strong>Cuidado com barras e águas rasas</strong>: ali as ondas ficam mais altas e quebram. Na dúvida, espere fora, em águas profundas, ou procure outro abrigo.'
          ] },
          { t: 'figura', svg: svg('0 0 360 190', 'Ângulos de ondas em relação ao barco: pela bochecha é o preferível com mar pela proa, de través é perigoso, pela alheta com velocidade reduzida',
            '<g transform="translate(180 105)"><path d="M0 -40 Q16 -14 14 30 L-14 30 Q-16 -14 0 -40 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/></g>' +
            '<path d="M70 20 l40 40" stroke="var(--nav-green)" stroke-width="4"/><path d="M104 62 l10 2 l-2 -10z" fill="var(--nav-green)"/>' +
            '<text x="10" y="18" font-size="13" fill="currentColor">pela bochecha:</text><text x="10" y="34" font-size="13" fill="currentColor">melhor</text>' +
            '<path d="M330 105 h-80" stroke="var(--nav-red)" stroke-width="4"/><path d="M252 99 l-10 6 l10 6z" fill="var(--nav-red)"/>' +
            '<text x="350" y="90" text-anchor="end" font-size="13" fill="currentColor">de través:</text><text x="350" y="130" text-anchor="end" font-size="13" fill="currentColor">perigoso</text>' +
            '<path d="M80 180 l40 -36" stroke="currentColor" stroke-width="4"/><path d="M116 140 l8 -2 l-2 8z" fill="currentColor"/>' +
            '<text x="134" y="182" font-size="13" fill="currentColor">pela alheta: devagar, sem surfar</text>'),
            legenda: 'As setas mostram de onde vêm as ondas em relação ao barco, visto de cima.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Motor parou perto de pedras', html: 'Largue a âncora logo, antes que o vento e as ondas levem o barco até a pedra. Depois peça ajuda (PAN PAN, ou MAYDAY se o perigo for iminente) e tente resolver a pane.' },
          { t: 'termos', ids: ['aviso-de-mau-tempo', 'beaufort', 'rizo', 'linha-de-vida', 'capear'] },
          { t: 'check', questoes: [
            Q('m14-l4-1', 'Meteorologia e mau tempo', 1, 'Pela lista de verificação da NORMAM-211, onde consultar a previsão do tempo antes de sair?',
              ['Só olhando o céu na hora', 'Nos sites da DHN e do CPTEC', 'Perguntando ao vizinho do cais', 'Não é preciso em navegação interior'], 1,
              'O Anexo 5-F manda consultar a previsão nos sites da DHN e do CPTEC (o programa cita também o aplicativo Boletim ao Mar). Olhar o céu ajuda, mas não substitui a previsão. O conselho de terceiros não é fonte oficial. A recomendação vale para qualquer navegação.',
              'NORMAM-211/DPC, Anexo 5-F, item 06; Anexo 5-A, item 3.1 d)', NORMAM),
            Q('m14-l4-2', 'Meteorologia e mau tempo', 2, 'Com ondas grandes vindo pela proa, numa lancha de 6 m, a condução mais segura é:',
              ['Manter velocidade máxima para atravessar logo', 'Reduzir a velocidade e receber as ondas pela bochecha', 'Colocar o barco de través para as ondas', 'Desligar o motor e esperar'], 1,
              'Velocidade reduzida, mas suficiente para governar, e ondas um pouco de lado da proa (bochecha) reduzem pancadas e caturro. Velocidade máxima aumenta os efeitos do mar grosso. De través, o balanço pode emborcar o barco. Sem motor, o barco atravessa ao mar.',
              'Manual de Navegação (Miguens), vol. III, itens 42.3 e 42.4', MIGUENS3),
            Q('m14-l4-3', 'Meteorologia e mau tempo', 2, 'O CHM emite aviso de mau tempo quando prevê, entre outras condições:',
              ['Vento de força 4 Beaufort', 'Vento de força 7 Beaufort ou mais (28 nós ou mais)', 'Qualquer chuva', 'Ondas de 1 m'], 1,
              'O critério do aviso de mau tempo inclui vento de força 7 ou mais (a partir de 28 nós), ondas de 3 m ou mais em águas profundas, visibilidade de até 1 km e ressaca com ondas de 2,5 m ou mais. Força 4, chuva comum e ondas de 1 m não geram aviso, embora já possam ser difíceis para um barco pequeno.',
              'CHM, Serviços radiometeorológicos de apoio ao navegante', CHM_MET)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-F, item 06 (previsão do tempo)', url: NORMAM, ref: 'extra-arrais-3-48' },
            { txt: 'CHM, Serviços radiometeorológicos de apoio ao navegante (critérios do aviso de mau tempo)', url: CHM_MET, ref: 'travessia-96' },
            { txt: 'Manual de Navegação (Miguens), vol. III, cap. 42 (mar curto e escarpado, reduzir a velocidade, preparação para mau tempo, capear e correr com o tempo)', url: MIGUENS3 }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 15 — Legislação: LESTA, RLESTA e NORMAM-211
     Programa: 3.1 j). Todo fato regulatório em bloco {t:'fato'}.
     ===================================================================================== */
  var NORMAS_IDX = 'https://www.marinha.mil.br/dpc/normas-autoridade-maritima-brasileira';

  M.push({
    id: 'm15', titulo: 'Legislação: LESTA, RLESTA e NORMAM-211',
    resumo: 'De onde vêm as regras, as categorias de amador e as áreas de navegação, a CHA (porte, validade e renovação), álcool, infrações e multas, aluguel de embarcação e o Marinheiro Profissional de Esporte e Recreio.',
    licoes: [
      {
        id: 'l1', titulo: 'Quem faz as regras: LESTA, RLESTA, NORMAM e NPCP', minutos: 8,
        objetivos: [
          'Situar a LESTA, o RLESTA, a NORMAM-211 e as NPCP numa hierarquia.',
          'Saber qual versão da NORMAM-211 está em vigor e onde consultá-la.',
          'Entender o papel das Capitanias na definição das áreas locais.'
        ],
        blocos: [
          { t: 'p', html: 'A navegação de esporte e recreio no Brasil segue uma escada de normas. Cada degrau detalha o de cima:' },
          { t: 'figura', svg: svg('0 0 360 230', 'Hierarquia das normas: Lei 9.537/1997 (LESTA), Decreto 2.596/1998 (RLESTA), NORMAM-211 da Diretoria de Portos e Costas e NPCP de cada Capitania',
            '<g font-size="13" fill="currentColor">' +
            '<rect x="20" y="10" width="320" height="44" rx="8" fill="var(--sea-3)" stroke="currentColor"/><text x="180" y="30" text-anchor="middle" font-weight="700">LESTA: Lei nº 9.537/1997</text><text x="180" y="46" text-anchor="middle">segurança do tráfego aquaviário</text>' +
            '<rect x="40" y="64" width="280" height="44" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="180" y="84" text-anchor="middle" font-weight="700">RLESTA: Decreto nº 2.596/1998</text><text x="180" y="100" text-anchor="middle">regulamenta a lei, infrações e multas</text>' +
            '<rect x="60" y="118" width="240" height="44" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="180" y="138" text-anchor="middle" font-weight="700">NORMAM-211/DPC</text><text x="180" y="154" text-anchor="middle">esporte e recreio, CHA, dotação</text>' +
            '<rect x="80" y="172" width="200" height="44" rx="8" fill="none" stroke="var(--magenta)" stroke-width="2"/><text x="180" y="192" text-anchor="middle" font-weight="700" fill="var(--magenta)">NPCP / NPCF</text><text x="180" y="208" text-anchor="middle">regras locais de cada Capitania</text></g>'),
            legenda: 'A lei vale para todo o país; as NPCP (Normas e Procedimentos das Capitanias dos Portos) e NPCF (das Capitanias Fluviais) detalham a área de cada Capitania.' },
          { t: 'fato', ref: 'normas-03', html: 'A NORMAM-211 decorre da <strong>Lei nº 9.537/1997 (LESTA)</strong> e do <strong>Decreto nº 2.596/1998 (RLESTA)</strong>, e as categorias de amador constam do item II do anexo I do RLESTA.' },
          { t: 'fato', ref: 'normas-01', html: 'A versão vigente da NORMAM-211/DPC, segundo a página de normas da Diretoria de Portos e Costas consultada em 07/10/2026, é a aprovada pela Portaria DPC/DGN/MB nº 200, de 27 de fevereiro de 2026.' },
          { t: 'fato', ref: 'normas-02', html: 'A principal mudança dessa revisão foi a inclusão do art. 5.9, sobre o Marinheiro Profissional de Esporte e Recreio (MPER).' },
          { t: 'fato', ref: 'normas-07', html: 'Os limites das áreas de navegação interior são definidos por cada Capitania, Delegacia ou Agência nas suas NPCP/NPCF, conforme as características locais.' },
          { t: 'callout', tipo: 'dica', titulo: 'Leia as normas da sua Capitania', html: 'Cada Capitania publica suas NPCP com os limites das áreas de navegação interior, áreas de banhistas, canais e regras locais. Antes de navegar numa região nova, leia as NPCP dela no site da Capitania correspondente.' },
          { t: 'fato', ref: 'normas-87', html: 'Para a prova: se a bibliografia recomendada conflitar com outras fontes, vale a bibliografia recomendada.' },
          { t: 'termos', ids: ['lesta', 'rlesta', 'normam-211', 'npcp', 'autoridade-maritima', 'capitania-dos-portos'] },
          { t: 'check', questoes: [
            Q('m15-l1-1', 'Legislação', 1, 'O RLESTA, que regulamenta a lei de segurança do tráfego aquaviário, é o:',
              ['Decreto nº 2.596/1998', 'Lei nº 9.537/1997', 'NORMAM-211/DPC', 'Código Civil'], 0,
              'O RLESTA é o Decreto nº 2.596/1998. A Lei nº 9.537/1997 é a LESTA, regulamentada por ele. A NORMAM-211 é norma da Autoridade Marítima que decorre dos dois. O Código Civil não trata disso.',
              'NORMAM-211/DPC, Introdução, item 2; Decreto nº 2.596/1998', RLESTA),
            Q('m15-l1-2', 'Legislação', 2, 'Quem define os limites das áreas de navegação interior de uma região?',
              ['A prefeitura da cidade', 'A Capitania, Delegacia ou Agência, nas suas NPCP/NPCF', 'A marina mais próxima', 'O próprio condutor'], 1,
              'Pelo art. 4.7 da NORMAM-211, cada CP/DL/AG define os limites nas suas NPCP/NPCF, com base nas peculiaridades locais. Prefeitura, marina e condutor não definem áreas de navegação.',
              'NORMAM-211/DPC, art. 4.7', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'Lei nº 9.537/1997 (LESTA)', url: LESTA },
            { txt: 'Decreto nº 2.596/1998 (RLESTA)', url: RLESTA },
            { txt: 'DPC, Normas da Autoridade Marítima (página-índice)', url: NORMAS_IDX, ref: 'normas-01' },
            { txt: 'NORMAM-211/DPC, Introdução e art. 4.7', url: NORMAM, ref: 'normas-07' }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'Categorias de amador e áreas de navegação', minutos: 12,
        objetivos: [
          'Distinguir navegação interior (áreas 1 e 2), costeira e oceânica.',
          'Relacionar cada categoria de amador à área em que pode conduzir.',
          'Saber quem é dispensado de habilitação e as distâncias das praias.'
        ],
        blocos: [
          { t: 'h', txt: 'As áreas de navegação' },
          { t: 'fato', ref: 'normas-04', html: '<strong>Navegação interior</strong> é a realizada em águas abrigadas ou parcialmente abrigadas, dividida em Área 1 e Área 2.' },
          { t: 'fato', ref: 'normas-05', html: '<strong>Área 1</strong>: áreas abrigadas (lagos, lagoas, baías, rios, canais) onde normalmente não há ondas significativas.' },
          { t: 'fato', ref: 'normas-06', html: '<strong>Área 2</strong>: áreas parcialmente abrigadas, onde eventualmente há ondas significativas ou combinações adversas de vento, correnteza ou maré.' },
          { t: 'fato', ref: 'normas-08', html: '<strong>Navegação costeira</strong>: dentro dos limites de visibilidade da costa, até no máximo 20 milhas náuticas.' },
          { t: 'fato', ref: 'normas-09', html: '<strong>Navegação oceânica</strong>: sem restrições, além das 20 milhas náuticas da costa.' },
          { t: 'fato', ref: 'normas-13', html: 'As áreas de navegação servem, entre outras coisas, para definir a habilitação do condutor, isto é, a categoria de amador exigida.' },
          { t: 'h', txt: 'As categorias de amador' },
          { t: 'fato', ref: 'normas-23', html: 'As categorias são: <strong>Capitão-Amador (CPA)</strong>, <strong>Mestre-Amador (MSA)</strong>, <strong>Arrais-Amador (ARA)</strong>, <strong>Motonauta (MTA)</strong> e <strong>Veleiro (VLA)</strong>.' },
          { t: 'fato', ref: 'normas-26', html: '<strong>Arrais-Amador</strong>: conduz embarcações nos limites da navegação interior, definidos nas NPCP/NPCF, <strong>exceto moto aquática</strong>.' },
          { t: 'fato', ref: 'normas-12', html: 'As navegações Interior 1 e Interior 2 correspondem às categorias Arrais-Amador, Veleiro e Motonauta.' },
          { t: 'fato', ref: 'normas-25', html: '<strong>Mestre-Amador</strong>: entre portos nacionais e estrangeiros, nos limites da navegação costeira (até 20 milhas), exceto moto aquática.' },
          { t: 'fato', ref: 'normas-24', html: '<strong>Capitão-Amador</strong>: entre portos nacionais e estrangeiros, sem limite de afastamento da costa, exceto moto aquática.' },
          { t: 'fato', ref: 'normas-27', html: '<strong>Motonauta</strong>: conduz moto aquática nos limites da navegação interior.' },
          { t: 'fato', ref: 'normas-29', html: 'Quem se habilitou como CPA, MSA ou ARA a partir de 2 de julho de 2012 precisa também da categoria Motonauta para conduzir moto aquática.' },
          { t: 'fato', ref: 'normas-28', html: '<strong>Veleiro</strong>: conduz embarcações a vela sem propulsão a motor, nos limites da navegação interior.' },
          { t: 'fato', ref: 'normas-31', html: 'A CHA de Veleiro é facultativa e se destina a embarcações miúdas (até 6 m) de propulsão exclusivamente a vela.' },
          { t: 'fato', ref: 'normas-32', html: 'Para embarcações a vela de médio ou grande porte, a habilitação segue a área: Arrais para interior, Mestre para costeira e Capitão para oceânica, obrigatoriamente. Um veleiro de mais de 6 m (a partir de uns 20 pés, como um de 32 pés) na baía exige, no mínimo, Arrais-Amador.' },
          { t: 'fato', ref: 'normas-33', html: 'No quadro da navegação interior, a habilitação mínima é Veleiro, Arrais ou Motonauta (conforme o tipo) para as miúdas, e Arrais-Amador para as de médio e grande porte.' },
          { t: 'fato', ref: 'normas-14', html: 'A habilitação deve ser compatível com a área em que a embarcação estiver trafegando.' },
          { t: 'tabela', cab: ['Categoria', 'Área', 'Observação'], linhas: [
            ['Arrais-Amador (ARA)', 'interior (Áreas 1 e 2)', 'exceto moto aquática'],
            ['Mestre-Amador (MSA)', 'costeira, até 20 milhas', 'exige ARA válido para a inscrição'],
            ['Capitão-Amador (CPA)', 'oceânica, sem limite', 'exige MSA válido para a inscrição'],
            ['Motonauta (MTA)', 'interior', 'só moto aquática'],
            ['Veleiro (VLA)', 'interior', 'vela sem motor; facultativa para miúdas a vela']
          ], legenda: 'Resumo dos fatos acima e dos pré-requisitos de inscrição (NORMAM-211, art. 5.4.1, Notas).' },
          { t: 'h', txt: 'Quem não precisa de habilitação e as praias' },
          { t: 'fato', ref: 'normas-37', html: 'Só estão dispensados de habilitação os condutores de dispositivos flutuantes e de embarcações miúdas <strong>sem propulsão mecânica</strong>, usados em esporte ou recreio. Qualquer barco com motor exige CHA.' },
          { t: 'fato', ref: 'normas-21', html: 'Para proteger os banhistas, embarcações a vela ou a remo só podem navegar a partir de <strong>100 m</strong> da linha de base (a linha de arrebentação, ou onde começa o espelho d’água em rios e lagos), e as a motor a partir de <strong>200 m</strong>.' },
          { t: 'fato', ref: 'normas-22', html: 'Entre o ponto de entrada ou saída da água e a linha de base, o trânsito deve ser perpendicular à praia e abaixo de <strong>3 nós</strong>.' },
          { t: 'termos', ids: ['navegacao-interior', 'navegacao-costeira', 'navegacao-oceanica', 'arrais-amador', 'motonauta', 'veleiro-categoria', 'areas-adjacentes-as-praias'] },
          { t: 'check', questoes: [
            Q('m15-l2-1', 'Legislação', 1, 'O Arrais-Amador pode conduzir:',
              ['Qualquer embarcação até 20 milhas da costa', 'Embarcações nos limites da navegação interior, exceto moto aquática', 'Moto aquática em qualquer área', 'Embarcações em navegação oceânica'], 1,
              'O ARA conduz nos limites da navegação interior definidos nas NPCP/NPCF, e não moto aquática. Até 20 milhas é a navegação costeira, do Mestre-Amador. Moto aquática exige Motonauta. Oceânica é do Capitão-Amador.',
              'NORMAM-211/DPC, art. 5.3.3 c)', NORMAM),
            Q('m15-l2-2', 'Legislação', 2, 'Uma lancha a motor se aproxima de uma praia com banhistas. A partir de que distância da linha de base ela pode navegar normalmente?',
              ['50 m', '100 m', '200 m', 'Não há limite'], 2,
              'Embarcações a motor só navegam a partir de 200 m da linha de base; as a vela ou a remo, a partir de 100 m. Para entrar ou sair, o trânsito é perpendicular à praia e abaixo de 3 nós. 50 m não é a regra, e há limite, sim.',
              'NORMAM-211/DPC, art. 1.8.1', NORMAM),
            Q('m15-l2-3', 'Legislação', 2, 'Quem é dispensado de habilitação?',
              ['Quem conduz lancha pequena com motor de popa de baixa potência', 'Quem conduz embarcação miúda sem propulsão mecânica, em esporte ou recreio', 'Quem navega só em rios', 'Quem tem carteira de motorista'], 1,
              'A dispensa vale só para dispositivos flutuantes e embarcações miúdas sem propulsão mecânica (caiaque, pequeno barco a remo ou a vela). Qualquer motor exige CHA. Navegar em rio não dispensa. A CNH dispensa só o atestado médico na inscrição, não a habilitação.',
              'NORMAM-211/DPC, art. 5.5.6', NORMAM),
            Q('m15-l2-4', 'Legislação', 2, 'Para conduzir um veleiro de cruzeiro de 9,75 m (32 pés), com motor auxiliar, numa baía classificada como navegação interior, a habilitação mínima é:',
              ['Veleiro (VLA)', 'Arrais-Amador', 'Mestre-Amador', 'Nenhuma, por ser veleiro'], 1,
              'Embarcação a vela de médio porte segue a área: na interior, Arrais-Amador. A CHA de Veleiro serve para miúdas a vela sem motor. Mestre é exigido na costeira. Veleiro com motor não é dispensado.',
              'NORMAM-211/DPC, art. 5.5.2 e tabela 4.33', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 1.7 (definições das áreas)', url: NORMAM, ref: 'normas-04' },
            { txt: 'NORMAM-211/DPC, art. 4.7 (áreas e habilitação)', url: NORMAM, ref: 'normas-12' },
            { txt: 'NORMAM-211/DPC, arts. 5.3.1 e 5.3.3 (categorias)', url: NORMAM, ref: 'normas-23' },
            { txt: 'NORMAM-211/DPC, art. 5.5.2 (Veleiro e veleiros de médio porte)', url: NORMAM, ref: 'normas-32' },
            { txt: 'NORMAM-211/DPC, art. 5.5.6 (dispensa de habilitação)', url: NORMAM, ref: 'normas-37' },
            { txt: 'NORMAM-211/DPC, art. 1.8.1 (100 m e 200 m da linha de base)', url: NORMAM, ref: 'normas-21' }
          ] }
        ]
      },
      {
        id: 'l3', titulo: 'A CHA: porte, validade e renovação', minutos: 10,
        objetivos: [
          'Saber como portar a CHA física ou digital.',
          'Conhecer a validade da CHA e as regras de renovação.',
          'Saber o que fazer em caso de perda, roubo ou dano.'
        ],
        blocos: [
          { t: 'h', txt: 'Porte' },
          { t: 'fato', ref: 'normas-30', html: 'A habilitação é comprovada pela <strong>CHA</strong> (Carteira de Habilitação de Amador), física ou digital, de porte obrigatório para conduzir embarcações de esporte e recreio.' },
          { t: 'fato', ref: 'normas-110', html: 'Com a <strong>CHA digital</strong> (QR Code), o condutor deve portar um dispositivo que permita a consulta na Inspeção Naval. Ela também vale impressa, se o QR Code estiver legível.' },
          { t: 'fato', ref: 'normas-111', html: 'A CHA digital fica disponível no aplicativo <strong>gov.br</strong>, depois que o cidadão é avisado por SMS ou e-mail.' },
          { t: 'fato', ref: 'normas-109', html: 'A CHA sem foto deve ser acompanhada de documento oficial de identificação; a CHA com foto dispensa o documento.' },
          { t: 'fato', ref: 'normas-114', html: 'As restrições físicas do atestado médico (por exemplo, uso de lentes) aparecem no campo de observações da CHA.' },
          { t: 'callout', tipo: 'dica', titulo: 'Celular no mar', html: 'Se usar a CHA digital, leve o celular carregado e protegido da água, ou uma cópia impressa com o QR Code legível. Sem sinal de internet, abra o aplicativo antes de sair.' },
          { t: 'h', txt: 'Validade e renovação' },
          { t: 'fato', ref: 'normas-112', html: 'A CHA vale em todo o território nacional por <strong>dez anos</strong> a partir da emissão.' },
          { t: 'fato', ref: 'normas-113', html: 'Para quem tem <strong>65 anos ou mais</strong>, a CHA vale <strong>cinco anos</strong>.' },
          { t: 'fato', ref: 'normas-115', html: 'Para renovar: requerimento (anexo 5-H), cópia da CHA, atestado médico com menos de um ano (ou CNH válida), comprovante de residência e GRU de renovação, em <strong>qualquer</strong> Capitania, Delegacia ou Agência.' },
          { t: 'fato', ref: 'normas-116', html: 'O protocolo de renovação emitido pela Capitania autoriza conduzir por até <strong>30 dias</strong>.' },
          { t: 'fato', ref: 'normas-117', html: 'Depois de <strong>cinco anos do vencimento</strong>, renovar exige novo processo de inscrição e exame na última categoria.' },
          { t: 'fato', ref: 'normas-118', html: 'Para não ter de refazer o exame, basta pagar a GRU de renovação até a data-limite (validade mais cinco anos). Problemas de pagamento não estendem o prazo.' },
          { t: 'fato', ref: 'normas-119', html: 'Desde 1º de junho de 2023 não se aceita CHA sem data de validade. Quem a portar pode ser autuado.' },
          { t: 'h', txt: 'Perda, roubo ou dano' },
          { t: 'fato', ref: 'normas-120', html: 'Com a CHA digital, não existe mais "segunda via": a cédula extraviada, roubada, furtada ou danificada é <strong>renovada</strong>, em qualquer Capitania, com requerimento e a declaração do anexo 5-D ou um Boletim de Ocorrência.' },
          { t: 'fato', ref: 'normas-121', html: 'Essa renovação depende de os dados do amador estarem no sistema SISAMA; se não estiverem, é preciso novo processo de inscrição.' },
          { t: 'termos', ids: ['cha', 'inspecao-naval', 'gru'] },
          { t: 'check', questoes: [
            Q('m15-l3-1', 'Legislação', 1, 'Qual a validade da CHA para um condutor de 40 anos?',
              ['Cinco anos', 'Dez anos', 'Indeterminada', 'Dois anos'], 1,
              'A CHA vale dez anos a partir da emissão; cinco anos é para quem tem 65 anos ou mais. Não tem validade indeterminada (CHA sem validade não é mais aceita desde 2023). Dois anos é a validade do atestado de treinamento, não da CHA.',
              'NORMAM-211/DPC, art. 5.5.1 b) e c)', NORMAM),
            Q('m15-l3-2', 'Legislação', 2, 'A CHA de um amador venceu há seis anos e ele não pagou a renovação. O que ele precisa fazer para voltar a conduzir?',
              ['Só pagar a GRU de renovação', 'Novo processo de inscrição e exame na última categoria', 'Apresentar a CHA vencida na Inspeção Naval', 'Nada, a CHA não vence'], 1,
              'Passados cinco anos do vencimento sem pagar a renovação, é preciso novo processo de inscrição e exame. Pagar a GRU só resolve dentro do prazo-limite. CHA vencida gera autuação. A CHA vence, sim.',
              'NORMAM-211/DPC, art. 5.5.4, Notas', NORMAM),
            Q('m15-l3-3', 'Legislação', 1, 'Durante quanto tempo o protocolo de renovação da CHA autoriza a conduzir?',
              ['7 dias', '30 dias', '90 dias', 'Até a nova CHA chegar, sem limite'], 1,
              'O protocolo de renovação emitido pela CP/DL/AG autoriza conduzir por até 30 dias. Os outros prazos não constam da norma.',
              'NORMAM-211/DPC, art. 5.5.4, Notas', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 5.5.1 (emissão, CHA digital e validade)', url: NORMAM, ref: 'normas-112' },
            { txt: 'NORMAM-211/DPC, art. 5.5.4 (renovação)', url: NORMAM, ref: 'normas-115' },
            { txt: 'NORMAM-211/DPC, art. 5.5.5 (extravio, roubo e dano)', url: NORMAM, ref: 'normas-120' }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'Álcool, infrações e multas', minutos: 11,
        objetivos: [
          'Saber o limite de alcoolemia e as penalidades por embriaguez.',
          'Conhecer as infrações ligadas à habilitação e suas multas.',
          'Entender as medidas administrativas da Inspeção Naval.'
        ],
        blocos: [
          { t: 'h', txt: 'Álcool e entorpecentes' },
          { t: 'fato', ref: 'normas-138', html: 'Para a NORMAM-211, há <strong>embriaguez</strong> a partir de <strong>0,25 mg de álcool por litro de ar alveolar</strong> (o teste do bafômetro) ou <strong>0,05% no sangue</strong>.' },
          { t: 'fato', ref: 'normas-136', html: 'Conduzir embriagado ou sob efeito de entorpecentes pode levar à <strong>suspensão da CHA por até 120 dias</strong>. A reincidência leva ao <strong>cancelamento</strong>.' },
          { t: 'fato', ref: 'normas-137', html: 'Dois anos depois do cancelamento, o infrator pode pedir nova habilitação, cumprindo todos os requisitos da emissão inicial. (O texto da norma fala em "CHA-MTA", provável herança da NORMAM de moto aquática.)' },
          { t: 'fato', ref: 'normas-139', html: 'Quem se <strong>recusa</strong> ao teste de alcoolemia é notificado pelo inciso VIII do art. 23 do RLESTA e fica impedido de conduzir a embarcação.' },
          { t: 'fato', ref: 'normas-167', html: 'Pela recusa ao teste, a penalidade é multa do grupo C ou suspensão da habilitação por até 30 dias.' },
          { t: 'fato', ref: 'extra-arrais-3-51', html: 'A lista de verificação da NORMAM-211 recomenda evitar bebidas alcoólicas durante a navegação.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Além da multa', html: 'Álcool tira reflexo, equilíbrio e julgamento, e aumenta a perda de calor na água. Quedas na água de pessoas alcoolizadas estão entre os acidentes mais comuns. Comandante sóbrio, sempre.' },
          { t: 'h', txt: 'Habilitação: infrações e multas' },
          { t: 'fato', ref: 'normas-145', html: 'Conduzir embarcação <strong>sem habilitação</strong> é infração do art. 11 do RLESTA, com multa do <strong>grupo E</strong>.' },
          { t: 'fato', ref: 'extra-fechamento-am-03', html: 'Pelo art. 12, I, do RLESTA, <strong>não possuir</strong> a documentação relativa à habilitação (ou ao controle de saúde) dá multa do grupo D. É outra infração, diferente de conduzir sem ser habilitado (art. 11, grupo E).' },
          { t: 'fato', ref: 'normas-146', html: 'Pelo art. 12, II, <strong>não portar</strong> a habilitação dá multa do grupo B ou suspensão da habilitação por até 60 dias.' },
          { t: 'fato', ref: 'normas-169', html: 'Pelo art. 12, III, portar habilitação <strong>vencida</strong> dá multa do grupo A ou suspensão por até 30 dias.' },
          { t: 'fato', ref: 'normas-148', html: 'Descumprir regra do <strong>RIPEAM</strong> pode dar multa do grupo D ou suspensão da habilitação por até 60 dias.' },
          { t: 'fato', ref: 'normas-147', html: 'Os valores das multas no Anexo II do RLESTA: grupo A, de R$ 40,00 a R$ 200,00; B, até R$ 400,00; C, até R$ 800,00; D, até R$ 1.600,00; E, até R$ 2.200,00.' },
          { t: 'fato', ref: 'normas-135', html: 'Por infração ao RLESTA, depois do processo de Auto de Infração, a CHA pode ser suspensa por até doze meses.' },
          { t: 'h', txt: 'Na Inspeção Naval' },
          { t: 'fato', ref: 'normas-140', html: 'O Inspetor Naval pode <strong>apreender a CHA</strong> como medida administrativa.' },
          { t: 'fato', ref: 'normas-141', html: 'Se o condutor não for habilitado e a embarcação estiver navegando, ela é <strong>retirada de tráfego e apreendida</strong>.' },
          { t: 'fato', ref: 'normas-170', html: 'A retirada de tráfego e a apreensão não são necessárias se um condutor habilitado se apresentar durante a abordagem.' },
          { t: 'fato', ref: 'normas-143', html: 'Com a CHA vencida há até 5 anos, a embarcação que estiver navegando é retirada de tráfego.' },
          { t: 'fato', ref: 'normas-144', html: 'Com a CHA vencida há mais de 5 anos, a embarcação é retirada de tráfego e apreendida.' },
          { t: 'fato', ref: 'normas-171', html: 'Quem conduz sem habilitação é autuado pelo art. 11 do RLESTA.' },
          { t: 'fato', ref: 'normas-172', html: 'Quem porta CHA vencida é autuado pelo art. 12, III, do RLESTA.' },
          { t: 'termos', ids: ['inspecao-naval', 'rlesta', 'cha'] },
          { t: 'check', questoes: [
            Q('m15-l4-1', 'Legislação', 1, 'Pela NORMAM-211, a partir de que concentração de álcool no ar alveolar o condutor é considerado embriagado?',
              ['0,05 mg/L', '0,25 mg/L', '0,50 mg/L', 'Qualquer quantidade'], 1,
              'O art. 7.12.2 fixa 0,25 mg de álcool por litro de ar alveolar (ou 0,05% no sangue). 0,05 é o valor em porcentagem no sangue, não em mg/L de ar. 0,50 mg/L não é o critério. A norma usa um limite definido, não "qualquer quantidade".',
              'NORMAM-211/DPC, art. 7.12.2', NORMAM),
            Q('m15-l4-2', 'Legislação', 2, 'Um condutor flagrado embriagado pela primeira vez pode ter a CHA:',
              ['Cancelada na hora', 'Suspensa por até 120 dias', 'Suspensa por até 12 meses, sem processo', 'Apenas advertida'], 1,
              'A primeira vez pode levar à suspensão por até 120 dias; a reincidência leva ao cancelamento. O cancelamento não é a pena da primeira vez. A suspensão de até 12 meses depende de processo de Auto de Infração por infrações ao RLESTA. Não é só advertência.',
              'NORMAM-211/DPC, art. 5.7 e art. 7.12.3', NORMAM),
            Q('m15-l4-3', 'Legislação', 2, 'Um condutor sem habilitação é abordado navegando, mas um amigo habilitado está a bordo e assume a condução. O que diz a norma?',
              ['A embarcação é apreendida de qualquer forma', 'A retirada de tráfego e a apreensão não são necessárias, mas o condutor sem habilitação é autuado', 'Ninguém é autuado', 'O amigo habilitado é quem recebe a multa'], 1,
              'Pela Nota 1 do art. 7.8.1, se um condutor habilitado se apresentar na abordagem, não é preciso retirar de tráfego nem apreender; mas quem conduzia sem habilitação é autuado pelo art. 11 do RLESTA. O proprietário que empresta a não habilitado também pode responder.',
              'NORMAM-211/DPC, arts. 7.8.1 e 7.8.2', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, arts. 5.6 e 5.7 (suspensão e cancelamento)', url: NORMAM, ref: 'normas-136' },
            { txt: 'NORMAM-211/DPC, art. 7.12 (alcoolemia)', url: NORMAM, ref: 'normas-138' },
            { txt: 'NORMAM-211/DPC, arts. 7.7 a 7.9 (medidas administrativas)', url: NORMAM, ref: 'normas-141' },
            { txt: 'Decreto nº 2.596/1998 (RLESTA), arts. 11, 12 e 23, e Anexo II (multas)', url: RLESTA, ref: 'normas-147' }
          ] }
        ]
      },
      {
        id: 'l5', titulo: 'Aluguel, empréstimo e o MPER', minutos: 7,
        objetivos: [
          'Saber quem precisa de habilitação no aluguel com e sem tripulação.',
          'Entender a responsabilidade de quem empresta o barco.',
          'Conhecer o Marinheiro Profissional de Esporte e Recreio (MPER).'
        ],
        blocos: [
          { t: 'h', txt: 'Aluguel de embarcação' },
          { t: 'fato', ref: 'normas-130', html: 'No aluguel <strong>sem tripulação</strong> (o "bareboat"), o locatário precisa de habilitação compatível com a área de navegação. Estrangeiros não residentes têm regra própria (art. 1.16).' },
          { t: 'fato', ref: 'normas-131', html: 'No aluguel <strong>com tripulação</strong>, quem precisa de habilitação (de amador ou de aquaviário) compatível com a área é a tripulação.' },
          { t: 'h', txt: 'Emprestar o barco' },
          { t: 'fato', ref: 'normas-142', html: 'Condutor e proprietário podem responder juntos. Quem <strong>empresta</strong> a embarcação a alguém não habilitado também pode ser autuado pelo art. 11 do RLESTA.' },
          { t: 'h', txt: 'Marinheiro Profissional de Esporte e Recreio (MPER)' },
          { t: 'fato', ref: 'normas-126', html: 'Pela Lei nº 15.283/2025, MPER é quem tem habilitação para conduzir embarcações de esporte e recreio em caráter não comercial e é contratado para isso (o "marinheiro" do barco).' },
          { t: 'fato', ref: 'normas-127', html: 'O MPER deve ser amador habilitado e só pode conduzir nas áreas da sua categoria, sendo proibidas atividades comerciais.' },
          { t: 'h', txt: 'Estrangeiros' },
          { t: 'fato', ref: 'normas-129', html: 'Não há CHA por equivalência a habilitação estrangeira: quem quiser a CHA começa pelo Arrais-Amador e cumpre todo o processo.' },
          { t: 'fato', ref: 'normas-128', html: 'Documentos de habilitação de amador emitidos por Autoridades Marítimas estrangeiras são aceitos, preenchidos em português, espanhol ou inglês, com passaporte (ou documento com foto, no Mercosul).' },
          { t: 'termos', ids: ['amador', 'comandante', 'tripulante'] },
          { t: 'check', questoes: [
            Q('m15-l5-1', 'Legislação', 1, 'Você vai alugar um veleiro sem tripulação para passear numa baía (navegação interior). Do que precisa?',
              ['De nada, quem precisa é o dono', 'De habilitação compatível com a área: pelo menos Arrais-Amador', 'Só de um contrato assinado', 'De habilitação de Capitão-Amador'], 1,
              'No aluguel sem tripulação, o locatário precisa de habilitação compatível com a área; em navegação interior, Arrais-Amador. O dono não conduz. O contrato não substitui a CHA. Capitão não é exigido na interior.',
              'NORMAM-211/DPC, art. 1.15.2 a)', NORMAM),
            Q('m15-l5-2', 'Legislação', 2, 'O que a NORMAM-211 diz sobre o Marinheiro Profissional de Esporte e Recreio (MPER)?',
              ['Pode conduzir em qualquer área, sem habilitação', 'Deve ser amador habilitado, conduzir só na área da sua categoria e não fazer atividade comercial', 'Pode fazer transporte de passageiros pago', 'Precisa ser aquaviário de nível 7'], 1,
              'O art. 5.9 exige que o MPER seja amador habilitado, limita a condução à área da sua categoria e proíbe atividades comerciais. Ele precisa de habilitação, não pode transportar passageiros pagantes e não precisa ser aquaviário.',
              'NORMAM-211/DPC, art. 5.9', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 1.15.2 (aluguel)', url: NORMAM, ref: 'normas-130' },
            { txt: 'NORMAM-211/DPC, art. 7.8.2, Nota (responsabilidade de quem empresta)', url: NORMAM, ref: 'normas-142' },
            { txt: 'NORMAM-211/DPC, art. 5.9 (MPER)', url: NORMAM, ref: 'normas-126' },
            { txt: 'NORMAM-211/DPC, art. 5.8 (estrangeiros)', url: NORMAM, ref: 'normas-129' }
          ] }
        ]
      }
    ]
  });

  /* =====================================================================================
     MÓDULO 16 — Sua habilitação na prática: treinamento, inscrição e prova
     Fonte do roteiro: NORMAM-211/DPC, art. 5.4 (inscrição e exames), 5.4.3 (resumo do procedimento do ARA),
     Anexo 5-A (exames e treinamento), Cap. 6 (ETN); research/taxas_agendamento.md.
     ===================================================================================== */
  var GRU_SIS = 'https://dpc1.marinha.mil.br/scam/emitgruscam/mensagem.asp?v_destino=servicos';
  var DPC_LOCALIZE = 'https://www.marinha.mil.br/dpc/localize-capitania/';
  var DPC_CARTA_CHA = 'https://www.marinha.mil.br/dpc/carta-de-servicos/carteira-de-habilita%C3%A7%C3%A3o-de-amador-cha';
  var DPC_TABELAS = 'https://www.marinha.mil.br/dpc/tabelas-de-indenizacoes';
  var CPBA_CHA = 'https://www.marinha.mil.br/cpba/node/386';
  var PORTARIA_251 = 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/portarias-html/Portaria_251_2025.pdf';

  M.push({
    id: 'm16', titulo: 'Sua habilitação na prática: treinamento, inscrição e prova',
    resumo: 'O roteiro passo a passo para tirar a CHA de Arrais-Amador: treinamento em escola credenciada, documentos, GRU, agendamento, dia da prova e CHA digital no gov.br.',
    licoes: [
      {
        id: 'l1', titulo: 'O caminho completo, em sete passos', minutos: 8,
        objetivos: [
          'Ordenar as etapas da habilitação, do treinamento à CHA digital.',
          'Saber o que cada etapa exige e quem a executa.',
          'Planejar prazos e custos antes de começar.'
        ],
        blocos: [
          { t: 'p', html: 'Estudar a teoria é só uma parte do caminho. Para ter a <strong>CHA</strong> (Carteira de Habilitação de Amador) de Arrais-Amador, você também precisa treinar na água, juntar documentos, pagar uma guia, marcar atendimento e passar numa prova. Quem conhece a ordem das etapas evita idas e vindas à Capitania.' },
          { t: 'p', html: 'O resumo oficial está na própria NORMAM-211 e no site da Marinha. Veja a sequência:' },
          { t: 'fato', ref: 'taxas-23', html: 'O resumo oficial do procedimento de Arrais-Amador é: <strong>treinamento em ETN credenciado → pagamento da GRU → agendamento eletrônico na CP/DL/AG → entrega de documentos e agendamento do exame → exame escrito/eletrônico</strong> (com captura da foto, se aprovado) <strong>→ CHA digital no aplicativo gov.br</strong>.' },
          { t: 'figura', svg: svg('0 0 360 400', 'Fluxograma em sete passos: 1 treinamento náutico de 6 horas, 2 pagar a GRU, 3 agendar no sistema SISAP, 4 comparecer à Capitania com os documentos, 5 prova de 40 questões, 6 foto e aprovação, 7 CHA digital no gov.br',
            '<g font-size="13" fill="currentColor">' +
            '<rect x="20" y="8" width="320" height="42" rx="8" fill="var(--sea-3)" stroke="currentColor"/><text x="36" y="26" font-weight="700">1. Treinamento náutico</text><text x="36" y="43">6 horas com escola credenciada (ETN)</text>' +
            '<rect x="20" y="62" width="320" height="42" rx="8" fill="var(--sea-3)" stroke="currentColor"/><text x="36" y="80" font-weight="700">2. Pagar a GRU</text><text x="36" y="97">guia gerada no site da DPC</text>' +
            '<rect x="20" y="116" width="320" height="42" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="36" y="134" font-weight="700">3. Agendar atendimento</text><text x="36" y="151">sistema eletrônico, com login gov.br</text>' +
            '<rect x="20" y="170" width="320" height="42" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="36" y="188" font-weight="700">4. Ir à Capitania, Delegacia ou Agência</text><text x="36" y="205">documentos + marcar a data da prova</text>' +
            '<rect x="20" y="224" width="320" height="42" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="36" y="242" font-weight="700">5. Fazer a prova</text><text x="36" y="259">40 questões, até 2 horas, nota mínima 5,0</text>' +
            '<rect x="20" y="278" width="320" height="42" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="36" y="296" font-weight="700">6. Aprovado: foto da CHA</text><text x="36" y="313">captura da foto na Capitania</text>' +
            '<rect x="20" y="332" width="320" height="52" rx="8" fill="none" stroke="var(--magenta)" stroke-width="2"/><text x="36" y="352" font-weight="700" fill="var(--magenta)">7. CHA digital no aplicativo gov.br</text><text x="36" y="369">aviso por SMS e/ou e-mail</text>' +
            '<g stroke="currentColor" stroke-width="2" fill="none"><path d="M180 50v12M180 104v12M180 158v12M180 212v12M180 266v12M180 320v12"/></g>' +
            '</g>'),
            legenda: 'As etapas na ordem em que acontecem. O treinamento é o único passo que você faz fora da Capitania.' },
          { t: 'h', txt: 'Onde cada etapa acontece' },
          { t: 'lista', itens: [
            '<strong>Na escola de treinamento:</strong> as seis horas de aula e o atestado.',
            '<strong>Na internet:</strong> a GRU, o pagamento e o agendamento do atendimento, tudo com o seu CPF e a conta gov.br.',
            '<strong>Na Capitania, Delegacia ou Agência:</strong> a entrega dos documentos, a prova e a foto da CHA.',
            '<strong>No celular:</strong> a CHA digital, que chega ao aplicativo gov.br.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Crie a conta gov.br agora', html: 'O agendamento usa login com CPF e senha gov.br, e a CHA digital chega ao mesmo aplicativo. Crie e valide sua conta antes de precisar, para não travar no meio do processo.' },
          { t: 'h', txt: 'Erros que atrasam a habilitação' },
          { t: 'lista', itens: [
            'treinar numa escola sem credenciamento: o atestado não vale;',
            'deixar o atestado de treinamento sem a firma reconhecida ou a assinatura digital gov.br;',
            'levar atestado médico com mais de um ano, ou comprovante de residência antigo;',
            'gerar a GRU para a Organização Militar errada;',
            'faltar à prova: a guia paga não se reaproveita.'
          ] },
          { t: 'p', html: 'As próximas três lições detalham cada um desses pontos, com os fatos oficiais e a fonte de cada um.' },
          { t: 'h', txt: 'Quanto tempo leva' },
          { t: 'p', html: 'Depende da agenda da escola e da Capitania. Alguns prazos são fixos, e você precisa conhecê-los:' },
          { t: 'lista', itens: [
            'a guia (GRU) tem prazo para pagar e para compensar, que mudam conforme a forma de pagamento (veja os dois avisos abaixo);',
            'o atendimento presencial é marcado pela internet, e a data depende da fila da Capitania;',
            'o atestado de treinamento tem validade; não o tire cedo demais.'
          ] },
          { t: 'fato', ref: 'taxas-21', html: 'O sistema de GRU avisa que a guia <strong>só pode ser paga após um dia útil da emissão</strong> e é <strong>compensada em até dois dias úteis</strong> após o pagamento.' },
          { t: 'fato', ref: 'taxas-22', html: 'Segundo a Capitania dos Portos da Bahia, <strong>Pix e cartão de crédito</strong> podem ser usados logo após gerar a GRU e compensam quase na hora; o <strong>boleto</strong> só pode ser pago 24 h depois da geração e compensa em 48 h.' },
          { t: 'p', html: 'Os dois avisos parecem divergir: o do sistema de GRU é geral, e o da Capitania da Bahia separa Pix e cartão do boleto. Na dúvida, siga o que o sistema mostrar na hora de emitir a guia e confirme com a sua Capitania.' },
          { t: 'fato', ref: 'normas-59', html: 'O atestado de treinamento de ARA vale em todo o país por <strong>2 anos</strong> a partir da emissão.' },
          { t: 'h', txt: 'Quanto custa' },
          { t: 'p', html: 'O custo tem três partes. A primeira é o <strong>treinamento</strong>: o preço é da escola, então peça orçamento a mais de uma. A segunda é a <strong>GRU</strong>, o valor da Marinha. A terceira é o <strong>atestado médico</strong>, que você dispensa se tiver CNH válida. A GRU é a única parte tabelada:' },
          { t: 'fato', ref: 'normas-159', html: 'Desde 1º/01/2026, a indenização (GRU) da CHA é <strong>R$ 60,32</strong> para inscrição no exame, renovação, segunda via e correspondência ou equivalência, em todas as categorias.' },
          { t: 'callout', tipo: 'dica', titulo: 'Use o app como roteiro de estudo', html: 'Faça o treinamento prático com a teoria fresca na cabeça. Depois de cada módulo deste curso, resolva o <a href="#/simulados/arrais">simulado de Arrais</a> do tema. Quando passar com folga, marque a prova.' },
          { t: 'termos', ids: ['cha', 'etn', 'gru', 'atestado-de-treinamento', 'capitania-dos-portos'] },
          { t: 'check', questoes: [
            Q('m16-l1-1', 'Habilitação', 1, 'Qual é a ordem correta das etapas do procedimento de Arrais-Amador?',
              ['Prova, treinamento, GRU, agendamento, CHA digital', 'Treinamento, GRU, agendamento, documentos e marcação da prova, exame, CHA digital', 'GRU, prova, treinamento, documentos, CHA digital', 'Documentos, CHA digital, treinamento, GRU, prova'], 1,
              'O resumo do art. 5.4.3 da NORMAM-211 começa pelo treinamento em ETN credenciado, passa pela GRU, pelo agendamento e pela entrega dos documentos, e termina no exame e na CHA digital. As outras ordens colocam a prova ou a CHA antes de etapas que a exigem.',
              'NORMAM-211/DPC, art. 5.4.3', NORMAM),
            Q('m16-l1-2', 'Habilitação', 1, 'Qual é o valor da GRU da CHA em 2026?',
              ['R$ 41,67', 'R$ 60,32', 'R$ 230,32', 'Não há cobrança'], 1,
              'A Tabela de Indenizações de 2026 fixa R$ 60,32 para a inscrição no exame de qualquer categoria. R$ 41,67 é a segunda via de certificados e licenças, outro serviço. R$ 230,32 é o credenciamento da escola, pago por ela. A cobrança existe.',
              'Portaria nº 251/DPC, de 19/12/2025, Anexo A', PORTARIA_251)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 5.4.3 (resumo do procedimento do ARA)', url: NORMAM, ref: 'taxas-23' },
            { txt: 'Portaria nº 251/DPC/2025, Tabela de Indenizações (Anexo A)', url: PORTARIA_251, ref: 'normas-159' },
            { txt: 'Sistema de emissão de GRU da DPC', url: GRU_SIS, ref: 'taxas-21' },
            { txt: 'Capitania dos Portos da Bahia, passo a passo da CHA (pagamento da GRU por Pix, cartão e boleto)', url: CPBA_CHA, ref: 'taxas-22' },
            { txt: 'NORMAM-211/DPC, Anexo 5-E (validade do atestado)', url: NORMAM, ref: 'normas-59' }
          ] }
        ]
      },
      {
        id: 'l2', titulo: 'O treinamento náutico: 6 horas e o atestado', minutos: 10,
        objetivos: [
          'Citar a carga mínima do treinamento (teoria e prática).',
          'Reconhecer uma escola e uma embarcação de treinamento regulares.',
          'Entender as regras de validade e de emissão do atestado.'
        ],
        blocos: [
          { t: 'p', html: 'Para Arrais-Amador, o treinamento prático é <strong>obrigatório</strong>. Você não faz a inscrição sem o atestado, e o atestado só sai depois das aulas.' },
          { t: 'fato', ref: 'normas-45', html: 'Para Arrais-Amador é obrigatório o <strong>Atestado de Treinamento Náutico</strong> (anexo 5-E), com firma reconhecida em cartório ou assinatura digital GOV.BR do representante da ETN, do instrutor e do aluno.' },
          { t: 'fato', ref: 'normas-46', html: 'O atestado é obtido com aulas práticas em <strong>estabelecimento de treinamento náutico</strong> ou <strong>pessoa física credenciados</strong> na Capitania.' },
          { t: 'h', txt: 'Duas horas de teoria, quatro de prática' },
          { t: 'figura', svg: svg('0 0 360 150', 'Barra de carga horária: 2 horas de teoria a bordo e 4 horas de prática com a embarcação em movimento, total mínimo de 6 horas',
            '<g font-size="13" fill="currentColor">' +
            '<rect x="20" y="40" width="107" height="50" rx="6" fill="var(--sea-3)" stroke="currentColor"/><text x="73" y="62" text-anchor="middle" font-weight="700">Teoria</text><text x="73" y="80" text-anchor="middle">2 h</text>' +
            '<rect x="127" y="40" width="213" height="50" rx="6" fill="var(--sea-1)" stroke="currentColor"/><text x="233" y="62" text-anchor="middle" font-weight="700">Prática em movimento</text><text x="233" y="80" text-anchor="middle">4 h</text>' +
            '<text x="180" y="125" text-anchor="middle" font-weight="700" fill="var(--magenta)">mínimo de 6 horas no total</text>' +
            '</g>'),
            legenda: 'A teoria é dada no ambiente da embarcação. A prática exige a embarcação em movimento.' },
          { t: 'fato', ref: 'normas-56', html: 'A parte teórica do treinamento de ARA tem <strong>2 h</strong> e deve ser dada <strong>no ambiente da embarcação</strong> (atracada, fundeada, no berço ou em movimento).' },
          { t: 'fato', ref: 'normas-57', html: 'A parte prática tem <strong>4 h</strong>, com a embarcação em movimento, e inclui demonstrações de <strong>luzes e regras de governo, ação do leme e hélice, atracação, desatracação, fundeio e suspender</strong>.' },
          { t: 'fato', ref: 'normas-58', html: 'O atestado de treinamento de ARA exige <strong>no mínimo seis horas</strong> de treinamento teórico e prático.' },
          { t: 'p', html: 'Repare no conteúdo da prática: é o que você viu nos módulos de manobras e de luzes. Chegue ao treinamento sabendo o básico. Você aproveita mais as quatro horas, que passam rápido.' },
          { t: 'h', txt: 'Quem conduz e quem ensina' },
          { t: 'fato', ref: 'normas-62', html: 'No treinamento, <strong>o candidato conduz a embarcação</strong> e o instrutor o supervisiona a bordo, pronto para assumir o comando.' },
          { t: 'fato', ref: 'normas-63', html: 'O instrutor de ARA precisa de pelo menos <strong>dois anos de habilitação</strong> como ARA, MSA ou CPA (ou correspondência profissional).' },
          { t: 'fato', ref: 'normas-65', html: 'As embarcações de treinamento de ARA devem ter <strong>faixa ou placa amarela</strong> de pelo menos 20 cm com &ldquo;TREINAMENTO NÁUTICO&rdquo; em preto.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Confira antes de pagar', html: 'Peça à escola o comprovante de credenciamento na Capitania. Escola sem credenciamento não emite atestado válido, e você perde o dinheiro e o tempo. Veja também se o barco de treinamento tem a faixa amarela.' },
          { t: 'fato', ref: 'normas-64', html: 'Um ETN-A/PF (estabelecimento ou pessoa física) só pode atuar nos <strong>municípios da jurisdição da Capitania que o credenciou</strong>.' },
          { t: 'p', html: 'Isso limita onde a <em>escola</em> pode dar aula, não onde o <em>atestado</em> vale. O atestado vale no país inteiro, como você viu na lição anterior.' },
          { t: 'h', txt: 'Como escolher a escola' },
          { t: 'lista', itens: [
            'Peça o comprovante de credenciamento na Capitania e confira se vale para o local de treinamento.',
            'Pergunte quem é o instrutor e há quanto tempo ele é habilitado.',
            'Veja o barco: faixa amarela, colete para todos, estado geral e tamanho parecido com o que você pretende conduzir.',
            'Pergunte em que tipo de embarcação é o treinamento (lancha, veleiro) e escolha o mais próximo do seu objetivo.',
            'Peça o orçamento por escrito, com o que está incluso: horas, combustível, atestado e material.'
          ] },
          { t: 'h', txt: 'Como aproveitar as quatro horas' },
          { t: 'p', html: 'A prática passa rápido. Faça o seguinte para não desperdiçá-la:' },
          { t: 'lista', itens: [
            'estude antes os módulos de luzes, regras de governo, nós e manobras;',
            'leve água, protetor solar, boné e calçado fechado com sola antiderrapante;',
            'peça para repetir a atracação e o fundeio: são as manobras em que mais gente erra;',
            'pergunte tudo, inclusive o que parece óbvio. O instrutor está ali para isso.'
          ] },
          { t: 'h', txt: 'Regras do atestado' },
          { t: 'fato', ref: 'normas-60', html: 'Podem ser somados vários atestados de treinamento de ARA, desde que <strong>cada um tenha pelo menos uma hora</strong>.' },
          { t: 'fato', ref: 'normas-61', html: 'O atestado deve ser emitido em até <strong>30 dias corridos</strong> após o último treinamento.' },
          { t: 'callout', tipo: 'dica', titulo: 'Onde encontrar uma escola', html: 'Abra a aba <a href="#/locais">Onde estudar</a>. Ela lista escolas, iates clubes e outros locais de treinamento por região, com a fonte de cada um. Mesmo assim, confirme o credenciamento com a Capitania da sua região antes de matricular.' },
          { t: 'termos', ids: ['etn', 'atestado-de-treinamento', 'arrais-amador'] },
          { t: 'check', questoes: [
            Q('m16-l2-1', 'Habilitação', 1, 'Qual é a carga horária mínima do treinamento náutico para Arrais-Amador?',
              ['4 horas, só de prática', '6 horas, sendo 2 de teoria e 4 de prática', '10 horas de prática', '2 horas de teoria'], 1,
              'A NORMAM-211 pede 2 horas de teoria, dadas no ambiente da embarcação, e 4 horas de prática com a embarcação em movimento, num mínimo de 6 horas. Só 4 horas ou só 2 horas não bastam, e 10 horas passa do mínimo exigido.',
              'NORMAM-211/DPC, Anexo 5-A, Seção II', NORMAM),
            Q('m16-l2-2', 'Habilitação', 2, 'Por quanto tempo o atestado de treinamento de Arrais-Amador vale?',
              ['30 dias', '1 ano', '2 anos, em todo o país', '10 anos, só na Capitania que o emitiu'], 2,
              'O atestado vale em todo o território nacional por 2 anos a partir da emissão. Os 30 dias são o prazo para a escola emitir o atestado depois do último treinamento. Os 10 anos são a validade da CHA, e o atestado não é restrito a uma Capitania.',
              'NORMAM-211/DPC, Anexo 5-E, Obs. 1', NORMAM),
            Q('m16-l2-3', 'Habilitação', 2, 'Durante o treinamento, quem conduz a embarcação?',
              ['Somente o instrutor', 'O candidato, supervisionado pelo instrutor a bordo', 'Um marinheiro profissional', 'Ninguém: o treinamento é só teórico'], 1,
              'No treinamento o candidato conduz, e o instrutor fica a bordo pronto para assumir. Se só o instrutor conduzisse, você não praticaria. A parte prática de 4 horas exige a embarcação em movimento.',
              'NORMAM-211/DPC, Anexo 5-A, Seção II', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II (treinamento do ARA)', url: NORMAM, ref: 'normas-58' },
            { txt: 'NORMAM-211/DPC, Anexo 5-E (atestado de treinamento)', url: NORMAM, ref: 'normas-45' },
            { txt: 'NORMAM-211/DPC, Cap. 6, Seção II (ETN e pessoa física credenciados)', url: NORMAM, ref: 'normas-64' },
            { txt: 'DPC, Navegador Amador', url: DPC_AMADOR }
          ] }
        ]
      }
      ,{
        id: 'l3', titulo: 'Documentos, GRU e agendamento', minutos: 12,
        objetivos: [
          'Montar a pasta de documentos exigida na inscrição.',
          'Gerar e pagar a GRU no site correto.',
          'Agendar o atendimento e saber em qual Capitania ser atendido.'
        ],
        blocos: [
          { t: 'p', html: 'Com o atestado de treinamento na mão, falta a parte burocrática. Ela é simples, mas não perdoa esquecimento: faltou um papel, você volta outro dia. Esta lição é a lista de conferência.' },
          { t: 'h', txt: 'Requisitos básicos' },
          { t: 'fato', ref: 'taxas-41', html: 'O exame é prova escrita ou eletrônica <strong>em português</strong>. O candidato precisa ter pelo menos <strong>18 anos</strong> e saber ler e escrever.' },
          { t: 'h', txt: 'A pasta de documentos' },
          { t: 'p', html: 'Leve os originais e as cópias. A autenticação das cópias pode ser feita no próprio balcão, comparando com o original. Os documentos são:' },
          { t: 'fato', ref: 'normas-38', html: '<strong>Identidade:</strong> cópia autenticada de documento oficial de identificação com foto e dentro da validade (a autenticação pode ser feita no próprio local).' },
          { t: 'fato', ref: 'normas-39', html: '<strong>CPF:</strong> cópia autenticada do CPF, sendo aceito documento de identificação que contenha o CPF.' },
          { t: 'fato', ref: 'normas-40', html: '<strong>Comprovante de residência:</strong> contrato de locação ou conta de luz, água, gás ou telefone com vencimento há até 120 dias, ou a Declaração de Residência (anexo 2-G).' },
          { t: 'fato', ref: 'normas-41', html: '<strong>Comprovante de pagamento da GRU</strong> do serviço de emissão da CHA, gerada na página da DPC em &ldquo;Serviços da Diretoria&rdquo;.' },
          { t: 'fato', ref: 'normas-42', html: '<strong>Atestado médico</strong> emitido há menos de um ano, comprovando bom estado psicofísico e informando limitações (ex.: lentes, aparelho auditivo, restrição noturna).' },
          { t: 'fato', ref: 'normas-43', html: 'O atestado médico é <strong>dispensado</strong> para quem apresentar CNH dentro da validade.' },
          { t: 'fato', ref: 'normas-45', html: '<strong>Atestado de Treinamento Náutico</strong> (anexo 5-E), com firma reconhecida em cartório ou assinatura digital GOV.BR do representante da ETN, do instrutor e do aluno.' },
          { t: 'callout', tipo: 'dica', titulo: 'Comprovante de residência: leve o mais recente', html: 'Algumas Capitanias publicam prazos mais curtos que os 120 dias da norma (a CPRN, por exemplo, cita 90 dias). Para não ter surpresa, leve uma conta recente e a Declaração de Residência como reserva.' },
          { t: 'fato', ref: 'normas-44', html: 'Havendo dúvida sobre a capacidade motora do candidato, exige-se <strong>laudo médico circunstanciado</strong> e a Capitania agenda uma avaliação técnica.' },
          { t: 'h', txt: 'A GRU, passo a passo' },
          { t: 'p', html: 'A <strong>GRU</strong> (Guia de Recolhimento da União) é a guia de pagamento do serviço. Gere-a somente no site da Diretoria de Portos e Costas, em marinha.mil.br. Desconfie de qualquer site que cobre para &ldquo;gerar a guia&rdquo; ou &ldquo;agilizar a CHA&rdquo;: a guia da Marinha é gratuita de gerar, você só paga o valor dela.' },
          { t: 'lista', ordenada: true, itens: [
            'Entre na página da DPC e abra &ldquo;Serviços da Diretoria&rdquo;.',
            'Acesse o sistema de GRU, em &ldquo;Serviços Administrativos, Educacionais e Vistorias&rdquo;.',
            'Aceite o aviso e escolha a <strong>Organização Militar</strong> onde será atendido.',
            'Escolha a categoria <strong>Amador</strong> e o tipo <strong>Serviços Administrativos</strong>.',
            'Marque o item de inscrição para exame e emissão da CHA e preencha seus dados.',
            'Pague por Pix, cartão ou boleto e <strong>guarde o número da guia</strong>: ele é pedido no agendamento.'
          ] },
          { t: 'fato', ref: 'normas-162', html: 'Ao gerar a GRU no site da DPC, escolhe-se &ldquo;Serviços Administrativos&rdquo; e depois &ldquo;Inscrição para exame de habilitação de Amador e emissão da Carteira de Habilitação de Amador - CHA&rdquo;.' },
          { t: 'fato', ref: 'normas-159', html: 'Desde 1º/01/2026, a indenização (GRU) da CHA é <strong>R$ 60,32</strong>, em todas as categorias.' },
          { t: 'fato', ref: 'normas-161', html: 'Os valores da Portaria nº 251/2025 foram reajustados pelo IPCA apurado entre novembro de 2024 e novembro de 2025.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'O valor muda com o tempo', html: 'A tabela é reajustada por portaria e tende a mudar a cada ano. Antes de pagar, confira o valor vigente na página oficial de <a href="https://www.marinha.mil.br/dpc/tabelas-de-indenizacoes" target="_blank" rel="noopener">Tabelas de Indenizações</a> da DPC.' },
          { t: 'fato', ref: 'taxas-22', html: 'Segundo a Capitania dos Portos da Bahia, <strong>Pix e cartão de crédito</strong> podem ser usados logo após gerar a GRU e compensam quase na hora; o <strong>boleto</strong> só pode ser pago 24 h depois da geração e compensa em 48 h.' },
          { t: 'h', txt: 'Agendar o atendimento' },
          { t: 'fato', ref: 'taxas-24', html: 'O agendamento eletrônico de atendimento (SISAP) é feito pela internet. A CPBA indica o endereço <strong>atendimento-dpc.marinha.mil.br/sisap/agendamento</strong>, e o menu do site da DPC aponta para sistemas.dpc.mar.mil.br/sisap/agendamento.' },
          { t: 'fato', ref: 'taxas-25', html: 'Na CPBA, depois que a GRU compensa, o atendimento presencial é agendado no SISAP com login do <strong>CPF e senha gov.br</strong>. O serviço a escolher é &ldquo;CHA ... Inscrição para o exame e emissão para Arrais-Amador, Mestre-Amador e Capitão-Amador&rdquo;.' },
          { t: 'fato', ref: 'taxas-26', html: 'Na CPBA, no atendimento agendado o candidato entrega os documentos, marca data e horário da prova, recebe um protocolo e tem a foto capturada.' },
          { t: 'fato', ref: 'taxas-27', html: 'Se o processo ficar &ldquo;em exigência&rdquo; (falta algo), a pendência deve ser resolvida em até 60 dias; depois disso o pedido é indeferido (regra informada pela CPBA).' },
          { t: 'fato', ref: 'taxas-30', html: 'A CHA é solicitada <strong>presencialmente</strong> no Grupo de Atendimento ao Público (GAP) da Capitania, Delegacia ou Agência.' },
          { t: 'fato', ref: 'taxas-31', html: 'O prazo de atendimento da CHA informado pela DPC é de <strong>15 dias úteis</strong> a partir do recebimento da documentação, sem pendências.' },
          { t: 'h', txt: 'Em qual Capitania ser atendido?' },
          { t: 'fato', ref: 'extra-arrais-3-55', html: 'A NORMAM-211 manda apresentar os documentos &ldquo;na CP/DL/AG ou no local estabelecido por essas Organizações Militares&rdquo; e <strong>não cita o município de residência</strong>. Já a Carta de Serviços da DPC fala na unidade &ldquo;da jurisdição&rdquo;.' },
          { t: 'p', html: 'Na prática, muita gente faz a prova na Capitania próxima da escola onde treinou, ou da cidade onde vai navegar. Se você não mora perto da unidade que escolheu, <strong>ligue ou mande mensagem para o atendimento dela</strong> antes de pagar a GRU. A guia sai em nome de uma Organização Militar específica, e trocar depois dá trabalho. As regras de agendamento, os horários e o WhatsApp variam de Capitania para Capitania.' },
          { t: 'fato', ref: 'taxas-32', html: 'Para saber em qual Capitania, Delegacia ou Agência será atendido, a DPC indica a página &ldquo;Localize a Capitania Mais Próxima&rdquo;, que lista as OMs por UF com seus municípios de jurisdição.' },
          { t: 'termos', ids: ['gru', 'cha', 'delegacia', 'agencia', 'capitania-dos-portos'] },
          { t: 'check', questoes: [
            Q('m16-l3-1', 'Habilitação', 1, 'O candidato que tem CNH dentro da validade, na inscrição para Arrais-Amador:',
              ['Fica dispensado do atestado médico', 'Fica dispensado da GRU', 'Fica dispensado do treinamento náutico', 'Fica dispensado da prova'], 0,
              'A NORMAM-211 dispensa o atestado médico de quem apresenta CNH válida. A GRU, o atestado de treinamento e a prova continuam obrigatórios; a CNH não os substitui.',
              'NORMAM-211/DPC, art. 5.4.1 e), Nota', NORMAM),
            Q('m16-l3-2', 'Habilitação', 2, 'Qual é o prazo do comprovante de residência (conta de luz, água, gás ou telefone) previsto na NORMAM-211?',
              ['Vencimento há até 30 dias', 'Vencimento há até 120 dias', 'Vencimento há até 5 anos', 'Qualquer data'], 1,
              'A norma aceita conta com vencimento ocorrido há até 120 dias, ou a Declaração de Residência (anexo 2-G). Algumas Capitanias pedem prazos menores, por isso leve uma conta recente. 30 dias e 5 anos não estão na norma, e conta antiga demais é recusada.',
              'NORMAM-211/DPC, art. 5.4.1 c)', NORMAM),
            Q('m16-l3-3', 'Habilitação', 2, 'Onde se gera a GRU da inscrição para a CHA?',
              ['Em qualquer site de despachante que cobre pela guia', 'No site da DPC, em Serviços da Diretoria > Serviços Administrativos', 'Só no balcão da Capitania, em dinheiro', 'No aplicativo da escola de treinamento'], 1,
              'A norma manda acessar a página da DPC e o ícone Serviços da Diretoria; no formulário se escolhe Serviços Administrativos e o item da CHA. Despachantes e aplicativos de terceiros não emitem a guia oficial, e a emissão não é feita só no balcão.',
              'NORMAM-211/DPC, art. 5.4.1 d)', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, art. 5.4.1 (documentos de inscrição)', url: NORMAM, ref: 'normas-38' },
            { txt: 'Sistema de emissão de GRU da DPC', url: GRU_SIS, ref: 'normas-162' },
            { txt: 'DPC, Tabelas de Indenizações (Portaria nº 251/2025)', url: DPC_TABELAS, ref: 'normas-160' },
            { txt: 'Capitania dos Portos da Bahia, passo a passo da CHA (agendamento e GRU)', url: CPBA_CHA, ref: 'taxas-25' },
            { txt: 'DPC, Carta de Serviços: Carteira de Habilitação de Amador', url: DPC_CARTA_CHA, ref: 'taxas-31' },
            { txt: 'DPC, Localize a Capitania Mais Próxima', url: DPC_LOCALIZE, ref: 'taxas-32' }
          ] }
        ]
      },
      {
        id: 'l4', titulo: 'O dia da prova e a CHA digital', minutos: 10,
        objetivos: [
          'Saber o formato da prova e o que levar.',
          'Entender o que acontece se você for reprovado ou faltar.',
          'Obter e portar a CHA digital no aplicativo gov.br.'
        ],
        blocos: [
          { t: 'p', html: 'Chegou o dia. A prova de Arrais-Amador é objetiva e cobra o que você estudou nos módulos anteriores: luzes e sinais, regras de governo, balizamento, nós e manobras, segurança, rádio e legislação. Quem chega descansado, com os documentos certos e com tempo sobrando, tem meio caminho andado.' },
          { t: 'h', txt: 'O formato da prova' },
          { t: 'fato', ref: 'normas-98', html: 'O exame de Arrais-Amador é prova eletrônica ou escrita com <strong>40 questões</strong> e duração máxima de <strong>duas horas</strong>.' },
          { t: 'fato', ref: 'normas-99', html: 'A prova vale <strong>10,0 pontos</strong> e aprova com pelo menos <strong>5,0</strong>.' },
          { t: 'figura', svg: svg('0 0 360 150', 'Resumo da prova de Arrais-Amador: 40 questões, até 2 horas, nota de 0 a 10, aprovação com 5,0 ou mais, ou seja, 20 acertos se todas valem o mesmo',
            '<g font-size="13" fill="currentColor" text-anchor="middle">' +
            '<rect x="12" y="14" width="104" height="80" rx="8" fill="var(--sea-3)" stroke="currentColor"/><text x="64" y="52" font-size="26" font-weight="700">40</text><text x="64" y="74">questões</text>' +
            '<rect x="128" y="14" width="104" height="80" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="180" y="52" font-size="26" font-weight="700">2 h</text><text x="180" y="74">tempo máximo</text>' +
            '<rect x="244" y="14" width="104" height="80" rx="8" fill="none" stroke="var(--magenta)" stroke-width="2"/><text x="296" y="52" font-size="26" font-weight="700" fill="var(--magenta)">5,0</text><text x="296" y="74">nota mínima</text>' +
            '<text x="180" y="124">de uma nota máxima de 10,0</text></g>'),
            legenda: 'Em duas horas, são 3 minutos por questão. Dá tempo de ler com calma e de revisar.' },
          { t: 'fato', ref: 'normas-51', html: 'Exceção (art. 5.4.2 a): <strong>só para Arrais-Amador</strong>, o candidato <strong>analfabeto</strong> que dependa de embarcação a motor e more em <strong>local remoto</strong> pode fazer <strong>prova oral</strong>, a critério da Capitania.' },
          { t: 'h', txt: 'O que levar' },
          { t: 'fato', ref: 'normas-100', html: 'Na prova de Arrais-Amador o candidato leva só <strong>protocolo de inscrição</strong>, <strong>documento de identificação</strong> e <strong>caneta azul ou preta</strong>.' },
          { t: 'callout', tipo: 'dica', titulo: 'Lista da véspera', html: 'Separe protocolo, documento com foto e duas canetas, azul ou preta. Chegue com antecedência e confirme o endereço e o horário no site da Capitania ou com o atendimento dela. Em muitas unidades a prova é em computador, mas isso varia.' },
          { t: 'h', txt: 'Durante a prova' },
          { t: 'lista', itens: [
            'Leia o enunciado inteiro, até o fim. Palavras como <em>exceto</em>, <em>não</em> e <em>somente</em> mudam a resposta.',
            'Elimine primeiro as alternativas que você sabe que estão erradas.',
            'Não gaste muito tempo numa questão difícil: marque, siga em frente e volte depois.',
            'Reserve os últimos minutos para revisar as respostas marcadas.'
          ] },
          { t: 'fato', ref: 'normas-101', html: 'As provas de ARA e MSA são <strong>destruídas</strong> logo após a correção e a apresentação dos resultados, para proteger o banco de questões.' },
          { t: 'p', html: 'Isso quer dizer que você não leva a prova para casa nem vê o gabarito depois. Se for reprovado, o jeito de se preparar é revisar os módulos em que você tem mais dúvida e refazer os simulados.' },
          { t: 'fato', ref: 'taxas-28', html: 'Na CPBA, as provas de Arrais-Amador ocorrem de segunda a sexta-feira, em computadores, com 40 questões, e o resultado sai ao final da prova. A página da CPBA não fala do Mestre-Amador: para o MSA, as 40 questões vêm do Anexo 5-A da NORMAM-211, e o dia e o formato você confirma com a sua Capitania.' },
          { t: 'h', txt: 'Reprovou ou faltou?' },
          { t: 'fato', ref: 'normas-102', html: 'A <strong>GRU</strong> de quem foi reprovado ou faltou <strong>não pode ser reaproveitada</strong>, e o novo exame exige nova inscrição (vale para CPA, MSA e ARA).' },
          { t: 'fato', ref: 'taxas-29', html: 'Na CPBA, reprovado ou faltoso paga nova GRU e protocola novo pedido, e a segunda prova só pode ser feita <strong>cinco dias úteis</strong> após a anterior (regra informada pela CPBA; outras unidades podem ter regras próprias).' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Faltar custa o mesmo que reprovar', html: 'Se você não puder ir, avise e remarque o quanto antes, pelo canal da Capitania. A norma diz que a GRU de quem faltou não é reaproveitada. Pergunte ao atendimento se há como reagendar antes da data.' },
          { t: 'h', txt: 'Aprovado: a CHA digital' },
          { t: 'fato', ref: 'normas-111', html: 'A CHA digital fica disponível no aplicativo <strong>&ldquo;Gov.Br&rdquo;</strong> depois que o cidadão é avisado por SMS e/ou e-mail.' },
          { t: 'fato', ref: 'normas-110', html: 'Com a CHA digital (QR Code), o condutor deve <strong>portar dispositivo que permita a consulta</strong> na Inspeção Naval. Também vale impressa, se o QR Code estiver legível.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Celular sem bateria não é CHA', html: 'Na água, o celular se molha, descarrega e perde sinal. Baixe a CHA e imprima uma cópia legível, guardada em saco hermético. Assim você está em dia numa abordagem da Inspeção Naval mesmo sem bateria.' },
          { t: 'p', html: 'A validade, a renovação e as regras de porte da CHA estão no módulo de legislação. Depois de aprovado, vale também acompanhar a data de vencimento: renovar a tempo é bem mais simples que refazer a prova.' },
          { t: 'callout', tipo: 'dica', titulo: 'Próximos passos', html: 'Treine com o <a href="#/simulados/arrais">simulado de Arrais</a> até acertar com folga, revise as cartas do baralho abaixo e use a aba <a href="#/locais">Onde estudar</a> para achar escolas de treinamento, iates clubes e Capitanias perto de você.' },
          { t: 'flash', deck: 'arrais-3', txt: 'Revise segurança, rádio e legislação com o baralho desta parte do curso.' },
          { t: 'check', questoes: [
            Q('m16-l4-1', 'Habilitação', 1, 'Qual é o formato da prova de Arrais-Amador?',
              ['20 questões em 1 hora, aprovação com 7,0', '40 questões em até 2 horas, aprovação com pelo menos 5,0', '60 questões em 3 horas, aprovação com 6,0', '40 questões em até 4 horas, aprovação com 7,0'], 1,
              'A NORMAM-211 fixa 40 questões, no máximo 2 horas, nota de 0 a 10 e aprovação com 5,0 ou mais. Os outros formatos misturam números de outras provas: o Capitão-Amador tem 4 horas, por exemplo.',
              'NORMAM-211/DPC, Anexo 5-A, Seção I, itens 3.b e 3.c', NORMAM),
            Q('m16-l4-2', 'Habilitação', 1, 'O que o candidato leva para a prova de Arrais-Amador?',
              ['Apostila, calculadora e celular', 'Protocolo de inscrição, documento de identificação e caneta azul ou preta', 'Somente a GRU paga', 'Carta náutica e instrumentos de desenho'], 1,
              'A norma permite levar só o protocolo, o documento de identificação e caneta azul ou preta. Apostila, calculadora e celular não são permitidos. Carta e material de desenho são do Mestre-Amador, que tem questões com carta náutica.',
              'NORMAM-211/DPC, Anexo 5-A, Seção I, item 3.d', NORMAM),
            Q('m16-l4-3', 'Habilitação', 2, 'Quem foi reprovado ou faltou à prova de Arrais-Amador:',
              ['Reaproveita a mesma GRU em outra data', 'Precisa de nova inscrição, e a GRU paga não é reaproveitada', 'É dispensado da prova na segunda tentativa', 'Perde o direito de se habilitar'], 1,
              'A GRU de quem foi reprovado ou faltou não pode ser reutilizada, e o novo exame exige nova inscrição. Não há dispensa da prova na segunda tentativa, e quem não passou também não perde o direito de tentar de novo, pagando a nova guia.',
              'NORMAM-211/DPC, Anexo 5-A, Seção I, item 3.g', NORMAM),
            Q('m16-l4-4', 'Habilitação', 2, 'Onde o aprovado obtém a CHA digital?',
              ['Num site de despachante', 'No aplicativo gov.br, depois do aviso por SMS e/ou e-mail', 'Só impressa, retirada no balcão', 'Na escola de treinamento'], 1,
              'A CHA digital fica no aplicativo gov.br depois do aviso por SMS e/ou e-mail. Ela também vale impressa, se o QR Code estiver legível, mas o condutor precisa portar dispositivo que permita a consulta. Despachante e escola não emitem a CHA.',
              'NORMAM-211/DPC, art. 5.5.1 a)', NORMAM)
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção I (exames de ARA)', url: NORMAM, ref: 'normas-98' },
            { txt: 'NORMAM-211/DPC, art. 5.5.1 (CHA digital)', url: NORMAM, ref: 'normas-110' },
            { txt: 'Capitania dos Portos da Bahia, exame de Arrais-Amador (regra local de reprova)', url: CPBA_CHA, ref: 'taxas-29' },
            { txt: 'DPC, Navegador Amador', url: DPC_AMADOR }
          ] }
        ]
      }
    ]
  });

  /* @@MODULOS@@ */

  VL.dado('cursos/arrais-3', { modulos: M });
})();
