# Design system — "Carta" e "Quarto de vigia"

Decidido em 2026-10-07 com a skill `frontend-design`.

## Assunto, público e tarefa
- **Assunto:** formação náutica brasileira (Arrais → Mestre → Capitão-Amador) até a travessia oceânica num veleiro de cruzeiro (de qualquer tamanho).
- **Público:** leigos de todo o Brasil, muitos no celular, estudando aos poucos; também velejadores revisando para a prova.
- **Tarefa principal:** saber o próximo passo (roteiro), estudar uma lição curta, praticar questões, achar onde praticar.

## Conceito
A interface fala a língua da **carta náutica da DHN**. Em vez de decoração, usamos as convenções que o aluno vai precisar
aprender de qualquer jeito:
- **Magenta de carta** (cor usada em faróis, rotas e informações sobrepostas nas cartas) = rota, links e ações.
- **Itálico** = nomes de águas (*Baía de Todos os Santos*, *Atlântico Norte*), como nas cartas.
- **Amarelo da bandeira Q** (sinal internacional) = selo "a confirmar".
- **Moldura de carta** ("neatline" com escala alternada) em volta de simuladores e cenas 3D: são instrumentos.
- **Cores de boia e de luz de navegação** (vermelho, verde, branco, amarelo) aparecem só em conteúdo de navegação,
  nunca como cor de interface — para não confundir o aluno.

O elemento memorável é o **Roteiro desenhado como uma derrota plotada numa carta**: a habilitação vira uma linha de
rumo em magenta, com waypoints (etapas), sondagens em itálico e rosa dos ventos. O resto é sóbrio.

## Cores (tokens em `app/assets/css/tokens.css`)
| Token | Claro "Carta" | Escuro "Quarto de vigia" | Uso |
|---|---|---|---|
| `--paper` | `#f6f9fa` | `#081521` | fundo (águas profundas) |
| `--shoal` | `#dceaf3` | `#102536` | painéis, blocos, hover |
| `--land` | `#e8d9a8` | `#3b3522` | terra (mapas, carta) |
| `--ink` | `#0f2a40` | `#dce7ef` | texto |
| `--magenta` | `#a0186b` | `#e070b8` | rota, links, ações |
| `--aviso` | `#f0be2c` | `#e9c24e` | "a confirmar" |
| `--ok` / `--erro` | `#1f7a4d` / `#c3272f` | `#4fc48c` / `#f2737a` | respostas certas/erradas |

O escuro segue a ideia do modo noturno de ECDIS: fundo azul-marinho profundo, contraste suficiente, sem branco puro.

## Tipografia
- **Atkinson Hyperlegible Next** (variável 200–800, com itálico), vendorizada. Escolhida pela legibilidade para
  leigos e leitura longa no celular — e porque distingue bem I/l/1 e O/0, importante em rumos e coordenadas.
- Escala (17 px base): 13 · 17 · 20 · 25 · 31 · 39 · 49. Títulos 760, `letter-spacing` levemente negativo.
- Números tabulares em todo o app (rumos, horários, coordenadas alinham).
- Medida de leitura: 68 caracteres nas lições.

## Layout
```
Desktop                                   Celular
┌────────┬──────────────────────────┐     ┌──────────────────────┐
│ marca  │ barra: título · tema · ⚙ │     │ ☰  título      ◐  ⚙ │
│ Rumo   ├──────────────────────────┤     ├──────────────────────┤
│ Cursos │ conteúdo (68ch nas       │     │ conteúdo em coluna   │
│ Mar    │ lições; largo nas        │     │ única; índice do     │
│ Ferram.│ ferramentas e cenas)     │     │ curso recolhível     │
│ Projeto│                          │     │                      │
└────────┴──────────────────────────┘     └──────────────────────┘
```
Alinhamento à esquerda. Painéis planos com tinta de baixio (`--shoal`) em vez de cartões com sombra. Raio por
hierarquia: 6 px controles, 10 px painéis, 14 px diálogos, 2 px instrumentos.

## Revisão contra os clichês
- Não é creme + serifa + terracota; não é preto com acento neon; não é jornal com filetes; não é kit de cartões SaaS.
- Sem rótulos em caixa alta, sem "eyebrows", sem setas em botões, sem monoespaçada para dados (usamos numerais tabulares).
- Mudança feita na revisão: a primeira ideia era um fundo "papel envelhecido" — trocamos pelo branco-azulado das
  águas profundas da carta, que é o fundo real de uma carta náutica e evita o clichê do creme.
