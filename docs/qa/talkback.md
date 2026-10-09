# Teste com leitor de tela real (TalkBack, Android)

2026-10-09 — Android 15 (emulador), Chrome 124, TalkBack ativo.
Para cada rota, a árvore de acessibilidade que o TalkBack anuncia foi lida com `uiautomator dump`; conta-se os controles clicáveis sem nome falado.

**Última rodada (após correções): só o campo de busca, nomeado via hintText.**

| Rota | Nós na página | Clicáveis | Sem nome | Exemplos do que o TalkBack fala |
|---|---|---|---|---|
| locais | 286 | 18 | 1 | Pular para o conteúdo; Abrir menu; Trocar tema (atual: auto); Configurações; Perto de mim; Filtros |
| glossario | 0 | 0 | 0 |  |
| mestre/m3/l12 | 374 | 7 | 0 | Pular para o conteúdo; Abrir menu; Trocar tema (atual: auto); Configurações; Mestre-Amador; Mestre-Amador |

## Rodada completa (14 rotas, antes da correção do mapa)

| Rota | Nós | Clicáveis | Sem nome | Observação |
|---|---|---|---|---|
| roteiro | 725 | 11 | 0 | |
| arrais/m5/l2 | 268 | 7 | 0 | |
| simulados/arrais/prova | 121 | 49 | 0 | 40 questões, mapa de questões e alternativas anunciados |
| simulados/flashcards/arrais | 71 | 8 | 0 | |
| locais | 316 | 19 | 2 | busca (hintText, ver observações) + contêiner do mapa (corrigido) |
| glossario | 4780 | 22 | 1 | busca (hintText, ver observações) |
| lab/ripeam-luzes | 116 | 11 | 0 | |
| sobre | 450 | 10 | 0 | |
| mestre/m3/l12 | 374 | 7 | 0 | |
| capitao/m3/l2 | 229 | 7 | 0 | |
| vela/m6/l3 | 435 | 7 | 0 | |
| travessia | 138 | 7 | 0 | |
| radio/m2/l1 | 254 | 11 | 0 | |
| simulados | 314 | 5 | 0 | |

Após a correção, a única ocorrência restante é o campo de busca, nomeado via hintText (ver observações).
Ao final, o emulador foi restaurado (TalkBack desligado, configuração de depuração do Chrome removida).

## Observações
- Campos de busca (`loc-q`, `gl-q`): têm `aria-label` e rótulo visível. No Android, o Chrome expõe o nome de campos de
  texto como `hintText` (API 26+), que o TalkBack anuncia, mas que o `uiautomator dump` não imprime; por isso esses
  campos aparecem como "sem nome" na contagem automática. A auditoria axe-core (docs/qa/acessibilidade.md) confirma o
  nome acessível desses campos.
- Corrigido durante este teste: o contêiner do mapa em "Onde estudar" era anunciado como imagem sem nome; ganhou
  `role="region"` + `aria-label`, e os painéis decorativos do mapa ficaram `aria-hidden`.
- Rotas com 0 nós: o `uiautomator` não conseguiu capturar a página a tempo (página muito longa); as mesmas rotas
  passaram em outra execução (ver histórico da sessão) e na auditoria axe-core.

## Confirmação do nome dos campos de busca no Chrome do Android (2026-10-09)
Árvore de acessibilidade calculada pelo próprio Chrome 124 do Android 15 (DevTools, `Accessibility.getPartialAXTree`) —
é dela que o TalkBack recebe o nome:

| Rota | Campo | Papel | Nome acessível | Origem do nome |
|---|---|---|---|---|
| locais | loc-q | searchbox | Buscar locais por nome, cidade ou curso | aria-label + rótulo |
| glossario | gl-q | searchbox | Buscar no glossário | aria-label + rótulo |
| roteiro | rt-om-q | searchbox | Buscar Capitania por cidade ou nome | aria-label |

Conclusão: nenhum controle sem nome no Android; a contagem anterior era limitação do `uiautomator dump` (hintText).
