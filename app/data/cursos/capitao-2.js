/* Curso Capitão-Amador — parte 2 (módulos m5 a m7).
   m5 Navegação por satélite e sistemas integrados · m6 Radar · m7 Estabilidade.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, itens 1.3 a), b), c), d), e), f) e 1.4 a), b).
   Fontes técnicas: Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023, cap. 14 Navegação radar) e
   vol. III (DHN, 1ª rev. 2026, cap. 37 Navegação por satélites e cap. 38 Navegação batimétrica); RIPEAM-72 (texto
   consolidado, CCA-IMO); IMO (ECDIS, VTS); Diretiva 2013/53/UE, Anexo I (categorias de projeto); USNA, EN400,
   cap. 4 (estabilidade); World Sailing, Offshore Special Regulations 2026-2027 (extrato).
   Fatos regulatórios só por bloco {t:'fato'} ou fonte com ref (ids de research/_work e de
   research/_work/research_extra_capitao-2.json). Exemplos numéricos conferidos por cálculo (tools do autor).
   Conteúdo: CC BY-SA 4.0. */
(function () {
  'use strict';

  var U = {
    man1: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf',
    man3: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf',
    ripeam: 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf',
    normam: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf',
    imoEcdis: 'https://www.imo.org/en/ourwork/safety/pages/electroniccharts.aspx',
    imoVts: 'https://www.imo.org/en/ourwork/safety/pages/vesseltrafficservices.aspx',
    chmCartas: 'https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas',
    lar: 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-08/LAR-15ED-2026-2030-Completa.pdf',
    portaria22: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/portaria-dhn-dgn-22-2023.html',
    osr: 'https://media.sailing.org/sailing/wp-content/uploads/2025/12/05090814/Extract-Mo1_2026-2027_v1.pdf',
    rcd: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32013L0053',
    usna4: 'https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf',
    ntsb: 'https://www.rvs-bi.de/publications/Reports/RoyalMajesty.pdf'
  };
  function man1(loc, ref) { var o = { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), ' + loc, url: U.man1 }; if (ref) o.ref = ref; return o; }
  function man3(loc, ref) { var o = { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), ' + loc, url: U.man3 }; if (ref) o.ref = ref; return o; }
  function rip(loc, ref) { var o = { txt: 'RIPEAM-72 (texto consolidado, CCA-IMO/Marinha), ' + loc, url: U.ripeam }; if (ref) o.ref = ref; return o; }
  function nor(loc, ref) { var o = { txt: 'NORMAM-211/DPC, ' + loc, url: U.normam }; if (ref) o.ref = ref; return o; }
  function q(id, tema, dif, enunciado, alternativas, correta, explicacao, referencia, url) {
    var o = { id: 'cpa2-' + id, nivel: 'capitao', tema: tema, dificuldade: dif, enunciado: enunciado,
      alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
    if (url) o.fonte_url = url;
    return o;
  }
  /* SVG inline: viewBox, largura 100%, só tokens de cor, texto de 15 unidades (≥ 12 px nas telas de celular
     porque os viewBox têm no máximo ~400 de largura). */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" role="img" style="max-width:' + (maxw || 480) +
      'px;display:block;margin:0 auto;font-size:15px" xmlns="http://www.w3.org/2000/svg"><title>' + titulo + '</title>' + corpo + '</svg>';
  }
  var TX = 'fill="var(--ink)"';
  var MG = 'stroke="var(--magenta)"';
  var SEA = 'fill="var(--sea-1)" stroke="var(--sea-3)"';
  function t(x, y, s, extra) { return '<text x="' + x + '" y="' + y + '" ' + TX + ' ' + (extra || '') + '>' + s + '</text>'; }
  function tm(x, y, s, extra) { return '<text x="' + x + '" y="' + y + '" fill="var(--magenta)" font-weight="700" ' + (extra || '') + '>' + s + '</text>'; }
  function th(x, y, s2, extra) { return '<text x="' + x + '" y="' + y + '" fill="var(--ink)" stroke="var(--sea-1)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ' + (extra || '') + '>' + s2 + '</text>'; }
  function thm(x, y, s2, extra) { return '<text x="' + x + '" y="' + y + '" fill="var(--magenta)" font-weight="700" stroke="var(--sea-1)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ' + (extra || '') + '>' + s2 + '</text>'; }
  /* seta: linha de (x1,y1) a (x2,y2) com ponta em x2,y2 */
  function seta(x1, y1, x2, y2, cor, w, dash) {
    var a = Math.atan2(y2 - y1, x2 - x1), L = 9, d = 0.45;
    var p1 = [x2 - L * Math.cos(a - d), y2 - L * Math.sin(a - d)], p2 = [x2 - L * Math.cos(a + d), y2 - L * Math.sin(a + d)];
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + cor + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>' +
      '<path d="M' + x2 + ' ' + y2 + ' L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z" fill="' + cor + '"/>';
  }

  var M = [];

  /* Faixa de incerteza de uma LDP: retângulo girado. ang = direção da linha (graus, 0 = horizontal). */
  function faixa(cx, cy, ang, meia, comp, cor) {
    return '<rect x="' + (cx - comp / 2) + '" y="' + (cy - meia) + '" width="' + comp + '" height="' + (2 * meia) +
      '" fill="' + (cor || 'var(--sea-3)') + '" fill-opacity="0.45" transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"/>' +
      '<line x1="' + (cx - comp / 2) + '" y1="' + cy + '" x2="' + (cx + comp / 2) + '" y2="' + cy + '" stroke="var(--ink)" stroke-width="1.5" transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"/>';
  }
  /* Paralelogramo de interseção de duas faixas de mesma meia-largura w com direções a1 e a2 (graus). */
  function paralelo(cx, cy, a1, a2, w) {
    var r1 = a1 * Math.PI / 180, r2 = a2 * Math.PI / 180;
    var n1 = [-Math.sin(r1), Math.cos(r1)], n2 = [-Math.sin(r2), Math.cos(r2)];
    var det = n1[0] * n2[1] - n1[1] * n2[0], pts = [];
    [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(function (s) {
      var b1 = s[0] * w, b2 = s[1] * w;
      pts.push((cx + (b1 * n2[1] - b2 * n1[1]) / det).toFixed(1) + ',' + (cy + (n1[0] * b2 - n2[0] * b1) / det).toFixed(1));
    });
    return '<polygon points="' + pts.join(' ') + '" fill="var(--magenta)" fill-opacity="0.55" stroke="var(--magenta)" stroke-width="1.5"/>';
  }
  /* ==================================================================================================
     m5 — Navegação por satélite e sistemas integrados (Anexo 5-A, 1.3 a), c) e f))
     ================================================================================================== */
  var m5 = {
    id: 'm5', titulo: 'Navegação por satélite e sistemas integrados',
    resumo: 'Como funcionam GPS, GLONASS, Galileo e BeiDou, de onde vêm os erros da posição, o que o DGNSS e os sistemas de aumento corrigem, o que são ECDIS, ECS e VTS e, principalmente, como não ficar refém da eletrônica numa travessia oceânica. Programa oficial: NORMAM-211, Anexo 5-A, item 1.3 a), c) e f).',
    licoes: []
  };
  M.push(m5);

  /* ---------- m5 · l1 ---------- */
  function satGlyph(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')"><rect x="-6" y="-6" width="12" height="12" rx="2" fill="var(--sea-3)" stroke="var(--ink)"/>' +
      '<rect x="-22" y="-3" width="14" height="6" fill="var(--sea-2)" stroke="var(--ink)"/><rect x="8" y="-3" width="14" height="6" fill="var(--sea-2)" stroke="var(--ink)"/></g>';
  }
  var P0 = [200, 218], LUPA_R = 66;
  function linhaPerp(ux, uy, cor) {
    // reta perpendicular a u (vetor unitário de P até o satélite) passando por P
    var px = -uy, py = ux, L = 120;
    return '<line x1="' + (P0[0] - px * L).toFixed(1) + '" y1="' + (P0[1] - py * L).toFixed(1) + '" x2="' + (P0[0] + px * L).toFixed(1) + '" y2="' + (P0[1] + py * L).toFixed(1) +
      '" stroke="' + cor + '" stroke-width="2"/>';
  }
  function triangDelta(us, d) {
    // vértices do triângulo formado pelas retas u_i·(x-P) = -d
    var pts = [];
    [[0, 1], [1, 2], [2, 0]].forEach(function (pr) {
      var a = us[pr[0]], b = us[pr[1]], det = a[0] * b[1] - a[1] * b[0];
      var x = (-d * b[1] + d * a[1]) / det, y = (-d * a[0] + d * b[0]) / det;
      pts.push((P0[0] + x).toFixed(1) + ',' + (P0[1] + y).toFixed(1));
    });
    return '<polygon points="' + pts.join(' ') + '" fill="var(--magenta)" fill-opacity="0.18" stroke="var(--magenta)" stroke-width="2.2" stroke-dasharray="6 4"/>';
  }
  var U3 = [[-0.849, -0.527], [0.849, -0.527], [0, 1]];
  var FIG_PSEUDO = svg('0 0 400 322', 'Pseudodistâncias: três distâncias medidas com o mesmo erro de relógio não se cruzam em um ponto',
    '<rect x="0" y="0" width="400" height="128" rx="8" ' + SEA + '/>' +
    satGlyph(70, 30) + satGlyph(200, 24) + satGlyph(330, 30) +
    t(26, 62, 'satélite 1') + t(155, 56, 'satélite 2') + t(286, 62, 'satélite 3') +
    '<g stroke="var(--ink)" stroke-dasharray="4 4" stroke-width="1.3"><line x1="70" y1="38" x2="200" y2="106"/><line x1="200" y1="32" x2="200" y2="102"/><line x1="330" y1="38" x2="200" y2="106"/></g>' +
    '<path d="M180 106 L220 106 L212 120 L188 120 Z" fill="var(--nav-white)" stroke="var(--ink)"/><line x1="200" y1="106" x2="200" y2="88" stroke="var(--ink)" stroke-width="2"/>' +
    t(228, 116, 'receptor') +
    '<defs><clipPath id="c5l1"><circle cx="' + P0[0] + '" cy="' + P0[1] + '" r="' + LUPA_R + '"/></clipPath></defs>' +
    '<circle cx="' + P0[0] + '" cy="' + P0[1] + '" r="' + LUPA_R + '" ' + SEA + '/>' +
    '<g clip-path="url(#c5l1)">' + triangDelta(U3, 24) + linhaPerp(U3[0][0], U3[0][1], 'var(--ink)') + linhaPerp(U3[1][0], U3[1][1], 'var(--ink)') + linhaPerp(U3[2][0], U3[2][1], 'var(--ink)') + '</g>' +
    '<circle cx="' + P0[0] + '" cy="' + P0[1] + '" r="4" fill="var(--ink)"/>' +
    t(P0[0] + 74, P0[1] + 4, 'posição real') +
    t(6, 142, 'Ampliação em torno do ponto real:', 'font-weight="700"') +
    t(6, 296, 'Linha contínua: distância verdadeira.') +
    t(6, 316, 'Tracejada: medida, maior em δ (relógio).'));

  m5.licoes.push({
    id: 'l1', titulo: 'GNSS: quatro sistemas globais, um só princípio', minutos: 12,
    objetivos: [
      'Nomear os quatro sistemas globais (GPS, GLONASS, Galileo e BeiDou) e dizer quem opera cada um.',
      'Explicar como o receptor transforma tempo em distância e por que precisa de quatro satélites.',
      'Dizer o que um receptor multiconstelação ganha e o que a NORMAM-211 exige a bordo numa travessia oceânica.',
    ],
    blocos: [
      { t: 'p', html: 'No curso de Mestre-Amador você usou o <b>GPS</b> como ferramenta. No Capitão-Amador a pergunta muda: <b>o que acontece quando ele erra, e como você descobre?</b> Para responder, é preciso entender o que o aparelho faz por dentro.' },
      { t: 'p', html: '<b>GNSS</b> (<i>Global Navigation Satellite System</i>, Sistema Global de Navegação por Satélite) é o nome da família. O Miguens lembra que o termo é usado para qualquer sistema que dê posição autônoma por satélites em qualquer ponto da Terra. A IMO reúne os sistemas aceitos para uso marítimo no <b>WWRNS</b> (Sistema Mundial de Radionavegação).' },
      { t: 'h', txt: 'Os quatro sistemas globais' },
      { t: 'tabela', cab: ['Sistema', 'Quem opera', 'Constelação', 'Órbita'], linhas: [
        ['<b>GPS</b> (NAVSTAR)', 'Estados Unidos', 'Projetada com 24 satélites; o Miguens informa 31 operacionais', '6 planos, inclinação 55°, cerca de 20.200 km, período de 11 h 58 min'],
        ['<b>GLONASS</b>', 'Rússia', '24 satélites usados na navegação', 'Inclinação 64,8°, cerca de 19.100 km, período de 11 h 15 min'],
        ['<b>Galileo</b>', 'União Europeia', '24 satélites na linha de base, mais reservas', '3 planos, inclinação 56°, 23.222 km, cerca de 14 h'],
        ['<b>BeiDou</b>', 'China', '3 em órbita geoestacionária (GEO), 3 em órbita geossíncrona inclinada (IGSO) e 24 em órbita média (MEO)', 'GEO e IGSO a 35.786 km; MEO a 21.528 km, inclinação 55°'],
      ], legenda: 'Valores do Miguens, vol. III (2026), itens 37.3 a 37.6. As constelações são atualizadas com o tempo: confira os números em fontes recentes antes de citá-los. Existem ainda sistemas regionais, como o NavIC (Índia) e o QZSS (Japão).' },
      { t: 'h', txt: 'Como o aparelho mede a distância' },
      { t: 'p', html: 'Cada satélite transmite a <b>hora exata</b> do envio (seus relógios são atômicos) e a <b>própria posição</b>, na chamada mensagem de navegação (as efemérides). O receptor mede o tempo que o sinal levou para chegar e multiplica pela velocidade das ondas de rádio, cerca de 300.000 km/s. Um atraso de 0,07 s, por exemplo, vale uns 21.000 km de distância.' },
      { t: 'p', html: 'Há um problema: o relógio do receptor é de cristal, bem menos exato que um relógio atômico. Todas as distâncias saem erradas pelo <b>mesmo valor</b>. Por isso se chamam <b>pseudodistâncias</b> (distâncias “aparentes”). O erro de relógio vira uma incógnita a mais.' },
      { t: 'figura', svg: FIG_PSEUDO, legenda: 'Esquema em planta. Com distâncias medidas todas maiores que as verdadeiras, as três linhas (tracejadas) formam um triângulo em volta do ponto real. O receptor ajusta δ até o triângulo fechar num ponto.' },
      { t: 'p', html: 'Resultado: são quatro incógnitas (latitude, longitude, altitude e erro de relógio), logo <b>quatro satélites</b> para a posição em três dimensões. No mar, se a altitude é conhecida, bastariam três. Os receptores usam ainda o efeito Doppler para calcular a velocidade e o rumo no fundo (<b>COG</b> e <b>SOG</b>).' },
      { t: 'callout', tipo: 'nota', titulo: 'Por que a órbita é tão alta', html: 'A cerca de 20.000 km o satélite está acima da atmosfera, o que torna a órbita previsível. Cada satélite GPS passa sobre as estações de controle duas vezes por dia, e o controle corrige as efemérides que ele transmite.' },
      { t: 'h', txt: 'Por que usar mais de um sistema' },
      { t: 'lista', itens: [
        '<b>Mais satélites à vista</b> e melhor espalhados no céu, o que reduz o erro por geometria (próxima lição). O Miguens afirma que, com receptores multiconstelação, o DOP costuma ficar abaixo de 4 na maior parte do planeta.',
        '<b>Redundância:</b> se um sistema falha ou sofre interferência, os outros continuam. O padrão de desempenho da IMO para receptores multissistema (MSC.401(95), para instalações em navios SOLAS a partir de 31/12/2017) prevê o uso de sinais civis de pelo menos dois GNSS independentes.',
        '<b>Frequências duplas:</b> receptores que escutam duas frequências eliminam a maior parte do erro da ionosfera.',
      ] },
      { t: 'h', txt: 'O que a norma exige a bordo' },
      { t: 'fato', ref: 'travessia-116', html: 'Na navegação oceânica, a embarcação de médio porte deve ter <b>2 aparelhos GNSS</b>, e é recomendado que ao menos um tenha fonte de energia independente (pilha ou bateria própria).' },
      { t: 'callout', tipo: 'dica', titulo: 'Dois aparelhos de verdade', html: 'Dois plotters ligados à mesma antena, ao mesmo cabo e à mesma bateria são um aparelho só, na prática. O segundo deve ter antena e alimentação próprias: um GNSS portátil com pilhas ou um telefone com mapa baixado, guardado seco, de preferência dentro de um recipiente blindado contra raios (veja a última lição do módulo).' },
      { t: 'termos', ids: ['gnss', 'rumo-no-fundo', 'datum', 'plotter', 'waypoint'] },
      { t: 'check', questoes: [
        q('m5-l1-q1', 'Navegação eletrônica', 1, 'Qual par de sistema e operador está correto?',
          ['Galileo, operado pela China.', 'BeiDou, operado pela União Europeia.', 'GLONASS, operado pela Rússia.', 'GPS, operado pela Rússia.'], 2,
          'GLONASS é russo. O Galileo é europeu e o BeiDou é chinês (as duas primeiras alternativas trocam os operadores). O GPS (NAVSTAR) é americano.',
          'Miguens, vol. III (2026), itens 37.3 a 37.6'),
        q('m5-l1-q2', 'Navegação eletrônica', 2, 'O relógio do receptor GNSS é de cristal e atrasa ou adianta em relação aos relógios atômicos dos satélites. Qual a consequência?',
          ['As distâncias medidas têm todas o mesmo erro (pseudodistâncias), e o receptor o resolve como uma incógnita adicional.', 'Cada satélite tem um erro diferente, que o receptor corrige com a mensagem de navegação.', 'O receptor só funciona se houver um relógio atômico a bordo.', 'O erro desaparece se o receptor usar apenas dois satélites.'], 0,
          'O erro de relógio é comum a todas as medidas e entra como quarta incógnita junto com latitude, longitude e altitude; por isso se usam quatro satélites. Não é um erro diferente por satélite (os relógios dos satélites são atômicos e controlados). Receptores comuns funcionam com relógio de cristal. Com menos satélites, as incógnitas não se resolvem.',
          'Miguens, vol. III (2026), item 37.3.3'),
        q('m5-l1-q3', 'Navegação eletrônica', 2, 'Qual é a principal vantagem de um receptor que combina GPS, GLONASS, Galileo e BeiDou?',
          ['Mais satélites bem distribuídos no céu (melhor geometria) e redundância caso um sistema falhe ou sofra interferência.', 'Dispensa a carta náutica, porque a posição passa a ser exata.', 'Elimina a necessidade de conhecer o datum.', 'Torna o sinal imune a qualquer tipo de interferência.'], 0,
          'Mais satélites melhoram a geometria (DOP menor) e dão resiliência. Isso não torna a posição exata nem dispensa a carta, e o datum continua importante. Também não torna o sinal imune: a interferência forte pode afetar todas as constelações.',
          'Miguens, vol. III (2026), itens 37.10 (receptores multissistemas e DOP)'),
        q('m5-l1-q4', 'Navegação eletrônica', 2, 'Pela NORMAM-211, quantos aparelhos GNSS uma embarcação de médio porte deve ter na navegação oceânica?',
          ['Um aparelho.', 'Dois aparelhos (recomenda-se que ao menos um tenha fonte de energia independente).', 'Três aparelhos, sendo um sextante eletrônico.', 'Nenhum, se tiver radar.'], 1,
          'A norma pede 1 aparelho na navegação costeira e 2 na oceânica, com a recomendação de energia independente para ao menos um. Um só aparelho vale para a costeira. Não existe a exigência de três nem a troca do GNSS pelo radar.',
          'NORMAM-211/DPC, art. 4.19.2 a) II)', U.normam),
      ] },
      { t: 'fontes', itens: [
        man3('cap. 37, itens 37.2 a 37.6 e 37.10 (GNSS, sistemas e receptores)', 'tecnico-191'),
        nor('art. 4.19.2 a) (dotação de GNSS)', 'travessia-116'),
        { txt: 'IMO — Resolução MSC.401(95) e A.1046(27), descritas em Miguens, vol. III, itens 37.2.1 e 37.10', url: U.man3 },
      ] },
    ],
  });
  /* ---------- m5 · l2 ---------- */
  var FIG_DOP = svg('0 0 400 250', 'Geometria das linhas de posição: cruzamento próximo de 90 graus dá área de incerteza pequena; linhas quase paralelas dão área alongada',
    '<rect x="0" y="0" width="195" height="200" rx="8" ' + SEA + '/>' +
    '<g clip-path="url(#c5l2a)"><defs><clipPath id="c5l2a"><rect x="0" y="0" width="195" height="200" rx="8"/></clipPath></defs>' +
    faixa(98, 100, 0, 11, 190) + faixa(98, 100, 90, 11, 120) + paralelo(98, 100, 0, 90, 11) + '</g>' +
    t(8, 22, 'Boa geometria', 'font-weight="700"') + t(8, 188, 'LDP a cerca de 90°') +
    '<rect x="205" y="0" width="195" height="200" rx="8" ' + SEA + '/>' +
    '<g clip-path="url(#c5l2b)"><defs><clipPath id="c5l2b"><rect x="205" y="0" width="195" height="200" rx="8"/></clipPath></defs>' +
    faixa(302, 100, -10, 11, 190) + faixa(302, 100, 14, 11, 190) + paralelo(302, 100, -10, 14, 11) + '</g>' +
    t(213, 22, 'Má geometria', 'font-weight="700"') + t(213, 188, 'LDP quase paralelas') +
    t(6, 226, 'Mesmo erro de medida em cada linha (faixa azul);') + t(6, 246, 'a área magenta é onde o barco pode estar.'));

  m5.licoes.push({
    id: 'l2', titulo: 'Quão boa é a posição: precisão, DOP e fontes de erro', minutos: 12,
    objetivos: [
      'Distinguir o erro do sinal no espaço (URE) da precisão que o usuário obtém, e ler “95%” corretamente.',
      'Usar o DOP (HDOP, PDOP) para julgar a qualidade de uma posição.',
      'Reconhecer as fontes de erro (geometria, ionosfera, multicaminho, antena, interferência e falsificação) e os sintomas de cada uma.',
    ],
    blocos: [
      { t: 'p', html: 'Uma posição de GNSS vem com três casas decimais na tela, mas isso é <b>apresentação, não exatidão</b>. Navegar no oceano exige saber quanto confiar no número. Esta lição dá as ordens de grandeza e os sinais de alerta.' },
      { t: 'h', txt: 'Três números que não são a mesma coisa' },
      { t: 'lista', itens: [
        '<b>Erro do sinal no espaço (URE).</b> É o quanto o sinal que sai do satélite erra a distância. O GPS se compromete a ficar em 2,0 m ou menos, com 95% de probabilidade; em 2021 o valor real foi de 0,643 m. <i>Isso não é a precisão do seu aparelho.</i>',
        '<b>Precisão do usuário.</b> Depende do URE, da geometria dos satélites, de bloqueios e da qualidade do receptor. O Miguens cita cerca de 4,9 m para um telefone sob céu aberto e 3 m na horizontal (5 m na vertical), em 95% do tempo, para um bom receptor de navegação sem sistema de aumento.',
        '<b>Exigência da IMO para a navegação marítima.</b> Pela Resolução A.1046(27), a posição deve ter erro de no máximo 10 m, com 95% de probabilidade, na entrada e aproximação de portos e em águas costeiras, e de 100 m em águas oceânicas.',
      ] },
      { t: 'callout', tipo: 'nota', titulo: 'O que significa “95%”', html: 'Em 95% das leituras o erro é menor que o valor dado. Em 1 de cada 20 leituras ele pode ser maior. Um erro de 10 m (0,005 milha) vale só 0,1 mm numa carta 1:100.000, menos que a espessura de um traço de lápis. <b>O limite real da navegação costeira não é o GNSS, é a carta:</b> levantamentos antigos e pedras não cartografadas.' },
      { t: 'h', txt: 'O DOP: a nota da geometria' },
      { t: 'p', html: 'O erro final é aproximadamente o erro de cada distância multiplicado por um fator que depende de como os satélites estão distribuídos no céu. Esse fator é o <b>DOP</b> (<i>dilution of precision</i>, diluição da precisão). É a mesma ideia de cruzar linhas de posição na carta: duas LDP que se cruzam a 90° dão um ponto firme; duas LDP quase paralelas dão uma área comprida e incerta.' },
      { t: 'figura', svg: FIG_DOP, legenda: 'Com satélites espalhados no céu, as “linhas” se cruzam em bom ângulo (DOP baixo). Com satélites agrupados na mesma região do céu, o ângulo é fechado (DOP alto).' },
      { t: 'tabela', cab: ['DOP', 'Avaliação', 'O que fazer'], linhas: [
        ['menor que 1', 'Ideal', 'Máxima confiança'],
        ['1 a 2', 'Excelente', 'Serve para quase tudo'],
        ['2 a 5', 'Bom', 'Mínimo adequado para decisões de navegação'],
        ['5 a 10', 'Moderado', 'Pode ser usado em cálculos, com cautela'],
        ['10 a 20', 'Fraco', 'Descarte ou use como posição estimada'],
        ['maior que 20', 'Ruim', 'Erros de até 300 m: descarte'],
      ], legenda: 'Faixas da tabela do Miguens, vol. III (2026), item 37.10. HDOP vale para a posição horizontal, VDOP para a altura, PDOP para as três dimensões e TDOP para o tempo; GDOP junta tudo.' },
      { t: 'h', txt: 'De onde vêm os erros' },
      { t: 'lista', itens: [
        '<b>Geometria ruim:</b> satélites baixos no horizonte ou agrupados. Mais constelações ajudam.',
        '<b>Ionosfera:</b> camada de partículas carregadas que atrasa o sinal. Receptores de duas frequências eliminam a maior parte. A troposfera (vapor d’água) também atrasa o sinal, mas é um efeito menor.',
        '<b>Multicaminho:</b> o sinal chega por dois caminhos, direto e refletido (casco, mastro, guarda-corpo, o cais). Aparece como saltos de posição perto de estruturas.',
        '<b>Antena mal instalada:</b> na sombra do mastro, do radar ou da capota; cabo e conector corroídos. É causa frequente em veleiros.',
        '<b>Manobras de satélites e tempestades solares:</b> raras, mas reais; criam lacunas temporárias.',
        '<b>Interferência (<i>jamming</i>) e falsificação (<i>spoofing</i>):</b> sinais artificiais que bloqueiam o receptor ou fazem o aparelho calcular uma posição falsa. O Miguens cita bloqueio eletromagnético e falsificação entre as causas de perda do GNSS. Há relatos recorrentes em algumas regiões do mundo; leia os Avisos aos Navegantes e as informações locais da rota.',
      ] },
      { t: 'callout', tipo: 'seguranca', titulo: 'Sinais de que o GNSS não merece confiança', html: '1) A posição salta para longe e volta. 2) COG e SOG impossíveis (velocidade de 40 nós num veleiro). 3) Data ou hora erradas. 4) O barco “anda” na tela mas a distância no radar e a profundidade no ecobatímetro não mudam. 5) O DOP sobe ou o número de satélites cai de repente. Aja assim: anote a hora, passe a navegar pela estimada (a partir da última posição boa), compare com radar, profundidade e marcações, e só volte ao GNSS quando os sinais voltarem ao normal.' },
      { t: 'check', questoes: [
        q('m5-l2-q1', 'Navegação eletrônica', 2, 'A Resolução A.1046(27) da IMO fixa, para a posição em águas oceânicas, um erro máximo de:',
          ['10 m com 95% de probabilidade.', '100 m com 95% de probabilidade.', '1 milha com 99% de probabilidade.', '3 m com 100% de probabilidade.'], 1,
          'Em águas oceânicas o erro máximo é 100 m (95%); 10 m (95%) vale para entrada e aproximação de portos e águas costeiras. Nenhum sistema garante 100% de probabilidade, e 1 milha não é o valor fixado.',
          'Miguens, vol. III (2026), item 37.2.1 (Resolução A.953(23), mantida pela A.1046(27))'),
        q('m5-l2-q2', 'Navegação eletrônica', 2, 'O receptor mostra HDOP = 12. O que isso indica?',
          ['A posição horizontal é fraca (geometria ruim) e deve ser descartada ou usada como estimada.', 'A posição é excelente, pois 12 é um número alto.', 'O erro de relógio é de 12 nanossegundos.', 'O DGNSS está ativado com 12 correções.'], 0,
          'DOP é uma diluição da precisão: quanto MAIOR, PIOR. De 10 a 20 a avaliação é “fraco”. Não é erro de relógio nem número de correções.',
          'Miguens, vol. III (2026), item 37.10 (Acurácia do GNSS: os DOPs)'),
        q('m5-l2-q3', 'Navegação eletrônica', 2, 'O GPS se compromete com um URE de 2,0 m (95%). Esse valor é:',
          ['A precisão que qualquer receptor de bordo terá.', 'O erro de distância do sinal que sai do satélite, não a precisão final do usuário.', 'A precisão da carta náutica.', 'O erro do DGNSS.'], 1,
          'O URE mede a exatidão da distância calculada com o sinal transmitido. A precisão do usuário ainda depende da geometria (DOP), do bloqueio de sinal, da atmosfera e do receptor. A carta e o DGNSS são outras coisas.',
          'Miguens, vol. III (2026), item 37.3.4'),
        q('m5-l2-q4', 'Navegação eletrônica', 2, 'Seu GNSS mostra o veleiro a 8 nós, mas a distância ao farol no radar não muda e a sonda indica profundidade constante. A conduta mais prudente é:',
          ['Confiar no GNSS, porque é o instrumento mais exato.', 'Desconfiar da posição, passar à navegação estimada e conferir com radar, sonda e marcações.', 'Desligar o radar, que deve estar errado.', 'Aumentar a velocidade para ver se o GNSS acompanha.'], 1,
          'Sinais independentes (radar e sonda) contradizem o GNSS: pode ser falha, interferência ou falsificação. A prática é anotar a hora, seguir pela estimada e verificar tudo. Confiar só no GNSS foi a causa de encalhes famosos. Desligar o radar elimina a prova independente.',
          'Miguens, vol. III (2026), cap. 37 e cap. 39 (práticas de navegação)'),
      ] },
      { t: 'fontes', itens: [
        man3('cap. 37, itens 37.2.1, 37.3.4 e 37.10 (acurácia, URE e DOP)', 'tecnico-191'),
        { txt: 'GPS.gov — GPS Accuracy (compromissos do GPS Standard Positioning Service)', url: 'https://archive.gps.gov/systems/gps/performance/accuracy/' },
      ] },
    ],
  });
  /* ---------- m5 · l3 ---------- */
  var FIG_DGNSS = svg('0 0 400 300', 'DGNSS: estação de referência em um radiofarol compara a posição conhecida com a posição dos satélites e transmite correções ao navio',
    '<rect x="0" y="0" width="400" height="300" rx="8" ' + SEA + '/>' +
    '<path d="M300 150 Q340 140 400 150 L400 300 L330 300 Q300 230 300 150 Z" fill="var(--land)" stroke="var(--ink)"/>' +
    satGlyph(60, 30) + satGlyph(170, 26) +
    '<g stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 4"><line x1="60" y1="38" x2="150" y2="200"/><line x1="170" y1="34" x2="150" y2="200"/><line x1="60" y1="38" x2="338" y2="142"/><line x1="170" y1="34" x2="338" y2="142"/></g>' +
    '<circle cx="338" cy="150" r="170" fill="none" ' + MG + ' stroke-width="1.5" stroke-dasharray="7 5"/>' +
    '<path d="M330 150 L338 118 L346 150 Z" fill="var(--nav-white)" stroke="var(--ink)"/><rect x="335" y="108" width="6" height="10" fill="var(--ink)"/>' +
    seta(318, 146, 178, 198, 'var(--magenta)', 2.5) +
    '<path d="M130 200 L170 200 L162 215 L138 215 Z" fill="var(--nav-white)" stroke="var(--ink)"/><line x1="150" y1="200" x2="150" y2="178" stroke="var(--ink)" stroke-width="2"/>' +
    th(20, 244, 'navio com receptor DGNSS') +
    th(262, 70, 'radiofarol com') + th(262, 90, 'estação (ER)') +
    thm(188, 148, 'correções', 'transform="rotate(20 188 148)"') +
    t(12, 290, 'Raio de cerca de 200 M por estação'));

  m5.licoes.push({
    id: 'l3', titulo: 'Datum, DGNSS, sistemas de aumento e integridade', minutos: 11,
    objetivos: [
      'Verificar o datum da carta e do receptor e saber o que acontece se forem diferentes.',
      'Explicar o que o DGNSS corrige, como as correções chegam ao navio e como é a rede brasileira.',
      'Diferenciar DGNSS, SBAS e monitoramento de integridade (RAIM) e saber os limites de cada um.',
    ],
    blocos: [
      { t: 'h', txt: 'Datum: a régua tem que ser a mesma' },
      { t: 'p', html: 'O GNSS dá posição no sistema geodésico <b>WGS-84</b>. Latitude e longitude só têm sentido junto com o <b>datum</b> (o modelo da forma da Terra em que foram calculadas). Se a carta foi levantada em outro datum, o ponto vai parar no lugar errado, e o erro não aparece no aparelho: aparece no encalhe.' },
      { t: 'fato', ref: 'tecnico-146', html: 'O CHM orienta usar o datum <b>WGS-84</b> no GPS e no programa de visualização das cartas raster, e lembra que o uso de cartas raster não dispensa as cartas em papel atualizadas.' },
      { t: 'lista', itens: [
        'Leia a <b>nota de datum</b> no título da carta. As cartas atuais da DHN usam o WGS-84 (confirme na nota de cada carta); as antigas podem trazer a correção a aplicar. O Miguens diz que em geral são correções pequenas, mas elas importam mais nas cartas de escala grande.',
        'Muitos receptores têm a função <i>datum shift</i> e mostram a posição em outro datum. <b>Não use essa função</b> para “bater” com a carta: configure o WGS-84 no aparelho e aplique a correção da carta, se houver.',
        'Quando o datum da carta é desconhecido, desconfie e abra margem de segurança na rota.',
      ] },
      { t: 'h', txt: 'DGNSS: corrigindo o que a estação em terra consegue medir' },
      { t: 'p', html: 'No <b>DGNSS</b> (GNSS diferencial) uma <b>estação de referência</b> (ER) em ponto de coordenadas exatamente conhecidas, em geral num radiofarol, mede as distâncias aos satélites e as compara com as distâncias que deveria obter. A diferença é uma <b>correção</b> para cada satélite. O navio, perto da estação, sofre quase os mesmos erros, e ao aplicar as correções cancela os que são comuns: erro de órbita, erro de relógio dos satélites e atrasos da ionosfera e da troposfera.' },
      { t: 'figura', svg: FIG_DGNSS, legenda: 'A estação conhece a própria posição. Tudo que os satélites disserem diferente disso é erro e vira correção, transmitida em ondas médias.' },
      { t: 'p', html: 'O que o DGNSS <b>não</b> corrige: erros locais do navio, como multicaminho e ruído do receptor. As correções são transmitidas sem codificação nas frequências dos radiofaróis marítimos (283,5 a 325 kHz), com alcance útil de cerca de 200 a 250 milhas. A exatidão obtida é melhor que 10 m, e a velocidade fica com precisão de 0,1 nó (Miguens). O navio precisa de um receptor de correções e de um GNSS que aceite a entrada.' },
      { t: 'fato', ref: 'extra-mestre-3-23', html: 'Segundo a Lista de Auxílios-Rádio, o Brasil tem <b>11 estações de referência DGPS</b> em radiofaróis da Marinha. Perto da estação a exatidão é melhor que 2 m (95% do tempo), com degradação de 11,5 ppm da distância à estação (cerca de 1 m a cada 87 km).' },
      { t: 'callout', tipo: 'nota', titulo: 'DGPS está saindo de cena', html: 'Os Estados Unidos desativaram seu serviço de DGPS marítimo entre 2018 e 2020, a Austrália em 2020 e o Reino Unido em 2022, porque o GNSS sem correção e os sistemas de aumento já bastam para a aproximação de portos. O Brasil mantém sua rede (DGPS e DGNSS, com GPS e GLONASS nas estações modernizadas). Para um veleiro de cruzeiro, ela é um reforço costeiro, não algo de que se dependa no oceano.' },
      { t: 'h', txt: 'Sistemas de aumento e integridade' },
      { t: 'p', html: 'O <b>SBAS</b> (<i>Satellite-Based Augmentation System</i>) usa satélites geoestacionários para transmitir correções e avisos de integridade. Exemplos: WAAS (EUA), EGNOS (Europa), GAGAN (Índia) e MSAS (Japão). A cobertura é <b>regional</b>: numa travessia você entra e sai delas. Outros sistemas de aumento por estações em terra são classificados como GBAS; o DGNSS dos radiofaróis é um deles.' },
      { t: 'p', html: '<b>Integridade</b> é a capacidade do sistema de avisar a tempo que a informação não deve ser usada. A precisão diz “quão perto”; a integridade diz “posso confiar agora?”. Dois mecanismos importam para o navegante:' },
      { t: 'lista', itens: [
        '<b>Alertas do sistema</b> (SBAS e satélites avisam quando um satélite está com defeito).',
        '<b>RAIM</b> (<i>Receiver Autonomous Integrity Monitoring</i>): o próprio receptor usa satélites além do mínimo para conferir se as medidas são coerentes entre si. Com 5 satélites ele consegue <i>detectar</i> que algo está errado; com 6 consegue ainda <i>excluir</i> o satélite defeituoso. Se a geometria não permite, o aparelho deve avisar que a verificação não está disponível.',
      ] },
      { t: 'callout', tipo: 'seguranca', titulo: 'O plotter de recreio muitas vezes mostra a posição mesmo sem integridade', html: 'A IMO exige dos receptores de navios que indiquem a qualidade e a confiabilidade dos dados e deem alerta quando não puderem avaliá-las. Aparelhos de recreio nem sempre fazem isso de forma clara. Faça você mesmo a checagem: veja o número de satélites, o HDOP, a mensagem de status (<i>fix</i>, <i>DGPS</i>, <i>no fix</i>) e confronte com a estimada.' },
      { t: 'check', questoes: [
        q('m5-l3-q1', 'Navegação eletrônica', 2, 'O DGNSS consegue corrigir, principalmente:',
          ['Erros comuns ao navio e à estação de referência, como órbita, relógio dos satélites e atrasos atmosféricos.', 'O multicaminho causado pelos cabos e pelo mastro do próprio navio.', 'Um datum errado na carta.', 'A falta de satélites visíveis.'], 0,
          'A estação e o navio, relativamente próximos, veem o mesmo erro de órbita, de relógio e de atmosfera, e a correção os cancela. O multicaminho é local do navio. O datum da carta é outro problema. Sem satélites visíveis não há medida a corrigir.',
          'Miguens, vol. III (2026), item 37.9.1'),
        q('m5-l3-q2', 'Navegação eletrônica', 3, 'Para que um receptor GNSS consiga pelo menos DETECTAR a falha de um satélite pelo método RAIM, é preciso que veja, no mínimo:',
          ['3 satélites.', '4 satélites.', '5 satélites.', '12 satélites.'], 2,
          'Com 4 satélites só se resolvem as 4 incógnitas, sem sobra para conferir. Com 5 há redundância e o receptor percebe a inconsistência (detecção); com 6 é possível excluir o satélite defeituoso. Não são necessários 12.',
          'Stanford GPS Lab — Receiver Autonomous Integrity Monitoring', 'https://scpnt.stanford.edu/research/early-pntgps-research/receiver-autonomous-integrity-monitoring-raim'),
        q('m5-l3-q3', 'Navegação eletrônica', 2, 'Seu GNSS está em WGS-84 e a carta de papel antiga traz a nota “Datum: Córrego Alegre”, sem correção publicada. O procedimento prudente é:',
          ['Ativar no GNSS a função de mudança de datum e confiar plenamente na posição plotada.', 'Considerar o possível deslocamento, abrir margem de segurança e conferir a posição com marcações, radar e sonda.', 'Ignorar o datum, porque o GNSS é exato.', 'Plotar a latitude no datum da carta e a longitude em WGS-84.'], 1,
          'Não conhecendo a diferença exata, a margem de segurança e as conferências visuais protegem. Mudar o datum do aparelho sem conhecer os parâmetros troca um erro por outro. Ser exato em WGS-84 não ajuda se a carta está em outro datum. Latitude e longitude devem estar no mesmo datum.',
          'Miguens, vol. III (2026), item 37.3.4; CHM — Cartas Náuticas', U.chmCartas),
        q('m5-l3-q4', 'Navegação eletrônica', 2, 'A rede brasileira de estações DGNSS/DGPS nos radiofaróis cobre, em torno de cada estação, um raio da ordem de:',
          ['20 milhas.', '200 milhas.', '2.000 milhas.', '2 milhas.'], 1,
          'As correções são transmitidas por ondas médias com alcance útil de cerca de 200 milhas, o que cobre a faixa costeira. A 2.000 milhas não há cobertura; 2 e 20 milhas subestimam o alcance.',
          'Miguens, vol. III (2026), item 37.9.2'),
      ] },
      { t: 'fontes', itens: [
        man3('cap. 37, itens 37.3.4 (datum), 37.8 (SBAS e GBAS), 37.9 (DGNSS) e 37.10 (requisitos de receptores)', 'tecnico-191'),
        { txt: 'CHM — Lista de Auxílios-Rádio (DH8-15), cap. 9 (DGPS)', url: U.lar, ref: 'extra-mestre-3-23' },
        { txt: 'CHM — Cartas Náuticas (datum WGS-84 e cartas raster)', url: U.chmCartas, ref: 'tecnico-146' },
        { txt: 'Stanford GPS Lab — Receiver Autonomous Integrity Monitoring (RAIM)', url: 'https://scpnt.stanford.edu/research/early-pntgps-research/receiver-autonomous-integrity-monitoring-raim' },
      ] },
    ],
  });
  /* ---------- m5 · l4 ---------- */
  var FIG_CONTORNO = svg('0 0 400 270', 'Contorno de segurança em uma carta eletrônica: a rota planejada cruza a linha e o sistema dispara alarme',
    '<rect x="0" y="0" width="400" height="230" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>' +
    '<path d="M0 0 H160 Q140 36 96 46 Q44 58 0 48 Z" fill="var(--land)" stroke="var(--ink)"/>' +
    '<path d="M150 98 Q192 56 258 72 Q326 92 308 162 Q282 214 206 204 Q138 176 150 98 Z" fill="var(--sea-3)" fill-opacity="0.55" ' + MG + ' stroke-width="3"/>' +
    '<path d="M178 112 Q204 86 248 98 Q290 112 276 156 Q258 184 214 178 Q168 160 178 112 Z" fill="var(--sea-3)" fill-opacity="0.8" stroke="var(--ink)" stroke-width="1"/>' +
    th(206, 120, '2 m', 'font-weight="700" text-anchor="middle"') + th(172, 48, 'menos de 5 m') +
    '<line x1="20" y1="222" x2="380" y2="104" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="9 6"/>' +
    '<circle cx="166" cy="174" r="11" fill="var(--nav-yellow)" stroke="var(--ink)" stroke-width="2"/>' + t(162, 180, '!', 'font-weight="700"') +
    th(14, 196, 'rota planejada') + thm(206, 222, 'contorno de segurança') +
    t(6, 254, 'O alarme dispara antes da área rasa.'));

  m5.licoes.push({
    id: 'l4', titulo: 'ECDIS, ECS e VTS: o que são e onde terminam', minutos: 12,
    objetivos: [
      'Diferenciar carta ENC, carta raster, ECDIS e ECS (plotter), e dizer quais a NORMAM-211 aceita a bordo.',
      'Configurar e interpretar as proteções de um sistema de cartas (contorno de segurança, qualidade dos dados, escala).',
      'Explicar o que é um VTS e um sistema integrado de navegação, e quais os riscos de depender deles.',
    ],
    blocos: [
      { t: 'p', html: 'O programa de Capitão-Amador pede “conceitos básicos de sistemas integrados de navegação (ECDIS, ECS, VTS, GNSS)”. Você não vai operar um ECDIS de navio num veleiro, mas vai usar o primo dele, o plotter, e precisa saber o que ele garante e o que não garante.' },
      { t: 'h', txt: 'Quem é quem na carta eletrônica' },
      { t: 'tabela', cab: ['Termo', 'O que é', 'Observação para o veleiro'], linhas: [
        ['<b>ENC</b> (carta náutica eletrônica)', 'Dados vetoriais oficiais de uma carta (profundidades, perigos, balizas, como objetos com atributos), no padrão da OHI (hoje S-57, em transição para o S-101).', 'A DHN distribui as ENC só por distribuidores do IC-ENC, não para download gratuito.'],
        ['<b>Carta raster</b>', 'Imagem digital (“foto”) da carta de papel, em arquivos BSB/KAP.', 'A DHN oferece as raster gratuitamente; não dispensam a carta de papel atualizada.'],
        ['<b>ECDIS</b>', 'Sistema de exibição de cartas e informações que cumpre as normas de desempenho da IMO, usa ENC oficiais atualizadas e pode substituir a carta de papel num navio SOLAS.', 'Obrigatório por fases (2012 a 2018) em navios maiores, conforme a SOLAS V/19.'],
        ['<b>ECS</b> (sistema de cartas eletrônicas)', 'Sistema de cartas que não cumpre todos os requisitos do ECDIS: é o plotter de recreio, com cartas oficiais ou comerciais.', 'A NORMAM-211 aceita um ECS como atendendo à exigência de ter cartas a bordo.'],
        ['<b>VTS</b> (serviço de tráfego de embarcações)', 'Serviço em terra, prestado por uma autoridade, que monitora o tráfego em portos e canais movimentados.', 'Regulado no Brasil pela NORMAM-602/DHN.'],
      ] },
      { t: 'fato', ref: 'tecnico-147', html: 'As ENC da DHN são distribuídas <b>exclusivamente</b> por distribuidores do IC-ENC (centro regional operado pelo UKHO), não para download gratuito.' },
      { t: 'fato', ref: 'extra-mestre-2-01', html: 'As embarcações de esporte e recreio, exceto as miúdas, devem ter a bordo cartas náuticas das regiões onde pretendem operar, em local acessível; um <b>Sistema de Cartas Eletrônicas (ECS)</b> pode ser aceito para cumprir essa exigência.' },
      { t: 'fato', ref: 'tecnico-153', html: 'O CHM afirma que as cartas náuticas em papel, com as demais publicações, continuam sendo o documento náutico oficial para a navegação.' },
      { t: 'p', html: 'A IMO descreve o ECDIS como um sistema “complexo, relevante para a segurança, baseado em software e com muitas opções de exibição e integração”. Essa descrição vale para o seu plotter: <b>o que aparece na tela depende de configurações</b>.' },
      { t: 'h', txt: 'O que um bom sistema de cartas faz por você' },
      { t: 'lista', itens: [
        '<b>Posição do seu barco</b> sobre a carta, com rumo e velocidade no fundo, atualizada pelo GNSS.',
        '<b>Monitoramento da rota</b>: desvio lateral (XTE), distância ao ponto, tempo estimado de chegada.',
        '<b>Contorno de segurança:</b> uma isóbata que você escolhe (calado + folga + maré). O sistema avisa se a rota ou a projeção do barco cruzar essa linha.',
        '<b>Sobreposição de radar e AIS</b> sobre a carta, com o vetor dos alvos.',
      ] },
      { t: 'figura', svg: FIG_CONTORNO, legenda: 'Exemplo ilustrativo (não é uma carta real). O contorno de segurança está em 5 m; a área mais escura está abaixo de 2 m.' },
      { t: 'h', txt: 'Armadilhas que o plotter esconde' },
      { t: 'lista', itens: [
        '<b>Configuração padrão não é a sua.</b> Muitos sistemas vêm com contorno de segurança calibrado para navios grandes (valores como 30 m). Ajuste ao calado do veleiro. Lembre que o sistema só pode usar contornos que existem nos dados: se você pede 8 m e a carta só tem 5 m e 10 m, ele usa 10 m.',
        '<b>Informação escondida.</b> A informação mínima do “display base” não pode ser desligada, mas o resto sim. Limpar demais a tela esconde sondas, pedras e cabos. Ligue “todas as informações” ao planejar a rota.',
        '<b>Zoom engana.</b> Aproximar a imagem além da escala dos dados dá impressão de precisão que a carta não tem (sistemas sérios mostram aviso de “escala excedida”).',
        '<b>Qualidade do levantamento.</b> As ENC trazem a zona de confiança dos dados (A1, A2, B, C, D ou não avaliada). Em muitas regiões, inclusive costeiras, a sondagem é antiga ou espaçada: pedras podem não estar lá.',
        '<b>Atualização.</b> Carta eletrônica sem correção é tão perigosa quanto carta de papel velha. Anote a data da última atualização e leia os Avisos aos Navegantes.',
        '<b>Datum e GNSS</b> (lição anterior) continuam valendo.',
      ] },
      { t: 'h', txt: 'VTS: alguém olhando o tráfego' },
      { t: 'p', html: 'Os <b>serviços de tráfego de embarcações</b> contribuem, segundo a SOLAS (capítulo V, regra 12), para a segurança da vida no mar, a segurança e a eficiência da navegação e a proteção do meio ambiente. Os governos os criam onde o volume de tráfego ou o risco justifica. As diretrizes da IMO os dividem em serviço de informação, organização do tráfego e assistência à navegação. Na prática, ao entrar na área de um VTS, você avisa por VHF, no canal indicado na carta ou no Roteiro, e escuta as instruções.' },
      { t: 'fato', ref: 'extra-capitao-2-04', html: 'As normas da Autoridade Marítima para o Serviço de Tráfego de Embarcações (VTS) são a <b>NORMAM-602/DHN</b> (antes NORMAM-26/DHN), em vigor desde 2 de outubro de 2023.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'O VTS vê, mas não pilota seu barco', html: 'Você continua responsável pela vigilância (RIPEAM, Regra 5) e pelas regras de governo. Um veleiro pequeno pode aparecer mal no radar do VTS. Cruze canais de navegação rapidamente e em ângulo próximo do reto, e informe o VTS se tiver dúvida.' },
      { t: 'h', txt: 'Sistemas integrados: poder e ponto único de falha' },
      { t: 'p', html: 'Um <b>sistema integrado de navegação</b> (INS) combina posição, radar, AIS, cartas, piloto automático e sensores (vento, profundidade, rumo) numa só plataforma. A IMO tem padrões de desempenho para os INS de navios (Resolução MSC.252(83)). Num veleiro, a integração é feita por redes como NMEA 0183 e NMEA 2000.' },
      { t: 'lista', itens: [
        '<b>Vantagem:</b> uma só imagem da situação (barco, rota, alvos, alarmes) e menos trabalho manual.',
        '<b>Risco:</b> um erro na fonte se espalha por todos os sistemas. O mesmo GNSS alimenta plotter, piloto automático, AIS, rádio DSC e radar. Se ele falha ou erra, tudo falha ou erra junto.',
        '<b>Risco:</b> a rota digitada no plotter pode ir direto ao piloto automático. Confira o rumo no mapa antes de engajar o piloto.',
        '<b>Risco:</b> alarmes demais (ou desligados) viram ruído. Escolha os poucos que importam e deixe-os ligados.',
      ] },
      { t: 'check', questoes: [
        q('m5-l4-q1', 'Navegação eletrônica', 2, 'Segundo a NORMAM-211, um Sistema de Cartas Eletrônicas (ECS) a bordo de uma embarcação de esporte e recreio:',
          ['Pode ser aceito como atendendo à exigência de ter as cartas náuticas das regiões de operação a bordo.', 'É proibido, pois só o ECDIS é permitido.', 'Substitui o ECDIS dos navios SOLAS.', 'Dispensa os Avisos aos Navegantes.'], 0,
          'A norma aceita o ECS para cumprir a exigência de cartas a bordo. Não é proibido. Não substitui o ECDIS em navios SOLAS, e nenhuma carta eletrônica dispensa a atualização por Avisos aos Navegantes.',
          'NORMAM-211/DPC, art. 4.20', U.normam),
        q('m5-l4-q2', 'Navegação eletrônica', 2, 'No plotter, você ajustou o contorno de segurança para 4 m, mas os dados da carta só têm as isóbatas de 2 m e 10 m. O que o sistema usará?',
          ['O contorno de 2 m, porque é o mais próximo de 4 m.', 'O de 10 m, o próximo contorno mais fundo existente nos dados.', 'Nenhum contorno de segurança.', 'Uma isóbata interpolada de 4 m.'], 1,
          'O contorno de segurança é um contorno que existe nos dados; se o valor pedido não existe, usa-se o próximo mais fundo, por prudência (10 m). Usar o de 2 m seria menos seguro, e o sistema não inventa uma isóbata interpolada.',
          'Prática dos sistemas de cartas eletrônicas (IHO S-52); IMO — Electronic Charts', U.imoEcdis),
        q('m5-l4-q3', 'Navegação eletrônica', 1, 'O VTS (serviço de tráfego de embarcações) é:',
          ['Um serviço em terra, prestado por uma autoridade, que monitora e orienta o tráfego em áreas movimentadas.', 'Um tipo de EPIRB para veleiros.', 'A carta de papel oficial do porto.', 'Um sistema de piloto automático.'], 0,
          'O VTS é um serviço de terra da autoridade, para segurança e eficiência do tráfego e proteção do ambiente (SOLAS V/12). Não é equipamento de bordo, carta ou piloto automático.',
          'IMO — Vessel Traffic Services; SOLAS V/12', U.imoVts),
        q('m5-l4-q4', 'Navegação eletrônica', 2, 'Qual é o maior risco de um sistema integrado em que um único GNSS alimenta plotter, piloto automático, AIS e rádio DSC?',
          ['O consumo de energia aumentar.', 'Um erro ou falha do GNSS se espalhar por todos os sistemas ao mesmo tempo.', 'A carta eletrônica ficar mais lenta.', 'O AIS deixar de funcionar com o radar ligado.'], 1,
          'O ponto único de falha faz com que um erro de posição afete o piloto, o AIS e o alerta de socorro simultaneamente. Os outros itens não são o risco principal.',
          'Miguens, vol. III (2026), cap. 37; IMO MSC.252(83)'),
      ] },
      { t: 'fontes', itens: [
        { txt: 'IMO — Electronic Nautical Charts (ENC) and ECDIS (SOLAS V/19, desempenho e fases de instalação)', url: U.imoEcdis },
        { txt: 'IMO — Vessel Traffic Services (SOLAS V/12 e diretrizes A.1158(32))', url: U.imoVts },
        { txt: 'IMO — Resolução MSC.252(83), padrões de desempenho de sistemas integrados de navegação', url: 'https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MSCResolutions/MSC.252(83).pdf' },
        { txt: 'CHM — Cartas Náuticas (ENC e raster)', url: U.chmCartas, ref: 'tecnico-147' },
        nor('art. 4.20 (publicações a bordo; ECS)', 'extra-mestre-2-01'),
        { txt: 'Portaria DHN/DGN/MB nº 22/2023 (NORMAM-602/DHN, VTS)', url: U.portaria22, ref: 'extra-capitao-2-04' },
      ] },
    ],
  });
  /* ---------- m5 · l5 ---------- */
  function barra(y, n, texto, fill) {
    return '<rect x="20" y="' + y + '" width="360" height="42" rx="6" fill="' + fill + '" stroke="var(--ink)" stroke-width="1.2"/>' +
      '<text x="36" y="' + (y + 26) + '" ' + TX + ' font-weight="700">' + n + '</text>' +
      '<text x="62" y="' + (y + 26) + '" ' + TX + '>' + texto + '</text>';
  }
  var FIG_CAMADAS = svg('0 0 400 230', 'Camadas de navegação: GNSS, instrumentos independentes, estimada com carta de papel e astronomia',
    barra(8, '1', 'GNSS e plotter: rápido e preciso', 'var(--sea-1)') +
    barra(58, '2', 'Radar, sonda e AIS: sem satélite', 'var(--sea-2)') +
    barra(108, '3', 'Estimada na carta de papel', 'var(--sea-3)') +
    barra(158, '4', 'Sextante e cronômetro: sem eletrônica', 'var(--sea-3)') +
    '<path d="M390 52 L390 190" stroke="var(--magenta)" stroke-width="2"/><path d="M390 196 L383 184 L397 184 Z" fill="var(--magenta)"/>' +
    t(20, 222, 'Uma camada confere a outra.'));

  m5.licoes.push({
    id: 'l5', titulo: 'Dependência da eletrônica: navegar em camadas', minutos: 12,
    objetivos: [
      'Aprender com um caso real por que uma posição de GNSS precisa ser conferida por uma fonte independente.',
      'Montar um plano de navegação em camadas, com a estimada sempre em dia e o plano B de cada equipamento.',
      'Listar falhas típicas do material eletrônico de bordo e o que fazer em cada uma.',
    ],
    blocos: [
      { t: 'p', html: 'O oceano castiga a eletrônica: sal, umidade, vibração, raios, falta de energia. Ao mesmo tempo, a eletrônica deixou a navegação tão fácil que dá vontade de parar de pensar. O programa pede que você conheça os sistemas <b>e seus limites</b>. Esta lição trata do limite mais perigoso: confiar demais.' },
      { t: 'h', txt: 'Um caso: o Royal Majesty (1995)' },
      { t: 'p', html: 'O navio de passageiros <i>Royal Majesty</i> saiu das Bermudas rumo a Boston. Pouco depois da saída, o cabo da antena do GPS se soltou e o aparelho passou a funcionar por <b>estima</b> (<i>dead reckoning</i>), sem sinal de satélite. O piloto automático seguiu essa “posição” sem vento, sem corrente e sem correção. Cerca de 34 horas depois, o navio encalhou nos baixios de Nantucket, cerca de 17 milhas a oeste do rumo que os oficiais imaginavam.' },
      { t: 'p', html: 'O relatório da NTSB (agência americana de investigação) aponta como causa provável a <b>confiança excessiva</b> na automação, falhas de projeto e de procedimento do sistema integrado e a omissão do segundo oficial, que não agiu diante de vários sinais de que estava fora do rumo. Havia um Loran-C funcionando, o procedimento mandava conferir os dois a cada hora, e ninguém reparou na diferença. As boias foram “identificadas” de forma duvidosa, a água mudou de cor e o alarme de profundidade estava no valor do porto (0 m), por isso não tocou.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'As quatro lições do caso', html: '1) Uma posição só vale quando confirmada por uma fonte <b>independente</b>. 2) Aparelho em modo estimado ou com aviso de “dados inválidos” não é posição. 3) A estimada que você mantém é a rede de proteção que o piloto automático não tem. 4) Ao sair do porto, <b>reajuste os alarmes</b> (sonda, rota, âncora, CPA).' },
      { t: 'h', txt: 'Navegar em camadas' },
      { t: 'figura', svg: FIG_CAMADAS, legenda: 'Cada camada é conferida pela outra. As camadas 2 a 4 não dependem do satélite.' },
      { t: 'lista', itens: [
        '<b>Camada 1, GNSS e plotter:</b> é a base do dia a dia. Dois aparelhos independentes (exigência da NORMAM-211 na navegação oceânica para embarcação de médio porte).',
        '<b>Camada 2, instrumentos que não usam satélite:</b> radar (distância a terra), ecobatímetro (profundidade e relevo do fundo), agulha e odômetro/log.',
        '<b>Camada 3, estimada:</b> posição estimada na carta de papel, a partir da última posição boa, com rumo, velocidade, tempo, corrente e vento. Em travessia, não deixe de plotar.',
        '<b>Camada 4, astronomia:</b> sextante, cronômetro e Almanaque Náutico (veja o módulo de Navegação Astronômica). É o único método que dá posição sem eletrônica nem rede.',
      ] },
      { t: 'h', txt: 'Rotina de bordo (sugestão de prática)' },
      { t: 'tabela', cab: ['Quando', 'O que registrar', 'Com que comparar'], linhas: [
        ['A cada posição de GNSS (na costa, a cada 15 a 30 min; no oceano, a cada hora ou a cada mudança de quarto)', 'Hora, latitude, longitude, rumo e velocidade no fundo, leitura do odômetro, profundidade, vento e pressão', 'Estimada anterior: a diferença deve ser explicada pela corrente e pelo vento'],
        ['Ao aproximar-se da costa', 'Distância radar e sonda a cada marco', 'Carta (isóbatas e distâncias aos pontos notáveis)'],
        ['Todo dia, ao meio-dia (se tiver sextante)', 'Latitude pelo Sol na passagem meridiana', 'Latitude do GNSS: devem concordar em poucas milhas'],
        ['Ao sair do porto', 'Alarmes de profundidade, XTE, âncora e CPA do AIS', 'Calado + folga; rota planejada'],
      ] },
      { t: 'h', txt: 'Falhas típicas e plano B' },
      { t: 'tabela', cab: ['Falha', 'Sintoma', 'Plano B'], linhas: [
        ['Perda de energia (bateria, alternador)', 'Tela apaga, tudo some de uma vez', 'GNSS portátil com pilhas; estimada na carta de papel; lanterna de cabeça e rádio portátil à mão'],
        ['Antena ou cabo do GNSS (corrosão, mastro)', 'Satélites caem a zero ou aviso de “sem fix”', 'Segundo GNSS com antena própria; estimada'],
        ['Interferência ou falsificação do GNSS', 'Salto de posição, data errada, velocidade absurda', 'Radar, sonda, marcações, estimada; desconfiar de tudo que usa o GNSS (piloto, AIS, DSC)'],
        ['Raio (queda próxima ou direta)', 'Aparelhos queimados ou travados', 'Reserva guardada em caixa metálica fechada (reduz risco de pulsos eletromagnéticos; não protege contra impacto direto); sextante e cronômetro mecânico'],
        ['Erro de usuário (datum, unidade, waypoint digitado errado)', 'Rota aponta para terra; distância absurda', 'Conferir a rota no mapa e com régua na carta de papel antes de seguir'],
        ['Software travado ou carta desatualizada', 'Plotter congela; cartas sem correção recente', 'Reiniciar; carta de papel da área; Avisos aos Navegantes'],
      ] },
      { t: 'callout', tipo: 'dica', titulo: 'Treine com o GNSS desligado', html: 'Uma vez por travessia, passe um quarto de serviço (ou um dia, em águas seguras) sem olhar o GNSS. Navegue pela estimada, pegue a latitude ao meio-dia e só depois confira. Quem nunca fez isso descobre a dificuldade na hora errada.' },
      { t: 'fato', ref: 'travessia-116', html: 'Na navegação oceânica, a NORMAM-211 exige <b>2 aparelhos GNSS</b> numa embarcação de médio porte, com a recomendação de que ao menos um tenha energia independente.' },
      { t: 'check', questoes: [
        q('m5-l5-q1', 'Navegação eletrônica', 2, 'No caso do Royal Majesty, qual foi uma falha de procedimento determinante?',
          ['Nunca terem levado GPS a bordo.', 'Não terem notado a grande diferença entre o GPS (em modo estimado) e o Loran-C, que deveriam ser conferidos a cada hora.', 'Excesso de boias na região.', 'O ecobatímetro estar desligado de propósito.'], 1,
          'O GPS estava em modo estimado e o Loran-C, funcionando, mostrava a posição verdadeira; a conferência horária não foi feita de forma eficaz. O navio tinha GPS e o relatório não aponta excesso de boias. A sonda estava ligada, mas com o alarme no valor de porto (0 m), e não de propósito para esconder nada.',
          'NTSB/MAR-97/01 (resumo em RVS Bielefeld)', U.ntsb),
        q('m5-l5-q2', 'Navegação eletrônica', 2, 'Qual conjunto confere a posição do GNSS usando meios independentes do satélite?',
          ['Distância radar a uma ponta de terra, profundidade da sonda, estimada na carta.', 'Um segundo plotter ligado à mesma antena.', 'O AIS de outro navio.', 'O piloto automático.'], 0,
          'Radar, sonda e estimada não dependem do satélite. O segundo plotter com a mesma antena depende da mesma fonte. O AIS do outro navio e o piloto automático também dependem do GNSS.',
          'Miguens, vol. III (2026), cap. 39 (a prática da navegação)'),
        q('m5-l5-q3', 'Navegação eletrônica', 1, 'Ao sair do porto, por que se deve reajustar o alarme de profundidade da sonda que estava em 0 m?',
          ['Porque, em 0 m, o alarme nunca soa e deixa de proteger contra águas rasas no mar.', 'Porque a sonda gasta mais energia.', 'Porque a sonda mede a distância em milhas.', 'Porque o alarme só funciona fora do porto.'], 0,
          'Alarme em 0 m não avisa nada. Deve ficar em calado + folga durante a navegação. Os outros motivos são inventados.',
          'NTSB/MAR-97/01; boa prática de passadiço', U.ntsb),
        q('m5-l5-q4', 'Navegação eletrônica', 2, 'Seu GNSS falhou em meio ao oceano e o plotter está sem posição. Qual é a ordem mais sensata?',
          ['Parar de plotar e esperar o GNSS voltar.', 'Seguir pela estimada a partir da última posição boa, usar o segundo GNSS portátil, e conferir com outros métodos.', 'Mudar o rumo para o mais curto até a costa.', 'Esperar pelo meio-dia sem anotar nada.'], 1,
          'A estimada mantida em dia é a base. O segundo GNSS (independente) e outros métodos conferem. Parar de plotar é o erro clássico. Mudar o rumo sem saber a posição é perigoso. Esperar sem anotar perde a referência da última posição.',
          'Miguens, vol. III (2026), cap. 39, item 39.4'),
      ] },
      { t: 'fontes', itens: [
        { txt: 'NTSB, Marine Accident Report NTSB/MAR-97/01 (grounding of the Royal Majesty), resumo na análise da Universidade de Bielefeld', url: U.ntsb },
        man3('cap. 39 (a prática da navegação), item 39.4', 'tecnico-191'),
        nor('art. 4.19.2 (dotação de GNSS)', 'travessia-116'),
      ] },
    ],
  });
  /* ==================================================================================================
     m6 — Radar (Anexo 5-A, 1.3 b), d) e e))
     ================================================================================================== */
  var m6 = {
    id: 'm6', titulo: 'Radar',
    resumo: 'Como o radar mede, o que ele separa e o que confunde (poder discriminador em marcação e em distância, ecos falsos), navegação radar (posição, aterragem, águas restritas e navegação paralela indexada), o radar para evitar colisão (plotagem relativa, PMA, rosa de manobra), ARPA e AIS, e o ecobatímetro na navegação. Programa oficial: NORMAM-211, Anexo 5-A, item 1.3 b), d) e e).',
    licoes: []
  };
  M.push(m6);

  /* Polar -> SVG: centro (cx,cy), marcação em graus, distância em px */
  function pc(cx, cy, brg, r) { var a = brg * Math.PI / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }
  function pt(c) { return c[0].toFixed(1) + ' ' + c[1].toFixed(1); }

  /* ---------- m6 · l1 ---------- */
  var FIG_PPI = (function () {
    var cx = 200, cy = 178, k = 50, s = '';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (3 * k) + '" fill="var(--sea-3)" fill-opacity="0.55" stroke="var(--ink)" stroke-width="1.5"/>';
    s += '<g fill="none" stroke="var(--ink)" stroke-opacity="0.55"><circle cx="' + cx + '" cy="' + cy + '" r="' + k + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (2 * k) + '"/></g>';
    // terra a NE e E
    s += '<path d="M' + pt(pc(cx, cy, 20, 3 * k)) + ' L' + pt(pc(cx, cy, 25, 2.5 * k)) + ' L' + pt(pc(cx, cy, 45, 2.1 * k)) + ' L' + pt(pc(cx, cy, 70, 2.3 * k)) + ' L' + pt(pc(cx, cy, 95, 2.9 * k)) + ' L' + pt(pc(cx, cy, 99, 3 * k)) + ' A' + (3 * k) + ' ' + (3 * k) + ' 0 0 0 ' + pt(pc(cx, cy, 20, 3 * k)) + ' Z" fill="var(--land)" stroke="var(--ink)"/>';
    // alvo A (barco) a 250 graus, 2,6 anéis
    var a = pc(cx, cy, 250, 2.6 * k); s += '<circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="4.5" fill="var(--nav-yellow)" stroke="var(--ink)"/>';
    // linha de proa
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy - 3 * k) + '" stroke="var(--ink)" stroke-width="2"/>';
    // EBL a 060 e VRM r=2k
    var e = pc(cx, cy, 60, 3 * k), alvo = pc(cx, cy, 60, 2 * k);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" ' + MG + ' stroke-width="2.5" stroke-dasharray="7 4"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (2 * k) + '" fill="none" ' + MG + ' stroke-width="2.5" stroke-dasharray="7 4"/>';
    s += '<circle cx="' + alvo[0].toFixed(1) + '" cy="' + alvo[1].toFixed(1) + '" r="4.5" fill="var(--nav-yellow)" stroke="var(--ink)"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="var(--ink)"/>';
    s += th(cx + 6, cy - 3 * k - 6, 'proa 000°');
    s += thm(cx + 62, cy - 108, 'EBL 060°');
    s += thm(cx - 38, cy + 82, 'VRM 2,0 M');
    s += th(cx + 52, cy - 128, 'terra');
    s += th(cx - 112, cy + 66, 'outro barco');
    s += th(cx + k - 14, cy + 22, '1') + th(cx + 2 * k - 14, cy + 22, '2');
    return svg('0 0 400 345', 'Tela de radar PPI: barco no centro, linha de proa, anéis de distância, EBL, VRM, terra e um alvo',
      s + t(6, 338, 'Escala 3 M, anéis a cada milha.'));
  })();

  m6.licoes.push({
    id: 'l1', titulo: 'O radar: pulso, antena, tela e controles', minutos: 13,
    objetivos: [
      'Explicar como o radar mede distância (tempo de ida e volta) e marcação (posição da antena).',
      'Relacionar banda, pulso, antena e feixe com o desempenho; calcular horizonte radar e alcance de detecção.',
      'Ler a tela (proa para cima, norte para cima, EBL, VRM) e usar ganho, STC, FTC e pulso com critério.',
    ],
    blocos: [
      { t: 'p', html: 'O Mestre-Amador aprende a ligar o radar e medir uma distância. O Capitão-Amador precisa saber <b>por que</b> o aparelho mostra o que mostra, porque é isso que permite desconfiar dele. Comece pelo princípio.' },
      { t: 'h', txt: 'Medindo com ecos' },
      { t: 'p', html: 'O radar de navegação é um <b>radar de pulsos</b>. A antena emite um pulso curtíssimo de micro-ondas (uma fração de microssegundo) e logo escuta. Se o pulso bate num alvo, parte da energia volta como <b>eco</b>. O aparelho mede o tempo entre a emissão e o retorno. A distância é a <b>metade desse tempo</b> multiplicada pela velocidade das ondas (cerca de 300.000 km/s). A marcação é a direção para a qual a antena apontava no instante do eco.' },
      { t: 'callout', tipo: 'nota', titulo: 'A conta que vale decorar', html: 'O pulso anda 0,1618 milha por microssegundo. Ida e volta para 1 milha levam cerca de <b>12,4 µs</b> (microssegundos). Um eco que volta 24,7 µs depois vem de um alvo a 2,0 M. Como o pulso seguinte só pode sair depois de o eco mais distante voltar, o alcance máximo teórico depende da frequência de repetição dos pulsos: com 1.000 pulsos por segundo, a pausa de 999 µs permitiria ecos de até 80,8 M (Miguens). O alcance real fica menor por causa da potência e do horizonte.' },
      { t: 'h', txt: 'Os cinco números de um radar' },
      { t: 'lista', itens: [
        '<b>Frequência da portadora</b> (a banda). Os radares de navegação usam a banda <b>S</b> (comprimento de onda de 10 cm), para alto-mar, e a banda <b>X</b> (3 cm, 9 GHz), para costa e águas restritas. A banda X dá imagem mais detalhada com antena menor, mas alcança menos e é mais afetada por chuva. Quase todo radar de veleiro é banda X.',
        '<b>Frequência de repetição de impulsos</b> (FRI): pulsos por segundo.',
        '<b>Largura do pulso:</b> duração do pulso, em microssegundos. Pulso <b>curto</b> separa melhor alvos próximos e dá alcance mínimo menor; pulso <b>longo</b> leva mais energia e detecta mais longe.',
        '<b>Velocidade de rotação da antena:</b> mais lenta, mais pulsos atingem o alvo e melhor a detecção.',
        '<b>Largura do feixe:</b> estreita no plano horizontal (1° a 2° nos radares de navio) e larga no vertical (15° a 30°), o que tolera o balanço. Veremos que ela define a precisão em marcação.',
      ] },
      { t: 'h', txt: 'Até onde o radar enxerga' },
      { t: 'p', html: 'As ondas do radar se curvam um pouco para baixo na atmosfera. O <b>horizonte radar</b> é <b>Dr = 2,21 √H</b> (milhas, com H a altura da antena em metros), cerca de 14% maior que o horizonte geográfico. Um alvo alto é detectado antes: o alcance é 2,21 (√H + √h), onde h é a altura do alvo. Exemplo: antena a 4 m e um navio com 16 m de altura: 2,21 × (2 + 4) = <b>13,3 M</b>. Uma boia de 1 m, com a mesma antena: 2,21 × (2 + 1) = 6,6 M, <i>se</i> o eco for forte o bastante.' },
      { t: 'p', html: 'Condições atmosféricas anormais mudam isso. Em <b>super-refração</b> (ar quente e seco sobre ar frio e úmido, comum nos trópicos com terral sobre correntes frias), o alcance aumenta; em <b>sub-refração</b> diminui. Em <b>dutos de superfície</b>, ecos de alvos muito distantes aparecem e podem ser confundidos com alvos próximos (o Miguens cita detecções a mais de 1.000 milhas).' },
      { t: 'h', txt: 'A tela' },
      { t: 'figura', svg: FIG_PPI, legenda: 'Exemplo de tela PPI (<i>plan position indicator</i>). O barco fica fixo no centro; terra e alvos se movem na tela em movimento relativo. O EBL marca a direção; o VRM, a distância.' },
      { t: 'lista', itens: [
        '<b>Proa para cima</b> (<i>head-up</i>, não estabilizada): a linha de proa fica para cima e a imagem gira quando o barco guina. As marcações são <b>relativas</b>.',
        '<b>Norte para cima</b> (<i>north-up</i>, estabilizada): o radar recebe o rumo de uma agulha eletrônica ou giro; a imagem fica parada quando você guina e a linha de proa é que se move. As marcações são <b>verdadeiras</b> se a fonte de rumo estiver certa. Há ainda o <b>rumo para cima</b> (<i>course-up</i>), em que o rumo planejado fica para cima.',
        '<b>EBL</b> (cursor de marcação) e <b>VRM</b> (estrobo ou círculo de distância): para medir, ponha o EBL no meio do eco e o VRM tangente à <b>borda interna</b> do eco.',
        '<b>Movimento relativo ou verdadeiro:</b> no relativo, o seu barco é fixo e tudo se move. É o modo que revela rumos de colisão (veremos na lição 5). No verdadeiro, objetos parados ficam parados, mas alvos em rumo de colisão são mais difíceis de perceber e é preciso reposicionar a imagem.',
      ] },
      { t: 'h', txt: 'Os controles que importam' },
      { t: 'tabela', cab: ['Controle', 'Para que serve', 'Cuidado'], linhas: [
        ['<b>Ganho</b> (<i>gain</i>)', 'Sensibilidade do receptor. Ideal: tela levemente “salpicada”.', 'Pouco ganho esconde ecos fracos; muito ganho borra e junta alvos.'],
        ['<b>STC</b> (<i>sea</i>, anti-clutter de mar)', 'Reduz o ganho só perto do barco, onde o mar dá ecos. Eficaz até 4 a 5 M e ineficaz além de 8 M.', 'Nunca fixo: mar calmo, quase zero; mar grosso, aumente até virar pontinhos. Não apague tudo.'],
        ['<b>FTC</b> (<i>rain</i>, anti-clutter de chuva)', 'Encurta os ecos de chuva e melhora a separação em distância.', 'Afeta toda a tela e reduz a sensibilidade.'],
        ['<b>Largura do pulso</b>', 'Pulso curto para escalas curtas e mais detalhe; longo para longe.', 'Muitos aparelhos mudam sozinhos com a escala.'],
        ['<b>Sintonia</b>', 'Mantém o receptor no tom do transmissor.', 'Ajuste nos primeiros 30 min depois de ligar, se não houver AFC.'],
        ['<b>Linha de proa</b>', 'Mostra a proa na tela.', 'Desligue por instantes: ela pode esconder um eco fraco pela proa.'],
      ], legenda: 'Controles descritos no Miguens, vol. I, item 14.1.5.' },
      { t: 'fato', ref: 'extra-fechamento-cvtr-13', html: 'O radar de 9 GHz é obrigatório nas embarcações de grande porte ou iates construídos após 11/02/2000 classificados para navegação costeira ou oceânica. Para as embarcações menores, o emprego é <b>recomendado</b>.' },
      { t: 'termos', ids: ['radar', 'marcacao', 'risco-de-abalroamento', 'vigilancia'] },
      { t: 'check', questoes: [
        q('m6-l1-q1', 'Navegação eletrônica', 2, 'O eco de um alvo volta 24,7 microssegundos depois da emissão do pulso. Aproximadamente a que distância está o alvo? (Ida e volta de 1 milha levam cerca de 12,4 µs.)',
          ['0,5 milha.', '1,0 milha.', '2,0 milhas.', '4,0 milhas.'], 2,
          'A distância é a metade do caminho percorrido: 24,7 ÷ 12,4 ≈ 2,0 milhas. 4,0 milhas esquece que o sinal vai e volta. 1,0 e 0,5 milha dividem demais.',
          'Miguens, vol. I, item 14.1.2'),
        q('m6-l1-q2', 'Navegação eletrônica', 2, 'Com a antena a 4 m de altura, o radar começa a detectar um navio de 16 m de altura a aproximadamente:',
          ['4,4 milhas.', '13,3 milhas.', '6,6 milhas.', '26,5 milhas.'], 1,
          'Alcance = 2,21 × (√4 + √16) = 2,21 × (2 + 4) = 13,3 M. 4,4 M é só o horizonte radar da antena (2,21 × 2). 6,6 M corresponde à altura de 1 m do alvo. 26,5 M soma as alturas sem a raiz.',
          'Miguens, vol. I, item 14.1.3'),
        q('m6-l1-q3', 'Navegação eletrônica', 2, 'Num radar de veleiro com apresentação norte para cima (estabilizada), ao guinar o barco:',
          ['A imagem de terra gira e a linha de proa fica parada.', 'A imagem fica parada e a linha de proa muda de direção.', 'O radar desliga o EBL.', 'Os anéis de distância mudam de tamanho.'], 1,
          'Na apresentação estabilizada o norte fica para cima, então a imagem não gira; quem se move é a linha de proa. A primeira alternativa descreve a apresentação proa para cima. Guinar não desliga o EBL nem muda os anéis.',
          'Miguens, vol. I, item 14.1.4'),
        q('m6-l1-q4', 'Navegação eletrônica', 2, 'Com mar grosso, o centro da tela está coberto de ecos das ondas. Qual é o procedimento correto?',
          ['Aumentar o ganho ao máximo.', 'Aumentar o STC até o retorno do mar virar pontinhos, sem apagar tudo, e reduzi-lo quando o mar acalmar.', 'Fixar o STC no máximo para toda a viagem.', 'Usar o FTC no máximo e desligar o STC.'], 1,
          'O STC reduz o ganho nas proximidades; deve acompanhar o estado do mar e nunca apagar todo o retorno, porque ecos de alvos pequenos próximos também somem. Mais ganho piora a mancha. O FTC atua sobre chuva.',
          'Miguens, vol. I, item 14.1.5 c)'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, itens 14.1.2 a 14.1.5 (princípio, propagação, tela e controles)'),
        nor('art. 4.19.3 a) (radar de 9 GHz)', 'extra-fechamento-cvtr-13'),
      ] },
    ],
  });
  /* ---------- m6 · l2 ---------- */
  var FIG_DISCR = (function () {
    var o = [320, 150], s = '';
    var l = pc(o[0], o[1], -8, 112), r = pc(o[0], o[1], 8, 112);
    s += '<rect x="0" y="0" width="400" height="162" rx="8" ' + SEA + '/>';
    s += '<path d="M' + pt(o) + ' L' + pt(l) + ' A112 112 0 0 1 ' + pt(r) + ' Z" fill="var(--magenta)" fill-opacity="0.2" ' + MG + ' stroke-width="1.5"/>';
    var a = pc(o[0], o[1], -3, 84), b = pc(o[0], o[1], 3, 84);
    s += '<circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="4.5" fill="var(--nav-yellow)" stroke="var(--ink)"/>';
    s += '<circle cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="4.5" fill="var(--nav-yellow)" stroke="var(--ink)"/>';
    s += '<circle cx="' + o[0] + '" cy="' + o[1] + '" r="4" fill="var(--ink)"/>';
    s += t(8, 22, 'Em marcação: o feixe (θ)', 'font-weight="700"') + t(8, 42, 'cobre os dois alvos de uma vez.');
    s += t(8, 100, 'alvos a 6° um do outro;') + t(8, 120, 'feixe: 16° (exagero)');
    s += '<rect x="0" y="176" width="400" height="188" rx="8" ' + SEA + '/>';
    s += t(8, 198, 'Em distância: o pulso tem comprimento ℓ', 'font-weight="700"');
    s += t(8, 222, 'T1 e T2 (a menos de ℓ/2): um só eco;');
    s += t(8, 242, 'T1 e T3 (a mais de ℓ/2): dois ecos.');
    s += '<circle cx="26" cy="288" r="5" fill="var(--ink)"/>';
    s += '<rect x="56" y="276" width="96" height="24" rx="4" fill="var(--magenta)" fill-opacity="0.4" ' + MG + '/>';
    s += t(56, 268, 'pulso: ℓ = c × duração');
    [[236, 'T1'], [256, 'T2'], [340, 'T3']].forEach(function (x) { s += '<circle cx="' + x[0] + '" cy="288" r="5" fill="var(--nav-yellow)" stroke="var(--ink)"/>' + t(x[0] - 9, 318, x[1]); });
    s += '<path d="M236 328 L236 336 L284 336 L284 328" fill="none" stroke="var(--ink)" stroke-width="1.5"/>' + t(238, 356, 'ℓ/2');
    return svg('0 0 400 366', 'Poder discriminador: em marcação depende da largura do feixe; em distância, da metade do comprimento do pulso', s);
  })();

  m6.licoes.push({
    id: 'l2', titulo: 'Poder discriminador e ecos que enganam', minutos: 13,
    objetivos: [
      'Calcular o poder discriminador em distância (pulso) e em marcação (feixe) e dizer de que cada um depende.',
      'Prever as distorções da imagem radar (alargamento, falsa linha de costa, alvos que se juntam).',
      'Reconhecer setores de sombra e ecos falsos (múltiplo, indireto e lateral) e saber o que fazer.',
    ],
    blocos: [
      { t: 'p', html: 'Esta é uma das lições que mais caem na prova. O <b>poder discriminador</b> é a capacidade do radar de mostrar <b>dois alvos próximos como dois ecos separados</b>. Há dois, e cada um tem uma causa diferente.' },
      { t: 'h', txt: 'Em distância: a duração do pulso' },
      { t: 'p', html: 'Dois alvos <b>na mesma marcação</b>, um atrás do outro, só aparecem separados se a distância entre eles for maior que <b>metade do comprimento do pulso</b>. O comprimento do pulso é a velocidade das ondas vezes a duração do pulso (cerca de 300 m para cada microssegundo). Portanto:' },
      { t: 'p', html: '<b>discriminação em distância ≈ ½ × 300 m × duração (µs)</b>' },
      { t: 'tabela', cab: ['Duração do pulso', 'Comprimento do pulso', 'Discriminação em distância'], linhas: [
        ['0,08 µs (pulso curto)', '24 m', '<b>12 m</b>'],
        ['0,25 µs', '75 m', '<b>37 m</b>'],
        ['0,5 µs', '150 m', '<b>75 m</b>'],
        ['1,0 µs (pulso longo)', '300 m', '<b>150 m</b>'],
      ], legenda: 'Com c ≈ 300 m/µs. O Miguens usa 1 µs como exemplo: discriminação de 162 jardas (cerca de 148 m).' },
      { t: 'p', html: 'O mesmo valor, aproximadamente, é o <b>alcance mínimo</b>: um alvo mais perto que isso devolve o eco enquanto o pulso ainda está saindo e some. Pulso curto, portanto, melhora a separação e permite ver mais perto. O preço é a energia: pulso longo detecta mais longe. Por isso os radares usam pulso curto em escalas curtas e pulso longo em escalas longas.' },
      { t: 'h', txt: 'Em marcação: a largura do feixe' },
      { t: 'p', html: 'Dois alvos <b>à mesma distância</b>, lado a lado, só aparecem separados se o ângulo entre eles, visto do barco, for maior que a <b>largura do feixe horizontal</b>. Em medida linear, a separação mínima cresce com a distância:' },
      { t: 'p', html: '<b>discriminação em marcação ≈ largura do feixe (graus) × 32 m × distância (milhas)</b>' },
      { t: 'p', html: 'Um grau de feixe a 1 milha cobre cerca de 32 m (35,3 jardas no Miguens). Um radar de navio, com feixe de 1,5°, a 10 milhas só separa alvos a mais de uns 485 m; a 5 milhas, 243 m. Um radome de recreio, com feixe de 4° a 6° (confira no manual do aparelho), a 2 milhas separa alvos a 260 a 390 m. A largura do feixe depende do <b>comprimento de onda</b> e do <b>tamanho da antena</b>: onda mais curta e antena maior dão feixe mais estreito.' },
      { t: 'figura', svg: FIG_DISCR, legenda: 'Em cima, o feixe cobre os dois alvos de uma vez. Embaixo, o pulso ocupa todo o espaço entre T1 e T2; só T3 está longe o bastante.' },
      { t: 'tabela', cab: ['Propriedade', 'Depende de', 'Observação'], linhas: [
        ['Discriminação em <b>distância</b>', 'Duração (comprimento) do pulso', 'Pulso curto melhora; o ganho excessivo piora'],
        ['Discriminação em <b>marcação</b>', 'Largura do feixe horizontal (antena e banda)', 'Não depende do pulso. Antena maior e banda X melhoram'],
        ['Alcance mínimo', 'Duração do pulso', 'Cerca de metade do comprimento do pulso'],
        ['Precisão das <b>distâncias</b>', 'Calibragem, escala usada, tangência do VRM', 'Escala curta melhora; calibragem satisfatória: erro menor que 1,5% da escala'],
        ['Precisão das <b>marcações</b>', 'Feixe, alinhamento da linha de proa, giro', 'Da ordem de 2° a 3°, pior que a distância'],
      ] },
      { t: 'h', txt: 'O que isso faz com a imagem' },
      { t: 'lista', itens: [
        'Todo eco aparece <b>alargado</b> aproximadamente pela largura do feixe, de cada lado. Marcações a pontas de terra têm erro da ordem de metade da largura do feixe.',
        'Pedras, recifes ou barcos próximos da costa se unem e formam uma <b>falsa linha de costa</b>. Um rebocador e o reboque juntam-se num eco só.',
        'Reduzir o ganho tira os ecos fracos das bordas do feixe e <b>reduz a distorção</b>; escolher escala curta e pulso curto melhora a separação.',
        'Ao medir <b>tangentes</b> (bordas) de uma ilha grande, o Miguens manda <b>somar metade da largura do feixe à tangente esquerda e subtrair da direita</b>. Exemplo: feixe de 4°, tangentes lidas 040° e 070°: corrigidas para 042° e 068°.',
      ] },
      { t: 'h', txt: 'Setores de sombra e ecos falsos' },
      { t: 'lista', itens: [
        '<b>Setores de sombra:</b> atrás de uma ilha ou de um alvo grande, o feixe não passa. No próprio veleiro, o mastro, o estai, a retranca e as velas abrem <b>setores cegos</b> que você precisa conhecer (teste com um barco por perto e anote as marcações).',
        '<b>Eco múltiplo:</b> o pulso reflete entre seu barco e um alvo próximo (em geral outro navio, pelo través) e volta várias vezes. Aparece na <b>mesma marcação</b>, em distâncias <b>múltiplas</b> (o dobro, o triplo). O eco duplo serve para conferir a calibragem: a distância do segundo ao primeiro eco deve ser igual à do primeiro.',
        '<b>Eco indireto:</b> o pulso bate num alvo e volta pela estrutura do seu barco (mastro, retranca). Aparece à <b>mesma distância</b> do alvo verdadeiro, mas na marcação da estrutura refletora.',
        '<b>Eco lateral:</b> lóbulos laterais do feixe, mais fracos, produzem arcos de eco ao redor de um alvo próximo e forte. Reduzir ganho ou aumentar o STC atenua, mas cuidado para não apagar alvos pequenos.',
        '<b>Chuva e mar:</b> manchas de chuva escondem alvos dentro delas (use FTC e reduza momentaneamente o ganho); o retorno do mar cobre o centro (STC).',
      ] },
      { t: 'callout', tipo: 'seguranca', titulo: 'Ausência de eco não é ausência de alvo', html: 'Um veleiro de fibra, um casco de madeira, um bote, uma pessoa na água ou um tronco refletem pouco. Com mar grosso ou chuva, desaparecem. O radar <b>reforça</b> a vigilância visual e auditiva exigida pela Regra 5 do RIPEAM; não a substitui.' },
      { t: 'check', questoes: [
        q('m6-l2-q1', 'Navegação eletrônica', 2, 'Um radar usa pulso de 0,5 µs. A discriminação em distância é de aproximadamente:',
          ['15 m.', '75 m.', '150 m.', '300 m.'], 1,
          'O comprimento do pulso é 300 m/µs × 0,5 µs = 150 m, e a discriminação é a metade, 75 m. 150 m é o comprimento do pulso (esqueceu de dividir por 2). 300 m e 15 m não correspondem à conta.',
          'Miguens, vol. I, item 14.1.2 (largura do pulso)'),
        q('m6-l2-q2', 'Navegação eletrônica', 3, 'Um radar com feixe horizontal de 2° observa dois rochedos à mesma distância, a 6 milhas. Eles aparecem separados se estiverem afastados lateralmente, no mínimo, uns:',
          ['390 m.', '39 m.', '3.900 m.', '39 km.'], 0,
          '2° × 32 m por grau por milha × 6 milhas ≈ 390 m. 39 m erra por fator 10; 3.900 m e 39 km erram na outra direção. O pulso não influi nesta conta.',
          'Miguens, vol. I, item 14.1.2 (dt = 35,3427 × a × L jardas)'),
        q('m6-l2-q4', 'Navegação eletrônica', 2, 'Na tela aparece um eco na mesma marcação de um navio que passa pelo seu través, mas ao dobro da distância. O mais provável é:',
          ['Um segundo navio exatamente atrás do primeiro.', 'Um eco múltiplo (duplo), por reflexão do pulso entre os dois barcos.', 'Um eco lateral.', 'Um setor de sombra.'], 1,
          'Ecos múltiplos aparecem na mesma marcação, a distâncias múltiplas (dobro, triplo). Eco lateral aparece como arco ao redor do alvo e setor de sombra é uma ausência de eco. Um segundo navio exatamente alinhado e ao dobro da distância seria coincidência improvável.',
          'Miguens, vol. I, item 14.2.1 c)'),
        q('m6-l2-q5', 'Navegação eletrônica', 3, 'Com feixe de 4°, as tangentes de uma ilha grande, medidas no radar, foram 040° (esquerda) e 070° (direita). As tangentes corrigidas, pela regra do Miguens, são:',
          ['038° e 072°.', '042° e 068°.', '040° e 070°, sem correção.', '044° e 066°.'], 1,
          'A imagem fica alargada de metade da largura do feixe (2°) de cada lado. Soma-se 2° à esquerda (042°) e subtrai-se 2° da direita (068°). Fazer o contrário aumentaria o erro. Aplicar o feixe inteiro (4°) é demais.',
          'Miguens, vol. I, item 14.3.2 d)'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, itens 14.1.2 (largura do pulso e do feixe), 14.2.1 (fatores que afetam a interpretação) e 14.3.1'),
        rip('Regra 5 (vigilância)', 'tecnico-15'),
      ] },
    ],
  });
  /* ---------- m6 · l3 ---------- */
  var FIG_ATERR = (function () {
    var s = '', k = 0.0017, yy = function (x) { return 150 + k * x * x; };
    s += '<rect x="0" y="0" width="400" height="300" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>';
    // mar (curvatura exagerada)
    var path = 'M0 150'; for (var x = 0; x <= 400; x += 20) path += ' L' + x + ' ' + yy(x).toFixed(1);
    path += ' L400 300 L0 300 Z';
    s += '<path d="' + path + '" fill="var(--sea-3)" fill-opacity="0.6" stroke="var(--ink)"/>';
    // praia baixa e morro
    var bx = 214, hx = 300;
    s += '<path d="M' + (bx - 22) + ' ' + yy(bx - 22).toFixed(1) + ' L' + (bx - 10) + ' ' + (yy(bx) - 8).toFixed(1) + ' L' + (bx + 30) + ' ' + (yy(bx + 30) - 8).toFixed(1) + ' L' + (hx - 20) + ' ' + (yy(hx - 20) - 10).toFixed(1) + ' L' + hx + ' ' + (yy(hx) - 74).toFixed(1) + ' L' + (hx + 28) + ' ' + (yy(hx + 28) - 20).toFixed(1) + ' L' + (hx + 60) + ' ' + yy(hx + 60).toFixed(1) + ' Z" fill="var(--land)" stroke="var(--ink)"/>';
    // barco
    s += '<path d="M14 150 L48 150 L42 160 L20 160 Z" fill="var(--nav-white)" stroke="var(--ink)"/><line x1="31" y1="150" x2="31" y2="134" stroke="var(--ink)" stroke-width="2"/>';
    // feixe tangente à praia e atingindo o morro
    var hy = yy(hx) - 74;
    s += '<line x1="31" y1="134" x2="' + hx + '" y2="' + hy.toFixed(1) + '" ' + MG + ' stroke-width="2.2" stroke-dasharray="7 5"/>';
    s += t(8, 24, 'O feixe passa sobre a praia baixa', 'font-weight="700"') + t(8, 44, 'e o primeiro eco vem do morro.');
    s += t(8, 74, 'Antena a 4 m; praia 3 m; morro 300 m.') + t(8, 94, 'Praia a 20 M, morro a 26 M: erro de 6 M.');
    s += th(168, 212, 'praia') + th(268, 212, 'morro');
    return svg('0 0 400 300', 'Aterragem com radar: o feixe passa sobre a praia baixa e o primeiro eco vem do morro mais atrás, distância lida maior que a real', s);
  })();

  m6.licoes.push({
    id: 'l3', titulo: 'Auxílios radar, posição e aterragem', minutos: 13,
    objetivos: [
      'Distinguir refletor, RTE, RACON e RAMARK e saber ler o sinal de um RACON.',
      'Obter a posição pelo radar na ordem certa de confiança e saber quantas linhas de posição usar.',
      'Evitar o erro clássico da aterragem com radar (primeiro eco é o morro, não a praia).',
    ],
    blocos: [
      { t: 'h', txt: 'Auxílios à navegação radar' },
      { t: 'p', html: 'Há equipamentos feitos para que um alvo apareça melhor ou possa ser identificado no radar. Os <b>passivos</b> só refletem a energia que recebem; os <b>ativos</b> recebem o pulso e transmitem um sinal próprio.' },
      { t: 'tabela', cab: ['Auxílio', 'Tipo', 'O que faz'], linhas: [
        ['<b>Refletor radar</b>', 'Passivo', 'Três (ou mais) superfícies metálicas em ângulo reto devolvem o pulso na direção de onde veio. Aumenta o alvo de barcos de fibra e madeira.'],
        ['<b>RTE</b> (<i>radar target enhancer</i>)', 'Ativo', 'Recebe o pulso, amplifica e devolve um eco reforçado, sem código. Pode ser usado em boias e em pequenas embarcações.'],
        ['<b>RACON</b> (<i>radar beacon</i>)', 'Ativo', 'Quando recebe o pulso do seu radar, devolve um sinal codificado em Morse que aparece na tela e identifica o sinal. Costuma responder nas bandas X e S.'],
        ['<b>RAMARK</b> (<i>radar marker</i>)', 'Ativo', 'Transmite sozinho, sem ser excitado, e aparece como uma linha radial do centro da tela até a posição do sinal. Dá só a marcação.'],
      ] },
      { t: 'tabela', cab: ['Alvo', 'Alcance radar sem refletor', 'Com refletor'], linhas: [
        ['Boia comum', '1,5 M', '3,5 M'],
        ['Boia cilíndrica', '3,5 M', '7,0 M'],
        ['Baleeira', '3,0 M', '7,0 M'],
        ['Barco de pesca', '2,0 M', '6,0 M'],
      ], legenda: 'Valores ilustrativos do Miguens, vol. I, item 14.2.5. A IMO recomenda que as embarcações pequenas levem refletor radar.' },
      { t: 'fato', ref: 'extra-arrais-3-23', html: 'Em navegação costeira ou oceânica, <b>todas as embarcações</b> devem ter um refletor radar.' },
      { t: 'p', html: '<b>Lendo um RACON.</b> O sinal começa na posição do RACON e se estende para fora, na direção da borda da tela, como uma letra em código Morse. Meça a <b>distância</b> até a borda mais próxima do primeiro ponto ou traço; leia a <b>marcação</b> pelo meio do sinal. Usos: reforçar e identificar um sinal de aterragem, marcar entradas de porto, alinhamentos, vão de pontes e <b>novos perigos</b>. Na marcação de novo perigo, o RACON responde com a letra “D” (— · ·). Perto do RACON, o FTC reduz a interferência que ele causa.' },
      { t: 'fato', ref: 'tecnico-122', html: 'Pela NORMAM-601/DHN, o sinal luminoso de novo perigo usa característica cardinal ou lateral com ritmo rápido (R) ou muito rápido (MR); pode haver <b>RACON “D”</b>.' },
      { t: 'p', html: 'O <b>SART</b> (respondedor de busca e salvamento), que você verá no módulo de Comunicações, é um respondedor radar na banda X que aparece como uma linha de pontos na tela dos navios que o procuram.' },
      { t: 'h', txt: 'Posição pelo radar' },
      { t: 'p', html: 'Entre os instrumentos que não dependem de luz nem de satélite, o radar é o que dá linhas de posição precisas à noite e na neblina. Como a <b>distância</b> é medida com mais precisão que a <b>marcação</b>, a ordem de confiança é esta (Miguens, item 14.3.2):' },
      { t: 'lista', ordenada: true, itens: [
        '<b>Distâncias radar</b> combinadas com <b>marcações visuais</b> (por exemplo, distância à ponta e marcação de um farol).',
        'Cruzamento de <b>três ou mais distâncias radar</b>, a objetos isolados e bem definidos.',
        '<b>Marcação e distância radar</b> do mesmo objeto (rápida, mas só duas LDP, sem conferência).',
        'Cruzamento de <b>marcações radar</b>: último recurso.',
      ] },
      { t: 'lista', itens: [
        '<b>Use sempre pelo menos 3 LDP</b>: duas podem dar ambiguidade ou erro de identificação.',
        '<b>Escolha alvos pequenos e definidos</b> (ilhotas, pedras, pontas), e não praias baixas ou manguezais, cujo eco pode vir do interior.',
        'Meça tangenciando a <b>borda interna</b> do eco, na <b>escala mais curta</b> possível, longe da borda da tela. Meça rápido e em sequência: ponto mais à frente, o mais à ré, e o do meio.',
        'Trace cada distância com o compasso, como um arco com centro no ponto da carta. Os arcos não se cruzam num ponto exato: o triângulo que sobra é o seu erro.',
        'O maior perigo é plotar a distância de <b>outro ponto</b> do que o operador mediu. Confirme em voz alta.',
      ] },
      { t: 'p', html: 'Precisão: um radar bem calibrado, bem operado, dá distâncias com cerca de 100 jardas (90 m) até o horizonte radar; as marcações têm precisão da ordem de 2° a 3°. A calibragem é satisfatória se, num ponto conhecido, a distância radar difere da distância da carta em menos de <b>1,5% da escala em uso</b> (por exemplo, menos de 0,09 M na escala de 6 M).' },
      { t: 'widget', w: 'carta-nautica', opts: { ferramenta: 'compasso' }, legenda: 'Treine a plotagem de distâncias: use o compasso para medir na escala de latitudes, como se fossem distâncias radar a pontos conhecidos da carta de treinamento.' },
      { t: 'h', txt: 'Aterragem: o primeiro eco não é a praia' },
      { t: 'p', html: 'Quase toda costa é baixa junto ao mar e sobe para o interior. O radar vê primeiro o que está <b>mais alto</b>. Para uma antena a 4 m, uma praia de 3 m só aparece a 2,21 × (2 + 1,7) ≈ 8 milhas, mas um morro de 300 m atrás dela aparece a 2,21 × (2 + 17,3) ≈ 43 milhas. A 20 milhas da praia, o eco que você vê é o morro, a 26 milhas.' },
      { t: 'figura', svg: FIG_ATERR, legenda: 'Esquema com curvatura da Terra exagerada. Quanto mais longe, maior o erro de distância; ele só desaparece quando a própria praia entra no radar.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'Aterragem com radar: regras de ouro', html: 'Use o radar junto com a <b>sonda</b> (isóbatas), as marcações de luzes e a estimada. Identifique a costa pelo formato e pela sequência de ecos, e não por um eco isolado. Não reduza o ganho a ponto de perder os primeiros ecos da costa. Aproxime-se de dia e com margem, de preferência.' },
      { t: 'check', questoes: [
        q('m6-l3-q1', 'Navegação eletrônica', 2, 'Num RACON identificado na tela, onde se mede a distância ao sinal?',
          ['No centro do sinal codificado.', 'No fim do último traço do código.', 'Na borda mais próxima do primeiro ponto ou traço do código.', 'Na borda externa da tela.'], 2,
          'O sinal começa na posição do RACON, por isso a distância é medida na borda mais próxima do primeiro traço. A marcação é lida pelo meio do sinal. O final do código e a borda da tela não indicam o lugar do auxílio.',
          'Miguens, vol. I, item 14.2.5 b)'),
        q('m6-l3-q2', 'Navegação eletrônica', 2, 'Qual par de auxílios radar é ativo?',
          ['Refletor radar e RACON.', 'RACON e RTE.', 'Refletor radar e RTE.', 'Refletor radar e farol.'], 1,
          'RACON e RTE recebem o pulso e transmitem um sinal próprio (ativos). O refletor só devolve a energia (passivo).',
          'Miguens, vol. I, item 14.2.5'),
        q('m6-l3-q3', 'Navegação eletrônica', 2, 'Qual combinação é, na ordem do Miguens, a mais confiável para obter posição pelo radar?',
          ['Distâncias radar e marcações visuais.', 'Cruzamento de marcações radar.', 'Uma só marcação radar a uma praia baixa.', 'Distância a um navio em movimento.'], 0,
          'Distâncias radar (precisas) com marcações visuais (precisas) formam a combinação mais confiável. Marcações radar têm erro de 2° a 3°; praias baixas dão ecos duvidosos; um navio em movimento não é ponto fixo.',
          'Miguens, vol. I, item 14.3.2'),
        q('m6-l3-q4', 'Navegação eletrônica', 3, 'Aproximando-se de uma costa baixa com morros no interior, a distância radar lida sobre o primeiro eco, em relação à distância real à praia, tende a ser:',
          ['Menor, porque o radar vê a praia antes.', 'Maior, porque o primeiro eco vem dos morros mais atrás.', 'Igual, porque o radar mede a linha de costa.', 'Imprevisível, porque o radar não mede distância.'], 1,
          'A praia baixa está abaixo do horizonte radar; o feixe passa por cima e retorna dos morros, que estão mais longe. Por isso a distância lida é maior que a real, e o erro diminui com a aproximação.',
          'Miguens, vol. I, item 14.3.3'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, itens 14.2.5 (auxílios radar), 14.3.1 a 14.3.3 (precisão, posição e aterragem)'),
        nor('art. 4.18.3 (refletor radar)', 'extra-arrais-3-23'),
        { txt: 'NORMAM-601/DHN, art. 3.14 c) (novo perigo e RACON “D”)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html', ref: 'tecnico-122' },
      ] },
    ],
  });
  /* ---------- m6 · l4 ---------- */
  var FIG_PI = (function () {
    var s = '', K = 62;
    // painel da carta
    s += '<rect x="0" y="0" width="195" height="206" rx="8" ' + SEA + '/>';
    s += t(8, 22, 'Carta', 'font-weight="700"');
    s += '<line x1="12" y1="62" x2="183" y2="62" stroke="var(--ink)" stroke-width="2" stroke-dasharray="8 5"/>' + seta(150, 62, 183, 62, 'var(--ink)', 2);
    s += t(14, 50, 'derrota 090°');
    s += '<ellipse cx="97" cy="' + (62 + 0.7 * K) + '" rx="22" ry="13" fill="var(--land)" stroke="var(--ink)"/>' + t(76, 62 + 0.7 * K + 36, 'ilha');
    [[34, '1'], [97, '2'], [160, '3']].forEach(function (p) {
      s += '<path d="M' + (p[0] - 8) + ' 62 L' + (p[0] + 8) + ' 62 L' + (p[0] + 4) + ' 70 L' + (p[0] - 4) + ' 70 Z" fill="var(--nav-white)" stroke="var(--ink)"/>' + t(p[0] - 4, 90, p[1]);
    });
    s += '<line x1="97" y1="72" x2="97" y2="' + (62 + 0.7 * K - 14) + '" stroke="var(--ink)" stroke-dasharray="3 3"/>' + th(124, 114, '0,7 M');
    // painel do radar
    var cx = 302, cy = 104, R = 92;
    s += '<rect x="205" y="0" width="195" height="206" rx="8" ' + SEA + '/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="var(--sea-3)" fill-opacity="0.5" stroke="var(--ink)"/>';
    s += t(213, 22, 'Radar', 'font-weight="700"');
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 70) + '" y2="' + cy + '" stroke="var(--ink)" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="var(--ink)"/>';
    var yi = cy + 0.7 * K;
    s += '<line x1="215" y1="' + yi + '" x2="390" y2="' + yi + '" ' + MG + ' stroke-width="2.5"/>';
    [[cx + 63, '1'], [cx, '2'], [cx - 63, '3']].forEach(function (p) {
      s += '<ellipse cx="' + p[0] + '" cy="' + yi + '" rx="12" ry="7" fill="var(--land)" stroke="var(--ink)"/>' + th(p[0] - 4, yi - 12, p[1]);
    });
    s += '<ellipse cx="' + (cx + 40) + '" cy="' + (yi + 0.3 * K) + '" rx="12" ry="7" fill="none" stroke="var(--ink)" stroke-dasharray="3 3"/>';
    s += thm(222, yi - 28, 'índice 0,7 M');
    // legenda
    s += t(6, 228, 'Na derrota, o eco desliza sobre a reta.') + t(6, 248, 'O eco tracejado, fora da reta, indica barco') + t(6, 268, 'mais afastado da ilha.');
    return svg('0 0 400 278', 'Navegação paralela indexada: reta paralela à derrota na tela do radar a 0,7 milha do centro; o eco da ilha desliza sobre ela quando o barco está na derrota', s);
  })();

  m6.licoes.push({
    id: 'l4', titulo: 'Navegação paralela indexada e distância de segurança', minutos: 12,
    objetivos: [
      'Explicar a ideia da navegação paralela indexada e preparar as retas na carta e na tela do radar.',
      'Usar a distância radar como linha de posição de segurança e reconhecer quando o barco sai da derrota.',
      'Listar as verificações do radar (linearidade, centragem, erro de distância) antes da navegação em águas restritas.',
    ],
    blocos: [
      { t: 'p', html: 'Em águas restritas, com pouca visibilidade, plotar posições na carta consome tempo, e o barco anda enquanto você desenha. A <b>navegação paralela indexada</b> troca a pergunta “onde estou?” por outra, mais rápida: <b>“estou sobre a derrota?”</b>.' },
      { t: 'h', txt: 'A ideia' },
      { t: 'p', html: 'Na carta, você escolhe um objeto bem definido ao lado da derrota (uma ilha, uma ponta, uma boia). Mede a menor distância entre a derrota planejada e esse objeto: é a <b>distância de índice</b>. Na tela do radar, desenha uma reta <b>paralela à derrota</b> (ao rumo no fundo, e não à proa), a essa distância do centro. Enquanto o barco está na derrota, o eco do objeto <b>desliza sobre essa reta</b>. Se o eco sai da reta, o barco saiu da derrota, e a distância entre eles mostra quanto.' },
      { t: 'figura', svg: FIG_PI, legenda: 'Derrota 090° com uma ilha a 0,7 M por boreste. Na tela (norte para cima), o eco da ilha corre da direita para a esquerda sobre a reta índice. Fora da reta, para longe do centro, o barco está mais longe da ilha que o planejado.' },
      { t: 'lista', itens: [
        'Eco <b>entre a reta e o centro</b>: o barco está <b>mais perto</b> do objeto que o planejado. Cuidado se há perigo desse lado.',
        'Eco <b>além da reta</b>: o barco está <b>mais longe</b> do objeto. A correção é guinar para o lado do objeto.',
        'A reta serve também para <b>saber o momento</b>: quando o eco chega ao través, a distância restante até o próximo marco é a planejada.',
      ] },
      { t: 'h', txt: 'Preparação' },
      { t: 'p', html: '<b>No radar</b> (Miguens, item 14.3.6):' },
      { t: 'lista', itens: [
        'Escala <b>mais curta</b> possível (acima de 6 M raramente se usa), em <b>pulso curto</b> e faixa estreita. Escolha uma imagem limpa, mas sem apagar boias e barcos pequenos com ganho, STC e FTC.',
        '<b>Linearidade</b> da tela: confira com um compasso se os anéis de distância têm o mesmo espaçamento. Aparelho sem linearidade erra nas medidas entre dois pontos da tela.',
        '<b>Centragem</b> e <b>linha de proa</b>: tela descentrada gera erro de marcação. Confira a linha de proa comparando uma marcação radar com uma visual de um ponto bem definido.',
        '<b>Erro de distância</b> em cada escala. Quando o barco passa pelo alinhamento de dois pontos conhecidos, some as duas distâncias radar e compare com a distância na carta. Exemplo do Miguens: 2,1 M + 2,3 M = 4,4 M no radar contra 4,2 M na carta. A diferença, 0,2 M, é o <b>dobro</b> do erro (porque entraram duas distâncias): o erro é de 0,1 M, a subtrair de cada distância.',
      ] },
      { t: 'p', html: '<b>Na carta:</b>' },
      { t: 'lista', itens: [
        'Padronize os traços: <b>retas paralelas indexadas principais em linha cheia</b>, <b>retas de segurança tracejadas</b> e <b>curvas de guinada pontilhadas</b>. Quem cuida do radar e quem cuida da carta precisam falar a mesma língua.',
        'Faça <b>o menor número possível de mudanças de rumo</b>: cada uma exige novas retas na tela.',
        'Sempre que possível, tenha retas <b>em ambos os bordos</b>: elas denunciam erro de identificação ou de distância.',
        'Marque as <b>retas de segurança</b>: distâncias mínimas aos perigos, de cada lado da derrota. Elas dizem “até onde posso me afastar com segurança”.',
        'Planeje o <b>ponto de guinada</b> levando em conta o avanço e o afastamento do barco (no veleiro, o raio de giro e a velocidade).',
      ] },
      { t: 'h', txt: 'Executando' },
      { t: 'lista', itens: [
        'Trace as retas do próximo trecho enquanto as do trecho atual ainda servem. Use lápis de cera, fino, ou, nos radares com a função, as <b>linhas de índice paralelas (PI)</b> do próprio aparelho.',
        'A cada guinada, o radar em norte para cima exige novas retas. Siga uma rotina: verificar a área, sugerir a guinada, conferir a ordem ao timoneiro, observar a velocidade de guinada e corrigir o rumo.',
        'Relate sem parar: posição em relação à derrota, próximos sinais, limites de manobra (“águas safas até 500 jardas por boreste”) e alvos que se aproximam.',
        'Para identificar um eco, referencie-o a outro já identificado, e não ao seu barco.',
      ] },
      { t: 'h', txt: 'Distância radar como linha de segurança' },
      { t: 'p', html: 'Quando a visibilidade cai, você aumenta a distância da costa. Em vez de “por precaução” afastar-se muito, trace na carta <b>arcos de distância mínima</b> centrados em pontos da costa e uma <b>linha de segurança</b> tangente a eles. Por fora dessa linha, a travessia é segura, desde que a distância radar nunca fique menor que o arco. Para isso o eco deve ser realmente da costa (e não de morro no interior), e o ganho <b>não</b> deve ser reduzido, para que os primeiros ecos da costa apareçam.' },
      { t: 'p', html: 'No <b>fundeio de precisão</b> com radar, a ideia é a mesma: círculo de segurança de raio (filame + comprimento do barco), círculo “largar o ferro” e marcas de distância a um alvo conspícuo pela proa, até largar o ferro com o barco parado.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'Sobreposição radar + carta no plotter', html: 'Muitos plotters desenham o radar sobre a carta. Isso é útil, mas só se o alinhamento estiver correto. Se o rumo (agulha eletrônica) ou o GNSS estiver errado, a imagem radar se desloca em relação à carta e os ecos “não batem”. Conferir se a costa do radar cai sobre a costa da carta é um teste rápido de que o GNSS, o rumo e o datum estão coerentes.' },
      { t: 'check', questoes: [
        q('m6-l4-q1', 'Navegação eletrônica', 2, 'As retas paralelas indexadas, traçadas na carta e na tela do radar, são paralelas:',
          ['À proa do barco.', 'Ao rumo no fundo da derrota planejada.', 'À marcação do objeto.', 'Ao vento verdadeiro.'], 1,
          'A reta controla a derrota sobre o fundo e deve ser paralela ao rumo no fundo, e não à proa, que pode diferir por corrente e vento. A marcação do objeto muda ao longo do trajeto, e o vento não é referência.',
          'Miguens, vol. I, item 14.3.6 b)'),
        q('m6-l4-q2', 'Navegação eletrônica', 2, 'Navegando com uma ilha a 0,7 milha por boreste, o eco da ilha aparece na tela entre a reta índice e o centro. Isso significa que o barco está:',
          ['Sobre a derrota.', 'Mais longe da ilha que o planejado.', 'Mais perto da ilha que o planejado.', 'Com o radar descentrado, necessariamente.'], 2,
          'Eco mais perto do centro que a reta é sinal de menor distância à ilha. Sobre a derrota o eco estaria sobre a reta; mais longe, além dela. Descentragem é outra fonte de erro, mas não é a conclusão necessária.',
          'Miguens, vol. I, item 14.3.6'),
        q('m6-l4-q3', 'Navegação eletrônica', 3, 'Ao passar no alinhamento de dois pontos conhecidos, as distâncias radar foram 1,8 M e 2,2 M. Na carta, a distância entre os pontos é 3,8 M. Qual é o erro de distância a aplicar a cada medida?',
          ['0,2 M, a subtrair de cada distância.', '0,1 M, a subtrair de cada distância.', '0,1 M, a somar a cada distância.', '0,4 M, a subtrair de cada distância.'], 1,
          'A soma radar é 4,0 M e a da carta, 3,8 M: diferença de 0,2 M. Como foram usadas duas distâncias, o erro por distância é metade: 0,1 M, e o radar mede a mais, logo se subtrai. Somar inverteria o sinal; 0,2 M e 0,4 M ignoram que o erro entrou duas vezes.',
          'Miguens, vol. I, item 14.3.6 a) iv)'),
        q('m6-l4-q4', 'Navegação eletrônica', 2, 'Para usar uma distância radar como linha de posição de segurança em relação à costa, é importante:',
          ['Reduzir o ganho para não ver o interior.', 'Não reduzir o ganho, para receber os primeiros ecos da costa, e garantir que o eco seja da costa e não de morro mais alto.', 'Usar a maior escala disponível.', 'Desligar o STC e o FTC e o pulso curto.'], 1,
          'A linha de segurança só vale se os primeiros ecos da costa aparecerem; por isso não se reduz o ganho, e é preciso certeza de que o eco vem da costa e não do interior. Maior escala piora a precisão.',
          'Miguens, vol. I, item 14.3.4'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, itens 14.3.4 (distância radar como LDP de segurança), 14.3.5 (fundeio de precisão) e 14.3.6 (navegação paralela indexada)'),
      ] },
    ],
  });
  /* ---------- m6 · l5 ---------- */
  var FIG_ROSA = (function () {
    var cx = 200, cy = 178, k = 19, s = '';
    var obs = [[60, 8.0, '00'], [63, 6.7, '06'], [67, 5.5, '12'], [74, 4.3, '18']];
    [2, 4, 6, 8].forEach(function (m) { s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (m * k) + '" fill="none" stroke="var(--ink)" stroke-opacity="0.45"/>'; });
    [0, 30, 60, 90, 120, 150].forEach(function (b) {
      var p = pc(cx, cy, b, 8 * k), q2 = pc(cx, cy, b + 180, 8 * k);
      s += '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q2[0].toFixed(1) + '" y2="' + q2[1].toFixed(1) + '" stroke="var(--ink)" stroke-opacity="0.2"/>';
    });
    s += t(cx - 16, 14, '000°') + t(cx + 8 * k + 6, cy + 5, '090°') + t(cx - 16, cy + 8 * k + 18, '180°') + t(cx - 8 * k - 44, cy + 5, '270°');
    var P = obs.map(function (o) { return pc(cx, cy, o[0], o[1] * k); });
    var dx = P[3][0] - P[0][0], dy = P[3][1] - P[0][1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    var a = [P[0][0] - ux * 14, P[0][1] - uy * 14], b = [P[3][0] + ux * 3.75 * k + ux * 18, P[3][1] + uy * 3.75 * k + uy * 18];
    s += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>';
    var cp = pc(cx, cy, 135, 2.1 * k);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cp[0].toFixed(1) + '" y2="' + cp[1].toFixed(1) + '" ' + MG + ' stroke-width="2.5"/>';
    s += '<circle cx="' + cp[0].toFixed(1) + '" cy="' + cp[1].toFixed(1) + '" r="5" fill="var(--magenta)"/>';
    P.forEach(function (p, i) {
      s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" fill="var(--nav-yellow)" stroke="var(--ink)"/>' + th(p[0] + 8, p[1] - 5, obs[i][2]);
    });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="var(--ink)"/>' + t(cx - 22, cy - 8, 'R');
    s += tm(cp[0] + 8, cp[1] + 22, 'PMA 2,1 M') + tm(cp[0] + 8, cp[1] + 40, 'marcação 135°');
    s += thm(296, 196, 'DMR 225°');
    return svg('0 0 400 360', 'Rosa de manobra: quatro posições relativas do alvo, direção do movimento relativo 225 graus e ponto de maior aproximação a 2,1 milhas', s);
  })();

  var FIG_VEL = (function () {
    var tt = [260, 130], rr = [260, 70], mm = [260 - 93.3, 70 + 93.3], s = '';
    s += seta(tt[0], tt[1], rr[0], rr[1] + 2, 'var(--ink)', 3);
    s += seta(rr[0], rr[1], mm[0] + 2, mm[1] - 2, 'var(--magenta)', 3);
    s += seta(tt[0], tt[1], mm[0] + 3, mm[1] - 1, 'var(--ink)', 2, '6 4');
    s += '<circle cx="' + tt[0] + '" cy="' + tt[1] + '" r="4" fill="var(--ink)"/><circle cx="' + rr[0] + '" cy="' + rr[1] + '" r="4" fill="var(--ink)"/><circle cx="' + mm[0].toFixed(1) + '" cy="' + mm[1].toFixed(1) + '" r="4" fill="var(--ink)"/>';
    s += t(tt[0] + 8, tt[1] + 14, 't', 'font-weight="700"') + t(rr[0] + 8, rr[1] + 4, 'r', 'font-weight="700"') + t(mm[0] - 18, mm[1] + 16, 'm', 'font-weight="700"');
    s += t(8, 198, 'tr: meu barco, 000°, 6 nós');
    s += tm(8, 218, 'rm: movimento relativo, 225°, 13,2 nós');
    s += t(8, 238, 'tm (tracejado): alvo, 250°, 10 nós');
    return svg('0 0 400 250', 'Diagrama de velocidades: vetor do meu barco tr, vetor do movimento relativo rm e vetor do alvo tm', s);
  })();

  m6.licoes.push({
    id: 'l5', titulo: 'Radar anticolisão: plotagem relativa, PMA e rosa de manobra', minutos: 15,
    objetivos: [
      'Reconhecer, na tela, um rumo de colisão e dizer por onde o alvo vai passar.',
      'Plotar posições relativas e obter DMR, VMR, PMA, hora do PMA e o rumo e a velocidade do alvo na rosa de manobra.',
      'Escolher uma manobra que aumente o PMA, de acordo com o RIPEAM, e entender as limitações do método.',
    ],
    blocos: [
      { t: 'p', html: 'O radar é a única ferramenta comum do veleiro que mostra, à noite e na neblina, <b>se outro barco vai se aproximar demais</b>. Mas a tela é enganosa: ela mostra o <b>movimento relativo</b>, não o movimento verdadeiro do outro barco. Esta lição ensina a transformar uma sequência de pontos na tela em decisões.' },
      { t: 'h', txt: 'O que o RIPEAM manda' },
      { t: 'fato', ref: 'tecnico-17', html: 'Regra 7(a): em caso de dúvida, <b>presume-se que existe risco de abalroamento</b>.' },
      { t: 'fato', ref: 'tecnico-18', html: 'Regra 7(d)(I): presume-se risco de abalroamento se a <b>marcação de uma embarcação que se aproxima não se altera</b> de modo apreciável.' },
      { t: 'lista', itens: [
        'Regra 7(b): se há radar a bordo, deve-se usá-lo adequadamente, <b>inclusive com plotagem</b> ou observação sistemática dos objetos detectados.',
        'Regra 7(c): não tirar conclusões com base em <b>informação escassa</b>, principalmente radar escasso. Duas posições não bastam; use três ou mais.',
        'Regra 6: velocidade segura, que considere as limitações do radar (alvos pequenos, mar, chuva).',
      ] },
      { t: 'fato', ref: 'tecnico-19', html: 'Regra 8(b): as alterações de rumo ou velocidade para evitar abalroamento devem ser <b>amplas e claras</b>; devem-se evitar pequenas alterações sucessivas.' },
      { t: 'fato', ref: 'tecnico-38', html: 'Regra 19(d)(I): numa situação de visibilidade restrita, com contato apenas por radar, deve-se <b>evitar guinar para bombordo</b> em relação a embarcação por ante-a-vante do través (salvo se for alcançada).' },
      { t: 'h', txt: 'Vocabulário da plotagem' },
      { t: 'tabela', cab: ['Sigla', 'Nome', 'O que é'], linhas: [
        ['<b>R</b>', 'Navio de referência', 'O seu barco, fixo no centro da rosa.'],
        ['<b>M</b>', 'Alvo (“manobrador”)', 'O outro barco; M1, M2, M3… são suas posições relativas sucessivas.'],
        ['<b>DMR</b>', 'Direção do movimento relativo', 'A direção da reta traçada pelos pontos M1, M2…, no sentido do movimento.'],
        ['<b>VMR</b>', 'Velocidade do movimento relativo', 'Distância relativa percorrida dividida pelo tempo.'],
        ['<b>PMA</b>', 'Ponto de maior aproximação (CPA)', 'Ponto da reta DMR mais próximo de R: pé da perpendicular traçada de R à DMR. Sua distância e marcação saem do desenho.'],
        ['<b>Tempo até o PMA</b> (TCPA)', '', 'Distância de M atual até o PMA ÷ VMR.'],
      ] },
      { t: 'h', txt: 'Plotando: do eco ao vetor' },
      { t: 'lista', ordenada: true, itens: [
        '<b>Estabilize a tela</b> (norte para cima) e use a mesma escala. Meça marcação e distância do alvo em <b>intervalos iguais</b> (3 ou 6 minutos).',
        '<b>Plote</b> M1, M2, M3 na rosa de manobra, com R no centro. Use três ou mais pontos e trace a reta “filtrando” os erros: os pontos devem ficar bem distribuídos dos dois lados da reta.',
        '<b>DMR</b>: a direção da reta no sentido do movimento (cuidado para não ler o recíproco). <b>VMR</b>: distância entre M1 e o último ponto ÷ tempo. Atalhos do Miguens: intervalo de 6 minutos, VMR em nós = distância relativa em milhas × 10; intervalo de 3 minutos, VMR em nós = distância em jardas ÷ 100.',
        '<b>PMA</b>: baixe de R a perpendicular à DMR. Meça a distância e a marcação. O <b>tempo até o PMA</b> = distância de M (última posição) ao PMA ÷ VMR.',
        '<b>Triângulo de velocidades</b> (tr + rm = tm): trace tr (rumo e velocidade do seu barco, a partir do centro t), depois rm (DMR e VMR, de r para m). O vetor tm é o rumo e a velocidade do alvo. A escala de velocidades é <b>independente</b> da escala de distâncias.',
        '<b>Decida</b> e simule a manobra: refaça o triângulo com o novo rumo e/ou a nova velocidade para prever o novo PMA.',
      ] },
      { t: 'p', html: '<b>Exemplo 1.</b> Seu barco: rumo 000°, 6 nós. Observações de um alvo, de 6 em 6 minutos, a partir das 14h00:' },
      { t: 'tabela', cab: ['Hora', '1400', '1406', '1412', '1418'], linhas: [
        ['Marcação verdadeira', '060°', '063°', '067°', '074°'],
        ['Distância', '8,0 M', '6,7 M', '5,5 M', '4,3 M'],
      ] },
      { t: 'p', html: 'A marcação <b>aumenta</b> (o alvo desliza para ré, vindo de boreste) e a distância cai: não é rumo de colisão. Da plotagem sai: <b>DMR ≈ 225°</b>; distância relativa M1–M4 de 3,97 M em 18 min, logo <b>VMR ≈ 13,2 nós</b>; <b>PMA ≈ 2,1 M, na marcação 135°</b> (por ré do través), a 17 minutos da última posição, isto é, às <b>1435</b>. O triângulo de velocidades dá <b>alvo a 250°, 10 nós</b>.' },
      { t: 'figura', svg: FIG_ROSA, legenda: 'Rosa de manobra com as quatro posições do exemplo 1 (00, 06, 12 e 18 minutos, a partir das 14h00). Cada círculo vale 2 M. A perpendicular de R à DMR dá o PMA.' },
      { t: 'figura', svg: FIG_VEL, legenda: 'Diagrama de velocidades do exemplo 1. Escala: 1 nó = 10 unidades do desenho.' },
      { t: 'callout', tipo: 'dica', titulo: 'Regra de bolso: para onde o alvo passa', html: 'Alvo pela proa, do lado de boreste: se a <b>marcação aumenta</b> (vai para ré), ele vai passar <b>por ré</b> de você; se <b>diminui</b> (vai para vante), vai passar <b>pela proa</b>. Se não muda, é colisão. Do lado de bombordo o raciocínio é o espelho.' },
      { t: 'h', txt: 'Exemplo 2: rumo de colisão e escolha da manobra' },
      { t: 'p', html: 'Mesmo barco (000°, 6 nós, <b>a motor</b>). Outro alvo:' },
      { t: 'tabela', cab: ['Hora', '1400', '1406', '1412', '1418'], linhas: [
        ['Marcação', '050°', '050°', '050°', '050°'],
        ['Distância', '8,0 M', '6,8 M', '5,7 M', '4,5 M'],
      ] },
      { t: 'p', html: 'Marcação constante e distância caindo: <b>rumo de colisão</b>. VMR ≈ 11,7 nós; às 1412 faltam 5,7 M, ou cerca de <b>29 minutos</b> (colisão previsível às 1441). O alvo, pelo triângulo de velocidades, anda a 260°, 9 nós. Ele vem de boreste, cruzando. Se os dois barcos se avistarem, a Regra 15 manda você manobrar, cedo e com franqueza (Regras 8 e 16), de preferência <i>sem cruzar-lhe a proa</i>; sem se avistarem (nevoeiro, noite escura), vale a Regra 19 e os dois devem agir cedo. Veja o que cada manobra feita às 1412 produziria:' },
      { t: 'tabela', cab: ['Manobra às 1412', 'PMA previsto', 'Hora do PMA', 'Por onde passa'], linhas: [
        ['Mantém rumo e velocidade', '≈ 0 (colisão)', '1441', 'Colisão'],
        ['Guinar 60° a boreste (rumo 060°)', '2,1 M', '1433', 'O alvo cruza sua proa; você passa por <b>ré</b> dele'],
        ['Guinar 90° a boreste (rumo 090°)', '3,2 M', '1431', 'Por ré, com folga'],
        ['Guinar 60° a bombordo (rumo 300°)', '1,1 M', '1509', 'Você cruza a <b>proa dele</b>: evite'],
        ['Reduzir para 3 nós', '1,3 M', '1446', 'O alvo cruza sua proa, perto'],
        ['Parar', '2,9 M', '1445', 'O alvo cruza sua proa'],
      ], legenda: 'Valores calculados por vetores com os dados acima; numa rosa de manobra, espere diferenças de poucos décimos de milha.' },
      { t: 'p', html: 'A guinada ampla a boreste resolve, mas só enquanto não houver <b>outros alvos</b> daquele lado. Antes de guinar, plote todos. E lembre da Regra 19: na visibilidade restrita, <b>evite guinar para bombordo</b> em relação a alvo à frente do través e <b>evite guinar na direção</b> de alvo no través ou por ré. Se ouvir sinal de cerração que parece à frente do través e não houver certeza de que não há risco, reduza a velocidade ao <b>mínimo que lhe permita manter o rumo</b> (Regra 19 e), tirando todo o seguimento se necessário.' },
      { t: 'h', txt: 'Limites do método' },
      { t: 'lista', itens: [
        'O método assume que o <b>alvo mantém rumo e velocidade</b>. Se ele manobrar, a plotagem fica velha: replote.',
        'Erros de marcação (2° a 3°) e de distância distorcem a reta: por isso 3 ou mais pontos e a escala mais ampla possível.',
        'Seu <b>rumo estabilizado</b> deve estar certo. Com a tela não estabilizada (proa para cima), avaliar marcação constante fica muito mais difícil.',
        'O alvo pode não aparecer: veleiros de fibra somem no mar. <b>Na detecção radar não há garantia de reciprocidade:</b> o outro barco pode não ver você. Manobre cedo.',
        'Na visibilidade restrita (alvos que não se avistam), as regras de preferência entre embarcações à vista não se aplicam: <b>todos</b> devem agir cedo, conforme a Regra 19.',
      ] },
      { t: 'check', questoes: [
        q('m6-l5-q1', 'Navegação eletrônica', 3, 'Um alvo é plotado a cada 6 minutos: 040° a 6,0 M; 040° a 4,5 M; 040° a 3,0 M. Se ambos mantiverem rumo e velocidade, a colisão ocorrerá, a partir da última posição, em aproximadamente:',
          ['6 minutos.', '12 minutos.', '20 minutos.', '30 minutos.'], 1,
          'A distância cai 1,5 M a cada 6 minutos: VMR = 1,5 × 10 = 15 nós. Faltam 3,0 M, que a 15 nós levam 12 minutos. As demais alternativas usam velocidades relativas erradas.',
          'Miguens, vol. I, item 14.4.3 h) (regra dos seis minutos)'),
        q('m6-l5-q2', 'Navegação eletrônica', 2, 'Na rosa de manobra, o ponto de maior aproximação (PMA) é obtido:',
          ['Prolongando a DMR até a borda da rosa.', 'Traçando de R (centro) uma perpendicular à DMR e lendo sua interseção com a reta.', 'Unindo M1 a M4.', 'Traçando o vetor tm.'], 1,
          'O PMA é o ponto da reta DMR mais próximo do centro, ou seja, o pé da perpendicular a partir de R. Prolongar a DMR ou unir pontos não dá o ponto mais próximo; tm dá o rumo e a velocidade do alvo.',
          'Miguens, vol. I, item 14.4.2 a)'),
        q('m6-l5-q4', 'Navegação eletrônica', 2, 'Sob visibilidade restrita, você só tem contato radar com um alvo à frente do seu través, que não está sendo ultrapassado por você. A Regra 19(d) manda:',
          ['Guinar para bombordo, para passar por sua proa.', 'Evitar guinar para bombordo.', 'Manter rumo e velocidade, sempre.', 'Aumentar a velocidade.'], 1,
          'A Regra 19(d)(I) manda evitar alteração de rumo para bombordo em relação a embarcação por ante-a-vante do través (salvo ultrapassagem). Guinar a bombordo cruza a proa do outro; aumentar a velocidade contraria a Regra 19(b) (velocidade de segurança); manter sempre rumo é erro quando há risco.',
          'RIPEAM, Regra 19(d)(I)', U.ripeam),
        q('m6-l5-q5', 'Navegação eletrônica', 3, 'Ao reduzir a velocidade do seu barco (ou parar), as linhas de movimento relativo observadas no radar:',
          ['Giram para a vante, em direção da proa.', 'Giram para a popa.', 'Não mudam.', 'Passam a ser paralelas ao rumo do alvo.'], 0,
          'Reduzindo a velocidade, o vetor relativo passa a incluir menos do vetor próprio, e o movimento relativo observado gira para vante. Parar faz o movimento relativo ficar igual ao rumo e velocidade do alvo.',
          'Miguens, vol. I, item 14.4.5'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, itens 14.4.1 a 14.4.5 (movimento relativo, rosa de manobra, plotagem em tempo real)'),
        rip('Regras 5 a 8, 15, 16 e 19', 'tecnico-18'),
        rip('Regra 19(d)(I)', 'tecnico-38'),
      ] },
    ],
  });
  /* ---------- m6 · l6 ---------- */
  var FIG_PLAT = (function () {
    var s = '';
    s += '<rect x="0" y="0" width="400" height="250" rx="8" fill="var(--sea-1)" stroke="var(--sea-3)"/>';
    s += '<path d="M0 60 L44 60 L60 74 L180 118 L214 128 L250 196 L330 226 L400 232 L400 250 L0 250 Z" fill="var(--land)" stroke="var(--ink)"/>';
    s += '<path d="M0 0 L44 0 L44 60 L0 60 Z" fill="var(--land)" stroke="none" opacity="0"/>';
    s += '<line x1="44" y1="60" x2="400" y2="60" stroke="var(--ink)" stroke-dasharray="3 5"/>';
    s += t(300, 80, 'superfície');
    s += '<path d="M120 52 L170 52 L164 60 L126 60 Z" fill="var(--nav-white)" stroke="var(--ink)"/><line x1="145" y1="52" x2="145" y2="36" stroke="var(--ink)" stroke-width="2"/>';
    s += seta(145, 62, 145, 108, 'var(--magenta)', 1.8, '4 3');
    s += t(8, 108, 'praia') + t(70, 148, 'plataforma') + t(70, 168, 'continental');
    s += tm(150, 30, '1: sondas estáveis e rasas');
    s += '<circle cx="214" cy="128" r="5" fill="var(--nav-yellow)" stroke="var(--ink)"/>' + th(172, 104, 'borda: 130 a 200 m');
    s += th(272, 176, 'talude:') + th(272, 196, 'sondas crescem');
    s += tm(150, 242, '2: ao largo, sem fundo');
    return svg('0 0 400 250', 'Perfil do fundo na aproximação de uma costa: plataforma continental rasa, borda e talude inclinado, que a sonda denuncia antes da terra', s);
  })();

  m6.licoes.push({
    id: 'l6', titulo: 'ARPA, AIS e ecobatímetro: ajudas que também enganam', minutos: 14,
    objetivos: [
      'Dizer o que o ARPA e o AIS acrescentam à plotagem manual e quais são suas armadilhas.',
      'Combinar radar, ARPA e AIS (e vigilância visual) para evitar colisões sem confiar numa fonte só.',
      'Usar o ecobatímetro na navegação oceânica: aterragem, isóbata, posição batimétrica e leituras falsas.',
    ],
    blocos: [
      { t: 'h', txt: 'ARPA: a plotagem automática' },
      { t: 'p', html: 'O <b>ARPA</b> (<i>Automatic Radar Plotting Aid</i>) faz sozinho o que você fez na lição anterior. Ele <b>adquire</b> os ecos (de forma automática ou por seleção), os acompanha a cada varredura e calcula <b>rumo, velocidade, PMA e tempo até o PMA</b>, mostrando um vetor em cada alvo. Soa alarme se um alvo ficar com PMA e TCPA abaixo dos limites que você escolheu, e muitos aparelhos simulam uma manobra de teste. Num sistema de navio, cerca de 200 ecos são analisados ao mesmo tempo e dezenas aparecem na tela, com a solução pronta cerca de 2 minutos depois da aquisição. Radares de recreio trazem uma versão simplificada (muitas vezes chamada <b>MARPA</b>), que acompanha um número menor de alvos.' },
      { t: 'p', html: 'As vantagens são claras: menos erro humano, resultado rápido e alarme. As armadilhas também (Miguens, item 14.4.6):' },
      { t: 'lista', itens: [
        '<b>Garbage in, garbage out:</b> os vetores verdadeiros dependem do <b>rumo</b> e da <b>velocidade</b> que o seu barco fornece. Velocidade através da água ou sobre o fundo? Rumo da agulha eletrônica descalibrada? O vetor do alvo sai errado, e você não percebe.',
        '<b>Atraso:</b> o sistema precisa de alguns minutos para estabilizar a solução; quando o alvo manobra, o vetor demora a refletir. Não decida sobre um alvo recém-adquirido.',
        '<b>Troca de alvo:</b> em águas confusas, o aparelho pode “pular” de um eco para outro; perder o alvo com chuva ou mar; ou acompanhar uma nuvem.',
        '<b>Só vê o que o radar vê:</b> o veleiro de fibra que sumiu na chuva também some do ARPA.',
        'O Miguens alerta contra a tendência de aceitar o que o aparelho mostra “sem contestação”: um computador aumenta a consciência da situação, mas não dispensa uma <b>avaliação constante</b> e a <b>vigilância visual permanente</b>.',
      ] },
      { t: 'h', txt: 'AIS: o outro barco se apresenta' },
      { t: 'p', html: 'O <b>AIS</b> (você viu a base no módulo de Mestre) acrescenta o que o radar não dá: o <b>nome</b> e o <b>MMSI</b>, o tipo e o tamanho, o <b>rumo no fundo</b> (COG), a velocidade no fundo (SOG), a proa verdadeira, a <b>taxa de giro</b> e o <b>estado de navegação</b> declarado (em movimento a motor, fundeado, com manobra restrita, sem governo, pescando, navegando a vela…). Pode alcançar alvos escondidos atrás de obstáculos baixos, dentro do alcance de VHF, e faz alarme de PMA.' },
      { t: 'tabela', cab: ['', 'Radar / ARPA', 'AIS'], linhas: [
        ['<b>Quem aparece</b>', 'Qualquer alvo que reflita, ligado ou não', 'Só quem tem AIS <b>ligado</b>'],
        ['<b>Origem da posição</b>', 'Medida pelo seu radar', 'GNSS do <b>outro</b> barco (pode estar errado)'],
        ['<b>Velocidade e rumo</b>', 'Calculados a partir de pontos plotados (com atraso)', 'Informados pelo alvo: COG e SOG sobre o fundo'],
        ['<b>Identidade e intenção</b>', 'Nenhuma', 'Nome, MMSI, estado de navegação (digitado pelo operador)'],
        ['<b>Atualização</b>', 'A cada varredura da antena', 'Classe A: 2 a 10 s; classe B: em geral 30 s'],
        ['<b>Alvos escondidos</b>', 'Não vê atrás de terra', 'Às vezes vê (obstáculos baixos não bloqueiam o VHF)'],
        ['<b>Independência</b>', 'Não depende de satélite', 'Depende do GNSS dos dois barcos'],
      ] },
      { t: 'callout', tipo: 'seguranca', titulo: 'AIS é complemento, não substituto', html: 'Muitos barcos de pesca, de recreio e embarcações militares não têm AIS ou o desligam. O estado de navegação pode estar desatualizado. Um navio pode ter o AIS ligado e você, na tela dele, ser filtrado como classe B. <b>Confirme visualmente e pelo radar</b>. Se o alvo é identificado, usar o VHF para combinar a manobra só é seguro quando não há dúvida sobre quem é quem e sobre o que cada um fará; o caminho prudente é fazer a manobra que o RIPEAM manda, cedo e ampla (Regra 8), e que seja visível no radar do outro.' },
      { t: 'fato', ref: 'travessia-16', html: 'Para as categorias 0 a 3 da World Sailing, o regulamento exige <b>transponder AIS</b>, dividindo a antena VHF do topo com um divisor de baixa perda ou com antena dedicada de 38 cm ou mais, a pelo menos 3 m acima da linha d’água.' },
      { t: 'h', txt: 'O ecobatímetro na navegação oceânica' },
      { t: 'p', html: 'Na lição de Mestre você aprendeu a ler a profundidade e a usar a isóbata de segurança. No oceano, a sonda é um <b>instrumento de aterragem</b>: ela avisa que a terra está perto <b>antes</b> do radar e da visão, porque o fundo sobe antes da costa aparecer.' },
      { t: 'figura', svg: FIG_PLAT, legenda: 'Esquema, fora de escala. Ao largo, a sonda mostra “sem fundo”. Ao cruzar a borda da plataforma, as sondas começam a diminuir depressa. A largura da plataforma varia muito ao longo da costa; consulte a carta da área.' },
      { t: 'lista', itens: [
        '<b>Correr uma isóbata:</b> escolha na carta uma isóbata (por exemplo, a de 50 m) e navegue mantendo essa profundidade na sonda: se a profundidade diminui, guine para o lado do mar; se aumenta, para o lado da terra. Reduza a velocidade com visibilidade ruim.',
        '<b>Posição por transporte de isóbatas:</b> anote a hora em que a sonda cruza várias isóbatas da carta (100, 110, 120, 130, 140 m…). Em papel transparente, copie essas isóbatas e desloque-as paralelamente ao seu rumo, da distância navegada entre as horas. O ponto onde coincidem com a última dá a posição. Use três ou quatro isóbatas; <b>não vale</b> se o rumo for paralelo às isóbatas ou se o fundo tiver declive uniforme.',
        '<b>Monte submarino:</b> um pico isolado localizado pela sonda pode dar a posição. Passe sobre ele em dois rumos perpendiculares e use as profundidades mínimas de cada passagem.',
      ] },
      { t: 'h', txt: 'Leituras que enganam (e como interpretá-las)' },
      { t: 'lista', itens: [
        '<b>Velocidade do som:</b> a maioria dos ecobatímetros é calibrada para 1.463 m/s (4.800 pés/s). Na água do mar a velocidade real é quase sempre maior (cerca de 1.500 m/s): a sonda indica um valor <b>um pouco menor</b> que o real (cerca de 2,5%), o que é a favor da segurança. O Miguens ressalva que, em água doce ou extremamente fria, o som anda mais devagar que 1.463 m/s e o erro troca de sinal.',
        '<b>Cone de emissão:</b> o feixe é um cone (cerca de 60° nos de navegação). O primeiro eco vem do ponto mais próximo, que nem sempre está embaixo. Exemplo: um cume a 400 m de profundidade, 30° fora da vertical, aparece como 400 ÷ cos 30° ≈ 462 m: é a distância inclinada. Em águas profundas, os acidentes do fundo viram “hipérboles” no registro, e o mínimo da curva pode não estar sob a quilha.',
        '<b>Camada de dispersão profunda</b> (“fundo fantasma”): organismos marinhos refletem o som e criam um falso fundo, a cerca de 400 m de dia e perto da superfície à noite.',
        '<b>Eco duplo</b> (águas rasas, fundo duro) e <b>bolhas de ar</b> (máquina a ré, esteira, mar quebrado) fazem a leitura dobrar ou sumir. Reduzir o ganho elimina o eco duplo.',
        '<b>Balanço e caturro:</b> o transdutor fixo inclina o cone; num veleiro com banda a leitura pode ficar errada.',
        '<b>Referência da profundidade:</b> confira se a tela mostra profundidade abaixo do transdutor, abaixo da quilha ou desde a superfície (ajuste do offset).',
      ] },
      { t: 'fato', ref: 'extra-fechamento-cvtr-13', html: 'O ecobatímetro é obrigatório nas embarcações de grande porte ou iates construídos após 11/02/2000; para as embarcações menores o emprego é <b>recomendado</b>. Num veleiro de travessia, é um instrumento de segurança essencial.' },
      { t: 'check', questoes: [
        q('m6-l6-q1', 'Navegação eletrônica', 2, 'Qual é uma armadilha típica do ARPA?',
          ['Mostra alvos que não existem, sempre.', 'Os vetores verdadeiros dependem do rumo e da velocidade do seu barco fornecidos ao equipamento; se estiverem errados, o vetor do alvo sai errado.', 'Só funciona com visibilidade perfeita.', 'Dispensa a plotagem de qualquer outro alvo.'], 1,
          'O cálculo do rumo e da velocidade do alvo usa os dados do seu barco. Se a fonte de rumo ou velocidade estiver errada, o resultado também estará. Não se pode dizer que sempre mostra alvos falsos nem que só funciona com visibilidade perfeita. O ARPA não dispensa a vigilância.',
          'Miguens, vol. I, item 14.4.6'),
        q('m6-l6-q2', 'Navegação eletrônica', 2, 'Qual limitação do AIS é mais importante na prevenção de abalroamentos?',
          ['O AIS não funciona de noite.', 'Só mostra quem tem AIS ligado, e a posição e o estado de navegação dependem do GNSS e da configuração do outro barco.', 'O AIS mostra mais alvos que o radar.', 'O AIS dá a posição do seu barco ao radar do outro.'], 1,
          'O AIS é informação declarada pelo alvo, sem garantia de existir ou estar correta. Funciona de dia e de noite, não substitui o radar e, em geral, não vê o que não transmite.',
          'Recomendação ITU-R M.1371 (características técnicas do AIS)', 'https://www.itu.int/rec/R-REC-M.1371'),
        q('m6-l6-q3', 'Navegação eletrônica', 2, 'Um ecobatímetro calibrado a 1.463 m/s opera em água do mar, onde o som anda a cerca de 1.500 m/s. Em relação à profundidade real, a leitura será:',
          ['Ligeiramente menor (a favor da segurança).', 'Ligeiramente maior.', 'Exata.', 'Sempre igual a zero.'], 0,
          'O aparelho calcula profundidade = velocidade calibrada × tempo ÷ 2. Com a velocidade real maior, o valor indicado é menor que o real, em cerca de 2,5%. Em água extremamente fria (e em água doce fria) a velocidade é menor que a calibrada e o erro muda de sinal; o Miguens ressalva água doce e água extremamente fria.',
          'Miguens, vol. III (2026), item 38.3.2'),
        q('m6-l6-q4', 'Navegação eletrônica', 2, 'Em águas profundas, de noite, o ecobatímetro indica um “fundo” a poucas dezenas de metros, que não aparece de dia. A explicação mais provável é:',
          ['Um banco de areia móvel.', 'A camada de dispersão profunda (organismos marinhos) subindo para perto da superfície à noite.', 'O fundo duro do canal de acesso.', 'Interferência do AIS.'], 1,
          'Zooplâncton e pequenos organismos formam um falso fundo que fica por volta de 400 m de dia e perto da superfície à noite. Um banco de areia não se move assim; o fundo duro não é fenômeno noturno; AIS não interfere na sonda.',
          'Miguens, vol. III (2026), item 38.3.2'),
      ] },
      { t: 'fontes', itens: [
        man1('cap. 14, item 14.4.6 (sistemas automáticos de radar anticolisão)'),
        man3('cap. 38, itens 38.3.1 a 38.3.3 (navegação batimétrica e interpretação do ecobatímetro)', 'tecnico-191'),
        { txt: 'World Sailing, Offshore Special Regulations 2026-2027 (extrato Cat. 1), OSR 3.29.7 (AIS)', url: U.osr, ref: 'travessia-16' },
        nor('art. 4.19.3 b) (ecobatímetro)', 'extra-fechamento-cvtr-13'),
      ] },
    ],
  });
  /* ==================================================================================================
     m7 — Estabilidade (Anexo 5-A, 1.4 a) e b))
     ================================================================================================== */
  var m7 = {
    id: 'm7', titulo: 'Estabilidade',
    resumo: 'Por que o veleiro volta (ou não volta) à posição de equilíbrio: G, B, M e a altura metacêntrica, o braço de endireitamento GZ e a curva de estabilidade, banda permanente, superfície livre, o que muda ao longo da viagem e com as modificações no barco, e o que isso significa para um veleiro de quilha lastrada em travessia oceânica. Programa oficial: NORMAM-211, Anexo 5-A, item 1.4 a) e b).',
    licoes: []
  };
  M.push(m7);

  /* Casco de seção transversal de um veleiro de quilha (escala 40 px/m; linha d’água em y = 147, quilha em y = 215). */
  function cascoPath(cx) {
    return 'M' + (cx - 64) + ' 111 L' + (cx + 64) + ' 111 Q' + (cx + 61) + ' 150 ' + (cx + 21) + ' 186 L' + (cx + 12) + ' 215 L' + (cx - 12) + ' 215 L' + (cx - 21) + ' 186 Q' + (cx - 61) + ' 150 ' + (cx - 64) + ' 111 Z';
  }
  function rot(p, c, deg) { var a = deg * Math.PI / 180, dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)]; }
  function pto(p, cor) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" fill="' + (cor || 'var(--ink)') + '"/>'; }

  /* ---------- m7 · l1 ---------- */
  var FIG_GBM = (function () {
    var s = '', c1 = 97, c2 = 302, WL = 147, phi = 15;
    // painel 1: barco direito
    s += '<rect x="0" y="0" width="195" height="240" rx="8" ' + SEA + '/>';
    s += '<path d="' + cascoPath(c1) + '" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.5"/>';
    s += '<rect x="1" y="' + WL + '" width="193" height="92" fill="var(--sea-3)" fill-opacity="0.38"/>';
    s += '<line x1="1" y1="' + WL + '" x2="194" y2="' + WL + '" stroke="var(--ink)" stroke-dasharray="4 3"/>';
    s += '<line x1="' + c1 + '" y1="100" x2="' + c1 + '" y2="215" stroke="var(--ink)" stroke-opacity="0.5" stroke-dasharray="2 3"/>';
    s += pto([c1, 133], 'var(--magenta)') + pto([c1, 167]) + pto([c1, 185]) + pto([c1, 215]);
    s += tm(c1 + 9, 129, 'M') + t(c1 + 9, 162, 'G', 'font-weight="700"') + t(c1 + 9, 190, 'B', 'font-weight="700"') + t(c1 + 9, 212, 'K', 'font-weight="700"');
    s += t(8, 22, 'Barco direito', 'font-weight="700"');
    // painel 2: banda de 15 graus
    s += '<rect x="205" y="0" width="195" height="240" rx="8" ' + SEA + '/>';
    s += '<g transform="rotate(' + phi + ' ' + c2 + ' ' + WL + ')"><path d="' + cascoPath(c2) + '" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.5"/></g>';
    s += '<rect x="206" y="' + WL + '" width="193" height="92" fill="var(--sea-3)" fill-opacity="0.38"/>';
    s += '<line x1="206" y1="' + WL + '" x2="399" y2="' + WL + '" stroke="var(--ink)" stroke-dasharray="4 3"/>';
    var C = [c2, WL], G = rot([c2, 167], C, phi), Mm = rot([c2, 133], C, phi), Bv = [Mm[0], Mm[1] + 52], Z = [Mm[0], G[1]];
    s += '<line x1="' + Mm[0].toFixed(1) + '" y1="' + (Mm[1] - 6).toFixed(1) + '" x2="' + Bv[0].toFixed(1) + '" y2="' + (Bv[1] + 14).toFixed(1) + '" ' + MG + ' stroke-width="2"/>';
    s += '<line x1="' + G[0].toFixed(1) + '" y1="' + G[1].toFixed(1) + '" x2="' + Z[0].toFixed(1) + '" y2="' + Z[1].toFixed(1) + '" ' + MG + ' stroke-width="4"/>';
    s += seta(G[0], G[1] + 4, G[0], G[1] + 40, 'var(--ink)', 2.2);
    s += seta(Bv[0] + 6, Bv[1] + 2, Bv[0] + 6, Mm[1] + 14, 'var(--magenta)', 2.2);
    s += pto(G) + pto(Mm, 'var(--magenta)') + pto(Bv) + pto(Z, 'var(--magenta)');
    s += th(G[0] - 24, G[1] - 4, 'G', 'font-weight="700"') + thm(Mm[0] + 8, Mm[1] - 2, 'M') + th(Bv[0] + 14, Bv[1] + 16, 'B′', 'font-weight="700"') + thm(Z[0] + 10, Z[1] + 4, 'Z');
    s += thm(G[0] - 40, G[1] + 26, 'GZ');
    s += t(213, 22, 'Banda de 15°', 'font-weight="700"');
    s += t(6, 262, 'GM = KM − KG = 2,05 − 1,20 = 0,85 m') + t(6, 282, 'GZ ≈ GM × sen 15° = 0,22 m');
    return svg('0 0 400 292', 'Seção transversal de um veleiro de quilha: pontos K, B, G e M com o barco direito e com banda de 15 graus, mostrando o braço de endireitamento GZ', s);
  })();

  var FIG_EQUIL = (function () {
    var s = '', W = 130, i;
    var titulos = ['Estável', 'Indiferente', 'Instável'], sub = ['M acima de G', 'M igual a G', 'M abaixo de G'], gm = ['GM > 0', 'GM = 0', 'GM < 0'];
    for (i = 0; i < 3; i++) {
      var x0 = i * (W + 5), cx = x0 + W / 2;
      s += '<rect x="' + x0 + '" y="0" width="' + W + '" height="200" rx="8" ' + SEA + '/>';
      s += t(x0 + 8, 22, titulos[i], 'font-weight="700"');
      if (i === 0) s += '<path d="M' + (x0 + 14) + ' 70 Q' + cx + ' 150 ' + (x0 + W - 14) + ' 70" fill="none" stroke="var(--ink)" stroke-width="2.5"/><circle cx="' + cx + '" cy="104" r="9" fill="var(--magenta)"/>';
      if (i === 1) s += '<line x1="' + (x0 + 14) + '" y1="120" x2="' + (x0 + W - 14) + '" y2="120" stroke="var(--ink)" stroke-width="2.5"/><circle cx="' + cx + '" cy="111" r="9" fill="var(--magenta)"/>';
      if (i === 2) s += '<path d="M' + (x0 + 14) + ' 140 Q' + cx + ' 60 ' + (x0 + W - 14) + ' 140" fill="none" stroke="var(--ink)" stroke-width="2.5"/><circle cx="' + cx + '" cy="89" r="9" fill="var(--magenta)"/>';
      s += t(x0 + 8, 168, sub[i]) + t(x0 + 8, 188, gm[i], 'font-weight="700"');
    }
    return svg('0 0 400 206', 'Três condições de equilíbrio: estável, indiferente e instável, comparadas a uma bola numa tigela, num plano e sobre uma elevação', s);
  })();

  m7.licoes.push({
    id: 'l1', titulo: 'G, B, M e a altura metacêntrica: por que o barco volta', minutos: 13,
    objetivos: [
      'Definir centro de gravidade (G), centro de carena (B), metacentro (M) e altura metacêntrica (GM).',
      'Calcular GM = KM − KG e interpretar o sinal (equilíbrio estável, indiferente ou instável).',
      'Explicar o binário de endireitamento e o que faz o GM subir ou descer.',
    ],
    blocos: [
      { t: 'p', html: 'No curso de Arrais-Amador você aprendeu que peso baixo deixa o barco mais firme. Aqui vamos dar nomes e números a essa ideia, pois as questões de estabilidade do Capitão-Amador pedem os conceitos e as contas simples.' },
      { t: 'fato', ref: 'extra-capitao-2-01', html: 'Pela NORMAM-211, <b>estabilidade intacta</b> é a propriedade que tem a embarcação de retornar à sua posição inicial de equilíbrio, depois de cessada a força perturbadora que dela a afastou, considerando-se a situação de integridade estrutural da embarcação.' },
      { t: 'h', txt: 'Os pontos notáveis' },
      { t: 'lista', itens: [
        '<b>K</b>: ponto de referência na quilha (a linha de base, o ponto mais baixo do casco). As alturas se medem a partir dele: KG, KB, KM.',
        '<b>G, centro de gravidade:</b> onde se pode imaginar concentrado o peso do barco, com tudo a bordo. O peso atua para baixo, em G. G muda quando o peso é movido, embarcado ou consumido.',
        '<b>B, centro de carena (ou de empuxo):</b> o centro do volume de água deslocado pelo casco (a parte imersa). O empuxo atua para cima, em B. B muda quando o barco inclina, porque o formato do volume imerso muda.',
        '<b>M, metacentro transversal:</b> ponto em que a vertical que passa por B, com o barco inclinado de pouco, corta a linha de centro. Para pequenos ângulos (até cerca de 10°), M pode ser considerado fixo.',
        '<b>GM, altura metacêntrica:</b> distância de G a M. É a medida da estabilidade inicial.',
      ] },
      { t: 'p', html: 'Com o barco direito e em repouso, o peso (em G) e o empuxo (em B) são iguais e ficam na mesma vertical. Quando uma força (vento, onda) inclina o barco, o volume imerso muda de forma, B se desloca para o lado que afundou, e o peso e o empuxo deixam de estar alinhados: forma-se um <b>binário</b>. Se M estiver acima de G, esse binário tende a <b>empurrar o barco de volta</b>. A distância horizontal entre as duas forças é o <b>braço de endireitamento GZ</b>.' },
      { t: 'figura', svg: FIG_GBM, legenda: 'Exemplo ilustrativo de um veleiro de 6 t (a 15° de banda). Seta preta: peso, em G; seta magenta: empuxo, em B′. A vertical de B′ passa por M; Z é o pé da perpendicular a partir de G, e GZ é o braço do binário.' },
      { t: 'h', txt: 'As contas' },
      { t: 'lista', itens: [
        '<b>KM = KB + BM</b>. KB é a altura de B sobre a quilha. BM é a distância entre B e M e vale <b>BM = I ÷ V</b>, onde I é o momento de inércia da linha d’água em relação ao eixo longitudinal e V é o volume deslocado. Como I cresce com a <b>boca ao cubo</b>, barcos largos têm BM grande.',
        '<b>GM = KM − KG</b>.',
        '<b>GZ ≈ GM × sen φ</b> (pequenos ângulos), onde φ é o ângulo de inclinação.',
        '<b>Momento de endireitamento = deslocamento × g × GZ</b>.',
      ] },
      { t: 'p', html: '<b>Exemplo (veleiro de cruzeiro de 32 pés, números ilustrativos; no seu barco, use os seus dados):</b> deslocamento 6.000 kg; KB = 0,75 m; BM = 1,30 m; logo KM = 2,05 m. Com KG = 1,20 m (lastro baixo), <b>GM = 0,85 m</b>. A 15° de banda, GZ ≈ 0,85 × 0,259 = <b>0,22 m</b>, e o momento de endireitamento é 6.000 × 9,81 × 0,22 ≈ <b>12,9 kN·m</b>. Se um peso alto subir KG para 1,50 m, o GM cai para 0,55 m e o momento, nesse ângulo, vai a 8,4 kN·m, cerca de dois terços.' },
      { t: 'h', txt: 'Condições de equilíbrio' },
      { t: 'figura', svg: FIG_EQUIL, legenda: 'A bola (G) na tigela volta para o centro; no plano, fica onde for deixada; sobre a elevação, rola para longe.' },
      { t: 'tabela', cab: ['Condição', 'GM', 'O que acontece quando o barco inclina'], linhas: [
        ['<b>Equilíbrio estável</b>', 'positivo (M acima de G)', 'Surge um momento que o devolve à posição inicial.'],
        ['<b>Equilíbrio indiferente</b>', 'zero (M = G)', 'Não há momento de volta: o barco fica na posição em que for deixado, e qualquer perturbação adicional o leva mais longe.'],
        ['<b>Equilíbrio instável</b>', 'negativo (M abaixo de G)', 'O momento aumenta a inclinação. O barco vai até um ângulo em que a forma do casco gere um momento contrário (o <i>ângulo de loll</i>, lição 3) ou emborca.'],
      ] },
      { t: 'callout', tipo: 'nota', titulo: 'GM grande é sempre bom?', html: 'Não. GM muito alto dá um barco <b>duro</b> (período de balanço curto, movimento brusco, cansativo e agressivo para a tripulação e o equipamento). GM muito baixo dá um barco <b>mole</b>, que balança devagar e inclina muito com pouco vento. O período de balanço T é aproximadamente T = 2π k ÷ √(g · GM), com k o raio de giração: quanto menor o GM, maior o período. Em veleiros de cruzeiro, valores da ordem de meio a um metro são comuns (confira no manual do seu barco), mas é a curva inteira (próxima lição) que decide.' },
      { t: 'termos', ids: ['estabilidade', 'banda', 'lastro', 'quilha', 'calado', 'balanco'] },
      { t: 'check', questoes: [
        q('m7-l1-q1', 'Estabilidade', 1, 'Um veleiro tem KM = 2,10 m e KG = 1,30 m. A altura metacêntrica (GM) é:',
          ['0,80 m.', '3,40 m.', '1,30 m.', '2,10 m.'], 0,
          'GM = KM − KG = 2,10 − 1,30 = 0,80 m. 3,40 m soma em vez de subtrair. 1,30 m é só o KG e 2,10 m é só o KM.',
          'USNA EN400, cap. 4 (GM = KM − KG)', U.usna4),
        q('m7-l1-q2', 'Estabilidade', 2, 'Um barco está em equilíbrio instável quando:',
          ['O metacentro M está acima do centro de gravidade G.', 'M coincide com G.', 'M está abaixo de G (GM negativo).', 'G está sobre a quilha.'], 2,
          'Com GM negativo, o binário formado ao inclinar aumenta a inclinação. M acima de G é o equilíbrio estável; M igual a G, o indiferente.',
          'USNA EN400, cap. 4 (equilíbrio estável, neutro e instável)', U.usna4),
        q('m7-l1-q3', 'Estabilidade', 2, 'Qual mudança, mantidos os demais fatores, MAIS eleva o BM (e portanto a estabilidade inicial) de um casco?',
          ['Aumentar a boca (largura) na linha d’água.', 'Subir o mastro.', 'Aumentar o comprimento do cabo de fundeio.', 'Diminuir o lastro.'], 0,
          'BM = I ÷ V e I cresce com a boca ao cubo. Subir o mastro eleva G (piora GM). O cabo de fundeio não altera a forma do casco, e menos lastro eleva G.',
          'Rawson e Tupper, Basic Ship Theory; USNA EN400, cap. 4'),
        q('m7-l1-q4', 'Estabilidade', 2, 'Com o barco inclinado, o binário de endireitamento é formado por:',
          ['O peso, aplicado em G, e o empuxo, aplicado em B′ (novo centro de carena), separados horizontalmente por GZ.', 'O peso e o vento.', 'O empuxo e a força da quilha.', 'Duas forças ambas aplicadas em G.'], 0,
          'O peso fica em G; o empuxo, em B, que se deslocou para o bordo que afundou. A distância horizontal entre as duas retas de ação é GZ. O vento é a força inclinadora, não faz parte do binário de endireitamento.',
          'USNA EN400, cap. 4 (braço de endireitamento)', U.usna4),
      ] },
      { t: 'fontes', itens: [
        nor('Glossário (estabilidade intacta)', 'extra-capitao-2-01'),
        { txt: 'USNA, EN400 Principles of Ship Performance, cap. 4 (Stability): GM, KM, GZ, equilíbrio e superfície livre', url: U.usna4 },
        { txt: 'Rawson e Tupper, Basic Ship Theory (Butterworth-Heinemann), cap. 4: estabilidade transversal inicial' },
      ] },
    ],
  });
  /* ---------- m7 · l2 ---------- */
  var GZ_PTS = [[0, 0], [10, 0.15], [20, 0.29], [30, 0.40], [40, 0.46], [50, 0.49], [60, 0.48], [70, 0.43], [80, 0.36], [90, 0.27], [100, 0.17], [110, 0.08], [122, 0], [130, -0.06]];
  function gzAt(a) {
    for (var i = 0; i < GZ_PTS.length - 1; i++) { var p = GZ_PTS[i], q2 = GZ_PTS[i + 1]; if (a >= p[0] && a <= q2[0]) return p[1] + (q2[1] - p[1]) * (a - p[0]) / (q2[0] - p[0]); }
    return 0;
  }
  function curvaSuave(pts) {
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  var FIG_GZ = (function () {
    var X0 = 48, KX = 2.615, Y0 = 214, KY = 300, s = '';
    var X = function (a) { return X0 + a * KX; }, Y = function (g) { return Y0 - g * KY; };
    var pts = GZ_PTS.map(function (p) { return [X(p[0]), Y(p[1])]; });
    // área positiva até 122°
    var area = 'M' + X(0) + ' ' + Y(0);
    GZ_PTS.forEach(function (p) { if (p[0] <= 122) area += ' L' + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); });
    area += ' Z';
    s += '<rect x="0" y="0" width="400" height="290" rx="8" fill="none"/>';
    s += '<path d="' + area + '" fill="var(--sea-3)" fill-opacity="0.45"/>';
    // eixos e marcas
    s += '<line x1="' + X0 + '" y1="' + Y0 + '" x2="392" y2="' + Y0 + '" stroke="var(--ink)" stroke-width="1.5"/><line x1="' + X0 + '" y1="26" x2="' + X0 + '" y2="236" stroke="var(--ink)" stroke-width="1.5"/>';
    [0, 30, 60, 90, 120].forEach(function (a) { s += '<line x1="' + X(a) + '" y1="' + Y0 + '" x2="' + X(a) + '" y2="' + (Y0 + 5) + '" stroke="var(--ink)"/>' + t(X(a) - (a >= 100 ? 14 : a >= 10 ? 8 : 4), 254, String(a)); });
    [0.2, 0.4, 0.6].forEach(function (g) { s += '<line x1="' + (X0 - 5) + '" y1="' + Y(g) + '" x2="' + X0 + '" y2="' + Y(g) + '" stroke="var(--ink)"/>' + t(6, Y(g) + 5, String(g).replace('.', ',')); });
    s += t(8, 20, 'GZ (m)', 'font-weight="700"') + t(150, 280, 'inclinação (graus)');
    // tangente (inclinação = GM)
    var aT = 0.6 / 0.85 * 180 / Math.PI;
    s += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(aT).toFixed(1) + '" y2="' + Y(0.6) + '" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="6 4"/>' + t(X(aT) + 8, 34, 'tangente: inclinação = GM');
    // braço do vento (inclinador)
    var hl = []; for (var a = 0; a <= 88; a += 4) hl.push([X(a), Y(0.16 * Math.cos(a * Math.PI / 180) * Math.cos(a * Math.PI / 180))]);
    s += '<path d="' + curvaSuave(hl) + '" fill="none" ' + MG + ' stroke-width="2" stroke-dasharray="5 3"/>' + thm(104, 192, 'vento');
    // equilíbrio
    var ae = 0; for (a = 1; a < 60; a += 0.1) { if (gzAt(a) >= 0.16 * Math.pow(Math.cos(a * Math.PI / 180), 2)) { ae = a; break; } }
    s += '<circle cx="' + X(ae).toFixed(1) + '" cy="' + Y(gzAt(ae)).toFixed(1) + '" r="5" fill="var(--magenta)"/>' + thm(120, 152, 'banda ≈ ' + Math.round(ae) + '°') + '<line x1="' + (X(ae) + 6).toFixed(1) + '" y1="' + (Y(gzAt(ae)) - 2).toFixed(1) + '" x2="118" y2="148" stroke="var(--magenta)"/>';
    // curva GZ
    s += '<path d="' + curvaSuave(pts) + '" fill="none" stroke="var(--ink)" stroke-width="3"/>';
    // GZ máx
    s += '<line x1="' + X(50) + '" y1="' + Y(0.49) + '" x2="' + X(50) + '" y2="' + Y0 + '" stroke="var(--ink)" stroke-dasharray="3 3"/><circle cx="' + X(50) + '" cy="' + Y(0.49) + '" r="4" fill="var(--ink)"/>' + t(X(50) + 8, Y(0.49) - 8, 'GZ máx. 0,49 m a 50°');
    // alagamento
    s += '<line x1="' + X(75) + '" y1="' + Y(gzAt(75)) + '" x2="' + X(75) + '" y2="' + Y0 + '" stroke="var(--ink)" stroke-dasharray="3 3"/>' + t(X(75) - 6, 204, 'alagamento 75°', 'transform="rotate(-90 ' + (X(75) - 6) + ' 204)"');
    // AVS
    s += '<circle cx="' + X(122) + '" cy="' + Y0 + '" r="5" fill="var(--magenta)"/>' + thm(296, 238, 'AVS 122°');
    return svg('0 0 400 290', 'Curva de estabilidade estática de um veleiro de quilha: braço GZ em função da inclinação, tangente na origem, GZ máximo, ângulo de alagamento, ângulo de estabilidade nula e braço do vento', s);
  })();

  m7.licoes.push({
    id: 'l2', titulo: 'Braço de endireitamento GZ e a curva de estabilidade', minutos: 13,
    objetivos: [
      'Ler uma curva de estabilidade estática: GM na origem, GZ máximo, ângulo de alagamento e ângulo de estabilidade nula.',
      'Relacionar a área sob a curva com a energia que o barco tem para resistir a uma rajada ou onda.',
      'Dizer por que a curva importa mais que o GM sozinho e o que a deforma.',
    ],
    blocos: [
      { t: 'p', html: 'O GM só descreve o início do movimento (inclinações de poucos graus). Um barco que tem GM bom, mas perde o braço de endireitamento aos 60°, pode emborcar numa onda. Por isso se traça o <b>GZ para todos os ângulos</b>: é a curva de estabilidade estática.' },
      { t: 'h', txt: 'Como o GZ varia' },
      { t: 'p', html: 'Para pequenos ângulos, <b>GZ = GM × sen φ</b>: o GZ cresce quase em linha reta. Com ângulos maiores, o barco muda de forma: a boca sai da água de um lado e entra no outro, e o metacentro M não é mais fixo. O GZ cresce <b>cada vez mais devagar</b>, passa por um máximo, e depois <b>diminui até zero</b>. Se o barco passa desse ponto, o GZ fica negativo: o binário passa a ajudar a emborcar. O ângulo em que o GZ chega a zero é o <b>ângulo de estabilidade nula</b> ou <b>limite de estabilidade</b> (em inglês, <i>angle of vanishing stability</i>, AVS).' },
      { t: 'figura', svg: FIG_GZ, legenda: 'Curva ilustrativa de um veleiro de cruzeiro de 32 pés, 6 t (não é de nenhum modelo real; a curva do seu barco terá outra forma). A área sombreada, em m·graus, é a energia de endireitamento.' },
      { t: 'tabela', cab: ['O que ler', 'Significado'], linhas: [
        ['<b>Inclinação da curva na origem</b>', 'Igual ao GM (a tangente cruza GZ = GM aos 57,3°). Mede a estabilidade inicial.'],
        ['<b>GZ máximo e o ângulo em que ocorre</b>', 'O maior braço de endireitamento. Se o momento inclinador (vento, onda) passa do máximo, o barco não se equilibra mais.'],
        ['<b>Ângulo de alagamento</b>', 'Ângulo em que uma abertura sem fechamento estanque (escotilha, porta, respiro) vai à água. Dali em diante o barco pode encher, perdendo flutuação e estabilidade; a parte útil da curva termina ali.'],
        ['<b>Ângulo de estabilidade nula (AVS)</b>', 'Ângulo em que GZ volta a zero. Além dele, o barco tende a emborcar. Num veleiro de cruzeiro, quanto maior, melhor.'],
        ['<b>Área sob a curva</b>', 'Energia que o barco absorve antes de chegar ao limite (estabilidade dinâmica), em m·graus. Uma rajada ou onda precisa de menos energia que isso.'],
      ] },
      { t: 'h', txt: 'O braço do vento e o ponto de equilíbrio' },
      { t: 'p', html: 'O vento nas velas cria um <b>braço inclinador</b> (curva magenta), que diminui com a inclinação (a vela fica mais deitada e o vento incide menos: aproximadamente com o cosseno ao quadrado). No ponto em que o braço inclinador iguala o GZ, o barco se equilibra. No desenho, com esse vento, a banda fica em torno de <b>10°</b>. Numa <b>rajada forte</b>, o braço inclinador sobe. Se ele passar do GZ máximo, não existe mais ponto de equilíbrio e o barco inclina até tombar. É por isso que se <b>reduz pano antes</b> da rajada, e não depois.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'Uma curva boa tem três coisas', html: '(1) <b>GM positivo e suficiente</b> (inclinação inicial boa); (2) <b>GZ máximo alto</b>, num ângulo que o barco raramente atinge; (3) <b>ângulo de estabilidade nula alto</b> e ângulo de alagamento maior que o ponto de GZ máximo. Os regulamentos de oceano medem esses três itens (módulo de Travessia e a última lição deste módulo).' },
      { t: 'h', txt: 'O que deforma a curva' },
      { t: 'tabela', cab: ['Mudança', 'Efeito'], linhas: [
        ['Mais lastro ou lastro mais baixo (G abaixo)', 'Sobe GZ em todos os ângulos e alarga a curva (AVS maior).'],
        ['Peso alto (G acima)', 'Reduz o GZ em todos os ângulos, tira área e encurta o AVS.'],
        ['Boca maior', 'Aumenta o GZ nos primeiros ângulos (estabilidade de forma). Em cascos muito largos e rasos, porém, o AVS pode diminuir, e o barco emborcado pode ficar estável de cabeça para baixo.'],
        ['Borda-livre maior e superestrutura estanque', 'Entra mais tarde na água e estende a curva.'],
        ['Aberturas que alagam cedo', 'Cortam a parte útil da curva no ângulo de alagamento.'],
        ['Superfície livre', 'Subtrai FSC × sen φ do GZ (lição 4).'],
      ] },
      { t: 'check', questoes: [
        q('m7-l2-q1', 'Estabilidade', 2, 'Em um barco com GM = 0,90 m, o braço de endireitamento a 10° de inclinação (pequeno ângulo) é, aproximadamente:',
          ['0,16 m.', '0,09 m.', '0,90 m.', '5,2 m.'], 0,
          'GZ ≈ GM × sen 10° = 0,90 × 0,174 = 0,156 m ≈ 0,16 m. 0,09 m divide o GM por 10. 0,90 m é o próprio GM. 5,2 m multiplica por 5,76 (inverso da relação).',
          'USNA EN400, cap. 4'),
        q('m7-l2-q2', 'Estabilidade', 2, 'Continuando a inclinar um veleiro além da banda de GZ máximo, o que acontece com os valores de GZ?',
          ['Continuam crescendo sem limite.', 'Diminuem até chegar a zero no ângulo de estabilidade nula e depois ficam negativos.', 'Ficam constantes.', 'Dobram a cada 10°.'], 1,
          'A curva sobe até um máximo, depois cai e cruza o zero no ângulo de estabilidade nula; além dele o binário ajuda a emborcar. Não cresce sem limite, não é constante e não dobra.',
          'USNA EN400, cap. 4 (curva de estabilidade estática)', U.usna4),
        q('m7-l2-q3', 'Estabilidade', 2, 'A área sob a curva de GZ, entre 0° e o ângulo de estabilidade nula, representa:',
          ['A energia (estabilidade dinâmica) que o barco pode absorver antes de emborcar.', 'O consumo de combustível.', 'A velocidade máxima do barco.', 'O deslocamento do barco.'], 0,
          'A integral do GZ é proporcional ao trabalho do binário de endireitamento: energia absorvida de rajadas e ondas. Os demais itens não têm relação com a área da curva.',
          'World Sailing, OSR 3.04.2 (m·AGZ); USNA EN400, cap. 4'),
        q('m7-l2-q4', 'Estabilidade', 3, 'Para um veleiro de quilha lastrada, qual alteração DIMINUI o ângulo de estabilidade nula?',
          ['Baixar o centro de gravidade (mais lastro).', 'Colocar peso alto, como um bote cheio de equipamento no teto da cabine.', 'Fechar bem as escotilhas e manter o cockpit estanque.', 'Reduzir o pano antes da rajada.'], 1,
          'Peso alto eleva G e reduz o GZ em todos os ângulos, encurtando a curva. As outras ações melhoram a curva (lastro baixo, estanqueidade) ou reduzem o momento inclinador (reduzir pano).',
          'Rawson e Tupper, Basic Ship Theory; USNA EN400, cap. 4'),
      ] },
      { t: 'fontes', itens: [
        { txt: 'USNA, EN400, cap. 4 (curva de estabilidade, estabilidade dinâmica, alagamento)', url: U.usna4 },
        { txt: 'World Sailing, Offshore Special Regulations 2026-2027 (extrato Cat. 1), OSR 3.04.2 (AVS e energia de endireitamento)', url: U.osr, ref: 'travessia-11' },
      ] },
    ],
  });
  /* ---------- m7 · l3 ---------- */
  function miniCasco(x0, ang, extra) {
    var S = 0.7, W = 130, tx = x0 + W / 2 - 97 * S, ty = 112 - 147 * S, s = '';
    var WLy = ty + 147 * S;
    s += '<rect x="' + x0 + '" y="0" width="' + W + '" height="200" rx="8" ' + SEA + '/>';
    s += '<g transform="translate(' + tx.toFixed(1) + ',' + ty.toFixed(1) + ') scale(' + S + ')">';
    s += '<g transform="rotate(' + ang + ' 97 147)"><path d="' + cascoPath(97) + '" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="2"/><line x1="97" y1="111" x2="97" y2="20" stroke="var(--ink)" stroke-width="3"/>';
    s += (extra && extra.inner) || '';
    s += '</g></g>';
    s += '<rect x="' + (x0 + 1) + '" y="' + WLy.toFixed(1) + '" width="' + (W - 2) + '" height="' + (192 - WLy).toFixed(1) + '" fill="var(--sea-3)" fill-opacity="0.38"/>';
    s += '<line x1="' + (x0 + 1) + '" y1="' + WLy.toFixed(1) + '" x2="' + (x0 + W - 1) + '" y2="' + WLy.toFixed(1) + '" stroke="var(--ink)" stroke-dasharray="4 3"/>';
    return s;
  }
  var FIG_LIST = (function () {
    var W = 130, s = '';
    s += miniCasco(0, 14, { inner: '<circle cx="97" cy="167" r="6" fill="var(--ink)"/>' });
    s += seta(8, 60, 44, 60, 'var(--magenta)', 3) + tm(8, 46, 'vento');
    s += t(8, 22, 'Banda do vento', 'font-weight="700"') + t(8, 168, 'temporária') + t(8, 188, 'GM > 0: volta');
    s += miniCasco(W + 5, 7, { inner: '<circle cx="106" cy="167" r="6" fill="var(--ink)"/><rect x="118" y="150" width="14" height="14" fill="var(--magenta)"/>' });
    s += t(W + 13, 22, 'Permanente', 'font-weight="700"') + t(W + 13, 168, 'G descentrado') + t(W + 13, 188, 'GM > 0');
    s += miniCasco(2 * (W + 5), 18, { inner: '<circle cx="97" cy="124" r="6" fill="var(--ink)"/>' });
    s += '<g opacity="0.45" transform="translate(' + (2 * (W + 5) + W / 2 - 97 * 0.7).toFixed(1) + ',' + (112 - 147 * 0.7).toFixed(1) + ') scale(0.7)"><g transform="rotate(-18 97 147)"><path d="' + cascoPath(97) + '" fill="none" stroke="var(--ink)" stroke-dasharray="6 4" stroke-width="2"/></g></g>';
    s += t(2 * (W + 5) + 8, 22, 'Loll', 'font-weight="700"') + t(2 * (W + 5) + 8, 168, 'G acima de M') + t(2 * (W + 5) + 8, 188, 'GM < 0');
    return svg('0 0 400 200', 'Três tipos de inclinação: banda temporária causada pelo vento, banda permanente por peso fora do centro e loll por GM negativo', s);
  })();

  m7.licoes.push({
    id: 'l3', titulo: 'Banda permanente: causas e correção', minutos: 12,
    objetivos: [
      'Distinguir a banda do vento (temporária) da banda permanente e do ângulo de loll.',
      'Calcular a banda produzida pelo deslocamento de um peso e o peso necessário para corrigi-la.',
      'Saber corrigir cada tipo de banda permanente, e por que os procedimentos são diferentes.',
    ],
    blocos: [
      { t: 'p', html: 'Num veleiro, a <b>banda</b> faz parte da vida: o vento nas velas inclina o barco, e isso é normal. A <b>banda permanente</b> é outra coisa: o barco fica <b>inclinado para um bordo mesmo sem vento e sem ondas</b>, parado ou navegando em águas calmas. É um sinal de que algo está errado com a distribuição de pesos, ou com a própria estabilidade.' },
      { t: 'figura', svg: FIG_LIST, legenda: 'Esquema de três situações. À direita, o contorno tracejado mostra o outro bordo, para onde o barco com GM negativo oscila.' },
      { t: 'h', txt: 'Causa 1: o peso está fora da linha de centro (GM positivo)' },
      { t: 'p', html: 'Se o centro de gravidade G fica fora do plano de simetria, o barco inclina até que G e B fiquem na mesma vertical. Causas comuns:' },
      { t: 'lista', itens: [
        '<b>Consumo desigual</b> de tanques de combustível ou de água, de um só bordo.',
        '<b>Pesos mal estivados:</b> âncora, amarra, caixas, equipamentos e tripulantes concentrados num bordo.',
        '<b>Água embarcada de um lado</b> só (água na sentina que se acumula no bordo baixo, alagamento assimétrico de compartimento).',
        '<b>Avaria</b> que alaga um lado, ou perda de um peso do outro bordo (por exemplo, sai uma balsa ou um tanque do bordo alto).',
      ] },
      { t: 'p', html: 'Para pequenos ângulos, a banda θ produzida por um peso w deslocado de uma distância transversal d é:' },
      { t: 'p', html: '<b>tan θ = (w × d) ÷ (Δ × GM)</b>' },
      { t: 'p', html: 'com Δ o deslocamento do barco. <b>Exemplos</b> (veleiro de 6.000 kg com GM = 0,85 m): 100 kg movidos por 1,5 m produzem tan θ = 150 ÷ 5.100 = 0,029, ou <b>1,7°</b>; 300 kg movidos por 1,5 m produzem <b>5,0°</b>. Com o mesmo peso e um GM de apenas 0,40 m, os 100 kg já produzem <b>3,6°</b>: uma banda grande por pouco peso é <b>sinal de GM baixo</b>. Esta mesma fórmula é a base da prova de inclinação (lição 6).' },
      { t: 'p', html: '<b>Correção:</b> recoloque os pesos. Para tirar uma banda de 3° (tan θ = 0,052) no barco do exemplo, é preciso transferir momento w × d = 6.000 × 0,85 × 0,052 ≈ 267 kg·m: 100 kg a 2,7 m do outro lado, ou 200 kg a 1,3 m. Use primeiro os pesos sólidos (equipamentos, bagagem); equilibre o consumo de tanques; esgote a água. Evite transferir líquidos de tanque para tanque no mar: no meio do caminho, os dois ficam semicheios (superfície livre, lição 4).' },
      { t: 'h', txt: 'Causa 2: GM negativo e o ângulo de loll' },
      { t: 'p', html: 'Se G fica <b>acima</b> de M (GM negativo), o equilíbrio na vertical é instável. O barco inclina para um lado, até um ângulo em que o formato do casco cria um braço de endireitamento (a curva cruza o zero). Esse ângulo é o <b>ângulo de loll</b>. Para casco de costado reto, tan² θ = −2 × GM ÷ BM. Exemplo: com BM = 1,30 m e GM = −0,10 m, tan² θ = 0,154 e <b>θ ≈ 21°</b>. Um empurrão leva o barco ao <b>outro bordo</b>, com o mesmo ângulo. O barco “bate” de um lado para o outro, o que é perigoso e desagradável.' },
      { t: 'tabela', cab: ['', 'Banda permanente (list)', 'Loll'], linhas: [
        ['<b>GM</b>', 'Positivo', 'Negativo'],
        ['<b>Onde está o problema</b>', 'G fora da linha de centro', 'G alto demais (acima de M)'],
        ['<b>O que o barco faz</b>', 'Fica inclinado para um bordo; se for empurrado ao outro bordo, volta para o mesmo lado', 'Oscila entre dois bordos, com o mesmo ângulo'],
        ['<b>Como corrigir</b>', 'Mover ou retirar pesos, equilibrar tanques, esgotar a água', 'Baixar G primeiro (lastro baixo, tirar peso alto, eliminar superfície livre)'],
      ] },
      { t: 'callout', tipo: 'seguranca', titulo: 'Se o barco está em loll', html: '<b>Não</b> transfira pesos para o bordo alto de repente, nem encha o tanque do bordo alto antes do baixo: o barco pode <b>virar de uma vez para o outro lado</b>, e com um ângulo maior. A ordem é: (1) <b>baixar G</b>, enchendo totalmente (ou esvaziando) os tanques de superfície livre e lastreando em baixo; (2) retirar pesos altos (galões no convés, bote, equipamentos); (3) só então corrigir o lado, começando pelo <b>bordo baixo</b>. Em um veleiro de quilha, loll quase sempre é indício de alagamento com superfície livre ou de peso alto exagerado: reduza pano e busque abrigo.' },
      { t: 'termos', ids: ['banda', 'estabilidade', 'lastro', 'sentina', 'bomba-de-esgoto'] },
      { t: 'check', questoes: [
        q('m7-l3-q1', 'Estabilidade', 2, 'Um veleiro de 5.000 kg, GM = 1,0 m, recebe 150 kg de bagagem deslocados 2 m para um bordo. A banda produzida é de aproximadamente:',
          ['3,4°.', '0,6°.', '17°.', '34°.'], 0,
          'tan θ = (150 × 2) ÷ (5.000 × 1,0) = 0,06, logo θ ≈ 3,4°. 0,6° divide errado; 17° e 34° ignoram o divisor Δ × GM.',
          'USNA EN400, caps. 3 e 4 (banda por deslocamento de pesos)'),
        q('m7-l3-q2', 'Estabilidade', 2, 'Um barco, em águas calmas e sem vento, inclina para boreste, e ao ser empurrado a bombordo volta a boreste. Provável causa:',
          ['GM negativo (loll).', 'Peso do lado de boreste, ou tanque de bombordo mais vazio, com GM positivo.', 'Vento forte.', 'Quilha longa demais.'], 1,
          'Se volta ao mesmo lado, há uma banda permanente com GM positivo: G fora do centro. Num loll o barco oscilaria entre os dois bordos. Vento não existe nesta situação, e a quilha longa não explica a inclinação.',
          'USNA EN400, cap. 4'),
        q('m7-l3-q3', 'Estabilidade', 3, 'Num barco em loll (GM negativo), qual é a primeira providência recomendada?',
          ['Encher o tanque do bordo alto.', 'Baixar o centro de gravidade (lastrear em baixo, tirar pesos altos, eliminar superfície livre) e depois corrigir o lado.', 'Deslocar o peso rapidamente para o bordo alto.', 'Aumentar o pano para endireitar.'], 1,
          'No loll, o problema é GM negativo; corrige-se baixando G. Encher o bordo alto ou deslocar peso para lá pode fazer o barco girar para o outro bordo com ângulo maior. Aumentar o pano aumenta o momento inclinador.',
          'USNA EN400, cap. 4 (lolling)', U.usna4),
        q('m7-l3-q4', 'Estabilidade', 2, 'Uma banda grande produzida por um peso pequeno deslocado indica, em geral:',
          ['GM alto (barco muito rígido).', 'GM baixo (barco “mole”).', 'Excesso de lastro.', 'Superfície livre nula.'], 1,
          'Na fórmula tan θ = w·d ÷ (Δ·GM), o GM está no divisor: GM pequeno amplia a banda. Barco rígido e excesso de lastro dão bandas pequenas.',
          'USNA EN400, caps. 3 e 4'),
      ] },
      { t: 'fontes', itens: [
        { txt: 'USNA, EN400, cap. 4 (banda, loll e correção)', url: U.usna4 },
        { txt: 'Rawson e Tupper, Basic Ship Theory (Butterworth-Heinemann): fórmula da parede reta e ângulo de loll' },
      ] },
    ],
  });
  /* ---------- m7 · l4 ---------- */
  function clipBaixo(poly, y0) {
    // mantém a parte do polígono com y >= y0 (abaixo da linha horizontal, em coordenadas de SVG)
    var out = [], n = poly.length, i;
    for (i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], ina = a[1] >= y0, inb = b[1] >= y0;
      if (ina) out.push(a);
      if (ina !== inb) { var tt = (y0 - a[1]) / (b[1] - a[1]); out.push([a[0] + tt * (b[0] - a[0]), y0]); }
    }
    return out;
  }
  function retRot(cx, cy, w, h, deg) {
    return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(function (p) { return rot([cx + p[0], cy + p[1]], [cx, cy], deg); });
  }
  function ptsStr(p) { return p.map(function (q2) { return q2[0].toFixed(1) + ',' + q2[1].toFixed(1); }).join(' '); }
  var FIG_SUP = (function () {
    var W = 130, s = '', cy = 96, ang = 14;
    var titulos = ['Tanque cheio', 'Meio cheio', 'Com anteparo'];
    for (var i = 0; i < 3; i++) {
      var x0 = i * (W + 5), cx = x0 + W / 2;
      s += '<rect x="' + x0 + '" y="0" width="' + W + '" height="200" rx="8" ' + SEA + '/>' + t(x0 + 8, 22, titulos[i], 'font-weight="700"');
      if (i === 0) {
        s += '<polygon points="' + ptsStr(retRot(cx, cy, 100, 60, ang)) + '" fill="var(--sea-3)" fill-opacity="0.8" stroke="var(--ink)" stroke-width="2"/>';
        s += t(x0 + 8, 176, 'G não se move');
      }
      if (i === 1) {
        var tk = retRot(cx, cy, 100, 60, ang);
        s += '<polygon points="' + ptsStr(clipBaixo(tk, cy)) + '" fill="var(--sea-3)" fill-opacity="0.8"/>';
        s += '<polygon points="' + ptsStr(tk) + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
        s += seta(cx - 22, cy + 52, cx + 28, cy + 56, 'var(--magenta)', 2.5);
        s += t(x0 + 8, 176, 'o líquido corre') + t(x0 + 8, 194, 'ao bordo baixo');
      }
      if (i === 2) {
        var h1 = retRot(cx - 25, cy, 50, 60, ang), h2 = retRot(cx + 25, cy, 50, 60, ang);
        // rotação em torno do centro do tanque (cx, cy), não de cada metade
        h1 = [[-50, -30], [0, -30], [0, 30], [-50, 30]].map(function (p) { return rot([cx + p[0], cy + p[1]], [cx, cy], ang); });
        h2 = [[0, -30], [50, -30], [50, 30], [0, 30]].map(function (p) { return rot([cx + p[0], cy + p[1]], [cx, cy], ang); });
        var l1 = clipBaixo(h1, cy - 4), l2 = clipBaixo(h2, cy + 4);
        s += '<polygon points="' + ptsStr(l1) + '" fill="var(--sea-3)" fill-opacity="0.8"/><polygon points="' + ptsStr(l2) + '" fill="var(--sea-3)" fill-opacity="0.8"/>';
        s += '<polygon points="' + ptsStr(retRot(cx, cy, 100, 60, ang)) + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
        var m1 = rot([cx, cy - 30], [cx, cy], ang), m2 = rot([cx, cy + 30], [cx, cy], ang);
        s += '<line x1="' + m1[0].toFixed(1) + '" y1="' + m1[1].toFixed(1) + '" x2="' + m2[0].toFixed(1) + '" y2="' + m2[1].toFixed(1) + '" ' + MG + ' stroke-width="3"/>';
        s += t(x0 + 8, 176, 'efeito cai a ¼') + t(x0 + 8, 194, '1 anteparo');
      }
    }
    return svg('0 0 400 200', 'Superfície livre: tanque cheio, tanque meio cheio com o líquido deslocado para o bordo baixo e tanque com anteparo longitudinal', s);
  })();

  m7.licoes.push({
    id: 'l4', titulo: 'Efeito de superfície livre: causas, precauções e correções', minutos: 12,
    objetivos: [
      'Explicar por que um líquido solto reduz o GM (a “subida virtual” do centro de gravidade).',
      'Calcular a correção de superfície livre (FSC) e o GM efetivo, e saber o peso de cada dimensão.',
      'Citar as precauções e correções: tanques cheios ou vazios, anteparos, esgotar a sentina, estivar líquidos.',
    ],
    blocos: [
      { t: 'p', html: 'Um tanque cheio é só um peso fixo. Um tanque <b>meio cheio</b>, ou uma poça de água dentro do barco, é um peso que <b>anda</b>. Esse é o efeito de superfície livre, uma das causas mais comuns de perda de estabilidade em veleiros e a mais ignorada.' },
      { t: 'h', txt: 'Como funciona' },
      { t: 'p', html: 'Quando o barco inclina, o líquido solto corre para o bordo baixo. Isso desloca o centro de gravidade <b>desse líquido</b> para o lado inclinado, e o efeito para o barco é o mesmo de levar um peso para o bordo baixo: o binário de endireitamento diminui. Em termos de cálculo, é como se o G do barco <b>subisse</b> uma altura FSC (a “correção de superfície livre”), de modo que o GM efetivo é:' },
      { t: 'p', html: '<b>GM efetivo = GM − FSC</b>        com        <b>FSC = (ρ do líquido × i) ÷ (ρ da água × V)</b>' },
      { t: 'p', html: 'onde <b>i</b> é o momento de inércia da superfície livre em relação ao eixo longitudinal. Para um tanque retangular de comprimento <b>l</b> e largura <b>b</b>, <b>i = l × b³ ÷ 12</b>. Como o produto ρ × V é o deslocamento Δ do barco, <b>FSC = ρ do líquido × i ÷ Δ</b>. Há dois pontos importantes: o FSC <b>não depende de quanto líquido há</b> (desde que haja superfície livre), e depende da <b>largura ao cubo</b>.' },
      { t: 'figura', svg: FIG_SUP, legenda: 'Tanques vistos de proa, inclinados a 14°. Com um anteparo longitudinal que divide a largura em duas metades, o i cai a um quarto.' },
      { t: 'p', html: 'No gráfico de estabilidade, o GZ efetivo é <b>GZ − FSC × sen φ</b>: a curva inteira abaixa, e o ângulo de estabilidade nula diminui. Com G fora da linha de centro, o efeito é pior, pois a banda aumenta.' },
      { t: 'h', txt: 'Quanto vale na prática (veleiro de 6.000 kg, GM de 0,85 m)' },
      { t: 'tabela', cab: ['Situação', 'i = l·b³/12', 'FSC', 'GM efetivo'], linhas: [
        ['Tanque de água doce de 1,0 m × 0,6 m (comprimento × largura)', '0,018 m⁴', '0,003 m (3 mm)', '0,847 m'],
        ['Tanque largo de água doce, 1,2 m × 2,0 m (a boca toda)', '0,80 m⁴', '0,13 m', '0,72 m'],
        ['Água do mar sobre o piso: 3,0 m × 2,0 m', '2,0 m⁴', '<b>0,34 m</b>', '<b>0,51 m</b>'],
        ['O mesmo piso com um anteparo longitudinal ao meio', '0,5 m⁴', '0,085 m', '0,76 m'],
      ], legenda: 'Contas: FSC = ρ × i ÷ Δ, com ρ = 1.000 kg/m³ (água doce) ou 1.025 kg/m³ (água do mar) e Δ = 6.000 kg. A água dentro do casco também é peso: o efeito de peso baixo ajuda um pouco, mas o de superfície livre e de perda de borda-livre costuma predominar.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'A água dentro do barco mata a estabilidade de duas formas', html: 'Primeiro, ela é <b>peso</b> que reduz a borda-livre e a reserva de flutuação. Segundo, quando se espalha pelo piso da cabine, tem <b>superfície livre larga</b>: uma poça de poucos centímetros de água tira, no exemplo, 34 cm do GM, quase 40% do valor de 0,85 m. Esgotar a sentina cedo, e fechar escotilhas e válvulas, é questão de estabilidade.' },
      { t: 'h', txt: 'Precauções e correções' },
      { t: 'lista', itens: [
        '<b>Tanques cheios ou vazios.</b> Os dois evitam a superfície livre. Tanques com 90% ou mais de líquido têm o “efeito de bolsão”: o líquido toca a tampa do tanque ao inclinar, e o efeito de superfície livre fica muito reduzido.',
        '<b>Poucos tanques parcialmente cheios ao mesmo tempo.</b> Consuma um por vez, até esvaziar. Tenha reserva para encher um tanque antes de começar o próximo.',
        '<b>Anteparos longitudinais</b> (e transversais) nos tanques grandes: dividir a largura ao meio reduz o i a um quarto. Também diminui o efeito dinâmico (a pancada do líquido batendo na parede).',
        '<b>Estive líquidos</b> em recipientes fechados e amarrados, e evite deixar água solta em cockpit e cabine (drenos desimpedidos).',
        '<b>Esgote</b> a sentina com frequência e nunca deixe que a água corra de bordo a bordo.',
        '<b>Alagamento:</b> o líquido que entra tem superfície livre. Isole o compartimento (anteparos estanques, se houver) e esgote.',
      ] },
      { t: 'p', html: 'Além do efeito estático (a subida virtual de G), a superfície livre tem efeito <b>dinâmico</b>: o líquido que bate de um lado ao outro aumenta o balanço e os esforços na estrutura. Os anteparos ajudam nos dois.' },
      { t: 'check', questoes: [
        q('m7-l4-q1', 'Estabilidade', 2, 'O efeito de superfície livre de um tanque parcialmente cheio é equivalente a:',
          ['Baixar o centro de gravidade do barco.', 'Elevar virtualmente o centro de gravidade (reduzir o GM).', 'Aumentar o deslocamento.', 'Aumentar o BM.'], 1,
          'O líquido que corre para o bordo baixo diminui o binário de endireitamento, como se G subisse. Não baixa G, não altera Δ nem BM.',
          'USNA EN400, cap. 4, item 4.8', U.usna4),
        q('m7-l4-q2', 'Estabilidade', 3, 'Um anteparo longitudinal divide ao meio a largura de um tanque retangular. O i do conjunto (soma das duas metades) fica:',
          ['Igual.', 'Reduzido à metade.', 'Reduzido a um quarto.', 'Multiplicado por quatro.'], 2,
          'Com a largura b/2 em cada metade, i = l·(b/2)³/12 = i0/8 em cada uma; somando as duas, i0/4. Como o i depende da largura ao cubo, dividir a largura é muito eficaz.',
          'USNA EN400, cap. 4, itens 4.8.3 e 4.8.4'),
        q('m7-l4-q3', 'Estabilidade', 2, 'Qual procedimento reduz o efeito de superfície livre dos tanques de combustível?',
          ['Manter vários tanques com 30% de combustível.', 'Consumir um tanque por vez, mantendo os demais cheios ou vazios.', 'Abrir as tampas dos tanques.', 'Deslocar combustível entre os tanques durante a viagem.'], 1,
          'Tanques cheios ou vazios não têm superfície livre; consumir um de cada vez limita o número de tanques parcialmente cheios. Vários tanques semicheios, ou a transferência entre tanques, multiplicam as superfícies livres.',
          'USNA EN400, cap. 4, item 4.8.4'),
        q('m7-l4-q4', 'Estabilidade', 3, 'O veleiro tem 6.000 kg e GM = 0,85 m. Entra água do mar na cabine, formando uma superfície livre de 3,0 m × 2,0 m (largura). O GM efetivo, desprezando o peso da água, é aproximadamente:',
          ['0,51 m.', '0,85 m.', '0,34 m.', '1,19 m.'], 0,
          'i = 3,0 × 2,0³ ÷ 12 = 2,0 m⁴; FSC = 1.025 × 2,0 ÷ 6.000 = 0,34 m; GM efetivo = 0,85 − 0,34 = 0,51 m. 0,34 m é só o FSC; 1,19 soma em vez de subtrair; 0,85 ignora o efeito.',
          'USNA EN400, cap. 4, item 4.8.3'),
      ] },
      { t: 'fontes', itens: [
        { txt: 'USNA, EN400, cap. 4, itens 4.8 e 4.9 (correção de superfície livre, GM efetivo, bolsão, anteparos, loll)', url: U.usna4 },
      ] },
    ],
  });
  /* ---------- m7 · l5 ---------- */
  var FIG_PESO = (function () {
    var linhas = [['Fundo do casco (0,4 m)', 0.4], ['Piso da cabine (0,8 m)', 0.8], ['Convés (1,5 m)', 1.5], ['Teto da cabine (2,2 m)', 2.2], ['Bote no arco (3 m)', 3.0], ['Cruzeta (5 m)', 5.0], ['Topo do mastro (9 m)', 9.0]];
    var s = '', x0 = 270, K = 520, y = 16;
    s += '<line x1="' + x0 + '" y1="6" x2="' + x0 + '" y2="' + (6 + linhas.length * 34 + 4) + '" stroke="var(--ink)" stroke-width="1.5"/>';
    linhas.forEach(function (l) {
      var d = -100 * (l[1] - 1.2) / 6100, w = Math.abs(d) * K;
      var rx = d >= 0 ? x0 : x0 - w;
      s += '<rect x="' + rx.toFixed(1) + '" y="' + y + '" width="' + Math.max(w, 2).toFixed(1) + '" height="20" fill="' + (d >= 0 ? 'var(--sea-3)' : 'var(--magenta)') + '" fill-opacity="' + (d >= 0 ? '0.8' : '0.6') + '" stroke="var(--ink)"/>';
      s += t(6, y + 16, l[0], 'font-size="15"');
      var val = (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(3).replace('.', ',');
      s += t(d >= 0 ? x0 + w + 6 : x0 + 6, y + 16, val, 'font-size="15"');
      y += 34;
    });
    s += t(6, y + 14, 'Variação do GM (m) com +100 kg em cada altura', 'font-size="15"');
    return svg('0 0 400 ' + (y + 28), 'Efeito no GM de adicionar 100 quilos em diferentes alturas num veleiro de 6 toneladas com KG de 1,2 metro: peso abaixo de G aumenta o GM, peso acima diminui', s);
  })();

  m7.licoes.push({
    id: 'l5', titulo: 'A estabilidade muda: viagem, avarias e alterações no barco', minutos: 14,
    objetivos: [
      'Prever o efeito de mau tempo, água embarcada, consumo, água aberta e avarias sobre a estabilidade.',
      'Calcular o efeito de um peso acrescentado ou retirado sobre KG e GM, e entender por que peso alto custa caro.',
      'Citar o que a NORMAM-211 e os regulamentos de oceano exigem quando o barco é modificado ou reclassificado.',
    ],
    blocos: [
      { t: 'p', html: 'A estabilidade do barco <b>não é uma característica fixa</b>. Ela é a de projeto <b>mais</b> o que você carregou, gastou, alagou, quebrou ou acrescentou. Esta lição segue o programa do exame: variações durante a viagem (mau tempo, água do mar embarcada, consumo, água aberta e avarias) e variações por alteração do projeto original.' },
      { t: 'h', txt: 'Durante a viagem' },
      { t: 'tabela', cab: ['Situação', 'O que muda', 'O que fazer'], linhas: [
        ['<b>Mau tempo</b>', 'O barco perde estabilidade quando desliza sobre a crista de uma onda (Miguens); o balanço fica violento se o período natural do barco coincide com o das ondas. O vento forte de través aumenta a banda.', 'Preparar <b>antes</b>: esgotar, fechar tudo, evitar tanques parciais, peiar o material, reduzir pano cedo. Mudar rumo ou velocidade para sair do sincronismo com as ondas.'],
        ['<b>Água do mar embarcada</b> (cockpit, convés, escotilhas)', 'Peso alto e longe do centro, mais superfície livre, menos borda-livre; escotilhas abertas alagam e encurtam a curva.', 'Cockpit estanque com drenos livres; escotilhas fechadas; esgotar logo.'],
        ['<b>Consumo</b> de água, combustível e mantimentos', 'Os pesos são baixos; ao sair, KG sobe e o GM cai um pouco. Tanques parcialmente cheios criam superfície livre.', 'Consumir um tanque por vez; reabastecer ou esvaziar; reestivar o que ficou solto.'],
        ['<b>Água aberta</b> (casco ou passa-casco com vazamento)', 'Peso, superfície livre larga no piso e perda de flutuação; pode haver banda se a água se acumula de um lado.', 'Localizar e estancar, esgotar (bomba e balde), reduzir pano; manter a água fora da cabine.'],
        ['<b>Avarias</b>', 'Compartimento alagado: perde flutuação e cria superfície livre. Perda de lastro ou da quilha: G sobe muito, o barco tende a emborcar. Perda do mastro: G desce, mas o aparelho no casco pode furar o costado.', 'Isolar o compartimento; esgotar; cortar o aparelho solto; pedir socorro cedo.'],
      ] },
      { t: 'p', html: 'O Miguens resume a doutrina de sobrevivência numa tempestade em três regras: <b>mantenha a propulsão e a energia, a flutuabilidade e a estabilidade</b>. Para a estabilidade: lastro adequado, superfície livre mínima e todos os tanques completamente cheios ou completamente vazios; compartimentos que devem estar secos precisam ser esgotados imediatamente.' },
      { t: 'callout', tipo: 'seguranca', titulo: 'Faça os ajustes com o barco ainda estável', html: 'O Miguens avisa que as medidas para aumentar a estabilidade (esgotar, lastrar, conferir a carga) devem ser tomadas <b>antes</b> de o tempo piorar. Ajustar tanques ou cargas já com o barco pouco estável pode criar superfície livre ou peso descentrado, e piorar a situação.' },
      { t: 'h', txt: 'Mudanças no projeto: quanto custa um quilo no alto' },
      { t: 'p', html: 'Ao <b>acrescentar</b> um peso w a uma altura z sobre a quilha, o novo KG é a média ponderada dos momentos:' },
      { t: 'p', html: '<b>KG novo = (Δ × KG + w × z) ÷ (Δ + w)</b>' },
      { t: 'p', html: 'Se z é maior que KG, o centro de gravidade sobe. Para pesos pequenos, a variação do GM é aproximadamente <b>−w × (z − KG) ÷ Δ</b>. No veleiro de 6.000 kg (KG = 1,20 m, KM = 2,05 m, GM = 0,85 m), 100 kg valem:' },
      { t: 'figura', svg: FIG_PESO, legenda: 'Contas feitas com a fórmula do texto; o KM foi mantido constante (o acréscimo muda pouco o calado). Peso abaixo de G até melhora o GM, mas peso no alto pesa muito mais do que o seu valor em quilos.' },
      { t: 'tabela', cab: ['Acréscimo típico de preparação para travessia', 'Peso', 'Altura', 'GM depois'], linhas: [
        ['Arco de popa com painéis solares e antenas', '60 kg', '2,6 m', '0,836 m'],
        ['+ Bote inflável e motor de popa nos suportes', '70 kg', '2,3 m', '0,824 m'],
        ['+ Capota rígida (sprayhood) e estrutura', '35 kg', '2,2 m', '0,818 m'],
        ['+ Galões de combustível no convés', '100 kg', '1,5 m', '0,814 m'],
        ['+ Balsa salva-vidas sobre a cabine', '40 kg', '1,9 m', '0,810 m'],
        ['<b>Total acrescentado</b>', '<b>305 kg</b>', '', '<b>0,810 m</b> (−5%)'],
      ], legenda: 'Valores acumulados, calculados com a fórmula acima. Um enrolador de mastro mais pesado (60 kg a 8 m) tira sozinho cerca de 0,07 m do GM.' },
      { t: 'p', html: 'Cada item parece inofensivo, e o total (5% de GM) ainda é pequeno. Mas o que mais importa é a <b>curva inteira</b>: peso alto reduz o GZ em <b>todos</b> os ângulos e o ângulo de estabilidade nula, e a combinação com o consumo de tanques baixos e com a superfície livre pode levar o GM a metade. Alterações maiores (trocar o mastro, mudar o lastro, cortar a quilha, aumentar a superestrutura, instalar tanques) exigem <b>refazer o cálculo de estabilidade</b>.' },
      { t: 'h', txt: 'O que a norma e os regulamentos pedem' },
      { t: 'fato', ref: 'extra-capitao-2-02', html: 'Para realizar uma viagem em área de navegação mais rigorosa que a da classificação, a embarcação de esporte e recreio deve ser <b>reclassificada para a viagem</b>, com declaração de um <b>engenheiro naval</b> atestando que tem estabilidade e resistência estrutural satisfatórias, e vistoria da Capitania.' },
      { t: 'fato', ref: 'extra-fechamento-cvtr-12', html: 'Embarcações de esporte e recreio de <b>24 m ou mais</b> destinadas a mar aberto têm a estabilidade intacta avaliada pelos requisitos do Capítulo 7 da NORMAM-201/DPC. Abaixo de 24 m (caso da maioria dos veleiros de cruzeiro), a lotação é determinada pelo estaleiro construtor; se o estaleiro não fornece o dado, ou se a embarcação é de fabricação artesanal, vale o que as normas de lotação e PMC da NORMAM-201/DPC (anexo 7-F) ou da NORMAM-202/DPC (anexo 6-G) estabelecem.' },
      { t: 'fato', ref: 'travessia-10', html: 'A partir de 2027, nas categorias Mo0 e Mo1 das Offshore Special Regulations da World Sailing (2026-2027), quem não consegue demonstrar conformidade com a ISO 12217-2 categoria A e usa as alternativas da OSR 3.04.2 (Tabela 2: STIX, AVS e m×AGZ) ou da OSR 3.04.3 (Tabela 3: índice de estabilidade ORC) deve ter essa conformidade confirmada por <b>medição do deslocamento real e prova de inclinação (inclining test)</b>. A exigência não se aplica a quem demonstra a estabilidade pela ISO 12217-2 categoria A.' },
      { t: 'callout', tipo: 'dica', titulo: 'Antes da travessia', html: 'Pese o que você acrescentou (ou estime com margem), anote a altura de cada item e faça a conta do GM. Estive o que for pesado perto do fundo e do centro; prefira bote desinflado ou guardado a bote no teto; ponha galões de combustível em tanques ou no convés baixo, bem peiados. Se a lista de modificações é longa, procure um engenheiro naval para uma prova de inclinação.' },
      { t: 'check', questoes: [
        q('m7-l5-q1', 'Estabilidade', 2, 'Durante uma travessia, o consumo da água e do combustível de tanques situados no fundo do casco tende a:',
          ['Baixar o centro de gravidade e aumentar o GM.', 'Elevar o centro de gravidade e reduzir o GM, ainda mais se os tanques ficarem semicheios.', 'Não alterar a estabilidade.', 'Aumentar o deslocamento.'], 1,
          'Retirar peso que estava baixo faz KG subir, e o GM cai; tanques parcialmente cheios ainda criam superfície livre. O deslocamento diminui, não aumenta, e a estabilidade muda.',
          'Miguens, vol. III (2026), item 42.4; USNA EN400, cap. 4'),
        q('m7-l5-q2', 'Estabilidade', 3, 'Um veleiro de 6.000 kg com KG = 1,20 m recebe 100 kg a 3,2 m de altura. O novo KG é, aproximadamente:',
          ['1,23 m.', '1,13 m.', '1,50 m.', '3,20 m.'], 0,
          'KG novo = (6.000 × 1,20 + 100 × 3,2) ÷ 6.100 = 7.520 ÷ 6.100 = 1,233 m. 1,13 m seria o resultado de um peso abaixo de G; 1,50 m e 3,20 m exageram o efeito (3,20 m é a altura do peso, não o KG).',
          'USNA EN400, cap. 4 (efeito de peso acrescentado)'),
        q('m7-l5-q3', 'Estabilidade', 2, 'Segundo o Miguens, as medidas para melhorar a estabilidade antes de um mau tempo (esgotar, lastrar, verificar a carga) devem ser tomadas:',
          ['Quando o tempo já estiver ruim, para ser eficaz.', 'Antes de as condições se deteriorarem, com o barco ainda razoavelmente estável.', 'Só depois de passar o mau tempo.', 'Apenas se houver alarme.'], 1,
          'Ajustar com o barco já instável pode criar superfície livre ou cargas descentradas e piorar a situação.',
          'Miguens, vol. III (2026), item 42.4'),
        q('m7-l5-q4', 'Estabilidade', 2, 'Qual das alterações a seguir mais prejudica a estabilidade de um veleiro, por quilo acrescentado?',
          ['Um peso no fundo do casco, perto da quilha.', 'Um peso no piso da cabine.', 'Um peso no topo do mastro (rolo, antenas, radar).', 'Um peso no centro do convés.'], 2,
          'O efeito no GM é proporcional ao peso e à altura acima de G: no topo do mastro (z grande) é o pior. Peso no fundo até melhora o GM.',
          'USNA EN400, cap. 4 (efeito de peso acrescentado)'),
      ] },
      { t: 'fontes', itens: [
        man3('cap. 42, itens 42.2 a 42.4 (efeitos das ondas, preparo para o mau tempo e doutrina de sobrevivência)', 'tecnico-191'),
        nor('art. 3.21 e 3.27 (reclassificação para uma viagem; estabilidade das embarcações de recreio)', 'extra-capitao-2-02'),
        { txt: 'World Sailing, OSR 2026-2027 (extrato Cat. 1), OSR 3.04.1 nota b', url: U.osr, ref: 'travessia-10' },
        { txt: 'USNA, EN400, cap. 4 (efeito de pesos acrescentados e superfície livre)', url: U.usna4 },
      ] },
    ],
  });
  /* ---------- m7 · l6 ---------- */
  var FIG_AVS = (function () {
    var s = '', X = function (a) { return 20 + a * 2; };
    var barras = [['OSR Cat. 0 a 2, barco de 6 t: mínimo', 118, 'var(--magenta)'], ['OSR Cat. 3, barco de 6 t: mínimo', 100, 'var(--magenta)'], ['Barco do exemplo da lição 2', 122, 'var(--sea-3)']];
    var y = 34;
    barras.forEach(function (b) {
      s += th(20, y - 8, b[0]);
      s += '<rect x="20" y="' + y + '" width="' + (b[1] * 2) + '" height="22" fill="' + b[2] + '" fill-opacity="0.65" stroke="var(--ink)"/>';
      s += t(X(b[1]) - 46, y + 17, b[1] + '°', 'font-weight="700"');
      y += 58;
    });
    s += '<line x1="' + X(90) + '" y1="16" x2="' + X(90) + '" y2="' + (y - 10) + '" stroke="var(--ink)" stroke-dasharray="4 4"/>' + th(X(90) - 40, y + 8, 'mastro na água');
    s += '<line x1="' + X(180) + '" y1="16" x2="' + X(180) + '" y2="' + (y - 10) + '" stroke="var(--ink)" stroke-dasharray="4 4"/>' + th(X(180) - 95, y + 28, 'virado: 180°');
    return svg('0 0 400 ' + (y + 40), 'Ângulo de estabilidade nula mínimo exigido pelas regras de oceano da World Sailing para um barco de 6 toneladas, comparado ao barco do exemplo', s);
  })();

  m7.licoes.push({
    id: 'l6', titulo: 'O veleiro de quilha na travessia: lastro, AVS e provas', minutos: 14,
    objetivos: [
      'Explicar por que um veleiro de quilha lastrada tem curva de estabilidade muito diferente da de uma lancha.',
      'Usar os valores de referência das regras de oceano (AVS, energia de endireitamento) e as categorias de projeto.',
      'Fazer o raciocínio de uma prova de inclinação e montar uma lista de verificação de estabilidade antes de partir.',
    ],
    blocos: [
      { t: 'p', html: 'Esta lição junta tudo no barco que você vai comandar: um veleiro de cruzeiro, com quilha e lastro. Veremos o que o torna especial, quais números as regras de oceano usam para decidir se ele é adequado, e o que fazer a bordo.' },
      { t: 'h', txt: 'Estabilidade de peso e estabilidade de forma' },
      { t: 'tabela', cab: ['', 'Veleiro de quilha lastrada', 'Lancha ou casco largo e leve'], linhas: [
        ['<b>De onde vem o GM</b>', 'Do <b>lastro</b> (peso baixo, G baixo) e da boca', 'Quase só da <b>forma</b> do casco (boca grande, BM alto)'],
        ['<b>Centro de gravidade</b>', 'Baixo, com lastro de chumbo ou ferro na quilha, às vezes em bulbo', 'Mais alto, com motores, tanques e cabine acima da água'],
        ['<b>Curva de GZ</b>', 'Estende-se até 120° ou mais; mesmo com o mastro na água, o barco volta', 'Chega ao máximo em ângulo menor e cai a zero antes (a borda mergulha ou alaga)'],
        ['<b>Risco principal</b>', 'Alagamento por aberturas; emborcar por onda quebrando; perda do lastro ou da quilha', 'Perder estabilidade com pesos altos e superfície livre; alagar pela popa'],
      ] },
      { t: 'p', html: 'Um veleiro de quilha foi desenhado para <b>ser inclinado</b>: o vento nas velas o deita, e o lastro o devolve. Quanto mais baixo o lastro e maior a sua proporção em relação ao deslocamento (a faixa de 30 a 40% é comum em barcos de cruzeiro), maior a curva. É por isso que um veleiro lastrado, mesmo deitado com a vela na água, tende a ser <b>recuperado</b> pelo lastro, se o casco for estanque, o que em geral não acontece com uma lancha.' },
      { t: 'callout', tipo: 'nota', titulo: 'Capotar não é virar de cabeça para baixo e ficar', html: 'Passado o AVS, o GZ é negativo até 180°. Num barco de boa curva, o equilíbrio invertido é instável, e a onda seguinte o desvira. Cascos muito largos e rasos podem ser estáveis de cabeça para baixo e <b>ficam emborcados</b>. Em qualquer caso, o outro perigo é entrar água pelas aberturas durante o evento.' },
      { t: 'h', txt: 'Os números das regras de oceano' },
      { t: 'p', html: 'As <i>Offshore Special Regulations</i> (OSR) da World Sailing, usadas em regatas como as de travessia do Atlântico, definem requisitos de estabilidade de monocascos. Para as categorias de maior exigência (0, 1 e 2), um barco deve cumprir <b>ISO 12217-2 categoria A</b> ou, se não puder demonstrar, três limites:' },
      { t: 'fato', ref: 'travessia-11', html: 'Pela Tabela 2 da OSR 3.04.2, para as categorias 0, 1 e 2: <b>STIX mínimo 32</b>; <b>AVS mínimo de 130 − 0,002 × m</b> (com m, a massa do barco em kg, nas condições mínimas de operação), mas sempre <b>≥ 100°</b>; e energia de endireitamento <b>m × AGZ mínima de 172.000 kg·m·graus</b>.' },
      { t: 'fato', ref: 'travessia-12', html: 'Alternativamente, a OSR 3.04.3 aceita o Índice de Estabilidade do sistema ORC com mínimo de <b>115</b> para a Categoria 1.' },
      { t: 'p', html: '<b>AGZ</b> é a área positiva sob a curva do braço de endireitamento, em metros·graus, de zero até o AVS; multiplicada pela massa dá a “energia”. <b>STIX</b> é o índice de estabilidade da norma ISO 12217-2, que combina vários fatores, como energia de endireitamento, ângulo de estabilidade nula, borda-livre e altura das aberturas que alagam. No exemplo do barco de 6.000 kg:' },
      { t: 'lista', itens: [
        'AVS mínimo = 130 − 0,002 × 6.000 = <b>118°</b> (o do exemplo da lição 2, 122°, passa por pouco).',
        'Energia mínima = 172.000 ÷ 6.000 = <b>28,7 m·graus</b> de área sob a curva. A área da curva do exemplo é cerca de 35,7 m·graus: passa.',
        'Para um barco de 5.000 kg, o mínimo de AVS é 130 − 10 = 120°; para um de 8.000 kg, 114°.',
      ] },
      { t: 'figura', svg: FIG_AVS, legenda: 'O mínimo de AVS depende da massa: barcos mais leves precisam de limite maior. Curva do exemplo: ilustração, não de barco real.' },
      { t: 'p', html: 'A classificação europeia de <b>categorias de projeto</b> (Diretiva 2013/53/UE, Anexo I) é usada nos certificados CE de barcos de recreio:' },
      { t: 'tabela', cab: ['Categoria', 'Vento (Beaufort)', 'Altura significativa de onda'], linhas: [
        ['<b>A, oceano</b>', 'pode exceder 8', 'pode exceder 4 m (exclui condições anormais, como furacão e ondas extremas)'],
        ['<b>B, alto-mar</b>', 'até 8, inclusive', 'até 4 m, inclusive'],
        ['<b>C, costeiro</b>', 'até 6, inclusive', 'até 2 m, inclusive'],
        ['<b>D, águas abrigadas</b>', 'até 4, inclusive', 'até 0,3 m, inclusive'],
      ], legenda: 'Diretiva 2013/53/UE, Anexo I, A.1. Não é norma brasileira, mas aparece na ficha técnica de barcos importados e nas regras de regatas.' },
      { t: 'h', txt: 'Prova de inclinação: medir o GM' },
      { t: 'p', html: 'A fórmula da banda por peso deslocado, lida ao contrário, dá o GM: <b>GM = (w × d) ÷ (Δ × tan θ)</b>. Num barco de 6.000 kg, desloca-se um peso de 100 kg por 3,0 m de um bordo a outro e mede-se a banda. Com banda de 3,4° (tan = 0,0594), o GM é 300 ÷ (6.000 × 0,0594) ≈ <b>0,84 m</b>. A prova oficial exige condições controladas (águas calmas, tanques cheios ou vazios, sem vento, sem pessoas se movendo, ângulo medido com precisão) e um profissional. Mas a ideia ajuda a entender por que a OSR exigirá a prova a partir de 2027 para as categorias 0 e 1.' },
      { t: 'h', txt: 'Antes de partir: lista de verificação' },
      { t: 'lista', ordenada: true, itens: [
        'Pesos <b>baixos e centrados</b>: mantimentos pesados, ferramentas, âncora reserva e baterias no fundo; nada pesado no alto ou nos extremos.',
        'Tanques <b>cheios ou vazios</b>; consuma um por vez; esgotar a sentina; anteparos nos tanques grandes.',
        '<b>Estanqueidade:</b> escotilhas, vigias, tampas de gaiuta e de paiol fechados e testados; drenos do cockpit livres; passa-cascos com válvula.',
        '<b>Equipamentos altos</b> (radar, painéis, antenas, enrolador): pese e some ao cálculo. Bote e balsa nos suportes e peiados.',
        '<b>Banda de trabalho:</b> reduza pano antes de a banda passar de cerca de 20°; com boa curva, o barco aguenta muito mais, mas o rendimento e o conforto caem, e a tripulação se machuca.',
        '<b>Peiar tudo</b> que possa correr de bordo: o peso solto atinge o lado baixo e agrava a banda.',
        'Se houver dúvida (modificações, lastro, quilha), peça a avaliação de um engenheiro naval, e a reclassificação para a viagem exigida pela NORMAM-211.',
      ] },
      { t: 'termos', ids: ['estabilidade', 'lastro', 'quilha', 'osr', 'banda', 'monocasco'] },
      { t: 'check', questoes: [
        q('m7-l6-q1', 'Estabilidade', 2, 'Segundo a OSR 3.04.2 (categorias 0, 1 e 2), qual é o AVS mínimo de um barco de 5.000 kg nas condições mínimas de operação?',
          ['100°.', '120°.', '130°.', '90°.'], 1,
          'AVS mínimo = 130 − 0,002 × 5.000 = 120°, e nunca menos de 100°. 100° é o piso para barcos muito pesados; 130° ignora a massa; 90° é menor que o piso.',
          'World Sailing, OSR 2026-2027, Tabela 2', U.osr),
        q('m7-l6-q2', 'Estabilidade', 3, 'Numa prova de inclinação, um peso de 100 kg é deslocado 3,0 m de um bordo para o outro num barco de 6.000 kg, e a banda medida é 3,4° (tan 3,4° ≈ 0,0594). O GM é, aproximadamente:',
          ['0,84 m.', '0,06 m.', '3,40 m.', '1,70 m.'], 0,
          'GM = (w × d) ÷ (Δ × tan θ) = (100 × 3,0) ÷ (6.000 × 0,0594) = 300 ÷ 356 ≈ 0,84 m. As outras alternativas confundem a fórmula (usam o ângulo em graus ou invertem o quociente).',
          'USNA EN400, cap. 3 e 4 (prova de inclinação)', U.usna4),
        q('m7-l6-q3', 'Estabilidade', 2, 'Por que um veleiro de quilha lastrada, em geral, tem ângulo de estabilidade nula muito maior que o de uma lancha?',
          ['Porque o lastro baixo mantém G baixo e dá GZ positivo até ângulos grandes.', 'Porque o veleiro é sempre mais largo.', 'Porque o veleiro não tem aberturas.', 'Porque o veleiro é mais leve.'], 0,
          'O peso baixo (lastro) mantém o G baixo e o GZ positivo mesmo com o barco muito inclinado. Veleiros não são necessariamente mais largos, têm aberturas (cockpit, escotilhas) e não são mais leves.',
          'USNA EN400, cap. 4; World Sailing, OSR 3.04.2'),
        q('m7-l6-q4', 'Estabilidade', 2, 'Na classificação europeia de categorias de projeto, a categoria A (oceano) é a de barcos projetados para:',
          ['Vento de até força 4 e ondas de até 0,3 m.', 'Vento que pode exceder força 8 e ondas significativas que podem exceder 4 m (sem incluir furacões e ondas extremas).', 'Apenas águas abrigadas.', 'Vento de até força 6 e ondas de até 2 m.'], 1,
          'Categoria A é a de oceano, para ventos acima de 8 Beaufort e ondas de 4 m ou mais, excluindo condições anormais. A é a mais exigente. A força 4 e 0,3 m é a categoria D, e força 6 e 2 m é a C.',
          'Diretiva 2013/53/UE, Anexo I, A.1', U.rcd),
      ] },
      { t: 'fontes', itens: [
        { txt: 'World Sailing, Offshore Special Regulations 2026-2027 (extrato Cat. 1), OSR 3.04: estabilidade de monocascos', url: U.osr, ref: 'travessia-11' },
        { txt: 'World Sailing, OSR 3.04.3 (Índice de Estabilidade ORC)', url: U.osr, ref: 'travessia-12' },
        { txt: 'Diretiva 2013/53/UE, Anexo I, A.1 (categorias de projeto de embarcações de recreio)', url: U.rcd },
        { txt: 'USNA, EN400, cap. 4 (estabilidade transversal, banda por peso deslocado, loll)', url: U.usna4 },
        { txt: 'Marchaj, C. A., Seaworthiness: The Forgotten Factor (Adlard Coles): estabilidade e capotamento de veleiros' },
      ] },
    ],
  });

  VL.dado('cursos/capitao-2', { modulos: M });
})();
