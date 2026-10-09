/* Banco de questões — capitao. Gerado por tools/build_questoes.py em 2026-10-09 a partir de
   research/_work/questoes/ (cada lote passou por duas revisões de instrutor). Conteúdo CC BY-SA 4.0. */
VL.dado('questoes/capitao', [
{
"id": "capitao-0001",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "Dois veleiros estão no mesmo paralelo: um no meridiano de 021° 15′ W e o outro no de 058° 45′ W. A diferença entre as horas médias locais desses dois meridianos é:",
"alternativas": [
"2h 28m.",
"2h 30m.",
"2h 58m.",
"3h 45m.",
"9h 22m."
],
"correta": 1,
"explicacao": "A diferença de longitude é 058° 45′ − 021° 15′ = 037° 30′. Como 1° vale 4 min e 1′ vale 4 s: 37 × 4 = 148 min (2h 28m) e 30′ × 4 = 120 s (2 min), total <b>2h 30m</b> (ou 37,5° ÷ 15 = 2,5 h). Quem esquece os 30′ de arco para em 2h 28m. Quem toma 30′ como 30 min de tempo chega a 2h 58m. Dividir por 10, em vez de 15, dá 3h 45m. Multiplicar por 15, em vez de dividir, dá 9h 22m.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, itens 19.4.1 e 19.4.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0002",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "Assinale a afirmativa <b>INCORRETA</b> sobre a equação do tempo (ET).",
"alternativas": [
"A ET é a diferença entre a hora verdadeira e a hora média, no mesmo instante e no mesmo lugar.",
"Quando a ET é positiva, o Sol verdadeiro está adiantado e cruza o meridiano antes das 12h médias.",
"O Almanaque tabela a ET para 00h e 12h de HMG, e o valor vale para qualquer longitude no mesmo instante.",
"Ao longo do ano a ET tem seu máximo, de cerca de +16 min, em novembro e seu mínimo, de cerca de −14 min, em fevereiro.",
"A ET é nula nos equinócios, porque nessas datas o Sol está sobre o equador e coincide com o Sol médio."
],
"correta": 4,
"explicacao": "A afirmativa incorreta é a que dá a ET como nula nos equinócios. A ET depende da órbita elíptica da Terra e da inclinação da eclíptica, não da declinação do Sol: nos equinócios ela vale cerca de −7 min (março) e +7 min (setembro), e só se anula por volta de 15 de abril, 13 de junho, 1º de setembro e 25 de dezembro. As demais estão certas: ET = hora verdadeira − hora média; ET positiva significa Sol adiantado, que culmina antes das 12h médias; o valor tabelado para a HMG vale para qualquer longitude no mesmo instante; e os extremos anuais ocorrem em novembro (máximo) e fevereiro (mínimo).",
"referencia": "Miguens, vol. II, cap. 19, item 19.8 (definição e tabulação da ET no Almanaque); valores extremos e nulos da curva anual: efemérides do Sol no Almanaque Náutico",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0003",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "No dia 7, um navio está na longitude 072° 30′ W e a hora média local é 21h 45m. A HMG e a data correspondentes são:",
"alternativas": [
"16h 55m do dia 7.",
"21h 45m do dia 7.",
"02h 35m do dia 7.",
"03h 03m do dia 8.",
"02h 35m do dia 8."
],
"correta": 4,
"explicacao": "λ = 72° 30′ = 72 × 4 min + 30′ × 4 s = 288 min + 2 min = 4h 50m. Na longitude Oeste, HMG = HML + λ = 21h 45m + 4h 50m = 26h 35m. Como passa de 24 h, subtrai-se 24 h e avança-se um dia: <b>02h 35m do dia 8</b>. Subtrair a longitude (16h 55m) é aplicar a regra da longitude Leste. Tomar HMG = HML (21h 45m) é esquecer a longitude. Chegar a 02h 35m e não mudar a data (dia 7) é esquecer a virada do dia. Tratar os 30′ de arco como 30 min de tempo (λ = 5h 18m) leva a 03h 03m.",
"referencia": "Miguens, vol. II, cap. 19, item 19.4.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0004",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Qual é o fuso horário (teórico) da longitude 052° 40′ W?",
"alternativas": [
"−4 (D).",
"−3 (C).",
"+3 (P).",
"+4 (Q).",
"+5 (R)."
],
"correta": 3,
"explicacao": "52° 40′ ÷ 15° dá quociente 3 e resto 7° 40′. Como o resto é maior que 7° 30′ (meia largura do fuso), soma-se 1 ao quociente: fuso 4. Na convenção da DHN, Oeste é positivo, logo <b>+4 (Q)</b>. O fuso +3 (P) é o de quem ignora o resto. O +5 (R) é o de quem soma 1 ao fuso depois de já tê-lo corrigido, contando o resto duas vezes. Os fusos −4 (D) e −3 (C) têm o sinal trocado em relação a +4 e +3: fusos negativos são os de longitude Leste, e a posição está a Oeste.",
"referencia": "Miguens, vol. II, cap. 19, item 19.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0005",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Um veleiro navega na longitude 023° 10′ W e adota a hora legal do fuso teórico da posição. Quando a HMG é 01h 25m do dia 12, a hora legal a bordo e a data são:",
"alternativas": [
"00h 25m do dia 12.",
"23h 25m do dia 11.",
"03h 25m do dia 12.",
"22h 25m do dia 11.",
"23h 25m do dia 12."
],
"correta": 1,
"explicacao": "23° 10′ ÷ 15° dá quociente 1 e resto 8° 10′, maior que 7° 30′: o fuso é 1 + 1 = +2 (O). Hleg = HMG − fuso = 01h 25m − 2h = −0h 35m; somam-se 24 h e recua-se um dia: <b>23h 25m do dia 11</b>. Usar o fuso +1 (quociente sem o resto) dá 00h 25m do dia 12. Somar o fuso, em vez de subtraí-lo, dá 03h 25m. Usar o fuso +3 dá 22h 25m do dia 11. E acertar a hora mas deixar a data no dia 12 é esquecer que o resultado negativo obriga a recuar um dia.",
"referencia": "Miguens, vol. II, cap. 19, itens 19.3.3 e 19.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0006",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "No Índico, um iate na longitude 070° 20′ E adota a hora legal do fuso teórico da posição. O relógio de bordo marca 02h 30m do dia 20. A HMG correspondente é:",
"alternativas": [
"21h 30m do dia 19.",
"21h 30m do dia 20.",
"22h 30m do dia 19.",
"02h 30m do dia 20.",
"07h 30m do dia 20."
],
"correta": 0,
"explicacao": "70° 20′ ÷ 15° dá quociente 4 e resto 10° 20′, maior que 7° 30′: o fuso é 5. Leste é negativo, logo fuso −5 (E). HMG = Hleg + fuso = 02h 30m + (−5h) = −2h 30m; somam-se 24 h e recua-se um dia: <b>21h 30m do dia 19</b>. Acertar a hora e deixar o dia 20 é esquecer o recuo da data. Usar o fuso −4 (só o quociente) dá 22h 30m do dia 19. Ignorar o fuso dá 02h 30m do dia 20. Somar 5 h, tratando o fuso Leste como se fosse Oeste, dá 07h 30m do dia 20.",
"referencia": "Miguens, vol. II, cap. 19, itens 19.3.3 e 19.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0007",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Um navio está em 034° 30′ W, num instante em que a hora média local é 08h 12m. A hora legal do fuso teórico da posição, nesse instante, é:",
"alternativas": [
"03h 54m.",
"07h 30m.",
"08h 30m.",
"10h 30m.",
"12h 30m."
],
"correta": 2,
"explicacao": "λ = 34° 30′ = 2h 18m. HMG = HML + λ (Oeste) = 08h 12m + 2h 18m = 10h 30m. O fuso: 34° 30′ ÷ 15° dá quociente 2 e resto 4° 30′, menor que 7° 30′, logo +2 (O). Hleg = HMG − fuso = 10h 30m − 2h = <b>08h 30m</b>. Subtrair a longitude (HMG = 05h 54m) e depois o fuso dá 03h 54m. Usar o fuso +3 dá 07h 30m. Esquecer de tirar o fuso deixa a HMG, 10h 30m. Somar o fuso à HMG, em vez de subtraí-lo, dá 12h 30m.",
"referencia": "Miguens, vol. II, cap. 19, itens 19.4.2 e 19.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0008",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Um navio A está em 037° 15′ W e um navio B está em 012° 45′ E. Quando a hora média local de A é 15h 40m, a hora média local de B é:",
"alternativas": [
"12h 20m.",
"14h 02m.",
"17h 18m.",
"19h 00m.",
"19h 13m."
],
"correta": 3,
"explicacao": "A diferença de longitude é 37° 15′ + 12° 45′ = 50° 00′ (os meridianos ficam em lados opostos de Greenwich), ou 50° ÷ 15° = 3h 20m. B está a Leste e, a Leste, a hora é mais adiantada: 15h 40m + 3h 20m = <b>19h 00m</b>. Subtrair os 3h 20m (12h 20m) é pôr B a Oeste. Subtrair as longitudes, como se estivessem do mesmo lado (24° 30′ = 1h 38m), dá 14h 02m ou 17h 18m. Ler 3,33 h como 3h 33m leva a 19h 13m.",
"referencia": "Miguens, vol. II, cap. 19, itens 19.4.1 e 19.4.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0009",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Analise as afirmativas sobre a linha internacional de mudança de data e assinale a sequência correta de V (verdadeira) ou F (falsa).<br>I. A linha acompanha sempre, sem nenhum desvio, o meridiano de 180°.<br>II. Ao cruzá-la rumo a Oeste, o calendário avança um dia e a hora marcada no relógio de bordo não muda.<br>III. Ao cruzá-la rumo a Leste, o calendário recua um dia e a hora marcada no relógio de bordo não muda.<br>IV. Ao cruzá-la rumo a Oeste, a HMG aumenta de 24 horas.",
"alternativas": [
"F – V – V – F.",
"V – V – F – F.",
"F – F – V – V.",
"V – F – V – F.",
"F – V – F – V."
],
"correta": 0,
"explicacao": "I é falsa: a linha segue o meridiano de 180° em boa parte do traçado, mas se desvia dele em vários pontos, para que arquipélagos e países fiquem na mesma data. II é verdadeira: indo para Oeste passa-se do fuso +12 (Y) para o −12 (M), que está 24 h adiantado, e o dia do calendário avança. III é verdadeira: indo para Leste, ocorre o inverso e repete-se a data. IV é falsa: a HMG é a mesma em toda a Terra e não muda ao cruzar a linha; o que muda é a data local. As outras sequências erram ao julgar I (traçado) ou ao trocar o sentido do ajuste de data (II e III) ou a HMG (IV).",
"referencia": "Miguens, vol. II, cap. 19, item 19.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0010",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 3,
"enunciado": "Um veleiro parte, às 09h 30m do dia 3 de março, de um porto cuja hora legal é a do fuso +4 (Q). Navega 2 262 milhas a 6,5 nós, em velocidade constante, até um porto cuja hora legal é a do fuso +1 (N). A hora legal e a data da chegada são:",
"alternativas": [
"18h 30m do dia 17.",
"21h 30m do dia 17.",
"00h 30m do dia 18.",
"01h 30m do dia 18.",
"02h 30m do dia 18."
],
"correta": 2,
"explicacao": "Duração: 2 262 ÷ 6,5 = 348 h = 14 dias e 12 h. Partida: HMG = Hleg + fuso = 09h 30m + 4h = 13h 30m do dia 3. Chegada: HMG = 13h 30m + 14 d 12 h = 01h 30m do dia 18. Hleg = HMG − fuso = 01h 30m − 1h = <b>00h 30m do dia 18</b>. Somar 14 d 12 h ao relógio de partida e não converter o fuso dá 21h 30m do dia 17. Parar na HMG (01h 30m do dia 18) é esquecer o fuso de chegada. Somar o fuso +1 dá 02h 30m. Corrigir a diferença de fusos (3 h) no sentido errado dá 18h 30m do dia 17.",
"referencia": "Miguens, vol. II, cap. 19, itens 19.5 e 19.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0011",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "O fuso horário Z (zero), cujo meridiano central é o de Greenwich, abrange as longitudes:",
"alternativas": [
"de 000° a 015° E.",
"de 000° a 015° W.",
"de 015° W a 015° E.",
"de 003° 45′ W a 003° 45′ E.",
"de 007° 30′ W a 007° 30′ E."
],
"correta": 4,
"explicacao": "Cada fuso tem 15° de largura e vai 7° 30′ para cada lado do seu meridiano central. O fuso Z vai, portanto, de <b>007° 30′ W a 007° 30′ E</b>. Os intervalos de 000° a 015° (E ou W) tomam o meridiano de Greenwich como borda do fuso, e não como centro. O intervalo de 015° W a 015° E tem 30° e corresponderia a dois fusos. O de 003° 45′ para cada lado teria só 7° 30′ de largura, a metade de um fuso.",
"referencia": "Miguens, vol. II, cap. 19, item 19.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0012",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "Relacione os tipos de hora (coluna I) às definições (coluna II) e assinale a sequência correta, de cima para baixo.<br><b>Coluna I</b><br>1. Hora verdadeira local<br>2. Hora média local<br>3. Hora média de Greenwich<br>4. Hora legal<br><b>Coluna II</b><br>( ) Hora marcada pelo Sol médio no meridiano de Greenwich.<br>( ) Hora marcada pelo Sol verdadeiro no meridiano do observador.<br>( ) Hora média do meridiano central do fuso.<br>( ) Hora marcada pelo Sol médio no meridiano do observador.",
"alternativas": [
"3 – 1 – 4 – 2.",
"3 – 2 – 4 – 1.",
"1 – 3 – 4 – 2.",
"3 – 1 – 2 – 4.",
"4 – 1 – 3 – 2."
],
"correta": 0,
"explicacao": "A hora média de Greenwich (3) é a do Sol médio em Greenwich. A hora verdadeira local (1) é a do Sol que se vê, no meridiano do observador. A hora legal (4) é a hora média do meridiano central do fuso. A hora média local (2) é a do Sol médio no meridiano do observador: <b>3 – 1 – 4 – 2</b>. As demais sequências trocam pares: 1 por 2 (verdadeiro por médio), 1 por 3 (observador por Greenwich), 2 por 4 (meridiano do observador por meridiano do fuso) ou 3 por 4 (Greenwich por fuso).",
"referencia": "Miguens, vol. II, cap. 19, itens 19.3 e 19.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0013",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 3,
"enunciado": "Um cronômetro, ajustado na HMG, está <b>atrasado</b> 1 min 20 s. O navegante usa a leitura, sem corrigi-la, como a HMG da passagem meridiana do Sol e obtém a longitude pelo AHG tabelado. Em relação à longitude verdadeira, a longitude assim calculada fica errada de:",
"alternativas": [
"1,3′, para Leste.",
"5,3′, para Leste.",
"20′, para Leste.",
"20′, para Oeste.",
"80′, para Leste."
],
"correta": 2,
"explicacao": "Cada segundo de tempo vale 0,25′ de arco, então 80 s valem 80 × 0,25′ = 20′. Com o relógio atrasado, a leitura é anterior à HMG verdadeira e o AHG tabelado sai 20′ menor. Como na passagem λ (W) = AHG, a longitude calculada tem 20′ a menos a Oeste, ou seja, fica <b>20′ para Leste</b> da verdadeira. 20′ para Oeste seria o erro de um cronômetro adiantado. Ler 1 min 20 s como arco (1′ 20″) dá 1,3′. Dividir 80 por 15, em vez de multiplicar por 0,25, dá 5,3′. Contar 1′ por segundo dá 80′.",
"referencia": "Miguens, vol. II, cap. 19, item 19.4.1; cap. 26, item 26.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0014",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "Uma tábua de marés dá as horas no fuso padrão do porto, sem horário de verão. Num porto onde o horário de verão está em vigor, os relógios da cidade estão 1 hora adiantados em relação ao fuso padrão. Se a tábua indica preamar às 14h 20m, a preamar ocorre, no relógio da cidade, às:",
"alternativas": [
"12h 20m.",
"13h 20m.",
"14h 20m.",
"15h 20m.",
"16h 20m."
],
"correta": 3,
"explicacao": "Com horário de verão, a cidade usa o fuso vizinho a Leste e seus relógios ficam 1 hora adiantados. O instante da preamar não muda, só a hora lida no relógio: 14h 20m + 1 h = <b>15h 20m</b>. Manter 14h 20m é esquecer o horário de verão. Subtrair 1 h (13h 20m) é fazer a conversão no sentido contrário. As respostas de 12h 20m e 16h 20m aplicam ajuste de 2 horas, que não existe no caso.",
"referencia": "Miguens, vol. II, cap. 19, item 19.3.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0015",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 1,
"enunciado": "Para um observador na latitude 33° 20′ S, a altura do polo elevado e o nome desse polo são:",
"alternativas": [
"33° 20′, o polo Norte.",
"56° 40′, o polo Norte.",
"56° 40′, o polo Sul.",
"0° 00′, polos no horizonte.",
"33° 20′, o polo Sul."
],
"correta": 4,
"explicacao": "A altura do polo elevado é igual à latitude do observador, e o polo elevado tem o mesmo nome da latitude: no hemisfério Sul, o polo Sul, a <b>33° 20′</b> do horizonte. O polo Norte fica abaixo do horizonte para quem está no hemisfério Sul. O valor 56° 40′ é a colatitude (90° − 33° 20′), que é a distância do polo ao zênite, e não a sua altura. E os dois polos só ficam no horizonte no Equador.",
"referencia": "Miguens, vol. II, cap. 17 (esfera oblíqua: altura do polo elevado = latitude) e cap. 18, item 18.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0016",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 1,
"enunciado": "A declinação de um astro é o arco:",
"alternativas": [
"do equador celeste, contado do ponto vernal até o círculo horário do astro, para Leste, de 0° a 360°, em graus.",
"do círculo horário do astro, contado do equador celeste até o astro, de 0° a 90°, para Norte ou para Sul.",
"do vertical do astro, contado do horizonte até o astro, de 0° a 90°, para o zênite.",
"do equador celeste, contado do meridiano de Greenwich até o círculo horário do astro, para Oeste, de 0° a 360°.",
"do círculo horário do astro, contado do zênite até o astro, de 0° a 180°, para Norte ou Sul."
],
"correta": 1,
"explicacao": "A declinação é a “latitude” do astro: o arco do seu círculo horário entre o equador celeste e o astro, de 0° a 90°, N ou S. O arco do equador contado do ponto vernal para Leste é a ascensão reta. O arco do vertical entre o horizonte e o astro é a altura. O arco do equador contado de Greenwich para Oeste é o ângulo horário em Greenwich (AHG). E a distância do zênite ao astro é a distância zenital, que se mede sobre o vertical do astro (não sobre o círculo horário) e não passa de 90° para um astro visível. Contada no círculo horário, a partir do polo, a distância seria a distância polar.",
"referencia": "Miguens, vol. II, cap. 18, itens 18.2 e 18.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0017",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "Analise as afirmativas sobre as coordenadas celestes.<br>I. O ângulo horário local (AHL) é contado a partir do meridiano superior do observador, para Oeste, de 0° a 360°.<br>II. A ascensão reta versa (ARV) de uma estrela é contada a partir do ponto vernal, para Leste.<br>III. Na passagem meridiana superior de um astro, o seu AHL é igual a zero.<br>IV. Para um observador em longitude Leste, AHL = AHG + λ.<br>Está correto o que se afirma em:",
"alternativas": [
"apenas I e III.",
"apenas II e IV.",
"apenas I, III e IV.",
"apenas II, III e IV.",
"I, II, III e IV."
],
"correta": 2,
"explicacao": "I é verdadeira: é a definição de AHL. III é verdadeira: ao cruzar o meridiano superior, o círculo horário do astro coincide com o meridiano e o AHL é nulo. IV é verdadeira: o meridiano do observador está λ a Leste de Greenwich, então AHL = AHG + λ. II é falsa: a ARV é contada para <b>Oeste</b> (ARV = 360° − ascensão reta); é a ascensão reta que se conta para Leste. Logo, o gabarito é <b>apenas I, III e IV</b>; as demais opções incluem a II ou deixam de fora uma afirmativa verdadeira.",
"referencia": "Miguens, vol. II, cap. 18, itens 18.2 e 18.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0018",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "No instante da observação, o AHG do Sol é 012° 40,5′ e o observador está em 045° 20,0′ W. O AHL do Sol e o lado do meridiano em que ele se encontra são:",
"alternativas": [
"032° 39,5′, a Leste.",
"032° 39,5′, a Oeste.",
"058° 00,5′, a Oeste.",
"327° 20,5′, a Leste.",
"327° 20,5′, a Oeste."
],
"correta": 3,
"explicacao": "Na longitude Oeste, AHL = AHG − λ = 012° 40,5′ − 045° 20,0′ = −032° 39,5′. Somando 360°: AHL = <b>327° 20,5′</b>. Como o AHL é maior que 180°, o Sol está a Leste do meridiano (ainda vai passar por ele), com ângulo no polo t = 360° − 327° 20,5′ = 032° 39,5′ E. As respostas com 032° 39,5′ dão o ângulo no polo (t) e não o AHL. A de 058° 00,5′ soma a longitude em vez de subtraí-la (regra da longitude Leste). A de 327° 20,5′ a Oeste acerta o AHL, mas erra o lado: AHL maior que 180° é Leste.",
"referencia": "Miguens, vol. II, cap. 18, item 18.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0019",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "O Almanaque dá o AHG do ponto vernal (AHGγ) = 262° 15,0′ e a ARV de uma estrela = 148° 30,0′. Para um observador em 030° 00,0′ W, o AHL da estrela é:",
"alternativas": [
"020° 45,0′.",
"050° 45,0′.",
"080° 45,0′.",
"083° 45,0′.",
"380° 45,0′."
],
"correta": 0,
"explicacao": "AHG* = AHGγ + ARV = 262° 15,0′ + 148° 30,0′ = 410° 45,0′, que se reduz a 050° 45,0′ (−360°). Na longitude Oeste, AHL* = AHG* − λ = 050° 45,0′ − 030° 00,0′ = <b>020° 45,0′</b>. Parar no AHG da estrela (050° 45,0′) é esquecer de descontar a longitude. Somar a longitude dá 080° 45,0′. Subtrair a ARV do AHGγ, em vez de somá-la, leva a 083° 45,0′ (262° 15,0′ − 148° 30,0′ − 030° 00,0′). E não reduzir o AHG ao intervalo de 0° a 360° deixa 380° 45,0′, que não é um ângulo horário válido.",
"referencia": "Miguens, vol. II, cap. 18, item 18.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0020",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 1,
"enunciado": "O Almanaque Náutico fornece elementos para a navegação astronômica com quais astros?",
"alternativas": [
"Sol, Lua, 4 planetas (Mercúrio, Vênus, Marte e Júpiter) e 57 estrelas.",
"Sol, Lua, 4 planetas (Vênus, Marte, Júpiter e Saturno) e 100 estrelas.",
"Sol, Lua e 57 estrelas, sem nenhum planeta.",
"Sol, Lua e todos os planetas do Sistema Solar, além de 57 estrelas.",
"Sol, Lua, 4 planetas (Vênus, Marte, Júpiter e Saturno) e 57 estrelas."
],
"correta": 4,
"explicacao": "O Almanaque Náutico da DHN traz os dados do Sol, da Lua, de <b>4 planetas</b> (Vênus, Marte, Júpiter e Saturno) e de <b>57 estrelas</b>. A opção com Mercúrio troca Saturno por Mercúrio, que não consta. A de 100 estrelas erra a quantidade. A que exclui os planetas ignora os quatro que são tabelados. A que inclui todos os planetas amplia a lista: Mercúrio, Urano e Netuno não são tabelados.",
"referencia": "Almanaque Náutico, DHN (página do CHM); Miguens, vol. II, cap. 23, itens 23.2 e 23.5",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/almanaque-nautico"
},
{
"id": "capitao-0021",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "Assinale a afirmativa <b>INCORRETA</b> sobre o uso do Almanaque Náutico para o Sol.",
"alternativas": [
"Entra-se nas páginas diárias com a data e a hora inteira de HMG imediatamente anterior ao instante da observação.",
"O acréscimo ao AHG do Sol, para os minutos e segundos que sobram, corresponde a 15′ de arco por minuto de tempo.",
"A correção d da declinação é proporcional aos minutos e tem o mesmo sinal do d indicado na página do dia.",
"A precisão tabular do AHG e da declinação é de 0,1′, isto é, um décimo de minuto de arco.",
"Como o Almanaque é tabelado em hora legal, basta entrar nele com a hora do relógio, sem converter para HMG."
],
"correta": 4,
"explicacao": "A afirmativa incorreta é a que diz que o Almanaque é tabelado em hora legal: ele é tabelado em <b>HMG</b>, e a hora do relógio precisa ser convertida antes (HMG = Hleg + fuso). As demais estão certas: entra-se com a hora inteira anterior da HMG; o Sol avança 15° por hora, ou seja, 15′ por minuto (0,25′ por segundo); a correção d vale d × minutos ÷ 60 e leva o sinal de d; e a precisão tabular é de 0,1′.",
"referencia": "Miguens, vol. II, cap. 23, itens 23.2 a 23.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0022",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "Extrato simulado da coluna do Sol, para um dia de maio:<table class=\"tabela\"><thead><tr><th>HMG</th><th>AHG</th></tr></thead><tbody><tr><td>16h</td><td>059° 14,6′</td></tr><tr><td>17h</td><td>074° 14,8′</td></tr></tbody></table>Para a HMG 16h 36m 20s, o AHG do Sol é:",
"alternativas": [
"059° 50,9′.",
"068° 14,6′.",
"068° 19,6′.",
"068° 29,6′.",
"074° 14,8′."
],
"correta": 2,
"explicacao": "Entra-se com a hora inteira anterior, 16h (AHG = 059° 14,6′). O acréscimo para 36m 20s é 36 × 15′ = 540′ = 9° 00,0′ mais 20 × 0,25′ = 5,0′, ou seja, 9° 05,0′. AHG = 059° 14,6′ + 9° 05,0′ = <b>068° 19,6′</b>. Ler o tempo como arco (36′ 20″ de acréscimo) dá 059° 50,9′. Esquecer os 20 s dá 068° 14,6′. Arredondar para 37 min dá 068° 29,6′. Usar o valor tabelado de 17h, sem interpolar, dá 074° 14,8′.",
"referencia": "Miguens, vol. II, cap. 23, itens 23.3 e 23.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0023",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 3,
"enunciado": "Em uma data de março, o Almanaque dá, para a HMG 15h, a declinação do Sol S 6° 05,3′, com d = −0,9′ por hora (o valor da declinação diminui, pois o Sol caminha para o Norte). A declinação do Sol às 15h 40m 25s de HMG é:",
"alternativas": [
"N 6° 04,7′.",
"S 6° 04,1′.",
"S 6° 04,7′.",
"S 6° 05,3′.",
"S 6° 05,9′."
],
"correta": 2,
"explicacao": "Correção d = d × minutos ÷ 60 = −0,9 × 40 ÷ 60 = −0,6′ (os segundos não entram). Como d é negativo, o valor da declinação diminui: subtrai-se 0,6′ de S 6° 05,3′, sem trocar o nome. <b>Dec = S 6° 04,7′</b>. Somar a correção (S 6° 05,9′) é ignorar que d indica a variação do valor. Deixar de corrigir (S 6° 05,3′) é esquecer a correção d. Aplicá-la em dobro dá S 6° 04,1′. E trocar o nome para Norte, só porque o Sol “caminha” para o Norte, erra o nome: a declinação continua Sul.",
"referencia": "Miguens, vol. II, cap. 23, item 23.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0024",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 3,
"enunciado": "Para um observador na latitude 20° S, considere o triângulo de posição de um Sol de declinação N 12°. Os lados PZ (polo elevado–zênite) e PA (polo elevado–astro) valem, respectivamente:",
"alternativas": [
"PZ = 70° e PA = 78°.",
"PZ = 70° e PA = 102°.",
"PZ = 110° e PA = 78°.",
"PZ = 20° e PA = 102°.",
"PZ = 70° e PA = 12°."
],
"correta": 1,
"explicacao": "O polo elevado é o Sul. PZ é a colatitude: 90° − 20° = 70°. PA é a distância polar do astro até o polo elevado: como a declinação (N) tem nome contrário ao do polo (S), PA = 90° + 12° = <b>102°</b>. PA = 78° seria o valor para uma declinação S de 12° (mesmo nome do polo). PZ = 110° não existe, pois a colatitude é 90° − φ. PZ = 20° confunde colatitude com latitude. PA = 12° confunde a distância polar com a própria declinação.",
"referencia": "Miguens, vol. II, cap. 20, itens 20.2 e 20.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0025",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "O ângulo horário local do Sol é 301° 00′. O ângulo no polo (t) e a hora verdadeira local são, respectivamente:",
"alternativas": [
"059° E e 08h 04m.",
"059° W e 08h 04m.",
"059° E e 15h 56m.",
"059° W e 15h 56m.",
"301° E e 20h 04m."
],
"correta": 0,
"explicacao": "Como o AHL é maior que 180°, o Sol está a Leste do meridiano e t = 360° − 301° = <b>059° E</b>. Para o Sol, HVL = AHL + 12 h; 301° ÷ 15° = 20h 04m, logo HVL = 20h 04m + 12 h = 32h 04m = <b>08h 04m</b> (manhã, antes do meio-dia verdadeiro). Dar 059° W confunde o lado. As horas 15h 56m seriam as de um Sol 59° a Oeste (tarde), com AHL = 059°. A resposta 301° E não reduz o AHL a ângulo no polo, e 20h 04m esquece de somar as 12 h de HVL = AHL + 12 h.",
"referencia": "Miguens, vol. II, cap. 18, item 18.2; cap. 19, item 19.3.1; cap. 20, item 20.3 c)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0026",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 3,
"enunciado": "Um observador está na latitude 10° S. Um astro de declinação N 40° culmina no meridiano superior. A altura do astro e o azimute, nessa culminação, são:",
"alternativas": [
"40° e 180°.",
"50° e 000°.",
"60° e 000°.",
"60° e 180°.",
"40° e 000°."
],
"correta": 4,
"explicacao": "Latitude S e declinação N têm nomes contrários: a distância zenital é z = 10° + 40° = 50°, e a altura é a = 90° − 50° = <b>40°</b>. O astro tem declinação mais ao Norte que o observador, então culmina ao Norte do zênite, com azimute 000°. Azimute 180° valeria para o astro ao Sul. A altura de 50° é a distância zenital, e não a altura. A de 60° vem de subtrair as latitudes (40° − 10° = 30°), conta que só vale para nomes iguais.",
"referencia": "Miguens, vol. II, cap. 25, itens 25.1 e 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0027",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "O Almanaque (extrato simulado) dá, para o dia, passagem meridiana (Pass. Mer.) do Sol = 12h 06m. Para a posição estimada 25° 10′ S, 028° 20′ W, a hora legal prevista da culminação é, ao minuto:",
"alternativas": [
"08h 13m.",
"11h 59m.",
"12h 06m.",
"12h 59m.",
"13h 59m."
],
"correta": 1,
"explicacao": "A Pass. Mer. é hora média local. λ = 28° 20′ = 1h 53m 20s. HMG = HML + λ (Oeste) = 12h 06m + 1h 53m 20s = 13h 59m 20s. Fuso: 28° 20′ ÷ 15° dá 1 e resto 13° 20′, maior que 7° 30′, logo +2 (O). Hleg = HMG − 2 h = 11h 59m 20s ≈ <b>11h 59m</b>. Subtrair a longitude (regra de Leste) dá 08h 13m. Tomar a Pass. Mer. como hora legal dá 12h 06m. Usar o fuso +1 dá 12h 59m. Esquecer de tirar o fuso deixa a HMG, 13h 59m.",
"referencia": "Miguens, vol. II, cap. 25, item 25.3 (1º método)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0028",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Num dia de novembro, o Almanaque (extrato simulado) dá Pass. Mer. do Sol = 11h 44m. Um iate navega no Índico, na posição estimada 12° 00′ S, 054° 10′ E, e adota o fuso teórico da posição. A hora legal prevista da culminação é, ao minuto:",
"alternativas": [
"04h 07m.",
"08h 07m.",
"11h 07m.",
"12h 07m.",
"19h 21m."
],
"correta": 3,
"explicacao": "λ = 54° 10′ = 3h 36m 40s. Na longitude Leste, HMG = HML − λ = 11h 44m − 3h 36m 40s = 08h 07m 20s. Fuso: 54° 10′ ÷ 15° dá 3 e resto 9° 10′, maior que 7° 30′; fuso 4, e Leste é negativo: −4 (D). Hleg = HMG − (−4) = 08h 07m 20s + 4 h = 12h 07m 20s ≈ <b>12h 07m</b>. Tratar o fuso como +4 dá 04h 07m. Parar na HMG dá 08h 07m. Usar o fuso 3 (só o quociente) dá 11h 07m. Somar a longitude, em vez de subtraí-la, dá 19h 21m.",
"referencia": "Miguens, vol. II, cap. 25, item 25.3 (1º método)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0029",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "No dia 4 de fevereiro, o Almanaque (extrato simulado) dá Pass. Mer. do Sol = 12h 14m. Às 06h 00m (hora legal, fuso +2) a posição é 25° 00′ S, 033° 00′ W; o veleiro navega ao rumo 270° a 8,0 nós. A hora legal prevista da culminação, calculada com a posição estimada <b>para o instante da passagem</b>, é, ao minuto:",
"alternativas": [
"12h 14m.",
"12h 22m.",
"12h 26m.",
"12h 30m.",
"14h 30m."
],
"correta": 3,
"explicacao": "Com a posição das 06h, a culminação seria às 12h 26m (λ = 2h 12m; HMG = 14h 26m). Isso dá 6h 26m de navegação: 51,5′ para Oeste, ou Δλ = 51,5′ ÷ cos 25° = 56,8′ W. Nova longitude 033° 56,8′ W = 2h 15m 47s; HMG = 12h 14m + 2h 15m 47s = 14h 29m 47s; Hleg = HMG − 2 h ≈ 12h 30m (a segunda aproximação não muda o minuto). Resposta: <b>12h 30m</b>. Sem projetar a posição, chega-se a 12h 26m. Deslocar o navio para o lado errado (Leste) dá 12h 22m. Tomar a Pass. Mer. como hora legal dá 12h 14m. E parar na HMG dá 14h 30m, sem descontar o fuso.",
"referencia": "Miguens, vol. II, cap. 25, item 25.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0030",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Observação do limbo <b>inferior</b> do Sol, de abril a setembro: altura instrumental 61° 08,4′; erro instrumental −1,6′; elevação do olho 2,5 m (depressão do horizonte −2,8′); correção c da Tábua A2 (extrato simulado) +15,5′. A altura verdadeira é:",
"alternativas": [
"60° 48,5′.",
"61° 19,5′.",
"61° 22,3′.",
"61° 22,7′.",
"61° 25,1′."
],
"correta": 1,
"explicacao": "ao = ai + ei = 61° 08,4′ − 1,6′ = 61° 06,8′. a ap = ao + dp = 61° 06,8′ − 2,8′ = 61° 04,0′. a = a ap + c = 61° 04,0′ + 15,5′ = <b>61° 19,5′</b>. Subtrair a correção A2 (que no limbo inferior é positiva) dá 60° 48,5′. Esquecer a depressão do horizonte dá 61° 22,3′. Aplicar o erro instrumental com o sinal trocado dá 61° 22,7′. Somar a depressão, que é sempre negativa, dá 61° 25,1′.",
"referencia": "Miguens, vol. II, cap. 22, itens 22.2 e 22.3.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0031",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Observação do limbo <b>superior</b> do Sol, de outubro a março: altura instrumental 47° 52,6′; erro instrumental +2,0′; elevação do olho 6,4 m (depressão do horizonte −4,5′); correção c da Tábua A2 (extrato simulado) −17,0′. A distância zenital do centro do Sol é:",
"alternativas": [
"42° 17,9′.",
"42° 22,4′.",
"42° 26,9′.",
"42° 30,9′.",
"47° 33,1′."
],
"correta": 2,
"explicacao": "ao = 47° 52,6′ + 2,0′ = 47° 54,6′. a ap = 47° 54,6′ − 4,5′ = 47° 50,1′. a = a ap + c = 47° 50,1′ − 17,0′ = 47° 33,1′. A distância zenital é z = 90° − a = 89° 60,0′ − 47° 33,1′ = <b>42° 26,9′</b>. 47° 33,1′ é a altura verdadeira, não a distância zenital. Esquecer a depressão do horizonte dá a = 47° 37,6′ e z = 42° 22,4′. Somar a depressão dá a = 47° 42,1′ e z = 42° 17,9′. Aplicar o erro instrumental com o sinal trocado dá a = 47° 29,1′ e z = 42° 30,9′.",
"referencia": "Miguens, vol. II, cap. 22, itens 22.2 e 22.3.1; cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0032",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Na passagem meridiana, a posição estimada é 28° 30′ S e a declinação do Sol é S 5° 10,5′. A altura verdadeira observada é 66° 41,7′. A latitude meridiana é:",
"alternativas": [
"18° 07,8′ N.",
"18° 07,8′ S.",
"28° 28,8′ N.",
"28° 28,8′ S.",
"61° 31,2′ S."
],
"correta": 3,
"explicacao": "z = 90° − a = 89° 60,0′ − 66° 41,7′ = 23° 18,3′. A declinação (−5° 10,5′) está mais ao Norte do que a latitude estimada (−28° 30′): o Sol passa ao Norte do zênite e φ = δ − z = −5° 10,5′ − 23° 18,3′ = −28° 28,8′, ou <b>28° 28,8′ S</b>. Perto da estimada, como deve ser. As respostas de 18° 07,8′ vêm de subtrair z de |δ| (ou o contrário), conta que não corresponde a nenhum caso: com nomes iguais e o Sol ao norte do observador, a latitude é |δ| + z. 28° 28,8′ N erra o nome da latitude. 61° 31,2′ S é a colatitude da resposta correta, 90° − 28° 28,8′.",
"referencia": "Miguens, vol. II, cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0033",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Na passagem meridiana, a posição estimada é 12° 00′ N e a declinação do Sol é S 17° 22,6′. A altura verdadeira observada é 60° 24,9′. A latitude meridiana é:",
"alternativas": [
"12° 12,5′ N.",
"12° 12,5′ S.",
"29° 35,1′ N.",
"46° 57,7′ N.",
"46° 57,7′ S."
],
"correta": 0,
"explicacao": "z = 89° 60,0′ − 60° 24,9′ = 29° 35,1′. A latitude estimada é Norte e a declinação é Sul: o Sol passa ao Sul do zênite, e φ = δ + z = −17° 22,6′ + 29° 35,1′ = +12° 12,5′, ou <b>12° 12,5′ N</b>. Dar o nome Sul (12° 12,5′ S) é esquecer o sinal do resultado. 29° 35,1′ N toma a distância zenital como latitude. As respostas de 46° 57,7′ somam as duas quantidades em módulo (17° 22,6′ + 29° 35,1′), esquecendo que os nomes contrários se compensam.",
"referencia": "Miguens, vol. II, cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0034",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Na passagem meridiana, a posição estimada é 16° 00′ N e a declinação do Sol é N 21° 40,0′. A altura verdadeira observada é 84° 14,8′. A latitude meridiana e o azimute do Sol são:",
"alternativas": [
"15° 54,8′ S e 000°.",
"15° 54,8′ N e 000°.",
"15° 54,8′ N e 180°.",
"27° 25,2′ N e 000°.",
"27° 25,2′ N e 180°."
],
"correta": 1,
"explicacao": "z = 89° 60,0′ − 84° 14,8′ = 5° 45,2′. A declinação (N 21° 40,0′) é maior que a latitude estimada (N 16°): o Sol passa ao Norte do zênite, com azimute 000°, e φ = δ − z = 21° 40,0′ − 5° 45,2′ = <b>15° 54,8′ N</b>. Com 15° 54,8′ N e azimute 180°, a latitude está certa, mas o Sol ficaria ao Sul. As respostas de 27° 25,2′ somam z à declinação, conta do Sol ao Sul, que daria latitude muito diferente da estimada. 15° 54,8′ S erra o nome.",
"referencia": "Miguens, vol. II, cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0035",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Em um extrato simulado do Almanaque, o AHG do Sol é 031° 45,2′ às 14h e 046° 45,4′ às 15h de HMG. Sendo 14h 36m 20s a HMG da passagem meridiana, a longitude é:",
"alternativas": [
"022° 40,2′ W.",
"040° 45,2′ W.",
"040° 50,2′ E.",
"040° 50,2′ W.",
"046° 45,4′ W."
],
"correta": 3,
"explicacao": "O acréscimo para 36m 20s é 36 × 15′ = 9° 00,0′ mais 20 × 0,25′ = 5,0′, ou 9° 05,0′. AHG = 031° 45,2′ + 9° 05,0′ = 040° 50,2′. Na passagem, AHL = 0 e λ (W) = AHG; como AHG é menor que 180°, a longitude é <b>040° 50,2′ W</b>. Subtrair o acréscimo dá 022° 40,2′. Esquecer os 20 s dá 040° 45,2′. Trocar o nome para E erra o hemisfério: AHG menor que 180° é Oeste. Usar o AHG tabelado de 15h, sem interpolar, dá 046° 45,4′.",
"referencia": "Miguens, vol. II, cap. 26, itens 26.5 e 26.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0036",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Em um extrato simulado do Almanaque, o AHG do Sol às 09h de HMG é 315° 04,6′. Sendo 09h 18m 40s a HMG da passagem meridiana, a longitude é:",
"alternativas": [
"040° 15,4′ E.",
"040° 15,4′ W.",
"040° 25,4′ E.",
"319° 44,6′ E.",
"319° 44,6′ W."
],
"correta": 0,
"explicacao": "O acréscimo para 18m 40s é 18 × 15′ = 4° 30,0′ mais 40 × 0,25′ = 10,0′, ou 4° 40,0′. AHG = 315° 04,6′ + 4° 40,0′ = 319° 44,6′. Como AHG é maior que 180°, a longitude é Leste: λ = 360° − AHG = <b>040° 15,4′ E</b>. Dar o nome W com o mesmo valor ignora que AHG maior que 180° implica Leste. Esquecer os 40 s do acréscimo dá 040° 25,4′ E. As respostas de 319° 44,6′ não reduzem o AHG à longitude (360° − AHG), e uma longitude não passa de 180°.",
"referencia": "Miguens, vol. II, cap. 26, itens 26.5 e 26.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0037",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "Assinale a afirmativa <b>INCORRETA</b> sobre a observação da passagem meridiana do Sol.",
"alternativas": [
"Começa-se a acompanhar o Sol cerca de cinco minutos antes da hora prevista e adota-se a maior altura observada.",
"O sextante é balançado em torno do eixo ótico, e a altura certa é a do ponto mais baixo do arco descrito pela imagem.",
"O erro instrumental deve ser determinado antes da série de observações e aplicado à altura lida com o seu sinal.",
"A hora legal prevista é aproximada, pois usa a longitude estimada, e por isso a observação começa com uma folga de tempo.",
"A longitude pelo instante da altura máxima é muito precisa, porque a altura do Sol varia depressa junto ao meridiano."
],
"correta": 4,
"explicacao": "A afirmativa incorreta é a da precisão da longitude: junto ao meridiano a altura do Sol varia muito <b>pouco</b>, e por isso o instante exato da culminação é incerto em um ou dois minutos. Como 1 min de tempo vale 15′ de arco, a longitude por esse instante é pouco precisa. As demais estão certas: a observação começa antes da hora prevista, o sextante é balançado para achar o vertical, o erro instrumental é aplicado com o seu sinal e a hora prevista é aproximada porque usa a posição estimada.",
"referencia": "Miguens, vol. II, cap. 21, item 21.2.9; cap. 25, itens 25.3 e 25.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0038",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Para localizar o Sol com o sextante, um navegante quer prever a altura instrumental (limbo inferior) na culminação, em novembro. Dados: posição estimada 33° 15,0′ S; declinação S 18° 02,4′; elevação do olho 3,1 m (depressão do horizonte −3,1′); erro instrumental +1,3′; correção c da Tábua A2 (extrato simulado) +15,9′. A altura instrumental prevista é:",
"alternativas": [
"74° 27,1′.",
"74° 33,3′.",
"74° 35,9′.",
"74° 47,4′.",
"75° 05,1′."
],
"correta": 1,
"explicacao": "z = |33° 15,0′ − 18° 02,4′| = 15° 12,6′ (mesmo nome), e a = 90° − z = 74° 47,4′. Desfaz-se a cadeia de correções com os sinais trocados: a ap = a − c = 74° 47,4′ − 15,9′ = 74° 31,5′; ao = a ap − dp = 74° 31,5′ + 3,1′ = 74° 34,6′; ai = ao − ei = 74° 34,6′ − 1,3′ = <b>74° 33,3′</b>. Somar o erro instrumental, em vez de subtraí-lo, dá 74° 35,9′. Subtrair a depressão, em vez de somá-la, dá 74° 27,1′. Somar a correção A2 dá 75° 05,1′. E 74° 47,4′ é a altura verdadeira, sem desfazer nenhuma correção.",
"referencia": "Miguens, vol. II, cap. 25, item 25.6; cap. 22, item 22.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0039",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Posição estimada na culminação: 30° 00,0′ S, 025° 30,0′ W, em janeiro. Limbo inferior do Sol: altura instrumental 79° 49,2′; erro instrumental −0,8′; elevação do olho 2,2 m (depressão do horizonte −2,6′); correção c da Tábua A2 (extrato simulado) +16,0′. Para a HMG da passagem, o Almanaque dá declinação S 20° 03,7′ e AHG 025° 38,4′. A posição meridiana é:",
"alternativas": [
"10° 05,5′ S e 025° 38,4′ W.",
"30° 01,9′ N e 025° 38,4′ W.",
"30° 01,9′ S e 025° 38,4′ W.",
"30° 01,9′ S e 025° 38,4′ E.",
"30° 17,9′ S e 025° 38,4′ W."
],
"correta": 2,
"explicacao": "a = 79° 49,2′ − 0,8′ − 2,6′ + 16,0′ = 80° 01,8′, e z = 9° 58,2′. A declinação (S 20° 03,7′) está mais ao Norte que a latitude estimada (S 30°): o Sol passa ao Norte do zênite, e φ = δ − z = −20° 03,7′ − 9° 58,2′ = −30° 01,9′, ou <b>30° 01,9′ S</b>. Com nomes iguais, a latitude é a soma |δ| + z. Aplicar φ = δ + z (Sol ao Sul do zênite) dá 10° 05,5′ S, longe da estimada. Errar o nome da latitude dá 30° 01,9′ N, e o da longitude dá 025° 38,4′ E. Esquecer a correção da Tábua A2 (a = 79° 45,8′) dá z = 10° 14,2′ e latitude 30° 17,9′ S. Na passagem λ (W) = AHG, e como 025° 38,4′ é menor que 180°, a longitude é Oeste: <b>30° 01,9′ S e 025° 38,4′ W</b>.",
"referencia": "Miguens, vol. II, cap. 22, itens 22.2 e 22.3.1; cap. 25, item 25.4; cap. 26, itens 26.5 e 26.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf",
"fixa": true
},
{
"id": "capitao-0040",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "De acordo com o item 1.2 do Anexo 5-A da NORMAM-211/DPC, o programa de Navegação Astronômica do exame de Capitão-Amador inclui, quanto à passagem meridiana do Sol:",
"alternativas": [
"o cálculo da hora legal da passagem meridiana superior pelo processo aproximado e a posição pela passagem meridiana do Sol.",
"o cálculo da hora legal da passagem meridiana inferior do Sol, pelo processo rigoroso, com o triângulo de posição e a correção de altura.",
"apenas a latitude meridiana, pois a longitude exige reta de altura e não faz parte do programa.",
"a posição por retas de altura do Sol e de estrelas, pelo método de Marcq Saint-Hilaire, em lugar da passagem meridiana.",
"o cálculo da hora legal da passagem meridiana da Lua e dos planetas, além da passagem meridiana do Sol."
],
"correta": 0,
"explicacao": "A alternativa correta reproduz os itens 1.2 b) e c) do Anexo 5-A: o cálculo da hora legal da passagem meridiana superior do Sol pelo processo aproximado e a posição pela passagem meridiana do Sol. As outras não constam do programa: a passagem inferior e o processo rigoroso não aparecem no item 1.2, e o triângulo de posição também não; a posição “só pela latitude” ignora a longitude, que a passagem meridiana também dá; a posição por retas de altura não substitui a meridiana no programa; e a passagem da Lua e dos planetas não é exigida.",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.2 b) e c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0041",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 1,
"enunciado": "Um receptor GNSS precisa resolver três incógnitas: latitude, longitude e o erro do relógio do próprio receptor. A altitude da antena já é conhecida (nível do mar). Quantos satélites, no mínimo, ele precisa captar?",
"alternativas": [
"Um satélite.",
"Dois satélites.",
"Três satélites.",
"Quatro satélites.",
"Cinco satélites."
],
"correta": 2,
"explicacao": "<p>Cada satélite fornece uma equação (pseudodistância). Com a altitude conhecida, restam três incógnitas (latitude, longitude e erro de relógio) e bastam três equações.</p><ul><li><b>Um satélite.</b> — Um satélite dá uma única equação (uma pseudodistância); sobram duas incógnitas sem solução.</li><li><b>Dois satélites.</b> — Duas equações não resolvem três incógnitas; restam posições ambíguas.</li><li><b>Quatro satélites.</b> — Quatro são necessários quando a altitude também é incógnita (posição em três dimensões), mas no mar ela é conhecida.</li><li><b>Cinco satélites.</b> — Cinco é o mínimo para o RAIM <i>detectar</i> uma falha, e não para resolver a posição.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37, item 37.3.3 (pseudodistâncias e erro de relógio)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0042",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 1,
"enunciado": "Um veleiro governa a proa 090°, a 5 nós na água, em uma corrente de 1,5 nó com set para o sul. O GNSS mostra COG 107° e SOG 5,2 nós. Por que o COG difere da proa?",
"alternativas": [
"Porque o GNSS ainda não aplicou a declinação magnética ao rumo mostrado.",
"Porque o receptor calcula o COG a partir da agulha, que tem desvio de 17°.",
"Porque o COG é o rumo sobre o fundo, resultante da proa somada à corrente.",
"Porque o HDOP está alto e o receptor erra o rumo em cerca de 17°.",
"Porque o datum do receptor difere do da carta e desloca o rumo mostrado."
],
"correta": 2,
"explicacao": "<p>O COG (<i>course over ground</i>) é o rumo do movimento sobre o fundo. Somando 5 nós para leste e 1,5 nó para o sul, resultam cerca de 5,2 nós em 107°, exatamente o que o GNSS mostra.</p><ul><li><b>Porque o GNSS ainda não aplicou a declinação magnética ao rumo mostrado.</b> — O COG é calculado em relação ao norte verdadeiro; o GNSS não usa campo magnético, e a declinação não explicaria 17°.</li><li><b>Porque o receptor calcula o COG a partir da agulha, que tem desvio de 17°.</b> — O GNSS não usa a agulha: o COG vem do deslocamento da posição (efeito Doppler) sobre o fundo.</li><li><b>Porque o HDOP está alto e o receptor erra o rumo em cerca de 17°.</b> — O HDOP degrada a posição, mas não cria uma diferença sistemática igual à que a corrente produz neste caso.</li><li><b>Porque o datum do receptor difere do da carta e desloca o rumo mostrado.</b> — O datum afeta onde a posição cai na carta, não o rumo sobre o fundo medido pelo receptor.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37 (COG e SOG)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0043",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "O erro de cada medida de distância a satélite (UERE) é de cerca de 3 m, e o receptor mostra HDOP = 4. Pela regra simples <i>erro horizontal ≈ HDOP × erro da distância</i>, qual é a ordem de grandeza do erro horizontal da posição?",
"alternativas": [
"0,75 m.",
"3 m.",
"7 m.",
"12 m.",
"36 m."
],
"correta": 3,
"explicacao": "<p>Erro horizontal ≈ HDOP × UERE = 4 × 3 = 12 m. Quanto pior a geometria dos satélites, maior o fator que multiplica o erro das distâncias.</p><ul><li><b>0,75 m.</b> — Dividir 3 por 4 inverte a lógica: o DOP multiplica o erro, não o reduz.</li><li><b>3 m.</b> — Ignora o DOP; só valeria com geometria ideal (DOP próximo de 1).</li><li><b>7 m.</b> — Somou 3 + 4; o DOP é um fator multiplicativo, não uma parcela a somar.</li><li><b>36 m.</b> — Elevar o erro ao quadrado (3² × 4) não faz parte da regra; o DOP multiplica o erro uma só vez.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37, item 37.10 (DOP)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0044",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 3,
"enunciado": "Um receptor GNSS com RAIM está captando apenas 5 satélites e avisa que a integridade da posição está comprometida. Com esses 5 satélites, o RAIM consegue:",
"alternativas": [
"Detectar e excluir sozinho o satélite defeituoso, mantendo a precisão da posição.",
"Corrigir o erro usando as correções transmitidas por uma estação de referência em terra.",
"Nada, pois o RAIM só funciona quando o receptor capta exatamente quatro satélites.",
"Detectar que as medidas são incoerentes, mas não identificar qual satélite excluir.",
"Garantir a integridade da posição, o que dispensa a conferência por radar e sonda."
],
"correta": 3,
"explicacao": "<p>Com 5 satélites sobra uma medida além das quatro incógnitas, o que basta para perceber a inconsistência (detecção). Para identificar e excluir o satélite defeituoso são necessários 6.</p><ul><li><b>Detectar e excluir sozinho o satélite defeituoso, mantendo a precisão da posição.</b> — Isso exige pelo menos 6 satélites; com 5, o receptor só sabe que algo está errado.</li><li><b>Corrigir o erro usando as correções transmitidas por uma estação de referência em terra.</b> — Isso é o DGNSS. O RAIM é autônomo e usa apenas os satélites que o próprio receptor capta.</li><li><b>Nada, pois o RAIM só funciona quando o receptor capta exatamente quatro satélites.</b> — Com 4 satélites não há redundância e o RAIM não funciona; é preciso ter satélites <i>além</i> do mínimo.</li><li><b>Garantir a integridade da posição, o que dispensa a conferência por radar e sonda.</b> — O alerta indica justamente o contrário; mesmo sem alerta, o navegante confere a posição por meios independentes.</li></ul>",
"referencia": "Stanford GPS Lab, Receiver Autonomous Integrity Monitoring (RAIM): 5 satélites para detectar a falha, 6 para identificá-la e excluí-la",
"fonte_url": "https://scpnt.stanford.edu/research/early-pntgps-research/receiver-autonomous-integrity-monitoring-raim"
},
{
"id": "capitao-0045",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "Por que a exatidão do DGNSS diminui à medida que o navio se afasta da estação de referência?",
"alternativas": [
"Porque os erros de órbita e de atmosfera deixam de ser iguais no navio e na estação.",
"Porque o relógio do receptor do navio atrasa mais quanto mais longe ele está da estação.",
"Porque a estação de referência passa a ver menos satélites quanto maior a distância ao navio.",
"Porque o datum da carta muda conforme o navio se afasta da estação de referência.",
"Porque o multicaminho local do navio aumenta à medida que a distância cresce."
],
"correta": 0,
"explicacao": "<p>A correção só cancela erros que são comuns ao navio e à estação. Com a distância, o caminho do sinal na ionosfera e na troposfera difere, e a correção fica menos adequada.</p><ul><li><b>Porque o relógio do receptor do navio atrasa mais quanto mais longe ele está da estação.</b> — O relógio do receptor não depende da distância à estação; o erro de relógio do receptor já é resolvido pelo próprio receptor.</li><li><b>Porque a estação de referência passa a ver menos satélites quanto maior a distância ao navio.</b> — O número de satélites que a estação vê não é o fator limitante; o problema é que os erros deixam de ser os mesmos no navio e na estação.</li><li><b>Porque o datum da carta muda conforme o navio se afasta da estação de referência.</b> — O datum é fixo (WGS-84) e independe da distância ao radiofarol.</li><li><b>Porque o multicaminho local do navio aumenta à medida que a distância cresce.</b> — O multicaminho depende do entorno do navio, e não da distância à estação; o DGNSS não o corrige em nenhuma distância.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37, item 37.9.1 (DGNSS)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0046",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "No plotter, um alvo AIS aparece com o estado de navegação \"fundeado\", mas sua posição avança 0,5 milha a cada 5 minutos (6 nós) e o COG está estável. O que é mais prudente concluir?",
"alternativas": [
"Tratar o alvo como fundeado, porque o AIS é a fonte mais confiável de dados sobre o alvo.",
"Ignorar o alvo, porque dados contraditórios mostram que o equipamento AIS dele está com defeito.",
"Esperar que o alvo corrija o estado de navegação antes de decidir qualquer manobra de evasão.",
"Concluir que se trata de uma boia AIS à deriva, que pode ser desprezada na vigilância.",
"Tratar o alvo como em movimento e conferir no radar, pois o estado é apenas digitado."
],
"correta": 4,
"explicacao": "<p>O estado de navegação é digitado pelo operador do alvo e pode ficar desatualizado; o movimento medido (posição e COG, vindos do GNSS) é mais confiável. Confirme no radar e aplique o RIPEAM como a qualquer embarcação em movimento.</p><ul><li><b>Tratar o alvo como fundeado, porque o AIS é a fonte mais confiável de dados sobre o alvo.</b> — O estado é declarado pelo alvo e pode estar errado ou desatualizado; o AIS não substitui a vigilância (Regra 5).</li><li><b>Ignorar o alvo, porque dados contraditórios mostram que o equipamento AIS dele está com defeito.</b> — Dados contraditórios pedem mais atenção, e não que se ignore um alvo que pode representar risco de abalroamento.</li><li><b>Esperar que o alvo corrija o estado de navegação antes de decidir qualquer manobra de evasão.</b> — A decisão deve se basear no movimento observado; esperar a correção de um dado digitado atrasa a ação.</li><li><b>Concluir que se trata de uma boia AIS à deriva, que pode ser desprezada na vigilância.</b> — Uma boia à deriva não sustenta 6 nós com COG estável, e mesmo uma boia à deriva pode ser perigo à navegação.</li></ul>",
"referencia": "RIPEAM, Regra 5; ITU-R M.1371 (AIS: o estado de navegação é informado manualmente pelo operador, enquanto posição e COG vêm do GNSS)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0047",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 1,
"enunciado": "O ecobatímetro, ajustado para 1.500 m/s, mede 0,08 s entre a emissão do pulso e a volta do eco do fundo. Qual é a profundidade indicada?",
"alternativas": [
"30 m.",
"60 m.",
"120 m.",
"240 m.",
"600 m."
],
"correta": 1,
"explicacao": "<p>Profundidade = velocidade × tempo ÷ 2 = 1.500 × 0,08 ÷ 2 = 60 m. O pulso vai até o fundo e volta, por isso se divide o tempo total por 2.</p><ul><li><b>30 m.</b> — Dividiu o tempo por 4 em vez de por 2; o pulso só vai e volta uma vez.</li><li><b>120 m.</b> — 1.500 × 0,08 = 120 m é o caminho de ida e volta; esqueceu de dividir por 2.</li><li><b>240 m.</b> — Multiplicou por 2 em vez de dividir; o resultado seria o dobro do caminho total.</li><li><b>600 m.</b> — Erro de casa decimal (tomou 0,8 s em vez de 0,08 s).</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 38, item 38.3.2 (ecobatímetro)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0048",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "Navegando para o norte (000°) ao largo de uma costa a bombordo, você corre a isóbata de 50 m. A sonda, que marcava 50 m, passa a indicar 38 m. Qual é a atitude correta?",
"alternativas": [
"Guinar para boreste, para o lado do mar, até a sonda voltar a 50 m.",
"Guinar para bombordo, para o lado da terra, até a sonda voltar a 50 m.",
"Manter o rumo, porque o GNSS mostra que a posição continua dentro da isóbata.",
"Aumentar a velocidade para sair logo da área rasa.",
"Reduzir o ganho da sonda, pois o eco de 38 m deve ser peixe ou ruído."
],
"correta": 0,
"explicacao": "<p>A costa está a bombordo, então o fundo diminui em direção à terra. Profundidade menor significa aproximação da costa; guina-se para o lado do mar, no caso boreste.</p><ul><li><b>Guinar para bombordo, para o lado da terra, até a sonda voltar a 50 m.</b> — Isso levaria o barco para águas ainda mais rasas, pois a terra está a bombordo.</li><li><b>Manter o rumo, porque o GNSS mostra que a posição continua dentro da isóbata.</b> — Uma queda de 12 m na sonda é um dado concreto de que o fundo subiu; confiar só na posição é o erro clássico.</li><li><b>Aumentar a velocidade para sair logo da área rasa.</b> — Mais velocidade não corrige a aproximação, e em águas que rasam é preciso mais tempo de reação.</li><li><b>Reduzir o ganho da sonda, pois o eco de 38 m deve ser peixe ou ruído.</b> — Mexer no ganho sem verificar o fundo esconde o aviso; a leitura deve ser tratada como real até prova em contrário.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 38, item 38.3.3 (técnicas de navegação batimétrica: correr uma isóbata)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0049",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 3,
"enunciado": "O feixe de uma sonda é um cone. Um pináculo rochoso está 50 m ao lado da vertical do transdutor e 120 m abaixo dele, dentro do cone, e é o primeiro eco recebido. Considere que a sonda converte em profundidade o tempo do primeiro eco, sem corrigir a inclinação do feixe. Que profundidade ela indica para o pináculo?",
"alternativas": [
"50 m.",
"70 m.",
"120 m.",
"130 m.",
"170 m."
],
"correta": 3,
"explicacao": "<p>O som segue a hipotenusa: √(120² + 50²) = 130 m (triângulo 5-12-13). A sonda indica a distância inclinada, maior que a profundidade vertical.</p><ul><li><b>50 m.</b> — É apenas o afastamento lateral do pináculo; a sonda mede distância ao longo do feixe, não a lateral.</li><li><b>70 m.</b> — Subtraiu 120 − 50; as distâncias lateral e vertical não se subtraem, formam um triângulo retângulo.</li><li><b>120 m.</b> — É a profundidade vertical real do pináculo, mas a sonda mede o caminho inclinado do som, que é maior.</li><li><b>170 m.</b> — Somou 120 + 50; o caminho do som é a hipotenusa do triângulo, e não a soma dos catetos.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 38, item 38.3.2 (cone de emissão)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0050",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 1,
"enunciado": "Um plotter de recreio exibe cartas eletrônicas, mas não cumpre todos os requisitos de desempenho da IMO para o ECDIS. Como ele é classificado?",
"alternativas": [
"ENC (carta náutica eletrônica).",
"ECDIS (sistema de exibição de cartas e informações).",
"INS (sistema integrado de navegação).",
"VTS (serviço de tráfego de embarcações).",
"ECS (sistema de cartas eletrônicas)."
],
"correta": 4,
"explicacao": "<p>O ECS é o sistema de cartas que não atende a todos os requisitos do ECDIS, como o plotter de recreio. A NORMAM-211 aceita um ECS para cumprir a exigência de ter cartas a bordo.</p><ul><li><b>ENC (carta náutica eletrônica).</b> — A ENC é o conjunto de dados vetoriais oficiais de uma carta, e não o equipamento que os exibe.</li><li><b>ECDIS (sistema de exibição de cartas e informações).</b> — Só é ECDIS o sistema que cumpre todas as normas de desempenho da IMO e usa ENC oficiais atualizadas; este plotter não cumpre.</li><li><b>INS (sistema integrado de navegação).</b> — O sistema integrado de navegação combina vários sensores e funções; não é o nome de um sistema de cartas que não cumpre o ECDIS.</li><li><b>VTS (serviço de tráfego de embarcações).</b> — O VTS é um serviço de tráfego prestado por uma autoridade em terra, e não um equipamento de bordo.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.20; IMO, Electronic Charts (ECDIS e ECS)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0051",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "Um veleiro calando 2,4 m quer uma folga de 1,0 m sob a quilha e ajusta o contorno de segurança do plotter em 3,4 m. Os dados da carta eletrônica só têm os contornos de 2, 5, 10 e 20 m. Que contorno o sistema usará como contorno de segurança?",
"alternativas": [
"2 m.",
"3,4 m.",
"5 m.",
"10 m.",
"20 m."
],
"correta": 2,
"explicacao": "<p>O contorno de segurança precisa existir nos dados; se o valor pedido não existe, usa-se o próximo contorno mais fundo disponível, aqui 5 m, o que é a favor da segurança.</p><ul><li><b>2 m.</b> — É menor que os 3,4 m pedidos; usá-lo deixaria o barco entrar em águas que não oferecem a folga desejada.</li><li><b>3,4 m.</b> — O sistema só trabalha com contornos que existem nos dados e não interpola uma isóbata nova.</li><li><b>10 m.</b> — Existe um contorno mais próximo (5 m) que já atende; o sistema usa o <i>próximo</i> mais fundo, não o mais fundo.</li><li><b>20 m.</b> — Seria exageradamente conservador e não é a regra de seleção do sistema.</li></ul>",
"referencia": "IHO S-52 (contorno de segurança); IMO, Electronic Charts (ECDIS e ECS)",
"fonte_url": "https://www.imo.org/en/ourwork/safety/pages/electroniccharts.aspx"
},
{
"id": "capitao-0052",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "Para uma embarcação de médio porte em navegação oceânica, o art. 4.19.2 a) II) da NORMAM-211 trata dos aparelhos GNSS a bordo. Qual configuração cumpre a exigência e segue a recomendação da norma?",
"alternativas": [
"Um aparelho GNSS e o radar, que confirma a posição por distâncias a pontos de terra.",
"Um único aparelho GNSS com duas antenas, para o caso de falha de uma delas na travessia.",
"Um aparelho GNSS e um sextante com Almanaque, que dispensam um segundo aparelho GNSS.",
"Dois aparelhos GNSS, um deles com bateria própria, independente da energia do barco.",
"Nenhum aparelho GNSS, desde que haja ecobatímetro e cartas de papel atualizadas."
],
"correta": 3,
"explicacao": "<p>A norma exige 2 aparelhos GNSS na navegação oceânica e recomenda que ao menos um tenha fonte de energia independente (pilha ou bateria própria).</p><ul><li><b>Um aparelho GNSS e o radar, que confirma a posição por distâncias a pontos de terra.</b> — O radar não é um GNSS; a norma exige dois aparelhos GNSS na navegação oceânica.</li><li><b>Um único aparelho GNSS com duas antenas, para o caso de falha de uma delas na travessia.</b> — Continua sendo um só aparelho (um receptor); a norma pede dois aparelhos.</li><li><b>Um aparelho GNSS e um sextante com Almanaque, que dispensam um segundo aparelho GNSS.</b> — O sextante é um bom plano B, mas não substitui o segundo aparelho GNSS exigido.</li><li><b>Nenhum aparelho GNSS, desde que haja ecobatímetro e cartas de papel atualizadas.</b> — Sonda e cartas não dispensam o GNSS exigido na navegação oceânica.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.19.2 a) II)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0053",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 2,
"enunciado": "Ao atracar junto a um cais de concreto com guindastes metálicos, a posição do GNSS salta alguns metros de um lado para o outro, mesmo com 9 satélites e HDOP 1,1. A 200 m do cais a posição se estabiliza. A causa mais provável é:",
"alternativas": [
"Falsificação (<i>spoofing</i>), que só costuma atuar nas proximidades de cais metálicos.",
"Atraso da ionosfera, que muda de valor a cada 200 m de afastamento do cais.",
"Multicaminho: o sinal chega direto e também refletido nas estruturas do cais.",
"Geometria ruim dos satélites, que eleva o HDOP quando o barco está encostado.",
"Datum da carta diferente do WGS-84, que desloca a posição de modo aleatório."
],
"correta": 2,
"explicacao": "<p>O sinal refletido nas estruturas próximas chega atrasado e se mistura ao direto, causando saltos de posição que desaparecem ao se afastar do obstáculo.</p><ul><li><b>Falsificação (<i>spoofing</i>), que só costuma atuar nas proximidades de cais metálicos.</b> — A falsificação não depende da proximidade de um cais, e o problema não sumiria só por afastar o barco 200 m.</li><li><b>Atraso da ionosfera, que muda de valor a cada 200 m de afastamento do cais.</b> — O atraso ionosférico é praticamente igual em áreas pequenas; não mudaria entre o cais e 200 m dele.</li><li><b>Geometria ruim dos satélites, que eleva o HDOP quando o barco está encostado.</b> — O HDOP de 1,1 indica geometria excelente; esta não é a causa.</li><li><b>Datum da carta diferente do WGS-84, que desloca a posição de modo aleatório.</b> — Diferença de datum desloca a posição sempre do mesmo modo e não causa saltos.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37, item 37.3.4 (fontes de erro: sinais refletidos, multicaminho)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0054",
"nivel": "capitao",
"tema": "Navegação eletrônica",
"dificuldade": 3,
"enunciado": "Em plena travessia, o plotter mostra de repente uma posição a 40 milhas da real, com SOG de 38 nós e a data errada, mas continua indicando \"fix\" com 10 satélites e sinal forte. Radar e sonda contradizem o plotter. Qual é a hipótese mais coerente e a melhor conduta?",
"alternativas": [
"Falha da antena ou do cabo; basta aguardar que o aparelho se corrija sozinho.",
"HDOP alto por falta de satélites; esperar que a geometria melhore antes de qualquer ação.",
"Datum diferente da carta; ativar a função de mudança de datum e confiar no plotter.",
"Multicaminho no mastro; afastar a antena do mastro para estabilizar a posição do plotter.",
"Interferência ou falsificação do GNSS: use a estimada e confira com radar e sonda."
],
"correta": 4,
"explicacao": "<p>Salto de posição, SOG absurda e data errada com sinal aparentemente bom são sintomas de falsificação. Piloto, AIS e DSC dependem do mesmo GNSS; a estimada e os instrumentos independentes são a base.</p><ul><li><b>Falha da antena ou do cabo; basta aguardar que o aparelho se corrija sozinho em poucos minutos.</b> — Falha de antena ou cabo faz o número de satélites cair a zero ou o aparelho avisar \"sem fix\", e não indicar 10 satélites com sinal forte.</li><li><b>HDOP alto por falta de satélites; esperar que a geometria melhore antes de qualquer ação.</b> — Há 10 satélites e sinal forte; geometria ruim não explica salto de 40 milhas nem data errada.</li><li><b>Datum diferente da carta; ativar a função de mudança de datum e confiar no plotter.</b> — Diferenças de datum são de metros a poucas centenas de metros, e não de 40 milhas.</li><li><b>Multicaminho no mastro; afastar a antena do mastro para estabilizar a posição do plotter.</b> — O multicaminho causa erros de poucos metros, e não um salto de dezenas de milhas.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III (DHN, 1ª rev. 2026), cap. 37 (fontes de erro) e item 38.2.2 (GNSS comprometido por bloqueio, falsificação ou multipercurso); estimada e instrumentos independentes como base",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0055",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 1,
"enunciado": "Um radar emite pulsos de 0,2 µs. Considere que o pulso percorre 300 m a cada microssegundo. Dois alvos na mesma marcação, um atrás do outro, só aparecem separados se estiverem afastados, no mínimo, de aproximadamente:",
"alternativas": [
"15 m.",
"30 m.",
"60 m.",
"120 m.",
"300 m."
],
"correta": 1,
"explicacao": "<p>O comprimento do pulso é 300 × 0,2 = 60 m; a discriminação em distância é a metade dele, 30 m.</p><ul><li><b>15 m.</b> — Dividiu duas vezes pela metade; a discriminação é metade do comprimento do pulso, e não um quarto.</li><li><b>60 m.</b> — É o comprimento do pulso inteiro; esqueceu de tomar a metade (o eco faz ida e volta).</li><li><b>120 m.</b> — Multiplicou por 2 em vez de dividir; o resultado seria o dobro do comprimento do pulso.</li><li><b>300 m.</b> — É o comprimento de um pulso de 1 µs, e não a discriminação: com 1 µs a discriminação seria 150 m. Aqui o pulso dura 0,2 µs.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.1.2 (largura do pulso)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0056",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Um radar tem largura de feixe horizontal de 1,5°. Dois rochedos estão à mesma distância, 4 milhas, lado a lado. Considerando que 1° de feixe corresponde a cerca de 32 m a cada milha, qual é a separação lateral mínima para que apareçam como dois ecos?",
"alternativas": [
"96 m.",
"190 m.",
"380 m.",
"770 m.",
"1.900 m."
],
"correta": 1,
"explicacao": "<p>1,5 × 32 m × 4 milhas ≈ 190 m, pois cada grau do feixe vale 32 m por milha de distância. A separação mínima lateral cresce com a distância e com a largura do feixe.</p><ul><li><b>96 m.</b> — Metade do valor correto; a discriminação em marcação usa a largura total do feixe, não metade.</li><li><b>380 m.</b> — Dobrou o valor correto (por exemplo, tomando 3° ou 8 milhas).</li><li><b>770 m.</b> — Multiplicou pelas 4 milhas duas vezes (190 × 4 ≈ 770 m); a distância entra uma só vez na conta.</li><li><b>1.900 m.</b> — Erro de uma casa decimal; 1.900 m seria a separação a 40 milhas.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.1.2 (largura do feixe)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0057",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Dois pesqueiros navegam na mesma marcação em relação ao seu radar, um atrás do outro, com 60 m entre eles. O pulso percorre 300 m por microssegundo. Entre as larguras de pulso abaixo, qual é a única que ainda os mostra como dois ecos?",
"alternativas": [
"0,25 µs.",
"0,50 µs.",
"0,75 µs.",
"1,00 µs.",
"1,50 µs."
],
"correta": 0,
"explicacao": "<p>Com 0,25 µs o comprimento do pulso é 75 m e a discriminação é 37,5 m, menor que os 60 m: os dois ecos aparecem separados.</p><ul><li><b>0,50 µs.</b> — Discriminação de 75 m, maior que os 60 m entre os barcos: os ecos se fundem.</li><li><b>0,75 µs.</b> — Discriminação de 112 m: os dois pesqueiros viram um eco só.</li><li><b>1,00 µs.</b> — Discriminação de 150 m: muito maior que os 60 m de separação.</li><li><b>1,50 µs.</b> — Discriminação de 225 m: os ecos se fundem completamente.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.1.2 (largura do pulso)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0058",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Em nevoeiro denso, sem ver nem ouvir nada, você detecta só pelo radar um alvo a 3 milhas, 30° por boreste da proa (à frente do través), com marcação constante e distância diminuindo. Seu veleiro não está ultrapassando esse alvo. Que tipo de alteração de rumo o RIPEAM manda evitar nessa situação?",
"alternativas": [
"Alteração de rumo para boreste, ainda que ampla e feita com bastante antecedência.",
"Qualquer alteração de rumo, de modo que só a velocidade possa ser modificada.",
"Redução da velocidade ao mínimo que permita manter o rumo enquanto durar a aproximação do alvo.",
"Alteração de rumo para bombordo, em relação a alvo por ante-a-vante do través.",
"Alteração ampla de rumo, pois a Regra 8(b) pede pequenas alterações sucessivas."
],
"correta": 3,
"explicacao": "<p>A Regra 19(d)(i) manda evitar a guinada para bombordo em relação a embarcação por ante-a-vante do través, exceto no caso de embarcação que esteja sendo ultrapassada (o que não é o caso). Guinando para boreste, de modo amplo e claro (Regra 8(b)), o barco tende a passar pela popa do alvo.</p><ul><li><b>Alteração de rumo para boreste, ainda que ampla e feita com bastante antecedência.</b> — A Regra 19(d)(i) restringe a guinada para bombordo; guinar para boreste, de forma ampla, é permitido.</li><li><b>Qualquer alteração de rumo, de modo que só a velocidade possa ser modificada.</b> — A regra não proíbe toda alteração de rumo, só a guinada para bombordo em relação a alvo por ante-a-vante do través.</li><li><b>Redução da velocidade ao mínimo que permita manter o rumo enquanto durar a aproximação do alvo.</b> — Reduzir a velocidade não é alteração de rumo, e a regra de evitar guinar para bombordo é a que se pergunta.</li><li><b>Alteração ampla de rumo, pois a Regra 8(b) pede pequenas alterações sucessivas.</b> — A Regra 8(b) manda o contrário: alterações amplas e claras, evitando pequenas alterações sucessivas.</li></ul>",
"referencia": "RIPEAM, Regra 19(d)(i) e Regra 8(b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0059",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "A antena do radar de um veleiro está a 9 m de altura e o alvo é um navio de 25 m de altura de superestrutura. Pela fórmula do horizonte radar, 2,21 (√H + √h), a que distância, em teoria, o navio passa a ser detectado?",
"alternativas": [
"6,6 milhas.",
"11,1 milhas.",
"12,9 milhas.",
"17,7 milhas.",
"75,1 milhas."
],
"correta": 3,
"explicacao": "<p>2,21 × (√9 + √25) = 2,21 × (3 + 5) = 17,7 milhas. Somam-se os horizontes da antena e do alvo.</p><ul><li><b>6,6 milhas.</b> — É apenas o horizonte radar da antena (2,21 × 3), sem somar o efeito da altura do alvo.</li><li><b>11,1 milhas.</b> — É 2,21 × 5, o horizonte radar só do alvo; falta somar a parcela da antena.</li><li><b>12,9 milhas.</b> — Tirou a raiz da soma das alturas, e não a soma das raízes.</li><li><b>75,1 milhas.</b> — Somou as alturas sem tirar a raiz (2,21 × 34).</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.1.3 (horizonte radar)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0060",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "Na tela do radar de um veleiro aparece um eco fraco à mesma distância de um navio que passa pelo seu través, mas em uma marcação que coincide com a da retranca. Ao guinar, o eco falso continua na mesma marcação em relação à proa do barco. Esse eco é:",
"alternativas": [
"Eco múltiplo: reflexões entre os dois barcos geram ecos em distâncias dobro e triplo, na mesma marcação.",
"Eco lateral: lóbulos do feixe desenham arcos de eco ao redor de um alvo forte e próximo.",
"Eco de segunda volta: eco de alvo muito distante que aparece em distância errada, na marcação do alvo.",
"Setor de sombra: o mastro bloqueia o feixe e cria um falso eco na direção bloqueada.",
"Eco indireto: o pulso volta pela estrutura do próprio barco antes de chegar à antena."
],
"correta": 4,
"explicacao": "<p>O eco indireto surge à mesma distância do alvo verdadeiro, mas na marcação da estrutura que reflete (mastro, retranca), e a acompanha ao guinar.</p><ul><li><b>Eco múltiplo: reflexões entre os dois barcos geram ecos em distâncias dobro e triplo, na mesma marcação.</b> — O eco múltiplo aparece na mesma marcação do alvo, mas em distâncias múltiplas, e não à mesma distância.</li><li><b>Eco lateral: lóbulos do feixe desenham arcos de eco ao redor de um alvo forte e próximo.</b> — O eco lateral forma arcos ao redor do alvo, e não um eco isolado numa marcação fixa em relação à proa.</li><li><b>Eco de segunda volta: eco de alvo muito distante que aparece em distância errada, na marcação do alvo.</b> — Aparece na marcação do alvo e em distância falsa; aqui a distância é igual e a marcação é da estrutura do barco.</li><li><b>Setor de sombra: o mastro bloqueia o feixe e cria um falso eco na direção bloqueada.</b> — O setor de sombra produz ausência de eco, e não um eco extra.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.2.1 (ecos falsos)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0061",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 1,
"enunciado": "O que é um RACON?",
"alternativas": [
"Um refletor passivo de três placas em ângulo reto, que devolve o pulso na direção de onde veio.",
"Um respondedor ativo que devolve ao radar um sinal codificado em Morse, que aparece na tela.",
"Um transmissor que emite sozinho, sem ser excitado, e aparece como linha radial da tela.",
"Um respondedor de salvamento que aparece como uma linha de pontos na tela dos navios que o procuram.",
"Um amplificador de eco que reforça o retorno do alvo, sem enviar sinal codificado."
],
"correta": 1,
"explicacao": "<p>O RACON é um auxílio ativo: excitado pelo pulso do radar, transmite uma resposta codificada que identifica o sinal na tela.</p><ul><li><b>Um refletor passivo de três placas em ângulo reto, que devolve o pulso na direção de onde veio.</b> — Essa é a descrição do refletor radar, que é passivo e não emite sinal próprio.</li><li><b>Um transmissor que emite sozinho, sem ser excitado, e aparece como linha radial da tela.</b> — Essa é a descrição do RAMARK, que dá só a marcação.</li><li><b>Um respondedor de salvamento que aparece como uma linha de pontos na tela dos navios que o procuram.</b> — Essa é a descrição do SART, respondedor das balsas e embarcações de sobrevivência.</li><li><b>Um amplificador de eco que reforça o retorno do alvo, sem enviar sinal codificado.</b> — Essa é a descrição do RTE (<i>radar target enhancer</i>); o RACON envia sinal codificado.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.2.5 (auxílios radar)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0062",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Pela NORMAM-601/DHN, art. 3.14 c), o sinal de um novo perigo recém-descoberto pode ter um RACON. Que letra em código Morse esse RACON transmite?",
"alternativas": [
"N (— ·).",
"K (— · —).",
"B (— · · ·).",
"O (— — —).",
"D (— · ·)."
],
"correta": 4,
"explicacao": "<p>A NORMAM-601/DHN prevê o RACON \"D\" (— · ·) para o sinal de novo perigo.</p><ul><li><b>N (— ·).</b> — A norma prevê a letra D para novo perigo, e não a N.</li><li><b>K (— · —).</b> — K não é a letra prevista para novo perigo; a norma indica o D.</li><li><b>B (— · · ·).</b> — B não é a letra prevista para novo perigo; a norma indica o D.</li><li><b>O (— — —).</b> — O não é a letra prevista para novo perigo; a norma indica o D.</li></ul>",
"referencia": "NORMAM-601/DHN, art. 3.14 c) (RACON \"D\" para novo perigo)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/normam/normam-601.html"
},
{
"id": "capitao-0063",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 1,
"enunciado": "Na tela, o sinal de um RACON aparece como um traço que começa no anel de 3,0 milhas e se estende, em direção à borda da tela, até 3,6 milhas. A que distância está o RACON?",
"alternativas": [
"0,6 milha.",
"3,0 milhas.",
"3,3 milhas.",
"3,6 milhas.",
"6,6 milhas."
],
"correta": 1,
"explicacao": "<p>O sinal começa na posição do RACON e se estende para fora; mede-se até a borda mais próxima do primeiro ponto ou traço, ou seja, 3,0 milhas.</p><ul><li><b>0,6 milha.</b> — É apenas o comprimento do sinal na tela, e não a distância do centro até o auxílio.</li><li><b>3,3 milhas.</b> — É o meio do sinal, que serve para ler a marcação; a distância se mede na borda mais próxima.</li><li><b>3,6 milhas.</b> — É o fim do sinal codificado, e não a posição do RACON.</li><li><b>6,6 milhas.</b> — Somou 3,0 + 3,6; não há razão para somar as duas extremidades do sinal.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.2.5 b) (leitura do RACON)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0064",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Na navegação paralela indexada, o veleiro navega a rumo no fundo 090°, com uma ilha por bombordo cuja menor distância à derrota, na carta, é de 1,2 milha. Com o radar em norte para cima, como se traça a reta índice?",
"alternativas": [
"Paralela à derrota, a 1,2 milha do centro, ao norte da tela (lado da ilha).",
"Paralela à linha leste-oeste da derrota, a 1,2 milha do centro, ao sul da tela.",
"Perpendicular à linha da derrota, a 1,2 milha do centro, à frente do barco.",
"Paralela à marcação inicial da ilha, passando exatamente pelo centro da tela.",
"Um círculo de 1,2 milha de raio, centrado na ilha e tangente à derrota."
],
"correta": 0,
"explicacao": "<p>A reta é paralela ao rumo no fundo e fica à distância de índice (1,2 M) do lado em que está a ilha. Com rumo 090°, bombordo é o norte, então a reta fica ao norte do centro.</p><ul><li><b>Paralela à linha leste-oeste da derrota, a 1,2 milha do centro, ao sul da tela.</b> — Coloca a reta do lado oposto ao da ilha; a ilha está por bombordo (norte).</li><li><b>Perpendicular à linha da derrota, a 1,2 milha do centro, à frente do barco.</b> — A reta índice é paralela à derrota, e não perpendicular a ela.</li><li><b>Paralela à marcação inicial da ilha, passando exatamente pelo centro da tela.</b> — A marcação da ilha muda ao longo do trajeto, e a reta precisa ficar afastada do centro pela distância de índice.</li><li><b>Um círculo de 1,2 milha de raio, centrado na ilha e tangente à derrota.</b> — Um círculo em torno do objeto não é reta índice; ela deve ser paralela à derrota.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.3.6 (navegação paralela indexada)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0065",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "Navegando a rumo no fundo 090°, com uma ilha por boreste, você traçou na tela (norte para cima) a reta índice paralela à derrota, a 1,0 milha do centro, do lado sul. O eco da ilha agora corre sobre uma linha paralela a 0,7 milha do centro, entre a reta índice e o centro (figura). O que isso indica e qual é a correção?",
"alternativas": [
"O barco está 0,3 milha mais longe da ilha que o planejado; convém guinar para boreste.",
"O barco está 0,3 milha mais longe da ilha que o planejado; convém guinar para bombordo.",
"O barco está 0,3 milha mais perto da ilha que o planejado; convém guinar para boreste.",
"O barco está sobre a derrota; a diferença vem apenas de descentragem da tela do radar.",
"O barco está 0,3 milha mais perto da ilha que o planejado; convém guinar para bombordo."
],
"correta": 4,
"explicacao": "<p>Eco entre a reta índice e o centro significa menor distância ao objeto: 1,0 − 0,7 = 0,3 M mais perto. Como a ilha está por boreste, afasta-se guinando para bombordo.</p><ul><li><b>O barco está 0,3 milha mais longe da ilha que o planejado; convém guinar para boreste.</b> — Leu a posição do eco ao contrário: eco entre a reta e o centro significa estar mais perto, e não mais longe.</li><li><b>O barco está 0,3 milha mais longe da ilha que o planejado; convém guinar para bombordo.</b> — Também leu ao contrário: o eco mais perto do centro que a reta índice indica menor distância à ilha.</li><li><b>O barco está 0,3 milha mais perto da ilha que o planejado; convém guinar para boreste.</b> — Guinar para boreste, para o lado da ilha, aumentaria o erro e aproximaria ainda mais o barco.</li><li><b>O barco está sobre a derrota; a diferença vem apenas de descentragem da tela do radar.</b> — Se estivesse sobre a derrota, o eco correria sobre a reta índice; o eco fora dela mostra desvio real.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.3.6 (navegação paralela indexada)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 240\" role=\"img\" aria-label=\"Tela do radar em norte para cima. O centro R está no alto. Uma reta tracejada paralela ao rumo 090 passa 1,0 milha ao sul. O eco da ilha corre sobre outra reta, a 0,7 milha ao sul.\"><rect width=\"320\" height=\"240\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><g fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"><circle cx=\"160\" cy=\"40\" r=\"70\"/><circle cx=\"160\" cy=\"40\" r=\"140\"/></g><text x=\"166\" y=\"120\" font-size=\"11\" fill=\"var(--ink)\">1</text><text x=\"166\" y=\"190\" font-size=\"11\" fill=\"var(--ink)\">2</text><line x1=\"20\" y1=\"110\" x2=\"300\" y2=\"110\" stroke=\"var(--ink)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"26\" y=\"104\" font-size=\"11\" fill=\"var(--ink)\">reta índice (1,0 M)</text><line x1=\"20\" y1=\"89\" x2=\"300\" y2=\"89\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"26\" y=\"82\" font-size=\"11\" fill=\"var(--ink)\">trajeto do eco da ilha (0,7 M)</text><path d=\"M215 80 q8 -10 24 -4 q10 6 6 18 q-14 8 -30 2 z\" fill=\"var(--land)\" stroke=\"var(--ink)\"/><circle cx=\"160\" cy=\"40\" r=\"4\" fill=\"var(--ink)\"/><text x=\"168\" y=\"36\" font-size=\"12\" font-weight=\"700\" fill=\"var(--ink)\">R</text><g stroke=\"var(--ink)\" stroke-width=\"2\" fill=\"var(--ink)\"><line x1=\"160\" y1=\"40\" x2=\"200\" y2=\"40\"/><polygon points=\"206,40 197,35 197,45\"/></g><text x=\"210\" y=\"34\" font-size=\"11\" fill=\"var(--ink)\">derrota 090°</text></svg>"
}
},
{
"id": "capitao-0066",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "Ao passar no alinhamento entre dois pontos conhecidos (um de cada lado do barco), as distâncias radar foram 2,1 M e 2,5 M. Na carta, a distância entre os dois pontos é de 4,8 M. Admitindo o mesmo erro nas duas medidas, qual é o erro de distância a aplicar a cada medida do radar?",
"alternativas": [
"Somar 0,05 M a cada distância.",
"Somar 0,2 M a cada distância.",
"Somar 0,1 M a cada distância.",
"Subtrair 0,1 M de cada distância.",
"Subtrair 0,2 M de cada distância."
],
"correta": 2,
"explicacao": "<p>Soma radar 4,6 M contra 4,8 M da carta: o radar mediu 0,2 M a menos no total, ou 0,1 M por distância (entraram duas distâncias). Logo, soma-se 0,1 M a cada leitura.</p><ul><li><b>Somar 0,05 M a cada distância.</b> — A diferença total é 0,2 M; dividida entre duas distâncias, dá 0,1 M, e não 0,05 M.</li><li><b>Somar 0,2 M a cada distância.</b> — 0,2 M é o erro total das duas distâncias; cada uma carrega metade, 0,1 M.</li><li><b>Subtrair 0,1 M de cada distância.</b> — Inverteu o sinal: o radar mediu a menos que a carta, então a correção é somar.</li><li><b>Subtrair 0,2 M de cada distância.</b> — Erra o sinal e o valor: o radar mediu a menos, e o erro por distância é 0,1 M.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.3.6 a) iv) (erro de distância do radar)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0067",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Um alvo é plotado a cada 12 minutos, sempre na marcação 120°, às 0930 (8,0 M), às 0942 (6,0 M) e às 0954 (4,0 M). Se ambos mantiverem rumo e velocidade, a hora prevista do abalroamento é:",
"alternativas": [
"1006.",
"1012.",
"1018.",
"1030.",
"1042."
],
"correta": 2,
"explicacao": "<p>Marcação constante e distância caindo: risco de abalroamento. VMR = 2,0 M ÷ 12 min = 10 nós. Restam 4,0 M, que a 10 nós levam 24 min: 0954 + 24 min = 1018.</p><ul><li><b>1006.</b> — É 12 minutos depois da última plotagem, mas a distância restante (4,0 M) exige mais tempo à VMR de 10 nós.</li><li><b>1012.</b> — São 18 minutos depois da última plotagem; a conta não bate com a VMR de 10 nós.</li><li><b>1030.</b> — Corresponde a 36 minutos depois da última plotagem, que seria o tempo para 6,0 M, e não 4,0 M.</li><li><b>1042.</b> — Seria o tempo se a velocidade relativa fosse 5 nós; a VMR obtida é 10 nós.</li></ul>",
"referencia": "RIPEAM, Regra 7(d)(i); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, itens 14.4.2 e 14.4.4 (PMA, VMR e hora do PMA)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0068",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Na rosa de manobra (norte para cima, anéis de 1 milha, R no centro), o alvo foi plotado em M1 (0930, 014°, 6,2 M), M2 (0936, 017°, 5,0 M) e M3 (0942, 023°, 3,9 M). Mantidos rumo e velocidade de ambos, o ponto de maior aproximação (PMA ou CPA) e a hora dele serão, aproximadamente:",
"alternativas": [
"1,6 M, na marcação 090°, às 1000.",
"1,6 M, na marcação 270°, às 1000.",
"1,6 M, na marcação 090°, às 1018.",
"3,6 M, na marcação 000°, às 1000.",
"PMA zero (colisão) às 1000."
],
"correta": 0,
"explicacao": "<p>A reta M1-M3 tem DMR ≈ 180° (o alvo corre para o sul na tela) e passa a 1,6 M a leste de R, então o PMA tem marcação 090°. A VMR é 2,4 M ÷ 12 min ≈ 12 nós; de M3 até o ponto do PMA faltam cerca de 3,6 M, ou 18 min: 0942 + 18 min = 1000.</p><ul><li><b>1,6 M, na marcação 270°, às 1000.</b> — A distância está certa, mas o lado não: o alvo vem de nordeste (014° a 023°) e passa a leste, na marcação 090°.</li><li><b>1,6 M, na marcação 090°, às 1018.</b> — Contou os 18 minutos a partir de 1000 em vez de 0942; o tempo até o PMA conta a partir de M3, a última plotagem.</li><li><b>3,6 M, na marcação 000°, às 1000.</b> — 3,6 M é a distância de M3 até o ponto do PMA, e não a distância mínima de passagem, que é medida a partir de R.</li><li><b>PMA zero (colisão) às 1000.</b> — Não há colisão: a marcação aumenta (014°, 017°, 023°), o que indica que o alvo passa a leste de você.</li></ul>",
"referencia": "RIPEAM, Regra 7(d)(i); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, itens 14.4.2 e 14.4.3 (rosa de manobra, DMR, VMR e PMA)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 320\" role=\"img\" aria-label=\"Rosa de manobra com anéis de 1 milha. R no centro e três posições do alvo: M1 às 0930 em 014 graus a 6,2 milhas, M2 às 0936 em 017 graus a 5,0 milhas, M3 às 0942 em 023 graus a 3,9 milhas.\"><rect width=\"320\" height=\"320\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"160\" y1=\"300\" x2=\"160\" y2=\"20\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"90\" y1=\"281\" x2=\"230\" y2=\"39\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"39\" y1=\"230\" x2=\"281\" y2=\"90\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"20\" y1=\"160\" x2=\"300\" y2=\"160\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"39\" y1=\"90\" x2=\"281\" y2=\"230\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"90\" y1=\"39\" x2=\"230\" y2=\"281\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><circle cx=\"160\" cy=\"160\" r=\"23\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"148\" font-size=\"11\" fill=\"var(--ink)\">1</text><circle cx=\"160\" cy=\"160\" r=\"47\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"124\" font-size=\"11\" fill=\"var(--ink)\">2</text><circle cx=\"160\" cy=\"160\" r=\"70\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"101\" font-size=\"11\" fill=\"var(--ink)\">3</text><circle cx=\"160\" cy=\"160\" r=\"93\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"78\" font-size=\"11\" fill=\"var(--ink)\">4</text><circle cx=\"160\" cy=\"160\" r=\"117\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"54\" font-size=\"11\" fill=\"var(--ink)\">5</text><circle cx=\"160\" cy=\"160\" r=\"140\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"31\" font-size=\"11\" fill=\"var(--ink)\">6</text><text x=\"160\" y=\"14\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">000</text><text x=\"300\" y=\"164\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">090</text><text x=\"160\" y=\"312\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">180</text><text x=\"20\" y=\"164\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">270</text><polyline points=\"195.0,19.6 194.1,48.4 195.6,76.2\" fill=\"none\" stroke=\"var(--ink)\" stroke-dasharray=\"4 3\"/><circle cx=\"195.0\" cy=\"19.6\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"203.0\" y=\"23.6\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M1 0930</text><circle cx=\"194.1\" cy=\"48.4\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"202.1\" y=\"52.4\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M2 0936</text><circle cx=\"195.6\" cy=\"76.2\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"203.6\" y=\"80.2\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M3 0942</text><circle cx=\"160\" cy=\"160\" r=\"4\" fill=\"var(--ink)\"/><text x=\"167\" y=\"176\" font-size=\"12\" font-weight=\"700\" fill=\"var(--ink)\">R</text></svg>"
}
},
{
"id": "capitao-0069",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "Seu veleiro governa 000° a 8 nós. Plotando um alvo na rosa de manobra, você obteve DMR 270° e VMR 6 nós. No triângulo de velocidades (tr + rm = tm), quais são o rumo e a velocidade verdadeiros do alvo, supondo que ele mantenha rumo e velocidade?",
"alternativas": [
"037°, 10 nós.",
"217°, 10 nós.",
"270°, 6 nós.",
"323°, 14 nós.",
"323°, 10 nós."
],
"correta": 4,
"explicacao": "<p>tr = 8 nós para o norte e rm = 6 nós para o oeste; tm = tr + rm tem componentes 8 N e 6 W, módulo √(8² + 6²) = 10 nós, rumo 360° − arctg(6/8) ≈ 323°.</p><ul><li><b>037°, 10 nós.</b> — Subtraiu o vetor relativo (tr − rm) em vez de somá-lo, o que espelha o rumo do alvo.</li><li><b>217°, 10 nós.</b> — É o recíproco do rumo correto (323° + 180°); o vetor tm aponta para noroeste, e não para sudoeste.</li><li><b>270°, 6 nós.</b> — Tomou o movimento relativo (DMR e VMR) como se fosse o movimento verdadeiro do alvo.</li><li><b>323°, 14 nós.</b> — O rumo está certo, mas somou as velocidades (8 + 6); as velocidades de vetores perpendiculares se compõem pelo teorema de Pitágoras.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.4.2 (triângulo de velocidades)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 230\" role=\"img\" aria-label=\"Triângulo de velocidades incompleto. O vetor tr sai de t e vai para cima, 8 nós, rumo 000. O vetor rm sai da ponta de tr e vai para a esquerda, 6 nós, direção 270. O vetor tm, do ponto t até a ponta de rm, está tracejado e deve ser determinado.\"><rect width=\"320\" height=\"230\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><g stroke=\"var(--ink)\" stroke-width=\"2.5\" fill=\"var(--ink)\"><line x1=\"190\" y1=\"205\" x2=\"190\" y2=\"67\"/><polygon points=\"190,58 184,70 196,70\"/><line x1=\"190\" y1=\"58\" x2=\"92\" y2=\"58\"/><polygon points=\"80,58 92,52 92,64\"/></g><line x1=\"190\" y1=\"205\" x2=\"80\" y2=\"58\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"7 5\"/><text x=\"198\" y=\"140\" font-size=\"12\" fill=\"var(--ink)\">tr: 000°, 8 nós</text><text x=\"40\" y=\"44\" font-size=\"12\" fill=\"var(--ink)\">rm: DMR 270°, VMR 6 nós</text><text x=\"88\" y=\"150\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink)\">tm = ?</text><circle cx=\"190\" cy=\"205\" r=\"4\" fill=\"var(--ink)\"/><text x=\"198\" y=\"214\" font-size=\"12\" font-weight=\"700\" fill=\"var(--ink)\">t</text><text x=\"196\" y=\"52\" font-size=\"12\" font-weight=\"700\" fill=\"var(--ink)\">r</text></svg>"
}
},
{
"id": "capitao-0070",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "Seu veleiro navega a 000°, 10 nós, em nevoeiro. Na rosa de manobra (anéis de 2 M) o alvo foi plotado em M1 (1400, 037°, 10,0 M), M2 (1406, 037°, 8,8 M) e M3 (1412, 037°, 7,5 M). Às 1412 você guina 90° para boreste (rumo 090°), mantendo 10 nós. Se o alvo mantiver rumo e velocidade, o novo PMA será de:",
"alternativas": [
"0 M: a colisão se mantém.",
"4,5 M.",
"6,0 M.",
"7,5 M.",
"10,0 M."
],
"correta": 2,
"explicacao": "<p>Antes da guinada, DMR 217° e VMR 12,5 nós; logo o alvo anda a 270°, 7,5 nós. Com tr = 10 nós para leste, rm = 17,5 nós para oeste e o alvo, que estava 6,0 M ao norte de R, passa a 6,0 M.</p><ul><li><b>0 M: a colisão se mantém.</b> — A colisão só se manteria sem a guinada; alterar o rumo muda a DMR e, com ela, o PMA.</li><li><b>4,5 M.</b> — É apenas o afastamento a leste do alvo no momento da guinada, e não a distância mínima de passagem.</li><li><b>7,5 M.</b> — É a distância do alvo no instante da guinada, e não o PMA depois dela.</li><li><b>10,0 M.</b> — É a distância da primeira plotagem, sem relação com o PMA após a guinada.</li></ul>",
"referencia": "RIPEAM, Regra 8(b); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, itens 14.4.4 e 14.4.5 (manobra do próprio navio no movimento relativo)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 320 320\" role=\"img\" aria-label=\"Rosa de manobra com anéis de 2 milhas. R no centro e três posições do alvo, todas na marcação 037 graus: M1 às 1400 a 10,0 milhas, M2 às 1406 a 8,8 milhas e M3 às 1412 a 7,5 milhas.\"><rect width=\"320\" height=\"320\" rx=\"8\" fill=\"var(--sea-1)\" stroke=\"var(--sea-3)\"/><line x1=\"160\" y1=\"300\" x2=\"160\" y2=\"20\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"90\" y1=\"281\" x2=\"230\" y2=\"39\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"39\" y1=\"230\" x2=\"281\" y2=\"90\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"20\" y1=\"160\" x2=\"300\" y2=\"160\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"39\" y1=\"90\" x2=\"281\" y2=\"230\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><line x1=\"90\" y1=\"39\" x2=\"230\" y2=\"281\" stroke=\"var(--ink)\" stroke-opacity=\".22\"/><circle cx=\"160\" cy=\"160\" r=\"28\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"143\" font-size=\"11\" fill=\"var(--ink)\">2</text><circle cx=\"160\" cy=\"160\" r=\"56\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"115\" font-size=\"11\" fill=\"var(--ink)\">4</text><circle cx=\"160\" cy=\"160\" r=\"84\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"87\" font-size=\"11\" fill=\"var(--ink)\">6</text><circle cx=\"160\" cy=\"160\" r=\"112\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"59\" font-size=\"11\" fill=\"var(--ink)\">8</text><circle cx=\"160\" cy=\"160\" r=\"140\" fill=\"none\" stroke=\"var(--ink)\" stroke-opacity=\".4\"/><text x=\"164\" y=\"31\" font-size=\"11\" fill=\"var(--ink)\">10</text><text x=\"160\" y=\"14\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">000</text><text x=\"300\" y=\"164\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">090</text><text x=\"160\" y=\"312\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">180</text><text x=\"20\" y=\"164\" font-size=\"11\" text-anchor=\"middle\" fill=\"var(--ink)\">270</text><polyline points=\"244.3,48.2 234.1,61.6 223.2,76.1\" fill=\"none\" stroke=\"var(--ink)\" stroke-dasharray=\"4 3\"/><circle cx=\"244.3\" cy=\"48.2\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"252.3\" y=\"52.2\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M1 1400</text><circle cx=\"234.1\" cy=\"61.6\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"242.1\" y=\"65.6\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M2 1406</text><circle cx=\"223.2\" cy=\"76.1\" r=\"4.5\" fill=\"var(--nav-yellow)\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><text x=\"231.2\" y=\"80.1\" font-size=\"11\" font-weight=\"700\" fill=\"var(--ink)\" stroke=\"var(--sea-1)\" stroke-width=\"3\" paint-order=\"stroke\">M3 1412</text><circle cx=\"160\" cy=\"160\" r=\"4\" fill=\"var(--ink)\"/><text x=\"167\" y=\"176\" font-size=\"12\" font-weight=\"700\" fill=\"var(--ink)\">R</text></svg>"
}
},
{
"id": "capitao-0071",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 1,
"enunciado": "Qual das sequências de três plotagens, a intervalos iguais, indica pela Regra 7(d)(i) do RIPEAM que existe risco de abalroamento?",
"alternativas": [
"Marcações 070°, 078° e 090°, com distâncias de 6,0, 4,5 e 3,0 M.",
"Marcações 070°, 070° e 070°, com distâncias de 3,0, 4,5 e 6,0 M.",
"Marcações 070°, 062° e 048°, com distâncias de 6,0, 4,5 e 3,0 M.",
"Marcações 070°, 070° e 070°, com distâncias de 4,0 M nas três plotagens.",
"Marcações 070°, 070° e 070°, com distâncias de 6,0, 4,5 e 3,0 M."
],
"correta": 4,
"explicacao": "<p>Marcação constante com distância diminuindo: a regra manda presumir risco de abalroamento.</p><ul><li><b>Marcações 070°, 078° e 090°, com distâncias de 6,0, 4,5 e 3,0 M.</b> — A marcação muda de modo apreciável (70°, 78°, 90°); o alvo tende a passar pela popa, e a regra só manda presumir risco quando a marcação não se altera.</li><li><b>Marcações 070°, 070° e 070°, com distâncias de 3,0, 4,5 e 6,0 M.</b> — A marcação é constante, mas o alvo se afasta (a distância aumenta); não há aproximação.</li><li><b>Marcações 070°, 062° e 048°, com distâncias de 6,0, 4,5 e 3,0 M.</b> — A marcação diminui apreciavelmente (70°, 62°, 48°); o alvo tende a passar pela proa, e a regra só manda presumir risco quando a marcação não se altera.</li><li><b>Marcações 070°, 070° e 070°, com distâncias de 4,0 M nas três plotagens.</b> — A marcação é constante, mas a distância não varia: o alvo não se aproxima.</li></ul>",
"referencia": "RIPEAM, Regra 7(d)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0072",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 2,
"enunciado": "Os limites do alarme CPA/TCPA do ARPA estão em CPA = 1,0 M e TCPA = 15 min. O alarme dispara quando o CPA previsto é menor que o limite e o TCPA, ainda por vir, é menor que o limite. Qual alvo dispara o alarme?",
"alternativas": [
"CPA 0,4 M e TCPA 30 min.",
"CPA 2,0 M e TCPA 5 min.",
"CPA 1,2 M e TCPA 12 min.",
"CPA 0,8 M e TCPA 10 min.",
"CPA 0,5 M e TCPA −4 min."
],
"correta": 3,
"explicacao": "<p>CPA 0,8 M é menor que 1,0 M e o TCPA de 10 min é menor que 15 min e positivo: as duas condições estão atendidas.</p><ul><li><b>CPA 0,4 M e TCPA 30 min.</b> — O CPA é menor que o limite, mas faltam 30 minutos, mais que os 15 min configurados.</li><li><b>CPA 2,0 M e TCPA 5 min.</b> — O TCPA é curto, mas o CPA de 2,0 M é maior que o limite de 1,0 M.</li><li><b>CPA 1,2 M e TCPA 12 min.</b> — O TCPA é menor que o limite, mas o CPA de 1,2 M é maior que 1,0 M.</li><li><b>CPA 0,5 M e TCPA −4 min.</b> — TCPA negativo significa que o alvo já passou pelo ponto de maior aproximação e se afasta; não há alarme.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.4.6 (ARPA)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0073",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 1,
"enunciado": "No modo de vetores relativos, o vetor de um alvo aponta exatamente para o centro da tela (seu barco) e o alvo se aproxima. O que isso significa, se ambos mantiverem rumo e velocidade?",
"alternativas": [
"O alvo está em rota de colisão com o seu barco.",
"O alvo tem o mesmo rumo e a mesma velocidade que o seu barco.",
"O alvo vai passar pela sua popa a 1 milha.",
"O alvo se afasta de você com rumo recíproco ao seu.",
"O vetor mostra o rumo verdadeiro do alvo."
],
"correta": 0,
"explicacao": "<p>O vetor relativo mostra o movimento do alvo em relação a você; apontando para o centro, o alvo vai direto até você, isto é, marcação constante e distância diminuindo.</p><ul><li><b>O alvo tem o mesmo rumo e a mesma velocidade que o seu barco.</b> — Com o mesmo rumo e a mesma velocidade, o movimento relativo seria nulo e o alvo ficaria parado na tela, sem vetor.</li><li><b>O alvo vai passar pela sua popa a 1 milha.</b> — Se fosse passar a 1 milha, o vetor relativo apontaria para um ponto afastado do centro, e não para o centro.</li><li><b>O alvo se afasta de você com rumo recíproco ao seu.</b> — O vetor apontando para o centro mostra aproximação, e não afastamento.</li><li><b>O vetor mostra o rumo verdadeiro do alvo.</b> — Esse é o vetor verdadeiro; o vetor relativo mostra o movimento em relação ao seu barco.</li></ul>",
"referencia": "RIPEAM, Regra 7(d)(i); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, itens 14.4.1 (movimento relativo) e 14.4.6 (ARPA)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0074",
"nivel": "capitao",
"tema": "Radar",
"dificuldade": 3,
"enunciado": "O ARPA do seu veleiro opera com vetores verdadeiros estabilizados pela água (velocidade do log). Em um local com corrente de 2 nós e set para o sul (180°), uma boia fundeada aparece com um vetor. Qual?",
"alternativas": [
"2 nós para o norte (000°), em sentido contrário ao set.",
"2 nós para o sul (180°), no mesmo sentido do set da corrente.",
"Vetor nulo, porque a boia está fundeada e parada em relação ao fundo.",
"2 nós para leste (090°), perpendicular ao set da corrente.",
"Um vetor com a velocidade e o rumo do vento verdadeiro."
],
"correta": 0,
"explicacao": "<p>Estabilizado pela água, o vetor de um objeto fixo no fundo é o oposto da corrente: a boia parece se mover 2 nós em relação à água, no sentido contrário ao do set (para o norte).</p><ul><li><b>2 nós para o sul (180°), no mesmo sentido do set da corrente.</b> — Inverteu o sinal: o vetor aponta contra o set, e não a favor dele.</li><li><b>Vetor nulo, porque a boia está fundeada e parada em relação ao fundo.</b> — Isso só ocorre com estabilização pelo fundo (<i>ground stabilized</i>); pela água, o objeto fixo mostra o vetor da corrente invertido.</li><li><b>2 nós para leste (090°), perpendicular ao set da corrente.</b> — O vetor é paralelo à corrente (em sentido oposto), e não perpendicular a ela.</li><li><b>Um vetor com a velocidade e o rumo do vento verdadeiro.</b> — O vento não entra nessa conta; o que desloca o objeto em relação à água é a corrente.</li></ul>",
"referencia": "IMO, Res. A.823(19) (padrões de desempenho de ARPA: vetores estabilizados pela água ou pelo fundo); Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 14, item 14.4.6 (ARPA)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0075",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 2,
"enunciado": "Numa carta na escala 1:1.000.000, a distância medida entre dois pontos é de 4 cm. Qual é a distância real, em milhas náuticas? (1 milha = 1.852 m.)",
"alternativas": [
"4,0 M.",
"21,6 M.",
"40,0 M.",
"74,1 M.",
"216 M."
],
"correta": 1,
"explicacao": "<p>4 cm × 1.000.000 = 4.000.000 cm = 40 km; 40.000 m ÷ 1.852 ≈ 21,6 M.</p><ul><li><b>4,0 M.</b> — Supôs que 1 cm valesse 1 milha; na escala 1:1.000.000, 1 cm vale 10 km, ou cerca de 5,4 milhas.</li><li><b>40,0 M.</b> — Confundiu quilômetros com milhas: 40 é o resultado em km, não em milhas.</li><li><b>74,1 M.</b> — Multiplicou 40 por 1,852 em vez de dividir; 1 milha tem 1.852 m, então 40 km são menos de 40 milhas.</li><li><b>216 M.</b> — Erro de uma casa decimal.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), cap. 2, item 2.6.2 (escala da carta)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0076",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 2,
"enunciado": "Numa carta de Mercator, um veleiro navega a leste ao longo do paralelo de 60°S entre dois pontos que diferem 4° em longitude. Que distância percorre?",
"alternativas": [
"60 milhas.",
"120 milhas.",
"208 milhas.",
"240 milhas.",
"480 milhas."
],
"correta": 1,
"explicacao": "<p>O apartamento é Δλ × cos φ = 240 minutos × cos 60° = 240 × 0,5 = 120 milhas.</p><ul><li><b>60 milhas.</b> — Corresponde a apenas 1° de longitude no equador (60 milhas), e não a 4° a 60° de latitude.</li><li><b>208 milhas.</b> — Usou o seno de 60° (0,866) em vez do cosseno; o cosseno de 60° vale 0,5.</li><li><b>240 milhas.</b> — É a diferença de longitude em minutos (4° = 240’), que só vale como milhas no equador.</li><li><b>480 milhas.</b> — Dobrou a diferença de longitude em minutos, sem justificativa.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II (DHN, 1ª rev. 2021), cap. 33 (derrota loxodrômica: distância ao longo de um paralelo e apartamento)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0077",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 3,
"enunciado": "Um farol tem altitude de 81 m e alcance luminoso de 15 milhas na Lista de Faróis. Um navegante, com o olho a 4 m de altura, procura a luz à noite. Usando D = 1,927 (√H + √h) para o alcance geográfico, a que distância, no máximo, ele avistará a luz?",
"alternativas": [
"10,6 milhas.",
"15,0 milhas.",
"17,3 milhas.",
"21,2 milhas.",
"36,2 milhas."
],
"correta": 1,
"explicacao": "<p>O alcance geográfico é 1,927 × (9 + 2) = 21,2 M, maior que o luminoso. O alcance que vale é o menor dos dois, 15 M (luminoso).</p><ul><li><b>10,6 milhas.</b> — É metade do alcance geográfico (21,2 M ÷ 2); não há razão para tomar a metade.</li><li><b>17,3 milhas.</b> — É 1,927 × √81, que esquece a altura do olho do observador.</li><li><b>21,2 milhas.</b> — É apenas o alcance geográfico (horizonte); além de 15 M a luz é fraca demais para ser vista, mesmo com o horizonte permitindo.</li><li><b>36,2 milhas.</b> — Somou os dois alcances; o limite é o menor deles, e não a soma.</li></ul>",
"referencia": "Lista de Faróis (DH2), 40ª ed., Introdução, item 3.5 (alcances geográfico e luminoso)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois"
},
{
"id": "capitao-0078",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 1,
"enunciado": "Qual publicação da DHN reúne os auxílios radioelétricos à navegação da costa do Brasil e os serviços-rádio, inclusive por satélite, úteis a quem navega no Atlântico Sul?",
"alternativas": [
"Lista de Faróis.",
"Lista de Sinais Cegos.",
"Tábuas das Marés.",
"Lista de Auxílios-Rádio.",
"Roteiro da Costa Leste."
],
"correta": 3,
"explicacao": "<p>A Lista de Auxílios-Rádio reúne os auxílios radioelétricos à navegação da costa do Brasil e os serviços-rádio, inclusive por satélite, úteis no Atlântico Sul.</p><ul><li><b>Lista de Faróis.</b> — Traz faróis, faroletes e boias luminosas, com característica, altitude e alcance, e não os auxílios radioelétricos.</li><li><b>Lista de Sinais Cegos.</b> — Traz boias e balizas sem luz, e não os serviços-rádio.</li><li><b>Tábuas das Marés.</b> — Traz as previsões de maré dos portos e pontos da costa, e não os auxílios radioelétricos.</li><li><b>Roteiro da Costa Leste.</b> — Descreve a costa, os portos e as aterragens, mas não reúne os auxílios radioelétricos.</li></ul>",
"referencia": "Lista de Auxílios-Rádio (DH8-15), 15ª ed., CHM",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-auxilios-radio"
},
{
"id": "capitao-0079",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 1,
"enunciado": "Em qual parte dos Avisos aos Navegantes se encontram os trechos de carta impressos (\"bacalhaus\"), feitos para recortar e colar sobre a carta de papel?",
"alternativas": [
"Seção III.",
"Seção IV.",
"Seção VIII.",
"Folha de Correções avulsa.",
"Carta 12000 (INT 1)."
],
"correta": 2,
"explicacao": "<p>Os trechos de carta para colar (\"bacalhaus\") vêm na Seção VIII dos Avisos aos Navegantes.</p><ul><li><b>Seção III.</b> — A Seção III traz o texto das correções às cartas (Avisos Temporários, Preliminares e Permanentes), e não os trechos para colar.</li><li><b>Seção IV.</b> — A Seção IV traz as correções às publicações, como a Lista de Faróis, e não os trechos de carta.</li><li><b>Folha de Correções avulsa.</b> — As Folhas de Correções acompanham as publicações, quando necessário, e não trazem trechos de carta.</li><li><b>Carta 12000 (INT 1).</b> — A Carta 12000 traz símbolos, abreviaturas e termos das cartas, e não correções.</li></ul>",
"referencia": "CHM, Avisos aos Navegantes (Seções III, IV e VIII)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-aviso-aos-navegantes-tela"
},
{
"id": "capitao-0080",
"nivel": "capitao",
"tema": "Carta e publicações",
"dificuldade": 1,
"enunciado": "Segundo o CHM, o uso das cartas raster gratuitas em um plotter ou programa de visualização:",
"alternativas": [
"Não dispensa o uso concomitante das cartas de papel atualizadas até o último aviso.",
"Dispensa a carta de papel, desde que a raster esteja corrigida até o último Aviso permanente.",
"Dispensa a carta de papel, desde que o veleiro leve dois aparelhos GNSS a bordo.",
"Só pode ser usado se o programa for um ECDIS certificado, e não um plotter de recreio.",
"Exige configurar o datum do GPS em SAD-69, para que a posição case com a carta."
],
"correta": 0,
"explicacao": "<p>O CHM afirma que o uso das cartas raster não dispensa o uso concomitante das cartas em papel atualizadas até o último Aviso aos Navegantes; recomenda-se o datum WGS-84 no GPS e no programa.</p><ul><li><b>Dispensa a carta de papel, desde que a raster esteja corrigida até o último Aviso permanente.</b> — Mesmo atualizada, a carta raster não dispensa as cartas de papel atualizadas, segundo o CHM.</li><li><b>Dispensa a carta de papel, desde que o veleiro leve dois aparelhos GNSS a bordo.</b> — A quantidade de GNSS nada tem a ver com a dispensa das cartas de papel.</li><li><b>Só pode ser usado se o programa for um ECDIS certificado, e não um plotter de recreio.</b> — A orientação do CHM sobre as cartas raster não condiciona o uso a um ECDIS certificado; a ressalva sobre o papel vale para qualquer programa de visualização.</li><li><b>Exige configurar o datum do GPS em SAD-69, para que a posição case com a carta.</b> — O CHM recomenda o datum WGS-84 no GPS e no programa de visualização.</li></ul>",
"referencia": "CHM, página Cartas Náuticas (cartas raster); Carta 12000 (INT 1)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas"
},
{
"id": "capitao-0081",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Um veleiro tem KB = 0,80 m, BM = 1,55 m e KG = 1,35 m (alturas medidas a partir da quilha, ponto K). Qual é a altura metacêntrica GM?",
"alternativas": [
"0,20 m.",
"0,55 m.",
"1,00 m.",
"1,55 m.",
"3,70 m."
],
"correta": 2,
"explicacao": "<ul><li>A) Calculou BM − KG (1,55 − 1,35), esquecendo o KB.</li><li>B) Calculou KG − KB (1,35 − 0,80), que não tem significado de estabilidade.</li><li><b>C) Correta.</b> KM = KB + BM = 0,80 + 1,55 = 2,35 m; GM = KM − KG = 2,35 − 1,35 = 1,00 m.</li><li>D) Calculou KM − KB, que dá o próprio BM, e não o GM.</li><li>E) Somou o KG ao KM em vez de subtrair (2,35 + 1,35).</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (GM = KM − KG; KM = KB + BM)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0082",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Para ganhar espaço, o comandante passa um bote inflável com motor de popa (cerca de 80 kg) do paiol, no fundo do casco, para o teto da cabine. O peso total do barco não muda. O que acontece com a estabilidade?",
"alternativas": [
"O centro de gravidade G sobe e o GM diminui, deixando o barco menos estável.",
"O centro de gravidade G desce e o GM aumenta, porque o peso fica mais perto das velas.",
"Nada muda, porque o deslocamento continua o mesmo e só ele define a estabilidade.",
"O centro de carena B sobe junto com o bote e compensa a mudança do G.",
"O GM aumenta, porque um peso alto cria um braço de alavanca maior para endireitar o barco."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> Mudar um peso para cima eleva o KG; com o KM praticamente igual, GM = KM − KG diminui e o momento de endireitamento fica menor.</li><li>B) O peso foi para cima, e não para baixo; G sobe. A proximidade das velas é irrelevante para a posição de G.</li><li>C) O deslocamento é o mesmo, mas a altura do peso muda o KG e, com ele, o GM.</li><li>D) B depende só da forma do volume imerso; o bote em cima da cabine não altera B.</li><li>E) Um peso alto não ajuda a endireitar o barco: quando ele inclina, o peso alto acompanha o movimento e reduz o GZ.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (efeito de pesos altos)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0083",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Um veleiro tem GM = 0 (o metacentro M coincide com o centro de gravidade G). Considerando só pequenas inclinações, como se classifica o equilíbrio do barco na posição direita?",
"alternativas": [
"Estável: o barco sempre volta à posição direita, embora lentamente.",
"Instável: G está acima de M e a inclinação tende a aumentar.",
"Estável, com GZ máximo logo nos primeiros graus de inclinação.",
"Indiferente: não há braço de endireitamento; o barco fica onde for deixado.",
"Inexistente: com GM nulo o barco emborca no mesmo instante, sem aviso prévio."
],
"correta": 3,
"explicacao": "<ul><li>A) Para voltar à posição direita é preciso GM positivo (M acima de G).</li><li>B) Equilíbrio instável é de GM negativo (G acima de M); aqui G e M coincidem.</li><li>C) Com GM nulo o GZ inicial é praticamente nulo, e não máximo.</li><li><b>D) Correta.</b> Com GM = 0 o GZ é nulo para pequenas inclinações: não há momento que devolva nem que aumente a inclinação, e o equilíbrio é indiferente. Em ângulos maiores a forma do casco pode voltar a gerar GZ, mas isso não muda a resposta para pequenas inclinações.</li><li>E) O barco não emborca no mesmo instante; ele apenas não tem tendência de retorno para pequenas inclinações, e qualquer perturbação o leva para mais longe.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 a) III) (condições de equilíbrio); USNA, EN400, cap. 4",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0084",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Qual das situações abaixo é um caso típico de efeito de superfície livre?",
"alternativas": [
"Tanque de combustível totalmente cheio, com a tampa fechada.",
"Lastro de chumbo fixado na quilha, bem no fundo do casco.",
"Galões de água fechados e peiados no fundo do paiol de proa.",
"Tanque de água completamente vazio, limpo e seco, sem nenhum líquido.",
"Água solta na sentina, correndo de bordo a bordo ao inclinar."
],
"correta": 4,
"explicacao": "<ul><li>A) Tanque cheio não tem superfície livre; o líquido se comporta como peso fixo.</li><li>B) O lastro é sólido e fixo: não se desloca com a inclinação.</li><li>C) Recipientes fechados e peiados não deixam o líquido correr de bordo a bordo.</li><li>D) Tanque vazio não contém líquido que possa se deslocar.</li><li><b>E) Correta.</b> O efeito de superfície livre aparece quando um líquido tem uma superfície livre para se deslocar: o líquido corre para o bordo baixo, o G efetivo sobe e o GM efetivo diminui.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (item 1.4 b) II: efeito de superfície livre)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0085",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Para reduzir o efeito de superfície livre durante uma travessia, a prática recomendada é manter os tanques de água e combustível:",
"alternativas": [
"Completamente cheios ou completamente vazios, consumindo um tanque de cada vez até esvaziá-lo.",
"Todos pela metade, para que o peso fique bem distribuído pelo barco.",
"Com o mesmo nível nos dois bordos, consumindo um pouco de cada tanque por dia.",
"Com os tanques centrais pela metade e os laterais vazios, para ficarem como contrapeso.",
"Parcialmente cheios, transferindo líquido de um tanque para outro com frequência para corrigir a banda."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> Tanque cheio ou vazio não tem superfície livre. Esvaziar um tanque por vez deixa só um tanque parcial a cada momento, o que limita a perda de GM.</li><li>B) Tanques pela metade são justamente o pior caso: todos têm superfície livre ao mesmo tempo.</li><li>C) Consumir um pouco de cada deixa vários tanques parciais, somando as superfícies livres.</li><li>D) Tanque meio cheio, central ou não, tem superfície livre, e a largura grande aumenta o efeito.</li><li>E) A transferência no mar deixa dois tanques semicheios no meio do processo e aumenta o problema.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 b) II); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0086",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 1,
"enunciado": "Um veleiro, amarrado em águas calmas, sem vento e sem ondas, permanece inclinado 4° para boreste. O GM medido é positivo e normal. Qual é a causa mais provável dessa banda permanente?",
"alternativas": [
"GM negativo, que leva o barco a um ângulo de loll, mesmo sem vento.",
"Efeito de superfície livre de um tanque cheio e fechado.",
"Valor exagerado de BM, causado pela boca larga do casco.",
"Pressão do vento sobre o mastro e o enrolador de gênova.",
"Pesos mal estivados ou tanques consumidos de um bordo só."
],
"correta": 4,
"explicacao": "<ul><li>A) O enunciado diz que o GM é positivo; o loll só ocorre com GM negativo.</li><li>B) Tanque totalmente cheio não tem superfície livre.</li><li>C) Um BM grande aumenta o GM; não inclina o barco para um bordo.</li><li>D) O enunciado diz que não há vento.</li><li><b>E) Correta.</b> Pesos ou consumo desiguais tiram o G da linha de centro. Com GM positivo, o barco só fica inclinado se G estiver fora do plano de simetria: o barco inclina até G e B ficarem na mesma vertical. É o caso típico de pesos mal distribuídos ou de tanques consumidos de um bordo só.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 b) I) (causas da banda permanente); USNA, EN400, cap. 4",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0087",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Em mau tempo, uma onda quebra no cockpit e entra bastante água no interior do veleiro, espalhando-se pelo piso da cabine. Quais são os dois efeitos principais sobre a estabilidade?",
"alternativas": [
"A água é peso baixo, que sempre abaixa o G e aumenta o GM, e a superfície livre é desprezível em piso largo.",
"A água é peso que reduz a borda-livre e, solta no piso, cria superfície livre que baixa o GM efetivo.",
"A água aumenta a borda-livre, porque o barco fica mais pesado, e a superfície livre amortece o balanço do barco.",
"A água só altera o calado, sem influência no GM nem no GZ, desde que o barco continue a boiar.",
"A água desloca o centro de carena B para cima e por isso o barco fica mais firme no mar."
],
"correta": 1,
"explicacao": "<ul><li>A) Ignora que a superfície livre é maior quanto mais larga é a poça, e que o peso reduz a borda-livre.</li><li><b>B) Correta.</b> A água embarcada soma peso, afunda o barco, diminui a borda-livre e antecipa o alagamento; solta no piso, tem superfície livre larga, que reduz o GM efetivo.</li><li>C) Mais peso significa menos borda-livre, e não mais; e a superfície livre piora a estabilidade.</li><li>D) O peso adicional e a superfície livre alteram o GM e o GZ; o calado é só uma das consequências.</li><li>E) Afundar um pouco mais muda pouco o B, e isso não compensa a perda de GM pela superfície livre e pelo peso adicionado; o barco fica mais mole, e não mais firme.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 b) III) (embarque de água do mar e água aberta); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0088",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Um veleiro de 5.000 kg tem GM = 0,8 m. Um peso de 200 kg é deslocado 2,0 m na transversal, de um bordo ao outro. Pela fórmula tan θ = (w × d) ÷ (Δ × GM), qual é a banda resultante, aproximadamente?",
"alternativas": [
"tan θ = 0,05, ou cerca de 2,9°.",
"tan θ = 0,08, ou cerca de 4,6°.",
"tan θ = 0,10, ou cerca de 5,7°.",
"tan θ = 0,20, ou cerca de 11,3°.",
"tan θ = 0,40, ou cerca de 21,8°."
],
"correta": 2,
"explicacao": "<ul><li>A) Resulta de usar um braço de apenas 1,0 m, metade do deslocamento do peso.</li><li>B) Resulta de esquecer o GM (400 ÷ 5.000).</li><li><b>C) Correta.</b> w × d = 200 × 2,0 = 400 kg·m; Δ × GM = 5.000 × 0,8 = 4.000 kg·m; tan θ = 400 ÷ 4.000 = 0,10, e θ ≈ 5,7°.</li><li>D) Resulta de usar um deslocamento de 2.500 kg, a metade do correto.</li><li>E) Resulta de um deslocamento de 1.250 kg, muito abaixo dos 5.000 kg do barco.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4, item 4.6 (banda por peso deslocado)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0089",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Um veleiro de 5.000 kg, com GM = 0,8 m, está com banda permanente de tan θ = 0,06 (cerca de 3,4°), causada por pesos mal estivados. Para desfazê-la, o comandante quer transferir 120 kg de um bordo para o outro. Qual deslocamento transversal desse peso é necessário?",
"alternativas": [
"1,0 m.",
"2,0 m.",
"2,5 m.",
"3,0 m.",
"4,0 m."
],
"correta": 1,
"explicacao": "<ul><li>A) Corresponde a só metade do momento necessário (120 kg·m).</li><li><b>B) Correta.</b> O momento necessário é Δ × GM × tan θ = 5.000 × 0,8 × 0,06 = 240 kg·m. Com 120 kg, d = 240 ÷ 120 = 2,0 m.</li><li>C) Resulta de esquecer o GM (5.000 × 0,06 = 300 kg·m; 300 ÷ 120).</li><li>D) Corresponde a 360 kg·m, que daria tan θ = 0,09.</li><li>E) Corresponde ao dobro do momento necessário (480 kg·m).</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4, item 4.6 (correção da banda permanente)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0090",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Num veleiro de 10.000 kg com GM = 0,70 m, o banco de baterias de 400 kg está no alto da cabine, a 3,0 m da quilha. O comandante o transfere para o fundo do paiol, a 0,5 m da quilha. Supondo o KM constante, o novo GM será de aproximadamente:",
"alternativas": [
"0,60 m.",
"0,72 m.",
"0,80 m.",
"0,82 m.",
"1,70 m."
],
"correta": 2,
"explicacao": "<ul><li>A) Subtraiu 0,10 m do GM; descer um peso baixa o G e aumenta o GM.</li><li>B) Usou só a altura final (400 × 0,5 ÷ 10.000 = 0,02 m).</li><li><b>C) Correta.</b> Descer o peso de 3,0 m para 0,5 m baixa o G em w × d ÷ Δ = 400 × 2,5 ÷ 10.000 = 0,10 m. Como GM = KM − KG, o GM sobe de 0,70 para 0,80 m.</li><li>D) Usou só a altura inicial (400 × 3,0 ÷ 10.000 = 0,12 m) e não o deslocamento vertical de 2,5 m.</li><li>E) Dividiu por 1.000 em vez de 10.000, achando que o G desceria 1,0 m.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (efeito de pesos altos e baixos)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0091",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Um veleiro de 9.000 kg tem KG = 1,40 m e KM = 2,30 m. Antes de uma travessia, o comandante embarca 1.000 kg de equipamentos cujo centro de peso fica a 4,4 m da quilha. Supondo o KM constante, qual será o novo KG e o novo GM?",
"alternativas": [
"KG = 1,40 m e GM = 0,90 m.",
"KG = 1,70 m e GM = 0,60 m.",
"KG = 1,84 m e GM = 0,46 m.",
"KG = 1,89 m e GM = 0,41 m.",
"KG = 2,90 m e GM = −0,60 m."
],
"correta": 1,
"explicacao": "<ul><li>A) Ignorou o novo peso: o KG sobe quando se embarca um peso acima do G.</li><li><b>B) Correta.</b> KG novo = (9.000 × 1,40 + 1.000 × 4,4) ÷ 10.000 = (12.600 + 4.400) ÷ 10.000 = 1,70 m. GM novo = 2,30 − 1,70 = 0,60 m (o GM caiu de 0,90 para 0,60 m).</li><li>C) Somou ao KG todo o momento do peso novo (4.400 ÷ 10.000 = 0,44 m), sem diluir o KG original.</li><li>D) Dividiu os momentos por 9.000 kg, esquecendo que o deslocamento passou a 10.000 kg.</li><li>E) Fez a média simples entre 1,40 e 4,40, sem ponderar pelas massas.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (alteração do projeto: KG novo = soma dos momentos ÷ deslocamento)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0092",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Dois veleiros de mesmo tamanho e forma diferem só no GM: o A tem GM = 1,6 m e o B tem GM = 0,4 m. Sabendo que o período de balanço T é proporcional a 1/√GM, o período de B em relação ao de A é aproximadamente:",
"alternativas": [
"O dobro: B balança mais devagar (mole) e A mais depressa (duro).",
"Um quarto, porque o período varia com o quadrado do GM.",
"A metade, porque um GM menor torna o balanço mais rápido.",
"Igual nos dois, pois o período depende só do comprimento do casco.",
"Quatro vezes maior, porque o GM de B é quatro vezes menor."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> A relação entre os GM é 1,6 ÷ 0,4 = 4. Como T ∝ 1/√GM, T de B ÷ T de A = √4 = 2: o período de B é o dobro.</li><li>B) T não varia com o quadrado do GM, e sim com o inverso da sua raiz.</li><li>C) Inverteu a relação: GM menor dá período maior, e não menor.</li><li>D) O período depende do GM e do raio de giração, e não só do comprimento.</li><li>E) Esqueceu a raiz quadrada: T não é proporcional a 1/GM.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 a) II) (altura metacêntrica); Rawson e Tupper, Basic Ship Theory (período de balanço); USNA, EN400, cap. 4 (barco mole e barco duro)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0093",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Em uma prova de inclinação em águas calmas, um veleiro de 8.000 kg recebe um peso de 100 kg deslocado 4,0 m de um bordo ao outro, e a banda medida é de tan θ = 0,05. Qual é o GM do barco, por GM = (w × d) ÷ (Δ × tan θ)?",
"alternativas": [
"0,25 m.",
"0,5 m.",
"1,0 m.",
"2,0 m.",
"4,0 m."
],
"correta": 2,
"explicacao": "<ul><li>A) Resulta de usar um deslocamento transversal de apenas 1,0 m (100 ÷ 400).</li><li>B) Resulta de usar um deslocamento transversal de apenas 2,0 m (200 ÷ 400).</li><li><b>C) Correta.</b> w × d = 100 × 4,0 = 400 kg·m. Δ × tan θ = 8.000 × 0,05 = 400. GM = 400 ÷ 400 = 1,0 m.</li><li>D) Resulta de usar um peso de 200 kg em vez de 100 kg (800 ÷ 400).</li><li>E) Resulta de usar um peso de 400 kg em vez de 100 kg (1.600 ÷ 400).</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); Rawson e Tupper, Basic Ship Theory (prova de inclinação); USNA, EN400, cap. 4, item 4.6 (deslocamento transversal de peso)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0094",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Um veleiro tem GM = 0,80 m. Para pequenas inclinações vale GZ ≈ GM × sen φ. Com banda de 10° (sen 10° ≈ 0,174), o braço de endireitamento GZ é aproximadamente:",
"alternativas": [
"0,014 m.",
"0,14 m.",
"0,79 m.",
"4,6 m.",
"8,0 m."
],
"correta": 1,
"explicacao": "<ul><li>A) Errou a casa decimal: o produto 0,80 × 0,174 dá 0,14, e não 0,014.</li><li><b>B) Correta.</b> GZ ≈ 0,80 × 0,174 ≈ 0,14 m.</li><li>C) Usou o cosseno (0,985) em vez do seno.</li><li>D) Dividiu o GM pelo seno (0,80 ÷ 0,174).</li><li>E) Multiplicou o GM pelo ângulo em graus (0,80 × 10), sem usar o seno.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (GZ e altura metacêntrica)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0095",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 2,
"enunciado": "Na curva de estabilidade estática de um veleiro, o ângulo de estabilidade nula (limite de estabilidade) é aquele em que:",
"alternativas": [
"O GZ atinge o seu valor máximo, no ponto mais alto da curva de estabilidade.",
"O convés entra na água, e o barco começa a receber água pelo costado.",
"Uma abertura sem fechamento estanque passa a ficar submersa e alagar o barco.",
"O GZ volta a zero, e além dele o barco tende a emborcar.",
"O GM se anula, e o barco fica em equilíbrio indiferente em qualquer ângulo."
],
"correta": 3,
"explicacao": "<ul><li>A) O GZ máximo é o pico da curva, bem antes do ângulo de estabilidade nula.</li><li>B) A entrada do convés na água marca o início da perda de forma, mas não o GZ zero.</li><li>C) O ângulo de alagamento é aquele em que as aberturas alagam; é outro ponto da curva.</li><li><b>D) Correta.</b> A curva de GZ cresce, passa por um máximo e depois cai até zero. O ângulo em que ele cruza o zero é o limite de estabilidade; depois dele o binário ajuda a emborcar.</li><li>E) O GM é a inclinação da curva na origem e não está ligado ao ângulo de estabilidade nula.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (curva de GZ); Miguens, vol. III, cap. 42",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0096",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 3,
"enunciado": "Um veleiro de quilha, com tanques de combustível e de água semicheios e vários galões de combustível no convés, balança lentamente de um bordo ao outro, parando a cerca de 15° de cada lado, mesmo sem vento. O que isso indica e qual é a primeira providência?",
"alternativas": [
"GM negativo (loll): baixar o G, tirando superfícies livres e pesos altos.",
"GM positivo, com banda permanente; transferir pesos de bordo rapidamente para o bordo alto.",
"GM negativo; encher primeiro o tanque do bordo alto, para corrigir a banda de uma vez.",
"GM excessivo (barco duro); retirar lastro do fundo, para amaciar o balanço do barco.",
"Efeito de rajadas de vento; rizar a vela e manter os tanques como estão, sem mexer."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> O barco que balança entre dois lados com o mesmo ângulo está em loll: G acima de M. A causa é G alto e superfície livre. A primeira providência é baixar o G; só depois se trata do lado, com cuidado.</li><li>B) Na banda permanente o barco fica em um só bordo; transferir peso de repente para o bordo alto pode virá-lo de uma vez para o outro lado.</li><li>C) Encher o tanque do bordo alto antes do baixo pode lançar o barco ao outro bordo com ângulo maior.</li><li>D) Retirar lastro eleva o G e piora o GM; um barco duro tem GM alto, o que não é o caso.</li><li>E) O enunciado diz que não há vento; o problema é de estabilidade, não de pano.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 a) III) e b) I); USNA, EN400 Principles of Ship Performance, cap. 4, item 4.9.4.1 (loll: lastrar baixo para baixar o G)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0097",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 3,
"enunciado": "Para um casco de costado reto, o ângulo de loll é dado por tan²θ = −2 × GM ÷ BM. Um veleiro tem GM = −0,10 m e BM = 1,50 m. O ângulo de loll é de aproximadamente:",
"alternativas": [
"4°.",
"8°.",
"15°.",
"20°.",
"80°."
],
"correta": 3,
"explicacao": "<ul><li>A) Usou 0,10 ÷ 1,50 = 0,067 como tan θ, sem o fator 2 e sem a raiz (θ ≈ 3,8°).</li><li>B) Usou tan θ = 0,133 sem extrair a raiz quadrada (tan 7,6° ≈ 0,133).</li><li>C) Esqueceu o fator 2: tan²θ = 0,0667, tan θ = 0,258 e θ ≈ 14,5°.</li><li><b>D) Correta.</b> tan²θ = 2 × 0,10 ÷ 1,50 = 0,133; tan θ = 0,365; θ ≈ 20°.</li><li>E) Inverteu GM e BM (2 × 1,50 ÷ 0,10 = 30), o que levaria o barco a quase 80°.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 a) III); Rawson e Tupper, Basic Ship Theory (ângulo de loll, casco de costado reto); USNA, EN400, cap. 4, item 4.9.4.1",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0098",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 3,
"enunciado": "Um tanque retangular largo de água doce tem 3,0 m de comprimento e 2,0 m de largura, está parcialmente cheio e pertence a um veleiro de 8.000 kg com GM = 0,90 m. Use i = l × b³ ÷ 12 e FSC = ρ × i ÷ Δ (ρ = 1.000 kg/m³). Qual é o GM efetivo, com a correção de superfície livre?",
"alternativas": [
"0,15 m.",
"0,40 m.",
"0,65 m.",
"0,84 m.",
"1,15 m."
],
"correta": 2,
"explicacao": "<ul><li>A) Usou i = l × b³ ÷ 4 (6,0 m⁴), com FSC = 0,75 m.</li><li>B) Usou i = l × b³ ÷ 6 (4,0 m⁴), com FSC = 0,50 m.</li><li><b>C) Correta.</b> i = 3,0 × 2,0³ ÷ 12 = 2,0 m⁴. FSC = 1.000 × 2,0 ÷ 8.000 = 0,25 m. GM efetivo = 0,90 − 0,25 = 0,65 m.</li><li>D) Usou i = l × b ÷ 12 (0,5 m⁴), esquecendo que a largura entra ao cubo.</li><li>E) Somou o FSC ao GM, quando a superfície livre diminui o GM efetivo.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (superfície livre: GM efetivo = GM − FSC)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0099",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 3,
"enunciado": "Um tanque retangular largo recebe um anteparo longitudinal exatamente no meio, dividindo-o em dois tanques iguais. Com o mesmo líquido e o mesmo nível, o efeito de superfície livre (FSC) total do conjunto, em relação ao tanque sem anteparo, passa a ser:",
"alternativas": [
"Um oitavo do original.",
"Um quarto do original.",
"A metade do original.",
"O mesmo do original.",
"O dobro do original."
],
"correta": 1,
"explicacao": "<ul><li>A) Um oitavo é o valor de um único compartimento; há dois.</li><li><b>B) Correta.</b> O momento de inércia da superfície é i = l × b³ ÷ 12. Cada metade tem largura b÷2, logo i = l × (b÷2)³ ÷ 12 = (1/8) do original; as duas somadas dão 2 × 1/8 = 1/4.</li><li>C) Daria a metade se i variasse com o quadrado da largura (2 × 1/4); mas ele varia com o cubo, e o resultado é 1/4.</li><li>D) O anteparo longitudinal é justamente usado para reduzir a superfície livre.</li><li>E) Dividir o tanque não aumenta a superfície livre.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (superfície livre: precauções e correções)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0100",
"nivel": "capitao",
"tema": "Estabilidade",
"dificuldade": 3,
"enunciado": "Dois cascos de mesmo volume deslocado diferem só na boca: o segundo tem 10% mais boca que o primeiro. Sabendo que BM = I ÷ V e que o momento de inércia I cresce com a boca ao cubo, o BM do segundo casco é maior que o do primeiro em aproximadamente:",
"alternativas": [
"10%.",
"21%.",
"33%.",
"46%.",
"50%."
],
"correta": 2,
"explicacao": "<ul><li>A) Seria o caso se BM variasse linearmente com a boca.</li><li>B) 1,1² = 1,21: usou o quadrado da boca, e não o cubo.</li><li><b>C) Correta.</b> I cresce com a boca ao cubo: 1,1³ = 1,331, ou seja, cerca de 33% mais. O volume V é o mesmo, então BM cresce na mesma proporção.</li><li>D) 1,1⁴ = 1,46: usou a quarta potência.</li><li>E) 50% não vem de nenhuma relação física do problema: com I proporcional ao cubo da boca, o aumento é de 1,1³ = 1,331.</li></ul>",
"referencia": "NORMAM-211/DPC, Anexo 5-A, item 1.4 (Estabilidade); USNA, EN400 Principles of Ship Performance, cap. 4 (BM = I ÷ V)",
"fonte_url": "https://usna.edu/NAOE/_files/documents/Courses/EN400/02.04%20Chapter%204.pdf"
},
{
"id": "capitao-0101",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Segundo a orientação tradicional de sobrevivência em balsa (a que costuma ser cobrada nas provas), qual é a conduta quanto à água nas primeiras 24 horas para sobreviventes sem ferimentos?",
"alternativas": [
"Não distribuir água: a reserva do corpo basta nesse período.",
"Distribuir um litro por pessoa, para repor a água perdida no abandono.",
"Distribuir meio litro por pessoa logo na primeira hora, antes que o enjoo comece.",
"Dar água do mar diluída em água doce, para fazer a ração durar mais.",
"Dar água só para quem vomitar, já que os demais não perderam líquido."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> A orientação tradicional é guardar a água nas primeiras 24 h (exceto para feridos e doentes) e depois racionar cerca de meio litro por pessoa por dia, em pequenos goles. A água dura mais se ninguém vomita ou transpira.</li><li>B) Um litro no primeiro dia gasta a reserva sem necessidade.</li><li>C) Beber logo no início desperdiça água, pois quem enjoa vomita o que bebeu.</li><li>D) Água do mar nunca deve ser bebida, nem diluída: o sal desidrata.</li><li>E) Quem vomita perde ainda mais água; dar-lhe água logo só agrava o desperdício.</li></ul>",
"referencia": "Orientação tradicional de sobrevivência no mar (ver Rezende, Sobrevivência no Mar, bibliografia do Anexo 5-A, item 1.9 f, da NORMAM-211); IMO, Res. A.657(16), Parte B, item 15 (decidir as rações de água e comida). Fontes modernas pedem avaliar cada caso.",
"fonte_url": "https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.657(16).pdf"
},
{
"id": "capitao-0102",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Qual é a principal função da âncora flutuante (âncora de mar) de uma balsa salva-vidas?",
"alternativas": [
"Prender a balsa ao fundo, para que ela não se afaste da posição do naufrágio.",
"Fazer a balsa navegar contra o vento até a terra mais próxima.",
"Manter a balsa ligada ao barco que está afundando.",
"Encher de ar os bolsões de lastro da balsa.",
"Reduzir a deriva e manter a balsa mais estável ao mar."
],
"correta": 4,
"explicacao": "<ul><li>A) Em águas profundas ela não toca o fundo; só freia a deriva.</li><li>B) A balsa não navega contra o vento; a âncora de mar só reduz a velocidade da deriva.</li><li>C) Quem liga a balsa ao barco é a boça, que deve ser cortada se o barco estiver afundando.</li><li>D) Os bolsões de lastro enchem-se de água, e não de ar, e o fazem sozinhos.</li><li><b>E) Correta.</b> A âncora flutuante é um cone de lona lançado na água na ponta de um cabo: freia a deriva e ajuda a manter a balsa de proa para o mar, o que reduz o balanço e o risco de emborcar.</li></ul>",
"referencia": "IMO, Res. A.657(16), Parte A, item 3 (lançar a âncora flutuante ao se afastar do navio)",
"fonte_url": "https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.657(16).pdf"
},
{
"id": "capitao-0103",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Para que serve o fundo duplo inflável de uma balsa salva-vidas?",
"alternativas": [
"Aumentar a flutuação das câmaras que formam o aro.",
"Guardar a ração e a água da palamenta.",
"Substituir os bolsões de lastro como elemento de estabilidade.",
"Isolar os ocupantes do frio da água do mar.",
"Fornecer ar de reserva para respiração dentro da balsa."
],
"correta": 3,
"explicacao": "<ul><li>A) A flutuação é dada pelas câmaras do aro, e não pelo fundo.</li><li>B) A ração e a água ficam na palamenta, em bolsas ou recipientes próprios.</li><li>C) A estabilidade contra o emborcamento vem dos bolsões de lastro.</li><li><b>D) Correta.</b> O fundo duplo cria uma camada de ar entre a água fria e o piso. Deve ser inflado e mantido seco para reduzir a perda de calor por condução.</li><li>E) O ar do fundo duplo não é próprio para respirar; a ventilação é feita pelas entradas do toldo.</li></ul>",
"referencia": "IMO, Res. A.657(16), Parte B, item 5 (secar e inflar o piso da balsa); IMO, Código LSA, cap. IV (piso da balsa com isolamento contra o frio)",
"fonte_url": "https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.657(16).pdf"
},
{
"id": "capitao-0104",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Hipotermia é a condição em que:",
"alternativas": [
"A temperatura central cai abaixo de 35 °C e o organismo funciona mal.",
"A temperatura da pele cai abaixo de 35 °C, enquanto o núcleo do corpo continua normal.",
"A temperatura central do corpo cai abaixo de 37 °C, que é a temperatura normal.",
"A temperatura central sobe acima de 39 °C por exposição ao sol.",
"A temperatura da água cai abaixo de 20 °C."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> Hipotermia é a queda da temperatura central do corpo abaixo de cerca de 35 °C; aparecem tremores, perda de coordenação, confusão e, nos casos graves, perda de consciência.</li><li>B) A pele esfria muito antes do núcleo do corpo; o critério é a temperatura central.</li><li>C) A temperatura normal do corpo é de cerca de 36 a 37 °C; a hipotermia só começa abaixo de 35 °C.</li><li>D) A temperatura central elevada pelo calor é hipertermia (a insolação grave passa de cerca de 40 °C).</li><li>E) A temperatura da água é fator de risco, mas não define a hipotermia.</li></ul>",
"referencia": "FICR/GFARC, Diretrizes Internacionais de Primeiros Socorros 2025 (hipotermia); National Center for Cold Water Safety, Hypothermia (temperatura central abaixo de 35 °C)",
"fonte_url": "https://www.coldwatersafety.org/hypothermia"
},
{
"id": "capitao-0105",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Um tripulante sozinho na água fria, com colete salva-vidas, aguarda o resgate. Qual posição ajuda a retardar a perda de calor?",
"alternativas": [
"Nadar sem parar, para produzir calor pelo exercício.",
"Boiar de costas com braços e pernas abertos, para ficar visível.",
"Tirar a roupa pesada, para nadar com mais facilidade.",
"A posição HELP: joelhos ao peito, braços junto ao corpo e pouco movimento.",
"Ficar na vertical, batendo as pernas, com a cabeça bem fora da água."
],
"correta": 3,
"explicacao": "<ul><li>A) Nadar em água fria acelera a perda de calor, porque a água em movimento retira mais calor do corpo.</li><li>B) Braços e pernas abertos expõem justamente as áreas de maior perda.</li><li>C) A roupa retém algum calor mesmo molhada; tirá-la só aumenta a perda.</li><li><b>D) Correta.</b> Na posição HELP (Heat Escape Lessening Posture) protegem-se as áreas de maior perda de calor, como o tórax, a virilha e as laterais do corpo, e gasta-se pouca energia.</li><li>E) Bater as pernas gasta energia e aumenta a perda de calor.</li></ul>",
"referencia": "Royal Life Saving Society Australia, Risks of cold water: how to stay safe (posição HELP: joelhos ao peito, braços junto ao corpo, mínimo de movimento, com colete)",
"fonte_url": "https://www.royallifesaving.com.au/stay-safe-active/risk-factors/risks-of-cold-water/how-to-stay-safe"
},
{
"id": "capitao-0106",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 1,
"enunciado": "Pela NORMAM-211, na navegação oceânica, a embarcação de esporte e recreio deve ter balsas salva-vidas infláveis para:",
"alternativas": [
"50% das pessoas a bordo, desde que a outra metade caiba no bote.",
"100% das pessoas a bordo, mas obrigatoriamente de classe I (SOLAS).",
"100% das pessoas a bordo, podendo ser de classe II.",
"Apenas as pessoas que não tenham coletes de classe I.",
"Número igual ao de coletes, mais 10% de reserva."
],
"correta": 2,
"explicacao": "<ul><li>A) Metade da lotação não atende à norma: a capacidade deve cobrir todos.</li><li>B) A norma admite a classe II; a classe I não é exigida.</li><li><b>C) Correta.</b> Na navegação oceânica a norma exige balsa(s) inflável(is) com capacidade para toda a lotação, e aceita balsas de classe II.</li><li>D) Os coletes não substituem a balsa, e todos a bordo precisam ter lugar nela.</li><li>E) A exigência é de capacidade para 100% das pessoas, e não de uma reserva percentual.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.13",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0107",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Qual conjunto descreve corretamente a EPIRB exigida pela NORMAM-211?",
"alternativas": [
"Transmite em 121,5 MHz via satélite, tem código iniciado por 710 e é cadastrada no INFOSAR.",
"Transmite em 406 MHz via satélite, tem código iniciado por 701 e é cadastrada no INFOSAR.",
"Transmite em 406 MHz via satélite, tem código iniciado por 710, mas dispensa qualquer cadastro oficial.",
"Transmite em VHF, no canal 16, sem satélite, e é cadastrada no INFOSAR.",
"Transmite em 406 MHz via satélite, tem código único iniciado por 710 e é cadastrada no INFOSAR."
],
"correta": 4,
"explicacao": "<ul><li>A) O sistema Cospas-Sarsat não processa mais 121,5 MHz desde fevereiro de 2009.</li><li>B) O prefixo 710 é o do Brasil; o 701 é de outro país.</li><li>C) O cadastro no INFOSAR é obrigatório; ele permite à busca e salvamento identificar o barco e os contatos.</li><li>D) A EPIRB é uma radiobaliza de satélite, e não um rádio VHF.</li><li><b>E) Correta.</b> A norma exige a EPIRB de 406 MHz via satélite, com código de identificação (MMSI) iniciado por 710 e cadastrada no INFOSAR, serviço do DECEA.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6, alíneas c), d) e e)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0108",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Como um SART ativado aparece na tela do radar de um navio de resgate, e em que banda ele opera?",
"alternativas": [
"Opera em 9 GHz e aparece como uma linha de doze pontos a partir do SART.",
"Opera em 3 GHz (banda S) e aparece como uma linha de doze pontos a partir da sua posição.",
"Opera em 9 GHz e aparece como um único eco fixo, igual ao de um alvo comum.",
"Opera em VHF, no canal 16, e aparece como texto na tela do radar.",
"Opera em 406 MHz e aparece como um círculo em volta da antena do radar."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> O SART responde aos pulsos de radares de 9 GHz e gera uma série de 12 respostas, vistas como uma linha de doze pontos que parte de sua posição, o que o distingue dos alvos normais.</li><li>B) O SART responde ao radar de banda X (9 GHz), e não ao de 3 GHz.</li><li>C) Ele não é um eco comum: gera uma linha de doze pontos.</li><li>D) VHF é do rádio; o SART é um respondedor de radar.</li><li>E) 406 MHz é a frequência da EPIRB; o SART só atua na faixa do radar.</li></ul>",
"referencia": "SOLAS, cap. IV, Regra 7.1.3 (respondedor radar de 9 GHz); NORMAM-211/DPC, art. 4.24.1 a) III)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0109",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Num resgate por helicóptero, o cabo do guincho desce até a balsa. Qual é o procedimento correto antes de tocá-lo?",
"alternativas": [
"Prender o cabo à balsa, para que ela não se afaste do helicóptero.",
"Segurá-lo assim que chegar ao nível da balsa e passá-lo ao colega mais próximo.",
"Disparar um facho de luz vermelha na direção do piloto.",
"Deixar o cabo tocar a água para descarregar a estática, e só então segurá-lo.",
"Lançar uma segunda âncora flutuante, para estabilizar a balsa."
],
"correta": 3,
"explicacao": "<ul><li>A) O cabo não deve ser prendido à balsa; o movimento de ambos poderia causar acidente.</li><li>B) Segurar o cabo antes de ele tocar a água expõe a pessoa à descarga estática.</li><li>C) O facho ofuscaria o piloto; a sinalização já foi feita antes.</li><li><b>D) Correta.</b> O cabo acumula carga estática no voo; encostar na água a descarrega e evita um choque ao sobrevivente. Depois, seguem-se apenas as ordens do resgatista.</li><li>E) A âncora flutuante não é usada nessa fase e pode se enroscar no cabo.</li></ul>",
"referencia": "IMO, Res. A.657(16), Parte B, item 20.3 (preparar o resgate por helicóptero); IAMSAR, Vol. III (içamento por helicóptero)",
"fonte_url": "https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.657(16).pdf"
},
{
"id": "capitao-0110",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Uma EPIRB foi ativada e a posição do naufrágio foi informada à Marinha. Após dois dias sem resgate, os sobreviventes continuam na balsa. Qual é a conduta mais indicada?",
"alternativas": [
"Remar rumo à costa mais próxima, para encurtar o tempo de resgate.",
"Desligar a EPIRB para poupar a bateria e ligá-la só à noite.",
"Recolher a âncora flutuante e seguir a favor da corrente até um porto.",
"Disparar todos os pirotécnicos de uma vez, para chamar a atenção.",
"Ficar o mais perto possível da posição do alerta, com a EPIRB ligada."
],
"correta": 4,
"explicacao": "<ul><li>A) Quem se afasta sai da área de busca; a balsa não rema longas distâncias.</li><li>B) A EPIRB deve ficar ligada o tempo todo; desligá-la interrompe o alerta.</li><li>C) Recolher a âncora flutuante aumenta a deriva e afasta a balsa da posição conhecida; além disso, a balsa não segue com precisão até um porto.</li><li>D) Os pirotécnicos são limitados e só devem ser usados quando há algo à vista.</li><li><b>E) Correta.</b> Se o alerta foi enviado e a posição é conhecida, as buscas começam ali: no local do naufrágio e na deriva provável; afastar-se atrapalha o resgate.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 43.1 (se o alerta foi transmitido, pode ser melhor permanecer no local do naufrágio); IMO, Res. A.657(16), Parte B, item 12 (usar o equipamento de detecção, inclusive rádio)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0111",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Uma balsa com 5 pessoas dispõe de 20 litros de água potável. Pela regra clássica (nenhuma água nas primeiras 24 horas e, depois, 0,5 litro por pessoa por dia), por quantos dias, depois das primeiras 24 horas, a água basta?",
"alternativas": [
"4 dias.",
"8 dias.",
"10 dias.",
"12 dias.",
"16 dias."
],
"correta": 1,
"explicacao": "<ul><li>A) Corresponde a 1 litro por pessoa por dia (20 ÷ 5).</li><li><b>B) Correta.</b> O consumo é 5 × 0,5 = 2,5 litros por dia. Os 20 litros duram 20 ÷ 2,5 = 8 dias.</li><li>C) Corresponde a 2,0 litros por dia (0,4 litro por pessoa).</li><li>D) Corresponde a pouco mais de 1,6 litro por dia, o que daria só 0,33 litro por pessoa.</li><li>E) Corresponde a 1,25 litro por dia, ou 0,25 litro por pessoa.</li></ul>",
"referencia": "Orientação tradicional de sobrevivência (Rezende, Sobrevivência no Mar, bibliografia do Anexo 5-A, item 1.9 f); IMO, Res. A.657(16), Parte B, item 15 (decidir as rações)",
"fonte_url": "https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.657(16).pdf"
},
{
"id": "capitao-0112",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Um tripulante molhado acaba de entrar na balsa. Ele está consciente, treme muito, tem a pele pálida e os lábios azulados. Qual é a primeira conduta?",
"alternativas": [
"Friccionar com vigor seus braços e pernas até a pele ficar quente e vermelha.",
"Dar-lhe uma dose de bebida alcoólica, para dilatar os vasos e aquecê-lo por dentro.",
"Mantê-lo com a roupa molhada, para conservar o calor, deitado no piso frio e sem cobertura.",
"Pedir que faça exercício intenso na balsa até parar de tremer por completo.",
"Abrigá-lo do vento, tirar a roupa molhada, secá-lo, cobri-lo e dar bebida quente e doce."
],
"correta": 4,
"explicacao": "<ul><li>A) Friccionar a pele pode lesioná-la e levar sangue frio ao núcleo do corpo.</li><li>B) O álcool dilata os vasos da pele, aumenta a perda de calor e piora o julgamento.</li><li>C) A roupa molhada tira calor do corpo, e o piso frio e a falta de cobertura agravam a perda.</li><li>D) Exercício intenso de um hipotérmico é inseguro, e a balsa não oferece espaço para isso.</li><li><b>E) Correta.</b> Na hipotermia leve o objetivo é cortar as perdas de calor: tirar o vento e a roupa molhada, secar, isolar do piso, cobrir o corpo e a cabeça e dar bebida quente e doce se o tripulante puder engolir.</li></ul>",
"referencia": "FICR/GFARC, Diretrizes Internacionais de Primeiros Socorros 2025 (hipotermia); National Center for Cold Water Safety, Hypothermia",
"fonte_url": "https://www.globalfirstaidcentre.org/"
},
{
"id": "capitao-0113",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "De acordo com o Anexo IV do RIPEAM, qual dos sinais abaixo NÃO é reconhecido como sinal de perigo?",
"alternativas": [
"Tiro de canhão ou outro sinal explosivo, a intervalos de cerca de um minuto.",
"Foguete com paraquedas ou tocha manual de luz encarnada.",
"Sinal de fumaça de cor laranja.",
"Foguetes com estrelas verdes, um de cada vez.",
"Movimento lento, para cima e para baixo, dos braços estendidos."
],
"correta": 3,
"explicacao": "<ul><li>A) É sinal de perigo (Anexo IV, 1 a).</li><li>B) É sinal de perigo (Anexo IV, 1 i).</li><li>C) É sinal de perigo (Anexo IV, 1 j).</li><li><b>D) Correta.</b> O Anexo IV traz foguetes ou granadas lançando estrelas encarnadas (1 c), e não verdes. Todos os outros sinais da lista são sinais de perigo do Anexo.</li><li>E) É sinal de perigo (Anexo IV, 1 k).</li></ul>",
"referencia": "RIPEAM-72, Anexo IV, item 1",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "capitao-0114",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Na balsa, em pleno oceano, um sobrevivente usa a linha e o anzol da palamenta para pescar. Qual é o cuidado mais importante?",
"alternativas": [
"Cozinhar muito bem qualquer peixe, o que sempre elimina todas as toxinas.",
"Preferir peixes de cores vivas, pois indicam carne saborosa e segura.",
"Comer bastante peixe quando faltar água, pois a carne hidrata o corpo.",
"Beber o sangue do peixe pescado, para repor a água perdida pelo organismo.",
"Evitar peixe-balão e peixes de recife, que podem ser tóxicos."
],
"correta": 4,
"explicacao": "<ul><li>A) Há toxinas que resistem ao calor, e o cozimento não torna seguro um peixe tóxico.</li><li>B) Cores vivas costumam estar ligadas a espécies de recife, sujeitas a toxinas.</li><li>C) Digerir proteína gasta água do corpo; não substitui a água.</li><li>D) O sangue contém sais e não resolve a falta de água.</li><li><b>E) Correta.</b> Peixes-balão e peixes de recife podem conter toxinas, algumas não destruídas pelo cozimento. Dourados e atuns, de águas abertas, são mais seguros. Com pouca água, comer pouco, pois a digestão exige água.</li></ul>",
"referencia": "OMS, International Medical Guide for Ships, 3ª ed. (intoxicação por peixes); Rezende, Sobrevivência no Mar (pesca na balsa)",
"fonte_url": "https://iris.who.int/handle/10665/43814"
},
{
"id": "capitao-0115",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 2,
"enunciado": "Um tripulante cai de repente em água muito fria, usando colete salva-vidas. Qual é a ordem das quatro ameaças à sobrevivência descritas nos estágios da imersão em água fria?",
"alternativas": [
"Hipotermia, incapacidade, choque do frio e colapso circum-resgate.",
"Incapacidade, choque do frio, hipotermia e colapso circum-resgate.",
"Choque do frio, hipotermia, incapacidade e colapso circum-resgate.",
"Choque do frio, incapacidade, hipotermia e colapso circum-resgate.",
"Colapso circum-resgate, choque do frio, incapacidade e hipotermia."
],
"correta": 3,
"explicacao": "<ul><li>A) A hipotermia (queda da temperatura central) leva em geral cerca de meia hora; o choque do frio é imediato.</li><li>B) O choque do frio vem primeiro: ocorre no instante em que a água fria atinge grande área da pele.</li><li>C) Antes de a temperatura central cair, músculos e nervos já esfriaram: quando a hipotermia aparece, a pessoa já está incapacitada.</li><li><b>D) Correta.</b> Primeiro o choque do frio (perda do controle da respiração, esforço do coração), depois a incapacidade (músculos e nervos esfriam e deixam de funcionar), depois a hipotermia (queda da temperatura central) e, por fim, o colapso circum-resgate (queda brusca da pressão, perto ou durante o resgate). Os tempos variam muito com a água, a roupa e a pessoa; a popular \"regra 1-10-1\" é criticada por dar prazos fixos e não deve ser tomada ao pé da letra.</li><li>E) O colapso circum-resgate ocorre no fim, quando a pessoa é retirada da água, e não no início.</li></ul>",
"referencia": "National Center for Cold Water Safety, Stages of Immersion (choque do frio, incapacidade, hipotermia e colapso circum-resgate)",
"fonte_url": "https://www.coldwatersafety.org/cold-water"
},
{
"id": "capitao-0116",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 3,
"enunciado": "Um sobrevivente ficou cerca de 40 minutos em água fria e foi alcançado por um barco de resgate. Está consciente, mas exausto e tremendo. Qual é a melhor técnica para tirá-lo da água?",
"alternativas": [
"Içá-lo na vertical, para que a água saia dos pulmões.",
"Içá-lo na horizontal, se possível, e mantê-lo deitado e agasalhado.",
"Pedir que suba sozinho pela escada, pois o exercício o aquece.",
"Içá-lo na vertical e sentá-lo em seguida junto de uma fonte de calor intenso.",
"Esfregar suas pernas e braços ainda na água, antes de içá-lo."
],
"correta": 1,
"explicacao": "<ul><li>A) A água dos pulmões não é aliviada pela posição vertical; o risco real é o colapso circulatório.</li><li><b>B) Correta.</b> Após longa imersão, a pressão da água sobre o corpo deixa de existir ao ser içado na vertical e a pressão arterial pode cair, com risco de colapso. Por isso a recomendação é içar na horizontal, manter deitado, agasalhar e monitorar.</li><li>C) Esforço de um hipotérmico exausto pode levar a falha de força e a quedas, além de acelerar a perda de calor.</li><li>D) Calor intenso e rápido é inadequado; o aquecimento deve ser gradual.</li><li>E) Friccionar na água não aquece e atrasa a retirada.</li></ul>",
"referencia": "National Center for Cold Water Safety, Circumrescue Collapse (retirar a vítima na horizontal, p. ex. cesto ou maca); IAMSAR, Vol. III",
"fonte_url": "https://www.coldwatersafety.org/circumrescue-collapse"
},
{
"id": "capitao-0117",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 3,
"enunciado": "Uma balsa com 5 pessoas está há 5 dias sem rádio nem EPIRB funcionando, e ninguém sabe onde ela está. Ainda restam provisões para 15 dias. Uma ilha alta fica a 150 milhas a barlavento, e um continente a 400 milhas a sotavento. Vento e corrente empurram a balsa a cerca de 1,5 nó para sotavento. Qual é a melhor decisão?",
"alternativas": [
"Remar para a ilha a barlavento, por estar bem mais perto.",
"Permanecer onde está, esperando um resgate que ninguém sabe que é necessário.",
"Seguir para sotavento, mas sem racionar água, pois a viagem é curta.",
"Navegar para o norte, para ficar no meio entre a ilha e o continente.",
"Deixar-se levar para sotavento: cerca de 11 dias, dentro das provisões."
],
"correta": 4,
"explicacao": "<ul><li>A) Remar contra vento e corrente de 1,5 nó, em balsa sem quilha, não é viável.</li><li>B) Sem alerta, ninguém sabe onde a balsa está, e a espera pode ser fatal.</li><li>C) A viagem de 11 dias exige racionamento rigoroso, pois pode se prolongar.</li><li>D) Ir ao norte consumiria provisões sem aproximar de terra.</li><li><b>E) Correta.</b> A balsa não navega contra o vento e a corrente. A 1,5 nó, a deriva diária é de 36 milhas e 400 milhas levam cerca de 11 dias, abaixo dos 15 dias de provisões, desde que se racione. Remar 150 milhas a barlavento seria inviável.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, itens 43.1 e 43.3 (permanecer ou tentar alcançar terra; impossibilidade de navegar para barlavento); IMO, Res. A.657(16), Parte B, item 15",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0118",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 3,
"enunciado": "Do mastro de um veleiro, com o olho a 9 m acima da água, um navegante vê o topo de um pico de 400 m \"boiando\" no horizonte. Pela fórmula aproximada d = 2 × (√H + √h), com H e h em metros e d em milhas, a distância ao pico é de aproximadamente:",
"alternativas": [
"23 milhas.",
"40 milhas.",
"46 milhas.",
"58 milhas.",
"92 milhas."
],
"correta": 2,
"explicacao": "<ul><li>A) Esqueceu o fator 2 da fórmula.</li><li>B) Ignorou a altura do olho (2 × 20), que soma 6 milhas.</li><li><b>C) Correta.</b> √400 = 20 e √9 = 3. d = 2 × (20 + 3) = 46 milhas.</li><li>D) Extraiu a raiz de H, mas não a de h: 2 × (20 + 9) = 58 milhas.</li><li>E) Dobrou o resultado, como se o fator da fórmula fosse 4 em vez de 2.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 43.6 (distância a um pico que \"boia\" no horizonte: d = 2√H + 2√h)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0119",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 3,
"enunciado": "Um veleiro tem uma EPIRB antiga que só emite em 121,5 MHz. Por que ela não atende à NORMAM-211 e não gera alerta por satélite?",
"alternativas": [
"Porque o Cospas-Sarsat não processa 121,5 MHz desde 2009; a norma exige 406 MHz.",
"Porque 121,5 MHz é frequência de aviação e seu uso no mar é proibido por lei.",
"Porque 121,5 MHz é a frequência do canal 16 de VHF, que só alcança poucas milhas.",
"Porque o Cospas-Sarsat processa apenas sinais de 243 MHz, e não os de 406 MHz.",
"Porque a EPIRB de 121,5 MHz exige cadastro especial na Capitania, e não no INFOSAR."
],
"correta": 0,
"explicacao": "<ul><li><b>A) Correta.</b> A norma exige EPIRB de 406 MHz via satélite e lembra que o Cospas-Sarsat não processa 121,5 MHz desde 2009; o 121,5 MHz fica apenas como sinal de homing para aeronaves próximas.</li><li>B) Não é proibido: simplesmente não é processado por satélite.</li><li>C) O canal 16 do VHF está na faixa de 156,8 MHz.</li><li>D) O sistema processa 406 MHz; 243 MHz também deixou de ser processado.</li><li>E) Não há esse cadastro; a EPIRB de 406 MHz é cadastrada no INFOSAR.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6, alínea c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0120",
"nivel": "capitao",
"tema": "Sobrevivência no mar",
"dificuldade": 3,
"enunciado": "Uma balsa sofre uma deriva de 1,0 nó para o norte, causada pela corrente, e de 1,0 nó para o leste, causada pelo vento. Sem outros efeitos, qual é o deslocamento total em 24 horas?",
"alternativas": [
"Cerca de 24 milhas, para o rumo 045°.",
"Cerca de 34 milhas, para o rumo 045°.",
"Cerca de 34 milhas, para o rumo 135°.",
"Cerca de 34 milhas, para o rumo 315°.",
"Cerca de 48 milhas, para o rumo 045°."
],
"correta": 1,
"explicacao": "<ul><li>A) Considerou só uma das derivas (1 nó × 24 h).</li><li><b>B) Correta.</b> As duas derivas são perpendiculares: velocidade resultante = √(1² + 1²) = 1,41 nó, no rumo 045°. Em 24 h: 1,41 × 24 ≈ 34 milhas.</li><li>C) O módulo está certo, mas o rumo 135° seria para sudeste.</li><li>D) O módulo está certo, mas o rumo 315° seria para noroeste.</li><li>E) Somou 24 + 24 milhas, como se as derivas tivessem a mesma direção.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 43.4 (navegação estimada em balsa: corrente, abatimento e caimento)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0121",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "A pressão atmosférica normal ao nível do mar vale, aproximadamente:",
"alternativas": [
"1.013 hPa, o mesmo que 76 mmHg.",
"760 hPa, o mesmo que 1.013 mmHg.",
"1.300 hPa, o mesmo que 29,92 mmHg.",
"1.013 hPa, o mesmo que 760 mmHg.",
"101,3 hPa, o mesmo que 760 mmHg."
],
"correta": 3,
"explicacao": "A pressão normal é 1.013,25 hPa, igual a 760 mmHg (ou 29,92 polegadas de mercúrio). Os 101,3 trocam a vírgula de lugar (101,3 é o valor em quilopascais). Os 76 mmHg erram uma casa decimal. Trocar os números de hPa e mmHg inverte as unidades. Os 29,92 são polegadas de mercúrio, não milímetros, e 1.300 hPa seria uma pressão extrema.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0122",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "Um barômetro aneroide antigo, graduado em milibares, marca 1.008 mb. Em hectopascais, a mesma pressão é:",
"alternativas": [
"10.080 hPa, porque 1 hPa é igual a 0,1 mb.",
"1.021 hPa, porque 1 hPa é igual a 0,987 mb.",
"756 hPa, porque 1 hPa é igual a 0,75 mb.",
"1.008 hPa, porque 1 hPa é igual a 1 mb.",
"100,8 hPa, porque 1 hPa é igual a 10 mb."
],
"correta": 3,
"explicacao": "O hectopascal substituiu o milibar sem mudar o valor numérico: 1 hPa = 1 mb. O valor 756 é a mesma pressão em milímetros de mercúrio (1.008 × 0,75), e não em hPa. As demais alternativas inventam fatores de 10 ou de 0,987 que não existem entre mb e hPa.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0123",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "O instrumento que desenha a pressão atmosférica, num papel preso a um tambor de relógio, e produz o barograma é o:",
"alternativas": [
"Pluviógrafo.",
"Termógrafo.",
"Barógrafo.",
"Higrógrafo.",
"Anemógrafo."
],
"correta": 2,
"explicacao": "O barógrafo é um barômetro aneroide registrador e seu desenho mostra a tendência da pressão. O higrógrafo registra a umidade, o termógrafo a temperatura, o anemógrafo o vento e o pluviógrafo a chuva. Todos usam papel e tambor, e por isso são confundidos.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0124",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "Numa noite calma, o ar marca 19 °C e o ponto de orvalho é de 18 °C. A umidade relativa do ar é:",
"alternativas": [
"Próxima de 0%, porque o ar está seco e estável.",
"Próxima de 100%, e há risco de nevoeiro se o ar esfriar mais.",
"Baixa, porque a temperatura é maior que o ponto de orvalho.",
"Impossível de estimar sem a leitura do barômetro.",
"Em torno de 50%, pois o ar está meio saturado."
],
"correta": 1,
"explicacao": "Quando a temperatura do ar chega a 1 °C do ponto de orvalho, o ar está quase saturado: a umidade relativa fica por volta de 94%, perto de 100%. Com vento fraco, qualquer resfriamento extra faz o vapor condensar em nevoeiro. A umidade é baixa quando a diferença entre temperatura e ponto de orvalho é grande, e o barômetro não entra nessa estimativa.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0125",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "No Atlântico Norte, o pico da temporada de furacões ocorre em torno de:",
"alternativas": [
"10 de junho, no começo da temporada oficial de ciclones.",
"10 de dezembro, já fora da temporada oficial de ciclones.",
"10 de setembro, no auge de agosto a outubro.",
"30 de novembro, no encerramento da temporada oficial.",
"1º de janeiro, em pleno inverno do Hemisfério Norte."
],
"correta": 2,
"explicacao": "O pico no Atlântico Norte é em 10 de setembro, com a maior parte da atividade entre meados de agosto e meados de outubro (NHC). A temporada oficial vai de 1º de junho a 30 de novembro. Em 10 de junho ela começa, mas a atividade ainda é pequena. Em 30 de novembro ela termina, com poucos ciclones. Em 10 de dezembro e em 1º de janeiro a temporada já acabou. Quem planeja uma travessia ao Caribe deve evitar o pico.",
"referencia": "NOAA/NHC, Tropical Cyclone Climatology",
"fonte_url": "https://www.nhc.noaa.gov/climo/"
},
{
"id": "capitao-0126",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "O Centro de Hidrografia da Marinha (CHM) publica cartas sinóticas referidas às seguintes horas:",
"alternativas": [
"08 e 20 HMG.",
"00 e 12 HMG.",
"09 e 21 horas locais de Brasília.",
"06 e 18 HMG.",
"00 e 12 horas locais de cada porto."
],
"correta": 1,
"explicacao": "As cartas sinóticas do CHM são elaboradas duas vezes por dia, para as 00 HMG e as 12 HMG (horas do meridiano de Greenwich). As outras alternativas trazem horas que não são as dos produtos do CHM, ou trocam a hora de Greenwich pela hora local (quem usa a hora de Brasília, UTC−3, precisa converter).",
"referencia": "CHM, Cartas Sinóticas; Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.5.4",
"fonte_url": "https://www.marinha.mil.br/chm/cartassinoticas"
},
{
"id": "capitao-0127",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 1,
"enunciado": "Em tempo bom, sob a influência da Alta Subtropical do Atlântico Sul, o vento predominante no litoral Sudeste do Brasil sopra de:",
"alternativas": [
"Noroeste, quente e seco, vindo do interior.",
"Sudeste a nordeste, de fraco a moderado.",
"Sudoeste a oeste, trazido pelas frentes frias.",
"Sul, sempre forte, vindo da Antártica.",
"Norte a noroeste, sempre fraco, antes da brisa."
],
"correta": 1,
"explicacao": "Em tempo bom a Alta Subtropical do Atlântico Sul domina o litoral, e o vento é de fraco a moderado, de sudeste a nordeste (Miguens). A alta gira no sentido anti-horário no Hemisfério Sul, e o litoral Sudeste fica na sua borda oeste. Vento de sudoeste a sul chega com as frentes frias, que interrompem o tempo bom. Vento de norte ou noroeste é sinal de aproximação da frente fria, e não de tempo bom, e o de sul 'sempre forte' não existe.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, itens 45.1.3 e 45.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0128",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "Na estação da carta sinótica mostrada na figura (Hemisfério Sul), o vento (direção de onde sopra) e a cobertura do céu são:",
"alternativas": [
"Vento de nordeste, 15 nós, com 4/8 do céu coberto.",
"Vento de sudoeste, 20 nós, com 4/8 do céu coberto.",
"Vento de sudoeste, 15 nós, com 4/8 do céu coberto.",
"Vento de sudoeste, 15 nós, com o céu totalmente encoberto.",
"Vento para sudoeste, 15 nós, com 4/8 do céu coberto."
],
"correta": 2,
"explicacao": "A haste com as barbelas aponta para sudoeste, de onde o vento sopra. Uma barbela longa vale 10 nós e uma curta vale 5, o que dá 15 nós. O círculo com a metade cheia indica 4/8 de céu coberto. A alternativa com nordeste inverte a direção. Duas barbelas longas dariam 20 nós, e a estação tem uma longa e uma curta. Vento 'para' sudoeste é o sentido contrário, que a estação não mostra. Um círculo totalmente cheio seria 8/8, e não 4/8.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.5.4; CHM, simbologia das cartas sinóticas",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_simbologia_0.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 200 150\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\"><title>Estação de uma carta sinótica</title><g fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"105\" cy=\"62\" r=\"10\"/><line x1=\"97.9\" y1=\"69.1\" x2=\"68.2\" y2=\"98.8\"/><line x1=\"68.2\" y1=\"98.8\" x2=\"91.5\" y2=\"105.0\"/><line x1=\"76.0\" y1=\"91.0\" x2=\"87.6\" y2=\"94.1\"/></g><path d=\"M105 52 A10 10 0 0 1 105 72 Z\" fill=\"var(--ink)\"/><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M24 44 V16\"/><path d=\"M24 16 l-4 7 M24 16 l4 7\"/></g><text x=\"24\" y=\"58\" text-anchor=\"middle\" font-size=\"12\" fill=\"currentColor\">N</text><text x=\"100\" y=\"142\" text-anchor=\"middle\" font-size=\"11\" fill=\"currentColor\">Estação no Hemisfério Sul</text></svg>"
}
},
{
"id": "capitao-0129",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "No Hemisfério Sul, um veleiro vê cirros, depois cirrostratos, e o céu se cobre de altostratos e nimbostratos. A pressão cai devagar por muitas horas e o vento é fraco. Esse quadro anuncia a aproximação de uma:",
"alternativas": [
"Zona de Convergência Intertropical, com pancadas isoladas de cumulonimbos.",
"Linha de instabilidade, com trovoadas e rajadas em poucos minutos.",
"Alta subtropical, com o céu limpando e a pressão subindo.",
"Frente quente, com chuva contínua e risco de nevoeiro frontal.",
"Frente fria, com cumulonimbos, rajadas e rondada brusca do vento."
],
"correta": 3,
"explicacao": "Na frente quente o ar quente sobe numa rampa suave. As nuvens vão baixando (cirros, cirrostratos, altostratos, nimbostratos) e a pressão cai devagar, até a chuva contínua. Na frente fria o céu se fecha mais depressa, com cumulonimbos e rajadas. A alta traria pressão subindo e tempo bom, a linha de instabilidade é abrupta e a ZCIT está perto do Equador.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0130",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "A pressão era de 1.015 hPa às 09 h e passou a 1.010 hPa às 12 h. Pela convenção do Met Office (Reino Unido) para a tendência de 3 horas, a pressão:",
"alternativas": [
"Estável, quase sem variação.",
"Cai devagar (de 0,1 a 1,5 hPa em 3 h).",
"Cai depressa (de 3,6 a 6,0 hPa em 3 h).",
"Cai (de 1,6 a 3,5 hPa em 3 h).",
"Cai muito depressa (mais de 6,0 hPa em 3 h)."
],
"correta": 2,
"explicacao": "A queda foi de 5 hPa (de 1.015 para 1.010) em 3 horas. No glossário do Met Office, a faixa de 3,6 a 6,0 hPa é 'quickly', que se traduz como cai depressa. 'Devagar' vai de 0,1 a 1,5 hPa; a faixa sem advérbio vai de 1,6 a 3,5 hPa; e 'muito depressa' é mais de 6,0 hPa. A alternativa de pressão estável erra, porque uma queda de 5 hPa não é quase nenhuma variação.",
"referencia": "Met Office, glossário de termos de previsão costeira e marítima, 'Pressure tendency' (faixas de 3 horas)",
"fonte_url": "https://weather.metoffice.gov.uk/guides/coast-and-sea/glossary"
},
{
"id": "capitao-0131",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "À noite, com vento de 6 nós, um veleiro leva ar quente e úmido (24 °C) sobre uma corrente fria de 19 °C. O ar vai esfriando e se aproxima do ponto de orvalho. O fenômeno mais provável é o:",
"alternativas": [
"Nevoeiro de advecção, ar quente sobre água fria.",
"Nevoeiro de radiação, formado pelo resfriamento noturno do mar.",
"Nevoeiro de vapor, formado por ar muito frio sobre mar quente.",
"Nevoeiro orográfico, formado pelo ar que sobe uma encosta.",
"Névoa seca, formada por poeira e fumaça de queimadas."
],
"correta": 0,
"explicacao": "Ar quente e úmido que passa sobre água mais fria esfria por baixo até saturar: é o nevoeiro de advecção, o mais comum no mar. A alternativa de radiação erra, porque esse nevoeiro depende do esfriamento do solo, e a água quase não esfria à noite. A de vapor inverte o cenário, com ar frio sobre mar quente. A orográfica precisa de relevo, e a névoa seca não tem relação com o resfriamento do ar.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0132",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "Assinale a afirmativa INCORRETA sobre nevoeiros no mar.",
"alternativas": [
"O nevoeiro de advecção se forma quando ar quente e úmido passa sobre água mais fria.",
"O nevoeiro frontal está ligado à chuva das frentes, em especial das frentes quentes.",
"Em costas com serras, o ar úmido que sobe a encosta pode formar nevoeiro orográfico.",
"O nevoeiro de vapor, ou fumaça do mar, aparece quando ar muito frio passa sobre água mais quente.",
"O nevoeiro de radiação é o mais comum em alto-mar, pois a água esfria depressa à noite."
],
"correta": 4,
"explicacao": "A afirmativa incorreta é a do nevoeiro de radiação: ele é típico de terra e de rios, em noites calmas e de céu limpo. No mar é raro, porque a água quase não esfria à noite, e o mais comum é o de advecção. As outras quatro estão corretas: a de advecção, a frontal (ligada à chuva das frentes), a orográfica (ar que sobe a encosta) e a de vapor (ar frio sobre mar mais quente).",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0133",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "Um veleiro sai do Nordeste do Brasil rumo à Europa e sobe o Atlântico. Na ordem em que os encontra, o que ele espera?",
"alternativas": [
"Alísios de nordeste, a ZCIT e alísios de sudeste.",
"Alísios de sudeste e logo alísios de nordeste, sem faixa de transição.",
"Alísios de sudeste, a ZCIT e alísios de nordeste.",
"Alísios de sudeste e ventos de oeste, sem passar pela ZCIT.",
"Ventos de oeste, a ZCIT e alísios de nordeste."
],
"correta": 2,
"explicacao": "Ao sul do Equador os alísios sopram de sudeste; ao norte, de nordeste. Entre os dois fica a ZCIT, faixa de baixa pressão com vento fraco, calmarias e pancadas. A alternativa 0 inverte os hemisférios. A 1 apaga a ZCIT, que sempre separa os dois alísios. A 3 e a 4 põem ventos de oeste no caminho, mas eles dominam só em latitudes bem maiores, e não vêm logo depois do Nordeste.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.1.3; NGA Pub. 160",
"fonte_url": "https://msi.nga.mil/api/publications/download?key=16694492/SFH00000/Pub160bk.pdf&type=view"
},
{
"id": "capitao-0134",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "Qual das previsões abaixo obriga o CHM a emitir um Aviso de Mau Tempo?",
"alternativas": [
"Ressaca com ondas de 2,0 m na costa.",
"Visibilidade de 2 km, por causa de névoa.",
"Vento de 25 nós, força 6 na escala Beaufort.",
"Ondas de 2,5 m em águas profundas.",
"Ondas de 3,0 m em águas profundas."
],
"correta": 4,
"explicacao": "O aviso é emitido para vento força 7 ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa. Os 25 nós são força 6, os 2 km de visibilidade estão acima de 1 km, a ressaca de 2,0 m e as ondas de 2,5 m em águas profundas ficam abaixo dos limites.",
"referencia": "CHM, Serviços Radiometeorológicos de Apoio ao Navegante; Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.5.2",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante"
},
{
"id": "capitao-0135",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "Numa imagem de satélite no canal de vapor d'água, uma ampla região escura sobre o oceano, atrás de uma faixa clara, indica:",
"alternativas": [
"Mar frio na superfície, pois o canal mede a temperatura do oceano.",
"Nevoeiro denso sobre o mar, pois o canal mostra as nuvens baixas.",
"Topos de nuvens muito frios, como numa ZCIT bem ativa e extensa.",
"Ar muito úmido e ascendente, com cumulonimbos em desenvolvimento.",
"Ar seco e descendente na média e alta troposfera, comum sob altas."
],
"correta": 4,
"explicacao": "O canal de vapor d'água mostra a umidade da média e alta troposfera. Zonas escuras são ar seco que desce, típico de altas e da retaguarda de frentes, e a faixa clara é ar úmido e ascendente. O canal não mede a temperatura do mar nem mostra nuvens baixas, e o nevoeiro é visto melhor no canal visível. Topos muito frios de nuvens, como numa ZCIT ativa, aparecem claros nesse canal.",
"referencia": "CPTEC/INPE, imagens de satélite GOES (canais visível, infravermelho e vapor d'água); NORMAM-211/DPC, Anexo 5-A, item 1.5 b) V)",
"fonte_url": "https://satelite.cptec.inpe.br/home/index.jsp"
},
{
"id": "capitao-0136",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "A pressão central de um ciclone extratropical ao sul do Brasil cai de 1.002 hPa para 976 hPa em 24 horas. Esse aprofundamento de 26 hPa caracteriza:",
"alternativas": [
"Um ciclone tropical, que só se forma sobre águas muito quentes.",
"Frontólise, a dissipação de uma frente que chega ao Nordeste.",
"Preenchimento da baixa, quando o centro do ciclone se enfraquece.",
"Ciclogênese explosiva (ciclone bomba), com vento e mar muito severos.",
"Maré barométrica, a oscilação normal da pressão ao longo do dia."
],
"correta": 3,
"explicacao": "Chama-se ciclone bomba (ciclogênese explosiva) o ciclone cuja pressão central cai cerca de 1 hPa por hora, ou 24 hPa em 24 horas, ou mais. No critério de Sanders e Gyakum esse valor vale a 60° de latitude e o limite é menor em latitudes menores (cerca de 14 hPa em 24 h a 30°S), de modo que 26 hPa em 24 h passa o limite com folga. A frontólise é o fim de uma frente. Ciclone tropical é outro tipo de sistema. A maré barométrica é de poucos hPa por dia e o preenchimento é a subida da pressão central.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.5.3 (queda de cerca de 1 hPa/h por mais de 24 h: ciclones bomba); Sanders & Gyakum (1980)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0137",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "A carta sinótica das 00 HMG está sendo usada num veleiro que adota a hora de Brasília (UTC−3). Na hora local de bordo, essa carta corresponde às:",
"alternativas": [
"00:00 do mesmo dia.",
"21:00 do dia anterior.",
"18:00 do dia anterior.",
"03:00 do mesmo dia.",
"09:00 do mesmo dia."
],
"correta": 1,
"explicacao": "Hora local = HMG − 3 horas, pois o fuso de Brasília é UTC−3 (atrasado em relação a Greenwich): 00:00 − 3 h = 21:00 do dia anterior. Somar 3 horas daria 03:00, e ignorar o fuso daria 00:00. O valor 09:00 seria a conversão da carta das 12 HMG, e 18:00 usaria um fuso errado.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.5.4; CHM, Cartas Sinóticas",
"fonte_url": "https://www.marinha.mil.br/chm/cartassinoticas"
},
{
"id": "capitao-0138",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 2,
"enunciado": "O METEOROMARINHA prevê para a sua área: \"VENTO NE 5/7, RONDANDO PARA N 7/8, COM RAJADAS 9\". Para planejar o pior caso do trecho, as rajadas previstas valem, em nós:",
"alternativas": [
"De 41 a 47 nós (força 9).",
"De 34 a 40 nós (força 8).",
"De 48 a 55 nós (força 10).",
"Apenas 9 nós, pois o boletim já dá o valor em nós.",
"De 28 a 33 nós (força 7)."
],
"correta": 0,
"explicacao": "Os números do boletim são forças da escala Beaufort, e não nós. Rajadas 9 correspondem à força 9, \"vento duro\", de 41 a 47 nós. As forças 7, 8 e 10 valem 28 a 33, 34 a 40 e 48 a 55 nós. Como a faixa do vento sustentado chega a 8, a decisão sobre o pano deve considerar o valor máximo.",
"referencia": "CHM, Escala Beaufort (OMM nº 8); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.5.1 (boletim METEOROMARINHA)",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf"
},
{
"id": "capitao-0139",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "Analise as afirmativas sobre meteorologia no Hemisfério Sul.<br>I. Em torno da Alta Subtropical do Atlântico Sul o vento gira no sentido anti-horário.<br>II. A ZCIT é uma faixa de alta pressão, com ventos constantes e tempo firme.<br>III. Isóbaras muito próximas na carta sinótica indicam gradiente forte e vento forte.<br>IV. A frente fria avança mais devagar que a frente quente e por isso nunca a alcança.<br>Estão corretas:",
"alternativas": [
"Somente I e III.",
"I, II e III.",
"Somente II e IV.",
"Somente III e IV.",
"Somente I e II."
],
"correta": 0,
"explicacao": "I é verdadeira: toda alta do Hemisfério Sul gira no sentido anti-horário. III é verdadeira: isóbaras juntas dão gradiente forte e vento forte. II é falsa: a ZCIT é uma faixa de baixa pressão, com calmarias e pancadas. IV é falsa: a frente fria é mais veloz e alcança a quente, formando a frente oclusa.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, itens 45.1.3, 45.2.4 e 45.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0140",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "No Hemisfério Sul, um veleiro recebe vento de leste (090°) e o comandante quer saber onde está a baixa. Pela lei de Buys-Ballot, a baixa fica a cerca de 110° à esquerda de quem olha de frente para o vento. Ela está, aproximadamente, na marcação:",
"alternativas": [
"270°, a oeste, para onde o vento sopra.",
"090°, na direção de onde vem o vento.",
"200°, ao sul-sudoeste.",
"020°, ao nor-nordeste.",
"340°, ao norte-noroeste."
],
"correta": 4,
"explicacao": "Olhando para 090°, de onde vem o vento, e virando 110° para a esquerda, chega-se a 090° − 110° = −20°, ou seja, 340°. A marcação de 200° vem de virar para a direita, como no Hemisfério Norte. Os 270° são a direção para onde o vento sopra, e 090° é a de onde ele vem; nenhum dos dois tem o desvio de 110°. O 020° fica a só 70° à esquerda do vento.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.4 (lei de Buys-Ballot)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0141",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "Um veleiro navega no rumo 000° a 6 nós, com vento verdadeiro de leste (090°) de 8 nós. O anemômetro de bordo, que mede o vento aparente, indicará aproximadamente:",
"alternativas": [
"10 nós, vindo de cerca de 037°, ou seja, 37° por boreste da proa.",
"10 nós, vindo de cerca de 053°, ou seja, 53° por boreste da proa.",
"2 nós, vindo de 090°, pelo través de boreste.",
"10 nós, vindo de cerca de 307°, ou seja, 53° por bombordo da proa.",
"14 nós, vindo de 090°, pelo través de boreste."
],
"correta": 1,
"explicacao": "O vento aparente é a soma vetorial do vento verdadeiro com o vento criado pelo movimento do barco. Aqui os dois são perpendiculares (8 e 6 nós), e o triângulo 6-8-10 dá 10 nós. O ângulo com a proa é tan⁻¹(8/6) ≈ 53°, do lado de onde vem o vento verdadeiro (boreste). A de 2 nós subtrai as velocidades, como se fossem paralelas, e a de 14 nós as soma. A de 37° troca os catetos, e a de 307° põe o vento do lado de bombordo, onde ele não está.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.2.4 (anemômetro mede o vento relativo ou aparente; triângulo de velocidades)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0142",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "De manhã, uma região do mar ao largo de Cabo Frio aparece branca e uniforme na imagem de satélite visível, mas quase não se distingue do mar na imagem infravermelha da mesma hora. O mais provável é:",
"alternativas": [
"Estratos ou nevoeiro, com topo quase tão quente quanto o mar.",
"Cumulonimbos de topo muito alto, que o infravermelho mostra bem brilhantes.",
"Frente fria ativa, com topos frios e brilhantes no infravermelho.",
"Cirros finos de altitude, muito brilhantes no infravermelho.",
"Céu limpo, com o mar aparecendo branco no visível."
],
"correta": 0,
"explicacao": "Estratos ou nevoeiro são brancos e uniformes no visível, porque refletem muita luz. No infravermelho, que mede a temperatura do topo, um topo quase tão quente quanto o mar fica cinza e se confunde com a água. As alternativas 1, 2 e 3 têm topos frios, que aparecem brilhantes no infravermelho. A 4 erra: céu limpo aparece escuro no visível, e não branco.",
"referencia": "CPTEC/INPE, imagens de satélite GOES (canais visível e infravermelho); NORMAM-211/DPC, Anexo 5-A, item 1.5 b) V)",
"fonte_url": "https://satelite.cptec.inpe.br/home/index.jsp"
},
{
"id": "capitao-0143",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "A figura mostra parte de uma carta sinótica no Hemisfério Sul. A frente avança para o lado dos triângulos, e o veleiro V navega nesse lado, rumo à frente. O que ele deve esperar nas horas seguintes?",
"alternativas": [
"Vento fraco de sudoeste e pressão subindo, com garoa contínua na passagem.",
"Rondada lenta de sudoeste para noroeste depois da passagem, com pressão estável e temperatura subindo.",
"Vento fraco de nordeste, pressão estável e nuvens altas que descem aos poucos, sem chuva forte.",
"Vento de sudeste aumentando e pressão subindo antes da frente, sem mudança de temperatura na passagem.",
"Vento de noroeste aumentando e pressão caindo; na passagem, rondada brusca para sudoeste."
],
"correta": 4,
"explicacao": "Os triângulos apontam para nordeste, e é para lá que a frente fria avança. V está do lado dos triângulos, ou seja, no setor quente, à frente da frente. Ali o vento sopra de noroeste e aumenta, a pressão cai e a temperatura sobe. Na passagem a pressão atinge o mínimo, o vento ronda de repente para sudoeste e a temperatura cai, com pancadas. A 0 tem vento fraco e garoa, que são da frente quente, e pressão subindo, que não ocorre antes da frente fria. A 1 inverte o efeito da passagem, com temperatura subindo depois dela. A 2 e a 3 juntam efeitos que não ocorrem juntos na mesma frente.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 45, item 45.4 (aproximação e passagem da frente fria); CHM, simbologia das cartas sinóticas",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_simbologia_0.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 200 150\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\"><title>Frente fria avançando para nordeste, rumo ao veleiro V</title><line x1=\"50\" y1=\"40\" x2=\"160\" y2=\"128\" stroke=\"var(--sea-3)\" stroke-width=\"2.5\"/><path d=\"M55.5 44.4 L65.7 52.5 L67.5 39.9 Z\" fill=\"var(--sea-3)\"/><path d=\"M77.5 62.0 L87.7 70.1 L89.5 57.5 Z\" fill=\"var(--sea-3)\"/><path d=\"M99.5 79.6 L109.7 87.7 L111.5 75.1 Z\" fill=\"var(--sea-3)\"/><path d=\"M121.5 97.2 L131.7 105.3 L133.5 92.7 Z\" fill=\"var(--sea-3)\"/><path d=\"M143.5 114.8 L153.7 122.9 L155.5 110.3 Z\" fill=\"var(--sea-3)\"/><circle cx=\"150\" cy=\"55\" r=\"5\" fill=\"var(--nav-red)\"/><text x=\"159\" y=\"59\" font-size=\"13\" fill=\"currentColor\">V</text><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M20 40 V12\"/><path d=\"M20 12 l-4 7 M20 12 l4 7\"/></g><text x=\"20\" y=\"54\" text-anchor=\"middle\" font-size=\"12\" fill=\"currentColor\">N</text><text x=\"100\" y=\"146\" text-anchor=\"middle\" font-size=\"11\" fill=\"currentColor\">Hemisfério Sul. V: veleiro</text></svg>"
}
},
{
"id": "capitao-0144",
"nivel": "capitao",
"tema": "Meteorologia",
"dificuldade": 3,
"enunciado": "Um furacão no Atlântico Norte desloca-se para noroeste. Em relação à trajetória do centro, o semicírculo perigoso, onde o vento do giro se soma à velocidade de translação do sistema, é o:",
"alternativas": [
"Dianteiro, pois o sistema empurra o vento à sua frente.",
"Nenhum em especial, pois o vento do giro é simétrico em torno do olho.",
"Traseiro, pois o vento é mais forte atrás do sistema.",
"Esquerdo, onde o vento gira contra o deslocamento do sistema.",
"Direito, onde o vento do giro tem o mesmo sentido do deslocamento."
],
"correta": 4,
"explicacao": "No Hemisfério Norte o ciclone tropical gira no sentido anti-horário. À direita da trajetória o vento do giro tem o mesmo sentido do deslocamento, e as velocidades se somam: é o semicírculo perigoso. À esquerda elas se subtraem, e é o semicírculo navegável. No Hemisfério Sul a regra se inverte, e o perigoso é o esquerdo. Dianteiro e traseiro não são os setores de perigo, e 'nenhum em especial' erra, porque a translação soma a velocidade de um lado só.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.5.2 (ciclones tropicais: semicírculo perigoso)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0145",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 1,
"enunciado": "Após uma tempestade distante, chegam ao veleiro ondas de cristas longas e regulares, direção bem definida e período de 12 s, sem vento local. Essas ondas são:",
"alternativas": [
"Ressaca, formada pelas águas rasas.",
"Vagas, geradas pelo vento que sopra no local.",
"Tsunami, causado por abalo no fundo do mar.",
"Marulho (ondulação), de vento já distante.",
"Ondas de maré, causadas pela atração da Lua."
],
"correta": 3,
"explicacao": "Marulho é a onda que saiu da área de geração: cristas longas e regulares, direção definida e período grande. Vagas são confusas, de período curto e geradas pelo vento local (alternativa 1). Ressaca é o mar alto que chega à costa, e não ondas de longe (0). Tsunami vem de abalo sísmico (2), e a maré não gera ondas desse tipo (4).",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.1.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0146",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 1,
"enunciado": "Um boletim informa vento de 30 nós. Na escala Beaufort, essa velocidade corresponde à força:",
"alternativas": [
"8, vento muito forte (34 a 40 nós).",
"7, vento forte (28 a 33 nós).",
"9, vento duro (41 a 47 nós).",
"5, vento fresco (17 a 21 nós).",
"6, vento muito fresco (22 a 27 nós)."
],
"correta": 1,
"explicacao": "Os 30 nós estão na faixa de 28 a 33 nós da força 7, forte. As demais têm nomes e faixas de outras forças: 5 é fresco (17 a 21), 6 é muito fresco (22 a 27), 8 é muito forte (34 a 40) e 9 é duro (41 a 47). Nenhuma delas contém 30 nós.",
"referencia": "CHM, Escala Beaufort (OMM nº 8)",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf"
},
{
"id": "capitao-0147",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 1,
"enunciado": "A maré de sizígia, com preamares mais altas e baixa-mares mais baixas que a média, ocorre:",
"alternativas": [
"Na Lua nova e na Lua cheia, quando Sol, Terra e Lua estão alinhados.",
"Apenas nos solstícios, quando o Sol está mais afastado do Equador.",
"Sempre que o vento sopra com força contra a costa.",
"Nos quartos crescente e minguante, quando Sol e Lua puxam em ângulo reto.",
"Somente na Lua cheia, pois na Lua nova a maré é de quadratura."
],
"correta": 0,
"explicacao": "Na Lua nova e na cheia, Sol, Terra e Lua se alinham, os efeitos se somam e a amplitude é máxima (águas vivas). A 1 erra: os solstícios não definem sizígia. A 2 erra: o vento altera a altura da maré, mas não a define. A 3 descreve a quadratura, em que os efeitos se subtraem. A 4 erra, porque a Lua nova também tem sizígia.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 10",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0148",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 1,
"enunciado": "A Corrente do Brasil, que acompanha o litoral do Sudeste e do Sul, é uma corrente:",
"alternativas": [
"Quente, que desce para sudoeste, ramo da Sul-Equatorial.",
"Fria, que corre para sudoeste, alimentada por ressurgência.",
"Quente, que corre para leste, ao longo do Equador.",
"Quente, que corre para noroeste, rumo ao Caribe.",
"Fria, que corre para nordeste, vinda da Antártica."
],
"correta": 0,
"explicacao": "A Corrente do Brasil é o ramo da Sul-Equatorial que desce para sudoeste junto à costa, até perto de 35°S, quente e salina. Não é fria, nem alimentada por ressurgência: a de Cabo Frio é um afloramento local, não uma corrente (1). A de leste, no Equador, é a Contracorrente Equatorial (2). A que segue para noroeste rumo ao Caribe é a das Guianas (3). A fria que sobe pela costa argentina é a das Malvinas, que sobe para o norte, e não para nordeste (4).",
"referencia": "NGA Pub. 160, Sailing Directions (Planning Guide) South Atlantic Ocean and Indian Ocean; Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 10, item 10.3.5",
"fonte_url": "https://msi.nga.mil/api/publications/download?key=16694492/SFH00000/Pub160bk.pdf&type=view"
},
{
"id": "capitao-0149",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 1,
"enunciado": "Segundo a escala Douglas, adotada pelo CHM, ondas de 3 m de altura caracterizam o estado do mar:",
"alternativas": [
"Grosso (código 5), de 2,5 a 4 m.",
"Moderado (código 4), de 1,25 a 2,5 m.",
"Fraco (código 3), de 0,5 a 1,25 m.",
"Muito grosso (código 6), de 4 a 6 m.",
"Alto (código 7), de 6 a 9 m."
],
"correta": 0,
"explicacao": "Na escala Douglas, o código 5 (mar grosso) vai de 2,5 a 4 m, e 3 m cabe nessa faixa. As outras alternativas trazem faixas verdadeiras, mas de ondas menores (códigos 3 e 4) ou maiores (códigos 6 e 7).",
"referencia": "CHM, Escala Douglas (OMM nº 8, vol. III)",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_douglas.pdf"
},
{
"id": "capitao-0150",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Um marulho tem período de 12 s. Em águas profundas, seu comprimento de onda é de cerca de:",
"alternativas": [
"36 m.",
"144 m.",
"450 m.",
"225 m.",
"19 m."
],
"correta": 3,
"explicacao": "L = 1,56 × T² = 1,56 × 144 ≈ 225 m (a tabela do Miguens dá 224,5 m para T = 12 s). O valor 144 esquece o fator 1,56 (12² = 144) e o 19 m esquece de elevar T ao quadrado (1,56 × 12 ≈ 19). Os 450 m seriam o dobro do correto, e o 36 é o valor da celeridade desse marulho em nós (3,03 × 12 ≈ 36), que não é um comprimento.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 42.1.1 (L = 1,56 T²)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0151",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "O METEOROMARINHA prevê ondas com altura significativa de 4,0 m. Pelas relações de Miguens, as ondas isoladas mais altas desse mar podem chegar a cerca de:",
"alternativas": [
"5,2 m, que é a média do décimo mais alto.",
"7,5 m, ou seja, 1,87 vez a significativa.",
"2,6 m, que é a média de todas as ondas.",
"12,0 m, o triplo da significativa.",
"4,0 m, pois a altura significativa é a máxima."
],
"correta": 1,
"explicacao": "A altura significativa é a média do terço mais alto das ondas e não é a máxima. As ondas mais altas chegam a cerca de 1,87 × 4,0 ≈ 7,5 m. A média de todas as ondas é 0,64 × 4,0 ≈ 2,6 m, e a do décimo mais alto, 1,29 × 4,0 ≈ 5,2 m. Triplicar a altura exagera.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 42.1.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0152",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Um veleiro se aproxima de uma barra durante a vazante, com a corrente saindo a 3 nós e vento fresco soprando do mar para dentro. O que acontece com as ondas na barra?",
"alternativas": [
"Ficam mais curtas e mais íngremes, podendo arrebentar.",
"Mantêm a altura, mas ganham período e viram marulho.",
"Ficam menores, porque o vento e a corrente se anulam.",
"Não mudam, pois a corrente age sobre a água e não sobre as ondas.",
"Ficam mais longas e mais baixas, pois a corrente as alonga."
],
"correta": 0,
"explicacao": "A corrente contrária ao sentido das ondas encurta o comprimento e aumenta a altura, deixando o mar curto e íngreme, com risco de arrebentação na barra. A 1 erra: a corrente não muda o período, nem transforma as ondas em marulho. A 2 erra, porque vento e corrente não se anulam: o vento sopra com as ondas, para dentro, e a corrente sai contra elas. A 3 erra, pois a corrente age sobre as ondas. A 4 descreve corrente a favor, que alonga e baixa as ondas.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 42.1.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0153",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Segundo o critério prático de Miguens, uma onda de 2,4 m de altura, ao chegar a águas rasas, arrebenta quando a profundidade chega a cerca de:",
"alternativas": [
"2,4 m, a própria altura da onda.",
"4,8 m, o dobro da altura da onda.",
"3,2 m, ou 4/3 da altura da onda.",
"1,8 m, ou 3/4 da altura da onda.",
"1,2 m, metade da altura da onda."
],
"correta": 2,
"explicacao": "A onda arrebenta quando a profundidade chega a cerca de 4/3 da sua altura: 4/3 × 2,4 = 3,2 m. Os 1,8 m invertem a fração, e os 2,4, 4,8 e 1,2 m usam proporções que não fazem parte do critério.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.1.2 (a onda arrebenta com profundidade igual ou menor que 4/3 da altura)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0154",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Qual corrente fria sobe pela costa da Argentina e encontra a Corrente do Brasil perto de 38°S a 40°S?",
"alternativas": [
"Corrente de Benguela.",
"Corrente das Canárias.",
"Corrente do Golfo.",
"Corrente das Malvinas.",
"Corrente Sul-Equatorial."
],
"correta": 3,
"explicacao": "A Corrente das Malvinas nasce da Corrente Circumpolar Antártica e sobe fria junto à Argentina, encontrando a Corrente do Brasil na Convergência Subtropical. A de Benguela é fria, mas fica na costa da África. A das Canárias é fria e do Atlântico Norte. A Sul-Equatorial e a do Golfo são quentes.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 10, item 10.3.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0155",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Em Cabo Frio (RJ), águas frias de 100 a 200 m de profundidade sobem à superfície, esfriam o mar e atraem peixes. Essa ressurgência é favorecida por vento de:",
"alternativas": [
"Sudoeste, que empurra a água superficial contra a costa.",
"Qualquer um, pois a ressurgência depende apenas da maré.",
"Nordeste, que afasta a água superficial da costa.",
"Oeste, que também leva a água superficial para a costa.",
"Sul, que traz a Corrente das Malvinas até a praia."
],
"correta": 2,
"explicacao": "O vento de nordeste, paralelo à costa, desloca a água superficial para o mar aberto (no Hemisfério Sul o transporte é para a esquerda do vento). A água fria do fundo sobe para ocupar o lugar. Os ventos de sudoeste e de oeste fazem o contrário, levando água para a costa (subsidência). O vento sul não traz a Corrente das Malvinas até a praia, e a maré não é a causa da ressurgência.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 10, item 10.3.6 (ressurgência e subsidência)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0156",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 2,
"enunciado": "Numa carta piloto do Atlântico (DHN), a seta e o número em verde representam:",
"alternativas": [
"As isotermas da água do mar na superfície, em graus Celsius.",
"A corrente superficial: para onde vai e velocidade em nós.",
"Os limites das áreas de previsão do METEOROMARINHA no mar.",
"A isogônica: linha de mesma declinação magnética do mês.",
"O vento predominante: direção de onde vem e força Beaufort média."
],
"correta": 1,
"explicacao": "No verde, a carta piloto mostra as correntes superficiais: a seta indica para onde a corrente vai, e o número, a velocidade média em nós. Os ventos aparecem em azul, as isotermas em vermelho e as isogônicas em roxo, o que elimina as alternativas 0, 3 e 4. A 2 erra, porque os limites das áreas de previsão não são setas verdes com número.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, item 12.8 (Atlas de Cartas Piloto)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0157",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 3,
"enunciado": "Um marulho tem período de 10 s. Em águas profundas, sua celeridade é C = 3,03 × T (em nós). Quanto tempo a crista de uma onda desse marulho leva para percorrer 90 milhas?",
"alternativas": [
"Cerca de 1,5 hora.",
"Cerca de 30 minutos.",
"Cerca de 6 horas.",
"Cerca de 3 horas.",
"Cerca de 9 horas."
],
"correta": 3,
"explicacao": "C = 3,03 × 10 ≈ 30 nós. Tempo = distância ÷ velocidade = 90 ÷ 30 = 3 horas. As 9 horas vêm de dividir 90 pelo período (10 s) como se fosse velocidade. As 1,5 hora e os 30 minutos pressupõem velocidades de 60 e 180 nós, e as 6 horas, de 15 nós, que não resultam da fórmula.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, item 42.1.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0158",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 3,
"enunciado": "Você vai passar por uma barra que tem Carta de Correntes de Maré. A preamar prevista no porto de referência é às 15:00 e você chegará à barra às 12:00. Hoje é quadratura, e as velocidades impressas na carta valem para a sizígia. O procedimento correto é:",
"alternativas": [
"Usar a carta de 3 horas depois da preamar, com direção e velocidade como estão impressas na carta.",
"Usar a carta de 3 horas antes da preamar, sem nenhuma correção, pois a carta já traz a velocidade média.",
"Usar a carta da hora da preamar, porque a corrente de maré em barras é sempre rotatória.",
"Usar a carta de 3 horas antes da preamar, corrigindo a direção e mantendo a velocidade impressa.",
"Usar a carta de 3 horas antes da preamar, manter a direção e corrigir a velocidade pelo ábaco."
],
"correta": 4,
"explicacao": "A carta se escolhe pela diferença até a preamar: 12:00 é 3 horas antes das 15:00. As velocidades impressas valem para a sizígia; hoje é quadratura, e a velocidade é menor, corrigida pelo ábaco. A direção não muda. A 0 usa a carta depois da preamar, o que erra o intervalo. A 1 ignora a diferença entre sizígia e quadratura. A 2 confunde com a rotatória, que é de mar aberto. A 3 corrige a direção, que não precisa de correção.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 10, item 10.2.3; DHN, Cartas de Correntes de Maré",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf"
},
{
"id": "capitao-0159",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 3,
"enunciado": "Fundeado numa baía abrigada, o comandante recebe o alerta de um tsunami. Segundo Miguens, a melhor decisão é:",
"alternativas": [
"Permanecer fundeado, dobrando a amarra e vigiando a âncora, pois a baía é abrigada do mar.",
"Ir para o porto mais próximo e amarrar o barco a um cais alto, com cabos duplicados.",
"Ir para mar aberto, em mais de 150 m de fundo e a mais de 3 milhas, e ficar lá.",
"Subir um rio ou estuário próximo, onde as margens estreitas protegem o barco do mar.",
"Ir para mar aberto, mas voltar à costa depois da primeira onda, pois as seguintes são menores."
],
"correta": 2,
"explicacao": "O tsunami quase não se percebe em mar aberto (menos de 1 m) e só fica destrutivo em águas rasas. Por isso a regra é ir para mar aberto, com mais de 150 m de fundo e mais de 3 milhas da costa, e ficar lá, pois podem vir dez ou mais ondas em até 12 horas. A 0 erra: a baía não protege. A 1 e a 3 também: cais, rios e estuários não são abrigo. A 4 erra, porque a primeira onda nem sempre é a maior, e voltar à costa é o perigo.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.1.3 a) (tsunamis)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0160",
"nivel": "capitao",
"tema": "Oceanografia",
"dificuldade": 3,
"enunciado": "Um veleiro de 10 m navega com mar de popa e ondas de período de 3 s em águas profundas. A NORMAM-211 (Anexo 4-B) alerta que a situação é particularmente perigosa quando o comprimento da onda é de 1,0 a 1,5 vez o da embarcação. Nessa situação:",
"alternativas": [
"Cerca de 4,7 m, menor que o barco: sem risco especial.",
"Cerca de 9 m, 0,9 vez o barco: fora da faixa de risco.",
"Cerca de 28 m, quase três vezes o barco: risco pequeno.",
"Cerca de 14 m, mas o risco só existe com ondas de mais de 3 m de altura.",
"A onda tem cerca de 14 m, 1,4 vez o barco: perigosa, convém mudar a velocidade ou o rumo."
],
"correta": 4,
"explicacao": "L = 1,56 × 3² ≈ 14 m, que é 1,4 vez os 10 m do barco, dentro da faixa de 1,0 a 1,5 vez que a NORMAM-211 (Anexo 4-B, item 1.8) aponta como particularmente perigosa. A 0 esquece de elevar o período ao quadrado (1,56 × 3 ≈ 4,7 m). A 1 esquece o fator 1,56 (3² = 9 m). A 2 dobra o resultado. A 3 acerta o comprimento, mas inventa uma condição de altura que o critério não tem.",
"referencia": "NORMAM-211/DPC, Anexo 4-B, item 1.8; Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 42, item 42.1.1 (L = 1,56 T²)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0161",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "No GMDSS, o mar é dividido em quatro áreas marítimas, definidas pela cobertura de comunicações disponível. Qual alternativa associa corretamente cada área ao critério que a define?",
"alternativas": [
"A1: VHF com DSC; A2: MF com DSC; A3: satélite móvel reconhecido (como o Inmarsat); A4: o restante, em geral as regiões polares",
"A1: VHF com DSC; A2: MF com DSC; A3: o restante, em geral as regiões polares; A4: satélite móvel reconhecido (como o Inmarsat)",
"A1: satélite móvel reconhecido (como o Inmarsat); A2: MF com DSC; A3: VHF com DSC; A4: o restante, em geral as regiões polares",
"A1: MF com DSC; A2: VHF com DSC; A3: satélite móvel reconhecido (como o Inmarsat); A4: o restante, em geral as regiões polares",
"A1: VHF com DSC; A2: satélite móvel reconhecido (como o Inmarsat); A3: MF com DSC; A4: o restante, em geral as regiões polares"
],
"correta": 0,
"explicacao": "<p>A1 é a área dentro da cobertura de VHF com alerta DSC contínuo de pelo menos uma estação costeira. A A2 fica fora da A1 e dentro da cobertura de uma estação costeira de MF com DSC. A A3 fica fora das duas e dentro da cobertura de um serviço de satélite móvel reconhecido (RMSS), como o Inmarsat, cujos satélites são geoestacionários. A A4 é o que sobra; com o Inmarsat, na prática, as regiões polares (além de cerca de 76° de latitude).</p><ul><li><b>A1 e A2 trocadas</b>: o VHF alcança menos que o MF, por isso a área mais próxima da costa, a A1, é a do VHF.</li><li><b>A3 e A4 trocadas</b>: a A3 é a que tem cobertura de satélite; a A4 é a que fica sem nenhuma das três coberturas.</li><li><b>Satélite como A1</b>: a A1 é a área do VHF, a mais próxima da costa; o satélite define a A3.</li><li><b>A2 e A3 trocadas</b>: a cobertura de MF (A2) vem antes da de satélite (A3), que só é usada onde nem VHF nem MF alcançam.</li></ul>",
"referencia": "IMO, SOLAS, Capítulo IV, Regra 2 (definição das áreas marítimas A1 a A4, com a redação da Res. MSC.496(105)); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.4",
"fonte_url": "https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx"
},
{
"id": "capitao-0162",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "Ao revisar um veleiro recém-comprado, o comandante encontra uma radiobaliza antiga, que transmite apenas em 121,5 MHz. Em relação ao sistema Cospas-Sarsat e à NORMAM-211, qual é a situação dessa baliza?",
"alternativas": [
"Ela ainda gera alerta por satélite, sem identificar o barco, e a NORMAM-211 a aceita na navegação costeira.",
"Ela não gera alerta por satélite (121,5 MHz não é processado desde 2009) e não atende à NORMAM-211.",
"Ela serve como EPIRB principal numa travessia, desde que a bateria e o liberador estejam dentro da validade.",
"Ela passa a ser aceita se for cadastrada no INFOSAR, que converte o sinal de 121,5 MHz em 406 MHz.",
"Ela só emite alerta quando um navio a ilumina com radar na faixa de 9 GHz, como um transponder."
],
"correta": 1,
"explicacao": "<p>A NORMAM-211 exige que a EPIRB transmita o sinal de socorro por satélite na faixa de 406 MHz e lembra que, desde fevereiro de 2009, o Cospas-Sarsat não processa mais a frequência de 121,5 MHz. A baliza antiga, portanto, não aciona o salvamento.</p><ul><li><b>Alerta sem identificação</b>: o sistema deixou de processar 121,5 MHz em 2009, de modo que nenhum alerta por satélite é gerado.</li><li><b>Cadastro no INFOSAR</b>: o cadastro identifica uma baliza de 406 MHz e não altera a frequência em que o aparelho transmite.</li><li><b>Validade da bateria</b>: bateria nova não resolve: o problema é a frequência, que a NORMAM-211 exige que seja 406 MHz.</li><li><b>Confusão com o SART</b>: quem responde a radar de 9 GHz é o SART; a baliza de 121,5 MHz serve apenas de sinal de aproximação para quem já está perto.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 c)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0163",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "Navegando de Salvador para Fernando de Noronha, o comandante avista um contêiner semissubmerso à deriva, em posição conhecida, que oferece risco para outras embarcações. Ninguém está em perigo. Que sinal de rádio deve preceder a mensagem de aviso aos demais navios?",
"alternativas": [
"MAYDAY, dito três vezes, porque o contêiner ameaça a vida de quem navega perto.",
"PAN-PAN, dito três vezes, porque a situação exige atenção imediata de todos os navios.",
"SÉCURITÉ, dito três vezes, que anuncia uma mensagem de segurança da navegação.",
"SEELONCE MAYDAY, para liberar o canal antes de transmitir o aviso.",
"Nenhum sinal, pois só estações costeiras podem transmitir avisos de segurança da navegação."
],
"correta": 2,
"explicacao": "<p>O sinal de segurança, SÉCURITÉ, anuncia uma mensagem sobre segurança da navegação, como uma boia à deriva, um contêiner ou um aviso meteorológico importante. A mensagem vem logo depois, no canal indicado.</p><ul><li><b>MAYDAY</b>: é o sinal de socorro, reservado a perigo grave e iminente para a vida ou para a embarcação de quem transmite ou de quem é socorrido.</li><li><b>PAN-PAN</b>: é o sinal de urgência, usado quando há uma situação séria a bordo (um doente, uma avaria), e não para avisar de um perigo à navegação.</li><li><b>SEELONCE MAYDAY</b>: só se usa para impor silêncio durante um socorro em andamento, o que não é o caso.</li><li><b>Nenhum sinal</b>: qualquer estação pode transmitir um aviso de segurança, que deve começar pelo sinal de segurança.</li></ul>",
"referencia": "UIT, Regulamento de Radiocomunicações, Art. 33 (sinal de segurança); Lista de Auxílios-Rádio (DHN), cap. 7",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "capitao-0164",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "Um veleiro de 14 m (embarcação de médio porte) tem a antena do rádio VHF instalada no tope do mastro. O que a NORMAM-211 exige nesse caso?",
"alternativas": [
"Um segundo transceptor VHF fixo, ligado a outra antena também instalada no tope do mastro.",
"Um para-raios ligado à antena, com cabo de cobre de seção mínima definida na norma.",
"Um VHF portátil com bateria para oito horas de uso, em lugar de qualquer antena extra.",
"Uma antena de emergência, para ser usada caso o mastro quebre.",
"Nada, porque a exigência vale somente para embarcações a motor de grande porte."
],
"correta": 3,
"explicacao": "<p>A NORMAM-211 manda que as embarcações a vela com antena de VHF no tope do mastro tenham antena de emergência, para continuar a se comunicar se o mastro quebrar.</p><ul><li><b>Segundo rádio fixo</b>: a norma pede antena de reserva para o caso de perda do mastro, e uma antena no mesmo mastro cairia junto com ele.</li><li><b>Portátil no lugar da antena</b>: o VHF portátil é exigido à parte, para o abandono da embarcação, com bateria de pelo menos quatro horas, e não dispensa a antena de emergência.</li><li><b>Para-raios</b>: a NORMAM-211 não trata de para-raios nessa exigência.</li><li><b>Nenhuma exigência</b>: a norma cita expressamente as embarcações a vela com antena no tope do mastro.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.24.2 (último parágrafo)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0165",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "Pela NORMAM-211, a embarcação que leva equipamentos de radiocomunicação deve obter a Licença de Estação de Navio. Qual órgão emite essa licença?",
"alternativas": [
"A Capitania dos Portos da área onde a embarcação está registrada.",
"A Diretoria de Hidrografia e Navegação (DHN).",
"A Diretoria de Portos e Costas (DPC), junto com o Título de Inscrição da Embarcação.",
"O DECEA, por meio do sistema INFOSAR.",
"A Anatel (Agência Nacional de Telecomunicações)."
],
"correta": 4,
"explicacao": "<p>A NORMAM-211 manda obter a Licença de Estação de Navio junto à Anatel, que regula as telecomunicações no Brasil. É nessa licença que a estação recebe o indicativo de chamada e o MMSI.</p><ul><li><b>Capitania dos Portos</b>: ela registra e inspeciona a embarcação, mas não licencia estações de rádio.</li><li><b>DHN</b>: a DHN produz cartas, almanaques e publicações náuticas, e não licencia rádios.</li><li><b>O DECEA, por meio do sistema INFOSAR.</b>: o INFOSAR cadastra balizas de 406 MHz, e não emite a licença da estação de rádio.</li><li><b>DPC</b>: a DPC edita as NORMAM, mas a licença da estação de rádio é da agência de telecomunicações.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.8",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0166",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 1,
"enunciado": "Qual canal do VHF marítimo é usado exclusivamente para a chamada seletiva digital (DSC), inclusive para o alerta de socorro, e qual é a sua frequência?",
"alternativas": [
"Canal 70, 156,525 MHz.",
"Canal 16, 156,800 MHz.",
"Canal 68, 156,425 MHz.",
"Canal 13, 156,650 MHz.",
"Canal 6, 156,300 MHz."
],
"correta": 0,
"explicacao": "<p>O canal 70 (156,525 MHz) é reservado ao DSC. Nele o rádio envia o alerta digital de socorro com MMSI, posição e natureza do perigo, e a NORMAM-211 admite o canal 70, no lugar do 16, para a chamada seletiva digital de equipamento DSC (art. 4.23.4 a).</p><ul><li><b>Canal 16, 156,800 MHz.</b>: é o canal de voz para socorro, urgência e segurança, e não o da chamada digital.</li><li><b>Canal 68, 156,425 MHz.</b>: é um canal de trabalho para a comunicação de voz, sem relação com a chamada digital.</li><li><b>Canal 13, 156,650 MHz.</b>: é o canal de segurança da navegação entre embarcações, usado por voz.</li><li><b>Canal 6, 156,300 MHz.</b>: é o canal de segurança entre navios e de coordenação de busca e salvamento, usado por voz.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.4 a); UIT, Regulamento de Radiocomunicações, Apêndice 18",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0167",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Segundo a NORMAM-211, como deve ser a identificação (código único) de uma EPIRB instalada em uma embarcação brasileira?",
"alternativas": [
"Começa por 406 (a frequência), seguido de seis dígitos da estação, e a baliza é cadastrada na Anatel.",
"Começa por 710 (Brasil), seguido de seis dígitos da estação (o MMSI), e a baliza é cadastrada no INFOSAR.",
"Começa por 121, seguido do número de inscrição do casco, e a baliza dispensa qualquer cadastro.",
"Usa o indicativo de chamada do barco, no lugar do MMSI, e a baliza é cadastrada na Capitania dos Portos.",
"Começa por 970, o mesmo prefixo dos aparelhos AIS-SART, seguido de seis dígitos, e é cadastrada no DECEA."
],
"correta": 1,
"explicacao": "<p>A norma exige código único formado pelo dígito 710 (Brasil) e por seis dígitos que identificam a estação, o MMSI, conforme o Apêndice 43 do Regulamento de Radiocomunicações da UIT. Toda EPIRB deve ser cadastrada no INFOSAR, e mudanças de dono, endereço ou telefone devem ser atualizadas lá.</p><ul><li><b>Prefixo 406</b>: 406 MHz é a frequência de transmissão da baliza, e o cadastro das balizas é feito no INFOSAR, do DECEA.</li><li><b>Prefixo 121</b>: 121,5 MHz é uma frequência antiga que já não é processada por satélite, e a norma exige cadastro.</li><li><b>Indicativo de chamada</b>: o código é o MMSI, e não o indicativo do barco; o cadastro é no INFOSAR, e não na Capitania.</li><li><b>Prefixo 970</b>: 970 identifica o AIS-SART; o prefixo do Brasil, em qualquer MMSI de navio brasileiro, é 710.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 d), e) e f)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0168",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Um veleiro tem a antena do VHF a 9 m acima da água e quer chamar uma estação costeira cuja antena está a 16 m de altura. Pela fórmula D ≈ 2,2 × (√h<sub>1</sub> + √h<sub>2</sub>), com D em milhas náuticas e as alturas em metros, o alcance esperado em VHF é de cerca de:",
"alternativas": [
"7 milhas.",
"11 milhas.",
"15 milhas.",
"25 milhas.",
"55 milhas."
],
"correta": 2,
"explicacao": "<p>√9 = 3 e √16 = 4, então D ≈ 2,2 × (3 + 4) = 2,2 × 7 = 15,4, ou cerca de 15 milhas. O VHF propaga-se em linha de visada, e por isso o alcance cresce com a altura das duas antenas.</p><ul><li><b>7 milhas.</b>: esquece de multiplicar por 2,2: 3 + 4 = 7 não é o alcance em milhas.</li><li><b>11 milhas.</b>: calcula 2,2 × √(9 + 16) = 2,2 × 5; a fórmula pede a soma das raízes, e não a raiz da soma.</li><li><b>25 milhas.</b>: soma as alturas (9 + 16) sem tirar a raiz nem aplicar o fator 2,2.</li><li><b>55 milhas.</b>: faz 2,2 × (9 + 16), sem tirar as raízes; assim o alcance fica muito exagerado.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 34, item 34.4 (propagação em visada direta no VHF); horizonte de rádio com raio efetivo da Terra de 4/3 (UIT-R P.834), que dá D ≈ 2,2 × (√h1 + √h2)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0169",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "O receptor NAVTEX de um iate imprime uma mensagem cujo cabeçalho é <b>ZCZC KB07</b>. Segundo a estrutura das mensagens NAVTEX, o que significa a letra <b>B</b> nesse cabeçalho?",
"alternativas": [
"A estação transmissora, que seria a letra B da lista da área.",
"A prioridade da mensagem, sendo B de baixa urgência.",
"O idioma da transmissão, sendo B de bilíngue.",
"O assunto da mensagem, neste caso um aviso meteorológico.",
"A frequência de transmissão, sendo B a de 518 kHz."
],
"correta": 3,
"explicacao": "<p>O cabeçalho é ZCZC B1 B2 B3 B4. B1 (aqui K) identifica a estação transmissora, B2 (aqui B) o assunto, que no caso é aviso meteorológico, e B3B4 (aqui 07) o número de série da mensagem. O texto termina em NNNN.</p><ul><li><b>Estação transmissora</b>: a estação é identificada pela primeira letra depois de ZCZC, que aqui é K.</li><li><b>Prioridade</b>: a prioridade da mensagem não é indicada por essa letra; a segunda letra do cabeçalho indica o assunto.</li><li><b>Idioma</b>: o idioma não é indicado no cabeçalho: no NAVTEX internacional ele é sempre o inglês.</li><li><b>Frequência</b>: a frequência não consta do cabeçalho; ela é escolhida no receptor, e o 518 kHz é a do NAVTEX internacional.</li></ul>",
"referencia": "IMO, Manual NAVTEX (MSC.1/Circ.1403); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.3.7",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0170",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Um veleiro está no meio do Atlântico Sul, a cerca de 900 milhas da costa, e quer receber automaticamente os avisos náuticos e meteorológicos oficiais, sem precisar pedi-los por rádio. Qual meio do GMDSS atende a essa situação?",
"alternativas": [
"O NAVTEX em 518 kHz, cujo alcance é de cerca de 400 milhas da costa.",
"O alerta DSC no canal 70, que transmite os boletins meteorológicos a todos os navios da área.",
"O VHF no canal 16, cujo alcance chega a toda a bacia oceânica por reflexão na ionosfera.",
"A EPIRB de 406 MHz, que também recebe os avisos pelo sistema de satélites Cospas-Sarsat.",
"O SafetyNET, com receptor EGC do Inmarsat-C, que recebe por satélite os avisos da região."
],
"correta": 4,
"explicacao": "<p>No alto-mar, fora do alcance do NAVTEX, a informação de segurança marítima chega pelo SafetyNET (Inmarsat-C, receptor EGC), que entrega as mensagens automaticamente a quem está na área de cobertura. O Brasil, como responsável pela NAVAREA V, transmite seus avisos náuticos por esse meio.</p><ul><li><b>NAVTEX</b>: a 900 milhas da costa o veleiro está muito além do alcance das estações NAVTEX, e a NAVAREA V brasileira não usa esse serviço.</li><li><b>DSC no canal 70</b>: o DSC serve para chamadas e alertas curtos, não para a difusão de boletins de segurança marítima.</li><li><b>EPIRB</b>: a EPIRB só transmite o alerta de socorro, e o Cospas-Sarsat não envia avisos aos navios.</li><li><b>VHF no canal 16</b>: o VHF segue em linha de visada e alcança poucas dezenas de milhas; a reflexão na ionosfera é característica do HF.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, itens 47.3.3 e 47.3.7; IMO, SOLAS, Capítulo IV",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0171",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Na tela do radar de um navio de busca, em banda de 9 GHz, aparece uma linha de doze pontos igualmente espaçados, que se estende para fora do centro da tela, na direção de uma marcação, como mostra a figura. Qual é a interpretação mais provável?",
"alternativas": [
"Um radar-SART ativado, de uma balsa ou de um náufrago, na marcação indicada pela linha.",
"Um RACON de uma boia de balizamento, que responde ao radar com uma letra em código Morse.",
"Uma EPIRB de 406 MHz ativada, que aparece no radar como uma linha de pontos.",
"Uma frente de chuva forte, cujos ecos formam linhas de pontos no radar.",
"Um AIS-SART, cujos doze alvos aparecem na tela do radar."
],
"correta": 0,
"explicacao": "<p>O radar-SART opera em 9 GHz e, ao ser iluminado pelo radar de um navio ou de uma aeronave, responde com uma série de sinais que formam uma linha de doze pontos. A linha se estende, a partir da posição do transponder, na direção da marcação do transponder, e indica para onde seguir.</p><ul><li><b>RACON</b>: o RACON aparece como uma faixa de sinal que forma uma letra Morse, e não como doze pontos.</li><li><b>EPIRB</b>: a EPIRB transmite para satélites em 406 MHz e não é vista no radar de 9 GHz.</li><li><b>Frente de chuva</b>: a chuva forma manchas e faixas de eco irregulares, e não doze pontos igualmente espaçados.</li><li><b>AIS-SART</b>: o AIS-SART transmite mensagens AIS, vistas em receptor AIS ou no plotter, e não responde ao radar.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.3.5; UIT-R M.628",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 220 200\" width=\"100%\" role=\"img\" aria-label=\"Tela de radar com uma linha de doze pontos que se estende para fora do centro, a partir do nosso navio\" style=\"max-width:320px;display:block;margin:0 auto;font-size:13px\" xmlns=\"http://www.w3.org/2000/svg\"><title>Tela de radar com uma linha de doze pontos na direção de uma marcação</title><circle cx=\"110\" cy=\"100\" r=\"92\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"110\" cy=\"100\" r=\"61\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" opacity=\".4\"/><circle cx=\"110\" cy=\"100\" r=\"30\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" opacity=\".4\"/><line x1=\"110\" y1=\"8\" x2=\"110\" y2=\"192\" stroke=\"currentColor\" stroke-width=\"1\" opacity=\".25\"/><line x1=\"18\" y1=\"100\" x2=\"202\" y2=\"100\" stroke=\"currentColor\" stroke-width=\"1\" opacity=\".25\"/><path d=\"M110 94 L116 106 L104 106 Z\" fill=\"var(--ink)\"/><text x=\"110\" y=\"124\" text-anchor=\"middle\" fill=\"var(--ink)\">nosso navio</text><g fill=\"var(--nav-green)\" stroke=\"var(--ink)\" stroke-width=\"0.6\"><circle cx=\"126.5\" cy=\"77.3\" r=\"2\" /><circle cx=\"129.6\" cy=\"73.0\" r=\"2\" /><circle cx=\"132.8\" cy=\"68.6\" r=\"2\" /><circle cx=\"136.0\" cy=\"64.2\" r=\"2\" /><circle cx=\"139.2\" cy=\"59.9\" r=\"2\" /><circle cx=\"142.3\" cy=\"55.5\" r=\"2\" /><circle cx=\"145.5\" cy=\"51.1\" r=\"2\" /><circle cx=\"148.7\" cy=\"46.8\" r=\"2\" /><circle cx=\"151.9\" cy=\"42.4\" r=\"2\" /><circle cx=\"155.0\" cy=\"38.0\" r=\"2\" /><circle cx=\"158.2\" cy=\"33.7\" r=\"2\" /><circle cx=\"161.4\" cy=\"29.3\" r=\"2\" /></g><text x=\"12\" y=\"192\" fill=\"var(--ink)\">Norte para cima</text></svg>"
}
},
{
"id": "capitao-0172",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "A EPIRB de um veleiro foi ativada por engano durante uma limpeza do barco, em porto. Além de desligá-la, o que o comandante deve fazer?",
"alternativas": [
"Nada, porque o satélite só confirma o alerta se o sinal durar mais de 48 horas seguidas.",
"Avisar o SALVAMAR (185) ou o BRMCC: nome do barco, código da baliza e aviso de alarme falso.",
"Enviar um alerta DSC de socorro no canal 70 para cancelar o sinal do satélite.",
"Esperar a ligação do centro de salvamento antes de qualquer contato, para não congestionar o canal 16.",
"Retirar a bateria e guardar a baliza, pois o INFOSAR cancela o alerta automaticamente."
],
"correta": 1,
"explicacao": "<p>O alerta de uma baliza de 406 MHz é recebido pelo BRMCC, que aciona o SALVAERO e o SALVAMAR. Por isso, ao desligar uma baliza disparada por engano, avisa-se o SALVAMAR (telefone 185) ou o BRMCC, com o nome do barco, o código e a informação de que foi alarme falso, e assim nenhum meio de busca é mobilizado em vão.</p><ul><li><b>Não fazer nada</b>: o alerta é recebido logo, e o BRMCC pode acionar meios de salvamento antes de qualquer confirmação.</li><li><b>Retirar a bateria</b>: o INFOSAR é um cadastro de balizas e não cancela alertas; desligar sem avisar deixa o alerta valendo no centro de controle.</li><li><b>Alerta DSC</b>: o DSC não cancela o alerta da EPIRB, e um alerta de socorro por engano criaria um segundo falso alarme.</li><li><b>Esperar a ligação</b>: quem causou o alarme falso deve avisar logo, para que meios de busca não sejam enviados sem necessidade.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6; DECEA, INFOSAR e BRMCC; Marinha do Brasil, SALVAMAR (telefone 185)",
"fonte_url": "https://www.marinha.mil.br/cpm/185"
},
{
"id": "capitao-0173",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Um veleiro de 14 m (embarcação de médio porte) fará a travessia Recife–Mindelo, em navegação oceânica. Qual é a dotação de radiocomunicações que a NORMAM-211 exige para essa embarcação?",
"alternativas": [
"VHF portátil e EPIRB de 406 MHz, pois o HF só é exigido de embarcações de grande porte.",
"VHF com DSC, HF com DSC, transponder radar de 9 GHz e EPIRB, como nos iates e embarcações de grande porte.",
"VHF com DSC, HF com DSC (ou telefone ou comunicador satelital equivalente) e EPIRB de 406 MHz.",
"VHF com DSC e EPIRB de 406 MHz; o HF e o telefone satelital são dispensados em qualquer porte.",
"VHF com DSC, receptor NAVTEX de 518 kHz e SART, como nos navios sujeitos à SOLAS."
],
"correta": 2,
"explicacao": "<p>Para o médio porte em navegação oceânica, a NORMAM-211 exige VHF com DSC, HF com DSC e EPIRB de 406 MHz. O HF com DSC pode ser trocado por telefone satelital (Iridium ou Inmarsat) ou comunicador satelital que envie mensagens de socorro. Um veleiro de 14 m é de médio porte: pelo Glossário da NORMAM-211, médio porte é o que tem comprimento inferior a 24 m, exceto as miúdas (até 6 m).</p><ul><li><b>VHF portátil e EPIRB</b>: o HF com DSC (ou o equivalente por satélite) é exigido também do médio porte na navegação oceânica.</li><li><b>Lista do grande porte</b>: o transponder de 9 GHz (SART) está na lista do grande porte ou iate (art. 4.24.1, III), e não na do médio porte.</li><li><b>Dispensa do HF</b>: a dispensa do HF vale na navegação costeira de médio porte, e não na oceânica.</li><li><b>Dotação da SOLAS</b>: a NORMAM-211 não pede receptor NAVTEX nessa tabela e exige a EPIRB de 406 MHz.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.24.2 a); Glossário (embarcação de médio porte)",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0174",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "A NORMAM-211 exige que o VHF portátil, para uso no abandono da embarcação, tenha bateria para operar por no mínimo quatro horas, com coeficiente de utilização de 1:9, isto é, um minuto de transmissão para nove minutos de escuta. Em quatro horas nesse regime, durante quantos minutos o rádio transmite?",
"alternativas": [
"27 minutos.",
"216 minutos.",
"48 minutos.",
"24 minutos.",
"60 minutos."
],
"correta": 3,
"explicacao": "<p>Quatro horas são 240 minutos. Cada ciclo de 1:9 dura 10 minutos (1 transmitindo e 9 escutando), e 240 ÷ 10 = 24 ciclos. Logo o rádio transmite 24 × 1 = 24 minutos e escuta 216.</p><ul><li><b>27 minutos.</b>: divide 240 min por 9, mas a proporção 1:9 forma ciclos de 10 minutos (1 de transmissão e 9 de escuta).</li><li><b>216 minutos.</b>: é o tempo de escuta (240 − 24), e não o de transmissão.</li><li><b>48 minutos.</b>: corresponde a 2 minutos de transmissão por ciclo de 10, e não a 1.</li><li><b>60 minutos.</b>: é um quarto do tempo total, o que não corresponde à proporção de 1 para 9.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.3",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "capitao-0175",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 2,
"enunciado": "Num naufrágio, a EPIRB de 406 MHz de um veleiro brasileiro é ativada, mas o dono nunca a cadastrou no INFOSAR. O que acontece com o alerta?",
"alternativas": [
"O alerta é descartado, porque o Cospas-Sarsat só aceita balizas cadastradas no INFOSAR.",
"O alerta é tratado como teste, e o BRMCC espera uma nova ativação por 48 horas antes de agir.",
"O alerta vai apenas para a Anatel, que o repassa ao SALVAMAR depois de conferir a licença de estação.",
"O alerta é recebido, mas o salvamento só é acionado depois que o dono confirmar o cadastro por telefone.",
"O alerta chega ao BRMCC e é tratado como emergência; o cadastro só ajuda a identificar o barco."
],
"correta": 4,
"explicacao": "<p>Um alerta de baliza de 406 MHz não registrada também é recebido pelo BRMCC e tratado como emergência. O cadastro no INFOSAR existe para identificar rapidamente a embarcação e o proprietário, e é exigido de toda EPIRB pela NORMAM-211.</p><ul><li><b>Alerta descartado</b>: o sinal de uma baliza de 406 MHz é recebido mesmo sem registro e tratado como emergência.</li><li><b>Espera de 48 horas</b>: não há espera: as 48 horas são a autonomia mínima de transmissão da baliza, e não um prazo de confirmação.</li><li><b>Alerta para a Anatel</b>: o alerta é recebido pelo BRMCC, que aciona os serviços de busca e salvamento; a Anatel não entra nessa cadeia.</li><li><b>Confirmação do dono</b>: o salvamento não depende dessa confirmação; o cadastro serve para facilitar a identificação.</li></ul>",
"referencia": "NORMAM-211/DPC, art. 4.23.6 e) e f); DECEA, Central de Ajuda do INFOSAR",
"fonte_url": "https://ajuda.decea.mil.br/base-de-conhecimento/no-caso-do-recebimento-do-sinal-de-emergen"
},
{
"id": "capitao-0176",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 3,
"enunciado": "Um veleiro com rádio HF com DSC navega no meio do Atlântico. Na banda de 8 MHz, quais são as frequências do alerta DSC de socorro e da radiotelefonia de socorro, respectivamente?",
"alternativas": [
"8.414,5 kHz (DSC) e 8.291 kHz (voz).",
"12.577 kHz (DSC) e 12.290 kHz (voz).",
"4.207,5 kHz (DSC) e 4.125 kHz (voz).",
"8.291 kHz (DSC) e 8.414,5 kHz (voz).",
"2.187,5 kHz (DSC) e 2.182 kHz (voz)."
],
"correta": 0,
"explicacao": "<p>No GMDSS cada banda tem um par fixo: DSC e voz. Em 8 MHz, o DSC é 8.414,5 kHz e a voz de socorro é 8.291 kHz. Nas outras bandas, os pares são 4.207,5/4.125, 6.312/6.215, 12.577/12.290 e 16.804,5/16.420 kHz, e em MF, 2.187,5/2.182 kHz.</p><ul><li><b>8.291 kHz (DSC) e 8.414,5 kHz (voz).</b>: inverte as duas: 8.414,5 kHz é do DSC e 8.291 kHz é da voz.</li><li><b>12.577 kHz (DSC) e 12.290 kHz (voz).</b>: é o par da banda de 12 MHz, e não o da de 8 MHz.</li><li><b>4.207,5 kHz (DSC) e 4.125 kHz (voz).</b>: é o par da banda de 4 MHz, a que a NORMAM-211 indica para a escuta no Atlântico Sul.</li><li><b>2.187,5 kHz (DSC) e 2.182 kHz (voz).</b>: é o par da faixa de MF, e não o da banda de 8 MHz do HF.</li></ul>",
"referencia": "UIT, Regulamento de Radiocomunicações, Apêndice 15; Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.4",
"fonte_url": "https://www.itu.int/pub/R-REG-RR"
},
{
"id": "capitao-0177",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 3,
"enunciado": "O plotter de um veleiro mostra um alvo AIS cujo MMSI começa por 974, sem nome nem destino. O que esse prefixo indica?",
"alternativas": [
"Um AIS-SART de balsa salva-vidas, pois todos os prefixos 97x identificam o AIS-SART.",
"Uma EPIRB com AIS, tratada como emergência real: o socorro deve ser acionado.",
"Um localizador pessoal de homem ao mar (MOB), que usa o prefixo 974.",
"Uma boia ou farol com AIS (auxílio à navegação), que usa o prefixo 974.",
"Uma estação costeira de AIS, que usa prefixos de 974 a 979 para serviços em terra."
],
"correta": 1,
"explicacao": "<p>Dispositivos AIS de emergência têm prefixos próprios: 970 para o AIS-SART, 972 para o localizador pessoal de homem ao mar e 974 para a EPIRB com AIS. Ao ver um deles no plotter, trata-se como emergência real: anota-se a posição e aciona-se o socorro.</p><ul><li><b>AIS-SART</b>: o AIS-SART usa o prefixo 970; os demais prefixos 97x têm outros dispositivos.</li><li><b>Localizador MOB</b>: o localizador pessoal de homem ao mar usa o prefixo 972.</li><li><b>Auxílio à navegação</b>: os auxílios à navegação com AIS usam MMSI com prefixo 99.</li><li><b>Estação costeira</b>: as estações costeiras usam MMSI com prefixo 00, e a faixa 974 a 979 não é para serviços em terra.</li></ul>",
"referencia": "UIT-R M.585 (atribuição e uso de MMSI); Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.3.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Volume%20III%20%281%C2%AA%20Revis%C3%A3o%29%202026.pdf"
},
{
"id": "capitao-0178",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 3,
"enunciado": "Uma EPIRB sem receptor GNSS interno é ativada, e o alerta é captado primeiro por um satélite geoestacionário (GEOSAR). O alerta chega de imediato ao centro de controle, mas sem a posição da baliza. Por quê?",
"alternativas": [
"O satélite geoestacionário só escuta a antiga frequência de 121,5 MHz, que não leva a posição.",
"O satélite geoestacionário só retransmite o código da baliza, e a posição seria calculada pelo rádio VHF do navio.",
"O satélite geoestacionário fica parado em relação à baliza, e sem o efeito Doppler a posição não é calculada.",
"O cálculo da posição por efeito Doppler exige que a baliza esteja na área A1, com cobertura de VHF.",
"O efeito Doppler só se forma com satélites de órbita média, e nunca com os de órbita baixa (LEOSAR)."
],
"correta": 2,
"explicacao": "<p>Os satélites de órbita baixa (LEOSAR) se movem depressa em relação à baliza, e a variação de frequência do sinal (efeito Doppler) dá a posição. O satélite geoestacionário (GEOSAR) parece parado: o alerta é imediato, mas a posição só aparece se a baliza tiver GNSS e a incluir na mensagem.</p><ul><li><b>Posição pelo VHF</b>: o VHF do navio não participa do cálculo da posição de uma baliza de 406 MHz.</li><li><b>Só escuta 121,5 MHz</b>: o GEOSAR escuta 406 MHz, tanto que o alerta chega de imediato ao centro de controle.</li><li><b>Exige a área A1</b>: o cálculo por Doppler não depende de cobertura de VHF, e sim do movimento do satélite em relação à baliza.</li><li><b>Doppler só em órbita média</b>: é justamente o satélite de órbita baixa (LEOSAR) que obtém a posição pelo Doppler.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. III, cap. 47, item 47.3.1; Cospas-Sarsat, visão geral do sistema",
"fonte_url": "https://cospas-sarsat.int/en/system-overview/cospas-sarsat-system"
},
{
"id": "capitao-0179",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 3,
"enunciado": "Um veleiro está em 12°S 015°W, no Atlântico Sul. Considerando apenas os limites em longitude, o que se pode afirmar sobre essa posição? (A região SAR marítima do Brasil e a NAVAREA V/METAREA V estendem-se, a partir da costa brasileira, até limites a leste.)",
"alternativas": [
"Está dentro da região SAR e da NAVAREA V, pois os limites das duas a leste são 10°W.",
"Está dentro da região SAR e da NAVAREA V, pois a SAR vai até 20°W e a NAVAREA V até 10°W.",
"Está fora da região SAR e da NAVAREA V, pois os limites das duas a leste são 20°W.",
"Está na região SAR (até 10°W) e fora da NAVAREA V e da METAREA V (até 20°W).",
"Está dentro da NAVAREA V (até 10°W) e fora da região SAR, que terminaria em 30°W."
],
"correta": 3,
"explicacao": "<p>A região SAR atribuída ao Brasil vai da costa até o meridiano de 10°W, e a NAVAREA V e a METAREA V vão até 20°W. Como 15°W está a leste de 20°W e a oeste de 10°W, a posição é atendida pela busca e salvamento brasileiros, mas os avisos náuticos e meteorológicos dessa posição são de outra área.</p><ul><li><b>Limites trocados</b>: a SAR vai até 10°W e a NAVAREA V até 20°W; com os limites corretos, 15°W fica fora da NAVAREA V.</li><li><b>Os dois em 20°W</b>: o limite a leste da SAR é 10°W, mais a leste que 20°W, e por isso 15°W está dentro dela.</li><li><b>Os dois em 10°W</b>: a NAVAREA V termina em 20°W; 15°W fica a leste desse limite, ou seja, fora dela.</li><li><b>SAR em 30°W</b>: a SAR brasileira vai até 10°W, bem além de 30°W; 15°W está dentro dela e fora da NAVAREA V.</li></ul>",
"referencia": "SALVAMAR Brasil, FAQ (região SAR até 10°W); IHO, WWNWS, NAVAREA V (limite 20°W); WMO-IMO, METAREA V",
"fonte_url": "https://www.marinha.mil.br/salvamarbrasil/node/49"
},
{
"id": "capitao-0180",
"nivel": "capitao",
"tema": "Comunicações e GMDSS",
"dificuldade": 3,
"enunciado": "Em mar aberto, um comandante ouve pelo VHF uma chamada MAYDAY de outro veleiro, com posição e natureza do perigo. Passam-se alguns minutos e nenhuma estação responde. Qual é a conduta correta?",
"alternativas": [
"Ficar em silêncio, pois só estações costeiras ou navios sob a SOLAS podem agir numa chamada MAYDAY.",
"Responder com PAN-PAN, oferecendo ajuda a todos os navios que estejam próximos.",
"Impor silêncio no canal dizendo SEELONCE MAYDAY, já que nenhuma estação respondeu.",
"Repetir a chamada como se fosse um MAYDAY do próprio barco, usando a posição recebida.",
"Anotar os dados e retransmiti-los por voz, com MAYDAY RELAY, para alcançar quem possa ajudar."
],
"correta": 4,
"explicacao": "<p>A estação que ouve um socorro sem resposta anota posição, natureza do perigo e demais dados e os retransmite por voz, precedidos de MAYDAY RELAY, para que uma estação costeira, um navio ou o centro de salvamento tome conhecimento e aja.</p><ul><li><b>Ficar em silêncio</b>: qualquer estação que ouça um socorro sem resposta deve colaborar, e o silêncio deixa o veleiro sem ajuda.</li><li><b>Responder com PAN-PAN</b>: PAN-PAN é o sinal de urgência e não serve para atender ou retransmitir um socorro.</li><li><b>SEELONCE MAYDAY</b>: só a estação que coordena o socorro, ou a própria embarcação em perigo, impõe silêncio ao canal.</li><li><b>Repetir como seu</b>: isso faria o próprio barco parecer em perigo, na posição errada, e confundiria o salvamento.</li></ul>",
"referencia": "UIT, Regulamento de Radiocomunicações, Art. 32; Lista de Auxílios-Rádio (DHN), cap. 7",
"fonte_url": "https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-08/LAR-15ED-2026-2030-Completa.pdf"
},
{
"id": "capitao-0181",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "Na passagem meridiana, um veleiro está na latitude estimada 30° N, e a declinação do Sol é S 10°. Para o observador, o Sol cruzará o meridiano superior:",
"alternativas": [
"ao Sul do zênite, com altura de 50° e azimute 180°.",
"ao Norte do zênite, com altura de 50° e azimute 000°.",
"exatamente no zênite, com altura de 90°.",
"ao Sul do zênite, com altura de 40° e azimute 180°.",
"ao Norte do zênite, com altura de 40° e azimute 000°."
],
"correta": 0,
"explicacao": "<p>Compara-se a declinação com a latitude. δ = S 10° (−10°) é menor que φ = N 30° (+30°), então o Sol passa ao Sul do zênite, com azimute 180°. A distância zenital é z = φ − δ = 30° + 10° = 40°, e a altura é 90° − 40° = 50°.</p><ul><li><b>Lado Norte</b>: o Sol só passa ao Norte do zênite quando a declinação é maior que a latitude; aqui ela é menor. Por isso a alternativa com 000° está errada, mesmo com a altura certa.</li><li><b>Exatamente no zênite</b>: isso só ocorre se a declinação for igual à latitude, o que não é o caso.</li><li><b>Altura de 40°</b>: 40° é a distância zenital, e não a altura; a altura é 90° − 40° = 50°.</li><li><b>Norte com altura de 40°</b>: erra o lado e também confunde a distância zenital com a altura.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0182",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "A altura verdadeira do centro do Sol na culminação foi 72° 18,4′. A distância zenital é:",
"alternativas": [
"17° 18,4′",
"17° 41,6′",
"18° 41,6′",
"107° 41,6′",
"162° 18,4′"
],
"correta": 1,
"explicacao": "<p>z = 90° − a = 89° 60,0′ − 72° 18,4′ = 17° 41,6′. A altura e a distância zenital são complementares: a + z = 90°.</p><ul><li><b>17° 18,4′</b>: esquece que 90° valem 89° 60,0′; assim os minutos de 72° 18,4′ são simplesmente copiados.</li><li><b>18° 41,6′</b>: faz 90° − 72° = 18° e 60′ − 18,4′ = 41,6′, mas esquece de reduzir de 1° os graus ao tomar emprestados os 60′.</li><li><b>107° 41,6′</b>: usa 180° − a, que não é a distância zenital.</li><li><b>162° 18,4′</b>: soma 90° à altura, em vez de subtraí-la de 90°.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0183",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 1,
"enunciado": "No instante da passagem meridiana superior, o ângulo horário do Sol em Greenwich (AHG) é 295° 40,0′. A longitude do observador é:",
"alternativas": [
"064° 20,0′ W",
"295° 40,0′ W",
"064° 20,0′ E",
"115° 40,0′ W",
"295° 40,0′ E"
],
"correta": 2,
"explicacao": "<p>Na culminação o AHL é zero, então a longitude Oeste é igual ao AHG. Como o AHG passa de 180°, a longitude é Leste: λ = 360° − 295° 40,0′ = 064° 20,0′ E.</p><ul><li><b>064° 20,0′ W</b>: o valor está certo, mas o nome é Leste: AHG maior que 180° dá longitude Leste.</li><li><b>295° 40,0′ W</b>: usa o AHG como longitude; isso só vale quando o AHG é de até 180° (e então a longitude é Oeste).</li><li><b>295° 40,0′ E</b>: não reduz o AHG ao intervalo de 0° a 180°; uma longitude não passa de 180°.</li><li><b>115° 40,0′ W</b>: subtrai 180° do AHG; para AHG maior que 180° o cálculo certo é 360° − AHG, e o nome é Leste.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 26, itens 26.5 e 26.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0184",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Em 10 de julho de 2026, no Oceano Índico, o Almanaque Náutico (extrato simulado) dá Pass. Mer. = 12h 05m (hora média local). A posição estimada do veleiro é 25° S, 040° 00′ E. A hora legal prevista da culminação do Sol é:",
"alternativas": [
"06h 25m",
"09h 25m",
"14h 45m",
"12h 25m",
"12h 05m"
],
"correta": 3,
"explicacao": "<p>Longitude: 40° × 4 = 160 min = 2h 40m, a Leste. HMG = HML − λ = 12h 05m − 2h 40m = 09h 25m. Fuso: 40° ÷ 15 = 2, resto 10°, maior que 7,5°, então 3; a Leste é negativo: −3. Hleg = HMG − (−3) = 09h 25m + 3h = 12h 25m. A Leste, a HMG fica antes do meio-dia e a hora legal, depois.</p><ul><li><b>06h 25m</b>: trata o fuso como +3 e subtrai 3 h da HMG; a Leste o fuso é −3, e a conta Hleg = HMG − fuso soma 3 h.</li><li><b>09h 25m</b>: é a HMG da culminação; falta passar para a hora legal.</li><li><b>14h 45m</b>: soma a longitude à HML, o que vale para longitude Oeste; a Leste ela se subtrai.</li><li><b>12h 05m</b>: é a própria Pass. Mer., que é hora média local; faltam a longitude e o fuso.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 25, item 25.3; cap. 19, itens 19.4 e 19.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0185",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Na observação do Sol (limbo inferior) na culminação, o sextante marcou altura instrumental de 62° 14,0′. O erro instrumental é +1,2′ (aplica-se com o sinal), a elevação do olho é 4,0 m (dp = −1,76′ × √h) e a correção da Tábua A2 para essa altura e limbo é +15,8′. A altura verdadeira é:",
"alternativas": [
"62° 25,1′",
"61° 55,9′",
"62° 34,5′",
"62° 11,7′",
"62° 27,5′"
],
"correta": 4,
"explicacao": "<p>ao = ai + ei = 62° 14,0′ + 1,2′ = 62° 15,2′. dp = −1,76′ × √4,0 = −3,5′, logo a altura aparente é 62° 15,2′ − 3,5′ = 62° 11,7′. Com a correção da A2 no limbo inferior, a = 62° 11,7′ + 15,8′ = 62° 27,5′.</p><ul><li><b>62° 25,1′</b>: subtrai o erro instrumental de +1,2′, quando ele deve ser somado, com o seu sinal.</li><li><b>62° 34,5′</b>: soma a depressão do horizonte (3,5′); ela é sempre negativa, pois o horizonte visível fica abaixo do verdadeiro.</li><li><b>62° 11,7′</b>: é a altura aparente; falta aplicar a correção da Tábua A2 (refração, semidiâmetro e paralaxe).</li><li><b>61° 55,9′</b>: subtrai a correção da A2, o que seria o caso do limbo superior; no limbo inferior ela é positiva.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 22, itens 22.2 e 22.3.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0186",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 2,
"enunciado": "Na passagem meridiana, a declinação do Sol é S 15° 20,0′ e a altura verdadeira é 62° 35,0′. A latitude estimada é 12° N. A latitude meridiana é:",
"alternativas": [
"12° 05,0′ N",
"13° 05,0′ N",
"12° 05,0′ S",
"42° 45,0′ S",
"42° 45,0′ N"
],
"correta": 0,
"explicacao": "<p>z = 90° − 62° 35,0′ = 27° 25,0′. Como δ = −15° 20,0′ é menor que a latitude estimada (+12°), o Sol passa ao Sul do zênite e φ = δ + z = −15° 20,0′ + 27° 25,0′ = +12° 05,0′, isto é, 12° 05,0′ N. Está perto da estimada, o que confirma o resultado.</p><ul><li><b>13° 05,0′ N</b>: erra a soma: −15° 20,0′ + 27° 25,0′ dá 12° 05,0′, e não 13° 05,0′.</li><li><b>12° 05,0′ S</b>: o valor está certo, mas o nome é Norte, coerente com a latitude estimada.</li><li><b>42° 45,0′ S</b>: aplica φ = δ − z, regra do Sol ao Norte; aqui o Sol passa ao Sul e o resultado ficaria a mais de 30° da estimada.</li><li><b>42° 45,0′ N</b>: soma em módulo a declinação (15° 20′) e z (27° 25′), ignorando que os nomes são contrários.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 25, itens 25.4 e 25.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0187",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Em 13 de março de 2026, o veleiro “Maré Alta”, em 19° S, 038° 20′ W (fuso +3), observa a culminação do Sol às 11h 43m 20s de hora legal. A altura verdadeira já corrigida é 74° 03,7′. Do Almanaque (extrato simulado), na coluna do Sol, em HMG: 13h, Dec S 3° 10,4′; 14h, Dec S 3° 09,4′; 15h, Dec S 3° 08,4′; d = −1,0′ (a declinação, em número, diminui). Qual é a latitude meridiana?",
"alternativas": [
"19° 06,4′ S",
"19° 05,0′ S",
"19° 05,7′ S",
"19° 04,7′ S",
"12° 47,6′ N"
],
"correta": 1,
"explicacao": "<p>HMG = Hleg + fuso = 11h 43m 20s + 3h = 14h 43m 20s, e entra-se com 14h. Correção d = −1,0′ × 43/60 = −0,7′, então Dec = S 3° 09,4′ − 0,7′ = S 3° 08,7′. z = 90° − 74° 03,7′ = 15° 56,3′. O Sol passa ao Norte do zênite (δ = −3° 08,7′ é maior que φ = −19°), logo φ = δ − z = −3° 08,7′ − 15° 56,3′ = −19° 05,0′, ou 19° 05,0′ S.</p><ul><li><b>19° 06,4′ S</b>: soma a correção d (+0,7′) à declinação; como o número da declinação diminui, a correção é subtraída.</li><li><b>19° 05,7′ S</b>: usa a declinação da hora inteira sem aplicar a correção de 0,7′ para os 43 minutos.</li><li><b>19° 04,7′ S</b>: usa a declinação da coluna de 15h, sem correção.</li><li><b>12° 47,6′ N</b>: aplica φ = δ + z, que é a regra do Sol ao Sul; a declinação (−3°) é maior, com sinal, que a latitude estimada (−19°), então o Sol passa ao Norte.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 23, item 23.4; cap. 25, itens 25.3 a 25.5",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0188",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Em 22 de novembro de 2026, a equação do tempo (ET = hora verdadeira − hora média) vale +13m 50s ao meio-dia de Greenwich. Um veleiro está na longitude 051° 40′ W. Pelo método da hora verdadeira (meio-dia verdadeiro, HVL = 12h), qual é a hora legal, ao minuto, em que o Sol cruza o meridiano superior?",
"alternativas": [
"11h 13m",
"12h 41m",
"12h 13m",
"08h 46m",
"18h 13m"
],
"correta": 2,
"explicacao": "<p>HML = HVL − ET = 12h 00m 00s − 13m 50s = 11h 46m 10s. Longitude em tempo: 51° 40′ → 3h 26m 40s. HMG = 11h 46m 10s + 3h 26m 40s = 15h 12m 50s. Fuso: 51° 40′ ÷ 15 = 3, resto 6° 40′, menor que 7,5°, logo +3. Hleg = 15h 12m 50s − 3h = 12h 12m 50s, ou 12h 13m ao minuto. A ET positiva fez o Sol chegar antes das 12h médias, mas a hora legal fica depois do meio-dia porque o veleiro está a oeste do meridiano central do fuso.</p><ul><li><b>12h 41m</b>: soma a ET à hora verdadeira, em vez de subtraí-la; com ET positiva o Sol chega antes das 12h médias.</li><li><b>11h 13m</b>: usa o fuso +4; 51° 40′ ÷ 15 dá quociente 3 e resto 6° 40′, menor que 7,5°, portanto o fuso é +3.</li><li><b>08h 46m</b>: subtrai o fuso da HML, sem passar pela HMG; falta somar a longitude em tempo.</li><li><b>18h 13m</b>: soma o fuso à HMG, em vez de subtraí-lo.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, item 19.8; cap. 25, item 25.3 (2º método)",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0189",
"nivel": "capitao",
"tema": "Passagem meridiana",
"dificuldade": 3,
"enunciado": "Um veleiro na latitude 60° S navega no rumo 270° e percorre 90 milhas entre duas passagens meridianas consecutivas do Sol. Desprezando a variação da equação do tempo e sem mudança de fuso, a segunda passagem meridiana ocorre, na hora legal, cerca de:",
"alternativas": [
"12 minutos mais cedo que a primeira.",
"6 minutos mais tarde que a primeira.",
"3 minutos mais tarde que a primeira.",
"12 minutos mais tarde que a primeira.",
"24 minutos mais tarde que a primeira."
],
"correta": 3,
"explicacao": "<p>Em rumo 270°, o afastamento é 90′ e Δλ = afastamento ÷ cos φ = 90′ ÷ cos 60° = 90′ ÷ 0,5 = 180′ = 3° para Oeste. Cada grau de longitude vale 4 minutos de tempo, logo 3° × 4 = 12 minutos. Quem anda para Oeste encontra o Sol mais tarde, então a culminação atrasa 12 minutos.</p><ul><li><b>12 minutos mais cedo que a primeira.</b>: indo para Oeste, a culminação atrasa, e não adianta.</li><li><b>6 minutos mais tarde que a primeira.</b>: trata as 90 milhas como 1,5° de longitude, sem dividir pelo cosseno da latitude.</li><li><b>3 minutos mais tarde que a primeira.</b>: usa 3° de longitude com 1 minuto por grau; cada grau de longitude vale 4 minutos de tempo.</li><li><b>24 minutos mais tarde que a primeira.</b>: divide pelo cosseno duas vezes (ou converte 3° em 6°); a conta correta dá 3° de longitude.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, item 19.4.1; cap. 25, item 25.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0190",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 1,
"enunciado": "A longitude 047° 30′ W, expressa em unidades de tempo, vale:",
"alternativas": [
"3h 08m",
"3h 50m",
"3h 17m",
"3h 30m",
"3h 10m"
],
"correta": 4,
"explicacao": "<p>47° × 4 min = 188 min = 3h 08m e 30′ × 4 s = 120 s = 2m. Total: 3h 10m. Confere-se por 47,5° ÷ 15 = 3,1667 h = 3h 10m.</p><ul><li><b>3h 08m</b>: converte só os 47° (188 min = 3h 08m) e esquece que 30′ valem 2 minutos de tempo.</li><li><b>3h 17m</b>: divide 47,5 por 15 e obtém 3,17 h, mas o décimo de hora não é minuto: 0,17 h são cerca de 10 min.</li><li><b>3h 30m</b>: toma os 30′ de arco como 30 minutos de tempo; 1′ de arco vale 4 segundos.</li><li><b>3h 50m</b>: não corresponde à conversão: 15° = 1 h, 1° = 4 min e 1′ = 4 s.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, item 19.4.1",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0191",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Um veleiro fundeado em Bridgetown (Barbados) usa a hora do fuso +4 (Q). Seu relógio marca 21h 40m do dia 12 de março. Qual é a hora média de Greenwich (HMG) e a data correspondentes?",
"alternativas": [
"01h 40m do dia 13",
"17h 40m do dia 12",
"01h 40m do dia 12",
"21h 40m do dia 12",
"02h 40m do dia 13"
],
"correta": 0,
"explicacao": "<p>HMG = Hleg + fuso = 21h 40m + 4h = 25h 40m. Como passa de 24 h, subtrai-se 24 h e soma-se um dia: 01h 40m do dia 13. Em longitude Oeste a HMG é sempre maior que a hora local.</p><ul><li><b>17h 40m do dia 12</b>: subtrai o fuso da hora legal; para chegar à HMG ele se soma (HMG = Hleg + fuso).</li><li><b>01h 40m do dia 12</b>: acerta a hora, mas não avança a data ao passar de 24 h.</li><li><b>21h 40m do dia 12</b>: repete a hora legal; a HMG difere dela em 4 horas.</li><li><b>02h 40m do dia 13</b>: soma 5 horas; o fuso de Barbados, nesta conta, é +4.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, itens 19.5 e 19.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0192",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 2,
"enunciado": "Qual é o fuso horário teórico, com o sinal da convenção da DHN, de um navio na longitude 037° 40′ W?",
"alternativas": [
"+2 (O)",
"+3 (P)",
"+4 (Q)",
"−3 (C)",
"−2 (B)"
],
"correta": 1,
"explicacao": "<p>37° 40′ ÷ 15 dá quociente 2 e resto 7° 40′. Como o resto é maior que 7,5°, soma-se 1: fuso 3. Oeste é positivo na convenção da DHN: +3 (P). Cada fuso vai 7,5° para cada lado do meridiano central (45° W, no caso).</p><ul><li><b>+2 (O)</b>: divide 37° 40′ por 15 (quociente 2) e ignora que o resto de 7° 40′ passa de 7,5°.</li><li><b>+4 (Q)</b>: passa para o fuso seguinte sem necessidade; o quociente 2 mais 1 dá 3, e não 4.</li><li><b>−3 (C)</b>: o módulo está certo, mas o sinal é positivo a Oeste de Greenwich.</li><li><b>−2 (B)</b>: erra o sinal (Oeste é positivo) e também desconsidera o resto maior que 7,5°.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, item 19.3.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0193",
"nivel": "capitao",
"tema": "Tempo e fusos",
"dificuldade": 3,
"enunciado": "Um veleiro parte de Recife (fuso +3) às 08h do dia 10 e estima 12 dias e 18 horas de travessia até Mindelo, em Cabo Verde, onde a hora legal é a do fuso +1. Qual é a hora legal de chegada em Mindelo?",
"alternativas": [
"02h do dia 23",
"00h do dia 23",
"04h do dia 23",
"06h do dia 23",
"04h do dia 22"
],
"correta": 2,
"explicacao": "<p>HMG de partida = 08h + 3h = 11h do dia 10. HMG de chegada = 11h do dia 10 + 12 d 18 h = 29h do dia 22 = 05h do dia 23. Hleg em Mindelo = HMG − fuso = 05h − 1h = 04h do dia 23. Planejar em HMG evita erros de data e de fuso.</p><ul><li><b>02h do dia 23</b>: é a hora do relógio de Recife (fuso +3) na chegada; em Mindelo o relógio está 2 horas adiantado.</li><li><b>00h do dia 23</b>: atrasa 2 horas, em vez de adiantar, ao passar do fuso +3 para o +1.</li><li><b>06h do dia 23</b>: usa a HMG de chegada somada de 1 h, em vez de subtraí-la.</li><li><b>04h do dia 22</b>: acerta a hora, mas esquece de passar ao dia seguinte quando a soma passa de 24 h.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 19, itens 19.5 e 19.6",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0194",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 1,
"enunciado": "O ponto vernal (γ), origem para medir a ascensão reta e a ascensão reta versa das estrelas, é:",
"alternativas": [
"o ponto em que o Sol cruza o equador celeste, de Norte para Sul, no equinócio de setembro.",
"a interseção do meridiano de Greenwich com o equador celeste, que gira com a Terra.",
"o ponto da eclíptica em que o Sol atinge a maior declinação Norte, no solstício de junho.",
"o ponto em que o Sol cruza o equador celeste, de Sul para Norte, no equinócio de março.",
"o polo celeste elevado, cuja altura sobre o horizonte é igual à latitude do observador."
],
"correta": 3,
"explicacao": "<p>O ponto vernal (γ ou Áries) é o ponto em que o Sol passa do hemisfério Sul para o Norte, no equinócio de março, quando a eclíptica cruza o equador celeste. Ele gira com a esfera, junto com as estrelas, e é o “meridiano de Greenwich do céu”: a origem das coordenadas das estrelas.</p><ul><li><b>Equinócio de setembro</b>: é o ponto oposto do vernal, em que o Sol passa do hemisfério Norte para o Sul.</li><li><b>Solstício de junho</b>: é o ponto de maior declinação, a cerca de 90° do ponto vernal.</li><li><b>Meridiano de Greenwich</b>: o meridiano de Greenwich é a origem dos ângulos horários, e não o ponto vernal, que acompanha as estrelas.</li><li><b>Polo celeste</b>: o polo elevado tem altura igual à latitude, mas não é origem da ascensão reta.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 18, item 18.3",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0195",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 1,
"enunciado": "Num lugar de latitude 35° S, o polo celeste elevado está a 35° acima do horizonte. Nesse lugar, um astro de declinação 0° (sobre o equador celeste) culmina com altura e direção de:",
"alternativas": [
"55°, ao Sul do zênite (azimute 180°).",
"35°, ao Norte do zênite (azimute 000°).",
"35°, ao Sul do zênite (azimute 180°).",
"90°, no zênite.",
"55°, ao Norte do zênite (azimute 000°)."
],
"correta": 4,
"explicacao": "<p>A distância zenital na culminação é z = |φ − δ| = |35° − 0°| = 35°, então a altura é 90° − 35° = 55°. Como a declinação (0°) é maior que a latitude (−35°), o astro passa ao Norte do zênite, com azimute 000°.</p><ul><li><b>55°, ao Sul do zênite (azimute 180°).</b>: para quem está no hemisfério Sul, o equador celeste cruza o meridiano ao Norte do zênite; o azimute 180° seria a direção do polo elevado.</li><li><b>35°, ao Norte do zênite (azimute 000°).</b>: confunde a distância zenital (35°) com a altura; a altura é 90° − 35° = 55°.</li><li><b>35°, ao Sul do zênite (azimute 180°).</b>: repete o erro da altura e passa o astro para o lado do polo elevado.</li><li><b>90°, no zênite.</b>: o astro só culmina no zênite se a declinação for igual à latitude, o que não ocorre (0° contra 35° S).</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 17 e cap. 25, item 25.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0196",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "Num certo instante, o Almanaque Náutico (extrato simulado) dá o ângulo horário do ponto vernal em Greenwich AHGγ = 250° 10,0′. Uma estrela tem ascensão reta versa (ARV) de 145° 30,0′. O AHG da estrela é:",
"alternativas": [
"035° 40,0′",
"104° 40,0′",
"324° 20,0′",
"215° 50,0′",
"395° 40,0′"
],
"correta": 0,
"explicacao": "<p>AHG* = AHGγ + ARV* = 250° 10,0′ + 145° 30,0′ = 395° 40,0′. Como passa de 360°, subtrai-se 360°: AHG* = 035° 40,0′. O ponto vernal e a estrela giram juntos, e a ARV, constante por vários dias, é o ângulo entre eles.</p><ul><li><b>395° 40,0′</b>: a soma é 395° 40,0′, mas um ângulo horário não passa de 360°; subtrai-se 360°.</li><li><b>104° 40,0′</b>: faz AHGγ − ARV; o AHG da estrela é a soma AHGγ + ARV.</li><li><b>324° 20,0′</b>: é 360° − 035° 40,0′, ou seja, o ângulo contado no sentido oposto, que não é o AHG.</li><li><b>215° 50,0′</b>: não resulta de nenhuma das operações: a soma de 250° 10,0′ com 145° 30,0′ é 395° 40,0′.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 18, item 18.3 e cap. 23",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0197",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 2,
"enunciado": "Em 17 de agosto de 2026, o Almanaque Náutico (extrato simulado) dá a declinação do Sol às 10h (HMG) como N 12° 30,6′, com d = −0,7′ (a declinação, em número, diminui). A declinação às 10h 45m (HMG) é:",
"alternativas": [
"N 12° 31,1′",
"N 12° 30,1′",
"N 12° 30,6′",
"N 12° 29,9′",
"S 12° 30,1′"
],
"correta": 1,
"explicacao": "<p>A correção é d × minutos/60 = −0,7′ × 45/60 = −0,525′, ou cerca de −0,5′. Como d é negativo, subtrai-se: N 12° 30,6′ − 0,5′ = N 12° 30,1′. O sinal da correção é sempre o de d, e o nome N ou S não muda.</p><ul><li><b>N 12° 31,1′</b>: soma a correção, mas d é negativo: o número da declinação diminui.</li><li><b>N 12° 30,6′</b>: repete a declinação da hora inteira, sem corrigir pelos 45 minutos.</li><li><b>N 12° 29,9′</b>: subtrai os 0,7′ da hora toda; a correção é proporcional aos minutos: 0,7′ × 45/60.</li><li><b>S 12° 30,1′</b>: o valor está certo, mas a declinação continua Norte; só o número muda.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 23, item 23.4",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
},
{
"id": "capitao-0198",
"nivel": "capitao",
"tema": "Almanaque e esfera celeste",
"dificuldade": 3,
"enunciado": "Em 20 de março de 2026, no fuso +3, o relógio de um veleiro marca 16h 20m 40s. A posição é 046° 40,0′ W. O Almanaque Náutico (extrato simulado) dá o AHG do Sol às 19h (HMG) como 103° 06,2′; o acréscimo do AHG do Sol é de 15° por hora (15′ por minuto e 0,25′ por segundo). O AHL do Sol é:",
"alternativas": [
"061° 26,2′",
"056° 26,2′",
"061° 36,2′",
"298° 23,8′",
"154° 56,2′"
],
"correta": 2,
"explicacao": "<p>HMG = Hleg + fuso = 16h 20m 40s + 3h = 19h 20m 40s, e entra-se com 19h. Acréscimo: 20 × 15′ = 5° 00,0′ e 40 × 0,25′ = 10,0′, total 5° 10,0′. AHG = 103° 06,2′ + 5° 10,0′ = 108° 16,2′. Para longitude Oeste, AHL = AHG − λ = 108° 16,2′ − 046° 40,0′ = 061° 36,2′ (o Sol está a Oeste do meridiano, a cerca de 4h 06m após a culminação).</p><ul><li><b>061° 26,2′</b>: acrescenta só os 20 minutos (5° 00,0′); os 40 segundos valem mais 10,0′.</li><li><b>056° 26,2′</b>: usa o AHG da hora inteira (19h), sem somar o acréscimo de 20m 40s (5° 10,0′).</li><li><b>154° 56,2′</b>: soma a longitude Oeste ao AHG; a Oeste, AHL = AHG − λ.</li><li><b>298° 23,8′</b>: é 360° − AHL, o ângulo contado em sentido oposto; o AHL do Sol está a Oeste do meridiano.</li></ul>",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. II, cap. 23, itens 23.2 e 23.4; cap. 18, item 18.2",
"fonte_url": "https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivos/Manual_Navega%C3%A7%C3%A3o_MB_Vol_2_%281%C2%AARevis%C3%A3o_2021%29_Final.pdf"
}
]);
