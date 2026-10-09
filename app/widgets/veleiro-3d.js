/* veleiro-3d — anatomia de um cruzeiro de ~32 pés (exemplo; ≈ 9,75 m), sloop de mastro de topo, em 3D.
   Tudo procedural (Three.js): casco por loft de seções em V suave com espelho de popa, convés, cabine,
   cockpit com roda de leme ou cana, quilha de bolina fixa com bulbo, leme suspenso, mastro passante (enora),
   cruzetas, brandais, estais de proa e de popa, burro, retranca, adriças, escotas, catracas, balaústres,
   guarda-mancebos, púlpitos, luzes de navegação, vela grande com rizos e genoa enrolável com bolsas
   (superfícies curvas), birutas na genoa e no topo do mastro.

   O vento verdadeiro é dado em relação à proa. O barco fica parado na cena e o vento gira em volta dele.
   As velas são reguladas sozinhas para o vento APARENTE (triângulo de velocidades com uma polar aproximada),
   mudam de bordo quando o vento passa pela proa ou pela popa, e o barco aderna para sotavento conforme a força
   do vento, a área de vela (rizos e genoa enrolada) e o ponto de vela. Dentro da zona morta (35° neste modelo)
   o barco fica "no vento": velas panejando, sem seguimento. Banda e velocidade são um modelo didático.

   opts de mount (todos opcionais):
     modo:     'explorar' | 'identificar' (desafio: que parte está destacada?)        padrão 'explorar'
     vento:    direção do vento verdadeiro em graus a partir da proa; + = boreste, − = bombordo   padrão 50
     forca:    vento verdadeiro em nós (0 a 30)                                       padrão 12
     rizo:     0 | 1 | 2  (rizos na vela grande)                                       padrão 0
     genoa:    porcentagem da genoa enrolada (0 a 90)                                  padrão 0
     leme:     'roda' | 'cana'                                                         padrão 'roda'
     grupo:    rótulos mostrados: 'casco' | 'conves' | 'mastro' | 'velas'              padrão 'casco'
     parte:    id da parte já selecionada (ex.: 'brandais', 'quilha', 'rizos'; lista em PARTES abaixo)
     vista:    '34' | 'lado' | 'proa' | 'popa' | 'cima'                               padrão '34'
     rotulos:  true | false                                                            padrão true
     ajustes:  true | false (mostra os controles de vento e velas)                     padrão true
     titulo:   legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'veleiro-3d', opts:{grupo:'mastro', parte:'brandais'}}
     {t:'widget', w:'veleiro-3d', opts:{vento:-120, forca:18, rizo:1, genoa:30, grupo:'velas'}}
     {t:'widget', w:'veleiro-3d', opts:{modo:'identificar'}} */
(function () {
  'use strict';
  var h = VL.h, D2R = Math.PI / 180;

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function num(v, p) { var n = Number(v); return v == null || v === '' || isNaN(n) ? p : n; }
  function lerp(a, b, f) { return a + (b - a) * f; }
  function graus(x) { return Math.round(x) + '°'; }
  function nos(x) { return VL.fmt.num(x, 1) + ' nós'; }

  /* ------------------------------------------------------------ modelo de vento (o mesmo de "mareacao") */
  var POL_TWS = [4, 6, 8, 10, 12, 16, 20, 25];
  var POL_TWA = [0, 35, 38, 42, 45, 52, 60, 75, 90, 110, 120, 135, 150, 165, 180];
  var POL = [
    [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
    [1.0, 1.6, 2.0, 2.3, 2.5, 2.7, 2.8, 2.8], [2.4, 3.6, 4.3, 4.8, 5.1, 5.4, 5.5, 5.5],
    [2.8, 4.0, 4.8, 5.4, 5.8, 6.1, 6.2, 6.1], [3.1, 4.4, 5.3, 5.9, 6.2, 6.5, 6.6, 6.5],
    [3.3, 4.7, 5.6, 6.2, 6.5, 6.8, 6.9, 6.9], [3.5, 5.0, 5.9, 6.4, 6.8, 7.1, 7.3, 7.3],
    [3.5, 5.0, 6.0, 6.5, 6.9, 7.3, 7.5, 7.6], [3.4, 4.9, 5.9, 6.5, 6.9, 7.4, 7.8, 8.0],
    [3.2, 4.6, 5.6, 6.3, 6.8, 7.4, 7.8, 8.1], [2.7, 4.0, 5.0, 5.8, 6.4, 7.1, 7.6, 8.0],
    [2.3, 3.4, 4.3, 5.1, 5.8, 6.6, 7.2, 7.6], [2.0, 3.0, 3.9, 4.6, 5.3, 6.2, 6.8, 7.2],
    [1.9, 2.8, 3.6, 4.3, 5.0, 5.9, 6.5, 7.0],
  ];
  var ZONA_MORTA = 35;
  function idx(arr, v) { v = clamp(v, arr[0], arr[arr.length - 1]); for (var i = 0; i < arr.length - 2 && v > arr[i + 1]; i++); return { i: i, f: (v - arr[i]) / (arr[i + 1] - arr[i]) }; }
  function polar(twa, tws) {
    if (tws < 4) return tws <= 0 ? 0 : polar(twa, 4) * tws / 4;
    var a = idx(POL_TWA, twa), b = idx(POL_TWS, tws);
    var l0 = POL[a.i][b.i] * (1 - b.f) + POL[a.i][b.i + 1] * b.f, l1 = POL[a.i + 1][b.i] * (1 - b.f) + POL[a.i + 1][b.i + 1] * b.f;
    return l0 * (1 - a.f) + l1 * a.f;
  }
  function aparente(tws, twa, bs) {
    var x = tws * Math.cos(twa * D2R) + bs, y = tws * Math.sin(twa * D2R);
    return { aws: Math.hypot(x, y), awa: tws < 0.05 && bs < 0.05 ? twa : Math.atan2(y, x) / D2R };
  }
  /** Escala Beaufort (OMM): limites em nós. */
  function beaufort(kn) { var lim = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64]; for (var i = 0; i < lim.length; i++) if (kn < lim[i]) return i; return 12; }
  var SETORES = [
    { id: 'morta', b: 35, nome: 'No vento (zona morta)', en: 'in irons / no-go zone' },
    { id: 'cerrada', b: 55, nome: 'Bolina cerrada', en: 'close-hauled' },
    { id: 'folgada', b: 80, nome: 'Bolina folgada', en: 'close reach' },
    { id: 'traves', b: 100, nome: 'Través', en: 'beam reach' },
    { id: 'largo', b: 160, nome: 'Largo', en: 'broad reach' },
    { id: 'popa', b: 181, nome: 'Popa rasa', en: 'run' },
  ];
  function setorDe(twa) { for (var i = 0; i < SETORES.length; i++) if (twa < SETORES[i].b) return SETORES[i]; return SETORES[SETORES.length - 1]; }

  /** Estado físico: rho = vento verdadeiro a partir da proa (+ boreste). */
  function fisica(rho, tws, rizo, furl) {
    var twa = Math.abs(rho), lado = rho >= 0 ? 1 : -1;
    var areaGrande = [1, 0.78, 0.58][rizo], areaGenoa = 1 - furl / 100;
    var area = 0.45 * areaGrande + 0.55 * areaGenoa;
    var r = { twa: twa, lado: lado, sot: -lado, tws: tws, area: area, setor: setorDe(twa) };
    r.noVento = twa < ZONA_MORTA || tws < 0.5;
    if (twa < ZONA_MORTA) r.bs = 0;
    else r.bs = polar(twa, tws) * (1 - 0.3 * (1 - area) * clamp((16 - tws) / 10, 0, 1));
    var ap = aparente(tws, twa, r.bs);
    r.awa = ap.awa; r.aws = ap.aws;
    if (r.noVento) { r.dm = 2; r.dg = 4; }
    else { r.dm = clamp(r.awa - 23, 3, 78); r.dg = clamp(r.awa - 18, 10, 75); }
    r.encoberta = !r.noVento && r.awa > 160;
    var lateral = r.noVento ? 0.04 : r.awa < 25 ? 0.25 : Math.max(0, Math.cos((r.awa - 35) * 0.72 * D2R));
    var F = 0.05 * r.aws * r.aws * area * lateral;
    r.banda = 30 * (1 - Math.exp(-F / 18));
    r.bft = beaufort(tws);
    return r;
  }

  /* ------------------------------------------------------------ partes (anatomia) */
  var GRUPOS = {
    casco: { nome: 'Casco', ordem: 0 },
    conves: { nome: 'Convés', ordem: 1 },
    mastro: { nome: 'Mastreação', ordem: 2 },
    velas: { nome: 'Velas e cabos', ordem: 3 },
  };
  var ORDEM_GRUPOS = ['casco', 'conves', 'mastro', 'velas'];
  var PARTES = [
    { id: 'casco', g: 'casco', nome: 'Casco', en: 'hull', txt: 'O corpo do barco: flutua, corta a água com suas linhas e carrega todo o resto. Este modelo de exemplo tem cerca de 9,75 m (32 pés) de comprimento e 3,3 m de boca (largura máxima); o seu barco pode ser menor ou maior, com as mesmas partes.' },
    { id: 'proa', g: 'casco', nome: 'Proa', en: 'bow', txt: 'A parte da frente do barco. A peça que forma a quina da proa chama-se roda de proa.' },
    { id: 'popa', g: 'casco', nome: 'Popa e espelho de popa', en: 'stern, transom', txt: 'A parte de trás do barco. O painel que fecha a popa chama-se espelho de popa.' },
    { id: 'boreste', g: 'casco', nome: 'Boreste', en: 'starboard', txt: 'O lado direito de quem está a bordo olhando para a proa. A luz de navegação de boreste é verde (RIPEAM, Regra 21).', semMalha: true },
    { id: 'bombordo', g: 'casco', nome: 'Bombordo', en: 'port', txt: 'O lado esquerdo de quem está a bordo olhando para a proa. A luz de navegação de bombordo é encarnada, ou seja, vermelha (RIPEAM, Regra 21).', semMalha: true },
    { id: 'linhadagua', g: 'casco', nome: 'Linha d’água', en: 'waterline', txt: 'Onde a superfície da água encontra o casco. Abaixo dela ficam as obras vivas (a parte submersa, com tinta antiincrustante); acima, as obras mortas (o costado).' },
    { id: 'quilha', g: 'casco', nome: 'Quilha de bolina fixa', en: 'fin keel', txt: 'Lâmina funda e pesada sob o casco, aqui com bulbo. O lastro de ferro ou chumbo dá estabilidade contra a banda, e a lâmina impede o barco de escorregar de lado (o abatimento). Calado deste barco: cerca de 1,9 m.' },
    { id: 'leme', g: 'casco', nome: 'Leme suspenso', en: 'spade rudder', txt: 'Lâmina presa só pelo seu eixo (a madre), sem quilha à frente. Desvia a água e faz o barco girar, mas só governa com o barco em movimento (com seguimento).' },
    { id: 'luzes', g: 'casco', nome: 'Luzes de navegação', en: 'navigation lights', txt: 'Verde a boreste, encarnada a bombordo e branca de alcançado na popa. Em barcos com menos de 20 m as luzes de bordo podem vir combinadas numa só lanterna na proa, como aqui (RIPEAM, Regra 21 b). Um veleiro com menos de 20 m pode ainda usar uma lanterna tricolor no topo do mastro (Regra 25 b).' },
    { id: 'conves', g: 'conves', nome: 'Convés', en: 'deck', txt: 'O piso de cima do barco, por onde a tripulação anda. Tem superfície antiderrapante; os corredores dos lados da cabine são os passadiços (side decks).' },
    { id: 'cabine', g: 'conves', nome: 'Cabine (casaria)', en: 'coachroof', txt: 'A parte elevada sobre o convés que dá altura ao interior: camarotes, cozinha e mesa de navegação. Na frente do cockpit fica a gaiuta de entrada (companionway).' },
    { id: 'cockpit', g: 'conves', nome: 'Cockpit', en: 'cockpit', txt: 'A área rebaixada perto da popa de onde se governa e se manobram as escotas. É o lugar mais protegido para a tripulação durante a navegação.' },
    { id: 'roda', g: 'conves', nome: 'Roda de leme', en: 'wheel', txt: 'Governa o barco movendo o leme por cabos ou setor. Gira-se a roda para o lado para onde se quer levar a proa, como num carro.', nomeCana: 'Cana do leme', enCana: 'tiller', txtCana: 'Alavanca presa no topo da madre do leme. A proa vai para o lado oposto ao que se empurra a cana: cana para boreste, proa para bombordo.' },
    { id: 'catracas', g: 'conves', nome: 'Catracas (winches)', en: 'winches', txt: 'Tambores com manivela que multiplicam a força para caçar escotas e adriças. As primárias, no cockpit, trabalham as escotas da genoa; as da cabine, as adriças.' },
    { id: 'balaustres', g: 'conves', nome: 'Balaústres', en: 'stanchions', txt: 'Postes de inox presos na borda do convés que sustentam os guarda-mancebos.' },
    { id: 'guardamancebos', g: 'conves', nome: 'Guarda-mancebos', en: 'lifelines', txt: 'Cabos esticados entre os púlpitos, passando pelos balaústres: a "cerca" que ajuda a não cair no mar. Não substituem o cinto de segurança preso à linha de vida.' },
    { id: 'pulpito', g: 'conves', nome: 'Púlpito de proa', en: 'bow pulpit', txt: 'Grade de tubo de inox na proa onde começam os guarda-mancebos. Dá apoio a quem trabalha na proa, por exemplo ao fundear.' },
    { id: 'balcao', g: 'conves', nome: 'Púlpito de popa', en: 'stern pulpit (pushpit)', txt: 'Grade de tubo na popa onde terminam os guarda-mancebos. Costuma levar a luz de alcançado, a boia de salvamento e a antena.' },
    { id: 'enora', g: 'conves', nome: 'Enora', en: 'mast partners', txt: 'Abertura reforçada na cabine por onde passa o mastro, que neste barco desce até a quilha (mastro passante). Leva uma capa de vedação contra a água.' },
    { id: 'mastro', g: 'mastro', nome: 'Mastro', en: 'mast', txt: 'Coluna que sustenta as velas. Neste barco sobe cerca de 13,5 m acima do convés e é seguro pelo aparelho fixo: estais e brandais.' },
    { id: 'retranca', g: 'mastro', nome: 'Retranca', en: 'boom', txt: 'Verga horizontal presa ao mastro que estica o pé da vela grande. Passa de um bordo ao outro na cambada e no jaibe: cuidado com a cabeça.' },
    { id: 'cruzetas', g: 'mastro', nome: 'Cruzetas', en: 'spreaders', txt: 'Braços que afastam os brandais do mastro, para que eles segurem o mastro com um ângulo melhor.' },
    { id: 'estai', g: 'mastro', nome: 'Estai de proa', en: 'forestay', txt: 'Cabo de aço da proa ao topo do mastro: segura o mastro para a frente. Nele trabalha a genoa, aqui com enrolador.' },
    { id: 'estaipopa', g: 'mastro', nome: 'Estai de popa', en: 'backstay', txt: 'Cabo de aço do topo do mastro à popa: segura o mastro para trás. Mais tensão nele retesa o estai de proa e achata a vela grande.' },
    { id: 'brandais', g: 'mastro', nome: 'Brandais', en: 'shrouds', txt: 'Cabos de aço laterais, do mastro às chapas na borda do casco: seguram o mastro de lado. Os altos passam pelas pontas das cruzetas; os baixos vão à raiz delas.' },
    { id: 'burro', g: 'mastro', nome: 'Burro', en: 'boom vang', txt: 'Talha ou haste entre a retranca e o pé do mastro. Impede a retranca de subir e controla a torção da vela grande, principalmente com vento folgado.' },
    { id: 'enrolador', g: 'mastro', nome: 'Enrolador da genoa', en: 'roller furler', txt: 'Tambor e perfil no estai de proa que enrolam a genoa em volta do estai: reduz a vela sem ninguém ir à proa.' },
    { id: 'grande', g: 'velas', nome: 'Vela grande', en: 'mainsail', txt: 'Vela presa ao mastro e à retranca. A bolsa (curvatura) é o que gera força com o vento. Tem rizos para reduzir a área quando o vento aumenta.' },
    { id: 'rizos', g: 'velas', nome: 'Rizos', en: 'reef points', txt: 'Faixas de reforço com olhais na vela grande. Rizar é baixar a vela até um rizo e prender o excesso na retranca: menos área, menos banda. A regra prática é rizar cedo, antes de precisar.' },
    { id: 'genoa', g: 'velas', nome: 'Genoa', en: 'genoa', txt: 'Vela de proa grande que passa por trás do mastro (sobreposta). Aqui é enrolável: pode ser reduzida aos poucos pelo enrolador.' },
    { id: 'birutas', g: 'velas', nome: 'Birutas da genoa', en: 'telltales', txt: 'Fitas leves dos dois lados da genoa, perto da testa. Correndo paralelas, mostram que o ar escoa bem pelos dois lados da vela.' },
    { id: 'windex', g: 'velas', nome: 'Biruta do topo', en: 'masthead wind indicator', txt: 'Seta no topo do mastro que aponta de onde vem o vento aparente, o vento sentido a bordo. As duas abas fixas marcam o ângulo de bolina.' },
    { id: 'adricas', g: 'velas', nome: 'Adriças', en: 'halyards', txt: 'Cabos que içam (sobem) as velas. Descem pelo mastro e vêm até as catracas da cabine.' },
    { id: 'escotas', g: 'velas', nome: 'Escotas', en: 'sheets', txt: 'Cabos que caçam (puxam) e folgam as velas. A da genoa passa por um carrinho no passadiço e vai à catraca do cockpit; a da grande trabalha numa talha com carrinho (traveler).' },
  ];
  var PARTE = {};
  PARTES.forEach(function (p) { PARTE[p.id] = p; });
  var VISTAS = { '34': { nome: '3/4', dir: [1, 0.42, -1.05], aria: 'Vista em três quartos' }, lado: { nome: 'Lado', dir: [1, 0.1, 0.0001], aria: 'Vista de lado, por boreste' }, proa: { nome: 'Proa', dir: [0.0001, 0.12, -1], aria: 'Vista pela proa' }, popa: { nome: 'Popa', dir: [0.25, 0.3, 1], aria: 'Vista pela popa' }, cima: { nome: 'Cima', dir: [0, 1, 0.002], aria: 'Vista de cima' } };

  /* ------------------------------------------------------------ geometria do casco (metros; proa em −Z, boreste em +X, água em y = 0) */
  var ZB = -4.9, ZS = 4.85;
  function zDe(t) { return ZB + (ZS - ZB) * t; }
  function tDe(z) { return clamp((z - ZB) / (ZS - ZB), 0, 1); }
  /** Interpolação cúbica monótona (Fritsch–Carlson): sem ondulações entre os pontos. */
  function curva(pts) {
    var n = pts.length, x = pts.map(function (p) { return p[0]; }), y = pts.map(function (p) { return p[1]; }), d = [], m = [];
    for (var i = 0; i < n - 1; i++) d.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { var tt = 3 / Math.sqrt(s); m[i] = tt * a * d[i]; m[i + 1] = tt * b * d[i]; }
    }
    return function (t) {
      if (t <= x[0]) return y[0];
      if (t >= x[n - 1]) return y[n - 1];
      var k = 0; while (t > x[k + 1]) k++;
      var hh = x[k + 1] - x[k], s = (t - x[k]) / hh, s2 = s * s, s3 = s2 * s;
      return (2 * s3 - 3 * s2 + 1) * y[k] + (s3 - 2 * s2 + s) * hh * m[k] + (-2 * s3 + 3 * s2) * y[k + 1] + (s3 - s2) * hh * m[k + 1];
    };
  }
  var BS = curva([[0, 0], [0.03, 0.3], [0.1, 0.8], [0.2, 1.2], [0.35, 1.53], [0.5, 1.66], [0.62, 1.68], [0.78, 1.61], [0.9, 1.52], [1, 1.43]]);
  var SH = curva([[0, 1.44], [0.15, 1.31], [0.35, 1.19], [0.55, 1.12], [0.75, 1.09], [1, 1.11]]);
  var KL = curva([[0, 1.42], [0.025, 0.8], [0.06, 0.1], [0.1, -0.2], [0.2, -0.42], [0.4, -0.55], [0.55, -0.52], [0.7, -0.38], [0.85, -0.16], [1, 0.16]]);
  var NX = curva([[0, 1.1], [0.25, 1.4], [0.5, 1.9], [0.8, 2.4], [1, 2.6]]);
  /** Ponto da seção em t, parâmetro th ∈ [0, π/2] da quilha (0) à borda (π/2): superelipse. */
  function secao(t, th) {
    var b = BS(t), s = SH(t), k = KL(t), n = NX(t), m = 2.6;
    return [b * Math.pow(Math.sin(th), 2 / n), s - (s - k) * Math.pow(Math.cos(th), 2 / m)];
  }
  function convesY(z) { return SH(tDe(z)); }

  /* ------------------------------------------------------------ desenho alternativo (sem WebGL) */
  function svgPerfil() {
    var NSs = 'http://www.w3.org/2000/svg';
    var s = '<svg xmlns="' + NSs + '" viewBox="0 0 360 420" class="v3-perfil" role="img" aria-label="Veleiro de cruzeiro de perfil, com as partes principais">' +
      '<line x1="0" y1="330" x2="360" y2="330" class="v3p-agua"/>' +
      '<path d="M48,312 C52,322 60,334 80,338 L268,340 C285,339 296,334 302,318 L302,308 L46,304 Z" class="v3p-casco"/>' +
      '<path d="M150,338 L162,392 L196,392 L190,338 Z" class="v3p-quilha"/>' +
      '<path d="M268,338 L272,374 L284,374 L284,338 Z" class="v3p-quilha"/>' +
      '<path d="M130,304 L136,292 L236,292 L242,304 Z" class="v3p-cabine"/>' +
      '<line x1="160" y1="292" x2="160" y2="20" class="v3p-mastro"/>' +
      '<line x1="160" y1="22" x2="50" y2="304" class="v3p-cabo"/><line x1="160" y1="22" x2="300" y2="306" class="v3p-cabo"/>' +
      '<path d="M163,30 C176,110 206,220 240,272 L163,276 Z" class="v3p-vela"/>' +
      '<line x1="160" y1="276" x2="250" y2="276" class="v3p-mastro"/>' +
      '<path d="M156,34 C142,120 118,230 56,300 C96,292 150,286 196,282 C186,200 170,110 156,34 Z" class="v3p-vela"/>' +
      '<g class="v3p-rot">' +
      '<text x="168" y="16">mastro</text><text x="250" y="150">estai de popa</text><text x="14" y="160">estai de proa</text>' +
      '<text x="196" y="200">grande</text><text x="80" y="250">genoa</text><text x="252" y="270">retranca</text>' +
      '<text x="14" y="300">proa</text><text x="306" y="318">popa</text><text x="200" y="410">quilha</text><text x="290" y="370">leme</text>' +
      '</g></svg>';
    return h('div', { class: 'v3-fallback-svg', html: s });
  }

  /* ------------------------------------------------------------ widget */
  VL.widgets.define('veleiro-3d', {
    css: ['assets/css/widgets/veleiro-3d.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [], vivo = true;
      var reduz = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var st = {
        rho: clamp(num(opts.vento, 50), -180, 180),
        tws: clamp(num(opts.forca, 12), 0, 30),
        rizo: [0, 1, 2].indexOf(+opts.rizo) >= 0 ? +opts.rizo : 0,
        furl: clamp(num(opts.genoa, 0), 0, 90),
        leme: opts.leme === 'cana' ? 'cana' : 'roda',
        rotulos: opts.rotulos !== false,
        grupo: GRUPOS[opts.grupo] ? opts.grupo : 'casco',
        sel: PARTE[opts.parte] ? opts.parte : null,
        vista: VISTAS[opts.vista] ? opts.vista : '34',
        modo: opts.modo === 'identificar' ? 'quiz' : 'explorar',
        abaixo: false,
        ondas: !reduz,
      };
      if (st.sel) { st.grupo = PARTE[st.sel].g; if (['quilha', 'leme', 'linhadagua'].indexOf(st.sel) >= 0) st.abaixo = true; }
      var intl = !!VL.settings.get('intl');
      var fis = fisica(st.rho, st.tws, st.rizo, st.furl);
      var cena = null; /* API da cena 3D quando ela existir */

      function nomeDe(p) { return p.id === 'roda' && st.leme === 'cana' ? p.nomeCana : p.nome; }
      function enDe(p) { return p.id === 'roda' && st.leme === 'cana' ? p.enCana : p.en; }
      function txtDe(p) { return p.id === 'roda' && st.leme === 'cana' ? p.txtCana : p.txt; }

      /* ---------- moldura e controles superiores ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Veleiro de cruzeiro (modelo de ~32 pés, exemplo): anatomia, vento e velas', controlesAntes: true });
      ins.raiz.classList.add('v3-raiz');
      el.appendChild(ins.raiz);
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['quiz', 'Identificar partes']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], 'aria-pressed': String(st.modo === m[0]), onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      var segGrupo = h('div', { class: 'segmented v3-seg-grupo', role: 'group', 'aria-label': 'Grupo de partes' });
      ORDEM_GRUPOS.forEach(function (g) {
        segGrupo.appendChild(h('button', { type: 'button', 'data-v': g, 'aria-pressed': String(st.grupo === g), onclick: function () { trocarGrupo(g); } }, GRUPOS[g].nome));
      });
      ins.controles.appendChild(segModo);
      ins.controles.appendChild(segGrupo);
      ins.legenda.appendChild(h('span', { class: 'v3-fonte' }, 'Modelo didático e aproximado: velas reguladas sozinhas para o vento aparente; banda e velocidade estimadas por uma polar de um cruzeiro de ~32 pés (exemplo; cada barco tem a sua). Luzes: RIPEAM, Regras 21 e 25. Escala Beaufort: OMM.'));

      /* ---------- cena ---------- */
      var canvasBox = h('div', { class: 'v3-canvas' });
      var rotulos = h('div', { class: 'v3-rotulos' });
      var vistasBar = h('div', { class: 'v3-vistas', role: 'group', 'aria-label': 'Vistas' });
      Object.keys(VISTAS).forEach(function (k) {
        vistasBar.appendChild(h('button', { type: 'button', class: 'v3-vista', 'data-v': k, 'aria-label': VISTAS[k].aria, 'aria-pressed': String(st.vista === k), onclick: function () { irVista(k, true); } }, VISTAS[k].nome));
      });
      var dicaCena = h('p', { class: 'v3-dica' }, 'Arraste para girar, use pinça ou a roda do mouse para aproximar e toque num rótulo ou numa peça.');
      var carregando = h('p', { class: 'v3-carregando', role: 'status' }, 'Montando o barco em 3D…');
      /* mostrador do vento, relativo ao barco (proa para cima) */
      var SVGNS = 'http://www.w3.org/2000/svg';
      function S(tag, a) { var e = document.createElementNS(SVGNS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; }
      var hudSvg = S('svg', { viewBox: '0 0 120 120', class: 'v3-hud-svg', role: 'img', 'aria-label': 'Mostrador do vento em relação ao barco, com a proa para cima' });
      hudSvg.appendChild(S('circle', { cx: 60, cy: 60, r: 56, class: 'v3-hud-fundo' }));
      hudSvg.appendChild(S('path', { d: 'M60,36 C67,43 69,53 69,64 L68,84 L52,84 L51,64 C51,53 53,43 60,36 Z', class: 'v3-hud-barco' }));
      var hudVV = S('g', { class: 'v3-hud-vv' }), hudVA = S('g', { class: 'v3-hud-va' });
      [hudVV, hudVA].forEach(function (g) { g.appendChild(S('line', { x1: 60, y1: 6, x2: 60, y2: 28 })); g.appendChild(S('polygon', { points: '53.5,24 66.5,24 60,35' })); hudSvg.appendChild(g); });
      var hud = h('div', { class: 'v3-hud' }, hudSvg,
        h('p', { class: 'v3-hud-leg' }, h('span', { class: 'v3-hud-k' }), 'verdadeiro'),
        h('p', { class: 'v3-hud-leg' }, h('span', { class: 'v3-hud-k v3-hud-k-va' }), 'aparente'));
      function atualizarHud() {
        var r = fis, aw = r.lado * r.awa;
        hudVV.setAttribute('transform', 'rotate(' + st.rho + ' 60 60)');
        hudVA.setAttribute('transform', 'rotate(' + aw + ' 60 60) translate(0 5)');
        hudVV.style.display = hudVA.style.display = st.tws < 0.5 ? 'none' : '';
      }
      var cenaEl = h('div', { class: 'v3-cena' }, canvasBox, rotulos, vistasBar, hud, carregando);

      /* ---------- painel: parte selecionada / desafio ---------- */
      var cartao = h('section', { class: 'v3-cartao', 'aria-live': 'polite' });
      var listaBox = h('section', { class: 'v3-lista-box', 'aria-label': 'Lista de partes' });

      /* ---------- ajustes de vento e velas ---------- */
      function linhaAj(rotulo, saida, controle, extra) {
        return h('div', { class: 'v3-aj' }, h('div', { class: 'v3-aj-rot' }, h('span', null, rotulo), saida), controle, extra || null);
      }
      var inpVento = h('input', { type: 'range', min: '-180', max: '180', step: '5', value: String(st.rho), 'aria-label': 'Direção do vento verdadeiro em relação à proa: negativo por bombordo, positivo por boreste' });
      var outVento = h('output', { class: 'v3-val' });
      var marcasVento = h('div', { class: 'v3-marcas', 'aria-hidden': 'true' }, h('span', null, 'popa'), h('span', null, 'bombordo'), h('span', null, 'proa'), h('span', null, 'boreste'), h('span', null, 'popa'));
      inpVento.addEventListener('input', function () { st.rho = +inpVento.value; mudouVento(); });
      var inpForca = h('input', { type: 'range', min: '0', max: '30', step: '1', value: String(st.tws), 'aria-label': 'Força do vento verdadeiro em nós' });
      var outForca = h('output', { class: 'v3-val' });
      inpForca.addEventListener('input', function () { st.tws = +inpForca.value; mudouVento(); });
      var segRizo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Rizos na vela grande' });
      [[0, 'Inteira'], [1, '1º rizo'], [2, '2º rizo']].forEach(function (r) {
        segRizo.appendChild(h('button', { type: 'button', 'data-v': String(r[0]), 'aria-pressed': String(st.rizo === r[0]), onclick: function () { st.rizo = r[0]; marcarSeg(segRizo, String(r[0])); mudouVento(); } }, r[1]));
      });
      var inpFurl = h('input', { type: 'range', min: '0', max: '90', step: '5', value: String(st.furl), 'aria-label': 'Porcentagem da genoa enrolada' });
      var outFurl = h('output', { class: 'v3-val' });
      inpFurl.addEventListener('input', function () { st.furl = +inpFurl.value; mudouVento(); });
      var segLeme = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Tipo de governo' });
      [['roda', 'Roda de leme'], ['cana', 'Cana do leme']].forEach(function (r) {
        segLeme.appendChild(h('button', { type: 'button', 'data-v': r[0], 'aria-pressed': String(st.leme === r[0]), onclick: function () { st.leme = r[0]; marcarSeg(segLeme, r[0]); if (cena) cena.leme(); atualizarRotulosTexto(); renderCartao(); renderLista(); } }, r[1]));
      });
      function chave(rotulo, marcado, fn) {
        var inp = h('input', { type: 'checkbox', role: 'switch' });
        inp.checked = !!marcado;
        inp.addEventListener('change', function () { fn(inp.checked); });
        return { el: h('label', { class: 'switch v3-switch' }, inp, h('span', null, rotulo)), inp: inp };
      }
      var swRot = chave('Rótulos', st.rotulos, function (v) { st.rotulos = v; if (cena) cena.rotulos(); });
      var swAbaixo = chave('Ver abaixo d’água', st.abaixo, function (v) { st.abaixo = v; st.abaixoManual = true; if (cena) cena.mar(); });
      function abaixoAuto(v) { if (st.abaixoManual || st.abaixo === v) return; st.abaixo = v; swAbaixo.inp.checked = v; if (cena) cena.mar(); }
      if (st.grupo === 'casco' && st.modo !== 'quiz') abaixoAuto(true);
      var swOndas = chave('Ondas', st.ondas, function (v) { st.ondas = v; if (cena) cena.pedir(); });
      var ajustes = h('section', { class: 'v3-ajustes', 'aria-label': 'Vento e velas' },
        h('h4', null, 'Vento e velas'),
        linhaAj('Vento verdadeiro vem de ', outVento, inpVento, marcasVento),
        linhaAj('Força: ', outForca, inpForca),
        h('div', { class: 'v3-aj' }, h('div', { class: 'v3-aj-rot' }, h('span', null, 'Vela grande')), segRizo),
        linhaAj('Genoa enrolada: ', outFurl, inpFurl),
        h('div', { class: 'v3-aj' }, h('div', { class: 'v3-aj-rot' }, h('span', null, 'Governo')), segLeme),
        h('div', { class: 'v3-chaves' }, swRot.el, swAbaixo.el, reduz ? null : swOndas.el));
      if (opts.ajustes === false) ajustes.hidden = true;

      /* ---------- leituras ---------- */
      var cond = h('section', { class: 'v3-cond', 'aria-label': 'Condições' });
      var condTit = h('p', { class: 'v3-cond-tit' });
      var condDl = h('dl', { class: 'v3-dl' });
      function dd(rot) { var d = h('dd'); condDl.appendChild(h('div', null, h('dt', null, rot), d)); return d; }
      var ddAmura = dd('Amura'), ddAp = dd('Vento aparente'), ddVel = dd('Velocidade'), ddBanda = dd('Banda'), ddVelas = dd('Velas');
      var condAviso = h('p', { class: 'v3-aviso', hidden: true });
      cond.appendChild(condTit); cond.appendChild(condDl); cond.appendChild(condAviso);
      if (opts.ajustes === false) cond.hidden = true;

      var colCena = h('div', { class: 'v3-col-cena' }, cenaEl, dicaCena, ajustes);
      var lado = h('div', { class: 'v3-lado' }, cartao, listaBox, cond);
      ins.corpo.appendChild(h('div', { class: 'v3-grade' }, colCena, lado));

      function marcarSeg(seg, v) { VL.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); }

      /* ---------- textos de condição ---------- */
      function atualizarCond() {
        var r = fis;
        var ladoTxt = r.twa < 0.5 || r.twa > 179.5 ? (r.twa < 1 ? 'da proa' : 'da popa') : graus(r.twa) + ' por ' + (r.lado > 0 ? 'boreste' : 'bombordo');
        outVento.textContent = ladoTxt;
        outForca.textContent = VL.fmt.num(st.tws, 0) + ' nós · força ' + r.bft + ' Beaufort';
        outFurl.textContent = st.furl ? st.furl + '%' : 'nada (aberta)';
        condTit.textContent = r.setor.nome;
        if (intl) condTit.appendChild(h('span', { class: 'v3-en' }, ' (' + r.setor.en + ')'));
        ddAmura.textContent = r.twa > 179.5 ? 'vento exatamente pela popa' : r.twa < 0.5 ? 'vento exatamente pela proa' : 'amurado a ' + (r.lado > 0 ? 'boreste' : 'bombordo') + ' (vento entra por ' + (r.lado > 0 ? 'boreste' : 'bombordo') + ')';
        ddAp.textContent = st.tws < 0.5 ? 'sem vento' : graus(r.awa) + ' da proa · ' + nos(r.aws);
        ddVel.textContent = r.noVento ? 'sem seguimento' : nos(r.bs) + ' (aproximada)';
        ddBanda.textContent = graus(r.banda) + ' para ' + (r.sot > 0 ? 'boreste' : 'bombordo');
        ddVelas.textContent = r.noVento ? 'panejando, sem força' : 'retranca a ' + graus(r.dm) + ' da linha de centro, genoa a ' + graus(r.dg) + ', a ' + (r.sot > 0 ? 'boreste' : 'bombordo');
        var av = '';
        if (st.tws < 0.5) av = 'Calmaria: sem vento, as velas pendem e o barco não anda à vela.';
        else if (r.noVento) av = 'Proa a menos de 35° do vento: o barco fica "no vento" (aproado). As velas panejam e o barco perde o seguimento. Arribe para encher as velas.';
        else if (r.banda > 21) av = 'Banda forte: o barco fica ardente (quer orçar) e desconfortável. Regra prática de cruzeiro: rize a grande e enrole parte da genoa. Cada barco tem seu limite.';
        else if (r.twa > 165) av = 'Vento quase pela popa: risco de jaibe involuntário, quando a retranca cruza o barco com violência. A genoa fica encoberta pela grande. Muitos preferem navegar num largo.';
        condAviso.hidden = !av; condAviso.textContent = av;
      }

      function mudouVento() {
        fis = fisica(st.rho, st.tws, st.rizo, st.furl);
        atualizarCond(); atualizarHud();
        if (cena) cena.vento();
      }

      /* ---------- cartão e lista ---------- */
      var quiz = { n: 0, certas: 0, total: 10, atual: null, opcoes: [], resp: null, feitos: [] };
      function renderCartao() {
        cartao.innerHTML = '';
        if (st.modo === 'quiz') { renderQuiz(); return; }
        var p = st.sel ? PARTE[st.sel] : null;
        if (!p) {
          cartao.appendChild(h('h4', null, 'Anatomia do veleiro'));
          cartao.appendChild(h('p', null, 'Escolha um grupo acima e toque num rótulo ou numa peça do barco para ver o nome e para que ela serve. Use as vistas para olhar de cima, de lado ou pela proa.'));
          return;
        }
        var lista = partesDoGrupo(p.g), i = lista.indexOf(p);
        cartao.appendChild(h('p', { class: 'v3-cartao-g' }, GRUPOS[p.g].nome + ' · ' + (i + 1) + ' de ' + lista.length));
        cartao.appendChild(h('h4', null, nomeDe(p), intl ? h('span', { class: 'v3-en' }, ' (' + enDe(p) + ')') : null));
        cartao.appendChild(h('p', null, txtDe(p)));
        if (p.id === 'rizos' && st.rizo === 0) cartao.appendChild(h('p', { class: 'v3-cartao-dica' }, 'Experimente "1º rizo" e "2º rizo" em Vento e velas.'));
        if (p.id === 'enrolador' && st.furl === 0) cartao.appendChild(h('p', { class: 'v3-cartao-dica' }, 'Experimente enrolar parte da genoa em Vento e velas.'));
        cartao.appendChild(h('div', { class: 'v3-cartao-nav' },
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { passo(-1); } }, 'Anterior'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { passo(1); } }, 'Próxima'),
          cena ? h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { cena.focar(st.sel); } }, 'Aproximar') : null));
      }
      function partesDoGrupo(g) { return PARTES.filter(function (p) { return p.g === g; }); }
      function passo(d) {
        var todas = PARTES, i = st.sel ? todas.indexOf(PARTE[st.sel]) : -1;
        i = (i + d + todas.length) % todas.length;
        selecionar(todas[i].id, true);
      }
      function renderLista() {
        listaBox.innerHTML = '';
        if (st.modo === 'quiz') { listaBox.hidden = true; return; }
        listaBox.hidden = false;
        listaBox.appendChild(h('h4', null, 'Partes: ' + GRUPOS[st.grupo].nome.toLowerCase()));
        var ul = h('div', { class: 'chip-list v3-lista' });
        partesDoGrupo(st.grupo).forEach(function (p) {
          ul.appendChild(h('button', { type: 'button', class: 'chip v3-chip', 'aria-pressed': String(st.sel === p.id), onclick: function () { selecionar(p.id, true); } }, nomeDe(p)));
        });
        listaBox.appendChild(ul);
      }
      function selecionar(id, focar) {
        st.sel = id;
        var p = PARTE[id];
        if (p && p.g !== st.grupo) { st.grupo = p.g; marcarSeg(segGrupo, st.grupo); abaixoAuto(p.g === 'casco'); if (cena && !focar) cena.irVista(st.vista, true); }
        if (p && ['quilha', 'leme', 'linhadagua'].indexOf(id) >= 0 && !st.abaixo) { st.abaixo = true; swAbaixo.inp.checked = true; if (cena) cena.mar(); }
        renderCartao(); renderLista();
        if (cena) { cena.destacar(); cena.rotulos(); if (focar) cena.focar(id); }
      }
      function trocarGrupo(g) {
        var mudou = st.grupo !== g;
        st.grupo = g; marcarSeg(segGrupo, g);
        abaixoAuto(g === 'casco');
        if (st.sel && PARTE[st.sel].g !== g) st.sel = null;
        renderCartao(); renderLista();
        if (cena) { cena.destacar(); cena.rotulos(); if (mudou) cena.irVista(st.vista, true); }
      }
      function trocarModo(m) {
        st.modo = m; marcarSeg(segModo, m);
        segGrupo.hidden = m === 'quiz';
        if (m === 'quiz') { quiz.n = 0; quiz.certas = 0; quiz.feitos = []; novaPergunta(); }
        else { st.sel = null; renderCartao(); renderLista(); if (cena) { cena.destacar(); cena.rotulos(); cena.irVista(st.vista, true); } }
      }

      /* ---------- desafio: identificar a parte destacada ---------- */
      function novaPergunta() {
        var pool = PARTES.filter(function (p) { return !p.semMalha && quiz.feitos.indexOf(p.id) < 0; });
        if (!pool.length) { quiz.feitos = []; pool = PARTES.filter(function (p) { return !p.semMalha; }); }
        var alvo = pool[Math.floor(Math.random() * pool.length)];
        quiz.feitos.push(alvo.id);
        var mesmos = VL.embaralhar(PARTES.filter(function (p) { return p.id !== alvo.id && p.g === alvo.g && !p.semMalha; }));
        var outros = VL.embaralhar(PARTES.filter(function (p) { return p.id !== alvo.id && p.g !== alvo.g && !p.semMalha; }));
        var dist = mesmos.slice(0, 2).concat(outros).slice(0, 3);
        quiz.atual = alvo; quiz.resp = null;
        quiz.opcoes = VL.embaralhar([alvo].concat(dist));
        st.sel = alvo.id;
        if (['quilha', 'leme', 'linhadagua'].indexOf(alvo.id) >= 0 && !st.abaixo) { st.abaixo = true; swAbaixo.inp.checked = true; if (cena) cena.mar(); }
        renderCartao(); renderLista();
        if (cena) { cena.destacar(); cena.rotulos(); cena.focar(alvo.id); }
      }
      function renderQuiz() {
        if (quiz.n >= quiz.total) {
          cartao.appendChild(h('h4', null, 'Resultado'));
          cartao.appendChild(h('p', null, 'Você reconheceu ' + quiz.certas + ' de ' + quiz.total + ' partes.' + (quiz.certas >= 8 ? ' Muito bem: esse vocabulário é usado em toda manobra.' : ' Volte ao modo Explorar, percorra os grupos e tente de novo.')));
          cartao.appendChild(h('div', { class: 'v3-cartao-nav' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { quiz.n = 0; quiz.certas = 0; quiz.feitos = []; novaPergunta(); } }, 'Recomeçar')));
          return;
        }
        var a = quiz.atual;
        cartao.appendChild(h('p', { class: 'v3-cartao-g' }, 'Pergunta ' + (quiz.n + 1) + ' de ' + quiz.total + ' · ' + quiz.certas + ' certa' + (quiz.certas === 1 ? '' : 's')));
        cartao.appendChild(h('h4', null, 'Que parte está destacada em magenta?'));
        var alts = h('div', { class: 'v3-alts', role: 'group', 'aria-label': 'Alternativas' });
        quiz.opcoes.forEach(function (p) {
          var b = h('button', { type: 'button', class: 'alternativa', disabled: quiz.resp ? true : null, onclick: function () { responder(p); } }, nomeDe(p));
          if (quiz.resp) {
            if (p.id === a.id) b.setAttribute('data-res', 'certa');
            else if (p.id === quiz.resp) b.setAttribute('data-res', 'errada');
          }
          alts.appendChild(b);
        });
        cartao.appendChild(alts);
        if (quiz.resp) {
          var ok = quiz.resp === a.id;
          cartao.appendChild(h('p', { class: ok ? 'v3-fb-ok' : 'v3-fb-erro' }, h('strong', null, ok ? 'Certo. ' : 'Não: é ' + nomeDe(a).toLowerCase() + '. '), txtDe(a)));
          cartao.appendChild(h('div', { class: 'v3-cartao-nav' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { quiz.n++; if (quiz.n < quiz.total) novaPergunta(); else { st.sel = null; renderCartao(); if (cena) { cena.destacar(); cena.rotulos(); } } } }, quiz.n + 1 < quiz.total ? 'Próxima' : 'Ver resultado')));
        }
      }
      function responder(p) {
        if (quiz.resp) return;
        quiz.resp = p.id;
        if (p.id === quiz.atual.id) quiz.certas++;
        renderCartao();
        if (cena) cena.rotulos();
      }

      /* ---------- vistas ---------- */
      function irVista(k, animar) {
        st.vista = k;
        VL.$$('button', vistasBar).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === k)); });
        if (cena) cena.irVista(k, animar);
      }

      /* ---------- rótulos (texto) ---------- */
      var rotEls = {};
      function atualizarRotulosTexto() {
        PARTES.forEach(function (p) {
          var r = rotEls[p.id]; if (!r) return;
          r.btn.innerHTML = '';
          r.btn.appendChild(document.createTextNode(nomeDe(p)));
          if (intl) r.btn.appendChild(h('span', { class: 'v3-en' }, ' (' + enDe(p) + ')'));
          r.btn.setAttribute('aria-label', nomeDe(p) + ': ver função');
        });
      }

      limpezas.push(VL.on('settings', function () {
        var novo = !!VL.settings.get('intl');
        if (novo !== intl) { intl = novo; atualizarRotulosTexto(); renderCartao(); atualizarCond(); if (cena) cena.rotulos(); }
      }));

      atualizarCond(); atualizarHud();
      segGrupo.hidden = st.modo === 'quiz';
      if (st.modo === 'quiz') novaPergunta(); else { renderCartao(); renderLista(); }

      /* ------------------------------------------------------------------------------------------ 3D */
      function temWebGL() {
        try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
      }
      function semWebGL() {
        carregando.remove();
        cenaEl.classList.add('v3-sem3d');
        canvasBox.innerHTML = '';
        canvasBox.appendChild(h('div', { class: 'v3-fallback' },
          h('p', { class: 'v3-fallback-msg' }, 'Este aparelho ou navegador não abriu a cena 3D (WebGL desligado ou indisponível). Veja abaixo o veleiro de perfil; a lista de partes continua funcionando.'),
          svgPerfil()));
        vistasBar.hidden = true; dicaCena.hidden = true; hud.style.display = 'none';
        swRot.el.hidden = true; swAbaixo.el.hidden = true; swOndas.el.hidden = true;
        segModo.hidden = true;
        if (st.modo === 'quiz') trocarModo('explorar');
      }

      var lim3d = [], recriacoes = 0;
      /* limpeza própria da cena 3D (renderer, listeners, geometrias): roda ao sair e antes de recriar a cena */
      function desmontar3D() { var l = lim3d; lim3d = []; l.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } }); }
      limpezas.push(function () { desmontar3D(); });

      function iniciar(T) {
        if (!vivo) return;
        if (!temWebGL()) { semWebGL(); return; }
        var renderer;
        try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' }); } catch (e) { semWebGL(); return; }
        if (!renderer || !renderer.getContext()) { semWebGL(); return; }
        carregando.remove();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.setAttribute('role', 'img');
        canvasBox.appendChild(renderer.domElement);
        var cssR = new T.CSS2DRenderer({ element: rotulos });

        var scene = new T.Scene();
        var camera = new T.PerspectiveCamera(38, 1.25, 0.2, 400);
        var controls = new T.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false; controls.enableDamping = false;
        controls.minDistance = 5; controls.maxDistance = 70;
        controls.maxPolarAngle = Math.PI * 0.62;
        controls.rotateSpeed = 0.8;
        var ALVO0 = new T.Vector3(0, 6.2, 0.3);
        controls.target.copy(ALVO0);

        var geos = [], mats = [], corMats = [];
        function G(g) { geos.push(g); return g; }
        function M(chaveCor, extra) {
          var m = new T.MeshStandardMaterial(Object.assign({ roughness: 0.62, metalness: 0.0 }, extra || {}));
          mats.push(m); if (chaveCor) corMats.push({ m: m, k: chaveCor });
          return m;
        }
        var matCache = {};
        /** material próprio de cada parte (para destacar só ela) */
        function MP(parte, chaveCor, extra) {
          var k = parte + '|' + chaveCor + '|' + JSON.stringify(extra || {});
          if (!matCache[k]) matCache[k] = M(chaveCor, extra);
          return matCache[k];
        }
        var cor = {};
        function lerCores() {
          var esc = VL.settings.temaEscuro();
          function c(v) { return new T.Color(VL.cssVar(v) || '#888888'); }
          function mix(a, b, f) { return c(a).lerp(c(b), f); }
          cor = {
            esc: esc,
            ceu: esc ? mix('--paper', '--sea-1', 0.35) : mix('--paper', '--sea-1', 0.55),
            mar: esc ? mix('--sea-2', '--sea-3', 0.6) : c('--sea-3'),
            casco: esc ? mix('--ink', '--ink-2', 0.2) : c('--surface'),
            faixa: esc ? c('--paper') : c('--ink'),
            fundo: esc ? c('--shoal-2') : c('--ink-2'),
            conves: esc ? c('--ink-3') : c('--shoal'),
            teca: esc ? mix('--land', '--land-ink', 0.5) : c('--land'),
            metal: esc ? c('--ink-2') : c('--ink-3'),
            arame: esc ? c('--ink-3') : c('--ink-2'),
            cabo: c('--land-ink'),
            vela: c('--nav-white'),
            velaLinha: c('--ink-3'),
            vidro: esc ? c('--paper') : c('--ink'),
            vv: c('--ink'), va: c('--magenta'), destaque: c('--magenta'),
            verde: c('--nav-green'), verm: c('--nav-red'), branco: c('--nav-white'),
            luzCeu: esc ? c('--ink-2') : c('--surface'), luzChao: esc ? c('--paper') : c('--sea-2'),
          };
        }
        lerCores();

        /* luzes */
        var hemi = new T.HemisphereLight(0xffffff, 0x888888, 1.4);
        /* luz principal presa à câmera (à esquerda e acima de quem olha): o lado visto fica sempre iluminado */
        var sol = new T.DirectionalLight(0xffffff, 2.2);
        sol.position.set(-6, 9, 2); sol.target.position.set(0, 0, -12);
        camera.add(sol); camera.add(sol.target);
        scene.add(hemi); scene.add(camera);

        /* hierarquia: raiz (balanço das ondas) > banda (adernamento) > barco */
        var raiz = new T.Group(), banda = new T.Group(), barco = new T.Group();
        raiz.add(banda); banda.add(barco); scene.add(raiz);

        var partes = {}; /* id → {malhas:[], mats:[], ancora: Object3D, el, btn} */
        var clicaveis = [];
        PARTES.forEach(function (p) { partes[p.id] = { malhas: [], mats: [] }; });
        function reg(id, obj, semClique) {
          var P = partes[id];
          obj.traverse(function (o) {
            if (!o.isMesh) return;
            P.malhas.push(o);
            if (o.material && P.mats.indexOf(o.material) < 0) P.mats.push(o.material);
            o.userData.parte = id;
            if (!semClique) clicaveis.push(o);
          });
          return obj;
        }
        var proxyMat = new T.MeshBasicMaterial({ visible: false }); mats.push(proxyMat);

        /* ---- utilidades de tubos ---- */
        var cilCache = {};
        function cil(r) { var k = r.toFixed(4); if (!cilCache[k]) cilCache[k] = G(new T.CylinderGeometry(r, r, 1, 8, 1)); return cilCache[k]; }
        var UP = new T.Vector3(0, 1, 0), tmpV = new T.Vector3();
        function poeTubo(m, a, b) {
          tmpV.subVectors(b, a); var len = tmpV.length();
          m.position.addVectors(a, b).multiplyScalar(0.5);
          if (len > 1e-6) m.quaternion.setFromUnitVectors(UP, tmpV.divideScalar(len));
          m.scale.set(1, Math.max(len, 1e-4), 1);
        }
        function tubo(a, b, r, mat, pai) { var m = new T.Mesh(cil(r), mat); poeTubo(m, a, b); (pai || barco).add(m); return m; }
        function V(x, y, z) { return new T.Vector3(x, y, z); }
        /** cabo fino: malha visível + "proxy" grosso e invisível para facilitar o toque */
        function arame(id, pts, r, mat, pai) {
          var g = new T.Group();
          for (var i = 0; i < pts.length - 1; i++) {
            tubo(pts[i], pts[i + 1], r, mat, g);
            var px = tubo(pts[i], pts[i + 1], 0.16, proxyMat, g); px.userData.proxy = true;
          }
          (pai || barco).add(g);
          reg(id, g);
          return g;
        }

        /* ---- casco ---- */
        var uFaixa = { value: new T.Color() }, uFundo = { value: new T.Color() };
        var matCasco = M('casco', { roughness: 0.38, side: T.DoubleSide });
        matCasco.onBeforeCompile = function (sh) {
          sh.uniforms.uFaixa = uFaixa; sh.uniforms.uFundo = uFundo;
          sh.vertexShader = 'attribute float aSheer;\nvarying float vHy;\nvarying float vSh;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vHy = position.y; vSh = aSheer;');
          sh.fragmentShader = 'uniform vec3 uFaixa;\nuniform vec3 uFundo;\nvarying float vHy;\nvarying float vSh;\n' + sh.fragmentShader.replace('#include <color_fragment>',
            '#include <color_fragment>\n' +
            '  float aa = max(fwidth(vHy), 0.002);\n' +
            '  float fundo = 1.0 - smoothstep(0.05 - aa, 0.05 + aa, vHy);\n' +
            '  float boot = smoothstep(0.05 - aa, 0.05 + aa, vHy) * (1.0 - smoothstep(0.13 - aa, 0.13 + aa, vHy));\n' +
            '  float cove = smoothstep(vSh - 0.27 - aa, vSh - 0.27 + aa, vHy) * (1.0 - smoothstep(vSh - 0.19 - aa, vSh - 0.19 + aa, vHy));\n' +
            '  diffuseColor.rgb = mix(diffuseColor.rgb, uFaixa, clamp(boot + cove, 0.0, 1.0));\n' +
            '  diffuseColor.rgb = mix(diffuseColor.rgb, uFundo, fundo);');
        };
        function geoCasco() {
          var NS = 64, MM = 22, pos = [], shv = [], ix = [];
          for (var lado = 0; lado < 2; lado++) {
            var sg = lado ? -1 : 1, base = pos.length / 3;
            for (var i = 0; i <= NS; i++) {
              var t = Math.max(0.0015, (1 - Math.cos(Math.PI * i / NS)) / 2), z = zDe(t), sv = SH(t);
              for (var j = 0; j <= MM; j++) { var q = secao(t, (Math.PI / 2) * j / MM); pos.push(sg * q[0], q[1], z); shv.push(sv); }
            }
            for (i = 0; i < NS; i++) for (j = 0; j < MM; j++) {
              var a = base + i * (MM + 1) + j, b = a + MM + 1;
              if (sg > 0) ix.push(a, a + 1, b, b, a + 1, b + 1); else ix.push(a, b, a + 1, b, b + 1, a + 1);
            }
          }
          var g = new T.BufferGeometry();
          g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
          g.setAttribute('aSheer', new T.Float32BufferAttribute(shv, 1));
          g.setIndex(ix); g.computeVertexNormals();
          return G(g);
        }
        var cascoM = new T.Mesh(geoCasco(), matCasco);
        barco.add(cascoM); reg('casco', cascoM);
        /* espelho de popa */
        (function () {
          var sp = new T.Shape(), MM = 22, i, q;
          q = secao(1, 0); sp.moveTo(0, q[1]);
          for (i = 1; i <= MM; i++) { q = secao(1, (Math.PI / 2) * i / MM); sp.lineTo(q[0], q[1]); }
          for (i = MM; i >= 0; i--) { q = secao(1, (Math.PI / 2) * i / MM); sp.lineTo(-q[0], q[1]); }
          var g = G(new T.ShapeGeometry(sp));
          g.translate(0, 0, ZS);
          var n = g.attributes.position.count, a = new Float32Array(n); for (i = 0; i < n; i++) a[i] = SH(1);
          g.setAttribute('aSheer', new T.BufferAttribute(a, 1));
          var m = new T.Mesh(g, matCasco); barco.add(m); reg('popa', m);
        })();
        /* linha d'água (só aparece destacada) */
        (function () {
          var pts = [], NS = 60, i, t, j, xw;
          function xNa(t, y) { var lo = 0, hi = Math.PI / 2; for (var it = 0; it < 30; it++) { var md = (lo + hi) / 2; if (secao(t, md)[1] < y) lo = md; else hi = md; } return secao(t, (lo + hi) / 2)[0]; }
          var y0 = 0.09, tIni = 0, tFim = 1;
          for (i = 0; i <= NS; i++) { t = i / NS; if (KL(t) < y0) { tIni = t; break; } }
          for (i = NS; i >= 0; i--) { t = i / NS; if (KL(t) < y0) { tFim = t; break; } }
          for (j = 0; j <= NS; j++) { t = lerp(tIni, tFim, j / NS); xw = xNa(t, y0); pts.push(V(xw + 0.012, y0, zDe(t))); }
          for (j = NS; j >= 0; j--) { t = lerp(tIni, tFim, j / NS); xw = xNa(t, y0); pts.push(V(-xw - 0.012, y0, zDe(t))); }
          var curvaW = new T.CatmullRomCurve3(pts, true);
          var m = new T.Mesh(G(new T.TubeGeometry(curvaW, 160, 0.03, 5, true)), M('destaque'));
          m.visible = false; barco.add(m); reg('linhadagua', m, true);
          partes.linhadagua.soDestaque = true;
        })();

        /* ---- convés com abertura do cockpit ---- */
        var CK = { x: 0.78, z0: 2.12, z1: 4.3 };
        var matConves = M('conves', { side: T.DoubleSide, roughness: 0.85 });
        (function () {
          var sp = new T.Shape(), NS = 60, i, t;
          sp.moveTo(0, ZB + 0.01);
          for (i = 1; i <= NS; i++) { t = i / NS; sp.lineTo(BS(t), zDe(t)); }
          for (i = NS; i >= 1; i--) { t = i / NS; sp.lineTo(-BS(t), zDe(t)); }
          var furo = new T.Path();
          furo.moveTo(-CK.x, CK.z0); furo.lineTo(-CK.x, CK.z1); furo.lineTo(CK.x, CK.z1); furo.lineTo(CK.x, CK.z0); furo.lineTo(-CK.x, CK.z0);
          sp.holes.push(furo);
          var g = G(new T.ShapeGeometry(sp, 1));
          var p = g.attributes.position;
          for (i = 0; i < p.count; i++) { var x = p.getX(i), z = p.getY(i); p.setXYZ(i, x, convesY(z) + 0.004, z); }
          g.computeVertexNormals();
          var m = new T.Mesh(g, matConves); barco.add(m); reg('conves', m);
        })();
        /* cockpit */
        var Y_FUNDO_CK = convesY(3.2) - 0.48;
        (function () {
          var grp = new T.Group(), yd = convesY(3.2), comp = CK.z1 - CK.z0, zc = (CK.z0 + CK.z1) / 2;
          var tecaCk = MP('cockpit', 'teca', { roughness: 0.8 });
          var piso = new T.Mesh(G(new T.BoxGeometry(0.72, 0.04, comp)), tecaCk); piso.position.set(0, Y_FUNDO_CK - 0.02, zc); grp.add(piso);
          [-1, 1].forEach(function (s) {
            var banco = new T.Mesh(G(new T.BoxGeometry(CK.x - 0.36, yd - 0.02 - Y_FUNDO_CK, comp)), tecaCk);
            banco.position.set(s * (0.36 + (CK.x - 0.36) / 2), (yd - 0.02 + Y_FUNDO_CK) / 2, zc); grp.add(banco);
            var brac = new T.Mesh(G(new T.BoxGeometry(0.12, 0.22, 1.6)), tecaCk);
            brac.position.set(s * (CK.x + 0.06), yd + 0.11, CK.z0 + 0.8); grp.add(brac);
          });
          var paredeM = MP('cockpit', 'conves', { side: T.DoubleSide, roughness: 0.85 });
          [CK.z0 + 0.002, CK.z1 - 0.002].forEach(function (z) {
            var pw = new T.Mesh(G(new T.PlaneGeometry(CK.x * 2, yd - Y_FUNDO_CK + 0.02)), paredeM);
            pw.position.set(0, (yd + Y_FUNDO_CK) / 2, z); grp.add(pw);
          });
          barco.add(grp); reg('cockpit', grp);
        })();

        /* ---- cabine ---- */
        var CAB = { zA: 2.12, zN: -1.72, zF: -2.42 };
        function largCab(z) { return lerp(0.74, 0.98, (z - CAB.zN) / (CAB.zA - CAB.zN)); }
        function yTopoCab(z) { return convesY(z) + 0.36 + 0.14 * (z - CAB.zF) / (CAB.zA - CAB.zF); }
        function contornoCab(ins) {
          var pts = [], i, N1 = 10, N2 = 18, wN = largCab(CAB.zN) - ins, zF = CAB.zF + ins * 0.9;
          for (i = 0; i <= N1; i++) { var z = CAB.zA - (CAB.zA - CAB.zN) * i / N1; pts.push([largCab(z) - ins, z]); }
          for (i = 1; i < N2; i++) { var ph = Math.PI * i / N2; pts.push([wN * Math.cos(ph), CAB.zN - (CAB.zN - zF) * Math.sin(ph)]); }
          for (i = N1; i >= 0; i--) { z = CAB.zA - (CAB.zA - CAB.zN) * i / N1; pts.push([-(largCab(z) - ins), z]); }
          return pts;
        }
        var matCabine = M('casco', { roughness: 0.4, side: T.DoubleSide });
        (function () {
          var grp = new T.Group(), baixo = contornoCab(0), cima = contornoCab(0.11), pos = [], ix = [], n = baixo.length, i;
          for (i = 0; i < n; i++) { pos.push(baixo[i][0], convesY(baixo[i][1]) - 0.03, baixo[i][1]); pos.push(cima[i][0], yTopoCab(cima[i][1]), cima[i][1]); }
          for (i = 0; i < n - 1; i++) { var a = i * 2; ix.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
          var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals();
          grp.add(new T.Mesh(G(g), matCabine));
          /* teto */
          var sp = new T.Shape(); sp.moveTo(cima[0][0], cima[0][1]); for (i = 1; i < n; i++) sp.lineTo(cima[i][0], cima[i][1]);
          var gt = G(new T.ShapeGeometry(sp, 1)), pt = gt.attributes.position;
          for (i = 0; i < pt.count; i++) { var x = pt.getX(i), z = pt.getY(i); pt.setXYZ(i, x, yTopoCab(z), z); }
          gt.computeVertexNormals();
          grp.add(new T.Mesh(gt, matCabine));
          /* face de ré (anteparo) */
          var wA = largCab(CAB.zA), wT = wA - 0.11, yb = convesY(CAB.zA) - 0.03, yt = yTopoCab(CAB.zA);
          var gf = new T.BufferGeometry();
          gf.setAttribute('position', new T.Float32BufferAttribute([wA, yb, CAB.zA, -wA, yb, CAB.zA, -wT, yt, CAB.zA, wT, yt, CAB.zA], 3));
          gf.setIndex([0, 1, 2, 0, 2, 3]); gf.computeVertexNormals();
          grp.add(new T.Mesh(G(gf), matCabine));
          /* gaiuta (entrada) e capô corrediço */
          var matVidro = MP('cabine', 'vidro', { roughness: 0.2 });
          var gai = new T.Mesh(G(new T.PlaneGeometry(0.58, 0.36)), matVidro); gai.position.set(0, yt - 0.24, CAB.zA + 0.004); grp.add(gai);
          var capo = new T.Mesh(G(new T.BoxGeometry(0.68, 0.08, 0.9)), matCabine); capo.position.set(0, yTopoCab(1.6) + 0.04, 1.62); grp.add(capo);
          /* janelas */
          [-1, 1].forEach(function (s) {
            var pw = [], iw = [], NZ = 8, z0 = -1.35, z1 = 1.25;
            for (var k = 0; k <= NZ; k++) {
              var z = lerp(z0, z1, k / NZ), wb = largCab(z), wt = wb - 0.11, yb2 = convesY(z) - 0.03, yt2 = yTopoCab(z);
              var f0 = 0.38, f1 = 0.74, xo = 0.01;
              pw.push(s * (lerp(wb, wt, f0) + xo), lerp(yb2, yt2, f0), z, s * (lerp(wb, wt, f1) + xo), lerp(yb2, yt2, f1), z);
            }
            for (k = 0; k < NZ; k++) { var a2 = k * 2; iw.push(a2, a2 + 2, a2 + 1, a2 + 1, a2 + 2, a2 + 3); }
            var gw = new T.BufferGeometry(); gw.setAttribute('position', new T.Float32BufferAttribute(pw, 3)); gw.setIndex(iw); gw.computeVertexNormals();
            var mw = new T.Mesh(G(gw), MP('cabine', 'vidro', { roughness: 0.2, side: T.DoubleSide })); grp.add(mw);
          });
          barco.add(grp); reg('cabine', grp);
          /* escotilha de proa */
          var esc = new T.Mesh(G(new T.BoxGeometry(0.55, 0.07, 0.55)), MP('conves', 'casco', { roughness: 0.4 })); esc.position.set(0, convesY(-3.1) + 0.04, -3.1); barco.add(esc); reg('conves', esc);
        })();

        /* ---- quilha, bulbo e leme (perfis NACA simétricos) ---- */
        function geoFolio(secs, NP) {
          var pos = [], ix = [], ns = secs.length, i, k;
          function meia(x, tt) { return 5 * tt * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1036 * x * x * x * x); }
          for (k = 0; k < ns; k++) {
            var s = secs[k];
            for (i = 0; i < NP * 2; i++) {
              var up = i < NP, j = up ? NP - i : i - NP, x = (1 - Math.cos(Math.PI * j / NP)) / 2;
              var yt2 = meia(x, s.t) * s.c * (up ? 1 : -1);
              pos.push(yt2, s.y, s.z + x * s.c);
            }
          }
          var R = NP * 2;
          for (k = 0; k < ns - 1; k++) for (i = 0; i < R; i++) { var a = k * R + i, b = k * R + (i + 1) % R, c = a + R, d = b + R; ix.push(a, b, c, b, d, c); }
          var cIdx = pos.length / 3, last = secs[ns - 1];
          pos.push(0, last.y, last.z + last.c * 0.4);
          for (i = 0; i < R; i++) ix.push((ns - 1) * R + i, (ns - 1) * R + (i + 1) % R, cIdx);
          var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals();
          return G(g);
        }
        var matFundo = MP('quilha', 'fundo', { roughness: 0.7, side: T.DoubleSide });
        (function () {
          var gk = geoFolio([{ y: -0.32, z: -0.72, c: 1.36, t: 0.12 }, { y: -1.0, z: -0.52, c: 1.15, t: 0.12 }, { y: -1.66, z: -0.3, c: 0.94, t: 0.12 }], 14);
          var grp = new T.Group(); grp.add(new T.Mesh(gk, matFundo));
          var bulbo = new T.Mesh(G(new T.SphereGeometry(1, 24, 14)), matFundo); bulbo.scale.set(0.2, 0.15, 0.9); bulbo.position.set(0, -1.72, 0.1); grp.add(bulbo);
          barco.add(grp); reg('quilha', grp);
          var gl = geoFolio([{ y: 0.05, z: 3.9, c: 0.58, t: 0.12 }, { y: -0.7, z: 3.95, c: 0.52, t: 0.12 }, { y: -1.48, z: 4.04, c: 0.38, t: 0.12 }], 12);
          var leme = new T.Mesh(gl, MP('leme', 'fundo', { roughness: 0.7, side: T.DoubleSide })); barco.add(leme); reg('leme', leme);
        })();

        /* ---- mastro, enora, cruzetas ---- */
        var ZM = -0.85, Y_TOPO = 14.6, Y_CAB_M = yTopoCab(ZM), Y_CRUZ = 7.9;
        var METAL = { roughness: 0.35, metalness: 0.35 };
        var matMetal = M('metal', METAL); /* peças que não são partes da lista */
        (function () {
          var grp = new T.Group();
          var g = G(new T.CylinderGeometry(0.068, 0.082, Y_TOPO - (convesY(ZM) - 0.5), 18));
          var m = new T.Mesh(g, MP('mastro', 'metal', METAL)); m.scale.z = 1.4; m.position.set(0, (Y_TOPO + convesY(ZM) - 0.5) / 2, ZM); grp.add(m);
          var cab = new T.Mesh(G(new T.BoxGeometry(0.12, 0.16, 0.34)), MP('mastro', 'metal', METAL)); cab.position.set(0, Y_TOPO + 0.02, ZM + 0.02); grp.add(cab);
          barco.add(grp); reg('mastro', grp);
          var enoraM = MP('enora', 'metal', { roughness: 0.5, metalness: 0.2 });
          var en = new T.Mesh(G(new T.CylinderGeometry(0.15, 0.19, 0.07, 20)), enoraM); en.scale.z = 1.25; en.position.set(0, Y_CAB_M + 0.03, ZM); barco.add(en); reg('enora', en);
          var cg = new T.Group();
          [-1, 1].forEach(function (s) { tubo(V(s * 0.06, Y_CRUZ, ZM), V(s * 0.98, Y_CRUZ, ZM + 0.14), 0.028, MP('cruzetas', 'metal', METAL), cg); });
          barco.add(cg); reg('cruzetas', cg);
        })();

        /* ---- aparelho fixo ---- */
        var ARAME = { roughness: 0.4, metalness: 0.4 };
        var F1 = V(0, 14.42, ZM - 0.09), F0 = V(0, convesY(-4.78) + 0.1, -4.78);
        arame('estai', [F0, F1], 0.016, MP('estai', 'arame', ARAME));
        var B1 = V(0, 14.52, ZM + 0.14), B0 = V(0, convesY(4.8) + 0.06, 4.8);
        arame('estaipopa', [B0, B1], 0.014, MP('estaipopa', 'arame', ARAME));
        (function () {
          var grp = new T.Group(), matArame = MP('brandais', 'arame', ARAME);
          [-1, 1].forEach(function (s) {
            var yS = function (z) { return convesY(z) + 0.03; };
            arame('brandais', [V(s * 0.05, 14.3, ZM), V(s * 0.98, Y_CRUZ, ZM + 0.14), V(s * 1.43, yS(ZM + 0.1), ZM + 0.1)], 0.014, matArame, grp);
            arame('brandais', [V(s * 0.06, Y_CRUZ - 0.1, ZM), V(s * 1.4, yS(ZM - 0.52), ZM - 0.52)], 0.013, matArame, grp);
            arame('brandais', [V(s * 0.06, Y_CRUZ - 0.1, ZM), V(s * 1.4, yS(ZM + 0.58), ZM + 0.58)], 0.013, matArame, grp);
            [ZM + 0.1, ZM - 0.52, ZM + 0.58].forEach(function (z) {
              var cp = new T.Mesh(G(new T.BoxGeometry(0.03, 0.12, 0.08)), MP('brandais', 'metal', METAL)); cp.position.set(s * 1.42, convesY(z) + 0.05, z); grp.add(cp); reg('brandais', cp);
            });
          });
          barco.add(grp);
        })();
        /* enrolador: tambor + rolo de vela no estai */
        var rolo, VELA = { roughness: 0.85, side: T.DoubleSide };
        (function () {
          var grp = new T.Group();
          var tambor = new T.Mesh(G(new T.CylinderGeometry(0.1, 0.1, 0.16, 16)), MP('enrolador', 'metal', METAL));
          poeTuboCurto(tambor, F0, 0.2); grp.add(tambor);
          barco.add(grp); reg('enrolador', grp);
          rolo = new T.Mesh(cil(1), MP('enrolador', 'vela', VELA)); barco.add(rolo); reg('enrolador', rolo);
        })();
        function poeTuboCurto(m, base, h0) { var d = tmpV.subVectors(F1, F0).normalize(); m.position.copy(base).addScaledVector(d, h0 / 2 + 0.02); m.quaternion.setFromUnitVectors(UP, d); }

        /* ---- balaústres, guarda-mancebos, púlpitos ---- */
        var INOX = { roughness: 0.25, metalness: 0.5 };
        var ZBAL = [-3.7, -2.45, -1.15, 0.25, 1.6, 2.95];
        var H_BAL = 0.62;
        function xBorda(z, rec) { return BS(tDe(z)) - (rec || 0.07); }
        (function () {
          var gb = new T.Group();
          [-1, 1].forEach(function (s) {
            ZBAL.forEach(function (z) { tubo(V(s * xBorda(z), convesY(z), z), V(s * xBorda(z), convesY(z) + H_BAL, z), 0.016, MP('balaustres', 'metal', INOX), gb); });
          });
          barco.add(gb); reg('balaustres', gb);
          /* púlpito de proa */
          var gp = new T.Group(), zP = -3.95, dP = convesY(zP), dF = convesY(-4.42), xP = xBorda(zP, 0.1);
          [-1, 1].forEach(function (s) {
            var c = new T.CatmullRomCurve3([V(s * xP, dP, zP), V(s * xP, dP + 0.6, zP + 0.02), V(s * 0.46, dF + 0.66, -4.28), V(0, dF + 0.68, -4.47)], false, 'centripetal');
            gp.add(new T.Mesh(G(new T.TubeGeometry(c, 24, 0.022, 6)), MP('pulpito', 'metal', INOX)));
            tubo(V(s * 0.24, dF, -4.36), V(s * 0.24, dF + 0.66, -4.4), 0.02, MP('pulpito', 'metal', INOX), gp);
          });
          barco.add(gp); reg('pulpito', gp);
          /* púlpito de popa */
          var gs = new T.Group(), zS = 3.85, dS = convesY(zS), xS = xBorda(zS, 0.1);
          [-1, 1].forEach(function (s) {
            var c2 = new T.CatmullRomCurve3([V(s * xS, dS, zS), V(s * xS, dS + 0.64, zS + 0.03), V(s * (xS - 0.05), dS + 0.66, 4.5), V(s * 1.05, dS + 0.66, 4.74), V(s * 0.5, dS + 0.66, 4.78)], false, 'centripetal');
            gs.add(new T.Mesh(G(new T.TubeGeometry(c2, 28, 0.022, 6)), MP('balcao', 'metal', INOX)));
            tubo(V(s * 1.15, convesY(4.7), 4.7), V(s * 1.15, dS + 0.66, 4.72), 0.02, MP('balcao', 'metal', INOX), gs);
          });
          barco.add(gs); reg('balcao', gs);
          /* guarda-mancebos: dois fios por bordo */
          [-1, 1].forEach(function (s) {
            [H_BAL, 0.32].forEach(function (hh) {
              var pts = [V(s * xP, dP + Math.min(hh, 0.6), zP + 0.02)];
              ZBAL.forEach(function (z) { pts.push(V(s * xBorda(z), convesY(z) + hh, z)); });
              pts.push(V(s * xS, dS + Math.min(hh, 0.64), zS + 0.03));
              arame('guardamancebos', pts, 0.008, MP('guardamancebos', 'arame', ARAME));
            });
          });
        })();

        /* ---- luzes de navegação ---- */
        (function () {
          var grp = new T.Group(), dF = convesY(-4.42);
          var mv = new T.MeshStandardMaterial({ roughness: 0.3, emissiveIntensity: 1.0 }); mats.push(mv); corMats.push({ m: mv, k: 'verde', emis: true });
          var mr = new T.MeshStandardMaterial({ roughness: 0.3, emissiveIntensity: 1.0 }); mats.push(mr); corMats.push({ m: mr, k: 'verm', emis: true });
          var mb = new T.MeshStandardMaterial({ roughness: 0.3, emissiveIntensity: 1.0 }); mats.push(mb); corMats.push({ m: mb, k: 'branco', emis: true });
          var caixa = G(new T.BoxGeometry(0.07, 0.08, 0.1));
          var lv = new T.Mesh(caixa, mv); lv.position.set(0.04, dF + 0.74, -4.47); grp.add(lv);
          var lr = new T.Mesh(caixa, mr); lr.position.set(-0.04, dF + 0.74, -4.47); grp.add(lr);
          var lb = new T.Mesh(G(new T.BoxGeometry(0.08, 0.08, 0.07)), mb); lb.position.set(0.7, convesY(4.75) + 0.73, 4.78); grp.add(lb);
          barco.add(grp); reg('luzes', grp);
        })();

        /* ---- catracas ---- */
        (function () {
          var perfil = [[0, 0], [0.1, 0], [0.11, 0.03], [0.08, 0.05], [0.072, 0.15], [0.085, 0.18], [0.07, 0.205], [0, 0.205]].map(function (p) { return new T.Vector2(p[0], p[1]); });
          var gw = G(new T.LatheGeometry(perfil, 18));
          var grp = new T.Group(), yd = convesY(2.6);
          [-1, 1].forEach(function (s) {
            var w1 = new T.Mesh(gw, MP('catracas', 'metal', METAL)); w1.position.set(s * (CK.x + 0.06), yd + 0.22, 2.62); grp.add(w1);
            var w2 = new T.Mesh(gw, MP('catracas', 'metal', METAL)); w2.scale.setScalar(0.8); w2.position.set(s * 0.52, yTopoCab(1.85), 1.85); grp.add(w2);
          });
          barco.add(grp); reg('catracas', grp);
        })();

        /* ---- roda de leme e cana ---- */
        var grpRoda = new T.Group(), grpCana = new T.Group();
        (function () {
          var zW = 3.78, yC = Y_FUNDO_CK + 0.8;
          var mR = MP('roda', 'metal', METAL), mI = MP('roda', 'metal', INOX);
          tubo(V(0, Y_FUNDO_CK, zW - 0.08), V(0, yC - 0.02, zW - 0.08), 0.06, mR, grpRoda);
          var cons = new T.Mesh(G(new T.BoxGeometry(0.2, 0.16, 0.16)), mR); cons.position.set(0, yC + 0.06, zW - 0.08); grpRoda.add(cons);
          var anel = new T.Mesh(G(new T.TorusGeometry(0.42, 0.022, 8, 40)), mI); anel.position.set(0, yC, zW); grpRoda.add(anel);
          for (var k = 0; k < 6; k++) { var a = k * Math.PI / 3; tubo(V(0, yC, zW), V(0.42 * Math.cos(a), yC + 0.42 * Math.sin(a), zW), 0.012, mI, grpRoda); }
          barco.add(grpRoda); reg('roda', grpRoda);
          var cana = new T.Mesh(G(new T.CylinderGeometry(0.022, 0.035, 1, 10)), MP('roda', 'teca', { roughness: 0.8 }));
          poeTubo(cana, V(0, Y_FUNDO_CK + 0.45, 4.08), V(0, convesY(3) + 0.3, 2.85)); grpCana.add(cana);
          tubo(V(0, Y_FUNDO_CK, 4.08), V(0, Y_FUNDO_CK + 0.47, 4.08), 0.04, mR, grpCana);
          barco.add(grpCana); reg('roda', grpCana);
        })();
        function aplicarLeme() { grpRoda.visible = st.leme === 'roda'; grpCana.visible = st.leme === 'cana'; }
        aplicarLeme();
        /* traveler (escota da grande) */
        var Z_TRAV = 3.15, Y_TRAV = convesY(Z_TRAV) + 0.07;
        tubo(V(-CK.x, Y_TRAV, Z_TRAV), V(CK.x, Y_TRAV, Z_TRAV), 0.025, matMetal);
        var carroTrav = new T.Mesh(G(new T.BoxGeometry(0.12, 0.06, 0.08)), matMetal); barco.add(carroTrav);
        /* trilho e carrinho da escota da genoa */
        var Z_CARRO = 0.95;
        var carrosG = [-1, 1].map(function (s) {
          tubo(V(s * xBorda(Z_CARRO - 0.5, 0.3), convesY(Z_CARRO - 0.5) + 0.02, Z_CARRO - 0.5), V(s * xBorda(Z_CARRO + 0.6, 0.3), convesY(Z_CARRO + 0.6) + 0.02, Z_CARRO + 0.6), 0.015, matMetal);
          var c = new T.Mesh(G(new T.BoxGeometry(0.07, 0.07, 0.12)), matMetal); c.position.set(s * xBorda(Z_CARRO, 0.3), convesY(Z_CARRO) + 0.05, Z_CARRO); barco.add(c);
          return c.position.clone();
        });

        /* ---- peças móveis: retranca, burro, escotas, adriças ---- */
        var GOOSE = V(0, 2.32, ZM + 0.12), E_RET = 3.95;
        var matRet = MP('retranca', 'metal', METAL);
        var retrancaM = new T.Mesh(G(new T.CylinderGeometry(0.06, 0.055, 1, 12)), matRet); retrancaM.scale.z = 1.5; barco.add(retrancaM); reg('retranca', retrancaM);
        var retProxy = new T.Mesh(cil(0.2), proxyMat); barco.add(retProxy); reg('retranca', retProxy);
        var matBurro = MP('burro', 'metal', METAL);
        var burroM = new T.Mesh(cil(0.026), matBurro); barco.add(burroM); reg('burro', burroM);
        var burroP = new T.Mesh(cil(0.16), proxyMat); barco.add(burroP); reg('burro', burroP);
        var matCabo = MP('escotas', 'cabo', { roughness: 0.9 });
        var escGrande = new T.Mesh(cil(0.012), matCabo), escGrandeP = new T.Mesh(cil(0.15), proxyMat);
        barco.add(escGrande); barco.add(escGrandeP); reg('escotas', escGrande); reg('escotas', escGrandeP);
        var escG = [0, 1].map(function () { var m = new T.Mesh(cil(0.012), matCabo), p = new T.Mesh(cil(0.15), proxyMat); barco.add(m); barco.add(p); reg('escotas', m); reg('escotas', p); return { m: m, p: p }; });
        /* adriças (fixas) */
        (function () {
          var grp = new T.Group(), yb = Y_CAB_M + 0.05, matAdr = MP('adricas', 'cabo', { roughness: 0.9 });
          [[0.04, ZM - 0.09, 14.25], [-0.04, ZM - 0.09, 14.35]].forEach(function (a, i) {
            var s = i ? -1 : 1;
            arame('adricas', [V(a[0], a[2], a[1] - 0.02), V(a[0], yb + 0.25, a[1] - 0.02), V(s * 0.12, yb, ZM + 0.05), V(s * 0.4, yTopoCab(1.5) + 0.03, 1.5), V(s * 0.49, yTopoCab(1.85) + 0.12, 1.85)], 0.011, matAdr, grp);
          });
          barco.add(grp);
        })();

        /* ---- velas (superfícies com bolsa) ---- */
        var NU = 16, NV = 26;
        function grade(nu, nv) {
          var g = new T.BufferGeometry(), ix = [];
          g.setAttribute('position', new T.BufferAttribute(new Float32Array((nu + 1) * (nv + 1) * 3), 3));
          for (var j = 0; j < nv; j++) for (var i = 0; i < nu; i++) { var a = j * (nu + 1) + i, b = a + nu + 1; ix.push(a, a + 1, b, a + 1, b + 1, b); }
          g.setIndex(ix);
          return G(g);
        }
        var gGrande = grade(NU, NV), gGenoa = grade(NU, NV);
        var matGrande = MP('grande', 'vela', VELA), matGenoa = MP('genoa', 'vela', VELA);
        [matGrande, matGenoa, MP('rizos', 'vela', VELA), MP('enrolador', 'vela', VELA)].forEach(function (m) { m.userData.emisBase = 0.2; });
        var grandeM = new T.Mesh(gGrande, matGrande), genoaM = new T.Mesh(gGenoa, matGenoa);
        barco.add(grandeM); barco.add(genoaM); reg('grande', grandeM); reg('genoa', genoaM);
        var matRizoLinha = new T.LineDashedMaterial({ dashSize: 0.14, gapSize: 0.1 }); mats.push(matRizoLinha); corMats.push({ m: matRizoLinha, k: 'velaLinha', linha: true });
        var RIZOS = [0.16, 0.31];
        var linhasRizo = RIZOS.map(function () {
          return [0, 1].map(function () { var g = G(new T.BufferGeometry()); g.setAttribute('position', new T.BufferAttribute(new Float32Array((NU + 1) * 3), 3)); var l = new T.Line(g, matRizoLinha); barco.add(l); return l; });
        });
        var feixe = new T.Mesh(cil(1), MP('rizos', 'vela', VELA)); barco.add(feixe); reg('rizos', feixe);
        /* birutas da genoa: fitas verdes a boreste, vermelhas a bombordo (convenção) */
        var matBirV = new T.MeshBasicMaterial({ side: T.DoubleSide }), matBirR = new T.MeshBasicMaterial({ side: T.DoubleSide });
        mats.push(matBirV, matBirR); corMats.push({ m: matBirV, k: 'verde' }, { m: matBirR, k: 'verm' });
        var NB = 3;
        function geoFitas() { var g = new T.BufferGeometry(), ix = []; g.setAttribute('position', new T.BufferAttribute(new Float32Array(NB * 4 * 3), 3)); for (var i = 0; i < NB; i++) ix.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3); g.setIndex(ix); return G(g); }
        var fitasV = new T.Mesh(geoFitas(), matBirV), fitasR = new T.Mesh(geoFitas(), matBirR);
        fitasV.frustumCulled = false; fitasR.frustumCulled = false;
        barco.add(fitasV); barco.add(fitasR); reg('birutas', fitasV); reg('birutas', fitasR);
        var birProxy = new T.Mesh(G(new T.SphereGeometry(0.5, 8, 6)), proxyMat); barco.add(birProxy); reg('birutas', birProxy);
        /* biruta do topo (windex) */
        var windex = new T.Group(), cata = new T.Group();
        (function () {
          var mw = MP('windex', 'vv', { roughness: 0.5 });
          tubo(V(0, 0, 0), V(0, 0.42, 0), 0.008, mw, windex);
          tubo(V(0, 0.42, 0.25), V(0, 0.42, -0.4), 0.007, mw, cata);
          var cone = new T.Mesh(G(new T.ConeGeometry(0.035, 0.12, 8)), mw); cone.rotation.x = -Math.PI / 2; cone.position.set(0, 0.42, -0.44); cata.add(cone);
          var aleta = new T.Mesh(G(new T.BoxGeometry(0.01, 0.1, 0.14)), mw); aleta.position.set(0, 0.42, 0.22); cata.add(aleta);
          [-1, 1].forEach(function (s) { tubo(V(0, 0.36, 0.02), V(s * 0.17, 0.36, 0.22), 0.006, mw, windex); });
          windex.add(cata);
          windex.position.set(0, Y_TOPO + 0.1, ZM + 0.05);
          var px = new T.Mesh(G(new T.SphereGeometry(0.45, 8, 6)), proxyMat); px.position.set(0, 0.35, 0); windex.add(px);
          barco.add(windex); reg('windex', windex);
        })();

        /* geometria das velas: luff (testa), chord (corda) girada em torno da testa, bolsa para sotavento */
        var Y_PUNHO = 2.42, Y_CABECA = 14.15, Z_TESTA = ZM + 0.1;
        var G_TACK = V(0, convesY(-4.66) + 0.24, -4.66), G_HEAD = F0.clone().lerp(F1, 0.955), G_CLEW = V(0, 1.98, 1.05);
        function cordaGrande(v) { return Math.max(0.16, E_RET * 0.985 * (1 - v) + 0.52 * Math.pow(Math.sin(Math.PI * v), 0.9) * (1 - 0.2 * v)); }
        function bolsa(u) { return Math.sin(Math.PI * Math.pow(u, 0.8)); }
        var tempo = 0;
        var vGr = { ancora: V(0, 0, 0), rizo: V(0, 0, 0), retFim: V(0, 0, 0) }, vGe = { ancora: V(0, 0, 0), clew: V(0, 0, 0), bir: V(0, 0, 0) };
        var qTmp = new T.Quaternion(), dTmp = new T.Vector3(), nTmp = new T.Vector3(), pTmp = new T.Vector3();
        function velaGrande() {
          var r = fis, s = r.sot, vr = [0, RIZOS[0], RIZOS[1]][st.rizo], alt = (Y_CABECA - Y_PUNHO), pos = gGrande.attributes.position.array, k = 0;
          var pan = r.noVento, amp = pan ? 1 : 0;
          for (var j = 0; j <= NV; j++) {
            var vv = j / NV, v = vr + (1 - vr) * vv, y = Y_PUNHO + (v - vr) * alt, c = cordaGrande(v);
            var th = s * (r.dm + 7 * vv) * D2R, dx = Math.sin(th), dz = Math.cos(th), nx = Math.cos(th) * s, nz = -Math.sin(th) * s;
            var prof = pan ? 0.015 : st.tws < 0.5 ? 0.02 : 0.085 + 0.035 * vv;
            for (var i = 0; i <= NU; i++) {
              var u = i / NU, off = c * prof * bolsa(u);
              if (amp) off += c * 0.05 * Math.sin(2 * Math.PI * (1.4 * u + 0.6 * vv) - 7 * tempo) * Math.sin(Math.PI * u);
              pos[k++] = dx * c * u + nx * off; pos[k++] = y; pos[k++] = Z_TESTA + dz * c * u + nz * off;
            }
          }
          gGrande.attributes.position.needsUpdate = true; gGrande.computeVertexNormals(); gGrande.computeBoundingSphere();
          /* retranca segue o pé da vela */
          var th0 = s * r.dm * D2R;
          var fim = V(GOOSE.x + Math.sin(th0) * E_RET, GOOSE.y, GOOSE.z + Math.cos(th0) * E_RET);
          poeTubo(retrancaM, GOOSE, fim); poeTubo(retProxy, GOOSE, fim);
          vGr.retFim.copy(fim);
          var pB = GOOSE.clone().lerp(fim, 0.24); pB.y -= 0.04;
          var pM = V(0, Y_CAB_M + 0.1, ZM + 0.1);
          poeTubo(burroM, pB, pM); poeTubo(burroP, pB, pM);
          var carX = clamp(fim.x * 0.55, -CK.x + 0.08, CK.x - 0.08);
          carroTrav.position.set(carX, Y_TRAV + 0.03, Z_TRAV);
          var a1 = fim.clone(); a1.y -= 0.05; poeTubo(escGrande, a1, carroTrav.position); poeTubo(escGrandeP, a1, carroTrav.position);
          /* rizos: linhas marcadas acima do rizo atual; feixe de pano sobre a retranca */
          RIZOS.forEach(function (rv, ri) {
            var vis = rv > vr + 1e-6;
            linhasRizo[ri].forEach(function (ln, lado) {
              ln.visible = vis; if (!vis) return;
              var pa = ln.geometry.attributes.position.array, q = 0, vv2 = (rv - vr) / (1 - vr), y2 = Y_PUNHO + (rv - vr) * alt, c2 = cordaGrande(rv);
              var th2 = s * (r.dm + 7 * vv2) * D2R, prof2 = pan ? 0.015 : 0.085 + 0.035 * vv2, sg = lado ? 1 : -1;
              for (var i2 = 0; i2 <= NU; i2++) {
                var u2 = i2 / NU, off2 = c2 * prof2 * bolsa(u2) + sg * 0.018;
                pa[q++] = Math.sin(th2) * c2 * u2 + Math.cos(th2) * s * off2; pa[q++] = y2; pa[q++] = Z_TESTA + Math.cos(th2) * c2 * u2 - Math.sin(th2) * s * off2;
              }
              ln.geometry.attributes.position.needsUpdate = true; ln.geometry.computeBoundingSphere(); ln.computeLineDistances();
            });
          });
          if (st.rizo > 0) {
            var cF = cordaGrande(vr), rr = 0.05 + 0.04 * st.rizo;
            var f0 = GOOSE.clone(); f0.y += 0.05 + rr * 0.6;
            var f1 = V(GOOSE.x + Math.sin(th0) * cF * 0.95, f0.y, GOOSE.z + Math.cos(th0) * cF * 0.95);
            feixe.visible = true; poeTubo(feixe, f0, f1); feixe.scale.x = rr; feixe.scale.z = rr * 1.2;
          } else feixe.visible = false;
          var vA = st.rizo > 0 ? (RIZOS[1] > vr ? RIZOS[1] : vr) : RIZOS[0];
          var cA = cordaGrande(vA), thA = s * (r.dm + 7 * ((vA - vr) / (1 - vr))) * D2R;
          if (st.rizo === 2) vGr.rizo.set(Math.sin(th0) * 1.2, GOOSE.y + 0.16, GOOSE.z + Math.cos(th0) * 1.2);
          else vGr.rizo.set(Math.sin(thA) * cA * 0.62, Y_PUNHO + (vA - vr) * alt, Z_TESTA + Math.cos(thA) * cA * 0.62);
          var vG = 0.42, cG = cordaGrande(vr + (1 - vr) * vG), thG = s * (r.dm + 7 * vG) * D2R;
          vGr.ancora.set(Math.sin(thG) * cG * 0.42 + Math.cos(thG) * s * 0.3, Y_PUNHO + vG * (1 - vr) * alt, Z_TESTA + Math.cos(thG) * cG * 0.42);
        }
        var eixoG = new T.Vector3().subVectors(G_HEAD, G_TACK).normalize();
        function velaGenoa() {
          var r = fis, s = r.sot, f = st.furl / 100, pos = gGenoa.attributes.position.array, k = 0;
          var pan = r.noVento, enc = r.encoberta;
          for (var j = 0; j <= NV; j++) {
            var v = j / NV;
            var L = pTmp.copy(G_TACK).lerp(G_HEAD, v);
            var Lx = L.x, Ly = L.y, Lz = L.z;
            var E = V(0, 0, 0).copy(G_CLEW).lerp(G_HEAD, v);
            var W = E.sub(L), c = Math.max(0.06, W.length()) * (1 - f);
            W.normalize();
            qTmp.setFromAxisAngle(eixoG, s * (r.dg + 9 * v) * D2R);
            dTmp.copy(W).applyQuaternion(qTmp);
            nTmp.crossVectors(eixoG, dTmp).normalize();
            if (nTmp.x * s < 0) nTmp.negate();
            var prof = pan ? 0.02 : enc ? 0.03 : st.tws < 0.5 ? 0.02 : 0.11 - 0.03 * v;
            for (var i = 0; i <= NU; i++) {
              var u = i / NU, off = c * prof * bolsa(u);
              if (pan) off += c * 0.06 * Math.sin(2 * Math.PI * (1.6 * u + 0.5 * v) - 8 * tempo) * Math.sin(Math.PI * u);
              else if (enc) off += c * 0.035 * Math.sin(2 * Math.PI * (1.1 * u + 0.4 * v) - 3 * tempo) * Math.sin(Math.PI * u);
              pos[k++] = Lx + dTmp.x * c * u + nTmp.x * off; pos[k++] = Ly + dTmp.y * c * u + nTmp.y * off; pos[k++] = Lz + dTmp.z * c * u + nTmp.z * off;
              if (j === 0 && i === NU) vGe.clew.set(pos[k - 3], pos[k - 2], pos[k - 1]);
              if (j === Math.round(NV * 0.3) && i === Math.round(NU * 0.45)) vGe.ancora.set(pos[k - 3], pos[k - 2], pos[k - 1]);
            }
          }
          gGenoa.attributes.position.needsUpdate = true; gGenoa.computeVertexNormals(); gGenoa.computeBoundingSphere();
          /* rolo enrolado no estai */
          var rR = 0.02 + 0.075 * f;
          poeTubo(rolo, G_TACK, G_HEAD); rolo.scale.x = rR; rolo.scale.z = rR;
          /* escota: punho → carrinho → catraca */
          var car = carrosG[s > 0 ? 1 : 0], win = V(s * (CK.x + 0.06), convesY(2.6) + 0.4, 2.62);
          poeTubo(escG[0].m, vGe.clew, car); poeTubo(escG[0].p, vGe.clew, car);
          poeTubo(escG[1].m, car, win); poeTubo(escG[1].p, car, win);
          /* birutas */
          [[fitasV, 1], [fitasR, -1]].forEach(function (par) {
            var mesh = par[0], ladoF = par[1], pa = mesh.geometry.attributes.position.array, q = 0;
            for (var b = 0; b < NB; b++) {
              var vb = [0.3, 0.55, 0.78][b], jb = Math.round(vb * NV), ib = 2, base = (jb * (NU + 1) + ib) * 3, base2 = (jb * (NU + 1) + ib + 1) * 3;
              var px = pos[base], py = pos[base + 1], pz = pos[base + 2];
              var tx = pos[base2] - px, ty = pos[base2 + 1] - py, tz = pos[base2 + 2] - pz, tl = Math.hypot(tx, ty, tz) || 1;
              tx /= tl; ty /= tl; tz /= tl;
              var ladoN = (nTmp.x * ladoF > 0 ? 1 : -1) * 0.03, ox = nTmp.x * ladoN, oz = nTmp.z * ladoN;
              var comp = 0.34, wv = 0.035;
              var ang = pan ? Math.sin(tempo * 9 + b * 2 + ladoF) * 1.1 : enc ? 1.2 + 0.2 * Math.sin(tempo * 2 + b) : 0;
              var ca = Math.cos(ang), sa = Math.sin(ang);
              var ex = tx * ca, ey = ty * ca - sa, ez = tz * ca;
              var x0 = px + ox, y0 = py, z0 = pz + oz;
              pa[q++] = x0; pa[q++] = y0 + wv; pa[q++] = z0;
              pa[q++] = x0 + ex * comp; pa[q++] = y0 + ey * comp + wv; pa[q++] = z0 + ez * comp;
              pa[q++] = x0 + ex * comp; pa[q++] = y0 + ey * comp; pa[q++] = z0 + ez * comp;
              pa[q++] = x0; pa[q++] = y0; pa[q++] = z0;
              if (b === 1 && ladoF === 1) vGe.bir.set(px, py, pz);
            }
            mesh.geometry.attributes.position.needsUpdate = true;
          });
          birProxy.position.copy(vGe.bir);
        }

        /* ---- mar com ondas no shader ---- */
        var uMar = { uT: { value: 0 }, uA: { value: 0.15 }, uDir: { value: new T.Vector2(0, 1) } };
        var ONDA = [
          'uniform float uT; uniform float uA; uniform vec2 uDir;',
          'vec2 rot2(vec2 d, float a) { return vec2(cos(a) * d.x - sin(a) * d.y, sin(a) * d.x + cos(a) * d.y); }',
          'float ondaH(vec2 p) { vec2 d2 = rot2(uDir, 0.5), d3 = rot2(uDir, -0.7);',
          '  return uA * sin(dot(uDir, p) * 0.52 - uT * 2.26) + uA * 0.45 * sin(dot(d2, p) * 0.9 - uT * 2.97 + 1.3) + uA * 0.22 * sin(dot(d3, p) * 1.3 - uT * 3.57 + 0.4); }',
          'vec3 ondaN(vec2 p) { vec2 d2 = rot2(uDir, 0.5), d3 = rot2(uDir, -0.7);',
          '  vec2 g = uDir * (uA * 0.52 * cos(dot(uDir, p) * 0.52 - uT * 2.26)) + d2 * (uA * 0.45 * 0.9 * cos(dot(d2, p) * 0.9 - uT * 2.97 + 1.3)) + d3 * (uA * 0.22 * 1.3 * cos(dot(d3, p) * 1.3 - uT * 3.57 + 0.4));',
          '  return normalize(vec3(-g.x, 1.0, -g.y)); }',
        ].join('\n');
        function ondaJS(x, z) {
          var t = uMar.uT.value, A = uMar.uA.value, d = uMar.uDir.value;
          function rt(a) { return [Math.cos(a) * d.x - Math.sin(a) * d.y, Math.sin(a) * d.x + Math.cos(a) * d.y]; }
          var d2 = rt(0.5), d3 = rt(-0.7);
          return A * Math.sin((d.x * x + d.y * z) * 0.52 - t * 2.26) + A * 0.45 * Math.sin((d2[0] * x + d2[1] * z) * 0.9 - t * 2.97 + 1.3) + A * 0.22 * Math.sin((d3[0] * x + d3[1] * z) * 1.3 - t * 3.57 + 0.4);
        }
        var matMar = new T.MeshStandardMaterial({ roughness: 0.38, metalness: 0.05, transparent: true, opacity: 0.88, depthWrite: false });
        mats.push(matMar);
        matMar.onBeforeCompile = function (sh) {
          sh.uniforms.uT = uMar.uT; sh.uniforms.uA = uMar.uA; sh.uniforms.uDir = uMar.uDir;
          sh.vertexShader = ONDA + '\n' + sh.vertexShader
            .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = ondaN(position.xz);')
            .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.x, ondaH(position.xz), position.z);');
        };
        var gMar = G(new T.PlaneGeometry(220, 220, 200, 200)); gMar.rotateX(-Math.PI / 2);
        var mar = new T.Mesh(gMar, matMar); mar.renderOrder = 2; mar.frustumCulled = false; scene.add(mar);
        function aplicarMar() { matMar.opacity = st.abaixo ? 0.38 : 0.9; pedir(); }

        /* ---- setas de vento sobre a água ---- */
        function geoSeta(comp, larg) {
          var sp = new T.Shape(), w = larg / 2, hw = larg * 1.3;
          sp.moveTo(-w, comp / 2); sp.lineTo(w, comp / 2); sp.lineTo(w, -comp / 2 + hw); sp.lineTo(hw, -comp / 2 + hw); sp.lineTo(0, -comp / 2); sp.lineTo(-hw, -comp / 2 + hw); sp.lineTo(-w, -comp / 2 + hw); sp.lineTo(-w, comp / 2);
          var g = G(new T.ShapeGeometry(sp)); g.rotateX(Math.PI / 2); return g;
        }
        var matVV = new T.MeshBasicMaterial({ side: T.DoubleSide }), matVA = new T.MeshBasicMaterial({ side: T.DoubleSide });
        mats.push(matVV, matVA); corMats.push({ m: matVV, k: 'vv' }, { m: matVA, k: 'va' });
        var setaVV = new T.Mesh(geoSeta(3.2, 0.36), matVV), setaVA = new T.Mesh(geoSeta(2.4, 0.26), matVA);
        scene.add(setaVV); scene.add(setaVA);
        var rotVV = new T.CSS2DObject(h('div', { class: 'v3-vento-rot' }, 'vento verdadeiro'));
        var rotVA = new T.CSS2DObject(h('div', { class: 'v3-vento-rot v3-va-rot' }, 'aparente'));
        scene.add(rotVV); scene.add(rotVA);
        function posSeta(m, rot, ang, R, y) {
          var x = Math.sin(ang * D2R) * R, z = -Math.cos(ang * D2R) * R;
          m.position.set(x, y, z); m.rotation.set(0, Math.PI - ang * D2R, 0);
          var R2 = R + 2.2; rot.position.set(Math.sin(ang * D2R) * R2, y + 0.3, -Math.cos(ang * D2R) * R2);
        }

        /* ---- rótulos (CSS2D) ---- */
        var ancoras = {
          casco: function () { return V(BS(0.62) + 0.02, 0.62, zDe(0.62)); },
          proa: function () { return V(0, 0.55, -4.62); },
          popa: function () { return V(0, 0.6, ZS + 0.01); },
          boreste: function () { return V(BS(0.3) + 0.05, 0.95, zDe(0.3)); },
          bombordo: function () { return V(-BS(0.3) - 0.05, 0.95, zDe(0.3)); },
          linhadagua: function () { return V(BS(0.8) - 0.12, 0.09, zDe(0.8)); },
          quilha: function () { return V(0, -1.25, -0.25); },
          leme: function () { return V(0, -0.85, 4.15); },
          luzes: function () { return V(0, convesY(-4.42) + 0.8, -4.47); },
          conves: function () { return V(0, convesY(-3.4) + 0.02, -3.4); },
          cabine: function () { return V(0.6, yTopoCab(0.2) + 0.01, 0.2); },
          cockpit: function () { return V(0, Y_FUNDO_CK + 0.1, 2.9); },
          roda: function () { return st.leme === 'cana' ? V(0, convesY(3) + 0.3, 3.1) : V(0, Y_FUNDO_CK + 1.22, 3.78); },
          catracas: function () { return V(CK.x + 0.06, convesY(2.6) + 0.43, 2.62); },
          balaustres: function () { return V(xBorda(-1.15), convesY(-1.15) + H_BAL, -1.15); },
          guardamancebos: function () { return V(-xBorda(0.95), convesY(0.95) + H_BAL, 0.95); },
          pulpito: function () { return V(0.4, convesY(-4.3) + 0.67, -4.3); },
          balcao: function () { return V(-1.1, convesY(4.6) + 0.66, 4.65); },
          enora: function () { return V(0, Y_CAB_M + 0.07, ZM); },
          mastro: function () { return V(0, 11.5, ZM); },
          cruzetas: function () { return V(0.98, Y_CRUZ, ZM + 0.14); },
          estai: function () { return F0.clone().lerp(F1, 0.62); },
          estaipopa: function () { return B0.clone().lerp(B1, 0.42); },
          brandais: function () { return V(-1.2, lerp(Y_CRUZ, 1.2, 0.45), ZM + 0.12); },
          burro: function () { return burroM.position.clone(); },
          enrolador: function () { return F0.clone().lerp(F1, 0.03); },
          grande: function () { return vGr.ancora.clone(); },
          rizos: function () { return vGr.rizo.clone(); },
          genoa: function () { return vGe.ancora.clone(); },
          birutas: function () { return vGe.bir.clone(); },
          windex: function () { return V(0, Y_TOPO + 0.55, ZM + 0.05); },
          adricas: function () { return V(0.3, yTopoCab(1.1) + 0.05, 1.1); },
          escotas: function () { return vGe.clew.clone().lerp(carrosG[fis.sot > 0 ? 1 : 0], 0.55); },
          retranca: function () { return GOOSE.clone().lerp(vGr.retFim, 0.66); },
        };
        PARTES.forEach(function (p) {
          var btn = h('button', { type: 'button', class: 'v3-rot', onclick: function (ev) { ev.stopPropagation(); if (st.modo === 'quiz') return; selecionar(p.id, false); } });
          var ponto = h('span', { class: 'v3-ponto', title: p.nome, onclick: function (ev) { ev.stopPropagation(); if (st.modo !== 'quiz') selecionar(p.id, false); } });
          var elA = h('div', { class: 'v3-ancora', 'data-g': p.g }, h('span', { class: 'v3-haste' }), ponto, btn);
          ponto.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
          var obj = new T.CSS2DObject(elA);
          obj.position.copy(ancoras[p.id]());
          banda.add(obj);
          partes[p.id].ancora = obj; partes[p.id].el = elA; partes[p.id].btn = btn;
          rotEls[p.id] = { btn: btn };
          ['pointerdown', 'wheel'].forEach(function (evn) { btn.addEventListener(evn, function (e) { e.stopPropagation(); }, { passive: true }); });
        });
        atualizarRotulosTexto();
        function posicionarRotulos() { PARTES.forEach(function (p) { partes[p.id].ancora.position.copy(ancoras[p.id]()); }); }
        var arrumar = true;
        function aplicarRotulos() {
          PARTES.forEach(function (p) {
            var P = partes[p.id], vis;
            if (st.modo === 'quiz') vis = p.id === st.sel;
            else vis = st.rotulos ? p.g === st.grupo : p.id === st.sel;
            P.ancora.visible = vis;
            P.el.classList.toggle('v3-sel', p.id === st.sel);
            P.el.classList.toggle('v3-alvo', st.modo === 'quiz' && p.id === st.sel && !quiz.resp);
            P.btn.tabIndex = st.modo === 'quiz' ? -1 : 0;
            P.btn.setAttribute('aria-pressed', String(p.id === st.sel));
          });
          arrumar = true; pedir();
        }
        /** Evita rótulos sobrepostos: tenta acima (normal), um degrau acima e abaixo do ponto; se não couber, esconde
            a etiqueta (o ponto continua e a parte segue na lista). A selecionada e as mais próximas têm prioridade. */
        function arrumarRotulos() {
          var itens = [];
          PARTES.forEach(function (p) {
            var P = partes[p.id];
            if (P.ancora.visible && P.el.style.display !== 'none') { P.el.style.setProperty('--dy', '0px'); P.el.classList.remove('v3-esconde', 'v3-baixo', 'v3-dir', 'v3-esq'); itens.push(P); }
          });
          if (st.modo === 'quiz') return;
          itens.forEach(function (P) { P.r = P.btn.getBoundingClientRect(); P.z = +P.el.style.zIndex || 0; P.s = P.el.classList.contains('v3-sel') ? 1 : 0; });
          itens.sort(function (a, b) { return (b.s - a.s) || (b.z - a.z); });
          var postos = [], box = rotulos.getBoundingClientRect();
          [vistasBar, hud].forEach(function (o) { if (o.hidden || o.style.display === 'none') return; var e = o.getBoundingClientRect(); postos.push({ l: e.left, r: e.right, t: e.top, b: e.bottom }); });
          itens.forEach(function (P) { var e = P.el.querySelector('.v3-ponto').getBoundingClientRect(); postos.push({ l: e.left, r: e.right, t: e.top, b: e.bottom, ponto: P }); });
          itens.forEach(function (P) {
            var r = P.r, hh = r.height, ww = r.width, ok = false;
            if (!ww) return;
            var pe = P.el.querySelector('.v3-ponto').getBoundingClientRect(), cx = (pe.left + pe.right) / 2, cy = (pe.top + pe.bottom) / 2;
            var cands = [
              { l: r.left, t: r.top },
              { l: cx + 16, t: cy - hh / 2, cls: 'v3-dir' },
              { l: cx - 16 - ww, t: cy - hh / 2, cls: 'v3-esq' },
              { l: r.left, t: r.top - hh - 4, dy: hh + 4 },
              { l: r.left, t: cy + 12, cls: 'v3-baixo' },
            ];
            for (var k = 0; k < cands.length && !ok; k++) {
              var c = cands[k], q0 = { l: c.l, r: c.l + ww, t: c.t, b: c.t + hh };
              if (q0.t < box.top + 2 || q0.b > box.bottom - 2 || q0.l < box.left + 2 || q0.r > box.right - 2) continue;
              var col = postos.some(function (q) { return q.ponto !== P && !(q0.r + 2 < q.l || q0.l - 2 > q.r || q0.b + 2 < q.t || q0.t - 2 > q.b); });
              if (!col) {
                ok = true; postos.push(q0);
                if (c.cls) P.el.classList.add(c.cls);
                if (c.dy) P.el.style.setProperty('--dy', c.dy + 'px');
              }
            }
            if (!ok) P.el.classList.add('v3-esconde');
          });
        }

        /* ---- cores e tema ---- */
        function aplicarCores() {
          lerCores();
          scene.background = cor.ceu.clone();
          scene.fog = new T.Fog(cor.ceu.clone(), 38, 105);
          hemi.color.copy(cor.luzCeu); hemi.groundColor.copy(cor.luzChao);
          hemi.intensity = cor.esc ? 1.25 : 1.5;
          corMats.forEach(function (c) {
            if (c.emis) { c.m.color.copy(cor[c.k]); c.m.emissive.copy(cor[c.k]); return; }
            c.m.color.copy(cor[c.k]);
          });
          sol.intensity = cor.esc ? 1.5 : 2.4;
          uFaixa.value.copy(cor.faixa); uFundo.value.copy(cor.fundo);
          matMar.color.copy(cor.mar);
          destacar();
          pedir();
        }

        /* ---- destaque ---- */
        var PRETO = new T.Color(0, 0, 0);
        function destacar() {
          Object.keys(partes).forEach(function (id) {
            var P = partes[id], on = id === st.sel;
            P.mats.forEach(function (m) {
              if (m === proxyMat || !m.emissive) return;
              var luz = corMats.some(function (c) { return c.m === m && c.emis; });
              if (luz) { m.emissiveIntensity = on ? 1.6 : 1.0; return; }
              if (on) { m.emissive.copy(cor.destaque); m.emissiveIntensity = 0.55; }
              else if (m.userData.emisBase) { m.emissive.copy(m.color); m.emissiveIntensity = m.userData.emisBase; }
              else { m.emissive.copy(PRETO); m.emissiveIntensity = 1; }
            });
            if (P.soDestaque) P.malhas.forEach(function (o) { o.visible = on; });
          });
          /* o casco e o espelho de popa compartilham material: destaque conjunto quando um deles é escolhido */
          if (st.sel === 'popa' || st.sel === 'casco') { matCasco.emissive.copy(cor.destaque); matCasco.emissiveIntensity = 0.4; }
          if (st.sel === 'rizos') linhasRizo.forEach(function (par) { par.forEach(function (l) { l.material.color.copy(cor.destaque); }); });
          else matRizoLinha.color.copy(cor.velaLinha || PRETO);
          pedir();
        }

        /* ---- câmera ---- */
        var anim = null;
        function distAjuste(R) {
          var fov = camera.fov * D2R, hfov = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
          return R / Math.sin(Math.min(fov, hfov) / 2);
        }
        function animarCamera(pos, alvo, animar) {
          if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
          if (!animar || reduz) { camera.position.copy(pos); controls.target.copy(alvo); controls.update(); arrumar = true; pedir(); return; }
          var p0 = camera.position.clone(), a0 = controls.target.clone(), t0 = performance.now(), dur = 650;
          anim = {};
          var f = function (agora) {
            var k = clamp((agora - t0) / dur, 0, 1), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            camera.position.lerpVectors(p0, pos, e); controls.target.lerpVectors(a0, alvo, e); controls.update();
            arrumar = true; pedir();
            if (k < 1) anim.raf = requestAnimationFrame(f); else anim = null;
          };
          anim.raf = requestAnimationFrame(f);
        }
        /* enquadramento por grupo: casco e convés de perto; mastreação e velas com o barco inteiro */
        var QUADROS = {
          casco: { alvo: [0, 0.0, 0.1], R: 5.9, Rc: 6.2, lado: 'barlavento' },
          conves: { alvo: [0, 1.3, 0.5], R: 4.9, Rc: 6.2, lado: 'barlavento', y: 1.15 },
          mastro: { alvo: [0, 6.6, 0.3], R: 9.3, Rc: 8.2, lado: 'barlavento' },
          velas: { alvo: [0, 6.6, 0.3], R: 9.3, Rc: 8.2, lado: 'sotavento' },
        };
        var FOV = 38, FOV_CIMA = 16;
        function irVista3D(k, animar) {
          var d = VISTAS[k].dir, dir = V(d[0], d[1], d[2]).normalize(), q = QUADROS[st.modo === 'quiz' ? 'mastro' : st.grupo];
          camera.fov = k === 'cima' ? FOV_CIMA : FOV; camera.updateProjectionMatrix();
          var alvo = V(q.alvo[0], k === 'cima' ? 1 : q.alvo[1], q.alvo[2]);
          if (k === '34') {
            var sx = q.lado === 'sotavento' ? fis.sot : fis.lado;
            dir.set(sx * Math.abs(d[0]), q.y || d[1], d[2]).normalize();
          }
          var dist = distAjuste(k === 'cima' ? q.Rc : q.R);
          controls.maxDistance = Math.max(70, dist * 1.6);
          animarCamera(alvo.clone().addScaledVector(dir, dist), alvo, animar);
        }
        function focar(id) {
          var P = partes[id]; if (!P) return;
          banda.updateMatrixWorld(true);
          var w = P.ancora.getWorldPosition(V(0, 0, 0));
          var alvo = ALVO0.clone().lerp(w, 0.7);
          var dir = camera.position.clone().sub(controls.target).normalize();
          if (['quilha', 'leme'].indexOf(id) >= 0 && dir.y > 0.25) { dir.y = 0.12; dir.normalize(); }
          if (camera.fov !== FOV) { camera.fov = FOV; camera.updateProjectionMatrix(); }
          var dist = Math.max(11, distAjuste(9.3) * 0.62);
          animarCamera(alvo.clone().addScaledVector(dir, dist), alvo, true);
        }

        /* ---- vento: barco, velas, setas, ondas ---- */
        function aplicarVento() {
          var r = fis;
          banda.rotation.z = r.sot > 0 ? -r.banda * D2R : r.banda * D2R;
          velaGrande(); velaGenoa();
          cata.rotation.y = st.tws < 0.5 ? 0 : -r.lado * r.awa * D2R;
          var rho = st.rho;
          posSeta(setaVV, rotVV, rho, 10.5, 0.35);
          var aw = r.lado * r.awa;
          posSeta(setaVA, rotVA, aw, 7.2, 0.45);
          setasVisiveis();
          uMar.uDir.value.set(-Math.sin(rho * D2R), Math.cos(rho * D2R));
          uMar.uA.value = 0.04 + 0.011 * st.tws;
          posicionarRotulos();
          arrumar = true; pedir();
        }
        function n180(a) { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; }
        /* setas de vento sobre a água: só quando se olha de cima (nas outras vistas, o mostrador do canto basta) */
        function setasVisiveis() {
          var off = camera.position.clone().sub(controls.target), alto = off.y / (off.length() || 1) > 0.8;
          var aw = fis.lado * fis.awa;
          setaVV.visible = rotVV.visible = alto && st.tws >= 0.5;
          setaVA.visible = rotVA.visible = alto && st.tws >= 0.5 && Math.abs(n180(aw - st.rho)) > 4;
        }

        /* ---- laço de desenho ---- */
        var raf = null, sujo = true, visivel = true, ultimo = 0;
        function animando() { return st.ondas && !reduz && visivel; }
        function pedir() { sujo = true; if (!raf && visivel) raf = requestAnimationFrame(quadro); }
        function quadro(ts) {
          raf = null;
          if (!vivo || !visivel) return;
          var mover = animando();
          if (mover) {
            if (ts - ultimo < 32) { raf = requestAnimationFrame(quadro); return; }
            ultimo = ts;
            tempo = ts / 1000;
            uMar.uT.value = tempo;
            var hz = ondaJS(0, 0), hp = ondaJS(0, -3.2), hpp = ondaJS(0, 3.2), hb = ondaJS(1.4, 0), hbb = ondaJS(-1.4, 0);
            raiz.position.y = hz * 0.55;
            raiz.rotation.x = Math.atan2(hp - hpp, 6.4) * 0.5;
            raiz.rotation.z = Math.atan2(hbb - hb, 2.8) * 0.25;
            if (fis.noVento || fis.encoberta) { velaGrande(); velaGenoa(); }
            sujo = true;
          }
          if (sujo) {
            renderer.render(scene, camera);
            cssR.render(scene, camera);
            if (arrumar) { arrumar = false; arrumarRotulos(); }
            sujo = false;
          }
          if (mover) raf = requestAnimationFrame(quadro);
        }
        controls.addEventListener('change', function () { setasVisiveis(); arrumar = true; pedir(); });

        /* ---- tamanho ---- */
        function redimensionar() {
          var w = canvasBox.clientWidth || 600, hh = canvasBox.clientHeight || 480;
          renderer.setSize(w, hh, false);
          cssR.setSize(w, hh);
          camera.aspect = w / hh; camera.updateProjectionMatrix();
          arrumar = true; pedir();
        }
        var ro = new ResizeObserver(function () { redimensionar(); });
        ro.observe(canvasBox);
        lim3d.push(function () { ro.disconnect(); });
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (ents) { var v = ents[0].isIntersecting; if (v !== visivel) { visivel = v; if (v) pedir(); } });
          io.observe(cenaEl);
          lim3d.push(function () { io.disconnect(); });
        }

        /* ---- toque numa peça ---- */
        var ray = new T.Raycaster(), ndc = new T.Vector2(), toque = null;
        function aoBaixar(ev) { toque = { x: ev.clientX, y: ev.clientY, t: performance.now() }; }
        function aoSoltar(ev) {
          if (!toque) return;
          var dx = ev.clientX - toque.x, dy = ev.clientY - toque.y, dt = performance.now() - toque.t;
          toque = null;
          if (Math.hypot(dx, dy) > 7 || dt > 600 || st.modo === 'quiz') return;
          var r = renderer.domElement.getBoundingClientRect();
          ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
          ray.setFromCamera(ndc, camera);
          var hits = ray.intersectObjects(clicaveis, false);
          var vis = hits.filter(function (hh) { var o = hh.object; while (o) { if (o.visible === false && !hh.object.userData.proxy) return false; o = o.parent; } return true; });
          var real = vis.filter(function (hh) { return !hh.object.userData.proxy; });
          var hit = real.length ? real[0] : vis[0];
          if (real.length && vis.length && vis[0].object.userData.proxy && vis[0].distance < real[0].distance - 0.3) hit = vis[0];
          if (hit && hit.object.userData.parte) selecionar(hit.object.userData.parte, false);
        }
        renderer.domElement.addEventListener('pointerdown', aoBaixar);
        renderer.domElement.addEventListener('pointerup', aoSoltar);
        /* teclado: setas giram, + e − aproximam */
        var esf = new T.Spherical();
        function aoTecla(ev) {
          var k = ev.key, off = camera.position.clone().sub(controls.target);
          esf.setFromVector3(off);
          if (k === 'ArrowLeft') esf.theta -= 0.17; else if (k === 'ArrowRight') esf.theta += 0.17;
          else if (k === 'ArrowUp') esf.phi = Math.max(0.05, esf.phi - 0.12); else if (k === 'ArrowDown') esf.phi = Math.min(controls.maxPolarAngle, esf.phi + 0.12);
          else if (k === '+' || k === '=') esf.radius = Math.max(controls.minDistance, esf.radius * 0.88); else if (k === '-' || k === '_') esf.radius = Math.min(controls.maxDistance, esf.radius / 0.88);
          else return;
          ev.preventDefault();
          off.setFromSpherical(esf); camera.position.copy(controls.target).add(off); controls.update();
        }
        renderer.domElement.tabIndex = 0;
        renderer.domElement.setAttribute('aria-label', 'Veleiro em 3D. Arraste para girar e use pinça para aproximar; com o teclado, setas giram e as teclas mais e menos aproximam.');
        renderer.domElement.addEventListener('keydown', aoTecla);

        lim3d.push(VL.on('tema', function () { setTimeout(function () { if (vivo) aplicarCores(); }, 30); }));

        /* ---- API para a interface ---- */
        cena = {
          vento: aplicarVento,
          leme: function () { aplicarLeme(); posicionarRotulos(); arrumar = true; pedir(); },
          rotulos: aplicarRotulos,
          destacar: destacar,
          mar: aplicarMar,
          pedir: pedir,
          irVista: irVista3D,
          focar: focar,
        };

        /* perda do contexto WebGL: aviso, restauração (Three.js recria os recursos) ou recriação da cena (VL.gl3d, core/ui.js) */
        var vigia = VL.gl3d.vigiar(renderer.domElement, canvasBox, {
          restaurou: function () { redimensionar(); arrumar = true; pedir(); },
          recriar: function () {
            if (!vivo || ++recriacoes > 2) return false;
            desmontar3D(); cena = null;
            iniciar(T);
            return !!cena;
          },
          falhou: function () { desmontar3D(); cena = null; semWebGL(); },
        });
        lim3d.push(function () { vigia.parar(); });
        lim3d.push(function () {
          if (raf) cancelAnimationFrame(raf); raf = null;
          if (anim) cancelAnimationFrame(anim.raf);
          renderer.domElement.removeEventListener('pointerdown', aoBaixar);
          renderer.domElement.removeEventListener('pointerup', aoSoltar);
          renderer.domElement.removeEventListener('keydown', aoTecla);
          controls.dispose();
          scene.traverse(function (o) { if (o.isCSS2DObject && o.element && o.element.parentNode) o.element.parentNode.removeChild(o.element); });
          geos.forEach(function (g) { g.dispose(); });
          mats.forEach(function (m) { m.dispose(); });
          renderer.dispose();
          VL.gl3d.soltar(renderer);
          renderer.domElement.remove();
        });

        redimensionar();
        aplicarCores();
        aplicarVento();
        aplicarMar();
        aplicarRotulos();
        irVista3D(st.vista, false);
        renderCartao();
        if (st.sel) { destacar(); if (st.modo === 'quiz') focar(st.sel); }
        pedir();
      }

      VL.libs.three().then(function (T) { if (vivo) iniciar(T); }).catch(function (e) { console.warn(e); if (vivo) semWebGL(); });

      return function () {
        vivo = false;
        limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
        limpezas = [];
      };
    },
  });
})();
