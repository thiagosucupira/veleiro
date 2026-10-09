# QA: widgets A (luzes, sons, regras, balizamento, ritmos, nós, carta, agulha, marés, sextante, reta de altura) (2026-10-08)

Escopo: os 11 widgets abaixo, montados em `#/lab/<nome>` (e com as opções usadas nas lições). Arquivos meus:
`app/widgets/<nome>.js` e `app/assets/css/widgets/<nome>.css`.

`ripeam-luzes`, `sinais-sonoros`, `regras-governo`, `boias-iala`, `ritmos-luz`, `nos`, `carta-nautica`, `agulha-calc`,
`mares`, `sextante`, `reta-altura`.

## Como foi testado
- `tools/qa_shot.py --offline` nas 11 rotas (base) e um auditor Playwright próprio (Chrome do sistema, `file://`, rede externa
  abortada) em dois perfis: **celular escuro 390 px** e **desktop claro 1440 px**. Para cada widget, em cada aba e modo
  (explorar, desafio/exercício), o auditor mede: erros de console e de página, requisições externas, rolagem horizontal da
  página, tamanho **efetivo** do texto na tela (inclui texto SVG, já multiplicado pela escala do `viewBox`) e sobreposição
  entre textos.
- Fluxos de ponta a ponta com cliques: todos os tipos/cartões/abas, todas as embarcações e opções do `ripeam-luzes`, os 4
  grupos e os 25 sinais do `sinais-sonoros` (com áudio real), todos os 9 nós passo a passo, porto "decidir" e "conduzir" e
  desafio do `boias-iala`, 7 tipos de exercício da carta, 6 de agulha, 6 de marés, abas e exercícios do sextante e da reta
  de altura.
- **Limpeza ao sair**: depois de iniciar animação/áudio e trocar para `#/roteiro`, em todos os 11 widgets, 0
  `requestAnimationFrame` em 2 s, 0 `<canvas>` e 0 `setInterval` pendentes; o `AudioContext` do `sinais-sonoros` fica `closed`.
- Resultado final (celular escuro e desktop claro, `--offline`): `console: []`, `pageerrors: []`, `externas: []`,
  `overflowX: false` nos 11 widgets. Texto efetivo abaixo de 12 px: nenhum, exceto as exceções listadas em "Pendências".
- `node tools/validate.mjs`: "OK: todos os critérios passaram". (Não mexi em dados.)

## Conferência técnica (feita à mão, contra o que o widget exibe)
| Widget | O que foi conferido | Resultado |
|---|---|---|
| ripeam-luzes | Setores da Regra 21 (mastro 225°, bordos 112,5°, alcançado 135°, circulares 360°) para as 17 situações, em 13 aspectos; alcances da Regra 22 (comprimento ≥ 50 m, 12 a 50 m, < 12 m); luzes e marcas das Regras 23 a 28 (vela, vela e motor, arrasto verde sobre branca, pesca vermelha sobre branca, reboque 2/3 luzes e amarela de reboque, manobra restrita vermelha-branca-vermelha, hovercraft) | Corretos. Só diverge da regra estrita nos 3° de transição de 111/114° e 246/249°, que são o corte prático do Anexo I, Seção 9 (intencional, mostrado como "no limite"). |
| sinais-sonoros | Regras 34 (1, 2, 3, 5+ curtos; 2 longos+1 ou 2 curtos; longo-curto-longo-curto; curva), 35 (a, b, c/d, e, g, h, i, k), 37 e Anexo IV; tabela da Regra 33 e Anexo III (frequências e alcances por comprimento) | Corretos. |
| regras-governo | Regras 12(a)(i-iii), 13 (22,5° por ante a ré), 14 (e dúvida), 15, 16, 17(c), 18(a-d). 360 cenários sorteados + 6 iniciais: todos com risco e com quem manobra definido. Cruzados: A rumo 000, B de leste → A cede (Regra 15). Veleiros mesmo bordo: barlavento cede. | Corretos. |
| boias-iala | Região B: bombordo verde/boreste encarnado; preferencial a boreste = verde com faixa encarnada, Fl(2+1) G; cardinais (cones, cores, Q / Q(3) / Q(6)+LFl / Q(9)); perigo isolado Fl(2); águas seguras Iso/Oc/LFl 10 s/Mo(A); especial amarelo X; naufrágio Bu/Y. Somas dos períodos dos 12 exemplos reais (ex.: Q(3) 10 s = 1+1+8) | Corretos. |
| ritmos-luz | `VL.luz.analisar` em 19 notações (carta e Lista de Faróis, grupos, composta, setores, alternada); para 20 características a soma das fases = período. Fl < 50/min, Q 50-79, VQ 80-159, UQ 160-299. Fórmula D = 1,927 (√H + √h): 60 m e 5 m dão 19,2 M (confere com a Lista, em `research/`). | Corretos. |
| nos | Passos e mnemônicos de lais de guia, oito, direito/torto, fiel, volta redonda, escota, escota dobrado, cunho; usos recomendados no desafio. Modo `debug` roda sem cruzamentos duvidosos. | Textos corretos. Números ABoK: ver Pendências. |
| carta-nautica | Mercator (R = 3437,7468′), loxodromia, destino. Exercícios: **rumo/dist** Boia 1 a Boia AS = 180°, 2,1 M (ok); **estima** 8 kn por 45 min no 123° = 6,0 M, 3,3′ ao sul, 5,5′ a leste (23°52,2′S 044°11,3′W → 23°55,5′S 044°05,8′W, ok); **corrente** (5,5 kn, corrente 090° a 1,2 kn, Rfd 359,5°): RN = 347°, vfd = 5,4 kn (ok; também 6 kn/Rfd 090/corrente 180° a 2 kn dá RN 070,5°, vfd 5,66); **duas marcações** (Mv 044° e 178°) conferem com a posição da solução (erro < 0,5′); **marcação dobrada** 30°→60° com 2,9 M = distância ao objeto. | Corretos. |
| agulha-calc | Rv = Rmg + Dec, Rmg = Rag + Dag (E +, W −). Exemplo 1: Rag 101°, Dec 14°45′W (2020) +7′W/ano em 2026 = 15°27′W, Dag +3,6°E, Rmg 104,5°, **Rv 089°**. Exemplo 2: Rv 107°, Dec 14°50′W (2017) com 2′E/ano em 2026 = 14°32′W, Rmg 121,5°, Dag 3°E, **Rag 118,5°**. Declinação em 2024 (23°10′W de 2015, 9′W/ano) = 24°31′W. Marcação inversa e por alinhamento idem. | Corretos. |
| mares | Cosseno (Tabelas I/II) e doze avos (1-2-3-3-2-1). Exemplo 1: BM 1020 (0,1 m) a PM 1630 (3,4 m), 1215 → 0,83 m (conferido: 0,1 + 3,3 × 0,220). Exemplo 2: PM 1630 (3,4) a BM 2241, 2050 por doze avos → 0,73 m (4,2 horas de maré, 9,4/12). Necessária = calado + folga − sondagem (sublinhado entra negativo): 1,9 + 0,3 + 0,6 = 2,80 m. Janela: acos(−0,333) = 109,5° → 1439. Lua: nova em 10/10/2026, idade 27,4 d em 08/10. | Corretos. |
| sextante | Dip 1,76′√h, refração de Bennett, SD e PH do Sol, paralaxe PH·cos(aa). Exemplo: Hi 38°21,4′, ei +1,2′, olho 2,5 m → ao 38°22,6′, dp 2,8′, aa 38°19,8′, R 1,3′, SD +16,0′, P +0,1′, **Ho 38°34,7′** (conferido com cálculo independente). | Corretos. |
| reta-altura | AHL = AHG + λ (E +), Hc e Z por fórmula esférica (Python independente: Pollux, PE 8°46,0′S 036°51,0′W, AHL 340,7°, Hc 48°48,9′, Az 026,3°, Δa +3,5′ = 3,5 milhas para o astro). Meridiana de 13/12/2026 (Sol ao sul, PE 16°01′S 043°W, ai 82°28,6′): HLeg 11h46m, dec 23°10,2′S, av 82°41,1′, **lat 15°51,3′S**, long 043°02,0′W, Az 180°. Hora da meridiana: PE 051°49′W, HML 12h14m, fuso +3 → 12h41m. Sol em 08/10/2026: dec −5,99°, equação do tempo +12,5 min. | Corretos. |

## Defeitos encontrados e corrigidos (todos nos meus arquivos)
**Texto miúdo no celular (< 12 px efetivos), corrigido em:**
- `ripeam-luzes`: mostrador de aspecto (rosa) passou de 140 para 168 px, marcador "nós" de 7,5 para 12 px efetivos e "proa" de 10 para 12; nota "alturas fora de escala" 11 para 12 px.
- `sinais-sonoros`: "luz de manobra" e escala de tempo da linha do tempo 11,5 para 12 px.
- `regras-governo`: legenda de CPA, setores, vento, "1 milha" e escala de 11-11,5 para 12 px.
- `boias-iala`: textos do mapa do porto (rótulos de água 8,8-10 px efetivos, "Porto"/"Marina", "N") para 12 px ou mais.
- `nos`: rótulos ("firme", "chicote de A", "ponta da esquerda") e numeração dos cruzamentos passam a ter tamanho adaptado à escala do desenho (mínimo 12,5 px efetivos); o círculo do número cresce junto.
- `carta-nautica`: sondagens, isóbatas, caracteres de faróis, alturas, escalas de borda, rótulos de linhas e pontos de 8-11 para 12 px (decimais das sondagens e números magnéticos da rosa: ver Pendências).
- `agulha-calc`: números dos três anéis da rosa (7,9-8,8 px efetivos) e rótulos Rv/Rmg/Rag (10 px) para 12 a 13 px; eixos e rótulo da curva de desvios (8,4-9,3) para 12 a 13 px; eixo da curva ganhou margem para não cortar "10°E".
- `mares`: eixos, extremos PM/BM, NR/NM, linha de corte e diagrama Sol-Terra-Lua (8,5-11 px) para 12 a 14 px.
- `sextante`: numeração do tambor (11,8) e rótulos do gráfico de refração (9,6-10,8) para 13 e 13,5.
- `reta-altura`: folha de plotagem, rosa, figura da meridiana e faixa de fuso (8,5-11 px) para 12 a 13 px.

**Sobreposição e outros:**
- `agulha-calc`: os rótulos Rv/Rmg/Rag da rosa se sobrepunham quando a proa ficava perto de 60-90°; agora um passo de afastamento vertical (`separarTags`) separa os rótulos.
- `boias-iala`: o rótulo "mar aberto" ficava debaixo do barco no começo do porto "conduzir"; foi para a esquerda.
- `mares`: "vista do Brasil" era cortado na borda direita do diagrama da Lua; alinhado à direita.
- `reta-altura`: a letra "W" da rosa caía sobre o rótulo de latitude da borda; agora respeita uma margem.
- `carta-nautica`: (1) "Ver solução" sem resposta digitada exibia "Você leu a recíproca" (a resposta de mentira 0° é a recíproca de 180°); (2) o passo da marcação dobrada dizia "trace a LDP de 153° a partir do objeto", ambíguo e invertido: agora "do objeto para o lado oposto à marcação de 153° (rumo 333° a partir do objeto)".
- `regras-governo`: a lição que abre `{cenario:'vela-bordos', vento:0}` mostrava o aviso "proa a 20° do vento: zona morta", porque o vento mudava sem girar o encontro. Agora, ao receber `vento`, o cenário de veleiros gira junto (posições e rumos) e continua válido.

## Pendências (nada disso é bloqueante)
| Arquivo | Rota | Problema | Gravidade | Sugestão |
|---|---|---|---|---|
| `app/widgets/nos.js` | `#/lab/nos` | Números ABoK exibidos (520, 1010, 1204, 1206, 1177, 1720, 1431, 1434, 1615) não foram verificados contra a obra nesta rodada, por falta de fonte aqui. O da volta do fiel (1177) merece conferência: referências usam 1177 e 1178. | baixa | Quem tiver o livro confirma e, se for preciso, o dado entra em `research/` e em `data/fontes.js` (regra "nada inventado"). |
| `app/assets/css/widgets/carta-nautica.css` | `#/lab/carta-nautica` | Dois textos continuam abaixo de 12 px no celular: os decimais subscritos das sondagens (9,5 px, convenção da carta) e, na rosa, os números magnéticos (10 px) e a legenda da declinação (10 px).  Para chegar a 12 px, a rosa inteira teria de crescer. | baixa | Aceitável: a mesma declinação aparece em texto na barra acima da carta. Se quiser cumprir 12 px, aumentar o raio R da rosa (hoje 70) e reduzir a legenda a duas linhas. |
| `app/widgets/sextante.js` | `#/lab/sextante` aba "O instrumento" | No modelo 3D, os pinos numerados "6" e "11" às vezes se encostam ao girar o modelo (projeção). | baixa | Pino com leve deslocamento quando a distância na tela é pequena. |
| `app/widgets/carta-nautica.js` | `#/lab/carta-nautica` | Sondagens ficam por baixo do aviso fixo da carta e de alguns nomes de águas no celular (a carta é panorâmica). | baixa | Excluir sondagens perto dos nomes de águas e do canto do aviso ao gerar. |
| `app/data/cursos/*.js` (blocos dos widgets) | lições com `ritmos-luz` | As legendas sugerem digitar `LpL 10s`, `MR(9) 10s` e `Oc(2) E 8s`. Conferido que as quatro decodificam sem erro (LpL 10s = LFl W 10s; MR(9) 10s = VQ(9) W 10s; Oc(2) E 8s = Oc(2) R 8s; Lp(2) B 35s = Fl(2) W 35s). | informativo | Nenhuma ação. |

Não vi problemas em arquivos fora dos meus. Não toquei em `core/`, `tabs/` nem em dados.

## Pendências resolvidas (fechamento)
Fechamento de 2026-10-08. Verificação no navegador: `tools/qa_shot.py --offline` em `lab/nos`, `lab/carta-nautica`, `lab/sextante` e `lab/boias-iala`, desktop claro e celular escuro, com `console: []`, `pageerrors: []`, `externas: []`, `falhas: []` e `overflowX: false`; `node --check` nos arquivos alterados. Um auditor Playwright próprio mediu o tamanho efetivo do texto e a sobreposição da carta (celular 390 px e desktop 1440 px, quadro inicial e 3 níveis de zoom).

| Pendência | Situação | O que foi feito ou por que fica como está |
|---|---|---|
| `nos.js`: números ABoK sem fonte (520, 1010, 1204, 1206, 1177, 1720, 1431, 1434, 1615) | Resolvida | Cada número foi conferido em fonte reconhecida, e a fonte está no comentário do arquivo. **1010** (lais de guia): Animated Knots, `animatedknots.com/bowline-knot` ("# 1010, p 186"), e Wikipédia, verbete Bowline. **520** (oito): caixa ABoK do verbete Figure-eight knot da Wikipédia (#420, #520, #570; citação do nó de batente na p. 85 do livro). **1204** (direito): caixa ABoK do verbete Reef knot (#1204 e #1402). **1206** (torto): caixa ABoK do verbete Granny knot. **1720** (volta redonda): Animated Knots ("# 1720, p 296") e Wikipédia. **1431** (escota): Animated Knots ("# 1431, p 262") e Wikipédia. **1434** (escota dobrado): caixa do double sheet bend no verbete Sheet bend (#488, #1434). **1615** (cunho): caixa ABoK do verbete Cleat hitch. **Volta do fiel**: o número 1177 não era suficiente. A Wikipédia lista #1176 a #1180 e #1245 para o nó, e o Animated Knots dá #1245 (p 224, capítulo de nós de amarrar). Passou a aparecer "ABoK nº 1177 e 1178", os dois que a fonte lista no capítulo das voltas e que já eram citados na pendência. Nenhum número foi removido, porque todos tiveram confirmação. A legenda do widget agora diz que os números foram conferidos no Animated Knots (com link) e nas caixas de informação da Wikipédia, e que um nó pode ter mais de um número no livro (o reef knot tem #1204 e #1402, por exemplo). Limite: não tive o livro em mãos; a conferência é por fontes secundárias que citam o ABoK. |
| `carta-nautica.css`: decimais das sondagens (9,5 px) | Resolvida | O decimal subscrito passou a 12 px e o inteiro a 13 px (mantém a hierarquia da convenção da carta). O auditor não achou mais nenhum texto abaixo de 12 px efetivos em nenhum quadro. |
| `carta-nautica.css`: números magnéticos da rosa (10 px) | Resolvida | Passaram a 12 px. Como com 12 px eles ficam apertados no anel pequeno, o anel magnético só mostra os números quando a rosa tem raio de 100 px ou mais (zoom alto); nas telas menores continua só com as graduações, e o rumo magnético está na barra acima da carta. |
| `carta-nautica.css`: legenda da declinação (10 px; na prática 7 px com a rosa de raio 70) | Resolvida de outro jeito | Em vez de crescer a rosa inteira, a legenda deixou de ser desenhada ao longo do eixo (onde só cabia com 7 px) e passou a ficar horizontal, em duas linhas de 12 px logo abaixo da rosa ("Decl. 22°10'W 2025" e "(variação anual 7'W)"), com halo para ler sobre o mar. Foi uma troca de convenção gráfica (a Carta 12000 imprime a nota ao longo do eixo), aceita porque a mesma declinação já aparece em texto na barra acima da carta. |
| `carta-nautica.js`: sondagens por baixo do aviso fixo e de nomes de águas | Resolvida | A exclusão estática na geração (que usava a largura do texto em milhas, errada em zoom baixo) foi trocada por uma conferência por quadro: cada rótulo visível (nomes, rótulos de sinais, isóbatas, o aviso e a rosa com sua legenda) entra numa lista de caixas em pixels, e a sondagem que toca uma caixa some naquele quadro. Auditor: 0 sobreposições de sondagens com nomes, rótulos, aviso e rosa no celular e no desktop, no quadro inicial e nos 3 zooms (antes havia de 1 a 14 por quadro). Ainda podem encostar duas sondagens entre si, o que não era o defeito listado. |
| `sextante.js`: pinos "6" e "11" do modelo 3D se encostam | Resolvida | Depois de cada quadro, os pinos que ficam a menos de 26 px na tela são afastados um do outro (só visualmente, com a propriedade CSS `translate`, que o CSS2DRenderer não reescreve). Em 15 ângulos de câmera, em celular e desktop, a menor distância entre quaisquer dois pinos ficou em 25,9 px ou mais (antes, o par 6-11 se sobrepunha). Sem erros de console. |
| Lista de Faróis (34ª x 40ª ed.) no cabeçalho de `boias-iala.js` (apontada em `docs/revisao/arrais.md`) | Resolvida em parte | Regras, cores, formatos e item 4.1 (Região B) passaram a citar a **40ª edição (2026–2027)**, Introdução, item 4, com link para a página oficial da CHM, conforme as pesquisas já confirmadas (`tecnico-94`, `-118`, `-125`, `-128`, `-140`). O PDF não pôde ser baixado nesta rodada, então os 12 "exemplos reais" de luz (nº do sinal, característica e fase) **continuam sendo da 34ª edição**; isso está dito no comentário do arquivo, na legenda do widget e em cada sinal real ("34ª ed.... confira a edição atual e os Avisos aos Navegantes"). Para trocar esses 12 exemplos pela 40ª é preciso abrir o PDF e conferir cada número. |
| Chips com 40 px | Resolvida | Nos quatro widgets (nos, carta-nautica, sextante, boias-iala) o auditor percorreu todas as abas e modos no celular: nenhum botão, resumo, campo de texto ou seletor mede menos de 40 px em largura ou altura (exclui caixas de marcar, barras deslizantes e links no meio do texto). Os chips de `boias-iala` já tinham `min-height: 40px`, e a regra global `button.chip` em `app.css` também está em 40 px. |
| Aliases de opts usados pelo glossário (`'orto'`, `'lox'`, `'homem-ao-mar'`) | Resolvida | Em `app/data/glossario.js` (só os `opts` de widget): `derrota-calc {aba:'orto'}` e `{aba:'lox'}` viraram `{aba:'derrotas'}` (a aba que existe; as duas derrotas aparecem juntas nela), e `manobras {manobra:'homem-ao-mar'}` virou `{manobra:'mob'}`. Os widgets continuam aceitando os nomes antigos. |
| Lições com `ritmos-luz` (legendas `LpL 10s`, `MR(9) 10s`, `Oc(2) E 8s`) | Mantida | Era informativa, sem ação: as quatro notações decodificam sem erro, como já registrado. |

Fora do pedido e não alterado: `docs/revisao/arrais.md` tem linhas que dizem que a citação da 34ª edição "fica para o dono do widget"; o ajuste está feito aqui, e o fechamento daquele relatório cabe a quem o mantém. `node tools/validate.mjs` hoje acusa fatos inexistentes em `cursos/travessia/m4/l4` (`extra-fechamento-cvtr-03` e `-04`): são de outro arquivo e não vieram desta rodada.

## Revisão final (ponta a ponta)
Refeita em 2026-10-09, no estado atual do app, no Chrome do sistema (`file://`, rede externa abortada). Ferramentas: `tools/qa_shot.py --offline` nas 11 rotas `lab/<widget>` (desktop claro 1440 px e celular escuro 390 px) e dois auditores Playwright próprios (texto efetivo em px incluindo SVG, alvos de toque, sobreposição de sondagens da carta em 4 níveis de zoom, distância entre pinos do sextante em 15 ângulos de câmera, percorrendo todas as abas/modos). Seis PNGs abertos (carta desktop e celular, sextante celular, nós celular, boias desktop, regras-governo celular). `node --check` nos quatro `.js` alterados e `node tools/validate.mjs`: "OK: todos os critérios passaram".

### Pendências
| Pendência | Resultado | Evidência |
|---|---|---|
| `nos.js`: números ABoK | Resolvida | Todos os 9 números (1010, 520, 1204, 1206, 1177 e 1178, 1720, 1431, 1434, 1615) têm fonte no comentário do arquivo (Animated Knots e caixas ABoK da Wikipédia); a legenda renderizada cita as duas fontes e avisa que um nó pode ter mais de um número. Limite mantido: o livro não foi consultado, só fontes secundárias que o citam. |
| `carta-nautica.css`: decimais e números magnéticos, legenda da declinação | Resolvida | 0 textos abaixo de 12 px efetivos no quadro inicial e nos 3 zooms, celular e desktop. Rosa com legenda horizontal em 12 px (visível nos PNGs). |
| `carta-nautica.js`: sondagens sob aviso/nomes | Resolvida | Nas capturas, nenhuma sondagem fica sob nomes de águas, rótulos de sinais, aviso ou rosa. A medição por caixa acusa só coincidências com os rótulos de graduação da moldura (ex.: "23°55'S"), que ficam na margem e não eram o defeito listado. |
| `sextante.js`: pinos 6 e 11 | Resolvida | 15 giros de câmera em cada perfil: menor distância entre dois pinos 25,8 px (celular) e 25,9 px (desktop), limiar de 26 px. Pinos 6 e 11 legíveis na captura. Sem erros de console. |
| Lista de Faróis 34ª x 40ª ed. (`boias-iala.js`) | Resolvida (supera o "em parte" do fechamento) | O arquivo foi atualizado depois do fechamento: cita a 40ª ed. e os 12 exemplos reais foram trocados/conferidos no PDF da 40ª. Conferi no texto extraído do PDF (`lf40.txt`) que os sinais 2616, 2016, 90, 355, 2049, 214, 351, 222, 268, 2614.2, 1746, 504 e 2422 existem com a característica citada. Na interface só aparece "40ª ed."; "34ª" restou apenas no comentário, explicando a troca. |
| Chips/alvos com 40 px | Resolvida, com um acréscimo | nos, carta-nautica, sextante e boias-iala: nenhum alvo abaixo de 40 px no celular em todas as abas/modos. Achei no celular os `<summary>` "Como funcionam os setores" (`ripeam-luzes.css`, 32 px) e "Como o simulador decide"/"Hierarquia da Regra 18" (`regras-governo.css`, 36 px): corrigidos para 40 px (medido: 40, 40, 40, 40). |
| Aliases de opts do glossário | Resolvida | `glossario.js` usa `aba:'derrotas'` (2 entradas) e `manobra:'mob'`; não há mais `'orto'`, `'lox'` nem `'homem-ao-mar'` em opts. |
| Lições com `ritmos-luz` (legendas) | Mantida (informativa) | Sem ação, como antes. |

Itens restantes, nenhum bloqueante: o rótulo "Sol" do 3D do sextante encosta no disco do Sol no quadro inicial (cosmético). Alvos de 28 a 32 px existem só no desktop (links de regra e botões pequenos do sextante e da reta de altura), onde o ponteiro é o mouse. Na carta, duas sondagens ainda podem encostar uma na outra.

### Testes refeitos
Todos: `console: []`, `pageerrors: []`, `externas: []`, `falhas: []`, texto efetivo abaixo de 12 px: nenhum.

| Rota | Modo | Erros | Overflow horizontal |
|---|---|---|---|
| `lab/ripeam-luzes` | desktop claro e celular escuro | 0 | não |
| `lab/sinais-sonoros` (4 abas) | desktop claro e celular escuro | 0 | não |
| `lab/regras-governo` | desktop claro e celular escuro | 0 | não |
| `lab/boias-iala` (8 botões de modo/aba) | desktop claro e celular escuro | 0 | não |
| `lab/ritmos-luz` | desktop claro e celular escuro | 0 | não |
| `lab/nos` (5 botões de modo/nó) | desktop claro e celular escuro | 0 | não |
| `lab/carta-nautica` (inicial + 3 zooms, 2 modos) | desktop claro e celular escuro | 0 | não |
| `lab/agulha-calc` | desktop claro e celular escuro | 0 | não |
| `lab/mares` | desktop claro e celular escuro | 0 | não |
| `lab/sextante` (4 abas, 15 giros do 3D) | desktop claro e celular escuro | 0 | não |
| `lab/reta-altura` | desktop claro e celular escuro | 0 | não |
| `lab/ripeam-luzes`, `lab/regras-governo` (após o ajuste de 40 px) | celular escuro | 0 | não |

Cobertura: nos widgets sem `role=tab` a varredura do auditor cobriu o estado inicial; abas e modos de nos, carta, sextante, boias-iala e sinais-sonoros foram percorridos. Os fluxos de exercício e a limpeza ao sair não foram refeitos nesta revisão (valem os resultados do relatório original).
