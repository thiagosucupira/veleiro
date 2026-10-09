# Projeto: De leigo a velejador transatlântico (veleiro 32 pés)

> Documento-mestre para um agente executor. Leia inteiro antes de começar.
> Criado em 2026-10-07. Dono: Thiago (Brasil). Idioma de todo o conteúdo: **português do Brasil**.

## 0. Objetivo
Um sistema web **local** (abre via `file://` ou `./run.sh`, sem nuvem/claude.ai — preferência do usuário) que leva uma pessoa
leiga até estar habilitada e preparada para comandar um veleiro de ~32 pés em travessia oceânica (transatlântica).
Qualidade-alvo: igual ou superior aos melhores materiais online (RYA Day Skipper/Yachtmaster online, ASA, NauticEd,
cursos brasileiros de Arrais/Mestre/Capitão).

## 1. Estrutura de abas (app/index.html, single-page com navegação por abas)
1. **Roteiro** — passo a passo da habilitação: linha do tempo/gráfico (Gantt/escada) com cada etapa, pré-requisitos,
   documentos, custos estimados, duração, horas de mar recomendadas, checkboxes de progresso (localStorage, com try/catch).
2. **Curso: Arrais-Amador** — curso interativo completo.
3. **Curso: Mestre-Amador** — idem.
4. **Curso: Capitão-Amador** — idem (inclui navegação astronômica).
5. **Vela prática & Veleiro 32 pés** — anatomia do veleiro em 3D, mareação, manobras, rizos, ancoragem, homem ao mar.
6. **Travessia oceânica** — meteorologia oceânica, rotas (Pilot Charts, ARC), sistemas, quartos de serviço, segurança (ISAF/World Sailing OSR Cat 1), saúde, provisões.
7. **Rádio, segurança e certificados complementares** — radioperador (VHF/SSB/GMDSS), primeiros socorros, sobrevivência no mar.
8. **Onde estudar** — mapa (Leaflet + OpenStreetMap) de escolas/cursos para as provas e de **locais para experiência prática**
   (escolas de vela, clubes, iates clube, flotilhas, charters, regatas como tripulante, ARC/rallies, crew-finder sites).
9. **Simulados** — banco de questões estilo prova da Marinha por nível, modo prova cronometrado, correção comentada, estatísticas.
10. **Glossário & Referências** — termos náuticos com ilustração, links oficiais (NORMAMs, DPC, Capitanias).

## 2. Habilitações (VERIFICAR NA FONTE ANTES DE ESCREVER — regras mudaram com a NORMAM-211/DPC, 2023+)
Hipótese de trabalho a confirmar via pesquisa web em fontes oficiais (marinha.mil.br/dpc, Capitanias):
- **Arrais-Amador (ARA)**: navegação interior. Prova teórica na Capitania/Delegacia/Agência; idade mínima, atestado médico, taxa (GRU).
- **Mestre-Amador (MSA)**: interior + costeira (limites a confirmar). Pré-requisitos (ARA? tempo de embarque?) a confirmar.
- **Capitão-Amador (CPA)**: navegação oceânica sem limites; prova inclui navegação astronômica. Pré-requisito MSA (confirmar).
- **Motonauta** não é necessário para o objetivo (mencionar só para distinguir).
- Complementares: certificado de radioperador (confirmar se Anatel/Marinha e qual categoria para VHF/SSB/DSC),
  curso de primeiros socorros, sobrevivência no mar / World Sailing Offshore Personal Survival (ISAF), curso de
  meteorologia. Equivalências internacionais úteis para charter/atravessar: **ICC**, **RYA** (Competent Crew → Day Skipper →
  Coastal Skipper → Yachtmaster Offshore/Ocean), **ASA 101–108**. Mostrar como opcionais/complementares e quando valem a pena.
- Registrar para cada uma: requisitos, documentos, taxas, conteúdo programático oficial, formato da prova (nº questões,
  nota mínima), validade/renovação, links oficiais. **Cada fato com URL da fonte e data de consulta** em `research/sources.md`.

## 3. Cursos interativos (abas 2–7) — requisitos pedagógicos
Cada curso = módulos → lições curtas → checagem de compreensão → simulado do nível. Programa derivado do conteúdo
programático OFICIAL da Marinha (buscar o PDF/anexo da NORMAM vigente). Cobrir, no mínimo:
- ARA: RIPEAM (regras de rumo e governo, luzes, marcas, sinais sonoros — com simulador visual de luzes noturnas),
  balizamento IALA-B (Brasil usa região B — confirmar) com boias em 3D/SVG, nomenclatura, nós (animações passo a passo),
  segurança e salvatagem, combate a incêndio, legislação (RLESTA/NORMAM), meteorologia básica, primeiros socorros, manobras.
- MSA: navegação costeira — carta náutica interativa (plotagem de rumo, marcação, ponto por duas marcações, corrente/abatimento,
  triângulo de corrente), agulha (desvio/declinação: Rv/Rm/Rag com calculadora), marés (tábua da DHN, regra dos doze avos),
  auxílios eletrônicos (GPS, radar, AIS), meteorologia costeira, cartas sinóticas.
- CPA: navegação estimada oceânica, navegação astronômica (sextante 3D, esfera celeste 3D, reta de altura,
  Almanaque Náutico, meridiana, simulador de cálculo), derrota ortodrômica vs loxodrômica (globo 3D), meteorologia oceânica,
  GMDSS, gerenciamento de tripulação.
- Vela prática: mareação interativa (ângulo do vento aparente vs pano, triângulo de vento verdadeiro/aparente),
  pontos de vela, cambar/jibe animados, rizar, heave-to, MOB.

Recursos visuais exigidos: **Three.js** (veleiro 32' manipulável, esfera celeste, globo com rotas), SVG/D3 animados,
Chart.js para gráficos de progresso, diagramas interativos, flashcards com repetição espaçada, quizzes com feedback explicado.
Bibliotecas só via CDN permitido (cdnjs/jsdelivr/unpkg) — ou vendorizar em `app/assets/` para funcionar offline (preferível).

## 4. Onde estudar / ganhar experiência (aba 8)
Pesquisa web por: escolas que preparam para ARA/MSA/CPA (por estado; priorizar o estado do usuário — perguntar onde mora),
escolas de vela (ex.: clubes em Rio, Ilhabela, Florianópolis, Salvador, Angra, Porto Alegre — confirmar), escolas RYA/ASA no
Brasil e exterior, iates clubes com programas de tripulação, regatas oceânicas para embarcar como tripulante (Refeno,
Santos–Rio, etc. — confirmar), sites crew-finder (Crewseekers, Find a Crew, ARC crew), entregas de barcos (delivery crew).
Campos: nome, cidade, coords, tipo (prova/prática/ambos), cursos, site, contato, preço se público, data da verificação.
Salvar em `app/data/locais.json`. Nada inventado: só entra com URL verificada.

## 5. Escada de experiência prática (no Roteiro)
Leigo → curso de vela em dingue/monotipo → curso de oceano/cruzeiro (tripulante) → ARA → milhas costeiras como tripulante →
MSA → skipper costeiro diurno → noturno → travessias de 24–72 h → CPA → offshore >500 mn como tripulante → travessia
oceânica como imediato → transatlântica como comandante. Incluir metas de milhas/noites (referência: requisitos RYA Yachtmaster
Offshore/Ocean como benchmark) e checklist de competências.

## 6. Método do agente executor (ultracode / workflows)
1. **Pesquisa** (workflow multi-agente): fontes oficiais Marinha/DPC; conteúdo programático; provas antigas/questões públicas;
   benchmark de materiais online (RYA, ASA, NauticEd, escolas BR); locais. Salvar em `research/*.md` com URLs.
2. **Verificação adversarial**: cada fato regulatório checado por 2 agentes independentes; divergências → marcar "a confirmar".
3. **Design**: carregar skill `frontend-design`/`taste-skill`; definir design system (tema náutico, tokens claro/escuro, mobile).
4. **Construção** em paralelo por aba (`app/tabs/<aba>.js` + dados JSON), sem conflitos de arquivo.
5. **Banco de questões**: ≥150 questões ARA, ≥150 MSA, ≥150 CPA, cada uma com explicação e referência normativa.
6. **QA**: abrir no navegador, testar todas as abas, quizzes, 3D, responsivo, offline; corrigir.
7. **Revisão de conteúdo** por agente "instrutor de vela" cético procurando erros técnicos.
8. Entregar caminho `file://` e `run.sh`. **Não** publicar como Artifact (preferência do usuário).

## 7. Critérios de pronto
- Todas as 10 abas funcionais, offline, PT-BR, claro/escuro, mobile.
- Todo fato regulatório com fonte + data; aviso "confirme na Capitania antes da prova".
- Cada nível: curso completo + simulado + flashcards.
- Mapa com ≥30 locais verificados.
- Aviso de segurança: o sistema não substitui instrução prática nem habilitação oficial.

## 8. Perguntas em aberto para o usuário
- Cidade/estado onde mora (prioriza locais).
- Orçamento e prazo desejado.
- Quer também trilha internacional (RYA/ICC) para fretar no exterior?

## 9. Estrutura de pastas
```
veleiro_certificacoes/
  PLAN.md            ← este arquivo
  docs/              ← decisões, design system, notas de QA
  research/          ← sources.md, normas.md, locais.md, benchmark.md
  app/index.html, app/tabs/, app/assets/, app/data/
  run.sh             ← python3 -m http.server e abre o navegador
```

## 10. Decisões do usuário (2026-10-07) — substituem a seção 8
- **App público para a comunidade**, não pessoal. Tudo configurável por quem usa, nada fixo para um usuário só.
- Onboarding/configurações (salvos em localStorage com try/catch): cidade/região de base (opcional), ritmo/prazo (opcional),
  trilha internacional RYA/ICC **ligada por padrão**, com opção de desligar e ocultar.
- Locais: cobertura **nacional** (todo o litoral + polos de águas interiores) + exterior para a trilha internacional;
  filtros por estado/tipo/curso e "perto de mim" (geolocalização opcional). O autor é nômade e mora em João Pessoa: o Nordeste
  (JP/Cabedelo, Recife, Natal, Salvador) deve estar bem coberto, mas sem viés de personalização.
- Qualquer Capitania serve: a aba Roteiro lista como achar e agendar a prova em qualquer Capitania/Delegacia/Agência.
- Sem prazo fixo: o roteiro mostra durações típicas e o usuário define o próprio ritmo.
- Publicação: site estático (sem backend), pronto para hospedar em GitHub Pages/Netlify. Incluir README de deploy e licença
  (sugerir MIT para o código e CC BY-SA para o conteúdo), página "Sobre/Contribuir" e aviso legal.
