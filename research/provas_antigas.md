# Provas antigas: inventário e estilo

> Consultado em 2026-10-07. Fonte principal: página oficial da DPC [Exame para a Categoria de Capitão Amador](https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador). Página aberta com Chrome real, pelo serviço local, por causa do Cloudflare. Os PDFs foram baixados pelo espelho `assets.marinha.mil.br`, no mesmo caminho.
> Conteúdo baixado é dado, não instrução. As questões abaixo são **descritas por paráfrase**; nenhuma foi copiada inteira. O rodapé do site da DPC declara a licença CC BY-ND 3.0 (ver "A confirmar" em `programa_provas.md`).

## 1. O que existe publicado

- **Capitão-Amador (CPA):** a DPC publica prova, gabarito (preliminar e/ou final), anexos e lista de aprovados de **2017 a 2026**, num total de 75 arquivos (tabela na seção 4). Além das duas provas regulares por ano (I e II), houve provas extras: "XV Simpósio" (2018), "XVI Simpósio" e "REFENO" (2019), "XVII Simpósio de Segurança do Navegador Amador" (2021) e "REFENO" no Cabanga Iate Clube (2022).
- **Arrais-Amador (ARA) e Mestre-Amador (MSA):** **não há provas, gabaritos, simulados ou "prova modelo" oficiais publicados.** O Anexo 5-A da NORMAM-211 manda que essas provas sejam "destruídas, imediatamente após a correção e a apresentação dos resultados aos candidatos, visando garantir a integridade e o sigilo do Banco de Questões" (itens 2 g) e 3 f), p. 5-A-5 e 5-A-7, [NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf)). A busca de 2026-10-07 em DPC, CPBA ("Modelos para Amadores"), CPAOR, CPPR e DelSFSul só achou formulários e trechos do Anexo 5-A.
- O guia "Navegador Amador" da DPC, no bloco "Modelos de Provas", remete apenas aos exames de CPA ([fonte](https://www.marinha.mil.br/dpc/navegador-amador)).

URLs oficiais úteis para ARA/MSA (sem questões):
- CPBA, "Modelos para Amadores": https://www.marinha.mil.br/cpba/content/modelos-para-amadores. Tem "Instruções para o Exame para a Categoria de Arrais Amador / Mestre Amador / Capitão Amador", PDFs que reproduzem trechos do Anexo 5-A. O de CPA está **desatualizado**: fala em inscrições em "fevereiro e junho" e provas em "abril e agosto".
- CPAOR, "Habilitação de Amadores": https://www.marinha.mil.br/cpaor/amadores. Tem requisitos de ARA/MSA/CPA, calendário do CPA-II/2026 e link para o Anexo 5-A.
- DelSFSul, FAQ: https://www.marinha.mil.br/delsfsul/perguntas-frequentes-amadores. Descreve o formato dos exames. Diverge da norma na duração do MSA (2 h em vez de 3 h).

## 2. Provas baixadas e analisadas

| Prova | Arquivo oficial | Páginas | SHA-256 (8 primeiros) | Gabarito |
|---|---|---|---|---|
| CPA-I/2026 | [2026-05/prova.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-05/prova.pdf) | 22 (questões em 17; anexos ANB em 4) | 6693e98b | [Gabarito final, 01/06/2026](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-06/gabaritofinal.pdf): **questão 20 "CANCELADA"** |
| CPA-II/2026 | [2026-10/CPA-II-2026-MATRIZ.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/CPA-II-2026-MATRIZ.pdf) | 17 (anexos ANB em 4) | eb30d7da | [Gabarito **preliminar**, 06/10/2026](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/2-ES-CPA-II-2026-GABARITO-PRELIMINAR-06OUT2026.pdf). O final, segundo a CPAOR, sai "até 05 de novembro de 2026" |
| CPA-I/2025 | [2025-04/Prova-CPA-I-2025-REV-5.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-04/Prova-CPA-I-2025-REV-5.pdf) | 21 (anexos ANB em 6) | a663e00c | [Gabarito final](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-06/Gabarito_Final_CPA-I-2025_0.pdf) |
| CPA-II/2025 | [2025-08/Exame-CPA-II-2025.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-08/Exame-CPA-II-2025.pdf) | 21 (anexos ANB em 6) | 0ea00e9a | [Gabarito final, 11/09/2025](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-09/PS-CPA-II-2025-GABARITO-FINAL.pdf) |
| CPA-II/2023 (comparação) | [2025-02/CPA2_PROVA_2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_PROVA_2023.pdf) + [Anexo (2) extrato de carta](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Anexo_extrato_carta_nautica.pdf) | 17 + 1 | 1509c2b7 | (não analisado) |

Cópias locais (fora do repositório, efêmeras): `scratchpad/programa/web/dl/`.

## 3. Estilo das provas de Capitão-Amador (análise própria)

### 3.1 Forma
- **40 questões, 5 alternativas (A)–(E), uma correta.** Vale para as quatro provas de 2025–2026.
- **Valor:** a CPA-II/2026 traz "(Valor: 0,25 cada questão – Valor Total: 10,0 pontos)". A CPA-II/2023 traz "(Valor: 0,25 ponto cada questão – Valor Total: 10,0 pontos)". A CPA-I/2025, a CPA-II/2025 e a CPA-I/2026 não trazem essa linha no texto extraído.
- **Elaboração:** os cadernos são do "Centro de Instrução Almirante Graça Aranha" (CIAGA). Os gabaritos de 2025-II e 2026 são assinados pela "Comissão de Elaboração da Prova para o Exame de Habilitação para Capitão Amador".
- **Anexos:** nas quatro provas de 2025–2026, só extratos do **Almanaque Náutico Brasileiro**: tábua "A2 Correção de altura de 10°–90° – Sol, estrelas e planetas", páginas diárias da data do problema, "Acréscimos e correções" e "Conversão de arco em tempo". Na **CPA-II/2023**, o Anexo 01 foi um **extrato de carta náutica com rosa de rumos**, usado numa questão de conversão de rumo verdadeiro em magnético e da agulha.
- **Material:** para o CPA, a norma exige régua paralela e/ou esquadros e compasso (Anexo 5-A, 1 d) III).

### 3.2 Tipos de questão (contagem aproximada por busca de padrões no texto)

| Tipo | CPA-I/2025 | CPA-II/2025 | CPA-I/2026 | CPA-II/2026 |
|---|:-:|:-:|:-:|:-:|
| Bloco de cálculo encadeado de navegação astronômica (mesma situação) | Q1–5 | Q1–6 | Q1–8 | Q1–6 (+2 conceituais de sextante) |
| "Analise as afirmativas/proposições" (I–IV, com combinações) | 3 | 3 | 5 | 2 |
| Correlação de colunas ("cada número pode não ser adotado ou ser adotado mais de uma vez") | 2 | 2 | 3 | 1 |
| Completar lacunas | 1 | 2 | 1 | 2 |
| Sequência V/F | 0 | 0 | 0 | 2 |
| Comando negativo (INCORRETA / NÃO / em DESACORDO) | 3 | 4 | 3 | 5 |
| Cita a bibliografia pelo nome ("De acordo com o livro…") | 0 | 1 (Miguens) | 6 (Jaime R. da Costa Felipe) | 4 (3 Felipe + 1 Miguens) |
| Figura para interpretar | rosa de manobra radar | rosa de manobra radar; imagem de satélite IR | rosa de manobra radar; carta sinótica | rosa de manobra radar |

### 3.3 Distribuição por assunto (classificação própria, questão a questão)

| Assunto (Anexo 5-A, 1.1) | CPA-I/2025 | CPA-II/2025 | CPA-I/2026 | CPA-II/2026 |
|---|:-:|:-:|:-:|:-:|
| a) Navegação astronômica | 5 | 6 | 8 | 8 |
| b) Navegação eletrônica (radar, paralela indexada, ARPA/AIS, GNSS, ENC/ECDIS, VTS) | 6 | 7 | 8 | 1 |
| c) Estabilidade (inclui nomenclatura de casco e esforços estruturais) | 6 | 4 | 5 | 6 |
| d) Meteorologia e oceanografia (inclui marés, ondas, correntes, mau tempo) | 6 | 7 | 6 | 6 |
| e) Comunicações (VHF/DSC, GMDSS, EPIRB/SART, RENEC, NAVAREA, CIS) | 9 | 6 | 5 | 6 |
| f) Sobrevivência no mar | 5 | 6 | 5 | 7 |
| g) Carta náutica e publicações (projeção de Mercator, escala, Carta 12000, desvio da agulha, derrota ortodrômica) | 3 | 4 | 3 | 6 |
| **Total** | 40 | 40 | 40 | 40 |

Leitura: o **peso varia muito de prova para prova**. Navegação eletrônica teve 8 questões na I/2026 e 1 na II/2026. O bloco de astronomia (5 a 8 questões, 12,5% a 20% da nota) aparece sempre e sempre sobre a **passagem meridiana do Sol com o ANB**, exatamente o recorte do item 1.2 do programa.

### 3.4 Exemplos de enunciado (PARAFRASEADOS)
- *Astronomia, situação comum:* um iate ou veleiro em travessia (ex.: Noronha→Rio; Florianópolis→Noronha; Índico rumo às Seychelles; Pacífico rumo a Galápagos) tem posição estimada, elevação do olho, erro instrumental do sextante, HMG e altura instrumental do limbo do Sol. Pede-se, em sequência: a hora legal prevista da culminação, a declinação, a distância zenital, a altura verdadeira, a latitude meridiana, a longitude e o azimute na passagem meridiana. As alternativas são valores numéricos próximos entre si (diferenças de minutos de arco).
- *Radar:* uma rosa de manobra com seis alvos plotados em dois instantes. O candidato associa cada alvo a uma situação: rumo de colisão, alvo parado, afastando-se, mesmo rumo e velocidade, hora prevista da colisão.
- *Paralela indexada:* qual cuidado **não** deve ser adotado (ex.: modo de movimento relativo/verdadeiro, orientação da tela, pulso e escala do radar).
- *GNSS:* como a geometria dos satélites (DOP) afeta a precisão.
- *Cartografia:* afirmativas sobre escala de carta, com conta de conversão de milímetros na carta para metros; propriedades da projeção de Mercator; o que uma carta **não** mostra.
- *Agulha:* completar um quadro de rumos (verdadeiro, giroscópico, magnético, da agulha) a partir de declinação magnética e desvio.
- *Meteorologia:* sinais da aproximação de uma frente fria no litoral Sul/Sudeste; significado de isóbaras muito juntas na carta sinótica; regra de Buys-Ballot no Hemisfério Sul; tipos de nevoeiro; ZCIT; furacões; declividade crítica de arrebentação de onda.
- *Mau tempo:* qual manobra é adequada com vento sustentado forte e vagas altas (capear, correr com o tempo, âncora de arrasto, através).
- *Comunicações:* prefixos MAYDAY / MAYDAY RELAY / PAN PAN / SÉCURITÉ; função do DSC; áreas GMDSS A1–A4; SART em 9 GHz; RENEC; canal 16 e alternativos; equipamentos de rádio obrigatórios pela NORMAM-211 para embarcação de grande porte.
- *Sobrevivência:* racionamento de água na balsa nas primeiras 24 h; posição HELP; resgate por helicóptero (esperar o estropo tocar a água para descarregar a estática); peixes perigosos; pé de imersão e congelamento; odômetro improvisado na balsa.
- *Estabilidade:* centro de carena, metacentro, GZ e GM; alquebramento × contra-alquebramento; borda livre e reserva de flutuabilidade; trim/derrabada; porte líquido × porte bruto; TPC; curva de deslocamento. Uma questão da CPA-I/2025 cita literalmente "um veleiro de 32 pés".

### 3.5 Implicações para o app (análise própria)
1. Treinar o **cálculo de passagem meridiana com o ANB** como bloco fixo de 5 a 8 questões.
2. Dar exercícios de **interpretação de figura**: rosa de manobra, carta sinótica e imagem de satélite.
3. Cobrir os formatos "afirmativas I–IV", correlação de colunas e comando negativo, que respondem por grande parte das questões.
4. Usar como referência primária a bibliografia do item 1.9, sobretudo **Jaime R. da Costa Felipe** e **Miguens**, citados pelo nome nas questões.
5. Para ARA/MSA não há prova oficial publicada. Os simulados do app devem ser **autorais e derivados do programa** (Anexo 5-A, 2.1 e 3.1), com aviso claro de que não reproduzem o banco oficial.

## 4. Inventário completo da página da DPC (2017–2026)

Ordem e rótulos como na página oficial, consultada em 2026-10-07. Todos os links estão em `https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/…`.

| Ano | Documento (rótulo na página DPC) | Tipo | Formato | URL |
|---|---|---|---|---|
| 2026 | CPA - I - Prova | prova | PDF | [prova.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-05/prova.pdf) |
| 2026 | CPA - I - Gabarito Final | gabarito | PDF | [gabaritofinal.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-06/gabaritofinal.pdf) |
| 2026 | CPA - I - Relação dos Aprovados | aprovados | PDF | [aprovados.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-06/aprovados.pdf) |
| 2026 | CPA - II - Gabarito Preliminar | gabarito | PDF | [2-ES-CPA-II-2026-GABARITO-PRELIMINAR-06OUT2026.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/2-ES-CPA-II-2026-GABARITO-PRELIMINAR-06OUT2026.pdf) |
| 2026 | CPA - II - Prova | prova | PDF | [CPA-II-2026-MATRIZ.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/CPA-II-2026-MATRIZ.pdf) |
| 2025 | CPA-I - Prova | prova | PDF | [Prova-CPA-I-2025-REV-5.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-04/Prova-CPA-I-2025-REV-5.pdf) |
| 2025 | CPA-I - Gabarito Final | gabarito | PDF | [Gabarito_Final_CPA-I-2025_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-06/Gabarito_Final_CPA-I-2025_0.pdf) |
| 2025 | CPA-I - Relação dos Aprovados (Retificado) | aprovados | PDF | [APROVADOS-CPA-I-2025-RETIFICADO-ALT2.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-07/APROVADOS-CPA-I-2025-RETIFICADO-ALT2.pdf) |
| 2025 | CPA-II - Prova | prova | PDF | [Exame-CPA-II-2025.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-08/Exame-CPA-II-2025.pdf) |
| 2025 | CPA-II - Gabarito Final | gabarito | PDF | [PS-CPA-II-2025-GABARITO-FINAL.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-09/PS-CPA-II-2025-GABARITO-FINAL.pdf) |
| 2025 | CPA-II - Relação dos Aprovados | aprovados | PDF | [Relacao_CPA_II_2025.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-09/Relacao_CPA_II_2025.pdf) |
| 2024 | CPA-1 - Prova | prova | PDF | [CPA1_PROVA_2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA1_PROVA_2024.pdf) |
| 2024 | CPA-1 - Gabarito Final | gabarito | PDF | [CPA1_GABARITO_2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA1_GABARITO_2024.pdf) |
| 2024 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [CPA1_APROVADOS_2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA1_APROVADOS_2024.pdf) |
| 2024 | CPA-2 - Prova | prova | PDF | [CPA2_PROVA_2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_PROVA_2024.pdf) |
| 2024 | CPA-2 - Gabarito Final | gabarito | PDF | [CPA2_GABARITO2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_GABARITO2024.pdf) |
| 2024 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [CPA2_APROVADOS_2024.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_APROVADOS_2024.pdf) |
| 2023 | CPA-1 - Prova | prova | PDF | [PROVA_PS-CPA-I-2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/PROVA_PS-CPA-I-2023.pdf) |
| 2023 | CPA-1 - Anexos | anexos | PDF | [ANEXOS_CPA-I-2023_ANB.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/ANEXOS_CPA-I-2023_ANB.pdf) |
| 2023 | CPA-1 - Gabarito Final | gabarito | PDF | [CPA1_GABARITO_2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA1_GABARITO_2023.pdf) |
| 2023 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [Relacao-Aprovados---CPA-I-2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Relacao-Aprovados---CPA-I-2023.pdf) |
| 2023 | CPA-2 - Prova | prova | PDF | [CPA2_PROVA_2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_PROVA_2023.pdf) |
| 2023 | CPA-2 - Anexo (1) | anexos | PDF | [Anexos_nav_astro.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Anexos_nav_astro.pdf) |
| 2023 | CPA-2 - Anexo (2) | anexos | PDF | [Anexo_extrato_carta_nautica.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Anexo_extrato_carta_nautica.pdf) |
| 2023 | CPA-2 Gabarito Final | gabarito | PDF | [CPA2_GABARITO_2023.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA2_GABARITO_2023.pdf) |
| 2023 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [Aprovados_CPA_II-2023-RETIFICADO.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Aprovados_CPA_II-2023-RETIFICADO.pdf) |
| 2022 | CPA-1 - Prova | prova | PDF | [PROVA-CPA-1-2022_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/PROVA-CPA-1-2022_0.pdf) |
| 2022 | CPA-1 - Gabarito Final | gabarito | PDF | [Gabarito_final-CPA-1-2022.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Gabarito_final-CPA-1-2022.pdf) |
| 2022 | CPA-1 - Anexos | anexos | ZIP | [CPA-Anexos.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA-Anexos.zip) |
| 2022 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [Relacao_Final-CPA1-2022.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Relacao_Final-CPA1-2022.pdf) |
| 2022 | CPA-2 - Prova | prova | PDF | [PROVA_PS-CPA-II-2022.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/PROVA_PS-CPA-II-2022.pdf) |
| 2022 | CPA-2 - Anexos | anexos | ZIP | [Anexos-CPA-II-2022.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Anexos-CPA-II-2022.zip) |
| 2022 | CPA-2 - Gabarito Final | gabarito | PDF | [PS-CPA-II-2022-Gabarito_Final.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/PS-CPA-II-2022-Gabarito_Final.pdf) |
| 2022 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [CPA-II-2022_relafinal_aprovados_RET2.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/CPA-II-2022_relafinal_aprovados_RET2.pdf) |
| 2022 | Prova Extra - REFENO | prova | ZIP | [Prova_e_Relacao_dos_Anexos-CPA-Extra-REFENO_2022.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Prova_e_Relacao_dos_Anexos-CPA-Extra-REFENO_2022.zip) |
| 2022 | Prova Extra - REFENO - Gabarito | gabarito | PDF | [PS-CPA-EXTRA-Cabanga_Iate_Clube-22SET2022-GABARITO.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/PS-CPA-EXTRA-Cabanga_Iate_Clube-22SET2022-GABARITO.pdf) |
| 2021 | CPA-1 - Gabarito Final | gabarito | PDF | [Gabarito_Final-CPA-1-2021.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Gabarito_Final-CPA-1-2021.pdf) |
| 2021 | CPA-1 - Prova e Anexos | prova+anexos | ZIP | [Prova_CPA-I-2021_e_anexos.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Prova_CPA-I-2021_e_anexos.zip) |
| 2021 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [RELACAO_DE_APROVADOS_CAPITAO-AMADOR-CPA-I-2021.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-03/RELACAO_DE_APROVADOS_CAPITAO-AMADOR-CPA-I-2021.pdf) |
| 2021 | CPA-2 - Prova | prova | ZIP | [Prova_CPA2-2021-2.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Prova_CPA2-2021-2.zip) |
| 2021 | CPA-2 - Gabarito Final | gabarito | PDF | [Gabarito_final-CPA-II-2021.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Gabarito_final-CPA-II-2021.pdf) |
| 2021 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [CPA-II-2021--APROVADOS-ATUALIZADO.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/CPA-II-2021--APROVADOS-ATUALIZADO.pdf) |
| 2021 | CPA-Extra - Prova - XVII SIMPÓSIO DE SEGURANÇA DO NAVEGADOR AMADOR | prova | ZIP | [PROVA_CPA-XVII-SIMPOSIO_DE_SEGURANCA_DO_NAVEGADOR_AMADOR.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/PROVA_CPA-XVII-SIMPOSIO_DE_SEGURANCA_DO_NAVEGADOR_AMADOR.zip) |
| 2021 | CPA-Extra - Gabarito - XVII SIMPÓSIO DE SEGURANÇA DO NAVEGADOR AMADOR | gabarito | PDF | [GABARITO-CPA_EXTRA_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/GABARITO-CPA_EXTRA_0.pdf) |
| 2020 | CPA-1 - Prova | prova | PDF | [1-PROVA-CPA-I-2020-31JUL.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/1-PROVA-CPA-I-2020-31JUL.pdf) |
| 2020 | CPA-1 - Anexos | anexos | ZIP | [2-Relacao_de_Anexos.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Relacao_de_Anexos.zip) |
| 2020 | CPA-1 - Gabarito | gabarito | ZIP | [Gabarito.zip](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Gabarito.zip) |
| 2020 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [3-Resultado_de_Aprovados-CPA-I-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/3-Resultado_de_Aprovados-CPA-I-2020.pdf) |
| 2020 | CPA-1 - Nota referente à prova | nota | PDF | [4-Nota_referente_a_Prova_de_CPA-I-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/4-Nota_referente_a_Prova_de_CPA-I-2020.pdf) |
| 2020 | CPA-2 - Prova | prova | PDF | [1-Questoes_CPAII_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/1-Questoes_CPAII_0.pdf) |
| 2020 | CPA-2 - Anexos | anexos | PDF | [2-Anexos_CPA-II_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Anexos_CPA-II_0.pdf) |
| 2020 | CPA-2 - Gabarito Final | gabarito | PDF | [3-GABARITO_final_RET-CPA-II-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/3-GABARITO_final_RET-CPA-II-2020.pdf) |
| 2020 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [4-CAPITAO-AMADOR-Aprovados-CPA-II-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/4-CAPITAO-AMADOR-Aprovados-CPA-II-2020.pdf) |
| 2020 | CPA-2 - Nota referente aos recursos | nota | PDF | [Nota-Rec-ProvaCPA-II-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Nota-Rec-ProvaCPA-II-2020.pdf) |
| 2020 | CPA-2 - Nota referente ao Gabarito | gabarito | PDF | [5-Nota_referente_a_Gabarito_Final_do_CPA-II-2020.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/5-Nota_referente_a_Gabarito_Final_do_CPA-II-2020.pdf) |
| 2019 | CPA-1 - Prova | prova | PDF | [Prova.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Prova.pdf) |
| 2019 | CPA-1 - Anexos | anexos | PDF | [2-Anexos_da_Prova.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Anexos_da_Prova.pdf) |
| 2019 | CPA-1 - Gabarito | gabarito | PDF | [Gabarito.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/Gabarito.pdf) |
| 2019 | CPA-1 - Relação dos Aprovados | aprovados | PDF | [4-Relacao_de_Aprovados.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/4-Relacao_de_Aprovados.pdf) |
| 2019 | CPA-1 - Nota informativa | nota | PDF | [5-NOTA_INFORMATIVA.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/5-NOTA_INFORMATIVA.pdf) |
| 2019 | CPA-2 - Prova e Gabarito | prova+gabarito | PDF | [1-PROVA_E_GABARITO-CPA-II-2019.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/1-PROVA_E_GABARITO-CPA-II-2019.pdf) |
| 2019 | CPA-2 - Anexos | anexos | PDF | [2-Anexos-CPA-II-2019.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Anexos-CPA-II-2019.pdf) |
| 2019 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [3-CPA-II-2019-ALT-RELACAO_DOS_APROVADOS_0.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/3-CPA-II-2019-ALT-RELACAO_DOS_APROVADOS_0.pdf) |
| 2019 | Exame extra de CPA - XVI Simpósio - Prova e Gabarito | prova+gabarito | PDF | [1-Prova_e_Gabarito_CPA-XVI_SSNA-2019.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/1-Prova_e_Gabarito_CPA-XVI_SSNA-2019.pdf) |
| 2019 | Exame extra de CPA - XVI Simpósio - Relação dos Aprovados | aprovados | PDF | [2-Relacao_de_aprovados-CPA-XVI-SSNA.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Relacao_de_aprovados-CPA-XVI-SSNA.pdf) |
| 2019 | Exame Extra de CPA - REFENO - Prova e Gabarito | prova+gabarito | PDF | [1-Prova_e_Gabarito.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/1-Prova_e_Gabarito.pdf) |
| 2019 | Exame Extra de CPA - REFENO - Relação dos Anexos | anexos | PDF | [2-Relacao_de_Anexos-CPA-REFENO.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/2-Relacao_de_Anexos-CPA-REFENO.pdf) |
| 2019 | Exame Extra de CPA - REFENO - Relação dos Aprovados | aprovados | PDF | [3-RELACAO_DE_CANDIDATOS_APROVADOS-REFENO-2019.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-03/3-RELACAO_DE_CANDIDATOS_APROVADOS-REFENO-2019.pdf) |
| 2019 | Exame Extra de CPA - REFENO - Nota orientação para recursos | nota | PDF | [4-NOTA-DE-ORIENTACAO-PARA-RECURSO-DO-EXAME-EXTRA-REFENO-2019.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-03/4-NOTA-DE-ORIENTACAO-PARA-RECURSO-DO-EXAME-EXTRA-REFENO-2019.pdf) |
| 2018 | CPA-1 - Prova e Gabarito | prova+gabarito | PDF | [cpa_prova_gabarito2018.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/cpa_prova_gabarito2018.pdf) |
| 2018 | CPA-2 - Prova e Gabarito | prova+gabarito | PDF | [Prova_e_Gabarito_CPA-II-2018.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/Prova_e_Gabarito_CPA-II-2018.pdf) |
| 2018 | CPA-2 - Relação dos Aprovados | aprovados | PDF | [RELACAO_DOS_APROVADOS-CPA-II-2018.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-02/RELACAO_DOS_APROVADOS-CPA-II-2018.pdf) |
| 2018 | Exame extra de CPA - XV Simpósio | prova | PDF | [exame_extra_simposioXV.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/exame_extra_simposioXV.pdf) |
| 2017 | CPA-1 - Prova e Gabarito | prova+gabarito | PDF | [cpa_prova_gabarito.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/cpa_prova_gabarito.pdf) |
| 2017 | CPA-2 - Prova e Gabarito | prova+gabarito | PDF | [cpa2_prova_gabarito.pdf](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2025-01/cpa2_prova_gabarito.pdf) |
