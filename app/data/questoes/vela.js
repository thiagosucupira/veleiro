/* Banco de questões — vela. Gerado por tools/build_questoes.py em 2026-10-09 a partir de
   research/_work/questoes/ (cada lote passou por duas revisões de instrutor). Conteúdo CC BY-SA 4.0. */
VL.dado('questoes/vela', [
{
"id": "vela-0001",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 1,
"enunciado": "Um veleiro corre em popa total, a 8 nós, com o vento real de 20 nós vindo exatamente de trás. Qual é o vento aparente a bordo?",
"alternativas": [
"8 nós, igual à velocidade do barco.",
"12 nós, vindo de trás.",
"20 nós, igual ao vento real.",
"28 nós, vindo de trás."
],
"correta": 1,
"explicacao": "Em popa total, o vento real e o vento do deslocamento (8 nós) têm a mesma direção e sentidos opostos, então se subtraem: 20 − 8 = <b>12 nós</b>. A de 8 nós confunde o vento aparente com a velocidade do barco. A de 20 nós só vale com o barco parado. A de 28 nós vem de somar os dois, o que só vale com o vento de proa.",
"referencia": "RYA Day Skipper Handbook (Sail), vento aparente; Marchaj, Aero-Hydrodynamics of Sailing"
},
{
"id": "vela-0002",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 1,
"enunciado": "Ao orçar, o vento aparente passa de 8 para 16 nós e as velas ficam na mesma posição. A força do vento nas velas fica aproximadamente:",
"alternativas": [
"2 vezes maior, na mesma proporção da velocidade.",
"1,4 vez maior, pois cresce com a raiz quadrada da velocidade.",
"4 vezes maior, pois cresce com o quadrado da velocidade.",
"8 vezes maior, pois cresce com o cubo da velocidade."
],
"correta": 2,
"explicacao": "A força aerodinâmica nas velas cresce com o <b>quadrado</b> da velocidade do vento aparente: dobrando a velocidade, a força quadruplica (2² = 4). A de 2 vezes trata a força como se fosse proporcional à velocidade. A de 1,4 vez usa a raiz quadrada, o contrário do que acontece (a força cresce com o quadrado, não com a raiz). A de 8 vezes usa o cubo, que se aplica à potência, não à força.",
"referencia": "Marchaj, Aero-Hydrodynamics of Sailing; RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0003",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 2,
"enunciado": "Num través, o vento real é de 12 nós e o barco navega a 5 nós. Qual é, aproximadamente, o vento aparente?",
"alternativas": [
"7 nós, vindo mais de popa que o vento real.",
"17 nós, vindo do mesmo ângulo do vento real.",
"12 nós, vindo do mesmo ângulo do vento real.",
"13 nós, vindo mais de proa que o vento real."
],
"correta": 3,
"explicacao": "No través, o vento real (12 nós, de lado) e o vento do deslocamento (5 nós, de frente) formam um ângulo reto: √(12² + 5²) = <b>13 nós</b>. Como o deslocamento \"puxa\" o ar para a frente, o aparente vem mais de proa que o real (cerca de 67° da proa, e não 90°). A de 7 nós subtrai, o que só vale em popa. A de 17 nós soma em linha reta, o que só vale com o vento de proa. A de 12 nós ignora o movimento do barco.",
"referencia": "Triângulo de velocidades (soma vetorial); RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0004",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 2,
"enunciado": "Pela regra prática da velocidade de casco (1,34 vez a raiz quadrada do comprimento na linha d'água, em pés), qual é a velocidade de casco aproximada de um veleiro com 25 pés na linha d'água?",
"alternativas": [
"3,7 nós.",
"5,0 nós.",
"6,7 nós.",
"33,5 nós."
],
"correta": 2,
"explicacao": "√25 = 5 e 1,34 × 5 = <b>6,7 nós</b>. A de 33,5 nós esquece a raiz quadrada (1,34 × 25). A de 5,0 nós usa só a raiz, sem o fator 1,34. A de 3,7 nós vem de usar o comprimento em metros (cerca de 7,6 m) na fórmula feita para pés.",
"referencia": "Larsson e Eliasson, Principles of Yacht Design (velocidade de casco); Marchaj, Aero-Hydrodynamics of Sailing"
},
{
"id": "vela-0005",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 2,
"enunciado": "Um veleiro de 5 toneladas de deslocamento adernado tem braço de endireitamento (GZ) de 0,4 m. Qual é, aproximadamente, o momento de endireitamento?",
"alternativas": [
"0,08 t·m.",
"2,0 t·m.",
"5,4 t·m.",
"12,5 t·m."
],
"correta": 1,
"explicacao": "O momento de endireitamento é o peso (deslocamento) vezes o braço GZ: 5 t × 0,4 m = <b>2,0 t·m</b>. A de 0,08 divide o braço pelo peso (0,4 ÷ 5). A de 5,4 soma os dois números. A de 12,5 divide o peso pelo braço (5 ÷ 0,4).",
"referencia": "Larsson e Eliasson, Principles of Yacht Design (estabilidade, curva GZ); RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0006",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 2,
"enunciado": "Por que um cruzeiro de quilha costuma perder rendimento na bolina quando a banda passa de uns 20°?",
"alternativas": [
"O vento aparente deixa de existir quando o barco aderna, e por isso a vela perde toda a força.",
"O lastro sai da água e deixa de contribuir para a estabilidade e para o equilíbrio do barco.",
"A quilha fica mais funda na água e o atrito com o casco aumenta bastante.",
"A quilha e o leme inclinados rendem menos: o barco abate mais e o leme pede mais ângulo."
],
"correta": 3,
"explicacao": "Com banda forte, a quilha e o leme, inclinados, geram menos força lateral útil, o barco <b>abate mais</b>, o leme precisa de mais ângulo (e freia) e a força da vela aponta mais para o lado. A banda não faz o vento aparente desaparecer: ela inclina a vela e reduz a área útil, mas a vela continua recebendo força. O lastro continua submerso num cruzeiro de quilha e segue ajudando a endireitar. A quilha inclinada fica menos funda, não mais funda.",
"referencia": "RYA Day Skipper Handbook (Sail); Marchaj, Aero-Hydrodynamics of Sailing"
},
{
"id": "vela-0007",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 3,
"enunciado": "Por que a vela grande de um cruzeiro precisa ter torção, com a parte de cima mais aberta que a de baixo?",
"alternativas": [
"Porque o vento é mais forte e mais aberto em cima; a torção mantém o ângulo de ataque parecido em toda a altura.",
"Porque a parte de cima deve trabalhar por arrasto, enquanto a de baixo trabalha por sustentação, mesmo na bolina.",
"Porque a torção desloca o centro de gravidade do barco para baixo e reduz a banda em qualquer força de vento.",
"Porque o tecido estica mais na parte de cima com o uso, e por isso toda vela sai do fabricante com essa forma."
],
"correta": 0,
"explicacao": "O atrito com o mar freia o vento perto da superfície; em cima o vento real é mais forte e, somado ao deslocamento, o aparente vem de um ângulo <b>mais aberto</b>. Abrir a parte de cima mantém o ângulo de ataque semelhante em todas as alturas. Na bolina a vela inteira deve trabalhar por sustentação, não por arrasto. A torção não altera o centro de gravidade do barco. O estiramento do tecido é um defeito da idade da vela, não a razão da torção.",
"referencia": "RYA Day Skipper Handbook (Sail), torção e bolsa; Marchaj, Sail Performance"
},
{
"id": "vela-0008",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 3,
"enunciado": "Num veleiro leve e rápido, no través, com vento real constante de 6 nós, o barco acelera de 4 para 8 nós. O vento aparente passa de aproximadamente:",
"alternativas": [
"de 7 para 10 nós, vindo mais de popa.",
"de 10 para 14 nós, vindo mais de proa.",
"de 7 para 2 nós, vindo mais de popa.",
"de 7 para 10 nós, vindo mais de proa."
],
"correta": 3,
"explicacao": "No través, o aparente é √(vento real² + velocidade do barco²). Com 4 nós: √(36 + 16) ≈ 7 nós. Com 8 nós: √(36 + 64) = <b>10 nós</b>. Como o vento do deslocamento cresceu, o ar passa a vir mais de proa (de cerca de 56° para 37° da proa). A opção \"mais de popa\" inverte o efeito. A de 14 nós soma 6 + 8 em linha reta. A de 2 nós subtrai 8 − 6, o que só vale em popa.",
"referencia": "Triângulo de velocidades (soma vetorial); RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0009",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 2,
"enunciado": "Um veleiro governa na proa 090° com vento de sudeste (135°) entrando por boreste, e o abatimento é de 5°. Qual é, aproximadamente, o caminho feito sobre a água?",
"alternativas": [
"080°",
"085°",
"090°",
"095°"
],
"correta": 1,
"explicacao": "O abatimento empurra o barco para <b>sotavento</b>, o lado oposto ao de onde vem o vento. Com o vento de sudeste, o sotavento fica para o lado noroeste, isto é, para a esquerda da proa (bombordo). O caminho sobre a água é, então, a proa corrigida em 5° para a esquerda: 090° − 5° = <b>085°</b>. A de 095° desloca para o lado do vento, o que o abatimento nunca faz. A de 090° ignora o abatimento. A de 080° dobra o valor.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (abatimento e corrente); RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0010",
"nivel": "vela",
"tema": "Teoria da vela",
"dificuldade": 3,
"enunciado": "O centro vélico (ponto de aplicação da força das velas) de um veleiro está muito atrás do centro de deriva (ponto da força lateral da quilha). O que se espera do comportamento do barco?",
"alternativas": [
"Tende a arribar, e o timoneiro precisa segurar a cana para sotavento.",
"Tende a abater menos, porque a quilha passa a trabalhar com mais ângulo.",
"Tende a orçar (barco \"ardente\"); o timoneiro segura a cana a barlavento.",
"Não muda o rumo; apenas aumenta a banda, sem outros efeitos sobre o governo."
],
"correta": 2,
"explicacao": "Com a força das velas aplicada atrás do ponto da força da quilha, forma-se um binário que gira a proa <b>para o vento</b>: o barco orça e o timoneiro corrige segurando a cana do lado do vento, a barlavento (barco \"ardente\"). Se o centro vélico estivesse muito à frente, o efeito seria o contrário (tendência a arribar). O abatimento não diminui por isso. E a posição relativa desses pontos muda o rumo, não só a banda.",
"referencia": "Marchaj, Aero-Hydrodynamics of Sailing (balanço entre centro vélico e centro de deriva); RYA Day Skipper Handbook (Sail)"
},
{
"id": "vela-0011",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 1,
"enunciado": "A testa da genoa está batendo (panejando) e o barco perdeu velocidade. Qual é o ajuste correto?",
"alternativas": [
"Folgar mais a escota, para a vela ficar totalmente solta.",
"Caçar a escota devagar, até a batida parar.",
"Caçar a escota de uma vez, até o máximo.",
"Orçar o barco até a vela voltar a encher."
],
"correta": 1,
"explicacao": "Vela batendo significa ângulo de ataque pequeno demais: o certo é <b>caçar devagar até a batida parar</b>, parando no ponto em que a vela fica o mais aberta possível sem bater. Folgar mais só piora a batida. Caçar de uma vez, até o máximo, leva ao estol e à perda de velocidade. Orçar reduz ainda mais o ângulo de ataque e faz a vela bater mais.",
"referencia": "RYA Day Skipper Handbook (Sail), trimagem; Marchaj, Sail Performance"
},
{
"id": "vela-0012",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 1,
"enunciado": "Com o vento real entrando a 130° da proa (veja a figura), em que ponto de vela o barco está?",
"alternativas": [
"Bolina folgada.",
"Través.",
"Largo.",
"Popa."
],
"correta": 2,
"explicacao": "O largo vai de cerca de 100° a 150° do vento real, medidos a partir da proa; 130° está bem dentro dessa faixa. A bolina folgada fica por volta de 55° a 80°, o través em torno de 90° (80° a 100°) e a popa a partir de uns 150° até 180°. Os limites são aproximados e variam entre escolas, mas 130° é largo em qualquer um deles.",
"referencia": "RYA Day Skipper Handbook (Sail), pontos de vela",
"figura": {
"svg": "<svg viewBox=\"0 0 220 200\" role=\"img\" aria-label=\"Veleiro visto de cima com o vento entrando por boreste, a 130 graus da proa\"><path d=\"M110 60 C124 84 128 124 120 150 L100 150 C92 124 96 84 110 60Z\" fill=\"var(--sea-2)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><line x1=\"110\" y1=\"60\" x2=\"110\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/><text x=\"116\" y=\"22\" font-size=\"11\" fill=\"currentColor\">proa</text><line x1=\"178\" y1=\"168\" x2=\"130\" y2=\"128\" stroke=\"var(--ink)\" stroke-width=\"3\"/><polygon points=\"124,123 137,126 130,135\" fill=\"var(--ink)\"/><text x=\"150\" y=\"186\" font-size=\"11\" fill=\"currentColor\">vento</text><path d=\"M110 41 A 70 70 0 0 1 163.6 156\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"180\" y=\"86\" font-size=\"12\" fill=\"currentColor\">130°</text></svg>"
}
},
{
"id": "vela-0013",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "Na bolina, a biruta de barlavento da genoa levanta e dança, enquanto a de sotavento voa reta para trás. O que isso indica e o que fazer?",
"alternativas": [
"Estol da vela; folgar a escota ou orçar um pouco.",
"Fluxo perfeito dos dois lados; manter tudo como está.",
"Vela caçada demais; folgar a escota e levar o carrinho para trás.",
"Ângulo de ataque pequeno; caçar a escota ou arribar."
],
"correta": 3,
"explicacao": "A biruta de barlavento que levanta mostra fluxo falhando do lado de barlavento: o ângulo de ataque é <b>pequeno demais</b> (vela folgada para o rumo ou proa alta demais). A cura é caçar a escota ou arribar. O estol aparece na biruta de sotavento, por isso a alternativa do estol está errada. Com fluxo perfeito as duas voam retas. Vela caçada demais daria estol, e quem cairia seria a biruta de sotavento. Folgar mais a escota aumentaria o problema.",
"referencia": "RYA Day Skipper Handbook (Sail), birutas; Marchaj, Sail Performance"
},
{
"id": "vela-0014",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "Um cruzeiro bolineia com 14 nós de vento e o barco aderna demais numa rajada. Com o carrinho da grande no centro, qual ajuste alivia a banda sem perder a tensão da valuma?",
"alternativas": [
"Subir o carrinho a barlavento e caçar um pouco a escota para ganhar velocidade.",
"Descer o carrinho a sotavento; folgar a escota só se a banda persistir.",
"Caçar a escota da genoa até o fim, sem mexer na grande.",
"Soltar o cunningham e a esteira para dar mais bolsa."
],
"correta": 1,
"explicacao": "Descer o carrinho a sotavento <b>alivia a parte de cima da vela</b> e reduz a banda, mantendo a tensão da valuma. Só se a banda persistir é que se folga um pouco a escota. Subir o carrinho e caçar aumenta a potência, o que agrava a banda, mesmo que pareça dar velocidade. Caçar a genoa acrescenta força e não alivia a grande. Soltar cunningham e esteira dá mais bolsa e mais força, o contrário do que se quer.",
"referencia": "RYA Day Skipper Handbook (Sail), controles da grande; Marchaj, Sail Performance"
},
{
"id": "vela-0015",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 1,
"enunciado": "No largo, com a escota da grande folgada, a retranca sobe e a vela abre em cima, perdendo potência. Qual controle evita isso?",
"alternativas": [
"Burro, que puxa a retranca para baixo.",
"Cunningham, que puxa a testa para baixo.",
"Estai de popa, que curva o mastro.",
"Carrinho da grande, que move a escota de lado."
],
"correta": 0,
"explicacao": "Com a escota folgada, quem segura a retranca para baixo e mantém a tensão da valuma é o <b>burro</b>. O cunningham regula a posição da bolsa pela testa da vela. O estai de popa curva o mastro e achata a vela, mais usado na bolina. O carrinho ajusta o ângulo da retranca em relação ao centro, mas não a impede de subir.",
"referencia": "RYA Day Skipper Handbook (Sail), burro (boom vang)"
},
{
"id": "vela-0016",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "O vento aumenta e aparecem vincos horizontais perto da testa da grande, com a bolsa recuando para trás. Qual é o ajuste?",
"alternativas": [
"Folgar a adriça para a vela descer um pouco e ganhar bolsa.",
"Soltar a esteira para dar mais bolsa embaixo.",
"Firmar o cunningham, trazendo a bolsa para a frente.",
"Subir o carrinho a barlavento."
],
"correta": 2,
"explicacao": "Vincos horizontais na testa mostram que o <b>cunningham está solto</b>; firmando-o, a testa desce e a bolsa volta para a frente, achatando a vela, como pede o vento forte. Folgar a adriça aumentaria os vincos. Soltar a esteira daria mais bolsa, o contrário do desejado. Subir o carrinho a barlavento aumenta a potência.",
"referencia": "RYA Day Skipper Handbook (Sail), controles da grande; Marchaj, Sail Performance"
},
{
"id": "vela-0017",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 3,
"enunciado": "Na vela grande, a biruta superior da valuma desaparece atrás da vela, enquanto as de baixo voam retas para trás. O que isso indica e qual o ajuste?",
"alternativas": [
"Valuma fechada em cima, com pouca torção; folgar a escota.",
"A valuma está aberta demais em cima; caçar a escota.",
"A vela não tem bolsa suficiente; soltar a esteira e o cunningham.",
"O fluxo está perfeito em toda a altura; nada a ajustar."
],
"correta": 0,
"explicacao": "A biruta de cima que \"some\" atrás da vela mostra fluxo descolado na parte alta: a valuma está <b>fechada em cima</b>, com torção de menos. Folgar a escota (ou aliviar o burro) dá mais torção e libera o fluxo. Caçar fecharia ainda mais. Bolsa não é o problema apontado pela biruta. E o fluxo só é perfeito quando todas as birutas voam retas.",
"referencia": "RYA Day Skipper Handbook (Sail), torção e bolsa"
},
{
"id": "vela-0018",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 3,
"enunciado": "Ao orçar devagar, as birutas de cima da genoa levantam antes das de baixo. O que isso indica e qual o ajuste do carrinho?",
"alternativas": [
"Valuma fechada demais; levar o carrinho para trás.",
"Regulagem equilibrada; manter o carrinho onde está.",
"Valuma aberta demais; levar o carrinho para a frente.",
"Vela em estol; levar o carrinho para trás e folgar a escota."
],
"correta": 2,
"explicacao": "Se as birutas de cima levantam primeiro, o ar deixa a parte alta antes da baixa: a valuma está <b>aberta demais</b> (muita torção). Levar o carrinho para a frente puxa a escota mais para baixo e fecha a valuma. Levar para trás, ao contrário, abre a valuma (e agravaria o problema); a hipótese de valuma fechada faria as birutas de baixo levantarem primeiro. Birutas todas levantando juntas indicariam regulagem equilibrada. Estol apareceria na biruta de sotavento, não no levantar da de barlavento.",
"referencia": "RYA Day Skipper Handbook (Sail), genoa: escota e carrinho"
},
{
"id": "vela-0019",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "O vento passa de 10 para 22 nós e a banda aumenta. Qual conjunto de ajustes deixa a grande mais plana e reduz a força?",
"alternativas": [
"Esteira e cunningham soltos, para dar bolsa à vela, com o carrinho a barlavento.",
"Esteira firme, mas estai de popa folgado, para a vela ganhar bolsa.",
"Cunningham solto, estai de popa tenso e carrinho a barlavento.",
"Esteira e cunningham firmes, estai de popa tenso e carrinho a sotavento."
],
"correta": 3,
"explicacao": "Para reduzir a força com vento forte, a vela deve ficar <b>rasa</b>: esteira e cunningham firmes, estai de popa tenso (que curva o mastro) e carrinho a sotavento para aliviar a parte de cima. Esteira e cunningham soltos com carrinho a barlavento é o ajuste de vento fraco. Os outros dois misturam um controle que achata com um que dá bolsa, e o resultado é uma vela que ainda gera força demais.",
"referencia": "RYA Day Skipper Handbook (Sail), controles da grande; Marchaj, Sail Performance"
},
{
"id": "vela-0020",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 1,
"enunciado": "Com 5 nós de vento e mar liso, o objetivo é ter mais potência na grande. Qual ajuste ajuda?",
"alternativas": [
"Esteira e cunningham soltos, para dar bolsa à vela.",
"Esteira e cunningham firmes, para a vela ficar plana.",
"Estai de popa tenso ao máximo, para curvar o mastro.",
"Escota caçada ao máximo, com a valuma bem fechada."
],
"correta": 0,
"explicacao": "Com vento fraco a vela precisa de <b>bolsa</b> para gerar força: esteira e cunningham soltos. Firmá-los deixa a vela plana, o ajuste de vento forte. Estai de popa tenso curva o mastro e também achata a vela. Escota caçada ao máximo fecha a valuma e estola o ar, que já é fraco.",
"referencia": "RYA Day Skipper Handbook (Sail), torção e bolsa"
},
{
"id": "vela-0021",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 1,
"enunciado": "Na bolina, o timoneiro segura a cana com muito esforço e muito ângulo de leme, com forte banda. Qual é a melhor primeira medida?",
"alternativas": [
"Mandar toda a tripulação para o lado de sotavento, para ajudar a endireitar o barco.",
"Caçar mais as velas e a genoa, para o barco acelerar e aliviar o esforço no leme.",
"Soltar o cunningham e a esteira, para dar mais bolsa e mais potência às velas.",
"Aliviar o pano: folgar a grande ou descer o carrinho, e rizar se persistir."
],
"correta": 3,
"explicacao": "Leme pesado e muita banda são aviso de <b>pano demais ou mal regulado</b>: alivie a grande (escota ou carrinho) e, se continuar, reduza pano com um rizo. Caçar mais aumenta a força e a banda. Mais bolsa também aumenta a força. A tripulação deve ficar a barlavento, que é onde seu peso ajuda a endireitar; a sotavento ele agravaria a banda.",
"referencia": "RYA Day Skipper Handbook (Sail), reduzir pano; Marchaj, Sail Performance"
},
{
"id": "vela-0022",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "Dois veleiros perdem velocidade na bolina. No barco A, a testa da genoa bate. No barco B, as birutas de sotavento giram e caem. Que ação cabe a cada um?",
"alternativas": [
"A: caçar a escota. B: caçar mais, para encher a vela.",
"A: orçar mais, para chegar mais perto do vento. B: arribar mais.",
"A: folgar a escota. B: caçar a escota.",
"A: caçar a escota. B: folgar ou orçar um pouco."
],
"correta": 3,
"explicacao": "Bater é ângulo de ataque pequeno demais: <b>A deve caçar</b>. Birutas de sotavento girando mostram estol, ângulo grande demais: <b>B deve folgar</b> (ou orçar um pouco, que também diminui o ângulo de ataque). As curas são opostas. Inverter as ações agravaria os dois problemas, e caçar mais no estol só piora. Orçar mais com a vela já batendo (A) reduz ainda mais o ângulo de ataque, e arribar mais com a vela já estolada (B) o aumenta ainda mais.",
"referencia": "RYA Day Skipper Handbook (Sail), birutas; Marchaj, Sail Performance"
},
{
"id": "vela-0023",
"nivel": "vela",
"tema": "Mareação e regulagem",
"dificuldade": 2,
"enunciado": "O vento sopra do norte (000°) e o barco bolineia no ângulo mínimo de 45° com o vento, amurado a boreste (vento entrando pelo lado direito). Qual é a proa aproximada?",
"alternativas": [
"045°",
"135°",
"225°",
"315°"
],
"correta": 3,
"explicacao": "Com o vento entrando pelo lado direito (boreste), o vento (000°) fica 45° à direita da proa; logo a proa é 000° − 45° = <b>315°</b>. A de 045° corresponde ao bordo oposto, com o vento por bombordo. As de 135° e 225° apontam bem longe do vento, para rumos de largo ou popa, e não de bolina.",
"referencia": "RYA Day Skipper Handbook (Sail), pontos de vela e bordos"
},
{
"id": "vela-0024",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 1,
"enunciado": "Num veleiro de cana, o timoneiro empurra a cana para sotavento. O que o barco faz?",
"alternativas": [
"Arriba, afastando a proa do vento.",
"Orça, aproximando a proa do vento.",
"Cambia imediatamente, sem precisar das velas.",
"Mantém o rumo e apenas aumenta a banda."
],
"correta": 1,
"explicacao": "A proa vai para o lado <b>oposto</b> ao da cana: cana para sotavento faz o barco <b>orçar</b>, isto é, a proa se aproxima do vento. Cana para barlavento faria o barco arribar. O barco só cambia se a proa passar pelo vento e as velas forem manobradas. E o leme com barco em movimento muda o rumo, não apenas a banda.",
"referencia": "RYA Day Skipper Handbook (Sail), orçar e arribar"
},
{
"id": "vela-0025",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Na cambada por davante, quando o tripulante deve largar a escota antiga da genoa?",
"alternativas": [
"Assim que o comandante diz \"Preparar para cambar\".",
"Quando a genoa começa a panejar, com a proa quase no vento.",
"Depois que a proa já passou pelo vento, para a genoa não bater.",
"Só depois de caçar a escota nova até o fim."
],
"correta": 1,
"explicacao": "A escota antiga é largada <b>quando a genoa começa a panejar</b>, com a proa quase no vento, para ela cruzar livre. Largar já no aviso faria a genoa bater cedo e o barco perder força. Largar depois de a proa passar deixa a genoa a contravento e trava a proa. Caçar a escota nova só começa depois que a genoa cruzou.",
"referencia": "RYA Day Skipper Handbook (Sail), cambada"
},
{
"id": "vela-0026",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Qual preparação diminui o risco de o barco ficar parado, aproado, no meio de uma cambada?",
"alternativas": [
"Começar a manobra devagar, próximo da zona morta, para girar menos.",
"Girar o leme todo e rápido, para a proa passar logo pelo vento.",
"Chegar à bolina cerrada com velocidade e leme suave e contínuo.",
"Caçar a genoa antes de a proa cruzar o vento, para ganhar tempo."
],
"correta": 2,
"explicacao": "O barco precisa de <b>velocidade e impulso</b> para a proa passar pelo vento; o leme deve girar de forma suave e contínua. Começar devagar perto da zona morta quase garante ficar aproado. Leme todo e rápido freia o barco. Caçar a genoa antes de ela cruzar a deixa a contravento e trava a proa.",
"referencia": "RYA Day Skipper Handbook (Sail), cambada; Marchaj, Sail Performance"
},
{
"id": "vela-0027",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Antes de a popa cruzar o vento num jaibe controlado, o tripulante da grande deve:",
"alternativas": [
"Caçar a escota até a retranca ficar quase no centro do barco.",
"Largar toda a escota, para a vela aliviar sozinha durante o giro.",
"Firmar o preventer, para a retranca não cruzar o barco durante o giro.",
"Soltar o burro e o cunningham, para a vela abrir mais durante o giro."
],
"correta": 0,
"explicacao": "O que torna o jaibe seguro é controlar a retranca: <b>caçar a escota</b> até ela ficar quase centrada, para cruzar curta e devagar, e depois folgar aos poucos. Largar tudo deixaria a retranca varrer o barco em arco amplo. O preventer deve ser solto antes do jaibe, pois impede a retranca de cruzar. Soltar burro e cunningham não controla o cruzamento da retranca.",
"referencia": "RYA Day Skipper Handbook (Sail), jaibe; Heavy Weather Sailing (Adlard Coles Nautical)"
},
{
"id": "vela-0028",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 3,
"enunciado": "Navegar \"pela contra\" (by the lee) em popa é perigoso porque:",
"alternativas": [
"O vento passa a entrar pelo lado da retranca, e um pequeno desvio causa o jaibe.",
"O vento aparente passa a valer o dobro do vento real e rasga a vela grande.",
"A genoa passa a empurrar a proa para o vento, e o barco deixa de obedecer ao leme.",
"A vela grande estola e perde toda a força, deixando o barco sem seguimento."
],
"correta": 0,
"explicacao": "Pela contra, o vento já entra pelo <b>mesmo lado em que está a retranca</b>: qualquer desvio pequeno de rumo ou uma onda faz a vela virar de lado e a retranca varre o barco em jaibe acidental. O vento aparente em popa é menor que o real, não o dobro. A genoa não faz a proa orçar por isso. A vela não perde a força por estol: o risco é justamente o de ela encher do lado errado.",
"referencia": "RYA Day Skipper Handbook (Sail), jaibe acidental; Heavy Weather Sailing (Adlard Coles Nautical)"
},
{
"id": "vela-0029",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Um cruzeiro navega no largo com preventer firme e vai orçar para a bolina e cambar. O que fazer antes de orçar?",
"alternativas": [
"Manter o preventer firme, para a retranca não balançar na cambada.",
"Soltar o preventer, a partir do cockpit, antes de orçar.",
"Prender o preventer na amurada, para ele não atrapalhar.",
"Caçar o preventer ao máximo, para a retranca ir ao centro."
],
"correta": 1,
"explicacao": "O preventer prende a retranca aberta; ao orçar e cambar a retranca precisa ir ao centro e cruzar, então ele deve ser <b>solto antes, do cockpit</b>. Deixá-lo firme travaria a retranca, com risco de quebra ou de ferimento. Prender o preventer na amurada ou nos balaústres é errado: eles não aguentam a carga e a retranca continuaria presa. Caçá-lo ao máximo só prenderia a retranca no lugar errado.",
"referencia": "RYA Day Skipper Handbook (Sail), preventer; Coles, Heavy Weather Sailing"
},
{
"id": "vela-0030",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Dois veleiros convergem. O veleiro A recebe o vento por bombordo; o B, por boreste. Segundo a Regra 12 do RIPEAM, quem deve manter-se fora do caminho do outro?",
"alternativas": [
"O veleiro A, que recebe o vento por bombordo.",
"O veleiro B, que recebe o vento por boreste.",
"O veleiro mais veloz e mais leve, seja qual for o bordo.",
"O veleiro que estiver a sotavento do outro."
],
"correta": 0,
"explicacao": "Segundo a Regra 12(a)(i), quando cada veleiro recebe o vento por um bordo diferente, o que o recebe por <b>bombordo</b> deve manter-se fora do caminho do outro; logo, é o A. O B tem preferência. A velocidade não define a preferência. A posição a sotavento só decide a questão quando os dois têm o vento do mesmo bordo, caso em que quem está a barlavento é que se afasta.",
"referencia": "RIPEAM, Regra 12(a)(i)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0031",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 3,
"enunciado": "No veleiro X a vela grande está carregada a bombordo; no Y, a boreste. Os dois convergem com os ventos de bordos diferentes (veja a figura). Segundo a Regra 12 do RIPEAM, quem deve manter-se fora do caminho?",
"alternativas": [
"O X, porque a grande a bombordo indica que o vento entra por bombordo.",
"O Y, que recebe o vento por bombordo, por ter a grande a boreste.",
"Nenhum dos dois, pois o ângulo da grande não define o bordo.",
"O X, porque a sua grande está do lado de barlavento."
],
"correta": 1,
"explicacao": "Pela Regra 12(b), o lado de barlavento é o <b>oposto</b> àquele em que a grande é carregada. Em X, a grande está a bombordo, logo o vento vem por boreste. Em Y, a grande está a boreste, logo o vento vem por <b>bombordo</b>. Pela Regra 12(a)(i), quem recebe o vento por bombordo deve manter-se fora do caminho: é o Y. A primeira alternativa inverte a relação entre a grande e o vento. A terceira ignora a própria regra. A quarta também confunde o lado da vela com o do vento.",
"referencia": "RIPEAM, Regra 12(a)(i) e 12(b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf",
"figura": {
"svg": "<svg viewBox=\"0 0 220 190\" role=\"img\" aria-label=\"Vento vindo do alto da figura. O veleiro X vai para noroeste com a vela grande a bombordo; o veleiro Y vai para nordeste com a vela grande a boreste\"><line x1=\"110\" y1=\"8\" x2=\"110\" y2=\"40\" stroke=\"var(--ink)\" stroke-width=\"3\"/><polygon points=\"103,38 117,38 110,50\" fill=\"var(--ink)\"/><text x=\"120\" y=\"22\" font-size=\"11\" fill=\"currentColor\">vento</text><g transform=\"translate(155,130) rotate(-45)\"><path d=\"M0 -28 C9 -12 10 14 6 28 L-6 28 C-10 14 -9 -12 0 -28Z\" fill=\"var(--sea-2)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><line x1=\"0\" y1=\"-4\" x2=\"-13\" y2=\"26\" stroke=\"var(--ink)\" stroke-width=\"3\"/></g><text x=\"178\" y=\"176\" font-size=\"13\" font-weight=\"700\" fill=\"currentColor\">X</text><g transform=\"translate(65,130) rotate(45)\"><path d=\"M0 -28 C9 -12 10 14 6 28 L-6 28 C-10 14 -9 -12 0 -28Z\" fill=\"var(--sea-2)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><line x1=\"0\" y1=\"-4\" x2=\"13\" y2=\"26\" stroke=\"var(--ink)\" stroke-width=\"3\"/></g><text x=\"36\" y=\"176\" font-size=\"13\" font-weight=\"700\" fill=\"currentColor\">Y</text></svg>"
}
},
{
"id": "vela-0032",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 1,
"enunciado": "Ao se aproximar de uma boia de amarração, com vento e corrente vindos da mesma direção, o veleiro deve chegar:",
"alternativas": [
"Com vento e corrente pela popa, para chegar mais depressa à boia.",
"De través, usando o leme todo no último instante.",
"De ré e com pouca velocidade, para evitar bater na boia.",
"De proa para o vento e a corrente, controlando pelas escotas."
],
"correta": 3,
"explicacao": "A aproximação deve ser feita <b>contra o vento ou a corrente</b>: ao tirar a força das velas, o barco para por si e o leme continua a ter fluxo de água. Chegar com vento e corrente pela popa deixa o barco \"empurrado\", sem ter como parar. Chegar de ré, devagar, tira o governo: o leme age mal e um veleiro não anda de ré com controle. De través, é preciso depender de leme brusco e há risco de abater sobre a boia.",
"referencia": "RYA Day Skipper Handbook (Sail), aproximação e parada"
},
{
"id": "vela-0033",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 1,
"enunciado": "Num través, o timoneiro orça uns 15° sem mexer nas escotas. O que tende a acontecer com as velas?",
"alternativas": [
"Batem, porque o ângulo de ataque diminui.",
"Estolam, porque o ângulo de ataque aumenta.",
"Nada, pois as escotas seguram a vela em qualquer rumo.",
"Enchem mais, pois o vento aparente fica mais fraco."
],
"correta": 0,
"explicacao": "Ao orçar, o vento aparente vem mais de proa e mais forte, e o ângulo entre o vento e a vela <b>diminui</b>: a vela tende a bater, e é preciso caçar. Estol seria o efeito de arribar sem folgar. Segurar a escota não impede a vela de bater. E o vento aparente ao orçar aumenta, não diminui.",
"referencia": "RYA Day Skipper Handbook (Sail), orçar e arribar"
},
{
"id": "vela-0034",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 3,
"enunciado": "Com 28 nós de vento, mar levantado e tripulação pouco experiente, um veleiro em popa precisa mudar de bordo. Qual é a opção mais prudente?",
"alternativas": [
"Dar um jaibe rápido com o leme todo, para passar logo pelo vento.",
"Soltar toda a escota da grande e deixar a retranca cruzar sozinha.",
"Orçar, cambar e arribar de volta, mesmo com mais distância.",
"Caçar a genoa a contravento e deixar o barco girar sozinho."
],
"correta": 2,
"explicacao": "Com vento forte e mar grosso, o jaibe é arriscado: a retranca é pesada e a vela enche com violência do outro lado. Mudar de bordo <b>cambando</b> custa distância e tempo, mas a manobra é feita contra o vento, com as velas aliviadas e sem esse risco (exige velocidade e atenção para não ficar aproado). Jaibe rápido com leme todo é pior; soltar toda a escota deixa a retranca varrer o cockpit; e a genoa a contravento não é método de mudar de bordo com controle.",
"referencia": "RYA Day Skipper Handbook (Sail), jaibe e cambada; Heavy Weather Sailing (Adlard Coles Nautical)"
},
{
"id": "vela-0035",
"nivel": "vela",
"tema": "Manobras sob vela",
"dificuldade": 2,
"enunciado": "Um cruzeiro bolineia a 045°, com vento de leste (090°) entrando por boreste. Ao cambar, mantendo o mesmo ângulo de 45° com o vento, qual será o novo rumo?",
"alternativas": [
"045°",
"090°",
"135°",
"225°"
],
"correta": 2,
"explicacao": "Depois da cambada o vento entra pelo outro lado (bombordo): o vento de 090° fica 45° à esquerda da proa, e a proa passa a ser 090° + 45° = <b>135°</b>. A mudança de rumo é de 90°. A de 045° é o rumo anterior. A de 090° apontaria direto para o vento, dentro da zona morta. A de 225° é o rumo de um barco que arribou muito, e não de bolina.",
"referencia": "RYA Day Skipper Handbook (Sail), cambada e pontos de vela"
},
{
"id": "vela-0036",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 1,
"enunciado": "Um tripulante cai do lado de boreste com o veleiro em movimento. Qual é a primeira ação imediata da tripulação?",
"alternativas": [
"Recolher todas as velas para que o barco pare no mesmo lugar",
"Descer à cabine e transmitir o Mayday antes de qualquer outra ação",
"Gritar “homem ao mar a boreste”, jogar a boia e apontar para a pessoa",
"Mergulhar de colete atrás da pessoa para alcançá-la o quanto antes"
],
"correta": 2,
"explicacao": "A sequência inicial é <b>gritar</b> para alertar a tripulação, <b>lançar a boia</b> (com luz, se houver) e <b>apontar</b> para a pessoa sem tirar os olhos dela. Depois vêm a marcação no GPS, a manobra de volta e o rádio. Recolher as velas toma tempo, e o barco se afasta da pessoa. O Mayday é importante, mas não vem antes de alertar a tripulação e manter a pessoa à vista. Mergulhar deixa duas pessoas na água, sem ninguém manobrando o barco.",
"referencia": "US Sailing, A Study Evaluating MOB Return and Recovery in the 21st Century (2020), recomendações de resposta imediata",
"fonte_url": "https://www.ussailing.org/wp-content/uploads/2024/05/2020.New-Study-Evaluating-MOB-Return-and-Recovery-in-the-21st-Century.pdf"
},
{
"id": "vela-0037",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 2,
"enunciado": "Um veleiro navega a 6 nós quando uma pessoa cai na água. Aproximadamente que distância o barco percorre em 1 minuto? (1 milha náutica = 1.852 m)",
"alternativas": [
"Cerca de 185 m",
"Cerca de 60 m",
"Cerca de 100 m",
"Cerca de 370 m"
],
"correta": 0,
"explicacao": "Um nó é uma milha náutica por hora. Logo, 6 nós = 6 × 1.852 m = 11.112 m por hora. Dividindo por 60, o barco anda <b>cerca de 185 m por minuto</b>. Os 100 m equivalem a cerca de 3 nós (ou a 6 km/h, o erro de tratar nó como km/h). Os 60 m equivalem a cerca de 2 nós. Os 370 m são a distância percorrida a 12 nós. Em um minuto, o veleiro já está a quase 200 m da pessoa, por isso a vigia visual e o botão MOB não podem esperar.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (unidades de distância e velocidade: milha náutica e nó)"
},
{
"id": "vela-0038",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 1,
"enunciado": "Antes de uma travessia, qual item de um colete inflável automático precisa ser conferido para que ele infle quando for necessário?",
"alternativas": [
"A cor da fita refletiva e o número de bolsos do colete",
"O tamanho do colete, que deve ser sempre o maior disponível a bordo",
"O nível da bateria da bomba de enchimento elétrica",
"O cilindro de CO₂ (cheio e sem corrosão) e a validade da cápsula"
],
"correta": 3,
"explicacao": "O colete infla com o gás de um <b>cilindro de CO₂</b>, disparado por uma <b>cápsula</b> de acionamento (ou pelo puxador manual). Cilindro vazio, furado ou corroído e cápsula vencida são as falhas clássicas. Por isso se confere o cilindro (preso, sem corrosão e com o peso marcado), a validade da cápsula e o funcionamento do puxador manual. A fita refletiva ajuda a ser visto, mas não faz o colete inflar, e o tamanho também não afeta o disparo. O colete a gás não tem bateria nem bomba de enchimento: o tubo de sopro, com a boca, é só um reforço.",
"referencia": "ISO 12402-3 (coletes salva-vidas infláveis, nível 150) e manual do fabricante"
},
{
"id": "vela-0039",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 1,
"enunciado": "Uma pessoa caiu ao mar, foi perdida de vista e corre risco de vida. Pelo Anexo IV do RIPEAM, qual palavra falada no rádio VHF é sinal de perigo?",
"alternativas": [
"Pan-Pan",
"Mayday",
"Sécurité",
"Seelonce"
],
"correta": 1,
"explicacao": "O Anexo IV do RIPEAM lista a palavra <b>Mayday</b>, em radiotelefonia, entre os sinais de perigo. Pan-Pan é o sinal de urgência, para situação grave sem perigo imediato de vida. Sécurité anuncia mensagem de segurança da navegação, como um aviso de mau tempo. Seelonce serve para impor silêncio na frequência durante um socorro, e não é sinal de perigo.",
"referencia": "RIPEAM-72, Anexo IV, item 1(e) (sinais de perigo: palavra falada \"Mayday\" em radiotelefonia)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0040",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 3,
"enunciado": "Na manobra do oito (reach-tack-reach), a aproximação final à pessoa é feita em bolina folgada. Qual é a principal razão dessa escolha?",
"alternativas": [
"O barco anda mais depressa nesse rumo e chega antes à pessoa do que em outros",
"O abatimento empurra o barco direto para a pessoa, dispensando o uso do leme",
"O vento aparente fica nulo e o barco para sozinho ao lado da pessoa",
"Folgando as escotas, as velas panejam e o barco freia com controle"
],
"correta": 3,
"explicacao": "Em bolina folgada, o piloto consegue <b>frear</b> o barco só folgando as escotas: as velas panejam, a força cai e o barco chega devagar, com governo, ao lado da pessoa. A velocidade de contato varia conforme a fonte: 1 nó é a regra de Annapolis, no programa de vela da Academia Naval dos EUA (e o US Sailing pede não arrastar a pessoa a mais de 1 nó), enquanto as vítimas dos testes de 2005 aceitaram de 2 a 3 nós; o olhar do timoneiro fica na pessoa, não no velocímetro. O afastamento antes de cambar também varia: de 2 comprimentos de barco (Deep Beam Reach) a cerca de 5 (Figure 8), ou cerca de 20 segundos. Em popa, folgar a escota não freia e há risco de jaibe. Bolina folgada não é o rumo de maior velocidade do barco, o abatimento não o leva à pessoa (é preciso governar) e o vento aparente não zera com o barco em movimento.",
"referencia": "US Sailing, Final Report, 2005 Crew Overboard Rescue Symposium (aproximação em bolina folgada, velocidade e afastamento); RYA, reach-tack-reach, via Practical Boat Owner",
"fonte_url": "https://www.ussailing.org/wp-content/uploads/2018/03/2005_Crew_Overboard_Symposium.pdf"
},
{
"id": "vela-0041",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 2,
"enunciado": "Uma pessoa cai e o ponto MOB é marcado no GPS. O barco leva 30 minutos para voltar. Não há vento, mas a corrente é de 1 nó e a pessoa deriva com ela. Quanto ela terá derivado em relação ao ponto marcado?",
"alternativas": [
"Nada, o ponto MOB acompanha a deriva da pessoa",
"Cerca de 0,5 milha, ou uns 900 m",
"Cerca de 1 milha, ou uns 1.850 m",
"Cerca de 0,1 milha, ou uns 185 m"
],
"correta": 1,
"explicacao": "Um nó é uma milha por hora. Em meia hora, a corrente leva a pessoa <b>0,5 milha</b>, ou cerca de 926 m. Uma milha inteira só seria percorrida em 1 hora. Os 0,1 milha correspondem a apenas 6 minutos de corrente. O ponto MOB é fixo sobre o fundo: ele guarda a posição do instante do toque e não acompanha a pessoa. Por isso a busca começa no ponto marcado e segue no sentido para onde a corrente leva.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (corrente e deriva); manual do plotter (função MOB)"
},
{
"id": "vela-0042",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 3,
"enunciado": "Um tripulante caiu preso pelo tirante e é arrastado ao lado do barco, a 5 nós, com o rosto quase na água. Qual é a primeira providência?",
"alternativas": [
"Parar o barco o quanto antes, com um quick-stop ou orçando, antes de tentar içá-lo",
"Soltar o mosquetão do convés, para que ele flutue livre do barco, e depois lançar a boia",
"Içá-lo de imediato por uma adriça presa ao tirante, com o barco ainda em marcha",
"Acelerar o motor para chegar a águas abrigadas e içá-lo lá com mais calma"
],
"correta": 0,
"explicacao": "A 5 nós, a água pressiona o corpo e o rosto, e a pessoa pode se afogar em poucos minutos. Por isso o primeiro passo é <b>parar o barco o mais depressa possível</b>: um quick-stop (cambar sem mexer nas escotas) ou, correndo de popa, orçar e arriar o balão. Isso também leva a pessoa para o lado alto do barco. Só então se agarra a pessoa e se iça com ajuda do tirante, ou se joga o Lifesling. <b>Não se iça pela adriça presa ao tirante</b>: a regata Clipper adotou isso, mas nos testes do US Sailing o tirante comum não deslizou pelo mosquetão da adriça e chegou a quebrar, e por isso o US Sailing recomenda os métodos clássicos. Soltar o mosquetão do convés deixaria a pessoa à deriva, sem ligação com o barco. Puxar com o barco em marcha é quase impossível e perigoso. Acelerar só prolonga o arrasto.",
"referencia": "US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1), pessoa ainda presa ao barco; US Sailing, estudo MOB 2020 (Clipper, tirante com engate de soltura rápida)",
"fonte_url": "https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf"
},
{
"id": "vela-0043",
"nivel": "vela",
"tema": "Homem ao mar",
"dificuldade": 2,
"enunciado": "Uma pessoa já está ao lado do veleiro, consciente, mas exausta e sem força para subir pela escada. A borda livre é de cerca de 1 m. Qual é a melhor forma de recolhê-la?",
"alternativas": [
"Pedir que ela nade até a escada de popa e suba degrau por degrau, sozinha",
"Puxá-la pelos braços, com dois tripulantes inclinados sobre a borda do barco",
"Conectá-la ao Lifesling, parar o barco e içá-la com a adriça e a catraca",
"Deixá-la na água, presa por um cabo, até que recupere as forças antes de subir"
],
"correta": 2,
"explicacao": "Para quem não tem força, é preciso <b>ajuda mecânica</b>: conectar a pessoa por um cabo ou pelo Lifesling, <b>parar o barco</b> (o US Sailing pede não arrastá-la a mais de 1 nó) e içá-la com uma adriça (a de balão, presa ao nó de alça do cabo do Lifesling) ou com a talha da escota da grande, usando a catraca. O motor fica em ponto morto ou desligado, e quem estiver inconsciente ou muito tempo na água fria deve ser içado na horizontal. Exigir que ela nade e suba a escada pede força que ela não tem. Puxar pelos braços fere o ombro e arrisca derrubar quem puxa. Deixá-la na água expõe a pessoa ao frio e à exaustão, e o tempo é o maior inimigo.",
"referencia": "US Sailing, Safety at Sea Committee, Results and Recommendations from our MOB Studies (v. 7.1), passos 3 a 5; RYA, Man overboard (içar na horizontal)",
"fonte_url": "https://www.ussailing.org/wp-content/uploads/2025/02/SAS-Current-Thinking-regarding-the-Rescue-of-Crew-Overboard.pdf"
},
{
"id": "vela-0044",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "Na figura, o veleiro está atracado de lado, visto de cima, com a proa para o alto. Qual cabo numerado é o espringue de proa?",
"alternativas": [
"O cabo 1",
"O cabo 2",
"O cabo 3",
"O cabo 4"
],
"correta": 1,
"explicacao": "O espringue de proa <b>sai da proa e segue para ré</b> até o cais: é o cabo 2, que impede o barco de avançar. O cabo 1 também sai da proa, mas segue para vante: é o lançante de proa. O cabo 3 sai da popa e segue para vante: é o espringue de popa, que impede o recuo. O cabo 4 sai da popa e segue para ré: é o lançante de popa.",
"referencia": "Fonseca, M. M., Arte Naval, vol. 2 (amarração); Rousmaniere, The Annapolis Book of Seamanship (docking lines)",
"fonte_url": "https://www.marinha.mil.br/dphdm/node/801",
"figura": {
"svg": "<svg viewBox=\"0 0 320 250\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Veleiro atracado de lado, visto de cima, com quatro cabos numerados ligados ao cais\"><rect x=\"236\" y=\"0\" width=\"84\" height=\"250\" fill=\"var(--land)\"/><text x=\"278\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"var(--ink)\">Cais</text><path d=\"M140 24 C172 58 178 120 172 206 L108 206 C102 120 108 58 140 24 Z\" fill=\"var(--sea-2)\" stroke=\"var(--ink)\" stroke-width=\"2\"/><text x=\"140\" y=\"16\" font-size=\"14\" text-anchor=\"middle\" fill=\"var(--ink)\">Proa</text><g stroke=\"var(--ink)\" stroke-width=\"2\" fill=\"none\"><path d=\"M160 56 L236 36\"/><path d=\"M164 74 L236 134\"/><path d=\"M168 192 L236 104\"/><path d=\"M168 204 L236 226\"/></g><g fill=\"var(--ink)\"><circle cx=\"160\" cy=\"56\" r=\"3.5\"/><circle cx=\"164\" cy=\"74\" r=\"3.5\"/><circle cx=\"168\" cy=\"192\" r=\"3.5\"/><circle cx=\"168\" cy=\"204\" r=\"3.5\"/><circle cx=\"236\" cy=\"36\" r=\"3.5\"/><circle cx=\"236\" cy=\"134\" r=\"3.5\"/><circle cx=\"236\" cy=\"104\" r=\"3.5\"/><circle cx=\"236\" cy=\"226\" r=\"3.5\"/></g><g font-size=\"16\" font-weight=\"700\" fill=\"var(--ink)\" text-anchor=\"middle\"><text x=\"200\" y=\"34\">1</text><text x=\"188\" y=\"90\">2</text><text x=\"192\" y=\"150\">3</text><text x=\"204\" y=\"206\">4</text></g></svg>"
}
},
{
"id": "vela-0045",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "Um veleiro vai pernoitar fundeado com rode misto (corrente e cabo), na razão de 7:1. A profundidade no local é de 6 m, a maré ainda vai subir 2 m até a preamar e a roldana de proa fica 1 m acima da água. Quanto filame deve ser largado?",
"alternativas": [
"42 m",
"49 m",
"56 m",
"63 m"
],
"correta": 3,
"explicacao": "Altura a considerar: 6 m (profundidade) + 2 m (maré até a preamar) + 1 m (roldana de proa) = <b>9 m</b>. Com 7:1, o filame é 9 × 7 = <b>63 m</b>. Os 42 m usam só a profundidade (6 × 7). Os 49 m esquecem a maré: (6 + 1) × 7. Os 56 m esquecem a altura da roldana: (6 + 2) × 7. Esquecer qualquer parcela deixa o filame curto justamente na preamar, quando a profundidade é maior e o mesmo filame dá menos escopo: a âncora trabalha mais na vertical e fica exposta a sair do fundo.",
"referencia": "Rousmaniere, The Annapolis Book of Seamanship (fundeio e filame); NauticEd, Anchoring rode and scope",
"fonte_url": "https://sailing-blog.nauticed.org/anchoring-rode-and-scope/"
},
{
"id": "vela-0046",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 3,
"enunciado": "Você fundeou com 5 m de profundidade, maré subindo mais 1 m, roldana a 1 m da água e rode de corrente na razão de 5:1. O barco tem 10 m. Para o alarme de fundeio do GPS, o raio é o filame mais o comprimento do barco mais 10 m de margem para o erro do GPS. Qual raio programar?",
"alternativas": [
"35 m",
"45 m",
"55 m",
"69 m"
],
"correta": 2,
"explicacao": "Altura: 5 + 1 + 1 = 7 m. Filame: 7 × 5 = 35 m. Raio do alarme: 35 (filame) + 10 (barco) + 10 (margem) = <b>55 m</b>. Os 35 m esquecem o barco e a margem: o alarme dispararia a cada giro normal. Os 45 m esquecem a margem do GPS. Os 69 m vêm de usar 7:1 (49 m) em vez de 5:1: o raio ficaria grande demais, e o alarme só tocaria depois de o barco já estar bem longe da posição.",
"referencia": "Rousmaniere, The Annapolis Book of Seamanship (fundeio); NauticEd, Anchoring rode and scope",
"fonte_url": "https://sailing-blog.nauticed.org/anchoring-rode-and-scope/"
},
{
"id": "vela-0047",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "O veleiro tem hélice de passo à direita. Ao atracar de lado, qual bordo é mais favorável para aproveitar o efeito de passo quando se dá atrás para parar o barco?",
"alternativas": [
"Bombordo, porque dando atrás a popa vai para bombordo e se encosta no cais",
"Boreste, porque dando atrás a popa vai para boreste e se encosta no cais",
"Tanto faz, pois o leme anula o efeito de passo quando se dá atrás",
"O bordo de onde vem o vento, pois o efeito de passo é sempre menor que o do vento"
],
"correta": 0,
"explicacao": "Com hélice de passo à direita, dar atrás leva a popa para <b>bombordo</b>. Se o cais está a bombordo, a popa vem em direção a ele, e a mesma rabanada que para o barco o encosta. A alternativa de boreste inverte o efeito. O leme não anula o efeito de passo: com pouco seguimento a ré, ele governa pouco, e o passo domina. O vento pode mudar a manobra, mas não torna o efeito de passo irrelevante, nem é regra fixa para escolher o bordo.",
"referencia": "Fonseca, M. M., Arte Naval, vol. 2 (efeito do hélice e atracação); Rousmaniere, The Annapolis Book of Seamanship",
"fonte_url": "https://www.marinha.mil.br/dphdm/node/801"
},
{
"id": "vela-0048",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "Um veleiro de calado 1,8 m fundeia na preamar, com 6 m de água. A baixa-mar seguinte será 4,5 m mais baixa que a preamar. O que acontecerá?",
"alternativas": [
"Ficará livre, com 4,2 m de água sob a quilha mesmo na baixa-mar",
"Tocará o fundo: restarão 1,5 m de água e o calado é de 1,8 m",
"Ficará livre, com 1,5 m de folga sob a quilha na baixa-mar",
"Só tocará o fundo se a maré baixar mais de 6 m abaixo da preamar"
],
"correta": 1,
"explicacao": "Na baixa-mar a profundidade será 6 − 4,5 = <b>1,5 m</b>, menor que o calado de 1,8 m: o barco toca o fundo (faltam 0,3 m). Os 4,2 m de folga (6 − 1,8) valem só na preamar e ignoram a descida da maré. Os 1,5 m são a profundidade, não a folga sob a quilha, que seria negativa. E o barco já toca o fundo quando a maré baixa mais de 4,2 m (6 − 1,8), bem antes dos 6 m.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I (marés e profundidade); calado e folga sob a quilha"
},
{
"id": "vela-0049",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 1,
"enunciado": "De dia, um veleiro de 10 m fundeado em um fundeadouro comum deve exibir, a vante, qual marca?",
"alternativas": [
"Um cone com o vértice para baixo, na parte da proa, onde é melhor visto",
"Dois cones unidos pelos vértices, na parte da proa, onde é melhor visto",
"Uma esfera preta, na parte da proa, onde é melhor vista",
"Um cilindro preto, na parte da proa, onde é melhor visto"
],
"correta": 2,
"explicacao": "A Regra 30(a)(i) manda a embarcação fundeada exibir, a vante, <b>uma luz circular branca</b> à noite ou <b>uma esfera</b> de dia; as marcas diurnas são pretas (RIPEAM, Anexo I, item 6). O cone com o vértice para baixo é a marca do veleiro que navega a vela e a motor (Regra 25(e)). Dois cones unidos pelos vértices indicam embarcação de pesca de arrasto (Regra 26(b)). O cilindro é a marca de embarcação restringida pelo calado (Regra 28).",
"referencia": "RIPEAM-72, Regra 30(a)(i); Anexo I, item 6 (marcas diurnas)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0050",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "Você navega a vela e quer fundear para pernoitar. Qual das alternativas é uma área de segurança, onde a NORMAM-211 proíbe o tráfego e o fundeio?",
"alternativas": [
"Qualquer enseada abrigada com menos de 10 m de profundidade",
"Qualquer trecho de água a menos de 50 m de outra embarcação fundeada",
"Qualquer trecho de água a menos de 1 milha de uma marina",
"A faixa de 500 m em torno de unidade estacionária de produção de petróleo"
],
"correta": 3,
"explicacao": "O item 1.9 da NORMAM-211 lista as áreas de segurança: fundeadouros de navios mercantes, canais de acesso aos portos, proximidades das instalações do porto, a faixa de 500 m em torno de unidades estacionárias de produção de petróleo (item 1.9.6) e áreas especiais de Avisos aos Navegantes. Pela nota 4, não é permitido o tráfego nem o fundeio nelas. A profundidade da enseada não define área de segurança, e a distância de outra embarcação fundeada é apenas boa prática de espaço de giro. Perto de marinas, o acesso por canais de porto é regulado pelas NPCP/NPCF de cada Capitania, e não há proibição geral.",
"referencia": "NORMAM-211/DPC, item 1.9 (áreas de segurança), 1.9.6 e nota 4",
"fonte_url": "https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf"
},
{
"id": "vela-0051",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 1,
"enunciado": "Ao se aproximar de uma boia de amarração, por que o proeiro aponta a boia com o braço esticado o tempo todo?",
"alternativas": [
"Porque a boia só fica presa ao cabo se o proeiro a apontar com o braço esticado",
"Porque, vista do leme, a boia some sob a proa e o timoneiro deixa de enxergá-la",
"Porque a Capitania exige que o gesto seja feito para registrar a pega da boia",
"Porque o gesto reduz a corrente que empurra o barco contra a boia durante a pega"
],
"correta": 1,
"explicacao": "Perto da proa, a boia desaparece da vista de quem governa. O proeiro, que ainda a enxerga, <b>aponta</b> para o timoneiro corrigir o rumo e a velocidade até a pega. O gesto não prende a boia a nada, não é exigência de registro da Capitania, não reduz a corrente e não mede distância.",
"referencia": "Fonseca, M. M., Arte Naval, vol. 2 (manobra de pegar boia); Rousmaniere, The Annapolis Book of Seamanship (mooring)",
"fonte_url": "https://www.marinha.mil.br/dphdm/node/801"
},
{
"id": "vela-0052",
"nivel": "vela",
"tema": "Fundeio e porto",
"dificuldade": 2,
"enunciado": "Na figura, cada círculo é a área em que um barco fundeado pode girar, com raio igual ao filame mais o comprimento do barco. O seu barco tem 10 m e 30 m de filame. O vizinho tem 9 m e 26 m de filame. Para os círculos não se sobreporem, qual é a distância mínima entre as duas âncoras?",
"alternativas": [
"75 m",
"40 m",
"65 m",
"150 m"
],
"correta": 0,
"explicacao": "Seu raio de giro: 30 + 10 = 40 m. Raio do vizinho: 26 + 9 = 35 m. Para os círculos apenas se tocarem, as âncoras ficam a 40 + 35 = <b>75 m</b>. Os 40 m consideram só o seu raio. Os 65 m somam o seu filame ao raio do vizinho (30 + 35) e esquecem o seu comprimento. Os 150 m dobram a conta sem necessidade.",
"referencia": "Fonseca, M. M., Arte Naval, vol. 2 (fundeio e espaço de giro); Rousmaniere, The Annapolis Book of Seamanship",
"fonte_url": "https://www.marinha.mil.br/dphdm/node/801",
"figura": {
"svg": "<svg viewBox=\"0 0 360 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Dois círculos de giro de barcos fundeados, lado a lado, tocando-se em um ponto; cada âncora está no centro do seu círculo\"><circle cx=\"85\" cy=\"85\" r=\"80\" fill=\"var(--sea-1)\" fill-opacity=\"0.45\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/><circle cx=\"235\" cy=\"85\" r=\"70\" fill=\"var(--sea-2)\" fill-opacity=\"0.45\" stroke=\"var(--ink)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/><line x1=\"85\" y1=\"85\" x2=\"235\" y2=\"85\" stroke=\"var(--ink)\" stroke-width=\"1.5\"/><circle cx=\"85\" cy=\"85\" r=\"4.5\" fill=\"var(--ink)\"/><circle cx=\"235\" cy=\"85\" r=\"4.5\" fill=\"var(--ink)\"/><g font-size=\"15\" fill=\"var(--ink)\" text-anchor=\"middle\"><text x=\"85\" y=\"62\">Seu barco</text><text x=\"235\" y=\"62\">Vizinho</text><text x=\"160\" y=\"106\" font-weight=\"700\">?</text><text x=\"85\" y=\"108\" font-size=\"13\">âncora</text><text x=\"235\" y=\"108\" font-size=\"13\">âncora</text></g></svg>"
}
},
{
"id": "vela-0053",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 1,
"enunciado": "À noite, um veleiro de 10 m navega só a vela. Um navio que o alcança por trás, exatamente na sua popa, enxerga qual luz do seu barco?",
"alternativas": [
"As luzes verde e encarnada de bordos, lado a lado",
"Apenas a luz branca de alcançado, situada junto à popa",
"A luz de mastro branca e a luz verde de boreste",
"Nenhuma luz, pois a luz de alcançado só é vista pelos lados"
],
"correta": 1,
"explicacao": "A luz de alcançado é branca, junto à popa, e visível num setor de <b>135°</b>, com 67,5° de cada lado da popa (Regra 21(c)). As luzes de bordos cobrem da proa até 22,5° a ré do través (112,5° cada), e por isso não aparecem por trás. A luz de mastro é de embarcação de propulsão mecânica. Quem alcança, pela Regra 13(b), só vê a luz de alcançado. Na lanterna combinada do tricolor, a luz branca de popa segue o mesmo setor, e a resposta vale para os dois arranjos.",
"referencia": "RIPEAM-72, Regras 21(b), 21(c), 25(b) e 13(b)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0054",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 3,
"enunciado": "Ao anoitecer, um veleiro de 10 m navega só a vela, com a lanterna tricolor do topo do mastro acesa. O vento morre, o comandante liga o motor e segue motorando, com as velas içadas. O que ele deve fazer com as luzes?",
"alternativas": [
"Manter o tricolor aceso, porque as velas continuam içadas",
"Manter o tricolor e acender também uma luz encarnada sobre uma verde no topo",
"Apagar todas as luzes até desligar o motor, para poupar bateria",
"Apagar o tricolor e exibir as luzes de embarcação de propulsão mecânica"
],
"correta": 3,
"explicacao": "Com o motor em uso, o veleiro passa a ser <b>embarcação de propulsão mecânica</b> (Regras 3(b) e 3(c): só é embarcação a vela enquanto a máquina não está sendo usada). Como tem menos de 12 m, pode usar uma luz circular branca e luzes de bordos (Regra 23(d)(i)). O tricolor só vale para quem navega a vela (Regra 25(b)), e manter o tricolor ignora a mudança de categoria. A encarnada sobre verde é luz de veleiro a vela e não pode ser usada junto com a lanterna combinada (Regra 25(c)), nem com o motor em uso. Apagar todas as luzes é errado: elas valem do pôr ao nascer do Sol (Regra 20(b)).",
"referencia": "RIPEAM-72, Regras 3(b), 3(c), 20(b), 23(d)(i), 25(b) e 25(c)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0055",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 2,
"enunciado": "Dois veleiros de 9 m navegam à noite em rumos opostos, cada um a 6 nós, e só se avistam pelas luzes de bordos, no alcance mínimo da Regra 22(c) para embarcações com menos de 12 m. Quanto tempo falta para se cruzarem, se nada mudar?",
"alternativas": [
"2,5 minutos",
"10 minutos",
"5 minutos",
"20 minutos"
],
"correta": 2,
"explicacao": "Pela Regra 22(c), as luzes de bordos de embarcações com menos de 12 m têm alcance mínimo de <b>1 milha</b>. Em rumos opostos, as velocidades se somam: 6 + 6 = 12 nós. Tempo = 1 milha ÷ 12 nós = 1/12 de hora = <b>5 minutos</b>. Os 10 minutos usam só uma das velocidades (1 milha ÷ 6 nós). Os 20 minutos usam o alcance de 2 milhas da luz de mastro e só uma velocidade. Os 2,5 minutos tomam a milha pela metade. Cinco minutos é pouquíssimo tempo, por isso a vigia e a velocidade segura são vitais à noite.",
"referencia": "RIPEAM-72, Regra 22(c) (alcance das luzes) e Regra 6 (velocidade segura)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0056",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 1,
"enunciado": "Três tripulantes dividem a noite em quartos de 3 horas, em rodízio e sem folga entre um quarto e outro. Quantas horas seguidas cada um descansa entre dois quartos?",
"alternativas": [
"3 horas",
"4 horas",
"6 horas",
"9 horas"
],
"correta": 2,
"explicacao": "Com três pessoas em rodízio, cada ciclo dura 3 × 3 = 9 horas: 3 horas de quarto e <b>6 horas de descanso</b>. Três horas de descanso seria o caso de apenas duas pessoas em rodízio. Quatro horas não fecha a conta, e nove horas seria o ciclo inteiro, sem descontar o quarto. A escala precisa dar descanso real a todos, porque tripulação cansada vigia mal (Regra 5).",
"referencia": "RIPEAM-72, Regra 5 (vigilância permanente); RYA Yachtmaster Offshore Handbook (organização de quartos)",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0057",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 3,
"enunciado": "Vindo do mar, você avista uma boia verde com larga faixa horizontal encarnada e luz verde de grupo de lampejos compostos Lp(2+1). O que ela indica, na Região B da IALA?",
"alternativas": [
"Canal preferencial a boreste (bombordo modificado)",
"Canal preferencial a bombordo (boreste modificado)",
"Perigo isolado, que pode ser contornado por qualquer lado",
"Águas seguras, que permitem passar por todos os lados"
],
"correta": 0,
"explicacao": "Verde com larga faixa horizontal encarnada e luz verde Lp(2+1) é o <b>canal preferencial a boreste</b> (bombordo modificado): o canal principal fica a boreste da boia, que fica por bombordo de quem segue por ele. Seu oposto, o canal preferencial a bombordo (boreste modificado), é encarnado com larga faixa verde e luz encarnada Lp(2+1). O perigo isolado é preto com faixas encarnadas e tope de duas esferas pretas. Águas seguras têm faixas verticais encarnadas e brancas.",
"referencia": "Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 13 (Fig. 13.15, sinais laterais da Região B, canais preferenciais); Decreto nº 92.267/1986 (adota a Região B no Brasil)",
"fonte_url": "https://www.planalto.gov.br/ccivil_03/decreto/1980-1989/1985-1987/d92267.htm"
},
{
"id": "vela-0058",
"nivel": "vela",
"tema": "Navegação noturna",
"dificuldade": 1,
"enunciado": "Você sobe da cabine iluminada para assumir o quarto da noite. O que fazer para enxergar melhor no escuro?",
"alternativas": [
"Acender a lanterna branca forte e varrer o horizonte para acelerar a adaptação dos olhos",
"Olhar fixamente para um só ponto escuro do horizonte, sem piscar",
"Conferir a posição no plotter com o brilho no máximo, antes de olhar para fora",
"Evitar luz forte, deixar a vista se adaptar e olhar um pouco ao lado de objetos fracos"
],
"correta": 3,
"explicacao": "Os olhos levam cerca de <b>30 minutos</b> para se adaptar ao escuro, e uma luz forte desfaz boa parte do ganho em segundos. Por isso se usa o mínimo de luz, com as telas dimerizadas. Olhar de 5° a 10° ao lado de um objeto fraco ajuda, porque o centro da retina tem poucos receptores sensíveis a pouca luz. Lanterna forte e plotter no máximo cegam o vigia. Olhar fixamente para um ponto faz objetos fracos sumirem.",
"referencia": "RIPEAM-72, Regra 5 (vigilância visual); RYA Day Skipper Handbook (Sail), vigia noturna",
"fonte_url": "https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf"
},
{
"id": "vela-0059",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 2,
"enunciado": "O METEOROMARINHA prevê ventos de 30 nós para a sua área. Na escala Beaufort e nos critérios de aviso de mau tempo do CHM, isso é:",
"alternativas": [
"Força 6, ainda abaixo do limite em que o CHM emite aviso de mau tempo",
"Força 7, no limite do aviso de mau tempo do CHM (28 nós ou mais)",
"Força 8, e o aviso de mau tempo só é emitido a partir da força 9",
"Força 5, e o aviso depende apenas da altura das ondas, não do vento"
],
"correta": 1,
"explicacao": "A força 7 de Beaufort vai de 28 a 33 nós, então 30 nós é <b>força 7</b>. O CHM emite aviso de mau tempo quando se prevê vento força 7 ou mais (28 nós ou mais), ondas de 3 m ou mais em águas profundas, visibilidade de 1 km ou menos, ou ressaca com ondas de 2,5 m ou mais na costa. A força 6 vai de 22 a 27 nós, abaixo desse limite. A força 8 começa em 34 nós, e o aviso não espera a força 9. A força 5 vai de 17 a 21 nós, e nenhum vento dessa faixa, sozinho, leva ao aviso: o critério de vento começa na força 7.",
"referencia": "CHM/DHN, Serviços Radiometeorológicos de Apoio ao Navegante (critérios do aviso de mau tempo; fato travessia-96); escala Beaufort (OMM)",
"fonte_url": "https://www.marinha.mil.br/chm/dados-do-smm-informacoes-gerais/servicos-radiometeorologicos-de-apoio-ao-navegante"
},
{
"id": "vela-0060",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 3,
"enunciado": "Um veleiro corre em popa com vento real de 25 nós, a 6 nós de velocidade. O vento aparente é de 19 nós e a navegação parece tranquila. A tripulação vai orçar para a bolina em seguida. Qual é a decisão mais prudente?",
"alternativas": [
"Orçar já com todo o pano, porque o vento aparente de 19 nós mostra vento moderado",
"Manter o pano e orçar devagar, pois o vento aparente costuma cair quando se orça",
"Içar o balão antes de orçar, para ganhar velocidade e atravessar a virada mais rápido",
"Reduzir pano antes de orçar, porque na bolina o vento aparente sobe para perto de 30 nós"
],
"correta": 3,
"explicacao": "Em popa, o vento aparente é a diferença: 25 − 6 = 19 nós. Na bolina, a 45° do vento real e com o barco a uns 6 nós, o aparente sobe para <b>perto de 30 nós</b>: o vento real de 25 nós somado ao vento do deslocamento de 6 nós dá cerca de 30 nós (cálculo vetorial: a 45° do vento, o vento real de 25 nós se decompõe em 17,7 nós ao longo da proa e 17,7 nós de lado; somando os 6 nós do barco ao componente de proa, ficam 23,7 nós ao longo da proa e 17,7 de lado, e a resultante é √(23,7² + 17,7²) ≈ 29,6 nós). Quem orça com todo o pano de popa leva um susto: banda, leme duro e manobra feita às pressas. O vento aparente <b>aumenta</b>, e não cai, ao orçar. Içar o balão é o oposto do que se precisa. A regra é reduzir cedo, ainda no rumo calmo.",
"referencia": "Coles e Bruce, Heavy Weather Sailing (reduzir pano cedo); RYA Day Skipper Handbook (Sail), vento aparente"
},
{
"id": "vela-0061",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 1,
"enunciado": "Para que serve, na prática, capear (heave-to) um veleiro de cruzeiro?",
"alternativas": [
"Para ganhar velocidade em direção ao porto quando o vento aumenta",
"Para trocar de bordo mais depressa, sem perder velocidade no meio da manobra",
"Para substituir a âncora de popa quando o fundo é de lama e não segura",
"Para deixar o barco quase parado e estável, e descansar ou rizar com calma"
],
"correta": 3,
"explicacao": "Capeado, o barco fica <b>quase parado e estável</b>, com a proa a uns 50° a 60° do vento: é uma pausa para comer, descansar, rizar ou pensar com calma. Não serve para ganhar velocidade, pois o barco quase não anda. Não substitui a âncora, pois continua derivando devagar. E não é forma de virar mais depressa: a virada exige seguimento, e o barco capeado está quase parado.",
"referencia": "RYA Yachtmaster Offshore Handbook (heave-to); Coles e Bruce, Heavy Weather Sailing"
},
{
"id": "vela-0062",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 2,
"enunciado": "Correndo com o tempo em mar grosso, o barco começa a surfar as ondas e a perder o governo. Qual recurso ajuda a moderar a velocidade e a manter a popa alinhada com as ondas?",
"alternativas": [
"Um drogue (âncora de arrasto), rebocado pela popa, para frear o barco",
"Uma âncora flutuante lançada pela proa, para manter a proa ao mar",
"Mais pano na grande e na genoa, para fugir mais depressa das ondas altas",
"O burro bem caçado, para segurar a retranca e controlar a torção"
],
"correta": 0,
"explicacao": "O <b>drogue</b> (âncora de arrasto) é rebocado pela popa: ele freia o barco e mantém a popa alinhada com as ondas, o que reduz o risco de atravessar. A âncora flutuante é lançada pela proa e mantém a proa ao mar, com o barco quase parado: não serve para correr com o tempo. Mais pano aumenta a velocidade e o risco de surfar fora de controle. O burro controla a torção da grande e não tem relação com a velocidade do barco.",
"referencia": "Coles e Bruce, Heavy Weather Sailing; Pardey, The Storm Tactics Handbook"
},
{
"id": "vela-0063",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 3,
"enunciado": "Correndo com o tempo, um veleiro vai muito devagar, e as ondas grandes o ultrapassam por baixo da popa. Qual é o risco?",
"alternativas": [
"A proa afunda na onda da frente, porque o barco é mais rápido do que a onda",
"O vento aparente aumenta muito, e o mastro tende a se inclinar para a proa",
"A popa é levantada, o leme perde efeito e o barco pode atravessar na onda",
"O barco para de derivar e fica imóvel, protegido pelas ondas maiores"
],
"correta": 2,
"explicacao": "Quando a onda passa por baixo da popa, esta é levantada e o <b>leme perde o efeito</b>: o barco pode girar para o través e ser atingido de lado (broaching). Enterrar a proa na onda da frente é o risco oposto, de quem corre <i>mais depressa</i> que a onda, e não é o caso de quem vai devagar. Em popa, o vento aparente é menor, e não maior. E o barco não fica imóvel: continua sendo levado pelas ondas e pelo vento.",
"referencia": "Coles e Bruce, Heavy Weather Sailing (correr com o tempo e broaching)"
},
{
"id": "vela-0064",
"nivel": "vela",
"tema": "Mau tempo",
"dificuldade": 2,
"enunciado": "Qual vela de tempestade é içada no mastro, em pista própria, separada da vela grande?",
"alternativas": [
"Vela de capa (trysail), pequena e reforçada",
"Tormentim (storm jib), de proa, içado no estai",
"Genoa enrolada até a metade, ainda em uso normal",
"Vela grande com o terceiro rizo, presa à retranca"
],
"correta": 0,
"explicacao": "A <b>vela de capa</b> (<i>trysail</i>) é uma vela pequena e muito resistente, içada no mastro por pista própria, separada da vela grande. O tormentim também é vela de tempestade, mas é vela de proa: fica no estai. A genoa enrolada até a metade continua sendo vela de proa de uso normal, que perde a forma. A grande com o terceiro rizo continua na pista e na retranca da própria grande.",
"referencia": "RYA Yachtmaster Offshore Handbook (velas de tempestade); World Sailing, Offshore Special Regulations (vela de capa e buja de tempestade; fato travessia-32)"
},
{
"id": "vela-0065",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 1,
"enunciado": "Qual peça do aparelho fixo segura o mastro contra a queda para os lados?",
"alternativas": [
"A adriça da vela grande, que iça a vela até o topo",
"O estai, que segura o mastro para a proa, contra a queda para vante",
"O burro, que puxa a retranca para baixo, na popa",
"O brandal, que segura o mastro para os bordos"
],
"correta": 3,
"explicacao": "Os <b>brandais</b> são cabos do aparelho fixo que descem do alto do mastro até os bordos do casco e seguram o mastro lateralmente. O estai, também do aparelho fixo, segura o mastro para a proa (contra a queda para vante). A adriça iça a vela, e o burro puxa a retranca para baixo: esses dois são do aparelho de laborar, manobrados durante a navegação.",
"referencia": "Glossário náutico (aparelho fixo e de laborar); curso vela-1, módulo de anatomia do veleiro"
},
{
"id": "vela-0066",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 2,
"enunciado": "Um veleiro tem banco de serviço de 200 Ah de baterias de chumbo-ácido e consome 50 Ah por dia. Usando só metade da capacidade antes de recarregar, quantos dias o banco aguenta sem carga?",
"alternativas": [
"1 dia",
"2 dias",
"3 dias",
"4 dias"
],
"correta": 1,
"explicacao": "Em chumbo-ácido, a regra prática é usar no máximo cerca de <b>metade</b> da capacidade: 200 ÷ 2 = 100 Ah úteis. Dividindo pelo consumo: 100 ÷ 50 = <b>2 dias</b>. Um dia consumiria só 50 Ah (um quarto do banco), e três dias exigiriam 150 Ah, mais que a metade útil. Os 4 dias usam a capacidade inteira (200 ÷ 50), o que descarrega demais e encurta a vida do banco.",
"referencia": "Calder, Boatowner’s Mechanical and Electrical Manual (baterias e orçamento de energia)"
},
{
"id": "vela-0067",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 2,
"enunciado": "Logo após a partida, o motor diesel de um veleiro não lança água pelo escape e a temperatura sobe. Qual é a primeira verificação?",
"alternativas": [
"Se o tanque tem diesel suficiente para o motor funcionar até o porto",
"Se a bateria de serviço está carregada para a próxima partida",
"Se a válvula de fundo está aberta e o filtro de água do mar, limpo",
"Se o hélice está enrolado em algum cabo ou rede de pesca"
],
"correta": 2,
"explicacao": "Sem água no escape, a bomba de água do mar não está bombeando. As causas mais comuns são a <b>válvula de fundo fechada</b> e o <b>filtro de água do mar entupido</b> por alga ou plástico. Depois vem o impelidor danificado. O motor sem água superaquece e deve ser desligado logo, para não queimar o impelidor. Falta de diesel ou de bateria não explica a falta de água no escape, e o hélice enrolado prejudica o avanço, não o resfriamento.",
"referencia": "Calder, Boatowner’s Mechanical and Electrical Manual (motores diesel e circuito de água do mar)"
},
{
"id": "vela-0068",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 1,
"enunciado": "Você sente cheiro de gás de cozinha na cabine do veleiro. Qual é a primeira providência?",
"alternativas": [
"Ligar a luz da cabine para localizar o vazamento com mais facilidade",
"Ligar a bomba de porão elétrica para tirar o gás que está na sentina",
"Fechar o registro do cilindro e ventilar, sem acionar interruptores",
"Fechar bem a cabine e esperar que o gás saia sozinho pelas frestas"
],
"correta": 2,
"explicacao": "O GLP é mais pesado que o ar, escorre para a sentina e explode com uma faísca. A conduta é <b>fechar o registro do cilindro</b> e <b>ventilar</b> bastante (escotilhas e gaiuta abertas), sem acionar nada elétrico. Acender luz ou ligar a bomba de porão elétrica pode gerar faísca. Fechar a cabine mantém o gás acumulado onde ele é mais perigoso. Só se procura o vazamento depois que o cheiro sumir.",
"referencia": "ISO 10239 (sistemas de GLP em embarcações); ABYC A-1"
},
{
"id": "vela-0069",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 3,
"enunciado": "Com o veleiro adernado a 25°, entra água do mar na pia da cozinha, cuja descarga sai pelo casco um pouco acima da linha d’água em repouso. Qual é a causa e a solução?",
"alternativas": [
"A descarga fica abaixo da água ao adernar; alça alta no cano e válvula fechada na banda",
"A bomba de porão devolve água à pia; a solução é trocá-la por outra mais potente",
"A válvula de fundo é pequena para o cano; a solução é trocá-la por uma maior, de bronze",
"A água doce do tanque sobe pelo cano, e a solução é esvaziar o tanque antes de cada viagem"
],
"correta": 0,
"explicacao": "Com a banda, o lado baixo do casco afunda e a <b>descarga da pia fica abaixo da linha d’água</b>: a água do mar entra pelo cano e inunda a pia. A solução é a <b>alça alta</b> (<i>loop</i>) no cano, acima do nível da água mesmo adernado, e fechar a válvula de fundo ao navegar muito adernado. A bomba de porão não tem relação com a entrada de água pela pia. Uma válvula maior só deixaria entrar mais água. E o tanque de água doce não faz a água do mar subir pela pia.",
"referencia": "RYA Yachtmaster Offshore Handbook (válvulas de fundo e passa-cascos); Calder, Boatowner’s Mechanical and Electrical Manual; curso vela-2 (alça alta na descarga)"
},
{
"id": "vela-0070",
"nivel": "vela",
"tema": "Anatomia e sistemas do barco",
"dificuldade": 2,
"enunciado": "No copo transparente do pré-filtro separador do diesel, onde a água se acumula?",
"alternativas": [
"Na superfície, porque a água é menos densa que o diesel e sobe",
"No fundo, porque a água é mais densa que o diesel",
"Misturada ao diesel, porque os dois formam uma solução única",
"Na tampa do copo, porque a água evapora com o calor do motor"
],
"correta": 1,
"explicacao": "A água é mais densa que o diesel (cerca de 1,0 contra 0,85 g/mL), então <b>vai para o fundo</b> do copo, onde se vê e se drena. O diesel fica por cima, ao contrário do que supõe a primeira alternativa. Diesel e água não formam solução: a água se separa em gotas e, se agitada, deixa o combustível turvo. E o calor do motor não faz a água subir à tampa do copo. Drene o copo periodicamente e sempre que abastecer em lugar duvidoso.",
"referencia": "Calder, Boatowner’s Mechanical and Electrical Manual (sistema de combustível diesel)"
}
]);
