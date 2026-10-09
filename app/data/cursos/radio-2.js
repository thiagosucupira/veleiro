/* Curso Rádio, segurança e certificados, parte 2 (módulos m6 a m8): primeiros socorros (cursos e preparo),
   sobrevivência no mar (cursos) e certificados internacionais úteis (RYA, ICC, ASA).
   Fatos regulatórios só com {t:'fato', ref} ou fontes com ref (selo automático). Os ids "extra-radio-2-NN" estão em
   research/_work/research_extra_radio-2.json e passam pela verificação dupla depois.
   Conteúdo técnico (não regulatório): cita a fonte no fim de cada lição. Conteúdo: CC BY-SA 4.0. */
(function () {
  'use strict';
  /* Figura SVG inline: id curto único, título acessível, viewBox, corpo. Cores só por variáveis do tema. */
  function S(id, titulo, vb, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" role="img" aria-labelledby="' + id + '-t" style="max-width:' + (maxw || 460) +
      'px;display:block;margin:0 auto" font-family="inherit"><title id="' + id + '-t">' + titulo + '</title>' + corpo + '</svg>';
  }
  /* Passo a passo vertical (cartões numerados ligados por setas): passos = [[título, subtítulo], ...]. */
  function FLUXO(id, titulo, passos, destaque) {
    var h = 58, gap = 14, w = 420, y = 8, out = '';
    passos.forEach(function (p, i) {
      var cor = (destaque === i) ? 'var(--magenta)' : 'currentColor';
      out += '<rect x="8" y="' + y + '" width="' + (w - 16) + '" height="' + h + '" rx="10" fill="var(--sea-1)" stroke="' + cor + '" stroke-width="' + (destaque === i ? 2.5 : 1.5) + '"/>' +
        '<circle cx="40" cy="' + (y + h / 2) + '" r="15" fill="var(--sea-3)" stroke="currentColor" stroke-width="1.2"/>' +
        '<text x="40" y="' + (y + h / 2 + 5) + '" font-size="15" font-weight="700" text-anchor="middle" fill="currentColor">' + (i + 1) + '</text>' +
        '<text x="68" y="' + (y + 25) + '" font-size="16" font-weight="700" fill="currentColor">' + p[0] + '</text>' +
        '<text x="68" y="' + (y + 45) + '" font-size="14" fill="currentColor">' + p[1] + '</text>';
      if (i < passos.length - 1) {
        out += '<path d="M' + (w / 2) + ' ' + (y + h) + ' L' + (w / 2) + ' ' + (y + h + gap - 3) + '" stroke="var(--magenta)" stroke-width="2.5" fill="none"/>' +
          '<path d="M' + (w / 2 - 6) + ' ' + (y + h + gap - 9) + ' L' + (w / 2) + ' ' + (y + h + gap - 1) + ' L' + (w / 2 + 6) + ' ' + (y + h + gap - 9) + '" stroke="var(--magenta)" stroke-width="2.5" fill="none"/>';
      }
      y += h + gap;
    });
    return S(id, titulo, '0 0 ' + w + ' ' + (y - gap + 8), out, 440);
  }
  /* Questão no formato oficial (nível radio). A certa entra na posição pos (0 a 3) entre as erradas. */
  function Q(id, tema, dificuldade, enunciado, certa, erradas, pos, explicacao, referencia, fonte_url) {
    var alt = erradas.slice();
    alt.splice(pos, 0, certa);
    var q = { id: id, nivel: 'radio', tema: tema, dificuldade: dificuldade, enunciado: enunciado,
      alternativas: alt, correta: pos, explicacao: explicacao, referencia: referencia };
    if (fonte_url) q.fonte_url = fonte_url;
    return q;
  }
  var OSR1 = 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf';
  var N211 = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var M = [];

/* ================= m6: Primeiros socorros: cursos e preparo ================= */
M.push({
  id: 'm6', titulo: 'Primeiros socorros: cursos e preparo',
  resumo: 'Por que fazer um curso presencial, quais cursos existem no Brasil e no exterior para quem não é marítimo profissional, o que um curso offshore cobre e como montar o kit e o treinamento da tripulação.',
  licoes: [
    {
      id: 'l1', titulo: 'Por que fazer um curso presencial, e o que as regras pedem', minutos: 11,
      objetivos: [
        'Explicar por que primeiros socorros se aprendem com treino prático, e não só lendo.',
        'Dizer o que a prova de Arrais-Amador, a NORMAM-211 e as regras de regata oceânica pedem sobre o assunto.',
        'Montar a cadeia de resposta a um acidente a bordo, da prevenção à decisão de pedir socorro.',
      ],
      blocos: [
        { t: 'p', html: 'Quando alguém se machuca ou passa mal a bordo, não existe ambulância. Perto da costa, o hospital pode estar a algumas horas. No meio de uma travessia, está a dias. Quem está no barco precisa fazer o primeiro atendimento, pedir orientação por rádio e decidir se o barco desvia de rota ou se pede evacuação.' },
        { t: 'p', html: 'Este módulo <b>não ensina a tratar ferimentos</b>. Ele mostra como se preparar: que cursos existem, o que cobram, o que valem para as regras e como organizar kit e treino da tripulação. O atendimento em si está no módulo “Primeiros socorros a bordo” do curso de Arrais-Amador.' },
        { t: 'termos', ids: ['hipotermia', 'choque-termico', 'enjoo', 'homem-ao-mar'] },
        { t: 'h', txt: 'Por que só ler não basta' },
        { t: 'p', html: 'Comprimir o tórax, estancar uma hemorragia e imobilizar um braço são habilidades das mãos e do corpo. Lê-las num manual é útil, mas não é treino. Num curso presencial você pratica em manequins, um instrutor corrige o seu movimento na hora, e você descobre sozinho o que não sabia que não sabia. O curso modelo de primeiros socorros das regras de regata oceânica reserva uma sessão inteira de prática, com RCP (ressuscitação cardiopulmonar), observação e tratamento do paciente, uso do rádio para pedir orientação médica e decisão de quando pedir ajuda.' },
        { t: 'fato', ref: 'extra-radio-2-08', html: 'O Apêndice H das OSR descreve um curso modelo de pelo menos um dia, com sessões práticas de RCP, observação e tratamento de pacientes, treino de rádio médico e decisão sobre quando pedir ajuda ou interromper a regata.' },
        { t: 'fato', ref: 'extra-radio-2-15', html: 'O RYA, entidade britânica de vela, diz que o ideal é que todos os tripulantes façam o curso de primeiros socorros, porque é difícil uma só pessoa navegar, governar, pedir ajuda e ressuscitar ao mesmo tempo.' },
        { t: 'p', html: 'Esse segundo ponto vale para qualquer barco. Se o único tripulante treinado é quem está ferido, ou quem está ao leme, o treino não ajuda ninguém. Por isso, o objetivo é <b>mais de uma pessoa</b> treinada a bordo, e não apenas o comandante.' },
        { t: 'h', txt: 'O que a Marinha pede' },
        { t: 'fato', ref: 'normas-105', html: 'O programa do exame de Arrais-Amador inclui RIPEAM, marés, estabilidade básica, salvatagem, incêndio, primeiros socorros e o RLESTA e a NORMAM-211.' },
        { t: 'fato', ref: 'radio-92', html: 'A NORMAM-211 recomenda que embarcações de mar aberto com menos de 15 pessoas tenham a caixa de medicamentos (item I do Anexo 4-C) e põe no comandante a responsabilidade pelos medicamentos e pelo material de primeiros socorros.' },
        { t: 'fato', ref: 'radio-93', html: 'Para orientações de primeiros socorros, a NORMAM-211 indica o aplicativo FICR, da Cruz Vermelha.' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Curso obrigatório?', html: 'A prova da Marinha cobra o assunto na teoria. Não encontramos na NORMAM-211 uma exigência de certificado de curso de primeiros socorros para o condutor amador. Antes de decidir, confirme com a sua Capitania; o curso, de qualquer forma, é uma decisão de segurança sua e não só de papel.' },
        { t: 'h', txt: 'O que as regras de regata e de rally pedem' },
        { t: 'p', html: 'As Offshore Special Regulations (OSR, regras de segurança da World Sailing) dividem as regatas em categorias. Quanto mais longe da costa e mais tempo sem ajuda, menor o número da categoria e maior o rigor. A parte médica fica na regra 6.05.' },
        { t: 'fato', ref: 'radio-70', html: 'Pela OSR, a Categoria 0 é para regatas transoceânicas com autossuficiência por períodos muito longos, e a Categoria 1 para regatas longas e bem afastadas da costa, sem expectativa de ajuda externa.' },
        { t: 'fato', ref: 'radio-80', html: 'Categoria 0: um tripulante precisa de certificado STCW A-VI/4-2 (Proficiency in Medical Care) ou equivalente e outro de certificado de primeiros socorros dos últimos 5 anos.' },
        { t: 'fato', ref: 'radio-81', html: 'Categoria 1: pelo menos dois tripulantes precisam de certificado de primeiros socorros feito nos últimos 5 anos. Categoria 2: um deve conhecer primeiros socorros, hipotermia, afogamento, RCP e comunicações, e outro precisa de certificado.' },
        { t: 'fato', ref: 'radio-83', html: 'Categorias 3 e 4: pelo menos dois tripulantes devem conhecer primeiros socorros, hipotermia, afogamento, RCP e os sistemas de comunicação.' },
        { t: 'fato', ref: 'loc_regatas-18', html: 'A World Cruising Club, organizadora da ARC, exige que o skipper e pelo menos um tripulante façam treinamento que inclua balsa salva-vidas, homem ao mar, controle de avarias, primeiros socorros, meteorologia e comunicações de emergência.' },
        { t: 'callout', tipo: 'dica', titulo: 'A regra é piso, não teto', html: 'Cumprir o mínimo da OSR significa que dois tripulantes têm certificado. Numa travessia de semanas, com quatro pessoas, o razoável é que <b>todos os que fazem quarto</b> tenham pelo menos o nível elementar. Os certificados também vencem, e o treino se perde sem prática: planeje refazê-lo.' },
        { t: 'h', txt: 'A cadeia de resposta' },
        { t: 'p', html: 'Os cursos de boa qualidade ensinam uma <b>sequência</b>, e não uma lista solta de técnicas. A figura mostra a cadeia que organiza o curso modelo das OSR. A etapa em destaque é a que mais se subestima: pedir orientação e decidir. Saber quando chamar ajuda externa, ou interromper a viagem e ir ao porto mais próximo, é uma habilidade do comandante que também se treina.' },
        { t: 'figura', svg: FLUXO('m6f1', 'Cadeia de resposta a um acidente a bordo em cinco passos: prevenir, reconhecer, agir, pedir orientação e decidir', [
          ['Prevenir', 'colete, arnês, sono, alimentação, mão firme'],
          ['Reconhecer', 'sinais e sintomas, do enjoo ao choque'],
          ['Agir', 'atendimento básico: L-ABCDE, hemorragia, RCP'],
          ['Pedir orientação', 'rádio, telemedicina, SALVAMAR'],
          ['Decidir', 'seguir viagem, desviar ou evacuar'],
        ], 3), legenda: 'Cadeia de resposta médica a bordo. O passo 4 está em destaque porque exige rádio funcionando e alguém que saiba descrever o caso.' },
        { t: 'check', questoes: [
          Q('radio2-m6-l1-q1', 'Primeiros socorros: cursos', 1, 'Por que o treino presencial é melhor do que só ler o manual de primeiros socorros?',
            'Porque compressões no tórax, curativos e imobilizações são habilidades práticas, que se treinam em manequim com um instrutor corrigindo.',
            ['Porque a lei proíbe estudar primeiros socorros sozinho.', 'Porque o manual não deve ser levado a bordo.', 'Porque quem faz curso presencial está dispensado de ter kit médico.'], 0,
            'O curso modelo das OSR inclui prática de RCP, observação de pacientes e rádio médico, o que o livro não substitui. Nenhuma lei proíbe estudar sozinho, o manual de bordo é recomendado e o curso não dispensa o kit.',
            'OSR, Apêndice H; fato extra-radio-2-08', OSR1),
          Q('radio2-m6-l1-q2', 'Primeiros socorros: cursos', 2, 'Numa regata de OSR Categoria 1, quantos tripulantes precisam ter certificado de primeiros socorros feito nos últimos 5 anos?',
            'Pelo menos dois.',
            ['Só o comandante.', 'Nenhum, basta conhecer o assunto.', 'Todos os tripulantes, sem exceção.'], 2,
            'A OSR 6.05.2 pede pelo menos dois tripulantes com certificado na Categoria 1. O “apenas conhecer” vale para as Categorias 3 e 4 (e em parte para a 2). Exigir todos, ou só o comandante, não é o que a regra diz.',
            'OSR 6.05.2; fato radio-81', OSR1),
          Q('radio2-m6-l1-q3', 'Primeiros socorros: cursos', 2, 'Pela NORMAM-211, quem responde pelos medicamentos e pelo material de primeiros socorros do barco?',
            'O comandante.',
            ['A Capitania dos Portos, que fiscaliza o estoque.', 'O tripulante mais velho.', 'O fabricante do kit, durante toda a validade.'], 0,
            'A norma recomenda a caixa de medicamentos e põe a responsabilidade no comandante. A Capitania fiscaliza a inspeção, mas não responde pelo estoque do barco, e a idade do tripulante e o fabricante não entram na regra.',
            'NORMAM-211, art. 4.22; fato radio-92', N211),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: 6.05 e Apêndice H', url: OSR1, ref: 'radio-81' },
          { txt: 'NORMAM-211/DPC: art. 4.21 e 4.22 (primeiros socorros e medicamentos)', url: N211, ref: 'radio-92' },
          { txt: 'RYA, curso First Aid', url: 'https://www.rya.org.uk/course-finder/first-aid-course/', ref: 'extra-radio-2-15' },
          { txt: 'World Cruising Club: tripulação e treinamento', url: 'https://worldcruising.com/crew', ref: 'loc_regatas-18' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Cursos de primeiros socorros no Brasil', minutos: 12,
      objetivos: [
        'Distinguir os cursos civis de primeiros socorros dos cursos STCW da Diretoria de Portos e Costas (DPC).',
        'Dizer o que são o CBSN, o CBSP e o CPSO, o que cobrem e o que exigem de quem se matricula.',
        'Escolher um curso com as perguntas certas à escola, sabendo o que ainda precisa confirmar.',
      ],
      blocos: [
        { t: 'p', html: 'No Brasil não existe, até onde o app conseguiu verificar, um curso de primeiros socorros feito só para velejadores amadores. O que existe são duas famílias de cursos, com objetivos diferentes, e é você quem monta o seu preparo com elas.' },
        { t: 'h', txt: 'Família 1: cursos civis de primeiros socorros' },
        { t: 'p', html: 'São os cursos de uso geral, para escola, empresa, casa e rua. A Cruz Vermelha Brasileira é uma referência conhecida; outras instituições de ensino e empresas de treinamento também oferecem.' },
        { t: 'fato', ref: 'extra-radio-2-01', html: 'A Cruz Vermelha Brasileira oferece cursos de primeiros socorros abertos a quem queira aprender, com curso básico de 4 horas e avançado de 30 horas, segundo a didática do Centro de Referência Global em Primeiros Socorros do Movimento Internacional da Cruz Vermelha.' },
        { t: 'p', html: 'A vantagem é que são fáceis de achar, curtos e baratos. O limite é que ensinam o atendimento em terra, com ambulância a minutos de distância. Falta o contexto do mar: movimento do barco, hipotermia, afogamento, evacuação por helicóptero, rádio médico e a decisão de desviar de rota. Use esse tipo de curso como <b>base</b>, e complete com o preparo náutico.' },
        { t: 'callout', tipo: 'dica', titulo: 'Seis perguntas antes de se matricular', html: '<ul><li>Há prática de RCP em manequim, e quantos alunos por manequim?</li><li>O instrutor tem experiência em emergência ou em ambiente náutico?</li><li>O curso trata de hemorragia, queimadura, trauma na cabeça, afogamento e hipotermia?</li><li>O certificado informa carga horária e validade?</li><li>A escola aceita quem não é marítimo profissional?</li><li>Há prova, e o que acontece se eu não for bem?</li></ul>' },
        { t: 'h', txt: 'Família 2: cursos STCW da DPC' },
        { t: 'termos', ids: ['dpc', 'osr'] },
        { t: 'p', html: '<b>STCW</b> é a convenção da Organização Marítima Internacional (IMO) que fixa o treinamento mínimo de marítimos. A DPC mantém cursos de “ensino complementar (offshore)” que seguem as tabelas do Código STCW. São dados por instituições privadas credenciadas pela Marinha e têm currículo e prova padronizados. O interesse para o velejador é que as regras de regata oceânica falam nesse mesmo código: aceitam o treinamento STCW de primeiros socorros elementares ou superior.' },
        { t: 'fato', ref: 'radio-53', html: 'A DPC mantém cursos de Ensino Complementar (offshore) para Profissional Não Tripulante, Tripulante Não Aquaviário e Profissional de Proteção Marítima, entre eles CROG (Radioperador em GMDSS), CPSO (Primeiros Socorros), CBSP, CBSN e CESS.' },
        { t: 'fato', ref: 'radio-82', html: 'Pela OSR 6.05.2, o certificado de primeiros socorros aceito é (a) um curso listado no site da World Sailing como reconhecido pela federação nacional ou (b) treinamento STCW de primeiros socorros A-VI/1-3 (Elementary First Aid) ou nível STCW superior.' },
        { t: 'h', txt: 'Os três cursos' },
        { t: 'p', html: '<b>CBSN, Curso Básico de Segurança de Navio.</b> É o mais curto e o que mais se aproxima do que o velejador procura: sobrevivência pessoal, primeiros socorros elementares e combate a incêndio.' },
        { t: 'fato', ref: 'radio-58', html: 'O CBSN tem 34 horas, é para aluno não tripulante e segue a Regra V/2 e as Tabelas A-VI/1-1 a A-VI/1-4 do Código STCW, que incluem primeiros socorros elementares; o certificado vale 5 anos.' },
        { t: 'fato', ref: 'extra-radio-2-11', html: 'No currículo do CBSN, a sobrevivência pessoal tem 8 horas, os primeiros socorros elementares 4 horas e a prevenção e combate a incêndio 8 horas; a aprovação exige nota mínima 6,0 na prova teórica, conceito satisfatório nas práticas e 90% de frequência. O curso foi desenhado para quem vai trabalhar em navios de passageiros sem ser tripulante.' },
        { t: 'p', html: '<b>CBSP, Curso Básico de Segurança de Plataforma.</b> Parecido com o CBSN, mas pensado para plataformas de petróleo. Tem mais horas de incêndio e de sobrevivência.' },
        { t: 'fato', ref: 'extra-radio-2-17', html: 'O CBSP tem 5 dias e 40 horas, exige ter mais de 18 anos no dia da matrícula, ensino fundamental concluído e boa saúde, e inclui primeiros socorros elementares (6 h) e técnicas de sobrevivência pessoal (9 h).' },
        { t: 'fato', ref: 'extra-radio-2-12', html: 'No currículo do CBSP, a segurança pessoal tem 8 horas, o combate a incêndio 10 horas e a conscientização de proteção 3 horas; exige nota mínima 6,0, conceito satisfatório nas práticas e 90% de frequência.' },
        { t: 'p', html: '<b>CPSO, Curso de Primeiros Socorros.</b> É o curso de saúde propriamente dito, de nível acima do elementar. Para se matricular, a DPC exige o CBSP feito nos últimos cinco anos.' },
        { t: 'fato', ref: 'radio-56', html: 'O CPSO tem 7 dias e 52 horas, segue a Seção A-VI/4 e a Tabela A-VI/4-1 do Código STCW e exige CBSP concluído nos últimos 5 anos.' },
        { t: 'fato', ref: 'extra-radio-2-13', html: 'No currículo do CPSO, primeiros socorros tem 18 horas, prática de primeiros socorros 10 horas e gestão de saúde 20 horas; os instrutores devem ter experiência profissional em emergência hospitalar.' },
        { t: 'figura', svg: FLUXO('m6f2', 'Escada de profundidade dos cursos de primeiros socorros: civil básico, STCW elementar, STCW médico', [
          ['Curso civil básico', 'base prática, em terra; vários locais'],
          ['STCW elementar (CBSN ou CBSP)', 'sobrevivência, incêndio e primeiros socorros'],
          ['STCW médico (CPSO)', 'exige o CBSP; mais profundo e mais longo'],
          ['Cuidado médico (A-VI/4-2)', 'exigido na Categoria 0 das OSR; ver aviso'],
        ], 1), legenda: 'Do mais curto ao mais profundo. O destaque marca o ponto em que a maioria dos velejadores amadores começa.' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Será que o amador pode se matricular?', html: 'As sinopses da DPC pedem idade mínima, escolaridade e boa saúde, mas foram escritas para o marítimo e o trabalhador offshore. Não achamos o nível A-VI/4-2 (exigido na Categoria 0 das OSR) em curso acessível a amador no Brasil. <b>Ligue para a escola</b> e pergunte se aceita velejador amador, se o certificado serve para a regata em que você quer correr e quem decide isso (em geral é o organizador da regata).' },
        { t: 'h', txt: 'Onde fazer' },
        { t: 'fato', ref: 'radio-59', html: 'A lista da DPC de instituições credenciadas (atualizada em 30/09/2026) traz CROG no Rio de Janeiro e em Macaé e CBSN/CBSP no Nordeste (Recife, Salvador, Aracaju, Fortaleza; CBSP também em Guamaré e Mossoró-RN).' },
        { t: 'fato', ref: 'radio-95', html: 'A JJR Solutions oferece o CBSN (STCW) no Rio de Janeiro, na Bahia e em Sergipe, com turma em Salvador em 12/10/2026. A escola informa 5 dias e 40 horas, enquanto a sinopse da DPC dá 34 horas: pergunte qual é a carga horária real.' },
        { t: 'fato', ref: 'radio-96', html: 'A Seaman Náutica oferece o CBSN (STCW) em Recife e Curitiba, com 34 horas, para maiores de 18 anos alfabetizados.' },
        { t: 'p', html: 'A lista da DPC muda. Antes de planejar viagem por causa de um curso, consulte a lista atual e confirme data, preço e requisitos com a própria escola.' },
        { t: 'check', questoes: [
          Q('radio2-m6-l2-q1', 'Primeiros socorros: cursos', 2, 'Qual é a principal diferença entre um curso civil de primeiros socorros e o CBSN da DPC para quem pretende velejar no oceano?',
            'O CBSN segue as tabelas do Código STCW, que as regras de regata oceânica reconhecem; o curso civil ensina o atendimento em terra, sem o contexto do mar.',
            ['O curso civil é o único aceito pelas OSR.', 'O CBSN só pode ser feito por quem já tem Capitão-Amador.', 'Os dois são idênticos e só mudam de nome.'], 0,
            'A OSR 6.05.2 aceita treinamento STCW de primeiros socorros elementares (A-VI/1-3) ou superior, e o CBSN é construído sobre essas tabelas. O curso civil é bom como base, mas não tem o contexto náutico. O CBSN não exige habilitação de amador, e os dois cursos não são idênticos.',
            'OSR 6.05.2; fatos radio-82 e radio-58', OSR1),
          Q('radio2-m6-l2-q2', 'Primeiros socorros: cursos', 2, 'O que a DPC exige para a matrícula no CPSO (Curso de Primeiros Socorros)?',
            'Mais de 18 anos, atestado de boas condições físicas e mentais e o CBSP concluído nos últimos cinco anos.',
            ['Apenas ser maior de 16 anos.', 'Ter a CHA de Capitão-Amador.', 'Ter o curso RYA First Aid.'], 3,
            'A sinopse do CPSO pede os três itens da alternativa correta. A idade mínima é de 18 anos, e não 16; a CHA de amador e o certificado RYA não aparecem como requisito.',
            'DPC, Sinopse do CPSO; fato radio-56', 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_11.pdf'),
          Q('radio2-m6-l2-q3', 'Primeiros socorros: cursos', 2, 'O CBSN da escola A diz 40 horas e a sinopse da DPC diz 34 horas. O que o aluno deve fazer?',
            'Perguntar à escola qual é a carga horária real e conferir que o certificado seguirá o modelo da DPC.',
            ['Nada: os dois números significam a mesma coisa.', 'Desistir do curso, porque ele é inválido.', 'Pagar mais para ter as 6 horas extras.'], 0,
            'A divergência pode ter muitas explicações (horas de prova, de reserva ou outro formato), e quem sabe é a escola. Não é motivo para considerar o curso inválido, nem para pagar a diferença às cegas.',
            'DPC, Sinopse do CBSN; fato radio-95', 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_20.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'DPC, Ensino Complementar (offshore): cursos', url: 'https://www.marinha.mil.br/dpc/offshore-cursos', ref: 'radio-53' },
          { txt: 'DPC, Sinopses do CBSN, CBSP e CPSO', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_20.pdf', ref: 'radio-58' },
          { txt: 'DPC, Instituições credenciadas para cursos presenciais', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Instituicoes_credenciadas_para_ministrar_Cursos_e_Treinamento_na_Modalidade_Presencial.pdf', ref: 'radio-59' },
          { txt: 'Cruz Vermelha Brasileira: Primeiros Socorros', url: 'https://cruzvermelha.org.br/en/campanhas/primeiros-socorros/', ref: 'extra-radio-2-01' },
          { txt: 'World Sailing, OSR 2026-2027: 6.05.2', url: OSR1, ref: 'radio-82' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'O que um curso offshore de primeiros socorros cobre', minutos: 12,
      objetivos: [
        'Listar os assuntos do curso modelo de primeiros socorros das OSR e explicar a sequência L-ABCDE.',
        'Entender os níveis STCW (elementar, médico e cuidado médico) e o que cada um vale numa regata.',
        'Saber como funcionam a telemedicina e o SALVAMAR, e como se prepara para a chamada.',
      ],
      blocos: [
        { t: 'p', html: 'Um curso feito para velejadores oceânicos tem outro foco. O ferido não vai a um hospital em minutos, o barco balança, as mãos estão molhadas e o tempo até o socorro é longo. O curso modelo das OSR (Apêndice H) foi escrito exatamente para isso: formar tripulantes que consigam <b>cuidar de lesões e doenças a bordo</b>, e aconselhar o comandante sobre quando pedir ajuda ou ir ao porto mais próximo.' },
        { t: 'fato', ref: 'extra-radio-2-08', html: 'O Apêndice H das OSR descreve um curso modelo de pelo menos um dia, com as sessões: ambiente médico marítimo; kits por categoria de regata; comunicação de telemedicina; noções básicas (L-ABCDE e controle de hemorragia); acidentes e doenças a bordo; evacuação por helicóptero; enjoo, hipotermia e desidratação; RCP; manejo sistemático do acidente; psicologia da crise; e treino prático.' },
        { t: 'fato', ref: 'extra-radio-2-09', html: 'O Apêndice H sugere que os instrutores conheçam o atendimento médico em alto-mar e, idealmente, sejam médicos, paramédicos ou enfermeiros.' },
        { t: 'h', txt: 'A sequência L-ABCDE' },
        { t: 'p', html: 'A primeira coisa que se aprende é a ordem de olhar. Em vez de correr para o ferimento mais impressionante, você verifica o que pode matar primeiro. O curso modelo das OSR usa a sequência <b>L-ABCDE</b>. Ela só orienta o que olhar, e quem treina é o instrutor.' },
        { t: 'figura', svg: FLUXO('m6f3', 'Sequência L-ABCDE: segurança da cena, vias aéreas e coluna cervical, respiração, circulação e hemorragia, estado neurológico, expor e proteger do ambiente', [
          ['L: segurança da cena', 'o local é seguro para você e para a vítima?'],
          ['A: vias aéreas e coluna cervical', 'a via aérea está livre? há suspeita de trauma?'],
          ['B: respiração', 'a vítima respira? como?'],
          ['C: circulação e hemorragia', 'pulso e sangramentos graves'],
          ['D: estado neurológico', 'consciência, confusão, reação'],
          ['E: expor e proteger do ambiente', 'ver as lesões e evitar frio ou calor'],
        ], 0), legenda: 'A sequência L-ABCDE do curso modelo de primeiros socorros das OSR. Traduzimos os nomes das etapas; as iniciais vêm do inglês.' },
        { t: 'h', txt: 'Os níveis STCW em linguagem simples' },
        { t: 'p', html: 'As regras de regata e os cursos brasileiros falam em “níveis STCW”. A tabela traduz o que cada um é. Os números dos códigos servem para você achar a documentação, e não para decorar.' },
        { t: 'tabela', cab: ['Nível', 'Código STCW', 'Exemplo de curso', 'Onde aparece nas OSR'], linhas: [
          ['Primeiros socorros elementares', 'A-VI/1-3', 'CBSN e CBSP (Brasil)', 'Aceito como certificado na 6.05.2 b'],
          ['Primeiros socorros médicos (nível superior)', 'A-VI/4, Tabela A-VI/4-1', 'CPSO (Brasil)', '“Nível STCW superior” também é aceito'],
          ['Cuidado médico (proficiency in medical care)', 'A-VI/4-2', 'Não achamos curso acessível a amador no Brasil', 'Exigido na Categoria 0 (6.05.1)'],
        ], legenda: 'Fatos de referência: radio-56, radio-58, radio-80 e radio-82.' },
        { t: 'h', txt: 'Um exemplo de curso estrangeiro: RYA First Aid', intl: true },
        { t: 'fato', ref: 'radio-89', intl: true, html: 'O RYA First Aid tem 1 dia em sala, é aprovado pela MCA e cobre RCP com protocolo de afogamento, hipotermia, enjoo e desidratação, pedido de ajuda médica por VHF e resgate por helicóptero.' },
        { t: 'fato', ref: 'internacional-63', intl: true, html: 'O RYA diz que o seu curso de primeiros socorros é pensado para velejadores que se afastam até cerca de 60 milhas da costa.' },
        { t: 'fato', ref: 'internacional-64', intl: true, html: 'Para passagens offshore, o RYA recomenda o curso “Medical First Aid Aboard Ships”; para viagens oceânicas, o “Medical Care Aboard Ships”.' },
        { t: 'fato', ref: 'radio-86', intl: true, html: 'Na lista da World Sailing de cursos de primeiros socorros reconhecidos pelas federações nacionais não há entrada para o Brasil; para a Grã-Bretanha, o curso listado é o RYA First Aid.' },
        { t: 'callout', tipo: 'intl', titulo: 'Por que isso importa para você', html: 'O RYA First Aid é o curso britânico que consta da lista da World Sailing. Mesmo assim, o próprio RYA o recomenda só até cerca de 60 milhas da costa. Numa travessia oceânica, o ideal é um nível maior.', intl: true },
        { t: 'h', txt: 'Rádio médico e SALVAMAR' },
        { t: 'p', html: 'O curso modelo das OSR reserva uma sessão ao apoio médico à distância, por serviços de orientação mantidos por órgãos oficiais, por rádio ou telefone. No Brasil, o SALVAMAR atende pedidos de socorro do mar, inclusive de pessoas que adoecem a bordo.' },
        { t: 'fato', ref: 'radio-48', html: 'O SALVAMAR, Serviço de Busca e Salvamento da Marinha, atende 24 horas pedidos de socorro vindos do mar pelos sistemas de comunicações e pelo telefone 185.' },
        { t: 'fato', ref: 'travessia-108', html: 'Entre as emergências atendidas pelo SALVAMAR estão pessoas que adoecem a bordo e precisam de orientação médica ou de evacuação médica para hospital em terra.' },
        { t: 'p', html: 'Quem faz a chamada precisa passar informações claras. Treine com a tripulação um <b>relatório do paciente</b> de poucas linhas: idade e sexo; o que aconteceu e a que horas; como a pessoa está (consciência, respiração, pulso, temperatura, dor); o que já foi feito e que remédios foram dados; alergias e remédios de uso contínuo; posição do barco e porto mais próximo. A ficha de saúde dos tripulantes, preenchida antes da largada, entrega metade dessas respostas.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Pedir socorro cedo é decisão correta', html: 'Em caso de dúvida sobre a gravidade, chame. Uma conversa com a orientação médica, ou um pedido de urgência ao SALVAMAR, permite que a equipe em terra prepare a ajuda enquanto você atende.' },
        { t: 'check', questoes: [
          Q('radio2-m6-l3-q1', 'Primeiros socorros: cursos', 2, 'Na sequência L-ABCDE do curso modelo das OSR, o que significa a letra “C”?',
            'Circulação e controle de hemorragia.',
            ['Consciência da vítima.', 'Chamar o socorro por rádio.', 'Curativos e imobilizações.'], 1,
            'O C é de circulação (pulso, sangramento grave). A consciência e o estado neurológico ficam na letra D, e o pedido de socorro e os curativos não são uma letra da sequência.',
            'OSR, Apêndice H, Sessão 4; fato extra-radio-2-08', OSR1),
          Q('radio2-m6-l3-q2', 'Primeiros socorros: cursos', 2, 'Um regulamento de regata oceânica de Categoria 0 pede que um tripulante tenha o nível STCW “A-VI/4-2”. Que tipo de curso é esse?',
            'Cuidado médico (proficiency in medical care), de nível superior ao elementar e ao médico de A-VI/4-1.',
            ['Primeiros socorros elementares, como o do CBSN.', 'Curso de radioperador.', 'Curso de combate a incêndio.'], 0,
            'A OSR 6.05.1 pede A-VI/4-2 ou equivalente na Categoria 0. O elementar (A-VI/1-3) é o do CBSN e CBSP; rádio e incêndio são outras tabelas do Código STCW.',
            'OSR 6.05.1; fatos radio-80 e radio-82', OSR1),
          Q('radio2-m6-l3-q3', 'Primeiros socorros: cursos', 1, 'Ao fazer uma chamada pedindo orientação médica por rádio, qual conjunto de informações ajuda mais quem atende?',
            'Idade, o que aconteceu e quando, estado atual (consciência, respiração, pulso), o que já foi feito, alergias e remédios, e posição do barco.',
            ['Só o nome do barco e o canal de rádio.', 'Só o nome do paciente e o tipo de sangue.', 'Só a posição e a hora, para a ajuda localizar o barco.'], 2,
            'A orientação médica depende do quadro clínico e do que já foi feito, e a equipe precisa saber onde você está. Dar só um desses dados deixa o outro lado sem base para decidir.',
            'OSR, Apêndice H, Sessão 3 (telemedicina); boa prática de comunicação médica', OSR1),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: Apêndice H (curso modelo de primeiros socorros)', url: OSR1, ref: 'extra-radio-2-08' },
          { txt: 'DPC, Sinopse do CPSO (Tabela A-VI/4-1 do Código STCW)', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_11.pdf', ref: 'radio-56' },
          { txt: 'RYA, curso First Aid', url: 'https://www.rya.org.uk/course-finder/first-aid-course/', ref: 'radio-89', intl: true },
          { txt: 'RYA, primeiros socorros na água: cursos recomendados', url: 'https://www.rya.org.uk/water-safety/first-aid-on-the-water/first-aid/', ref: 'internacional-64', intl: true },
          { txt: 'Marinha do Brasil, SALVAMAR', url: 'https://www.marinha.mil.br/cpm/185', ref: 'radio-48' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Kit médico e treinamento da tripulação', minutos: 11,
      objetivos: [
        'Montar o kit de primeiros socorros em camadas e saber onde a NORMAM-211 e as OSR param.',
        'Planejar o treino da tripulação: quem faz o quê e quando refazer.',
        'Organizar um simulado anual de emergência médica a bordo.',
      ],
      blocos: [
        { t: 'p', html: 'Um curso e um kit só funcionam juntos. O kit sem treino fica fechado na gaveta; o treino sem kit improvisa com o que tem. Nesta lição você organiza as duas coisas.' },
        { t: 'h', txt: 'O kit em três camadas' },
        { t: 'p', html: 'Em vez de uma caixa única, pense em camadas, que ficam em lugares diferentes do barco. A ideia é que o que mais se usa esteja mais perto, e o que é mais raro esteja guardado com cuidado.' },
        { t: 'figura', svg: S('m6f4', 'Três camadas do kit médico: bolsa de uso rápido no cockpit, kit principal no salão e reserva de medicamentos com lista e validade', '0 0 420 300',
          '<rect x="14" y="14" width="392" height="80" rx="12" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="30" y="42" font-size="16" font-weight="700" fill="currentColor">1. Bolsa de uso rápido (cockpit ou saída)</text>' +
          '<text x="30" y="66" font-size="14" fill="currentColor">curativos, luvas, tesoura, analgésico, enjoo, protetor solar</text>' +
          '<text x="30" y="84" font-size="14" fill="currentColor">o que se usa quase todo dia</text>' +
          '<rect x="14" y="106" width="392" height="86" rx="12" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="30" y="134" font-size="16" font-weight="700" fill="currentColor">2. Kit principal (salão, marcado, estanque)</text>' +
          '<text x="30" y="158" font-size="14" fill="currentColor">talas, ataduras, torniquete, termômetro, manual de primeiros</text>' +
          '<text x="30" y="176" font-size="14" fill="currentColor">socorros e ficha de saúde da tripulação</text>' +
          '<rect x="14" y="204" width="392" height="82" rx="12" fill="var(--sea-3)" stroke="var(--magenta)" stroke-width="2"/>' +
          '<text x="30" y="232" font-size="16" font-weight="700" fill="currentColor">3. Reserva de medicamentos (com lista)</text>' +
          '<text x="30" y="256" font-size="14" fill="currentColor">receitados por médico; com validade, doses e alergias</text>' +
          '<text x="30" y="274" font-size="14" fill="currentColor">à vista e anotados no diário de bordo</text>', 440),
          legenda: 'Organização sugerida de kit médico. É uma boa prática, e não uma exigência de norma.' },
        { t: 'h', txt: 'O que a norma e as regras mandam' },
        { t: 'fato', ref: 'extra-travessia-2-09', html: 'O Anexo 4-C da NORMAM-211 lista a caixa de medicamentos (paracetamol 500 mg, álcool 70%, loção de calamina, clorpromazina 25 mg, hidróxido de alumínio, hidróxido de magnésio, iodeto de potássio, antisséptico, água boricada, água oxigenada, xilocaína gel), correlatos (curativos, tesoura, termômetro, torniquete, talas, ataduras) e um manual de primeiros socorros; a norma recomenda a caixa a embarcações de mar aberto com menos de 15 pessoas.' },
        { t: 'fato', ref: 'travessia-21', html: 'Em todas as categorias das OSR, é exigido manual e kit de primeiros socorros, cujo conteúdo deve refletir as condições prováveis, a duração da travessia e o número de tripulantes.' },
        { t: 'fato', ref: 'travessia-66', html: 'Nos rallies da World Cruising Club, o kit médico e o manual de instruções devem ser adequados a uma travessia oceânica com o número de tripulantes a bordo.' },
        { t: 'callout', tipo: 'nota', titulo: 'A lista da norma é um mínimo', html: 'O Anexo 4-C é uma lista de referência para o uso geral, e não um kit de travessia oceânica. Para dias no mar, monte a lista <b>com um médico</b>, informando o número de pessoas, a duração e as doenças e alergias da tripulação. O guia internacional de referência é o <i>International Medical Guide for Ships</i>, da Organização Mundial da Saúde (OMS), que orienta diagnóstico e tratamento a bordo, com ênfase nas primeiras 48 horas.' },
        { t: 'fato', ref: 'travessia-123', html: 'A 3ª edição do <i>International Medical Guide for Ships</i> orienta diagnóstico, tratamento e prevenção de problemas de saúde a bordo, sobretudo para tripulantes responsáveis pelos cuidados médicos em navios sem médico, com ênfase nas primeiras 48 horas após a lesão.' },
        { t: 'widget', w: 'provisoes', opts: { distancia: 2700, velocidade: 5, tripulacao: 4, navegacao: 'oceanica', lembrar: false }, legenda: 'A calculadora de provisões termina com uma lista de verificação (kit médico, pirotécnicos, sobressalentes). Experimente mudar o número de pessoas e os dias de viagem.' },
        { t: 'h', txt: 'O plano de treinamento da tripulação' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Mapeie quem sabe o quê.</b> Anote os cursos que cada tripulante já fez e a data dos certificados.',
          '<b>Feche as lacunas antes da largada.</b> Mais de uma pessoa treinada a bordo, e pelo menos uma que possa assumir o atendimento se o treinado for o ferido.',
          '<b>Treine em barco parado, à noite e com mar.</b> O mesmo caso, em condições piores, mostra o que falta.',
          '<b>Monte a ficha de saúde.</b> Alergias, remédios, condições crônicas, tipo de sangue (se souber), contato de emergência. Fica no kit principal.',
          '<b>Repita todo ano.</b> O certificado tem prazo de validade (veja o da sua regata), mas a memória e a habilidade desbotam em meses.',
        ] },
        { t: 'fato', ref: 'radio-79', html: 'Pela OSR 6.04, pelo menos uma vez por ano a tripulação deve treinar o resgate de homem ao mar e o abandono da embarcação.' },
        { t: 'p', html: 'A regra fala de homem ao mar e abandono, mas o mesmo princípio vale para o atendimento médico: se é treinado todo ano, funciona; se só foi lido, falha. Um bom simulado de emergência médica tem uma cena, um caso (por exemplo, um tripulante com queimadura na galé) e uma meta (descrever o caso por rádio em dois minutos).' },
        { t: 'tabela', cab: ['Papel no simulado', 'O que faz'], linhas: [
          ['Líder do atendimento', 'Conduz o L-ABCDE e dá as ordens ao ajudante'],
          ['Ajudante', 'Traz o kit, segura, aplica o curativo'],
          ['Rádio', 'Faz a chamada e transmite o relatório do paciente'],
          ['Escriba', 'Anota horários, medicamentos dados e sinais vitais'],
          ['Comandante', 'Mantém o barco em segurança e decide sobre a rota'],
        ], legenda: 'Papéis sugeridos para o simulado. Em tripulação pequena, uma pessoa acumula dois papéis.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Remédio é decisão de médico', html: 'Antibióticos, analgésicos fortes e outros remédios de prescrição só devem ir ao barco com receita e instrução de um médico. O comandante responde pelo estoque, mas não deve “receitar” a bordo sem orientação por rádio ou telefone.' },
        { t: 'check', questoes: [
          Q('radio2-m6-l4-q1', 'Primeiros socorros: cursos', 2, 'A lista do Anexo 4-C da NORMAM-211 serve para uma travessia oceânica de semanas?',
            'Não por si só: é uma lista de referência de uso geral, e o kit de travessia deve ser montado com um médico, conforme a duração e a tripulação.',
            ['Sim, é o kit completo para qualquer travessia.', 'Não, porque a norma proíbe levar medicamentos a bordo.', 'Sim, desde que o kit seja trocado a cada seis meses.'], 0,
            'A própria OSR pede que o kit reflita as condições prováveis, a duração e o número de tripulantes, e a norma só recomenda a caixa como mínimo. Ela não proíbe medicamentos nem fixa troca semestral.',
            'NORMAM-211, Anexo 4-C; OSR (kit); fatos extra-travessia-2-09 e travessia-21', N211),
          Q('radio2-m6-l4-q2', 'Primeiros socorros: cursos', 1, 'Por que a tripulação deve repetir o treino médico todo ano, mesmo com o certificado ainda válido?',
            'Porque a habilidade se perde com o tempo sem prática, e o treino em condições piores revela o que falta.',
            ['Porque a Marinha cancela o certificado após um ano.', 'Porque o treino anual é a única forma de renovar a CHA.', 'Porque só o treino em porto vale como prática.'], 3,
            'A recomendação vem da boa prática, e não de uma regra de validade do certificado. Nem a Marinha cancela o certificado em um ano, nem o treino renova a CHA.',
            'OSR 6.04 (treino anual de homem ao mar e abandono); fato radio-79', OSR1),
          Q('radio2-m6-l4-q3', 'Primeiros socorros: cursos', 2, 'Qual é a melhor forma de guardar o kit médico a bordo?',
            'Em camadas: uma bolsa de uso rápido perto do cockpit, um kit principal marcado e estanque, e a reserva de medicamentos com lista e validade.',
            ['Todo num só armário fechado, longe do cockpit.', 'Espalhado pelo barco, sem lista.', 'Guardado no porão, para ficar longe do calor.'], 0,
            'A organização em camadas coloca perto o que se usa com frequência e guarda o resto com cuidado. Um armário único e distante atrasa o atendimento; sem lista, ninguém sabe o que há; no porão úmido os remédios estragam.',
            'Boa prática de marinharia; OSR (kit); fato travessia-21', OSR1),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: Anexo 4-C (caixa de medicamentos)', url: N211, ref: 'extra-travessia-2-09' },
          { txt: 'World Sailing, OSR 2026-2027: kit e manual de primeiros socorros; 6.04', url: OSR1, ref: 'travessia-21' },
          { txt: 'World Cruising Club: requisitos de segurança dos rallies', url: 'https://worldcruising.com/storage/08-preparations/documents/vE3bIRHdfrfLOLSObKnrlqH3FivjEl8duh8s4ymB.pdf', ref: 'travessia-66' },
          { txt: 'OMS, International Medical Guide for Ships (3ª ed.)', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-123' },
        ] },
      ],
    },
/*__M6_FIM__*/
  ],
});
/* ================= m7: Sobrevivência no mar: cursos ================= */
M.push({
  id: 'm7', titulo: 'Sobrevivência no mar: cursos',
  resumo: 'O que as regras de regata e de rally exigem em treinamento de sobrevivência, como funciona o curso Offshore Personal Survival da World Sailing, o que existe no exterior e no Brasil (RYA, US Sailing, STCW/DPC) e o que você de fato pratica na piscina, no fogo e na água.',
  licoes: [
    {
      id: 'l1', titulo: 'O que as regras exigem de treinamento', minutos: 11,
      objetivos: [
        'Dizer quantos tripulantes precisam de treinamento de sobrevivência em cada categoria das OSR.',
        'Calcular a parcela mínima de uma tripulação e saber o que o treinamento precisa cobrir.',
        'Separar o que a Marinha cobra na prova do que as regras de regata e de rally pedem em treinamento prático.',
      ],
      blocos: [
        { t: 'p', html: 'A segurança de um barco oceânico não está só no equipamento. As regras de regata e os organizadores de rallies exigem também que <b>parte da tripulação seja treinada</b> para o que o equipamento não faz sozinho: abandonar o barco, usar a balsa, recuperar um homem ao mar, pedir socorro e sobreviver na água fria. Esta lição mostra o que as regras pedem. As próximas, como cumprir.' },
        { t: 'termos', ids: ['osr', 'balsa-salva-vidas', 'abandono', 'homem-ao-mar'] },
        { t: 'h', txt: 'As OSR: quem precisa de treinamento' },
        { t: 'p', html: 'A seção 6 das OSR (regras de segurança da World Sailing para regatas de alto-mar) trata do treinamento. O número de pessoas treinadas depende da categoria da regata. Todas as exigências valem para treinamento feito <b>nos cinco anos anteriores à largada</b>.' },
        { t: 'fato', ref: 'radio-72', html: 'OSR 6.01.1: na Categoria 0, todos os tripulantes, incluindo o responsável, devem ter o treinamento da OSR 6.02 nos 5 anos anteriores à largada.' },
        { t: 'fato', ref: 'radio-71', html: 'OSR 6.01.2: nas Categorias 1 e 2, pelo menos 30% da tripulação, nunca menos de dois, incluindo o responsável (person in charge), deve ter feito nos 5 anos anteriores à largada o treinamento dos tópicos da OSR 6.02.' },
        { t: 'fato', ref: 'radio-73', html: 'OSR 6.01.3: na Categoria 3, com só dois tripulantes, pelo menos um deve ter o treinamento da OSR 6.02 nos últimos 5 anos.' },
        { t: 'p', html: 'Veja o que isso significa na prática para a Categoria 1 ou 2. A conta é “30% da tripulação, arredondando para cima, e nunca menos de dois”. O comandante entra obrigatoriamente.' },
        { t: 'tabela', cab: ['Tripulação a bordo', '30% da tripulação', 'Treinados (mínimo)'], linhas: [
          ['3 ou 4 pessoas', '0,9 a 1,2', '2 (o mínimo vale)'],
          ['6 pessoas', '1,8', '2'],
          ['8 pessoas', '2,4', '3'],
          ['10 pessoas', '3,0', '3'],
        ], legenda: 'Cálculo derivado da OSR 6.01.2 (fato radio-71). O arredondamento “para cima” é a leitura natural de “pelo menos 30%”; confirme com a organização da regata.' },
        { t: 'figura', svg: S('m7f1', 'Tripulação de oito pessoas, das quais três treinadas, incluindo o comandante', '0 0 420 150',
          [0,1,2,3,4,5,6,7].map(function (i) {
            var x = 36 + i * 48, tr = i < 3;
            return '<circle cx="' + x + '" cy="52" r="17" fill="' + (tr ? 'var(--magenta)' : 'var(--sea-2)') + '" stroke="currentColor" stroke-width="1.5"/>' +
              '<text x="' + x + '" y="58" font-size="15" font-weight="700" text-anchor="middle" fill="' + (tr ? 'var(--ink)' : 'currentColor') + '">' + (i === 0 ? 'C' : '') + '</text>';
          }).join('') +
          '<text x="210" y="104" font-size="15" text-anchor="middle" fill="currentColor">Oito pessoas: 30% é 2,4, então são três treinadas</text>' +
          '<text x="210" y="128" font-size="14" text-anchor="middle" fill="currentColor">C = comandante, que sempre está entre os treinados</text>', 440),
          legenda: 'Em magenta, quem fez o curso. O comandante (C) entra sempre. As outras ficam na tripulação para dividir o conhecimento.' },
        { t: 'h', txt: 'O que o treinamento precisa cobrir' },
        { t: 'fato', ref: 'radio-75', html: 'A OSR 6.02 lista 15 tópicos de treinamento, entre eles comunicações de emergência (teoria e prática), balsa salva-vidas e abandono, hipotermia, homem ao mar, combate a incêndio e organização de busca e salvamento.' },
        { t: 'lista', itens: [
          'Assistência a outras embarcações',
          'Equipamento de segurança pessoal (teoria e prática)',
          'Cuidado e manutenção do equipamento de segurança',
          'Prevenção e combate a incêndio (teoria e prática)',
          'Prevenção e recuperação de homem ao mar',
          'Hipotermia, choque pelo frio e afogamento',
          'Saúde da tripulação',
          'Meteorologia marítima',
          'Mau tempo',
          'Velas de tempestade',
          'Controle de avarias',
          'Organização de busca e salvamento',
          'Pirotécnicos e sinais (teoria e prática)',
          'Comunicações de emergência (teoria e prática)',
          'Balsas salva-vidas e abandono do barco (teoria e prática)',
        ] },
        { t: 'fato', ref: 'radio-79', html: 'OSR 6.04: pelo menos uma vez por ano a tripulação deve treinar resgate de homem ao mar e abandono da embarcação.' },
        { t: 'h', txt: 'Rallies' },
        { t: 'p', html: 'Os rallies de cruzeiro, como a ARC, usam as OSR como guia e têm suas próprias exigências. Veja o que a organização pede.' },
        { t: 'fato', ref: 'loc_regatas-18', html: 'A World Cruising Club exige que o skipper e pelo menos um tripulante façam treinamento que inclua balsa salva-vidas, homem ao mar, controle de avarias, primeiros socorros, meteorologia e comunicações de emergência.' },
        { t: 'fato', ref: 'travessia-61', html: 'Os Safety Equipment Requirements 2026 da World Cruising Club usam as OSR da World Sailing como guia; a divisão de regata corre sob OSR Categoria 1.' },
        { t: 'h', txt: 'E a Marinha do Brasil?' },
        { t: 'p', html: 'A Marinha cobra o assunto na prova, mas a parte prática do treinamento fica por sua conta.' },
        { t: 'fato', ref: 'programa-30', html: 'A sobrevivência no mar do programa de Capitão-Amador inclui lançamento e abertura de balsas salva-vidas e navegação em balsas.' },
        { t: 'fato', ref: 'extra-arrais-1-34', html: 'O Anexo 4-B da NORMAM-211 recomenda que o amador e os passageiros saibam flutuar na água sem ajuda de flutuantes, para reduzir o risco de afogamento.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'A prova não treina você para a água fria', html: 'Saber de cabeça como se lança uma balsa não é o mesmo que entrar numa balsa virada, molhado e cansado. O que você vai pagar a um curso prático é exatamente a diferença entre as duas coisas.' },
        { t: 'check', questoes: [
          Q('radio2-m7-l1-q1', 'Sobrevivência: cursos', 2, 'Numa regata de OSR Categoria 1, uma tripulação de oito pessoas precisa de quantos tripulantes treinados na OSR 6.02?',
            'Pelo menos três, incluindo o responsável, porque 30% de 8 é 2,4.',
            ['Todos os oito.', 'Apenas dois, o mínimo absoluto.', 'Apenas o comandante.'], 0,
            'A regra fala em “pelo menos 30%, nunca menos de dois”: 30% de oito é 2,4, o que leva a três. O mínimo de dois só vale quando 30% dá menos que isso, e todos os tripulantes só são exigidos na Categoria 0.',
            'OSR 6.01.2; fato radio-71', OSR1),
          Q('radio2-m7-l1-q2', 'Sobrevivência: cursos', 1, 'Dentro de que prazo o treinamento da OSR 6.02 deve ter sido feito, em relação à largada da regata?',
            'Nos cinco anos anteriores à largada.',
            ['Nos 12 meses anteriores.', 'Nos dez anos anteriores.', 'Em qualquer época, pois não vence.'], 0,
            'A OSR 6.01 exige treinamento feito nos 5 anos anteriores. Um ano ou dez anos não são o prazo da regra, e o treinamento vence.',
            'OSR 6.01; fatos radio-71, radio-72', OSR1),
          Q('radio2-m7-l1-q3', 'Sobrevivência: cursos', 2, 'Quantas vezes por ano a tripulação deve praticar recuperação de homem ao mar e abandono da embarcação, segundo a OSR 6.04?',
            'Pelo menos uma vez por ano.',
            ['Nunca: só treina quem fez o curso.', 'Só uma vez, na largada da regata.', 'A cada cinco anos, junto com a renovação do certificado.'], 2,
            'A OSR 6.04 exige a prática anual, por toda a tripulação. Ela não se restringe a quem fez o curso, nem só à largada ou ao ciclo de cinco anos do certificado.',
            'OSR 6.04; fato radio-79', OSR1),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: seção 6 (treinamento)', url: OSR1, ref: 'radio-71' },
          { txt: 'World Cruising Club: tripulação e treinamento', url: 'https://worldcruising.com/crew', ref: 'loc_regatas-18' },
          { txt: 'NORMAM-211/DPC: programa de Capitão-Amador e Anexo 4-B', url: N211, ref: 'programa-30' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'O curso World Sailing Offshore Personal Survival', minutos: 12,
      objetivos: [
        'Explicar o que é o curso World Sailing Approved Offshore Personal Survival e por que ele resolve a exigência da OSR 6.01.',
        'Descrever os dois dias do curso modelo, a avaliação e a validade do certificado.',
        'Saber que o Brasil não consta da lista da World Sailing e o que fazer a respeito.',
      ],
      blocos: [
        { t: 'p', html: 'A World Sailing não ministra cursos. Ela permite que as <b>federações nacionais</b> (suas MNAs, “Member National Authorities”) aprovem cursos de sobrevivência de acordo com a OSR 6.02. O certificado de um curso aprovado resolve a exigência de treinamento das regatas: o organizador é obrigado a aceitá-lo.' },
        { t: 'fato', ref: 'radio-74', html: 'OSR 6.01.4: salvo disposição em contrário do Aviso de Regata, um certificado válido de curso World Sailing Approved Offshore Personal Survival é aceito como prova de cumprimento da 6.01 nas Categorias 0, 1 e 2.' },
        { t: 'fato', ref: 'extra-radio-2-03', html: 'Pelo Apêndice G das OSR, o status “World Sailing Approved” só pode ser dado a um curso por uma autoridade nacional membro (MNA) da World Sailing, e o curso não precisa seguir o curso modelo do apêndice, desde que entregue o treinamento exigido pela OSR 6.02.' },
        { t: 'fato', ref: 'extra-radio-2-04', html: 'Pelo Apêndice G (item 6.5), salvo disposição em contrário do Aviso de Regata, não é obrigatório que o curso seja “World Sailing Approved” para cumprir a OSR 6.01 e 6.02, embora o status seja incentivado.' },
        { t: 'p', html: 'Traduzindo: o selo “aprovado” é o caminho sem discussão, e outros cursos podem ser aceitos se o aviso de regata permitir. Se você pretende correr, leia o aviso de regata <b>antes</b> de pagar qualquer curso.' },
        { t: 'h', txt: 'O curso modelo: dois dias' },
        { t: 'fato', ref: 'radio-78', html: 'O curso modelo tem dois dias de 8 horas, e a reciclagem para certificados vencidos tem cerca de 8 horas, com treino na água e prova escrita.' },
        { t: 'fato', ref: 'extra-radio-2-07', html: 'No cronograma modelo, o dia 1 é de teoria, em dez sessões (assistência a outras embarcações, cuidado do equipamento, homem ao mar, hipotermia, saúde da tripulação, meteorologia, mau tempo, velas de tempestade, controle de avarias, busca e salvamento), e o dia 2 é de prática, com 4 horas de teoria e 4 de prática.' },
        { t: 'figura', svg: S('m7f2', 'Dois dias do curso modelo de sobrevivência offshore: dia 1 teoria em sala e dia 2 prática com equipamento', '0 0 420 460',
          '<rect x="8" y="8" width="404" height="256" rx="12" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="24" y="36" font-size="17" font-weight="700" fill="currentColor">Dia 1: sala de aula</text>' +
          ['Assistência a outras embarcações', 'Cuidado do equipamento de segurança', 'Homem ao mar: prevenir e recuperar', 'Hipotermia, choque frio e afogamento', 'Saúde da tripulação', 'Meteorologia marítima', 'Mau tempo e velas de tempestade', 'Controle de avarias', 'Busca e salvamento', 'Exercícios de caso e prova do dia'].map(function (t, i) {
            return '<text x="42" y="' + (60 + i * 19) + '" font-size="14" fill="currentColor">' + t + '</text><circle cx="30" cy="' + (55 + i * 19) + '" r="3" fill="var(--magenta)"/>';
          }).join('') +
          '<rect x="8" y="276" width="404" height="176" rx="12" fill="var(--sea-2)" stroke="var(--magenta)" stroke-width="2"/>' +
          '<text x="24" y="304" font-size="17" font-weight="700" fill="currentColor">Dia 2: prática (e um pouco de teoria)</text>' +
          ['Cuidado do equipamento, na prática', 'Equipamento pessoal: colete e arnês', 'Balsa salva-vidas e abandono do barco', 'Incêndio e extintores', 'Comunicações de emergência', 'Pirotécnicos e sinais', 'Lições aprendidas e prova final'].map(function (t, i) {
            return '<text x="42" y="' + (328 + i * 18) + '" font-size="14" fill="currentColor">' + t + '</text><circle cx="30" cy="' + (323 + i * 18) + '" r="3" fill="var(--magenta)"/>';
          }).join(''), 440),
          legenda: 'Resumo do cronograma modelo do Apêndice G das OSR. O curso real pode reordenar as sessões; o importante é que cubra os 15 tópicos da OSR 6.02.' },
        { t: 'fato', ref: 'extra-radio-2-06', html: 'O Apêndice G descreve como instalações adequadas ao curso uma piscina de água morna, funda o bastante para todos flutuarem, para treino com coletes e balsas, e um local externo, com segurança, para treino com pirotécnicos e extintores.' },
        { t: 'fato', ref: 'extra-radio-2-05', html: 'No curso modelo, a avaliação de cada dia é um exercício ou prova; uma nota de 70% em cada unidade avaliada, somada à avaliação contínua dos instrutores, dá a avaliação geral.' },
        { t: 'h', txt: 'Validade e reciclagem' },
        { t: 'fato', ref: 'radio-77', html: 'OSR Apêndice G: o certificado “pass” de curso World Sailing Approved Offshore Personal Survival vale 5 anos.' },
        { t: 'fato', ref: 'radio-76', html: 'OSR 6.01.5: o certificado pode ser renovado por curso de reciclagem (refresher) se feito até 2 anos depois do vencimento do certificado anterior.' },
        { t: 'p', html: 'Depois dos dois anos de tolerância, você refaz o curso completo. Marque a data de vencimento no calendário e não deixe a reciclagem para a semana da largada.' },
        { t: 'h', txt: 'E no Brasil?' },
        { t: 'fato', ref: 'radio-85', html: 'Na lista de provedores de cursos Offshore Personal Survival reconhecidos publicada pela World Sailing não há entrada para o Brasil.' },
        { t: 'fato', ref: 'travessia-44', html: 'Em 07/10/2026, a lista de provedores do curso Offshore Personal Survival na página da World Sailing não inclui o Brasil (inclui, por exemplo, Argentina, Portugal e África do Sul).' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Conclusão por ausência', html: 'A ausência do Brasil da lista é o que o app encontrou, e não uma garantia de que não exista curso aprovado. Pergunte à federação de vela do seu estado e à Confederação Brasileira de Vela (CBVela), e leia o aviso de regata para saber o que o organizador aceita. Se não houver curso no Brasil, a opção é fazer o curso no exterior (próxima lição).' },
        { t: 'check', questoes: [
          Q('radio2-m7-l2-q1', 'Sobrevivência: cursos', 2, 'Quem concede o status “World Sailing Approved” a um curso de sobrevivência offshore?',
            'A autoridade nacional membro (MNA) da World Sailing, no país onde o curso é dado.',
            ['A Capitania dos Portos, em qualquer país.', 'A organização de cada regata, caso a caso.', 'O instrutor, depois de passar o aluno.'], 0,
            'O Apêndice G diz que só uma MNA pode conceder o status e retirá-lo. A Capitania não tem papel nisso, o organizador apenas aceita ou não o certificado, e o instrutor ensina, mas não aprova o curso.',
            'OSR, Apêndice G, 6.1.1; fato extra-radio-2-03', OSR1),
          Q('radio2-m7-l2-q2', 'Sobrevivência: cursos', 2, 'Seu certificado de Offshore Personal Survival venceu há um ano e meio. O que a OSR 6.01.5 permite?',
            'Fazer o curso de reciclagem (refresher), porque ainda está dentro de 2 anos do vencimento.',
            ['Nada: é preciso refazer o curso completo.', 'Continuar usando o certificado, porque ele não vence.', 'Fazer só uma prova online no dia da regata.'], 0,
            'A regra aceita reciclagem até 2 anos depois do vencimento; depois disso, é o curso completo. O certificado vale 5 anos, e não indefinidamente, e a prova online no dia da regata não é um mecanismo da OSR.',
            'OSR 6.01.5; fatos radio-76 e radio-77', OSR1),
          Q('radio2-m7-l2-q3', 'Sobrevivência: cursos', 3, 'Por que é importante ler o Aviso de Regata antes de pagar um curso de sobrevivência?',
            'Porque o aviso pode alterar o que é aceito como comprovação, e o organizador decide se cursos sem o selo da World Sailing servem.',
            ['Porque o aviso substitui as OSR em tudo.', 'Porque o aviso fixa o preço do curso.', 'Porque o aviso é o único lugar onde se lista os cursos.'], 0,
            'As OSR 6.01.4 e Apêndice G 6.5 dizem “salvo disposição em contrário do Aviso de Regata”. O aviso não substitui a OSR por inteiro, não fixa preço e não é lista de cursos.',
            'OSR 6.01.4 e Apêndice G 6.5; fatos radio-74 e extra-radio-2-04', OSR1),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: seção 6 e Apêndice G (curso modelo)', url: OSR1, ref: 'radio-74' },
          { txt: 'World Sailing, Offshore Personal Survival: provedores reconhecidos', url: 'https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/', ref: 'radio-85' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'RYA Sea Survival, Offshore Personal Survival e outros cursos no exterior', minutos: 11, intl: true,
      objetivos: [
        'Distinguir o RYA Basic Sea Survival do RYA Offshore Personal Survival e saber qual atende à OSR.',
        'Conhecer a opção da US Sailing, com teoria online e prática presencial.',
        'Comparar as opções e planejar o curso dentro de uma viagem.',
      ],
      blocos: [
        { t: 'p', html: 'Se o Brasil não aparece na lista de cursos aprovados, quem quer correr uma regata oceânica ou participar de um rally tem de fazer o curso no exterior. As três opções mais citadas nas fontes são britânicas e americanas. Elas servem a dois objetivos distintos: aprender sobrevivência (para qualquer pessoa que vá ao mar) e cumprir a exigência formal da OSR (para quem vai de regata).' },
        { t: 'h', txt: 'RYA Basic Sea Survival: um dia, com piscina' },
        { t: 'fato', ref: 'radio-88', html: 'O RYA Basic Sea Survival tem 1 dia, parte em sala e parte em piscina, sem idade mínima, e cobre balsa salva-vidas, técnicas de sobrevivência, coletes, aspectos médicos e busca e salvamento.' },
        { t: 'fato', ref: 'extra-radio-2-02', html: 'O RYA Basic Sea Survival tem uma sessão prática em piscina, em que o aluno tenta entrar numa balsa salva-vidas e ajuda os colegas, vestido com roupa de mau tempo e colete salva-vidas.' },
        { t: 'fato', ref: 'radio-91', html: 'A University of Southampton (Southampton Sport) oferece o RYA Sea Survival em um dia, com datas em 2026 (incluindo 11/10/2026) e preço de £155 (£116,25 para membros).' },
        { t: 'p', html: 'O curso é um bom primeiro passo e relativamente barato. Mas o RYA não anuncia que ele sozinho cumpra a OSR 6.01. Para isso, o curso a procurar é o seguinte.' },
        { t: 'h', txt: 'RYA Offshore Personal Survival (RYA/World Sailing): dois dias' },
        { t: 'fato', ref: 'radio-87', html: 'O RYA Offshore Personal Survival Course (RYA/World Sailing) tem 2 dias, é em sala de aula e seu certificado atende à seção 6.01 para as Categorias 0, 1 e algumas da Categoria 2.' },
        { t: 'fato', ref: 'extra-radio-2-14', html: 'O RYA Offshore Personal Survival Course não exige experiência prévia nem idade mínima, segundo a ficha do curso no RYA.' },
        { t: 'h', txt: 'US Sailing: Safety at Sea' },
        { t: 'fato', ref: 'radio-90', html: 'A US Sailing é sancionada pela World Sailing para emitir certificados Safety at Sea; o certificado International Offshore exige a parte teórica (seminário presencial ou curso online de 15 unidades) mais uma parte prática presencial, e vale 5 anos. A página não deixa explícito que a prática dura um dia: confirme a duração com a US Sailing.' },
        { t: 'p', html: 'A vantagem para quem mora longe é a <b>teoria online</b>, que se faz em casa. Resta a parte prática presencial, que precisa de piscina e de local externo com segurança.' },
        { t: 'tabela', cab: ['Curso', 'Formato', 'Para quê'], linhas: [
          ['RYA Basic Sea Survival', 'Sala e piscina, um dia', 'Aprender a usar balsa, colete e técnicas de sobrevivência; boa base para qualquer navegante'],
          ['RYA Offshore Personal Survival', 'Dois dias', 'Atender à OSR 6.01 nas Categorias 0, 1 e algumas da 2'],
          ['US Sailing Safety at Sea, International Offshore', 'Teoria online (ou presencial) mais um dia de prática (o dia presencial não foi reconfirmado: veja o site)', 'Alternativa para quem prefere fazer a teoria em casa'],
        ], legenda: 'Confirme a aceitação com o organizador da regata: ele decide, em última instância, o que serve.' },
        { t: 'figura', svg: FLUXO('m7f4', 'Como escolher o curso de sobrevivência no exterior: objetivo, aviso de regata, curso e data', [
          ['Defina o objetivo', 'só navegar com segurança, ou correr regata oceânica'],
          ['Leia o aviso de regata', 'o que o organizador aceita como prova'],
          ['Escolha o curso', 'Basic Sea Survival, OPS ou US Sailing'],
          ['Marque a data', 'junte à viagem; anote o vencimento'],
        ], 1), legenda: 'Quatro passos antes de pagar. O passo em destaque é o que evita pagar por um curso que o organizador não aceita.' },
        { t: 'h', txt: 'Como escolher e planejar' },
        { t: 'lista', itens: [
          '<b>Só vou navegar e quero estar seguro:</b> o RYA Basic Sea Survival cobre balsa, coletes e busca e salvamento.',
          '<b>Vou fazer regata de Categoria 0, 1 ou 2:</b> procure um curso Offshore Personal Survival aprovado pela World Sailing. Confira a regra do aviso de regata.',
          '<b>Moro longe:</b> veja se a teoria do curso americano pode ser feita online e junte a prática à viagem.',
          '<b>Quero economizar uma viagem:</b> verifique se o centro oferece outros cursos na mesma semana (por exemplo, rádio ou primeiros socorros).',
        ] },
        { t: 'callout', tipo: 'intl', titulo: 'Verifique a data e o centro', html: 'Preços e datas mudam. Os exemplos desta lição foram consultados em outubro de 2026; confirme no site de cada centro. Antes de pagar, pergunte também se o seu certificado será reconhecido pelo organizador da regata em que você pretende correr.', intl: true },
        { t: 'check', questoes: [
          Q('radio2-m7-l3-q1', 'Sobrevivência: cursos', 2, 'Qual curso britânico do RYA tem certificado que atende à seção 6.01 das OSR para as Categorias 0, 1 e algumas da 2?',
            'RYA Offshore Personal Survival Course (RYA/World Sailing), de dois dias.',
            ['RYA Basic Sea Survival, de um dia.', 'RYA Day Skipper Theory.', 'RYA SRC.'], 0,
            'Segundo o RYA, o certificado do Offshore Personal Survival atende à 6.01. O Basic Sea Survival não é anunciado dessa forma, o Day Skipper Theory é de navegação e o SRC é de rádio.',
            'RYA, Offshore Personal Survival; fato radio-87', 'https://www.rya.org.uk/course-finder/offshore-personal-survival-course-ryaworld-sailing/'),
          Q('radio2-m7-l3-q2', 'Sobrevivência: cursos', 2, 'O que diferencia o curso Safety at Sea da US Sailing para quem mora longe da sede do curso?',
            'A parte teórica pode ser feita online, e fica uma parte prática presencial (a duração dela não foi reconfirmada).',
            ['O curso é inteiramente online, inclusive a prática.', 'Só é aceito na regata Bermuda Race.', 'O certificado vale 20 anos.'], 3,
            'A fonte fala em teoria presencial ou online de 15 unidades, mais um dia prático presencial (este último não foi reconfirmado na última verificação). O curso não é só online, não depende de uma regata específica e o certificado vale 5 anos.',
            'US Sailing, Safety at Sea; fato radio-90', 'https://www.ussailing.org/education/adult/safety-at-sea-courses/'),
          Q('radio2-m7-l3-q3', 'Sobrevivência: cursos', 2, 'Para quem só quer aprender a usar balsa e colete, sem planos de regata, qual curso é o mais adequado?',
            'RYA Basic Sea Survival, de um dia, com sessão prática em piscina.',
            ['Curso de dois dias da World Sailing, obrigatoriamente.', 'RYA Yachtmaster Ocean.', 'Nenhum curso: basta ler o manual da balsa.'], 0,
            'O Basic Sea Survival cobre balsa, colete e técnicas de sobrevivência com prática em piscina. O OPS é para quem precisa cumprir a OSR. Yachtmaster Ocean é navegação, e o manual da balsa não substitui o treino.',
            'RYA, Basic Sea Survival; fatos radio-88 e extra-radio-2-02', 'https://www.rya.org.uk/course-finder/basic-sea-survival-certificate/'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RYA, Basic Sea Survival Certificate', url: 'https://www.rya.org.uk/course-finder/basic-sea-survival-certificate/', ref: 'radio-88' },
          { txt: 'RYA, Offshore Personal Survival Course (RYA/World Sailing)', url: 'https://www.rya.org.uk/course-finder/offshore-personal-survival-course-ryaworld-sailing/', ref: 'radio-87' },
          { txt: 'US Sailing, Safety at Sea', url: 'https://www.ussailing.org/education/adult/safety-at-sea-courses/', ref: 'radio-90' },
          { txt: 'University of Southampton: RYA Sea Survival', url: 'https://www.southampton.ac.uk/sport/watersports-courses/theory/rya-sea-survival', ref: 'radio-91' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Cursos STCW no Brasil: o que servem para a sobrevivência', minutos: 11,
      objetivos: [
        'Dizer o que os cursos CBSN e CBSP da DPC ensinam de sobrevivência.',
        'Explicar por que a World Sailing não aceita curso STCW de sobrevivência no lugar do Offshore Personal Survival.',
        'Montar uma sequência realista de preparo para quem mora no Brasil.',
      ],
      blocos: [
        { t: 'p', html: 'No Brasil, o caminho mais próximo de um curso de sobrevivência é o dos cursos da Diretoria de Portos e Costas (DPC) para marítimos, trabalhadores offshore e passageiros de navio. Eles seguem o Código STCW, a norma internacional de treinamento de marítimos. Vale a pena fazê-los, mas é preciso saber o que cumprem e o que não cumprem.' },
        { t: 'h', txt: 'O que o CBSN e o CBSP ensinam' },
        { t: 'fato', ref: 'radio-58', html: 'O CBSN tem 34 horas, é para aluno não tripulante e segue a Regra V/2 e as Tabelas A-VI/1-1 a A-VI/1-4 do Código STCW, que incluem primeiros socorros elementares; o certificado vale 5 anos.' },
        { t: 'fato', ref: 'extra-radio-2-11', html: 'No currículo do CBSN, a sobrevivência pessoal tem 8 horas, os primeiros socorros elementares 4 horas e a prevenção e combate a incêndio 8 horas; a aprovação exige nota mínima 6,0 na prova teórica, conceito satisfatório nas práticas e 90% de frequência.' },
        { t: 'fato', ref: 'extra-radio-2-17', html: 'O CBSP tem 5 dias e 40 horas, exige ter mais de 18 anos no dia da matrícula, ensino fundamental concluído e boa saúde, e inclui primeiros socorros elementares (6 h) e técnicas de sobrevivência pessoal (9 h).' },
        { t: 'fato', ref: 'extra-radio-2-16', html: 'Os cursos CBSN e CBSP têm aulas teóricas e participações práticas em sobrevivência, primeiros socorros e combate a incêndio, em locais apropriados, com equipamento de proteção para cada aluno, instrutores capacitados e apoio de socorro.' },
        { t: 'p', html: 'Em outras palavras: você pratica técnicas de sobrevivência pessoal (as tabelas A-VI/1-1 do Código STCW incluem colete e embarcações de sobrevivência), combate a incêndio e primeiros socorros elementares. O cenário, porém, é o do navio ou da plataforma, e não o de um veleiro de cruzeiro em alto-mar.' },
        { t: 'callout', tipo: 'nota', titulo: 'E o curso “CESS”?', html: 'A lista de cursos da DPC cita também o Curso de Embarcações de Sobrevivência e Salvamento (CESS). Este app não conseguiu confirmar o conteúdo e a acessibilidade a amadores. Se for do seu interesse, pergunte a uma escola credenciada.' },
        { t: 'h', txt: 'O limite: o que a World Sailing diz' },
        { t: 'fato', ref: 'radio-84', html: 'A World Sailing recomenda não aceitar cursos STCW de sobrevivência no mar como alternativa ao Offshore Personal Survival, por não cobrirem itens de vela e equipamentos de recreio; cursos STCW de primeiros socorros são aceitos.' },
        { t: 'p', html: 'Isso significa que, para regatas que exigem o certificado de sobrevivência da World Sailing, o CBSN ou o CBSP <b>não substituem</b> o curso Offshore Personal Survival. A razão é de conteúdo: o curso para velejadores trata de itens de vela e de equipamentos de recreio (como velas de tempestade e recuperação de homem ao mar em veleiro, que constam dos tópicos da OSR 6.02), que o curso de navio não cobre. Já o primeiro socorros do CBSN pode servir à exigência médica (A-VI/1-3), se o organizador aceitar.' },
        { t: 'tabela', cab: ['Exigência', 'CBSN ou CBSP resolve?', 'Observação'], linhas: [
          ['Treinamento de sobrevivência da OSR 6.01/6.02', 'Não, segundo a recomendação da World Sailing', 'Procure o Offshore Personal Survival'],
          ['Primeiros socorros da OSR 6.05.2 (Categoria 1)', 'Sim, se o organizador aceitar STCW A-VI/1-3', 'Confirme por escrito'],
          ['Aprender de verdade colete, balsa e fogo', 'Sim, como base prática', 'Complete com a prática no seu barco'],
        ], legenda: 'Leitura dos fatos radio-82 e radio-84. A decisão final é sempre do organizador da regata.' },
        { t: 'h', txt: 'Uma sequência realista para quem mora no Brasil' },
        { t: 'figura', svg: FLUXO('m7f3', 'Sequência de preparo em sobrevivência para quem mora no Brasil: curso STCW, prática no seu barco, curso World Sailing se for regata, treino anual', [
          ['Curso STCW (CBSN ou CBSP)', 'colete, fogo e primeiros socorros, com certificado'],
          ['Prática no seu barco', 'balsa, homem ao mar e pirotécnicos com a tripulação'],
          ['Offshore Personal Survival', 'só se for correr regata de Cat. 0, 1 ou 2'],
          ['Treino anual', 'homem ao mar e abandono, todo ano'],
        ], 2), legenda: 'Sugestão de sequência. O passo em destaque só se aplica a quem pretende correr regata oceânica.' },
        { t: 'fato', ref: 'radio-59', html: 'A lista da DPC de instituições credenciadas (atualizada em 30/09/2026) traz CROG em Rio de Janeiro e Macaé (Instituto de Ciências Náuticas, RelyOn Nutec, West Group) e CBSN/CBSP no Nordeste (Recife, Salvador, Aracaju, Fortaleza; CBSP também em Guamaré e Mossoró-RN).' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Pergunte à escola', html: 'As sinopses pedem idade, escolaridade e saúde, mas os cursos foram desenhados para o marítimo e o trabalhador offshore. Pergunte se a escola aceita velejador amador e como emite o certificado.' },
        { t: 'check', questoes: [
          Q('radio2-m7-l4-q1', 'Sobrevivência: cursos', 2, 'Por que a World Sailing recomenda não aceitar um curso STCW de sobrevivência no mar no lugar do Offshore Personal Survival?',
            'Porque os cursos STCW não cobrem itens específicos de vela e de equipamentos de recreio.',
            ['Porque os cursos STCW são reconhecidos apenas no Brasil.', 'Porque os cursos STCW só podem ser feitos por marítimos profissionais.', 'Porque a World Sailing só aceita cursos online.'], 0,
            'A orientação da World Sailing aponta a falta de conteúdo de vela e de equipamentos de recreio. A razão não é o reconhecimento do certificado, nem quem pode se matricular, nem o formato do curso.',
            'World Sailing, Offshore Personal Survival; fato radio-84', 'https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/'),
          Q('radio2-m7-l4-q2', 'Sobrevivência: cursos', 2, 'O CBSN pode ajudar a cumprir qual parte das exigências da OSR?',
            'A de primeiros socorros (STCW A-VI/1-3), desde que o organizador da regata aceite.',
            ['A de sobrevivência da 6.01, automaticamente.', 'A de rádio da Categoria 0.', 'Nenhuma, pois não é curso marítimo.'], 0,
            'A OSR 6.05.2 aceita STCW A-VI/1-3 ou superior para primeiros socorros, e o CBSN segue essas tabelas. A World Sailing não recomenda STCW de sobrevivência para a 6.01, o CBSN não é curso de rádio, e ele é, sim, marítimo.',
            'OSR 6.05.2; fatos radio-82, radio-58 e radio-84', OSR1),
          Q('radio2-m7-l4-q3', 'Sobrevivência: cursos', 1, 'Antes de se matricular num curso da DPC como velejador amador, o que se recomenda?',
            'Perguntar à escola credenciada se aceita velejador amador e como emite o certificado.',
            ['Nada: todos os cursos da DPC aceitam qualquer pessoa.', 'Procurar um curso sem credenciamento, que é mais barato.', 'Esperar um curso específico para velejadores amadores.'], 1,
            'As sinopses pedem idade, escolaridade e saúde, mas foram escritas para o marítimo. Quem confirma a aceitação do amador é a escola. Curso sem credenciamento não emite o certificado da DPC, e esperar um curso exclusivo para amadores atrasa o preparo.',
            'DPC, Sinopses do CBSN, CBSP e CPSO; fatos radio-55, extra-radio-2-17 e radio-58', 'https://www.marinha.mil.br/dpc/offshore-cursos'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'DPC, Sinopses do CBSN e CBSP', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_20.pdf', ref: 'radio-58' },
          { txt: 'World Sailing, Offshore Personal Survival: cursos STCW', url: 'https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/', ref: 'radio-84' },
          { txt: 'IMO, Convenção e Código STCW (Tabela A-VI/1-1, técnicas de sobrevivência pessoal)', url: 'https://www.imo.org/en/OurWork/HumanElement/Pages/STCW-Convention.aspx' },
          { txt: 'DPC, Instituições credenciadas', url: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Instituicoes_credenciadas_para_ministrar_Cursos_e_Treinamento_na_Modalidade_Presencial.pdf', ref: 'radio-59' },
        ] },
      ],
    },
    {
      id: 'l5', titulo: 'O que se pratica num curso de sobrevivência', minutos: 12,
      objetivos: [
        'Descrever os exercícios de um curso prático: balsa, colete, pessoa na água, fogo, pirotécnicos e rádio.',
        'Explicar, em linhas gerais, as fases do corpo na água fria e por que o colete é a primeira defesa.',
        'Preparar-se para o dia do curso e levar o treino para o seu barco.',
      ],
      blocos: [
        { t: 'p', html: 'A diferença entre sobreviver e não sobreviver costuma estar em detalhes que só a prática ensina: como se sobe numa balsa, como se pede ajuda com a mão tremendo, como se segura um facho. Um bom curso não deixa você só ouvir; ele põe você para fazer. Veja o que costuma entrar, seguindo as sessões do curso modelo da World Sailing.' },
        { t: 'h', txt: 'Balsa salva-vidas, na piscina' },
        { t: 'p', html: 'É a parte de que quase todo aluno mais se lembra. O curso modelo trata de tipos de balsa, normas, bolsa ou casulo, revisão periódica, pacotes de emergência, onde guardá-la, quando lançá-la, estabilidade, embarque, como desvirá-la depois de emborcar e como aumentar as chances de sobrevivência lá dentro.' },
        { t: 'fato', ref: 'extra-radio-2-02', html: 'No RYA Basic Sea Survival, a sessão em piscina faz o aluno experimentar a dificuldade de entrar numa balsa “indócil” e de ajudar os colegas, vestido com roupa de mau tempo e colete salva-vidas.' },
        { t: 'fato', ref: 'extra-radio-2-06', html: 'O curso modelo da World Sailing descreve como instalações adequadas uma piscina de água morna, funda o bastante para todos flutuarem, para treino com coletes e balsas, e um local externo, com segurança, para treino com pirotécnicos e extintores.' },
        { t: 'lista', itens: [
          '<b>Entrar na água vestido</b> com roupa de mau tempo e colete, e perceber o peso e a limitação dos movimentos.',
          '<b>Nadar até a balsa e embarcar.</b> Com roupa de mau tempo e colete, subir numa balsa é bem mais difícil do que parece. Em geral os alunos ajudam uns aos outros.',
          '<b>Desvirar a balsa</b> que emborcou, usando a fita de desvirar.',
          '<b>Organizar a vida dentro da balsa:</b> fechar a porta, tirar a água, sinalizar e dividir tarefas.',
          '<b>Abrir a bolsa de abandono</b> e reconhecer o que há nela.',
        ] },
        { t: 'fato', ref: 'travessia-27', html: 'Nas OSR, cada balsa deve poder ser levada até os guarda-mancebos ou lançada em até 15 segundos.' },
        { t: 'callout', tipo: 'dica', titulo: 'Leve o curso para o seu barco', html: 'Depois do curso, mostre à tripulação o local de estiva da sua balsa e treine a retirada dela do suporte, <b>sem puxar o cabo de disparo</b> (puxá-lo infla a balsa). Em 15 segundos, ninguém tem tempo de descobrir onde está a balsa.' },
        { t: 'h', txt: 'Colete, arnês e pessoa na água' },
        { t: 'p', html: 'O curso modelo trata do desempenho e das classificações de colete, dos prós e contras dos sistemas de inflação, da manutenção do colete inflável, do uso do arnês, dos tirantes e das linhas de vida, e dos sinais pessoais. A segunda parte vem da recuperação de um homem ao mar, com os desafios de resgate, o que a pessoa na água pode fazer, as manobras de retorno, o perigo de a embarcação chegar perto demais, o uso de alarmes pessoais e o içamento a bordo.' },
        { t: 'widget', w: 'manobras', opts: { manobra: 'mob', variante: 'parada-rapida', seletor: true }, legenda: 'Simulação de homem ao mar passo a passo (parada rápida e manobra do oito). O treino real é com o seu barco, a sua tripulação e um instrutor.' },
        { t: 'termos', ids: ['choque-termico', 'hipotermia', 'colete-salva-vidas', 'arnes'] },
        { t: 'h', txt: 'O corpo na água fria' },
        { t: 'p', html: 'O curso modelo dedica uma sessão inteira a hipotermia, choque pelo frio e afogamento: como o corpo regula a temperatura, as causas da hipotermia, as <b>fases da imersão em água fria</b> e como se avalia e se trata a pessoa resgatada. Em linhas gerais, o corpo reage em etapas.' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Choque pelo frio:</b> nos primeiros momentos, a respiração dispara de forma involuntária e a pessoa pode engolir água. O colete mantém a boca fora d’água enquanto isso passa.',
          '<b>Perda de força e de coordenação:</b> em alguns minutos, as mãos e os braços perdem a firmeza. É por isso que se faz o que é essencial (engatar, agarrar, sinalizar) logo, e não depois.',
          '<b>Hipotermia:</b> a temperatura do corpo cai aos poucos, em prazo maior que o das etapas anteriores.',
        ] },
        { t: 'callout', tipo: 'nota', titulo: 'Sobre a regra do “1-10-1”', html: 'Há um mnemônico popular, o “1-10-1”, que associa 1 minuto ao choque, 10 minutos à perda de força e 1 hora à hipotermia. Os próprios especialistas ressaltam que os tempos variam muito com a temperatura da água, a roupa e a pessoa. Use o mnemônico para lembrar a <b>ordem</b> das fases, e não como cronômetro.' },
        { t: 'fato', ref: 'extra-arrais-1-34', html: 'O Anexo 4-B da NORMAM-211 recomenda que o amador e os passageiros saibam flutuar na água sem ajuda de flutuantes, para reduzir o risco de afogamento.' },
        { t: 'h', txt: 'Fogo e pirotécnicos, ao ar livre' },
        { t: 'p', html: 'Fogo e sinais pirotécnicos não são treináveis dentro de uma sala. O curso modelo trata das causas comuns de incêndio a bordo, das classes de fogo, da prevenção, do fogão a gás (GLP) e a álcool, dos tipos de extintor e das técnicas de combate, e, em outra sessão, dos sinais sonoros, luzes, sinais visuais e do disparo seguro de pirotécnicos.' },
        { t: 'fato', ref: 'tecnico-86', html: 'Pelo Anexo IV do RIPEAM, são sinais de perigo o foguete com paraquedas ou a tocha manual de luz encarnada, a fumaça laranja e o movimento lento dos braços estendidos para cima e para baixo.' },
        { t: 'fato', ref: 'tecnico-89', html: 'Pelo Anexo IV, item 2, é proibido usar os sinais de perigo (ou sinais confundíveis com eles) fora de situação de perigo.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Nunca teste um sinal de perigo “para ver se funciona”', html: 'Disparar um foguete ou um facho fora de uma emergência é proibido pelo RIPEAM e gera falso alarme de socorro. O treino é feito no curso, em local preparado e com instrutor. Pergunte ao instrutor o que fazer com os pirotécnicos vencidos do seu barco.' },
        { t: 'h', txt: 'Comunicações de emergência' },
        { t: 'p', html: 'O curso modelo inclui a teoria e a prática de comunicações de emergência: palavras de procedimento, opções de rádio, fazer uma chamada Mayday, VHF e antenas, DSC e AIS, GMDSS, alarmes de homem ao mar, EPIRB, rádio de banda lateral única e sistemas de dados e voz por satélite. Treine a chamada no simulador abaixo. Nunca transmita um Mayday de verdade para treinar: é um alarme de socorro.' },
        { t: 'widget', w: 'vhf-sim', opts: { modo: 'montar', modos: ['explorar', 'montar'], mensagem: 'mayday' }, legenda: 'Monte uma chamada de socorro (MAYDAY) passo a passo. A estação costeira, o barco e os números são fictícios.' },
        { t: 'h', txt: 'Como se preparar para o dia do curso' },
        { t: 'lista', itens: [
          '<b>Roupa:</b> a de mau tempo que você usaria no mar, mais traje de banho e toalha.',
          '<b>Saúde:</b> avise o instrutor, antes, de asma, problemas cardíacos, claustrofobia, lesões e remédios de uso contínuo.',
          '<b>Comida e água:</b> o dia é longo e com esforço físico; coma bem e beba água.',
          '<b>Descanso:</b> durma bem na véspera; o frio e o cansaço pioram o desempenho.',
          '<b>Equipamento próprio:</b> se puder, leve o seu colete e o seu arnês, e aproveite para pedir ao instrutor que confira o ajuste.',
          '<b>Anotações:</b> escreva ao final o que você precisa treinar em casa.',
        ] },
        { t: 'check', questoes: [
          Q('radio2-m7-l5-q1', 'Sobrevivência: cursos', 2, 'Segundo o curso modelo da World Sailing, quais são as instalações adequadas ao treino prático de um curso de sobrevivência?',
            'Uma piscina funda, de água morna, para coletes e balsas, e um local externo seguro para pirotécnicos e extintores.',
            ['Apenas uma sala de aula com projetor.', 'Qualquer praia, desde que haja vento forte.', 'Um barco em alto-mar, a mais de 50 milhas da costa.'], 0,
            'O Apêndice G descreve piscina e local externo seguro para as práticas. A sala é só para a teoria, e uma praia com vento forte ou o mar aberto não são ambientes controlados para o treino.',
            'OSR, Apêndice G, Parte A; fato extra-radio-2-06', OSR1),
          Q('radio2-m7-l5-q2', 'Sobrevivência: cursos', 2, 'Em que ordem o corpo costuma reagir ao cair em água fria?',
            'Primeiro o choque pelo frio, depois a perda de força e coordenação, e só mais tarde a hipotermia.',
            ['Primeiro a hipotermia, depois o choque.', 'Só há hipotermia; o choque é um mito.', 'Tudo ao mesmo tempo, sem ordem.'], 0,
            'As fases da imersão em água fria seguem essa ordem, e é por isso que o colete (que protege a respiração nos primeiros momentos) é a primeira defesa. Hipotermia vem depois, e o choque pelo frio é real.',
            'OSR, Apêndice G, Sessão 6; glossário (choque térmico)', OSR1),
          Q('radio2-m7-l5-q3', 'Sobrevivência: cursos', 1, 'Por que não se deve disparar um foguete de sinalização “só para testar” no mar?',
            'Porque o RIPEAM proíbe usar sinais de perigo fora de uma situação de perigo, e isso gera falso alarme.',
            ['Porque o foguete só funciona uma vez.', 'Porque a Marinha exige uma autorização escrita para cada disparo.', 'Porque a luz do foguete atrapalha a visão noturna da tripulação.'], 0,
            'O Anexo IV, item 2, do RIPEAM proíbe usar sinais de perigo fora do perigo. A razão não é o número de usos, nem uma autorização específica, nem a visão noturna.',
            'RIPEAM, Anexo IV, item 2; fato tecnico-89', 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: Apêndice G (sessões 2, 4, 5, 6, 13, 14 e 15)', url: OSR1, ref: 'extra-radio-2-06' },
          { txt: 'RYA, Basic Sea Survival Certificate', url: 'https://www.rya.org.uk/course-finder/basic-sea-survival-certificate/', ref: 'extra-radio-2-02' },
          { txt: 'RIPEAM-72, Regra 37 e Anexo IV (sinais de perigo)', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf', ref: 'tecnico-86' },
          { txt: 'Cold Water Safety: o mito do 1-10-1 (visão crítica dos tempos)', url: 'https://www.coldwatersafety.org/1-10-1-myth' },
        ] },
      ],
    },
/*__M7_FIM__*/
  ],
});
/* ================= m8: Certificados internacionais úteis (trilha internacional) ================= */
M.push({
  id: 'm8', titulo: 'Certificados internacionais úteis', intl: true,
  resumo: 'Os certificados que valem a pena para quem quer fretar um barco no exterior ou cruzar o Atlântico: RYA (SRC, LRC, First Aid, Yachtmaster), o ICC e as certificações da ASA, e quando cada um compensa o custo.',
  licoes: [
    {
      id: 'l1', titulo: 'O mapa dos certificados: CHA, RYA, ICC e ASA', minutos: 12,
      objetivos: [
        'Distinguir habilitação oficial, certificado de escola e documento internacional (ICC).',
        'Dizer o que o Brasil aceita de habilitação estrangeira e o que ele não faz por equivalência.',
        'Entender por que o ICC não é uma “carteira internacional” automática.',
      ],
      blocos: [
        { t: 'p', html: 'A palavra “certificado” mistura coisas muito diferentes. Algumas dão o <b>direito legal</b> de conduzir um barco. Outras só provam que você passou por um curso. Algumas são aceitas por um país, e outras não. Antes de gastar dinheiro com qualquer uma, é preciso saber o que cada sigla é e quem a aceita.' },
        { t: 'h', txt: 'No Brasil: a CHA manda' },
        { t: 'fato', ref: 'internacional-101', html: 'Pela NORMAM-211, o Capitão-Amador está apto a conduzir embarcações entre portos nacionais e estrangeiros sem limite de afastamento da costa.' },
        { t: 'fato', ref: 'internacional-102', html: 'Pela NORMAM-211, o Mestre-Amador está apto a conduzir embarcações entre portos nacionais e estrangeiros nos limites da navegação costeira (até 20 MN).' },
        { t: 'fato', ref: 'internacional-99', html: 'A NORMAM-211/DPC aceita, no Brasil, habilitações de amador estrangeiras emitidas exclusivamente por Autoridades Marítimas estrangeiras, com campos em português, espanhol ou inglês.' },
        { t: 'fato', ref: 'internacional-100', html: 'A NORMAM-211/DPC proíbe conceder a CHA por equivalência a qualquer habilitação estrangeira: quem quiser se habilitar no Brasil começa pelo Arrais-Amador.' },
        { t: 'p', html: 'Ou seja: um certificado de escola, como o RYA Day Skipper, <b>não vira CHA</b>. E ele sozinho não é a habilitação que o Brasil exige de quem conduz.' },
        { t: 'h', txt: 'Fora do Brasil: cada país decide' },
        { t: 'tabela', cab: ['Sigla', 'Quem emite', 'O que é'], linhas: [
          ['CHA', 'Marinha do Brasil', 'Habilitação oficial de amador (Arrais, Mestre, Capitão)'],
          ['RYA', 'Royal Yachting Association (Reino Unido)', 'Entidade de vela que emite certificados de curso e de competência (como o Yachtmaster)'],
          ['ICC', 'RYA, em nome do governo britânico', 'Documento de competência para conduzir embarcação de recreio no exterior'],
          ['ASA', 'American Sailing Association (EUA)', 'Série de certificações de vela, com provas teórica e prática'],
          ['SRC e LRC', 'RYA e autoridade britânica', 'Certificados de operador de rádio (curto e longo alcance)'],
        ], legenda: 'Resumo: veja as lições seguintes para cada um.' },
        { t: 'fato', ref: 'internacional-65', html: 'O ICC (International Certificate for Operators of Pleasure Craft) emitido pelo RYA é emitido em nome do Governo do Reino Unido, sob autorização da MCA, em conformidade com a Resolução nº 40 da UNECE.' },
        { t: 'fato', ref: 'internacional-66', html: 'O ICC serve como prova de competência quando solicitada por autoridades de um país visitado (país do qual o titular não é cidadão nem residente).' },
        { t: 'fato', ref: 'internacional-92', html: 'A validade do ICC é determinada pelo país visitado; não é uma qualificação verdadeiramente internacional nem equivale à carteira de motorista da UE.' },
        { t: 'fato', ref: 'internacional-95', html: 'O ICC não pode ser endossado comercialmente e não serve como prova de competência para atividades comerciais.' },
        { t: 'fato', ref: 'internacional-124', html: 'A certificação ASA vale por toda a vida a partir da assinatura do instrutor no logbook.' },
        { t: 'figura', svg: S('m8f1', 'Três camadas de documentos de habilitação: a habilitação legal do seu país, o certificado de competência de uma entidade e o documento de reconhecimento para viajar', '0 0 420 270',
          '<rect x="10" y="8" width="400" height="74" rx="12" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="26" y="36" font-size="16" font-weight="700" fill="currentColor">1. Habilitação legal</text>' +
          '<text x="26" y="60" font-size="14" fill="currentColor">CHA no Brasil: dá o direito de conduzir aqui</text>' +
          '<rect x="10" y="98" width="400" height="74" rx="12" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="26" y="126" font-size="16" font-weight="700" fill="currentColor">2. Certificado de competência ou curso</text>' +
          '<text x="26" y="150" font-size="14" fill="currentColor">RYA Day Skipper, Yachtmaster; ASA 101 a 108</text>' +
          '<rect x="10" y="188" width="400" height="74" rx="12" fill="var(--sea-3)" stroke="var(--magenta)" stroke-width="2"/>' +
          '<text x="26" y="216" font-size="16" font-weight="700" fill="currentColor">3. Documento de reconhecimento</text>' +
          '<text x="26" y="240" font-size="14" fill="currentColor">ICC ou IPC: o país visitado decide se aceita</text>' +
          '<path d="M210 82 L210 98 M204 92 L210 98 L216 92" stroke="var(--magenta)" stroke-width="2.5" fill="none"/>' +
          '<path d="M210 172 L210 188 M204 182 L210 188 L216 182" stroke="var(--magenta)" stroke-width="2.5" fill="none"/>', 440),
          legenda: 'As camadas não se substituem. Cada nível serve a um propósito diferente, e quem decide o que vale é a autoridade ou a empresa de charter do lugar.' },
        { t: 'h', txt: 'E o aluguel de barcos no Brasil?' },
        { t: 'fato', ref: 'internacional-103', html: 'No Brasil, o aluguel de embarcação de esporte e recreio sem tripulação só é permitido a locatário com habilitação compatível com a área de navegação; estrangeiros não residentes seguem o art. 1.16.' },
        { t: 'callout', tipo: 'nota', titulo: 'A trilha internacional é opcional', html: 'Este módulo existe para quem pretende fretar ou velejar fora do Brasil. Se você pretende velejar só aqui, pode desligar a trilha internacional nas configurações. Os certificados abaixo não são exigidos para a CHA.' },
        { t: 'check', questoes: [
          Q('radio2-m8-l1-q1', 'Certificados internacionais', 2, 'O que a NORMAM-211 faz com um certificado como o RYA Day Skipper?',
            'Não o trata como habilitação: a norma não concede CHA por equivalência a nenhuma habilitação estrangeira.',
            ['Concede a CHA de Mestre-Amador por equivalência.', 'Aceita-o como habilitação, em qualquer águas brasileiras.', 'Obriga a Marinha a registrá-lo na carteira.'], 0,
            'A norma proíbe a CHA por equivalência a qualquer habilitação estrangeira e só aceita habilitações emitidas por autoridades marítimas estrangeiras. O RYA Day Skipper é um certificado de curso, e não habilitação.',
            'NORMAM-211; fatos internacional-99 e internacional-100', N211),
          Q('radio2-m8-l1-q2', 'Certificados internacionais', 2, 'O que é o ICC?',
            'Um documento emitido pelo RYA em nome do governo britânico, sob a Resolução nº 40 da UNECE, que serve de prova de competência quando um país visitado a pede.',
            ['Uma carteira internacional válida automaticamente em todos os países.', 'A habilitação brasileira reconhecida pela ONU.', 'Um certificado de radioperador de alcance longo.'], 2,
            'O ICC é emitido em nome do Reino Unido, mas sua validade é determinada pelo país visitado, e não vale em todo o mundo. Não é a CHA reconhecida pela ONU, nem tem relação com rádio.',
            'RYA, ICC; fatos internacional-65 e internacional-92', 'https://www.rya.org.uk/our-services/icc/about/'),
          Q('radio2-m8-l1-q3', 'Certificados internacionais', 1, 'Quem determina se um ICC é aceito em determinado país?',
            'O próprio país visitado.',
            ['O RYA, de forma global.', 'A Marinha do Brasil.', 'O fabricante do barco.'], 0,
            'O ICC é aceito conforme o país visitado, que o reconhece ou não. O RYA emite, mas não decide por outros países; a Marinha do Brasil e o fabricante não têm esse papel.',
            'Fato internacional-92', 'https://www.rya.org.uk/our-services/icc/evidence-of-competence/'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: categorias de amador e habilitações estrangeiras', url: N211, ref: 'internacional-99' },
          { txt: 'RYA, ICC: International Certificate of Competence', url: 'https://www.rya.org.uk/our-services/icc/about/', ref: 'internacional-65' },
          { txt: 'ASA, American Sailing: certificações', url: 'https://americansailing.com/learn-to-sail/certifications/', ref: 'internacional-124' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Rádio: RYA SRC e LRC', minutos: 11,
      objetivos: [
        'Explicar o que são o SRC e o LRC do RYA e quando cada um é exigido.',
        'Entender por que o SRC não substitui o certificado de operador da Anatel em barco brasileiro.',
        'Decidir quando vale a pena fazer o SRC.',
      ],
      blocos: [
        { t: 'p', html: 'Já vimos, no início do curso, como funciona o rádio e o certificado brasileiro de operador (Anatel). Esta lição mostra o equivalente britânico, que aparece em exames do RYA e em empresas de charter.' },
        { t: 'h', txt: 'O SRC: rádio VHF e DSC' },
        { t: 'fato', ref: 'radio-60', html: 'O RYA SRC (Short Range Certificate) é o certificado mínimo exigido por lei para operar VHF e VHF/DSC em embarcação de bandeira britânica com rádio fixo ou portátil.' },
        { t: 'fato', ref: 'radio-61', html: 'O curso SRC do RYA tem cerca de 10 horas mais o tempo de exame, pode ser feito online ou em sala (exame em sala), não exige experiência e tem idade mínima de 16 anos.' },
        { t: 'fato', ref: 'radio-62', html: 'O exame SRC tem prova teórica escrita e avaliação prática em VHF, é feito num RYA Recognised Training Centre e a taxa de exame é de £76, paga ao RYA e separada do preço do curso.' },
        { t: 'h', txt: 'O LRC: rádio de longo alcance' },
        { t: 'fato', ref: 'radio-66', html: 'Segundo o RYA, o LRC (Long Range Certificate) é exigido quando a embarcação de recreio tem equipamento MF, HF e/ou satelital; o SRC cobre VHF e VHF/DSC; SRC e LRC não são certificados STCW.' },
        { t: 'fato', ref: 'radio-67', html: 'A MCA (Reino Unido) informa que a AMERC emitiu certificados GMDSS até 21/04/2025 e que, desde 12/05/2025, o aprovado no curso LRC usa o certificado de conclusão para pedir o LRC à MCA pelo formulário MSF 4354.' },
        { t: 'figura', svg: S('m8f2', 'Alcance dos certificados de rádio do RYA: SRC para VHF e VHF/DSC, LRC para MF, HF e satélite', '0 0 420 190',
          '<rect x="10" y="10" width="400" height="76" rx="12" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="26" y="38" font-size="17" font-weight="700" fill="currentColor">SRC: Short Range Certificate</text>' +
          '<text x="26" y="64" font-size="14" fill="currentColor">VHF e VHF com DSC, fixo ou portátil</text>' +
          '<rect x="10" y="100" width="400" height="80" rx="12" fill="var(--sea-3)" stroke="var(--magenta)" stroke-width="2"/>' +
          '<text x="26" y="128" font-size="17" font-weight="700" fill="currentColor">LRC: Long Range Certificate</text>' +
          '<text x="26" y="154" font-size="14" fill="currentColor">MF, HF e comunicação por satélite (inclui o que o SRC cobre)</text>', 440),
          legenda: 'Os dois certificados são britânicos. Cada país tem o seu equivalente: no Brasil, o certificado de operador radiotelefonista da Anatel.' },
        { t: 'h', txt: 'Por que o SRC não vale no seu barco brasileiro' },
        { t: 'fato', ref: 'radio-64', html: 'Segundo o RYA, o SRC segue o procedimento harmonizado da CEPT, mas a “Authority to Operate” britânica restringe a validade do certificado a embarcações do Reino Unido.' },
        { t: 'fato', ref: 'radio-68', html: 'Segundo o RYA, MMSI e indicativo de chamada são específicos do país emissor; no Reino Unido o MMSI sai com a Ship Radio Licence da Ofcom.' },
        { t: 'fato', ref: 'radio-04', html: 'O Ato Anatel nº 3449, de 11/03/2026, define duas categorias de operador radiotelefonista: Operador de Rádio Geral (ORG) e Operador de Rádio Restrito (ORR); o ORR só pode operar estações no território, águas e espaço aéreo nacionais.' },
        { t: 'p', html: 'Em barco brasileiro, o certificado de operador é o da Anatel, o MMSI é brasileiro (começa com 710) e a licença da estação é da Anatel. O SRC é útil como <b>conhecimento</b>, mas a validade legal é britânica.' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Reconhecimento do SRC pelo Brasil', html: 'O regulamento da Anatel fala em certificado “emitido ou reconhecido” pela Anatel, mas não achamos um procedimento para reconhecer o SRC. Se você precisa de um certificado de VHF para fretar fora do Brasil, pergunte à empresa de charter o que ela aceita, de preferência por escrito.' },
        { t: 'h', txt: 'Quando o SRC compensa' },
        { t: 'fato', ref: 'internacional-37', html: 'Para o exame RYA Yachtmaster Offshore são exigidos certificado de rádio GMDSS (por exemplo, o RYA SRC ou superior), certificado de primeiros socorros válido e documento de identidade com foto.' },
        { t: 'fato', ref: 'internacional-114', html: 'Para charter na Croácia, a The Moorings exige que o skipper tenha também licença de rádio VHF.' },
        { t: 'fato', ref: 'internacional-109', html: 'O reconhecimento croata da CHA exige também licença de rádio (nacional ou estrangeira) adequada quando há estação VHF ou GMDSS-VHF a bordo.' },
        { t: 'lista', itens: [
          '<b>Quer fazer o exame Yachtmaster do RYA:</b> o SRC (ou equivalente) é requisito.',
          '<b>Quer fretar na Croácia ou em outro destino que peça licença de rádio:</b> confirme qual certificado a empresa aceita (nacional ou estrangeiro). O certificado brasileiro pode servir, mas pergunte.',
          '<b>Quer só velejar em barco brasileiro:</b> a licença da estação e o certificado de operador da Anatel são o que a regra pede (a exigência do certificado para o VHF de recreio ainda precisa de confirmação da Anatel; veja o módulo 4). O SRC é opcional.',
        ] },
        { t: 'widget', w: 'alfabeto-fonetico', opts: { modo: 'soletrar', modos: ['tabela', 'soletrar'], texto: 'Maresia PQ7310' }, legenda: 'O alfabeto fonético é a base de qualquer chamada de rádio, em qualquer país. Treine soletrando o nome do seu barco.' },
        { t: 'check', questoes: [
          Q('radio2-m8-l2-q1', 'Certificados internacionais', 2, 'Por que o RYA SRC não substitui o certificado de operador da Anatel num barco brasileiro?',
            'Porque a “Authority to Operate” britânica limita a validade do SRC a embarcações do Reino Unido, e o MMSI e o indicativo são do país emissor.',
            ['Porque o SRC só vale em terra.', 'Porque a Anatel só aceita certificados de curso presencial.', 'Porque o SRC foi extinto.'], 0,
            'O RYA explica que o SRC é restrito a embarcações britânicas, e MMSI e indicativo dependem do país. O SRC não vale “só em terra” nem foi extinto, e a questão do curso presencial não é o fundamento.',
            'RYA, licenciamento de eletrônica de bordo; fatos radio-64 e radio-68', 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/'),
          Q('radio2-m8-l2-q2', 'Certificados internacionais', 1, 'Qual certificado do RYA é exigido quando o barco de recreio tem rádio MF, HF ou satélite?',
            'O LRC (Long Range Certificate).',
            ['O SRC (Short Range Certificate).', 'O ICC.', 'O RYA First Aid.'], 1,
            'Segundo o RYA, o LRC cobre MF, HF e satélite, e por isso é a certa. O SRC cobre só o VHF e o VHF com DSC, de modo que não basta para um rádio de longo alcance. O ICC é a carta de condutor de embarcação de recreio, e o RYA First Aid é de primeiros socorros: nenhum dos dois licencia equipamento de rádio.',
            'RYA, licenciamento de eletrônica; fato radio-66', 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/'),
          Q('radio2-m8-l2-q3', 'Certificados internacionais', 2, 'Para o exame RYA Yachtmaster Offshore, qual certificado de rádio é exigido?',
            'Um certificado de rádio compatível com GMDSS, como o RYA SRC ou superior.',
            ['Nenhum: o exame não trata de rádio.', 'Somente o LRC.', 'Apenas o certificado de radioamador.'], 0,
            'O RYA pede certificado de rádio GMDSS, como o SRC. O exame trata de rádio, o LRC não é exigido sozinho, e o radioamador não é certificado marítimo.',
            'RYA, Yachtmaster Offshore; fato internacional-37', 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RYA, curso e exame do Marine Radio SRC', url: 'https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/', ref: 'radio-60' },
          { txt: 'RYA, licenciamento de eletrônica de bordo (SRC, LRC, MMSI)', url: 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/', ref: 'radio-66' },
          { txt: 'MCA, MIN 716(M): mudanças no processo GMDSS', url: 'https://www.gov.uk/government/publications/min-716-mf-changes-to-the-gmdss-process-in-the-uk/min-716-mf-changes-to-the-gmdss-process-in-the-uk', ref: 'radio-67' },
          { txt: 'Anatel, Ato nº 3449/2026: categorias de operador', url: 'https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0', ref: 'radio-04' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'ICC: o documento para fretar na Europa', minutos: 12,
      objetivos: [
        'Explicar o que o ICC comprova, quem pode pedi-lo e como se obtém.',
        'Saber quanto custa, quanto tempo leva e quanto vale.',
        'Distinguir quando o ICC é necessário e quando a CHA brasileira basta.',
      ],
      blocos: [
        { t: 'p', html: 'O ICC é o documento que muitos brasileiros lembram quando pensam em fretar um barco no exterior. Ele é útil em alguns países e dispensável em outros. Antes de pedir, é bom saber quem aceita o quê.' },
        { t: 'h', txt: 'Quem pode obter' },
        { t: 'fato', ref: 'internacional-67', html: 'A Resolução nº 40 recomenda que governos emitam o ICC a seus nacionais ou residentes, ou a nacionais de qualquer país norte-americano ou de país que não seja membro da UNECE, desde que tenham o certificado nacional do governo emissor ou passem em exame.' },
        { t: 'fato', ref: 'internacional-71', html: 'O RYA também emite o ICC a nacionais de países que não aceitaram a Resolução nº 40, porque de outra forma eles poderiam não conseguir obter um ICC.' },
        { t: 'fato', ref: 'internacional-73', html: 'A lista do RYA de países que aceitaram a Resolução nº 40, cujos nacionais só obtêm o ICC do RYA se residirem no Reino Unido, inclui Áustria, Bélgica, Alemanha, Irlanda, Países Baixos, Noruega, Polônia e Suíça, entre outros; o Brasil não consta da lista.' },
        { t: 'fato', ref: 'internacional-68', html: 'Pela Resolução nº 40, o candidato ao ICC deve ter no mínimo 16 anos, ser física e mentalmente apto (visão e audição suficientes) e passar em exame que prove a competência.' },
        { t: 'h', txt: 'Como se obtém' },
        { t: 'fato', ref: 'internacional-75', html: 'O ICC do RYA só é emitido com evidência de uma categoria da Lista A (tipo de embarcação: motor, vela, moto aquática) e uma da Lista B (águas costeiras e/ou interiores).' },
        { t: 'fato', ref: 'internacional-76', html: 'Pela tabela do RYA, o certificado de conclusão do Day Skipper Sail (Practical) valida no ICC as categorias Vela e Águas Costeiras (e Motor até 10 m, para bote de apoio).' },
        { t: 'fato', ref: 'internacional-77', html: 'Um certificado teórico (Day Skipper Shorebased ou superior) só valida a categoria “águas costeiras”; sozinho não basta para o ICC.' },
        { t: 'fato', ref: 'internacional-78', html: 'Em geral, certificados não emitidos pelo RYA (por exemplo, habilitações estrangeiras) não servem como evidência de competência para o ICC do RYA.' },
        { t: 'fato', ref: 'internacional-79', html: 'Quem já tem competência mas não tem certificado aceito pode fazer a avaliação ICC (ICC Assessment) em um centro de teste: centro de treinamento reconhecido pelo RYA ou clube afiliado autorizado.' },
        { t: 'figura', svg: FLUXO('m8f3', 'Caminhos para o ICC do RYA: certificado prático do RYA ou avaliação ICC, pedido online, documentos e envio por correio', [
          ['Evidência de competência', 'RYA Day Skipper Practical ou avaliação ICC'],
          ['Pedido ao RYA', 'online; associar-se ao RYA no pedido'],
          ['Documentos', 'identidade, endereço e tradução, se preciso'],
          ['Processamento', 'o RYA analisa e emite'],
          ['Envio por correio', 'só para o endereço impresso no certificado'],
        ], 0), legenda: 'Etapas do ICC. O primeiro passo costuma ser o que mais exige do candidato.' },
        { t: 'h', txt: 'Quanto custa, quanto leva e quanto vale' },
        { t: 'fato', ref: 'internacional-82', html: 'O ICC emitido pelo RYA vale 5 anos.' },
        { t: 'fato', ref: 'internacional-84', html: 'Para não-membros do RYA, a emissão ou renovação do ICC (válido por 5 anos) custa £75.' },
        { t: 'fato', ref: 'internacional-86', html: 'A emissão do ICC é gratuita para membros do RYA, e é possível associar-se ao RYA no momento do pedido para recebê-lo sem custo.' },
        { t: 'fato', ref: 'internacional-87', html: 'A anuidade de membro adulto do RYA é de £62 (preços válidos até 31/03/2027).' },
        { t: 'fato', ref: 'internacional-88', html: 'O prazo atual de processamento do ICC pelo RYA é de aproximadamente 21 dias úteis a partir do recebimento do pedido.' },
        { t: 'fato', ref: 'internacional-89', html: 'O ICC é enviado pelo correio apenas para o endereço residencial impresso no certificado; não pode ser retirado pessoalmente nem enviado a outro endereço.' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Comprovante de endereço, para quem mora no Brasil', html: 'A tabela do RYA lista, como comprovantes de endereço, a carteira de motorista válida e contas ou extratos emitidos no Reino Unido, nas Ilhas do Canal ou no Espaço Econômico Europeu. Para quem mora no Brasil, o app não achou como comprovar o endereço. Antes de pagar, pergunte ao RYA.' },
        { t: 'h', txt: 'Onde ele é útil e onde a CHA basta' },
        { t: 'fato', ref: 'internacional-93', html: 'Espanha, Grécia e Portugal não adotaram a Resolução nº 40, mas ainda assim costumam pedir o ICC a visitantes.' },
        { t: 'fato', ref: 'internacional-94', html: 'Em termos gerais, o RYA recomenda o ICC para as hidrovias interiores da Europa e para águas interiores e costeiras dos países do Mediterrâneo; nas águas costeiras do norte da Europa geralmente não é exigido.' },
        { t: 'fato', ref: 'internacional-106', html: 'A tabela oficial croata (21/05/2026) reconhece a CHA brasileira Arrais-Amador para barcos e iates de charter sem tripulação até 18 m, em águas interiores e mar territorial croatas.' },
        { t: 'fato', ref: 'internacional-107', html: 'A tabela oficial croata reconhece a CHA Mestre-Amador para iates de charter sem tripulação até 24 m, em viagem internacional no Mar Adriático.' },
        { t: 'fato', ref: 'internacional-108', html: 'A tabela oficial croata reconhece a CHA Capitão-Amador para iates de charter sem tripulação até 24 m, sem restrição de área de navegação.' },
        { t: 'p', html: 'Na Croácia, portanto, quem tem a CHA brasileira pode precisar apenas dela (e da licença de rádio), e não do ICC. Já na Grécia, a lista de aceitos é diferente, como veremos na última lição.' },
        { t: 'check', questoes: [
          Q('radio2-m8-l3-q1', 'Certificados internacionais', 2, 'Que evidência o RYA exige para emitir o ICC?',
            'Evidência de uma categoria de tipo de embarcação (Lista A) e uma de águas (Lista B).',
            ['Somente o passaporte.', 'Uma carta de recomendação de um instrutor.', 'O CPF e o título de eleitor.'], 0,
            'O RYA pede uma categoria da Lista A e uma da Lista B, comprovadas por certificado RYA aceito ou pela avaliação ICC. Passaporte sozinho, carta de instrutor ou CPF e título não bastam.',
            'RYA, ICC; fato internacional-75', 'https://assets.rya.org.uk/assetbank-rya-assets/action/directLinkImage?assetId=51728'),
          Q('radio2-m8-l3-q2', 'Certificados internacionais', 1, 'Por quanto tempo vale o ICC emitido pelo RYA?',
            'Cinco anos.',
            ['Para sempre, como a certificação ASA.', 'Dois anos.', 'Dez anos, como a CHA.'], 0,
            'O ICC do RYA vale 5 anos. A certificação ASA, sim, vale por toda a vida, e a CHA vale 10 anos (5 para maiores de 65), mas isso não tem relação com o ICC.',
            'RYA, ICC; fato internacional-82', 'https://www.rya.org.uk/our-services/icc/about/'),
          Q('radio2-m8-l3-q3', 'Certificados internacionais', 3, 'Segundo a tabela croata de 21/05/2026, para o que vale a CHA brasileira de Mestre-Amador?',
            'Para iates de charter sem tripulação de até 24 m, em viagem internacional no Mar Adriático.',
            ['Para qualquer iate, em qualquer mar.', 'Somente para barcos de até 8 m em águas interiores.', 'Não vale: a Croácia só aceita o ICC.'], 0,
            'A tabela croata reconhece a CHA Mestre-Amador para essa faixa. O reconhecimento irrestrito é do Capitão-Amador, o de até 18 m em águas interiores e mar territorial é do Arrais-Amador, e a Croácia aceita sim a CHA, além do ICC.',
            'Tabela oficial croata; fato internacional-107', 'https://mmpi.gov.hr/UserDocsImages/dokumenti/MORE/More%205_26/TABLICE%20MoU%20HR-EN%2021-5_26/TBL-%20MoU%20ENG%2021-5_26.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RYA, ICC: quem pode obter, categorias, custo e prazo', url: 'https://assets.rya.org.uk/assetbank-rya-assets/action/directLinkImage?assetId=51728', ref: 'internacional-75' },
          { txt: 'UNECE, Resolução nº 40 (ICC)', url: 'https://unece.org/sites/default/files/2026-05/ECE-TRANS-SC3-147r5e_0.pdf', ref: 'internacional-68' },
          { txt: 'Croácia: tabela oficial de reconhecimento de certificados', url: 'https://mmpi.gov.hr/UserDocsImages/dokumenti/MORE/More%205_26/TABLICE%20MoU%20HR-EN%2021-5_26/TBL-%20MoU%20ENG%2021-5_26.pdf', ref: 'internacional-106' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Da escada RYA à ASA: o que cada degrau vale', minutos: 12,
      objetivos: [
        'Situar a escada de certificados do RYA e da ASA em relação à CHA brasileira.',
        'Dizer o que o Yachtmaster Offshore e o Ocean exigem de tempo de mar e de provas.',
        'Entender o que é o IPC da ASA e por que ele existe.',
      ],
      blocos: [
        { t: 'p', html: 'O RYA e a ASA têm escadas de certificados. As escadas são compostas por cursos e, no alto, por exames. Entender cada degrau mostra o que você já tem, o que vale a pena fazer e o que é supérfluo para o seu objetivo.' },
        { t: 'figura', svg: (function () {
          var cols = [
            ['Brasil (Marinha)', ['Arrais-Amador', 'Mestre-Amador', 'Capitão-Amador']],
            ['RYA', ['Competent Crew', 'Day Skipper', 'Coastal Skipper', 'Yachtmaster Offshore', 'Yachtmaster Ocean']],
            ['ASA', ['101, 103, 104', '105 e 106', '107 e 108', 'IPC (charter)']],
          ];
          var out = '';
          cols.forEach(function (c, ci) {
            var x = 10 + ci * 138;
            out += '<text x="' + (x + 62) + '" y="22" font-size="15" font-weight="700" text-anchor="middle" fill="currentColor">' + c[0] + '</text>';
            c[1].forEach(function (t, i) {
              var y = 36 + i * 52;
              out += '<rect x="' + x + '" y="' + y + '" width="124" height="42" rx="8" fill="var(--sea-' + (ci + 1) + ')" stroke="currentColor" stroke-width="1.3"/>' +
                '<text x="' + (x + 62) + '" y="' + (y + 26) + '" font-size="' + (t.length > 16 ? 11.5 : 13) + '" text-anchor="middle" fill="currentColor">' + t + '</text>';
            });
          });
          return S('m8f4', 'Escadas de certificados: Marinha do Brasil, RYA e ASA, lado a lado, sem equivalência entre as colunas', '0 0 424 310', out, 460);
        })(), legenda: 'As colunas não são equivalentes entre si. A Marinha tem habilitação legal; o RYA e a ASA têm certificados de curso e de competência. A ordem vertical mostra apenas a progressão dentro de cada coluna.' },
        { t: 'h', txt: 'RYA: do primeiro curso ao Yachtmaster' },
        { t: 'fato', ref: 'internacional-04', html: 'O RYA Competent Crew dura 5 dias (consecutivos ou em fins de semana) e é o ponto de partida do treinamento RYA para iniciantes absolutos.' },
        { t: 'fato', ref: 'internacional-12', html: 'Ao concluir o Day Skipper Practical, o aluno deve ser capaz de comandar com segurança um veleiro de cruzeiro de 30 a 45 pés e sua tripulação em passeios diurnos em águas conhecidas.' },
        { t: 'fato', ref: 'internacional-14', html: 'Pré-requisitos do RYA Coastal Skipper Practical (vela): 15 dias de mar, 2 dias como skipper, 300 milhas e 8 horas noturnas; idade mínima 17.' },
        { t: 'fato', ref: 'internacional-55', html: 'Diferentemente das outras qualificações do programa de cruzeiro RYA, não há curso formal para se tornar Yachtmaster: é um exame feito após cumprir tempo de mar e pré-requisitos.' },
        { t: 'fato', ref: 'internacional-29', html: 'O RYA Yachtmaster Offshore certifica competência para comandar um barco de cruzeiro em qualquer passagem em que ele fique a no máximo 150 milhas de um porto, de dia ou de noite.' },
        { t: 'fato', ref: 'internacional-30', html: 'Exame Yachtmaster Offshore: 50 dias de mar (em iates de até 500 GT) nos últimos 10 anos.' },
        { t: 'fato', ref: 'internacional-32', html: 'Exame Yachtmaster Offshore: 2.500 milhas navegadas (em iates de até 500 GT).' },
        { t: 'fato', ref: 'internacional-33', html: 'Exame Yachtmaster Offshore: 5 passagens de mais de 60 milhas, incluindo 2 noturnas (overnight) e 2 como skipper.' },
        { t: 'h', txt: 'Yachtmaster Ocean: para quem já cruza oceanos' },
        { t: 'fato', ref: 'internacional-40', html: 'O RYA Yachtmaster Ocean certifica experiência e competência para comandar embarcação de até 200 GT em passagens de qualquer extensão, em qualquer parte do mundo.' },
        { t: 'fato', ref: 'internacional-41', html: 'A passagem qualificante do Yachtmaster Ocean deve ter no mínimo 600 milhas, das quais ao menos 200 a mais de 50 milhas de terra ou de objetos cartografados úteis à navegação.' },
        { t: 'fato', ref: 'internacional-45', html: 'O exame Yachtmaster Ocean é oral e escrito (não há prova prática no mar).' },
        { t: 'fato', ref: 'internacional-47', html: 'Só quem já tem o Yachtmaster Offshore Certificate of Competence pode receber o Yachtmaster Ocean ao passar no exame oral.' },
        { t: 'fato', ref: 'internacional-57', html: 'Taxas de exame RYA em 2026: Yachtmaster Offshore £266, Yachtmaster Coastal £230, Yachtmaster Ocean £199 (sem contar o curso/prep e o barco).' },
        { t: 'p', html: 'Em linguagem simples: o Yachtmaster Ocean do RYA e o Capitão-Amador da Marinha ensinam, em boa parte, os mesmos assuntos (navegação astronômica, meteorologia oceânica, planejamento de passagens). Mas um é certificado privado de competência, e o outro é a habilitação legal no Brasil.' },
        { t: 'h', txt: 'ASA: certificações por toda a vida' },
        { t: 'fato', ref: 'internacional-125', html: 'O ASA 101 (Keelboat Sailing 1) não tem pré-requisitos e é destinado a iniciantes absolutos.' },
        { t: 'fato', ref: 'internacional-133', html: 'O ASA 104 (Bareboat Cruising) certifica comandar veleiro de cerca de 30 a 45 pés em cruzeiro de vários dias em águas interiores ou costeiras, com vento moderado a forte (até 30 nós).' },
        { t: 'fato', ref: 'internacional-141', html: 'Entre as habilidades do ASA 108 está atuar como skipper e tripulante numa passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra.' },
        { t: 'fato', ref: 'internacional-147', html: 'Para obter o IPC (International Proficiency Certificate) da ASA, é preciso ter no mínimo as certificações ASA 101, 103 e 104.' },
        { t: 'fato', ref: 'internacional-148', html: 'O IPC foi criado para empresas de charter no Mediterrâneo como prova de competência bareboat, principalmente em países que não aceitam o ICC da UNECE; o cartão traz endosso de VHF da ASA.' },
        { t: 'fato', ref: 'internacional-149', html: 'O diretório de escolas da ASA (consultado em 2026-10-07) informa 356 escolas no mundo, distribuídas em 27 países e territórios (210 nos EUA); o Brasil não aparece na lista de países.' },
        { t: 'fato', ref: 'internacional-122', html: 'Atenção ao endereço: em 07/10/2026, o domínio asa.com servia o site de uma instituição financeira, e não a American Sailing Association. O site de vela da ASA é americansailing.com.' },
        { t: 'check', questoes: [
          Q('radio2-m8-l4-q1', 'Certificados internacionais', 2, 'Como se obtém o RYA Yachtmaster Offshore?',
            'Por exame prático, feito após cumprir os pré-requisitos de tempo de mar e milhas; não existe um curso formal obrigatório.',
            ['Só concluindo o Yachtmaster Ocean antes.', 'Por um curso de teoria de 40 horas, sem exame.', 'Por reconhecimento automático da CHA de Capitão.'], 0,
            'O RYA diz que não há curso formal para tornar-se Yachtmaster; é um exame depois de cumprir os pré-requisitos. O Ocean vem depois do Offshore, e não antes; a CHA não é reconhecida automaticamente.',
            'RYA, Yachtmaster; fato internacional-55', 'https://www.rya.org.uk/training/certificates-of-competence/what-is-an-rya-yachtmaster'),
          Q('radio2-m8-l4-q2', 'Certificados internacionais', 2, 'Como é o exame do RYA Yachtmaster Ocean?',
            'Oral e escrito, sem prova prática no mar, e só quem já tem o Yachtmaster Offshore pode recebê-lo.',
            ['Uma travessia de 600 milhas com examinador a bordo.', 'Apenas um questionário online de 20 questões.', 'Uma prova prática em porto, de duas horas.'], 0,
            'O Ocean é oral e escrito, e a experiência de passagem (mínimo de 600 milhas) é comprovada à parte. Não envolve examinador a bordo em travessia, prova online simples nem prova prática em porto.',
            'RYA, Yachtmaster Ocean; fatos internacional-45 e internacional-47', 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/'),
          Q('radio2-m8-l4-q3', 'Certificados internacionais', 2, 'Para que serve o IPC da ASA?',
            'Para provar competência de charter sem tripulação (bareboat) a empresas do Mediterrâneo, sobretudo onde o ICC não é aceito.',
            ['Para habilitar a conduzir barcos no Brasil.', 'Para comprovar a conclusão do Yachtmaster Ocean.', 'Para substituir o certificado de rádio da Anatel.'], 0,
            'O IPC foi criado para charter no Mediterrâneo e exige ASA 101, 103 e 104. Não habilita a conduzir no Brasil, não tem relação com o Yachtmaster nem substitui o certificado de rádio.',
            'ASA, IPC; fatos internacional-147 e internacional-148', 'https://americansailing.com/international-proficiency-certificate/'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RYA, cursos e exames de cruzeiro (Competent Crew a Yachtmaster Ocean)', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/', ref: 'internacional-40' },
          { txt: 'American Sailing Association: padrões de certificação ASA 101 a 108 e IPC', url: 'https://americansailing.com/international-proficiency-certificate/', ref: 'internacional-147' },
        ] },
      ],
    },
    {
      id: 'l5', titulo: 'Quando vale a pena? Fretar no exterior e atravessar o Atlântico', minutos: 12,
      objetivos: [
        'Decidir, para cada objetivo, quais certificados valem o custo e quais são supérfluos.',
        'Conhecer o que a Croácia, a Grécia e os rallies pedem.',
        'Montar um plano de certificados com ordem de prioridade e orçamento.',
      ],
      blocos: [
        { t: 'p', html: 'Certificado é custo: dinheiro, tempo e às vezes uma viagem. A pergunta certa não é “qual o melhor certificado?”, e sim <b>“alguém com autoridade vai me pedir isto?”</b>. Veja os cenários mais comuns.' },
        { t: 'h', txt: 'Cenário A: fretar um veleiro no Mediterrâneo' },
        { t: 'fato', ref: 'internacional-104', html: 'Na Croácia, toda pessoa que conduz barco ou iate de bandeira estrangeira em águas territoriais croatas deve ter certificado que a autorize a conduzi-lo.' },
        { t: 'fato', ref: 'internacional-113', html: 'A The Moorings informa que bases na Croácia não podem aprovar licenças: vale a lista oficial do Ministério croata; se a licença não está listada, não é aceita.' },
        { t: 'fato', ref: 'internacional-115', html: 'Para a Grécia, a The Moorings lista como aceitos ICC, IPC (ASA), NauticEd SLC e licenças nacionais de Reino Unido, EUA, Alemanha, Bélgica e França; a lista não menciona o Brasil e diz que o Day Skipper não é aceito na Grécia.' },
        { t: 'fato', ref: 'internacional-120', html: 'Segundo a agência Filovent (página atualizada em 18/05/2026), na Grécia são aceitos diretamente ICC, RYA Coastal Skipper Practical (ou superior) e ASA 104; o Day Skipper deixou de ser aceito em março de 2019.' },
        { t: 'fato', ref: 'internacional-121', html: 'Segundo a Filovent, licenças de fora da UE são verificadas caso a caso com o parceiro grego, que pode pedir comprovantes adicionais de experiência.' },
        { t: 'p', html: '<b>Conclusão prática:</b> na Croácia, a CHA de Arrais, Mestre ou Capitão pode servir, com licença de rádio. Na Grécia, o brasileiro tende a precisar de um dos documentos aceitos (ICC, RYA Coastal Skipper Practical ou superior, ASA 104) e de verificação caso a caso. Antes de pagar qualquer curso, peça à empresa de charter, <b>por escrito</b>, qual evidência ela aceita.' },
        { t: 'fato', ref: 'internacional-96', html: 'Para charter no exterior, o RYA orienta perguntar à empresa de charter (de preferência por escrito) qual evidência de competência ela aceita, já que o barco provavelmente não terá bandeira do Reino Unido.' },
        { t: 'h', txt: 'Cenário B: fretar no Caribe e em outros destinos' },
        { t: 'fato', ref: 'internacional-118', html: 'A The Moorings exige certificação formal apenas em certas regiões (Mediterrâneo, Seychelles, Bahamas, Belize e Taiti); nos demais destinos a liberação é pelo currículo de experiência.' },
        { t: 'p', html: 'Nos destinos sem exigência formal, o currículo de velejador (barcos já comandados, milhas, travessias) é o que conta. Guarde um registro organizado das suas milhas e travessias: ele vale ouro nesse cenário.' },
        { t: 'h', txt: 'Cenário C: rally ou regata no Atlântico' },
        { t: 'fato', ref: 'travessia-59', html: 'Os rallies da World Cruising Club exigem no mínimo dois adultos (maiores de 18 anos) por barco: não aceitam velejadores solitários.' },
        { t: 'fato', ref: 'loc_regatas-18', html: 'A World Cruising Club exige que o skipper e pelo menos um tripulante façam treinamento que inclua balsa salva-vidas, homem ao mar, controle de avarias, primeiros socorros, meteorologia e comunicações de emergência.' },
        { t: 'fato', ref: 'travessia-70', html: 'Na Cape2Rio 2025, a pessoa no comando precisa de certificado SA Sailing Yachtmaster Offshore (ou superior) ou equivalente legal para estrangeiros.' },
        { t: 'fato', ref: 'loc_regatas-11', html: 'No Campeonato Brasileiro de Vela de Oceano 2026, a Regata Santos–Rio segue as Offshore Special Regulations (World Sailing) Categoria 3, e as demais regatas a Categoria 4.' },
        { t: 'h', txt: 'Cenário D: cruzar o Atlântico no seu próprio barco' },
        { t: 'fato', ref: 'normas-11', html: 'No art. 4.7, a navegação oceânica (sem restrições) é a realizada entre portos nacionais e estrangeiros fora dos limites de visibilidade da costa e corresponde ao Capitão-Amador.' },
        { t: 'p', html: 'Em barco brasileiro, o essencial é a <b>CHA de Capitão-Amador</b>, a licença da estação de navio, o certificado de operador de rádio da Anatel (a NORMAM-211 não o exige do amador, mas o RGST o exige para estações ligadas ao GMDSS: veja o módulo 4) e a EPIRB registrada. Certificados estrangeiros não são exigidos para isso. Eles ajudam quando autoridades portuárias ou marinas pedem uma prova de competência, e o ICC é justamente esse tipo de prova quando aceita.' },
        { t: 'figura', svg: FLUXO('m8f5', 'Antes de pagar por um certificado: defina o objetivo, pergunte por escrito a quem decide, escolha o menor certificado que resolve e registre suas milhas', [
          ['Defina o objetivo', 'fretar, regata, rally ou travessia própria'],
          ['Pergunte a quem decide', 'empresa de charter, organizador ou autoridade; por escrito'],
          ['Escolha o menor que resolve', 'um certificado que atenda, não o mais famoso'],
          ['Registre suas milhas', 'diário de bordo com datas, milhas e função'],
        ], 1), legenda: 'A pergunta que evita desperdício é: quem vai me pedir este documento?' },
        { t: 'h', txt: 'Um plano de prioridades' },
        { t: 'tabela', cab: ['Objetivo', 'Prioridade alta', 'Só se alguém pedir'], linhas: [
          ['Velejar no Brasil', 'CHA, kit de segurança, primeiros socorros', 'ICC, RYA, ASA'],
          ['Cruzar o Atlântico no próprio barco', 'Capitão-Amador, rádio da Anatel, primeiros socorros e sobrevivência', 'SRC, ICC, Yachtmaster Ocean'],
          ['Regata oceânica Cat. 0, 1 ou 2', 'Offshore Personal Survival, primeiros socorros', 'Yachtmaster'],
          ['Fretar na Croácia', 'CHA de Arrais, Mestre ou Capitão e licença de rádio', 'ICC (a CHA já é reconhecida)'],
          ['Fretar na Grécia', 'ICC, RYA Coastal Skipper Practical ou ASA 104', 'RYA Yachtmaster'],
        ], legenda: 'Quadro de decisão, com base nos fatos desta lição. As exigências mudam: confira sempre com a empresa de charter, a organização da regata ou a autoridade local.' },
        { t: 'callout', tipo: 'dica', titulo: 'Um bom registro de milhas vale mais que muitos certificados', html: 'Mantenha um diário de bordo com datas, milhas, noites no mar, barco, função (tripulante, quarto, skipper) e assinatura do comandante. Ele serve para o currículo de charter, para os pré-requisitos do RYA e para você mesmo.' },
        { t: 'check', questoes: [
          Q('radio2-m8-l5-q1', 'Certificados internacionais', 2, 'Segundo a Filovent, quais documentos são aceitos diretamente na Grécia?',
            'ICC, RYA Coastal Skipper Practical (ou superior) e ASA 104.',
            ['Qualquer certificado Day Skipper.', 'Somente a CHA do país de origem.', 'Nenhum: a Grécia exige exame local.'], 0,
            'Segundo a agência, o Day Skipper deixou de ser aceito em 2019; a CHA e outras licenças de fora da UE são verificadas caso a caso. Não é exigido exame local.',
            'Filovent; fato internacional-120', 'https://www.filovent.com/uk/faq/destinations/greece/boating-licences-regulations-greece'),
          Q('radio2-m8-l5-q2', 'Certificados internacionais', 1, 'Quantos adultos, no mínimo, os rallies da World Cruising Club exigem a bordo?',
            'Dois adultos, maiores de 18 anos.',
            ['Um: velejadores solitários são aceitos.', 'Quatro adultos.', 'Cinco adultos.'], 0,
            'A WCC exige pelo menos dois adultos a bordo e não aceita velejadores solitários, por isso um é errado. Quatro ou cinco adultos são números maiores do que o mínimo pedido: o requisito é dois, e não há exigência de tripulação maior para entrar no rally.',
            'World Cruising Club; fatos travessia-59 e loc_regatas-19', 'https://worldcruising.com/rally-preparations'),
          Q('radio2-m8-l5-q3', 'Certificados internacionais', 1, 'Qual é a habilitação brasileira necessária para conduzir um barco brasileiro numa travessia oceânica?',
            'Capitão-Amador.',
            ['Arrais-Amador.', 'Mestre-Amador.', 'RYA Yachtmaster Offshore.'], 0,
            'A navegação oceânica corresponde ao Capitão-Amador; o Mestre cobre até 20 milhas (costeira) e o Arrais a navegação interior. O RYA Yachtmaster é certificado privado, e não habilitação brasileira.',
            'NORMAM-211, art. 4.7; fato normas-11', N211),
        ] },
        { t: 'fontes', itens: [
          { txt: 'The Moorings: requisitos de licença para skippers', url: 'https://www.moorings.com/yacht-charter/resumes-requirements', ref: 'internacional-118' },
          { txt: 'World Cruising Club: preparação para rallies', url: 'https://worldcruising.com/rally-preparations', ref: 'travessia-59' },
          { txt: 'NORMAM-211/DPC: art. 4.7', url: N211, ref: 'normas-11' },
        ] },
      ],
    },
  ],
});
/*__FIM__*/
  VL.dado('cursos/radio-2', { modulos: M });
})();
