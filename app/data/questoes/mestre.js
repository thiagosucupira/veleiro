/* Banco de questões — mestre. Gerado por tools/build_questoes.py em 2026-10-09 a partir de
   research/_work/questoes/ (cada lote passou por duas revisões de instrutor). Conteúdo CC BY-SA 4.0. */
VL.dado('questoes/mestre', [
{
"id": "mestre-0001",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 1,
"enunciado": "Na carta náutica brasileira, ao lado de um ponto no mar aparece o número <b>7₃</b>, sem sublinhado. O que ele indica?",
"alternativas": [
"Sondagem: profundidade de 7,3 m, contada do nível de redução.",
"Sondagem: profundidade de 73 m, com o algarismo pequeno valendo metros.",
"Altura de secagem: pedra que fica 7,3 m acima do nível de redução.",
"Altitude: elevação de 7,3 m acima do nível médio do mar, como nos morros."
],
"correta": 0,
"explicacao": "Os números comuns espalhados no mar são sondagens, em metros e decímetros: o decímetro vem menor e mais baixo, então 7₃ é 7,3 m, contados do nível de redução. Altitudes pertencem à terra e contam do nível médio do mar. Ler 73 m é errar o algarismo pequeno, que vale décimos de metro. Alturas de secagem apareceriam sublinhadas.",
"referencia": "Carta 12000 (INT 1), seção I; Miguens, vol. I, cap. 2, item 2.6.3 h",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0002",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Numa carta, uma pedra traz a altura de secagem <u>1₂</u> (algarismos sublinhados). A previsão de maré para a hora da sua passagem é de 2,0 m acima do nível de redução. Qual é a lâmina de água sobre a pedra nesse momento?",
"alternativas": [
"3,2 m, que é a altura da maré somada à altura de secagem da pedra.",
"0,8 m, que é a altura da maré menos a altura de secagem da pedra.",
"1,2 m, o valor impresso na carta, que vale para qualquer altura de maré.",
"2,0 m, a própria altura da maré, porque a pedra está no nível de redução."
],
"correta": 1,
"explicacao": "Altura de secagem conta para cima a partir do nível de redução: a pedra fica 1,2 m acima dele. Com maré de 2,0 m, sobra 2,0 − 1,2 = 0,8 m de água sobre a pedra. 3,2 m soma os valores, como se fosse uma sondagem. 1,2 m é a altura da pedra, que ignora a maré. 2,0 m esquece que a pedra sobe 1,2 m acima do nível de redução.",
"referencia": "Carta 12000 (INT 1), seção I; Miguens, vol. I, cap. 2, item 2.6.3 h",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0003",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 1,
"enunciado": "Na Carta 12000, qual é a cor usada na “chama” do símbolo de luz dos faróis e das boias luminosas?",
"alternativas": [
"Verde, a mesma cor usada nas áreas que cobrem e descobrem.",
"Preta, a mesma cor usada nas sondagens e na linha da costa.",
"Azul, a mesma cor usada para destacar as águas rasas.",
"Magenta, a mesma cor usada nas rosas dos rumos."
],
"correta": 3,
"explicacao": "As luzes são marcadas com uma chama em magenta, cor que a carta reserva para informações sobrepostas, como rosas dos rumos e áreas restritas. Preto é a cor das sondagens e da estrutura da carta. Azul marca águas rasas, e quanto mais escuro, mais raso. Verde indica áreas que cobrem e descobrem com a maré.",
"referencia": "Carta 12000 (INT 1), seção P; Miguens, vol. I, cap. 2, item 2.6.3",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0004",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Numa carta na escala 1:50.000, a distância entre dois pontos mede 7,4 cm. Qual é a distância real, em milhas náuticas (1 M = 1.852 m)?",
"alternativas": [
"Cerca de 3,7 M, tratando os 3.700 m como se fossem milhas.",
"Cerca de 20 M, errando a conversão de centímetros para metros.",
"Cerca de 4,0 M, dividindo os 3.700 m por 926 m, a meia milha.",
"Cerca de 2,0 M, pois 7,4 cm correspondem a 3.700 m."
],
"correta": 3,
"explicacao": "7,4 cm × 50.000 = 370.000 cm = 3.700 m, e 3.700 ÷ 1.852 ≈ 2,0 M. Responder 3,7 M confunde quilômetros (3,7 km) com milhas. 4,0 M usa 926 m, que é meia milha, como se fosse a milha inteira. 20 M erra a vírgula na passagem de centímetros para metros.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.2, e cap. 1, item 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0005",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 3,
"enunciado": "Você quer plotar posições com erro máximo de 30 m, e calcula que o seu lápis e a sua leitura erram até 0,5 mm na carta. Entre as escalas abaixo, qual é a <b>menor</b> escala (a de maior denominador) que ainda respeita esse limite?",
"alternativas": [
"1:25.000, em que 0,5 mm na carta correspondem a 12,5 m.",
"1:500.000, em que 0,5 mm na carta correspondem a 250 m.",
"1:50.000, em que 0,5 mm na carta correspondem a 25 m.",
"1:100.000, em que 0,5 mm na carta correspondem a 50 m."
],
"correta": 2,
"explicacao": "Em 1:50.000, 1 mm vale 50 m, então 0,5 mm vale 25 m: atende ao limite de 30 m, e nenhuma escala de denominador maior atende. A 1:25.000 o erro seria de 12,5 m: também atende, mas é uma escala maior (denominador menor) do que o necessário, e a pergunta pede a menor escala que ainda atende. Em 1:100.000 o erro chega a 50 m, e em 1:500.000, a 250 m: ambas estouram o limite.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0006",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Você vai navegar de porto a porto, sem perder a costa de vista, e precisa de uma carta que mostre um bom trecho do litoral com detalhe suficiente. Qual tipo de carta é o mais indicado?",
"alternativas": [
"Planta de fundeadouro, em escala de cerca de 1:5.000.",
"Carta oceânica, em escala de cerca de 1:5.000.000.",
"Carta costeira, em escala de cerca de 1:300.000.",
"Carta de porto, em escala de cerca de 1:15.000."
],
"correta": 2,
"explicacao": "As cartas costeiras (cerca de 1:300.000 nas séries da DHN) foram feitas para a navegação ao longo da costa. A oceânica tem escala muito pequena e quase não mostra perigos costeiros. A carta de porto e a planta de fundeadouro têm grande escala: detalham a entrada e o fundeio, mas cobrem poucas milhas, o que obrigaria a trocar de carta toda hora.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0007",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Ao lado de um farolete, a carta brasileira mostra a característica <b>Oc(3) V 12s 18m 9M</b>. Qual é a leitura correta?",
"alternativas": [
"Grupo de três ocultações verdes, repetido a cada 12 s, com foco a 18 m e alcance de 9 milhas.",
"Grupo de três ocultações verdes, repetido a cada 18 s, com foco a 9 m e alcance de 12 milhas.",
"Grupo de três lampejos verdes, repetido a cada 12 s, com foco a 18 m e alcance de 9 milhas.",
"Grupo de três ocultações verdes, repetido a cada 9 s, com foco a 12 m e alcance de 18 milhas."
],
"correta": 0,
"explicacao": "Oc é ocultação (a luz fica acesa mais tempo do que apagada) e (3) indica o grupo; V é verde; 12s é o período do grupo completo; 18m é a altitude do foco e 9M é o alcance. Lampejo seria Lp, em que a luz fica acesa menos tempo do que apagada. As outras duas opções trocam o período, a altitude e o alcance entre si.",
"referencia": "Carta 12000 (INT 1), seção P, itens 10 a 16",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0008",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 3,
"enunciado": "Um farol tem foco a 49 m de altitude e alcance luminoso de 25 M. Do seu veleiro, com os olhos a 4 m da água, qual é aproximadamente a distância em que você começa a ver a luz numa noite de boa visibilidade? (Alcance geográfico D = 1,927 × (√H + √h), em milhas, com H e h em metros.)",
"alternativas": [
"Cerca de 9,0 M, somando as raízes e esquecendo o fator 1,927.",
"Cerca de 9,6 M, subtraindo as raízes em vez de somá-las.",
"Cerca de 17,3 M, limitado pela curvatura da Terra.",
"Cerca de 25 M, o alcance luminoso impresso na carta."
],
"correta": 2,
"explicacao": "D = 1,927 × (√49 + √4) = 1,927 × (7 + 2) ≈ 17,3 M. Como é menor que o alcance luminoso (25 M), é a curvatura da Terra que limita a visão da luz. 25 M ignora o horizonte. 9,6 M vem de 1,927 × (7 − 2), e 9,0 M, de somar as raízes sem multiplicar pelo fator.",
"referencia": "Lista de Faróis (DHN), 40ª ed., Introdução, item 3.5 (alcances)",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf"
},
{
"id": "mestre-0009",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Você procura um fundeadouro com boa tença para passar a noite. A carta mostra a natureza do fundo em quatro pontos: <b>L</b> (lama), <b>R</b> (rocha), <b>Cor</b> (coral) e <b>P</b> (pedras). Em geral, qual é a melhor escolha?",
"alternativas": [
"O ponto de lama (L), onde o ferro costuma cravar e segurar bem.",
"O ponto de pedras (P), porque elas travam o ferro e a amarra.",
"O ponto de rocha (R), porque é o fundo mais duro e mais firme.",
"O ponto de coral (Cor), porque o ferro se prende entre os galhos."
],
"correta": 0,
"explicacao": "Lama e areia são os fundos que normalmente seguram bem, porque o ferro penetra e agarra. Em rocha e pedras o ferro segura mal e pode deslizar. No coral o ferro segura mal e ainda destrói o recife, o que deve ser evitado.",
"referencia": "Carta 12000 (INT 1), seção J; Miguens, vol. I, cap. 2, item 2.6.3",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0010",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 1,
"enunciado": "Nas cartas brasileiras, a altitude de um morro (por exemplo, “215”) está em metros acima de qual nível?",
"alternativas": [
"Do nível alto de maré (preamar) usado nos vãos de pontes.",
"Do nível de redução, o mesmo das sondagens.",
"Da base do morro, medida na linha da costa.",
"Do nível médio do mar, conforme o título da carta."
],
"correta": 3,
"explicacao": "O título das cartas brasileiras informa que as altitudes são contadas a partir do nível médio do mar. O nível de redução (média das baixa-mares de sizígia) é a referência das sondagens e das alturas de secagem. Um nível alto de maré é a referência dos vãos livres de pontes e cabos. A base do morro não é um nível de referência da carta.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.3 b; Carta 12000 (INT 1), Introdução",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0011",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "Junto de uma rocha, a carta traz a abreviatura <b>PA</b>. Qual é a interpretação correta, e a conduta prudente?",
"alternativas": [
"Posição exata: a carta garante o ponto, e basta passar a 0,1 M dele.",
"Profundidade aproximada: use a sondagem como certa, sem margem de folga.",
"Perigo comunicado, não confirmado: pode ser ignorado até novo aviso.",
"Posição aproximada: a rocha pode estar fora do ponto; resguardo maior."
],
"correta": 3,
"explicacao": "PA significa posição aproximada: o levantamento não fixou o ponto com precisão, então o perigo pode estar a alguma distância do símbolo, e o certo é dar resguardo maior. Ler a abreviatura como posição exata ignora essa incerteza. Profundidade aproximada não é o sentido de PA. O comunicado ainda não confirmado é a abreviatura Com, e mesmo esse perigo deve ser tratado como real.",
"referencia": "Carta 12000 (INT 1), Introdução (abreviaturas de incerteza); Miguens, vol. I, cap. 2, item 2.6.3",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf"
},
{
"id": "mestre-0012",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 2,
"enunciado": "O título da sua carta antiga diz “Posições referidas ao datum SAD-69”, e o GPS do barco está em WGS-84. Qual é a conduta correta antes de plotar a posição do GPS?",
"alternativas": [
"Trocar o GPS para graus e segundos, que eliminam a diferença entre datums.",
"Aplicar a correção dada em nota na carta, ou usar uma carta atual em WGS-84.",
"Plotar a posição direto, porque o GPS é sempre mais preciso do que a carta.",
"Somar a declinação magnética à latitude e à longitude do GPS antes de plotar."
],
"correta": 1,
"explicacao": "Datums diferentes dão coordenadas diferentes para o mesmo ponto, e a diferença pode chegar a dezenas de metros ou mais, conforme o datum antigo. Por isso se aplica a correção que a carta traz em nota, ou se usa uma carta atual em WGS-84. Plotar direto leva o erro para a carta. A declinação é assunto de direções, não de coordenadas. O formato (graus e segundos) não muda o datum.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.3; CHM, Cartas Náuticas (datum WGS-84)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas"
},
{
"id": "mestre-0013",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 3,
"enunciado": "Veja o perfil da figura. A sondagem no ponto é <b>2₁</b> (2,1 m), o calado do veleiro é 1,6 m e a previsão da tábua para a hora da passagem é de <b>−0,2 m</b> (a água fica 0,2 m abaixo do nível de redução). Qual é a folga sob a quilha, sem contar ondas?",
"alternativas": [
"0,3 m, porque a profundidade real é 2,1 − 0,2 = 1,9 m.",
"0,7 m, porque a profundidade real é 2,1 + 0,2 = 2,3 m.",
"0,5 m, porque a profundidade real é 2,1 m, a própria sondagem.",
"0,1 m, porque a profundidade real é 2,1 − 0,2 − 0,2 = 1,7 m."
],
"correta": 0,
"explicacao": "Profundidade = sondagem + altura da maré. Como a maré é negativa, a água está abaixo do nível de redução: 2,1 + (−0,2) = 1,9 m, e a folga é 1,9 − 1,6 = 0,3 m. 0,7 m soma a maré como se fosse positiva. 0,5 m ignora a maré. 0,1 m desconta a maré duas vezes.",
"referencia": "Miguens, vol. I, cap. 10, item 10.1.9",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 360 175\" role=\"img\" aria-label=\"Perfil vertical, fora de escala exata: nível de redução, nível da água 0,2 m abaixo dele, quilha a 1,6 m abaixo da água e fundo a 2,1 m abaixo do nível de redução\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"10\" y=\"54\" width=\"265\" height=\"91\" fill=\"var(--sea-2)\" opacity=\"0.45\"/>\n<rect x=\"10\" y=\"145\" width=\"265\" height=\"16\" fill=\"var(--land)\"/>\n<line x1=\"10\" y1=\"44\" x2=\"310\" y2=\"44\" stroke=\"var(--ink)\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/>\n<line x1=\"10\" y1=\"54\" x2=\"275\" y2=\"54\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/>\n<path d=\"M115 54 L125 36 L195 36 L205 54 Z\" fill=\"var(--nav-white)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/>\n<path d=\"M140 54 L140 131 L180 131 L180 54\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/>\n<line x1=\"225\" y1=\"54\" x2=\"225\" y2=\"131\" stroke=\"var(--ink)\" stroke-width=\"1.2\"/>\n<line x1=\"221\" y1=\"54\" x2=\"229\" y2=\"54\" stroke=\"var(--ink)\"/><line x1=\"221\" y1=\"131\" x2=\"229\" y2=\"131\" stroke=\"var(--ink)\"/>\n<line x1=\"285\" y1=\"44\" x2=\"285\" y2=\"145\" stroke=\"var(--ink)\" stroke-width=\"1.2\"/>\n<line x1=\"281\" y1=\"44\" x2=\"289\" y2=\"44\" stroke=\"var(--ink)\"/><line x1=\"281\" y1=\"145\" x2=\"289\" y2=\"145\" stroke=\"var(--ink)\"/>\n<g fill=\"var(--ink)\" font-size=\"11\" font-family=\"sans-serif\">\n<text x=\"14\" y=\"38\">NR (0,0 m)</text>\n<text x=\"14\" y=\"76\">água: 0,2 m</text><text x=\"14\" y=\"89\">abaixo do NR</text>\n<text x=\"231\" y=\"88\">calado</text><text x=\"231\" y=\"101\">1,6 m</text>\n<text x=\"293\" y=\"88\">sondagem</text><text x=\"293\" y=\"101\">2,1 m</text>\n<text x=\"14\" y=\"157\">fundo</text>\n<text x=\"144\" y=\"96\">quilha</text>\n</g></svg>"
}
},
{
"id": "mestre-0014",
"nivel": "mestre",
"tema": "Carta náutica e simbologia",
"dificuldade": 1,
"enunciado": "Na rosa dos rumos de uma carta náutica, o anel interno, com a seta do Norte magnético, é graduado em rumos de qual tipo?",
"alternativas": [
"Rumos verdadeiros, e o anel externo traz os rumos magnéticos.",
"Rumos magnéticos, e o anel externo traz os rumos verdadeiros.",
"Rumos relativos, e o anel externo traz os rumos da agulha.",
"Rumos da agulha, e o anel externo traz os rumos magnéticos."
],
"correta": 1,
"explicacao": "O anel externo da rosa é verdadeiro, alinhado com os meridianos da carta, e o interno é magnético, girado do valor da declinação do local. A rosa da carta não traz rumos da agulha, que dependem do desvio de cada barco. Os rumos relativos contam a partir da proa e não aparecem na rosa.",
"referencia": "Miguens, vol. I, cap. 2, item 2.6.3 i, e cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0015",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 1,
"enunciado": "O GPS, configurado em graus, minutos e segundos, mostra a latitude 12°36′45″ S. Em graus e minutos decimais (minutos com uma casa depois da vírgula), essa latitude é:",
"alternativas": [
"12°36,75′ S, porque 45″ valem 0,75′.",
"12°36,45′ S, copiando os segundos como se fossem décimos.",
"12°43,5′ S, dividindo os segundos por 6 em vez de por 60.",
"12°36,25′ S, usando os 15″ que faltam para completar o minuto."
],
"correta": 0,
"explicacao": "Um minuto tem 60 segundos, então 45″ = 45 ÷ 60 = 0,75′, e a latitude fica 12°36,75′ S. Copiar 45 como 0,45′ confunde segundos com centésimos de minuto. Dividir por 6 dá 7,5′, que somados a 36′ resultam em 43,5′. E 0,25′ corresponde a 15″, não a 45″.",
"referencia": "Miguens, vol. I, cap. 1, item 1.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0016",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 2,
"enunciado": "Um veleiro está em 24°10,0′ S e navega 18 M para o norte (Rv 000°). Qual é a latitude de chegada?",
"alternativas": [
"24°08,0′ S, subtraindo 10′ − 18′ e mantendo o grau.",
"23°52,0′ S, porque a latitude diminui 18′ ao ir para o norte.",
"24°28,0′ S, somando 18′ à latitude inicial.",
"23°42,0′ S, passando um grau para os minutos e esquecendo os 10′."
],
"correta": 1,
"explicacao": "No Hemisfério Sul, ir para o norte diminui a latitude. 18 M valem 18′ de latitude: 24°10′ − 18′ = 23°52′ (empresta-se 1° = 60′, e 70′ − 18′ = 52′). 24°28′ soma em vez de subtrair. 24°08′ ignora que 10′ é menor que 18′ e não há como manter o grau. 23°42′ empresta o grau, mas perde os 10′ que já estavam na latitude.",
"referencia": "Miguens, vol. I, cap. 1, itens 1.6 e 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0017",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 2,
"enunciado": "Um barco navega exatamente para o sul de 22°47,0′ S até 23°12,0′ S. Qual foi a distância percorrida?",
"alternativas": [
"35 M, subtraindo 47′ − 12′ sem considerar a mudança de grau.",
"85 M, contando 1°25′ por empréstimo duplo de um grau.",
"25 M, porque a diferença de latitude é de 25′.",
"59 M, somando os minutos 47′ + 12′."
],
"correta": 2,
"explicacao": "A diferença de latitude é 23°12′ − 22°47′ = 1.392′ − 1.367′ = 25′, e 1′ de latitude vale 1 milha, então são 25 M. 35 M subtrai os minutos de forma direta, esquecendo que a latitude passou de 22° para 23°. 59 M soma os minutos. 85 M soma um grau de 60′ a mais na conta.",
"referencia": "Miguens, vol. I, cap. 1, itens 1.6 e 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0018",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 3,
"enunciado": "Um veleiro navega 120 M exatamente para leste (Rv 090°) ao longo do paralelo de 60° S, onde cos 60° = 0,5. Em quanto muda a sua longitude?",
"alternativas": [
"1°00′, pois dlong = afastamento × cos 60° = 120 × 0,5 = 60′.",
"2°00′, pois 1′ de longitude vale sempre 1 milha (120′).",
"8°00′, pois o afastamento é dividido por cos 60° duas vezes (480′).",
"4°00′, pois dlong = afastamento ÷ cos 60° = 120 ÷ 0,5 = 240′."
],
"correta": 3,
"explicacao": "Ao longo de um paralelo, o afastamento (120 M) e a diferença de longitude se relacionam por afastamento = dlong × cos φ. Então dlong = 120 ÷ 0,5 = 240′ = 4°. Em 60° de latitude o minuto de longitude vale só meia milha, e por isso 2° (120′) seria o valor no Equador. 1° multiplica por cos em vez de dividir. 8° aplica a divisão duas vezes.",
"referencia": "Miguens, vol. I, cap. 1, item 1.7 e cap. 2, item 2.4.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0019",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 1,
"enunciado": "Qual é a distância, em milhas náuticas, entre os paralelos de 23° S e 24° S, medida ao longo de um meridiano?",
"alternativas": [
"111 M, que é o valor de 1° de latitude em quilômetros.",
"100 M, porque 1° é dividido em 100 partes.",
"60 M, pois 1° de latitude tem 60′, e 1′ vale 1 milha.",
"55 M, porque o minuto vale 0,92 milha a 23° S."
],
"correta": 2,
"explicacao": "Um grau de latitude tem 60 minutos, e cada minuto de latitude vale 1 milha náutica: 60 M. 100 M usa a divisão decimal, que não se aplica à latitude. 111 é o valor em quilômetros (60 × 1,852). O fator 0,92 vale para o minuto de longitude a 23° S, não para a latitude.",
"referencia": "Miguens, vol. I, cap. 1, item 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0020",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 3,
"enunciado": "Um veleiro vai para o norte, cruzando o Equador, de 01°20′ S até 00°50′ N. Qual é a distância percorrida?",
"alternativas": [
"70 M, somando só os 20′ e os 50′ e esquecendo o grau inteiro.",
"130 M, porque as latitudes têm nomes contrários e se somam (80′ + 50′).",
"30 M, subtraindo 80′ − 50′ como se fossem do mesmo hemisfério.",
"170 M, somando as latitudes e lendo 1°70′ como 170 minutos."
],
"correta": 1,
"explicacao": "Quando as latitudes têm nomes contrários, soma-se: 1°20′ S = 80′ ao sul do Equador e 0°50′ N = 50′ ao norte, em um total de 130′, ou 130 M. 30 M é a conta para latitudes de mesmo nome. 70 M esquece o grau (60′). 170 M converte 1°70′ errado: 1°70′ são 130′.",
"referencia": "Miguens, vol. I, cap. 1, itens 1.6 e 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0021",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 1,
"enunciado": "Navegando a 6,5 nós durante 36 minutos, quantas milhas o barco percorre?",
"alternativas": [
"3,9 M, pois D = 6,5 × 36 ÷ 60.",
"5,5 M, dividindo 36 por 6,5.",
"2,3 M, tratando 36 minutos como 0,36 hora.",
"39 M, dividindo por 6 em vez de por 60."
],
"correta": 0,
"explicacao": "D = V × T, com o tempo em horas: 36 min = 0,6 h, e 6,5 × 0,6 = 3,9 M. Dividir por 6 dá 39 M. Escrever 0,36 h é converter minutos em centésimos de hora, o que dá 2,3 M. Dividir 36 por 6,5 calcula uma grandeza sem sentido aqui.",
"referencia": "Miguens, vol. I, cap. 1, item 1.9",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0022",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 1,
"enunciado": "Uma pernada tem 21 M e o veleiro mantém 6 nós no fundo. Quanto tempo ela leva?",
"alternativas": [
"17 min, dividindo 6 por 21 em vez de 21 por 6.",
"3 h 50 min, lendo 3,5 h como 3 h e 50 min.",
"2 h 06 min, multiplicando 21 por 6 e lendo 126 como minutos.",
"3 h 30 min, pois T = 21 ÷ 6 = 3,5 h."
],
"correta": 3,
"explicacao": "T = D ÷ V = 21 ÷ 6 = 3,5 h, e 0,5 h são 30 min: 3 h 30 min. Em 3,5 h, o “,5” é meia hora, não 50 minutos. 17 min vem da divisão invertida (6 ÷ 21 h). 2 h 06 min é D × V (126), que não é o tempo.",
"referencia": "Miguens, vol. I, cap. 1, item 1.9",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0023",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 3,
"enunciado": "Você parte de 23°30,0′ S e navega 10 M no rumo verdadeiro 060° (use cos 60° = 0,5 e sen 60° ≈ 0,87). Qual é a nova latitude?",
"alternativas": [
"23°20,0′ S, porque a variação de latitude é igual aos 10 M percorridos.",
"23°35,0′ S, porque a variação de latitude é 5′ para o sul.",
"23°25,0′ S, porque a variação de latitude é 10 × cos 60° = 5′ para o norte.",
"23°21,3′ S, porque a variação de latitude é 10 × sen 60° ≈ 8,7′ para o norte."
],
"correta": 2,
"explicacao": "O rumo 060° está no quadrante nordeste, com componente para o norte, então a latitude diminui no Hemisfério Sul. A variação de latitude é a distância vezes o cosseno do rumo: 10 × cos 60° = 5′, e 23°30,0′ − 5,0′ = 23°25,0′ S. Somar 5′ ignora o sentido norte. 8,7′ é o afastamento (seno), que muda a longitude, não a latitude. 10′ só vale para um rumo norte puro (000°).",
"referencia": "Miguens, vol. I, cap. 1, itens 1.7 e 1.8",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0024",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 2,
"enunciado": "O GPS mostra a latitude em graus decimais: −23,75° (o sinal negativo indica Sul). Em graus e minutos, essa latitude é:",
"alternativas": [
"23°07,5′ S, dividindo 75 por 10 em vez de multiplicar 0,75 por 60.",
"23°45,0′ S, porque 0,75° × 60 = 45′.",
"23°75,0′ S, lendo a parte decimal como minutos.",
"23°15,0′ S, usando o complemento 0,25° × 60."
],
"correta": 1,
"explicacao": "Para passar a parte decimal do grau a minutos, multiplica-se por 60: 0,75 × 60 = 45′. Escrever 75′ é ler a fração decimal como se já fossem minutos, e não existe 75′ (o máximo é 59,9′). Dividir 75 por 10 dá 7,5′. 15′ é o complemento do que falta para 1°, não a parte decimal dada.",
"referencia": "Miguens, vol. I, cap. 1, item 1.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0025",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 2,
"enunciado": "O ponto A está em 23°41,0′ S, 044°15,0′ W, e o ponto B em 23°39,5′ S, 044°22,0′ W. Em relação a A, o ponto B está:",
"alternativas": [
"A 1,5′ ao sul e 7,0′ a leste.",
"A 1,5′ ao norte e 7,0′ a oeste.",
"A 1,5′ ao sul e 7,0′ a oeste.",
"A 1,5′ ao norte e 7,0′ a leste."
],
"correta": 1,
"explicacao": "No Hemisfério Sul, a latitude menor (23°39,5′) fica mais ao norte, a 1,5′ de A. A oeste de Greenwich, a longitude maior (044°22,0′) fica mais a oeste, a 7,0′ de A. A alternativa com leste e sul inverte os dois sentidos. A que põe B ao sul erra a latitude, e a que põe B a leste erra a longitude.",
"referencia": "Miguens, vol. I, cap. 1, item 1.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0026",
"nivel": "mestre",
"tema": "Coordenadas e distâncias",
"dificuldade": 2,
"enunciado": "O GPS indica 23°59,6′ S. O veleiro avança 1,0 M exatamente para o sul. Qual é a nova latitude?",
"alternativas": [
"23°58,6′ S, subtraindo 1,0′ como se fosse para o norte.",
"24°00,4′ S, calculando 60,0′ − 59,6′ para os minutos.",
"23°60,6′ S, mantendo o grau e deixando 60,6′ nos minutos.",
"24°00,6′ S, porque 59,6′ + 1,0′ = 60,6′ = 1° + 0,6′."
],
"correta": 3,
"explicacao": "Ir para o sul aumenta a latitude: 59,6′ + 1,0′ = 60,6′, e 60′ formam 1°, então a posição passa a 24°00,6′ S. Os minutos nunca passam de 59,9′, por isso 23°60,6′ é inválido. 23°58,6′ é a conta para o norte. 24°00,4′ calcula só o que faltava para fechar o grau (0,4′), sem somar o restante do avanço.",
"referencia": "Miguens, vol. I, cap. 1, itens 1.6 e 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0027",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 1,
"enunciado": "Em um lugar de declinação magnética 18° W, o rumo magnético é 100°. Qual é o rumo verdadeiro?",
"alternativas": [
"064°, aplicando a declinação W duas vezes.",
"082°, porque com declinação W se subtrai 18° do rumo magnético.",
"118°, somando a declinação W em vez de subtraí-la.",
"100°, deixando de aplicar a declinação ao rumo magnético."
],
"correta": 1,
"explicacao": "Pela convenção E+ W−, Rv = Rmg + Dec mg, e com 18° W a declinação vale −18°: Rv = 100° − 18° = 082°. Somar dá 118°, que é o sinal trocado. 100° esquece a declinação. 064° subtrai 36°, isto é, o dobro.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0028",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 1,
"enunciado": "Na carta, você traçou a pernada no Rv 215°. A declinação magnética é 21° W. Qual é o rumo magnético correspondente?",
"alternativas": [
"194°, subtraindo a declinação W.",
"215°, deixando de aplicar a declinação.",
"236°, porque da carta para o magnético, W soma.",
"257°, somando a declinação W duas vezes."
],
"correta": 2,
"explicacao": "Rmg = Rv − Dec mg. Com a declinação W (−21°), Rmg = 215° + 21° = 236°. Na ida da carta para a agulha o sinal é o inverso: oeste soma. 194° subtrai, que é o sentido da agulha para a carta. 215° ignora a declinação, e 257° aplica 42°.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0029",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 2,
"enunciado": "Dados: Rag 047°, desvio da agulha 3° E nessa proa e declinação magnética 22° W. Qual é o rumo verdadeiro?",
"alternativas": [
"028°, porque Rmg = 047° + 3° = 050° e Rv = 050° − 22°.",
"025°, aplicando só a declinação e esquecendo o desvio.",
"022°, subtraindo o desvio E em vez de somá-lo.",
"072°, somando a declinação W em vez de subtraí-la."
],
"correta": 0,
"explicacao": "Da agulha para a carta, leste soma e oeste subtrai. Rmg = Rag + Dag = 047° + 3° = 050°; Rv = Rmg + Dec = 050° − 22° = 028°. 072° soma a declinação W. 022° subtrai o desvio E (047° − 3° − 22°). 025° é 047° − 22°, sem desvio.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0030",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 2,
"enunciado": "O plano de derrota pede o Rv 310°. A declinação é 19° W e, para essa proa, o desvio da agulha é 4° W. Em que rumo da agulha o timoneiro deve governar?",
"alternativas": [
"287°, usando os sinais do caminho da agulha para a carta.",
"333°, porque Rmg = 310° + 19° = 329° e Rag = 329° + 4°.",
"325°, subtraindo o desvio W em vez de somá-lo.",
"329°, aplicando só a declinação e esquecendo o desvio."
],
"correta": 1,
"explicacao": "Da carta para a agulha os sinais se invertem: oeste soma, leste subtrai. Rmg = 310° + 19° = 329°; Rag = 329° + 4° = 333°. 325° subtrai o desvio W. 329° é o rumo magnético, sem a correção do desvio. 287° subtrai os dois valores W, como se o caminho fosse o da agulha para a carta.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0031",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 2,
"enunciado": "A rosa da carta diz “19°20′W 2016 (8′E)”. Qual é a declinação magnética em 2026?",
"alternativas": [
"20°40′ W, porque a variação soma 1°20′ à declinação W.",
"19°12′ W, porque conta só um ano de variação (8′).",
"18°00′ W, pois a variação de 1°20′ E reduz a declinação W.",
"18°00′ E, porque a declinação mudou de nome."
],
"correta": 2,
"explicacao": "Em 10 anos, a variação acumulada é 10 × 8′ = 80′ = 1°20′ E. Como o sentido (E) é oposto ao da declinação (W), subtrai-se: 19°20′ − 1°20′ = 18°00′ W. Somar daria 20°40′ W. 19°12′ considera apenas um ano. A declinação só mudaria de nome se passasse por zero, o que não aconteceu: ainda há 18° W.",
"referencia": "Miguens, vol. I, cap. 3, itens 3.2.3 e 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0032",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 3,
"enunciado": "Na carta, um alinhamento tem Mv 078°. A declinação magnética atualizada é 21° W. Governando sobre o alinhamento, o timoneiro lê Rag 103°. Qual é o desvio da agulha nessa proa?",
"alternativas": [
"4° W, porque Rmg = 078° + 21° = 099° e Dag = 099° − 103°.",
"4° E, porque o desvio é calculado como 103° − 099°, com o sinal trocado.",
"25° W, porque Dag = 078° − 103°, sem considerar a declinação.",
"46° W, porque o Rmg foi calculado como 078° − 21° = 057°."
],
"correta": 0,
"explicacao": "Primeiro passa-se o alinhamento ao magnético: Rmg = Mv − Dec = 078° + 21° = 099°. O desvio é Dag = Rmg − Rag = 099° − 103° = −4°, ou seja, 4° W. Calcular 103° − 099° dá 4° E, com o sinal trocado. 25° compara o verdadeiro com a agulha, misturando a declinação com o desvio. 46° aplica a declinação W com o sinal errado.",
"referencia": "Miguens, vol. I, cap. 3, itens 3.2.4 h e 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0033",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 3,
"enunciado": "Navegando no Rag 070°, você marca um farol na marcação da agulha 120°. A curva de desvios dá 2° E para a proa 070° e 4° E para a direção 120°. A declinação é 20° W. Qual é a marcação verdadeira a traçar na carta?",
"alternativas": [
"142°, porque Mv = 122° + 20°, somando a declinação W.",
"100°, porque Mmg = 120° e só se aplica a declinação.",
"104°, porque Mmg = 120° + 4° = 124° (desvio da direção).",
"102°, porque Mmg = 120° + 2° = 122° e Mv = 122° − 20°."
],
"correta": 3,
"explicacao": "O desvio de uma marcação é o da proa do barco no instante da observação (2° E), e não o da direção do objeto. Mmg = 120° + 2° = 122°, e Mv = 122° − 20° = 102°. 104° entra na curva com a direção da marcação, o erro clássico. 100° esquece o desvio. 142° soma a declinação W.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 b",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0034",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 1,
"enunciado": "De que depende a declinação magnética num ponto da Terra?",
"alternativas": [
"Da proa do barco, que muda a cada guinada.",
"Só do ano, porque é igual em toda a costa brasileira.",
"Do local e do ano, sem relação com o barco.",
"Do ferro e do equipamento elétrico instalados a bordo."
],
"correta": 2,
"explicacao": "A declinação é a diferença entre o Norte verdadeiro e o magnético no lugar, e varia com a posição e com o tempo (por isso a rosa traz o ano e a variação anual). Depender da proa e do ferro de bordo é característica do desvio da agulha. E não é igual em toda a costa: muda de um porto para outro.",
"referencia": "Miguens, vol. I, cap. 3, itens 3.2.3 e 3.2.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0035",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 2,
"enunciado": "Numa carta estrangeira, a declinação é 15° E. Você quer seguir para o Norte verdadeiro (Rv 000°). Qual é o rumo magnético?",
"alternativas": [
"000°, deixando de aplicar a declinação.",
"345°, subtraindo a declinação E de 000°.",
"015°, somando a declinação E ao rumo verdadeiro.",
"330°, aplicando a declinação E duas vezes."
],
"correta": 1,
"explicacao": "Com declinação E, o Norte magnético fica a leste do verdadeiro, então para apontar ao Norte verdadeiro a proa deve ficar 15° à esquerda do magnético: Rmg = 000° − 15° = 345°. Somar dá o sinal trocado (015°). 000° ignora a declinação. 330° subtrai 30°.",
"referencia": "Miguens, vol. I, cap. 3, itens 3.2.3 e 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0036",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 3,
"enunciado": "A curva de desvios dá 4° E para a proa 150° e 5° E para a proa 180°. Você governa no Rag 165° e a declinação é 20° W. Qual é o rumo verdadeiro, com valores a 0,5°?",
"alternativas": [
"145,0°, esquecendo o desvio da agulha.",
"140,5°, subtraindo o desvio E em vez de somá-lo.",
"149,5°, porque Dag = 4,5° E e Rmg = 169,5°.",
"189,5°, somando o desvio E e também a declinação W."
],
"correta": 2,
"explicacao": "Entra-se na curva com a proa: 165° está no meio entre 150° (4° E) e 180° (5° E), logo Dag = 4,5° E. Rmg = 165° + 4,5° = 169,5° e Rv = 169,5° − 20° = 149,5°. 189,5° soma a declinação W. 145° é 165° − 20°. 140,5° subtrai o desvio E.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0037",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 1,
"enunciado": "Qual é o rumo recíproco do rumo 305°?",
"alternativas": [
"125°",
"055°",
"215°",
"035°"
],
"correta": 0,
"explicacao": "A recíproca difere de 180°: 305° − 180° = 125°. 055° é 360° − 305°, o complemento para o círculo inteiro. 215° e 035° são perpendiculares ao rumo (305° − 90° e 305° + 90° − 360°), não a direção oposta.",
"referencia": "Miguens, vol. I, cap. 2, Apêndice A, item C",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0038",
"nivel": "mestre",
"tema": "Rumos, marcações e agulha",
"dificuldade": 2,
"enunciado": "Veja a figura. O veleiro governa no Rv 140° e o farol está exatamente pelo través de bombordo. Qual é a marcação verdadeira do farol?",
"alternativas": [
"230°, porque o través fica a boreste e Mv = 090° + 140°.",
"320°, porque o farol está pela popa, a 180° do rumo.",
"140°, porque a marcação do través é igual ao rumo.",
"050°, porque Mr = 270° e Mv = 270° + 140° − 360°."
],
"correta": 3,
"explicacao": "O través de bombordo é a marcação relativa 270° (ou polar 090° BB). Mv = Mr + Rv = 270° + 140° = 410°, e tira-se 360°: 050°. 230° seria o través de boreste. 140° é o próprio rumo, que corresponde à marcação pela proa (Mr 000°). 320° é 140° + 180°, a marcação pela popa.",
"referencia": "Miguens, vol. I, cap. 1, item 1.8",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 200\" role=\"img\" aria-label=\"Veleiro visto de cima, com a proa para cima, e um farol exatamente pelo través de bombordo, no lado esquerdo\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M200 40 C225 80 228 130 218 160 L182 160 C172 130 175 80 200 40 Z\" fill=\"var(--nav-white)\" stroke=\"var(--ink)\" stroke-width=\"2\"/>\n<line x1=\"200\" y1=\"40\" x2=\"200\" y2=\"14\" stroke=\"var(--ink)\" stroke-width=\"2\"/>\n<path d=\"M194 22 L200 12 L206 22\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\"/>\n<line x1=\"60\" y1=\"108\" x2=\"196\" y2=\"108\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/>\n<circle cx=\"52\" cy=\"108\" r=\"9\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\"/>\n<path d=\"M52 99 L52 117 M43 108 L61 108\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/>\n<g fill=\"var(--ink)\" font-size=\"12\" font-family=\"sans-serif\">\n<text x=\"214\" y=\"22\">proa</text>\n<text x=\"30\" y=\"140\">farol</text>\n<text x=\"100\" y=\"100\">BB</text>\n<text x=\"240\" y=\"108\">BE</text>\n</g></svg>"
}
},
{
"id": "mestre-0039",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 1,
"enunciado": "Às 1020 você marca um farol aos <b>125°</b> (marcação verdadeira) e quer traçar a reta de marcação na carta, partindo do farol. Em qual direção, a partir do farol, está o barco?",
"alternativas": [
"Na direção 305°, a recíproca, porque a marcação vai do barco ao farol.",
"Na direção 125°, a mesma da marcação, porque a reta passa pelo farol nesse rumo.",
"Na direção 215°, perpendicular à marcação, que é onde fica o barco.",
"Na direção 035°, perpendicular à marcação, que é onde fica o barco."
],
"correta": 0,
"explicacao": "A marcação é a direção do barco para o objeto. Vista do farol, a direção do barco é a oposta: 125° + 180° = 305°. Traçar 125° a partir do farol poria o barco do lado oposto, a sudeste dele, e não a noroeste. As direções 215° e 035° são perpendiculares à reta e não têm relação com a observação.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 4, item 4.2, alínea b (marcação visual: reta de marcação verdadeira)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0040",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 1,
"enunciado": "Com a bússola de mão (desvio desprezível), você marca uma ponta aos <b>200°</b>. A declinação magnética atualizada da área é <b>18° W</b>. Que marcação verdadeira você traça na carta?",
"alternativas": [
"218°, porque 200° + 18° = 218°, somando a declinação.",
"200°, pois a carta já está em graus magnéticos.",
"020°, a recíproca de 200°, sem considerar a declinação.",
"182°, porque a declinação W subtrai: 200° − 18° = 182°."
],
"correta": 3,
"explicacao": "Mv = Mag + Dag + Dec (marcação na agulha, desvio, declinação), com E somando e W subtraindo. Sem desvio, 200° − 18° = 182°. Somar a declinação W (218°) é o erro de sinal mais comum. A carta é traçada em verdadeiro, então não se usa 200° direto. A recíproca não entra na conversão e daria outra direção.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 (conversão de marcações)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0041",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 1,
"enunciado": "Você enxerga quatro pontos notáveis, com estas marcações verdadeiras: farol A 040°, torre B 070°, ponta C 135° e pico D 160°. Para uma posição por <b>duas</b> marcações, qual dos quatro pares listados abaixo dá o melhor ângulo de cruzamento?",
"alternativas": [
"Farol A e torre B, que se cruzam a 30°, as marcações mais próximas entre si.",
"Farol A e ponta C, que se cruzam a 95°, quase o ideal de 90°.",
"Ponta C e pico D, que se cruzam a 25°, ambos bem definidos.",
"Torre B e ponta C, que se cruzam a 65°, o ângulo mais próximo de 60°."
],
"correta": 1,
"explicacao": "Com duas LDP, o ângulo ideal é 90° (180° dividido por 2), e se evitam cruzamentos menores que 30° ou maiores que 150°. A e C cruzam a 135° − 040° = 95°. A e B (30°) e C e D (25°) dão uma área de incerteza comprida e enganosa. B e C (65°) são aceitáveis, mas piores que 95°; o ideal de 60° vale para três LDP, não para duas.",
"referencia": "Miguens, vol. I, cap. 4, item 4.5.3, alínea c (ângulo de cruzamento 180°/n; evitar menos de 30° ou mais de 150°)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0042",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 1,
"enunciado": "Ao navegar junto à costa, você vê o pico de um morro exatamente atrás da torre de uma igreja. Os dois estão representados na carta. O que essa observação informa?",
"alternativas": [
"O barco está num ponto exato, porque o alinhamento já é uma posição.",
"O barco está sobre a reta que une os dois, a meia distância entre eles.",
"O barco está sobre a reta que passa pelos dois objetos.",
"O barco está sobre a perpendicular à reta que une os dois objetos."
],
"correta": 2,
"explicacao": "Objetos vistos um atrás do outro formam um alinhamento, que é uma LDP: o barco está sobre a reta que os contém, mas a observação não diz em que ponto dela. Para obter o ponto, é preciso cruzar com outra LDP. Dizer que o alinhamento já é uma posição confunde LDP com posição; dizer que o barco está a meia distância entre os objetos o põe entre eles, quando eles estão do mesmo lado; a perpendicular à reta não tem relação com um alinhamento.",
"referencia": "Miguens, vol. I, cap. 4, item 4.2, alínea a (alinhamento)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0043",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 2,
"enunciado": "Para achar o desvio da agulha, você navega com a proa exatamente sobre um alinhamento da carta, cujo rumo <b>verdadeiro</b> é <b>062°</b>. A declinação atualizada é <b>21° W</b> e a agulha de governo marca <b>085°</b>. Qual é o desvio da agulha para essa proa?",
"alternativas": [
"2° W",
"2° E",
"23° W",
"44° W"
],
"correta": 0,
"explicacao": "Rumo magnético = Rv − Dec = 062° − (−21°) = 083°. Desvio = Rmg − Rag = 083° − 085° = −2°, ou seja, 2° W (a agulha lê mais que o rumo magnético). 2° E tem o sinal invertido. 23° W esquece a declinação, e 44° W aplica a declinação W com sinal trocado.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.4, alínea h (determinação dos desvios por alinhamentos)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0044",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 2,
"enunciado": "O radar dá <b>3,0 M</b> até uma ilha e <b>4,0 M</b> até uma ponta. As duas circunferências de distância se cruzam em dois pontos: um muito perto da posição estimada e outro a uns <b>4 M</b> dela, do outro lado da linha que une a ilha e a ponta. Como decidir?",
"alternativas": [
"Adotar o ponto mais afastado da costa, por ser o mais seguro.",
"Adotar o ponto médio entre os dois cruzamentos, que reparte o erro.",
"Adotar qualquer um dos dois, pois as circunferências têm o mesmo valor.",
"Adotar o ponto mais próximo da estimada e confirmar com outra LDP."
],
"correta": 3,
"explicacao": "Duas circunferências se cruzam em dois pontos; a posição estimada, que é a melhor informação que se tem, desfaz a ambiguidade, e outra LDP confirma. Escolher só pela distância à costa não tem base na observação. O ponto médio não pertence a nenhuma das duas circunferências. E os dois cruzamentos não são equivalentes: só um deles é onde o barco está.",
"referencia": "Miguens, vol. I, cap. 4, item 4.3.2 (posição por duas LDP: possibilidade de ambiguidade)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0045",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 2,
"enunciado": "Suas três marcações formaram um triângulo de uns 1,5 M por lado, bem maior do que o esperado para marcações cuidadosas. Não há perigos por perto. O que fazer?",
"alternativas": [
"Adotar o centro do triângulo, que é a posição mais provável.",
"Descartar a posição, procurar o erro e tirar nova posição.",
"Adotar o vértice mais próximo da costa, por segurança.",
"Descartar uma das marcações, sem saber qual, e adotar o cruzamento das outras duas."
],
"correta": 1,
"explicacao": "Um triângulo pequeno permite adotar o centro; um triângulo grande indica erro grosseiro (objeto trocado, declinação, régua escorregada), e a regra do Manual é abandonar a posição e determinar outra imediatamente. O vértice mais próximo do perigo só vale quando existe perigo perto. Descartar uma marcação sem saber qual está errada deixa só duas LDP, que não denunciam erro.",
"referencia": "Miguens, vol. I, cap. 4, item 4.5.4, alínea c (triângulo de incerteza grande)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0046",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 2,
"enunciado": "O ecobatímetro mostra a profundidade abaixo do transdutor, instalado a <b>0,5 m</b> sob a superfície, e marca <b>14,5 m</b>. A maré no instante está <b>1,8 m acima</b> do nível de redução. Que profundidade você compara com as isóbatas da carta?",
"alternativas": [
"16,8 m",
"12,7 m",
"13,2 m",
"12,2 m"
],
"correta": 2,
"explicacao": "A profundidade real é a lida mais a profundidade do transdutor: 15,0 m. As sondagens da carta são referidas ao nível de redução; com a água 1,8 m acima dele, subtrai-se a maré: 13,2 m. Somar a maré (16,8 m) inverte o sinal. 12,7 m esquece o transdutor. 12,2 m subtrai o transdutor em vez de somá-lo.",
"referencia": "Miguens, vol. I, cap. 4, item 4.2, alínea d (isóbata como LDP)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0047",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 2,
"enunciado": "Sem corrente, rumo verdadeiro <b>090°</b> e <b>6,0 nós</b>. Às 1000 você marca um farol aos <b>000°</b> e, às 1030, aos <b>315°</b> (marcações verdadeiras). Qual é a distância ao farol às 1030?",
"alternativas": [
"4,2 M",
"3,0 M",
"2,1 M",
"6,0 M"
],
"correta": 0,
"explicacao": "Às 1000 o farol estava ao norte; o barco foi 3,0 M para leste (6 nós × 0,5 h). Às 1030 a marcação 315° significa que o farol está a noroeste, com distâncias iguais ao norte e a oeste: 3,0 M ao norte e 3,0 M a oeste. Distância = 3,0 × √2 ≈ 4,2 M. A regra 'distância igual à navegada' vale quando a segunda marcação relativa é o dobro da primeira; aqui, por BB, são 90° e 135°, e 135° não é o dobro de 90°. 3,0 M é só a distância navegada, não a distância ao farol; 2,1 M e 6,0 M não correspondem a nenhuma relação do triângulo.",
"referencia": "Miguens, vol. I, cap. 6, itens 6.2 e 6.3.2 (marcações sucessivas do mesmo objeto)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0048",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 3,
"enunciado": "Rumo verdadeiro <b>090°</b>, <b>6,0 nós</b> na água, corrente de <b>180°</b> (para o sul) com <b>2,0 nós</b>. Às 1000 você marca um farol aos <b>000°</b> e, às 1030, aos <b>315°</b> (marcações verdadeiras). Qual era a distância ao farol às 1000?",
"alternativas": [
"3,0 M",
"2,0 M",
"4,0 M",
"1,0 M"
],
"correta": 1,
"explicacao": "Em 30 min o barco se desloca 3,0 M para leste (superfície) e 1,0 M para o sul (corrente). Às 1000 o farol está ao norte, a s milhas. Às 1030 o barco está 3,0 M a leste e (s + 1,0) M ao sul do farol, e a marcação 315° exige distâncias iguais ao norte e a oeste: s + 1,0 = 3,0, logo s = 2,0 M. Sem corrente seria 3,0 M. Com a corrente invertida (para o norte) daria 4,0 M. E 1,0 M é só o vetor da corrente.",
"referencia": "Miguens, vol. I, cap. 6, item 6.3.2, alínea d (marcações sucessivas conhecendo-se a corrente)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0049",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 3,
"enunciado": "Rumo verdadeiro <b>000°</b>, <b>6,0 nós</b>, sem corrente. Às 1200 um farol em <b>23°00,0′ S, 043°00,0′ W</b> está a 30° por boreste da proa; às 1230, a 60° por boreste. Qual é a posição às 1230? (Use cos 23° ≈ 0,92.)",
"alternativas": [
"23°01,5′ S e 042°57,2′ W.",
"22°58,5′ S e 043°02,8′ W.",
"23°01,5′ S e 043°02,8′ W.",
"23°01,5′ S e 043°02,6′ W."
],
"correta": 2,
"explicacao": "A segunda marcação polar (60°) é o dobro da primeira (30°), então a distância ao farol é a navegada: 6,0 × 0,5 = 3,0 M. A marcação verdadeira do farol é 000° + 60° = 060°, e o barco está a 240° do farol: 1,5 M ao sul (latitude 23°01,5′ S) e 2,6 M a oeste (esse deslocamento leste-oeste em milhas é o apartamento). Em longitude, 2,6 ÷ 0,92 ≈ 2,8′ para oeste: 043°02,8′ W. 042°57,2′ W põe o barco a leste (como se fosse por bombordo). 22°58,5′ S o põe ao norte. 043°02,6′ W esquece de converter o apartamento em longitude.",
"referencia": "Miguens, vol. I, cap. 6, item 6.3.4, alínea a (marcações duplas); vol. II, cap. 33, item 33.2 (apartamento e diferença de longitude: Δλ = ap · sec φm)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0050",
"nivel": "mestre",
"tema": "Linhas de posição",
"dificuldade": 3,
"enunciado": "A rosa da carta traz declinação <b>21°00′ W</b> (2012), aumentando <b>6′ por ano</b> para W. Estamos em 2026. A curva de desvios dá <b>4° E</b> para a proa em uso e a agulha de governo lê <b>105°</b> para um farol. Qual é a marcação verdadeira? (Aproxime a declinação a 0,5°.)",
"alternativas": [
"088,0°",
"078,5°",
"131,5°",
"086,5°"
],
"correta": 3,
"explicacao": "Em 14 anos a declinação cresce 14 × 6′ = 84′ para W: 21°00′ + 1°24′ = 22°24′, que se aproxima a 22,5° W. Mv = Mag + Dag + Dec = 105° + 4° − 22,5° = 86,5°. Sem atualizar a declinação, o resultado seria 88,0°. 78,5° trata o desvio E como se fosse W. 131,5° soma a declinação W, o erro de sinal clássico.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 (declinação e desvio na marcação)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0051",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 1,
"enunciado": "Um veleiro navega a <b>7,5 nós</b>. Quanto ele percorre em <b>40 minutos</b>?",
"alternativas": [
"3,0 M",
"5,0 M",
"4,5 M",
"7,5 M"
],
"correta": 1,
"explicacao": "Distância = velocidade × tempo, com o tempo em horas: 40 min = 40/60 h ≈ 0,667 h, e 7,5 × 0,667 = 5,0 M. Escrever 40 min como 0,4 h (3,0 M) ou 0,6 h (4,5 M) confunde minutos com décimos de hora. Tomar a velocidade como distância (7,5 M) ignora o tempo.",
"referencia": "Miguens, vol. I, cap. 5, item 5.2 (distância, velocidade e tempo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0052",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 1,
"enunciado": "Uma Carta de Correntes de Maré indica, num trecho, corrente de <b>rumo 270°</b> e <b>2 nós</b>. O que isso significa?",
"alternativas": [
"A água vem do oeste a 2 nós e empurra o barco para o leste.",
"O barco ganha 2 nós de velocidade, qualquer que seja o seu rumo.",
"A água corre para o oeste a 2 nós e leva o barco junto.",
"O vento sopra do oeste a 2 nós e a água o acompanha."
],
"correta": 2,
"explicacao": "O rumo da corrente é para onde a água flui: 270° é oeste. Dizer que a água vem do oeste inverte o sentido (a água vai para o oeste, não vem dele). Dizer que o barco ganha 2 nós em qualquer rumo dá à corrente um ganho fixo de velocidade, mas ela só soma ao barco quando age a favor; de través ou contra, muda o rumo e a velocidade no fundo. Dizer que o vento sopra do oeste descreve o vento, que se indica pelo lado de onde sopra. Corrente e vento são grandezas diferentes.",
"referencia": "Miguens, vol. I, cap. 5, item 5.5 (rumo da corrente)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0053",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 1,
"enunciado": "Um veleiro navega com <b>5,0 nós</b> na água, rumo na superfície 090°, e a corrente tem <b>rumo 090°</b> e <b>1,5 nó</b>. Qual é a velocidade no fundo?",
"alternativas": [
"6,5 nós",
"3,5 nós",
"5,0 nós",
"7,5 nós"
],
"correta": 0,
"explicacao": "Com a corrente na mesma direção e sentido do barco, o vetor fundo é a soma: 5,0 + 1,5 = 6,5 nós. 3,5 nós valeria se a corrente fosse contrária. 5,0 nós ignora a corrente: o odômetro mede o deslocamento na água, mas o que importa para a chegada é a velocidade no fundo. 7,5 nós multiplica as duas velocidades (5,0 × 1,5), o que não tem sentido físico.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.5 e 5.6 (corrente e velocidade no fundo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0054",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 1,
"enunciado": "Um veleiro sai às <b>0915</b> para uma boia a <b>20 M</b>, com <b>6 nós</b> de velocidade no fundo. Qual é a hora estimada de chegada?",
"alternativas": [
"1248",
"1255",
"1215",
"1235"
],
"correta": 3,
"explicacao": "Tempo = 20 ÷ 6 ≈ 3,33 h. A parte decimal 0,33 h vale 0,33 × 60 = 20 min, então 3 h 20 min, e 0915 + 3 h 20 = 1235. Ler 3,33 h como 3 h 33 min (1248) mistura décimos de hora com minutos. 3 h 40 min (1255) e 3 h exatas (1215) não correspondem ao tempo calculado.",
"referencia": "Miguens, vol. I, cap. 5, item 5.2 (distância, velocidade e tempo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0055",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "Rumo na superfície 090°, 6 nós. Às 1200 você tinha uma posição observada. Às 1500, a posição observada ficou <b>1,8 M</b> no <b>rumo 135°</b> da estimada das 1500. Qual é a corrente?",
"alternativas": [
"Rumo 315° e 0,6 nó",
"Rumo 135° e 0,6 nó",
"Rumo 135° e 1,8 nós",
"Rumo 135° e 5,4 nós"
],
"correta": 1,
"explicacao": "A corrente é o vetor que vai da estimada para a observada da mesma hora: rumo 135°. Sua velocidade é a distância dividida pelo tempo desde a última observada: 1,8 ÷ 3 = 0,6 nó. 315° seria a direção de onde a água vem. 1,8 nós esquece de dividir pelo tempo, e 5,4 nós multiplica em vez de dividir.",
"referencia": "Miguens, vol. I, cap. 5, item 5.7, alínea a (determinação da corrente)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0056",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "Veja o esquema. Rumo na superfície <b>090°</b>, <b>6,0 nós</b>; corrente de <b>180°</b>, <b>2,0 nós</b>. Quais são, aproximadamente, o rumo e a velocidade no fundo?",
"alternativas": [
"Rumo 072° e 6,3 nós.",
"Rumo 108° e 8,0 nós.",
"Rumo 108° e 6,3 nós.",
"Rumo 090° e 6,3 nós."
],
"correta": 2,
"explicacao": "Os vetores formam um triângulo retângulo: 6,0 para leste e 2,0 para o sul. O fundo tem √(6² + 2²) ≈ 6,3 nós e se desvia arctg(2/6) ≈ 18° para o sul, isto é, para a direita da proa: 090° + 18° = 108°. 072° desvia para o lado errado (norte). 8,0 nós soma as velocidades como se a corrente fosse de popa. 090° ignora que a corrente de través desvia o caminho.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.6 e 5.7, alínea b (rumo e velocidade no fundo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 200\" role=\"img\" aria-label=\"Esquema fora de escala: vetor da superfície rumo 090° com 6,0 nós, vetor da corrente rumo 180° com 2,0 nós, e o vetor do fundo ligando o início ao fim\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"6\" y=\"6\" width=\"308\" height=\"188\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"40\" y1=\"60\" x2=\"220\" y2=\"60\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><path d=\"M220 60 l-10 -5 v10 z\" fill=\"var(--ink)\"/><line x1=\"220\" y1=\"60\" x2=\"220\" y2=\"120\" stroke=\"var(--ink)\" stroke-width=\"2.5\" stroke-dasharray=\"6 4\"/><path d=\"M220 120 l-5 -10 h10 z\" fill=\"var(--ink)\"/><line x1=\"40\" y1=\"60\" x2=\"220\" y2=\"120\" stroke=\"var(--nav-red)\" stroke-width=\"2.5\"/><circle cx=\"40\" cy=\"60\" r=\"6\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><g fill=\"var(--ink)\" font-size=\"12\" font-family=\"sans-serif\"><text x=\"60\" y=\"48\">superfície: 090° · 6,0 nós</text><text x=\"228\" y=\"92\">corrente:</text><text x=\"228\" y=\"106\">180° · 2,0 nós</text><text x=\"56\" y=\"130\" fill=\"var(--nav-red)\">fundo: rumo e velocidade?</text></g>\n</svg>"
}
},
{
"id": "mestre-0057",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "Você quer manter o rumo no fundo <b>000°</b>. A velocidade do barco na água é <b>6 nós</b> e a corrente tem <b>rumo 090°</b> e <b>3 nós</b>. Qual é, aproximadamente, o rumo a governar?",
"alternativas": [
"330°",
"030°",
"000°",
"300°"
],
"correta": 0,
"explicacao": "A corrente vem de través e empurra o barco para leste (BE). Para anular a componente lateral, a proa vai para o lado oposto, de modo que 6 · sen θ = 3, logo sen θ = 0,5 e θ = 30°: 000° − 30° = 330°. 030° corrige para o lado errado e aumenta o desvio. 000° ignora a corrente. 300° vem de arccos(0,5) = 60°, que não é a relação certa.",
"referencia": "Miguens, vol. I, cap. 5, item 5.7, alínea d (rumo a governar)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0058",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "A posição estimada das 1000 está em <b>23°30,0′ S</b>. Há uma corrente de <b>rumo 000°</b> e <b>1,5 nó</b> atuando desde a última posição observada, feita 2 h antes. Qual é a latitude da posição estimada corrigida?",
"alternativas": [
"23°33,0′ S",
"23°28,5′ S",
"23°30,0′ S",
"23°27,0′ S"
],
"correta": 3,
"explicacao": "A estimada corrigida soma à estimada o vetor corrente pelo tempo decorrido: 1,5 nó × 2 h = 3,0 M para 000° (norte). No Hemisfério Sul, ir para o norte diminui a latitude: 23°30,0′ − 3,0′ = 23°27,0′ S. A resposta 23°33,0′ S inverte o sentido da corrente; 23°28,5′ S usa 1,5 M, esquecendo de multiplicar pelo tempo; 23°30,0′ S ignora a corrente e deixa a estimada como estava.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.5 e 5.7, alínea e (posição estimada corrigida)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0059",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "A proa de um veleiro aponta para <b>090°</b>. O vento sopra de <b>000°</b> (do norte) e o abatimento medido é de <b>4°</b>. Sem corrente, qual é, aproximadamente, o rumo no fundo?",
"alternativas": [
"086°",
"094°",
"090°",
"004°"
],
"correta": 1,
"explicacao": "O abatimento é o ângulo entre o rumo na superfície e o rumo no fundo, contado para BE ou BB (Manual, item 5.5). O vento vindo do norte empurra o barco para o sul, que, para quem vai a leste, fica à direita (BE): 090° + 4° = 094°. 086° põe o barco para o norte, para barlavento, quando o vento o empurra para sotavento. 090° ignora o abatimento, e 004° soma o abatimento à direção do vento, o que não tem sentido.",
"referencia": "Miguens, vol. I, cap. 5, item 5.4 (efeito do vento)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0060",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "O rumo <b>verdadeiro</b> a governar é <b>120°</b>. A declinação é <b>21° W</b> e o desvio da agulha para essa proa é <b>3° W</b>. Qual é o rumo da agulha a passar ao timoneiro?",
"alternativas": [
"096°",
"138°",
"144°",
"102°"
],
"correta": 2,
"explicacao": "Do verdadeiro para a agulha, os sinais se invertem: Rmg = Rv − Dec = 120° − (−21°) = 141°, e Rag = Rmg − Dag = 141° − (−3°) = 144°. 096° troca o sinal das duas correções. 138° acerta a declinação, mas erra o sinal do desvio. 102° erra o sinal da declinação.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 (conversão de rumos)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0061",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 2,
"enunciado": "Depois de navegar <b>25 M</b> desde a última posição observada, qual é, de forma empírica, o raio da incerteza da posição estimada?",
"alternativas": [
"2,5 M",
"0,25 M",
"5 M",
"12,5 M"
],
"correta": 0,
"explicacao": "O Manual admite, de forma empírica, que a posição estimada tem consistência de 0,1 (10%) da distância percorrida desde a última posição observada: 25 M × 0,10 = 2,5 M. Esse raio define a área de incerteza da estimada. Os distratores 0,25 M (1%), 5 M (20%) e 12,5 M (50%) não correspondem ao critério do Manual.",
"referencia": "Miguens, vol. I, cap. 5, item 5.8 (consistência da estimada)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0062",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 3,
"enunciado": "Você quer chegar, em <b>3 h</b>, a um ponto a <b>12 M</b> no rumo <b>000°</b>. A corrente tem <b>rumo 090°</b> e <b>3,0 nós</b>. Quais são o rumo e a velocidade na água necessários?",
"alternativas": [
"Rumo 037° e 5,0 nós",
"Rumo 323° e 4,0 nós",
"Rumo 000° e 4,0 nós",
"Rumo 323° e 5,0 nós"
],
"correta": 3,
"explicacao": "A velocidade no fundo necessária é 12 ÷ 3 = 4,0 nós para o norte. O vetor superfície é o fundo menos a corrente: 4,0 para o norte e 3,0 para oeste, ou seja, √(4² + 3²) = 5,0 nós, e a proa fica arctg(3/4) ≈ 37° a oeste do norte: 323°. O rumo 037° corrige para o lado da corrente e aumenta o desvio. Os 4,0 nós com rumo 323° usam a velocidade no fundo, não a velocidade na água. Governar 000° a 4,0 nós, ignorando a corrente, deixaria o barco 9 M a leste do ponto.",
"referencia": "Miguens, vol. I, cap. 5, item 5.7, alínea c (chegar a um ponto numa hora marcada)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0063",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 3,
"enunciado": "Veja o croqui. Você saiu de A às <b>0800</b> (posição observada) no rumo <b>090°</b>, a <b>6,0 nós</b>. Às <b>1000</b>, a posição observada ficou <b>3,0 M ao sul</b> da estimada. Quais são a corrente e o abatimento?",
"alternativas": [
"Corrente 180° e 1,5 nó; abatimento de cerca de 14° para BE.",
"Corrente 180° e 1,5 nó; abatimento de cerca de 14° para BB.",
"Corrente 000° e 1,5 nó; abatimento de cerca de 14° para BE.",
"Corrente 180° e 3,0 nós; abatimento de cerca de 14° para BE."
],
"correta": 0,
"explicacao": "A corrente vai da estimada para a observada: rumo 180°, e 3,0 M em 2 h dão 1,5 nó. O caminho no fundo (A até a observada) tem 12 M para leste e 3 M para o sul, logo rumo 090° + arctg(3/12) ≈ 104°. No sentido do Manual (item 5.5), o abatimento é o ângulo entre o rumo na superfície (090°) e o rumo no fundo (104°), isto é, o efeito conjunto de tudo o que desvia o barco; vale ≈ 14°, e o sul fica à direita de quem vai a leste, isto é, para BE. BB seria o lado oposto. Corrente 000° inverte o sentido. 3,0 nós esquece de dividir pelas 2 horas.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.5 (abatimento) e 5.7, alínea a (determinação da corrente)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 190\" role=\"img\" aria-label=\"Croqui fora de escala: de A, a estimada das 1000 fica 12 milhas a leste; a posição observada das 1000 fica 3,0 milhas ao sul da estimada\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"6\" y=\"6\" width=\"308\" height=\"178\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"40\" y1=\"60\" x2=\"260\" y2=\"60\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><line x1=\"260\" y1=\"60\" x2=\"260\" y2=\"110\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><line x1=\"40\" y1=\"60\" x2=\"260\" y2=\"110\" stroke=\"var(--nav-red)\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"60\" r=\"5\" fill=\"var(--ink)\"/><circle cx=\"260\" cy=\"60\" r=\"5\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\"/><circle cx=\"260\" cy=\"110\" r=\"6\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2.5\"/><g fill=\"var(--ink)\" font-size=\"12\" font-family=\"sans-serif\"><text x=\"22\" y=\"44\">A · 0800</text><text x=\"120\" y=\"50\">090° · 6,0 nós · 2 h</text><text x=\"196\" y=\"42\">estimada 1000</text><text x=\"270\" y=\"114\">observada</text><text x=\"270\" y=\"128\">1000</text><text x=\"268\" y=\"88\">3,0 M</text><text x=\"60\" y=\"140\" fill=\"var(--nav-red)\">caminho no fundo</text></g>\n</svg>"
}
},
{
"id": "mestre-0064",
"nivel": "mestre",
"tema": "Navegação estimada e corrente",
"dificuldade": 3,
"enunciado": "A estimada das 1000 está em <b>23°30,0′ S, 042°50,0′ W</b>. A corrente tem <b>rumo 090°</b> e <b>1,5 nó</b>, atuando há 2 h. Qual é a posição estimada corrigida? (Use cos 23,5° ≈ 0,92.)",
"alternativas": [
"23°30,0′ S e 042°53,3′ W",
"23°30,0′ S e 042°47,0′ W",
"23°30,0′ S e 042°46,7′ W",
"23°30,0′ S e 042°47,2′ W"
],
"correta": 2,
"explicacao": "A corrente desloca o barco 1,5 × 2 = 3,0 M para leste, sem mudar a latitude. Em longitude, o apartamento (deslocamento leste-oeste em milhas) se divide pelo cosseno da latitude: 3,0 ÷ 0,92 ≈ 3,3′. Indo para leste, a longitude W diminui: 042°50,0′ − 3,3′ = 042°46,7′ W. Somar (042°53,3′ W) inverte o sentido. Usar 3,0′ esquece a conversão e multiplicar pelo cosseno (2,8′) faz a conversão ao contrário.",
"referencia": "Miguens, vol. I, cap. 5, item 5.7, alínea e; vol. II, cap. 33, item 33.2 (apartamento e diferença de longitude: Δλ = ap · sec φm)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0065",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 1,
"enunciado": "Um veleiro vai de <b>23°45,0′ S</b> até <b>22°15,0′ S</b>, ambos no mesmo meridiano. Quais são o rumo verdadeiro e a distância?",
"alternativas": [
"Rumo 180° e 90 M",
"Rumo 000° e 90 M",
"Rumo 000° e 130 M",
"Rumo 000° e 1,5 M"
],
"correta": 1,
"explicacao": "A diferença de latitude é 23°45′ − 22°15′ = 1°30′ = 90′. Um minuto de latitude vale uma milha, então são 90 M, e a latitude Sul diminui, isto é, o rumo é norte (000°). 180° iria para o sul. 130 M trata 1°30′ como 130′ em vez de 90′. 1,5 M confunde graus com milhas.",
"referencia": "Miguens, vol. I, cap. 1, itens 1.6 e 1.7.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0066",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 1,
"enunciado": "Um veleiro deve navegar no rumo <b>verdadeiro 045°</b>. A declinação é <b>20° W</b> e o desvio da agulha é desprezível. Qual é o rumo magnético correspondente?",
"alternativas": [
"025°",
"045°",
"065°",
"245°"
],
"correta": 2,
"explicacao": "Do rumo verdadeiro para o magnético, subtrai-se a declinação com seu sinal (W é negativa): 045° − (−20°) = 065°. 045° ignora a declinação; 025° aplica a conversão contrária, do magnético para o verdadeiro; 245° é a recíproca do rumo, 180° adiante, sem relação com a declinação.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 (conversão de rumos)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0067",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 1,
"enunciado": "Um veleiro percorreu <b>15 M</b> em <b>2 h 30 min</b>. Qual foi a velocidade média?",
"alternativas": [
"6,0 nós",
"6,5 nós",
"7,5 nós",
"5,0 nós"
],
"correta": 0,
"explicacao": "Velocidade = distância ÷ tempo, com o tempo em horas: 2 h 30 min = 2,5 h, então 15 ÷ 2,5 = 6,0 nós. Escrever 2 h 30 como 2,3 h dá 6,5 nós. Ignorar os 30 minutos dá 7,5 nós. Arredondar o tempo para 3 h dá 5,0 nós.",
"referencia": "Miguens, vol. I, cap. 5, item 5.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0068",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 1,
"enunciado": "Você quer chegar a uma boia às <b>1600</b>. Ela está a <b>18 M</b> e o seu veleiro faz <b>4 nós</b> no fundo. A que horas deve largar?",
"alternativas": [
"1110",
"1200",
"2030",
"1130"
],
"correta": 3,
"explicacao": "Tempo de viagem = 18 ÷ 4 = 4,5 h = 4 h 30 min. Para chegar às 1600, larga-se 4 h 30 antes: 1130. Ler 4,5 h como 4 h 50 (1110) mistura décimos de hora com minutos. 4 h exatas (1200) desprezam a meia hora. Somar 4 h 30 às 1600 (2030) dá a hora de chegada de quem saísse às 1600, e não a de largada, que é o que se pede.",
"referencia": "Miguens, vol. I, cap. 5, item 5.2 (distância, velocidade e tempo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0069",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "De A, o ponto B fica <b>24′ ao norte</b> em latitude e a um <b>apartamento de 18 M para o leste</b> (veja o croqui). Quais são o rumo verdadeiro e a distância de A a B?",
"alternativas": [
"Rumo 053° e 30 M",
"Rumo 037° e 30 M",
"Rumo 037° e 42 M",
"Rumo 053° e 42 M"
],
"correta": 1,
"explicacao": "O rumo é o ângulo a partir do norte: tg R = apartamento ÷ diferença de latitude = 18 ÷ 24 = 0,75, logo R ≈ 037°. A distância é a hipotenusa: √(24² + 18²) = 30 M. 053° usaria 24 ÷ 18, que mede o ângulo a partir do leste. 42 M soma os catetos em vez de calcular a hipotenusa.",
"referencia": "Miguens, vol. II, cap. 33, item 33.2 (derrota loxodrômica: Δφ = d·cos R; ap = d·sen R)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 200\" role=\"img\" aria-label=\"Croqui em escala aproximada: de A até B há 24 minutos de latitude para o norte e 18 milhas de apartamento para o leste\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"6\" y=\"6\" width=\"308\" height=\"188\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"70\" y1=\"150\" x2=\"160\" y2=\"150\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><line x1=\"160\" y1=\"150\" x2=\"160\" y2=\"30\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><line x1=\"70\" y1=\"150\" x2=\"160\" y2=\"30\" stroke=\"var(--nav-red)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/><path d=\"M150 150 v-10 h10\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1\"/><circle cx=\"70\" cy=\"150\" r=\"5\" fill=\"var(--ink)\"/><circle cx=\"160\" cy=\"30\" r=\"5\" fill=\"var(--ink)\"/><line x1=\"285\" y1=\"60\" x2=\"285\" y2=\"30\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><path d=\"M279 36 L285 26 L291 36\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><g fill=\"var(--ink)\" font-size=\"12\" font-family=\"sans-serif\"><text x=\"56\" y=\"170\">A</text><text x=\"170\" y=\"34\">B</text><text x=\"280\" y=\"76\">N</text><text x=\"64\" y=\"186\">apartamento: 18 M (leste)</text><text x=\"170\" y=\"92\">Δlat: 24′ N</text><text x=\"170\" y=\"106\">(24 M)</text><text x=\"20\" y=\"92\">rumo e</text><text x=\"20\" y=\"106\">distância?</text></g>\n</svg>"
}
},
{
"id": "mestre-0070",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "Um veleiro navega <b>20 M</b> exatamente para o <b>leste</b> (Rv 090°) em latitude de cerca de <b>23° S</b>. Qual é a variação de longitude? (Use cos 23° ≈ 0,92.)",
"alternativas": [
"21,7′ para leste",
"18,4′ para leste",
"20,0′ para leste",
"21,7′ para oeste"
],
"correta": 0,
"explicacao": "Fora do Equador, o minuto de longitude vale menos que uma milha: apartamento = Δlong × cos(lat). Então Δlong = 20 ÷ 0,92 ≈ 21,7′. Multiplicar (18,4′) faz a conversão ao contrário. Igualar minutos e milhas (20,0′) só vale para latitude. E navegando para o leste a longitude varia para leste, nunca para oeste.",
"referencia": "Miguens, vol. II, cap. 33, item 33.2 (apartamento e diferença de longitude: ap = Δλ · cos φm)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "mestre-0071",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "Você quer navegar no fundo no rumo <b>090°</b> por <b>18 M</b>, saindo às <b>0900</b>. Seu barco faz <b>6,5 nós</b> na água e a corrente tem <b>rumo 180°</b> e <b>2,5 nós</b>. Qual é, aproximadamente, o rumo a governar e a hora de chegada?",
"alternativas": [
"Rumo 113° e chegada às 1200",
"Rumo 067° e chegada às 1146",
"Rumo 090° e chegada às 1146",
"Rumo 067° e chegada às 1200"
],
"correta": 3,
"explicacao": "A corrente empurra para o sul (BE de quem vai a leste), então a proa deve apontar para o norte do rumo desejado: sen θ = 2,5 ÷ 6,5, logo θ ≈ 23°, e RN = 090° − 23° = 067°. A velocidade no fundo é √(6,5² − 2,5²) = 6,0 nós, e 18 ÷ 6,0 = 3 h: chegada às 1200. 113° corrige para o lado errado. 1146 usaria os 6,5 nós da água como se fossem velocidade no fundo. E 090° deixaria o barco ser levado para o sul.",
"referencia": "Miguens, vol. I, cap. 5, item 5.7, alínea d (rumo a governar e hora de chegada)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0072",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "A rosa da carta traz declinação <b>19°40′ W</b> em 2008, aumentando <b>6′ por ano</b> para W. Em 2026, você quer navegar no rumo <b>verdadeiro 100°</b>, e o desvio da agulha para essa proa é <b>2° W</b>. Qual é o rumo da agulha? (Aproxime a declinação a 0,5°.)",
"alternativas": [
"121,5°",
"123,5°",
"119,5°",
"076,5°"
],
"correta": 1,
"explicacao": "Em 18 anos a declinação cresce 18 × 6′ = 108′ para W: 19°40′ + 1°48′ = 21°28′, aproximada a 21,5° W. Rmg = 100° − (−21,5°) = 121,5°, e Rag = Rmg − Dag = 121,5° − (−2°) = 123,5°. 121,5° é o rumo magnético, sem o desvio. 119,5° erra o sinal do desvio. 076,5° subtrai a declinação e o desvio em vez de somá-los.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 (atualização da declinação e conversão)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0073",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "Um veleiro percorre <b>9 M a 6 nós</b> e depois <b>8 M a 4 nós</b>, sem corrente. Saindo às <b>0800</b>, qual é a hora estimada de chegada?",
"alternativas": [
"1124",
"1215",
"1130",
"1050"
],
"correta": 2,
"explicacao": "Cada etapa tem seu tempo: 9 ÷ 6 = 1,5 h e 8 ÷ 4 = 2,0 h, ou 3,5 h = 3 h 30 min, e 0800 + 3 h 30 = 1130. Usar a média aritmética das velocidades (17 ÷ 5 = 3 h 24 min, 1124) é erro comum, porque o barco passa mais tempo na etapa lenta. Supor 4 nós (1215) ou 6 nós (1050) em tudo ignora que a velocidade mudou no meio.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.2 e 5.3 (estimada com mudança de velocidade)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0074",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 2,
"enunciado": "Na carta, a sondagem sobre um baixio é <b>2,5 m</b> (nível de redução). No instante da passagem, a maré está <b>1,2 m acima</b> do nível de redução. O calado do veleiro é <b>1,8 m</b>. Qual é a folga sob a quilha?",
"alternativas": [
"1,9 m",
"0,7 m",
"−0,5 m",
"5,5 m"
],
"correta": 0,
"explicacao": "A profundidade real é a sondagem da carta mais a altura da maré acima do nível de redução: 2,5 + 1,2 = 3,7 m. A folga é essa profundidade menos o calado: 3,7 − 1,8 = 1,9 m. 0,7 m ignora a maré. −0,5 m subtrai a maré, o que é o contrário do correto quando a água está acima do nível de redução. 5,5 m soma o calado em vez de subtraí-lo.",
"referencia": "Miguens, vol. I, cap. 10 (maré e sondagem) e cap. 2 (sondagens da carta)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0075",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 3,
"enunciado": "O veleiro parte de <b>23°00,0′ S, 043°00,0′ W</b>. Primeiro navega 2 h no rumo verdadeiro <b>000°</b> a 6,0 nós; depois, 1 h no rumo <b>090°</b> a 6,0 nós. Sem corrente, qual é a posição estimada? (Use cos 22,8° ≈ 0,92.)",
"alternativas": [
"23°12,0′ S e 042°53,5′ W.",
"22°48,0′ S e 042°54,0′ W.",
"22°48,0′ S e 043°06,5′ W.",
"22°48,0′ S e 042°53,5′ W."
],
"correta": 3,
"explicacao": "Na primeira perna o barco anda 12 M para o norte: a latitude Sul diminui 12′, de 23°00,0′ para 22°48,0′ S. Na segunda, anda 6 M para leste (apartamento de 6 M), e 6 ÷ 0,92 ≈ 6,5′ de longitude para leste: 043°00,0′ − 6,5′ = 042°53,5′ W. 23°12,0′ S põe a primeira perna para o sul. 042°54,0′ W esquece a conversão em longitude. 043°06,5′ W desloca para oeste.",
"referencia": "Miguens, vol. I, cap. 5, itens 5.2 e 5.3; vol. II, cap. 33, item 33.2 (apartamento e diferença de longitude)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0076",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 3,
"enunciado": "O rumo da agulha é <b>075°</b>, o desvio para essa proa é <b>3° E</b> e a declinação é <b>22° W</b>. A velocidade na água é <b>6,0 nós</b> e a corrente tem <b>rumo 146°</b> e <b>2,5 nós</b>. Quais são, aproximadamente, o rumo e a velocidade no fundo?",
"alternativas": [
"Rumo 073° e 6,5 nós",
"Rumo 079° e 8,5 nós",
"Rumo 079° e 6,5 nós",
"Rumo 033° e 6,5 nós"
],
"correta": 2,
"explicacao": "Rv = Rag + Dag + Dec = 075° + 3° − 22° = 056°. A corrente (146°) é perpendicular a essa proa e a empurra para a direita: Rfd = 056° + arctg(2,5/6,0) ≈ 056° + 23° = 079°, e velfd = √(6,0² + 2,5²) = 6,5 nós. 073° vem de converter com o sinal do desvio trocado. 8,5 nós soma as velocidades. 033° desvia para o lado oposto ao da corrente.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 e cap. 5, itens 5.5 a 5.7",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0077",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 3,
"enunciado": "Um farol está em <b>23°00,0′ S, 043°10,0′ W</b>. Você o marca aos <b>090°</b> verdadeiros e o radar dá <b>5,0 M</b>. Qual é a sua posição? (Use cos 23° ≈ 0,92.)",
"alternativas": [
"23°00,0′ S e 043°14,6′ W",
"23°00,0′ S e 043°15,4′ W",
"23°00,0′ S e 043°15,0′ W",
"23°00,0′ S e 043°04,6′ W"
],
"correta": 1,
"explicacao": "Com marcação 090° verdadeira, o farol está a leste do barco: o barco está a oeste dele, 5,0 M, na mesma latitude. Em longitude, 5,0 ÷ 0,92 ≈ 5,4′ para oeste: 043°10,0′ + 5,4′ = 043°15,4′ W. Os 4,6′ (043°14,6′ W) multiplicam pelo cosseno, que é a conversão ao contrário. Os 5,0′ (043°15,0′ W) esquecem a conversão em longitude. Os 043°04,6′ W põem o barco a leste do farol, o que inverte a marcação.",
"referencia": "Miguens, vol. I, cap. 4, item 4.3.1 (marcação e distância do mesmo objeto); vol. II, cap. 33, item 33.2 (apartamento e diferença de longitude)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0078",
"nivel": "mestre",
"tema": "Problemas de carta",
"dificuldade": 3,
"enunciado": "Você quer navegar no fundo no rumo verdadeiro <b>000°</b>. A velocidade na água é <b>6,5 nós</b>, a corrente tem <b>rumo 090°</b> e <b>2,5 nós</b>, a declinação é <b>22° W</b> e o desvio para essa proa é <b>2° E</b>. Qual é, aproximadamente, o rumo da agulha a governar?",
"alternativas": [
"357°",
"043°",
"313°",
"020°"
],
"correta": 0,
"explicacao": "A corrente de través, que flui para leste, empurra o barco para leste; a proa vai 23° para oeste: sen θ = 2,5 ÷ 6,5, logo RN = 360° − 23° ≈ 337°. Do verdadeiro para o magnético, a declinação W soma: 337° + 22° = 359°. Do magnético para a agulha, subtrai-se o desvio E: 359° − 2° = 357°. 043° corrige a corrente para o lado errado. 313° aplica a declinação com sinal trocado. 020° só converte 000° e esquece a corrente.",
"referencia": "Miguens, vol. I, cap. 3, item 3.2.5 e cap. 5, item 5.7, alínea d",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0079",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 1,
"enunciado": "Na carta ou na Lista de Faróis, a luz de um farol é descrita como <b>Fl(2) W 10s 15M</b>. Como se lê essa característica?",
"alternativas": [
"Duas luzes brancas fixas, com período de 15 segundos e alcance de 10 milhas.",
"Grupo de dois lampejos de luz branca a cada 15 segundos, com alcance de 10 milhas.",
"Grupo de dois lampejos de luz branca a cada 10 segundos, com alcance de 15 milhas.",
"Grupo de duas ocultações de luz branca a cada 10 segundos, com alcance de 15 milhas."
],
"correta": 2,
"explicacao": "<p>Fl é lampejo (em português, Lp); (2) é o grupo de dois lampejos; W é a cor branca; 10s é o período, do início de um grupo ao início do seguinte; 15M é o alcance, em milhas náuticas.</p><ul><li><b>Duas luzes brancas fixas, com período de 15 segundos e alcance de 10 milhas.</b> — Luz fixa é F e não tem período; Fl indica lampejos.</li><li><b>Grupo de dois lampejos de luz branca a cada 15 segundos, com alcance de 10 milhas.</b> — Troca o período (10 s) pelo alcance (15 M) e vice-versa.</li><li><b>Grupo de duas ocultações de luz branca a cada 10 segundos, com alcance de 15 milhas.</b> — Ocultação é Oc, luz mais longa que a escuridão; Fl é luz mais curta que a escuridão.</li></ul>",
"referencia": "Lista de Faróis (DH2), Introdução (características de luz); Carta 12000 (INT 1), símbolos de luz; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0080",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 1,
"enunciado": "No planejamento, você quer consultar a altitude do foco, a fase detalhada da luz e os alcances luminoso e geográfico de um farol. Que publicação da DHN traz esses dados?",
"alternativas": [
"Lista de Faróis.",
"Lista de Sinais Cegos.",
"Lista de Auxílios-Rádio.",
"Catálogo de Cartas e Publicações."
],
"correta": 0,
"explicacao": "<p>A Lista de Faróis descreve cada sinal luminoso: número de ordem, posição, característica com fase detalhada, altitude do foco, alcances luminoso e geográfico e descrição da estrutura.</p><ul><li><b>Lista de Sinais Cegos.</b> — Traz boias cegas e balizas, ou seja, sinais sem luz, que não têm característica luminosa.</li><li><b>Lista de Auxílios-Rádio.</b> — Reúne radiofaróis, sinais horários, boletins meteorológicos e estações costeiras.</li><li><b>Catálogo de Cartas e Publicações.</b> — É o índice das cartas e publicações existentes, com número, escala e edição.</li></ul>",
"referencia": "Lista de Faróis (DH2), DHN/CHM; NORMAM-211/DPC, Anexo 5-A, item 2.2 f)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0081",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 1,
"enunciado": "Que tipo de informação você encontra na Lista de Auxílios-Rádio, da DHN?",
"alternativas": [
"Altitude do foco e alcance geográfico dos faróis da costa brasileira, em tabelas.",
"Horários de preamar e baixa-mar de cada porto brasileiro, dia a dia, ao longo do ano.",
"Correções que devem ser feitas à mão nas cartas de papel, para cada área marítima.",
"Radiofaróis, sinais horários, boletins meteorológicos e estações costeiras."
],
"correta": 3,
"explicacao": "<p>A Lista de Auxílios-Rádio reúne os auxílios radioelétricos à navegação e os serviços-rádio úteis a quem navega na costa do Brasil e no Atlântico Sul.</p><ul><li><b>Altitude do foco e alcance geográfico dos faróis da costa brasileira, em tabelas.</b> — Isso está na Lista de Faróis.</li><li><b>Horários de preamar e baixa-mar de cada porto brasileiro, dia a dia, ao longo do ano.</b> — Isso está nas Tábuas das Marés.</li><li><b>Correções que devem ser feitas à mão nas cartas de papel, para cada área marítima.</b> — Isso vem nos Avisos aos Navegantes.</li></ul>",
"referencia": "Lista de Auxílios-Rádio (DH8), DHN/CHM; NORMAM-211/DPC, Anexo 5-A, item 2.2 k)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-auxilios-radio"
},
{
"id": "mestre-0082",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 1,
"enunciado": "Você vai planejar uma travessia e precisa descobrir quais cartas cobrem cada trecho da costa, com número, escala e edição. Por onde começar?",
"alternativas": [
"Pelo Catálogo de Cartas e Publicações, nos cartogramas por trecho de costa.",
"Pela Carta 12000 (INT 1), que relaciona todas as cartas náuticas existentes.",
"Pelo Atlas de Cartas Piloto, que mostra as cartas de cada porto.",
"Pelo Roteiro, que traz a relação de cartas e edições vigentes."
],
"correta": 0,
"explicacao": "<p>O Catálogo tem a lista de todas as cartas, os cartogramas por trecho de costa (com número, escala e edição) e a lista das publicações. É a porta de entrada do planejamento.</p><ul><li><b>Pela Carta 12000 (INT 1), que relaciona todas as cartas náuticas existentes.</b> — A Carta 12000 é o dicionário de símbolos e abreviaturas, não um índice de cartas.</li><li><b>Pelo Atlas de Cartas Piloto, que mostra as cartas de cada porto.</b> — O Atlas traz ventos e correntes médios do Atlântico, em 12 cartas, uma por mês.</li><li><b>Pelo Roteiro, que traz a relação de cartas e edições vigentes.</b> — O Roteiro dá subsídios para navegar e entrar nos portos; não é o catálogo de cartas.</li></ul>",
"referencia": "Catálogo de Cartas e Publicações (CHM), 15ª ed. 2026-2030; NORMAM-211/DPC, Anexo 5-A, item 2.2 i)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/catalogo-de-cartas-e-publicacoes"
},
{
"id": "mestre-0083",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 2,
"enunciado": "Um farol tem o foco a 64 m de altitude. Você o observa com o olho a 4 m acima da água. Pela fórmula da Lista de Faróis, <b>D = 1,927 (√H + √h)</b>, com H e h em metros, qual é o alcance geográfico, em milhas?",
"alternativas": [
"Cerca de 15,4 milhas.",
"Cerca de 15,9 milhas.",
"Cerca de 23,1 milhas.",
"Cerca de 19,3 milhas."
],
"correta": 3,
"explicacao": "<p>Conta: √64 = 8 e √4 = 2; D = 1,927 × (8 + 2) = 19,27, ou cerca de 19,3 milhas.</p><ul><li><b>Cerca de 15,4 milhas.</b> — É 1,927 × 8: esqueceu a altura do olho do observador.</li><li><b>Cerca de 15,9 milhas.</b> — É 1,927 × √68: tirou a raiz da soma das alturas em vez de somar as raízes.</li><li><b>Cerca de 23,1 milhas.</b> — É 1,927 × (8 + 4): usou a altura do olho sem tirar a raiz.</li></ul>",
"referencia": "Lista de Faróis (DH2), Introdução, item 3.5; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0084",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 2,
"enunciado": "Um farol tem alcance luminoso de 25 M e alcance geográfico de 20 M, ambos pela Lista de Faróis. Numa noite de chuva forte, com visibilidade de apenas 5 milhas, o que ocorre com a distância em que você verá a luz?",
"alternativas": [
"Continua em 20 M, pois o alcance geográfico não depende da atmosfera, e só ele vale na prática.",
"Aumenta, pois a chuva forte espalha a luz do farol e a torna visível a mais distância.",
"Continua em 25 M, pois o alcance luminoso é uma característica fixa do farol, impressa na Lista.",
"Cai, podendo ficar abaixo de 20 M, pois o alcance luminoso depende da visibilidade."
],
"correta": 3,
"explicacao": "<p>O alcance luminoso publicado vale para uma atmosfera padrão (T = 0,85, visibilidade de 18,4 milhas). Com visibilidade de 5 milhas, ele cai muito e pode ficar abaixo do geográfico; vale sempre o menor dos dois.</p><ul><li><b>Continua em 20 M, pois o alcance geográfico não depende da atmosfera, e só ele vale na prática.</b> — O geográfico não muda, mas o limite passa a ser o luminoso, que é menor.</li><li><b>Aumenta, pois a chuva forte espalha a luz do farol e a torna visível a mais distância.</b> — A chuva absorve e dispersa a luz, reduzindo a distância de visão.</li><li><b>Continua em 25 M, pois o alcance luminoso é uma característica fixa do farol, impressa na Lista.</b> — O número publicado vale para uma visibilidade padrão e não se sustenta com chuva.</li></ul>",
"referencia": "Lista de Faróis (DH2), Introdução, Instruções item 1 (6ª coluna, Alcances) e item 3.5; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0085",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 2,
"enunciado": "O Aviso aos Navegantes informa que um farol por onde você passará está apagado para manutenção, por tempo limitado (Aviso Temporário, T). Como lançar essa correção na sua carta de papel?",
"alternativas": [
"A caneta, com o número do aviso anotado ao lado do farol, para não esquecer.",
"A lápis, para poder apagar a marca quando o aviso for cancelado ou se encerrar.",
"Colando um trecho de carta (\"bacalhau\") sobre a área do farol, como em qualquer aviso.",
"Não corrigir, porque só os avisos permanentes alteram a carta de papel."
],
"correta": 1,
"explicacao": "<p>Avisos Temporários (T) e Preliminares (P) descrevem mudanças passageiras ou futuras. Por convenção de prática, lançam-se a lápis, para poder apagar quando o aviso for cancelado; só os Permanentes vão a caneta.</p><ul><li><b>A caneta, com o número do aviso anotado ao lado do farol, para não esquecer.</b> — Caneta é para avisos permanentes, que são definitivos.</li><li><b>Colando um trecho de carta (\"bacalhau\") sobre a área do farol, como em qualquer aviso.</b> — Os bacalhaus acompanham alguns avisos permanentes (Seção VIII), não os temporários.</li><li><b>Não corrigir, porque só os avisos permanentes alteram a carta de papel.</b> — Um farol apagado é perigo para quem passa; o aviso temporário deve ser lançado na carta, a lápis.</li></ul>",
"referencia": "Avisos aos Navegantes, DH21 (Seções III e VIII); NORMAM-211/DPC, Anexo 5-A, item 2.2 h)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-aviso-aos-navegantes-tela"
},
{
"id": "mestre-0086",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 2,
"enunciado": "Você quer escolher o mês mais favorável, em ventos e correntes médios, para uma travessia no Atlântico Sul. Que publicação da DHN reúne essas médias climatológicas?",
"alternativas": [
"Cartas de Correntes de Maré, com setas referidas à hora da preamar.",
"Atlas de Cartas Piloto, com 12 cartas, uma por mês, de ventos e correntes.",
"Tábuas das Marés, com as previsões de preamar e baixa-mar, dia a dia.",
"Lista de Auxílios-Rádio, com os radiofaróis e os boletins meteorológicos."
],
"correta": 1,
"explicacao": "<p>O Atlas de Cartas Piloto traz ventos, correntes, temperaturas e outras médias do Atlântico, mês a mês. Serve para planejar época e rota, nunca para substituir a previsão do tempo.</p><ul><li><b>Cartas de Correntes de Maré, com setas referidas à hora da preamar.</b> — Só cobrem portos específicos e mostram a corrente de maré, que é local e de curto prazo.</li><li><b>Tábuas das Marés, com as previsões de preamar e baixa-mar, dia a dia.</b> — Dão as horas e as alturas das marés, não ventos nem correntes oceânicas.</li><li><b>Lista de Auxílios-Rádio, com os radiofaróis e os boletins meteorológicos.</b> — Indicam os auxílios e serviços-rádio, mas não trazem médias de ventos e correntes.</li></ul>",
"referencia": "Atlas de Cartas Piloto (DHN/CHM); NORMAM-211/DPC, Anexo 5-A, item 2.2 m)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-3"
},
{
"id": "mestre-0087",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 3,
"enunciado": "A Carta de Correntes de Maré de um porto mostra a corrente em folhas, referidas à hora da preamar. Pela Tábua das Marés, a preamar do dia é às 14h40 (hora local), e você vai atravessar o canal às 11h40. Qual folha consultar e o que ela mostra?",
"alternativas": [
"A de 3 horas antes da preamar, com setas de direção e números de velocidade da corrente.",
"A de 3 horas depois da preamar, com setas de direção e números de velocidade da corrente.",
"A de 3 horas antes da preamar, com setas de direção e números de altura da maré.",
"A de 3 horas antes da baixa-mar, com setas de direção e números de velocidade da corrente."
],
"correta": 0,
"explicacao": "<p>De 11h40 a 14h40 são 3 horas: a travessia será 3 horas antes da preamar. Nas folhas, as setas dão a direção e os números a velocidade da corrente, que entram direto no triângulo de corrente.</p><ul><li><b>A de 3 horas depois da preamar, com setas de direção e números de velocidade da corrente.</b> — 11h40 vem antes de 14h40, não depois.</li><li><b>A de 3 horas antes da preamar, com setas de direção e números de altura da maré.</b> — Os números das folhas são velocidades da corrente, não alturas da maré.</li><li><b>A de 3 horas antes da baixa-mar, com setas de direção e números de velocidade da corrente.</b> — As folhas são referidas à preamar, não à baixa-mar.</li></ul>",
"referencia": "Cartas de Correntes de Maré (DHN/CHM); Tábuas das Marés (DHN); Miguens, vol. I, cap. 10; NORMAM-211/DPC, Anexo 5-A, item 2.2 l)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes-2"
},
{
"id": "mestre-0088",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 2,
"enunciado": "Qual associação entre uma publicação da DHN e o seu conteúdo está <b>correta</b>?",
"alternativas": [
"Lista de Sinais Cegos: faróis e faroletes, com altitude do foco e alcances.",
"Carta 12000 (INT 1): relação das cartas e publicações vigentes, com escala e edição.",
"Roteiro: subsídios para navegar ao longo da costa, nos canais e nas aterragens.",
"Avisos aos Navegantes: previsão do tempo e avisos de mau tempo para cada área."
],
"correta": 2,
"explicacao": "<p>O Roteiro (três volumes: Costa Norte, Leste e Sul) complementa as cartas, sem descrevê-las, com subsídios para navegar na costa, nos canais e nas aterragens, e traz regulamentos e recursos dos portos.</p><ul><li><b>Lista de Sinais Cegos: faróis e faroletes, com altitude do foco e alcances.</b> — A Lista de Sinais Cegos traz boias cegas e balizas, sinais sem luz.</li><li><b>Carta 12000 (INT 1): relação das cartas e publicações vigentes, com escala e edição.</b> — A Carta 12000 é o dicionário de símbolos e abreviaturas; a relação de cartas está no Catálogo.</li><li><b>Avisos aos Navegantes: previsão do tempo e avisos de mau tempo para cada área.</b> — Os Avisos aos Navegantes atualizam cartas e publicações; a previsão vem dos boletins meteorológicos.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.2; Roteiro, Lista de Sinais Cegos e Avisos aos Navegantes (DHN/CHM)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/roteiros"
},
{
"id": "mestre-0089",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 3,
"enunciado": "Um farol, segundo a Lista, tem o foco a 81 m de altitude e alcance luminoso de 24 M. Numa noite com a transparência atmosférica padrão da Lista, você o procura com o olho a 9 m de altura. Qual a maior distância em que o verá pela primeira vez?",
"alternativas": [
"Cerca de 23,1 milhas, o alcance geográfico.",
"24 milhas, o alcance luminoso da Lista.",
"Cerca de 17,3 milhas, pela altitude do farol.",
"Cerca de 18,3 milhas, pela soma das alturas."
],
"correta": 0,
"explicacao": "<p>Alcance geográfico: D = 1,927 × (√81 + √9) = 1,927 × (9 + 3) = 23,1 M. Como o luminoso é 24 M, o limite é o menor dos dois: 23,1 M. A curvatura da Terra esconde a luz antes de ela se esgotar.</p><ul><li><b>24 milhas, o alcance luminoso da Lista.</b> — Seria o limite se o geográfico fosse maior; aqui o geográfico (23,1 M) é menor.</li><li><b>Cerca de 17,3 milhas, pela altitude do farol.</b> — É 1,927 × 9: considerou só a altitude do farol e esqueceu a altura do olho.</li><li><b>Cerca de 18,3 milhas, pela soma das alturas.</b> — É 1,927 × √90: tirou a raiz da soma das alturas em vez de somar as raízes.</li></ul>",
"referencia": "Lista de Faróis (DH2), Introdução, item 3.5",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0090",
"nivel": "mestre",
"tema": "Auxílios e publicações",
"dificuldade": 3,
"enunciado": "A Lista de Faróis diz que um farol mostra luz <b>encarnada nas marcações de 070° a 085°</b> e branca nas demais, marcações verdadeiras tomadas do mar para o farol. Com a bússola de mão (desvio já corrigido), você mede a marcação magnética 088° do farol. A declinação magnética local é 6° W. Que cor você vê?",
"alternativas": [
"Encarnada, pois a marcação verdadeira é 082°, dentro do setor.",
"Branca, pois 088° está fora do setor encarnado, que vai de 070° a 085°.",
"Branca, pois a marcação verdadeira seria 094°, fora do setor encarnado.",
"Branca, pois a marcação do farol para o barco seria 262°, fora do setor."
],
"correta": 0,
"explicacao": "<p>Os setores são dados em marcações verdadeiras. Com declinação W, Mv = Mm − 6° = 088° − 6° = 082°, que está entre 070° e 085°: luz encarnada.</p><ul><li><b>Branca, pois 088° está fora do setor encarnado, que vai de 070° a 085°.</b> — Esqueceu de converter a marcação magnética em verdadeira.</li><li><b>Branca, pois a marcação verdadeira seria 094°, fora do setor encarnado.</b> — Somou a declinação W em vez de subtraí-la; declinação oeste é negativa.</li><li><b>Branca, pois a marcação do farol para o barco seria 262°, fora do setor.</b> — Os setores usam a marcação do mar para o farol, e não a do farol para o barco (recíproca).</li></ul>",
"referencia": "Lista de Faróis (DH2), Introdução, item 3.2 (Limites de setores); Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0091",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 2,
"enunciado": "Você sai de um porto brasileiro, rumo ao mar, e avista à frente uma boia lateral verde de número 4. Por qual bordo deve deixá-la?",
"alternativas": [
"Por boreste, pois o verde fica a boreste de quem sai do porto.",
"Por bombordo, porque o verde sempre fica a bombordo, qualquer que seja o sentido.",
"Por bombordo, porque ela tem número par, e o número par indica o bordo de saída.",
"Por qualquer bordo, pois, ao sair do porto, o canal é livre e a boia não limita nada."
],
"correta": 0,
"explicacao": "<p>O balizamento é lido no sentido de quem vem do mar: o verde fica a bombordo de quem entra. Quem sai do porto tem o verde a boreste, e a encarnada a bombordo.</p><ul><li><b>Por bombordo, porque o verde sempre fica a bombordo, qualquer que seja o sentido.</b> — Isso vale para quem entra; ao sair, o lado se inverte.</li><li><b>Por bombordo, porque ela tem número par, e o número par indica o bordo de saída.</b> — O número par só indica que a boia é verde; não define o bordo de saída.</li><li><b>Por qualquer bordo, pois, ao sair do porto, o canal é livre e a boia não limita nada.</b> — A boia continua lateral e marca o limite do canal, qualquer que seja o sentido.</li></ul>",
"referencia": "Decreto 92.267/1986 (Região B); NORMAM-601/DHN, arts. 3.2 e 3.3; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm"
},
{
"id": "mestre-0092",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 1,
"enunciado": "Num canal brasileiro balizado, a boia lateral de número 7 tem que cor e fica em que bordo de quem vem do mar?",
"alternativas": [
"Verde, a bombordo.",
"Verde, a boreste.",
"Encarnada, a boreste.",
"Encarnada, a bombordo."
],
"correta": 2,
"explicacao": "<p>Na Região B, adotada no Brasil, os sinais encarnados ficam a boreste e recebem números ímpares; os verdes ficam a bombordo e recebem números pares, em ordem crescente a partir da entrada.</p><ul><li><b>Verde, a bombordo.</b> — O verde fica a bombordo, mas recebe número par.</li><li><b>Verde, a boreste.</b> — O verde nunca fica a boreste de quem vem do mar na Região B.</li><li><b>Encarnada, a bombordo.</b> — O encarnado fica a boreste na Região B; a Região A é que o põe a bombordo.</li></ul>",
"referencia": "Decreto 92.267/1986; NORMAM-601/DHN, art. 3.2 e 3.3",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0093",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 2,
"enunciado": "A boia da figura é uma marca cardinal. Que luz ela mostra à noite e por onde você deve passar?",
"alternativas": [
"Branca rápida em grupo de 9 lampejos, passando a oeste dela.",
"Branca rápida contínua, passando ao norte dela.",
"Branca rápida em grupo de 6 lampejos mais um longo, passando ao sul dela.",
"Branca rápida em grupo de 3 lampejos, passando a leste dela."
],
"correta": 3,
"explicacao": "<p>Dois cones com as bases unidas e corpo preto-amarelo-preto formam a cardinal Leste. A luz lembra o 3 do relógio: grupo de 3 lampejos. Passe do lado que dá nome à marca: a leste.</p><ul><li><b>Branca rápida em grupo de 9 lampejos, passando a oeste dela.</b> — 9 lampejos é a cardinal Oeste, cuja marca de tope tem os cones com as pontas unidas.</li><li><b>Branca rápida contínua, passando ao norte dela.</b> — Lampejos contínuos são da cardinal Norte, de cones com as pontas para cima.</li><li><b>Branca rápida em grupo de 6 lampejos mais um longo, passando ao sul dela.</b> — 6 lampejos mais um longo é a cardinal Sul, de cones com as pontas para baixo.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.8 (cardinal Leste); Carta 12000 (INT 1), símbolos; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html",
"figura": {
"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 230\" role=\"img\" aria-label=\"Boia cardinal com marca de tope de dois cones de bases unidas e corpo preto, amarelo e preto\"><title>Boia cardinal</title><path d=\"M0 178 Q20 170 40 178 T80 178 T120 178 T160 178 V230 H0Z\" fill=\"var(--sea-2)\"/><rect x=\"58\" y=\"92\" width=\"44\" height=\"27\" fill=\"var(--ink)\"/><rect x=\"58\" y=\"119\" width=\"44\" height=\"27\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><rect x=\"58\" y=\"146\" width=\"44\" height=\"30\" fill=\"var(--ink)\"/><line x1=\"80\" y1=\"74\" x2=\"80\" y2=\"92\" stroke=\"var(--ink)\" stroke-width=\"3\"/><polygon points=\"80,28 66,51 94,51\" fill=\"var(--ink)\"/><polygon points=\"66,51 94,51 80,74\" fill=\"var(--ink)\"/></svg>"
}
},
{
"id": "mestre-0094",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 1,
"enunciado": "Uma boia preta com uma larga faixa horizontal encarnada e duas esferas pretas superpostas no tope indica:",
"alternativas": [
"Perigo isolado, com águas navegáveis em volta.",
"Águas seguras, com navegação livre em todo o redor da boia.",
"Sinal especial, que marca uma área de finalidade específica.",
"Canal preferencial, com o canal principal a boreste."
],
"correta": 0,
"explicacao": "<p>Preta com faixa(s) encarnada(s) e duas esferas pretas é o perigo isolado. Ele fica sob ou junto da marca, e há água navegável em volta. Luz: branca, grupo de 2 lampejos.</p><ul><li><b>Águas seguras, com navegação livre em todo o redor da boia.</b> — Águas seguras têm listras verticais brancas e encarnadas e uma esfera encarnada.</li><li><b>Sinal especial, que marca uma área de finalidade específica.</b> — Sinais especiais são amarelos, com um X amarelo no tope.</li><li><b>Canal preferencial, com o canal principal a boreste.</b> — O canal preferencial é lateral verde ou encarnada com faixa da outra cor.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.11 (perigo isolado); Lista de Faróis, Introdução; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0095",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 1,
"enunciado": "Uma boia esférica com listras verticais brancas e encarnadas, esfera encarnada no tope e luz branca isofásica indica:",
"alternativas": [
"Perigo isolado: passe longe dela, por qualquer lado, sem se aproximar.",
"Cardinal Norte: deixe a marca ao norte e passe pelo lado norte dela.",
"Águas navegáveis em todo o redor, como início ou meio de canal.",
"Sinal especial de recreação: não serve de guia para a rota de navegação."
],
"correta": 2,
"explicacao": "<p>É a marca de águas seguras: não indica perigo, só que há água navegável em volta. A luz é branca, com um destes ritmos: isofásica, ocultação, lampejo longo de 10 s ou Morse \"A\".</p><ul><li><b>Perigo isolado: passe longe dela, por qualquer lado, sem se aproximar.</b> — O perigo isolado é preto com faixa encarnada e duas esferas pretas.</li><li><b>Cardinal Norte: deixe a marca ao norte e passe pelo lado norte dela.</b> — A cardinal Norte é preta sobre amarela, com cones para cima.</li><li><b>Sinal especial de recreação: não serve de guia para a rota de navegação.</b> — Sinais especiais são amarelos; esta marca é de águas seguras e serve de guia.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.12 (águas seguras); Lista de Faróis, quadro \"Águas Seguras\"; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0096",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 2,
"enunciado": "Numa baía há várias boias amarelas, com X amarelo no tope e luz amarela. O que elas indicam?",
"alternativas": [
"Uma área ou finalidade especial, como recreação, e não um canal de navegação.",
"O limite de bombordo do canal de acesso ao porto, vindo do mar, e a sua entrada.",
"Um novo perigo, ainda não indicado nas cartas da região, que deve ser evitado.",
"O eixo do canal, com águas navegáveis dos dois lados dela e sem perigo ao redor."
],
"correta": 0,
"explicacao": "<p>Amarelo é a cor dos sinais especiais: marcam áreas ou finalidades específicas, como a recreação (NORMAM-601, art. 3.13). Não são auxílios de canal.</p><ul><li><b>O limite de bombordo do canal de acesso ao porto, vindo do mar, e a sua entrada.</b> — O bombordo do canal é marcado por boias verdes, não amarelas.</li><li><b>Um novo perigo, ainda não indicado nas cartas da região, que deve ser evitado.</b> — O novo perigo usa sinal cardinal ou lateral com luz rápida (R ou MR), não amarelo (art. 3.14, c).</li><li><b>O eixo do canal, com águas navegáveis dos dois lados dela e sem perigo ao redor.</b> — O eixo do canal usa a marca de águas seguras, de listras brancas e encarnadas.</li></ul>",
"referencia": "NORMAM-601/DHN, arts. 3.13 (sinais especiais) e 3.14 (novo perigo); Lista de Faróis, Introdução",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0097",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 3,
"enunciado": "Entrando num porto, você vê uma boia verde com uma faixa horizontal encarnada e luz verde Fl(2+1) (Lp(2+1), em português). Como interpretá-la?",
"alternativas": [
"Canal preferencial a bombordo: a boia é lateral de boreste; deixe-a por boreste.",
"Perigo isolado: passar longe dela, por qualquer lado, sem se aproximar.",
"Marca de águas seguras: navegação livre em volta, podendo deixá-la por qualquer bordo.",
"Canal preferencial a boreste: a boia é lateral de bombordo; deixe-a por bombordo."
],
"correta": 3,
"explicacao": "<p>A cor principal (verde) diz como tratar a boia: lateral de bombordo. A faixa encarnada e o grupo composto (2+1) indicam que o canal preferencial está a boreste, e a boia deve ser deixada por bombordo.</p><ul><li><b>Canal preferencial a bombordo: a boia é lateral de boreste; deixe-a por boreste.</b> — O canal a bombordo é indicado por boia encarnada com faixa verde.</li><li><b>Perigo isolado: passar longe dela, por qualquer lado, sem se aproximar.</b> — O perigo isolado é preto com faixa encarnada e luz de grupo de 2 lampejos.</li><li><b>Marca de águas seguras: navegação livre em volta, podendo deixá-la por qualquer bordo.</b> — Águas seguras têm listras brancas e encarnadas e esfera encarnada, sem faixa nem Fl(2+1).</li></ul>",
"referencia": "Decreto 92.267/1986, Anexo, item 2.2.3; NORMAM-601/DHN, art. 3.4 a) III",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0098",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 2,
"enunciado": "Você vê uma boia com listras verticais azuis e amarelas, tope em cruz amarela e luz alternada azul e amarela. O que ela é?",
"alternativas": [
"Cardinal Oeste: perigo a leste dela, devendo-se passar pelo lado oeste.",
"Sinal especial: marca área de recreação ou de cabo submarino, sem perigo.",
"Águas seguras: navegação livre em volta, sem perigo conhecido na região.",
"Marca de destroços de emergência: perigo novo, como um naufrágio recente."
],
"correta": 3,
"explicacao": "<p>A IALA criou a boia de destroços de emergência para balizar um perigo novo (por exemplo, casco afundado) antes de a carta ser corrigida. Tem listras verticais azuis e amarelas, tope em cruz amarela e luz alternada azul e amarela.</p><ul><li><b>Cardinal Oeste: perigo a leste dela, devendo-se passar pelo lado oeste.</b> — A cardinal Oeste é amarela e preta, com luz branca de 9 lampejos.</li><li><b>Sinal especial: marca área de recreação ou de cabo submarino, sem perigo.</b> — O sinal especial é todo amarelo, com X no tope.</li><li><b>Águas seguras: navegação livre em volta, sem perigo conhecido na região.</b> — Águas seguras têm listras verticais brancas e encarnadas e esfera encarnada.</li></ul>",
"referencia": "Lista de Faróis 2026-2027, quadro \"Novos Perigos\"; IALA R1001 Ed. 2.0, item 2.6.2",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "mestre-0099",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 3,
"enunciado": "Você navega com rumo verdadeiro 090° e, à noite, vê bem pela proa uma luz branca Q(9) 15s (R(9) 15s, nas cartas em português) de uma boia cardinal. O que ela indica e o que você deve fazer?",
"alternativas": [
"É a cardinal Oeste: o perigo está a oeste dela. Siga em frente e passe a leste, onde há água segura.",
"É a cardinal Leste: o perigo está a oeste dela. Siga em frente e passe a leste.",
"É a cardinal Oeste: o perigo fica a leste dela, à sua proa. Mude o rumo e passe a oeste.",
"É um perigo isolado: mantenha o rumo e passe junto dela, pois há águas navegáveis em volta."
],
"correta": 2,
"explicacao": "<p>Q(9) é o \"9 horas\" do relógio: cardinal Oeste (grupo de 9 rápidos, R(9), nas cartas em português). A marca fica junto ao perigo; o nome indica o lado por onde se passa, e o perigo está do lado oposto. Passe a oeste dela, e o perigo fica a leste. Com a proa para leste, é preciso mudar o rumo.</p><ul><li><b>É a cardinal Oeste: o perigo está a oeste dela. Siga em frente e passe a leste, onde há água segura.</b> — Inverte a regra: passa-se do lado que dá nome à marca (oeste), nunca do lado oposto.</li><li><b>É a cardinal Leste: o perigo está a oeste dela. Siga em frente e passe a leste.</b> — 9 lampejos é Oeste; o Leste tem 3 lampejos.</li><li><b>É um perigo isolado: mantenha o rumo e passe junto dela, pois há águas navegáveis em volta.</b> — Perigo isolado tem grupo de 2 lampejos e não se passa por cima da marca.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.10 (cardinal Oeste; grupo de 9 rápidos); Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0100",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 3,
"enunciado": "Qual das características de luz abaixo <b>não</b> pode ser usada numa boia lateral comum (encarnada ou verde) do balizamento IALA?",
"alternativas": [
"Fl R 4s, lampejo simples encarnado, um a cada 4 s, sem grupo.",
"Fl(2+1) G 12s, grupo composto reservado ao canal preferencial.",
"Oc G 6s, ocultação verde, com a luz mais longa que a escuridão.",
"Iso R 4s, isofásica encarnada, com luz e escuridão de mesma duração."
],
"correta": 1,
"explicacao": "<p>Numa lateral comum não se usa o grupo composto Fl(2+1), reservado ao canal preferencial (NORMAM-601, art. 3.4, a, III). As demais características são ritmos simples.</p><ul><li><b>Fl R 4s, lampejo simples encarnado, um a cada 4 s, sem grupo.</b> — Lampejo simples é ritmo de marca lateral.</li><li><b>Oc G 6s, ocultação verde, com a luz mais longa que a escuridão.</b> — Ocultação verde também é ritmo de marca lateral.</li><li><b>Iso R 4s, isofásica encarnada, com luz e escuridão de mesma duração.</b> — Isofásica também é ritmo de marca lateral.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.4 a) III; IALA R1001 Ed. 2.0; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0101",
"nivel": "mestre",
"tema": "Balizamento e sinais",
"dificuldade": 2,
"enunciado": "Na Região B do balizamento IALA, qual é a marca de tope de uma boia lateral de boreste, quando existe?",
"alternativas": [
"Um cilindro encarnado, de base para baixo.",
"Um cone encarnado com o vértice para cima.",
"Um cone verde com o vértice para cima.",
"Um cilindro verde, de base para baixo."
],
"correta": 1,
"explicacao": "<p>Na Região B, o sinal de boreste é encarnado e leva um cone com o vértice para cima. O de bombordo é verde e leva um cilindro.</p><ul><li><b>Um cilindro encarnado, de base para baixo.</b> — O cilindro encarnado seria o de bombordo na Região A, que inverte as cores.</li><li><b>Um cone verde com o vértice para cima.</b> — O verde é cor de bombordo; o cone é a forma de boreste, e a cor está trocada.</li><li><b>Um cilindro verde, de base para baixo.</b> — Cilindro verde é a marca de bombordo.</li></ul>",
"referencia": "Decreto 92.267/1986, Anexo, item 2.2.2; NORMAM-601/DHN, art. 3.3; Miguens, vol. I, cap. 13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "mestre-0102",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Qual dos sinais abaixo está previsto no Anexo IV do RIPEAM como sinal de perigo, para pedido de socorro?",
"alternativas": [
"Cinco ou mais apitos curtos e rápidos, em sequência.",
"Toque contínuo de um aparelho de sinais de cerração.",
"Três apitos curtos em sequência, a intervalos regulares.",
"Um apito longo ao se aproximar de uma curva sem visão."
],
"correta": 1,
"explicacao": "<p>O toque contínuo de aparelho de sinais de cerração é sinal de perigo do Anexo IV, item 1, b), e só pode ser usado para pedir socorro.</p><ul><li><b>Cinco ou mais apitos curtos e rápidos, em sequência.</b> — É o sinal de dúvida da Regra 34(d), e não consta do Anexo IV.</li><li><b>Três apitos curtos em sequência, a intervalos regulares.</b> — Significa que a embarcação está dando atrás (Regra 34(a)).</li><li><b>Um apito longo ao se aproximar de uma curva sem visão.</b> — Sinal de aproximação em visibilidade obstruída (Regra 34(e)).</li></ul>",
"referencia": "RIPEAM, Anexo IV, item 1, b); Regras 34(a), 34(d) e 34(e) (para comparação)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0103",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Qual a cor e o arco de visibilidade da luz de alcançado (popa) de uma embarcação?",
"alternativas": [
"Branca, 135°, visível por ré.",
"Branca, 225°, visível por ante-a-vante.",
"Encarnada, 112,5°, visível por um bordo.",
"Amarela, 135°, visível por ré."
],
"correta": 0,
"explicacao": "<p>A luz de alcançado é branca e cobre 135°, 67,5° para cada lado da popa. Só é vista por quem está por ré da embarcação.</p><ul><li><b>Branca, 225°, visível por ante-a-vante.</b> — Esse é o arco da luz de mastro, que olha para a frente.</li><li><b>Encarnada, 112,5°, visível por um bordo.</b> — 112,5° é o arco de cada luz de bordo, que tem cor encarnada ou verde.</li><li><b>Amarela, 135°, visível por ré.</b> — A luz amarela de 135° é a de reboque; a luz de alcançado é branca.</li></ul>",
"referencia": "RIPEAM, Regra 21(c)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0104",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Dois veleiros se aproximam em rumos cruzados, com risco de abalroamento. O veleiro A recebe o vento por boreste; o veleiro B recebe o vento por bombordo. Quem deve se manter fora do caminho do outro?",
"alternativas": [
"O A, que recebe o vento por boreste e mantém rumo e velocidade.",
"O que estiver a barlavento, pois quem está a barlavento sempre dá passagem.",
"O de menor comprimento, pois o barco menor sempre cede o caminho.",
"O B, que recebe o vento por bombordo."
],
"correta": 3,
"explicacao": "<p>Regra 12(a)(i): quando cada veleiro recebe o vento por um bordo, aquele que o recebe por bombordo mantém-se fora do caminho do outro.</p><ul><li><b>O A, que recebe o vento por boreste e mantém rumo e velocidade.</b> — Quem recebe o vento por boreste é o que mantém rumo e velocidade.</li><li><b>O que estiver a barlavento, pois quem está a barlavento sempre dá passagem.</b> — O barlavento só decide quando os dois recebem o vento pelo mesmo bordo.</li><li><b>O de menor comprimento, pois o barco menor sempre cede o caminho.</b> — O tamanho não entra nessa regra entre veleiros.</li></ul>",
"referencia": "RIPEAM, Regra 12(a)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0105",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "De dia, que marca deve exibir na proa uma embarcação de 15 m fundeada?",
"alternativas": [
"Um cone preto com o vértice para baixo.",
"Uma esfera preta.",
"Um cilindro preto.",
"Duas esferas pretas na vertical."
],
"correta": 1,
"explicacao": "<p>A embarcação fundeada exibe, onde melhor se veja, uma esfera preta (de noite, uma luz branca circular). Duas esferas são a marca de embarcação sem governo.</p><ul><li><b>Um cone preto com o vértice para baixo.</b> — É a marca do veleiro que navega com motor também acionado.</li><li><b>Um cilindro preto.</b> — O cilindro é a marca de embarcação restrita pelo calado.</li><li><b>Duas esferas pretas na vertical.</b> — Duas esferas pretas indicam embarcação sem governo.</li></ul>",
"referencia": "RIPEAM, Regra 30(a)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0106",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Duas lanchas a motor se aproximam de frente, em rumos opostos ou quase, com risco de abalroamento. O que cada uma deve fazer?",
"alternativas": [
"Guinar para bombordo, passando boreste com boreste.",
"A mais lenta guina para boreste e a mais rápida mantém o rumo.",
"Guinar para boreste, passando bombordo com bombordo.",
"Soar um apito longo e manter rumo e velocidade."
],
"correta": 2,
"explicacao": "<p>Regra 14(a): na situação de roda a roda, ambas as embarcações de propulsão mecânica guinam para boreste e passam pelo bordo de bombordo uma da outra.</p><ul><li><b>Guinar para bombordo, passando boreste com boreste.</b> — Guinar para bombordo é o contrário do que a regra manda: as duas passariam boreste com boreste, e a Regra 14(a) exige passar bombordo com bombordo.</li><li><b>A mais lenta guina para boreste e a mais rápida mantém o rumo.</b> — Nessa regra as duas manobram, sem importar a velocidade.</li><li><b>Soar um apito longo e manter rumo e velocidade.</b> — Não existe estar \"mantendo rumo\" no roda a roda: ambas guinam.</li></ul>",
"referencia": "RIPEAM, Regra 14(a)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0107",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "A luz de mastro de uma embarcação de propulsão mecânica é branca e mostra um arco horizontal de:",
"alternativas": [
"135°, centrados na popa da embarcação.",
"112,5°, de um só bordo, da proa até 22,5° atrás do través.",
"225°, da proa até 22,5° atrás do través de cada bordo.",
"180°, da proa até o través de cada bordo."
],
"correta": 2,
"explicacao": "<p>A luz de mastro cobre 225°: 112,5° para cada lado da proa, até 22,5° atrás do través. Por isso ela some quando o barco é visto bem de popa.</p><ul><li><b>135°, centrados na popa da embarcação.</b> — É o arco da luz de alcançado.</li><li><b>112,5°, de um só bordo, da proa até 22,5° atrás do través.</b> — É o arco de cada luz de bordo.</li><li><b>180°, da proa até o través de cada bordo.</b> — O limite é 22,5° atrás do través, não o través.</li></ul>",
"referencia": "RIPEAM, Regra 21(a)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0108",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "Um veleiro de 11 m navega à vela, à noite. Qual alternativa de luzes de navegação o RIPEAM permite?",
"alternativas": [
"Lanterna tricolor no tope e mais uma luz de mastro branca de 225°.",
"Lanterna tricolor no tope do mastro, em lugar das luzes de bordos e de alcançado.",
"Uma única luz branca circular no tope, dispensando as luzes de bordos e de alcançado.",
"Luzes de bordos separadas e luz de mastro branca de 225°, como nas lanchas."
],
"correta": 1,
"explicacao": "<p>Veleiro de menos de 20 m pode combinar as luzes de bordos e de alcançado numa só lanterna tricolor no ponto mais alto do mastro.</p><ul><li><b>Lanterna tricolor no tope e mais uma luz de mastro branca de 225°.</b> — A luz de mastro branca é de embarcação de propulsão mecânica e confundiria os outros barcos.</li><li><b>Uma única luz branca circular no tope, dispensando as luzes de bordos e de alcançado.</b> — A luz branca circular não substitui o conjunto de luzes do veleiro; a tricolor é a alternativa prevista.</li><li><b>Luzes de bordos separadas e luz de mastro branca de 225°, como nas lanchas.</b> — A luz de mastro branca é de propulsão mecânica.</li></ul>",
"referencia": "RIPEAM, Regra 25(a) e (b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0109",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "De dia, um veleiro navega à vela com vento de popa a 6 nós e se aproxima por trás, em rumo quase igual, de uma lancha a motor que anda a 4 nós. Quem deve se manter fora do caminho?",
"alternativas": [
"A lancha a motor, porque o veleiro tem a preferência.",
"O veleiro, porque está alcançando a outra embarcação.",
"Os dois, guinando para boreste, como no roda a roda.",
"A embarcação mais lenta, pois a mais rápida tem direito de passagem."
],
"correta": 1,
"explicacao": "<p>Regra 13(a): qualquer embarcação que alcança outra se mantém fora do caminho dela, prevalecendo sobre as outras regras de governo. É ultrapassagem quando se vem de mais de 22,5° por ante-a-ré do través.</p><ul><li><b>A lancha a motor, porque o veleiro tem a preferência.</b> — A preferência do veleiro (Regra 18) não vale na ultrapassagem.</li><li><b>Os dois, guinando para boreste, como no roda a roda.</b> — Guinar para boreste é a regra do roda a roda, e este caso é de ultrapassagem.</li><li><b>A embarcação mais lenta, pois a mais rápida tem direito de passagem.</b> — O direito de passagem nunca é do que alcança.</li></ul>",
"referencia": "RIPEAM, Regra 13(a) e (b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0110",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "Duas lanchas a motor têm rumos cruzados e risco de abalroamento. A lancha A vê a lancha B pela sua boreste; B vê A pela sua bombordo. Quem manobra e como?",
"alternativas": [
"A manobra, evitando cruzar pela proa de B.",
"B manobra, guinando para bombordo.",
"A mantém rumo e velocidade.",
"B manobra, evitando cruzar pela proa de A."
],
"correta": 0,
"explicacao": "<p>Regra 15: a embarcação que vê a outra por seu bordo de boreste dá passagem e, se possível, evita cruzar pela proa dela. A é quem vê B por boreste.</p><ul><li><b>B manobra, guinando para bombordo.</b> — B é quem mantém rumo e velocidade, e guinar para bombordo não é o que se pede.</li><li><b>A mantém rumo e velocidade.</b> — A é quem deve dar passagem, pois vê a outra por boreste.</li><li><b>B manobra, evitando cruzar pela proa de A.</b> — B é a embarcação que mantém rumo e velocidade (Regra 17).</li></ul>",
"referencia": "RIPEAM, Regras 15 e 17",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0111",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "De dia, você, à vela, vê uma embarcação com dois cones pretos unidos pelos vértices, na vertical. O que isso significa e o que fazer?",
"alternativas": [
"Está engajada na pesca de arrasto; ela deve dar passagem ao veleiro.",
"Está fundeada; o veleiro pode manter o rumo, pois ela não se move.",
"Tem capacidade de manobra restrita; o veleiro deve manter rumo e velocidade.",
"Está engajada na pesca; o veleiro deve dar passagem a ela."
],
"correta": 3,
"explicacao": "<p>Dois cones com os vértices unidos são a marca diurna da embarcação engajada na pesca: a de arrasto (Regra 26(b)(i)) ou qualquer outra (Regra 26(c)(i)). A marca, sozinha, não diz o tipo de pesca. Pela Regra 18(b), o veleiro dá passagem a ela.</p><ul><li><b>Está engajada na pesca de arrasto; ela deve dar passagem ao veleiro.</b> — A hierarquia é inversa: pela Regra 18(b), é o veleiro que dá passagem à embarcação engajada na pesca, de arrasto ou não.</li><li><b>Está fundeada; o veleiro pode manter o rumo, pois ela não se move.</b> — A fundeada exibe uma esfera preta; mesmo parada, é preciso dar-lhe espaço.</li><li><b>Tem capacidade de manobra restrita; o veleiro deve manter rumo e velocidade.</b> — A manobra restrita usa bola, losango e bola (Regra 27(b)); e o veleiro também dá passagem, não mantém rumo.</li></ul>",
"referencia": "RIPEAM, Regras 18(b), 26(b)(i) e 26(c)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0112",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "Em cerração, um veleiro de 15 m navega à vela, com seguimento. Que sinal sonoro ele deve dar, e com que intervalo máximo?",
"alternativas": [
"Um apito longo, com intervalo de até 2 minutos.",
"Um apito longo e dois curtos, com intervalo de até 2 minutos.",
"Dois apitos longos, com intervalo de até 2 minutos.",
"Sino por cerca de 5 segundos, a intervalos de no máximo 1 minuto."
],
"correta": 1,
"explicacao": "<p>Regra 35(c): a embarcação a vela, sem governo, com manobra restrita, restrita pelo calado, pescando ou rebocando dá um longo e dois curtos, no máximo a cada 2 minutos.</p><ul><li><b>Um apito longo, com intervalo de até 2 minutos.</b> — É o sinal da embarcação de propulsão mecânica com seguimento (Regra 35(a)).</li><li><b>Dois apitos longos, com intervalo de até 2 minutos.</b> — É o sinal da embarcação de propulsão mecânica parada, sem seguimento (Regra 35(b)).</li><li><b>Sino por cerca de 5 segundos, a intervalos de no máximo 1 minuto.</b> — É o sinal da embarcação fundeada (Regra 35(g)).</li></ul>",
"referencia": "RIPEAM, Regra 35(c)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0113",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "De dia, um veleiro de 14 m navega à vela, mas com o motor também engrenado. O que a Regra 25 exige?",
"alternativas": [
"Um cone preto com o vértice para cima, na proa, no lugar onde melhor se veja.",
"Uma esfera preta, na proa, onde melhor se veja.",
"Um cone preto com o vértice para baixo, na proa, onde melhor se veja.",
"Nenhuma marca, porque o veleiro continua sendo um barco a vela, mesmo com o motor."
],
"correta": 2,
"explicacao": "<p>Com o motor em uso, o veleiro é tratado como embarcação de propulsão mecânica (Regra 3(c)). A Regra 25(e) manda então exibir, na proa, um cone com o vértice para baixo.</p><ul><li><b>Um cone preto com o vértice para cima, na proa, no lugar onde melhor se veja.</b> — O cone com vértice para cima não é marca desta regra.</li><li><b>Uma esfera preta, na proa, onde melhor se veja.</b> — A esfera preta é a marca de embarcação fundeada.</li><li><b>Nenhuma marca, porque o veleiro continua sendo um barco a vela, mesmo com o motor.</b> — A marca é obrigatória: avisa que o barco também está sob motor.</li></ul>",
"referencia": "RIPEAM, Regras 3(c) e 25(e)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0114",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "Você mantém rumo e velocidade, como manda a Regra 17, e a outra embarcação, que deveria dar passagem, não está agindo adequadamente. O que a Regra 17 permite?",
"alternativas": [
"Manter rumo e velocidade até o fim, pois a Regra 17 proíbe qualquer manobra do barco que mantém rumo.",
"Manobrar assim que ficar claro que a outra não age; e, se não bastar, fazer o que melhor evite o choque.",
"Parar de imediato e deixar que a outra decida sozinha, sem interferir, como evitar o choque entre as duas.",
"Dar três apitos curtos e continuar com o mesmo rumo e a mesma velocidade, sem manobrar até o choque."
],
"correta": 1,
"explicacao": "<p>Regra 17(a)(ii): pode manobrar assim que ficar evidente que a outra não toma ação adequada. Regra 17(b): quando só a ação da outra já não evita a colisão, deve fazer o que melhor ajude a evitá-la.</p><ul><li><b>Manter rumo e velocidade até o fim, pois a Regra 17 proíbe qualquer manobra do barco que mantém rumo.</b> — A proibição não existe: a obrigação de manter rumo termina quando surge o risco.</li><li><b>Parar de imediato e deixar que a outra decida sozinha, sem interferir, como evitar o choque entre as duas.</b> — Parar não resolve e pode criar outro risco; a regra manda agir para evitar o abalroamento.</li><li><b>Dar três apitos curtos e continuar com o mesmo rumo e a mesma velocidade, sem manobrar até o choque.</b> — Três apitos curtos significam \"estou dando atrás\" e não resolvem a situação.</li></ul>",
"referencia": "RIPEAM, Regra 17(a)(ii) e (b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0115",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "Você navega com o vento por bombordo e avista um veleiro a barlavento, sem conseguir determinar com segurança se ele recebe o vento por bombordo ou por boreste. O que fazer?",
"alternativas": [
"Manter rumo e velocidade, porque quem está a barlavento é quem dá passagem sempre.",
"Soar cinco apitos curtos e manter rumo e velocidade, esperando que ele responda ao sinal.",
"Guinar para barlavento e cruzar a proa dele, para mostrar sua intenção com clareza.",
"Manobrar cedo para se manter fora do caminho dele, pois não há certeza do bordo."
],
"correta": 3,
"explicacao": "<p>Regra 12(a)(iii): se você recebe o vento por bombordo, vê outro veleiro a barlavento e não consegue ter certeza do bordo dele, deve manobrar para se manter fora do caminho dele.</p><ul><li><b>Manter rumo e velocidade, porque quem está a barlavento é quem dá passagem sempre.</b> — Só vale se os dois estiverem com vento pelo mesmo bordo, o que você não sabe.</li><li><b>Soar cinco apitos curtos e manter rumo e velocidade, esperando que ele responda ao sinal.</b> — O sinal de dúvida não retira a obrigação de manobrar.</li><li><b>Guinar para barlavento e cruzar a proa dele, para mostrar sua intenção com clareza.</b> — Cruzar-lhe a proa é manobra arriscada e contraria a obrigação de ficar fora do caminho.</li></ul>",
"referencia": "RIPEAM, Regra 12(a)(iii)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0116",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "Qual afirmativa sobre o risco de abalroamento (Regra 7) está <b>correta</b>?",
"alternativas": [
"Marcação variando indica sempre que não há risco, e a manobra pode ser dispensada com segurança total.",
"Só o radar pode determinar o risco; a marcação tomada com a bússola de mão não tem nenhum valor prático.",
"Havendo dúvida, deve-se presumir que não existe risco, para não atrapalhar o tráfego dos outros barcos.",
"Marcação constante indica risco, e a variação pode esconder risco, sobretudo perto de navio grande."
],
"correta": 3,
"explicacao": "<p>Regra 7(d)(i): o risco se presume quando a marcação de quem se aproxima não muda de forma apreciável. A Regra 7(d)(ii) acrescenta que o risco pode existir mesmo com a marcação mudando, sobretudo com navio muito grande, reboque ou em curta distância.</p><ul><li><b>Marcação variando indica sempre que não há risco, e a manobra pode ser dispensada com segurança total.</b> — A variação da marcação não afasta o risco em todos os casos, como o de navio muito grande ou de distância curta.</li><li><b>Só o radar pode determinar o risco; a marcação tomada com a bússola de mão não tem nenhum valor prático.</b> — A Regra 7(d)(i) cita expressamente a marcação de bússola.</li><li><b>Havendo dúvida, deve-se presumir que não existe risco, para não atrapalhar o tráfego dos outros barcos.</b> — A Regra 7(a) manda presumir o risco quando há dúvida.</li></ul>",
"referencia": "RIPEAM, Regra 7(a) e (d)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0117",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "À noite, no través, você vê só duas luzes encarnadas circulares, uma sobre a outra, como na figura, e nenhuma luz de bordo. Você navega à vela, em rumo de colisão. Quem deve manobrar?",
"alternativas": [
"A outra embarcação, porque o veleiro tem preferência sobre qualquer outra.",
"Nenhuma delas, pois só estão visíveis luzes encarnadas.",
"O veleiro, pois a outra embarcação está sem governo e tem a preferência.",
"O veleiro, mas apenas se ela exibir também luzes de bordos."
],
"correta": 2,
"explicacao": "<p>Duas luzes encarnadas verticais indicam embarcação sem governo (Regra 27(a)). Sem luzes de bordos e de alcançado, ela não está em seguimento. Pela Regra 18(b), o veleiro dá passagem a ela, com ou sem seguimento.</p><ul><li><b>A outra embarcação, porque o veleiro tem preferência sobre qualquer outra.</b> — A preferência do veleiro não vale contra embarcação sem governo.</li><li><b>Nenhuma delas, pois só estão visíveis luzes encarnadas.</b> — A luz mostra que a outra não pode manobrar; o veleiro precisa agir.</li><li><b>O veleiro, mas apenas se ela exibir também luzes de bordos.</b> — Com ou sem luzes de bordos, ela continua sendo embarcação sem governo, e o veleiro dá passagem.</li></ul>",
"referencia": "RIPEAM, Regras 27(a) e 18(b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf",
"figura": {
"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 150\" role=\"img\" aria-label=\"Duas luzes encarnadas circulares, uma sobre a outra\"><title>Duas luzes encarnadas na vertical</title><circle cx=\"80\" cy=\"42\" r=\"14\" fill=\"var(--nav-red)\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"80\" cy=\"92\" r=\"14\" fill=\"var(--nav-red)\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M10 130 Q30 124 50 130 T90 130 T130 130 T150 130\" fill=\"none\" stroke=\"var(--sea-3)\" stroke-width=\"2\"/></svg>"
}
},
{
"id": "mestre-0118",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "Um veleiro de 12 m, indo de um porto a outro ao longo da costa, quer usar a zona de tráfego costeiro de um esquema de separação de tráfego, embora pudesse usar com segurança a via de tráfego apropriada. Isso é permitido?",
"alternativas": [
"Não: só quem não tem como usar a via apropriada pode usar a zona costeira de tráfego.",
"Não: a zona de tráfego costeiro é proibida às embarcações de recreio.",
"Sim: veleiros e embarcações com menos de 20 m podem usar a zona costeira.",
"Sim, mas só com autorização por VHF do serviço de tráfego."
],
"correta": 2,
"explicacao": "<p>Regra 10(d): o tráfego que pode usar a via apropriada normalmente não usa a zona costeira, mas a regra ressalva as embarcações com menos de 20 m, as a vela e as de pesca, que podem usá-la. A Regra 10(j) lembra que essas embarcações não devem atrapalhar a passagem segura de embarcação de propulsão mecânica em via de tráfego.</p><ul><li><b>Não: só quem não tem como usar a via apropriada pode usar a zona costeira de tráfego.</b> — Essa é a regra geral, que tem a ressalva para as embarcações pequenas e a vela.</li><li><b>Não: a zona de tráfego costeiro é proibida às embarcações de recreio.</b> — A Regra 10 não proíbe embarcações de recreio de usar a zona.</li><li><b>Sim, mas só com autorização por VHF do serviço de tráfego.</b> — A Regra 10 não pede autorização para usar a zona costeira.</li></ul>",
"referencia": "RIPEAM, Regra 10(d) e 10(j)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0119",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 1,
"enunciado": "Para saber se há água suficiente sobre um baixio, o navegante soma a sondagem da carta e a altura da maré lida na Tábua das Marés da DHN. Essa soma só é correta porque as duas medidas:",
"alternativas": [
"partem do mesmo zero, o Nível de Redução (NR), usado nas cartas e nas tábuas.",
"partem do nível médio do mar, que é o zero usado nas cartas e nas tábuas de maré.",
"partem da preamar de sizígia do mês, que serve de zero para as cartas brasileiras.",
"partem da superfície do mar no instante da consulta, qualquer que seja a hora do dia."
],
"correta": 0,
"explicacao": "A sondagem é a distância vertical do NR ao fundo, e a altura da maré da tábua também é contada acima do NR; por isso a soma dá a profundidade real. O nível médio do mar não é o zero das cartas brasileiras: o NR normalmente fica perto do nível médio das baixa-mares de sizígia. A superfície do instante é justamente o que a altura da maré mede, não um zero. A preamar de sizígia é um extremo da maré, nunca uma referência de profundidade.",
"referencia": "Miguens, vol. I, cap. 10, itens 10.1.7 (Nível de Redução ≈ média das baixa-mares de sizígia) e 10.1.9",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0120",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 1,
"enunciado": "Um comandante quer cruzar uma barra rasa quando a diferença entre preamar e baixa-mar for a maior possível. Em que fases da Lua ocorre a maré de sizígia, e como ficam as alturas?",
"alternativas": [
"Quartos crescente e minguante, com preamares mais baixas e baixa-mares mais altas que a média.",
"Lua nova e Lua cheia, com preamares mais baixas e baixa-mares mais altas que a média.",
"Quartos crescente e minguante, com preamares mais altas e baixa-mares mais baixas que a média.",
"Lua nova e Lua cheia, com preamares mais altas e baixa-mares mais baixas que a média."
],
"correta": 3,
"explicacao": "Na Lua nova e na Lua cheia, Sol, Terra e Lua ficam alinhados e os efeitos se somam: preamares mais altas, baixa-mares mais baixas e amplitude máxima (sizígia, ou águas vivas). Nos quartos, o Sol atua a 90° da Lua e um efeito reduz o outro: é a quadratura (águas mortas), de amplitude menor, com preamares mais baixas e baixa-mares mais altas. As combinações cruzadas trocam a fase da Lua pelo efeito, ou o efeito pela fase, e por isso estão erradas.",
"referencia": "Miguens, vol. I, cap. 10 (marés)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0121",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Num porto de maré semidiurna, a preamar da manhã de hoje ocorreu às 0630. O Método Expedito das Tábuas das Marés adota o intervalo de 12 h 25 min entre preamares. A preamar da manhã de amanhã ocorrerá aproximadamente às:",
"alternativas": [
"0630, no mesmo horário, pois a maré se repete a cada 24 horas.",
"0540, uns 50 minutos antes da de hoje.",
"0720, uns 50 minutos depois da de hoje.",
"0830, cerca de 2 horas depois da de hoje."
],
"correta": 2,
"explicacao": "Duas preamares seguidas distam 12 h 25 min; em um dia há duas, de modo que o conjunto avança 2 × 12 h 25 min = 24 h 50 min. Cada preamar chega, portanto, cerca de 50 minutos mais tarde que a do dia anterior: 0630 + 0050 = 0720. As marés não se repetem às 24 horas exatas, porque a Lua passa pelo mesmo meridiano a cada 24 h 50 min. O 0540 inverte o sentido do atraso (chega 50 minutos mais cedo), e o 0830 atrasa 2 horas, bem mais do que os 50 minutos que o intervalo dá.",
"referencia": "Miguens, vol. I, cap. 10, item 10.1.10 (Método Expedito)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0122",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 1,
"enunciado": "A carta mostra a sondagem 2<sub>6</sub> sobre um baixio. Pela Tábua das Marés, a altura da maré no momento da passagem será de 1,4 m. O veleiro cala 1,9 m. Qual será a folga abaixo da quilha?",
"alternativas": [
"0,7 m",
"2,1 m",
"4,0 m",
"5,9 m"
],
"correta": 1,
"explicacao": "Profundidade = sondagem + altura da maré = 2,6 + 1,4 = 4,0 m. Folga = profundidade − calado = 4,0 − 1,9 = 2,1 m. O valor de 0,7 m resulta de 2,6 − 1,9, esquecendo a maré. O valor de 4,0 m é só a profundidade, sem descontar o calado. O valor de 5,9 m soma o calado, que deve ser subtraído.",
"referencia": "Miguens, vol. I, cap. 10, item 10.1.9; Carta 12000 (INT 1), seção I",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0123",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Tábua do dia, num porto de maré regular: baixa-mar de 0,5 m às 0300 e preamar de 3,3 m às 0900. Pela regra dos doze avos, qual a altura da maré às 0500?",
"alternativas": [
"0,7 m",
"1,2 m",
"1,4 m",
"1,9 m"
],
"correta": 1,
"explicacao": "Amplitude = 3,3 − 0,5 = 2,8 m. Em 2 horas a maré sobe 1/12 + 2/12 = 3/12 da amplitude = 0,7 m, e a altura é 0,5 + 0,7 = 1,2 m. O valor de 0,7 m é só a subida, sem somar a baixa-mar. O valor de 1,4 m vem de uma interpolação linear (2/6 da amplitude), que ignora que a maré sobe devagar na primeira hora. O valor de 1,9 m é a altura às 0600, após 3 horas (6/12 = 1,4 m de subida).",
"referencia": "Regra dos doze avos, aproximação da curva senoidal (equivale às Tabelas I e II das Tábuas das Marés; Miguens, vol. I, cap. 10, p. 10-16 a 10-18)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0124",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Tábua do dia: preamar de 3,6 m às 1000 e baixa-mar de 0,0 m às 1600. Pela regra dos doze avos, qual a altura da maré às 1200?",
"alternativas": [
"0,9 m",
"1,8 m",
"2,4 m",
"2,7 m"
],
"correta": 3,
"explicacao": "Amplitude = 3,6 m. Na vazante, a maré cai 1/12 na 1ª hora e 2/12 na 2ª: em 2 horas cai 3/12 × 3,6 = 0,9 m. A altura é 3,6 − 0,9 = 2,7 m. O valor de 0,9 m é só a queda, sem subtraí-la da preamar. O valor de 2,4 m resulta de uma queda linear (2/6 da amplitude = 1,2 m). O valor de 1,8 m é a altura às 1300, após 3 horas (6/12 da amplitude).",
"referencia": "Regra dos doze avos, aproximação da curva senoidal (equivale às Tabelas I e II das Tábuas das Marés; Miguens, vol. I, cap. 10, p. 10-16 a 10-18)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0125",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Na carta, uma pedra aparece com o número <u>0<sub>8</sub></u> sublinhado. No horário previsto para a passagem, a Tábua das Marés indica altura de 2,9 m. O veleiro cala 1,6 m. Qual a folga abaixo da quilha sobre a pedra?",
"alternativas": [
"0,5 m",
"1,3 m",
"2,1 m",
"3,7 m"
],
"correta": 0,
"explicacao": "O número sublinhado é uma altura de secagem: a pedra emerge 0,8 m acima do NR. Com a maré em 2,9 m, a água sobre a pedra tem 2,9 − 0,8 = 2,1 m, e a folga é 2,1 − 1,6 = 0,5 m. O valor de 1,3 m trata a pedra como se não existisse (2,9 − 1,6). O valor de 2,1 m é a água sobre a pedra, sem descontar o calado. O valor de 3,7 m soma a secagem à maré, como se fosse uma sondagem.",
"referencia": "Carta 12000 (INT 1), seção I (altura de secagem sublinhada); Miguens, vol. I, cap. 10",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Corte vertical: veleiro de calado 1,6 m sobre uma pedra com altura de secagem de 0,8 m, com a maré em 2,9 m acima do NR\"><rect x=\"10\" y=\"53\" width=\"300\" height=\"87\" fill=\"var(--sea-2)\" opacity=\".45\"/><line x1=\"10\" y1=\"53\" x2=\"310\" y2=\"53\" stroke=\"var(--sea-3)\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"140\" x2=\"310\" y2=\"140\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"14\" y=\"156\" font-size=\"10\" fill=\"currentColor\">NR (zero da carta)</text><polygon points=\"185,140 210,116 245,116 270,140\" fill=\"var(--land)\" stroke=\"currentColor\" stroke-width=\"1\"/><polygon points=\"190,46 260,46 252,101 198,101\" fill=\"var(--nav-white)\" stroke=\"currentColor\" stroke-width=\"1.5\"/><line x1=\"40\" y1=\"53\" x2=\"40\" y2=\"140\" stroke=\"currentColor\" stroke-width=\"1\"/><line x1=\"35\" y1=\"53\" x2=\"45\" y2=\"53\" stroke=\"currentColor\"/><line x1=\"35\" y1=\"140\" x2=\"45\" y2=\"140\" stroke=\"currentColor\"/><text x=\"48\" y=\"100\" font-size=\"10\" fill=\"currentColor\">maré: 2,9 m</text><line x1=\"170\" y1=\"53\" x2=\"170\" y2=\"101\" stroke=\"currentColor\" stroke-width=\"1\"/><line x1=\"165\" y1=\"101\" x2=\"175\" y2=\"101\" stroke=\"currentColor\"/><text x=\"165\" y=\"80\" font-size=\"10\" text-anchor=\"end\" fill=\"currentColor\">calado: 1,6 m</text><line x1=\"290\" y1=\"116\" x2=\"290\" y2=\"140\" stroke=\"currentColor\" stroke-width=\"1\"/><line x1=\"285\" y1=\"116\" x2=\"295\" y2=\"116\" stroke=\"currentColor\"/><text x=\"286\" y=\"132\" font-size=\"10\" text-anchor=\"end\" fill=\"currentColor\">secagem: 0,8 m</text></svg>"
}
},
{
"id": "mestre-0126",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Um comandante quer usar a regra dos doze avos numa barra do litoral Sul, onde a maré tem desigualdades diurnas, é pequena e muito alterada pelo vento. Por que o resultado deve ser visto com desconfiança?",
"alternativas": [
"A regra calcula a velocidade da corrente de maré, e não a altura da água sobre o fundo.",
"A regra só funciona em portos com amplitude de maré acima de 5 m, como no Maranhão.",
"A regra supõe uma curva de maré senoidal e regular, o que ali não costuma se verificar.",
"A regra só vale na sizígia, e o litoral Sul tem predominância de marés de quadratura."
],
"correta": 2,
"explicacao": "A regra dos doze avos, como as Tabelas I e II das Tábuas das Marés, pressupõe uma curva de maré semelhante a uma senoide. Onde a maré tem desigualdades diurnas (caso do litoral Sul do Brasil), é pequena ou é dominada pelo vento, a curva real foge disso e o resultado é só aproximado. Por isso, o Manual de Navegação da MB manda usar as Tabelas I e II na costa brasileira apenas de Vitória (ES) para o Norte, onde a maré é predominantemente semidiurna. A regra dá alturas (não correntes), vale para qualquer fase da Lua e não depende de uma amplitude mínima.",
"referencia": "Miguens, vol. I, cap. 10, p. 10-18 (Tabelas I e II: curva sinusoidal; uso de Vitória/ES para o Norte); cap. 10, item 10.1.4 (maré do litoral Sul)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0127",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 3,
"enunciado": "Numa barra, a curva de maré não é senoidal, e o Manual de Navegação da MB recomenda somar uma margem de segurança de 10% da amplitude. A amplitude do dia é 3,0 m. O veleiro cala 1,7 m, o comandante quer 0,5 m de folga e a sondagem do ponto mais raso é 0<sub>8</sub> (0,8 m). Qual a altura mínima de maré para a passagem, já com a margem?",
"alternativas": [
"1,1 m",
"1,4 m",
"1,7 m",
"2,0 m"
],
"correta": 2,
"explicacao": "Maré necessária = calado + folga − sondagem = 1,7 + 0,5 − 0,8 = 1,4 m. A margem de 10% da amplitude é 0,10 × 3,0 = 0,3 m. Altura mínima = 1,4 + 0,3 = 1,7 m. O valor de 1,4 m esquece a margem. O valor de 1,1 m subtrai a margem em vez de somá-la. O valor de 2,0 m usa 20% da amplitude (0,6 m).",
"referencia": "Miguens, vol. I, cap. 10, p. 10-18 (margem de 10% da amplitude)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0128",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 3,
"enunciado": "Tábua do dia: baixa-mar de 0,4 m às 0400 e preamar de 2,8 m às 1000. O veleiro cala 1,7 m, o comandante exige 0,5 m de folga e a sondagem da barra é 1<sub>2</sub> (1,2 m). Pela regra dos doze avos, a partir de que horas (primeiro horário) a maré permite a passagem?",
"alternativas": [
"0500",
"0600",
"0700",
"0800"
],
"correta": 1,
"explicacao": "Maré necessária = 1,7 + 0,5 − 1,2 = 1,0 m, ou seja, 0,6 m acima da baixa-mar. A amplitude é 2,8 − 0,4 = 2,4 m, e 0,6 m é 3/12 dela, o que a regra acumula em 2 horas (1/12 + 2/12). Logo, a partir das 0600. Às 0500 a maré está em 0,6 m (só 1/12). Às 0700 (1,6 m) e às 0800 (2,2 m) também há água, mas a passagem já é possível desde as 0600, e a pergunta pede o primeiro horário.",
"referencia": "Regra dos doze avos, aproximação da curva senoidal (equivale às Tabelas I e II das Tábuas das Marés; Miguens, vol. I, cap. 10, p. 10-16 a 10-18)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Curva de maré do dia: baixa-mar de 0,4 m às 0400 e preamar de 2,8 m às 1000\"><g stroke=\"currentColor\" stroke-width=\".5\" opacity=\".35\"><line x1=\"40\" y1=\"140\" x2=\"300\" y2=\"140\"/><line x1=\"40\" y1=\"100\" x2=\"300\" y2=\"100\"/><line x1=\"40\" y1=\"60\" x2=\"300\" y2=\"60\"/><line x1=\"40\" y1=\"20\" x2=\"300\" y2=\"20\"/></g><g font-size=\"9\" fill=\"currentColor\" text-anchor=\"end\"><text x=\"35\" y=\"143\">0</text><text x=\"35\" y=\"103\">1</text><text x=\"35\" y=\"63\">2</text><text x=\"35\" y=\"23\">3 m</text></g><g font-size=\"9\" fill=\"currentColor\" text-anchor=\"middle\"><text x=\"40\" y=\"156\">0400</text><text x=\"83\" y=\"156\">0500</text><text x=\"127\" y=\"156\">0600</text><text x=\"170\" y=\"156\">0700</text><text x=\"213\" y=\"156\">0800</text><text x=\"257\" y=\"156\">0900</text><text x=\"300\" y=\"156\">1000</text></g><path d=\"M40 124 C152 124 188 28 300 28\" fill=\"none\" stroke=\"var(--sea-3)\" stroke-width=\"2.5\"/><circle cx=\"40\" cy=\"124\" r=\"3.5\" fill=\"currentColor\"/><circle cx=\"300\" cy=\"28\" r=\"3.5\" fill=\"currentColor\"/><text x=\"46\" y=\"118\" font-size=\"10\" fill=\"currentColor\">BM 0,4 m</text><text x=\"294\" y=\"20\" font-size=\"10\" text-anchor=\"end\" fill=\"currentColor\">PM 2,8 m</text></svg>"
}
},
{
"id": "mestre-0129",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 3,
"enunciado": "Tábua do dia: preamar de 3,0 m às 1200 e baixa-mar de 0,6 m às 1800. O veleiro cala 1,8 m, o comandante exige 0,6 m de folga e a sondagem da barra de saída é 0<sub>6</sub> (0,6 m). Pela regra dos doze avos, qual o último horário em que ainda se pode cruzar a barra?",
"alternativas": [
"1300",
"1400",
"1500",
"1600"
],
"correta": 2,
"explicacao": "Maré necessária = 1,8 + 0,6 − 0,6 = 1,8 m. A maré tem de cair, no máximo, 3,0 − 1,8 = 1,2 m, que é 6/12 da amplitude de 2,4 m. Na vazante, 1/12 + 2/12 + 3/12 = 6/12 se acumulam em 3 horas: 1500. Às 1300 a maré ainda está em 2,8 m e às 1400 em 2,4 m (há folga de sobra). Às 1600 ela já caiu a 1,2 m, abaixo do necessário.",
"referencia": "Regra dos doze avos, aproximação da curva senoidal (equivale às Tabelas I e II das Tábuas das Marés; Miguens, vol. I, cap. 10, p. 10-16 a 10-18)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0130",
"nivel": "mestre",
"tema": "Marés",
"dificuldade": 2,
"enunciado": "Para entrar num porto aproveitando a corrente, o comandante consulta a Carta de Correntes de Maré do local. A preamar do porto ocorrerá às 1130 e ele quer a corrente prevista para as 0830. Que carta da série deve consultar?",
"alternativas": [
"A carta de 3 horas antes da preamar, porque o horário pedido vem antes dela.",
"A da hora da preamar, pois a série tem uma carta só, a de referência.",
"A de 3 horas antes da baixa-mar, pois a série é referida à baixa-mar.",
"A de 3 horas depois da preamar, porque a corrente de maré começa após ela."
],
"correta": 0,
"explicacao": "As Cartas de Correntes de Maré trazem as setas e as velocidades referidas à hora da preamar, uma carta para cada hora antes e depois dela. Das 0830 às 1130 são 3 horas: vale a carta de 3 horas antes da preamar. A carta de 3 horas depois corresponderia às 1430. A série tem várias cartas, não só a da preamar. E a referência da publicação é a preamar, não a baixa-mar.",
"referencia": "Miguens, vol. I, cap. 10, itens 10.2.2 e 10.2.3 (Cartas de Correntes de Maré, referidas à hora da preamar)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0131",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "Por que um receptor GNSS precisa de sinais de pelo menos quatro satélites para calcular a posição em três dimensões (latitude, longitude e altitude), e não apenas de três?",
"alternativas": [
"O quarto satélite informa o datum que a carta usa, evitando erro na hora de plotar a posição.",
"Três satélites fixam a posição; o quarto é apenas uma reserva, para o caso de um deles falhar.",
"O quarto satélite transmite a correção diferencial, que melhora a exatidão da posição obtida.",
"Com o relógio do receptor perfeito, três bastariam; o quarto resolve o erro desse relógio."
],
"correta": 3,
"explicacao": "Cada satélite transmite a hora exata e a própria posição; o receptor converte o tempo de viagem do sinal em distância. Três distâncias bastariam para latitude, longitude e altitude se o relógio do receptor fosse perfeito. Como o relógio do aparelho é barato e erra, esse erro vira uma incógnita a mais (a hora), e o quarto satélite permite resolvê-la. (A bordo, com a altitude conhecida ao nível do mar, três satélites já dão latitude, longitude e hora.) O quarto satélite não transmite a correção diferencial, que vem das estações do DGNSS, e o datum da carta é escolhido por quem opera o aparelho, não enviado pelos satélites. O quarto satélite não é reserva: tem função de cálculo.",
"referencia": "Miguens, Navegação Eletrônica e em condições especiais, vol. III, cap. 37, item 37.3.3 (determinação da posição GPS)"
},
{
"id": "mestre-0132",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "O título da carta a ser usada traz o datum Córrego Alegre e uma nota com o deslocamento a aplicar às posições obtidas por satélite. O GNSS do veleiro está em WGS-84. Qual a conduta correta antes de plotar a posição do GNSS?",
"alternativas": [
"Aplicar o deslocamento da nota da carta, ou ajustar o receptor ao datum dela, e anotar o que fez.",
"Plotar a posição diretamente: a diferença de datum só importa na navegação oceânica, longe da costa.",
"Aplicar a declinação magnética da rosa da carta às coordenadas antes de plotá-las.",
"Plotar a posição diretamente: o GNSS corrige sozinho a diferença de datum em qualquer carta."
],
"correta": 0,
"explicacao": "O GNSS calcula as posições em WGS-84. Se a carta usa outro datum, a mesma coordenada cai em ponto diferente do papel, em dezenas de metros ou mais, o que pesa perto de pedras e em barras estreitas. Por isso se aplica a correção impressa na própria carta (ou se configura o datum no aparelho, que em geral sabe fazer o datum shift) e se registra a escolha. O receptor não adivinha o datum da carta e a declinação magnética trata de rumos (e não de coordenadas). E a diferença de datum importa justamente perto da costa, onde a precisão da plotagem é decisiva.",
"referencia": "Miguens, vol. III, cap. 37, item 37.3.3 (posição GPS em WGS-84; correções de datum indicadas nas cartas); vol. I, cap. 1, item 1.4 (Córrego Alegre, SAD-69, WGS-84); CHM, Cartas Náuticas (atenção ao datum)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas"
},
{
"id": "mestre-0133",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 2,
"enunciado": "O que a estação de referência de um sistema DGNSS transmite aos receptores próximos?",
"alternativas": [
"As correções de erro, obtidas ao comparar a posição conhecida da estação com a que os satélites indicam.",
"A posição, o rumo e a velocidade de todas as embarcações da região, transmitidos para evitar colisões entre elas.",
"A hora exata dos relógios atômicos dos satélites, para sincronizar o relógio de cada receptor da região.",
"A profundidade e o tipo de fundo ao redor, medidos e enviados para corrigir a leitura do ecobatímetro de bordo."
],
"correta": 0,
"explicacao": "A estação de referência sabe exatamente onde está. Ao comparar essa posição conhecida com as distâncias que mede aos satélites, calcula o erro e o transmite por rádio como correções, que os receptores próximos aplicam à própria solução. A hora dos relógios atômicos vem dos próprios satélites. A posição de outras embarcações é função do AIS, e a profundidade, do ecobatímetro, nada disso ligado ao DGNSS.",
"referencia": "Miguens, vol. III, cap. 37, item 37.9.1 (componentes e operação do DGNSS)"
},
{
"id": "mestre-0134",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 3,
"enunciado": "Em navegação costeira, com boa visibilidade, o plotter mostra de repente o veleiro 3 milhas dentro da terra, com SOG de 70 nós. O ecobatímetro e a água ao redor estão normais, e o barco segue com a mesma velocidade de antes. O que o comandante deve fazer?",
"alternativas": [
"Ampliar a escala do plotter e manter a rota, esperando a posição se corrigir sozinha com o tempo.",
"Confiar no plotter e guinar para a posição mostrada, pois o GNSS é mais exato que a vista.",
"Suspeitar de interferência ou falsificação do GNSS e navegar por marcações, sonda e estimada.",
"Reiniciar o aparelho e voltar a seguir só a tela, sem nenhuma outra conferência de posição."
],
"correta": 2,
"explicacao": "Uma posição que salta para terra e uma velocidade impossível, com o barco em condições normais, são sinais típicos de falha do GNSS, interferência (jamming) ou falsificação (spoofing). Os dados independentes (marcações, distâncias, sonda, estimada mantida em paralelo) mostram a posição real. Seguir o plotter às cegas pode levar a uma laje, e reiniciar para voltar a confiar só na tela repete o risco. Esperar sem conferir nada também deixa o barco sem posição segura.",
"referencia": "Miguens, Navegação Eletrônica e em condições especiais, vol. III, cap. 37 (GNSS: bloqueio, falsificação e falhas do sinal)"
},
{
"id": "mestre-0135",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 2,
"enunciado": "Use a fórmula do horizonte radar, Dr = 2,21 √H (Dr em milhas, H em metros). A antena de um radar está a 9 m acima da água. Até que distância o radar alcança a linha do horizonte, para um alvo rente à superfície do mar?",
"alternativas": [
"3,0 M",
"6,6 M",
"13,3 M",
"19,9 M"
],
"correta": 1,
"explicacao": "√9 = 3 e 2,21 × 3 = 6,63 ≈ 6,6 M. O valor de 3,0 M é só a raiz quadrada, sem o fator 2,21. O valor de 19,9 M multiplica 2,21 por 9, sem a raiz. O valor de 13,3 M dobra o resultado correto, confundindo o alcance com o percurso de ida e volta do pulso. As ondas do radar curvam levemente para baixo, e por isso o horizonte radar é cerca de 14% maior que o geográfico.",
"referencia": "Miguens, vol. I (2ª rev. 2023), cap. 14, item 14.1.3 (refração: o horizonte radar, Dr = 2,21 √H, p. 14-10/14-11)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0136",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 3,
"enunciado": "A antena do radar está a 9 m de altura e o alvo, um navio, tem 16 m de altura. Pela fórmula D = 2,21 (√H + √h), com H e h em metros, a que distância aproximada o alvo passa a aparecer na tela?",
"alternativas": [
"8,8 M",
"11,1 M",
"15,5 M",
"55,3 M"
],
"correta": 2,
"explicacao": "√9 = 3 e √16 = 4. D = 2,21 × (3 + 4) = 2,21 × 7 ≈ 15,5 M. O valor de 8,8 M considera só o alvo (2,21 × 4). O valor de 11,1 M extrai a raiz da soma das alturas (2,21 × √25 = 2,21 × 5). O valor de 55,3 M soma as alturas sem extrair raiz (2,21 × 25). Cada altura entra com a própria raiz, porque os dois horizontes se somam.",
"referencia": "Miguens, vol. I (2ª rev. 2023), cap. 14, item 14.1.3 (horizonte radar e distância de detecção, p. 14-11)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0137",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 2,
"enunciado": "Com mar picado, o centro da tela do radar aparece coberto de pontos brilhantes, que escondem alvos próximos. Qual o ajuste adequado?",
"alternativas": [
"Aumentar o ganho ao máximo, para que os ecos fortes dos alvos se destaquem das ondas.",
"Ligar o anti-clutter de chuva (FTC) ao máximo, pois ele elimina o retorno das ondas.",
"Aumentar o anti-clutter de mar (STC) só até o retorno das ondas virar pontos fracos.",
"Passar para a escala maior com pulso longo, que elimina o retorno do mar perto do barco."
],
"correta": 2,
"explicacao": "O anti-clutter de mar (STC) reduz o ganho só perto do barco, onde as ondas refletem mais. Deve ser aumentado até o retorno virar pontos fracos e nunca mais que isso: em excesso, apaga também barcos pequenos e boias. Mais ganho piora o clutter, pois amplifica o eco das ondas junto com o dos alvos. O anti-clutter de chuva atua sobre manchas de chuva, não sobre as ondas. E escala maior com pulso longo perde discriminação e não elimina o retorno do mar.",
"referencia": "Miguens, vol. I (2ª rev. 2023), cap. 14, item 14.1.5 c) e d) (controles STC e FTC, p. 14-20/14-21)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0138",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "Pelo radar, o comandante acompanha um eco que se aproxima: a distância diminui e a marcação quase não muda. Segundo a Regra 7 do RIPEAM, o que isso indica?",
"alternativas": [
"Que o outro barco vai passar com folga pela proa, pois sua marcação não está variando.",
"Que o eco é um alvo fixo, como uma pedra, e não oferece risco algum.",
"Que o outro barco tem AIS ligado e fará sozinho a manobra para evitar.",
"Que existe risco de abalroamento, o qual deve ser considerado presente."
],
"correta": 3,
"explicacao": "A Regra 7(d)(i) manda considerar que existe risco de abalroamento se a marcação de uma embarcação que se aproxima não varia de modo apreciável, e a Regra 7(a) manda presumi-lo em caso de dúvida. Marcação constante com distância diminuindo é o sinal clássico de rota de colisão. Um alvo que passa pela proa mostraria marcação variando. Mesmo um alvo fixo, como uma pedra, com marcação constante e distância diminuindo, está na rota do barco e oferece risco. E a presença de AIS não tira de ninguém o dever de manobrar nem de manter vigia.",
"referencia": "RIPEAM, Regra 7(a) e 7(d)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0139",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "O pulso do ecobatímetro leva 0,02 s para ir ao fundo e voltar ao transdutor. Tomando a velocidade do som na água do mar como 1.500 m/s, qual a profundidade abaixo do transdutor?",
"alternativas": [
"7,5 m",
"15 m",
"30 m",
"150 m"
],
"correta": 1,
"explicacao": "O tempo medido é de ida e volta, então a profundidade é h = v × t ÷ 2 = 1.500 × 0,02 ÷ 2 = 15 m. O valor de 30 m esquece de dividir por 2. O valor de 7,5 m divide por 2 duas vezes. O valor de 150 m erra uma casa decimal.",
"referencia": "Miguens, vol. I (2ª rev. 2023), cap. 11, item 11.5.2 (ecobatímetros: h = v·t/2, v ≈ 1.500 m/s)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0140",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 3,
"enunciado": "O ecobatímetro, sem ajuste de offset, mostra 4,2 m, contados a partir do transdutor. O transdutor está 0,3 m abaixo da superfície e o fundo da quilha está 1,5 m abaixo da superfície. Qual a folga real abaixo da quilha?",
"alternativas": [
"2,7 m",
"3,0 m",
"4,2 m",
"4,5 m"
],
"correta": 1,
"explicacao": "Entre o transdutor e o fundo da quilha há 1,5 − 0,3 = 1,2 m. A folga real é 4,2 − 1,2 = 3,0 m. O valor de 2,7 m desconta o calado inteiro (4,2 − 1,5), sem notar que o transdutor já está 0,3 m abaixo da superfície. O valor de 4,2 m é a leitura direta, sem descontar nada. O valor de 4,5 m é a profundidade total (4,2 + 0,3), que se compara com a carta, e não com a quilha.",
"referencia": "Miguens, vol. I, cap. 11, item 11.5.2 (transdutor no fundo do casco); conceito de offset do transdutor",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0141",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 2,
"enunciado": "No plotter, o comandante vê um navio com AIS à frente. No radar aparecem dois ecos: o do navio e outro, menor, sem identificação no plotter. O que ele deve fazer?",
"alternativas": [
"Ignorar o eco menor: sem AIS ele não é embarcação, e sim ruído do radar do próprio barco.",
"Confiar apenas no AIS do navio e reduzir a escala do radar até o eco menor desaparecer.",
"Chamar o eco menor pelo MMSI no VHF, pedindo que ele ligue o AIS para ser identificado.",
"Tratar o eco menor como embarcação real, acompanhar sua marcação e manter a vigia visual."
],
"correta": 3,
"explicacao": "Nem toda embarcação tem AIS: pesqueiros e barcos pequenos muitas vezes não transmitem, e o AIS não substitui o radar nem a vigia (RIPEAM, Regra 5). O eco sem AIS deve ser tratado como alvo real, avaliando o risco com a variação da marcação (Regra 7). Quem não transmite AIS não tem MMSI para ser chamado, e reduzir a escala só esconde o alvo, sem eliminá-lo.",
"referencia": "RIPEAM, Regras 5 e 7",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0142",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "Em que frequência a EPIRB de uma embarcação brasileira deve transmitir o alerta de socorro aos satélites do sistema Cospas-Sarsat?",
"alternativas": [
"2.182 kHz",
"121,5 MHz",
"156,8 MHz",
"406 MHz"
],
"correta": 3,
"explicacao": "A NORMAM-211 exige que a EPIRB transmita via satélite na faixa de 406 MHz; o alerta chega ao BRMCC, que aciona o SALVAMAR. Desde fevereiro de 2009 o Cospas-Sarsat não processa mais 121,5 MHz (essa frequência serve só como sinal de homing para os meios de busca). O valor de 156,8 MHz é o canal 16 do VHF, e 2.182 kHz é uma antiga frequência de socorro em MF, nenhuma delas usada pela EPIRB.",
"referencia": "NORMAM-211/DPC, art. 4.23.6 c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0143",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 2,
"enunciado": "Um comandante compra uma EPIRB 406 MHz para o veleiro. Quanto ao cadastro e à codificação, o que a NORMAM-211 determina?",
"alternativas": [
"Cadastro no INFOSAR (DECEA), com código iniciado por 406, que é a frequência de transmissão da baliza.",
"Dispensa de cadastro, se a EPIRB for de tipo aprovado e vier codificada de fábrica pelo fabricante.",
"Cadastro no INFOSAR (DECEA), com código iniciado por 710 (Brasil) e seis dígitos da estação.",
"Cadastro no INFOSAR (DECEA), mas com código livre, escolhido pelo fabricante do aparelho ou pelo dono."
],
"correta": 2,
"explicacao": "A NORMAM-211 manda cadastrar toda EPIRB no INFOSAR, serviço do DECEA, e fixa o código: começa por 710 (identificação do Brasil), seguido de seis dígitos da estação, que é o MMSI. O código não é livre, e o cadastro não é dispensado nem para aparelhos de tipo aprovado. O número 406 é a frequência, e não faz parte do código.",
"referencia": "NORMAM-211/DPC, art. 4.23.6 d) e e)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0144",
"nivel": "mestre",
"tema": "Eletrônica (GNSS, radar, ecobatímetro, AIS, EPIRB)",
"dificuldade": 1,
"enunciado": "O AIS de um navio mercante transmite automaticamente, em VHF, dados que aparecem no plotter de um veleiro com receptor AIS. Quais são alguns deles?",
"alternativas": [
"Somente o nome e a bandeira, pois a posição do navio é obtida pelo radar do veleiro.",
"A previsão do tempo e a altura da maré no local em que o navio se encontra.",
"A marcação e a distância do veleiro em relação ao navio, medidas pelo radar dele.",
"Identidade (MMSI e nome), posição obtida por GNSS, rumo e velocidade no fundo."
],
"correta": 3,
"explicacao": "O AIS (Sistema Automático de Identificação) envia, em canais VHF próprios, a identidade do barco (MMSI, nome, indicativo, tipo e dimensões), a posição do GNSS, o rumo e a velocidade no fundo. Quem recebe vê esses alvos no plotter, mesmo atrás de uma ilha. A posição vem do GNSS do próprio transmissor, não do radar de quem recebe. O AIS não transmite meteorologia nem dados de maré, e não envia medidas de radar do navio.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 n); IMO, SOLAS Cap. V, Regra 19 (AIS); ITU-R M.1371",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0145",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 1,
"enunciado": "Um veleiro de cruzeiro sai do mar e sobe um rio de água doce, sem mudar a carga. O que acontece com o calado?",
"alternativas": [
"Não muda, pois o empuxo depende só do volume do casco, e não da água em que ele flutua.",
"Aumenta um pouco: a água doce é menos densa, e o casco precisa afundar mais para flutuar.",
"Diminui um pouco, porque a água doce exerce menos pressão e o casco se ergue na água.",
"Diminui um pouco, porque o peso do barco é menor em água doce que na água do mar."
],
"correta": 1,
"explicacao": "Pelo princípio de Arquimedes, o barco flutua quando o empuxo iguala o seu peso, e o empuxo é o peso da água deslocada. A água do mar tem cerca de 1,025 t/m³ e a doce, 1,000 t/m³, então, para deslocar o mesmo peso, o casco precisa deslocar mais volume em água doce e afunda um pouco mais. Nem a pressão nem o peso explicam a mudança: o peso do barco é o mesmo em qualquer água, e o empuxo depende da densidade do líquido, e não apenas do volume do casco.",
"referencia": "Princípio de Arquimedes; NORMAM-211/DPC, Anexo 5-A, item 2.1 e)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0146",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 1,
"enunciado": "Durante uma travessia com mar agitado, o tanque de água do veleiro está pela metade. Que efeito isso tem sobre a estabilidade?",
"alternativas": [
"Nenhum, pois a água do tanque conta como peso fixo, e só interessa o peso total do barco na estabilidade.",
"Só piora o conforto: o líquido faz o barco balançar mais, mas o braço de endireitamento continua igual.",
"O líquido vai para o bordo baixo e reduz o braço de endireitamento, como se o barco ficasse mais alto.",
"Aumenta a estabilidade, porque o líquido age como um lastro móvel que amortece o balanço do barco."
],
"correta": 2,
"explicacao": "É o efeito de superfície livre. Com o tanque meio cheio, o líquido escorre para o lado que desce, desloca o centro de gravidade do conjunto para esse bordo e reduz o braço de endireitamento (GZ), o que equivale a diminuir a altura metacêntrica. Em tanque cheio ou vazio o efeito não existe. Por isso se evita nível intermediário em mau tempo. A água solta nunca ajuda como lastro, e a perda de estabilidade vai além do conforto.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 e) (noções de estabilidade e flutuabilidade); princípios de estática naval (superfície livre)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0147",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 2,
"enunciado": "Um comandante mede o balanço do veleiro fundeado: uma oscilação completa levava 4 s. Depois de levar galões de combustível sobre a cabine, com o mesmo mar, passou a levar 6 s. O que isso sugere?",
"alternativas": [
"O GM aumentou: o barco ficou mais duro, e por isso balança mais devagar.",
"Nada de importante: o período de balanço depende só da altura das ondas no fundeio.",
"O calado diminuiu: o barco ficou mais leve e, por isso, balança mais devagar que antes.",
"O GM diminuiu: o centro de gravidade subiu e a estabilidade inicial ficou menor."
],
"correta": 3,
"explicacao": "Quanto maior o GM, mais forte o endireitamento e menor o período: o barco “duro” balança depressa. Um período maior significa GM menor, “barco mole”. Pesos altos, como galões sobre a cabine, sobem o centro de gravidade e reduzem o GM, e o que indica o problema é justamente o balanço mais lento. Mais carga não diminui o calado, e o período próprio do barco não depende só do mar.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 e) (noções de estabilidade e flutuabilidade); princípios de estática naval (período de balanço e GM)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0148",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 2,
"enunciado": "Um veleiro desloca 5 t. Um tripulante leva 200 kg de equipamento do porão para o convés, 1,5 m mais alto. Em quanto sobe o centro de gravidade do barco, aproximadamente?",
"alternativas": [
"0,03 m",
"0,06 m",
"0,6 m",
"1,5 m"
],
"correta": 1,
"explicacao": "A subida do centro de gravidade é o peso movido × a altura ÷ o deslocamento: 200 kg × 1,5 m ÷ 5.000 kg = 0,06 m, ou 6 cm. O valor de 0,03 m corta o resultado pela metade. O valor de 0,6 m erra uma casa decimal. O valor de 1,5 m supõe que o centro de gravidade do barco acompanha o peso, mas o equipamento é só uma pequena parte do deslocamento.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 e) (noções de estabilidade e flutuabilidade); princípios de estática naval (deslocamento de pesos: GG1 = p·d/Δ)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0149",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 3,
"enunciado": "Para pequenas inclinações vale tg(banda) ≈ (peso movido × distância transversal) ÷ (deslocamento × GM). Um veleiro de 6 t, com GM de 0,5 m, tem 200 kg deslocados 1,5 m para boreste. Qual a banda permanente aproximada, em águas calmas?",
"alternativas": [
"0,6°",
"3°",
"6°",
"11°"
],
"correta": 2,
"explicacao": "Numerador: 200 × 1,5 = 300 kg·m. Denominador: 6.000 × 0,5 = 3.000 kg·m. tg(banda) = 0,10, o que dá cerca de 5,7°, ou seja, aproximadamente 6°. O valor de 3° resulta de esquecer o GM (tg = 300 ÷ 6.000 = 0,05). O valor de 11° supõe GM de 0,25 m. O valor de 0,6° erra o resultado por um fator de 10.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 e) (noções de estabilidade e flutuabilidade); princípios de estática naval (banda por deslocamento transversal de pesos)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0150",
"nivel": "mestre",
"tema": "Estabilidade e flutuabilidade",
"dificuldade": 2,
"enunciado": "O que é a reserva de flutuabilidade de uma embarcação, e o que acontece com ela quando o barco é sobrecarregado?",
"alternativas": [
"É o volume dos tanques de combustível e de água, que diminui quando eles são esvaziados.",
"É o empuxo extra gerado pelo lastro, que diminui quando se embarca carga leve.",
"É a distância entre G e M, que diminui quando a carga é posta abaixo do centro de gravidade.",
"É o volume estanque acima da linha d’água, que diminui quando o excesso de peso afunda o casco."
],
"correta": 3,
"explicacao": "A reserva de flutuabilidade é o volume do casco, acima da linha d’água, que pode ainda ficar submerso sem que o barco afunde. Ela está ligada à borda livre: o excesso de peso afunda o casco, reduz a borda livre e a reserva, e o barco passa a embarcar água com mais facilidade. Os tanques, o lastro e a distância GM tratam de outras ideias: peso, estabilidade inicial e posição do centro de gravidade.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 e) (noções de estabilidade e flutuabilidade); princípios de estática naval (reserva de flutuabilidade e borda livre)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0151",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 1,
"enunciado": "Um tripulante de colete cai em água fria, e a respiração dispara por causa do choque térmico. O que ele deve fazer nos primeiros minutos?",
"alternativas": [
"Flutuar de costas, deixando o colete sustentar o corpo, até a respiração acalmar.",
"Nadar com força até o barco, para se aquecer com o exercício e alcançar o casco logo.",
"Tirar as roupas pesadas na hora, para nadar com mais facilidade até o barco e o resgate.",
"Gritar sem parar até o barco chegar, mantendo o corpo na vertical e a cabeça bem alta."
],
"correta": 0,
"explicacao": "O choque térmico faz a pessoa ofegar e pode afogá-la em segundos; nos primeiros minutos o essencial é “flutuar para viver”: de costas, braços e pernas abertos, deixando o colete trabalhar, até controlar a respiração. Só depois se pensa em se fazer notar, se segurar ou usar a posição HELP. Nadar gasta força e calor, e tirar roupa deixa o corpo exposto ao frio. Gritar e ficar na vertical, ofegando, aumenta o risco de engolir água.",
"referencia": "Sobrevivência no mar (Rezende); NORMAM-211/DPC, Anexo 5-A, item 2.1 o)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0152",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 2,
"enunciado": "Um tripulante de colete espera o resgate sozinho, em água fria, sem nada a que se agarrar. Que posição economiza mais calor?",
"alternativas": [
"Posição HELP: pernas dobradas contra o peito, braços junto ao tronco e cabeça fora d’água.",
"Nadar devagar de costas, para manter o corpo aquecido pelo movimento e não ficar parado.",
"Ficar na vertical, com os braços abertos sobre o colete, para manter a cabeça alta.",
"Deitar de bruços com o rosto na água, para proteger o peito e a barriga do vento frio."
],
"correta": 0,
"explicacao": "A posição HELP (Heat Escape Lessening Posture) protege as áreas onde o corpo perde mais calor: virilha, axilas, peito e pescoço. Com colete, a pessoa pode ficar parada e economizar energia. Nadar, mesmo devagar, gasta calor e força. Ficar com os braços abertos expõe as axilas e o peito. Deitar de bruços é perigoso, pois o rosto na água pode afogar quem perde as forças.",
"referencia": "Sobrevivência no mar (Rezende); NORMAM-211/DPC, Anexo 5-A, item 2.1 o)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0153",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 2,
"enunciado": "Um tripulante é retirado da água depois de 40 minutos, tremendo e confuso. Qual o cuidado correto a bordo?",
"alternativas": [
"Mantê-lo em pé e andando pelo convés, para o movimento aquecê-lo mais depressa e sem demora.",
"Deitá-lo, trocar a roupa molhada por seca ou manta, abrigá-lo do vento e pedir ajuda médica.",
"Esfregar braços e pernas com força, para a circulação voltar ao normal o quanto antes.",
"Dar uma dose de bebida alcoólica, para aquecer o corpo por dentro e animar a pessoa."
],
"correta": 1,
"explicacao": "Na hipotermia o corpo perde calor, e o cuidado é impedir que perca mais: retirar da água na horizontal, trocar a roupa molhada por seca ou envolver em manta, proteger cabeça e tronco e abrigar do vento. Convém pedir orientação médica pelo rádio (PAN-PAN) ou pelo SALVAMAR (185). Massagear os membros empurra sangue frio para o centro do corpo, o álcool dilata os vasos e aumenta a perda de calor, e ficar em pé ou andar pode provocar queda da pressão e arritmia.",
"referencia": "Sobrevivência no mar (Rezende), hipotermia; NORMAM-211/DPC, Anexo 5-A, item 2.1 o); SALVAMAR 185 (orientação médica)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0154",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 2,
"enunciado": "O sinal de socorro mais adequado para ser notado de dia por uma aeronave que se aproxima, e que também mostra a direção do vento, é:",
"alternativas": [
"o sinal fumígeno flutuante de fumaça laranja.",
"a lanterna estroboscópica do colete salva-vidas.",
"o facho manual de luz vermelha.",
"o foguete de estrelas vermelhas, disparado em salvas."
],
"correta": 0,
"explicacao": "Durante o dia, a fumaça laranja contrasta com o mar e permanece visível por algum tempo; além disso, o seu desvio mostra ao piloto a direção do vento, o que ajuda na aproximação. O facho manual e o foguete são luzes, mais eficazes à noite, e o foguete tem curta duração. A lanterna estroboscópica do colete foi feita para atrair a atenção à noite e quase não aparece sob o sol.",
"referencia": "RIPEAM, Anexo IV, item 1(j) (fumaça de cor alaranjada); NORMAM-211/DPC, art. 4.16 c) (sinal fumígeno flutuante laranja, uso diurno)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0155",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 3,
"enunciado": "O veleiro bate numa pedra e começa a alagar devagar, mas ainda flutua, e o MAYDAY já foi transmitido. A balsa está pronta no convés. Qual a melhor conduta?",
"alternativas": [
"Abandonar de imediato para a balsa e cortar a retinida, para o barco não arrastar a balsa junto.",
"Controlar o alagamento enquanto der, manter a balsa presa e pronta, e abandonar só se ele afundar.",
"Lançar a balsa e esperar todos dentro dela, mesmo com o barco flutuando bem e sem perigo imediato.",
"Desligar o rádio para poupar bateria e aguardar sem avaliar a velocidade com que o barco alaga."
],
"correta": 1,
"explicacao": "O veleiro, mesmo alagando, é um alvo maior e mais fácil de achar, oferece abrigo e mantém a EPIRB e o rádio. A orientação clássica é ficar a bordo enquanto ele flutuar, tentando controlar a água, com a balsa pronta e presa pela retinida para entrar nela ao primeiro sinal de afundamento, passando para dentro sem molhar-se. Abandonar cedo expõe todos ao frio. Cortar a retinida cedo, ou esperar na balsa com o barco intacto, joga fora a vantagem do barco. Ficar sem rádio ou sem avaliar o alagamento tira o socorro e o tempo de decidir.",
"referencia": "Sobrevivência no mar (Rezende), abandono e balsa salva-vidas; NORMAM-211/DPC, Anexo 5-A, item 2.1 o)"
},
{
"id": "mestre-0156",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 2,
"enunciado": "Já na balsa, em água fria, com a tenda aberta e o piso molhado, o que deve ser feito primeiro?",
"alternativas": [
"Racionar a água e a comida desde já, para que durem o maior tempo possível.",
"Disparar todos os pirotécnicos de uma vez, para ser visto o quanto antes.",
"Remar para a costa mais próxima, para encurtar a espera pelo resgate.",
"Fechar a tenda, tirar a água do piso e tratar do frio, o perigo mais imediato."
],
"correta": 3,
"explicacao": "Em água fria, o frio mata antes da sede ou da fome; por isso a primeira prioridade na balsa é proteção: fechar a tenda, esgotar a água, isolar o piso e agrupar as pessoas, antes de racionar mantimentos. Remar gasta energia e afasta a balsa do ponto da emergência, onde estão os meios de busca. Disparar todos os pirotécnicos de uma vez desperdiça os sinais, que devem ser usados quando há alguém para ver.",
"referencia": "Sobrevivência no mar (Rezende), cap. sobre balsas; NORMAM-211/DPC, Anexo 5-A, item 2.1 o)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0157",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 3,
"enunciado": "À noite, com mar formado, um tripulante cai do veleiro. Há três outros a bordo. Qual a sequência inicial mais correta?",
"alternativas": [
"Gritar “homem ao mar”, lançar a boia com luz, pôr alguém só para apontá-lo e acionar o MOB do GNSS.",
"Ligar o VHF e transmitir o MAYDAY completo, e só depois lançar a boia, pois o socorro externo vem antes.",
"Parar o barco imediatamente e esperar que o tripulante nade de volta até o casco, sem mais ações.",
"Mergulhar atrás dele com um colete, porque o veleiro demora a voltar e a corrente o levará."
],
"correta": 0,
"explicacao": "O MOB exige gestos imediatos: alertar a tripulação, lançar a boia com luz e retinida (que também marca o local), designar um vigia que aponte sem tirar os olhos e gravar a posição no GNSS. A comunicação por rádio vem logo depois, mas não antes da boia. Mergulhar põe mais uma pessoa na água, e esperar que nade de volta é impossível com mar formado e água fria.",
"referencia": "Sobrevivência no mar (Rezende), homem ao mar; RIPEAM, Regra 5 (vigilância)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0158",
"nivel": "mestre",
"tema": "Sobrevivência",
"dificuldade": 2,
"enunciado": "O colete inflável do comandante está guardado, sem uso, há três anos. Qual a conduta correta antes da próxima saída?",
"alternativas": [
"Revisar o cilindro de CO₂, o disparo e a bolsa, e fazer o teste de estanqueidade.",
"Trocar só a capa, pois o cilindro e o mecanismo duram tanto quanto o barco.",
"Usar o colete normalmente, pois o inflável não se deteriora enquanto fica guardado seco.",
"Disparar o colete para testar e reaproveitar o mesmo cilindro depois de reinflar a bolsa."
],
"correta": 0,
"explicacao": "O colete inflável depende de peças que se desgastam: cilindro de CO₂ (que pode enferrujar ou perder carga), mecanismo de disparo (pastilha ou cápsula com prazo) e bolsa (que pode furar). Por isso se revisa conforme o fabricante, inclusive com teste de estanqueidade: infla-se a bolsa e observa-se a perda de pressão por algumas horas. Trocar só a capa não resolve o mecanismo, e presumir que o colete dura é arriscado, pois ele pode falhar quando for necessário. Cilindro disparado não se reutiliza.",
"referencia": "Sobrevivência no mar (Rezende), coletes salva-vidas"
},
{
"id": "mestre-0159",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "A figura mostra um trecho de carta sinótica de superfície no Atlântico Sul. O ponto <b>P</b> fica no litoral do Sudeste, a oeste de um anticiclone (<b>A</b>). Sem influências locais, de que direção sopra o vento à superfície em P?",
"alternativas": [
"De sudeste (SE): seria o giro de uma alta no Hemisfério Norte.",
"De sudoeste (SW): o vento sopra para dentro da alta, em direção ao seu centro.",
"De nordeste (NE): o ar sai da alta e se desvia para fora pelo atrito.",
"De norte (N): o vento segue as isóbaras, sem se desviar para fora da alta."
],
"correta": 2,
"explicacao": "No Hemisfério Sul o vento gira no sentido anti-horário em torno de uma alta. No lado oeste da alta o ar corre para o sul (vento de norte) e, pelo atrito, se desvia para oeste, isto é, para fora do centro: o resultado é vento de nordeste em P, típico do litoral Sudeste sob o Anticiclone do Atlântico Sul. Vento de SE seria o giro horário do Hemisfério Norte. SW está errado porque o vento sai da alta, e não entra nela. Vento de N seguiria as isóbaras só sem atrito; na superfície o atrito o desvia para fora da alta.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.4 (circulação em torno de altas e baixas; Figura 45.21)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 190\" role=\"img\" aria-label=\"Carta sinótica esquemática: anticiclone A no oceano, a leste do ponto P no litoral\"><rect width=\"320\" height=\"190\" fill=\"var(--sea-1)\"/><polygon points=\"0,0 108,0 122,55 112,100 128,150 118,190 0,190\" fill=\"var(--land)\"/><g fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1.3\"><circle cx=\"240\" cy=\"95\" r=\"28\"/><circle cx=\"240\" cy=\"95\" r=\"54\"/><circle cx=\"240\" cy=\"95\" r=\"80\"/></g><g font-size=\"10\" fill=\"var(--ink)\" text-anchor=\"middle\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\"><text x=\"240\" y=\"70\">1024</text><text x=\"240\" y=\"44\">1020</text><text x=\"240\" y=\"18\">1016</text></g><text x=\"240\" y=\"103\" font-size=\"24\" font-weight=\"700\" text-anchor=\"middle\" fill=\"var(--ink)\">A</text><circle cx=\"113\" cy=\"95\" r=\"5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"98\" y=\"91\" font-size=\"14\" font-weight=\"700\" text-anchor=\"end\" fill=\"var(--ink)\">P</text><text x=\"40\" y=\"120\" font-size=\"11\" fill=\"var(--ink)\">Terra</text><g stroke=\"var(--ink)\" stroke-width=\"1.5\" fill=\"var(--ink)\"><line x1=\"150\" y1=\"42\" x2=\"150\" y2=\"18\"/><polygon points=\"150,12 145,22 155,22\"/></g><text x=\"150\" y=\"58\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">N</text></svg>"
}
},
{
"id": "mestre-0160",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 1,
"enunciado": "A figura mostra isóbaras desenhadas de 4 em 4 hPa. Em qual dos pontos o vento à superfície tende a ser mais forte, e por quê?",
"alternativas": [
"No ponto Y, porque há mais espaço entre as isóbaras para o vento ganhar velocidade.",
"No ponto X, porque as isóbaras estão mais juntas e o gradiente de pressão é maior.",
"Nos dois igual, porque a diferença entre duas isóbaras vizinhas é sempre de 4 hPa.",
"No ponto Y, porque a pressão ali é mais alta do que em X."
],
"correta": 1,
"explicacao": "A mesma queda de 4 hPa em menos distância significa gradiente maior e vento mais forte: isóbaras apertadas, vento forte. O espaço largo entre isóbaras não acelera o vento, ao contrário: indica gradiente fraco. A diferença de 4 hPa é igual nos dois, mas o que importa é a distância em que ela acontece. A pressão mais alta em Y não torna o vento mais forte; o que manda é o gradiente.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.4 (gradiente barométrico e força do vento)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 170\" role=\"img\" aria-label=\"Isóbaras de 4 em 4 hPa: muito próximas na esquerda (ponto X) e bem espaçadas na direita (ponto Y)\"><rect width=\"320\" height=\"170\" fill=\"var(--sea-1)\"/><g fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"1.3\"><path d=\"M30 0 Q38 85 30 150\"/><path d=\"M55 0 Q63 85 55 150\"/><path d=\"M80 0 Q88 85 80 150\"/><path d=\"M105 0 Q113 85 105 150\"/><path d=\"M165 0 Q173 85 165 150\"/><path d=\"M225 0 Q233 85 225 150\"/><path d=\"M285 0 Q293 85 285 150\"/></g><g font-size=\"10\" fill=\"var(--ink)\" text-anchor=\"middle\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\"><text x=\"30\" y=\"164\">1000</text><text x=\"55\" y=\"164\">1004</text><text x=\"80\" y=\"164\">1008</text><text x=\"105\" y=\"164\">1012</text><text x=\"165\" y=\"164\">1016</text><text x=\"225\" y=\"164\">1020</text><text x=\"285\" y=\"164\">1024</text></g><g fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"><circle cx=\"71\" cy=\"70\" r=\"5\"/><circle cx=\"198\" cy=\"70\" r=\"5\"/></g><g font-size=\"14\" font-weight=\"700\" fill=\"var(--ink)\" text-anchor=\"middle\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\"><text x=\"71\" y=\"55\">X</text><text x=\"198\" y=\"55\">Y</text></g></svg>"
}
},
{
"id": "mestre-0161",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "O gráfico mostra o registro do barógrafo de um veleiro fundeado no litoral de Santa Catarina durante 24 horas. Em que horário, aproximadamente, uma frente fria passou pelo barco?",
"alternativas": [
"Por volta das 06 h, quando a queda de pressão começou a se acentuar, com o barômetro ainda caindo.",
"Por volta das 18 h, quando a pressão já tinha se recuperado em boa parte e o céu clareava.",
"Por volta das 12 h, no ponto mais baixo da curva, quando a pressão para de cair e sobe.",
"Por volta das 00 h, no início do registro, com a pressão ainda alta e o tempo calmo."
],
"correta": 2,
"explicacao": "Na passagem da frente fria a pressão chega ao mínimo e começa a subir, e o vento ronda para SW. No gráfico isso acontece por volta das 12 h. Às 06 h a frente ainda está se aproximando, com a pressão em queda. Às 18 h ela já passou há algumas horas e a pressão sobe. Às 00 h o barco ainda está longe da frente, com pressão alta e tempo calmo.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 2026), cap. 45, item 45.4 (aproximação e passagem de frentes frias)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 330 205\" role=\"img\" aria-label=\"Registro do barógrafo em 24 horas: a pressão cai até cerca de 12 h e depois sobe depressa\"><g stroke=\"var(--ink)\" stroke-opacity=\"0.2\" stroke-width=\"1\"><line x1=\"40\" y1=\"30\" x2=\"300\" y2=\"30\"/><line x1=\"40\" y1=\"65\" x2=\"300\" y2=\"65\"/><line x1=\"40\" y1=\"100\" x2=\"300\" y2=\"100\"/><line x1=\"40\" y1=\"135\" x2=\"300\" y2=\"135\"/></g><g stroke=\"var(--ink)\" stroke-width=\"1.5\"><line x1=\"40\" y1=\"170\" x2=\"300\" y2=\"170\"/><line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"170\"/><line x1=\"105\" y1=\"170\" x2=\"105\" y2=\"175\"/><line x1=\"170\" y1=\"170\" x2=\"170\" y2=\"175\"/><line x1=\"235\" y1=\"170\" x2=\"235\" y2=\"175\"/><line x1=\"300\" y1=\"170\" x2=\"300\" y2=\"175\"/></g><g font-size=\"11\" fill=\"var(--ink)\" text-anchor=\"middle\"><text x=\"40\" y=\"190\">00 h</text><text x=\"105\" y=\"190\">06 h</text><text x=\"170\" y=\"190\">12 h</text><text x=\"235\" y=\"190\">18 h</text><text x=\"300\" y=\"190\">24 h</text></g><g font-size=\"11\" fill=\"var(--ink)\" text-anchor=\"end\"><text x=\"35\" y=\"174\">1000</text><text x=\"35\" y=\"139\">1004</text><text x=\"35\" y=\"104\">1008</text><text x=\"35\" y=\"69\">1012</text><text x=\"35\" y=\"34\">1016</text></g><text x=\"40\" y=\"13\" font-size=\"11\" fill=\"var(--ink)\">hPa</text><path d=\"M40 65 C70 66 90 74 105 83 C130 100 150 140 170 146 C190 140 205 100 235 76 C260 56 280 44 300 39\" fill=\"none\" stroke=\"var(--nav-red)\" stroke-width=\"2.5\"/></svg>"
}
},
{
"id": "mestre-0162",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "No Hemisfério Sul, um veleiro ao largo de Cabo Frio (RJ) sente o vento verdadeiro de sudeste (135°). Pela lei de Buys-Ballot, em que direção aproximada está o centro da baixa pressão?",
"alternativas": [
"Para nordeste, cerca de 025°: de frente para o vento, a baixa fica à esquerda, a uns 110° dele.",
"Para sudoeste, cerca de 245°: de frente para o vento, a baixa fica à direita, como no Hemisfério Norte.",
"Para sudeste, cerca de 135°: a baixa fica exatamente na direção de onde vem o vento, como se ele saísse dela.",
"Para noroeste, cerca de 315°: a baixa fica na direção para onde vai o vento, que sopra rumo a ela."
],
"correta": 0,
"explicacao": "No Hemisfério Sul, de frente para o vento verdadeiro a baixa fica à esquerda, a cerca de 110° da direção de onde ele sopra: 135° − 110° = 025°. Girar para a direita (135° + 110° = 245°) é aplicar a regra do Hemisfério Norte. O vento não sopra direto da baixa nem para ela, por causa do desvio causado pela rotação da Terra. Por isso a baixa não está nem na direção de onde vem o vento (135°) nem para onde ele vai (315°).",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.4 (lei de Buys-Ballot)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0163",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 3,
"enunciado": "Na costa de Santa Catarina, uma frente fria passa e o vento ronda de noroeste (315°) para sudoeste (225°). Em que sentido o vento girou?",
"alternativas": [
"No sentido horário, como ocorre na passagem de uma frente fria no Hemisfério Norte.",
"No sentido horário, porque as baixas do Hemisfério Sul giram nesse sentido.",
"Em nenhum sentido definido: a mudança foi brusca e o vento apenas trocou de lado.",
"No sentido anti-horário: a direção de onde o vento vem diminuiu de 315° para 225°."
],
"correta": 3,
"explicacao": "De NW (315°) para SW (225°) o vento passa por W (270°), com o valor da direção diminuindo: é um giro anti-horário. No Hemisfério Sul a passagem de uma frente fria faz o vento girar assim, o contrário do Hemisfério Norte, onde ele gira no sentido horário. A circulação horária em torno da baixa descreve o movimento do ar ao redor do centro, e não a mudança de direção que um observador fixo sente quando a frente passa. A mudança é brusca, mas passa por direções intermediárias e tem sentido definido.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.3.3 a (frente fria: no HS o vento ronda no sentido anti-horário, de NE ou N para NW e depois SW) e item 45.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0164",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Num dia de julho, ao largo do litoral de São Paulo, o vento fraco de nordeste traz ar quente e úmido sobre águas mais frias, e o nevoeiro persiste o dia inteiro. Qual é o tipo e por que o Sol não o dissipa?",
"alternativas": [
"Nevoeiro de advecção: ar quente e úmido resfriado pela água fria, renovado pelo vento.",
"Nevoeiro de radiação: o solo esfriou na noite clara, e o aquecimento do dia o dissipa logo.",
"Nevoeiro de vapor: o ar muito frio passa sobre água mais quente, e a água evapora.",
"Nevoeiro frontal: a chuva da frente evapora no ar mais frio junto à frente e satura o ar."
],
"correta": 0,
"explicacao": "O nevoeiro de advecção nasce quando ar quente e úmido passa sobre uma superfície mais fria e se resfria até o ponto de orvalho. Enquanto o vento continuar trazendo ar úmido, ele se renova e pode durar dias, mesmo com Sol. O de radiação se forma em terra, em noites claras e calmas, e some com o aquecimento do dia. O de vapor exige o inverso: ar muito frio sobre água mais quente. O frontal vem de chuva relativamente quente evaporando em ar mais frio junto à frente, e não de ar quente sobre água fria.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.6 (nevoeiros de resfriamento e de evaporação)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0165",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Depois de um dia quente e úmido, você pernoita num fundeadouro abrigado, com noite de céu limpo e sem vento. De madrugada, um nevoeiro denso cobre a margem e a terra ao redor da enseada. Qual é o mais provável e o que esperar depois do nascer do Sol?",
"alternativas": [
"Nevoeiro de advecção: ele deve durar o dia todo, porque o vento renova a umidade sobre a água.",
"Nevoeiro de radiação: o solo esfriou à noite, e o Sol da manhã deve dissipá-lo.",
"Nevoeiro de vapor: vem de uma massa de ar muito frio e fica mais denso quando o Sol sobe.",
"Nevoeiro frontal: ele só some quando a frente passar, seja de dia ou de noite."
],
"correta": 1,
"explicacao": "Noite clara, sem vento e ar úmido são o cenário clássico do nevoeiro de radiação: a terra perde calor, esfria o ar sobre ela até o ponto de orvalho, e o Sol o dissipa em algumas horas. Sem vento, não há ar quente trazido sobre água fria, então não é advecção. O de vapor pede ar muito frio sobre água mais quente, o que não ocorre depois de um dia quente. Sem chuva nem frente por perto, não se trata de nevoeiro frontal.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.6 (nevoeiro de radiação: forma-se em terra em noites claras e calmas, dissipa-se com o aquecimento do dia)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0166",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 1,
"enunciado": "Com vento fraco, qual destas leituras (temperatura do ar / ponto de orvalho) indica maior risco de nevoeiro?",
"alternativas": [
"Ar a 19 °C e ponto de orvalho a 18 °C: a temperatura está quase no ponto de orvalho.",
"Ar a 28 °C e ponto de orvalho a 12 °C: o ar está quente e muito seco.",
"Ar a 24 °C e ponto de orvalho a 14 °C: a diferença é de 10 °C.",
"Ar a 31 °C e ponto de orvalho a 20 °C: o ar é quente e úmido, mas ainda longe de saturar."
],
"correta": 0,
"explicacao": "O nevoeiro se forma quando a temperatura do ar chega ao ponto de orvalho: quanto menor a diferença, maior o risco. Com 19 °C e 18 °C basta um resfriamento de 1 °C. Nos outros casos faltam 16, 10 e 11 °C de resfriamento, sinal de ar bem mais distante da saturação, mesmo que o ar esteja úmido.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, itens 45.2.3 (ponto de orvalho) e 45.2.6 (nevoeiros)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0167",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 3,
"enunciado": "Segundo os critérios do CHM, em qual destas previsões é emitido aviso de mau tempo?",
"alternativas": [
"Vento de nordeste de força 6 (cerca de 25 nós), ondas de 2,5 m em águas profundas e visibilidade de 3 km.",
"Vento de sul de força 5, ondas de 1,5 m e visibilidade de 800 m em nevoeiro.",
"Vento de sudeste de força 6 (até 27 nós), ondas de 2 m e ressaca de 2 m atingindo a costa.",
"Chuva forte e trovoadas, vento de força 5 e visibilidade de 2 km."
],
"correta": 1,
"explicacao": "O CHM emite aviso quando prevê vento de força 7 ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa. Basta um critério: a visibilidade de 800 m já aciona o aviso, mesmo com vento moderado. Nos outros casos nenhum limite foi atingido: força 6 tem no máximo 27 nós, ondas de 2,5 m em mar aberto e ressaca de 2 m ficam abaixo dos limites, e 2 ou 3 km de visibilidade estão acima de 1 km. Chuva e trovoada, sozinhas, não são critério.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.5.2 (Aviso de Mau Tempo: força 7 ou mais, ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ressaca com ondas de 2,5 m ou mais); CHM, Serviços Radiometeorológicos de Apoio ao Navegante",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante"
},
{
"id": "mestre-0168",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 3,
"enunciado": "Um veleiro navega com vento de popa exata, a 6 nós. O anemômetro do tope do mastro marca 12 nós de vento aparente. Qual é a força Beaufort do vento verdadeiro?",
"alternativas": [
"Força 4 (11 a 16 nós): o vento verdadeiro é o próprio vento aparente, de 12 nós.",
"Força 5 (17 a 21 nós): o vento verdadeiro é 12 + 6 = 18 nós.",
"Força 2 (4 a 6 nós): o vento verdadeiro é 12 − 6 = 6 nós.",
"Força 6 (22 a 27 nós): o vento verdadeiro é o dobro do aparente, 24 nós."
],
"correta": 1,
"explicacao": "Com o vento de popa, o barco se afasta na mesma direção em que o vento sopra e sente menos vento: aparente = verdadeiro − velocidade do barco. Logo, verdadeiro = 12 + 6 = 18 nós, força 5 (17 a 21 nós). Usar o aparente como se fosse verdadeiro subestima o vento (força 4). Subtrair a velocidade do barco é o cálculo de quem confunde com o vento de proa e dá apenas 6 nós. Dobrar o valor não tem base física.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.4 (vento relativo/aparente e vento verdadeiro; Tabela 45.1, escala Beaufort)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0169",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Um veleiro vai de Salvador a Recife, num rumo geral de 035°, com o alísio de sudeste (135°) soprando firme. De onde o vento atinge o barco?",
"alternativas": [
"Pela proa, o que obriga o barco a bolinar, como numa viagem para o sul.",
"Pela alheta de bombordo, quase de popa, empurrando o barco ao destino.",
"Pelo través de boreste, um pouco por ré, com o vento chegando de lado.",
"Pela bochecha de boreste, a uns 45° da proa, pedindo bolina folgada."
],
"correta": 2,
"explicacao": "O vento vem de 135° e o barco aponta para 035°: a diferença é de 100° para a direita, ou seja, vento no través de boreste (um pouco por ré). Para pegá-lo pela proa o rumo teria de ser próximo de 135°; numa descida para o sul o alísio já vem bem mais de proa. O vento está do lado direito, e não do esquerdo (bombordo). A bochecha de boreste, a 45° da proa, ocorreria com rumo em torno de 090°.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.1.3 (alísios de SE no Hemisfério Sul) e item 45.4 (bom tempo: ventos de SE a NE)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0170",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 1,
"enunciado": "Numa noite de céu limpo no litoral do Nordeste, de madrugada, sopra um vento local da terra para o mar. Como se chama e por que ocorre?",
"alternativas": [
"Brisa marítima: a terra esfria e puxa o ar do mar para dentro do continente.",
"Terral: a terra esfria mais que o mar, e o ar frio escoa para a água.",
"Terral: o mar esfria mais depressa que a terra, e o ar sobe sobre a água.",
"Alísio: o vento regular de sudeste, que não depende da hora do dia."
],
"correta": 1,
"explicacao": "À noite a terra perde calor mais rápido que a água, o ar sobre ela fica mais frio e pesado e escoa para o mar: é o terral. A brisa marítima sopra do mar para a terra, de dia, quando a terra está mais quente. O mar não esfria mais depressa que a terra; é o contrário. O alísio é um vento de grande escala, que não muda com a hora do dia.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.4 (brisa marítima e terral)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0171",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Os meteorologistas chamam de ciclogênese explosiva um fenômeno que atinge a costa Sul do Brasil. O que é?",
"alternativas": [
"Passagem muito rápida de uma frente fria, com o vento rondando de NW para SW em uma hora.",
"Formação de um ciclone tropical sobre água acima de 26 °C, com ventos de furacão.",
"Encontro da ZCIT com o anticiclone do Atlântico Sul, com trovoadas em toda a costa.",
"Aprofundamento muito rápido de uma baixa: queda de cerca de 1 hPa por hora."
],
"correta": 3,
"explicacao": "A ciclogênese explosiva é o aprofundamento muito rápido de uma baixa, que Miguens chama de ciclone bomba quando a pressão no núcleo cai cerca de 1 hPa por hora por mais de 24 horas (da ordem de 24 hPa em um dia). Ela traz vento forte, mar grosso e ressaca. A rondada rápida do vento é só a passagem de uma frente. Ciclones tropicais são raros no Atlântico Sul e nascem de outro processo. A ZCIT fica ao norte e não se encontra com o anticiclone para gerar esse fenômeno.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 42, item 42.5.3 (queda de cerca de 1 hPa/h por mais de 24 h = 'ciclone bomba')",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0172",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Num dia de céu azul e vento fraco em Santos (SP), o CHM avisa ressaca, com ondas de 3 m atingindo a costa. Qual é a explicação mais provável?",
"alternativas": [
"Maré de sizígia, que sempre produz ondas de 3 m no litoral Sudeste, com ou sem vento.",
"Brisa marítima forte, que levanta ondas grandes durante a tarde.",
"Terral de madrugada, que sopra da terra e empurra o mar para a praia com força.",
"Marulho de um ciclone distante no mar, que chega à costa até dias depois."
],
"correta": 3,
"explicacao": "Ondas geradas por ventos fortes de um ciclone no mar viajam por centenas de milhas com pouca perda de energia, e chegam como marulho longo na costa, mesmo com céu limpo e vento fraco local. A maré de sizígia muda o nível, não cria ondas. A brisa marítima levanta só marolas curtas. O terral sopra da terra para o mar e não produz ressaca na costa.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 42, item 42.1.1 (vagas e marulho: o marulho se propaga por longas distâncias, atenuando-se devagar); cap. 45, item 45.5.2 (ressaca no aviso de mau tempo)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0173",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Qual condição tende a deixar o nível do mar na costa Sul e Sudeste acima do previsto na tábua de marés?",
"alternativas": [
"Pressão alta e vento forte de NW soprando da terra para o mar.",
"Pressão alta e calmaria, com céu limpo e mar liso.",
"Nenhuma: só a Lua e o Sol alteram o nível, e o tempo não interfere na maré.",
"Pressão baixa e vento forte de S/SW empurrando a água contra a costa."
],
"correta": 3,
"explicacao": "Pressão baixa alivia o peso do ar sobre o mar (regra prática: cerca de 1 cm de elevação para cada hPa abaixo do normal) e o vento de S/SW empurra a água para a costa: o nível sobe acima da tábua, sobretudo ao sul de Cabo Frio. Pressão alta e vento terral (de terra para o mar) fazem o contrário: o nível tende a ficar abaixo do previsto. A calmaria com pressão alta também deixa o nível um pouco abaixo. A tábua considera só Lua e Sol, por isso vento e pressão causam diferenças reais.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), item 10.1.11 a (fatores meteorológicos, principalmente o vento, elevam ou abaixam o nível do mar em relação às tábuas; frequente ao sul de Cabo Frio)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "mestre-0174",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "No fim da tarde, em Ilhabela (SP), surgem cirros em fios e depois um véu fino com halo em volta do Sol. À noite o barômetro cai cerca de 3 hPa em 6 horas e o vento de nordeste aumenta. O que é mais provável nas próximas 12 a 24 horas?",
"alternativas": [
"Frente fria se aproximando: o céu se fecha, o vento aumenta e depois ronda para SW.",
"Tempo firme: o véu fino de cirros indica ar estável e seco, sem mudança à vista.",
"Nevoeiro de radiação, que se dissipará ao amanhecer, sem alterar o vento nem a pressão.",
"A passagem de uma frente quente, com vento fraco de leste e o céu ficando limpo."
],
"correta": 0,
"explicacao": "Cirros que engrossam em cirrostratos, com a pressão caindo e o vento de NE aumentando, são a sequência clássica da aproximação de uma frente fria na costa Sudeste: o céu se cobre, o vento reforça e a frente passa com rajadas, rondando para SW. Cirros em fios com barômetro caindo não indicam tempo firme. Nevoeiro de radiação exige noite calma e céu limpo, e aqui o vento está aumentando. Uma frente quente não deixaria o céu limpo: traz nebulosidade espessa e chuva contínua, e o vento adiante dela é fraco.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.4 (aproximação da frente fria: pressão em queda, vento de N/NW, cirrus e cirrostratus) e item 45.3.3 a",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0175",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "O METEOROMARINHA da sua área traz: <b>“VENTO SW/S 6/8”</b>. Qual é a leitura correta?",
"alternativas": [
"Vento de sudoeste a sul de 6 a 8 nós, ou seja, brisa fraca, sem aviso.",
"Vento que ronda de SW para S entre 6 h e 8 h da manhã, com intensidade moderada.",
"Vento de sudoeste a sul, força 6 a 8, sem chegar ao critério de aviso de mau tempo.",
"Vento de SW a S, força 6 a 8: a força 8, de 34 a 40 nós, passa do aviso (28 nós)."
],
"correta": 3,
"explicacao": "No boletim a direção é de onde o vento sopra e os números são a força na escala Beaufort. Força 6 vai de 22 a 27 nós e força 8, de 34 a 40 nós, bem acima dos 28 nós (força 7) que levam o CHM a emitir aviso de mau tempo. Não são nós, que dariam brisa fraca, nem horários. A leitura que diz não haver critério de aviso ignora que a força 8 passa do limite.",
"referencia": "CHM, METEOROMARINHA (Parte III) e Serviços Radiometeorológicos de Apoio ao Navegante; Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, itens 45.5.1 e 45.5.2",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante"
},
{
"id": "mestre-0176",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 1,
"enunciado": "Você quer olhar uma imagem de satélite às 2 h da madrugada. Qual tipo de imagem não serve, porque depende da luz do Sol?",
"alternativas": [
"A imagem no infravermelho, que mostra a temperatura do topo das nuvens.",
"A imagem no canal visível, que só mostra as nuvens iluminadas pelo Sol.",
"A imagem de vapor d’água, que mostra a umidade em altitude.",
"A imagem no infravermelho com cores realçadas, que destaca topos muito frios."
],
"correta": 1,
"explicacao": "O canal visível funciona como uma fotografia e só mostra algo de dia. O infravermelho mede a temperatura emitida pelo topo das nuvens e funciona de dia e de noite, assim como o de vapor d’água. A versão colorida do infravermelho é só uma forma de realçar os topos mais frios, como os de cumulonimbos.",
"referencia": "CPTEC/INPE, imagens do satélite GOES (canais visível, infravermelho e vapor d'água)",
"fonte_url": "https://satelite.cptec.inpe.br/home/index.jsp"
},
{
"id": "mestre-0177",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 3,
"enunciado": "Uma frente fria passou pelo Rio de Janeiro ontem. Hoje o vento é de SW a 25 nós e diminui; a previsão é de NE fraco a moderado nos próximos 2 dias e nova frente em 4 dias. Você quer ir do Rio a Santos, num rumo geral WSW (cerca de 250°). Qual é a decisão mais prudente?",
"alternativas": [
"Sair já e motorar contra o SW e o mar de proa, aproveitando a passagem da frente.",
"Sair logo atrás da próxima frente, com o SW forte empurrando o barco para Santos.",
"Esperar o SW amainar e sair com o NE de popa, chegando antes da nova frente.",
"Sair só na véspera da nova frente, quando o barômetro começar a cair e o NE aumentar."
],
"correta": 2,
"explicacao": "Com rumo de 250°, o SW é quase vento de proa e levanta mar de proa. Esperar o SW amainar e sair com o NE, quase de popa, dá uma viagem de cerca de 180 milhas a 5 nós de média, uns 36 horas, que termina antes da nova frente, prevista para daqui a 4 dias. Sair já é navegar contra vento e mar. O SW forte atrás da próxima frente voltaria a bater de proa, e não empurra o barco para Santos. Sair na véspera da frente joga a chegada dentro do mau tempo.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.4 (sequência de passagem das frentes frias na costa Sudeste: depois da frente, ventos de SW/S e tempo bom)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0178",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 3,
"enunciado": "A carta sinótica das 12 HMG mostra uma frente fria 180 milhas a sudoeste da sua posição, avançando para você a 15 nós. Considere o horário de Brasília (UTC −3). Em que horário local a frente chega?",
"alternativas": [
"Por volta das 21 h: 180 ÷ 15 = 12 h, a partir das 12 HMG, que correspondem a 9 h locais.",
"Por volta de 0 h: 12 horas depois de 12 HMG, sem converter para a hora local.",
"Por volta das 3 h: 12 horas depois de 12 HMG, convertendo para a hora local no sentido errado.",
"Por volta das 12 h: a hora da carta, tomada como se fosse a hora local."
],
"correta": 0,
"explicacao": "A frente leva 180 ÷ 15 = 12 horas. A carta é das 12 HMG (UTC), que são 9 h em Brasília (UTC −3, sem horário de verão). Somando 12 horas, a frente chega às 21 h locais, ou 00 HMG. Dizer 0 h é esquecer de converter a hora Z para a local. Somar 3 em vez de subtrair dá 3 h. Usar 12 h trata a hora da carta como se fosse local e ignora o tempo de deslocamento.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.5.4 (carta sinótica emitida às 00 e 12 HMG); CHM, cartas sinóticas",
"fonte_url": "https://www.marinha.mil.br/chm/cartassinoticas"
},
{
"id": "mestre-0179",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 1,
"enunciado": "Qual instrumento meteorológico de bordo registra a pressão atmosférica numa curva contínua, mostrando a tendência ao longo de várias horas?",
"alternativas": [
"O anemógrafo, que registra a direção e a velocidade do vento.",
"O barógrafo, que traça a curva da pressão ao longo das horas.",
"O higrógrafo, que registra a umidade relativa do ar.",
"O psicrômetro, que mede a umidade e o ponto de orvalho."
],
"correta": 1,
"explicacao": "O barógrafo (ou registro eletrônico) desenha a curva da pressão, e deixa clara a tendência barométrica, essencial para a previsão do tempo. O anemógrafo registra o vento; o higrógrafo e o psicrômetro tratam da umidade, não da pressão.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, item 45.2.1 (barômetro aneroide, barógrafo e barograma)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0180",
"nivel": "mestre",
"tema": "Meteorologia costeira",
"dificuldade": 2,
"enunciado": "Um ciclone extratropical maduro tem, na carta sinótica, uma frente oclusa. Como ela se forma?",
"alternativas": [
"A frente quente alcança a frente fria e passa por baixo dela, levantando o ar frio.",
"A frente fria, que avança mais depressa, alcança a quente e levanta o ar quente.",
"As duas frentes ficam paradas, sem que massa de ar alguma avance sobre a outra.",
"Duas massas de ar frio se encontram e se misturam, sem ar quente envolvido."
],
"correta": 1,
"explicacao": "A frente fria anda mais depressa que a quente e acaba por alcançá-la; o ar quente é erguido da superfície e se forma a frente oclusa, que marca a maturidade do ciclone. O ar quente é mais leve e não passa por baixo do frio. Duas frentes paradas formam uma frente estacionária. Duas massas frias que se misturam não formam oclusão, que exige o ar quente sendo erguido.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 45, itens 45.3.2 e 45.3.3 c (frente oclusa: a frente fria alcança a frente quente e eleva o ar quente)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0181",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 1,
"enunciado": "Segundo a NORMAM-211, qual é a potência mínima do transceptor VHF fixo exigido a bordo?",
"alternativas": [
"5 W.",
"10 W.",
"25 W.",
"50 W."
],
"correta": 2,
"explicacao": "A norma exige transceptor fixo com potência mínima de 25 W. Os 5 W e os 10 W ficam abaixo desse mínimo. Com 50 W o equipamento supera o mínimo, mas não é o mínimo exigido.",
"referencia": "NORMAM-211/DPC, art. 4.23.2",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0182",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 3,
"enunciado": "A NORMAM-211 exige que o VHF portátil tenha bateria para no mínimo quatro horas de operação, com coeficiente de utilização de 1:9 (um minuto transmitindo para nove escutando). Nesse ciclo, quanto tempo o rádio fica transmitindo ao longo das quatro horas?",
"alternativas": [
"Cerca de 27 minutos.",
"24 minutos.",
"216 minutos.",
"4 minutos."
],
"correta": 1,
"explicacao": "Cada ciclo dura 1 + 9 = 10 minutos, com 1 minuto de transmissão. Em 4 h = 240 min há 24 ciclos, ou seja, 24 minutos transmitindo (um décimo do tempo). Dividir 240 por 9 (cerca de 27 min) ignora que o minuto transmitido também faz parte do ciclo. 216 minutos é o tempo de escuta (nove décimos). 4 minutos seria apenas 1 minuto por hora.",
"referencia": "NORMAM-211/DPC, art. 4.23.3",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0183",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 3,
"enunciado": "Um veleiro com VHF fixo tem antena de emergência, como a NORMAM-211 exige quando a antena fica no tope do mastro. Com o mastro quebrado, a antena de emergência está a 4 m da água e um navio tem antena a 9 m. Use D ≈ 2,2 × (√h<sub>1</sub> + √h<sub>2</sub>), em milhas, com h em metros. Qual é o alcance estimado?",
"alternativas": [
"Cerca de 29 milhas.",
"Cerca de 8 milhas.",
"Cerca de 4 milhas.",
"Cerca de 11 milhas."
],
"correta": 3,
"explicacao": "D ≈ 2,2 × (√4 + √9) = 2,2 × (2 + 3) = 11 milhas. Somar as alturas sem tirar a raiz (2,2 × 13) dá 29 milhas, e usar a raiz da soma (2,2 × √13) dá 8 milhas; ambos errados. Contar só a antena do veleiro (2,2 × 2) daria 4 milhas e ignora a antena do navio. O resultado mostra por que a antena do mastro é importante: no tope, a 12 m, o alcance até o mesmo navio seria de cerca de 14 milhas.",
"referencia": "NORMAM-211/DPC, art. 4.24.2 (parágrafo final: antena de VHF de emergência para embarcação a vela com antena no tope do mastro). A fórmula de alcance é didática (horizonte rádio com refração normal) e não consta da norma; ver Miguens, vol. III, cap. 34 (horizonte rádio cerca de 15% além do visual)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0184",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 1,
"enunciado": "Qual é a frequência do canal 16 do VHF marítimo, o canal de chamada e de socorro?",
"alternativas": [
"156,525 MHz.",
"121,5 MHz.",
"406 MHz.",
"156,8 MHz."
],
"correta": 3,
"explicacao": "O canal 16 é 156,8 MHz. Os 156,525 MHz são do canal 70, o canal DSC, que não é o 16; a norma aceita escuta no 70 apenas para equipamento com DSC. A faixa de 121,5 MHz é a de socorro da aviação (e das EPIRB antigas), e 406 MHz é a faixa das EPIRB atuais. Nenhuma delas é de VHF marítimo.",
"referencia": "NORMAM-211/DPC, art. 4.23.4 a)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0185",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 2,
"enunciado": "Seu veleiro perdeu o motor numa calmaria, a 6 milhas da costa, com mar liso e boa previsão. Ele deriva devagar para fora do canal de navegação, sem feridos, e você quer pedir reboque. Que prioridade usar no canal 16?",
"alternativas": [
"PAN-PAN (urgência): problema sério, sem perigo imediato para a vida ou o barco.",
"MAYDAY (socorro): toda avaria de motor deve ser tratada como perigo grave e iminente.",
"SÉCURITÉ (segurança): serve para pedir qualquer tipo de ajuda, inclusive reboque.",
"Alerta DSC de socorro, pelo botão vermelho, que é o procedimento para qualquer avaria."
],
"correta": 0,
"explicacao": "Um barco sem propulsão, sem risco imediato, pede ajuda com PAN-PAN: urgência. MAYDAY e o botão vermelho do DSC ficam reservados ao perigo grave e iminente para o barco ou para as pessoas, como incêndio, alagamento ou naufrágio; usá-los sem necessidade é abuso. SÉCURITÉ serve para avisos de segurança à navegação ou de tempo, e não para pedir auxílio.",
"referencia": "Lista de Auxílios-Rádio (DH8-15), 15ª ed., cap. 7 (comunicações de socorro, urgência e segurança)",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-08/LAR-15ED-2026-2030-Completa.pdf"
},
{
"id": "mestre-0186",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 2,
"enunciado": "Durante um socorro no canal 16, a estação que coordena o salvamento transmite <b>“SEELONCE MAYDAY”</b>. O que isso pede aos demais barcos que escutam?",
"alternativas": [
"Que fiquem em silêncio no canal, exceto o tráfego do próprio socorro.",
"Que o socorro terminou e o canal está liberado para o tráfego normal de rotina.",
"Que todos repitam o MAYDAY, como retransmissão, para ampliar o alcance do pedido.",
"Que mudem para o canal 70 para continuar a conversa sem atrapalhar o socorro."
],
"correta": 0,
"explicacao": "SEELONCE MAYDAY impõe silêncio no canal, para que o tráfego do socorro seja ouvido. Quem encerra a restrição é o SEELONCE FEENEE. A retransmissão de um socorro sem resposta se chama MAYDAY RELAY, outro procedimento. O canal 70 é exclusivo para dados de DSC, e não se conversa nele.",
"referencia": "Lista de Auxílios-Rádio (DH8-15), 15ª ed., cap. 7 (procedimentos de socorro); Regulamento de Radiocomunicações da UIT",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-08/LAR-15ED-2026-2030-Completa.pdf"
},
{
"id": "mestre-0187",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 2,
"enunciado": "Um veleiro brasileiro tem a EPIRB codificada com o MMSI. Segundo a NORMAM-211, como é o código de identificação dessa EPIRB?",
"alternativas": [
"O código 55 (telefônico do Brasil), seguido de nove dígitos da estação.",
"O dígito 710 seguido das quatro primeiras letras do nome da embarcação.",
"Um código hexadecimal de 15 caracteres, sem relação com o MMSI.",
"O dígito 710 (Brasil), mais seis dígitos da estação (nove no total)."
],
"correta": 3,
"explicacao": "A norma define o código como 710 (identificação do Brasil) mais seis dígitos da estação, e esse código é o MMSI, com nove dígitos. O 55 é o prefixo telefônico internacional, não a identificação marítima. O MMSI é numérico e não usa letras do nome do barco. O código hexadecimal de 15 caracteres não é o código que a norma define para essa EPIRB.",
"referencia": "NORMAM-211/DPC, art. 4.23.6 d)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0188",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 2,
"enunciado": "Uma EPIRB de 406 MHz, ainda não cadastrada no INFOSAR, é acionada no mar. O que acontece com o alerta?",
"alternativas": [
"O alerta é descartado até que o dono registre a baliza no INFOSAR, para evitar alarmes falsos.",
"O alerta só é processado se a baliza também transmitir em 121,5 MHz, a frequência antiga.",
"O alerta é enviado à Anatel, que antes verifica a licença da estação de rádio do barco.",
"O BRMCC o recebe e o trata como emergência, mesmo sem cadastro, que segue obrigatório."
],
"correta": 3,
"explicacao": "O sinal de uma baliza 406 MHz chega ao Centro Brasileiro de Controle de Missão (BRMCC) mesmo sem registro e é tratado como emergência, mas a NORMAM-211 exige que toda EPIRB seja cadastrada no INFOSAR (DECEA) e mantenha os dados atualizados. O alerta não é descartado por falta de cadastro. A frequência de 121,5 MHz não é processada pelo sistema desde 2009. A Anatel cuida de licenças de estações de rádio, e não do alerta da EPIRB.",
"referencia": "NORMAM-211/DPC, art. 4.23.6 e); DECEA, Central de Ajuda (baliza 406 MHz não registrada no INFOSAR)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0189",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 1,
"enunciado": "Em qual faixa de frequência a EPIRB deve transmitir o sinal de socorro via satélite, segundo a NORMAM-211?",
"alternativas": [
"121,5 MHz, a antiga frequência de socorro da aviação.",
"156,8 MHz, o canal 16 do VHF marítimo.",
"406 MHz, a faixa processada pelo COSPAS-SARSAT.",
"243 MHz, de uso militar e das balizas antigas."
],
"correta": 2,
"explicacao": "A norma exige que a EPIRB transmita em 406 MHz, via satélite em órbita polar. O sistema COSPAS-SARSAT deixou de processar 121,5 MHz em fevereiro de 2009, e 243 MHz era das balizas antigas. O canal 16 (156,8 MHz) é VHF de voz e não passa por satélite.",
"referencia": "NORMAM-211/DPC, art. 4.23.6 c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "mestre-0190",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 2,
"enunciado": "O SALVAMAR pode ser alertado por telefone (185), pelo GMDSS, por alertas de navios SOLAS e pela RENEC. O que é a RENEC?",
"alternativas": [
"Uma rede de radiofaróis da Marinha que corrige o sinal de GPS para os barcos.",
"O serviço da Anatel que licencia as estações de rádio das embarcações de recreio.",
"O sistema de satélites que recebe os sinais das EPIRB e os repassa aos centros de busca.",
"A Rede Nacional de Estações Costeiras, que opera em VHF e HF e pode alertar o SALVAMAR."
],
"correta": 3,
"explicacao": "RENEC é a Rede Nacional de Estações Costeiras, que opera em VHF e HF e é um dos meios de alertar o SALVAMAR. Os radiofaróis de correção do GPS são outra coisa. A licença das estações de rádio dos barcos é assunto da Anatel, e não da RENEC. Quem recebe os sinais das EPIRB é o sistema COSPAS-SARSAT, com os satélites e o BRMCC.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 2.1 m); SALVAMAR Brasil, FAQ, pergunta 6 (formas de alertar o SALVAMAR)",
"fonte_url": "https://www.marinha.mil.br/salvamarbrasil/node/49"
},
{
"id": "mestre-0191",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 3,
"enunciado": "Seu veleiro tem antena de VHF a 9 m de altura e está a 30 milhas de uma estação costeira, com antena a 64 m. Use D ≈ 2,2 × (√h<sub>1</sub> + √h<sub>2</sub>), em milhas. É de se esperar contato direto por VHF?",
"alternativas": [
"Não: o alcance estimado é de cerca de 24 milhas, e o barco está além dele.",
"Sim: o alcance estimado é de cerca de 160 milhas, pois 2,2 × (9 + 64).",
"Sim: o alcance estimado é de cerca de 53 milhas, pois 2,2 × 3 × 8.",
"Sim: a antena da estação, a 64 m, sozinha já alcança as 30 milhas com folga."
],
"correta": 0,
"explicacao": "D ≈ 2,2 × (√9 + √64) = 2,2 × (3 + 8) ≈ 24 milhas. A 30 milhas, o barco está além da linha de visada, e o contato deve ser tentado por outro meio, como retransmissão por outra embarcação, HF ou satélite. Somar as alturas sem tirar a raiz (160 milhas) ou multiplicar as raízes (53 milhas) são erros de conta. Achar que a antena da estação basta ignora a antena do barco: 2,2 × √64 dá só cerca de 18 milhas.",
"referencia": "Propagação do VHF por linha de visada: fórmula didática de horizonte radioelétrico (refração normal, raio da Terra 4/3), usada no curso mestre-3; base física em Miguens, vol. III, cap. 34 (horizonte rádio cerca de 15% além do visual). A fórmula não consta da NORMAM-211",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "mestre-0192",
"nivel": "mestre",
"tema": "Comunicações e RENEC",
"dificuldade": 1,
"enunciado": "Num trecho da costa com sinal de celular, você precisa acionar a Marinha para um pedido de socorro vindo do mar. Que número de telefone chama o SALVAMAR, 24 horas por dia?",
"alternativas": [
"185.",
"190.",
"192.",
"193."
],
"correta": 0,
"explicacao": "O telefone 185 aciona o SALVAMAR, o Serviço de Busca e Salvamento da Marinha, que atende 24 horas pedidos de socorro vindos do mar. O 190 é da Polícia Militar, o 192 do SAMU e o 193 do Corpo de Bombeiros.",
"referencia": "SALVAMAR Brasil (Marinha do Brasil); Lei nº 7.273/1984",
"fonte_url": "https://www.marinha.mil.br/salvamarbrasil/node/49"
},
{
"id": "mestre-0193",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Seu veleiro de 14 m está fundeado em nevoeiro denso, fora de canal. Qual é o sinal sonoro de uma embarcação fundeada em visibilidade restrita, segundo a Regra 35(g)?",
"alternativas": [
"Um apito longo, a intervalos não superiores a 2 minutos, como a embarcação com seguimento.",
"Toque rápido de sino por cerca de 5 segundos, a intervalos não superiores a 1 minuto.",
"Um apito longo seguido de dois curtos, a intervalos não superiores a 2 minutos.",
"Cinco apitos curtos e rápidos, repetidos a cada minuto, como sinal de dúvida."
],
"correta": 1,
"explicacao": "A embarcação fundeada toca o sino rapidamente por cerca de 5 segundos, a cada minuto no máximo (Regra 35(g)). Um apito longo é o sinal da embarcação de propulsão mecânica com seguimento. Um longo e dois curtos é o da embarcação a vela com seguimento, entre outras. Cinco apitos curtos e rápidos são o sinal de dúvida da Regra 34(d), e não de embarcação fundeada. Atenção ao comprimento: com 12 m ou mais e menos de 20 m, como neste veleiro de 14 m, o sino é dispensado, mas é preciso dar outro sinal sonoro eficiente a intervalos não superiores a 2 minutos (Regra 35(i)).",
"referencia": "RIPEAM-72, Regra 35(g) e (i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0194",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 2,
"enunciado": "Navegando a vela, com seguimento, em nevoeiro e sem contato de radar, você ouve um sinal de cerração que parece vir por ante-a-vante do seu través. Segundo a Regra 19(e), o que fazer?",
"alternativas": [
"Manter rumo e velocidade, pois a Regra 19 só vale com contato visual.",
"Guinar para bombordo para se afastar do som, mantendo a velocidade que já estava usando.",
"Reduzir a velocidade ao mínimo que permita manter o rumo e navegar com extrema cautela.",
"Aumentar a velocidade para sair logo da zona de nevoeiro."
],
"correta": 2,
"explicacao": "Ao ouvir um sinal de cerração aparentemente por ante-a-vante do través, a embarcação deve reduzir a velocidade ao mínimo que lhe permita manter o rumo e, se necessário, retirar todo o seguimento, navegando com extrema cautela até passar o perigo de abalroamento (Regra 19(e)). A Regra 19 vale justamente sem contato visual, em visibilidade restrita. Guinar às cegas para bombordo não resolve: a Regra 19(d)(i) desaconselha guinar para bombordo em direção a embarcação por ante-a-vante do través, ali por radar, e a mesma prudência vale aqui. Manter a velocidade ou aumentá-la contraria a Regra 19(b) e a Regra 6 (velocidade segura).",
"referencia": "RIPEAM-72, Regra 19(e)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0195",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "À noite, com chuva forte, você nota que a marcação de um navio que se aproxima não varia de modo apreciável, enquanto a distância diminui. Segundo a Regra 7, o que se deve concluir?",
"alternativas": [
"Que não há risco, porque o navio se mantém na mesma direção em relação ao barco.",
"Que o risco só existe se a distância cair para menos de 1 milha entre os dois barcos.",
"Presume-se que existe risco de abalroamento, mesmo que o navio ainda esteja longe.",
"Que nada se pode concluir sem antes confirmar o contato e a marcação pelo radar."
],
"correta": 2,
"explicacao": "Marcação constante com distância diminuindo é o sinal clássico de rumos de colisão: a Regra 7(d)(i) manda presumir o risco de abalroamento, e a 7(a) manda presumi-lo em caso de dúvida. Marcação constante significa o contrário de ausência de risco. Não existe distância mínima a partir da qual o risco passa a existir. O radar ajuda, mas não é preciso esperar por ele para presumir o risco.",
"referencia": "RIPEAM-72, Regra 7(a) e 7(d)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0196",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "Dois veleiros, sem motor, navegam em rumos que se cruzam e há risco de abalroamento. O vento é de sudoeste (225°). O veleiro A segue com rumo 000°, e o veleiro B, com rumo 090°. Quem deve se manter fora do caminho?",
"alternativas": [
"O veleiro A, porque recebe o vento por bombordo e B o recebe por boreste.",
"O veleiro B, porque vê A por boreste, como na regra dos motores.",
"O veleiro B, porque está mais a barlavento que A.",
"Nenhum dos dois: ambos mantêm rumo e velocidade, porque o vento é o mesmo."
],
"correta": 0,
"explicacao": "O vento vem de 225°. Com proa em 000°, ele chega ao barco A pela alheta de bombordo (lado esquerdo); com proa em 090°, chega ao barco B pela alheta de boreste (lado direito). Entre veleiros com vento de bordos diferentes, o que recebe o vento por bombordo deve manter-se fora do caminho do outro (Regra 12(a)(i)). A regra do cruzamento por boreste vale para embarcações de propulsão mecânica (Regra 15), e não para veleiros entre si. A comparação a barlavento só se aplica quando os dois recebem o vento pelo mesmo bordo. Havendo risco, alguém precisa manobrar, e o vento ser o mesmo não muda isso.",
"referencia": "RIPEAM-72, Regra 12(a)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0197",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 3,
"enunciado": "Navegando a vela com bom vento, seu veleiro vem por trás de uma lancha a motor lenta e há risco de abalroamento. Visto da lancha, o seu veleiro está a cerca de 160° da proa dela, bem por ante-a-ré do través. Quem deve se manter fora do caminho?",
"alternativas": [
"A lancha, porque a Regra 18 manda o motor dar caminho à vela.",
"A que estiver com o vento por bombordo, conforme a Regra 12, que trata do vento.",
"O veleiro, porque é o alcançador: a Regra 13 vale também para ele.",
"Nenhuma: ambas mantêm rumo e velocidade enquanto o veleiro estiver atrás da lancha."
],
"correta": 2,
"explicacao": "Uma embarcação que se aproxima de outra vindo de mais de 22,5° por ante-a-ré do través está alcançando (Regra 13(b)), e a alcançadora deve se manter fora do caminho, quaisquer que sejam as demais regras (Regra 13(a)). Assim, a Regra 13 prevalece sobre a Regra 18, e o veleiro alcançador deve ceder à lancha. A Regra 12 trata de dois veleiros, e a lancha não é um. Dizer que ninguém manobra ignora que há risco de abalroamento.",
"referencia": "RIPEAM-72, Regra 13(a) e (b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "mestre-0198",
"nivel": "mestre",
"tema": "RIPEAM",
"dificuldade": 1,
"enunciado": "Você é a embarcação que deve manobrar para evitar um abalroamento. Segundo a Regra 8(b), como deve ser a alteração de rumo ou velocidade?",
"alternativas": [
"Em pequenas alterações sucessivas de 5°, para não se afastar muito do rumo original.",
"A menor possível, para que o outro barco não seja surpreendido pela manobra de longe.",
"Ampla, para ser logo percebida, evitando pequenas alterações sucessivas.",
"Só no último momento, quando o outro barco já estiver muito próximo e for inevitável."
],
"correta": 2,
"explicacao": "A Regra 8(b) manda que a alteração de rumo e/ou velocidade seja ampla o bastante para ser prontamente percebida por outra embarcação que observe, visualmente ou por radar, evitando pequenas alterações sucessivas. Mudar aos poucos deixa o outro sem entender a manobra. Manobrar tarde contraria a Regra 8(a), que pede manobra em tempo útil, e a Regra 16, que pede manobra antecipada e substancial.",
"referencia": "RIPEAM-72, Regra 8(b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
}
]);
