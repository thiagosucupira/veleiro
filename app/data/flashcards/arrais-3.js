/* Flashcards do Arrais-Amador, parte 3: incêndio e combustíveis, salvatagem, primeiros socorros, rádio VHF,
   estabilidade e mau tempo, legislação e o roteiro da habilitação (módulos m10 a m16 de data/cursos/arrais-3.js).
   Base: NORMAM-211/DPC (Cap. 4, Cap. 5, Anexos 5-A e 5-F); LESTA/RLESTA; fichas de segurança (FDS) dos combustíveis;
   RIPEAM-72 e Regulamento de Radiocomunicações; diretrizes de primeiros socorros (St John Ambulance, Cruz Vermelha).
   Cartas com fato regulatório trazem, na referência, o id do fato verificado. */
VL.dado('flashcards/arrais-3', {
  id: 'arrais-3', titulo: 'arrais: fogo, salvatagem, socorros, rádio, legislação e habilitação', nivel: 'arrais',
  cartas: [
    /* ---- incêndio e combustíveis */
    { id: 'a3-01', frente: 'Quais são os quatro elementos do fogo (tetraedro)?', verso: 'Combustível, comburente (oxigênio), calor e reação em cadeia. Tirando um deles, o fogo apaga.', dica: 'o triângulo mais a reação em cadeia', ref: 'Apostila CBMES, Prevenção e Combate a Incêndios' },
    { id: 'a3-02', frente: 'Ponto de fulgor × ponto de ignição (autoignição)', verso: 'Fulgor: temperatura mínima em que o líquido solta vapor suficiente para acender com chama. Autoignição: temperatura em que o vapor acende sozinho, sem chama.', ref: 'Fichas de segurança dos combustíveis (FDS)' },
    { id: 'a3-03', frente: 'Quanto menor o ponto de fulgor, o combustível é...', verso: '...mais perigoso no dia a dia: já solta vapor inflamável na temperatura ambiente.', ref: 'FDS dos combustíveis' },
    { id: 'a3-04', frente: 'Ponto de fulgor da gasolina C (a do posto)', verso: 'Abaixo de 0 °C: solta vapor inflamável em qualquer dia do ano. Uma faísca basta.', ref: 'FDS gasolina C (Vibra)' },
    { id: 'a3-05', frente: 'Ponto de fulgor do etanol hidratado', verso: 'Cerca de 15 °C (vaso fechado). Num dia comum já forma vapor que pega fogo com faísca. Autoignição: 363 °C.', ref: 'FDS etanol hidratado (Vibra)' },
    { id: 'a3-06', frente: 'Diesel: fulgor e autoignição', verso: 'Fulgor acima de 38 °C (conforme a ficha, 60 °C ou mais). Autoignição de 225 °C ou mais. Quase não forma vapor frio, mas acende numa superfície quente.', ref: 'FDS óleo diesel (Vibra)' },
    { id: 'a3-07', frente: 'Classe de incêndio A', verso: 'Sólidos que deixam brasa e cinza: madeira, papel, almofada, fibra de vidro, borracha. A água resfria e apaga.', ref: 'NORMAM-211 (extra-arrais-3-31)' },
    { id: 'a3-08', frente: 'Classes B e C de incêndio', verso: 'B: líquidos, gases e graxas inflamáveis (gasolina, diesel, álcool, GLP). C: equipamento elétrico energizado. Não use água.', ref: 'NORMAM-211 (extra-arrais-3-32)' },
    { id: 'a3-09', frente: 'Qual extintor serve para A, B e C?', verso: 'O de pó químico ABC. O CO2 e o pó BC servem para B e C. A água só serve para A.', ref: 'NORMAM-211, art. 4.27 (extra-arrais-3-31 a -34)' },
    { id: 'a3-10', frente: 'Por que não jogar água em fogo de gasolina?', verso: 'A gasolina é mais leve e flutua: a água espalha o fogo. Use espuma, CO2 ou pó químico.', ref: 'Apostila CBMES' },
    { id: 'a3-11', frente: 'Extintores para barco a motor de 6 m a menos de 12 m', verso: 'Dois extintores B-1 perto do motor e um B-1 no comando. Com tanque portátil de até 27 L, basta um B-1 perto do motor.', ref: 'NORMAM-211, art. 4.36.2 (extra-arrais-3-36)' },
    { id: 'a3-12', frente: 'Barco a motor com menos de 6 m precisa de extintor?', verso: 'Não, está dispensado pela norma. Mesmo assim, é boa prática levar um.', ref: 'NORMAM-211, art. 4.36 (extra-arrais-3-35)' },
    { id: 'a3-13', frente: 'Abastecimento: o que fazer antes?', verso: 'Motor, fogão e elétricos desligados; ninguém fuma; passageiros em terra; vigias fechadas; extintor à mão.', ref: 'Safe Fueling (Pennsylvania Fish and Boat Commission)' },
    { id: 'a3-14', frente: 'Para que serve o suspiro do tanque?', verso: 'Deixa o ar e o vapor saírem enquanto o tanque enche. Combustível saindo por ele indica tanque cheio demais.', ref: 'Safe Fueling (PFBC)' },
    { id: 'a3-15', frente: 'Depois de abastecer, antes de ligar o motor...', verso: 'Ventile o compartimento do motor e cheire a sentina. Vapor de gasolina é mais pesado que o ar e fica embaixo.', ref: 'BoatUS, Dangerous Gases Aboard' },
    { id: 'a3-16', frente: 'Fogo no compartimento do motor: o que fazer?', verso: 'Corte o combustível, desligue o motor e descarregue o extintor por uma pequena abertura. Abrir a tampa de uma vez alimenta o fogo com oxigênio.', ref: 'BoatUS, Engine Compartment Fire' },
    /* ---- salvatagem */
    { id: 'a3-17', frente: 'Quantos coletes salva-vidas são exigidos?', verso: 'Pelo menos um por pessoa a bordo, com tamanho infantil para as crianças.', ref: 'NORMAM-211, art. 4.14 (extra-arrais-3-04)' },
    { id: 'a3-18', frente: 'Colete classe I × II × III', verso: 'I: SOLAS, oceânica. II: SOLAS abrandado, costeira. III: navegação interior.', ref: 'NORMAM-211, Cap. 4 (extra-arrais-3-01, -02, -05)' },
    { id: 'a3-19', frente: 'Que colete vale na navegação interior de médio porte?', verso: 'Classe III ou V.', ref: 'NORMAM-211, arts. 4.33 a 4.35 (extra-arrais-3-06)' },
    { id: 'a3-20', frente: 'Onde guardar os coletes?', verso: 'Em local de acesso imediato e com indicação clara. Nunca no fundo do paiol.', ref: 'NORMAM-211 (extra-arrais-3-07)' },
    { id: 'a3-21', frente: 'Boia salva-vidas: quantas por embarcação?', verso: 'Miúda (até 6 m): dispensada. Médio porte abaixo de 12 m: uma. De 12 m ou mais: duas. Grande porte: duas.', ref: 'NORMAM-211 (extra-arrais-3-08, -09)' },
    { id: 'a3-22', frente: 'A boia pode ficar amarrada ao barco?', verso: 'Não. Fica em suporte fixo, de onde sai com um puxão, e o chicote da retinida não é preso à embarcação.', ref: 'NORMAM-211 (extra-arrais-3-10)' },
    { id: 'a3-23', frente: 'Pirotécnicos na navegação costeira × oceânica', verso: 'Costeira: 2 foguetes com paraquedas, 2 fachos e 2 fumígenos. Oceânica: 4 de cada. Interior: só grande porte, com um facho.', ref: 'NORMAM-211 (extra-arrais-3-16, -17, -18)' },
    { id: 'a3-24', frente: 'Foguete com paraquedas × facho × fumígeno', verso: 'Foguete: visto de longe (300 m de altura, luz vermelha). Facho: posição à noite, 60 s. Fumígeno laranja: posição de dia.', ref: 'NORMAM-211 (extra-arrais-3-13 a -15)' },
    { id: 'a3-25', frente: 'Balsa salva-vidas na navegação oceânica', verso: 'Balsa inflável para 100% das pessoas a bordo. Na costeira é dispensada (bote inflável recomendado).', ref: 'NORMAM-211 (travessia-114; extra-arrais-3-19)' },
    { id: 'a3-26', frente: 'Regra 1-10-1 da água fria', verso: '1 minuto: choque térmico, controle a respiração. 10 minutos: use-os para se salvar antes de perder a força. 1 hora: hipotermia, perda de consciência.', ref: 'Giesbrecht, cold water survival' },
    { id: 'a3-27', frente: 'Posição HELP', verso: 'Joelhos encolhidos, braços cruzados no peito, colete vestido. Reduz a perda de calor. Em grupo, abrace-se peito com peito.', ref: 'Transport for NSW, Cold water and hypothermia; Giesbrecht (McGill)' },
    { id: 'a3-28', frente: 'O material de salvatagem é mínimo para qual condição?', verso: 'Para bom tempo. O comandante responde por equipar o barco de acordo com a área e as pessoas a bordo.', ref: 'NORMAM-211 (extra-arrais-3-28, -44)' },
    /* ---- primeiros socorros */
    { id: 'a3-29', frente: 'Primeira regra do socorro', verso: 'Garanta a sua segurança. Vítima nova não ajuda ninguém. Depois: chame ajuda, avalie e aja.', ref: 'Cruz Vermelha (FICR); St John Ambulance' },
    { id: 'a3-30', frente: 'RCP no adulto: profundidade e ritmo', verso: 'Compressões de 5 a 6 cm, 100 a 120 por minuto, no centro do peito, deixando o peito voltar.', ref: 'St John Ambulance, CPR' },
    { id: 'a3-31', frente: 'Proporção compressões:ventilações', verso: '30 compressões para 2 ventilações, para quem foi treinado. Sem treino, só compressões contínuas.', ref: 'St John Ambulance, CPR' },
    { id: 'a3-32', frente: 'No afogamento, o que muda na RCP?', verso: 'Começa com 5 ventilações, porque a parada vem da falta de oxigênio. Depois, 30 compressões e 2 ventilações.', ref: 'St John Ambulance, Drowning' },
    { id: 'a3-33', frente: 'Hemorragia grave: o que fazer?', verso: 'Compressão direta e firme com pano limpo; se for catastrófico e não parar, torniquete perto e acima da ferida (nunca em articulação), e chame ajuda. Anote a hora.', ref: 'Cruz Vermelha (FICR)' },
    { id: 'a3-34', frente: 'Queimadura: primeiro gesto', verso: 'Água corrente fria por pelo menos 20 minutos. Não use pasta de dente, manteiga nem fure bolhas.', ref: 'St John Ambulance, Burns and scalds; NHS' },
    { id: 'a3-35', frente: 'Exaustão pelo calor × insolação', verso: 'Exaustão: suor, pele úmida, melhora com sombra e líquidos. Insolação: pele quente e seca, confusão; é emergência, resfrie e peça ajuda.', ref: 'NHS, Heat exhaustion and heatstroke; St John Ambulance, Heatstroke' },
    { id: 'a3-36', frente: 'Qual o número do SALVAMAR?', verso: '185. Atende 24 horas pedidos de socorro vindos do mar, inclusive pessoas doentes a bordo.', ref: 'SALVAMAR, Marinha do Brasil (radio-48; travessia-108)' },
    /* ---- rádio VHF */
    { id: 'a3-37', frente: 'Canal de escuta obrigatória no VHF', verso: 'Canal 16 (156,8 MHz), ou o 70 (156,525 MHz) se o rádio tiver DSC. Navegando, o rádio fica ligado e em escuta.', ref: 'NORMAM-211 (normas-150)' },
    { id: 'a3-38', frente: 'Para que serve o canal 70?', verso: 'Só para chamadas digitais DSC (alertas de socorro e chamadas seletivas). Ninguém fala nele.', ref: 'Regulamento de Radiocomunicações' },
    { id: 'a3-39', frente: 'Potência do VHF fixo e bateria do portátil', verso: 'Fixo: mínimo de 25 W. Portátil: bateria para pelo menos 4 horas de operação.', ref: 'NORMAM-211 (normas-149, normas-173)' },
    { id: 'a3-40', frente: 'MAYDAY × PAN PAN × SECURITÉ', verso: 'MAYDAY: perigo grave e iminente. PAN PAN: urgência, sem perigo iminente. SECURITÉ: aviso de segurança da navegação.', ref: 'Regulamento de Radiocomunicações (UIT)' },
    { id: 'a3-41', frente: 'Chamada de socorro: o que dizer, em ordem?', verso: 'MAYDAY ×3, nome do barco ×3, MAYDAY e nome, posição, natureza do perigo, auxílio pedido, pessoas a bordo, outras informações, câmbio.', ref: 'Regulamento de Radiocomunicações' },
    { id: 'a3-42', frente: 'Licença da estação de rádio do barco', verso: 'A Licença de Estação de Navio é emitida pela Anatel, e o barco recebe um indicativo de chamada.', ref: 'NORMAM-211 (normas-152; radio-36)' },
    { id: 'a3-43', frente: 'Câmbio × terminado', verso: 'Câmbio: terminei de falar, aguardo a resposta. Terminado: fim da comunicação.', ref: 'Procedimentos de radiotelefonia' },
    /* ---- estabilidade e mau tempo */
    { id: 'a3-44', frente: 'Por que manter o peso baixo e no centro?', verso: 'Peso alto sobe o centro de gravidade e diminui a estabilidade. Peso baixo e junto do eixo do barco o deixa firme.', ref: 'Manual de Navegação (Marinha)' },
    { id: 'a3-45', frente: 'Superfície livre: por que é perigosa?', verso: 'Líquido solto num tanque ou no porão corre para o lado do balanço e inclina o barco ainda mais. Mantenha tanques cheios ou vazios e seque a sentina.', ref: 'Manual de Navegação (Marinha)' },
    { id: 'a3-46', frente: 'Balanço, caturro e cabeceio', verso: 'Balanço: de um bordo ao outro. Caturro (arfagem): proa sobe e desce. Cabeceio: a proa oscila para os bordos, como uma guinada.', ref: 'Curso Arrais, módulo 14' },
    { id: 'a3-47', frente: 'Quem define a lotação do barco?', verso: 'O estaleiro construtor (abaixo de 24 m), ou a Capitania. Consta do TIE e é proibido exceder, contando a tripulação.', ref: 'NORMAM-211 (extra-arrais-3-41 a -43)' },
    /* ---- legislação */
    { id: 'a3-48', frente: 'Áreas e categorias', verso: 'Arrais: interior. Mestre: costeira, até 20 milhas. Capitão: oceânica, sem limite. Motonauta: moto aquática. Veleiro: vela, miúda.', ref: 'NORMAM-211 (normas-23 a 28)' },
    { id: 'a3-49', frente: 'Validade da CHA', verso: '10 anos a partir da emissão; 5 anos para quem tem 65 anos ou mais. Renova-se em qualquer Capitania, Delegacia ou Agência.', ref: 'NORMAM-211 (normas-112, -113, -115)' },
    { id: 'a3-50', frente: 'Embriaguez na NORMAM-211', verso: 'A partir de 0,25 mg de álcool por litro de ar alveolar, ou 0,05% no sangue. Pode levar à suspensão da CHA por até 120 dias.', ref: 'NORMAM-211 (normas-138, -136)' },
    { id: 'a3-51', frente: 'Navegar sem habilitação: infração e multa', verso: 'Conduzir sem ser habilitado: art. 11 do RLESTA, multa do grupo E (até R$ 2.200). Não possuir a documentação de habilitação (art. 12, I): grupo D. Não portá-la (art. 12, II): grupo B.', ref: 'RLESTA (normas-145, -147, -168, -146)' },
    /* ---- sua habilitação na prática */
    { id: 'a3-52', frente: 'Treinamento do Arrais-Amador: quanto e onde?', verso: 'Mínimo de 6 h (2 h de teoria + 4 h de prática em movimento) em escola ou pessoa física credenciadas. Atestado vale 2 anos no país.', ref: 'NORMAM-211 (normas-56 a -59)' },
    { id: 'a3-53', frente: 'Documentos da inscrição para a CHA', verso: 'Identidade e CPF autenticados, comprovante de residência (até 120 dias), GRU paga, atestado médico (dispensado com CNH válida) e atestado de treinamento.', ref: 'NORMAM-211, art. 5.4.1 (normas-38 a -45)' },
    { id: 'a3-54', frente: 'GRU da CHA em 2026', verso: 'R$ 60,32, para inscrição, renovação e segunda via em todas as categorias. Gerada no site da DPC, em Serviços da Diretoria.', ref: 'Portaria 251/DPC/2025 (normas-159, -162)' },
    { id: 'a3-55', frente: 'Formato da prova de Arrais-Amador', verso: '40 questões, até 2 horas, nota de 0 a 10, aprovação com 5,0 ou mais. Leve protocolo, documento de identidade e caneta azul ou preta.', ref: 'NORMAM-211, Anexo 5-A (normas-98 a -100)' },
    { id: 'a3-56', frente: 'Reprovou ou faltou à prova: e a GRU?', verso: 'A GRU paga não é reaproveitada. É preciso nova inscrição, com nova guia.', ref: 'NORMAM-211, Anexo 5-A (normas-102)' },
    { id: 'a3-57', frente: 'Onde fica a CHA digital?', verso: 'No aplicativo gov.br, depois do aviso por SMS e/ou e-mail. Leve dispositivo que permita a consulta, ou a CHA impressa com QR Code legível.', ref: 'NORMAM-211 (normas-110, -111)' }
  ]
});
