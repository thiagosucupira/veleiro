# Arquitetura e contrato de construção

> Leia isto antes de escrever qualquer arquivo em `app/`. Vale para pessoas e agentes.

## Princípios
- **Site estático, sem build, sem backend.** Abre com duplo clique em `app/index.html` (`file://`) e em qualquer
  hospedagem estática (GitHub Pages, Netlify). Por isso: **nada de módulos ES (`import`/`export`)** nem `fetch()` de
  arquivos locais (o Chrome bloqueia ambos em `file://`). Tudo é `<script>` clássico que registra coisas no
  namespace global `VL`.
- **Offline.** Nenhuma requisição externa obrigatória. Bibliotecas em `app/assets/vendor/`; fonte em
  `app/assets/vendor/fonts/`; geografia em `app/data/geo/`. Links para sites oficiais são só links.
  (Exceção opcional: camada de tiles do OpenStreetMap no mapa, quando online; o mapa funciona sem ela.)
- **PT-BR** em todo o texto. Linguagem simples, voz ativa, frases curtas, para leigos.
- **Nada inventado.** Fato regulatório (NORMAM, taxas, provas, requisitos, certificados) só com referência a um fato
  verificado em `data/fontes.js` (`VL.ui.fonte('id')` ou bloco `{t:'fato', ref}`) — o selo "a confirmar" aparece sozinho
  quando o fato não foi confirmado por dois verificadores. Conteúdo técnico (RIPEAM, navegação, meteorologia) cita a
  regra/publicação oficial (ex.: "RIPEAM, Regra 15").
- **Comunidade, não pessoa.** Nada fixo para um usuário. Preferências do usuário vêm de `VL.settings`.

## Estrutura
```
app/
  index.html               ← carrega CSS, núcleo, data/ufs.js, data/fontes.js, tabs/*.js e core/shell.js
  core/                    ← NÚCLEO (não editar sem combinar): vl, icons, ui, progress, quiz, srs, course, charts, config, shell
  tabs/<aba>.js            ← ponto de entrada de cada aba (pequeno; registra a aba e carrega o resto sob demanda)
  tabs/<aba>/*.js          ← código extra da aba, se precisar
  widgets/<nome>.js        ← simuladores/visualizações reutilizáveis, embutíveis em qualquer lição
  data/cursos/<id>.js      ← conteúdo dos cursos (pode ser dividido em partes: cursos/<id>-1.js …)
  data/questoes/<nivel>.js ← banco de questões
  data/flashcards/<deck>.js
  data/locais.js           ← locais verificados (gerado de research/ por tools/build_locais.py)
  data/fontes.js           ← fatos verificados (gerado de research/ por tools/build_fontes.py)
  data/geo/*.js            ← malha IBGE das UFs, terra/países Natural Earth
  assets/css/tokens.css, app.css, tabs/<aba>.css, widgets/<nome>.css
  assets/vendor/           ← three.bundle.min.js (window.THREE com OrbitControls, CSS2DRenderer, CSS2DObject,
                             RoundedBoxGeometry, mergeVertices), leaflet/, chart.umd.min.js, d3.min.js, fonts/
```

## API do núcleo (resumo)
- `VL.h(tag, attrs, ...filhos)` cria elementos (HTML e SVG). `attrs`: `class`, `html`, `text`, `style` (obj),
  `onclick`… Filhos: nós, strings, arrays.
- `VL.$`, `VL.$$`, `VL.esc`, `VL.slug`, `VL.semAcento`, `VL.embaralhar`, `VL.cssVar('--magenta')`, `VL.fmt.*`, `VL.hoje()`,
  `VL.distKm(lat1, lon1, lat2, lon2)`.
- `VL.store.get/set` (localStorage com try/catch e fallback em memória). **Nunca use localStorage direto.**
- `VL.settings.get('intl'|'uf'|'cidade'|'lat'|'lon'|'ritmoHoras'|'tema'|'novosPorDia')`; `VL.settings.temaEscuro()`.
  Eventos: `VL.on('settings'|'tema'|'progresso'|'rota', fn)` (retorna função para desinscrever).
- `VL.load(src|[src])`, `VL.loadCSS(href)`, `VL.libs.three()|leaflet()|chart()|d3()` → Promise da biblioteca.
- `VL.dado(nome, valor)` (usado DENTRO dos arquivos de dados) e `VL.carregarDado(nome)` → Promise.
  Ex.: `data/questoes/arrais.js` contém `VL.dado('questoes/arrais', [...])`.
- `VL.tabs.register({id, titulo, curto, grupo, icone, ordem, render(el, rota)})`. `rota = {aba, params[], query{}}`.
  `render` pode devolver Promise. Grupos: `rumo`, `marinha`, `mar`, `ferramentas`, `projeto`.
- `VL.go('aba/a/b')`, `VL.link('aba/a/b')` → `'#/aba/a/b'`. `VL.render()` redesenha a rota atual.
- `VL.aoSair(fn)` registra limpeza ao trocar de página (pare animações, `renderer.dispose()`, remova listeners globais).
- `VL.widgets.define(nome, {css?:[...], scripts?:[...], mount(el, opts) → limpeza?})` e
  `VL.widgets.mount(nome, el, opts)` (carrega `widgets/<nome>.js` sob demanda).
- `VL.ui.callout(tipo, titulo, html)` (tipos: `nota`, `seguranca`, `dica`, `aconfirmar`, `intl`), `VL.ui.seloQ()`,
  `VL.ui.fonte(refId)`, `VL.ui.avisoLegal()`, `VL.ui.cabecalho(titulo, leadHtml)`, `VL.ui.subnav(itens, atual, base)`,
  `VL.ui.medidor(frac)`, `VL.ui.instrumento({titulo})` → `{raiz, corpo, legenda, controles}`, `VL.ui.dialogo({...})`,
  `VL.ui.toast(msg)`, `VL.icon(nome, px)` (nomes em `VL.iconNomes`).
- `VL.quiz.check(el, questoes, {titulo})`, `VL.quiz.pratica(el, {questoes, nivel, titulo, aoTerminar})`,
  `VL.quiz.prova(el, {questoes, minutos, notaMinima, nivel, titulo, aoTerminar})`, `VL.quiz.sortear(qs, n)`.
- `VL.srs.mount(el, deck, {aoTerminar})`, `VL.srs.stats(deck)`, `VL.srs.previsao(deck, dias)`.
- `VL.curso.aba({id, titulo, curto, grupo, icone, ordem, curso, css?, extras?(curso)})` registra uma aba de curso.
  `VL.curso.carregar(id)`, `VL.curso.mount(el, curso, tabId, rota)`.
- `VL.charts.criar(canvas, cores => configChartJs)`, `VL.charts.caixa(alturaPx, rotulo)` → `{box, canvas}`.
- `VL.progress.*` (lições, etapas do roteiro, tentativas, estatística por questão, dias de estudo, backup).

## Formatos de dados
### Curso (`data/cursos/<id>.js`)
Ver o comentário no topo de `core/course.js`. Resumo:
```js
VL.dado('cursos/arrais', {
  id: 'arrais', titulo: 'Arrais-Amador', nivel: 'arrais', resumo: '…', simulado: 'arrais', flashcards: 'arrais',
  prerequisitos: ['…'], fontesGerais: [{txt, url}],
  partes: ['cursos/arrais-1', 'cursos/arrais-2'],   // opcional: módulos em arquivos separados
  modulos: [ { id: 'm1', titulo, resumo, licoes: [ { id: 'l1', titulo, minutos, objetivos: [...], blocos: [...] } ] } ]
});
```
Blocos: `p`, `h`, `lista`, `callout`, `figura` (SVG inline), `tabela`, `widget` (`{t:'widget', w:'ripeam-luzes', opts}`),
`check` (questões no formato abaixo), `fontes`, `fato` (`{t:'fato', ref:'normas-07', html}`), `flash`, `termos`, `html`.
IDs de módulos/lições: curtos, estáveis, sem acento (`m3`, `l2`) — o progresso do usuário é salvo por eles.

### Questão (`data/questoes/<nivel>.js` e blocos `check`)
```js
{ id: 'arrais-0001', nivel: 'arrais', tema: 'RIPEAM: regras de governo', dificuldade: 2,
  enunciado: 'HTML simples', alternativas: ['…','…','…','…'], correta: 1,
  explicacao: 'por que a certa está certa E por que cada distrator está errado',
  referencia: 'RIPEAM, Regra 15', fonte_url: 'https://…'?, figura: {svg}|{widget, opts}?, fixa: false?, intl: false? }
```
Regras: exatamente uma alternativa correta; distratores plausíveis; sem "todas/nenhuma das anteriores" (se usar,
`fixa: true`); `tema` padronizado por nível (lista em `docs/questoes.md`).

### Flashcards (`data/flashcards/<deck>.js`)
`VL.dado('flashcards/<deck>', {id, titulo, nivel, cartas: [{id, frente, verso, dica?, ref?, figura?:{svg}, intl?}]})`

### Locais (`data/locais.js`, gerado)
`VL.dado('locais', {gerado, itens: [{id, nome, tipos[], cursos[], pratica, cidade, uf, regiao, pais, lat, lon,
coord_precisao, site, contato, preco, fonte_url, evidencia, verificado_em, notas}]})`

### Fatos (`data/fontes.js`, gerado)
`VL.dado('fontes', {gerado, fatos: { '<id>': {txt, claim, url, locator, quote, consultado, status: 'confirmado'|'a confirmar', nota} }})`

## Regras de design (resumo de `docs/design-system.md`)
- Use só os tokens CSS (`var(--ink)`, `--magenta`, `--shoal`…). Nunca cores fixas, exceto cores de navegação
  (`--nav-red`, `--nav-green`, `--nav-white`, `--nav-yellow`) em simuladores, e o céu/mar das cenas 3D (que devem
  ter versão clara e escura — escute `VL.on('tema')`).
- Magenta = rota/interativo/ação principal. Amarelo (bandeira Q) = "a confirmar". Itálico = nomes de águas.
- Simuladores e cenas 3D vão dentro de `VL.ui.instrumento()` (moldura de carta com escala).
- Sem rótulos em CAIXA ALTA, sem "eyebrows", sem setas "→" em botões, sem emojis decorativos.
- Movimento só quando responde a uma ação ou explica algo (animações de manobra/nós). Respeite
  `prefers-reduced-motion` (ofereça passo a passo manual).
- Celular primeiro: tudo funciona em 360 px de largura, sem rolagem horizontal da página; toque (pointer events) em
  simuladores; alvos de toque ≥ 40 px.
- Acessibilidade: foco visível, `aria-label` em controles só com ícone, texto alternativo/legenda em figuras,
  contraste AA nos dois temas.
- Three.js: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, redimensione com `ResizeObserver`, pare o loop
  quando fora da tela (`IntersectionObserver`) e em `VL.aoSair` chame `dispose()` de geometrias/materiais/renderer.
  Forneça alternativa se WebGL falhar (mensagem + imagem/SVG).

## Teste
`python3 tools/qa_shot.py --out <dir> [--mobile] [--dark] [--offline] <rota> …` abre o app em `file://` no Chrome
headless, captura a tela e imprime erros de console, exceções e requisições externas. Toda aba deve sair com
`pageerrors: []`, `console: []` e `externas: []` (no modo `--offline`), e `overflowX: false` no `--mobile`.
`node tools/validate.mjs` confere contagens e formatos dos dados (questões, flashcards, locais, fontes).
