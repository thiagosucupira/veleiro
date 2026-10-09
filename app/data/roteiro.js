/* Dados da aba Roteiro: a escada da habilitação, do leigo à travessia transatlântica como comandante.
   Regras:
   - Todo número regulatório (norma, taxa, prazo, documento, prova) vem com `ref` apontando para um fato de data/fontes.js
     (o selo "a confirmar" aparece sozinho). Nada regulatório fica solto no texto.
   - Metas de milhas, dias e noites ("mar"), horas de estudo e prática ("tempo") são RECOMENDAÇÕES DO APP, calibradas
     pelo benchmark do RYA e da ASA (fatos internacional-*). A NORMAM-211 não exige experiência de mar (fato normas-49).
   - Preços de cursos: `custo.grupos[].pontos[]` apontam para um local de data/locais.js (campo preco, lido em 2026-10-07);
     a faixa mostrada na tela é calculada em tempo de execução a partir desses pontos. Valor oficial: só com fato (GRU).
   - Alias de rota: #/roteiro/<id> (ou um dos `alias`). */
(function () {
  'use strict';

  /* ---------- trechos reaproveitados ---------- */
  var DOCS_INSCRICAO = [
    { html: 'Documento oficial de identificação com foto, dentro da validade (cópia autenticada; a autenticação pode ser feita no próprio local).', ref: 'normas-38' },
    { html: 'CPF (cópia autenticada). Vale um documento de identidade que já contenha o CPF.', ref: 'normas-39' },
    { html: 'Comprovante de residência (contrato de locação ou conta de luz, água, gás ou telefone) ou a Declaração de Residência (anexo 2-G).', ref: 'normas-40' },
    { html: 'Comprovante de pagamento da GRU da CHA, gerada no site da DPC em “Serviços da Diretoria”.', ref: 'normas-41' },
    { html: 'Atestado médico emitido há menos de um ano, com o estado psicofísico e as limitações (lentes, aparelho auditivo, restrição noturna). Quem apresenta CNH dentro da validade fica dispensado.', ref: 'normas-42' }
  ];
  var GRU = { html: 'GRU da CHA: R$ 60,32 em 2026, para inscrição no exame, renovação, segunda via e equivalência, em todas as categorias. A tabela é reajustada todo ano.', ref: 'taxas-01' };
  var GRU_REPROVOU = { html: 'Quem é reprovado ou falta à prova perde a GRU: ela não pode ser reaproveitada, e o novo exame exige nova inscrição.', ref: 'normas-102' };

  /* ---------- as doze etapas ---------- */
  var ETAPAS = [
    /* 1 */
    {
      id: 'vela-basica', alias: ['e1', 'dingue'], n: 1, tipo: 'curso', rotulo: 'Vela em dingue', titulo: 'Curso de vela em dingue ou monotipo',
      resumo: 'Aprender a velejar num barco pequeno e responsivo (dingue, ILCA, Optimist adulto, catamarã de praia ou outro monotipo), onde cada erro de regulagem aparece na hora.',
      porque: 'É a melhor escola de sensibilidade ao vento. Quem sentiu a vela bater e o barco adernar num dingue entende o veleiro de cruzeiro sem decorar regras.',
      pre: [
        { html: 'Nenhum conhecimento prévio de vela. Saber nadar e aceitar usar colete salva-vidas o tempo todo.' }
      ],
      permite: [
        { html: 'Embarcação miúda é a de comprimento menor ou igual a 6 metros. Dingues e monotipos costumam se encaixar nessa definição.', ref: 'normas-15' },
        { html: 'Só estão dispensados de habilitação os condutores de dispositivos flutuantes e de embarcações miúdas sem propulsão mecânica, usados para recreio ou esporte.', ref: 'normas-37' },
        { html: 'A CHA de Veleiro é facultativa e se destina a embarcações miúdas (até 6 m) de propulsão exclusivamente a vela.', ref: 'normas-31' }
      ],
      docs: [{ html: 'Nenhum documento oficial é necessário para fazer o curso. Pergunte à escola se ela pede termo de responsabilidade ou atestado médico.' }],
      custo: {
        grupos: [{
          rotulo: 'Cursos de vela em dingue ou monotipo para adultos (preço de tabela, não sócio quando há diferença)',
          pontos: [
            { local: 's-rs-iate-clube-guaiba', valor: 750, nota: '8 aulas; sócios pagam R$ 550' },
            { local: 'ne-al-escola-de-vela-pajussara', valor: 1200, nota: 'turma de iniciantes' },
            { local: 's-sc-marevento-itajai', valor: 1600, nota: 'Curso de Vela Básico (12 h, veleiro de 11 pés)' },
            { local: 'se-rj-angra-sailing', valor: 1740, nota: 'aulas na Barra da Tijuca (Microtonner 19 ou dingue)' },
            { local: 'se-sp-ycsa', valor: 3420, nota: 'Dingue Nível 1, semestre; sócios R$ 2.840' }
          ]
        }],
        intl: { rotulo: 'RYA Start Yachting (2 dias), em escolas no exterior', pontos: [{ local: 'ext-pt-cascais-seawings', valor: 390, moeda: 'EUR', nota: 'Cascais, Portugal' }] },
        aviso: 'Clubes costumam cobrar menos de sócios. Aula experimental avulsa é uma boa forma de testar antes de se matricular.'
      },
      tempo: { estudoH: 2, praticaH: 20, base: 'Meta do app: cerca de 20 horas na água.' },
      mar: { horas: 20, texto: '20 horas na água' },
      bench: {
        itens: [
          { html: 'RYA Start Yachting: curso prático de 2 dias para iniciantes, sem experiência prévia exigida.', ref: 'internacional-01' },
          { html: 'Quem conclui o Start Yachting pode fazer o Competent Crew em tempo reduzido.', ref: 'internacional-03' },
          { html: 'ASA 101 (Keelboat Sailing 1): sem pré-requisitos, para iniciantes absolutos; barco de quilha de 20 a 27 pés, de dia, vento até 15 nós.', ref: 'internacional-126' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Armo e desarmo o barco e conheço o nome das peças.' },
        { id: 'c2', txt: 'Governo o barco em todos os pontos de vela e regulo a vela olhando as birutas.' },
        { id: 'c3', txt: 'Cambo e jaibo com controle e sei parar o barco no vento (capear).' },
        { id: 'c4', txt: 'Volto ao ponto de partida, recolho um objeto da água e sei desvirar o barco emborcado.' },
        { id: 'c5', txt: 'Faço os nós básicos: lais de guia, nó de oito, volta do fiel e nó direito.' },
        { id: 'c6', txt: 'Leio o vento e a previsão do dia e não saio com mais vento do que sei controlar.' }
      ],
      links: { curso: [{ rota: 'vela/m1', rotulo: 'Como um veleiro anda' }, { rota: 'vela/m3', rotulo: 'Pontos de vela e regulagem' }, { rota: 'arrais/m2', rotulo: 'Nós, cabos e voltas' }], simulado: 'vela', flash: 'vela', locais: ['escola-vela'] }
    },

    /* 2 */
    {
      id: 'cruzeiro', alias: ['e2', 'curso-cruzeiro', 'oceano-basico'], n: 2, tipo: 'embarque', rotulo: 'Curso de cruzeiro', titulo: 'Curso de cruzeiro ou de vela oceânica, como tripulante',
      resumo: 'Cerca de cinco dias a bordo de um veleiro de cruzeiro, com instrutor, para viver a rotina: manobras, quartos de vigia, fundeio, segurança e vida a bordo.',
      porque: 'Mostra o que o dingue não ensina: noite, enjoo, sono, convivência e a tripulação trabalhando como equipe. É também o primeiro teste honesto: você gosta de viver a bordo?',
      pre: [
        { html: 'Em geral, nenhum: cursos de iniciação em veleiro de cruzeiro recebem iniciantes. Confirme com a escola. O curso de dingue (etapa 1) ajuda, mas não é obrigatório.' }
      ],
      docs: [{ html: 'Nenhum documento oficial. Pergunte à escola sobre termo de responsabilidade, atestado médico e o que levar para dormir a bordo.' }],
      custo: {
        grupos: [{
          rotulo: 'Cursos de vela oceânica ou de cruzeiro para iniciantes (de um fim de semana a poucos dias)',
          pontos: [
            { local: 's-rs-iate-clube-guaiba', valor: 300, nota: 'módulo de fim de semana (não sócios pagam o mesmo)' },
            { local: 'se-rj-navegart-152', valor: 1200, nota: 'Vela Oceânica Básico (8 h)' },
            { local: 'se-sp-vou-de-vela', valor: 1650, nota: 'Vela Oceânica Básico em Angra ou Paraty, por pessoa (2 alunos)' },
            { local: 'ne-pe-cabanga-iate-clube', valor: 1750, nota: 'vela oceânica em veleiro de 32 pés, não sócios' },
            { local: 'se-rj-brasil-veleiros-paraty', valor: 1970, nota: 'individual, cabine de popa' },
            { local: 's-sc-marevento-itajai', valor: 2000, nota: 'Curso de Vela Oceânica (12 h)' },
            { local: 'ne-al-escola-de-vela-pajussara', valor: 2500, nota: 'vela oceânica, turma de 4 a 6' }
          ]
        }],
        intl: { rotulo: 'RYA Competent Crew (5 dias) em escolas no exterior', pontos: [
          { local: 'ext-pt-oeiras-west-coast-lisbon-sailing-centre', valor: 840, moeda: 'EUR', nota: 'Oeiras, Portugal (padrão)' },
          { local: 'ext-pt-lagos-ru-sailing', valor: 1195, moeda: 'EUR', nota: 'Lagos, Portugal' },
          { local: 'ext-pt-cascais-seawings', valor: 1300, moeda: 'EUR', nota: 'Cascais, Portugal' }
        ] }
      },
      tempo: { estudoH: 4, praticaH: 40, marDias: 5, base: 'Meta do app: cinco dias a bordo (um “dia a bordo” conta como 8 horas).' },
      mar: { dias: 5, mn: 100, noturnasH: 4, texto: '5 dias a bordo, 100 mn, 4 h noturnas' },
      bench: {
        itens: [
          { html: 'RYA Competent Crew: 5 dias, sem experiência prévia, sem exame formal (avaliação contínua pelo desempenho a bordo).', ref: 'internacional-04' },
          { html: 'O Competent Crew não exige experiência prévia.', ref: 'internacional-05' },
          { html: 'Pré-requisitos do RYA Day Skipper Practical, próximo degrau do RYA: 5 dias, 100 milhas e 4 horas noturnas a bordo de veleiro. É a origem da meta do app.', ref: 'internacional-09' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Conheço as funções de tripulante: escotas, leme, vigia, fundeio, atracação e rancho.' },
        { id: 'c2', txt: 'Participo de cambar, jaibe, rizar e capear respondendo a comandos de voz.' },
        { id: 'c3', txt: 'Faço uma atracação e um fundeio com instrução.' },
        { id: 'c4', txt: 'Faço quartos de vigia de dia e de noite, e lido com sono, frio e enjoo.' },
        { id: 'c5', txt: 'Visto o colete, prendo o tirante e sei o que fazer num homem ao mar.' },
        { id: 'c6', txt: 'Faço uma chamada simples no VHF e sei qual é o canal de socorro.' }
      ],
      links: { curso: [{ rota: 'vela/m2', rotulo: 'Anatomia de um veleiro de cruzeiro' }, { rota: 'vela/m6', rotulo: 'Homem ao mar sob vela' }, { rota: 'radio/m1', rotulo: 'VHF e DSC na prática' }], simulado: 'vela', flash: 'vela', locais: ['escola-vela', 'charter'] }
    },

    /* 3 */
    {
      id: 'arrais', alias: ['e3', 'ara', 'arrais-amador'], n: 3, tipo: 'cha', rotulo: 'Arrais-Amador', titulo: 'Arrais-Amador (ARA)',
      resumo: 'A primeira habilitação da Marinha, para conduzir embarcações em águas interiores (rios, lagos, baías e áreas abrigadas definidas por cada Capitania). Exige treinamento prático com atestado e uma prova teórica.',
      porque: 'É o documento que a lei exige para comandar embarcação de médio ou grande porte em águas interiores e o pré-requisito do Mestre-Amador. Sem habilitação compatível, o condutor é autuado e a embarcação pode ser retirada de tráfego.',
      pre: [
        { html: 'Idade mínima de 18 anos e saber ler e escrever. A prova é em português do Brasil.', ref: 'normas-50' },
        { html: 'Treinamento prático em estabelecimento de treinamento náutico (ETN) ou pessoa física credenciados na Capitania, com atestado.', ref: 'normas-46' }
      ],
      permite: [
        { html: 'Arrais-Amador: apto a conduzir embarcações nos limites da navegação interior (áreas definidas pelas Capitanias), exceto moto aquática.', ref: 'normas-26' },
        { html: 'Para embarcações a vela de médio ou grande porte, a habilitação segue a área de navegação: ARA para interior, MSA para costeira e CPA para oceânica.', ref: 'normas-32' },
        { html: 'Os limites das áreas de navegação interior são definidos por cada Capitania, Delegacia ou Agência.', ref: 'normas-07' }
      ],
      treino: [
        { html: 'A parte teórica do treinamento tem 2 h e é dada no ambiente da embarcação.', ref: 'normas-56' },
        { html: 'A parte prática tem 4 h, com a embarcação em movimento: luzes, regras de governo, ação do leme e hélice, atracação, desatracação, fundeio e suspender.', ref: 'normas-57' },
        { html: 'O atestado exige no mínimo seis horas de treinamento teórico e prático. Pode somar vários atestados, desde que cada um tenha pelo menos uma hora.', ref: 'normas-58' },
        { html: 'O atestado vale em todo o país por 2 anos a partir da emissão.', ref: 'normas-59' }
      ],
      docs: DOCS_INSCRICAO.concat([
        { html: 'Atestado de Treinamento Náutico (anexo 5-E), com firma reconhecida em cartório ou assinatura digital gov.br do representante da ETN, do instrutor e do aluno.', ref: 'normas-45' }
      ]),
      prova: [
        { html: 'Prova eletrônica ou escrita, com 40 questões e duração máxima de duas horas.', ref: 'normas-98' },
        { html: 'Vale 10,0 pontos; aprova quem tem pelo menos 5,0.', ref: 'normas-99' },
        { html: 'Leve só o protocolo de inscrição, um documento de identificação e caneta azul ou preta.', ref: 'normas-100' },
        { html: 'O programa inclui RIPEAM, balizamento IALA região B, VHF, marés, estabilidade básica, salvatagem, incêndio, primeiros socorros e RLESTA/NORMAM-211.', ref: 'normas-105' },
        { html: 'Depois: a CHA digital fica no aplicativo gov.br. Ela vale por dez anos (cinco para quem tem 65 anos ou mais).', ref: 'normas-112' },
        GRU_REPROVOU
      ],
      custo: {
        oficial: [GRU],
        grupos: [
          {
            rotulo: 'Curso de Arrais com treinamento prático',
            pontos: [
              { local: 'se-es-escola-nautica-es', valor: 746, nota: 'Escola Náutica do Espírito Santo' },
              { local: 'se-rj-navegart', valor: 890, nota: 'Arrais Básico' },
              { local: 's-pr-loba-do-mar', valor: 900, nota: 'à vista' },
              { local: 'se-rj-cl-vela', valor: 1350, nota: 'Arrais, prática' }
            ]
          },
          {
            rotulo: 'Só teoria ou material de estudo (o treinamento prático continua obrigatório)',
            pontos: [
              { local: 'ne-rn-portal-do-amador', valor: 40, nota: 'apostila digital' },
              { local: 'online-enauti', valor: 69.99, nota: 'curso online de teoria' }
            ]
          }
        ],
        aviso: 'O custo total é a GRU mais o curso e o atestado de treinamento, mais o atestado médico (ou a CNH válida, que dispensa).'
      },
      tempo: { estudoH: 28, praticaH: 6, base: 'Estudo: as lições do app (cerca de 16 h de leitura) mais exercícios, simulados e revisão. Prática: o mínimo do treinamento.', baseRef: 'normas-58', appCurso: 'arrais' },
      mar: { texto: 'O único requisito prático da norma é o treinamento de seis horas; o app sugere seguir velejando (etapa 4).', ref: 'normas-58' },
      aviso: [
        { tipo: 'nota', titulo: 'Quem pode atender você', html: 'A DPC indica a página “Localize a Capitania Mais Próxima”, que lista cada organização militar com os municípios de jurisdição. Veja o passo a passo e as Capitanias mais abaixo, em “Como achar e agendar a prova”.', refs: ['taxas-32'] }
      ],
      competencias: [
        { id: 'c1', txt: 'Terminei o curso do app e acerto de forma consistente no simulado de Arrais-Amador.' },
        { id: 'c2', txt: 'Fiz o treinamento prático de pelo menos 6 horas e recebi o atestado (anexo 5-E).', ref: 'normas-58' },
        { id: 'c3', txt: 'Sei explicar o que a categoria Arrais-Amador permite e o que não permite.' },
        { id: 'c4', txt: 'Reuni os documentos, paguei a GRU e agendei o atendimento.' },
        { id: 'c5', txt: 'Passei na prova e a CHA digital está no aplicativo gov.br.' },
        { id: 'c6', txt: 'Atraco, desatraco e fundeio, sozinho no comando, num dia calmo, com o instrutor por perto.' }
      ],
      links: { curso: [{ rota: 'arrais', rotulo: 'Curso de Arrais-Amador' }, { rota: 'arrais/m16', rotulo: 'Treinamento, inscrição e prova' }], simulado: 'arrais', flash: 'arrais', locais: ['preparatorio-cha'], curso_id: 'arrais' }
    },

    /* 4 */
    {
      id: 'milhas-costeiras', alias: ['e4', 'milhas'], n: 4, tipo: 'embarque', rotulo: 'Milhas como tripulante', titulo: 'Milhas costeiras como tripulante',
      resumo: 'Embarcar em veleiros de amigos, clubes, escolas e regatas, de dia e de noite, em funções cada vez mais responsáveis. É onde a teoria vira hábito.',
      porque: 'A prova mede o que você sabe; o mar mede o que você faz com cansaço, vento e pressa. Cada saída ensina algo novo com um comandante experiente, e você ainda não carrega a responsabilidade final.',
      pre: [
        { html: 'O curso de cruzeiro (etapa 2) e, de preferência, a teoria do Arrais-Amador. Quem comanda o barco, e não você como tripulante, precisa de habilitação compatível com a área de navegação.', ref: 'normas-14' }
      ],
      docs: [{ html: 'Caderneta de bordo pessoal (logbook): data, barco, distância, horas, sua função e a assinatura do comandante. Sem ela, suas milhas não provam nada.' }],
      custo: {
        grupos: [{
          rotulo: 'Embarcar como tripulante em regatas costeiras e barco-escola',
          pontos: [
            { local: 's-sc-ani-itajai', valor: 0, nota: 'Barco Escola gratuito (3 h de aula por mês por embarcação)' },
            { local: 'se-sp-regata-santos-rio', valor: 300, nota: 'R$ 200 a R$ 300 por velejador, conforme a data de pagamento' },
            { local: 'ne-se-reseba', valor: 500, nota: 'Regata Sergipe–Bahia, R$ 480 no pix ou R$ 500 no cartão' }
          ]
        }],
        aviso: 'São taxas de inscrição na regata. Deslocamento, alimentação e equipamento pessoal ficam por sua conta. Muitos comandantes aceitam tripulantes dividindo só as despesas; pergunte em clubes e nos sites de procura de tripulação.'
      },
      tempo: { estudoH: 4, praticaH: 80, marDias: 10, base: 'Meta do app: de 5 para 15 dias a bordo (cada dia conta como 8 horas).' },
      mar: { dias: 15, mn: 300, noturnasH: 8, texto: '15 dias, 300 mn, 8 h noturnas' },
      bench: {
        itens: [
          { html: 'RYA Coastal Skipper Practical, pré-requisitos: 15 dias de mar, 2 dias como skipper, 300 milhas e 8 horas noturnas. Idade mínima 17 anos. É a origem da meta do app.', ref: 'internacional-14' },
          { html: 'Para o RYA, um “dia a bordo” é um período de 8 horas consecutivas vivendo a bordo, a maior parte com o barco no mar. Só um período conta a cada 24 h.', ref: 'internacional-51' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Navego com carta e GPS, plotando posição, rumo e distância, e confiro o GPS pela carta.' },
        { id: 'c2', txt: 'Uso a tábua de marés e estimo altura e corrente.' },
        { id: 'c3', txt: 'Planejo uma passagem com previsão do tempo, marés, portos de abrigo e plano B.' },
        { id: 'c4', txt: 'Navego em marinas e portos diferentes e aprendo a ler cada lugar.' },
        { id: 'c5', txt: 'Faço quartos de vigia de dia e de noite e participo das trocas de vela em condições variadas.' },
        { id: 'c6', txt: 'Mantenho minha caderneta de bordo, com a assinatura dos comandantes.' }
      ],
      links: { curso: [{ rota: 'vela/m10/l3', rotulo: 'Degraus 4 a 7' }, { rota: 'vela/m10/l6', rotulo: 'Caderneta de bordo' }, { rota: 'travessia/m5', rotulo: 'Rallies e regatas para ganhar milhas' }], simulado: 'vela', flash: 'vela', locais: ['regata', 'crew-finder', 'iate-clube'] }
    },

    /* 5 */
    {
      id: 'mestre', alias: ['e5', 'msa', 'mestre-amador'], n: 5, tipo: 'cha', rotulo: 'Mestre-Amador', titulo: 'Mestre-Amador (MSA)',
      resumo: 'A habilitação da navegação costeira: entre portos nacionais e estrangeiros, dentro dos limites de visibilidade da costa e até 20 milhas náuticas dela. Prova com carta náutica, régua e compasso.',
      porque: 'É o que a lei exige para comandar veleiro fora das águas interiores, perto da costa, e o pré-requisito do Capitão-Amador. A prova ensina a plotar, a prever marés e a conhecer os auxílios à navegação.',
      pre: [
        { html: 'CHA de Arrais-Amador válida no ato da inscrição.', ref: 'taxas-40' },
        { html: 'Idade mínima de 18 anos e saber ler e escrever.', ref: 'normas-50' }
      ],
      permite: [
        { html: 'Mestre-Amador: apto a conduzir embarcações entre portos nacionais e estrangeiros nos limites da navegação costeira (até 20 MN), exceto moto aquática.', ref: 'normas-25' },
        { html: 'Navegação costeira é a realizada dentro dos limites de visibilidade da costa, até a distância máxima de 20 milhas náuticas.', ref: 'normas-08' }
      ],
      docs: DOCS_INSCRICAO,
      prova: [
        { html: 'Prova eletrônica ou escrita, com 40 questões de múltipla escolha (quatro delas com carta náutica) e duração máxima de três horas.', ref: 'normas-92' },
        { html: 'Vale 10,0 pontos; aprova quem tem pelo menos 5,0.', ref: 'normas-93' },
        { html: 'Leve protocolo, identidade, caneta azul ou preta e material de desenho: lápis, régua, esquadros ou régua paralela, transferidor, compasso e borracha.', ref: 'normas-94' },
        { html: 'O programa inclui navegação estimada e costeira, cartas e publicações, marés, balizamento IALA B, radar, ecobatímetro, meteorologia, EPIRB e AIS, sobrevivência e RIPEAM.', ref: 'normas-96' },
        { html: 'As provas de Arrais e Mestre são destruídas logo após a correção, para proteger o banco de questões. Por isso, treine com os simulados do app.', ref: 'normas-101' },
        GRU_REPROVOU
      ],
      custo: {
        oficial: [GRU],
        grupos: [
          {
            rotulo: 'Curso preparatório de Mestre-Amador',
            pontos: [
              { local: 'se-sp-vou-de-vela', valor: 950, nota: '14 h teóricas' },
              { local: 'se-rj-cl-vela', valor: 1150, nota: 'online ao vivo' },
              { local: 'se-rj-navegart', valor: 1390, nota: 'intensivo (20 h)' },
              { local: 's-pr-loba-do-mar', valor: 1500, nota: 'à vista' }
            ]
          },
          { rotulo: 'Só teoria online', pontos: [{ local: 'online-enauti', valor: 348 }] }
        ]
      },
      tempo: { estudoH: 36, praticaH: 0, base: 'Estudo: as lições do app (cerca de 15 h de leitura) mais exercícios de plotagem na carta, simulados e revisão.', appCurso: 'mestre' },
      mar: { texto: 'A norma não pede milhas nem dias de mar; o app recomenda ter as metas da etapa 4.', ref: 'normas-49' },
      competencias: [
        { id: 'c1', txt: 'Resolvo na carta posição, rumo, marcações, corrente e abatimento, com régua e compasso.' },
        { id: 'c2', txt: 'Calculo marés (tábua e regra dos doze avos) e a altura de água sob a quilha.' },
        { id: 'c3', txt: 'Converto rumos: verdadeiro, magnético e da agulha (declinação e desvio).' },
        { id: 'c4', txt: 'Reconheço o balizamento IALA B, as luzes e os sinais e aplico as regras de governo.' },
        { id: 'c5', txt: 'Sei usar VHF com DSC e conheço EPIRB, radar, AIS e ecobatímetro.' },
        { id: 'c6', txt: 'Passei na prova e tenho a CHA de Mestre-Amador.' }
      ],
      links: { curso: [{ rota: 'mestre', rotulo: 'Curso de Mestre-Amador' }, { rota: 'mestre/m14', rotulo: 'A prova de Mestre-Amador' }], simulado: 'mestre', flash: 'mestre', locais: ['preparatorio-cha'], curso_id: 'mestre' }
    },

    /* 6 */
    {
      id: 'skipper-diurno', alias: ['e6', 'comando-diurno'], n: 6, tipo: 'comando', rotulo: 'Comandante de dia', titulo: 'Skipper costeiro, de dia',
      resumo: 'Você assume o comando em passeios diurnos, em águas conhecidas e com tempo bom, de preferência com um amigo experiente a bordo como segunda opinião.',
      porque: 'Assumir o comando muda tudo: você decide e responde pelo barco e pela tripulação. É melhor aprender isso devagar, de dia, perto de abrigo.',
      pre: [
        { html: 'CHA de Mestre-Amador (ou de Arrais-Amador, se for ficar em águas interiores): a habilitação do condutor deve ser compatível com a área de navegação.', ref: 'normas-14' },
        { html: 'As metas de mar da etapa 4, e um amigo experiente a bordo nas primeiras saídas (recomendação do app).' }
      ],
      permite: [
        { html: 'Navegação costeira: dentro dos limites de visibilidade da costa e sem exceder 20 milhas náuticas. É o limite do Mestre-Amador.', ref: 'normas-10' },
        { html: 'Embarcações a vela só podem navegar a partir de 100 m da linha de base (proteção de banhistas).', ref: 'normas-21' },
        { html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.', ref: 'normas-158' },
        { html: 'Embarcação de médio porte em navegação costeira deve ter VHF com DSC.', ref: 'normas-156' },
        { html: 'Se o condutor não for habilitado e a embarcação estiver navegando, ela é retirada de tráfego e apreendida.', ref: 'normas-141' }
      ],
      docs: [
        { html: 'A habilitação (CHA) é de porte obrigatório, física ou digital.', ref: 'normas-14' },
        { html: 'Plano de viagem registrado (Aviso de Saída ou aplicativo NAVSEG) antes de sair.', ref: 'normas-158' }
      ],
      custo: { texto: 'Varia muito: o custo é o do barco que você usa (o seu, o de um amigo ou um charter). Veja escolas e empresas em “Onde estudar”.' },
      tempo: { estudoH: 6, praticaH: 80, marDias: 10, base: 'Meta do app: de 15 para 25 dias de mar, com 3 dias como comandante.' },
      mar: { dias: 25, mn: 500, comandoDias: 3, texto: '25 dias, 500 mn, 3 dias como comandante' },
      bench: {
        itens: [
          { html: 'RYA Day Skipper Practical: ao concluir, o aluno deve ser capaz de comandar com segurança um veleiro de cruzeiro de 30 a 45 pés e sua tripulação em passeios diurnos em águas conhecidas.', ref: 'internacional-12' },
          { html: 'Segundo o RYA, o Day Skipper Practical habilita a requerer o ICC para navegar no exterior.', ref: 'internacional-13' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Faço o briefing de segurança antes de sair: colete, tirante, extintor, rádio e plano de homem ao mar.' },
        { id: 'c2', txt: 'Registro o plano de viagem (Aviso de Saída ou NAVSEG) antes de sair.' },
        { id: 'c3', txt: 'Saio e chego de marina, fundeadouro e poita sem ajuda do instrutor.' },
        { id: 'c4', txt: 'Decido reduzir pano e voltar cedo, antes da necessidade.' },
        { id: 'c5', txt: 'Gerencio a tripulação, inclusive pessoas inexperientes, atribuindo tarefas seguras.' },
        { id: 'c6', txt: 'Um comandante experiente embarcaria comigo e me deu retorno do que melhorar.' }
      ],
      links: { curso: [{ rota: 'vela/m7', rotulo: 'Motor e manobras no porto' }, { rota: 'vela/m8', rotulo: 'Fundear' }, { rota: 'vela/m10/l3', rotulo: 'Degraus 4 a 7' }], simulado: 'vela', flash: 'vela', locais: ['escola-vela', 'charter'] }
    },

    /* 7 */
    {
      id: 'skipper-noturno', alias: ['e7', 'comando-noturno'], n: 7, tipo: 'comando', rotulo: 'Comandante à noite', titulo: 'Skipper costeiro, à noite',
      resumo: 'Inclua a noite: saídas ao anoitecer, pernoite no fundeio e chegadas depois do pôr do sol.',
      porque: 'A noite esconde perigos que de dia são óbvios, e a identificação de luzes e faróis vira a sua principal ferramenta. É o passo que prepara as passagens de 24 horas.',
      pre: [
        { html: 'Um ou mais passeios diurnos como comandante e uma experiência noturna como tripulante (etapa 4). Recomendação do app.' },
        { html: 'Se o atestado médico trouxer uma restrição noturna, ela consta no campo de observações da CHA: respeite-a.', ref: 'normas-114' }
      ],
      docs: [{ html: 'Os mesmos da etapa anterior: CHA e plano de viagem. Leve lanternas de reserva e a Lista de Faróis atualizada.' }],
      custo: { texto: 'Varia: é o custo do barco que você usa, mais marina ou fundeio. Veja escolas e empresas em “Onde estudar”.' },
      tempo: { estudoH: 4, praticaH: 40, marDias: 5, base: 'Meta do app: de 25 para 30 dias de mar, com 12 h noturnas acumuladas.' },
      mar: { dias: 30, mn: 800, noturnasH: 12, comandoDias: 5, texto: '30 dias, 800 mn, 12 h noturnas, 5 dias como comandante' },
      bench: {
        itens: [
          { html: 'Exame RYA Yachtmaster Coastal: 30 dias de mar nos últimos 10 anos (12 para quem tem o Coastal Skipper Practical).', ref: 'internacional-19' },
          { html: 'Yachtmaster Coastal: 800 milhas (400 com o Coastal Skipper Practical) e 12 horas de navegação noturna.', ref: 'internacional-21' },
          { html: 'Yachtmaster Coastal: 2 dias como skipper em embarcação com menos de 24 m; idade mínima 17 anos.', ref: 'internacional-20' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Mostro as luzes corretas a vela, a motor e fundeado.' },
        { id: 'c2', txt: 'Planejo as chegadas noturnas identificando as luzes na carta e na Lista de Faróis.' },
        { id: 'c3', txt: 'Organizo quartos curtos e regras claras de vigia e de convés.' },
        { id: 'c4', txt: 'Treino homem ao mar à noite com um objeto.' },
        { id: 'c5', txt: 'Faço um fundeio seguro, com alarme de GPS e marcações.' }
      ],
      links: { curso: [{ rota: 'vela/m9', rotulo: 'Velejar à noite' }, { rota: 'arrais/m6', rotulo: 'RIPEAM: luzes e marcas' }, { rota: 'mestre/m6', rotulo: 'Auxílios à navegação e publicações' }], simulado: 'vela', flash: 'vela', locais: ['escola-vela', 'charter'] }
    },

    /* 8 */
    {
      id: 'travessias', alias: ['e8', 'travessias-24-72h'], n: 8, tipo: 'comando', rotulo: 'Travessias de 24 a 72 h', titulo: 'Travessias de 24 a 72 horas',
      resumo: 'Passagens de um a três dias, com pelo menos uma noite no mar: o laboratório do oceano. Sono, comida, enjoo, tempo, avarias e relações entre pessoas.',
      porque: 'É onde você descobre se o plano funciona quando o cansaço chega. Sem as passagens médias, a travessia oceânica vira um salto no escuro.',
      pre: [
        { html: 'As metas de mar das etapas 6 e 7 e a habilitação de Mestre-Amador.' }
      ],
      permite: [
        { html: 'Mestre-Amador: apto a conduzir embarcações entre portos nacionais e estrangeiros nos limites da navegação costeira (até 20 MN).', ref: 'normas-25' },
        { html: 'Navegação costeira é a realizada dentro dos limites de visibilidade da costa, até a distância máxima de 20 milhas náuticas.', ref: 'normas-08' },
        { html: 'Navegação oceânica é a realizada sem restrições, além das 20 milhas náuticas da costa.', ref: 'normas-09' },
        { html: 'A navegação oceânica (fora dos limites de visibilidade da costa) corresponde ao Capitão-Amador.', ref: 'normas-11' }
      ],
      aviso: [
        { tipo: 'seguranca', titulo: 'Limite legal das passagens longas', html: 'Como comandante com Mestre-Amador, faça suas passagens de 24 a 72 horas ao longo da costa, dentro do limite de 20 milhas e de visibilidade. Passagens afastadas da costa são navegação oceânica: só com o Capitão-Amador no comando, ou como tripulante de um comandante habilitado.', refs: ['normas-35'] }
      ],
      docs: [
        { html: 'CHA compatível com a área e plano de viagem registrado.', ref: 'normas-158' },
        { html: 'Para o RYA Yachtmaster Offshore, além da experiência: certificado de rádio GMDSS, certificado de primeiros socorros válido e identidade com foto.', ref: 'internacional-37', intl: true }
      ],
      custo: {
        grupos: [{
          rotulo: 'Cursos que incluem passagens de 24 horas ou mais, com instrutor',
          pontos: [
            { local: 's-sc-escola-de-vela-oceano', valor: 2400, nota: 'Módulo 5, travessia (36 h, 70 a 120 milhas), à vista' },
            { local: 's-sc-issa-brazil-itajai', valor: 7850, nota: 'Offshore Skipper (64 h, 7 dias; pede 200 mn de experiência)' }
          ]
        }],
        aviso: 'Fora de cursos, o custo é o do barco que você usa.'
      },
      tempo: { estudoH: 8, praticaH: 160, marDias: 20, base: 'Meta do app: de 30 para 50 dias de mar, com 5 passagens de mais de 60 milhas.' },
      mar: { dias: 50, mn: 2500, passagens: 5, comandoDias: 5, texto: '50 dias, 2.500 mn, 5 passagens de mais de 60 mn (2 noturnas, 2 como comandante), 5 dias como comandante' },
      bench: {
        itens: [
          { html: 'Exame RYA Yachtmaster Offshore: 50 dias de mar e 2.500 milhas nos últimos 10 anos.', ref: 'internacional-30' },
          { html: 'Yachtmaster Offshore: 5 dias como skipper e 5 passagens de mais de 60 milhas, incluindo 2 noturnas e 2 como skipper.', ref: 'internacional-33' },
          { html: 'O Yachtmaster Offshore certifica competência para comandar passagens em que o barco fique a no máximo 150 milhas de um porto, de dia ou de noite.', ref: 'internacional-29' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Planejo uma passagem de 3 a 5 dias, comparo modelos de previsão e escolho a janela de tempo.' },
        { id: 'c2', txt: 'Faço navegação estimada com atualização regular da posição e tenho plano para falha do GPS.' },
        { id: 'c3', txt: 'Gerencio quartos e descanso de uma tripulação de 3 a 5 pessoas.' },
        { id: 'c4', txt: 'Trato enjoo, desidratação e frio e sei o básico de primeiros socorros.' },
        { id: 'c5', txt: 'Reduzo pano com cuidado, capeio e sei qual é a rota de fuga se o tempo piorar.' },
        { id: 'c6', txt: 'Resolvo avarias comuns: cabo no hélice, vela rasgada, escota partida, falha de bateria.' }
      ],
      links: { curso: [{ rota: 'vela/m5', rotulo: 'Reduzir pano e mau tempo' }, { rota: 'vela/m10/l4', rotulo: 'Degraus 8 a 12' }, { rota: 'travessia/m6', rotulo: 'Tripulação e quartos de serviço' }, { rota: 'radio/m6', rotulo: 'Primeiros socorros: cursos' }], simulado: 'travessia', flash: 'travessia', locais: ['escola-vela', 'charter'] }
    },

    /* 9 */
    {
      id: 'capitao', alias: ['e9', 'cpa', 'capitao-amador'], n: 9, tipo: 'cha', rotulo: 'Capitão-Amador', titulo: 'Capitão-Amador (CPA)',
      resumo: 'A habilitação da navegação oceânica, sem limite de afastamento da costa. A prova inclui navegação astronômica e é a única das três com calendário fixo, em duas épocas por ano.',
      porque: 'Uma travessia do Atlântico é navegação oceânica, e a lei pede o Capitão-Amador para quem conduz. Sem ele, você pode ser tripulante, mas não o condutor.',
      pre: [
        { html: 'CHA de Mestre-Amador dentro da validade no ato da inscrição.', ref: 'normas-48' },
        { html: 'O único pré-requisito de experiência é ter a CHA da categoria anterior. A norma não fala em tempo mínimo nem em milhas ou dias de mar.', ref: 'normas-49' },
        { html: 'Idade mínima de 18 anos e saber ler e escrever.', ref: 'normas-50' }
      ],
      permite: [
        { html: 'Capitão-Amador: apto a conduzir embarcações entre portos nacionais e estrangeiros, sem limite de afastamento da costa, exceto moto aquática.', ref: 'normas-24' },
        { html: 'Uma travessia transatlântica é navegação oceânica (além de 20 MN, fora da visibilidade da costa), que corresponde à categoria Capitão-Amador.', ref: 'normas-36' }
      ],
      calendario: [
        { html: 'As inscrições para Capitão-Amador ocorrem, em princípio, em fevereiro e agosto, com exames em abril e outubro. As datas podem mudar.', ref: 'normas-77' },
        { html: 'Exemplo de 2026, edição II: inscrições de 3 a 18 de agosto e prova em 1º de outubro, das 14h às 18h.', ref: 'taxas-52' },
        { html: 'Cronograma da mesma edição: gabarito preliminar até 06/10, recursos de 6 a 16/10, gabarito final até 05/11 e lista de aprovados até 16/11.', ref: 'taxas-53' },
        { html: 'A inscrição é presencial no GAP de qualquer Capitania, Delegacia ou Agência, sem agendamento.', ref: 'taxas-54' }
      ],
      docs: DOCS_INSCRICAO.slice(0, 5).concat([
        { html: 'CHA de Mestre-Amador válida (apresentada no ato da inscrição).', ref: 'normas-48' }
      ]),
      prova: [
        { html: 'Prova escrita com 40 questões e duração máxima de quatro horas.', ref: 'normas-78' },
        { html: 'Vale 10,0 pontos; aprova quem tem pelo menos 5,0.', ref: 'normas-79' },
        { html: 'Leve protocolo de inscrição, identificação, caneta azul ou preta e material de desenho (lápis, régua paralela ou esquadros, compasso e borracha).', ref: 'normas-80' },
        { html: 'O programa tem sete assuntos: Navegação Astronômica, Navegação Eletrônica, Estabilidade, Meteorologia e Oceanografia, Comunicações, Sobrevivência no Mar e Carta náutica e publicações.', ref: 'normas-84' },
        { html: 'A DPC publica no site as provas e os gabaritos de CPA, de 2013 a 2026 (as listas de aprovados dos exames regulares aparecem a partir de 2018): use como simulado.', ref: 'taxas-48' },
        { html: 'Pedido de revisão: até 7 dias úteis depois da divulgação da prova e do gabarito, por requerimento à Capitania da inscrição.', ref: 'normas-82' },
        GRU_REPROVOU
      ],
      custo: {
        oficial: [GRU],
        grupos: [{
          rotulo: 'Curso preparatório de Capitão-Amador',
          pontos: [
            { local: 'online-enauti', valor: 982, nota: 'curso online' },
            { local: 'se-rj-navegart', valor: 2220, nota: 'dois módulos presenciais: astronômica R$ 1.050 e eletrônica R$ 1.170' }
          ]
        }]
      },
      tempo: { estudoH: 55, praticaH: 0, base: 'Estudo: as lições do app (cerca de 16 h de leitura) mais muitos exercícios de cálculo astronômico, provas anteriores e revisão. Não inclui a espera pela janela da prova.', appCurso: 'capitao', calendario: true },
      mar: { texto: 'A norma não pede milhas nem dias de mar; o app recomenda as metas da etapa 8.', ref: 'normas-49' },
      competencias: [
        { id: 'c1', txt: 'Faço cálculos de tempo e fusos horários e uso o Almanaque Náutico.' },
        { id: 'c2', txt: 'Resolvo a hora da passagem meridiana do Sol e a posição pela meridiana.' },
        { id: 'c3', txt: 'Entendo reta de altura e a diferença entre derrota ortodrômica e loxodrômica.' },
        { id: 'c4', txt: 'Domino meteorologia e oceanografia, comunicações oceânicas (EPIRB, SART) e sobrevivência no mar.' },
        { id: 'c5', txt: 'Acerto de forma consistente nas provas anteriores do CPA e no simulado do app.' },
        { id: 'c6', txt: 'Passei na prova e tenho a CHA de Capitão-Amador.' }
      ],
      links: { curso: [{ rota: 'capitao', rotulo: 'Curso de Capitão-Amador' }, { rota: 'capitao/m14', rotulo: 'A prova de Capitão-Amador' }, { rota: 'capitao/m3', rotulo: 'Passagem meridiana do Sol' }], simulado: 'capitao', flash: 'capitao', locais: ['preparatorio-cha'], curso_id: 'capitao' }
    },

    /* 10 */
    {
      id: 'offshore-tripulante', alias: ['e10', 'offshore'], n: 10, tipo: 'embarque', rotulo: 'Offshore, tripulante', titulo: 'Offshore acima de 500 milhas, como tripulante',
      resumo: 'Embarcar como tripulante numa passagem de mais de 500 milhas, com várias noites seguidas: regata oceânica, entrega de barco (delivery) ou cruzeiro longo.',
      porque: 'É a primeira vez que a rotina de quartos, comida, sono e troca de turno vira o seu dia a dia por vários dias, sob o comando de alguém experiente.',
      pre: [
        { html: 'As metas de mar das etapas 6 a 8 e, de preferência, a CHA de Mestre-Amador. O Capitão-Amador (etapa 9) pode ser feito antes ou durante.' },
        { html: 'Muitas regatas e rallies oceânicos pedem treinamento de sobrevivência e de primeiros socorros em dia (veja “Complementares”).' }
      ],
      secoes: [{
        titulo: 'O que regatas e rallies pedem de quem embarca',
        itens: [
          { html: 'Cape2Rio 2025 (regata entre Cidade do Cabo e Rio de Janeiro): uma regata qualificatória ou travessia offshore contínua de pelo menos 500 mn com no mínimo 2 noites completas, nos 18 meses anteriores, com o comandante e 50% da tripulação.', ref: 'travessia-71' },
          { html: 'Nas regras de segurança da World Sailing (OSR), nas categorias 1 e 2, pelo menos 30% da tripulação, nunca menos de dois, incluindo o responsável, deve ter feito nos 5 anos anteriores o treinamento de sobrevivência.', ref: 'radio-71' },
          { html: 'Os rallies da World Cruising Club exigem no mínimo dois adultos por barco.', ref: 'travessia-59' }
        ]
      }],
      docs: [
        { html: 'Caderneta de bordo com a passagem registrada e assinada pelo comandante.' },
        { html: 'Certificado de sobrevivência no mar e de primeiros socorros, quando o aviso de regata pedir (veja “Complementares”).', ref: 'radio-74' }
      ],
      custo: {
        grupos: [{
          rotulo: 'Vagas de tripulante em regatas e travessias no Nordeste (referências de 2026)',
          pontos: [
            { local: 'ne-ba-namaste-charter', valor: 2300, nota: 'trecho entre Salvador e Recife, por pessoa, tudo incluído' },
            { local: 'ne-ba-namaste-charter', valor: 7475, nota: 'Refeno com tudo incluído, por pessoa' },
            { local: 'ne-pe-refeno-bolsa-charter', valor: 10000, nota: 'anúncios de vagas, de R$ 9.000 a R$ 10.000' }
          ]
        }],
        aviso: 'Recife–Noronha tem 300 milhas e Salvador–Recife, 399: some trechos para chegar às 500 milhas. Os valores acima são o preço de uma vaga em barco de terceiros. Sites de procura de tripulação e entregas de barco costumam repartir só as despesas; confira cada oferta.', avisoRefs: ['travessia-73', 'travessia-128']
      },
      tempo: { estudoH: 8, praticaH: 72, marDias: 7, base: 'Meta do app: uma passagem de mais de 500 milhas (cerca de 7 dias com preparação, contando 8 horas por dia) mais o curso de sobrevivência de 2 dias.' },
      mar: { mn: 3500, passagensLongas: 1, texto: '1 passagem de mais de 500 mn; 3.500 mn no total' },
      bench: {
        itens: [
          { html: 'ASA 106 (Advanced Coastal Cruising): passagem de ao menos 48 h, incluindo 24 h contínuas, em águas costeiras até 200 milhas.', ref: 'internacional-137' },
          { html: 'ASA 108 (Offshore Passagemaking): passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra.', ref: 'internacional-141' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Aguento 3 ou mais noites seguidas em quartos, cuidando do corpo (sono, comida e frio).' },
        { id: 'c2', txt: 'Participo de reparos e da manutenção diária do barco.' },
        { id: 'c3', txt: 'Observo e anoto como o comandante decide quando o tempo muda.' },
        { id: 'c4', txt: 'Tenho em dia os certificados de sobrevivência no mar e de primeiros socorros.' },
        { id: 'c5', txt: 'Completei uma passagem de mais de 500 milhas e a registrei na caderneta.' }
      ],
      links: { curso: [{ rota: 'travessia/m5', rotulo: 'Rallies e regatas oceânicas' }, { rota: 'travessia/m6', rotulo: 'Tripulação e quartos de serviço' }, { rota: 'radio/m7', rotulo: 'Sobrevivência no mar: cursos' }], simulado: 'travessia', flash: 'travessia', locais: ['regata', 'crew-finder', 'delivery', 'rally-oceanico'] }
    },

    /* 11 */
    {
      id: 'imediato-oceanico', alias: ['e11', 'imediato'], n: 11, tipo: 'embarque', rotulo: 'Oceano como imediato', titulo: 'Travessia oceânica como imediato',
      resumo: 'Ser imediato é ser o segundo no comando: responsável por um quarto inteiro e pela navegação, inclusive a astronômica, numa passagem de vários dias.',
      porque: 'É o ensaio geral do comando. Você decide rumo, velas e tráfego durante o seu quarto, e o comandante confia em você para isso.',
      pre: [
        { html: 'CHA de Capitão-Amador (etapa 9) e a passagem de mais de 500 milhas como tripulante (etapa 10).' }
      ],
      permite: [
        { html: 'Uma travessia transatlântica é navegação oceânica (além de 20 MN, fora da visibilidade da costa), que corresponde à categoria Capitão-Amador.', ref: 'normas-36' }
      ],
      docs: [
        { html: 'Caderneta de bordo, com a passagem registrada como responsável por quarto, e assinada pelo comandante.' }
      ],
      custo: { texto: 'Varia: depende do barco, da regata ou do rally. Veja as referências de preço na etapa anterior e as opções em “Onde estudar”.' },
      tempo: { estudoH: 12, praticaH: 48, marDias: 6, base: 'Meta do app: uma passagem de 4 dias ou mais com preparação, contando 8 horas por dia.' },
      mar: { texto: '1 passagem de 600 mn ou mais e 96 h ou mais, com navegação astronômica no mar' },
      bench: {
        itens: [
          { html: 'RYA Yachtmaster Ocean: a passagem qualificante deve ter no mínimo 600 milhas, das quais ao menos 200 a mais de 50 milhas de terra.', ref: 'internacional-41' },
          { html: 'A passagem qualificante deve durar no mínimo 96 horas.', ref: 'internacional-42' },
          { html: 'O candidato deve ter atuado como responsável por quarto ou como skipper durante toda a passagem e participado do planejamento e da preparação.', ref: 'internacional-43' },
          { html: 'Deve ter navegado por navegação astronômica no mar (no mínimo a meridiana e a verificação da agulha por astro).', ref: 'internacional-44' },
          { html: 'O exame Yachtmaster Ocean é oral e escrito, e só quem já tem o Yachtmaster Offshore pode recebê-lo.', ref: 'internacional-47' }
        ]
      },
      competencias: [
        { id: 'c1', txt: 'Faço navegação astronômica no mar (meridiana do Sol e verificação da agulha) e comparo com o GPS.' },
        { id: 'c2', txt: 'Assumo um quarto inteiro, com decisões de rumo, velas e tráfego.' },
        { id: 'c3', txt: 'Participo do planejamento e da preparação da passagem.' },
        { id: 'c4', txt: 'Ajudo a controlar água, comida, combustível e energia.' },
        { id: 'c5', txt: 'Completei uma passagem de 600 milhas ou mais, com 96 horas ou mais.' }
      ],
      links: { curso: [{ rota: 'capitao/m3', rotulo: 'Passagem meridiana do Sol' }, { rota: 'capitao/m4', rotulo: 'Retas de altura e derrotas' }, { rota: 'travessia/m6', rotulo: 'Quartos de serviço' }, { rota: 'travessia/m9', rotulo: 'Mau tempo no oceano' }], simulado: 'travessia', flash: 'travessia', locais: ['regata', 'crew-finder', 'delivery', 'rally-oceanico'] }
    },

    /* 12 */
    {
      id: 'transatlantica', alias: ['e12', 'comandante-oceanico'], n: 12, tipo: 'comando', rotulo: 'Transatlântica', titulo: 'Transatlântica como comandante',
      resumo: 'O ponto de chegada: planejar, preparar e comandar a travessia, com tripulação, um barco revisado e um plano para quando algo sair do previsto.',
      porque: 'O grau de preparação do barco e do plano pesa tanto quanto o do comandante. Quem comanda responde por todos a bordo.',
      pre: [
        { html: 'CHA de Capitão-Amador e a experiência das etapas anteriores. Antes de assumir a transatlântica, é prudente já ter comandado uma passagem de 600 milhas ou mais, com tripulação, e passado por mau tempo (recomendação do app).' }
      ],
      permite: [
        { html: 'Na tabela de itens obrigatórios para embarcações classificadas para navegação oceânica, a habilitação mínima exigida é Capitão-Amador.', ref: 'travessia-113' },
        { html: 'A segurança do barco e da tripulação é responsabilidade exclusiva e inescapável da pessoa no comando (OSR 1.02.1).', ref: 'travessia-08' }
      ],
      secoes: [
        {
          titulo: 'Equipamento e papéis para a navegação oceânica',
          itens: [
            { html: 'Embarcação de médio porte em navegação oceânica deve ter VHF com DSC, HF com DSC (que pode ser substituído por telefone ou comunicador satelital) e EPIRB 406 MHz.', ref: 'normas-155' },
            { html: 'Balsas salva-vidas infláveis para 100% das pessoas a bordo.', ref: 'travessia-114' },
            { html: 'Toda EPIRB deve ser cadastrada no INFOSAR (DECEA).', ref: 'normas-154' },
            { html: 'Embarcações com equipamento de radiocomunicação devem obter a Licença de Estação de Navio na Anatel.', ref: 'normas-152' },
            { html: 'O MMSI é exigido para as estações que participam do GMDSS e deve ser programado em todos os equipamentos que tenham essa função.', ref: 'radio-35' },
            { html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG.', ref: 'normas-158' }
          ]
        },
        {
          titulo: 'Se a travessia for por um rally (exemplo: ARC)',
          itens: [
            { html: 'O ARC sai todo ano em novembro de Las Palmas (Gran Canaria) para Rodney Bay (Santa Lúcia).', ref: 'travessia-46' },
            { html: 'A travessia tem 2.700 milhas náuticas e leva cerca de 18 a 21 dias para o barco médio.', ref: 'travessia-47' },
            { html: 'Aceita monocascos, multicascos e barcos a motor de 27 a 100 pés.', ref: 'travessia-50' },
            { html: 'O ARC 2026 larga em 22/11/2026; o ARC 2027, em 21/11/2027.', ref: 'travessia-48' },
            { html: 'Os rallies da World Cruising Club exigem no mínimo dois adultos por barco.', ref: 'travessia-59' }
          ]
        }
      ],
      docs: [
        { html: 'CHA de Capitão-Amador (física ou digital), de porte obrigatório.', ref: 'normas-14' },
        { html: 'Licença de Estação de Navio (Anatel), registro da EPIRB no INFOSAR e MMSI programado.', ref: 'normas-152' },
        { html: 'Plano de viagem no NAVSEG ou Aviso de Saída.', ref: 'normas-158' },
        { html: 'Formalidades de entrada e saída dos países de destino: consulte as autoridades de cada país com antecedência (veja o módulo “Partida e chegada” da Travessia oceânica).' }
      ],
      custo: {
        oficial: [{ html: 'ARC 2026: £1.500 de taxa do barco (exemplo de 13,2 m, 43 pés) mais £185 por tripulante. Fora isso, o custo é do barco, do seguro e da preparação.', ref: 'travessia-52' }],
        texto: 'O custo total varia muito: barco, revisão, equipamento de segurança, comunicações, seguro, mantimentos, marinas e taxas dos países de destino.'
      },
      tempo: { estudoH: 60, praticaH: 168, marDias: 21, base: 'Meta do app: 60 horas de planejamento e preparação mais cerca de 21 dias de travessia (como no ARC), contando 8 horas por dia.', baseRef: 'travessia-47' },
      mar: { mn: 5000, texto: '5.000 mn no total, com a passagem como imediato e uma passagem de 600 mn ou mais como comandante antes' },
      competencias: [
        { id: 'c1', txt: 'Planejo rota e janela de tempo (cartas piloto, ventos, correntes, portos de arribada) e um plano de contingência.' },
        { id: 'c2', txt: 'O barco passou por revisão completa: velame, cordame, motor, leme de emergência, bomba, energia e gás.' },
        { id: 'c3', txt: 'A segurança está em ordem: balsa, EPIRB registrada, coletes, tirantes, AIS pessoal, extintores e kit médico.' },
        { id: 'c4', txt: 'As comunicações estão em ordem: VHF com DSC, HF ou satélite, previsão do tempo a bordo e rotina de contato com terra.' },
        { id: 'c5', txt: 'Escolhi e treinei a tripulação, com quartos e regras de convés combinados.' },
        { id: 'c6', txt: 'Os documentos estão em dia: CHA de Capitão-Amador, licença da estação, registro da EPIRB, seguro e formalidades dos países de destino.' }
      ],
      links: { curso: [{ rota: 'travessia', rotulo: 'Curso de Travessia oceânica' }, { rota: 'travessia/m12', rotulo: 'Você está pronto para comandar?' }, { rota: 'travessia/m3', rotulo: 'Preparar o barco: segurança offshore' }, { rota: 'radio/m3', rotulo: 'HF/SSB, satélite e GMDSS' }], simulado: 'travessia', flash: 'travessia', locais: ['rally-oceanico', 'charter', 'regata'] }
    }
  ];

  /* ---------- certificações complementares ---------- */
  var COMPLEMENTARES = [
    {
      id: 'radio', titulo: 'Radioperador (Anatel)', icone: 'radio',
      resumo: 'Certificado de operador de rádio para usar o VHF e, depois, o HF e o GMDSS.',
      quando: 'Antes de comandar com rádio a bordo (etapa 6 em diante).',
      fatos: [
        { html: 'No Brasil, a Anatel aplica, por convênio com a Marinha, as provas de Operador Radiotelefonista nas categorias Geral e Restrito.', ref: 'radio-01' },
        { html: 'O certificado é gratuito, intransferível e tem validade indeterminada. Segundo a página da Anatel, pode ser obtido por pessoa física maior de idade residente no Brasil.', ref: 'radio-02' },
        { html: 'A inscrição é feita no Sistema SEC da Anatel, com login gov.br, e as provas são online.', ref: 'radio-03' },
        { html: 'A NORMAM-211 não exige certificado de operador de rádio para o condutor amador (o VHF é cobrado dentro das provas da CHA), mas manda obter a Licença de Estação de Navio na Anatel.', ref: 'radio-15' },
        { html: 'O Regulamento Geral dos Serviços de Telecomunicações exige certificado de radiotelefonista para operar estações do serviço móvel marítimo.', ref: 'radio-12' }
      ],
      custo: { html: 'Gratuito (exame e certificado).', ref: 'radio-02' },
      links: { curso: [{ rota: 'radio/m4', rotulo: 'Licenças e certificados de rádio no Brasil' }, { rota: 'radio/m1', rotulo: 'VHF e DSC na prática' }], locais: ['radio-certificacao'] }
    },
    {
      id: 'primeiros-socorros', titulo: 'Primeiros socorros', icone: 'seguranca',
      resumo: 'Curso de primeiros socorros adequado ao mar, onde o socorro médico demora.',
      quando: 'Antes das travessias de 24 a 72 horas (etapa 8) e obrigatório em várias regatas.',
      fatos: [
        { html: 'A NORMAM-211 põe no comandante a responsabilidade pelos medicamentos e pelo material de primeiros socorros.', ref: 'radio-92' },
        { html: 'O CBSN (Curso Básico de Segurança de Navio) tem 34 horas, inclui primeiros socorros elementares e o certificado vale 5 anos.', ref: 'radio-58' },
        { html: 'O CPSO (Primeiros Socorros) da DPC tem 7 dias e 52 horas e exige o CBSP concluído nos últimos 5 anos.', ref: 'radio-56' },
        { html: 'Nas regras de segurança da World Sailing, na Categoria 1, pelo menos dois tripulantes precisam de certificado de primeiros socorros feito nos últimos 5 anos.', ref: 'radio-81' }
      ],
      custo: { texto: 'Varia; veja cursos em “Onde estudar”.' },
      links: { curso: [{ rota: 'radio/m6', rotulo: 'Primeiros socorros: cursos e preparo' }, { rota: 'arrais/m12', rotulo: 'Primeiros socorros a bordo' }], locais: ['seguranca-sobrevivencia'] }
    },
    {
      id: 'sobrevivencia', titulo: 'Sobrevivência no mar', icone: 'ancora',
      resumo: 'Balsa, abandono, hipotermia, homem ao mar e comunicações de emergência, treinados na prática.',
      quando: 'Antes de embarcar em regatas oceânicas (etapa 10) e de comandar a travessia (etapa 12).',
      fatos: [
        { html: 'Nas categorias 1 e 2 das OSR, pelo menos 30% da tripulação, nunca menos de dois, incluindo o responsável, deve ter feito o treinamento nos 5 anos anteriores à largada.', ref: 'radio-71' },
        { html: 'O curso modelo da World Sailing (Offshore Personal Survival) tem dois dias de 8 horas, e o certificado vale 5 anos.', ref: 'radio-78' },
        { html: 'A World Sailing recomenda não aceitar cursos STCW de sobrevivência no mar como alternativa a esse curso, porque não cobrem itens de vela e de equipamentos de recreio.', ref: 'radio-84' },
        { html: 'Na lista de provedores reconhecidos pela World Sailing não há entrada para o Brasil. Confira antes de se inscrever em qualquer curso se o aviso de regata o aceita.', ref: 'radio-85' }
      ],
      custo: { texto: 'Varia; veja cursos em “Onde estudar”.' },
      links: { curso: [{ rota: 'radio/m7', rotulo: 'Sobrevivência no mar: cursos' }, { rota: 'arrais/m11', rotulo: 'Salvatagem e sobrevivência' }, { rota: 'capitao/m11', rotulo: 'Sobrevivência em mar aberto' }], locais: ['seguranca-sobrevivencia'] }
    },
    {
      id: 'gmdss', titulo: 'GMDSS e radioperador em GMDSS', icone: 'globo',
      resumo: 'Para quem vai usar HF e satélite: o curso completo de operação do sistema global de socorro.',
      quando: 'Opcional, antes da etapa 12.',
      fatos: [
        { html: 'O CROG (Curso de Radioperador em GMDSS) da DPC tem 3 semanas e 88 horas.', ref: 'radio-54' },
        { html: 'Para o RYA Yachtmaster Offshore é exigido certificado de rádio GMDSS (ex.: RYA SRC ou superior).', ref: 'internacional-37', intl: true }
      ],
      custo: { html: 'Exemplo de preço anunciado: R$ 3.490 por um curso de GMDSS (West Group).', ref: 'radio-94' },
      links: { curso: [{ rota: 'radio/m3', rotulo: 'HF/SSB, satélite e GMDSS' }, { rota: 'capitao/m10', rotulo: 'Comunicações oceânicas e GMDSS' }], locais: ['radio-certificacao'] }
    },
    {
      id: 'intl', titulo: 'RYA, ICC e ASA', icone: 'globo', intl: true,
      resumo: 'Certificados estrangeiros, úteis para fretar barcos no exterior e como referência de experiência. Não valem como habilitação no Brasil.',
      quando: 'Quando você quiser fretar barcos no exterior ou usar os critérios como meta.',
      fatos: [
        { html: 'A NORMAM-211 não dá CHA por equivalência a habilitação estrangeira: quem quer a CHA começa pelo Arrais-Amador.', ref: 'normas-129' },
        { html: 'O ICC emitido pelo RYA vale 5 anos e serve como prova de competência quando uma autoridade de outro país pede.', ref: 'internacional-82' },
        { html: 'O ICC não é uma qualificação verdadeiramente internacional: a validade é determinada pelo país visitado. Para charter no exterior, pergunte à empresa, por escrito, que evidência ela aceita.', ref: 'internacional-92' },
        { html: 'O Day Skipper Practical (RYA) valida no ICC as categorias Vela e Águas Costeiras.', ref: 'internacional-76' },
        { html: 'A Croácia reconhece a CHA brasileira para charter sem tripulação: Arrais-Amador até 18 m em águas interiores e mar territorial; Mestre-Amador até 24 m no Adriático; Capitão-Amador até 24 m sem restrição de área.', ref: 'internacional-107' }
      ],
      custo: { html: 'ICC do RYA para não membros: £75, válido por 5 anos. A emissão é gratuita para membros do RYA.', ref: 'internacional-84' },
      links: { curso: [{ rota: 'radio/m8', rotulo: 'Certificados internacionais úteis' }, { rota: 'vela/m10/l5', rotulo: 'Benchmarks internacionais: RYA e ASA' }], locais: ['escola-rya', 'escola-asa'] }
    }
  ];

  /* ---------- como achar e agendar a prova ---------- */
  var AGENDAMENTO = {
    arrais_mestre: [
      {
        titulo: 'Descubra a sua Capitania',
        texto: 'A DPC tem a página “Localize a Capitania Mais Próxima”, com cada Capitania, Delegacia e Agência e os municípios que atende. Use também a lista abaixo.',
        fatos: [
          { html: 'Para saber em qual Capitania, Delegacia ou Agência será atendido, a DPC indica a página “Localize a Capitania Mais Próxima”.', ref: 'taxas-32' },
          { html: 'Os exames de Mestre-Amador e de Arrais-Amador são programados por cada Capitania, Delegacia ou Agência, que também divulga a lista de aprovados.', ref: 'taxas-34' }
        ],
        aviso: { tipo: 'aconfirmar', titulo: 'Qualquer Capitania serve?', html: 'Para o Capitão-Amador, a inscrição é presencial no GAP de qualquer Capitania, Delegacia ou Agência. Para Arrais e Mestre, a Carta de Serviços da DPC fala em atendimento no GAP da Capitania, Delegacia ou Agência da jurisdição. Ligue ou escreva para a que você escolher e pergunte se ela atende candidatos de fora da área.', refs: ['taxas-54', 'taxas-30'] }
      },
      {
        titulo: 'Só para Arrais: faça o treinamento prático',
        texto: 'Procure um estabelecimento de treinamento náutico (ETN) ou instrutor credenciado na Capitania. Peça o atestado do anexo 5-E.',
        fatos: [
          { html: 'O atestado exige no mínimo seis horas de treinamento teórico e prático (2 h de teoria e 4 h de prática).', ref: 'normas-58' },
          { html: 'Precisa de firma reconhecida ou assinatura digital gov.br do representante da ETN, do instrutor e do aluno.', ref: 'normas-45' },
          { html: 'Vale em todo o país por 2 anos a partir da emissão.', ref: 'normas-59' }
        ]
      },
      {
        titulo: 'Gere e pague a GRU',
        texto: 'No site da DPC, em “Serviços da Diretoria” e depois “Serviços Administrativos”, escolha a Organização Militar onde será atendido, a categoria Amador e o item da CHA.',
        fatos: [
          { html: 'Caminho do formulário: Organização Militar, categoria “AMADOR”, tipo de serviço “SERVICOS ADMINISTRATIVOS” e o item da CHA.', ref: 'taxas-20' },
          { html: 'Valor vigente em 2026: R$ 60,32, o mesmo para ARA, MSA e CPA.', ref: 'taxas-01' },
          { html: 'A guia só pode ser paga após um dia útil da emissão e é compensada em até dois dias úteis após o pagamento.', ref: 'taxas-21' },
          { html: 'Segundo a Capitania dos Portos da Bahia, Pix e cartão de crédito compensam quase na hora; o boleto só pode ser pago 24 h depois e compensa em 48 h.', ref: 'taxas-22' }
        ]
      },
      {
        titulo: 'Agende o atendimento no SISAP',
        texto: 'Depois que a GRU compensar, agende o atendimento presencial pela internet, com o login do CPF e a senha gov.br. Guarde o número da GRU: ele é pedido no agendamento.',
        links: [
          { txt: 'SISAP: agendamento eletrônico (endereço citado pela Capitania dos Portos da Bahia)', url: 'https://atendimento-dpc.marinha.mil.br/sisap/agendamento/#/' }
        ],
        fatos: [
          { html: 'O agendamento eletrônico de atendimento (SISAP) é feito pela internet.', ref: 'taxas-24' },
          { html: 'Na CPBA, o serviço a escolher é “CHA, inscrição para o exame e emissão para Arrais-Amador, Mestre-Amador e Capitão-Amador”.', ref: 'taxas-25' }
        ]
      },
      {
        titulo: 'Compareça com os documentos',
        texto: 'No atendimento, você entrega os documentos, marca a data e a hora da prova, recebe um protocolo e tem a foto capturada.',
        fatos: [
          { html: 'Documentos: identidade com foto, CPF, comprovante de residência, comprovante da GRU, atestado médico (ou CNH válida) e, para Arrais, o atestado de treinamento.', ref: 'taxas-36' },
          { html: 'Se o processo ficar “em exigência”, a pendência deve ser resolvida em até 60 dias; depois disso o pedido é indeferido (regra da CPBA).', ref: 'taxas-27' }
        ]
      },
      {
        titulo: 'Faça a prova',
        texto: 'Leve protocolo, identidade e caneta azul ou preta. No Mestre, leve também o material de desenho.',
        fatos: [
          { html: 'Arrais-Amador: prova eletrônica ou escrita de 40 questões, com duração máxima de 2 horas.', ref: 'taxas-45' },
          { html: 'Mestre-Amador: prova eletrônica ou escrita de 40 questões de múltipla escolha (quatro com carta náutica), com duração máxima de 3 horas.', ref: 'taxas-44' },
          { html: 'Nas três categorias, a nota máxima é 10,0 e é aprovado quem obtém pelo menos 5,0.', ref: 'taxas-46' }
        ]
      },
      {
        titulo: 'Receba a CHA digital',
        texto: 'Se aprovado, a CHA fica no aplicativo gov.br depois do aviso por SMS ou e-mail.',
        fatos: [
          { html: 'A CHA digital fica disponível no aplicativo gov.br e pode ser impressa se o QR Code ficar legível.', ref: 'taxas-64' },
          { html: 'Prazo de atendimento informado pela DPC: 15 dias úteis a partir do recebimento da documentação, sem pendências.', ref: 'taxas-31' }
        ]
      },
      {
        titulo: 'Reprovou ou faltou?',
        texto: 'Paga uma nova GRU e faz nova inscrição.',
        fatos: [
          { html: 'A GRU paga por candidato reprovado ou faltoso não pode ser reaproveitada.', ref: 'taxas-10' },
          { html: 'A Capitania dos Portos da Bahia informa que a segunda prova só pode ser feita cinco dias úteis após a anterior (regra local).', ref: 'taxas-29' }
        ]
      }
    ],
    capitao: [
      {
        titulo: 'Fique de olho no calendário',
        texto: 'O Capitão-Amador tem duas épocas por ano. Planeje o estudo para terminar antes da inscrição.',
        fatos: [
          { html: 'As inscrições ocorrem, em princípio, em fevereiro e agosto, com exames em abril e outubro. As datas podem mudar; acompanhe o calendário no site da DPC.', ref: 'taxas-50' },
          { html: 'Exemplo de 2026, edição I: inscrições de 2 de fevereiro a 13 de março e prova em 29 de abril, das 14h às 18h.', ref: 'taxas-51' },
          { html: 'Edição II: inscrições de 3 a 18 de agosto e prova em 1º de outubro, das 14h às 18h.', ref: 'taxas-52' }
        ]
      },
      {
        titulo: 'Tenha o Mestre-Amador válido',
        texto: 'A CHA de Mestre-Amador precisa estar dentro da validade no dia da inscrição.',
        fatos: [{ html: 'Para o exame de Capitão-Amador o candidato deve ter CHA de Mestre-Amador dentro da validade no ato da inscrição.', ref: 'normas-48' }]
      },
      {
        titulo: 'Gere e pague a GRU',
        texto: 'Mesmo caminho do Arrais e do Mestre: site da DPC, “Serviços da Diretoria”.',
        fatos: [{ html: 'Valor vigente em 2026: R$ 60,32.', ref: 'taxas-01' }]
      },
      {
        titulo: 'Inscreva-se no GAP',
        texto: 'A inscrição é presencial, sem agendamento, no Grupo de Atendimento ao Público de qualquer Capitania, Delegacia ou Agência.',
        fatos: [
          { html: 'A inscrição no CPA é presencial no GAP de qualquer CP, DL ou AG e não exige agendamento.', ref: 'taxas-54' },
          { html: 'Documentos: os mesmos do Mestre (identidade, CPF, residência, GRU, atestado médico ou CNH), mais a CHA de Mestre-Amador.', ref: 'taxas-36' }
        ]
      },
      {
        titulo: 'Faça a prova',
        texto: 'Prova escrita, em papel, no dia nacional. Leve caneta e material de desenho.',
        fatos: [
          { html: 'Exame de Capitão-Amador: prova escrita de 40 questões, com duração máxima de 4 horas.', ref: 'taxas-43' },
          { html: 'Prova de 2026 (CPA II): 40 questões de múltipla escolha com alternativas A a E; cada questão vale 0,25.', ref: 'normas-88' }
        ]
      },
      {
        titulo: 'Resultado e recurso',
        texto: 'A DPC divulga o gabarito e a lista de aprovados. Se discordar, peça revisão dentro do prazo.',
        fatos: [
          { html: 'O candidato pode pedir revisão em até 7 dias úteis após a divulgação da prova e do gabarito.', ref: 'taxas-47' },
          { html: 'Cronograma da edição II de 2026: gabarito preliminar até 06/10, recursos de 6 a 16/10, gabarito final até 05/11 e lista de aprovados até 16/11.', ref: 'taxas-53' }
        ]
      }
    ],
    oficiais: [
      { txt: 'DPC: Navegador Amador', url: 'https://www.marinha.mil.br/dpc/navegador-amador' },
      { txt: 'DPC: Localize a Capitania Mais Próxima', url: 'https://www.marinha.mil.br/dpc/localize-capitania/' },
      { txt: 'DPC: Serviços da Diretoria (GRU)', url: 'https://www.marinha.mil.br/dpc/servicos-da-diretoria' },
      { txt: 'DPC: Tabelas de Indenizações', url: 'https://www.marinha.mil.br/dpc/tabelas-de-indenizacoes' },
      { txt: 'NORMAM-211/DPC (PDF)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf' }
    ]
  };

  /* Totais de leitura das lições do app (minutos), usados só para informar a duração do estudo.
     Gerado em 2026-10-08 a partir de data/cursos/*.js. */
  var MINUTOS_CURSO = { arrais: 965, mestre: 878, capitao: 935, vela: 589, travessia: 668, radio: 454 };

  VL.dado('roteiro', {
    atualizado: '2026-10-08',
    ritmoPadrao: 6,
    horasPorDiaDeMar: 8,
    esperaProvaCapitaoSemanas: 22,
    minutosCurso: MINUTOS_CURSO,
    etapas: ETAPAS,
    complementares: COMPLEMENTARES,
    agendamento: AGENDAMENTO
  });
})();
