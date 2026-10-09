# Revisão técnica final do curso Mestre-Amador

Revisor: instrutor de vela e navegação (revisão técnica cética). Data: 2026-10-08.

## Escopo e método

- Lidas todas as 74 lições: `app/data/cursos/mestre.js`, `mestre-1.js` (m1 a m3), `mestre-2.js` (m4 a m7) e `mestre-3.js` (m8 a m14), com texto, tabelas, fatos, blocos de questões e widgets.
- Conferidas as 68 figuras SVG: lidas as coordenadas, renderizadas em folha de contato e medidas as sobreposições e cortes de texto no navegador (fonte real do app).
- Lidos os três baralhos `app/data/flashcards/mestre-1.js`, `mestre-2.js` e `mestre-3.js` (176 cartas).
- Lidas as 198 questões do banco `app/data/questoes/mestre.js` (o pedido era 40 sorteadas; o banco é pequeno e foi lido inteiro), com as 12 figuras das questões. Todas as contas foram refeitas.
- Conferido contra o texto local do Manual de Navegação (vols. I e III) e da Carta 12000 em `research/_work/fontes_cache`, contra a NORMAM-211 consolidada (`research/acervo/normam-211.txt`), contra o texto do RIPEAM em cache, contra `research/claims_verified.json` (os 169 fatos usados no curso; os 5 com status "a confirmar" e os de nota "divergente" foram tratados à parte) e contra `docs/widgets.md`.
- Refeitas as contas: conversão de rumos e marcações (com E positivo, W negativo), declinação atualizada, latitude e longitude, afastamento, triângulos de corrente, marcações duplas e sucessivas, marés (cosseno, doze avos, janela de passagem), alcance geográfico, horizonte radar, alcance de VHF, eco do ecobatímetro com offset, superfície livre, banda por peso deslocado, tabela de desvios, plotagem e leitura de coordenadas, problema completo da lição m5 l5 (ETA 1110 conferida).
- Depois das correções: `python3 tools/build_questoes.py`, `python3 tools/build_manifesto.py` e `node tools/validate.mjs` (todos os critérios passaram); `qa_shot` offline em lições alteradas, desktop e celular: `console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`.
- Abertas no navegador (Chrome do sistema) as lições `#/mestre/m10/l1`, `m10/l2`, `m3/l14`, `m9/l5`, `m3/l12`, `m14/l4`, entre outras: sem erro de console e com as figuras novas conferidas.

## Erros encontrados e corrigidos

### 1. Física errada em figura SVG: circulação em volta de alta e baixa (mestre m10 l1, `#/mestre/m10/l1`)

- Problema: os rótulos diziam "alta: anti-horário" e "baixa: horário" (certo para o Hemisfério Sul, e o texto da lição também), mas as setas estavam desenhadas ao contrário: horárias em volta da alta e anti-horárias em volta da baixa, o padrão do Hemisfério Norte. A legenda ainda afirma que o vento "sai da alta e entra na baixa", e as setas só giravam, sem sair nem entrar.
- Correção: setas refeitas. Em volta da alta, anti-horárias e em espiral para fora; em volta da baixa, horárias e em espiral para dentro. Conferidas em captura de tela.

### 2. Física errada em figura SVG: setas de vento na passagem da frente fria (mestre m10 l2, `#/mestre/m10/l2`)

- Problema: a legenda diz "as setas apontam para onde o vento vai", mas as setas do vento de S apontavam para baixo (o que seria vento de N), a do vento de SW apontava para sudeste e a do vento de NW apontava para sudoeste. Quem lesse a figura aprendia a sequência de direções errada.
- Correção: N aponta para o sul, NW para sudeste, SW para nordeste e S para o norte. Rótulos reposicionados (o "S" colidia com "SW rajadas" e "tempo" com "N").

### 3. Questão do banco: gabarito com afirmação mais específica que a marca (mestre-0111, `research/_work/questoes/mestre-3.rev2.json`)

- Problema: "dois cones pretos unidos pelos vértices" é a marca diurna de qualquer embarcação engajada na pesca, de arrasto (Regra 26(b)(i)) ou não (Regra 26(c)(i)). A alternativa certa dizia "pesca de arrasto", que a marca não permite concluir.
- Correção: a certa passou a "Está engajada na pesca; o veleiro deve dar passagem a ela" e o distrator inverso passou a "pesca de arrasto; ela deve dar passagem ao veleiro" (continua errado pela Regra 18(b)). Explicação e referência reescritas. `build_questoes.py` rodado.

### 4. Texto que contradiz fato verificado "a confirmar" (extra-mestre-3-02, `#/mestre/m9/l4` e `m9/l5`, flashcard msa3-17)

- Problema: `claims_verified.json` registra que a fonte (NORMAM-211, art. 4.19.3) não afirma o "só" de "obrigatório só para embarcações de grande porte ou iates". O texto repetia a exclusividade.
- Correção: o texto passou a "A NORMAM-211 exige radar de 9 GHz nas embarcações de grande porte ou iates construídos após 11/02/2000, na navegação costeira ou oceânica; para as menores o emprego é recomendado". O bloco do ecobatímetro (m9 l5) passou a usar o fato confirmado extra-mestre-1-03. O flashcard msa3-17 foi reescrito do mesmo jeito.

### 5. Fato "a confirmar" sem a exceção da fonte (extra-arrais-3-43, `#/mestre/m13/l3`)

- Problema: o bloco dizia que a lotação é determinada pelo estaleiro, sem a exceção do art. 3.27.1 (sem dado do estaleiro, ou embarcação artesanal, valem as regras de passageiros e de peso máximo de carga das NORMAM-201 ou 202). A questão msa3-m13-l3-q4 já dava a exceção.
- Correção: exceção incluída no bloco.

### 6. Fato "a confirmar" com escopo errado (taxas-28, `#/mestre/m14/l4`)

- Problema: o bloco dizia que as provas de ARA e MSA na CPBA ocorrem de segunda a sexta, em computador, com 40 questões. A página da CPBA, reaberta em 2026-10-08, só fala do Arrais-Amador.
- Correção: o bloco passou a falar só do Arrais-Amador na CPBA e avisa que, para o MSA, as 40 questões vêm do Anexo 5-A e o formato se confirma com a OM.

### 7. Fato "a confirmar" com afirmação que não procede (normas-90, `#/mestre/m14/l3`)

- Problema: "provas, gabaritos e listas de aprovados ... desde 2017". Em 2017 só há prova e gabarito; a primeira relação de aprovados é de 2018.
- Correção: "provas e gabaritos ... desde 2017 (as relações de aprovados aparecem a partir de 2018)".

### 8. Porte do veleiro de 32 pés sem a divergência da norma (mestre m3 l14, `#/mestre/m3/l14`)

- Problema: o quadro "E o seu veleiro de 32 pés?" afirmava "com menos de 24 m, ele é de médio porte" sem bloco de fato e sem avisar que o art. 1.7 da NORMAM-211 usa outra divisão (pequeno porte de 6 a 12 m; médio de 12 a 24 m). `claims_verified.json` (normas-16 a 18) registra a inconsistência interna da norma.
- Correção: o quadro explica que as tabelas de equipamentos do Capítulo 4 seguem o Glossário (médio porte = menos de 24 m, fora as miúdas), cita a divergência do art. 1.7 e manda perguntar à Capitania. Incluído o bloco `fato` normas-18.

### 9. Inconsistência de procedimento entre lições: correção de Aviso Permanente (mestre m6 l6 x m1 l4)

- Problema: m1 l4 e a questão msa1-l4-2 dizem "a tinta vermelha, sem rasuras"; m6 l6 dizia só "a caneta". O Manual diz as duas coisas (cap. 2: tinta vermelha; item 12.11.1: caneta ou bacalhau).
- Correção: m6 l6 e o flashcard msa2-46 passaram a "a caneta (a tinta vermelha, de forma clara e sem rasuras)".

### 10. Terminologia: "subir a costa para o sul" (mestre m10 l5, tabela de ventos)

- Problema: na marinharia brasileira, "subir a costa" é ir para o norte. A tabela dizia "subir a costa para o sul pode ser contravento", e o quadro logo abaixo da tabela usa "descer a costa" para o sul.
- Correção: "descer a costa rumo ao sul pode ser contravento".

### 11. Exemplos de conversão que parecem contradizer a tabela de desvios (mestre m3 l15 e l16)

- Problema: os exemplos do Manual usam desvios de outra agulha (3° E na proa 090°, 2° W na 160°, 2° E na 110°). A tabela da lição 14 dá outros valores nessas proas (4° E, cerca de 2,7° E, cerca de 3,7° E). Quem refizesse a conta pela tabela achava resultado diferente e achava que a lição estava errada.
- Correção: nota "De onde vêm os desvios" na l15 e esclarecimento no exemplo e no quadro "O erro clássico" da l16. A carta de treino logo abaixo continua usando a tabela da lição 14.

### 12. Figuras: rótulos cortados ou sobrepostos, e rótulo ambíguo (medido com a fonte real do app)

- m9 l4 (tela do radar): o eco rotulado "barco" parecia ser o próprio barco (o seu fica no centro); agora "outro barco".
- m3 l12 (os três nortes): "Dag 6° E (exagerado para ver melhor)" colidia com "Rag 086°". Encurtado.
- m8 l2 (nível de redução): "NR (zero da carta)" saía do quadro. Reposicionado.
- m8 l3 (tábua de exemplo): o marcador "● nova" colidia com a hora 0826. Reposicionado.
- m9 l6 (EPIRB): "navio ou aeronave de busca" invadia a caixa SALVAMAR. Reposicionado.
- m10 l5 (ventos): "ZCIT ao norte" colidia com "E-SE". Reposicionado.
- m10 l6 (áreas do METEOROMARINHA): "Arraial do Cabo – Caravelas" saía do quadro. Quebrado em duas linhas.
- m12 l4 (balsa): "âncora flutuante (depois)" saía do quadro. Reposicionado.
- m3 l13 (rosa): "180" colidia com a legenda. Reposicionado.
- Reconferido por script nas 9 lições alteradas: sem sobreposição nem corte.

### 13. Flashcards com afirmação sem a ressalva da fonte

- msa3-20: "o registro [INFOSAR] vale 2 anos" agora diz "segundo a Central de Ajuda do DECEA ... confira no INFOSAR" (`radio-44` registra conflito com um artigo mais antigo da mesma central).
- msa3-33: "certificado de operador" agora manda confirmar com a Anatel (`radio-12` registra que não ficou explícito se um VHF/DSC de veleiro de recreio conta como estação ligada ao GMDSS).

## Conferido e mantido (sem erro)

- Todas as questões do banco, com exceção da mestre-0111, têm gabarito correto, uma só alternativa certa e contas conferidas. As 12 figuras das questões (perfil de sondagem, través de bombordo, triângulo de vetores, croquis, cardinal Leste, duas luzes encarnadas, secagem, curva de maré, carta sinótica, isóbaras, barógrafo) batem com o enunciado e o gabarito.
- Geometria e física das figuras de estabilidade: em m13 l2, o centro de carena B' fica do lado que afundou, G fica na linha de centro do barco, M está acima de G, a vertical de B' passa por M e o binário peso-empuxo endireita o barco. Em m13 l3, o líquido do tanque pela metade tem superfície horizontal e centro deslocado para o lado baixo. Curva de estabilidade, flutuabilidade e borda livre coerentes.
- Convenção de sinais: Rv = Rmg + Dec, Rmg = Rag + Dag, com E positivo e W negativo, em texto, figuras (m3 l12, l13, l15), exemplos, widget e questões. O exemplo da lição 12 (22° W, 6° E, Rv 070° = Rmg 092° = Rag 086°), o da lição 14 (alinhamento Mv 315° = Mmg 337°, Rag 340°, Dag 3° W) e a tabela e a curva de desvios batem ponto a ponto.
- Marcações: relativas (figura m3 l16), polar a BB, marcações duplas (22,5°/45°, 30°/60°, 45°/90° e seno do dobro), sucessivas e transporte (limite de 30 min do Manual 6.2), Série de Traub (14°, 16°, 18°, 22°, 27°, 34°, 45°, 63°, 90°, conferida no Manual 6.3.4).
- Triângulos de corrente (problemas 1 a 4 da m5 l4, rumo 190,5° / 6,1 nós; RN 090° / 5,8 nós; RN 020,5° / 5,9 nós; ETA 1100) e o problema completo da m5 l5 (rumo 058°, 15,2 M, RN 048,5°, Rmg 070,5°, Rag 068,5°, ETA 1110).
- Balizamento Região B (encarnada a boreste, ímpares; verde a bombordo, pares), cardinais, canal preferencial, perigo isolado, águas seguras, especial, novo perigo e boia de destroços (azul e amarela), e as luzes e marcas do RIPEAM. O texto das Regras 7, 8(f), 9, 10, 12 a 15, 17, 18, 19, 20(c), 25, 26, 32, 34, 35 e do Anexo IV confere com o RIPEAM em cache. Setor de farol "do mar para o sinal", conferido na figura m6 l2 (reciprocidades 250° a 265°).
- Alcance geográfico (1,927; Manual usa 1,93), alcance nominal (visibilidade 10 M), alcance luminoso (T = 0,85 e visibilidade 18,4 M) e "a carta registra só o menor dos dois" (Manual 13.2.6). Horizonte radar 2,21 raiz de H, alcance de VHF 2,2 vezes a soma das raízes.
- Marés: sizígia e quadratura, atraso de 50 min por dia, cosseno (1,7 m), doze avos (7/12) e janela 0845 a 1605 conferidas; Tabelas I e II só de Vitória para o Norte; sondagem somada à altura da maré; secagem subtraída.
- Divisão da costa (Norte, Leste, Sul), prumo de mão (marcas a cada 2 m, pinha aos 10, 20 e 30 m), amarra de 183 m, nevoeiro como nuvem com base abaixo de 15 m, milha de 1.852 m (1929), monção de NE de setembro a março, e demais dados citados do Manual vol. I e III.
- Todas as opções dos widgets (`opts`) conferem com `docs/widgets.md`.
- `travessia-38` (colete da World Sailing, "a confirmar") só aparece como fonte em m12 l2; o texto da lição não afirma a exigência da OSR (capuz e ponto de engate são dados como acessórios úteis), então não contradiz a divergência registrada.
- Sobrevivência: choque térmico, 1-10-1 (tratado como mito), HELP, resgate na horizontal, lançamento da balsa a sotavento com boça, âncora flutuante a barlavento da balsa, manuseio do facho. Nenhum conselho perigoso encontrado.

## Pendente ou fora do escopo

- A inconsistência entre art. 1.7 e Glossário da NORMAM-211 (porte da embarcação) é da própria norma. O curso agora avisa, mas a decisão de enquadramento é da Capitania.
- `tecnico-164` (regra dos doze avos) está marcado na base como fonte não oficial (Wikipédia). O curso já diz isso na lista de fontes; os métodos oficiais continuam sendo as Tabelas I e II e o Método Expedito.
- Quatro sobreposições de 4 px em figuras (m1 l3 "23°49,3′S" e "044°10,7′W"; m1 l6 "altitude" e "(acima do NMM)"; m2 l10 "D" e "milhas"; m1 l1 rótulo rotacionado "Escala de latitudes") são cosméticas, sem perda de leitura, e ficaram como estão.
- Os selos "a confirmar" dos fatos extra-mestre-3-02, extra-arrais-3-43, normas-90 e taxas-28 continuam aparecendo (o status vem de `claims_verified.json`); só o texto foi ajustado para acompanhar a correção.

## Pendências resolvidas (fechamento)

Fechamento de 2026-10-08. Validação: `node --check`, `node tools/validate.mjs` (todos os critérios passaram) e `qa_shot` offline nas lições alteradas (`mestre/m1/l1`, `l3`, `l6` e `m2/l10`): `console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`. As sobreposições foram medidas no navegador com a fonte real do app (script que compara as caixas de todos os textos de cada figura).

| Pendência | Situação | O que foi feito ou por que fica |
|---|---|---|
| Porte da embarcação: art. 1.7 x Glossário da NORMAM-211 | Mantida | A inconsistência é da própria norma (divisão de porte diferente no art. 1.7 e nas tabelas do Capítulo 4). Nada a corrigir no curso: m3 l14 já explica as duas divisões, traz o fato `normas-18` e manda perguntar à Capitania. Inventar uma resolução seria pior que mostrar a divergência. |
| `tecnico-164`, regra dos doze avos com fonte não oficial | Mantida, com busca refeita | Nova busca por fonte oficial (DHN, UKHO, NOAA, Bowditch) não achou nenhuma que descreva a regra. Só há fontes secundárias (Wikipedia, sites náuticos), e nenhuma é melhor que a já citada. O curso já diz que a fonte não é oficial, já indica as Tabelas I e II e o Método Expedito como métodos oficiais, e a comparação com a cossenoide foi calculada para o curso. Trocar por outro site não oficial não melhoraria nada. |
| Quatro sobreposições de 4 px em figuras | Resolvida | Corrigidas em `mestre-1.js`: m1 l3 ("23°49,3′S" subiu 4 unidades, separada de "044°10,7′W"), m1 l6 ("altitude" subiu 4, separada de "(acima do NMM)"), m2 l10 (as letras grandes D, V e T subiram 4, separadas de "milhas", "nós" e "horas"). Em m1 l1 o rótulo "Escala de latitudes" saía 1 unidade da borda; os dois rótulos foram afastados da borda. Reconferido: as quatro figuras saem sem sobreposição e sem corte. Na m1 l6 a figura dos símbolos K ainda mostra 3 px de sobreposição entre caixas de linhas consecutivas do mesmo rótulo (espaçamento de 18 para fonte 15, sem colisão visível), por isso ficou como está. Também ajustado "rocha que / descobre" na figura de níveis da m1 l6. |
| Selos "a confirmar" em `extra-mestre-3-02`, `extra-arrais-3-43`, `normas-90`, `taxas-28` | Mantida, com verificação encaminhada | O selo vem de `claims_verified.json` (fora do escopo) e continua certo, porque o texto do app foi reescrito e já não é o mesmo do claim original. Para o selo sumir de forma honesta, as redações corrigidas foram registradas para verificação em `research/_work/research_extra_fechamento-am.json`: `extra-fechamento-am-04` (radar e ecobatímetro, art. 4.19.3), `-05` (lotação com a exceção do art. 3.27.1), `-06` (provas e gabaritos de CPA desde 2017; aprovados desde 2018) e `-07` (CPBA só para o Arrais-Amador). Quando forem verificados e entrarem em `fontes.js`, basta trocar os quatro `ref` nos blocos de mestre-3 (m9 l4, m13 l3, m14 l3 e m14 l4). Não foram trocados antes porque o `validate.mjs` recusa referência a fato inexistente e o selo não apareceria. |

### Arquivos alterados neste fechamento

- `app/data/cursos/mestre-1.js` (figuras de m1 l1, l3, l6 e m2 l10)
- `research/_work/research_extra_fechamento-am.json` (novo, compartilhado com o fechamento do Arrais)
- Este relatório

## Revisão final (ponta a ponta)

Revisor: instrutor de vela e navegação (Capitão-Amador, Yachtmaster Ocean), leitura cética. Data: 2026-10-09.

### Escopo e método

- Lidas por inteiro as 74 lições de `app/data/cursos/mestre-1.js`, `mestre-2.js` e `mestre-3.js` (m1 a m14), com texto, tabelas, blocos `fato`, as 242 questões embutidas nas lições e os textos de todas as figuras SVG (títulos e rótulos). Lidas as 176 cartas dos três baralhos (`app/data/flashcards/mestre-1.js` a `mestre-3.js`) e as 198 questões do banco `app/data/questoes/mestre.js` (origem: `research/_work/questoes/mestre-1..5.rev2.json`).
- Refeitas as contas de todas as questões e exemplos numéricos (rumos, declinação atualizada, marcações duplas e sucessivas, triângulos de corrente, ETA, marés por cosseno e doze avos, janela de passagem, alcance geográfico e radar, VHF, eco, offset, superfície livre, banda, peso movido).
- Conferido contra o texto local do Manual de Navegação (vol. I e III), da Carta 12000, do RIPEAM em cache, da NORMAM-211 consolidada (`research/acervo/normam-211.txt`), do extrato OSR 2026-2027 em cache, contra `research/claims_verified.json` e contra `research/mob.md` (homem ao mar).
- Verificações na web nesta rodada: página da RYA sobre foguetes, MGN 77 (texto da Resolução IMO A.657(16)), Wärtsilä Encyclopedia (superfície livre), NOAA WOD 2018 (densidade de referência da água do mar), buscas por fonte oficial da regra dos doze avos.
- Testes: `node --check` em todos os JS editados; `python3 tools/build_questoes.py`; `node tools/validate.mjs` (todos os critérios passaram); `qa_shot` offline em 30 lições alteradas, desktop, e em 3 lições no celular com tema escuro (`mestre/m8/l3`, `m6/l3`, `m10/l5`): `console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`. As três lições, as figuras alteradas e a nota nova foram abertas no Chrome do sistema e conferidas na tela.

### Itens tratados (corrigidos)

1. **Explicações que citam letras de alternativas, com alternativas embaralhadas** (erro real: o aluno via "a alternativa B" apontando para outra opção). 8 questões de lição (`msa1-l15-1`, `msa2-m4l1-1`, `-m4l1-3`, `-m4l2-1`, `-m4l2-3`, `-m4l4-1`, `-m4l4-2`, `-m4l6-3`) e 5 do banco (mestre-0042, 0052, 0058, 0062, 0077) foram reescritas citando o conteúdo da opção. Varredura por script (letras, "última alternativa", "todas as anteriores") agora sem ocorrência.
2. **Alcance geográfico e refração (m6 l3, legenda da figura).** A lição repetia que a tabela da Lista de Faróis "já inclui a refração". O Apêndice B do Manual deduz D = 1,927 √H como horizonte geométrico (D = √(2HR), R = 6.368 km), sem refração, e depois afirma que a tabela feita com essa fórmula já aplica a refração normal. Inconsistência da fonte: nota nova na lição expõe as duas frases, diz que para a prova vale a bibliografia e que, na prática, o alcance é estimativa.
3. **Rosa da Carta Piloto (m6 l5, legenda).** Os percentuais do exemplo do Manual (18, 20, 12, 10, 20, 13, 7, 9 e 2% de calmaria) somam 111%. Legenda avisa que são leituras gráficas aproximadas, boas só como ordem de grandeza.
4. **Extrato fictício da Tábua das Marés (m8 l3, figura).** O dia 03 de março de 2026 aparecia como Lua nova, mas é Lua cheia (eclipse lunar de 3/3/2026); passou a "○ cheia". As horas do dia 10 contradiziam a regra de 50 min por dia ensinada na lição 1 (preamar 0826 no dia 3 e 0937 no dia 10); passaram a 0151, 0804, 1416 e 2029, coerentes com cerca de 5 h 50 min de atraso em 7 dias. Amplitudes e nível médio mantidos.
5. **"Três ou cinco eventos no dia" (m8 l3).** Cinco eventos não cabem em 24 h com intervalo de 6 h 12 min entre eles; corrigido para "três ou quatro".
6. **Corrente contra a entrada (m8 l6).** "Contra ela, uma entrada de 1 hora vira 3" era exagero (2 nós contra 6 nós na água dá 4 nós no fundo, 1 h 30). Corrigido, com a conta.
7. **Estofo (m8 l2).** Acrescentado que a corrente pode parar e inverter antes ou depois do estofo do nível, coerente com a lição 6.
8. **Folga com ondas (m8 l5).** A regra "metade da altura das ondas" ganhou a justificativa (o cavado fica H/2 abaixo do nível médio), o aviso de que o boletim dá a altura significante (as maiores ondas chegam a cerca de 1,9 vez) e a arrebentação com profundidade igual ou menor que 4/3 da altura (Manual vol. III, itens 42.1.1 e 42.1.2). As referências "boa prática" de três questões foram trocadas por fonte concreta (Manual vol. III 42.1.2 para corrente contra onda).
9. **Ventos do cíclone extratropical (m10 l4).** "S e SW no lado oeste e sul do centro" estava errado para o lado sul (circulação horária dá vento de E a SE ao sul do centro); passou a "atrás da frente fria, no lado oeste". **Ciclogênese explosiva:** "em menos de um dia" passou ao critério do Manual vol. III (cerca de 1 hPa por hora por mais de 24 h, da ordem de 24 hPa em um dia).
10. **Dica de sentido e época (m10 l5).** Dizia que descer o Nordeste é mais fácil no verão e que subir "evita a contravento" dos alísios; para o rumo geral 035° (Salvador a Recife) o alísio de 135° chega a 100° da proa, pelo través, e a perna difícil é a descida contra o alísio. Reescrita com o cálculo do ângulo.
11. **Contradição interna sobre caneta na carta (m1 l1 e flashcard m1-03).** "Nunca use caneta na carta" contradizia a correção de Aviso Permanente a tinta vermelha (m1 l4, m6 l6, flashcard m1-42). Ajustado nos dois.
12. **Selos "a confirmar" dos quatro textos reescritos.** Os fatos `extra-fechamento-am-04`, `-05`, `-06` e `-07` já estão confirmados em `claims_verified.json` e em `fontes.js`; os blocos e fontes de m9 l4, m13 l3, m14 l3 e m14 l4 foram religados a eles (antes: `extra-mestre-3-02`, `extra-arrais-3-43`, `normas-90`, `taxas-28`, cujos textos não batiam com o que a lição diz).
13. **Foguete: "dispare dois com intervalo de um minuto" (m12 l3, flashcard msa3-42).** Sem fonte. A RYA não fixa quantidade nem intervalo (página conferida) e a NORMAM-211 só fixa a dotação. Removido; incluído o aviso da RYA de não usar foguete com paraquedas com helicóptero por perto (URL na lista de fontes).
14. **Dica de iluminar a vela (m7 l5).** Sem fonte reconhecida (busca sem resultado). Trocada pelo texto da Regra 25(d) (veleiro com menos de 7 m sem luzes completas leva lanterna branca à mão).
15. **Homem ao mar (m12 l2, questão do banco 0157), conferido com `research/mob.md`.** Acrescentados: dizer de que bordo ele caiu, lançar tudo que flutue, alertar pelo rádio (canal 16 ou DSC) e a ressalva do US Sailing de que, com quatro tripulantes ou menos, pode não haver vigia exclusivo (fonte e URL na lista). A questão 0157 passou de "dois outros a bordo" para "três outros", para existir vigia de fato.
16. **Sino do fundeado com 12 m a menos de 20 m (banco 0193).** O gabarito (Regra 35(g)) vale, mas o veleiro da questão tem 14 m: explicação e referência passaram a citar a dispensa da Regra 35(i) (outro sinal sonoro eficiente a cada 2 min).
17. **Pequenos erros de redação e conta.** "retire todo o seguimento, tire todo o seguimento" duplicado (m7 l4); "quem é alcançado e discorda pode dar o sinal de dúvida" (m7 l5) virou "tem dúvida" (Regra 9(e)); "21°62′" na conta da declinação (m5 l5) virou "21°50′ + 12′ = 22°02′"; explicação da questão `m5l5-2` citava 21,0° W como resultado de conta que não existe; "A corrente de 120° vem perpendicular" (m5 l4) virou "flui"; explicação do doze avos com "1,4 m esquece de somar a BM a uma fração errada" (sem sentido) corrigida; explicação da questão 0131 tinha frases repetidas; legenda "ditas em francês aportuguesado" (m11 l3) virou "de origem francesa, ditas do mesmo jeito em qualquer idioma".
18. **Alternativa vaga em questão de escuta do VHF (m11 l1).** "No canal 70 (DSC), podendo ser o 16" passou a "No canal 70, se o rádio for DSC; no 16, se não for" (NORMAM-211 art. 4.23.4 a).
19. **Fontes.** Removida a fonte interna "research/programa_provas.md" (m14 l2), que o aluno não vê. Densidade da água do mar: acrescentada a referência da NOAA (WOD 2018, 1.025 kg/m³) e a Wärtsilä Encyclopedia para o efeito de superfície livre, mantendo a Wikipédia como fonte secundária declarada. Flashcard msa3-04 citava o Manual para a regra dos doze avos (o Manual não a traz): referência corrigida para "fonte não oficial". Fluxgate (m3 l17): acrescentado que o Manual descreve o procedimento "de modo resumido" e que vale o manual do fabricante. Referências "Boa prática..." (m8 l5, m8 l6, m10 l4, m12 l2, m12 l4, flashcard msa3-08) trocadas por fonte concreta ou por declaração honesta de que não há norma brasileira (momento de abandonar o barco).

### Itens que permanecem sem mudança (com justificativa técnica e fonte)

| Item | Justificativa |
|---|---|
| Porte da embarcação: art. 1.7 x Glossário da NORMAM-211 (m3 l14) | Conferido no texto local da norma (`normam-211.txt`, Glossário: "médio porte: comprimento inferior a 24 m, exceto as miúdas"; art. 1.7: "médio porte: mais de 12 m e menos de 24 m; pequeno porte: mais de 6 m e menos de 12 m"). A divergência é do texto da norma; a lição já mostra as duas divisões, traz o fato `normas-18` e manda perguntar à Capitania. Escolher uma delas seria inventar. |
| Regra dos doze avos com fonte não oficial (`tecnico-164`, m8 l4, questões 0123 a 0129) | Nova busca (RYA, UKHO/Admiralty, NOAA, RNLI) não achou fonte oficial que descreva a regra; só secundárias (Wikipédia, revistas náuticas). A regra foi verificada por cálculo contra a cossenoide (erro máximo de cerca de 1,6% da amplitude, tabela da lição), as Tabelas I e II e o Método Expedito seguem como métodos oficiais (Manual vol. I, 10.1.9 e 10.1.10), e a lição e o flashcard declaram a fonte como não oficial. |
| Resolução IMO A.657(16), ações imediatas na balsa (m12 l5) | Reconferida no texto reproduzido na MGN 77, Anexo 1, Parte A: cortar a boça, recolher sobreviventes, lançar a âncora flutuante, fechar as entradas, ler as instruções, na mesma ordem da lição. A regra das primeiras 24 h sem água não consta da IMO; a lição já a apresenta como regra tradicional e agora diz isso expressamente. |
| Cruzar esquema de separação "com a proa a 90°", não com o caminho no fundo (m7 l2, Q m7l2-1, flashcard msa2-52) | Regra 10(c) no texto inglês diz "on a heading as nearly as practicable at right angles"; a tradução do RIPEAM em cache diz "rumo". A lição explica a diferença e mantém a leitura. |
| Quatro sobreposições de figuras do fechamento anterior | Reabertas; a figura dos símbolos K (m1 l6) foi vista na tela, sem colisão visível. Mantida. |
| Figura do ciclone extratropical com a linha de oclusão simples (m10 l4) | Esquema simplificado e rotulado ("oclusa"). Geometria conferida: baixa horária, frente fria para NW com triângulos para NE, frente quente para leste com semicírculos para o sul (movimento polar no HS). Não induz erro de leitura. |
| "Força 6 já pede rizo" (m10 l6) | Orientação operacional do widget `beaufort` (escala do CHM, força 6 "muito fresco" e 7 "forte"), não fato regulatório; depende do barco e da tripulação, e a lição diz isso. |
| "Interpretação de trânsito" (m11 l4) | O programa da prova usa o termo sem defini-lo; a lição já avisa que é leitura própria. |
| Fórmulas de estabilidade (GM, GZ, superfície livre, peso movido) | Conferidas por cálculo nos exemplos (perda de GM de 0,25 m; 0,03 m com metade da largura; banda de 1,4° e 5,7°). São fórmulas de livro-texto; fonte primária de engenharia naval não está disponível localmente, por isso a lição mantém Wikipédia como fonte secundária, agora ao lado da Wärtsilä e do Manual vol. III, cap. 42. |
| Dados regulatórios dos blocos `fato` (NORMAM-211, Lista de Auxílios-Rádio, CHM, taxas, programa) | Cada bloco foi comparado com o claim em `claims_verified.json`; os que ainda dependem de OM ou de página institucional (CPBA, FAQ de Delegacia, INFOSAR) continuam rotulados como tais na lição. Nenhum fato regulatório sem `ref` foi encontrado. |

### Arquivos alterados nesta rodada

- `app/data/cursos/mestre-1.js`, `mestre-2.js`, `mestre-3.js`
- `app/data/flashcards/mestre-1.js`, `mestre-3.js`
- `research/_work/questoes/mestre-2.rev2.json`, `mestre-4.rev2.json`, `mestre-5.rev2.json` (e `app/data/questoes/mestre.js`, regenerado por `tools/build_questoes.py`)
- Este relatório
