
  /* ===================== Categorias, fontes e ajudantes ===================== */
  var CONSULTA = '2026-10-07';
  var CATS = [
    { id: 'casco', nome: 'Casco e embarcação', curto: 'Casco' },
    { id: 'aparelho', nome: 'Mastreação e ferragens', curto: 'Mastreação' },
    { id: 'velas', nome: 'Velas', curto: 'Velas' },
    { id: 'manobra', nome: 'Manobra e mareação', curto: 'Manobra' },
    { id: 'marinharia', nome: 'Cabos, nós e âncoras', curto: 'Cabos e nós' },
    { id: 'navegacao', nome: 'Navegação e instrumentos', curto: 'Navegação' },
    { id: 'carta', nome: 'Cartas, marés e balizamento', curto: 'Cartas e marés' },
    { id: 'astro', nome: 'Navegação astronômica', curto: 'Astronomia' },
    { id: 'meteo', nome: 'Meteorologia e mar', curto: 'Meteorologia' },
    { id: 'ripeam', nome: 'RIPEAM: regras, luzes e sinais', curto: 'RIPEAM' },
    { id: 'seguranca', nome: 'Segurança e sobrevivência', curto: 'Segurança' },
    { id: 'radio', nome: 'Rádio e comunicações', curto: 'Rádio' },
    { id: 'legislacao', nome: 'Legislação e órgãos', curto: 'Legislação' },
    { id: 'prova', nome: 'Prova e estudo', curto: 'Prova' },
  ];

  /* Endereços oficiais conferidos em 2026-10-07 (ver também data/referencias.js). */
  var URL = {
    n211: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf',
    n212: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-212.pdf',
    lesta: 'https://www.planalto.gov.br/ccivil_03/leis/l9537.htm',
    rlesta: 'https://www.planalto.gov.br/ccivil_03/decreto/d2596.htm',
    lcp97: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp97.htm',
    iala: 'https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm',
    colreg: 'https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx',
    normas: 'https://www.marinha.mil.br/dpc/normas-autoridade-maritima-brasileira',
    capitanias: 'https://www.marinha.mil.br/dpc/localize-capitania/',
    indenizacoes: 'https://www.marinha.mil.br/dpc/tabelas-de-indenizacoes',
    dhn: 'https://www.marinha.mil.br/dhn/',
    chm: 'https://www.marinha.mil.br/chm/',
    carta12000: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/carta-12000-int-1',
    farois: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois',
    roteiros: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/roteiros',
    tabuas: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/tabuas-das-mares',
    correntesMare: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-2',
    cartasPiloto: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3',
    almanaque: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/almanaque-nautico',
    avisos: 'https://www.marinha.mil.br/chm/dados-do-segnav-aviso-aos-navegantes-tela',
    cartas: 'https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas',
    sinoticas: 'https://www.marinha.mil.br/chm/cartassinoticas',
    mauTempo: 'https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo',
    meteoromarinha: 'https://www.marinha.mil.br/chm/dados-do-smm-meteoromarinha/previsao-24-horas',
    salvamar: 'https://www.marinha.mil.br/salvamarbrasil/',
    infosar: 'https://infosar.decea.mil.br/',
    cospas: 'https://www.cospas-sarsat.int/',
    pilot: 'https://msi.nga.mil/Publications/APC',
    osr: 'https://www.sailing.org/inside-world-sailing/rules-regulations/offshore-special-regulations/',
    /* Fontes acrescentadas em 2026-10-09 (conferidas nessa data) */
    miguens1: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf',
    miguens3: 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf',
    nws: 'https://forecast.weather.gov/glossary.php',
    noaaGiro: 'https://oceanservice.noaa.gov/facts/gyre.html',
    noaaRessurgencia: 'https://oceanservice.noaa.gov/facts/upwelling.html',
    wmm: 'https://www.ncei.noaa.gov/products/world-magnetic-model',
    solas: 'https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx',
    sar: 'https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Maritime-Search-and-Rescue-(SAR).aspx',
    imo: 'https://www.imo.org/en/About/Pages/Default.aspx',
    fadiga: 'https://wwwcdn.imo.org/localresources/en/OurWork/HumanElement/Documents/MSC.1-Circ.1598%20(2).pdf',
    swedishClub: 'https://www.swedishclub.com/uploads/2023/12/Bridge-Instructions-web_The-Swedish-Club.pdf',
    mcaPonte: 'https://assets.publishing.service.gov.uk/media/64b659a171749c000d89ed25/13._Deck_-_Management_of_Bridge_Operations_.pdf',
    niosh: 'https://www.cdc.gov/niosh/cold-stress/about/related-illness.html',
    medline: 'https://medlineplus.gov/dehydration.html',
    navarea5: 'https://iho.int/uploads/user/Inter-Regional%20Coordination/WWNWS/WWNWS16/WWNWS16_2024_3.2-V_EN_NAVAREA%20V%20Self%20Assessment.pdf',
    metarea5: 'https://wwmiws.wmo.int/index.php/metareas/affiche/5',
    infosar2: 'https://infosar.decea.mil.br/',
    brmcc: 'https://www2.fab.mil.br/brmcc/index.php/codificacao',
    publicacoesChm: 'https://www.marinha.mil.br/chm/dados-do-segnav/publicacoes',
    cpa2026: 'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/CPA-II-2026-MATRIZ.pdf',
    dpcCpa: 'https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador',
    npcpce: 'https://www.marinha.mil.br/cpce/sites/www.marinha.mil.br.cpce/files/upload/Anexo-3-A-da-NPCP-CE.pdf',
  };
  function n211(loc) { return { txt: 'NORMAM-211/DPC', url: URL.n211, loc: loc }; }
  function lesta(loc) { return { txt: 'Lei nº 9.537/1997 (LESTA)', url: URL.lesta, loc: loc }; }
  function mig1(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2ª rev. 2023)', url: URL.miguens1, loc: loc }; }
  function mig3(loc) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. III (DHN, 1ª rev. 2026)', url: URL.miguens3, loc: loc }; }
  function nws(verbete) { return { txt: 'NOAA/NWS, Glossary', url: URL.nws, loc: 'verbete “' + verbete + '”' }; }
  function rip(regra) { return { txt: 'RIPEAM-72 (COLREG, IMO)', url: URL.colreg, loc: regra }; }

  /* t(id, termo, categoria, definição, {en, sin, ver, fig:[figura, destaque], legenda, widget, fonte, link, aconfirmar, intl}) */
  var T = [];
  function t(id, termo, cat, def, o) {
    var x = o || {};
    x.id = id; x.termo = termo; x.categoria = cat; x.def = def;
    T.push(x);
    return x;
  }
