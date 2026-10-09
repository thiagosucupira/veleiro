# Revisão técnica final do curso Arrais-Amador

Revisor: instrutor de vela e navegação (revisão técnica cética). Data: 2026-10-08.

## Escopo e método

- Lidas todas as lições: `app/data/cursos/arrais.js`, `arrais-1.js` (m1 a m4), `arrais-2.js` (m5 a m9) e `arrais-3.js` (m10 a m16), com figuras SVG, tabelas, fatos, blocos de questões e widgets.
- Lidos os três baralhos: `app/data/flashcards/arrais-1.js`, `arrais-2.js` e `arrais-3.js` (177 cartas).
- Lidas as 199 questões do banco `app/data/questoes/arrais.js` (o pedido era 40 sorteadas; o banco é pequeno e foi lido inteiro), com as 28 figuras.
- Conferido contra o texto local da NORMAM-211 (`research/acervo/normam-211.txt`, versão consolidada de 03/03/2026), o Manual de Navegação vol. III em cache (`research/_work/fontes_cache`), `research/claims_verified.json` e `docs/widgets.md`.
- Refeitas as contas (conversões, tempo/distância, regra do terço, marés pela regra dos doze avos, filame, alcance geográfico, marcações, tabelas de alcance das luzes) e conferidas as figuras pelas coordenadas e em captura de tela.
- Conferido o balizamento (Região B, numeração ímpar/par do Brasil, cardinais, canal preferencial), as luzes e marcas, os sinais sonoros e os parágrafos citados do RIPEAM.
- Após as correções: `python3 tools/build_questoes.py`, `python3 tools/build_manifesto.py`, `node tools/validate.mjs` (todos os critérios passaram) e `qa_shot` offline nas lições alteradas, desktop e celular: `console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`.

## Erros encontrados e corrigidos

### 1. Física errada em figura SVG: centro de carena do barco adernado (arrais m14 l1, rota `#/arrais/m14/l1`)

- Problema: com o barco adernado para a esquerda, o ponto B estava desenhado do lado alto (direita). O empuxo saía do lado errado, e o peso era desenhado em x=171, fora de G. O rótulo "braço de endireitamento" ficava cortado na borda da figura.
- Correção: B recalculado pelo centroide da parte submersa (fica do lado que afundou, à esquerda de G). O empuxo sobe de B, o peso desce de G e o braço de endireitamento é a distância horizontal entre as duas linhas. Rótulos reposicionados dentro da figura. O texto da lição já estava certo.

### 2. Física errada em figura SVG: superfície livre (arrais m14 l2, rota `#/arrais/m14/l2`)

- Problema: o líquido do tanque pela metade era um paralelogramo inclinado junto com o tanque (superfície inclinada), saía do contorno do tanque, era mais fundo do lado alto, e a seta mostrava o líquido correndo para o lado alto. Era o contrário do que a lição ensina.
- Correção: o líquido agora é recortado pelo contorno do tanque, com superfície horizontal (linha tracejada), mais fundo no lado baixo, e a seta aponta para o lado baixo. A legenda diz explicitamente que a superfície fica horizontal.

### 3. Texto que contradiz fato verificado com divergência (programa-47, programa-39, normas-67)

- Problema: as lições diziam, sem ressalva, que o treinamento prático inclui verificar o nível do tanque e demonstrar o abastecimento (item 2.8) e que cobre fulgor, ignição e abastecimento (itens 1.11 e 1.12). `claims_verified.json` registra que isso consta só do PDF consolidado; o arquivo de anexos mais recente da DPC termina em 2.7 e 1.10.
- Correção: arrais-1 m4 l2 (fato e fonte), arrais-3 m10 l1 (fonte), m10 l4 (parágrafo de abertura, fato, referência da questão e fonte) e referência da questão arrais-0122 do banco agora dizem "versão consolidada em PDF" e avisam para confirmar com a escola e na norma vigente. A parte técnica (vapor de gasolina mais pesado que o ar, ventilação por pelo menos 4 minutos, regras de abastecimento) continua valendo sem depender do item.

### 4. Fato do RLESTA com texto diferente da fonte (arrais-3 m15 l4, flashcard a3-51)

- Problema: "não possuir a habilitação exigida" (art. 12, I, grupo D) se confundia com "conduzir sem ser habilitado" (art. 11, grupo E). O texto da norma (art. 12, I) fala em "não possuir a documentação relativa à habilitação ou ao controle de saúde".
- Correção: o bloco `normas-168` e o flashcard a3-51 foram reescritos para separar as duas infrações.

### 5. Regra 17(a)(ii) apresentada como se o sinal de dúvida fosse condição para manobrar (arrais-2 m5 l3)

- Problema: "Antes, dê o sinal de dúvida" e "depois de dar o sinal" davam a entender que os cinco apitos são pré-requisito. A Regra 17(a)(ii) permite manobrar assim que fica claro que a outra não age; a 34(d) é aviso, não condição (a questão arrais-0048 do banco já dizia isso).
- Correção: texto da lista, figura (SVG da Regra 17), opção B e explicações das questões ara2-m5l3-2 e ara2-m5l3-3.

### 6. Conselho de segurança duvidoso: teste de descarga do extintor (arrais-3 m10 l3)

- Problema: o passo "faça um teste rápido ainda no lugar" gasta parte de um extintor portátil pequeno, que descarrega em poucos segundos, e não tem fonte.
- Correção: trocado por conferir o manômetro (faixa verde) e não gastar jato fora do fogo.

### 7. Afirmação sem apoio (arrais-1 m3 l5)

- "A maior parte dos acidentes graves ... acontece perto da praia" virou "Muitos acidentes graves ..." (o Anexo 4-B 3.1 fala em abalroamentos, na maioria, e cita pessoas nas praias, mas não dá a proporção).

### 8. Questão do banco (`research/_work/questoes/arrais-1.rev2.json`, arrais-0035)

- A referência trazia "fato ainda a confirmar" no texto. Removido (o selo já é gerado pelo app). `build_questoes.py` rodado.

## Conferido e mantido (sem erro)

- Conversões de rumo e marcação (Mv = Mr + rumo, polar a bombordo = 360° menos o valor), exemplo da DHN (20° W, Rag 085°, Dag 5° E, Rmg 090°, Rv 070°), setores das luzes (225°, 112,5°, 135°, 22,5°), alcances da Regra 22, geometria das figuras de luzes, setores e Regra 12 (retranca), canal estreito (cada um pelo seu boreste), efeito de passo (passo à direita: atrás, popa para bombordo), leme (cana ao contrário da roda), espringues e lançantes, MOB (leme para o bordo da queda; curva de Williamson 60° e 20°), tetraedro do fogo, classes e extintores B-1 (arts. 4.27 e 4.36), numeração do balizamento brasileiro (encarnados ímpares, verdes pares, confirmado na NORMAM-601 em `conteudo_tecnico.md`), cardinais (topes, cores e luzes 3, 6+longo, 9), canal preferencial, perigo isolado, águas seguras, alcance geográfico (1,927), marés (12 avos, NR, sondagem + altura), vento aparente (triângulo de velocidades), dotações por área (arts. 4.13 a 4.19, 4.22 a 4.24, quadros 4.33 a 4.36), prova (40 questões, 2 h, 5,0), validade da CHA, alcoolemia (0,25 mg/L) e Anexo 5-F (itens 01 a 15).
- Tabela Beaufort do m9 l5: as alturas de vaga (1,5; 2,4; 3,6; 4,8 m nas forças 4 a 7) batem com a Tabela 45.1 do Manual de Navegação vol. III (conferido no cache). Elas diferem das "alturas prováveis" da OMM usadas no widget `beaufort`; a legenda da lição já explica a diferença. Mantido.
- "Cabeceio" como guinada da proa e "caturro" como arfagem: coerente com o Manual vol. III (item 42.4) e com o programa da prova.
- Todas as opções dos widgets (`opts`) conferem com `docs/widgets.md`. Todas as 199 questões do banco têm gabarito correto e uma só alternativa certa.

## Pendências (nada impede a publicação)

| Arquivo | Rota ou item | Gravidade | O que fica |
|---|---|---|---|
| `app/data/cursos/arrais-3.js` | m13 l1 | baixa | A cobertura da área A1 do GMDSS é dada como "cerca de 30 a 50 milhas", segundo o material da Anatel. Fontes da IMO costumam citar 20 a 30 milhas. O texto atribui o número à Anatel; vale revalidar com a fonte oficial. |
| `app/data/cursos/arrais-3.js` | m11 l1 | baixa | "Colete inflável não é recomendado para menores de 12 anos" vem da Transport for NSW (Austrália). Não há equivalente brasileiro verificado; ler como orientação geral. |
| `app/data/cursos/arrais-2.js` | m9 l4 | baixa | A regra prática "vento N ou NE passando a soprar de S ou SE = tende a piorar" é transcrição da Tabela 45.8 do Manual. Fica sem explicação própria porque a direção da rondada depende da frente. |
| `app/widgets/boias-iala.js` (cabeçalho) | doc de `widgets.md` | baixa | Cita a Lista de Faróis 34ª ed. (2014-2015), enquanto os cursos citam a 40ª (2026-2027). Os valores usados conferem; só a citação da edição destoa. Dono do arquivo: autor do widget. |
| `research/claims_verified.json` | `normas-168` | baixa | A frase do `claim` ("não possuir a habilitação") difere da citação literal (art. 12, I: "não possuir a documentação relativa à habilitação ou ao controle de saúde"). O texto do app foi alinhado à citação; sugere-se ajustar o `claim`. |
| `app/data/cursos/arrais-1.js` | m3 l4 (fundeio) | baixa | A regra de filame com cabo (5 a 7 vezes) coincide com o Anexo 4-B, item 6 da NORMAM-211, mas a lição a apresenta como regra prática, sem bloco `fato`. Para promover a fato, é preciso incluir o item no `claims_verified.json` (arquivo fora do escopo). |

## Arquivos alterados

- `app/data/cursos/arrais-1.js`, `arrais-2.js`, `arrais-3.js`
- `app/data/flashcards/arrais-3.js`
- `research/_work/questoes/arrais-1.rev2.json`, `arrais-4.rev2.json` (somente o campo `referencia`) e, por consequência, `app/data/questoes/*.js` regenerados por `tools/build_questoes.py`
- Este relatório

## Pendências resolvidas (fechamento)

Fechamento de 2026-10-08. Validação: `node --check` nos arquivos de dados, `node tools/validate.mjs` (todos os critérios passaram) e `qa_shot` offline, desktop e celular escuro, nas lições alteradas: `console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`. Fatos novos a verificar estão em `research/_work/research_extra_fechamento-am.json` (ids `extra-fechamento-am-01` a `07`). Nenhum bloco `fato` aponta para esses ids ainda: o `validate.mjs` recusa referência a fato que não está em `fontes.js`, e o selo só aparece depois da verificação.

| Pendência | Situação | O que foi feito ou por que fica |
|---|---|---|
| arrais-3 m13 l1, área A1 do GMDSS "30 a 50 milhas" | Resolvida | O texto agora define a A1 pela cobertura (VHF de uma estação costeira, com alerta DSC contínuo) e dá as milhas como ordem de grandeza, com as duas fontes da Anatel: página sobre o GMDSS (cerca de 20 milhas, reaberta e citada hoje) e material de apoio ao exame (30 a 50). Explica que os números diferem porque a área real depende das estações costeiras de cada país. Mesmo tratamento do curso de rádio (`radio-1.js`). Link da página da Anatel incluído nas fontes; fato registrado como `extra-fechamento-am-01`. A página da IMO não abriu (erro 500), então não foi usada como fonte. |
| arrais-3 m11 l1, colete inflável abaixo de 12 anos | Resolvida | Busca no texto consolidado da NORMAM-211: a norma só exige coletes de tamanho pequeno para crianças (art. 4.14) e não trata de colete inflável para criança. O texto agora diz isso e apresenta os 12 anos como orientação estrangeira (Transport for NSW, citação literal conferida hoje), com a recomendação prática de usar espuma e ler o manual do fabricante. Outras autoridades usam limites diferentes (por exemplo, a Guarda Costeira dos EUA fala em 16 anos), por isso não se apresenta número único como regra. Fato registrado como `extra-fechamento-am-02`; a fonte na lista ficou marcada como estrangeira. |
| arrais-2 m9 l4, regra "vento N ou NE passando a S ou SE" | Resolvida | Conferida a Tabela 45.8 no Manual: a regra existe, mas o Manual não dá sentido de giro. A tabela do curso também pareava linhas sem relação (a rondada ao lado de "três a seis horas depois da frente"). Tabela refeita, com a regra espelhada que faltava ("vento rondando de S ou SW para N ou NE" melhora) e a legenda avisando que cada linha traz um sinal de cada lado. Novo quadro "Como ler as regras da rondada" explica que o sentido depende de onde está a frente e separa isso da passagem típica da frente fria (NW para SW), ensinada acima. Nada acrescentado além do que o Manual diz. |
| `app/widgets/boias-iala.js`, edição da Lista de Faróis (34ª x 40ª) | Mantida | O arquivo é do autor do widget e fora dos arquivos atribuídos a este fechamento. Os valores usados conferem; só a citação da edição no cabeçalho destoa e não aparece para o aluno. Os cursos arrais e mestre citam a 40ª (2026-2027), confirmada em `tecnico-140`. Fica para o dono do widget trocar a citação. |
| `claims_verified.json`, `normas-168` (frase do `claim`) | Resolvida no que cabe | O arquivo está fora do escopo e não foi editado. O texto do app já segue a citação literal (art. 12, I). A redação corrigida do claim foi registrada para verificação como `extra-fechamento-am-03`. Quando for aprovada, basta trocar o `ref` do bloco em arrais-3 m15 l4. A frase sobre o art. 11 (grupo E) continua apoiada em `normas-145`. |
| arrais-1 m3 l4, filame com cabo como "regra prática" sem bloco `fato` | Resolvida | Já existe fato confirmado para isso: `extra-vela-2-01` (Anexo 4-B, item 6 da NORMAM-211, "cinco a sete vezes a profundidade local", citação conferida literalmente no texto consolidado). Nenhum fato novo foi necessário. A lição ganhou o bloco `fato` e a fonte com `ref`. O parágrafo da regra prática agora separa as faixas: 5 a 7 vezes com cabo é o Anexo 4-B; 3 a 5 vezes com amarra segue como regra de marinharia (Arte Naval). O flashcard a3 `a1-41` cita o Anexo 4-B na referência. |

### Arquivos alterados neste fechamento

- `app/data/cursos/arrais-1.js` (m3 l4), `arrais-2.js` (m9 l4), `arrais-3.js` (m11 l1, m13 l1)
- `app/data/flashcards/arrais-1.js` (referência do cartão `a1-41`)
- `research/_work/research_extra_fechamento-am.json` (novo)
- Este relatório

## Revisão final (ponta a ponta)

Revisor: instrutor de vela e navegação (Capitão-Amador, Yachtmaster Ocean), revisão cética. Data: 2026-10-09. Pedido: ler o curso inteiro, sem amostragem, e tratar todo erro; onde há divergência legítima entre escolas, dizer no texto a fonte de cada lado.

### Escopo e método

- Lidas, do início ao fim, as 83 lições dos 16 módulos (m1 a m16) (`arrais-1.js`, `arrais-2.js`, `arrais-3.js`), com cada bloco `fato` impresso ao lado do `claim` e da `quote` de `research/claims_verified.json`; os 177 cartões (`flashcards/arrais-1.js` a `-3.js`); as 199 questões do banco (`research/_work/questoes/arrais-1.rev2.json` a `-5.rev2.json`) e as questões embutidas nas lições.
- Renderizadas e conferidas no Chrome as 95 figuras SVG (67 das lições e 28 do banco), em claro: lados de bordos, luzes, cardinais, esquema do vento nos veleiros, efeito de passo, cabos de amarração, curva de maré, vetores do vento aparente e o binário peso/empuxo. Nenhuma figura tem erro de física, de lado ou de geometria; as falhas achadas foram uma legenda com regra errada e um rótulo cortado (itens 10 e 24).
- Contra a fonte primária local: texto consolidado da NORMAM-211 (`research/acervo/normam-211.txt`: arts. 1.7, 1.8, 3.27, 4.3, 4.6, 4.8 a 4.19, 4.27, 4.36, 5.4, 5.5, 7.8 a 7.12; Anexos 4-A, 4-B, 4-C, 5-A, 5-F) e da NORMAM-212 (prova de Motonauta); RIPEAM consolidado em português (Regras 9, 10, 12 a 35, Anexos I, III e IV); Manual de Navegação vols. I e III em cache (itens 8.9 e 45.1; Tabela 45.8; trecho sobre frentes frias); `research/mob.md` ponto a ponto (alerta, flutuação, vigia, MOB, motor em neutro, quick-stop, lado de recolhimento, içar na horizontal).
- Conferência automática: todo número de cada bloco `fato` contra o texto do `claim`/`quote` (achou 1 número sem apoio, item 12); toda lista de fontes sem URL (achou 8 livros, item 8); `node --check` nos arquivos de dados editados; `python3 tools/build_questoes.py`; `node tools/validate.mjs` (todos os critérios passaram); `qa_shot --offline` nas 24 lições alteradas, desktop e celular escuro (`console: []`, `pageerrors: []`, `externas: []`, `overflowX: false`).
- Fontes externas reabertas hoje, quando uma afirmação de segurança dependia delas: BoatUS Foundation (ancoragem, água fria, testes de queima de barcos), US Coast Guard (ajuste de colete), RYA (colete de flutuação), Transport for NSW (pessoa ao mar, naufrágio, alerta), St John Ambulance (afogamento e engasgo), IMO A.893(21), McGill (1-10-1), Pennsylvania Fish and Boat Commission, NOAA/NCEI (declinação).

### Itens tratados (corrigidos)

1. **Tradição dos cabos (m2 l1).** O texto dizia que a bordo só existe "uma corda: a do relógio". A tradição da Marinha são duas, a do sino e a do relógio ("Corda, somente, de relógio ou do sino", Capitão dos Portos do ES, PortoGente). Texto e fonte (com URL) corrigidos.
2. **Nó de oito e cabo da âncora (m2 l3).** O quadro "Exceção ao batente" mandava não pôr nó de oito no cabo da âncora "que você pode ter de largar" e atribuía às regatas uma regra sem fonte. Isso contradizia a tabela da lição 4 do módulo 4 ("cabo ou amarra amarrado ao barco pelo chicote") e a boa prática. Reescrito: o batente só trava, não prende; a ponta de dentro do cabo de fundeio fica amarrada ao barco; largar a âncora sem prender o cabo é erro comum (BoatUS Foundation, *Anchoring & Mooring*).
3. **Efeito de passo e saildrive (m3 l2).** A frase "no saildrive costuma ser menor" não tinha fonte. Trocada por: força e até o sentido variam de barco para barco, por isso vale o teste do próprio barco, já descrito na lição.
4. **Filame (m3 l4, cartão a1-41, questão arrais-1 nº 27 do lote 1).** A regra "3 a 5 vezes com amarra de corrente" era dada como "regra de marinharia" sem fonte. O Manual de Navegação vol. I (item 8.9, fundeio de precisão) dá 5 a 7 vezes para a amarra e o Anexo 4-B, item 6, 5 a 7 vezes para cabo; a BoatUS Foundation recomenda 7:1 e só aceita 5:1 com âncora leve, barco pequeno e bom tempo. Lição, cartão e questão agora usam 5 a 7 vezes, com as três fontes e URL; a questão virou "menor filame na faixa de 5 a 7 vezes": 25 m (antes, 15 m com a regra sem fonte).
5. **Cabo de fundeio (m3 l4).** Faltavam dois cuidados de segurança com fonte já verificada: o Anexo 4-B, item 6, manda não amarrar o cabo de fundeio perto do motor (fato `extra-vela-2-02`, agora usado), e a ponta de dentro do cabo deve estar presa ao barco antes de arriar a âncora (passo novo na lista, BoatUS).
6. **Homem ao mar (m3 l6).** (a) O botão MOB marca só onde a pessoa caiu; a busca precisa contar com a deriva (US Sailing, `mob.md` S2): acrescentado. (b) Ao jogar a boia com retinida, o chicote da retinida não é amarrado ao barco (NORMAM-211, art. 4.15), então quem joga o segura: acrescentado.
7. **Boia salva-vidas (m4 l4, tabela de conferência).** A tabela mandava a retinida "presa ao barco", o oposto do art. 4.15 da NORMAM-211 (o chicote da retinida não deve estar amarrado à embarcação), que a lição m11 l2 já cita. Corrigida a tabela.
8. **Livros sem URL (m1 l6, m2 l2 a l6, m3 l2 e l3).** Oito itens de fonte (Ashley, *The Ashley Book of Knots*; Rousmaniere, *The Annapolis Book of Seamanship*) estavam sem link. Incluídos os links da página do livro na Penguin Random House e na Open Library.
9. **Guinada "de 30° ou mais" (m5 l3).** O quadro "Mostre o costado" dava um número sem fonte. Passou a citar a Regra 8(b) ("ampla o bastante para ser percebida") e tirou o número.
10. **Regra 18(e) e (f) e legenda da escada (m5 l6).** A frase "nave de voo rasante... se houver risco, cumprem as regras" valia só para o hidroavião; a nave de efeito de solo na superfície segue as regras como embarcação de propulsão mecânica (18(f)). Corrigido. A legenda da figura citava "Regra 8(f)" onde a passagem da restrita pelo calado é a Regra 18(d).
11. **Duas luzes de mastro (m6 l5).** O método dizia "Duas: provavelmente 50 m ou mais". Rebocador também mostra duas (Regra 24(a)). Acrescentado.
12. **Número sem apoio dentro de bloco `fato` (m8 l4).** O bloco `tecnico-123` (boia de destroços de emergência) trazia "1 s de cada cor, 0,5 s de escuridão", que não consta do `claim` nem da `quote` verificados. Tirado do bloco; ficam só as listras, o tope e a luz alternada.
13. **Limite de vento "força 4/5" (m9 l5; legenda do widget em m14 l4).** "Força 4 já é bastante; força 5 ou mais, só com instrutor" era regra sem fonte. Trocado por: definir o limite com o instrutor, lembrando que o aviso da Marinha só vem a partir da força 7 (`travessia-96`), mas barco pequeno sofre antes.
14. **Declinação (m9 l1).** "Na casa das dezenas de graus" foi trocado por valores medidos: em 2026-10-09 o modelo da NOAA dá 14,5° W no Chuí, 17,8° W em Porto Alegre, 20° W em Fortaleza e Belém, 21° W em Recife, 22° W em Santos e 23° W no Rio e em Salvador. Fonte e URL incluídas; o texto continua mandando usar o valor da carta.
15. **Estatística sem origem (m10 l4).** "Grande parte dos incêndios... durante ou logo depois do abastecimento" agora diz de quem é: Guarda Costeira dos EUA, citada pela Pennsylvania Fish and Boat Commission (documento aberto hoje, a frase está lá).
16. **Teste de ajuste do colete (m11 l1, questão a3-m11-l1-3).** O teste de puxar pelos ombros estava atribuído à Transport for NSW, e nenhuma das duas páginas dela o descreve. Duas fontes o descrevem, com critérios diferentes, e o texto agora diz as duas: Guarda Costeira dos EUA (colete de espuma justo não sobe acima do queixo ou das orelhas) e RYA (colete de flutuação que levanta mais de 50 mm é grande demais). Referência e fontes com URL.
17. **Roupa na água fria (m11 l4, questão arrais-4 nº 23 do lote 4).** "Mantenha a roupa" também estava atribuído à Transport for NSW, cuja página não diz isso. A fonte que diz é a BoatUS Foundation, *Cold Water* ("Do not remove clothing"; a água presa na roupa se aquece; nadar pode reduzir o tempo de sobrevivência em quase 50%). Texto e fonte trocados.
18. **Pronúncia de MAYDAY (m13 l4).** O quadro dava "medê"; o material da Anatel diz que se pronuncia como a expressão francesa "m'aider" (e registra "medé" só para o espanhol). Texto ajustado.
19. **"A maioria dos acidentes" (m14 l4).** Afirmação sem número nem fonte; passou a "muitos acidentes".
20. **Prazo de pagamento da GRU (m16 l1).** A lição dizia que a guia "só pode ser paga depois de um dia útil" (aviso geral do sistema de GRU), enquanto a lição 3 do mesmo módulo cita a Capitania da Bahia: Pix e cartão logo após gerar, só o boleto espera 24 h. Divergência agora explícita na lição 1, com os dois fatos (`taxas-21` e `taxas-22`) e a recomendação de seguir o que o sistema mostra e confirmar na Capitania.
21. **Aproximação final com lancha (questão arrais-1 nº 22 do lote 1).** A questão tratava como única uma prática que tem escola contrária (Power & Motoryacht, 2014; `mob.md` S10). Enunciado agora diz "prática mais ensinada"; a explicação traz o outro lado.
22. **Engasgo (questão arrais-4 nº 30 do lote 4).** A ordem "5 golpes nas costas, depois 5 compressões abdominais" é a do St John Ambulance (página aberta hoje) e a da AHA desde outubro de 2025 (segundo o CBMPR); materiais antigos começam pela manobra de Heimlich. Enunciado cita a fonte; explicação cita a divergência com material antigo.
23. **Cartões.** a1-41 (filame, item 4); ar2-16 (sem governo e manobra restrita não têm ordem entre si na Regra 18(a); estavam numa fila); ar2-24 (luz de fundeio: uma com menos de 50 m, duas a partir de 50 m, em vez de "se for maior"); ar2-41 (cartão sem campo `ref`); ar2-47 (declinação é a diferença entre os nortes, e não "erro do campo"); a3-27 (HELP: referência passou de "Cruz Vermelha" para a Transport for NSW e a BoatUS, que a descrevem); a3-36 (o número 185 é do SALVAMAR; a referência dizia "NORMAM-211").
24. **Banco, ajustes de referência e figura.** arrais-1 nº 38 e nº 39 (sem URL: IMO A.893(21), item 1.3, conferido, e NORMAM-211); arrais-3 nº 39 (referência cita também o Anexo 4-B, item 6); arrais-4 nº 3 (o eixo da escala de temperatura cortava o rótulo "60 °C"; `viewBox` ampliado).

`tools/build_questoes.py` foi rodado de novo; o banco continua com 199 questões, uma só alternativa correta em cada.

### Itens do relatório anterior (pendentes ou mantidos), reavaliados

| Item | Situação | Justificativa técnica |
|---|---|---|
| Cobertura A1 do GMDSS (m13 l1), 20 milhas × 30 a 50 milhas | Mantido | O texto define a A1 pela cobertura (VHF de estação costeira com alerta DSC contínuo) e dá as milhas só como ordem de grandeza, citando as duas páginas da Anatel; a definição por cobertura, que cada país fixa, é a da Convenção SOLAS, cap. IV, regra 2. A página da IMO segue fora do ar hoje (HTTP 500), então não foi usada como fonte. |
| Colete inflável e crianças (m11 l1) | Mantido | A página da Transport for NSW foi reaberta hoje: "Inflatable lifejackets are not recommended for children aged under 12 years". O texto já a apresenta como orientação estrangeira, avisa que a NORMAM-211 só pede tamanho pequeno (art. 4.14) e manda ler o manual do fabricante. |
| Tabela 45.8 e regra de rondada (m9 l4) | Mantido | As duas linhas ("o vento N ou NE passa a soprar do S ou SE" piora; "o vento ronda de S ou SW para NE ou N" melhora) estão literais no Manual de Navegação vol. III, Tabela 45.8. O quadro "Como ler as regras da rondada" já separa essas regras gerais da passagem típica da frente fria (NW para SW, anti-horário no Hemisfério Sul), que a questão arrais-3 nº 30 do lote 3 trata corretamente. |
| `app/widgets/boias-iala.js` (edição da Lista de Faróis) | Parcialmente resolvido por terceiro, resta defeito | O cabeçalho já cita a 40ª edição. Duas frases visíveis ao aluno ainda dizem que a boia de destroços "não aparece na 34ª edição" e a marcam "a confirmar no Brasil" (linhas 676 e 959). Isso contradiz o fato verificado `tecnico-125`, que mostra a boia azul e amarela no quadro "Novos Perigos" da Lista de Faróis 2026–2027, e a lição m8 l4. Não editei porque o arquivo não é meu; fica para o dono do widget trocar "34ª" por "40ª (2026–2027)" e retirar o selo. |
| `claims_verified.json`, `normas-168` | Mantido | O `claim` ("não possuir a habilitação") difere da `quote` literal do RLESTA, art. 12, I ("não possuir a documentação relativa à habilitação ou ao controle de saúde"). A lição e o cartão a3-51 seguem a `quote`. Quem mantém o arquivo deve alinhar o `claim`; a correção já está proposta em `research_extra_fechamento-am.json` (`extra-fechamento-am-03`). |
| Regra de filame com cabo sem bloco `fato` (m3 l4) | Resolvido e ampliado | O bloco `extra-vela-2-01` está na lição; a faixa da amarra e a regra de 3 a 5 vezes foram corrigidas (item 4). |

### Itens lidos e mantidos sem mudança (com a razão técnica)

- **Cone de dia de quem veleja motorando, sem ressalva para menos de 12 m (m3 l1, m5 l1, m6 l2, cartões a1-32 e ar2-23).** O texto consolidado do RIPEAM em português, Regra 25(e), exige a marca sem exceção por comprimento. A ressalva "menos de 12 metros não é obrigado, mas pode" existe nas Regras de Navegação interior dos EUA (33 CFR 83.25(e), conferida hoje) e não no texto brasileiro, que é o que vale na prova.
- **Alturas das vagas na tabela Beaufort (m9 l5).** Batem com a Tabela 45.1 do Manual vol. III, que difere dos valores prováveis da OMM; a legenda da lição já avisa.
- **"Cabeceio" para guinadas da proa e "caturro" para arfagem (m14 l3, questão arrais-4 nº 35 do lote 4).** São os termos do Manual vol. III (itens 42.3 e 42.4) e do programa da prova (Anexo 5-A, 3.1 i).
- **Prova de Arrais (40 questões, 2 h, nota 5,0), materiais permitidos e GRU não reaproveitável (m16 l4, questões arrais-5).** Anexo 5-A, itens 3 b), c), d) e g). O de Capitão tem 4 h (item 1 b), o de Mestre 3 h (item 2 c) e o de Motonauta, 20 questões em 1 h 30 (NORMAM-212, Anexo 3-C, Seção I, item 1 b), como dizem as explicações.
- **Pré-requisito para Mestre: CHA de Arrais válida, sem tempo mínimo (questão arrais-5 nº 8 do lote 5, m15 l2).** Art. 5.4.1, notas ("possuir habilitação na categoria de Arrais-Amador, dentro da validade").
- **Exceção da prova oral para candidato analfabeto em local remoto (art. 5.4.2 a)).** Não entra na lição 3 do módulo 16 porque a lição só pode afirmar fato regulatório com bloco `fato` e esse trecho não tem fato verificado; não afeta o aluno típico. Sugestão ao dono do `claims_verified.json`.
- **Art. 4.3.7 (manter distância de embarcação com bandeira Alfa ou bandeira encarnada com transversal branca, de mergulhadores).** A lição m3 l5 só diz "procure a bandeira de mergulho" e o RIPEAM 27(e) cobre a bandeira "A"; o art. 4.3.7 é omissão, não erro, e citá-lo exige um fato novo, que não posso criar nos arquivos atribuídos. Sugestão ao mesmo dono.
- **Regra 12 e balão ou gennaker (m5 l5).** "Balão e gennaker não entram na conta" decorre do texto da Regra 12(b), que define o bordo pela vela grande (ou pela maior vela de pano e carangueja, no aparelho redondo).
- **HELP com braços cruzados no peito (m11 l4, cartão a3-27, questão arrais-4 nº 18).** A Transport for NSW descreve joelhos ao peito com os braços em volta dos joelhos; a lição já diz "abrace-os (ou cruze os braços sobre o peito)", e a questão não traz outra postura certa.
- **Lição 5 do módulo 6 e questão arrais-2 nº 7: marcação "grudada" e distância.** As figuras de marcação constante respeitam a geometria (linhas de visada paralelas); a da questão arrais-2 nº 7 não está em escala de velocidade (B a 20 nós está mais perto do cruzamento do que a razão 20:12 pediria), mas o enunciado dá a marcação como constante e a resposta não depende da escala.

### Verificação final

- Lições abertas no navegador ao final (Chrome headless, `file://`, desktop claro com página inteira; o mesmo conjunto em celular escuro): `#/arrais/m3/l4` (fundeio, com o novo texto de filame e os dois fatos do Anexo 4-B), `#/arrais/m3/l6` (homem ao mar, com a figura, o texto novo e o widget `manobras` em "Homem ao mar" e "Parada rápida") e `#/arrais/m11/l1` (colete, com o teste de ajuste e as fontes novas). Sem erros de console, sem exceções, sem requisições externas e sem rolagem horizontal.
- `node --check` nos oito arquivos de dados editados; `python3 tools/build_questoes.py`; `node tools/validate.mjs`: todos os critérios passaram.

### Arquivos alterados nesta revisão final

- `app/data/cursos/arrais-1.js`, `arrais-2.js`, `arrais-3.js`
- `app/data/flashcards/arrais-1.js`, `arrais-2.js`, `arrais-3.js`
- `research/_work/questoes/arrais-1.rev2.json`, `arrais-3.rev2.json`, `arrais-4.rev2.json` e, por consequência, `app/data/questoes/*.js` regenerados por `tools/build_questoes.py`
- Este relatório
