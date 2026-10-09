# Registro de decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-10-07 | Seção 10 do PLAN.md prevalece sobre a seção 8: app público e configurável; nada fixo para uma pessoa. | Pedido do usuário. |
| 2026-10-07 | Site estático em JS clássico (sem módulos ES, sem `fetch` local), namespace global `VL`. | Precisa abrir por `file://` (o Chrome bloqueia módulos e fetch em `file://`) e hospedar em GitHub Pages/Netlify sem build. |
| 2026-10-07 | Bibliotecas vendorizadas: three 0.180 (IIFE via esbuild, com OrbitControls/CSS2DRenderer), Leaflet 1.9.4, Chart.js 4.5.1, D3 7.9, fonte Atkinson Hyperlegible Next. | Funcionar offline; three ≥ r160 não tem mais build UMD. |
| 2026-10-07 | Mapa offline com Natural Earth (domínio público) + malha das UFs do IBGE; tiles OSM só como camada opcional online. | Offline obrigatório; OSM exige internet. |
| 2026-10-07 | Fatos regulatórios só entram via `data/fontes.js`, gerado de `research/_work` por `tools/build_fontes.py`. Status "confirmado" exige 2 verificadores independentes (lente fonte + lente atualidade). | Regra "nada inventado" e selo "a confirmar" automático. |
| 2026-10-07 | Locais só entram com veredito independente ok/corrigir (`tools/build_locais.py`); descartes registrados em `research/locais_descartados.md`. | ≥ 60 locais verificados com URL. |
| 2026-10-07 | Acesso a marinha.mil.br via Chrome real com depuração remota + `tools/fetchsvc.py`; o usuário autorizou o desafio da Cloudflare. | A Cloudflare bloqueia `curl` e Chrome automatizado. |
| 2026-10-07 | Cursos seguem o Anexo 5-A da NORMAM-211 (PDF consolidado de 03/03/2026, que prevalece sobre o ZIP de anexos onde divergem). | Programa oficial; o PDF é mais novo no 5-A (itens de combustível). |
| 2026-10-07 | Cursos podem ser divididos em partes (`partes: [...]`) para vários autores trabalharem em paralelo sem conflito de arquivo. | Construção multi-agente. |
| 2026-10-07 | Simulados no formato oficial: 40 questões; ARA 2 h, MSA 3 h, CPA 4 h; aprovação com 5,0 de 10. CPA com 5 alternativas (A–E), ARA/MSA com 4 (o formato de alternativas de ARA/MSA não é público: as provas são destruídas). | Anexo 5-A e provas CPA publicadas pela DPC. |
| 2026-10-07 | Design "Carta"/"Quarto de vigia" (ver `docs/design-system.md`). | Skill frontend-design; linguagem da carta náutica como gramática da interface. |
| 2026-10-07 | Licenças: MIT (código) e CC BY-SA 4.0 (conteúdo). | Pedido do usuário (PLAN §10). |
| 2026-10-08 | Profundidade da verificação por risco: fatos regulatórios da lista do usuário (NORMAM-211/DPC, categorias, radioperador, taxas, provas, agendamento: tópicos normas, programa, taxas, radio e fatos extras dos autores) → 2 verificadores independentes (lentes fonte + atualidade); conteúdo técnico (RIPEAM/IALA/DHN), trilha internacional, travessia e fatos achados na pesquisa de locais → 1 verificador (fonte) + checagem literal automática do trecho (`tools/check_quotes.py`). Benchmark não é exibido no app. | Duas quedas por limite de uso; a checagem literal automática achou 95% dos trechos na fonte, o que reduz o risco nas categorias não regulatórias. |
| 2026-10-08 | Verificadores rodam com pacotes de evidência pré-montados (`tools/verif_pack.py`, `tools/loc_pack.py`, `tools/check_sites_all.py`) e modelo mais leve. | Economia de cota sem perder independência (cada verificador decide sozinho). |
| 2026-10-09 | Onde o PDF consolidado da NORMAM-211 e o ZIP de anexos divergem, vale o PDF (Rev. 1, Portaria 200/2026). | Investigação verificada em research/normam211_versoes.md: o ZIP está defasado (anexos salvos antes das modificações de 2025). |
| 2026-10-09 | Glossário publica só verbetes com fonte reconhecida verificada (89-retirar-sem-fonte.js). | Regra "nada inventado"; 2 verbetes retirados (research/glossario_retirados.md). |
| 2026-10-09 | Conteúdo generalizado para qualquer tamanho de veleiro de cruzeiro; o 32 pés fica só como exemplo explícito onde há conta (velocidade de casco, energia, tanques, luzes) e regras por comprimento são expressas por faixa (RIPEAM 12 m/20 m/50 m, NORMAM 6 m/12 m/24 m). | Pedido do usuário: o app serve para qualquer barco. |
| 2026-10-09 | Erro de carga explica a causa (servidor parado / arquivo ausente) e oferece "Tentar de novo". | Usuário viu "Não foi possível carregar data/cursos/arrais.js" ao usar um servidor local que foi desligado. |
