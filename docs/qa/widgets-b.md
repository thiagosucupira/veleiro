# QA dos widgets, lote B

Data: 2026-10-08. Área: esfera-celeste, globo-rotas, derrota-calc, veleiro-3d, mareacao, manobras, meteo-sinotica,
beaufort, quartos, provisoes, vhf-sim, alfabeto-fonetico (rota `#/lab/<nome>`).

## Resultado

Os 12 widgets passam nos critérios do PLAN (seções 7 e 10) para a camada de widgets:

| Critério | Resultado |
|---|---|
| Desktop claro, celular escuro e `--offline` | `console: []`, `pageerrors: []`, `externas: []`, `falhas: []` nos 12 |
| `overflowX` no celular (390 px) | `false` nos 12 |
| WebGL desligado (esfera-celeste, globo-rotas, veleiro-3d) | os três mostram mensagem e alternativa (desenho do meridiano, carta de Mercator, perfil do veleiro); cliques e lista de partes seguem funcionando |
| Limpeza ao sair da rota | 0 quadros de animação, 0 `setInterval`, 0 `setTimeout` pendentes, 0 listeners globais sobrando, 0 canvas; testado também com animação rodando (manobras, vhf-sim, treino contra o relógio) |
| Opções (`opts`) | 60 combinações, incluindo valores absurdos, sem exceção; 99 usos reais nas lições e no glossário conferidos contra o que cada widget aceita |
| Movimento reduzido | manobras tem passo a passo manual; os demais não animam sozinhos |
| Teclado, toque e arrasto | arrasto e roda nos 3D, segurar o DISTRESS por 5 s com ponteiro, teclado no DISTRESS: funcionam |

Validação de dados: `node tools/validate.mjs` continua com "todos os critérios passaram" (não mexi em dados).

## Conferência técnica

- **Ortodrômica x loxodrômica, exemplo à mão** (40° N, 0° até 40° N, 60° E): cos d = sen²40° + cos²40° · cos 60° = 0,70659, d = 45,04° = 2.702,5 milhas;
  rumo inicial: tg R = sen 60° / (cos 40° · tg 40° − sen 40° · cos 60°) = 0,8660 / 0,3214, R = 69,64°; vértice em 44,1° N;
  loxodrômica = 60 · 60 · cos 40° = 2.757,8 milhas, rumo 090°. O widget dá exatamente 2.702,5 / 69,64° / 44,10° / 2.757,8.
  Rio–Cidade do Cabo (3.267 x 3.306 milhas, vértice 34° 15′ S) e Horta–Bermudas (loxodrômica S 78,2° W, 1.797 milhas, conferida à mão) batem.
  Casos de borda: pontos iguais, antípodas, linha de data, equador, mesmo meridiano e perto do polo são tratados com mensagem.
- **Giro do vento no Hemisfério Sul** (meteo-sinotica): em volta da baixa, sentido horário; em volta da alta, anti-horário;
  Buys-Ballot do Sul (de costas para o vento, a baixa fica à direita); passagem de frente fria gira NW, W, SW, S (anti-horário). Tudo certo nos textos, nas setas e no desafio.
  O hemisfério Norte do cenário esquemático inverte tudo corretamente.
- **Beaufort**: nós, km/h, m/s, altura provável e máxima, e os nomes do CHM conferem com a tabela da OMM nº 8 para as forças 0 a 12;
  a escala Douglas e o conversor de nós em força (limites em 1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64) também.
- **MAYDAY (vhf-sim)**: DSC no 70 depois de levantar a tampa e segurar 5 s; passa ao 16; recibo; MAYDAY x3, AQUI É, nome x3, indicativo e MMSI; mensagem com posição, natureza, auxílio e pessoas;
  PAN PAN, SÉCURITÉ, MAYDAY RELAY, recibo, cancelamento de alerta falso, SEELONCE MAYDAY/FEENEE. Referências ao RR e à UIT-R M.493/M.541 coerentes. A estação costeira é fictícia e está dita assim.
- **Alfabeto da UIT**: as 26 letras e os algarismos (Nadazero, Unaone, Bissotwo, Terrathree, Kartefour, Pantafive, Soxisix, Setteseven, Oktoeight, Novenine, Decimal, Stop), com as pronúncias do Apêndice 14, conferem.
- **Mareação**: triângulo de velocidades (12 nós a 60° e 6,5 nós: aparente 16,3 nós a 40°, VMG 3,2) confere com a trigonometria.
- **Esfera celeste**: declinação do Sol em 08/10 (6° 10′ S), HMG, hora sideral e AHG do ponto vernal conferem com o Almanaque Náutico em ordem de grandeza.
- **Provisões**: 1.200 mn a 5 nós, margem de 25%: 10 dias, 12,5 com margem; 4 L x 4 pessoas x 10 dias = 160 L; diesel e gás coerentes.

## O que corrigi (só nos meus arquivos)

1. **manobras.js, erro técnico no cambar**: o passo "Preparar para cambar" dizia que a escota nova da genoa era a de bombordo e a atual a de boreste, mas a manobra
   começa com vento por boreste (genoa a bombordo). Invertido: a nova é a de boreste, a atual a de bombordo (a de sotavento).
2. **manobras.js, opções das lições**: `manobra: 'homem-ao-mar'` (usada em `data/glossario.js`) caía em silêncio no cambar. Agora aceita aliases (`homem-ao-mar`, `mdo`, `tack`…).
3. **derrota-calc.js**: `aba: 'orto'` e `'lox'` (glossário) não existiam; agora abrem a aba Derrotas.
4. **meteo-sinotica.js, modelo da frente fria**: o texto e o desafio dizem que a pressão cai antes da frente e sobe depois, mas no ponto padrão (Florianópolis) ficava
   plana em 1.011 hPa durante 24 h e o vento pulava de WNW a SSE. Dei à frente fria um cavado pré-frontal largo e uma subida atrás rápida (`asim`, `dip`): agora a pressão
   cai cerca de 3 hPa em ~15 h, o vento gira NW, WNW, WSW, e depois da passagem a pressão sobe 2,6 hPa em 3 h com vento de SSE.
   O mesmo ajuste vale para o cenário do ciclone. Os cenários da ASAS, dos alísios e o esquemático não mudaram.
5. **meteo-sinotica.js, legibilidade no celular**: nomes de cidades se sobrepunham (Porto Alegre, Montevidéu, Buenos Aires); agora o rótulo que bate em outro troca de lado ou some
   (o ponto fica, com título). Fontes das legendas do mapa de 9,5–11 px para 11–12 px.
6. **esfera-celeste.js**: `lat`, `lon`, `hora` e `data` absurdos (por exemplo `lat: 999`, `data: 'xx'`) geravam NaN e erro de THREE. Agora são limitados/validados.
7. **provisoes.js**: opções fora da faixa (velocidade 0, tripulação 0) geravam "NaN dias". Agora seguem os mesmos limites dos campos.
8. **CSS, alvos de toque de 40 px**: chips da esfera (34), tabela do Beaufort (36), velocidade de manobras (39), e os chips de veleiro-3d, meteo-sinotica,
   vhf-sim e manobras, que o `app.css` forçava a 36 px por especificidade.
9. **CSS, textos pequenos**: rótulos da esfera, escala do veleiro-3d, iniciais da grade de quartos e textos do rádio de 10–11,5 px para 12 px.
   Rótulos "de trás da esfera" da esfera-celeste estavam com contraste de 1,9 a 2,7; subi a opacidade (0,62 / 0,55 / 0,48).

## Fora da minha área (para quem é dono)

| Arquivo | Problema | Sugestão |
|---|---|---|
| `app/assets/css/app.css` linha 360 | `button.chip { min-height: 36px }` em `pointer: coarse` contradiz a regra de 40 px da arquitetura e vence `.xxx-chip { min-height: 40px }` dos widgets | subir para 40px |
| `app/data/glossario.js` linhas ~1290, 1292, 1634 | usa `aba: 'orto'`, `aba: 'lox'` e `manobra: 'homem-ao-mar'`, ids que os widgets não têm | trocar por `derrota-calc {aba:'derrotas'}` e `manobras {manobra:'mob'}` (os widgets já aceitam os nomes antigos) |
| Componente de interruptor global (`input` de 44 x 26) | o campo em si é menor que 40 px; o alvo de toque é o rótulo inteiro, que tem 40 px ou mais | nada a fazer, só registrar |

## Para conferir com um especialista (não alterei)

- **Homem ao mar**: o widget e o quiz ensinam parar com a pessoa a sotavento do barco. A orientação varia por escola (RYA, US Sailing, Marinha); o bloco já está marcado
  com selo "a confirmar". Vale a revisão de um instrutor habilitado antes da publicação.
- **Perda de contexto WebGL** (celular com a aba em segundo plano): os três widgets 3D não têm tratamento próprio. O Three.js restaura sozinho; não observei erro,
  mas não há como simular uma perda real no Chrome headless.

## Pendências resolvidas (fechamento)
Fechamento de 2026-10-08, na parte que cabe aos arquivos de widgets A (`nos`, `carta-nautica`, `sextante`, `boias-iala`) e a `app/data/glossario.js` (só os `opts` de widget). Os itens de manobras e homem ao mar ficam com o outro agente.

| Pendência (tabela "Fora da minha área" e seção "Para conferir") | Situação | O que foi feito ou por que fica como está |
|---|---|---|
| `app/assets/css/app.css` linha 360: `button.chip { min-height: 36px }` em `pointer: coarse` | Já resolvida | A regra atual é `.chip, button.chip { min-height: 40px; }`. Fora dos meus arquivos, apenas conferido: no celular, os chips de `boias-iala` e os demais alvos de `nos`, `carta-nautica`, `sextante` e `boias-iala` medem 40 px ou mais (auditor Playwright, todas as abas). |
| `app/data/glossario.js` (~1290, 1292, 1634): `aba: 'orto'`, `aba: 'lox'`, `manobra: 'homem-ao-mar'` | Resolvida | Trocados pelos ids reais: `derrota-calc {aba:'derrotas'}` nas duas entradas (ortodrômica e loxodrômica; a aba mostra as duas derrotas juntas) e `manobras {manobra:'mob'}` no homem ao mar. O `node --check` do arquivo passa. Os widgets seguem aceitando os nomes antigos, então links já salvos continuam abrindo. |
| Componente de interruptor global (`input` de 44 x 26; o alvo é o rótulo de 40 px ou mais) | Mantida | Nada a fazer, como já registrado. Conferido de novo nos interruptores de `boias-iala`, `sextante` e `nos`: o rótulo clicável tem 40 px ou mais de altura. |
| Homem ao mar: orientação de parar com a pessoa a sotavento varia por escola (RYA, US Sailing, Marinha); revisão por instrutor | Mantida, fora do meu escopo | Tratada pelo outro agente (manobras e MOB). Nada nos meus arquivos depende disso. |
| Perda de contexto WebGL nos widgets 3D (sem tratamento próprio, não simulável no Chrome headless) | Mantida | Os três widgets citados são de outro lote. Nos meus dois widgets com WebGL (`sextante` e `boias-iala`) o comportamento é o mesmo do Three.js (restaura sozinho), e não há como simular uma perda real no Chrome headless; sem evidência de defeito, não mexi, para não criar código que não posso testar. |

## Revisão final (ponta a ponta)

Refeita em 2026-10-09, no estado atual do app, com `tools/qa_shot.py --offline` (desktop claro e celular escuro, 12 rotas cada) e um roteiro Playwright próprio (Chrome do sistema): celular 390 px com e sem WebGL, alvos de toque, `opts` do glossário e texto do cambar. Seis PNGs abertos (esfera-celeste e manobras no desktop; meteo-sinotica, veleiro-3d, vhf-sim e globo-rotas no celular escuro). Nenhum arquivo da área precisou de correção nesta rodada.

### Pendências

| Pendência | Resultado | Fonte / evidência |
|---|---|---|
| `app.css`: `button.chip { min-height: 36px }` em `pointer: coarse` | Resolvida | `app.css` linha 362 hoje é `.chip, button.chip { min-height: 40px; }`. No celular, nenhum botão, seletor ou campo dos 12 widgets mede menos de 40 px, com duas exceções justificadas abaixo. |
| `glossario.js`: `aba: 'orto'`/`'lox'` e `manobra: 'homem-ao-mar'` | Resolvida | O glossário usa `derrota-calc {aba:'derrotas'}` (2 entradas) e `manobras {manobra:'mob'}`; `node --check` passa. Abertos no navegador, `aba:'derrotas'` e `aba:'orto'` mostram a aba Derrotas, e `manobra:'mob'` e `'homem-ao-mar'` mostram "Homem ao mar" com "Parada rápida", sem erro. Os nomes antigos continuam aceitos. |
| Interruptor global (`input` de 44 x 26) | Justificada | Alvo de toque é o rótulo inteiro, de 40 px ou mais (conferido nos interruptores de globo-rotas e meteo-sinotica). Nada a fazer. |
| Homem ao mar: orientação varia por escola | Justificada, depende de pessoa | `research/mob.md`, as fontes do bloco (RYA; US Sailing, estudo de 2020, simpósio de 2005) e o quadro "O que este curso recomenda" em `manobras.js` mostram o método, o lado e as variantes, e mandam treinar com instrutor. A revisão por instrutor habilitado antes da publicação segue sendo decisão humana; não há o que corrigir no código. |
| Perda de contexto WebGL nos três widgets 3D | Resolvida (já tratada) | `VL.gl3d.vigiar` (`app/core/ui.js`: `webglcontextlost` e `webglcontextrestored`, aviso, restauração ou recriação da cena) está ligado em `esfera-celeste.js`, `globo-rotas.js` e `veleiro-3d.js`. Perda real continua não simulável no Chrome headless; com WebGL desligado (`--disable-webgl`) os três mostram a mensagem e a alternativa, sem erro. |

Dois pontos verificados e mantidos: os rótulos `.v3-rot` do veleiro-3d têm 27 px visíveis, mas uma área de toque ampliada por `::before` (`inset: -8px -4px`, ou seja, 43 px de altura); e os quatro links da lista de fontes da meteo-sinotica são links de texto em linha (19 px), que a WCAG 2.2 (critério 2.5.8) dispensa do mínimo de alvo. A sonda de vento da meteo-sinotica fica por cima dos nomes de Porto Alegre e Rio Grande quando o ponto padrão (Florianópolis) está selecionado; é o ponto que a pessoa escolhe, e tocar em outro lugar libera os nomes.

### Testes refeitos

| Rota (`#/lab/...`) | Modo | Erros (console, página, rede) | `overflowX` |
|---|---|---|---|
| esfera-celeste | desktop claro, offline | 0 | não |
| globo-rotas | desktop claro, offline | 0 | não |
| derrota-calc | desktop claro, offline | 0 | não |
| veleiro-3d | desktop claro, offline | 0 | não |
| mareacao | desktop claro, offline | 0 | não |
| manobras | desktop claro, offline | 0 | não |
| meteo-sinotica | desktop claro, offline | 0 | não |
| beaufort | desktop claro, offline | 0 | não |
| quartos | desktop claro, offline | 0 | não |
| provisoes | desktop claro, offline | 0 | não |
| vhf-sim | desktop claro, offline | 0 | não |
| alfabeto-fonetico | desktop claro, offline | 0 | não |
| as mesmas 12 rotas | celular 390 px escuro, offline | 0 em todas | não em todas |
| esfera-celeste, globo-rotas, veleiro-3d | celular escuro, WebGL desligado | 0; mensagem e alternativa visíveis | não |
| derrota-calc, manobras | desktop, `opts` do glossário e nomes antigos (4 casos) | 0 | não |

Contagem: 24 telas (12 desktop, 12 celular) com 0 erros e 0 requisições externas; 3 testes sem WebGL; 4 testes de `opts`; texto do cambar conferido (escota nova de boreste, atual de bombordo). Pendências: 5 de 5 resolvidas ou justificadas com fonte, 0 sem fonte.
