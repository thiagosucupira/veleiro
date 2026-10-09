/* Curso Mestre-Amador — parte 2 (módulos m4 a m7).
   m4 Linhas de posição e o ponto · m5 Navegação estimada, corrente e vento ·
   m6 Auxílios à navegação e publicações · m7 Balizamento e RIPEAM na costa.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 2.1, alíneas b), g), h), l) e p).
   Fontes técnicas: Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª revisão 2023); RIPEAM-72
   (texto consolidado da CCA-IMO); Lista de Faróis (DH2), 40ª ed.; Carta 12000 (INT 1), 5ª ed.;
   páginas do CHM consultadas em 2026-10-07 e 2026-10-08.
   Fatos regulatórios só por bloco {t:'fato'} ou fonte com ref (ids de research/_work e
   research/_work/research_extra_mestre-2.json). Exemplos numéricos conferidos por cálculo. */
(function () {
  'use strict';

  var U = {
    man1: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf',
    ripeam: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf',
    lf: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf',
    c12000: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf',
    normam: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf',
    pubs: 'https://www.marinha.mil.br/chm/dados-do-segnav/publicacoes',
    catalogo: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/catalogo-de-cartas-e-publicacoes',
    carta12000: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/carta-12000-int-1',
    roteiros: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/roteiros',
    listaFarois: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois',
    sinaisCegos: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-sinais-cegos',
    auxRadio: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-auxilios-radio',
    correntesMare: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-2',
    cartasPiloto: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3',
    tabuas: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/tabuas-das-mares',
    raster: 'https://www.marinha.mil.br/chm/dados-do-segnav/cartas-raster',
    avisos: 'https://www.marinha.mil.br/chm/dados-do-segnav-aviso-aos-navegantes-tela',
    avisosRadio: 'https://www.marinha.mil.br/chm/dados-do-segnav-aviso-radio-nautico-tela/avisos-radio-nauticos-e-sar',
    iala: 'https://www.iala.int/product/r1001/',
    decIala: 'https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm',
    rya: 'https://www.rya.org.uk/course-finder/day-skipper-theory-course/',
  };
  function man(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), ' + loc, url: U.man1 }; }
  function rip(loc) { return { txt: 'RIPEAM-72 (texto consolidado, CCA-IMO/Marinha), ' + loc, url: U.ripeam }; }
  function q(id, tema, dif, enunciado, alternativas, correta, explicacao, referencia, url) {
    var o = { id: 'msa2-' + id, nivel: 'mestre', tema: tema, dificuldade: dif, enunciado: enunciado,
      alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
    if (url) o.fonte_url = url;
    return o;
  }
  /* SVG inline: viewBox, largura 100% (máx. ~520 px), só tokens de cor, texto de 15 unidades (≥ 12 px no celular). */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" role="img" style="max-width:' + (maxw || 520) +
      'px;display:block;margin:0 auto;font-size:15px" xmlns="http://www.w3.org/2000/svg"><title>' + titulo + '</title>' + corpo + '</svg>';
  }
  var TX = 'fill="var(--ink)"';
  var MG = 'stroke="var(--magenta)"';

  var M = [];

  /* ==================================================================================================
     m4 — Linhas de posição e o ponto (Anexo 5-A, 2.1 b)
     ================================================================================================== */

  var FIG_LDP = svg('0 0 440 420', 'Os quatro tipos de linha de posição da navegação costeira: marcação, alinhamento, distância e isóbata',
    // Painel 1: reta de marcação
    '<g><text x="2" y="16" ' + TX + ' font-weight="700">Reta de marcação</text>' +
    '<rect x="0" y="24" width="212" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M130 24 H212 V100 L180 84 L160 60 L140 44 Z" fill="var(--land)"/>' +
    '<circle cx="176" cy="60" r="5" fill="var(--ink)"/><path d="M176 60 l10 -14 l2 6 z" fill="var(--magenta)"/>' +
    '<text x="150" y="42" ' + TX + '>farol</text>' +
    '<line x1="25" y1="180" x2="176" y2="60" ' + MG + ' stroke-width="2.5"/>' +
    '<g transform="translate(88,131) rotate(-38.5)"><text x="0" y="-9" ' + TX + ' text-anchor="middle">1032</text><text x="0" y="21" ' + TX + ' text-anchor="middle">311°</text></g></g>' +
    // Painel 2: alinhamento
    '<g transform="translate(228,0)"><text x="2" y="16" ' + TX + ' font-weight="700">Alinhamento</text>' +
    '<rect x="0" y="24" width="212" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 24 H212 V80 L150 86 L100 80 L50 88 L0 78 Z" fill="var(--land)"/>' +
    '<rect x="116" y="30" width="8" height="18" fill="var(--ink)"/><rect x="109" y="64" width="7" height="11" fill="var(--ink)"/>' +
    '<text x="130" y="46" ' + TX + '>posterior</text><text x="122" y="76" ' + TX + '>anterior</text>' +
    '<line x1="120" y1="40" x2="82" y2="190" ' + MG + ' stroke-width="2.5"/>' +
    '<text x="8" y="150" ' + TX + '>sem</text><text x="8" y="168" ' + TX + '>instrumento</text></g>' +
    // Painel 3: distância
    '<g transform="translate(0,214)"><text x="2" y="16" ' + TX + ' font-weight="700">Distância</text>' +
    '<rect x="0" y="24" width="212" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<ellipse cx="60" cy="96" rx="34" ry="22" fill="var(--land)"/><circle cx="60" cy="96" r="4" fill="var(--ink)"/>' +
    '<path d="M60 168 A72 72 0 0 0 132 96" fill="none" ' + MG + ' stroke-width="2.5"/>' +
    '<path d="M132 96 A72 72 0 0 0 111 45" fill="none" ' + MG + ' stroke-width="2.5" stroke-dasharray="5 5"/>' +
    '<line x1="60" y1="96" x2="111" y2="147" stroke="var(--ink)" stroke-dasharray="3 4"/>' +
    '<text x="92" y="126" ' + TX + '>3 M</text><text x="140" y="176" ' + TX + '>radar</text></g>' +
    // Painel 4: isóbata
    '<g transform="translate(228,214)"><text x="2" y="16" ' + TX + ' font-weight="700">Isóbata</text>' +
    '<rect x="0" y="24" width="212" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 24 H212 V52 Q150 66 100 54 Q50 44 0 58 Z" fill="var(--land)"/>' +
    '<path d="M0 90 Q60 76 110 92 T212 86" fill="none" stroke="var(--ink)" stroke-width="1"/>' +
    '<path d="M0 140 Q60 124 110 142 T212 134" fill="none" ' + MG + ' stroke-width="2.5"/>' +
    '<text x="6" y="108" ' + TX + '>10 m</text><text x="6" y="160" ' + TX + '>20 m</text>' +
    '<text x="104" y="178" ' + TX + '>eco: 20 m</text></g>');

  M.push({
    id: 'm4', titulo: 'Linhas de posição e o ponto',
    resumo: 'Como achar a posição do barco olhando para terra: linhas de posição por marcação, alinhamento, distância e profundidade; posição por duas e três marcações e o triângulo de incerteza; marcações sucessivas, transporte de LDP, ângulo dobrado na proa e o par 45°/través.',
    licoes: [
      {
        id: 'l1', titulo: 'Linha de posição: onde o barco pode estar', minutos: 10,
        objetivos: [
          'Definir linha de posição (LDP) e explicar por que uma só LDP não dá a posição.',
          'Reconhecer as LDP da navegação costeira: marcação, alinhamento, distância e isóbata.',
          'Converter a marcação para verdadeira e rotular a LDP na carta do jeito certo.',
        ],
        blocos: [
          { t: 'p', html: 'Navegar perto da costa é responder, o tempo todo, a uma pergunta simples: <b>onde estou agora?</b> O GNSS responde em segundos, mas pode falhar, e a prova de Mestre-Amador cobra o método clássico. Ele começa por uma ideia: cada observação de terra não dá um ponto, dá uma <b>linha</b> onde o barco está.' },
          { t: 'callout', tipo: 'nota', titulo: 'Definição', html: 'Linha de posição (LDP) é o lugar geométrico de todas as posições que o barco pode ocupar depois de uma certa observação, num determinado instante (Manual de Navegação da DHN, item 4.2). Uma LDP contém a posição, mas não a define. Para ter um ponto, é preciso cruzar duas ou mais LDP.' },
          { t: 'termos', ids: ['linha-de-posicao', 'marcacao', 'alinhamento', 'isobata', 'carta-nautica'] },
          { t: 'h', txt: 'As LDP que você vai usar num veleiro' },
          { t: 'lista', itens: [
            '<b>Reta de marcação.</b> Você mede com a agulha de marcação (a bússola de mão) a direção de um farol, de uma ponta ou de uma torre. O barco está em algum ponto da reta que passa pelo objeto nessa direção. É a LDP mais usada na navegação costeira.',
            '<b>Alinhamento.</b> Dois objetos fixos vistos um exatamente atrás do outro. É a LDP de maior precisão e não precisa de instrumento: basta o olho. Condições: os dois pontos bem definidos, identificados e representados na carta, e o de trás (posterior) mais alto que o da frente (anterior).',
            '<b>Circunferência de igual distância.</b> Se o radar diz que você está a 3 milhas de uma ilha, o barco está em algum ponto do círculo de 3 M em volta dela. Abra o compasso na escala de latitudes da carta e trace só o arco perto da posição estimada.',
            '<b>Isóbata (linha de igual profundidade).</b> O ecobatímetro marca 20 m; o barco está perto da linha de 20 m da carta. É uma LDP aproximada: só vale onde o fundo varia de forma regular e bem levantada.',
          ] },
          { t: 'figura', svg: FIG_LDP, legenda: 'Cada observação gera uma LDP. Na marcação, escreve-se a hora (quatro dígitos) sobre a linha e o valor da marcação embaixo. Figura esquemática, fora de escala.' },
          { t: 'p', html: 'Existem ainda a <b>reta de altura</b>, da navegação astronômica (assunto do Capitão-Amador), e o <b>segmento capaz</b>, obtido medindo com o sextante o ângulo horizontal entre dois pontos de terra. Num veleiro, o segmento capaz é raro; marcação, alinhamento, distância e profundidade resolvem quase tudo.' },
          { t: 'h', txt: 'Na carta, só marcações verdadeiras' },
          { t: 'p', html: 'A agulha dá a direção em relação ao norte <i>dela</i>. A carta é desenhada em relação ao norte verdadeiro. Por isso, antes de traçar, converta: <b>Mv = Mag + Dag + Dec mg</b>, com valores a leste (E) somando e a oeste (W) subtraindo. É a mesma conversão de rumos que você viu na lição da agulha.' },
          { t: 'lista', itens: [
            'Exemplo: declinação 22° W, desvio desprezível. A bússola de mão dá 333° para o farol. Marcação verdadeira: 333° − 22° = <b>311°</b>.',
            'O desvio depende da <b>proa</b> do barco e vale para a agulha fixa de bordo. A bússola de mão, usada longe de motor, ferragens e eletrônicos, costuma ter desvio desprezível; na dúvida, confira-a num alinhamento conhecido.',
            'Aproxime declinação, desvio e marcações a 0,5°, como manda o Manual da DHN.',
          ] },
          { t: 'h', txt: 'Como traçar e rotular' },
          { t: 'lista', ordenada: true, itens: [
            'Ponha a régua paralela (ou os esquadros) na rosa dos rumos verdadeiros, no valor da marcação.',
            'Leve a régua até o objeto marcado, sem girar.',
            'Trace <b>só o trecho perto da posição estimada</b>. Prolongar todas as marcações até o farol enche a carta de riscos e confunde.',
            'Escreva a hora com quatro dígitos sobre a linha (ex.: 1032) e a marcação embaixo (ex.: 311°). Assim, quem pegar a carta depois entende o que foi feito.',
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Uma linha de rumo não é LDP', html: 'O rumo que você traçou é onde você <i>quer</i> estar. Uma LDP é onde você <i>está</i>. Se uma marcação cruza a sua linha de rumo, esse cruzamento <b>não</b> é a posição: o barco pode ter caído para fora do rumo pela corrente e pelo vento.' },
          { t: 'check', questoes: [
            q('m4l1-1', 'Navegação: linhas de posição', 1, 'O que é uma linha de posição (LDP)?',
              ['A linha que une o ponto de partida ao ponto de chegada.', 'O lugar geométrico das posições que o barco pode ocupar depois de uma observação, num dado instante.', 'A linha de rumo traçada a partir da última posição conhecida.', 'A linha que liga dois faróis representados na carta.'], 1,
              'A definição do Manual da DHN (item 4.2) é exatamente a da resposta certa: a observação diz que o barco está em algum ponto daquela linha. A linha entre partida e chegada é a derrota planejada, não uma observação. A linha de rumo é onde se pretende estar, não onde se está. A linha entre dois faróis só vira LDP se eles forem vistos alinhados.',
              'Miguens, vol. I, item 4.2', U.man1),
            q('m4l1-2', 'Navegação: linhas de posição', 1, 'Qual LDP tem a maior precisão e dispensa qualquer instrumento?',
              ['Reta de marcação tirada com a bússola de mão.', 'Circunferência de distância medida pelo radar.', 'Alinhamento de dois pontos notáveis da carta.', 'Isóbata obtida pelo ecobatímetro.'], 2,
              'O alinhamento é observado a olho nu: quando os dois pontos ficam um atrás do outro, o barco está sobre a linha que passa por eles. A marcação depende da agulha e do desvio; a distância radar depende do aparelho e do ponto de eco; a isóbata é aproximada e depende de fundo regular, do calado e da maré.',
              'Miguens, vol. I, item 4.2, alínea a', U.man1),
            q('m4l1-3', 'Navegação: linhas de posição', 2, 'Com a bússola de mão (desvio desprezível) você marca um farol aos 090°. A declinação da carta, atualizada, é 21° W. O que você traça?',
              ['Reta de marcação de 069° passando pelo farol.', 'Reta de marcação de 111° passando pelo farol.', 'Reta de marcação de 090°, porque a carta já está em graus magnéticos.', 'Circunferência de 21 milhas com centro no farol.'], 0,
              'Mv = Mmg + Dec; declinação W subtrai: 090° − 21° = 069°. Somar a declinação W (111°) é o erro mais comum. A carta é traçada em verdadeiros (só a rosa traz também o anel magnético), por isso não se traça 090°. A circunferência seria LDP de distância, não de marcação.',
              'Miguens, vol. I, itens 3.2.5 e 4.2, alínea b', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 4, itens 4.2 (LDP) e 4.3 (posição)'),
            man('cap. 3, item 3.2.5 (conversão de rumos e marcações)'),
            { txt: 'Carta 12000 (INT 1), DHN, 5ª ed. 2022: símbolos de profundidade e de pontos notáveis', url: U.c12000 },
          ] },
        ],
      },
      {
        id: 'l2', titulo: 'Posição por duas e três marcações simultâneas', minutos: 12,
        objetivos: [
          'Determinar a posição por duas e por três marcações, do jeito da prova.',
          'Escolher objetos com bom ângulo de cruzamento.',
          'Saber a ordem das marcações e qual hora dar à posição.',
        ],
        blocos: [
          { t: 'p', html: 'O método mais usado na navegação costeira é simples: marcar dois ou três pontos notáveis quase ao mesmo tempo e cruzar as retas na carta. A bordo de um veleiro é uma pessoa só que marca. Por isso as marcações nunca são realmente simultâneas; na prática são aceitas como simultâneas se o intervalo entre elas for o menor possível.' },
          { t: 'h', txt: 'Passo a passo' },
          { t: 'lista', ordenada: true, itens: [
            '<b>Escolha os objetos</b> na carta e reconheça-os no terreno: faróis, pontas bem marcadas, torres, picos com altitude. Confirme o nome de cada um.',
            '<b>Marque</b> com a bússola de mão, firme, e leia duas ou três vezes. Anote hora e odômetro.',
            '<b>Converta</b> cada marcação para verdadeira (Mv = Mag + Dag + Dec mg).',
            '<b>Trace</b> cada reta com a régua paralela a partir da rosa, levando-a até o objeto. Desenhe só o trecho perto da posição estimada.',
            '<b>Marque a posição</b> na interseção com um pequeno círculo. Numa posição por LDP simultâneas, não se rotula cada reta: escreve-se ao lado do círculo a hora e o odômetro.',
            '<b>Compare</b> com a posição estimada para a mesma hora. A diferença mostra o efeito da corrente (módulo 5).',
          ] },
          { t: 'h', txt: 'O ângulo de cruzamento decide a precisão' },
          { t: 'p', html: 'Toda marcação tem erro: a rosa balança, o barco joga, a agulha tem desvio. Esse erro vira uma faixa em volta de cada reta. Onde as faixas se cruzam fica a área em que o barco realmente pode estar. Com retas a 90° a área é pequena; com retas quase paralelas ela fica comprida e enganosa.' },
          { t: 'figura', svg: svg('0 0 440 250', 'Efeito do ângulo de cruzamento: com 90° a área de incerteza é pequena; com 25° ela fica alongada',
            '<text x="2" y="18" ' + TX + ' font-weight="700">Cruzamento de 90°</text>' +
            '<rect x="0" y="28" width="212" height="200" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<g transform="translate(106,128)"><rect x="-95" y="-12" width="190" height="24" fill="var(--magenta)" fill-opacity=".16" transform="rotate(-45)"/>' +
            '<rect x="-95" y="-12" width="190" height="24" fill="var(--magenta)" fill-opacity=".16" transform="rotate(45)"/>' +
            '<line x1="-67" y1="67" x2="67" y2="-67" ' + MG + ' stroke-width="2"/><line x1="-67" y1="-67" x2="67" y2="67" ' + MG + ' stroke-width="2"/>' +
            '<circle r="5" fill="none" stroke="var(--ink)" stroke-width="2"/></g>' +
            '<text x="12" y="218" ' + TX + '>área pequena</text>' +
            '<g transform="translate(228,0)"><text x="2" y="18" ' + TX + ' font-weight="700">Cruzamento de 25°</text>' +
            '<rect x="0" y="28" width="212" height="200" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<g transform="translate(106,128)"><rect x="-100" y="-12" width="200" height="24" fill="var(--magenta)" fill-opacity=".16" transform="rotate(-12.5)"/>' +
            '<rect x="-100" y="-12" width="200" height="24" fill="var(--magenta)" fill-opacity=".16" transform="rotate(12.5)"/>' +
            '<line x1="-97" y1="21" x2="97" y2="-21" ' + MG + ' stroke-width="2"/><line x1="-97" y1="-21" x2="97" y2="21" ' + MG + ' stroke-width="2"/>' +
            '<circle r="5" fill="none" stroke="var(--ink)" stroke-width="2"/></g>' +
            '<text x="12" y="218" ' + TX + '>área alongada</text></g>'),
            legenda: 'A faixa clara em volta de cada reta representa o mesmo erro de marcação. A parte mais escura, onde as faixas se cruzam, é a área onde o barco pode estar.' },
          { t: 'lista', itens: [
            'O ângulo ideal entre as retas é <b>180° dividido pelo número de LDP</b>: 90° para duas, 60° (ou 120°) para três.',
            'Com duas marcações, evite cruzamentos <b>menores que 30° ou maiores que 150°</b>.',
            'Prefira objetos próximos: o mesmo erro de 1° desloca a reta cerca de 0,05 M a 3 milhas do objeto, e cerca de 0,26 M a 15 milhas.',
          ] },
          { t: 'h', txt: 'Que objeto marcar primeiro' },
          { t: 'p', html: 'Com o barco andando, a marcação de um objeto <b>pelo través</b> muda depressa; a de um objeto <b>pela proa ou pela popa</b> muda devagar. A regra do Manual da DHN: marque primeiro os pontos perto da proa ou da popa e por último o do través, e dê à posição a hora da <b>última</b> marcação. Se você marcar primeiro o do través, use a hora da primeira. Em resumo: a hora da posição é a da LDP que varia mais rápido.' },
          { t: 'h', txt: 'Exemplo' },
          { t: 'p', html: 'Às 0648, entrando na barra do Rio de Janeiro, um navegante marca o farolete da Ponta do Arpoador aos 311° e o farol da Ilha de Palmas aos 229° (já verdadeiras). As retas se cruzam a 82°, ótimo ângulo. A posição é a interseção, rotulada “0648” e o odômetro (exemplo do Manual da DHN, item 4.3.1). Se as marcações tivessem sido tiradas com a bússola de mão numa área de declinação 22° W, os valores lidos seriam 333° e 251°.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Duas LDP não denunciam erro', html: 'Duas retas sempre se cruzam em algum lugar, mesmo que você tenha marcado o objeto errado. Sempre que possível, cruze <b>três</b>. Duas LDP de tipos diferentes (marcação de um objeto e distância de outro, ou duas distâncias) ainda podem se cruzar em dois pontos: a terceira LDP desfaz a ambiguidade.' },
          { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'marcacoes' }, legenda: 'Exercício gerado na carta de treino (costa fictícia). Use a ferramenta Marcação: digite as marcações, trace as LDP e toque na posição. Quando as marcações vierem magnéticas, converta com a declinação da rosa, atualizada para o ano do problema.' },
          { t: 'check', questoes: [
            q('m4l2-1', 'Navegação: linhas de posição', 2, 'Você vai tirar duas marcações: um farol quase pela proa e uma ponta quase pelo través. Qual a sequência correta e que hora dar à posição?',
              ['Primeiro a ponta pelo través; a hora é a da última marcação.', 'Primeiro o farol pela proa; a hora é a da segunda marcação (a da ponta).', 'Tanto faz a ordem; a hora é a média das duas.', 'Primeiro o farol pela proa; a hora é a da primeira marcação.'], 1,
              'A marcação pelo través muda mais depressa. Marcando-a por último, a posição fica com a hora dela, que é a LDP que varia mais rápido (Manual, 4.5.5). Marcar o través primeiro e dar a hora da última marcação inverte a regra: se o través é marcado primeiro, a hora deve ser a da primeira. A média não é usada. Marcar o farol pela proa primeiro e dar a hora da primeira marcação daria à posição a hora da LDP que varia devagar.',
              'Miguens, vol. I, item 4.5.5', U.man1),
            q('m4l2-2', 'Navegação: linhas de posição', 1, 'Para uma posição por três marcações, qual o ângulo de cruzamento ideal entre as retas?',
              ['30°', '45°', '60° (ou 120°)', '90°'], 2,
              'O Manual dá o ângulo ideal como 180°/n, sendo n o número de LDP: com três, 60° (ou o suplemento, 120°). 90° é o ideal para duas LDP. 30° é o limite mínimo recomendado para duas, e 45° não corresponde a nenhuma regra.',
              'Miguens, vol. I, item 4.5.3, alínea c', U.man1),
            q('m4l2-3', 'Navegação: linhas de posição', 3, 'Proa da agulha 090°, desvio para essa proa 2° E, declinação atualizada 22° W. A agulha dá 351° para um farol e 074° para um pico. Quais as marcações verdadeiras e o ângulo entre as retas?',
              ['331° e 054°; cruzamento de 83°.', '327° e 050°; cruzamento de 83°.', '015° e 098°; cruzamento de 83°.', '331° e 054°; cruzamento de 23°.'], 0,
              'Mv = Mag + Dag + Dec: 351 + 2 − 22 = 331° e 074 + 2 − 22 = 054°. O ângulo entre as retas é 54 − (331 − 360) = 83°, bom cruzamento. As marcações 327° e 050° subtraíram o desvio E (deveria somar). As marcações 015° e 098° somaram a declinação W (deveria subtrair). A resposta com cruzamento de 23° tem as marcações certas, mas o ângulo errado.',
              'Miguens, vol. I, itens 3.2.5 e 4.5.3', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 4, itens 4.3.1, 4.3.2, 4.5.3 e 4.5.5'),
            man('cap. 3, item 3.2.5 (conversão de marcações)'),
          ] },
        ],
      },
      {
        id: 'l3', titulo: 'Triângulo de incerteza e escolha dos pontos notáveis', minutos: 10,
        objetivos: [
          'Explicar por que três marcações formam um triângulo e o que fazer com ele.',
          'Decidir a posição quando o triângulo está perto de um perigo.',
          'Escolher bons pontos de apoio e evitar os ruins.',
        ],
        blocos: [
          { t: 'p', html: 'Três retas de marcação quase nunca se cruzam num ponto só. Elas formam um pequeno triângulo, que o Manual da DHN chama de <b>triângulo de incerteza</b> (muitos livros dizem “triângulo de erro”). Ele é uma vantagem: o tamanho do triângulo mostra, de relance, a qualidade da sua observação. Com duas retas você nunca saberia.' },
          { t: 'termos', ids: ['triangulo-de-incerteza', 'ponto', 'posicao-estimada'] },
          { t: 'h', txt: 'De onde vem o triângulo' },
          { t: 'lista', itens: [
            'As marcações não foram simultâneas (o barco andou entre uma e outra).',
            'Erro de leitura numa ou mais marcações.',
            'Desvio da agulha não considerado ou com valor errado.',
            'Objeto identificado errado.',
            'Erro de plotagem: régua escorregou, rosa errada.',
            'Erro da própria carta: ponto mal posicionado na representação.',
          ] },
          { t: 'figura', svg: svg('0 0 440 300', 'Triângulo de incerteza formado por três retas de marcação perto de uma pedra; adota-se o vértice mais próximo do perigo',
            '<rect x="0" y="0" width="440" height="300" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<line x1="59" y1="211" x2="341" y2="109" ' + MG + ' stroke-width="2"/>' +
            '<line x1="161" y1="9" x2="263" y2="291" ' + MG + ' stroke-width="2"/>' +
            '<line x1="302" y1="40" x2="90" y2="252" ' + MG + ' stroke-width="2"/>' +
            '<path d="M213.8 155 L206.7 135.3 L171.7 170.3 Z" fill="var(--magenta)" fill-opacity=".2"/>' +
            '<circle cx="206.7" cy="135.3" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<g transform="translate(262,104)"><circle r="16" fill="none" stroke="var(--ink)" stroke-dasharray="2 3"/>' +
            '<path d="M-7 0 H7 M0 -7 V7 M-5 -5 L5 5 M-5 5 L5 -5" stroke="var(--ink)" stroke-width="2"/></g>' +
            '<text x="284" y="96" ' + TX + '>pedra</text>' +
            '<line x1="250" y1="180" x2="212" y2="140" stroke="var(--ink)" stroke-dasharray="2 3"/>' +
            '<text x="252" y="194" ' + TX + '>vértice mais</text><text x="252" y="212" ' + TX + '>perto do perigo</text>' +
            '<text x="16" y="282" ' + TX + '>1 · farol</text><text x="160" y="282" ' + TX + '>2 · ponta</text><text x="300" y="282" ' + TX + '>3 · torre</text>'),
            legenda: 'Três LDP formam um triângulo. Perto de um perigo, adote o vértice mais próximo dele e tire outra posição logo em seguida. Esquema fora de escala.' },
          { t: 'h', txt: 'O que fazer com o triângulo' },
          { t: 'lista', itens: [
            '<b>Pequeno:</b> adote o centro dele como posição.',
            '<b>Perto de um perigo:</b> adote o vértice mais próximo do perigo e tire outra posição imediatamente, para confirmar.',
            '<b>Grande:</b> abandone essa posição e tire outra na hora. Algo está errado: objeto trocado, conta de declinação, régua.',
            'Com quatro LDP pode surgir um quadrilátero de incerteza; o raciocínio é o mesmo.',
          ] },
          { t: 'h', txt: 'Como escolher os pontos de apoio' },
          { t: 'lista', itens: [
            '<b>Identifique certo</b>, no terreno e na carta. Cuidado com construções novas: um prédio alto e notável pode ainda não estar na carta.',
            '<b>Prefira pontos próximos.</b> O erro angular vira erro linear maior quanto mais longe está o objeto.',
            '<b>Busque bom ângulo de cruzamento</b> (180°/n). Com duas retas, entre 30° e 150°.',
            '<b>Com duas marcações, um pela proa (ou popa) e outro pelo través.</b> O da proa mostra se você está adiantado ou atrasado; o do través mostra se caiu para um bordo (o caimento).',
            '<b>Ponto novo:</b> quando começar a usar um ponto que ainda não marcou, cruze-o com dois pontos já conhecidos. Sem isso, confira se a distância entre a posição anterior e a nova bate com a distância navegada: saltos e recuos denunciam erro de identificação.',
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'Boia não é ponto de apoio', html: 'Boias podem garrar (sair do lugar) pela corrente, pelo vento, por uma colisão ou por uma rede enroscada na amarra. O Manual da DHN é claro: não se deve navegar pelas boias nem usá-las para tirar LDP. Use-as para <b>confirmar</b> a navegação, nunca para definir a posição.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Na trilha RYA', html: 'Em inglês o triângulo é o <i>cocked hat</i>, e o ponto de apoio bem escolhido é um <i>conspicuous object</i>. Os cursos teóricos do RYA (Day Skipper e Coastal Skipper) usam exatamente as mesmas regras de escolha de pontos e de ângulo de cruzamento.' },
          { t: 'check', questoes: [
            q('m4l3-1', 'Navegação: linhas de posição', 2, 'Suas três marcações formaram um triângulo pequeno, mas uma laje está a pouca distância de um dos vértices. O que fazer?',
              ['Adotar o centro do triângulo e seguir o rumo.', 'Adotar o vértice mais próximo da laje e tirar outra posição em seguida.', 'Adotar o vértice mais afastado da laje, pois é o mais provável.', 'Descartar a marcação que forma o lado mais próximo da laje.'], 1,
              'Perto de perigo, a regra é de segurança: considere-se no vértice mais próximo do perigo e confirme logo com nova posição (Manual, 4.5.4, alínea b). O centro só é adotado quando o triângulo é pequeno e longe de perigo. Escolher o vértice mais afastado é otimismo perigoso. Descartar uma marcação sem motivo deixa você com duas LDP, que não denunciam erro.',
              'Miguens, vol. I, item 4.5.4', U.man1),
            q('m4l3-2', 'Navegação: linhas de posição', 1, 'Por que não se deve usar uma boia para tirar uma linha de posição?',
              ['Porque as boias não aparecem na carta náutica.', 'Porque a boia pode estar fora da posição (garrada), e a LDP herdaria esse erro.', 'Porque o RIPEAM proíbe se aproximar de boias.', 'Porque a marcação de uma boia é sempre magnética.'], 1,
              'Boias são fundeadas e podem garrar pela corrente, pelo vento, por colisão ou redes. Por isso o Manual da DHN recomenda usá-las só para confirmar a navegação (13.2.2, alínea d). Elas aparecem, sim, na carta; o RIPEAM não trata disso; e a marcação de qualquer objeto é magnética ou verdadeira conforme a agulha usada, não pelo tipo de objeto.',
              'Miguens, vol. I, item 13.2.2, alínea d', U.man1),
            q('m4l3-3', 'Navegação: linhas de posição', 2, 'Você erra 1° numa marcação. Quanto a reta se desloca, aproximadamente, a 15 milhas do objeto?',
              ['0,02 M', '0,26 M', '1,0 M', '2,6 M'], 1,
              'O deslocamento lateral é a distância vezes a tangente do erro: 15 × tg 1° ≈ 15 × 0,0175 ≈ 0,26 M. A 3 milhas, o mesmo erro daria só 0,05 M; por isso o Manual recomenda pontos próximos. 1,0 M e 2,6 M correspondem a erros de cerca de 4° e 10°; 0,02 M seria o efeito a pouco mais de 1 milha.',
              'Miguens, vol. I, item 4.5.3, alínea b', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 4, itens 4.5.3 (seleção dos pontos de apoio) e 4.5.4 (triângulo de incerteza)'),
            man('cap. 13, item 13.2.2, alínea d (boias)'),
            { txt: 'RYA, Day Skipper Theory (programa do curso)', url: U.rya, ref: 'internacional-08' },
          ] },
        ],
      },
      {
        id: 'l4', titulo: 'Alinhamento, distância e isóbata na prática', minutos: 12,
        objetivos: [
          'Usar alinhamentos para posição e para seguir um canal.',
          'Obter posição por marcação e distância e por marcação e profundidade.',
          'Corrigir a profundidade do ecobatímetro antes de usá-la como LDP.',
        ],
        blocos: [
          { t: 'p', html: 'Marcações cruzadas resolvem a maior parte das posições. Mas a costa oferece outras LDP muito boas, e algumas dão até mais segurança: o alinhamento, a distância e a profundidade.' },
          { t: 'h', txt: 'Alinhamento: a melhor LDP' },
          { t: 'p', html: 'Quando dois pontos fixos ficam um exatamente atrás do outro, você está sobre a reta que passa por eles. É a LDP mais precisa e não precisa de instrumento. Muitos alinhamentos já vêm traçados nas cartas, como o alinhamento Candelária–Ilha Fiscal (Carta 1511, barra do Rio de Janeiro) e o alinhamento “C” do Porto de Santos (Carta 1713). Outros, que você mesmo identifica (uma torre atrás de uma ponta, por exemplo), também valem, desde que os dois pontos estejam na carta.' },
          { t: 'p', html: 'Nas entradas de porto, o alinhamento indica o eixo do canal. O sinal mais próximo se chama <b>anterior</b>; o mais distante, <b>posterior</b>, mais alto e bem atrás. À noite, as duas luzes têm a mesma cor.' },
          { t: 'callout', tipo: 'dica', titulo: 'Fora do alinhamento: siga a marca da frente', html: 'Se a marca anterior (da frente) aparecer à direita da posterior, você saiu do alinhamento para a esquerda: governe para a direita até as duas voltarem a ficar uma sobre a outra. Se ela aparecer à esquerda, governe para a esquerda. Em resumo, vá para o lado em que está a marca da frente.' },
          { t: 'figura', svg: svg('0 0 440 280', 'Posição por alinhamento e marcação: o barco está no cruzamento da reta do alinhamento com a reta de marcação do farol',
            '<rect x="0" y="0" width="440" height="280" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<path d="M0 0 H440 V58 Q360 74 300 60 Q230 44 170 66 Q90 92 0 70 Z" fill="var(--land)"/>' +
            '<rect x="214" y="12" width="9" height="22" fill="var(--ink)"/><rect x="206" y="48" width="8" height="12" fill="var(--ink)"/>' +
            '<text x="230" y="30" ' + TX + '>posterior</text><text x="222" y="62" ' + TX + '>anterior</text>' +
            '<line x1="218" y1="23" x2="160" y2="270" ' + MG + ' stroke-width="2.5"/>' +
            '<circle cx="380" cy="52" r="5" fill="var(--ink)"/><path d="M380 52 l10 -13 l2 6 z" fill="var(--magenta)"/><text x="330" y="40" ' + TX + '>farol</text>' +
            '<line x1="380" y1="52" x2="120" y2="230" ' + MG + ' stroke-width="2.5" stroke-dasharray="7 5"/>' +
            '<circle cx="178.8" cy="189.7" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<text x="194" y="208" ' + TX + '>1227 / 1247,0</text>' +
            '<text x="14" y="262" ' + TX + '>alinhamento (cheio) × marcação (tracejada)</text>'),
            legenda: 'A posição por alinhamento e marcação é das mais usadas na prática: boa precisão e uma das LDP sem erro de instrumento. Ao lado do círculo, a hora e o odômetro. Esquema fora de escala.' },
          { t: 'h', txt: 'Distância: radar, compasso e horizonte' },
          { t: 'lista', itens: [
            '<b>Radar:</b> a distância a uma ponta alta e bem definida é uma ótima LDP. Escolha pontos que dão eco claro (costão), não praias baixas.',
            '<b>Marcação e distância do mesmo objeto:</b> as duas LDP se cortam a 90°, condição ideal. Exemplo do Manual: às 1415, farolete da Ilha de Villegagnon aos 293°, a 0,75 M.',
            '<b>Marcação de um objeto e distância de outro:</b> usado quando o objeto bom para marcar não dá eco radar. É menos consistente, porque as LDP não ficam perpendiculares; escolha pontos próximos.',
            '<b>Na carta</b>, a distância se mede com o compasso aberto na <b>escala de latitudes</b>, na altura do trecho. Nunca use a escala de longitudes: o minuto de longitude não vale uma milha.',
          ] },
          { t: 'h', txt: 'Profundidade: a isóbata como LDP' },
          { t: 'p', html: 'Sondar define uma LDP aproximada: o barco está sobre a isóbata daquela profundidade. Ela só vale onde o fundo é regular e bem levantado (confira o diagrama de confiabilidade da carta). Antes de usar, corrija a leitura:' },
          { t: 'lista', ordenada: true, itens: [
            'Muitos ecobatímetros mostram a profundidade <b>abaixo da quilha</b> (ou do transdutor). Some o calado (ou a profundidade do transdutor) para ter a profundidade real.',
            'As sondagens da carta são referidas ao <b>nível de redução</b>. Subtraia a altura da maré no instante da medida.',
            'Exemplo: o ecobatímetro, ajustado para abaixo da quilha, marca 19,2 m; calado 1,8 m; maré +1,0 m. Profundidade real 21,0 m; reduzida ao NR, 20,0 m. Você está sobre a isóbata de 20 m.',
          ] },
          { t: 'p', html: 'Combine a profundidade com uma marcação, de preferência cortando a isóbata em ângulo próximo de 90°. É pouco precisa, mas vale na falta de alternativa. Melhor ainda é usar a isóbata como <b>LDP de segurança</b>: ajuste o alarme do ecobatímetro numa profundidade que você não quer cruzar (por exemplo, 10 m) e trate o alarme como “saí da área segura”.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Vocabulário internacional', html: 'Alinhamento é <i>transit</i> (ou <i>leading line</i>, quando marca um canal). A marcação que deixa um perigo de fora é a <i>clearing bearing</i>; no Manual da DHN, “marcação de perigo” ou “marcação de segurança” (item 7.2.2).' },
          { t: 'check', questoes: [
            q('m4l4-1', 'Navegação: linhas de posição', 2, 'Entrando num canal pelo alinhamento, você vê a marca anterior (mais próxima) à esquerda da posterior. O que fazer?',
              ['Governar para a direita: você está à esquerda do alinhamento.', 'Governar para a esquerda: você está à esquerda do alinhamento.', 'Governar para a esquerda: você está à direita do alinhamento.', 'Manter o rumo: o alinhamento só vale à noite.'], 2,
              'Se a marca da frente aparece à esquerda da de trás, o barco saiu para a direita da linha; volta-se indo para o lado da marca da frente, ou seja, para a esquerda. Governar para a direita inverte o lado; governar para a esquerda por estar à esquerda do alinhamento acerta a manobra mas erra o diagnóstico. O alinhamento vale de dia, pelas estruturas, e de noite, pelas luzes (Manual, 13.2.2).',
              'Miguens, vol. I, itens 4.2 e 13.2.2, alínea c', U.man1),
            q('m4l4-2', 'Navegação: linhas de posição', 2, 'O ecobatímetro (ajustado para abaixo da quilha) marca 8,3 m. Calado 1,7 m, maré no instante 2,0 m. Qual profundidade usar para comparar com as isóbatas da carta?',
              ['6,6 m', '8,0 m', '10,0 m', '12,0 m'], 1,
              'Profundidade real = 8,3 + 1,7 = 10,0 m. Reduzida ao nível de redução da carta: 10,0 − 2,0 = 8,0 m. 10,0 m esqueceu a maré; 12,0 m somou a maré em vez de subtrair; 6,6 m subtraiu o calado em vez de somar.',
              'Miguens, vol. I, item 4.2, alínea d', U.man1),
            q('m4l4-3', 'Navegação: linhas de posição', 1, 'Por que a posição por marcação e distância do mesmo objeto é considerada muito boa?',
              ['Porque não exige converter a marcação.', 'Porque as duas LDP se cortam a 90°.', 'Porque o objeto pode ser uma boia.', 'Porque dispensa a carta náutica.'], 1,
              'A reta de marcação passa pelo objeto e a circunferência de distância tem centro nele: elas se cortam sempre em ângulo reto, a condição mais favorável (Manual, 4.3.1, c). A marcação continua precisando de conversão para verdadeira; boia não serve de ponto de apoio; e é preciso plotar na carta.',
              'Miguens, vol. I, item 4.3.1, alínea c', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 4, itens 4.2 (alíneas a, c e d) e 4.3.1 a 4.3.3'),
            man('cap. 7, item 7.2 (LDP de segurança)'),
            man('cap. 13, item 13.2.2, alínea c (luzes de alinhamento)'),
          ] },
        ],
      },
      {
        id: 'l5', titulo: 'Marcações sucessivas: o transporte da LDP', minutos: 12,
        objetivos: [
          'Transportar uma LDP usando o rumo verdadeiro e a distância navegada.',
          'Achar a posição por duas marcações do mesmo objeto ou de objetos diferentes, tiradas com intervalo.',
          'Conhecer os limites do método (tempo, corrente, mudança de rumo).',
        ],
        blocos: [
          { t: 'p', html: 'Ao longo de uma costa baixa, muitas vezes só se reconhece <b>um</b> ponto notável de cada vez. Ainda assim dá para ter posição: marca-se o ponto, navega-se um tempo, marca-se de novo (o mesmo ou outro), e leva-se a primeira LDP para o instante da segunda. É a <b>posição por marcações sucessivas</b>.' },
          { t: 'h', txt: 'A ideia do transporte' },
          { t: 'p', html: 'Se às 1300 o barco estava em algum ponto de uma reta e, depois disso, navegou 3 milhas no rumo 000°, então às 1330 ele está em algum ponto da <b>mesma reta deslocada 3 milhas no rumo 000°</b>. Para transportar uma LDP, você precisa só de duas coisas: o rumo verdadeiro e a distância navegada no intervalo (pelo odômetro ou por velocidade × tempo).' },
          { t: 'figura', svg: svg('0 0 440 380', 'Transporte de linha de posição: a marcação de 1300 é deslocada 3 milhas no rumo 000 e cruzada com a marcação de 1330',
            '<rect x="0" y="0" width="440" height="380" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<path d="M300 0 H440 V380 H360 Q320 300 340 220 Q360 150 300 0 Z" fill="var(--land)"/>' +
            '<rect x="262" y="170" width="12" height="16" fill="var(--ink)"/><text x="282" y="166" ' + TX + '>torre</text>' +
            '<line x1="150" y1="365" x2="150" y2="130" stroke="var(--ink)" stroke-dasharray="6 6"/>' +
            '<text x="40" y="372" ' + TX + '>rumo 000°, 6 nós</text>' +
            '<line x1="124" y1="351" x2="268" y2="179" ' + MG + ' stroke-width="2.5"/>' +
            '<g transform="translate(246,206) rotate(-50)"><text x="0" y="-8" ' + TX + ' text-anchor="middle">1300</text><text x="0" y="20" ' + TX + ' text-anchor="middle">040°</text></g>' +
            '<line x1="182" y1="282" x2="182" y2="168" stroke="var(--ink)" stroke-width="2"/><path d="M182 162 l-6 12 h12 z" fill="var(--ink)"/>' +
            '<text x="190" y="235" ' + TX + '>3,0 M</text>' +
            '<line x1="112" y1="246" x2="215" y2="123" ' + MG + ' stroke-width="2.5" stroke-dasharray="8 5"/>' +
            '<text x="222" y="128" ' + TX + '>1300–1330</text>' +
            '<line x1="70" y1="214" x2="268" y2="179" ' + MG + ' stroke-width="2.5"/>' +
            '<text x="18" y="240" ' + TX + '>1330 · 080°</text>' +
            '<circle cx="150" cy="200" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<text x="110" y="184" ' + TX + '>1330</text>'),
            legenda: 'A LDP de 1300 (marcação 040°) é levada 3,0 M no rumo 000° a partir de qualquer ponto dela. A reta transportada (tracejada) cruza a LDP de 1330 (080°) na posição de 1330. Esquema fora de escala.' },
          { t: 'h', txt: 'Passo a passo (mesmo objeto)' },
          { t: 'lista', ordenada: true, itens: [
            'Às 1300, rumo verdadeiro 000°, 6 nós, você marca a torre aos 040° (verdadeira). Trace a LDP de 1300.',
            'Às 1330 (odômetro 3,0 M adiante) marque de novo a torre: 080°. Trace a LDP de 1330.',
            'De <b>qualquer ponto</b> da LDP de 1300, trace uma reta no rumo 000° com 3,0 M (distância navegada).',
            'Pela extremidade, trace uma paralela à LDP de 1300. Rotule-a “1300–1330”.',
            'O cruzamento da LDP transportada com a de 1330 é a posição das 1330.',
          ] },
          { t: 'h', txt: 'Variações que caem na prova' },
          { t: 'lista', itens: [
            '<b>Objetos diferentes.</b> Às 0900 você marca um farol pouco antes de ele sumir atrás de uma ponta; às 0930 marca um monumento. O processo é o mesmo: transporte a LDP do farol para 0930 e cruze com a do monumento.',
            '<b>Mudou rumo ou velocidade no meio.</b> Plote as posições estimadas das duas horas e una-as. Transporte a primeira LDP paralelamente a essa linha, pela distância entre as duas estimadas.',
            '<b>Corrente conhecida.</b> Aplique a corrente do intervalo à estimada da segunda hora (estimada corrigida) e transporte a LDP pela linha que une a estimada da primeira hora à estimada corrigida da segunda. Isso melhora muito o resultado.',
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'É um processo estimado', html: 'Entre as duas marcações, a corrente, o vento, o mar e o timoneiro tiram o barco do rumo. Por isso o Manual recomenda <b>não transportar LDP por mais de 30 minutos</b> na navegação costeira. A posição por marcações sucessivas é melhor que a estimada pura, mas pior que uma boa posição por LDP simultâneas.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Running fix', html: 'No vocabulário RYA/ASA, a posição por marcações sucessivas é a <i>running fix</i>, e a LDP transportada é a <i>transferred position line</i>.' },
          { t: 'check', questoes: [
            q('m4l5-1', 'Navegação: linhas de posição', 1, 'O que é preciso conhecer para transportar uma LDP de um instante para outro?',
              ['A declinação magnética e o desvio da agulha.', 'O rumo verdadeiro e a distância navegada no intervalo.', 'A altura da maré e o calado do barco.', 'A distância ao objeto marcado nos dois instantes.'], 1,
              'Transportar é deslocar a reta pelo caminho que o barco fez: rumo verdadeiro e distância navegada (Manual, 6.2). Declinação e desvio servem para converter as marcações antes, não para o transporte. Maré e calado não entram. Se você soubesse as distâncias, já teria posição sem transportar.',
              'Miguens, vol. I, item 6.2', U.man1),
            q('m4l5-2', 'Navegação: linhas de posição', 2, 'Navegando a 6 nós, você marca um farol às 1412 e de novo às 1437, sem mudar de rumo. Quanto deve transportar a primeira LDP?',
              ['1,5 M', '2,5 M', '3,7 M', '6,0 M'], 1,
              'Intervalo de 25 min = 25/60 h. Distância = 6 × 25/60 = 2,5 M. 1,5 M seria o percurso em 15 minutos; 3,7 M somaria minutos como se fossem décimos de hora; 6,0 M é o percurso de uma hora inteira.',
              'Miguens, vol. I, itens 5.2 e 6.2', U.man1),
            q('m4l5-3', 'Navegação: linhas de posição', 2, 'Por que se evita transportar uma LDP por mais de 30 minutos na navegação costeira?',
              ['Porque a LDP transportada perde a validade legal depois de 30 minutos.', 'Porque o transporte é estimado: corrente, vento e governo acumulam erro com o tempo.', 'Porque a declinação magnética muda a cada meia hora.', 'Porque a carta só aceita uma LDP a cada 30 minutos.'], 1,
              'O transporte supõe que o barco seguiu exatamente o rumo e a distância estimados. Quanto maior o intervalo, mais corrente, abatimento e erros de governo se acumulam (Manual, 6.2 e 6.3.2). Não há prazo “legal”; a declinação muda muito devagar (minutos de arco por ano); e não existe limite de LDP na carta.',
              'Miguens, vol. I, itens 6.2 e 6.3.2', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 6, itens 6.1, 6.2, 6.3.2 e 6.3.3'),
          ] },
        ],
      },
      {
        id: 'l6', titulo: 'Ângulo dobrado na proa, 45° e través', minutos: 12,
        objetivos: [
          'Trabalhar com marcação polar (relativa à proa) e convertê-la para verdadeira.',
          'Achar a distância a um ponto pelo método das marcações duplas.',
          'Usar o par 45°/90° para saber a distância pelo través.',
        ],
        blocos: [
          { t: 'p', html: 'Existe um atalho elegante para as marcações sucessivas de um mesmo objeto: se a segunda marcação, contada a partir da proa, for o <b>dobro</b> da primeira, a distância até o objeto no instante da segunda é igual à distância navegada entre as duas. Não precisa transportar nada; basta medir o caminho.' },
          { t: 'termos', ids: ['marcacao-relativa', 'traves', 'odometro'] },
          { t: 'h', txt: 'Marcação polar' },
          { t: 'p', html: '<b>Marcação polar (Mp)</b> é o ângulo entre a proa e o objeto, de 0° a 180°, por boreste (BE) ou por bombordo (BB). Num veleiro você a obtém com uma marca no convés, com o próprio olho alinhado à linha de centro ou subtraindo a proa da marcação da bússola de mão. Para traçar na carta, converta para verdadeira: <b>Mv = Rv + Mp</b> se for por BE, <b>Mv = Rv − Mp</b> se for por BB (somando ou tirando 360° quando preciso). Exemplo: rumo 090°, objeto a 30° por BB → Mv = 060°.' },
          { t: 'h', txt: 'Por que funciona' },
          { t: 'figura', svg: svg('0 0 440 360', 'Marcações duplas: com a segunda marcação polar igual ao dobro da primeira, o triângulo é isósceles e a distância ao objeto é igual à distância navegada',
            '<rect x="0" y="0" width="440" height="360" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
            '<path d="M330 0 H440 V360 H380 Q330 260 360 160 Q380 80 330 0 Z" fill="var(--land)"/>' +
            '<line x1="140" y1="350" x2="140" y2="110" stroke="var(--ink)" stroke-dasharray="6 6"/><path d="M140 104 l-6 12 h12 z" fill="var(--ink)"/>' +
            '<line x1="140" y1="330" x2="244" y2="150" ' + MG + ' stroke-width="2.5"/>' +
            '<line x1="140" y1="210" x2="244" y2="150" ' + MG + ' stroke-width="2.5"/>' +
            '<line x1="140" y1="150" x2="244" y2="150" stroke="var(--ink)" stroke-dasharray="3 4"/>' +
            '<circle cx="244" cy="150" r="6" fill="var(--ink)"/><text x="256" y="146" ' + TX + '>farol</text>' +
            '<circle cx="140" cy="330" r="4" fill="var(--ink)"/><circle cx="140" cy="210" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
            '<text x="20" y="335" ' + TX + '>A · 1600</text><text x="20" y="215" ' + TX + '>B · 1630</text><text x="44" y="146" ' + TX + '>através</text>' +
            '<path d="M140 300 A30 30 0 0 1 155 304" fill="none" stroke="var(--ink)"/><text x="150" y="292" ' + TX + '>α</text>' +
            '<path d="M140 186 A24 24 0 0 1 160.8 198" fill="none" stroke="var(--ink)"/><text x="158" y="184" ' + TX + '>2α</text>' +
            '<text x="112" y="275" ' + TX + '>d</text><text x="196" y="196" ' + TX + '>d</text>' +
            '<text x="160" y="140" ' + TX + '>d · sen 2α</text>' +
            '<text x="20" y="102" ' + TX + '>rumo</text>'),
            legenda: 'Em B, o ângulo externo é 2α; o ângulo no farol vale α. O triângulo ABC é isósceles: BC = AB = d, a distância navegada. A distância pelo través é d · sen 2α.' },
          { t: 'p', html: 'No triângulo formado pela posição A (primeira marcação), pela posição B (segunda) e pelo objeto C, o ângulo em B por fora vale 2α. Como o ângulo externo de um triângulo é a soma dos dois internos opostos, o ângulo em C também vale α. Dois ângulos iguais: triângulo isósceles, e <b>BC = AB</b>.' },
          { t: 'h', txt: 'Os pares mais usados' },
          { t: 'tabela', cab: ['1ª marcação polar', '2ª marcação polar', 'Distância ao objeto na 2ª', 'Distância pelo través'],
            linhas: [
              ['22,5°', '45°', 'igual à distância navegada', '≈ 0,71 × distância navegada'],
              ['30°', '60°', 'igual à distância navegada', '≈ 0,87 × distância navegada'],
              ['45°', '90° (través)', 'igual à distância navegada', 'igual à distância navegada'],
            ], legenda: 'A última coluna vem de d · sen 2α. O par 45°/90° é o caso especial em que a distância navegada é a própria distância pelo través.' },
          { t: 'h', txt: 'Exemplo: 30° e 60°' },
          { t: 'p', html: 'Rumo verdadeiro 090°, 6 nós. Às 1600 (odômetro 0410,0) uma antena está a 30° por BB. Às 1630 (odômetro 0413,0) está a 60° por BB. Distância navegada: 3,0 M. Logo, às 1630 a antena está a <b>3,0 M</b>, na marcação verdadeira 090° − 60° = <b>030°</b>. A posição de 1630 fica a 3,0 M da antena, na direção oposta (210° a partir dela). E você ainda prevê: quando ela estiver pelo través, estará a cerca de 3,0 × 0,87 ≈ 2,6 M.' },
          { t: 'h', txt: 'Exemplo: 45° e través' },
          { t: 'p', html: 'Rumo 180°, 5 nós. Um farol está a 45° por BE às 2100. Você espera ele passar pelo través: isso acontece às 2136. Em 36 minutos o barco andou 5 × 36/60 = 3,0 M. Então, às 2136, o farol está pelo través a <b>3,0 M</b>. É a forma mais prática a bordo: a marcação pelo través é fácil de ver, e a posição sai na hora.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Corrente estraga a conta', html: 'O método supõe que a distância navegada na água é a distância andada em relação ao fundo, no rumo traçado. Com corrente, isso não vale. O Manual comenta a <b>Série de Traub</b> (marcações polares prefixadas 14°, 16°, 18°, 22°, 27°, 34°, 45°, 63° e 90°): ela é pouco usada em veleiros, pela pouca precisão das agulhas pequenas, e, havendo corrente, só serve para indicá-la. Se os intervalos entre marcações diminuem, a corrente empurra o barco em direção ao ponto; se aumentam, afasta.' },
          { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'sucessivas' }, legenda: 'Exercício de marcações sucessivas com ângulo dobrado: calcule a distância navegada pelo odômetro, ache a marcação verdadeira da segunda observação e toque na posição.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Em inglês', html: '<i>Doubling the angle on the bow</i> é o método das marcações duplas; o par 45°/90° é o <i>four-point bearing</i> (45° são quatro quartas da rosa antiga, de 11,25° cada).' },
          { t: 'check', questoes: [
            q('m4l6-1', 'Navegação: linhas de posição', 2, 'Rumo 180°, 5 nós. Um farol está a 45° por BE às 2100 e pelo través às 2136. A que distância ele está pelo través?',
              ['1,8 M', '2,1 M', '3,0 M', '4,2 M'], 2,
              'No par 45°/90°, a distância pelo través é igual à distância navegada: 5 nós × 36 min = 3,0 M. 2,1 M seria aplicar o fator 0,71 do par 22,5°/45°; 1,8 M e 4,2 M não correspondem a nenhuma relação correta.',
              'Miguens, vol. I, item 6.3.4, alínea a', U.man1),
            q('m4l6-2', 'Navegação: linhas de posição', 2, 'Rumo 090°. Um ponto notável está a 30° por BB. Qual a marcação verdadeira para traçar?',
              ['030°', '060°', '120°', '240°'], 1,
              'Por bombordo, subtrai-se a marcação polar do rumo verdadeiro: 090° − 30° = 060°. 120° seria somar (correto só por boreste). 030° seria usar 60° de marcação polar. 240° é a recíproca da direção, não a marcação.',
              'Miguens, vol. I, item 6.3.4', U.man1),
            q('m4l6-3', 'Navegação: linhas de posição', 3, 'Você marca um farol a 30° por BE e, depois de navegar 4,0 M sem corrente, a 60° por BE. Qual a distância ao farol nesse instante e qual será a distância pelo través?',
              ['4,0 M agora; cerca de 3,5 M pelo través.', '2,0 M agora; cerca de 1,7 M pelo través.', '4,0 M agora; 4,0 M pelo través.', '6,9 M agora; cerca de 6,0 M pelo través.'], 0,
              'Com a segunda marcação polar o dobro da primeira, a distância ao objeto é igual à navegada: 4,0 M. Pelo través, d · sen 60° = 4,0 × 0,87 ≈ 3,5 M. “4,0 M pelo través” vale só para o par 45°/90°. “2,0 M agora” dividiu a distância por dois sem motivo. “6,9 M agora” aplicou trigonometria errada.',
              'Miguens, vol. I, item 6.3.4, alínea a', U.man1),
          ] },
          { t: 'flash', deck: 'mestre-2', txt: 'Revise LDP, triângulo de incerteza e marcações sucessivas nos flashcards desta parte.' },
          { t: 'fontes', itens: [
            man('cap. 6, item 6.3.4 (marcações duplas e Série de Traub)'),
          ] },
        ],
      },
    ],
  });

  /* ==================================================================================================
     m5 — Navegação estimada, corrente e vento (Anexo 5-A, 2.1 b e l)
     ================================================================================================== */

  var FIG_ESTIMA = svg('0 0 440 300', 'Plotagem da navegação estimada de um veleiro entre 0600 e 0800, com mudanças de rumo e de velocidade',
    '<rect x="0" y="0" width="440" height="300" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<polyline points="40,260 172.9,236.6 322.3,111.2" fill="none" ' + MG + ' stroke-width="2.5"/>' +
    '<circle cx="40" cy="260" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
    '<text x="22" y="288" ' + TX + '>0600 (observada)</text>' +
    '<g fill="var(--ink)"><circle cx="128.6" cy="244.4" r="4"/><circle cx="172.9" cy="236.6" r="4"/><circle cx="207.4" cy="207.7" r="4"/>' +
    '<circle cx="253.4" cy="169.1" r="4"/><circle cx="270.6" cy="154.6" r="4"/><circle cx="322.3" cy="111.2" r="4"/></g>' +
    '<text x="110" y="268" ' + TX + '>0630</text><text x="166" y="262" ' + TX + '>0645</text>' +
    '<text x="214" y="222" ' + TX + '>0700</text><text x="262" y="182" ' + TX + '>0720</text>' +
    '<text x="214" y="150" ' + TX + '>0730</text><text x="332" y="112" ' + TX + '>0800</text>' +
    '<text x="62" y="226" ' + TX + '>080° · 6,0 nós</text>' +
    '<text x="276" y="214" ' + TX + '>050° · 6,0 → 4,5 nós</text>' +
    '<circle cx="322.3" cy="111.2" r="33" fill="none" stroke="var(--ink)" stroke-dasharray="3 4"/>' +
    '<text x="300" y="64" ' + TX + '>±1,1 M</text>');

  var FIG_TRI = svg('0 0 440 330', 'Triângulo de corrente: vetor superfície do ponto de partida até a estimada, vetor corrente da estimada até a observada e vetor fundo da partida até a observada',
    '<rect x="0" y="0" width="440" height="330" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<line x1="80" y1="300" x2="221.4" y2="131.5" stroke="var(--ink)" stroke-width="2.5"/><path d="M221.4 131.5 l-4 13 l-8 -7 z" fill="var(--ink)"/>' +
    '<line x1="221.4" y1="131.5" x2="245.4" y2="173.1" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M245.4 173.1 l-10 -5 l8 -5 z" fill="var(--ink)"/>' +
    '<line x1="80" y1="300" x2="245.4" y2="173.1" ' + MG + ' stroke-width="3"/><path d="M245.4 173.1 l-13 2 l5 -10 z" fill="var(--magenta)"/>' +
    '<circle cx="80" cy="300" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
    '<circle cx="245.4" cy="173.1" r="7" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
    '<text x="22" y="322" ' + TX + '>1000 · observada</text>' +
    '<text x="232" y="122" ' + TX + '>1100 estimada</text><text x="258" y="184" ' + TX + '>1100 observada</text>' +
    '<text x="40" y="190" ' + TX + '>superfície</text><text x="40" y="208" ' + TX + '>RN 040° · 5,5 nós</text>' +
    '<text x="256" y="150" ' + TX + '>corrente 150° · 1,2 nó</text>' +
    '<text x="200" y="250" fill="var(--magenta)" font-weight="700">fundo</text><text x="200" y="268" fill="var(--magenta)">Rfd 052,5° · 5,2 nós</text>' +
    '<path d="M80 260 A40 40 0 0 1 105.7 269.4" fill="none" stroke="var(--ink)"/>' +
    '<text x="112" y="296" ' + TX + '>abatimento 12,5° BE</text>');

  var FIG_ABAT = svg('0 0 440 300', 'Abatimento de um veleiro: o vento empurra o barco para sotavento e o caminho na água fica alguns graus fora da proa',
    '<rect x="0" y="0" width="440" height="300" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<g stroke="var(--ink)" stroke-width="2"><line x1="70" y1="20" x2="70" y2="70"/><line x1="130" y1="20" x2="130" y2="70"/><line x1="190" y1="20" x2="190" y2="70"/></g>' +
    '<g fill="var(--ink)"><path d="M70 78 l-6 -12 h12 z"/><path d="M130 78 l-6 -12 h12 z"/><path d="M190 78 l-6 -12 h12 z"/></g>' +
    '<text x="214" y="44" ' + TX + '>vento de 000° (por bombordo)</text>' +
    '<line x1="220" y1="180" x2="328.8" y2="129.3" stroke="var(--ink)" stroke-width="2"/><text x="300" y="118" ' + TX + '>proa 065°</text>' +
    '<line x1="220" y1="180" x2="332.8" y2="139" ' + MG + ' stroke-width="3"/><path d="M332.8 139 l-13 -1 l6 9 z" fill="var(--magenta)"/>' +
    '<text x="300" y="166" fill="var(--magenta)" font-weight="700">na água 070°</text>' +
    '<line x1="220" y1="180" x2="107.2" y2="221" stroke="var(--ink)" stroke-dasharray="5 5"/><text x="40" y="248" ' + TX + '>esteira</text>' +
    '<g transform="translate(220,180) rotate(65)"><path d="M0 -42 C15 -20 15 26 9 42 L-9 42 C-15 26 -15 -20 0 -42 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/></g>' +
    '<text x="150" y="270" ' + TX + '>abatimento 5° para sotavento (BE)</text>');

  var FIG_GOVERNAR = svg('0 0 440 350', 'Construção do rumo a governar com corrente: vetor corrente a partir de A, compasso com a velocidade do barco cortando o rumo no fundo desejado',
    '<rect x="0" y="0" width="440" height="350" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<line x1="90" y1="300" x2="231" y2="56" stroke="var(--ink)" stroke-dasharray="7 5"/>' +
    '<text x="238" y="52" ' + TX + '>rumo no fundo desejado 030°</text>' +
    '<line x1="90" y1="300" x2="124.6" y2="320" stroke="var(--ink)" stroke-width="2.5"/><path d="M124.6 320 l-12 0 l5 -9 z" fill="var(--ink)"/>' +
    '<text x="134" y="334" ' + TX + '>1 · corrente 120° · 1,0 M</text>' +
    '<path d="M330 190 A240 240 0 0 0 230 85" fill="none" stroke="var(--ink)" stroke-dasharray="2 4"/>' +
    '<line x1="124.6" y1="320" x2="208.3" y2="95.1" stroke="var(--ink)" stroke-width="2.5"/><path d="M208.3 95.1 l-1 13 l-9 -4 z" fill="var(--ink)"/>' +
    '<text x="196" y="226" ' + TX + '>2 · 6,0 M no compasso</text><text x="196" y="244" ' + TX + '>RN 020,5°</text>' +
    '<line x1="90" y1="300" x2="208.3" y2="95.1" ' + MG + ' stroke-width="3"/>' +
    '<text x="22" y="200" fill="var(--magenta)" font-weight="700">3 · fundo</text><text x="22" y="218" fill="var(--magenta)">5,9 nós</text>' +
    '<circle cx="90" cy="300" r="6" fill="none" stroke="var(--ink)" stroke-width="2.5"/><text x="56" y="296" ' + TX + '>A</text>' +
    '<circle cx="208.3" cy="95.1" r="5" fill="var(--magenta)"/>');

  M.push({
    id: 'm5', titulo: 'Navegação estimada, corrente e vento',
    resumo: 'A posição estimada a partir de rumo, velocidade e tempo; o que a corrente e o vento fazem com o barco; o triângulo de corrente e seus problemas (achar a corrente, prever o caminho no fundo, rumo a governar, hora de chegada); e um problema completo de carta, como o da prova.',
    licoes: [
      {
        id: 'l1', titulo: 'Navegação estimada: rumo, velocidade e tempo', minutos: 12,
        objetivos: [
          'Explicar o que é a navegação estimada e por que ela nunca deve ser abandonada.',
          'Resolver contas de distância, velocidade e tempo, inclusive de cabeça.',
          'Aplicar as seis regras de plotagem da estimada.',
        ],
        blocos: [
          { t: 'p', html: '<b>Navegação estimada</b> é achar a posição provável do barco usando só o próprio movimento dele: a partir de uma posição conhecida, aplica-se o rumo verdadeiro e a distância navegada (velocidade × tempo). Em inglês é a <i>dead reckoning</i> (DR). Ela não depende de nada de fora do barco: funciona na cerração, na chuva, com o GNSS desligado.' },
          { t: 'termos', ids: ['navegacao-estimada', 'posicao-estimada', 'no-velocidade', 'milha-nautica', 'odometro'] },
          { t: 'callout', tipo: 'nota', titulo: 'Por que ela importa mesmo com GNSS', html: 'O Manual da DHN lembra que quem tem pouca vivência no mar costuma desprezar a estimada pela simplicidade das contas. Na verdade, ela é o “sentimento” do movimento do barco. Mantida em paralelo com o GNSS, ela denuncia erros grosseiros (um ponto de rota digitado errado, um datum trocado) e preserva a consciência situacional.' },
          { t: 'h', txt: 'Distância, velocidade e tempo' },
          { t: 'p', html: 'Tudo sai de uma relação: <b>distância = velocidade × tempo</b>, com distância em milhas, velocidade em nós e tempo em horas. Minutos viram horas dividindo por 60.' },
          { t: 'tabela', cab: ['Pergunta', 'Conta', 'Resposta'], linhas: [
            ['Quanto se anda em 40 min a 6 nós?', '6 × 40/60', '4,0 M'],
            ['Quanto tempo para 3,5 M a 5 nós?', '3,5 ÷ 5 = 0,7 h', '42 min'],
            ['Que velocidade, se 4,2 M levaram 36 min?', '4,2 ÷ (36/60)', '7,0 nós'],
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Regra dos seis minutos', html: 'Seis minutos são um décimo de hora. Então, em 6 min o barco anda a velocidade dividida por 10: a 6 nós, 0,6 M; a 7,5 nós, 0,75 M. Em 12 minutos, o dobro; em 18, o triplo. Resolve quase tudo de cabeça.' },
          { t: 'h', txt: 'As seis regras da estimada' },
          { t: 'lista', ordenada: true, itens: [
            'Plote uma posição estimada nas horas inteiras (e nas meias horas).',
            'Plote uma estimada a cada mudança de rumo.',
            'Plote uma estimada a cada mudança de velocidade.',
            'Plote uma estimada para o instante em que obtiver uma posição determinada.',
            'Plote uma estimada para o instante em que obtiver uma única LDP.',
            'De cada posição determinada nasce uma nova linha de rumo e uma nova estimada.',
          ] },
          { t: 'p', html: 'Duas notas do Manual que caem em prova: <b>não se ajusta a estimada com uma única LDP</b>, e <b>uma LDP cruzando a linha de rumo não é posição determinada</b>, porque a linha de rumo não é LDP. Os intervalos de 1 h ou meia hora são os normais na navegação costeira; em águas restritas ou em carta de escala grande, use intervalos menores.' },
          { t: 'h', txt: 'Exemplo: a estimada de um veleiro' },
          { t: 'tabela', cab: ['Hora', 'Acontecimento', 'Rumo · velocidade', 'Andou desde o ponto anterior'], linhas: [
            ['0600', 'Posição observada junto à boia de águas seguras', '080° · 6,0 nós', '—'],
            ['0630', 'Meia hora (regra 1)', '080° · 6,0 nós', '3,0 M'],
            ['0645', 'Guinada para 050° (regra 2)', '050° · 6,0 nós', '1,5 M'],
            ['0700', 'Hora inteira (regra 1)', '050° · 6,0 nós', '1,5 M'],
            ['0720', 'O vento cai: 4,5 nós (regra 3)', '050° · 4,5 nós', '2,0 M'],
            ['0730', 'Meia hora (regra 1)', '050° · 4,5 nós', '0,75 M'],
            ['0800', 'Hora inteira (regra 1)', '050° · 4,5 nós', '2,25 M'],
          ], legenda: 'Total navegado desde a última posição observada: 11,0 M.' },
          { t: 'figura', svg: FIG_ESTIMA, legenda: 'A estimada da tabela, plotada. O círculo tracejado em volta do ponto de 0800 é a zona de probabilidade: cerca de 10% da distância navegada desde a última posição observada. Esquema fora de escala.' },
          { t: 'h', txt: 'Quanto confiar na estimada' },
          { t: 'p', html: 'A estimada é só a posição <i>mais provável</i>. O Manual admite, de forma empírica, uma consistência de <b>10% da distância navegada</b> desde a última posição observada. No exemplo, 11,0 M navegadas dão um círculo de cerca de 1,1 M em volta do ponto de 0800. Perto de perigo, trate a estimada como esse círculo, não como um ponto.' },
          { t: 'lista', itens: [
            '<b>Posição observada</b> (determinada): pequeno círculo, com hora e odômetro.',
            '<b>Posição estimada</b>: só rumo e distância na superfície, sem corrente.',
            '<b>Posição estimada corrigida</b>: a estimada mais o efeito da corrente conhecida; marcada com um losango e “EC”.',
            '<b>Posição carteada</b>: posição futura prevista; um pequeno traço cortando o rumo, com a hora. Serve para avisar o quarto: farol que vai aparecer, isóbata que vai cruzar.',
          ] },
          { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'estima' }, legenda: 'Exercício de estimada sem corrente: a partir do ponto O, aplique rumo e distância (velocidade × tempo) e toque na posição estimada.' },
          { t: 'check', questoes: [
            q('m5l1-1', 'Navegação estimada e corrente', 1, 'Um veleiro navegou 4,2 M em 36 minutos. Qual a velocidade média?',
              ['2,5 nós', '6,0 nós', '7,0 nós', '11,7 nós'], 2,
              'v = d ÷ t = 4,2 ÷ (36/60) = 4,2 ÷ 0,6 = 7,0 nós. 11,7 nós vem de tratar 36 min como 0,36 h; 6,0 nós seria dividir por 0,7 (42 min); 2,5 nós vem de multiplicar 4,2 por 0,6 em vez de dividir.',
              'Miguens, vol. I, item 5.2', U.man1),
            q('m5l1-2', 'Navegação estimada e corrente', 1, 'Pela regra dos seis minutos, quanto um barco a 7 nós anda em 6 minutos?',
              ['0,42 M', '0,6 M', '0,7 M', '4,2 M'], 2,
              'Em 6 min (0,1 h) a distância é a velocidade dividida por 10: 7 ÷ 10 = 0,7 M. 0,6 M seria a 6 nós; 0,42 M multiplica 7 por 0,06; 4,2 M trata 6 minutos como 0,6 h.',
              'Miguens, vol. I, item 5.2, alínea b', U.man1),
            q('m5l1-3', 'Navegação estimada e corrente', 2, 'Uma marcação de um farol cruza a sua linha de rumo. O que esse cruzamento representa?',
              ['A posição determinada naquele instante.', 'A posição estimada corrigida da corrente.', 'Nada de definitivo: a linha de rumo não é LDP, e o barco está em algum ponto da marcação.', 'A posição carteada para a próxima hora.'], 2,
              'O Manual é explícito: uma LDP cruzando uma linha de rumo não constitui posição determinada, porque a linha de rumo não é linha de posição (nota da regra 5). Plota-se a estimada para aquele instante e usa-se a LDP, mas a posição exige duas LDP. Não é estimada corrigida (que exige o vetor corrente) nem carteada (que é futura).',
              'Miguens, vol. I, item 5.3, notas a e b', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 5, itens 5.1 a 5.3 e 5.8'),
            man('cap. 5, item 5.5 (posição estimada, estimada corrigida e carteada)'),
          ] },
        ],
      },
      {
        id: 'l2', titulo: 'Corrente: o que muda entre a superfície e o fundo', minutos: 12,
        objetivos: [
          'Distinguir rumo e velocidade na superfície de rumo e velocidade no fundo.',
          'Achar a corrente comparando a posição estimada com a observada.',
          'Usar corretamente abatimento, caimento, avanço e atraso.',
        ],
        blocos: [
          { t: 'p', html: 'A estimada supõe que o barco andou exatamente na direção da proa e na velocidade do odômetro. No mar isso quase nunca acontece. Correntes marítimas, correntes de maré, vento, ondas, governo ruim, um desvio da agulha mal determinado: tudo empurra o barco. Na navegação costeira, o Manual chama de <b>corrente</b> a resultante de todos esses fatores juntos.' },
          { t: 'termos', ids: ['corrente', 'triangulo-de-corrente', 'rumo-no-fundo', 'abatimento', 'corrente-de-mare'] },
          { t: 'h', txt: 'Os três vetores' },
          { t: 'tabela', cab: ['Vetor', 'Direção', 'Tamanho', 'Onde você lê'], linhas: [
            ['Superfície', 'Rumo na superfície (RN): para onde a proa aponta, em verdadeiro', 'Velocidade do barco na água (velN)', 'Agulha corrigida e odômetro'],
            ['Corrente', 'Rumo da corrente (Rcor): <b>para onde</b> a água vai', 'Velocidade da corrente (velcor)', 'Cartas Piloto, Cartas de Correntes de Maré, Roteiro ou a sua própria observação'],
            ['Fundo', 'Rumo no fundo (Rfd): o caminho real sobre o fundo', 'Velocidade no fundo (velfd)', 'Duas posições observadas; no GNSS, COG e SOG'],
          ] },
          { t: 'p', html: 'O vetor fundo é a soma do vetor superfície com o vetor corrente. Esse desenho é o <b>triângulo de corrente</b>. O GNSS mostra diretamente o vetor fundo (COG e SOG); a agulha e o odômetro mostram o vetor superfície. A diferença entre os dois é a corrente.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'A pegadinha mais antiga da prova', html: 'O <b>vento</b> é dado pela direção <b>de onde vem</b>: vento nordeste sopra do nordeste. A <b>corrente</b> é dada pela direção <b>para onde vai</b>: corrente de 150° leva a água para 150°. Confundir as duas convenções inverte o triângulo inteiro.' },
          { t: 'h', txt: 'Achar a corrente pela posição observada' },
          { t: 'p', html: 'É o problema mais comum: você tinha uma posição observada, navegou um tempo e tirou outra. Exemplo: às 1000, posição observada; rumo na superfície 040°, 5,5 nós. Às 1100 você plota a estimada (5,5 M no 040°) e tira uma posição observada, que cai 1,2 M no rumo 150° da estimada.' },
          { t: 'lista', ordenada: true, itens: [
            'O vetor que vai <b>da estimada para a observada</b> da mesma hora é o efeito da corrente: Rcor 150°.',
            'O tamanho dele dividido pelo tempo é a velocidade da corrente: 1,2 M em 1 h, velcor 1,2 nó. (Se o intervalo fosse 30 min, seria 2,4 nós.)',
            'A reta entre as duas observadas é o caminho no fundo: Rfd 052,5°, e a distância entre elas, por hora, é a velfd: 5,2 nós.',
            'O ângulo entre RN e Rfd é o <b>abatimento</b>, contado para BE ou BB a partir do rumo na superfície: 052,5° − 040° = 12,5° para BE.',
          ] },
          { t: 'figura', svg: FIG_TRI, legenda: 'Triângulo de corrente do exemplo: superfície (cinza), corrente (tracejado) e fundo (magenta). A corrente vai sempre da estimada para a observada. Esquema fora de escala.' },
          { t: 'h', txt: 'Caimento, avanço e atraso' },
          { t: 'p', html: 'O deslocamento da estimada para a observada pode ser decomposto em duas partes. O <b>avanço</b> (ou <b>atraso</b>) é a diferença entre a distância andada no fundo e na superfície: no exemplo, 5,2 − 5,5 = −0,3 M, um atraso de 0,3 M. O <b>caimento</b> é o deslocamento lateral, para um bordo: cerca de 1,2 M para BE. Há avanço quando velfd é maior que velN, e atraso quando é menor.' },
          { t: 'p', html: 'Atenção ao nome. No Manual da DHN, <b>abatimento</b> é o ângulo entre o rumo na superfície e o rumo no fundo, causado pela “corrente” no sentido amplo (tudo o que empurra o barco). Num veleiro, a parte causada só pelo vento também é chamada de abatimento; ela é o assunto da próxima lição.' },
          { t: 'callout', tipo: 'dica', titulo: 'Use a corrente que você mediu', html: 'Depois de achar a corrente com critério, não a ignore na estimada seguinte: plote as próximas posições supondo que ela continua (é a <b>posição estimada corrigida</b>, marcada com losango e “EC”). Confira de novo na próxima posição observada; perto da costa, a corrente de maré muda de hora em hora.' },
          { t: 'check', questoes: [
            q('m5l2-1', 'Navegação estimada e corrente', 2, 'Às 1400 a posição observada ficou 0,8 M no rumo 210° da posição estimada para a mesma hora. A última posição observada foi às 1330. Qual a corrente?',
              ['Rcor 030°, 0,8 nó.', 'Rcor 210°, 0,8 nó.', 'Rcor 210°, 1,6 nó.', 'Rcor 030°, 1,6 nó.'], 2,
              'A corrente vai da estimada para a observada: 210°. Em 30 minutos ela deslocou o barco 0,8 M, logo 0,8 ÷ 0,5 = 1,6 nó. As alternativas com 030° invertem o sentido (como se fosse “de onde vem”); a B esquece de dividir pelo tempo.',
              'Miguens, vol. I, item 5.7, alínea a', U.man1),
            q('m5l2-2', 'Navegação estimada e corrente', 1, 'O que o GNSS mostra como COG e SOG?',
              ['Rumo e velocidade na superfície.', 'Rumo e velocidade da corrente.', 'Rumo e velocidade no fundo.', 'Proa da agulha e velocidade do odômetro.'], 2,
              'O GNSS mede o deslocamento real sobre a Terra: é o vetor fundo (Rfd e velfd). O vetor superfície vem da agulha e do odômetro; a corrente é a diferença entre os dois e não aparece direto no GNSS.',
              'Miguens, vol. I, itens 5.5 e 5.6', U.man1),
            q('m5l2-3', 'Navegação estimada e corrente', 2, 'Rumo na superfície 040°, rumo no fundo 052,5°. Qual o abatimento?',
              ['12,5° para BE.', '12,5° para BB.', '52,5° para BE.', 'Não há abatimento sem vento.'], 0,
              'Abatimento é o ângulo entre RN e Rfd, contado a partir do RN: o fundo ficou 12,5° à direita (BE) da proa. Para BB seria se o Rfd fosse menor que o RN. 52,5° é o próprio Rfd. No sentido do Manual, o abatimento resulta de todos os fatores (corrente, maré, vento etc.), não só do vento.',
              'Miguens, vol. I, item 5.5', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 5, itens 5.4 a 5.7'),
            man('cap. 10, item 10.2 (correntes de maré)'),
          ] },
        ],
      },
      {
        id: 'l3', titulo: 'O vento e o abatimento do veleiro', minutos: 10,
        objetivos: [
          'Explicar por que um veleiro anda um pouco de lado e quando isso piora.',
          'Medir o abatimento no seu barco.',
          'Corrigir o rumo para o abatimento do vento e combinar com a corrente.',
        ],
        blocos: [
          { t: 'p', html: 'Num veleiro, o vento não só empurra as velas para a frente: ele empurra o barco inteiro para <b>sotavento</b>. A quilha resiste, mas não totalmente. O resultado é que o caminho do barco na água fica alguns graus fora da proa, para o lado oposto ao vento. Isso é o <b>abatimento</b> pelo vento (em inglês, <i>leeway</i>).' },
          { t: 'termos', ids: ['abatimento', 'barlavento', 'sotavento', 'vento-aparente'] },
          { t: 'figura', svg: FIG_ABAT, legenda: 'Vento de 000°, entrando por bombordo. A proa aponta 065°, mas o barco anda na água a 070°: 5° de abatimento para sotavento. A esteira, olhada pela popa, revela o ângulo. Esquema fora de escala.' },
          { t: 'h', txt: 'Quando o abatimento cresce' },
          { t: 'lista', itens: [
            '<b>Bolina cerrada</b>: o vento chega mais de lado e a força lateral é maior. Em popa, o abatimento praticamente some.',
            '<b>Vento forte e mar grosso</b>: as ondas empurram a proa e o casco para sotavento.',
            '<b>Pouca velocidade</b>: a quilha precisa de água passando para “segurar”. Um barco rizado, batendo em onda, abate mais.',
            '<b>Quilha rasa ou bolina recolhida</b> e casco com muita área exposta ao vento.',
          ] },
          { t: 'p', html: 'O valor depende do barco e do dia. Por isso não decore um número: <b>meça no seu barco</b> e anote no diário de navegação os valores típicos por ponto de vela e força de vento.' },
          { t: 'h', txt: 'Como medir' },
          { t: 'lista', ordenada: true, itens: [
            '<b>Pela esteira:</b> com a bússola de mão, marque a esteira olhando pela popa e compare com a recíproca da proa. A diferença é o abatimento.',
            '<b>Pelo GNSS, sem corrente:</b> em água parada (num estofo de maré, longe de correntes conhecidas), compare a proa da agulha corrigida com o COG. Com corrente, a diferença mistura vento e corrente.',
          ] },
          { t: 'h', txt: 'Como corrigir' },
          { t: 'p', html: 'Para fazer um rumo na água, <b>governe alguns graus para barlavento</b> dele. Exemplo: você quer andar na água a 070°, com vento entrando por bombordo, e mediu 5° de abatimento. O barco abate para BE; então governe 5° para BB: proa 065°.' },
          { t: 'p', html: 'Com vento e corrente juntos, siga a ordem que deixa a conta limpa: primeiro corrija o abatimento do vento (o caminho na água), depois resolva o triângulo de corrente sobre esse caminho na água. Na carta, o vetor superfície passa a ser o caminho na água, não a proa. Na prova, quando o problema der “corrente” sem falar de vento, ela já é a resultante de tudo.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Corrente contra o vento', html: 'Quando uma corrente de maré forte corre contra o vento, o mar fica curto, alto e quebrado, mesmo com vento moderado. Em barras e canais, planeje a passagem para o estofo ou para a corrente a favor do vento. O Manual (vol. III, item 42.1.2) explica o mecanismo: uma corrente contrária reduz o comprimento das ondas, aumenta a altura delas e, se for forte, faz com que arrebentem. O Roteiro e as Cartas de Correntes de Maré (módulo 6) dizem onde isso acontece.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Na prática RYA', html: 'Nos cursos RYA, o caminho na água é o <i>water track</i> (proa + <i>leeway</i>), e o caminho no fundo é o <i>ground track</i> ou <i>course over ground</i>. O triângulo de corrente é chamado de <i>tidal triangle</i>, porque no Reino Unido a corrente que mais importa é a de maré.' },
          { t: 'check', questoes: [
            q('m5l3-1', 'Navegação estimada e corrente', 2, 'Você quer andar na água a 070°. O vento entra por bombordo e o abatimento medido é de 5°. Que proa governar?',
              ['065°', '070°', '075°', '250°'], 0,
              'O vento por bombordo empurra o barco para BE (sotavento). Para compensar, a proa vai 5° para barlavento (BB): 070° − 5° = 065°. Governar 075° somaria o abatimento ao erro; 070° ignora o abatimento; 250° é a recíproca.',
              'Miguens, vol. I, item 5.4 (efeito do vento)', U.man1),
            q('m5l3-2', 'Navegação estimada e corrente', 1, 'Em que situação o abatimento pelo vento costuma ser maior?',
              ['Em popa, com vento fraco.', 'Em bolina cerrada, com vento forte e mar grosso.', 'Motorando sem vento em mar calmo.', 'Fundeado, com a âncora unhada.'], 1,
              'Na bolina cerrada a força lateral do vento é maior, e vento forte com mar grosso empurra ainda mais o casco para sotavento. Em popa, a força é quase toda para a frente. Sem vento não há abatimento pelo vento. Fundeado o barco não navega.',
              'Miguens, vol. I, item 5.4', U.man1),
            q('m5l3-3', 'Navegação estimada e corrente', 1, 'O boletim fala em “vento nordeste” e a carta mostra uma “corrente nordeste”. O que isso significa?',
              ['Os dois vão para o nordeste.', 'Os dois vêm do nordeste.', 'O vento vem do nordeste; a corrente vai para o nordeste.', 'O vento vai para o nordeste; a corrente vem do nordeste.'], 2,
              'Convenção: vento é indicado pela direção de onde sopra; corrente, pela direção para onde flui (Manual, 5.5: o rumo da corrente é a direção para onde flui). Por isso vento NE e corrente NE andam em sentidos opostos. As demais alternativas aplicam a mesma convenção aos dois, ou a invertem.',
              'Miguens, vol. I, item 5.5 (rumo da corrente)', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 5, itens 5.4 e 5.5'),
            man('cap. 10, item 10.2 (correntes de maré)'),
            { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 42, item 42.1.2 (efeito das correntes sobre as ondas)', url: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf' },
          ] },
        ],
      },
      {
        id: 'l4', titulo: 'Triângulo de corrente: os problemas da carta', minutos: 15,
        objetivos: [
          'Prever o rumo e a velocidade no fundo, dada a corrente.',
          'Achar o rumo a governar e a velocidade para chegar a um ponto numa hora marcada.',
          'Achar o rumo a governar com velocidade fixa e calcular a hora estimada de chegada.',
        ],
        blocos: [
          { t: 'p', html: 'O triângulo de corrente tem três vetores e seis valores (rumo e velocidade de cada um). Todo problema dá quatro e pede dois. Você já resolveu o primeiro tipo (achar a corrente por duas posições, lição anterior). Os outros aparecem no planejamento de qualquer travessia costeira e são o centro das questões de carta.' },
          { t: 'callout', tipo: 'nota', titulo: 'Regra de ouro do desenho', html: 'Trabalhe sempre com o <b>mesmo intervalo de tempo</b> nos três vetores, de preferência 1 hora: 6 nós vira 6,0 M; 1,5 nó de corrente vira 1,5 M. O vetor superfície sai da proa; a corrente se soma na ponta dele (ou parte do ponto inicial, no problema do rumo a governar); o fundo liga o início ao fim.' },
          { t: 'h', txt: 'Problema 1: para onde vou, de fato?' },
          { t: 'p', html: 'Dados: rumo na superfície 200°, 6,0 nós; corrente 110°, 1,0 nó. Pedido: rumo e velocidade no fundo.' },
          { t: 'lista', ordenada: true, itens: [
            'Do ponto de partida, trace o vetor superfície: 6,0 M no 200°.',
            'Da ponta dele, trace o vetor corrente: 1,0 M no 110°.',
            'Una o ponto de partida à ponta da corrente: <b>Rfd 190,5°, velfd 6,1 nós</b>. A corrente flui para 110°, para o lado de BB do barco, e desvia o caminho no fundo 9,5° para BB.',
          ] },
          { t: 'h', txt: 'Problema 2: chegar num ponto numa hora marcada' },
          { t: 'p', html: 'Dados: você quer estar, daqui a 1 hora, num ponto a 5,5 M no 075° (por exemplo, para pegar o estofo na barra). Corrente 340°, 1,5 nó. Pedido: rumo e velocidade na superfície.' },
          { t: 'lista', ordenada: true, itens: [
            'Trace o vetor fundo desejado: 5,5 M no 075°, do ponto atual ao ponto de chegada.',
            'Do ponto atual, trace o vetor corrente: 1,5 M no 340°.',
            'Una a ponta da corrente ao ponto de chegada: esse é o vetor superfície, <b>RN 090°, velN 5,8 nós</b>. Você governa 090° e precisa manter 5,8 nós na água.',
          ] },
          { t: 'h', txt: 'Problema 3: velocidade fixa, rumo a governar e hora de chegada' },
          { t: 'p', html: 'É o caso típico do veleiro (ou de um motor com avaria): a velocidade na água é o que o barco dá. Dados: às 0900, no ponto A; destino B a 11,8 M no 030°; velocidade na água 6,0 nós; corrente 120°, 1,0 nó.' },
          { t: 'lista', ordenada: true, itens: [
            'Una A a B: rumo no fundo desejado 030°.',
            'De A, trace o vetor corrente de 1 hora: 1,0 M no 120°.',
            'Abra o compasso com 6,0 M (a velocidade na água, na escala de latitudes) e, com centro na ponta da corrente, corte a linha do rumo no fundo.',
            'A reta da ponta da corrente até esse corte é o vetor superfície: <b>RN 020,5°</b>. De A até o corte é o vetor fundo: <b>velfd 5,9 nós</b>.',
            'Tempo até B: 11,8 ÷ 5,9 ≈ 2,0 h. <b>ETA (hora estimada de chegada): 1100.</b>',
          ] },
          { t: 'figura', svg: FIG_GOVERNAR, legenda: 'Problema 3: (1) vetor corrente a partir de A; (2) compasso com a velocidade do barco, centrado na ponta da corrente, cortando o rumo no fundo desejado; (3) o vetor fundo dá a velocidade de avanço. Esquema fora de escala.' },
          { t: 'h', txt: 'Problema 4: a estimada corrigida' },
          { t: 'p', html: 'Conhecida a corrente, a <b>estimada corrigida</b> é a estimada mais o vetor corrente pelo tempo decorrido. Exemplo: a estimada das 1000 foi plotada; a corrente é 200°, 0,8 nó, e se passaram 1,5 h desde a última posição observada. Desloque a estimada 1,2 M (0,8 × 1,5) no 200° e marque o losango “1000 EC”.' },
          { t: 'callout', tipo: 'dica', titulo: 'Confira o desenho com o bom senso', html: 'A corrente que vem pelo seu bordo de BE empurra o barco para BB, e você governa para BE para compensar. Corrente a favor aumenta a velocidade no fundo; contra, diminui. Se a resposta contrariar isso, algum vetor está invertido.' },
          { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'corrente' }, legenda: 'Exercício gerado: rumo a governar com corrente. Use a ferramenta Corrente da carta de treino, ou resolva à mão com régua e compasso e confira.' },
          { t: 'check', questoes: [
            q('m5l4-1', 'Navegação estimada e corrente', 3, 'Para manter rumo no fundo 030° com velocidade na água de 6,0 nós e corrente de 120°, 1,0 nó, qual o rumo a governar?',
              ['020,5°', '030°', '039,5°', '120°'], 0,
              'A corrente de 120° flui perpendicular ao rumo, empurrando o barco para BE. Para compensar, governa-se para BB: o ângulo de correção é arcsen(1,0/6,0) ≈ 9,5°, logo RN ≈ 020,5°. 039,5° corrige para o lado errado; 030° ignora a corrente; 120° é o rumo da própria corrente.',
              'Miguens, vol. I, item 5.7, alínea d', U.man1),
            q('m5l4-2', 'Navegação estimada e corrente', 2, 'No problema “chegar a um ponto numa hora marcada”, quais elementos você determina?',
              ['Rumo e velocidade da corrente.', 'Rumo e velocidade no fundo.', 'Rumo e velocidade na superfície.', 'Só a hora de chegada.'], 2,
              'Nesse caso são conhecidos o vetor fundo desejado (ponto e hora definem rumo e velocidade no fundo) e a corrente; determinam-se o rumo a governar e a velocidade na água (Manual, 5.7, alínea c). A corrente é dado do problema; o fundo também; a hora já está fixada.',
              'Miguens, vol. I, item 5.7, alínea c', U.man1),
            q('m5l4-3', 'Navegação estimada e corrente', 2, 'Velocidade no fundo 5,0 nós e distância até a boia de 7,5 M. Saindo às 1340, qual a ETA?',
              ['1430', '1450', '1510', '1555'], 2,
              'Tempo = 7,5 ÷ 5,0 = 1,5 h = 1 h 30 min. 1340 + 1h30 = 1510. 1430 e 1450 somam tempos menores; 1555 usaria uma velocidade de cerca de 3,3 nós.',
              'Miguens, vol. I, itens 5.2 e 5.7, alínea d', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 5, itens 5.6 e 5.7 (alíneas a a e)'),
          ] },
        ],
      },
      {
        id: 'l5', titulo: 'Problema completo de carta, como na prova', minutos: 15,
        objetivos: [
          'Saber o que a prova cobra com a carta e o material que você pode levar.',
          'Resolver um problema completo: partida, rumo e distância, corrente, rumo da agulha e hora de chegada.',
          'Evitar os erros que mais tiram ponto.',
        ],
        blocos: [
          { t: 'fato', ref: 'programa-14', html: 'A prova de Mestre-Amador tem 40 questões de múltipla escolha, quatro delas com uso de carta náutica, e dura no máximo três horas.' },
          { t: 'fato', ref: 'programa-70', html: 'Atenção: a página de perguntas frequentes de uma Delegacia (São Francisco do Sul) fala em duração máxima de duas horas, o que diverge da norma. Confirme com a Capitania, Delegacia ou Agência onde você fará a prova.' },
          { t: 'fato', ref: 'normas-94', html: 'Além de protocolo, identidade e caneta azul ou preta, o candidato leva o material de desenho: lápis ou lapiseira, régua, par de esquadros ou régua paralela, transferidor, compasso e borracha.' },
          { t: 'fato', ref: 'programa-20', html: 'As provas de Arrais e de Mestre não são publicadas: são destruídas logo após a correção, para manter o sigilo do banco de questões.' },
          { t: 'p', html: 'Por isso não existe um modelo oficial das quatro questões de carta. O programa (Anexo 5-A, item 2.1, alíneas b e l) diz o que pode ser cobrado: plotar ponto por coordenadas e por LDP, converter rumos e marcações, posição de partida e de chegada por marcações simultâneas e sucessivas, distância entre dois pontos, desvio da agulha, declinação, corrente e vento. O problema abaixo junta tudo isso numa sequência.' },
          { t: 'h', txt: 'O problema' },
          { t: 'lista', itens: [
            'Carta de exercício (fictícia). Declinação na rosa: 21°50′ W (2023), variação anual 4′ W. Ano da navegação: 2026.',
            'Tabela de desvios da agulha de governo: 2° E para proas entre 060° e 090°.',
            'Às 0830, com proa da agulha 090°, você marca pela agulha o Farol da Ponta Norte aos 351° e o Pico do Morro aos 074°.',
            'Destino: boia de águas seguras do porto, em 22°52,0′ S, 043°16,0′ W.',
            'Corrente estimada na área (Carta de Correntes de Maré): 160°, 1,0 nó. Velocidade do barco na água: 6,0 nós.',
            'Pedidos: (1) posição de partida; (2) rumo e distância até a boia; (3) rumo da agulha a governar; (4) hora estimada de chegada.',
          ] },
          { t: 'h', txt: '1. Posição de partida' },
          { t: 'p', html: 'Declinação atualizada: 21°50′ + 3 anos × 4′ = 21°50′ + 12′ = 22°02′ W, que aproximada a 0,5° fica <b>22,0° W</b>. Desvio para a proa da agulha 090°: <b>2° E</b> (o desvio sai da proa, nunca da marcação). Marcações verdadeiras: 351° + 2° − 22° = <b>331°</b> e 074° + 2° − 22° = <b>054°</b>. As retas se cruzam a 83°, ótimo. Traçadas na carta, elas se cortam em <b>23°00,0′ S, 043°30,0′ W</b>: a posição de 0830.' },
          { t: 'h', txt: '2. Rumo e distância até a boia' },
          { t: 'p', html: 'Na carta: régua paralela da partida à boia, leve à rosa e leia o rumo verdadeiro; abra o compasso entre os dois pontos e meça na escala de latitudes, na altura do trecho. Para conferir pela conta: Δlat = 8,0′ N; Δlong = 14,0′ E; na latitude média (22°56′), 14,0′ de longitude valem 14,0 × cos 22,9° ≈ 12,9 M de afastamento. Rumo = arctg(12,9 ÷ 8,0) ≈ <b>058°</b>; distância = √(8,0² + 12,9²) ≈ <b>15,2 M</b>.' },
          { t: 'h', txt: '3. Rumo a governar (verdadeiro e da agulha)' },
          { t: 'p', html: 'Com a corrente de 160°, 1,0 nó, e 6,0 nós na água, o triângulo de corrente (problema 3 da lição anterior) dá <b>RN 048,5°</b> e <b>velfd 5,7 nós</b>. A corrente flui para 160°, isto é, empurra o barco para BE do rumo desejado; por isso se governa cerca de 9,5° para BB dele. Agora converta para a agulha: Rmg = Rv − Dec mg; com a declinação W negativa, 048,5° − (−22,0°) = <b>070,5°</b>. O desvio para essa proa é 2° E: Rag = Rmg − Dag = 070,5° − 2° = <b>068,5°</b>. É esse o número que você passa ao timoneiro.' },
          { t: 'h', txt: '4. Hora estimada de chegada' },
          { t: 'p', html: 'Tempo = 15,2 ÷ 5,7 ≈ 2,66 h ≈ 2 h 40 min. Partindo às 0830, <b>ETA 1110</b>. Plote posições carteadas de hora em hora para saber quando esperar a boia pela proa.' },
          { t: 'tabela', cab: ['Etapa', 'Resultado'], linhas: [
            ['Declinação 2026', '22,0° W'],
            ['Marcações verdadeiras', '331° e 054°'],
            ['Partida (0830)', '23°00,0′ S, 043°30,0′ W'],
            ['Rumo no fundo e distância', '058° · 15,2 M'],
            ['Rumo na superfície e velocidade no fundo', '048,5° · 5,7 nós'],
            ['Rumo magnético e da agulha', '070,5° · 068,5°'],
            ['ETA', '1110'],
          ], legenda: 'Resumo do problema. Valores conferidos por cálculo (loxodromia e triângulo de vetores).' },
          { t: 'h', txt: 'Os erros que mais tiram ponto' },
          { t: 'lista', itens: [
            'Traçar marcação ou rumo magnético direto na carta. Só se traça verdadeiro.',
            'Esquecer de atualizar a declinação para o ano, ou somar a variação no sentido errado.',
            'Tirar o desvio pela marcação. O desvio é da <b>proa</b>.',
            'Inverter a corrente (ela é “para onde vai”).',
            'Medir distância na escala de longitudes.',
            'Somar minutos como se fossem décimos de hora (36 min não é 0,36 h).',
            'Arredondar no meio do caminho. Arredonde a 0,5° e a 0,1 M só no fim de cada etapa.',
          ] },
          { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio' }, legenda: 'Treine na carta de exercício: mude o tipo de problema (rumo e distância, ler e plotar coordenadas, marcações, estimada, corrente, sucessivas) e repita até acertar sem consultar a resolução.' },
          { t: 'check', questoes: [
            q('m5l5-1', 'Navegação estimada e corrente', 2, 'Rumo verdadeiro a governar 048,5°, declinação 22,0° W, desvio para a proa 2° E. Qual o rumo da agulha?',
              ['024,5°', '028,5°', '068,5°', '072,5°'], 2,
              'Rmg = Rv − Dec, com W negativa: 048,5 − (−22) = 070,5°. Rag = Rmg − Dag, com E positivo: 070,5 − 2 = 068,5°. 072,5° somou o desvio; 028,5° e 024,5° subtraíram a declinação W (erro de sinal).',
              'Miguens, vol. I, item 3.2.5', U.man1),
            q('m5l5-2', 'Navegação estimada e corrente', 2, 'A declinação da carta é 21°50′ W (2023), variação anual 4′ W. Qual o valor para 2026, aproximado a 0,5°?',
              ['21,5° W', '22,0° W', '22,5° W', '21,0° W'], 1,
              'Em 3 anos a declinação aumenta 12′ para W: 21°50′ + 12′ = 22°02′ W, que se aproxima a 22,0° W. 21,5° W resulta de subtrair a variação (21°38′ W); 21,0° W e 22,5° W não correspondem a nenhuma conta certa, e 22°02′ fica mais perto de 22,0° do que de 22,5°.',
              'Miguens, vol. I, item 3.2.5 (atualização da declinação)', U.man1),
            q('m5l5-3', 'Navegação estimada e corrente', 1, 'Na carta de Mercator, onde se mede a distância entre dois pontos?',
              ['Na escala de longitudes, no rodapé da carta.', 'Na escala de latitudes, na altura do trecho medido.', 'Em qualquer das escalas, pois são iguais.', 'Na rosa dos rumos.'], 1,
              'Um minuto de latitude vale uma milha náutica; na projeção de Mercator a escala de latitudes cresce com a latitude, por isso mede-se na altura do trecho. O minuto de longitude encolhe com o cosseno da latitude e não serve para medir distância. A rosa mede direções, não distâncias.',
              'Miguens, vol. I, cap. 2 (cartas náuticas) e item 11.6.2', U.man1),
          ] },
          { t: 'flash', deck: 'mestre-2', txt: 'Fixe fórmulas, convenções e as pegadinhas de corrente e declinação nos flashcards desta parte.' },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-A, item 2 (exame de Mestre-Amador)', url: U.normam, ref: 'programa-14' },
            { txt: 'NORMAM-211/DPC, Anexo 5-A, item 2.1, alíneas b) e l) (programa)', url: U.normam, ref: 'normas-96' },
            man('cap. 3, item 3.2.5; cap. 4, item 4.3; cap. 5, item 5.7'),
          ] },
        ],
      },
    ],
  });

  /* ==================================================================================================
     m6 — Auxílios à navegação e publicações (Anexo 5-A, 2.1 b e g)
     ================================================================================================== */

  var FIG_AUX = svg('0 0 440 262', 'Quatro auxílios visuais: farol, farolete num molhe, boia luminosa com mangrulho e marca de tope, e baliza cega',
    '<rect x="0" y="186" width="440" height="30" fill="var(--sea-2)"/>' +
    // farol
    '<path d="M40 190 L70 190 L64 84 L46 84 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<rect x="43" y="66" width="24" height="18" fill="var(--ink)"/><rect x="47" y="69" width="16" height="12" fill="var(--nav-yellow)"/>' +
    '<path d="M41 66 L55 54 L69 66 Z" fill="var(--ink)"/>' +
    '<g ' + MG + ' stroke-width="2"><line x1="70" y1="72" x2="96" y2="64"/><line x1="70" y1="78" x2="96" y2="84"/><line x1="40" y1="72" x2="14" y2="64"/><line x1="40" y1="78" x2="14" y2="84"/></g>' +
    '<text x="55" y="234" ' + TX + ' text-anchor="middle">farol</text><text x="55" y="250" ' + TX + ' text-anchor="middle">&gt; 10 M</text>' +
    // farolete
    '<rect x="118" y="168" width="96" height="22" fill="var(--land)" stroke="var(--ink)"/>' +
    '<rect x="160" y="128" width="10" height="40" fill="var(--nav-red)" stroke="var(--ink)"/><rect x="158" y="118" width="14" height="10" fill="var(--ink)"/>' +
    '<g ' + MG + ' stroke-width="2"><line x1="174" y1="122" x2="190" y2="116"/><line x1="156" y1="122" x2="140" y2="116"/></g>' +
    '<text x="165" y="234" ' + TX + ' text-anchor="middle">farolete</text><text x="165" y="250" ' + TX + ' text-anchor="middle">≤ 10 M</text>' +
    // boia luminosa
    '<path d="M250 190 Q250 170 275 168 Q300 170 300 190 Z" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="2"/>' +
    '<path d="M262 170 L268 120 L282 120 L288 170" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
    '<line x1="264" y1="150" x2="286" y2="150" stroke="var(--ink)"/><line x1="266" y1="135" x2="284" y2="135" stroke="var(--ink)"/>' +
    '<rect x="269" y="110" width="12" height="10" fill="var(--ink)"/><rect x="267" y="92" width="16" height="16" fill="var(--nav-green)" stroke="var(--ink)"/>' +
    '<text x="275" y="234" ' + TX + ' text-anchor="middle">boia</text><text x="275" y="250" ' + TX + ' text-anchor="middle">luminosa</text>' +
    // baliza
    '<path d="M362 190 Q385 176 408 190 Z" fill="var(--land)" stroke="var(--ink)"/>' +
    '<line x1="385" y1="184" x2="385" y2="100" stroke="var(--ink)" stroke-width="4"/>' +
    '<path d="M377 100 L393 100 L385 84 Z" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="2"/>' +
    '<text x="385" y="234" ' + TX + ' text-anchor="middle">baliza</text><text x="385" y="250" ' + TX + ' text-anchor="middle">(cega)</text>', 520);

  var FIG_SETOR = svg('0 0 440 335', 'Setores de um farol: os limites são marcações verdadeiras tomadas do mar para o farol; o setor encarnado cobre uma pedra',
    '<rect x="0" y="0" width="440" height="335" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M300 0 H440 V180 Q420 120 390 90 Q350 50 300 0 Z" fill="var(--land)"/>' +
    '<path d="M380 40 L277.4 321.9 A300 300 0 0 1 98.1 142.6 Z" fill="var(--nav-white)" fill-opacity=".35" stroke="var(--ink)"/>' +
    '<path d="M380 40 L98.1 142.6 A300 300 0 0 1 81.1 66.1 Z" fill="var(--nav-red)" fill-opacity=".45" stroke="var(--ink)"/>' +
    '<circle cx="380" cy="40" r="6" fill="var(--ink)"/><text x="330" y="26" ' + TX + '>farol</text>' +
    '<g transform="translate(155.9,91.7)"><circle r="14" fill="none" stroke="var(--ink)" stroke-dasharray="2 3"/><path d="M-6 0 H6 M0 -6 V6 M-4 -4 L4 4 M-4 4 L4 -4" stroke="var(--ink)" stroke-width="2"/></g>' +
    '<text x="196" y="215" ' + TX + ' font-weight="700">B 020°–070°</text>' +
    '<text x="18" y="106" ' + TX + ' font-weight="700">E 070°–085°</text>' +
    '<circle cx="265.1" cy="136.4" r="5" fill="var(--magenta)"/><line x1="265.1" y1="136.4" x2="380" y2="40" ' + MG + ' stroke-dasharray="5 4" stroke-width="2"/>' +
    '<text x="332" y="212" fill="var(--magenta)">você: 050°</text><text x="332" y="230" fill="var(--magenta)">luz branca</text>' +
    '<text x="16" y="318" ' + TX + '>fora dos setores: luz obscurecida</text>');

  var FIG_ALCANCE = svg('0 0 440 280', 'Alcance geográfico: a distância em que a luz aparece no horizonte depende da altitude do farol e da altura do olho do observador',
    '<rect x="0" y="0" width="440" height="280" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 262 Q220 160 440 262 V280 H0 Z" fill="var(--sea-3)"/>' +
    '<rect x="34" y="184" width="12" height="61" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<circle cx="40" cy="184" r="5" fill="var(--nav-yellow)" stroke="var(--ink)"/>' +
    '<line x1="40" y1="184.4" x2="400" y2="230" ' + MG + ' stroke-width="2.5"/>' +
    '<circle cx="280" cy="214.8" r="4" fill="var(--ink)"/><text x="248" y="250" ' + TX + '>horizonte</text>' +
    '<line x1="400" y1="245" x2="400" y2="230" stroke="var(--ink)" stroke-width="3"/><circle cx="400" cy="228" r="4" fill="var(--ink)"/>' +
    '<text x="54" y="222" ' + TX + '>H</text><text x="408" y="244" ' + TX + '>h</text>' +
    '<text x="110" y="166" ' + TX + '>D₁ = 1,927 √H</text><text x="296" y="196" ' + TX + '>D₂ = 1,927 √h</text>' +
    '<text x="70" y="40" ' + TX + ' font-weight="700">D = 1,927 (√H + √h)</text>' +
    '<text x="70" y="62" ' + TX + '>D em milhas; H e h em metros</text>');

  var FIG_ROSA = svg('0 0 440 335', 'Rosa de ventos de Carta Piloto: setas apontando para o centro, comprimento proporcional à frequência e penas indicando a força Beaufort',
    '<rect x="0" y="0" width="440" height="335" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<circle cx="220" cy="160" r="22" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="220" y="166" ' + TX + ' text-anchor="middle">2</text>' +
    '<line x1="220.0" y1="30.0" x2="220.0" y2="136.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M220.0 138.0 L225.0 128.0 L215.0 128.0 Z" fill="var(--ink)"/><line x1="220.0" y1="30.0" x2="229.0" y2="25.0" stroke="var(--ink)" stroke-width="2"/><line x1="220.0" y1="36.0" x2="229.0" y2="31.0" stroke="var(--ink)" stroke-width="2"/><line x1="220.0" y1="42.0" x2="229.0" y2="37.0" stroke="var(--ink)" stroke-width="2"/><text x="220.0" y="19.0" fill="var(--ink)" text-anchor="middle">N</text>' +
    '<line x1="320.4" y1="59.6" x2="237.0" y2="143.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M235.6 144.4 L246.2 140.9 L239.1 133.8 Z" fill="var(--ink)"/><line x1="320.4" y1="59.6" x2="330.3" y2="62.4" stroke="var(--ink)" stroke-width="2"/><line x1="316.2" y1="63.8" x2="326.1" y2="66.7" stroke="var(--ink)" stroke-width="2"/><line x1="311.9" y1="68.1" x2="321.8" y2="70.9" stroke="var(--ink)" stroke-width="2"/><text x="331.7" y="53.3" fill="var(--ink)" text-anchor="middle">NE</text>' +
    '<line x1="314.0" y1="160.0" x2="244.0" y2="160.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M242.0 160.0 L252.0 165.0 L252.0 155.0 Z" fill="var(--ink)"/><line x1="314.0" y1="160.0" x2="319.0" y2="169.0" stroke="var(--ink)" stroke-width="2"/><line x1="308.0" y1="160.0" x2="313.0" y2="169.0" stroke="var(--ink)" stroke-width="2"/><line x1="302.0" y1="160.0" x2="307.0" y2="169.0" stroke="var(--ink)" stroke-width="2"/><text x="330.0" y="165.0" fill="var(--ink)" text-anchor="middle">E</text>' +
    '<line x1="278.0" y1="218.0" x2="237.0" y2="177.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M235.6 175.6 L239.1 186.2 L246.2 179.1 Z" fill="var(--ink)"/><line x1="278.0" y1="218.0" x2="275.2" y2="227.9" stroke="var(--ink)" stroke-width="2"/><line x1="273.7" y1="213.7" x2="270.9" y2="223.6" stroke="var(--ink)" stroke-width="2"/><line x1="269.5" y1="209.5" x2="266.7" y2="219.4" stroke="var(--ink)" stroke-width="2"/><text x="289.3" y="234.3" fill="var(--ink)" text-anchor="middle">SE</text>' +
    '<line x1="220.0" y1="302.0" x2="220.0" y2="184.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M220.0 182.0 L215.0 192.0 L225.0 192.0 Z" fill="var(--ink)"/><line x1="220.0" y1="302.0" x2="211.0" y2="307.0" stroke="var(--ink)" stroke-width="2"/><line x1="220.0" y1="296.0" x2="211.0" y2="301.0" stroke="var(--ink)" stroke-width="2"/><line x1="220.0" y1="290.0" x2="211.0" y2="295.0" stroke="var(--ink)" stroke-width="2"/><text x="220.0" y="323.0" fill="var(--ink)" text-anchor="middle">S</text>' +
    '<line x1="149.3" y1="230.7" x2="203.0" y2="177.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M204.4 175.6 L193.8 179.1 L200.9 186.2 Z" fill="var(--ink)"/><line x1="149.3" y1="230.7" x2="139.4" y2="227.9" stroke="var(--ink)" stroke-width="2"/><line x1="153.5" y1="226.5" x2="143.6" y2="223.6" stroke="var(--ink)" stroke-width="2"/><line x1="157.8" y1="222.2" x2="147.9" y2="219.4" stroke="var(--ink)" stroke-width="2"/><line x1="162.0" y1="218.0" x2="152.1" y2="215.2" stroke="var(--ink)" stroke-width="2"/><text x="138.0" y="247.0" fill="var(--ink)" text-anchor="middle">SW</text>' +
    '<line x1="156.0" y1="160.0" x2="196.0" y2="160.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M198.0 160.0 L188.0 155.0 L188.0 165.0 Z" fill="var(--ink)"/><line x1="156.0" y1="160.0" x2="151.0" y2="151.0" stroke="var(--ink)" stroke-width="2"/><line x1="162.0" y1="160.0" x2="157.0" y2="151.0" stroke="var(--ink)" stroke-width="2"/><line x1="168.0" y1="160.0" x2="163.0" y2="151.0" stroke="var(--ink)" stroke-width="2"/><text x="140.0" y="165.0" fill="var(--ink)" text-anchor="middle">W</text>' +
    '<line x1="166.3" y1="106.3" x2="203.0" y2="143.0" stroke="var(--ink)" stroke-width="2.5"/><path d="M204.4 144.4 L200.9 133.8 L193.8 140.9 Z" fill="var(--ink)"/><line x1="166.3" y1="106.3" x2="169.1" y2="96.4" stroke="var(--ink)" stroke-width="2"/><line x1="170.5" y1="110.5" x2="173.3" y2="100.6" stroke="var(--ink)" stroke-width="2"/><line x1="174.7" y1="114.7" x2="177.6" y2="104.8" stroke="var(--ink)" stroke-width="2"/><text x="154.9" y="99.9" fill="var(--ink)" text-anchor="middle">NW</text>' +
    '<text x="12" y="300" ' + TX + '>seta: de onde o vento sopra</text><text x="12" y="318" ' + TX + '>penas: força Beaufort</text>' +
    '<text x="300" y="300" ' + TX + '>centro: %</text><text x="300" y="318" ' + TX + '>de calmaria</text>');

  var FIG_CORR = svg('0 0 440 220', 'Canto inferior esquerdo de uma carta náutica com o campo Pequenas correções preenchido com o ano e o número dos Avisos Permanentes',
    '<rect x="0" y="0" width="440" height="220" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 220 V0 H440" fill="none" stroke="var(--ink)" stroke-width="3"/>' +
    '<rect x="24" y="110" width="250" height="88" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
    '<text x="36" y="134" ' + TX + ' font-weight="700">Pequenas correções</text>' +
    '<text x="36" y="160" ' + TX + '>2025 — 112 · 140</text><text x="36" y="184" ' + TX + '>2026 — 9 · 21 · 47</text>' +
    '<text x="296" y="140" ' + TX + '>Permanente:</text><text x="296" y="158" ' + TX + '>a caneta, e</text><text x="296" y="176" ' + TX + '>registrar aqui</text>' +
    '<text x="24" y="40" ' + TX + '>Temporário (T) e Preliminar (P):</text><text x="24" y="60" ' + TX + '>a lápis, na própria carta</text>' +
    '<path d="M300 60 l90 -30 l8 8 l-90 30 z" fill="var(--nav-yellow)" stroke="var(--ink)"/><path d="M300 60 l8 8 l-14 4 z" fill="var(--ink)"/>');

  M.push({
    id: 'm6', titulo: 'Auxílios à navegação e publicações',
    resumo: 'Faróis, faroletes, boias e balizas; característica das luzes e setores; alcance geográfico, luminoso e nominal; e as publicações da DHN que o Mestre-Amador precisa saber usar: Lista de Faróis, Lista de Sinais Cegos, Lista de Auxílios-Rádio, Roteiro, Catálogo de Cartas, Carta 12000, Cartas de Correntes de Maré, Atlas de Cartas Piloto e Avisos aos Navegantes.',
    licoes: [
      {
        id: 'l1', titulo: 'Faróis, faroletes, boias e balizas', minutos: 10,
        objetivos: [
          'Distinguir farol, farolete, boia, baliza e seus usos.',
          'Reconhecer a classificação dos faróis e as abreviaturas de faróis automáticos.',
          'Saber como cada sinal é identificado de dia e de noite.',
        ],
        blocos: [
          { t: 'p', html: 'Os <b>auxílios visuais à navegação</b> são as marcas que você vê: luminosos (faróis, faroletes, luzes de alinhamento, boias luminosas) e cegos (boias cegas e balizas). Todos aparecem na carta, com símbolo próprio da Carta 12000, e os luminosos estão descritos na Lista de Faróis.' },
          { t: 'termos', ids: ['farol', 'balizamento', 'caracteristica-da-luz', 'alcance'] },
          { t: 'figura', svg: FIG_AUX, legenda: 'Farol e farolete são estruturas fixas; a diferença é o alcance luminoso noturno (mais de 10 milhas para o farol, até 10 para o farolete). A boia luminosa leva o aparelho de luz num mangrulho (estrutura em treliça), com a marca de tope em cima. A baliza é fixa e cega, com marca de tope obrigatória. Desenhos esquemáticos.' },
          { t: 'h', txt: 'Faróis e faroletes' },
          { t: 'p', html: '<b>Farol</b> é uma estrutura fixa, de forma e cores próprias, num ponto de coordenadas conhecidas (costa, ilha, recife, margem de rio), com luz de característica definida e <b>alcance luminoso noturno maior que 10 milhas</b>. <b>Farolete</b> é a mesma ideia com alcance <b>igual ou menor que 10 milhas</b>. A divisão é só convencional.' },
          { t: 'lista', itens: [
            '<b>Farol de aterragem:</b> para reconhecer o porto e corrigir a posição de quem vem do alto-mar; normalmente visto a mais de 20 milhas. O Manual da DHN cita Natal, Olinda, Rasa e Moela.',
            '<b>Farol de cabotagem:</b> marca cabos, pontas e ilhas ao longo da costa, para quem navega entre portos (exemplos do Manual: Itapajé, Santo Alberto, Ponta de Pedras, Itapuã, Maricás).',
            '<b>Farol principal de porto:</b> o principal auxílio visual na demanda do porto, depois do farol de aterragem. No Rio de Janeiro, o farol de aterragem é o da Rasa e o principal do porto é o de Santa Cruz.',
            '<b>Guarnecido ou automático:</b> farol com pessoal fixo aparece com “G” só na Lista de Faróis. Na carta, o farol automático leva a abreviatura <b>(SG)</b>, “sem guarnição”: uma falha pode demorar a ser corrigida.',
          ] },
          { t: 'h', txt: 'Boias' },
          { t: 'p', html: 'A boia é um corpo flutuante, com forma e cores definidas, fundeado por amarra e poita numa posição determinada. Ela indica o caminho, os limites de um canal, um perigo, águas seguras, cabos submarinos ou áreas especiais. A <b>boia luminosa</b> leva no mangrulho o aparelho de luz, a marca de tope e, às vezes, refletor radar e AIS. A <b>boia cega</b> não tem luz: é reconhecida pela forma, pela cor e pelo tope. Há também a boia articulada, presa à poita por uma articulação, que fica mais firme no lugar.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Não navegue pelas boias', html: 'Boias garram. Corrente, vento, uma colisão ou uma rede enroscada na amarra tiram a boia do lugar. Use-as para confirmar a navegação, nunca como única referência, e não tire LDP delas (Manual da DHN, 13.2.2).' },
          { t: 'h', txt: 'Balizas' },
          { t: 'p', html: '<b>Baliza</b> é um sinal fixo e cego: uma haste pintada, encimada obrigatoriamente pela marca de tope, cravada em águas rasas, sobre pedras, bancos ou recifes, ou em terra. É o sinal mais simples e barato, para uso de dia. Nos rios, as balizas em terra levam placas com símbolos e a quilometragem do rio, contada da foz para montante.' },
          { t: 'h', txt: 'Como identificar' },
          { t: 'lista', itens: [
            '<b>De dia:</b> cor, forma, marca de tope e número (se houver).',
            '<b>De noite:</b> só a característica da luz (ritmo e cor). Por isso sinais vizinhos têm características diferentes.',
            'A boia de amarração (de atracar barcos) <b>não</b> é auxílio à navegação, segundo a IALA.',
            'No Brasil, segundo o Manual, não há hoje barcas-faróis nem grandes boias automáticas (LANBY) em operação.',
          ] },
          { t: 'check', questoes: [
            q('m6l1-1', 'Auxílios à navegação e publicações', 1, 'Qual a diferença entre farol e farolete?',
              ['O farol é guarnecido; o farolete é automático.', 'O farol tem alcance luminoso noturno maior que 10 milhas; o farolete, até 10 milhas.', 'O farol fica em terra; o farolete, sempre numa boia.', 'O farol tem luz branca; o farolete, luz colorida.'], 1,
              'A distinção é convencional e feita pelo alcance luminoso noturno: mais de 10 M é farol; 10 M ou menos é farolete (Manual, 13.2.2). Existem faróis automáticos e guarnecidos; o farolete é estrutura fixa (não boia); e os dois podem ter luz branca ou colorida.',
              'Miguens, vol. I, item 13.2.2, alíneas a e b', U.man1),
            q('m6l1-2', 'Auxílios à navegação e publicações', 1, 'Na carta, um farol aparece com a abreviatura (SG). O que ela indica?',
              ['Sinal de grupo de lampejos.', 'Setor de grande alcance.', 'Farol sem guarnição (automático).', 'Sinal geográfico de referência.'], 2,
              '(SG) significa “sem guarnição”: o farol funciona automaticamente, e uma irregularidade pode não ser corrigida tão depressa. O “G” de guarnecido aparece só na Lista de Faróis. As demais alternativas não existem como abreviaturas de carta.',
              'Miguens, vol. I, item 13.2.2, alínea a', U.man1),
            q('m6l1-3', 'Auxílios à navegação e publicações', 1, 'Como se identifica uma boia cega durante o dia?',
              ['Pela característica da luz.', 'Pela cor, pela forma, pela marca de tope e pela numeração.', 'Pelo som do apito de cerração.', 'Só pela posição na carta.'], 1,
              'De dia os sinais são identificados pela cor, forma, marca de tope e número; à noite, pela característica luminosa (Manual, 13.2.4). A boia cega não tem luz. Nem toda boia tem sinal sonoro. A posição na carta ajuda, mas boias podem estar garradas, por isso confirmam-se as características.',
              'Miguens, vol. I, item 13.2.4', U.man1),
          ] },
          { t: 'fontes', itens: [
            man('cap. 13, itens 13.2.1 a 13.2.4'),
            { txt: 'Carta 12000 (INT 1), DHN, 5ª ed. 2022: seções P (luzes) e Q (boias e balizas)', url: U.c12000 },
          ] },
        ],
      },
      {
        id: 'l2', titulo: 'Característica da luz e setores', minutos: 12,
        objetivos: [
          'Ler a característica de uma luz na carta e na Lista de Faróis.',
          'Diferenciar lampejo, ocultação, isofásica, rápida e muito rápida.',
          'Interpretar setores e arcos de visibilidade de um farol.',
        ],
        blocos: [
          { t: 'p', html: 'À noite, um farol é reconhecido só pela <b>característica</b> da luz: a combinação de <b>ritmo</b> (a sequência de luz e escuridão) e <b>cor</b>. O <b>período</b> é o tempo entre o início de dois ciclos iguais. Com um relógio e um pouco de paciência, você conta lampejos e mede o período, e confere na carta qual farol é.' },
          { t: 'termos', ids: ['caracteristica-da-luz', 'lampejo', 'ocultacao', 'isofasica', 'luz-rapida'] },
          { t: 'h', txt: 'Os ritmos e suas abreviaturas' },
          { t: 'tabela', cab: ['Carta brasileira', 'Internacional', 'Ritmo', 'Como reconhecer'], linhas: [
            ['F', 'F', 'Fixa', 'Luz contínua.'],
            ['Lp · Lp(3)', 'Fl · Fl(3)', 'Lampejo · grupo de lampejos', 'Luz mais curta que a escuridão.'],
            ['LpL', 'LFl', 'Lampejo longo', 'Lampejo de 2 segundos ou mais.'],
            ['Oc · Oc(2)', 'Oc · Oc(2)', 'Ocultação · grupo', 'Luz mais longa que a escuridão: a luz “pisca apagando”.'],
            ['Iso', 'Iso', 'Isofásica', 'Luz e escuridão de igual duração.'],
            ['R', 'Q', 'Rápida', '50 a 79 lampejos por minuto (normalmente 50 ou 60).'],
            ['MR', 'VQ', 'Muito rápida', '80 a 159 por minuto (normalmente 100 ou 120).'],
            ['UR', 'UQ', 'Ultrarrápida', '160 ou mais por minuto.'],
            ['Mo(A)', 'Mo(A)', 'Código Morse', 'A letra em Morse (ex.: A = ponto-traço).'],
            ['Alt.BE', 'Al.WR', 'Alternada', 'Cores que se alternam.'],
          ], legenda: 'Cores: B (W) branca, E (R) encarnada, V (G) verde, A (Y) amarela, Az (Bu) azul. Na carta, a letra B só aparece em luzes de setor ou alternadas: luz sem letra de cor é branca. Fonte: Carta 12000 (INT 1), seção P, itens 10 e 11.' },
          { t: 'h', txt: 'Lendo a inscrição da carta' },
          { t: 'p', html: 'A inscrição <b>Lp(3) 10s 62m 25M</b> (exemplo da Carta 12000) diz: grupo de três lampejos, luz branca (sem letra de cor), período de 10 segundos, foco a 62 m de altitude e alcance de 25 milhas. Na Lista de Faróis aparece ainda a <b>fase detalhada</b>, a duração de cada luz e eclipse. O farol de Cabo Branco, em João Pessoa, por exemplo, é Lp. B. 10s com fase “B. 1,2 – Ecl. 8,8”: 1,2 s de luz e 8,8 s de escuridão.' },
          { t: 'fato', ref: 'extra-mestre-2-17', html: 'Lista de Faróis, 40ª ed.: farol Cabo Branco (nº 1256, João Pessoa), Lp. B. 10s (luz 1,2 s, eclipse 8,8 s), altitude 46 m, alcances de 27 milhas (luminoso) e 17 milhas (geográfico).' },
          { t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Oc(3) BE 30s' }, legenda: 'Decodificador de característica. Comece pelo farol de Santa Marta (SC), Oc(3) B.E. 30s, e depois digite outras inscrições da carta, como Lp(2) B 35s (Olinda) ou Lp B 10s (Cabo Frio).' },
          { t: 'h', txt: 'Setores e arcos de visibilidade' },
          { t: 'fato', ref: 'extra-mestre-2-15', html: 'Na Lista de Faróis, os limites de setores e arcos de visibilidade são marcações verdadeiras, de 000° a 360°, tomadas <b>do mar para o sinal</b>, no sentido horário.' },
          { t: 'p', html: 'Ou seja: os números são as marcações com que <b>você</b> vê o farol, não as que o faroleiro veria. Se a Lista diz “E. 070°–085°”, quem marca o farol entre 070° e 085° vê a luz encarnada. Setores coloridos costumam indicar um perigo ou a passagem livre entre perigos. O Manual dá o exemplo do Farol de Palmas, na barra do Rio de Janeiro, cujo setor encarnado avisa de um perigo a SSW da Ilha Pontuda.' },
          { t: 'figura', svg: FIG_SETOR, legenda: 'Farol com setor branco 020°–070° e setor encarnado 070°–085°, que cobre uma pedra. Quem marca o farol aos 050° está no setor branco. Fora dos setores, o terreno esconde a luz. Esquema fora de escala.' },
          { t: 'fato', ref: 'extra-mestre-2-19', html: 'Exemplo real: o farol Santa Marta (nº 3956, SC) é Oc (3) B.E. 30s, altitude 74 m, com setores de visibilidade branco de 056° a 045° (349°) e encarnado de 045° a 056° (11°).' },
          { t: 'fato', ref: 'extra-mestre-2-20', html: 'O farol Cabo Frio (nº 2400, RJ) tem setor de visibilidade de 231° a 118° (247°): fora desse arco, a luz não é vista.' },
          { t: 'fato', ref: 'extra-mestre-2-16', html: 'A Lista de Faróis adverte: a distância a uma luz não pode ser estimada pelo brilho; os limites de setor, na maioria dos faróis, podem não ser confiáveis (a mudança de cor é gradual); e a distinção entre cores não deve ser considerada confiável.' },
          { t: 'callout', tipo: 'dica', titulo: 'Identificando um farol à noite', html: 'Conte os lampejos de três ciclos completos e cronometre o período do início de um grupo ao início do seguinte. Compare com todas as luzes da carta naquela área, não só com a que você espera ver. E confirme pela marcação: o farol certo está na direção prevista.' },
          { t: 'check', questoes: [
            q('m6l2-1', 'Auxílios à navegação e publicações', 1, 'Numa luz de ocultação (Oc), como se comparam as durações de luz e escuridão?',
              ['A luz dura menos que a escuridão.', 'A luz dura mais que a escuridão.', 'As duas têm a mesma duração.', 'A luz pisca 60 vezes por minuto.'], 1,
              'Ocultação: a duração total da luz é maior que a do eclipse (Carta 12000, P 10.2). Luz mais curta que a escuridão é lampejo (Lp); duração igual é isofásica (Iso); 50 a 79 por minuto é luz rápida (R).',
              'Carta 12000 (INT 1), seção P, item 10', U.c12000),
            q('m6l2-2', 'Auxílios à navegação e publicações', 2, 'Um farol tem setor encarnado 045°–056°. Você o marca aos 050°. Que cor vê?',
              ['Encarnada, porque a marcação do mar para o farol está dentro do setor.', 'Branca, porque é preciso usar a recíproca, 230°.', 'Verde, porque o setor é contado no sentido anti-horário.', 'Nenhuma: setores só valem de dia.'], 0,
              'Os limites são marcações verdadeiras tomadas do mar para o sinal, no sentido horário (Lista de Faróis, item 3.2). A sua marcação, 050°, está entre 045° e 056°: luz encarnada. Usar a recíproca é o erro clássico; o sentido é horário; e setores de luz são justamente para a noite.',
              'Lista de Faróis (DH2), 40ª ed., item 3.2', U.lf),
            q('m6l2-3', 'Auxílios à navegação e publicações', 2, 'O que significa, na carta brasileira, a inscrição MR(9) 10s?',
              ['Grupo de 9 lampejos muito rápidos a cada 10 segundos.', 'Grupo de 9 lampejos encarnados a cada 10 segundos.', 'Luz de ocultação com 9 eclipses por minuto.', 'Morse da letra R, 9 vezes em 10 segundos.'], 0,
              'MR é muito rápida (80 a 159 lampejos por minuto); (9) é o grupo; 10s é o período. É a característica de uma cardinal Oeste. A cor encarnada seria indicada por E; ocultação seria Oc; Morse seria Mo( ).',
              'Carta 12000 (INT 1), seção P, item 10.7', U.c12000),
          ] },
          { t: 'fontes', itens: [
            { txt: 'Carta 12000 (INT 1), DHN, 5ª ed. 2022: seção P, itens 10 e 11', url: U.c12000, ref: 'extra-mestre-2-10' },
            { txt: 'Lista de Faróis (DH2), 40ª ed. 2026–2027, Introdução, itens 3.2 e 5', url: U.lf, ref: 'extra-mestre-2-15' },
            man('cap. 13, item 13.2.5 e Apêndice A'),
          ] },
        ],
      },
      {
        id: 'l3', titulo: 'Alcance geográfico, luminoso e nominal', minutos: 12,
        objetivos: [
          'Definir alcance geográfico, luminoso e nominal.',
          'Calcular a que distância um farol aparece no horizonte.',
          'Saber qual alcance a carta mostra e usar o “farol boiando” como LDP.',
        ],
        blocos: [
          { t: 'p', html: 'De noite, a pergunta é: a que distância vou começar a ver este farol? A resposta depende de duas coisas diferentes. A luz precisa ser <b>forte</b> o bastante para atravessar a atmosfera até você, e precisa estar <b>alta</b> o bastante para não ficar escondida atrás da curvatura da Terra. A primeira dá o alcance luminoso; a segunda, o alcance geográfico. Vale o menor dos dois.' },
          { t: 'h', txt: 'Os três alcances' },
          { t: 'lista', itens: [
            '<b>Alcance luminoso:</b> a maior distância em que a luz pode ser vista só em função da sua intensidade e da visibilidade meteorológica. Na névoa, cai muito.',
            '<b>Alcance nominal:</b> o alcance luminoso numa atmosfera com visibilidade meteorológica de 10 milhas.',
            '<b>Alcance geográfico:</b> a maior distância em que a luz pode ser vista considerando só a curvatura da Terra, a altitude da luz e a altura do olho do observador.',
          ] },
          { t: 'fato', ref: 'extra-mestre-2-13', html: 'Na Lista de Faróis, o alcance luminoso é calculado para a noite, a olho nu, sem luzes de fundo e com transparência atmosférica T = 0,85 (visibilidade meteorológica de 18,4 milhas); o alcance geográfico, para o olho do observador a 5 metros sobre o nível do mar.' },
          { t: 'fato', ref: 'extra-mestre-2-14', html: 'A Lista de Faróis calcula o alcance geográfico por D = 1,927 (√H + √h), com D em milhas, H a altitude do objeto e h a altura do olho, ambas em metros. Exemplo da publicação: olho a 5 m e farol a 60 m dão 19,2 milhas.' },
          { t: 'figura', svg: FIG_ALCANCE, legenda: 'Cada parcela, 1,927 √H e 1,927 √h, é a distância de um ponto ao horizonte. Somadas, dão a distância em que o foco do farol “boia” no horizonte. O coeficiente 1,927 é o do horizonte geométrico (veja a nota abaixo sobre a refração). Esquema fora de escala.' },
          { t: 'callout', tipo: 'nota', titulo: 'Uma sutileza do Manual: o 1,927 e a refração', html: 'O Apêndice B do capítulo 13 do Manual deduz <b>D = 1,927 √H</b> como a distância ao <b>horizonte geométrico</b> (D = √(2·H·R), com R = 6.368 km), isto é, sem refração. Em seguida, o mesmo apêndice afirma que a tabela da Lista de Faróis, calculada com essa fórmula, “já aplica a refração normal”. As duas frases não se conciliam: o Manual diz que a refração tende a <b>aumentar</b> o alcance geográfico, e a fórmula não a inclui. Para a prova vale a bibliografia (a fórmula e a tabela da Lista). No mar, trate o alcance geográfico como estimativa: com ar normal a luz pode aparecer um pouco antes do calculado, e com ar anormal a diferença pode ir para qualquer lado.' },
          { t: 'h', txt: 'O que a carta mostra' },
          { t: 'p', html: 'Ao navegante interessa saber a que distância vai avistar o sinal pela primeira vez. Por isso, segundo o Manual da DHN, <b>a carta registra só o menor dos dois alcances</b>, o geográfico (para olho a 5 m) ou o luminoso. A Lista de Faróis traz os dois.' },
          { t: 'h', txt: 'Contas para um veleiro' },
          { t: 'p', html: 'Num cruzeiro de 32 pés (≈ 9,75 m), por exemplo, o olho fica a uns 2,5 m da água, abaixo dos 5 m da Lista. Então você vê os faróis um pouco mais perto do que a Lista indica. Neste exemplo, use √2,5 ≈ 1,58; no seu barco, use a altura real do seu olho (em barcos maiores ela pode passar dos 5 m da Lista, e aí o alcance fica maior que o tabelado).' },
          { t: 'tabela', cab: ['Farol (Lista de Faróis, 40ª ed.)', 'Altitude', 'Lista: geográfico (olho 5 m) · luminoso', 'Seu alcance geográfico (olho 2,5 m)'], linhas: [
            ['Cabo Frio (RJ), Lp. B. 10s', '140 m', '27 M · 49 M', '1,927 × (11,83 + 1,58) ≈ 25,8 M'],
            ['Olinda (PE), Lp (2) B. 35s', '90 m', '22 M · 46 M', '1,927 × (9,49 + 1,58) ≈ 21,3 M'],
            ['Cabo Branco (PB), Lp. B. 10s', '46 m', '17 M · 27 M', '1,927 × (6,78 + 1,58) ≈ 16,1 M'],
          ], legenda: 'Nos três casos o alcance luminoso é maior que o geográfico: em noite clara, a luz aparece quando “boia” no horizonte. Conta de cabeça: D ≈ 2 × (√H + √h) dá um valor um pouco maior, bom para estimar.' },
          { t: 'fato', ref: 'extra-mestre-2-18', html: 'Lista de Faróis, 40ª ed.: farol Olinda (nº 1272, PE), Lp (2) B. 35s, altitude 90 m, alcances de 46 milhas (luminoso) e 22 milhas (geográfico).' },
          { t: 'fato', ref: 'extra-mestre-2-20', html: 'Lista de Faróis, 40ª ed.: farol Cabo Frio (nº 2400, RJ), Lp. B. 10s, altitude 140 m, alcances de 49 milhas (luminoso) e 27 milhas (geográfico).' },
          { t: 'h', txt: 'O farol boiando: uma LDP de graça' },
          { t: 'p', html: 'Quando o foco de um farol com alcance luminoso maior que o geográfico aparece exatamente no horizonte (“boia”), você está a cerca do seu alcance geográfico dele. Isso é uma <b>distância</b>: com a marcação do farol no mesmo instante, você tem uma posição por marcação e distância do mesmo objeto. É um método aproximado, porque a refração varia, mas ótimo para confirmar a aterragem. Dica: abaixe e levante a cabeça; se a luz some ao abaixar, ela está mesmo no horizonte.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Alcance luminoso muda com o tempo', html: 'Na bruma ou na chuva, o alcance luminoso cai, às vezes abaixo do geográfico. O Manual dá o exemplo do farol Santa Cruz: com visibilidade de 10 milhas, alcance luminoso de 9,5 milhas. A Lista de Faróis traz um diagrama para estimar o alcance luminoso pela intensidade da luz e pela visibilidade do momento. Se o farol esperado não aparece na hora prevista, desconfie da visibilidade antes de desconfiar da estimada, e reduza a velocidade perto da costa.' },
          { t: 'check', questoes: [
            q('m6l3-1', 'Auxílios à navegação e publicações', 2, 'Um farol tem foco a 64 m de altitude. Seu olho está a 4 m da água. Qual o alcance geográfico, pela fórmula da Lista de Faróis?',
              ['11,6 M', '15,4 M', '19,3 M', '23,1 M'], 2,
              'D = 1,927 × (√64 + √4) = 1,927 × (8 + 2) = 19,3 M. 15,4 M só considera o farol (1,927 × 8); 11,6 M subtrai as raízes em vez de somar (1,927 × 6); 23,1 M usa a altura do olho sem tirar a raiz (1,927 × (8 + 4)).',
              'Lista de Faróis (DH2), 40ª ed., item 3.5', U.lf),
            q('m6l3-2', 'Auxílios à navegação e publicações', 2, 'Um farol tem alcance geográfico de 20 milhas e alcance luminoso de 12 milhas. Qual alcance a carta da DHN mostra e por quê?',
              ['20 milhas, porque é o maior.', '12 milhas, porque a carta registra o menor dos dois, a distância em que ele pode ser visto pela primeira vez.', '32 milhas, a soma dos dois.', '16 milhas, a média.'], 1,
              'A DHN registra nas cartas apenas o menor entre os dois alcances, porque o navegante quer saber a que distância poderá avistar o sinal (Manual, 13.2.6). Somar ou tirar a média não tem sentido físico: a luz precisa vencer as duas limitações ao mesmo tempo.',
              'Miguens, vol. I, item 13.2.6', U.man1),
            q('m6l3-3', 'Auxílios à navegação e publicações', 1, 'O que é alcance nominal?',
              ['O alcance luminoso com visibilidade meteorológica de 10 milhas.', 'O alcance geográfico com olho a 5 m.', 'O alcance máximo em noite perfeita, sem atmosfera.', 'O alcance do radar no farol.'], 0,
              'Alcance nominal é o alcance de uma luz numa atmosfera homogênea com visibilidade meteorológica de 10 milhas (Manual, 13.2.6). O alcance com olho a 5 m é o geográfico da Lista. Não existe “alcance sem atmosfera” nas publicações. Radar é outro assunto.',
              'Miguens, vol. I, item 13.2.6, alínea b', U.man1),
          ] },
          { t: 'fontes', itens: [
            { txt: 'Lista de Faróis (DH2), 40ª ed. 2026–2027, Instruções e item 3.5 (alcances)', url: U.lf, ref: 'extra-mestre-2-14' },
            man('cap. 13, item 13.2.6 e Apêndice B (a visibilidade no mar)'),
          ] },
        ],
      },
      {
        id: 'l4', titulo: 'Lista de Faróis, Lista de Sinais Cegos e Lista de Auxílios-Rádio', minutos: 10,
        objetivos: [
          'Saber o que cada lista traz e quando consultá-la.',
          'Ler uma entrada da Lista de Faróis.',
          'Achar as edições vigentes e os links oficiais.',
        ],
        blocos: [
          { t: 'p', html: 'A carta mostra o essencial de cada sinal num espaço pequeno. As <b>listas</b> da DHN contam o resto: fase detalhada da luz, os dois alcances, setores, descrição da estrutura, sinais sonoros, estações de rádio. São publicações de consulta: abra-as no planejamento e tenha-as à mão (em papel ou PDF) a bordo.' },
          { t: 'termos', ids: ['lista-de-farois', 'carta-12000', 'avisos-aos-navegantes'] },
          { t: 'h', txt: 'Lista de Faróis (DH2)' },
          { t: 'fato', ref: 'extra-mestre-2-12', html: 'A Lista de Faróis (40ª edição, 2026–2027) reúne faróis, aerofaróis, barcas-faróis, faroletes, balizas, boias luminosas e luzes particulares ou de obstáculos aéreos de interesse do navegante, na costa, rios, lagoas e ilhas do Brasil e nas costas estrangeiras representadas nas cartas brasileiras.' },
          { t: 'p', html: 'Cada sinal tem um <b>número de ordem</b> (o de Cabo Branco é 1256), nome e posição, característica com fase detalhada, altitude do foco, alcances luminoso e geográfico, descrição da estrutura e observações como setores e arcos de visibilidade. A Introdução da Lista traz ainda os quadros do balizamento IALA Região B, a tabela de alcance geográfico e o diagrama de alcance luminoso.' },
          { t: 'tabela', cab: ['Campo da Lista', 'Cabo Branco (nº 1256)'], linhas: [
            ['Característica', 'Lp. B. 10s'],
            ['Fase detalhada', 'B. 1,2 – Ecl. 8,8'],
            ['Altitude do foco', '46 m'],
            ['Alcance luminoso · geográfico', '27 M · 17 M'],
          ], legenda: 'Extrato simplificado da Lista de Faróis, 40ª ed. (entrada completa no PDF oficial).' },
          { t: 'h', txt: 'Lista de Sinais Cegos' },
          { t: 'fato', ref: 'extra-mestre-2-21', html: 'A Lista de Sinais Cegos (9ª edição, 2025–2029) traz os sinais cegos da costa e de rios, lagoas e ilhas do Brasil, exceto os das hidrovias Paraguai-Paraná e Tietê-Paraná.' },
          { t: 'p', html: 'Use-a para conhecer boias cegas e balizas de uma área nova, sobretudo canais, barras e rios, onde boa parte do balizamento não tem luz. À noite, um sinal cego só aparece no holofote, e às vezes nem assim.' },
          { t: 'h', txt: 'Lista de Auxílios-Rádio (DH8)' },
          { t: 'fato', ref: 'extra-mestre-2-22', html: 'A Lista de Auxílios-Rádio (15ª edição) reúne os auxílios radioelétricos à navegação da costa do Brasil e os serviços-rádio, inclusive por satélite, úteis a quem navega no Atlântico Sul.' },
          { t: 'p', html: 'Ela é organizada por tipo de serviço. Segundo o Manual da DHN, cada estação tem um número-índice de quatro algarismos: o milhar diz o serviço (2 radiofaróis; 3 sinais horários; 4 boletins meteorológicos e avisos de mau tempo; 5 avisos-rádio náuticos e SAR; 7 tráfego de perigo e segurança; 8 estações costeiras de tráfego comercial) e a centena, a região. Um capítulo reproduz as regras de radiocomunicações de socorro e segurança e lista as estações costeiras que recebem chamadas de socorro. Os horários vêm em hora de Greenwich (HMG). Ela complementa, nunca substitui, as publicações próprias dos serviços-rádio.' },
          { t: 'callout', tipo: 'dica', titulo: 'Onde baixar', html: 'O CHM publica as listas na página de publicações náuticas. A Lista de Faróis tem PDF gratuito, atualizado até um folheto recente de Avisos aos Navegantes. Baixe a versão nova antes de cada temporada e confira a data da última correção. <a href="' + U.listaFarois + '" target="_blank" rel="noopener">Lista de Faróis</a> · <a href="' + U.sinaisCegos + '" target="_blank" rel="noopener">Lista de Sinais Cegos</a> · <a href="' + U.auxRadio + '" target="_blank" rel="noopener">Lista de Auxílios-Rádio</a>.' },
          { t: 'widget', w: 'ritmos-luz', opts: { modo: 'desafio' }, legenda: 'Desafio: identifique a característica pela luz piscando, como faria ao comparar o que vê com a Lista de Faróis.' },
          { t: 'check', questoes: [
            q('m6l4-1', 'Auxílios à navegação e publicações', 1, 'Onde você encontra a fase detalhada (duração de cada luz e eclipse) de um farol?',
              ['Na Carta 12000.', 'Na Lista de Faróis.', 'No Catálogo de Cartas e Publicações.', 'Na Lista de Sinais Cegos.'], 1,
              'A Lista de Faróis descreve cada sinal luminoso, com característica, fase detalhada, alcances e setores. A Carta 12000 explica símbolos e abreviaturas, sem dados de cada farol. O Catálogo lista cartas e publicações. A Lista de Sinais Cegos trata de sinais sem luz.',
              'Lista de Faróis (DH2), 40ª ed.', U.listaFarois),
            q('m6l4-2', 'Auxílios à navegação e publicações', 2, 'Na Lista de Auxílios-Rádio, uma estação tem número-índice começando por 4. Que serviço ela presta?',
              ['Radiofarol.', 'Sinais horários.', 'Boletins meteorológicos e avisos de mau tempo.', 'Tráfego comercial.'], 2,
              'Pelo esquema descrito no Manual da DHN (12.6), o milhar 4 identifica estações que divulgam boletins meteorológicos e avisos de mau tempo; 2 são radiofaróis, 3 sinais horários e 8 estações costeiras de tráfego comercial.',
              'Miguens, vol. I, item 12.6', U.man1),
            q('m6l4-3', 'Auxílios à navegação e publicações', 1, 'Você vai entrar num canal com balizamento sem luz. Que publicação descreve esses sinais?',
              ['Lista de Sinais Cegos.', 'Lista de Auxílios-Rádio.', 'Atlas de Cartas Piloto.', 'Tábuas das Marés.'], 0,
              'A Lista de Sinais Cegos traz os sinais cegos (boias cegas e balizas) da costa, rios, lagoas e ilhas do Brasil, com exceção das hidrovias Paraguai-Paraná e Tietê-Paraná. As outras publicações tratam de rádio, de ventos e correntes médios e de marés.',
              'CHM, Lista de Sinais Cegos', U.sinaisCegos),
          ] },
          { t: 'fontes', itens: [
            { txt: 'CHM, página da Lista de Faróis (consultada em 2026-10-08)', url: U.listaFarois, ref: 'extra-mestre-2-12' },
            { txt: 'CHM, página da Lista de Sinais Cegos (consultada em 2026-10-08)', url: U.sinaisCegos, ref: 'extra-mestre-2-21' },
            { txt: 'CHM, página da Lista de Auxílios-Rádio (consultada em 2026-10-08)', url: U.auxRadio, ref: 'extra-mestre-2-22' },
            man('cap. 12, itens 12.5 e 12.6; cap. 13, item 13.5'),
          ] },
        ],
      },
      {
        id: 'l5', titulo: 'Roteiro, Catálogo, Carta 12000, Cartas de Correntes de Maré e Cartas Piloto', minutos: 12,
        objetivos: [
          'Saber o que cada publicação traz e em que fase da viagem usá-la.',
          'Ler uma rosa de ventos de Carta Piloto.',
          'Conhecer as edições vigentes e onde obtê-las.',
        ],
        blocos: [
          { t: 'fato', ref: 'extra-mestre-2-03', html: 'A bibliografia recomendada do exame de Mestre-Amador inclui as publicações da DHN: Roteiro, Lista de Faróis, Tábuas das Marés, Avisos aos Navegantes (folheto quinzenal), Catálogo de Cartas e Publicações, Carta 12000 (INT 1), Lista de Auxílios-Rádio, Cartas de Correntes de Maré, Atlas de Cartas Piloto e Listas de Sinais Cegos.' },
          { t: 'fato', ref: 'extra-mestre-2-08', html: 'O CHM diz que a consulta às publicações náuticas é indispensável no planejamento e na execução da derrota, e que elas devem ser mantidas atualizadas, como as cartas.' },
          { t: 'h', txt: 'Catálogo de Cartas e Publicações' },
          { t: 'fato', ref: 'extra-mestre-2-09', html: 'O Catálogo de Cartas e Publicações vigente é a 15ª edição (2026–2030). Cartas e publicações podem ser compradas no posto de vendas da EMGEPRON, em Niterói, ou no site cartasnauticasbrasil.com.br.' },
          { t: 'p', html: 'É por onde se começa o planejamento. Segundo o Manual, ele tem três partes: a lista de todas as cartas, os índices (cartogramas por trecho de costa, com número, escala e edição de cada carta) e a lista das publicações. Escolha a bordo as cartas dos portos de partida, escala e destino, as da travessia e as de aproximação e interior dos <b>portos de arribada</b>, para uma emergência.' },
          { t: 'h', txt: 'Carta 12000 (INT 1)' },
          { t: 'fato', ref: 'extra-mestre-2-10', html: 'A Carta 12000 (INT 1), editada pela DHN e atualizada pelo CHM, reúne os símbolos e abreviaturas das cartas náuticas; a edição vigente é a 5ª, de 2022, atualizada por folhas de correções.' },
          { t: 'p', html: 'É o dicionário da carta, bilíngue, organizado por seções de A a U. As mais usadas na costa: I (profundidades), J (natureza do fundo), K (rochas, cascos soçobrados e obstruções), P (luzes), Q (boias e balizas), R (sinais de cerração) e U (facilidades para pequenas embarcações). É o primeiro item do programa do Mestre-Amador.' },
          { t: 'h', txt: 'Roteiro' },
          { t: 'fato', ref: 'extra-mestre-2-11', html: 'O Roteiro complementa as cartas (sem descrevê-las), com subsídios para navegar ao longo da costa, nos canais e nas aterragens e informações sobre regulamentos, recursos e facilidades dos portos. Tem três volumes: Costa Norte (da Baía do Oiapoque ao Cabo Calcanhar), Costa Leste (do Cabo Calcanhar ao Cabo Frio e ilhas oceânicas) e Costa Sul (do Cabo Frio ao Arroio Chuí e Lagoas dos Patos e Mirim).' },
          { t: 'p', html: 'Leia o trecho do Roteiro <b>com a carta aberta</b> antes de qualquer aterragem ou demanda de porto: ele diz a derrota aconselhada, como reconhecer o porto, os melhores pontos para marcar, perigos, fundeadouros, marés, correntes, ventos e o clima típico, além de vistas da costa e plantas dos portos. Entre edições, é atualizado por Folhas de Correções que vêm com os Avisos aos Navegantes.' },
          { t: 'h', txt: 'Cartas de Correntes de Maré' },
          { t: 'fato', ref: 'extra-mestre-2-23', html: 'As Cartas de Correntes de Maré são publicações para portos específicos: pequenas cartas em que setas indicam a direção e números a velocidade da corrente de maré, referidas à hora da preamar. Existem para: Rio Amazonas (Barra Norte a Santana), Rio Pará (Salinópolis a Belém), Baía de São Marcos (São Luís e Itaqui), Itapessoca e Luís Correia, Natal, Salvador, Madre de Deus, Vitória, Baía de Guanabara, Santos e Paranaguá.' },
          { t: 'p', html: 'Uso: pegue a hora da preamar do dia na Tábua das Marés, veja quantas horas antes ou depois dela você vai passar, e abra a carta daquela hora (“3 horas antes da preamar”, por exemplo). A corrente lida ali entra direto no seu triângulo de corrente.' },
          { t: 'h', txt: 'Atlas de Cartas Piloto' },
          { t: 'fato', ref: 'extra-mestre-2-24', html: 'O Atlas de Cartas Piloto da DHN tem 12 cartas (uma por mês), na projeção de Mercator, escala 1:10.000.000, do Atlântico de Trinidad ao Rio da Prata e do litoral da América do Sul até 020° W. Traz sobretudo ventos e correntes, e também declinação magnética, temperaturas do ar e da água e, no verso, nevoeiro, visibilidade e ventos fortes nos principais portos e ilhas do Brasil.' },
          { t: 'p', html: 'Pelas convenções descritas no Manual: ventos em azul, em rosas cujas setas “voam” para o centro a partir da direção de onde o vento sopra; o comprimento da seta dá a frequência e o número de penas, a força média na escala Beaufort; no centro, a porcentagem de calmarias. Correntes em verde (seta = direção predominante, número = velocidade média em nós). Isotermas em encarnado e linhas isogônicas em roxo. É uma publicação de <b>médias climatológicas</b>: ótima para planejar a época e a rota, nunca substitui a previsão do tempo.' },
          { t: 'figura', svg: FIG_ROSA, legenda: 'Rosa de ventos do exemplo do Manual da DHN para a costa de Santa Catarina em maio: N 18%, NE 20%, E 12%, SE 10%, S 20%, SW 13%, W 7% e NW 9%, todos de força 3, exceto SW, de força 4; 2% de calmarias. Atenção: esses percentuais, lidos na escala de comprimento das setas (Manual, item 12.8), somam 111%, mais que o possível; são leituras gráficas aproximadas, boas só como ordem de grandeza. Desenho esquemático.' },
          { t: 'h', txt: 'Tábuas das Marés' },
          { t: 'fato', ref: 'extra-mestre-2-25', html: 'As Tábuas das Marés para 2026 (63ª edição) trazem previsões de 44 portos e de outros pontos da costa (ilhas, barras, fundeadouros), geradas pelo CHM por análise harmônica.' },
          { t: 'callout', tipo: 'nota', titulo: 'Links oficiais (CHM)', html: '<a href="' + U.catalogo + '" target="_blank" rel="noopener">Catálogo de Cartas e Publicações</a> · <a href="' + U.carta12000 + '" target="_blank" rel="noopener">Carta 12000</a> · <a href="' + U.roteiros + '" target="_blank" rel="noopener">Roteiros</a> · <a href="' + U.correntesMare + '" target="_blank" rel="noopener">Cartas de Correntes de Maré</a> · <a href="' + U.cartasPiloto + '" target="_blank" rel="noopener">Atlas de Cartas Piloto</a> · <a href="' + U.tabuas + '" target="_blank" rel="noopener">Tábuas das Marés</a>. Páginas conferidas em 2026-10-08.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Equivalentes no exterior', html: 'Para fretar ou navegar fora do Brasil, os equivalentes britânicos (cobrados nos cursos RYA) são o <i>Admiralty List of Lights and Fog Signals</i>, os <i>Sailing Directions</i> (ou os <i>almanacs</i> e <i>pilot books</i> de cruzeiro), os <i>Notices to Mariners</i> e as <i>Admiralty Lists of Radio Signals</i>; as cartas piloto americanas são as <i>Pilot Charts</i> da NGA. A lógica de uso é a mesma.' },
          { t: 'check', questoes: [
            q('m6l5-1', 'Auxílios à navegação e publicações', 1, 'Antes de demandar um porto desconhecido, qual publicação descreve a derrota aconselhada, os pontos para marcar e os recursos do porto?',
              ['Catálogo de Cartas e Publicações.', 'Roteiro.', 'Carta 12000.', 'Atlas de Cartas Piloto.'], 1,
              'O Roteiro complementa as cartas com informações para a navegação costeira, as aterragens e a demanda dos portos, inclusive recursos e regulamentos. O Catálogo lista cartas; a Carta 12000 explica símbolos; as Cartas Piloto dão médias mensais de vento e corrente.',
              'CHM, página Roteiros; Miguens, vol. I, item 12.4', U.roteiros),
            q('m6l5-2', 'Auxílios à navegação e publicações', 2, 'Numa Carta Piloto, uma seta de vento com 4 penas indica:',
              ['vento de 4 nós.', 'força 4 na escala Beaufort, como média do mês.', 'frequência de 4%.', 'rajadas de até 40 nós.'], 1,
              'Nas rosas das Cartas Piloto, o número de penas indica a força média na escala Beaufort; o comprimento da seta indica a frequência (Manual, 12.8). Não indica nós diretamente, nem rajadas.',
              'Miguens, vol. I, item 12.8', U.man1),
            q('m6l5-3', 'Auxílios à navegação e publicações', 2, 'As Cartas de Correntes de Maré dão a corrente referida a quê?',
              ['À hora da preamar.', 'À hora da baixa-mar.', 'À hora legal fixa do dia.', 'À fase da Lua.'], 0,
              'As setas e velocidades de cada pequena carta correspondem a um número de horas antes ou depois da preamar (CHM). Por isso se usa junto com a Tábua das Marés do dia. As demais referências não são as usadas nessa publicação.',
              'CHM, página Cartas de Correntes de Maré', U.correntesMare),
          ] },
          { t: 'fontes', itens: [
            { txt: 'CHM, Publicações náuticas (consultada em 2026-10-08)', url: U.pubs, ref: 'extra-mestre-2-08' },
            { txt: 'CHM, Catálogo de Cartas e Publicações', url: U.catalogo, ref: 'extra-mestre-2-09' },
            { txt: 'CHM, Roteiros', url: U.roteiros, ref: 'extra-mestre-2-11' },
            { txt: 'CHM, Cartas de Correntes de Maré', url: U.correntesMare, ref: 'extra-mestre-2-23' },
            { txt: 'CHM, Atlas de Cartas Piloto', url: U.cartasPiloto, ref: 'extra-mestre-2-24' },
            man('cap. 12, itens 12.2 a 12.8; cap. 10, item 10.2.2'),
          ] },
        ],
      },
      {
        id: 'l6', titulo: 'Avisos aos Navegantes: carta sempre atualizada', minutos: 10,
        objetivos: [
          'Saber o que são os Avisos aos Navegantes e os Avisos-Rádio Náuticos.',
          'Corrigir uma carta em papel do jeito certo (lápis ou caneta).',
          'Cumprir o que a NORMAM-211 pede sobre cartas a bordo e áreas de segurança.',
        ],
        blocos: [
          { t: 'p', html: 'Uma carta é tão boa quanto sua última correção. Faróis apagam, boias mudam de lugar, um casco afunda num canal, uma área é interditada para uma obra. A DHN avisa tudo isso por dois canais: os <b>Avisos aos Navegantes</b>, para atualizar cartas e publicações, e os <b>Avisos-Rádio Náuticos</b>, para o que é urgente.' },
          { t: 'fato', ref: 'extra-mestre-2-06', html: 'Os Avisos aos Navegantes são folhetos periódicos que atualizam cartas e publicações náuticas brasileiras. Há três regulares: Área Marítima e Hidrovias em Geral (DH21, quinzenal), Hidrovia Paraguai-Paraná (DH22, mensal) e Hidrovia Tietê-Paraná (DH23, trimestral).' },
          { t: 'fato', ref: 'extra-mestre-2-07', html: 'As correções de cartas saem como Avisos Temporários (T), Preliminares (P) e Permanentes, na Seção III; os trechos de carta para colar (“bacalhaus”) vêm na Seção VIII; as correções de publicações, na Seção IV e, se preciso, em Folhas de Correções.' },
          { t: 'h', txt: 'Como corrigir a carta em papel' },
          { t: 'lista', itens: [
            '<b>Temporário (T)</b>: mudança passageira (um farol apagado para manutenção). Corrija <b>a lápis</b> e apague quando o aviso for cancelado.',
            '<b>Preliminar (P)</b>: antecipa uma mudança que virá em Aviso Permanente. Também <b>a lápis</b>.',
            '<b>Permanente</b>: mudança definitiva. Corrija <b>a caneta</b> (a tinta vermelha, de forma clara e sem rasuras, como manda o capítulo 2 do Manual) ou cole o “bacalhau”. Depois, anote o ano e o número do aviso no campo <b>“Pequenas correções”</b>, no canto inferior esquerdo da carta.',
            'A numeração dos permanentes é sequencial no ano, para todas as áreas; os temporários e preliminares levam a letra da região, o número, (T) ou (P) e o ano.',
          ] },
          { t: 'figura', svg: FIG_CORR, legenda: 'O campo “Pequenas correções” mostra até onde a carta está atualizada: basta comparar o último número anotado com os Avisos Permanentes publicados desde então. Desenho esquemático.' },
          { t: 'h', txt: 'Avisos-Rádio Náuticos' },
          { t: 'fato', ref: 'extra-mestre-2-27', html: 'No site do CHM, os Avisos-Rádio Náuticos e SAR podem ser consultados por área: Norte, Leste, Sul, Bacia Amazônica, Hidrovias em Geral, NAVAREA V, Hidrovia Tietê-Paraná, Hidrovia Paraguai-Paraná e SAR, em português ou inglês.' },
          { t: 'p', html: 'Os Avisos-Rádio divulgam o que é urgente: luz apagada, boia fora de posição, derrelito, área interditada, regata, busca e salvamento. Alguns curtos (reboques, regatas, derrelitos) só circulam por rádio, satélite e internet, e nunca entram no folheto. Antes de sair, leia os avisos vigentes da sua área; no mar, escute os boletins pelo rádio.' },
          { t: 'h', txt: 'O que a NORMAM-211 pede' },
          { t: 'fato', ref: 'extra-mestre-2-01', html: 'As embarcações de esporte e recreio, exceto as miúdas, devem ter a bordo, em local acessível, cartas náuticas das regiões onde pretendem operar; um Sistema de Cartas Eletrônicas (ECS) pode ser aceito para cumprir essa exigência.' },
          { t: 'fato', ref: 'extra-mestre-2-02', html: 'São áreas de segurança, entre outras: fundeadouros de navios mercantes, canais de acesso aos portos, proximidades das instalações portuárias, a faixa de 500 m em volta de unidades estacionárias de produção de petróleo e áreas especiais divulgadas em Avisos aos Navegantes. Nelas não são permitidos o tráfego e o fundeio; o tráfego de esporte e recreio por canais de acesso até marinas e clubes é regulado nas normas locais (NPCP/NPCF).' },
          { t: 'h', txt: 'Carta eletrônica e carta raster' },
          { t: 'fato', ref: 'extra-mestre-2-26', html: 'O CHM disponibiliza gratuitamente cartas raster (formato KAP/BSB) atualizadas até o último Aviso aos Navegantes permanente em vigor; os arquivos GeoTIFF são para fins acadêmicos e não devem ser usados como auxílio à navegação.' },
          { t: 'fato', ref: 'tecnico-153', html: 'O CHM afirma que as cartas náuticas em papel, com as demais publicações, continuam sendo o documento náutico oficial para a navegação.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Plotter também envelhece', html: 'Carta eletrônica sem atualização é tão perigosa quanto carta de papel velha. Anote a data da carta carregada no plotter, compare com os Avisos e leia sempre os Avisos-Rádio da área. Configure o GNSS e o programa no datum da carta (o CHM recomenda WGS-84 para as cartas raster).' },
          { t: 'callout', tipo: 'dica', titulo: 'Onde consultar', html: '<a href="' + U.avisos + '" target="_blank" rel="noopener">Avisos aos Navegantes (CHM)</a> · <a href="' + U.avisosRadio + '" target="_blank" rel="noopener">Avisos-Rádio Náuticos e SAR</a> · <a href="' + U.raster + '" target="_blank" rel="noopener">Cartas raster</a>. Páginas conferidas em 2026-10-08.' },
          { t: 'check', questoes: [
            q('m6l6-1', 'Auxílios à navegação e publicações', 2, 'Um Aviso aos Navegantes Temporário (T) informa que um farolete está apagado. Como corrigir a carta em papel?',
              ['A caneta, e anotar no campo Pequenas correções.', 'A lápis, para apagar quando o aviso for cancelado.', 'Colando um bacalhau.', 'Não se corrige carta por aviso temporário.'], 1,
              'Avisos Temporários e Preliminares são lançados a lápis; só os Permanentes vão a caneta (ou bacalhau) e são registrados no campo Pequenas correções (Manual, 12.11.1). Ignorar o aviso deixaria a carta errada justamente enquanto o farolete está apagado.',
              'Miguens, vol. I, item 12.11.1', U.man1),
            q('m6l6-2', 'Auxílios à navegação e publicações', 1, 'Com que periodicidade sai o folheto de Avisos aos Navegantes da Área Marítima e Hidrovias em Geral?',
              ['Semanal.', 'Quinzenal.', 'Mensal.', 'Trimestral.'], 1,
              'O folheto DH21 (Área Marítima e Hidrovias em Geral) é quinzenal; o da Hidrovia Paraguai-Paraná (DH22) é mensal e o da Hidrovia Tietê-Paraná (DH23) é trimestral (CHM).',
              'CHM, Avisos aos Navegantes', U.avisos),
            q('m6l6-3', 'Auxílios à navegação e publicações', 2, 'Segundo a NORMAM-211, pode-se fundear um veleiro de recreio num canal de acesso a um porto?',
              ['Sim, se for por menos de 12 horas.', 'Sim, desde que com luz de fundeio.', 'Não: canais de acesso são áreas de segurança, onde não são permitidos tráfego e fundeio (o acesso a marinas e clubes é regulado nas normas locais).', 'Só com autorização do prático.'], 2,
              'A NORMAM-211 (art. 1.9) lista os canais de acesso aos portos entre as áreas de segurança, onde não se permitem tráfego e fundeio; o trânsito de esporte e recreio para chegar às marinas é tratado nas normas da Capitania (NPCP/NPCF). Luz de fundeio não muda a proibição, e não há prazo de 12 horas nem autorização do prático para isso.',
              'NORMAM-211/DPC, art. 1.9', U.normam),
          ] },
          { t: 'flash', deck: 'mestre-2', txt: 'Revise característica de luz, alcances e publicações da DHN nos flashcards desta parte.' },
          { t: 'fontes', itens: [
            { txt: 'CHM, Avisos aos Navegantes (consultada em 2026-10-08)', url: U.avisos, ref: 'extra-mestre-2-06' },
            { txt: 'CHM, Avisos-Rádio Náuticos e SAR', url: U.avisosRadio, ref: 'extra-mestre-2-27' },
            { txt: 'NORMAM-211/DPC, art. 4.20 (publicações a bordo) e art. 1.9 (áreas de segurança)', url: U.normam, ref: 'extra-mestre-2-01' },
            { txt: 'CHM, Cartas raster', url: U.raster, ref: 'extra-mestre-2-26' },
            man('cap. 12, item 12.11'),
          ] },
        ],
      },
    ],
  });

  /* ==================================================================================================
     m7 — Balizamento e RIPEAM na costa (Anexo 5-A, 2.1 h e p)
     ================================================================================================== */

  function boia(x, y, cor, rot, lado) {
    var t = lado === 'e' ? '<text x="' + (x - 16) + '" y="' + (y + 5) + '" ' + TX + ' text-anchor="end">' + rot + '</text>'
      : '<text x="' + (x + 16) + '" y="' + (y + 5) + '" ' + TX + '>' + rot + '</text>';
    return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + cor + '" stroke="var(--ink)" stroke-width="2"/>' + t;
  }
  var FIG_CANAL = svg('0 0 440 370', 'Entrada de porto vinda do mar no balizamento IALA Região B: boias encarnadas de números ímpares a boreste, verdes de números pares a bombordo, boia de águas seguras na entrada e cardinal leste junto a uma pedra',
    '<rect x="0" y="0" width="440" height="370" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 0 H150 Q140 60 110 90 Q60 130 0 140 Z" fill="var(--land)"/>' +
    '<path d="M440 0 H300 Q310 50 330 70 Q380 110 440 120 Z" fill="var(--land)"/>' +
    '<line x1="300" y1="40" x2="318" y2="86" stroke="var(--ink)" stroke-width="6"/>' +
    '<circle cx="318" cy="86" r="6" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="2"/><text x="330" y="100" ' + TX + '>molhe · Lp E 4s</text>' +
    '<line x1="220" y1="350" x2="220" y2="40" ' + MG + ' stroke-width="3" stroke-dasharray="10 6"/><path d="M220 30 l-8 16 h16 z" fill="var(--magenta)"/>' +
    '<circle cx="220" cy="322" r="10" fill="var(--nav-white)" stroke="var(--nav-red)" stroke-width="4"/><text x="238" y="327" ' + TX + '>águas seguras · LpL 10s</text>' +
    boia(268, 250, 'var(--nav-red)', '1 · Lp E 3s', 'd') + boia(172, 250, 'var(--nav-green)', '2', 'e') +
    boia(268, 165, 'var(--nav-red)', '3 · Lp E 3s', 'd') + boia(172, 165, 'var(--nav-green)', '4', 'e') +
    '<g transform="translate(70,212)"><circle r="12" fill="none" stroke="var(--ink)" stroke-dasharray="2 3"/><path d="M-5 0 H5 M0 -5 V5" stroke="var(--ink)" stroke-width="2"/></g>' +
    '<rect x="104" y="202" width="12" height="20" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="2"/><rect x="104" y="202" width="12" height="7" fill="var(--ink)"/><rect x="104" y="215" width="12" height="7" fill="var(--ink)"/>' +
    '<text x="16" y="250" ' + TX + '>cardinal E</text><text x="16" y="268" ' + TX + '>R(3) 10s</text>' +
    '<text x="16" y="300" ' + TX + '>verdes 2 e 4 · Lp V 3s</text>' +
    '<text x="290" y="360" ' + TX + '>vindo do mar</text>');

  var FIG_TSS = svg('0 0 440 330', 'Esquema de separação de tráfego: duas vias de sentidos opostos, zona de separação no meio, zona de tráfego costeiro junto à costa e um veleiro cruzando com a proa perpendicular ao fluxo',
    '<rect x="0" y="0" width="440" height="330" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<rect x="0" y="130" width="440" height="30" fill="var(--magenta)" fill-opacity=".18"/>' +
    '<line x1="0" y1="60" x2="440" y2="60" stroke="var(--magenta)" stroke-dasharray="8 6"/><line x1="0" y1="230" x2="440" y2="230" stroke="var(--magenta)" stroke-dasharray="8 6"/>' +
    '<g fill="var(--magenta)"><path d="M60 95 l26 -10 v20 z"/><path d="M200 95 l26 -10 v20 z"/><path d="M380 195 l-26 -10 v20 z"/><path d="M240 195 l-26 -10 v20 z"/></g>' +
    '<g ' + MG + ' stroke-width="3"><line x1="86" y1="95" x2="150" y2="95"/><line x1="226" y1="95" x2="290" y2="95"/><line x1="290" y1="195" x2="354" y2="195"/><line x1="150" y1="195" x2="214" y2="195"/></g>' +
    '<text x="12" y="80" ' + TX + '>via de tráfego</text><text x="12" y="150" ' + TX + ' font-weight="700">zona de separação</text><text x="12" y="222" ' + TX + '>via de tráfego</text>' +
    '<text x="12" y="252" ' + TX + '>zona de tráfego costeiro</text>' +
    '<path d="M0 290 Q120 280 220 292 T440 286 V330 H0 Z" fill="var(--land)"/>' +
    '<line x1="370" y1="262" x2="370" y2="34" stroke="var(--ink)" stroke-width="2.5"/><path d="M370 26 l-7 14 h14 z" fill="var(--ink)"/>' +
    '<line x1="370" y1="262" x2="404" y2="34" stroke="var(--ink)" stroke-dasharray="4 4"/>' +
    '<path d="M370 270 l-6 14 h12 z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<text x="250" y="24" ' + TX + '>proa a 90° do fluxo</text><text x="300" y="316" ' + TX + '>caminho no fundo</text>');

  var FIG_ASPECTO = svg('0 0 440 220', 'Aspecto das luzes de um navio: de frente, mostrando o boreste e mostrando o bombordo, pela posição das duas luzes de mastro e das luzes de bordos',
    '<g><rect x="0" y="0" width="140" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<circle cx="70" cy="40" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/><circle cx="70" cy="80" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<circle cx="54" cy="120" r="7" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="2"/><circle cx="86" cy="120" r="7" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="2"/>' +
    '<text x="70" y="196" ' + TX + ' text-anchor="middle">vem na sua</text><text x="70" y="214" ' + TX + ' text-anchor="middle">direção</text></g>' +
    '<g transform="translate(150,0)"><rect x="0" y="0" width="140" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<circle cx="40" cy="40" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/><circle cx="96" cy="78" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<circle cx="104" cy="120" r="7" fill="var(--nav-green)" stroke="var(--ink)" stroke-width="2"/>' +
    '<path d="M20 150 H120" stroke="var(--ink)"/><path d="M128 150 l-12 -6 v12 z" fill="var(--ink)"/>' +
    '<text x="70" y="196" ' + TX + ' text-anchor="middle">vai para a</text><text x="70" y="214" ' + TX + ' text-anchor="middle">sua direita</text></g>' +
    '<g transform="translate(300,0)"><rect x="0" y="0" width="140" height="170" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<circle cx="100" cy="40" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/><circle cx="44" cy="78" r="7" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<circle cx="36" cy="120" r="7" fill="var(--nav-red)" stroke="var(--ink)" stroke-width="2"/>' +
    '<path d="M120 150 H20" stroke="var(--ink)"/><path d="M12 150 l12 -6 v12 z" fill="var(--ink)"/>' +
    '<text x="70" y="196" ' + TX + ' text-anchor="middle">vai para a</text><text x="70" y="214" ' + TX + ' text-anchor="middle">sua esquerda</text></g>');

  var FIG_R19 = svg('0 0 440 352', 'Regra 19(d): com contato só pelo radar, evite guinar para bombordo por causa de embarcação por ante-a-vante do través e evite guinar na direção de embarcação no través ou por ante-a-ré',
    '<rect x="0" y="0" width="440" height="352" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M100 170 A120 120 0 0 1 340 170 Z" fill="var(--magenta)" fill-opacity=".14" stroke="var(--magenta)"/>' +
    '<path d="M100 170 A120 120 0 0 0 340 170 Z" fill="none" stroke="var(--ink)" stroke-dasharray="4 4"/>' +
    '<line x1="70" y1="170" x2="370" y2="170" stroke="var(--ink)"/><text x="372" y="166" ' + TX + '>través</text>' +
    '<path d="M220 146 l-9 22 q9 6 18 0 z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/>' +
    '<circle cx="290" cy="90" r="7" fill="var(--magenta)"/><text x="302" y="106" fill="var(--magenta)">contato</text>' +
    '<text x="120" y="78" ' + TX + ' font-weight="700">por ante-a-vante do través:</text>' +
    '<text x="120" y="98" ' + TX + '>evite guinar para BB</text><text x="120" y="116" ' + TX + '>(salvo se ela for alcançada)</text>' +
    '<circle cx="160" cy="250" r="7" fill="var(--ink)"/>' +
    '<text x="40" y="318" ' + TX + ' font-weight="700">no través ou por ante-a-ré:</text>' +
    '<text x="40" y="338" ' + TX + '>evite guinar na direção dela</text>');

  M.push({
    id: 'm7', titulo: 'Balizamento e RIPEAM na costa',
    resumo: 'Revisão aplicada do balizamento IALA Região B e do RIPEAM para quem navega na costa: entrada de porto à noite, canais estreitos e esquemas de separação de tráfego (Regras 9 e 10), encontros noturnos pelas luzes, visibilidade restrita (Regra 19) e os sinais sonoros e luminosos.',
    licoes: [
      {
        id: 'l1', titulo: 'Entrando num porto à noite', minutos: 14,
        objetivos: [
          'Aplicar a Região B da IALA na entrada de um porto, de dia e de noite.',
          'Preparar uma lista de luzes antes da aterragem.',
          'Reconhecer pela luz cardinais, perigo isolado, águas seguras e canal preferencial.',
        ],
        blocos: [
          { t: 'p', html: 'Entrar num porto desconhecido à noite é um dos momentos mais exigentes da navegação costeira. As luzes da cidade escondem as do balizamento, a distância engana, boias cegas não aparecem e o cansaço do fim da travessia pesa. O segredo é chegar <b>sabendo o que vai ver</b>: o trabalho é feito antes, com a carta e o Roteiro.' },
          { t: 'termos', ids: ['iala-regiao-b', 'marca-lateral', 'marca-cardinal', 'perigo-isolado', 'aguas-seguras', 'marca-especial'] },
          { t: 'fato', ref: 'extra-mestre-2-05', html: 'O Decreto nº 92.267, de 3 de janeiro de 1986, aprovou o Sistema de Balizamento Marítimo, Região B, da IALA para o balizamento marítimo e de águas interiores do Brasil.' },
          { t: 'fato', ref: 'extra-mestre-2-29', html: 'No Brasil, a direção convencional do balizamento é sempre a de quem vem do mar e, na navegação fluvial, a de quem sobe o rio.' },
          { t: 'fato', ref: 'extra-mestre-2-28', html: 'Quando os sinais de um canal são numerados, o balizamento encarnado recebe números ímpares e o verde, números pares, em ordem crescente a partir da entrada do porto; os alinhamentos são identificados por letras.' },
          { t: 'figura', svg: FIG_CANAL, legenda: 'Entrando do mar na Região B: encarnadas (ímpares) por boreste, verdes (pares) por bombordo, numeração crescendo para dentro. A cardinal E manda passar a leste dela, longe da pedra. Esquema fictício, fora de escala.' },
          { t: 'h', txt: 'Antes de chegar: a lista de luzes' },
          { t: 'p', html: 'Com a carta de maior escala, o Roteiro e a Lista de Faróis, monte uma tabela com os sinais na ordem em que vão aparecer. Para o porto da figura (o mesmo da carta de treino do app):' },
          { t: 'tabela', cab: ['Sinal', 'Característica', 'O que significa', 'Deixar por'], linhas: [
            ['Farol de aterragem', 'Lp(2) 10s', 'Primeira luz a aparecer; confirma a aterragem', '—'],
            ['Boia de águas seguras', 'LpL 10s', 'Início do canal; águas navegáveis em volta', 'Qualquer bordo (de preferência por BB, seguindo a Regra 9)'],
            ['Boias 1 e 3', 'Lp E 3s', 'Lateral de boreste', 'Boreste'],
            ['Boias 2 e 4', 'Lp V 3s', 'Lateral de bombordo', 'Bombordo'],
            ['Cardinal E', 'R(3) 10s', 'Perigo a oeste dela', 'Passe a leste'],
            ['Farolete do molhe', 'Lp E 4s', 'Cabeço do molhe, a boreste', 'Boreste, com folga'],
          ], legenda: 'Anote também: marcação esperada de cada luz, distância entre pares, alinhamento do canal, profundidade mínima e hora da maré.' },
          { t: 'h', txt: 'As luzes que você precisa reconhecer' },
          { t: 'lista', itens: [
            '<b>Laterais:</b> encarnada a boreste, verde a bombordo, para quem vem do mar. Na Região B o “encarnado a boreste” é o contrário da Região A (Europa, África, grande parte da Ásia).',
            '<b>Canal preferencial:</b> luz Lp(2+1). Verde Lp(2+1) num sinal verde com faixa encarnada: canal preferencial a boreste (trate o sinal como lateral de bombordo). Encarnada Lp(2+1) num sinal encarnado com faixa verde: canal preferencial a bombordo.',
            '<b>Cardinais:</b> luz branca rápida (R) ou muito rápida (MR). Pense num relógio: Norte, lampejos contínuos (12 h); Leste, grupo de 3 (3 h); Sul, grupo de 6 mais um lampejo longo (6 h); Oeste, grupo de 9 (9 h). Passe do lado que dá nome à marca.',
            '<b>Perigo isolado:</b> branca, grupo de 2 lampejos. O perigo é pequeno e fica sob a marca; há águas navegáveis em volta.',
            '<b>Águas seguras:</b> branca isofásica, de ocultação, lampejo longo a cada 10 s ou Morse “A”.',
            '<b>Especial:</b> luz amarela. Marca áreas e finalidades especiais (inclusive áreas de recreação). Não é marca de canal.',
            '<b>Novo perigo:</b> balizado como cardinal ou lateral com ritmo R ou MR, e pelo menos um sinal duplicado; pode ter Racon “D”. A boia de destroços de emergência da IALA tem listras verticais azuis e amarelas e luz alternada azul e amarela.',
          ] },
          { t: 'h', txt: 'Na hora da entrada' },
          { t: 'lista', ordenada: true, itens: [
            '<b>Reduza a velocidade</b> e ponha um tripulante só na vigia, com binóculo e a lista de luzes.',
            '<b>Identifique antes de confiar</b>: conte o ritmo e confira a marcação de cada luz. Uma luz parecida, de outro sinal ou de terra, é o erro clássico.',
            '<b>Navegue pela carta, não pelas boias</b>: confira posições por marcação de faróis e alinhamentos, e acompanhe a profundidade.',
            '<b>Não corte caminho</b> entre um par de boias e o seguinte; o canal dragado nem sempre é reto.',
            '<b>Mantenha-se a boreste</b> do canal (Regra 9) e não atrapalhe quem só pode navegar dentro dele.',
            'Se algo não bate, <b>pare de avançar</b>: dê volta em águas seguras, ou fundeie fora do canal e espere o dia.',
          ] },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'porto', modos: ['porto'], porto: 'conduzir', noite: true, tresD: false }, legenda: 'Conduza o barco pelo canal, de noite, só pelas luzes. Depois troque para “decidir” e diga, boia por boia, por que bordo deixar cada uma.' },
          { t: 'check', questoes: [
            q('m7l1-1', 'Balizamento IALA B', 1, 'Entrando num porto brasileiro vindo do mar, você avista a boia encarnada número 7. Por que bordo deixá-la?',
              ['Por boreste.', 'Por bombordo.', 'Por qualquer bordo.', 'Depende do sentido da maré.'], 0,
              'Na Região B, adotada no Brasil, o sinal lateral encarnado fica a boreste de quem vem do mar, e recebe números ímpares. A Região A usa o encarnado a bombordo. A direção convencional não muda com a maré: é sempre a de quem vem do mar (ou sobe o rio).',
              'Decreto 92.267/1986; Miguens, vol. I, itens 13.3.3 e 13.3.4', U.man1),
            q('m7l1-2', 'Balizamento IALA B', 2, 'À noite você vê uma luz branca: seis lampejos rápidos seguidos de um lampejo longo, a cada 15 s. O que é e por onde passar?',
              ['Cardinal Sul: passe ao sul dela.', 'Cardinal Norte: passe ao norte dela.', 'Perigo isolado: passe a qualquer lado, longe.', 'Águas seguras: passe junto dela.'], 0,
              'R(6)+LpL 15s é a cardinal Sul (o “6 horas” do relógio), e a cardinal indica o quadrante por onde passar: ao sul. A Norte tem lampejos contínuos; o perigo isolado tem grupo de 2; águas seguras tem isofásica, ocultação, lampejo longo de 10 s ou Morse “A”.',
              'Lista de Faróis, item 4.2; IALA, Sistema de Balizamento Marítimo, Região B', U.lf),
            q('m7l1-3', 'Balizamento IALA B', 2, 'Num ponto em que o canal se divide, você vê um sinal verde com uma larga faixa encarnada e luz verde Lp(2+1). Vindo do mar, como proceder para seguir o canal preferencial?',
              ['Deixar o sinal por bombordo: o canal preferencial fica a boreste.', 'Deixar o sinal por boreste: o canal preferencial fica a bombordo.', 'Passar ao norte do sinal.', 'Ignorar: é uma marca especial.'], 0,
              'É o sinal de canal preferencial a boreste (bombordo modificado): ele é tratado como lateral de bombordo, deixado por BB, e o canal principal segue por BE. O encarnado com faixa verde é que indica canal preferencial a bombordo. Passar “ao norte” vale para cardinais; marca especial é amarela.',
              'Miguens, vol. I, item 13.3.2; NORMAM-601/DHN', U.man1),
          ] },
          { t: 'fontes', itens: [
            { txt: 'NORMAM-211/DPC, Anexo 5-A, item 2.1, alíneas g), h), l) e p) (programa)', url: U.normam, ref: 'extra-mestre-2-04' },
            { txt: 'Decreto nº 92.267/1986 (IALA Região B no Brasil)', url: U.decIala, ref: 'extra-mestre-2-05' },
            man('cap. 13, itens 13.3.2 a 13.3.4 e Apêndice C'),
            { txt: 'Lista de Faróis (DH2), 40ª ed., itens 4.1 e 4.2 (Região B)', url: U.lf },
            { txt: 'IALA, R1001 — Sistema de Balizamento Marítimo, Ed. 2.0', url: U.iala },
          ] },
        ],
      },
      {
        id: 'l2', titulo: 'Canais estreitos e esquemas de separação de tráfego', minutos: 12,
        objetivos: [
          'Aplicar a Regra 9 num canal estreito ou via de acesso.',
          'Usar, cruzar ou evitar um esquema de separação de tráfego (Regra 10).',
          'Entender o que significa “não dificultar a passagem”.',
        ],
        blocos: [
          { t: 'p', html: 'Perto dos portos, o veleiro divide o espaço com navios que não podem sair do canal nem parar. O RIPEAM tem duas regras para isso: a <b>Regra 9</b> (canais estreitos e vias de acesso) e a <b>Regra 10</b> (esquemas de separação de tráfego). As duas valem também para quem está à vela.' },
          { t: 'termos', ids: ['canal-estreito', 'esquema-de-separacao-de-trafego', 'ripeam'] },
          { t: 'h', txt: 'Regra 9: canais estreitos' },
          { t: 'lista', itens: [
            '<b>(a)</b> Navegue o mais perto possível e seguro do limite do canal que estiver a seu <b>boreste</b>.',
            '<b>(b)</b> Embarcações com menos de 20 m e embarcações a vela <b>não devem interferir</b> na passagem de quem só pode navegar com segurança dentro do canal. Vale contra a Regra 18: no canal, o veleiro não tem preferência sobre o navio que depende dele.',
            '<b>(d)</b> Não cruze o canal se isso interferir na passagem dessa embarcação. Ela pode soar o sinal de dúvida (cinco apitos curtos e rápidos) se não entender a sua intenção.',
            '<b>(e)</b> Ultrapassagem que exija manobra de quem é alcançado: use os sinais da Regra 34(c) (lição 5).',
            '<b>(f)</b> Perto de curva ou obstáculo que esconda outras embarcações, redobre a atenção e soe um apito longo (Regra 34(e)).',
            '<b>(g)</b> Evite fundear em canal estreito.',
          ] },
          { t: 'h', txt: 'Regra 10: esquemas de separação de tráfego' },
          { t: 'p', html: 'Um esquema de separação de tráfego (ESTr, em inglês TSS) funciona como uma rodovia de mão dupla: duas <b>vias de tráfego</b> de sentidos opostos, uma <b>zona</b> (ou linha) <b>de separação</b> no meio e, às vezes, uma <b>zona de tráfego costeiro</b> entre o esquema e a costa. Aparecem nas cartas em magenta. A Regra 10 se aplica aos esquemas adotados pela IMO e não dispensa nenhuma outra regra.' },
          { t: 'figura', svg: FIG_TSS, legenda: 'Ao cruzar, a proa fica o mais perto possível de 90° com o fluxo, mesmo que a corrente faça o caminho no fundo sair oblíquo. Assim você cruza no menor tempo e os navios entendem a sua intenção. Esquema fora de escala.' },
          { t: 'lista', itens: [
            '<b>Usando o esquema (b):</b> siga na via apropriada, no sentido geral do fluxo; fique o mais longe possível da linha ou zona de separação; entre e saia pelas extremidades ou, se for pelos lados, com o menor ângulo possível em relação ao fluxo.',
            '<b>Cruzando (c):</b> evite; se precisar, cruze com rumo o mais próximo possível da perpendicular ao fluxo. No texto inglês da COLREG a palavra é <i>heading</i>: é a <b>proa</b> que fica a 90°.',
            '<b>Zona de tráfego costeiro (d):</b> quem pode usar a via apropriada com segurança não deve usá-la; mas embarcações com menos de 20 m, <b>a vela</b> e de pesca podem. Qualquer uma pode usá-la para ir ou sair de um porto ou lugar dentro dela, ou para evitar perigo imediato.',
            '<b>Zona de separação (e):</b> não entre nela nem cruze a linha, exceto para cruzar o esquema, em emergência ou para pescar dentro dela.',
            '<b>Extremidades (f, g):</b> cuidado redobrado e evite fundear ali ou dentro do esquema.',
            '<b>Fora do esquema (h):</b> se não vai usá-lo, passe longe, com a maior margem possível.',
            '<b>(j)</b> Embarcação com menos de 20 m ou a vela <b>não deve dificultar</b> a passagem segura de embarcação de propulsão mecânica que navega numa via de tráfego.',
          ] },
          { t: 'callout', tipo: 'nota', titulo: '“Não dificultar” é agir cedo', html: 'A Regra 8(f) explica: quem está obrigado a não dificultar a passagem de outra embarcação deve manobrar <b>com bastante antecedência</b>, deixando espaço de sobra, antes que surja risco de abalroamento. Se mesmo assim as duas chegarem a uma situação de risco, as regras de governo valem por inteiro para as duas.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Onde você vai encontrar', html: 'Em travessias e fretamentos no exterior, os esquemas mais famosos são os do Estreito de Dover, de Gibraltar e do Cabo Finisterra, na rota de quem desce a costa da Europa rumo às Canárias. Nos cursos RYA, cruzar um TSS em ângulo reto é questão certa de prova.' },
          { t: 'callout', tipo: 'dica', titulo: 'Na costa brasileira', html: 'Antes de entrar num porto movimentado, confira na carta e no Roteiro os canais, fundeadouros e eventuais rotas ou esquemas de tráfego, e leia as normas da Capitania (NPCP). Fundeadouros de navios e canais de acesso são áreas de segurança (módulo 6, lição 6).' },
          { t: 'check', questoes: [
            q('m7l2-1', 'RIPEAM: regras de governo', 2, 'Você precisa cruzar um esquema de separação de tráfego num veleiro, com corrente de través. Como fazer, segundo a Regra 10(c)?',
              ['Cruzar com a proa o mais perto possível de 90° com o fluxo de tráfego.', 'Cruzar com o caminho no fundo perpendicular, corrigindo a proa contra a corrente.', 'Entrar na via e seguir o fluxo até achar um espaço.', 'Cruzar em ângulo de 45°, para ser visto por mais tempo.'], 0,
              'A Regra 10(c) manda cruzar com rumo o mais próximo possível da perpendicular ao fluxo; o texto inglês diz heading (proa). Assim o tempo dentro do esquema é mínimo e a intenção fica clara para os navios. Corrigir a proa contra a corrente aumenta o tempo de cruzamento; seguir a via não é cruzar; 45° prolonga a exposição.',
              'RIPEAM, Regra 10(c)', U.ripeam),
            q('m7l2-2', 'RIPEAM: regras de governo', 2, 'Num canal estreito, um navio que só pode navegar dentro dele vem em sentido contrário. Você está à vela. O que manda o RIPEAM?',
              ['O navio deve manobrar, porque veleiro tem preferência sobre propulsão mecânica (Regra 18).', 'Você não deve interferir na passagem dele e deve se manter a boreste do canal.', 'Os dois devem guinar para bombordo.', 'Você deve fundear no canal até ele passar.'], 1,
              'A Regra 9(b) determina que embarcações a vela e as de menos de 20 m não interfiram na passagem de quem só pode navegar com segurança dentro do canal, e a 9(a) manda navegar junto ao limite de boreste. A Regra 18 vale “exceto quando as Regras 9, 10 e 13 dispõem em contrário”. Guinar para BB contraria a 9(a), e a 9(g) manda evitar fundear em canal estreito.',
              'RIPEAM, Regras 9 e 18', U.ripeam),
            q('m7l2-3', 'RIPEAM: regras de governo', 1, 'Um veleiro de 10 m pode usar a zona de tráfego costeiro de um esquema de separação?',
              ['Não, nunca.', 'Sim: embarcações com menos de 20 m, a vela e de pesca podem usá-la.', 'Só em emergência.', 'Só se estiver a motor.'], 1,
              'A Regra 10(d)(I) permite que embarcações com menos de 20 m, embarcações a vela e as engajadas na pesca usem a zona de tráfego costeiro. As outras só podem usá-la em casos como os da 10(d)(II): ir ou sair de um porto ou lugar dentro dela, ou evitar perigo imediato.',
              'RIPEAM, Regra 10(d)', U.ripeam),
          ] },
          { t: 'fontes', itens: [
            rip('Regras 8(f), 9, 10 e 18'),
            man('cap. 15, item 15.3'),
          ] },
        ],
      },
      {
        id: 'l3', titulo: 'Encontros à noite: ler as luzes e decidir', minutos: 14,
        objetivos: [
          'Descobrir, pelas luzes, o tipo da outra embarcação e para onde ela vai.',
          'Avaliar o risco de abalroamento pela marcação.',
          'Decidir quem manobra e como, de acordo com as Regras 12 a 18.',
        ],
        blocos: [
          { t: 'p', html: 'De noite, a outra embarcação é só um punhado de luzes. Elas dizem três coisas: <b>o que ela é</b> (luzes e marcas da Parte C), <b>para onde está apontando</b> (quais luzes de bordos e de mastro você vê) e, com o tempo, <b>se há risco</b> (a marcação dela muda ou não).' },
          { t: 'termos', ids: ['luzes-de-navegacao', 'luz-de-mastro', 'luzes-de-bordos', 'luz-de-alcancado', 'risco-de-abalroamento', 'hierarquia-de-manobra'] },
          { t: 'h', txt: 'Para onde ela aponta' },
          { t: 'lista', itens: [
            '<b>Verde</b> (luz de boreste): você está do lado de boreste dela. <b>Encarnada</b>: do lado de bombordo. <b>As duas</b>: ela vem na sua direção.',
            '<b>Só uma luz branca baixa</b> (de alcançado): você está pela popa dela, a mais de 22,5° por ante-a-ré do través. Se você estiver se aproximando, é <b>você</b> quem ultrapassa.',
            '<b>Duas luzes de mastro</b> (navios de 50 m ou mais): a de ré é mais alta. Se as duas aparecem alinhadas na vertical, ela está aproada para você. Se a mais alta está à esquerda da mais baixa, ela segue para a sua direita (e você vê a verde); se está à direita, ela segue para a sua esquerda (e você vê a encarnada). Uma mudança no espaçamento das duas mostra a guinada antes de qualquer outra coisa.',
          ] },
          { t: 'figura', svg: FIG_ASPECTO, legenda: 'Três aspectos de um navio com duas luzes de mastro (a de ré, mais alta). Esquema; distâncias exageradas.' },
          { t: 'h', txt: 'Existe risco?' },
          { t: 'p', html: 'Tire marcações sucessivas da luz com a bússola de mão (ou mire por um ponto fixo do barco, como um brandal). Se a marcação <b>não muda de forma apreciável</b> enquanto a distância diminui, presuma risco de abalroamento (Regra 7(d)). Na dúvida, presuma que existe risco (Regra 7(a)). Mesmo com marcação mudando, pode haver risco com navios grandes ou a curta distância.' },
          { t: 'h', txt: 'Quem manobra' },
          { t: 'lista', itens: [
            '<b>Ultrapassagem (Regra 13):</b> quem alcança se mantém fora do caminho do alcançado, seja quem for, inclusive um veleiro alcançando um navio.',
            '<b>Hierarquia (Regra 18):</b> propulsão mecânica dá passagem a sem governo, com manobra restrita, engajada na pesca e a vela; o veleiro dá passagem a sem governo, com manobra restrita e engajada na pesca. Vale exceto quando as Regras 9, 10 e 13 dispõem em contrário.',
            '<b>Dois veleiros (Regra 12):</b> vento de bordos diferentes, manobra quem recebe o vento por bombordo; mesmo bordo, manobra quem está a barlavento.',
            '<b>Dois motores (Regras 14 e 15):</b> roda a roda, as duas guinam para boreste; rumos cruzados, manobra quem vê a outra por boreste.',
            '<b>Veleiro motorando</b> é embarcação de propulsão mecânica para o RIPEAM: luz de mastro acesa, e ele perde a “preferência” de veleiro.',
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'À noite, o veleiro é quase invisível', html: 'As luzes de um barco pequeno têm alcance curto (Regra 22) e se perdem no mar e nas luzes da costa. Não conte que o navio viu você. Se é você quem manobra, faça cedo e de forma franca (Regra 16), para a manobra aparecer no radar dele. Se é você quem mantém rumo e velocidade, esteja pronto para manobrar sozinho quando ficar claro que a outra não vai agir (Regra 17(b)). Refletor radar, AIS e lanterna tricolor no tope (Regra 25(b), para menos de 20 m) ajudam muito.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { modo: 'desafio' }, legenda: 'Desafio de luzes: identifique o tipo da embarcação e o aspecto dela só pelo que aparece no escuro.' },
          { t: 'widget', w: 'regras-governo', opts: { modo: 'desafio' }, legenda: 'Desafio de regras de governo: diga se há risco, quem manobra e qual a manobra, nos encontros sorteados.' },
          { t: 'check', questoes: [
            q('m7l3-1', 'RIPEAM: luzes e marcas', 2, 'À noite, à vela, você vê pela proa uma única luz branca baixa, e a distância diminui devagar. O que fazer?',
              ['Manter rumo e velocidade: veleiro tem preferência.', 'Manobrar: você está alcançando a outra embarcação e deve se manter fora do caminho dela.', 'Soar um apito longo a cada 2 minutos.', 'Esperar que ela dê passagem, porque é de propulsão mecânica.'], 1,
              'Ver só a luz de alcançado significa estar pela popa dela, a mais de 22,5° por ante-a-ré do través: você é o alcançador (Regra 13(b)). E a Regra 13(a) vale qualquer que seja a embarcação, por isso prevalece sobre a hierarquia da Regra 18. Apito longo a cada 2 min é sinal de visibilidade restrita.',
              'RIPEAM, Regras 13 e 21(c)', U.ripeam),
            q('m7l3-2', 'RIPEAM: regras de governo', 1, 'Como saber, à noite, se há risco de abalroamento com um navio que se aproxima?',
              ['Pelo brilho das luzes: se aumenta, há risco.', 'Pela marcação: se não muda de forma apreciável enquanto ele se aproxima, presuma risco.', 'Pela cor da luz de mastro.', 'Só pelo VHF.'], 1,
              'A Regra 7(d)(I) manda presumir risco quando a marcação de quem se aproxima não se altera de modo apreciável. O brilho não mede distância (a Lista de Faróis faz a mesma advertência para faróis). A luz de mastro é sempre branca. O VHF ajuda, mas não substitui a avaliação da marcação.',
              'RIPEAM, Regra 7', U.ripeam),
            q('m7l3-3', 'RIPEAM: luzes e marcas', 2, 'Você vê as duas luzes de mastro de um navio, com a mais alta à esquerda da mais baixa, e uma luz verde. O que isso indica?',
              ['Ele vem direto para você.', 'Ele segue para a sua direita, mostrando o boreste.', 'Ele segue para a sua esquerda, mostrando o bombordo.', 'Ele está fundeado.'], 1,
              'A luz de mastro de ré é a mais alta (Regra 23(a)). Se ela aparece à esquerda, a proa do navio aponta para a sua direita; e a luz verde confirma que você vê o boreste dele. Vindo direto, as duas luzes ficariam alinhadas, com verde e encarnada. Fundeado, ele mostraria luzes circulares brancas de fundeio.',
              'RIPEAM, Regras 21 e 23', U.ripeam),
          ] },
          { t: 'fontes', itens: [
            rip('Regras 7, 12 a 18, 21 a 23 e 25'),
            man('cap. 15, itens 15.3 e 15.4'),
          ] },
        ],
      },
      {
        id: 'l4', titulo: 'Visibilidade restrita: Regra 19 e sinais de cerração', minutos: 12,
        objetivos: [
          'Aplicar a Regra 19 quando não há contato visual.',
          'Saber que sinais sonoros dar e reconhecer os dos outros na cerração.',
          'Preparar o barco para navegar com nevoeiro, chuva forte ou bruma.',
        ],
        blocos: [
          { t: 'p', html: 'Cerração, chuva pesada, bruma de fim de tarde: a visibilidade cai e os navios viram ecos de radar e apitos. As regras de “embarcações no visual uma da outra” (12 a 18) deixam de valer, e entra a <b>Regra 19</b>, para embarcações fora do visual uma da outra, dentro ou perto de uma área de visibilidade restrita.' },
          { t: 'termos', ids: ['visibilidade-restrita', 'velocidade-de-seguranca', 'sinais-sonoros', 'radar', 'ais'] },
          { t: 'h', txt: 'O que a Regra 19 manda' },
          { t: 'lista', itens: [
            '<b>(b)</b> Velocidade segura, adaptada à visibilidade. Embarcação de propulsão mecânica com máquinas prontas para manobra imediata.',
            '<b>(c)</b> Cumprir as regras de conduta em qualquer condição (Regras 4 a 10), com atenção à visibilidade.',
            '<b>(d)</b> Quem detecta outra só pelo radar deve avaliar se há situação de grande proximidade ou risco, e manobrar com antecedência. Se a manobra for guinada, evite, sempre que possível: guinar para <b>bombordo</b> por causa de embarcação <b>por ante-a-vante do través</b> (salvo se ela estiver sendo alcançada); e guinar <b>na direção</b> de embarcação no través ou por ante-a-ré dele.',
            '<b>(e)</b> Ao ouvir o sinal de cerração de outra aparentemente por ante-a-vante do través (ou sem poder evitar grande proximidade com outra por ante-a-vante), reduza a velocidade ao mínimo que lhe permita manter o rumo; se necessário, tire todo o seguimento, e navegue com extrema cautela até passar o perigo.',
          ] },
          { t: 'figura', svg: FIG_R19, legenda: 'Regra 19(d) num desenho: o meio círculo por ante-a-vante do través (magenta) e a metade de ré (tracejada). Esquema.' },
          { t: 'h', txt: 'Os sinais de cerração (Regra 35)' },
          { t: 'tabela', cab: ['Quem', 'Sinal', 'Intervalo máximo'], linhas: [
            ['Propulsão mecânica com seguimento', '1 longo', '2 min'],
            ['Propulsão mecânica parada, sem seguimento', '2 longos (cerca de 2 s entre eles)', '2 min'],
            ['A vela, sem governo, manobra restrita, restrita pelo calado, pesca, rebocando', '1 longo + 2 curtos', '2 min'],
            ['Rebocada (a última, se guarnecida)', '1 longo + 3 curtos', '2 min'],
            ['Fundeada', 'sino rápido por cerca de 5 s (pode somar curto-longo-curto no apito)', '1 min'],
            ['De 12 m a menos de 20 m', 'pode dispensar o sino, mas dá outro sinal sonoro eficiente', '2 min'],
            ['Menos de 12 m', 'pode dar outro sinal sonoro eficaz no lugar dos acima', '2 min'],
          ], legenda: 'Apito curto: cerca de 1 s; longo: 4 a 6 s (Regra 32). Os sinais valem de dia e de noite.' },
          { t: 'fato', ref: 'tecnico-10', html: 'A NORMAM-211 exige apito em todas as embarcações, exceto as miúdas.' },
          { t: 'fato', ref: 'tecnico-12', html: 'A NORMAM-211 exige sino ou buzina manual nas embarcações classificadas para navegação costeira ou oceânica.' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'cerracao', sinal: 'v3' }, legenda: 'Ouça os sinais de cerração. Comece pelo do veleiro (um longo e dois curtos) e compare com o do navio com seguimento.' },
          { t: 'h', txt: 'Preparando o barco' },
          { t: 'lista', itens: [
            'Luzes de navegação acesas: as luzes do RIPEAM também são exibidas de dia em visibilidade restrita (Regra 20(c)).',
            'Radar ligado e vigiado; AIS recebendo (e, se tiver, transmitindo). Refletor radar içado.',
            'Posição na carta a intervalos curtos; estimada mantida, porque os pontos de terra somem.',
            'Motor pronto e tripulação com colete. Um vigia na proa, longe do ruído do motor, para ouvir.',
            'Se possível, saia da rota dos navios: águas mais rasas, fora de canais e de esquemas de tráfego. Fundear fora do canal e esperar é uma decisão de bom marinheiro.',
          ] },
          { t: 'check', questoes: [
            q('m7l4-1', 'RIPEAM: sinais sonoros e luminosos', 2, 'Na cerração, você ouve o apito de um navio aparentemente por ante-a-vante do seu través. Ainda não sabe se há risco. O que manda a Regra 19(e)?',
              ['Manter rumo e velocidade, por ser veleiro.', 'Reduzir a velocidade ao mínimo que permita manter o rumo e, se necessário, tirar todo o seguimento.', 'Guinar imediatamente para bombordo.', 'Responder com cinco apitos curtos.'], 1,
              'Salvo quando já se determinou que não há risco, a Regra 19(e) manda reduzir a velocidade ao mínimo que permita manter o rumo, tirar todo o seguimento se necessário e navegar com extrema cautela. Em visibilidade restrita não há “preferência” de veleiro (as Regras 12 a 18 são para quem está no visual). Guinar para BB por causa de alguém por ante-a-vante é justamente o que a 19(d) manda evitar. Cinco curtos é sinal de dúvida entre embarcações no visual.',
              'RIPEAM, Regra 19(e)', U.ripeam),
            q('m7l4-2', 'RIPEAM: regras de governo', 3, 'Só pelo radar, você detecta um navio por ante-a-vante do través, por boreste, em rota de grande proximidade. Ele não está sendo alcançado por você. Se decidir guinar, o que evitar?',
              ['Guinar para boreste.', 'Guinar para bombordo.', 'Reduzir a velocidade.', 'Guinar com antecedência.'], 1,
              'A Regra 19(d)(I) manda evitar guinar para bombordo em relação a embarcação por ante-a-vante do través, exceto se ela estiver sendo alcançada. Guinar para BE, reduzir a velocidade e agir com antecedência são ações permitidas e até recomendadas.',
              'RIPEAM, Regra 19(d)', U.ripeam),
            q('m7l4-3', 'RIPEAM: sinais sonoros e luminosos', 1, 'Qual o sinal de cerração de um veleiro de 11 m navegando à vela?',
              ['Um apito longo a cada 2 minutos.', 'Um longo e dois curtos a cada 2 minutos, ou outro sinal sonoro eficaz no mesmo intervalo.', 'Dois longos a cada 2 minutos.', 'Sino rápido por 5 s a cada minuto.'], 1,
              'Embarcação a vela soa um longo e dois curtos a intervalos de no máximo 2 min (Regra 35(c)); com menos de 12 m ela pode, em vez disso, dar outro sinal sonoro eficaz no mesmo intervalo (35(j)). Um longo é de propulsão mecânica com seguimento; dois longos, parada; o sino é de fundeada.',
              'RIPEAM, Regra 35(c) e (j)', U.ripeam),
          ] },
          { t: 'fontes', itens: [
            rip('Regras 19, 20(c), 32 e 35'),
            { txt: 'NORMAM-211/DPC (equipamentos: apito, sino ou buzina)', url: U.normam, ref: 'tecnico-12' },
            man('cap. 15, itens 15.3 e 15.5'),
          ] },
        ],
      },
      {
        id: 'l5', titulo: 'Sinais sonoros e luminosos de manobra e advertência', minutos: 12,
        objetivos: [
          'Reconhecer os sinais de manobra e de advertência das Regras 34 e 36.',
          'Saber quais sinais um veleiro dá e quais só os navios a motor dão.',
          'Conhecer a consequência legal de descumprir o RIPEAM.',
        ],
        blocos: [
          { t: 'p', html: 'Com as embarcações no visual uma da outra, os apitos “falam”: dizem a manobra que está sendo feita, pedem passagem num canal, mostram dúvida, avisam de uma curva cega. É linguagem curta e universal. Apito <b>curto</b> dura cerca de 1 s; <b>longo</b>, de 4 a 6 s (Regra 32).' },
          { t: 'termos', ids: ['sinais-sonoros', 'apito', 'sinais-de-perigo'] },
          { t: 'h', txt: 'Sinais de manobra (Regra 34(a) e (b))' },
          { t: 'tabela', cab: ['Apito', 'Luz (opcional)', 'Significado'], linhas: [
            ['1 curto', '1 lampejo', 'Estou guinando para boreste'],
            ['2 curtos', '2 lampejos', 'Estou guinando para bombordo'],
            ['3 curtos', '3 lampejos', 'Estou dando a ré'],
          ], legenda: 'Regra 34(a): dados pela embarcação de propulsão mecânica, no visual de outra, quando manobra como as regras autorizam ou mandam. Regra 34(b): qualquer embarcação pode reforçá-los com luz circular branca visível a pelo menos 5 milhas; lampejos de cerca de 1 s, intervalo de cerca de 1 s entre lampejos e pelo menos 10 s entre sinais.' },
          { t: 'p', html: 'Um veleiro <b>à vela</b> não dá os sinais da Regra 34(a), que são da embarcação de propulsão mecânica. Motorando, ele é propulsão mecânica e passa a dá-los. Os demais sinais da Regra 34 valem para qualquer embarcação.' },
          { t: 'h', txt: 'Canal estreito, dúvida e curva' },
          { t: 'tabela', cab: ['Situação', 'Sinal'], linhas: [
            ['Quero ultrapassá-lo por seu boreste (canal estreito)', '2 longos + 1 curto'],
            ['Quero ultrapassá-lo por seu bombordo (canal estreito)', '2 longos + 2 curtos'],
            ['Concordo com a ultrapassagem (quem é alcançado)', 'longo, curto, longo, curto'],
            ['Não entendo sua intenção / duvido que sua manobra baste', 'pelo menos 5 curtos e rápidos (pode somar 5 lampejos)'],
            ['Aproximando-me de curva ou obstáculo que esconde o canal', '1 longo (respondido com 1 longo)'],
          ], legenda: 'Regra 34(c), (d) e (e). Em canal estreito, quem é alcançado e tem dúvida pode dar o sinal de dúvida (Regra 9(e)).' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'manobra' }, legenda: 'Ouça os sinais de manobra e de advertência e depois passe ao desafio: reconheça pelo som ou escolha o sinal certo para a situação.' },
          { t: 'h', txt: 'Chamar a atenção (Regra 36)' },
          { t: 'p', html: 'Para atrair a atenção de outra embarcação, qualquer uma pode usar sinal sonoro ou luminoso que não se confunda com outro sinal do RIPEAM, ou apontar o holofote <b>na direção do perigo</b>, sem ofuscar ninguém. Evite luzes intermitentes de grande intensidade ou rotativas, como as estroboscópicas. Veleiro com menos de 7 m e sem as luzes completas deve ter à mão uma lanterna de luz branca, mostrada a tempo de evitar o abalroamento (Regra 25(d)).' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Sinais de perigo são outra coisa', html: 'Os sinais de perigo (Regra 37 e Anexo IV) servem só para pedir socorro: Mayday no rádio, alerta DSC, foguetes e fachos encarnados, fumaça laranja, toque contínuo do apito de cerração, entre outros. Usá-los fora de uma situação de perigo é proibido (Anexo IV, item 2). Eles são estudados no módulo de segurança e salvatagem.' },
          { t: 'fato', ref: 'normas-148', html: 'Descumprir regra do RIPEAM pode render multa do grupo D ou suspensão da habilitação por até 60 dias, segundo a NORMAM-211.' },
          { t: 'fato', ref: 'tecnico-08', html: 'A NORMAM-211 determina que todas as embarcações, inclusive as de esporte e recreio, a vela ou a motor, atendam ao RIPEAM-72 e às suas emendas, inclusive quanto às luzes de navegação.' },
          { t: 'check', questoes: [
            q('m7l5-1', 'RIPEAM: sinais sonoros e luminosos', 1, 'O que significam cinco ou mais apitos curtos e rápidos?',
              ['Estou dando a ré.', 'Dúvida: não entendo sua intenção ou duvido que sua manobra evite o abalroamento.', 'Sinal de perigo, preciso de socorro.', 'Estou fundeado.'], 1,
              'É o sinal de dúvida da Regra 34(d), que pode ser reforçado com pelo menos cinco lampejos curtos e rápidos. Dar a ré são três curtos; perigo é o toque contínuo do aparelho de cerração (entre outros sinais do Anexo IV); fundeada usa sino em visibilidade restrita.',
              'RIPEAM, Regra 34(d)', U.ripeam),
            q('m7l5-2', 'RIPEAM: sinais sonoros e luminosos', 2, 'Num canal estreito, a embarcação à sua popa soa dois longos e dois curtos. O que ela quer?',
              ['Ultrapassar você por seu boreste.', 'Ultrapassar você por seu bombordo.', 'Avisar que vai dar a ré.', 'Avisar que está sem governo.'], 1,
              'Pela Regra 34(c)(I), dois longos e um curto é “vou ultrapassá-lo por seu boreste”; dois longos e dois curtos, “por seu bombordo”. Se concordar, responda longo-curto-longo-curto e manobre para dar espaço. Dar a ré são três curtos; sem governo não tem sinal de manobra (em visibilidade restrita, longo e dois curtos).',
              'RIPEAM, Regras 9(e) e 34(c)', U.ripeam),
            q('m7l5-3', 'RIPEAM: sinais sonoros e luminosos', 2, 'Ao complementar os sinais de manobra com luz (Regra 34(b)), qual o intervalo mínimo entre sinais sucessivos?',
              ['1 segundo.', '5 segundos.', '10 segundos.', '2 minutos.'], 2,
              'A Regra 34(b)(II) fixa lampejos de cerca de 1 s, intervalo de cerca de 1 s entre lampejos e não menos de 10 s entre sinais sucessivos. 2 minutos é o intervalo máximo dos sinais de cerração; 1 s é a duração do lampejo.',
              'RIPEAM, Regra 34(b)', U.ripeam),
          ] },
          { t: 'flash', deck: 'mestre-2', txt: 'Revise balizamento, Regras 9, 10 e 19 e os sinais sonoros nos flashcards desta parte.' },
          { t: 'fontes', itens: [
            rip('Regras 32, 34, 36, 37 e Anexo IV'),
            { txt: 'NORMAM-211/DPC (infrações ao RIPEAM)', url: U.normam, ref: 'normas-148' },
            man('cap. 15, item 15.5'),
          ] },
        ],
      },
    ],
  });

  VL.dado('cursos/mestre-2', { modulos: M });
})();
