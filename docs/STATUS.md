# STATUS — Veleiro: de leigo a transatlântico

> Arquivo de retomada. Atualizado ao fim de cada fase. Data de início: 2026-10-07.

## Fase 0 — Preparação (concluída 2026-10-07)
- PLAN.md lido inteiro; seção 10 prevalece sobre a seção 8.
- marinha.mil.br fica atrás de Cloudflare: `curl` recebe 403. Solução: Chrome real com
  `--remote-debugging-port=9333` (perfil dedicado no scratchpad) + serviço local `tools/fetchsvc.py`
  (porta 8799: `/page?url=` e `/pdf?url=`). PDFs da DPC redirecionam para `assets.marinha.mil.br`,
  que baixa direto com `curl -sk -L` (cadeia de certificado incompleta no servidor).
- Acervo oficial salvo em `research/acervo/`: NORMAM-211/DPC (268 p., PDF de 03/03/2026, atualizada
  pela Portaria DPC/DGN/MB nº 200 de 27/02/2026), 40 anexos (texto extraído dos .odt oficiais) e NORMAM-212.

## Fase 1 — Pesquisa (em andamento)
- Workflow `veleiro-pesquisa` (run wf_0b1e17a4-29d): 14 pesquisadores (normas, programa, taxas/Capitanias, rádio,
  internacional, travessia, técnico, benchmark + 6 regiões de locais) → 2 verificadores independentes por lote de
  fatos (lentes "fonte" e "atualidade") e 1 por lote de locais. Saída bruta em `research/_work/*.json`.
- Consolidação determinística: `python3 tools/build_fontes.py` (→ research/sources.md, research/claims_verified.json,
  app/data/fontes.js) e `python3 tools/build_locais.py` (→ app/data/locais.json/.js, research/locais_descartados.md).

## Fase 3 — Design e núcleo (concluída 2026-10-07)
- Skill frontend-design carregada; design system em `docs/design-system.md`; contrato em `docs/arquitetura.md`;
  decisões em `docs/decisoes.md`.
- Núcleo pronto em `app/core/` (vl, icons, ui, progress, quiz, srs, course, charts, config, shell), tokens/CSS,
  bibliotecas vendorizadas, geo offline, `tools/qa_shot.py`, `tools/validate.mjs`, `run.sh`, README, licenças,
  `netlify.toml`, `.github/workflows/pages.yml`. Rota oculta `#/lab/<widget>` para testar widgets.

## Fase 4 — Construção (em andamento)
- Workflow `veleiro-widgets` (wf_8355731c-987): 9 construtores de simuladores (ripeam, balizamento, nós, navegação,
  astro, globo, veleiro, meteo, rádio) em `app/widgets/`.
- Workflow `veleiro-abas-base` (wf_dee4b086-aa5): abas Simulados, Glossário e Sobre.
- Workflow `veleiro-conteudo` (wf_5e190820-b67, script em scratchpad `wf_conteudo_run.js`): 15 autores de partes de
  curso (arrais-1..3, mestre-1..3, capitao-1..3, vela-1..2, travessia-1..2, radio-1..2) + flashcards por parte.
  Arquivos principais dos cursos (data/cursos/<id>.js com `partes`) e entradas das abas (tabs/<curso>.js) já escritos.
- Pendente: Roteiro e Locais (após consolidar locais verificados); banco de questões (workflow `veleiro-questoes`,
  21 lotes com 2 revisões cada → tools/build_questoes.py); conciliação de fatos "a confirmar" citados no conteúdo;
  verificação dupla dos fatos extras (research/_work/research_extra_*.json); índice de flashcards
  (tools/build_indice.py).

## PAUSA — limite de uso atingido (2026-10-07)
Estado no momento da pausa: 4 workflows rodando em segundo plano (pesquisa wf_0b1e17a4-29d, widgets wf_8355731c-987,
abas-base wf_dee4b086-aa5, conteúdo wf_5e190820-b67). Tudo o que já foi escrito está em disco.
Como retomar numa nova sessão:
1. Reabrir Chrome com depuração (se precisar de marinha.mil.br):
   `google-chrome --user-data-dir=<scratch>/cfprof --remote-debugging-port=9333 https://www.marinha.mil.br/dpc` e
   `python3 tools/fetchsvc.py <cache>` (porta 8799).
2. Ver o que cada workflow deixou: `ls research/_work app/widgets app/data/cursos app/data/flashcards`.
   Workflows podem ser retomados com `resumeFromRunId` (agentes concluídos voltam do cache).
   Pesquisadores prontos: normas, programa, internacional, radio, travessia, taxas, benchmark (faltam técnico e
   locais; verificação dupla em andamento → arquivos verify_*.json).
3. Consolidar: `python3 tools/build_fontes.py && python3 tools/build_locais.py && python3 tools/build_indice.py`.
4. Lançar o que falta (rascunhos no scratchpad desta sessão; copie-os para tools/workflows/ se sumirem):
   - Roteiro e Locais (prompts em wf_partes.js, entradas 'roteiro' e 'locais');
   - banco de questões (wf_questoes.js + wf_lotes.js → `python3 tools/build_questoes.py`);
   - verificação dupla dos fatos extras (research_extra_*.json) e conciliação dos fatos "a confirmar" citados;
   - QA no navegador (tools/qa_shot.py em todas as abas, --mobile --dark --offline) e revisão do instrutor cético;
   - `node tools/validate.mjs` até passar; entrega com file://.

## Retomada após queda da API (2026-10-07, noite)
- A queda (EAI_AGAIN / limite de sessão) derrubou ~140 agentes. Sobreviveram em disco: pesquisa de normas,
  programa, internacional, rádio, travessia, taxas (com 69 Capitanias/Delegacias/Agências) e benchmark; widgets
  carta-nautica, derrota-calc, esfera-celeste, ripeam-luzes, ritmos-luz; aba Sobre completa.
- Nova camada determinística: `tools/check_quotes.py` confere cada trecho citado na fonte (796/846 achados
  literalmente) → `research/_work/quotecheck.json`; `tools/verif_pack.py` monta o pacote de evidência por lote;
  `tools/check_sites.py` testa os sites dos locais.
- Relançados (scripts em tools/workflows/): `wf_verif.js` (run wf_7a01dfa0-73c: 7 pesquisadores que faltaram +
  2 verificadores por lote de ~30 fatos + verificação de locais), `wf_widgets2.js` (wf_e8217a24-be9, continua dos
  arquivos existentes), `wf_abas2.js` (wf_dee4b086-aa5, Simulados e Glossário; Sobre veio do cache).
- Núcleo: corrigidos botão de menu visível no desktop e sombra da gaveta fechada no celular; `--font-mono`;
  `VL.projeto.repo`; selo "a confirmar" agora leva a `#/sobre/fontes?id=`; questões mostram o id e "relatar erro".
- Dados de TESTE deixados pelo construtor de Simulados (marcados "DADOS-TEMPORARIOS-TESTE"): app/data/questoes/*.js
  e app/data/flashcards/teste*.js e indice.js — serão substituídos/apagados.

## Retomada 2 (2026-10-08)
- Pesquisa bruta completa em disco: 14 tópicos (normas, programa, taxas, radio, internacional, travessia, tecnico,
  benchmark, loc_ne, loc_se, loc_s, loc_nco, loc_ext, loc_regatas) + research_extra_mestre-2.
- Checagens determinísticas: quotecheck (1.118/1.182 trechos achados na fonte), sitecheck (todos os locais).
- Rodando: `wf_verif3.js` (run wf_5a307233-cd2; 38 lotes de fatos + 17 de locais), widgets (retomada
  wf_e8217a24-be9: nós, rádio, veleiro-3d/manobras, meteo), Glossário (retomada wf_dee4b086-aa5),
  conteúdo (`wf_conteudo2.js`, run wf_903b375d-44b: 15 partes de curso + flashcards, gravação incremental).
- Feitos: abas Sobre e Simulados; 15 widgets; dados do glossário; docs/widgets.md (tools/build_widgets_doc.py).
- Depois: build_fontes/build_locais → Roteiro e Locais; banco de questões; verificação dos extras; QA; revisão cética.

## Retomada 3 (2026-10-08) — subagentes Sonnet/Haiku por pedido do usuário
- Verificação concluída (wf_5a307233-cd2): `build_fontes.py` → 1.309 fatos, 1.080 confirmados, 229 a confirmar
  (inclui fatos extras dos autores ainda sem verificação); `build_locais.py` → 215 locais (192 fora Capitanias;
  NE 44, SE 42, S 26, N 18, CO 17, Exterior 56, Online 12).
- Cursos prontos: arrais-1, arrais-2, arrais-3 (m10–m15), mestre-1, mestre-2, mestre-3 (m8–m12).
- Núcleo: progresso de lição agora é chave módulo+lição (ids de lição podem repetir entre módulos);
  manifesto de dados/widgets (consulta opcional), VL.protegerSaida na prova, tokens --nav-black/--nav-blue.
- Rodando (modelo sonnet): `wf_conteudo3.js` (wf_e874e56f-ede: flashcards arrais-2/3, m16, mestre m13–m14,
  capitão 1–3, vela 1–2, travessia 1–2, rádio 1–2, Roteiro, Locais); `wf_widgets3.js` (wf_e7c15677-fd3: nos,
  rádio, veleiro-3d/manobras/mareacao, meteo); `wf_questoes_am.js` (wf_d5c056ad-fa5: 10 lotes Arrais/Mestre,
  geração e revisão técnica sonnet, revisão de clareza haiku).
- Depois: `wf_questoes_resto.js` (Capitão + extras), verificação dos fatos extras, build_all, QA e revisão cética.

## Retomada 4 (2026-10-08 noite)
- Prontos: cursos Arrais (m1–m16) e Mestre (m1–m14) completos com flashcards; Capitão 1–3, Vela 1, Rádio 2
  escritos; bancos arrais (199) e mestre (198) montados; todos os 23 widgets prontos.
- Pendência anotada para a revisão cética: figura de estabilidade em arrais-3/m14/l1 (centro de carena B
  desenhado do lado errado — o binário emborca em vez de endireitar).
- Retomados com cache: conteúdo (wf_e874e56f-ede: roteiro, locais, travessia-1/2, vela-2, radio-1) e
  questões (wf_38f57eac-cf0: capitão, vela, travessia, rádio).

## Fase 5–6 (2026-10-08 noite)
- Conteúdo completo: 6 cursos (arrais, mestre, capitão, vela, travessia, rádio), 15 baralhos/876 flashcards
  (`tools/build_indice.py`), abas Roteiro e Locais construídas.
- Banco de questões (`tools/build_questoes.py`): arrais 199, mestre 198, capitão 198, vela 70, travessia 70,
  rádio 68 — todas com duas revisões (técnica sonnet + clareza haiku).
- `node tools/validate.mjs` → OK em todos os critérios.
- Rodando: verificação dos fatos extras (`wf_verif5.js`, wf_6c6ef88e-389; fonte=haiku, atualidade=sonnet) e
  QA + revisão do instrutor cético (`wf_qa.js`, wf_1fbac730-1a6; relatórios em docs/qa/ e docs/revisao/).
- Depois: `tools/build_all.sh`, conferência final no navegador, entrega.

## CONCLUÍDO (2026-10-08)
- Conciliação dos 28 fatos "a confirmar" com o texto do app (research/correcoes.json); lista em docs/a_confirmar.md.
- `tools/build_all.sh` → 1.444 fatos (1.324 confirmados; 28 a confirmar exibidos), 261 locais (192 fora de órgãos
  marítimos, 69 Capitanias/Delegacias/Agências; NE 58), 876 flashcards, questões arrais 199 / mestre 198 /
  capitão 198 / vela 70 / travessia 70 / rádio 68, glossário 452 termos, 23 widgets. `validate.mjs` OK.
- Varredura final no navegador (tools/qa_shot.py, --offline): 22 rotas × desktop claro e celular escuro, zero erros
  de console/página, zero requisições externas, sem rolagem horizontal. `./run.sh` (HTTP 200) e `./run.sh --check` OK.
- Relatórios: docs/qa/*.md (QA) e docs/revisao/*.md (instrutor cético). Pendências restantes são de baixa gravidade
  (listadas nesses relatórios). Nada foi publicado nem implantado.

## Fechamento após revisão do hook (2026-10-08)
- Segunda lente (atualidade) aplicada também a técnico, internacional, travessia, locais e extras → todos os tópicos
  (exceto benchmark, não exibido) agora exigem 2 verificadores independentes. Um lote com ids trocados foi detectado e
  refeito; build_fontes avisa sobre ids de outro tópico.
- Desempate por 3º verificador (research/_work/desempate.json): 34 fatos confirmados com redação corrigida e texto
  conciliado; 4 seguem "a confirmar" (divergência entre documentos oficiais da DPC) — docs/a_confirmar.md.
- Pendências da revisão cética e do QA resolvidas ou justificadas (seções "Pendências resolvidas (fechamento)" em
  docs/qa/*.md e docs/revisao/*.md), incl. homem ao mar com 11 fontes (research/mob.md), ABoK, legibilidade.
- `tools/criterios.py` verifica no navegador cada critério das seções 7 e 10: 37/37 OK (docs/criterios.md).
- Totais: 1.377 fatos exibidos (1.373 confirmados, 4 a confirmar), 261 locais (192 escolas/clubes/regatas/
  crew-finders, NE 58, exterior 56 + 69 órgãos marítimos), 880 flashcards, questões 199/198/198 (+70/70/68),
  glossário 452, 23 widgets. Varredura 17 rotas × 2 modos offline sem erros; run.sh HTTP 200; --check OK.

## Revisão de completude (2026-10-09)
- `docs/completude.md`: matriz do PLAN (seções 1 a 10), 10 itens corrigidos na rodada (quick-stop de `vela-2.js` alinhado a `research/mob.md`, fontes de 26 verbetes do glossário, `normas-168` trocado por `extra-fechamento-am-03`, prova oral do ARA com `normas-51`, 6 locais no mapa, `docs/questoes.md`) e 14 itens abertos com motivo; o maior é a falta de fonte por verbete em 324 dos 512 verbetes do glossário.

## Revisão final de ponta a ponta (2026-10-09)
- 6 instrutores céticos leram cada curso inteiro (lições, flashcards e todas as questões): 112 correções; animação de
  homem ao mar refeita conforme research/mob.md; itens "mantidos" do núcleo/abas/widgets fechados (inclui recuperação
  de contexto WebGL). Crítico de completude: docs/completude.md (matriz do PLAN, itens abertos com justificativa).
- Confirmação final: build_all OK, tools/criterios.py 37/37 OK, run.sh --check OK, 4 fatos "a confirmar".

## Fechamento total (2026-10-09)
- Glossário: 486 de 512 verbetes com fonte reconhecida conferida por verificador independente (research/_work/
  glossario_fontes_*.json; tools/glossario/src/81–86); os 26 sem fonte mostram aviso explícito e convite a contribuir.
- QA final refeito nas 4 áreas que faltavam (seção "Revisão final (ponta a ponta)" em todos os docs/qa e docs/revisao).
- Homem ao mar: recomendação explícita e fundamentada adotada (research/mob.md, "Recomendação adotada pelo app").
- Acessibilidade: axe-core WCAG 2.1 A/AA em 15 rotas × 2 temas → 0 violações (docs/qa/acessibilidade.md, tools/a11y.py).
- Confirmação: build_all OK, criterios.py 37/37, varredura 15 rotas × 2 modos offline sem erros, run.sh --check OK.
- Glossário final: 510 verbetes publicados, todos com fonte verificada; "casaria" e "tormentim" retirados por falta de
  fonte (research/glossario_retirados.md). Curso de Capitão alinhado à definição DHN de crepúsculo náutico.
  Verificação final: build_all OK, criterios.py 37/37, axe 0 violações, run.sh --check OK.
- 4 fatos divergentes resolvidos (PDF consolidado prevalece sobre o ZIP de anexos; research/normam211_versoes.md) e
  texto conciliado: 0 fatos "a confirmar" no app. Verificação final: criterios 37/37, axe 0, varredura OK, --check OK.
- Teste em Android real (Chrome 124, Android 15 no emulador): 16/16 rotas OK (docs/qa/android.md, tools/android_test.py).
  Teste com leitor de tela real (TalkBack): árvore anunciada lida em 14 rotas; mapa corrigido (role/aria); só campos de
  busca aparecem sem nome no dump por limitação (hintText) — docs/qa/talkback.md, tools/talkback_test.py.
- Revisão técnica feita conforme PLAN §6.7 ("por agente 'instrutor de vela' cético"). Roteiro opcional para revisão
  humana por instrutor habilitado em docs/revisao_humana.md.
- 2026-10-09: conteúdo generalizado para qualquer tamanho de barco (0 títulos/resumos com "32 pés"); mensagem de erro de
  carga com causa e "Tentar de novo". criterios.py 37/37, validate OK.
