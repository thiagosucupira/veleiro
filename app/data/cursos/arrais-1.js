/* Curso Arrais-Amador — parte 1 (módulos m1 a m4).
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 3.1 a) I a V e Seção II (treinamento prático 2.1 e 2.4 a 2.7).
   Fatos regulatórios só com {t:'fato', ref} (ids de research/claims_verified.json ou research/_work/research_extra_arrais-1.json).
   Para contribuir: mantenha os ids de módulos e lições (o progresso dos alunos é salvo por eles). */
(function () {
  'use strict';
  var NORMAM = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var MIG1 = 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf';
  var ARTE = 'https://www.marinha.mil.br/dphdm/node/801';
  var ASHLEY = 'https://www.penguinrandomhouse.com/books/5478/ashley-book-of-knots-by-clifford-ashley/';
  var ANNAPOLIS = 'https://openlibrary.org/books/OL26919315M/The_Annapolis_book_of_seamanship';
  var BOATUS_ANCH = 'https://www.boatus.org/study-guide/navigation/anchoring';
  var PORTOGENTE = 'https://portogente.com.br/artigos/20570-e-tradicao-na-marinha-se-a-onca-pegar-alguem-safa';
  var RIPEAM = 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf';
  /* Figura SVG acessível, com cores só por tokens (claro e escuro). */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" style="max-width:' + (maxw || 480) + 'px;display:block;margin:0 auto;overflow:visible" role="img" aria-label="' + titulo + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit" fill="var(--ink)"><title>' + titulo + '</title>' + corpo + '</svg>';
  }
  /* Texto de SVG: t(x, y, texto, tamanho?, ancora?, extra?) */
  function t(x, y, s, fs, anc, ext) {
    var cor = ext && /fill=/.test(ext) ? '' : ' fill="var(--ink)"';
    return '<text x="' + x + '" y="' + y + '" font-size="' + (fs || 15) + '" text-anchor="' + (anc || 'middle') + '"' + cor + (ext ? ' ' + ext : '') + '>' + s + '</text>';
  }
  /* Ponta de seta (marcador) para linhas de cota e vetores */
  function defs(id, cor) {
    return '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + (cor || 'var(--ink)') + '"/></marker></defs>';
  }
  /* Número de legenda (círculo magenta) */
  function num(x, y, k) {
    return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="2"/>' + t(x, y + 5, k, 15, 'middle', 'fill="var(--magenta)" font-weight="700"');
  }
  /* Casco visto de cima, proa para cima: cx = centro, y0 = proa, L = comprimento */
  function cascoTopo(cx, y0, L, b, extra) {
    var h = b / 2, y1 = y0 + L;
    return '<path d="M' + cx + ',' + y0 + ' C' + (cx + h * 0.95) + ',' + (y0 + L * 0.16) + ' ' + (cx + h) + ',' + (y0 + L * 0.42) + ' ' + (cx + h) + ',' + (y0 + L * 0.56) + ' C' + (cx + h) + ',' + (y0 + L * 0.78) + ' ' + (cx + h * 0.9) + ',' + (y1 - L * 0.04) + ' ' + (cx + h * 0.78) + ',' + y1 + ' L' + (cx - h * 0.78) + ',' + y1 + ' C' + (cx - h * 0.9) + ',' + (y1 - L * 0.04) + ' ' + (cx - h) + ',' + (y0 + L * 0.78) + ' ' + (cx - h) + ',' + (y0 + L * 0.56) + ' C' + (cx - h) + ',' + (y0 + L * 0.42) + ' ' + (cx - h * 0.95) + ',' + (y0 + L * 0.16) + ' ' + cx + ',' + y0 + ' Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"' + (extra ? ' ' + extra : '') + '/>';
  }

  VL.dado('cursos/arrais-1', {
  modulos: [
{
      id: 'm1',
      titulo: 'A embarcação: partes, nomenclatura e direções',
      resumo: 'Os nomes das partes do barco, das direções a bordo e das classes de embarcação da NORMAM-211. É o vocabulário que a prova cobra e que você vai usar em toda manobra, do primeiro passeio à travessia.',
      licoes: [
        {
          id: 'l1',
          titulo: 'Proa, popa, bombordo e boreste: o casco por fora',
          minutos: 10,
          objetivos: [
            'Nomear as partes principais do casco',
            'Identificar bombordo e boreste em qualquer posição a bordo',
            'Distinguir obras vivas de obras mortas e localizar a linha d’água',
          ],
          blocos: [
            { t: 'p', html: 'A bordo, ninguém diz “frente”, “trás”, “esquerda” ou “direita”. Esses termos mudam quando a pessoa se vira. Os termos náuticos não mudam, porque se referem ao próprio barco. É por isso que o programa da prova de Arrais-Amador começa exatamente por aqui.' },
            { t: 'fato', ref: 'extra-arrais-1-01', html: 'O primeiro item do programa oficial (Anexo 5-A, item 3.1 a) pede termos náuticos, nomenclatura, peças e partes das embarcações, direções relativas, marinharia, nós e voltas, e também a identificação e a classificação das embarcações miúdas. É só o começo: a mesma alínea segue com manobras, preparação para a navegação, propulsão e leme, incêndio, primeiros socorros e sobrevivência, e as alíneas b) a f) tratam de salvatagem, instrumentos, meteorologia, marés e RIPEAM.' },
            { t: 'fato', ref: 'programa-39', html: 'Na NORMAM-211 em vigor (Rev. 1, Portaria DPC/DGN/MB nº 200, de 27/02/2026), o item 3.1 a) do Anexo 5-A tem dez subitens (I a X). Entre eles estão o VII (pontos de ignição e de fulgor dos combustíveis: gasolina, etanol e diesel) e o VIII (procedimento para abastecimento de embarcação). A lista com 8 subitens que aparece no arquivo editável de anexos (.odt, no ZIP da DPC) está desatualizada.' },
            { t: 'h', txt: 'As quatro referências' },
            { t: 'lista', itens: [
              '<b>Proa</b>: a extremidade da frente. Tudo o que fica para o lado dela está <b>a vante</b>.',
              '<b>Popa</b>: a extremidade de trás. Tudo o que fica para o lado dela está <b>a ré</b>.',
              '<b>Boreste (BE)</b>: o lado direito de quem está a bordo olhando para a proa.',
              '<b>Bombordo (BB)</b>: o lado esquerdo de quem está a bordo olhando para a proa.',
            ] },
            { t: 'p', html: 'O segredo é sempre se imaginar de frente para a proa. Se você estiver sentado no cockpit olhando para a popa, boreste continua sendo o lado direito do barco, mesmo que agora esteja à sua esquerda. Dois lembretes ajudam: bo<b>re</b>ste e di<b>re</b>ita têm o mesmo “re”; e, à noite, a luz de bordo de bombordo é <b>encarnada</b> (vermelha) e a de boreste é <b>verde</b>, como manda o RIPEAM.' },
            { t: 'figura', svg: svg('0 0 400 460', 'Casco visto de cima com proa, popa, bombordo, boreste, linha de centro e meia-nau',
                defs('m1l1a') +
                cascoTopo(200, 44, 370, 176) +
                '<line x1="200" y1="44" x2="200" y2="414" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="7 6"/>' +
                '<line x1="112" y1="251" x2="288" y2="251" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 4"/>' +
                '<circle cx="146" cy="150" r="9" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<circle cx="254" cy="150" r="9" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="1.5"/>' +
                t(200, 30, 'Proa', 17, 'middle', 'font-weight="700"') +
                t(200, 446, 'Popa', 17, 'middle', 'font-weight="700"') +
                t(102, 246, 'Bombordo', 16, 'end', 'font-weight="700"') + t(102, 266, '(BB)', 15, 'end') +
                t(298, 246, 'Boreste', 16, 'start', 'font-weight="700"') + t(298, 266, '(BE)', 15, 'start') +
                t(208, 243, 'meia-nau', 15, 'start') +
                t(208, 340, 'linha de centro', 15, 'start', 'fill="var(--magenta)"') +
                '<line x1="40" y1="190" x2="40" y2="110" stroke="var(--ink)" stroke-width="2" marker-end="url(#m1l1a)"/>' + t(40, 210, 'a vante', 15) +
                '<line x1="40" y1="310" x2="40" y2="390" stroke="var(--ink)" stroke-width="2" marker-end="url(#m1l1a)"/>' + t(40, 300, 'a ré', 15) +
                t(146, 132, 'encarnada', 15, 'middle') + t(254, 132, 'verde', 15, 'middle')),
              legenda: 'Vista de cima. Olhando para a proa, bombordo fica à esquerda e boreste à direita. As luzes de bordos (encarnada a bombordo, verde a boreste) ajudam a lembrar.' },
            { t: 'h', txt: 'O casco e suas regiões' },
            { t: 'p', html: 'O <b>casco</b> é o corpo do barco, a parte que flutua. Cada lado do casco é um <b>costado</b>. A linha imaginária que corta o barco ao meio, de proa a popa, é a <b>linha de centro</b>. A região central, a meio caminho entre proa e popa, é a <b>meia-nau</b>. Na frente, o casco termina na <b>roda de proa</b>. Atrás, na maioria dos barcos de recreio, termina numa parede plana chamada <b>espelho de popa</b>, onde costuma ir o motor de popa ou a escada de banho.' },
            { t: 'p', html: 'A <b>linha d’água</b> é onde a superfície da água encosta no casco. Abaixo dela ficam as <b>obras vivas</b> (ou carena), sempre molhadas: ali estão a <b>quilha</b>, o <b>leme</b> e o hélice, e é ali que se passa a tinta anti-incrustante. Acima dela ficam as <b>obras mortas</b>, até a <b>borda</b>, a beirada de cima do costado. Por cima de tudo está o <b>convés</b>, o “piso” externo do barco.' },
            { t: 'p', html: 'Três palavras parecidas confundem no começo. <b>Bordo</b> é cada lado do barco (daí bom<b>bordo</b>). <b>A bordo</b> quer dizer dentro da embarcação. <b>Pela borda</b> quer dizer por cima da borda, para fora: “o balde caiu pela borda”.' },
            { t: 'callout', tipo: 'dica', titulo: 'Fale como a tripulação', html: 'Treine em voz alta, mesmo em terra: “defensa a boreste, a meia-nau”; “cabo pela popa”. Numa manobra com seis pessoas, “joga pra esquerda!” cria confusão. “Defensa a bombordo, a ré!” não deixa dúvida, não importa para onde cada um esteja olhando.' },
            { t: 'termos', ids: ['proa', 'popa', 'bombordo', 'boreste', 'avante', 'a-re', 'meia-nau', 'linha-de-centro', 'costado', 'linha-dagua', 'obras-vivas', 'obras-mortas', 'quilha', 'espelho-de-popa', 'roda-de-proa', 'borda', 'conves'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-001', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Você está a bordo, sentado de costas para a proa (olhando para a popa). O bordo de boreste fica:',
                alternativas: ['Do lado direito do barco, que agora está à sua esquerda', 'Sempre à sua direita, para onde quer que você olhe', 'Na popa, já que você está olhando para ela', 'Sobre a linha de centro, no meio do barco'],
                correta: 0,
                explicacao: 'Boreste é o lado direito <b>do barco</b> para quem olha para a proa; ele não muda quando você se vira. De costas para a proa, esse lado fica à sua esquerda. “Sempre à sua direita” confunde o lado do barco com o seu próprio lado. A popa é a extremidade de trás, não um bordo. A linha de centro divide os dois bordos, não é um deles.',
                referencia: 'Arte Naval, vol. 1 (nomenclatura do navio)' },
              { id: 'arrais-1-002', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'À noite, você avista só a luz de bordo de outro barco. Qual cor indica que você está vendo o bordo de <b>bombordo</b> dele?',
                alternativas: ['Encarnada (vermelha)', 'Verde', 'Branca', 'Amarela'],
                correta: 0,
                explicacao: 'Pelo RIPEAM, a luz de bordo de bombordo é encarnada e a de boreste é verde. A branca é usada nas luzes de mastro, de alcançado e de fundeio, não nas de bordos. A amarela é a luz de reboque.',
                referencia: 'RIPEAM-72, Regra 21(b) e (d)', fonte_url: RIPEAM },
              { id: 'arrais-1-003', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'As obras vivas de uma embarcação são:',
                alternativas: ['A parte do casco abaixo da linha d’água, também chamada de carena', 'A parte do casco acima da linha d’água, até a borda', 'O convés e a casaria', 'As peças móveis do aparelho, como escotas e adriças'],
                correta: 0,
                explicacao: 'Obras vivas (carena) é a parte do casco que fica dentro d’água, abaixo da linha d’água. A parte acima, até a borda, são as obras mortas. Convés e casaria ficam acima do casco. Escotas e adriças são o aparelho de laborar, nada a ver com o casco.',
                referencia: 'Arte Naval, vol. 1 (nomenclatura do navio)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a), programa da prova de Arrais-Amador', url: NORMAM, ref: 'extra-arrais-1-01' },
              { txt: 'RIPEAM-72, Regra 21(b): luzes de bordos (verde a boreste, encarnada a bombordo)', url: RIPEAM },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, Marinha do Brasil, 2019): nomenclatura do navio', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l2',
          titulo: 'Convés, mastreação e equipamentos de bordo',
          minutos: 12,
          objetivos: [
            'Reconhecer as peças de convés usadas nas manobras',
            'Nomear o mastro e as peças do aparelho fixo de um veleiro',
            'Diferenciar aparelho fixo de aparelho de laborar',
          ],
          blocos: [
            { t: 'p', html: 'Num barco de recreio, quase tudo o que você toca tem nome próprio. Saber esses nomes acelera as manobras e é cobrado na prova como “peças e partes das embarcações”. Vamos do convés para cima, com um veleiro de cruzeiro típico como exemplo; os nomes valem para barcos de qualquer tamanho.' },
            { t: 'h', txt: 'No convés' },
            { t: 'lista', itens: [
              '<b>Cunho</b>: peça com dois “chifres” onde se dá volta num cabo para prendê-lo (amarração, escotas, adriças).',
              '<b>Cabeço</b>: coluna robusta, no cais ou no convés, onde se passa a alça de uma espia.',
              '<b>Buzina</b>: guia na borda por onde o cabo passa sem raspar no casco.',
              '<b>Molinete</b>: guincho de proa que recolhe a amarra da âncora. A amarra fica guardada no <b>paiol da amarra</b>.',
              '<b>Balaústres</b> e <b>guarda-mancebo</b>: colunas na borda e o cabo (ou vergalhão) esticado entre elas, que impede quedas. Na proa, a grade de tubos é o <b>púlpito</b>; na popa, o púlpito de popa.',
              '<b>Gaiuta</b> e <b>escotilhas</b>: aberturas de acesso ao interior. <b>Vigias</b> são as janelas do casco ou da casaria.',
              '<b>Cockpit</b>: área rebaixada, em geral a ré, de onde se governa. A <b>casaria</b> é a parte elevada sobre a cabine.',
            ] },
            { t: 'h', txt: 'Por dentro e por baixo' },
            { t: 'p', html: 'O ponto mais baixo do interior do casco é a <b>sentina</b>, onde se junta a água que entra. Ela é esvaziada pela <b>bomba de esgoto</b>, manual ou elétrica. Cada furo do casco abaixo da linha d’água (entrada de água do motor, pia, sanitário) tem uma <b>válvula de fundo</b>, que se fecha quando não está em uso e se confere antes de sair. As paredes internas que dividem o casco são as <b>anteparas</b>.' },
            { t: 'h', txt: 'Mastreação de um veleiro' },
            { t: 'p', html: 'O <b>mastro</b> é a coluna que sustenta as velas. A <b>retranca</b> é a vara horizontal presa ao mastro, onde corre a parte de baixo da vela grande. O mastro fica de pé graças ao <b>aparelho fixo</b>, cabos de aço que não se mexem durante a manobra:' },
            { t: 'lista', itens: [
              '<b>Estai</b> (estai de proa): segura o mastro para vante, da proa até o alto do mastro. Nele corre a vela de proa.',
              '<b>Estai de popa</b>: segura o mastro para ré, do alto do mastro até a popa.',
              '<b>Brandais</b>: seguram o mastro para os lados, presos nas chapas de brandal do costado. As <b>cruzetas</b> afastam os brandais do mastro.',
            ] },
            { t: 'p', html: 'Já o <b>aparelho de laborar</b> é o conjunto de cabos que trabalham na manobra. As <b>adriças</b> içam (sobem) as velas. As <b>escotas</b> regulam o ângulo das velas em relação ao vento. Esses cabos passam por <b>moitões</b> (roldanas), <b>mordedores</b> (travas) e <b>catracas</b> (guinchos manuais).' },
            { t: 'figura', svg: svg('0 0 400 390', 'Perfil de um veleiro de cruzeiro com as peças numeradas',
                '<rect x="0" y="290" width="400" height="100" fill="var(--sea-3)" opacity="0.45"/>' +
                '<line x1="0" y1="290" x2="400" y2="290" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<path d="M205,310 L232,310 L246,370 L216,370 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M84,298 L102,298 L106,348 L92,348 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M40,262 L372,250 L352,292 Q300,312 200,314 Q110,314 60,296 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M178,256 L192,236 L300,232 L314,252" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<line x1="262" y1="234" x2="262" y2="30" stroke="var(--ink)" stroke-width="5"/>' +
                '<line x1="262" y1="206" x2="108" y2="214" stroke="var(--ink)" stroke-width="4"/>' +
                '<line x1="262" y1="32" x2="370" y2="251" stroke="var(--ink)" stroke-width="1.6"/>' +
                '<line x1="262" y1="32" x2="44" y2="261" stroke="var(--ink)" stroke-width="1.6"/>' +
                '<path d="M64,261 L64,238 L344,228 M150,258 L150,234 M330,252 L330,228" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
                '<path d="M344,251 L348,226 L368,225 L372,250" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
                num(282, 112, '1') + num(176, 196, '2') + num(330, 142, '3') + num(136, 140, '4') + num(240, 246, '5') +
                num(112, 246, '6') + num(196, 222, '7') + num(384, 212, '8') + num(266, 350, '9') + num(70, 340, '10') +
                num(18, 290, '11') + num(300, 276, '12')),
              legenda: '1 mastro · 2 retranca · 3 estai · 4 estai de popa · 5 casaria · 6 cockpit · 7 balaústres e guarda-mancebo · 8 púlpito · 9 quilha · 10 leme · 11 linha d’água · 12 costado. Os brandais não aparecem de perfil: ficam dos lados do mastro.' },
            { t: 'widget', w: 'veleiro-3d', opts: { grupo: 'conves', ajustes: false }, legenda: 'Gire o veleiro de exemplo e toque nas peças para ver o nome e a função de cada uma. Troque o grupo de rótulos para ver casco, convés, mastro e velas.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Mãos e pés', html: 'Nunca ponha os dedos entre o cabo e o cunho, a catraca ou a buzina enquanto o cabo estiver sob carga. No convés, use calçado de sola clara e antiderrapante e ande sempre segurando em algo firme: “uma mão para você, outra para o barco”.' },
            { t: 'termos', ids: ['cunho', 'cabeco', 'buzina', 'molinete', 'paiol-da-amarra', 'balaustre', 'guarda-mancebo', 'pulpito', 'gaiuta', 'escotilha', 'vigia', 'cockpit', 'sentina', 'bomba-de-esgoto', 'valvula-de-fundo', 'anteparo', 'mastro', 'retranca', 'estai', 'estai-de-popa', 'brandal', 'cruzeta', 'aparelho-fixo', 'aparelho-de-laborar', 'adrica', 'escota', 'moitao', 'mordedor', 'catraca'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-004', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'O cabo ou vergalhão esticado entre os balaústres, ao longo da borda, para evitar que alguém caia na água chama-se:',
                alternativas: ['Guarda-mancebo', 'Brandal', 'Espringue', 'Adriça'],
                correta: 0,
                explicacao: 'O guarda-mancebo corre entre os balaústres e funciona como corrimão de proteção. O brandal é cabo de aço do aparelho fixo que segura o mastro para os lados. O espringue é cabo de amarração ao cais. A adriça iça as velas.',
                referencia: 'Arte Naval, vol. 1 (nomenclatura do navio)' },
              { id: 'arrais-1-005', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 2,
                enunciado: 'Num veleiro, qual peça do aparelho fixo segura o mastro <b>para vante</b>?',
                alternativas: ['O estai (estai de proa)', 'O estai de popa', 'Os brandais', 'A escota da vela de proa'],
                correta: 0,
                explicacao: 'O estai vai da proa ao alto do mastro e impede que ele caia para ré, segurando-o para vante. O estai de popa faz o contrário (segura para ré). Os brandais seguram para os lados. A escota não é aparelho fixo: é cabo de laborar que regula a vela.',
                referencia: 'Arte Naval, vol. 1 (mastreação e aparelho)' },
              { id: 'arrais-1-006', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Para que serve a válvula de fundo?',
                alternativas: ['Fechar uma passagem de água pelo casco abaixo da linha d’água, como a entrada de água do motor ou do sanitário', 'Esvaziar a sentina automaticamente quando ela enche', 'Ventilar o compartimento do motor antes da partida', 'Drenar o combustível do tanque para a manutenção'],
                correta: 0,
                explicacao: 'Cada abertura do casco abaixo da linha d’água tem uma válvula de fundo, que se fecha quando não está em uso. Quem esvazia a sentina é a bomba de esgoto. Ventilação é feita por dutos e exaustores. Drenar o tanque não é função da válvula de fundo.',
                referencia: 'Arte Naval, vol. 1; NORMAM-211, Anexo 5-F, item 04 (estanqueidade do casco)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, Marinha do Brasil, 2019): nomenclatura do navio, mastreação e aparelho', url: ARTE },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) I: peças e partes das embarcações', url: NORMAM, ref: 'extra-arrais-1-01' },
            ] },
          ],
        },
        {
          id: 'l3',
          titulo: 'Medidas do barco: comprimento, boca, calado e borda livre',
          minutos: 10,
          objetivos: [
            'Definir comprimento, boca, calado, pontal e borda livre',
            'Converter pés em metros',
            'Relacionar calado com profundidade e borda livre com carga',
          ],
          blocos: [
            { t: 'p', html: 'Cinco medidas descrevem o tamanho de um barco. Elas dizem se ele cabe numa vaga de marina, por onde pode passar sem encalhar, quanto pode carregar e em que classe da NORMAM-211 ele se encaixa.' },
            { t: 'lista', itens: [
              '<b>Comprimento</b>: a distância horizontal entre a ponta da proa e a ponta da popa.',
              '<b>Boca</b>: a maior largura do casco.',
              '<b>Calado</b>: a distância vertical da linha d’água até o ponto mais fundo do barco, em geral a quilha. É a profundidade mínima de que o barco precisa para flutuar.',
              '<b>Pontal</b>: a altura do casco a meia-nau, do fundo até o convés.',
              '<b>Borda livre</b>: a distância vertical da linha d’água até o convés, medida no costado.',
            ] },
            { t: 'fato', ref: 'normas-20', html: 'Para a NORMAM-211, o comprimento é a distância horizontal entre os extremos de proa e popa, sem contar plataformas de mergulho, gurupés e apêndices parecidos.' },
            { t: 'figura', svg: svg('0 0 400 470', 'Comprimento e calado no perfil; boca, pontal, borda livre e calado na seção a meia-nau',
                defs('m1l3a') +
                t(200, 20, 'Perfil', 16, 'middle', 'font-weight="700"') +
                '<rect x="0" y="120" width="400" height="90" fill="var(--sea-3)" opacity="0.45"/>' +
                '<line x1="0" y1="120" x2="400" y2="120" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<path d="M196,140 L224,140 L234,192 L206,192 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M30,95 L370,88 L352,122 Q300,142 200,144 Q110,144 50,126 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<line x1="30" y1="92" x2="30" y2="50" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="370" y1="86" x2="370" y2="50" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="34" y1="58" x2="366" y2="58" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(200, 50, 'comprimento', 15, 'middle', 'fill="var(--magenta)"') +
                '<line x1="234" y1="192" x2="300" y2="192" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="290" y1="124" x2="290" y2="188" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(298, 165, 'calado', 15, 'start', 'fill="var(--magenta)"') +
                t(8, 112, 'linha d’água', 15, 'start') +
                t(200, 250, 'Seção a meia-nau', 16, 'middle', 'font-weight="700"') +
                '<rect x="0" y="330" width="400" height="125" fill="var(--sea-3)" opacity="0.45"/>' +
                '<line x1="0" y1="330" x2="400" y2="330" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<path d="M120,285 Q114,345 156,362 L190,364 L194,436 L206,436 L210,364 L244,362 Q286,345 280,285 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<line x1="124" y1="272" x2="276" y2="272" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(200, 266, 'boca', 15, 'middle', 'fill="var(--magenta)"') +
                '<line x1="100" y1="289" x2="100" y2="326" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(92, 302, 'borda', 15, 'end', 'fill="var(--magenta)"') + t(92, 320, 'livre', 15, 'end', 'fill="var(--magenta)"') +
                '<line x1="280" y1="285" x2="318" y2="285" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="244" y1="362" x2="318" y2="362" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="312" y1="289" x2="312" y2="358" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(320, 328, 'pontal', 15, 'start', 'fill="var(--magenta)"') +
                '<line x1="206" y1="436" x2="370" y2="436" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<line x1="362" y1="334" x2="362" y2="432" stroke="var(--magenta)" stroke-width="2" marker-start="url(#m1l3a)" marker-end="url(#m1l3a)"/>' +
                t(354, 392, 'calado', 15, 'end', 'fill="var(--magenta)"')),
              legenda: 'Em cima, o barco de lado: comprimento e calado. Embaixo, um corte a meia-nau: boca, borda livre, pontal e calado (até o fundo da quilha).' },
            { t: 'h', txt: 'Pés e metros' },
            { t: 'p', html: 'Barcos de recreio costumam ser vendidos em pés. Um pé tem exatamente 0,3048 m. Assim, por exemplo, um veleiro de 32 pés mede 32 × 0,3048 = <b>9,75 m</b>. Para o caminho inverso, multiplique os metros por 3,28: um barco de 6 m tem cerca de 19,7 pés.' },
            { t: 'h', txt: 'Por que o calado importa' },
            { t: 'p', html: 'A profundidade que você precisa é o calado mais uma folga de segurança abaixo da quilha. Por exemplo, um veleiro de cruzeiro de 32 pés (≈9,75 m) costuma calar entre 1,4 e 2 m por causa da quilha; barcos maiores calam mais, e uma lancha do mesmo tamanho cala bem menos. Barcos com <b>bolina retrátil</b> diminuem o calado ao recolhê-la. Em rios na estiagem, em lagoas com bancos de areia que mudam de lugar e em baías com baixios, o calado decide por onde você pode passar e em que horário de maré. As marés e a leitura das profundidades na carta aparecem no módulo de instrumentos, marés e tempo.' },
            { t: 'h', txt: 'Borda livre e carga' },
            { t: 'p', html: 'Cada pessoa e cada objeto que embarca afunda um pouco o casco e diminui a borda livre. Com pouca borda livre, a água das ondas entra no convés com facilidade e o barco fica menos estável. É uma das razões para respeitar a lotação máxima, assunto do módulo 4.' },
            { t: 'callout', tipo: 'dica', titulo: 'Anote as medidas do seu barco', html: 'Cole no painel um cartão com comprimento, boca, calado e <b>altura do mastro</b> acima da linha d’água. O calado evita encalhes; a altura do mastro evita bater em pontes e cabos elétricos sobre rios e canais.' },
            { t: 'termos', ids: ['comprimento', 'boca', 'calado', 'pontal', 'borda-livre', 'bolina', 'pe'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-007', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'O calado de uma embarcação é:',
                alternativas: ['A distância vertical da linha d’água até o ponto mais fundo do casco', 'A maior largura do casco', 'A distância vertical da linha d’água até o convés', 'O comprimento medido na linha d’água'],
                correta: 0,
                explicacao: 'Calado é quanto o barco “afunda”: da linha d’água ao ponto mais baixo, em geral a quilha. A maior largura é a boca. Da linha d’água ao convés é a borda livre. Comprimento na linha d’água é uma medida de comprimento, não de profundidade.',
                referencia: 'Arte Naval, vol. 1 (dimensões do navio)' },
              { id: 'arrais-1-008', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Um veleiro anunciado como de 32 pés tem, aproximadamente:',
                alternativas: ['9,75 m', '6,5 m', '12,2 m', '32 m'],
                correta: 0,
                explicacao: 'Um pé vale 0,3048 m, então 32 × 0,3048 ≈ 9,75 m. 6,5 m corresponde a cerca de 21 pés; 12,2 m, a 40 pés. 32 m confunde pés com metros.',
                referencia: 'Definição internacional do pé (1 pé = 0,3048 m)', fonte_url: 'https://www.nist.gov/pml/us-surveyfoot' },
              { id: 'arrais-1-009', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 2,
                enunciado: 'Para a NORMAM-211, ao medir o comprimento de uma lancha com plataforma de mergulho na popa:',
                alternativas: ['A plataforma de mergulho não entra na medida', 'A plataforma de mergulho entra na medida', 'Mede-se só o comprimento na linha d’água', 'Soma-se o comprimento à boca'],
                correta: 0,
                explicacao: 'O comprimento da norma é a distância horizontal entre os extremos de proa e popa, sem contar plataformas de mergulho, gurupés e apêndices semelhantes. Por isso a plataforma fica de fora. A medida não é a da linha d’água e nunca se soma a boca.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.7 (comprimento)', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Cap. 1, art. 1.7: definição de comprimento', url: NORMAM, ref: 'normas-20' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): dimensões do navio', url: ARTE },
              { txt: 'NIST: o pé internacional vale exatamente 0,3048 m', url: 'https://www.nist.gov/pml/us-surveyfoot' },
            ] },
          ],
        },
        {
          id: 'l4',
          titulo: 'Direções relativas: bochechas, través, alhetas e marcação relativa',
          minutos: 12,
          objetivos: [
            'Usar os nomes das direções medidas a partir da proa',
            'Ler e converter marcação relativa e marcação polar',
            'Calcular a marcação verdadeira a partir do rumo e da marcação relativa',
          ],
          blocos: [
            { t: 'p', html: 'Quando você avista algo (outro barco, uma boia, uma pedra), precisa dizer onde está em relação ao seu barco. Há duas maneiras: pelo <b>nome</b> do setor e pelos <b>graus</b> contados a partir da proa. As duas são cobradas na prova e usadas todos os dias a bordo.' },
            { t: 'h', txt: 'Os nomes das direções' },
            { t: 'lista', itens: [
              '<b>Pela proa</b>: bem à frente (000°).',
              '<b>Bochecha</b> de boreste ou de bombordo: a meio caminho entre a proa e o través (045° e 315°).',
              '<b>Través</b> de boreste ou de bombordo: perpendicular à linha de centro, bem ao lado (090° e 270°).',
              '<b>Alheta</b> de boreste ou de bombordo: a meio caminho entre o través e a popa (135° e 225°).',
              '<b>Pela popa</b>: bem atrás (180°).',
            ] },
            { t: 'p', html: 'Também se diz que algo está <b>por ante a vante do través</b> (mais para a proa que o través) ou <b>por ante a ré do través</b> (mais para a popa). A ideia aparece no RIPEAM: a luz de mastro cobre da proa até 22,5° por ante a ré do través de cada bordo, e quem se aproxima vindo de mais de 22,5° por ante a ré do seu través é um barco <b>alcançador</b>, que deve se manter fora do seu caminho.' },
            { t: 'figura', svg: svg('0 0 420 400', 'Rosa das direções relativas com proa, bochechas, través, alhetas e popa',
                '<circle cx="210" cy="200" r="105" fill="none" stroke="var(--sea-3)" stroke-width="2" stroke-dasharray="5 5"/>' +
                cascoTopo(210, 140, 122, 52) +
                '<path d="M297.8,236.4 A95,95 0 0 1 122.2,236.4" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
                '<line x1="267.3" y1="223.7" x2="319" y2="245.2" stroke="var(--magenta)" stroke-width="2"/>' +
                '<line x1="152.7" y1="223.7" x2="101" y2="245.2" stroke="var(--magenta)" stroke-width="2"/>' +
                '<g stroke="var(--ink)" stroke-width="2"><line x1="210" y1="132" x2="210" y2="95"/><line x1="253.8" y1="156.2" x2="284.2" y2="125.8"/><line x1="272" y1="200" x2="315" y2="200"/><line x1="253.8" y1="243.8" x2="284.2" y2="274.2"/><line x1="210" y1="268" x2="210" y2="305"/><line x1="166.2" y1="243.8" x2="135.8" y2="274.2"/><line x1="148" y1="200" x2="105" y2="200"/><line x1="166.2" y1="156.2" x2="135.8" y2="125.8"/></g>' +
                t(210, 46, 'pela proa · 000°', 15, 'middle', 'font-weight="700"') +
                t(322, 88, 'bochecha', 15) + t(322, 106, 'de BE · 045°', 15) +
                t(366, 192, 'través', 15) + t(366, 230, 'de BE · 090°', 15) +
                t(330, 306, 'alheta', 15) + t(330, 324, 'de BE · 135°', 15) +
                t(210, 362, 'pela popa · 180°', 15, 'middle', 'font-weight="700"') +
                t(90, 306, 'alheta', 15) + t(90, 324, 'de BB · 225°', 15) +
                t(54, 192, 'través', 15) + t(54, 230, 'de BB · 270°', 15) +
                t(98, 88, 'bochecha', 15) + t(98, 106, 'de BB · 315°', 15) +
                t(210, 388, 'arco magenta: setor de alcançado', 15, 'middle', 'fill="var(--magenta)"')),
              legenda: 'Marcações relativas, contadas da proa no sentido horário. O arco magenta é o setor de onde um barco que se aproxima é alcançador (RIPEAM, Regra 13): de 22,5° por ante a ré do través de um bordo até o mesmo ponto do outro bordo.' },
            { t: 'h', txt: 'Marcação relativa em graus' },
            { t: 'p', html: 'A <b>marcação relativa</b> (Mr) é o ângulo horizontal entre a proa e a linha que liga você ao objeto, medido de 000° a 360° no sentido horário, a partir da proa. Escreve-se sempre com três algarismos: 045°, não 45°.' },
            { t: 'p', html: 'A <b>marcação polar</b> (Mp) conta a partir da proa só até 180°, para boreste ou para bombordo, e sempre leva o nome do bordo: 030° BE, 090° BB. Para converter: polar a boreste é igual à relativa (030° BE = 030°); polar a bombordo é 360° menos o valor (030° BB = 330°).' },
            { t: 'h', txt: 'Da marcação relativa à verdadeira' },
            { t: 'p', html: 'Para levar uma marcação à carta, você precisa da <b>marcação verdadeira</b> (Mv), medida a partir do norte verdadeiro. A conta é simples: <b>Mv = Mr + rumo verdadeiro</b>. Se passar de 360°, subtraia 360°.' },
            { t: 'lista', itens: [
              'Rumo 045°, farol exatamente no través de bombordo: Mp 090° BB, Mr = 270°, Mv = 270° + 045° = <b>315°</b>.',
              'Rumo 300°, boia na bochecha de boreste: Mr = 045°, Mv = 300° + 045° = <b>345°</b>.',
              'Rumo 300°, ilha no través de boreste: Mv = 300° + 090° = 390°, menos 360° = <b>030°</b>.',
            ] },
            { t: 'callout', tipo: 'seguranca', titulo: 'Marcação que não muda é sinal de perigo', html: 'Se você mantém rumo e velocidade e outro barco que se aproxima continua na mesma marcação (por exemplo, sempre na sua bochecha de boreste), vocês estão em rota de colisão. O RIPEAM manda presumir risco de abalroamento quando a marcação não se altera de forma apreciável. Acompanhe a marcação desde cedo.' },
            { t: 'callout', tipo: 'dica', titulo: 'E o relógio?', html: 'Em conversa informal, muita gente usa as horas do relógio: “barco às três horas” é o través de boreste. Funciona, mas na prova e no rádio use os nomes das direções ou os graus.' },
            { t: 'termos', ids: ['bochecha', 'traves', 'alheta', 'marcacao-relativa', 'marcacao', 'rumo-verdadeiro', 'risco-de-abalroamento', 'ultrapassagem'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-010', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Uma boia está na marcação relativa 270°. Onde ela está?',
                alternativas: ['No través de bombordo', 'No través de boreste', 'Pela popa', 'Na bochecha de bombordo'],
                correta: 0,
                explicacao: 'Contando da proa no sentido horário, 270° é o través de bombordo. O través de boreste é 090°; a popa, 180°; a bochecha de bombordo, 315°.',
                referencia: 'Manual de Navegação (Miguens), vol. I, DHN, item 1.8', fonte_url: MIG1 },
              { id: 'arrais-1-011', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 2,
                enunciado: 'Você navega no rumo verdadeiro 045° e vê um farol exatamente no través de boreste. Qual é a marcação verdadeira do farol?',
                alternativas: ['135°', '045°', '315°', '090°'],
                correta: 0,
                explicacao: 'Través de boreste é Mr 090°. Mv = Mr + rumo = 090° + 045° = 135°. 045° é só o rumo. 315° seria o través de bombordo (270° + 045°). 090° é a marcação relativa, não a verdadeira.',
                referencia: 'Manual de Navegação (Miguens), vol. I, DHN, item 1.8 (Mv = Mr + R)', fonte_url: MIG1 },
              { id: 'arrais-1-012', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'A alheta de bombordo corresponde, aproximadamente, à marcação relativa:',
                alternativas: ['225°', '135°', '315°', '045°'],
                correta: 0,
                explicacao: 'A alheta fica entre o través e a popa: 135° a boreste e 225° a bombordo. 315° e 045° são as bochechas de bombordo e de boreste.',
                referencia: 'Arte Naval, vol. 1; Miguens, vol. I, item 1.8', fonte_url: MIG1 },
              { id: 'arrais-1-013', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 2,
                enunciado: 'A marcação polar 030° BB equivale a qual marcação relativa?',
                alternativas: ['330°', '030°', '210°', '150°'],
                correta: 0,
                explicacao: 'A polar a bombordo se converte fazendo 360° − 030° = 330°. 030° seria a polar a boreste. 210° e 150° confundem com direções por ante a ré do través.',
                referencia: 'Manual de Navegação (Miguens), vol. I, DHN, item 1.8 (marcação polar)', fonte_url: MIG1 },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Manual de Navegação da Marinha do Brasil (Miguens), vol. I, DHN, 2ª rev. 2023, item 1.8: rumos e marcações (relativa, polar e verdadeira)', url: MIG1 },
              { txt: 'RIPEAM-72, Regras 7(d), 13(b) e 21(a): marcação constante, alcançador e setor da luz de mastro', url: RIPEAM, ref: 'tecnico-18' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): direções a bordo', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l5',
          titulo: 'Classificação das embarcações e as embarcações miúdas',
          minutos: 12,
          objetivos: [
            'Classificar uma embarcação pelo comprimento segundo a NORMAM-211',
            'Reconhecer os tipos de embarcação miúda e de propulsão',
            'Saber quando a habilitação é dispensada e qual é a mínima em águas interiores',
          ],
          blocos: [
            { t: 'p', html: 'A NORMAM-211 classifica as embarcações de esporte e recreio pelo <b>comprimento</b>. A classe decide quais equipamentos são obrigatórios, que documentos o barco precisa e qual habilitação o condutor deve ter. Por isso a prova cobra os limites com exatidão.' },
            { t: 'fato', ref: 'normas-15', html: '<b>Embarcação miúda</b>: comprimento menor ou igual a 6 m.' },
            { t: 'fato', ref: 'normas-16', html: '<b>Pequeno porte</b> (art. 1.7): comprimento maior que 6 m e menor que 12 m. Um veleiro de cerca de 20 a 39 pés cai aqui; um de 32 pés (9,75 m), por exemplo.' },
            { t: 'fato', ref: 'normas-17', html: '<b>Médio porte</b> (art. 1.7): comprimento maior que 12 m e menor que 24 m.' },
            { t: 'fato', ref: 'normas-19', html: '<b>Grande porte ou iate</b>: comprimento igual ou maior que 24 m.' },
            { t: 'figura', svg: svg('0 0 400 230', 'Faixas de comprimento das classes de embarcação da NORMAM-211, de 0 a 30 metros',
                '<rect x="20" y="70" width="72" height="34" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<rect x="92" y="70" width="72" height="34" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<rect x="164" y="70" width="144" height="34" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<rect x="308" y="70" width="72" height="34" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
                t(56, 92, 'miúda', 15) + t(128, 92, 'pequeno', 15) + t(236, 92, 'médio porte', 15) + t(344, 92, 'grande', 15) +
                '<g stroke="var(--ink)" stroke-width="1.5"><line x1="20" y1="104" x2="20" y2="114"/><line x1="92" y1="104" x2="92" y2="114"/><line x1="164" y1="104" x2="164" y2="114"/><line x1="308" y1="104" x2="308" y2="114"/><line x1="380" y1="104" x2="380" y2="114"/></g>' +
                t(20, 132, '0', 15) + t(92, 132, '6 m', 15) + t(164, 132, '12 m', 15) + t(308, 132, '24 m', 15) + t(380, 132, '30', 15) +
                '<line x1="137" y1="58" x2="137" y2="116" stroke="var(--magenta)" stroke-width="3"/>' +
                t(137, 50, 'ex.: 32 pés = 9,75 m', 15, 'middle', 'fill="var(--magenta)" font-weight="700"') +
                '<line x1="94" y1="166" x2="306" y2="166" stroke="var(--ink)" stroke-width="2"/><line x1="94" y1="160" x2="94" y2="172" stroke="var(--ink)" stroke-width="2"/><line x1="306" y1="160" x2="306" y2="172" stroke="var(--ink)" stroke-width="2"/>' +
                t(200, 192, 'Glossário e quadros de equipamentos:', 15) + t(200, 212, '“médio porte” = menos de 24 m, exceto miúdas', 15)),
              legenda: 'Faixas do art. 1.7 (barras) e a leitura do Glossário e dos quadros de equipamentos (linha de baixo), que tratam tudo entre 6 e 24 m como médio porte.' },
            { t: 'callout', tipo: 'nota', titulo: 'A norma tem duas definições de médio porte', html: 'O Glossário da NORMAM-211 define médio porte como “comprimento inferior a 24 metros, exceto as miúdas”, o que inclui a faixa de 6 a 12 m. Os quadros de equipamentos obrigatórios (arts. 4.33 a 4.35) só têm colunas para miúdas, médio porte e grande porte, e separam dentro do médio porte o que vale para “menos de 12 m” e “12 m ou mais”. Na prática, um veleiro de cruzeiro de cerca de 20 a 39 pés (mais de 6 m e menos de 12 m), como um de 32 pés, segue a coluna de médio porte com menos de 12 m; a partir de 12 m (cerca de 40 pés), vale a coluna de 12 m ou mais.' },
            { t: 'fato', ref: 'normas-18', html: 'Glossário: médio porte é a embarcação com comprimento inferior a 24 m, exceto as miúdas.' },
            { t: 'h', txt: 'Tipos de embarcação miúda' },
            { t: 'p', html: 'O programa pede identificar e classificar as embarcações miúdas. Uma forma prática é pela propulsão:' },
            { t: 'lista', itens: [
              '<b>A remo</b>: caiaques, canoas, botes a remo.',
              '<b>A vela</b>: dingues e monotipos de escola e regata, como o Optimist, o ILCA (antigo Laser) e os catamarãs de praia.',
              '<b>A motor</b>: botes infláveis com motor de popa, lanchas pequenas, as voadeiras de alumínio e as canoas com motor de rabeta, comuns nos rios da Amazônia.',
              '<b>Moto aquática</b>: é miúda, mas exige a categoria Motonauta (veja abaixo).',
            ] },
            { t: 'p', html: 'Quanto ao motor, os tipos mais comuns são: <b>motor de popa</b> (fora de borda, preso no espelho de popa e que gira inteiro para governar), <b>motor de centro</b> (dentro do casco, com eixo, hélice e leme separado), <b>centro-rabeta</b> (motor dentro, “pé” externo que gira) e <b>jato d’água</b> (moto aquática). O módulo 3 mostra como cada um manobra.' },
            { t: 'fato', ref: 'normas-37', html: 'Só estão dispensados de habilitação os condutores de dispositivos flutuantes e de embarcações miúdas <b>sem propulsão mecânica</b> (sem motor), usados para esporte ou recreio. Um caiaque não exige habilitação; um bote inflável com motor de popa, sim.' },
            { t: 'fato', ref: 'normas-26', html: 'O Arrais-Amador conduz embarcações nos limites da navegação interior, <b>exceto moto aquática</b>.' },
            { t: 'fato', ref: 'normas-27', html: 'A moto aquática exige a categoria Motonauta.' },
            { t: 'fato', ref: 'normas-33', html: 'Em navegação interior, a habilitação mínima é Veleiro, Arrais-Amador ou Motonauta (conforme o tipo) para as miúdas, e Arrais-Amador para as de médio e grande porte.' },
            { t: 'fato', ref: 'extra-arrais-1-35', html: 'Identificação no casco: a miúda leva só o número de inscrição; as de médio e grande porte levam o nome nos dois bordos, o porto e o número de inscrição.' },
            { t: 'h', txt: 'Deslocamento ou planeio' },
            { t: 'p', html: 'Os cascos também se dividem pelo jeito de andar. O <b>casco de deslocamento</b>, como o de um veleiro de cruzeiro, sempre empurra a água para os lados e tem uma velocidade máxima prática ligada ao comprimento na linha d’água. O <b>casco de planeio</b>, como o de uma lancha rápida, sobe e passa a deslizar por cima da água a partir de certa velocidade. Isso muda a manobra: lancha em planeio faz onda grande e para devagar quando reduz.' },
            { t: 'termos', ids: ['embarcacao-miuda', 'embarcacao-de-medio-porte', 'iate', 'comprimento', 'motonauta', 'arrais-amador', 'navegacao-interior', 'inscricao', 'planar', 'deslocamento'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-014', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 1,
                enunciado: 'Pela NORMAM-211, uma embarcação de 5,8 m de comprimento é classificada como:',
                alternativas: ['Miúda', 'De pequeno porte', 'De médio porte', 'De grande porte'],
                correta: 0,
                explicacao: 'Miúda é a embarcação com comprimento menor ou igual a 6 m, o caso de 5,8 m. Pequeno porte começa acima de 6 m (art. 1.7). Médio porte, no art. 1.7, vai de 12 m a 24 m. Grande porte é 24 m ou mais.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.7', fonte_url: NORMAM },
              { id: 'arrais-1-015', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 1,
                enunciado: 'Uma lancha de 26 m de comprimento é, para a NORMAM-211, uma embarcação:',
                alternativas: ['De grande porte (iate)', 'De médio porte', 'De pequeno porte', 'Miúda'],
                correta: 0,
                explicacao: 'Grande porte ou iate é a embarcação com 24 m ou mais. Médio porte fica abaixo de 24 m; pequeno porte, entre 6 e 12 m; miúda, até 6 m.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.7', fonte_url: NORMAM },
              { id: 'arrais-1-016', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 2,
                enunciado: 'Quem está dispensado da habilitação de amador?',
                alternativas: ['O condutor de embarcação miúda sem propulsão mecânica usada para esporte ou recreio, como um caiaque', 'O condutor de qualquer embarcação miúda, com ou sem motor', 'O condutor de moto aquática, por ser embarcação miúda', 'Qualquer condutor que navegue só em águas interiores'],
                correta: 0,
                explicacao: 'A dispensa vale só para dispositivos flutuantes e embarcações miúdas sem propulsão mecânica (sem motor), em esporte ou recreio. Miúda com motor exige habilitação. A moto aquática exige a categoria Motonauta. Navegar em águas interiores com embarcação a motor exige, no mínimo, a habilitação compatível com o tipo de embarcação.',
                referencia: 'NORMAM-211/DPC, Cap. 5, art. 5.5.6', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Cap. 1, art. 1.7 e Glossário: classes de embarcação', url: NORMAM, ref: 'normas-18' },
              { txt: 'NORMAM-211/DPC, Cap. 5, arts. 5.3.3 e 5.5.6: categorias e dispensa de habilitação', url: NORMAM, ref: 'normas-37' },
              { txt: 'NORMAM-211/DPC, Cap. 4, art. 4.33: quadro de navegação interior (habilitação mínima, identificação)', url: NORMAM, ref: 'extra-arrais-1-35' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): tipos de embarcações', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l6',
          titulo: 'O leme e seus efeitos',
          minutos: 12,
          objetivos: [
            'Explicar por que o leme só atua com água passando por ele',
            'Prever para onde vão a proa e a popa quando você carrega o leme',
            'Usar a cana e a roda de leme e as ordens de leme corretas',
          ],
          blocos: [
            { t: 'p', html: 'O <b>leme</b> é uma lâmina móvel na popa, dentro da água. Reto (a meia-nau), ele não faz força. Quando você o inclina para um bordo, a água que passa por ele empurra a popa para o bordo contrário. A popa vai para um lado, a proa vai para o outro, e o barco <b>guina</b>.' },
            { t: 'h', txt: 'O que o leme faz, e o que não faz' },
            { t: 'lista', itens: [
              'Com o barco andando para vante e o leme carregado a boreste, a popa é empurrada para bombordo e a proa guina para boreste.',
              'O leme só atua com água passando por ele. Ela vem do <b>seguimento</b> (o barco andando pela água) ou do jato do hélice logo à frente do leme. Barco parado, com o motor desengrenado, não obedece ao leme.',
              'Quanto mais rápido a água passa, mais força o leme faz. Muito devagar, ele quase não responde.',
              'Exagerar no ângulo não ajuda. Passando de uns 35°, a água descola da lâmina e o leme mais freia do que governa.',
              'Dando atrás, o leme perde muita eficiência. O módulo 3 mostra como governar a ré.',
            ] },
            { t: 'h', txt: 'O ponto de giro e a popa que “varre”' },
            { t: 'p', html: 'Ao guinar, o barco gira em torno de um <b>ponto de giro</b>. Andando para vante, esse ponto fica mais perto da proa (uma boa referência é cerca de um terço do comprimento a partir dela). Resultado: a proa entra na curva, e a popa desliza para fora dela. Ao sair de um cais com o cais a boreste, se você carregar o leme a bombordo cedo demais, a popa bate no cais. Primeiro afaste o barco, depois guine.' },
            { t: 'figura', svg: svg('0 0 400 390', 'Leme carregado a boreste: a força empurra a popa para bombordo e a proa guina para boreste em torno do ponto de giro',
                defs('m1l6a', 'var(--magenta)') + defs('m1l6b') +
                cascoTopo(200, 50, 260, 110) +
                '<line x1="200" y1="310" x2="226" y2="352" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>' +
                '<circle cx="200" cy="137" r="7" fill="var(--magenta)"/>' +
                '<line x1="146" y1="137" x2="192" y2="137" stroke="var(--magenta)" stroke-width="1.5"/>' + t(140, 142, 'ponto de giro', 15, 'end') +
                '<line x1="196" y1="290" x2="120" y2="290" stroke="var(--magenta)" stroke-width="4" marker-end="url(#m1l6a)"/>' +
                t(110, 276, 'popa vai', 15, 'end', 'fill="var(--magenta)"') + t(110, 296, 'para BB', 15, 'end', 'fill="var(--magenta)"') +
                '<path d="M206,34 Q246,24 274,54" fill="none" stroke="var(--magenta)" stroke-width="4" marker-end="url(#m1l6a)"/>' +
                t(282, 46, 'proa guina', 15, 'start', 'fill="var(--magenta)"') + t(282, 66, 'para BE', 15, 'start', 'fill="var(--magenta)"') +
                '<line x1="252" y1="250" x2="252" y2="320" stroke="var(--ink)" stroke-width="2" marker-end="url(#m1l6b)"/>' +
                '<line x1="148" y1="250" x2="148" y2="320" stroke="var(--ink)" stroke-width="2" marker-end="url(#m1l6b)"/>' +
                t(268, 286, 'água', 15, 'start') +
                t(234, 374, 'leme a boreste', 15, 'start', 'font-weight="700"')),
              legenda: 'Vista de cima, barco andando para vante. Com o leme a boreste, a água empurra a popa para bombordo e o barco gira em torno do ponto de giro, mais perto da proa.' },
            { t: 'h', txt: 'Cana e roda de leme' },
            { t: 'p', html: 'Na <b>roda de leme</b> (timão), gira-se para o lado em que se quer ir, como o volante de um carro. Na <b>cana do leme</b>, comum em veleiros pequenos e médios, é o contrário: empurra-se a cana para o lado oposto. Cana para bombordo, proa para boreste. Treine isso em água aberta antes de manobrar perto de outros barcos.' },
            { t: 'h', txt: 'Ordens de leme' },
            { t: 'lista', itens: [
              '“Leme a boreste” ou “leme a bombordo”, de preferência com o ângulo: “leme a boreste 15”.',
              '“Todo o leme a bombordo”: o máximo para aquele bordo.',
              '“Leme a meio”: leme reto, a meia-nau.',
              '“Assim”: mantenha a proa exatamente onde está agora.',
              '“Governe no 270”: mantenha o rumo 270°.',
            ] },
            { t: 'p', html: 'Quem está no leme repete a ordem em voz alta e avisa quando a cumpriu. Parece formal demais num passeio, mas evita o clássico “é para o outro lado!” numa manobra apertada.' },
            { t: 'h', txt: 'Motor de popa, rabeta e veleiro' },
            { t: 'p', html: 'No motor de popa e na centro-rabeta, não há leme separado: o próprio motor gira e aponta o jato do hélice. Isso dá muito governo, até devagar, mas só enquanto o hélice empurra. Em ponto morto, o barco quase não governa. No veleiro, o leme trabalha junto com as velas e a quilha. Um barco que puxa muito a proa para o vento pede leme o tempo todo: é sinal de pano demais ou de barco adernado demais, assunto do curso de vela.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'A popa e o hélice', html: 'Como a popa varre para fora da curva e é lá que fica o hélice, nunca guine fechado perto de banhistas, mergulhadores ou de alguém na água. Afaste-se em linha reta, devagar, e só então guine.' },
            { t: 'termos', ids: ['leme', 'madre-do-leme', 'cana-do-leme', 'roda-de-leme', 'seguimento', 'guinar', 'governar', 'timoneiro'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-017', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Com o barco andando para vante, você carrega o leme a boreste. O que acontece?',
                alternativas: ['A popa é empurrada para bombordo e a proa guina para boreste', 'A popa e a proa vão juntas para boreste', 'Nada: o leme só atua dando atrás', 'O barco anda de lado para boreste, sem girar'],
                correta: 0,
                explicacao: 'A força da água no leme empurra a popa para o bordo oposto (bombordo), e o barco gira, levando a proa para boreste. Popa e proa não vão para o mesmo lado, porque o barco gira em torno do ponto de giro. O leme atua dando adiante (e, com menos eficiência, dando atrás). O barco não anda de lado só pela ação do leme.',
                referencia: 'Arte Naval, vol. 2 (manobra: ação do leme)' },
              { id: 'arrais-1-018', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 2,
                enunciado: 'Por que uma lancha de motor de centro, parada e com o motor desengrenado, não obedece ao leme?',
                alternativas: ['Porque o leme precisa de água passando por ele, por seguimento ou pelo jato do hélice', 'Porque o leme fica travado quando o motor está em ponto morto', 'Porque o leme só funciona em água salgada', 'Porque o leme depende do vento no casco'],
                correta: 0,
                explicacao: 'A força do leme vem da água que corre pela lâmina. Sem seguimento e sem o jato do hélice, não há força. O ponto morto não trava o leme, só deixa de mandar água para ele. A salinidade e o vento não são o que faz o leme funcionar.',
                referencia: 'Arte Naval, vol. 2 (manobra: ação do leme)' },
              { id: 'arrais-1-019', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 1,
                enunciado: 'Num veleiro governado por cana do leme, para guinar a proa para bombordo você deve levar a cana para:',
                alternativas: ['Boreste', 'Bombordo', 'Vante', 'Ré'],
                correta: 0,
                explicacao: 'A cana trabalha ao contrário: cana para boreste vira a lâmina para bombordo, e a proa vai para bombordo. Cana para bombordo levaria a proa para boreste. Vante e ré não são direções de comando da cana.',
                referencia: 'Arte Naval, vol. 2 (aparelho de governo)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Fonseca, M. M. Arte Naval, vol. 2 (SDM, 2019): aparelho de governo e manobra do navio (ação do leme, ponto de giro)', url: ARTE },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) V: leme e seus efeitos', url: NORMAM, ref: 'extra-arrais-1-01' },
              { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (Simon & Schuster, 2014): steering and boat handling', url: ANNAPOLIS },
            ] },
          ],
        },
      ],
    },

{
      id: 'm2',
      titulo: 'Marinharia: cabos, nós e voltas',
      resumo: 'Os cabos de bordo, como cuidar deles e os nós que todo arrais precisa dar sem pensar: lais de guia, oito, direito, escota, volta do fiel, volta redonda com dois cotes e volta no cunho. Com animação passo a passo.',
      licoes: [
        {
          id: 'l1',
          titulo: 'Cabos: materiais, construção e cuidados',
          minutos: 12,
          objetivos: [
            'Reconhecer os principais materiais de cabo e onde usar cada um',
            'Distinguir cabo torcido de cabo trançado e entender a cocha',
            'Cuidar dos cabos para que durem e não falhem na hora errada',
          ],
          blocos: [
            { t: 'p', html: 'A bordo, toda “corda” se chama <b>cabo</b>. Diz a tradição da Marinha que a bordo só existem duas cordas, a do sino e a do relógio; o resto é cabo. Cada cabo também ganha o nome da sua função: <b>espia</b> (amarração), <b>escota</b> (regula a vela), <b>adriça</b> (iça a vela), <b>retinida</b> (cabo fino de arremesso), <b>amarra</b> (liga a âncora ao barco).' },
            { t: 'h', txt: 'Materiais' },
            { t: 'tabela', cab: ['Material', 'Como se comporta', 'Uso típico a bordo'], linhas: [
              ['Poliamida (náilon)', 'Forte e muito elástico: absorve trancos. Perde um pouco de resistência molhado. Afunda.', 'Espias de amarração, cabo de âncora, reboque'],
              ['Poliéster', 'Pouco elástico, resiste bem ao sol e ao atrito. Afunda.', 'Escotas, adriças e cabos de manobra em geral'],
              ['Polipropileno', 'Leve, barato e <b>flutua</b>. Degrada rápido ao sol e escorrega nos nós.', 'Retinidas, cabo da boia salva-vidas'],
              ['Polietileno de alto desempenho (HMPE, como o Dyneema)', 'Muito forte e quase sem alongamento. Flutua, escorrega e não tolera calor.', 'Adriças e escotas de alto desempenho'],
              ['Fibras naturais (sisal, manila, algodão)', 'Apodrecem e perdem resistência com a umidade.', 'Hoje, quase só decoração'],
              ['Cabo de aço', 'Muito resistente, quase não estica, pouco flexível.', 'Aparelho fixo: estais e brandais'],
            ], legenda: 'Escolha o material pela função: elasticidade para amarrar e fundear, pouco alongamento para regular velas, flutuação para o que se joga na água.' },
            { t: 'h', txt: 'Construção: torcido ou trançado' },
            { t: 'p', html: 'No <b>cabo torcido</b>, as fibras formam fios, os fios formam <b>cordões</b>, e três cordões são torcidos juntos. Essa torção é a <b>cocha</b>, e a maioria dos cabos tem cocha à direita. O cabo torcido é fácil de costurar, mas forma <b>cocas</b> (dobras torcidas) se for enrolado contra a cocha.' },
            { t: 'p', html: 'No <b>cabo trançado</b>, uma <b>capa</b> trançada protege uma <b>alma</b> que faz a maior parte da força. É mais macio na mão, trabalha melhor nas catracas e quase não forma cocas. Por isso é o padrão em escotas e adriças.' },
            { t: 'figura', svg: svg('0 0 400 300', 'Cabo torcido de três cordões e cabo trançado com capa e alma, com os cortes transversais',
                '<defs><clipPath id="m2l1c1"><rect x="100" y="50" width="270" height="44" rx="22"/></clipPath><clipPath id="m2l1c2"><rect x="100" y="166" width="236" height="44" rx="22"/></clipPath></defs>' +
                t(235, 36, 'Torcido (cochado)', 16, 'middle', 'font-weight="700"') +
                '<rect x="100" y="50" width="270" height="44" rx="22" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2"/>' +
                '<g clip-path="url(#m2l1c1)" stroke="var(--ink)" stroke-width="2.5">' +
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(function (i) { var x = 80 + i * 22; return '<line x1="' + x + '" y1="50" x2="' + (x + 26) + '" y2="94"/>'; }).join('') + '</g>' +
                '<circle cx="50" cy="62" r="11" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2"/><circle cx="40" cy="80" r="11" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2"/><circle cx="60" cy="80" r="11" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2"/>' +
                t(50, 116, 'corte', 15) +
                t(235, 152, 'Trançado (capa e alma)', 16, 'middle', 'font-weight="700"') +
                '<rect x="320" y="178" width="56" height="20" rx="10" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="2"/>' +
                '<rect x="100" y="166" width="236" height="44" rx="22" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
                '<g clip-path="url(#m2l1c2)" stroke="var(--ink)" stroke-width="1.6">' +
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (i) { var x = 90 + i * 14; return '<line x1="' + x + '" y1="166" x2="' + (x + 22) + '" y2="210"/><line x1="' + (x + 22) + '" y1="166" x2="' + x + '" y2="210"/>'; }).join('') + '</g>' +
                t(372, 230, 'alma', 15, 'end') +
                '<circle cx="50" cy="188" r="22" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/><circle cx="50" cy="188" r="11" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="2"/>' +
                t(50, 232, 'corte', 15) +
                t(200, 268, 'A torção dos cordões é a cocha.', 15) + t(200, 290, 'Quase todo cabo tem cocha à direita.', 15)),
              legenda: 'À esquerda, o corte de cada cabo: três cordões no torcido; capa em volta da alma no trançado.' },
            { t: 'h', txt: 'Bitola e resistência' },
            { t: 'p', html: 'A grossura do cabo é a <b>bitola</b>, hoje dada pelo diâmetro em milímetros. A resistência depende do material, da construção e da bitola: consulte a tabela do fabricante. Lembre que todo nó enfraquece o cabo no ponto em que ele dobra. Uma <b>costura</b> (emenda feita entrelaçando os próprios cordões) preserva bem mais resistência do que um nó.' },
            { t: 'h', txt: 'Cuidados que fazem o cabo durar' },
            { t: 'lista', itens: [
              '<b>Falcaçar</b> os chicotes (as pontas): com fita, linha ou derretendo a ponta do sintético, para não desfiar.',
              'Evitar quinas e atrito: use proteção onde a espia passa pela buzina ou encosta no cais.',
              'Lavar com água doce de vez em quando e secar à sombra. Sol e sal endurecem e enfraquecem as fibras.',
              'Não pisar nos cabos nem deixá-los perto de combustível, ácido de bateria ou fontes de calor.',
              'Guardar aduchado (enrolado), seco e arejado.',
              'Inspecionar: fios partidos, capa gasta mostrando a alma, trechos duros ou vitrificados (sinal de calor). Cabo assim se troca.',
            ] },
            { t: 'callout', tipo: 'seguranca', titulo: 'Chicotada', html: 'Um cabo sintético muito esticado, como uma espia de náilon sob carga ou um cabo de reboque, guarda muita energia. Se partir ou escapar, volta como um chicote. Nunca fique na linha de um cabo sob tensão nem no seio dele.' },
            { t: 'termos', ids: ['cabo', 'espia', 'escota', 'adrica', 'retinida', 'amarra', 'bitola', 'falcaca', 'costura'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-020', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Qual material é o mais indicado para a retinida da boia salva-vidas, que precisa boiar?',
                alternativas: ['Polipropileno', 'Poliamida (náilon)', 'Poliéster', 'Cabo de aço'],
                correta: 0,
                explicacao: 'O polipropileno flutua, por isso é usado em retinidas e no cabo da boia salva-vidas. Poliamida e poliéster afundam (a poliamida é ótima para espias, pela elasticidade; o poliéster, para escotas e adriças). Cabo de aço afunda e é do aparelho fixo.',
                referencia: 'Arte Naval, vol. 1 (cabos)' },
              { id: 'arrais-1-021', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Por que a poliamida (náilon) é a preferida para espias de amarração?',
                alternativas: ['Porque é elástica e absorve os trancos do barco no cais', 'Porque flutua e é fácil de recuperar', 'Porque quase não estica, mantendo o barco imóvel', 'Porque não sofre com atrito nem com o sol'],
                correta: 0,
                explicacao: 'A elasticidade da poliamida amortece os puxões causados por ondas e marolas, poupando cabo, cunhos e casco. Ela afunda (quem flutua é o polipropileno). Pouco alongamento é característica do poliéster e do HMPE, bons para velas, não para amarrar. E nenhum cabo é imune a atrito e sol.',
                referencia: 'Arte Naval, vol. 1 (cabos)' },
              { id: 'arrais-1-022', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Falcaçar um cabo é:',
                alternativas: ['Fazer um acabamento no chicote para que ele não desfie', 'Emendar dois cabos entrelaçando os cordões', 'Enrolar o cabo em voltas regulares para guardá-lo', 'Esticar o cabo até ficar firme'],
                correta: 0,
                explicacao: 'Falcaça é o acabamento do chicote, com linha, fita ou calor. Emendar entrelaçando cordões é costurar. Enrolar em voltas regulares é aduchar. Esticar é tesar.',
                referencia: 'Arte Naval, vol. 1 (trabalhos do marinheiro)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): cabos (materiais, construção, cuidados)', url: ARTE },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) I: marinharia, nós e voltas', url: NORMAM, ref: 'extra-arrais-1-01' },
              { txt: 'PortoGente, entrevista com o Capitão dos Portos do Espírito Santo: “Corda, somente, de relógio ou do sino” (tradição da Marinha)', url: PORTOGENTE },
            ] },
          ],
        },
        {
          id: 'l2',
          titulo: 'Partes do cabo e como arrumá-lo: chicote, seio, firme e aducha',
          minutos: 10,
          objetivos: [
            'Usar os nomes das partes de um cabo para seguir instruções de nós',
            'Aduchar um cabo para que corra sem enroscar',
            'Entender os verbos da manobra: caçar, folgar, tesar, solecar, içar e arriar',
          ],
          blocos: [
            { t: 'p', html: 'Toda instrução de nó usa três ou quatro palavras. Aprenda-as uma vez e qualquer passo a passo fica claro.' },
            { t: 'lista', itens: [
              '<b>Chicote</b>: a ponta do cabo, a parte que trabalha para fazer o nó.',
              '<b>Firme</b>: o resto do cabo, que fica parado, preso ou sob tensão.',
              '<b>Seio</b>: uma dobra em forma de U, no meio do cabo. Dar um nó “pelo seio” é dá-lo sem usar o chicote.',
              '<b>Alça</b>: um laço fechado, feito por nó ou costura.',
              '<b>Volta</b>: uma passagem completa do cabo em torno de algo. <b>Cote</b>: uma volta simples do cabo em torno de si mesmo ou de um objeto.',
            ] },
            { t: 'figura', svg: svg('0 0 400 300', 'Partes de um cabo: firme preso a um cabeço, seio, alça e chicote falcaçado',
                '<rect x="6" y="92" width="18" height="56" rx="4" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/>' +
                '<path d="M24,120 L150,120 C172,120 170,250 200,250 C230,250 228,120 250,120 C292,120 318,92 306,68 C294,46 262,56 270,88 C276,112 318,132 372,132" fill="none" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>' +
                '<path d="M24,120 L150,120 C172,120 170,250 200,250 C230,250 228,120 250,120 C292,120 318,92 306,68 C294,46 262,56 270,88 C276,112 318,132 372,132" fill="none" stroke="var(--sea-2)" stroke-width="9" stroke-linecap="round"/>' +
                '<g stroke="var(--ink)" stroke-width="2"><line x1="360" y1="124" x2="360" y2="140"/><line x1="365" y1="124" x2="365" y2="140"/></g>' +
                t(86, 104, 'firme', 15, 'middle', 'font-weight="700"') +
                t(200, 282, 'seio', 15, 'middle', 'font-weight="700"') +
                t(288, 40, 'alça', 15, 'middle', 'font-weight="700"') +
                t(392, 166, 'chicote (falcaçado)', 15, 'end', 'font-weight="700"') +
                t(30, 176, 'cabeço', 15, 'start')),
              legenda: 'O firme sai do cabeço, o seio é a dobra em U, a alça é o laço fechado e o chicote é a ponta, com a falcaça.' },
            { t: 'h', txt: 'Os verbos da manobra' },
            { t: 'lista', itens: [
              '<b>Alar</b>: puxar um cabo. <b>Caçar</b>: puxar para dentro, como a escota que fecha a vela.',
              '<b>Folgar</b>: soltar um pouco, de forma controlada (o contrário de caçar).',
              '<b>Tesar</b>: esticar até ficar firme. <b>Solecar</b>: dar folga num cabo que estava teso.',
              '<b>Içar</b>: subir (uma vela, uma bandeira). <b>Arriar</b>: baixar.',
              '<b>Aguentar</b>: segurar sem deixar correr. <b>Largar</b>: soltar de vez. <b>Dar volta</b>: prender no cunho ou no cabeço.',
            ] },
            { t: 'h', txt: 'Aduchar: o cabo pronto para correr' },
            { t: 'p', html: '<b>Aduchar</b> é enrolar o cabo em voltas regulares, formando uma <b>aducha</b>. Um cabo bem aduchado corre limpo quando você precisa: ao jogar uma retinida, ao largar a âncora, ao passar uma espia para o cais. Um cabo embolado trava no pior momento.' },
            { t: 'lista', ordenada: true, itens: [
              'Comece pela ponta que está presa (o firme) e vá até o chicote, para que as voltas corram na ordem certa.',
              'Cabo torcido de cocha à direita: faça as voltas no sentido horário, dando um pequeno giro entre os dedos a cada volta para não formar coca.',
              'Cabo trançado: prefira aduchar “em oito”, alternando o lado das voltas. Assim o cabo não acumula torção.',
              'Para guardar, prenda a aducha com o próprio chicote (algumas voltas em torno dela e uma alça por cima) e pendure em local seco.',
              'Adriças: aduche a sobra e pendure a aducha no próprio cunho, onde ela fica pronta para correr.',
            ] },
            { t: 'callout', tipo: 'dica', titulo: 'Antes de arremessar, prenda o chicote', html: 'Para jogar um cabo ao cais, divida a aducha em duas mãos: arremesse a de uma mão e deixe a da outra correr. E antes de tudo prenda o chicote do lado de bordo num cunho. Um cabo arremessado inteiro, sem ponta presa, vai para a água com aducha e tudo.' },
            { t: 'termos', ids: ['chicote', 'firme', 'seio', 'alca', 'volta', 'cote', 'aduchar', 'tesar', 'solecar', 'cacar', 'folgar', 'icar'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-023', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Na linguagem da marinharia, o chicote de um cabo é:',
                alternativas: ['A ponta do cabo', 'A parte do cabo que fica presa e sob tensão', 'Uma dobra em forma de U no meio do cabo', 'Um laço fechado feito por costura'],
                correta: 0,
                explicacao: 'Chicote é a ponta, a parte que trabalha no nó. A parte presa e sob tensão é o firme. A dobra em U é o seio. O laço fechado é a alça.',
                referencia: 'Arte Naval, vol. 1 (trabalhos do marinheiro)' },
              { id: 'arrais-1-024', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Como se deve aduchar um cabo torcido de cocha à direita para que ele não forme cocas?',
                alternativas: ['Em voltas no sentido horário', 'Em voltas no sentido anti-horário', 'Dobrado em zigue-zague no convés', 'Torcendo o cabo contra a cocha a cada volta'],
                correta: 0,
                explicacao: 'Cabo de cocha à direita se aducha no sentido horário, a favor da cocha. No sentido anti-horário, cada volta acrescenta torção contrária e o cabo forma cocas. O zigue-zague não é a aducha correta para o cabo torcido (para o trançado, usa-se aduchar em oito). Torcer contra a cocha é justamente o que cria as cocas.',
                referencia: 'Arte Naval, vol. 1 (cabos: cocha e aducha)' },
              { id: 'arrais-1-025', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'O comandante pede para “folgar a escota”. O que você faz?',
                alternativas: ['Solta um pouco a escota, de forma controlada', 'Puxa a escota para dentro', 'Solta a escota de vez, deixando-a correr toda', 'Prende a escota no cunho'],
                correta: 0,
                explicacao: 'Folgar é soltar um pouco, controlando. Puxar para dentro é caçar. Soltar de vez é largar. Prender no cunho é dar volta.',
                referencia: 'Arte Naval, vol. 2 (manobra: vozes de comando)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): cabos e trabalhos do marinheiro', url: ARTE },
              { txt: 'Ashley, C. W. The Ashley Book of Knots (1944): terminologia de cabos e nós', url: ASHLEY },
            ] },
          ],
        },
        {
          id: 'l3',
          titulo: 'Lais de guia e nó de oito',
          minutos: 12,
          objetivos: [
            'Dar o lais de guia e conferir se está certo',
            'Usar o nó de oito como batente na ponta de escotas e adriças',
            'Saber os limites e cuidados de cada um',
          ],
          blocos: [
            { t: 'p', html: 'Se você só pudesse aprender um nó, seria o <b>lais de guia</b>. Ele faz uma <b>alça fixa</b> na ponta do cabo: a alça não corre nem aperta sob carga, e o nó desata com facilidade depois, mesmo que tenha sido muito puxado. É o nó da escota no punho da vela de proa, da alça para passar num cabeço e da alça para resgatar alguém na água.' },
            { t: 'widget', w: 'nos', opts: { no: 'lais-de-guia', nos: ['lais-de-guia', 'oito'] }, legenda: 'Avance etapa por etapa e repita com um cabo de verdade. Repare por onde o chicote passa por cima e por baixo.' },
            { t: 'h', txt: 'Passo a passo do lais de guia' },
            { t: 'lista', ordenada: true, itens: [
              'Segure o firme com uma mão e, com o chicote, faça uma pequena volta (um “olho”) no firme, com o chicote <b>por cima</b>.',
              'Passe o chicote por dentro desse olho, de baixo para cima. O tamanho da alça grande se define agora.',
              'Contorne o firme por trás com o chicote.',
              'Volte o chicote para dentro do olho, de cima para baixo, pelo mesmo caminho por onde subiu.',
              'Aperte puxando ao mesmo tempo a alça (com o chicote junto) e o firme.',
            ] },
            { t: 'p', html: 'A frase clássica ajuda: “o coelho sai da toca, dá a volta na árvore e volta para a toca”. A toca é o olho; a árvore é o firme; o coelho é o chicote. No lais de guia tradicional, o chicote termina <b>por dentro</b> da alça grande. Deixe uma sobra de chicote generosa, de umas dez vezes a grossura do cabo.' },
            { t: 'h', txt: 'Cuidados com o lais de guia' },
            { t: 'lista', itens: [
              'Ele pode se soltar sozinho quando fica frouxo e sacudindo muito, como numa escota que bate com o vento. Confira de tempos em tempos.',
              'Não dá para fazer nem desfazer o lais de guia com o cabo sob carga. Para uma amarração que talvez você precise soltar puxada, use a volta redonda com dois cotes (lição 5).',
              'Para içar ou resgatar uma pessoa, a alça vai por baixo dos braços, nas costas, e não em volta do pescoço ou da cintura solta.',
            ] },
            { t: 'h', txt: 'Nó de oito: o batente' },
            { t: 'p', html: 'O <b>nó de oito</b> vai no chicote de escotas e adriças para que o cabo não escape pelo moitão ou pelo mordedor. Para dar: faça um seio perto da ponta, passe o chicote por trás do firme e enfie-o pelo seio, de cima para baixo. O desenho lembra um 8. Ele aguenta bem e, ao contrário do nó simples, desfaz-se com facilidade depois de apertado.' },
            { t: 'callout', tipo: 'dica', titulo: 'Batente não é amarração', html: 'O nó de oito evita perder cabos pelo mastro acima ou pela catraca, mas ele só <b>trava</b> o cabo, não o prende a nada. No cabo da âncora, a ponta de dentro (o chicote) precisa ficar <b>amarrada ao barco</b>, de preferência a um cunho de proa (módulo 3, lição 4): largar a âncora sem prender o cabo ao barco é um erro comum, apontado pela BoatUS Foundation.' },
            { t: 'termos', ids: ['lais-de-guia', 'no-de-oito', 'alca', 'chicote', 'firme', 'moitao', 'mordedor'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-026', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Qual nó faz uma alça fixa na ponta do cabo, que não corre nem aperta sob carga e desata com facilidade depois?',
                alternativas: ['Lais de guia', 'Nó direito', 'Volta do fiel', 'Nó de oito'],
                correta: 0,
                explicacao: 'O lais de guia é o nó de alça fixa por excelência. O nó direito serve para atar (pontos de rizo, embrulhos). A volta do fiel prende um cabo a um objeto e pode correr. O nó de oito é um batente na ponta do cabo, sem alça útil.',
                referencia: 'Ashley Book of Knots, nº 1010; Arte Naval, vol. 1' },
              { id: 'arrais-1-027', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Para que serve o nó de oito no chicote de uma escota?',
                alternativas: ['Impedir que o cabo escape pelo moitão ou pelo mordedor', 'Unir a escota a outro cabo de bitola diferente', 'Prender a escota no cunho', 'Fazer uma alça para o punho da vela'],
                correta: 0,
                explicacao: 'O nó de oito é um batente: engrossa a ponta e não deixa o cabo correr para fora do moitão. Unir cabos de bitolas diferentes é função do nó de escota. No cunho se usa a volta no cunho. A alça no punho se faz com o lais de guia.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
              { id: 'arrais-1-028', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Qual é o principal cuidado com o lais de guia numa escota de vela de proa que bate muito com o vento?',
                alternativas: ['Ele pode afrouxar e se soltar quando fica frouxo e sacudindo; deve ser conferido', 'Ele aperta tanto que só sai cortando o cabo', 'Ele faz a alça correr e estrangular o punho da vela', 'Ele enfraquece a vela por causa do atrito'],
                correta: 0,
                explicacao: 'O ponto fraco do lais de guia é soltar-se quando trabalha frouxo e sacudindo. Ele não aperta demais: é justamente fácil de desatar. Sua alça é fixa, não corre. O atrito na vela não é característica do nó.',
                referencia: 'Ashley Book of Knots, nº 1010 (cuidados)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Ashley, C. W. The Ashley Book of Knots (1944): lais de guia (nº 1010) e nó de oito', url: ASHLEY },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): nós e voltas', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l4',
          titulo: 'Unir dois cabos: nó direito e nó de escota',
          minutos: 10,
          objetivos: [
            'Dar o nó direito e reconhecer o nó torto',
            'Unir cabos de grossuras diferentes com o nó de escota',
            'Saber quando um nó de união não é seguro',
          ],
          blocos: [
            { t: 'p', html: 'Unir dois cabos parece simples, mas é onde mais se erra. O nó errado pode escorregar e se desfazer justamente quando o cabo está sob carga. Dois nós resolvem quase tudo no barco de recreio: o <b>nó direito</b> e o <b>nó de escota</b>.' },
            { t: 'widget', w: 'nos', opts: { no: 'direito', nos: ['direito', 'torto', 'escota', 'escota-dobrado'] }, legenda: 'Compare o nó direito com o nó torto e veja o nó de escota simples e dobrado.' },
            { t: 'h', txt: 'Nó direito' },
            { t: 'p', html: 'Cruze os chicotes e dê meia volta, <b>esquerdo sobre direito</b>; depois, de novo, <b>direito sobre esquerdo</b>. O nó fica chato e simétrico, com os dois chicotes saindo do mesmo lado. Ele serve para <b>atar</b>: os pontos de rizo da vela, a vela ferrada na retranca, um saco, um curativo.' },
            { t: 'p', html: 'Se você repetir o mesmo cruzamento duas vezes (direito sobre esquerdo e de novo direito sobre esquerdo), sai o <b>nó torto</b>: os chicotes ficam atravessados e o nó escorrega. Confira sempre o desenho.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Nó direito não é para unir cabos sob carga', html: 'Com cabos de grossuras diferentes ou escorregadios, ou com carga que vai e vem, o nó direito pode “virar” e se desfazer. Ele é nó de atar, não de emendar espias ou cabos de reboque.' },
            { t: 'h', txt: 'Nó de escota' },
            { t: 'p', html: 'O <b>nó de escota</b> une dois cabos, inclusive de <b>bitolas diferentes</b>, e prende um cabo a uma alça (o punho de uma vela, a alça de uma bandeira). Passo a passo:' },
            { t: 'lista', ordenada: true, itens: [
              'Faça um seio no cabo mais grosso (ou use a alça já existente).',
              'Passe o chicote do cabo mais fino por dentro do seio, de baixo para cima.',
              'Contorne por trás os dois ramos do seio.',
              'Passe o chicote por baixo dele mesmo, sem entrar no seio, e aperte.',
            ] },
            { t: 'p', html: 'Os dois chicotes devem terminar do <b>mesmo lado</b> do nó. Se ficarem em lados opostos, o nó fica mais fraco. Quando a diferença de grossura é grande ou o cabo é escorregadio, dê uma volta a mais em torno do seio antes de passar por baixo: é o <b>nó de escota dobrado</b>, bem mais seguro.' },
            { t: 'p', html: 'Onde ele aparece a bordo: emendar uma retinida fina numa espia grossa para passá-la ao cais; prender a adriça da bandeira na alça costurada da bandeira; improvisar um reboque curto para um caiaque ou bote. Em todos esses casos, o cabo mais grosso (ou a alça) forma o seio, e o mais fino o abraça.' },
            { t: 'callout', tipo: 'dica', titulo: 'Para emendas que vão trabalhar muito', html: 'Para emendar duas espias ou fazer um reboque, dois lais de guia entrelaçados (um dentro da alça do outro) são seguros e fáceis de desfazer depois. Uma emenda permanente se faz com costura.' },
            { t: 'termos', ids: ['no-direito', 'no-de-escota', 'rizo', 'bitola', 'seio', 'chicote'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-029', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Qual nó é o mais indicado para unir dois cabos de grossuras diferentes?',
                alternativas: ['Nó de escota', 'Nó direito', 'Nó de oito', 'Volta do fiel'],
                correta: 0,
                explicacao: 'O nó de escota (dobrado, se a diferença for grande) foi feito para unir cabos de bitolas diferentes. O nó direito pode virar e soltar nessa situação. O nó de oito é batente. A volta do fiel prende cabo a objeto.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
              { id: 'arrais-1-030', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Qual é o uso correto do nó direito a bordo?',
                alternativas: ['Atar os pontos de rizo da vela', 'Emendar duas espias que vão trabalhar com carga', 'Unir um cabo fino a um cabo grosso', 'Prender a escota no punho da vela de proa'],
                correta: 0,
                explicacao: 'O nó direito é um nó de atar: pontos de rizo, vela ferrada, embrulhos. Para espias sob carga ele é inseguro (use dois lais de guia entrelaçados ou costura). Cabos de grossuras diferentes pedem o nó de escota. O punho da vela de proa leva lais de guia.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
              { id: 'arrais-1-031', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Você deu um nó de união e percebeu que os chicotes saem atravessados, e o nó escorrega quando você puxa. O que provavelmente aconteceu?',
                alternativas: ['Saiu um nó torto: o mesmo cruzamento foi repetido duas vezes', 'Saiu um nó de escota dobrado', 'Os cabos são de polipropileno, que não aceita nós', 'Foi dado um nó de oito no lugar do nó direito'],
                correta: 0,
                explicacao: 'O nó torto surge quando se repete o cruzamento (direito sobre esquerdo duas vezes), e escorrega. O nó de escota dobrado é seguro e não tem esse desenho. O polipropileno escorrega mais, mas aceita nós. O nó de oito não une dois cabos.',
                referencia: 'Ashley Book of Knots (nó direito e nó torto)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Ashley, C. W. The Ashley Book of Knots (1944): nó direito, nó torto e nó de escota', url: ASHLEY },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): nós e voltas', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l5',
          titulo: 'Prender a objetos: volta do fiel, volta redonda com dois cotes e volta no cunho',
          minutos: 12,
          objetivos: [
            'Dar a volta do fiel e saber quando ela não é suficiente',
            'Usar a volta redonda com dois cotes para amarrar em argola ou cabeço',
            'Dar volta num cunho de forma segura e fácil de soltar',
          ],
          blocos: [
            { t: 'p', html: 'Os nós desta lição prendem um cabo a alguma coisa: um balaústre, uma argola do cais, um cabeço, um cunho. São os que você mais vai usar para amarrar o barco e pendurar defensas.' },
            { t: 'widget', w: 'nos', opts: { no: 'cunho', nos: ['fiel', 'volta-redonda', 'cunho'] }, legenda: 'Veja a volta do fiel, a volta redonda com dois cotes e a volta no cunho, etapa por etapa.' },
            { t: 'h', txt: 'Volta do fiel' },
            { t: 'p', html: 'Duas voltas cruzadas em torno do objeto, com o chicote passando por baixo da segunda. É rápida, fácil de ajustar e muito usada para pendurar <b>defensas</b> no balaústre ou no guarda-mancebo. O ponto fraco: com carga que muda de direção ou com o objeto girando, ela pode correr ou se soltar. Para algo que vai ficar muito tempo, acrescente um cote de segurança.' },
            { t: 'h', txt: 'Volta redonda com dois cotes' },
            { t: 'p', html: 'Dê uma <b>volta redonda</b> completa em torno da argola ou do cabeço (o cabo passa duas vezes pelo objeto) e termine com <b>dois cotes</b> no firme. A volta redonda segura a carga pelo atrito enquanto você faz os cotes com calma. E, diferente do lais de guia, ela pode ser desfeita mesmo com o cabo puxado: basta desfazer os cotes e ir folgando a volta. É a escolha para amarrar a espia numa argola do cais.' },
            { t: 'h', txt: 'Volta no cunho' },
            { t: 'lista', ordenada: true, itens: [
              'Leve o cabo até a base do cunho pelo lado mais distante da carga e dê uma <b>volta redonda completa</b> pela base. Ela já segura boa parte do esforço.',
              'Cruze o cabo por cima do cunho em forma de <b>oito</b>, uma ou duas vezes, passando sob cada chifre.',
              'Termine com uma <b>volta mordida</b>: vire o cabo sob si mesmo para que a última passada trave as anteriores.',
              'Arrume o chicote ou aduche a sobra. Não encha o cunho de voltas: fica difícil soltar com carga.',
            ] },
            { t: 'p', html: 'Para soltar, desfaça a volta mordida e os oitos e vá folgando a volta redonda com a palma da mão aberta, sentindo a carga. Assim você controla a espia até o fim.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Mão longe do cunho', html: 'Nunca enrole o cabo na mão nem segure perto do cunho quando há carga. Se o barco der um tranco, o cabo puxa a mão contra o metal. Trabalhe com a mão aberta e afastada, e use luvas em manobras com vento forte.' },
            { t: 'callout', tipo: 'dica', titulo: 'Defensas na altura certa', html: 'Ajuste as defensas com a volta do fiel para que fiquem na altura do ponto onde o casco vai encostar no cais ou no outro barco, não penduradas no ar nem arrastando na água. Recolha-as ao sair: defensa pendurada navegando é sinal de descuido.' },
            { t: 'termos', ids: ['volta-do-fiel', 'volta-redonda-e-dois-cotes', 'volta-de-cunho', 'cunho', 'cabeco', 'defensa', 'balaustre'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-032', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Qual nó é o mais usado para pendurar uma defensa no balaústre, por ser rápido e fácil de ajustar?',
                alternativas: ['Volta do fiel', 'Nó de escota', 'Nó direito', 'Nó de oito'],
                correta: 0,
                explicacao: 'A volta do fiel prende rapidamente um cabo a um tubo ou balaústre e permite ajustar a altura. O nó de escota une cabos. O nó direito ata pontas entre si. O nó de oito é batente.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
              { id: 'arrais-1-033', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Por que a volta redonda com dois cotes é preferida ao lais de guia para amarrar uma espia numa argola do cais?',
                alternativas: ['Porque pode ser desfeita mesmo com o cabo sob carga', 'Porque faz uma alça fixa que não corre', 'Porque é o único nó que não enfraquece o cabo', 'Porque dispensa o uso de cunho a bordo'],
                correta: 0,
                explicacao: 'A volta redonda segura a carga pelo atrito e permite desfazer os cotes e folgar com o cabo puxado; o lais de guia não pode ser desfeito sob carga. Alça fixa é característica do lais de guia. Todo nó enfraquece o cabo. A outra ponta da espia continua presa num cunho a bordo.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
              { id: 'arrais-1-034', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Qual é a sequência correta para dar volta num cunho?',
                alternativas: ['Volta redonda pela base, oitos cruzados sobre os chifres e uma volta mordida para travar', 'Volta mordida primeiro, depois oitos e por fim a volta redonda', 'Só voltas mordidas, quantas couberem no cunho', 'Lais de guia passado em um dos chifres'],
                correta: 0,
                explicacao: 'Primeiro a volta redonda pela base, que segura a carga; depois um ou dois oitos; por fim a volta mordida, que trava tudo. Começar pela volta mordida impede controlar a carga. Encher o cunho de voltas dificulta soltar. Lais de guia num chifre pode escapar e não se solta sob carga.',
                referencia: 'Arte Naval, vol. 1 (voltas); RYA Knots, Splices and Ropework Handbook' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Ashley, C. W. The Ashley Book of Knots (1944): volta do fiel, volta redonda e dois cotes, volta de cunho', url: ASHLEY },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): voltas', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l6',
          titulo: 'Qual nó usar? Escolha certa e treino',
          minutos: 10,
          objetivos: [
            'Escolher o nó certo para cada situação a bordo',
            'Reconhecer os erros mais comuns com nós e voltas',
            'Montar uma rotina simples de treino',
          ],
          blocos: [
            { t: 'p', html: 'Um bom nó de bordo tem três qualidades: é <b>fácil de dar</b>, <b>seguro</b> enquanto trabalha e <b>fácil de desfazer</b> depois. Nenhum nó é o melhor para tudo. O que conta é escolher o certo para a situação e dá-lo sem hesitar, inclusive à noite, molhado e com pressa.' },
            { t: 'tabela', cab: ['Situação', 'Nó', 'Por quê'], linhas: [
              ['Escota no punho da vela de proa', 'Lais de guia', 'Alça fixa que não corre e desata fácil'],
              ['Ponta da escota ou da adriça', 'Nó de oito', 'Batente que não deixa o cabo escapar do moitão'],
              ['Pontos de rizo, vela ferrada', 'Nó direito', 'Chato, firme e fácil de soltar'],
              ['Unir cabos de grossuras diferentes', 'Nó de escota (dobrado, se preciso)', 'Não escorrega com bitolas diferentes'],
              ['Defensa no balaústre', 'Volta do fiel (com um cote de segurança)', 'Rápida e ajustável'],
              ['Espia numa argola ou num cabeço', 'Volta redonda com dois cotes', 'Pode ser solta com carga'],
              ['Cabo no cunho', 'Volta no cunho', 'Segura, controlada e rápida de soltar'],
              ['Alça para jogar a alguém na água', 'Lais de guia', 'A alça não fecha nem estrangula'],
            ] },
            { t: 'widget', w: 'nos', opts: { modo: 'desafio' }, legenda: 'Desafio: para cada situação, escolha o nó. Depois tente dar cada um com um cabo de verdade, de olhos fechados.' },
            { t: 'h', txt: 'Erros comuns' },
            { t: 'lista', itens: [
              'Usar o nó direito para emendar cabos sob carga.',
              'Deixar o chicote curto demais: com o trabalho, o nó “come” a sobra e se desfaz.',
              'Usar o nó simples como batente: ele aperta tanto que só sai com faca.',
              'Encher o cunho de voltas, o que impede soltar rápido numa emergência.',
              'Dar um nó que você não sabe desfazer. Se não sabe desfazer, também não sabe se está certo.',
              'Não conferir: todo nó importante se olha e se testa com um puxão antes de confiar nele.',
            ] },
            { t: 'h', txt: 'Rotina de treino' },
            { t: 'p', html: 'Tenha um pedaço de cabo de cerca de 1,5 m perto do sofá ou na mochila. Cinco minutos por dia bastam: dê cada nó da tabela três vezes, depois de olhos fechados, depois em volta da perna da cadeira (que faz o papel do cabeço). Em duas semanas, a mão aprende sozinha. No treinamento prático do Arrais, o instrutor vai pedir para você amarrar o barco, e é aí que esse treino aparece.' },
            { t: 'h', txt: 'A faca é a última saída' },
            { t: 'p', html: 'Tenha uma faca afiada, de lâmina serrilhada, ao alcance do cockpit. Ela serve para cortar um cabo enroscado no hélice ou soltar alguém preso por um cabo numa emergência. Mas a melhor proteção é não precisar dela: cabos aduchados, nós conferidos, chicotes falcaçados e nada solto pelo convés.' },
            { t: 'callout', tipo: 'dica', titulo: 'Na dúvida, lais de guia', html: 'Se você precisar de uma alça e não lembrar de outro nó, o lais de guia quase sempre resolve. Só não o use quando precisar soltar o cabo com carga.' },
            { t: 'flash', deck: 'arrais-1', txt: 'Revise os nós e seus usos com os flashcards desta parte do curso.' },
            { t: 'check', questoes: [
              { id: 'arrais-1-035', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Um tripulante caiu na água perto do barco parado e você vai jogar um cabo com uma alça para ele passar pelo corpo. Qual nó usar para a alça?',
                alternativas: ['Lais de guia', 'Volta do fiel', 'Nó direito', 'Nó de escota'],
                correta: 0,
                explicacao: 'O lais de guia faz uma alça fixa, que não fecha nem estrangula quando a pessoa é puxada. A volta do fiel precisa de um objeto e pode correr. O nó direito e o nó de escota são nós de união, não formam alça segura.',
                referencia: 'Ashley Book of Knots, nº 1010; Arte Naval, vol. 1' },
              { id: 'arrais-1-036', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 1,
                enunciado: 'Quais são as três qualidades de um bom nó de bordo?',
                alternativas: ['Fácil de dar, seguro enquanto trabalha e fácil de desfazer', 'Bonito, apertado e permanente', 'Feito só com o seio, sem usar o chicote, e impossível de soltar', 'Grande, com muitas voltas e sem sobra de chicote'],
                correta: 0,
                explicacao: 'Bom nó de bordo é rápido de dar, não falha sob carga e se desfaz quando você precisa. Nó permanente ou impossível de soltar é perigoso numa emergência. Muitas voltas e chicote sem sobra são erros comuns, não qualidades.',
                referencia: 'Arte Naval, vol. 1 (nós e voltas)' },
              { id: 'arrais-1-037', nivel: 'arrais', tema: 'Marinharia e nós', dificuldade: 2,
                enunciado: 'Você precisa ferrar (prender) a vela grande na retranca com pequenos cabos. Qual nó usar?',
                alternativas: ['Nó direito', 'Lais de guia', 'Volta redonda com dois cotes', 'Nó de escota dobrado'],
                correta: 0,
                explicacao: 'Para atar a vela ferrada ou os pontos de rizo, o nó direito é chato, firme e fácil de soltar. O lais de guia faria alças desnecessárias. A volta redonda com dois cotes serve para argolas e cabeços. O nó de escota dobrado é para unir cabos de bitolas diferentes.',
                referencia: 'Ashley Book of Knots; Arte Naval, vol. 1' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Ashley, C. W. The Ashley Book of Knots (1944)', url: ASHLEY },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 1 (SDM, 2019): nós, voltas e trabalhos do marinheiro', url: ARTE },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) I: marinharia, nós e voltas', url: NORMAM, ref: 'extra-arrais-1-01' },
            ] },
          ],
        },
      ],
    },

{
      id: 'm3',
      titulo: 'Propulsão, leme e manobras',
      resumo: 'Como o motor, o hélice, o leme e a vela movem e governam o barco, e as manobras que caem na prova e no treinamento prático: atracar, desatracar, fundear, suspender, pegar a boia, chegar a praias e margens e resgatar alguém que caiu na água.',
      licoes: [
        {
          id: 'l1',
          titulo: 'Propulsão a motor e a vela: como o barco se move',
          minutos: 12,
          objetivos: [
            'Distinguir motor de popa, motor de centro, centro-rabeta, saildrive e jato d’água',
            'Fazer as verificações básicas antes e depois de dar partida',
            'Entender, sem física complicada, como a vela e a quilha fazem o veleiro andar',
          ],
          blocos: [
            { t: 'p', html: 'O programa da prova pede “sistemas de propulsão a motor e a vela, sistema de leme e seus efeitos”. Cada tipo de propulsão governa de um jeito, e é isso que muda a manobra. Começamos pelos motores.' },
            { t: 'tabela', cab: ['Tipo', 'Como governa', 'Onde aparece'], linhas: [
              ['Motor de popa (fora de borda)', 'O motor inteiro gira e aponta o jato do hélice', 'Botes, lanchas pequenas, voadeiras'],
              ['Motor de centro com eixo', 'Leme separado, logo atrás do hélice', 'Lanchas e veleiros, sobretudo os mais antigos'],
              ['Centro-rabeta', 'O “pé” externo gira e aponta o jato', 'Lanchas de médio porte'],
              ['Saildrive', 'Motor dentro do casco, “pé” vertical sob o fundo; governa pelo leme', 'Muitos veleiros de cruzeiro modernos'],
              ['Jato d’água', 'Um bocal direciona o jato; sem jato, quase não há governo', 'Motos aquáticas e algumas lanchas'],
            ], legenda: 'Onde o próprio motor aponta o jato (popa, rabeta, jato), não há leme separado: em ponto morto, o barco quase não governa.' },
            { t: 'h', txt: 'Antes e depois de dar partida' },
            { t: 'lista', ordenada: true, itens: [
              'Confira combustível, óleo e, no motor de centro, a válvula de fundo da água de arrefecimento aberta.',
              'Motor de centro a gasolina: ligue a ventilação do compartimento antes da partida (veja abaixo).',
              'Alavanca em ponto morto (neutro). Ninguém na água perto da popa, nenhum cabo solto na água.',
              'Motor de popa: prenda ao corpo o cordão de segurança (corta-circuito), que desliga o motor se você cair.',
              'Depois de ligar, confira a água de arrefecimento saindo: o jato indicador do motor de popa ou a água no escapamento do motor de centro. Se não sair, desligue na hora: o motor vai superaquecer.',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-30', html: 'A NORMAM-211 recomenda, em embarcações com motor de centro a gasolina, acionar a ventilação do compartimento por pelo menos 4 minutos antes da partida: vapores de gasolina acumulados podem explodir quando o motor é ligado.' },
            { t: 'h', txt: 'A vela como motor' },
            { t: 'p', html: 'A vela trabalha como uma asa. O vento que passa pelos dois lados dela cria uma força que puxa o barco para a frente e um pouco para o lado. A <b>quilha</b> (ou a <b>bolina</b>, nos barcos pequenos) resiste a esse empurrão lateral, e o resultado é o barco andando para vante. Por isso um veleiro consegue navegar até contra o vento, em ziguezague, mas não diretamente contra ele: há uma <b>zona morta</b> de cada lado da direção de onde o vento vem. Um veleiro de cruzeiro costuma andar a uns 40° a 45° do vento.' },
            { t: 'widget', w: 'mareacao', opts: { proa: 90, escota: 50 }, legenda: 'Gire o veleiro em relação ao vento e regule a escota. Veja onde fica a zona morta e quando as birutas da vela ficam paralelas.' },
            { t: 'p', html: 'Atenção a uma regra que cai na prova: para o RIPEAM, um veleiro só é “embarcação a vela” com o motor fora de uso. Motorando, mesmo com as velas içadas, ele é <b>embarcação de propulsão mecânica</b> e segue as regras de governo desse tipo. De dia, exibe a vante um cone com o vértice para baixo.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Cabo no hélice', html: 'Antes de engrenar, olhe para a água em volta da popa. Escotas, espias e o cabo do bote de apoio enroscam no hélice em segundos. Um cabo preso no eixo para o motor e deixa o barco sem governo, muitas vezes no pior lugar: perto do cais ou das pedras.' },
            { t: 'termos', ids: ['quilha', 'bolina', 'zona-morta', 'abatimento', 'embarcacao-de-propulsao-mecanica', 'embarcacao-a-vela', 'pontos-de-vela'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-038', nivel: 'arrais', tema: 'RIPEAM: regras de governo', dificuldade: 2,
                enunciado: 'Um veleiro navega com as velas içadas e o motor ligado e engrenado. Para o RIPEAM, ele é:',
                alternativas: ['Embarcação de propulsão mecânica', 'Embarcação a vela, porque está com as velas içadas', 'Embarcação com capacidade de manobra restrita', 'Embarcação sem governo'],
                correta: 0,
                explicacao: 'O RIPEAM só considera “a vela” a embarcação que está sob vela com o motor fora de uso. Com o motor propulsando, ela é de propulsão mecânica. Manobra restrita e sem governo são situações específicas (trabalho que limita a manobra ou avaria), não se aplicam aqui.',
                referencia: 'RIPEAM-72, Regra 3(c) e Regra 25(e)', fonte_url: RIPEAM },
              { id: 'arrais-1-039', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Você liga o motor de popa e não sai água pelo jato indicador de arrefecimento. O que fazer?',
                alternativas: ['Desligar o motor e verificar a entrada de água e o rotor da bomba', 'Acelerar para forçar a água a sair', 'Seguir viagem devagar e conferir mais tarde', 'Engrenar a ré para limpar a entrada de água'],
                correta: 0,
                explicacao: 'Sem água de arrefecimento, o motor superaquece em pouco tempo. Desligue e verifique a tomada (pode estar entupida por saco plástico ou capim) e o rotor da bomba. Acelerar ou seguir viagem aumenta o dano. Dar ré não resolve uma entrada entupida.',
                referencia: 'NORMAM-211, Anexo 5-F, item 04 (verificação do motor e do arrefecimento); manual do fabricante' },
              { id: 'arrais-1-040', nivel: 'arrais', tema: 'Embarcação e nomenclatura', dificuldade: 2,
                enunciado: 'Num veleiro, qual é a principal função da quilha (ou da bolina) na propulsão a vela?',
                alternativas: ['Resistir ao empurrão lateral da vela, para que o barco ande para vante', 'Gerar a força que empurra o barco para vante', 'Governar o barco no lugar do leme', 'Diminuir o calado em águas rasas'],
                correta: 0,
                explicacao: 'A vela gera uma força para vante e para o lado; a quilha resiste à parte lateral (o abatimento), e o barco avança. A força propulsora vem da vela, não da quilha. Quem governa é o leme. A quilha aumenta o calado; só a bolina retrátil permite diminuí-lo.',
                referencia: 'Arte Naval, vol. 2; Rousmaniere, The Annapolis Book of Seamanship' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) IV: sistemas de propulsão a motor e a vela', url: NORMAM, ref: 'extra-arrais-1-01' },
              { txt: 'NORMAM-211/DPC, Anexo 4-B, item 4.1: ventilação de motor de centro a gasolina', url: NORMAM, ref: 'extra-arrais-1-30' },
              { txt: 'RIPEAM-72, Regra 3(c) (embarcação a vela) e Regra 25(e) (cone de quem veleja motorando)', url: RIPEAM, ref: 'tecnico-14' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 2 (SDM, 2019): propulsão e manobra', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l2',
          titulo: 'Hélice e leme: efeito de passo, governo a ré e espaço limitado',
          minutos: 15,
          objetivos: [
            'Usar a corrente de descarga do hélice para governar devagar',
            'Prever o efeito de passo do hélice dando adiante e dando atrás',
            'Governar a ré e girar em espaço limitado com um e com dois hélices',
          ],
          blocos: [
            { t: 'fato', ref: 'extra-arrais-1-03', html: 'No treinamento prático obrigatório, o instrutor demonstra a ação do leme e do hélice, e você executa atracação, desatracação, fundeio e suspender.' },
            { t: 'h', txt: 'Corrente de descarga' },
            { t: 'p', html: 'O hélice joga um jato de água para ré, a <b>corrente de descarga</b>. Num barco de motor de centro, esse jato passa direto pelo leme. Por isso uma <b>rabanada</b> curta de máquina adiante, com o leme todo carregado, gira a popa com força mesmo com o barco quase parado, e sem ganhar muita velocidade. É a ferramenta número um das manobras apertadas.' },
            { t: 'h', txt: 'Efeito de passo do hélice' },
            { t: 'p', html: 'Visto de ré, um hélice de <b>passo à direita</b> gira no sentido horário quando dá adiante. Além de empurrar, ele tende a “andar de lado” no fundo da água, como uma roda: as pás de baixo empurram um pouco mais que as de cima. Esse é o <b>efeito de passo</b> (ou pressão lateral das pás).' },
            { t: 'lista', itens: [
              '<b>Dando atrás</b>, com passo à direita: a popa vai para <b>bombordo</b>. O efeito é forte e o leme quase não ajuda até o barco ganhar seguimento a ré.',
              '<b>Dando adiante</b>: a popa tende levemente para boreste. É fraco e o leme compensa sem você perceber.',
              'Com hélice de passo à esquerda, tudo se inverte.',
              'A força e até o sentido do efeito mudam de barco para barco (forma do casco, posição e inclinação do eixo): por isso o teste do seu barco, descrito abaixo, vale mais que a regra geral. Motor de popa e rabeta têm pouco efeito, porque você aponta o jato.',
            ] },
            { t: 'figura', svg: svg('0 0 400 300', 'Efeito de passo de um hélice de passo à direita: dando atrás a popa vai para bombordo com força; dando adiante, tende fracamente para boreste',
                defs('m3l2a', 'var(--magenta)') + defs('m3l2b') +
                t(110, 32, 'Dando atrás', 16, 'middle', 'font-weight="700"') + t(290, 32, 'Dando adiante', 16, 'middle', 'font-weight="700"') +
                cascoTopo(110, 52, 190, 76) + cascoTopo(290, 52, 190, 76) +
                '<line x1="110" y1="120" x2="110" y2="180" stroke="var(--ink)" stroke-width="2" marker-end="url(#m3l2b)"/>' +
                '<line x1="290" y1="180" x2="290" y2="120" stroke="var(--ink)" stroke-width="2" marker-end="url(#m3l2b)"/>' +
                '<line x1="104" y1="232" x2="34" y2="232" stroke="var(--magenta)" stroke-width="5" marker-end="url(#m3l2a)"/>' +
                '<line x1="296" y1="232" x2="330" y2="232" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m3l2a)"/>' +
                t(110, 270, 'popa para BB', 15, 'middle', 'fill="var(--magenta)" font-weight="700"') + t(110, 290, '(forte)', 15, 'middle', 'fill="var(--magenta)"') +
                t(290, 270, 'popa para BE', 15, 'middle', 'fill="var(--magenta)" font-weight="700"') + t(290, 290, '(fraco)', 15, 'middle', 'fill="var(--magenta)"')),
              legenda: 'Hélice de passo à direita (gira no sentido horário, visto de ré, quando dá adiante). A seta preta mostra para onde o barco anda.' },
            { t: 'p', html: 'Para descobrir o passo do seu barco, faça o teste em água aberta: barco parado, leme a meio, dê atrás devagar e veja para onde a popa vai. Se for para bombordo, o hélice é de passo à direita. Anote isso no painel: vai decidir de que bordo é mais fácil atracar.' },
            { t: 'h', txt: 'Governando a ré' },
            { t: 'lista', itens: [
              'Dê atrás devagar e espere o barco ganhar seguimento a ré. Só então o leme começa a governar.',
              'Com seguimento a ré, a <b>popa vai para o lado do leme</b>: leme a boreste, popa para boreste.',
              'Comece a manobra já contando com o efeito de passo, que puxa a popa para bombordo (passo à direita).',
              'Segure firme a cana ou a roda: dando atrás, a água empurra o leme com força para o batente.',
              'Corrija com rabanadas curtas adiante, que usam a corrente de descarga sem desfazer o seguimento a ré.',
            ] },
            { t: 'h', txt: 'Girar em espaço limitado com um hélice' },
            { t: 'p', html: 'Com hélice de passo à direita, o barco gira melhor para <b>boreste</b> (sentido horário). Deixe o leme todo a boreste e alterne: uma rabanada adiante (a corrente de descarga joga a popa para bombordo e a proa para boreste); antes de ganhar seguimento, uma rabanada atrás (o efeito de passo continua levando a popa para bombordo). Repita até completar o giro, quase no lugar. Para bombordo, o efeito de passo trabalha contra você e o giro fica mais largo.' },
            { t: 'h', txt: 'Dois hélices' },
            { t: 'p', html: 'Lanchas com dois motores usam hélices de passos contrários, em geral girando “para fora”. Andando reto, os efeitos de passo se anulam. Para girar no lugar, <b>um motor adiante e o outro atrás</b>: para guinar para boreste, motor de bombordo adiante e motor de boreste atrás. Em baixa velocidade, governa-se mais com as máquinas do que com o leme, que pode ficar a meio.' },
            { t: 'widget', w: 'manobras', opts: {}, legenda: 'Experimente o efeito de passo, a corrente de descarga e o giro em espaço limitado com um e com dois hélices.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Devagar e passando pelo neutro', html: 'Em espaço apertado, nunca vá mais rápido do que você aceitaria bater. Ao trocar de adiante para atrás, pare um instante no neutro: poupa a caixa de marcha e dá tempo de o hélice responder.' },
            { t: 'termos', ids: ['seguimento', 'guinar', 'leme'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-041', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'Numa lancha com um motor de centro e hélice de passo à direita, você dá atrás com o leme a meio. Para onde tende a popa?',
                alternativas: ['Para bombordo', 'Para boreste', 'Para lado nenhum: o barco recua em linha reta', 'Depende só do vento'],
                correta: 0,
                explicacao: 'Dando atrás, o efeito de passo de um hélice de passo à direita leva a popa para bombordo, e com força. Para boreste seria o caso de passo à esquerda. Recuar reto exige corrigir com o leme e com rabanadas. O vento influi, mas o efeito de passo existe mesmo sem vento.',
                referencia: 'Arte Naval, vol. 2 (manobra: efeito do hélice)' },
              { id: 'arrais-1-042', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'O que é a corrente de descarga do hélice e para que ela serve na manobra?',
                alternativas: ['O jato que o hélice joga para ré sobre o leme, que permite girar a popa com rabanadas mesmo com pouco seguimento', 'A corrente de maré que passa pelo hélice quando o barco está parado', 'A água de arrefecimento que sai pelo escapamento', 'O empurrão lateral das pás que puxa a popa dando atrás'],
                correta: 0,
                explicacao: 'A corrente de descarga é o jato do hélice dando adiante; batendo no leme carregado, gira a popa sem que o barco ganhe muita velocidade. Corrente de maré não é produzida pelo hélice. A água do escapamento é do arrefecimento. O empurrão lateral das pás é o efeito de passo, outra coisa.',
                referencia: 'Arte Naval, vol. 2 (manobra: efeito do hélice)' },
              { id: 'arrais-1-043', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'Numa lancha com dois hélices girando para fora, como girar quase no lugar para boreste?',
                alternativas: ['Motor de bombordo adiante e motor de boreste atrás', 'Motor de boreste adiante e motor de bombordo atrás', 'Os dois motores adiante com o leme todo a boreste', 'Os dois motores atrás com o leme todo a bombordo'],
                correta: 0,
                explicacao: 'O motor de bombordo adiante empurra o lado esquerdo para a frente e o de boreste atrás puxa o lado direito para trás: o barco gira no sentido horário (para boreste). A combinação inversa gira para bombordo. Os dois adiante (ou atrás) fazem o barco andar enquanto gira, sem girar no lugar.',
                referencia: 'Arte Naval, vol. 2 (manobra com dois hélices)' },
              { id: 'arrais-1-044', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'Com o barco já com seguimento a ré, você carrega o leme a boreste. O que acontece?',
                alternativas: ['A popa vai para boreste', 'A popa vai para bombordo', 'O barco para de andar a ré', 'Nada, porque o leme não atua a ré'],
                correta: 0,
                explicacao: 'Andando para ré, o leme passa a ser a “frente” do movimento: a popa vai para o lado em que o leme está carregado. A popa iria para bombordo andando adiante com o mesmo leme. O leme atua a ré, embora com menos eficiência, e não faz o barco parar.',
                referencia: 'Arte Naval, vol. 2 (governo a ré)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, itens 2.4 e 2.5 (treinamento prático: ação do leme e do hélice)', url: NORMAM, ref: 'extra-arrais-1-03' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 2 (SDM, 2019): manobra do navio, efeitos do hélice e do leme, navios de dois hélices', url: ARTE },
              { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): prop walk and close-quarters handling', url: ANNAPOLIS },
            ] },
          ],
        },
        {
          id: 'l3',
          titulo: 'Atracar e desatracar: cabos de amarração e espringues',
          minutos: 15,
          objetivos: [
            'Nomear e posicionar os cabos de amarração',
            'Planejar a atracação considerando vento, corrente e efeito de passo',
            'Desatracar trabalhando contra um espringue',
          ],
          blocos: [
            { t: 'p', html: 'Atracar é a manobra que mais assusta quem começa, e a que mais cai no treinamento prático. A boa notícia: quase toda atracação ruim vem de pressa e falta de plano, não de falta de habilidade. Antes de chegar perto do cais, você já deve saber de que bordo vai encostar, qual cabo passa primeiro e quem faz o quê.' },
            { t: 'h', txt: 'Os cabos de amarração' },
            { t: 'figura', svg: svg('0 0 400 240', 'Barco atracado por bombordo com lançantes e espringues numerados',
                '<rect x="0" y="0" width="400" height="50" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
                t(200, 32, 'cais', 16, 'middle', 'font-weight="700"') +
                '<path d="M60,110 L270,110 C312,112 338,124 348,135 C338,146 312,158 270,160 L60,160 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<g fill="var(--sea-2)" stroke="var(--ink)" stroke-width="1.5"><rect x="144" y="90" width="14" height="20" rx="6"/><rect x="244" y="90" width="14" height="20" rx="6"/></g>' +
                '<g stroke="var(--magenta)" stroke-width="2.5"><line x1="338" y1="122" x2="392" y2="50"/><line x1="305" y1="113" x2="215" y2="50"/><line x1="95" y1="113" x2="185" y2="50"/><line x1="62" y1="120" x2="8" y2="50"/></g>' +
                num(365, 86, '1') + num(262, 82, '2') + num(138, 82, '3') + num(35, 86, '4') +
                t(70, 190, 'popa', 15) + t(330, 190, 'proa', 15) +
                t(200, 140, 'atracado por bombordo', 15) +
                t(200, 222, 'distância ao cais exagerada', 15)),
              legenda: '1 lançante de proa (sai da proa para vante) · 2 espringue de proa (sai da proa para ré) · 3 espringue de popa (sai da popa para vante) · 4 lançante de popa (sai da popa para ré). Entre o costado e o cais, as defensas.' },
            { t: 'p', html: 'Os <b>lançantes</b> mantêm o barco junto ao cais e seguram proa e popa. Os <b>espringues</b>, que trabalham na diagonal ao longo do costado, impedem o barco de andar para vante e para ré. Às vezes se usa também um <b>través</b>, cabo perpendicular ao cais. As <b>defensas</b> vão penduradas no costado, na altura em que o casco encosta.' },
            { t: 'h', txt: 'Antes de encostar: o plano' },
            { t: 'lista', itens: [
              '<b>Quem manda: vento ou corrente?</b> Observe bandeiras, barcos já amarrados e a água correndo nos pilares. Aproxime-se <b>contra</b> o mais forte dos dois: o barco fica mais governável e para com facilidade.',
              '<b>De que bordo atracar?</b> Com hélice de passo à direita, atracar por <b>bombordo</b> ajuda: ao dar atrás para parar, a popa vai para o cais.',
              '<b>Cabos e defensas prontos</b>: cabos aduchados, com o chicote de bordo já preso no cunho e passados por fora do guarda-mancebo e dos balaústres. Defensas na altura certa.',
              '<b>Papéis claros</b>: quem passa o cabo de proa, quem passa o espringue, quem fica com uma defensa avulsa. Ninguém pula para o cais: desce-se com o barco parado, num passo.',
            ] },
            { t: 'h', txt: 'A aproximação' },
            { t: 'lista', ordenada: true, itens: [
              'Venha devagar, num ângulo de uns 20° a 30° com o cais, mirando o ponto onde a proa vai ficar.',
              'Perto do cais, ponha o leme para fora e dê uma rabanada atrás: o barco para, a proa abre e a popa encosta (efeito de passo, no caso de atracar por bombordo com passo à direita).',
              'Passe primeiro o cabo que segura o barco contra o vento ou a corrente. Se a corrente vem pela proa, o barco tende a ir para ré: o primeiro cabo deve trabalhar para vante (lançante de proa ou espringue de popa).',
              'Passe os demais, ajuste o comprimento e só então desligue o motor.',
            ] },
            { t: 'p', html: 'Com <b>vento soprando do cais para fora</b>, venha num ângulo maior e passe rápido um cabo de proa, porque o barco vai se afastar. Com <b>vento soprando para o cais</b>, pare paralelo, a uma ou duas bocas de distância, e deixe o vento encostar o barco devagar, com as defensas prontas.' },
            { t: 'h', txt: 'Desatracar com espringue' },
            { t: 'p', html: 'Solte os cabos que não trabalham e deixe só um espringue. O motor, trabalhando contra ele, afasta uma das extremidades do cais.' },
            { t: 'lista', itens: [
              '<b>Afastar a popa</b>: deixe o <b>espringue de proa</b>, ponha uma defensa na proa, leme para o lado do cais e dê adiante devagar. A proa encosta na defensa e a popa se abre. Solte o espringue e saia dando atrás.',
              '<b>Afastar a proa</b>: deixe o <b>espringue de popa</b>, defensa na alheta do lado do cais, e dê atrás devagar. A popa encosta e a proa se abre. Solte e saia dando adiante, sem guinar cedo: a popa varre para o lado do cais.',
            ] },
            { t: 'widget', w: 'manobras', opts: {}, legenda: 'Treine a atracação e a desatracação com vento e corrente de várias direções.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Mãos e pés para dentro', html: 'Nunca use mão, pé ou perna para segurar o barco contra o cais ou contra outro barco. Algumas toneladas esmagam ossos. Se o choque é inevitável, use uma defensa avulsa e deixe o casco levar a pancada.' },
            { t: 'termos', ids: ['atracar', 'desatracar', 'lancante', 'espringue', 'defensa', 'espia', 'croque', 'amarrar'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-045', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 1,
                enunciado: 'O cabo de amarração que sai da proa e vai para ré, até o cais, chama-se:',
                alternativas: ['Espringue de proa', 'Lançante de proa', 'Espringue de popa', 'Través'],
                correta: 0,
                explicacao: 'Espringue de proa é o que sai da proa e trabalha para ré, ao longo do costado. O lançante de proa sai da proa para vante. O espringue de popa sai da popa para vante. O través é perpendicular ao cais.',
                referencia: 'Arte Naval, vol. 2 (amarração)' },
              { id: 'arrais-1-046', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 3,
                enunciado: 'Seu barco tem um hélice de passo à direita. Sem vento nem corrente, de qual bordo é mais fácil atracar, e por quê?',
                alternativas: ['Bombordo, porque ao dar atrás para parar a popa vai para o cais', 'Boreste, porque ao dar atrás para parar a popa vai para o cais', 'Tanto faz: o efeito de passo só aparece dando adiante', 'Boreste, porque a corrente de descarga empurra o barco para o cais'],
                correta: 0,
                explicacao: 'Dando atrás, o efeito de passo à direita leva a popa para bombordo. Atracando por bombordo, a rabanada atrás que para o barco também encosta a popa. Por boreste, essa rabanada afastaria a popa do cais. O efeito de passo é mais forte justamente dando atrás. A corrente de descarga vai para ré, não para o lado.',
                referencia: 'Arte Naval, vol. 2 (efeito do hélice na atracação)' },
              { id: 'arrais-1-047', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 3,
                enunciado: 'Atracado por bombordo, você quer afastar a popa do cais para sair dando atrás. Como usar o espringue?',
                alternativas: ['Deixar o espringue de proa, defensa na proa, leme para o lado do cais e dar adiante devagar', 'Deixar o espringue de popa e dar atrás devagar', 'Deixar o lançante de popa e dar adiante com o leme a meio', 'Soltar todos os cabos e dar atrás com o leme todo a boreste'],
                correta: 0,
                explicacao: 'Dando adiante contra o espringue de proa, a proa encosta na defensa e o leme para o lado do cais empurra a popa para fora. Espringue de popa com máquina atrás afasta a proa, não a popa. O lançante de popa não trabalha nesse sentido. Soltar tudo e dar atrás deixa o efeito de passo puxar a popa para o cais.',
                referencia: 'Arte Naval, vol. 2 (desatracação com espringue)' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) II e Seção II, item 2.5: atracar e desatracar', url: NORMAM, ref: 'extra-arrais-1-03' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 2 (SDM, 2019): amarração e manobras de atracação', url: ARTE },
              { txt: 'Rousmaniere, J. The Annapolis Book of Seamanship, 4ª ed. (2014): docking and springing off', url: ANNAPOLIS },
            ] },
          ],
        },
        {
          id: 'l4',
          titulo: 'Fundear, suspender e pegar a boia',
          minutos: 15,
          objetivos: [
            'Escolher um bom lugar para fundear',
            'Calcular o filame e fundear de modo que a âncora unhe',
            'Suspender e pegar uma boia de poita com segurança',
          ],
          blocos: [
            { t: 'p', html: '<b>Fundear</b> é prender o barco ao fundo com a âncora. <b>Suspender</b> é recolher a âncora para sair. Parece só “jogar o ferro”, mas é uma das manobras com mais detalhes, e o programa da prova e o treinamento prático cobram as duas.' },
            { t: 'h', txt: 'Onde fundear' },
            { t: 'lista', itens: [
              '<b>Abrigo</b> do vento e das ondas previstos para as próximas horas, não só os de agora. O vento pode rondar à noite.',
              '<b>Fundo que segura</b>: areia e lama seguram bem. Pedra prende a âncora; coral e pradarias marinhas seguram mal e são destruídos pela âncora.',
              '<b>Profundidade</b> conhecida: pela carta, pelo ecobatímetro e pela maré do dia.',
              '<b>Espaço para girar</b>: o barco gira em torno da âncora conforme o vento e a corrente mudam. Fique longe de outros barcos, de pedras e do canal de navegação.',
              'Quem chegou antes tem o espaço: fundeie de modo a não cruzar o giro de quem já está ali.',
            ] },
            { t: 'h', txt: 'Quanto largar: o filame' },
            { t: 'p', html: '<b>Filame</b> é o comprimento de amarra ou de cabo que fica para fora, entre a proa e a âncora. Ele precisa ser bem maior que a profundidade, para que a puxada na âncora seja quase horizontal e ela se enterre. Regra prática: de <b>5 a 7 vezes</b> a profundidade, e mais com vento forte. É a faixa do Anexo 4-B da NORMAM-211 (para cabo, citada abaixo) e a que o Manual de Navegação vol. I dá para a amarra de navio (item 8.9). Os guias de segurança são mais exigentes na ponta de baixo: a BoatUS Foundation recomenda 7:1 e considera 5:1 suficiente só com âncora leve, barco pequeno e bom tempo. Conte a profundidade da proa até o fundo, na maior altura de maré prevista.' },
            { t: 'p', html: 'Exemplo: 4 m de água na baixa-mar, maré de 2 m e proa 1 m acima da água dão 7 m. Com a faixa de 5 a 7 vezes, largue de 35 a 49 m. Repare que a âncora mínima exigida pela norma, com 20 m de cabo ou amarra, só dá filame folgado em água bem rasa.' },
            { t: 'fato', ref: 'extra-vela-2-01', html: 'O Anexo 4-B da NORMAM-211 (recomendações ao navegante) manda fundear aproado ao vento ou à corrente, com o motor fora de marcha, e lançar a âncora quando o barco perder o seguimento, com cabo de aproximadamente <b>cinco a sete vezes a profundidade local</b>.' },
            { t: 'fato', ref: 'extra-vela-2-02', html: 'O mesmo Anexo 4-B manda <b>não amarrar o cabo de fundeio perto do motor</b>: o peso do motor pode somar-se à tração vertical do cabo e provocar emborcamento e afundamento do barco.' },
            { t: 'fato', ref: 'extra-arrais-1-26', html: 'Em navegação interior, a embarcação de médio porte deve ter âncora com no mínimo 20 m de cabo ou amarra.' },
            { t: 'figura', svg: svg('0 0 400 270', 'Barco fundeado: a amarra sai da proa e se deita no fundo até a âncora; o filame é várias vezes a profundidade',
                defs('m3l4a') +
                '<rect x="0" y="70" width="400" height="160" fill="var(--sea-2)" opacity="0.6"/>' +
                '<line x1="0" y1="70" x2="400" y2="70" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<path d="M0,232 Q120,222 200,232 T400,228 L400,270 L0,270 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<path d="M296,58 L374,60 L370,78 Q340,86 304,80 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M298,62 Q190,222 62,229" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
                '<path d="M52,214 L52,234 M42,230 Q52,240 62,230 M46,218 L58,218" fill="none" stroke="var(--ink)" stroke-width="3"/>' +
                '<line x1="384" y1="74" x2="384" y2="226" stroke="var(--ink)" stroke-width="2" marker-start="url(#m3l4a)" marker-end="url(#m3l4a)"/>' +
                t(376, 150, 'profundidade', 15, 'end') +
                t(186, 168, 'filame', 16, 'middle', 'fill="var(--magenta)" font-weight="700"') +
                t(62, 256, 'âncora', 15) +
                '<line x1="20" y1="34" x2="80" y2="34" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#m3l4a)"/>' + t(20, 24, 'vento', 15, 'start') +
                t(334, 48, 'proa', 15)),
              legenda: 'Com filame suficiente, a amarra se deita no fundo e puxa a âncora quase na horizontal. Com filame curto, ela puxa para cima e a âncora garra.' },
            { t: 'h', txt: 'Passo a passo para fundear' },
            { t: 'lista', ordenada: true, itens: [
              'Aproxime-se devagar, aproado ao vento ou à corrente (o que dominar). Veja como estão aproados os barcos já fundeados.',
              'Pare o barco no ponto escolhido.',
              'Confira que o chicote (a ponta de dentro) do cabo ou da amarra está preso ao barco, num cunho de proa. Largar a âncora sem prender o cabo é um erro comum.',
              'Arrie a âncora até o fundo. Não a jogue: o cabo embola e a âncora cai de qualquer jeito.',
              'Deixe o barco cair para ré, com o vento ou dando atrás devagar, largando o filame aos poucos para a amarra se estender no fundo.',
              'Com o filame todo largado, dê volta no cunho e dê atrás devagar. A âncora <b>unha</b> (enterra). Ponha a mão na amarra: tranco e vibração indicam que ela está <b>garrando</b>.',
              'Tome marcações de dois pontos de terra ou ligue o alarme de fundeio do GNSS, e confira de tempos em tempos.',
              'Exiba o sinal de fundeado: de dia, uma esfera a vante; à noite, a luz circular branca (RIPEAM, Regra 30).',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-14', html: 'A lista de verificação da NORMAM-211 manda fundear com baixa velocidade e amarra adequada, considerando a amplitude da maré e os barcos próximos; e, ao suspender, não movimentar os propulsores até que todas as pessoas tenham saído da água e embarcado.' },
            { t: 'h', txt: 'Suspender' },
            { t: 'p', html: 'Confirme que ninguém está na água. Dê adiante devagar na direção da âncora enquanto a proa recolhe o cabo (o molinete recolhe, não reboca o barco). Quando a amarra fica na vertical, a âncora está <b>a pique</b>; ao sair do fundo, “arrancou”. Quando aparecer, confira se veio limpa e peie-a antes de seguir. Em fundo de pedras, um <b>arinque</b> preso na cruz da âncora ajuda a soltá-la se prender.' },
            { t: 'h', txt: 'Pegar a boia de poita' },
            { t: 'lista', ordenada: true, itens: [
              'Veja para onde apontam os barcos já amarrados: é a direção de aproximação (contra o vento ou a corrente).',
              'Venha devagar, com a boia na bochecha do lado do timoneiro.',
              'O proeiro aponta a boia com o braço o tempo todo: perto, ela some sob a proa para quem governa.',
              'Pare com a boia na proa, pegue com o croque e passe o cabo da poita (ou um cabo de bordo pela alça) para o cunho de proa.',
              'Ponha o motor em neutro enquanto houver cabo perto do hélice. Para sair, solte e afaste-se sem passar por cima do cabo da poita.',
            ] },
            { t: 'termos', ids: ['fundear', 'suspender', 'ancora', 'amarra', 'filame', 'unhar', 'garrar', 'arinque', 'molinete', 'poita', 'croque', 'luz-de-fundeio'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-048', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'Você vai fundear com cabo (sem corrente) num lugar com 5 m de profundidade, já contando a maré e a altura da proa. Pela regra prática, quanto largar?',
                alternativas: ['De 25 a 35 m', 'Uns 5 m, igual à profundidade', 'De 10 a 15 m', 'O cabo todo, qualquer que seja o comprimento'],
                correta: 0,
                explicacao: 'Com cabo, a regra prática é de 5 a 7 vezes a profundidade: 5 × 5 = 25 m a 7 × 5 = 35 m. Largar só a profundidade deixa o cabo vertical e a âncora garra. 10 a 15 m (2 a 3 vezes) é pouco para cabo. Largar tudo sem pensar pode tirar espaço de giro e encostar em outros barcos.',
                referencia: 'Arte Naval, vol. 2 (fundeio); NORMAM-211, Anexo 5-F, item 13' },
              { id: 'arrais-1-049', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 1,
                enunciado: 'Pela lista de verificação da NORMAM-211, ao suspender, quando você pode movimentar os propulsores?',
                alternativas: ['Só depois que todas as pessoas saírem da água e completarem o embarque', 'Assim que a âncora estiver a pique', 'Antes de recolher a âncora, para ajudar o molinete', 'A qualquer momento, desde que devagar'],
                correta: 0,
                explicacao: 'O item 13 do Anexo 5-F é claro: não movimentar os propulsores até todos saírem da água e embarcarem. Âncora a pique não garante que não há ninguém na água. Usar o motor para “ajudar” com gente na água é exatamente o que a norma proíbe. Devagar não elimina o risco do hélice.',
                referencia: 'NORMAM-211/DPC, Anexo 5-F, item 13', fonte_url: NORMAM },
              { id: 'arrais-1-050', nivel: 'arrais', tema: 'RIPEAM: luzes e marcas', dificuldade: 1,
                enunciado: 'De dia, qual marca exibe uma embarcação fundeada?',
                alternativas: ['Uma esfera a vante', 'Um cone com o vértice para baixo', 'Duas esferas em linha vertical', 'Um cilindro'],
                correta: 0,
                explicacao: 'Embarcação fundeada exibe de dia uma esfera na parte de vante (e, à noite, luz circular branca). O cone com vértice para baixo é de quem navega a vela e motor. Duas esferas indicam embarcação sem governo. O cilindro é da restrita pelo calado.',
                referencia: 'RIPEAM-72, Regras 25(e), 27(a), 28 e 30(a)', fonte_url: RIPEAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-F, item 13 (fundear e suspender)', url: NORMAM, ref: 'extra-arrais-1-14' },
              { txt: 'NORMAM-211/DPC, art. 4.33, quadro de navegação interior: âncora com no mínimo 20 m de cabo ou amarra', url: NORMAM, ref: 'extra-arrais-1-26' },
              { txt: 'NORMAM-211/DPC, Anexo 4-B, item 6 (procedimentos para fundear): cabo de cinco a sete vezes a profundidade', url: NORMAM, ref: 'extra-vela-2-01' },
              { txt: 'NORMAM-211/DPC, Anexo 4-B, item 6: o cabo de fundeio não deve ser amarrado perto do motor', url: NORMAM, ref: 'extra-vela-2-02' },
              { txt: 'Manual de Navegação da Marinha do Brasil (Miguens), vol. I, item 8.9 (fundeio de precisão): filame de 5 a 7 vezes a profundidade', url: MIG1 },
              { txt: 'BoatUS Foundation, Anchoring & Mooring: escopo 7:1 (5:1 só em condições leves), medido da proa; prender a ponta do cabo ao barco', url: BOATUS_ANCH },
              { txt: 'RIPEAM-72, Regra 30 (embarcações fundeadas)', url: RIPEAM, ref: 'tecnico-64' },
              { txt: 'Fonseca, M. M. Arte Naval, vol. 2 (SDM, 2019): aparelho de fundear e suspender', url: ARTE },
            ] },
          ],
        },
        {
          id: 'l5',
          titulo: 'Praias e margens: as faixas de 100 m e 200 m',
          minutos: 12,
          objetivos: [
            'Aplicar as faixas de 100 m e 200 m a partir da linha de base',
            'Identificar a linha de base em praias, rios, lagos e lagoas',
            'Aproximar-se com segurança de praias e de margens',
          ],
          blocos: [
            { t: 'p', html: 'Muitos acidentes graves com barcos de recreio acontecem perto da praia, onde há gente na água. Por isso a NORMAM-211 cria as <b>áreas seletivas para a navegação</b>, e o treinamento prático do Arrais dá ênfase a elas.' },
            { t: 'fato', ref: 'extra-arrais-1-03', html: 'O treinamento prático inclui a saída e a aproximação segura de praias, com ênfase no cumprimento das áreas seletivas para a navegação.' },
            { t: 'fato', ref: 'normas-21', html: 'Em atividades de esporte e recreio, as embarcações a <b>vela ou a remo</b> só podem navegar a partir de <b>100 m</b> da linha de base, e as a <b>motor</b>, a partir de <b>200 m</b>.' },
            { t: 'fato', ref: 'extra-arrais-1-21', html: 'A <b>linha de base</b> é, nas praias do litoral, a linha de arrebentação das ondas; em rios, lagos e lagoas, o ponto onde começa o espelho d’água junto às margens.' },
            { t: 'fato', ref: 'normas-22', html: 'Para entrar e sair da água, o trânsito entre o ponto de embarque e a linha de base deve ser <b>perpendicular</b> a ela e com velocidade <b>abaixo de três nós</b>.' },
            { t: 'figura', svg: svg('0 0 400 330', 'Faixas de proteção de banhistas: 100 m da linha de base para vela e remo, 200 m para motor, com corredor perpendicular de entrada e saída',
                defs('m3l5a') +
                '<rect x="0" y="0" width="400" height="48" fill="var(--land)"/>' + t(250, 30, 'praia', 16, 'middle', 'font-weight="700"') +
                '<rect x="0" y="48" width="400" height="282" fill="var(--sea-1)"/>' +
                '<path d="M0,74 Q25,64 50,74 T100,74 T150,74 T200,74 T250,74 T300,74 T350,74 T400,74" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
                t(396, 96, 'linha de base (arrebentação)', 15, 'end') +
                '<g fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.2"><circle cx="150" cy="58" r="5"/><circle cx="182" cy="62" r="5"/><circle cx="226" cy="56" r="5"/><circle cx="318" cy="60" r="5"/></g>' +
                '<line x1="110" y1="160" x2="400" y2="160" stroke="var(--magenta)" stroke-width="2.5" stroke-dasharray="8 6"/>' +
                t(396, 152, '100 m: vela e remo', 15, 'end', 'fill="var(--magenta)" font-weight="700"') +
                '<line x1="110" y1="250" x2="400" y2="250" stroke="var(--magenta)" stroke-width="2.5" stroke-dasharray="8 6"/>' +
                t(396, 242, '200 m: motor', 15, 'end', 'fill="var(--magenta)" font-weight="700"') +
                '<rect x="30" y="48" width="44" height="202" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 4"/>' +
                '<line x1="52" y1="236" x2="52" y2="66" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#m3l5a)"/>' +
                t(14, 276, 'corredor: perpendicular,', 15, 'start') + t(14, 296, 'abaixo de 3 nós', 15, 'start') +
                '<path d="M300,200 L312,176 L324,200 Z" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<path d="M300,286 L336,286 L344,280 L336,274 L300,274 Z" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="1.5"/>' +
                t(200, 322, 'fora de escala', 15)),
              legenda: 'Veleiros e embarcações a remo navegam a partir de 100 m da linha de base; embarcações a motor, a partir de 200 m. Entre a praia e a linha de base, só em trânsito perpendicular e abaixo de 3 nós.' },
            { t: 'fato', ref: 'extra-arrais-1-22', html: 'A embarcação pode se aproximar da linha de base para fundear, se a autoridade local não proibir. Embarcações de salvamento, como as do Corpo de Bombeiros, estão isentas das faixas.' },
            { t: 'fato', ref: 'extra-arrais-1-23', html: 'Onde as faixas não puderem ser aplicadas, a Capitania define os limites nas suas normas locais (NPCP/NPCF). Em princípio, a extremidade navegável da praia (ou outra área sinalizada pelo poder público) é o lugar de lançar, recolher e embarcar; ali o fundeio só é permitido pelo tempo mínimo necessário.' },
            { t: 'callout', tipo: 'nota', titulo: 'Por que a lista de verificação fala em 200 m?', html: 'O item 09 da lista de verificação do Anexo 5-F diz apenas “não navegue a menos de 200 metros da praia”. É uma lista genérica. A regra detalhada é a do art. 1.8.1, que separa vela e remo (100 m) de motor (200 m). Um veleiro motorando está usando propulsão a motor: na dúvida, respeite os 200 m.' },
            { t: 'fato', ref: 'extra-arrais-1-12', html: 'Item 09 do Anexo 5-F: não navegue a menos de 200 m da praia, para não pôr os banhistas em risco.' },
            { t: 'h', txt: 'Chegando a uma praia' },
            { t: 'lista', itens: [
              'Procure o corredor ou a extremidade da praia sinalizada para embarque. Consulte as regras locais da Capitania.',
              'Reduza bem antes da faixa e entre perpendicular à praia, abaixo de 3 nós, com alguém na proa vigiando banhistas, mergulhadores e pedras.',
              'Com motor de popa, levante (bascule) o motor em água rasa para proteger o hélice e a rabeta.',
              'Evite a arrebentação: onda quebrando vira barco pequeno de lado. Na saída, enfrente as ondas com a proa.',
            ] },
            { t: 'h', txt: 'Chegando a uma margem de rio, lago ou represa' },
            { t: 'lista', itens: [
              'Aproxime-se <b>contra a correnteza</b>: você governa melhor e para com facilidade.',
              'Nas curvas de rio, o lado de fora costuma ser mais fundo e o de dentro tem bancos de areia. Na estiagem e na vazante, os bancos aparecem onde antes havia água.',
              'Cuidado com troncos, galhadas, pedras e redes de pesca perto das margens.',
              'Reduza a marola perto de margens, canoas, flutuantes, balsas e comunidades ribeirinhas.',
              'Para amarrar numa árvore ou estaca, use a volta redonda com dois cotes, e passe também um cabo de popa para o barco não girar com a correnteza.',
            ] },
            { t: 'callout', tipo: 'seguranca', titulo: 'Gente na água não aparece', html: 'A cabeça de um banhista ou de um mergulhador é um ponto pequeno entre as ondas, ainda mais com sol baixo. Velocidade baixa e um vigia dedicado são as únicas defesas reais. Procure também a bandeira de mergulho.' },
            { t: 'termos', ids: ['areas-adjacentes-as-praias', 'npcp', 'capitania-dos-portos'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-051', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 1,
                enunciado: 'Uma lancha a motor em passeio perto de uma praia do litoral só pode navegar a partir de que distância da linha de base?',
                alternativas: ['200 m', '100 m', '50 m', '500 m'],
                correta: 0,
                explicacao: 'Embarcações a motor só navegam a partir de 200 m da linha de base. Os 100 m valem para vela e remo. 50 m e 500 m não aparecem nessa regra.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.8.1', fonte_url: NORMAM },
              { id: 'arrais-1-052', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 2,
                enunciado: 'Numa praia do litoral, o que a NORMAM-211 considera linha de base para as faixas de proteção de banhistas?',
                alternativas: ['A linha de arrebentação das ondas', 'A linha da maré alta na areia', 'A linha da maré baixa', 'O limite de 20 milhas da costa'],
                correta: 0,
                explicacao: 'Nas praias do litoral, a linha de base é a arrebentação das ondas. Em rios, lagos e lagoas, é onde começa o espelho d’água junto às margens. As linhas de maré não são o critério. 20 milhas é o limite da navegação costeira, outra coisa.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.8.1, alínea a)', fonte_url: NORMAM },
              { id: 'arrais-1-053', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 2,
                enunciado: 'Como deve ser feito o trânsito entre o ponto de saída na praia e a linha de base?',
                alternativas: ['Perpendicular à linha de base e abaixo de três nós', 'Paralelo à praia, para não fazer onda nos banhistas', 'Em qualquer direção, desde que abaixo de dez nós', 'Em ziguezague, para facilitar a vigilância'],
                correta: 0,
                explicacao: 'A norma exige trânsito perpendicular à linha de base e com velocidade abaixo de três nós. Navegar paralelo à praia mantém o barco mais tempo perto dos banhistas. Dez nós é rápido demais. Ziguezague aumenta o tempo na área de risco.',
                referencia: 'NORMAM-211/DPC, Cap. 1, art. 1.8.1', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Cap. 1, art. 1.8 (áreas seletivas para a navegação)', url: NORMAM, ref: 'normas-21' },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, item 2.6', url: NORMAM, ref: 'extra-arrais-1-03' },
              { txt: 'NORMAM-211/DPC, Anexo 5-F, item 09', url: NORMAM, ref: 'extra-arrais-1-12' },
            ] },
          ],
        },
        {
          id: 'l6',
          titulo: 'Homem ao mar',
          minutos: 15,
          objetivos: [
            'Executar as primeiras ações quando alguém cai na água',
            'Voltar até a pessoa com motor e com vela',
            'Recolher a pessoa a bordo sem feri-la com o hélice',
          ],
          blocos: [
            { t: 'p', html: 'De todas as manobras, esta é a que pode salvar uma vida, e o programa da prova a cita pelo nome: “manobras de resgate de homem ao mar”. A melhor manobra de homem ao mar, porém, é a que não acontece: colete vestido, uma mão sempre segurando o barco e nada de se debruçar na borda para urinar com o barco em movimento, uma causa clássica de quedas.' },
            { t: 'h', txt: 'Os primeiros segundos' },
            { t: 'lista', ordenada: true, itens: [
              'Grite <b>“Homem ao mar a boreste!”</b> (ou a bombordo). Todos a bordo precisam saber.',
              'Jogue já a <b>boia salva-vidas</b> e qualquer coisa que flutue perto da pessoa. Além de ajudar quem está na água, elas marcam o local.',
              'Escolha alguém para <b>apontar</b> a pessoa com o braço esticado, sem tirar os olhos dela um segundo.',
              'Marque a posição: botão <b>MOB</b> do GNSS ou do plotter. Ele guarda só o ponto da queda: a pessoa deriva, e a busca precisa levar isso em conta (US Sailing).',
              'Com motor, a orientação tradicional é levar o leme <b>para o bordo da queda</b>: a popa, onde está o hélice, se afasta da pessoa. Em lancha pequena, porém, há instrutores que a consideram quase sempre dispensável, porque a popa passa pela pessoa antes de a manobra fazer efeito; o essencial é que o hélice não passe sobre ela.',
              'Peça socorro pelo VHF, canal 16 (com DSC, o alerta de socorro). O RYA manda alertar logo, de início; se a pessoa for recolhida depressa e estiver bem, avise que o perigo passou. Se perder a pessoa de vista, não espere mais.',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-32', html: 'Qualquer pessoa é obrigada a prestar auxílio a quem estiver em perigo no mar ou em águas interiores, se puder fazê-lo sem perigo para si ou para outros, e quem souber de vida humana em perigo deve comunicar à Capitania, Delegacia ou Agência ou às autoridades competentes.' },
            { t: 'h', txt: 'Voltar com motor' },
            { t: 'p', html: 'Num barco a motor, com a pessoa à vista, faça um giro contínuo para o lado da queda e volte devagar. Na aproximação final, a prática mais ensinada é vir <b>contra o vento ou a corrente</b> (assim o barco não é empurrado por cima da pessoa), com ela do <b>lado do timoneiro</b>, que precisa vê-la até o fim. Há quem prefira chegar a favor do vento ou da corrente e deixar o barco derivar até a pessoa; a revista Power &amp; Motoryacht (2014) registra as duas escolas e diz que a primeira dá mais controle ao timoneiro na maioria dos casos. Quando estiver a poucos metros, <b>ponto morto</b>: o barco chega por inércia. Hélice girando perto de alguém na água mutila e mata.' },
            { t: 'p', html: 'Navios usam manobras padronizadas do manual internacional de busca e salvamento (IAMSAR). A <b>curva de Williamson</b> serve quando a pessoa não está à vista, de noite ou em visibilidade ruim: leme todo para o bordo da queda; depois de guinar uns 60°, leme todo para o outro bordo; a uns 20° do rumo inverso, leme a meio. O barco volta sobre a própria esteira, passando pelo ponto da queda.' },
            { t: 'figura', svg: svg('0 0 400 340', 'Manobra de homem ao mar com motor: leme para o bordo da queda, giro e retorno contra o vento com ponto morto perto da pessoa',
                defs('m3l6a', 'var(--magenta)') + defs('m3l6b') +
                '<rect x="0" y="0" width="400" height="340" fill="var(--sea-1)"/>' +
                '<path d="M200,322 L200,150 A70,70 0 1 1 270,220 Q232,216 232,178" fill="none" stroke="var(--magenta)" stroke-width="3.5" marker-end="url(#m3l6a)"/>' +
                '<circle cx="232" cy="160" r="7" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<circle cx="250" cy="150" r="9" fill="none" stroke="var(--nav-red)" stroke-width="4"/>' +
                '<line x1="40" y1="40" x2="40" y2="100" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#m3l6b)"/>' + t(52, 56, 'vento', 15, 'start') +
                num(178, 300, '1') + num(178, 150, '2') + num(360, 150, '3') + num(206, 206, '4') +
                t(200, 336, 'rumo inicial', 15, 'middle')),
              legenda: '1 alguém cai por boreste: grito, boia, apontar, MOB · 2 leme a boreste, a popa se afasta da pessoa · 3 giro contínuo, sem perder a pessoa de vista · 4 aproximação final contra o vento, devagar, ponto morto a poucos metros.' },
            { t: 'h', txt: 'Voltar com vela: a parada rápida' },
            { t: 'p', html: 'Num veleiro, a manobra mais estudada é a <b>parada rápida</b> (Quick-Stop), desenvolvida por clubes e escolas dos Estados Unidos. Logo após a queda, orce e passe pela linha do vento <b>sem soltar a escota da vela de proa</b>: ela fica aquartelada e o barco perde velocidade perto da pessoa. Continue girando até o vento entrar por ante a ré, baixe ou enrole a vela de proa quando a pessoa ficar atrás do través, cambe em roda e volte à pessoa com vento folgado, parando ao lado dela, devagar. O bordo em que se recolhe a pessoa <b>varia entre as escolas</b>: o US Sailing (2004) e o RORC deixam a pessoa a barlavento do barco; o RYA (descrito pela Practical Boat Owner) e os testes do US Sailing de 2005 preferem o barco a barlavento da pessoa, ou seja, ela a sotavento. O curso recomenda este segundo lado (veja o quadro abaixo). O motor pode ajudar (hoje o US Sailing manda não hesitar em usá-lo), mas deixe-o em ponto morto até ter certeza de que não há cabos na água.' },
            { t: 'callout', tipo: 'nota', titulo: 'O que este curso recomenda', html: '<b>Tripulação reduzida num veleiro de cruzeiro:</b> parada rápida como primeira resposta, com o Lifesling se o barco tiver, porque mantém o barco perto da pessoa (US Sailing: estudo de 2020 e Safety at Sea v. 7.1; a maioria dos organizadores do simpósio de 2005). <b>Tripulação que dá conta de manobrar e boa visibilidade:</b> manobra do oito, que dá tempo de preparar velas e cabo e evita o jaibe (RYA, via Practical Boat Owner). <b>Aproximação final nos dois casos:</b> em bolina folgada, devagar, controlando a velocidade pelas escotas (referência prudente de 1 nó), olhando a pessoa e não o velocímetro. <b>Lado:</b> deixe a pessoa a sotavento do barco, no costado baixo, perto da popa, como o RYA ensina (o barco faz abrigo e é levado até ela); “costado baixo, perto da popa” é a escolha prática do curso. Pessoa a barlavento do barco, como no US Sailing (2004) e no RORC, convém quando o barco correria sobre a pessoa, com muito arrasto do vento ou em mar duro. Julgamento do curso a partir das fontes, não norma da Marinha do Brasil; o detalhe e as razões estão na lição “A volta: parada rápida e manobra do oito” do curso de Vela. <b>Treine a manobra com seu instrutor e sua tripulação.</b>' },
            { t: 'h', txt: 'Trazer a bordo' },
            { t: 'lista', itens: [
              'Motor em ponto morto ou desligado. A escada de popa só com o motor desligado: é ali que está o hélice.',
              'Jogue um cabo com uma alça de lais de guia ou a boia com retinida (segure o chicote da retinida: a norma não manda amarrá-lo ao barco) e puxe a pessoa para o costado.',
              'Recolha pela parte mais baixa e estável do barco. Pessoa exausta pesa muito: use uma talha, a adriça ou a escada.',
              'Quem ficou muito tempo em água fria, ou está inconsciente, deve ser içado de preferência deitado (o RYA pede a posição horizontal para a pessoa inconsciente) e aquecido aos poucos. Hipotermia e primeiros socorros estão nos módulos de salvatagem e de primeiros socorros.',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-34', html: 'A NORMAM-211 recomenda que o amador e os passageiros saibam flutuar na água sem ajuda de flutuantes.' },
            { t: 'widget', w: 'manobras', opts: { manobra: 'mob' }, legenda: 'Passo a passo da volta até a pessoa sob vela, com as duas técnicas (parada rápida e oito) e o quadro do que as fontes ensinam e onde divergem. Na lancha a motor, vale o texto acima.' },
            { t: 'callout', tipo: 'dica', titulo: 'Treine com uma defensa', html: 'Jogue uma defensa ou um balde amarrado a uma boia e faça a manobra completa, sem avisar o timoneiro antes. Repita com cada pessoa da tripulação no leme. Quem cai na água costuma ser justamente quem sabia manobrar.' },
            { t: 'termos', ids: ['homem-ao-mar', 'boia-circular', 'colete-salva-vidas', 'canal-16', 'hipotermia', 'aquartelar', 'jaibe'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-054', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 1,
                enunciado: 'Alguém cai na água. Quais são as primeiras ações?',
                alternativas: ['Gritar “homem ao mar”, jogar a boia e designar alguém para apontar a pessoa sem perdê-la de vista', 'Dar atrás imediatamente para parar o barco sobre a pessoa', 'Pular na água para ajudá-la', 'Desligar o rádio para não atrapalhar a manobra'],
                correta: 0,
                explicacao: 'Grito, boia e alguém apontando são as ações que salvam: avisam todos, dão flutuação e não deixam a pessoa sumir. Dar atrás leva o hélice para cima dela. Pular na água cria uma segunda vítima. O rádio pode ser necessário para pedir socorro.',
                referencia: 'NORMAM-211, Anexo 5-A, item 3.1 a) II; US Sailing, Quick-Stop', fonte_url: 'https://www.ussailing.org/news/quick-stop-rescue/' },
              { id: 'arrais-1-055', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 2,
                enunciado: 'Numa lancha de motor de centro, alguém cai por boreste. Para onde você leva o leme imediatamente, e por quê?',
                alternativas: ['Para boreste, para afastar a popa e o hélice da pessoa', 'Para bombordo, para afastar a proa da pessoa', 'Leme a meio e máquinas atrás, para parar logo', 'Para bombordo, para dar a volta mais curta'],
                correta: 0,
                explicacao: 'Leme para o bordo da queda faz a popa ir para o bordo oposto, afastando o hélice da pessoa; é a orientação tradicional (curva de Williamson, IAMSAR). Alguns instrutores de lanchas pequenas a consideram dispensável, mas nenhuma das fontes consultadas recomenda virar para o lado oposto: leme para bombordo jogaria a popa para boreste, em cima dela. Dar atrás aproxima o hélice. A volta “mais curta” não importa se o hélice passar sobre a pessoa.',
                referencia: 'IAMSAR, vol. III (manobras de homem ao mar); Marine Insight, Man Overboard Recovery Methods (2021); Arte Naval, vol. 2', fonte_url: 'https://www.marineinsight.com/3-important-man-overboard-recovery-methods-used-at-seas/' },
              { id: 'arrais-1-056', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 1,
                enunciado: 'Na aproximação final para recolher a pessoa da água com um barco a motor, como deve estar o motor?',
                alternativas: ['Em ponto morto (ou desligado) quando a pessoa estiver a poucos metros', 'Engrenado adiante, para manter o governo até o fim', 'Engrenado atrás, para frear em cima da pessoa', 'Acelerado, para chegar antes que ela se canse'],
                correta: 0,
                explicacao: 'Perto da pessoa, o hélice não pode girar: ponto morto ou motor desligado, e o barco chega por inércia. Engrenado adiante ou atrás, o hélice pode atingi-la. Chegar rápido aumenta o risco e dificulta parar no lugar certo.',
                referencia: 'Arte Naval, vol. 2; NORMAM-211, Anexo 5-F, item 13 (propulsores e pessoas na água)' },
              { id: 'arrais-1-057', nivel: 'arrais', tema: 'Manobras e homem ao mar', dificuldade: 3,
                enunciado: 'À noite, alguém caiu e ninguém viu exatamente onde. Qual manobra ajuda a voltar sobre a própria esteira, passando pelo ponto da queda?',
                alternativas: ['Curva de Williamson', 'Giro em espaço limitado com rabanadas', 'Desatracação com espringue', 'Fundear imediatamente'],
                correta: 0,
                explicacao: 'A curva de Williamson (leme todo para o bordo da queda, inverter a uns 60° e leme a meio perto do rumo inverso) coloca o barco no rumo oposto sobre a própria esteira. As rabanadas servem para girar em espaço apertado. O espringue é manobra de cais. Fundear tira o barco da busca.',
                referencia: 'IAMSAR, vol. III (curva de Williamson)', fonte_url: 'https://www.imo.org/en/OurWork/Safety/Pages/IAMSARManual.aspx' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 a) II: manobras de resgate de homem ao mar', url: NORMAM, ref: 'extra-arrais-1-01' },
              { txt: 'NORMAM-211/DPC, Anexo 4-B, itens 3.2 e 3.4: saber flutuar e dever de auxílio', url: NORMAM, ref: 'extra-arrais-1-32' },
              { txt: 'IMO/ICAO, IAMSAR Manual, vol. III (Mobile Facilities): manobras de homem ao mar', url: 'https://www.imo.org/en/OurWork/Safety/Pages/IAMSARManual.aspx' },
              { txt: 'US Sailing, Quick-Stop Rescue (2016)', url: 'https://www.ussailing.org/news/quick-stop-rescue/' },
              { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1): motor em ponto morto, Lifesling', url: 'https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf' },
              { txt: 'US Sailing, Rousmaniere, Final Report 2005 Crew Overboard Rescue Symposium (aproximação final, barco a barlavento da pessoa)', url: 'https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf' },
              { txt: 'US Sailing, Arthur B. Hanson Rescue Medal, caso Trisha (2004): pessoa a barlavento do barco', url: 'https://www.ussailing.org/wp-content/uploads/2018/01/5_15_04.pdf' },
              { txt: 'RYA, Man overboard: alarme, botão MOB, motor em ponto morto, içar na horizontal', url: 'https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/' },
              { txt: 'Practical Boat Owner, Man overboard turns (RYA reach-tack-reach e RORC quick-stop)', url: 'https://www.pbo.co.uk/seamanship/man-overboard-turns-getting-back-to-the-casualty-in-the-water-104939' },
              { txt: 'Power & Motoryacht, How to Deal with a Man Overboard Emergency (Capt. Bill Pike, 2014): giro para o bordo da queda, aproximação contra ou a favor do vento', url: 'https://powerandmotoryacht.com/seamanship/how-deal-man-overboard-emergency/' },
              { txt: 'Marine Insight, 3 Important Man Overboard Recovery Methods Used At Sea (2021): curva de Williamson', url: 'https://www.marineinsight.com/3-important-man-overboard-recovery-methods-used-at-seas/' },
              { txt: 'US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies and the Rescue Testing Symposium (v. 7.1): quick-stop como base, Lifesling, tripulação reduzida', url: 'https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf' },
              { txt: 'US Sailing, Rousmaniere, Final Report 2005 Crew Overboard Rescue Symposium: aproximação final, lado do barco, quick-stop preferida da maioria', url: 'https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf' },
              { txt: 'US Sailing, estudo sobre retorno e recolhimento de homem ao mar (2020)', url: 'https://www.ussailing.org/wp-content/uploads/2024/05/2020.New-Study-Evaluating-MOB-Return-and-Recovery-in-the-21st-Century.pdf' },
            ] },
          ],
        },
      ],
    },

{
      id: 'm4',
      titulo: 'Antes de sair: preparo, abastecimento e plano de navegação',
      resumo: 'Tudo o que se faz antes de soltar as amarras: a lista de verificação oficial do Anexo 5-F, combustível com reserva, água, gêneros e peso a bordo, salvatagem, plano de navegação, Aviso de Saída ou NAVSEG e a previsão do tempo.',
      licoes: [
        {
          id: 'l1',
          titulo: 'A lista de verificação do Anexo 5-F',
          minutos: 12,
          objetivos: [
            'Percorrer os 15 itens da lista oficial de verificação',
            'Inspecionar o barco antes de sair',
            'Encerrar o passeio corretamente ao regressar',
          ],
          blocos: [
            { t: 'p', html: 'A NORMAM-211 traz, no Anexo 5-F, uma lista de verificação para embarcações de esporte e recreio. Ela é curta, sensata e cobre os erros que mais causam acidentes. No treinamento prático do Arrais, você vai executá-la com o instrutor.' },
            { t: 'fato', ref: 'extra-arrais-1-04', html: 'O treinamento prático inclui a execução da lista de verificação para o funcionamento e orientações preventivas quanto à manutenção da embarcação.' },
            { t: 'fato', ref: 'extra-arrais-1-05', html: 'A lista do Anexo 5-F se divide em três momentos: antes de iniciar a navegação, durante a navegação e ao regressar.' },
            { t: 'h', txt: 'Antes de iniciar a navegação' },
            { t: 'fato', ref: 'extra-arrais-1-06', html: '01 a 03: conheça o RIPEAM, as normas da Capitania da sua área e a NORMAM-211; verifique o material de salvatagem e se há coletes para todos que vão embarcar; inspecione o material contra incêndio, com a validade e o estado dos extintores.' },
            { t: 'fato', ref: 'extra-arrais-1-07', html: '04: vistorie a estanqueidade do casco e confira bombas de esgoto, luzes de navegação, rádio (VHF e/ou HF), baterias, óleo do cárter, líquido de resfriamento, sistema de combustível e se não há vazamentos no compartimento do motor.' },
            { t: 'fato', ref: 'extra-arrais-1-08', html: '05: planeje o trajeto, tenha as cartas náuticas da região, conheça faróis e sinalização e calcule o combustível com margem para voltar (regra do 1/3).' },
            { t: 'fato', ref: 'extra-arrais-1-09', html: '06: verifique a previsão do tempo (a lista cita os sites da DHN e do CPTEC).' },
            { t: 'fato', ref: 'extra-arrais-1-10', html: '07: entregue o Aviso de Saída ao clube ou à marina e siga o planejado; se não estiver em clube ou marina, deixe alguém em terra sabendo para onde você vai e quando volta.' },
            { t: 'figura', svg: svg('0 0 400 300', 'Pontos de inspeção de um veleiro antes de sair, numerados',
                '<rect x="0" y="212" width="400" height="88" fill="var(--sea-3)" opacity="0.45"/>' +
                '<line x1="0" y1="212" x2="400" y2="212" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<path d="M205,232 L230,232 L240,282 L214,282 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M78,220 L94,220 L98,264 L86,264 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M30,182 L372,170 L352,212 Q300,232 200,234 Q110,234 50,216 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<path d="M170,177 L184,157 L300,153 L314,172" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                '<line x1="262" y1="155" x2="262" y2="44" stroke="var(--ink)" stroke-width="4"/>' +
                '<line x1="262" y1="46" x2="370" y2="171" stroke="var(--ink)" stroke-width="1.4"/>' +
                num(84, 203, '1') + num(120, 203, '2') + num(156, 203, '3') + num(192, 210, '4') + num(250, 210, '5') + num(334, 194, '6') +
                num(372, 146, '7') + num(282, 40, '8') + num(106, 152, '9') + num(62, 268, '10')),
              legenda: '1 motor (óleo, arrefecimento, correias, vazamentos) · 2 combustível (nível, cheiro, mangueiras) · 3 baterias · 4 sentina e bombas de esgoto · 5 válvulas de fundo · 6 âncora e amarra · 7 luzes de navegação · 8 antena e rádio VHF · 9 coletes, boia e extintores · 10 leme (folgas, movimento livre).' },
            { t: 'h', txt: 'Durante a navegação' },
            { t: 'fato', ref: 'extra-arrais-1-11', html: '08: atenção à condução; não deixe pessoa não habilitada conduzir (o proprietário responde perante o Tribunal Marítimo e nas esferas civil e penal); respeite a lotação máxima.' },
            { t: 'fato', ref: 'extra-arrais-1-12', html: '09: não navegue a menos de 200 m da praia (veja no módulo 3 a regra completa de 100 m e 200 m).' },
            { t: 'fato', ref: 'extra-arrais-1-13', html: '10 a 12: evite bebida alcoólica; velocidade compatível, sem manobras radicais e reduzindo em águas restritas; conheça os locais rasos (um encalhe deliberado já salvou embarcações de afundar).' },
            { t: 'fato', ref: 'extra-arrais-1-14', html: '13: fundeie devagar, com amarra adequada à maré e aos vizinhos; ao suspender, não movimente os propulsores até todos saírem da água e embarcarem.' },
            { t: 'h', txt: 'Ao regressar' },
            { t: 'fato', ref: 'extra-arrais-1-15', html: '14 e 15: informe a chegada ao clube ou à marina para desativar o Aviso de Saída; não esgote porões antes do fim da viagem, para não poluir; leve lixo e resíduos oleosos para terra.' },
            { t: 'h', txt: 'Manutenção preventiva' },
            { t: 'lista', itens: [
              'Depois de navegar em água salgada, lave o motor de popa com água doce pelo acoplamento de lavagem.',
              'Siga o manual do motor para óleo, filtros e rotor da bomba de água. Anote as horas de motor.',
              'Confira os anodos de sacrifício (zinco ou alumínio): gastos pela metade, troque.',
              'Mantenha as baterias carregadas e os terminais limpos e apertados.',
              'Anote num caderno de bordo tudo o que falhou na saída e resolva antes da próxima.',
            ] },
            { t: 'callout', tipo: 'dica', titulo: 'Plastifique a lista', html: 'Imprima a lista, plastifique e deixe no painel. Use sempre, até para um passeio de uma hora. É nos passeios curtos e “sem importância” que se esquece o colete da criança ou a válvula de fundo fechada.' },
            { t: 'termos', ids: ['sentina', 'bomba-de-esgoto', 'valvula-de-fundo', 'luzes-de-navegacao', 'vhf', 'aviso-de-saida', 'lotacao', 'registro-tribunal-maritimo'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-058', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Pela lista de verificação do Anexo 5-F, antes de sair você deve conferir:',
                alternativas: ['A estanqueidade do casco, as bombas de esgoto, as luzes, o rádio, as baterias, o óleo e o líquido de resfriamento do motor', 'Apenas os documentos do barco e a habilitação do condutor', 'Somente o combustível, já que o resto é verificado na vistoria anual', 'A pintura do casco e a limpeza do convés'],
                correta: 0,
                explicacao: 'O item 04 da lista manda verificar casco, bombas, luzes, rádio, baterias, óleo, resfriamento e sistema de combustível. Documentos importam, mas a lista vai muito além deles. A vistoria não dispensa a verificação antes de cada saída. Pintura e limpeza não são itens de segurança da lista.',
                referencia: 'NORMAM-211/DPC, Anexo 5-F, item 04', fonte_url: NORMAM },
              { id: 'arrais-1-059', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Ao regressar de um passeio, o que a lista do Anexo 5-F manda fazer em relação ao Aviso de Saída?',
                alternativas: ['Informar a chegada ao clube ou à marina para que o aviso seja desativado', 'Nada: o aviso perde a validade sozinho no fim do dia', 'Entregar um novo Aviso de Saída para o dia seguinte', 'Rasgar a cópia do aviso que ficou a bordo'],
                correta: 0,
                explicacao: 'O item 14 pede para informar a chegada e desativar o aviso. Se ninguém informar, o clube ou a marina pode acionar uma busca desnecessária. O aviso não “vence” sozinho. Um novo aviso só se faz numa nova saída. A cópia a bordo não importa.',
                referencia: 'NORMAM-211/DPC, Anexo 5-F, item 14; art. 4.6.1', fonte_url: NORMAM },
              { id: 'arrais-1-060', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 2,
                enunciado: 'Por que a lista do Anexo 5-F recomenda evitar esgotar os porões até o fim da viagem?',
                alternativas: ['Para não lançar resíduos de óleo no mar, em rios e lagoas; eles devem ser descartados em terra', 'Porque a água no porão ajuda na estabilidade', 'Porque a bomba de esgoto só funciona com o barco parado', 'Para economizar a bateria durante o passeio'],
                correta: 0,
                explicacao: 'A água do porão costuma ter óleo e combustível; bombeá-la na água polui. A lista pede para esvaziar no fim, levando resíduos para local apropriado em terra. Água solta no porão piora a estabilidade (efeito de superfície livre). A bomba funciona em movimento. Bateria não é o motivo.',
                referencia: 'NORMAM-211/DPC, Anexo 5-F, item 15', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-F: Lista de Verificação para Embarcações de Esporte e Recreio', url: NORMAM, ref: 'extra-arrais-1-05' },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, item 2.7 (treinamento prático)', url: NORMAM, ref: 'extra-arrais-1-04' },
            ] },
          ],
        },
        {
          id: 'l2',
          titulo: 'Combustível: consumo, reserva e a regra do terço',
          minutos: 12,
          objetivos: [
            'Estimar o combustível de um passeio com margem de segurança',
            'Aplicar a regra do terço para saber a hora de voltar',
            'Conferir o nível do tanque e abastecer com os cuidados essenciais',
          ],
          blocos: [
            { t: 'p', html: 'Ficar sem combustível, a “pane seca”, é uma das causas mais comuns de pedido de socorro na navegação de recreio. E é a mais evitável. Um barco à deriva perto de pedras, ou levado pela correnteza de um rio, vira uma emergência em minutos.' },
            { t: 'fato', ref: 'tecnico-166', html: 'A NORMAM-211 recomenda a <b>regra de um terço</b> ao calcular o combustível do passeio: 1/3 para a ida, 1/3 para a volta e 1/3 de reserva.' },
            { t: 'figura', svg: svg('0 0 400 230', 'Tanque dividido em terços: ida, volta e reserva; a hora de voltar é quando o primeiro terço acabou',
                '<rect x="40" y="56" width="107" height="80" fill="var(--sea-3)" stroke="var(--ink)" stroke-width="2"/>' +
                '<rect x="147" y="56" width="106" height="80" fill="var(--sea-2)" stroke="var(--ink)" stroke-width="2"/>' +
                '<rect x="253" y="56" width="107" height="80" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/>' +
                '<rect x="36" y="52" width="328" height="88" rx="10" fill="none" stroke="var(--ink)" stroke-width="3"/>' +
                t(93, 102, 'ida', 17, 'middle', 'font-weight="700"') + t(200, 102, 'volta', 17, 'middle', 'font-weight="700"') + t(306, 102, 'reserva', 17, 'middle', 'font-weight="700"') +
                '<line x1="147" y1="40" x2="147" y2="156" stroke="var(--magenta)" stroke-width="4"/>' +
                t(147, 32, 'vire de volta aqui', 15, 'middle', 'fill="var(--magenta)" font-weight="700"') +
                t(200, 186, 'Tanque de 60 L:', 15) + t(200, 208, '20 L ida · 20 L volta · 20 L reserva', 15)),
              legenda: 'A regra do terço dita a hora de voltar: gastou um terço do tanque na ida, é hora de retornar, aconteça o que acontecer no destino.' },
            { t: 'fato', ref: 'extra-arrais-1-08', html: 'A lista de verificação também manda calcular o consumo com margem de segurança para garantir o regresso.' },
            { t: 'h', txt: 'Como estimar o consumo' },
            { t: 'p', html: 'O consumo depende da rotação, da carga, do casco e do mar. O manual do motor dá uma ideia em litros por hora, mas o melhor dado é o do seu barco: encha o tanque, navegue algumas horas na rotação de cruzeiro, complete de novo e divida os litros pelas horas.' },
            { t: 'p', html: 'Exemplo: um motor que consome 12 L/h e um tanque de 60 L. Pela regra do terço, você tem 20 L para a ida, ou seja, 20 ÷ 12 ≈ 1 h 40 min de navegação até o ponto de retorno. Se o destino fica a 2 h, o plano não fecha: encurte o passeio ou leve mais combustível. Lembre que a volta pode ser contra vento, ondas ou correnteza e consumir mais que a ida.' },
            { t: 'p', html: 'Num veleiro, o motor diesel gasta pouco, mas o tanque também é pequeno, e você pode precisar motorar horas contra o vento se ele parar ou virar. Planeje o combustível como se não houvesse vento.' },
            { t: 'h', txt: 'Conferir o nível' },
            { t: 'fato', ref: 'programa-47', html: 'Na NORMAM-211 em vigor (Rev. 1, 2026), o treinamento prático do Arrais-Amador (Anexo 5-A, Seção II, a, II) inclui o item 2.8: verificar o nível do tanque de combustível e demonstrar os procedimentos para abastecer a embarcação corretamente (ventilação, uso dos suspiros e etc.). O arquivo editável de anexos da DPC (ZIP) está desatualizado e termina em 2.7.' },
            { t: 'p', html: 'Marcadores de boia são imprecisos e mudam com a inclinação do barco. Confirme com uma vareta graduada, com o visor do tanque ou pelo registro do que foi abastecido e das horas de motor.' },
            { t: 'h', txt: 'Abastecer: os cuidados essenciais' },
            { t: 'lista', itens: [
              'Motor desligado, assim como equipamentos elétricos e fogão. Ninguém fumando. Passageiros em terra.',
              'Abasteça tanques portáteis em terra, fora do barco.',
              'Feche escotilhas e gaiutas durante o abastecimento, para os vapores não entrarem.',
              'Confira o bocal: ele está marcado como combustível. Pôr gasolina no tanque de água (ou o contrário) é erro clássico.',
              'Mantenha o bico encostado no bocal, não encha até transbordar e limpe qualquer respingo.',
              'Depois, abra tudo para ventilar; com motor de centro a gasolina, rode o exaustor por pelo menos 4 minutos e cheire o porão antes da partida.',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-30', html: 'Vapores de gasolina podem explodir na partida se o compartimento do motor não estiver ventilado; a NORMAM recomenda ventilar por pelo menos 4 minutos antes de dar partida.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Cheiro de gasolina a bordo', html: 'Se sentir cheiro de gasolina no porão ou na cabine, não dê partida e não acione nenhum interruptor. Abra tudo, ventile e procure o vazamento. O vapor de gasolina é mais pesado que o ar e se acumula no fundo do casco. Os pontos de fulgor e o procedimento completo de abastecimento estão no módulo de incêndio e combustíveis.' },
            { t: 'termos', ids: ['singradura', 'sentina', 'aviso-de-saida'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-061', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'O que diz a regra de um terço recomendada pela NORMAM-211?',
                alternativas: ['1/3 do combustível para a ida, 1/3 para a volta e 1/3 de reserva', '1/3 do tanque basta para qualquer passeio de um dia', 'Abasteça quando o tanque chegar a 1/3', 'Leve 1/3 a mais de combustível do que o necessário para a ida'],
                correta: 0,
                explicacao: 'A regra divide o combustível em ida, volta e reserva, em partes iguais. Ela não diz que um terço basta, nem é regra de quando abastecer. Levar só um terço a mais que a ida não cobre a volta.',
                referencia: 'NORMAM-211/DPC, Anexo 4-B, item 4.2', fonte_url: NORMAM },
              { id: 'arrais-1-062', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 2,
                enunciado: 'Seu tanque tem 90 L e o motor consome 15 L/h na rotação de cruzeiro. Pela regra do terço, por quanto tempo você pode navegar na ida antes de voltar?',
                alternativas: ['2 horas', '3 horas', '6 horas', '4 horas'],
                correta: 0,
                explicacao: 'Um terço de 90 L é 30 L; 30 ÷ 15 = 2 h. 3 h usaria 45 L (metade do tanque) na ida. 6 h seria o tanque inteiro. 4 h usaria 60 L, sem combustível para voltar com reserva.',
                referencia: 'NORMAM-211/DPC, Anexo 4-B, item 4.2 (regra do terço)', fonte_url: NORMAM },
              { id: 'arrais-1-063', nivel: 'arrais', tema: 'Incêndio e combustíveis', dificuldade: 2,
                enunciado: 'Antes de dar partida num motor de centro a gasolina, o que a NORMAM-211 recomenda?',
                alternativas: ['Ventilar o compartimento do motor por pelo menos 4 minutos', 'Acelerar em ponto morto por 4 minutos para aquecer', 'Fechar todas as escotilhas para não entrar umidade', 'Dar partida com o motor engrenado para testar o hélice'],
                correta: 0,
                explicacao: 'Vapores de gasolina acumulados podem explodir na partida; a recomendação é acionar a ventilação por pelo menos 4 minutos. Acelerar em ponto morto não tira os vapores. Fechar as escotilhas prende os vapores lá dentro. Dar partida engrenado é perigoso.',
                referencia: 'NORMAM-211/DPC, Anexo 4-B, item 4.1', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 4-B, itens 4.1 (ventilação) e 4.2 (regra de um terço)', url: NORMAM, ref: 'tecnico-166' },
              { txt: 'NORMAM-211/DPC, Anexo 5-F, item 05', url: NORMAM, ref: 'extra-arrais-1-08' },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, item 2.8 (nível do tanque e abastecimento), NORMAM-211 Rev. 1', url: NORMAM, ref: 'programa-47' },
              { txt: 'USCG Boating Safety Division, A Boater’s Guide to the Federal Requirements for Recreational Boats (rev. nov. 2023), “Fueling Precautions” e “Fuel Management”', url: 'https://dnr.illinois.gov/content/dam/soi/en/web/dnr/safety/documents/federalrecreationalboatrequirements.pdf' },
            ] },
          ],
        },
        {
          id: 'l3',
          titulo: 'Gêneros, água e peso a bordo',
          minutos: 12,
          objetivos: [
            'Planejar água e comida para um passeio com folga para imprevistos',
            'Embarcar pessoas e cargas sem comprometer a estabilidade',
            'Respeitar a lotação e peiar o que pode se soltar',
          ],
          blocos: [
            { t: 'fato', ref: 'extra-arrais-1-02', html: 'No treinamento prático, a preparação do barco inclui o embarque de pessoal, as manobras de peso a bordo, o uso do VHF e da salvatagem, o abastecimento de gêneros e água e o plano de navegação.' },
            { t: 'h', txt: 'Água' },
            { t: 'p', html: 'No sol e no vento do litoral e dos rios brasileiros, o corpo perde água muito mais rápido do que se percebe. Como referência, os padrões humanitários do Projeto Esfera estimam de 2,5 a 3 litros por pessoa por dia só para beber e preparar alimentos, em condições normais. Com calor e esforço, a necessidade cresce. Planeje com folga e conte com um atraso: motor em pane, vento que caiu, maré que não deixa entrar no canal.' },
            { t: 'lista', itens: [
              'Leve a água em mais de um recipiente: se um vazar ou contaminar, sobra o outro.',
              'Deixe uma reserva separada, que não se toca no passeio.',
              'Bebida alcoólica desidrata e atrapalha o julgamento. A lista do Anexo 5-F recomenda evitá-la durante a navegação.',
            ] },
            { t: 'p', html: 'Para travessias, a referência internacional de regatas oceânicas pede uma reserva lacrada de água de emergência por tripulante.', intl: true },
            { t: 'fato', ref: 'travessia-34', html: 'Regras Especiais de Regatas Oceânicas da World Sailing (categorias 1 a 3): pelo menos 2 litros de água potável por pessoa para emergência, em recipiente dedicado e lacrado.', intl: true },
            { t: 'h', txt: 'Comida e o resto da sacola' },
            { t: 'lista', itens: [
              'Alimentos que não precisam de fogão: frutas, sanduíches, castanhas, biscoitos salgados (ajudam quem enjoa).',
              'Caixa térmica peiada, que não escorrega no primeiro balanço.',
              'Protetor solar, chapéu, óculos escuros e um agasalho corta-vento: no mar e nos lagos, o vento esfria muito.',
              'Remédio para enjoo, tomado antes de sair (depois de enjoado, ele quase não funciona), e os remédios de uso pessoal.',
              'Sacos de lixo: tudo o que embarca volta para terra.',
            ] },
            { t: 'h', txt: 'Embarcar pessoas' },
            { t: 'lista', ordenada: true, itens: [
              'Um de cada vez, com o barco firme junto ao cais.',
              'Pise no centro do barco (na linha de centro) e o mais baixo possível, nunca na borda.',
              'Mãos livres: a bagagem vem depois, passada de mão em mão.',
              'Ninguém pula do cais para o barco.',
              'Distribua as pessoas para o barco ficar sem banda (inclinado para um lado) e sem afundar demais a proa ou a popa.',
            ] },
            { t: 'fato', ref: 'extra-arrais-1-11', html: 'Respeite a lotação máxima da embarcação. E não permita que pessoa não habilitada conduza: o proprietário responde perante o Tribunal Marítimo e nas esferas civil e penal.' },
            { t: 'h', txt: 'Peso baixo, no centro e peiado' },
            { t: 'p', html: 'Peso <b>baixo</b> e <b>perto do centro</b> deixa o barco mais estável. Peso alto (gente em pé no teto, carga sobre a casaria) e peso de um lado só fazem o barco adernar e diminuem a borda livre. Água solta no porão ou num tanque pela metade corre de um lado para o outro e piora a estabilidade. O porquê disso está no módulo de estabilidade.' },
            { t: 'figura', svg: svg('0 0 400 252', 'Comparação entre peso baixo e centrado, que mantém o barco estável, e peso alto e de um lado, que faz o barco adernar',
                t(100, 26, 'peso baixo e no centro', 15, 'middle', 'font-weight="700"') + t(300, 26, 'peso alto e de um lado', 15, 'middle', 'font-weight="700"') +
                '<rect x="0" y="130" width="200" height="80" fill="var(--sea-3)" opacity="0.45"/><rect x="200" y="130" width="200" height="80" fill="var(--sea-3)" opacity="0.45"/>' +
                '<line x1="0" y1="130" x2="400" y2="130" stroke="var(--sea-3)" stroke-width="2"/>' +
                '<g transform="translate(100,124)"><path d="M-62,-34 Q-66,22 -30,38 L30,38 Q66,22 62,-34 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                  '<g fill="var(--magenta)"><circle cx="-20" cy="-4" r="9"/><circle cx="0" cy="-4" r="9"/><circle cx="20" cy="-4" r="9"/></g></g>' +
                '<g transform="translate(300,132) rotate(14)"><path d="M-62,-34 Q-66,22 -30,38 L30,38 Q66,22 62,-34 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>' +
                  '<g fill="var(--magenta)"><circle cx="38" cy="-48" r="9"/><circle cx="56" cy="-48" r="9"/><circle cx="47" cy="-66" r="9"/></g></g>' +
                t(100, 222, 'estável', 15, 'middle', 'font-weight="700"') + t(100, 242, 'borda livre igual', 15) + t(300, 222, 'adernado', 15, 'middle', 'font-weight="700"') + t(300, 242, 'borda livre menor', 15)),
              legenda: 'Corte transversal. À esquerda, as pessoas sentadas baixo e no centro. À direita, de pé e todas de um lado: o barco aderna e a borda daquele lado chega perto da água.' },
            { t: 'fato', ref: 'extra-arrais-1-31', html: 'Antes da viagem, armazene e peie tudo o que existe a bordo, para que nada se desloque com o mar, cause avaria ou machuque alguém.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Ninguém na proa nem na borda de lancha em movimento', html: 'Passageiro sentado na proa ou na borda de uma lancha em movimento pode cair à frente do barco e ser atropelado pelo casco e pelo hélice. Com o barco andando, todos sentados dentro, nos assentos.' },
            { t: 'termos', ids: ['lotacao', 'banda', 'estabilidade', 'borda-livre', 'enjoo'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-064', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Qual é a forma segura de embarcar num barco pequeno a partir do cais?',
                alternativas: ['Um de cada vez, pisando no centro e o mais baixo possível, com as mãos livres', 'Pulando do cais para o meio do barco para não molhar os pés', 'Todos juntos, para o barco não balançar duas vezes', 'Pisando na borda, que é mais firme, com a bagagem na mão'],
                correta: 0,
                explicacao: 'Embarcar um de cada vez, no centro e baixo, mantém o barco estável; mãos livres permitem se segurar. Pular provoca quedas e balanço forte. Todos juntos sobrecarregam um lado. Pisar na borda inclina o barco e pode virá-lo.',
                referencia: 'NORMAM-211, Anexo 5-A, Seção II, item 2.1 (embarque de pessoal); Arte Naval, vol. 2' },
              { id: 'arrais-1-065', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Por que não se deve deixar passageiros sentados na proa ou na borda de uma lancha em movimento?',
                alternativas: ['Porque podem cair à frente do barco e ser atingidos pelo casco e pelo hélice', 'Porque atrapalham a visão das luzes de navegação', 'Porque é proibido apenas à noite', 'Porque o peso na proa aumenta o consumo de combustível'],
                correta: 0,
                explicacao: 'A queda à frente de uma lancha em movimento é um acidente grave: o barco passa por cima da pessoa, com o hélice. A visão das luzes não é a questão principal. O risco existe de dia e de noite. O consumo não é o motivo de segurança.',
                referencia: 'NORMAM-211, Anexo 4-B, item 3.1 (riscos); Anexo 5-F, item 11' },
              { id: 'arrais-1-066', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 2,
                enunciado: 'Segundo a lista do Anexo 5-F, se o proprietário permitir que uma pessoa não habilitada conduza a embarcação:',
                alternativas: ['O proprietário responde perante o Tribunal Marítimo e nas esferas civil e penal', 'Só quem conduziu responde; o proprietário não tem responsabilidade', 'Não há problema se o proprietário estiver a bordo', 'Basta que o condutor esteja de colete salva-vidas'],
                correta: 0,
                explicacao: 'O item 08 da lista diz que o proprietário responde perante o Tribunal Marítimo e nas esferas civil e penal. O condutor não habilitado também comete infração, mas o proprietário não fica isento. Estar a bordo não autoriza um não habilitado a conduzir. Colete não substitui habilitação.',
                referencia: 'NORMAM-211/DPC, Anexo 5-F, item 08', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção II, item 2.1 (preparação da embarcação)', url: NORMAM, ref: 'extra-arrais-1-02' },
              { txt: 'NORMAM-211/DPC, Anexo 5-F, item 08, e Anexo 4-B, item 1.4', url: NORMAM, ref: 'extra-arrais-1-31' },
              { txt: 'The Sphere Handbook (Projeto Esfera), padrão de abastecimento de água 2.1: necessidades básicas de sobrevivência', url: 'https://spherestandards.org/handbook/' },
            ] },
          ],
        },
        {
          id: 'l4',
          titulo: 'Salvatagem e equipamentos: o que conferir antes de soltar as amarras',
          minutos: 12,
          objetivos: [
            'Conferir o material obrigatório para a navegação interior',
            'Fazer o briefing de segurança com quem está a bordo',
            'Saber onde está cada equipamento e como verificá-lo',
          ],
          blocos: [
            { t: 'p', html: 'Salvatagem é o conjunto de equipamentos para salvar vidas: coletes, boias, balsas, sinais. Antes de sair, o comandante confere se o material está a bordo, em bom estado e ao alcance. Os detalhes de cada equipamento estão no módulo de salvatagem e sobrevivência; aqui fica o que verificar no cais.' },
            { t: 'fato', ref: 'extra-arrais-1-17', html: 'É responsabilidade do <b>comandante</b> ter a bordo material de navegação e salvatagem compatível com o percurso e com o número de pessoas.' },
            { t: 'h', txt: 'O mínimo obrigatório em navegação interior' },
            { t: 'fato', ref: 'extra-arrais-1-24', html: '<b>Coletes salva-vidas</b>: obrigatórios em todas as embarcações; classes III ou V para miúdas e de médio porte.' },
            { t: 'fato', ref: 'extra-arrais-1-25', html: '<b>Boia salva-vidas</b> (circular ou ferradura): médio porte com menos de 12 m, uma; com 12 m ou mais, duas; pelo menos uma com retinida flutuante. Miúdas estão dispensadas.' },
            { t: 'fato', ref: 'extra-arrais-1-26', html: 'Médio porte: âncora com no mínimo 20 m de cabo ou amarra, apito, agulha magnética, bandeira nacional e uma lanterna portátil.' },
            { t: 'fato', ref: 'extra-arrais-1-27', html: 'Médio porte: bomba de esgoto e extintor de incêndio.' },
            { t: 'fato', ref: 'extra-arrais-1-28', html: 'Luzes de navegação do RIPEAM (nas miúdas, em navegação noturna). Rádio VHF recomendado para médio porte. Pirotécnicos dispensados para miúdas e médio porte em navegação interior.' },
            { t: 'fato', ref: 'extra-arrais-1-29', html: 'Material de primeiros socorros: obrigatório a partir de 15 pessoas a bordo (médio e grande porte).' },
            { t: 'callout', tipo: 'nota', titulo: 'Mínimo não é suficiente', html: 'A lista obrigatória é o piso. Um VHF portátil, um kit de primeiros socorros e uma faca no cockpit custam pouco e fazem diferença mesmo num lago. Em navegação costeira e oceânica a lista cresce, e você vai vê-la nos cursos de Mestre e Capitão.' },
            { t: 'h', txt: 'Como conferir cada item' },
            { t: 'tabela', cab: ['Item', 'O que conferir'], linhas: [
              ['Coletes', 'Um para cada pessoa, inclusive tamanhos infantis; fivelas e fitas inteiras; apito preso; guardados em local de acesso rápido, não trancados.'],
              ['Boia salva-vidas', 'No suporte, solta para ser jogada em um gesto; retinida aduchada junto da boia, com o chicote não amarrado ao barco (NORMAM-211, art. 4.15).'],
              ['Extintor', 'Lacre intacto, ponteiro do manômetro na faixa verde, validade em dia, perto da saída da cabine e do motor.'],
              ['Lanterna e apito', 'Lanterna com pilhas boas (e reservas); apito ao alcance do timoneiro.'],
              ['Âncora', 'Cabo ou amarra amarrado ao barco pelo chicote, aduchado e pronto para correr.'],
              ['Bomba de esgoto', 'Liga e esgota; a manual tem a alavanca no lugar.'],
              ['Luzes e VHF', 'Teste de cada luz; chamada de teste no rádio, num canal de trabalho, sem ocupar o canal 16.'],
            ] },
            { t: 'figura', svg: svg('0 0 400 400', 'Onde ficam os equipamentos de segurança num veleiro de cruzeiro, vista de cima',
                cascoTopo(200, 30, 350, 150) +
                '<rect x="140" y="120" width="120" height="150" rx="10" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="5 4"/>' +
                '<rect x="148" y="280" width="104" height="80" rx="10" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="5 4"/>' +
                t(200, 140, 'cabine', 15) + t(200, 374, 'cockpit', 15) +
                num(200, 80, '6') + num(200, 200, '5') + num(162, 252, '3') + num(238, 252, '4') + num(200, 292, '8') + num(166, 326, '1') + num(234, 326, '7') + num(290, 360, '2')),
              legenda: '1 coletes (paiol do cockpit) · 2 boia salva-vidas (púlpito de popa) · 3 extintor (saída da cabine) · 4 VHF e painel · 5 lanterna e kit de primeiros socorros · 6 âncora e amarra (paiol de proa) · 7 bomba de esgoto manual · 8 agulha. A posição exata varia: o importante é que todos a bordo saibam onde está cada um.' },
            { t: 'h', txt: 'O briefing de segurança' },
            { t: 'p', html: 'Antes de soltar as amarras, reúna todos por dois minutos e mostre:' },
            { t: 'lista', itens: [
              'Onde estão os coletes e como vesti-los e ajustá-los (crianças já saem vestidas).',
              'A boia salva-vidas e quem a joga se alguém cair. O que fazer: gritar, apontar, não pular atrás.',
              'O extintor e como usá-lo.',
              'O VHF: como chamar no canal 16 se o comandante não puder.',
              'Como pôr o motor em ponto morto e desligá-lo (e onde está o cordão de segurança).',
              'Onde não ficar: proa de lancha em movimento, perto do hélice, entre o barco e o cais.',
            ] },
            { t: 'termos', ids: ['salvatagem', 'colete-salva-vidas', 'boia-circular', 'retinida', 'extintor', 'comandante'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-067', nivel: 'arrais', tema: 'Salvatagem e sobrevivência', dificuldade: 2,
                enunciado: 'Em navegação interior, quais classes de colete salva-vidas a NORMAM-211 exige para uma embarcação de médio porte?',
                alternativas: ['Classes III ou V', 'Classe I', 'Classe II', 'Nenhuma: em águas interiores os coletes são dispensados'],
                correta: 0,
                explicacao: 'O quadro de navegação interior exige coletes de classe III ou V para miúdas e médio porte (classe III para grande porte). A classe I é a da navegação oceânica e a II, da costeira. Os coletes nunca são dispensados.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.33, item 08', fonte_url: NORMAM },
              { id: 'arrais-1-068', nivel: 'arrais', tema: 'Salvatagem e sobrevivência', dificuldade: 2,
                enunciado: 'Uma lancha de 9 m (médio porte, menos de 12 m) em navegação interior deve ter quantas boias salva-vidas?',
                alternativas: ['Uma, com retinida flutuante', 'Duas, ambas com retinida', 'Nenhuma, basta o colete', 'Uma para cada pessoa a bordo'],
                correta: 0,
                explicacao: 'Médio porte com menos de 12 m: uma boia; com 12 m ou mais: duas; pelo menos uma com retinida flutuante. Só as miúdas são dispensadas. O número de boias não depende do número de pessoas (o de coletes, sim).',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.33, item 05', fonte_url: NORMAM },
              { id: 'arrais-1-069', nivel: 'arrais', tema: 'Legislação (RLESTA e NORMAM-211)', dificuldade: 1,
                enunciado: 'De quem é a responsabilidade de ter a bordo o material de navegação e de salvatagem compatível com o percurso e o número de pessoas?',
                alternativas: ['Do comandante da embarcação', 'Da marina ou do clube de onde o barco sai', 'Da Capitania dos Portos', 'Do instrutor que deu o treinamento'],
                correta: 0,
                explicacao: 'A NORMAM-211 atribui ao comandante essa responsabilidade (art. 4.6.2 e Anexo 4-A). A marina orienta e verifica alguns itens, mas não responde no lugar dele. A Capitania fiscaliza. O instrutor não tem relação com a saída.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.6.2', fonte_url: NORMAM },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Cap. 4, art. 4.33: quadro de equipamentos para navegação interior', url: NORMAM, ref: 'extra-arrais-1-24' },
              { txt: 'NORMAM-211/DPC, Cap. 4, art. 4.6.2: responsabilidade do comandante', url: NORMAM, ref: 'extra-arrais-1-17' },
              { txt: 'NORMAM-211/DPC, Anexo 5-F, itens 02 e 03', url: NORMAM, ref: 'extra-arrais-1-06' },
            ] },
          ],
        },
        {
          id: 'l5',
          titulo: 'Plano de navegação e Aviso de Saída (ou NAVSEG)',
          minutos: 14,
          objetivos: [
            'Montar um plano de navegação simples para um passeio',
            'Entregar o Aviso de Saída ou registrar a viagem no NAVSEG',
            'Calcular distância, velocidade e tempo de um percurso',
          ],
          blocos: [
            { t: 'p', html: 'O manual de navegação da Marinha define navegar como planejar, acompanhar e controlar o movimento de uma embarcação de um ponto a outro, com segurança. O planejamento tem quatro etapas, e elas servem tanto para um navio quanto para o seu passeio de domingo:' },
            { t: 'lista', ordenada: true, itens: [
              '<b>Avaliação</b>: juntar as informações (barco, tripulação, cartas, marés, tempo, perigos do caminho).',
              '<b>Plano</b>: traçar a rota, com os pontos de passagem, horários e alternativas.',
              '<b>Execução</b>: navegar conforme o plano, conferindo equipamento, maré, tempo e luz do dia.',
              '<b>Monitoramento</b>: acompanhar a posição e mudar o plano quando a situação mudar.',
            ] },
            { t: 'h', txt: 'O que vai no plano' },
            { t: 'lista', itens: [
              '<b>Rota</b>: saída, pontos de passagem e destino, com as distâncias em milhas náuticas.',
              '<b>Perigos</b>: pedras, baixios, bancos de areia, canais de navios, áreas proibidas ou de banhistas.',
              '<b>Horários</b>: saída, chegada e um <b>horário-limite de retorno</b>. Chegue antes do pôr do sol, a menos que o barco e você estejam preparados para navegar à noite.',
              '<b>Maré</b>, onde ela importa para passar num canal raso ou entrar na marina.',
              '<b>Combustível</b>, pela regra do terço, e <b>previsão do tempo</b>.',
              '<b>Alternativas</b>: uma enseada ou porto de abrigo no caminho se o tempo piorar.',
              '<b>Comunicação</b>: VHF, celular carregado e quem, em terra, sabe do seu plano.',
            ] },
            { t: 'fato', ref: 'normas-14', html: 'A habilitação do condutor deve ser compatível com a área de navegação em que o barco estiver. O Arrais-Amador navega só em águas interiores: confira se toda a rota está dentro dos limites definidos pela Capitania da região.' },
            { t: 'h', txt: 'Distância, velocidade e tempo' },
            { t: 'p', html: 'No mar, a distância se mede em <b>milhas náuticas</b> (1 milha = 1.852 m) e a velocidade em <b>nós</b> (1 nó = 1 milha por hora). Tempo = distância ÷ velocidade. No exemplo da figura, a rota tem 2,0 + 3,5 + 2,5 = 8,0 milhas. A 5 nós (um veleiro motorando), são 8 ÷ 5 = 1,6 h, ou 1 h 36 min. A 16 nós (uma lancha), 30 minutos.' },
            { t: 'figura', svg: svg('0 0 400 300', 'Exemplo de plano de navegação: rota da marina até uma ilha com dois pontos de passagem, um baixio a evitar e uma enseada de abrigo',
                '<rect x="0" y="0" width="400" height="300" fill="var(--sea-1)"/>' +
                '<path d="M0,0 L120,0 Q92,58 40,92 Q100,122 72,172 Q40,232 72,300 L0,300 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
                '<ellipse cx="330" cy="86" rx="44" ry="24" fill="var(--land)" stroke="var(--ink)" stroke-width="1.5"/>' +
                t(330, 92, 'Ilha B', 15, 'middle', 'font-weight="700"') +
                '<ellipse cx="196" cy="214" rx="38" ry="16" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
                t(196, 246, 'baixio 0,8 m', 15, 'middle', 'font-style="italic"') +
                '<path d="M64,252 L130,206 L250,130 L292,104" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
                '<path d="M130,206 Q90,150 56,96" fill="none" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 5"/>' +
                '<g fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="2.5"><circle cx="130" cy="206" r="7"/><circle cx="250" cy="130" r="7"/></g>' +
                '<rect x="56" y="246" width="14" height="12" fill="var(--magenta)"/>' +
                t(84, 280, 'Marina A', 15, 'start', 'font-weight="700"') +
                t(140, 230, 'WP1', 15, 'start') + t(258, 150, 'WP2', 15, 'start') +
                t(112, 246, '2,0 M', 15, 'end', 'fill="var(--magenta)"') + t(196, 154, '3,5 M', 15, 'end', 'fill="var(--magenta)"') + t(282, 128, '2,5 M', 15, 'start', 'fill="var(--magenta)"') +
                t(60, 84, 'enseada de abrigo', 15, 'start', 'font-style="italic"')),
              legenda: 'Rota em magenta, pontos de passagem (WP) que desviam do baixio e, tracejada, a alternativa para a enseada de abrigo se o tempo virar. Exemplo didático, fora de escala.' },
            { t: 'h', txt: 'Aviso de Saída ou NAVSEG' },
            { t: 'fato', ref: 'normas-158', html: 'O <b>Aviso de Saída</b> é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo <b>NAVSEG</b>, da Marinha.' },
            { t: 'fato', ref: 'extra-arrais-1-16', html: 'O aviso existe para que a embarcação possa ser identificada e localizada em caso de socorro; a chegada também deve ser comunicada. Pelo NAVSEG, a marina ou o clube de onde você saiu e a Marinha ficam informados, e a Marinha recomenda fortemente o aplicativo.' },
            { t: 'fato', ref: 'extra-arrais-1-20', html: 'O modelo do Aviso de Saída pede data, nome, nome e tipo da embarcação, destino, horários previstos de saída e chegada, número de pessoas a bordo e observações. Entrega-se ao clube ou à marina antes de sair, ou via rádio; também pode ser entregue a uma pessoa de confiança.' },
            { t: 'fato', ref: 'extra-arrais-1-19', html: 'Quem não é filiado a marina ou clube deve encaminhar o Aviso de Saída à Capitania, Delegacia ou Agência, ou registrar o plano no NAVSEG.' },
            { t: 'fato', ref: 'extra-arrais-1-15', html: 'Ao chegar, informe o clube ou a marina para desativar o aviso.' },
            { t: 'callout', tipo: 'seguranca', titulo: 'Mudou o plano? Avise', html: 'Se você atrasar ou mudar de destino, atualize o NAVSEG ou avise o clube e a pessoa em terra. Um aviso desatualizado leva a busca para o lugar errado, ou dispara uma busca à toa. Combine com quem fica em terra: “se eu não der notícia até as 18 h, ligue para a Capitania”.' },
            { t: 'termos', ids: ['aviso-de-saida', 'navseg', 'milha-nautica', 'no-velocidade', 'waypoint', 'derrota', 'navegacao-interior', 'npcp'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-070', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 1,
                enunciado: 'Pela NORMAM-211, o Aviso de Saída pode ser substituído por:',
                alternativas: ['Registro do plano de viagem no aplicativo NAVSEG, da Marinha', 'Uma mensagem num grupo de amigos', 'Uma ligação para o Corpo de Bombeiros', 'Nada: o Aviso de Saída é opcional'],
                correta: 0,
                explicacao: 'O NAVSEG substitui oficialmente o formulário e informa a marina e a Marinha. Mensagens informais não substituem o aviso, embora seja bom avisar alguém. Bombeiros não recebem Avisos de Saída. O aviso é obrigatório.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.6.1', fonte_url: NORMAM },
              { id: 'arrais-1-071', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 2,
                enunciado: 'Você não é sócio de marina nem de clube e vai sair de uma rampa pública. O que fazer com o Aviso de Saída?',
                alternativas: ['Encaminhá-lo à Capitania, Delegacia ou Agência, ou registrar o plano no NAVSEG', 'Nada, porque o aviso só vale para quem é sócio de clube', 'Deixá-lo no carro, no estacionamento da rampa', 'Entregá-lo ao primeiro barco que encontrar na água'],
                correta: 0,
                explicacao: 'Quem não é filiado encaminha o aviso à Capitania, Delegacia ou Agência, ou usa o NAVSEG (art. 4.6.5). A obrigação vale para todos. Um papel no carro não chega a ninguém. Entregar a outro barco não tem respaldo na norma.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.6.5', fonte_url: NORMAM },
              { id: 'arrais-1-072', nivel: 'arrais', tema: 'Preparo e plano de navegação', dificuldade: 2,
                enunciado: 'Seu destino fica a 8 milhas e você navega a 5 nós. Quanto tempo leva a viagem, aproximadamente?',
                alternativas: ['1 h 36 min', '40 min', '1 h 20 min', '2 h 30 min'],
                correta: 0,
                explicacao: 'Tempo = distância ÷ velocidade = 8 ÷ 5 = 1,6 h. 0,6 h × 60 = 36 min, então 1 h 36 min. 40 min seria a 12 nós. 1 h 20 min seria a 6 nós. 2 h 30 min seria a 3,2 nós.',
                referencia: 'Manual de Navegação (Miguens), vol. I, DHN, itens 1.7 e 1.9 (milha e nó)', fonte_url: MIG1 },
            ] },
            { t: 'fontes', itens: [
              { txt: 'Manual de Navegação da Marinha do Brasil (Miguens), vol. I, DHN, 2ª rev. 2023, item 1.2: planejamento da viagem', url: MIG1 },
              { txt: 'NORMAM-211/DPC, Cap. 4, art. 4.6 e Anexo 4-A: Aviso de Saída e chegada', url: NORMAM, ref: 'normas-158' },
              { txt: 'NORMAM-211/DPC, Anexo 5-F, itens 05, 07 e 14', url: NORMAM, ref: 'extra-arrais-1-10' },
            ] },
          ],
        },
        {
          id: 'l6',
          titulo: 'Previsão do tempo antes de sair',
          minutos: 12,
          objetivos: [
            'Consultar as fontes oficiais de previsão antes de sair',
            'Ler os itens que decidem um passeio: vento, rajadas, ondas, avisos e trovoadas',
            'Reconhecer sinais de piora do tempo durante a navegação',
          ],
          blocos: [
            { t: 'p', html: 'A maioria dos sustos no mar começa em terra, com a decisão de sair sem olhar a previsão ou de ignorá-la. Olhar o tempo não é opcional: a norma manda.' },
            { t: 'fato', ref: 'extra-arrais-1-18', html: 'Antes de sair, o comandante deve conhecer as previsões meteorológicas disponíveis e, durante o passeio, ficar atento a sinais de mau tempo, como aumento do vento, piora do estado do mar e queda acentuada da pressão atmosférica.' },
            { t: 'fato', ref: 'programa-40', html: 'O programa da prova pede noções de meteorologia e consulta à previsão do tempo nos sites da DHN e do CPTEC e no aplicativo Boletim ao Mar.' },
            { t: 'h', txt: 'Onde consultar' },
            { t: 'lista', itens: [
              '<b>Marinha (Centro de Hidrografia da Marinha)</b>: <a href="https://www.marinha.mil.br/chm/dados-do-smm-meteoromarinha/previsao-24-horas" target="_blank" rel="noopener">previsão de 24 horas</a> para as áreas marítimas e <a href="https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo" target="_blank" rel="noopener">avisos de mau tempo</a> (vento forte, ressaca, mar grosso).',
              '<b>CPTEC/INPE</b> (<a href="https://www.cptec.inpe.br" target="_blank" rel="noopener">cptec.inpe.br</a>): previsão por cidade, útil para rios, lagos e represas.',
              '<b>Boletim ao Mar</b>: aplicativo citado no programa da prova.',
              'Em águas interiores, olhe também os alertas meteorológicos oficiais para a sua região (temporais, ventos fortes, chuva intensa).',
            ] },
            { t: 'h', txt: 'O que olhar na previsão' },
            { t: 'lista', itens: [
              '<b>Vento</b>: de onde sopra e quanto, em nós. Olhe as <b>rajadas</b>, não só a média: é a rajada que deita o veleiro e levanta a onda.',
              '<b>Ondas</b>: altura e período. Em baías e lagos, vento contra a corrente ou a maré levanta um mar curto e picado.',
              '<b>Avisos de mau tempo</b> em vigor para a sua área.',
              '<b>Frentes frias</b>: no Sul e no Sudeste, a chegada de uma frente costuma girar o vento para o quadrante sul, com aumento rápido do vento e das ondas. Ela aparece na previsão com dias de antecedência.',
              '<b>Trovoadas</b>: comuns nas tardes de verão e em boa parte do ano na Amazônia e no Centro-Oeste. Trazem rajadas súbitas e raios.',
              '<b>Visibilidade</b>: nevoeiro de madrugada em baías, represas e rios.',
            ] },
            { t: 'widget', w: 'beaufort', opts: { forca: 4 }, legenda: 'Escala Beaufort: ligue a velocidade do vento ao aspecto do mar e ao que ela significa para um barco pequeno.' },
            { t: 'h', txt: 'Decidir: ir, adiar ou mudar o plano' },
            { t: 'p', html: 'Para quem está começando, uma regra simples: se a previsão (com as rajadas) passa do que você já praticou com instrutor, não saia. Planeje pelo <b>pior momento do dia</b>, que costuma ser a hora da volta, quando o vento de tarde já entrou. E tenha sempre um plano B: um destino mais perto, um abrigo no caminho, um horário mais cedo.' },
            { t: 'figura', svg: svg('0 0 400 210', 'Decisão sobre o tempo em três momentos: previsão antes de sair, sinais durante a navegação e ação',
                defs('m4l6a') +
                '<g fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"><rect x="10" y="40" width="112" height="120" rx="10"/><rect x="144" y="40" width="112" height="120" rx="10"/><rect x="278" y="40" width="112" height="120" rx="10"/></g>' +
                '<line x1="122" y1="100" x2="140" y2="100" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#m4l6a)"/><line x1="256" y1="100" x2="274" y2="100" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#m4l6a)"/>' +
                t(66, 30, 'Antes', 16, 'middle', 'font-weight="700"') + t(200, 30, 'Durante', 16, 'middle', 'font-weight="700"') + t(334, 30, 'Ação', 16, 'middle', 'font-weight="700"') +
                t(66, 72, 'previsão', 15) + t(66, 94, 'avisos', 15) + t(66, 116, 'rajadas', 15) + t(66, 138, 'plano B', 15) +
                t(200, 72, 'vento sobe', 15) + t(200, 94, 'mar cresce', 15) + t(200, 116, 'nuvem escura', 15) + t(200, 138, 'pressão cai', 15) +
                t(334, 72, 'coletes', 15) + t(334, 94, 'reduzir', 15) + t(334, 116, 'abrigo', 15) + t(334, 138, 'ou voltar', 15) +
                t(200, 196, 'decida cedo: mais tarde, as opções diminuem', 15, 'middle', 'fill="var(--magenta)"')),
              legenda: 'A previsão decide se você sai; os sinais no caminho decidem se você continua.' },
            { t: 'h', txt: 'Sinais de piora durante o passeio' },
            { t: 'lista', itens: [
              'Vento aumentando ou mudando de direção de repente.',
              'Ondas crescendo, mais carneirinhos (espuma nas cristas).',
              'Nuvens escuras e altas, em forma de torre ou de bigorna, se aproximando.',
              'Queda rápida da pressão no barômetro.',
              'Trovões: se você ouve o trovão, o raio está perto o bastante para atingir você.',
              'Queda brusca de temperatura, típica da chegada de uma frente ou de uma tempestade.',
            ] },
            { t: 'p', html: 'Ao notar esses sinais: todos de colete, peie o que estiver solto, reduza a velocidade para o mar e siga para o abrigo mais próximo ou volte. Os conceitos de meteorologia e a escala Beaufort completa estão no módulo de instrumentos, marés e tempo.' },
            { t: 'termos', ids: ['beaufort', 'rajada', 'frente-fria', 'cumulonimbo', 'nevoeiro', 'aviso-de-mau-tempo', 'barometro', 'meteoromarinha'] },
            { t: 'check', questoes: [
              { id: 'arrais-1-073', nivel: 'arrais', tema: 'Meteorologia', dificuldade: 1,
                enunciado: 'Segundo a NORMAM-211, quais são exemplos de sinais de mau tempo a observar durante o passeio?',
                alternativas: ['Aumento do vento, piora do estado do mar e queda acentuada da pressão atmosférica', 'Céu azul, vento fraco e pressão subindo', 'Maré enchendo e água mais quente', 'Aumento do número de barcos navegando'],
                correta: 0,
                explicacao: 'O art. 4.6.3 cita aumento da intensidade do vento, do estado do mar e a queda acentuada da pressão. Céu azul com pressão subindo indica tempo bom. Maré e temperatura da água não são os sinais citados. Movimento de barcos não indica tempo.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.6.3', fonte_url: NORMAM },
              { id: 'arrais-1-074', nivel: 'arrais', tema: 'Meteorologia', dificuldade: 1,
                enunciado: 'Quais fontes de previsão do tempo o programa da prova de Arrais-Amador indica?',
                alternativas: ['Os sites da DHN (Marinha) e do CPTEC/INPE e o aplicativo Boletim ao Mar', 'Somente a previsão do noticiário da TV', 'Somente o aplicativo de clima que vem no celular', 'A previsão do clube náutico, que substitui as demais'],
                correta: 0,
                explicacao: 'O Anexo 5-A cita os sites da DHN e do CPTEC e o aplicativo Boletim ao Mar. TV e aplicativos genéricos podem ajudar, mas não são as fontes indicadas. O clube não substitui a previsão oficial.',
                referencia: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 d)', fonte_url: NORMAM },
              { id: 'arrais-1-075', nivel: 'arrais', tema: 'Meteorologia', dificuldade: 2,
                enunciado: 'A previsão indica vento fraco de manhã e rajadas fortes à tarde, na hora em que você pretende voltar. Qual é a melhor decisão?',
                alternativas: ['Planejar pelo pior momento: adiantar a volta, encurtar o passeio ou adiar', 'Sair assim mesmo, porque de manhã o vento está fraco', 'Considerar só a média do vento e ignorar as rajadas', 'Sair e decidir na hora, sem plano B'],
                correta: 0,
                explicacao: 'O passeio inteiro precisa caber em condições que você domina, e a volta é o momento crítico. Decidir pela manhã ignora o que vai encontrar depois. As rajadas é que causam os problemas. Sair sem plano B reduz as opções quando o tempo virar.',
                referencia: 'NORMAM-211/DPC, Cap. 4, art. 4.6.3; Anexo 4-B, item 1.3' },
            ] },
            { t: 'fontes', itens: [
              { txt: 'NORMAM-211/DPC, Cap. 4, art. 4.6.3 (previsões e sinais de mau tempo)', url: NORMAM, ref: 'extra-arrais-1-18' },
              { txt: 'NORMAM-211/DPC, Anexo 5-A, item 3.1 d) e Anexo 5-F, item 06', url: NORMAM, ref: 'programa-40' },
              { txt: 'Centro de Hidrografia da Marinha: previsão de 24 horas e avisos de mau tempo', url: 'https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo' },
              { txt: 'CPTEC/INPE: previsão do tempo', url: 'https://www.cptec.inpe.br' },
            ] },
          ],
        },
      ],
    }
  ],
  });
})();
