/* Curso Vela prática — parte 2: homem ao mar sob vela, motor e manobras no porto, fundear, velejar à noite,
   escada de experiência e competências (módulos m6 a m10).
   Fatos regulatórios só com ref para research/claims_verified.json ou research/_work/research_extra_vela-2.json
   (ids extra-vela-2-NN). Conteúdo técnico cita RIPEAM-72, Miguens, World Sailing OSR, US Sailing, RYA.
   As milhas, noites e horas dos degraus da escada são RECOMENDAÇÃO do app, não exigência legal. */
(function () {
  var NORMAM = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var OSR = 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf';
  var COLREG = 'https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx';
  var USS_MOB = 'https://www.ussailing.org/wp-content/uploads/2024/05/2020.New-Study-Evaluating-MOB-Return-and-Recovery-in-the-21st-Century.pdf';
  var USS_SAS = 'https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf';
  var USS_ISLER = 'https://www.ussailing.org/news/man-overboard-rescue-procedure/';
  var USS_QS = 'https://www.ussailing.org/news/quick-stop-rescue/';
  var USS_SIM = 'https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf';
  var USS_HANSON = 'https://www.ussailing.org/wp-content/uploads/2018/01/5_15_04.pdf';
  var RYA_MOB = 'https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/';
  var PBO_MOB = 'https://www.pbo.co.uk/seamanship/man-overboard-turns-getting-back-to-the-casualty-in-the-water-104939';
  var RYA_QP = 'https://www.rya.org.uk/training/certificates-of-competence/qualifying-passages';
  var ARTE = 'https://www.marinha.mil.br/dphdm/node/801';
  var _fig = 0;
  function svg(vb, titulo, corpo, max) {
    _fig++;
    var id = 'v2f' + _fig;
    return '<svg viewBox="' + vb + '" width="100%" role="img" aria-labelledby="' + id + '" style="max-width:' + (max || 560) + 'px;display:block;margin:0 auto"><title id="' + id + '">' + titulo + '</title>' + corpo + '</svg>';
  }
  function t(x, y, s, size, anchor, fill, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 15) + '" fill="' + (fill || 'var(--ink)') + '" text-anchor="' + (anchor || 'start') + '"' + (extra ? ' ' + extra : '') + '>' + s + '</text>';
  }
  function seta(id, cor) {
    return '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="' + (cor || 'var(--ink)') + '"/></marker></defs>';
  }
  /* casco visto de cima, proa para cima; comprimento 56 unidades × escala */
  function casco(x, y, esc, rot, preench) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + esc + ')"><path d="M0,-30 C10,-18 12,6 9,26 L-9,26 C-12,6 -10,-18 0,-30 Z" fill="' + (preench || 'var(--sea-1)') + '" stroke="var(--ink)" stroke-width="' + (1.6 / esc) + '"/></g>';
  }
  function num(x, y, n) {
    return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="var(--paper, #fff)" stroke="var(--magenta)" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="14" font-weight="700" text-anchor="middle" fill="var(--magenta)">' + n + '</text>';
  }
  var M = [];
M.push({
  id: 'm6',
  titulo: 'Homem ao mar sob vela',
  resumo: `Quem cai de um veleiro em movimento fica para trás em segundos, no meio de ondas, e a tripulação restante é pequena. Aqui você aprende a prevenir a queda (colete com alça, tirante, jackline, regras de bordo), o que fazer nos primeiros 60 segundos, as duas manobras de volta mais usadas (parada rápida e oito), como recolher a pessoa a bordo e como usar o GPS, o rádio DSC e o AIS pessoal.`,
  licoes: [
    {
      id: 'l1',
      titulo: 'Prevenir: colete, tirante, jackline e regras de bordo',
      minutos: 12,
      objetivos: [
        'Explicar por que a prevenção vale mais que qualquer manobra de resgate',
        'Escolher e regular colete com alça, tirante e jackline',
        'Definir as regras de bordo para prender-se (dia, noite, mar grosso, sozinho no convés)',
      ],
      blocos: [
        { t: 'p', html: `Em veleiro de cruzeiro, a melhor manobra de homem ao mar é a que não acontece. O motivo é simples: o barco anda a 5 ou 6 nós, a pessoa na água fica parada, e em um minuto a distância já passa de 150 metros. Com ondas, a cabeça de quem está na água desaparece atrás de cada crista.` },
        { t: 'p', html: `O estudo que a US Sailing fez em 2020 sobre acidentes reais (mais de 22 casos analisados a fundo por um painel de especialistas) deu números duros: sem colete, o afogamento aparece em cerca de <b>4 minutos</b>, e de 6 a 8 minutos é comum. O relatório destaca que nenhuma das pessoas estava presa ao barco no momento em que escorregou para fora (item 10). Mais de 60% das pessoas caíram <b>do cockpit</b>, não do convés. Ou seja: prender-se vale também dentro do cockpit.` },
        { t: 'h', txt: 'Os três itens que se completam' },
        { t: 'lista', itens: [
          `<b>Colete salva-vidas inflável com alça de segurança (arnês integrado).</b> Mantém a cabeça fora da água, inclusive de quem desmaiou. Deve ter luz e apito. O capuz anti-borrifo (<i>sprayhood</i>) e o ponto de engate para o tirante são pedidos pelas regras de travessia (quadro abaixo), e o US Sailing lembra que quem cai costuma estar no meio de ondas e precisa saber usar o capuz.`,
          `<b>Tirante</b> (<i>tether</i>): cabo curto, com mosquetão em cada ponta, que liga a alça do colete ao barco. O objetivo é que a pessoa <b>não chegue à água</b>.`,
          `<b>Jackline</b>: fita plana, bem esticada, que vai do cockpit à proa e serve de trilho para o tirante. Assim a pessoa fica presa durante todo o caminho, sem precisar soltar e prender de novo.`,
        ] },
        { t: 'fato', ref: 'travessia-39', html: `Para regatas e travessias oceânicas, as regras de segurança da World Sailing pedem tirante (ISO 12401) de no máximo 2 m, com mosquetões autotravantes e indicador de sobrecarga; mais um tirante de até 1 m (ou mosquetão intermediário).` },
        { t: 'fato', ref: 'extra-fechamento-cvtr-05', html: `Pela OSR 5.01.1, cada tripulante deve ter colete inflável a gás ISO 12402-3 (nível 150) fabricado depois de 2011, com inflação manual ou automática e tirante entre as pernas (todas as categorias); luz indicadora de posição e capuz anti-borrifo (<i>sprayhood</i>) nas categorias 0 a 3; ponto de engate do arnês nas categorias 0 a 2; e dispositivo pessoal de localização (PLB) no colete só na categoria 0. Confira o texto vigente antes de equipar o barco.` },
        { t: 'figura', svg: svg('0 0 400 300', 'Veleiro visto de cima com jacklines nos dois bordos, do cockpit à proa, e um tripulante preso por um tirante curto',
            casco(200, 150, 4.3, 0) +
            '<rect x="172" y="108" width="56" height="62" rx="8" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.4"/>' +
            '<rect x="170" y="206" width="60" height="48" rx="6" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="5 4"/>' +
            '<line x1="173" y1="224" x2="173" y2="72" stroke="var(--magenta)" stroke-width="3.5"/>' +
            '<line x1="227" y1="224" x2="227" y2="72" stroke="var(--magenta)" stroke-width="3.5"/>' +
            '<circle cx="173" cy="224" r="4" fill="var(--magenta)"/><circle cx="227" cy="224" r="4" fill="var(--magenta)"/><circle cx="173" cy="72" r="4" fill="var(--magenta)"/><circle cx="227" cy="72" r="4" fill="var(--magenta)"/>' +
            '<circle cx="173" cy="132" r="9" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.6"/>' +
            '<line x1="173" y1="132" x2="173" y2="146" stroke="var(--ink)" stroke-width="2"/>' +
            '<path d="M110 74 L170 104" stroke="var(--ink)" stroke-width="1.2" fill="none"/>' +
            t(14, 54, 'Jackline (fita)', 15, 'start', 'var(--magenta)') +
            t(14, 70, 'dos dois lados', 15, 'start', 'var(--magenta)') +
            '<path d="M120 154 L158 140" stroke="var(--ink)" stroke-width="1.2" fill="none"/>' +
            t(14, 168, 'Pessoa presa', 15, 'start') + t(14, 184, 'por tirante curto', 15, 'start') +
            '<path d="M262 228 L236 232" stroke="var(--ink)" stroke-width="1.2" fill="none"/>' +
            t(266, 226, 'Cockpit:', 15, 'start') + t(266, 242, 'prenda-se aqui', 15, 'start') + t(266, 258, 'também', 15, 'start') +
            t(340, 50, 'Proa', 15, 'middle') + t(340, 284, 'Popa', 15, 'middle') +
            t(280, 130, 'Cabine', 15, 'start') +
            t(10, 292, 'Linha tracejada: guarda-mancebos', 14, 'start')),
          legenda: `Esquema do convés (fora de escala). As jacklines vão de popa a proa, uma de cada lado da cabine, presas a pontos fortes do casco. O tirante curto impede que a pessoa chegue além da borda. O ponto de fixação do cockpit permite prender-se antes de sair do companheiro.` },
        { t: 'h', txt: 'Detalhes que decidem' },
        { t: 'lista', itens: [
          `<b>Jackline de fita, não de cabo de aço.</b> O cabo de aço rola sob o pé e escorrega; a fita plana fica firme. Passe-a pelas laterais da cabine, não por cima dela, e deixe-a bem esticada.`,
          `<b>Tirante curto.</b> Um tirante comprido deixa o corpo passar da borda e arrastar na água, e é difícil puxar de volta quem está sendo arrastado. Use o mais curto que ainda permita trabalhar.`,
          `<b>Prenda-se na estrutura do barco, nunca nos guarda-mancebos.</b> Eles são cabos finos, feitos para evitar quedas leves, e podem se romper sob um solavanco.`,
          `<b>Engate de soltura rápida no peito.</b> O estudo da US Sailing recomenda que o tirante tenha um engate de soltura rápida junto ao peito: se a pessoa estiver sendo arrastada e sentir que está se afogando, precisa poder se soltar.`,
          `<b>Confira o colete.</b> O inflável tem cilindro de CO<sub>2</sub> e cápsula de acionamento com validade. Faça o teste manual de pressão e a inspeção anual do fabricante. No estudo citado, falhas de inflar já mataram.`,
        ] },
        { t: 'h', txt: 'Regras de bordo (decididas pelo comandante)' },
        { t: 'p', html: `A NORMAM-211 não diz quando o tripulante deve se prender a bordo (o texto consultado em 2026-10 não cita arnês nem tirante). Por isso o comandante define regras e as explica no briefing de segurança, antes de sair. Um conjunto usado por muitas tripulações:` },
        { t: 'lista', ordenada: true, itens: [
          `<b>Colete vestido</b> por todos sempre que estiverem no convés, no cockpit, ou no bote.`,
          `<b>De noite, ninguém sai do cockpit sem estar preso</b> e sem avisar quem está no leme.`,
          `<b>Sozinho no convés (ou sozinho de quarto): sempre preso</b>, inclusive de dia.`,
          `<b>Mar grosso ou vento forte</b> (por exemplo, a partir de rizo): preso no cockpit também.`,
          `<b>Trabalho no mastro ou na proa</b>: preso, com outra pessoa vendo; pare o barco ou ajuste o rumo para reduzir o balanço.`,
          `<b>Xixi:</b> sentado, dentro do barco, ou preso. Debruçar-se na borda com o barco em movimento é causa clássica de queda.`,
          `<b>Aviso antes de movimentos</b>: “vou à proa”, “vou ao mastro”. Quem está no leme precisa saber onde cada um está.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Preso e arrastado também é perigo', html: `Prender-se não elimina o risco: o estudo da US Sailing registrou dois casos em que a pessoa foi perdida ainda ligada ao barco por um tirante (num deles o engate quebrou antes do resgate), e alerta que quem é puxado ao lado do barco engole muita água. Se alguém cair preso, o primeiro passo é <b>reduzir a velocidade ao mínimo</b>: o US Sailing manda fazer um quick-stop (cambar sem mexer nas escotas) ou, correndo de popa, orçar e arriar o balão. Isso leva a pessoa para o lado alto do barco. Aí você pode agarrá-la e içá-la ajudando-se do tirante, ou jogar o Lifesling. Quem sente que está se afogando precisa poder soltar o tirante no peito.` },
        { t: 'callout', tipo: 'dica', titulo: 'Convés limpo, queda evitada', html: `Escotas e cabos soltos no cockpit são causa comum de tropeço. Faça a “arrumação do cockpit” antes de cada quarto, e deixe o colete de cada pessoa em lugar fixo, com o tirante já regulado.` },
        { t: 'termos', ids: ["colete-salva-vidas", "arnes", "linha-de-vida", "guarda-mancebo", "cockpit", "homem-ao-mar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-001', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 1,
            enunciado: 'Qual é o principal objetivo do tirante (tether) preso à alça do colete?',
            alternativas: ['Impedir que a pessoa chegue à água', 'Facilitar o resgate depois que ela cair', 'Servir de cabo de reboque para o bote', 'Marcar a posição da pessoa para o GPS'],
            correta: 0,
            explicacao: 'O tirante existe para que a queda nem aconteça (ou fique limitada à borda). Ele não é método de resgate: puxar alguém arrastado a 5 nós é muito difícil e perigoso. Também não serve de reboque nem marca posição (isso é função do botão MOB e do AIS pessoal).',
            referencia: 'World Sailing, Offshore Special Regulations; US Sailing, estudo MOB 2020', fonte_url: USS_MOB },
          { id: 'vela-2-002', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'No estudo de acidentes da US Sailing (2020), onde estava a maioria das pessoas quando caiu?',
            alternativas: ['No cockpit', 'Na proa, trabalhando com as velas', 'No mastro, em manutenção', 'No bote, durante o desembarque'],
            correta: 0,
            explicacao: 'Mais de 60% estavam no cockpit, não no convés, e entre os que morreram a proporção foi de cerca de 80%. A lição é prender-se também no cockpit. As outras alternativas ocorrem, mas não são a maioria.',
            referencia: 'US Sailing, estudo MOB 2020, item 10', fonte_url: USS_MOB },
          { id: 'vela-2-003', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Onde se deve prender o mosquetão do tirante ao andar pelo convés?',
            alternativas: ['Na jackline ou num ponto forte do casco', 'Nos guarda-mancebos, que ficam à mão', 'No balaústre mais próximo', 'No estai de proa'],
            correta: 0,
            explicacao: 'Jackline e pontos fortes do casco foram feitos para suportar a carga de uma queda. Guarda-mancebos e balaústres são finos e podem ceder. O estai de proa fica no lugar mais exposto e pode ser tracionado durante manobras de velas.',
            referencia: 'World Sailing, Offshore Special Regulations; Miguens, Navegação, vol. III (segurança)' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, Offshore Special Regulations 2026–2027 (extrato Mo), itens de colete e tirante', url: OSR, ref: 'travessia-39' },
          { txt: 'US Sailing, A Study Evaluating MOB Return and Recovery in the 21st Century (2020), itens 1, 7, 9 e 10', url: USS_MOB },
          { txt: 'ISO 12401 (tirantes) e ISO 12402-3 (coletes infláveis nível 150): consulte o fabricante e a norma' },
        ] },
      ],
    },
    {
      id: 'l2',
      titulo: 'Os primeiros 60 segundos: ações imediatas',
      minutos: 10,
      objetivos: [
        'Executar a sequência: gritar, lançar flutuação, apontar, marcar, parar',
        'Distribuir funções entre a tripulação',
        'Saber quando e como pedir socorro',
      ],
      blocos: [
        { t: 'p', html: `Quando alguém cai, a tripulação tem poucos segundos para fazer o que mais importa: <b>não perder a pessoa de vista</b> e <b>dar flutuação</b> a ela. Tudo o mais (manobra, rádio, preparo do resgate) vem depois. Treine esta sequência até ela ser automática.` },
        { t: 'lista', ordenada: true, itens: [
          `<b>Grite “Homem ao mar a boreste!”</b> (ou a bombordo). Todos precisam saber, inclusive quem está dormindo; o grito acorda a tripulação de folga.`,
          `<b>Lance flutuação.</b> Jogue já a boia salva-vidas com luz e tudo o que flutue ao alcance (outra boia, defensas, almofadas). Além de ajudar a pessoa, marca o local, porque a água se move com a corrente e o barco anda.`,
          `<b>Aponte.</b> Escolha uma pessoa só para isso. Ela aponta o braço esticado para a pessoa na água e não tira os olhos dela; fala “está a 3 horas, uns 40 m” para o timoneiro. Não recebe outra tarefa. O Safety at Sea do US Sailing sugere o vigia fixo quando há cinco ou mais pessoas a bordo; com quatro ou menos, ele pode ser inviável, e então ficar perto da pessoa e o ponto MOB pesam mais.`,
          `<b>Marque a posição e alerte.</b> Aperte o botão MOB do GPS ou do plotter: o ponto fica guardado e mostra rumo e distância de volta. O RYA manda, em seguida, dar o alerta por rádio (Mayday ou alerta DSC).`,
          `<b>Pare o barco ou comece a manobra de volta</b> (próximas lições). Com a ideia de ficar o mais perto possível da pessoa.`,
          `<b>Chame o resto da tripulação.</b> Ligue o motor (se for parte do plano), mas deixe-o em ponto morto até ter certeza de que não há cabo nem escota na água. Acenda luzes de convés se for noite, ligue o rádio.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Quem aponta, só aponta', html: `A pessoa que vê o tripulante na água é o recurso mais precioso do barco. Se ela for ajudar a recolher velas, a pessoa some. Mesmo com GPS e AIS, mantenha sempre alguém com os olhos na água até o contato.` },
        { t: 'h', txt: 'Funções fixas ajudam' },
        { t: 'p', html: `Em tripulações de 3 ou 4 pessoas, combine antes quem faz o quê. Um exemplo:` },
        { t: 'tabela', cab: ['Função', 'Quem', 'O que faz'], linhas: [
          ['Leme / manobra', 'Timoneiro (ou quem estiver no leme)', 'Executa a manobra de volta; diz em voz alta cada passo'],
          ['Vigia', 'Quem estiver mais próximo do lado da queda', 'Aponta, não larga a pessoa de vista, informa rumo e distância'],
          ['Navegação e rádio', 'Quem estiver na cabine ou o comandante', 'Marca o MOB, liga o rádio, faz o alerta se preciso'],
          ['Recolhimento', 'Os demais', 'Prepara escada, Lifesling, adriça e talha; veste colete com tirante antes de se debruçar'],
        ], legenda: 'Com tripulação de 2 pessoas, o que está no leme precisa fazer a navegação e o vigia só pode ser o outro: por isso a prevenção é ainda mais importante em barco com pouca gente.' },
        { t: 'h', txt: 'Quando pedir socorro' },
        { t: 'p', html: `A regra prática é: <b>alerte cedo</b>. O RYA manda dar o MAYDAY ou o alerta DSC logo depois de marcar o ponto MOB, quando a pessoa não está presa ao barco. Com tripulação pequena, faça o alerta assim que a pessoa estiver sendo vigiada e o barco sob controle; se ela não for recolhida em poucos minutos ou se você a perder de vista, não espere mais. O rádio VHF em escuta no canal 16 (ou 70, se for DSC) fica ligado durante a navegação.` },
        { t: 'fato', ref: 'radio-19', html: `Pela NORMAM-211, com a embarcação navegando o VHF deve ficar ligado em escuta permanente no canal 16, ou no canal 70 se o rádio for DSC.` },
        { t: 'lista', itens: [
          `<b>No rádio DSC:</b> tecla de socorro (vermelha) por 5 segundos, com a posição do GPS; muitos rádios têm a opção de natureza “homem ao mar”.`,
          `<b>Por voz, canal 16:</b> “Mayday, Mayday, Mayday, aqui veleiro [nome] ×3; Mayday [nome]; homem ao mar na posição…; …”. As fontes variam no tom do alerta: o RYA manda dar “MAYDAY ou alerta DSC” para quem caiu e não está preso ao barco, e o texto do US Sailing (Peter Isler, 2016) diz que há motivo para o Mayday ou, pelo menos, para o Pan-Pan, conforme a situação. Se a pessoa já foi recolhida mas precisa de apoio médico, use “Pan-Pan”.`,
          `<b>Outros barcos próximos:</b> chame por VHF; quem estiver perto pode chegar antes dos meios oficiais.`,
        ] },
        { t: 'fato', ref: 'tecnico-84', html: `Anexo IV do RIPEAM: entre os sinais de perigo estão o SOS em Morse e a palavra “Mayday” em radiotelefonia.` },
        { t: 'fato', ref: 'travessia-107', html: `A região SAR marítima brasileira tem centros regionais de coordenação: SALVAMAR SUL (Rio Grande), SUL SUESTE (São Paulo), SUESTE (Rio de Janeiro), LESTE (Salvador), NORDESTE (Natal) e NORTE (Belém).` },
        { t: 'fato', ref: 'extra-arrais-1-32', html: `Qualquer pessoa é obrigada a prestar auxílio a quem estiver em perigo no mar, se puder fazê-lo sem perigo para si ou para outros, e quem souber de vida humana em perigo deve comunicar à Capitania ou às autoridades competentes.` },
        { t: 'p', html: `Quando a Marinha divulga um homem ao mar na sua área, você pode ser chamado a ajudar. Acompanhe os avisos:` },
        { t: 'fato', ref: 'travessia-103', html: `O CHM publica on-line os Avisos-Rádio Náuticos e os Avisos-Rádio SAR (por exemplo, homem ao mar, com pedido aos navegantes para procurar e informar).` },
        { t: 'widget', w: 'vhf-sim', opts: { modo: 'montar', modos: ['explorar', 'montar'], mensagem: 'mayday' }, legenda: 'Treine a chamada de socorro: monte a mensagem Mayday passo a passo e ouça o roteiro de fala. A estação costeira do simulador é fictícia.' },
        { t: 'termos', ids: ["homem-ao-mar", "canal-16", "canal-70", "dsc", "mayday", "pan-pan", "salvamar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-004', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 1,
            enunciado: 'Qual é a tarefa exclusiva do vigia num homem ao mar?',
            alternativas: ['Apontar para a pessoa na água sem tirar os olhos dela', 'Recolher as velas para parar o barco', 'Chamar a Capitania pelo celular', 'Preparar a escada de popa'],
            correta: 0,
            explicacao: 'A pessoa na água é difícil de ver; quem aponta com o braço e não tem outra tarefa garante o rumo da volta. Recolher velas, telefonar e preparar a escada são tarefas dos demais.',
            referencia: 'US Sailing, estudo MOB 2020; Miguens, vol. III (segurança)', fonte_url: USS_MOB },
          { id: 'vela-2-005', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 1,
            enunciado: 'Por que se joga a boia e outros objetos flutuantes logo após o grito de “homem ao mar”?',
            alternativas: ['Dão flutuação à pessoa e marcam o local da queda', 'Servem de âncora para o barco', 'Atraem o resgate aéreo automaticamente', 'Impedem o barco de andar mais rápido'],
            correta: 0,
            explicacao: 'Flutuação extra ajuda a pessoa, que pode não estar com colete, e marca o local. Boia não serve de âncora, não aciona nenhum resgate sozinha e não freia o barco de maneira útil.',
            referencia: 'US Sailing, estudo MOB 2020, recomendação I', fonte_url: USS_MOB },
          { id: 'vela-2-006', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Com o rádio VHF em DSC, em escuta permanente, qual canal deve estar sendo escutado durante a navegação, segundo a NORMAM-211?',
            alternativas: ['Canal 70', 'Canal 9', 'Canal 72', 'Canal 22'],
            correta: 0,
            explicacao: 'A NORMAM-211 manda escutar o canal 16, ou o 70 se o rádio for DSC. Os canais 9, 22 e 72 não são os de escuta de socorro: servem, em geral, a chamadas e comunicações de trabalho.',
            referencia: 'NORMAM-211/DPC (escuta em VHF)', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, escuta do VHF', url: NORMAM, ref: 'radio-19' },
          { txt: 'RIPEAM-72, Anexo IV (sinais de perigo)', url: COLREG, ref: 'tecnico-84' },
          { txt: 'US Sailing, estudo MOB 2020, recomendações I e VIII', url: USS_MOB },
          { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1), passo 1 (flutuação e vigia)', url: USS_SAS },
          { txt: 'RYA, Man overboard (alarme, vigia, botão MOB do plotter, MAYDAY ou alerta DSC)', url: RYA_MOB },
          { txt: 'US Sailing, Man Overboard Rescue Procedure (Peter Isler, 2016): Mayday ou Pan-Pan conforme a situação', url: USS_ISLER },
          { txt: 'Marinha do Brasil, Salvamento Marítimo (SALVAMAR)', url: 'https://www.marinha.mil.br/salvamarbrasil/', ref: 'travessia-107' },
        ] },
      ],
    },
    {
      id: 'l3',
      titulo: 'A volta: parada rápida e manobra do oito',
      minutos: 14,
      objetivos: [
        'Descrever a parada rápida (quick-stop) e a manobra do oito (reach-tack-reach)',
        'Escolher o método conforme o ponto de vela e a tripulação',
        'Parar o barco perto da pessoa, devagar, e fazer o contato com cabo',
      ],
      blocos: [
        { t: 'p', html: `Existem várias formas de voltar até a pessoa. As duas mais ensinadas são a <b>parada rápida</b> (<i>quick-stop</i>), que gira o barco perto do local da queda, e a <b>manobra do oito</b> (<i>reach-tack-reach</i>, ensinada pelo RYA), que se afasta alguns comprimentos antes de voltar. O que torna qualquer método eficaz é a mesma ideia: <b>ficar perto e saber o que fazer em cada passo</b>. A escolha recomendada pelo curso, com as razões, está na seção <b>O que este curso recomenda</b>.` },
        { t: 'callout', tipo: 'nota', titulo: 'Escolas variam, o princípio é o mesmo', html: `Instrutores ensinam variações, e fontes sérias discordam até do bordo de recolhimento. O estudo da US Sailing de 2020 concluiu que, nos casos analisados, sistemas que não reduzem a velocidade de afastamento logo no início tiveram resultados piores. O próprio US Sailing resume: nenhuma técnica serve a todos os casos, e o método depende do vento, do mar, do barco e da tripulação. Mesmo assim o curso não deixa a escolha no ar: mais abaixo, em <b>O que este curso recomenda</b>, ele diz qual método e qual lado usar num cruzeiro de 32 pés e por quê, sem apagar as variantes. Treine a manobra com seu instrutor e sua tripulação, no seu barco e em condições variadas.` },
        { t: 'tabela', cab: ['Ponto', 'O que todas as fontes ensinam', 'Onde as escolas divergem (fonte)'], linhas: [
          ['Primeiros segundos', 'Gritar o lado, lançar flutuação, ter alguém apontando para a pessoa, marcar o ponto MOB e alertar pelo VHF.', 'Vigia fixo: o Safety at Sea o sugere a partir de 5 pessoas e admite que seja inviável com 4 ou menos (US Sailing). Tom do alerta: “MAYDAY ou alerta DSC” (RYA) ou “Mayday ou, pelo menos, Pan-Pan” conforme a situação (US Sailing, Isler 2016).'],
          ['Ficar perto', 'Reduzir a velocidade de afastamento e ficar perto da pessoa (“a distância é o inimigo”).', 'Como: quick-stop (US Sailing, simpósio de 2005), oito ou reach-tack-reach (RYA, via Practical Boat Owner), Fast Return e Deep Beam Reach, que evitam o jaibe (simpósio de 2005).'],
          ['Velas', 'A genoa fora antes da aproximação final, para as escotas soltas não machucarem a pessoa (simpósio de 2005; RYA e RORC via Practical Boat Owner).', 'Arriar todas as velas antes de voltar: o Safety at Sea desaconselha, porque o tempo gasto afasta o barco da pessoa.'],
          ['Motor', 'Ponto morto até saber que não há cabo na água; ponto morto ou desligado junto da pessoa (Safety at Sea; RYA).', 'Voltar só sob vela, se houver vento (US Sailing, 2016), ou usar o motor sem hesitar, mas treinando também sem ele (Safety at Sea, v. 7.1).'],
          ['Lado do recolhimento', 'Aproximação final em bolina folgada (close reach), devagar e sem passar direto pela pessoa.', 'Pessoa a sotavento do barco, isto é, barco a barlavento dela (RYA; quase unanimidade das vítimas no simpósio de 2005) ou pessoa a barlavento do barco (quick-stop do RORC; US Sailing, 2004). Em mar duro, o barco a barlavento pode ser jogado sobre a pessoa (simpósio de 2005).'],
          ['Contato', 'Sem encostar o casco na pessoa; cabo, boia com retinida ou Lifesling.', 'Lifesling rebocado em círculos, a pelo menos meio comprimento de barco (US Sailing) ou parar ao lado, com croque ou cabo (RYA, via Practical Boat Owner).'],
          ['Velocidade de contato', 'Baixa, mas com governo (steerage).', '1 nó (regra de Annapolis, no programa de vela da Academia Naval dos EUA) a 2 ou 3 nós (vítimas no simpósio de 2005); o Safety at Sea pede não arrastar a pessoa a mais de 1 nó.'],
        ], legenda: 'Fontes no fim da lição. A coluna do meio é o que aparece em todas as fontes consultadas; a da direita, o que muda de uma escola ou de uma época para outra. Os testes do simpósio de 2005 foram em mar sem ondas oceânicas.' },
        { t: 'h', txt: 'Parada rápida (quick-stop)' },
        { t: 'p', html: `A parada rápida vem dos anos 1980, segundo o relatório do US Sailing de 2020, e é a base do treinamento do US Sailing. A ideia é <b>não aumentar a distância</b> da pessoa: o barco vira de imediato para o vento, sem soltar a vela de proa, e continua girando em volta dela, em vez de seguir em linha reta. Em 60 a 120 segundos, desde a queda até parar ao lado da pessoa, quando bem feita (US Sailing, caso Trisha, 2004).` },
        { t: 'lista', ordenada: true, itens: [
          `Grito, flutuação, vigia, MOB (lição anterior).`,
          `<b>Traga o barco ao vento</b> (orce) e cace as escotas até a bolina cerrada.`,
          `<b>Vire por davante sem mexer nas escotas da vela de proa.</b> A genoa fica contra o vento (aquartelada) e freia o barco (US Sailing, <i>Quick-Stop Rescue</i>, 2016, e Safety at Sea v. 7.1).`,
          `<b>Continue girando</b>, sem folgar as velas, até ficar com o vento quase pela popa, passando <b>abaixo</b> (a sotavento) da pessoa. Se o barco tem Lifesling, o Safety at Sea manda jogá-lo na água já nesta fase; o motor pode ser ligado, mas em ponto morto até saber que não há cabo na água.`,
          `Quando a pessoa ficar atrás do través, <b>arrie ou enrole a genoa</b> se a tripulação der conta (com tripulação pequena, o Safety at Sea admite seguir sem arriá-la), organize o resgate (o vigia segue apontando, o navegador acompanha o ponto MOB) e faça o <b>jaibe</b> com a grande ainda caçada.`,
          `<b>Orce até a bolina folgada</b> e governe na direção da pessoa “como se fosse pegar uma boia de amarração” (US Sailing, 2016). Controle a velocidade com as escotas e <b>pare ao lado dela</b>, com a pessoa a barlavento do barco (quick-stop do US Sailing); faça o contato com cabo ou Lifesling.`,
        ] },
        { t: 'callout', tipo: 'nota', titulo: 'Capa perto da pessoa é outra variante', html: `Pôr o barco de capa (<i>heave-to</i>) logo acima da pessoa e só então preparar a volta é descrito nos testes do simpósio de 2005 e usa-se também no RYA (via Practical Boat Owner), mas <b>não é</b> o quick-stop do US Sailing, que não para: continua girando, passa abaixo da pessoa e jaiba. A variante do RORC (Practical Boat Owner) capeia, arriba até a popa, jaiba com a vela de proa recolhida e a retranca ao centro, e recolhe a pessoa a barlavento. O curso recomenda a parada rápida como primeira resposta com tripulação reduzida; a capa perto da pessoa e a variante do RORC ficam como alternativas que o seu instrutor pode ensinar, e conhecer o que elas mudam ajuda a decidir com a tripulação.` },
        { t: 'widget', w: 'manobras', opts: { manobra: 'mob', variante: 'parada-rapida', seletor: false }, legenda: 'Passo a passo da parada rápida, com voz de comando e tarefa de cada tripulante.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Vento forte e mastro', html: `Virar por davante com a genoa aquartelada, a partir de bolina ou de través, não força o mastro mais do que navegar de bolina, segundo o estudo da US Sailing. Com balão ou vela de proa em tangone, as soluções variam: combine antes com o comandante e treine.` },
        { t: 'h', txt: 'Manobra do oito (reach-tack-reach)' },
        { t: 'p', html: `É a manobra do currículo do RYA (descrita pela Practical Boat Owner). Ela se afasta do local da queda, o que dá tempo para preparar velas e cabo, evita o jaibe e termina numa aproximação em bolina folgada, rumo em que é mais fácil <b>frear</b> só folgando a escota: com as velas panejando, o barco perde a força e para.` },
        { t: 'lista', ordenada: true, itens: [
          `Grito, flutuação, vigia, MOB.`,
          `Mude <b>imediatamente</b> para o rumo de través (vento a cerca de 90°): se vinha de bolina, arribe; se vinha de popa, orce.`,
          `Siga alguns comprimentos de casco com o vento pelo través. O widget abaixo usa cerca de 4; no simpósio de 2005 o Figure 8 usava cerca de 5, o Fast Return 2,5 e o Deep Beam Reach 2. Quanto mais curto, mais perto fica a pessoa, mas é preciso tempo para preparar tudo. Combine uma distância no barco; um dos autores do relatório prefere combinar um tempo (por exemplo, 20 segundos).`,
          `<b>Vire por davante</b> e arribe logo para uma popa aberta, o suficiente para cruzar a própria esteira.`,
          `Baixe ou enrole a genoa e orce até a <b>bolina folgada</b>, com a pessoa pela bochecha de sotavento. Regule as escotas aos poucos e chegue devagar, com as velas panejando. A velocidade de contato varia de 1 a 3 nós conforme a fonte; o olhar do timoneiro é para a pessoa, não para o velocímetro.`,
        ] },
        { t: 'figura', svg: svg('0 0 420 320', 'Manobra do oito: o barco segue de través, vira por davante, arriba para cruzar a própria esteira e aproxima em bolina folgada até a pessoa',
            seta('s3', 'var(--magenta)') + seta('s4', 'var(--ink)') +
            '<rect x="0" y="0" width="420" height="320" fill="var(--sea-1)"/>' +
            '<line x1="40" y1="30" x2="40" y2="82" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#s4)"/>' + t(52, 52, 'vento', 15) +
            '<path d="M110 200 L250 200 C270 200 284 172 264 150 C248 134 232 152 210 190 C198 212 186 228 172 240 C150 254 128 234 124 214" fill="none" stroke="var(--magenta)" stroke-width="3.5" marker-end="url(#s3)"/>' +
            '<circle cx="110" cy="200" r="7" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.5"/>' + t(60, 190, 'queda', 15) +
            num(180, 184, '1') + num(296, 166, '2') + num(238, 128, '3') + num(190, 262, '4') + num(92, 232, '5') +
            t(210, 306, 'Esquema sem escala', 14, 'middle')),
          legenda: `1 de través ao afastar-se · 2 vire por davante · 3 arribe e cruze a própria esteira · 4 orce para a bolina folgada · 5 pare com a pessoa pela bochecha de sotavento (versão do RYA). Desenho esquemático, sem escala.` },
        { t: 'h', txt: 'Em que bordo parar? Escolas divergem' },
        { t: 'p', html: `Aqui “sotavento” e “barlavento” são do <b>barco</b>. O RYA ensina parar com a pessoa a <b>sotavento</b>: o barco fica a barlavento dela, faz abrigo do vento e deriva devagar na direção dela, e não para longe (descrição da Practical Boat Owner). A página atual do RYA diz o mesmo em outras palavras: posicionar o barco “a barlavento” da pessoa, para que, ao reduzir a velocidade, o vento leve o barco até ela. Nos testes do simpósio do US Sailing de 2005, as pessoas que fizeram o papel de vítima preferiram, quase por unanimidade, o barco a barlavento da pessoa; elas avisaram que, em mar muito duro, o barco pode ser jogado com violência sobre a pessoa.` },
        { t: 'p', html: `O outro lado também tem defensores. Na técnica de regata descrita pelo RORC (Practical Boat Owner), a pessoa é recolhida a <b>barlavento</b> do barco. O texto do US Sailing de 2004 sobre o quick-stop também termina com a pessoa a barlavento e relata que, num trimarã com muito arrasto do vento, o casco poderia ter atingido a pessoa na cabeça se a aproximação fosse por sotavento. Nos dois casos o princípio é parar perto, na altura do través, onde a borda é mais baixa, e fazer o contato com cabo ou Lifesling em vez de encostar o casco. O curso recomenda o primeiro lado (pessoa a sotavento do barco), e deixa o segundo para quando o barco correria sobre a pessoa, como descrito logo abaixo. Treine a manobra com seu instrutor e sua tripulação.` },
        { t: 'h', txt: 'O que este curso recomenda' },
        { t: 'p', html: `Aqui o curso escolhe, e diz por quê. É um <b>julgamento do curso a partir das fontes</b>, para um veleiro de cruzeiro típico, e não norma da Marinha do Brasil: o Safety at Sea do US Sailing lembra que nenhuma técnica serve a todos os casos, então as variantes seguem descritas, cada uma com a sua fonte.` },
        { t: 'tabela', cab: ['Situação', 'O que o curso recomenda', 'Por quê (fonte)'], linhas: [
          ['Tripulação reduzida (casal, três ou quatro pessoas)', '<b>Parada rápida</b> como primeira resposta, com o Lifesling lançado já na fase de giro, se o barco tiver.', 'Mantém o barco perto da pessoa: “a distância é o inimigo” (Safety at Sea v. 7.1). Sistemas sem quick-stop ou parecido tiveram resultados piores (estudo de 2020, achado 4). Com 4 ou menos pode não haver vigia fixo, e então ficar perto pesa mais (Safety at Sea). A maioria dos organizadores do simpósio de 2005 a considerou a melhor para a maioria dos acidentes.'],
          ['Tripulação que dá conta de manobrar e boa visibilidade', '<b>Manobra do oito</b> (reach-tack-reach).', 'Afastar-se alguns comprimentos dá tempo de preparar velas e cabo, evita o jaibe e chega em bolina folgada, onde se freia folgando a escota (RYA, via Practical Boat Owner). “Boa visibilidade” é critério do curso: de noite ou com onda, a pessoa mais longe é mais fácil de perder de vista (o estudo de 2020 aponta a noite como o caso mais difícil). Na dúvida, parada rápida.'],
          ['Aproximação final, nos dois métodos', 'Em bolina folgada, <b>devagar e com controle de velocidade</b>: folgue as escotas até panejarem para frear, olhe a pessoa e não o velocímetro, genoa arriada ou enrolada, motor em ponto morto ou desligado.', 'Simpósio de 2005: manobras terminam em bolina folgada, em baixa velocidade, com o olhar do timoneiro no resgate. Referência prudente de 1 nó (regra de Annapolis; o Safety at Sea pede não arrastar a pessoa a mais de 1 nó); as vítimas dos testes aceitaram 2 a 3 nós.'],
          ['Lado do recolhimento', '<b>Pessoa a sotavento do barco</b> (barco a barlavento dela), no costado baixo, perto da popa.', 'É o que o RYA ensina: o barco faz abrigo, é levado até a pessoa ao perder velocidade, e do lado de sotavento a borda fica mais perto da água (Practical Boat Owner; RYA). O simpósio de 2005 descreve a chegada com o barco a barlavento da pessoa, preferida quase por unanimidade pelas vítimas. “Costado baixo, perto da popa” é a escolha prática do curso, não uma frase do RYA: a borda ali costuma ser a mais baixa e o cockpit fica perto, mas ali também fica o hélice, então motor em ponto morto ou desligado.'],
        ], legenda: 'Fontes no fim da lição. A coluna do meio é a recomendação do curso; a da direita, o que a sustenta e onde ela é julgamento do curso.' },
        { t: 'callout', tipo: 'nota', titulo: 'Quando a variante a barlavento convém', html: `Deixar a pessoa a <b>barlavento</b> do barco é o que descrevem o US Sailing em 2004 (quick-stop, caso Trisha) e o RORC (via Practical Boat Owner). Convém quando o barco, ao perder velocidade, correria sobre a pessoa mais depressa do que você consegue controlar: barco com muito arrasto do vento (o relato de 2004 diz que, num trimarã, um casco poderia ter atingido a pessoa na cabeça se a aproximação fosse por sotavento) ou mar duro, em que o simpósio de 2005 avisa que o barco a barlavento pode ser jogado com violência sobre a pessoa. Nos dois lados vale o mesmo: parar perto, na altura do través, e fazer o contato por cabo ou Lifesling, sem usar o casco. O desenho da parada rápida mais acima termina nesse lado B; o curso recomenda o lado A.` },
        { t: 'p', html: `<b>Treine a manobra com seu instrutor e sua tripulação</b>, no seu barco, pelos dois lados, com vento leve e forte e à noite. O simpósio de 2005 avisa que o “método perfeito” de um barco pode valer só para ele.` },
        { t: 'h', txt: 'Perto, devagar e com cabo' },
        { t: 'lista', itens: [
          `<b>Chegue devagar.</b> No estudo de 2020, em 5 de 8 casos em que o barco voltou e a pessoa morreu, foram necessárias várias passadas para conseguir o contato, e em vários o casco atingiu a pessoa.`,
          `<b>Não passe direto.</b> Quem passa rápido demais não consegue nem jogar o cabo.`,
          `<b>Faça o contato com cabo ou Lifesling,</b> não com o casco: barcos modernos têm proa reta, pouca borda e giram mal em baixa velocidade, e as ondas empurram a proa.`,
          `<b>Motor.</b> Muitos retornos bem-sucedidos usaram o motor, mas cabos soltos na água enroscam no hélice. Ligue o motor e deixe-o em ponto morto até ter certeza de que não há cabo nem escota na água; com a pessoa perto, mantenha em ponto morto ou desligado. Se o barco reboca um Lifesling, treine essa volta com e sem o motor: um cabo na hélice tira o motor da manobra.`,
          `<b>Quem treina chega.</b> O estudo mostrou que tripulações sem treino tiveram dificuldade em manobrar o barco de volta. Pratique com um objeto, em vento leve e forte, de dia e de noite, e dê a vez a todos no leme.`,
        ] },
        { t: 'widget', w: 'manobras', opts: { manobra: 'mob', variante: 'oito', seletor: false }, legenda: 'Passo a passo da manobra do oito. Use o modo desafio para ordenar as etapas.' },
        { t: 'termos', ids: ["capear", "aquartelar", "orcar", "arribar", "jaibe", "cambar", "bolina-folgada", "seguimento"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-007', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Na parada rápida (quick-stop), o que se faz com a escota da vela de proa ao virar por davante?',
            alternativas: ['Não se mexe nela: a vela fica aquartelada e o barco perde seguimento', 'Solta-se toda, para o barco parar imediatamente', 'Passa-se para o outro bordo como numa virada normal', 'Recolhe-se a vela antes de virar'],
            correta: 0,
            explicacao: 'Deixar a escota como está mantém a genoa contra o vento, freia o barco e o mantém perto da pessoa. Soltar tudo faria o barco seguir em linha, afastando-se. Passar a escota como numa virada normal deixaria a vela trabalhando e o barco com velocidade; recolher antes toma tempo precioso.',
            referencia: 'US Sailing, Quick-Stop; estudo MOB 2020', fonte_url: USS_MOB },
          { id: 'vela-2-008', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Qual é o rumo inicial na manobra do oito (reach-tack-reach), logo após o grito de homem ao mar?',
            alternativas: ['De través (vento a cerca de 90°)', 'Direto para o vento, parando o barco', 'Popa total, para fugir da onda', 'O que for mais rápido, sem regra'],
            correta: 0,
            explicacao: 'O través permite virar por davante com segurança e voltar de modo a cruzar a própria esteira. Parar no vento e popa total não fazem parte do método e dificultam a volta.',
            referencia: 'RYA, Day Skipper (homem ao mar)' },
          { id: 'vela-2-009', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Por que o contato com a pessoa deve ser feito, de preferência, com um cabo ou uma Lifesling e não encostando o casco?',
            alternativas: ['O casco pode machucá-la, e barcos modernos são difíceis de controlar devagar', 'O casco não flutua perto de pessoas', 'É proibido encostar o casco em pessoas', 'O cabo é sempre mais rápido do que a escada'],
            correta: 0,
            explicacao: 'No estudo da US Sailing, o casco atingiu a pessoa em vários casos, contribuindo para a morte. Os cascos modernos giram mal em baixa velocidade. Não existe proibição em norma nem regra de que o cabo seja sempre mais rápido.',
            referencia: 'US Sailing, estudo MOB 2020, item 2', fonte_url: USS_MOB },
        ] },
        { t: 'fontes', itens: [
          { txt: 'US Sailing, A Study Evaluating MOB Return and Recovery in the 21st Century (2020), itens 2, 3 e 4', url: USS_MOB },
          { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies and the Rescue Testing Symposium (v. 7.1): quick-stop com o jib aback, motor em ponto morto, Lifesling', url: USS_SAS },
          { txt: 'US Sailing, Quick-Stop Rescue (2016)', url: USS_QS },
          { txt: 'US Sailing, Rousmaniere, Final Report 2005 Crew Overboard Rescue Symposium (manobras, aproximação final em bolina folgada e baixa velocidade, barco a barlavento preferido pelas vítimas, quick-stop como preferida da maioria, aviso de mar duro)', url: USS_SIM },
          { txt: 'US Sailing, Arthur B. Hanson Rescue Medal, caso Trisha (2004): quick-stop e debate barlavento x sotavento', url: USS_HANSON },
          { txt: 'RYA, Man overboard: posicionar o barco a barlavento, motor em ponto morto ou desligado junto da pessoa', url: RYA_MOB },
          { txt: 'Practical Boat Owner, Man overboard turns: getting back to the casualty in the water (RYA reach-tack-reach, aproximação com a pessoa a sotavento do barco, lado mais próximo da água; RORC quick-stop, recolhimento a barlavento)', url: 'https://www.pbo.co.uk/seamanship/man-overboard-turns-getting-back-to-the-casualty-in-the-water-104939' },
          { txt: 'IMO/ICAO, IAMSAR Manual, vol. III', url: 'https://www.imo.org/en/OurWork/Safety/Pages/IAMSARManual.aspx' },
        ] },
      ],
    },
    {
      id: 'l4',
      titulo: 'Recolher a pessoa: Lifesling, escada, talha e balsa',
      minutos: 13,
      objetivos: [
        'Escolher o método de recolhimento conforme a condição da pessoa',
        'Usar a Lifesling, a escada de popa e a talha na retranca',
        'Cuidar da pessoa depois do resgate (hipotermia e afogamento)',
      ],
      blocos: [
        { t: 'p', html: `Voltar até a pessoa é metade do problema. A outra metade é <b>tirá-la da água</b>. Uma pessoa exausta, ferida ou encharcada pesa o dobro do que parece, e a borda livre de um veleiro de 32 pés, por exemplo, fica a cerca de 0,8 a 1 m da água (e é maior nos barcos maiores, o que dificulta ainda mais a recuperação). Sem plano, muita gente fica na água por tempo demais mesmo com o barco ao lado.` },
        { t: 'h', txt: 'Fazer o contato' },
        { t: 'lista', itens: [
          `<b>Lifesling:</b> um colar flutuante preso a um cabo flutuante, guardado numa bolsa na popa. A bolsa fica presa ao guarda-mancebo e o cabo sai dela quando o barco circula. O método é “rebocar o colar em círculos em volta da pessoa” até ela alcançá-lo, como na pesca de esquiador aquático. Para o estudo da US Sailing, cerca de metade dos casos fatais podia ter tido melhor desfecho com a Lifesling.`,
          `<b>Cabo arremessado</b> (retinida): jogue com uma alça de lais de guia ou com uma boia na ponta.`,
          `<b>Boia com retinida:</b> pelo que a NORMAM-211 exige (veja o quadro abaixo), cada boia leva luz de acendimento automático e pelo menos uma leva retinida flutuante.`,
          `<b>Nadador treinado:</b> só em barco grande e com tripulação treinada; saindo preso a um cabo, nunca solto.`,
        ] },
        { t: 'fato', ref: 'extra-mestre-3-07', html: `Embarcação de médio porte com menos de 12 m deve ter uma boia salva-vidas circular ou ferradura; com 12 m ou mais, duas. Fora da navegação interior, cada boia leva luz de acendimento automático, e pelo menos uma tem retinida flutuante.` },
        { t: 'h', txt: 'Içar a pessoa' },
        { t: 'p', html: `Quatro métodos que todo veleiro de cruzeiro deveria ter ensaiado:` },
        { t: 'tabela', cab: ['Método', 'Como funciona', 'Quando serve', 'Cuidados'], linhas: [
          ['Escada de popa', 'Desce da plataforma de popa até abaixo da linha d\'água', 'Pessoa consciente e com força', 'Motor desligado. Em ondas, a popa sobe e desce e pode machucar'],
          ['Talha na retranca', 'Com o amantilho firme segurando a ponta da retranca, abra-a para fora do casco; prenda a talha da escota da grande no colete ou na Lifesling e puxe', 'Pessoa exausta, sem força, barco pequeno', 'Segure a retranca contra o balanço; confira o amantilho e o ponto de fixação'],
          ['Adriça + catraca', 'Prenda a adriça (genoa ou balão) na Lifesling ou no colete e grinda a catraca', 'Pessoa pesada ou sem força', 'Verifique o engate: o colete tem alça alta?'],
          ['Rampa de vela (parbuckle)', 'Estenda a borda de uma vela solta ao longo do costado e puxe-a para dentro, rolando a pessoa pela borda', 'Sem equipamento; barco com borda baixa', 'Exige tripulação; treine antes'],
        ], legenda: 'Cada barco é diferente. O que importa é que a tripulação já tenha experimentado o método com uma pessoa de verdade (vestida) numa água calma.' },
        { t: 'p', html: `<b>Lifesling e adriça (procedimento do US Sailing, v. 7.1).</b> O US Sailing recomenda este método para a maioria dos barcos com menos de 72 pés e tripulação completa, e o considera quase obrigatório em barcos com pouca gente e em barcos de cruzeiro. Faça em terra um nó de alça no cabo do Lifesling, de 10 a 12 pés (cerca de 3 a 3,6 m) acima do colar. Com a pessoa já dentro do colar, puxe-a à mão até a altura do meio do barco, prenda uma adriça de balão nesse nó e iça. Antes de içar, <b>pare o barco</b>: não arraste a pessoa a mais de 1 nó. Se ela for puxada depressa demais, ensine-a a se virar de costas para o barco, para a água não bater no rosto. Em barcos com quinas duras perto dos ovéns ou com borda alta, o US Sailing descreve um nó mais alto (cerca de 30 pés) que mantém a pessoa longe do casco enquanto sobe. Treine com um peso real antes de fixar a posição do nó.` },
        { t: 'callout', tipo: 'seguranca', titulo: 'Motor desligado perto da pessoa', html: `Antes de colocar a pessoa junto da popa, desengrene e desligue o motor. Um hélice girando é a lesão mais grave de todas, e o RYA pede o motor em ponto morto ou desligado quando a pessoa está ao costado. A escada de popa só se usa com o motor desligado.` },
        { t: 'callout', tipo: 'nota', titulo: 'Retranca e adriça com a pessoa presa ao barco', html: `Se a pessoa estiver presa pelo tirante e arrastada, pare o barco o mais depressa possível (quick-stop, ou orçar e arriar o balão). O estudo de 2020 cita a regata Clipper, que passou a prender uma adriça no tirante e içar. Nos testes seguintes, porém, o US Sailing constatou que um tirante comum não desliza pelo mosquetão da adriça e chegou a quebrar o tirante, e por isso recomenda, neste caso, os métodos clássicos: agarrar a pessoa e içá-la com ajuda do tirante, ou jogar o Lifesling e içá-la.` },
        { t: 'h', txt: 'Barco inundado ou balsa' },
        { t: 'p', html: `Se o barco está afundando, a equipe pode ter que recorrer à balsa. A NORMAM-211 exige balsa salva-vidas na navegação oceânica para todas as pessoas a bordo. A balsa serve para abandonar o barco, e não para recolher alguém que caiu: raramente se infla uma balsa por homem ao mar.` },
        { t: 'fato', ref: 'travessia-114', html: `Na navegação oceânica a embarcação deve ter balsas salva-vidas infláveis para 100% das pessoas a bordo, podendo ser classe II.` },
        { t: 'h', txt: 'Depois do resgate' },
        { t: 'lista', itens: [
          `<b>Respiração e circulação primeiro.</b> Se a pessoa não respira, inicie a ressuscitação cardiopulmonar (RCP) e peça orientação médica pelo rádio; veja o módulo de primeiros socorros do curso de rádio e segurança.`,
          `<b>Seque, aqueça e observe.</b> Troque a roupa molhada, cubra com cobertor e mantenha a pessoa por um tempo sob observação, mesmo que pareça bem: quem engoliu água pode piorar horas depois.`,
          `<b>Água fria exige cuidado extra.</b> O RYA pede que uma pessoa inconsciente seja içada na posição horizontal, para evitar as complicações da compressão hidrostática. Em água fria, a retirada deitada e o aquecimento gradual são mais seguros do que içar a pessoa em pé.`,
          `<b>Avise e registre.</b> Anote horário e posição no diário de bordo. Se a Marinha ou a central tinham sido avisadas, comunique que a pessoa foi recolhida e cancele o alerta.`,
        ] },
        { t: 'figura', svg: svg('0 0 400 290', 'Lifesling rebocada em círculos em volta da pessoa: o barco gira e o cabo flutuante passa ao alcance dela',
            seta('l1', 'var(--magenta)') + seta('l2') +
            '<rect x="0" y="0" width="400" height="290" fill="var(--sea-1)"/>' +
            '<line x1="26" y1="28" x2="26" y2="78" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#l2)"/>' + t(36, 52, 'vento', 15) +
            '<circle cx="200" cy="150" r="82" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="6 5"/>' +
            casco(200, 68, 0.55, 90, 'var(--sea-2)') +
            '<path d="M172 68 C104 70 76 150 118 206 C160 258 262 240 280 170 C292 122 252 100 226 144" fill="none" stroke="var(--magenta)" stroke-width="3" marker-end="url(#l1)"/>' +
            '<circle cx="200" cy="150" r="7" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.6"/>' +
            '<circle cx="224" cy="146" r="9" fill="none" stroke="var(--nav-red)" stroke-width="4"/>' +
            t(168, 176, 'pessoa', 15, 'end') + t(240, 176, 'colar', 15, 'start') + t(120, 244, 'cabo flutuante', 15, 'end', 'var(--magenta)') +
            t(200, 282, 'Esquema sem escala', 14, 'middle')),
          legenda: `O barco circula a pessoa (círculo tracejado) rebocando o colar; o cabo flutuante forma um laço que passa ao alcance dela. Quando ela agarra o colar, o barco para e a pessoa é puxada pelo cabo, longe do casco e do hélice. Desenho esquemático.` },
        { t: 'termos', ids: ["boia-circular", "retinida", "hipotermia", "choque-termico", "adrica", "talha", "retranca", "balsa-salva-vidas"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-010', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Como funciona a Lifesling na aproximação à pessoa?',
            alternativas: ['O barco reboca o colar em círculos em volta da pessoa até ela alcançá-lo', 'O barco para a 50 m e a pessoa nada até o colar', 'O colar é lançado de longe com um arremessador', 'O colar fica preso ao barco e a pessoa precisa subir a escada sozinha'],
            correta: 0,
            explicacao: 'O cabo flutuante e o colar são rebocados em círculo em volta da pessoa, como na pesca de esquiador aquático, e o cabo passa ao alcance dela. Pedir que ela nade 50 m é perigoso e não é o método; arremessador não faz parte do sistema; escada é outro método.',
            referencia: 'US Sailing, estudo MOB 2020, item 2', fonte_url: USS_MOB },
          { id: 'vela-2-011', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 1,
            enunciado: 'Antes de usar a escada de popa para recolher alguém, o que se faz com o motor?',
            alternativas: ['Desengrena e desliga', 'Mantém em marcha lenta adiante', 'Engrena atrás para parar', 'Acelera para manter o governo'],
            correta: 0,
            explicacao: 'A escada de popa fica perto do hélice. Desengrenado e desligado, ele não machuca. Em marcha, qualquer direção pode ferir a pessoa.',
            referencia: 'NORMAM-211, Anexo 5-F, item 13 (propulsores e pessoas na água); Arte Naval' },
          { id: 'vela-2-012', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 3,
            enunciado: 'A pessoa foi recolhida e parece bem. O que fazer?',
            alternativas: ['Mantê-la aquecida e em observação, porque quem engoliu água pode piorar depois', 'Deixá-la voltar ao quarto de vigia, se ela disser que está bem', 'Dar bebida alcoólica para esquentar', 'Dispensar o registro, já que não houve vítima'],
            correta: 0,
            explicacao: 'A observação é necessária mesmo com a pessoa bem; o afogamento secundário pode aparecer horas depois. Voltar ao serviço cedo é arriscado. Álcool dilata os vasos e aumenta a perda de calor. O registro no diário de bordo é parte da prática marinheira.',
            referencia: 'Cruz Vermelha / protocolos de afogamento; Miguens, vol. III' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, dotação de boias salva-vidas (art. 4.15)', url: NORMAM, ref: 'extra-mestre-3-07' },
          { txt: 'US Sailing, estudo MOB 2020, itens 2 e 9', url: USS_MOB },
          { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1): passos 3 a 5, nó do Lifesling e pessoa ainda presa ao barco', url: USS_SAS },
          { txt: 'RYA, Man overboard: motor em ponto morto ou desligado; içar na horizontal', url: RYA_MOB },
          { txt: 'World Sailing, Offshore Special Regulations: boia salva-vidas, localizador AIS e treinamento de homem ao mar', url: OSR, ref: 'travessia-30' },
        ] },
      ],
    },
    {
      id: 'l5',
      titulo: 'Tecnologia e treino: MOB no GPS, DSC, AIS pessoal e simulação',
      minutos: 11,
      objetivos: [
        'Usar o botão MOB do plotter e do GPS',
        'Distinguir os alertas DSC de homem ao mar e o localizador AIS pessoal',
        'Planejar o treino anual e o treino noturno',
      ],
      blocos: [
        { t: 'p', html: `A tecnologia muda muito a chance de encontrar a pessoa, principalmente de noite. Mas ela só ajuda quem sabe usar: o botão MOB, o localizador AIS e o rádio DSC precisam ser testados antes da viagem, não durante o susto.` },
        { t: 'h', txt: 'Botão MOB no GPS ou no plotter' },
        { t: 'lista', itens: [
          `Em um toque, guarda a posição atual como ponto MOB e mostra <b>rumo e distância</b> para voltar. Alguns plotters passam a mostrar o ponto MOB na tela de navegação.`,
          `<b>Ponto fixo, não do homem:</b> a pessoa deriva com a corrente e o vento. Por isso, em corrente forte, o ponto marcado vira referência de partida e não de chegada. Mantenha a vigia visual.`,
          `<b>Dois aparelhos.</b> A NORMAM-211 exige dois GNSS na navegação oceânica para embarcações de médio porte. Em um deles, deixe o MOB programado e ensaiado.`,
        ] },
        { t: 'fato', ref: 'extra-mestre-1-02', html: `Pela NORMAM-211, embarcações de médio porte devem ter GNSS: 1 aparelho na navegação costeira e 2 na oceânica (recomendado que ao menos um tenha fonte de energia independente).` },
        { t: 'h', txt: 'Rádio DSC' },
        { t: 'p', html: `O rádio VHF com <b>DSC</b> (Chamada Seletiva Digital) envia um alerta digital com o seu MMSI e a posição do GPS ligado ao rádio. Muitos modelos permitem escolher a natureza do perigo, inclusive “homem ao mar”. Seu GPS precisa estar conectado ao rádio, senão o alerta sai sem posição.` },
        { t: 'fato', ref: 'tecnico-87', html: `Anexo IV do RIPEAM: é sinal de perigo o alerta DSC no VHF canal 70 ou nas frequências MF/HF listadas.` },
        { t: 'h', txt: 'Localizador pessoal: AIS e PLB' },
        { t: 'p', html: `O <b>localizador AIS de homem ao mar</b> (AIS MOB beacon) é um aparelho pequeno que vai no colete ou no bolso. Quando a pessoa cai, ele transmite a posição e dispara um alarme no AIS e no plotter do barco. No estudo da US Sailing, mesmo em barcos rápidos, o raio de recepção de 2 milhas náuticas bastaria na maioria dos casos. A <b>PLB</b> usa 406 MHz via satélite, com alcance muito maior, mas o alerta vai ao centro de busca e salvamento, não ao seu barco, e leva mais tempo; não serve de rastreador local nem substitui o AIS.` },
        { t: 'fato', ref: 'travessia-29', html: `Para regatas e travessias oceânicas, as regras da World Sailing exigem, nas categorias 0 a 2, um localizador pessoal AIS de homem ao mar para cada tripulante.` },
        { t: 'lista', itens: [
          `<b>Teste mensal:</b> use o botão de teste, não ative a emergência por brincadeira.`,
          `<b>Saiba ligar à mão.</b> No estudo, uma pessoa levou uma hora para perceber que seu AIS estava desligado; ao ligá-lo, o barco a encontrou em minutos.`,
          `<b>A antena do VHF no topo do mastro</b> é a que recebe o sinal. Se ela falhar, o AIS não chega. Muitos barcos levam antena de reserva.`,
        ] },
        { t: 'h', txt: 'Treino: a prova que não é de papel' },
        { t: 'fato', ref: 'travessia-42', html: `Em todas as categorias das regras da World Sailing, ao menos uma vez por ano a tripulação deve praticar recuperação de homem ao mar e abandono da embarcação.` },
        { t: 'lista', itens: [
          `<b>Treino com objeto:</b> uma defensa amarrada a uma boia, em vez de gente. Quem sabe que vai acontecer treina melhor e não se esquece.`,
          `<b>Cada um no leme.</b> O US Sailing recomenda que cada pessoa pratique ao menos metade de um quarto no leme: o timoneiro habitual pode ser justamente quem caiu.`,
          `<b>Dia e noite.</b> Ensaie com luz de convés, lanterna e as luzes dos coletes. Boias com luz e a lanterna flutuante ajudam a achar a pessoa.`,
          `<b>Vento fraco e vento forte.</b> Quem só treina em calmaria não aprende a lidar com ondas e com o balanço.`,
          `<b>Apite.</b> O apito do colete é o melhor amigo de quem está na água à noite; se ouvir um apito, pare o motor e escute.`,
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Roteiro de um treino anual', html: `1) Briefing em terra: quem faz o quê. 2) Em água calma e com objeto flutuante: parada rápida em vento leve, 3 vezes. 3) Mesma coisa com o oito. 4) Com vento forte, se for seguro. 5) Uma vez à noite, com luzes. 6) Recolher uma pessoa vestida de colete, na escada e na talha. Registre no diário de bordo.` },
        { t: 'figura', svg: svg('0 0 420 300', 'Quem recebe cada alerta: o AIS pessoal alerta o próprio barco; a baliza PLB avisa o centro de busca por satélite; o rádio DSC avisa estações e navios próximos',
            seta('f1', 'var(--magenta)') + seta('f2') +
            '<rect x="0" y="0" width="420" height="300" fill="var(--sea-1)"/>' +
            '<circle cx="56" cy="236" r="12" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.6"/>' + t(56, 272, 'pessoa na água', 15, 'middle') +
            casco(206, 236, 0.7, 0, 'var(--sea-2)') + t(206, 276, 'seu barco', 15, 'middle') +
            '<rect x="296" y="120" width="112" height="56" rx="6" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.5"/>' + t(352, 144, 'Centro SAR', 15, 'middle') + t(352, 164, '(SALVAMAR)', 15, 'middle') +
            '<ellipse cx="206" cy="44" rx="50" ry="22" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.5"/>' + t(206, 50, 'satélite', 15, 'middle') +
            '<line x1="76" y1="236" x2="170" y2="236" stroke="var(--magenta)" stroke-width="3" marker-end="url(#f1)"/>' + t(122, 214, 'AIS pessoal', 15, 'middle', 'var(--magenta)') + t(122, 256, '(VHF, ~2 mn)', 15, 'middle', 'var(--magenta)') +
            '<line x1="62" y1="222" x2="164" y2="58" stroke="var(--ink)" stroke-width="2" marker-end="url(#f2)"/>' + t(52, 150, 'PLB 406 MHz', 15, 'start') +
            '<line x1="252" y1="54" x2="330" y2="114" stroke="var(--ink)" stroke-width="2" marker-end="url(#f2)"/>' +
            '<line x1="236" y1="226" x2="326" y2="184" stroke="var(--ink)" stroke-width="2" marker-end="url(#f2)"/>' + t(300, 224, 'DSC / Mayday', 15, 'start')),
          legenda: `O AIS pessoal alarma o plotter do seu barco (alcance de cerca de 2 milhas em mar, segundo o estudo da US Sailing). A PLB 406 MHz alerta o centro de busca e salvamento por satélite, mas demora mais. O rádio DSC avisa as estações costeiras e os navios na área.` },
        { t: 'termos', ids: ["gnss", "ais-mob", "epirb", "plb", "dsc", "mmsi", "infosar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-013', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Por que o ponto marcado pelo botão MOB nem sempre é onde a pessoa estará?',
            alternativas: ['A pessoa deriva com a corrente e o vento', 'O GPS erra mais de 1 milha', 'O botão marca o ponto da última boia lançada', 'O botão só funciona em marcha a motor'],
            correta: 0,
            explicacao: 'A posição guardada é a do barco no instante do toque. A pessoa se afasta com a corrente e o vento. O erro do GPS é de poucos metros, o botão não depende de boia nem de motor.',
            referencia: 'Miguens, vol. III (GNSS); manual do plotter' },
          { id: 'vela-2-014', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 1,
            enunciado: 'O que o localizador AIS de homem ao mar faz ao ser ativado na água?',
            alternativas: ['Transmite a posição e dispara um alarme no AIS e no plotter do barco', 'Envia uma mensagem de texto para a família', 'Liga o motor do barco', 'Infla o colete e solta a âncora'],
            correta: 0,
            explicacao: 'O AIS pessoal transmite a posição em VHF e faz soar o alarme dos aparelhos do barco que recebem AIS. Ele não manda mensagens, não liga motor e não solta âncora.',
            referencia: 'World Sailing, OSR 4.22; US Sailing, estudo MOB 2020', fonte_url: USS_MOB },
          { id: 'vela-2-015', nivel: 'vela', tema: 'Homem ao mar sob vela', dificuldade: 2,
            enunciado: 'Com que frequência mínima as regras de segurança da World Sailing pedem treino de homem ao mar e abandono?',
            alternativas: ['Ao menos uma vez por ano', 'A cada 5 anos', 'Só antes da primeira travessia', 'A cada mês'],
            correta: 0,
            explicacao: 'O treino anual de recuperação de homem ao mar e abandono vale para todas as categorias. Fazer só uma vez na vida deixa a tripulação sem prática.',
            referencia: 'World Sailing, OSR 6.04', fonte_url: OSR },
        ] },
        { t: 'fontes', itens: [
          { txt: 'World Sailing, Offshore Special Regulations (AIS pessoal; treinamento anual)', url: OSR, ref: 'travessia-42' },
          { txt: 'RIPEAM-72, Anexo IV', url: COLREG, ref: 'tecnico-87' },
          { txt: 'US Sailing, estudo MOB 2020, itens 5, 7 e 8', url: USS_MOB },
          { txt: 'NORMAM-211/DPC: GNSS em embarcações de médio porte', url: NORMAM, ref: 'extra-mestre-1-02' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm7',
  titulo: 'Motor e manobras no porto',
  resumo: `A maior parte dos arranhões, dos sustos e dos cabos no hélice acontece a menos de 100 metros do cais. Aqui você aprende como um veleiro de quilha responde ao motor e ao vento, como preparar cabos e defensas, como atracar de lado e de popa, pegar uma poita e sair de uma vaga apertada com vento lateral, com dicas para marinas e iates clubes brasileiros.`,
  licoes: [
    {
      id: 'l1',
      titulo: 'Como o veleiro de quilha responde ao motor, ao leme e ao vento',
      minutos: 13,
      objetivos: [
        'Prever o efeito de passo do hélice dando adiante e dando atrás',
        'Usar a corrente de descarga sobre o leme para girar quase no lugar',
        'Explicar por que o vento domina a manobra em baixa velocidade',
      ],
      blocos: [
        { t: 'p', html: `Um veleiro de cruzeiro pesa várias toneladas (cerca de 4 a 6 num 32 pés, por exemplo, e mais nos barcos maiores), tem casco fundo, uma quilha e um motor pequeno. Isso o torna muito diferente de uma lancha: ele <b>ganha velocidade devagar, perde devagar e não anda de lado</b>. Em compensação, o mastro e o casco alto fazem do vento um motor extra, que muitas vezes manda mais que o seu motor. Quem entende essas quatro forças (hélice, leme, vento, corrente) manobra com folga mesmo em espaço apertado.` },
        { t: 'fato', ref: 'extra-arrais-1-03', html: `No treinamento prático do Arrais-Amador, o instrutor demonstra a ação do leme e do hélice, e o aluno executa atracação, desatracação, fundeio e suspender. Vale para qualquer tipo de barco; no veleiro, o domínio é ainda mais importante.` },
        { t: 'h', txt: 'O hélice: empurra e “anda de lado”' },
        { t: 'p', html: `Muitos veleiros têm um hélice de <b>passo à direita</b>: visto de ré, ele gira no sentido horário quando o motor dá adiante. Além do empurrão para a frente, o hélice tende a levar a popa para o lado, como uma roda no chão. É o <b>efeito de passo</b> (<i>prop walk</i>).` },
        { t: 'figura', svg: svg('0 0 400 290', 'Efeito de passo de um hélice de passo à direita num veleiro: dando atrás a popa vai para bombordo, com força; dando adiante tende levemente a boreste',
            seta('p1', 'var(--magenta)') + seta('p2') +
            t(100, 28, 'Dando atrás', 16, 'middle', 'var(--ink)', 'font-weight="700"') + t(300, 28, 'Dando adiante', 16, 'middle', 'var(--ink)', 'font-weight="700"') +
            casco(100, 112, 1.9, 0) + casco(300, 112, 1.9, 0) +
            '<line x1="156" y1="96" x2="156" y2="146" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#p2)"/>' +
            '<line x1="344" y1="146" x2="344" y2="96" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#p2)"/>' +
            '<line x1="86" y1="168" x2="30" y2="168" stroke="var(--magenta)" stroke-width="5" marker-end="url(#p1)"/>' +
            '<line x1="314" y1="168" x2="340" y2="168" stroke="var(--magenta)" stroke-width="2.5" marker-end="url(#p1)"/>' +
            t(100, 252, 'popa para bombordo (forte)', 15, 'middle', 'var(--magenta)', 'font-weight="700"') +
            t(300, 252, 'popa para boreste (fraco)', 15, 'middle', 'var(--magenta)', 'font-weight="700"') +
            t(100, 274, 'bombordo = esquerda', 14, 'middle') + t(300, 274, 'seta preta = movimento', 14, 'middle')),
          legenda: `Vista de cima, proa para cima. Hélice de passo à direita. Dando atrás, a popa vai com força para bombordo e o leme quase não ajuda até o barco ter seguimento a ré. Dando adiante, o efeito é fraco e o leme o compensa sem você notar. Com hélice de passo à esquerda, tudo se inverte.` },
        { t: 'p', html: `<b>Descubra o seu.</b> Em água livre, com o barco parado e o leme a meio, dê atrás devagar e veja para que lado a popa vai. Se for para bombordo, o passo é à direita. Anote no painel: é a primeira informação de qualquer manobra no porto.` },
        { t: 'h', txt: 'Corrente de descarga e leme' },
        { t: 'p', html: `O hélice joga um jato de água para ré, a <b>corrente de descarga</b>. Em quase todo veleiro o leme fica logo atrás do hélice. Uma <b>rabanada</b> curta de máquina adiante com o leme todo carregado joga o jato contra o leme e gira a popa, <b>sem o barco ganhar velocidade</b>. É a ferramenta mais útil para girar o barco em espaço pequeno. Repita em pequenas rajadas e o barco gira quase no lugar.` },
        { t: 'callout', tipo: 'dica', titulo: 'Passo e descarga trabalham juntos', html: `Para girar para boreste com hélice de passo à direita: leme todo a boreste, rabanada adiante (a descarga empurra a popa para bombordo, a proa vai para boreste); depois uma rabanada atrás (o efeito de passo também leva a popa para bombordo). Para bombordo o efeito de passo trabalha contra você e o giro fica maior.` },
        { t: 'h', txt: 'Governar a ré' },
        { t: 'lista', itens: [
          `<b>Aguarde o seguimento.</b> O leme só governa depois que o barco ganha movimento a ré; antes disso, domina o efeito de passo.`,
          `<b>A popa vai para o lado do leme:</b> leme a boreste, popa para boreste (andando a ré).`,
          `<b>Pivô.</b> Andando adiante, o barco gira em torno de um ponto a cerca de um terço do comprimento a partir da proa. A ré, o ponto vai para a popa e a proa fica solta ao vento. É por isso que o veleiro “foge” para sotavento na ré.`,
          `<b>Mão firme no leme.</b> A ré, a água empurra o leme com força até o batente.`,
          `<b>Pare o barco com a máquina atrás</b> antes do que você imagina. Um veleiro de 5 t a 3 nós ainda anda vários metros depois de dar atrás.`,
        ] },
        { t: 'h', txt: 'Quilha, hélice e vento' },
        { t: 'tabela', cab: ['Característica', 'Efeito na manobra'], linhas: [
          ['Quilha longa (corrida)', 'Pivota devagar, segura bem o rumo e é difícil de girar. A ré governa mal'],
          ['Quilha de aleta (fin keel) e leme suspenso', 'Gira mais fácil, mas perde o rumo mais rápido. Em ré, o leme é pequeno e menos eficaz'],
          ['Hélice dobrável (folding)', 'Reduz a resistência na vela, mas dá menos tração a ré: o barco para mais tarde'],
          ['Motor de eixo ou saildrive', 'Saildrive fica longe do leme: menos jato sobre o leme e menos efeito de rabanada'],
          ['Vento e mastro', 'O casco alto e o mastro funcionam como vela: em baixa velocidade, o vento leva a proa para sotavento'],
        ], legenda: 'Os efeitos mudam de barco para barco. Teste o seu: passe uma hora em água livre, num dia de pouco vento, e anote o que cada manobra faz.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Cabo no hélice', html: `Antes de engrenar, olhe a água em volta da popa: escota, espia, cabo de bote ou rede de pesca presos no hélice arruínam a manobra e a caixa de marcha. Cabo nunca se arrasta atrás do barco com o motor engrenado. Se acontecer, desligue e mergulhe com cuidado (ou chame socorro).` },
        { t: 'termos', ids: ["seguimento", "guinar", "governar", "leme", "quilha", "vento-aparente"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-016', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Num veleiro com hélice de passo à direita, você dá atrás com o leme a meio. Para onde tende a popa?',
            alternativas: ['Para bombordo, com força', 'Para boreste, com força', 'Para boreste, fracamente', 'Para lado nenhum'],
            correta: 0,
            explicacao: 'Dando atrás, o efeito de passo de um hélice de passo à direita leva a popa para bombordo. O efeito é forte porque o leme ainda não governa. Para boreste seria passo à esquerda; só dando adiante o efeito (fraco) vai para boreste. Dizer que não há efeito ignora o fenômeno.',
            referencia: 'Arte Naval, vol. 2; NORMAM-211, Anexo 5-A (ação do leme e do hélice)', fonte_url: ARTE },
          { id: 'vela-2-017', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Para que serve uma rabanada curta de máquina adiante com o leme todo carregado?',
            alternativas: ['Girar a popa com o jato do hélice sobre o leme, sem ganhar velocidade', 'Fazer o barco andar de lado como um caranguejo', 'Parar o barco em linha reta', 'Evitar o efeito de passo'],
            correta: 0,
            explicacao: 'O jato do hélice bate no leme carregado e empurra a popa para o lado, girando o barco quase no lugar. Não faz o barco andar de lado, não freia (isso é dar atrás) nem elimina o efeito de passo.',
            referencia: 'Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-018', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 3,
            enunciado: 'Por que o veleiro tende a “fugir” para sotavento quando anda a ré?',
            alternativas: ['O ponto de giro vai para a popa e a proa fica solta ao vento', 'O mastro empurra a popa contra o vento', 'O hélice gira ao contrário e puxa a proa', 'A quilha trabalha como um leme'],
            correta: 0,
            explicacao: 'Andando a ré, o pivô se desloca para a popa e a proa, com mais área exposta, é empurrada pelo vento para sotavento. O mastro não puxa a popa contra o vento, o hélice a ré não puxa a proa e a quilha não faz papel de leme.',
            referencia: 'Arte Naval, vol. 2; Rousmaniere, The Annapolis Book of Seamanship' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II (treinamento prático: ação do leme e do hélice)', url: NORMAM, ref: 'extra-arrais-1-03' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: manobra e efeitos do hélice e do leme', url: ARTE },
          { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): maneuvering under power' },
        ] },
      ],
    },
    {
      id: 'l2',
      titulo: 'Cabos, defensas e plano: preparar antes de chegar',
      minutos: 11,
      objetivos: [
        'Nomear os cabos de amarração e dizer o que cada um impede',
        'Preparar defensas e cabos antes de chegar ao cais',
        'Combinar funções e sinais com a tripulação',
      ],
      blocos: [
        { t: 'p', html: `Atracar com calma começa antes de chegar. Em muitas atracações com problema, o cabo não estava pronto, a defensa estava alta demais ou ninguém sabia o que fazer. Dedique 5 minutos, ainda longe do cais, a cinco coisas: <b>cabos, defensas, funções, vento e corrente, e uma saída de emergência</b>.` },
        { t: 'h', txt: 'Os cabos de amarração' },
        { t: 'p', html: `Quatro cabos mantêm um veleiro junto ao cais. Memorize o que cada um <b>impede</b>:` },
        { t: 'figura', svg: svg('0 0 400 250', 'Veleiro atracado por bombordo com quatro cabos numerados: lançantes de proa e de popa e espringues de proa e de popa',
            '<rect x="0" y="0" width="400" height="48" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
            t(200, 30, 'cais', 16, 'middle', 'var(--ink)', 'font-weight="700"') +
            '<path d="M60,112 L272,112 C314,114 340,126 350,137 C340,148 314,160 272,162 L60,162 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<g stroke="var(--magenta)" stroke-width="2.6"><line x1="340" y1="124" x2="394" y2="48"/><line x1="308" y1="116" x2="222" y2="48"/><line x1="96" y1="116" x2="184" y2="48"/><line x1="62" y1="124" x2="8" y2="48"/></g>' +
            num(366, 82, '1') + num(260, 78, '2') + num(138, 78, '3') + num(34, 82, '4') +
            t(70, 192, 'popa', 15) + t(330, 192, 'proa', 15) + t(200, 142, 'atracado por bombordo', 15, 'middle') +
            t(200, 232, 'distância ao cais exagerada para ver os cabos', 14, 'middle')),
          legenda: `1 lançante de proa (sai da proa para vante) · 2 espringue de proa (sai da proa para ré) · 3 espringue de popa (sai da popa para vante) · 4 lançante de popa (sai da popa para ré).` },
        { t: 'tabela', cab: ['Cabo', 'Impede que o barco…', 'Uso extra'], linhas: [
          ['1 Lançante de proa', 'recue (vá para ré) e se afaste do cais', 'primeiro cabo quando a corrente ou o vento empurra o barco para ré'],
          ['2 Espringue de proa', 'avance (vá para vante)', 'pivô para sair com a popa para fora (máquina adiante contra ele)'],
          ['3 Espringue de popa', 'recue (vá para ré)', 'pivô para sair com a proa para fora (máquina atrás contra ele)'],
          ['4 Lançante de popa', 'avance (vá para vante) e se afaste do cais', 'primeiro cabo quando o vento empurra o barco para vante'],
        ], legenda: 'Outros nomes: espia (qualquer cabo de amarração), través (cabo perpendicular ao cais). Veja o resumo no Arrais-Amador, módulo de manobras.' },
        { t: 'callout', tipo: 'dica', titulo: 'Um só macete para lembrar', html: `O cabo que sai de uma extremidade e vai na direção <b>oposta</b> trabalha contra o movimento nesse sentido. O espringue de proa (sai da proa e vai para ré) segura o barco que quer ir para frente; o espringue de popa (sai da popa e vai para frente) segura o que quer ir para trás.` },
        { t: 'h', txt: 'Defensas: altura e quantidade' },
        { t: 'lista', itens: [
          `Pelo menos <b>3 por bordo</b> num veleiro de 32 pés (por exemplo; barcos maiores precisam de mais defensas, e maiores), mais uma <b>defensa avulsa</b> (de “ronda”) para o auxiliar usar onde houver contato.`,
          `Na altura do <b>ponto de contato real</b>: pendure-as na borda, ao nível do cais ou do pontão. Em pontão flutuante a altura é quase constante; em cais fixo, ela muda com a maré.`,
          `Amarre com <b>volta do fiel</b> (nó que se solta fácil), na borda do barco, nunca nos guarda-mancebos de fio. Veja os nós de defensa no módulo de marinharia.`,
          `Em pontão novo, de concreto ou com ferragens, forre a defensa com saco de pano.`,
        ] },
        { t: 'h', txt: 'Cabos prontos' },
        { t: 'lista', itens: [
          `Cabos <b>aduchados</b> e com o chicote do barco já firme em um cunho, passados por fora de guarda-mancebos e balaústres, para não enroscar na hora de levar ao cais.`,
          `Comprimento: o suficiente para o cunho do cais com folga para a maré. Nos litorais Norte e Nordeste, onde a maré sobe vários metros em alguns locais (por exemplo, no Maranhão e no Pará), os cabos precisam de folga ou de ajuste regular.`,
          `Cabos de nylon esticam e absorvem choques; cabo de poliéster tem menos elasticidade. Para amarração em maré ou ondas, use cabos de nylon, mais longos, com protetor de atrito.`,
        ] },
        { t: 'h', txt: 'Funções e sinais' },
        { t: 'p', html: `Combine antes: quem passa o primeiro cabo, quem fica com a defensa avulsa e quem cuida do leme. Use <b>sinais com a mão</b> (afastar, aproximar, parar) para quando o vento ou o motor cobrir a voz. Evite gritos desencontrados. O timoneiro dá a ordem de pular só com o barco parado e <b>ninguém salta com o barco em movimento</b>: desce-se do barco que já parou, num passo.` },
        { t: 'callout', tipo: 'seguranca', titulo: 'Mãos e pés para dentro', html: `Nunca use mão, pé ou perna para segurar o barco contra o cais ou contra outro barco. Algumas toneladas esmagam ossos. Se o choque é inevitável, use uma defensa avulsa e deixe o casco levar a pancada.` },
        { t: 'h', txt: 'Plano em 60 segundos' },
        { t: 'lista', ordenada: true, itens: [
          `Olhe a <b>bandeira</b> e os barcos amarrados: de onde vem o vento? A água corre nos pilares? Quem manda: o vento ou a corrente?`,
          `Escolha o <b>bordo</b> de atracação (passo à direita: bombordo é mais fácil, porque dando atrás a popa vai para o cais).`,
          `Planeje a <b>saída de emergência</b>: se a aproximação der errado, para onde você escapa? Mantenha espaço para arredondar e tentar de novo, sem pressa.`,
          `Peça à tripulação para repetir a função de cada um.`,
        ] },
        { t: 'termos', ids: ["espringue", "lancante", "espia", "defensa", "cunho", "croque", "amarrar", "atracar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-019', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 1,
            enunciado: 'Que cabo sai da proa e vai para ré, até o cais?',
            alternativas: ['Espringue de proa', 'Lançante de proa', 'Espringue de popa', 'Lançante de popa'],
            correta: 0,
            explicacao: 'O espringue de proa sai da proa e trabalha para ré. O lançante de proa sai da proa para vante; o espringue de popa sai da popa para vante; o lançante de popa sai da popa para ré.',
            referencia: 'Arte Naval, vol. 2 (amarração)', fonte_url: ARTE },
          { id: 'vela-2-020', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'O que o espringue de proa impede?',
            alternativas: ['Que o barco avance (vá para vante)', 'Que o barco recue (vá para ré)', 'Que a proa se afaste do cais', 'Que o barco vire de lado'],
            correta: 0,
            explicacao: 'Saindo da proa e indo para ré, o cabo fica esticado se o barco tentar avançar. Quem impede o recuo é o espringue de popa. O lançante é que impede o afastamento da proa; o espringue não impede o barco de girar.',
            referencia: 'Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-021', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 1,
            enunciado: 'Em que posição ficam as defensas ao se aproximar do cais?',
            alternativas: ['Na altura do ponto de contato com o cais ou pontão', 'Todas na proa, onde o barco bate primeiro', 'Dentro do barco, para não molharem', 'Sempre bem baixas, perto da água'],
            correta: 0,
            explicacao: 'A defensa só protege se estiver na altura em que o casco vai tocar o cais ou o pontão, que depende da maré e do tipo de píer. Todas na proa deixam o resto desprotegido; guardadas ou baixas demais não trabalham.',
            referencia: 'Arte Naval, vol. 2; Rousmaniere, The Annapolis Book of Seamanship' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: amarração', url: ARTE },
          { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): docking and mooring lines' },
          { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, item 2.5: atracação e desatracação', url: NORMAM, ref: 'extra-arrais-1-03' },
        ] },
      ],
    },
    {
      id: 'l3',
      titulo: 'Atracar de lado e de popa',
      minutos: 14,
      objetivos: [
        'Atracar de lado com vento a favor, contra e de través',
        'Usar o espringue de proa para trazer a popa ao cais',
        'Atracar de popa com âncora ou cabo de proa (vaga “de ré”)',
      ],
      blocos: [
        { t: 'p', html: `Existem dois jeitos principais de ficar atracado: <b>de lado</b> (o costado ao longo do cais ou do pontão) e <b>de popa</b> (a popa no cais, a proa presa à âncora ou a um cabo). O primeiro é o comum em marinas brasileiras de píer reto e nos iates clubes. O segundo é comum em enseadas movimentadas e é muito usado no Mediterrâneo, e aparece em alguns fundeadouros e clubes brasileiros.` },
        { t: 'h', txt: 'Atracar de lado' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Aproxime contra o que domina</b>: vento ou corrente. Assim o barco governa e para com facilidade.`,
          `<b>Ângulo de uns 20° a 30°</b> com o cais, mirando o ponto onde a meia-nau vai ficar. Devagar: velocidade que você aceitaria bater.`,
          `A uns dois comprimentos do cais, <b>tire a máquina</b> e deixe o barco deslizar. Um veleiro pesado anda bastante.`,
          `Perto do cais, <b>leme para fora</b> e uma rabanada <b>atrás</b>: o barco para, a proa abre e a popa encosta (por bombordo com passo à direita).`,
          `Passe <b>primeiro o cabo que segura contra o que empurra</b>: se o vento empurra o barco para ré, o espringue de popa ou o lançante de proa; se empurra para vante, o espringue de proa ou o lançante de popa.`,
          `Se a popa ficou afastada, use o espringue de proa: máquina adiante devagar com o leme voltado para fora do cais; a popa vem para o cais.`,
          `Passe os demais cabos, ajuste as defensas e só então desligue o motor.`,
        ] },
        { t: 'callout', tipo: 'nota', titulo: 'O que quer dizer “leme para fora do cais”', html: `Neste curso, “leme para um lado” significa o lado para onde você quer que a <b>proa</b> vá andando adiante. “Leme para fora do cais”: a proa tende a se afastar do cais e, por consequência, a popa vem para o cais. Andando a ré, vale o oposto: a popa vai para o lado do leme.` },
        { t: 'tabela', cab: ['Situação', 'Como proceder'], linhas: [
          ['Vento soprando <b>do cais</b> para fora', 'Aproxime em ângulo mais aberto (cerca de 45°) e passe o cabo de proa ou o espringue de proa assim que possível; use a máquina adiante contra ele e leme para fora'],
          ['Vento soprando <b>para o cais</b>', 'Pare paralelo ao cais, a uma ou duas bocas de distância, e deixe o vento encostar o barco devagar; defensas prontas, sem acelerar'],
          ['Vento <b>de proa</b> ou corrente de proa', 'Situação mais fácil: o barco para sozinho; tenha cuidado com a ré'],
          ['Vento <b>de popa</b> ou corrente de popa', 'Mais difícil: o barco avança mesmo sem máquina. Passe o espringue de popa cedo, ou aproxime de outro jeito (rodar o barco e entrar de proa contra o vento)'],
        ], legenda: 'Em caso de dúvida, volte e tente de novo. Uma segunda aproximação com calma é sempre melhor que um choque.' },
        { t: 'callout', tipo: 'dica', titulo: 'A popa vem pelo espringue de proa', html: `Se o vento sopra do cais para fora e a popa não encosta, passe um espringue de proa (da proa para ré) e dê <b>adiante devagar com o leme voltado para fora do cais</b>: o barco pivota na proa e a popa vem para o cais. Quando estiver encostado, aperte o espringue e os lançantes.` },
        { t: 'h', txt: 'Atracar de popa (box, baia, vaga de ré)' },
        { t: 'p', html: `Na atracação de popa, o barco entra de ré numa vaga entre dois barcos ou pontões, com a popa no cais e a proa presa. Onde há <b>cabo de proa ou poita de proa</b> (um cabo que sobe do fundo, preso a um peso), o barco pega esse cabo e o prende no cunho de proa. Onde não há, deixa-se a <b>âncora</b> a algumas vezes o comprimento do barco do cais, o bastante para a popa chegar ao cais com o cabo ou a amarra ainda esticados.` },
        { t: 'figura', svg: svg('0 0 400 280', 'Atracação de popa: o veleiro entra de ré em linha reta numa vaga entre dois barcos, com a âncora largada de proa',
            seta('d1') +
            '<rect x="0" y="0" width="400" height="44" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' + t(200, 28, 'cais', 16, 'middle', 'var(--ink)', 'font-weight="700"') +
            casco(100, 126, 1.7, 180) + casco(300, 126, 1.7, 180) + casco(200, 188, 1.7, 180, 'var(--sea-2)') +
            '<line x1="200" y1="150" x2="200" y2="82" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#d1)"/>' +
            '<circle cx="200" cy="248" r="6" fill="var(--ink)"/>' +
            '<line x1="200" y1="244" x2="200" y2="224" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>' +
            t(214, 252, 'âncora', 15) + t(194, 108, 'ré,', 15, 'end', 'var(--magenta)') + t(194, 126, 'devagar', 15, 'end', 'var(--magenta)') +
            t(30, 190, 'vizinho', 15) + t(310, 190, 'vizinho', 15) +
            t(200, 272, 'Esquema: entre em linha reta, com a popa no centro da vaga', 14, 'middle')),
          legenda: `O barco entra de ré, em linha reta, no meio da vaga. A âncora (ou o cabo da poita) vai sendo largada ou recolhida pela proa para manter a proa alinhada. O efeito de passo leva a popa para bombordo ao dar atrás; compense começando um pouco para boreste.` },
        { t: 'lista', ordenada: true, itens: [
          `<b>Prepare defensas</b> nos dois bordos e <b>cabos de popa</b> prontos para os dois lados, mais um pessoal na popa com uma defensa avulsa. Se houver âncora, deixe-a pronta com o cabo livre.`,
          `<b>Aproxime em ângulo</b> e depois alinhe, para entrar de ré no meio da vaga. Comece levemente deslocado para o lado em que o efeito de passo <i>não</i> vai levar a popa.`,
          `Se for com âncora: largue-a a alguns comprimentos do cais e vá dando atrás, soltando o cabo aos poucos e mantendo-o esticado.`,
          `Em vento de través, deixe o barco um pouco <b>a barlavento</b> da vaga; o vento o levará para o lugar certo. Passe <b>primeiro o cabo do lado do vento</b>.`,
          `Quando a popa chegar ao cais, pare com uma rabanada adiante. Passe os cabos de popa e ajuste o cabo ou a âncora da proa até o barco ficar a uma distância segura do cais (a prancha de acesso deve alcançar sem tensionar).`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Âncora de proa e hélice', html: `Cabo de poita e de âncora em volta do hélice é um acidente comum nessa manobra. Na ré, mantenha os cabos esticados e fora da água perto da popa, e desengrene se o cabo se aproximar do hélice. Não tente soltá-lo com o motor ligado.` },
        { t: 'termos', ids: ["atracar", "desatracar", "espringue", "defensa", "poita", "amarrar", "aduchar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-022', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Com vento soprando do cais para fora, como trazer a popa ao cais depois de passar o espringue de proa?',
            alternativas: ['Dar adiante devagar com o leme voltado para fora do cais', 'Dar atrás com o leme voltado para o cais', 'Soltar o espringue e esperar o vento', 'Dar adiante com o leme voltado para o cais'],
            correta: 0,
            explicacao: 'Com o espringue de proa firme, a máquina adiante faz o barco pivotar na proa; o leme voltado para fora do cais joga a descarga para esse lado e empurra a popa para o cais. Dar atrás com o espringue de proa ou leme para o cais levaria a popa para fora. Esperar o vento afasta ainda mais o barco.',
            referencia: 'Rousmaniere, The Annapolis Book of Seamanship; Arte Naval, vol. 2' },
          { id: 'vela-2-023', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Em atracação de popa com vento de través, qual cabo se passa primeiro?',
            alternativas: ['O cabo do lado de onde vem o vento', 'O cabo do lado para onde vai o vento', 'Qualquer um, tanto faz', 'O cabo de proa, antes dos de popa'],
            correta: 0,
            explicacao: 'O cabo de barlavento segura o barco que o vento tenta empurrar para o vizinho de sotavento. O de sotavento não trabalha contra o vento e deixa o barco derivar. A ordem importa. O cabo de proa já está firme na âncora ou na poita.',
            referencia: 'Rousmaniere, The Annapolis Book of Seamanship' },
          { id: 'vela-2-024', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 3,
            enunciado: 'Qual é a velocidade correta na aproximação ao cais?',
            alternativas: ['Aquela com a qual você aceitaria bater', 'A mínima do motor engrenado, mesmo com vento forte', 'A máxima, para dar governo', 'Não há regra'],
            correta: 0,
            explicacao: 'A regra prática é manobrar tão devagar que um choque causaria só um arranhão. Mínima do motor engrenado pode ser velocidade demais em barco leve e pouca em barco pesado com vento. Máxima aumenta o risco, e dizer que não há regra ignora o princípio da prudência.',
            referencia: 'Arte Naval, vol. 2; NORMAM-211, Anexo 4-B (prudência na navegação)', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: atracação e desatracação', url: ARTE },
          { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): docking, springing alongside, med-mooring' },
          { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) II', url: NORMAM, ref: 'extra-arrais-1-01' },
        ] },
      ],
    },
    {
      id: 'l4',
      titulo: 'Amarrar em poita ou boia',
      minutos: 10,
      objetivos: [
        'Pegar uma poita ou boia de amarração com motor',
        'Prender o veleiro com dois cabos de proa e proteger contra atrito',
        'Soltar-se da poita sem enrolar cabo no hélice',
      ],
      blocos: [
        { t: 'p', html: `Em muitos clubes e enseadas brasileiros, o barco fica numa <b>poita</b> (boia de amarração presa a um peso no fundo). Em geral a poita tem uma <b>alça</b> (ou um cabo que sobe do peso até a boia), e o barco entra com a proa nela.` },
        { t: 'callout', tipo: 'nota', titulo: 'Poita de quem?', html: `Poitas e boias de amarração em clubes e marinas são de propriedade de alguém. Só use uma com a permissão do clube ou do dono, e pergunte o limite de peso e de comprimento de barco. Em fundeadouros livres, confira o estado antes de confiar em qualquer poita, e prefira a sua âncora se não souber a origem.` },
        { t: 'h', txt: 'Passo a passo com motor' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Leia vento e corrente.</b> Olhe para onde apontam os barcos já amarrados. Aproxime-se <b>contra</b> o que dominar, para o barco parar sem esforço.`,
          `<b>Prepare dois cabos de proa</b> com laço (alça) em uma ponta: um para cada bordo do convés, ambos passando por fora de tudo e firmes em cunhos separados. Alguém na proa com o croque.`,
          `<b>Aproxime devagar</b>, com a boia pela bochecha do lado do timoneiro. O proeiro aponta a boia o tempo todo com o braço esticado, porque a boia some sob a proa para quem governa.`,
          `Pare com a boia na proa. <b>Pegue com o croque</b> a alça e puxe-a para o convés. Passe o primeiro cabo pela alça da poita e traga a ponta de volta para o barco.`,
          `<b>Ponha o motor em neutro</b> enquanto houver cabo na água perto do hélice. Prenda o segundo cabo, formando uma “brida” de dois cabos.`,
          `Ajuste os cabos de modo que o barco fique com a boia bem na proa, e proteja o atrito com um tubo de borracha ou um pano forrado, onde o cabo passa pela buzina e pelo rolete.`,
        ] },
        { t: 'figura', svg: svg('0 0 400 280', 'Aproximação a uma poita: o veleiro vai contra o vento ou a corrente, com a boia pela bochecha do timoneiro, e prende dois cabos de proa na alça da poita',
            seta('b1') + seta('b2', 'var(--magenta)') +
            '<rect x="0" y="0" width="400" height="280" fill="var(--sea-1)"/>' +
            '<line x1="200" y1="14" x2="200" y2="56" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#b1)"/>' + t(212, 36, 'vento / corrente', 15) +
            '<path d="M290 228 C290 190 230 168 208 124" fill="none" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#b2)"/>' +
            casco(290, 228, 1.4, 0, 'var(--sea-2)') +
            '<circle cx="204" cy="100" r="13" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="2"/>' +
            t(224, 96, 'boia', 15) +
            '<line x1="204" y1="113" x2="204" y2="150" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 3"/>' +
            casco(204, 190, 1.4, 0, 'var(--sea-1)') +
            '<line x1="197" y1="150" x2="204" y2="113" stroke="var(--magenta)" stroke-width="2.5"/><line x1="211" y1="150" x2="204" y2="113" stroke="var(--magenta)" stroke-width="2.5"/>' +
            t(100, 190, 'dois cabos', 15) + t(100, 208, 'em cunhos', 15) + t(100, 226, 'separados', 15) +
            t(200, 272, 'Esquema sem escala', 14, 'middle')),
          legenda: `A seta tracejada mostra a aproximação (barco de baixo, à direita); o barco do centro já está amarrado, com dois cabos da proa até a alça da poita. A boia é vista pela bochecha do timoneiro.` },
        { t: 'h', txt: 'Cuidados' },
        { t: 'lista', itens: [
          `<b>Dois cabos, não um.</b> Se um arrebentar por atrito, o outro segura. Passe-os por cunhos diferentes.`,
          `<b>Comprimento.</b> Largue folga suficiente para a maré e para o balanço, mas não tanto que o barco bata na boia ou nos vizinhos. Verifique de tempos em tempos.`,
          `<b>Atrito.</b> Cabo que esfrega em rolete ou buzina em ondas se corta em horas. Proteja com tubo de mangueira ou tecido e troque o protetor de tempos em tempos.`,
          `<b>Balanço.</b> Na poita o barco balança com as marolas e o vento. Amarre a retranca, os cabos soltos e o leme, para que não batam.`,
          `<b>Saída.</b> Antes de soltar, ligue o motor em neutro. Solte um cabo, depois o outro, e afaste-se com a proa contra o vento, sem passar sobre o cabo da poita. Só então engrene.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Quem fica na proa', html: `O proeiro trabalha com o croque e os cabos em cima de um convés que balança. Ele usa colete e se prende, se houver mar. Nunca ponha a mão entre o cabo e o cunho nem o pé sobre cabo sob tensão.` },
        { t: 'termos', ids: ["poita", "croque", "espia", "cunho", "amarrar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-025', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 1,
            enunciado: 'Em que direção se aproxima de uma poita?',
            alternativas: ['Contra o vento ou a corrente, o que dominar', 'A favor do vento, para chegar mais rápido', 'De través, sempre', 'De ré, com o croque na popa'],
            correta: 0,
            explicacao: 'Aproximando contra o que domina, o barco governa e para com pouca máquina. A favor do vento, o barco avança mesmo sem motor e é difícil parar. De través, o vento leva o barco de lado. De ré dificulta o proeiro de ver e de trabalhar.',
            referencia: 'Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-026', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Por que se usa mais de um cabo para prender o barco à poita?',
            alternativas: ['Se um arrebentar por atrito, o outro segura', 'Para o barco não girar nunca', 'Porque a lei exige dois cabos', 'Para pagar menos taxa ao clube'],
            correta: 0,
            explicacao: 'Dois cabos, em cunhos diferentes, dão redundância contra o atrito e contra a falha de um deles. O barco gira normalmente na poita conforme o vento. O curso não conhece norma que imponha dois cabos: é boa prática de segurança, sem relação com taxas do clube.',
            referencia: 'Rousmaniere, The Annapolis Book of Seamanship' },
          { id: 'vela-2-027', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Por que o motor fica em neutro enquanto há cabos da poita na água perto da popa?',
            alternativas: ['Para evitar enrolar o cabo no hélice', 'Para economizar combustível', 'Para a poita não se mexer', 'Para não gastar a bateria'],
            correta: 0,
            explicacao: 'Cabo no hélice trava o eixo e pode danificar a caixa de marcha. Economia de combustível e bateria são efeitos secundários, e a poita não se mexe com o motor do barco.',
            referencia: 'Arte Naval, vol. 2; boa prática marinheira (cabo no hélice)', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: manobra de pegar boia', url: ARTE },
          { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): mooring' },
          { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) II: pegar a boia', url: NORMAM, ref: 'extra-arrais-1-01' },
        ] },
      ],
    },
    {
      id: 'l5',
      titulo: 'Sair de vaga apertada e dicas para marinas e clubes',
      minutos: 12,
      objetivos: [
        'Planejar a saída de uma vaga apertada com vento lateral',
        'Usar espringues e defensas para pivotar o barco',
        'Aplicar boas práticas de marinas e iates clubes brasileiros',
      ],
      blocos: [
        { t: 'p', html: `Sair é, muitas vezes, mais difícil que chegar: o barco está parado, o vento sopra de lado e o espaço é pouco. A solução é um <b>plano</b> que faz o vento trabalhar a seu favor, mais <b>espringues</b> para pivotar e <b>movimentos curtos</b> de máquina.` },
        { t: 'h', txt: 'Antes de soltar' },
        { t: 'lista', itens: [
          `Verifique a <b>água em volta</b> do hélice e a ausência de cabos soltos.`,
          `Defina a direção do <b>vento</b> e como ele afetará a proa e a popa assim que o barco ficar solto.`,
          `Escolha <b>quais cabos serão os últimos</b>: os que servirão de pivô (espringues) ou de segurança.`,
          `Defensas nos dois bordos e uma defensa avulsa com o auxiliar.`,
          `Combinem os sinais e a ordem de soltura. O timoneiro só dá a ordem quando a máquina estiver quente e em neutro.`,
        ] },
        { t: 'h', txt: 'Técnicas por situação' },
        { t: 'tabela', cab: ['Situação', 'Técnica'], linhas: [
          ['Atracado de lado, vento <b>do cais</b> para fora', 'O vento ajuda a afastar: solte, deixe o barco abrir um pouco e saia adiante ou a ré, conforme o espaço. Cuidado: o vento pode levar a proa para cima do vizinho de sotavento'],
          ['Atracado de lado, vento <b>para o cais</b>', 'Use o espringue de proa: solte os demais, defensa na proa, <b>adiante devagar com o leme voltado para o cais</b>; a popa abre. Quando a popa estiver livre, solte o espringue e vá para ré'],
          ['Vaga de proa (box), vento de través', 'Saia de ré em linha reta, com uma pessoa nos cabos de proa soltando-os aos poucos conforme o barco recua. Só gire quando a popa já estiver fora do box, e use ordens curtas de ré e adiante'],
          ['Vaga de popa (âncora ou cabo de proa)', 'Recolha o cabo ou a âncora com a ajuda do motor adiante devagar, sem pôr peso no cabo; antes de largar a popa, tenha a proa livre e o hélice sem cabos'],
          ['Sem espaço atrás', 'Gire o barco no lugar com rabanadas (passe pelo neutro entre elas), saia de proa'],
        ], legenda: 'Em todos os casos: devagar, com defensas posicionadas e um tripulante preparado para empurrar a borda com uma defensa avulsa, nunca com a mão.' },
        { t: 'callout', tipo: 'dica', titulo: 'Passe pelo neutro', html: `Ao alternar adiante e atrás, pare um segundo no neutro. Poupa a caixa de marcha e dá tempo de o hélice responder. Dê rabanadas, não aceleradas longas.` },
        { t: 'h', txt: 'Dicas para marinas e iates clubes brasileiros' },
        { t: 'lista', itens: [
          `<b>Ligue antes.</b> Em muitas marinas e iates clubes, a vaga é designada. Peça o número da vaga, o bordo e as informações de cais, e se há prancha, água e energia.`,
          `<b>Regulamento local.</b> Cada clube e marina tem regras de velocidade, de ruído e de horários. Leia as normas locais e pergunte na secretaria.`,
          `<b>Marolas.</b> Reduza a velocidade em canais de acesso e junto aos barcos. Marola de um barco que passa sacode os vizinhos e quebra cabos.`,
          `<b>Correnteza e maré.</b> Em rios e estuários com maré (Capibaribe, Paraíba, rios do Pará e do Maranhão, Amazonas), a correnteza muda de sentido com a maré e por vezes domina o vento. No Norte e Nordeste, a maré grande exige chegar com a maré certa.`,
          `<b>Vento de verão e brisas.</b> No litoral brasileiro, a brisa marítima costuma aumentar a tarde. Prefira manobrar cedo, antes do vento, quando for possível.`,
          `<b>Respeite áreas de segurança e canais de acesso</b> (veja a norma abaixo e o módulo de fundear).`,
          `<b>Pergunte.</b> O contramestre ou o marinheiro do clube conhece os ventos e as correntes do local. Ele é um instrutor gratuito.`,
        ] },
        { t: 'fato', ref: 'extra-mestre-2-02', html: `Pela NORMAM-211, são áreas de segurança, entre outras, os fundeadouros de navios mercantes, os canais de acesso aos portos e as proximidades das instalações do porto; nelas não é permitido o tráfego nem o fundeio. O tráfego de esporte e recreio por canais de acesso para chegar a marinas e clubes é regulado nas NPCP/NPCF de cada Capitania.` },
        { t: 'fato', ref: 'extra-arrais-1-13', html: `A lista de verificação do Anexo 5-F da NORMAM-211 recomenda velocidade compatível, sem manobras radicais e reduzindo em águas restritas, além de evitar bebida alcoólica.` },
        { t: 'figura', svg: svg('0 0 420 250', 'Sair com a popa para fora usando o espringue de proa: o barco pivota na proa, contra uma defensa, com máquina adiante devagar e leme voltado para o cais',
            seta('o1', 'var(--magenta)') +
            '<rect x="0" y="0" width="420" height="250" fill="var(--sea-1)"/>' +
            '<rect x="0" y="0" width="420" height="44" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' + t(210, 30, 'cais', 16, 'middle', 'var(--ink)', 'font-weight="700"') +
            '<g transform="translate(350 82)"><path d="M0,0 C-14,-9 -60,-13 -170,-13 L-170,13 C-60,13 -14,9 0,0 Z" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 4" transform="rotate(-18)"/>' +
            '<path d="M0,0 C-14,-9 -60,-13 -170,-13 L-170,13 C-60,13 -14,9 0,0 Z" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2.4"/></g>' +
            '<line x1="344" y1="78" x2="256" y2="44" stroke="var(--magenta)" stroke-width="3"/>' +
            '<rect x="338" y="84" width="14" height="14" rx="6" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.5"/>' +
            '<path d="M160 100 C150 128 150 150 160 170" fill="none" stroke="var(--magenta)" stroke-width="3.5" marker-end="url(#o1)"/>' +
            t(236, 64, 'espringue de proa', 15, 'end', 'var(--magenta)') +
            t(356, 122, 'defensa na proa', 14, 'middle') +
            t(130, 190, 'a popa se abre', 15, 'end', 'var(--magenta)') +
            t(210, 214, 'máquina adiante devagar, leme voltado para o cais', 14, 'middle') +
            t(210, 236, 'Esquema sem escala; tracejado: depois de pivotar', 14, 'middle')),
          legenda: `Atracado de lado, com vento para o cais: deixe só o espringue de proa, ponha uma defensa na proa, dê adiante devagar com o leme voltado para o cais. O barco pivota na proa e a popa se abre. Quando a popa estiver livre, solte o espringue e vá para ré.` },
        { t: 'termos', ids: ["desatracar", "espringue", "defensa", "mare", "corrente", "npcp"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-028', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Atracado de lado com vento soprando para o cais, qual é a técnica para sair com a popa para fora?',
            alternativas: ['Espringue de proa firme, defensa na proa, adiante devagar com leme voltado para o cais', 'Soltar tudo e dar atrás com o leme todo a meio', 'Deixar o espringue de popa e dar adiante', 'Esperar o vento diminuir'],
            correta: 0,
            explicacao: 'O espringue de proa segura a proa; a máquina adiante com leme para o cais joga a descarga contra o leme e abre a popa contra o vento. Soltar tudo e dar atrás deixa o vento e o efeito de passo levarem o barco ao cais. O espringue de popa trabalha para ré. Esperar pode ser longo.',
            referencia: 'Rousmaniere, The Annapolis Book of Seamanship; Arte Naval, vol. 2' },
          { id: 'vela-2-029', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 1,
            enunciado: 'Por que passar pelo neutro entre adiante e atrás?',
            alternativas: ['Poupa a caixa de marcha e dá tempo de o hélice responder', 'Porque o motor liga mais rápido', 'Para o leme voltar ao centro', 'Para reduzir a velocidade do vento'],
            correta: 0,
            explicacao: 'Trocar de marcha sem pausa estressa a caixa e o eixo. A pausa no neutro permite que o barco e o hélice se acomodem. Não afeta o leme nem o vento.',
            referencia: 'Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-030', nivel: 'vela', tema: 'Motor e manobras no porto', dificuldade: 2,
            enunciado: 'Em rios e estuários do Norte e Nordeste, qual fator pode dominar o vento na manobra?',
            alternativas: ['A correnteza, que muda com a maré', 'O efeito de passo', 'A luz do dia', 'A pressão atmosférica'],
            correta: 0,
            explicacao: 'Em rios e estuários, a corrente muda de sentido com a maré e pode ser mais forte que o vento sobre o casco submerso. Efeito de passo existe em toda manobra, mas não é o que domina a deriva. Luz e pressão não movem o barco.',
            referencia: 'Miguens, Navegação, vol. I (marés e correntes de maré)' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 5-F (lista de verificação: velocidade e águas restritas)', url: NORMAM, ref: 'extra-arrais-1-13' },
          { txt: 'NORMAM-211/DPC, art. 1.9 (áreas de segurança) e NPCP/NPCF da sua Capitania', url: NORMAM, ref: 'extra-mestre-2-02' },
          { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): leaving the dock', },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: manobras de desatracação', url: ARTE },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm8',
  titulo: 'Fundear',
  resumo: `Fundear bem é a diferença entre dormir em paz e acordar com o barco na pedra. Você vai aprender a escolher o fundeadouro (abrigo, fundo, profundidade e espaço de giro), a conhecer âncoras, corrente e cabo, a calcular o filame (escopo) de 3:1 a 7:1 e entender por quê, a fundear e suspender passo a passo, a perceber se o barco garrou e como fundear com duas âncoras ou com âncora de popa.`,
  licoes: [
    {
      id: 'l1',
      titulo: 'Escolher o fundeadouro: abrigo, fundo, profundidade e espaço de giro',
      minutos: 11,
      objetivos: [
        'Avaliar abrigo, fundo, profundidade e espaço de giro de um fundeadouro',
        'Reconhecer onde não se pode fundear (áreas de segurança, canais)',
        'Considerar a previsão do tempo e a maré antes de decidir',
      ],
      blocos: [
        { t: 'p', html: `Quase todos os problemas de fundeio nascem de uma escolha ruim do lugar, não da âncora. Em tempo bom, muita coisa segura o barco; é na noite em que o vento vira, a maré enche e o vizinho garra que o lugar escolhido aparece. Por isso, a primeira etapa é <b>decidir onde</b>, com a carta, a previsão e os olhos.` },
        { t: 'h', txt: 'Os quatro fatores' },
        { t: 'lista', itens: [
          `<b>Abrigo.</b> Do vento <i>e</i> das ondas previstos para a noite toda, não só os de agora. Vento terral e brisa marítima se revezam durante o dia; frentes frias no Sul e no Sudeste fazem o vento girar para sudoeste e aumentar. Escolha um local que proteja do quadrante de onde virá o pior.`,
          `<b>Fundo.</b> Areia firme e lama seguram bem. Pedras prendem a âncora (e a amarra). Coral e pradarias de capim marinho seguram mal e são destruídos pela âncora e pela amarra. A carta indica o tipo de fundo com abreviaturas (S de areia, M de lama, R de pedra etc.); na dúvida, olhe a cor da água e use a sonda.`,
          `<b>Profundidade.</b> Num barco de 32 pés, por exemplo, em geral entre 3 e 10 m (barcos de maior calado pedem mais): raso demais, o barco toca o fundo na baixa-mar; fundo demais, é preciso muito cabo. Considere a <b>maré</b>: a profundidade na preamar pode ser vários metros maior que na baixa-mar.`,
          `<b>Espaço de giro.</b> O barco gira em torno da âncora conforme o vento e a corrente mudam. O raio do círculo é aproximadamente o filame mais o comprimento do barco. Fique longe de pedras, de baixios, do canal de navegação e dos outros barcos.`,
        ] },
        { t: 'figura', svg: svg('0 0 400 300', 'Círculo de giro de um barco fundeado: o raio é cerca de filame mais comprimento do barco; os vizinhos ficam fora do círculo',
            seta('c1') +
            '<rect x="0" y="0" width="400" height="300" fill="var(--sea-1)"/>' +
            '<circle cx="190" cy="150" r="96" fill="none" stroke="var(--magenta)" stroke-width="2.5" stroke-dasharray="8 6"/>' +
            '<circle cx="190" cy="150" r="5" fill="var(--ink)"/>' + t(198, 142, 'âncora', 15) +
            casco(190, 226, 0.7, 0, 'var(--sea-2)') + t(126, 232, 'seu barco', 15, 'end') +
            '<line x1="190" y1="150" x2="190" y2="205" stroke="var(--ink)" stroke-width="2"/>' +
            casco(342, 106, 0.7, 20) + t(310, 146, 'vizinho', 15) +
            casco(46, 232, 0.7, 330) + t(40, 266, 'vizinho', 15) +
            '<path d="M292 214 C316 232 346 236 368 224 L376 270 L284 270 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
            t(326, 262, 'pedras', 15, 'middle') +
            '<line x1="26" y1="28" x2="26" y2="78" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#c1)"/>' + t(36, 52, 'vento', 15) +
            t(190, 290, 'Esquema sem escala', 14, 'middle')),
          legenda: `O círculo tracejado é a área que o barco pode varrer ao girar em torno da âncora (com o vento de cima, o barco fica a sotavento da âncora, de proa para ela). Nada deve estar dentro dele: nem outro barco, nem pedra, nem canal. Se a corrente ou o vento mudarem, o barco acompanha.` },
        { t: 'h', txt: 'Onde não se pode fundear' },
        { t: 'fato', ref: 'extra-mestre-2-02', html: `Pela NORMAM-211, são áreas de segurança, entre outras, os fundeadouros de navios mercantes, os canais de acesso aos portos, as proximidades das instalações do porto, a faixa de 500 m em torno de unidades estacionárias de produção de petróleo e áreas especiais divulgadas em Avisos aos Navegantes. Nelas não é permitido o tráfego nem o fundeio.` },
        { t: 'lista', itens: [
          `<b>Canais de navegação e acessos.</b> Mesmo fora da área de segurança formal, fundear no meio do canal atrapalha navios e é perigoso para o seu barco.`,
          `<b>Cabos submarinos, dutos e emissários.</b> A carta traz símbolos e avisos. Âncora sobre eles estraga a âncora e o cabo.`,
          `<b>Unidades de conservação</b> (parques, reservas, áreas de proteção). Muitas proíbem ou regulam fundeio; consulte o órgão gestor.`,
          `<b>Zonas de banhistas.</b> Veja as faixas de proteção de banhistas e as regras da sua Capitania (NPCP/NPCF).`,
        ] },
        { t: 'fato', ref: 'normas-21', html: `Embarcações a vela ou a remo só podem navegar a partir de 100 m da linha de base, e as a motor a partir de 200 m (proteção de banhistas).` },
        { t: 'h', txt: 'Antes de decidir: três consultas' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Carta e roteiro.</b> Profundidades, tipo de fundo, perigos, cabos e a nota sobre abrigo. Atenção à data de levantamento da carta e à escala.`,
          `<b>Maré do dia.</b> Calcule a altura na preamar e na baixa-mar, para saber a profundidade mínima e a máxima durante a noite (veja o módulo de marés do curso de Mestre-Amador).`,
          `<b>Previsão do tempo.</b> Vento e ondas em 24 horas e a hora das viradas.`,
        ] },
        { t: 'fato', ref: 'travessia-96', html: `O CHM emite aviso de mau tempo quando se prevê vento força 7 Beaufort ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos ou ressaca com ondas de 2,5 m ou mais na costa.` },
        { t: 'callout', tipo: 'seguranca', titulo: 'Plano B sempre', html: `Escolha o fundeadouro já sabendo para onde ir se o vento virar ou aumentar durante a noite. Fundear em um lugar sem saída fácil, em noite escura, com maré baixa e entrada estreita, é o tipo de decisão que aparece em relatórios de acidente.` },
        { t: 'termos', ids: ["fundear", "barlavento", "sotavento", "calado", "sondagem", "isobata", "mare"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-031', nivel: 'vela', tema: 'Fundear', dificuldade: 1,
            enunciado: 'Qual dos fundos abaixo é o melhor para a âncora segurar?',
            alternativas: ['Areia firme ou lama', 'Coral', 'Capim marinho', 'Pedra lisa'],
            correta: 0,
            explicacao: 'Areia firme e lama permitem que a âncora se enterre e segure. Coral e capim marinho seguram mal e são destruídos pela âncora. Pedra lisa não deixa a âncora unhar e ainda pode prendê-la.',
            referencia: 'Fonseca, Arte Naval, vol. 2 (fundeio); Miguens, vol. I (cartas: natureza do fundo)', fonte_url: ARTE },
          { id: 'vela-2-032', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'O que é o espaço de giro de um barco fundeado?',
            alternativas: ['Círculo de raio aproximado filame mais comprimento do barco, ao redor da âncora', 'Uma faixa de 100 m em volta da praia', 'A distância mínima entre dois fundeadouros, estabelecida pela Marinha', 'A área de segurança de 500 m de plataformas de petróleo'],
            correta: 0,
            explicacao: 'O barco gira em torno da âncora conforme o vento e a corrente. O raio é o filame mais o comprimento do barco, aproximadamente. As faixas de 100 m e 200 m protegem banhistas, e os 500 m de plataformas são áreas de segurança, mas nenhum desses é o espaço de giro.',
            referencia: 'Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-033', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Segundo a NORMAM-211, onde NÃO é permitido fundear?',
            alternativas: ['Em fundeadouros de navios mercantes e canais de acesso aos portos (áreas de segurança)', 'Em qualquer baía abrigada', 'Em frente a qualquer marina', 'Em lagoas de água doce'],
            correta: 0,
            explicacao: 'Fundeadouros de navios mercantes, canais de acesso e arredores das instalações portuárias são áreas de segurança, onde o tráfego e o fundeio são vedados. Baías abrigadas, frente a marinas e lagoas só têm restrições se houver regra específica local.',
            referencia: 'NORMAM-211/DPC, art. 1.9', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 1.9: áreas de segurança', url: NORMAM, ref: 'extra-mestre-2-02' },
          { txt: 'CHM, Serviço Meteorológico Marinho: avisos de mau tempo', url: 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante', ref: 'travessia-96' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: fundeio e escolha do fundeadouro', url: ARTE },
          { txt: 'DHN, Carta 12000 (INT 1): símbolos de natureza do fundo e áreas de fundeio' },
        ] },
      ],
    },
    {
      id: 'l2',
      titulo: 'Âncoras, corrente e cabo',
      minutos: 12,
      objetivos: [
        'Reconhecer os principais tipos de âncora e o fundo em que cada uma funciona melhor',
        'Comparar corrente (amarra) e cabo, e entender o conjunto misto',
        'Conferir o que a norma exige e o que a boa prática recomenda',
      ],
      blocos: [
        { t: 'p', html: `O conjunto que segura o barco chama-se <b>aparelho de fundear</b>: âncora, corrente (ou amarra), cabo, manilhas e o ponto de fixação no barco. A força que o segura vem tanto da âncora quanto do peso e da forma da corrente. Cada peça é tão forte quanto a mais fraca.` },
        { t: 'fato', ref: 'extra-vela-2-03', html: `Pela NORMAM-211, todas as embarcações, exceto as miúdas, devem ter âncora compatível com o tamanho da embarcação e com, no mínimo, vinte metros de cabo ou amarra.` },
        { t: 'callout', tipo: 'nota', titulo: 'Mínimo da norma não é o bastante', html: `Vinte metros de cabo ou amarra é um piso para fundear em águas rasas e abrigadas. Em profundidades de 5 a 10 m, com a regra de 5:1 ou 7:1, você precisa de 25 a 70 m. Muitos veleiros de cruzeiro levam de 50 a 100 m de rode, mais uma segunda âncora.` },
        { t: 'h', txt: 'Tipos de âncora (para veleiro de cruzeiro)' },
        { t: 'tabela', cab: ['Tipo', 'Como funciona', 'Fundo em que vai bem', 'Pontos fracos'], linhas: [
          ['Danforth / leve (patas)', 'Duas patas largas que se enterram; leve e fácil de guardar', 'Areia e lama', 'Pedra, cascalho, capim e coral. Pode girar mal quando o vento vira'],
          ['Arado (CQR, plow)', 'Parte do arado e se enterra', 'Areia, lama e cascalho, com desempenho moderado em tudo', 'Pode soltar quando o vento vira 180°'],
          ['Garra (Bruce, claw)', 'Garra que se firma rápido, quase sempre de primeira', 'Areia, cascalho', 'Dificuldade em capim e em fundo muito duro'],
          ['Delta e semelhantes', 'Variante do arado, com ponta pesada', 'Areia, lama, fundo duro', 'Pode ser pesada de guardar'],
          ['Nova geração (Rocna, Spade, Mantus, Manson etc.)', 'Ponta pesada, concha e barra de rolamento que a posicionam; cavam fundo sob carga', 'Muitos tipos de fundo, alguns até capim', 'Mais caras. Difíceis de guardar no rolete'],
          ['Almirantado / garra de pedra', 'Âncora antiga; fixa-se enganchando', 'Pedra e cascalho', 'Pesada, desajeitada; não funciona em areia mole'],
        ], legenda: 'Resumo comparativo; os fabricantes publicam tabelas de tamanho por comprimento e peso do barco. Escolha um tamanho acima do mínimo e compre âncora para o fundo mais comum onde você navega.' },
        { t: 'h', txt: 'Corrente (amarra) x cabo' },
        { t: 'figura', svg: svg('0 0 400 270', 'Aparelho de fundear: âncora, corrente, cabo, manilha e ponto de fixação no barco, com a corrente deitada no fundo',
            seta('c2') +
            '<rect x="0" y="70" width="400" height="170" fill="var(--sea-2)" opacity="0.55"/>' +
            '<line x1="0" y1="70" x2="400" y2="70" stroke="var(--sea-3)" stroke-width="2"/>' +
            '<path d="M0,236 Q120,226 200,236 T400,232 L400,270 L0,270 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
            '<path d="M300,56 L378,58 L374,76 Q344,86 308,78 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<path d="M296,64 Q250,150 200,222" fill="none" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="1 0"/>' +
            '<path d="M200,222 Q170,232 94,232" fill="none" stroke="var(--ink)" stroke-width="6" stroke-dasharray="2 5"/>' +
            '<path d="M84,214 L84,238 M72,234 Q84,246 96,234 M78,220 L90,220" fill="none" stroke="var(--ink)" stroke-width="3"/>' +
            t(116, 252, 'âncora', 15) + t(190, 214, 'corrente', 15, 'end') + t(294, 160, 'cabo', 15, 'end', 'var(--magenta)', 'font-weight="700"') +
            t(18, 34, 'vento', 15) + '<line x1="14" y1="40" x2="74" y2="40" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#c2)"/>' +
            t(364, 100, 'roldana na', 14, 'middle') + t(364, 114, 'proa', 14, 'middle')),
          legenda: `A corrente fica deitada no fundo e mantém a puxada da âncora quase horizontal; o cabo, mais leve, sobe até a proa. Uma boa combinação: corrente suficiente para o trecho junto à âncora e cabo no resto. Esquema sem escala.` },
        { t: 'tabela', cab: ['', 'Corrente (amarra)', 'Cabo (náilon)'], linhas: [
          ['Peso', 'Pesada. O peso ajuda a segurar a âncora e a absorver tranco; pesa na proa e exige molinete', 'Leve. Fácil de manusear; segura menos pelo peso'],
          ['Elasticidade', 'Nenhuma: precisa de um amortecedor (estropo) para aliviar trancos', 'Estica e absorve trancos'],
          ['Desgaste', 'Resiste à pedra e a corais', 'Desgasta no atrito com pedra e na buzina; corta'],
          ['Filame necessário', 'Menor (por ex. 5:1)', 'Maior (por ex. 7:1)'],
          ['Peso no barco', 'Alto, bem na proa', 'Baixo'],
        ], legenda: 'Rode misto: corrente junto à âncora e o restante em cabo trançado de náilon. Quanto de corrente levar depende do barco e do fundeadouro; os fabricantes de âncora publicam tabelas.' },
        { t: 'lista', itens: [
          `<b>Rode misto.</b> A corrente junto à âncora mantém a puxada horizontal e protege o cabo do atrito no fundo; o cabo, depois, dá elasticidade. Quanto mais corrente, mais seguro (e mais pesado).`,
          `<b>Manilhas e ligações.</b> Use manilhas do tamanho da corrente, com o pino <b>travado com arame de segurança</b>. Não use fecho de mosquetão.`,
          `<b>Marca na corrente.</b> Pinte ou prenda marcas a cada 5 ou 10 m para saber quanto saiu.`,
          `<b>Estropo ou amortecedor.</b> Um cabo curto de náilon preso à corrente com um gancho alivia os trancos e protege o molinete.`,
          `<b>Ponta no barco.</b> A ponta do rode deve ser presa ao casco por um cabo curto, que se corta se for preciso largar a âncora de emergência.`,
          `<b>Arinque (trip line).</b> Cabo preso à cruz da âncora, com boia na ponta. Serve para soltar a âncora quando ela prende em pedra ou casco soçobrado.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Mãos e pés longe do molinete', html: `Corrente em movimento arrasta dedos, mãos e pés. Mantenha-os fora do caminho, use luvas e desligue o molinete na bateria quando não estiver em uso. Nunca coloque a mão na corrente entre o escovém e o molinete.` },
        { t: 'termos', ids: ["ancora", "amarra", "arinque", "manilha", "molinete", "filame", "unhar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-034', nivel: 'vela', tema: 'Fundear', dificuldade: 1,
            enunciado: 'Qual é o requisito mínimo da NORMAM-211 para o rode (cabo ou amarra) das embarcações, exceto as miúdas?',
            alternativas: ['Âncora compatível e pelo menos 20 m de cabo ou amarra', 'Duas âncoras e 100 m de cabo', 'Âncora de qualquer peso e 5 m de cabo', 'Só âncora, sem exigência de cabo'],
            correta: 0,
            explicacao: 'A norma pede âncora compatível com o tamanho da embarcação e no mínimo 20 m de cabo ou amarra. Duas âncoras, 100 m e 5 m não constam; e sem cabo a âncora não serve. O mínimo é um piso, não um bom comprimento para uso real.',
            referencia: 'NORMAM-211/DPC, art. 4.18.4', fonte_url: NORMAM },
          { id: 'vela-2-035', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Por que a corrente junto à âncora ajuda a segurá-la?',
            alternativas: ['Deita-se no fundo e mantém a puxada quase horizontal', 'Porque é mais barata que cabo', 'Porque flutua e amortece o barco', 'Porque dispensa a âncora'],
            correta: 0,
            explicacao: 'O peso da corrente a faz deitar no fundo e manter o esforço horizontal sobre a âncora, o que a ajuda a se enterrar. Preço não é o motivo, corrente afunda (não flutua) e a âncora continua necessária.',
            referencia: 'Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-036', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Para que serve o arinque preso à cruz da âncora?',
            alternativas: ['Soltar a âncora quando ela prende em pedra ou casco soçobrado', 'Aumentar o filame', 'Impedir que a âncora se enterre', 'Substituir o molinete'],
            correta: 0,
            explicacao: 'Puxando o arinque, a âncora sai para trás, do mesmo modo que foi, e se desprende. Não aumenta o filame, não impede de enterrar e não substitui o molinete.',
            referencia: 'Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 4.18.4: âncora', url: NORMAM, ref: 'extra-vela-2-03' },
          { txt: 'Wikipedia, Anchor: tipos de âncora e fundos (referência geral)', url: 'https://en.wikipedia.org/wiki/Anchor' },
          { txt: 'NauticEd, Anchoring rode and scope', url: 'https://sailing-blog.nauticed.org/anchoring-rode-and-scope/' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: aparelho de fundear', url: ARTE },
        ] },
      ],
    },
    {
      id: 'l3',
      titulo: 'Filame (escopo): quanto largar, de 3:1 a 7:1',
      minutos: 12,
      objetivos: [
        'Calcular o filame a partir da profundidade, da altura da proa e da maré',
        'Explicar por que o filame precisa ser maior que a profundidade',
        'Escolher a razão de filame conforme o rode e o tempo',
      ],
      blocos: [
        { t: 'p', html: `<b>Filame</b> (em inglês, <i>scope</i>) é o comprimento de cabo ou corrente que você solta, entre a proa e a âncora. A <b>razão de filame</b> é esse comprimento dividido pela altura entre a roldana de proa e o fundo. Se o rode solto vale 28 m e a altura vale 7 m, a razão é de 4:1.` },
        { t: 'h', txt: 'Por que precisa ser tanto' },
        { t: 'p', html: `A âncora segura quando é puxada <b>na horizontal</b>, rente ao fundo. Se a puxada tem inclinação para cima, a âncora levanta e sai. O rode comprido deita parte da corrente no fundo (essa parte é uma “barriga”, a catenária), absorve os trancos das ondas e mantém a puxada plana. Com vento forte, a barriga se estica e o filame “some”: por isso se solta mais.` },
        { t: 'figura', svg: svg('0 0 400 290', 'Comparação entre filame curto (3:1), em que a puxada levanta a âncora, e filame longo (7:1), em que a corrente se deita no fundo e a puxada fica quase horizontal',
                        t(100, 24, 'Filame 3:1', 16, 'middle', 'var(--ink)', 'font-weight="700"') + t(300, 24, 'Filame 7:1', 16, 'middle', 'var(--ink)', 'font-weight="700"') +
            '<rect x="0" y="140" width="200" height="60" fill="var(--sea-2)" opacity="0.55"/><rect x="200" y="140" width="200" height="60" fill="var(--sea-2)" opacity="0.4"/>' +
            '<line x1="0" y1="140" x2="400" y2="140" stroke="var(--sea-3)" stroke-width="2"/>' +
            '<path d="M0,200 L400,200 L400,262 L0,262 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
            '<line x1="200" y1="34" x2="200" y2="280" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 4"/>' +
            '<path d="M160,122 L212,122 L204,140 L168,140 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2" transform="translate(-12 0)"/>' +
            '<path d="M346,122 L398,122 L390,140 L354,140 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2" transform="translate(-18 0)"/>' +
            '<line x1="166" y1="132" x2="22" y2="198" stroke="var(--magenta)" stroke-width="3"/>' +
            '<path d="M326,132 Q320,194 292,199 L222,199" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
            '<circle cx="20" cy="198" r="6" fill="var(--ink)"/><circle cx="220" cy="198" r="6" fill="var(--ink)"/>' +
            t(100, 60, 'a puxada tem', 14, 'middle') + t(100, 78, 'ângulo para cima:', 14, 'middle') + t(100, 96, 'a âncora levanta', 14, 'middle') +
            t(300, 60, 'a corrente deita no fundo:', 14, 'middle') + t(300, 78, 'a puxada fica plana e', 14, 'middle') + t(300, 96, 'a âncora enterra', 14, 'middle') +
            t(200, 282, 'Esquema: profundidade exagerada', 14, 'middle')),
          legenda: `Com o mesmo barco e a mesma profundidade, o filame de 3:1 puxa a âncora com ângulo para cima, enquanto o de 7:1 deita a corrente no fundo e mantém a puxada plana. Desenho esquemático, sem escala.` },
        { t: 'h', txt: 'Como medir: da roldana de proa ao fundo' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Profundidade na água</b> no ponto onde vai fundear (ecobatímetro corrigido do transdutor para a linha d’água).`,
          `<b>Mais a altura da maré</b> até a preamar prevista da noite, porque a água sobe e o filame “encurta”.`,
          `<b>Mais a altura da roldana de proa</b> acima da água, em geral 1 a 1,5 m num veleiro de 32 pés, por exemplo (meça no seu barco; nos maiores é mais alta).`,
        ] },
        { t: 'p', html: `<b>Exemplo.</b> Água com 4 m no ponto, maré subindo mais 2 m até a preamar e roldana a 1 m acima da água: 4 + 2 + 1 = <b>7 m</b>. Com rode de <b>corrente</b> a 5:1, solte 35 m. Com <b>corrente e cabo</b> a 7:1, solte 49 m.` },
        { t: 'h', txt: 'Faixas de uso (referências, não regras)' },
        { t: 'tabela', cab: ['Situação', 'Corrente', 'Corrente e cabo'], linhas: [
          ['Parada curta (almoço), tempo bom, com alguém a bordo', '3:1 a 4:1', 'a partir de 5:1'],
          ['Pernoite, vento moderado', '5:1', '7:1'],
          ['Vento forte previsto, fundo ruim ou ondas', '7:1 ou mais', '10:1 ou mais'],
        ], legenda: 'Combinam as orientações práticas de escolas de vela e a NORMAM-211 (5 a 7 vezes a profundidade para cabo). São mínimos para vento moderado; com mais vento, solte mais.' },
        { t: 'fato', ref: 'extra-vela-2-01', html: `Pelo Anexo 4-B da NORMAM-211 (Recomendações ao navegante), as embarcações devem fundear aproadas ao vento ou à corrente, com o motor em ponto morto; a âncora é lançada quando a embarcação perder o seguimento, com cabo de cerca de cinco a sete vezes a profundidade local.` },
        { t: 'p', html: `Repare que a norma fala em <b>cinco a sete vezes</b>. É a faixa central das orientações da prática marinheira. A razão <b>3:1</b> aparece em cursos como valor mínimo, para quem tem corrente pesada, bom fundo e fica a bordo, e para os que fundeiam em local apertado. Abaixo de 3:1 a âncora tende a ser levantada.` },
        { t: 'callout', tipo: 'dica', titulo: 'Rasos pedem mais; fundos pedem menos', html: `Uma razão fixa nem sempre acerta: em água muito rasa, 5:1 pode não bastar para a catenária se formar; em água muito funda, 5:1 pode ser mais do que o necessário. Uma fórmula alternativa, proposta pela NauticEd, é largar um valor fixo mais um múltiplo da altura: cerca de 15 m + 2× a altura para corrente, e 15 m + 4× para corrente e cabo. Com 7 m, dá 29 m e 43 m. Para a própria fonte, a fórmula e a razão são mínimos para vento moderado (cerca de 30 nós com corrente, 25 nós com rode misto): acima disso, solte mais.` },
        { t: 'h', txt: 'Contas rápidas' },
        { t: 'lista', itens: [
          `<b>Raio do giro</b> ≈ filame + comprimento do barco. Com 49 m de filame e barco de 10 m, uns 59 m.`,
          `<b>Quanto cabe no vento.</b> Filames de referência valem para vento moderado. Em rajadas de 30 nós ou mais, solte mais, se o espaço permitir.`,
          `<b>Maré grande.</b> Calcule com a preamar, não com a profundidade de agora. Em locais de grande maré, solte para a preamar e confira na baixa-mar se o barco não vai encostar no fundo.`,
        ] },
        { t: 'widget', w: 'manobras', opts: { manobra: 'fundear', seletor: false }, legenda: 'Fundear passo a passo, com a calculadora de filame: mude a profundidade, a maré e a relação filame/profundidade e veja quanto largar.' },
        { t: 'termos', ids: ["filame", "amarra", "ancora", "preamar", "unhar", "garrar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-037', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Água com 4 m de profundidade, maré subindo 2 m até a preamar e roldana de proa a 1 m da água. Com rode de corrente a 5:1, quanto filame largar?',
            alternativas: ['35 m', '20 m', '28 m', '70 m'],
            correta: 0,
            explicacao: 'Altura total = 4 + 2 + 1 = 7 m. Com 5:1, são 35 m. 20 m seria só 5 vezes a profundidade atual (4 m); 28 m seria 4:1 sobre 7 m; 70 m seria 10:1.',
            referencia: 'NauticEd, Anchoring rode and scope; NORMAM-211, Anexo 4-B', fonte_url: 'https://sailing-blog.nauticed.org/anchoring-rode-and-scope/' },
          { id: 'vela-2-038', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Por que o filame precisa ser bem maior que a profundidade?',
            alternativas: ['Para a puxada na âncora ficar quase horizontal', 'Para o barco girar menos', 'Para a âncora flutuar', 'Para economizar o molinete'],
            correta: 0,
            explicacao: 'A âncora segura quando é puxada na horizontal, e o rode comprido deita a corrente no fundo. O filame maior aumenta o giro, em vez de reduzi-lo. A âncora não flutua e o molinete nada tem a ver.',
            referencia: 'Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-039', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'A NORMAM-211 recomenda, ao fundear, usar uma extensão de cabo aproximadamente igual a:',
            alternativas: ['Cinco a sete vezes a profundidade local', 'Duas vezes a profundidade local', 'Vinte vezes o comprimento da embarcação', 'A profundidade local, sem acréscimo'],
            correta: 0,
            explicacao: 'O Anexo 4-B diz de cinco a sete vezes a profundidade local. Duas vezes e uma vez são curtos demais; vinte comprimentos de barco não aparecem na norma.',
            referencia: 'NORMAM-211/DPC, Anexo 4-B, item 6', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 4-B, item 6: procedimentos para fundear', url: NORMAM, ref: 'extra-vela-2-01' },
          { txt: 'NauticEd, Anchoring rode and scope: razões de filame e medida desde a roldana de proa', url: 'https://sailing-blog.nauticed.org/anchoring-rode-and-scope/' },
          { txt: 'Wheeler, M. Sailing ABC (Tradewinds Sailing): 4:1 para parada curta, 5:1 (corrente) e 7:1 para pernoite', url: 'https://tradewindssailing.com/wordpress/?p=978' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: filame', url: ARTE },
        ] },
      ],
    },
    {
      id: 'l4',
      titulo: 'Fundear e suspender a âncora, passo a passo',
      minutos: 13,
      objetivos: [
        'Executar a manobra de fundear a motor e a vela',
        'Cravar e testar a âncora',
        'Suspender a âncora com segurança e resolver uma âncora presa',
      ],
      blocos: [
        { t: 'fato', ref: 'extra-arrais-1-14', html: `O item 13 do Anexo 5-F manda fundear com baixa velocidade e comprimento de amarra adequado, considerando a amplitude da maré e as embarcações próximas, e, ao suspender, não movimentar os propulsores até todas as pessoas saírem da água e completarem o embarque.` },
        { t: 'h', txt: 'Antes: preparo' },
        { t: 'lista', itens: [
          `<b>Aparelho pronto</b>: âncora fora do rolete e solta de qualquer amarração que não seja a de segurança; corrente livre para correr; molinete ligado ou manivela à mão.`,
          `<b>Funções</b>: um no leme, outro na proa. Combinem sinais com a mão (para a frente, ré, parar, solte, segure), porque a voz some no vento.`,
          `<b>Sonda e ponto</b>: passe uma vez devagar sobre o ponto escolhido para conferir a profundidade e o espaço em volta. Marque o ponto no GPS.`,
          `<b>Vento e corrente</b>: veja para onde os barcos fundeados apontam; é a direção de aproximação.`,
        ] },
        { t: 'h', txt: 'Fundear a motor' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Aproxime-se devagar, aproado ao vento ou à corrente</b> (o que dominar), em direção ao ponto. Sem pressa.`,
          `Pare o barco no ponto. Passe o motor para o <b>ponto morto</b> e deixe o barco perder o seguimento (a norma pede lançar a âncora quando o barco perder o seguimento).`,
          `<b>Arrie a âncora</b> até tocar o fundo. Não a jogue: o cabo embola e a âncora cai de qualquer jeito.`,
          `<b>Deixe o barco cair para ré</b>, com o vento ou com a máquina atrás, bem devagar, soltando o rode aos poucos sobre o fundo. Pare de soltar quando tiver saído cerca de 3 vezes a altura.`,
          `<b>Crave a âncora:</b> com o rode esticado, dê atrás devagar, aumentando a potência aos poucos (marcha lenta atrás, depois meia potência) por cerca de um minuto. A proa se levanta e o barco para: a âncora unhou.`,
          `<b>Solte o restante</b> do filame calculado e dê volta firme no cunho ou prenda no estropo.`,
          `<b>Teste</b>: com a mão na corrente ou no cabo, sinta se há vibração ou trancos (sinal de que está garrando). Tome duas marcações e leia a profundidade.`,
          `<b>Desligue o motor</b>, ligue o alarme de fundeio do GPS e exiba os sinais (veja abaixo).`,
        ] },
        { t: 'fato', ref: 'extra-vela-2-02', html: `Pelo Anexo 4-B da NORMAM-211, o cabo de fundeio não deve ser amarrado próximo ao motor, porque o peso do motor pode somar-se à tração vertical do cabo e provocar emborcamento e afundamento da embarcação. Na prática, o risco é maior em barcos pequenos com motor de popa; num veleiro, prenda o rode no cunho da proa, longe do motor.` },
        { t: 'h', txt: 'Fundear a vela' },
        { t: 'p', html: `Fundear sem motor é manobra de fim de dia ou de emergência. Chegue aproado ao vento só com a vela grande folgada, ou só com uma vela de proa pequena, de modo a controlar a velocidade. Com o barco quase parado, arrie a vela, solte a âncora e deixe o barco cair para ré com o vento, largando o rode; só então arrie a vela restante. Com vento forte, prefira fundear a motor.` },
        { t: 'h', txt: 'Os sinais de barco fundeado' },
        { t: 'fato', ref: 'tecnico-64', html: `Regra 30(a)(i) do RIPEAM: embarcação fundeada exibe, a vante, uma luz circular branca (de dia, uma esfera).` },
        { t: 'fato', ref: 'tecnico-65', html: `Regra 30(b): embarcação fundeada com menos de 50 m pode exibir uma única luz circular branca.` },
        { t: 'p', html: `De dia, uma <b>esfera preta</b> a vante; à noite, uma <b>luz circular branca</b> a vante. Em um veleiro de cruzeiro, costuma ser uma luz branca de 360° no topo do mastro ou no estai de proa; muitos barcos têm um interruptor “luz de fundeio”. Acenda ao pôr do sol e apague ao nascer.` },
        { t: 'h', txt: 'Suspender (levantar a âncora)' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Garanta que ninguém está na água</b> (mergulhador, banhista, bote) e que o hélice está livre. A lista de verificação do Anexo 5-F da NORMAM-211 traz a instrução de não movimentar os propulsores até que todos tenham saído da água e embarcado.`,
          `<b>Ligue o motor</b> e deixe-o aquecer um pouco; vá para o ponto morto.`,
          `<b>Recolha o rode</b> com o molinete enquanto o barco avança devagar, na direção da âncora. O molinete recolhe o rode; o motor leva o barco até a âncora. Não use o molinete para arrastar o barco.`,
          `Quando a corrente ficar <b>a pique</b> (na vertical sobre a âncora), a âncora está pronta para sair. Deixe o barco avançar um pouco mais, devagar, para <b>arrancá-la</b> do fundo.`,
          `<b>Recolha e confira.</b> Veja se a âncora saiu limpa (sem alga, sem cabo preso). Se tiver lama, lave com um balde. Calce-a no rolete e prenda.`,
          `<b>Só então</b> engrene e saia, longe dos vizinhos.`,
        ] },
        { t: 'h', txt: 'Âncora presa' },
        { t: 'lista', itens: [
          `<b>Não force o molinete.</b> Prenda a corrente no cunho com um estropo e use o motor para puxar, em passos curtos e em direções diferentes.`,
          `<b>Puxe pelo lado contrário</b>: dê a volta e puxe na direção oposta à de entrada da âncora, para soltá-la pelo caminho inverso.`,
          `<b>Arinque.</b> Se houver, puxe-o.`,
          `<b>Mergulhador.</b> Em água clara e rasa, alguém experiente pode soltar a âncora.`,
          `<b>Último recurso:</b> larga-se o rode com uma boia na ponta e volta-se depois para recuperar; isso exige que o rode esteja preso ao barco por um cabo cortável.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Dedos, pés e corrente', html: `A corrente que sai bate no convés e no escovém com muita força. Mantenha pés e dedos fora do caminho e nunca dê volta de corrente na mão ou no pulso.` },
        { t: 'figura', svg: svg('0 0 420 240', 'Quatro passos de fundear: aproximar contra o vento, arriar a âncora, recuar largando o rode, cravar com a máquina atrás',
            '<rect x="0" y="0" width="420" height="240" fill="var(--sea-1)"/>' +
            '<rect x="0" y="94" width="420" height="86" fill="var(--sea-2)" opacity="0.55"/>' +
            '<line x1="0" y1="94" x2="420" y2="94" stroke="var(--sea-3)" stroke-width="2"/>' +
            '<rect x="0" y="180" width="420" height="60" fill="var(--land)" stroke="var(--ink)" stroke-width="1.2"/>' +
            '<g stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 4"><line x1="105" y1="10" x2="105" y2="236"/><line x1="210" y1="10" x2="210" y2="236"/><line x1="315" y1="10" x2="315" y2="236"/></g>' +
            '<path d="M26 78 L80 78 L74 94 L32 94 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
            '<path d="M131 78 L185 78 L179 94 L137 94 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
            '<path d="M246 78 L300 78 L294 94 L252 94 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
            '<path d="M354 78 L408 78 L402 94 L360 94 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
            
            '<line x1="134" y1="90" x2="134" y2="172" stroke="var(--magenta)" stroke-width="3"/><circle cx="134" cy="176" r="5" fill="var(--ink)"/>' +
            '<path d="M252 92 Q246 150 224 174" fill="none" stroke="var(--magenta)" stroke-width="3"/><circle cx="222" cy="176" r="5" fill="var(--ink)"/>' +
            '<path d="M362 92 Q356 160 338 176 L328 176" fill="none" stroke="var(--magenta)" stroke-width="3"/><circle cx="326" cy="176" r="5" fill="var(--ink)"/>' +
            t(52, 24, '1 aproximar', 15, 'middle') + t(52, 44, 'contra o vento', 15, 'middle') +
            t(157, 24, '2 arriar', 15, 'middle') + t(157, 44, 'até o fundo', 15, 'middle') +
            t(262, 24, '3 recuar e', 15, 'middle') + t(262, 44, 'largar o rode', 15, 'middle') +
            t(367, 24, '4 cravar e', 15, 'middle') + t(367, 44, 'conferir', 15, 'middle') +
            t(52, 66, 'vento →', 14, 'middle') +
            t(12, 216, 'Sem escala', 15, 'start')),
          legenda: `1 aproxime-se devagar, aproado ao vento ou à corrente · 2 arrie a âncora até o fundo · 3 deixe o barco recuar largando o rode aos poucos · 4 com o filame solto, dê atrás devagar para cravar e confira as marcações.` },
        { t: 'termos', ids: ["fundear", "suspender", "unhar", "garrar", "luz-de-fundeio", "arinque", "molinete"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-040', nivel: 'vela', tema: 'Fundear', dificuldade: 1,
            enunciado: 'Em que direção se aproxima do ponto de fundeio?',
            alternativas: ['Aproado ao vento ou à corrente, o que dominar', 'De través ao vento', 'Com o vento pela popa', 'Em qualquer direção, desde que devagar'],
            correta: 0,
            explicacao: 'Aproado ao que domina, o barco governa e para com facilidade; o rode corre para o lado certo. De través o barco cai de lado; com vento pela popa avança sem controle.',
            referencia: 'NORMAM-211/DPC, Anexo 4-B, item 6', fonte_url: NORMAM },
          { id: 'vela-2-041', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Quando a corrente fica na vertical sobre a âncora, ela está:',
            alternativas: ['A pique', 'Garrando', 'Unhada', 'Presa'],
            correta: 0,
            explicacao: 'A âncora está a pique quando o rode fica na vertical sobre ela. Garrar é arrastar pelo fundo; unhar é enterrar-se; presa é quando não solta.',
            referencia: 'Glossário náutico; Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-042', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Qual é o sinal de uma embarcação fundeada, de noite, com menos de 50 m?',
            alternativas: ['Uma luz circular branca a vante', 'Duas luzes circulares encarnadas', 'Uma luz amarela intermitente', 'Nenhum sinal, se o fundeadouro for conhecido'],
            correta: 0,
            explicacao: 'A Regra 30 pede uma luz circular branca a vante; abaixo de 50 m basta uma só. Duas encarnadas são embarcação sem governo. Luz amarela intermitente não é sinal de fundeio. Não há dispensa por conhecimento do local.',
            referencia: 'RIPEAM-72, Regra 30', fonte_url: COLREG },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, Anexo 4-B, item 6 e Anexo 5-F, item 13', url: NORMAM, ref: 'extra-vela-2-01' },
          { txt: 'RIPEAM-72, Regra 30 (embarcações fundeadas)', url: COLREG, ref: 'tecnico-64' },
          { txt: 'Wikipedia, Anchor: arinque e âncora presa (referência geral)', url: 'https://en.wikipedia.org/wiki/Anchor' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: manobra de fundear e suspender', url: ARTE },
        ] },
      ],
    },
    {
      id: 'l5',
      titulo: 'Garrou? Vigiar o fundeio; duas âncoras e âncora de popa',
      minutos: 13,
      objetivos: [
        'Detectar que o barco garrou com marcações, GPS e sensação',
        'Agir com calma ao garrar: mais filame, motor, reposicionar',
        'Reconhecer quando usar duas âncoras ou âncora de popa',
      ],
      blocos: [
        { t: 'p', html: `<b>Garrar</b> é a âncora arrastar pelo fundo: o barco deriva sem que ninguém perceba. Acontece quando o vento aumenta ou vira, o filame é curto, o fundo é ruim ou a âncora não unhou direito. A defesa é <b>vigiar</b>.` },
        { t: 'h', txt: 'Sinais de que garrou' },
        { t: 'lista', itens: [
          `<b>Marcações que mudam.</b> Pegue duas linhas de marcação (alinhamentos) em objetos de terra a cerca de 90° entre si, ou uma marcação mais a distância. Se a marcação muda, o barco anda.`,
          `<b>Alarme do GPS</b> com raio ligeiramente maior que o filame mais o comprimento do barco, mais a margem de erro do GPS.`,
          `<b>Profundidade</b> diferente do esperado (alarme de profundidade).`,
          `<b>Sensação.</b> Trancos, vibração e ruído na corrente ou no cabo, em contato com a mão ou com o pé.`,
          `<b>Posição relativa</b>: a proa deixa de apontar para o vento; o barco gira de modo diferente do dos vizinhos.`,
          `<b>Vizinhos.</b> O barco que se aproxima, ou que você se aproxima, é um aviso.`,
        ] },
        { t: 'figura', svg: svg('0 0 400 290', 'Uso de duas marcações para detectar que a âncora garrou: o alinhamento com a ponta e com a torre muda de lugar quando o barco anda',
            seta('g1') +
            '<rect x="0" y="0" width="400" height="290" fill="var(--sea-1)"/>' +
            '<path d="M0,0 L400,0 L400,64 L330,50 L260,66 L190,48 L110,62 L0,50 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
            '<path d="M310,36 L330,36 L324,6 L316,6 Z" fill="var(--ink)"/>' + t(338, 24, 'torre', 15) +
            '<path d="M70,50 C74,36 96,36 100,50 Z" fill="var(--ink)"/>' + t(18, 26, 'ponta', 15) +
            '<line x1="82" y1="46" x2="190" y2="180" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="5 4"/>' +
            '<line x1="320" y1="40" x2="190" y2="180" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="5 4"/>' +
            casco(190, 196, 0.8, 0, 'var(--sea-2)') +
            '<line x1="82" y1="46" x2="260" y2="200" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="3 3"/>' +
            '<line x1="320" y1="40" x2="260" y2="200" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="3 3"/>' +
            casco(260, 216, 0.8, 0, 'none') +
            '<line x1="200" y1="220" x2="248" y2="230" stroke="var(--magenta)" stroke-width="3" marker-end="url(#g1)"/>' +
            t(100, 250, 'posição certa', 15, 'middle') + t(296, 262, 'garrou: marcações mudaram', 15, 'middle', 'var(--magenta)') +
            t(200, 282, 'Esquema sem escala', 14, 'middle')),
          legenda: `Duas marcações em ângulo próximo de 90° (a ponta e a torre) formam a posição certa. Quando o barco anda, o cruzamento das linhas muda: sinal de que ele garrou. Anote as marcações e o horário no diário de bordo.` },
        { t: 'h', txt: 'Alarme de fundeio do GPS' },
        { t: 'lista', itens: [
          `Ative o alarme depois que a âncora unhou e o barco já parou, com o centro na posição da âncora ou do barco.`,
          `Raio = <b>filame + comprimento do barco + margem de 10 a 15 m</b> para o erro de posição do GPS. Se o raio for pequeno demais, o alarme dispara à toa e você passa a ignorar.`,
          `Teste o alarme antes: mande o barco andar um pouco e veja se avisa.`,
          `Ligue o volume e deixe o aparelho com carga ou na tomada. Dependa dele, mas nunca somente dele.`,
        ] },
        { t: 'h', txt: 'Vigia noturna' },
        { t: 'p', html: `Em fundeadouro tranquilo e com alarme, todos dormem. Em fundeadouro apertado, com vento forte ou previsão de virada, combine <b>quartos de vigia</b>: alguém acorda de hora em hora, olha as marcações, a profundidade, os vizinhos e o céu. Vento que roda no fim da noite (entrada de frente fria, por exemplo) é o que mais deixa barco garrando.` },
        { t: 'h', txt: 'Se o barco garrou' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Acorde todos</b> e coloque coletes. O comandante assume o leme e uma pessoa vai à proa.`,
          `<b>Ligue o motor</b> e deixe-o engrenado em marcha lenta adiante para aliviar a âncora, se o vento for forte.`,
          `<b>Solte mais filame</b>, se houver espaço e o filame for curto. Muitas vezes é o suficiente.`,
          `<b>Se continuar a andar</b>, recolha a âncora e <b>fundeie de novo</b> em outro ponto, mais a barlavento, longe dos vizinhos e com mais filame.`,
          `<b>Avise os vizinhos</b> pelo VHF ou por apito, se houver risco de colisão.`,
          `<b>Se o fundeadouro ficou perigoso</b>, saia para outro abrigo ou para o largo. Entre pedras, à noite e com vento forte, ficar não é opção.`,
        ] },
        { t: 'h', txt: 'Duas âncoras e âncora de popa' },
        { t: 'lista', itens: [
          `<b>Dois ferros (duas âncoras).</b> Em forquilha (em V), fundeie a primeira contra o vento principal e recue com a segunda em ângulo de uns 45° em relação à primeira: o barco gira numa elipse estreita. Para corrente de maré que muda de sentido (rios, estuários), as duas âncoras ficam em lados opostos, ao longo da corrente.`,
          `<b>Âncora de proa e âncora de popa.</b> Limita o giro quando o espaço é pequeno, por exemplo em rio estreito ou enseada com muitos barcos. Cuidado: prende o barco em uma direção, e com vento de través o esforço sobre as âncoras e os cabos é grande. Evite com vento forte de través.`,
          `<b>Popa para a praia (cabo em terra).</b> Em lugares abrigados, deixa-se a âncora de proa e leva-se um cabo de popa a uma árvore, rocha ou poita em terra. Dá abrigo e facilita o desembarque em bote. Mas deixa o barco preso: se o vento virar, não gira.`,
          `<b>Fundear num “poço”</b> (trecho mais fundo e abrigado de rio, riacho ou enseada). Vá devagar com a sonda à frente: a profundidade muda rápido ao sair do poço, a correnteza pode dominar o vento e, se o espaço for estreito, a âncora de popa limita o giro.`,
          `<b>Onde há dúvida:</b> fundeie de proa, com mais filame, e deixe o barco girar.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Atenção a cabos de popa e ao hélice', html: `Cabo de popa na água é perigo para o hélice. Prenda e recolha com o motor desligado, e mantenha o cabo acima da água perto da popa. Cabo sob carga também chicoteia se arrebentar: não fique na linha do cabo.` },
        { t: 'termos', ids: ["garrar", "marcacao", "alinhamento", "linha-de-posicao", "luz-de-fundeio", "gnss"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-043', nivel: 'vela', tema: 'Fundear', dificuldade: 1,
            enunciado: 'O que significa “garrar”?',
            alternativas: ['A âncora arrastar pelo fundo, com o barco derivando', 'A âncora se enterrar com firmeza', 'O rode se emaranhar no hélice', 'O barco girar em torno da âncora'],
            correta: 0,
            explicacao: 'Garrar é a âncora perder a fixação e ser arrastada, deixando o barco à deriva. Enterrar-se é unhar. Rode enrolado no hélice é outro problema. Girar em torno da âncora é normal com o vento e a corrente.',
            referencia: 'Glossário náutico; Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
          { id: 'vela-2-044', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Qual a melhor forma de detectar que a âncora garrou, além do alarme do GPS?',
            alternativas: ['Duas marcações em objetos de terra, a uns 90° entre si, conferidas de tempos em tempos', 'Esperar o barco encostar em outro', 'Medir a temperatura da água', 'Contar o número de estrelas'],
            correta: 0,
            explicacao: 'Duas marcações (alinhamentos) mostram se o barco anda, independente da eletrônica. Esperar o contato é tarde demais; temperatura da água e estrelas não ajudam.',
            referencia: 'Miguens, vol. I (linhas de posição)' },
          { id: 'vela-2-045', nivel: 'vela', tema: 'Fundear', dificuldade: 2,
            enunciado: 'Ao perceber que o barco garrou com vento forte, qual é a primeira atitude correta?',
            alternativas: ['Acordar todos, ligar o motor e, se houver espaço, soltar mais filame', 'Esperar o amanhecer para decidir', 'Recolher a âncora e ir dormir', 'Desligar todas as luzes'],
            correta: 0,
            explicacao: 'Acordar a tripulação, ligar o motor para aliviar a âncora e soltar mais filame resolve muitos casos. Esperar o amanhecer ou desligar luzes aumenta o risco. Recolher e dormir não resolve.',
            referencia: 'Boa prática marinheira; Fonseca, Arte Naval, vol. 2', fonte_url: ARTE },
        ] },
        { t: 'fontes', itens: [
          { txt: 'Wikipedia, Anchor: detecção de garrada e fundeio em forquilha (referência geral)', url: 'https://en.wikipedia.org/wiki/Anchor' },
          { txt: 'Fonseca, M. M. Arte Naval, vol. 2: fundeio com duas âncoras', url: ARTE },
          { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I: linhas de posição e marcações' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm9',
  titulo: 'Velejar à noite',
  resumo: `A noite muda tudo: você enxerga luzes, não barcos; o frio, o sono e o balanço pesam mais; e uma queda de bordo é bem mais perigosa. Neste módulo você aprende as luzes que o veleiro deve mostrar (e por que o motor ligado muda o jogo), como manter vigia e preservar a visão noturna, como ver e ser visto (refletor radar, AIS, lanterna), e como organizar quartos curtos e o convés para a segurança.`,
  licoes: [
    {
      id: 'l1',
      titulo: 'Luzes do veleiro a vela: bordos e alcançado, ou tricolor',
      minutos: 12,
      objetivos: [
        'Dizer quais luzes um veleiro a vela deve mostrar à noite (Regra 25)',
        'Conhecer setores e alcances das luzes de um veleiro de cruzeiro, por faixa de comprimento',
        'Reconhecer a combinação com tricolor no topo do mastro e quando ela não vale',
      ],
      blocos: [
        { t: 'p', html: `À noite, a única informação que você tem sobre outro barco são as luzes dele: cores, posição e quantas há. As regras do <b>RIPEAM-72</b> (Convenção Internacional para Evitar Abalroamentos no Mar, o COLREG) padronizam isso para o mundo todo. O RIPEAM obriga a mostrar as luzes <b>do pôr ao nascer do Sol</b>, e também com visibilidade restrita durante o dia.` },
        { t: 'fato', ref: 'tecnico-40', html: `Regra 20(b) do RIPEAM: as regras de luzes aplicam-se do pôr ao nascer do Sol.` },
        { t: 'fato', ref: 'tecnico-08', html: `A NORMAM-211/DPC determina que todas as embarcações de esporte e recreio, a vela ou a motor, atendam ao RIPEAM-72 e emendas, inclusive quanto às luzes de navegação.` },
        { t: 'fato', ref: 'tecnico-09', html: `Pela NORMAM-211, só embarcações com as luzes de navegação previstas no RIPEAM podem operar à noite sem restrição de horário.` },
        { t: 'h', txt: 'As luzes de um veleiro navegando só a vela' },
        { t: 'fato', ref: 'tecnico-54', html: `Regra 25(a): embarcação a vela em movimento exibe luzes de bordos e luz de alcançado.` },
        { t: 'lista', itens: [
          `<b>Luz de bordo de boreste (verde)</b> e <b>luz de bordo de bombordo (encarnada)</b>. Cada uma é vista num setor de 112,5° (da proa até 22,5° por ante a ré do través).`,
          `<b>Luz de alcançado (branca)</b>, na popa, vista num setor de 135° (67,5° de cada lado da popa).`,
          `<b>Não há luz de mastro branca</b>: ela é própria de quem usa motor.`,
        ] },
        { t: 'fato', ref: 'tecnico-42', html: `Regra 21(b): luzes de bordos são verde a boreste e encarnada a bombordo, cada uma visível num setor de 112,5°.` },
        { t: 'fato', ref: 'tecnico-44', html: `Regra 21(c): a luz de alcançado é branca, junto à popa, visível num setor de 135° (67,5° de cada bordo a partir da popa).` },
        { t: 'h', txt: 'Alternativas permitidas' },
        { t: 'fato', ref: 'tecnico-55', html: `Regra 25(b): veleiro com menos de 20 m pode exibir essas luzes numa lanterna combinada (tricolor) no tope do mastro, ou próximo.` },
        { t: 'fato', ref: 'tecnico-56', html: `Regra 25(c): o veleiro pode exibir no tope duas circulares (encarnada sobre verde), mas não junto com a lanterna combinada.` },
        { t: 'lista', itens: [
          `<b>Luzes de bordos e de alcançado separadas</b> (no púlpito de proa e na popa): a combinação mais comum em veleiros de cruzeiro.`,
          `<b>Tricolor no topo do mastro</b>: uma só lanterna com vermelho, verde e branco, vista de longe e de bem alto. Poupa bateria. Só vale <b>a vela</b>.`,
          `<b>Vermelho sobre verde no topo</b>: duas luzes circulares (encarnada sobre verde), adicionais às luzes de bordos e de alcançado, que dizem “veleiro”. Não podem ser usadas junto com o tricolor.`,
          `<b>Veleiro com menos de 7 m</b>: se não puder mostrar as luzes, deve ter uma lanterna acesa ou facho pronto para mostrar a tempo de evitar abalroamento (Regra 25(d)).`,
        ] },
        { t: 'figura', svg: svg('0 0 400 290', 'Setores das luzes de um veleiro a vela: luz verde a boreste, encarnada a bombordo, ambas de 112,5°, e luz branca de alcançado de 135°',
            '<rect x="0" y="0" width="400" height="290" fill="var(--sea-1)"/>' +
            '<g transform="translate(200 156)">' +
            '<path d="M0,0 L0,-100 A100,100 0 0 1 92.4,38.3 Z" fill="var(--nav-green)" opacity="0.55"/>' +
            '<path d="M0,0 L0,-100 A100,100 0 0 0 -92.4,38.3 Z" fill="var(--nav-red)" opacity="0.55"/>' +
            '<path d="M0,0 L-92.4,38.3 A100,100 0 0 0 92.4,38.3 Z" fill="var(--nav-white)" opacity="0.85"/>' +
            '<g stroke="var(--ink)" stroke-width="1.6" fill="none"><line x1="0" y1="0" x2="0" y2="-100"/><line x1="0" y1="0" x2="92.4" y2="38.3"/><line x1="0" y1="0" x2="-92.4" y2="38.3"/></g>' +
            casco(0, 0, 0.9, 0, 'var(--paper, #fff)') +
            '</g>' +
            t(284, 70, 'verde:', 15, 'start') + t(284, 88, 'boreste', 15, 'start') + t(116, 70, 'encarnada:', 15, 'end') + t(116, 88, 'bombordo', 15, 'end') +
            t(200, 282, 'branca (alcançado): 135° pela popa', 15, 'middle') +
            t(262, 128, '112,5°', 15, 'middle') + t(138, 128, '112,5°', 15, 'middle') +
            t(200, 36, 'proa', 15, 'middle')),
          legenda: `Vista de cima, proa para cima. A luz verde é vista do lado de boreste (da proa até 22,5° por ante a ré do través), a encarnada do lado de bombordo e a branca só de trás. De frente, o outro barco vê verde e encarnada ao mesmo tempo; de lado, só a cor do bordo; por trás, só branca.` },
        { t: 'h', txt: 'Alcances mínimos conforme o comprimento do barco' },
        { t: 'fato', ref: 'tecnico-51', html: `Regra 22(c): em embarcações com menos de 12 m, alcances mínimos: mastro 2 milhas; bordos 1 milha; alcançado 2; reboque 2; circulares 2.` },
        { t: 'p', html: `Num veleiro com <b>menos de 12 m</b> (um 32 pés, de 9,75 m, é um exemplo), as luzes de bordos têm alcance mínimo de <b>1 milha</b>; de 12 m a menos de 50 m, o mínimo é de 2 milhas. Em outras palavras, no caso de um barco com menos de 12 m, um barco de pesca pode vê-lo só a pouco mais de 1 milha (cerca de 10 minutos de navegação a 6 nós). Você precisa vê-lo antes, e eles precisam ser vistos: por isso a atenção à vigia, ao refletor radar e ao AIS (lição 4).` },
        { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'vela', opcoes: { tricolor: true }, aspecto: 300 }, legenda: 'Gire o aspecto para ver o veleiro por vários ângulos, e compare com as luzes de bordos separadas (desligue o tricolor). Use o modo desafio para treinar.' },
        { t: 'callout', tipo: 'dica', titulo: 'Teste suas luzes antes do pôr do sol', html: `Ligue cada luz com o barco no cais e dê uma volta. Lâmpada queimada, fusível, contato corroído e lente suja são as causas mais comuns. Leve lâmpadas e fusíveis sobressalentes, e uma lanterna de mão.` },
        { t: 'termos', ids: ["luzes-de-navegacao", "luzes-de-bordos", "luz-de-alcancado", "lanterna-tricolor", "luz-de-mastro", "ripeam"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-046', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'Que luzes mostra, à noite, um veleiro de cruzeiro navegando só a vela?',
            alternativas: ['Luzes de bordos (verde a boreste, encarnada a bombordo) e luz de alcançado', 'Apenas uma luz branca circular', 'Luz de mastro branca, bordos e alcançado', 'Duas luzes circulares encarnadas'],
            correta: 0,
            explicacao: 'A Regra 25(a) pede luzes de bordos e luz de alcançado; no tope pode estar uma lanterna combinada (tricolor). A luz de mastro branca é própria de quem usa motor. Uma só luz branca circular é a luz de embarcação fundeada (ou alternativa para motor pequeno). Duas encarnadas indicam embarcação sem governo.',
            referencia: 'RIPEAM-72, Regra 25(a)', fonte_url: COLREG },
          { id: 'vela-2-047', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Qual é o setor visível da luz de alcançado?',
            alternativas: ['135°', '112,5°', '225°', '360°'],
            correta: 0,
            explicacao: 'A luz de alcançado é branca e vista num setor de 135° (67,5° de cada lado da popa). 112,5° é o setor de cada luz de bordo. 225° é o setor da luz de mastro. 360° é o da luz circular.',
            referencia: 'RIPEAM-72, Regra 21(c)', fonte_url: COLREG },
          { id: 'vela-2-048', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Você vê, de longe, uma luz encarnada e uma luz verde juntas, uma ao lado da outra. O que isso indica?',
            alternativas: ['Um barco vindo de frente, aproando para você', 'Um barco ultrapassando por bombordo', 'Um barco fundeado', 'Um barco com a proa para longe de você'],
            correta: 0,
            explicacao: 'As luzes de bordos se veem juntas quando o outro barco aponta a proa para você (ou quase). De lado, vê-se só uma delas; por trás, só a branca de alcançado; fundeado, só uma luz branca.',
            referencia: 'RIPEAM-72, Regras 21 e 14', fonte_url: COLREG },
        ] },
        { t: 'fontes', itens: [
          { txt: 'RIPEAM-72, Regras 20, 21, 22 e 25', url: COLREG, ref: 'tecnico-54' },
          { txt: 'NORMAM-211/DPC, luzes de navegação (arts. 4.18.6 e 4.19)', url: NORMAM, ref: 'tecnico-09' },
          { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. III (RIPEAM); Rolszt & Rolszt, Manual do Veleiro e Arrais-Amador' },
        ] },
      ],
    },
    {
      id: 'l2',
      titulo: 'Motor ligado: você é embarcação de propulsão mecânica',
      minutos: 11,
      objetivos: [
        'Explicar por que o veleiro com motor ligado muda de categoria (Regras 3 e 25)',
        'Trocar as luzes e a marca diurna ao ligar o motor',
        'Entender o efeito nas regras de governo',
      ],
      blocos: [
        { t: 'p', html: `Esta é a regra mais esquecida pelos velejadores: <b>basta usar o motor para empurrar o barco, mesmo com as velas içadas, para ele deixar de ser “embarcação a vela”</b> para o RIPEAM e passar a ser <b>embarcação de propulsão mecânica</b>. Isso muda as luzes à noite, a marca de dia e as obrigações nos encontros com outras embarcações.` },
        { t: 'fato', ref: 'tecnico-14', html: `Para o RIPEAM, “embarcação a vela” é a que está sob vela com o motor (se houver) fora de uso; motorando, um veleiro passa a ser embarcação de propulsão mecânica.` },
        { t: 'h', txt: 'Luzes com o motor ligado' },
        { t: 'p', html: `Uma embarcação de propulsão mecânica em movimento mostra uma <b>luz de mastro</b> (branca, a vante, setor de 225°), as <b>luzes de bordos</b> e a <b>luz de alcançado</b>. A luz de mastro é o sinal de “tenho motor”.` },
        { t: 'fato', ref: 'tecnico-41', html: `Regra 21(a): a luz de mastro é branca, no eixo longitudinal, visível num setor de 225°, da proa até 22,5° por ante-a-ré do través de cada bordo.` },
        { t: 'fato', ref: 'tecnico-52', html: `Regra 23(a)(ii): embarcação de propulsão mecânica com menos de 50 m não é obrigada a exibir a segunda luz de mastro (à ré), mas pode fazê-lo.` },
        { t: 'fato', ref: 'tecnico-53', html: `Regra 23(d)(i): embarcação de propulsão mecânica com menos de 12 m pode exibir uma luz circular branca e luzes de bordos em vez das luzes do parágrafo (a).` },
        { t: 'tabela', cab: ['Situação', 'Luzes à noite', 'Marca de dia'], linhas: [
          ['Só a vela', 'Bordos e alcançado (ou tricolor no topo)', 'Nenhuma'],
          ['A vela e a motor ao mesmo tempo (motorvelejando)', 'Como propulsão mecânica: luz de mastro, bordos e alcançado. Para menos de 12 m: luz circular branca e bordos', 'Um <b>cone com o vértice para baixo</b>, a vante, onde melhor se veja (Regra 25(e))'],
          ['Só a motor, velas arriadas', 'Como propulsão mecânica (iguais às de cima)', 'Nenhuma'],
          ['Fundeado', 'Uma luz circular branca a vante (menos de 50 m)', 'Uma esfera a vante'],
        ], legenda: 'Resumo. Barcos com menos de 12 m podem usar a alternativa de uma luz circular branca e luzes de bordos (Regra 23(d)).' },
        { t: 'fato', ref: 'tecnico-57', html: `Regra 25(e): navegando a vela e usando também o motor, a embarcação exibe a vante um cone com o vértice para baixo.` },
        { t: 'h', txt: 'E o tricolor?' },
        { t: 'p', html: `O tricolor é uma lanterna combinada permitida só para <b>embarcação a vela</b> (Regra 25(b)). Ao ligar o motor, você passa a ser embarcação de propulsão mecânica, e o tricolor deixa de ser a configuração correta: apague-o e acenda a luz de mastro (“luz de motor” ou <i>steaming light</i>) mais as luzes de bordos e de alcançado de convés. Se você é um veleiro com menos de 12 m, pode usar a alternativa de uma luz circular branca e luzes de bordos (Regra 23(d)).` },
        { t: 'callout', tipo: 'nota', titulo: 'Muita gente erra isso', html: `Um painel de luzes bem etiquetado (“à vela”, “à vela e motor”, “fundeado”) evita o erro. Cole uma legenda ao lado do interruptor e faça parte do briefing do comandante: “motor ligado, muda a chave das luzes”. Em barcos com tricolor no topo e sem luzes de bordos de convés, consulte um instrutor ou a Capitania para ver como cumprir a Regra 23.` },
        { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'velamotor', aspecto: 340, dia: false }, legenda: 'Veleiro a vela e a motor: compare com “a vela” e veja o que muda à noite e, ligando “dia”, a marca diurna.' },
        { t: 'h', txt: 'Efeito nas regras de governo' },
        { t: 'p', html: `Com o motor ligado você perde o privilégio de “embarcação a vela”. Um veleiro motorando é tratado como embarcação de propulsão mecânica nos encontros com outras embarcações: cruzamento de rumos, roda a roda e ultrapassagem. Perante um veleiro de verdade que navega só a vela, <b>você é quem deve manobrar</b> (Regra 18), tanto de dia quanto de noite, salvo quando outra regra mandar diferente: em canal estreito (Regra 9), em esquema de separação de tráfego (Regra 10) e na ultrapassagem (Regra 13, em que quem alcança o outro é quem se afasta). Embarcações sem governo, com manobra restrita ou engajadas na pesca também têm preferência sobre você.` },
        { t: 'callout', tipo: 'seguranca', titulo: 'O que conta é usar o motor', html: `Pouco importa se a vela grande está içada: se o motor está engrenado e empurrando, você é embarcação de propulsão mecânica. Se o motor está só ligado, em ponto morto, e o barco anda pelas velas, o motor está “fora de uso” e você é embarcação a vela. Na dúvida, mostre as luzes de propulsão mecânica.` },
        { t: 'termos', ids: ["embarcacao-a-vela", "embarcacao-de-propulsao-mecanica", "luz-de-mastro", "marcas-diurnas", "lanterna-tricolor", "hierarquia-de-manobra"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-049', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'Um veleiro navega com o motor engrenado e as velas içadas. Para o RIPEAM, ele é:',
            alternativas: ['Embarcação de propulsão mecânica', 'Embarcação a vela', 'Embarcação de pesca', 'Embarcação sem governo'],
            correta: 0,
            explicacao: 'Para o RIPEAM, embarcação a vela é a que está sob vela com o motor fora de uso. Com o motor engrenado, passa a ser embarcação de propulsão mecânica. Pesca e sem governo são condições específicas que não se aplicam.',
            referencia: 'RIPEAM-72, Regras 3 e 25(e)', fonte_url: COLREG },
          { id: 'vela-2-050', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Qual é a marca diurna de um veleiro navegando a vela e a motor ao mesmo tempo?',
            alternativas: ['Um cone com o vértice para baixo, a vante', 'Uma esfera a vante', 'Dois cones unidos pelas bases', 'Um cilindro'],
            correta: 0,
            explicacao: 'A Regra 25(e) manda exibir a vante um cone com o vértice para baixo. A esfera é de embarcação fundeada. Dois cones unidos são marca de pesca, e o cilindro é de embarcação restrita pelo calado.',
            referencia: 'RIPEAM-72, Regra 25(e)', fonte_url: COLREG },
          { id: 'vela-2-051', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 3,
            enunciado: 'Um veleiro de 32 pés (9,75 m, ou seja, menos de 12 m) anda à noite com o motor ligado. Quais luzes podem ser usadas segundo o RIPEAM?',
            alternativas: ['Luz de mastro, bordos e alcançado, ou, por ter menos de 12 m, luz circular branca e bordos', 'Somente o tricolor no topo', 'Apenas luz de alcançado', 'Luz amarela intermitente'],
            correta: 0,
            explicacao: 'Com o motor ligado vale a Regra 23: luz de mastro, bordos e alcançado; para menos de 12 m, a alternativa é luz circular branca e bordos (23(d)). O tricolor é só para a vela (25(b)). A luz de alcançado sozinha e a amarela intermitente não bastam.',
            referencia: 'RIPEAM-72, Regras 23 e 25', fonte_url: COLREG },
        ] },
        { t: 'fontes', itens: [
          { txt: 'RIPEAM-72, Regras 3, 18, 21, 23 e 25', url: COLREG, ref: 'tecnico-14' },
          { txt: 'Starpath, Navigation rules: sailing vessel with tri-color masthead light', url: 'https://www.starpath.com/navrules/lights/Sailing_2.html' },
          { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. III (RIPEAM)' },
        ] },
      ],
    },
    {
      id: 'l3',
      titulo: 'Vigia, visão noturna e quartos curtos',
      minutos: 12,
      objetivos: [
        'Aplicar a Regra 5 (vigilância) à noite',
        'Preservar a visão noturna e olhar de lado para ver melhor',
        'Organizar quartos curtos e controlar o sono e o frio',
      ],
      blocos: [
        { t: 'fato', ref: 'tecnico-15', html: `Regra 5: toda embarcação deve manter permanentemente vigilância visual e auditiva apropriada e por todos os meios disponíveis.` },
        { t: 'p', html: `A vigia é a única proteção que sempre funciona. À noite ela fica mais difícil por três motivos: você enxerga menos, está cansado e o barco, sem luz, parece vazio. As lições abaixo ajudam a vencer cada um.` },
        { t: 'h', txt: 'Preservar a visão noturna' },
        { t: 'p', html: `Os olhos precisam de cerca de <b>30 minutos no escuro</b> para ver bem à noite (até 40 minutos ou mais para a adaptação completa). Um clarão de luz branca forte, como uma lanterna ou a tela do celular, desfaz parte do ganho em segundos.` },
        { t: 'lista', itens: [
          `<b>Luz mínima e fraca.</b> Dimerize as telas do GPS e do plotter (modo noturno). Use lanterna de luz vermelha ou muito fraca. Há quem defenda tons verdes ou luz branca muito suave (veja o quadro abaixo); o ponto comum é <b>usar o mínimo de luz possível</b>.`,
          `<b>Olhe de lado.</b> No centro da retina há muitas células de cor (cones) e quase nenhuma sensível à luz fraca (bastonetes). Por isso, objetos fracos somem se você olha direto para eles. Olhe de 5° a 10° ao lado do ponto para vê-los.`,
          `<b>Varra o horizonte em saltos curtos</b>, com pausas de alguns segundos, e volte a varrer. O olho não vê enquanto se move.`,
          `<b>Evite luz na cabine.</b> Quem sobe para o convés vindo de um lugar iluminado precisa esperar a adaptação antes de assumir o quarto.`,
        ] },
        { t: 'callout', tipo: 'nota', titulo: 'A cor da lanterna é debatida', html: `Durante décadas se ensinou luz vermelha, e ela segue sendo o ensino tradicional. A base fisiológica: os bastonetes, que enxergam no escuro, são muito mais sensíveis aos comprimentos de onda curtos (azul e verde) do que aos longos, e a adaptação leva de 5 a 8 minutos para os bastonetes assumirem e cerca de 40 minutos para se estabilizar (Webvision, abaixo). Em contrapartida, a luz vermelha apaga as marcas vermelhas das cartas, e alguns autores recentes, em artigos de opinião e de revista (não revisados por pares), sustentam que a vantagem do vermelho é pequena e que uma luz branca ou verde muito fraca também serve. O que as fontes têm em comum é a <b>intensidade</b>: quanto menos luz, melhor. Em dúvida, siga o comandante do barco e o seu instrutor.` },
        { t: 'h', txt: 'O que olhar' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Luzes de outros barcos:</b> cor, quantas e como se movem. Mantendo o seu rumo, confira a marcação do outro barco: se ela <b>não muda</b> e a distância diminui, há risco de colisão.`,
          `<b>Luzes de terra:</b> luzes de navegação (faróis, boias) e luzes de cidade. Aprenda a distinguir as primeiras (cores e ritmos) das de terra.`,
          `<b>Sem luz:</b> pesqueiros pequenos, botes e redes de pesca nem sempre têm luzes. Em águas de pesca, reduza a velocidade e redobre a atenção.`,
          `<b>Nuvens e relâmpagos, mudança de cor do mar, ondas quebrando:</b> todos indicam mudanças de tempo ou perigo.`,
          `<b>Instrumentos:</b> radar (se houver), AIS e sonda, a cada poucos minutos; escreva os pontos principais no diário de bordo.`,
        ] },
        { t: 'fato', ref: 'tecnico-16', html: `Regra 6: toda embarcação deve navegar a uma velocidade segura que permita ação eficaz para evitar colisão e parar a distância apropriada.` },
        { t: 'p', html: `A Regra 6 também vale à noite: a velocidade segura depende da visibilidade, da densidade do tráfego e do reflexo de luzes de terra. Reduzir panos antes de escurecer costuma ser a decisão mais segura de uma noite longa.` },
        { t: 'h', txt: 'Quartos curtos e sono' },
        { t: 'p', html: `Uma tripulação cansada vigia mal. À noite, o ritmo é: <b>quartos mais curtos</b> (equipes pequenas costumam usar de 2 a 3 horas), horário fixo de troca, bebida quente à mão e quem dorme dorme de verdade, sem ser chamado à toa. O sono se acumula em dias: planeje a escala pensando em 2 e 3 dias.` },
        { t: 'lista', itens: [
          `<b>Passagem de quarto.</b> Quem entra deve ouvir, em voz alta e sem pressa: rumo, vento, velas, barcos à vista, tráfego esperado, luzes combinadas, pontos de atenção e a hora em que você deve ser acordado.`,
          `<b>Combine quando chamar o comandante:</b> barco que se aproxima, mudança de vento, mudança de tempo, qualquer dúvida. Chamar à toa é melhor que não chamar.`,
          `<b>Alarmes no relógio e no GPS</b> (chegada, deriva, sonda) são auxílio, não substituem a vigia.`,
          `<b>Alimentação e água.</b> Comer pouco e muitas vezes e beber água; evitar muita cafeína perto do fim do quarto.`,
          `<b>Frio.</b> De madrugada o corpo esfria, mesmo nos trópicos: leve casaco, gorro, meia seca.`,
        ] },
        { t: 'widget', w: 'quartos', opts: { pessoas: 3, sistema: 'cao', dias: 2 }, legenda: 'Monte uma escala de quartos para a sua tripulação e veja as horas de descanso de cada pessoa.' },
        { t: 'callout', tipo: 'seguranca', titulo: 'Sinais de que o vigia está esgotado', html: `Microssonos, alucinações com luzes e formas que parecem barcos, esquecer o último rumo conferido e piscar demais. Quem os sente deve chamar a troca já, mesmo antes da hora. Não existe “aguentar mais 10 minutos”.` },
        { t: 'termos', ids: ["vigilancia", "velocidade-de-seguranca", "risco-de-abalroamento", "marcacao-relativa"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-052', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'Por que olhar um pouco ao lado de um objeto fraco ajuda a vê-lo à noite?',
            alternativas: ['O centro da retina tem poucos receptores sensíveis a luz fraca', 'O olho se cansa menos na lateral', 'A luz é mais forte nas bordas da vista', 'O cérebro ignora o centro do campo'],
            correta: 0,
            explicacao: 'No centro da retina há muitos cones (cor) e quase nenhum bastonete (luz fraca). Olhando de 5° a 10° ao lado, a imagem cai na região com bastonetes. Não é cansaço do olho nem luz mais forte nas bordas, nem o cérebro ignorar.',
            referencia: 'Kalloniatis e Luu, Light and Dark Adaptation (Webvision, Univ. de Utah)', fonte_url: 'https://webvision.med.utah.edu/book/part-viii-gabac-receptors/light-and-dark-adaptation/' },
          { id: 'vela-2-053', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'Qual Regra do RIPEAM obriga a manter vigilância visual e auditiva permanente?',
            alternativas: ['Regra 5', 'Regra 6', 'Regra 7', 'Regra 20'],
            correta: 0,
            explicacao: 'A Regra 5 trata da vigilância. A 6 é velocidade segura, a 7 é risco de abalroamento e a 20 trata da aplicação das regras de luzes e marcas.',
            referencia: 'RIPEAM-72, Regra 5', fonte_url: COLREG },
          { id: 'vela-2-054', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'A marcação de um barco que se aproxima não muda e a distância diminui. O que se deve presumir?',
            alternativas: ['Há risco de abalroamento', 'Ele vai passar longe', 'É um barco fundeado', 'Não há risco, porque é noite'],
            correta: 0,
            explicacao: 'A Regra 7(d)(i) manda presumir risco de abalroamento quando a marcação não se altera de modo apreciável. Marcação constante com distância diminuindo é o sinal mais clássico de rumo de colisão.',
            referencia: 'RIPEAM-72, Regra 7(d)(i)', fonte_url: COLREG },
        ] },
        { t: 'fontes', itens: [
          { txt: 'RIPEAM-72, Regras 5, 6 e 7', url: COLREG, ref: 'tecnico-15' },
          { txt: 'Kalloniatis, M. e Luu, C., Light and Dark Adaptation (Webvision, Moran Eye Center, Univ. de Utah): tempo de adaptação, bastonetes e comprimento de onda', url: 'https://webvision.med.utah.edu/book/part-viii-gabac-receptors/light-and-dark-adaptation/' },
          { txt: 'Sailing Scuttlebutt, Red is wrong for night vision (2025): artigo de opinião contra a luz vermelha; a página é só um resumo', url: 'https://www.sailingscuttlebutt.com/2025/10/05/red-is-wrong-for-night-vision' },
        ] },
      ],
    },
    {
      id: 'l4',
      titulo: 'Ver e ser visto: refletor radar, AIS, lanterna e sinais',
      minutos: 10,
      objetivos: [
        'Explicar a função do refletor radar e do AIS, e seus limites',
        'Usar a lanterna e os sinais de forma correta (sem estroboscópica)',
        'Reconhecer a luz de fundeio e o que mais exibir à noite',
      ],
      blocos: [
        { t: 'p', html: `Ver é só metade da segurança noturna; a outra metade é <b>ser visto</b>. Um veleiro de cruzeiro de fibra, sobretudo um pequeno, é um alvo fraco para o radar de um navio. Os dispositivos abaixo ajudam, mas nenhum substitui a vigia.` },
        { t: 'h', txt: 'Refletor radar' },
        { t: 'fato', ref: 'extra-mestre-3-03', html: `Toda embarcação empregada em navegação costeira ou oceânica deve ter um refletor radar.` },
        { t: 'lista', itens: [
          `Um <b>refletor radar passivo</b> (peça metálica de chapas em ângulos retos, que devolve o sinal na direção de onde veio) deixa o barco mais visível ao radar do navio. Quanto <b>mais alto</b> estiver, melhor, porque o radar do navio vê pelo horizonte.`,
          `Montado no estai ou no mastro, <b>na posição que o fabricante indica</b> (os tubulares vão na vertical): um refletor fora da posição perde eficiência, e a banda e o balanço do barco mudam isso.`,
          `<b>Limites.</b> O refletor passivo não garante que o navio o veja: a eficiência depende da onda, do ângulo e do radar. Em mar com muita onda o sinal se perde no “ruído” do mar. Portanto, nunca presuma que o navio o viu.`,
        ] },
        { t: 'h', txt: 'AIS' },
        { t: 'p', html: `O <b>AIS</b> (Sistema de Identificação Automática) é um transponder de VHF que transmite sua identidade, posição, rumo e velocidade, e recebe os mesmos dados de outros barcos. Navios e muitas embarcações maiores o usam. Para veleiros pequenos, existem aparelhos de <b>classe B</b>.` },
        { t: 'fato', ref: 'travessia-16', html: `Cat. 0–3 da World Sailing: transponder AIS, compartilhando a antena VHF do topo via divisor de baixa perda ou com antena dedicada ≥ 38 cm a pelo menos 3 m acima da linha d'água.` },
        { t: 'lista', itens: [
          `<b>Só receber (receptor)</b> mostra os barcos com AIS ao redor, com nome, rumo, velocidade e ponto de maior aproximação. Já é muito útil.`,
          `<b>Transponder (receber e transmitir)</b> faz o seu barco aparecer para os outros. Instale com antena em boa posição.`,
          `<b>Limites.</b> Barcos de pesca pequenos, botes, veleiros sem AIS e boias não aparecem. Um navio pode ter o AIS desligado. O AIS informa, mas <b>não é vigia</b>.`,
          `<b>Alarme de colisão.</b> Configure o alarme de ponto de maior aproximação com folga (por exemplo, 1 milha) para que avise a tempo.`,
        ] },
        { t: 'h', txt: 'Lanterna e luzes extras' },
        { t: 'fato', ref: 'extra-vela-2-04', html: `O art. 4.18.2 da NORMAM-211 diz que todas as embarcações devem ter uma lanterna portátil, com bateria recarregável ou pilhas sobressalentes. Na prática, as tabelas da norma pedem 01 unidade nas embarcações de médio e grande porte e iates e na navegação costeira e oceânica, e dispensam as miúdas em navegação interior (tabela 4.33). Um veleiro de travessia leva a sua de qualquer modo.` },
        { t: 'fato', ref: 'tecnico-81', html: `Regra 36: para chamar a atenção, deve-se evitar luzes intermitentes de grande intensidade ou rotativas, como as estroboscópicas.` },
        { t: 'lista', itens: [
          `Para <b>chamar a atenção</b> de um navio sem pedir socorro, aponte uma lanterna <b>fixa</b> (não pisca) para a vela, de modo a iluminá-la. Não aponte para a ponte do navio, para não cegar o oficial de quarto.`,
          `<b>Estroboscópica</b>: não a use para chamar a atenção (Regra 36). Para quem já está na água, o US Sailing recomenda uma luz estroboscópica pessoal, para ser achado (estudo de 2020, item 7). Ela não consta da lista de sinais de perigo do Anexo IV do RIPEAM (foguete vermelho, Mayday, SOS, alerta DSC etc.), que não podem ser usados fora de uma emergência real.`,
          `<b>Colete com luz.</b> Cada tripulante deve ter luz e apito presos ao colete. A luz do colete é a que o vigia verá primeiro.`,
          `<b>Lanterna de cabeça (frontal)</b> no convés: com luz vermelha ou branca fraca, para manter as mãos livres.`,
        ] },
        { t: 'h', txt: 'Fundeado à noite' },
        { t: 'fato', ref: 'tecnico-64', html: `Regra 30(a)(i): embarcação fundeada exibe a vante uma luz circular branca (de dia, uma esfera).` },
        { t: 'p', html: `Fundeado, o veleiro acende a luz de fundeio (luz branca de 360°). Em fundeadouros movimentados, acenda também uma luz no convés ou no cockpit, discreta. Quem chega de bote precisa ver o barco na escuridão, e outro barco que se aproxima também.` },
        { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'fundeada', aspecto: 40, nomes: true }, legenda: 'Veja a luz de uma embarcação fundeada (e, ligando “dia”, a esfera diurna) de vários ângulos.' },
        { t: 'termos', ids: ["refletor-radar", "ais", "radar", "luz-de-fundeio", "sinais-de-perigo"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-055', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'O que o AIS não faz?',
            alternativas: ['Mostrar barcos que não têm AIS ligado', 'Mostrar o nome do outro barco', 'Calcular o ponto de maior aproximação', 'Transmitir a sua posição'],
            correta: 0,
            explicacao: 'O AIS só mostra quem transmite. Barcos sem transponder (pesqueiros pequenos, botes) ou com o aparelho desligado não aparecem. Nome, ponto de maior aproximação e transmissão da sua posição são funções normais.',
            referencia: 'Miguens, vol. III (AIS); NORMAM-211, programa do Mestre-Amador (n)', fonte_url: NORMAM },
          { id: 'vela-2-056', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Como chamar a atenção de um navio que parece não ter visto seu veleiro, sem pedir socorro?',
            alternativas: ['Apontar uma lanterna fixa para as suas velas, sem cegar a ponte', 'Usar a estroboscópica apontada para a ponte', 'Disparar um foguete vermelho', 'Acender todas as luzes de convés e apagar as de navegação'],
            correta: 0,
            explicacao: 'A Regra 36 manda evitar luzes intermitentes intensas ou rotativas (estroboscópicas) para chamar a atenção. Foguete vermelho é sinal de perigo, e o Anexo IV proíbe usá-lo fora de uma emergência. Apagar as luzes de navegação é infração.',
            referencia: 'RIPEAM-72, Regra 36 e Anexo IV', fonte_url: COLREG },
          { id: 'vela-2-057', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Por que o refletor radar deve ficar o mais alto possível e na posição indicada pelo fabricante?',
            alternativas: ['O radar do navio vê pelo horizonte e o refletor fora da posição perde eficiência', 'Para ficar longe da água', 'Porque a lei exige 5 m', 'Para o vento não o danificar'],
            correta: 0,
            explicacao: 'A altura aumenta o alcance e o refletor na posição indicada pelo fabricante (os tubulares, na vertical) devolve o sinal corretamente; fora dela, devolve menos. A lei exige o refletor em navegação costeira e oceânica, mas não fixa uma altura. O vento não é a razão.',
            referencia: 'NORMAM-211, art. 4.18.3; Miguens, vol. III (radar)', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 4.18.2 (lanterna portátil) e 4.18.3 (refletor radar)', url: NORMAM, ref: 'extra-vela-2-04' },
          { txt: 'RIPEAM-72, Regras 30 e 36; Anexo IV', url: COLREG, ref: 'tecnico-81' },
          { txt: 'World Sailing, Offshore Special Regulations: AIS e antena VHF', url: OSR, ref: 'travessia-16' },
        ] },
      ],
    },
    {
      id: 'l5',
      titulo: 'Segurança no convés à noite e chegada a um porto',
      minutos: 12,
      objetivos: [
        'Aplicar as regras de convés à noite (colete, tirante, aviso, uma mão no barco)',
        'Planejar a chegada a um porto à noite com balizamento IALA B',
        'Preparar o barco antes do pôr do sol',
      ],
      blocos: [
        { t: 'p', html: `A noite aumenta o risco de queda, e uma queda à noite é bem mais difícil de resolver. As regras de bordo da lição de prevenção do módulo 6 ficam mais estritas: <b>ninguém sai do cockpit sem estar preso e sem avisar</b>.` },
        { t: 'h', txt: 'Antes do pôr do sol' },
        { t: 'lista', ordenada: true, itens: [
          `<b>Reduza panos</b> (rizo) antes de escurecer: é mais fácil, mais seguro e não depende de ir à proa no escuro.`,
          `<b>Prepare o convés</b>: cabos arrumados, escotas no lugar, nada solto no cockpit, âncora e cabos presos.`,
          `<b>Lanterna e lanternas de reserva</b> no cockpit, mais luzes sobressalentes e fusíveis.`,
          `<b>Colete com luz e apito</b> vestido, e tirante pronto no cockpit.`,
          `<b>Cartas e plotagem</b> atualizadas, com a posição marcada; sinalize pontos de decisão (por exemplo, “virar aqui”).`,
          `<b>Comida quente e bebida</b> em garrafa térmica: facilita o primeiro quarto da noite.`,
          `<b>Combine</b> os horários, as condições para chamar o comandante e o plano para homem ao mar à noite.`,
        ] },
        { t: 'h', txt: 'No convés' },
        { t: 'lista', itens: [
          `<b>Uma mão no barco.</b> Mantenha sempre contato com o barco: uma mão no corrimão, no cabo de segurança ou na estrutura do barco, e ande abaixado.`,
          `<b>Prenda-se antes de sair</b> do cockpit. Troque de ponto de fixação sem soltar os dois mosquetões ao mesmo tempo.`,
          `<b>Avise.</b> “Vou à proa.” O timoneiro anota a hora e, se a pessoa demorar, chama.`,
          `<b>Luz mínima</b> no convés; a luz forte cega o timoneiro por minutos.`,
          `<b>Quem dorme no cockpit</b> também está preso.`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Homem ao mar à noite', html: `À noite, um homem ao mar é muito mais difícil de achar, como registra o estudo da US Sailing. Mantenha as luzes de convés acesas, pontos de luz no colete e uma boia com luz ao alcance do timoneiro. Treine a manobra à noite ao menos uma vez por ano.` },
        { t: 'h', txt: 'Balizamento à noite: o que as luzes dizem' },
        { t: 'p', html: `Quase tudo que você vê do balizamento à noite é luz. O Brasil usa a <b>Região B</b> da IALA: ao entrar num porto, <b>encarnada a boreste</b> e <b>verde a bombordo</b>.` },
        { t: 'fato', ref: 'tecnico-96', html: `Na Região B da IALA as cores laterais são invertidas em relação à Região A: encarnado a boreste e verde a bombordo.` },
        { t: 'fato', ref: 'tecnico-100', html: `Sinal lateral de bombordo (Região B): estrutura verde, tope cilíndrico, numeração par (branca) e luz verde.` },
        { t: 'fato', ref: 'tecnico-101', html: `Sinal lateral de boreste (Região B): estrutura encarnada, tope cônico, numeração ímpar (branca) e luz encarnada.` },
        { t: 'widget', w: 'boias-iala', opts: { modo: 'porto', modos: ['porto'], porto: 'conduzir', noite: true }, legenda: 'Entre num porto à noite, conduzindo o barco pelas luzes. Observe cor, ritmo e posição.' },
        { t: 'h', txt: 'Chegada a porto desconhecido à noite' },
        { t: 'lista', itens: [
          `<b>Se der, espere o dia.</b> Em muitos locais, um pouco de espera no mar ou em um fundeadouro conhecido é melhor que entrar no escuro.`,
          `<b>Estude antes</b> a carta, o roteiro e as luzes do local. Sabendo a característica de cada luz (cor, ritmo, período), você a identifica ao avistá-la.`,
          `<b>Chegue com tempo.</b> Calcule a hora com folga, para evitar maré contrária ou vento muito forte na barra.`,
          `<b>Reduza a velocidade</b> e conte com o motor pronto; ligue as luzes de motor e acenda a luz do convés.`,
          `<b>Um para o leme, um para a carta, um para a vigia.</b> Os três devem se comunicar o tempo todo.`,
          `<b>Confie nas marcações e nas sondas</b>, e use as luzes de terra com ceticismo: elas podem confundir com luzes de balizamento.`,
          `<b>Tenha um plano B</b>: se a entrada não parecer segura, volte para o mar ou para um fundeadouro de espera.`,
        ] },
        { t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Fl(3) W 15s 12M' }, legenda: 'Digite ou escolha uma característica de luz (como a que aparece na carta e na Lista de Faróis) e veja o ritmo e o significado.' },
        { t: 'termos', ids: ["balizamento", "iala-regiao-b", "marca-lateral", "caracteristica-da-luz", "lista-de-farois", "farol"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-058', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 1,
            enunciado: 'Na Região B da IALA, ao entrar num porto, em que lado fica a luz encarnada?',
            alternativas: ['A boreste', 'A bombordo', 'Sempre à vante', 'Depende do porto'],
            correta: 0,
            explicacao: 'Na Região B, usada no Brasil, o encarnado fica a boreste e o verde a bombordo, quando se entra no porto. Na Região A é o contrário.',
            referencia: 'IALA, Região B; Lista de Faróis (DHN), item 4.1', fonte_url: 'https://www.iala-aism.org/' },
          { id: 'vela-2-059', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Qual dos itens abaixo NÃO faz parte de um bom preparo do veleiro antes do pôr do sol?',
            alternativas: ['Deixar a decisão de reduzir panos para quando escurecer', 'Reduzir panos antes de escurecer', 'Arrumar escotas e cabos', 'Deixar o colete com luz e o tirante prontos'],
            correta: 0,
            explicacao: 'Reduzir panos antes de escurecer é mais seguro; deixar para o escuro obriga a ir à proa sem visibilidade. As outras alternativas são práticas recomendadas.',
            referencia: 'Boa prática marinheira; World Sailing, Offshore Special Regulations' },
          { id: 'vela-2-060', nivel: 'vela', tema: 'Velejar à noite', dificuldade: 2,
            enunciado: 'Por que, em geral, é melhor esperar o dia para entrar num porto desconhecido?',
            alternativas: ['Luzes de terra confundem com as de balizamento e os perigos ficam menos visíveis', 'O motor funciona melhor de dia', 'A lei proíbe entrar à noite', 'As boias só existem de dia'],
            correta: 0,
            explicacao: 'À noite fica difícil distinguir luzes de balizamento das de terra, e perigos sem luz ficam invisíveis. Não existe proibição geral para entrar à noite, nem boias só diurnas; o motor funciona igual.',
            referencia: 'Miguens, vol. I (navegação costeira noturna)' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'IALA, Sistema de Balizamento Marítimo, Região B; Lista de Faróis (DHN), item 4.1', url: 'https://www.iala-aism.org/', ref: 'tecnico-96' },
          { txt: 'US Sailing, estudo MOB 2020, item 8 (noite)', url: USS_MOB },
          { txt: 'World Sailing, Offshore Special Regulations: preparação do barco e treinamento', url: OSR, ref: 'travessia-42' },
        ] },
      ],
    },
  ],
});
M.push({
  id: 'm10',
  titulo: 'Escada de experiência e competências',
  resumo: `As habilitações da Marinha dizem o que você pode comandar; elas não dizem se você sabe comandar. Este módulo propõe uma escada de 12 degraus, do dingue ao comando de uma travessia transatlântica, com metas de milhas, noites e horas e um checklist de competências em cada degrau. As metas são <b>recomendação do app</b>, calibradas pelos benchmarks do RYA e da ASA, e <b>não são exigência legal</b>. Fecha com a caderneta de bordo: por que e como registrar suas milhas.`,
  licoes: [
    {
      id: 'l1',
      titulo: 'A escada: do dingue ao comandante transatlântico',
      minutos: 12,
      objetivos: [
        'Distinguir o que a lei exige do que a boa marinharia recomenda',
        'Conhecer os 12 degraus da escada e as metas de cada um',
        'Usar a escada para planejar o seu caminho, no seu ritmo',
      ],
      blocos: [
        { t: 'callout', tipo: 'nota', titulo: 'Leia isto primeiro: metas são recomendação, não lei', html: `A NORMAM-211 exige <b>habilitação</b> (CHA) e prova, mas <b>não exige experiência embarcada</b>: não pede milhas, dias ou noites de mar. As metas deste módulo foram escolhidas pelo app, com base em benchmarks de escolas e de entidades estrangeiras (RYA, ASA), para ajudá-lo a chegar ao comando de uma travessia com segurança. Cada pessoa evolui em um ritmo; o que vale é o que você sabe fazer, confirmado por um instrutor ou comandante experiente.` },
        { t: 'fato', ref: 'normas-49', html: `O único pré-requisito de experiência citado para Mestre-Amador e Capitão-Amador é ter a CHA da categoria anterior dentro da validade. A norma não fala em tempo mínimo de habilitação nem em milhas ou dias de mar.` },
        { t: 'fato', ref: 'normas-47', html: `Para o exame de Mestre-Amador o candidato deve ser habilitado como Arrais-Amador.` },
        { t: 'fato', ref: 'normas-48', html: `Para o exame de Capitão-Amador o candidato deve ter CHA de Mestre-Amador dentro da validade no ato da inscrição.` },
        { t: 'p', html: `Resumindo: a lei leva você de <b>Arrais</b> a <b>Mestre</b> a <b>Capitão</b> só com provas; a vida no mar exige mais. Ninguém deveria comandar uma travessia oceânica com as horas de um curso de fim de semana, mesmo com o diploma na mão. A escada abaixo preenche esse espaço.` },
        { t: 'figura', svg: svg('0 0 420 300', 'Escada de 12 degraus em três fases: fundamentos (1 a 3), costeiro (4 a 8) e oceânico (9 a 12)',
            '<rect x="0" y="0" width="420" height="300" fill="var(--sea-1)"/>' +
            '<g stroke="var(--ink)" stroke-width="1.6">' +
            '<rect x="20" y="238" width="30" height="22" fill="var(--sea-3)"/><rect x="50" y="222" width="30" height="38" fill="var(--sea-3)"/><rect x="80" y="206" width="30" height="54" fill="var(--sea-3)"/>' +
            '<rect x="110" y="190" width="30" height="70" fill="var(--sea-2)"/><rect x="140" y="174" width="30" height="86" fill="var(--sea-2)"/><rect x="170" y="158" width="30" height="102" fill="var(--sea-2)"/><rect x="200" y="142" width="30" height="118" fill="var(--sea-2)"/><rect x="230" y="126" width="30" height="134" fill="var(--sea-2)"/>' +
            '<rect x="260" y="110" width="30" height="150" fill="var(--land)"/><rect x="290" y="94" width="30" height="166" fill="var(--land)"/><rect x="320" y="78" width="30" height="182" fill="var(--land)"/><rect x="350" y="62" width="30" height="198" fill="var(--land)"/>' +
            '</g>' +
            num(35, 228, '1') + num(65, 212, '2') + num(95, 196, '3') + num(125, 180, '4') + num(155, 164, '5') + num(185, 148, '6') + num(215, 132, '7') + num(245, 116, '8') + num(275, 100, '9') + num(305, 84, '10') + num(335, 68, '11') + num(365, 52, '12') +
            '<g stroke="var(--magenta)" stroke-width="2.5" fill="none"><path d="M20 274 L110 274"/><path d="M110 274 L260 274"/><path d="M260 274 L380 274"/></g>' +
            t(65, 292, 'fundamentos', 14, 'middle') + t(185, 292, 'costeiro', 14, 'middle') + t(320, 292, 'oceânico', 14, 'middle') +
            t(24, 40, 'Cada degrau soma a experiência dos anteriores', 15)),
          legenda: `Os números 1 a 12 correspondem à tabela abaixo. As cores marcam as fases: fundamentos (azul-escuro), costeiro (azul-claro) e oceânico (terra).` },
        { t: 'h', txt: 'Os 12 degraus' },
        { t: 'tabela', cab: ['#', 'Degrau', 'Habilitação ou curso', 'Meta acumulada (recomendação do app)'], linhas: [
          ['1', 'Vela em barco pequeno', 'Curso de dingue ou monotipo', '20 horas na água'],
          ['2', 'Curso de cruzeiro como tripulante', 'Curso de 5 dias em veleiro de cruzeiro', '5 dias a bordo, 100 mn, 4 horas noturnas'],
          ['3', 'Arrais-Amador', 'CHA Arrais-Amador (ARA)', 'Treinamento de 6 h exigido pela norma; mais vela'],
          ['4', 'Milhas costeiras como tripulante', 'Embarcar em veleiros de amigos, clubes ou escolas', '15 dias, 300 mn, 8 horas noturnas'],
          ['5', 'Mestre-Amador', 'CHA Mestre-Amador (MSA)', 'Teoria de navegação costeira; sem milhas exigidas'],
          ['6', 'Comandante costeiro de dia', 'Comandar o barco em passeios diurnos', '25 dias, 500 mn, 3 dias como skipper'],
          ['7', 'Comandante costeiro à noite', 'Comandar com pernoite e chegada noturna', '30 dias, 800 mn, 12 h noturnas, 5 dias como skipper'],
          ['8', 'Travessias de 24 a 72 horas', 'Passagens de mais de 60 mn, com noites no mar', '50 dias, 2.500 mn, 5 passagens de mais de 60 mn (2 noturnas, 2 como skipper)'],
          ['9', 'Capitão-Amador', 'CHA Capitão-Amador (CPA)', 'Navegação astronômica e estimada; sem milhas exigidas'],
          ['10', 'Offshore acima de 500 mn como tripulante', 'Passagem com 3 ou mais noites seguidas', '1 passagem de mais de 500 mn; 3.500 mn no total'],
          ['11', 'Travessia oceânica como imediato', 'Responsável por quarto e pela navegação', '1 passagem de 600 mn ou mais, 96 h ou mais, com navegação astronômica no mar'],
          ['12', 'Transatlântica como comandante', 'Planejar e comandar a travessia', '5.000 mn no total; passagem oceânica como imediato; uma passagem de 600 mn ou mais como comandante antes'],
        ], legenda: 'Os números de milhas, dias e horas noturnas dos degraus 2, 4, 7, 8 e 11 foram calibrados nas exigências do RYA (veja a lição de benchmarks); o do degrau 6 fica entre o 4 e o 7. Todos são orientações do app.' },
        { t: 'h', txt: 'Como usar a escada' },
        { t: 'lista', itens: [
          `<b>Não pule degraus.</b> O oceano cobra a falta de cada um: quem não treinou o fundeio costeiro vai fundear mal numa ilha remota.`,
          `<b>Os degraus se sobrepõem.</b> Você pode estudar para o Mestre enquanto embarca como tripulante.`,
          `<b>Qualidade, não só quantidade.</b> Cem milhas com um bom comandante, em condições variadas, ensinam mais que 500 em calmaria.`,
          `<b>Varie as condições.</b> Maré, correnteza, vento forte, noite, nevoeiro e portos diferentes.`,
          `<b>Peça avaliação.</b> No fim de cada fase, peça a um instrutor ou comandante experiente que o observe fazendo as tarefas do checklist.`,
          `<b>Registre tudo</b> na caderneta de bordo (última lição do módulo).`,
        ] },
        { t: 'callout', tipo: 'seguranca', titulo: 'Habilitado não é preparado', html: `Muitos acidentes acontecem com pessoas habilitadas e com barcos em ordem, mas com experiência insuficiente para as condições do dia. A escada serve para crescer devagar, aumentando um pouco a dificuldade a cada passo. Quando surgir dúvida, a decisão mais segura é quase sempre adiar a saída.` },
        { t: 'termos', ids: ["cha", "arrais-amador", "mestre-amador", "capitao-amador", "navegacao-oceanica", "navegacao-costeira"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-061', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 1,
            enunciado: 'A NORMAM-211 exige um número mínimo de milhas náuticas navegadas para o exame de Mestre-Amador?',
            alternativas: ['Não: o único pré-requisito é ter a CHA de Arrais-Amador', 'Sim, 500 milhas', 'Sim, 100 dias de mar', 'Sim, cinco noites'],
            correta: 0,
            explicacao: 'A norma exige apenas a habilitação anterior (Arrais para Mestre; Mestre para Capitão); não cita milhas, dias ou noites. Qualquer número de milhas é recomendação de escola ou do app, não exigência legal.',
            referencia: 'NORMAM-211/DPC, Cap. 5 (requisitos para o exame)', fonte_url: NORMAM },
          { id: 'vela-2-062', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Por que o app propõe metas de milhas e noites, se a lei não as exige?',
            alternativas: ['Porque a habilitação prova conhecimento, não prática; as metas ajudam a construir experiência', 'Porque a Marinha cobra essas metas na prova prática', 'Porque o RYA obriga a seguir as metas do app', 'Porque sem as metas o CHA é cancelado'],
            correta: 0,
            explicacao: 'As metas servem para construir prática com segurança, e foram calibradas por referências como as do RYA. A prova da Marinha não cobra milhas, o RYA não obriga ninguém a seguir o app, e nenhum CHA é cancelado por falta delas.',
            referencia: 'NORMAM-211/DPC; RYA, Yachtmaster', fonte_url: RYA_QP },
          { id: 'vela-2-063', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Qual é a ordem correta de habilitações da Marinha no caminho do app?',
            alternativas: ['Arrais-Amador, Mestre-Amador, Capitão-Amador', 'Capitão-Amador, Mestre-Amador, Arrais-Amador', 'Mestre-Amador, Capitão-Amador, Arrais-Amador', 'Qualquer ordem, por equivalência'],
            correta: 0,
            explicacao: 'O Mestre exige o Arrais, e o Capitão exige o Mestre válido. Não há equivalência que permita pular.',
            referencia: 'NORMAM-211/DPC', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, requisitos para os exames de MSA e CPA', url: NORMAM, ref: 'normas-49' },
          { txt: 'RYA, Qualifying passages e exames Yachtmaster (benchmark das metas)', url: RYA_QP },
          { txt: 'PLAN.md do projeto, seção 5 (escada de experiência)' },
        ] },
      ],
    },
    {
      id: 'l2',
      titulo: 'Degraus 1 a 3: dos fundamentos ao Arrais-Amador',
      minutos: 12,
      objetivos: [
        'Planejar os primeiros 20 horas de vela e o curso de cruzeiro',
        'Saber o que o treinamento prático obrigatório do Arrais cobra',
        'Usar o checklist de competências de cada degrau',
      ],
      blocos: [
        { t: 'h', txt: 'Degrau 1: vela em barco pequeno' },
        { t: 'p', html: `O barco pequeno (dingue, optimist, laser, catamarã de praia ou monotipo) é a melhor escola: a escota responde na hora, o barco vira com um erro, e você sente o vento no corpo. A meta é cerca de <b>20 horas</b> na água.` },
        { t: 'lista', itens: [
          `Sei armar e desarmar o barco e conheço o nome das peças.`,
          `Governo o barco em <b>todos os pontos de vela</b> e sei quando a vela está bem regulada (birutas).`,
          `Cambo e dou jaibe sem perder o controle e sei parar o barco no vento (capear).`,
          `Sei voltar ao cais, pegar um objeto na água e socorrer o barco emborcado.`,
          `Dou os nós básicos: lais de guia, nó de oito, volta do fiel e nó direito.`,
          `Sei ler o vento e a previsão do dia e não saio com mais vento do que sei controlar.`,
        ] },
        { t: 'h', txt: 'Degrau 2: curso de cruzeiro como tripulante' },
        { t: 'p', html: `Um curso de 5 dias a bordo de um veleiro de cruzeiro (de escola ou clube) apresenta a vida a bordo. O benchmark do RYA para o próximo nível, o Day Skipper prático, pede <b>5 dias, 100 milhas e 4 horas noturnas</b> antes do curso, e é a base da meta deste degrau.` },
        { t: 'lista', itens: [
          `Sei as <b>funções de tripulante</b>: escotas, leme, vigia, fundeio, atracação, cozinha e limpeza.`,
          `Participo de manobras de cambar, jaibe, rizar e capear com voz de comando.`,
          `Faço uma atracação e um fundeio com instrução.`,
          `Faço quartos de vigia, de dia e de noite, sem enjoar demais, e sei lidar com o sono e o frio.`,
          `Conheço o equipamento de segurança, sei vestir o colete, prender o tirante e agir num homem ao mar (módulo 6).`,
          `Sei usar o VHF para uma chamada simples e o canal de socorro.`,
        ] },
        { t: 'h', txt: 'Degrau 3: Arrais-Amador' },
        { t: 'p', html: `A CHA de Arrais-Amador é o primeiro documento oficial. A prova tem a teoria; o treinamento prático obrigatório (atestado) é feito antes, com instrutor cadastrado.` },
        { t: 'fato', ref: 'normas-58', html: `O atestado de treinamento de Arrais-Amador exige no mínimo seis horas de treinamento teórico e prático.` },
        { t: 'fato', ref: 'normas-57', html: `A parte prática do treinamento de ARA tem 4 h, com a embarcação em movimento, e inclui demonstrações de luzes e regras de governo, ação do leme e hélice, atracação, desatracação, fundeio e suspender.` },
        { t: 'fato', ref: 'normas-50', html: `O exame de ARA, MSA e CPA é prova escrita ou eletrônica em português do Brasil, com idade mínima de 18 anos e exigência de saber ler e escrever.` },
        { t: 'lista', itens: [
          `Passo no estudo do curso Arrais-Amador e no simulado do app.`,
          `Faço o treinamento prático obrigatório e peço ao instrutor para repetir o que errei.`,
          `Entendo que o ARA permite navegar em águas interiores; para a costa, preciso do Mestre (degrau 5). Veja o módulo de habilitações no Roteiro.`,
        ] },
        { t: 'fato', ref: 'normas-26', html: `Arrais-Amador: apto a conduzir embarcações nos limites da navegação interior (áreas definidas nas NPCP/NPCF), exceto moto aquática.` },
        { t: 'callout', tipo: 'dica', titulo: 'Antes de passar de fase', html: `Peça a um instrutor para observá-lo atracando e fundeando, sozinho no comando, num dia de pouco vento. Se faltar algo, repita o degrau, sem pressa.` },
        { t: 'widget', w: 'nos', opts: { nos: ['lais-de-guia', 'oito', 'fiel', 'direito', 'cunho'], galeria: true, desafio: true }, legenda: 'Treine os nós básicos do degrau 1, passo a passo, e faça o desafio “qual nó usar?”.' },
        { t: 'termos', ids: ["arrais-amador", "atestado-de-treinamento", "etn", "navegacao-interior"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-064', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 1,
            enunciado: 'Qual é o tempo mínimo de treinamento (teórico e prático) exigido pelo atestado do Arrais-Amador?',
            alternativas: ['Seis horas', 'Duas horas', 'Vinte horas', 'Um dia inteiro (24 h)'],
            correta: 0,
            explicacao: 'O atestado exige no mínimo seis horas: 2 de teoria e 4 de prática. Duas horas é só a parte teórica; vinte horas e 24 h não são exigências da norma.',
            referencia: 'NORMAM-211/DPC, Anexo 5-A, Seção II', fonte_url: NORMAM },
          { id: 'vela-2-065', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Por que o barco pequeno (dingue) é uma boa escola para começar?',
            alternativas: ['A resposta ao vento e à escota é imediata, e o erro aparece na hora', 'Porque não exige conhecer o vento', 'Porque dispensa colete', 'Porque substitui o curso de cruzeiro'],
            correta: 0,
            explicacao: 'No barco pequeno, o feedback é imediato, o que acelera o aprendizado de regulagem e de governo. Ele exige conhecer o vento, exige colete e não substitui a experiência de cruzeiro com tripulação.',
            referencia: 'RYA, Start Yachting; ensino de vela em barcos pequenos' },
          { id: 'vela-2-066', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Qual é a idade mínima para o exame de Arrais-Amador, Mestre-Amador e Capitão-Amador?',
            alternativas: ['18 anos', '16 anos', '21 anos', '12 anos'],
            correta: 0,
            explicacao: 'O exame exige 18 anos e saber ler e escrever. 16 anos é a idade mínima para vários cursos e exames do RYA; 21 e 12 não são os da norma.',
            referencia: 'NORMAM-211/DPC, Cap. 5', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, treinamento e exame do Arrais-Amador', url: NORMAM, ref: 'normas-58' },
          { txt: 'RYA, Day Skipper Practical (sail): pré-requisitos', url: 'https://www.rya.org.uk/course-finder/day-skipper-practical-sailing/', ref: 'internacional-09' },
        ] },
      ],
    },
    {
      id: 'l3',
      titulo: 'Degraus 4 a 7: costeiro, Mestre-Amador e comando diurno e noturno',
      minutos: 14,
      objetivos: [
        'Planejar milhas costeiras como tripulante e o salto para o comando',
        'Usar o checklist do comandante costeiro de dia e à noite',
        'Saber o que a habilitação de Mestre-Amador permite',
      ],
      blocos: [
        { t: 'h', txt: 'Degrau 4: milhas costeiras como tripulante' },
        { t: 'p', html: `Embarque em veleiros de amigos, clubes, escolas e regatas, em funções cada vez mais responsáveis. Meta: <b>15 dias de mar, 300 milhas e 8 horas noturnas</b>, que são os números de entrada do curso Coastal Skipper do RYA. Aproveite cada embarque para aprender uma coisa nova do comandante.` },
        { t: 'lista', itens: [
          `Navego com <b>carta e GPS</b>, plotando posição, rumo e distância com régua e compasso, e confiro o GPS pela carta.`,
          `Uso a <b>tábua das marés</b> e sei estimar a altura e a corrente de maré.`,
          `Planejo uma passagem com previsão do tempo, marés, portos de abrigo e plano B.`,
          `Navego em <b>marinas e portos</b> diferentes e aprendo a ler o local.`,
          `Faço quartos de vigia, de dia e de noite, e participo das trocas de vela em condições variadas.`,
        ] },
        { t: 'h', txt: 'Degrau 5: Mestre-Amador' },
        { t: 'p', html: `A CHA de Mestre-Amador permite a navegação costeira: entre portos nacionais e estrangeiros, dentro dos limites de visibilidade da costa e sem exceder 20 milhas náuticas.` },
        { t: 'fato', ref: 'normas-25', html: `Mestre-Amador: apto a conduzir embarcações entre portos nacionais e estrangeiros nos limites da navegação costeira (até 20 MN), exceto moto aquática.` },
        { t: 'lista', itens: [
          `Sei resolver os problemas da prova com carta: posição, rumo, marcações, corrente, marés.`,
          `Sei fazer a <b>navegação costeira</b> em tempo real, e não só no papel.`,
          `Conheço o balizamento IALA B, as luzes e os sinais, e as regras de governo.`,
        ] },
        { t: 'h', txt: 'Degrau 6: comandante costeiro de dia' },
        { t: 'p', html: `Assumir o comando muda tudo: você decide e responde pelo barco e pela tripulação. Comece com passeios diurnos, em águas conhecidas, com tempo bom, e peça a um amigo experiente para ir a bordo como segunda opinião. Meta: <b>25 dias, 500 milhas e 3 dias como comandante</b>.` },
        { t: 'lista', itens: [
          `Faço o <b>briefing de segurança</b> antes de sair: colete, tirante, extintor, rádio, plano de homem ao mar.`,
          `Entrego o plano de navegação e o aviso de saída.`,
          `Saio e chego de marina, de fundeadouro e de poita sem ajuda do instrutor (módulos 7 e 8).`,
          `Tomo decisões de redução de panos e de volta cedo, antes da necessidade.`,
          `Gerencio a tripulação, inclusive pessoas inexperientes, atribuindo tarefas seguras.`,
        ] },
        { t: 'h', txt: 'Degrau 7: comandante costeiro à noite' },
        { t: 'p', html: `O próximo passo é incluir a noite: saídas ao anoitecer, pernoites em fundeadouro e chegadas após o pôr do sol. Meta: <b>30 dias, 800 milhas, 12 horas noturnas e 5 dias como comandante</b>. Os três primeiros números são os do exame Yachtmaster Coastal do RYA, que pede 2 dias como skipper; o app sobe para 5 porque este degrau é o de assumir o comando.` },
        { t: 'lista', itens: [
          `Mostro as <b>luzes corretas</b> a vela, a motor e fundeado (módulo 9).`,
          `Planejo as <b>chegadas noturnas</b> com luzes identificadas na carta e na Lista de Faróis.`,
          `Organizo <b>quartos curtos</b> e tenho regras claras de vigia e de convés.`,
          `Treino homem ao mar à noite com um objeto.`,
          `Tenho um fundeio seguro, com alarme de GPS e marcações.`,
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Peça uma avaliação', html: `Ao fim do degrau 7, pergunte a um comandante experiente se ele embarcaria com você como tripulante. Se a resposta for sim, e vier com observações do que melhorar, você está no caminho certo.` },
        { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'marcacoes' }, legenda: 'Pratique a navegação costeira numa carta de treino: posição por marcações, rumos e distâncias.' },
        { t: 'termos', ids: ["mestre-amador", "navegacao-costeira", "tabua-das-mares", "lista-de-farois"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-067', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 1,
            enunciado: 'Até que distância da costa a CHA de Mestre-Amador permite navegar?',
            alternativas: ['Até 20 milhas náuticas, à vista da costa', 'Até 200 milhas náuticas', 'Sem limite', 'Apenas em águas interiores'],
            correta: 0,
            explicacao: 'O Mestre-Amador permite a navegação costeira, dentro do limite de visibilidade da costa e sem exceder 20 MN. Sem limite é o Capitão-Amador; águas interiores é o Arrais-Amador. 200 MN não consta.',
            referencia: 'NORMAM-211/DPC, art. 4.7 e 5.3', fonte_url: NORMAM },
          { id: 'vela-2-068', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'No degrau 6 (comandante costeiro de dia), qual é a prática mais segura?',
            alternativas: ['Começar com passeios diurnos, em águas conhecidas e tempo bom', 'Começar com uma travessia noturna para ganhar tempo', 'Dispensar o briefing de segurança em passeios curtos', 'Evitar ter um amigo experiente a bordo'],
            correta: 0,
            explicacao: 'Aumentar a dificuldade aos poucos é a base da escada. O briefing de segurança vale para passeios curtos também, e um amigo experiente é uma segunda opinião útil.',
            referencia: 'RYA, Day Skipper/Coastal Skipper; boa prática marinheira' },
          { id: 'vela-2-069', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'O que a escada do app entende por “comandante costeiro à noite” (degrau 7)?',
            alternativas: ['Quem comanda com pernoite e chegadas noturnas, com luzes, vigia e fundeio corretos', 'Quem entrou em porto à noite uma vez, com ajuda', 'Quem só viaja de dia', 'Quem só navega a motor'],
            correta: 0,
            explicacao: 'O degrau 7 junta luzes corretas, planejamento de chegadas noturnas, quartos curtos e fundeio seguro. Uma entrada com ajuda ou navegação só de dia não fecha o degrau.',
            referencia: 'RYA, Yachtmaster Coastal (referência)', fonte_url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-coastal-exam/' },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 5.3: atribuições do Mestre-Amador', url: NORMAM, ref: 'normas-25' },
          { txt: 'RYA, Coastal Skipper Practical e Yachtmaster Coastal: pré-requisitos', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-coastal-exam/', ref: 'internacional-14' },
        ] },
      ],
    },
    {
      id: 'l4',
      titulo: 'Degraus 8 a 12: travessias, Capitão-Amador e a transatlântica',
      minutos: 15,
      objetivos: [
        'Planejar o crescimento de 24 a 72 h até a travessia oceânica',
        'Saber o que a CHA de Capitão-Amador permite e exige',
        'Montar o checklist de competências do comandante oceânico',
      ],
      blocos: [
        { t: 'h', txt: 'Degrau 8: travessias de 24 a 72 horas' },
        { t: 'p', html: `Passagens de 24 a 72 horas, com noites no mar, são o laboratório do oceano: sono, comida, enjoo, tempo, avarias pequenas e relação entre pessoas. Meta: <b>50 dias de mar, 2.500 milhas, 5 passagens de mais de 60 milhas (2 noturnas, 2 como comandante)</b> e 5 dias como comandante, que são os números do exame Yachtmaster Offshore do RYA.` },
        { t: 'lista', itens: [
          `Planejo uma passagem com <b>previsão de 3 a 5 dias</b>, comparo modelos e escolho a janela de tempo.`,
          `Faço a <b>navegação estimada</b> com atualização regular da posição e plano para falha do GPS.`,
          `Gerencio <b>quartos e descanso</b> de tripulação de 3 a 5 pessoas.`,
          `Trato <b>enjoo, desidratação e frio</b>, e sei o básico de primeiros socorros e de comunicação com apoio médico.`,
          `Reduzo panos com cuidado, capeio, e sei o que fazer se o tempo piorar (rota de fuga, porto de abrigo).`,
          `Resolvo avarias comuns: cabo no hélice, vela rasgada, escota partida, falha de bateria.`,
        ] },
        { t: 'h', txt: 'Degrau 9: Capitão-Amador' },
        { t: 'fato', ref: 'normas-24', html: `Capitão-Amador: apto a conduzir embarcações entre portos nacionais e estrangeiros, sem limite de afastamento da costa, exceto moto aquática.` },
        { t: 'p', html: `A CHA de Capitão-Amador é a habilitação legal para a navegação oceânica. Ela não substitui a experiência: o degrau 9 é um marco legal, e os degraus 10 a 12 são práticos.` },
        { t: 'fato', ref: 'programa-24', html: `O programa da prova de Capitão-Amador tem sete assuntos: navegação astronômica, navegação eletrônica, estabilidade, meteorologia e oceanografia, comunicações, sobrevivência no mar, e carta náutica e publicações.` },
        { t: 'lista', itens: [
          `Resolvo reta de altura e latitude meridiana com o Almanaque Náutico.`,
          `Entendo <b>derrota ortodrômica e loxodrômica</b> e o planejamento de rotas oceânicas.`,
          `Sei ler cartas sinóticas e boletins do Serviço Meteorológico Marinho.`,
          `Conheço o <b>GMDSS</b>, a EPIRB e os procedimentos de socorro.`,
        ] },
        { t: 'h', txt: 'Degrau 10: offshore de mais de 500 milhas como tripulante' },
        { t: 'p', html: `Embarque em uma passagem de 500 milhas ou mais (por exemplo, uma regata oceânica, uma entrega de barco ou um cruzeiro longo) em função de tripulante. Meta: <b>1 passagem de mais de 500 milhas e 3.500 milhas no total</b>. É a primeira vez em que a rotina de bordo (quartos, comida, sono, troca de turno) passa a ser seu cotidiano por 3 a 5 dias.` },
        { t: 'lista', itens: [
          `Aguento <b>3 ou mais noites seguidas</b> em quartos, com cuidado com o corpo.`,
          `Faço <b>reparos de bordo</b> e aprendo a manter o barco.`,
          `Observo como o comandante decide quando o tempo muda.`,
        ] },
        { t: 'h', txt: 'Degrau 11: travessia oceânica como imediato' },
        { t: 'p', html: `Ser imediato é ser o segundo no comando: responsável por um quarto e pela navegação. O benchmark do RYA Yachtmaster Ocean pede uma passagem de <b>pelo menos 600 milhas e 96 horas</b>, com ao menos 200 milhas delas a mais de 50 milhas de terra, como comandante ou responsável por quarto, e navegação astronômica feita no mar.` },
        { t: 'lista', itens: [
          `Faço a <b>navegação astronômica</b> no mar: meridiana do Sol e verificação da agulha pelos astros, comparando com o GPS.`,
          `Assumo um quarto inteiro, com decisões de rumo, velas e tráfego.`,
          `Acompanho o planejamento da passagem, a meteorologia e a preparação do barco.`,
          `Participo da gestão de suprimentos: água, comida, combustível, energia.`,
        ] },
        { t: 'h', txt: 'Degrau 12: transatlântica como comandante' },
        { t: 'p', html: `A transatlântica é o ponto de chegada. Antes de assumi-la, é prudente já ter comandado uma passagem de 600 milhas ou mais, com tripulação, e passado por mau tempo. O grau de preparação do barco é tão importante quanto o do comandante.` },
        { t: 'tabela', cab: ['Área', 'O que o comandante oceânico domina'], linhas: [
          ['Planejamento', 'Janela de tempo, rotas (cartas piloto, ventos e correntes), portos de arribada, plano de contingência'],
          ['Barco', 'Revisão completa: velame, cordame, motor, leme de emergência, bomba, baterias e energia, gás'],
          ['Segurança', 'Balsa, EPIRB registrada, coletes, tirantes, AIS pessoal, extintores, kit de primeiros socorros, treino anual de homem ao mar'],
          ['Comunicações', 'VHF com DSC, HF ou satélite, previsão do tempo a bordo, rotina de contato com terra'],
          ['Tripulação', 'Escolha e treinamento, quartos, regras de convés, resolução de conflitos'],
          ['Documentos', 'CHA Capitão-Amador, TIE da embarcação, licença de estação, seguro, despacho e documentos de imigração dos países de destino'],
        ], legenda: 'Os detalhes de equipamento e documentos estão nos cursos de Travessia oceânica e de Rádio e segurança.' },
        { t: 'fato', ref: 'travessia-114', html: `Na navegação oceânica a embarcação deve ter balsas salva-vidas infláveis para 100% das pessoas a bordo, podendo ser classe II.` },
        { t: 'fato', ref: 'radio-26', html: `Na tabela de navegação oceânica da NORMAM-211, a EPIRB 406 MHz é obrigatória, e na inspeção naval se verificam o funcionamento, a validade das baterias e o registro atualizado no INFOSAR.` },
        { t: 'fato', ref: 'travessia-42', html: `Em todas as categorias das regras da World Sailing, ao menos uma vez por ano a tripulação deve praticar recuperação de homem ao mar e abandono da embarcação.` },
        { t: 'callout', tipo: 'seguranca', titulo: 'A decisão mais importante é a de não sair', html: `Um comandante experiente sabe esperar. Adiar a saída por uma janela de tempo melhor custa dias; o oposto pode custar o barco. A meta de milhas ajuda a construir esse julgamento, mas ele só existe quando é praticado.` },
        { t: 'widget', w: 'globo-rotas', opts: { preset: 'natal-mindelo', ventos: true }, legenda: 'Uma travessia real do Nordeste do Brasil para Cabo Verde, com a ortodrômica, a loxodrômica e a camada esquemática de ventos. Não use para planejar: serve para entender o tamanho do degrau 12.' },
        { t: 'termos', ids: ["capitao-amador", "navegacao-oceanica", "navegacao-astronomica", "passagem-meridiana", "epirb", "infosar"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-070', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 1,
            enunciado: 'A CHA de Capitão-Amador permite navegar:',
            alternativas: ['Entre portos nacionais e estrangeiros, sem limite de afastamento da costa', 'Só até 20 milhas da costa', 'Só em águas interiores', 'Só em águas nacionais'],
            correta: 0,
            explicacao: 'O Capitão-Amador é apto para navegação oceânica, sem limite de afastamento. 20 MN é o limite do Mestre-Amador; águas interiores é o Arrais.',
            referencia: 'NORMAM-211/DPC, art. 5.3', fonte_url: NORMAM },
          { id: 'vela-2-071', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Na escada do app, qual degrau envolve fazer a navegação astronômica no mar?',
            alternativas: ['Travessia oceânica como imediato (11)', 'Vela em barco pequeno (1)', 'Arrais-Amador (3)', 'Comandante costeiro de dia (6)'],
            correta: 0,
            explicacao: 'O degrau 11 junta a passagem de 600 milhas ou mais, a responsabilidade por quarto e a navegação astronômica no mar. Os outros degraus são anteriores ou não envolvem astronomia.',
            referencia: 'RYA, Yachtmaster Ocean', fonte_url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/' },
          { id: 'vela-2-072', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'A EPIRB 406 MHz, para a navegação oceânica pela NORMAM-211, deve estar:',
            alternativas: ['Funcionando, com baterias dentro da validade e registrada no INFOSAR', 'Guardada desligada, sem registro', 'Instalada apenas se o barco tiver mais de 20 m', 'Registrada só no país de fabricação'],
            correta: 0,
            explicacao: 'Na inspeção naval, verificam-se funcionamento, validade das baterias e registro atualizado no INFOSAR. Os demais itens não correspondem à norma.',
            referencia: 'NORMAM-211/DPC, Cap. 4 (equipamentos)', fonte_url: NORMAM },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, art. 5.3 e Cap. 4 (equipamentos de navegação oceânica)', url: NORMAM, ref: 'normas-24' },
          { txt: 'RYA, Yachtmaster Offshore e Ocean: pré-requisitos', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/', ref: 'internacional-33' },
          { txt: 'World Sailing, Offshore Special Regulations 2026–2027 (extrato Mo)', url: OSR, ref: 'travessia-42' },
        ] },
      ],
    },
    {
      id: 'l5',
      intl: true,
      titulo: 'Benchmarks internacionais: RYA e ASA',
      minutos: 12,
      objetivos: [
        'Conhecer os pré-requisitos de Day Skipper, Coastal Skipper, Yachtmaster Offshore e Ocean',
        'Comparar com os degraus da escada do app',
        'Saber o que a ASA exige no 108 (Offshore Passagemaking)',
      ],
      blocos: [
        { t: 'callout', tipo: 'intl', titulo: 'Trilha internacional', html: `O RYA (Reino Unido) e a ASA (Estados Unidos) não conferem habilitação para navegar no Brasil (veja a regra da NORMAM-211 logo abaixo). Mas seus números são ótimos <b>benchmarks</b> de experiência e valem para fretar barcos no exterior.`, intl: true },
        { t: 'fato', ref: 'normas-129', html: `Sobre habilitações estrangeiras: a NORMAM-211 não concede CHA por equivalência a nenhuma delas. Quem quiser a CHA começa pelo Arrais-Amador e cumpre todo o rito do art. 5.4.` },
        { t: 'p', intl: true, html: `O RYA distingue <b>cursos práticos</b> (Competent Crew, Day Skipper, Coastal Skipper) e <b>certificados de competência</b> (Yachtmaster Coastal, Offshore e Ocean), que são exames feitos depois de cumprido o tempo de mar. O app usou essas exigências para calibrar a escada.` },
        { t: 'tabela', intl: true, cab: ['Etapa RYA', 'Pré-requisitos de experiência (vela)', 'Degrau do app'], linhas: [
          ['Competent Crew', 'Nenhuma experiência', '2'],
          ['Day Skipper Practical', '5 dias, 100 milhas e 4 horas noturnas; teoria Day Skipper; idade mínima 16', '2 a 4'],
          ['Coastal Skipper Practical', '15 dias, 2 dias como skipper, 300 milhas, 8 horas noturnas; idade mínima 17', '4 a 6'],
          ['Yachtmaster Coastal (exame)', '30 dias de mar (12 com o Coastal Skipper), 2 dias como skipper, 800 milhas (400 com o Coastal Skipper), 12 horas noturnas; idade mínima 17', '7'],
          ['Yachtmaster Offshore (exame)', '50 dias de mar, 5 dias como skipper, 2.500 milhas, 5 passagens de mais de 60 milhas (2 noturnas, 2 como skipper); idade mínima 18', '8'],
          ['Yachtmaster Ocean (exame)', 'Já ter o Yachtmaster Offshore; passagem de 600 milhas ou mais (200 delas a mais de 50 milhas de terra) e 96 horas ou mais, como skipper ou responsável por quarto; navegação astronômica no mar', '11'],
        ], legenda: 'Fonte: RYA (consultado em 2026-10-07). Os números do Yachtmaster valem para os últimos 10 anos.' },
        { t: 'fato', intl: true, ref: 'internacional-09', html: `Pré-requisitos do RYA Day Skipper Practical (vela): habilidade básica de vela; 5 dias, 100 milhas e 4 horas noturnas a bordo de veleiro; conhecimento de navegação/teoria no nível Day Skipper Shorebased.` },
        { t: 'fato', intl: true, ref: 'internacional-14', html: `Pré-requisitos do RYA Coastal Skipper Practical (vela): 15 dias de mar, 2 dias como skipper, 300 milhas e 8 horas noturnas; idade mínima 17.` },
        { t: 'fato', intl: true, ref: 'internacional-29', html: `O RYA Yachtmaster Offshore certifica competência para comandar um barco de cruzeiro em qualquer passagem em que ele fique a no máximo 150 milhas de um porto, de dia ou de noite.` },
        { t: 'fato', intl: true, ref: 'internacional-30', html: `Exame Yachtmaster Offshore: 50 dias de mar (em iates de até 500 GT) nos últimos 10 anos.` },
        { t: 'fato', intl: true, ref: 'internacional-32', html: `Exame Yachtmaster Offshore: 2.500 milhas navegadas (em iates de até 500 GT).` },
        { t: 'fato', intl: true, ref: 'internacional-33', html: `Exame Yachtmaster Offshore: 5 passagens de mais de 60 milhas, incluindo 2 noturnas (overnight) e 2 como skipper.` },
        { t: 'fato', intl: true, ref: 'internacional-40', html: `O RYA Yachtmaster Ocean certifica experiência e competência para comandar embarcação de até 200 GT em passagens de qualquer extensão, em qualquer parte do mundo.` },
        { t: 'fato', intl: true, ref: 'internacional-41', html: `A passagem qualificante do Yachtmaster Ocean deve ter no mínimo 600 milhas, das quais ao menos 200 a mais de 50 milhas de terra ou de objetos cartografados úteis à navegação.` },
        { t: 'fato', intl: true, ref: 'internacional-42', html: `A passagem qualificante do Yachtmaster Ocean deve durar no mínimo 96 horas.` },
        { t: 'fato', intl: true, ref: 'internacional-44', html: `O candidato ao Yachtmaster Ocean deve ter navegado um iate no mar por navegação astronômica (no mínimo meridiana/sun-run-sun e verificação de agulha por astro).` },
        { t: 'h', intl: true, txt: 'ASA: o caminho americano até o 108' },
        { t: 'p', intl: true, html: `A ASA (American Sailing Association) usa uma sequência de certificações numeradas. A mais próxima de uma travessia é a 108, <b>Offshore Passagemaking</b>.` },
        { t: 'lista', intl: true, itens: [
          `<b>ASA 103</b> (cruzeiro costeiro): barcos de 25 a 35 pés, de dia, vento até 20 nós; recomenda 24 horas de vela antes.`,
          `<b>ASA 104</b> (bareboat): barcos de 30 a 45 pés em cruzeiro de vários dias, vento até 30 nós; recomenda 80 horas de vela antes.`,
          `<b>ASA 106</b> (cruzeiro costeiro avançado): passagem de pelo menos 48 h, incluindo 24 h contínuas, até 200 milhas da costa.`,
          `<b>ASA 108</b> (passagem offshore): passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra, e planejamento de uma travessia do Atlântico Norte ou do Pacífico.`,
        ] },
        { t: 'fato', intl: true, ref: 'internacional-141', html: `Entre as habilidades do ASA 108 está atuar como skipper e tripulante numa passagem oceânica de no mínimo 72 horas e 100 milhas sem tocar terra.` },
        { t: 'fato', intl: true, ref: 'internacional-132', html: `A ASA recomenda no mínimo 80 horas de vela na água antes do ASA 104.` },
        { t: 'callout', tipo: 'intl', titulo: 'Os números do RYA e da ASA são bem diferentes', html: `Compare: a ASA 108 pede uma passagem de 72 h e 100 milhas, e o RYA Yachtmaster Offshore, 2.500 milhas e 50 dias no total. Isso mostra que não há padrão único. Use os números mais exigentes como meta de conforto, não de aprovação.`, intl: true },
        { t: 'figura', intl: true, svg: svg('0 0 440 260', 'Gráfico de barras com as milhas pedidas pelo RYA: Day Skipper 100, Coastal Skipper 300, Yachtmaster Coastal 800, Ocean 600 em uma só passagem, Offshore 2.500',
            '<rect x="0" y="0" width="440" height="260" fill="var(--sea-1)"/>' +
            t(12, 24, 'Azul: milhas acumuladas. Magenta: uma passagem.', 16, 'start') +
            '<rect x="156" y="44" width="7.6" height="26" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(150, 63, 'Day Skipper', 16, 'end') + t(169.6, 63, '100 mn', 16, 'start') +
            '<rect x="156" y="82" width="22.8" height="26" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(150, 101, 'Coastal Skipper', 16, 'end') + t(184.8, 101, '300 mn', 16, 'start') +
            '<rect x="156" y="120" width="60.8" height="26" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(150, 139, 'YM Coastal', 16, 'end') + t(222.8, 139, '800 mn', 16, 'start') +
            '<rect x="156" y="158" width="45.6" height="26" fill="var(--magenta)" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(150, 177, 'Ocean: 1 passagem', 16, 'end') + t(207.6, 177, '600 mn', 16, 'start') +
            '<rect x="156" y="196" width="190.0" height="26" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(150, 215, 'YM Offshore', 16, 'end') + t(352.0, 215, '2.500 mn', 16, 'start') +
            t(220, 250, 'YM = Yachtmaster. Valores mínimos do RYA.', 16, 'middle')),
          legenda: `Comparação das milhas pedidas pelo RYA. As barras azuis são milhas acumuladas de experiência; a barra magenta é uma única passagem qualificante (Yachtmaster Ocean). Fonte: RYA, consultado em 2026-10-07.` },
        { t: 'check', intl: true, titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-073', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2, intl: true,
            enunciado: 'Qual é a passagem qualificante mínima para o RYA Yachtmaster Ocean?',
            alternativas: ['600 milhas ou mais e 96 horas ou mais, como skipper ou responsável por quarto', '100 milhas e 24 horas', '60 milhas e 12 horas', '2.500 milhas em qualquer tempo'],
            correta: 0,
            explicacao: 'O Yachtmaster Ocean pede uma passagem de 600 milhas ou mais (200 delas a mais de 50 milhas de terra) e 96 horas ou mais, além de navegação astronômica no mar. 2.500 milhas é o total de milhas do Offshore. As outras não correspondem.',
            referencia: 'RYA, Yachtmaster Ocean exam', fonte_url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/' },
          { id: 'vela-2-074', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2, intl: true,
            enunciado: 'Um brasileiro com ASA 108 pode pedir a CHA de Capitão-Amador por equivalência?',
            alternativas: ['Não: a NORMAM-211 proíbe conceder CHA por equivalência a habilitações estrangeiras', 'Sim, em qualquer Capitania', 'Sim, mas só para o Mestre-Amador', 'Sim, se tiver o RYA Yachtmaster também'],
            correta: 0,
            explicacao: 'A norma proíbe a equivalência: quem quer a CHA começa pelo Arrais-Amador. Certificados estrangeiros servem como prova de experiência ou para fretar no exterior, não como CHA no Brasil.',
            referencia: 'NORMAM-211/DPC (equivalências)', fonte_url: NORMAM },
          { id: 'vela-2-075', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 3, intl: true,
            enunciado: 'Qual item compõe o exame RYA Yachtmaster Offshore?',
            alternativas: ['5 passagens de mais de 60 milhas, incluindo 2 noturnas e 2 como skipper', '1 passagem de 600 milhas', '3 passagens de 20 milhas', 'Nenhuma passagem, só teoria'],
            correta: 0,
            explicacao: 'O Offshore pede 50 dias de mar, 5 dias como skipper, 2.500 milhas e 5 passagens de mais de 60 milhas (2 noturnas e 2 como skipper). A passagem de 600 milhas é do Ocean.',
            referencia: 'RYA, Yachtmaster Offshore exam', fonte_url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/' },
        ] },
        { t: 'fontes', intl: true, itens: [
          { txt: 'RYA, Yachtmaster Offshore exam', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/', ref: 'internacional-33' },
          { txt: 'RYA, Yachtmaster Ocean exam', url: 'https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/', ref: 'internacional-41' },
          { txt: 'American Sailing Association, certificações 103 a 108', url: 'https://americansailing.com/', ref: 'internacional-141' },
        ] },
      ],
    },
    {
      id: 'l6',
      titulo: 'Caderneta de bordo: por que e como registrar suas milhas',
      minutos: 10,
      objetivos: [
        'Explicar para que serve uma caderneta de bordo (logbook) pessoal',
        'Registrar milhas, dias, noites e funções de forma verificável',
        'Aplicar as definições de dia a bordo, passagem e skipper do RYA',
      ],
      blocos: [
        { t: 'p', html: `A <b>caderneta de bordo pessoal</b> (<i>logbook</i>) é o seu histórico de navegação: cada saída, com data, barco, distância, condições e a sua função a bordo. Ela é diferente do diário de bordo do barco (onde o comandante registra a navegação e os eventos do dia). A caderneta é sua, e a levará a cada barco que você embarcar.` },
        { t: 'callout', tipo: 'nota', titulo: 'Não é exigência legal', html: `A NORMAM-211 não pede milhas nem registro de experiência para o exame de Mestre ou de Capitão (normas-49 acima). A caderneta é uma boa prática pessoal, que também é exigida por entidades estrangeiras para certificar competência.` },
        { t: 'h', txt: 'Para que serve' },
        { t: 'lista', itens: [
          `<b>Prova de experiência</b> para comandantes de barcos que o convidarem como tripulante, para empresas de charter e para seguradoras.`,
          `<b>Acompanhamento do seu progresso</b> na escada: você vê quanto falta para a próxima meta.`,
          `<b>Aprendizado:</b> escrever o que deu certo e o que deu errado depois de cada saída fixa a lição.`,
          `<b>Exames estrangeiros.</b> O RYA e a ASA pedem registro de milhas e de dias para os exames (veja a lição anterior).`,
        ] },
        { t: 'h', txt: 'Como registrar' },
        { t: 'tabela', cab: ['Campo', 'O que anotar', 'Por quê'], linhas: [
          ['Data e hora', 'Saída e chegada', 'Calcula dias e horas noturnas'],
          ['Barco', 'Nome, tipo, comprimento (em pés ou metros) e dono ou escola', 'Mostra a experiência por tamanho de barco'],
          ['Rota', 'Porto de saída e chegada, distância navegada e planejada', 'Para contar milhas e passagens'],
          ['Milhas', 'Milhas navegadas, pelo odômetro (log) ou pelo GPS', 'Soma por categoria'],
          ['Horas', 'Horas de mar, horas noturnas e horas a motor', 'Distingue vela de motor'],
          ['Função', 'Tripulante, responsável por quarto, imediato ou comandante', 'Importante para contar dias como comandante'],
          ['Condições', 'Vento, mar, visibilidade e maré', 'Mostra variedade de experiência'],
          ['Comentários', 'O que fez, o que aprendeu, o que errou', 'Aprendizado'],
          ['Assinatura', 'Do comandante ou do instrutor', 'Dá credibilidade à anotação'],
        ], legenda: 'Um caderno simples ou uma planilha serve. O mais importante é anotar logo depois da saída, enquanto os detalhes estão frescos.' },
        { t: 'h', txt: 'Definições que importam (RYA)' },
        { t: 'p', intl: true, html: `Se você pretende fazer um exame do RYA, siga as definições deles ao contar a experiência:` },
        { t: 'fato', intl: true, ref: 'internacional-51', html: `Para o RYA, um “dia a bordo” (ou como skipper) é um período de 8 horas consecutivas vivendo a bordo, a maior parte com o barco no mar; só um período conta a cada 24 h.` },
        { t: 'fato', intl: true, ref: 'internacional-52', html: `Para o RYA, “passagem” é uma viagem contínua, sem paradas, de um porto ou abrigo de partida a um porto ou abrigo de destino; a distância é a da rota navegável mais curta planejada.` },
        { t: 'fato', intl: true, ref: 'internacional-53', html: `Se a função de skipper for transferida durante a passagem, nenhuma das duas pessoas pode registrá-la como passagem feita como skipper.` },
        { t: 'fato', intl: true, ref: 'internacional-124', html: `A certificação ASA vale por toda a vida a partir da assinatura do instrutor no logbook.` },
        { t: 'lista', itens: [
          `<b>Seja honesto.</b> Conte só o que aconteceu de verdade, sem arredondar para cima.`,
          `<b>Milhas navegadas</b> e não milhas em linha reta, e <b>milhas a vela</b> separadas das milhas a motor, quando a meta pedir vela.`,
          `<b>Peça a assinatura</b> do comandante logo no final da viagem, enquanto ele lembra.`,
          `<b>Faça cópia</b> (fotografia ou planilha na nuvem) para não perder o histórico.`,
        ] },
        { t: 'callout', tipo: 'dica', titulo: 'Um modelo de linha', html: `“12/03/2027 · Veleiro Albatroz, 32 pés · Cabedelo a Natal · 105 mn navegadas · 21 h de mar (4 h noturnas) · função: responsável por quarto · vento NE 15 a 20 nós, mar de 1,5 m · aprendi a rizar de noite; errei ao deixar a escota solta · assinatura do comandante.”` },
        { t: 'figura', svg: svg('0 0 460 200', 'Exemplo de duas linhas de caderneta de bordo com data, barco, rota, milhas, horas noturnas e função',
            '<rect x="0" y="0" width="460" height="200" fill="var(--sea-1)"/>' +
            '<rect x="12" y="12" width="436" height="32" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.4"/>' +
            t(18, 34, 'Data', 16) + t(70, 34, 'Barco', 16) + t(146, 34, 'Rota', 16) + t(282, 34, 'Milhas', 16) + t(338, 34, 'Noite', 16) + t(388, 34, 'Função', 16) +
            '<rect x="12" y="44" width="436" height="44" fill="none" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(18, 72, '12/03', 16) + t(70, 72, 'Albatroz', 16) + t(146, 72, 'Cabedelo-Natal', 16) + t(282, 72, '105', 16) + t(338, 72, '4 h', 16) + t(388, 72, 'quarto', 16) +
            '<rect x="12" y="88" width="436" height="44" fill="none" stroke="var(--ink)" stroke-width="1.2"/>' +
            t(18, 116, '19/03', 16) + t(70, 116, 'Aurora', 16) + t(146, 116, 'Natal-Natal', 16) + t(282, 116, '32', 16) + t(338, 116, '0 h', 16) + t(388, 116, 'skipper', 16) +
            t(18, 160, 'Assinatura do comandante: ____________', 16) +
            t(18, 186, 'Total: 137 mn, 4 h noturnas, 1 saída como skipper', 16)),
          legenda: `Modelo de duas linhas de uma caderneta pessoal, com os campos principais. O que importa é anotar logo depois da saída e pedir a assinatura do comandante.` },
        { t: 'termos', ids: ["comandante", "tripulante", "odometro"] },
        { t: 'check', titulo: 'Verifique o que entendeu', questoes: [
          { id: 'vela-2-076', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 1,
            enunciado: 'A NORMAM-211 exige que o candidato a Mestre-Amador apresente caderneta de milhas?',
            alternativas: ['Não: a norma não fala em milhas nem dias de mar', 'Sim, mínimo de 500 milhas', 'Sim, mínimo de 100 dias', 'Sim, assinada pela Capitania'],
            correta: 0,
            explicacao: 'A norma só pede a CHA de Arrais para o exame de Mestre. A caderneta é boa prática pessoal, útil para charter, seguros e exames estrangeiros, mas não é exigência legal no Brasil.',
            referencia: 'NORMAM-211/DPC, Cap. 5', fonte_url: NORMAM },
          { id: 'vela-2-077', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2,
            enunciado: 'Qual das informações é a MAIS útil para contar “dias como comandante” em sua caderneta?',
            alternativas: ['Sua função a bordo em cada saída', 'A cor do casco', 'A marca do rádio', 'O nome do porto de origem do barco'],
            correta: 0,
            explicacao: 'A função (tripulante, imediato, comandante) separa as milhas em que você tinha a responsabilidade das em que não tinha. Cor do casco, marca do rádio e porto de origem do barco não ajudam a contar dias como comandante.',
            referencia: 'RYA, Qualifying passages', fonte_url: RYA_QP },
          { id: 'vela-2-078', nivel: 'vela', tema: 'Experiência e competências', dificuldade: 2, intl: true,
            enunciado: 'Para o RYA, o que é um “dia a bordo”?',
            alternativas: ['8 horas consecutivas vivendo a bordo, a maior parte com o barco no mar', 'Qualquer saída de 1 hora', 'Uma noite em marina', '24 horas sem desembarcar'],
            correta: 0,
            explicacao: 'A definição do RYA é de 8 horas consecutivas vivendo a bordo, a maior parte com o barco no mar, e só um período conta a cada 24 h. Uma hora, uma noite em marina ou 24 h exatas não correspondem.',
            referencia: 'RYA, Qualifying passages', fonte_url: RYA_QP },
        ] },
        { t: 'fontes', itens: [
          { txt: 'NORMAM-211/DPC, requisitos para MSA e CPA', url: NORMAM, ref: 'normas-49' },
          { txt: 'RYA, Qualifying passages: definições de dia a bordo, passagem e skipper', url: RYA_QP, ref: 'internacional-51', intl: true },
          { txt: 'American Sailing Association: logbook e certificação', url: 'https://americansailing.com/', ref: 'internacional-124' },
        ] },
      ],
    },
  ],
});
  VL.dado('cursos/vela-2', { modulos: M });
})();
