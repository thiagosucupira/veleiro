
  /* ===================== Manobra e mareação ===================== */
  t('barlavento', 'Barlavento', 'manobra', 'Lado de onde vem o vento. O bordo de barlavento de um barco é o que recebe o vento primeiro.',
    { en: 'windward', ver: ['sotavento', 'regra-dos-veleiros', 'orcar'], fig: ['barlavento', 'barlavento'] });
  t('sotavento', 'Sotavento', 'manobra', 'Lado para onde vai o vento. Uma costa a sotavento, para onde o vento empurra o barco, é perigosa com mau tempo.',
    { en: 'leeward', ver: ['barlavento', 'abatimento'], fig: ['barlavento', 'sotavento'] });
  t('amurado', 'Amurado', 'manobra', 'Diz o lado por onde o vento entra no barco. Amurado a boreste: vento entrando por boreste, retranca a bombordo. Amurado a bombordo: o contrário. Para o RIPEAM, o bordo de barlavento é o oposto ao lado em que está a vela grande.',
    { en: 'on starboard tack; on port tack', busca: ['amura', 'bordo de amura'], ver: ['regra-dos-veleiros', 'cambar', 'jaibe', 'punho-da-amura'], fig: ['manobra', 'cambar'], legenda: 'Com o vento de cima, o barco de baixo está amurado a bombordo (vento entrando por bombordo, retranca a boreste); depois de cambar, fica amurado a boreste.', nota: false, fonte: rip('Regra 12 b)') });
  t('orcar', 'Orçar', 'manobra', 'Mudar o rumo aproximando a proa da direção de onde vem o vento.',
    { en: 'luff up, head up', ver: ['arribar', 'bolina-cerrada', 'aproado'] });
  t('arribar', 'Arribar', 'manobra', 'Mudar o rumo afastando a proa da direção do vento.',
    { en: 'bear away, head down', ver: ['orcar', 'largo', 'vento-em-popa'] });
  t('cambar', 'Cambar', 'manobra', 'Mudar de bordo passando a proa pela linha do vento: quem estava amurado a bombordo fica amurado a boreste, ou o contrário. É a virada usada para avançar contra o vento.',
    { en: 'tack, go about', sin: ['virar por davante'], busca: ['cambada'], ver: ['jaibe', 'bordejar', 'amurado', 'aproado'], fig: ['manobra', 'cambar'], widget: { w: 'manobras', opts: { manobra: 'cambar' }, rotulo: 'Abrir o simulador de manobras' } });
  t('jaibe', 'Jaibe', 'manobra', 'Mudar de bordo passando a popa pela linha do vento. A retranca cruza o barco de uma vez: controle-a caçando a escota da grande antes e folgando depois. O jaibe sem querer, comum com vento de popa e mar, é perigoso.',
    { en: 'gybe, jibe', sin: ['virar em roda'], busca: ['jaibar', 'jibe'], ver: ['cambar', 'retranca', 'vento-em-popa'], fig: ['manobra', 'jaibe'], widget: { w: 'manobras', opts: { manobra: 'jaibe' }, rotulo: 'Abrir o simulador de manobras' } });
  t('bordejar', 'Bordejar', 'manobra', 'Avançar contra o vento em ziguezague, cambando de tempos em tempos, porque nenhum veleiro navega direto contra o vento.',
    { en: 'beat (to windward)', ver: ['cambar', 'bordo', 'zona-morta', 'bolina-cerrada'], fig: ['manobra', 'bordejar'] });
  t('bordo', 'Bordo', 'manobra', 'Cada lado do barco (bombordo ou boreste). Também é cada trecho navegado entre duas viradas, ao bordejar.',
    { en: 'side; tack (leg)', ver: ['bordejar', 'bombordo', 'boreste'] });
  t('pontos-de-vela', 'Pontos de vela', 'manobra', 'Nomes do rumo do barco em relação ao vento: bolina cerrada, bolina folgada, través, largo e popa. Cada um pede uma regulagem de velas.',
    { en: 'points of sail', sin: ['mareações'], ver: ['bolina-cerrada', 'bolina-folgada', 'vento-de-traves', 'largo', 'vento-em-popa', 'zona-morta'], fig: ['pontos', 'todos'], widget: { w: 'mareacao', opts: {}, rotulo: 'Abrir o simulador de mareação' } });
  t('zona-morta', 'Zona morta', 'manobra', 'Setor de cerca de 45° para cada lado da direção do vento em que um veleiro de cruzeiro não consegue navegar: as velas panejam e o barco perde o seguimento.',
    { en: 'no-go zone', sin: ['ângulo morto'], ver: ['bolina-cerrada', 'aproado', 'bordejar'], fig: ['pontos', 'zona-morta'] });
  t('bolina-cerrada', 'Bolina cerrada', 'manobra', 'Ponto de vela mais próximo do vento em que se consegue navegar, em geral a 40° ou 45° do vento real num veleiro de cruzeiro, com as velas bem caçadas.',
    { en: 'close-hauled', ver: ['bolina-folgada', 'zona-morta', 'orcar', 'bordejar'], fig: ['pontos', 'bolina-cerrada'] });
  t('bolina-folgada', 'Bolina folgada', 'manobra', 'Ponto de vela entre a bolina cerrada e o través, com o vento a uns 60° da proa e as velas um pouco folgadas.',
    { en: 'close reach', ver: ['bolina-cerrada', 'vento-de-traves'], fig: ['pontos', 'bolina-folgada'] });
  t('vento-de-traves', 'Través (ponto de vela)', 'manobra', 'Ponto de vela com o vento entrando a 90° da proa, pelo través. Costuma ser um dos rumos mais rápidos e confortáveis de um veleiro de cruzeiro.',
    { en: 'beam reach', sin: ['vento de través'], ver: ['traves', 'bolina-folgada', 'largo'], fig: ['pontos', 'traves'] });
  t('largo', 'Largo', 'manobra', 'Ponto de vela com o vento entrando entre o través e a popa (cerca de 135° da proa), com as velas bem folgadas.',
    { en: 'broad reach', sin: ['vento largo'], ver: ['vento-de-traves', 'vento-em-popa', 'balao'], fig: ['pontos', 'largo'] });
  t('vento-em-popa', 'Popa (ponto de vela)', 'manobra', 'Ponto de vela com o vento vindo por trás. As velas ficam todas abertas, e há risco de jaibe sem querer se o vento passar para o outro lado da vela grande.',
    { en: 'run, running', sin: ['vento em popa', 'popa rasa'], ver: ['jaibe', 'asa-de-pombo', 'largo'], fig: ['pontos', 'vento-em-popa'] });
  t('asa-de-pombo', 'Asa de pombo', 'manobra', 'Navegar com vento em popa levando a vela grande de um lado e a vela de proa do outro, muitas vezes aberta pelo pau de spinnaker.',
    { en: 'goose-winging, wing on wing', ver: ['vento-em-popa', 'pau-de-spinnaker'] });
  t('aproado', 'Aproado', 'manobra', 'Diz-se do barco com a proa na direção do vento: as velas panejam e ele perde o seguimento. Ficar aproado no meio de uma cambada é um erro comum de quem está começando.',
    { en: 'head to wind, in irons', busca: ['aproar'], ver: ['zona-morta', 'cambar', 'aquartelar'] });
  t('cacar', 'Caçar', 'manobra', 'Puxar um cabo, em especial a escota, fechando a vela.',
    { en: 'sheet in, trim, haul in', ver: ['folgar', 'escota', 'catraca', 'mareacao'] });
  t('folgar', 'Folgar', 'manobra', 'Soltar aos poucos um cabo, em especial a escota, abrindo a vela.',
    { en: 'ease (out)', ver: ['cacar', 'escota', 'solecar'] });
  t('mareacao', 'Mareação', 'manobra', 'Ajuste das velas ao vento e ao rumo, caçando e folgando escotas e outros cabos. Marear bem é deixar as velas no ponto em que dão mais força sem panejar.',
    { en: 'sail trim', busca: ['marear'], ver: ['cacar', 'folgar', 'pontos-de-vela', 'biruta', 'bolsa-da-vela'], widget: { w: 'mareacao', opts: {}, rotulo: 'Abrir o simulador de mareação' } });
  t('aquartelar', 'Aquartelar', 'manobra', 'Deixar a vela de proa do lado de barlavento, cheia de vento ao contrário. Usa-se para ajudar a proa a cair durante a cambada e para capear.',
    { en: 'back (a sail)', ver: ['capear', 'cambar', 'aproado'] });
  t('capear', 'Capear', 'manobra', 'Manobra de mau tempo para quase parar o barco: com a vela de proa aquartelada, a grande folgada ou rizada e o leme preso na posição de orçar, o barco fica com a proa chegada ao vento e ao mar, com o vento à frente do través, quase parado e derivando devagar. Dá descanso à tripulação e tempo para resolver problemas.',
    { en: 'heave to', sin: ['pôr-se à capa', 'capa'], ver: ['aquartelar', 'tormentim', 'ancora-flutuante'] });
  t('fundear', 'Fundear', 'manobra', 'Lançar a âncora para manter o barco parado num lugar. Escolha um fundo que segure bem (areia, lama), abrigado do vento e com espaço para o barco girar em volta da âncora.',
    { en: 'anchor', ver: ['ancora', 'filame', 'garrar', 'unhar', 'suspender', 'luz-de-fundeio'], fig: ['fundeio', 'fundear'] });
  t('suspender', 'Suspender', 'manobra', 'Recolher a âncora para sair. Na linguagem da Marinha, suspender é também sair do porto ou do fundeadouro.',
    { en: 'weigh anchor; get under way', ver: ['fundear', 'molinete'] });
  t('filame', 'Filame', 'manobra', 'Comprimento de amarra ou de cabo que está fora, entre a proa e a âncora. Regra prática da Marinha: de 5 a 7 vezes a profundidade do local; o valor depende também do tipo de fundo.',
    { en: 'scope', ver: ['amarra', 'fundear', 'garrar', 'preamar'], fig: ['fundeio', 'filame'] });
  t('garrar', 'Garrar', 'manobra', 'Diz-se da âncora que se arrasta pelo fundo, deixando o barco ir embora. Depois de fundear, confira marcações de pontos de terra ou ligue o alarme de fundeio do GNSS.',
    { en: 'drag (anchor)', ver: ['unhar', 'fundear', 'filame', 'marcacao'], fig: ['fundeio', 'garrar'] });
  t('unhar', 'Unhar', 'manobra', 'Diz-se da âncora quando se enterra no fundo e segura o barco. Confirma-se dando máquinas a ré devagar, com o filame já largado.',
    { en: '(anchor) set, bite', ver: ['garrar', 'fundear', 'ancora'] });
  t('atracar', 'Atracar', 'manobra', 'Encostar a embarcação a um cais, a um píer ou a outra embarcação e prendê-la com cabos.',
    { en: 'berth, come alongside', ver: ['desatracar', 'espringue', 'lancante', 'defensa', 'amarrar'], fig: ['amarracao', 'nada'] });
  t('desatracar', 'Desatracar', 'manobra', 'Soltar os cabos e afastar a embarcação do cais. Um espringue bem usado ajuda a afastar a proa ou a popa.',
    { en: 'cast off, leave the berth', ver: ['atracar', 'espringue', 'largar'] });
  t('amarrar', 'Amarrar', 'manobra', 'Prender a embarcação com cabos a um cais, a uma boia de poita ou a outra embarcação.',
    { en: 'moor, make fast', ver: ['atracar', 'poita', 'espia'] });
  t('poita', 'Poita', 'manobra', 'Peso no fundo (bloco de concreto, âncora pesada ou corrente), ligado por corrente a uma boia na superfície, em que o barco fica amarrado.',
    { en: 'mooring (buoy)', ver: ['amarrar', 'croque', 'fundear'] });
  t('espringue', 'Espringue', 'manobra', 'Cabo de amarração que trabalha na diagonal, ao longo do costado: sai da proa e vai para ré, ou sai da popa e vai para vante. Impede o barco de andar para frente e para trás junto ao cais.',
    { en: 'spring (line)', ver: ['lancante', 'atracar', 'defensa'], fig: ['amarracao', 'espringue'] });
  t('lancante', 'Lançante', 'manobra', 'Cabo de amarração que prende o barco ao cais: o lançante de proa (a espia nº 1, na numeração da Marinha) sai da proa e o lançante de popa sai da popa.',
    { en: 'bow line; stern line', ver: ['espringue', 'atracar', 'espia'], fig: ['amarracao', 'lancante'] });
  t('defensa', 'Defensa', 'manobra', 'Almofada, em geral de plástico inflado, pendurada no costado para proteger o casco do cais ou de outro barco. Costuma ser presa ao balaústre com uma volta do fiel.',
    { en: 'fender', ver: ['atracar', 'volta-do-fiel', 'balaustre'], fig: ['amarracao', 'defensa'], widget: { w: 'nos', opts: { no: 'volta-do-fiel' }, rotulo: 'Ver a volta do fiel' } });
  t('croque', 'Croque', 'manobra', 'Vara com gancho na ponta, usada para pegar cabos e a boia da poita ou para afastar o barco.',
    { en: 'boathook', ver: ['poita', 'atracar'] });
  t('abatimento', 'Abatimento', 'manobra', 'Deslocamento lateral do barco para sotavento, causado pelo vento. O caminho do barco na água fica alguns graus a sotavento da proa, principalmente em bolina e com mar. Na navegação estimada da Marinha, é o ângulo entre o rumo na superfície e o rumo no fundo.',
    { en: 'leeway', ver: ['deriva', 'quilha', 'sotavento', 'rumo-no-fundo'], fig: ['abatimento', 'abatimento'] });
  t('deriva', 'Deriva', 'manobra', 'Deslocamento do barco causado pela corrente. Diz-se também que um barco sem motor e sem vela, levado pelo vento e pela corrente, está <em>à deriva</em>.',
    { en: 'drift', ver: ['corrente', 'abatimento', 'rumo-no-fundo'] });
  t('seguimento', 'Seguimento', 'manobra', 'Movimento do barco pela água, para vante ou para ré. Sem seguimento, o leme não atua e o barco não obedece.',
    { en: 'way (headway, sternway)', ver: ['leme', 'aproado', 'em-movimento'] });
  t('guinar', 'Guinar', 'manobra', 'Mudar o rumo, em geral de forma rápida ou com um ângulo grande.',
    { en: 'alter course, turn', busca: ['guinada'], ver: ['governar', 'sinais-sonoros'] });
  t('governar', 'Governar', 'manobra', 'Manter o barco no rumo desejado usando o leme.',
    { en: 'steer', ver: ['timoneiro', 'leme', 'piloto-automatico'] });
  t('timoneiro', 'Timoneiro', 'manobra', 'Quem está no leme governando o barco.',
    { en: 'helmsman, helm', ver: ['governar', 'roda-de-leme', 'cana-do-leme'] });
  t('vento-real', 'Vento real', 'manobra', 'Vento que sopra de fato, sentido por quem está parado. É o vento das previsões do tempo e o que define os pontos de vela.',
    { en: 'true wind', sin: ['vento verdadeiro'], ver: ['vento-aparente', 'pontos-de-vela', 'beaufort'], fig: ['vento', 'vento-real'] });
  t('vento-aparente', 'Vento aparente', 'manobra', 'Vento que se sente a bordo com o barco andando: a soma do vento real com o vento criado pelo movimento do barco. É por ele que se regulam as velas.',
    { en: 'apparent wind', ver: ['vento-real', 'biruta', 'mareacao'], fig: ['vento', 'vento-aparente'] });
  t('reduzir-pano', 'Reduzir o pano', 'manobra', 'Diminuir a área de vela, rizando a grande ou enrolando a vela de proa, quando o vento aumenta ou antes de anoitecer no mar.',
    { en: 'shorten sail, reduce sail', ver: ['rizo', 'enrolador', 'tormentim', 'borrasca'] });
  t('icar', 'Içar', 'manobra', 'Subir uma vela, uma bandeira ou um peso com um cabo. O contrário é <em>arriar</em>.',
    { en: 'hoist', busca: ['arriar'], ver: ['adrica', 'vela-grande'] });
  t('largar', 'Largar', 'manobra', 'Soltar de vez um cabo; também quer dizer sair do cais ou da poita.',
    { en: 'let go; cast off', ver: ['desatracar', 'folgar'] });

  /* ===================== Cabos, nós e âncoras ===================== */
  t('cabo', 'Cabo', 'marinharia', 'Nome de toda “corda” a bordo. Pode ser de fibra sintética, natural ou de aço, e cada um recebe o nome da sua função: adriça, escota, espia, amarra.',
    { en: 'rope, line', ver: ['chicote', 'seio', 'firme', 'no'] });
  t('chicote', 'Chicote', 'marinharia', 'Ponta de um cabo.',
    { en: 'end (of a rope)', ver: ['seio', 'firme', 'falcaca'] });
  t('seio', 'Seio', 'marinharia', 'Parte curva de um cabo, entre as pontas, em forma de U. Muitos nós podem ser dados “pelo seio”, sem usar o chicote.',
    { en: 'bight', ver: ['chicote', 'firme', 'patesca'] });
  t('firme', 'Firme', 'marinharia', 'Parte de um cabo que fica parada, presa ou sob tensão, oposta ao chicote que trabalha no nó.',
    { en: 'standing part', ver: ['chicote', 'seio'] });
  t('alca', 'Alça', 'marinharia', 'Laço formado por um cabo, fixo (como no lais de guia) ou feito por costura.',
    { en: 'loop, eye', ver: ['lais-de-guia', 'costura', 'sapatilho'] });
  t('volta', 'Volta', 'marinharia', 'Passagem completa de um cabo em torno de um objeto ou de outro cabo. Também é o nome de vários nós que prendem um cabo a um objeto, como a volta do fiel.',
    { en: 'turn; hitch', ver: ['volta-do-fiel', 'volta-redonda-e-dois-cotes', 'cote'] });
  t('no', 'Nó', 'marinharia', 'Entrelaçamento de um cabo para fazer uma alça, unir dois cabos ou impedir que o chicote escape. Bom nó de bordo é fácil de dar, seguro sob carga e fácil de desfazer depois. (Para a unidade de velocidade, veja <em>nó (velocidade)</em>.)',
    { en: 'knot', ver: ['lais-de-guia', 'no-de-oito', 'no-direito', 'no-de-escota', 'volta-do-fiel', 'no-velocidade'], widget: { w: 'nos', opts: {}, rotulo: 'Abrir os nós animados' } });
  t('lais-de-guia', 'Lais de guia', 'marinharia', 'Nó que forma uma alça fixa, que não corre nem aperta e é fácil de desfazer mesmo depois de muita carga. É o nó mais usado a bordo: prende a escota na vela, faz uma alça de amarração e pode ser passado em volta do peito de quem precisa ser içado.',
    { en: 'bowline', ver: ['no', 'alca', 'no-de-escota'], widget: { w: 'nos', opts: { no: 'lais-de-guia' }, rotulo: 'Ver o lais de guia passo a passo' } });
  t('no-de-oito', 'Nó de oito', 'marinharia', 'Nó de batente dado no chicote das escotas e das adriças para que não escapem das ferragens e dos moitões.',
    { en: 'figure-eight knot', ver: ['no', 'escota', 'moitao'], widget: { w: 'nos', opts: { no: 'no-de-oito' }, rotulo: 'Ver o nó de oito passo a passo' } });
  t('no-direito', 'Nó direito', 'marinharia', 'Nó que une os dois chicotes do mesmo cabo, usado para amarrar a parte rizada da vela. Não serve para unir cabos de grossuras diferentes nem sob carga forte. Se sair torto (nó de vaca), escorrega.',
    { en: 'reef knot, square knot', ver: ['rizo', 'no-de-escota'], widget: { w: 'nos', opts: { no: 'no-direito' }, rotulo: 'Ver o nó direito passo a passo' } });
  t('volta-do-fiel', 'Volta do fiel', 'marinharia', 'Volta rápida para prender um cabo a um balaústre, a um pau ou a uma argola, como a das defensas. Pode correr se a carga variar; reforce com um cote.',
    { en: 'clove hitch', ver: ['defensa', 'cote', 'volta'], widget: { w: 'nos', opts: { no: 'volta-do-fiel' }, rotulo: 'Ver a volta do fiel passo a passo' } });
  t('volta-redonda-e-dois-cotes', 'Volta redonda e dois cotes', 'marinharia', 'Volta completa em torno de uma argola ou de um pau seguida de dois cotes. Segura bem cargas fortes, mas pode recorrer: se o esforço for grande, abotoe o chicote.',
    { en: 'round turn and two half hitches', ver: ['cote', 'volta', 'amarrar'], widget: { w: 'nos', opts: { no: 'volta-redonda-e-dois-cotes' }, rotulo: 'Ver a volta redonda passo a passo' } });
  t('no-de-escota', 'Nó de escota', 'marinharia', 'Nó para unir dois cabos, mesmo de grossuras diferentes, ou prender um cabo a uma alça. Dobrado, com uma volta a mais, fica mais seguro.',
    { en: 'sheet bend', ver: ['no-direito', 'lais-de-guia', 'escota'], widget: { w: 'nos', opts: { no: 'no-de-escota' }, rotulo: 'Ver o nó de escota passo a passo' } });
  t('volta-de-cunho', 'Volta de cunho', 'marinharia', 'Modo de prender um cabo no cunho: uma volta na base, voltas em oito pelos braços e, no fim, uma volta virada por baixo que trava o cabo.',
    { en: 'cleat hitch', ver: ['cunho', 'amarrar'], widget: { w: 'nos', opts: { no: 'volta-de-cunho' }, rotulo: 'Ver a volta de cunho passo a passo' } });
  t('cote', 'Cote', 'marinharia', 'Volta singela em que uma parte do cabo morde a outra, em geral dada com o chicote. Quase nunca se usa só: serve para rematar outras voltas, como na volta redonda e dois cotes.',
    { en: 'half hitch', ver: ['volta-redonda-e-dois-cotes', 'volta-do-fiel'] });
  t('falcaca', 'Falcaça', 'marinharia', 'Acabamento feito com linha, fita ou calor (nos cabos sintéticos) no chicote, para ele não se desfazer.',
    { en: 'whipping', ver: ['chicote', 'costura'] });
  t('costura', 'Costura', 'marinharia', 'Emenda ou alça feita entrelaçando os cordões do próprio cabo, sem nó. Mantém mais da resistência do cabo do que um nó.',
    { en: 'splice', ver: ['alca', 'sapatilho', 'falcaca'] });
  t('aduchar', 'Aduchar', 'marinharia', 'Enrolar um cabo em voltas regulares, formando uma aducha, para guardá-lo arrumado e pronto para correr sem enroscar.',
    { en: 'coil', busca: ['aducha'], ver: ['cabo', 'retinida'] });
  t('tesar', 'Tesar', 'marinharia', 'Esticar um cabo, deixando-o firme. O contrário é <em>solecar</em>, dar folga.',
    { en: 'tension, haul taut', ver: ['solecar', 'cacar'] });
  t('solecar', 'Solecar', 'marinharia', 'Dar folga num cabo que estava teso.',
    { en: 'slack, ease', ver: ['tesar', 'folgar'] });
  t('bitola', 'Bitola', 'marinharia', 'Medida da grossura de um cabo. Nos cabos sintéticos de hoje, dá-se em geral pelo diâmetro em milímetros (nos de fibra natural, era comum a circunferência).',
    { en: 'size, diameter', ver: ['cabo'] });
  t('ancora', 'Âncora', 'marinharia', 'Peça pesada que, lançada ao fundo e ligada ao barco pela amarra, enterra-se e segura a embarcação. Há vários tipos, como as de arado e as de garras; cada uma segura melhor em certos fundos.',
    { en: 'anchor', sin: ['ferro'], ver: ['amarra', 'fundear', 'unhar', 'garrar', 'arinque', 'molinete'], fig: ['fundeio', 'ancora'] });
  t('amarra', 'Amarra', 'marinharia', 'Corrente, ou cabo, que liga a âncora ao barco. A corrente pesa, fica deitada no fundo e ajuda a âncora a segurar.',
    { en: 'anchor chain, rode', ver: ['ancora', 'filame', 'molinete', 'paiol-da-amarra'], fig: ['fundeio', 'amarra'] });
  t('arinque', 'Arinque', 'marinharia', 'Cabo fino com uma boia na ponta, preso à âncora. Marca onde ela está, mesmo se a âncora se perder, e pode ajudar a soltá-la se ficar presa em pedras.',
    { en: 'tripping line (with anchor buoy)', ver: ['ancora', 'fundear'] });
  t('espia', 'Espia', 'marinharia', 'Cabo grosso usado para amarrar o barco ao cais ou a outro barco.',
    { en: 'mooring line, warp', ver: ['lancante', 'espringue', 'cabeco', 'retinida'] });
  t('retinida', 'Retinida', 'marinharia', 'Cabo fino e leve, às vezes com um peso na ponta, que se arremessa para passar uma espia a outro barco ou ao cais. Também é o cabo flutuante amarrado à boia salva-vidas.',
    { en: 'heaving line', ver: ['espia', 'boia-circular'] });
