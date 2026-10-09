
  /* ===================== Navegação astronômica ===================== */
  var W_ESFERA = { w: 'esfera-celeste', opts: { vista: 'observador' }, rotulo: 'Abrir a esfera celeste em 3D' };
  var W_RETA = { w: 'reta-altura', opts: {}, rotulo: 'Abrir o cálculo da reta de altura' };
  t('navegacao-astronomica', 'Navegação astronômica', 'astro', 'Achar a posição pela observação dos astros (Sol, Lua, planetas e estrelas) com o sextante, um relógio preciso e o Almanaque Náutico. Está no programa da prova de Capitão-Amador e é o plano B quando o GNSS falha.',
    { en: 'celestial navigation', ver: ['sextante', 'reta-de-altura', 'almanaque-nautico', 'passagem-meridiana', 'capitao-amador'], widget: W_RETA, fonte: n211('Anexo 5-A, item 1.1 a), p. 5-A-2') });
  t('sextante', 'Sextante', 'astro', 'Instrumento de reflexão, com dois espelhos, que mede o ângulo entre um astro e o horizonte com precisão de décimos de minuto de arco.',
    { en: 'sextant', ver: ['altura', 'horizonte', 'navegacao-astronomica'], fig: ['sextante', 'nada'], widget: { w: 'sextante', opts: {}, rotulo: 'Abrir o simulador de sextante' } });
  t('altura', 'Altura de um astro', 'astro', 'Ângulo vertical entre o horizonte e o astro, medido com o sextante. A altura lida no instrumento passa por correções (erro instrumental, depressão do horizonte, refração, semidiâmetro e paralaxe) até virar a altura verdadeira.',
    { en: 'altitude', ver: ['distancia-zenital', 'sextante', 'depressao-do-horizonte', 'reta-de-altura'], fig: ['esfera', 'altura'], widget: W_ESFERA });
  t('distancia-zenital', 'Distância zenital', 'astro', 'Ângulo entre o zênite e o astro: 90° menos a altura.',
    { en: 'zenith distance', ver: ['altura', 'zenite'], fig: ['esfera', 'distancia-zenital'] });
  t('azimute', 'Azimute', 'astro', 'Direção horizontal de um astro, medida do norte, pelo leste, de 000° a 360°. Comparar o azimute calculado do Sol com a marcação pela agulha dá o erro da agulha.',
    { en: 'azimuth', sin: ['Az'], ver: ['altura', 'marcacao', 'desvio-da-agulha'], fig: ['esfera', 'azimute'], widget: W_ESFERA });
  t('declinacao-do-astro', 'Declinação de um astro', 'astro', 'Distância angular do astro ao equador celeste, para norte ou para sul, como se fosse a latitude dele. O Almanaque Náutico dá o valor para cada hora. Não confunda com a declinação magnética.',
    { en: 'declination', ver: ['equador-celeste', 'angulo-horario', 'almanaque-nautico', 'declinacao-magnetica'], widget: W_ESFERA });
  t('angulo-horario', 'Ângulo horário', 'astro', 'Ângulo medido no equador celeste, para oeste, do meridiano de Greenwich (AHG) ou do meridiano do observador (AHL) até o meridiano do astro, de 0° a 360°. AHL = AHG + longitude leste, ou AHG − longitude oeste.',
    { en: 'hour angle (GHA, LHA)', sin: ['AHG', 'AHL'], ver: ['declinacao-do-astro', 'longitude', 'almanaque-nautico'], widget: W_ESFERA });
  t('passagem-meridiana', 'Passagem meridiana', 'astro', 'Momento em que o astro cruza o meridiano do observador e atinge a maior altura do dia. Com o Sol, permite achar a latitude de forma simples, a “meridiana” do meio-dia.',
    { en: 'meridian passage', sin: ['meridiana'], ver: ['latitude', 'altura', 'equacao-do-tempo', 'hora-legal'], widget: W_RETA });
  t('zenite', 'Zênite', 'astro', 'Ponto do céu exatamente acima do observador.',
    { en: 'zenith', ver: ['nadir', 'distancia-zenital', 'esfera-celeste'], fig: ['esfera', 'zenite'] });
  t('nadir', 'Nadir', 'astro', 'Ponto oposto ao zênite, exatamente abaixo do observador.',
    { en: 'nadir', ver: ['zenite', 'esfera-celeste'], fig: ['esfera', 'nadir'] });
  t('horizonte', 'Horizonte', 'astro', 'Linha em que o céu parece encontrar o mar. O horizonte visível fica um pouco abaixo do horizontal por causa da altura do olho do observador.',
    { en: 'horizon', ver: ['depressao-do-horizonte', 'altura', 'sextante'], fig: ['esfera', 'horizonte'] });
  t('depressao-do-horizonte', 'Depressão do horizonte', 'astro', 'Correção da altura do sextante pela altura do olho acima do mar: quanto mais alto o olho, mais o horizonte visível fica abaixo do horizontal.',
    { en: 'dip', ver: ['horizonte', 'altura', 'sextante'] });
  t('esfera-celeste', 'Esfera celeste', 'astro', 'Esfera imaginária, de raio infinito, centrada na Terra, onde parecem estar os astros. Tem polos, equador e meridianos, como a Terra.',
    { en: 'celestial sphere', ver: ['equador-celeste', 'polo-celeste', 'zenite', 'triangulo-de-posicao'], fig: ['esfera', 'nada'], widget: { w: 'esfera-celeste', opts: { vista: 'fora' }, rotulo: 'Abrir a esfera celeste em 3D' } });
  t('equador-celeste', 'Equador celeste', 'astro', 'Projeção do equador da Terra na esfera celeste. A declinação dos astros é medida a partir dele.',
    { en: 'celestial equator', ver: ['declinacao-do-astro', 'esfera-celeste', 'equador'], widget: W_ESFERA });
  t('polo-celeste', 'Polo celeste', 'astro', 'Cada um dos pontos da esfera celeste em volta dos quais o céu parece girar. A altura do polo celeste acima do horizonte é igual à latitude do observador.',
    { en: 'celestial pole', ver: ['cruzeiro-do-sul', 'latitude', 'esfera-celeste'], widget: W_ESFERA });
  t('almanaque-nautico', 'Almanaque Náutico', 'astro', 'Publicação anual da DHN com o AHG e a declinação do Sol, da Lua e dos planetas para cada hora do ano e, para as estrelas, a declinação, a ascensão reta versa e o AHG do Ponto Vernal, além das tábuas de correção das alturas.',
    { en: 'Nautical Almanac', ver: ['angulo-horario', 'declinacao-do-astro', 'navegacao-astronomica'], link: { txt: 'Almanaque Náutico (CHM)', url: URL.almanaque } });
  t('reta-de-altura', 'Reta de altura', 'astro', 'Linha de posição obtida pela altura de um astro. No método de Marcq Saint-Hilaire, compara-se a altura observada com a calculada para a posição estimada: a diferença (o intercepto) diz quantas milhas andar na direção do azimute para traçar a reta.',
    { en: 'position line (celestial line of position)', busca: ['Marcq Saint-Hilaire', 'intercepto'], ver: ['linha-de-posicao', 'altura', 'azimute', 'posicao-estimada'], widget: W_RETA });
  t('triangulo-de-posicao', 'Triângulo de posição', 'astro', 'Triângulo na esfera celeste com vértices no polo elevado, no zênite do observador e no astro. Resolvê-lo dá a altura e o azimute calculados.',
    { en: 'navigational triangle (PZX)', ver: ['reta-de-altura', 'esfera-celeste', 'zenite'], widget: W_ESFERA });
  t('posicao-geografica-do-astro', 'Posição geográfica do astro', 'astro', 'Ponto da Terra que tem o astro bem no zênite naquele instante. A latitude dele é a declinação do astro, e a longitude vem do AHG.',
    { en: 'geographical position (GP)', ver: ['declinacao-do-astro', 'angulo-horario', 'reta-de-altura'] });
  t('hora-legal', 'Hora legal', 'astro', 'Hora oficial do fuso em que se está. No mar, o comandante ajusta os relógios de bordo ao fuso da posição.',
    { en: 'zone time, standard time', ver: ['fuso-horario', 'hora-media-de-greenwich'] });
  t('fuso-horario', 'Fuso horário', 'astro', 'Faixa de 15° de longitude em que vale a mesma hora legal; cada fuso difere uma hora do vizinho. Em navegação, o fuso é dado pelo número de horas a somar à hora legal para ter a de Greenwich: o horário de Brasília é o fuso +3 (letra P).',
    { en: 'time zone (zone description)', ver: ['hora-legal', 'hora-media-de-greenwich', 'longitude'] });
  t('hora-media-de-greenwich', 'Hora Média de Greenwich', 'astro', 'Hora do meridiano de Greenwich, usada como referência na navegação astronômica e nas comunicações. Na prática, hoje se usa o UTC. Abreviatura HMG.',
    { en: 'Greenwich Mean Time (GMT); UTC', sin: ['HMG', 'GMT'], busca: ['UTC'], ver: ['fuso-horario', 'cronometro', 'angulo-horario'] });
  t('crepusculo-nautico', 'Crepúsculo náutico', 'astro', 'Período antes do nascer e depois do pôr do sol. Na definição da DHN, o da manhã começa quando o centro do Sol está 12° abaixo do horizonte e termina no nascer do Sol; o da tarde começa no pôr do Sol e termina aos 12°. O Almanaque Náutico tabula o início e o fim aos 12°, instantes em que o horizonte já está escuro demais para o sextante.',
    { en: 'nautical twilight', ver: ['sextante', 'horizonte'] });
  t('equacao-do-tempo', 'Equação do tempo', 'astro', 'Diferença entre o tempo solar verdadeiro e o tempo solar médio, que chega a cerca de 16 minutos ao longo do ano. É por isso que o Sol não passa no meridiano sempre ao meio-dia em ponto.',
    { en: 'equation of time', ver: ['passagem-meridiana', 'hora-legal'] });
  t('cronometro', 'Cronômetro', 'astro', 'Relógio de bordo muito preciso, acertado pela hora de Greenwich. É essencial na navegação astronômica: 4 segundos de erro na hora dão 1 minuto de erro na longitude.',
    { en: 'chronometer', ver: ['hora-media-de-greenwich', 'longitude', 'navegacao-astronomica'] });
  t('cruzeiro-do-sul', 'Cruzeiro do Sul', 'astro', 'Constelação do céu do sul usada para achar o polo sul celeste: prolongue o braço maior da cruz, de Gacrux para Acrux, cerca de 4,5 vezes o seu comprimento.',
    { en: 'Southern Cross (Crux)', ver: ['polo-celeste', 'latitude'] });

  /* ===================== Meteorologia e mar ===================== */
  var W_SINOT = { w: 'meteo-sinotica', opts: {}, rotulo: 'Abrir a carta sinótica interativa' };
  t('pressao-atmosferica', 'Pressão atmosférica', 'meteo', 'Peso do ar sobre a superfície, medido em hectopascais (hPa). O valor médio ao nível do mar é de cerca de 1013 hPa. Queda rápida da pressão anuncia mau tempo.',
    { en: 'atmospheric pressure', ver: ['barometro', 'isobara', 'baixa-pressao', 'alta-pressao'] });
  t('barometro', 'Barômetro', 'meteo', 'Instrumento que mede a pressão atmosférica. A bordo, mais importante que o valor é a tendência: uma queda de vários hectopascais em poucas horas indica vento forte chegando. Anote a pressão no diário de bordo.',
    { en: 'barometer', busca: ['barógrafo'], ver: ['pressao-atmosferica', 'baixa-pressao', 'frente-fria'] });
  t('isobara', 'Isóbara', 'meteo', 'Linha que liga pontos de mesma pressão na carta do tempo. Isóbaras próximas umas das outras indicam vento forte.',
    { en: 'isobar', ver: ['carta-sinotica', 'baixa-pressao', 'alta-pressao'], fig: ['pressao', 'baixa'], legenda: 'Isóbaras (linhas de mesma pressão, em hPa) em volta de um centro de baixa pressão no Hemisfério Sul.', nota: false, widget: W_SINOT });
  t('baixa-pressao', 'Baixa pressão', 'meteo', 'Área em que a pressão é menor que em volta, também chamada de ciclone ou depressão. Traz nuvens, chuva e vento. No Hemisfério Sul, o vento gira em volta dela no sentido dos ponteiros do relógio, entrando um pouco para o centro.',
    { en: 'low, depression, cyclone', sin: ['ciclone', 'depressão', 'centro de baixa'], ver: ['alta-pressao', 'ciclone-extratropical', 'lei-de-buys-ballot', 'forca-de-coriolis'], fig: ['pressao', 'baixa'], widget: W_SINOT });
  t('alta-pressao', 'Alta pressão', 'meteo', 'Área em que a pressão é maior que em volta, também chamada de anticiclone. Em geral traz tempo bom e vento fraco no centro. No Hemisfério Sul, o vento gira em volta dela no sentido anti-horário, saindo um pouco do centro.',
    { en: 'high, anticyclone', sin: ['anticiclone', 'centro de alta'], ver: ['baixa-pressao', 'asas', 'alisios'], fig: ['pressao', 'alta'], widget: W_SINOT });
  t('frente-fria', 'Frente fria', 'meteo', 'Borda de uma massa de ar frio que avança empurrando o ar quente, que sobe. No Sul e no Sudeste do Brasil, costuma chegar pelo sudoeste: antes dela, o vento ronda de nordeste para norte e noroeste e a pressão cai; na passagem, nuvens pesadas, chuva e rajadas; depois, vento de sul a sudoeste, frio e pressão subindo.',
    { en: 'cold front', ver: ['frente-quente', 'ciclone-extratropical', 'rondar', 'barometro'], fig: ['frente', 'fria'], legenda: 'A linha azul com triângulos é a frente fria; os triângulos apontam para onde ela avança.', nota: false, widget: W_SINOT });
  t('frente-quente', 'Frente quente', 'meteo', 'Borda de uma massa de ar quente que avança sobre o ar frio, subindo por cima dele. Traz nuvens em camadas e chuva fraca e contínua, com mudanças mais lentas que as de uma frente fria.',
    { en: 'warm front', ver: ['frente-fria', 'carta-sinotica'], fig: ['frente', 'quente'], legenda: 'A linha vermelha com semicírculos é a frente quente; os semicírculos apontam para onde ela avança, sobre o ar frio.', nota: false, widget: W_SINOT });
  t('ciclone-extratropical', 'Ciclone extratropical', 'meteo', 'Centro de baixa pressão que se forma fora dos trópicos, em geral ligado a frentes. No Sul e no Sudeste do Brasil, pode trazer vento muito forte e mar grosso. Acompanhe os avisos de mau tempo da Marinha.',
    { en: 'extratropical cyclone', ver: ['baixa-pressao', 'frente-fria', 'aviso-de-mau-tempo', 'ressaca'], widget: W_SINOT });
  t('ciclone-tropical', 'Ciclone tropical', 'meteo', 'Baixa pressão que se forma sobre mares quentes, sem frentes, com ventos muito fortes girando em volta de um olho. No Atlântico Norte, com vento médio de 64 nós ou mais, chama-se furacão; a temporada vai de junho a novembro. É raro no Atlântico Sul.',
    { en: 'tropical cyclone; hurricane', busca: ['furacão'], ver: ['baixa-pressao', 'pilot-charts', 'zcit'] });
  t('alisios', 'Alísios', 'meteo', 'Ventos constantes que sopram dos anticiclones subtropicais para o equador: de sudeste no Hemisfério Sul e de nordeste no Hemisfério Norte. São os ventos das travessias para o Caribe.',
    { en: 'trade winds', sin: ['ventos alísios'], ver: ['asas', 'zcit', 'pilot-charts'] });
  t('zcit', 'ZCIT', 'meteo', 'Zona de Convergência Intertropical: faixa perto do equador onde os alísios dos dois hemisférios se encontram. Tem calmarias, aguaceiros e trovoadas; os velejadores a chamam de doldrums. Muda de latitude ao longo do ano.',
    { en: 'ITCZ; doldrums', sin: ['Zona de Convergência Intertropical', 'doldrums'], ver: ['alisios', 'calmaria', 'cumulonimbo'] });
  t('asas', 'Alta Subtropical do Atlântico Sul', 'meteo', 'Grande anticiclone, quase fixo, sobre o Atlântico Sul. Gera o vento de nordeste comum no litoral do Sudeste e os alísios de leste e sudeste do Nordeste.',
    { en: 'South Atlantic Subtropical High', sin: ['ASAS', 'anticiclone do Atlântico Sul'], ver: ['alta-pressao', 'alisios', 'frente-fria'] });
  t('beaufort', 'Escala Beaufort', 'meteo', 'Escala de 0 a 12 que classifica a força do vento pela velocidade e pelo aspecto do mar. Força 4 (11 a 16 nós) é um bom vento para velejar; força 7 (28 a 33 nós) já é vento forte para um veleiro de cruzeiro.',
    { en: 'Beaufort scale', ver: ['rajada', 'calmaria', 'rizo', 'vento-real'], widget: { w: 'beaufort', opts: {}, rotulo: 'Abrir a escala Beaufort interativa' } });
  t('rajada', 'Rajada', 'meteo', 'Aumento brusco e passageiro da velocidade do vento, acima da média, que dura alguns segundos.',
    { en: 'gust', ver: ['borrasca', 'beaufort'] });
  t('calmaria', 'Calmaria', 'meteo', 'Ausência de vento: força 0 na escala Beaufort, menos de 1 nó.',
    { en: 'calm', ver: ['beaufort', 'zcit'] });
  t('borrasca', 'Borrasca', 'meteo', 'Vento forte e repentino que chega com uma nuvem pesada ou uma linha de chuva, dura de alguns minutos a cerca de meia hora e costuma mudar a direção do vento. Reduza o pano antes de ela chegar.',
    { en: 'squall', ver: ['rajada', 'cumulonimbo', 'reduzir-pano'] });
  t('cumulonimbo', 'Cumulonimbo', 'meteo', 'Nuvem de tempestade, muito alta, com topo em forma de bigorna. Traz trovoadas, raios, rajadas fortes e chuva intensa.',
    { en: 'cumulonimbus (Cb)', ver: ['borrasca', 'zcit'] });
  t('nevoeiro', 'Nevoeiro', 'meteo', 'Nuvem junto à superfície que reduz a visibilidade a menos de 1 km. No mar, o mais comum é o de advecção, quando ar quente e úmido passa sobre água mais fria. Use velocidade de segurança, radar e os sinais sonoros do RIPEAM.',
    { en: 'fog', ver: ['visibilidade-restrita', 'velocidade-de-seguranca', 'radar'] });
  t('marulho', 'Marulho', 'meteo', 'Ondas formadas longe dali, por ventos de outra região, que chegam regulares e longas, mesmo sem vento no local.',
    { en: 'swell', ver: ['vaga', 'onda', 'ressaca'] });
  t('vaga', 'Vaga', 'meteo', 'Ondas formadas pelo vento que sopra no local, mais curtas, irregulares e com cristas quebrando.',
    { en: 'wind sea, wind waves', ver: ['marulho', 'onda', 'pista'] });
  t('onda', 'Onda', 'meteo', 'Movimento da superfície do mar. A crista é o ponto mais alto; o cavado, o mais baixo; a altura é a distância vertical entre eles; o período, o tempo entre duas cristas passando no mesmo ponto.',
    { en: 'wave (crest, trough, height, period)', busca: ['crista', 'período'], ver: ['altura-significativa', 'marulho', 'vaga', 'cavado'], fig: ['ondas', 'nada'] });
  t('altura-significativa', 'Altura significativa', 'meteo', 'Média do terço mais alto das ondas. É o valor das previsões; ondas isoladas podem chegar a quase o dobro.',
    { en: 'significant wave height (Hs)', ver: ['onda', 'meteoromarinha'], fig: ['ondas', 'altura-de-onda'], legenda: 'A altura de cada onda vai do cavado à crista. A altura significativa é a média do terço mais alto das ondas.', nota: false });
  t('pista', 'Pista', 'meteo', 'Distância de mar aberto sobre a qual o vento sopra na mesma direção. Quanto maior a pista e mais tempo o vento sopra, maiores as ondas.',
    { en: 'fetch', ver: ['vaga', 'onda'] });
  t('ressaca', 'Ressaca', 'meteo', 'Agitação forte do mar junto à costa, com ondas grandes que avançam sobre as praias e quebram nas barras, em geral causada por ciclones e frentes frias distantes; a Marinha emite aviso de ressaca quando se esperam ondas de 2,5 m ou mais atingindo a costa. Barras e entradas de porto ficam perigosas.',
    { en: 'heavy swell, storm surf', ver: ['marulho', 'ciclone-extratropical', 'aviso-de-mau-tempo'] });
  t('brisa-maritima', 'Brisa marítima', 'meteo', 'Vento que sopra do mar para a terra durante o dia, quando a terra fica mais quente que a água. À noite pode surgir a brisa terrestre, no sentido contrário.',
    { en: 'sea breeze; land breeze', busca: ['brisa terrestre'], ver: ['vento-real'] });
  t('rondar', 'Rondar', 'meteo', 'Mudar de direção, falando do vento. Diz-se que o vento ronda pela direita (no sentido dos ponteiros do relógio, como de norte para leste) ou pela esquerda.',
    { en: 'veer (clockwise); back (anticlockwise)', ver: ['frente-fria', 'refrescar'] });
  t('refrescar', 'Refrescar', 'meteo', 'Aumentar de força, falando do vento.',
    { en: 'freshen, pick up', ver: ['rondar', 'reduzir-pano', 'beaufort'] });
  t('lei-de-buys-ballot', 'Lei de Buys-Ballot', 'meteo', 'Regra para achar o centro de baixa pressão: no Hemisfério Sul, de costas para o vento, a baixa fica à sua direita (no Hemisfério Norte, à esquerda).',
    { en: 'Buys Ballot’s law', ver: ['baixa-pressao', 'forca-de-coriolis'], fig: ['pressao', 'baixa'], legenda: 'No Hemisfério Sul, o vento gira no sentido horário em volta da baixa (B): de costas para o vento, ela fica à sua direita.', nota: false });
  t('forca-de-coriolis', 'Efeito de Coriolis', 'meteo', 'Efeito da rotação da Terra que desvia o vento e as correntes para a esquerda no Hemisfério Sul (para a direita no Norte). É por isso que o vento gira em volta das baixas e das altas.',
    { en: 'Coriolis effect', sin: ['força de Coriolis'], ver: ['baixa-pressao', 'alta-pressao', 'lei-de-buys-ballot'] });
  t('carta-sinotica', 'Carta sinótica', 'meteo', 'Mapa do tempo, numa hora, com a pressão (isóbaras), os centros de alta e de baixa e as frentes. A Marinha publica cartas sinóticas da área marítima do Brasil.',
    { en: 'synoptic chart, weather map', ver: ['isobara', 'frente-fria', 'baixa-pressao', 'grib'], widget: W_SINOT, link: { txt: 'Cartas sinóticas (CHM)', url: URL.sinoticas } });
  t('aviso-de-mau-tempo', 'Aviso de mau tempo', 'meteo', 'Aviso do Serviço Meteorológico Marinho, da Marinha, quando se esperam vento forte, mar agitado ou ressaca numa área. Consulte antes de sair e durante a viagem.',
    { en: 'gale warning, storm warning', ver: ['meteoromarinha', 'ciclone-extratropical', 'ressaca'], link: { txt: 'Avisos de mau tempo (CHM)', url: URL.mauTempo } });
  t('meteoromarinha', 'Meteoromarinha', 'meteo', 'Boletim de previsão do tempo para o mar, da Marinha do Brasil, com vento, ondas, visibilidade e avisos para as áreas da costa (área marítima METAREA V). É divulgado por rádio e no site do CHM.',
    { en: 'marine weather bulletin (METAREA V)', ver: ['aviso-de-mau-tempo', 'altura-significativa', 'navtex'], link: { txt: 'Previsão do tempo para o mar (CHM)', url: URL.meteoromarinha } });
  t('grib', 'GRIB', 'meteo', 'Formato de arquivo com previsões numéricas de vento, pressão e ondas, usado em travessias para planejar a rota. Mostra o resultado do modelo de computador, sem a análise de um meteorologista.',
    { en: 'GRIB file', ver: ['carta-sinotica', 'meteoromarinha', 'pilot-charts'] });
  t('pilot-charts', 'Cartas-piloto', 'meteo', 'Cartas com as médias mensais de vento, corrente, ondas e tempestades de cada oceano, feitas a partir de observações históricas. São a base para escolher a época e a rota de uma travessia. A DHN publica o Atlas de Cartas Piloto; as Pilot Charts dos EUA cobrem todos os oceanos.',
    { en: 'Pilot Charts', sin: ['Pilot Charts', 'Atlas de Cartas Piloto'], ver: ['alisios', 'ciclone-tropical', 'grib'], link: { txt: 'Pilot Charts (NGA, EUA)', url: URL.pilot } });

  /* ===================== Acrescentados em 2026-10-09 (termos do curso de Capitão-Amador) ===================== */
  t('hectopascal', 'Hectopascal', 'meteo', 'Unidade de pressão atmosférica usada nos boletins e nas cartas sinóticas. 1 hPa vale o mesmo que 1 milibar (mb): a Organização Meteorológica Mundial recomendou, a partir de 1982, passar do milibar para o hectopascal.',
    { en: 'hectopascal (hPa)', sin: ['hPa', 'milibar', 'mb'], ver: ['pressao-atmosferica', 'barometro', 'isobara'], fonte: [mig3('cap. 45, nota sobre mb e hPa, PDF p. 571'), nws('Hectopascal')] });
  t('umidade-relativa', 'Umidade relativa', 'meteo', 'Relação, em porcentagem, entre a quantidade de vapor d’água que há no ar e o máximo que ele pode conter àquela temperatura. Com 100% o ar está saturado. Como o ar frio contém menos vapor, a umidade relativa sobe quando o ar esfria, mesmo sem entrar vapor novo.',
    { en: 'relative humidity', ver: ['ponto-de-orvalho', 'psicrometro', 'nevoeiro'], fonte: [mig3('cap. 45, PDF p. 582'), nws('Relative Humidity')] });
  t('ponto-de-orvalho', 'Ponto de orvalho', 'meteo', 'Temperatura em que o ar, esfriando sem ganhar nem perder vapor d’água, chega à saturação. Se esfriar mais, o vapor começa a condensar (orvalho, nevoeiro, nuvem). Quanto mais perto o ponto de orvalho estiver da temperatura do ar, maior a chance de nevoeiro.',
    { en: 'dew point', ver: ['umidade-relativa', 'psicrometro', 'nevoeiro'], fonte: [mig3('cap. 45, PDF p. 582'), nws('Dew Point')] });
  t('psicrometro', 'Psicrômetro', 'meteo', 'Instrumento que mede a umidade do ar com dois termômetros iguais: um de bulbo seco e outro de bulbo úmido, envolto em gaze molhada, que esfria ao evaporar. Quanto maior a diferença entre as duas leituras, mais seco o ar; uma tabela converte a diferença em umidade relativa.',
    { en: 'psychrometer', ver: ['umidade-relativa', 'ponto-de-orvalho', 'barometro'], fonte: [mig3('cap. 45, PDF p. 583'), nws('Psychrometer')] });
  t('barograma', 'Barograma', 'meteo', 'Registro contínuo da pressão feito pelo barógrafo, que desenha a curva num papel preso a um tambor de relógio. Mostra com clareza a tendência barométrica (subindo, descendo ou estável), que importa mais para prever o tempo do que um valor isolado.',
    { en: 'barogram (barograph record)', ver: ['barometro', 'pressao-atmosferica', 'frente-fria'], fonte: [mig3('cap. 45, PDF p. 572'), nws('Barograph')] });
  t('massa-de-ar', 'Massa de ar', 'meteo', 'Grande volume de ar com temperatura e umidade quase uniformes na horizontal, que adquire essas características onde se forma (mar quente, continente frio…). As frentes marcam o encontro de massas de ar diferentes.',
    { en: 'air mass', ver: ['frente-fria', 'frente-quente', 'frente-oclusa'], fonte: [mig3('cap. 45, PDF p. 448 e seguintes'), nws('Air Mass')] });
  t('frente-oclusa', 'Frente oclusa', 'meteo', 'Frente formada quando uma frente fria alcança uma frente quente e uma das duas deixa de tocar o solo, subindo sobre a outra. Em geral está ligada a circulações ciclônicas (baixas).',
    { en: 'occluded front', sin: ['oclusão'], ver: ['frente-fria', 'frente-quente', 'ciclone-extratropical'], fonte: [mig3('cap. 45, PDF p. 625'), nws('Occluded Front')] });
  t('frente-estacionaria', 'Frente estacionária', 'meteo', 'Frente que quase não se desloca de uma carta sinótica para a seguinte: nem o ar frio nem o quente avança sobre o outro. No fim do ciclo de uma depressão extratropical, as frentes frias e quentes que sobraram costumam virar uma só frente estacionária.',
    { en: 'stationary front', ver: ['frente-fria', 'frente-quente', 'frente-oclusa', 'carta-sinotica'], fonte: [mig3('cap. 45, PDF p. 619'), nws('Quasi-stationary Front')] });
  t('linha-de-instabilidade', 'Linha de instabilidade', 'meteo', 'Linha de trovoadas (cumulonimbos) que se forma adiante de uma frente fria em avanço; a Marinha a classifica como trovoada pré-frontal. Quem navega perto dela deve esperar trovoadas, chuva forte e rajadas.',
    { en: 'squall line (pre-frontal)', sin: ['linha de tempestades'], ver: ['cumulonimbo', 'frente-fria', 'rajada', 'borrasca'], fonte: [mig3('cap. 45, PDF p. 629'), nws('Pre-Frontal Squall Line')] });
  t('oestes-predominantes', 'Oestes predominantes', 'meteo', 'Cinturão de ventos de oeste nas latitudes temperadas de cada hemisfério, do lado polar das altas subtropicais. No Hemisfério Sul os ventos sopram de noroeste ou de oeste. Nele, as depressões extratropicais se deslocam de oeste para leste.',
    { en: 'prevailing westerlies', sin: ['ventos de oeste', 'cinturão de vento do oeste'], ver: ['alisios', 'asas', 'ciclone-extratropical', 'forca-de-coriolis'], fonte: [mig3('cap. 45, PDF p. 568'), nws('Prevailing Westerlies')] });
  t('corrente-oceanica', 'Corrente oceânica', 'meteo', 'Movimento contínuo de grandes massas de água do oceano, movido pelo vento, pelas marés e pelas diferenças de temperatura e de salinidade da água. As correntes maiores e mais duradouras têm nome próprio, como a Corrente do Brasil. Não confunda com a corrente de maré, que muda de sentido com a maré.',
    { en: 'ocean current', sin: ['corrente marítima'], ver: ['giro', 'corrente-de-mare', 'forca-de-coriolis', 'pilot-charts'], fonte: { txt: 'NOAA, National Ocean Service: What is a gyre?', url: URL.noaaGiro, loc: 'frase “Wind, tides, and differences in temperature and salinity drive ocean currents”' } });
  t('giro', 'Giro oceânico', 'meteo', 'Grande sistema de correntes que gira em volta de uma bacia oceânica. Há cinco giros subtropicais principais: Pacífico Norte e Sul, Atlântico Norte e Sul, e Índico. No Hemisfério Sul o giro circula no sentido anti-horário.',
    { en: 'ocean gyre', sin: ['giro oceânico'], ver: ['corrente-oceanica', 'forca-de-coriolis', 'asas', 'pilot-charts'], fonte: { txt: 'NOAA, National Ocean Service: What is a gyre?', url: URL.noaaGiro, loc: 'os cinco giros subtropicais; o sentido segue a circulação dos ventos (Coriolis)' } });
  t('ressurgencia', 'Ressurgência', 'meteo', 'Subida de água fria, profunda e rica em nutrientes até a superfície, em geral quando o vento afasta a água superficial da costa. A temperatura da superfície do mar cai; o ar sobre ela esfria e pode surgir nevoeiro.',
    { en: 'upwelling', sin: ['afloramento'], ver: ['nevoeiro', 'corrente-oceanica', 'brisa-maritima'], fonte: [mig3('cap. 45, PDF p. 580'), { txt: 'NOAA, National Ocean Service: What is upwelling?', url: URL.noaaRessurgencia }] });
  t('nebulosidade', 'Nebulosidade', 'meteo', 'Quantidade do céu coberta por nuvens. Aumenta quando uma frente se aproxima e diminui depois da passagem da frente fria, junto com a queda da temperatura e da umidade relativa.',
    { en: 'cloud cover', sin: ['cobertura de nuvens'], ver: ['frente-fria', 'umidade-relativa', 'cumulonimbo'], fonte: mig3('cap. 45, sequência de uma frente fria nos mares austrais, PDF p. 451') });
  t('estado-do-mar', 'Estado do mar', 'meteo', 'Aspecto e agitação da superfície do mar num dado momento. Resultam do vento local, do marulho vindo de longe, das marés e correntes (vento contra a corrente levanta ondas maiores) e da chuva, que atenua o mar. Classifica-se pela escala Douglas, de 0 a 9.',
    { en: 'sea state', ver: ['escala-douglas', 'beaufort', 'marulho', 'altura-significativa'], fonte: mig3('cap. 45, itens a) a f), PDF p. 652') });
  t('escala-douglas', 'Escala Douglas', 'meteo', 'Escala de 0 a 9 que classifica o estado do mar, não o vento (quem classifica o vento é a escala Beaufort). Os graus 6, 7 e 8 valem para mar aberto; em águas rasas o grau não passa de 5, ou, em casos extremos, de 6 ou 7. O grau 9 é o mar desfeito, excepcional.',
    { en: 'Douglas sea scale', sin: ['escala do mar'], ver: ['estado-do-mar', 'beaufort', 'altura-significativa'], fonte: mig3('cap. 45, PDF p. 652 e 653, figura 45.67') });
  t('carneirinho', 'Carneirinho', 'meteo', 'Espuma branca das cristas que arrebentam, sinal de vento que levanta mar. A tabela Beaufort da DHN descreve “alguns carneiros” na força 3, “frequentes” na força 4 e “muitos” na força 5.',
    { en: 'whitecap', sin: ['carneiro', 'carneiros', 'carneirinhos'], ver: ['beaufort', 'onda', 'vaga', 'marulho'], fonte: mig3('cap. 45, tabela Beaufort, PDF p. 590') });
  t('isogonica', 'Linha isogônica', 'carta', 'Linha, traçada numa carta, que une pontos de mesma declinação magnética. Serve para achar a declinação da região onde se navega (a carta náutica traz a declinação na rosa, com a variação anual).',
    { en: 'isogonic line', sin: ['isógona'], ver: ['declinacao-magnetica', 'rosa-dos-ventos', 'rumo-magnetico'], fonte: [mig1('cap. 3, item 3.2.3, p. 3-6 (carta de isogônicas NOAA/NCEI)'), { txt: 'NOAA/NCEI, World Magnetic Model', url: URL.wmm }] });
  t('janela-meteorologica', 'Janela meteorológica', 'meteo', 'Intervalo de tempo bom, segundo as previsões, em que dá para sair ou fazer um trecho da viagem com segurança. Esperar a janela no porto é decisão de marinharia: a norma só manda o comandante conhecer as previsões antes de sair e ficar atento aos sinais de mau tempo.',
    { en: 'weather window', ver: ['meteoromarinha', 'carta-sinotica', 'aviso-de-mau-tempo', 'grib'], fonte: n211('art. 4.6.3, p. 4-3 (previsões antes de sair)') });
  t('cavado', 'Cavado', 'meteo', 'Região alongada de pressão relativamente baixa, em geral sem circulação fechada (por isso não é o mesmo que uma baixa). Nas cartas sinóticas aparece como uma dobra em “V” ou “U” nas isóbaras; um cavado pré-frontal costuma trazer mudança na direção do vento. Em ondas, “cavado” também é o ponto mais baixo da onda (ver Onda).',
    { en: 'trough', sin: ['cavado barométrico', 'cavado de pressão'], ver: ['isobara', 'baixa-pressao', 'carta-sinotica', 'frente-fria', 'onda'], fonte: [nws('Trough'), nws('Pre-Frontal Trough'), mig3('uso de “cavado circumpolar” nos mares antárticos, PDF p. 445')] });
