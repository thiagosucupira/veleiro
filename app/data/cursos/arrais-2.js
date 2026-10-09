/* Curso Arrais-Amador — parte 2 (módulos m5 a m9): RIPEAM (governo, luzes e marcas, sinais),
   balizamento IALA região B, instrumentos, meteorologia e marés.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 3.1 c), d), e), f) e g).
   Contrato dos blocos: comentário do topo de app/core/course.js. Fatos regulatórios só com {t:'fato', ref}
   ou fontes com ref (ids de research/claims_verified.json ou research/_work/research_extra_arrais-2.json). */
(function () {
  'use strict';

  /* ---------- fontes reutilizadas ---------- */
  var RIPEAM_PDF = 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf';
  var MIG1 = 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf';
  var MIG3 = 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf';
  var NORMAM211 = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var NORMAM601 = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html';
  var DEC92267 = 'https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm';
  function fR(regras) { return { txt: 'RIPEAM-72, ' + regras + ' (texto em português consolidado com as emendas até 2013, CCA-IMO/Marinha do Brasil)', url: RIPEAM_PDF, ref: 'tecnico-01' }; }
  var F_MIG15 = { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2ª rev. 2023), Cap. 15 — RIPEAM', url: MIG1 };

  /* ---------- questões: q(id, tema, dificuldade, enunciado, alternativas, correta, explicacao, referencia) ---------- */
  function q(id, tema, dif, enunciado, alternativas, correta, explicacao, referencia) {
    return { id: 'ara2-' + id, nivel: 'arrais', tema: tema, dificuldade: dif, enunciado: enunciado, alternativas: alternativas, correta: correta, explicacao: explicacao, referencia: referencia };
  }
  var T_GOV = 'RIPEAM: regras de governo', T_LUZ = 'RIPEAM: luzes e marcas', T_SOM = 'RIPEAM: sinais sonoros e luminosos';
  var T_IALA = 'Balizamento IALA B', T_INST = 'Instrumentos náuticos', T_MET = 'Meteorologia', T_MARE = 'Marés';

  var M = [];

  /* =====================================================================================
     m5 — RIPEAM: regras de governo
     ===================================================================================== */
  var SVG_M5_VELA_MOTOR =
    '<svg viewBox="0 0 400 210" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Veleiro só a vela comparado com veleiro usando o motor</title>' +
    '<rect x="0" y="150" width="400" height="22" fill="var(--sea-2)"/>' +
    /* barco 1 */
    '<path d="M30,140 L180,140 L165,158 L45,158 Z" fill="var(--sea-3)" stroke="currentColor" stroke-width="2"/>' +
    '<line x1="100" y1="140" x2="100" y2="28" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M97,34 L97,132 L42,132 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M104,38 L170,134 L108,134 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<text x="105" y="186" text-anchor="middle" font-size="14" fill="currentColor">Só a vela, motor parado:</text>' +
    '<text x="105" y="203" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">embarcação a vela</text>' +
    /* barco 2 */
    '<path d="M230,140 L380,140 L365,158 L245,158 Z" fill="var(--sea-3)" stroke="currentColor" stroke-width="2"/>' +
    '<line x1="300" y1="140" x2="300" y2="28" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M297,34 L297,132 L242,132 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M304,38 L370,134 L308,134 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M318,58 L340,58 L329,80 Z" fill="currentColor"/>' +
    '<line x1="329" y1="44" x2="329" y2="58" stroke="currentColor" stroke-width="1.2"/>' +
    '<text x="346" y="72" font-size="13" fill="currentColor">cone</text>' +
    '<circle cx="252" cy="164" r="5" fill="none" stroke="var(--magenta)" stroke-width="2"/>' +
    '<path d="M236,164 q-6,-4 -12,0 q-6,4 -12,0" fill="none" stroke="var(--magenta)" stroke-width="2"/>' +
    '<text x="305" y="186" text-anchor="middle" font-size="14" fill="currentColor">Vela e motor engrenado:</text>' +
    '<text x="305" y="203" text-anchor="middle" font-size="14" font-weight="700" fill="var(--magenta)">propulsão mecânica</text>' +
    '</svg>';

  var SVG_M5_MARCACAO =
    '<svg viewBox="0 0 400 270" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Marcação constante: as linhas de visada ficam paralelas e os dois barcos chegam juntos ao mesmo ponto</title>' +
    '<rect x="0" y="0" width="400" height="270" fill="var(--sea-1)"/>' +
    '<g stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.8">' +
    '<line x1="120" y1="230" x2="270" y2="50"/><line x1="120" y1="170" x2="220" y2="50"/><line x1="120" y1="110" x2="170" y2="50"/></g>' +
    '<g fill="var(--magenta)"><polygon points="120,220 113,238 127,238"/><polygon points="120,160 113,178 127,178"/><polygon points="120,100 113,118 127,118"/></g>' +
    '<g fill="currentColor"><polygon points="260,50 278,43 278,57"/><polygon points="210,50 228,43 228,57"/><polygon points="160,50 178,43 178,57"/></g>' +
    '<g font-size="14" fill="currentColor"><text x="98" y="236">1</text><text x="98" y="176">2</text><text x="98" y="116">3</text>' +
    '<text x="264" y="34">1</text><text x="214" y="34">2</text><text x="164" y="34">3</text></g>' +
    '<g stroke="var(--erro)" stroke-width="3"><line x1="111" y1="41" x2="129" y2="59"/><line x1="129" y1="41" x2="111" y2="59"/></g>' +
    '<text x="20" y="30" font-size="14" font-weight="700" fill="var(--erro)">encontro</text>' +
    '<text x="200" y="150" font-size="14" fill="currentColor">a marcação não muda</text>' +
    '<text x="200" y="168" font-size="14" fill="currentColor">e a distância diminui:</text>' +
    '<text x="200" y="186" font-size="14" font-weight="700" fill="currentColor">rumo de colisão</text>' +
    '<text x="20" y="260" font-size="13" fill="currentColor">nós (magenta) e a outra, em três instantes</text>' +
    '</svg>';

  var SVG_M5_REGRA17 =
    '<svg viewBox="0 0 400 200" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>As três fases da embarcação que mantém rumo e velocidade, conforme a Regra 17</title>' +
    '<rect x="0" y="0" width="400" height="60" fill="var(--sea-1)"/>' +
    '<rect x="0" y="66" width="400" height="60" fill="var(--sea-2)"/>' +
    '<rect x="0" y="132" width="400" height="60" fill="var(--sea-3)"/>' +
    '<g fill="currentColor" font-size="14">' +
    '<text x="14" y="25" font-weight="700">Longe: mantenha rumo e velocidade</text><text x="14" y="45">Regra 17(a)(i). Vigie a outra.</text>' +
    '<text x="14" y="91" font-weight="700">Ela não manobra: você PODE manobrar</text><text x="14" y="111">17(a)(ii). Avise: 5 apitos curtos (34(d)).</text>' +
    '<text x="14" y="157" font-weight="700">Colisão iminente: você DEVE manobrar</text><text x="14" y="177">17(b). A melhor manobra possível.</text></g>' +
    '<g stroke="var(--magenta)" stroke-width="3" fill="var(--magenta)"><line x1="378" y1="10" x2="378" y2="178"/><polygon points="378,190 370,174 386,174"/></g>' +
    '</svg>';

  var SVG_M5_SETORES =
    '<svg viewBox="0 0 400 300" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Onde está a outra embarcação de propulsão mecânica e o que isso significa para você</title>' +
    '<path d="M200,150 L187.5,30.7 A120,120 0 0 1 212.5,30.7 Z" fill="var(--magenta)" opacity="0.55"/>' +
    '<path d="M200,150 L212.5,30.7 A120,120 0 0 1 310.9,195.9 Z" fill="var(--sea-2)" stroke="currentColor" stroke-width="1"/>' +
    '<path d="M200,150 L310.9,195.9 A120,120 0 0 1 89.1,195.9 Z" fill="var(--sea-3)" stroke="currentColor" stroke-width="1"/>' +
    '<path d="M200,150 L89.1,195.9 A120,120 0 0 1 187.5,30.7 Z" fill="var(--sea-1)" stroke="currentColor" stroke-width="1"/>' +
    '<line x1="80" y1="150" x2="320" y2="150" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>' +
    '<polygon points="200,132 190,162 210,162" fill="var(--magenta)"/>' +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="200" y="20" font-weight="700">Pela proa: roda a roda (R14)</text>' +
    '<text x="266" y="100">Por boreste:</text><text x="266" y="118" font-weight="700">você manobra</text><text x="266" y="136">(R15)</text>' +
    '<text x="134" y="100">Por bombordo:</text><text x="134" y="118" font-weight="700">você mantém</text><text x="134" y="136">(R15 e R17)</text>' +
    '<text x="200" y="212">Por ante a ré:</text><text x="200" y="230" font-weight="700">ela está alcançando</text><text x="200" y="248">ela manobra (R13)</text>' +
    '<text x="340" y="148">través</text><text x="60" y="148">través</text>' +
    '<text x="352" y="214">22,5°</text><text x="48" y="214">22,5°</text></g>' +
    '<text x="200" y="292" font-size="13" text-anchor="middle" fill="currentColor">duas de propulsão mecânica, no visual</text>' +
    '</svg>';

  function barco(x, y, rumo, cor, retranca) { /* retranca: +1 boreste, -1 bombordo */
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + rumo + ')">' +
      '<path d="M0,-24 C9,-10 9,10 6,18 L-6,18 C-9,10 -9,-10 0,-24 Z" fill="' + cor + '" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="0" cy="-6" r="2.5" fill="currentColor"/>' +
      '<line x1="0" y1="-6" x2="' + (11 * retranca) + '" y2="14" stroke="currentColor" stroke-width="3"/></g>';
  }
  var SVG_M5_REGRA12 =
    '<svg viewBox="0 0 400 250" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Regra 12: veleiros com vento em bordos diferentes e com vento do mesmo bordo</title>' +
    '<rect x="0" y="0" width="400" height="250" fill="var(--sea-1)"/>' +
    '<g stroke="var(--magenta)" stroke-width="3" fill="var(--magenta)"><line x1="200" y1="8" x2="200" y2="40"/><polygon points="200,50 192,34 208,34"/></g>' +
    '<text x="212" y="30" font-size="14" fill="var(--magenta)" font-weight="700">vento</text>' +
    '<line x1="200" y1="60" x2="200" y2="245" stroke="currentColor" stroke-dasharray="3 5" opacity="0.5"/>' +
    '<text x="100" y="72" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">(i) Bordos diferentes</text>' +
    '<text x="300" y="72" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">(ii) Mesmo bordo</text>' +
    barco(55, 165, 45, 'var(--sea-3)', 1) + barco(150, 165, -45, 'var(--nav-white)', -1) +
    barco(330, 112, -45, 'var(--sea-3)', -1) + barco(268, 172, -45, 'var(--nav-white)', -1) +
    '<g font-size="13" fill="currentColor" text-anchor="middle">' +
    '<text x="55" y="210">vento por</text><text x="55" y="226">bombordo:</text><text x="55" y="242" font-weight="700">manobra</text>' +
    '<text x="150" y="210">vento por</text><text x="150" y="226">boreste:</text><text x="150" y="242" font-weight="700">mantém</text>' +
    '<text x="350" y="156">a barlavento:</text><text x="350" y="172" font-weight="700">manobra</text>' +
    '<text x="268" y="220">a sotavento:</text><text x="268" y="236" font-weight="700">mantém</text></g>' +
    '</svg>';

  var SVG_M5_HIERARQUIA =
    '<svg viewBox="0 0 400 290" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Escada de responsabilidades da Regra 18</title>' +
    '<g stroke="currentColor" stroke-width="1">' +
    '<rect x="58" y="10" width="330" height="40" fill="var(--sea-3)"/><rect x="58" y="56" width="330" height="40" fill="var(--sea-2)"/>' +
    '<rect x="58" y="102" width="330" height="40" fill="var(--sea-2)"/><rect x="58" y="148" width="330" height="40" fill="var(--sea-1)"/>' +
    '<rect x="58" y="194" width="330" height="40" fill="var(--sea-1)"/></g>' +
    '<g font-size="14" fill="currentColor"><text x="70" y="35" font-weight="700">Sem governo · Manobra restrita</text>' +
    '<text x="70" y="81">Restrita pelo calado: não impedir</text>' +
    '<text x="70" y="127">Engajada na pesca</text>' +
    '<text x="70" y="173">A vela</text>' +
    '<text x="70" y="219">Propulsão mecânica</text></g>' +
    '<g stroke="var(--magenta)" stroke-width="3" fill="var(--magenta)"><line x1="28" y1="226" x2="28" y2="26"/><polygon points="28,12 20,30 36,30"/></g>' +
    '<text x="8" y="262" font-size="14" fill="currentColor">Quem está embaixo sai do caminho de quem está em cima.</text>' +
    '<text x="8" y="282" font-size="14" fill="var(--magenta)" font-weight="700">Exceções: Regras 9, 10 e 13.</text>' +
    '</svg>';

  var SVG_M5_CANAL =
    '<svg viewBox="0 0 400 240" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Canal estreito: cada embarcação navega junto ao limite do canal que fica a seu boreste</title>' +
    '<rect x="0" y="0" width="400" height="240" fill="var(--sea-2)"/>' +
    '<rect x="0" y="0" width="70" height="240" fill="var(--land)"/><rect x="330" y="0" width="70" height="240" fill="var(--land)"/>' +
    '<rect x="110" y="0" width="180" height="240" fill="var(--sea-3)"/>' +
    '<g fill="var(--nav-green)" stroke="currentColor"><rect x="104" y="40" width="12" height="18"/><rect x="104" y="150" width="12" height="18"/></g>' +
    '<g fill="var(--nav-red)" stroke="currentColor"><polygon points="290,36 283,58 297,58"/><polygon points="290,146 283,168 297,168"/></g>' +
    '<g fill="currentColor"><path d="M252,120 l-10,26 l20,0 Z"/><path d="M148,96 l-10,-26 l20,0 Z"/></g>' +
    '<g stroke="currentColor" stroke-width="2" fill="none"><line x1="252" y1="150" x2="252" y2="200"/><line x1="148" y1="66" x2="148" y2="20"/></g>' +
    '<polygon points="88,190 82,206 94,206" fill="var(--magenta)"/>' +
    '<g font-size="13" fill="currentColor"><text x="210" y="225">navio subindo</text>' +
    '<text x="160" y="110">navio descendo</text></g>' +
    '<text x="6" y="226" font-size="13" fill="var(--magenta)" font-weight="700">veleiro: não impede</text>' +
    '<text x="200" y="16" font-size="13" text-anchor="middle" fill="currentColor">para o porto</text>' +
    '</svg>';

  M.push({
    id: 'm5', titulo: 'RIPEAM: regras de governo',
    resumo: 'O “código de trânsito” da água: vigilância, velocidade de segurança, risco de abalroamento, como manobrar, roda a roda, rumos cruzados, ultrapassagem, veleiros entre si, canais estreitos e a escada de responsabilidades da Regra 18. NORMAM-211, Anexo 5-A, 3.1 f) III.',
    licoes: [
      /* ---------------- m5 l1 ---------------- */
      {
        id: 'l1', titulo: 'O RIPEAM: o que é, onde vale e quem é quem', minutos: 12,
        objetivos: [
          'Saber o que é o RIPEAM e por que ele vale para o seu barco, no mar e em águas interiores.',
          'Entender a Regra 2: cumprir a letra das regras não basta.',
          'Reconhecer as definições da Regra 3 que decidem quem manobra.'
        ],
        blocos: [
          { t: 'p', html: '<strong>Abalroamento</strong> é a colisão entre embarcações. O <strong>RIPEAM</strong> — Regulamento Internacional para Evitar Abalroamentos no Mar — é o “código de trânsito” da água. Ele foi adotado pela Organização Marítima Internacional (IMO) em 1972, com o nome internacional COLREG, e vale no mundo todo. O apito que você aprende aqui significa a mesma coisa em Portugal, no Caribe ou no Japão.' },
          { t: 'fato', ref: 'tecnico-04', html: 'No Brasil, a Convenção de 1972 foi promulgada pelo Decreto nº 80.068, de 2 de agosto de 1977.' },
          { t: 'fato', ref: 'tecnico-03', html: 'As emendas aprovadas pela IMO entre 1981 e 2013 foram promulgadas pelo Decreto nº 10.901, de 17 de dezembro de 2021.' },
          { t: 'fato', ref: 'tecnico-08', html: 'A NORMAM-211 manda todas as embarcações, inclusive as de esporte e recreio, a vela ou a motor, cumprirem o RIPEAM e suas emendas em vigor, também quanto às luzes de navegação.' },
          { t: 'h', txt: 'Onde o RIPEAM vale (Regra 1)' },
          { t: 'p', html: 'A Regra 1 aplica o RIPEAM ao alto-mar e a todas as águas ligadas a ele que navios de alto-mar podem navegar: baías, portos, estuários e rios como o <span class="agua">Amazonas</span>. A autoridade de cada país pode baixar <strong>regras especiais</strong> para portos, rios e lagos — no Brasil, as Normas e Procedimentos das Capitanias (NPCP). Essas regras locais devem ser, “tanto quanto possível”, concordantes com o RIPEAM. Para o Arrais, a lição prática é simples: o RIPEAM vale também nas suas águas interiores, e as regras da Capitania se somam a ele.' },
          { t: 'h', txt: 'A responsabilidade é sempre sua (Regra 2)' },
          { t: 'lista', itens: [
            '<strong>2(a)</strong> — Nada no RIPEAM livra a embarcação, o proprietário, o comandante ou a tripulação das consequências de negligência no cumprimento das regras ou de qualquer precaução que a <strong>prática marinheira</strong> normalmente exige.',
            '<strong>2(b)</strong> — Ao aplicar as regras, considere todos os perigos e as <strong>circunstâncias especiais</strong>, inclusive as limitações das embarcações envolvidas. Elas podem tornar necessário <strong>afastar-se das regras</strong> para evitar um perigo imediato.'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Ninguém tem “direito” de bater', html: 'Mesmo a embarcação que deve manter rumo e velocidade tem obrigações: vigiar, avisar e, se a outra não manobrar, agir para evitar a colisão (Regra 17). Num tribunal marítimo, “eu tinha preferência” não é defesa.' },
          { t: 'h', txt: 'As definições que decidem quem manobra (Regra 3)' },
          { t: 'p', html: 'Quase toda situação do RIPEAM começa por uma pergunta: <em>o que é cada embarcação?</em> As definições da Regra 3 respondem.' },
          { t: 'tabela', cab: ['Termo', 'O que significa (Regra 3)'], linhas: [
            ['Embarcação de propulsão mecânica', 'Qualquer embarcação movida por máquinas ou motores.'],
            ['Embarcação a vela', 'Qualquer embarcação sob vela, <strong>desde que o motor, se houver, não esteja em uso</strong>.'],
            ['Engajada na pesca', 'Pescando com redes, linhas ou arrasto que <strong>restringem a manobra</strong>. Pesca de corrico não conta.'],
            ['Sem governo', 'Por circunstância excepcional (leme quebrado, motor em pane), não consegue manobrar como as regras pedem.'],
            ['Com capacidade de manobra restrita', 'Pela natureza do serviço (dragagem, colocação de boias e cabos submarinos, reabastecimento em viagem, reboque que não deixa desviar), não consegue sair do caminho.'],
            ['Restrita devido ao calado', 'De propulsão mecânica, com calado grande para a profundidade e a largura disponíveis: quase não pode sair do rumo.'],
            ['Em movimento', 'Toda embarcação que <strong>não</strong> está fundeada, amarrada à terra ou encalhada. À deriva com o motor parado também está em movimento.'],
            ['No visual', 'Quando uma pode ser vista pela outra a olho.'],
            ['Visibilidade restrita', 'Visibilidade prejudicada por nevoeiro, névoa, chuva pesada, nevada, tempestade de areia ou causa parecida.']
          ] },
          { t: 'figura', svg: SVG_M5_VELA_MOTOR, legenda: 'O mesmo veleiro muda de categoria quando o motor entra em uso. De dia, quem navega a vela e usa o motor ao mesmo tempo exibe a vante um cone com o vértice para baixo (Regra 25(e)).' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Veleiro motorando é “lancha”', html: 'Com o motor engrenado, mesmo de velas içadas, o seu veleiro é embarcação de propulsão mecânica: segue as regras de manobra das lanchas, exibe as luzes de propulsão mecânica à noite e o cone de dia. Muitos acidentes começam com um veleiro motorando que acha que “tem preferência” por estar de vela içada.' },
          { t: 'h', txt: 'Como o RIPEAM é organizado' },
          { t: 'tabela', cab: ['Parte', 'Regras', 'Assunto'], linhas: [
            ['A — Generalidades', '1 a 3', 'Aplicação, responsabilidade e definições'],
            ['B — Governo e navegação', '4 a 19', 'Seção I (qualquer visibilidade, 4 a 10), Seção II (no visual, 11 a 18), Seção III (visibilidade restrita, 19)'],
            ['C — Luzes e marcas', '20 a 31', 'O que cada embarcação exibe de noite e de dia'],
            ['D — Sinais sonoros e luminosos', '32 a 37', 'Apitos, sino, gongo, sinais de manobra, de cerração e de perigo'],
            ['E — Isenções', '38', 'Prazos de transição para navios antigos'],
            ['F — Verificação', '39 a 41', 'Auditoria dos países (não muda a condução do barco)'],
            ['Anexos I a IV', '—', 'Posição das luzes, sinais de pesca, especificação dos apitos e sinais de perigo']
          ] },
          { t: 'fato', ref: 'normas-148', html: 'Descumprir regra do RIPEAM é infração prevista no Regulamento da Lei de Segurança do Tráfego Aquaviário (RLESTA, Decreto nº 2.596/1998, art. 23, IV): multa do grupo D ou suspensão do Certificado de Habilitação por até 60 dias.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Em inglês o regulamento é o <em>COLREGs</em>. A embarcação obrigada a manobrar é a <em>give-way vessel</em>; a que mantém rumo e velocidade é a <em>stand-on vessel</em>.' },
          { t: 'fato', ref: 'internacional-80', intl: true, html: 'A avaliação prática do ICC (vela) inclui as regras de prevenção de abalroamento, ao lado de manobras como homem ao mar, fundeio e atracação.' },
          { t: 'termos', ids: ['ripeam', 'abalroamento', 'embarcacao-de-propulsao-mecanica', 'embarcacao-a-vela', 'em-movimento', 'sem-governo', 'manobrabilidade-restrita', 'restrita-pelo-calado', 'engajada-na-pesca', 'visibilidade-restrita'] },
          { t: 'check', questoes: [
            q('m5l1-1', T_GOV, 1, 'Um veleiro navega com as velas içadas e o motor engrenado, empurrando o barco. Para o RIPEAM, ele é:',
              ['Embarcação a vela, porque está com as velas içadas.', 'Embarcação de propulsão mecânica.', 'Embarcação com capacidade de manobra restrita.', 'Embarcação sem governo.'], 1,
              'A Regra 3(c) só considera “a vela” a embarcação sob vela <strong>cujo motor não esteja em uso</strong>. Com o motor em uso, vale a Regra 3(b): é de propulsão mecânica. Manobra restrita depende da natureza do serviço (dragagem, cabos etc.), e “sem governo” exige uma circunstância excepcional que impeça manobrar — nenhum dos dois é o caso.',
              'RIPEAM, Regra 3(b) e (c)'),
            q('m5l1-2', T_GOV, 2, 'Uma lancha está parada no meio da baía, motor desligado, à deriva, sem ferro no fundo e sem cabo para terra. Para o RIPEAM ela está:',
              ['Fundeada.', 'Em movimento.', 'Sem governo, obrigatoriamente.', 'Amarrada.'], 1,
              'Pela Regra 3(i), “em movimento” é toda embarcação que não está fundeada, amarrada à terra ou encalhada. Parada à deriva, ela está em movimento (apenas sem seguimento). Não está fundeada nem amarrada, porque nada a prende. Só seria “sem governo” se uma circunstância excepcional a impedisse de manobrar — desligar o motor por vontade própria não é isso.',
              'RIPEAM, Regra 3(f) e (i)'),
            q('m5l1-3', T_GOV, 2, 'Pela Regra 2(b), quando é aceitável afastar-se das regras do RIPEAM?',
              ['Sempre que a outra embarcação for menor.', 'Quando for necessário para evitar um perigo imediato, considerando os perigos e as circunstâncias especiais.', 'Quando a Capitania não tiver regras locais para a área.', 'Nunca: as regras devem ser cumpridas à risca em qualquer situação.'], 1,
              'A Regra 2(b) manda levar em conta todos os perigos e circunstâncias especiais, inclusive as limitações das embarcações, que podem tornar necessário um afastamento das regras para evitar perigo imediato. O tamanho da outra não autoriza nada. A falta de regra local não muda o RIPEAM. E “nunca” contradiz o próprio texto da Regra 2(b).',
              'RIPEAM, Regra 2')
          ] },
          { t: 'fontes', itens: [fR('Regras 1, 2 e 3'), { txt: 'Decreto nº 10.901/2021 (Planalto)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/D10901.htm', ref: 'tecnico-03' }, { txt: 'NORMAM-211/DPC, item 4.5', url: NORMAM211, ref: 'tecnico-08' }, { txt: 'Decreto nº 2.596/1998 (RLESTA), art. 23', url: 'https://www.planalto.gov.br/ccivil_03/decreto/d2596.htm', ref: 'normas-148' }, F_MIG15] }
        ]
      },
      /* ---------------- m5 l2 ---------------- */
      {
        id: 'l2', titulo: 'Vigiar, ir devagar e perceber o risco: Regras 5, 6 e 7', minutos: 13,
        objetivos: [
          'Manter vigilância apropriada com olhos, ouvidos e todos os meios a bordo.',
          'Escolher a velocidade de segurança pelos fatores da Regra 6.',
          'Detectar o risco de abalroamento pela marcação que não muda.'
        ],
        blocos: [
          { t: 'p', html: 'As Regras 5 a 10 formam a Seção I da Parte B. Elas valem <strong>em qualquer condição de visibilidade</strong> (Regra 4): de dia, de noite, no nevoeiro. As três primeiras são a base de tudo: ver, ir numa velocidade que permita reagir e perceber cedo que há risco.' },
          { t: 'h', txt: 'Regra 5: vigilância' },
          { t: 'p', html: 'Toda embarcação deve manter, <strong>permanentemente</strong>, vigilância apropriada, <strong>visual e auditiva</strong>, e por todos os meios apropriados às circunstâncias — radar, AIS, rádio VHF — para ter a apreciação completa da situação e do risco de colisão.' },
          { t: 'lista', itens: [
            'Num veleiro, a <strong>genoa esconde</strong> um setor inteiro a vante e a sotavento. Abaixe-se e olhe por baixo dela de tempos em tempos, ou peça a um tripulante.',
            'Com piloto automático, alguém continua de vigia. O piloto governa; ele não olha.',
            'À noite, proteja a visão noturna: luz vermelha na cabine e nada de tela de celular no rosto de quem vigia.',
            'Ouça: o ronco de um motor ou um apito chega antes da silhueta, sobretudo com chuva.'
          ] },
          { t: 'h', txt: 'Regra 6: velocidade de segurança' },
          { t: 'p', html: 'A velocidade de segurança é a que permite <strong>ação apropriada e eficaz</strong> para evitar a colisão e <strong>parar a uma distância apropriada</strong>. O RIPEAM não fixa número em nós. Ele lista fatores que você deve pesar:' },
          { t: 'lista', itens: [
            'o grau de visibilidade;',
            'a densidade do tráfego, inclusive concentrações de pesqueiros;',
            'a capacidade de manobra da sua embarcação: distância de parada e giro nas condições do momento;',
            'à noite, luzes de fundo (da costa, da cidade) e reflexos das suas próprias luzes;',
            'o estado do vento, do mar e das correntes e a proximidade de perigos;',
            'o calado em relação à profundidade disponível.'
          ] },
          { t: 'p', html: 'Quem usa radar soma fatores próprios: limitações do aparelho, escala em uso, ecos do mar e da chuva, e o fato de que barcos pequenos e objetos flutuantes podem não aparecer na tela. Exemplo brasileiro: entrar à noite numa baía como a <span class="agua">Baía de Guanabara</span> ou a <span class="agua">Baía de Todos os Santos</span>, com as luzes da cidade atrás das boias e pequenos pesqueiros sem luz, pede velocidade bem menor que a do dia.' },
          { t: 'h', txt: 'Regra 7: risco de abalroamento' },
          { t: 'lista', itens: [
            '<strong>7(a)</strong> — Use todos os meios para saber se há risco. <strong>Em caso de dúvida, presuma que o risco existe.</strong>',
            '<strong>7(b) e (c)</strong> — Use o radar de forma apropriada, com plotagem ou observação sistemática. Não tire conclusões de informação escassa, sobretudo de radar.',
            '<strong>7(d)(I)</strong> — Presuma risco se a <strong>marcação</strong> de quem se aproxima <strong>não muda de forma apreciável</strong>.',
            '<strong>7(d)(II)</strong> — Às vezes há risco mesmo com a marcação mudando: navio muito grande, reboque ou embarcação já muito perto.'
          ] },
          { t: 'p', html: '<strong>Marcação</strong> é a direção em que você vê a outra embarcação. Tome-a com uma agulha de marcação, ou de um jeito simples: fique sempre no mesmo lugar do convés e alinhe a outra com um ponto fixo do seu barco (um balaústre, um estai). Se ela continua “grudada” no mesmo ponto e vai ficando maior, vocês vão se encontrar.' },
          { t: 'figura', svg: SVG_M5_MARCACAO, legenda: 'Marcação constante. Em cada instante (1, 2, 3) a linha de visada aponta na mesma direção. Os dois barcos chegam juntos ao ponto marcado em vermelho.' },
          { t: 'callout', tipo: 'dica', titulo: 'Truque do fundo', html: 'Perto da costa, olhe a terra atrás da outra embarcação. Se ela parece andar para a frente em relação ao fundo, vai passar pela sua proa. Se anda para trás, vai passar pela sua popa. Se fica parada contra o mesmo morro, é rumo de colisão.' },
          { t: 'widget', w: 'regras-governo', opts: { cenario: 'cruzados', setores: true }, legenda: 'Mude o rumo e a velocidade dos dois barcos e veja a menor distância prevista. O critério de risco do simulador é didático: o RIPEAM não fixa número (Regra 7).' },
          { t: 'callout', tipo: 'seguranca', titulo: 'AIS não mostra todo mundo', html: 'O AIS calcula a menor distância de passagem (CPA) dos barcos que transmitem. Pequenos pesqueiros, canoas e muitos barcos de recreio não têm AIS. A vigilância visual da Regra 5 continua obrigatória.' },
          { t: 'termos', ids: ['vigilancia', 'velocidade-de-seguranca', 'risco-de-abalroamento', 'marcacao', 'marcacao-relativa', 'radar', 'ais'] },
          { t: 'check', questoes: [
            q('m5l2-1', T_GOV, 1, 'Você observa uma lancha que se aproxima. Em três observações, a marcação dela não muda e a distância diminui. Pela Regra 7, você deve:',
              ['Presumir que existe risco de abalroamento.', 'Concluir que ela vai passar pela sua popa.', 'Esperar mais observações antes de qualquer conclusão, porque três não bastam.', 'Concluir que não há risco, já que ela está no visual.'], 0,
              'A Regra 7(d)(I) manda presumir risco quando a marcação de quem se aproxima não se altera de modo apreciável. Marcação constante não indica passagem pela popa (isso aconteceria se a marcação andasse para ré). Esperar mais é justamente o que a Regra 7(a) desaconselha: na dúvida, presuma o risco. Estar no visual não elimina o risco; só decide quais regras se aplicam.',
              'RIPEAM, Regra 7(a) e (d)'),
            q('m5l2-2', T_GOV, 2, 'Sobre a velocidade de segurança, é correto afirmar que o RIPEAM:',
              ['Fixa 6 nós dentro de portos e baías.', 'Não fixa um número: manda considerar fatores como visibilidade, tráfego, manobrabilidade, luzes de fundo, vento, mar, correntes e calado.', 'Só se aplica a embarcações com radar.', 'Só se aplica em visibilidade restrita.'], 1,
              'A Regra 6 define a velocidade de segurança pela capacidade de agir e parar a tempo, e lista os fatores a considerar. Não há número fixo no RIPEAM (limites de velocidade podem existir em regras locais da Capitania, mas isso é outra norma). Os fatores com radar são adicionais, não exclusivos. E a Regra 6 está na Seção I, que vale em qualquer visibilidade (Regra 4).',
              'RIPEAM, Regras 4 e 6'),
            q('m5l2-3', T_GOV, 3, 'Um navio muito grande se aproxima a curta distância, e a marcação dele está mudando devagar. O que diz a Regra 7?',
              ['Como a marcação muda, não há risco.', 'Pode haver risco mesmo com variação apreciável da marcação, sobretudo com navio muito grande, reboque ou a curta distância.', 'O risco só existe se o navio apitar cinco vezes.', 'O navio grande sempre tem preferência, então o risco é dele.'], 1,
              'A Regra 7(d)(II) alerta que o risco pode existir mesmo com variação de marcação quando a outra é muito grande, é um reboque ou está muito perto: partes diferentes do navio (proa, popa) têm marcações diferentes. Os cinco apitos curtos são sinal de dúvida (Regra 34(d)), não critério de risco. E “preferência” não decide se há risco.',
              'RIPEAM, Regra 7(d)(II)')
          ] },
          { t: 'fontes', itens: [fR('Regras 4 a 7'), F_MIG15] }
        ]
      },
      /* ---------------- m5 l3 ---------------- */
      {
        id: 'l3', titulo: 'Como manobrar: Regras 8, 16 e 17', minutos: 12,
        objetivos: [
          'Fazer a manobra para evitar abalroamento cedo, de forma ampla e clara.',
          'Saber o que faz a embarcação obrigada a manobrar e a que mantém rumo e velocidade.',
          'Reconhecer as três fases da Regra 17 e o que evitar em cada uma.'
        ],
        blocos: [
          { t: 'p', html: 'As regras de situação (12 a 15 e 18) dizem <em>quem</em> manobra. As Regras 8, 16 e 17 dizem <em>como</em>. Uma manobra certa, mas tímida ou tardia, causa tantas colisões quanto a manobra errada.' },
          { t: 'h', txt: 'Regra 8: a manobra para evitar abalroamento' },
          { t: 'lista', itens: [
            '<strong>Positiva e com ampla antecedência</strong>, seguindo a boa prática marinheira (8(a)).',
            '<strong>Ampla o bastante para ser percebida</strong> pela outra, a olho ou no radar. Evite pequenas alterações sucessivas de rumo ou de velocidade (8(b)).',
            'Com espaço suficiente, <strong>só a guinada</strong> pode ser a manobra mais eficaz, se feita cedo, de forma substancial e sem criar outra situação de perigo (8(c)).',
            'O resultado deve ser uma <strong>passagem a distância segura</strong>. Confira a manobra até a outra estar passada e safa (8(d)).',
            'Se precisar de tempo para entender a situação, <strong>reduza a velocidade</strong> ou pare, dando atrás (8(e)).',
            'Quem deve “não impedir” a passagem de outra (canais, esquemas de tráfego, embarcação restrita pelo calado) manobra cedo, deixando espaço. Se mesmo assim surgir risco, as demais regras continuam valendo para as duas (8(f)).'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Mostre o costado', html: 'Uma guinada franca (na maioria dos encontros entre lanchas, para boreste) faz a outra embarcação ver o seu costado e, à noite, a troca das suas luzes de bordos. Cinco guinadas pequenas, de poucos graus, não mostram nada: só confundem. É o que a Regra 8(b) pede: alteração ampla o bastante para ser percebida.' },
          { t: 'h', txt: 'Regra 16: quem é obrigada a manobrar' },
          { t: 'p', html: 'Toda embarcação obrigada a se manter fora do caminho de outra deve manobrar <strong>antecipada e substancialmente</strong>, para ficar bem safa. No veleiro, isso exige planejar: uma cambada ou um jaibe levam tempo, e o barco perde velocidade no meio da manobra. Decida cedo.' },
          { t: 'h', txt: 'Regra 17: quem mantém rumo e velocidade' },
          { t: 'lista', itens: [
            '<strong>17(a)(I)</strong> — Quando uma é obrigada a manobrar, a outra <strong>mantém rumo e velocidade</strong>. Assim a obrigada consegue prever o seu movimento.',
            '<strong>17(a)(II)</strong> — A que mantém rumo <strong>pode</strong> manobrar assim que perceber que a obrigada não está agindo como deve. Na dúvida sobre o que a outra vai fazer, avise com pelo menos cinco apitos curtos e rápidos (Regra 34(d)); o sinal é um aviso, não uma condição para manobrar.',
            '<strong>17(b)</strong> — Se ficar tão perto que só a manobra da outra não evita a colisão, a que mantém rumo <strong>deve</strong> manobrar da melhor forma possível.',
            '<strong>17(c)</strong> — Entre duas de propulsão mecânica em rumos cruzados, quem manobra pela 17(a)(II) não deve, se puder evitar, <strong>guinar para bombordo</strong> para uma embarcação que está no seu bombordo.',
            '<strong>17(d)</strong> — Nada disso dispensa a obrigada de sair do caminho.'
          ] },
          { t: 'figura', svg: SVG_M5_REGRA17, legenda: 'A embarcação que mantém rumo e velocidade passa por três fases conforme a distância diminui sem que a outra manobre.' },
          { t: 'p', html: 'Por que evitar a guinada para bombordo na 17(c)? Porque, se a outra (que está no seu bombordo e deveria manobrar) acordar no último instante, ela vai guinar para boreste, como manda o costume e a Regra 14. Se você guinar para bombordo na mesma hora, vocês se aproximam ainda mais.' },
          { t: 'widget', w: 'regras-governo', opts: { a: { tipo: 'pm', rumo: 0, vel: 6 }, b: { tipo: 'pm', rumo: 270, vel: 8, marcacao: 50, distancia: 1.6 } }, legenda: 'A outra lancha vem pela sua bochecha de boreste. Experimente guinar para boreste (pela popa dela) e veja a distância de passagem aumentar.' },
          { t: 'termos', ids: ['embarcacao-obrigada-a-manobrar', 'embarcacao-que-mantem-rumo', 'guinar', 'seguimento', 'bochecha'] },
          { t: 'check', questoes: [
            q('m5l3-1', T_GOV, 1, 'Você é obrigado a manobrar para evitar uma lancha. Qual manobra segue a Regra 8?',
              ['Várias guinadas pequenas de 5°, para não assustar a outra.', 'Uma guinada ampla, feita cedo, que a outra perceba claramente.', 'Manter o rumo e aumentar a velocidade para passar logo.', 'Esperar a outra chegar mais perto para ter certeza.'], 1,
              'A Regra 8(b) pede alteração ampla o suficiente para ser percebida e manda evitar pequenas alterações sucessivas; a 8(a) e a Regra 16 pedem antecedência. Pequenas guinadas não são percebidas. Manter rumo e acelerar não é manobra para se manter fora do caminho e pode cruzar a proa da outra. Esperar contraria a “ampla antecedência”.',
              'RIPEAM, Regras 8 e 16'),
            q('m5l3-2', T_GOV, 2, 'Você mantém rumo e velocidade, mas a embarcação obrigada a manobrar se aproxima sem fazer nada. Pela Regra 17(a)(II), você:',
              ['Deve continuar com rumo e velocidade até a colisão, porque é a regra.', 'Pode manobrar para evitar o abalroamento assim que perceber que ela não está agindo, avisando com o sinal de dúvida.', 'Deve parar as máquinas imediatamente, em qualquer caso.', 'Deve chamar a Capitania pelo rádio antes de qualquer ação.'], 1,
              'A Regra 17(a)(II) autoriza a embarcação que mantém rumo a manobrar tão logo pareça que a outra não está manobrando como deve; o sinal de dúvida de cinco curtos (Regra 34(d)) avisa a outra, sem ser condição para manobrar. Manter o rumo até colidir viola a 17(b) e a Regra 2. Parar sempre não é exigido (e pode piorar). Rádio pode ajudar, mas não é condição para manobrar.',
              'RIPEAM, Regras 17(a) e 34(d)'),
            q('m5l3-3', T_GOV, 3, 'Duas embarcações de propulsão mecânica em rumos cruzados. Você mantém rumo; a outra está no seu bombordo e não manobra. Se você decidir manobrar pela 17(a)(II), deve evitar, se possível:',
              ['Reduzir a velocidade.', 'Guinar para boreste.', 'Guinar para bombordo.', 'Dar cinco apitos curtos.'], 2,
              'A Regra 17(c) diz que a embarcação de propulsão mecânica que manobra pela 17(a)(II) em rumos cruzados não deve guinar para bombordo para outra que esteja no seu bombordo. Se a outra reagir guinando para boreste, as duas guinadas se somariam. Reduzir a velocidade e guinar para boreste são manobras aceitas (Regra 8(e)). Os cinco curtos são o sinal de dúvida, que avisa a outra embarcação; não são uma manobra.',
              'RIPEAM, Regra 17(c)')
          ] },
          { t: 'fontes', itens: [fR('Regras 8, 16 e 17'), F_MIG15] }
        ]
      },
      /* ---------------- m5 l4 ---------------- */
      {
        id: 'l4', titulo: 'Entre lanchas: roda a roda, rumos cruzados e ultrapassagem (Regras 13 a 15)', minutos: 14,
        objetivos: [
          'Reconhecer a situação de ultrapassagem e saber que ela vale para qualquer embarcação.',
          'Aplicar a Regra 14 (roda a roda) e a Regra 15 (rumos cruzados).',
          'Ler a situação pelas luzes que você vê à noite.'
        ],
        blocos: [
          { t: 'p', html: 'As Regras 11 a 18 formam a Seção II: valem para embarcações <strong>no visual</strong> uma da outra (Regra 11). A primeira pergunta é sempre: <em>alguém está alcançando alguém?</em> Se sim, decide a Regra 13, qualquer que seja o tipo de embarcação.' },
          { t: 'h', txt: 'Regra 13: ultrapassagem' },
          { t: 'lista', itens: [
            '<strong>13(a)</strong> — Quem está ultrapassando sai do caminho da alcançada, <strong>quaisquer que sejam</strong> as outras regras das Seções I e II. Vale para um veleiro alcançando uma lancha lenta, por exemplo.',
            '<strong>13(b)</strong> — Está alcançando quem se aproxima vindo de <strong>mais de 22,5° por ante a ré do través</strong> da outra. À noite, essa embarcação só vê a <strong>luz de alcançado</strong> (de popa), sem ver nenhuma luz de bordo.',
            '<strong>13(c)</strong> — Na dúvida, considere que está alcançando e manobre.',
            '<strong>13(d)</strong> — Uma mudança posterior de marcação não transforma a ultrapassagem em rumos cruzados. A obrigação vale até ter passado e estar bem afastada.'
          ] },
          { t: 'h', txt: 'Regra 14: roda a roda' },
          { t: 'p', html: 'Duas embarcações de <strong>propulsão mecânica</strong> em rumos opostos ou quase opostos, com risco: <strong>as duas guinam para boreste</strong> e passam por bombordo uma da outra. Considere roda a roda quando vê a outra pela proa ou quase pela proa: à noite, as luzes de mastro dela alinhadas (ou quase) e/ou as duas luzes de bordos; de dia, o aspecto correspondente. Na dúvida, considere que é roda a roda (14(c)).' },
          { t: 'h', txt: 'Regra 15: rumos cruzados' },
          { t: 'p', html: 'Duas de propulsão mecânica se cruzando com risco: <strong>quem vê a outra por boreste</strong> sai do caminho e, se as circunstâncias permitirem, <strong>evita cruzar a proa</strong> dela. Na prática, quem manobra costuma guinar para boreste e passar pela popa da outra, ou reduzir.' },
          { t: 'figura', svg: SVG_M5_SETORES, legenda: 'Entre duas de propulsão mecânica no visual. A faixa “pela proa” é ilustrativa: o RIPEAM fala em “pela proa ou quase pela proa”, sem número. Os 22,5° por ante a ré do través marcam o limite da ultrapassagem e coincidem com o fim do setor das luzes de bordos.' },
          { t: 'callout', tipo: 'dica', titulo: 'Leia as luzes', html: 'À noite, se você vê a luz <strong>encarnada</strong> (bombordo) de uma lancha que cruza o seu rumo, ela está no seu boreste: <strong>você manobra</strong>. Se vê a luz <strong>verde</strong> (boreste), ela está no seu bombordo: você mantém rumo e velocidade, vigiando. Se vê as duas luzes de bordos e as luzes de mastro alinhadas, é roda a roda: guine para boreste. Se vê só uma luz branca baixa, você está alcançando.' },
          { t: 'widget', w: 'regras-governo', opts: { cenario: 'rodaaroda' }, legenda: 'Roda a roda: as duas guinam para boreste. Use o seletor de situação para ver também rumos cruzados e ultrapassagem.' },
          { t: 'p', html: 'Repare que a Regra 15 só fala de embarcações de propulsão mecânica. Se uma delas é um veleiro a vela, um pesqueiro pescando ou um navio com manobra restrita, quem decide é a Regra 18 (próximas lições) — exceto na ultrapassagem, que sempre é Regra 13.' },
          { t: 'widget', w: 'regras-governo', opts: { modo: 'desafio', desafios: ['rodaaroda', 'cruzados', 'ultrapassagem'] }, legenda: 'Desafio: diga a situação e quem manobra em encontros sorteados.' },
          { t: 'termos', ids: ['ultrapassagem', 'roda-a-roda', 'rumos-cruzados', 'traves', 'luz-de-alcancado', 'luzes-de-bordos'] },
          { t: 'check', questoes: [
            q('m5l4-1', T_GOV, 2, 'Um veleiro navegando a vela alcança, pela popa, uma lancha de pesca que se desloca devagar (sem estar pescando). Quem deve sair do caminho?',
              ['A lancha, porque propulsão mecânica sempre manobra para vela.', 'O veleiro, porque quem ultrapassa sai do caminho, qualquer que seja o tipo.', 'Nenhum: as duas mantêm rumo.', 'A lancha, porque é mais lenta.'], 1,
              'A Regra 13(a) se aplica “quaisquer que sejam as disposições” das Seções I e II, e a Regra 18 começa com “exceto quando disposto em contrário pelas Regras 9, 10 e 13”. Por isso o veleiro que alcança manobra. A hierarquia vela × motor (Regra 18) não vale na ultrapassagem. Ninguém “mantém rumo” sem regra, e ser mais lenta não muda a obrigação.',
              'RIPEAM, Regras 13 e 18'),
            q('m5l4-2', T_GOV, 1, 'À noite, você (lancha) vê pela proa uma lancha com as duas luzes de mastro quase alinhadas e as luzes de bordos verde e encarnada. Qual a ação correta?',
              ['Guinar para boreste.', 'Guinar para bombordo.', 'Manter rumo e velocidade.', 'Dar três apitos curtos e manter o rumo.'], 0,
              'Luzes de mastro alinhadas e as duas luzes de bordos indicam roda a roda (Regra 14(b)). As duas devem guinar para boreste e passar por bombordo uma da outra (14(a)). Guinar para bombordo leva ao choque se a outra cumprir a regra. Manter o rumo não resolve a situação. Três curtos significam “dando atrás”, não guinada.',
              'RIPEAM, Regras 14 e 34(a)'),
            q('m5l4-3', T_GOV, 2, 'Duas lanchas em rumos cruzados, com risco de abalroamento. A outra está na sua bochecha de bombordo. Você deve:',
              ['Guinar para bombordo e passar pela proa dela.', 'Manter rumo e velocidade, vigiando, e estar pronto para agir se ela não manobrar.', 'Parar as máquinas imediatamente.', 'Guinar para boreste, porque toda guinada é para boreste.'], 1,
              'Pela Regra 15, manobra quem vê a outra por boreste. Aqui é a outra que vê você por boreste; você é a embarcação que mantém rumo e velocidade (Regra 17(a)(I)), sempre vigiando para agir se preciso (17(a)(II) e (b)). Guinar para bombordo é o que a Regra 17(c) manda evitar. Parar ou guinar sem necessidade torna o seu movimento imprevisível.',
              'RIPEAM, Regras 15 e 17'),
            q('m5l4-4', T_GOV, 2, 'Você não tem certeza se está alcançando outra embarcação ou cruzando o rumo dela. O que diz o RIPEAM?',
              ['Considere que está alcançando e manobre de acordo.', 'Considere que é rumos cruzados.', 'Mantenha rumo e velocidade até ter certeza.', 'Siga quem for maior.'], 0,
              'A Regra 13(c) é clara: havendo dúvida, a embarcação deve considerar que está alcançando e manobrar de acordo. As outras alternativas deixam a dúvida a favor de quem vem por trás, o oposto do que a regra manda, e o tamanho não decide a situação.',
              'RIPEAM, Regra 13(c)')
          ] },
          { t: 'fontes', itens: [fR('Regras 11 a 15'), F_MIG15] }
        ]
      },
      /* ---------------- m5 l5 ---------------- */
      {
        id: 'l5', titulo: 'Dois veleiros: a Regra 12', minutos: 12,
        objetivos: [
          'Dizer por qual bordo um veleiro recebe o vento, inclusive com vento em popa.',
          'Aplicar a Regra 12 em bordos diferentes e no mesmo bordo.',
          'Saber o que fazer quando não dá para ver o bordo do outro.'
        ],
        blocos: [
          { t: 'p', html: 'Entre duas <strong>embarcações a vela</strong> no visual, com risco, a Regra 12 decide quem sai do caminho. Ela não fala em “boreste tem preferência” nem em tamanho. O que conta é <strong>por qual bordo cada barco recebe o vento</strong>.' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Bordos diferentes (12(a)(I))</strong>: quem recebe o vento <strong>por bombordo</strong> sai do caminho de quem recebe por boreste.',
            '<strong>Mesmo bordo (12(a)(II))</strong>: quem está <strong>a barlavento</strong> (do lado de onde vem o vento) sai do caminho de quem está a sotavento.',
            '<strong>Dúvida (12(a)(III))</strong>: se você recebe o vento por bombordo, vê um veleiro a barlavento e não consegue saber o bordo dele, saia do caminho dele.'
          ] },
          { t: 'h', txt: 'Como saber o bordo: a retranca manda' },
          { t: 'p', html: 'A Regra 12(b) define: o <strong>bordo de barlavento</strong> é o bordo <strong>oposto</strong> àquele em que está carregada a <strong>vela grande</strong>. Em outras palavras: olhe para a retranca. Se ela está aberta para boreste, o vento entra por bombordo — o barco está amurado por bombordo. Isso resolve o caso difícil do vento em popa, em que o vento vem quase de trás: não importa o que a biruta diz, vale o lado da vela grande. Balão e gennaker não entram na conta.' },
          { t: 'figura', svg: SVG_M5_REGRA12, legenda: 'Vento soprando de cima. Em (i), o barco da esquerda tem a retranca para boreste: recebe o vento por bombordo e manobra. Em (ii), os dois recebem o vento por boreste; o que está mais a barlavento manobra.' },
          { t: 'callout', tipo: 'dica', titulo: 'Para gravar', html: '“Bombordo cede; barlavento cede.” E, se não der para ver, quem está com vento por bombordo cede ao que está a barlavento.' },
          { t: 'h', txt: 'O que a Regra 12 não resolve' },
          { t: 'lista', itens: [
            'Um veleiro que <strong>ultrapassa</strong> outro veleiro segue a Regra 13: quem alcança sai do caminho, qualquer que seja o bordo.',
            'Um veleiro <strong>motorando</strong> não é “a vela” (Regra 3(c)): contra outro veleiro, ele é propulsão mecânica e sai do caminho pela Regra 18(a).',
            'Em canal estreito, veleiros não devem impedir a passagem de quem só pode navegar dentro do canal (Regra 9(b)), seja qual for o bordo.'
          ] },
          { t: 'widget', w: 'regras-governo', opts: { cenario: 'vela-bordos', vento: 0 }, legenda: 'Dois veleiros com vento de bordos diferentes. Gire os barcos e veja a retranca mudar de lado; troque para “mesmo bordo” no seletor de situação.' },
          { t: 'callout', tipo: 'nota', titulo: 'Em regata', html: 'Entre barcos que estão regatando, valem as Regras de Regata a Vela da World Sailing (Parte 2), com critérios próprios. Diante de quem não está na regata — um veleiro de passeio, uma lancha, um navio —, o barco em regata volta a obedecer ao RIPEAM.' },
          { t: 'termos', ids: ['regra-dos-veleiros', 'barlavento', 'sotavento', 'amurado', 'retranca', 'vento-em-popa'] },
          { t: 'check', questoes: [
            q('m5l5-1', T_GOV, 1, 'Dois veleiros a vela se cruzam com risco. O veleiro A recebe o vento por boreste; o B, por bombordo. Quem deve sair do caminho?',
              ['A, porque está a barlavento.', 'B, porque recebe o vento por bombordo.', 'O maior dos dois.', 'Os dois guinam para boreste.'], 1,
              'Com vento de bordos diferentes, a Regra 12(a)(I) manda sair do caminho quem recebe o vento por bombordo: o B. Barlavento só decide quando os dois estão no mesmo bordo (12(a)(II)). Tamanho não entra na Regra 12. Guinar os dois para boreste é a Regra 14, que vale para propulsão mecânica.',
              'RIPEAM, Regra 12(a)(I)'),
            q('m5l5-2', T_GOV, 2, 'Com vento em popa, a retranca de um veleiro está aberta para boreste. Para a Regra 12, esse veleiro recebe o vento por:',
              ['Boreste, porque a retranca está a boreste.', 'Bombordo, porque o bordo de barlavento é o oposto ao da vela grande.', 'Nenhum bordo, porque o vento é de popa.', 'O bordo indicado pela biruta do tope.'], 1,
              'A Regra 12(b) define o bordo de barlavento como o oposto ao da vela grande. Retranca a boreste significa vento “por bombordo”. A regra existe justamente para o vento em popa, em que a biruta pode oscilar; por isso não se usa a biruta, e não existe “nenhum bordo”.',
              'RIPEAM, Regra 12(b)'),
            q('m5l5-3', T_GOV, 2, 'Dois veleiros, ambos recebendo o vento por boreste, convergem. Quem deve se manter fora do caminho?',
              ['O que está a sotavento.', 'O que está a barlavento.', 'O que estiver mais à direita.', 'O mais rápido.'], 1,
              'No mesmo bordo, a Regra 12(a)(II) manda o veleiro a barlavento sair do caminho do que está a sotavento. Quem está a sotavento mantém rumo e velocidade. Posição “à direita” e velocidade não são critérios da Regra 12 (a velocidade só importaria numa ultrapassagem, Regra 13).',
              'RIPEAM, Regra 12(a)(II)'),
            q('m5l5-4', T_GOV, 3, 'Você veleja recebendo o vento por bombordo e vê outro veleiro a barlavento, mas não consegue saber por qual bordo ele recebe o vento. Você deve:',
              ['Manter rumo, pois na dúvida quem está a barlavento manobra.', 'Sair do caminho dele.', 'Dar dois apitos curtos e manter o rumo.', 'Ligar o motor e seguir como propulsão mecânica.'], 1,
              'É exatamente o caso da Regra 12(a)(III): com vento por bombordo e um veleiro a barlavento de bordo incerto, você deve se manter fora do caminho dele. Manter o rumo inverte a regra. Dois curtos (“guinando para bombordo”) são sinal de manobra de propulsão mecânica (Regra 34(a)). Ligar o motor muda a sua categoria, mas não resolve a dúvida e ainda o obriga a sair do caminho dele.',
              'RIPEAM, Regra 12(a)(III)')
          ] },
          { t: 'fontes', itens: [fR('Regras 3(c), 12 e 13'), F_MIG15, { txt: 'World Sailing, Regras de Regata a Vela (Racing Rules of Sailing), Parte 2 (preâmbulo)', url: 'https://www.sailing.org/inside-world-sailing/rules-regulations/racing-rules-of-sailing/' }] }
        ]
      },
      /* ---------------- m5 l6 ---------------- */
      {
        id: 'l6', titulo: 'Quem sai do caminho de quem: Regra 18 e canais estreitos', minutos: 14,
        objetivos: [
          'Aplicar a escada de responsabilidades da Regra 18.',
          'Navegar em canal estreito pela Regra 9 sem impedir quem depende do canal.',
          'Conhecer as obrigações básicas num esquema de separação de tráfego (Regra 10).'
        ],
        blocos: [
          { t: 'p', html: 'Quando as duas embarcações são de tipos diferentes, quem decide é a <strong>Regra 18</strong>. Ela vale “exceto quando disposto em contrário pelas Regras 9, 10 e 13”: canal estreito, esquema de separação de tráfego e ultrapassagem passam na frente.' },
          { t: 'lista', itens: [
            '<strong>18(a)</strong> — A de <strong>propulsão mecânica</strong> em movimento sai do caminho de: sem governo, manobra restrita, engajada na pesca e a vela.',
            '<strong>18(b)</strong> — A <strong>vela</strong> em movimento sai do caminho de: sem governo, manobra restrita e engajada na pesca.',
            '<strong>18(c)</strong> — A <strong>engajada na pesca</strong> em movimento sai, tanto quanto possível, do caminho de: sem governo e manobra restrita.',
            '<strong>18(d)</strong> — Todas, exceto sem governo e manobra restrita, evitam, se possível, <strong>impedir</strong> a passagem segura da <strong>restrita pelo calado</strong> que exibe os sinais da Regra 28. A restrita pelo calado navega com cuidado redobrado.',
            '<strong>18(e) e (f)</strong> — Hidroavião na água fica bem afastado de todos e evita impedir a navegação; se houver risco de colisão, cumpre as regras. A nave de voo rasante (efeito de solo) faz o mesmo ao decolar, pousar e voar perto da superfície; na superfície da água, segue as regras como embarcação de propulsão mecânica.'
          ] },
          { t: 'figura', svg: SVG_M5_HIERARQUIA, legenda: 'A escada da Regra 18. A restrita pelo calado não está “acima” no mesmo sentido: as outras devem <em>não impedir</em> a passagem dela (Regra 18(d)).' },
          { t: 'callout', tipo: 'seguranca', titulo: '“Pesca” não é qualquer barco de pesca', html: 'Só conta como <strong>engajada na pesca</strong> quem está pescando com redes, linhas ou arrasto que restringem a manobra, e exibe as luzes ou marcas da Regra 26. Um pesqueiro voltando para o porto, ou pescando de corrico, é propulsão mecânica comum.' },
          { t: 'h', txt: 'Regra 9: canais estreitos' },
          { t: 'lista', itens: [
            '<strong>9(a)</strong> — Navegue o mais próximo possível, com segurança, do limite do canal que fica a seu <strong>boreste</strong>.',
            '<strong>9(b)</strong> — Embarcações com <strong>menos de 20 m</strong> e <strong>veleiros</strong> não devem impedir a passagem de quem só pode navegar com segurança dentro do canal. Qualquer veleiro de menos de 20 m, como um de 32 pés (cerca de 10 m), está nos dois grupos.',
            '<strong>9(c)</strong> — Quem está pescando não deve impedir a passagem de ninguém que navega no canal.',
            '<strong>9(d)</strong> — Não cruze o canal se isso impedir quem depende dele. Na dúvida sobre a sua intenção, o navio pode dar o sinal de dúvida de cinco curtos.',
            '<strong>9(e)</strong> — Ultrapassagem que exige manobra da alcançada é combinada por apito (Regra 34(c)). A Regra 13 continua valendo.',
            '<strong>9(f) e (g)</strong> — Em curvas com visão obstruída, navegue com cuidado e dê um apito longo (Regra 34(e)). Evite fundear em canal estreito.'
          ] },
          { t: 'figura', svg: SVG_M5_CANAL, legenda: 'Cada um pelo seu boreste. No balizamento da Região B, quem entra vindo do mar tem as boias encarnadas a boreste e as verdes a bombordo (módulo de balizamento). O veleiro fica fora do caminho do navio.' },
          { t: 'p', html: 'Exemplos no Brasil: os canais de acesso de portos como Santos, Paranaguá, Itajaí, Rio Grande e Suape, a entrada do porto de Cabedelo, e trechos de hidrovias como a Tietê-Paraná, onde comboios de barcaças quase não conseguem desviar. Veja também o que a NORMAM-211 diz sobre essas áreas:' },
          { t: 'fato', ref: 'extra-mestre-2-02', html: 'Pela NORMAM-211, canais de acesso aos portos, fundeadouros de navios mercantes e proximidades das instalações do porto são áreas de segurança: não é permitido trafegar ou fundear nelas; o tráfego de recreio para chegar a marinas e clubes é regulado pelas NPCP/NPCF.' },
          { t: 'h', txt: 'Regra 10: esquemas de separação de tráfego' },
          { t: 'p', html: 'Em áreas de tráfego intenso, a IMO adota esquemas com <strong>vias de tráfego</strong> de mão única separadas por zonas (como no <span class="agua">Estreito de Gibraltar</span> ou no <span class="agua">Canal da Mancha</span>). Quem usa o esquema segue a via no sentido do fluxo. Quem precisa cruzar o faz com rumo <strong>o mais perto possível da perpendicular</strong> ao fluxo (10(c)). Barcos com menos de 20 m e veleiros não devem dificultar a passagem de quem navega na via (10(j)) e podem usar a zona de tráfego costeiro (10(d)).' },
          { t: 'widget', w: 'regras-governo', opts: { cenario: 'hierarquia' }, legenda: 'Escolha o tipo de cada embarcação e veja quem a Regra 18 manda sair do caminho.' },
          { t: 'widget', w: 'regras-governo', opts: { modo: 'desafio' }, legenda: 'Desafio final do módulo: todas as situações misturadas.' },
          { t: 'termos', ids: ['hierarquia-de-manobra', 'canal-estreito', 'esquema-de-separacao-de-trafego', 'engajada-na-pesca', 'restrita-pelo-calado', 'manobrabilidade-restrita'] },
          { t: 'check', questoes: [
            q('m5l6-1', T_GOV, 1, 'Em mar aberto, uma lancha e um veleiro navegando a vela se cruzam com risco. A lancha vem pelo boreste do veleiro. Quem manobra?',
              ['O veleiro, porque vê a lancha por boreste.', 'A lancha, porque propulsão mecânica sai do caminho de embarcação a vela.', 'Os dois guinam para boreste.', 'Quem for menor.'], 1,
              'A Regra 15 (quem vê a outra por boreste manobra) só vale entre duas de propulsão mecânica. Entre lancha e veleiro a vela, decide a Regra 18(a)(IV): a de propulsão mecânica sai do caminho. “Os dois guinam para boreste” é a Regra 14, também só entre propulsão mecânica. Tamanho não é critério.',
              'RIPEAM, Regras 15 e 18(a)'),
            q('m5l6-2', T_GOV, 2, 'Você veleja (a vela) e se aproxima de um barco que arrasta uma rede e exibe os sinais de pesca de arrasto. Quem deve sair do caminho?',
              ['O pesqueiro, porque veleiro tem preferência sobre motor.', 'O veleiro, porque a vela sai do caminho de embarcação engajada na pesca.', 'Nenhum: os dois mantêm rumo.', 'O pesqueiro, se estiver por boreste do veleiro.'], 1,
              'A Regra 18(b)(III) manda a embarcação a vela em movimento sair do caminho da engajada na pesca. A pesca com rede restringe a manobra; por isso ela está acima da vela na escada. A posição por boreste não importa entre categorias diferentes.',
              'RIPEAM, Regra 18(b)'),
            q('m5l6-3', T_GOV, 2, 'Num canal estreito de acesso a um porto, seu veleiro de 10 m encontra um navio que só pode navegar com segurança dentro do canal. O que diz a Regra 9?',
              ['O navio deve sair do caminho, porque o veleiro está a vela.', 'O veleiro não deve impedir a passagem do navio e deve navegar junto ao limite do canal a seu boreste.', 'O veleiro deve cruzar o canal rapidamente pela proa do navio.', 'O veleiro deve fundear no meio do canal e esperar.'], 1,
              'A Regra 9(b) proíbe embarcações com menos de 20 m e veleiros de impedir a passagem de quem só pode navegar no canal, e a 9(a) manda navegar junto ao limite a boreste. A Regra 18 vale “exceto” quando a 9 dispõe em contrário, então a vela não dá preferência aqui. Cruzar pela proa é o que a 9(d) proíbe, e fundear no canal é o que a 9(g) manda evitar.',
              'RIPEAM, Regras 9 e 18'),
            q('m5l6-4', T_GOV, 3, 'Uma embarcação de pesca arrastando rede se aproxima de uma draga trabalhando (manobra restrita). Pela Regra 18, quem deve se afastar?',
              ['A draga, porque pesca tem prioridade.', 'O pesqueiro, tanto quanto possível.', 'As duas guinam para boreste.', 'A que estiver a barlavento.'], 1,
              'A Regra 18(c)(II) manda a embarcação engajada na pesca manter-se, tanto quanto possível, afastada do caminho da que tem capacidade de manobra restrita. A draga está acima na escada. Guinar as duas para boreste é regra de propulsão mecânica em roda a roda, e barlavento só importa entre veleiros.',
              'RIPEAM, Regra 18(c)')
          ] },
          { t: 'fontes', itens: [fR('Regras 8(f), 9, 10 e 18'), F_MIG15, { txt: 'NORMAM-211/DPC, art. 1.9 (áreas de segurança)', url: NORMAM211, ref: 'extra-mestre-2-02' }] }
        ]
      }
    ]
  });

  /* =====================================================================================
     m6 — RIPEAM: luzes e marcas
     ===================================================================================== */
  function luz(x, y, cor, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 8) + '" fill="var(--nav-' + cor + ')" stroke="currentColor" stroke-width="1"/>'; }
  var SVG_M6_SETORES =
    '<svg viewBox="0 0 440 330" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Setores das luzes de mastro, de bordos e de alcançado, vistos de cima</title>' +
    '<path d="M101.7,209 A128,128 0 1 1 338.3,209" fill="none" stroke="currentColor" stroke-width="11"/>' +
    '<path d="M101.7,209 A128,128 0 1 1 338.3,209" fill="none" stroke="var(--nav-white)" stroke-width="7"/>' +
    '<path d="M220,160 L220,50 A110,110 0 0 1 321.6,202.1 Z" fill="var(--nav-green)" opacity="0.85"/>' +
    '<path d="M220,160 L118.4,202.1 A110,110 0 0 1 220,50 Z" fill="var(--nav-red)" opacity="0.85"/>' +
    '<path d="M220,160 L321.6,202.1 A110,110 0 0 1 118.4,202.1 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.2"/>' +
    '<line x1="90" y1="160" x2="350" y2="160" stroke="currentColor" stroke-dasharray="4 4"/>' +
    '<path d="M220,128 C228,140 228,170 225,186 L215,186 C212,170 212,140 220,128 Z" fill="var(--magenta)"/>' +
    '<g font-size="15" fill="currentColor">' +
    '<text x="220" y="18" text-anchor="middle" font-weight="700">luz de mastro: branca, 225°</text>' +
    '<text x="436" y="50" text-anchor="end">boreste:</text><text x="436" y="68" text-anchor="end">verde,</text><text x="436" y="86" text-anchor="end">112,5°</text>' +
    '<text x="4" y="50">bombordo:</text><text x="4" y="68">encarnada,</text><text x="4" y="86">112,5°</text>' +
    '<text x="220" y="300" text-anchor="middle" font-weight="700">alcançado: branca, 135°</text>' +
    '<text x="436" y="232" text-anchor="end">22,5° por ante</text><text x="436" y="250" text-anchor="end">a ré do través</text>' +
    '<text x="355" y="165">través</text></g>' +
    '</svg>';

  function casco(x0) { /* casco visto de lado, proa à direita, 105 de comprimento */
    return '<path d="M' + x0 + ',160 L' + (x0 + 110) + ',160 L' + (x0 + 98) + ',178 L' + (x0 + 10) + ',178 Z" fill="var(--sea-3)" stroke="currentColor" stroke-width="1.5"/>' +
      '<line x1="' + (x0 + 50) + '" y1="160" x2="' + (x0 + 50) + '" y2="34" stroke="currentColor" stroke-width="2.5"/>' +
      '<line x1="' + (x0 + 50) + '" y1="36" x2="' + (x0 + 108) + '" y2="158" stroke="currentColor" stroke-width="1"/>' +
      '<line x1="' + (x0 + 50) + '" y1="36" x2="' + (x0 + 4) + '" y2="158" stroke="currentColor" stroke-width="1"/>';
  }
  var SVG_M6_VELEIRO =
    '<svg viewBox="0 0 400 260" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Luzes de um veleiro de cruzeiro: a vela com luzes no convés, a vela com tricolor e motorando</title>' +
    casco(10) + luz(112, 152, 'green', 6) + luz(16, 152, 'white', 6) +
    casco(143) + '<rect x="185" y="24" width="18" height="10" fill="var(--nav-white)" stroke="currentColor"/><rect x="185" y="24" width="6" height="10" fill="var(--nav-red)"/><rect x="197" y="24" width="6" height="10" fill="var(--nav-green)"/>' +
    casco(276) + luz(326, 92, 'white', 6) + luz(378, 152, 'green', 6) + luz(282, 152, 'white', 6) +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="65" y="200" font-weight="700">A vela</text><text x="65" y="217">bordos na proa</text><text x="65" y="234">e alcançado</text>' +
    '<text x="198" y="200" font-weight="700">A vela, até 20 m</text><text x="198" y="217">tricolor no tope</text><text x="198" y="234">(Regra 25(b))</text>' +
    '<text x="331" y="200" font-weight="700">Motorando</text><text x="331" y="217">mastro, bordos</text><text x="331" y="234">e alcançado</text></g>' +
    '<text x="200" y="256" font-size="13" text-anchor="middle" fill="currentColor">vistos por boreste: a luz de bordo aparece verde</text>' +
    '</svg>';

  function coluna(x, rot1, rot2, rot3, cores) {
    var s = '<rect x="' + (x - 34) + '" y="10" width="68" height="120" rx="4" fill="var(--sea-3)"/>';
    cores.forEach(function (c, i) { s += luz(x, 36 + i * 30, c, 9); });
    return s + '<text x="' + x + '" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + rot1 + '</text>' +
      '<text x="' + x + '" y="170" text-anchor="middle" font-size="14" fill="currentColor">' + rot2 + '</text>' +
      '<text x="' + x + '" y="188" text-anchor="middle" font-size="14" fill="currentColor">' + rot3 + '</text>';
  }
  var SVG_M6_PARES =
    '<svg viewBox="0 0 400 198" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Luzes circulares no tope: arrasto, outra pesca, praticagem e rebocador visto de frente</title>' +
    coluna(50, 'Arrasto', 'verde', 'sobre branca', ['green', 'white']) + coluna(150, 'Outra pesca', 'encarnada', 'sobre branca', ['red', 'white']) +
    coluna(250, 'Prático', 'branca sobre', 'encarnada', ['white', 'red']) + coluna(350, 'Rebocando', '2 luzes', 'de mastro', ['white', 'white']) +
    '</svg>';

  function forma(tipo, x, y) {
    if (tipo === 'esf') return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="currentColor"/>';
    if (tipo === 'los') return '<polygon points="' + x + ',' + (y - 15) + ' ' + (x + 9) + ',' + y + ' ' + x + ',' + (y + 15) + ' ' + (x - 9) + ',' + y + '" fill="currentColor"/>';
    if (tipo === 'cil') return '<rect x="' + (x - 8) + '" y="' + (y - 16) + '" width="16" height="32" fill="currentColor"/>';
    if (tipo === 'conebaixo') return '<polygon points="' + (x - 9) + ',' + (y - 9) + ' ' + (x + 9) + ',' + (y - 9) + ' ' + x + ',' + (y + 9) + '" fill="currentColor"/>';
    if (tipo === 'ampulheta') return '<polygon points="' + (x - 9) + ',' + (y - 16) + ' ' + (x + 9) + ',' + (y - 16) + ' ' + x + ',' + y + '" fill="currentColor"/><polygon points="' + x + ',' + y + ' ' + (x - 9) + ',' + (y + 16) + ' ' + (x + 9) + ',' + (y + 16) + '" fill="currentColor"/>';
    return '';
  }
  function celula(x, y, formas, l1, l2) {
    var s = '<line x1="' + x + '" y1="' + (y + 4) + '" x2="' + x + '" y2="' + (y + 104) + '" stroke="currentColor" stroke-width="1" opacity="0.5"/>';
    var n = formas.length, passo = 28, topo = y + 54 - (n - 1) * passo / 2;
    formas.forEach(function (f, i) { s += forma(f, x, topo + i * passo); });
    return s + '<text x="' + x + '" y="' + (y + 124) + '" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + l1 + '</text>' +
      '<text x="' + x + '" y="' + (y + 141) + '" text-anchor="middle" font-size="14" fill="currentColor">' + l2 + '</text>';
  }
  var SVG_M6_MARCAS =
    '<svg viewBox="0 0 400 310" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Marcas diurnas pretas do RIPEAM</title>' +
    celula(50, 0, ['esf'], 'Fundeada', '1 esfera') + celula(150, 0, ['esf', 'esf'], 'Sem governo', '2 esferas') +
    celula(250, 0, ['esf', 'esf', 'esf'], 'Encalhada', '3 esferas') + celula(350, 0, ['esf', 'los', 'esf'], 'Manobra', 'restrita') +
    celula(50, 155, ['cil'], 'Calado', 'cilindro') + celula(150, 155, ['ampulheta'], 'Pesca', '2 cones') +
    celula(250, 155, ['conebaixo'], 'Vela e motor', '1 cone') + celula(350, 155, ['los'], 'Reboque', 'mais de 200 m') +
    '</svg>';

  function cartao(x, y, conteudo, l1, l2, l3) {
    return '<rect x="' + x + '" y="' + y + '" width="185" height="118" rx="6" fill="var(--sea-3)"/>' + conteudo +
      '<text x="' + (x + 92) + '" y="' + (y + 136) + '" text-anchor="middle" font-size="14" fill="currentColor">' + l1 + '</text>' +
      '<text x="' + (x + 92) + '" y="' + (y + 153) + '" text-anchor="middle" font-size="14" fill="currentColor">' + l2 + '</text>' +
      '<text x="' + (x + 92) + '" y="' + (y + 170) + '" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + l3 + '</text>';
  }
  var SVG_M6_NOITE =
    '<svg viewBox="0 0 400 372" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Quatro exemplos de luzes vistas à noite e o que elas indicam</title>' +
    cartao(8, 8, luz(110, 34, 'white') + luz(124, 92, 'green'), 'Branca alta e verde:', 'lancha vista', 'por boreste') +
    cartao(207, 8, luz(300, 30, 'white') + luz(300, 58, 'white') + luz(276, 96, 'green') + luz(324, 96, 'red'), 'Duas brancas, verde', 'e encarnada:', 'navio vindo de frente') +
    cartao(8, 192, luz(100, 218, 'green') + luz(100, 244, 'white') + luz(72, 284, 'red'), 'Verde sobre branca', 'e encarnada: arrasto', 'visto por bombordo') +
    cartao(207, 192, luz(278, 284, 'red'), 'Só encarnada, sem', 'branca acima: veleiro', 'visto por bombordo') +
    '</svg>';

  M.push({
    id: 'm6', titulo: 'RIPEAM: luzes e marcas',
    resumo: 'Regras 20 a 31 e Anexo I: setores e alcances das luzes, o que lanchas, veleiros, pesqueiros, rebocadores, práticos e navios com restrições exibem, marcas diurnas, fundeio e encalhe, e um método para ler a noite. NORMAM-211, Anexo 5-A, 3.1 f) I.',
    licoes: [
      /* ---------------- m6 l1 ---------------- */
      {
        id: 'l1', titulo: 'Como as luzes funcionam: Regras 20, 21 e 22', minutos: 12,
        objetivos: [
          'Saber quando acender as luzes e quando usar as marcas diurnas.',
          'Conhecer cor e setor de cada luz (mastro, bordos, alcançado, reboque, circular).',
          'Ler a tabela de alcances mínimos pelo comprimento da embarcação.'
        ],
        blocos: [
          { t: 'p', html: 'À noite você não vê barcos: vê <strong>luzes</strong>. O RIPEAM organiza essas luzes para que, só de olhar, você saiba <em>o que</em> é a outra embarcação, <em>para onde</em> ela vai e <em>o que</em> está fazendo. De dia, a mesma informação vem pelas <strong>marcas</strong>: esferas, cones, cilindros e losangos pretos.' },
          { t: 'h', txt: 'Regra 20: quando exibir' },
          { t: 'lista', itens: [
            'As regras de luzes valem <strong>do pôr ao nascer do Sol</strong>, em qualquer tempo. Nesse período não se exibe outra luz que possa ser confundida com as do RIPEAM, que atrapalhe a visão delas ou a vigilância.',
            'As luzes, se instaladas, também são exibidas <strong>de dia em visibilidade restrita</strong> e podem ser exibidas sempre que parecer necessário.',
            'As regras de <strong>marcas</strong> valem durante o dia.',
            'Posição e especificações técnicas ficam no <strong>Anexo I</strong>.'
          ] },
          { t: 'fato', ref: 'tecnico-11', html: 'A NORMAM-211 exige que todas as embarcações, em navegação noturna, exibam luzes de navegação conforme a Parte C do RIPEAM.' },
          { t: 'fato', ref: 'tecnico-09', html: 'Pela NORMAM-211, só as embarcações que têm as luzes de navegação previstas no RIPEAM podem operar sem restrição de horário, de dia ou à noite.' },
          { t: 'h', txt: 'Regra 21: as luzes e os seus setores' },
          { t: 'tabela', cab: ['Luz', 'Cor', 'Setor visível', 'Onde fica'], linhas: [
            ['Mastro', 'Branca', '225°: da proa até 22,5° por ante a ré do través de cada bordo', 'No eixo do barco, a vante'],
            ['Bordos', 'Verde a boreste, encarnada a bombordo', '112,5° cada: da proa até 22,5° por ante a ré do través do seu bordo', 'Nos bordos (ou combinadas numa lanterna no eixo, abaixo de 20 m)'],
            ['Alcançado', 'Branca', '135°: 67,5° para cada bordo a partir da popa', 'O mais perto possível da popa'],
            ['Reboque', 'Amarela', 'Igual à de alcançado (135°)', 'Acima da luz de alcançado'],
            ['Circular', 'Conforme a regra', '360°', 'Onde melhor possa ser vista'],
            ['Intermitente', 'Conforme a regra', '—', 'Lampeja 120 vezes por minuto ou mais']
          ] },
          { t: 'figura', svg: SVG_M6_SETORES, legenda: 'Setores vistos de cima. Bordos + alcançado fecham os 360° (112,5 + 112,5 + 135). A luz de mastro cobre exatamente o mesmo arco das duas luzes de bordos juntas.' },
          { t: 'p', html: 'Repare na geometria. De qualquer direção, você vê <strong>ou</strong> luz de bordo <strong>ou</strong> luz de alcançado, nunca as duas ao mesmo tempo (o Anexo I, Seção 9, só tolera uma pequena faixa de transição, de 1° a 3° nas luzes de bordos e até 5° nas demais). E o limite de 22,5° por ante a ré do través é o mesmo da ultrapassagem da Regra 13: quem só vê a luz de alcançado está alcançando.' },
          { t: 'callout', tipo: 'nota', titulo: '“Encarnada”', html: 'O texto oficial do RIPEAM em português chama o vermelho das luzes de <strong>encarnado</strong>. A prova usa esse termo.' },
          { t: 'h', txt: 'Regra 22: alcances mínimos (em milhas náuticas)' },
          { t: 'tabela', cab: ['Luz', '50 m ou mais', '12 m a menos de 50 m', 'Menos de 12 m'], linhas: [
            ['Mastro', '6', '5 (3 se tiver menos de 20 m)', '2'],
            ['Bordos', '3', '2', '1'],
            ['Alcançado', '3', '2', '2'],
            ['Reboque', '3', '2', '2'],
            ['Circular (branca, encarnada, verde ou amarela)', '3', '2', '2']
          ], legenda: 'Regra 22. Objetos parcialmente submersos rebocados: luz circular branca de 3 milhas (22(d)).' },
          { t: 'p', html: 'Consequência prática: num veleiro de menos de 12 m (por exemplo, um de 32 pés, cerca de 9,75 m), as luzes de bordos só precisam ser vistas a 1 milha. Um navio que vem a 15 nós percorre 1 milha em 4 minutos. Por isso barco pequeno, à noite, precisa de vigia atenta e de luzes limpas e bem instaladas.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'pm', aspecto: 20 }, legenda: 'Gire o aspecto e veja quais luzes de uma lancha aparecem em cada direção.' },
          { t: 'termos', ids: ['luzes-de-navegacao', 'luz-de-mastro', 'luzes-de-bordos', 'luz-de-alcancado', 'marcas-diurnas', 'milha-nautica'] },
          { t: 'check', questoes: [
            q('m6l1-1', T_LUZ, 1, 'A luz de mastro definida na Regra 21 é:',
              ['Branca, visível num setor de 225°, da proa até 22,5° por ante a ré do través de cada bordo.', 'Branca, visível em 360°.', 'Amarela, visível num setor de 135° pela popa.', 'Branca, visível num setor de 112,5° por boreste.'], 0,
              'A Regra 21(a) define a luz de mastro como branca, contínua, no eixo longitudinal, visível em 225° da proa até 22,5° por ante a ré do través em ambos os bordos. Visível em 360° é a luz circular (21(e)). Amarela de 135° é a luz de reboque (21(d)). 112,5° é o setor de cada luz de bordo, que é colorida.',
              'RIPEAM, Regra 21'),
            q('m6l1-2', T_LUZ, 2, 'Numa embarcação com menos de 12 m, qual o alcance mínimo das luzes de bordos?',
              ['3 milhas.', '2 milhas.', '1 milha.', '5 milhas.'], 2,
              'A Regra 22(c) fixa 1 milha para as luzes de bordos em embarcações com menos de 12 m (mastro, alcançado, reboque e circulares: 2 milhas). Duas milhas é o valor para bordos entre 12 e 50 m; três milhas, para 50 m ou mais; cinco milhas é a luz de mastro de 20 a 50 m.',
              'RIPEAM, Regra 22'),
            q('m6l1-3', T_LUZ, 1, 'Pela Regra 20, as luzes de navegação devem ser exibidas:',
              ['Só quando houver outra embarcação por perto.', 'Do pôr ao nascer do Sol e, se instaladas, também de dia em visibilidade restrita.', 'Só em noites sem Lua.', 'Só fora dos portos.'], 1,
              'A Regra 20(b) manda exibir as luzes do pôr ao nascer do Sol, e a 20(c) manda exibi-las também entre o nascer e o pôr do Sol em visibilidade restrita. Não há exceção para “ninguém por perto”, Lua ou áreas portuárias.',
              'RIPEAM, Regra 20')
          ] },
          { t: 'fontes', itens: [fR('Regras 20, 21 e 22 e Anexo I, Seção 9'), { txt: 'NORMAM-211/DPC, itens 4.3.3 e 4.18.6', url: NORMAM211, ref: 'tecnico-11' }, F_MIG15] }
        ]
      },
      /* ---------------- m6 l2 ---------------- */
      {
        id: 'l2', titulo: 'Lanchas e veleiros: Regras 23 e 25', minutos: 13,
        objetivos: [
          'Saber as luzes da embarcação de propulsão mecânica e as opções para menos de 12 m e de 7 m.',
          'Escolher as luzes certas do seu veleiro a vela e motorando.',
          'Reconhecer o cone de quem navega a vela e a motor.'
        ],
        blocos: [
          { t: 'h', txt: 'Regra 23: propulsão mecânica em movimento' },
          { t: 'lista', itens: [
            '<strong>Luz de mastro a vante</strong>.',
            '<strong>Segunda luz de mastro</strong>, a ré e mais alta que a de vante. Com menos de 50 m ela é facultativa; com 50 m ou mais, obrigatória.',
            '<strong>Luzes de bordos</strong> e <strong>luz de alcançado</strong>.',
            'Colchão de ar operando sem calado: além disso, uma circular <strong>amarela intermitente</strong> (23(b)).',
            'Menos de <strong>12 m</strong>: pode trocar as luzes acima por uma <strong>circular branca</strong> e luzes de bordos (23(d)(I)).',
            'Menos de <strong>7 m</strong> e até <strong>7 nós</strong>: pode exibir só uma circular branca e, se possível, as luzes de bordos (23(d)(II)).'
          ] },
          { t: 'p', html: 'As duas luzes de mastro ajudam muito à noite: a de vante é mais baixa, a de ré mais alta. Se elas aparecem alinhadas, o navio aponta para você. Se a baixa está à direita da alta, a proa dele aponta para a sua direita.' },
          { t: 'h', txt: 'Regra 25: veleiros e embarcações a remo' },
          { t: 'lista', itens: [
            '<strong>25(a)</strong> — A vela em movimento: <strong>luzes de bordos e luz de alcançado</strong>. Não há luz de mastro: veleiro a vela não tem luz branca para vante.',
            '<strong>25(b)</strong> — Com menos de 20 m, essas três luzes podem estar numa <strong>lanterna combinada</strong> (a “tricolor”) no tope do mastro ou perto dele.',
            '<strong>25(c)</strong> — Opcional: duas circulares no tope, <strong>encarnada sobre verde</strong>, além das luzes de bordos e de alcançado. Nunca junto com a tricolor.',
            '<strong>25(d)</strong> — Veleiro com menos de 7 m e embarcação a remo: se possível, as luzes da 25(a) ou (b); senão, uma <strong>lanterna de luz branca</strong> pronta para mostrar a tempo de evitar a colisão.',
            '<strong>25(e)</strong> — Navegando a vela e usando o motor: de dia, <strong>um cone com o vértice para baixo</strong>, a vante. À noite, as luzes de propulsão mecânica.'
          ] },
          { t: 'figura', svg: SVG_M6_VELEIRO, legenda: 'As três configurações mais comuns num veleiro de cruzeiro.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Desligue a tricolor ao ligar o motor', html: 'A lanterna tricolor é uma opção só para quem navega <strong>a vela</strong> (Regra 25(b)). Ao ligar o motor, o barco passa a ser de propulsão mecânica (Regra 3) e deve mostrar a luz de mastro, as luzes de bordos e a de alcançado (Regra 23). É por isso que os veleiros de cruzeiro têm luzes de bordos também na proa, no convés, e uma luz de mastro (de “motor”) presa à frente do mastro, abaixo das cruzetas. Erro clássico: motorar à noite com a tricolor acesa. Quem vê de fora acha que você é um veleiro a vela.' },
          { t: 'p', html: 'A vantagem da tricolor navegando a vela: ela fica alta, longe dos borrifos e das ondas, e gasta só uma lâmpada. A desvantagem: perto de outro barco, ela fica tão alta que pode passar despercebida. Muitos cruzeiristas usam a tricolor em mar aberto e as luzes do convés perto da costa e dos portos.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'vela', opcoes: { tricolor: true }, aspecto: 300 }, legenda: 'Um veleiro com tricolor visto pela bochecha de bombordo. Troque para “Vela e motor” e veja a luz de mastro aparecer.' },
          { t: 'callout', tipo: 'dica', titulo: 'Veleiro de frente parece pequeno', html: 'Um veleiro a vela visto pela proa mostra só a verde e a encarnada, sem branca acima. Não há como estimar o tamanho. Na dúvida, trate qualquer par verde-encarnada sem branca como um veleiro a vela vindo na sua direção.' },
          { t: 'termos', ids: ['lanterna-tricolor', 'luz-de-mastro', 'luzes-de-bordos', 'luz-de-alcancado', 'embarcacao-a-vela', 'embarcacao-de-propulsao-mecanica'] },
          { t: 'check', questoes: [
            q('m6l2-1', T_LUZ, 1, 'Um veleiro de 10 m navegando só a vela, à noite, pode exibir:',
              ['Uma lanterna tricolor no tope do mastro.', 'Luz de mastro, luzes de bordos e luz de alcançado.', 'Duas luzes circulares encarnadas em linha vertical.', 'Só uma luz circular branca no tope.'], 0,
              'A Regra 25(b) permite que a embarcação a vela com menos de 20 m combine as luzes de bordos e de alcançado numa lanterna no tope. Luz de mastro é luz de propulsão mecânica (Regra 23) e indicaria que o motor está em uso. Duas encarnadas são de embarcação sem governo (Regra 27(a)). Uma circular branca sozinha é opção de lancha pequena (Regra 23(d)) ou de embarcação fundeada (Regra 30).',
              'RIPEAM, Regras 23, 25 e 27'),
            q('m6l2-2', T_LUZ, 2, 'À noite, você baixa as velas e liga o motor do seu veleiro. Quais luzes deve exibir?',
              ['A tricolor, porque continua sendo um veleiro.', 'Luz de mastro, luzes de bordos e luz de alcançado.', 'A tricolor e as circulares encarnada sobre verde.', 'Só a luz de alcançado.'], 1,
              'Com o motor em uso, o veleiro é embarcação de propulsão mecânica (Regra 3(b) e (c)) e exibe as luzes da Regra 23(a): mastro, bordos e alcançado (ou, abaixo de 12 m, circular branca e bordos pela 23(d)(I)). A tricolor é exclusiva de quem está a vela (25(b)). Tricolor com encarnada sobre verde é proibido até para veleiro a vela (25(c)). Só a de alcançado é insuficiente.',
              'RIPEAM, Regras 3, 23 e 25'),
            q('m6l2-3', T_LUZ, 2, 'Uma lancha de 9 m, em vez das luzes da Regra 23(a), pode exibir:',
              ['Uma luz circular branca e luzes de bordos.', 'Só as luzes de bordos.', 'Duas luzes circulares brancas em linha vertical.', 'Uma luz circular amarela intermitente.'], 0,
              'A Regra 23(d)(I) permite à embarcação de propulsão mecânica com menos de 12 m exibir uma luz circular branca e luzes de bordos. Só bordos não basta. Duas brancas em linha vertical indicam reboque (Regra 24). A amarela intermitente é do colchão de ar (23(b)).',
              'RIPEAM, Regra 23(d)'),
            q('m6l2-4', T_LUZ, 1, 'De dia, um veleiro navega com as velas içadas e o motor ligado. Que marca deve exibir a vante?',
              ['Uma esfera preta.', 'Um cone preto com o vértice para baixo.', 'Dois cones unidos pelos vértices.', 'Nenhuma marca.'], 1,
              'A Regra 25(e) manda quem navega a vela e usa a propulsão mecânica exibir a vante um cone com o vértice para baixo. A esfera é de embarcação fundeada (Regra 30). Dois cones unidos pelos vértices são de pesca (Regra 26). Sem marca, os outros achariam que é um veleiro a vela.',
              'RIPEAM, Regra 25(e)')
          ] },
          { t: 'fontes', itens: [fR('Regras 3, 23 e 25'), F_MIG15] }
        ]
      },
      /* ---------------- m6 l3 ---------------- */
      {
        id: 'l3', titulo: 'Pesca, reboque e praticagem: Regras 24, 26 e 29', minutos: 13,
        objetivos: [
          'Distinguir pesca de arrasto e outras pescas pelas luzes e marcas.',
          'Reconhecer um rebocador, o comprimento do reboque e o que é rebocado.',
          'Reconhecer a embarcação de praticagem em serviço.'
        ],
        blocos: [
          { t: 'p', html: 'Estas embarcações estão ocupadas com um trabalho e exibem luzes <strong>circulares no tope</strong>, em linha vertical, que dizem qual é o trabalho. Na costa brasileira você vai encontrar pesqueiros quase toda noite, rebocadores em todos os portos e lanchas de prático nas barras.' },
          { t: 'h', txt: 'Regra 26: embarcações de pesca' },
          { t: 'lista', itens: [
            '<strong>Arrasto</strong> (rede ou outro aparelho arrastado pela água): duas circulares, <strong>verde sobre branca</strong>; de dia, <strong>dois cones unidos pelos vértices</strong>. Também uma luz de mastro a ré e acima da verde (obrigatória com 50 m ou mais). Com seguimento, mais luzes de bordos e de alcançado.',
            '<strong>Outra pesca</strong> (rede de espera, espinhel, linha): duas circulares, <strong>encarnada sobre branca</strong>; de dia, os mesmos dois cones. Com seguimento, luzes de bordos e alcançado. Se o aparelho se estende a mais de 150 m, uma circular branca ou um cone com o vértice para cima indica o lado do aparelho.',
            'Quem <strong>não está pescando</strong> não exibe estas luzes, só as do seu comprimento (26(e)).'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Para gravar', html: '<strong>Verde em cima: arrasto.</strong> <strong>Encarnada em cima: outra pesca.</strong> A branca fica embaixo nas duas. No prático é o contrário: a branca fica em cima.' },
          { t: 'h', txt: 'Regra 24: rebocando e empurrando' },
          { t: 'lista', itens: [
            '<strong>Rebocando pela popa</strong>: duas luzes de mastro em linha vertical (<strong>três</strong> se o reboque, da popa do rebocador à popa do rebocado, passa de <strong>200 m</strong>), luzes de bordos, luz de alcançado e, acima dela, a <strong>luz de reboque amarela</strong>. Com mais de 200 m, de dia, um <strong>losango</strong>.',
            '<strong>Empurrando ou rebocando a contrabordo</strong> (exceto unidade integrada): duas luzes de mastro em linha vertical, bordos e alcançado.',
            '<strong>Unidade integrada</strong> (empurrador rigidamente ligado à barcaça): é tratada como uma só embarcação de propulsão mecânica (24(b)).',
            '<strong>Rebocado</strong>: luzes de bordos e de alcançado; losango se o reboque passar de 200 m. Objetos semissubmersos difíceis de ver (24(g)) têm luzes circulares brancas nas extremidades.',
            'Quem não costuma rebocar e reboca alguém em perigo (24(i)) não é obrigado a exibir essas luzes, mas deve mostrar a ligação, por exemplo <strong>iluminando o cabo de reboque</strong> (Regra 36).'
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'Nunca passe entre o rebocador e o rebocado', html: 'O cabo de reboque pode estar submerso no meio e subir de repente quando tensiona. À noite, se você vê as luzes de um rebocador, procure as luzes do rebocado a centenas de metros atrás antes de cruzar.' },
          { t: 'h', txt: 'Regra 29: praticagem' },
          { t: 'p', html: 'A embarcação de praticagem <strong>em serviço</strong> exibe no tope duas circulares, <strong>branca sobre encarnada</strong>. Em movimento, também luzes de bordos e alcançado; fundeada, também as luzes de fundeio. Fora de serviço, exibe as luzes comuns do seu comprimento.' },
          { t: 'figura', svg: SVG_M6_PARES, legenda: 'Luzes circulares no tope, de cima para baixo. O rebocador (Regra 24) aparece aqui visto de frente: as duas luzes brancas são de mastro (setor de 225°), não circulares.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'arrasto', aspecto: 60 }, legenda: 'Um arrasteiro com seguimento visto pela bochecha de boreste. Troque o tipo para “Pesca, exceto arrasto”, “Rebocando” e “Praticagem”.' },
          { t: 'termos', ids: ['engajada-na-pesca', 'luzes-de-navegacao', 'luz-de-alcancado', 'marcas-diurnas'] },
          { t: 'check', questoes: [
            q('m6l3-1', T_LUZ, 1, 'À noite você vê, em linha vertical, uma luz circular verde sobre uma branca. Trata-se de:',
              ['Embarcação engajada na pesca de arrasto.', 'Embarcação de praticagem em serviço.', 'Embarcação sem governo.', 'Embarcação fundeada.'], 0,
              'Verde sobre branca é a luz da pesca de arrasto (Regra 26(b)(I)). O prático exibe branca sobre encarnada (29(a)). Sem governo exibe duas encarnadas (27(a)). Fundeada exibe circular branca, sem verde (30).',
              'RIPEAM, Regra 26(b)'),
            q('m6l3-2', T_LUZ, 2, 'Você vê uma encarnada sobre uma branca, no tope, e mais abaixo uma luz verde. A outra embarcação está:',
              ['Pescando (exceto arrasto), com seguimento, e você vê o boreste dela.', 'Pescando de arrasto, parada, e você vê a popa dela.', 'Em praticagem, e você vê o bombordo dela.', 'Sem governo, com seguimento, e você vê o boreste dela.'], 0,
              'Encarnada sobre branca é pesca que não é arrasto (Regra 26(c)(I)). A verde é luz de bordo: só aparece com seguimento (26(c)(III)) e indica que você vê o boreste. Arrasto seria verde sobre branca. Prático seria branca sobre encarnada. Sem governo seria duas encarnadas.',
              'RIPEAM, Regras 21(b) e 26(c)'),
            q('m6l3-3', T_LUZ, 2, 'Pela popa de uma embarcação, você vê uma luz amarela logo acima de uma branca. Isso indica:',
              ['Um rebocador rebocando pela popa: luz de reboque sobre a de alcançado.', 'Um colchão de ar operando sem calado.', 'Uma embarcação de pesca com aparelho a mais de 150 m.', 'Uma embarcação restrita pelo calado.'], 0,
              'A Regra 24(a)(IV) manda o rebocador exibir a luz de reboque (amarela, mesmo setor da de alcançado) em linha vertical acima da luz de alcançado. O colchão de ar usa amarela intermitente circular (23(b)). O aparelho de pesca a mais de 150 m é indicado por luz branca (26(c)(II)). A restrita pelo calado exibe três encarnadas (Regra 28).',
              'RIPEAM, Regras 21(d) e 24(a)'),
            q('m6l3-4', T_LUZ, 1, 'Duas circulares no tope, branca sobre encarnada, indicam:',
              ['Embarcação de praticagem em serviço.', 'Pesca, exceto arrasto.', 'Embarcação com manobra restrita.', 'Embarcação encalhada.'], 0,
              'É a luz da praticagem em serviço (Regra 29(a)(I)). Pesca que não é arrasto é encarnada sobre branca, a ordem inversa (26(c)). Manobra restrita tem três luzes, encarnada-branca-encarnada (27(b)). Encalhada exibe luzes de fundeio e duas encarnadas (30(d)).',
              'RIPEAM, Regra 29')
          ] },
          { t: 'fontes', itens: [fR('Regras 24, 26 e 29'), F_MIG15] }
        ]
      },
      /* ---------------- m6 l4 ---------------- */
      {
        id: 'l4', titulo: 'Sem governo, manobra restrita, calado, fundeio e encalhe: Regras 27, 28 e 30', minutos: 14,
        objetivos: [
          'Reconhecer as luzes e marcas de quem não pode sair do caminho.',
          'Exibir corretamente as luzes e a marca de fundeio do seu barco.',
          'Reconhecer uma embarcação encalhada.'
        ],
        blocos: [
          { t: 'h', txt: 'Regra 27: sem governo e manobra restrita' },
          { t: 'lista', itens: [
            '<strong>Sem governo</strong>: duas circulares <strong>encarnadas</strong> em linha vertical; de dia, <strong>duas esferas</strong>. Com seguimento, mais bordos e alcançado. Não exibe luz de mastro.',
            '<strong>Manobra restrita</strong>: três circulares, <strong>encarnada, branca, encarnada</strong>; de dia, <strong>esfera, losango, esfera</strong>. Com seguimento, mais mastro, bordos e alcançado; fundeada, mais as luzes de fundeio.',
            '<strong>Rebocador com restrição severa</strong> para desviar: as luzes da Regra 24(a) mais as da manobra restrita (27(c)).',
            '<strong>Dragagem e operações submarinas</strong> com obstrução: além da manobra restrita, duas encarnadas (ou duas esferas) do <strong>lado da obstrução</strong> e duas verdes (ou dois losangos) do <strong>lado por onde passar</strong> (27(d)).',
            '<strong>Mergulho</strong> em embarcação pequena: as três luzes da manobra restrita e uma réplica rígida da <strong>bandeira “A”</strong> do Código Internacional de Sinais, com pelo menos 1 m de altura (27(e)).',
            '<strong>Remoção de minas</strong>: três verdes (ou três esferas); é perigoso chegar a menos de 1.000 m (27(f)).',
            'Com <strong>menos de 12 m</strong> (exceto mergulho), não é obrigatório exibir estes sinais (27(g)). E eles <strong>não são sinais de perigo</strong> (27(h)).'
          ] },
          { t: 'h', txt: 'Regra 28: restrita devido ao calado' },
          { t: 'p', html: 'Além das luzes de propulsão mecânica, pode exibir <strong>três circulares encarnadas</strong> em linha vertical ou, de dia, um <strong>cilindro</strong>. Quando vir isso num canal, lembre a Regra 18(d): não impeça a passagem dela.' },
          { t: 'h', txt: 'Regra 30: fundeada ou encalhada' },
          { t: 'lista', itens: [
            '<strong>Fundeada</strong>: a vante, uma circular branca (de dia, <strong>uma esfera</strong>); na popa, mais baixa, outra circular branca. Com menos de <strong>50 m</strong>, basta <strong>uma circular branca</strong> onde melhor possa ser vista. Com 100 m ou mais, deve também iluminar os conveses.',
            '<strong>Encalhada</strong>: as luzes de fundeio e, além delas, <strong>duas circulares encarnadas</strong> em linha vertical; de dia, <strong>três esferas</strong>.',
            'Com menos de <strong>7 m</strong>, fundeada longe de canais, fundeadouros e rotas usuais, não é obrigada a exibir luz ou marca de fundeio (30(e)). Com menos de 12 m, encalhada, não é obrigada às duas encarnadas nem às três esferas (30(f)).'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'O seu barco fundeado', html: 'Um veleiro fundeado (de menos de 50 m, como quase todos os de cruzeiro) exibe à noite <strong>uma luz circular branca</strong> e, de dia, <strong>uma esfera preta</strong> a vante (no estai de proa, por exemplo). A luz de fundeio no tope do mastro é vista de longe, mas quem passa perto, num bote, olha para baixo e não a vê. Por isso muitos cruzeiristas preferem uma circular branca mais baixa, presa ao estai, onde melhor possa ser vista.' },
          { t: 'figura', svg: SVG_M6_MARCAS, legenda: 'Marcas diurnas (pretas). Esfera, cone, cilindro e losango têm tamanhos mínimos no Anexo I, Seção 6 (0,6 m de diâmetro; 1,5 m entre marcas), que podem ser reduzidos proporcionalmente abaixo de 20 m.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { tipo: 'mr', dia: true }, legenda: 'Embarcação com manobra restrita, de dia. Desmarque “dia” para ver as luzes e troque o tipo para “Sem governo”, “Restrita pelo calado”, “Fundeada” e “Encalhada”.' },
          { t: 'termos', ids: ['sem-governo', 'manobrabilidade-restrita', 'restrita-pelo-calado', 'luz-de-fundeio', 'marcas-diurnas', 'fundear'] },
          { t: 'check', questoes: [
            q('m6l4-1', T_LUZ, 2, 'À noite você vê duas luzes circulares encarnadas em linha vertical e nenhuma outra luz. Trata-se de:',
              ['Embarcação sem governo, sem seguimento.', 'Embarcação com manobra restrita, com seguimento.', 'Embarcação restrita pelo calado.', 'Embarcação de pesca fundeada.'], 0,
              'Duas encarnadas em linha vertical são de embarcação sem governo (Regra 27(a)(I)). Sem luzes de bordos e de alcançado, ela está sem seguimento (27(a)(III)). Manobra restrita tem encarnada-branca-encarnada (27(b)). Restrita pelo calado tem três encarnadas e luzes de mastro (Regra 28). Pesca usa encarnada (ou verde) sobre branca (Regra 26).',
              'RIPEAM, Regra 27(a)'),
            q('m6l4-2', T_LUZ, 1, 'De dia, uma embarcação exibe, em linha vertical, esfera, losango e esfera. Você está num veleiro a vela. O que fazer?',
              ['Manter rumo: veleiro tem preferência.', 'Sair do caminho: ela tem capacidade de manobra restrita.', 'Passar perto para ver o que ela faz.', 'Dar dois apitos longos.'], 1,
              'Esfera-losango-esfera é a marca de manobra restrita (Regra 27(b)(II)). Pela Regra 18(b)(II), a vela sai do caminho dela. Passar perto contraria a Regra 8 (passagem a distância segura). Dois longos não são sinal de manobra entre embarcações no visual.',
              'RIPEAM, Regras 18(b) e 27(b)'),
            q('m6l4-3', T_LUZ, 2, 'Seu veleiro de 10 m está fundeado à noite, fora de canal. Pela Regra 30, basta exibir:',
              ['Duas luzes circulares brancas, uma a vante e outra mais baixa na popa, obrigatoriamente.', 'Uma luz circular branca onde melhor possa ser vista.', 'A lanterna tricolor.', 'Luzes de bordos e luz de alcançado.'], 1,
              'A Regra 30(b) permite que a embarcação com menos de 50 m fundeada exiba uma única luz circular branca onde melhor possa ser vista, em lugar das duas da 30(a). A tricolor e as luzes de bordos e alcançado são de embarcação em movimento (Regras 23 e 25), e exibi-las fundeado confunde quem passa.',
              'RIPEAM, Regra 30(a) e (b)'),
            q('m6l4-4', T_LUZ, 2, 'De dia, três esferas pretas em linha vertical indicam:',
              ['Embarcação encalhada.', 'Embarcação sem governo.', 'Embarcação fundeada com mais de 50 m.', 'Embarcação em remoção de minas.'], 0,
              'Três esferas em linha vertical são a marca de embarcação encalhada (Regra 30(d)(II)). Sem governo exibe duas esferas (27(a)(II)). Fundeada exibe uma esfera a vante (30(a)(I)), seja qual for o tamanho. Remoção de minas usa três esferas, mas uma no tope do mastro de vante e duas nos lais da verga (27(f)), não em linha vertical.',
              'RIPEAM, Regras 27 e 30')
          ] },
          { t: 'fontes', itens: [fR('Regras 27, 28 e 30 e Anexo I, Seção 6'), F_MIG15] }
        ]
      },
      /* ---------------- m6 l5 ---------------- */
      {
        id: 'l5', titulo: 'Lendo a noite: tipo e aspecto da outra embarcação', minutos: 13,
        objetivos: [
          'Usar um método em cinco passos para identificar luzes à noite.',
          'Descobrir o aspecto (de que lado você vê a outra) e para onde ela vai.',
          'Decidir a ação pelas regras de governo a partir das luzes.'
        ],
        blocos: [
          { t: 'p', html: '<strong>Aspecto</strong> é o lado da outra embarcação que você está vendo: a proa, o boreste, o bombordo ou a popa. Ele sai das luzes de bordos e de alcançado. O <strong>tipo</strong> sai das luzes circulares do tope e das luzes de mastro. Juntando os dois, você aplica as regras de governo do módulo anterior.' },
          { t: 'h', txt: 'Método em cinco passos' },
          { t: 'lista', ordenada: true, itens: [
            '<strong>Conte as luzes e veja o arranjo.</strong> Luzes em linha vertical no tope indicam trabalho ou restrição: verde/branca (arrasto), encarnada/branca (pesca), branca/encarnada (prático), duas encarnadas (sem governo), encarnada-branca-encarnada (manobra restrita), três encarnadas (calado).',
            '<strong>Procure as luzes de bordos.</strong> Só verde: você vê o boreste dela. Só encarnada: o bombordo. As duas: ela aponta para você. Nenhuma, só uma branca baixa: você está por ante a ré dela (na luz de alcançado).',
            '<strong>Olhe as luzes de mastro.</strong> Nenhuma branca acima dos bordos: veleiro a vela (ou barco pequeno). Uma: propulsão mecânica, provavelmente menor que 50 m. Duas: provavelmente 50 m ou mais (ou um rebocador, Regra 24). A baixa (de vante) indica o lado para onde aponta a proa.',
            '<strong>Confira a coerência.</strong> Se você vê a verde, a proa dela aponta para a sua direita; se vê a encarnada, para a sua esquerda. Luzes de mastro e de bordos têm de contar a mesma história.',
            '<strong>Tome marcações e decida.</strong> Marcação constante, risco (Regra 7). Depois, quem manobra (Regras 12 a 18) e como (Regras 8, 16 e 17).'
          ] },
          { t: 'figura', svg: SVG_M6_NOITE, legenda: 'Quatro situações típicas. No cartão do navio de frente, a verde aparece à sua esquerda e a encarnada à sua direita: o boreste dele fica do seu lado esquerdo.' },
          { t: 'tabela', cab: ['O que você vê', 'O que é', 'O que fazer (você numa lancha)'], linhas: [
            ['Encarnada sozinha, sem branca acima', 'Veleiro a vela mostrando o bombordo', 'Sair do caminho (Regra 18(a)).'],
            ['Branca alta e verde', 'Propulsão mecânica mostrando o boreste', 'Se cruzam, ela está no seu bombordo: você mantém rumo e velocidade (Regras 15 e 17).'],
            ['Branca alta e encarnada', 'Propulsão mecânica mostrando o bombordo', 'Se cruzam, ela está no seu boreste: você manobra (Regra 15).'],
            ['Duas brancas alinhadas, verde e encarnada', 'Navio vindo de frente', 'Roda a roda: guine para boreste (Regra 14).'],
            ['Uma branca baixa, ficando mais forte', 'A popa de quem vai à frente (ou um barco fundeado)', 'Se for alcançado, você manobra (Regra 13).'],
            ['Verde sobre branca no tope e uma luz de bordo', 'Arrasteiro com seguimento', 'Sair do caminho (Regra 18(a)). Atenção à rede atrás dele.'],
            ['Três encarnadas em linha vertical e brancas de mastro', 'Navio restrito pelo calado', 'Não impedir a passagem (Regra 18(d)).']
          ] },
          { t: 'callout', tipo: 'seguranca', titulo: 'Luzes de fundo enganam', html: 'Perto de cidades, as luzes da orla escondem luzes de navegação. Uma luz que não se mexe contra o fundo pode ser um barco em rumo de colisão. Reduza a velocidade (Regra 6(a)(IV)) e use todos os meios: marcações, radar, AIS e binóculo.' },
          { t: 'widget', w: 'ripeam-luzes', opts: { modo: 'desafio' }, legenda: 'Desafio: identifique o tipo e o aspecto de embarcações sorteadas, só pelas luzes.' },
          { t: 'termos', ids: ['luzes-de-navegacao', 'marcacao-relativa', 'luz-de-alcancado', 'luzes-de-bordos'] },
          { t: 'check', questoes: [
            q('m6l5-1', T_LUZ, 1, 'À noite você vê apenas uma luz encarnada, sem nenhuma luz branca acima dela. Essa luz pode ser de:',
              ['Um veleiro a vela, visto pelo bombordo.', 'Uma lancha vista de frente.', 'Um navio fundeado.', 'Uma embarcação de praticagem em serviço.'], 0,
              'Uma luz de bordo encarnada sem luz de mastro é o padrão do veleiro a vela visto pelo bombordo (Regra 25(a)). Uma lancha de frente mostraria a branca de mastro (ou circular) e as duas luzes de bordos (Regra 23). O navio fundeado exibe circulares brancas (Regra 30). O prático exibe branca sobre encarnada no tope (Regra 29).',
              'RIPEAM, Regras 23, 25, 29 e 30'),
            q('m6l5-2', T_LUZ, 2, 'Você, numa lancha, vê duas luzes brancas de mastro (a mais baixa à direita da mais alta) e uma luz verde. Os dois rumos se cruzam com risco. Você deve:',
              ['Manter rumo e velocidade, vigiando: ela vem pelo seu bombordo e deve manobrar.', 'Guinar para bombordo e cruzar a proa dela.', 'Guinar para boreste imediatamente, porque é roda a roda.', 'Parar as máquinas, porque é um navio sem governo.'], 0,
              'A verde mostra que você vê o boreste dela; a luz de mastro mais baixa à direita confirma que a proa aponta para a sua direita. Ela está no seu bombordo, e quem a vê por boreste é ela: ela manobra (Regra 15) e você mantém rumo e velocidade (Regra 17(a)(I)), pronto para agir pela 17(a)(II). Não é roda a roda (veria as duas luzes de bordos e as de mastro alinhadas). Guinar para bombordo é o que a 17(c) manda evitar. Sem governo exibiria duas encarnadas.',
              'RIPEAM, Regras 14, 15, 17 e 23'),
            q('m6l5-3', T_LUZ, 2, 'Você vê uma única luz branca, baixa, bem na sua proa, e ela fica mais forte aos poucos. Qual hipótese é compatível com o que você vê?',
              ['A luz de alcançado de uma embarcação que você está alcançando.', 'Um veleiro a vela visto de frente.', 'Uma lancha vista pelo través de boreste.', 'Um arrasteiro com seguimento visto de lado.'], 0,
              'Uma branca sozinha pode ser a luz de alcançado de quem vai à frente (Regra 21(c)), além de outras hipóteses como um barco pequeno fundeado. Se você está alcançando, deve manobrar (Regra 13). O veleiro de frente mostraria verde e encarnada; a lancha pelo través mostraria a verde e a branca de mastro; o arrasteiro mostraria verde sobre branca no tope e uma luz de bordo.',
              'RIPEAM, Regras 13, 21, 23, 25 e 26')
          ] },
          { t: 'fontes', itens: [fR('Regras 13 a 18 e 20 a 30'), F_MIG15] }
        ]
      }
    ]
  });

  /* =====================================================================================
     m7 — Sinais sonoros, luminosos e de perigo
     ===================================================================================== */
  var SVG_M7_DURACAO =
    '<svg viewBox="0 0 400 128" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Duração do apito curto e do apito longo</title>' +
    '<g stroke="currentColor" stroke-width="1"><line x1="20" y1="104" x2="160" y2="104"/>' +
    '<line x1="20" y1="100" x2="20" y2="108"/><line x1="40" y1="100" x2="40" y2="108"/><line x1="60" y1="100" x2="60" y2="108"/><line x1="80" y1="100" x2="80" y2="108"/>' +
    '<line x1="100" y1="100" x2="100" y2="108"/><line x1="120" y1="100" x2="120" y2="108"/><line x1="140" y1="100" x2="140" y2="108"/></g>' +
    '<g font-size="13" fill="currentColor" text-anchor="middle"><text x="20" y="124">0</text><text x="60" y="124">2</text><text x="100" y="124">4</text><text x="140" y="124">6 s</text></g>' +
    '<rect x="20" y="14" width="20" height="18" rx="3" fill="var(--magenta)"/>' +
    '<rect x="20" y="54" width="100" height="18" rx="3" fill="var(--magenta)"/>' +
    '<rect x="100" y="50" width="40" height="26" fill="none" stroke="currentColor" stroke-dasharray="3 3"/>' +
    '<g font-size="14" fill="currentColor"><text x="176" y="28"><tspan font-weight="700">Curto</tspan>: cerca de 1 s</text>' +
    '<text x="176" y="68"><tspan font-weight="700">Longo</tspan>: de 4 a 6 s</text></g>' +
    '</svg>';

  function sinal(y, seq, txt) {
    var x = 12, s = '';
    seq.forEach(function (k) {
      var w = k === 'L' ? 40 : 10, g = k === 'r' ? 5 : 8;
      s += '<rect x="' + x + '" y="' + (y - 11) + '" width="' + w + '" height="14" rx="2" fill="var(--magenta)"/>';
      x += w + g;
    });
    return s + '<text x="150" y="' + y + '" font-size="14" fill="currentColor">' + txt + '</text>';
  }
  var SVG_M7_MANOBRA =
    '<svg viewBox="0 0 400 290" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Sinais de manobra e de advertência da Regra 34</title>' +
    sinal(24, ['C'], 'guinando para boreste') + sinal(57, ['C', 'C'], 'guinando para bombordo') +
    sinal(90, ['C', 'C', 'C'], 'dando atrás') + sinal(123, ['r', 'r', 'r', 'r', 'r'], 'dúvida (5 ou mais, rápidos)') +
    sinal(156, ['L'], 'curva ou trecho encoberto') + sinal(189, ['L', 'L', 'C'], 'vou ultrapassar pelo seu boreste') +
    sinal(222, ['L', 'L', 'C', 'C'], 'vou ultrapassar pelo seu bombordo') + sinal(255, ['L', 'C', 'L', 'C'], 'concordo com a ultrapassagem') +
    '<text x="12" y="284" font-size="13" fill="currentColor">barra curta = apito curto; barra longa = apito longo</text>' +
    '</svg>';

  var SVG_M7_PERIGO =
    '<svg viewBox="0 0 400 300" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Quatro sinais visuais de perigo do Anexo IV</title>' +
    '<rect x="4" y="4" width="192" height="98" rx="6" fill="var(--sea-1)"/><rect x="204" y="4" width="192" height="98" rx="6" fill="var(--sea-1)"/>' +
    '<rect x="4" y="152" width="192" height="98" rx="6" fill="var(--sea-1)"/><rect x="204" y="152" width="192" height="98" rx="6" fill="var(--sea-1)"/>' +
    /* braços */
    '<g stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"><circle cx="100" cy="26" r="9"/><line x1="100" y1="35" x2="100" y2="70"/>' +
    '<line x1="100" y1="70" x2="88" y2="96"/><line x1="100" y1="70" x2="112" y2="96"/>' +
    '<line x1="100" y1="44" x2="58" y2="30"/><line x1="100" y1="44" x2="142" y2="30"/></g>' +
    '<g stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="4 3"><line x1="100" y1="44" x2="58" y2="62"/><line x1="100" y1="44" x2="142" y2="62"/></g>' +
    '<g stroke="var(--magenta)" stroke-width="2" fill="none"><path d="M48,34 q-8,12 0,24"/><path d="M152,34 q8,12 0,24"/></g>' +
    /* bandeira e esfera */
    '<line x1="270" y1="14" x2="270" y2="98" stroke="currentColor" stroke-width="3"/>' +
    '<circle cx="290" cy="26" r="10" fill="currentColor"/><rect x="274" y="44" width="46" height="46" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="1.5"/>' +
    /* foguete com paraquedas */
    '<path d="M70,184 q30,-26 60,0 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<g stroke="currentColor" stroke-width="1"><line x1="70" y1="184" x2="100" y2="214"/><line x1="130" y1="184" x2="100" y2="214"/><line x1="100" y1="171" x2="100" y2="214"/></g>' +
    '<circle cx="100" cy="220" r="9" fill="var(--nav-red)" stroke="currentColor"/>' +
    '<path d="M100,231 q-6,8 0,16" fill="none" stroke="var(--nav-red)" stroke-width="2" stroke-dasharray="3 3"/>' +
    /* fumígeno */
    '<rect x="204" y="226" width="192" height="24" fill="var(--sea-2)"/><rect x="290" y="218" width="20" height="14" rx="3" fill="currentColor"/>' +
    '<g fill="currentColor" opacity="0.35"><circle cx="300" cy="206" r="10"/><circle cx="312" cy="190" r="13"/><circle cx="328" cy="174" r="15"/><circle cx="350" cy="164" r="14"/></g>' +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="100" y="120">Braços estendidos, subindo</text><text x="100" y="137">e descendo devagar</text>' +
    '<text x="300" y="120">Bandeira quadrada com</text><text x="300" y="137">esfera acima ou abaixo</text>' +
    '<text x="100" y="268">Foguete com paraquedas</text><text x="100" y="285">ou facho: luz encarnada</text>' +
    '<text x="300" y="268">Sinal fumígeno:</text><text x="300" y="285">fumaça laranja</text></g>' +
    '</svg>';

  M.push({
    id: 'm7', titulo: 'Sinais sonoros, luminosos e de perigo',
    resumo: 'Regras 32 a 37 e Anexos III e IV: apitos, sino e gongo, sinais de manobra e de advertência, sinais em visibilidade restrita (com a Regra 19), sinais para chamar a atenção e sinais de perigo. NORMAM-211, Anexo 5-A, 3.1 f) II e g).',
    licoes: [
      /* ---------------- m7 l1 ---------------- */
      {
        id: 'l1', titulo: 'Apitos, sino e gongo: Regras 32 e 33', minutos: 10,
        objetivos: [
          'Saber a duração do apito curto e do apito longo.',
          'Saber que equipamento sonoro cada tamanho de embarcação deve ter, pelo RIPEAM e pela NORMAM-211.',
          'Ter noção do alcance de um apito e de como o vento o reduz.'
        ],
        blocos: [
          { t: 'p', html: 'A Parte D do RIPEAM (Regras 32 a 37) trata dos sinais que se <strong>ouvem</strong> e de alguns que se <strong>veem</strong>. Antes dos sinais, as definições e o equipamento.' },
          { t: 'h', txt: 'Regra 32: definições' },
          { t: 'lista', itens: [
            '<strong>Apito</strong>: qualquer dispositivo sonoro capaz de produzir os sons curtos e longos do regulamento e que atenda ao Anexo III (buzina elétrica, a ar ou a gás).',
            '<strong>Apito curto</strong>: som de cerca de <strong>1 segundo</strong>.',
            '<strong>Apito longo</strong>: som de <strong>4 a 6 segundos</strong>.'
          ] },
          { t: 'figura', svg: SVG_M7_DURACAO, legenda: 'Para treinar o longo, conte devagar: “mil e um, mil e dois, mil e três, mil e quatro, mil e cinco”.' },
          { t: 'h', txt: 'Regra 33: equipamento' },
          { t: 'tabela', cab: ['Comprimento', 'Equipamento exigido pelo RIPEAM'], linhas: [
            ['100 m ou mais', 'Apito, sino e gongo (o gongo com som que não se confunda com o do sino)'],
            ['20 m a menos de 100 m', 'Apito e sino'],
            ['12 m a menos de 20 m', 'Apito'],
            ['Menos de 12 m', 'Não é obrigado a ter apito nem sino, mas deve ter um meio de produzir um sinal sonoro eficaz']
          ], legenda: 'Regra 33. Sino e gongo podem ser substituídos por equipamento com o mesmo som, desde que o acionamento manual continue possível.' },
          { t: 'p', html: 'A norma brasileira é mais exigente que o RIPEAM para os barcos pequenos:' },
          { t: 'fato', ref: 'tecnico-10', html: 'Pela NORMAM-211, todas as embarcações, exceto as miúdas (até 6 m), devem ter um apito. Um veleiro de 32 pés, por exemplo, mesmo com menos de 12 m, precisa de apito.' },
          { t: 'fato', ref: 'tecnico-12', html: 'Pela NORMAM-211, as embarcações classificadas para navegação costeira ou oceânica devem ter um sino ou buzina manual.' },
          { t: 'h', txt: 'Até onde se ouve um apito (Anexo III)' },
          { t: 'tabela', cab: ['Comprimento', 'Alcance audível de referência'], linhas: [
            ['200 m ou mais', '2 milhas'], ['75 m a menos de 200 m', '1,5 milha'], ['20 m a menos de 75 m', '1 milha'], ['Menos de 20 m', '0,5 milha']
          ], legenda: 'Anexo III, Seção 1(c). O próprio anexo avisa: com vento forte ou muito ruído a bordo, o alcance pode ser muito menor.' },
          { t: 'p', html: 'Navios grandes têm apitos graves (70 a 200 Hz, para 200 m ou mais); barcos pequenos, agudos (250 a 700 Hz, abaixo de 75 m). Ouvir um som grave e potente no nevoeiro já diz muito sobre o tamanho de quem vem.' },
          { t: 'callout', tipo: 'dica', titulo: 'No seu veleiro', html: 'Tenha uma buzina fixa ou a gás e um apito de boca de reserva (o gás acaba e a buzina elétrica depende da bateria). Teste antes de sair, como parte do checklist.' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'equipamento' }, legenda: 'Ouça o curto, o longo, o sino e o gongo. O som só começa depois de um toque.' },
          { t: 'termos', ids: ['sinais-sonoros', 'embarcacao-miuda'] },
          { t: 'check', questoes: [
            q('m7l1-1', T_SOM, 1, 'Pelo RIPEAM, o apito longo dura:',
              ['Cerca de 1 segundo.', 'De 2 a 3 segundos.', 'De 4 a 6 segundos.', 'Mais de 10 segundos.'], 2,
              'A Regra 32(c) define o apito longo como um som de 4 a 6 segundos. Cerca de 1 segundo é o apito curto (32(b)). Dois a três segundos e mais de dez não são durações definidas no RIPEAM.',
              'RIPEAM, Regra 32'),
            q('m7l1-2', T_SOM, 2, 'Uma embarcação de 25 m de comprimento deve estar equipada, pelo RIPEAM, com:',
              ['Apito.', 'Apito e sino.', 'Apito, sino e gongo.', 'Apenas um meio de produzir sinal sonoro eficaz.'], 1,
              'Pela Regra 33(a), a partir de 20 m exige-se apito e sino; o gongo só a partir de 100 m. Só apito é o caso de 12 a 20 m. O “meio de sinal sonoro eficaz” vale para menos de 12 m (33(b)).',
              'RIPEAM, Regra 33'),
            q('m7l1-3', T_SOM, 2, 'Seu veleiro tem 9,8 m e não é embarcação miúda. Sobre o apito, é correto dizer:',
              ['O RIPEAM e a NORMAM-211 dispensam o apito.', 'O RIPEAM não exige apito abaixo de 12 m, mas a NORMAM-211 exige apito em todas as embarcações, exceto as miúdas.', 'Só é exigido se o barco navegar à noite.', 'Só é exigido para navegação oceânica.'], 1,
              'A Regra 33(b) dispensa o apito abaixo de 12 m, desde que haja meio de sinal sonoro eficaz. A NORMAM-211, item 4.18.5, vai além: todas as embarcações, exceto as miúdas, devem ter apito. Não há condição de navegação noturna ou oceânica para o apito; o sino ou buzina manual é que é exigido para costeira e oceânica (item 4.18.7).',
              'RIPEAM, Regra 33; NORMAM-211, itens 4.18.5 e 4.18.7')
          ] },
          { t: 'fontes', itens: [fR('Regras 32 e 33 e Anexo III'), { txt: 'NORMAM-211/DPC, itens 4.18.5 a 4.18.7', url: NORMAM211, ref: 'tecnico-10' }, F_MIG15] }
        ]
      },
      /* ---------------- m7 l2 ---------------- */
      {
        id: 'l2', titulo: 'Sinais de manobra e de advertência: Regra 34', minutos: 12,
        objetivos: [
          'Dar e entender os sinais de manobra de quem é de propulsão mecânica.',
          'Combinar uma ultrapassagem em canal estreito por apito.',
          'Usar o sinal de dúvida e o sinal de curva.'
        ],
        blocos: [
          { t: 'p', html: 'Estes sinais valem entre embarcações <strong>no visual</strong> uma da outra. Eles informam uma manobra que está sendo feita, pedem acordo ou alertam. Não pedem licença: quem dá “um curto” já está guinando para boreste.' },
          { t: 'h', txt: '34(a): sinais de manobra (só propulsão mecânica)' },
          { t: 'lista', itens: [
            '<strong>Um curto</strong>: “estou guinando para boreste”.',
            '<strong>Dois curtos</strong>: “estou guinando para bombordo”.',
            '<strong>Três curtos</strong>: “estou dando atrás” (máquinas a ré; o barco pode ainda nem ter começado a andar para trás).'
          ] },
          { t: 'p', html: 'A obrigação é da embarcação de <strong>propulsão mecânica</strong> que manobra como as regras autorizam ou mandam. Um veleiro navegando a vela não dá esses sinais. Motorando, dá.' },
          { t: 'h', txt: '34(b): o mesmo, com luz' },
          { t: 'p', html: 'Qualquer embarcação pode reforçar os apitos com <strong>lampejos</strong>: um, dois ou três, com o mesmo significado. Cada lampejo dura cerca de 1 s, com cerca de 1 s entre eles, e pelo menos 10 s entre um sinal e o seguinte. A luz, quando instalada, é <strong>circular branca</strong>, visível a pelo menos 5 milhas.' },
          { t: 'h', txt: '34(c): ultrapassagem em canal estreito' },
          { t: 'lista', itens: [
            '<strong>Dois longos e um curto</strong>: “pretendo ultrapassá-lo pelo seu boreste”.',
            '<strong>Dois longos e dois curtos</strong>: “pretendo ultrapassá-lo pelo seu bombordo”.',
            '<strong>Longo, curto, longo, curto</strong>: resposta da alcançada, “concordo”. Ela então manobra para permitir a passagem segura (Regra 9(e)).',
            'Se a alcançada não concorda ou está em dúvida, ela dá o sinal de dúvida.'
          ] },
          { t: 'h', txt: '34(d) e (e): dúvida e curva' },
          { t: 'lista', itens: [
            '<strong>Cinco ou mais curtos e rápidos</strong>: “não entendo a sua intenção” ou “duvido que a sua manobra evite a colisão”. Qualquer embarcação pode e deve usá-lo, inclusive a vela. Pode ser reforçado com cinco ou mais lampejos rápidos.',
            '<strong>Um longo</strong> ao se aproximar de uma curva ou trecho de canal onde outras embarcações possam estar escondidas por obstáculos. Quem ouvir do outro lado responde com <strong>um longo</strong>.',
            'Com apitos a mais de 100 m um do outro, só um deles é usado para estes sinais (34(f)).'
          ] },
          { t: 'figura', svg: SVG_M7_MANOBRA, legenda: 'Os sinais da Regra 34 em notação de barras. Os três primeiros são de propulsão mecânica (34(a)); os de ultrapassagem só se usam em canal estreito ou via de acesso (34(c)).' },
          { t: 'callout', tipo: 'dica', titulo: 'Exemplo em canal', html: 'Num canal de acesso, sua lancha alcança um pesqueiro lento e só dá para passar se ele se encostar. Você dá <strong>dois longos e dois curtos</strong> (vai passar pelo bombordo dele). Ele responde <strong>longo, curto, longo, curto</strong> e se encosta para boreste. Você passa e continua responsável por se manter fora do caminho até ficar safo (Regra 13).' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'manobra' }, legenda: 'Ouça cada sinal de manobra e de advertência. No modo desafio, reconheça o sinal pelo som ou dê o sinal certo para a situação.' },
          { t: 'termos', ids: ['sinais-sonoros', 'canal-estreito', 'ultrapassagem', 'guinar'] },
          { t: 'check', questoes: [
            q('m7l2-1', T_SOM, 1, 'Uma lancha à sua vista dá dois apitos curtos. Ela está informando:',
              ['“Estou guinando para bombordo.”', '“Estou guinando para boreste.”', '“Estou dando atrás.”', '“Estou em dúvida sobre a sua manobra.”'], 0,
              'Pela Regra 34(a), dois apitos curtos significam “estou guinando para bombordo”. Um curto é guinada para boreste; três curtos, dando atrás; cinco ou mais curtos e rápidos, dúvida (34(d)).',
              'RIPEAM, Regra 34(a) e (d)'),
            q('m7l2-2', T_SOM, 2, 'Num canal estreito você quer ultrapassar uma embarcação passando pelo bombordo dela, e isso exige que ela se encoste. Qual sinal você dá?',
              ['Dois longos e um curto.', 'Dois longos e dois curtos.', 'Um longo, um curto, um longo e um curto.', 'Dois curtos.'], 1,
              'A Regra 34(c)(I) manda dar dois longos seguidos de dois curtos para “tenho a intenção de ultrapassá-lo por seu bombordo”. Dois longos e um curto é a ultrapassagem pelo boreste dela. Longo-curto-longo-curto é a resposta de concordância da alcançada (34(c)(II)). Dois curtos significa guinando para bombordo.',
              'RIPEAM, Regras 9(e) e 34(c)'),
            q('m7l2-3', T_SOM, 3, 'Você navega a vela, sem motor, e guina para boreste para se afastar de uma lancha. Pelo RIPEAM, você:',
              ['Deve dar um apito curto.', 'Deve dar dois apitos curtos.', 'Não é obrigado a dar sinal de manobra: a Regra 34(a) é para embarcações de propulsão mecânica.', 'Deve dar um apito longo.'], 2,
              'A Regra 34(a) obriga “uma embarcação de propulsão mecânica que esteja manobrando” a sinalizar a manobra. Um veleiro a vela não tem essa obrigação (pode, porém, usar o sinal de dúvida da 34(d)). Um curto e dois curtos são os sinais de quem é de propulsão mecânica; um longo é o sinal de curva (34(e)).',
              'RIPEAM, Regra 34(a)'),
            q('m7l2-4', T_SOM, 1, 'Ao se aproximar de uma curva de rio com a visão bloqueada por mato alto, que sinal o RIPEAM manda dar?',
              ['Um apito longo.', 'Cinco apitos curtos.', 'Três apitos curtos.', 'Nenhum sinal.'], 0,
              'A Regra 34(e) manda soar um apito longo ao se aproximar de curva ou trecho onde outras embarcações possam estar ocultas por obstáculos; quem ouvir do outro lado responde com um longo. A Regra 9(f) repete a obrigação para canais estreitos. Cinco curtos é dúvida; três curtos, dando atrás.',
              'RIPEAM, Regras 9(f) e 34(e)')
          ] },
          { t: 'fontes', itens: [fR('Regras 9 e 34'), F_MIG15] }
        ]
      },
      /* ---------------- m7 l3 ---------------- */
      {
        id: 'l3', titulo: 'Na cerração: Regras 19 e 35', minutos: 14,
        objetivos: [
          'Conduzir a embarcação em visibilidade restrita pela Regra 19.',
          'Dar e reconhecer os sinais sonoros da Regra 35.',
          'Montar um procedimento prático para nevoeiro no seu barco.'
        ],
        blocos: [
          { t: 'p', html: 'Nevoeiro, chuva pesada e névoa forte são <strong>visibilidade restrita</strong> (Regra 3(l)). Acontece na costa sul e sudeste com frequência e em rios e lagos nas madrugadas frias. Nesse cenário mudam duas coisas: a conduta (Regra 19) e os sinais (Regra 35).' },
          { t: 'h', txt: 'Regra 19: conduta fora do visual' },
          { t: 'p', html: 'A Regra 19 vale para embarcações que <strong>não estão no visual</strong> uma da outra, navegando dentro ou perto de área de visibilidade restrita. Aqui <strong>não existem</strong> “quem manobra” e “quem mantém”: as Regras 11 a 18 só valem no visual. Cada uma age para evitar a aproximação excessiva.' },
          { t: 'lista', itens: [
            '<strong>19(b)</strong> — Velocidade segura para a visibilidade do momento. Propulsão mecânica com as máquinas prontas para manobra imediata.',
            '<strong>19(c)</strong> — Cumprir a Seção I (vigilância, velocidade, risco) levando em conta a visibilidade.',
            '<strong>19(d)</strong> — Detectou outra só pelo radar? Avalie se há aproximação excessiva ou risco e manobre cedo. Se for guinar, evite: guinar para <strong>bombordo</strong> para uma embarcação por ante a vante do través (salvo se você a estiver alcançando); e guinar <strong>na direção</strong> de uma embarcação que está no través ou por ante a ré dele.',
            '<strong>19(e)</strong> — Ouviu um sinal de cerração aparentemente por ante a vante do través, ou não consegue evitar a aproximação excessiva de quem está por ante a vante do través? <strong>Reduza a velocidade ao mínimo que permita manter o rumo</strong>; se necessário, tire todo o seguimento; navegue com extrema cautela até passar o perigo.'
          ] },
          { t: 'h', txt: 'Regra 35: sinais em visibilidade restrita' },
          { t: 'tabela', cab: ['Quem', 'Sinal', 'Intervalo máximo'], linhas: [
            ['Propulsão mecânica com seguimento', 'Um longo', '2 min'],
            ['Propulsão mecânica parada, sem seguimento', 'Dois longos (cerca de 2 s entre eles)', '2 min'],
            ['Sem governo, manobra restrita, restrita pelo calado, <strong>a vela</strong>, pescando, rebocando ou empurrando', 'Um longo e dois curtos', '2 min'],
            ['Pescando fundeada; manobra restrita trabalhando fundeada', 'Um longo e dois curtos (em vez do sino)', '2 min'],
            ['Rebocada (a última, se tripulada)', 'Um longo e três curtos, logo depois do sinal do rebocador', '2 min'],
            ['Fundeada', 'Sino tocado rapidamente por cerca de 5 s (com 100 m ou mais: sino a vante e, logo depois, gongo a ré). Pode também dar curto-longo-curto para avisar quem se aproxima', '1 min'],
            ['Encalhada', 'Sino (e gongo, se for o caso) como fundeada, com três badaladas separadas antes e depois. Pode dar um sinal de apito apropriado', '1 min'],
            ['12 m a menos de 20 m', 'Dispensada do sino (fundeada ou encalhada), mas dá outro sinal sonoro eficaz', '2 min'],
            ['Menos de 12 m', 'Dispensada destes sinais, mas dá outro sinal sonoro eficaz', '2 min'],
            ['Praticagem em serviço', 'Pode somar quatro curtos de identificação', '—']
          ], legenda: 'Regra 35, parágrafos (a) a (k). Os sinais valem de dia e de noite, dentro ou perto de área de visibilidade restrita.' },
          { t: 'callout', tipo: 'dica', titulo: 'Para gravar', html: '<strong>Um longo</strong>: motor andando. <strong>Dois longos</strong>: motor parado. <strong>Longo e dois curtos</strong>: “não manobro como uma lancha” (vela, pesca, reboque, restrições). <strong>Sino</strong>: fundeada. Repare que o longo e dois curtos não diz qual dessas é: trate como alguém que pode não conseguir sair do caminho.' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'cerracao', sinal: 'v3' }, legenda: 'Sinais de cerração. Ligue “acelerar” para ouvir as repetições sem esperar dois minutos.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Procedimento de nevoeiro no seu veleiro', html: '<ol><li>Reduza a velocidade e marque a posição na carta (ou no GNSS) antes de perder a referência.</li><li>Acenda as luzes de navegação (Regra 20(c)) e confira o refletor radar.</li><li>Comece os sinais da Regra 35: a vela, longo e dois curtos; motorando, um longo.</li><li>Ponha um vigia na proa, longe do ronco do motor, só para ouvir.</li><li>Use radar e AIS se tiver; ouça o VHF.</li><li>Fuja das rotas de navios e dos canais. Se possível, fundeie em lugar seguro fora deles e toque o sino (ou outro sinal sonoro eficaz) a cada minuto.</li></ol>' },
          { t: 'termos', ids: ['visibilidade-restrita', 'nevoeiro', 'sinais-sonoros', 'radar', 'refletor-radar'] },
          { t: 'check', questoes: [
            q('m7l3-1', T_SOM, 2, 'No nevoeiro você ouve, a cada dois minutos, um apito longo seguido de dois curtos. Quem pode estar soando esse sinal?',
              ['Somente uma embarcação a vela.', 'Uma embarcação a vela, de pesca, sem governo, com manobra restrita, restrita pelo calado, ou rebocando ou empurrando.', 'Uma embarcação de propulsão mecânica com seguimento.', 'Uma embarcação fundeada.'], 1,
              'A Regra 35(c) dá o mesmo sinal (longo e dois curtos) a todas essas categorias, que não manobram como uma lancha comum. Propulsão mecânica com seguimento dá um longo (35(a)). A fundeada toca o sino (35(g)).',
              'RIPEAM, Regra 35(a), (c) e (g)'),
            q('m7l3-2', T_SOM, 1, 'Seu veleiro está motorando, com seguimento, num nevoeiro. Que sinal sonoro deve dar?',
              ['Um longo e dois curtos a cada 2 minutos, porque é um veleiro.', 'Um longo a intervalos de no máximo 2 minutos.', 'Dois longos a cada 2 minutos.', 'Sino por 5 segundos a cada minuto.'], 1,
              'Motorando, o veleiro é de propulsão mecânica (Regra 3) e, com seguimento, dá um longo a intervalos não superiores a 2 minutos (35(a)). O longo e dois curtos é para quem está a vela (35(c)). Dois longos é propulsão mecânica parada sem seguimento (35(b)). O sino é de fundeada (35(g)). Com menos de 12 m ele pode, em vez disso, dar outro sinal sonoro eficaz (35(j)).',
              'RIPEAM, Regras 3 e 35'),
            q('m7l3-3', T_SOM, 2, 'No nevoeiro, sem ver nada, você ouve um sinal de cerração aparentemente por ante a vante do seu través. Pela Regra 19(e), você deve:',
              ['Manter rumo e velocidade, porque não há risco confirmado.', 'Reduzir a velocidade ao mínimo que permita manter o rumo e, se necessário, tirar todo o seguimento.', 'Aumentar a velocidade para sair logo da área.', 'Guinar para bombordo imediatamente.'], 1,
              'A Regra 19(e) manda reduzir a velocidade ao mínimo que permita manter o rumo e, se necessário, tirar todo o seguimento, navegando com extrema cautela (exceto se já se determinou que não há risco). Manter ou aumentar a velocidade contraria a 19(b) e (e). Guinar às cegas para bombordo pode levá-lo justamente para a outra.',
              'RIPEAM, Regra 19(e)'),
            q('m7l3-4', T_SOM, 3, 'Em visibilidade restrita, o radar mostra outra embarcação por ante a vante do través, em aproximação. Ela não está sendo alcançada por você. Se você decidir guinar, deve evitar, se possível:',
              ['Guinar para boreste.', 'Guinar para bombordo.', 'Reduzir a velocidade.', 'Guinar mais de 30°.'], 1,
              'A Regra 19(d)(I) manda evitar a alteração de rumo para bombordo para uma embarcação por ante a vante do través, salvo quando ela está sendo alcançada. Guinar para boreste é a manobra usual. Reduzir a velocidade é recomendado (Regra 8(e) e 19(e)). Uma guinada ampla atende à Regra 8(b).',
              'RIPEAM, Regra 19(d)')
          ] },
          { t: 'fontes', itens: [fR('Regras 3(l), 19 e 35'), F_MIG15] }
        ]
      },
      /* ---------------- m7 l4 ---------------- */
      {
        id: 'l4', titulo: 'Chamar a atenção e pedir socorro: Regras 36, 37 e Anexo IV', minutos: 12,
        objetivos: [
          'Chamar a atenção de outra embarcação sem confundir os sinais oficiais.',
          'Reconhecer e usar corretamente os sinais de perigo do Anexo IV.',
          'Conhecer a dotação de pirotécnicos exigida para cada área de navegação.'
        ],
        blocos: [
          { t: 'h', txt: 'Regra 36: chamar a atenção' },
          { t: 'p', html: 'Para atrair a atenção de outra embarcação, qualquer uma pode usar sinais sonoros ou luminosos que <strong>não se confundam</strong> com outro sinal do RIPEAM ou com um auxílio à navegação, ou dirigir o facho do holofote para o perigo sem ofuscar ninguém. Devem ser <strong>evitadas</strong> luzes intermitentes de grande intensidade e luzes rotativas, como as <strong>estroboscópicas</strong>. Um recurso comum em veleiros é iluminar a vela com uma lanterna potente quando um navio se aproxima.' },
          { t: 'h', txt: 'Regra 37 e Anexo IV: sinais de perigo' },
          { t: 'p', html: 'A embarcação em perigo que precisa de ajuda usa os sinais do Anexo IV, juntos ou separados:' },
          { t: 'tabela', cab: ['Tipo', 'Sinal (Anexo IV, item 1)'], linhas: [
            ['Sonoros', 'Tiro de canhão ou outro explosivo a intervalos de cerca de 1 minuto (a); <strong>toque contínuo</strong> de qualquer aparelho de sinal de cerração (b).'],
            ['Pirotécnicos', 'Foguetes ou granadas com <strong>estrelas encarnadas</strong>, um de cada vez, a intervalos curtos (c); <strong>foguete com paraquedas</strong> ou <strong>facho de mão</strong> com luz encarnada (i); sinal de <strong>fumaça laranja</strong> (j).'],
            ['Visuais sem pirotecnia', 'Chamas a bordo, como um barril de óleo queimando (h); bandeira quadrada com uma esfera (ou algo parecido) acima ou abaixo (g); sinal <strong>N.C.</strong> do Código Internacional de Sinais (f); <strong>braços estendidos para os lados, subindo e descendo devagar</strong> (k).'],
            ['Morse e voz', '<strong>SOS</strong> (···–––···) por qualquer meio (d); a palavra <strong>“Mayday”</strong> em radiotelefonia (e).'],
            ['Eletrônicos', 'Alerta de perigo por <strong>DSC</strong> no VHF canal 70 ou em MF/HF (l); alerta navio-terra por Inmarsat ou outro serviço por satélite (m); sinais de <strong>radiobaliza</strong> de emergência (EPIRB) (n); sinais aprovados de sistemas de radiocomunicação, como o <strong>SART</strong> das embarcações de sobrevivência (o).']
          ] },
          { t: 'figura', svg: SVG_M7_PERIGO, legenda: 'Quatro sinais visuais de perigo do Anexo IV. A bandeira pode ser de qualquer cor; o que conta é a forma quadrada com a esfera.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Só em perigo de verdade', html: 'O Anexo IV, item 2, <strong>proíbe</strong> usar qualquer desses sinais, ou outro que possa ser confundido com eles, fora de uma situação de perigo e necessidade de auxílio. Foguete em festa de réveillon a bordo pode desencadear uma busca. E lembre: as luzes de embarcação sem governo (duas encarnadas) <strong>não</strong> são pedido de socorro (Regra 27(h)).' },
          { t: 'h', txt: 'Que pirotécnicos ter a bordo' },
          { t: 'fato', ref: 'extra-arrais-2-06', html: 'A NORMAM-211 exige: em navegação costeira, 2 foguetes manuais de estrela vermelha com paraquedas, 2 fachos manuais de luz vermelha e 2 sinais fumígenos flutuantes laranja; em navegação oceânica, 4 de cada; em navegação interior, só as embarcações de grande porte, com 1 facho manual de luz vermelha.' },
          { t: 'lista', itens: [
            '<strong>Foguete com paraquedas</strong>: sobe alto e é visto de longe. Use quando houver chance real de alguém ver (navio no horizonte, costa à vista, aeronave). Siga as instruções impressas no artefato e segure com o braço estendido, longe do corpo, das velas e dos cabos.',
            '<strong>Facho de mão</strong>: mostra a sua posição a quem já está perto (o barco de resgate, o helicóptero). Segure a sotavento, fora da borda, sem olhar para a chama.',
            '<strong>Fumígeno laranja</strong>: de dia, mostra a posição e a direção do vento para aeronaves e barcos. Jogue na água a sotavento.',
            'Confira a <strong>validade</strong> e guarde em caixa estanque, à mão, perto do cockpit.'
          ] },
          { t: 'p', html: 'Os sinais por rádio (Mayday no canal 16, alerta DSC no canal 70), a EPIRB e o SART são assunto do módulo de rádio e segurança.' },
          { t: 'widget', w: 'sinais-sonoros', opts: { grupo: 'perigo' }, legenda: 'Os sinais sonoros de perigo: toque contínuo de cerração, explosivo a cada minuto e SOS em Morse.' },
          { t: 'termos', ids: ['sinais-de-perigo', 'pirotecnicos', 'mayday', 'dsc', 'canal-70', 'epirb', 'sart'] },
          { t: 'check', questoes: [
            q('m7l4-1', T_SOM, 1, 'Qual destes é um sinal de perigo do Anexo IV do RIPEAM?',
              ['Movimentos lentos para cima e para baixo com os braços estendidos para os lados.', 'Uma luz estroboscópica piscando no tope.', 'Três apitos curtos.', 'Duas luzes circulares encarnadas em linha vertical.'], 0,
              'Os braços estendidos subindo e descendo devagar estão no Anexo IV, 1(k). A luz estroboscópica é justamente o que a Regra 36 manda evitar para chamar a atenção. Três curtos significam “dando atrás” (Regra 34(a)). Duas encarnadas são de embarcação sem governo e a Regra 27(h) diz que não são sinal de perigo.',
              'RIPEAM, Regras 27(h), 34, 36 e Anexo IV'),
            q('m7l4-2', T_SOM, 1, 'De dia, um sinal de perigo visto na água é a fumaça de cor:',
              ['Branca.', 'Laranja.', 'Preta.', 'Verde.'], 1,
              'O Anexo IV, 1(j), prevê o sinal de fumaça de cor alaranjada. Fumaça branca ou preta pode ser de motor ou de incêndio comum e não é o sinal previsto; verde não aparece no Anexo IV.',
              'RIPEAM, Anexo IV, 1(j)'),
            q('m7l4-3', T_SOM, 2, 'Sobre o uso dos sinais de perigo fora de uma emergência, o RIPEAM diz que:',
              ['É permitido para teste, desde que avisado pelo rádio.', 'É proibido usar qualquer sinal de perigo, ou sinal que possa ser confundido com ele, exceto para indicar perigo e necessidade de auxílio.', 'É permitido em festas, longe da costa.', 'Só é proibido à noite.'], 1,
              'O Anexo IV, item 2, proíbe o uso ou a exibição de qualquer sinal de perigo, ou de sinais que possam ser confundidos com eles, exceto para indicar perigo e necessidade de auxílio. Não há exceção para testes, festas ou horário.',
              'RIPEAM, Anexo IV, item 2'),
            q('m7l4-4', T_SOM, 2, 'Pela NORMAM-211, qual a dotação de pirotécnicos de uma embarcação de esporte e recreio de médio porte em navegação costeira?',
              ['Nenhuma.', '1 facho manual de luz vermelha.', '2 foguetes manuais de estrela vermelha com paraquedas, 2 fachos manuais de luz vermelha e 2 sinais fumígenos flutuantes laranja.', '4 foguetes, 4 fachos e 4 fumígenos.'], 2,
              'O art. 4.17 da NORMAM-211 exige, na navegação costeira, dois foguetes com paraquedas, dois fachos manuais e dois fumígenos flutuantes laranja. Quatro de cada é a dotação da navegação oceânica. Um facho é exigido só das embarcações de grande porte em navegação interior. “Nenhuma” vale para as demais em navegação interior.',
              'NORMAM-211/DPC, art. 4.17')
          ] },
          { t: 'fontes', itens: [fR('Regras 27(h), 36 e 37 e Anexo IV'), { txt: 'NORMAM-211/DPC, art. 4.17 (pirotécnicos)', url: NORMAM211, ref: 'extra-arrais-2-06' }, F_MIG15] }
        ]
      }
    ]
  });

  /* =====================================================================================
     m8 — Balizamento IALA região B
     ===================================================================================== */
  function boiaBE(x, y, n) { return '<polygon points="' + x + ',' + (y - 13) + ' ' + (x - 9) + ',' + (y + 9) + ' ' + (x + 9) + ',' + (y + 9) + '" fill="var(--nav-red)" stroke="currentColor"/><text x="' + (x + 16) + '" y="' + (y + 6) + '" font-size="14" font-weight="700" fill="currentColor">' + n + '</text>'; }
  function boiaBB(x, y, n) { return '<rect x="' + (x - 8) + '" y="' + (y - 11) + '" width="16" height="20" fill="var(--nav-green)" stroke="currentColor"/><text x="' + (x - 16) + '" y="' + (y + 6) + '" font-size="14" font-weight="700" text-anchor="end" fill="currentColor">' + n + '</text>'; }
  var SVG_M8_PORTO =
    '<svg viewBox="0 0 400 310" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Entrando no porto, na Região B: boias encarnadas a boreste e verdes a bombordo</title>' +
    '<rect x="0" y="0" width="400" height="310" fill="var(--sea-1)"/>' +
    '<path d="M0,0 L130,0 L120,40 L95,130 L0,150 Z" fill="var(--land)" stroke="currentColor" stroke-width="1"/>' +
    '<path d="M400,0 L270,0 L280,40 L305,130 L400,150 Z" fill="var(--land)" stroke="currentColor" stroke-width="1"/>' +
    '<rect x="150" y="0" width="100" height="310" fill="var(--sea-3)" opacity="0.6"/>' +
    boiaBE(262, 236, '1') + boiaBE(262, 166, '3') + boiaBE(262, 96, '5') +
    boiaBB(138, 216, '2') + boiaBB(138, 146, '4') + boiaBB(138, 76, '6') +
    '<g stroke="var(--magenta)" stroke-width="3" fill="var(--magenta)"><line x1="200" y1="268" x2="200" y2="40"/><polygon points="200,26 191,44 209,44"/></g>' +
    '<circle cx="200" cy="292" r="10" fill="var(--nav-white)" stroke="currentColor"/><rect x="196" y="282.5" width="8" height="19" fill="var(--nav-red)"/>' +
    '<g font-size="14" fill="currentColor"><text x="200" y="16" text-anchor="middle" font-weight="700">porto</text>' +
    '<text x="218" y="297">águas seguras (aterragem)</text>' +
    '<text x="8" y="190">verdes a</text><text x="8" y="207">bombordo</text><text x="8" y="224">(pares)</text>' +
    '<text x="392" y="190" text-anchor="end">encarnadas</text><text x="392" y="207" text-anchor="end">a boreste</text><text x="392" y="224" text-anchor="end">(ímpares)</text>' +
    '<text x="8" y="276" fill="var(--magenta)">entrando, vindo do mar</text></g>' +
    '</svg>';

  var SVG_M8_PREFERENCIAL =
    '<svg viewBox="0 0 400 270" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Bifurcação de canal com sinal de canal preferencial a boreste</title>' +
    '<rect x="0" y="0" width="400" height="270" fill="var(--sea-1)"/>' +
    '<path d="M165,270 L235,270 L235,170 L380,52 L330,14 L200,140 L110,30 L78,52 L165,170 Z" fill="var(--sea-3)" opacity="0.7"/>' +
    '<rect x="194" y="130" width="12" height="9" fill="var(--nav-green)" stroke="currentColor"/>' +
    '<rect x="193" y="142" width="14" height="30" fill="var(--nav-green)" stroke="currentColor"/><rect x="193" y="151" width="14" height="10" fill="var(--nav-red)"/>' +
    '<path d="M200,260 L200,196 Q202,180 222,166 L322,82" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
    '<polygon points="334,72 314,78 326,92" fill="var(--magenta)"/>' +
    '<g font-size="14" fill="currentColor"><text x="262" y="150" font-weight="700">canal</text><text x="262" y="167" font-weight="700">preferencial</text>' +
    '<text x="8" y="96">canal</text><text x="8" y="113">secundário</text>' +
    '<text x="8" y="200">bombordo modificado:</text><text x="8" y="217">verde, faixa encarnada,</text><text x="8" y="234">luz verde Lp(2+1)</text></g>' +
    '</svg>';

  function cardinal(x, y, tipo) { /* y = base do corpo; cones acima */
    var s = '<rect x="' + (x - 6) + '" y="' + (y - 8) + '" width="12" height="36" fill="var(--nav-yellow)" stroke="currentColor" stroke-width="1.5"/>' +
      '<line x1="' + x + '" y1="' + (y - 8) + '" x2="' + x + '" y2="' + (y - 14) + '" stroke="currentColor" stroke-width="2"/>';
    function cima(b) { return '<polygon points="' + (x - 8) + ',' + b + ' ' + (x + 8) + ',' + b + ' ' + x + ',' + (b - 13) + '" fill="currentColor"/>'; }
    function baixo(t) { return '<polygon points="' + (x - 8) + ',' + t + ' ' + (x + 8) + ',' + t + ' ' + x + ',' + (t + 13) + '" fill="currentColor"/>'; }
    if (tipo === 'N') s += cima(y - 14) + cima(y - 30);
    if (tipo === 'S') s += baixo(y - 44) + baixo(y - 27);
    if (tipo === 'L') s += baixo(y - 28) + cima(y - 28);
    if (tipo === 'O') s += baixo(y - 46) + cima(y - 19);
    return s;
  }
  var SVG_M8_CARDINAIS =
    '<svg viewBox="0 0 400 370" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Os quatro sinais cardinais em volta de um perigo, com os topes e as luzes</title>' +
    '<rect x="0" y="0" width="400" height="370" fill="var(--sea-1)"/>' +
    '<g stroke="currentColor" stroke-width="1" stroke-dasharray="5 5" opacity="0.7"><line x1="200" y1="185" x2="50" y2="50"/><line x1="200" y1="185" x2="350" y2="50"/><line x1="200" y1="185" x2="350" y2="320"/><line x1="200" y1="185" x2="50" y2="320"/></g>' +
    '<g font-size="13" fill="currentColor"><text x="40" y="46" text-anchor="end">NW</text><text x="360" y="46">NE</text><text x="360" y="332">SE</text><text x="40" y="332" text-anchor="end">SW</text></g>' +
    '<circle cx="200" cy="185" r="13" fill="var(--land)" stroke="currentColor" stroke-width="1.5"/><text x="200" y="215" text-anchor="middle" font-size="13" fill="currentColor">perigo</text>' +
    cardinal(200, 96, 'N') + cardinal(200, 276, 'S') + cardinal(330, 186, 'L') + cardinal(70, 186, 'O') +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="200" y="18" font-weight="700">Norte: passe ao norte</text><text x="200" y="36">R ou MR contínua</text>' +
    '<text x="330" y="242" font-weight="700">Leste: passe a leste</text><text x="330" y="259">R(3) 10s · MR(3) 5s</text>' +
    '<text x="200" y="336" font-weight="700">Sul: passe ao sul</text><text x="200" y="353">R(6)+LpL 15s · MR(6)+LpL 10s</text></g>' +
    '<g font-size="14" fill="currentColor"><text x="4" y="242" font-weight="700">Oeste: passe a oeste</text><text x="4" y="259">R(9) 15s · MR(9) 10s</text></g>' +
    '</svg>';

  var SVG_M8_TOPES =
    '<svg viewBox="0 0 400 186" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Marcas de tope e luzes de perigo isolado, águas seguras, especial e novo perigo</title>' +
    '<g><circle cx="50" cy="30" r="10" fill="currentColor"/><circle cx="50" cy="56" r="10" fill="currentColor"/></g>' +
    '<circle cx="150" cy="44" r="12" fill="var(--nav-red)" stroke="currentColor"/>' +
    '<g stroke-linecap="square"><g stroke="currentColor" stroke-width="9"><line x1="238" y1="30" x2="262" y2="58"/><line x1="262" y1="30" x2="238" y2="58"/></g>' +
    '<g stroke="var(--nav-yellow)" stroke-width="5"><line x1="238" y1="30" x2="262" y2="58"/><line x1="262" y1="30" x2="238" y2="58"/></g></g>' +
    '<g stroke-linecap="square"><g stroke="currentColor" stroke-width="9"><line x1="350" y1="26" x2="350" y2="62"/><line x1="332" y1="44" x2="368" y2="44"/></g>' +
    '<g stroke="var(--nav-yellow)" stroke-width="5"><line x1="350" y1="26" x2="350" y2="62"/><line x1="332" y1="44" x2="368" y2="44"/></g></g>' +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="50" y="98" font-weight="700">Perigo</text><text x="50" y="115" font-weight="700">isolado</text><text x="50" y="134">2 esferas</text><text x="50" y="151">Lp(2) B</text>' +
    '<text x="150" y="98" font-weight="700">Águas</text><text x="150" y="115" font-weight="700">seguras</text><text x="150" y="134">1 esfera</text><text x="150" y="151">Iso, Oc, LpL</text><text x="150" y="168">ou Mo(A) B</text>' +
    '<text x="250" y="98" font-weight="700">Especial</text><text x="250" y="134">X amarelo</text><text x="250" y="151">luz amarela</text>' +
    '<text x="350" y="98" font-weight="700">Novo</text><text x="350" y="115" font-weight="700">perigo</text><text x="350" y="134">cruz amarela</text><text x="350" y="151">Az e A</text><text x="350" y="168">alternadas</text></g>' +
    '</svg>';

  var SVG_M8_ALCANCE =
    '<svg viewBox="0 0 400 200" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Alcance geográfico: a curvatura da Terra esconde a luz abaixo do horizonte</title>' +
    '<path d="M0,150.2 A1000,1000 0 0 1 400,150.2 L400,200 L0,200 Z" fill="var(--sea-2)" stroke="currentColor" stroke-width="1.5"/>' +
    '<line x1="40" y1="136.8" x2="360" y2="120.7" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="6 4"/>' +
    '<path d="M28,141 L52,141 L48,147 L32,147 Z" fill="currentColor"/><line x1="40" y1="141" x2="40" y2="136.8" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="136.8" r="3" fill="var(--magenta)"/>' +
    '<path d="M354,143 L357,124 L363,124 L366,143 Z" fill="var(--nav-white)" stroke="currentColor"/><circle cx="360" cy="120.7" r="5" fill="var(--nav-yellow)" stroke="currentColor"/>' +
    '<circle cx="150" cy="131.25" r="3.5" fill="currentColor"/>' +
    '<g font-size="14" fill="currentColor"><text x="200" y="26" text-anchor="middle" font-weight="700">D = 1,927 × (√H + √h)</text>' +
    '<text x="200" y="46" text-anchor="middle">D em milhas; H e h em metros</text>' +
    '<text x="150" y="112" text-anchor="middle">horizonte</text>' +
    '<text x="12" y="126">h: olho</text><text x="388" y="112" text-anchor="end">H: luz</text></g>' +
    '</svg>';

  M.push({
    id: 'm8', titulo: 'Balizamento IALA região B',
    resumo: 'O Sistema de Balizamento Marítimo da IALA na Região B, adotado pelo Brasil: direção convencional, sinais laterais e de canal preferencial, cardinais, perigo isolado, águas seguras, especiais, novos perigos e a leitura das características das luzes na carta e na Lista de Faróis. NORMAM-211, Anexo 5-A, 3.1 g).',
    licoes: [
      /* ---------------- m8 l1 ---------------- */
      {
        id: 'l1', titulo: 'O sistema IALA e a Região B no Brasil', minutos: 12,
        objetivos: [
          'Saber o que é o balizamento e por que o Brasil usa a Região B.',
          'Aplicar a direção convencional do balizamento, no mar e nos rios.',
          'Identificar um sinal pela cor, forma, tope, luz e numeração.'
        ],
        blocos: [
          { t: 'p', html: '<strong>Balizamento</strong> é o conjunto de sinais que marcam canais, perigos e áreas especiais: <strong>boias</strong> (flutuantes, presas ao fundo por amarra), <strong>balizas</strong> e <strong>faroletes</strong> (fixos, sobre pedras, estacas ou estruturas) e <strong>faróis</strong>. Eles seguem um sistema internacional criado pela IALA (Associação Internacional de Sinalização Marítima).' },
          { t: 'p', html: 'O mundo usa duas variantes: a <strong>Região A</strong> e a <strong>Região B</strong>. Elas só diferem nas <strong>cores dos sinais laterais</strong>. Todos os outros sinais (cardinais, perigo isolado, águas seguras, especiais, novos perigos) são iguais nas duas.' },
          { t: 'fato', ref: 'tecnico-90', html: 'O Decreto nº 92.267/1986 aprovou o Sistema de Balizamento Marítimo da IALA, Região “B”, para o balizamento marítimo e de águas interiores do Brasil.' },
          { t: 'fato', ref: 'tecnico-96', html: 'Na Região B, as cores laterais são invertidas em relação à Região A: encarnado a boreste e verde a bombordo de quem entra.' },
          { t: 'h', txt: 'Direção convencional do balizamento' },
          { t: 'p', html: '“Boreste” e “bombordo” de um canal são definidos para quem segue a <strong>direção convencional</strong>:' },
          { t: 'fato', ref: 'tecnico-98', html: 'É a direção do navegante que, vindo do mar, demanda uma baía, enseada, porto, estuário, lagoa ou rio.' },
          { t: 'fato', ref: 'tecnico-99', html: 'Em rios não associados a baía, enseada ou estuário marítimo, a direção convencional é sempre da foz para a nascente: subindo o rio.' },
          { t: 'p', html: 'Na prática: <strong>entrando, encarnado a boreste</strong>. Saindo para o mar, ou descendo o rio, tudo se inverte: as encarnadas ficam a bombordo e as verdes a boreste.' },
          { t: 'figura', svg: SVG_M8_PORTO, legenda: 'Entrando num porto brasileiro. A boia de águas seguras na entrada marca o ponto de aterragem; a numeração cresce a partir da entrada.' },
          { t: 'fato', ref: 'extra-mestre-2-28', html: 'Quando os sinais de um canal são numerados, os encarnados recebem números ímpares e os verdes números pares, em ordem crescente a partir da entrada do porto. Alinhamentos são identificados por letras.' },
          { t: 'h', txt: 'Como identificar um sinal' },
          { t: 'tabela', cab: ['De dia', 'À noite'], linhas: [
            ['<strong>Cor</strong> do corpo (e das faixas)', '<strong>Cor</strong> da luz'],
            ['<strong>Forma</strong>: cônica, cilíndrica (lata), esférica, pilar ou charuto', '<strong>Ritmo</strong>: como a luz acende e apaga (lição 5)'],
            ['<strong>Marca de tope</strong>: cone, cilindro, esferas, X, cruz', '<strong>Período</strong>: tempo de um ciclo completo'],
            ['<strong>Número ou letra</strong> pintados', 'Às vezes, um <strong>Racon</strong> (eco codificado na tela do radar)']
          ] },
          { t: 'fato', ref: 'tecnico-91', html: 'Nas águas interiores, o sistema pode ser complementado por outros sinais, desde que autorizados pela Diretoria de Hidrografia e Navegação (DHN). É o caso dos painéis de margem nos rios (próxima lição).' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Boia não é posição', html: 'Boias podem garrar, apagar ou ser retiradas para manutenção. Os Avisos aos Navegantes informam mudanças. Confirme a posição pela carta, pelo GNSS e pelos alinhamentos, e nunca passe raspando numa boia: o perigo que ela marca pode estar mais perto do que parece.' },
          { t: 'callout', tipo: 'intl', intl: true, titulo: 'Fretando fora do Brasil', html: 'A Região B cobre as Américas, a Coreia do Sul, as Filipinas e o Japão. Europa, África, Oceania e a maior parte da Ásia usam a <strong>Região A</strong>, com as cores laterais trocadas: entrando, <em>verde</em> a boreste e <em>encarnado</em> a bombordo. Num charter no <span class="agua">Mediterrâneo</span>, a sua regra “entrando, encarnado a boreste” fica errada.' },
          { t: 'fato', ref: 'tecnico-127', intl: true, html: 'A Carta 12000 (INT 1) da DHN descreve a Região B como composta principalmente das águas das Américas do Norte e do Sul, da República da Coreia e das Filipinas (o texto em inglês inclui o Japão).' },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'galeria', marca: 'boreste' }, legenda: 'Galeria de sinais da Região B, em 3D e em desenho, com a luz animada de cada um.' },
          { t: 'termos', ids: ['balizamento', 'iala-regiao-b', 'marca-lateral', 'farol', 'avisos-aos-navegantes', 'boreste', 'bombordo'] },
          { t: 'check', questoes: [
            q('m8l1-1', T_IALA, 1, 'Entrando num porto brasileiro vindo do mar, as boias encarnadas devem ficar:',
              ['A boreste.', 'A bombordo.', 'Dos dois lados, alternadas.', 'Depende da maré.'], 0,
              'No Brasil vale a Região B (Decreto 92.267/1986): na direção convencional, de quem vem do mar, o encarnado fica a boreste e o verde a bombordo. Encarnado a bombordo é a Região A. A maré não muda o lado das boias.',
              'Decreto nº 92.267/1986; NORMAM-601/DHN'),
            q('m8l1-2', T_IALA, 2, 'Num rio que não está ligado a baía, enseada ou estuário, a direção convencional do balizamento é:',
              ['Da nascente para a foz (descendo o rio).', 'Da foz para a nascente (subindo o rio).', 'Sempre de norte para sul.', 'A que a correnteza indicar no dia.'], 1,
              'A NORMAM-601 fixa que, nos rios não associados a baía, enseada ou estuário, a direção convencional é sempre da foz para a nascente. Descer o rio inverte os lados. Norte-sul e a correnteza do dia não definem o balizamento.',
              'NORMAM-601/DHN, art. 2.5'),
            q('m8l1-3', T_IALA, 2, 'Num canal com sinais numerados, os sinais verdes recebem:',
              ['Números ímpares, crescendo a partir da entrada.', 'Números pares, crescendo a partir da entrada.', 'Letras, crescendo a partir da entrada.', 'Números pares, crescendo a partir do porto para o mar.'], 1,
              'No balizamento brasileiro, os encarnados levam números ímpares e os verdes números pares, em ordem crescente a partir da entrada do porto; letras identificam alinhamentos. Por isso a primeira boia verde de um canal costuma ser a 2.',
              'Lista de Faróis/NORMAM-601 (DHN)')
          ] },
          { t: 'fontes', itens: [{ txt: 'Decreto nº 92.267/1986 (Planalto)', url: DEC92267, ref: 'tecnico-90' }, { txt: 'NORMAM-601/DHN, Cap. 2 e 3', url: NORMAM601, ref: 'tecnico-98' }, { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), Cap. 13 — Auxílios à navegação', url: MIG1 }, { txt: 'IALA, Recomendação R1001 — Sistema de Balizamento Marítimo', url: 'https://www.iala.int/', ref: 'tecnico-97' }] }
        ]
      },
      /* ---------------- m8 l2 ---------------- */
      {
        id: 'l2', titulo: 'Sinais laterais e canal preferencial', minutos: 12,
        objetivos: [
          'Reconhecer os sinais laterais de bombordo e de boreste da Região B, de dia e à noite.',
          'Escolher o caminho numa bifurcação pelo sinal de canal preferencial.',
          'Entender a sinalização complementar das margens dos rios.'
        ],
        blocos: [
          { t: 'p', html: 'Os <strong>sinais laterais</strong> marcam os limites de um canal. Na Região B, seguindo a direção convencional:' },
          { t: 'tabela', cab: ['', 'Sinal de bombordo', 'Sinal de boreste'], linhas: [
            ['Cor', '<strong>Verde</strong>', '<strong>Encarnado</strong>'],
            ['Forma (boias)', 'Cilíndrica (lata), pilar ou charuto', 'Cônica, pilar ou charuto'],
            ['Marca de tope (se houver)', 'Um cilindro verde', 'Um cone encarnado, vértice para cima'],
            ['Luz (se houver)', 'Verde, qualquer ritmo exceto Lp(2+1)', 'Encarnada, qualquer ritmo exceto Lp(2+1)'],
            ['Numeração', 'Pares', 'Ímpares']
          ], legenda: 'Sinais laterais da Região B (Miguens, Vol. I, figura 13.14; NORMAM-601).' },
          { t: 'callout', tipo: 'dica', titulo: 'Forma também diz o lado', html: 'De longe, contra o sol, a cor some. A forma não: <strong>cone</strong> (pontudo) é boreste; <strong>cilindro</strong> (lata, topo reto) é bombordo. Treine na galeria até reconhecer sem pensar.' },
          { t: 'h', txt: 'Canal preferencial' },
          { t: 'p', html: 'Onde um canal se divide, seguindo a direção convencional, um sinal lateral <strong>modificado</strong> indica qual é o canal preferencial (o principal, mais fundo ou mais usado):' },
          { t: 'lista', itens: [
            '<strong>Canal preferencial a boreste</strong>: sinal de <strong>bombordo modificado</strong>. Verde com uma larga faixa horizontal encarnada; tope cilindro verde; luz verde <strong>Lp(2+1)</strong>. Você o deixa por bombordo, como um sinal verde, e segue pelo canal da direita.',
            '<strong>Canal preferencial a bombordo</strong>: sinal de <strong>boreste modificado</strong>. Encarnado com uma larga faixa horizontal verde; tope cone encarnado; luz encarnada <strong>Lp(2+1)</strong>. Você o deixa por boreste e segue pelo canal da esquerda.',
            'A cor de baixo e de cima do corpo (a predominante) diz como tratar o sinal no canal preferencial; a faixa diz que o outro canal existe.'
          ] },
          { t: 'fato', ref: 'tecnico-105', html: 'A luz de canal preferencial é um grupo de lampejos compostos (2+1), com período não maior que 16 segundos.' },
          { t: 'figura', svg: SVG_M8_PREFERENCIAL, legenda: 'Bifurcação seguindo a direção convencional. O sinal verde com faixa encarnada (bombordo modificado) fica por bombordo de quem segue o canal preferencial, à direita.' },
          { t: 'h', txt: 'Rios e lagos: sinalização complementar' },
          { t: 'p', html: 'Em rios largos e retos usam-se os mesmos sinais do mar, com a direção convencional subindo o rio. Onde o rio é estreito ou sinuoso, a DHN autoriza <strong>painéis nas margens</strong>, com símbolos que recomendam uma ação: navegar junto à margem, mudar de margem, navegar no meio do rio, além de avisos de pontes, obstruções e distâncias. Na sinalização fluvial, <strong>margem esquerda</strong> é a do lado esquerdo de quem <strong>desce</strong> o rio. Um painel vale do ponto onde está até o próximo painel de margem.' },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'porto', modos: ['porto'], porto: 'decidir' }, legenda: 'Entrando no porto: decida por qual lado deixar cada sinal, de dia e de noite. Depois troque para “conduzir” e leve o barco pelo canal.' },
          { t: 'termos', ids: ['marca-lateral', 'balizamento', 'iala-regiao-b', 'caracteristica-da-luz'] },
          { t: 'check', questoes: [
            q('m8l2-1', T_IALA, 1, 'Saindo do porto em direção ao mar aberto, uma boia lateral verde deve ficar:',
              ['A bombordo.', 'A boreste.', 'Pela proa.', 'Depende do número dela.'], 1,
              'A direção convencional é a de quem entra. Saindo, os lados se invertem: o verde, que fica a bombordo de quem entra, fica a boreste de quem sai. O número indica a ordem a partir da entrada, não o lado.',
              'NORMAM-601/DHN; Decreto nº 92.267/1986'),
            q('m8l2-2', T_IALA, 2, 'Na direção convencional, você encontra numa bifurcação um sinal verde com uma larga faixa horizontal encarnada e luz verde Lp(2+1). Ele indica:',
              ['Canal preferencial a boreste; deixe o sinal por bombordo para seguir o canal preferencial.', 'Canal preferencial a bombordo; deixe o sinal por boreste.', 'Perigo isolado no meio do canal.', 'Que os dois canais são iguais.'], 0,
              'É o sinal de bombordo modificado da Região B, que indica canal preferencial a boreste: trate-o como um verde (deixe por bombordo) e siga pela direita. O de boreste modificado é encarnado com faixa verde. Perigo isolado é preto com faixas encarnadas e luz branca. Se os canais fossem iguais, não haveria sinal de canal preferencial.',
              'Miguens, Vol. I, Cap. 13 (fig. 13.15); NORMAM-601/DHN, art. 3.4'),
            q('m8l2-3', T_IALA, 2, 'Qual destes ritmos NÃO pode ser usado na luz de um sinal lateral comum (de bombordo ou de boreste) da Região B?',
              ['Lp V 3s.', 'Lp(2) E 6s.', 'Lp(2+1) V 12s.', 'R E.'], 2,
              'O grupo de lampejos compostos (2+1) é reservado aos sinais de canal preferencial; os laterais comuns podem usar qualquer outro ritmo, como lampejo simples, grupo de dois ou luz rápida. Por isso Lp(2+1) V 12s indicaria um bombordo modificado, não um lateral comum.',
              'Miguens, Vol. I, Cap. 13 (fig. 13.14 e 13.15)'),
            q('m8l2-4', T_IALA, 2, 'Na sinalização complementar dos rios, a “margem esquerda” é:',
              ['A que fica à esquerda de quem sobe o rio.', 'A que fica à esquerda de quem desce o rio.', 'Sempre a margem oeste.', 'A margem onde ficam as boias verdes.'], 1,
              'Na sinalização fluvial, margem esquerda é a do lado esquerdo de quem desce o rio, de montante para jusante. Ela não depende dos pontos cardeais nem da cor das boias (a direção convencional das boias, subindo o rio, é outra convenção).',
              'Miguens, Vol. I, item 13.4.1')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), itens 13.3 e 13.4', url: MIG1 }, { txt: 'NORMAM-601/DHN, Cap. 3', url: NORMAM601, ref: 'tecnico-105' }, { txt: 'Decreto nº 92.267/1986, art. 2º', url: DEC92267, ref: 'tecnico-91' }] }
        ]
      },
      /* ---------------- m8 l3 ---------------- */
      {
        id: 'l3', titulo: 'Sinais cardinais', minutos: 13,
        objetivos: [
          'Saber por qual lado passar de cada sinal cardinal.',
          'Reconhecer os cardinais pelo tope, pelas cores e pela luz.',
          'Usar o “relógio” para decorar os ritmos das luzes.'
        ],
        blocos: [
          { t: 'p', html: 'Os <strong>sinais cardinais</strong> não dizem qual é o lado do canal: dizem <strong>onde está a água boa</strong> em relação a um perigo. O nome do sinal é o lado por onde passar. Um <strong>cardinal norte</strong> está ao norte do perigo, e você passa <strong>ao norte dele</strong>.' },
          { t: 'fato', ref: 'tecnico-106', html: 'O nome de um sinal cardinal indica o quadrante em que o navegante deve passar em relação ao sinal. Os quadrantes são limitados pelas marcações verdadeiras NW–NE (norte), NE–SE (leste), SE–SW (sul) e SW–NW (oeste).' },
          { t: 'h', txt: 'Tope, cores e luzes' },
          { t: 'tabela', cab: ['Cardinal', 'Tope (2 cones pretos)', 'Cores', 'Luz branca'], linhas: [
            ['Norte', 'Os dois com o vértice para cima', 'Preto em cima, amarelo embaixo', 'Rápida (R) ou muito rápida (MR) contínua'],
            ['Leste', 'Base com base (um para cima, outro para baixo)', 'Preto com uma faixa horizontal amarela', 'Grupo de 3: MR(3) a cada 5 s ou R(3) a cada 10 s'],
            ['Sul', 'Os dois com o vértice para baixo', 'Amarelo em cima, preto embaixo', 'Grupo de 6 e um lampejo longo: MR(6)+LpL a cada 10 s ou R(6)+LpL a cada 15 s'],
            ['Oeste', 'Vértice com vértice', 'Amarelo com uma faixa horizontal preta', 'Grupo de 9: MR(9) a cada 10 s ou R(9) a cada 15 s']
          ], legenda: 'Forma das boias cardinais: pilar ou charuto. O tope de dois cones é o indicador diurno mais importante.' },
          { t: 'callout', tipo: 'dica', titulo: 'Dois truques', html: '<strong>Os cones apontam para o preto.</strong> Norte: os dois para cima, preto em cima. Sul: para baixo, preto embaixo. Leste: um para cima e outro para baixo, preto nas duas pontas. Oeste: os vértices se encontram no meio, preto no meio.<br><strong>O relógio.</strong> Leste fica nas 3 horas: 3 lampejos. Sul nas 6: 6 lampejos (mais um longo, para não confundir com 3 ou 9 contados às pressas). Oeste nas 9: 9 lampejos. Norte, no 12, pisca sem parar.' },
          { t: 'figura', svg: SVG_M8_CARDINAIS, legenda: 'Os quatro cardinais em volta de um perigo, com os topes de cones pretos. Os corpos aparecem só em contorno; as cores de cada um estão na tabela acima e no simulador abaixo.' },
          { t: 'p', html: 'Cardinais aparecem em parcéis e pedras isoladas, em bancos de areia na entrada de rios e na marcação de cascos soçobrados. Ao ver um cardinal, consulte a carta: ele avisa um perigo, e a passagem segura é pelo quadrante do nome, com boa folga.' },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'galeria', marca: 'cardinal-n', categorias: ['cardinal'] }, legenda: 'Os quatro cardinais em 3D, com a luz de cada um. Gire a cena e compare os topes.' },
          { t: 'termos', ids: ['marca-cardinal', 'luz-rapida', 'lampejo', 'pontos-cardeais'] },
          { t: 'check', questoes: [
            q('m8l3-1', T_IALA, 1, 'Você avista um sinal cardinal sul. Por onde deve passar?',
              ['Ao sul do sinal.', 'Ao norte do sinal.', 'Pelo lado que deixar o sinal a boreste.', 'Entre o sinal e o perigo.'], 0,
              'O nome do cardinal indica o quadrante em que o navegante deve passar em relação ao sinal: cardinal sul, passe ao sul. Ao norte dele está o perigo. Cardinais não seguem a regra de boreste/bombordo dos laterais, e passar entre o sinal e o perigo é justamente o erro a evitar.',
              'Decreto nº 92.267/1986, Anexo, item 3.1.3'),
            q('m8l3-2', T_IALA, 1, 'Um sinal tem como tope dois cones pretos com os vértices para baixo. É um cardinal:',
              ['Norte.', 'Sul.', 'Leste.', 'Oeste.'], 1,
              'Dois cones com os vértices para baixo identificam o cardinal sul. Norte tem os dois para cima; leste, base com base; oeste, vértice com vértice.',
              'NORMAM-601/DHN; Miguens, Vol. I, Cap. 13'),
            q('m8l3-3', T_IALA, 2, 'À noite você vê uma luz branca com grupos de 9 lampejos rápidos a cada 15 segundos. É um sinal:',
              ['Cardinal oeste.', 'Cardinal leste.', 'Cardinal sul.', 'De perigo isolado.'], 0,
              'Grupo de 9 lampejos (R(9) 15s ou MR(9) 10s) é do cardinal oeste, as 9 horas do relógio. Leste tem 3 lampejos; sul, 6 mais um lampejo longo; perigo isolado, grupo de 2 lampejos.',
              'NORMAM-601/DHN; Lista de Faróis (DHN)'),
            q('m8l3-4', T_IALA, 2, 'As cores de um cardinal leste são:',
              ['Preto em cima e amarelo embaixo.', 'Preto com uma faixa horizontal amarela.', 'Amarelo com uma faixa horizontal preta.', 'Amarelo em cima e preto embaixo.'], 1,
              'O cardinal leste é preto com uma larga faixa horizontal amarela (os cones base com base apontam para o preto nas duas pontas). Preto sobre amarelo é o norte; amarelo com faixa preta, o oeste; amarelo sobre preto, o sul.',
              'NORMAM-601/DHN; Miguens, Vol. I, Cap. 13')
          ] },
          { t: 'fontes', itens: [{ txt: 'Decreto nº 92.267/1986, Anexo, item 3', url: DEC92267, ref: 'tecnico-106' }, { txt: 'NORMAM-601/DHN, Cap. 3 (sinais cardinais)', url: NORMAM601, ref: 'tecnico-107' }, { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), item 13.3', url: MIG1 }] }
        ]
      },
      /* ---------------- m8 l4 ---------------- */
      {
        id: 'l4', titulo: 'Perigo isolado, águas seguras, especiais e novo perigo', minutos: 12,
        objetivos: [
          'Reconhecer o sinal de perigo isolado e saber como passar por ele.',
          'Reconhecer o sinal de águas seguras e os sinais especiais.',
          'Reconhecer a sinalização de um novo perigo.'
        ],
        blocos: [
          { t: 'h', txt: 'Perigo isolado' },
          { t: 'p', html: 'Marca um perigo de tamanho pequeno, com <strong>água navegável em volta</strong>: uma pedra, um casco afundado. O sinal fica sobre o perigo ou fundeado junto dele.' },
          { t: 'lista', itens: [
            '<strong>Cor</strong>: preta, com uma ou mais faixas horizontais encarnadas.',
            '<strong>Tope</strong>: <strong>duas esferas pretas</strong>, uma sobre a outra (obrigatório).',
            '<strong>Luz</strong>: branca, <strong>grupo de dois lampejos</strong>, Lp(2).'
          ] },
          { t: 'fato', ref: 'tecnico-116', html: 'Pela NORMAM-601, a luz do sinal de perigo isolado é branca, com grupo de dois lampejos a cada cinco ou dez segundos.' },
          { t: 'h', txt: 'Águas seguras' },
          { t: 'p', html: 'Indica <strong>água navegável em todo o entorno</strong>: o meio de um canal, um ponto de aterragem na chegada a um porto, um ponto de espera. É comum na “boia de mar” das barras.' },
          { t: 'lista', itens: [
            '<strong>Cor</strong>: listras <strong>verticais</strong> encarnadas e brancas.',
            '<strong>Forma</strong>: esférica, pilar ou charuto. <strong>Tope</strong> (se houver): uma esfera encarnada.',
            '<strong>Luz</strong>: branca, <strong>isofásica</strong>, de <strong>ocultação</strong>, <strong>lampejo longo a cada 10 s</strong> ou <strong>Morse “A”</strong> (· –).'
          ] },
          { t: 'h', txt: 'Sinais especiais' },
          { t: 'p', html: 'Não orientam a navegação: marcam uma <strong>área ou característica especial</strong> que aparece nos documentos náuticos. Exemplos: boias oceanográficas (ODAS), cabos e tubulações submarinas, áreas de despejo, de exercícios militares, de fundeio, de aquicultura, de obras, a segurança em volta de usinas hidrelétricas e as <strong>áreas de recreação</strong>, como as raias de banhistas.' },
          { t: 'lista', itens: [
            '<strong>Cor</strong>: amarela. <strong>Tope</strong> (se houver): um “<strong>X</strong>” amarelo.',
            '<strong>Forma</strong>: livre, desde que não se confunda com a dos sinais de navegação.',
            '<strong>Luz</strong>: amarela, com ritmo que não se confunda com o das luzes brancas (por exemplo, Lp(5) A 20s nas boias ODAS).'
          ] },
          { t: 'fato', ref: 'tecnico-119', html: 'O Decreto nº 92.267/1986 descreve o sinal especial: cor amarela; forma opcional, com exceção da cilíndrica, cônica ou esférica; marca de tope (se houver) em formato de “X” amarelo.' },
          { t: 'fato', ref: 'tecnico-120', html: 'Entre os usos de sinais especiais previstos pela NORMAM-601 está a delimitação de áreas de recreação.' },
          { t: 'h', txt: 'Novos perigos' },
          { t: 'p', html: 'Um <strong>novo perigo</strong> é uma obstrução descoberta há pouco e que ainda não está nas cartas e publicações: um banco de areia que se formou, um casco que afundou. Ele é marcado com sinais laterais, cardinais, de perigo isolado ou especiais, com cuidados extras:' },
          { t: 'fato', ref: 'tecnico-121', html: 'Pelo menos um dos sinais que balizam um novo perigo deve ser duplicado, com um sinal idêntico ao seu par.' },
          { t: 'fato', ref: 'tecnico-122', html: 'Pela NORMAM-601, o sinal luminoso de novo perigo usa a característica de sinal cardinal ou lateral com ritmo rápido (R) ou muito rápido (MR); pode haver um Racon transmitindo a letra “D” em Morse (– · ·).' },
          { t: 'fato', ref: 'tecnico-123', html: 'A IALA prevê ainda a boia de marcação de destroços de emergência: listras verticais azuis e amarelas, tope em cruz amarela e luz alternada azul e amarela.' },
          { t: 'figura', svg: SVG_M8_TOPES, legenda: 'Marcas de tope e luzes destes quatro grupos de sinais.' },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'galeria', marca: 'perigo-isolado', categorias: ['perigo', 'seguras', 'especial', 'novo'] }, legenda: 'Perigo isolado, águas seguras, especial e marcação de destroços na galeria.' },
          { t: 'termos', ids: ['perigo-isolado', 'aguas-seguras', 'marca-especial', 'naufragio-recente', 'isofasica', 'ocultacao'] },
          { t: 'check', questoes: [
            q('m8l4-1', T_IALA, 1, 'Uma boia preta com uma faixa horizontal encarnada e tope de duas esferas pretas indica:',
              ['Perigo isolado, com água navegável em volta.', 'Águas seguras.', 'Canal preferencial.', 'Área de recreação.'], 0,
              'Preto com faixas horizontais encarnadas e tope de duas esferas é o sinal de perigo isolado, colocado sobre ou junto de um perigo pequeno com água navegável em volta. Águas seguras tem listras verticais encarnadas e brancas; canal preferencial é lateral modificado (verde ou encarnado com faixa); área de recreação usa sinal especial amarelo.',
              'NORMAM-601/DHN; Miguens, Vol. I, Cap. 13'),
            q('m8l4-2', T_IALA, 2, 'À noite, você vê uma luz branca em Morse “A” (· –). Ela pode ser de um sinal de:',
              ['Águas seguras.', 'Perigo isolado.', 'Cardinal norte.', 'Especial.'], 0,
              'Morse “A” é uma das luzes do sinal de águas seguras (com isofásica, ocultação e lampejo longo a cada 10 s). Perigo isolado usa Lp(2) branco; cardinal norte, R ou MR contínua; especial, luz amarela, e as letras A e U em Morse não são usadas em sinais especiais.',
              'Miguens, Vol. I, item 13.3; Lista de Faróis (DHN)'),
            q('m8l4-3', T_IALA, 1, 'Boias amarelas com tope em “X” amarelo, numa praia, normalmente delimitam:',
              ['Uma área especial, como a de recreação ou de banhistas.', 'O lado de boreste de um canal.', 'Um perigo isolado.', 'Águas seguras.'], 0,
              'Sinais amarelos com tope em X são sinais especiais, que marcam uma área ou característica especial; a NORMAM-601 prevê seu uso na delimitação de áreas de recreação. Lado de boreste é encarnado; perigo isolado, preto e encarnado; águas seguras, listras verticais encarnadas e brancas.',
              'NORMAM-601/DHN'),
            q('m8l4-4', T_IALA, 2, 'Uma boia com listras verticais azuis e amarelas, tope em cruz amarela e luz alternando azul e amarelo indica:',
              ['Um novo perigo, como destroços recentes.', 'Uma boia oceanográfica (ODAS).', 'Um ponto de aterragem.', 'O limite de uma área militar.'], 0,
              'É a boia de marcação de destroços de emergência da IALA, usada para novos perigos, representada na Lista de Faróis da DHN no quadro de novos perigos. ODAS e áreas militares usam sinais especiais amarelos; o ponto de aterragem usa águas seguras.',
              'IALA (boia de destroços de emergência); Lista de Faróis (DHN)')
          ] },
          { t: 'fontes', itens: [{ txt: 'NORMAM-601/DHN, Cap. 3', url: NORMAM601, ref: 'tecnico-121' }, { txt: 'Decreto nº 92.267/1986, Anexo, item 6', url: DEC92267, ref: 'tecnico-119' }, { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), item 13.3', url: MIG1 }, { txt: 'Lista de Faróis, 40ª ed. (DHN/CHM), quadro “Novos Perigos”', url: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois', ref: 'tecnico-125' }] }
        ]
      },
      /* ---------------- m8 l5 ---------------- */
      {
        id: 'l5', titulo: 'Características das luzes: ler a carta e a Lista de Faróis', minutos: 14,
        objetivos: [
          'Decifrar a característica de uma luz (ritmo, cor, período e alcance).',
          'Saber a diferença entre alcance luminoso, nominal e geográfico.',
          'Calcular o alcance geográfico de um farol.'
        ],
        blocos: [
          { t: 'p', html: 'Faróis, faroletes e boias luminosas têm uma <strong>característica</strong>: o jeito próprio de acender e apagar, a cor e o período. Ela aparece na carta náutica, ao lado do símbolo, e na <strong>Lista de Faróis</strong> da DHN, com mais detalhes.' },
          { t: 'fato', ref: 'tecnico-140', html: 'A Lista de Faróis vigente é a 40ª edição (2026–2027), atualizada até o folheto de Avisos aos Navegantes nº 17/2026, com PDF para download no site do CHM.' },
          { t: 'h', txt: 'Os ritmos' },
          { t: 'tabela', cab: ['Ritmo', 'Carta (INT 1)', 'Lista de Faróis', 'Como é'], linhas: [
            ['Fixa', 'F', 'F', 'Acesa o tempo todo.'],
            ['Lampejo', 'Fl', 'Lp', 'Acesa menos tempo do que apagada; menos de 50 lampejos por minuto.'],
            ['Lampejo longo', 'LFl', 'LpL', 'Lampejo de 2 s ou mais.'],
            ['Ocultação', 'Oc', 'Oc', 'Acesa mais tempo do que apagada (apagões curtos).'],
            ['Isofásica', 'Iso', 'Iso', 'Tempos iguais de luz e de escuridão.'],
            ['Rápida', 'Q', 'R', '50 a 79 lampejos por minuto (em geral 60).'],
            ['Muito rápida', 'VQ', 'MR', '80 a 159 por minuto (em geral 120).'],
            ['Ultrarrápida', 'UQ', 'UR', '160 ou mais por minuto.'],
            ['Morse', 'Mo(A)', 'Mo(A)', 'Pontos e traços de uma letra.'],
            ['Alternada', 'Al', 'Alt', 'Muda de cor a cada fase.']
          ], legenda: 'Grupos aparecem entre parênteses: Fl(3) = três lampejos; Fl(2+1) = dois e mais um (composto).' },
          { t: 'p', html: 'Cores: na carta, W (branca), R (vermelha), G (verde), Y (amarela), Bu (azul); na Lista de Faróis, <strong>B</strong> (branca), <strong>E</strong> (encarnada), <strong>V</strong> (verde), <strong>A</strong> (amarela), <strong>Az</strong> (azul). O <strong>período</strong> é o tempo de um ciclo completo, em segundos. Exemplo: <strong>Lp(3) B 15s</strong> (na carta, Fl(3) W 15s) é um grupo de três lampejos brancos que se repete a cada 15 segundos. Para conferir no mar, cronometre pelo menos três ciclos.' },
          { t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Fl(3) W 15s 12M' }, legenda: 'Digite qualquer característica (na notação da carta ou da Lista de Faróis) e veja a luz piscar e a linha do tempo.' },
          { t: 'h', txt: 'Setores de luz' },
          { t: 'p', html: 'Muitos faróis têm <strong>setores coloridos</strong>: um setor branco sobre a passagem segura e setores encarnado e verde sobre os perigos dos lados. A Lista de Faróis dá os limites dos setores por marcações verdadeiras <strong>tomadas do mar para o farol</strong>.' },
          { t: 'fato', ref: 'extra-mestre-2-16', html: 'A Lista de Faróis adverte que a distância a uma luz não pode ser estimada pelo brilho aparente, que os limites de setor podem não ser confiáveis (a mudança de cor é gradual) e que a distinção entre cores não deve ser considerada confiável.' },
          { t: 'h', txt: 'Alcances' },
          { t: 'lista', itens: [
            '<strong>Alcance luminoso</strong>: até onde a luz chega, pela sua intensidade e pela visibilidade do momento.',
            '<strong>Alcance nominal</strong>: o alcance luminoso com visibilidade meteorológica de 10 milhas. É o que aparece na carta (o “12M” do exemplo).',
            '<strong>Alcance geográfico</strong>: até onde a curvatura da Terra deixa ver a luz, pela altitude da luz e pela altura do seu olho.'
          ] },
          { t: 'fato', ref: 'tecnico-143', html: 'Alcance nominal é o alcance luminoso em atmosfera com visibilidade meteorológica de 10 milhas.' },
          { t: 'fato', ref: 'tecnico-141', html: 'A Lista de Faróis dá o alcance geográfico pela fórmula D = 1,927 × (√H + √h), com H a altitude do objeto e h a altura do observador, em metros, e D em milhas.' },
          { t: 'figura', svg: SVG_M8_ALCANCE, legenda: 'A luz só aparece quando a linha do olho até ela passa por cima do horizonte. A curvatura está exagerada no desenho.' },
          { t: 'p', html: '<strong>Exemplo.</strong> Na Lista de Faróis, o farol do Cabo Branco (João Pessoa) tem altitude de 46 m. Do cockpit de um veleiro, com o olho a cerca de 2,5 m: D = 1,927 × (√46 + √2,5) = 1,927 × (6,78 + 1,58) ≈ <strong>16 milhas</strong>. Como o alcance luminoso dele é maior que isso, antes de ver a luz você costuma ver o <strong>clarão</strong> dela refletido no céu, acima do horizonte.' },
          { t: 'fato', ref: 'extra-mestre-2-17', html: 'Na Lista de Faróis (40ª ed.), o farol Cabo Branco (nº 1256) tem característica Lp. B. 10s, altitude de 46 m e alcances de 27 milhas (luminoso) e 17 milhas (geográfico, calculado para o olho a 5 m).' },
          { t: 'widget', w: 'boias-iala', opts: { modo: 'desafio', modos: ['desafio'], desafio: { n: 8, tipos: ['luz'] } }, legenda: 'Desafio de fim de módulo: identifique o sinal só pela luz à noite.' },
          { t: 'termos', ids: ['caracteristica-da-luz', 'lampejo', 'ocultacao', 'isofasica', 'luz-rapida', 'alcance', 'lista-de-farois', 'carta-12000'] },
          { t: 'check', questoes: [
            q('m8l5-1', T_IALA, 1, 'Na Lista de Faróis, a característica “Lp(3) B 15s” significa:',
              ['Grupo de três lampejos brancos, repetido a cada 15 segundos.', 'Três luzes brancas fixas, a 15 metros de altitude.', 'Luz branca de ocultação com 3 segundos de luz e 15 de escuridão.', 'Lampejo branco a cada 3 segundos, visível a 15 milhas.'], 0,
              'Lp é lampejo; (3), grupo de três; B, branca; 15s, o período do ciclo completo. Altitude aparece em metros (m) e alcance em milhas (M), não com “s”. Ocultação seria Oc.',
              'Lista de Faróis (DHN), Introdução, item 3.3'),
            q('m8l5-2', T_IALA, 1, 'Uma luz que fica acesa mais tempo do que apagada, com apagões curtos e regulares, é de:',
              ['Ocultação.', 'Lampejo.', 'Isofásica.', 'Luz rápida.'], 0,
              'Na ocultação, o tempo de luz é maior que o de escuridão. No lampejo é o contrário. Na isofásica, os tempos são iguais. Luz rápida é uma sequência de 50 a 79 lampejos por minuto.',
              'Lista de Faróis (DHN), Introdução, item 3.3'),
            q('m8l5-3', T_IALA, 3, 'Um farol tem altitude de 36 m. O seu olho está a 4 m sobre a água. Pela fórmula da Lista de Faróis, o alcance geográfico é de aproximadamente:',
              ['8 milhas.', '15,4 milhas.', '40 milhas.', '77 milhas.'], 1,
              'D = 1,927 × (√36 + √4) = 1,927 × (6 + 2) = 15,4 milhas. Oito milhas esquece o fator 1,927. Quarenta soma as alturas em metros, sem raiz. Setenta e sete multiplica 1,927 pela soma das alturas sem tirar a raiz (1,927 × 40).',
              'Lista de Faróis (DHN), item 3.5: D = 1,927(√H + √h)'),
            q('m8l5-4', T_IALA, 2, 'O alcance que aparece na carta náutica ao lado de uma luz (por exemplo, “12M”) é normalmente o:',
              ['Alcance nominal: o luminoso com visibilidade meteorológica de 10 milhas.', 'Alcance geográfico para o olho a 5 m.', 'Alcance máximo em qualquer tempo.', 'Alcance de radar.'], 0,
              'A carta mostra o alcance nominal, que é o alcance luminoso para visibilidade meteorológica de 10 milhas. O alcance geográfico depende das alturas e é dado à parte na Lista de Faróis. Não existe “alcance em qualquer tempo”: com nevoeiro, a luz some bem antes. Radar não entra nessa notação.',
              'Lista de Faróis (DHN); Carta 12000 (INT 1)')
          ] },
          { t: 'fontes', itens: [{ txt: 'Lista de Faróis, 40ª ed. (DHN/CHM)', url: 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois', ref: 'tecnico-140' }, { txt: 'Lista de Faróis: alcance geográfico', ref: 'tecnico-141' }, { txt: 'Carta 12000 (INT 1), 5ª ed., DHN', ref: 'tecnico-144' }, { txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), item 13.2.5', url: MIG1 }] }
        ]
      }
    ]
  });

  /* =====================================================================================
     m9 — Instrumentos, marés e tempo
     ===================================================================================== */
  var CHM_METEO = 'https://www.marinha.mil.br/chm/dados-do-smm-meteoromarinha/previsao-24-horas';
  var CHM_AVISOS = 'https://www.marinha.mil.br/chm/dados-do-smm-avisos-de-mau-tempo/avisos-de-mau-tempo';
  var CHM_SINOTICAS = 'https://www.marinha.mil.br/chm/cartassinoticas';
  var CHM_SMM = 'https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante';

  function rosa() { /* rosa graduada girada para mostrar proa 045 na linha de fé */
    var s = '<g transform="rotate(-45 200 130)">', i, a, x1, y1, x2, y2, r = 96;
    for (i = 0; i < 360; i += 10) {
      a = i * Math.PI / 180;
      var L = i % 30 === 0 ? 14 : 7;
      x1 = 200 + r * Math.sin(a); y1 = 130 - r * Math.cos(a); x2 = 200 + (r - L) * Math.sin(a); y2 = 130 - (r - L) * Math.cos(a);
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="currentColor" stroke-width="' + (L > 7 ? 2 : 1) + '"/>';
    }
    [['N', 0], ['E', 90], ['S', 180], ['W', 270], ['030', 30], ['060', 60], ['120', 120], ['150', 150], ['210', 210], ['240', 240], ['300', 300], ['330', 330]].forEach(function (p) {
      a = p[1] * Math.PI / 180;
      var rr = p[0].length === 1 ? 64 : 68;
      s += '<text x="' + (200 + rr * Math.sin(a)).toFixed(1) + '" y="' + (135 - rr * Math.cos(a)).toFixed(1) + '" text-anchor="middle" font-size="' + (p[0].length === 1 ? 17 : 13.5) + '" font-weight="' + (p[0].length === 1 ? 800 : 500) + '" fill="currentColor" transform="rotate(' + p[1] + ' ' + (200 + rr * Math.sin(a)).toFixed(1) + ' ' + (130 - rr * Math.cos(a)).toFixed(1) + ')">' + p[0] + '</text>';
    });
    return s + '<polygon points="200,46 194,60 206,60" fill="var(--nav-red)"/></g>';
  }
  var SVG_M9_AGULHA =
    '<svg viewBox="0 0 400 280" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Agulha magnética: a rosa aponta o norte magnético e a linha de fé mostra a proa</title>' +
    '<circle cx="200" cy="130" r="110" fill="var(--sea-1)" stroke="currentColor" stroke-width="2"/>' +
    rosa() +
    '<line x1="200" y1="14" x2="200" y2="44" stroke="var(--magenta)" stroke-width="4"/>' +
    '<g font-size="14" fill="currentColor"><text x="214" y="24" fill="var(--magenta)" font-weight="700">linha de fé: proa 045°</text>' +
    '<text x="200" y="256" text-anchor="middle">a rosa aponta sempre o norte magnético;</text><text x="200" y="273" text-anchor="middle">quem gira em volta dela é o barco</text></g>' +
    '</svg>';

  var SVG_M9_VENTO =
    '<svg viewBox="0 0 400 254" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Vento aparente: soma do vento verdadeiro com o vento do próprio movimento</title>' +
    '<rect x="0" y="0" width="400" height="254" fill="var(--sea-1)"/>' +
    '<path d="M170,160 C178,172 178,196 175,212 L165,212 C162,196 162,172 170,160 Z" fill="var(--sea-3)" stroke="currentColor" stroke-width="1.5"/>' +
    '<line x1="330" y1="60" x2="184" y2="60" stroke="currentColor" stroke-width="3"/><polygon points="170,60 186,52 186,68" fill="currentColor"/>' +
    '<line x1="170" y1="60" x2="170" y2="126" stroke="currentColor" stroke-width="3" stroke-dasharray="6 4"/><polygon points="170,140 162,124 178,124" fill="currentColor"/>' +
    '<line x1="330" y1="60" x2="184" y2="133" stroke="var(--magenta)" stroke-width="3.5"/><polygon points="170,140 187.4,140.4 180.2,126.1" fill="var(--magenta)"/>' +
    '<g font-size="14" fill="currentColor"><text x="250" y="48" text-anchor="middle">vento verdadeiro (12 nós)</text>' +
    '<text x="160" y="92" text-anchor="end">do movimento</text><text x="160" y="109" text-anchor="end">(6 nós)</text>' +
    '<text x="300" y="130" text-anchor="middle" fill="var(--magenta)" font-weight="700">aparente</text><text x="300" y="147" text-anchor="middle" fill="var(--magenta)" font-weight="700">(13,4 nós)</text>' +
    '<text x="200" y="228" text-anchor="middle">O anemômetro mede o aparente:</text><text x="200" y="244" text-anchor="middle">mais forte e mais pela proa que o verdadeiro.</text></g>' +
    '</svg>';

  var SVG_M9_ECO =
    '<svg viewBox="0 0 400 250" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Ecobatímetro: pulso sonoro do transdutor até o fundo, calado, folga e profundidade</title>' +
    '<rect x="0" y="50" width="400" height="160" fill="var(--sea-2)"/><rect x="0" y="210" width="400" height="40" fill="var(--land)"/>' +
    '<path d="M40,40 L200,40 L186,62 L54,62 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M118,62 L132,62 L135,110 L115,110 Z" fill="currentColor"/>' +
    '<rect x="75" y="62" width="10" height="6" fill="var(--magenta)"/>' +
    '<path d="M80,68 L55,210 L105,210 Z" fill="var(--magenta)" opacity="0.18"/>' +
    '<g stroke="var(--magenta)" stroke-width="1.5" fill="none"><path d="M67,110 q13,6 26,0"/><path d="M62,140 q18,7 36,0"/><path d="M58,170 q22,8 44,0"/></g>' +
    '<line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" stroke-width="1.5"/>' +
    '<line x1="135" y1="110" x2="238" y2="110" stroke="currentColor" stroke-dasharray="3 3"/>' +
    '<g stroke="currentColor" stroke-width="1.5"><line x1="232" y1="50" x2="232" y2="210"/><line x1="226" y1="50" x2="238" y2="50"/><line x1="226" y1="110" x2="238" y2="110"/><line x1="226" y1="210" x2="238" y2="210"/></g>' +
    '<g stroke="var(--magenta)" stroke-width="2"><line x1="360" y1="50" x2="360" y2="210"/><line x1="354" y1="50" x2="366" y2="50"/><line x1="354" y1="210" x2="366" y2="210"/></g>' +
    '<g font-size="14" fill="currentColor"><text x="240" y="86">calado</text><text x="240" y="166">folga</text>' +
    '<text x="352" y="140" text-anchor="end" fill="var(--magenta)" font-weight="700">profundidade</text>' +
    '<text x="8" y="26">transdutor (em magenta) no casco</text><text x="8" y="236" font-weight="700">fundo</text></g>' +
    '</svg>';

  var SVG_M9_FRENTE =
    '<svg viewBox="0 0 400 258" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Passagem de uma frente fria na costa sul e sudeste: pressão e vento</title>' +
    '<rect x="0" y="0" width="133" height="196" fill="var(--sea-1)"/><rect x="133" y="0" width="134" height="196" fill="var(--sea-2)"/><rect x="267" y="0" width="133" height="196" fill="var(--sea-1)"/>' +
    '<path d="M10,100 C60,108 110,140 150,168 C175,180 190,180 210,160 C250,120 320,96 390,86" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
    '<text x="12" y="88" font-size="13" fill="var(--magenta)">pressão</text>' +
    '<g stroke="currentColor" stroke-width="2.5" fill="currentColor">' +
    '<line x1="48" y1="20" x2="78" y2="52"/><polygon points="84,58 68,52 78,42"/>' +
    '<line x1="182" y1="66" x2="212" y2="34"/><polygon points="218,28 202,34 212,44"/>' +
    '<line x1="333" y1="66" x2="333" y2="30"/><polygon points="333,20 326,34 340,34"/></g>' +
    '<g font-size="13" fill="currentColor"><text x="92" y="30">de NW</text><text x="222" y="62">de SW</text><text x="344" y="44">de S</text></g>' +
    '<g font-size="14" fill="currentColor" text-anchor="middle">' +
    '<text x="66" y="214" font-weight="700">Antes</text><text x="66" y="231">vento N/NW,</text><text x="66" y="247">pressão caindo</text>' +
    '<text x="200" y="214" font-weight="700">Passagem</text><text x="200" y="231">ronda para SW,</text><text x="200" y="247">rajadas e chuva</text>' +
    '<text x="333" y="214" font-weight="700">Depois</text><text x="333" y="231">vento S/SW, frio,</text><text x="333" y="247">pressão subindo</text></g>' +
    '</svg>';

  var SVG_M9_MARE =
    '<svg viewBox="0 0 400 250" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Curva da maré semidiurna com os seus elementos</title>' +
    '<rect x="0" y="0" width="400" height="250" fill="var(--sea-1)"/>' +
    '<line x1="30" y1="205" x2="390" y2="205" stroke="currentColor" stroke-width="2"/>' +
    '<line x1="30" y1="120" x2="390" y2="120" stroke="currentColor" stroke-dasharray="5 4" opacity="0.7"/>' +
    '<path d="M40,180 C100,180 150,60 210,60 C270,60 320,180 380,180" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
    '<g stroke="currentColor" stroke-width="1.5"><line x1="226" y1="60" x2="226" y2="180"/><line x1="220" y1="60" x2="232" y2="60"/><line x1="220" y1="180" x2="232" y2="180"/>' +
    '<line x1="40" y1="180" x2="240" y2="180" stroke-dasharray="2 3"/><line x1="140" y1="205" x2="140" y2="104"/><line x1="134" y1="104" x2="146" y2="104"/></g>' +
    '<g font-size="14" fill="currentColor"><text x="210" y="50" text-anchor="middle" font-weight="700">preamar (PM)</text>' +
    '<text x="40" y="170" font-weight="700">BM</text><text x="380" y="170" text-anchor="end" font-weight="700">BM</text>' +
    '<text x="220" y="140" text-anchor="end">amplitude</text>' +
    '<text x="62" y="110">enchente</text><text x="300" y="110">vazante</text>' +
    '<text x="146" y="160">altura</text><text x="146" y="176">da maré</text>' +
    '<text x="388" y="136" text-anchor="end">nível médio</text>' +
    '<text x="34" y="224">nível de redução (NR): o zero da carta e da tábua</text>' +
    '<text x="34" y="242">de uma BM à seguinte: cerca de 12 h 25 min</text></g>' +
    '</svg>';

  var SVG_M9_PROF =
    '<svg viewBox="0 0 400 230" width="100%" role="img" xmlns="http://www.w3.org/2000/svg" font-family="inherit">' +
    '<title>Profundidade no momento: sondagem da carta mais a altura da maré</title>' +
    '<rect x="0" y="40" width="400" height="150" fill="var(--sea-2)"/><rect x="0" y="190" width="400" height="40" fill="var(--land)"/>' +
    '<line x1="0" y1="40" x2="400" y2="40" stroke="currentColor" stroke-width="1.5"/>' +
    '<line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" stroke-dasharray="6 4"/>' +
    '<path d="M40,30 L170,30 L158,48 L52,48 Z" fill="var(--nav-white)" stroke="currentColor" stroke-width="1.5"/><path d="M98,48 L112,48 L115,120 L95,120 Z" fill="currentColor"/>' +
    '<line x1="115" y1="120" x2="186" y2="120" stroke="currentColor" stroke-dasharray="3 3"/>' +
    '<g stroke="currentColor" stroke-width="1.5"><line x1="250" y1="40" x2="250" y2="190"/><line x1="244" y1="40" x2="256" y2="40"/><line x1="244" y1="100" x2="256" y2="100"/><line x1="244" y1="190" x2="256" y2="190"/>' +
    '<line x1="180" y1="40" x2="180" y2="190"/><line x1="174" y1="120" x2="186" y2="120"/><line x1="174" y1="190" x2="186" y2="190"/></g>' +
    '<g stroke="var(--magenta)" stroke-width="2"><line x1="380" y1="40" x2="380" y2="190"/><line x1="374" y1="40" x2="386" y2="40"/><line x1="374" y1="190" x2="386" y2="190"/></g>' +
    '<g font-size="14" fill="currentColor"><text x="258" y="76">altura da maré</text><text x="258" y="150">sondagem</text><text x="258" y="166">(da carta)</text>' +
    '<text x="188" y="84">calado</text><text x="188" y="160">folga</text>' +
    '<text x="372" y="126" text-anchor="end" fill="var(--magenta)" font-weight="700">profundidade</text>' +
    '<text x="6" y="94" font-size="13">NR</text><text x="6" y="216">fundo</text></g>' +
    '</svg>';

  var BEAUFORT = [
    ['0', 'Calmaria', 'menos de 1', 'Mar espelhado.'],
    ['1', 'Bafagem', '1 a 3', 'Pequenas rugas com aparência de escamas, sem cristas.'],
    ['2', 'Aragem', '4 a 6', 'Ondulações curtas, de cerca de 30 cm, com cristas vidradas, sem arrebentação.'],
    ['3', 'Fraco', '7 a 10', 'Ondulações de cerca de 60 cm, com princípio de arrebentação. Alguns carneiros.'],
    ['4', 'Moderado', '11 a 16', 'Pequenas vagas de cerca de 1,5 m, com frequentes carneiros.'],
    ['5', 'Fresco', '17 a 21', 'Vagas moderadas, longas, de cerca de 2,4 m. Muitos carneiros, possíveis borrifos.'],
    ['6', 'Muito fresco', '22 a 27', 'Grandes vagas de cerca de 3,6 m. Muitas cristas brancas, borrifos frequentes.'],
    ['7', 'Forte', '28 a 33', 'Mar grosso, vagas de cerca de 4,8 m. A espuma se dispõe em estrias na direção do vento.'],
    ['8', 'Muito forte', '34 a 40', 'Vagalhões de 5,5 a 7,5 m, com faixas espessas de espuma.'],
    ['9', 'Duro', '41 a 47', 'Vagalhões de 7 a 10 m, espuma densa. O mar rola; a visibilidade começa a ser afetada.'],
    ['10', 'Muito duro', '48 a 55', 'Grandes vagalhões de 9 a 12 m. Superfície quase toda coberta de estrias brancas.'],
    ['11', 'Tempestuoso', '56 a 63', 'Vagalhões excepcionais, até cerca de 16 m. Navios médios somem no cavado das vagas.'],
    ['12', 'Furacão', '64 ou mais', 'Mar branco de espuma; respingos saturam o ar; visibilidade muito afetada.']
  ];

  M.push({
    id: 'm9', titulo: 'Instrumentos, marés e tempo',
    resumo: 'Agulha magnética, odômetro, tacômetro, anemômetro, GNSS e ecobatímetro; noções de meteorologia, onde consultar a previsão (Marinha/CHM, CPTEC/INPE e o aplicativo Boletim ao Mar) e a escala Beaufort; marés: comportamento, curvas e tábuas. NORMAM-211, Anexo 5-A, 3.1 c), d) e e).',
    licoes: [
      /* ---------------- m9 l1 ---------------- */
      {
        id: 'l1', titulo: 'A agulha magnética (bússola)', minutos: 12,
        objetivos: [
          'Ler o rumo na agulha de governo pela linha de fé.',
          'Entender, sem cálculo, o que são declinação magnética e desvio da agulha.',
          'Cuidar da agulha a bordo e saber o que a NORMAM-211 exige.'
        ],
        blocos: [
          { t: 'fato', ref: 'extra-arrais-2-07', html: 'O programa da prova de Arrais-Amador inclui os instrumentos náuticos e eletrônicos: agulha magnética (bússola), odômetro, tacômetro, anemômetro, GNSS e ecobatímetro.' },
          { t: 'p', html: 'A <strong>agulha magnética</strong> — a bússola do barco — é um conjunto de ímãs preso a uma <strong>rosa graduada</strong> de 000° a 360°, dentro de uma cuba com líquido que amortece as oscilações. Os ímãs se alinham com o campo magnético da Terra; por isso o “N” da rosa aponta para o <strong>norte magnético</strong>, e não para o norte verdadeiro (o geográfico) da carta.' },
          { t: 'lista', itens: [
            '<strong>Linha de fé</strong>: a marca fixa na cuba, alinhada com a quilha. O número da rosa que fica na linha de fé é o <strong>rumo da agulha</strong> (a proa).',
            '<strong>Agulha de governo</strong>: fixa no cockpit, na antepara ou no pedestal da roda de leme, para o timoneiro.',
            '<strong>Agulha de marcação</strong>: portátil, com visor, para tomar <strong>marcações</strong> (a direção de um farol, de um morro, de outra embarcação).',
            '<strong>Agulha eletrônica</strong> (de fluxo magnético): mede o campo da Terra com sensores e alimenta o piloto automático, o radar e o plotter.',
            'A rosa tradicional também tem os 32 “pontos” (quartas) de 11°15′: N, NNE, NE, ENE, E...'
          ] },
          { t: 'figura', svg: SVG_M9_AGULHA, legenda: 'Rumo da agulha 045° (NE). Quando o barco guina, quem gira é o barco; a rosa continua apontando o norte magnético, e outro número passa pela linha de fé.' },
          { t: 'h', txt: 'Dois “erros” que o Mestre aprende a calcular' },
          { t: 'lista', itens: [
            '<strong>Declinação magnética</strong>: o ângulo entre o meridiano magnético e o verdadeiro num lugar. Muda de lugar para lugar e devagar com os anos. A carta náutica informa o valor e a <strong>variação anual</strong>. Na costa do Brasil ela é para oeste (W) e grande: em outubro de 2026, o modelo magnético da NOAA dá cerca de 14° W no Chuí, 20° W em Fortaleza e em Belém e 23° W no Rio de Janeiro e em Salvador. Use sempre o valor da carta, que é o que vale na navegação.',
            '<strong>Desvio da agulha</strong>: o ângulo entre o norte magnético e o norte da agulha, causado pelos ferros, motores e equipamentos de bordo. Muda com a <strong>proa</strong>. Cada barco tem a sua tabela (ou curva) de desvios, feita por um compensador ou por alinhamentos.'
          ] },
          { t: 'p', html: 'A conversão completa de rumos (verdadeiro, magnético e da agulha) é matéria do Mestre-Amador. Para o Arrais, guarde a ideia: <strong>o rumo da carta não é o rumo da agulha</strong>. Exemplo do Manual de Navegação da DHN: com declinação de 20° W, rumo da agulha 085° e desvio de 5° E, o rumo magnético é 090° e o verdadeiro, 070°. Uma diferença de 15° faz você errar a entrada de uma barra.' },
          { t: 'widget', w: 'agulha-calc', opts: { conhecido: 'ag', valor: 85 }, legenda: 'Arraste a proa e veja o mesmo rumo nos três anéis: verdadeiro, magnético e da agulha. Não precisa decorar o cálculo agora.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Ímãs perto da agulha', html: 'Celular, caixa de som, ferramentas, latas, câmeras e microfones de rádio desviam a agulha. Mantenha tudo isso longe dela. De tempos em tempos, confira a agulha num alinhamento conhecido (dois pontos da carta que ficam um atrás do outro) e anote a diferença.' },
          { t: 'fato', ref: 'extra-arrais-2-03', html: 'Pela NORMAM-211, todas as embarcações, exceto as miúdas, devem ter agulha magnética de governo; as de 24 m ou mais, também certificado de compensação ou curva de desvio atualizados a cada 2 anos.' },
          { t: 'termos', ids: ['agulha', 'linha-de-fe', 'rosa-dos-ventos', 'rumo-da-agulha', 'declinacao-magnetica', 'desvio-da-agulha', 'marcacao'] },
          { t: 'check', questoes: [
            q('m9l1-1', T_INST, 1, 'O “N” da rosa de uma agulha magnética aponta para:',
              ['O norte magnético, desviado pelos ferros de bordo.', 'O norte verdadeiro (geográfico).', 'O norte da carta náutica.', 'A estrela Polar.'], 0,
              'Os ímãs da agulha se alinham com o campo magnético terrestre: o N aponta para o norte magnético, e os ferros de bordo ainda o desviam um pouco (desvio da agulha). O norte verdadeiro, que é o da carta, difere do magnético pela declinação. A Polar nem é visível na maior parte do Brasil.',
              'Miguens, Vol. I, Cap. 3 e item 11.2.1'),
            q('m9l1-2', T_INST, 1, 'Na agulha de governo, o rumo do barco é lido:',
              ['Na linha de fé.', 'No N da rosa.', 'No ponteiro da declinação.', 'Na marca de 180°.'], 0,
              'A linha de fé é a marca fixa alinhada com a quilha; o número da rosa que passa por ela é o rumo da agulha. O N da rosa só aponta o norte magnético; não existe ponteiro de declinação na agulha; 180° é só uma das graduações.',
              'Miguens, Vol. I, Cap. 3'),
            q('m9l1-3', T_INST, 2, 'O desvio da agulha:',
              ['É igual em qualquer proa e só muda com o lugar.', 'É causado pelos ferros e equipamentos de bordo e varia com a proa.', 'É a diferença entre o norte verdadeiro e o magnético.', 'Só existe em navios de aço.'], 1,
              'O desvio é o ângulo entre o norte magnético e o norte da agulha, causado pelos ferros e campos magnéticos de bordo (motor, equipamentos), e muda com a proa. A diferença entre verdadeiro e magnético é a declinação, que muda com o lugar e o ano. Veleiros de fibra também têm desvio, por causa do motor, da quilha e dos equipamentos.',
              'Miguens, Vol. I, item 3.2'),
            q('m9l1-4', T_INST, 2, 'Pela NORMAM-211, a agulha magnética de governo é obrigatória:',
              ['Em todas as embarcações, exceto as miúdas.', 'Só em navegação oceânica.', 'Só em embarcações com mais de 24 m.', 'Só em embarcações a motor.'], 0,
              'O art. 4.19.1 a) da NORMAM-211 exige agulha magnética de governo em todas as embarcações, exceto as miúdas. Para 24 m ou mais, exige também certificado de compensação ou curva de desvio atualizados a cada 2 anos. Não depende da área de navegação nem do tipo de propulsão.',
              'NORMAM-211/DPC, art. 4.19.1')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), Cap. 3 (agulhas) e item 11.2', url: MIG1, ref: 'tecnico-187' }, { txt: 'Manual de Navegação (DHN): exemplo de conversão de rumos', url: MIG1, ref: 'tecnico-181' }, { txt: 'NORMAM-211/DPC, art. 4.19.1', url: NORMAM211, ref: 'extra-arrais-2-03' }, { txt: 'NOAA/NCEI, World Magnetic Model (calculadora de declinação), valores para 2026-10-09 em pontos da costa brasileira', url: 'https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml' }] }
        ]
      },
      /* ---------------- m9 l2 ---------------- */
      {
        id: 'l2', titulo: 'Odômetro, tacômetro e anemômetro', minutos: 12,
        objetivos: [
          'Saber o que o odômetro mede e por que ele difere do GNSS.',
          'Usar o tacômetro para conhecer e proteger o motor.',
          'Entender que o anemômetro de um barco em movimento mede o vento aparente.'
        ],
        blocos: [
          { t: 'h', txt: 'Odômetro: velocidade e distância na água' },
          { t: 'p', html: 'No mar, velocidade se mede em <strong>nós</strong>: 1 nó é 1 milha náutica (1.852 m) por hora. O <strong>odômetro</strong> (em inglês, <em>log</em>) mede a velocidade do barco e a distância navegada. Tipos:' },
          { t: 'lista', itens: [
            '<strong>De superfície</strong>: um hélice rebocado por uma linha, que gira e move um contador. É antigo e hoje é equipamento de emergência.',
            '<strong>De fundo</strong>: um sensor que atravessa o casco. Nos veleiros, o mais comum é uma <strong>pequena roda de pás</strong>; nos navios, o tubo de Pitot (pressão) ou sensores eletromagnéticos e ultrassônicos.',
            '<strong>Doppler</strong>: mede a velocidade em relação ao <strong>fundo</strong>, pelo eco do som.'
          ] },
          { t: 'p', html: 'Os de superfície e de fundo medem a velocidade <strong>em relação à água</strong>. O GNSS mede em relação ao <strong>fundo</strong>. A diferença entre os dois é a <strong>corrente</strong>. Exemplo: odômetro 5,0 nós, GNSS 3,8 nós, mesmo rumo: há cerca de 1,2 nó de corrente contra. Num rio, isso decide se você chega antes do pôr do sol.' },
          { t: 'callout', tipo: 'dica', titulo: 'Roda de pás suja mente', html: 'Algas e cracas travam a roda e o odômetro marca menos. Limpe o sensor (muitos saem por dentro do casco, com uma tampa) e calibre: compare com o GNSS num trecho sem corrente, ou corra uma distância conhecida nos dois sentidos e tire a média.' },
          { t: 'h', txt: 'Tacômetro: a rotação do motor' },
          { t: 'p', html: 'O <strong>tacômetro</strong> (conta-giros) mostra as <strong>rotações por minuto</strong> (rpm) do motor. Muitos têm também o <strong>horímetro</strong>, que conta as horas de uso, base do plano de manutenção (troca de óleo, filtros, rotor da bomba de água). Use-o para:' },
          { t: 'lista', itens: [
            'montar a <strong>tabela rpm × velocidade</strong> do seu barco em água parada, útil para estimar a velocidade quando o odômetro falha;',
            'achar a rotação de cruzeiro recomendada pelo fabricante do motor, que poupa combustível e motor;',
            'perceber problemas: rpm caindo com o acelerador parado pode ser cabo ou rede presa no hélice, casco muito sujo ou sobrecarga.'
          ] },
          { t: 'h', txt: 'Anemômetro: o vento a bordo' },
          { t: 'p', html: 'O <strong>anemômetro</strong> mede a velocidade do vento (por conchas ou hélice que giram) e, com o cata-vento, a direção. Com o barco andando, ele mede o <strong>vento aparente</strong>: a soma do vento verdadeiro com o “vento” criado pelo próprio movimento, que vem sempre da proa. Motorando a 6 nós num dia sem vento, o anemômetro marca 6 nós pela proa.' },
          { t: 'figura', svg: SVG_M9_VENTO, legenda: 'Com vento verdadeiro pelo través de boreste, o movimento do barco puxa o vento aparente para a proa e o deixa mais forte. Os instrumentos modernos calculam o vento verdadeiro a partir do aparente, da velocidade e do rumo.' },
          { t: 'widget', w: 'mareacao', opts: { proa: 90, vento: 12 }, legenda: 'Gire o barco e veja o triângulo de velocidades: vento verdadeiro, vento do movimento e vento aparente.' },
          { t: 'termos', ids: ['odometro', 'no-velocidade', 'milha-nautica', 'vento-real', 'vento-aparente', 'biruta', 'corrente'] },
          { t: 'check', questoes: [
            q('m9l2-1', T_INST, 1, 'O odômetro de roda de pás instalado no casco de um veleiro mede a velocidade:',
              ['Em relação à água.', 'Em relação ao fundo.', 'Do vento aparente.', 'Do motor, em rpm.'], 0,
              'Odômetros de superfície e de fundo (como a roda de pás) medem a velocidade em relação à massa de água em volta do casco. Em relação ao fundo medem o GNSS e o odômetro Doppler. Vento é com o anemômetro; rpm, com o tacômetro.',
              'Miguens, Vol. I, item 11.3.1'),
            q('m9l2-2', T_INST, 2, 'Seu odômetro marca 5,0 nós e o GNSS mostra 3,8 nós de velocidade no fundo, no mesmo rumo. A explicação mais provável é:',
              ['Corrente contra de cerca de 1,2 nó.', 'Corrente a favor de cerca de 1,2 nó.', 'O GNSS está desligado.', 'O motor está em rotação alta demais.'], 0,
              'O odômetro mede a velocidade na água; o GNSS, sobre o fundo. Se o barco anda 5,0 na água e só 3,8 sobre o fundo, a água está andando cerca de 1,2 nó contra. Corrente a favor faria o GNSS marcar mais. A rotação do motor não explica a diferença entre os dois instrumentos.',
              'Miguens, Vol. I, itens 11.3.1 e 11.3.2'),
            q('m9l2-3', T_INST, 1, 'O tacômetro indica:',
              ['As rotações por minuto do motor.', 'A velocidade do barco em nós.', 'A profundidade.', 'A direção do vento.'], 0,
              'O tacômetro (conta-giros) mostra a rotação do motor em rpm; muitos trazem o horímetro. Velocidade é com o odômetro ou o GNSS; profundidade, com o ecobatímetro; vento, com o anemômetro.',
              'NORMAM-211, Anexo 5-A, 3.1 c); prática marinheira'),
            q('m9l2-4', T_INST, 2, 'Num barco em movimento, o anemômetro do tope (sem correção eletrônica) mede:',
              ['O vento aparente.', 'O vento verdadeiro.', 'O vento médio da previsão.', 'A rajada máxima do dia.'], 0,
              'O anemômetro está preso ao barco e sente o vento que chega a ele: a soma do vento verdadeiro com o vento do movimento, isto é, o aparente. O verdadeiro precisa ser calculado. Previsão e rajada máxima são outras informações.',
              'Miguens, Vol. III, Cap. 45 (anemômetros)')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), item 11.3 — odômetros', url: MIG1 }, { txt: 'Miguens, Vol. III (DHN, 2026), Cap. 45 — Noções de meteorologia (anemômetros, vento verdadeiro)', url: MIG3 }, { txt: 'NORMAM-211, Anexo 5-A, item 3.1 c)', url: NORMAM211, ref: 'extra-arrais-2-07' }] }
        ]
      },
      /* ---------------- m9 l3 ---------------- */
      {
        id: 'l3', titulo: 'GNSS e ecobatímetro', minutos: 13,
        objetivos: [
          'Usar o GNSS sabendo o que ele mede e quais são os seus limites.',
          'Ajustar o datum do GNSS de acordo com a carta.',
          'Ler o ecobatímetro e calcular a folga abaixo da quilha.'
        ],
        blocos: [
          { t: 'h', txt: 'GNSS: posição por satélite' },
          { t: 'p', html: '<strong>GNSS</strong> (Sistema Global de Navegação por Satélite) é o nome geral dos sistemas de posição por satélite: o <strong>GPS</strong> (Estados Unidos), o <strong>GLONASS</strong> (Rússia), o <strong>Galileo</strong> (União Europeia) e o <strong>BeiDou</strong> (China). O receptor mede o tempo que os sinais de vários satélites levam para chegar e calcula a posição. Os aparelhos atuais usam mais de um sistema ao mesmo tempo.' },
          { t: 'lista', itens: [
            '<strong>Posição</strong> em latitude e longitude, e hora exata.',
            '<strong>COG e SOG</strong>: rumo e velocidade <strong>sobre o fundo</strong>. Diferem da proa e da velocidade na água por causa da corrente e do abatimento.',
            '<strong>Waypoints e rotas</strong>, com distância, rumo, tempo estimado de chegada e erro lateral (o quanto você saiu da linha).',
            '<strong>Botão MOB</strong> (homem ao mar): grava a posição na hora. Aperte assim que alguém cair.'
          ] },
          { t: 'fato', ref: 'tecnico-146', html: 'O uso de cartas raster não dispensa as cartas em papel atualizadas, e o CHM recomenda o datum WGS-84 no GPS e no programa de visualização.' },
          { t: 'p', html: '<strong>Datum</strong> é o modelo da Terra usado para as coordenadas. Se o GNSS e a carta usam datuns diferentes, a mesma posição cai em pontos diferentes, às vezes a dezenas de metros. Confira o datum no título da carta e ajuste o aparelho.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'O GNSS é ótimo, até falhar', html: 'Bateria, antena, interferência e pane do aparelho acontecem. Anote a posição, a hora e o rumo de tempos em tempos e saiba navegar pela agulha e pelos pontos de terra. E lembre que a carta pode ser menos precisa que o GNSS: levantamentos antigos podem ter perigos fora do lugar. Não corte caminho rente a pedras confiando só na tela.' },
          { t: 'fato', ref: 'extra-arrais-2-05', html: 'Pela NORMAM-211, embarcações de médio porte devem ter 1 aparelho GNSS em navegação costeira e 2 em navegação oceânica (recomenda-se que ao menos um tenha fonte de energia independente). Para a navegação interior o artigo não lista GNSS obrigatório, mas ele é muito útil.' },
          { t: 'h', txt: 'Ecobatímetro: a profundidade pelo eco' },
          { t: 'p', html: 'O <strong>ecobatímetro</strong> (ou ecossonda) tem um <strong>transdutor</strong> no fundo do casco que emite um pulso sonoro para baixo. O som bate no fundo e volta. Como a velocidade do som na água é conhecida (cerca de 1.500 m/s), o aparelho calcula: <strong>profundidade = velocidade × tempo de ida e volta ÷ 2</strong>.' },
          { t: 'figura', svg: SVG_M9_ECO, legenda: 'O transdutor fica abaixo da linha d’água, mas acima da quilha. A leitura “crua” é a distância do transdutor ao fundo.' },
          { t: 'lista', itens: [
            'Muitos aparelhos permitem um <strong>ajuste (offset)</strong>: somar a distância do transdutor à linha d’água (mostra a profundidade total) ou subtrair a distância do transdutor ao fundo da quilha (mostra a folga sob a quilha). Saiba qual está configurado no seu barco.',
            'Ajuste o <strong>alarme de pouca profundidade</strong>. Fundeado, os alarmes de profundidade ajudam a perceber que o barco está garrando.',
            'Fundo de lama mole devolve eco fraco; cardumes e camadas de água diferentes podem dar ecos falsos.',
            'Compare a leitura com a carta: profundidade medida = sondagem da carta + altura da maré (lição 6).'
          ] },
          { t: 'callout', tipo: 'dica', titulo: 'Conta rápida', html: 'Transdutor 0,5 m abaixo da linha d’água, calado 1,8 m, ecobatímetro sem ajuste marcando 3,0 m. Profundidade total: 3,0 + 0,5 = <strong>3,5 m</strong>. Folga sob a quilha: 3,5 − 1,8 = <strong>1,7 m</strong>.' },
          { t: 'fato', ref: 'extra-arrais-2-04', html: 'Pela NORMAM-211, embarcações de grande porte ou iates construídos após 11/02/2000 devem ter ecobatímetro; para as menores, o seu emprego é recomendado.' },
          { t: 'termos', ids: ['gnss', 'datum', 'waypoint', 'rumo-no-fundo', 'ecobatimetro', 'sondagem', 'calado'] },
          { t: 'check', questoes: [
            q('m9l3-1', T_INST, 1, 'O ecobatímetro determina a profundidade:',
              ['Pelo tempo de ida e volta de um pulso sonoro até o fundo.', 'Pela pressão da água sobre o casco.', 'Pela posição do GNSS comparada com a carta.', 'Pela inclinação do prumo de mão.'], 0,
              'O ecobatímetro mede o tempo entre a emissão do pulso e a chegada do eco; com a velocidade do som na água (cerca de 1.500 m/s), a profundidade é v × t ÷ 2. Pressão é o princípio do odômetro de Pitot. O GNSS não mede profundidade. O prumo de mão é outro instrumento, com linha graduada.',
              'Miguens, Vol. I, item 11.5.2'),
            q('m9l3-2', T_INST, 2, 'O transdutor do seu ecobatímetro fica 0,5 m abaixo da linha d’água e o aparelho não tem ajuste. Ele marca 3,0 m. A profundidade total do local é:',
              ['2,5 m.', '3,0 m.', '3,5 m.', '4,8 m.'], 2,
              'Sem ajuste, a leitura é do transdutor até o fundo. Somando a distância do transdutor à superfície: 3,0 + 0,5 = 3,5 m. Subtrair (2,5 m) inverte a conta. Os 3,0 m ignoram a posição do transdutor. 4,8 m somaria o calado, que não entra nessa conta.',
              'Miguens, Vol. I, item 11.5.2(c)'),
            q('m9l3-3', T_INST, 1, 'No GNSS, COG e SOG são:',
              ['Rumo e velocidade sobre o fundo.', 'Proa e velocidade na água.', 'Rumo verdadeiro e rumo da agulha.', 'Direção e força do vento.'], 0,
              'COG (course over ground) e SOG (speed over ground) são o rumo e a velocidade em relação ao fundo, calculados pelas posições sucessivas. Proa e velocidade na água vêm da agulha e do odômetro; a diferença entre eles é efeito de corrente e abatimento. Vento é com o anemômetro.',
              'Miguens, Vol. III (navegação eletrônica)'),
            q('m9l3-4', T_INST, 2, 'Por que ajustar o datum do GNSS de acordo com a carta?',
              ['Porque datuns diferentes deslocam a mesma posição na carta, às vezes por dezenas de metros.', 'Porque o datum muda a velocidade mostrada.', 'Porque sem datum o GNSS não liga.', 'Porque o datum corrige a declinação magnética.'], 0,
              'O datum é o modelo da Terra das coordenadas; GNSS e carta em datuns diferentes plotam a mesma posição em lugares diferentes. O CHM recomenda WGS-84 no GPS e no programa de visualização. O datum não muda a velocidade, não impede o aparelho de funcionar e nada tem a ver com a declinação.',
              'CHM, cartas raster: recomendação de datum WGS-84')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), item 11.5 — instrumentos de profundidade', url: MIG1 }, { txt: 'Miguens, Vol. III (DHN, 2026) — navegação eletrônica', url: MIG3, ref: 'tecnico-191' }, { txt: 'CHM — cartas raster e datum', ref: 'tecnico-146' }, { txt: 'NORMAM-211/DPC, art. 4.19', url: NORMAM211, ref: 'extra-arrais-2-04' }] }
        ]
      },
      /* ---------------- m9 l4 ---------------- */
      {
        id: 'l4', titulo: 'Noções de meteorologia para o Arrais', minutos: 14,
        objetivos: [
          'Relacionar pressão atmosférica, isóbaras, vento e tempo.',
          'Reconhecer a chegada e a passagem de uma frente fria no litoral brasileiro.',
          'Conhecer brisas, trovoadas e nevoeiro e o risco de cada um.'
        ],
        blocos: [
          { t: 'h', txt: 'Pressão, altas e baixas' },
          { t: 'p', html: 'O ar tem peso. A <strong>pressão atmosférica</strong>, medida no <strong>barômetro</strong> em hectopascais (hPa), varia de um lugar para outro. Nas cartas do tempo, as <strong>isóbaras</strong> ligam pontos de mesma pressão e desenham:' },
          { t: 'lista', itens: [
            '<strong>Altas pressões (anticiclones)</strong>: o ar desce e se afasta do centro; tempo geralmente bom, nuvens dispersas. No Hemisfério Sul, o vento gira em volta delas no sentido <strong>anti-horário</strong>.',
            '<strong>Baixas pressões (ciclones)</strong>: o ar converge para o centro e sobe, esfria e forma nuvens e chuva. No Hemisfério Sul, o vento gira no sentido <strong>horário</strong>.',
            'O vento sopra das altas para as baixas, cruzando as isóbaras com um ângulo para dentro da baixa. <strong>Isóbaras juntas = vento forte.</strong>',
            'A <strong>direção</strong> do vento é a de onde ele vem: vento sul sopra do sul para o norte.'
          ] },
          { t: 'p', html: 'Na situação normal, o <strong>anticiclone subtropical do Atlântico Sul</strong> domina o oceano e o litoral: ventos fracos a moderados de SE a NE e tempo bom. É o vento que você encontra na maior parte dos dias de verão no Nordeste e no Sudeste.' },
          { t: 'h', txt: 'A frente fria' },
          { t: 'p', html: 'Uma massa de ar frio vem do sul do continente, precedida por uma <strong>frente fria</strong>, e sobe pelo litoral. É o principal “mau tempo” da costa sul e sudeste.' },
          { t: 'tabela', cab: ['Quando', 'O que acontece'], linhas: [
            ['Na aproximação', 'Pressão caindo; vento de N ou NW se intensificando (às vezes uma calmaria antes); nuvens altas (cirrus) que engrossam e baixam até cumulus e cumulonimbus; aguaceiros.'],
            ['Na passagem', 'A pressão passa por um mínimo e começa a subir; o vento <strong>ronda de repente de NW para SW</strong>, com rajadas; chuva forte e possíveis trovoadas; a temperatura cai.'],
            ['Depois', 'Pressão subindo, céu limpando aos poucos, vento de SW ou S e tempo bom e mais frio.']
          ], legenda: 'Evolução típica descrita no Manual de Navegação da DHN. No inverno, frentes chegam a cada 5 a 7 dias, em média, e levam cerca de 48 h do Rio Grande do Sul ao Rio de Janeiro. No Nordeste chegam mal definidas.' },
          { t: 'figura', svg: SVG_M9_FRENTE, legenda: 'A curva magenta é a pressão no barômetro de bordo. A rondada de NW para SW pode pegar de surpresa quem está fundeado numa enseada aberta para o sul.' },
          { t: 'widget', w: 'meteo-sinotica', opts: { cenario: 'frente' }, legenda: 'Carta sinótica esquemática (não é previsão). Avance as horas e toque num ponto do mar para ver o vento rondar com a passagem da frente.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Fundeadouro e frente fria', html: 'Antes de uma frente, escolha um abrigo protegido do <strong>sul e do sudoeste</strong>, para onde o vento vai rondar. Um fundeadouro gostoso com vento norte vira armadilha quando o vento ronda e o mar entra.' },
          { t: 'h', txt: 'Brisas, trovoadas e nevoeiro' },
          { t: 'lista', itens: [
            '<strong>Brisa marítima</strong>: de dia, a terra esquenta mais que o mar e o vento sopra do mar para a terra, mais forte à tarde. <strong>Terral</strong> (brisa terrestre): à noite, o contrário, mais fraco.',
            '<strong>Trovoadas</strong>: nascem em nuvens <strong>cumulonimbus</strong>, muitas vezes no fim da tarde de verão, sobre represas, lagos, rios e serras. Trazem rajadas fortes e mudança brusca de vento antes da chuva, e raios. Ao ver uma torre escura crescendo, reduza o pano e procure abrigo.',
            '<strong>Nevoeiro de radiação</strong>: em noites calmas e claras, o chão e a água esfriam e a umidade condensa; comum em rios e vales de madrugada.',
            '<strong>Nevoeiro de advecção</strong>: ar quente e úmido passando sobre água fria; comum na costa sul e sudeste.'
          ] },
          { t: 'h', txt: 'Sinais de bordo' },
          { t: 'tabela', cab: ['Tende a piorar', 'Tende a melhorar'], linhas: [
            ['Barômetro caindo rápida e continuamente', 'Barômetro subindo continuamente'],
            ['Cirrus virando cirrostratus, baixando e engrossando', 'Base das nuvens subindo; céu encoberto abrindo'],
            ['Vento N ou NE passando a soprar de S ou SE', 'Vento rondando de S ou SW para N ou NE'],
            ['Vento forte logo cedo; aguaceiro durante a noite', 'Três a seis horas depois da passagem de uma frente fria']
          ], legenda: 'Regras práticas resumidas da Tabela 45.8 do Manual de Navegação (Miguens, Vol. III). Cada linha traz um sinal de cada lado, não um par de causa e efeito. Elas complementam a previsão oficial, não a substituem.' },
          { t: 'callout', tipo: 'nota', titulo: 'Como ler as regras da rondada', html: 'O Manual dá as duas rondadas como regras práticas gerais: de N/NE para S/SE, o tempo tende a piorar; de S/SW para N/NE, a melhorar. Elas não dizem o sentido de giro, porque ele depende de onde está a frente em relação a você. Não confunda com a passagem típica de uma frente fria no litoral sul e sudeste, descrita na tabela acima: o vento ronda de NW para SW, de repente, com rajadas. Na dúvida, confie na tendência do barômetro e no aviso oficial de mau tempo, e não só na direção do vento.' },
          { t: 'termos', ids: ['pressao-atmosferica', 'barometro', 'isobara', 'alta-pressao', 'baixa-pressao', 'frente-fria', 'brisa-maritima', 'cumulonimbo', 'nevoeiro', 'rondar', 'rajada'] },
          { t: 'check', questoes: [
            q('m9l4-1', T_MET, 1, 'Um “vento sul” sopra:',
              ['Do sul para o norte.', 'Do norte para o sul.', 'Do mar para a terra.', 'Sempre com frente fria.'], 0,
              'A direção do vento é a de onde ele vem: vento sul vem do sul e sopra para o norte. Do norte para o sul é vento norte. Do mar para a terra descreve a brisa marítima, que pode ter qualquer direção conforme a costa. Vento sul é comum depois de uma frente fria, mas não exclusivo dela.',
              'Miguens, Vol. III, Cap. 45 (direção e força do vento)'),
            q('m9l4-2', T_MET, 2, 'No Hemisfério Sul, o vento em volta de um centro de baixa pressão gira no sentido:',
              ['Horário, convergindo para o centro.', 'Anti-horário, convergindo para o centro.', 'Horário, divergindo do centro.', 'Sem sentido definido.'], 0,
              'No Hemisfério Sul, a circulação em volta das baixas é convergente e no sentido horário (ciclônica); em volta das altas, divergente e anti-horária. No Hemisfério Norte os sentidos se invertem.',
              'Miguens, Vol. III, item 45.5.4 (k) e (l)'),
            q('m9l4-3', T_MET, 2, 'Você está fundeado no litoral sudeste. O barômetro cai e o vento NW aumenta. O que é mais provável nas próximas horas?',
              ['A passagem de uma frente fria, com o vento rondando para SW e rajadas.', 'Tempo bom e firme, com vento E fraco.', 'Nevoeiro de radiação.', 'Brisa terrestre.'], 0,
              'Pressão caindo e vento N/NW se intensificando são sinais da aproximação de uma frente fria; na passagem, o vento ronda de NW para SW com rajadas, chuva e queda de temperatura. Tempo bom viria com pressão estável ou subindo. Nevoeiro de radiação pede calma; brisa terrestre é fenômeno noturno e fraco.',
              'Miguens, Vol. III, item 45.4'),
            q('m9l4-4', T_MET, 1, 'A brisa marítima sopra:',
              ['De dia, do mar para a terra.', 'À noite, do mar para a terra.', 'De dia, da terra para o mar.', 'Só no inverno.'], 0,
              'De dia a terra esquenta mais que o mar; o ar frio do mar vai para a terra: brisa marítima. À noite ocorre o contrário (terral, da terra para o mar). Não é exclusiva do inverno; é mais marcada em dias quentes e ensolarados.',
              'Miguens, Vol. III, item 45.5.4 (g) e (h)')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. III (DHN, 1ª rev. 2026), Cap. 45 — Noções de Meteorologia para Navegantes', url: MIG3 }] }
        ]
      },
      /* ---------------- m9 l5 ---------------- */
      {
        id: 'l5', titulo: 'Previsão do tempo: onde consultar e a escala Beaufort', minutos: 13,
        objetivos: [
          'Saber onde consultar a previsão oficial: Marinha (CHM), CPTEC/INPE e o aplicativo Boletim ao Mar.',
          'Ler o Meteoromarinha e reconhecer um aviso de mau tempo.',
          'Usar a escala Beaufort para estimar o vento pelo mar e decidir se sai.'
        ],
        blocos: [
          { t: 'fato', ref: 'programa-40', html: 'O programa do Arrais pede noções de meteorologia e a consulta à previsão do tempo nos sites da DHN (a norma cita “www.dhn.mar.mil.br”) e do CPTEC (“www.cptec.inpe.br”) e no aplicativo “Boletim ao Mar”, disponível na Google Play Store e na Apple Store.' },
          { t: 'h', txt: 'Marinha: o Serviço Meteorológico Marinho' },
          { t: 'fato', ref: 'travessia-93', html: 'O serviço meteorológico na área marítima de responsabilidade do Brasil cabe ao Centro de Hidrografia da Marinha (CHM), subordinado à DHN.' },
          { t: 'p', html: 'Hoje, os produtos ficam nas páginas do CHM, dentro do portal da Marinha: <a href="' + CHM_METEO + '" target="_blank" rel="noopener">Meteoromarinha</a>, <a href="' + CHM_AVISOS + '" target="_blank" rel="noopener">Avisos de Mau Tempo</a> e <a href="' + CHM_SINOTICAS + '" target="_blank" rel="noopener">Cartas Sinóticas</a>.' },
          { t: 'fato', ref: 'extra-arrais-2-09', html: 'O Meteoromarinha é emitido duas vezes por dia (0000 e 1200 HMG) em três partes: I — avisos de mau tempo em vigor (com “NIL” ou “NÃO HÁ” quando não houver); II — resumo do tempo; III — previsão para as áreas costeiras e oceânicas.' },
          { t: 'fato', ref: 'travessia-95', html: 'As previsões do Meteoromarinha cobrem áreas costeiras (ALFA a HOTEL) e oceânicas (NOVEMBER e SIERRA).' },
          { t: 'fato', ref: 'extra-fechamento-cvtr-02', html: 'No boletim de 8/10/2026, porém, a área BRAVO (de Laguna a Arraial do Cabo) vem marcada como oceânica e a CHARLIE, no mesmo trecho, como costeira: as duas páginas do CHM recortam as áreas de modo diferente, então leia o boletim do dia.' },
          { t: 'fato', ref: 'travessia-96', html: 'O aviso de mau tempo é emitido quando se prevê vento de força 7 ou mais na escala Beaufort (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais atingindo a costa.' },
          { t: 'h', txt: 'Aplicativo Boletim ao Mar' },
          { t: 'fato', ref: 'extra-arrais-2-01', html: 'O Boletim ao Mar reúne produtos da Marinha/DHN para a METAREA V: Meteoromarinha (previsão de tempo, vento, ondas e visibilidade para 24 e 48 h), Avisos de Mau Tempo, Cartas Sinóticas, meteogramas de cidades da costa e Avisos-Rádio Náuticos e SAR.' },
          { t: 'fato', ref: 'extra-arrais-2-02', html: 'O aplicativo também está na App Store do Brasil (Apple).' },
          { t: 'h', txt: 'CPTEC/INPE e INMET' },
          { t: 'p', html: 'O <a href="https://www.cptec.inpe.br/" target="_blank" rel="noopener">CPTEC/INPE</a> (Centro de Previsão de Tempo e Estudos Climáticos) publica previsão do tempo para todo o país, imagens de satélite e previsão de ondas. Para rios, lagos e represas, onde o Meteoromarinha não chega, ele é a referência, junto com os alertas do INMET.' },
          { t: 'fato', ref: 'travessia-110', html: 'O INMET emite alertas meteorológicos para o território nacional, inclusive áreas fluviais, pelo sistema Alert-AS, acompanhável em avisos.inmet.gov.br.' },
          { t: 'h', txt: 'A escala Beaufort' },
          { t: 'p', html: 'A escala Beaufort classifica o vento de 0 (calmaria) a 12 (furacão) pelo efeito no mar. Serve para estimar o vento sem instrumento e para entender a previsão (“vento força 5”). As alturas de vaga são típicas de mar aberto com vento soprando há tempo; em águas abrigadas o mar é menor, mas fica curto e desconfortável.' },
          { t: 'tabela', cab: ['Força', 'Nome', 'Nós', 'Aspecto do mar'], linhas: BEAUFORT, legenda: 'Escala Beaufort da Marinha do Brasil (Miguens, Vol. III, Tabela 45.1; Atlas de Cartas Piloto, DHN). As alturas são aproximadas, para mar aberto.' },
          { t: 'widget', w: 'beaufort', opts: { forca: 4 }, legenda: 'Escala Beaufort interativa: o mar de cada força desenhado em escala com um veleiro de exemplo (cruzeiro de 32 pés); num barco menor as mesmas ondas parecem maiores, e num maior, menores. As alturas de onda do simulador são as “alturas prováveis” da OMM; a tabela da DHN acima traz valores um pouco maiores. As duas são referências para mar aberto, com vento soprando há horas.' },
          { t: 'callout', tipo: 'dica', titulo: 'Decidir antes de sair', html: '<ol><li>Leia a previsão oficial da sua área e veja se há aviso de mau tempo.</li><li>Olhe a tendência: o que vem depois do horário em que você pretende voltar?</li><li>Compare com o que você vê: o mar e as nuvens batem com a previsão?</li><li>Defina o seu limite com o instrutor, antes de sair: a Marinha só emite aviso de mau tempo a partir da força 7, mas um barco pequeno e uma tripulação iniciante sofrem muito antes disso.</li><li>Tenha um plano B: abrigo, retorno antecipado, rizo feito antes de precisar.</li></ol>' },
          { t: 'fato', ref: 'normas-158', html: 'O Aviso de Saída é obrigatório e pode ser substituído pelo registro do plano de viagem no aplicativo NAVSEG da Marinha.' },
          { t: 'termos', ids: ['beaufort', 'meteoromarinha', 'aviso-de-mau-tempo', 'carta-sinotica', 'rajada', 'ressaca', 'navseg'] },
          { t: 'check', questoes: [
            q('m9l5-1', T_MET, 1, 'O programa oficial do Arrais cita, para consulta à previsão do tempo, o aplicativo:',
              ['Boletim ao Mar.', 'NAVSEG.', 'Windy.', 'SISCORAR.'], 0,
              'O Anexo 5-A da NORMAM-211 (item 3.1 d) cita os sites da DHN e do CPTEC e o aplicativo Boletim ao Mar. O NAVSEG é o aplicativo para registrar o plano de viagem (aviso de saída). Windy é um aplicativo comercial estrangeiro. SISCORAR é outro aplicativo do CHM, não citado no programa.',
              'NORMAM-211, Anexo 5-A, item 3.1 d)'),
            q('m9l5-2', T_MET, 2, 'Pelo critério do Serviço Meteorológico Marinho, é emitido aviso de mau tempo quando se prevê vento de:',
              ['Força 5 Beaufort ou mais (17 nós).', 'Força 7 Beaufort ou mais (28 nós ou mais).', 'Força 9 Beaufort ou mais (41 nós).', 'Qualquer vento acima de 10 nós.'], 1,
              'O CHM emite aviso de mau tempo para vento de força 7 ou mais (28 nós ou mais), além de ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos e ressaca com ondas de 2,5 m ou mais. Força 5 e 10 nós não disparam aviso; força 9 já está bem acima do critério.',
              'CHM, Serviços Radiometeorológicos de Apoio ao Navegante'),
            q('m9l5-3', T_MET, 1, 'Na escala Beaufort, a força 4 (moderado) corresponde a:',
              ['1 a 3 nós.', '11 a 16 nós.', '28 a 33 nós.', '48 a 55 nós.'], 1,
              'Força 4, moderado, vai de 11 a 16 nós, com pequenas vagas e frequentes carneiros. 1 a 3 nós é força 1 (bafagem); 28 a 33, força 7 (forte); 48 a 55, força 10 (muito duro).',
              'Miguens, Vol. III, Tabela 45.1'),
            q('m9l5-4', T_MET, 2, 'No Meteoromarinha, a Parte I traz:',
              ['Os avisos de mau tempo em vigor (ou NIL/NÃO HÁ).', 'A previsão para as próximas 48 h.', 'As tábuas de maré.', 'Os avisos aos navegantes sobre boias apagadas.'], 0,
              'A Parte I do Meteoromarinha lista os avisos de mau tempo em vigor, com NIL ou NÃO HÁ quando não houver. A Parte II é o resumo do tempo e a Parte III a previsão. Tábuas de maré são outra publicação; boias apagadas são assunto dos Avisos-Rádio e Avisos aos Navegantes.',
              'Miguens, Vol. III, item 45.5.1')
          ] },
          { t: 'fontes', itens: [{ txt: 'CHM — Serviços Radiometeorológicos de Apoio ao Navegante', url: CHM_SMM, ref: 'travessia-96' }, { txt: 'CHM — Meteoromarinha', url: CHM_METEO }, { txt: 'Boletim ao Mar (Google Play)', url: 'https://play.google.com/store/apps/details?id=boletim.ao.mar&hl=pt_BR', ref: 'extra-arrais-2-01' }, { txt: 'Boletim ao Mar (App Store)', url: 'https://apps.apple.com/br/app/boletim-ao-mar/id1562769509', ref: 'extra-arrais-2-02' }, { txt: 'CPTEC/INPE', url: 'https://www.cptec.inpe.br/' }, { txt: 'INMET — Alert-AS', url: 'https://avisos.inmet.gov.br/', ref: 'travessia-110' }, { txt: 'Miguens, Vol. III (DHN, 2026), Cap. 45, Tabela 45.1 (Beaufort) e item 45.5', url: MIG3, ref: 'extra-arrais-2-09' }, { txt: 'NORMAM-211/DPC, art. 4.6.1 (aviso de saída/NAVSEG)', url: NORMAM211, ref: 'normas-158' }] }
        ]
      },
      /* ---------------- m9 l6 ---------------- */
      {
        id: 'l6', titulo: 'Marés: comportamento, curvas e tábuas', minutos: 15,
        objetivos: [
          'Explicar a maré e os seus elementos: preamar, baixa-mar, amplitude, enchente, vazante, estofo.',
          'Reconhecer sizígia e quadratura e os tipos de maré da costa brasileira.',
          'Ler uma Tábua das Marés e calcular a profundidade num horário.'
        ],
        blocos: [
          { t: 'fato', ref: 'extra-arrais-2-08', html: 'O programa do Arrais inclui o comportamento das marés, o conhecimento das curvas de marés e o uso de Tábuas de Marés.' },
          { t: 'h', txt: 'O que é a maré' },
          { t: 'p', html: '<strong>Maré</strong> é a subida e descida periódica do nível do mar, causada principalmente pela atração da <strong>Lua</strong> e, em menor grau, do <strong>Sol</strong> (o efeito da Lua é cerca de 2,25 vezes o do Sol). O movimento horizontal da água que acompanha a maré é a <strong>corrente de maré</strong>.' },
          { t: 'lista', itens: [
            '<strong>Enchente</strong>: período em que o nível sobe. <strong>Vazante</strong>: período em que desce.',
            '<strong>Preamar (PM)</strong>: o nível máximo de uma oscilação. <strong>Baixa-mar (BM)</strong>: o mínimo.',
            '<strong>Estofo</strong>: o tempo em que o nível fica quase parado, na preamar (estofo de enchente) e na baixa-mar (estofo de vazante).',
            '<strong>Amplitude</strong>: a diferença de altura entre uma PM e a BM seguinte (ou anterior).',
            '<strong>Nível de redução (NR)</strong>: o zero ao qual se referem as sondagens da carta e as alturas da tábua. <strong>Altura da maré</strong>: a distância do nível do mar, num instante, até o NR.'
          ] },
          { t: 'figura', svg: SVG_M9_MARE, legenda: 'Uma oscilação de maré semidiurna. Em portos de maré semidiurna, de uma PM para a BM seguinte passam pouco mais de 6 horas.' },
          { t: 'h', txt: 'Sizígia e quadratura' },
          { t: 'p', html: 'Na <strong>Lua Nova e na Lua Cheia</strong> (sizígia), Sol, Terra e Lua estão alinhados e as forças se somam: preamares mais altas e baixa-mares mais baixas, as <strong>marés de águas vivas</strong>. Nos <strong>quartos crescente e minguante</strong> (quadratura), as forças se contrariam: amplitudes pequenas, as <strong>marés de águas mortas</strong>.' },
          { t: 'h', txt: 'Tipos de maré no Brasil' },
          { t: 'lista', itens: [
            '<strong>Semidiurna</strong>: duas preamares e duas baixa-mares por dia lunar (cerca de 24 h 50 min), com alturas parecidas. É a maré <strong>de Vitória (ES) para o norte</strong>.',
            '<strong>Semidiurna com desigualdades diurnas</strong>: duas PM e duas BM por dia, mas com alturas bem diferentes entre si. É a maré da <strong>costa sul</strong>.',
            'Como o dia lunar tem cerca de 24 h 50 min, a maré acontece <strong>cerca de 50 minutos mais tarde a cada dia</strong>.',
            'A amplitude muda muito ao longo da costa: é grande no litoral norte, como no Pará e no Maranhão, e pequena no sul, onde o vento e a pressão também pesam bastante no nível da água.'
          ] },
          { t: 'h', txt: 'A Tábua das Marés' },
          { t: 'fato', ref: 'tecnico-131', html: 'A publicação Tábuas das Marés para 2026 é a 63ª edição, da DHN/CHM.' },
          { t: 'fato', ref: 'extra-mestre-2-25', html: 'Ela traz previsões de maré de 44 portos e outros pontos da costa do Brasil (ilhas, barras, fundeadouros), geradas pelo CHM por análise harmônica.' },
          { t: 'fato', ref: 'tecnico-134', html: 'O CHM disponibiliza on-line a previsão de marés de 2026 em PDF por porto.' },
          { t: 'fato', ref: 'tecnico-135', html: 'Cada tábua informa a posição, o fuso horário, o nível médio e a carta náutica de referência do porto (por exemplo, Cabedelo: fuso UTC −3, nível médio 1,34 m, Carta 830).' },
          { t: 'p', html: 'Para cada dia, a tábua dá as <strong>horas</strong> (na hora legal do fuso indicado) e as <strong>alturas</strong>, em metros acima do NR, das preamares e baixa-mares. Altura negativa significa um nível abaixo do NR, o que acontece em sizígias fortes.' },
          { t: 'fato', ref: 'tecnico-162', html: 'A profundidade num instante é a sondagem da carta (referida ao nível de redução) somada à altura da maré, também referida ao NR.' },
          { t: 'figura', svg: SVG_M9_PROF, legenda: 'Profundidade = sondagem + altura da maré. Folga sob a quilha = profundidade − calado.' },
          { t: 'callout', tipo: 'dica', titulo: 'Exemplo', html: 'A carta mostra sondagem de 1,2 m num baixio. A tábua dá BM de 0,3 m às 06h10 e PM de 2,3 m às 12h25. Seu barco cala 1,8 m e você quer 0,5 m de folga: precisa de 1,2 + altura ≥ 2,3 m, ou seja, de altura de maré de pelo menos <strong>1,1 m</strong>. Na baixa-mar (0,3 m) a profundidade é só 1,5 m: não passa. Perto da preamar (2,3 m) são 3,5 m: passa com folga.' },
          { t: 'h', txt: 'Altura num horário: regra dos doze avos' },
          { t: 'p', html: 'Entre uma BM e a PM seguinte (cerca de 6 horas), a maré sobe, hora a hora, <strong>1, 2, 3, 3, 2 e 1 doze avos</strong> da amplitude. Na metade do tempo ela já subiu metade (6/12); nas horas do meio a água corre mais.' },
          { t: 'fato', ref: 'tecnico-165', html: 'A regra dos doze avos só vale onde a curva da maré se aproxima de uma senoide.' },
          { t: 'fato', ref: 'tecnico-161', html: 'Na costa do Brasil, as Tabelas I e II das Tábuas das Marés (altura num instante) só devem ser usadas de Vitória (ES) para o norte, onde a maré é predominantemente semidiurna.' },
          { t: 'widget', w: 'mares', opts: {}, legenda: 'Tábua de exemplo (fictícia) no formato da DHN: escolha o dia e o horário e compare a altura pelo método do cosseno e pela regra dos doze avos. Nunca use estes números para navegar.' },
          { t: 'callout', tipo: 'seguranca', titulo: 'Barras e correntes', html: 'Em barras de rio e estuários, a corrente de maré pode passar de vários nós. Vento contra a corrente levanta ondas curtas e altas. Planeje entrar com a enchente, perto da preamar, e consulte o Roteiro e os avisos locais da Capitania.' },
          { t: 'widget', w: 'mares', opts: { modo: 'exercicio', exercicio: 'altura-12' }, legenda: 'Exercícios corrigidos: altura da maré pela regra dos doze avos.' },
          { t: 'termos', ids: ['mare', 'preamar', 'baixa-mar', 'amplitude', 'enchente', 'vazante', 'estofo', 'sizigia', 'quadratura', 'nivel-de-reducao', 'altura-da-mare', 'regra-dos-doze-avos', 'tabua-das-mares', 'corrente-de-mare'] },
          { t: 'check', questoes: [
            q('m9l6-1', T_MARE, 1, 'As marés de maior amplitude (águas vivas) acontecem:',
              ['Na Lua Nova e na Lua Cheia (sizígia).', 'Nos quartos crescente e minguante (quadratura).', 'Só nos equinócios.', 'Quando a Lua está mais longe da Terra.'], 0,
              'Na sizígia (Lua Nova e Cheia), Sol, Terra e Lua estão alinhados e as atrações se somam: maiores amplitudes, águas vivas. Na quadratura as forças se contrariam: águas mortas. Equinócios e a distância da Lua influenciam, mas não são a regra básica.',
              'Miguens, Vol. I, item 10.1.3'),
            q('m9l6-2', T_MARE, 2, 'A carta mostra sondagem de 2,0 m. Pela tábua, a altura da maré no horário é de 1,5 m. Seu barco cala 1,8 m. A folga sob a quilha será de:',
              ['0,2 m.', '1,7 m.', '3,5 m.', '5,3 m.'], 1,
              'Profundidade = sondagem + altura = 2,0 + 1,5 = 3,5 m. Folga = 3,5 − 1,8 = 1,7 m. 0,2 m seria esquecer a maré; 3,5 m é a profundidade, não a folga; 5,3 m somaria o calado em vez de subtrair.',
              'Miguens, Vol. I, Cap. 10 (profundidade = sondagem + altura da maré)'),
            q('m9l6-3', T_MARE, 3, 'Num porto de maré semidiurna, a BM é de 0,4 m e a PM seguinte de 2,4 m, seis horas depois. Pela regra dos doze avos, qual a altura duas horas após a BM?',
              ['0,6 m.', '0,9 m.', '1,4 m.', '1,9 m.'], 1,
              'Amplitude = 2,4 − 0,4 = 2,0 m. Nas duas primeiras horas a maré sobe 1/12 + 2/12 = 3/12 da amplitude = 0,5 m. Altura = 0,4 + 0,5 = 0,9 m. 0,6 m considera só a primeira hora (1/12 ≈ 0,17 m). 1,4 m é a metade do tempo (3 horas, 6/12). 1,9 m corresponde a 9/12, ou 4 horas.',
              'Regra dos doze avos (Manual de Navegação, DHN)'),
            q('m9l6-4', T_MARE, 2, 'As alturas da Tábua das Marés e as sondagens da carta náutica são referidas:',
              ['Ao nível de redução (NR).', 'Ao nível médio do mar.', 'À preamar média de sizígia.', 'Ao nível da água no momento da sondagem.'], 0,
              'O NR é o zero comum da carta e da tábua; por isso a profundidade é a soma da sondagem com a altura da maré. O nível médio fica acima do NR (em Cabedelo, 1,34 m). A preamar média não é o zero das cartas brasileiras. O nível do momento muda o tempo todo e não serviria de referência.',
              'Miguens, Vol. I, item 10.1.5'),
            q('m9l6-5', T_MARE, 2, 'Na costa brasileira, a maré semidiurna, com duas preamares e duas baixa-mares de alturas parecidas por dia, predomina:',
              ['De Vitória (ES) para o norte.', 'De Vitória (ES) para o sul.', 'Só no Rio Grande do Sul.', 'Só nos rios.'], 0,
              'O Manual de Navegação registra a maré semidiurna de Vitória para o norte. Na costa sul a maré é semidiurna com desigualdades diurnas (alturas bem diferentes). Por isso as Tabelas I e II da DHN só devem ser usadas de Vitória para o norte.',
              'Miguens, Vol. I, item 10.1.4 e p. 10-18')
          ] },
          { t: 'fontes', itens: [{ txt: 'Miguens, Navegação: a Ciência e a Arte, Vol. I (DHN, 2023), Cap. 10 — Marés', url: MIG1, ref: 'tecnico-186' }, { txt: 'CHM — Tábuas das Marés 2026 (PDF por porto)', url: 'https://www.marinha.mil.br/chm/tabuas-de-mare-6', ref: 'tecnico-134' }, { txt: 'Tábuas das Marés: regra dos doze avos', ref: 'tecnico-164' }, { txt: 'NORMAM-211, Anexo 5-A, item 3.1 e)', url: NORMAM211, ref: 'extra-arrais-2-08' }] }
        ]
      }
    ]
  });

  VL.dado('cursos/arrais-2', { id: 'arrais-2', modulos: M });
})();
