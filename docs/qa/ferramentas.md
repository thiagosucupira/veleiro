# QA: Simulados, Glossário e Sobre (2026-10-08)

Escopo: `#/simulados` (painel, nível, prova, prática, erradas, flashcards), `#/glossario` (lista, termo, referências),
`#/sobre` (principal, fatos verificados, licenças). Testado em `file://`, Chrome do sistema, com bancos e baralhos reais.

## Como foi testado
- `tools/qa_shot.py --offline` (desktop, `--mobile`, `--dark`, `--mobile --dark`) em 17 rotas: painel, mestre, prova do Mestre,
  erradas do Capitão, prática do Arrais, lista de flashcards, baralho `arrais-2`, flashcards do rádio, glossário (lista, busca,
  dois termos, referências), Sobre (principal, fatos, fatos só a confirmar, licenças).
  Resultado: `console: []`, `pageerrors: []`, `externas: []`, `falhas: []` e `overflowX: false` em todas as 51 combinações (mobile, mobile escuro e desktop escuro) e nas 5 rotas principais em desktop claro.
- Scripts Playwright de ponta a ponta (ficam no scratchpad da sessão; reproduzíveis com o mesmo desenho):
  1. Prova oficial dos 6 níveis com respostas sorteadas (certas em proporção definida), entrega pelo diálogo, correção comentada.
  2. Segunda tentativa do Arrais e conferência dos gráficos Chart.js nos dois lugares.
  3. Flashcards: lista, sessão por nível, avaliação com teclado (1 a 4), volta à lista, contagens.
  4. Prática por assunto, "revisar as erradas", glossário, referências, Sobre, fatos e licenças.
  5. Relógio: `page.clock` avança 2h56 (alerta dos últimos 5 min) e depois 5 min (entrega automática) no Mestre, em 390 px.

## Resultados por requisito
| Requisito | Resultado |
|---|---|
| Prova oficial Arrais | 40 questões, relógio 120:00, aprova com 5,0. Entregou: nota 8,5 (34/40), 40 correções comentadas. |
| Prova oficial Mestre | 40 questões, relógio 180:00, **4 questões de "Problemas de carta"** sorteadas. Nota 6,5, 40 correções. |
| Prova oficial Capitão | 40 questões, relógio 240:00. Nota 6,0, 40 correções. |
| Vela / Travessia / Rádio (formato do app) | 20 questões em 30 min, nota mínima 5,0. Funcionam e corrigem (40/20/20 explicações). |
| Entrega automática no tempo | Funciona: alerta (`data-alerta`) em 5 min, depois aviso "Tempo esgotado" e resultado. |
| Gráficos de progresso | Com 2 tentativas do Arrais: "Evolução das notas" desenha 2 pontos + linha da nota mínima; "Aproveitamento por assunto" desenha 17 assuntos. No painel e na página do nível. Sem dados, mostram estado vazio com texto. |
| Histórico | Tabela com 2 linhas após as 2 provas; botão "Mostrar todas" só aparece acima de 12. |
| Prática por assunto | 18 assuntos como chips; contagem "14 questões disponíveis"; abre `pratica?tema=…&n=…`; explicação logo após cada resposta. |
| Revisar erradas | Lista as questões com último resultado errado ("Questão 1 de 7"), ordenadas pelas que mais erra. |
| Flashcards por nível | 6 níveis com baralho: 177 / 176 / 174 / 115 / 120 / 114 cartões. Fila inicial de 20 novos. |
| Repetição espaçada | Avaliar 6 cartas (Errei, Difícil, Bom, Fácil, Bom, Errei) muda: fila 20 para 16, novas 177 para 171, aprendendo 0 para 6; previsão de 7 dias vira `[0,5,0,1,0,0,0]` (gráfico "Revisões de flashcards" aparece). |
| Glossário | 452 termos. Busca sem acento e sem caixa: "ancora" e "âncora" dão o mesmo, "ESCOTA", "estibordo" (sinônimo de Boreste), "no de oito". Termo abre com figura, relacionados, anterior e próximo. Busca vazia mostra estado vazio. |
| Referências | 59 links externos oficiais, aviso de que endereços mudam. |
| Sobre / fatos | Lista de 1.352 fatos (a contagem muda quando `tools/build_fontes.py` roda de novo). Filtro "Só a confirmar" funciona (URL `?aconfirmar=1`), busca sem acento ("idade minima" achou 9), selo amarelo nos itens. |
| Licenças | MIT (código) e CC BY-SA 4.0 (conteúdo) em linguagem simples, com como dar crédito e perguntas comuns. |

## Corrigido (arquivos meus)
1. **Contagens de flashcards inconsistentes e dobradas.** Cada baralho de um nível guardava o estado SRS num id próprio
   (`arrais-1`), enquanto "Todos os baralhos" usava o id do nível (`arrais`). Avaliar cartas num lugar não mudava o outro
   (o baralho `arrais-1` continuava com 60 novas depois de 6 avaliações no nível), e o painel somava o nível juntado mais
   cada baralho, contando o dobro (1.746 cartões novos em vez de 873).
   Correção: `S.parte()` em `app/tabs/simulados/comum.js` devolve o baralho como parte do nível (mesmo id e mesmos ids de
   cartas); `S.baralhosSRS()` agora devolve só o nível juntado; `flashcards.js` usa `S.parte` na lista e em
   `#/simulados/flashcards/<baralho>`. Verificado: avaliar 3 cartas em `arrais-2` mudou `arrais-2` (60 para 57 novas) e o
   nível (177 para 174). O painel marca 873 novos.
2. Títulos dos baralhos com prefixo em minúscula ("arrais: RIPEAM…") agora aparecem sem o prefixo e com inicial maiúscula
   dentro da lista de cada nível.
3. Texto de "Como estudar": o limite diário de cartões novos é por nível (os baralhos dele dividem o limite).

## Pendências fora da minha área
| Arquivo | Rota | Problema | Sugestão |
|---|---|---|---|
| `app/data/glossario.js` | `#/glossario?q=luz de tope` | "luz de tope" não acha "Luz de mastro" (o termo comum entre velejadores); o primeiro resultado vira "Marca cardinal". | Incluir `sin: ['luz de tope']` no termo `luz-de-mastro`. Baixa. |
| `app/data/flashcards/*.js` e `indice.js` (gerado por `tools/build_indice.py`) | `#/simulados/flashcards` | Títulos de baralho escritos como "arrais: …" em minúscula. Já contornado na tela do nível, mas o título cru aparece em `<title>` e no cabeçalho do baralho avulso. | Gerar títulos legíveis ("Arrais 1: embarcação, nós, manobras e preparo"). Baixa. |
| `app/core/quiz.js` / `VL.fmt.min` | `#/simulados/<nivel>/prova` | Relógio e duração mostram minutos totais ("120:00", "181:01") em vez de horas. Legível, mas "4 h" no formato oficial pede `h:mm:ss`. | Formatar com horas quando passar de 60 min. Baixa. |
| `app/core/srs.js` | sessão de flashcards | Cartão marcado "Errei" fica com vencimento de amanhã, mas volta na mesma sessão. O texto do botão diz "de novo hoje", o que está certo. Sem mudança necessária; só registrado. | Nenhuma. |
| Bancos Vela/Travessia/Rádio | `#/simulados/vela` | Simulado do app tem 20 questões (bancos de 70, 70 e 68). Funciona; é decisão de produto, não erro. | Nenhuma. |

## Para repetir
```
cd /home/sobranceiro/veleiro_certificacoes
python3 tools/qa_shot.py --out /tmp/qa --offline [--mobile] [--dark] simulados simulados/mestre/prova \
  simulados/flashcards glossario sobre/fontes sobre/licencas
node tools/validate.mjs
```
Seletores úteis para scripts: `.sim-btn-grande` (começar prova), `.quiz-mapa button`, `.quiz-relogio`, `dialog.dlg button.btn-primary`
(Entregar), `.resultado`, `.explicacao`, `.flash-carta` (virar), teclas 1 a 4 (avaliar), `#gl-q` (busca do glossário),
`#fontes-soq` (só a confirmar), `#fontes-busca`. Ao testar duas provas seguidas, abra `about:blank` entre elas: a mesma
rota por hash não redesenha.

## Pendências resolvidas (fechamento)

Verificado em 2026-10-08: `tools/qa_shot.py --offline` em `glossario` e `sobre` (desktop escuro) sem erros; `node --check` em `app/core/*.js`; `node tools/validate.mjs` OK. Dos arquivos de dados abaixo, só `app/core/*` era meu; os de dados ficam com quem os possui.

| Pendência | O que foi feito |
|---|---|
| `glossario.js`: "luz de tope" não acha "Luz de mastro" (sinônimo ausente) | Fora dos meus arquivos (`app/data/glossario.js`). Fica como está neste fechamento: o conserto é um `sin: ['luz de tope']` no termo `luz-de-mastro`, mas só com fonte reconhecida que confirme o sinônimo, e isso cabe a quem mantém o glossário. Gravidade baixa. |
| Títulos de baralho em minúscula ("arrais: ...") no `<title>` e no cabeçalho do baralho avulso | Já corrigido no índice (`flashcards/indice.js`, gerado por `tools/build_indice.py`): títulos agora "Arrais 1: embarcação, nós, manobras e preparo" etc. Conferido o `<title>` de `#/simulados/flashcards/arrais-2`: "Flashcards: RIPEAM, balizamento, instrumentos, marés e tempo — Veleiro". |
| Relógio e duração em minutos totais ("120:00", "181:01") em vez de horas | Já corrigido: `VL.fmt.min` (`app/core/vl.js`) devolve `h:mm:ss` quando passa de uma hora ("2:00:00", "3:01:01"); `quiz.js` usa essa função no relógio, na atualização a cada segundo e no resumo do resultado. Conferido no código. |
| `srs.js`: cartão "Errei" volta na mesma sessão com vencimento de amanhã | Sem mudança, como o próprio relatório conclui: o botão diz "de novo hoje", o que está certo (reaparece na sessão; o agendamento longo é o do dia seguinte). |
| Simulados Vela/Travessia/Rádio têm 20 questões (bancos de 70, 70 e 68) | Sem mudança: é decisão de produto, não erro. O formato de 20 questões em 30 min já é apresentado na tela como formato do app (não como regra oficial); ampliar exigiria decisão de produto, não correção, e nenhum fato regulatório novo é afirmado. |

## Revisão final (ponta a ponta)

Refeito em 2026-10-09, no estado atual do app: `tools/qa_shot.py --offline` em 16 rotas × 4 modos (desktop claro, desktop escuro, mobile claro, mobile escuro) = 64 combinações, mais um script Playwright (`file://`, Chrome do sistema) para conferir busca, relógio e `<title>`. Quatro PNGs abertos (glossário "luz de tope" desktop, prova do Mestre mobile escuro, lista de flashcards mobile, painel de simulados desktop escuro): sem corte, sem sobreposição, contraste legível. `node tools/validate.mjs`: OK; `node --check app/core/*.js`: OK.

### Resultado de cada pendência
| Pendência | Resultado |
|---|---|
| `glossario.js`: "luz de tope" não achava "Luz de mastro" | **Resolvida.** `luz-de-mastro` tem `sin: ['luz de tope']` com fonte (NPCP-CE, Anexo 3-A, item 11 b, da Capitania dos Portos do Ceará, que usa "Tope" para a luz de mastro). Em `#/glossario?q=luz de tope` o primeiro resultado é "Luz de mastro" e mostra "Também: luz de tope". |
| Títulos de baralho em minúscula | **Resolvida.** `flashcards/indice.js` traz "Arrais 1: embarcação…", "Mestre 1: carta náutica…" etc. `<title>` de `#/simulados/flashcards/arrais-2`: "Flashcards: RIPEAM, balizamento, instrumentos, marés e tempo — Veleiro"; h1 de `…/radio`: "Flashcards: Rádio e segurança". |
| Relógio em minutos totais ("120:00") | **Resolvida.** `VL.fmt.min` devolve `h:mm:ss`. Ao começar a prova: Arrais 2:00:00, Mestre 3:00:00, Capitão 4:00:00; a página do nível diz "até 2 horas / 3 horas / 4 horas". |
| `srs.js`: "Errei" volta na mesma sessão | **Justificada.** Sem mudança: o botão diz "de novo hoje" (reaparece na sessão; o agendamento longo é o do dia seguinte). Fonte: o próprio relatório e `app/core/srs.js`. |
| Vela/Travessia/Rádio com 20 questões | **Justificada.** Decisão de produto, apresentada como formato do app e não como regra oficial; nenhum fato regulatório novo afirmado. |

Nenhuma correção de código foi necessária nesta revisão. As contagens do corpo do relatório (452 termos, 873 cartões) são de 2026-10-08 e já mudaram com o conteúdo: hoje o glossário tem 512 termos (144 com figura), o painel mostra 805 questões nos bancos e 880 cartões novos.

### Testes refeitos
Em todas as linhas: console 0, pageerrors 0, requisições externas 0, falhas de carga 0, nos 4 modos (desktop claro, desktop escuro, mobile claro, mobile escuro). `overflowX` = false em todas.

| Rota | Modos | Erros | overflowX |
|---|---|---|---|
| `simulados` | 4 | 0 | não |
| `simulados/mestre` | 4 | 0 | não |
| `simulados/arrais` | 4 | 0 | não |
| `simulados/flashcards` | 4 | 0 | não |
| `simulados/flashcards/arrais-2` | 4 | 0 | não |
| `simulados/flashcards/radio` | 4 | 0 | não |
| `simulados/capitao/erradas` | 4 | 0 | não |
| `simulados/arrais/pratica` | 4 | 0 | não |
| `simulados/mestre/prova` (após clicar `.sim-btn-grande`) | 4 | 0 | não |
| `glossario` | 4 | 0 | não |
| `glossario?q=luz de tope` | 4 | 0 | não |
| `glossario?q=ancora` | 4 | 0 | não |
| `glossario/referencias` | 4 | 0 | não |
| `sobre` | 4 | 0 | não |
| `sobre/fontes` | 4 | 0 | não |
| `sobre/licencas` | 4 | 0 | não |
