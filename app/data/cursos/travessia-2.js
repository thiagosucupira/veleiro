/* Curso Travessia oceânica, parte 2 (módulos m6 a m12): tripulação e quartos de serviço, saúde a bordo,
   provisões e rotina, mau tempo no oceano, emergências oceânicas, partida e chegada (formalidades) e o
   checklist final para comandar a travessia.
   Fatos regulatórios só com {t:'fato', ref} ou fontes com ref (selo automático). Os ids "extra-travessia-2-NN"
   estão em research/_work/research_extra_travessia-2.json e passam pela verificação dupla depois.
   Conteúdo técnico (não regulatório): cita a fonte no fim de cada lição. Conteúdo: CC BY-SA 4.0. */
(function () {
  'use strict';
  /* Figura SVG inline: id curto único, título acessível, viewBox, corpo. Cores só por variáveis do tema. */
  function S(id, titulo, vb, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" role="img" aria-labelledby="' + id + '-t" style="max-width:' + (maxw || 560) +
      'px;display:block;margin:0 auto" font-family="inherit"><title id="' + id + '-t">' + titulo + '</title>' + corpo + '</svg>';
  }
  /* Questão no formato oficial (nível travessia). */
  function Q(id, tema, dificuldade, enunciado, alternativas, correta, explicacao, referencia, fonte_url) {
    var q = { id: id, nivel: 'travessia', tema: tema, dificuldade: dificuldade, enunciado: enunciado,
      alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
    if (fonte_url) q.fonte_url = fonte_url;
    return q;
  }
  /* Questão da trilha internacional (some quando a trilha está desligada). */
  function QI() { var q = Q.apply(null, arguments); q.intl = true; return q; }
  var M = [];
M.push({
  id: 'm6', titulo: 'Tripulação e quartos de serviço',
  resumo: 'Quem leva, o que cada um faz, como dividir o dia e a noite em quartos e como evitar que o cansaço decida pela tripulação: o fator humano de uma travessia de semanas.',
  licoes: [
    {
      id: 'l1', titulo: 'Escolher e preparar a tripulação', minutos: 12,
      objetivos: [
        'Dimensionar a tripulação do seu veleiro para uma travessia oceânica.',
        'Montar uma tripulação que reúna as habilidades de que a viagem depende, e não só amigos.',
        'Explicar o que a norma e os organizadores de rallies exigem de quem comanda e de quem embarca.',
      ],
      blocos: [
        { t: 'p', html: 'Num veleiro de travessia, a tripulação é o equipamento mais importante e o mais difícil de testar. O barco aguenta o tempo. As pessoas é que ficam cansadas, enjoadas, irritadas e com medo. Por isso a escolha da tripulação vem antes da escolha da data.' },
        { t: 'termos', ids: ['comandante', 'tripulante', 'tripulacao', 'lotacao'] },
        { t: 'h', txt: 'Quantas pessoas?' },
        { t: 'p', html: 'Não existe número único. Há dois limites que se encontram. O limite de cima é a <b>lotação</b> do barco, o número de camas e de lugares na balsa salva-vidas. O limite de baixo é o <b>número de pessoas capazes de manter os quartos de serviço</b> sem se matar de cansaço: com apenas duas pessoas, cada uma fica metade do tempo acordada de plantão.' },
        { t: 'fato', ref: 'extra-arrais-3-41', html: 'É proibido exceder a lotação estabelecida pelo construtor ou pela Capitania; ela consta do TIE ou do PRPM.' },
        { t: 'fato', ref: 'travessia-59', html: 'Os rallies da World Cruising Club exigem no mínimo dois adultos (maiores de 18 anos) por barco: não aceitam velejadores solitários.' },
        { t: 'p', html: 'Na prática, a maioria das travessias de veleiros de 30 a 40 pés é feita por <b>3 a 5 pessoas</b>. Com três, os quartos funcionam, mas ninguém sobra para uma emergência no meio da noite. Com quatro, o comandante pode ficar fora da escala. Com mais de cinco, o barco pequeno começa a ficar apertado e o consumo de água e comida dispara. Planeje a balsa e a comida para <b>todos</b> os que estiverem a bordo (a norma exige balsa para 100% das pessoas).' },
        { t: 'fato', ref: 'travessia-114', html: 'Na navegação oceânica a embarcação deve ter balsas salva-vidas infláveis para 100% das pessoas a bordo, podendo ser classe II.' },
        { t: 'h', txt: 'O que cada pessoa precisa saber fazer' },
        { t: 'p', html: 'Monte uma tabela simples de habilidades e marque quem cobre cada uma. O objetivo é que <b>pelo menos duas pessoas</b> saibam fazer tudo o que for crítico: se o comandante cair ou adoecer, outro precisa levar o barco.' },
        { t: 'tabela', cab: ['Habilidade', 'Por que importa', 'Mínimo desejável'], linhas: [
          ['Governar e trimar à noite', 'Metade da travessia é no escuro', 'Todos'],
          ['Navegação e posição (GNSS e carta)', 'Se o comandante cair, alguém continua a navegar', '2 pessoas'],
          ['Rádio: Mayday e Pan-Pan, DSC', 'Pedir socorro sem o comandante', '2 pessoas'],
          ['Primeiros socorros e kit médico', 'Lesão e doença a dias do porto', '2 pessoas'],
          ['Motor, bombas e eletricidade', 'Pane em alto-mar', '2 pessoas'],
          ['Reduzir pano e velas de mau tempo', 'Rizar cedo evita quebras', 'Todos que fazem quarto'],
          ['Homem ao mar e abandono', 'Segundos contam', 'Todos'],
        ], legenda: 'Ajuste à sua viagem. A coluna da direita é boa prática de cruzeiristas, não regra.' },
        { t: 'h', txt: 'O que as regras de segurança pedem' },
        { t: 'fato', ref: 'travessia-08', html: 'Pela OSR 1.02.1 (World Sailing), a segurança do barco e da tripulação é responsabilidade exclusiva e inescapável da pessoa no comando, que também deve designar um substituto em caso de incapacidade.' },
        { t: 'fato', ref: 'travessia-40', html: 'Na Categoria 1 e na 2 das OSR, pelo menos 30% da tripulação, nunca menos de duas pessoas, incluindo a pessoa no comando, deve ter feito nos 5 anos anteriores o treinamento dos tópicos da OSR 6.02.' },
        { t: 'fato', ref: 'travessia-43', html: 'Na Categoria 1 das OSR, pelo menos dois tripulantes precisam de certificado de primeiros socorros válido, feito nos últimos 5 anos.' },
        { t: 'callout', tipo: 'nota', titulo: 'No Brasil, quem comanda precisa da habilitação certa', html: 'Para navegar além de 20 milhas da costa (ou fora do limite de visibilidade da costa, como diz o art. 4.7 da norma), o condutor precisa ser <b>Capitão-Amador</b>; as OSR e os rallies pedem ainda treinamentos próprios. Veja as regras de habilitação nos módulos do curso de Capitão-Amador.' },
        { t: 'fato', ref: 'normas-11', html: 'A navegação oceânica (sem restrições) é a realizada entre portos nacionais e estrangeiros fora dos limites de visibilidade da costa e corresponde ao Capitão-Amador.' },
        { t: 'h', txt: 'Onde achar gente e como testar' },
        { t: 'p', html: 'Amigos de longa data nem sempre fazem boa tripulação, e desconhecidos de um site de busca também não. O que funciona é <b>navegar antes</b>. Faça com a mesma equipe uma passagem de 24 a 72 horas com noite no mar. Observe quem enjoa e se recupera, quem acorda para o quarto, quem fala quando algo não está bem. Combine por escrito: quem paga o quê (combustível, comida, marina), quem tem a última palavra, como cada um sai da viagem se quiser desistir num porto de escala.' },
        { t: 'fato', ref: 'loc_regatas-22', html: 'A Ocean Crew Link é o serviço de busca de tripulação preferido da World Cruising Club; o tripulante paga assinatura de US$ 5 por mês e precisa ter 18 anos ou mais.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Cheque a saúde antes de largar', html: 'Peça a cada tripulante, por escrito, alergias, remédios de uso contínuo e condições crônicas (diabetes, asma, problema cardíaco, epilepsia). O comandante precisa saber disso <b>antes</b> do porto, não no meio do oceano. Quem usa medicação contínua leva estoque para toda a viagem mais uma margem.' },
        { t: 'check', questoes: [
          Q('trav2-m6-l1-q1', 'Travessia: tripulação', 1, 'Pela OSR 1.02.1 da World Sailing, quem responde pela segurança do barco e da tripulação?',
            ['A pessoa no comando, de forma exclusiva e inescapável, e ela deve designar um substituto em caso de incapacidade.', 'O tripulante mais experiente, qualquer que seja ele.', 'A organização da regata, que assume a responsabilidade ao aceitar a inscrição.', 'O fabricante do barco, desde que o barco tenha certificação de projeto.'], 0,
            'A OSR coloca a responsabilidade na pessoa no comando e exige um substituto designado. A organização e o fabricante não assumem essa responsabilidade, e a experiência de um tripulante não a transfere: quem comanda responde.', 'OSR 1.02.1 (World Sailing 2026-2027); fato travessia-08', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m6-l1-q2', 'Travessia: tripulação', 2, 'Um veleiro de cruzeiro com três pessoas a bordo vai cruzar o Atlântico. Qual é o principal problema de uma tripulação tão pequena?',
            ['Com três pessoas, cada uma fica em quarto cerca de um terço do tempo e ninguém sobra para uma emergência à noite, o que aumenta a fadiga e o risco.', 'A norma proíbe tripulações com menos de cinco pessoas.', 'O veleiro não aceita menos de quatro pessoas por causa do peso.', 'O Atlântico só pode ser cruzado por tripulações com número par.'], 0,
            'Três pessoas conseguem manter quartos, mas dormem pouco e não há reserva em caso de doença ou avaria. Não existe proibição de tripular com três, o peso do barco não é o fator, e o número par não tem importância. A norma cobra balsa para todas as pessoas, não um mínimo de cinco.', 'Boa prática de cruzeiro; fato travessia-114 (balsa para 100%)'),
          Q('trav2-m6-l1-q3', 'Travessia: tripulação', 2, 'Qual preparo melhor reduz o risco de a tripulação se desentender ou desmontar no meio da travessia?',
            ['Navegar antes com a mesma equipe, incluindo uma noite no mar, e combinar por escrito custos, autoridade do comandante e saída em portos de escala.', 'Escolher só amigos de infância, porque a confiança dispensa combinados.', 'Contratar tripulantes pela internet no dia da largada para ter gente descansada.', 'Esconder dos tripulantes a rota para evitar discussões.'], 0,
            'Um teste de 24 a 72 horas mostra enjoo, sono e comportamento sob cansaço; o combinado por escrito evita conflitos de dinheiro e mando. A amizade sozinha não resolve, tripulantes desconhecidos do dia da largada nunca foram testados, e esconder a rota quebra a confiança e a segurança.', 'RYA Yachtmaster Ocean e literatura de cruzeiro (Cornell, World Cruising Handbook)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, Offshore Special Regulations 2026-2027: OSR 1.02.1, 6.02 e 6.05', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-08' },
          { txt: 'World Cruising Club: preparação para rallies (mínimo de dois adultos)', url: 'https://worldcruising.com/rally-preparations', ref: 'travessia-59' },
          { txt: 'NORMAM-211/DPC: lotação e navegação oceânica', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'normas-11' },
          { txt: 'Jimmy Cornell, <i>World Cruising Handbook</i>, capítulos sobre tripulação (referência técnica, sem link)' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Funções a bordo e o briefing de segurança', minutos: 11,
      objetivos: [
        'Atribuir funções claras a cada tripulante sem perder a flexibilidade.',
        'Conduzir um briefing de segurança antes da largada, com postos de emergência.',
        'Registrar as ordens permanentes do comandante e as situações em que ele deve ser chamado.',
      ],
      blocos: [
        { t: 'p', html: 'Numa travessia longa, todo mundo faz tudo: lava a louça, grita “virar!” e dorme sobre o saco de velas. Mesmo assim, funções claras tiram o improviso das horas ruins. Quando algo dá errado às três da manhã, ninguém deve perguntar quem faz o quê.' },
        { t: 'tabela', cab: ['Função', 'O que cuida', 'Quem a assume'], linhas: [
          ['Comandante', 'Decisões finais, rota, segurança, relação com autoridades', 'Quem responde pelo barco e pela viagem'],
          ['Imediato (substituto)', 'Assume se o comandante cair ou adoecer; conhece as decisões do comandante', 'Designado antes da largada (OSR 1.02.1)'],
          ['Navegador e tempo', 'Posição, rota, previsões, mensagens de tempo', 'Comandante ou imediato'],
          ['Saúde', 'Kit médico, manual, diário de sintomas', 'Quem tem curso de primeiros socorros'],
          ['Rádio e comunicações', 'VHF, DSC, satélite, rotinas de contato', 'Quem tem o certificado de radioperador'],
          ['Mecânica e energia', 'Motor, baterias, bombas, água', 'Quem entende de máquinas'],
          ['Rancho e água', 'Cardápio, estoque, consumo de água', 'Rotativo ou quem gosta'],
          ['Aparelho e velas', 'Inspeção diária do mastro, cabos e velas', 'Rotativo, com o comandante'],
        ], legenda: 'Ninguém acumula só uma função; cada função tem um reserva. Gire as tarefas de rancho e limpeza.' },
        { t: 'h', txt: 'O briefing de segurança' },
        { t: 'p', html: 'Antes de sair do porto, reúna todos e percorra o barco com a lista abaixo. Mostre com a mão, não só com palavras. Repita a cada novo tripulante que embarcar numa escala.' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Colete e arnês:</b> cada um ajusta o seu. Em que condições o arnês é obrigatório (à noite, ao sair do cockpit, com mar grosso).',
          '<b>Jackstays e pontos de engate:</b> por onde se anda no convés, sempre engatado.',
          '<b>Homem ao mar:</b> o grito, o botão MOB do GNSS, quem aponta, quem lança a flutuação, quem aciona o rádio e quem manobra. Veja o módulo 10, aula 1.',
          '<b>Balsa, grab bag e EPIRB:</b> onde estão, quem pega o quê, como se lança.',
          '<b>Fogo:</b> extintores, cobertor, botijão de gás e o registro dele.',
          '<b>Água entrando:</b> bombas manuais, válvulas de fundo, onde fica o tampão de madeira.',
          '<b>Rádio:</b> como chamar Mayday no VHF e no DSC, canal 16, posição lida do GNSS.',
          '<b>Ordens do comandante:</b> situações em que ele deve ser chamado, sem constrangimento.',
        ] },
        { t: 'figura', svg: S('m6bar', 'Esquema de um veleiro de cruzeiro visto de cima, com os postos de segurança: jackstays nos dois bordos, EPIRB e grab bag junto à saída do cockpit, balsa salva-vidas na popa, extintores, bomba e kit médico', '0 0 520 280',
          '<path d="M50 105 Q50 92 82 88 L330 82 Q440 96 480 140 Q440 184 330 198 L82 192 Q50 188 50 175 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
          '<rect x="86" y="112" width="86" height="56" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
          '<rect x="190" y="108" width="120" height="64" rx="10" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
          '<circle cx="270" cy="140" r="6" fill="currentColor"/>' +
          '<path d="M70 98 L450 124" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="8 5" fill="none"/>' +
          '<path d="M70 182 L450 156" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="8 5" fill="none"/>' +
          '<circle cx="64" cy="140" r="14" fill="var(--shoal)" stroke="currentColor" stroke-width="1.5"/>' +
          '<circle cx="178" cy="140" r="8" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="1.5"/>' +
          '<rect x="220" y="118" width="26" height="12" fill="var(--nav-red)" stroke="currentColor" stroke-width="1"/>' +
          '<rect x="220" y="150" width="26" height="12" fill="var(--nav-green)" stroke="currentColor" stroke-width="1"/>' +
          '<line x1="64" y1="126" x2="64" y2="46" stroke="currentColor"/><text x="64" y="38" font-size="14" text-anchor="start" fill="currentColor">Balsa (solta em até 15 s)</text>' +
          '<line x1="178" y1="132" x2="178" y2="66" stroke="currentColor"/><text x="150" y="60" font-size="14" fill="currentColor">EPIRB e grab bag</text>' +
          '<line x1="233" y1="118" x2="320" y2="66" stroke="currentColor"/><text x="300" y="60" font-size="14" fill="currentColor">Extintor</text>' +
          '<line x1="233" y1="162" x2="233" y2="236" stroke="currentColor"/><text x="150" y="254" font-size="14" fill="currentColor">Kit médico e manual</text>' +
          '<line x1="110" y1="168" x2="110" y2="214" stroke="currentColor"/><text x="40" y="232" font-size="14" fill="currentColor">Bomba manual</text>' +
          '<line x1="400" y1="150" x2="400" y2="236" stroke="var(--magenta)"/><text x="330" y="254" font-size="14" fill="var(--magenta)">Jackstays (linha de vida)</text>' +
          '<text x="446" y="84" font-size="14" fill="currentColor">proa</text>', 560),
          legenda: 'Esquema genérico: cada barco tem seu arranjo. O importante é que todos saibam de cor onde fica cada item, no escuro.' },
        { t: 'fato', ref: 'travessia-19', html: 'Cat. 0 a 3 das OSR: jackstays (linhas de vida de convés) independentes em cada bordo, com resistência de ruptura de 2040 kg, em cabo de aço inox 1x19 de no mínimo 5 mm sem revestimento, fita (webbing) ou cabo HMPE.' },
        { t: 'fato', ref: 'travessia-42', html: 'Em todas as categorias das OSR, ao menos uma vez por ano a tripulação deve praticar recuperação de homem ao mar e abandono da embarcação.' },
        { t: 'h', txt: 'As ordens permanentes do comandante' },
        { t: 'p', html: 'Quem está de quarto à noite toma decisões sozinho. Escreva as ordens permanentes e cole-as no cockpit ou na mesa de navegação. Elas dizem, sem ambiguidade, quando o comandante <b>deve</b> ser acordado. Alguns exemplos de boa marinharia, para adaptar:' },
        { t: 'lista', itens: [
          'Embarcação a menos de uma distância combinada (por exemplo 2 a 3 milhas) ou com marcação que não muda: chame o comandante.',
          'Vento aumentando além de um limite combinado: reduza pano e chame.',
          'Qualquer dúvida sobre a rota, o barco ou a saúde de alguém: chame.',
          'Mude do piloto automático para o timão só após avisar o comandante.',
          'Nunca saia do cockpit sem estar engatado e sem avisar quem está dentro.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Um comandante bom quer ser acordado', html: 'Diga logo no briefing: “prefiro ser acordado dez vezes sem necessidade a uma vez tarde demais”. Tripulantes com medo de incomodar são o risco mais subestimado do mar.' },
        { t: 'check', questoes: [
          Q('trav2-m6-l2-q1', 'Travessia: tripulação', 1, 'Por que as OSR exigem que o comandante designe um substituto antes da largada?',
            ['Para que, se o comandante ficar incapacitado, alguém já esteja preparado para assumir a segurança do barco e da tripulação.', 'Para dividir a responsabilidade legal igualmente entre os dois.', 'Para que o comandante possa deixar de fazer quartos.', 'Porque o regulamento obriga um imediato com o curso de Capitão-Amador.'], 0,
            'A OSR 1.02.1 diz que a responsabilidade é exclusiva do comandante e que deve haver substituto para o caso de incapacidade. Ela não divide a responsabilidade, não trata de quartos e não exige um curso específico para o substituto.', 'OSR 1.02.1; fato travessia-08', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m6-l2-q2', 'Travessia: tripulação', 2, 'O que as OSR pedem para a prática de segurança da tripulação, em todas as categorias?',
            ['Praticar recuperação de homem ao mar e abandono da embarcação ao menos uma vez por ano.', 'Praticar apenas o lançamento da balsa, a cada cinco anos.', 'Fazer o treinamento de segurança somente na semana da largada.', 'Não exigem prática, só a presença do equipamento a bordo.'], 0,
            'A norma pede prática anual de homem ao mar e abandono. Treinar só a balsa ou só uma vez não cumpre a regra, e ter o equipamento sem saber usá-lo não adianta nada.', 'OSR 6; fato travessia-42', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m6-l2-q3', 'Travessia: tripulação', 2, 'Qual destas é uma boa ordem permanente do comandante para o vigia noturno?',
            ['Chamar o comandante quando houver embarcação a menos de uma distância combinada ou a marcação não mudar, ou em qualquer dúvida.', 'Só chamar o comandante depois de resolver o problema sozinho.', 'Desengatar o arnês no cockpit para ter mais liberdade.', 'Desligar o AIS para economizar bateria durante a noite.'], 0,
            'Marcação constante indica risco de abalroamento (RIPEAM, Regra 7) e a dúvida deve ser resolvida chamando o comandante. Resolver sozinho e avisar depois, soltar o arnês ou desligar o AIS são atitudes perigosas.', 'RIPEAM, Regras 5 e 7; fatos tecnico-15 e tecnico-18'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: OSR 1.02.1, jackstays e treinamento (OSR 6)', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-19' },
          { txt: 'RIPEAM-72 (CCA-IMO/Marinha): Regras 5 e 7', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf', ref: 'tecnico-17' },
          { txt: 'RYA, <i>Yachtmaster Ocean</i> e <i>Ocean Skipper Handbook</i> (referência de briefing e ordens permanentes, sem link)' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Sistemas de quartos de serviço', minutos: 12,
      objetivos: [
        'Comparar os sistemas de quartos mais usados (3 em 6, 4 em 8, quartos de cão, sistema sueco).',
        'Montar uma escala de quartos para 3 ou 4 pessoas e conferir as horas de descanso.',
        'Aplicar a vigilância exigida pelo RIPEAM durante todo o quarto.',
      ],
      blocos: [
        { t: 'p', html: 'O <b>quarto de serviço</b> é o turno em que uma pessoa (ou dupla) cuida do barco enquanto os outros descansam. O RIPEAM não deixa dúvida de que alguém precisa estar de vigia, atento, a todo momento.' },
        { t: 'fato', ref: 'tecnico-15', html: 'Regra 5 do RIPEAM: toda embarcação deve manter permanentemente vigilância visual e auditiva apropriada e por todos os meios disponíveis.' },
        { t: 'termos', ids: ['vigilancia', 'risco-de-abalroamento', 'ais'] },
        { t: 'h', txt: 'Os sistemas mais comuns' },
        { t: 'p', html: 'Os nomes descrevem o desenho: “3 em 6” significa 3 horas de quarto e 6 de folga, com três equipes que se revezam; “4 em 8” significa 4 horas de quarto e 8 de folga, também com três equipes. Com duas equipes, quarto e folga têm o mesmo tamanho (3 e 3, 4 e 4 ou 6 e 6). O número de equipes é o que decide o descanso.' },
        { t: 'tabela', cab: ['Sistema', 'Como funciona', 'Bom para', 'Cuidado'], linhas: [
          ['3 em 6', 'Quartos de 3 h; folga de 6 h', 'Três equipes; quartos curtos para quem cansa depressa', 'Oito trocas por dia; descanso picado'],
          ['4 em 8', 'Quartos de 4 h; folga de 8 h', 'Três equipes; é o clássico das travessias', 'O mesmo quarto sempre cai no escuro da madrugada'],
          ['4 em 8 com quartos de cão', 'O quarto das 16 às 20 h é dividido em dois de 2 h', 'Gira a escala para a tripulação não ter sempre o mesmo horário', 'Mais trocas, mais ruído no barco'],
          ['Sistema sueco', 'Família de variantes, sem padrão único; uma delas tem quartos de 6 h de dia e 4 h de noite (6-6-4-4-4, cinco quartos por dia)', 'Quando se quer boa folga à noite e dividir o dia, sem o mesmo quarto sempre', 'Quartos longos cansam mais: um estudo da Chalmers com navios suecos achou mais sonolência à noite no sistema de 6 h'],
          ['Duplas', 'Duas pessoas por quarto, uma de vigia e outra descansando perto', 'Noites difíceis ou tripulantes novatos', 'Reduz o número de equipes'],
        ], legenda: 'Os nomes descrevem o resultado com três equipes. Com outro número de equipes, as horas de quarto e de folga mudam: confira no simulador.' },
        { t: 'widget', w: 'quartos', opts: { pessoas: 4, sistema: '4em8', dias: 3 }, legenda: 'Troque o número de pessoas e o sistema. Observe quantas horas de descanso cada um recebe em 24 h e se a escala gira ao longo dos dias.' },
        { t: 'h', txt: 'Como escolher' },
        { t: 'lista', itens: [
          '<b>Com três pessoas:</b> o 4 em 8 dá a cada um 4 horas de quarto e 8 de folga; mas o comandante, que é um dos três, também fica de quarto.',
          '<b>Com quatro pessoas:</b> o comandante pode ficar fora da escala e de sobreaviso, ou entrar no sistema. Muitos deixam o comandante fora nos primeiros dias, enquanto os outros pegam o ritmo.',
          '<b>Com duas pessoas:</b> costuma-se usar quartos mais curtos (2 a 3 horas), porque o descanso é pouco e a vigilância é a prioridade.',
          '<b>Gire os horários:</b> quem pega a madrugada (0 às 4 h) numa noite pega outro horário na seguinte.',
        ] },
        { t: 'h', txt: 'Como se faz um bom quarto de serviço' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Passagem de quarto:</b> quem sai conta o rumo, o vento, as velas, o tráfego visto, a posição e qualquer coisa estranha. Quem entra repete o que entendeu.',
          '<b>Varredura do horizonte:</b> olhe 360° com regularidade, no máximo a cada 10 a 15 minutos, inclusive para trás e atrás das velas.',
          '<b>Marcação constante:</b> se a marcação de um barco que se aproxima não muda, presume-se risco de abalroamento.',
          '<b>Registro no diário de bordo:</b> posição, rumo, vento, pressão, estado do mar, horas de motor, a cada hora ou a cada quarto.',
          '<b>Alarme e AIS:</b> o alarme de proximidade do AIS ajuda, mas não substitui a vigia visual.',
          '<b>Engatado sempre:</b> à noite e sozinho no cockpit, use o arnês e engate-se antes de sair.',
        ] },
        { t: 'fato', ref: 'tecnico-18', html: 'Regra 7(d)(I) do RIPEAM: presume-se risco de abalroamento se a marcação de uma embarcação que se aproxima não se altera de modo apreciável.' },
        { t: 'fato', ref: 'tecnico-17', html: 'Regra 7(a) do RIPEAM: em caso de dúvida, deve-se presumir que existe risco de abalroamento.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Piloto automático não é vigia', html: 'O piloto governa, mas não vê. Quem está de quarto não pode cochilar no cockpit, nem “dar uma olhada” só pelo AIS. Se estiver com sono incontrolável, acorde o próximo, ou chame o comandante.' },
        { t: 'h', txt: 'Exercite' },
        { t: 'widget', w: 'quartos', opts: { modo: 'desafio', pessoas: 3, sistema: '4em8' }, legenda: 'Modo desafio: monte uma escala para três pessoas e veja se alguém fica sem descanso suficiente.' },
        { t: 'check', questoes: [
          Q('trav2-m6-l3-q1', 'Travessia: tripulação', 1, 'O que a Regra 5 do RIPEAM exige de toda embarcação?',
            ['Manter vigilância visual e auditiva apropriada, em permanência e por todos os meios disponíveis.', 'Manter vigilância somente à noite e em visibilidade restrita.', 'Delegar a vigilância ao piloto automático quando houver AIS.', 'Manter vigilância apenas quando houver outras embarcações no radar.'], 0,
            'A Regra 5 exige vigilância permanente, visual e auditiva, por todos os meios. Ela vale de dia e de noite, e os instrumentos complementam, mas não substituem, a atenção humana.', 'RIPEAM, Regra 5; fato tecnico-15', 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf'),
          Q('trav2-m6-l3-q2', 'Travessia: tripulação', 2, 'No sistema “4 em 8” com três equipes, quanto tempo de folga cada equipe tem entre dois quartos?',
            ['8 horas.', '4 horas.', '12 horas.', '2 horas.'], 0,
            'O nome já diz: 4 horas de quarto e 8 de folga, com três equipes que se revezam (4 + 8 = 12 = 3 × 4). Com 4 horas de folga seria o sistema de duas equipes, e 12 ou 2 horas não correspondem a esse arranjo.', 'Boa prática de cruzeiro; widget quartos'),
          Q('trav2-m6-l3-q3', 'Travessia: tripulação', 2, 'Um vigia nota um navio por boreste cuja marcação não muda ao longo de vários minutos. O que isso indica pelo RIPEAM?',
            ['Que se presume risco de abalroamento e é preciso agir de acordo com as regras de rumo e governo.', 'Que o navio está parado e não oferece perigo.', 'Que o navio é mais lento e vai passar pela popa.', 'Que é possível ignorar, se houver AIS ligado.'], 0,
            'Marcação constante com distância diminuindo significa rota de colisão: a Regra 7(d)(I) manda presumir risco. O navio não está necessariamente parado nem mais lento, e o AIS não elimina a obrigação de agir.', 'RIPEAM, Regra 7; fato tecnico-18', 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RIPEAM-72 (CCA-IMO/Marinha): Regras 5 e 7', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf', ref: 'tecnico-15' },
          { txt: 'Miguens, <i>Navegação: a ciência e a arte</i>, vol. I (serviço de quarto, vigilância)' },
          { txt: 'Wikipedia, Watchkeeping: não há padrão único para o sistema sueco', url: 'https://en.wikipedia.org/wiki/Watchkeeping' },
          { txt: 'Pacific Cup, On Watch: sistemas de quartos em travessia (sueco: 6-6-4-4-4)', url: 'https://pacificcup.org/sites/default/files/kbfiles/OnWatch.pdf' },
          { txt: 'Chalmers, Fatigue at Sea in Swedish Shipping: estudo de campo', url: 'https://research.chalmers.se/en/publication/123678' },
          { txt: 'Sistemas de quartos: Cornell, <i>World Cruising Handbook</i>; Pardey, <i>Offshore Cruising</i> (referências técnicas, sem link)' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Fadiga, sono e boas decisões', minutos: 10,
      objetivos: [
        'Reconhecer os sinais de fadiga em si e nos outros.',
        'Organizar sono, alimentação e hidratação para manter a tripulação alerta.',
        'Decidir cedo (reduzir pano, mudar rota) antes que o cansaço atrapalhe o julgamento.',
      ],
      blocos: [
        { t: 'p', html: 'Ninguém sabe dormir no mar de primeira. O barco balança, as velas batem, a rotina de quartos corta o sono em pedaços. Na primeira semana, quase toda tripulação acumula déficit de sono, e é aí que erros de julgamento aparecem: uma vela deixada grande demais, uma marcação não checada, um engate esquecido.' },
        { t: 'h', txt: 'Sinais de fadiga' },
        { t: 'lista', itens: [
          'Microssonos (os olhos fecham sem querer por alguns segundos).',
          'Irritação, silêncio incomum, mau humor sem motivo.',
          'Esquecer o que acabou de ser dito, ou ler a mesma coisa duas vezes.',
          'Ver “navios” que não estão lá, ou deixar de ver os que estão.',
          'Descuido com o arnês, a água, a comida e o próprio corpo.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Quem dorme em pé não pode ficar de vigia', html: 'Se você notou um microssono, está na hora de render o seu quarto, mesmo antes do horário. Avise o comandante. É uma regra da casa: dizer “estou fora” não é fraqueza, é segurança.' },
        { t: 'h', txt: 'Como dormir melhor no mar' },
        { t: 'lista', itens: [
          '<b>Beliche ajustado:</b> use uma tábua de proteção (leeboard) ou lona para não rolar; deite do lado de sotavento.',
          '<b>Cochilos curtos:</b> quem não consegue dormir longas horas se beneficia de sonecas de 20 a 30 minutos nos intervalos; navegadores solitários usam esse princípio por necessidade.',
          '<b>Rotina:</b> procure dormir em horários parecidos todo dia; escuro, protetores de ouvido e máscara ajudam.',
          '<b>Cafeína:</b> use com moderação e evite perto da hora de dormir.',
          '<b>Álcool:</b> a regra de bordo mais comum é zero em travessia, porque prejudica o sono e o julgamento. Muitos barcos adotam “a bordo, só no porto”. É regra de boa marinharia, e o limite legal para o condutor é outro (veja abaixo).',
        ] },
        { t: 'fato', ref: 'normas-138', html: 'A NORMAM-211 considera o condutor embriagado a partir de 0,25 mg de álcool por litro de ar alveolar, ou 0,05% no sangue. A segurança no oceano pede mais do que esse limite legal.' },
        { t: 'h', txt: 'Comer, beber e se aquecer' },
        { t: 'p', html: 'Cansaço e enjoo pioram quando o estômago está vazio e quando falta água. Programe refeições quentes nos horários em que o clima permite e deixe lanches fáceis (barras, castanhas, frutas secas, biscoitos) ao alcance do cockpit. Tenha uma garrafa de água por pessoa, ao alcance, e tome-a em goles regulares, não só quando sentir sede. No trópico o corpo perde líquido pelo suor sem que se perceba, e à noite o frio e o vento afetam mais do que o termômetro mostra, então leve agasalho e capa de chuva para o quarto.' },
        { t: 'h', txt: 'Decida cedo' },
        { t: 'p', html: 'A regra de ouro do mar largo é <b>reduzir pano antes de precisar</b>. Rizar com calma, de dia ou ao fim do quarto, custa pouco. Rizar às três da manhã com o barco já adernado é perigoso, e geralmente é feito por alguém cansado. Combine com a tripulação alguns gatilhos objetivos, por exemplo: “ao anoitecer, todos os barcos entram em configuração de noite, ou seja, um rizo a mais do que o dia pede”.' },
        { t: 'callout', tipo: 'dica', titulo: 'Antes da noite, prepare o barco', html: 'Ao entardecer: reduza pano, revise os cabos, ponha o arnês de todos no cockpit, carregue a lanterna de cabeça, confira o AIS e as luzes de navegação. O que fica pronto à luz do dia não vira improviso no escuro.' },
        { t: 'check', questoes: [
          Q('trav2-m6-l4-q1', 'Travessia: tripulação', 1, 'Um tripulante, de quarto à noite, nota que fechou os olhos por alguns segundos sem querer (microssono). Qual é a atitude correta?',
            ['Avisar o comandante e pedir para ser rendido, mesmo antes do horário.', 'Beber café e continuar até o fim do quarto.', 'Desligar as luzes do cockpit para ver melhor o horizonte.', 'Passar a governar com o piloto automático sem avisar ninguém.'], 0,
            'O microssono mostra que a atenção não é confiável. Café ajuda pouco com déficit de sono real; desligar as luzes do cockpit não resolve nada; o piloto automático não tem vigia. Render-se cedo é a atitude segura.', 'RIPEAM, Regra 5 (vigilância); literatura de fadiga no mar'),
          Q('trav2-m6-l4-q2', 'Travessia: tripulação', 2, 'Quando é melhor reduzir o pano para a noite num veleiro de cruzeiro em travessia?',
            ['Ao entardecer, com calma e com todos descansados, antes que o vento aumente.', 'Só quando o vento passar de 30 nós, para não perder velocidade.', 'Nunca à noite, porque rizar no escuro é arriscado.', 'Apenas se o comandante estiver acordado.'], 0,
            'Reduzir antes é mais seguro: a manobra é feita sem pressa e com a tripulação inteira acordada. Esperar vento forte significa rizar no pior momento; “nunca” deixaria o barco sobrecarregado; e a decisão não depende de o comandante estar acordado, se as ordens permanentes forem claras.', 'Boa marinharia (Pardey, Offshore Cruising; Coles, Heavy Weather Sailing)'),
          Q('trav2-m6-l4-q3', 'Travessia: tripulação', 2, 'Por que o álcool costuma ser proibido durante a travessia?',
            ['Prejudica o sono, o julgamento e a capacidade de reagir, e aumenta o risco de queda ao mar.', 'Porque o álcool aumenta a temperatura do corpo e evita o enjoo.', 'Porque a norma proíbe qualquer bebida a bordo.', 'Porque o álcool estraga o casco do barco.'], 0,
            'A restrição é uma regra de boa marinharia, adotada porque o álcool piora a coordenação e o discernimento. Ele não evita o enjoo, a norma não proíbe bebida a bordo de forma geral e não afeta o casco.', 'Boa prática de cruzeiro; Cruz Vermelha (primeiros socorros)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RIPEAM-72, Regra 5: vigilância permanente', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf', ref: 'tecnico-15' },
          { txt: 'C. Stampi, <i>Why We Nap</i> (sonecas e sono polifásico em navegadores solitários, referência técnica, sem link)' },
          { txt: 'Lin e Larry Pardey, <i>The Capable Cruiser</i>; Adlard Coles, <i>Heavy Weather Sailing</i> (decidir cedo, reduzir pano antes da noite)' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm7', titulo: 'Saúde a bordo',
  resumo: 'O que levar, quem sabe usar, como pedir orientação médica pelo rádio e quando desviar a rota. A distância até o hospital passa a ser medida em dias.',
  licoes: [
    {
      id: 'l1', titulo: 'Prevenção e o kit médico de travessia', minutos: 12,
      objetivos: [
        'Distinguir o kit mínimo da NORMAM-211 do kit de travessia oceânica.',
        'Citar o guia da OMS usado como referência para tratar doenças e lesões em navios sem médico.',
        'Montar e manter o inventário do kit com um médico, sem improvisar doses.',
      ],
      blocos: [
        { t: 'callout', tipo: 'seguranca', titulo: 'Faça um curso de primeiros socorros antes de largar', html: 'Este módulo não substitui treinamento prático. Faça um curso de primeiros socorros (RCP, hemorragia, fraturas, afogamento, hipotermia). Veja as opções na aba <a href="#/radio">Rádio e segurança</a>. Em travessia oceânica, o “hospital” são as pessoas que estão no barco.' },
        { t: 'p', html: 'No porto, uma dor forte vira ambulância. No meio do Atlântico, vira horas ou dias de espera. Por isso, a saúde a bordo é feita de três camadas: <b>prevenir</b>, <b>tratar o que der</b> com o kit e o conhecimento da tripulação, e <b>pedir ajuda médica a distância</b> (aula seguinte). A parte mais barata e mais eficaz é a primeira.' },
        { t: 'h', txt: 'Prevenção antes da largada' },
        { t: 'lista', itens: [
          '<b>Consulta médica e dentista</b> de todos, semanas antes. Dor de dente e cálculo renal viram emergência no meio do oceano.',
          '<b>Vacinas em dia</b> (confira o calendário e as exigências de saúde dos países por onde vai passar, no site da Anvisa e dos países de destino).',
          '<b>Ficha de saúde por tripulante:</b> alergias, medicamentos de uso contínuo, tipo sanguíneo, contatos, doenças crônicas. Guarde uma cópia plastificada no barco.',
          '<b>Óculos e lentes de reserva</b> para quem usa.',
          '<b>Protetor solar, chapéu, roupa com proteção UV</b> e repelente: a pele sofre em semanas de mar.',
        ] },
        { t: 'h', txt: 'Três níveis de kit' },
        { t: 'figura', svg: S('m7kit', 'Três níveis do material de saúde a bordo: bolso do cockpit, kit de primeiros socorros e farmácia de travessia com manual', '0 0 520 250',
          '<rect x="20" y="20" width="480" height="60" rx="10" fill="var(--sea-1)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="36" y="44" font-size="15" font-weight="700" fill="currentColor">1. Bolso do cockpit</text>' +
          '<text x="36" y="66" font-size="13" fill="currentColor">curativos, protetor solar, antisséptico, tesoura: o que se usa todo dia</text>' +
          '<rect x="20" y="95" width="480" height="60" rx="10" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="36" y="119" font-size="15" font-weight="700" fill="currentColor">2. Kit de primeiros socorros do barco</text>' +
          '<text x="36" y="141" font-size="13" fill="currentColor">curativos grandes, ataduras, talas, torniquete, termômetro, luvas, manual</text>' +
          '<rect x="20" y="170" width="480" height="64" rx="10" fill="var(--sea-3)" stroke="var(--magenta)" stroke-width="2"/>' +
          '<text x="36" y="194" font-size="15" font-weight="700" fill="currentColor">3. Farmácia de travessia</text>' +
          '<text x="36" y="216" font-size="13" fill="currentColor">medicamentos receitados pelo médico + guia da OMS + lista com validades</text>', 560),
          legenda: 'O nível 3 não se improvisa na farmácia da esquina: é montado com um médico, com base no guia da OMS.' },
        { t: 'h', txt: 'O mínimo da norma brasileira' },
        { t: 'fato', ref: 'radio-92', html: 'A NORMAM-211 recomenda que embarcações de mar aberto com menos de 15 pessoas tenham a caixa de medicamentos (item I do Anexo 4-C) e põe no comandante a responsabilidade pelos medicamentos e material de primeiros socorros.' },
        { t: 'fato', ref: 'extra-travessia-2-09', html: 'O Anexo 4-C lista a caixa de medicamentos mínima (paracetamol, álcool 70%, loção de calamina, antissépticos, água oxigenada, xilocaína gel, entre outros), correlatos (curativos, tesoura, termômetro, torniquete, talas, ataduras) e um manual de primeiros socorros.' },
        { t: 'p', html: 'Essa lista é um <b>mínimo</b>, pensado para navegação de curta duração. Uma travessia oceânica de semanas, longe de qualquer hospital, pede mais: tratamento de infecções, dores fortes, vômitos, alergias, ferimentos que precisam de sutura ou cola cirúrgica, e instruções para cada item.' },
        { t: 'h', txt: 'A referência internacional' },
        { t: 'fato', ref: 'travessia-121', html: 'O International Medical Guide for Ships (OMS), “including the ship’s medicine chest”, está na 3ª edição, registrada no repositório IRIS da OMS com data de 2007.' },
        { t: 'fato', ref: 'travessia-123', html: 'A 3ª edição do IMGS orienta diagnóstico, tratamento e prevenção de problemas de saúde a bordo, sobretudo para tripulantes responsáveis pelos cuidados médicos em navios sem médico, com ênfase nas primeiras 48 horas após a lesão.' },
        { t: 'fato', ref: 'travessia-124', html: 'A OMS publicou em 2010 o “Quantification addendum” do IMGS, com quantidades recomendadas dos medicamentos.' },
        { t: 'p', html: 'Leve o guia impresso e uma cópia em formato eletrônico. O guia foi escrito para navios mercantes, e muitos veleiristas o adaptam a barcos pequenos com a ajuda de um médico, que também prescreve as doses e verifica interações com os remédios de cada tripulante. <b>Não existe lista de remédios confiável sem avaliação médica individual.</b>' },
        { t: 'fato', ref: 'travessia-21', html: 'Todas as categorias das OSR exigem manual e kit de primeiros socorros, cujo conteúdo deve refletir as condições prováveis, a duração da travessia e o número de tripulantes.' },
        { t: 'h', txt: 'Manutenção do kit' },
        { t: 'lista', itens: [
          'Inventário em uma folha: item, quantidade, validade, onde está.',
          'Cheque as validades antes de cada travessia e substitua o vencido.',
          'Guarde em recipiente estanque, longe de calor e umidade, que são inimigos dos medicamentos.',
          'Remédios controlados e injetáveis exigem receita; leve a receita e as caixas originais, pois alfândegas e portos podem pedir.',
          'Todos sabem onde está o kit; o responsável pela saúde mantém uma ficha legível por paciente, com o que foi dado e quando.',
        ] },
        { t: 'check', questoes: [
          Q('trav2-m7-l1-q1', 'Travessia: saúde', 1, 'Qual publicação da OMS é a referência para tratar problemas de saúde a bordo de navios sem médico?',
            ['International Medical Guide for Ships (IMGS), com o addendum de quantidades de 2010.', 'Manual Merck de bolso, 5ª edição.', 'Código Internacional de Sinais.', 'Manual de Primeiros Socorros da Marinha, de 1950.'], 0,
            'O IMGS (3ª edição, 2007) é o guia da OMS para navios sem médico, e o addendum de 2010 traz as quantidades de cada medicamento. Os demais não são os guias oficiais citados.', 'OMS, IMGS 3ª ed.; fatos travessia-121 a 124', 'https://iris.who.int/handle/10665/43814'),
          Q('trav2-m7-l1-q2', 'Travessia: saúde', 2, 'A caixa de medicamentos do Anexo 4-C da NORMAM-211 é suficiente para uma travessia oceânica de semanas?',
            ['Não: é uma dotação mínima de referência; a travessia pede um kit maior montado com orientação médica.', 'Sim: a norma foi escrita para travessias oceânicas.', 'Sim, desde que o comandante complemente com remédios sem receita.', 'Não é necessário kit se houver telefone satelital a bordo.'], 0,
            'A NORMAM trata a caixa como recomendação mínima para embarcações de mar aberto com menos de 15 pessoas. O comandante é responsável pelo material, e as OSR pedem que o conteúdo reflita a duração da viagem. Telefone não substitui remédio.', 'NORMAM-211, Anexo 4-C; fatos radio-92 e travessia-21'),
          Q('trav2-m7-l1-q3', 'Travessia: saúde', 2, 'Quem deve definir doses e quantidades dos medicamentos do kit de travessia?',
            ['Um médico, com base no IMGS e nos tripulantes (alergias, remédios em uso).', 'O dono do barco, pela lista de um fórum de velejadores.', 'O vendedor da farmácia, por ser o mais barato.', 'O tripulante mais velho, pela experiência.'], 0,
            'Doses e interações dependem da pessoa; só quem prescreve pode ajustar. Listas de fórum e a experiência de outros não consideram alergias e doenças dos seus tripulantes.', 'OMS, IMGS; fato travessia-123'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'OMS, <i>International Medical Guide for Ships</i>, 3ª ed. (2007) e addendum de quantidades (2010)', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-121' },
          { txt: 'NORMAM-211/DPC, Anexo 4-C: dotação de medicamentos e materiais de primeiros socorros', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-09' },
          { txt: 'World Sailing, OSR 2026-2027: manual e kit de primeiros socorros', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-21' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Orientação médica à distância: rádio, satélite e SALVAMAR', minutos: 10,
      objetivos: [
        'Saber a quem pedir orientação médica no mar e por quais meios.',
        'Explicar o papel do SALVAMAR e do telefone 185 em casos de doença a bordo.',
        'Preparar as informações do paciente antes de chamar.',
      ],
      blocos: [
        { t: 'p', html: 'Mesmo com um bom kit, você vai querer falar com um médico. A telemedicina marítima faz isso: o tripulante descreve sintomas, o médico orienta o tratamento e, se preciso, coordena a evacuação. O modelo de curso de primeiros socorros das OSR, por exemplo, inclui uma sessão sobre isso.' },
        { t: 'fato', ref: 'travessia-125', html: 'O modelo de curso de primeiros socorros das OSR (Apêndice H) inclui sessão de telemedicina (serviços de orientação médica por órgãos oficiais, rádio ou telefone) e cita o International Medical Guide for Ships como leitura.' },
        { t: 'h', txt: 'No Brasil: o SALVAMAR' },
        { t: 'fato', ref: 'travessia-104', html: 'SALVAMAR é o Serviço de Busca e Salvamento da Marinha do Brasil, atribuição dada pela Lei nº 7.273/1984.' },
        { t: 'fato', ref: 'travessia-108', html: 'Entre as emergências atendidas pelo SALVAMAR estão pessoas que adoecem a bordo e precisam de orientação médica ou de evacuação médica para hospital em terra.' },
        { t: 'fato', ref: 'travessia-106', html: 'O SALVAMAR é alertado pelo telefone 185 (ou telefones das organizações militares da Marinha), pelo GMDSS, por alertas de navios SOLAS e pela RENEC (Embratel, VHF e HF).' },
        { t: 'fato', ref: 'travessia-105', html: 'A região SAR marítima atribuída ao Brasil pela Convenção de Hamburgo vai do litoral até o meridiano de 10°W, cerca de 1,6 vez o território nacional.' },
        { t: 'fato', ref: 'travessia-107', html: 'A região SAR marítima brasileira tem centros regionais: SALVAMAR SUL (Rio Grande), SUL SUESTE (São Paulo), SUESTE (Rio de Janeiro), LESTE (Salvador), NORDESTE (Natal) e NORTE (Belém).' },
        { t: 'figura', svg: S('m7sar', 'Mapa esquemático da região SAR brasileira: do litoral até o meridiano de 10 graus oeste, com os seis centros regionais do SALVAMAR', '0 0 520 300',
          '<rect x="0" y="0" width="520" height="300" fill="var(--sea-1)"/>' +
          '<path d="M0 0 L190 0 L190 12 Q170 40 158 70 Q140 100 128 130 Q112 160 106 190 Q96 220 70 250 L0 260 Z" fill="var(--land)" stroke="currentColor" stroke-width="1"/>' +
          '<line x1="400" y1="10" x2="400" y2="290" stroke="var(--magenta)" stroke-width="2.5" stroke-dasharray="7 5"/>' +
          '<text x="408" y="30" font-size="14" fill="var(--magenta)">10°W</text>' +
          '<text x="300" y="236" font-size="14" text-anchor="middle" fill="currentColor">Região SAR do Brasil</text>' +
          '<text x="300" y="254" font-size="13" text-anchor="middle" fill="currentColor">(litoral até 10°W)</text>' +
          '<g font-size="13" fill="currentColor"><circle cx="158" cy="62" r="5"/><text x="168" y="66">Norte (Belém)</text>' +
          '<circle cx="186" cy="94" r="5"/><text x="198" y="98">Nordeste (Natal)</text>' +
          '<circle cx="148" cy="148" r="5"/><text x="160" y="152">Leste (Salvador)</text>' +
          '<circle cx="112" cy="196" r="5"/><text x="124" y="200">Sueste (Rio)</text>' +
          '<circle cx="96" cy="222" r="5"/><text x="108" y="226">Sul-Sueste (SP)</text>' +
          '<circle cx="72" cy="252" r="5"/><text x="84" y="256">Sul (Rio Grande)</text></g>', 560),
          legenda: 'Esquema, fora de escala: a costa foi desenhada de forma simplificada. Fonte dos centros e do limite: SALVAMAR (Marinha do Brasil).' },
        { t: 'h', txt: 'Outros serviços de telemedicina' },
        { t: 'p', html: 'Fora da região SAR brasileira, a orientação vem do centro de busca e salvamento do país da área, ou de serviços de assistência médica marítima. Um dos mais conhecidos é o <b>CIRM</b> (Centro Internazionale Radio Medico, em Roma), que presta assistência médica a distância a navios, 24 horas por dia. Confirme com o próprio serviço quem pode usá-lo e em que condições (inclusive custo), e guarde os contatos atuais antes de largar, pois números de telefone e e-mail mudam.' },
        { t: 'fato', ref: 'extra-fechamento-cvtr-09', html: 'O CIRM (Roma) presta assistência médica a distância a navios, 24 horas por dia, e coordena a transferência de pacientes para hospitais em terra. Quem pode usar o serviço e a que custo não está confirmado: pergunte ao CIRM.' },
        { t: 'h', txt: 'Como pedir: o rádio e o satélite' },
        { t: 'lista', itens: [
          'Se o paciente precisa de <b>orientação</b> e não há risco imediato de vida: use a chamada de urgência (<b>Pan-Pan</b>) no VHF ou na frequência de socorro de HF, ou ligue pelo telefone satelital.',
          'Se a vida está em risco e é preciso <b>ajuda imediata</b> (parada cardíaca, hemorragia sem controle, acidente grave): <b>Mayday</b> e, se necessário, acione o DSC de socorro e a EPIRB.',
          'No Brasil, ligue <b>185</b> (SALVAMAR) quando houver sinal de telefone; em alto-mar use o satélite ou o HF.',
        ] },
        { t: 'termos', ids: ['pan-pan', 'mayday', 'salvamar', 'gmdss', 'dsc'] },
        { t: 'h', txt: 'O que dizer ao médico' },
        { t: 'lista', ordenada: true, itens: [
          'Nome do barco, posição (latitude e longitude), rumo e velocidade, distância ao porto mais próximo.',
          'Idade, sexo e peso do paciente; alergias; remédios em uso; doenças prévias.',
          'O que aconteceu, quando começou, como evoluiu.',
          'Sinais vitais: pulso, respiração, temperatura, nível de consciência, dor (0 a 10).',
          'O que já foi feito e o que o kit tem à mão.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Ensaie a conversa', html: 'Um tripulante nervoso esquece detalhes. Imprima uma ficha de “chamada médica” com esses itens e guarde-a no kit. Anote as respostas do médico por escrito e releia de volta para ter certeza de que entendeu.' },
        { t: 'check', questoes: [
          Q('trav2-m7-l2-q1', 'Travessia: saúde', 1, 'Um tripulante adoece em alto-mar, a 600 milhas do porto, sem risco imediato de vida. Qual é a primeira atitude coerente?',
            ['Pedir orientação médica pelo rádio ou satélite (Pan-Pan ou telefone), informando posição e sintomas.', 'Ignorar até o porto, por ser caro pedir ajuda.', 'Acionar a EPIRB sem conversar com ninguém.', 'Pedir ao paciente que fique em jejum por tempo indeterminado.'], 0,
            'Orientação por Pan-Pan ou satélite é o primeiro passo quando não há risco imediato de vida. A EPIRB é para situações de perigo grave; ignorar o problema ou prescrever jejum sem orientação pode agravar o caso.', 'SALVAMAR; fatos travessia-106 e travessia-108'),
          Q('trav2-m7-l2-q2', 'Travessia: saúde', 2, 'Qual é o telefone do SALVAMAR (Serviço de Busca e Salvamento da Marinha do Brasil)?',
            ['185', '192', '190', '193'], 0,
            'O 185 aciona o SALVAMAR, a busca e salvamento da Marinha. O 192 é o SAMU, o 190 a polícia e o 193 os bombeiros: são serviços de terra, que não coordenam socorro no mar.', 'SALVAMAR (Marinha do Brasil); fato travessia-106', 'https://www.marinha.mil.br/salvamarbrasil/node/49'),
          Q('trav2-m7-l2-q3', 'Travessia: saúde', 2, 'Até que meridiano vai a região SAR marítima atribuída ao Brasil pela Convenção de Hamburgo?',
            ['10°W', '20°W', '30°W', '0° (Greenwich)'], 0,
            'A região SAR brasileira vai do litoral ao meridiano de 10°W. 20°W é o limite da NAVAREA V e da METAREA V (meteorologia e avisos), que são áreas diferentes da região de busca e salvamento.', 'SALVAMAR; fato travessia-105', 'https://www.marinha.mil.br/salvamarbrasil/node/49'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'Marinha do Brasil, SALVAMAR: serviço, região SAR e centros regionais', url: 'https://www.marinha.mil.br/salvamarbrasil/node/49', ref: 'travessia-104' },
          { txt: 'World Sailing, OSR 2026-2027, Apêndice H: modelo de curso de primeiros socorros (telemedicina)', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf', ref: 'travessia-125' },
          { txt: 'Assistência médica marítima do CIRM (Roma): resumo em <i>International Maritime Health</i>, “Eighty years of CIRM”', url: 'https://journals.viamedica.pl/international_maritime_health/article/view/47451', ref: 'extra-fechamento-cvtr-09' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Enjoo, desidratação, sol e calor', minutos: 10,
      objetivos: [
        'Reconhecer e manejar o enjoo (cinetose) antes que ele derrube a tripulação.',
        'Prevenir e reconhecer desidratação e exposição excessiva ao sol.',
        'Saber quando um quadro leve vira motivo para chamar ajuda médica.',
      ],
      blocos: [
        { t: 'p', html: 'Em uma travessia, os problemas de saúde mais comuns não são os dramáticos. São o enjoo, a desidratação e a queimadura de sol. Parecem pequenos, mas derrubam a tripulação, tiram gente dos quartos e podem virar emergência. A boa notícia: quase todos são evitáveis.' },
        { t: 'termos', ids: ['enjoo', 'cinetose', 'mareio'] },
        { t: 'h', txt: 'Enjoo (cinetose)' },
        { t: 'p', html: 'O enjoo vem do conflito entre o que o ouvido interno sente (o balanço) e o que os olhos veem (o barco “parado” em volta). Costuma ser pior nos primeiros dois a três dias e depois o corpo se adapta, mas varia muito de pessoa para pessoa. Quem nunca enjoou também pode enjoar.' },
        { t: 'lista', itens: [
          '<b>Antes de largar:</b> durma bem, coma leve, evite álcool e comida muito gordurosa. Converse com o médico sobre medicação preventiva, que costuma funcionar melhor <b>antes</b> do sintoma e tem efeitos colaterais (sono, boca seca). Teste a medicação num passeio antes da travessia.',
          '<b>No mar:</b> fique no ar livre, olhe o horizonte, sente-se na parte central do barco (onde o movimento é menor) e evite ler ou olhar telas e mapas por muito tempo.',
          '<b>Pequenas refeições:</b> o estômago vazio piora. Biscoito salgado, maçã e água ajudam.',
          '<b>Tarefa:</b> quem governa costuma enjoar menos, porque o cérebro antecipa o movimento.',
          '<b>Vômito:</b> faça sempre a favor do vento (sotavento) e engatado, nunca debruçado sobre a borda sem arnês.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Vomitar é perda de água', html: 'O enjoo forte leva à desidratação em horas. Se a pessoa não retém líquido nem por goles pequenos, ou passa muitas horas sem urinar, chame orientação médica por rádio ou satélite.' },
        { t: 'h', txt: 'Desidratação' },
        { t: 'p', html: 'No calor, na umidade e no esforço o corpo perde muita água, e o vento seca o suor sem a pessoa perceber. A sede chega tarde. Um bom sinal é a <b>cor da urina</b>: clara é bom, amarelo-escura é sinal de alerta. Outros sinais são dor de cabeça, boca seca, tontura, cansaço fora do normal e pouca urina.' },
        { t: 'lista', itens: [
          'Beba água em pequenos goles durante o dia todo; adote uma garrafa por pessoa.',
          'Planeje a água por pessoa e por dia com folga (veja o módulo de provisões).',
          'Em caso de vômito ou diarreia, use sais de reidratação oral (compre sachês na farmácia e prepare conforme o rótulo).',
          'Nunca beba água do mar: o sal piora a desidratação.',
          'Não dependa só de água de dessalinizador: tenha reserva armazenada.',
        ] },
        { t: 'h', txt: 'Sol e calor' },
        { t: 'p', html: 'A radiação solar no oceano é intensa, e a água reflete parte dela. Use chapéu de aba larga, óculos escuros com proteção UV, camisa de manga longa leve e protetor solar de fator alto, reaplicado várias vezes ao dia. A queimadura solar é dolorosa e pode atrapalhar o sono e o trabalho por dias.' },
        { t: 'tabela', cab: ['Quadro', 'Sinais', 'O que fazer'], linhas: [
          ['Esgotamento pelo calor', 'Suor intenso, pele fria e úmida, fraqueza, tontura, dor de cabeça, náusea', 'Sombra, deitar, refrescar, água em goles; se não melhora, pedir orientação médica'],
          ['Insolação (grave)', 'Pele quente e seca ou vermelha, confusão mental, pulso rápido, desmaio', 'Emergência: esfriar o corpo com água, ventilar, chamar socorro médico pelo rádio'],
        ], legenda: 'Resumo educativo. Sinais de confusão mental ou perda de consciência são emergência: ajuda imediata.' },
        { t: 'callout', tipo: 'dica', titulo: 'Diário de saúde', html: 'Anote por tripulante, de forma rápida: o que comeu, quanto bebeu, se urinou, se vomitou, a temperatura se estiver mal. Quando precisar falar com um médico, esse registro vale ouro.' },
        { t: 'check', questoes: [
          Q('trav2-m7-l3-q1', 'Travessia: saúde', 1, 'Qual medida costuma ajudar quem está enjoado a bordo?',
            ['Ficar ao ar livre, olhar o horizonte, ficar na parte central do barco e comer pouco e leve.', 'Ler a carta náutica por longos períodos no cockpit.', 'Descer para a cabine fechada e fechar os olhos.', 'Beber álcool para relaxar.'], 0,
            'O ar livre e o horizonte ajudam o cérebro a conciliar o que vê com o que sente. A cabine fechada, a leitura e o álcool pioram o enjoo (e o álcool desidrata).', 'Cruz Vermelha / RYA First Aid; OMS IMGS'),
          Q('trav2-m7-l3-q2', 'Travessia: saúde', 2, 'Qual é um bom indicador prático, a bordo, de que alguém está desidratado?',
            ['Urina escura e pouca, junto de dor de cabeça e tontura.', 'Pele muito pálida e fria apenas.', 'Sede intensa só depois de uma hora de sol.', 'Pulsação lenta e sono tranquilo.'], 0,
            'A cor escura e a pouca urina indicam que o corpo está poupando água; dor de cabeça e tontura se somam. A sede aparece tarde e a pulsação lenta não é sinal típico.', 'OMS, IMGS; Cruz Vermelha'),
          Q('trav2-m7-l3-q3', 'Travessia: saúde', 2, 'Um tripulante no cockpit está com a pele quente e seca, confuso e com pulso rápido. Qual é a conduta?',
            ['Tratar como emergência: levar à sombra, esfriar o corpo e pedir socorro médico pelo rádio.', 'Dar café e deixá-lo dormir ao sol.', 'Ignorar: é só cansaço de quarto.', 'Dar água do mar para repor sais.'], 0,
            'Pele quente e seca com confusão sugere insolação, quadro grave que exige resfriar e pedir ajuda. Café, sol e água do mar pioram, e chamar de cansaço pode custar a vida.', 'OMS, IMGS; Cruz Vermelha (FICR)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'OMS, <i>International Medical Guide for Ships</i>, 3ª ed.: cinetose, desidratação e doenças por calor', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-121' },
          { txt: 'RYA First Aid: enjoo, desidratação e hipotermia (conteúdo do curso)', url: 'https://www.rya.org.uk/course-finder/first-aid-course/', ref: 'radio-89' },
          { txt: 'Aplicativo de primeiros socorros da Cruz Vermelha (FICR), indicado pela NORMAM-211', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'radio-93' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Lesões e doenças comuns a bordo', minutos: 12,
      objetivos: [
        'Reconhecer as lesões mais comuns em veleiro (cortes, queimaduras, mãos, quedas) e prestar o primeiro atendimento.',
        'Identificar sinais de alerta que exigem orientação médica ou evacuação.',
        'Cuidar de infecções de pele e pequenos ferimentos no ambiente úmido e salgado.',
      ],
      blocos: [
        { t: 'callout', tipo: 'seguranca', titulo: 'Este texto é de apoio, não um curso', html: 'Aprenda com instrutor: RCP, hemorragia, fraturas e afogamento se treinam com as mãos. Veja a aba <a href="#/radio">Rádio e segurança</a>.' },
        { t: 'p', html: 'Os acidentes em veleiro seguem um padrão: mãos presas em cabos e catracas, quedas no convés molhado, batidas da retranca e da cabeça nos tetos baixos, queimaduras na cozinha em movimento. Quase todos são prevenidos por regras simples: luvas, engate, calçado de sola aderente, cuidado com a retranca.' },
        { t: 'tabela', cab: ['Situação', 'Primeiro atendimento', 'Peça orientação médica se…'], linhas: [
          ['Corte pequeno', 'Lavar com água limpa, pressionar com gaze, curativo', 'Sangramento não para em 10 minutos, corte profundo, ou sinais de infecção'],
          ['Hemorragia grande', 'Pressão direta firme e contínua com gaze; elevar o membro; se não controla um sangramento de braço ou perna que ameaça a vida, usar o torniquete do kit (treine antes)', 'Sempre: é emergência'],
          ['Queimadura (fogão, água fervente)', 'Resfriar em água corrente limpa; não furar bolhas; cobrir sem apertar', 'Queimadura grande, no rosto, nas mãos ou profunda'],
          ['Entorse e suspeita de fratura', 'Imobilizar com tala, gelo envolto em pano, elevar', 'Deformidade, membro frio ou sem sensibilidade'],
          ['Pancada na cabeça', 'Observar por horas: consciência, vômitos, sonolência', 'Perda de consciência, confusão, vômito repetido, sangramento pelo ouvido ou nariz'],
          ['Corpo estranho no olho', 'Enxaguar com água limpa; não esfregar', 'Dor forte, visão turva, objeto fixado'],
          ['Dor abdominal forte', 'Repouso, observar febre, vômitos, localização da dor', 'Dor que piora, abdômen duro, febre: pode ser emergência cirúrgica'],
          ['Reação alérgica', 'Afastar a causa, antialérgico do kit, se prescrito; se a pessoa tem adrenalina autoinjetável prescrita, use-a na hora e peça socorro', 'Falta de ar, inchaço de lábios ou língua: emergência'],
        ], legenda: 'Guia resumido de apoio à decisão. Orientações detalhadas e doses: IMGS (OMS) e médico. Em dúvida, peça ajuda.' },
        { t: 'h', txt: 'Mãos e cabos' },
        { t: 'p', html: 'Use luvas de vela em manobras com cabos sob carga, nunca enrole um cabo em torno da mão e não ponha a mão entre o cabo e a catraca. Uma pessoa que perde a ponta de um dedo no meio do Atlântico pode precisar de evacuação, e isso se evita com disciplina.' },
        { t: 'h', txt: 'Infecções de pele' },
        { t: 'p', html: 'O mar e o suor mantêm a pele úmida e salgada. Pequenos cortes demoram a cicatrizar e infeccionam fácil. Lave e seque, aplique antisséptico, mantenha o curativo limpo e troque-o ao molhar. Vermelhidão que se espalha, calor local, pus, febre ou uma linha vermelha subindo pelo membro exigem orientação médica rápida.' },
        { t: 'h', txt: 'Hipotermia e afogamento' },
        { t: 'p', html: 'No trópico a água é morna, mas em rotas de volta pelo Atlântico Norte (Açores, por exemplo) e em noites molhadas e ventosas, a hipotermia é possível. Hipotermia e homem ao mar fazem parte dos tópicos de treinamento exigidos pela OSR 6.02, junto com combate a incêndio e abandono do barco.' },
        { t: 'fato', ref: 'radio-75', html: 'A OSR 6.02 lista 15 tópicos de treinamento, entre eles comunicações de emergência (teoria e prática), balsa salva-vidas e abandono, hipotermia, homem ao mar, combate a incêndio e organização de busca e salvamento.' },
        { t: 'fato', intl: true, ref: 'radio-89', html: 'O RYA First Aid tem 1 dia em sala, é aprovado pela MCA e cobre RCP com protocolo de afogamento, hipotermia, enjoo e desidratação, pedido de ajuda médica por VHF e resgate por helicóptero.' },
        { t: 'h', txt: 'RCP' },
        { t: 'p', html: 'A ressuscitação cardiopulmonar (RCP) é a habilidade que mais pode salvar uma vida em uma parada cardíaca, e só se aprende praticando. No mar não há ambulância em 10 minutos, e por isso a OSR pede que parte da tripulação tenha certificado de primeiros socorros. Guarde no kit um cartão com o passo a passo da RCP e conheça o aplicativo de primeiros socorros da Cruz Vermelha, indicado pela própria NORMAM-211.' },
        { t: 'fato', ref: 'radio-93', html: 'A NORMAM-211 indica o aplicativo FICR da Cruz Vermelha como fonte de orientações de primeiros socorros.' },
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Cursos reconhecidos no Brasil', html: 'Em 07/10/2026, a lista da World Sailing de cursos de primeiros socorros reconhecidos por federações nacionais não incluía o Brasil; a via prevista na OSR 6.05.2 é o treinamento STCW de primeiros socorros elementares (A-VI/1-3) ou superior. Confira a lista atual antes de se inscrever.' },
        { t: 'fato', ref: 'travessia-45', html: 'Em 07/10/2026, a lista de cursos de primeiros socorros reconhecidos por federação nacional na página da World Sailing não inclui o Brasil; resta a via STCW A-VI/1-3 prevista na OSR 6.05.2.' },
        { t: 'check', questoes: [
          Q('trav2-m7-l4-q1', 'Travessia: saúde', 1, 'Qual é o primeiro atendimento correto para uma queimadura pequena na cozinha?',
            ['Resfriar com água corrente limpa, cobrir sem apertar e não furar as bolhas.', 'Passar manteiga ou pasta de dente.', 'Furar as bolhas com agulha.', 'Cobrir com gelo diretamente na pele por muito tempo.'], 0,
            'Água corrente limpa resfria sem agredir. Manteiga e pasta retêm calor e sujam, furar bolhas abre porta para infecção e gelo direto pode lesionar a pele.', 'OMS, IMGS; Cruz Vermelha'),
          Q('trav2-m7-l4-q2', 'Travessia: saúde', 2, 'Qual destes sinais, num ferimento infeccionado, exige orientação médica rápida?',
            ['Vermelhidão que se espalha, pus e febre, ou uma linha vermelha subindo pelo membro.', 'Uma crosta pequena e seca.', 'Coceira leve ao redor do curativo, sem vermelhidão.', 'Cicatriz já fechada.'], 0,
            'Vermelhidão progressiva, pus, febre e a linha vermelha indicam infecção que pode se espalhar. Os outros sinais são comuns na cicatrização normal.', 'OMS, IMGS'),
          Q('trav2-m7-l4-q3', 'Travessia: saúde', 2, 'Qual alternativa descreve a exigência de primeiros socorros da OSR 6.05.2 para a Categoria 1?',
            ['Pelo menos dois tripulantes com certificado de primeiros socorros feito nos últimos 5 anos.', 'Todos os tripulantes com certificado de médico.', 'Apenas o comandante, com um curso de 10 anos atrás.', 'Nenhum certificado, basta o kit.'], 0,
            'A OSR 6.05.2 pede pelo menos dois tripulantes com certificado dos últimos 5 anos na Categoria 1. Não exige médicos nem dispensa certificado, e um curso muito antigo não vale.', 'OSR 6.05.2; fatos radio-81 e travessia-43', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: OSR 6.02 e 6.05', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'radio-75' },
          { txt: 'RYA First Aid (curso aprovado pela MCA)', url: 'https://www.rya.org.uk/course-finder/first-aid-course/', ref: 'radio-89' },
          { txt: 'OMS, <i>International Medical Guide for Ships</i>, 3ª ed.', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-121' },
        ] },
      ],
    },
    {
      id: 'l5', titulo: 'Quando desviar a rota ou pedir evacuação', minutos: 10,
      objetivos: [
        'Avaliar a gravidade de um problema de saúde e decidir entre tratar a bordo, desviar ou pedir evacuação.',
        'Escolher portos de escape ao longo da rota antes de largar.',
        'Preparar a evacuação médica com segurança.',
      ],
      blocos: [
        { t: 'p', html: 'A decisão de desviar não é de saúde apenas: envolve distância, tempo, vento, mar e o que ainda pode ser feito a bordo. É melhor decidir cedo, com calma, do que tarde, com um paciente em estado crítico. Cabe ao comandante, ouvindo o médico à distância.' },
        { t: 'h', txt: 'Um fluxo de decisão' },
        { t: 'figura', svg: S('m7dec', 'Fluxo de decisão para um problema de saúde a bordo: avaliar risco de vida, pedir orientação médica, tratar, reavaliar, desviar ou pedir evacuação', '0 0 520 330',
          '<defs><marker id="m7dec-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>' +
          '<rect x="150" y="10" width="220" height="42" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="260" y="36" font-size="14" text-anchor="middle" fill="currentColor">Problema de saúde a bordo</text>' +
          '<line x1="260" y1="52" x2="260" y2="76" stroke="currentColor" stroke-width="1.5" marker-end="url(#m7dec-a)"/>' +
          '<rect x="130" y="78" width="260" height="46" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="260" y="98" font-size="14" text-anchor="middle" fill="currentColor">Risco imediato de vida?</text><text x="260" y="116" font-size="13" text-anchor="middle" fill="currentColor">(parada, hemorragia, falta de ar)</text>' +
          '<line x1="130" y1="101" x2="60" y2="101" stroke="var(--magenta)" stroke-width="2"/><line x1="60" y1="101" x2="60" y2="150" stroke="var(--magenta)" stroke-width="2" marker-end="url(#m7dec-a)"/><text x="94" y="94" font-size="13" fill="var(--magenta)">sim</text>' +
          '<rect x="10" y="152" width="170" height="64" rx="8" fill="var(--nav-red)" fill-opacity=".28" stroke="currentColor"/><text x="95" y="176" font-size="14" text-anchor="middle" fill="currentColor">Mayday e DSC</text><text x="95" y="196" font-size="13" text-anchor="middle" fill="currentColor">primeiros socorros já</text>' +
          '<line x1="260" y1="124" x2="260" y2="152" stroke="currentColor" stroke-width="1.5" marker-end="url(#m7dec-a)"/><text x="268" y="144" font-size="13" fill="currentColor">não</text>' +
          '<rect x="170" y="154" width="180" height="46" rx="8" fill="var(--sea-1)" stroke="currentColor"/><text x="260" y="174" font-size="14" text-anchor="middle" fill="currentColor">Pan-Pan ou satélite:</text><text x="260" y="192" font-size="13" text-anchor="middle" fill="currentColor">orientação médica</text>' +
          '<line x1="260" y1="200" x2="260" y2="226" stroke="currentColor" stroke-width="1.5" marker-end="url(#m7dec-a)"/>' +
          '<rect x="170" y="228" width="180" height="42" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="260" y="254" font-size="14" text-anchor="middle" fill="currentColor">Tratar e reavaliar</text>' +
          '<line x1="350" y1="249" x2="400" y2="249" stroke="currentColor" stroke-width="1.5" marker-end="url(#m7dec-a)"/>' +
          '<rect x="402" y="214" width="108" height="72" rx="8" fill="var(--shoal)" stroke="var(--magenta)" stroke-width="2"/><text x="456" y="238" font-size="13" text-anchor="middle" fill="currentColor">Piorou ou</text><text x="456" y="256" font-size="13" text-anchor="middle" fill="currentColor">sem melhora:</text><text x="456" y="274" font-size="13" text-anchor="middle" fill="currentColor">desviar/evacuar</text>' +
          '<line x1="260" y1="270" x2="260" y2="304" stroke="currentColor" stroke-width="1.5" marker-end="url(#m7dec-a)" stroke-dasharray="4 3"/><text x="270" y="318" font-size="13" fill="currentColor">melhorou: anote e siga monitorando</text>', 560),
          legenda: 'Fluxo educativo: a decisão final é do comandante, com orientação do médico à distância.' },
        { t: 'h', txt: 'Portos de escape' },
        { t: 'p', html: 'Antes de largar, anote ao longo da rota os <b>portos de escape</b>: onde há marina ou fundeadouro seguro, hospital e entrada possível em qualquer tempo. Calcule a distância de cada trecho. Alguns exemplos de distâncias entre portos de referência, extraídas da NGA Pub. 151 (rotas de navio, não de veleiro):' },
        { t: 'tabela', cab: ['Trecho', 'Milhas náuticas'], linhas: [
          ['Recife → Fernando de Noronha', '300'],
          ['Natal → Dakar (Senegal)', '1.620'],
          ['Recife → Dakar (Senegal)', '1.717'],
          ['Recife → Bridgetown (Barbados)', '2.054'],
          ['Recife → Las Palmas (Canárias)', '2.453'],
          ['Porto Grande (Mindelo, Cabo Verde) → Santa Cruz de Tenerife', '849'],
        ], legenda: 'NGA Pub. 151: distâncias entre posições centrais dos portos, pelas rotas de navios. Em veleiro, some desvios por vento e correntes.' },
        { t: 'fato', ref: 'travessia-127', html: 'Recife → Fernando de Noronha: 300 milhas náuticas (Pub. 151, NGA).' },
        { t: 'fato', ref: 'travessia-141', html: 'Natal → Dakar (Senegal): 1.620 milhas náuticas (Pub. 151, NGA).' },
        { t: 'fato', ref: 'travessia-130', html: 'Recife → Bridgetown (Barbados): 2.054 milhas náuticas (Pub. 151, NGA).' },
        { t: 'h', txt: 'Evacuação médica' },
        { t: 'lista', itens: [
          '<b>Quem decide:</b> o comandante, ouvido o médico. O SALVAMAR coordena a evacuação para hospital em terra dentro de sua região; fora dela, o centro de salvamento do país competente.',
          '<b>Como é feita:</b> pelo desvio do próprio barco ao porto mais próximo, por transferência para um navio mercante que desvia (a cargo do centro de salvamento), ou por helicóptero, quando estiver ao alcance. Os meios em alto-mar são limitados.',
          '<b>Prepare o paciente e o barco:</b> documentos, medicamentos que ele toma, ficha do caso, colete salva-vidas. Se for helicóptero, siga as instruções da equipe: nunca prenda o cabo do guincho ao barco.',
          '<b>Mantenha o barco seguro:</b> quem fica a bordo precisa de um comandante e de uma escala de quartos reduzida.',
        ] },
        { t: 'h', txt: 'Desviar custa caro, e tudo bem' },
        { t: 'p', html: 'Desviar custa tempo, combustível, dinheiro e, às vezes, a janela de tempo da travessia. É natural querer “segurar mais um pouco”. Combine antes da largada que a saúde de uma pessoa vale mais que o calendário: quem decide desviar não precisa justificar. E registre as decisões no diário de bordo: horário, sintomas, orientação recebida, o que foi feito.' },
        { t: 'lista', itens: [
          '<b>Informação:</b> guarde por escrito os telefones de emergência, o número da apólice do seguro e os contatos do SALVAMAR e de serviços de telemedicina.',
          '<b>Comunicação de rotina:</b> combine contatos diários com alguém em terra (e-mail por satélite, mensagem) com a posição; se você parar de responder, essa pessoa sabe a quem acionar.',
          '<b>Capacidade do barco:</b> um veleiro de cruzeiro pode ter de ficar parado, em panos reduzidos, para uma transferência; esteja preparado para isso.',
        ] },
        { t: 'callout', tipo: 'nota', titulo: 'Seguro-saúde e de evacuação', html: 'Contrate seguro-saúde internacional que cubra navegação oceânica e evacuação, e leia as exclusões (muitas apólices excluem “esportes náuticos de alto-mar”). Guarde o número da apólice e o telefone da central de assistência.' },
        { t: 'check', questoes: [
          Q('trav2-m7-l5-q1', 'Travessia: saúde', 2, 'Qual é a vantagem de listar portos de escape antes de largar?',
            ['Saber, com calma, para onde desviar em caso de doença ou avaria, e a que distância fica cada um.', 'Poder pular as formalidades de entrada.', 'Evitar o uso da EPIRB.', 'Dispensar o kit médico.'], 0,
            'Conhecer portos, distâncias e hospitais antes permite decidir rápido e com informação. Não dispensa as formalidades, nem substitui o kit ou a EPIRB.', 'Boa prática de planejamento; NGA Pub. 151'),
          Q('trav2-m7-l5-q2', 'Travessia: saúde', 2, 'A bordo, um tripulante sofre uma parada cardiorrespiratória. Qual a sequência coerente?',
            ['Iniciar RCP imediatamente e fazer Mayday (inclusive DSC) para ajuda e orientação.', 'Esperar um pouco para ver se melhora e depois ligar pelo rádio.', 'Pedir orientação só quando chegar ao porto.', 'Acionar apenas o rádio de recreio, sem informar posição.'], 0,
            'Parada cardíaca é risco imediato de vida: a RCP começa já e a ajuda é pedida em Mayday. Esperar ou deixar para o porto pode ser fatal; sem posição, ninguém chega.', 'RIPEAM Anexo IV; fato tecnico-84; NORMAM-211 (FICR)'),
          Q('trav2-m7-l5-q3', 'Travessia: saúde', 3, 'Um tripulante tem febre e dor abdominal cada vez mais forte, com abdômen rígido, a 1.000 milhas de qualquer porto. O que fazer?',
            ['Pedir orientação médica de urgência (Pan-Pan ou satélite) e avaliar desvio/evacuação conforme a orientação.', 'Dar o analgésico mais forte do kit e esperar.', 'Fazer a pessoa se esforçar para “espantar” a dor.', 'Esperar até o porto de destino.'], 0,
            'Dor abdominal que piora, com febre e abdômen rígido pode ser emergência cirúrgica. Só um médico, ouvindo os sinais, orienta se há tempo de seguir viagem ou se é preciso desviar. Mascarar a dor ou esperar pode ser perigoso.', 'OMS, IMGS; SALVAMAR (fato travessia-108)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NGA Pub. 151, <i>Distances Between Ports</i>: milhas náuticas entre portos', url: 'https://msi.nga.mil/api/publications/download?key=16694076/SFH00000/Pub151bk.pdf&type=view', ref: 'travessia-127' },
          { txt: 'Marinha do Brasil, SALVAMAR: evacuação médica', url: 'https://www.marinha.mil.br/salvamarbrasil/node/49', ref: 'travessia-108' },
          { txt: 'OMS, <i>International Medical Guide for Ships</i>', url: 'https://iris.who.int/handle/10665/43814', ref: 'travessia-123' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm8', titulo: 'Provisões e rotina a bordo',
  resumo: 'Água, comida, gás e combustível para semanas no mar: como calcular, onde guardar, o que fazer com o lixo (MARPOL) e como organizar um dia a bordo.',
  licoes: [
    {
      id: 'l1', titulo: 'Planejar a água e a comida', minutos: 12,
      objetivos: [
        'Calcular os dias de viagem e a quantidade de água e comida com margem de segurança.',
        'Comparar a água necessária com a capacidade dos tanques do barco.',
        'Escolher alimentos que durem e que a tripulação goste de comer.',
      ],
      blocos: [
        { t: 'p', html: 'Quem fica sem água ou comida no meio do oceano não tem para onde correr. Por isso, as provisões se calculam antes, por escrito, com margem. Não é preciso ser matemático: tudo se resume a uma regra simples.' },
        { t: 'h', txt: 'A conta dos dias' },
        { t: 'p', html: '<b>Dias de viagem = distância ÷ (velocidade média × 24)</b>. A velocidade média inclui calmarias, mudanças de vela e correntes: não use a velocidade máxima do barco. Num cruzeiro de 32 pés (≈9,75 m), por exemplo, uma média de 4 a 5 nós é um ponto de partida razoável para planejar; barcos menores costumam ficar abaixo disso e os maiores, acima (a média real depende do vento, da corrente, do estado do casco e da carga).' },
        { t: 'p', html: 'Depois acrescente uma <b>margem</b> sobre o tempo: calmarias, mau tempo e pernas mais lentas existem. A margem é decisão do comandante; as margens usadas vão de 20% a 50% acima do tempo previsto, e os exemplos deste curso usam 25%. Veja um exemplo com números reais de distância e de rally:' },
        { t: 'tabela', cab: ['Trecho', 'Distância', 'A 5 nós', 'Com 25% de margem'], linhas: [
          ['Recife → Bridgetown (Barbados)', '2.054 mn', '17,1 dias', '21,4 dias'],
          ['Las Palmas → Santa Lúcia (rota ARC)', '2.700 mn', '22,5 dias', '28,1 dias'],
          ['Recife → Fernando de Noronha', '300 mn', '2,5 dias', '3,1 dias'],
        ], legenda: 'Contas nossas, a partir da NGA Pub. 151 (milhas entre portos) e do organizador da ARC. O organizador informa que o barco médio da ARC leva 18 a 21 dias.' },
        { t: 'fato', ref: 'travessia-130', html: 'Recife → Bridgetown (Barbados): 2.054 milhas náuticas (Pub. 151, NGA).' },
        { t: 'fato', ref: 'travessia-47', html: 'A travessia do ARC tem 2.700 milhas náuticas e leva cerca de 18 a 21 dias para o barco médio.' },
        { t: 'h', txt: 'Água' },
        { t: 'p', html: 'A água serve para beber, cozinhar e uma higiene mínima. Cruzeiristas costumam planejar por volta de 3 a 4 litros por pessoa por dia no total (os exemplos deste curso usam 4), e consumo menor ainda é possível com disciplina (lavar a louça com água do mar e enxaguar com pouca água doce). Esse número é uma referência de planejamento, não uma norma: ajuste ao calor e à tripulação.' },
        { t: 'fato', ref: 'travessia-34', html: 'Cat. 1 a 3 das OSR: pelo menos 2 litros de água potável por pessoa para emergência, em recipiente dedicado e lacrado.' },
        { t: 'p', html: 'Esses 2 litros por pessoa são uma <b>reserva de emergência</b> separada, para o caso de os tanques estragarem ou vazarem. Eles não entram na conta do consumo normal.' },
        { t: 'figura', svg: S('m8agua', 'Comparação entre a água necessária para 4 pessoas por 21 dias (336 litros a 4 litros por pessoa por dia) e a capacidade de tanques de um cruzeiro de 32 pés (exemplo)', '0 0 520 260',
          '<line x1="70" y1="14" x2="70" y2="220" stroke="currentColor"/><line x1="70" y1="220" x2="500" y2="220" stroke="currentColor"/>' +
          '<text x="14" y="12" font-size="13" fill="currentColor">litros</text>' +
          '<line x1="66" y1="20" x2="500" y2="20" stroke="var(--sea-3)" stroke-dasharray="3 4"/><text x="40" y="24" font-size="13" text-anchor="end" fill="currentColor">400</text>' +
          '<line x1="66" y1="70" x2="500" y2="70" stroke="var(--sea-3)" stroke-dasharray="3 4"/><text x="40" y="74" font-size="13" text-anchor="end" fill="currentColor">300</text>' +
          '<line x1="66" y1="120" x2="500" y2="120" stroke="var(--sea-3)" stroke-dasharray="3 4"/><text x="40" y="124" font-size="13" text-anchor="end" fill="currentColor">200</text>' +
          '<line x1="66" y1="170" x2="500" y2="170" stroke="var(--sea-3)" stroke-dasharray="3 4"/><text x="40" y="174" font-size="13" text-anchor="end" fill="currentColor">100</text>' +
          '<rect x="110" y="52" width="80" height="168" fill="var(--magenta)" fill-opacity=".75"/><text x="150" y="45" font-size="13" text-anchor="middle" fill="currentColor">336</text>' +
          '<rect x="240" y="140" width="80" height="80" fill="var(--sea-3)"/><text x="280" y="133" font-size="13" text-anchor="middle" fill="currentColor">~160</text>' +
          '<rect x="370" y="115" width="80" height="105" fill="var(--sea-2)" stroke="currentColor"/><text x="410" y="108" font-size="13" text-anchor="middle" fill="currentColor">~210</text>' +
          '<text x="150" y="240" font-size="13" text-anchor="middle" fill="currentColor">necessário</text><text x="280" y="240" font-size="13" text-anchor="middle" fill="currentColor">tanques</text><text x="410" y="240" font-size="13" text-anchor="middle" fill="currentColor">tanques + garrafões</text>', 560),
          legenda: 'Exemplo ilustrativo: 4 pessoas × 4 L × 21 dias = 336 L. Os tanques variam de barco para barco (aqui, um cruzeiro de 32 pés serve de exemplo); os valores de 160 e 210 L são hipotéticos, para mostrar a diferença. Meça os do seu.' },
        { t: 'p', html: 'A conclusão do exemplo é frequente: os tanques raramente bastam. As soluções são <b>reduzir o consumo</b>, levar <b>garrafões extras</b> (bem amarrados e com peso baixo no barco), instalar um <b>dessalinizador</b> (que precisa de energia e manutenção) e <b>coletar chuva</b> com lona ou calha (nos alísios chove em pancadas). Use todas, mas nunca dependa só de uma.' },
        { t: 'widget', w: 'provisoes', opts: { distancia: 2054, velocidade: 5, tripulacao: 4, margem: 25, agua: 4, navegacao: 'oceanica', lembrar: false }, legenda: 'Mude distância, velocidade, margem, tripulação e litros por pessoa e veja os dias e a quantidade de água, gás e combustível. É uma estimativa de planejamento.' },
        { t: 'h', txt: 'Comida' },
        { t: 'lista', itens: [
          '<b>Planeje por refeição:</b> número de refeições por dia × pessoas × dias com margem, mais lanches.',
          '<b>Pense em calorias, não só em volume:</b> trabalho físico e frio pedem mais energia. Arroz, massa, feijão, aveia, castanhas, enlatados e leite UHT dão calorias duráveis.',
          '<b>Variedade:</b> a monotonia derruba o ânimo. Leve temperos, molhos, molhos de tomate e algo doce.',
          '<b>Frescos:</b> frutas e legumes duram dias ou semanas dependendo do tipo (repolho, cebola, abóbora, maçã, laranja e batata duram bem). Coma primeiro os que estragam mais rápido.',
          '<b>Reserva:</b> ração de emergência e itens prontos que não exigem fogo (para dias de mar grosso).',
          '<b>Restrições:</b> alergias, vegetarianos e religiosos, combinados com a tripulação.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Teste o cardápio antes', html: 'Num fim de semana no mar, cozinhe como na travessia. Muita receita bonita falha com o barco adernado e o fogão balançando.' },
        { t: 'check', questoes: [
          Q('trav2-m8-l1-q1', 'Travessia: provisões', 1, 'Um veleiro faz 2.000 milhas a uma média de 5 nós. Quantos dias de viagem previstos, sem margem?',
            ['Cerca de 16,7 dias.', 'Cerca de 8 dias.', 'Cerca de 40 dias.', 'Cerca de 2 dias.'], 0,
            'Dias = 2.000 ÷ (5 × 24) = 2.000 ÷ 120 ≈ 16,7. Os outros valores resultam de esquecer de multiplicar por 24 horas ou de usar a velocidade errada.', 'Fórmula do planejamento (widget provisoes)'),
          Q('trav2-m8-l1-q2', 'Travessia: provisões', 2, 'O que significam os 2 litros por pessoa exigidos pelas OSR (Cat. 1 a 3) no planejamento de água?',
            ['Uma reserva de emergência separada, em recipiente lacrado, que não entra na conta do consumo normal.', 'O consumo diário máximo por pessoa.', 'Toda a água necessária para a travessia.', 'A água usada para cozinhar apenas.'], 0,
            'A OSR pede a reserva de emergência em recipiente dedicado e lacrado. O consumo normal é outro cálculo, e 2 litros não bastariam para uma travessia. Não é um limite diário.', 'OSR; fato travessia-34', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m8-l1-q3', 'Travessia: provisões', 2, 'Quatro pessoas planejam 21 dias com 4 litros por pessoa por dia, e os tanques do barco têm 200 litros. Qual conclusão faz sentido?',
            ['É preciso reduzir o consumo e/ou levar garrafões, dessalinizador ou coletar chuva: a necessidade (cerca de 336 L) supera os tanques.', 'Os tanques bastam, porque 200 L é muita água.', 'Basta beber água do mar misturada com água doce.', 'Basta reduzir a margem de 25% para 0%.'], 0,
            '4 × 4 × 21 = 336 L, acima dos 200 L. Água do mar nunca deve ser bebida, e tirar a margem só reduz a segurança sem resolver a falta.', 'Planejamento de provisões; OMS (desidratação)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NGA Pub. 151, <i>Distances Between Ports</i>: Recife a Bridgetown', url: 'https://msi.nga.mil/api/publications/download?key=16694076/SFH00000/Pub151bk.pdf&type=view', ref: 'travessia-130' },
          { txt: 'World Cruising Club, ARC: distância e duração', url: 'https://worldcruising.com/events/arc', ref: 'travessia-47' },
          { txt: 'World Sailing, OSR 2026-2027: água potável de emergência', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-34' },
          { txt: 'Jimmy Cornell, <i>World Cruising Handbook</i>: provisões e consumo de água (referência técnica, sem link)' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Armazenar, conservar e cozinhar com segurança', minutos: 10,
      objetivos: [
        'Estivar a comida e a água de modo a manter o barco equilibrado e acessível.',
        'Conservar alimentos sem geladeira confiável e evitar intoxicação.',
        'Cozinhar a gás com segurança num barco que balança.',
      ],
      blocos: [
        { t: 'p', html: 'Uma travessia gasta o equivalente a centenas de quilos de comida e água. Onde e como isso fica a bordo afeta o trim, a segurança e o moral.' },
        { t: 'h', txt: 'Estivagem' },
        { t: 'lista', itens: [
          '<b>Peso baixo e junto ao centro do barco:</b> o peso nas pontas piora o caturro; o peso alto reduz a estabilidade. Os garrafões e as latas pesadas vão no fundo, perto da quilha.',
          '<b>Tudo peado:</b> qualquer coisa solta vira projétil com o barco adernado. A NORMAM-211 recomenda que peças, equipamentos e objetos sejam armazenados e peados.',
          '<b>Mapa de estivagem:</b> uma folha com o que está em cada paiol. Ninguém quer desmontar o beliche para achar o arroz.',
          '<b>Etiquete as latas:</b> o rótulo de papel descola com a umidade da sentina. Escreva o conteúdo e a data na tampa com marcador.',
          '<b>Ar e secura:</b> ventile os paiois; a umidade estraga embalagens e dá mofo.',
        ] },
        { t: 'fato', ref: 'extra-travessia-2-12', html: 'A NORMAM-211 recomenda que, antes de iniciar a viagem, todas as peças, equipamentos e objetos sejam armazenados e peados adequadamente, para que o estado do mar não cause avarias nem fira a tripulação.' },
        { t: 'h', txt: 'Conservação' },
        { t: 'p', html: 'A geladeira de um veleiro consome muita energia e pode falhar. Planeje para uma travessia sem refrigeração confiável: coma primeiro os perecíveis (carnes, laticínios), nos primeiros dias, e depois os não perecíveis. Frutas e legumes duradouros (como cebola, repolho, abóbora, maçã e laranja) ficam em redes ou cestas ventiladas; separe as peças machucadas, que estragam as outras. Revise toda semana.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Intoxicação alimentar em alto-mar', html: 'Vômito e diarreia desidratam depressa e derrubam a tripulação. Lave as mãos, separe carne crua de alimentos prontos, não reaproveite comida deixada ao calor, e use água potável para lavar frutas e verduras. Se alguém adoecer, aplique o que viu no módulo de saúde.' },
        { t: 'h', txt: 'Cozinhar a gás' },
        { t: 'p', html: 'O gás de cozinha (GLP) é mais pesado que o ar: um vazamento se acumula na sentina e pode explodir com uma faísca. Por isso a norma é clara sobre onde ficam os botijões.' },
        { t: 'fato', ref: 'extra-arrais-3-39', html: 'Botijões de gás de cozinha devem ficar em área externa ou compartimento não habitável, isolado, seguro e arejado, com a válvula protegida do sol e longe de fontes de ignição.' },
        { t: 'lista', itens: [
          '<b>Feche a válvula do botijão</b> depois de cada uso, e não apenas o botão do fogão.',
          '<b>Fogão com cardã</b> (balançando com o barco) e travas para as panelas.',
          '<b>Detector de gás</b> na sentina, perto do fogão, se o barco tiver.',
          '<b>Cheque as mangueiras e conexões</b> com água e sabão (bolhas mostram vazamento), nunca com chama.',
          '<b>Extintor</b> ao alcance, longe do fogão para não ficar preso atrás do fogo; a <b>manta antichama</b> fica junto ao fogão (a OSR 4.05 pede uma junto a cada fogão).',
          '<b>Roupa de cozinha:</b> avental e calçado fechado; panelas com tampa e pouco líquido no fogo.',
        ] },
        { t: 'termos', ids: ['classes-de-incendio', 'extintor', 'triangulo-do-fogo'] },
        { t: 'fato', ref: 'extra-arrais-3-31', html: 'Na NORMAM-211, incêndio classe A é fogo em sólidos que deixam resíduos (madeira, papel, almofadas, fibra de vidro, borracha, plásticos) e é a única classe em que a água pode ser usada com segurança.' },
        { t: 'callout', tipo: 'dica', titulo: 'Panela de pressão economiza gás', html: 'Panela de pressão reduz o tempo de fogo e o consumo de gás e de água. Ela também é perigosa se mal usada: treine em terra e use a válvula de segurança correta.' },
        { t: 'check', questoes: [
          Q('trav2-m8-l2-q1', 'Travessia: provisões', 1, 'Onde deve ficar o botijão de gás de cozinha?',
            ['Em área externa ou compartimento não habitável, isolado e arejado, com a válvula protegida e longe de ignição.', 'Dentro da cabine, perto do fogão, para ficar à mão.', 'Debaixo do beliche, para não ocupar espaço.', 'No paiol de velas, dentro de um saco.'], 0,
            'O gás é mais pesado que o ar e se acumula na sentina: a norma manda botijão em área externa ou compartimento não habitável e arejado. Cabine, beliche e paiol fechado são lugares de acúmulo e risco de explosão.', 'NORMAM-211; fato extra-arrais-3-39'),
          Q('trav2-m8-l2-q2', 'Travessia: provisões', 2, 'Qual é a forma segura de procurar um vazamento nas mangueiras de gás?',
            ['Passar água com sabão nas conexões e observar bolhas.', 'Acender um fósforo perto das conexões.', 'Sentir o cheiro com o isqueiro aceso.', 'Esperar o fogão apagar sozinho.'], 0,
            'Água e sabão formam bolhas onde há escape. Acender fósforo ou isqueiro perto de um possível vazamento pode causar explosão.', 'Boa prática de segurança a bordo; NORMAM-211'),
          Q('trav2-m8-l2-q3', 'Travessia: provisões', 2, 'Por que o peso das provisões deve ficar baixo e perto do centro do barco?',
            ['Porque reduz o balanço e o caturro e mantém a estabilidade e o trim.', 'Porque assim a comida esfria menos.', 'Porque o veleiro anda mais devagar com peso nas pontas.', 'Porque diminui o consumo de gás.'], 0,
            'Peso nas pontas faz o barco caturrar mais e peso alto reduz a estabilidade. Manter pesos baixos e centrais melhora o comportamento no mar.', 'Estabilidade e trim (Miguens, vol. I; RYA)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: Anexo 4-B (peiar objetos) e instalações de gás (art. 4.28)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-arrais-3-39' },
          { txt: 'Miguens, <i>Navegação: a ciência e a arte</i>, vol. I: estabilidade e trim' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Gás, combustível e a regra dos terços', minutos: 10,
      objetivos: [
        'Calcular o gás de cozinha e o diesel para a travessia, com margem.',
        'Aplicar a regra dos terços ao combustível.',
        'Entender o motor como reserva, e não como plano A.',
      ],
      blocos: [
        { t: 'p', html: 'Numa travessia a vela, o motor é uma ferramenta: manobra no porto, carrega baterias, tira o barco de calmarias ou de risco. Mas o diesel é finito. Contar com ele como propulsão principal é um erro frequente.' },
        { t: 'h', txt: 'A regra dos terços' },
        { t: 'fato', ref: 'tecnico-166', html: 'A “regra de um terço” oficial da NORMAM-211 é de combustível: 1/3 para a ida, 1/3 para a volta e 1/3 de reserva.' },
        { t: 'p', html: 'A norma a recomenda para passeios de ida e volta: gastou o primeiro terço, é hora de voltar. Numa travessia o princípio é parecido: nunca conte com mais de dois terços do combustível como utilizável, e mantenha o último terço para o que for imprevisto (perder o vento perto de um perigo, entrar num porto difícil, uma emergência).' },
        { t: 'h', txt: 'Contas do motor' },
        { t: 'p', html: '<b>Horas de motor</b> = (distância × parte feita a motor ÷ velocidade a motor) + horas de carga de bateria por dia × dias. Multiplique as horas pelo <b>consumo em litros por hora</b> do seu motor (varia com o regime de rotação, medido no seu barco). Some as saídas e chegadas de porto, calmarias e uma reserva.' },
        { t: 'widget', w: 'provisoes', opts: { distancia: 1650, velocidade: 5, tripulacao: 4, margem: 25, agua: 4, navegacao: 'oceanica', lembrar: false }, legenda: 'Teste com seus números: distância, parte a motor, consumo em L/h, horas de carga de bateria, reserva e tamanho do tanque.' },
        { t: 'p', html: '<b>Exemplo, com números hipotéticos:</b> 1.650 milhas a 5 nós dão 13,75 dias; com 25% de margem, 17,2 dias. Suponha que 10% da distância (165 milhas) seja feita a motor, a 5 nós: 33 horas. Some 2 horas por dia de motor só para carregar as baterias: 34 horas. Total, cerca de 67 horas. Com um consumo de 2,5 litros por hora (valor de exemplo; meça o do seu motor), são 168 litros, mais uma reserva de 30%, perto de 220 litros. Em muitos cruzeiros de 32 pés, por exemplo, o tanque tem bem menos que isso; confira o do seu barco. Para fechar a conta, reduza o tempo de motor com painéis solares ou gerador eólico, ou leve galões de diesel bem peados e fora do alojamento.' },
        { t: 'h', txt: 'Gás' },
        { t: 'p', html: 'A conta é: horas de fogo por dia × consumo por boca × dias com margem. A referência usada no simulador é um consumo de cerca de 0,12 kg/h por boca de 1,5 kW, e um botijão doméstico de 13 kg. Uma tripulação que cozinha duas refeições quentes por dia gasta bem mais gás do que a que come frio. Leve um botijão reserva e, se possível, um fogareiro de emergência.' },
        { t: 'h', txt: 'Energia' },
        { t: 'p', html: 'A geladeira, o piloto automático, o AIS, as luzes de navegação e o rádio consomem energia a noite toda. Calcule o consumo diário em amperes-hora, some a produção solar, eólica e do alternador, e veja o que a bateria aguenta. O módulo sobre energia, água e comunicações da primeira parte do curso trata disso em detalhe.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Motor e abastecimento', html: 'Filtros limpos, sobressalentes de filtro e correias, óleo e líquido de arrefecimento de reserva, e combustível limpo. Água no tanque e bactéria no diesel (comum no calor e na umidade) entopem filtros justo quando você precisa do motor. Quando abastecer, use um filtro e confira o combustível.' },
        { t: 'check', questoes: [
          Q('trav2-m8-l3-q1', 'Travessia: provisões', 1, 'O que diz a regra de um terço da NORMAM-211 sobre o combustível?',
            ['1/3 para a ida, 1/3 para a volta e 1/3 de reserva.', 'Gastar um terço do tanque por dia.', 'Levar apenas um terço do combustível, pelo peso.', 'Reservar dois terços apenas para a volta.'], 0,
            'A regra divide o combustível em ida, volta e reserva, em partes iguais. Gastar um terço por dia esgota o tanque em três dias, levar só um terço deixa o barco sem alcance e guardar dois terços só para a volta ignora a ida.', 'NORMAM-211/DPC; fato tecnico-166', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m8-l3-q2', 'Travessia: provisões', 2, 'Por que o motor deve ser tratado como reserva e não como plano principal numa travessia a vela?',
            ['Porque o diesel é finito e é preciso guardá-lo para manobras, carga de bateria e emergências.', 'Porque motores não funcionam em alto-mar.', 'Porque é proibido usar motor fora de 20 milhas da costa.', 'Porque o motor encurta a vida do casco.'], 0,
            'O combustível a bordo é limitado e precisa cobrir saídas e chegadas, carga de baterias e emergências. Motores funcionam em alto-mar e não há proibição de usá-los.', 'Boa prática de cruzeiro; NORMAM-211 (regra de 1/3)'),
          Q('trav2-m8-l3-q3', 'Travessia: provisões', 2, 'Quais são os fatores de uma conta de gás de cozinha para uma travessia?',
            ['Horas de fogo por dia, consumo por boca e dias de viagem com margem.', 'Somente o tamanho do botijão.', 'A cor da panela e o tipo de fogão.', 'Somente o número de tripulantes.'], 0,
            'O consumo depende de quanto tempo o fogo fica aceso, da potência da boca e do tempo de viagem. O tamanho do botijão só mostra a capacidade, e o número de tripulantes pesa apenas via horas de fogo.', 'Planejamento de provisões (widget provisoes)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: regra de um terço de combustível', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'tecnico-166' },
          { txt: 'Nigel Calder, <i>Boatowner’s Mechanical and Electrical Manual</i> (diesel, baterias; referência técnica, sem link)' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Lixo, MARPOL e a rotina de um dia a bordo', minutos: 12,
      objetivos: [
        'Explicar o que a MARPOL (Anexo V) permite e proíbe jogar ao mar, e o que fazer com o lixo.',
        'Organizar a rotina diária de uma travessia.',
        'Cuidar do moral e da higiene da tripulação.',
      ],
      blocos: [
        { t: 'p', html: 'Passar 20 dias no mar gera lixo: embalagens, restos de comida, latas, óleo. Jogá-lo na água é crime ambiental e uma agressão a quem vive no oceano. A regra internacional se chama MARPOL e vale para navios de qualquer tamanho, inclusive iates.' },
        { t: 'termos', ids: ['autoridade-maritima', 'ajb'] },
        { t: 'h', txt: 'MARPOL Anexo V em poucas linhas' },
        { t: 'fato', ref: 'extra-travessia-2-15', html: 'Plásticos, lixo doméstico, óleo de cozinha, cinzas e demais resíduos operacionais têm descarga proibida no mar (resumo da IMO sobre o Anexo V revisado, em vigor desde 1º/1/2013).' },
        { t: 'fato', ref: 'extra-travessia-2-16', html: 'Fora de áreas especiais, resto de comida triturado (que passa por uma tela de 25 mm) só pode ir ao mar a 3 milhas náuticas ou mais da terra mais próxima e em navegação; resto de comida não triturado, só a 12 milhas ou mais. Dentro de áreas especiais, só triturado e a 12 milhas ou mais.' },
        { t: 'tabela', cab: ['Tipo de lixo', 'Fora de áreas especiais', 'Em áreas especiais'], linhas: [
          ['Plástico (embalagens, sacolas, redes, cordas sintéticas)', 'Proibido', 'Proibido'],
          ['Lixo doméstico, latas, vidro, papel, óleo de cozinha', 'Proibido', 'Proibido'],
          ['Resto de comida triturado (tela de 25 mm)', 'A 3 mn ou mais da terra e em navegação', 'A 12 mn ou mais'],
          ['Resto de comida não triturado', 'A 12 mn ou mais da terra e em navegação', 'Proibido'],
        ], legenda: 'Resumo simplificado da IMO (julho/2013). Pode haver exigências adicionais; na dúvida, guarde a bordo e descarte em terra.' },
        { t: 'fato', ref: 'extra-travessia-2-17', html: 'As áreas especiais do MARPOL Anexo V são: Mar Mediterrâneo, Mar Báltico, Mar Negro, Mar Vermelho, Golfos, Mar do Norte, Região do Grande Caribe e área Antártica.' },
        { t: 'callout', tipo: 'nota', titulo: 'O Caribe é área especial', html: 'Quem chega ao Caribe depois do Atlântico entra numa área especial (a Região do Grande Caribe). Ali, o resto de comida só pode ser lançado triturado e a 12 milhas ou mais da terra. O mais prático é guardar tudo a bordo e descartar no porto.' },
        { t: 'fato', ref: 'extra-travessia-2-18', html: 'Navios de 12 m ou mais devem exibir cartazes de descarte e navios de 100 GT ou mais, ou certificados para 15 pessoas ou mais, devem ter plano de gerenciamento de lixo. Um veleiro com menos de 12 m (como um de 32 pés) fica abaixo desse limite, mas a proibição de jogar plástico vale do mesmo jeito.' },
        { t: 'fato', ref: 'extra-travessia-2-14', html: 'Na água, é proibido lançar, descarregar ou depositar material poluente de qualquer espécie, seja lixo, lata ou derivados de petróleo (item 7, Poluição, do Anexo 4-B “Recomendações ao Navegante” da NORMAM-211/DPC).' },
        { t: 'lista', itens: [
          '<b>Reduza na origem:</b> tire as embalagens de papelão e plástico no porto, antes de largar.',
          '<b>Separe e comprima:</b> plástico, vidro e lata em sacos fechados; latas amassadas.',
          '<b>Guarde o óleo usado</b> em garrafas fechadas e descarte em terra.',
          '<b>Esgoto:</b> use as instalações do porto sempre que possível; as regras de descarte do esgoto são mais restritas perto da costa.',
          '<b>Registre:</b> um caderno com o que foi descartado e onde ajuda se houver fiscalização.',
        ] },
        { t: 'h', txt: 'Um dia a bordo' },
        { t: 'figura', svg: S('m8dia', 'Linha do tempo de um dia a bordo: quartos de serviço contínuos, 06 h boletim de tempo, 08 h café e ronda do barco, 12 h posição no diário, 18 h jantar e preparação da noite, 20 h passagem de quarto', '0 0 520 245',
          '<rect x="20" y="28" width="480" height="30" fill="var(--sea-2)" stroke="currentColor"/>' +
          '<text x="260" y="48" font-size="13" text-anchor="middle" fill="currentColor">quartos de serviço ininterruptos, 24 h</text>' +
          '<line x1="20" y1="80" x2="500" y2="80" stroke="currentColor" stroke-width="1.5"/>' +
          '<g stroke="currentColor"><line x1="20" y1="74" x2="20" y2="86"/><line x1="100" y1="74" x2="100" y2="86"/><line x1="180" y1="74" x2="180" y2="86"/><line x1="260" y1="74" x2="260" y2="86"/><line x1="340" y1="74" x2="340" y2="86"/><line x1="420" y1="74" x2="420" y2="86"/><line x1="500" y1="74" x2="500" y2="86"/></g>' +
          '<g font-size="13" text-anchor="middle" fill="currentColor"><text x="20" y="102">00 h</text><text x="100" y="102">04 h</text><text x="180" y="102">08 h</text><text x="260" y="102">12 h</text><text x="340" y="102">16 h</text><text x="420" y="102">20 h</text><text x="500" y="102">24 h</text></g>' +
          '<g font-size="13" fill="currentColor">' +
          '<circle cx="140" cy="132" r="5" fill="var(--magenta)"/><text x="150" y="136">06 h: boletim de tempo</text>' +
          '<circle cx="180" cy="156" r="5" fill="var(--magenta)"/><text x="190" y="160">08 h: ronda do barco, café</text>' +
          '<circle cx="260" cy="180" r="5" fill="var(--magenta)"/><text x="270" y="184">12 h: posição no diário</text>' +
          '<circle cx="380" cy="204" r="5" fill="var(--magenta)"/><text x="370" y="208" text-anchor="end">18 h: jantar, pré-noite</text>' +
          '<circle cx="420" cy="228" r="5" fill="var(--magenta)"/><text x="410" y="232" text-anchor="end">20 h: passagem de quarto</text></g>', 560),
          legenda: 'Modelo de rotina, a ajustar à sua tripulação. O horário importa menos que o hábito de repeti-lo todo dia.' },
        { t: 'lista', itens: [
          '<b>Manhã:</b> boletim de tempo (mensagem por satélite, GRIB ou HF), ronda de inspeção (mastro, cabos, velas, vazamentos, cobertas), checar baterias, combustível e água.',
          '<b>Meio-dia:</b> posição no diário, distância feita e a faltar, estimativa de chegada, plano da noite.',
          '<b>Tarde:</b> manutenção, costura de vela, remendos; banho de balde; roupa seca.',
          '<b>Entardecer:</b> reduza pano se necessário, jante junto, recarregue as lanternas e o rádio.',
          '<b>Noite:</b> quartos conforme a escala, silêncio no convés para quem dorme.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Moral importa', html: 'Uma refeição quente, um bolo no aniversário, uma música no cockpit, um dia de descanso para o comandante. Trabalhar bem no mar depende de gente com o ânimo bom.' },
        { t: 'check', questoes: [
          Q('trav2-m8-l4-q1', 'Travessia: provisões', 1, 'Pelo MARPOL Anexo V, o que acontece com plásticos fora de áreas especiais?',
            ['A descarga no mar é proibida.', 'Podem ser lançados a 12 milhas da costa.', 'Podem ser lançados se triturados.', 'Podem ser lançados à noite.'], 0,
            'Plásticos, assim como lixo doméstico e óleo de cozinha, têm descarga proibida em qualquer lugar. A trituração e a distância só se aplicam a restos de comida.', 'MARPOL Anexo V; fato extra-travessia-2-15', 'https://wwwcdn.imo.org/localresources/en/OurWork/Environment/Documents/Annex%20V%20discharge%20requirements%2007-2013.pdf'),
          Q('trav2-m8-l4-q2', 'Travessia: provisões', 2, 'Fora de áreas especiais, a que distância mínima da terra pode-se jogar resto de comida triturado (tela de 25 mm), com o barco em navegação?',
            ['3 milhas náuticas.', '12 milhas náuticas.', '25 milhas náuticas.', 'Em qualquer ponto.'], 0,
            'Resto de comida triturado: 3 mn ou mais; não triturado: 12 mn ou mais. Em áreas especiais, a distância é de 12 mn mesmo para o triturado. Ninguém pode jogar em qualquer ponto.', 'MARPOL Anexo V; fato extra-travessia-2-16', 'https://wwwcdn.imo.org/localresources/en/OurWork/Environment/Documents/Annex%20V%20discharge%20requirements%2007-2013.pdf'),
          Q('trav2-m8-l4-q3', 'Travessia: provisões', 2, 'Um veleiro com menos de 12 m (um de 32 pés, por exemplo) não precisa de cartaz de descarte. O que isso significa?',
            ['Que o cartaz não é obrigatório, mas as proibições de descarte do MARPOL continuam valendo.', 'Que a tripulação pode jogar o que quiser no mar.', 'Que o MARPOL não se aplica a iates.', 'Que a Marinha dispensa o lixo de iates.'], 0,
            'O cartaz é exigido para navios de 12 m ou mais, mas as regras de descarte valem para os navios em geral, incluindo iates pequenos.', 'MARPOL Anexo V; fato extra-travessia-2-18', 'https://www.imo.org/en/OurWork/Environment/Pages/Garbage-Default.aspx'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'IMO, <i>Simplified overview of the discharge provisions of the revised MARPOL Annex V</i> (julho/2013)', url: 'https://wwwcdn.imo.org/localresources/en/OurWork/Environment/Documents/Annex%20V%20discharge%20requirements%2007-2013.pdf', ref: 'extra-travessia-2-15' },
          { txt: 'IMO, Garbage: áreas especiais, cartazes e plano de gerenciamento', url: 'https://www.imo.org/en/OurWork/Environment/Pages/Garbage-Default.aspx', ref: 'extra-travessia-2-17' },
          { txt: 'NORMAM-211/DPC: poluição (Anexo 4-B, item 7)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-14' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm9', titulo: 'Mau tempo no oceano',
  resumo: 'De onde vem o mau tempo no Atlântico, como lidar com as pancadas de vento dos alísios e quais táticas existem quando o mar fica grosso: capear, correr, usar âncora flutuante. Além disso: como preparar barco e tripulação antes que o vento chegue.',
  licoes: [
    {
      id: 'l1', titulo: 'De onde vem o mau tempo no Atlântico', minutos: 12,
      objetivos: [
        'Reconhecer os sistemas que geram vento forte e mar grosso nas rotas do Atlântico.',
        'Usar a escala Beaufort e os critérios do aviso de mau tempo do CHM.',
        'Ligar a época do ano à chance de encontrar cada sistema.',
      ],
      blocos: [
        { t: 'p', html: 'Se você planejou a janela, escolheu a rota dos alísios e consultou a previsão, a maior parte da travessia será boa velejada. Mas o mar não se compromete com o calendário: cedo ou tarde, você encontrará vento forte. Entender de onde ele vem ajuda a prever, a evitar e a reagir.' },
        { t: 'termos', ids: ['beaufort', 'ciclone-extratropical', 'ciclone-tropical', 'frente-fria', 'borrasca', 'rajada', 'ressaca', 'altura-significativa'] },
        { t: 'h', txt: 'A escala Beaufort' },
        { t: 'p', html: 'O vento é descrito pela <b>escala Beaufort</b>, de 0 a 12. A Marinha do Brasil (CHM) usa os nomes e as faixas em nós da escala da OMM. Para um veleiro de cruzeiro de porte médio, como um de 32 pés, o que importa está do 6 em diante; num barco menor, a atenção começa antes.' },
        { t: 'tabela', cab: ['Força', 'Nome (CHM)', 'Vento (nós)', 'Ondas prováveis em mar aberto'], linhas: [
          ['6', 'Muito fresco', '22 a 27', 'cerca de 3 m'],
          ['7', 'Forte', '28 a 33', 'cerca de 4 m'],
          ['8', 'Muito forte', '34 a 40', 'cerca de 5,5 m'],
          ['9', 'Duro', '41 a 47', 'cerca de 7 m'],
          ['10', 'Muito duro', '48 a 55', 'cerca de 9 m'],
        ], legenda: 'Escala Beaufort (CHM/OMM, nº 8). A altura é a provável em mar aberto, e as ondas máximas são maiores. Perto da costa e em águas rasas, as ondas são menores e mais íngremes.' },
        { t: 'widget', w: 'beaufort', opts: { forca: 7, quiz: true }, legenda: 'Passe pelas forças 5 a 10 e veja o mar e a orientação geral de vela para um cruzeiro de 32 pés (ajuste ao seu barco). A orientação é um guia, não uma regra.' },
        { t: 'fato', ref: 'travessia-96', html: 'O Serviço Meteorológico Marinho emite aviso de mau tempo quando se prevê vento força 7 Beaufort ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa.' },
        { t: 'h', txt: 'Os sistemas que mais importam' },
        { t: 'tabela', cab: ['Sistema', 'Onde e quando', 'O que traz'], linhas: [
          ['Frentes frias e ciclones extratropicais', 'Sul e Sudeste do Brasil e Atlântico Sul médio, o ano todo, mais no inverno', 'Mudança brusca de vento (NW para SW), vento forte, mar de proa e cruzado'],
          ['Ciclones subtropicais e tropicais', 'METAREA V (Atlântico Sul ocidental), eventos raros mas de alto impacto', 'Vento e ondas fortes; nomes dados pela Marinha (NORMAM-701/DHN)'],
          ['Furacões', 'Atlântico Norte e Caribe, de 1º de junho a 30 de novembro, com pico em 10 de setembro', 'Tempestade tropical muito violenta; a janela da ARC tem relação com isso'],
          ['ZCIT e pancadas de borrasca', 'Faixa entre os alísios, perto do Equador, e nos próprios alísios', 'Calmarias, trovoadas e rajadas súbitas (próxima aula)'],
          ['Baixas de inverno no Atlântico Norte', 'Açores e rotas de volta à Europa, de outono a primavera', 'Gales sucessivos; uma das razões de a volta ser mais difícil'],
        ], legenda: 'Resumo de fontes meteorológicas (NHC, CHM, NGA). Uma travessia comum pela rota dos alísios evita a maior parte desses sistemas se for feita na época certa.' },
        { t: 'fato', ref: 'travessia-77', html: 'Segundo o Serviço Meteorológico Marinho, ciclones subtropicais ou tropicais na METAREA V são eventos de baixa frequência, mas de grande impacto pelo vento e pelas ondas.' },
        { t: 'fato', ref: 'travessia-78', html: 'O CHM publica relatórios de cada ciclone subtropical/tropical na METAREA V desde 2011 (de Arani, em março de 2011, a Biguá, em 14 a 16 de dezembro de 2024), nomeados com base na NORMAM-701/DHN.' },
        { t: 'fato', ref: 'travessia-74', html: 'A temporada oficial de furacões da bacia do Atlântico vai de 1º de junho a 30 de novembro, mas às vezes há ciclones tropicais antes e depois dessas datas.' },
        { t: 'fato', ref: 'travessia-75', html: 'O pico da temporada de furacões do Atlântico é em 10 de setembro, com a maior parte da atividade entre meados de agosto e meados de outubro.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Tempestade é fato, não exceção', html: 'Na fase de planejamento, aceite que você pode ter de enfrentar um dia de vento 8 ou 9. Se o seu barco, a sua tripulação e o seu plano não aguentam isso, a decisão certa é esperar uma janela melhor, e não depender da sorte.' },
        { t: 'check', questoes: [
          Q('trav2-m9-l1-q1', 'Travessia: mau tempo', 1, 'A partir de que força Beaufort o CHM emite aviso de mau tempo?',
            ['Força 7 (28 nós) ou mais.', 'Força 4 (11 nós).', 'Força 12 apenas.', 'Força 9 (41 nós) ou mais.'], 0,
            'O aviso de mau tempo vale para vento de força 7 ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos ou ressaca com ondas de 2,5 m ou mais na costa.', 'CHM, Serviços radiometeorológicos; fato travessia-96', 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante'),
          Q('trav2-m9-l1-q2', 'Travessia: mau tempo', 2, 'Qual é o pico da temporada de furacões do Atlântico Norte?',
            ['Cerca de 10 de setembro, com atividade maior de meados de agosto a meados de outubro.', 'Cerca de 10 de janeiro.', 'Cerca de 1º de junho, quando a temporada começa.', 'Cerca de 30 de novembro, quando termina.'], 0,
            'A estatística do NHC mostra o pico em 10 de setembro. A temporada oficial vai de 1º de junho a 30 de novembro, mas o início e o fim têm pouca atividade.', 'NHC (NOAA); fato travessia-75', 'https://www.nhc.noaa.gov/climo/'),
          Q('trav2-m9-l1-q3', 'Travessia: mau tempo', 2, 'Qual afirmação sobre ciclones subtropicais e tropicais na METAREA V está de acordo com o CHM?',
            ['São eventos de baixa frequência, mas de grande impacto pelo vento e pelas ondas.', 'Nunca ocorrem no Atlântico Sul.', 'São muito frequentes e de baixo impacto.', 'Só ocorrem no verão do hemisfério norte.'], 0,
            'O CHM monitora esses eventos desde 2011 e os classifica como pouco frequentes, porém com grande impacto. A afirmação de que nunca ocorrem é falsa, e eles não dependem do verão do hemisfério norte.', 'CHM; fato travessia-77', 'https://www.marinha.mil.br/chm/dados-do-smm-monitoramento-de-ciclones'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'CHM/Marinha do Brasil, Serviços radiometeorológicos: critérios do aviso de mau tempo', url: 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante', ref: 'travessia-96' },
          { txt: 'CHM, Escala Beaufort (fonte: OMM nº 8, vol. III, 2023)', url: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf' },
          { txt: 'CHM, monitoramento de ciclones subtropicais e tropicais', url: 'https://www.marinha.mil.br/chm/dados-do-smm-monitoramento-de-ciclones', ref: 'travessia-77' },
          { txt: 'NHC (NOAA), Tropical Cyclone Climatology', url: 'https://www.nhc.noaa.gov/climo/', ref: 'travessia-74' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Rajadas de borrasca (squalls) nos alísios', minutos: 10,
      objetivos: [
        'Reconhecer, de dia e à noite, uma pancada de borrasca se aproximando.',
        'Aplicar uma rotina simples de resposta: ver, reduzir, arribar, aliviar escota.',
        'Aproveitar a chuva sem perder o controle do barco.',
      ],
      blocos: [
        { t: 'p', html: 'Os alísios são ventos regulares, mas não são monótonos. Em alguns trechos, principalmente perto da <b>ZCIT</b>, nuvens de chuva e trovoada crescem e se movem com o vento. Cada uma traz, em poucos minutos, <b>rajadas</b> bem mais fortes que o vento de fundo, uma mudança de direção e chuva intensa. É a <b>borrasca</b> (em inglês, <i>squall</i>). Costuma durar de alguns minutos a meia hora, ou mais se houver várias em fila, e passa.' },
        { t: 'termos', ids: ['borrasca', 'rajada', 'zcit', 'cumulonimbo', 'alisios'] },
        { t: 'h', txt: 'Como é uma borrasca' },
        { t: 'figura', svg: S('m9sq', 'Vista de cima de uma borrasca: nuvem escura com chuva avançando com o vento, frente de rajada à frente, vento forte e virado, e o veleiro arribando para aliviar', '0 0 520 280',
          '<rect width="520" height="280" fill="var(--sea-1)"/>' +
          '<ellipse cx="170" cy="120" rx="130" ry="70" fill="var(--sea-3)" fill-opacity=".55" stroke="currentColor" stroke-dasharray="5 4"/>' +
          '<text x="170" y="116" font-size="14" text-anchor="middle" fill="currentColor">nuvem escura</text><text x="170" y="134" font-size="13" text-anchor="middle" fill="currentColor">com chuva</text>' +
          '<path d="M296 52 Q340 120 296 188" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
          '<text x="334" y="70" font-size="13" fill="var(--magenta)">frente da rajada</text>' +
          '<g stroke="currentColor" stroke-width="2.5" fill="none"><path d="M140 40 L240 40"/><path d="M130 205 L230 205"/></g>' +
          '<g stroke="currentColor" fill="currentColor"><path d="M232 40 l-8 -5 v10z"/><path d="M222 205 l-8 -5 v10z"/></g>' +
          '<text x="20" y="30" font-size="13" fill="currentColor">vento de fundo</text>' +
          '<g stroke="var(--magenta)" stroke-width="4" fill="none"><path d="M290 90 L350 100"/><path d="M286 130 L350 134"/><path d="M290 168 L350 160"/></g>' +
          '<text x="352" y="108" font-size="13" fill="var(--magenta)">rajadas, vento virado</text>' +
          '<g transform="translate(420,200) rotate(35)"><path d="M0 -24 Q9 -8 7 18 L-7 18 Q-9 -8 0 -24Z" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/></g>' +
          '<path d="M455 160 L420 200" stroke="currentColor" stroke-dasharray="4 3" fill="none"/>' +
          '<text x="330" y="258" font-size="13" fill="currentColor">barco arriba e alivia as escotas</text>' +
          '<text x="510" y="22" font-size="13" text-anchor="end" fill="currentColor">a borrasca anda com o vento</text>', 560),
          legenda: 'Esquema de uma borrasca. Pode haver várias em linha ou em série. A frente de rajada chega antes da chuva.' },
        { t: 'lista', itens: [
          '<b>De dia:</b> base escura e plana da nuvem, “cortina” de chuva, nuvem que cresce rápido. Observe o horizonte a barlavento.',
          '<b>À noite:</b> raios, escurecimento das estrelas, queda súbita da temperatura, cheiro de chuva. O radar mostra as células de chuva, e às vezes o vento amaina um pouco antes da rajada.',
          '<b>Ao chegar:</b> o vento cresce de repente e muda de direção, a chuva vem depois.',
        ] },
        { t: 'h', txt: 'Onde e quando elas aparecem' },
        { t: 'p', html: 'As borrascas são mais frequentes e fortes perto da <b>ZCIT</b>, onde o ar quente e úmido sobe e forma nuvens grandes. Nos alísios propriamente ditos, a nebulosidade é feita de cúmulos pequenos que também produzem pancadas, mais fracas. A posição da ZCIT muda de dia para dia e de mês para mês, e a análise do METEOROMARINHA mostra onde ela está. Veja a aula sobre a ZCIT no primeiro módulo da parte 1 do curso: a escolha do ponto de cruzamento da ZCIT é, em parte, uma decisão sobre quanto de borrasca aceitar.' },
        { t: 'fato', ref: 'travessia-85', html: 'Exemplo real: na análise do METEOROMARINHA de 07/10/2026 12 HMG, a ZCIT estava em 09N010W, 10N025W, 09N040W, 10N050W e 11N063W (a posição muda diariamente).' },
        { t: 'p', html: 'Ao cruzar a ZCIT, espere calmarias com chuva, pancadas de vento em todas as direções e céu pesado por um a três dias. Poupe o motor para o essencial, mantenha as velas prontas e observe as nuvens em volta, anotando cada célula no diário.' },
        { t: 'h', txt: 'Resposta em quatro passos' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Ver cedo:</b> quem está de quarto avisa em voz alta: “borrasca por barlavento!”. Chame o comandante se a pancada parecer forte.',
          '<b>Reduzir pano antes:</b> se há pancadas ao redor, rize antes da noite. É melhor andar mais devagar do que cambalear com pano demais.',
          '<b>Aliviar:</b> quando a rajada chegar, folgue as escotas (a da grande primeiro, descendo o carrinho do traveller se tiver) para reduzir a pressão e a banda. Quanto ao rumo, as fontes divergem. A Yachting Monthly diz que, de través, o cruzeirista costuma orçar um pouco antes de uma rajada grande, para aliviar a força, e arribar de novo quando ela passa; e que de popa não se deve orçar, porque isso aumenta o vento aparente e pode levar ao broaching. A Practical Sailor desaconselha correr com a rajada: a virada de vento da borrasca pode causar uma jaibe acidental, e muitas vezes é melhor reduzir pano e atravessar a pancada. Decida pelo seu barco e pelo pano que ele leva, e treine.',
          '<b>Governar à mão:</b> troque o piloto automático pelo timão na hora da pancada; o piloto demora a reagir. Tripulantes engatados.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Chuva é água de graça', html: 'A chuva da borrasca lava o sal do convés e enche tambores. Estenda uma lona ou use a vela grande como calha para encher garrafões, depois de os primeiros minutos de chuva terem lavado o sal. Não vale a pena se o vento estiver forte demais: o essencial é o controle do barco.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Raios', html: 'Nas trovoadas, afaste-se de mastro, estais e metais. Mantenha equipamentos eletrônicos de reserva (GPS portátil, VHF portátil) guardados em local fechado e protegido. O barco com bom aterramento do mastro tem menos risco, mas não há proteção total. Procure fazer uma avaliação de proteção contra raios com um profissional antes da travessia.' },
        { t: 'widget', w: 'beaufort', opts: { modo: 'quiz', questoes: 6 }, legenda: 'Treine ler o vento e o mar: quanto antes você ler a escala, mais rápido reduz o pano.' },
        { t: 'check', questoes: [
          Q('trav2-m9-l2-q1', 'Travessia: mau tempo', 1, 'Qual é a primeira atitude do barco ao chegar a rajada forte de uma borrasca?',
            ['Aliviar a pressão: folgar as escotas (a da grande primeiro) e, se preciso, ajustar o rumo para reduzir a força do vento sobre as velas.', 'Apertar as escotas ao máximo e manter o rumo.', 'Cambar imediatamente.', 'Ligar o motor e manter o pano como está.'], 0,
            'Folgar as escotas reduz a pressão e a banda, e a rajada passa. Apertar as escotas aumenta a adernada, e cambar no meio da rajada é arriscado. Para o rumo, as escolas divergem (veja a lição): o essencial é aliviar a pressão sem provocar uma jaibe ou um broaching.', 'Yachting Monthly; Practical Sailor (aliviar a pressão na rajada)'),
          Q('trav2-m9-l2-q2', 'Travessia: mau tempo', 2, 'Qual dos sinais abaixo sugere uma borrasca se aproximando à noite?',
            ['Raios à vista, queda de temperatura e vento que amaina de repente.', 'Céu limpo e estrelas brilhantes.', 'Maré vazante.', 'Ruído de motor distante.'], 0,
            'Raios, queda de temperatura e a mudança do vento são sinais clássicos. O radar também mostra as células de chuva. Céu limpo indica que não há nuvens por perto.', 'WMO / literatura de cruzeiro'),
          Q('trav2-m9-l2-q3', 'Travessia: mau tempo', 2, 'Por que é útil rizar antes de entardecer se há pancadas na região?',
            ['Porque rizar de noite, com a borrasca já encima, é mais difícil e perigoso.', 'Porque reduz a água usada pela tripulação.', 'Porque a norma exige rizar às 18 h.', 'Porque os rizos só funcionam sem vento.'], 0,
            'Reduzir pano com antecedência, de dia e com todos descansados, evita a manobra no pior momento. Nenhuma norma exige rizar às 18 h.', 'Boa marinharia (Pardey; Coles)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NGA Pub. 140: climatologia e pancadas (squalls) em ilhas do Caribe sob alísios fortes', url: 'https://msi.nga.mil/api/publications/download?key=16694492/SFH00000/Pub140bk.pdf&type=view' },
          { txt: 'Yachting Monthly, apparent wind: orçar de través e não orçar de popa em rajadas', url: 'https://www.yachtingmonthly.com/sailing-skills/apparent-wind-how-to-predict-it-and-use-it-to-your-advantage-87841' },
          { txt: 'Practical Sailor, Summer squall sailing tactics: risco de correr com a rajada', url: 'https://www.practical-sailor.com/blog/summer-squall-sailing-tactics/' },
          { txt: 'Adlard Coles, <i>Heavy Weather Sailing</i>; Miguens, <i>Navegação: a ciência e a arte</i>, vol. III (meteorologia)' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Táticas: capear, correr, âncora flutuante', minutos: 14,
      objetivos: [
        'Explicar as táticas de mau tempo mais usadas e quando cada uma faz sentido.',
        'Identificar o risco do mar de popa para o seu veleiro.',
        'Reconhecer que cada barco responde de forma diferente e que a prática antes da tempestade é indispensável.',
      ],
      blocos: [
        { t: 'callout', tipo: 'nota', titulo: 'Sem receita única', html: 'Não existe uma tática que sirva para todos os barcos e todos os mares. O que funciona para um quilha longa pode ser mortal para um quilha curta. Estas são as ideias mais usadas, descritas na literatura; teste a resposta do seu barco com tempo moderado antes de precisar dela.' },
        { t: 'termos', ids: ['capear', 'por-se-a-capa', 'drogue', 'ancora-flutuante', 'ancora-de-mar', 'vela-de-tempestade', 'vela-de-capa'] },
        { t: 'h', txt: 'As cinco ideias' },
        { t: 'figura', svg: S('m9tat', 'Três táticas de mau tempo vistas de cima, com o vento vindo do alto: capear com a proa 50 graus fora do vento, correr com vento de popa e âncora de arrasto (drogue), e âncora de capa pela proa', '0 0 520 250',
          '<rect width="520" height="250" fill="var(--sea-1)"/>' +
          '<g stroke="currentColor" stroke-width="2" fill="currentColor"><path d="M70 8 v22"/><path d="M70 38 l-5 -9 h10z"/><path d="M260 8 v22"/><path d="M260 38 l-5 -9 h10z"/><path d="M450 8 v22"/><path d="M450 38 l-5 -9 h10z"/></g>' +
          '<text x="86" y="26" font-size="13" fill="currentColor">vento</text>' +
          '<g transform="translate(70,130) rotate(50)"><path d="M0 -28 Q10 -8 8 22 L-8 22 Q-10 -8 0 -28Z" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/></g>' +
          '<path d="M70 140 L90 190" stroke="currentColor" stroke-dasharray="4 3" fill="none"/><text x="14" y="228" font-size="13" fill="currentColor">Capear (heave-to)</text>' +
          '<g transform="translate(260,115) rotate(180)"><path d="M0 -28 Q10 -8 8 22 L-8 22 Q-10 -8 0 -28Z" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/></g>' +
          '<path d="M260 100 L260 64" stroke="var(--magenta)" stroke-width="2" fill="none"/><path d="M252 58 L268 58 L260 74Z" fill="var(--magenta)"/>' +
          '<text x="196" y="228" font-size="13" fill="currentColor">Correr com drogue</text>' +
          '<g transform="translate(450,150) rotate(0)"><path d="M0 -28 Q10 -8 8 22 L-8 22 Q-10 -8 0 -28Z" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/></g>' +
          '<path d="M450 122 L450 88" stroke="var(--magenta)" stroke-width="2" fill="none"/><path d="M432 84 Q450 54 468 84Z" fill="var(--magenta)"/>' +
          '<text x="392" y="228" font-size="13" fill="currentColor">Âncora de capa</text>', 560),
          legenda: 'Esquema, fora de escala. Capear: o barco fica aproado a cerca de 50° do vento, devagar. Correr: o barco anda com o mar, freado por um drogue pela popa. Âncora de capa: o barco fica proa ao mar, preso a um paraquedas flutuante.' },
        { t: 'tabela', cab: ['Tática', 'Como é', 'Quando e riscos'], linhas: [
          ['Capear (heave-to)', 'Vela de proa a contra e grande rizada (ou vela de capa), leme amarrado todo para orçar (cana a sotavento); o barco para quase e deriva devagar', 'Descansar, esperar o vento, fazer uma refeição. Em ondas muito altas e quebrando, alguns barcos ficam expostos a golpes de mar'],
          ['Navegar de bolina com pouco pano', 'Vela de capa e tormentim, aproado a cerca de 50° do vento', 'Funciona se há espaço à frente e o mar não é grande demais; cansativo'],
          ['Correr com o tempo (de popa)', 'Arvorando pouco pano ou nenhum, andando com as ondas, às vezes com drogue pela popa', 'Dá velocidade e conforto, mas exige espaço de mar e arrisca <i>broaching</i> (atravessar) e emborcamento'],
          ['Âncora de arrasto (drogue)', 'Cabos e cones ou correntes pela popa, que freiam o barco e o mantêm de popa para o mar', 'Reduz velocidade e o risco de atravessar; precisa de pontos de fixação fortes e proteção contra atrito'],
          ['Âncora de capa (paraquedas)', 'Paraquedas largado pela proa, com cabo longo e proteção contra atrito', 'Mantém a proa ao mar; carga enorme sobre cabo e cunhos; difícil de recolher'],
        ], legenda: 'Resumo da literatura de mau tempo (Coles, Pardey, Rousmaniere). Cada barco responde diferente: o que funciona no seu depende do casco, da quilha e do mar.' },
        { t: 'widget', w: 'manobras', opts: { manobra: 'capear' }, legenda: 'Capear passo a passo: veja a vela de proa a contra, a grande rizada e o leme. Treine com vento de 15 a 20 nós, antes de precisar.' },
        { t: 'h', txt: 'O perigo do mar de popa' },
        { t: 'p', html: 'Correr com o vento e o mar pela popa parece fácil: o barco anda, o vento aparente cai e o conforto parece bom. Mas a NORMAM-211 alerta para um perigo concreto.' },
        { t: 'fato', ref: 'extra-travessia-2-10', html: 'Com mar de popa ou de alheta, podem ocorrer amplitudes de jogo excessivas ou perda de estabilidade nas cristas das ondas, com risco de emborcamento; a situação é particularmente perigosa quando o comprimento da onda é de 1,0 a 1,5 vez o comprimento da embarcação, e a velocidade ou a rota devem ser alteradas.' },
        { t: 'p', html: 'Em palavras simples: se a distância entre duas cristas é parecida com o comprimento do seu barco, ele pode ficar “montado” na crista, com a popa sem apoio e o leme sem efeito, e atravessar. Nesse caso, mude a velocidade (use um drogue para frear) ou o rumo.' },
        { t: 'h', txt: 'Antes de escolher' },
        { t: 'lista', itens: [
          '<b>Espaço de mar:</b> quanto há de mar livre a sotavento? Correr com tempo exige centenas de milhas livres.',
          '<b>Estado da tripulação:</b> quem está cansado, enjoado ou ferido? O que cada um aguenta?',
          '<b>Estado do barco:</b> o leme aguenta? A água entra? Qual a rigidez do mastro?',
          '<b>Mar e vento:</b> altura e direção das ondas, se estão quebrando, mudança de vento esperada (passagem de frente).',
          '<b>A mudança de tática custa:</b> trocar de ideia no meio da tempestade é perigoso. Decida cedo.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Evite o piloto automático', html: 'A NORMAM-211 recomenda manter fechadas as aberturas por onde a água pode entrar no casco e evitar o piloto automático em condições adversas, por ele não permitir mudar rumo ou velocidade com presteza. Em mar grosso, governe à mão (ou com o piloto de vento, se tiver), com a tripulação engatada.' },
        { t: 'fato', ref: 'extra-travessia-2-11', html: 'Em condições climáticas adversas, a NORMAM-211 recomenda manter fechadas todas as aberturas por onde a água possa entrar no casco e evitar o piloto automático.' },
        { t: 'check', questoes: [
          Q('trav2-m9-l3-q1', 'Travessia: mau tempo', 2, 'O que significa “capear” (heave-to)?',
            ['Parar o barco quase por completo, com a vela de proa a contra, a grande rizada e o leme todo para orçar (cana a sotavento).', 'Navegar a todo pano com o vento de popa.', 'Lançar a âncora de proa no fundo do mar.', 'Arriar todas as velas e ligar o motor.'], 0,
            'Capear é uma tática para fazer o barco “estacionar” quase parado, em ângulo com o vento, com as velas em oposição. Não é navegar a todo pano, nem fundear, nem ligar o motor.', 'Coles, Heavy Weather Sailing; manobras (widget)'),
          Q('trav2-m9-l3-q2', 'Travessia: mau tempo', 3, 'Segundo a NORMAM-211 (Anexo 4-B), quando o mar de popa é especialmente perigoso?',
            ['Quando o comprimento da onda é de 1,0 a 1,5 vez o comprimento da embarcação.', 'Quando a onda tem menos de 1 m.', 'Quando o vento está abaixo de 5 nós.', 'Quando a embarcação está fundeada.'], 0,
            'Ondas com comprimento da ordem do comprimento do barco podem desestabilizar o barco nas cristas. Nesse caso, a velocidade e o rumo devem ser alterados.', 'NORMAM-211, Anexo 4-B, item 1.8; fato extra-travessia-2-10', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m9-l3-q3', 'Travessia: mau tempo', 2, 'Qual é o papel de um drogue (âncora de arrasto) ao correr com o tempo?',
            ['Frear o barco pela popa e mantê-lo de popa para as ondas, reduzindo o risco de atravessar.', 'Aumentar a velocidade do barco.', 'Servir de reserva de combustível.', 'Substituir o leme.'], 0,
            'O drogue freia e estabiliza a popa, mantendo o barco alinhado com as ondas. Não aumenta a velocidade nem substitui leme ou combustível.', 'Coles, Heavy Weather Sailing; Pardey, Storm Tactics Handbook'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 4-B: recomendações ao navegante (mar de popa, aberturas, piloto automático)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-10' },
          { txt: 'Adlard Coles, <i>Heavy Weather Sailing</i>; Lin e Larry Pardey, <i>Storm Tactics Handbook</i>; John Rousmaniere, <i>Fastnet, Force 10</i> (referências técnicas, sem link)' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Preparar o barco e a tripulação antes do vento', minutos: 12,
      objetivos: [
        'Executar uma lista de preparação para mau tempo com base em gatilhos objetivos.',
        'Escolher o pano (rizos, vela de capa, tormentim) conforme o vento.',
        'Cuidar da tripulação durante o evento (descanso, comida, engate).',
      ],
      blocos: [
        { t: 'p', html: 'Mau tempo bem recebido é cansativo. Mau tempo mal recebido é perigoso. A diferença está em horas de preparação: calma, antecedência e checklists. Depois que a tempestade chega, quase tudo vira difícil.' },
        { t: 'h', txt: 'Gatilhos' },
        { t: 'p', html: 'Defina de antemão o que faz a tripulação passar para o modo “mau tempo”. Alguns gatilhos possíveis: um aviso de mau tempo do CHM (vento força 7 ou mais, ondas de 3 m ou mais); uma previsão de GRIB mostrando vento acima do que o barco enfrenta bem; queda rápida do barômetro; uma massa de nuvens que se aproxima. Ao primeiro gatilho, comece a lista.' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Pano:</b> reduza o pano com antecedência; prepare a vela de capa e o tormentim.',
          '<b>Convés:</b> reduza o que há de solto, amarre o bote e fixe os galões.',
          '<b>Aberturas:</b> escotilhas, gaiutas, vigias, ventiladores fechados; tampa de saída de cockpit; tábuas da gaiuta no lugar.',
          '<b>Peias:</b> tudo peado também embaixo: panelas, caixa de ferramentas, baterias, garrafas.',
          '<b>Bombas:</b> teste as bombas manuais e elétricas; verifique as válvulas de fundo.',
          '<b>Sistema de engate:</b> jackstays montados, arnês de cada tripulante pronto e ajustado.',
          '<b>Comunicação:</b> VHF portátil, EPIRB, GPS portátil e lanternas carregados no grab bag ou perto.',
          '<b>Comida e água:</b> cozinhe uma refeição quente antes, encha garrafas térmicas e deixe lanches ao alcance.',
          '<b>Pessoas:</b> distribua o descanso e reduza a escala de quarto. Quem enjoa recebe medicamento antes.',
          '<b>Avise:</b> informe alguém em terra (e-mail, satélite) sobre a posição e a previsão.',
        ] },
        { t: 'h', txt: 'Que pano levar' },
        { t: 'fato', ref: 'travessia-32', html: 'Cat. 1 e 2 das OSR: vela de capa (storm trysail) ou rizo que reduza a testa da grande em pelo menos 50%; buja de mau tempo (Cat. 0 a 3) e buja de tempestade/storm jib (Cat. 0 a 2).' },
        { t: 'p', html: 'Não basta ter as velas de mau tempo a bordo: é preciso saber <b>içá-las</b> sem treino em plena tempestade. Faça um ensaio em dia de vento moderado: coloque a vela de capa no trilho próprio, o tormentim num estai interno (ou numa vela enrolável pesada), e veja como o barco anda e capeia.' },
        { t: 'widget', w: 'manobras', opts: { manobra: 'rizar', variante: '2' }, legenda: 'Rizar a grande no 2º rizo passo a passo. Treine com a tripulação toda, de dia e de noite.' },
        { t: 'h', txt: 'Bombas, engate e segurança' },
        { t: 'fato', ref: 'travessia-33', html: 'Mo 0–2: bomba de emergência fixa ou portátil (bateria ou motor) com capacidade nominal mínima de 200 L/min.' },
        { t: 'fato', ref: 'travessia-39', html: 'Tirante (tether) ISO 12401 de no máximo 2 m, com mosquetões autotravantes e indicador de sobrecarga; além disso, um tirante de até 1 m ou mosquetão intermediário no de 2 m.' },
        { t: 'fato', ref: 'extra-travessia-2-12', html: 'A NORMAM-211 recomenda que todas as peças, equipamentos e objetos a bordo sejam armazenados e peados adequadamente antes da viagem, para que o estado do mar não cause avarias nem fira a tripulação.' },
        { t: 'h', txt: 'Cuidar da tripulação' },
        { t: 'lista', itens: [
          'Revezamento: ninguém fica mais do que o combinado no timão.',
          'Descanso: mande dormir quem pode, mesmo sem sono; o corpo cobra depois.',
          'Calor e comida: bebidas quentes e doces ajudam muito, mesmo para quem enjoa.',
          'Moral: voz calma do comandante, tarefas simples e claras, sem gritaria.',
          'Registro: anote hora, rumo, vento e barômetro de hora em hora.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Ninguém sai sem engate', html: 'Com mar grosso, só se sai do cockpit com o arnês engatado e sempre avisando quem fica. Ao menor sinal de que alguém está cansado demais para governar, troque.' },
        { t: 'check', questoes: [
          Q('trav2-m9-l4-q1', 'Travessia: mau tempo', 1, 'Pelas OSR, qual vela de mau tempo as Categorias 1 e 2 exigem além da buja?',
            ['Vela de capa (storm trysail) ou rizo que reduza a testa da grande em pelo menos 50%.', 'Um balão simétrico grande.', 'Um genoa de 150%.', 'Nenhuma vela adicional.'], 0,
            'A OSR exige uma vela de capa ou rizo que reduza a testa da grande em pelo menos 50%, além da buja de mau tempo e, nas Cat. 0 a 2, a de tempestade. Balões e genoas grandes são o oposto do que se busca.', 'OSR; fato travessia-32', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m9-l4-q2', 'Travessia: mau tempo', 2, 'Qual a capacidade mínima da bomba de emergência exigida pelas OSR para monocascos Cat. 0 a 2?',
            ['200 litros por minuto.', '20 litros por minuto.', '2.000 litros por minuto.', 'Nenhuma capacidade é exigida.'], 0,
            'A OSR pede bomba de emergência com capacidade nominal mínima de 200 L/min. Valores muito menores não dão conta de uma entrada de água, e a norma é explícita.', 'OSR; fato travessia-33', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m9-l4-q3', 'Travessia: mau tempo', 2, 'O que é um bom gatilho para iniciar a preparação de mau tempo?',
            ['Um aviso do CHM de vento força 7 ou mais, ou uma previsão de GRIB que supere o que o barco enfrenta bem.', 'Quando o vento já está em 50 nós e o barco adernado.', 'Somente depois de a primeira onda quebrar no convés.', 'Quando a bateria do rádio acabar.'], 0,
            'Gatilhos objetivos e antecipados permitem preparar com calma. Esperar o pior acontecer significa preparar no escuro, cansado e com mar grosso.', 'CHM; fato travessia-96; boa marinharia'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: velas de mau tempo e bomba de emergência', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-32' },
          { txt: 'NORMAM-211/DPC, Anexo 4-B: recomendações ao navegante', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-12' },
          { txt: 'Adlard Coles, <i>Heavy Weather Sailing</i> (preparação do barco)' },
        ] },
      ],
    },
    {
      id: 'l5', titulo: 'Depois do vento: avaliar danos e recomeçar', minutos: 9,
      objetivos: [
        'Fazer uma vistoria completa do barco e da tripulação depois de um evento de mau tempo.',
        'Decidir entre seguir viagem, reparar no mar ou desviar para um porto.',
        'Comunicar acidentes à Autoridade Marítima quando necessário.',
      ],
      blocos: [
        { t: 'p', html: 'Passada a tempestade, vem a tentação de relaxar. Resista: muitos problemas aparecem só depois, quando o cansaço bateu e a atenção caiu. Faça uma vistoria sistemática, com a tripulação descansada.' },
        { t: 'h', txt: 'Vistoria depois do mau tempo' },
        { t: 'tabela', cab: ['Área', 'O que verificar'], linhas: [
          ['Casco e estrutura', 'Vazamentos, rachaduras, esforços na quilha e no leme, porões com água, nível das bombas'],
          ['Mastro e cordoalha', 'Esticadores, cupilhas, passadores, estais, brandais, olhais, terminais e cruzeta; olhe de baixo para cima com binóculo'],
          ['Velas e cabos', 'Costuras, rasgos, atrito, adriças e escotas gastas'],
          ['Leme e direção', 'Folgas, ruídos, piloto automático, direção de emergência'],
          ['Motor e energia', 'Óleo, filtros, correias, baterias, conexões; teste de partida'],
          ['Eletrônicos e comunicação', 'GPS, rádio, AIS, luzes de navegação, EPIRB (sem ativar)'],
          ['Convés e equipamentos', 'Jackstays, guarda-mancebos, bote, balsa, tormentim e âncoras'],
          ['Tripulação', 'Ferimentos, hidratação, comida, sono; converse sobre o que aconteceu'],
        ], legenda: 'Faça a ronda por escrito e anote no diário de bordo.' },
        { t: 'h', txt: 'Reparar, seguir ou desviar' },
        { t: 'lista', itens: [
          'Avarias que <b>ameaçam a segurança</b> (entrada de água, rig comprometido, perda de leme): desvie ou peça auxílio.',
          'Avarias que <b>limitam o desempenho</b> (vela rasgada, perda de um instrumento): repare, reduza velocidade e siga com um plano alternativo.',
          'Dúvida: pergunte ao comandante e, se for o caso, peça orientação por rádio ou satélite.',
        ] },
        { t: 'fato', ref: 'extra-travessia-2-13', html: 'O comandante deve comunicar à Autoridade Marítima os acidentes ocorridos com sua embarcação (naufrágio, encalhe, colisão, abalroamento, água aberta, explosão, incêndio ou varação).' },
        { t: 'callout', tipo: 'nota', titulo: 'Comunique e registre', html: 'Anote no diário de bordo o que aconteceu, as horas e as providências. Se houve acidente com a embarcação, comunique à Autoridade Marítima (Capitania) assim que chegar ao porto. O registro também ajuda o seguro.' },
        { t: 'h', txt: 'Reparos de emergência no mar' },
        { t: 'p', html: 'Leve ferramentas e sobressalentes para os reparos que mais acontecem. Sem pretender substituir o conserto em porto, eles mantêm o barco seguro até o destino:' },
        { t: 'lista', itens: [
          '<b>Vela rasgada:</b> fita autoadesiva de vela e, depois, costura à mão com agulha e linha de vela; se o rasgo for grande, troque a vela por outra.',
          '<b>Esticador solto ou cupilha perdida:</b> reaperte, ponha cupilha ou fita; se faltar, aperte provisoriamente com arame ou cabo.',
          '<b>Cabo gasto:</b> inverta as pontas, corte a parte danificada ou troque por um sobressalente.',
          '<b>Mastro ou estai com dúvida:</b> reduza o pano e as manobras de carga; reforce com uma adriça extra; evite cambar com vento forte.',
          '<b>Vazamento:</b> identifique a origem, use tampão de madeira ou massa epóxi submarina e bomba até o porto.',
        ] },
        { t: 'h', txt: 'Aprenda com o evento' },
        { t: 'p', html: 'Reúna a tripulação, sem apontar culpados, e converse: o que funcionou, o que não funcionou, o que mudaria na próxima. Atualize as listas e as ordens do comandante. A tripulação que processa um susto fica mais forte; a que o guarda em silêncio fica mais frágil.' },
        { t: 'check', questoes: [
          Q('trav2-m9-l5-q1', 'Travessia: mau tempo', 1, 'Quando se deve fazer uma vistoria completa do barco depois do mau tempo?',
            ['Assim que o vento amainar e a tripulação estiver descansada, e registrar o resultado no diário.', 'Somente ao chegar ao porto de destino.', 'Nunca: o barco aguentou, então está bem.', 'Somente se algo quebrar de forma visível.'], 0,
            'Danos ocultos (rig, leme, cascos, vazamentos) aparecem só em vistoria. Esperar chegar ao porto ou confiar no “aguentou” é arriscado.', 'Boa marinharia; NORMAM-211, Anexo 4-B'),
          Q('trav2-m9-l5-q2', 'Travessia: mau tempo', 2, 'Quais acidentes a NORMAM-211 manda comunicar à Autoridade Marítima?',
            ['Naufrágio, encalhe, colisão, abalroamento, água aberta, explosão, incêndio ou varação.', 'Somente colisões com navios.', 'Apenas acidentes com mortes.', 'Nenhum: a comunicação é opcional.'], 0,
            'O Anexo 4-B lista naufrágio, encalhe, colisão, abalroamento, água aberta, explosão, incêndio e varação como acidentes a comunicar. Limitar-se a colisões com navios ou a casos com mortes deixa de fora quase todos eles, e a comunicação não é opcional.', 'NORMAM-211, Anexo 4-B, item 1.2; fato extra-travessia-2-13', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m9-l5-q3', 'Travessia: mau tempo', 2, 'Uma avaria que pode causar entrada de água ou perda de leme deve ser tratada como?',
            ['Ameaça à segurança: desviar ou pedir auxílio, conforme a gravidade.', 'Uma questão cosmética que pode esperar o porto.', 'Algo que a tripulação pode ignorar por alguns dias.', 'Motivo para ligar a EPIRB sem avaliar.'], 0,
            'Avarias de segurança exigem ação imediata: reparo emergencial, desvio ou pedido de ajuda. Ativar a EPIRB só cabe quando há perigo grave e iminente.', 'RIPEAM Anexo IV; boa marinharia'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 4-B: comunicação de acidentes', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-13' },
          { txt: 'Nigel Calder, <i>Boatowner’s Mechanical and Electrical Manual</i>; Adlard Coles, <i>Heavy Weather Sailing</i>' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm10', titulo: 'Emergências oceânicas',
  resumo: 'Homem ao mar de noite, alagamento, incêndio, leme quebrado, mastro caído e abandono do barco: o que fazer nos primeiros minutos, que equipamento ajuda e como pedir socorro (SALVAMAR, MRCC).',
  licoes: [
    {
      id: 'l1', titulo: 'Homem ao mar, de dia e à noite', minutos: 14,
      objetivos: [
        'Aplicar a sequência dos primeiros 60 segundos de um homem ao mar.',
        'Escolher entre a parada rápida e a manobra do oito conforme o barco e a tripulação.',
        'Entender o equipamento que ajuda a achar e a recolher quem caiu, principalmente à noite.',
      ],
      blocos: [
        { t: 'callout', tipo: 'seguranca', titulo: 'A melhor manobra é não cair', html: 'No oceano, recuperar alguém que cai é difícil, e à noite é ainda mais. Use o arnês e o tirante engatado sempre que sair do cockpit à noite, com mar grosso ou sozinho no convés. Estar preso ao barco ajuda, mas não encerra o problema: quem cai preso pode ser arrastado pela água. Nesse caso, reduza a velocidade e pare o barco, traga a pessoa para o lado alto e use um método de içamento treinado. O US Sailing avisa que, nos testes, içar pela adriça presa ao tirante quebrou o tirante.' },
        { t: 'termos', ids: ['homem-ao-mar', 'mob', 'ais-mob', 'jackline', 'tirante', 'boia-ferradura'] },
        { t: 'h', txt: 'Os primeiros 60 segundos' },
        { t: 'figura', svg: S('m10mob', 'Os cinco primeiros passos quando alguém cai no mar: gritar, lançar a boia, marcar a posição, apontar, manobrar', '0 0 520 190',
          '<defs><marker id="m10mob-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>' +
          '<g font-size="13" text-anchor="middle" fill="currentColor">' +
          '<rect x="8" y="34" width="86" height="100" rx="8" fill="var(--nav-red)" fill-opacity=".25" stroke="currentColor"/><text x="51" y="58" font-weight="700">1. Gritar</text><text x="51" y="80">“Homem ao</text><text x="51" y="96">mar a</text><text x="51" y="112">boreste!”</text>' +
          '<rect x="108" y="34" width="86" height="100" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="151" y="58" font-weight="700">2. Lançar</text><text x="151" y="80">boia,</text><text x="151" y="96">dan buoy</text><text x="151" y="112">e luz</text>' +
          '<rect x="208" y="34" width="86" height="100" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="251" y="58" font-weight="700">3. Marcar</text><text x="251" y="80">botão MOB</text><text x="251" y="96">do GNSS</text>' +
          '<rect x="308" y="34" width="86" height="100" rx="8" fill="var(--sea-2)" stroke="currentColor"/><text x="351" y="58" font-weight="700">4. Apontar</text><text x="351" y="80">uma pessoa</text><text x="351" y="96">só olha e</text><text x="351" y="112">aponta</text>' +
          '<rect x="408" y="34" width="104" height="100" rx="8" fill="var(--shoal)" stroke="var(--magenta)" stroke-width="2"/><text x="460" y="58" font-weight="700">5. Manobrar</text><text x="460" y="80">parada rápida</text><text x="460" y="96">ou oito, e</text><text x="460" y="112">pedir socorro</text></g>' +
          '<g stroke="currentColor" stroke-width="1.5" marker-end="url(#m10mob-a)"><line x1="94" y1="84" x2="106" y2="84"/><line x1="194" y1="84" x2="206" y2="84"/><line x1="294" y1="84" x2="306" y2="84"/><line x1="394" y1="84" x2="406" y2="84"/></g>' +
          '<text x="260" y="170" font-size="13" text-anchor="middle" fill="currentColor">tudo em paralelo: quem vê grita, quem está perto joga, o resto manobra</text>', 560),
          legenda: 'A ordem pode variar, mas estes cinco itens têm de ocorrer nos primeiros 60 segundos. O comandante ou quem está no timão manobra.' },
        { t: 'p', html: '<b>Rádio:</b> alerte também pelo VHF (canal 16) ou pelo DSC. As fontes divergem no tom: a RYA manda fazer Mayday ou alerta DSC, e o US Sailing (Peter Isler) fala em Mayday ou, no mínimo, Pan-Pan, conforme a situação. Longe de socorro, o Mayday ou o alerta DSC é a escolha mais segura, e dá para cancelar depois. <b>Vigia:</b> com cinco ou mais a bordo, o US Sailing manda designar um vigia fixo; com quatro ou menos talvez não seja possível dedicar alguém, e então pesam mais a flutuação lançada, o dan buoy e manter o barco perto. <b>Marca MOB:</b> o botão do GNSS marca onde a pessoa caiu, não onde ela está depois, e a busca precisa contar a deriva.' },
        { t: 'h', txt: 'Equipamento que ajuda' },
        { t: 'fato', ref: 'travessia-30', html: 'Cat. 0 a 2 das OSR: uma boia salva-vidas com luz de acendimento automático, apito e drogue, e uma segunda ao alcance do timoneiro com apito, drogue, luz e mastro com bandeira (dan buoy).' },
        { t: 'fato', ref: 'travessia-29', html: 'Cat. 0 a 2 das OSR: um localizador pessoal AIS de homem ao mar (AIS MOB beacon) para cada tripulante.' },
        { t: 'fato', ref: 'travessia-42', html: 'Em todas as categorias das OSR, ao menos uma vez por ano a tripulação deve praticar recuperação de homem ao mar e abandono da embarcação.' },
        { t: 'p', html: 'O <b>AIS MOB</b> pessoal transmite a posição de quem caiu para os AIS do barco e dos navios próximos, e dispara um alarme. É a melhor chance de achar alguém à noite, desde que esteja armado: no estudo do US Sailing, uma pessoa levou uma hora para perceber que o AIS estava desligado. O <b>dan buoy</b> (mastro com bandeira e luz) marca o local na água, e a boia com luz ajuda a localizar à noite.' },
        { t: 'h', txt: 'As duas manobras de retorno' },
        { t: 'p', html: 'A <b>parada rápida</b> (quick stop): vire logo para o vento, sem soltar a vela de proa (que fica a contravento), para ficar perto de quem caiu; continue girando, arribe, jaibe e faça a aproximação final em <b>bolina folgada</b>, em baixa velocidade. A <b>manobra do oito</b> (reach-tack-reach): navegue de través por uns instantes (de 2 a 5 comprimentos do barco, ou cerca de 20 segundos, nos testes de 2005), cambe e volte também em bolina folgada. Ambas estão no simulador abaixo.' },
        { t: 'h', txt: 'O que as fontes concordam e onde divergem' },
        { t: 'lista', itens: [
          'Gritar o lado, designar quem aponta e lançar já a flutuação, e tudo que flutue (US Sailing 2020 e 2025; RYA).',
          'Marcar o MOB, alertar pelo rádio e ficar perto: “a distância é o inimigo” (US Sailing).',
          'Voltar devagar, com controle, e fazer a aproximação final em bolina folgada (US Sailing; RYA via PBO).',
          'Motor em ponto morto até ter certeza de que não há cabos na água, e em ponto morto ou desligado junto da pessoa (US Sailing; RYA).',
          'Não encostar o casco na pessoa: cabo de arremesso, boia com retinida ou Lifesling.',
          'Pessoa inconsciente ou exausta: içar na horizontal, para evitar as complicações do “aperto hidrostático” (RYA).',
          'Treinar no próprio barco, em vento leve e forte, de dia e de noite (US Sailing; OSR 6.04).',
        ] },
        { t: 'tabela', cab: ['Ponto', 'Uma escola', 'Outra escola'], linhas: [
          ['Método de volta', 'Parada rápida (US Sailing; a maioria dos organizadores do simpósio de 2005)', 'Oito ou reach-tack-reach (RYA, via PBO); Fast Return e Deep Beam Reach, sem jaibe (simpósio de 2005)'],
          ['Lado do recolhimento', 'Barco a barlavento da pessoa, para o vento empurrá-lo até ela (RYA; quase unanimidade entre as vítimas dos testes de 2005)', 'Pessoa a barlavento do barco (RORC; US Sailing 2004). Em mar duro, o barco a barlavento pode ser jogado sobre a pessoa; num trimarã pesado, o casco pode atingi-la a sotavento'],
          ['Motor', 'Sob vela, salvo falta de vento (US Sailing, Quick-Stop, 2016)', 'Usar o motor sem hesitar e treinar também sem ele (US Sailing, Safety at Sea, v7.1)'],
          ['Velas', 'Não gastar tempo arriando velas: o tempo afasta o barco (US Sailing, v7.1)', 'Arriar ou enrolar a genoa antes do contato, porque escotas soltas ferem (vítimas dos testes de 2005; RORC)'],
          ['Velocidade de contato', 'Cerca de 1 nó; não arrastar a pessoa a mais de 1 nó (Annapolis; US Sailing)', '2 a 3 nós foram aceitos por vítimas; medir em tempo, não no velocímetro (simpósio de 2005)'],
          ['Contato', 'Lifesling em círculos, a pelo menos meio comprimento do barco (US Sailing)', 'Parar ao lado, com croque ou cabo (RYA, via PBO)'],
        ], legenda: 'Resumo das fontes citadas abaixo. “Barlavento” e “sotavento” são do barco. Não há uma técnica única: depende do vento, do mar, do barco e da tripulação.' },
        { t: 'widget', w: 'manobras', opts: { manobra: 'mob', variante: 'parada-rapida' }, legenda: 'Parada rápida e manobra do oito, com os comandos de voz e as tarefas de cada tripulante. Use o seletor para trocar de variante.' },
        { t: 'h', txt: 'À noite' },
        { t: 'lista', itens: [
          '<b>Não perca de vista:</b> uma pessoa só olha e aponta, sem desviar o olhar nem para ajudar.',
          '<b>Luz:</b> acenda o holofote ou a lanterna potente e a luz do convés; ligue o radar se tiver (um refletor radar na boia ajuda).',
          '<b>Chame socorro cedo:</b> faça Mayday e envie o DSC com posição enquanto manobra; se for desnecessário, cancele depois.',
          '<b>Sinais sonoros:</b> a pessoa na água tem apito; chame de volta e escute.',
          '<b>Motor:</b> só o ligue depois de ter certeza de que não há cabos na água; junto da pessoa, ponto morto ou desligado, para a hélice não feri-la. Treine também sem motor.',
        ] },
        { t: 'h', txt: 'Treinar de verdade' },
        { t: 'lista', itens: [
          'Use um boneco ou um balde com peso (nunca um tripulante) nos primeiros treinos, com mar calmo.',
          'Cronometre: quanto tempo leva do grito à volta junto ao boneco? Repita de dia e à noite.',
          'Revezem as funções: todos devem saber governar, apontar, lançar a boia e usar o rádio.',
          'Pratique a recuperação com um voluntário, num porto abrigado e com um barco de apoio, para testar a escada, a cinta e a talha.',
          'Revise o que deu errado e ajuste os comandos de voz e os postos de cada um.',
        ] },
        { t: 'h', txt: 'Recolher e tratar' },
        { t: 'p', html: 'Trazer um adulto pesado e molhado de volta a bordo é difícil, principalmente se ele está exausto ou machucado. Planeje o método antes: escada de popa, cinta de içamento com adriça e catraca, ou um sistema de talhas. Se a pessoa estiver inconsciente ou exausta, ice-a na horizontal. Um Lifesling ou equivalente ajuda a conectar sem encostar o casco. Ensaie com um tripulante de verdade. Depois, trate de hipotermia, afogamento ou lesões e considere pedir orientação médica.' },
        { t: 'check', questoes: [
          Q('trav2-m10-l1-q1', 'Travessia: emergências', 1, 'O que uma pessoa do barco deve fazer, sem outra tarefa, durante um homem ao mar?',
            ['Manter os olhos fixos em quem caiu e apontar a direção continuamente.', 'Preparar o jantar da tripulação.', 'Ligar o piloto automático e descer.', 'Cuidar apenas do rádio.'], 0,
            'Perder o contato visual, principalmente à noite, é o maior risco. Uma pessoa só olha e aponta. Outras tarefas (rádio, manobra) ficam com outros tripulantes.', 'RYA / World Sailing OSR 6.02 (homem ao mar)'),
          Q('trav2-m10-l1-q2', 'Travessia: emergências', 2, 'O que as OSR (Cat. 0 a 2) exigem de equipamento pessoal de localização para cada tripulante?',
            ['Um localizador pessoal AIS de homem ao mar (AIS MOB) para cada tripulante.', 'Um apito apenas.', 'Um GPS de mão para cada tripulante.', 'Nada: a boia do barco basta.'], 0,
            'A OSR pede um AIS MOB pessoal por tripulante nas Categorias 0 a 2: ao ser acionado, ele alerta o barco e os navios próximos e mostra a posição. O apito só se ouve de perto e o GPS de mão não transmite nada. A boia do barco ajuda no resgate, mas não localiza ninguém.', 'OSR; fato travessia-29', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
          Q('trav2-m10-l1-q3', 'Travessia: emergências', 2, 'Por que se treina o homem ao mar ao menos uma vez por ano?',
            ['Porque a manobra, a divisão de tarefas e a recuperação só funcionam com treino; é exigência das OSR em todas as categorias.', 'Porque o regulamento exige que o treino ocorra em dia de tempestade.', 'Porque o treino substitui o uso do arnês.', 'Porque a Marinha proíbe treinos fora do porto.'], 0,
            'A OSR pede prática anual de homem ao mar e de abandono, porque sob estresse só se executa bem o que foi treinado. O treino não substitui o arnês, nenhuma regra manda treinar em tempestade e treinar fora do porto é justamente o que se recomenda.', 'OSR; fato travessia-42', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: boias, AIS MOB e treinamento anual', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-30' },
          { txt: 'US Sailing, York et al., A Study Evaluating MOB Return and Recovery in the 21st Century (2020)', url: 'https://www.ussailing.org/wp-content/uploads/2024/05/2020.New-Study-Evaluating-MOB-Return-and-Recovery-in-the-21st-Century.pdf' },
          { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v7.1)', url: 'https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf' },
          { txt: 'US Sailing, Quick-Stop Rescue (2016)', url: 'https://www.ussailing.org/news/quick-stop-rescue/' },
          { txt: 'US Sailing, Isler, Man Overboard Rescue Procedure (2016)', url: 'https://www.ussailing.org/news/man-overboard-rescue-procedure/' },
          { txt: 'US Sailing, Rousmaniere, Final Report, 2005 Crew Overboard Rescue Symposium', url: 'https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf' },
          { txt: 'US Sailing, Arthur B. Hanson Rescue Medal (2004): quick-stop e o lado do recolhimento', url: 'https://www.ussailing.org/wp-content/uploads/2018/01/5_15_04.pdf' },
          { txt: 'RYA, Man overboard (choque por água fria, içar na horizontal)', url: 'https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/' },
          { txt: 'Practical Boat Owner, Man overboard turns (reach-tack-reach, RORC quick-stop)', url: 'https://www.pbo.co.uk/seamanship/man-overboard-turns-getting-back-to-the-casualty-in-the-water-104939' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Alagamento e colisão', minutos: 12,
      objetivos: [
        'Reagir a uma entrada de água: localizar, estancar, esgotar e decidir.',
        'Preparar o barco para essas emergências (tampões, bombas, válvulas).',
        'Saber o que fazer depois de um choque com um objeto flutuante ou outra embarcação.',
      ],
      blocos: [
        { t: 'p', html: 'Água dentro do barco é uma das emergências mais frequentes e mais perigosas. Pode vir de uma válvula de fundo, de um tubo, do eixo da hélice, do leme, de um choque com um container flutuante ou uma baleia, ou de uma onda que entra pela gaiuta. O que decide o desfecho é a rapidez para achar a origem e para esgotar mais do que entra.' },
        { t: 'termos', ids: ['bomba-de-esgoto', 'valvula-de-fundo', 'passa-casco', 'sentina', 'porao'] },
        { t: 'figura', svg: S('m10vaz', 'Perfil de um veleiro de cruzeiro com os pontos onde mais entra água: válvulas de fundo e passa-cascos, prensa-gaxeta do eixo, mecha do leme, parafusos da quilha e colisão na proa', '0 0 520 250',
          '<path d="M30 110 L470 110 Q500 118 490 130 Q440 188 360 198 L120 198 Q60 190 30 150 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
          '<path d="M30 110 L470 110" stroke="currentColor" stroke-width="3"/>' +
          '<line x1="20" y1="170" x2="500" y2="170" stroke="var(--sea-3)" stroke-dasharray="5 4"/><text x="506" y="174" font-size="13" fill="currentColor"/>' +
          '<path d="M250 198 L270 238 L330 238 L340 198Z" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/>' +
          '<g fill="var(--magenta)"><circle cx="150" cy="190" r="6"/><circle cx="215" cy="190" r="6"/><circle cx="82" cy="165" r="6"/><circle cx="296" cy="200" r="6"/><circle cx="462" cy="130" r="6"/></g>' +
          '<g stroke="currentColor" fill="none"><line x1="150" y1="184" x2="150" y2="60"/><line x1="215" y1="184" x2="260" y2="32"/><line x1="82" y1="160" x2="50" y2="96"/><line x1="296" y1="204" x2="400" y2="232"/><line x1="462" y1="124" x2="430" y2="60"/></g>' +
          '<g font-size="13" fill="currentColor"><text x="150" y="56" text-anchor="middle">válvulas de fundo</text><text x="270" y="28" text-anchor="start">eixo da hélice (gaxeta)</text><text x="14" y="90" text-anchor="start">leme (mecha)</text><text x="404" y="244" text-anchor="start">quilha (parafusos)</text><text x="432" y="54" text-anchor="start">proa (choque)</text></g>', 560),
          legenda: 'Pontos de entrada de água mais comuns. Marque, em cada válvula de fundo, um tampão de madeira do tamanho certo, preso a ela por um fio.' },
        { t: 'h', txt: 'Prevenção' },
        { t: 'lista', itens: [
          'Inspecione as válvulas de fundo e as mangueiras todo mês: braçadeiras duplas de aço inox nas mangueiras abaixo da linha d’água e válvulas que abrem e fecham com facilidade.',
          'Teste as bombas (a manual, em especial) e confira se as bocas de sucção estão limpas.',
          'Verifique a gaxeta do eixo, a mecha do leme, os parafusos da quilha e as marcas de infiltração no porão.',
          'Instale um alarme de nível de água na sentina e conheça o ruído normal do barco.',
          'Marque o caminho da água: saiba para onde a água vai quando o barco inclina.',
        ] },
        { t: 'h', txt: 'O que fazer, em ordem' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Avise e mobilize:</b> grite “água entrando!”. Todos engatados, sem pânico.',
          '<b>Bombeie já:</b> ligue as bombas elétricas e comece a bombear à mão. Esgotar dá tempo para achar a origem.',
          '<b>Procure a origem:</b> comece pelas válvulas de fundo, passa-cascos, mangueiras e braçadeiras. Água doce vem do tanque; salgada, do mar. Escute, olhe com lanterna.',
          '<b>Estanque:</b> feche a válvula; crave um tampão de madeira no orifício; use massa epóxi submarina; para um buraco maior, use uma vela ou colchão, amarrada por fora com cabos, para criar um “curativo” (esteira de colisão).',
          '<b>Levante a avaria:</b> mude de bordo ou desloque peso para que o furo fique acima da linha d’água, e reduza a velocidade para diminuir a pressão da água.',
          '<b>Decida:</b> se a entrada supera a capacidade das bombas, faça Pan-Pan ou Mayday, prepare a balsa e o grab bag, e desça só quando a balsa estiver na água.',
        ] },
        { t: 'fato', ref: 'travessia-33', html: 'Mo 0–2: bomba de emergência fixa ou portátil (bateria ou motor) com capacidade nominal mínima de 200 L/min.' },
        { t: 'fato', ref: 'extra-travessia-2-11', html: 'Em condições climáticas adversas, a NORMAM-211 recomenda manter fechadas todas as aberturas por onde a água possa entrar no casco.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Só abandone com a balsa na água', html: 'Enquanto flutua, o barco costuma ser mais seguro que a balsa. Quando for preciso abandonar, passe do convés direto para a balsa, a seco, sem cair na água. A frase em inglês é “step up into the liferaft” (suba para a balsa).' },
        { t: 'h', txt: 'Depois de uma colisão' },
        { t: 'lista', itens: [
          'Cheque as pessoas, depois o casco, a quilha, o leme e o mastro, de proa a popa. Olhe por dentro, nos compartimentos da proa e da popa.',
          'Se a colisão foi com outra embarcação, troque informações e ajude quem precisa. Se houve avaria grave ou ferido, peça auxílio.',
          'Comunique o acidente à Autoridade Marítima ao chegar ao porto.',
          'Registre horas, posição, o que aconteceu e os reparos no diário de bordo.',
        ] },
        { t: 'fato', ref: 'extra-travessia-2-13', html: 'O comandante deve comunicar à Autoridade Marítima os acidentes ocorridos com sua embarcação (naufrágio, encalhe, colisão, abalroamento, água aberta, explosão, incêndio ou varação).' },
        { t: 'check', questoes: [
          Q('trav2-m10-l2-q1', 'Travessia: emergências', 1, 'Qual é a primeira ação lógica ao descobrir água entrando no casco, ainda sem saber a origem?',
            ['Ligar as bombas e começar a esgotar, enquanto se procura a origem.', 'Esperar para ver se a água para.', 'Abandonar imediatamente o barco.', 'Pedir a todos que fiquem no cockpit sem agir.'], 0,
            'Esgotar dá tempo para achar e estancar a entrada. Esperar ou abandonar de imediato são reações ruins: o barco ainda flutua e é o melhor abrigo.', 'RYA / NORMAM-211, Anexo 4-B'),
          Q('trav2-m10-l2-q2', 'Travessia: emergências', 2, 'Para que serve ter, em cada válvula de fundo, um tampão de madeira preso por um fio?',
            ['Para vedar rapidamente o orifício se a válvula ou a mangueira se romper.', 'Para pesar o barco.', 'Para decoração.', 'Para evitar a corrosão da válvula.'], 0,
            'O tampão do tamanho certo veda o furo de uma mangueira rompida em segundos. Ele não pesa, não decora nem previne a corrosão.', 'Boa prática (Calder, Boatowner’s Manual)'),
          Q('trav2-m10-l2-q3', 'Travessia: emergências', 2, 'Qual capacidade mínima a OSR exige para a bomba de emergência dos monocascos Cat. 0 a 2?',
            ['200 litros por minuto.', '20 litros por minuto.', '50 litros por hora.', '2.000 litros por minuto.'], 0,
            'A OSR fixa 200 L/min como capacidade nominal mínima para as Categorias 0 a 2. Os outros valores ou são insuficientes ou irreais.', 'OSR; fato travessia-33', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: bomba de emergência', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-33' },
          { txt: 'NORMAM-211/DPC, Anexo 4-B', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-13' },
          { txt: 'Nigel Calder, <i>Boatowner’s Mechanical and Electrical Manual</i> (referência técnica, sem link)' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Incêndio a bordo', minutos: 11,
      objetivos: [
        'Explicar o triângulo do fogo e as classes de incêndio.',
        'Escolher o extintor certo para cada tipo de fogo.',
        'Seguir a sequência de resposta e decidir quando abandonar.',
      ],
      blocos: [
        { t: 'p', html: 'No mar, um incêndio é uma emergência de minutos: fumaça tóxica, plástico, combustível, gás. Prevenir é bem mais simples do que combater, e quase todo incêndio a bordo começa na cozinha, no motor ou na instalação elétrica.' },
        { t: 'termos', ids: ['triangulo-do-fogo', 'tetraedro-do-fogo', 'classes-de-incendio', 'extintor'] },
        { t: 'figura', svg: S('m10fogo', 'Triângulo do fogo com calor, combustível e oxigênio; retirar qualquer um dos três apaga o fogo', '0 0 520 310',
          '<path d="M260 26 L120 206 L400 206 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="2.5"/>' +
          '<g font-size="16" text-anchor="middle" fill="currentColor" font-weight="700"><text x="260" y="150">Fogo</text></g>' +
          '<g font-size="15" text-anchor="middle" fill="currentColor"><text x="260" y="18">Calor</text><text x="100" y="226">Combustível</text><text x="420" y="226">Oxigênio</text></g>' +
          '<g font-size="14" fill="currentColor"><text x="20" y="256">Tirar o calor: resfriar.</text><text x="20" y="276">Tirar o combustível: cortar o gás e o diesel.</text><text x="20" y="296">Tirar o ar: fechar o compartimento, abafar.</text></g>', 560),
          legenda: 'O fogo precisa de calor, combustível e oxigênio (e da reação em cadeia, no tetraedro). Tirar um deles apaga o incêndio.' },
        { t: 'h', txt: 'Prevenção' },
        { t: 'lista', itens: [
          '<b>Cozinha:</b> feche o botijão depois de usar, confira as mangueiras, mantenha pano e papel longe da chama. Veja a lição de provisões.',
          '<b>Motor:</b> sem vazamentos de óleo ou diesel, correias em dia, filtro de combustível limpo, sentina limpa de óleo.',
          '<b>Elétrica:</b> cabos com bitola correta, fusíveis e disjuntores dimensionados, conexões firmes e secas; cheire e olhe o quadro elétrico em cada ronda.',
          '<b>Combustível e solventes:</b> guarde em recipientes apropriados e ventilados, fora do alojamento.',
          '<b>Fumar:</b> só no cockpit, com cinzeiro, longe de gás e combustível.',
        ] },
        { t: 'h', txt: 'Classes de incêndio e extintores' },
        { t: 'fato', ref: 'extra-arrais-3-31', html: 'Na NORMAM-211, incêndio classe A é fogo em sólidos que deixam resíduos (madeira, papel, almofadas, fibra de vidro, borracha, plásticos) e é a única classe em que a água pode ser usada com segurança.' },
        { t: 'fato', ref: 'extra-travessia-2-21', html: 'Classe B é fogo em líquidos, gases e graxas combustíveis ou inflamáveis; classe C é fogo em equipamentos e instalações elétricas energizados (se desenergizados, o incêndio passa a ser classe A).' },
        { t: 'tabela', cab: ['Classe', 'Exemplo a bordo', 'Água?', 'Melhor resposta'], linhas: [
          ['A', 'Madeira, tecido, colchão, papel', 'Sim', 'Água, pó ABC'],
          ['B', 'Diesel, gasolina, óleo, gás da cozinha, álcool', 'Não', 'Pó BC ou ABC, CO2, espuma; cortar o combustível'],
          ['C', 'Quadro elétrico, bateria, fiação energizada', 'Não', 'Desligar a energia; pó, CO2'],
        ], legenda: 'Baseado na NORMAM-211, art. 4.27.2. Na dúvida, desligue a fonte (energia, gás, combustível) antes de atacar o fogo.' },
        { t: 'fato', ref: 'extra-arrais-3-36', html: 'De 6 m a menos de 12 m: dois extintores B-1 perto do motor e um B-1 no comando (localização recomendada); com tanque portátil de até 27 litros, basta um B-1 perto do motor.' },
        { t: 'fato', ref: 'extra-arrais-3-34', html: 'Capacidades extintoras mínimas: água 2-A; espuma mecânica 2-A:10-B; CO2 5-B:C; pó BC 20-B:C; pó ABC 2-A:20-B:C.' },
        { t: 'h', txt: 'O que fazer, em ordem' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Grite “fogo!”</b> e diga onde. Todos sabem seus postos.',
          '<b>Corte a fonte:</b> feche a válvula do gás, desligue o combustível e a energia (disjuntor geral).',
          '<b>Ataque a base do fogo</b> com o extintor adequado, a favor do vento, mantendo a saída nas costas. Use a técnica de varrer.',
          '<b>Não abra o compartimento do motor</b> se o fogo estiver lá dentro: o ar novo o aviva. Se a caixa do motor tiver um orifício de descarga para extintor, use-o; senão, abra só uma fresta pequena, com o extintor pronto.',
          '<b>Se o fogo cresce:</b> avise por rádio (Mayday se necessário), prepare a balsa e o grab bag, e posicione o barco para o vento levar chamas e fumaça para longe da tripulação (fogo à popa: proa ao vento; fogo à proa: popa ao vento).',
          '<b>Depois de apagar:</b> vigie por horas (reacendimento) e verifique danos e a segurança da estrutura.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Fumaça mata antes do fogo', html: 'A fumaça do plástico e da espuma queimados é tóxica. Não entre em compartimento fechado e cheio de fumaça sem proteção; é melhor abandonar a luta e salvar as pessoas.' },
        { t: 'callout', tipo: 'dica', titulo: 'Treine com o extintor', html: 'Em muitos portos e clubes, é possível praticar com extintores vencidos. Saber puxar o pino e apontar para a base vale mais que ter o melhor extintor do mercado.' },
        { t: 'check', questoes: [
          Q('trav2-m10-l3-q1', 'Travessia: emergências', 1, 'Em que classe de incêndio a água pode ser usada com segurança, segundo a NORMAM-211?',
            ['Classe A (sólidos que deixam resíduos).', 'Classe B (líquidos e gases inflamáveis).', 'Classe C (elétricos energizados).', 'Em nenhuma das classes.'], 0,
            'Só no fogo de classe A (madeira, papel, tecido etc.) a água pode ser usada com segurança. Em B ela espalha o combustível e em C conduz eletricidade.', 'NORMAM-211, art. 4.27.2; fato extra-arrais-3-31', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m10-l3-q2', 'Travessia: emergências', 2, 'Fogo na cozinha com óleo da panela pegando fogo. Qual a melhor resposta?',
            ['Desligar o gás, abafar com tampa ou cobertor antifogo e, se preciso, usar o extintor adequado, sem jogar água.', 'Jogar água para apagar mais rápido.', 'Levar a panela para o convés correndo.', 'Abrir todas as escotilhas e continuar a refeição.'], 0,
            'Óleo em chamas é classe B: a água espalha o fogo. Cortar o gás e abafar é a resposta; carregar a panela queima e derruba óleo.', 'NORMAM-211, art. 4.27.2'),
          Q('trav2-m10-l3-q3', 'Travessia: emergências', 2, 'Quais são os três elementos do triângulo do fogo?',
            ['Calor, combustível e oxigênio.', 'Água, ar e terra.', 'Fumaça, chama e cinza.', 'Gás, óleo e madeira.'], 0,
            'O fogo precisa de calor, combustível e oxigênio; retirar um deles apaga o incêndio. Os outros conjuntos não descrevem os elementos do fogo.', 'NORMAM-211, Anexo 5-A (programa de incêndio)'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 4.27: extintores e classes de incêndio', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-21' },
          { txt: 'Miguens, <i>Navegação: a ciência e a arte</i>, vol. I (combate a incêndio)' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Avaria de leme e leme de fortuna', minutos: 11,
      objetivos: [
        'Reconhecer as formas de perder o leme e reagir em segurança.',
        'Governar com as velas e com um leme de fortuna (improvisado).',
        'Preparar antes da travessia as peças e o plano para essa avaria.',
      ],
      blocos: [
        { t: 'p', html: 'Sem leme, um veleiro oceânico não fica inútil, mas fica difícil de dirigir e perigoso se o mar piora. As causas mais comuns são a quebra da cana ou da roda, o rompimento dos cabos de direção, a perda de parafusos e a quebra da mecha ou da pá do leme em um choque com um objeto flutuante.' },
        { t: 'termos', ids: ['leme', 'madre-do-leme', 'cana-do-leme', 'roda-de-leme', 'piloto-de-vento', 'leme-de-vento'] },
        { t: 'h', txt: 'Do mais simples ao mais difícil' },
        { t: 'tabela', cab: ['Situação', 'Solução', 'Observações'], linhas: [
          ['Cabos ou roda quebrados, leme inteiro', 'Cana de emergência encaixada na mecha (a OSR 4.15 exige uma nas Cat. 0 a 3; confira se o seu barco tem e se ela encaixa)', 'Treine o encaixe: difícil sob ondas. Leve a ferramenta à mão.'],
          ['Piloto automático falhou', 'Governe à mão, ou use o piloto de vento se houver', 'Cuidado com o cansaço nos quartos.'],
          ['Leme inutilizável, mastro e velas bons', 'Governe só com as velas, balanceando a grande e a de proa', 'Funciona em alguns pontos de vela; exige paciência.'],
          ['Leme perdido, sem solução simples', 'Leme de fortuna: remo longo ou pau de spinnaker com uma tábua; âncora flutuante (drogue) na popa para dirigir', 'Improvisação; pode ser muito lento, mas leva a um porto.'],
          ['Pá do leme avariada, eixo firme', 'Reforce, reduza a velocidade e navegue com cautela', 'Peça ajuda se há entrada de água pelo eixo.'],
        ], legenda: 'Resumo da literatura de reparos no mar. Cada barco tem seus equipamentos e sua geometria de leme: ensaie.' },
        { t: 'h', txt: 'Governar com as velas' },
        { t: 'p', html: 'Sem leme, o barco pode ser conduzido por <b>equilíbrio de velas</b>. Mais pano à proa faz o barco arribar; mais pano à popa faz o barco orçar. Ajuste a grande e a vela de proa até o barco seguir um rumo estável. É um bom exercício para treinar em dia calmo, antes de precisar dele.' },
        { t: 'lista', itens: [
          '<b>Para orçar:</b> folgue a vela de proa e aperte a grande.',
          '<b>Para arribar:</b> folgue a grande e aperte a vela de proa.',
          '<b>Mudar de rumo grande:</b> solte uma vela e aperte a outra por um tempo.',
          '<b>Piloto de vento:</b> alguns modelos governam o barco por um leme auxiliar próprio, mesmo sem o principal.',
        ] },
        { t: 'h', txt: 'Leme de fortuna' },
        { t: 'p', html: 'Um leme de fortuna é uma peça improvisada com materiais do barco: um remo grande, um pau de spinnaker, uma porta ou um tampo de mesa, presos a um pau comprido. Prenda-o à popa com cabos e controle-o com uma talha em cada bordo, ou use a âncora flutuante como leme: um cabo de cada lado puxa a popa para um lado ou outro. Tudo isso deve ter sido pensado antes, com um desenho simples.' },
        { t: 'figura', svg: S('m10leme', 'Vista de cima da popa de um veleiro com um leme de fortuna feito de um remo longo preso ao espelho, com duas talhas laterais para governar', '0 0 520 220',
          '<rect width="520" height="220" fill="var(--sea-1)"/>' +
          '<path d="M300 40 Q280 30 220 32 L220 188 Q280 190 300 180 Q330 150 330 110 Q330 70 300 40Z" fill="var(--land)" stroke="currentColor" stroke-width="2"/>' +
          '<text x="262" y="114" font-size="14" text-anchor="middle" fill="currentColor">cockpit</text>' +
          '<rect x="326" y="104" width="6" height="12" fill="currentColor"/>' +
          '<line x1="330" y1="110" x2="440" y2="110" stroke="var(--magenta)" stroke-width="6"/>' +
          '<rect x="430" y="90" width="64" height="40" rx="3" fill="var(--sea-3)" stroke="currentColor"/>' +
          '<text x="462" y="156" font-size="13" text-anchor="middle" fill="currentColor">remo/tábua (pá)</text>' +
          '<line x1="400" y1="110" x2="330" y2="52" stroke="currentColor" stroke-width="1.5"/>' +
          '<line x1="400" y1="110" x2="330" y2="168" stroke="currentColor" stroke-width="1.5"/>' +
          '<text x="352" y="44" font-size="13" fill="currentColor">talha de boreste</text><text x="352" y="188" font-size="13" fill="currentColor">talha de bombordo</text>' +
          '<text x="20" y="30" font-size="13" fill="currentColor">proa à esquerda</text>', 560),
          legenda: 'Exemplo de arranjo de leme de fortuna. As talhas (ou cabos) puxam o remo para um lado ou para o outro.' },
        { t: 'callout', tipo: 'dica', titulo: 'Teste antes de largar', html: 'Faça um teste: com vento calmo, tire o leme do jogo e tente governar com velas e com a cana de emergência. Anote o que funcionou e deixe a ferramenta e as peças em local conhecido.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Avise e reduza', html: 'Avise a tripulação, reduza pano, estabilize o barco (capeando, se for o caso) e só depois improvise. Se a perda de leme coincidir com mau tempo ou entrada de água, considere Pan-Pan.' },
        { t: 'check', questoes: [
          Q('trav2-m10-l4-q1', 'Travessia: emergências', 2, 'Sem leme, como orçar o barco usando só as velas?',
            ['Folgar a vela de proa e apertar a grande.', 'Folgar a grande e apertar a vela de proa.', 'Arriar a grande.', 'Abrir o spinnaker.'], 0,
            'A vela de proa empurra a proa para longe do vento (arriba) e a grande a leva para o vento (orça). Folgar a proa e apertar a grande faz o barco orçar.', 'Equilíbrio de velas (RYA)'),
          Q('trav2-m10-l4-q2', 'Travessia: emergências', 2, 'O que é um leme de fortuna?',
            ['Um leme improvisado com materiais do barco, como um remo ou pau de spinnaker, para governar até um porto.', 'Um leme novo comprado em porto estrangeiro.', 'O piloto automático com bateria extra.', 'A âncora flutuante usada como remo, sempre.'], 0,
            'É uma solução improvisada de emergência. O piloto automático e a compra em porto não são “de fortuna”. A âncora flutuante pode ajudar, mas não é a única forma.', 'Literatura de reparos no mar (Coles, Calder)'),
          Q('trav2-m10-l4-q3', 'Travessia: emergências', 2, 'O que fazer antes de improvisar o leme de fortuna?',
            ['Avisar a tripulação, reduzir pano e estabilizar o barco.', 'Içar todo o pano para ganhar velocidade.', 'Descer o mastro.', 'Ignorar o problema até o amanhecer.'], 0,
            'Avisar a todos, reduzir pano e estabilizar o barco cria condições seguras para improvisar o leme. Içar todo o pano aumenta a velocidade e a carga sobre o que resta do leme, descer o mastro não resolve a direção e esperar o amanhecer deixa o barco sem governo no escuro.', 'Boa marinharia'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'Adlard Coles, <i>Heavy Weather Sailing</i>; Nigel Calder, <i>Boatowner’s Mechanical and Electrical Manual</i>; RYA, <i>Yachtmaster Ocean</i> (reparos no mar; referências técnicas, sem link)' },
        ] },
      ],
    },
    {
      id: 'l5', titulo: 'Desarvoramento: mastro quebrado', minutos: 10,
      objetivos: [
        'Agir de imediato depois da queda do mastro para evitar furos no casco.',
        'Decidir entre cortar o equipamento caído e recuperá-lo.',
        'Preparar o plano de comunicação e de navegação sem mastro, incluindo antena de emergência.',
      ],
      blocos: [
        { t: 'p', html: '<b>Desarvoramento</b> é a perda do mastro (total ou parcial). Quase sempre acontece em mau tempo ou por falha de um estai, esticador ou terminal. É uma emergência assustadora, mas manejável se a tripulação souber o que fazer nos primeiros minutos.' },
        { t: 'termos', ids: ['mastro', 'aparelho-fixo', 'enxarcia', 'estai', 'brandal', 'esticador'] },
        { t: 'h', txt: 'Primeiros minutos' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Cheque as pessoas:</b> fique atento a feridos e a quem possa estar preso nos cabos ou nas velas.',
          '<b>Pare o motor</b> e proteja a hélice dos cabos que estão na água.',
          '<b>Observe o que está batendo no casco:</b> mastro e retranca, empurrados pelas ondas, podem furar o costado.',
          '<b>Decida rápido:</b> se o aparelho está batendo no casco, solte-o do barco. Só tente recuperá-lo se o mar permitir e nada ameaçar o casco. Há quem prefira prender o mastro junto ao costado, com defensas e cabos, em vez de cortar; no teste de desarvoramento da Yachting Monthly, o mastro quase escapou dos cabos e poderia ter furado o casco. Cortar é a resposta clássica; se não for possível nem cortar nem prender, peça ajuda.',
          '<b>Solte os terminais:</b> retirar a cupilha e o pino do esticador é a opção mais segura, quando dá para alcançar; senão, corte os brandais e estais com tesoura de cabos (bolt cutter) ou serra.',
          '<b>Posição do barco:</b> o destroço, preso pelos cabos, age como âncora flutuante, e o barco tende a ficar de través, a sotavento dele. Espere mais balanço, sem o mastro. Só ligue o motor quando tiver certeza de que não há cabos perto da hélice.',
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Ferramentas à mão', html: 'Leve a bordo uma tesoura de cabos (bolt cutter) ou serra de aço e saiba onde ela está, no escuro. Cortar um brandal em tensão pode ferir. Proteja os olhos e as mãos e deixe que o cabo caia para fora do barco.' },
        { t: 'h', txt: 'Recuperar o que se puder' },
        { t: 'p', html: 'Se os estais se soltaram sem perigo, é possível trazer o mastro para o convés com ajuda de cabos e talhas, e tentar um <b>mastro de fortuna</b> (jury rig): a própria retranca ou o pau de spinnaker, erguido na base do mastro, com uma vela pequena. Dá potência para chegar ao porto mais próximo, a baixa velocidade. Ensaie a ideia antes: ela depende da geometria do seu barco.' },
        { t: 'h', txt: 'Rádio e antena' },
        { t: 'p', html: 'Se a antena do VHF estava no topo do mastro, ela foi para o mar. Por isso a norma exige antena de emergência nos veleiros com antena no topo.' },
        { t: 'fato', ref: 'travessia-118', html: 'Veleiros com antena de VHF no topo do mastro devem ter antena de emergência para o caso de quebra do mastro.' },
        { t: 'fato', ref: 'travessia-14', html: 'Cat. 0 a 3 das OSR: rádio marítimo com antena de emergência quando a antena normal depender do mastro.' },
        { t: 'fato', ref: 'travessia-13', html: 'Cat. 1 (monocasco): um VHF portátil de no mínimo 5 W para cada grab bag, estanque ou com capa à prova d’água, guardado no grab bag.' },
        { t: 'p', html: 'Teste a antena de emergência antes de largar e a coloque num lugar de fácil acesso. Com ela, o VHF fixo ainda alcança alguns quilômetros. O telefone satelital e a EPIRB continuam funcionando independentemente do mastro.' },
        { t: 'h', txt: 'Navegar sem mastro' },
        { t: 'lista', itens: [
          'Use o motor com cuidado e economize combustível (a regra de 1/3).',
          'Defina o porto de destino mais próximo e considere pedir apoio (Pan-Pan) se a distância é grande.',
          'Com o aparelho de fortuna, aproveite os ventos de popa e evite a bolina.',
          'Mantenha vigilância e luzes de navegação em ordem (as luzes de topo podem ter caído).',
        ] },
        { t: 'check', questoes: [
          Q('trav2-m10-l5-q1', 'Travessia: emergências', 1, 'Qual é o principal perigo imediato depois da queda do mastro?',
            ['O mastro, as velas e os cabos batendo no casco, o que pode furá-lo; e a hélice presa nos cabos.', 'A perda da cor do casco.', 'O vento contrário.', 'A falta de maré.'], 0,
            'Mastro e retranca na água, empurrados por ondas, funcionam como aríete e podem furar o costado. Cabos na hélice impedem o uso do motor.', 'Literatura de reparos no mar (Coles; RYA)'),
          Q('trav2-m10-l5-q2', 'Travessia: emergências', 2, 'Por que os veleiros com antena de VHF no topo do mastro precisam de antena de emergência?',
            ['Porque, se o mastro quebrar, a antena normal se perde e o rádio fica sem alcance.', 'Porque a antena de topo não funciona com vento.', 'Porque a antena de emergência é mais barata.', 'Porque a Anatel proíbe antena no topo.'], 0,
            'A NORMAM-211 e as OSR exigem a antena de emergência para manter a comunicação quando o mastro cai. As outras razões não têm base normativa.', 'NORMAM-211; fato travessia-118', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m10-l5-q3', 'Travessia: emergências', 2, 'Que ferramenta é útil ter à mão para um desarvoramento?',
            ['Tesoura de cabos (bolt cutter) ou serra de aço, e saber onde estão no escuro.', 'Um martelo pequeno guardado no paiol.', 'Cola escolar.', 'Um alicate de unha.'], 0,
            'Brandais e estais de aço inox em tensão só se cortam com cortador de cabos (bolt cutter) ou serra de aço, e é preciso achá-los no escuro. Um martelo pequeno, cola ou alicate de unha não cortam esse cabo, e o tempo perdido põe o casco em risco.', 'World Sailing OSR (equipamentos); Coles, Heavy Weather Sailing'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: antena de emergência para veleiros com VHF no topo do mastro', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'travessia-118' },
          { txt: 'World Sailing, OSR 2026-2027: antena de emergência e VHF portátil no grab bag', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-14' },
          { txt: 'Yachting Monthly, teste de desarvoramento (destroço como âncora, prender ou cortar o mastro)', url: 'https://www.yachtingmonthly.com/sailing-skills/crash-test-boat-dismasting-29307' },
          { txt: 'Cruising World, Managing a dismasting', url: 'https://www.cruisingworld.com/story/how-to/safety-at-sea-managing-a-dismasting/' },
        ] },
      ],
    },
    {
      id: 'l6', titulo: 'Abandono do barco: balsa, grab bag, EPIRB e SALVAMAR', minutos: 14,
      objetivos: [
        'Decidir quando abandonar e como fazer isso de forma ordenada.',
        'Listar o que entra no grab bag e onde guardar balsa e EPIRB.',
        'Fazer uma chamada de socorro (Mayday) completa e acionar o SALVAMAR.',
      ],
      blocos: [
        { t: 'callout', tipo: 'seguranca', titulo: 'Subir para a balsa, nunca descer', html: 'O barco, ainda que alagado, costuma ser mais visível, seco e seguro que a balsa. Abandone quando houver fogo incontrolável, água entrando mais rápido do que se esgota, ou risco claro de afundar. Passe do convés para a balsa sem molhar-se, se possível.' },
        { t: 'termos', ids: ['abandono', 'balsa-salva-vidas', 'bolsa-de-abandono', 'epirb', 'plb', 'sart', 'pirotecnicos'] },
        { t: 'h', txt: 'A balsa salva-vidas' },
        { t: 'fato', ref: 'travessia-114', html: 'Na navegação oceânica a embarcação deve ter balsas salva-vidas infláveis para 100% das pessoas a bordo, podendo ser classe II.' },
        { t: 'fato', ref: 'travessia-25', html: 'Cat. 1 e 2 das OSR: uma ou mais balsas infláveis com capacidade total para todas as pessoas a bordo, conforme LSA Code (SOLAS) cap. IV ou ISO 9650-1:2005 Tipo 1 Grupo A.' },
        { t: 'fato', ref: 'travessia-27', html: 'Cada balsa deve poder ser levada até os guarda-mancebos ou lançada em até 15 segundos.' },
        { t: 'fato', ref: 'travessia-28', html: 'Revisão das balsas em estação autorizada: SOLAS anualmente; ISO 9650 em contêiner ou valise a cada 3 anos (valise alugada: anualmente); certificados de revisão a bordo.' },
        { t: 'p', html: 'Guarde a balsa num lugar de onde possa ser lançada com rapidez (no cockpit, na popa ou em um berço), nunca em um paiol trancado. Sua liberação hidrostática deve ser conferida e as presilhas corretamente instaladas. Treine o lançamento e a entrada, na prática, em um curso de sobrevivência no mar.' },
        { t: 'h', txt: 'O grab bag' },
        { t: 'p', html: '<b>Grab bag</b> (bolsa de abandono) é a mochila de emergência que vai com a tripulação para a balsa. Fica estanque e fácil de pegar, junto da saída do cockpit.' },
        { t: 'fato', ref: 'travessia-13', html: 'Cat. 1 (monocasco): um VHF portátil de no mínimo 5 W para cada grab bag, estanque ou com capa à prova d’água, guardado no grab bag.' },
        { t: 'fato', ref: 'travessia-17', html: 'Cat. 1: um telefone satelital portátil para cada grab bag, estanque ou com capa e bateria interna.' },
        { t: 'fato', ref: 'extra-travessia-2-08', html: 'Na navegação oceânica, as embarcações de esporte e recreio devem ter quatro foguetes manuais estrela vermelha com paraquedas, quatro fachos manuais luz vermelha e quatro sinais fumígenos flutuantes laranja.' },
        { t: 'lista', itens: [
          '<b>Comunicação e posição:</b> VHF portátil, telefone satelital ou localizador pessoal (PLB), GPS portátil, baterias reserva.',
          '<b>Sinalização:</b> pirotécnicos (foguetes, fachos, fumígeno), espelho de sinalização, lanterna, apito.',
          '<b>Sobrevivência:</b> água e comida de emergência, abrigo térmico, repelente, capa de chuva.',
          '<b>Saúde:</b> enjoo (remédio), curativos, protetor solar, kit básico de primeiros socorros.',
          '<b>Documentos e dinheiro:</b> passaportes, apólices, em saco estanque.',
          '<b>Ferramentas:</b> faca, alicate, corda e fita adesiva.',
        ] },
        { t: 'h', txt: 'EPIRB e INFOSAR' },
        { t: 'p', html: 'A <b>EPIRB</b> 406 MHz é um transmissor de emergência que, quando ativado (de forma manual ou ao entrar na água), envia ao satélite a identificação e a posição do barco. O alerta chega a um centro de controle de missão, que aciona o SALVAMAR.' },
        { t: 'fato', ref: 'normas-155', html: 'Embarcação de médio porte em navegação oceânica deve ter VHF com DSC, HF com DSC e EPIRB 406 MHz (esta exigível desde 01/07/2006).' },
        { t: 'fato', ref: 'radio-40', html: 'Pela NORMAM-211, a EPIRB deve ser de tipo aprovado (lista em www.cospas-sarsat.org), ter liberação, flutuação e ativação automáticas em naufrágio e ativação manual.' },
        { t: 'fato', ref: 'normas-154', html: 'Toda EPIRB deve ser cadastrada no INFOSAR (serviço do DECEA).' },
        { t: 'fato', ref: 'radio-44', html: 'Segundo a Central de Ajuda do DECEA (atualizada em julho de 2026), o registro INFOSAR vale 2 anos e deve ser renovado a cada 2 anos, recebendo novo código.' },
        { t: 'fato', ref: 'radio-42', html: 'O alerta de uma baliza 406 MHz é recebido pelo Centro Brasileiro de Controle de Missão (BRMCC), que aciona as redes SALVAERO e SALVAMAR.' },
        { t: 'fato', ref: 'travessia-04', html: 'Na Versão 2 das OSR (vigente a partir de 01/01/2027), a OSR 4.19.3 passa a exigir GNSS interno em toda EPIRB 406 MHz (Cat. 0, 1 e 2) e capacidade de transmitir AIS se registrada após 2026.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Quando acionar a EPIRB', html: 'Acione a EPIRB em perigo grave e iminente de vida: abandono, afundamento, incêndio incontrolável. Se for acionada sem querer, avise imediatamente o SALVAMAR (telefone 185) e a estação de rádio para cancelar o alerta. Mantenha o cadastro e as baterias em dia.' },
        { t: 'h', txt: 'Mayday e SALVAMAR' },
        { t: 'fato', ref: 'travessia-106', html: 'O SALVAMAR é alertado pelo telefone 185 (ou telefones das organizações militares da Marinha), pelo GMDSS, por alertas de navios SOLAS e pela RENEC (Embratel, VHF e HF).' },
        { t: 'fato', ref: 'tecnico-84', html: 'São sinais de perigo o SOS em Morse, a palavra “Mayday” em radiotelefonia e o sinal N.C. do Código Internacional de Sinais (RIPEAM, Anexo IV).' },
        { t: 'p', html: 'A chamada de Mayday segue um roteiro: <b>MAYDAY</b> três vezes; <b>“aqui”</b> e o nome do barco três vezes; o identificador (MMSI ou indicativo); <b>MAYDAY</b>, o nome do barco; a <b>posição</b> (latitude e longitude); a <b>natureza do perigo</b>; o <b>auxílio</b> pedido; o número de pessoas; informações úteis (cor do casco, balsa); e “câmbio”. Se o rádio tem DSC, faça primeiro o alerta de socorro DSC (botão com tampa), que envia o MMSI e a posição. Pratique no simulador.' },
        { t: 'widget', w: 'vhf-sim', opts: { modo: 'montar', mensagem: 'mayday', modos: ['montar', 'explorar', 'desafio'] }, legenda: 'Monte uma chamada de Mayday: escolha a natureza do perigo, a posição e o número de pessoas. A estação costeira que responde é fictícia.' },
        { t: 'h', txt: 'Dentro da balsa' },
        { t: 'lista', itens: [
          'Fique junto ao barco enquanto ele flutuar, mas amarrado a uma distância segura, até que afunde.',
          'Largue o drogue (âncora flutuante) da balsa, feche a entrada e proteja do frio e do sol.',
          'Ative a EPIRB, mantenha o rádio e a posição.',
          'Racione água; trate de enjoo e hipotermia; mantenha a moral.',
          'Use os pirotécnicos só quando houver sinal de uma embarcação ou aeronave.',
        ] },
        { t: 'check', questoes: [
          Q('trav2-m10-l6-q1', 'Travessia: emergências', 1, 'Quando se deve abandonar o barco para a balsa?',
            ['Quando houver fogo incontrolável, água entrando mais rápido do que se esgota ou risco claro de afundar.', 'Assim que houver mau tempo.', 'Quando o vento passar de 20 nós.', 'Quando o motor falhar.'], 0,
            'O barco flutuando é mais seguro que a balsa. Abandona-se quando não há mais condições de manter o barco, nunca por mau tempo isolado ou falha do motor.', 'World Sailing OSR 6.02; Cruz Vermelha / RYA Sea Survival'),
          Q('trav2-m10-l6-q2', 'Travessia: emergências', 2, 'Quem recebe o alerta de uma EPIRB 406 MHz no Brasil e aciona o salvamento marítimo?',
            ['O BRMCC (Centro Brasileiro de Controle de Missão), que aciona SALVAERO e SALVAMAR.', 'A Receita Federal.', 'A Anatel, que fiscaliza o rádio.', 'O clube náutico da região.'], 0,
            'O alerta via satélite chega ao BRMCC, que aciona o SALVAMAR (Marinha). Receita, Anatel e clube não recebem alertas de socorro.', 'DECEA/SALVAMAR; fato radio-42', 'https://www.marinha.mil.br/salvamarbrasil/node/49'),
          Q('trav2-m10-l6-q3', 'Travessia: emergências', 2, 'Qual a validade do registro de uma EPIRB no INFOSAR, segundo a Central de Ajuda do DECEA?',
            ['2 anos, com renovação e novo código.', '10 anos.', 'Indeterminada.', '6 meses.'], 0,
            'O DECEA informa que o registro vale 2 anos e precisa ser renovado, com novo código. 10 anos, prazo indeterminado ou 6 meses não correspondem à informação do órgão. Confira a regra atual no sistema antes de largar.', 'DECEA (Central de Ajuda); fato radio-44'),
          Q('trav2-m10-l6-q4', 'Travessia: emergências', 3, 'Em uma chamada de Mayday por voz, qual elemento NÃO pode faltar?',
            ['A posição do barco e a natureza do perigo.', 'A cor do casco apenas.', 'O nome do porto de origem.', 'O nome do dono do barco.'], 0,
            'Sem posição e sem saber o tipo de perigo, o resgate não encontra nem prepara o auxílio adequado. Os outros dados são complementares.', 'UIT, Regulamento de Radiocomunicações, Art. 32 / Rec. UIT-R M.1171'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: embarcações de sobrevivência, EPIRB e rádios na navegação oceânica', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'normas-155' },
          { txt: 'World Sailing, OSR 2026-2027: balsa, grab bag e comunicações', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-25' },
          { txt: 'SALVAMAR (Marinha do Brasil)', url: 'https://www.marinha.mil.br/salvamarbrasil/node/49', ref: 'travessia-106' },
          { txt: 'RIPEAM-72, Anexo IV: sinais de perigo', url: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf', ref: 'tecnico-84' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm11', titulo: 'Partida e chegada: formalidades',
  resumo: 'Documentos do barco e da tripulação, saída do Brasil, entrada em um país estrangeiro e seguros. O que está confirmado em fontes oficiais, e o que você precisa confirmar com as autoridades antes de largar.',
  licoes: [
    {
      id: 'l1', titulo: 'Documentos do barco e do comandante', minutos: 11,
      objetivos: [
        'Listar os documentos do barco e do comandante exigidos pela Marinha e pela Anatel.',
        'Registrar a EPIRB e obter a licença de estação de rádio.',
        'Montar uma pasta de documentos, física e digital, para a viagem.',
      ],
      blocos: [
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Confirme tudo na Capitania, na Anatel e nos países de destino', html: 'Este módulo reúne o que está confirmado em fontes oficiais (marcado com fonte) e o que ainda precisa de confirmação (marcado “a confirmar”). As regras mudam, e cada país tem as suas. Antes de largar, fale com a Capitania, com a Polícia Federal e com a Receita Federal do seu porto de saída, e com as autoridades do primeiro porto de destino.' },
        { t: 'p', html: 'Uma travessia internacional é também uma viagem burocrática. O barco e o comandante precisam de papéis em ordem para sair do Brasil, para ser aceitos em outros países e para voltar. Faltar um deles pode atrasar a viagem ou impedir a entrada.' },
        { t: 'h', txt: 'Documentos do barco' },
        { t: 'tabela', cab: ['Documento', 'Para que serve', 'Observações'], linhas: [
          ['TIE (Título de Inscrição da Embarcação)', 'Identifica a embarcação, o proprietário e a classificação (costeira, oceânica)', 'Pode ser digital pelo gov.br, com QR Code'],
          ['Seguro DPEM', 'Seguro obrigatório de danos pessoais', 'A Marinha exige o comprovante para regularizar a embarcação'],
          ['Licença de Estação de Navio (Anatel)', 'Autoriza o uso dos equipamentos de rádio de bordo', 'Exigida se a embarcação tem equipamento de radiocomunicação'],
          ['MMSI e registro da EPIRB no INFOSAR', 'Identificam o barco nos sistemas de socorro', 'O registro do INFOSAR vale 2 anos'],
          ['Notas fiscais e comprovantes de equipamentos', 'Provam a origem de equipamentos, inclusive importados', 'Úteis para a Receita e para seguros'],
        ], legenda: 'Lista de apoio. A classificação do TIE (navegação oceânica) determina a dotação obrigatória a bordo.' },
        { t: 'fato', ref: 'extra-travessia-2-07', html: 'O TIE pode ser digital (gov.br, com QR Code); com TIE digital, é responsabilidade do proprietário ou condutor portar o celular de modo que a Inspeção Naval consiga acessar os dados, ou levar a impressão legível do QR Code.' },
        { t: 'fato', ref: 'extra-arrais-3-21', html: 'Os itens das tabelas dos arts. 4.33, 4.34 e 4.35 da NORMAM-211 são de dotação e porte obrigatórios conforme a classificação da embarcação no seu TIE, qualquer que seja a navegação que ela estiver fazendo.' },
        { t: 'fato', ref: 'extra-travessia-2-06', html: 'Estão obrigados ao seguro DPEM todos os proprietários ou armadores de embarcações nacionais ou estrangeiras sujeitas à inscrição e/ou registro nas Capitanias, Delegacias e Agências; a Marinha só exige o comprovante de pagamento para os serviços de regularização.' },
        { t: 'fato', ref: 'travessia-120', html: 'Embarcações com equipamento de radiocomunicação devem obter a Licença de Estação de Navio na ANATEL.' },
        { t: 'fato', ref: 'travessia-119', html: 'Toda EPIRB deve ser cadastrada no INFOSAR (serviço do DECEA) em https://infosar.decea.mil.br, e o código de identificação começa por 710 (Brasil).' },
        { t: 'fato', ref: 'radio-44', html: 'Segundo a Central de Ajuda do DECEA (atualizada em julho de 2026), o registro INFOSAR vale 2 anos e deve ser renovado a cada 2 anos, recebendo novo código.' },
        { t: 'h', txt: 'Documentos do comandante' },
        { t: 'fato', ref: 'travessia-113', html: 'Na tabela de itens obrigatórios para embarcações classificadas para navegação oceânica, a habilitação mínima exigida em navegação oceânica é Capitão-Amador.' },
        { t: 'fato', ref: 'radio-12', html: 'O Regulamento Geral dos Serviços de Telecomunicações (Resolução Anatel nº 777/2025) exige certificado de radiotelegrafista ou radiotelefonista, emitido ou reconhecido pela Anatel, para operar estações do Serviço Limitado Móvel Marítimo (SLMM) quando associado ao GMDSS.' },
        { t: 'lista', itens: [
          '<b>CHA (Capitão-Amador)</b> compatível com a área. Leve a cédula física ou digital.',
          '<b>Certificado de operador de rádio</b> (ORG ou ORR): o ORR só opera em águas nacionais; para falar com estações estrangeiras e em alto-mar, o ORG é a categoria adequada.',
          '<b>Certificados internacionais:</b> ICC (pelo RYA), RYA/ASA, que ajudam em países que pedem prova de competência (trilha internacional).',
          '<b>Passaporte</b> válido, e visto quando o destino exigir.',
        ] },
        { t: 'fato', ref: 'radio-04', html: 'O Ato Anatel nº 3449, de 11/03/2026, define duas categorias de operador radiotelefonista: Operador de Rádio Geral (ORG) e Operador de Rádio Restrito (ORR); o ORR só pode operar estações no território, águas e espaço aéreo nacionais.' },
        { t: 'h', txt: 'Plano de viagem' },
        { t: 'fato', ref: 'normas-158', html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.' },
        { t: 'p', html: 'Registre o plano da travessia (rota prevista, escalas, tripulação, equipamento de salvatagem, hora esperada de chegada) em NAVSEG ou no clube/marina, e deixe uma cópia com um contato em terra, junto à lista de telefones de emergência e à pasta de documentos. Guarde a pasta em local estanque, e uma cópia digital num serviço de nuvem acessível por satélite.' },
        { t: 'check', questoes: [
          Q('trav2-m11-l1-q1', 'Travessia: formalidades', 1, 'Qual habilitação mínima a NORMAM-211 exige para comandar embarcação classificada para navegação oceânica?',
            ['Capitão-Amador.', 'Arrais-Amador.', 'Mestre-Amador.', 'Motonauta.'], 0,
            'A tabela da navegação oceânica pede Capitão-Amador. Mestre-Amador cobre a navegação costeira até 20 milhas, e Arrais-Amador, a interior.', 'NORMAM-211, art. 4.35; fato travessia-113', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m11-l1-q2', 'Travessia: formalidades', 2, 'Quanto tempo vale o registro de uma EPIRB no INFOSAR, segundo a Central de Ajuda do DECEA?',
            ['2 anos.', '5 anos.', 'Indeterminado.', '1 mês.'], 0,
            'O DECEA informa 2 anos, com renovação e novo código. 5 anos, prazo indeterminado ou 1 mês não correspondem a essa informação. Como as regras mudam, confira no sistema antes da viagem.', 'DECEA; fato radio-44'),
          Q('trav2-m11-l1-q3', 'Travessia: formalidades', 2, 'O que a Marinha exige em relação ao seguro DPEM?',
            ['Apenas o comprovante de pagamento, para que os serviços de regularização da embarcação sejam feitos.', 'Que o seguro cubra qualquer dano ao casco.', 'Que o seguro seja contratado no exterior.', 'Nada: o seguro é facultativo.'], 0,
            'A Marinha só exige o comprovante do pagamento do DPEM nos serviços de regularização; o DPEM cobre danos pessoais, não danos ao casco, e é obrigatório para embarcações sujeitas à inscrição.', 'NORMAM-211, art. 2.6; fato extra-travessia-2-06', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: TIE (art. 2.5), DPEM (art. 2.6), dotação (art. 4.35)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-06' },
          { txt: 'Anatel: licença de estação e certificados de operador', url: 'https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777', ref: 'radio-12' },
          { txt: 'DECEA: INFOSAR', url: 'https://infosar.decea.mil.br', ref: 'travessia-119' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Saída do Brasil', minutos: 10,
      objetivos: [
        'Distinguir o que a NORMAM-211 regula para a saída de embarcações estrangeiras e o que não está confirmado para embarcações brasileiras.',
        'Montar uma lista de perguntas para a Capitania, a Polícia Federal e a Receita.',
        'Planejar o aviso de saída e as despedidas dos portos.',
      ],
      blocos: [
        { t: 'callout', tipo: 'aconfirmar', titulo: 'Lacuna conhecida', html: 'A NORMAM-211 descreve com detalhe o procedimento de <b>entrada e saída de embarcações estrangeiras</b> nas águas brasileiras. Para uma embarcação de <b>bandeira brasileira</b> que sai para o exterior, não encontramos em fonte oficial um passo a passo completo. O que segue é o que está confirmado e o que você deve perguntar.' },
        { t: 'h', txt: 'O que a norma diz sobre embarcações estrangeiras (um espelho útil)' },
        { t: 'p', html: 'Quando um iate estrangeiro entra ou sai do Brasil, três autoridades participam: a <b>Capitania</b> (Marinha), a <b>Polícia Federal</b> (migração) e a <b>Receita Federal</b> (aduana). Entender como elas se relacionam ajuda a entender o que seu barco vai ouvir ao sair.' },
        { t: 'fato', ref: 'extra-travessia-2-03', html: 'Para sair das águas jurisdicionais brasileiras, a embarcação estrangeira de esporte e recreio comunica a saída à Capitania, Delegacia ou Agência com pelo menos 24 horas de antecedência e o visto de saída depende do passe de saída da Polícia Federal e da liberação da Receita Federal.' },
        { t: 'fato', ref: 'extra-travessia-2-04', html: 'O tempo de permanência de embarcação estrangeira de esporte e recreio nas águas jurisdicionais brasileiras é definido pela Receita Federal.' },
        { t: 'h', txt: 'Para a sua embarcação brasileira' },
        { t: 'fato', ref: 'normas-158', html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.' },
        { t: 'fato', ref: 'extra-travessia-2-19', html: 'A Lei de Migração (Lei 13.445/2017) atribui à Polícia Federal a polícia marítima e o controle migratório nos pontos de entrada e saída do país; o procedimento específico de saída de iate de bandeira brasileira não foi confirmado em fonte oficial.' },
        { t: 'lista', itens: [
          '<b>Capitania:</b> pergunte à Capitania do porto de saída se há algum procedimento ou documento específico para uma embarcação de esporte e recreio brasileira que vai ao exterior, além do Aviso de Saída ou NAVSEG.',
          '<b>Polícia Federal:</b> pergunte à unidade da PF com atuação no porto como a tripulação faz o controle migratório de saída (carimbo de saída nos passaportes, lista de tripulantes, horário, local).',
          '<b>Receita Federal:</b> se leva equipamentos, produtos ou valores acima dos limites de bagagem, ou se o barco for retornar de outro país, pergunte sobre as regras de saída temporária e de reentrada do barco, e sobre a bagagem dos tripulantes.',
          '<b>Marina ou clube:</b> informe a saída; eles costumam saber a rotina local.',
        ] },
        { t: 'p', html: 'Se você não vai voltar ao Brasil com o barco, a história muda: é uma exportação. A NORMAM-211 descreve o procedimento para embarcações existentes.' },
        { t: 'fato', ref: 'extra-travessia-2-05', html: 'Para exportar uma embarcação existente, a NORMAM-211 manda cancelar a inscrição/registro, regularizar a exportação perante a Receita Federal e apresentar a Declaração de Entrada/Saída (anexo 1-A).' },
        { t: 'h', txt: 'Na hora de largar' },
        { t: 'lista', ordenada: true, itens: [
          'Faça o <b>Aviso de Saída</b> (ou NAVSEG) com a rota e as escalas previstas.',
          'Passe pela <b>Polícia Federal</b> e pela <b>Receita</b>, conforme orientado, antes de partir.',
          'Cheque os documentos: TIE, DPEM, CHA, rádio, passaportes, lista de tripulantes, seguro.',
          'Faça o último <b>reabastecimento</b> de água, comida, gás e combustível.',
          'Confira a <b>previsão do tempo</b> e a janela da travessia.',
          'Comunique a um contato em terra a posição, o rumo e a hora esperada.',
          'Se for o caso, comunique a saída à Capitania e deixe o número de contato.',
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Marque as autoridades com antecedência', html: 'Muitas repartições de portos pequenos funcionam em horário comercial e dias úteis. Planeje a saída em um dia útil, com uma folga de dias (ou de uma semana) para acertar tudo antes da largada.' },
        { t: 'check', questoes: [
          Q('trav2-m11-l2-q1', 'Travessia: formalidades', 1, 'Para um iate estrangeiro sair das águas brasileiras, de que depende o visto de saída da Capitania?',
            ['Da apresentação do passe de saída expedido pela Polícia Federal e da liberação da Receita Federal.', 'Apenas do pagamento de uma taxa em dinheiro.', 'Da autorização do Tribunal Marítimo.', 'De nada: basta zarpar.'], 0,
            'A NORMAM-211, art. 1.16.3 b), condiciona o visto de saída ao passe de saída da PF e à liberação da Receita. A saída deve ser comunicada com pelo menos 24 horas de antecedência.', 'NORMAM-211, art. 1.16.3; fato extra-travessia-2-03', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m11-l2-q2', 'Travessia: formalidades', 2, 'Qual é a conduta mais prudente de um comandante de barco brasileiro que vai sair do Brasil para o exterior?',
            ['Confirmar com a Capitania, a Polícia Federal e a Receita do porto de saída quais procedimentos valem para o seu caso, e fazer o Aviso de Saída ou o NAVSEG.', 'Zarpar sem avisar ninguém.', 'Presumir que as regras para estrangeiros se aplicam a ele sem conferir.', 'Pedir informação só ao chegar ao destino.'], 0,
            'Há uma lacuna de fontes oficiais para embarcações brasileiras; a confirmação direta evita problemas. O Aviso de Saída é obrigatório, e as regras para estrangeiros são só um referencial.', 'NORMAM-211, art. 1.16; fato normas-158'),
          Q('trav2-m11-l2-q3', 'Travessia: formalidades', 2, 'Quem define o tempo de permanência de um iate estrangeiro nas águas brasileiras?',
            ['A Receita Federal.', 'A Marinha, sozinha.', 'O Ministério do Turismo.', 'O comandante do iate.'], 0,
            'A NORMAM-211, art. 1.16.2 a), diz que o tempo de permanência é definido pela Receita Federal. A Marinha cuida da segurança da navegação, o Ministério do Turismo não controla a entrada e o comandante não pode fixar o prazo por conta própria.', 'NORMAM-211, art. 1.16.2; fato extra-travessia-2-04', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 1.16 (embarcações estrangeiras de esporte e recreio) e art. 3.8 (exportação)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-03' },
          { txt: 'Lei de Migração (Lei nº 13.445/2017), art. 38', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13445.htm', ref: 'extra-travessia-2-19' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'Chegada a um país estrangeiro', minutos: 11,
      objetivos: [
        'Explicar a sequência de entrada em um país: bandeira Q, primeiro porto, autoridades.',
        'Preparar a documentação típica de entrada de um iate.',
        'Reconhecer que as regras mudam de país a país e onde confirmar.',
      ],
      blocos: [
        { t: 'p', html: 'Cada país decide quem entra pela sua costa. Existem, porém, passos comuns, e conhecê-los evita erros caros: ancorar fora de um porto de entrada, desembarcar antes da liberação, esquecer o passe de saída.' },
        { t: 'termos', ids: ['ajb', 'inspecao-naval', 'autoridade-maritima'] },
        { t: 'h', txt: 'A sequência clássica' },
        { t: 'lista', ordenada: true, itens: [
          '<b>Escolha um porto de entrada oficial.</b> Muitos países permitem a entrada de iates apenas em portos designados, com alfândega, imigração e saúde.',
          '<b>Avise por rádio</b> (VHF canal 16 ou o canal indicado) a autoridade portuária ou a marina, informando nome, bandeira, número de pessoas e hora estimada de chegada.',
          '<b>Hasteie a bandeira Q</b> (amarela, do Código Internacional de Sinais) ao chegar a águas territoriais: “minha embarcação está sã e solicito livre prática”.',
          '<b>Aguarde a liberação</b> antes de qualquer pessoa desembarcar: é a regra do primeiro porto na maioria dos países (o Brasil a aplica a iates estrangeiros, como mostra a NORMAM-211 abaixo); confirme em cada destino.',
          '<b>Apresente-se às autoridades</b> (imigração, alfândega, saúde, capitania) com a lista de tripulantes, passaportes e papéis do barco.',
          '<b>Pague taxas</b> e receba os carimbos e o prazo de permanência.',
          '<b>Arrie a bandeira Q</b> e hasteie a bandeira de cortesia do país.',
        ] },
        { t: 'figura', svg: S('m11q', 'Bandeira Q do Código Internacional de Sinais, toda amarela, e a bandeira de cortesia hasteada a boreste', '0 0 520 190',
          '<rect width="520" height="190" fill="var(--sea-1)"/>' +
          '<line x1="150" y1="20" x2="150" y2="180" stroke="currentColor" stroke-width="4"/>' +
          '<rect x="152" y="26" width="130" height="86" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="2"/>' +
          '<text x="217" y="76" font-size="30" font-weight="700" text-anchor="middle" fill="currentColor">Q</text>' +
          '<text x="330" y="60" font-size="15" font-weight="700" fill="currentColor">Bandeira Q</text>' +
          '<text x="330" y="82" font-size="13" fill="currentColor">“Minha embarcação está sã</text><text x="330" y="100" font-size="13" fill="currentColor">e solicito livre prática.”</text>' +
          '<text x="330" y="132" font-size="13" fill="currentColor">Sobe ao chegar; desce quando</text><text x="330" y="150" font-size="13" fill="currentColor">as autoridades liberam a entrada.</text>', 560),
          legenda: 'A bandeira Q é toda amarela. Veja o significado completo no Código Internacional de Sinais (DHN).' },
        { t: 'h', txt: 'Um exemplo brasileiro: o que o Brasil exige de iates estrangeiros' },
        { t: 'p', html: 'O Brasil aplica a seus visitantes regras como as que você enfrentará fora. A NORMAM-211 mostra as etapas, e vale como exemplo do que esperar:' },
        { t: 'fato', ref: 'extra-travessia-2-01', html: 'Na primeira escala nacional de uma embarcação estrangeira de esporte e recreio, ninguém embarca ou desembarca antes da visita ou manifestação das autoridades anuentes (Autoridade de Saúde dos Portos, Polícia Federal, Receita Federal etc.).' },
        { t: 'fato', ref: 'normas-132', html: 'Embarcação estrangeira de esporte e recreio em águas brasileiras apresenta a Declaração de Entrada/Saída (anexo 1-A) em até 24 horas após a entrada.' },
        { t: 'fato', ref: 'extra-travessia-2-02', html: 'O comandante deve estar preparado para receber a visita de um inspetor naval em até 48 horas após apresentar a Declaração de Entrada, e a Declaração traz o roteiro pretendido (portos a visitar, tempo de permanência e último porto).' },
        { t: 'h', txt: 'Papéis que quase todos pedem' },
        { t: 'tabela', cab: ['Documento', 'Observação'], linhas: [
          ['Passaportes da tripulação', 'Muitos países exigem validade mínima (frequentemente 6 meses): confirme em cada destino'],
          ['Vistos', 'Depende da nacionalidade e do país. Confira antes de largar'],
          ['Documentos do barco', 'TIE, comprovante de seguro, licença de rádio'],
          ['Habilitação do comandante', 'CHA, certificados de rádio; ICC ou RYA/ASA em países que pedem'],
          ['Lista de tripulantes (crew list)', 'Nome, nacionalidade, passaporte, função'],
          ['Comprovantes de saída do porto anterior', 'Alguns países pedem o “zarpe” ou o “clearance” do último porto'],
        ], legenda: 'Lista genérica. As exigências variam por país. Confirme com as autoridades de cada destino e com guias atualizados.' },
        { t: 'fato', intl: true, ref: 'internacional-66', html: 'O ICC serve como prova de competência quando solicitada por autoridades de um país visitado (país do qual o titular não é cidadão nem residente).' },
        { t: 'fato', intl: true, ref: 'internacional-92', html: 'A validade do ICC é determinada pelo país visitado; não é uma qualificação verdadeiramente internacional nem equivale à carteira de motorista da UE.' },
        { t: 'fato', ref: 'loc_ext-12', html: 'A IGY Rodney Bay Marina (Santa Lúcia), ponto de chegada da ARC, tem serviço de alfândega e imigração no local e atende no VHF 16.' },
        { t: 'callout', tipo: 'dica', titulo: 'Escolha a escala certa', html: 'Se a chegada a um país exige muita papelada e hora marcada, prefira uma primeira escala com marina grande e serviço de alfândega e imigração no local. Em rallies, a organização costuma orientar as formalidades de chegada.' },
        { t: 'check', questoes: [
          Q('trav2-m11-l3-q1', 'Travessia: formalidades', 1, 'O que significa a bandeira Q içada ao chegar a um porto estrangeiro?',
            ['“Minha embarcação está sã e solicito livre prática.”', '“Estou em perigo.”', '“Preciso de um piloto.”', '“Tenho carga perigosa.”'], 0,
            'A bandeira Q (amarela) pede livre prática (autorização das autoridades de saúde e demais para entrar). Perigo, prático e carga perigosa são outros sinais.', 'Código Internacional de Sinais (DHN)'),
          Q('trav2-m11-l3-q2', 'Travessia: formalidades', 2, 'O que não se deve fazer ao chegar ao primeiro porto de um país, antes da liberação das autoridades?',
            ['Desembarcar tripulantes ou embarcar pessoas e objetos.', 'Içar a bandeira Q.', 'Chamar a marina pelo rádio.', 'Preparar os documentos.'], 0,
            'A regra do primeiro porto é que ninguém desembarca nem embarca antes da visita das autoridades. A NORMAM-211 aplica isso aos iates estrangeiros no Brasil.', 'NORMAM-211, art. 1.16.1 a); fato extra-travessia-2-01', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          QI('trav2-m11-l3-q3', 'Travessia: formalidades', 2, 'Qual a natureza do ICC (International Certificate for Operators of Pleasure Craft)?',
            ['É uma prova de competência cuja validade é determinada pelo país visitado; não é uma qualificação universal.', 'É uma carteira de motorista válida em qualquer país.', 'É um certificado de propriedade do barco.', 'É um seguro internacional.'], 0,
            'O ICC prova competência perante autoridades de países visitados, mas sua aceitação depende de cada país. Não é carteira universal, título de propriedade ou seguro.', 'RYA/UNECE; fatos internacional-66 e internacional-92'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 1.16: entrada, permanência e saída de embarcações estrangeiras', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-01' },
          { txt: 'RYA: Certificado Internacional de Operador de Embarcação de Recreio (ICC)', url: 'https://www.rya.org.uk/our-services/icc/', ref: 'internacional-66' },
          { txt: 'DHN, <i>Código Internacional de Sinais</i>: bandeira Q (referência técnica)' },
        ] },
      ],
    },
    {
      id: 'l4', titulo: 'Seguros, tripulação e retorno', minutos: 10,
      objetivos: [
        'Distinguir o seguro obrigatório (DPEM) dos seguros que valem a pena contratar para uma travessia.',
        'Organizar a documentação de saúde e de identidade da tripulação.',
        'Planejar o retorno (do barco e das pessoas) antes de largar.',
      ],
      blocos: [
        { t: 'h', txt: 'Seguros' },
        { t: 'p', html: 'O único seguro que a NORMAM-211 exige é o <b>DPEM</b> (danos pessoais). Ele não cobre o barco nem a responsabilidade civil por danos materiais. Para uma travessia, quase todo veleirista contrata mais:' },
        { t: 'tabela', cab: ['Seguro', 'O que cobre', 'Atenção'], linhas: [
          ['DPEM', 'Danos pessoais causados por embarcações ou suas cargas', 'Obrigatório no Brasil para embarcações sujeitas à inscrição'],
          ['Casco e equipamentos', 'Perda ou dano do barco e de seus equipamentos', 'Muitas apólices excluem o mar aberto, ou exigem cláusula de navegação oceânica'],
          ['Responsabilidade civil', 'Danos a terceiros e a outras embarcações', 'Países e marinas pedem prova de cobertura internacional'],
          ['Saúde e evacuação', 'Despesas médicas e transporte para hospital', 'Leia as exclusões para esportes náuticos em alto-mar'],
        ], legenda: 'Resumo de boa prática. Peça a um corretor com experiência náutica e leia as cláusulas de área de navegação e de tripulação.' },
        { t: 'fato', ref: 'extra-travessia-2-06', html: 'Estão obrigados ao seguro DPEM todos os proprietários ou armadores de embarcações nacionais ou estrangeiras sujeitas à inscrição e/ou registro nas Capitanias, Delegacias e Agências; a Marinha só exige o comprovante de pagamento para os serviços de regularização.' },
        { t: 'callout', tipo: 'nota', titulo: 'Estrangeiros e charter', html: 'No Brasil, embarcações estrangeiras alugadas (charter) para esporte e recreio têm regras próprias e pedem documentos como contrato, registro do país da bandeira e seguro (NORMAM-211, art. 1.16.4). Fora do Brasil, cada país tem as suas.' },
        { t: 'fato', ref: 'normas-130', html: 'No aluguel sem tripulação (bareboat), o locatário precisa de habilitação compatível com a área. Estrangeiros não residentes devem ver o art. 1.16.' },
        { t: 'h', txt: 'A tripulação' },
        { t: 'lista', itens: [
          '<b>Passaporte:</b> validade longa e páginas livres para carimbos.',
          '<b>Vistos:</b> verifique cada nacionalidade a bordo; um tripulante que não pode entrar num país bloqueia o plano.',
          '<b>Vacinas e certificados:</b> alguns países pedem comprovante de vacinação (por exemplo, de febre amarela para viajantes que vêm do Brasil). Confira as exigências sanitárias de cada destino.',
          '<b>Procurações e autorizações:</b> menores precisam de autorização dos responsáveis; se o dono do barco não está a bordo, leve uma autorização escrita para o comandante.',
          '<b>Contatos de emergência:</b> uma lista com nome, parentesco e telefone de cada tripulante, em local de fácil acesso.',
        ] },
        { t: 'h', txt: 'Trocas de tripulação nas escalas' },
        { t: 'p', html: 'Muitas travessias têm tripulantes que desembarcam numa escala e outros que embarcam. Cada troca exige atualizar a lista de tripulantes, avisar as autoridades quando o país exige, repetir o briefing de segurança com o recém-chegado e conferir se a lotação do TIE e a capacidade da balsa continuam adequadas. Quem embarca deve entrar no país de forma legal (visto, passagem de entrada, comprovante) e ter seguro de saúde.' },
        { t: 'h', txt: 'E o retorno?' },
        { t: 'p', html: 'Antes de largar, pergunte-se: como a tripulação volta para casa? Com passagem aérea comprada? Com o barco? Alguns países exigem prova de saída (passagem ou barco com destino definido) no momento da entrada. Se o barco for ficar, onde? Marina, fundeadouro, estaleiro? Quanto custa? Como se retira o barco (e a tripulação) do país, e qual o prazo máximo de permanência permitido ao barco e às pessoas? Responda isso antes de sair do Brasil.' },
        { t: 'callout', tipo: 'dica', titulo: 'Dossiê da viagem', html: 'Monte uma pasta única, impressa e digital, com: passaportes, vistos, vacinas, seguros (apólices e telefones), TIE, CHA, licença de rádio, lista de tripulantes, mapa de rotas, planos de contingência (portos de escape), contatos. Entregue uma cópia a alguém em terra.' },
        { t: 'check', questoes: [
          Q('trav2-m11-l4-q1', 'Travessia: formalidades', 1, 'O seguro DPEM cobre o casco do veleiro contra perda?',
            ['Não: ele cobre danos pessoais causados por embarcações; casco e responsabilidade civil exigem outros seguros.', 'Sim, cobre o casco inteiro.', 'Sim, cobre qualquer dano em qualquer país.', 'Cobre apenas o motor.'], 0,
            'O DPEM é um seguro de danos pessoais e é o que a Marinha exige. Perdas do barco e responsabilidade civil dependem de seguros privados específicos.', 'NORMAM-211, art. 2.6; fato extra-travessia-2-06', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          Q('trav2-m11-l4-q2', 'Travessia: formalidades', 2, 'Qual cuidado vale ao contratar seguro de casco para uma travessia oceânica?',
            ['Ler as cláusulas de área de navegação, de tripulação e de exclusões, pois muitas apólices excluem o mar aberto.', 'Contratar o mais barato sem ler.', 'Dispensar o seguro, porque a Marinha cobre danos.', 'Fazer o seguro só depois de chegar.'], 0,
            'A cobertura de área e de tripulação decide se o seguro vale na travessia. A Marinha não cobre danos, e o seguro depois de chegar não protege a viagem.', 'Boa prática de seguros náuticos'),
          Q('trav2-m11-l4-q3', 'Travessia: formalidades', 2, 'Por que planejar o retorno da tripulação antes de largar?',
            ['Porque alguns países pedem comprovante de saída e porque a logística de retorno (passagens, marina) pode ser cara e demorada.', 'Porque o retorno é opcional.', 'Porque a Marinha exige a passagem de volta.', 'Porque o barco deve voltar sempre pelo mesmo caminho.'], 0,
            'Países podem exigir prova de saída e o custo de retorno afeta o orçamento. A Marinha não exige passagem de volta, e a rota de volta pode ser outra.', 'Boa prática de planejamento'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 2.6 (DPEM) e art. 1.16.4 (charter)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'extra-travessia-2-06' },
          { txt: 'Jimmy Cornell, <i>World Cruising Routes</i> e <i>World Cruising Handbook</i> (papéis e seguros; referência técnica, sem link)' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm12', titulo: 'Você está pronto para comandar a travessia?',
  resumo: 'Um balanço honesto: as competências, a experiência, o barco e o plano. Se algum item crítico estiver no vermelho, a decisão certa é esperar.',
  licoes: [
    {
      id: 'l1', titulo: 'Competências do comandante de travessia', minutos: 12,
      objetivos: [
        'Avaliar suas competências em navegação, tempo, segurança, saúde, rádio, mecânica e liderança.',
        'Comparar com o que a Marinha do Brasil, o RYA e a ASA exigem de quem comanda no oceano.',
        'Identificar os itens que ainda faltam e planejar como supri-los.',
      ],
      blocos: [
        { t: 'p', html: 'Comandar uma travessia não é saber velejar bem. É saber decidir quando não largar, quando mudar de rota, quando pedir ajuda, e como manter uma tripulação inteira, saudável e unida, durante semanas. A habilitação oficial mostra que você passou numa prova. A prontidão é o que você faz depois dela.' },
        { t: 'h', txt: 'O que as referências esperam' },
        { t: 'fato', ref: 'programa-24', html: 'O programa do Capitão-Amador tem sete assuntos: navegação astronômica, navegação eletrônica, estabilidade, meteorologia e oceanografia, comunicações, sobrevivência no mar, e carta náutica e publicações.' },
        { t: 'fato', intl: true, ref: 'internacional-44', html: 'O candidato ao RYA Yachtmaster Ocean deve ter navegado um iate no mar por navegação astronômica (no mínimo meridiana/sun-run-sun e verificação de agulha por astro).' },
        { t: 'fato', intl: true, ref: 'internacional-141', html: 'Entre as habilidades do ASA 108 está atuar como skipper e tripulante numa passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra.' },
        { t: 'fato', intl: true, ref: 'internacional-142', html: 'O padrão ASA 108 inclui planejar uma travessia do Atlântico Norte ou do Pacífico, comparando rotas e perigos com Ocean Passages for the World e cartas climáticas.' },
        { t: 'p', intl: true, html: 'Os três programas cobrem os mesmos temas: onde estou (astronomia como reserva), onde vou (meteorologia e rotas), como me comunico (rádio, EPIRB), como sobrevivo (balsa, incêndio, saúde). A diferença é que o RYA e a ASA pedem também experiência comprovada no mar.' },
        { t: 'h', txt: 'Autoavaliação por áreas' },
        { t: 'p', html: 'Para cada linha, pergunte-se: “eu consigo fazer isto sozinho, de noite, cansado, com o barco jogando?”. Se a resposta for “não”, o item ainda não está pronto.' },
        { t: 'tabela', cab: ['Área', 'Você precisa conseguir…', 'Onde estudar no app'], linhas: [
          ['Navegação', 'Fixar posição com GNSS e com carta; ter um plano B sem GNSS (estimada e astronomia); ler uma carta piloto', 'Curso Capitão-Amador'],
          ['Tempo e rotas', 'Ler METEOROMARINHA, GRIB e carta sinótica; escolher a janela; reconhecer a ZCIT', 'Travessia, módulos 1 e 2'],
          ['Segurança e salvatagem', 'Usar balsa, EPIRB, extintores, bombas, jackstays; praticar homem ao mar e abandono', 'Travessia, módulos 3, 9 e 10'],
          ['Saúde', 'Tratar o básico e saber quando pedir orientação médica e evacuação', 'Travessia, módulo 7'],
          ['Rádio e comunicação', 'Fazer Mayday e Pan-Pan, usar DSC, VHF, HF/satélite; manter uma rotina de contato', 'Rádio e segurança'],
          ['Mecânica e energia', 'Diagnosticar o motor, os filtros, as bombas, as baterias e consertar o que der', 'Travessia, módulo 4'],
          ['Vela e mau tempo', 'Rizar cedo, usar vela de capa e tormentim, escolher uma tática', 'Vela prática; Travessia, módulo 9'],
          ['Liderança', 'Montar escala de quartos, decidir, comunicar, cuidar do moral', 'Travessia, módulo 6'],
          ['Formalidades', 'Preparar documentos e entrar e sair de países', 'Travessia, módulo 11'],
        ], legenda: 'Os nomes dos módulos referem-se ao curso Travessia oceânica. Use como lista de verificação.' },
        { t: 'callout', tipo: 'dica', titulo: 'Peça a avaliação de um instrutor', html: 'A autoavaliação costuma ser otimista. Peça a um instrutor ou a um comandante experiente que o observe em dia de vento, de noite e em manobras difíceis, e ouça o que ele diz com atenção.' },
        { t: 'check', questoes: [
          Q('trav2-m12-l1-q1', 'Travessia: prontidão', 1, 'Qual dos itens abaixo faz parte do programa do exame de Capitão-Amador?',
            ['Navegação astronômica.', 'Pesca esportiva.', 'Mergulho autônomo.', 'Meteorologia de montanha.'], 0,
            'O programa do CPA tem navegação astronômica, navegação eletrônica, estabilidade, meteorologia e oceanografia, comunicações, sobrevivência no mar e carta náutica e publicações. Os demais não fazem parte.', 'NORMAM-211 / DPC; fato programa-24', 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf'),
          QI('trav2-m12-l1-q2', 'Travessia: prontidão', 2, 'O que o ASA 108 (Offshore Passagemaking) pede em termos de passagem prática?',
            ['Atuar como skipper e tripulante numa passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra.', 'Uma passagem de 6 horas na baía.', 'Um fim de semana em um fundeadouro.', 'Nenhuma passagem prática.'], 0,
            'O ASA 108 inclui uma passagem oceânica com pelo menos 72 horas e 100 milhas sem tocar terra. Passagens mais curtas ou em baía não cumprem.', 'ASA 108; fato internacional-141'),
          Q('trav2-m12-l1-q3', 'Travessia: prontidão', 2, 'Por que a navegação astronômica ainda faz parte da preparação de um comandante oceânico, apesar do GNSS?',
            ['Porque é o plano B independente de satélites e energia, e o RYA Ocean e o CPA a exigem.', 'Porque o GNSS é proibido em alto-mar.', 'Porque o sextante é mais preciso que o GNSS.', 'Porque a Marinha cobra só para dificultar a prova.'], 0,
            'O GNSS pode falhar (energia, interferência). A astronomia permite posição sem satélites. Tanto o CPA quanto o Yachtmaster Ocean a exigem. O GNSS é permitido e em geral mais preciso.', 'NORMAM-211; RYA Yachtmaster Ocean; fatos programa-24 e internacional-44'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC: programa do exame de Capitão-Amador', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf', ref: 'programa-24' },
          { txt: 'RYA: Yachtmaster Ocean', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/', ref: 'internacional-44' },
          { txt: 'ASA: padrões do ASA 108', url: 'https://americansailing.com/wp-content/uploads/2025/02/Certification-ASA-108-Standards.pdf', ref: 'internacional-141' },
        ] },
      ],
    },
    {
      id: 'l2', titulo: 'Experiência: milhas e noites antes de comandar', minutos: 11,
      objetivos: [
        'Reconhecer que a experiência de mar é parte da habilitação real de um comandante.',
        'Comparar marcos de experiência do RYA e de organizadores de regatas.',
        'Montar sua escada pessoal de milhas e noites até a travessia.',
      ],
      blocos: [
        { t: 'p', html: 'A prova da Marinha mede conhecimento. Para comandar uma travessia, o que mais importa é o que se faz com esse conhecimento no mar. A boa notícia é que a experiência pode ser planejada. Você sobe degraus, e cada um exige o anterior.' },
        { t: 'figura', svg: S('m12esc', 'Escada de experiência em dez degraus, do curso de vela às primeiras milhas, passando por Arrais, Mestre, travessias de 24 a 72 horas, Capitão-Amador, offshore como tripulante, imediato e, por fim, comandante da transatlântica', '0 0 540 380', '<rect x="10" y="10" width="330" height="30" rx="6" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/><text x="22" y="30" font-size="13" fill="currentColor"><tspan font-weight="700">1. </tspan>Curso de vela e primeiras milhas</text><rect x="30" y="46" width="330" height="30" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="1"/><text x="42" y="66" font-size="13" fill="currentColor"><tspan font-weight="700">2. </tspan>Arrais-Amador</text><rect x="50" y="82" width="330" height="30" rx="6" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/><text x="62" y="102" font-size="13" fill="currentColor"><tspan font-weight="700">3. </tspan>Milhas costeiras como tripulante</text><rect x="70" y="118" width="330" height="30" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="1"/><text x="82" y="138" font-size="13" fill="currentColor"><tspan font-weight="700">4. </tspan>Mestre-Amador</text><rect x="90" y="154" width="330" height="30" rx="6" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/><text x="102" y="174" font-size="13" fill="currentColor"><tspan font-weight="700">5. </tspan>Skipper costeiro, de dia e de noite</text><rect x="110" y="190" width="330" height="30" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="1"/><text x="122" y="210" font-size="13" fill="currentColor"><tspan font-weight="700">6. </tspan>Travessias de 24 a 72 horas</text><rect x="130" y="226" width="330" height="30" rx="6" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/><text x="142" y="246" font-size="13" fill="currentColor"><tspan font-weight="700">7. </tspan>Capitão-Amador</text><rect x="150" y="262" width="330" height="30" rx="6" fill="var(--sea-2)" stroke="currentColor" stroke-width="1"/><text x="162" y="282" font-size="13" fill="currentColor"><tspan font-weight="700">8. </tspan>Offshore acima de 500 mn como tripulante</text><rect x="170" y="298" width="330" height="30" rx="6" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/><text x="182" y="318" font-size="13" fill="currentColor"><tspan font-weight="700">9. </tspan>Travessia oceânica como imediato</text><rect x="190" y="334" width="330" height="30" rx="6" fill="var(--shoal)" stroke="var(--magenta)" stroke-width="2.5"/><text x="202" y="354" font-size="13" fill="currentColor"><tspan font-weight="700">10. </tspan>Transatlântica como comandante</text>', 560),
          legenda: 'A escada segue o Roteiro deste app. Os degraus podem ser feitos em ordens diferentes, mas cada um prepara o seguinte.' },
        { t: 'p', html: 'Veja o <a href="#/roteiro">Roteiro da habilitação</a>: ele lista etapas, documentos, custos e tempos típicos, e guarda o seu progresso.' },
        { t: 'h', txt: 'Marcos de referência' },
        { t: 'tabela', cab: ['Referência', 'Exigência de experiência'], linhas: [
          ['RYA Yachtmaster Offshore (exame)', '50 dias de mar, 5 dias como skipper, 2.500 milhas e 5 passagens de mais de 60 milhas (2 noturnas e 2 como skipper), nos últimos 10 anos'],
          ['RYA Yachtmaster Ocean', 'Passagem de no mínimo 600 milhas e 96 horas, com 200 milhas a mais de 50 milhas de terra, como responsável por quarto ou skipper'],
          ['Cape2Rio 2025 (regata)', 'Regata qualificatória ou travessia offshore contínua de 500 mn ou mais, com 2 noites completas, nos 18 meses anteriores, com o comandante e 50% da tripulação'],
          ['ARC e rallies da World Cruising Club', 'Barcos de 27 a 100 pés, no mínimo dois adultos por barco, equipamento pelas OSR'],
        ], legenda: 'Referências de organizações estrangeiras ou de regatas: não são exigências da Marinha do Brasil, mas dão uma ideia do que o mercado considera preparo.' },
        { t: 'fato', intl: true, ref: 'internacional-32', html: 'Exame Yachtmaster Offshore: 2.500 milhas navegadas (em iates de até 500 GT).' },
        { t: 'fato', intl: true, ref: 'internacional-33', html: 'Exame Yachtmaster Offshore: 5 passagens de mais de 60 milhas, incluindo 2 noturnas (overnight) e 2 como skipper.' },
        { t: 'fato', intl: true, ref: 'internacional-31', html: 'Exame Yachtmaster Offshore: 5 dias como skipper em embarcações com menos de 24 m.' },
        { t: 'fato', intl: true, ref: 'internacional-41', html: 'A passagem qualificante do Yachtmaster Ocean deve ter no mínimo 600 milhas, das quais ao menos 200 a mais de 50 milhas de terra ou de objetos cartografados úteis à navegação.' },
        { t: 'fato', intl: true, ref: 'internacional-42', html: 'A passagem qualificante do Yachtmaster Ocean deve durar no mínimo 96 horas.' },
        { t: 'fato', ref: 'travessia-71', html: 'Qualificação Cape2Rio 2025: uma regata qualificatória ou travessia offshore contínua de pelo menos 500 mn com no mínimo 2 noites completas, nos 18 meses anteriores, com o comandante e 50% da tripulação.' },
        { t: 'fato', ref: 'travessia-50', html: 'O ARC aceita monocascos, multicascos e barcos a motor de 27 a 100 pés. A página do organizador dá os limites em metros como 8,23 a 32 m, mas 100 pés equivalem a cerca de 30,5 m.' },
        { t: 'h', txt: 'Como ganhar milhas' },
        { t: 'lista', itens: [
          '<b>Regatas como tripulante:</b> a Refeno (Recife–Fernando de Noronha), a Santos–Rio e outras aceitam tripulantes e dão noites de mar em clima real.',
          '<b>Entregas de barcos:</b> comandantes de entrega precisam de tripulação.',
          '<b>Rallies e passagens:</b> serviços de busca de tripulação, como a Ocean Crew Link, ligam barcos a tripulantes.',
          '<b>Seu próprio barco:</b> escalas longas, passagens de uma noite, depois de duas, de três; sempre com observação de como a tripulação se comporta.',
          '<b>Registre tudo:</b> um diário com datas, milhas, noites, condições e função. Ele é o seu currículo.',
        ] },
        { t: 'fato', ref: 'travessia-72', html: 'A próxima Refeno (Regata Internacional Recife–Fernando de Noronha) larga em 25/09/2027, às 12h00 (BRT), do Marco Zero do Recife.' },
        { t: 'callout', tipo: 'nota', titulo: 'Não existe número mágico', html: 'Nenhum número de milhas garante competência. Duas pessoas com as mesmas milhas podem ter aprendido coisas muito diferentes. Use os marcos como mínimo, e priorize variedade: noite, vento forte, falhas de equipamento, manobras em espaço apertado.' },
        { t: 'check', questoes: [
          QI('trav2-m12-l2-q1', 'Travessia: prontidão', 1, 'Qual é a passagem qualificante mínima para o RYA Yachtmaster Ocean?',
            ['Pelo menos 600 milhas e 96 horas, com 200 milhas a mais de 50 milhas de terra.', 'Pelo menos 60 milhas em um dia.', 'Pelo menos 100 milhas com pernoite.', 'Qualquer passagem noturna.'], 0,
            'O RYA pede passagem de ao menos 600 milhas e 96 horas, com 200 milhas a mais de 50 milhas de terra. As outras são mínimos de outras qualificações ou nada.', 'RYA; fatos internacional-41 e internacional-42'),
          Q('trav2-m12-l2-q2', 'Travessia: prontidão', 2, 'O que a Cape2Rio 2025 exigia como qualificação de experiência?',
            ['Regata qualificatória ou travessia offshore contínua de 500 mn ou mais, com 2 noites completas, nos 18 meses anteriores, com o comandante e 50% da tripulação.', 'Nenhuma qualificação.', 'Uma travessia de 50 mn.', 'Somente um curso teórico.'], 0,
            'O aviso de regata pedia uma qualificatória de pelo menos 500 mn e 2 noites, nos 18 meses anteriores, com o comandante e metade da tripulação.', 'NoR Cape2Rio 2025; fato travessia-71', 'https://cape2riorace.com/wp-content/uploads/2024/07/NoR-C2R-2025-final-V3.pdf'),
          QI('trav2-m12-l2-q3', 'Travessia: prontidão', 2, 'Qual a melhor forma de usar os marcos de experiência do RYA no seu planejamento?',
            ['Como referência mínima de preparo, buscando variedade de condições (noite, vento forte, falhas) e registrando tudo.', 'Como exigência legal da Marinha do Brasil.', 'Ignorar, porque só valem para ingleses.', 'Cumprir só as milhas e pular a variedade.'], 0,
            'Os marcos do RYA não são lei brasileira, mas são uma boa referência mínima de preparo. Não valem só para ingleses: o oceano é o mesmo. Milhas sem variedade (noite, vento forte, falhas) ensinam pouco.', 'RYA Yachtmaster; boa prática'),
          Q('trav2-m12-l2-q4', 'Travessia: prontidão', 2, 'Qual destas opções soma experiência de mar mais útil antes de comandar uma travessia oceânica?',
            ['Participar como tripulante de regatas e entregas de barcos, incluindo noites e tempo ruim, e registrar tudo no diário.', 'Navegar só em dias de bom tempo, perto do porto, para evitar riscos.', 'Ler muito sobre travessias e não navegar até se sentir pronto.', 'Comprar o equipamento mais caro e confiar nele.'], 0,
            'Regatas e entregas dão noites de mar em clima real, sob a responsabilidade de um comandante experiente, e o diário prova a experiência. Só bom tempo não ensina nada sobre falhas e mar grosso, leitura sem prática não treina decisão e equipamento caro não substitui a habilidade de usá-lo.', 'Boa marinharia; Roteiro da habilitação'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'RYA: requisitos do Yachtmaster Offshore e Ocean', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/', ref: 'internacional-32' },
          { txt: 'Cape2Rio, Notice of Race 2025', url: 'https://cape2riorace.com/wp-content/uploads/2024/07/NoR-C2R-2025-final-V3.pdf', ref: 'travessia-71' },
          { txt: 'World Cruising Club: ARC', url: 'https://worldcruising.com/events/arc', ref: 'travessia-50' },
          { txt: 'Refeno', url: 'https://www.refeno.com.br/', ref: 'travessia-72' },
        ] },
      ],
    },
    {
      id: 'l3', titulo: 'O barco, o plano e a decisão final', minutos: 12,
      objetivos: [
        'Percorrer uma lista final do barco, da tripulação e do plano.',
        'Definir critérios claros de “não largar” e de “voltar”.',
        'Saber onde continuar: o Roteiro e os módulos anteriores.',
      ],
      blocos: [
        { t: 'p', html: 'Aqui você junta tudo. A lista abaixo não substitui os módulos do curso: ela os resume em perguntas para você responder com sinceridade, por escrito, com a tripulação. Cada item é um motivo para largar ou para esperar.' },
        { t: 'h', txt: 'O barco' },
        { t: 'lista', itens: [
          '<b>Classificação e documentos:</b> TIE classificado para navegação oceânica, DPEM em dia, licença de rádio, EPIRB registrada.',
          '<b>Casco, quilha, leme e mastro</b> inspecionados por profissional.',
          '<b>Equipamentos de segurança:</b> balsa revisada, coletes, arnês e tirantes, boias, pirotécnicos válidos, extintores, bombas, antena de emergência.',
          '<b>Velas de mau tempo</b> e as manobras treinadas.',
          '<b>Sobressalentes e ferramentas</b> para o motor, a elétrica, o aparelho, as velas.',
          '<b>Comunicação:</b> VHF fixo e portátil, rádio de longo alcance ou satélite, EPIRB, AIS.',
        ] },
        { t: 'fato', ref: 'travessia-37', html: 'Mo 0–2 (OSR): inspeção estrutural (quilha, leme, cavernas) por pessoa qualificada independente com o barco fora d’água, com evidência de inspeção nos 24 meses anteriores à largada ou após encalhe.' },
        { t: 'fato', ref: 'travessia-22', html: 'Cat. 1 e 2 das OSR: EPIRB 406 MHz com ativação na água e manual.' },
        { t: 'h', txt: 'A tripulação' },
        { t: 'lista', itens: [
          'Número e habilidades adequados; substituto do comandante designado.',
          'Fichas de saúde, vacinas, treinamento de primeiros socorros e de sobrevivência.',
          'Briefing de segurança feito e escalas de quartos combinadas.',
          'Combinados por escrito: custos, autoridade, saídas.',
        ] },
        { t: 'h', txt: 'O plano' },
        { t: 'lista', itens: [
          '<b>Rota e janela:</b> Pilot Charts, previsão, datas em relação à ZCIT e aos furacões.',
          '<b>Portos de escape</b> e distâncias para cada trecho.',
          '<b>Provisões:</b> água, comida, gás, diesel, com margem; MARPOL em mente.',
          '<b>Comunicação:</b> horários e contatos em terra; telemedicina e SALVAMAR.',
          '<b>Formalidades:</b> saída do Brasil, entrada no destino, seguros, documentos.',
          '<b>Plano de contingência:</b> o que fazer em cada emergência (os módulos 9 e 10).',
        ] },
        { t: 'widget', w: 'globo-rotas', opts: { preset: 'salvador-caribe', presets: ['salvador-caribe', 'arc', 'natal-mindelo', 'mindelo-granada'], ventos: true }, legenda: 'Revise a rota no globo, com a camada de ventos. O desenho é esquemático e não serve para planejar; use Pilot Charts e previsões.' },
        { t: 'h', txt: 'Critérios de “não largar” e de “voltar”' },
        { t: 'p', html: 'Defina estes critérios com a tripulação, antes. É fácil decidir com calma, difícil decidir depois de semanas de preparo, dinheiro gasto e pressão de datas.' },
        { t: 'tabela', cab: ['Critério', 'Exemplo de regra'], linhas: [
          ['Não largar', 'Aviso de mau tempo (vento 7 ou mais) na janela prevista; equipamento obrigatório faltando; tripulante doente; seguro vencido'],
          ['Voltar ou desviar', 'Entrada de água que as bombas não vencem; avaria de leme ou mastro; tripulante grave; previsão de ciclone no caminho'],
          ['Pedir ajuda', 'Risco de vida; perda do barco iminente; incêndio incontrolável'],
        ], legenda: 'Exemplos para adaptar. O importante é que as regras sejam escritas e que todos as conheçam.' },
        { t: 'fato', ref: 'travessia-96', html: 'O Serviço Meteorológico Marinho emite aviso de mau tempo quando se prevê vento força 7 Beaufort ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Esperar é uma decisão de comandante', html: 'Nenhuma data justifica arriscar vidas. Se o barco, a tripulação ou a previsão não estão prontos, espere. O Atlântico estará lá na próxima janela.' },
        { t: 'h', txt: 'Para onde ir agora' },
        { t: 'p', html: 'Se faltam habilitação, experiência ou equipamentos, volte ao <a href="#/roteiro">Roteiro da habilitação</a> e marque a próxima etapa. Se tudo estiver pronto, releia os módulos de segurança e faça uma última revisão com um instrutor. Boa navegação e bons ventos.' },
        { t: 'callout', tipo: 'nota', titulo: 'Este material é de apoio', html: 'Material educativo e comunitário. Não substitui instrução prática com instrutor habilitado nem a habilitação oficial emitida pela Marinha do Brasil. Regras, taxas e procedimentos mudam: confirme na Capitania, Delegacia ou Agência.' },
        { t: 'check', questoes: [
          Q('trav2-m12-l3-q1', 'Travessia: prontidão', 1, 'O que fazer se o aviso de mau tempo (vento 7 Beaufort ou mais) coincide com a janela prevista da largada?',
            ['Esperar uma janela melhor e rever a previsão.', 'Largar mesmo assim, para cumprir a data.', 'Largar e reduzir o pano só depois.', 'Pedir para a tripulação votar e largar se a maioria quiser.'], 0,
            'O aviso do CHM indica vento de 28 nós ou mais e ondas de 3 m ou mais em águas profundas; largar contra isso é assumir risco sem necessidade. Votação não substitui a responsabilidade do comandante.', 'CHM; fato travessia-96', 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante'),
          Q('trav2-m12-l3-q2', 'Travessia: prontidão', 2, 'Por que definir por escrito os critérios de “não largar” e de “voltar” antes da travessia?',
            ['Porque, com pressão de datas e dinheiro gasto, decidir na hora tende a favorecer o risco.', 'Porque a Marinha exige esse documento.', 'Porque a tripulação gosta de burocracia.', 'Porque evita a necessidade de previsões.'], 0,
            'Regras escritas antes protegem a decisão da pressão de datas e dinheiro gasto. Não há exigência da Marinha de um documento assim, a tripulação não precisa gostar de burocracia e os critérios não dispensam previsões: elas alimentam os critérios.', 'Boa prática de gestão de risco'),
          Q('trav2-m12-l3-q3', 'Travessia: prontidão', 2, 'Qual a exigência das OSR para a inspeção estrutural em monocascos Cat. 0 a 2?',
            ['Inspeção por pessoa qualificada independente, com o barco fora d’água, com evidência nos 24 meses anteriores à largada ou após encalhe.', 'Inspeção feita pelo próprio dono em qualquer momento.', 'Inspeção a cada 10 anos.', 'Nenhuma inspeção.'], 0,
            'A OSR pede inspeção independente de quilha, leme e cavernas, com barco fora d’água, nos 24 meses anteriores ou após encalhe.', 'OSR; fato travessia-37', 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf'),
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, OSR 2026-2027: inspeção estrutural e EPIRB', url: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf', ref: 'travessia-37' },
          { txt: 'CHM/Marinha do Brasil: critérios do aviso de mau tempo', url: 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante', ref: 'travessia-96' },
        ] },
      ],
    },
  ],
});
  VL.dado('cursos/travessia-2', { modulos: M });
})();
