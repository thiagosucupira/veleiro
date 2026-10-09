# QA: abas Roteiro e Onde estudar

Data: 2026-10-08. Escopo: `app/tabs/roteiro.js`, `app/tabs/roteiro/*`, `app/data/roteiro.js`, `app/assets/css/tabs/roteiro.css`,
`app/tabs/locais.js`, `app/tabs/locais/*`, `app/assets/css/tabs/locais.css`. Ferramentas: `tools/qa_shot.py` e scripts Playwright
próprios (Chrome do sistema, headless, `file://`), `node tools/validate.mjs`, conferência dos preços contra `data/locais.js`.

## Resultado em uma linha
As duas abas passam nos critérios (0 erros de console, 0 exceções, 0 requisições externas em `--offline`, sem rolagem horizontal
em 390, 360 e 320 px). Sete defeitos corrigidos; dois pontos menores ficam como observação.

## Roteiro

| Verificação | Resultado |
|---|---|
| Derrota-carta legível no desktop (1440) e no celular (390, 360, 320) | Passa. Linha de rumo, 12 waypoints, rosa dos ventos, sondagens e legenda legíveis nos temas claro e escuro. |
| Clique em cada waypoint abre `#/roteiro/<etapa>` | Passa nas 12 etapas: o hash muda e o painel mostra a etapa. Deep link por recarga também passa nas 12. Teclado: Enter/Espaço (cada waypoint tem `role=button` e `aria-label`). |
| Checkboxes persistem | Passa. 2 competências marcadas, página recarregada: continuam marcadas e o contador mostra "2 de 6". Marcar a etapa como concluída persiste e atualiza o resumo e a carta. |
| Linha do tempo recalcula com o ritmo | Passa. 941 h no total: 6 h/semana dá 3,0 anos; 4 h dá 4,5 anos; 15 h dá 14 meses. As barras, o painel da etapa e o total mudam juntos. |
| "Como agendar em qualquer Capitania" | Passa. Com `uf: PB` a primeira da lista é a CPPB (2,2 km da capital), marcada como a mais próxima; com `lat/lon` de Porto Alegre vem a CFPA (0,7 km); sem base a lista fica por estado e aparece o convite para configurar. Filtros por estado e busca funcionam (69 organizações militares, 27 UFs). |
| Custos só oficiais (com selo) ou faixa de preços públicos | Passa. Os preços de cursos são calculados em tempo de execução a partir de `preco` dos locais. Conferi os 37 pontos de preço de `data/roteiro.js` contra o texto de `data/locais.js`: todos existem. Duas ressalvas já explicadas na tela (R$ 69,99 aparece como "69,99" no banco; Capitão da Navegart R$ 2.220 é a soma de R$ 1.050 + R$ 1.170, dita na nota). As 191 referências (141 fatos distintos) de `data/roteiro.js` existem em `data/fontes.js` e todas estão `confirmado`. |
| Trilha internacional desligada | Passa: 0 elementos `data-intl="on"` visíveis. |
| Complementares | Passa (radioperador, primeiros socorros e sobrevivência, com fonte e custo). |

### Corrigido (Roteiro)
1. **Rótulo "20 milhas da costa" colidia com rótulos de etapa** (visível no celular: batia em "Curso de cruzeiro" e na sondagem "62").
   `carta.js` agora escolhe, depois de calcular os rótulos, o trecho da linha com menos sobreposição; no celular usa "20 milhas";
   as sondagens também evitam o rótulo.
2. **Link "Onde estudar e praticar" de cada etapa abria a aba sem filtro**: usava `locais?tipos=` com nomes do banco (`escola-vela`,
   `preparatorio-cha`…), mas a aba Locais lê `tipo=` com ids de filtro (`escola`, `cha`…). Corrigido em `comum.js`
   (`R.consultaLocais`, tabela de conversão) e `painel.js`. Etapas com rally ou escola RYA/ASA passam `escopo=todos`, porque esses
   locais ficam no exterior. Conferido nas etapas 1, 4, 3 e 12.
3. **Taxa oficial sem o valor**: a linha da GRU em "Quanto custa" dizia "valor vigente em 2026" sem o número. Agora diz
   "R$ 60,32 em 2026", fato `taxas-01` (confirmado, Portaria 251/2025-DPC).
4. **Plural**: "Ver os 1 preço usados" virou "Ver o preço usado".

## Onde estudar

| Verificação | Resultado |
|---|---|
| Mapa offline sem requisição externa por padrão | Passa. `--offline`: `externas: []`, `falhas: []` em desktop, celular, claro e escuro. Base: Natural Earth + IBGE desenhados localmente. |
| Camada OSM só se ligada | Passa. Ao ligar, o app pede `tile.openstreetmap.org`; com a rede bloqueada ele desliga a chave sozinho e avisa. Desligada, zero requisições. |
| Filtros por UF, tipo, curso e busca | Passa. PB = 6 locais; PB + escola de vela = 1; curso Mestre = 96; busca "cabedelo" = 5; URL reflete o estado (`#/locais?uf=PB`) e é restaurada ao recarregar. |
| "Perto de mim" via base configurada | Passa. Com `uf: 'PB'` o botão "Usar minha base: João Pessoa (PB)" ordena por distância (0,6 km, 2,2 km, 8,4 km…). Também testados: geolocalização do aparelho (Recife), seletor de estado (RS) e "Parar de usar". |
| Lista sincronizada com o mapa | Passa nos dois sentidos: clicar no item abre o balão; clicar no marcador destaca o item e rola a lista. "Só o que está visível no mapa" reage ao zoom (188 → 120). |
| Popups com site e data de verificação | Passa: botão "Abrir o site", "Verificado em 07/10/2026" e link da página que comprova. Preço público vem com aviso "confirme antes de pagar". |
| Trilha intl desligada esconde escolas RYA/ASA | Passa: Tudo 261 → 247, o filtro "Escola RYA ou ASA" e os cursos RYA/ASA/ICC somem, e uma URL com `tipo=intl` é limpa. |
| Contagem ≥ 60 locais fora Capitanias | Passa: 261 no total, 69 Capitanias, **192** fora delas (validate.mjs: `sem_orgaos 192`). Nordeste 58, exterior 56. Todos têm site e data de verificação. |

### Corrigido (Locais)
5. **Mapa escondido sob a barra do alto no celular** ao usar "Ver no mapa": a rolagem deixava o topo do mapa atrás da barra fixa.
   `locais.css`: `scroll-margin-top` no mapa, na lista e na seção de tripulante.
6. **Balão do mapa ficava por baixo dos botões de zoom no celular** (o título "Amar Escola Náutica" perdia a primeira letra).
   `mapa.js`: em mapa estreito o balão é mais estreito e o auto-pan reserva 60 px à esquerda.
7. **Plural** no resumo: "1 local encontrados" virou "1 local encontrado".

## Observações (não corrigidas)
- **Celular, rolagem sobre o mapa**: o mapa ocupa 62% da altura da tela e um dedo sobre ele arrasta o mapa, não a página. Há margem
  acima e abaixo para rolar, então não é bloqueio. Se virar queixa, usar `dragging` com dois dedos em ponteiro grosso. Arquivo:
  `app/tabs/locais/mapa.js`.
- Dados: `app/data/locais.json` e `app/data/locais.js` coexistem; só o `.js` é lido pelo app. Não é meu arquivo; conferir se o
  `.json` ainda é gerado de propósito por `tools/build_locais.py`.

## Fora dos meus arquivos
Nenhum problema encontrado.

## Como repetir
```
cd /home/sobranceiro/veleiro_certificacoes
python3 tools/qa_shot.py --out /tmp/qa --offline roteiro locais
python3 tools/qa_shot.py --out /tmp/qa --offline --mobile --dark roteiro roteiro/tempo roteiro/agendar "locais?uf=PB"
node tools/validate.mjs && python3 tools/build_manifesto.py
```

## Pendências resolvidas (fechamento)

Verificado em 2026-10-08: `tools/qa_shot.py --offline` em `locais` (desktop claro/escuro, celular claro/escuro, com `?uf=PB`) sem console, pageerrors, externas ou falhas e com `overflowX` false; `node --check` em `mapa.js` e `node tools/validate.mjs` OK.

| Pendência | O que foi feito |
|---|---|
| Celular: o mapa ocupa 62% da altura e um dedo sobre ele arrasta o mapa, não a página | Duas mudanças. (1) `app/tabs/locais/mapa.js`: em ponteiro grosso (`pointer: coarse`) o arrasto de um dedo fica desligado, então o dedo rola a página; mover o mapa pede dois dedos (o pinça-e-arrasta do Leaflet continua ligado), e um aviso "Use dois dedos para mover o mapa" aparece por ~1,4 s quando alguém arrasta com um dedo só (`aria-hidden`, pois a lista traz o mesmo conteúdo em texto; teclado e mouse não mudam). (2) `locais.css`: altura do mapa em telas até 960 px de `clamp(340px, 62vh, 520px)` para `clamp(320px, 54vh, 480px)`. Testado com toques reais via CDP em 390 px: um dedo rolou a página de 476 para 581 px sem mexer o mapa e mostrou o aviso; dois dedos moveram o mapa (marcador deslocou 80 px) sem rolar a página; o aviso some sozinho. Não testado em aparelho físico. |
| `app/data/locais.json` e `locais.js` coexistem; só o `.js` é lido | Mantido de propósito: `tools/build_locais.py` gera os dois (o `.js` é o que o app carrega; o `.json` é a fonte canônica legível, para revisar diffs e reaproveitar os dados). Documentado no README, em "Contribuir": não editar nenhum à mão e não apagar o `.json`. |

## Revisão final (ponta a ponta)

Refeito em 2026-10-09, no estado atual do app, com `tools/qa_shot.py --offline` (desktop e celular, claro e escuro), scripts Playwright próprios (Chrome do sistema, toques reais via CDP, `file://`, rede externa abortada) e `node tools/validate.mjs`. Capturas em `/tmp/claude-1000/-home-sobranceiro/767d06b5-c8a6-4493-9ee3-da137f666222/scratchpad/qaf-roteiro-locais/`. Seis PNGs abertos e conferidos (Roteiro desktop claro, Roteiro celular escuro, Agendar celular claro, Locais celular claro, Locais `?uf=PB` desktop escuro, mapa em 390 px depois do gesto).

### Resultado de cada pendência

| Pendência | Resultado | Evidência |
|---|---|---|
| Celular: um dedo sobre o mapa arrasta o mapa, não a página | **Resolvida** | Toques reais em 390, 360 e 320 px. Um dedo: a página rolou 65 a 78 px, o mapa não se moveu e o aviso "Use dois dedos para mover o mapa" apareceu (classe `loc-gesto-on`) e saiu sozinho em menos de 1,8 s (3 de 3 repetições, também depois de vir de outra aba). Dois dedos: a página não rolou (0 px) e o desenho do mapa mudou (hash do canvas diferente), 3 de 3. Sem rolagem horizontal em nenhuma largura. Continua sem teste em aparelho físico (limite já declarado no fechamento). |
| `locais.json` e `locais.js` coexistem; só o `.js` é lido | **Resolvida (justificada)** | `tools/build_locais.py` grava os dois de propósito (linhas 90 e 93: o `.json` é a fonte legível para revisar diffs; o `.js` é o que o app carrega). O README, em "Contribuir" (linha 66), documenta isso e manda não editar nenhum à mão nem apagar o `.json`. |

### Defeito novo encontrado e corrigido nesta revisão

**Erro de console ao sair da aba Onde estudar no meio da animação do mapa** (arquivo da área: `app/tabs/locais/mapa.js`). Navegando rápido entre `roteiro` e `locais` (espera de 300 ms por rota), cerca de metade das tentativas dava `TypeError: Cannot read properties of undefined (reading '_leaflet_pos')` (`_onZoomTransitionEnd` depois do `remove()`) ou `reading 'clearRect'` (`_redraw` do canvas depois do `remove()`), no celular e no desktop. Os testes do `qa_shot.py` não pegam isso porque carregam uma rota por página. Causa: o Leaflet deixa temporizadores já amarrados (fim do zoom animado e redesenho de cada renderizador de canvas, um por pane: padrão, base e rótulos) que disparam depois de `destruir()`. Correção em `destruir()`: `mapa.stop()`, cancelar o redesenho pendente de todos os renderizadores (inclusive `_paneRenderers`) antes e depois do `remove()`, e trocar os métodos que esses temporizadores chamam por funções vazias. Depois da correção: 16 de 16 rodadas de navegação rápida (8 no celular, 8 no desktop) com 0 erros; antes, 8 de 16 davam erro.

### Testes refeitos

`tools/qa_shot.py --offline`, depois da correção. Em todas as linhas: console 0, exceções 0, requisições externas 0, falhas de carga 0.

| Rota | Modo | Erros | Overflow horizontal |
|---|---|---|---|
| `roteiro`, `roteiro/tempo`, `roteiro/agendar`, `locais`, `locais?uf=PB` | desktop 1440, claro | 0 (5 de 5 rotas) | não |
| as mesmas 5 rotas | desktop 1440, escuro | 0 (5 de 5) | não |
| as mesmas 5 rotas | celular 390, claro | 0 (5 de 5) | não |
| as mesmas 5 rotas | celular 390, escuro | 0 (5 de 5) | não |
| as mesmas 5 rotas | celular 360 e 320, claro (script próprio) | 0 | não (5 de 5 em cada largura) |

Verificações funcionais no mesmo estado:

| Teste | Resultado |
|---|---|
| Roteiro: 12 waypoints com `role=button` e `aria-label`; clique em cada um muda o hash para `#/roteiro/<etapa>` | 12 de 12 |
| Locais `?uf=PB` | "6 locais encontrados · 6 no mapa", 6 itens na lista; clicar no primeiro abre o balão do mapa; 0 erros, 0 requisições externas |
| Locais sem filtro | lista paginada (30 itens por página), 0 erros |
| `node tools/validate.mjs` | OK: todos os critérios passaram (192 locais fora de Capitanias) |
| `node --check app/tabs/locais/mapa.js` | OK |

Contagem final: 2 pendências (2 resolvidas, 1 delas justificada com fonte), 1 defeito novo achado e corrigido, 0 pendências em aberto.
