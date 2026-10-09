/* Banco de questões — radio. Gerado por tools/build_questoes.py em 2026-10-09 a partir de
   research/_work/questoes/ (cada lote passou por duas revisões de instrutor). Conteúdo CC BY-SA 4.0. */
VL.dado('questoes/radio', [
{
"id": "radio-0001",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 1,
"enunciado": "Por que a altura da antena influi mais no alcance de uma conversa em VHF marítimo do que o aumento da potência do rádio?",
"alternativas": [
"Porque o VHF viaja em linha reta e não contorna a curvatura da Terra; antena mais alta enxerga mais longe.",
"Porque as ondas de VHF sobem até a ionosfera e voltam, e a altura da antena decide onde elas retornam.",
"Porque uma antena mais alta aumenta a potência irradiada pelo transmissor, medida em watts, sem trocar o rádio.",
"Porque a potência do VHF marítimo é limitada a 1 W e só a altura da antena compensa essa limitação."
],
"correta": 0,
"explicacao": "O VHF se propaga em linha de visada de rádio: o que está abaixo do horizonte fica escondido, e o horizonte cresce com a altura das antenas. A reflexão na ionosfera é característica das ondas curtas (HF), não do VHF. A altura da antena não cria potência: ela só muda até onde o sinal chega. E a potência do VHF fixo já é alta (a NORMAM-211, art. 4.23.2, pede no mínimo 25 W; 1 W é apenas a opção de potência baixa), então não é ela que limita o alcance.",
"referencia": "Rec. UIT-R P.834 (refração troposférica); propagação em linha de visada no VHF",
"fonte_url": "https://www.itu.int/rec/R-REC-P.834"
},
{
"id": "radio-0002",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 2,
"enunciado": "Um veleiro grande tem a antena de VHF no tope, a 25 m acima da água. A antena de uma estação costeira está a 100 m. Pela regra prática alcance (milhas) ≈ 2,2 × (√h₁ + √h₂), com as alturas em metros, qual é o alcance teórico entre as duas estações?",
"alternativas": [
"Cerca de 33 milhas.",
"Cerca de 275 milhas.",
"Cerca de 25 milhas.",
"Cerca de 110 milhas."
],
"correta": 0,
"explicacao": "√25 = 5 e √100 = 10; 5 + 10 = 15; 2,2 × 15 = 33 milhas. O valor de 275 vem de somar as alturas sem tirar a raiz (2,2 × 125). O de 25 vem de tirar a raiz da soma das alturas (2,2 × √125 ≈ 24,6), o que não é a regra. O de 110 vem de multiplicar as raízes em vez de somá-las (2,2 × 5 × 10).",
"referencia": "Rec. UIT-R P.834; regra prática de alcance em linha de visada de rádio",
"fonte_url": "https://www.itu.int/rec/R-REC-P.834",
"figura": {
"svg": "<svg viewBox=\"0 0 360 150\" role=\"img\" aria-label=\"Duas antenas sobre a curvatura da Terra: uma a 25 metros e outra a 100 metros de altura\"><path d=\"M10 130 Q180 70 350 130 L350 146 L10 146 Z\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\" stroke-width=\"2\"/><line x1=\"90\" y1=\"108\" x2=\"90\" y2=\"98\" stroke=\"var(--ink)\" stroke-width=\"3\"/><line x1=\"270\" y1=\"108\" x2=\"270\" y2=\"68\" stroke=\"var(--ink)\" stroke-width=\"3\"/><circle cx=\"90\" cy=\"98\" r=\"3\" fill=\"var(--nav-red)\"/><circle cx=\"270\" cy=\"68\" r=\"3\" fill=\"var(--nav-red)\"/><line x1=\"90\" y1=\"98\" x2=\"270\" y2=\"68\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"90\" y=\"88\" text-anchor=\"middle\" font-size=\"13\" fill=\"currentColor\">25 m</text><text x=\"270\" y=\"58\" text-anchor=\"middle\" font-size=\"13\" fill=\"currentColor\">100 m</text><text x=\"180\" y=\"140\" text-anchor=\"middle\" font-size=\"13\" fill=\"currentColor\">alcance = ?</text></svg>"
}
},
{
"id": "radio-0003",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 2,
"enunciado": "Em um trecho noturno da navegação costeira, um tripulante propõe desligar o VHF com DSC para poupar a bateria e religá-lo só se houver problema. De acordo com a NORMAM-211, o que está certo?",
"alternativas": [
"Pode, desde que a EPIRB fique ligada, pois ela substitui a escuta do VHF durante toda a navegação noturna.",
"Não pode: com o barco navegando, o VHF fica ligado e em escuta permanente no canal 16, ou no 70 se for DSC.",
"Pode, desde que a escuta seja mantida só durante o dia, quando há mais tráfego de embarcações na costa.",
"Pode, se o AIS estiver ligado, porque ele cobre a escuta de chamadas e de pedidos de socorro de outros barcos."
],
"correta": 1,
"explicacao": "A norma exige o equipamento VHF ligado e em escuta permanente enquanto a embarcação navega (art. 4.23.4, alínea a), porque um pedido de socorro pode vir a qualquer hora. A EPIRB só transmite quando ativada e não ouve o canal; o AIS troca dados de posição e não recebe chamadas de voz nem alertas DSC; e a escuta não depende de ser dia ou noite.",
"referencia": "NORMAM-211/DPC, art. 4.23.4 a)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0004",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 1,
"enunciado": "Qual das associações entre canal e frequência do VHF marítimo está correta?",
"alternativas": [
"Canal 70: 156,800 MHz, voz de chamada e socorro.",
"Canal 16: 156,525 MHz, chamada digital DSC.",
"Canal 70: 161,975 MHz, canal do AIS.",
"Canal 16: 156,800 MHz, voz de chamada e socorro."
],
"correta": 3,
"explicacao": "O canal 16 (156,800 MHz) é o canal de voz para chamada, socorro, urgência e segurança. O canal 70 (156,525 MHz) é reservado ao DSC, em dados. Duas das associações erradas trocam os valores de um canal pelos do outro. E o AIS usa 161,975 e 162,025 MHz, que não são o canal 70.",
"referencia": "UIT, RR, Apêndice 18 (canais do serviço móvel marítimo); NORMAM-211/DPC, art. 4.23.4 a)",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0005",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 1,
"enunciado": "O MMSI de uma estação de navio tem 9 dígitos. No MMSI fictício da figura, o que os três primeiros dígitos (710) identificam?",
"alternativas": [
"A área marítima do GMDSS em que o barco navega, de A1 a A4.",
"O país da estação, pelo código MID: 710 é o Brasil.",
"O tipo de equipamento instalado: 710 indica um VHF com DSC.",
"A Capitania dos Portos em que o barco está inscrito."
],
"correta": 1,
"explicacao": "Os três primeiros dígitos são o MID (maritime identification digits), o código do país; o do Brasil é 710, e os seis seguintes identificam a estação. As áreas A1 a A4 do GMDSS são definidas pelo alcance dos meios de comunicação e não aparecem no MMSI. O MMSI não informa o tipo de rádio nem a Capitania de inscrição.",
"referencia": "UIT, RR, Apêndice 43; Rec. UIT-R M.585; NORMAM-211/DPC, art. 4.23.6 d) (a EPIRB usa o mesmo prefixo 710)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 360 120\" role=\"img\" aria-label=\"MMSI fictício 710 482916, com um grupo de três dígitos e um grupo de seis dígitos\"><rect x=\"20\" y=\"24\" width=\"120\" height=\"48\" rx=\"4\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\"/><rect x=\"160\" y=\"24\" width=\"180\" height=\"48\" rx=\"4\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\"/><text x=\"80\" y=\"58\" text-anchor=\"middle\" font-size=\"26\" font-family=\"monospace\" fill=\"currentColor\">7 1 0</text><text x=\"250\" y=\"58\" text-anchor=\"middle\" font-size=\"26\" font-family=\"monospace\" fill=\"currentColor\">4 8 2 9 1 6</text><path d=\"M20 84 v8 h120 v-8\" fill=\"none\" stroke=\"var(--sea-3)\" stroke-width=\"2\"/><path d=\"M160 84 v8 h180 v-8\" fill=\"none\" stroke=\"var(--sea-3)\" stroke-width=\"2\"/><text x=\"80\" y=\"110\" text-anchor=\"middle\" font-size=\"14\" fill=\"currentColor\">3 dígitos</text><text x=\"250\" y=\"110\" text-anchor=\"middle\" font-size=\"14\" fill=\"currentColor\">6 dígitos</text><text x=\"180\" y=\"14\" text-anchor=\"middle\" font-size=\"13\" fill=\"currentColor\">MMSI fictício de estação de navio</text></svg>"
}
},
{
"id": "radio-0006",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 3,
"enunciado": "Pela estrutura dos MMSI definida pela UIT, qual dos números abaixo identifica uma ESTAÇÃO COSTEIRA do Brasil (MID 710)?",
"alternativas": [
"710009990",
"007109990",
"071012345",
"970710999"
],
"correta": 1,
"explicacao": "A estação costeira usa 00 + MID + 4 dígitos: 00 710 9990. O número 710 009990 segue o formato de estação de navio (MID + 6 dígitos). O 071012345 segue o de grupo de navios (0 + MID + 5 dígitos). E o 970710999 começa por 970, prefixo do AIS-SART (baliza de sobrevivência), embora contenha 710 no meio.",
"referencia": "Rec. UIT-R M.585; UIT, RR, Apêndice 43",
"fonte_url": "https://www.itu.int/rec/R-REC-M.585"
},
{
"id": "radio-0007",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 2,
"enunciado": "Com o rádio VHF DSC ligado ao GPS do barco, quais informações o alerta de socorro enviado no canal 70 leva?",
"alternativas": [
"O nome do comandante, o número de pessoas a bordo e o tipo de carga transportada.",
"Somente um tom de alarme, sem identificar o barco e sem informar a posição.",
"A posição e a hora de Brasília, mas nunca o MMSI, para preservar a privacidade do dono.",
"O MMSI, a posição, a hora UTC e a natureza do perigo, se o operador a escolheu."
],
"correta": 3,
"explicacao": "O alerta DSC leva a identidade do barco (MMSI), a posição e a hora UTC, vindas do GPS e do próprio rádio, e a natureza do perigo, quando o operador a seleciona. Nome do comandante, número de pessoas e carga não fazem parte do alerta (o número de pessoas vai na mensagem de voz). Um tom sem dados não é um alerta digital. E sem o MMSI ninguém saberia quem pede socorro; além disso, a hora do alerta é UTC, não a de Brasília.",
"referencia": "Rec. UIT-R M.493 (informação do alerta de socorro); UIT-R M.541",
"fonte_url": "https://www.itu.int/rec/R-REC-M.493"
},
{
"id": "radio-0008",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 2,
"enunciado": "A NORMAM-211 pede ao VHF portátil bateria para operar por no mínimo 4 horas com coeficiente de utilização de 1:9, isto é, 1 minuto de transmissão para 9 minutos de escuta. Nessas 4 horas, quanto tempo o rádio fica transmitindo?",
"alternativas": [
"24 minutos.",
"40 minutos.",
"27 minutos.",
"216 minutos."
],
"correta": 0,
"explicacao": "A cada 10 minutos (1 de transmissão + 9 de escuta), 1 minuto é de transmissão. Em 4 h = 240 min, são 240 ÷ 10 = 24 minutos. Os 40 minutos vêm de ler 0,4 h como 40 minutos. Os 27 minutos vêm de dividir 240 por 9, esquecendo que o minuto transmitido também faz parte do ciclo. E os 216 minutos invertem a proporção (9 de transmissão para 1 de escuta).",
"referencia": "NORMAM-211/DPC, art. 4.23.3",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0009",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 1,
"enunciado": "Um veleiro tem a antena de VHF no tope do mastro. O que a NORMAM-211 exige além dela, para o caso de o mastro quebrar?",
"alternativas": [
"Um segundo rádio VHF fixo, ligado à mesma antena do tope.",
"Um rádio HF no lugar do VHF, que dispensa a antena do tope.",
"Uma antena de emergência, para uso se o mastro quebrar.",
"Um rolo de cabo coaxial reserva, sem antena."
],
"correta": 2,
"explicacao": "Se o mastro cai, a antena do tope vai junto e o VHF fica mudo; por isso a norma exige uma antena de emergência (art. 4.24.2). Um segundo rádio ligado à mesma antena cairia junto com o mastro. Trocar o VHF por HF não cumpre a exigência, e cabo sem antena não irradia nada.",
"referencia": "NORMAM-211/DPC, art. 4.24.2 (parágrafo final)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0010",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 2,
"enunciado": "Um veleiro de 13 m (embarcação de médio porte: comprimento inferior a 24 m, exceto as miúdas, que têm até 6 m, pelas definições da NORMAM-211) fará navegação costeira. Quanto ao rádio, o que a NORMAM-211 exige no art. 4.24.2, alínea b?",
"alternativas": [
"Um VHF fixo ou portátil, apenas recomendado, sem exigência de DSC.",
"Um VHF com DSC mais um HF com DSC (ou comunicador satelital).",
"Um transceptor VHF com DSC, obrigatório para essa navegação.",
"Nenhum rádio, bastando o celular com sinal de operadora."
],
"correta": 2,
"explicacao": "Na navegação costeira, a embarcação de médio porte precisa de um transceptor VHF com DSC. A recomendação de VHF fixo ou portátil (alínea c) vale para a navegação interior. VHF com DSC mais HF com DSC (que pode ser trocado por telefone ou comunicador satelital) e EPIRB 406 MHz são a dotação da navegação oceânica (alínea a). E o celular não substitui o rádio marítimo, pois depende de cobertura de operadora.",
"referencia": "NORMAM-211/DPC, art. 4.24.2 b) e c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0011",
"nivel": "radio",
"tema": "VHF e DSC",
"dificuldade": 3,
"enunciado": "Um veleiro com antena de VHF a 9 m quer falar com uma estação costeira a 22 milhas, no limite do alcance. Pela regra alcance ≈ 2,2 × (√h₁ + √h₂), qual é a altura mínima da antena da costeira?",
"alternativas": [
"7 m.",
"49 m.",
"100 m.",
"13 m."
],
"correta": 1,
"explicacao": "Com 22 milhas: 22 ÷ 2,2 = 10, e √9 = 3 da antena do veleiro; sobram √h = 7, logo h = 7² = 49 m. O valor de 7 m esquece de elevar ao quadrado. O de 100 m ignora a antena do veleiro (10²). E o de 13 m subtrai as alturas diretamente (22 − 9), mas a regra trabalha com raízes.",
"referencia": "Rec. UIT-R P.834; regra prática de alcance em linha de visada de rádio",
"fonte_url": "https://www.itu.int/rec/R-REC-P.834"
},
{
"id": "radio-0012",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 1,
"enunciado": "Um veleiro foi abalroado por um cargueiro, o casco abriu e a água entra mais depressa do que as bombas retiram. Que sinal de rádio o comandante deve usar?",
"alternativas": [
"PAN PAN, porque o barco ainda está flutuando.",
"MAYDAY, porque há perigo grave e iminente e é preciso auxílio imediato.",
"SÉCURITÉ, para avisar os outros navegantes do abalroamento.",
"Nenhum sinal especial: basta chamar a costeira no canal 16 em tom de rotina."
],
"correta": 1,
"explicacao": "Alagamento que supera as bombas ameaça afundar o barco: é perigo grave e iminente, caso de MAYDAY. O PAN PAN serve quando a urgência não é de perigo imediato, e “ainda flutuar” não torna a situação menos grave. O SÉCURITÉ é aviso de segurança da navegação e não pede ajuda. E uma chamada de rotina não tem a prioridade do socorro.",
"referencia": "UIT, RR, Art. 32 (sinal de socorro MAYDAY); Anatel, Material de apoio ao exame de Radiotelefonista, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0013",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 1,
"enunciado": "Você avista um contêiner flutuando semi-submerso no meio de uma rota de navegação. Ninguém corre perigo, mas é preciso avisar os outros barcos. Que sinal de rádio usar?",
"alternativas": [
"MAYDAY, dito três vezes, para garantir a atenção de todos.",
"PAN PAN, dito três vezes, porque o objeto é urgente.",
"O alerta DSC de socorro (DISTRESS), por ser mais rápido.",
"SÉCURITÉ, dito três vezes antes do aviso."
],
"correta": 3,
"explicacao": "Objeto à deriva é o caso típico de aviso de segurança da navegação: SÉCURITÉ, repetido três vezes. MAYDAY e o alerta DISTRESS são para perigo grave e iminente do seu próprio barco ou de outro, e usá-los sem necessidade mobiliza recursos de salvamento. O PAN PAN trata de urgência de uma embarcação ou pessoa, e aqui ninguém precisa de ajuda.",
"referencia": "UIT, RR, Art. 33 (sinal e mensagens de segurança); Anatel, Material de apoio, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0014",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 1,
"enunciado": "Qual é a ordem decrescente de prioridade das comunicações no serviço móvel marítimo?",
"alternativas": [
"Urgência (PAN PAN), socorro (MAYDAY), segurança (SÉCURITÉ) e, por último, rotina.",
"Segurança (SÉCURITÉ), urgência (PAN PAN), socorro (MAYDAY) e, por último, rotina.",
"Socorro (MAYDAY), urgência (PAN PAN), segurança (SÉCURITÉ) e, por último, rotina.",
"Socorro (MAYDAY), segurança (SÉCURITÉ), urgência (PAN PAN) e, por último, rotina."
],
"correta": 2,
"explicacao": "A prioridade vai do mais grave ao mais leve: socorro, urgência, segurança e, por último, rotina. A mesma ordem vale para as categorias de chamada do DSC. A primeira alternativa põe a urgência acima do socorro. A segunda inverte a escada inteira e coloca o aviso de segurança no topo. A quarta põe a segurança acima da urgência, o que rebaixa um pedido urgente ao nível de um aviso.",
"referencia": "UIT, RR, Arts. 32 e 33; Rec. UIT-R M.493 (categorias de chamada)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.493"
},
{
"id": "radio-0015",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 1,
"enunciado": "Um tripulante quer apertar o botão DISTRESS “só para ver se o rádio está funcionando”. Por que isso não deve ser feito?",
"alternativas": [
"Porque o botão só pode ser acionado uma vez por viagem e depois o rádio fica travado até ser reiniciado.",
"Porque o transmissor do canal 70 queima se o botão ficar apertado por mais de 5 segundos seguidos.",
"Porque o alerta é real: chega às estações no alcance e pode mobilizar o salvamento.",
"Porque o alerta só funciona se o barco estiver navegando a mais de 5 nós de velocidade."
],
"correta": 2,
"explicacao": "O DISTRESS não tem modo de teste: o alerta sai de verdade, toca em todos os rádios DSC no alcance e pode acionar o salvamento. Para testar, use uma chamada individual a um amigo ou a uma marina, em canal de trabalho. O botão não trava depois de usado, o equipamento é projetado para a duração normal do acionamento (cerca de 5 segundos) e o alerta não depende da velocidade do barco.",
"referencia": "Rec. UIT-R M.541; UIT, Resolução 349 (Rev.CMR-23) (alertas de socorro falsos e sua consequência para o salvamento)",
"fonte_url": "https://itu.int/en/ITU-R/terrestrial/fmd/Documents/WRC_23_Resolutions/E/RES_349(REV.WRC-23)-E.pdf"
},
{
"id": "radio-0016",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 2,
"enunciado": "A 12 milhas da costa, com mar de 1 m e vento fraco, o leme de um veleiro quebra. A tripulação está bem, o barco não faz água e a deriva é lenta, mas eles precisam de reboque. Qual é a comunicação mais adequada?",
"alternativas": [
"PAN PAN três vezes, com a posição, o problema e o pedido de reboque.",
"MAYDAY três vezes, pois o barco ficou sem governo e isso sempre é perigo grave e iminente.",
"SÉCURITÉ três vezes, avisando a deriva do barco e pedindo o reboque a quem estiver ouvindo.",
"Nenhuma chamada por ora, esperando o barco chegar a menos de 1 milha das pedras mais próximas."
],
"correta": 0,
"explicacao": "É uma situação urgente para a segurança do barco, mas sem perigo grave e iminente: caso de PAN PAN, com posição, problema e auxílio desejado. MAYDAY fica para risco imediato de vida ou do barco. O SÉCURITÉ serve para avisar a navegação e não pede ajuda. E esperar o perigo ficar iminente desperdiça tempo; se a situação piorar, passa-se a MAYDAY.",
"referencia": "UIT, RR, Art. 33 (sinal e mensagem de urgência); Anatel, Material de apoio, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0017",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 2,
"enunciado": "O veleiro “Maresia” precisa fazer a chamada de socorro por voz no canal 16. Qual é o começo correto da chamada?",
"alternativas": [
"SOS, SOS, SOS. Aqui é Maresia, Maresia, Maresia.",
"Maresia, Maresia, Maresia. Aqui é MAYDAY, MAYDAY, MAYDAY.",
"MAYDAY. Maresia. Estamos afundando. Câmbio.",
"MAYDAY, MAYDAY, MAYDAY. Aqui é Maresia, Maresia, Maresia."
],
"correta": 3,
"explicacao": "A chamada de socorro por voz começa com o sinal dito três vezes, depois “aqui é” e o nome do barco três vezes. O SOS é o sinal do Código Morse, e não da radiotelefonia. A alternativa que começa pelo nome do barco troca a ordem e põe o nome no lugar do sinal. A que diz só um MAYDAY tem uma única repetição, não dá a posição nem a natureza do perigo e fecha com “câmbio” antes de dar os dados.",
"referencia": "UIT, RR, Art. 32 (chamada de socorro por radiotelefonia); RIPEAM, Anexo IV (sinais de perigo)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "radio-0018",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 2,
"enunciado": "Na mensagem de socorro, como o tripulante deve informar a posição do veleiro?",
"alternativas": [
"Apenas o nome do porto de destino da viagem, que a costeira já conhece pelo plano de navegação.",
"Latitude e longitude, em graus e minutos, ou distância e marcação de um ponto conhecido.",
"O rumo e a velocidade planejados para a travessia, sem dizer onde o barco se encontra agora.",
"A posição do último porto visitado, mais a hora local em que o barco saiu de lá."
],
"correta": 1,
"explicacao": "Quem vai socorrer precisa saber onde o barco está agora: coordenadas (com o hemisfério) ou distância e marcação de um ponto conhecido, como “8 milhas ao sul da Ilha Rasa”. O destino, o rumo planejado e o último porto dizem para onde o barco ia ou de onde veio, e não onde ele se encontra no momento do perigo.",
"referencia": "UIT, RR, Art. 32 (conteúdo da mensagem de socorro); Anatel, Material de apoio, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0019",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 2,
"enunciado": "Ao levantar a tampa para “ver como é”, a criança do dono apertou o DISTRESS e o alerta saiu do rádio do veleiro “Maresia”. O que fazer em seguida?",
"alternativas": [
"Cancelar na hora, por voz no canal 16, dizendo que foi alarme falso e dando MMSI e hora UTC.",
"Desligar o rádio, pois sem transmissão o alerta é cancelado automaticamente depois de alguns minutos.",
"Enviar logo um novo alerta DISTRESS, para que o segundo anule o primeiro e apague o registro.",
"Esperar que uma estação costeira ligue para o barco e só então explicar que foi um engano."
],
"correta": 0,
"explicacao": "Alerta falso deve ser cancelado na hora (pelo DSC também, se o rádio tiver a função), e a mensagem de voz no canal 16 é sempre necessária, com o MMSI e a hora UTC do alerta, para que ninguém saia à procura de um barco que não está em perigo. Desligar e religar o rádio (após 10 segundos) é só o primeiro passo do procedimento da UIT; sozinho não cancela o alerta que já saiu nem avisa ninguém, e o alerta não se cancela sozinho. Um segundo DISTRESS só reforça o engano. Esperar a ligação da costeira atrasa o cancelamento e pode deslocar meios de salvamento à toa.",
"referencia": "UIT, Resolução 349 (Rev.CMR-23), Anexo, item 1 (cancelamento de alerta DSC em VHF); Rec. UIT-R M.541; Anatel, Material de apoio, item 2.2.15",
"fonte_url": "https://itu.int/en/ITU-R/terrestrial/fmd/Documents/WRC_23_Resolutions/E/RES_349(REV.WRC-23)-E.pdf"
},
{
"id": "radio-0020",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 2,
"enunciado": "Um veleiro enviou PAN PAN porque o motor parou. Vinte minutos depois, o vento aumentou, o barco derivou para um costão e a tripulação não consegue fundear. O que deve fazer?",
"alternativas": [
"Manter o PAN PAN, pois o sinal já foi enviado e não se muda de categoria no meio da ocorrência.",
"Passar a MAYDAY e avisar todas as estações de que o perigo agora é grave e iminente.",
"Cancelar o PAN PAN e enviar SÉCURITÉ para alertar os barcos próximos sobre o costão.",
"Repetir o PAN PAN a cada minuto até que alguma estação responda ao pedido."
],
"correta": 1,
"explicacao": "As mensagens podem subir de nível quando a situação piora: com risco imediato de encalhe, o correto é MAYDAY, avisando quem estava em escuta. Manter o PAN PAN subestima o perigo. O SÉCURITÉ não pede ajuda. E repetir PAN PAN insiste num sinal que já não descreve a gravidade do caso.",
"referencia": "UIT, RR, Arts. 32 e 33; Anatel, Material de apoio, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0021",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 1,
"enunciado": "Você navega e ouve, no canal 16, um MAYDAY de outro barco, que está longe do seu. O que deve fazer?",
"alternativas": [
"Desligar o rádio para não interferir no tráfego de socorro em andamento.",
"Continuar transmitindo normalmente no canal 16, já que o socorro é de outro barco.",
"Chamar o barco em perigo para pedir detalhes extras só por curiosidade.",
"Parar o que possa atrapalhar, ficar na escuta e anotar os dados do socorro."
],
"correta": 3,
"explicacao": "Toda estação que ouve uma chamada de socorro deve cessar qualquer transmissão que possa perturbar o tráfego e manter a escuta, anotando quem chama, a posição, o perigo e o auxílio pedido: a informação pode ser necessária se ninguém atender. Continuar a transmitir ou chamar o barco por curiosidade ocupa o canal. Desligar o rádio tira você da escuta e impede de ajudar ou retransmitir.",
"referencia": "UIT, RR, Art. 32 (tráfego de socorro); Anatel, Material de apoio, item 1.4.4",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0022",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 3,
"enunciado": "Você ouve um MAYDAY no canal 16 de um veleiro com incêndio. Passados 5 minutos, nenhuma costeira nem outro barco respondeu. Seu barco não corre perigo. Qual é a ação correta?",
"alternativas": [
"Confirmar ao barco em perigo que o ouviu e retransmitir o socorro com MAYDAY RELAY.",
"Transmitir MAYDAY como se o seu barco estivesse em perigo, para a costeira agir mais rápido.",
"Transmitir PAN PAN com os dados do barco em perigo, para não causar alarme desnecessário.",
"Nada, pois só estações costeiras podem retransmitir pedidos de socorro."
],
"correta": 0,
"explicacao": "Sem resposta em cerca de 5 minutos, quem ouviu o socorro confirma ao barco em perigo que o recebeu e o retransmite com MAYDAY RELAY, o que deixa claro que quem fala não está em perigo e repete o socorro de outro. Transmitir MAYDAY como se o próprio barco estivesse em perigo declara um perigo que não existe e mobiliza o socorro sem necessidade. O PAN PAN rebaixa a gravidade de um incêndio. E qualquer estação pode (e deve) retransmitir quando ninguém atende; a ideia de que só costeira pode é falsa.",
"referencia": "UIT, RR, Art. 32 (retransmissão de mensagem de socorro, MAYDAY RELAY)",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0023",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 3,
"enunciado": "O veleiro “Maresia” transmitiu MAYDAY no canal 16 e você, no veleiro “Gaivota”, é a primeira estação a ouvir e vai prestar auxílio. Qual é o recibo correto?",
"alternativas": [
"MAYDAY Maresia, aqui é Gaivota, recebido MAYDAY.",
"MAYDAY RELAY Maresia, aqui é Gaivota, recebido MAYDAY.",
"Maresia, aqui é Gaivota, câmbio e desligo.",
"PAN PAN Maresia, aqui é Gaivota, estamos ouvindo, câmbio."
],
"correta": 0,
"explicacao": "O recibo repete o sinal de socorro, identifica o barco em perigo, diz “aqui é” com o nome de quem responde e fecha com “recebido MAYDAY”. O MAYDAY RELAY é para retransmitir o socorro a terceiros, e não para confirmar o recebimento. A resposta sem o sinal não tem a marca de socorro e “câmbio e desligo” é contraditório. E o PAN PAN rebaixaria a mensagem para urgência.",
"referencia": "UIT, RR, Art. 32 (recibo de mensagem de socorro por radiotelefonia)",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0024",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 3,
"enunciado": "Terminado o tráfego de socorro, o centro que coordenou a operação quer liberar o canal para uso normal. Que expressão deve usar?",
"alternativas": [
"SEELONCE MAYDAY, enviada por qualquer barco que tenha ouvido o socorro.",
"PAN PAN, PAN PAN, PAN PAN, a todas as estações, avisando que a urgência terminou.",
"SÉCURITÉ, SÉCURITÉ, SÉCURITÉ, a todas as estações, avisando que o canal foi liberado.",
"SEELONCE FEENEE (“silêncio terminado”), com a hora e o nome do barco em perigo."
],
"correta": 3,
"explicacao": "O fim do silêncio de rádio é dado por quem controla o tráfego de socorro, com SEELONCE FEENEE (silence fini), a hora e a identificação do barco que estava em perigo. SEELONCE MAYDAY (no material da Anatel, SILENCE MAYDAY) impõe o silêncio, ao contrário do que se quer aqui, e cabe a quem controla o socorro, não a qualquer barco que o ouça. PAN PAN e SÉCURITÉ são sinais de urgência e de segurança e não encerram o tráfego de socorro.",
"referencia": "UIT, RR, Art. 32 (silêncio de rádio e fim do tráfego de socorro); Anatel, Material de apoio, item 2.1.9.5 (SILENCE MAYDAY)",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0025",
"nivel": "radio",
"tema": "Procedimentos de socorro, urgência e segurança",
"dificuldade": 3,
"enunciado": "Qual das situações a seguir exige MAYDAY, e não PAN PAN?",
"alternativas": [
"Tripulante com corte profundo na mão, sangramento já controlado, que pede orientação médica.",
"Motor parado e sem vento, a 5 milhas de qualquer perigo, com fundeio possível, aguardando reboque.",
"Leme travado com mar calmo, dentro de uma baía, sem pedras nem tráfego por perto.",
"Tripulante inconsciente e sem respirar depois de ser tirado da água."
],
"correta": 3,
"explicacao": "MAYDAY é o sinal para perigo grave e iminente que requer auxílio imediato (Anatel, item 2.1.9.3). Pessoa sem respirar corre risco imediato de morte, mesmo sendo um caso médico. Corte com sangramento controlado e pedido de orientação é urgência (PAN PAN), assim como motor parado com fundeio possível e leme travado com mar calmo, sem perigo próximo.",
"referencia": "UIT, RR, Arts. 32 e 33; Anatel, Material de apoio, item 2.1.9.3",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0026",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 1,
"enunciado": "Qual palavra do alfabeto fonético da UIT representa a letra W?",
"alternativas": [
"Washington",
"William",
"X-ray",
"Whiskey"
],
"correta": 3,
"explicacao": "No Apêndice 14 do Regulamento de Radiocomunicações, W é “Whiskey”. “William” pertence a alfabetos antigos, “X-ray” é a letra X, vizinha de W, e “Washington” é um nome próprio que não consta da tabela.",
"referencia": "UIT, RR, Apêndice 14 (alfabeto de soletração); Anatel, Material de apoio, item 2.1.9.1",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0027",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 1,
"enunciado": "O nome do barco é LUA. Qual é a soletração correta, pelo alfabeto fonético da UIT?",
"alternativas": [
"Love, Uncle, Able.",
"Lima, Uruguai, Argentina.",
"Lima, Uniform, Alfa.",
"Lima, Uniform, Able."
],
"correta": 2,
"explicacao": "Pelo alfabeto da UIT, L é Lima, U é Uniform e A é Alfa. “Love, Uncle, Able” e “Lima, Uniform, Able” trazem palavras do alfabeto antigo, abandonado, em que o A era “Able”. “Lima, Uruguai, Argentina” usa nomes de países, que não fazem parte do alfabeto.",
"referencia": "UIT, RR, Apêndice 14 (alfabeto de soletração); Anatel, Material de apoio, item 2.1.9.1",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0028",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 1,
"enunciado": "Numa chamada de rotina, qual palavra de procedimento você diz ao terminar de falar para passar a vez à outra estação?",
"alternativas": [
"Desligo (OUT).",
"Câmbio (OVER).",
"Recebido (RECEIVED).",
"Repita (SAY AGAIN)."
],
"correta": 1,
"explicacao": "“Câmbio” (over) significa “terminei de falar, é a sua vez”. “Desligo” (out) encerra a conversa, sem esperar resposta. “Recebido” confirma que a mensagem foi ouvida e entendida. “Repita” pede que a outra estação diga de novo o que não foi compreendido.",
"referencia": "Rec. UIT-R M.1171 (palavras de procedimento OVER e OUT)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.1171"
},
{
"id": "radio-0029",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 2,
"enunciado": "Um tripulante encerra uma chamada dizendo “câmbio e desligo”. Por que essa expressão é desaconselhada?",
"alternativas": [
"Porque “desligo” só pode ser usado nos canais de socorro, urgência e segurança, nunca em rotina.",
"Porque “câmbio” só vale para chamadas feitas em canais de trabalho, e nunca no canal 16.",
"Porque as duas palavras não existem na fraseologia marítima.",
"Porque câmbio pede resposta e desligo encerra a conversa: as duas palavras se contradizem."
],
"correta": 3,
"explicacao": "“Câmbio” (over) passa a vez e espera resposta; “desligo” (out) diz que a conversa acabou e que não se espera resposta. Dizer as duas ao mesmo tempo se contradiz, e é isso que a torna desaconselhada. As outras respostas erram: “desligo” e “câmbio” podem ser usados em qualquer canal, de rotina ou não, e as duas palavras existem na fraseologia marítima.",
"referencia": "Rec. UIT-R M.1171 (palavras de procedimento OVER e OUT)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.1171"
},
{
"id": "radio-0030",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 2,
"enunciado": "Como se deve transmitir por rádio a latitude 23° 45,5′ S para reduzir o risco de erro de escuta?",
"alternativas": [
"Vinte e três graus, quarenta e cinco e meio, sul: números cheios, como se fala no dia a dia.",
"Dois três quatro cinco cinco sul: todos os algarismos juntos, sem dizer graus nem minutos.",
"Dois, três graus, quatro, cinco vírgula cinco minutos, sul: um algarismo de cada vez.",
"Vinte e três graus e meio, sul: a posição arredondada, para falar menos e ser mais rápido."
],
"correta": 2,
"explicacao": "Os algarismos são sinais: o material da Anatel (item 2.1.9.1) os trata como sinais representados por palavras, e a regra é dizê-los um a um, o que evita confundir números como quinze e cinquenta. Números cheios (“vinte e três graus, quarenta e cinco e meio”) abrem espaço para erro de escuta. Juntar todos os algarismos, sem graus nem minutos, deixa a sequência ambígua. E arredondar para 23 graus e meio muda a posição em cerca de 15 milhas, o que em socorro pode ser fatal.",
"referencia": "UIT, RR, Apêndice 14 (algarismos); Rec. UIT-R M.1171; Anatel, Material de apoio, item 2.1.9.1",
"fonte_url": "https://www.itu.int/rec/R-REC-M.1171"
},
{
"id": "radio-0031",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 2,
"enunciado": "O veleiro “Maresia” quer chamar o veleiro “Albatroz” no canal 16 e propor conversa no canal 72. Qual é a chamada de rotina correta?",
"alternativas": [
"Albatroz, Albatroz, Albatroz, aqui é Maresia, Maresia, Maresia, canal 72, câmbio.",
"Maresia, Maresia, Maresia, aqui é Albatroz, Albatroz, Albatroz, canal 72, câmbio.",
"Alô, Albatroz, aqui é o Maresia, está me ouvindo? Canal 72, câmbio e desligo.",
"Albatroz, Albatroz, Albatroz, aqui é Maresia, Maresia, Maresia, vamos conversar aqui mesmo, câmbio."
],
"correta": 0,
"explicacao": "A chamada de rotina traz o nome da estação chamada (até três vezes), “aqui é”, o nome de quem chama (até três vezes), o canal proposto e “câmbio”; o assunto segue no canal combinado, para deixar o 16 livre. A segunda inverte quem chama e quem é chamado. A terceira é informal e termina com “câmbio e desligo”. A quarta mantém a conversa no 16, que é só para chamar e para emergências.",
"referencia": "Rec. UIT-R M.1171 (procedimento de chamada em radiotelefonia)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.1171"
},
{
"id": "radio-0032",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 3,
"enunciado": "Um veleiro em Manaus (UTC−4 o ano todo) registra um problema às 20h15, hora local. Qual é a hora a informar, em UTC?",
"alternativas": [
"1615 UTC.",
"2315 UTC.",
"0015 UTC.",
"2415 UTC."
],
"correta": 2,
"explicacao": "Em UTC−4, soma-se 4 horas para chegar ao UTC: 20h15 + 4 h = 24h15, ou 0015 UTC do dia seguinte. A hora em UTC vai de 0000 a 2359 (Anatel, item 1.5), então 2415 não existe. 1615 resulta de subtrair as 4 horas em vez de somar. E 2315 vem de somar só 3 horas, como em Brasília.",
"referencia": "UIT-R M.1171; Anatel, Material de apoio, item 1.5 (hora UTC em quatro algarismos)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.1171"
},
{
"id": "radio-0033",
"nivel": "radio",
"tema": "Alfabeto fonético e fraseologia",
"dificuldade": 2,
"enunciado": "No código de algarismos da UIT (Apêndice 14 do Regulamento de Radiocomunicações), qual palavra representa o algarismo 9?",
"alternativas": [
"Niner",
"Nadazero",
"Novenine",
"Oktoeight"
],
"correta": 2,
"explicacao": "No código da UIT, o 9 é “Novenine”. “Niner” é a pronúncia usada na aviação, não no código do Regulamento de Radiocomunicações. “Nadazero” é o 0 e “Oktoeight” é o 8.",
"referencia": "UIT, RR, Apêndice 14 (código de algarismos e sinais); Anatel, Material de apoio, item 2.1.9.1 (tabela: 9 = NOVENINE)",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0034",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 2,
"enunciado": "Um veleiro de médio porte fará navegação oceânica. Pelas tabelas de rádio da NORMAM-211, a dotação dele é VHF com DSC, HF com DSC e EPIRB 406 MHz. O que a norma aceita no lugar do HF com DSC?",
"alternativas": [
"Um segundo VHF fixo com DSC, ligado ao GPS e com antena de emergência no mastro",
"Um VHF portátil com bateria para quatro horas, mantido sempre carregado a bordo",
"Telefone ou comunicador satelital que envie socorro, como Iridium ou Inmarsat",
"Um receptor NAVTEX em 518 kHz, que recebe avisos de segurança marítima em texto"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> um segundo VHF continua sendo rádio de visada e não oferece o alcance oceânico que o HF ou o satélite dão.</li><li><strong>B) Errada.</strong> o portátil serve para abandono ou falha do rádio principal; não cobre a distância de uma travessia.</li><li><strong>C) Correta.</strong> A NORMAM-211 admite telefone satelital (Iridium, Inmarsat) ou comunicador satelital (SPOT X, Iridium GO) que envie socorro no lugar do HF com DSC.</li><li><strong>D) Errada.</strong> o NAVTEX só recebe avisos; ele não transmite alerta nem faz chamada de socorro.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.24.2 a), nota (*)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0035",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 1,
"enunciado": "No GMDSS, a \"área marítima A1\" é definida por qual tipo de cobertura?",
"alternativas": [
"Alcance de VHF de pelo menos uma estação costeira com DSC, perto da costa",
"Alcance de MF de pelo menos uma estação costeira com DSC, além da cobertura de VHF",
"Cobertura de satélite geoestacionário Inmarsat, aproximadamente entre 70° N e 70° S",
"Regiões polares, onde não há cobertura dos satélites geoestacionários do Inmarsat"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> A1 é a área dentro do alcance de VHF com DSC de uma estação costeira, perto da costa.</li><li><strong>B) Errada.</strong> essa é a definição da área A2.</li><li><strong>C) Errada.</strong> essa é a definição da área A3, que começa onde acabam as áreas A1 e A2.</li><li><strong>D) Errada.</strong> essa é a definição da área A4.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV, Regra 2; Anatel, Material de apoio do exame de Radiotelefonista (áreas marítimas do GMDSS)",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0036",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 2,
"enunciado": "A figura mostra a posição de um veleiro em travessia. Ele está fora do alcance do VHF e do MF das estações costeiras, mas sob cobertura de satélite geoestacionário. Em que área marítima do GMDSS ele está, e como pode enviar o alerta de socorro?",
"alternativas": [
"Área A2; por MF com DSC, ouvido por uma estação costeira a poucas milhas da costa",
"Área A3; por HF com DSC ou por equipamento satelital, além da EPIRB 406 MHz",
"Área A1; por VHF no canal 70, ouvido por uma estação costeira próxima",
"Área A4; apenas pela EPIRB 406 MHz, porque nenhum outro meio funciona ali"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> A2 é o anel do MF, e o veleiro está além dele.</li><li><strong>B) Correta.</strong> fora de A1 e A2 e dentro da cobertura do Inmarsat, a área é A3; ali o alerta sai por HF com DSC ou por satélite.</li><li><strong>C) Errada.</strong> A1 é o anel mais interno, de alcance do VHF, e o barco está longe dele.</li><li><strong>D) Errada.</strong> A4 é a região polar, sem cobertura do Inmarsat, e não é o caso de um barco sob cobertura de satélite.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV, Regra 2 (áreas marítimas A1 a A4); NORMAM-211/DPC, art. 4.24.2 a)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 480 210\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Costa à esquerda, anel de alcance do VHF, anel de alcance do MF e, mais longe, um veleiro fora dos dois anéis\" font-family=\"sans-serif\"><rect width=\"480\" height=\"210\" fill=\"var(--sea-1)\"/><circle cx=\"40\" cy=\"105\" r=\"190\" fill=\"var(--sea-2)\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><circle cx=\"40\" cy=\"105\" r=\"95\" fill=\"var(--sea-3)\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><path d=\"M0 0H40Q56 40 36 80Q52 105 38 140Q56 175 40 210H0Z\" fill=\"var(--land)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"5\" y=\"108\" font-size=\"14\" fill=\"var(--ink)\">costa</text><text x=\"92\" y=\"100\" font-size=\"16\" font-weight=\"700\" text-anchor=\"middle\" fill=\"var(--ink)\">VHF</text><text x=\"92\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">com DSC</text><text x=\"182\" y=\"100\" font-size=\"16\" font-weight=\"700\" text-anchor=\"middle\" fill=\"var(--ink)\">MF</text><text x=\"182\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">com DSC</text><text x=\"355\" y=\"40\" font-size=\"16\" font-weight=\"700\" text-anchor=\"middle\" fill=\"var(--ink)\">satélite</text><text x=\"355\" y=\"60\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">geoestacionário</text><polygon points=\"355,112 343,138 367,138\" fill=\"var(--ink)\"/><line x1=\"355\" y1=\"112\" x2=\"355\" y2=\"146\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><text x=\"355\" y=\"168\" font-size=\"16\" font-weight=\"700\" text-anchor=\"middle\" fill=\"var(--ink)\">veleiro</text></svg>"
}
},
{
"id": "radio-0037",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 3,
"enunciado": "Um comandante no meio do Atlântico Sul quer falar por HF com uma estação costeira a cerca de 1.500 milhas, às 23 h, hora local. Qual escolha é mais coerente com a propagação do HF?",
"alternativas": [
"Uma frequência alta, como 22 MHz, pois à noite a ionosfera reflete melhor as ondas mais altas",
"A mesma frequência usada de dia, pois a propagação do HF não muda ao longo das 24 horas",
"O VHF no canal 16, pois à noite o alcance de visada do VHF cresce até milhares de milhas",
"Uma frequência baixa, como 4 ou 6 MHz, pois à noite as ondas baixas é que voltam melhor"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> é o contrário: as faixas altas funcionam de dia, e à noite tendem a atravessar a ionosfera.</li><li><strong>B) Errada.</strong> a propagação do HF muda com a ionização da atmosfera, por isso se troca de faixa entre dia e noite.</li><li><strong>C) Errada.</strong> o VHF é de visada e não alcança 1.500 milhas, de dia ou de noite.</li><li><strong>D) Correta.</strong> à noite a ionosfera perde ionização e as frequências altas atravessam a camada em vez de voltar; as baixas (4, 6, 8 MHz) refletem melhor.</li></ul>",
"referencia": "UIT-R, Recomendação P.533 (propagação em HF); Anatel, Material de apoio do exame de Radiotelefonista",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0038",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 1,
"enunciado": "Pela NORMAM-211, qual frequência de HF o transceptor usa para chamada e escuta no Atlântico Sul?",
"alternativas": [
"518 kHz",
"156,8 MHz",
"4.125 kHz",
"406 MHz"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> é a frequência do NAVTEX, que só recebe avisos de segurança.</li><li><strong>B) Errada.</strong> é o canal 16 do VHF, de visada, e não é uma frequência de HF.</li><li><strong>C) Correta.</strong> a norma indica a frequência internacional de socorro ou 4.125 kHz para chamada e escuta no Atlântico Sul.</li><li><strong>D) Errada.</strong> é a frequência da EPIRB via satélite, não de chamada de voz em HF.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.4 b)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0039",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 2,
"enunciado": "A 600 milhas da costa, o comandante quer receber avisos de segurança marítima e boletins de previsão pelo GMDSS. Qual equipamento dá essa cobertura de alto-mar?",
"alternativas": [
"Terminal Inmarsat-C com SafetyNET, que recebe avisos por satélite fora do alcance do NAVTEX",
"Receptor NAVTEX em 518 kHz, cujo alcance de várias centenas de milhas cobre todo o Atlântico Sul",
"VHF com DSC no canal 70, que recebe os avisos de segurança de qualquer estação do mundo",
"EPIRB 406 MHz, que além do alerta de socorro recebe os boletins meteorológicos da Marinha"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> o SafetyNET difunde avisos de segurança marítima por satélite (Inmarsat-C, chamada ampliada de grupo) e alcança o alto-mar, onde o NAVTEX não chega.</li><li><strong>B) Errada.</strong> o NAVTEX tem alcance de algumas centenas de milhas a partir de cada estação costeira; no meio do oceano não há sinal.</li><li><strong>C) Errada.</strong> o canal 70 só leva chamadas DSC curtas, e o VHF é de visada, sem alcance a 600 milhas.</li><li><strong>D) Errada.</strong> a EPIRB só transmite o alerta; ela não recebe avisos nem boletins.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV, Regra 7; IMO, Manual Internacional do SafetyNET",
"fonte_url": "https://www.imo.org/en/OurWork/Safety/Pages/GMDSS.aspx"
},
{
"id": "radio-0040",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 3,
"enunciado": "O GMDSS exige que um navio sujeito à SOLAS consiga transmitir o alerta de socorro navio-terra por pelo menos dois meios separados e independentes. Qual dupla atende a essa ideia?",
"alternativas": [
"VHF fixo com DSC e VHF portátil com DSC, ambos operando no canal 70 do VHF",
"VHF com DSC e EPIRB 406 MHz, de serviços de radiocomunicação diferentes",
"HF com DSC e um segundo HF com DSC em outra frequência, ligados à mesma antena",
"VHF fixo no canal 16 e VHF portátil no canal 16, com baterias independentes"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> os dois usam o mesmo serviço e a mesma frequência, por isso não são independentes.</li><li><strong>B) Correta.</strong> a SOLAS pede dois meios separados e independentes, cada um em um serviço de radiocomunicação diferente: VHF DSC (terrestre) e EPIRB (satélite) cumprem isso.</li><li><strong>C) Errada.</strong> continuam sendo o mesmo serviço, e a antena comum é um ponto único de falha.</li><li><strong>D) Errada.</strong> baterias separadas não bastam: os dois seguem no mesmo serviço e alcance de visada.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV, Regra 4 (requisitos funcionais: alerta de socorro navio-terra por dois meios separados e independentes, cada um em um serviço de radiocomunicação diferente)",
"fonte_url": "https://www.imo.org/en/OurWork/Safety/Pages/GMDSS.aspx"
},
{
"id": "radio-0041",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 3,
"enunciado": "No GMDSS, o alerta de socorro DSC usa frequências próprias. Qual é a frequência de socorro DSC em MF?",
"alternativas": [
"2.187,5 kHz",
"2.182 kHz",
"156,525 MHz",
"518 kHz"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> a frequência de socorro DSC em MF é 2.187,5 kHz; a de socorro por voz em MF é 2.182 kHz.</li><li><strong>B) Errada.</strong> é a frequência de socorro por voz em MF (radiotelefonia), não a do DSC.</li><li><strong>C) Errada.</strong> é o canal 70 do VHF, frequência de socorro DSC em VHF, e não está em MF.</li><li><strong>D) Errada.</strong> é a frequência do NAVTEX, que só serve para receber avisos.</li></ul>",
"referencia": "UIT, Regulamento de Radiocomunicações, Art. 31 e Apêndice 15",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "radio-0042",
"nivel": "radio",
"tema": "GMDSS, HF e satélite",
"dificuldade": 1,
"enunciado": "Qual é a função do NAVTEX a bordo de um veleiro oceânico?",
"alternativas": [
"Transmitir o alerta de socorro por voz a um centro de salvamento, usando a faixa de MF",
"Substituir o VHF nas chamadas de rotina entre navios que estejam dentro da área de visada",
"Detectar balizas de 406 MHz próximas e mostrar a direção delas em uma tela de bordo",
"Receber avisos de segurança marítima em texto, em 518 kHz, e mostrá-los ou imprimi-los"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> o NAVTEX só recebe; o alerta de socorro sai por DSC, EPIRB ou satélite.</li><li><strong>B) Errada.</strong> o NAVTEX não faz chamadas e não permite conversa entre navios.</li><li><strong>C) Errada.</strong> detectar balizas é função de equipamentos de busca, e o NAVTEX não opera em 406 MHz.</li><li><strong>D) Correta.</strong> o NAVTEX é um receptor de avisos náuticos e meteorológicos em texto, em 518 kHz.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV, Regra 7; Anatel, Material de apoio do exame de Radiotelefonista (NAVTEX)",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6"
},
{
"id": "radio-0043",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 1,
"enunciado": "Em que frequência a EPIRB exigida pela NORMAM-211 transmite o sinal de socorro via satélite?",
"alternativas": [
"121,5 MHz",
"406 MHz",
"156,8 MHz",
"9 GHz"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> o Cospas-Sarsat deixou de processar esse sinal em fevereiro de 2009; hoje o 121,5 MHz serve só para a aproximação final da equipe de resgate.</li><li><strong>B) Correta.</strong> a NORMAM-211 exige 406 MHz via satélite; o Cospas-Sarsat não processa mais 121,5 MHz desde fevereiro de 2009.</li><li><strong>C) Errada.</strong> é o canal 16 do VHF, usado em voz, e não é frequência de baliza por satélite.</li><li><strong>D) Errada.</strong> é a banda do radar e do SART, não a da EPIRB.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0044",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 1,
"enunciado": "O veleiro afunda em poucos segundos e ninguém consegue chegar à EPIRB. Qual característica da EPIRB exigida pela NORMAM-211 garante o alerta mesmo assim?",
"alternativas": [
"Ativação manual, feita pelo comandante na chave do suporte",
"Registro no INFOSAR, que faz o BRMCC acionar a baliza à distância",
"Liberação, flutuação e ativação automáticas no naufrágio",
"Transmissão extra em 121,5 MHz, que o satélite detecta quando o barco afunda"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> a ativação manual também é exigida, mas depende de alguém chegar à baliza, o que não ocorre neste cenário.</li><li><strong>B) Errada.</strong> o INFOSAR é só um cadastro; ele não aciona a baliza.</li><li><strong>C) Correta.</strong> a norma exige EPIRB de tipo aprovado com liberação, flutuação e ativação automáticas, além da ativação manual.</li><li><strong>D) Errada.</strong> o COSPAS-SARSAT não processa 121,5 MHz desde 2009, e isso nada tem a ver com o afundamento.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 a) e b)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0045",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 2,
"enunciado": "Você vendeu o veleiro e a EPIRB 406 MHz ficou a bordo. O que a NORMAM-211 espera quanto ao cadastro dela?",
"alternativas": [
"Que nada mude, porque o cadastro vale para o equipamento e não depende de quem é o dono dele",
"Que a Anatel receba o novo dono e repasse a mudança ao Cospas-Sarsat e à Capitania dos Portos",
"Que o cadastro seja cancelado e só refeito na próxima inspeção naval do veleiro",
"Que os dados sejam atualizados no INFOSAR, com dono, endereço e telefones"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> o cadastro identifica quem avisar; sem atualização, o resgate procura o antigo dono.</li><li><strong>B) Errada.</strong> o cadastro da EPIRB é feito no INFOSAR, do DECEA, e não pela Anatel.</li><li><strong>C) Errada.</strong> o cadastro não é cancelado e refeito na inspeção; a norma exige o registro atualizado, e a inspeção só confere isso.</li><li><strong>D) Correta.</strong> a norma exige cadastro de toda EPIRB no INFOSAR e a atualização quando muda o proprietário, o endereço ou os telefones.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 e) e f)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0046",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 1,
"enunciado": "Um alerta de baliza 406 MHz que não está registrada no INFOSAR chega ao BRMCC. O que acontece?",
"alternativas": [
"É recebido e tratado como emergência, mesmo sem o registro",
"É descartado até que o proprietário regularize o cadastro no INFOSAR",
"É tratado como alarme falso e só investigado por telefone",
"É enviado só à Anatel, que multa o dono antes de acionar qualquer busca"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> o alerta de baliza não registrada também é recebido pelo BRMCC e tratado como emergência; o registro apenas ajuda a identificar e a contatar o dono.</li><li><strong>B) Errada.</strong> nenhum alerta de socorro é descartado por falta de cadastro.</li><li><strong>C) Errada.</strong> sem cadastro não há telefone para ligar, e o alerta segue como emergência.</li><li><strong>D) Errada.</strong> a Anatel não é o destino do alerta, e a multa não vem antes do socorro.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 e); DECEA, Central de Ajuda (sinal de baliza 406 MHz não registrada no INFOSAR)",
"fonte_url": "https://ajuda.decea.mil.br/base-de-conhecimento/no-caso-do-recebimento-do-sinal-de-emergencia-de-uma-baliza-406mhz-que-nao-esteja-registada-no-infosar-as-autoridades-de-resgate-irao-fazer-a-operacao-de-busca/"
},
{
"id": "radio-0047",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 2,
"enunciado": "Um comandante compra um PLB 406 MHz para uso pessoal. Segundo o BRMCC, com que dado o PLB é codificado e quem normalmente faz isso?",
"alternativas": [
"Com o MMSI do barco, o mesmo número programado no rádio DSC da embarcação",
"Com o número de série, normalmente pelo fabricante ou pelo revendedor",
"Com o indicativo de chamada, gravado pela Anatel ao emitir a licença",
"Com o CPF do dono, digitado pelo próprio usuário no menu do aparelho"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> o MMSI é opção da EPIRB do barco; o PLB é pessoal e usa o número de série.</li><li><strong>B) Correta.</strong> o PLB usa o número de série, e a codificação costuma ser feita pelo fabricante ou revendedor (a EPIRB de embarcação não SOLAS pode usar o MMSI ou o número de série).</li><li><strong>C) Errada.</strong> a Anatel não codifica balizas, e o indicativo de chamada não é o código da baliza.</li><li><strong>D) Errada.</strong> o CPF não é código de baliza; o usuário informa o código hexadecimal no cadastro do INFOSAR.</li></ul>",
"referencia": "BRMCC (FAB), Codificação de balizas",
"fonte_url": "https://www2.fab.mil.br/brmcc/index.php/codificacao"
},
{
"id": "radio-0048",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 2,
"enunciado": "Uma EPIRB 406 MHz ativada transmite um sinal curto a cada 50 segundos, aproximadamente. Quantas transmissões ela faz em 1 hora de funcionamento?",
"alternativas": [
"Cerca de 50",
"Cerca de 120",
"Cerca de 72",
"Cerca de 60"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> é o intervalo em segundos, e não a contagem; 50 transmissões seriam um intervalo de 72 s.</li><li><strong>B) Errada.</strong> 120 seria o resultado se o intervalo fosse de 30 s, e não de 50 s.</li><li><strong>C) Correta.</strong> 1 hora tem 3.600 s; 3.600 ÷ 50 = 72 transmissões.</li><li><strong>D) Errada.</strong> 60 seria o resultado de um sinal por minuto, e a EPIRB repete a cada 50 s.</li></ul>",
"referencia": "Cospas-Sarsat, Especificação C/S T.001 (repetição de cerca de 50 s)",
"fonte_url": "https://www.cospas-sarsat.int/"
},
{
"id": "radio-0049",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 2,
"enunciado": "A figura mostra a tela do radar de 9 GHz de um barco de busca, que está no centro. Aparece uma linha de 12 pontos alinhados. O que ela indica?",
"alternativas": [
"A costa e ilhas distantes, que o radar de 9 GHz mostra como pontos alinhados",
"Um SART ativado; ele fica na ponta da linha mais próxima do centro",
"Interferência de outro radar, que aparece sempre como 12 pontos em linha",
"O sinal de uma EPIRB 406 MHz, que o radar detecta como uma linha de pontos"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> costa e ilhas aparecem como ecos contínuos de forma irregular, não como 12 pontos regulares.</li><li><strong>B) Correta.</strong> o SART responde ao radar de 9 GHz e faz surgir uma linha de 12 pontos; ele fica na ponta mais perto do barco de busca, e a linha se estende para além dele.</li><li><strong>C) Errada.</strong> a interferência de radar costuma formar espirais ou raios, e não uma linha de 12 pontos regulares.</li><li><strong>D) Errada.</strong> o radar de 9 GHz não detecta a EPIRB; a EPIRB fala com satélites em 406 MHz.</li></ul>",
"referencia": "SOLAS 1974, Cap. IV; IMO, Resolução A.802(19) (SART de 9 GHz); Anatel, Material de apoio do exame de Radiotelefonista",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6",
"figura": {
"svg": "<svg viewBox=\"0 0 300 250\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Tela de radar de 9 GHz com uma linha de 12 pontos saindo do centro para o canto superior direito\" font-family=\"sans-serif\"><circle cx=\"150\" cy=\"125\" r=\"108\" fill=\"var(--sea-1)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><circle cx=\"150\" cy=\"125\" r=\"72\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1\" stroke-dasharray=\"3 5\"/><circle cx=\"150\" cy=\"125\" r=\"36\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1\" stroke-dasharray=\"3 5\"/><circle cx=\"166.9\" cy=\"110.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"172.2\" cy=\"106.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"177.6\" cy=\"101.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"182.9\" cy=\"97.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"188.3\" cy=\"92.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"193.7\" cy=\"88.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"199.0\" cy=\"83.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"204.4\" cy=\"79.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"209.8\" cy=\"74.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"215.1\" cy=\"70.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"220.5\" cy=\"65.9\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"225.8\" cy=\"61.4\" r=\"2.8\" fill=\"var(--ink)\"/><circle cx=\"150\" cy=\"125\" r=\"4.5\" fill=\"var(--ink)\"/><text x=\"150\" y=\"150\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">seu barco</text><text x=\"150\" y=\"243\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">tela do radar de 9 GHz</text></svg>"
}
},
{
"id": "radio-0050",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 3,
"enunciado": "No plotter aparece um alvo AIS parado, em mar aberto, sem nome e com MMSI 970 123456. O que ele é mais provavelmente?",
"alternativas": [
"Um AIS-MOB de colete salva-vidas, que usa MMSI iniciado por 970 e indica pessoa na água",
"Uma EPIRB com transmissor AIS de localização, cujo MMSI de AIS começa por 970",
"Uma estação costeira de AIS, cujo MMSI começa por 970 seguido do código do país",
"Um AIS-SART ativado, de embarcação de sobrevivência, que exige resposta como socorro"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> o AIS de homem ao mar usa o prefixo 972.</li><li><strong>B) Errada.</strong> a EPIRB com transmissor AIS usa o prefixo 974.</li><li><strong>C) Errada.</strong> a estação costeira usa 00 mais o código do país (no Brasil, 00 710), e não 970.</li><li><strong>D) Correta.</strong> o prefixo 970 identifica o AIS-SART, baliza de sobrevivência; o alvo sem nome e parado em mar aberto pede resposta como socorro.</li></ul>",
"referencia": "UIT-R M.585 (MMSI 970 para AIS-SART, 972 para AIS-MOB e 974 para EPIRB-AIS)",
"fonte_url": "https://www.itu.int/rec/R-REC-M.585/en"
},
{
"id": "radio-0051",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 3,
"enunciado": "Muitos velejadores oceânicos levam um AIS-MOB no colete salva-vidas. Por que ele não substitui um PLB 406 MHz?",
"alternativas": [
"O sinal AIS é de VHF e só chega a barcos próximos; o PLB alerta por satélite",
"O AIS-MOB não informa posição, só liga um alarme sonoro no painel do barco",
"O PLB usa AIS e por isso alcança mais longe que o AIS-MOB, que usa só VHF",
"O AIS-MOB só funciona fora da água, ao contrário do PLB, que transmite na água"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> o AIS-MOB alerta quem está ao alcance de visada do VHF, em geral poucas milhas; o PLB leva o alerta por satélite ao BRMCC, de qualquer ponto do oceano.</li><li><strong>B) Errada.</strong> o AIS-MOB transmite a posição do náufrago, que aparece no plotter e nos receptores AIS próximos.</li><li><strong>C) Errada.</strong> o PLB não usa AIS: transmite em 406 MHz para satélites Cospas-Sarsat.</li><li><strong>D) Errada.</strong> o AIS-MOB é um transmissor pessoal que dispara ao inflar o colete ou à mão, e funciona na água; seu alcance curto é o limite dele.</li></ul>",
"referencia": "UIT-R M.585 (MMSI 972 para AIS de homem ao mar); NORMAM-211/DPC, art. 4.23.6 (balizas 406 MHz); Cospas-Sarsat",
"fonte_url": "https://www.itu.int/rec/R-REC-M.585/en"
},
{
"id": "radio-0052",
"nivel": "radio",
"tema": "EPIRB, PLB, SART e AIS-MOB",
"dificuldade": 2,
"enunciado": "Qual é a sequência correta do alerta de uma EPIRB 406 MHz até o salvamento, no Brasil?",
"alternativas": [
"EPIRB, satélite, Anatel, que aciona o SALVAMAR e a Capitania dos Portos mais próxima",
"EPIRB, estação costeira de VHF, Capitania dos Portos e, por fim, o BRMCC e o SALVAMAR",
"EPIRB, satélite Cospas-Sarsat, estação terrena, BRMCC e, por fim, SALVAERO e SALVAMAR",
"EPIRB, satélite, INFOSAR, que aciona em seguida o SALVAERO e o SALVAMAR da região"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> a Anatel regula as telecomunicações e não recebe nem repassa alertas de socorro das balizas.</li><li><strong>B) Errada.</strong> a EPIRB transmite para satélite, e não para estação de VHF; o BRMCC é quem recebe o alerta.</li><li><strong>C) Correta.</strong> o satélite capta o sinal, a estação terrena o encaminha ao centro de controle de missão (BRMCC), que aciona o SALVAERO e o SALVAMAR.</li><li><strong>D) Errada.</strong> o INFOSAR é o cadastro das balizas e não aciona busca; quem aciona é o BRMCC.</li></ul>",
"referencia": "DECEA, INFOSAR (bloco 'Emergência': o BRMCC recebe o alerta e aciona SALVAERO e SALVAMAR); Cospas-Sarsat, descrição do sistema (satélite, estação terrena, centro de controle de missão)",
"fonte_url": "https://infosar.decea.mil.br/"
},
{
"id": "radio-0053",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 1,
"enunciado": "Um velejador tem apenas o Certificado de Operador de Rádio Restrito (ORR), emitido pela Anatel. Onde esse certificado permite operar estações?",
"alternativas": [
"Em quaisquer águas do mundo, pois o certificado da Anatel é reconhecido pela UIT",
"Somente no território, nas águas e no espaço aéreo nacionais, e não no exterior",
"Apenas em rios e lagos, pois o mar exige o certificado de Radiotelegrafista da Marinha",
"Em águas nacionais e nas do Mercosul, por acordo firmado entre os países-membros"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> o ORR é limitado ao território e às águas nacionais, e não vale em qualquer água do mundo.</li><li><strong>B) Correta.</strong> pelo Ato Anatel nº 3449/2026, o ORR só pode operar estações no território, nas águas e no espaço aéreo nacionais.</li><li><strong>C) Errada.</strong> o ORR vale também nas águas marítimas nacionais, e o Radiotelegrafista é outra categoria.</li><li><strong>D) Errada.</strong> o ato não prevê extensão ao Mercosul; o limite é o território e as águas nacionais.</li></ul>",
"referencia": "Anatel, Ato nº 3449/2026, Anexo (Categorias de Operadores)",
"fonte_url": "https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista"
},
{
"id": "radio-0054",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 3,
"enunciado": "Uma candidata ao Operador de Rádio Geral (ORG) fez as três matérias da categoria e acertou 7 questões em Idioma, 4 em Operação de rádio II e 6 em Legislação de radiocomunicações II, de 10 cada. Qual é a situação dela?",
"alternativas": [
"Aprovada, porque somou 17 acertos em 30 questões, mais da metade do total da prova",
"Reprovada nas três matérias, que ela deve refazer todas após um bloqueio de 30 dias",
"Reprovada só em Operação de rádio II, que refaz após 8 dias; as outras duas valem 12 meses",
"Reprovada só em Operação de rádio II, que ela pode refazer no dia seguinte, sem espera"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> o mínimo é de 5 acertos em cada matéria, e não na soma; com 4 acertos, Operação II não foi atingida.</li><li><strong>B) Errada.</strong> a aprovação em cada matéria é independente e vale 12 meses; 30 dias é o bloqueio por faltar sem justificativa.</li><li><strong>C) Correta.</strong> cada matéria exige no mínimo 5 acertos de 10; ela passou em Idioma e Legislação II, cujas aprovações valem 12 meses, e deve repetir Operação II com a carência de 8 dias.</li><li><strong>D) Errada.</strong> a nova tentativa exige carência mínima de 8 dias, e não de 1 dia.</li></ul>",
"referencia": "Anatel, Ato nº 3449/2026, Anexo (tabela de matérias) e \"Exames de Qualificação\"",
"fonte_url": "https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista"
},
{
"id": "radio-0055",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 1,
"enunciado": "Na prova online de Operador Radiotelefonista da Anatel, qual item NÃO é permitido?",
"alternativas": [
"Fones de ouvido",
"Câmera móvel",
"Microfone",
"Microsoft Teams"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> a Anatel exige computador com navegador, câmera móvel, microfone e Microsoft Teams, e não permite fones de ouvido.</li><li><strong>B) Errada.</strong> ela é exigida pela Anatel para a prova.</li><li><strong>C) Errada.</strong> ele é exigido para a prova.</li><li><strong>D) Errada.</strong> a prova é feita por videoconferência no Teams, que precisa estar instalado.</li></ul>",
"referencia": "Anatel, Prova Online: Manual de Instruções do Candidato (v. 2026-04.1), item 1",
"fonte_url": "https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista"
},
{
"id": "radio-0056",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 1,
"enunciado": "Qual documento da Anatel licencia o próprio equipamento de rádio de uma embarcação, segundo a NORMAM-211?",
"alternativas": [
"O Certificado de Operador Radiotelefonista",
"A Carteira de Habilitação de Amador (CHA)",
"O Certificado de Registro do INFOSAR",
"A Licença de Estação de Navio"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> ele habilita a pessoa que opera o rádio, e não licencia a estação do barco.</li><li><strong>B) Errada.</strong> a CHA habilita o condutor da embarcação, e não o rádio.</li><li><strong>C) Errada.</strong> o INFOSAR cadastra as balizas de 406 MHz, e não licencia a estação de rádio.</li><li><strong>D) Correta.</strong> a NORMAM-211 manda que a embarcação com equipamento de radiocomunicação obtenha a Licença de Estação de Navio na Anatel.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.8",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0057",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 2,
"enunciado": "Sobre o prazo de validade de uma licença de estação emitida pelo módulo MMAR, da Anatel, qual afirmação é correta?",
"alternativas": [
"Vale 5 anos, renovável pelo aplicativo Gov.Br após o pagamento de uma taxa",
"Tem prazo indeterminado, exceto a licença de \"Embarcação em Teste\"",
"Vale 10 anos, como a habilitação do condutor, e é renovada junto com ela",
"Vale 1 ano e se renova a cada ano com o pagamento de uma GRU"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> o tutorial não prevê validade de 5 anos; as licenças comuns têm prazo indeterminado.</li><li><strong>B) Correta.</strong> segundo o tutorial do MMAR, as licenças geradas pelo módulo têm prazo indeterminado, exceto as de \"Embarcação em Teste\".</li><li><strong>C) Errada.</strong> a licença da estação e a habilitação do condutor são documentos diferentes, e a licença não acompanha o prazo da CHA.</li><li><strong>D) Errada.</strong> o tutorial fixa prazo indeterminado, e não validade de 1 ano com renovação anual.</li></ul>",
"referencia": "Anatel, Tutorial do MMAR (campo \"Validade da Licença\")",
"fonte_url": "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a"
},
{
"id": "radio-0058",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 2,
"enunciado": "Ao licenciar o veleiro no MMAR, o sistema pede o número de MMSI da estação. O que a regulamentação da Anatel exige quanto a esse número?",
"alternativas": [
"Que cada rádio, fixo ou portátil, receba um MMSI diferente escolhido pelo fabricante do aparelho",
"Que seja igual ao número de inscrição da embarcação na Capitania dos Portos de registro",
"Que seja programado em todos os equipamentos da estação com essa função, como o rádio DSC",
"Que seja gravado só no HF, pois o VHF se identifica pelo nome do barco no canal 16"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> a estação tem um único MMSI, programado nos equipamentos com essa função, e não um número diferente para cada aparelho.</li><li><strong>B) Errada.</strong> o MMSI tem 9 dígitos, com o código 710 do Brasil, e não é o número de inscrição.</li><li><strong>C) Correta.</strong> o RGST exige MMSI para estações que participam do GMDSS e manda programá-lo em todos os equipamentos da estação com essa função; é o número que o socorro usa para saber de quem é o barco.</li><li><strong>D) Errada.</strong> o DSC do VHF depende do MMSI; sem ele o botão de socorro não envia alerta útil.</li></ul>",
"referencia": "Anatel, RGST (Resolução nº 777/2025), art. 270; NORMAM-211/DPC, art. 4.23.6 d)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0059",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 3,
"enunciado": "Um brasileiro faz o curso RYA SRC no Reino Unido e passa a usar o certificado no rádio de seu veleiro de bandeira brasileira. Isso basta?",
"alternativas": [
"Não: segundo o RYA, o SRC vale só em barco britânico; no Brasil vale o certificado da Anatel",
"Sim, porque o SRC segue o padrão CEPT e vale em barcos de qualquer bandeira do mundo",
"Sim, mas apenas para VHF, desde que o certificado seja traduzido e autenticado antes",
"Sim, porque o Brasil e o Reino Unido aceitam os certificados de rádio um do outro"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> o RYA informa que a \"Authority to Operate\" britânica restringe o SRC a embarcações do Reino Unido, e o operador precisa de certificado emitido ou reconhecido pelo governo ao qual a estação está sujeita (no caso, o Brasil).</li><li><strong>B) Errada.</strong> o procedimento é harmonizado pela CEPT, mas a validade do SRC fica restrita aos barcos do Reino Unido.</li><li><strong>C) Errada.</strong> tradução e autenticação não mudam a restrição: o SRC é um certificado britânico.</li><li><strong>D) Errada.</strong> o RYA diz que o SRC vale só em barco britânico, e não prevê reconhecimento automático por outro país.</li></ul>",
"referencia": "RYA, Licensing onboard electronics (\"Using the SRC abroad\"); Anatel, RGST, art. 271",
"fonte_url": "https://www.rya.org.uk/regulations/licensing-onboard-electronics/"
},
{
"id": "radio-0060",
"nivel": "radio",
"tema": "Licenças e certificados",
"dificuldade": 2,
"enunciado": "Uma velejadora tem o Curso Especial de Radioperador Geral (EROG), emitido por uma Capitania dos Portos. O que o Ato Anatel nº 3449/2026 prevê para ela no exame de radiotelefonista?",
"alternativas": [
"Fica isenta só de Idioma e faz as provas de Operação de rádio e Legislação",
"Faz apenas a prova de Operação de rádio II, por ser a mais técnica das três",
"Não tem isenção, porque o curso da Marinha não vale para a Anatel",
"Fica isenta de todos os testes, desde que comprove o curso à Anatel"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> a isenção não é parcial: o ato fala em isenção de todos os testes.</li><li><strong>B) Errada.</strong> o ato não separa uma matéria para o portador do EROG; a isenção cobre todas.</li><li><strong>C) Errada.</strong> o ato reconhece expressamente o EROG, curso da Marinha, como motivo de isenção.</li><li><strong>D) Correta.</strong> o ato isenta de todos os testes quem comprova certos cursos da Marinha, entre eles o EROG emitido pela Capitania dos Portos.</li></ul>",
"referencia": "Anatel, Ato nº 3449/2026, Anexo, item 4.10 (isenção de todos os testes)",
"fonte_url": "https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista"
},
{
"id": "radio-0061",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 2,
"enunciado": "Em uma regata OSR Categoria 1 com 12 tripulantes, quantos precisam ter o treinamento de sobrevivência da OSR 6.02 nos 5 anos anteriores à largada, incluindo o comandante?",
"alternativas": [
"No mínimo 2",
"No mínimo 4",
"No mínimo 3",
"Todos os 12"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> 2 é o piso da regra, mas 30% de 12 dá 3,6, e o resultado é maior que o piso.</li><li><strong>B) Correta.</strong> a OSR 6.01.2 pede pelo menos 30% da tripulação, nunca menos de dois, incluindo o responsável: 30% de 12 = 3,6, o que exige 4 pessoas.</li><li><strong>C) Errada.</strong> 3 é 25% da tripulação, abaixo dos 30% exigidos; não existe 0,6 de tripulante.</li><li><strong>D) Errada.</strong> a exigência para todos vale na Categoria 0; nas Categorias 1 e 2 são 30%.</li></ul>",
"referencia": "World Sailing, Offshore Special Regulations 2026-2027 v1, regra 6.01.2 (p. 39)",
"fonte_url": "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf"
},
{
"id": "radio-0062",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 2,
"enunciado": "O certificado de Offshore Personal Survival de um comandante venceu há 18 meses. O que a OSR 6.01.5 permite?",
"alternativas": [
"Nada: depois de vencido é preciso refazer o curso completo de dois dias",
"A reciclagem só vale se o vencimento ocorreu há no máximo 6 meses da largada",
"Renovar por exame escrito on-line, sem prática, em qualquer prazo depois do vencimento",
"Renová-lo com um curso de reciclagem, pois o prazo é de até 2 anos após o vencimento"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> a regra tem tolerância de 2 anos justamente para permitir a reciclagem.</li><li><strong>B) Errada.</strong> o prazo da regra é de 2 anos, e não de 6 meses.</li><li><strong>C) Errada.</strong> a reciclagem tem prática na água e prova escrita, e o prazo máximo é de 2 anos.</li><li><strong>D) Correta.</strong> a reciclagem é aceita se feita até 2 anos depois do vencimento; com 18 meses, ele ainda está dentro do prazo.</li></ul>",
"referencia": "World Sailing, Offshore Special Regulations 2026-2027, regra 6.01.5",
"fonte_url": "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf"
},
{
"id": "radio-0063",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 2,
"enunciado": "Um tripulante concluiu o curso Offshore Personal Survival em 12/03/2022. A regata de Categoria 0 larga em 20/02/2027. Pela OSR 6.01.1, o treinamento está dentro do prazo?",
"alternativas": [
"Sim: a largada ocorre pouco menos de 5 anos depois do curso",
"Não: o prazo é contado até a chegada, e a regata dura várias semanas",
"Não: o certificado vale 3 anos e a reciclagem seria obrigatória",
"Sim, mas só se ele fizer antes o curso de reciclagem de 8 horas"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> a OSR 6.01.1 pede o treinamento nos 5 anos anteriores à largada; de 12/03/2022 a 20/02/2027 faltam 20 dias para completar 5 anos.</li><li><strong>B) Errada.</strong> a regra conta até a largada, e não até a chegada.</li><li><strong>C) Errada.</strong> o certificado vale 5 anos.</li><li><strong>D) Errada.</strong> a reciclagem é para certificados vencidos, e o dele ainda vale.</li></ul>",
"referencia": "World Sailing, Offshore Special Regulations 2026-2027, regras 6.01.1 e Apêndice G",
"fonte_url": "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf"
},
{
"id": "radio-0064",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 2,
"enunciado": "Para a OSR 6.05.2, qual treinamento STCW de primeiros socorros é aceito como certificado, além dos cursos listados pela World Sailing?",
"alternativas": [
"Somente o A-VI/4-2 (Proficiency in Medical Care)",
"Qualquer curso civil de primeiros socorros que tenha pelo menos 4 horas de aula",
"A-VI/1-3 (Elementary First Aid) ou outro nível STCW superior a ele",
"Apenas o CPSO, curso da DPC com 52 horas"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> o A-VI/4-2 é exigido na Categoria 0 como um dos dois tripulantes, mas não é o único aceito.</li><li><strong>B) Errada.</strong> a regra não aceita qualquer curso: pede curso listado pela World Sailing ou STCW.</li><li><strong>C) Correta.</strong> a OSR 6.05.2 aceita um curso reconhecido pela federação nacional ou treinamento STCW A-VI/1-3 ou superior.</li><li><strong>D) Errada.</strong> o CPSO segue o nível A-VI/4, superior ao A-VI/1-3, mas o \"apenas\" deixa de fora o A-VI/1-3.</li></ul>",
"referencia": "World Sailing, Offshore Special Regulations 2026-2027, regra 6.05.2",
"fonte_url": "https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf"
},
{
"id": "radio-0065",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 2,
"enunciado": "Por que a World Sailing recomenda não aceitar um curso STCW de sobrevivência no mar (como o CBSN) no lugar do Offshore Personal Survival?",
"alternativas": [
"Porque os cursos STCW não tratam de colete salva-vidas nem de embarcações de sobrevivência",
"Porque esses cursos não cobrem itens de vela e equipamentos de recreio",
"Porque o certificado STCW vale só 1 ano, contra 5 anos do Offshore Personal Survival",
"Porque só cursos dados em inglês são aceitos pelas regras de regata"
],
"correta": 1,
"explicacao": "<ul><li><strong>A) Errada.</strong> as tabelas STCW incluem colete e embarcações de sobrevivência; o problema é o conteúdo específico de vela.</li><li><strong>B) Correta.</strong> a World Sailing considera que os cursos STCW de sobrevivência não tratam de itens de vela e de equipamentos de recreio.</li><li><strong>C) Errada.</strong> o CBSN, por exemplo, tem certificado de 5 anos.</li><li><strong>D) Errada.</strong> a OSR não impõe idioma; o motivo é o conteúdo do curso.</li></ul>",
"referencia": "World Sailing, Offshore Personal Survival (seção \"STCW Courses\")",
"fonte_url": "https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/"
},
{
"id": "radio-0066",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 1,
"enunciado": "Sobre o kit de medicamentos e os primeiros socorros em um veleiro de mar aberto com 6 pessoas, o que diz a NORMAM-211?",
"alternativas": [
"Recomenda a caixa do Anexo 4-C e põe a responsabilidade pelos medicamentos no comandante",
"Obriga qualquer veleiro de mar aberto a ter um médico a bordo durante toda a viagem",
"Deixa o tema para a Anatel, que fiscaliza a caixa de medicamentos na licença de estação",
"Responsabiliza o fabricante da caixa pela reposição dos medicamentos que estiverem vencidos"
],
"correta": 0,
"explicacao": "<ul><li><strong>A) Correta.</strong> a norma recomenda a caixa de medicamentos (item I do Anexo 4-C) a embarcações de mar aberto com menos de 15 pessoas e põe a responsabilidade no comandante.</li><li><strong>B) Errada.</strong> a norma não exige médico a bordo para embarcações de recreio.</li><li><strong>C) Errada.</strong> a Anatel cuida de telecomunicações, e não de medicamentos.</li><li><strong>D) Errada.</strong> a responsabilidade pelo material é do comandante, e não do fabricante.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.22 e Anexo 4-C",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "radio-0067",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 3,
"enunciado": "Um tripulante cai na água a 10 °C. No mnemônico 1-10-1 da água fria, que serve para lembrar a ordem das fases e não como cronômetro, o que representa o \"10\"?",
"alternativas": [
"Cerca de 10 minutos para a respiração voltar ao normal depois do choque do frio",
"Cerca de 10 minutos até a perda de consciência por hipotermia na água fria",
"Cerca de 10 minutos de movimento útil dos braços e pernas, até faltar força",
"Cerca de 10 minutos que o SALVAMAR leva para chegar depois de receber o alerta"
],
"correta": 2,
"explicacao": "<ul><li><strong>A) Errada.</strong> o choque do frio dura cerca de 1 minuto, e é esse o primeiro \"1\".</li><li><strong>B) Errada.</strong> a perda de consciência por hipotermia vem em torno de 1 hora, e é esse o último \"1\".</li><li><strong>C) Correta.</strong> o mnemônico associa 1 minuto ao choque do frio, 10 minutos à perda de força útil nos membros e 1 hora à hipotermia. Os tempos reais variam com a água, a roupa e a pessoa.</li><li><strong>D) Errada.</strong> o mnemônico descreve o corpo na água fria, não o tempo de resposta do socorro.</li></ul>",
"referencia": "Giesbrecht, G., regra 1-10-1 de água fria (1 min de choque do frio, 10 min de movimento útil, 1 h até a hipotermia); Cold Water Safety, \"The 1-10-1 myth\" (os tempos variam e não são cronômetro); World Sailing, OSR 6.02 (tópico de hipotermia)",
"fonte_url": "https://www.coldwatersafety.org/1-10-1-myth"
},
{
"id": "radio-0068",
"nivel": "radio",
"tema": "Primeiros socorros e sobrevivência",
"dificuldade": 1,
"enunciado": "Um tripulante adulto está inconsciente e sem respirar normalmente. Depois de pedir ajuda, qual é o ritmo recomendado das compressões torácicas na RCP?",
"alternativas": [
"De 60 a 80 compressões por minuto",
"De 140 a 160 compressões por minuto",
"Cerca de 30 compressões por minuto",
"De 100 a 120 compressões por minuto"
],
"correta": 3,
"explicacao": "<ul><li><strong>A) Errada.</strong> é lento demais, e o sangue não circula o bastante.</li><li><strong>B) Errada.</strong> é rápido demais, e as compressões perdem profundidade e o retorno do tórax.</li><li><strong>C) Errada.</strong> 30 é o número de compressões de cada ciclo antes de 2 ventilações, e não o ritmo.</li><li><strong>D) Correta.</strong> as diretrizes de ressuscitação indicam compressões firmes e rápidas, de 100 a 120 por minuto.</li></ul>",
"referencia": "SBC, Diretriz de Ressuscitação Cardiopulmonar e Cuidados Cardiovasculares de Emergência; AHA, Guidelines for CPR and ECC (2020), Parte 3 (suporte básico de vida em adultos)",
"fonte_url": "https://cpr.heart.org/"
}
]);
