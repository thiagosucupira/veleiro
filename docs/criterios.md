# Critérios de pronto verificados no navegador

Gerado por `tools/criterios.py` em 2026-10-09 (Chrome headless, `file://`, rede externa bloqueada).

**37 de 37 critérios OK.**

| Critério | Resultado | Evidência |
|---|---|---|
| §7 Todas as abas funcionais, offline, PT-BR — desktop claro | OK | 11 abas; lang=pt-BR; fundo=rgb(246, 249, 250); erros=[]; externas=[]; falhas=[] |
| §7 Todas as abas funcionais, offline, PT-BR — celular escuro | OK | 11 abas; lang=pt-BR; fundo=rgb(8, 21, 33); erros=[]; externas=[]; falhas=[] |
| §7 Todas as abas funcionais, offline, PT-BR — desktop escuro | OK | 11 abas; lang=pt-BR; fundo=rgb(8, 21, 33); erros=[]; externas=[]; falhas=[] |
| §7 Todas as abas funcionais, offline, PT-BR — celular claro | OK | 11 abas; lang=pt-BR; fundo=rgb(246, 249, 250); erros=[]; externas=[]; falhas=[] |
| §7 Todo fato regulatório com fonte + data de consulta | OK | 1377 fatos em data/fontes.js, 1377 com URL e data; lição de legislação com 7 links de fonte e 0 selos 'a confirmar' |
| §7 Aviso 'confirme na Capitania antes da prova' | OK | texto presente no rodapé e no aviso legal das lições |
| §7 arrais: curso + simulado cronometrado + flashcards com repetição espaçada | OK | 83 lições; 199 questões (199 comentadas com referência); prova com 40 questões, relógio '1:59:59', saída protegida por confirmação=True; 179 flashcards, avaliação SM-2 gravada=True |
| §7 mestre: curso + simulado cronometrado + flashcards com repetição espaçada | OK | 74 lições; 198 questões (198 comentadas com referência); prova com 40 questões, relógio '2:59:59', saída protegida por confirmação=True; 176 flashcards, avaliação SM-2 gravada=True |
| §7 capitao: curso + simulado cronometrado + flashcards com repetição espaçada | OK | 75 lições; 198 questões (198 comentadas com referência); prova com 40 questões, relógio '3:59:59', saída protegida por confirmação=True; 174 flashcards, avaliação SM-2 gravada=True |
| Gráficos de progresso (Chart.js) | OK | 1 gráficos desenhados após 3 tentativas registradas |
| §7/§10 ≥60 locais verificados com URL (cobertura nacional + exterior, Nordeste bem coberto) | OK | 192 locais verificados fora de órgãos marítimos (NE 40, exterior 56, 22 UFs) + 69 Capitanias/Delegacias/Agências |
| §10 Mapa offline com marcadores e 'perto de mim' (geolocalização) | OK | 66 marcadores; após geolocalização (João Pessoa simulada) 30 distâncias; primeiros: ['Escola Náutica Portaló Serviços Náuticos João Pessoa, PB Preparatório CHA a 0,5 km', 'Capitania dos Portos da Paraíba (CPPB) João Pessoa, PB Capitania a 2,8 km', 'Amar Escola Náutica Cabedelo, PB Preparatório CHA a 7,8 km']; externas=[] |
| §10 Filtros/busca de locais | OK | busca 'Cabedelo' → 5 itens |
| §10 Boas-vindas com base e ritmo opcionais; trilha internacional ligada por padrão | OK | diálogo=True, 4 passos concluídos sem preencher nada, intl padrão=True, UF padrão vazia=True |
| §10 Trilha internacional pode ser desligada e ocultada | OK | elementos intl visíveis: ligada=5, desligada=0; itens RYA/ASA na lista com trilha desligada=0 |
| §10 App público: nada fixo para uma pessoa | OK | nenhuma referência pessoal no código/conteúdo ([]) |
| §10 Roteiro: como agendar em qualquer Capitania (mais próxima primeiro com base configurada) | OK | 30 menções a Capitania; com base PB aparece a Capitania dos Portos da Paraíba |
| §10 Sem prazo fixo: durações recalculadas pelo ritmo do usuário | OK | 4 h/sem: 'As 12 etapas somam cerca de 941 horas, ou ≈ 4,5 anos neste ritmo.' → 16 h/sem: 'As 12 etapas somam cerca de 941 horas, ou ≈ 14 meses neste ritmo.' |
| Recurso visual: veleiro-3d | OK | canvas=1, svg=1 |
| Recurso visual: esfera-celeste | OK | canvas=1, svg=0 |
| Recurso visual: globo-rotas | OK | canvas=1, svg=2 |
| Recurso visual: sextante | OK | canvas=1, svg=1 |
| Recurso visual: boias-iala | OK | canvas=1, svg=21 |
| Recurso visual: carta-nautica | OK | canvas=0, svg=11 |
| Recurso visual: ripeam-luzes | OK | canvas=0, svg=2 |
| Recurso visual: nos | OK | canvas=0, svg=14 |
| Recurso visual: sinais-sonoros | OK | canvas=0, svg=9 |
| Recurso visual: regras-governo | OK | canvas=0, svg=1 |
| Recurso visual: mares | OK | canvas=0, svg=6 |
| Recurso visual: agulha-calc | OK | canvas=0, svg=2 |
| Recurso visual: manobras | OK | canvas=0, svg=1 |
| Recurso visual: mareacao | OK | canvas=0, svg=3 |
| Recurso visual: meteo-sinotica | OK | canvas=0, svg=18 |
| Recurso visual: vhf-sim | OK | canvas=0, svg=2 |
| Recursos visuais sem erro de console/rede | OK | erros=[] externas=[] |
| §10 Site estático pronto para GitHub Pages/Netlify, README de deploy, licenças MIT + CC BY-SA | OK | {"README.md": true, "LICENSE": true, "LICENSE-CONTEUDO.txt": true, "netlify.toml": true, ".github/workflows/pages.yml": true, "run.sh": true} |
| §10 Página Sobre/Contribuir com aviso legal | OK | seções de aviso legal, contribuição e licenças presentes |
