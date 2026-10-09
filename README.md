# Veleiro — de leigo a transatlântico

Curso aberto, gratuito e em português do Brasil que leva qualquer pessoa, do zero, até estar habilitada pela
Marinha do Brasil (Arrais-Amador → Mestre-Amador → Capitão-Amador) e preparada para comandar um veleiro de
cruzeiro (de qualquer tamanho) numa travessia oceânica.

> **Aviso:** este é um material de estudo comunitário. **Não substitui instrução prática com instrutor habilitado
> nem a habilitação oficial** emitida pela Marinha do Brasil. Normas, taxas e procedimentos mudam: confirme
> sempre na Capitania, Delegacia ou Agência antes da prova. Não use as cartas de treinamento para navegar.

## O que tem dentro
- **Roteiro** da habilitação desenhado como uma derrota numa carta náutica: etapas, pré-requisitos, documentos,
  custos oficiais, durações típicas ajustadas ao seu ritmo, horas de mar recomendadas e checklist de progresso.
- **Cursos** de Arrais-Amador, Mestre-Amador e Capitão-Amador, seguindo o programa oficial (NORMAM-211/DPC, Anexo 5-A),
  mais Vela prática e veleiro de cruzeiro, Travessia oceânica, e Rádio, segurança e certificados.
- **Simuladores:** veleiro de cruzeiro 3D, esfera celeste e sextante 3D, globo com rotas, carta náutica interativa, luzes e sinais
  sonoros do RIPEAM, balizamento IALA B, nós animados, marés, mareação, manobras, carta sinótica, rádio VHF/DSC.
- **Simulados** no formato da prova (40 questões, tempo oficial), com correção comentada, e **flashcards** com
  repetição espaçada. Gráficos de progresso.
- **Onde estudar e praticar:** mapa com escolas, clubes, regatas, rallies e Capitanias em todo o Brasil e no exterior,
  com filtros e "perto de mim".
- **Glossário e referências** com links oficiais.
- Tema claro e escuro, funciona no celular e **offline**. Seu progresso fica só no seu navegador (com backup em arquivo).

## Como usar
- **Sem instalar nada:** abra `app/index.html` no navegador (duplo clique). Funciona via `file://`.
- **Com servidor local:** `./run.sh [porta]` (usa `python3 -m http.server`, escolhe a próxima porta livre a partir de
  8000 e abre o navegador). `./run.sh --no-open` sobe o servidor sem abrir o navegador, `./run.sh --file` abre via
  `file://`, `./run.sh --check` valida os dados e `./run.sh --help` mostra as opções.
- **Mapa:** a camada de ruas do OpenStreetMap só é pedida se a pessoa ligar a chave no mapa (e precisa de internet);
  por padrão o app não faz nenhuma requisição externa. Todo o resto funciona sem rede.

## Publicar (site estático)
O site é a pasta `app/`. Não há build.

### GitHub Pages
1. Crie um repositório e envie este projeto (`git init && git add . && git commit -m "Veleiro" && git push -u origin main`).
2. Em *Settings → Pages → Build and deployment → Source*, escolha **GitHub Actions**. O workflow já incluído
   (`.github/workflows/pages.yml`) valida os dados e publica a pasta `app/` a cada push na `main`.
3. O endereço será `https://<usuário>.github.io/<repositório>/`.

Alternativa sem Actions: publique só a pasta `app/` numa branch `gh-pages`
(`git subtree push --prefix app origin gh-pages`) e escolha essa branch, pasta `/` (root), em *Settings → Pages*.

### Netlify
- Arraste a pasta `app/` em <https://app.netlify.com/drop>, ou
- conecte o repositório com **Publish directory** = `app` e **Build command** vazio (já há um `netlify.toml`).

### Qualquer outro servidor estático
Copie o conteúdo de `app/` para a raiz pública (nginx, Apache, S3, Cloudflare Pages…). Não precisa de backend.

## Estrutura
```
app/            site estático (index.html, core/, tabs/, widgets/, data/, assets/)
research/       pesquisa com fontes: sources.md (fatos verificados), normas.md, programa_provas.md, locais_*.md…
docs/           decisões, arquitetura, design system, status, QA e revisão técnica
tools/          validação (validate.mjs), geração de dados (build_fontes.py, build_locais.py), captura de telas (qa_shot.py)
```

## Contribuir
Veja a aba **Sobre e contribuir** no app e `docs/arquitetura.md`. Resumo:
- **Achou um erro?** Abra uma *issue* com a lição/questão, o que está errado e a fonte (de preferência oficial).
- **Fatos regulatórios** (NORMAM, taxas, provas, requisitos) só entram com fonte oficial, URL e data de consulta,
  via `research/` e `tools/build_fontes.py`. O que não for confirmado aparece com o selo amarelo "a confirmar".
- **Locais** só entram com site conferido; use `research/locais_manuais.json` e `tools/build_locais.py`.
  O script gera **dois** arquivos de propósito: `app/data/locais.js` é o que o app lê; `app/data/locais.json` é a mesma
  base em JSON legível, a fonte canônica para revisar diffs, conferir por script ou reaproveitar os dados. Não edite
  nenhum dos dois à mão (o próximo `build_locais.py` sobrescreve ambos) e não apague o `.json`.
- **Rota `#/lab/<widget>`** é uma ferramenta de desenvolvimento (monta um widget isolado para teste, com `?opts={...}`).
  Fica fora do menu e declara `noindex, nofollow` enquanto aberta; não faz parte do produto e não deve ser divulgada.
- Rode `node tools/validate.mjs` e `python3 tools/qa_shot.py` antes de enviar (`rota@@seletor` clica só naquela rota; ver `--help`).

## Licenças
- **Código:** MIT — ver `LICENSE`.
- **Conteúdo** (lições, questões, flashcards, glossário, dados de locais e pesquisa): **CC BY-SA 4.0** — ver
  `LICENSE-CONTEUDO.txt`.
- Bibliotecas e dados de terceiros: ver `app/assets/vendor/LICENSES.md`.
- A NORMAM-211/DPC e demais normas citadas são documentos públicos da Marinha do Brasil; este projeto não é oficial e
  não tem vínculo com a Marinha.
