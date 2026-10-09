
  /* ===================== Casco e embarcação ===================== */
  t('proa', 'Proa', 'casco', 'Parte da frente da embarcação. Também indica direção: <em>pela proa</em> quer dizer à frente do barco.',
    { en: 'bow', ver: ['popa', 'bochecha', 'roda-de-proa', 'avante'], fig: ['barco', 'proa'] });
  t('popa', 'Popa', 'casco', 'Parte de trás da embarcação. <em>Pela popa</em> quer dizer atrás do barco.',
    { en: 'stern', ver: ['proa', 'alheta', 'espelho-de-popa', 'a-re'], fig: ['barco', 'popa'] });
  t('bombordo', 'Bombordo', 'casco', 'Lado esquerdo da embarcação para quem está a bordo olhando para a proa. Abreviatura BB. À noite, esse lado é marcado pela luz vermelha.',
    { en: 'port', ver: ['boreste', 'luzes-de-bordos', 'traves'], fig: ['direcoes', 'bombordo'], widget: { w: 'ripeam-luzes', opts: { tipo: 'vela', aspecto: 270 }, rotulo: 'Ver as luzes de bordos' } });
  t('boreste', 'Boreste', 'casco', 'Lado direito da embarcação para quem está a bordo olhando para a proa. Abreviatura BE. À noite, esse lado é marcado pela luz verde. <em>Estibordo</em> é a forma usada em Portugal; no Brasil se diz boreste, que não se confunde com bombordo nas ordens de voz.',
    { en: 'starboard', sin: ['estibordo'], ver: ['bombordo', 'luzes-de-bordos', 'traves'], fig: ['direcoes', 'boreste'], widget: { w: 'ripeam-luzes', opts: { tipo: 'vela', aspecto: 90 }, rotulo: 'Ver as luzes de bordos' } });
  t('traves', 'Través', 'casco', 'Direção perpendicular à linha de proa e popa, a 90° da proa, por boreste ou por bombordo. Um farol <em>pelo través de boreste</em> está bem ao lado direito do barco.',
    { en: 'abeam (on the beam)', ver: ['bochecha', 'alheta', 'vento-de-traves', 'marcacao-relativa'], fig: ['direcoes', 'traves'] });
  t('bochecha', 'Bochecha', 'casco', 'Direção a meio caminho entre a proa e o través (45° da proa, de cada bordo). Também é a região do casco junto à proa, de cada lado.',
    { en: 'bow (on the port or starboard bow)', ver: ['proa', 'traves', 'alheta'], fig: ['direcoes', 'bochecha'] });
  t('alheta', 'Alheta', 'casco', 'Direção a meio caminho entre o través e a popa (135° da proa, de cada bordo). Também é a região do casco junto à popa, de cada lado.',
    { en: 'quarter', ver: ['popa', 'traves', 'bochecha'], fig: ['direcoes', 'alheta'] });
  t('meia-nau', 'Meia-nau', 'casco', 'Região central do casco, a meio caminho entre a proa e a popa. Também quer dizer na linha de centro, como na ordem <em>leme a meia-nau</em> (leme reto).',
    { en: 'amidships', sin: ['meio-navio'], ver: ['linha-de-centro', 'leme'] });
  t('linha-de-centro', 'Linha de centro', 'casco', 'Linha longitudinal (o eixo do barco) que corre de proa a popa pelo meio do casco e o divide em duas metades iguais, uma de cada bordo.',
    { en: 'centreline', sin: ['plano diametral', 'linha de proa e popa'], ver: ['meia-nau', 'bombordo', 'boreste'] });
  t('avante', 'Avante', 'casco', 'Para o lado da proa, ou à frente de um ponto do barco: o mastro fica a vante do cockpit. O oposto é <em>a ré</em>.',
    { en: 'forward, ahead', sin: ['a vante', 'de vante'], ver: ['a-re', 'proa'] });
  t('a-re', 'A ré', 'casco', 'Para o lado da popa, ou atrás de um ponto do barco. <em>Dar máquinas a ré</em> é usar o motor para andar para trás.',
    { en: 'aft, astern', sin: ['de ré'], ver: ['avante', 'popa'] });
  t('casco', 'Casco', 'casco', 'Corpo da embarcação, sem a mastreação e os equipamentos. É ele que flutua e dá forma ao barco.',
    { en: 'hull', ver: ['costado', 'obras-vivas', 'obras-mortas', 'quilha', 'monocasco'] });
  t('costado', 'Costado', 'casco', 'Cada um dos lados do casco, de bombordo e de boreste, principalmente a parte que fica acima da água.',
    { en: 'side, topsides', ver: ['casco', 'obras-mortas', 'borda'], fig: ['barco', 'costado'] });
  t('obras-vivas', 'Obras vivas', 'casco', 'Parte do casco que fica abaixo da linha d’água, sempre molhada. Também chamada de carena. É onde se aplica a tinta anti-incrustante.',
    { en: 'underwater body, bottom', sin: ['carena'], ver: ['obras-mortas', 'linha-dagua', 'calado'], fig: ['barco', 'obras-vivas'] });
  t('obras-mortas', 'Obras mortas', 'casco', 'Parte do casco acima da linha d’água, até a borda.',
    { en: 'topsides, upperworks', ver: ['obras-vivas', 'borda-livre', 'costado'], fig: ['barco', 'obras-mortas'] });
  t('linha-dagua', 'Linha d’água', 'casco', 'Linha em que a superfície da água encontra o casco. Separa as obras vivas das obras mortas e sobe quando o barco é carregado.',
    { en: 'waterline', sin: ['linha de flutuação'], ver: ['obras-vivas', 'obras-mortas', 'calado', 'borda-livre'], fig: ['dimensoes', 'linha-dagua'] });
  t('borda-livre', 'Borda livre', 'casco', 'Distância vertical da linha d’água até o convés, medida no costado. Quanto maior, mais difícil é a água do mar entrar no convés.',
    { en: 'freeboard', ver: ['linha-dagua', 'pontal', 'calado'], fig: ['dimensoes', 'borda-livre'] });
  t('calado', 'Calado', 'casco', 'Distância vertical da linha d’água até o ponto mais fundo do barco (em geral, a quilha). É a profundidade mínima de água para flutuar sem tocar o fundo. Num veleiro de cruzeiro de 32 pés (≈ 9,75 m), por exemplo, o calado costuma ficar entre 1,4 e 2 m; barcos maiores calam mais.',
    { en: 'draught (draft)', ver: ['quilha', 'sondagem', 'ecobatimetro', 'restrita-pelo-calado'], fig: ['dimensoes', 'calado'] });
  t('pontal', 'Pontal', 'casco', 'Altura do casco medida a meia-nau, do fundo (face de cima da quilha) até o convés.',
    { en: 'depth (moulded depth)', ver: ['calado', 'borda-livre', 'boca'], fig: ['dimensoes', 'pontal'] });
  t('boca', 'Boca', 'casco', 'Maior largura do casco.',
    { en: 'beam', sin: ['boca máxima'], ver: ['comprimento', 'pontal', 'calado'], fig: ['dimensoes', 'boca'] });
  t('comprimento', 'Comprimento', 'casco', 'Para a NORMAM-211, o comprimento da embarcação é “a distância horizontal entre os pontos extremos da proa a popa”, sem contar plataformas de mergulho, gurupés e apêndices parecidos. O comprimento na linha d’água é menor e é o que limita a velocidade de casco.',
    { en: 'length overall (LOA)', sin: ['comprimento total'], ver: ['pe', 'velocidade-de-casco', 'embarcacao-de-medio-porte', 'gurupes'], fig: ['dimensoes', 'comprimento'], fonte: n211('Glossário, p. VI') });
  t('pe', 'Pé (unidade)', 'casco', 'Unidade de comprimento usada para barcos: 1 pé = 0,3048 m. Por exemplo, um veleiro de 32 pés tem cerca de 9,75 m.',
    { en: 'foot (ft)', sin: ['pés'], ver: ['comprimento', 'embarcacao-de-medio-porte'] });
  t('quilha', 'Quilha', 'casco', 'Peça estrutural que corre pelo fundo do casco, de proa a popa. Nos veleiros, chama-se também quilha o apêndice fixo e pesado sob o casco: o lastro baixa o centro de gravidade e devolve o barco à posição normal, e a forma de lâmina reduz o abatimento.',
    { en: 'keel', ver: ['lastro', 'bolina', 'abatimento', 'calado', 'monocasco'], fig: ['barco', 'quilha'] });
  t('bolina', 'Bolina (prancha)', 'casco', 'Prancha móvel que desce por uma caixa no fundo de barcos pequenos, como o Optimist e o Laser, para reduzir o abatimento; sobe para navegar em águas rasas. Também é o nome dos pontos de vela em que se navega contra o vento (bolina cerrada e folgada).',
    { en: 'centreboard, daggerboard', ver: ['quilha', 'abatimento', 'bolina-cerrada'] });
  t('lastro', 'Lastro', 'casco', 'Peso colocado na parte baixa do barco, em geral chumbo ou ferro na quilha, para dar estabilidade e contrabalançar a força do vento nas velas.',
    { en: 'ballast', ver: ['quilha', 'estabilidade', 'banda'] });
  t('leme', 'Leme', 'casco', 'Lâmina móvel na popa, dentro da água, que faz o barco mudar de direção quando a água passa por ela. Só funciona com o barco em movimento pela água (com seguimento).',
    { en: 'rudder', ver: ['cana-do-leme', 'roda-de-leme', 'madre-do-leme', 'seguimento', 'governar'], fig: ['barco', 'leme'] });
  t('madre-do-leme', 'Madre do leme', 'casco', 'Eixo que liga a lâmina do leme ao sistema de governo (cana ou roda), atravessando o casco.',
    { en: 'rudder stock', ver: ['leme', 'cana-do-leme', 'roda-de-leme'] });
  t('cana-do-leme', 'Cana do leme', 'casco', 'Alavanca presa no alto da madre do leme. Para guinar, empurra-se a cana para o lado contrário ao que se quer ir: cana para bombordo, proa para boreste.',
    { en: 'tiller', ver: ['leme', 'roda-de-leme', 'governar'] });
  t('roda-de-leme', 'Roda de leme', 'casco', 'Roda que movimenta o leme por cabos ou por transmissão mecânica ou hidráulica. Funciona como o volante de um carro: gira-se para o lado em que se quer guinar. Também chamada de timão.',
    { en: 'wheel (steering wheel)', sin: ['timão', 'roda do leme'], ver: ['leme', 'cana-do-leme', 'malagueta', 'timoneiro'] });
  t('conves', 'Convés', 'casco', 'Piso de cima do casco, que fecha o barco por cima e onde se caminha a bordo.',
    { en: 'deck', ver: ['borda-livre', 'casaria', 'cockpit', 'linha-de-vida'], fig: ['barco', 'conves'] });
  t('cockpit', 'Cockpit', 'casco', 'Área rebaixada no convés, em geral a ré, onde ficam o timoneiro e a tripulação e de onde se manobram as velas. Num barco de mar, tem drenos que esvaziam sozinhos a água que entra.',
    { en: 'cockpit', sin: ['poço'], ver: ['conves', 'gaiuta', 'roda-de-leme'], fig: ['barco', 'cockpit'] });
  t('casaria', 'Casaria', 'casco', 'Parte da cabine que se eleva acima do convés, com as vigias. Dá altura por dentro e apoio para ferragens por fora.',
    { en: 'coachroof, deckhouse', sin: ['superestrutura', 'cabine'], ver: ['vigia', 'gaiuta', 'conves'], fig: ['barco', 'casaria'] });
  t('gaiuta', 'Gaiúta', 'casco', 'Tampa ou pequena cobertura sobre uma abertura no convés, que dá luz, ar ou acesso ao interior. Nos veleiros de cruzeiro, chama-se assim a entrada da cabine com tampa de correr e também as escotilhas de acrílico do convés.',
    { en: 'hatch, companionway hatch', ver: ['escotilha', 'casaria', 'cockpit'] });
  t('escotilha', 'Escotilha', 'casco', 'Abertura no convés com tampa estanque, para passar pessoas e material ou ventilar o interior. No mar com ondas, deve ficar fechada e travada.',
    { en: 'hatch', ver: ['gaiuta', 'vigia'] });
  t('vigia', 'Vigia', 'casco', 'Janela do casco ou da casaria, fixa ou de abrir, para luz e ventilação. Deve ficar bem fechada no mar.',
    { en: 'porthole, portlight', ver: ['casaria', 'escotilha'], fig: ['barco', 'vigia'] });
  t('balaustre', 'Balaústre', 'casco', 'Coluna metálica vertical, presa na borda do convés, que sustenta os guarda-mancebos.',
    { en: 'stanchion', ver: ['guarda-mancebo', 'pulpito'], fig: ['barco', 'balaustre'] });
  t('guarda-mancebo', 'Guarda-mancebo', 'casco', 'Cabo de aço ou fita esticada entre os balaústres e os púlpitos, em volta do convés, para evitar que alguém caia no mar. Não substitui o arnês preso à linha de vida.',
    { en: 'lifeline, guardrail', ver: ['balaustre', 'pulpito', 'linha-de-vida', 'arnes'], fig: ['barco', 'guarda-mancebo'] });
  t('pulpito', 'Púlpito', 'casco', 'Grade de tubo, em geral de aço inox, na proa (púlpito de proa) ou na popa (púlpito de popa), onde terminam os guarda-mancebos.',
    { en: 'pulpit (proa), pushpit (popa)', sin: ['púlpito de proa', 'púlpito de popa'], ver: ['guarda-mancebo', 'balaustre'], fig: ['barco', ['pulpito', 'pulpito-de-popa']] });
  t('cunho', 'Cunho', 'casco', 'Peça com dois braços, presa no convés, no cais ou no mastro, em que se dá volta a um cabo para prendê-lo.',
    { en: 'cleat', ver: ['volta-de-cunho', 'mordedor', 'cabeco'], widget: { w: 'nos', opts: { no: 'volta-de-cunho' }, rotulo: 'Ver a volta de cunho' } });
  t('buzina', 'Buzina', 'casco', 'Peça na borda, aberta ou fechada, por onde passa um cabo de amarração ou a amarra, guiando-o e protegendo-o do atrito.',
    { en: 'fairlead, chock', ver: ['espia', 'amarra', 'cunho'] });
  t('malagueta', 'Malagueta', 'casco', 'Pino de madeira ou de metal em que se dá volta a cabos, como nos veleiros antigos. Também se chamam malaguetas os punhos da roda do leme.',
    { en: 'belaying pin; spoke handle', ver: ['roda-de-leme', 'cunho'] });
  t('cabeco', 'Cabeço', 'casco', 'Coluna curta e robusta, no cais ou no convés, em que se passam as espias de amarração. A coluna de amarração do convés também é chamada de abita.',
    { en: 'bollard, bitt', sin: ['abita'], ver: ['espia', 'cunho', 'atracar'] });
  t('molinete', 'Molinete', 'casco', 'Guincho, manual ou elétrico, que recolhe e larga a amarra da âncora. Tem uma coroa em que os elos da corrente se encaixam.',
    { en: 'windlass', ver: ['amarra', 'ancora', 'paiol-da-amarra'] });
  t('paiol-da-amarra', 'Paiol da amarra', 'casco', 'Compartimento na proa onde fica guardada a amarra. O chicote da amarra deve ficar preso dentro dele.',
    { en: 'chain locker', ver: ['amarra', 'molinete'] });
  t('sentina', 'Sentina', 'casco', 'Parte mais baixa do interior do casco, onde se junta a água que entra a bordo. Deve ser vigiada e esgotada com a bomba de esgoto.',
    { en: 'bilge', sin: ['porão'], ver: ['bomba-de-esgoto', 'valvula-de-fundo'] });
  t('bomba-de-esgoto', 'Bomba de esgoto', 'casco', 'Bomba, manual ou elétrica, que tira a água da sentina para fora do barco. Para o mar aberto, é prudente ter uma manual que possa ser operada do cockpit, além da elétrica.',
    { en: 'bilge pump', sin: ['bomba de porão'], ver: ['sentina'] });
  t('espelho-de-popa', 'Espelho de popa', 'casco', 'Painel plano ou levemente curvo que fecha a popa do casco. Também se diz painel de popa.',
    { en: 'transom', ver: ['popa'] });
  t('roda-de-proa', 'Roda de proa', 'casco', 'Peça que fica no extremo de vante da quilha e dá forma à proa do casco.',
    { en: 'stem', ver: ['proa'] });
  t('borda', 'Borda', 'casco', 'Parte de cima do costado, onde o casco encontra o convés. <em>Borda falsa</em> é a mureta que continua o costado acima do convés.',
    { en: 'gunwale; bulwark (borda falsa)', ver: ['costado', 'conves', 'balaustre'] });
  t('anteparo', 'Anteparo', 'casco', 'Parede interna que divide o casco em compartimentos (a Marinha escreve <em>antepara</em>). Anteparos estanques ajudam a conter um alagamento.',
    { en: 'bulkhead', ver: ['casco'] });
  t('valvula-de-fundo', 'Válvula de fundo', 'casco', 'Registro que abre e fecha um furo no casco abaixo da linha d’água, como a entrada de água do motor, do banheiro e da pia. Feche-a quando não estiver em uso e deixe um tampão de madeira amarrado ao lado, para emergências.',
    { en: 'seacock, through-hull', sin: ['passa-casco'], ver: ['sentina', 'obras-vivas'] });
  t('banda', 'Banda', 'casco', 'Inclinação lateral do barco, causada pelo vento nas velas, por pesos mal distribuídos ou pelas ondas. <em>Adernar</em> é inclinar para um bordo.',
    { en: 'heel; list', sin: ['adernamento'], busca: ['adernar'], ver: ['estabilidade', 'lastro', 'rizo'] });
  t('estabilidade', 'Estabilidade', 'casco', 'Capacidade do barco de voltar à posição de equilíbrio depois que uma força, como o vento ou uma onda, o inclina. A NORMAM-211 chama de estabilidade intacta essa propriedade com o casco íntegro.',
    { en: 'stability', ver: ['lastro', 'banda', 'monocasco'], fonte: n211('Glossário, p. VII') });
  t('trim', 'Trim', 'casco', 'Inclinação do barco no sentido de proa e popa. Diz-se que está <em>embicado</em> quando a proa está mais funda e <em>apopado</em> quando a popa está mais funda.',
    { en: 'trim', sin: ['compasso'], ver: ['banda', 'arfagem'] });
  t('balanco', 'Balanço', 'casco', 'Movimento de vaivém do barco de um bordo para o outro, em torno do eixo de proa a popa.',
    { en: 'rolling', ver: ['arfagem', 'banda'] });
  t('arfagem', 'Arfagem', 'casco', 'Movimento em que a proa e a popa sobem e descem alternadamente ao passar pelas ondas. Quando é forte, com a proa mergulhando, diz-se que o barco <em>caturra</em>.',
    { en: 'pitching', busca: ['caturro', 'caturrar'], ver: ['balanco', 'trim'] });
  t('deslocamento', 'Deslocamento', 'casco', 'Peso total do barco, igual ao peso da água que ele desloca ao flutuar. Casco de deslocamento é o que navega dentro da água, sem planar, como o de um veleiro de cruzeiro.',
    { en: 'displacement', ver: ['velocidade-de-casco', 'planar'] });
  t('velocidade-de-casco', 'Velocidade de casco', 'casco', 'Velocidade a partir da qual um casco de deslocamento precisa de muito mais força para andar mais rápido, porque fica preso na própria onda que forma. Regra prática: cerca de 2,43 × √(comprimento na linha d’água em metros) nós. Por exemplo, um veleiro de 32 pés (≈ 9,75 m), com uns 8,5 m de linha d’água, chega a cerca de 7 nós; use o comprimento de linha d’água do seu barco.',
    { en: 'hull speed', ver: ['comprimento', 'deslocamento', 'no-velocidade'] });
  t('planar', 'Planar', 'casco', 'Navegar por cima da água, sustentado pela velocidade, como as lanchas e os barcos de regata leves. Um veleiro de cruzeiro pesado não plana.',
    { en: 'plane', ver: ['deslocamento', 'velocidade-de-casco'] });
  t('veleiro', 'Veleiro', 'casco', 'Embarcação movida principalmente pelo vento nas velas. Para o RIPEAM, um veleiro com o motor ligado e engrenado conta como embarcação de propulsão mecânica.',
    { en: 'sailing yacht, sailboat', ver: ['sloop', 'embarcacao-a-vela', 'embarcacao-de-propulsao-mecanica', 'veleiro-categoria'], fig: ['barco', 'todas'], legenda: 'Veleiro de cruzeiro do tipo sloop, de perfil, com as partes principais.' });
  t('sloop', 'Sloop', 'casco', 'Veleiro de um mastro com uma só vela de proa (genoa ou buja) além da vela grande. É o tipo mais comum nos veleiros de cruzeiro de 30 a 40 pés.',
    { en: 'sloop', ver: ['cutter', 'ketch', 'vela-grande', 'genoa'], fig: ['barco', 'todas'] });
  t('cutter', 'Cutter', 'casco', 'Veleiro de um mastro com duas velas de proa ao mesmo tempo, uma à frente da outra. Prático no cruzeiro oceânico, porque facilita reduzir o pano.',
    { en: 'cutter', ver: ['sloop', 'ketch', 'vela-de-proa'] });
  t('ketch', 'Ketch', 'casco', 'Veleiro de dois mastros em que o de ré (o mastro da mezena) é menor e fica a vante do leme. No <em>yawl</em>, a mezena é bem menor e fica a ré do leme.',
    { en: 'ketch; yawl', busca: ['yawl', 'mezena'], ver: ['sloop', 'cutter'] });
  t('catamara', 'Catamarã', 'casco', 'Embarcação de dois cascos unidos por uma plataforma. É mais estável e mais rápido em águas calmas que um monocasco do mesmo tamanho, mas, se virar, não volta sozinho.',
    { en: 'catamaran', ver: ['monocasco', 'estabilidade'] });
  t('monocasco', 'Monocasco', 'casco', 'Embarcação de um só casco. Um veleiro monocasco com quilha lastrada tende a voltar à posição normal mesmo depois de uma grande inclinação.',
    { en: 'monohull', ver: ['catamara', 'quilha', 'estabilidade'] });
  t('bote-de-apoio', 'Bote de apoio', 'casco', 'Bote pequeno, inflável ou rígido, usado para ir do veleiro fundeado até a terra. A NORMAM-211 o chama de embarcação auxiliar: embarcação miúda, com motor de popa de até 50 HP, se houver, com o mesmo nome do barco principal nos dois costados e o mesmo número de inscrição na popa.',
    { en: 'tender, dinghy', sin: ['embarcação auxiliar', 'bote auxiliar'], ver: ['embarcacao-miuda', 'fundear'], fonte: n211('Glossário, p. VI') });
