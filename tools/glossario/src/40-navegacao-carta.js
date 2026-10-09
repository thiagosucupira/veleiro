
  /* ===================== Navegação e instrumentos ===================== */
  var W_CARTA = function (ex, rot) { return { w: 'carta-nautica', opts: ex ? { modo: 'exercicio', exercicio: ex } : { modo: 'explorar' }, rotulo: rot || 'Abrir a carta náutica de treinamento' }; };
  t('navegacao-estimada', 'Navegação estimada', 'navegacao', 'Método de achar a posição a partir da última posição conhecida, do rumo, da velocidade e do tempo navegado. Usá-la sempre, mesmo com GNSS a bordo, ajuda a evitar erros grosseiros.',
    { en: 'dead reckoning', sin: ['estima'], ver: ['posicao-estimada', 'rumo', 'odometro', 'corrente'], widget: W_CARTA('estima', 'Praticar a navegação estimada na carta') });
  t('posicao-estimada', 'Posição estimada', 'navegacao', 'Posição calculada pela navegação estimada, marcada na carta com a hora ao lado. Pode ser corrigida para o efeito conhecido da corrente e do abatimento.',
    { en: 'dead reckoning position; estimated position', ver: ['navegacao-estimada', 'ponto', 'reta-de-altura'] });
  t('ponto', 'Ponto (posição observada)', 'navegacao', 'Posição determinada pelo cruzamento de duas ou mais linhas de posição tiradas ao mesmo tempo. <em>Fazer o ponto</em> é determinar a posição. É mais confiável que a posição estimada.',
    { en: 'fix', sin: ['posição observada'], busca: ['fazer o ponto'], ver: ['linha-de-posicao', 'triangulo-de-incerteza', 'posicao-estimada'], fig: ['ldp', 'ponto'], widget: W_CARTA('marcacoes', 'Praticar o ponto por marcações') });
  t('linha-de-posicao', 'Linha de posição', 'navegacao', 'Linha na carta sobre a qual o barco está, obtida por uma observação: uma marcação, um alinhamento, uma distância ou a altura de um astro. Abreviatura LDP.',
    { en: 'line of position (LOP)', sin: ['LDP'], ver: ['ponto', 'marcacao', 'alinhamento', 'reta-de-altura'], fig: ['ldp', 'linha-de-posicao'], widget: W_CARTA('marcacoes', 'Praticar linhas de posição') });
  t('alinhamento', 'Alinhamento', 'navegacao', 'Duas marcas fixas vistas uma atrás da outra. Dá uma linha de posição muito precisa e, nas entradas de barra e de porto, indica o caminho do canal.',
    { en: 'transit, range, leading line', ver: ['linha-de-posicao', 'marcacao'], fig: ['ldp', 'alinhamento'] });
  t('triangulo-de-incerteza', 'Triângulo de incerteza', 'navegacao', 'Pequeno triângulo formado quando três linhas de posição não se cruzam num ponto só. Quanto menor, melhor a observação; por segurança, considere o barco no vértice mais perto do perigo.',
    { en: 'cocked hat', ver: ['ponto', 'linha-de-posicao'] });
  t('marcacao', 'Marcação', 'navegacao', 'Direção em que se vê um objeto a partir do barco, medida em graus a partir do norte, de 000° a 360° no sentido dos ponteiros do relógio. Tira-se com a agulha de marcação ou com o radar.',
    { en: 'bearing', sin: ['marcação verdadeira'], ver: ['marcacao-relativa', 'linha-de-posicao', 'risco-de-abalroamento', 'agulha'], fig: ['marcacao', 'marcacao'], widget: W_CARTA('marcacoes', 'Praticar marcações na carta') });
  t('marcacao-relativa', 'Marcação relativa', 'navegacao', 'Direção de um objeto medida a partir da proa, de 000° a 360° no sentido horário. Marcação verdadeira = rumo verdadeiro + marcação relativa (tirando 360° se passar disso).',
    { en: 'relative bearing', ver: ['marcacao', 'traves', 'bochecha', 'alheta'], fig: ['marcacao', 'marcacao-relativa'] });
  t('rumo', 'Rumo', 'navegacao', 'Direção da proa do barco, medida em graus de 000° a 360°, no sentido dos ponteiros do relógio, a partir do norte. Escreve-se sempre com três algarismos: rumo 045°. Com corrente ou abatimento, o caminho real sobre o fundo pode ser outro.',
    { en: 'course; heading', busca: ['proa (direção)'], ver: ['rumo-verdadeiro', 'rumo-magnetico', 'rumo-da-agulha', 'rumo-no-fundo', 'derrota'], widget: W_CARTA('rumo-dist', 'Praticar rumo e distância na carta') });
  t('rumo-verdadeiro', 'Rumo verdadeiro', 'navegacao', 'Rumo medido a partir do norte verdadeiro (geográfico). É o que se traça na carta. Abreviatura Rv. Para converter: Rv = Rag + Dag + Dmg, somando os valores a leste (E) e subtraindo os a oeste (W).',
    { en: 'true course', sin: ['Rv'], ver: ['rumo-magnetico', 'rumo-da-agulha', 'declinacao-magnetica', 'desvio-da-agulha'], fig: ['nortes', 'rumo-verdadeiro'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('rumo-magnetico', 'Rumo magnético', 'navegacao', 'Rumo medido a partir do norte magnético, para onde aponta uma agulha sem desvio. Abreviatura Rmg. Rmg = Rv − Dmg (com a declinação leste positiva e a oeste negativa).',
    { en: 'magnetic course', sin: ['Rmg'], ver: ['rumo-verdadeiro', 'declinacao-magnetica', 'rumo-da-agulha'], fig: ['nortes', 'rumo-magnetico'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('rumo-da-agulha', 'Rumo da agulha', 'navegacao', 'Rumo que se lê na agulha de bordo, medido a partir do norte da agulha (que se afasta do norte verdadeiro pela declinação magnética e pelo desvio da agulha). Abreviatura Rag.',
    { en: 'compass course', sin: ['Rag'], ver: ['desvio-da-agulha', 'rumo-magnetico', 'agulha', 'linha-de-fe'], fig: ['nortes', 'rumo-da-agulha'], widget: { w: 'agulha-calc', opts: {}, rotulo: 'Abrir a calculadora de rumos' } });
  t('declinacao-magnetica', 'Declinação magnética', 'navegacao', 'Ângulo entre o norte verdadeiro e o norte magnético num lugar, para leste (E) ou para oeste (W). Muda de lugar para lugar e devagar com os anos: a rosa da carta traz o valor e a variação anual. No litoral brasileiro ela é oeste; no Rio de Janeiro, por exemplo, passa de 22°.',
    { en: 'magnetic variation (declination)', sin: ['Dmg', 'variação magnética'], ver: ['desvio-da-agulha', 'rumo-magnetico', 'rosa-dos-ventos'], fig: ['nortes', 'declinacao-magnetica'] });
  t('desvio-da-agulha', 'Desvio da agulha', 'navegacao', 'Ângulo entre o norte magnético e o norte da agulha de bordo, causado por ferros, motor e eletrônicos do barco. Muda com a proa: anota-se numa tabela de desvios feita na compensação da agulha.',
    { en: 'deviation', sin: ['Dag'], busca: ['curva de desvios'], ver: ['declinacao-magnetica', 'rumo-da-agulha', 'agulha'], fig: ['nortes', 'desvio-da-agulha'] });
  t('agulha', 'Agulha', 'navegacao', 'Bússola de bordo. A agulha de governo fica fixa, à vista do timoneiro; a agulha de marcação é portátil, para tirar marcações de pontos de terra e de outros barcos.',
    { en: 'compass; hand-bearing compass', sin: ['bússola', 'agulha magnética'], busca: ['agulha de marcação'], ver: ['linha-de-fe', 'desvio-da-agulha', 'marcacao'] });
  t('linha-de-fe', 'Linha de fé', 'navegacao', 'Marca na agulha alinhada com a proa do barco. O rumo é lido na rosa da agulha em frente a ela.',
    { en: 'lubber line', ver: ['agulha', 'rumo-da-agulha'] });
  t('rosa-dos-ventos', 'Rosa dos ventos', 'navegacao', 'Círculo graduado de 000° a 360°, com os pontos cardeais e colaterais, impresso nas cartas náuticas. Traz o norte verdadeiro e, por dentro, o magnético, com a declinação e a variação anual.',
    { en: 'compass rose', sin: ['rosa dos rumos'], ver: ['pontos-cardeais', 'declinacao-magnetica', 'carta-nautica'] });
  t('pontos-cardeais', 'Pontos cardeais', 'navegacao', 'Norte (N), leste (E), sul (S) e oeste (W). Na navegação, usam-se E e W, como nas cartas e nas coordenadas. Os intercardeais (ou laterais) são NE, SE, SW e NW; os colaterais são as subdivisões seguintes, como NNE e ENE.',
    { en: 'cardinal points', busca: ['colaterais'], ver: ['rosa-dos-ventos', 'marca-cardinal', 'longitude'] });
  t('milha-nautica', 'Milha náutica', 'navegacao', 'Unidade de distância do mar: 1 milha náutica = 1.852 metros, cerca de um minuto de arco de latitude. Por isso as distâncias se medem na escala de latitudes, na lateral da carta. Abreviatura M ou MN.',
    { en: 'nautical mile (NM)', sin: ['milha', 'MN'], ver: ['no-velocidade', 'latitude', 'compasso-de-navegacao'] });
  t('no-velocidade', 'Nó (velocidade)', 'navegacao', 'Unidade de velocidade: 1 nó = 1 milha náutica por hora (1,852 km/h). Um veleiro de cruzeiro costuma andar de 5 a 7 nós (num de 32 pés, por exemplo); barcos maiores andam mais.',
    { en: 'knot (kn)', sin: ['nós'], ver: ['milha-nautica', 'velocidade-de-casco', 'odometro'] });
  t('singradura', 'Singradura', 'navegacao', 'Distância navegada em 24 horas. A NORMAM-211 também usa a palavra para a viagem a ser feita.',
    { en: 'day’s run; passage', ver: ['derrota', 'milha-nautica'] });
  t('derrota', 'Derrota', 'navegacao', 'Caminho planejado ou percorrido pela embarcação de um ponto a outro, traçado na carta como uma sequência de rumos e distâncias.',
    { en: 'route, track', ver: ['waypoint', 'ortodromica', 'loxodromica', 'rumo'], widget: { w: 'derrota-calc', opts: {}, rotulo: 'Abrir a calculadora de derrotas' } });
  t('ortodromica', 'Ortodrômica', 'navegacao', 'Caminho mais curto entre dois pontos da Terra, ao longo de um círculo máximo. Na carta de Mercator aparece como uma curva, e o rumo muda o tempo todo. Compensa nas travessias longas.',
    { en: 'great circle (route)', sin: ['ortodromia', 'círculo máximo'], ver: ['loxodromica', 'derrota', 'projecao-de-mercator'], fig: ['ortoloxo', 'ortodromia'], widget: { w: 'derrota-calc', opts: { aba: 'derrotas' }, rotulo: 'Calcular uma derrota ortodrômica' } });
  t('loxodromica', 'Loxodrômica', 'navegacao', 'Linha que corta todos os meridianos com o mesmo ângulo: navegar nela é manter o rumo constante. Na carta de Mercator é uma reta, mas é mais longa que a ortodrômica.',
    { en: 'rhumb line', sin: ['loxodromia'], ver: ['ortodromica', 'projecao-de-mercator', 'rumo'], fig: ['ortoloxo', 'loxodromia'], widget: { w: 'derrota-calc', opts: { aba: 'derrotas' }, rotulo: 'Calcular uma derrota loxodrômica' } });
  t('waypoint', 'Waypoint', 'navegacao', 'Ponto de passagem de uma derrota, com latitude e longitude, gravado no GNSS ou no plotter. Deve ficar em águas seguras, longe de perigos.',
    { en: 'waypoint', sin: ['ponto de passagem', 'ponto de derrota'], ver: ['derrota', 'gnss', 'plotter'] });
  t('latitude', 'Latitude', 'navegacao', 'Distância angular de um lugar ao equador, de 0° a 90°, para norte (N) ou para sul (S). Lê-se nas escalas laterais da carta. Um grau tem 60 minutos, e um minuto de latitude vale cerca de 1 milha náutica.',
    { en: 'latitude', ver: ['longitude', 'paralelo', 'equador', 'milha-nautica'], fig: ['latlon', 'latitude'] });
  t('longitude', 'Longitude', 'navegacao', 'Distância angular de um lugar ao meridiano de Greenwich, de 0° a 180°, para leste (E) ou para oeste (W). Lê-se nas escalas de cima e de baixo da carta. Todo o Brasil fica em longitude oeste.',
    { en: 'longitude', ver: ['latitude', 'meridiano', 'fuso-horario'], fig: ['latlon', 'longitude'] });
  t('paralelo', 'Paralelo', 'navegacao', 'Círculo da Terra paralelo ao equador. Todos os pontos de um paralelo têm a mesma latitude.',
    { en: 'parallel (of latitude)', ver: ['latitude', 'equador', 'meridiano'], fig: ['latlon', 'paralelo'] });
  t('meridiano', 'Meridiano', 'navegacao', 'Círculo máximo da Terra que contém os dois polos (usa-se a metade que liga um polo ao outro). Todos os pontos de um meridiano têm a mesma longitude; o de Greenwich é o meridiano de origem (0°).',
    { en: 'meridian', busca: ['meridiano de Greenwich'], ver: ['longitude', 'paralelo', 'passagem-meridiana'], fig: ['latlon', 'meridiano'] });
  t('equador', 'Equador', 'navegacao', 'Círculo máximo da Terra a meio caminho entre os polos, na latitude 0°. Divide os hemisférios norte e sul.',
    { en: 'equator', ver: ['latitude', 'equador-celeste', 'zcit'], fig: ['latlon', 'equador'] });
  t('carta-nautica', 'Carta náutica', 'navegacao', 'Mapa do mar feito para navegar: mostra profundidades, perigos, faróis, boias, a costa e as marcas de terra. No Brasil, as cartas oficiais são da DHN, da Marinha. Use a edição em vigor, corrigida pelos Avisos aos Navegantes.',
    { en: 'nautical chart', sin: ['carta'], ver: ['carta-12000', 'avisos-aos-navegantes', 'escala-da-carta', 'isobata', 'sondagem', 'dhn'], fig: ['carta', 'carta-nautica'], legenda: 'Trecho fictício, só para treino: terra, isóbatas de 5, 10 e 20 m e sondagens em metros. Nunca use para navegar.', nota: false, widget: W_CARTA(null), link: { txt: 'Cartas náuticas (CHM)', url: URL.cartas } });
  t('projecao-de-mercator', 'Projeção de Mercator', 'navegacao', 'Projeção usada na maioria das cartas náuticas: meridianos e paralelos são retas perpendiculares, e os rumos constantes aparecem como retas. A escala cresce com a latitude, por isso as distâncias se medem na escala de latitudes, na altura em que se está.',
    { en: 'Mercator projection', ver: ['loxodromica', 'ortodromica', 'milha-nautica', 'carta-nautica'], fig: ['ortoloxo', 'nada'] });
  t('escala-da-carta', 'Escala da carta', 'navegacao', 'Relação entre a medida na carta e no terreno, como 1:50.000. Carta de grande escala, como 1:25.000, mostra uma área pequena com muitos detalhes; a de pequena escala, uma área grande com poucos detalhes.',
    { en: 'chart scale', ver: ['carta-nautica'] });
  t('datum', 'Datum', 'navegacao', 'Modelo da forma da Terra usado para dar latitude e longitude. O GNSS usa o WGS-84: antes de plotar uma posição do GNSS, confira na carta qual datum ela usa e se pede alguma correção.',
    { en: 'datum (geodetic)', ver: ['gnss', 'carta-nautica', 'latitude'] });
  t('gnss', 'GNSS', 'navegacao', 'Sistemas de navegação por satélite, como o GPS (EUA), o Galileo (Europa), o GLONASS (Rússia) e o BeiDou (China). Dão a posição com erro de poucos metros, mas podem falhar: mantenha a navegação estimada e a carta em papel.',
    { en: 'GNSS (Global Navigation Satellite System)', busca: ['GPS'], ver: ['plotter', 'waypoint', 'datum', 'navegacao-estimada'] });
  t('radar', 'Radar', 'navegacao', 'Aparelho que emite ondas de rádio e mostra na tela os ecos de terra, navios e chuva, com distância e marcação. Funciona à noite e no nevoeiro, mas barcos pequenos de fibra refletem pouco.',
    { en: 'radar', ver: ['refletor-radar', 'sart', 'ais', 'marcacao'] });
  t('ais', 'AIS', 'navegacao', 'Sistema Automático de Identificação: transmissor e receptor em VHF que troca nome, posição, rumo e velocidade entre embarcações e estações de terra. A classe A é a dos navios; a classe B, a dos barcos de recreio.',
    { en: 'AIS (Automatic Identification System)', ver: ['radar', 'vhf', 'ais-mob', 'sart', 'mmsi'] });
  t('ecobatimetro', 'Ecobatímetro', 'navegacao', 'Instrumento que mede a profundidade sob o casco com pulsos de som. Pode ser regulado para mostrar a profundidade abaixo da quilha ou da superfície: saiba qual é a do seu barco.',
    { en: 'echo sounder, depth sounder', sin: ['sonda', 'profundímetro'], ver: ['calado', 'sondagem', 'isobata'] });
  t('odometro', 'Odômetro', 'navegacao', 'Instrumento que mede a velocidade e a distância percorrida pelo barco na água, em geral por uma pequena hélice ou roda no casco. Não inclui a corrente, que o GNSS percebe.',
    { en: 'log (speed log)', ver: ['no-velocidade', 'navegacao-estimada', 'rumo-no-fundo'] });
  t('plotter', 'Plotter', 'navegacao', 'Tela que mostra cartas eletrônicas com a posição do GNSS, a derrota e os waypoints. Ajuda muito, mas confira com a carta oficial e com a navegação estimada.',
    { en: 'chartplotter', sin: ['chartplotter'], busca: ['carta eletrônica'], ver: ['gnss', 'waypoint', 'carta-nautica'] });
  t('piloto-automatico', 'Piloto automático', 'navegacao', 'Aparelho elétrico que governa o barco sozinho, mantendo um rumo da agulha ou um ângulo com o vento. Com ele ligado, a vigilância continua obrigatória.',
    { en: 'autopilot', ver: ['piloto-de-vento', 'governar', 'vigilancia'] });
  t('piloto-de-vento', 'Piloto de vento', 'navegacao', 'Sistema mecânico na popa que governa o barco pelo vento aparente, sem gastar energia elétrica. Muito usado em travessias oceânicas.',
    { en: 'windvane self-steering', sin: ['leme de vento', 'cata-vento'], ver: ['piloto-automatico', 'vento-aparente'] });
  t('compasso-de-navegacao', 'Compasso de navegação', 'navegacao', 'Compasso de pontas secas usado para medir e transportar distâncias na carta, sempre comparando com a escala de latitudes.',
    { en: 'dividers', sin: ['compasso de pontas secas'], ver: ['regua-paralela', 'milha-nautica', 'carta-nautica'] });
  t('regua-paralela', 'Régua paralela', 'navegacao', 'Régua dupla articulada que leva uma direção da rosa da carta até outro ponto, para traçar rumos e marcações. O plotador paralelo, com roletes, faz o mesmo.',
    { en: 'parallel rule', busca: ['esquadros'], ver: ['compasso-de-navegacao', 'rosa-dos-ventos', 'rumo'] });
  t('rumo-no-fundo', 'Rumo e velocidade no fundo', 'navegacao', 'Direção e velocidade reais do barco em relação ao fundo: o rumo e a velocidade na água somados ao efeito da corrente (e do vento e do mar). São o COG e o SOG que o GNSS mostra.',
    { en: 'course over ground (COG); speed over ground (SOG)', sin: ['COG', 'SOG', 'velocidade no fundo'], busca: ['rumo na superfície'], ver: ['corrente', 'abatimento', 'triangulo-de-corrente', 'gnss'], fig: ['corrente', 'rumo-no-fundo'] });
  t('corrente', 'Corrente', 'navegacao', 'Movimento horizontal da água. Indica-se pela direção para onde ela vai (rumo da corrente) e pela velocidade em nós. Atenção: o vento é dado de onde vem; a corrente, para onde vai.',
    { en: 'current (set and drift)', ver: ['corrente-de-mare', 'deriva', 'triangulo-de-corrente', 'rumo-no-fundo'], fig: ['corrente', 'corrente'] });
  t('triangulo-de-corrente', 'Triângulo de corrente', 'navegacao', 'Construção na carta que soma o rumo e a velocidade na água com a corrente, para achar o rumo e a velocidade no fundo, ou o rumo a governar para compensar a corrente.',
    { en: 'current triangle (vector triangle)', ver: ['corrente', 'rumo-no-fundo', 'navegacao-estimada'], fig: ['corrente', 'nada'], widget: W_CARTA('corrente', 'Praticar o triângulo de corrente') });

  /* ===================== Cartas, marés e balizamento ===================== */
  t('mare', 'Maré', 'carta', 'Subida e descida periódica do nível do mar, causada principalmente pela atração da Lua e do Sol. Na maior parte do litoral brasileiro, é semidiurna: duas preamares e duas baixa-mares por dia, com cerca de 6 horas e 12 minutos entre elas.',
    { en: 'tide', ver: ['preamar', 'baixa-mar', 'amplitude', 'sizigia', 'tabua-das-mares'], fig: ['mare', 'nada'] });
  t('preamar', 'Preamar', 'carta', 'Nível mais alto que a maré alcança num ciclo. Abreviatura PM.',
    { en: 'high water (HW)', sin: ['PM', 'maré cheia'], ver: ['baixa-mar', 'amplitude', 'estofo'], fig: ['mare', 'preamar'] });
  t('baixa-mar', 'Baixa-mar', 'carta', 'Nível mais baixo que a maré alcança num ciclo. Abreviatura BM.',
    { en: 'low water (LW)', sin: ['BM', 'maré baixa'], ver: ['preamar', 'amplitude', 'nivel-de-reducao'], fig: ['mare', 'baixa-mar'] });
  t('amplitude', 'Amplitude da maré', 'carta', 'Diferença de altura entre uma preamar e a baixa-mar seguinte (ou anterior). É maior na sizígia e menor na quadratura. Exemplo do Manual de Navegação, em Salinópolis (PA): cerca de 4,7 m na sizígia de 13/3/2021 e 2,0 m na quadratura de 21/3/2021. A Tábua das Marés traz as alturas de cada porto.',
    { en: '(tidal) range', ver: ['preamar', 'baixa-mar', 'sizigia', 'quadratura', 'regra-dos-doze-avos'], fig: ['mare', 'amplitude'] });
  t('altura-da-mare', 'Altura da maré', 'carta', 'Altura do nível do mar acima do nível de redução num dado instante. A Tábua das Marés traz as alturas e as horas das preamares e das baixa-mares de cada dia.',
    { en: 'height of tide', ver: ['nivel-de-reducao', 'sondagem', 'tabua-das-mares'], fig: ['mare', 'altura-da-mare'] });
  t('nivel-de-reducao', 'Nível de redução', 'carta', 'Plano de referência a partir do qual se medem as sondagens da carta e as alturas da Tábua das Marés. Fica perto das baixa-mares mais baixas, para que quase sempre haja mais água do que a carta mostra. Abreviatura NR; o nível usado vem escrito na carta.',
    { en: 'chart datum', sin: ['NR'], ver: ['sondagem', 'altura-da-mare', 'baixa-mar'], fig: ['mare', 'nivel-de-reducao'] });
  t('enchente', 'Enchente', 'carta', 'Período em que a maré sobe, da baixa-mar até a preamar. A corrente de enchente é a que entra nos estuários e nas baías nesse período.',
    { en: 'flood (rising tide; flood stream)', ver: ['vazante', 'corrente-de-mare', 'estofo'], fig: ['mare', 'enchente'] });
  t('vazante', 'Vazante', 'carta', 'Período em que a maré desce, da preamar até a baixa-mar. A corrente de vazante é a que sai dos estuários e das baías.',
    { en: 'ebb (falling tide; ebb stream)', ver: ['enchente', 'corrente-de-mare', 'estofo'], fig: ['mare', 'vazante'] });
  t('estofo', 'Estofo', 'carta', 'Intervalo, perto da preamar ou da baixa-mar, em que o nível do mar fica praticamente estacionado. Em geral é a hora de corrente mínima, boa para entrar num canal. Mas em canais longos e estuários a corrente tem outro ritmo (em Santana, AP, ela é máxima na preamar): consulte as Cartas de Correntes de Maré.',
    { en: 'stand of the tide; slack water', ver: ['preamar', 'baixa-mar', 'corrente-de-mare'], fig: ['mare', 'estofo'] });
  t('sizigia', 'Sizígia', 'carta', 'Época da lua nova e da lua cheia, quando Sol, Terra e Lua ficam alinhados e as marés têm as maiores amplitudes. São as marés de águas vivas.',
    { en: 'spring tide', sin: ['águas vivas'], ver: ['quadratura', 'amplitude', 'mare'], fig: ['sizigia', 'sizigia'] });
  t('quadratura', 'Quadratura', 'carta', 'Época do quarto crescente e do quarto minguante, quando Sol e Lua formam ângulo reto com a Terra e as marés têm as menores amplitudes. São as marés de águas mortas.',
    { en: 'neap tide', sin: ['águas mortas'], ver: ['sizigia', 'amplitude', 'mare'], fig: ['sizigia', 'quadratura'] });
  t('regra-dos-doze-avos', 'Regra dos doze avos', 'carta', 'Regra prática para estimar a altura da maré entre a baixa-mar e a preamar: em cada uma das seis horas, a maré sobe 1, 2, 3, 3, 2 e 1 doze avos da amplitude (e desce do mesmo jeito). Vale para marés semidiurnas regulares.',
    { en: 'rule of twelfths', ver: ['amplitude', 'altura-da-mare', 'tabua-das-mares'], fig: ['mare', 'regra-dos-doze-avos'] });
  t('corrente-de-mare', 'Corrente de maré', 'carta', 'Corrente horizontal causada pela maré, que muda de sentido entre a enchente e a vazante. Pode ser forte em canais, barras e baías. A DHN publica Cartas de Correntes de Maré de alguns portos.',
    { en: 'tidal stream', ver: ['enchente', 'vazante', 'estofo', 'corrente'], link: { txt: 'Cartas de Correntes de Maré (CHM)', url: URL.correntesMare } });
  t('tabua-das-mares', 'Tábua das Marés', 'carta', 'Publicação da DHN com as horas e as alturas previstas das preamares e baixa-mares de portos do Brasil, referidas ao nível de redução. O CHM a disponibiliza no seu site.',
    { en: 'tide tables', ver: ['mare', 'altura-da-mare', 'nivel-de-reducao'], link: { txt: 'Tábuas das Marés (CHM)', url: URL.tabuas } });
  t('isobata', 'Isóbata', 'carta', 'Linha que liga pontos de mesma profundidade na carta, como as curvas de nível de um mapa de terra.',
    { en: 'depth contour', ver: ['sondagem', 'carta-nautica', 'ecobatimetro'], fig: ['carta', 'isobata'] });
  t('sondagem', 'Sondagem', 'carta', 'Número na carta que indica a profundidade naquele ponto, em metros, abaixo do nível de redução. A profundidade de verdade é a sondagem mais a altura da maré no momento.',
    { en: 'sounding (charted depth)', ver: ['nivel-de-reducao', 'altura-da-mare', 'isobata', 'calado'], fig: ['carta', 'sondagem'] });
  t('carta-12000', 'Carta 12000', 'carta', 'Publicação da DHN que explica os símbolos, as abreviaturas e os termos usados nas cartas náuticas brasileiras. Corresponde à carta INT 1 internacional.',
    { en: 'Chart 1 (INT 1)', sin: ['INT 1'], ver: ['carta-nautica', 'isobata'], link: { txt: 'Carta 12000 (INT 1), CHM', url: URL.carta12000 } });
  t('avisos-aos-navegantes', 'Avisos aos Navegantes', 'carta', 'Publicação da DHN com as correções das cartas e das publicações náuticas e com informações de segurança, como faróis apagados, perigos novos e obras. As cartas de bordo devem ser mantidas corrigidas por ela.',
    { en: 'Notices to Mariners', ver: ['carta-nautica', 'lista-de-farois'], link: { txt: 'Avisos aos Navegantes (CHM)', url: URL.avisos } });
  t('lista-de-farois', 'Lista de Faróis', 'carta', 'Publicação da DHN com a descrição dos faróis, faroletes e boias luminosas da costa, com a posição, a característica da luz, a altura e o alcance.',
    { en: 'List of Lights', ver: ['farol', 'caracteristica-da-luz', 'alcance'], link: { txt: 'Lista de Faróis (CHM)', url: URL.farois } });
  t('roteiro', 'Roteiro', 'carta', 'Publicação da DHN que descreve a costa, os portos, as barras, os perigos, os fundeadouros e os recursos de cada trecho do litoral. Completa a carta.',
    { en: 'Sailing Directions (Pilot)', ver: ['carta-nautica', 'lista-de-farois'], link: { txt: 'Roteiros (CHM)', url: URL.roteiros } });
  t('farol', 'Farol', 'carta', 'Estrutura fixa, com luz de característica própria, que serve de marca de dia e de noite. Pela definição da Marinha, o alcance luminoso noturno de um farol é maior que 10 milhas náuticas.',
    { en: 'lighthouse', ver: ['caracteristica-da-luz', 'alcance', 'lista-de-farois', 'marcacao'] });
  var W_LUZ = function (c, rot) { return { w: 'ritmos-luz', opts: { caracteristica: c }, rotulo: rot || 'Ver o ritmo da luz' }; };
  t('caracteristica-da-luz', 'Característica da luz', 'carta', 'Modo como a luz de um farol ou de uma boia acende e apaga, para ser identificada: ritmo, cor e período. Exemplo: Fl(3) W 15s (Lp(3) B 15s nas cartas brasileiras) são três lampejos brancos a cada 15 segundos.',
    { en: 'light characteristic', ver: ['lampejo', 'ocultacao', 'isofasica', 'luz-rapida', 'farol'], widget: W_LUZ('Fl(3) W 15s', 'Abrir o decodificador de luzes') });
  t('lampejo', 'Lampejo', 'carta', 'Luz que fica acesa por menos tempo do que apagada, em clarões. Abreviatura Lp. nas cartas brasileiras (Fl nas cartas INT, em inglês).',
    { en: 'flashing (Fl)', ver: ['caracteristica-da-luz', 'ocultacao', 'isofasica'], widget: W_LUZ('Fl W 5s') });
  t('ocultacao', 'Ocultação', 'carta', 'Luz que fica acesa por mais tempo do que apagada, com eclipses curtos. Abreviatura Oc.',
    { en: 'occulting (Oc)', ver: ['caracteristica-da-luz', 'lampejo', 'isofasica'], widget: W_LUZ('Oc W 4s') });
  t('isofasica', 'Isofásica', 'carta', 'Luz com tempos iguais de luz e de escuridão. Abreviatura Iso.',
    { en: 'isophase (Iso)', ver: ['caracteristica-da-luz', 'aguas-seguras'], widget: W_LUZ('Iso W 4s') });
  t('luz-rapida', 'Luz rápida', 'carta', 'Luz de lampejos rápidos e seguidos, de 50 a 79 por minuto (abreviatura R na Lista de Faróis; Q nas cartas INT). A muito rápida (MR; VQ nas cartas INT) tem de 80 a 159 lampejos por minuto. São as luzes das marcas cardinais.',
    { en: 'quick (Q); very quick (VQ)', sin: ['rápida'], busca: ['muito rápida'], ver: ['marca-cardinal', 'caracteristica-da-luz'], widget: W_LUZ('Q(3) 10s') });
  t('alcance', 'Alcance de uma luz', 'carta', 'Distância máxima em que uma luz pode ser vista. O alcance luminoso depende da intensidade da luz e da visibilidade; o geográfico, da altura da luz e do olho do observador, por causa da curvatura da Terra.',
    { en: 'range (luminous, geographical)', ver: ['farol', 'lista-de-farois'] });
  t('balizamento', 'Balizamento', 'carta', 'Sistema de boias e marcas que indica canais, perigos e áreas especiais. O Brasil adota o Sistema de Balizamento Marítimo da IALA, Região B, aprovado pelo Decreto nº 92.267, de 1986.',
    { en: 'buoyage (maritime buoyage system)', ver: ['iala-regiao-b', 'marca-lateral', 'marca-cardinal', 'perigo-isolado', 'aguas-seguras', 'marca-especial'], fig: ['laterais', 'nada'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' }, fonte: { txt: 'Decreto nº 92.267/1986', url: URL.iala, loc: 'art. 1º' } });
  t('iala-regiao-b', 'IALA Região B', 'carta', 'Região do sistema de balizamento da IALA usada nas Américas, no Japão, na Coreia e nas Filipinas. Nela, quem entra do mar deixa as marcas vermelhas por boreste e as verdes por bombordo, o contrário da Região A.',
    { en: 'IALA Region B', ver: ['balizamento', 'marca-lateral'], fig: ['laterais', 'iala-regiao-b'], fonte: { txt: 'Decreto nº 92.267/1986', url: URL.iala, loc: 'art. 1º' } });
  t('marca-lateral', 'Marca lateral', 'carta', 'Marca que indica os lados de um canal. Na Região B, para quem entra do mar: verde, cilíndrica, por bombordo; vermelha, cônica, por boreste. O sentido de entrada é o que vem do mar para o porto, ou o definido pela autoridade.',
    { en: 'lateral mark', ver: ['iala-regiao-b', 'balizamento', 'marca-cardinal'], fig: ['laterais', 'marca-lateral'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' } });
  t('marca-cardinal', 'Marca cardinal', 'carta', 'Marca que diz de que lado está a água segura em relação a um perigo, pelos pontos cardeais: passe ao norte de uma cardinal norte, ao sul de uma cardinal sul, e assim por diante. É preta e amarela, com tope de dois cones pretos, e tem luz branca rápida ou muito rápida.',
    { en: 'cardinal mark', ver: ['pontos-cardeais', 'luz-rapida', 'balizamento', 'perigo-isolado'], fig: ['cardinais', 'marca-cardinal'], widget: { w: 'boias-iala', opts: {}, rotulo: 'Abrir o simulador de balizamento' } });
  t('perigo-isolado', 'Marca de perigo isolado', 'carta', 'Marca posta sobre um perigo pequeno, com água navegável em volta. É preta com uma ou mais faixas vermelhas, tem tope de duas esferas pretas e luz branca Fl(2).',
    { en: 'isolated danger mark', ver: ['marca-cardinal', 'balizamento'], fig: ['outras', 'perigo-isolado'] });
  t('aguas-seguras', 'Marca de águas seguras', 'carta', 'Marca que indica água navegável em volta, como o meio de um canal ou a aproximação de um porto. Tem listras verticais vermelhas e brancas, tope de uma esfera vermelha e luz branca isofásica, de ocultação, de lampejo longo de 10 s ou Mo(A).',
    { en: 'safe water mark', ver: ['balizamento', 'isofasica'], fig: ['outras', 'aguas-seguras'] });
  t('marca-especial', 'Marca especial', 'carta', 'Marca amarela, com tope em X, que indica uma área ou coisa especial (cabo submarino, área de exercícios, emissário, área de recreio) e não serve de guia para a navegação. A luz, se houver, é amarela.',
    { en: 'special mark', ver: ['balizamento'], fig: ['outras', 'marca-especial'] });
  t('naufragio-recente', 'Marca de naufrágio recente', 'carta', 'Boia de listras verticais azuis e amarelas, com tope em cruz amarela e luz alternada azul e amarela, posta provisoriamente sobre um naufrágio novo, ainda fora das cartas.',
    { en: 'emergency wreck marking buoy', ver: ['balizamento', 'avisos-aos-navegantes'], fig: ['outras', 'marca-de-naufragio'] });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('latitude-media', 'Latitude média', 'navegacao', 'Latitude do paralelo que fica no meio entre dois lugares: a semissoma das latitudes, se os dois estão no mesmo hemisfério, ou a semidiferença, se estão em hemisférios diferentes (com o nome da maior). Na estima, serve para converter o apartamento em diferença de longitude: Δλ = apartamento ÷ cos φm.',
    { en: 'middle latitude (mean latitude)', sin: ['φm', 'paralelo médio'], ver: ['latitude', 'apartamento', 'navegacao-estimada', 'derrota'], fonte: mig1('definição de latitude média, PDF p. 29') });
  t('latitude-crescida', 'Latitude crescida', 'carta', 'Na projeção de Mercator, o comprimento do arco de meridiano entre o equador e um paralelo, medido em minutos de longitude (1 minuto do equador). Cresce mais depressa que a latitude: por isso a escala de latitudes da carta aumenta em direção aos polos e as distâncias só são verdadeiras se lidas na escala de latitudes, na altura do trecho.',
    { en: 'meridional parts', sin: ['latitudes crescidas'], ver: ['projecao-de-mercator', 'carta-nautica', 'escala-da-carta', 'latitude'], fonte: mig1('cap. 2, item 2.4.4, PDF p. 47') });
  t('apartamento', 'Apartamento', 'navegacao', 'Distância percorrida para leste ou para oeste, medida sobre o paralelo, em milhas. Calcula-se por apartamento = Δλ × cos φm, com Δλ em minutos de arco. Junto com a diferença de latitude, forma o triângulo da navegação plana (estima): tan R = apartamento ÷ Δφ.',
    { en: 'departure', ver: ['latitude-media', 'navegacao-estimada', 'rumo', 'derrota'] });
  t('navegacao-por-paralelo', 'Navegação por paralelo', 'navegacao', 'Método para quem não tem relógio preciso (e portanto não sabe a longitude): navega-se até a latitude do destino e segue-se por esse paralelo, para leste ou para oeste, até avistar a terra. A latitude é mantida constante, mas a rota costuma ser mais longa que a direta.',
    { en: 'parallel sailing (running down the latitude)', ver: ['latitude', 'longitude', 'paralelo', 'navegacao-estimada'] });
  t('plano-de-viagem', 'Plano de viagem', 'navegacao', 'Planejamento da viagem antes de sair: rota, pontos de passagem, distâncias, horários, abrigos e alternativas. Na navegação de esporte e recreio, o Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.',
    { en: 'passage plan (voyage plan)', ver: ['aviso-de-saida', 'navseg', 'derrota', 'janela-meteorologica'], fonte: n211('Cap. 4, art. 4.6.1, p. 4-3') });
  t('diario-de-bordo', 'Diário de bordo', 'navegacao', 'Livro em que se anotam, em ordem de hora, posições, rumos, velocidades, tempo e ocorrências da viagem. Alimenta a navegação estimada e ajuda a reconstituir o que aconteceu. O Manual de Navegação da Marinha relaciona o “Diário de Navegação” entre os livros e publicações de bordo.',
    { en: 'logbook', sin: ['diário de navegação'], ver: ['navegacao-estimada', 'posicao-estimada', 'barograma'], fonte: mig1('cap. 12, lista de publicações e livros de bordo, PDF p. 377') });
