# Widgets (simuladores e visualizações)

Gerado por `tools/build_widgets_doc.py` a partir do cabeçalho de cada arquivo em `app/widgets/`.
Use num bloco de lição: `{t:'widget', w:'<nome>', opts:{...}}`. Teste isolado: `#/lab/<nome>?opts=<json>`.

## agulha-calc

`app/widgets/agulha-calc.js` — 55 KB

```
Conversão de rumos e marcações: verdadeiro (Rv), magnético (Rmg) e da agulha (Rag).
Declinação magnética (Dec mg, E/W, atualizada pelo ano a partir da anotação da carta) e desvio da agulha
(Dag, E/W, pela tabela/curva de desvios, com interpolação). Rosa com três anéis (verdadeiro, magnético e
da agulha): arraste a proa ou a marcação e leia o valor em cada anel. Modo exercício com problemas gerados
(rumos, marcações, atualização da declinação, desvio por alinhamento) e resolução comentada.

Convenção (Manual de Navegação da Marinha do Brasil, Vol. I, DHN, 2ª rev. 2023, item 3.2.5):
Rv = Rmg ± Dec mg   e   Rmg = Rag ± Dag,  com E positivo e W negativo;
valores aproximados a 0,5°; o desvio se obtém com a PROA (nunca com a marcação);
ao entrar na curva com o Rag, usa-se o Rag como se fosse o Rmg (Manual, 3.2.5, exemplo 2).

opts (todas opcionais):
modo:        'explorar' (padrão) | 'exercicio'
tipo:        'rumo' (padrão) | 'marcacao'
conhecido:   'ag' (padrão) | 'mg' | 'v'   — qual valor o aluno conhece
valor:       valor conhecido em graus (padrão 85)
proa:        proa da agulha (Rag) usada nas marcações (padrão 110)
ano:         ano da navegação (padrão: ano atual)
declinacao:  {graus:22, min:10, lado:'W', ano:2025, varMin:7, varLado:'W'} (a mesma da carta-nautica)
desvios:     tabela [[proa, desvio], …] com desvio E positivo/W negativo (padrão: exemplo de 30 em 30°)
exercicio:   tipo inicial: 'rag-rv' (padrão) | 'rv-rag' | 'dec' | 'marc' | 'marc-inv' | 'alinhamento'

Exemplo de bloco de lição:
{t:'widget', w:'agulha-calc', opts:{conhecido:'v', valor:78}}
{t:'widget', w:'agulha-calc', opts:{modo:'exercicio', exercicio:'marc'}}
```

## alfabeto-fonetico

`app/widgets/alfabeto-fonetico.js` — 42 KB

```
alfabeto-fonetico — alfabeto fonético e código de algarismos da UIT (Regulamento de Radiocomunicações, Apêndice 14,
Rev. CMR-23), com a pronúncia oficial ("spoken as", sílabas tônicas sublinhadas), uma leitura aproximada em
português (não oficial), conversor para soletrar nome do barco, indicativo ou MMSI e três treinos com cronômetro e
placar: soletrar, ouvir e digitar (voz sintética do navegador, com alternativa só visual) e contra o relógio.

Fontes citadas na interface:
- UIT, Regulamento de Radiocomunicações (RR), edição de 2024, Vol. 2, Apêndice 14 (Rev. CMR-23):
§1 tabela de letras (nota 1: sílabas tônicas sublinhadas); §2 algarismos e sinais (nota 2: todas as sílabas com a
mesma ênfase); §3 estações do mesmo país, entre si, podem usar outra tabela reconhecida pela sua administração.
- RR, Art. 32, n.º 32.7 (usar o Apêndice 14) e nota 32.7.1 (as pronúncias de algarismos do Apêndice 14 e das Frases
Padronizadas de Comunicação Marítima da IMO, SMCP, são diferentes).
- Anatel, Material de apoio ao exame de Radiotelefonista, versão 2026-03, item 2.1.9.1 (grafa PENTAFIVE; o RR grafa
Pantafive — seguimos o RR).

Expõe VL.fonetico = { LETRAS, ALGARISMOS, POR_CHAR, soletrar(texto, {algarismos}), voz } para outros widgets
(widgets/vhf-sim.js usa para soletrar indicativo e MMSI).

opts de mount (todos opcionais):
modo:       'tabela' | 'soletrar' | 'ouvir' | 'relogio'      aba inicial (padrão 'tabela')
modos:      ['tabela', 'soletrar', 'ouvir', 'relogio']        abas exibidas (padrão: todas)
tabela:     'letras' | 'algarismos'                           grupo inicial da tabela (padrão 'letras')
texto:      'Albatroz PQ4821'                                 texto inicial do conversor
algarismos: 'uit' | 'simples'                                 como soletrar algarismos (padrão 'uit')
leituraBr:  true                                              mostra a leitura aproximada em português
ouvir:      { n: 10, tipo: 'indicativos' | 'palavras' | 'mmsi' | 'misto' }      (padrão n 10, tipo 'misto')
relogio:    { segundos: 60, direcao: 'letra' | 'palavra', resposta: 'tocar' | 'digitar', algarismos: false }
titulo:     legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'alfabeto-fonetico', opts:{}}
{t:'widget', w:'alfabeto-fonetico', opts:{modo:'soletrar', texto:'Maresia PQ7310'}}
{t:'widget', w:'alfabeto-fonetico', opts:{modo:'ouvir', modos:['ouvir'], ouvir:{n:8, tipo:'indicativos'}}}
{t:'widget', w:'alfabeto-fonetico', opts:{modo:'relogio', modos:['tabela','relogio'], relogio:{segundos:60}}}
```

## beaufort

`app/widgets/beaufort.js` — 50 KB

```
beaufort — escala Beaufort 0 a 12 com o mar desenhado (SVG animado) e um veleiro de cruzeiro em escala (modelo de ~32 pés, como exemplo).

Para cada força: velocidade (nós, km/h, m/s), termo usado pela Marinha do Brasil, aspecto do mar, altura provável das
ondas em mar aberto, estado do mar na escala Douglas e uma ORIENTAÇÃO GERAL de vela para um veleiro de cruzeiro (referência: um barco de ~32 pés)
(quando rizar etc.). A orientação é marcada na interface como geral, não como regra.

Fontes citadas na interface:
- Termos e faixas em nós: Centro de Hidrografia da Marinha (CHM), "Escala Beaufort" (fonte do CHM: WMO nº 8, vol. III, 2023)
https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_beaufort.pdf
- Estado do mar: CHM, "Escala Douglas" (WMO nº 8, vol. III, 2023)
https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/chm_escala_douglas.pdf
- Aspecto do mar, km/h, m/s e altura provável das ondas (e altura máxima provável): tabela de especificação da escala
Beaufort da OMM (WMO nº 8). A própria OMM avisa: é só um guia para mar aberto, longe da terra; perto da costa e em
águas abrigadas as ondas são menores e mais íngremes.
- Formato "VENTO NE/NW 5/7" do boletim Meteoromarinha (CHM), conferido no boletim publicado em 2026-10-08.

opts de mount (todos opcionais):
forca:    4            força inicial (0 a 12)
modo:     'explorar' | 'quiz'     padrão 'explorar'
quiz:     true         mostra o botão do quiz (false = só explorar)
barco:    true         desenha o veleiro de cruzeiro (exemplo de ~32 pés) na cena
orientacao: true       mostra a orientação geral de vela
questoes: 8            número de perguntas por rodada do quiz
titulo:   texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'beaufort', opts:{forca:5}}
{t:'widget', w:'beaufort', opts:{modo:'quiz', questoes:10}}
{t:'widget', w:'beaufort', opts:{forca:7, quiz:false}}
```

## boias-iala

`app/widgets/boias-iala.js` — 100 KB

```
Widget "boias-iala": Sistema de Balizamento Marítimo da IALA (AISM), Região B — o adotado no Brasil.
Galeria com cada marca em 3D (Three.js, formas procedurais) e em SVG leve, ficha de cada marca com a luz animada,
modo "entrando no porto" (decidir o lado de cada boia ou conduzir o barco pelo canal, de dia ou de noite)
e desafio (identificar a marca pelo desenho, pela luz à noite ou dizer por onde passar).

Fontes (citadas na interface):
- Lista de Faróis (DHN), 40ª ed. (2026–2027, a vigente), Introdução, item 4: item 4.1 (o Brasil assinou o acordo de
1980 e optou pela Região "B"; research/sources.md, tecnico-94) e quadros dos sinais (águas seguras, novos perigos,
Região B de dia: tecnico-118, -125, -128). Página oficial: https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois
- Os "exemplos reais" de luz (nº do sinal, característica e fase detalhada) foram conferidos um a um no PDF da 40ª ed.
(LF-40ED-2026-2027-FOL-17-26, baixado de assets.marinha.mil.br em 2026-10-09; páginas do PDF entre parênteses):
2616 Boia nº 2, Porto do Rio de Janeiro (p. 165); 2016 Boia nº 3, Vitória (p. 124); 90 Cação Grande (p. 38);
355 Banco Ilha Nova (p. 51); 2049 Aribiri Cardinal Norte (p. 126); 214 Ilha das Onças (p. 44);
351 Pedras Santo Antônio (p. 51); 222 Pedras Val-de-Cães Sul (p. 45); 268 Arsenal (p. 46);
2614.2 Laje dos Meros (p. 165); 1746 Especial nº 1 (p. 109). Todos mantêm número, característica e fase.
Os dois exemplos de águas seguras da 34ª ed. (nº 12 e 16, Barra Norte do Rio Amazonas) NÃO existem mais na 40ª ed.
(a seção da Barra Norte começa no nº 28) e foram trocados por 504 São Marcos de Fora (LpL B 10s; p. 66) e
2422 Cotunduba (Iso B 2s; p. 143). O Mo(A) passou a ser só ritmo permitido (a Introdução, quadro "Águas Seguras",
o prevê: tecnico-118), porque não encontrei Mo(A) em nenhum sinal de águas seguras dos quadros da 40ª ed.
Características mudam: a interface manda conferir os Avisos aos Navegantes.
- IALA, Sistema de Balizamento Marítimo (MBS), Região B; IALA, Recomendação O-133 (boia de naufrágio de
emergência: listras azuis e amarelas, cruz amarela, luz Al Bu Y — Bu 1 s, 0,5 s, Y 1 s, 0,5 s).
- RIPEAM-72, Regra 9 (canais estreitos), citada na ficha de águas seguras.
Reaproveita VL.luz (analisador, fases, lâmpada e linha do tempo) de widgets/ritmos-luz.js.

opts de mount (todas opcionais):
modo: 'galeria' | 'porto' | 'desafio'           aba inicial (padrão 'galeria')
modos: ['galeria', 'porto', 'desafio']           abas exibidas (padrão: as três)
marca: 'bombordo'                                marca inicial da galeria (ids abaixo)
categorias: ['lateral', 'preferencial', 'cardinal', 'perigo', 'seguras', 'especial', 'novo']
filtra a galeria e o desafio (padrão: todas)
tresD: true                                      false = só desenhos SVG (mais leve, sem Three.js)
noite: false                                     começa a cena 3D e o porto à noite
aviso: true                                      false esconde o quadro "Região B" do topo da galeria
porto: 'decidir' | 'conduzir'                    submodo inicial do porto (padrão 'decidir')
desafio: { n: 10, tipos: ['nome', 'luz', 'passar'] }   tamanho da rodada e tipos de pergunta
ids das marcas: bombordo, boreste, pref-boreste, pref-bombordo, cardinal-n, cardinal-l, cardinal-s,
cardinal-o, perigo-isolado, aguas-seguras, especial, naufragio

Exemplos de bloco de lição:
{ t: 'widget', w: 'boias-iala', opts: { modo: 'galeria', marca: 'cardinal-s', categorias: ['cardinal'] } }
{ t: 'widget', w: 'boias-iala', opts: { modo: 'porto', modos: ['porto'], porto: 'conduzir' } }
{ t: 'widget', w: 'boias-iala', opts: { modo: 'desafio', modos: ['desafio'], desafio: { n: 8, tipos: ['luz'] } } }
```

## carta-nautica

`app/widgets/carta-nautica.js` — 125 KB

```
Carta náutica de treinamento — costa FICTÍCIA no estilo das cartas da DHN.
SVG com pan/zoom (mouse, toque e pinça), escalas de latitude/longitude nas bordas (minutos e décimos),
rosa dos rumos verdadeiros e magnéticos com a declinação e a variação anual, isóbatas de 2/5/10/20/50 m,
sondagens em itálico, faróis com característica, boias IALA B e perigos (rocha, casco soçobrado).
Ferramentas: régua paralela (rumo verdadeiro), compasso de pontas secas (distância na escala de latitudes),
plotar/ler coordenadas, marcações (LDP, posição por 2 ou 3 marcações, triângulo de incerteza, transporte de
LDP), navegação estimada (com corrente opcional) e triângulo de corrente (rumo a governar, abatimento).
Modo exercício: problemas gerados (tolerância ±2° e ±0,2 M) com correção passo a passo e solução na carta;
marcações sucessivas com ângulo dobrado na proa (22,5°/45°, 30°/60°, 45°/90° = través, Manual 6.3.4); as derrotas
sorteadas ficam em água de 3 m ou mais e longe de pedras e cascos.

Referências: Manual de Navegação da Marinha do Brasil, Vol. I — Navegação costeira, estimada e em águas
restritas (DHN, 2ª revisão 2023), caps. 2 a 6; Carta 12000 (INT 1), DHN, 5ª ed. 2022.

opts (todas opcionais):
modo:       'explorar' (padrão) | 'exercicio'
ferramenta: 'mover' (padrão) | 'regua' | 'compasso' | 'posicao' | 'marcacao' | 'estima' | 'corrente'
exercicio:  tipo inicial no modo exercício: 'rumo-dist' (padrão) | 'ler' | 'plotar' | 'marcacoes' |
'estima' | 'corrente' | 'sucessivas'
altura:     altura da carta em px (padrão: automática, ~62% da tela no celular)

Exemplo de bloco de lição:
{t:'widget', w:'carta-nautica', opts:{modo:'exercicio', exercicio:'marcacoes'}}
{t:'widget', w:'carta-nautica', opts:{ferramenta:'regua'}}
```

## derrota-calc

`app/widgets/derrota-calc.js` — 93 KB

```
Widget "derrota-calc": calculadora passo a passo de derrotas (ortodrômica, loxodrômica,
navegação estimada pela latitude média, conversões) com exercícios corrigidos.

Este arquivo também publica VL.derrota — a matemática de derrotas e as travessias prontas —
reutilizada pelo widget "globo-rotas" (que o carrega via scripts: ['widgets/derrota-calc.js']).

opts (todas opcionais):
aba:       'derrotas'   aba inicial: 'derrotas' | 'estima' | 'conversoes' | 'exercicios'
abas:      null         lista das abas visíveis, ex.: ['derrotas', 'exercicios'] (padrão: todas)
preset:    'rio-cabo'   travessia de VL.derrota.presets usada na aba Derrotas (a maior perna dela):
salvador-mindelo, recife-noronha, natal-mindelo, arc, mindelo-granada, rio-cabo,
cabo-rio, retorno, salvador-caribe, didatico-tasmania
modelo:    'esfera'     latitudes crescidas: 'esfera' | 'elipsoide' (WGS-84, como nas tábuas)
vel:       6            velocidade média em nós para os tempos de viagem
passo:     10           intervalo dos pontos intermediários da ortodrômica: 5 | 10 (graus de longitude)
exercicio: 'mix'        tipo inicial na aba Exercícios: 'orto' | 'lox' | 'estima' | 'conv' | 'tempo' | 'mix'
titulo:    'Calculadora de derrotas'

Exemplos de bloco de lição:
{ t: 'widget', w: 'derrota-calc', opts: { preset: 'arc' } }
{ t: 'widget', w: 'derrota-calc', opts: { aba: 'estima', abas: ['estima', 'exercicios'], exercicio: 'estima' } }

Modelo: Terra esférica, 1 minuto de arco de círculo máximo = 1 milha náutica (1.852 m), como nas
tábuas e nas provas. Latitudes crescidas: esfera (padrão) ou elipsoide WGS-84 (como nas tábuas).
Referências: Bowditch, The American Practical Navigator (NGA Pub. 9), capítulo "The Sailings";
Miguens, Navegação: a Ciência e a Arte, vol. II (DHN).
```

## esfera-celeste

`app/widgets/esfera-celeste.js` — 80 KB

```
Widget "esfera-celeste" — esfera celeste em 3D (Three.js), vista de fora ou do observador.
Mostra horizonte, zênite/nadir, polos, equador celeste, meridiano, eclíptica, o Sol na data
escolhida com seu arco diurno, estrelas de navegação (J2000 precessadas para a data) e o
triângulo de posição Polo-Zênite-Astro com altura e azimute calculados.

opts (todas opcionais; padrões entre parênteses):
{ lat: -22.9        (latitude do observador, −60…+60; padrão: a da base do usuário ou Rio de Janeiro),
lon: -43.17       (longitude, E positiva),
data: 'AAAA-MM-DD' (hoje),
hora: 20          (hora média local, 0–24),
vista: 'fora' | 'observador'  ('fora'),
modo: 'explorar' | 'desafio'  ('explorar'),
astro: 'sirius' | 'sol' | 'canopus' | …  (astro selecionado ao abrir; ids na lista ESTRELAS),
titulo: 'texto da legenda' }

Exemplo de bloco de lição:
{ t: 'widget', w: 'esfera-celeste', opts: { lat: -23, vista: 'observador', astro: 'acrux' } }

Fórmulas: Sol pelas "low precision formulas" do Astronomical Almanac (precisão ~0,01° em
declinação); tempo sideral médio de Greenwich (USNO); precessão IAU 1976 (Meeus, cap. 21);
altura e azimute pelo triângulo de posição (Miguens, Navegação: a Ciência e a Arte, vol. II).
```

## globo-rotas

`app/widgets/globo-rotas.js` — 82 KB

```
Widget "globo-rotas" — globo da Terra em 3D (Three.js) para comparar a ortodrômica (arco de
círculo máximo, o caminho mais curto) com a loxodrômica (rumo constante) em travessias reais.
Continentes desenhados a partir do Natural Earth 1:110m, graticulado de 10° e 30°, Equador e
trópicos, nomes de águas em itálico, barquinhos que navegam as duas derrotas na mesma
velocidade, camada esquemática de ventos (alísios, ventos de oeste, ZCIT) e modo desafio.

opts (todas opcionais):
preset:   'rio-cabo'   travessia pronta (ids de VL.derrota.presets): salvador-mindelo, recife-noronha,
natal-mindelo, arc, mindelo-granada, rio-cabo, cabo-rio, retorno,
salvador-caribe, didatico-tasmania
presets:  null         lista de ids que aparecem no seletor (padrão: todas)
pontos:   null         derrota livre, substitui o preset: [{lat:-22.95, lon:-43.15, nome:'Rio'}, {lat, lon}, ...]
(graus decimais; S e W negativos)
modo:     'explorar'   'explorar' | 'desafio'
desafios: ['lado', 'vertice', 'rumo', 'economia']   tipos de pergunta do modo desafio
ventos:   false        começa com a camada esquemática de ventos e ZCIT ligada
vel:      6            velocidade média em nós (tempos e barquinhos), de 2 a 20
animar:   false        começa a animação sozinho (nunca com prefers-reduced-motion)
detalhe:  true         false = fica só na costa 1:110m (não carrega a 1:50m, com ilhas pequenas como Cabo Verde)
titulo:   'Globo: ortodrômica e loxodrômica'

Exemplos de bloco de lição:
{ t: 'widget', w: 'globo-rotas', opts: { preset: 'arc', ventos: true } }
{ t: 'widget', w: 'globo-rotas', opts: { modo: 'desafio', desafios: ['lado', 'vertice'] } }
{ t: 'widget', w: 'globo-rotas', opts: { pontos: [{ lat: -3.8, lon: -32.4, nome: 'Noronha' }, { lat: 14.1, lon: -61, nome: 'Santa Lúcia' }] } }

Matemática: VL.derrota (widgets/derrota-calc.js): Terra esférica, 1′ de arco de círculo máximo =
1 milha náutica; rumos verdadeiros. Bowditch, The American Practical Navigator (NGA Pub. 9),
"The Sailings"; Miguens, Navegação: a Ciência e a Arte (DHN).
Ventos: esquema da circulação geral média da atmosfera — NÃO serve para planejar.
Movimento reduzido (prefers-reduced-motion): sem animação contínua nem voo de câmera; avanço manual por dia.
```

## manobras

`app/widgets/manobras.js` — 135 KB

```
manobras — animações passo a passo, vistas de cima (ou de perfil, no rizo), das manobras básicas de um veleiro de cruzeiro
(o desenho usa um barco de ~32 pés como exemplo; vale para qualquer tamanho): cambar por davante, jaibe (controlado e acidental), capear, rizar a grande (1º e 2º rizos),
homem ao mar (parada rápida e manobra do oito) e fundear (com calculadora de filame).
Convenção do desenho: o vento VERDADEIRO sopra sempre do alto da figura para baixo; rumo 0° = proa ao vento,
rumo positivo = proa virada para a direita da tela (vento entrando por bombordo, "amura de bombordo"),
rumo negativo = vento entrando por boreste. Cada etapa tem: comando de voz, tarefa de cada tripulante e explicação.
Reduced-motion: sem animação contínua; os botões "Anterior"/"Próxima" pulam direto de etapa em etapa.
Orientação de seamanship fundamentada nas fontes de research/mob.md. O quadro `recomenda` ("O que este curso recomenda") diz qual método e qual lado usar num veleiro de cruzeiro e por quê, sem esconder as variantes; treine a manobra com seu instrutor e sua tripulação.
Homem ao mar: cada variante tem um `trajeto` integrado por trechos (rumo final, distância, velocidade final, deriva), de onde saem a posição,
a proa (sempre tangente ao caminho), o tempo e a deriva da pessoa; `vb` e `s` podem ser da variante; `lifesling`, `regua`, `escala` e
`diagLados` ligam o cabo do Lifesling, a régua de comprimentos, a barra de escala e o esquema dos dois lados de recolhimento.

opts de mount (todos opcionais):
manobra:   'cambar' | 'jaibe' | 'capear' | 'rizar' | 'mob' | 'fundear'               padrão 'cambar'
variante:  jaibe: 'controlado' | 'acidental';  rizar: '1' | '2';  mob: 'parada-rapida' | 'oito'
(as demais manobras só têm uma)                                             padrão a primeira
etapa:     etapa inicial, 0 (ponto de partida) até o número de etapas                  padrão 0
modo:      'explorar' | 'desafio'  (desafio = ordenar as etapas + perguntas explicadas) padrão 'explorar'
seletor:   true | false  (mostra os botões para trocar de manobra e de variante)       padrão true
tocar:     true para começar tocando (ignorado com prefers-reduced-motion)             padrão false
titulo:    legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'manobras', opts:{manobra:'cambar'}}
{t:'widget', w:'manobras', opts:{manobra:'jaibe', variante:'acidental', seletor:false}}
{t:'widget', w:'manobras', opts:{manobra:'mob', variante:'oito', modo:'desafio'}}
```

## mareacao

`app/widgets/mareacao.js` — 46 KB

```
mareacao — mareação de um veleiro de cruzeiro (exemplo de ~32 pés), vista de cima.
O aluno gira o barco (arrastando, teclado ou botões orçar/arribar) e caça/folga a escota.
A rosa dos pontos de vela é relativa ao vento VERDADEIRO (que sopra do topo da cena).
As birutas (tell-tales) reagem ao ângulo de ataque ao vento APARENTE:
ângulo de ataque = ângulo do vento aparente (a partir da proa) − ângulo da vela (a partir da linha de centro).
< 0°  → vela panejando (folgada demais);  0–10° → biruta de barlavento levanta (cace ou arribe);
10–25° → birutas paralelas (fluxo certo); > 25° → biruta de sotavento cai/gira (estol: folgue ou orce).
Com o vento aparente a mais de ~105° da proa não há fluxo colado possível: a vela trabalha por arrasto
e o certo é folgar até perto do brandal.
Triângulo de velocidades: vento verdadeiro + vento do deslocamento (igual e oposto à velocidade do barco)
= vento aparente.  AWS = √(VV² + VB² + 2·VV·VB·cos TWA);  AWA = atan2(VV·sen TWA, VV·cos TWA + VB).
Velocidade do barco: polar APROXIMADA de um cruzeiro de exemplo, de 32 pés (≈ 9,75 m; velocidade de casco ≈ 7 nós; no seu barco, ≈ 2,43 × √LWL),
com mar calmo e velas bem reguladas, multiplicada por uma eficiência de regulagem. Didático, não é a
polar de um barco específico. Zona morta do modelo: 35° de cada lado do vento verdadeiro.
Simplificação: a escota controla as duas velas (grande e genoa) ao mesmo tempo.

opts de mount (todos opcionais):
modo:     'explorar' | 'desafio'                                   padrão 'explorar'
vento:    velocidade do vento verdadeiro em nós (4 a 25)            padrão 12
proa:     ângulo do vento verdadeiro em relação à proa, em graus;
positivo = vento entrando por boreste, negativo = por bombordo   padrão 60
escota:   0 (toda caçada) a 100 (toda folgada)                      padrão 50
desafios: lista de ids, na ordem: 'traves','birutas','cerrada','largo','popa','aparente'
padrão: todos
titulo:   legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'mareacao', opts:{proa:90, escota:10}}
{t:'widget', w:'mareacao', opts:{modo:'desafio', desafios:['traves','birutas','aparente']}}
```

## mares

`app/widgets/mares.js` — 64 KB

```
Marés: tábua de EXEMPLO no formato da Tábua das Marés da DHN (horas e alturas de preamar e baixa-mar, acima
do Nível de Redução), curva da maré, altura num horário pelo método do cosseno (o mesmo das Tabelas I e II da
DHN) e pela regra dos doze avos, comparação dos dois, folga abaixo da quilha, altura de maré necessária,
janela de horário para passar num baixio e sizígia x quadratura num mini-diagrama Sol–Terra–Lua.
Modo exercício com problemas gerados e correção passo a passo.

As marés são FICTÍCIAS (modelo simples M2 + S2 + K1 de um porto semidiurno); as fases da Lua são reais,
calculadas pelo algoritmo de Meeus (Astronomical Algorithms, 2ª ed., cap. 49). Nunca use para navegar:
a tábua oficial é a da DHN/CHM (https://www.marinha.mil.br/chm/tabuas-de-mare).

Referências: Manual de Navegação da Marinha do Brasil, Vol. I (DHN, 2ª rev. 2023), cap. 10 (itens 10.1.3 a
10.1.10); Carta 12000 (INT 1), DHN — alturas de secagem sublinhadas, acima do NR.

opts (todas opcionais):
modo:      'explorar' (padrão) | 'exercicio'
vista:     'altura' (padrão) | 'baixio' | 'lua'
inicio:    primeiro dia da tábua, 'AAAA-MM-DD' (padrão: hoje)
dia:       índice do dia selecionado, 0 a 6 (padrão 0)
sondagem:  profundidade da carta em m (padrão 1,2; negativa = altura de secagem)
calado:    calado do barco em m (padrão 1,8)
folga:     folga desejada abaixo da quilha em m (padrão 0,5)
exercicio: tipo inicial: 'altura-cos' (padrão) | 'altura-12' | 'folga' | 'necessaria' | 'janela' | 'conceitos'

Exemplo de bloco de lição:
{t:'widget', w:'mares', opts:{vista:'baixio', sondagem:-0.4, calado:1.6}}
{t:'widget', w:'mares', opts:{modo:'exercicio', exercicio:'janela'}}
```

## meteo-sinotica

`app/widgets/meteo-sinotica.js` — 72 KB

```
meteo-sinotica — carta sinótica de superfície ESQUEMÁTICA e interativa (SVG + D3).

O campo de pressão é um modelo simples (centros de alta e baixa somados, com cavados em V ao longo das frentes),
desenhado com isóbaras a cada 4 hPa. Não é previsão: serve para aprender a LER uma carta. Ao tocar num ponto, o
widget mostra a direção do vento à superfície, a força relativa (espaçamento das isóbaras), uma estimativa pelo
vento geostrófico e, nos cenários com tempo, a tendência (pressão e rondada do vento nas próximas horas).

Física usada (e mostrada na interface):
- Vento geostrófico: paralelo às isóbaras, com Vg = Δp / (ρ · f · Δn), ρ ≈ 1,2 kg/m³, f = 2Ω sen(latitude).
No Hemisfério Sul a força de Coriolis desvia o ar para a ESQUERDA: o vento gira no sentido HORÁRIO em volta da
baixa e ANTI-HORÁRIO em volta da alta (o contrário do Hemisfério Norte).
- Atrito à superfície: o vento cruza as isóbaras em direção à baixa, cerca de 15° sobre o mar e 30° ou mais sobre a
terra, e fica mais fraco (regra prática: cerca de 70% do geostrófico sobre o mar).
- Lei de Buys-Ballot adaptada ao Hemisfério Sul: de costas para o vento, a baixa fica à DIREITA (no Norte, à esquerda).
- Perto do equador f → 0: a fórmula não vale e o ângulo com as isóbaras aumenta (aqui, de forma esquemática).
- Ciclogênese explosiva ("ciclone bomba"): queda de 24 hPa em 24 h × sen(lat)/sen(60°) (Sanders e Gyakum, 1980).
Simbologia: CHM, "Simbologia" (Manual de Códigos, OMM nº 306): A azul, B vermelho, frente fria (triângulos azuis),
quente (semicírculos vermelhos), oclusa (roxa, alternados do mesmo lado), quase-estacionária (alternados em lados
opostos), cavado (tracejado), crista (zigue-zague), ZCIT (faixa hachurada).
Fontes oficiais (links): CHM/Marinha — Cartas Sinóticas, Simbologia, Meteoromarinha, Avisos de Mau Tempo.

opts de mount (todos opcionais):
cenario:   'esquematico' | 'frente' | 'asas' | 'alisios' | 'ciclone'    padrão 'frente'
cenarios:  ['frente', 'asas']   restringe os cenários oferecidos
hemisferio:'S' | 'N'            só no cenário esquemático (padrão 'S')
hora:      0                    hora inicial nos cenários com tempo (0 a 48, de 3 em 3)
ponto:     [-48.55, -27.6]      [lon, lat] do ponto inicial (padrão: depende do cenário)
ventos:    true                 mostra o campo de setas de vento sobre o mar
modo:      'explorar' | 'desafio'
questoes:  6                    perguntas por rodada no desafio
titulo:    texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'meteo-sinotica', opts:{cenario:'frente'}}
{t:'widget', w:'meteo-sinotica', opts:{cenario:'esquematico', hemisferio:'N'}}
{t:'widget', w:'meteo-sinotica', opts:{modo:'desafio', cenarios:['frente','ciclone']}}
```

## nos

`app/widgets/nos.js` — 87 KB

```
Widget "nos": nós e voltas de marinheiro animados passo a passo (SVG).

Como funciona o desenho: cada cabo é uma linha central (curva Catmull-Rom) com um "z" (altura) em cada ponto
de controle. Nos cruzamentos, o trecho que passa POR CIMA é redesenhado sobre o de baixo, com contorno e
sombra; assim o aluno vê exatamente por onde o chicote passa e consegue repetir com um cabo de verdade.
A animação "estende" o cabo ao longo do caminho final: a ponta (chicote, com falcaça) anda pela rota
tracejada em magenta, e cada cruzamento por cima/por baixo da etapa é numerado e listado no painel.
Voltas em objetos (poste, barra, cunho) são modeladas em 3D (ângulo em volta do eixo) e projetadas com uma
leve inclinação, de modo que a parte de trás da volta fica realmente atrás do objeto.

opts de mount (todas opcionais):
no:        'lais-de-guia'          nó aberto ao montar. Ids: lais-de-guia, oito, direito, torto (o nó errado,
para comparar), fiel, volta-redonda, escota, escota-dobrado, cunho
nos:       ['lais-de-guia','oito'] restringe a galeria e o desafio a estes nós (padrão: todos)
modo:      'aprender' | 'desafio'  aba inicial (padrão 'aprender')
galeria:   true                    false esconde a galeria (fica só o nó de opts.no)
desafio:   true                    false esconde a aba "Desafio: qual nó usar?"
etapa:     0                       etapa inicial (0 = primeira)
autoplay:  false                   começa tocando a animação (ignorado com prefers-reduced-motion)
info:      true                    false esconde "Para que serve", vantagens e cuidados
titulo:    'Nós e voltas, passo a passo'   título da moldura
debug:     false                   (desenvolvimento) pontos de controle, cruzamentos e verificação no console

Exemplos de bloco de lição:
{t:'widget', w:'nos', opts:{no:'lais-de-guia'}}
{t:'widget', w:'nos', opts:{no:'direito', galeria:false, desafio:false}}
{t:'widget', w:'nos', opts:{modo:'desafio', nos:['lais-de-guia','oito','fiel','cunho','volta-redonda']}}

Referência dos nós: Clifford W. Ashley, The Ashley Book of Knots (ABoK), 1944 — o número ABoK de cada nó
aparece na interface. Desenhos esquemáticos, com o nó frouxo para mostrar cada cruzamento.
Números ABoK conferidos em 2026-10-08 (nenhum foi inventado):
lais de guia 1010 (animatedknots.com/bowline-knot: "# 1010, p 186"; Wikipédia, Bowline, caixa ABoK #1010);
oito 520 (Wikipédia, Figure-eight knot, caixa ABoK #420, #520, #570; citação do nó de batente na p. 85 do ABoK);
direito 1204 (Wikipédia, Reef knot, caixa ABoK, entre outros #1204 e #1402; animatedknots.com/reef-knot dá #1402, p 258, para o mesmo nó);
torto 1206 (Wikipédia, Granny knot, caixa ABoK #1206);
fiel 1177 e 1178 (Wikipédia, Clove hitch, caixa ABoK #1176 a #1180 e #1245; animatedknots.com/clove-hitch-knot dá #1245, p 224);
volta redonda 1720 (animatedknots.com/round-turn-two-half-hitches-knot: "# 1720, p 296"; Wikipédia, caixa ABoK #1720);
escota 1431 (animatedknots.com/sheet-bend-knot: "# 1431, p 262"; Wikipédia, Sheet bend);
escota dobrado 1434 (Wikipédia, Sheet bend, caixa do double sheet bend: #488, #1434);
cunho 1615 (Wikipédia, Cleat hitch, caixa ABoK #1615).
URLs: https://www.animatedknots.com/<nó> e https://en.wikipedia.org/wiki/<Bowline|Figure-eight_knot|Reef_knot|Granny_knot|Clove_hitch|Round_turn_and_two_half-hitches|Sheet_bend|Cleat_hitch>.
Um mesmo nó pode ter vários números no ABoK (um por capítulo/uso); aqui aparece o do capítulo do uso a bordo.
API exposta para outros autores/testes: VL.nos = {NOS, prepararForma, sequencia}.
```

## provisoes

`app/widgets/provisoes.js` — 35 KB

```
provisoes — calculadora de provisões e autonomia para uma travessia (tudo é ESTIMATIVA de planejamento).

Entradas: distância (mn), velocidade média estimada (nós), margem de segurança (%), tripulação, água por pessoa/dia,
refeições e lanches por dia, motor (consumo em L/h, parte da distância a motor, velocidade a motor, horas por dia
para carregar baterias, reserva %), gás de cozinha (horas de fogo por dia, consumo por boca, tamanho do botijão),
capacidades dos tanques do barco. Saída: dias de viagem, tabela por dia / viagem / com margem, comparação com os
tanques e uma lista de verificação (kit médico, pirotécnicos, sobressalentes etc.).

Fórmulas mostradas na interface:
dias = distância ÷ (velocidade × 24);  dias com margem = dias × (1 + margem)
horas de motor = (distância × parte a motor ÷ velocidade a motor) + horas de bateria por dia × dias com margem
gás (kg) = horas de fogo por dia × consumo por boca (kg/h) × dias com margem
(consumo padrão de 0,12 kg/h ≈ boca de 1,5 kW, com GLP de cerca de 46 MJ/kg = 12,8 kWh/kg)

Itens obrigatórios citados (com selo "a confirmar" — confira a versão vigente e a classificação do seu TIE):
NORMAM-211/DPC (2026), 4.13 balsa salva-vidas; 4.14 coletes; 4.17 pirotécnicos; 4.18.3 refletor radar;
4.22 medicamentos (recomendação); 4.24.2 radiocomunicações; 4.35 tabela da navegação oceânica (GPS 02 unidades).

opts de mount (todos opcionais):
distancia: 1200     milhas náuticas
velocidade: 5       nós (média estimada da travessia)
margem: 25          % sobre o tempo de viagem
tripulacao: 4
agua: 4             litros por pessoa por dia
navegacao: 'oceanica' | 'costeira'   lista de itens obrigatórios exibida
modo: 'calcular' | 'exercicio'       padrão 'calcular'
lembrar: true       guarda os valores digitados neste navegador
titulo: texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'provisoes', opts:{distancia:1650, velocidade:5, tripulacao:4}}
{t:'widget', w:'provisoes', opts:{modo:'exercicio'}}
{t:'widget', w:'provisoes', opts:{distancia:180, navegacao:'costeira', lembrar:false}}
```

## quartos

`app/widgets/quartos.js` — 39 KB

```
quartos — planejador de quartos de serviço (escala de vigia) para travessia.

Tripulação de 2 a 6 pessoas (nomes editáveis), comandante dentro ou fora da escala (de sobreaviso), quartos
individuais ou em dupla, e sistemas: 3 em 6 fora, 4 em 8 fora, 4 em 8 com quartos de cão (16–18 e 18–20),
2 em 4 fora em dupla, sistema sueco (6 h de dia e 4 h à noite: 5 quartos por dia) e escalonado (cada pessoa fica
4 h e uma pessoa troca a cada 2 h). Gera a grade de 24 h por vários dias (mostra se a escala gira), as horas de
descanso por pessoa, quem está de quarto em cada hora, dicas de segurança e exporta (imprimir, CSV, copiar texto).

Os nomes "3 em 6 fora" etc. descrevem o resultado com 3 equipes; com outro número de equipes o widget mostra
as horas reais de quarto e de folga. O sistema sueco tem variações de horário; aqui: 08–14, 14–20, 20–24, 00–04
e 04–08 (ajustável em "Horários começam às").

Referências citadas: RIPEAM-72, Regra 5 (vigilância) e Regra 7 (risco de abalroamento: marcação constante).
As "ordens do comandante" são exemplos comuns de boa marinharia, para combinar a bordo, não norma.

opts de mount (todos opcionais):
pessoas:  4                       2 a 6
nomes:    ['Ana','Bruno', ...]   nomes iniciais
sistema:  '3em6' | '4em8' | 'cao' | '2em4' | 'sueco' | 'escalonado'   padrão '4em8'
dupla:    false                   quartos em dupla (o padrão do sistema '2em4' é true)
comandanteFora: false             comandante de sobreaviso, fora da escala
dias:     3                       1 a 7
inicio:   0                       hora (0–23) em que começa o primeiro quarto do ciclo
modo:     'planejar' | 'desafio'
titulo:   texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'quartos', opts:{pessoas:3, sistema:'cao'}}
{t:'widget', w:'quartos', opts:{pessoas:4, sistema:'sueco', dupla:true}}
{t:'widget', w:'quartos', opts:{modo:'desafio', pessoas:3, sistema:'4em8'}}
```

## regras-governo

`app/widgets/regras-governo.js` — 65 KB

```
regras-governo — encontros entre duas embarcações vistas de cima (RIPEAM-72, Regras 7, 8 e 12 a 18).
Nós (magenta) e a outra (tinta), com vetores de 6 minutos. O veredito é calculado ao vivo:
1) há risco de abalroamento? (critério didático: maior aproximação prevista < 0,5 milha nos próximos 40 min;
o RIPEAM não fixa número — Regra 7(a) e (d));
2) ultrapassagem primeiro (Regra 13: vem de mais de 22,5° por ante a ré do través; prevalece sobre a 18);
3) categorias diferentes: hierarquia da Regra 18 (sem governo / manobra restrita > restrita pelo calado
("não impedir", 18(d)) > pesca > vela > propulsão mecânica);
4) dois veleiros: Regra 12 (bordos diferentes: quem recebe o vento por bombordo manobra; mesmo bordo:
quem está a barlavento manobra; barlavento = lado oposto ao da retranca, 12(b));
5) duas de propulsão mecânica: roda a roda (Regra 14; aqui, cada uma vê a outra até 6° da proa; até 11,25°
é "dúvida", e na dúvida é roda a roda, 14(c)) ou rumos cruzados (Regra 15).
Ações: Regra 16 (quem manobra: cedo e de forma franca), 17 (quem mantém rumo e velocidade) e 8.

opts de mount (todos opcionais):
modo:     'explorar' | 'desafio'                                         padrão 'explorar'
cenario:  'cruzados' | 'rodaaroda' | 'ultrapassagem' | 'vela-bordos' | 'vela-mesmo' | 'hierarquia'
(situação inicial do modo explorar, padrão 'cruzados')
a:        {tipo, rumo, vel}   nós    — tipo: 'pm' | 'vela' | 'pesca' | 'cal' | 'mr' | 'sg'
b:        {tipo, rumo, vel, marcacao, distancia}   a outra (marcação relativa a partir da nossa proa, em graus;
distância em milhas). Se 'a' ou 'b' vier, substitui o cenário.
vento:    direção DE ONDE sopra, em graus verdadeiros (padrão 045)
proaCima: false   (true: nossa proa para cima, como radar em "head-up"; no desafio o padrão é true)
setores:  true    (mostra os setores das luzes de bordos e de alcançado)
desafios: ['rodaaroda','cruzados','ultrapassagem','vela-bordos','vela-mesmo','hierarquia']  sorteados no desafio
titulo:   texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'regras-governo', opts:{cenario:'vela-bordos'}}
{t:'widget', w:'regras-governo', opts:{modo:'desafio', desafios:['cruzados','rodaaroda','ultrapassagem']}}
```

## reta-altura

`app/widgets/reta-altura.js` — 88 KB

```
Widget "reta-altura" — navegação astronômica de cálculo, passo a passo, com exercícios corrigidos.
Três abas:
reta      → reta de altura pelo método de Marcq Saint-Hilaire (AHL, Hc, azimute, Δa = Ho − Hc) e
plotagem numa folha de plotagem SVG; duas ou três retas dão a posição observada.
latitude  → latitude meridiana (e longitude) pela passagem meridiana do Sol, com a correção da
altura instrumental (ei, depressão, refração, semidiâmetro, paralaxe). É o recorte do
programa do Capitão-Amador (NORMAM-211, Anexo 5-A, item 1.2).
hora      → hora legal (HLeg) aproximada da passagem meridiana superior do Sol (PMS).

opts (todas opcionais):
{ aba: 'reta' | 'latitude' | 'hora'   (padrão 'reta'),
modo: 'explorar' | 'exercicio'      (padrão 'explorar'),
abas: ['reta','latitude','hora']    (quais abas mostrar; padrão todas),
titulo: 'texto da legenda' }

Exemplo de bloco de lição:
{ t: 'widget', w: 'reta-altura', opts: { aba: 'latitude', modo: 'exercicio' } }

Dados de almanaque: SIMULADOS (calculados aqui por fórmulas aproximadas: Sol pelas "low precision
formulas" do Astronomical Almanac, ~0,01°; estrelas J2000 do catálogo Hipparcos precessadas; tempo
sideral do USNO). Servem para treinar. A fonte oficial é o Almanaque Náutico da DHN.
Fórmulas: Miguens, Navegação: a Ciência e a Arte, vol. II (DHN); Bowditch, The American Practical
Navigator (NGA Pub. 9), caps. "Navigational Astronomy" e "Sight Reduction". Depressão 1,76′√h e
refração de Bennett (1982), como no Nautical Almanac.

Também publica VL.navAstro (matemática pura, sem DOM), útil para outros widgets e para testes.
```

## ripeam-luzes

`app/widgets/ripeam-luzes.js` — 75 KB

```
ripeam-luzes — simulador de luzes e marcas de navegação (RIPEAM-72, Regras 20 a 31 e Anexo I).
A cena é vista do nosso barco: a outra embarcação aparece pelas luzes. O aspecto (a marcação
relativa, medida a partir da proa DELA, de onde nós estamos) decide quais luzes ficam visíveis,
pelos setores da Regra 21 (mastro 225°, bordos 112,5° cada, alcançado 135°, circulares 360°), com o corte
prático de 1 a 5° do Anexo I, Seção 9; as posições seguem o Anexo I (alturas exageradas para leitura).
Alcances mínimos: Regra 22. Marcas diurnas: Anexo I, Seção 6.

opts de mount (todos opcionais):
modo:     'explorar' | 'desafio'                      padrão 'explorar'
tipo:     situação inicial, padrão 'pm50'. Valores:
'pm50' (propulsão mecânica, 50 m ou mais), 'pm' (menos de 50 m), 'pm12' (menos de 12 m),
'pm7' (menos de 7 m e até 7 nós), 'hover' (colchão de ar), 'vela', 'velamotor' (vela e motor),
'remo' (a remo ou veleiro com menos de 7 m), 'arrasto', 'pesca' (exceto arrasto),
'reboque', 'pratico', 'sg' (sem governo), 'mr' (manobra restrita), 'cal' (restrita pelo calado),
'fundeada', 'encalhada'
opcoes:   variações do tipo (ver TIPOS[...].opcoes), ex.: {tricolor:true} para 'vela', {longo:true} para
'reboque', {sit:'fundeada'} para 'mr', {grande:true} para 'fundeada', {circ12:true} para 'pm12'
aspecto:  graus, de onde vemos a outra a partir da proa dela (0 = de frente; 90 = pelo través de boreste)
dia:      false   (true mostra as marcas diurnas)
silhueta: true    (silhueta tênue do casco à noite; no desafio começa desligada)
nomes:    true    (rótulos das luzes no modo explorar)
titulo:   texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'ripeam-luzes', opts:{tipo:'arrasto', aspecto:60}}
{t:'widget', w:'ripeam-luzes', opts:{tipo:'vela', opcoes:{tricolor:true}, aspecto:300}}
{t:'widget', w:'ripeam-luzes', opts:{tipo:'mr', dia:true}}
{t:'widget', w:'ripeam-luzes', opts:{modo:'desafio'}}
```

## ritmos-luz

`app/widgets/ritmos-luz.js` — 59 KB

```
Widget "ritmos-luz": decodificador de característica de luz (faróis, faroletes e boias).
Também expõe VL.luz (analisador, gerador de fases, lâmpada e linha do tempo), reutilizado por "boias-iala".

Fontes usadas (citadas na interface):
- Lista de Faróis (DH2), DHN/CHM, 40ª ed. (2026–2027), Introdução, itens 3.1 (termos), 3.3 (características das luzes),
3.5 (alcances; D = 1,927(√H + √h)) e 4.2 (Região "B"). A numeração dos itens foi conferida no PDF da 40ª ed. em
2026-10-09. As durações "típicas" de lampejo e eclipse usadas na animação vêm de fases detalhadas reais publicadas
nessa Lista (ex.: R(3) B 10s = 0,4–0,6 ×2, 0,4–7,6: nº 214, Ilha das Onças, conferido na 40ª ed.).
- IALA, Sistema de Balizamento Marítimo, Região B (a DHN assinou o acordo de 1980 e optou pela Região B:
Lista de Faróis, item 4.1).
- IALA, Recomendação O-133 (boia de naufrágio de emergência: Bu 1 s, 0,5 s, Y 1 s, 0,5 s).

opts de mount (todas opcionais):
caracteristica: 'Fl(3) W 15s 12M'   característica inicial do decodificador (notação da carta ou da Lista de Faróis)
modo: 'decodificar' | 'desafio'     aba inicial (padrão 'decodificar')
exemplos: true                      false esconde os botões de exemplo
Formatos aceitos pelo analisador: Fl, LFl, Oc, Iso, F, Q, VQ, UQ, IQ, IVQ, IUQ, Mo(X), FFl, Al, Dir, grupos (3) e (2+1),
"+LFl", cores W R G Y Bu (ou WRG juntas), período "15s", altitude "21m", alcance "12M"; e a notação da Lista de Faróis
(Lp, LpL, R, MR, UR, B, E, V, A, Az, Alt.). "R" é resolvido pelo contexto (rápida na Lista × vermelha na carta).

Exemplos de bloco de lição:
{ t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Q(6)+LFl W 15s' } }
{ t: 'widget', w: 'ritmos-luz', opts: { modo: 'desafio' } }

API reutilizável (outros widgets): VL.luz.analisar(txt), VL.luz.fases(c), VL.luz.faseEm(fs, t), VL.luz.formatar(c, 'intl'|'pt'),
VL.luz.significado(c), VL.luz.lampada(host, o), VL.luz.linhaTempo(host). Carregue com scripts: ['widgets/ritmos-luz.js']
e css: ['assets/css/widgets/ritmos-luz.css'].
```

## sextante

`app/widgets/sextante.js` — 91 KB

```
Widget "sextante" — o sextante náutico: o instrumento em 3D (Three.js), a observação do Sol pela
luneta (canvas 2D) e as correções da altura, com exercício completo.

Abas:
instrumento → modelo 3D procedural (armação, limbo graduado, alidade, espelho grande e pequeno,
luneta, filtros, tambor micrométrico, alavanca, punho). Gire, toque nas peças e veja
o caminho da luz (princípio da dupla reflexão).
observar    → visão pela luneta: leve o limbo inferior do Sol a tangenciar o horizonte, balance o
sextante e registre a altura instrumental (Hi). Também mede o erro instrumental.
correcoes   → Hi → erro instrumental → depressão do horizonte → refração → semidiâmetro →
paralaxe → altura verdadeira (Ho), com cada correção explicada.
exercicio   → 1) medir o erro instrumental, 2) observar o Sol, 3) corrigir a altura.

opts (todas opcionais):
{ aba: 'instrumento' | 'observar' | 'correcoes' | 'exercicio'   (padrão 'instrumento'),
abas: [...]                (quais abas mostrar; padrão todas),
espelho: 'inteiro' | 'meio' (espelho pequeno de horizonte inteiro ou meio espelhado; padrão 'inteiro'),
titulo: 'texto da legenda' }

Exemplo de bloco de lição:
{ t: 'widget', w: 'sextante', opts: { aba: 'observar', espelho: 'meio' } }

Fórmulas e fontes: depressão do horizonte dp = 1,76′·√h (h em metros) e refração de Bennett
R = cot(aa + 7,31/(aa + 4,4)) em minutos, para 10 °C e 1010 hPa — as mesmas usadas pelo Nautical
Almanac; semidiâmetro e paralaxe horizontal do Sol pela distância Terra–Sol do dia (Astronomical
Almanac, fórmulas de baixa precisão). Nomes das peças e sequência das correções: Miguens, Navegação:
a Ciência e a Arte, vol. II (DHN); Bowditch, The American Practical Navigator (NGA Pub. 9), cap. 16.
```

## sinais-sonoros

`app/widgets/sinais-sonoros.js` — 60 KB

```
sinais-sonoros — sinais sonoros do RIPEAM-72 (Regras 32 a 37 e Anexos III e IV), sintetizados com Web Audio.
Cada sinal aparece numa linha do tempo (duração real dos apitos; o intervalo de até 1 ou 2 minutos entre as
repetições é desenhado comprimido e pode ser "acelerado" 12 vezes). O áudio só começa depois de um clique.

Fontes citadas na interface:
- RIPEAM-72 (COLREG), texto promulgado pelo Decreto 80.068/1977, com as emendas do Decreto 10.901/2021
(Regra 33(a) com o gongo para 100 m ou mais; Regra 35 renumerada com o novo parágrafo (i) para 12 a 20 m;
Anexo III, Seção 1, alcance audível por comprimento).
- Regra 32 (definições: curto ≈ 1 s, longo 4 a 6 s), 33 (equipamento), 34 (manobra e advertência),
35 (visibilidade restrita), 36 (chamar a atenção), 37 e Anexo IV (sinais de perigo).
- Anexo III, Seção 1(b): frequência fundamental do apito por comprimento (70–200 Hz para 200 m ou mais;
130–350 Hz de 75 a 200 m; 250–700 Hz abaixo de 75 m). Os intervalos entre apitos de um mesmo sinal não são
fixados pelo RIPEAM (exceto os ~2 s da Regra 35(b)); aqui usamos 1 s, como nos sinais luminosos da Regra 34(b).

opts de mount (todos opcionais):
modo:     'explorar' | 'desafio'                              padrão 'explorar'
grupo:    'manobra' | 'cerracao' | 'perigo' | 'equipamento'   aba inicial no modo explorar, padrão 'manobra'
sinal:    id do sinal pré-selecionado (m1 m2 m3 m5 u1 u2 u3 c1 · v1 … v10 · p1 p2 p3 · e1 … e4)
desafio:  'ouvir' | 'dar'                                     tipo de desafio inicial, padrão 'ouvir'
grupos:   ['manobra', 'cerracao', 'perigo']                   grupos sorteados no desafio
acelerar: false                                               intervalos passam 12× mais rápido
titulo:   texto da legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'sinais-sonoros', opts:{grupo:'cerracao', sinal:'v3'}}
{t:'widget', w:'sinais-sonoros', opts:{modo:'desafio', desafio:'dar', grupos:['cerracao']}}
```

## veleiro-3d

`app/widgets/veleiro-3d.js` — 105 KB

```
veleiro-3d — anatomia de um cruzeiro de ~32 pés (exemplo; ≈ 9,75 m), sloop de mastro de topo, em 3D.
Tudo procedural (Three.js): casco por loft de seções em V suave com espelho de popa, convés, cabine,
cockpit com roda de leme ou cana, quilha de bolina fixa com bulbo, leme suspenso, mastro passante (enora),
cruzetas, brandais, estais de proa e de popa, burro, retranca, adriças, escotas, catracas, balaústres,
guarda-mancebos, púlpitos, luzes de navegação, vela grande com rizos e genoa enrolável com bolsas
(superfícies curvas), birutas na genoa e no topo do mastro.

O vento verdadeiro é dado em relação à proa. O barco fica parado na cena e o vento gira em volta dele.
As velas são reguladas sozinhas para o vento APARENTE (triângulo de velocidades com uma polar aproximada),
mudam de bordo quando o vento passa pela proa ou pela popa, e o barco aderna para sotavento conforme a força
do vento, a área de vela (rizos e genoa enrolada) e o ponto de vela. Dentro da zona morta (35° neste modelo)
o barco fica "no vento": velas panejando, sem seguimento. Banda e velocidade são um modelo didático.

opts de mount (todos opcionais):
modo:     'explorar' | 'identificar' (desafio: que parte está destacada?)        padrão 'explorar'
vento:    direção do vento verdadeiro em graus a partir da proa; + = boreste, − = bombordo   padrão 50
forca:    vento verdadeiro em nós (0 a 30)                                       padrão 12
rizo:     0 | 1 | 2  (rizos na vela grande)                                       padrão 0
genoa:    porcentagem da genoa enrolada (0 a 90)                                  padrão 0
leme:     'roda' | 'cana'                                                         padrão 'roda'
grupo:    rótulos mostrados: 'casco' | 'conves' | 'mastro' | 'velas'              padrão 'casco'
parte:    id da parte já selecionada (ex.: 'brandais', 'quilha', 'rizos'; lista em PARTES abaixo)
vista:    '34' | 'lado' | 'proa' | 'popa' | 'cima'                               padrão '34'
rotulos:  true | false                                                            padrão true
ajustes:  true | false (mostra os controles de vento e velas)                     padrão true
titulo:   legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'veleiro-3d', opts:{grupo:'mastro', parte:'brandais'}}
{t:'widget', w:'veleiro-3d', opts:{vento:-120, forca:18, rizo:1, genoa:30, grupo:'velas'}}
{t:'widget', w:'veleiro-3d', opts:{modo:'identificar'}}
```

## vhf-sim

`app/widgets/vhf-sim.js` — 125 KB

```
vhf-sim — simulador de rádio VHF marítimo com DSC (chamada seletiva digital), para leigos.
Face do rádio com display, seletor de canal (arraste ou setas do teclado), teclas 16/9 e potência (25 W / 1 W),
squelch, alto-falante com tráfego simulado, PTT e botão DISTRESS com tampa de mola (levantar a tampa e segurar).
Três modos: explorar o rádio (cada canal com o uso do Apêndice 18 do RR), montar chamada (roteiro de fala com
pronúncia, para MAYDAY, PAN PAN, SÉCURITÉ, rotina, DSC, MAYDAY RELAY, recibo, cancelamento de alerta falso,
SEELONCE MAYDAY e SEELONCE FEENEE, com "transmissão" simulada e resposta de uma estação costeira FICTÍCIA)
e desafio (qual chamada, ordenar o MAYDAY, qual canal).

Fontes (citadas na interface):
- UIT, Regulamento de Radiocomunicações (RR), edição de 2024 (CMR-23):
Art. 32 (socorro: 32.1, 32.6, 32.7, 32.9, 32.10A, 32.13A a 32.13E, 32.16 a 32.19H, 32.23, 32.29, 32.29A, 32.46,
32.47, 32.49, 32.51, 32.52, 32.53B a 32.53E); Art. 33 (urgência 33.9 a 33.15B; segurança 33.31 a 33.38B);
Art. 52 (52.231, 52.239, 52.240, 52.241A, 52.244, 52.260: 25 W); Apêndice 14 (alfabeto e algarismos);
Apêndice 15, Tabela 15-2 (canais 6, 13, 16, 70); Apêndice 18 (tabela de canais VHF e notas).
- Recomendações UIT-R M.493-16 (botão de socorro: duas ações independentes, tampa de mola; natureza do perigo;
padrões de fábrica; canal 6 sugerido para chamada entre navios), M.541-11 (alerta no 70 e depois voz no 16;
repetição automática a cada 3,5 a 4,5 min; recibo; cancelamento), M.489-2 (até 25 W, redução fácil a 1 W) e
M.1171-1 (chamada de rotina, resposta e troca para canal de trabalho).
- NORMAM-211/DPC, art. 4.23.4 a (escuta no 16, ou no 70 se o rádio for DSC) — fato 'normas-150'.
O GMDSS é o sistema da IMO (Convenção SOLAS, cap. IV); os procedimentos de rádio vêm do RR da UIT.
Uso em português entre estações brasileiras e o canal 9 como canal de chamada aparecem com selo "a confirmar".
Estação costeira, barcos, indicativos e MMSI usados nos exemplos são fictícios.

opts de mount (todos opcionais):
modo:      'explorar' | 'montar' | 'desafio'                 modo inicial (padrão 'explorar')
modos:     ['explorar', 'montar', 'desafio']                  modos exibidos (padrão: os três)
canal:     '16'                                               canal inicial
mensagem:  'mayday' | 'panpan' | 'securite' | 'rotina' | 'dsc' | 'relay' | 'recibo' | 'cancelar' |
'seelonce' | 'feenee'                              tipo inicial do construtor (padrão 'mayday')
idioma:    'intl' | 'pt'                                      palavras de procedimento do roteiro (padrão 'intl')
algarismos:'simples' | 'uit'                                  como dizer algarismos no roteiro (padrão 'simples')
desafio:   'situacao' | 'ordem' | 'canal'                     tipo de desafio inicial (padrão 'situacao')
n:         8                                                  perguntas por rodada no desafio
segurar:   5                                                  segundos segurando o DISTRESS (padrão 5)
trafego:   true                                               tráfego simulado no alto-falante
barco:     { nome: 'Albatroz', indicativo: 'PQ4821', mmsi: '710123456', pessoas: 4 }   (fictícios)
titulo:    legenda do instrumento

Exemplos de bloco de lição:
{t:'widget', w:'vhf-sim', opts:{}}
{t:'widget', w:'vhf-sim', opts:{modo:'montar', mensagem:'mayday'}}
{t:'widget', w:'vhf-sim', opts:{modo:'montar', modos:['montar'], mensagem:'securite'}}
{t:'widget', w:'vhf-sim', opts:{modo:'desafio', modos:['desafio'], desafio:'ordem'}}
```
