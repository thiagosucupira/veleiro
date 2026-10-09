# Rádio, balizas e segurança: certificados complementares para o veleiro oceânico

Este levantamento cobre o que um comandante amador precisa além da CHA para sair do Brasil num veleiro de 32 pés:
operador de rádio, licença da estação e MMSI, registro de EPIRB/PLB, equivalentes internacionais (RYA SRC/LRC) e cursos de
sobrevivência e primeiros socorros (World Sailing, RYA, STCW). Todas as fontes foram consultadas em 2026-10-07.

- Cada fato termina com o id da afirmação (`radio-NN`). O trecho literal que comprova cada uma está em
  `research/_work/research_radio.json`.
- NORMAM-211: o número de página é o impresso no rodapé do PDF (ex.: "4-13", "5-A-8").
- OSR (World Sailing): página do PDF "2026-2027 Version 1". A Seção 6 (Treinamento) tem o mesmo texto na Versão 2, que vale
  a partir de 1º/01/2027.
- **Aviso para o app:** regras e taxas da Anatel e da Marinha mudam por ato ou portaria. Mostrar sempre "confirme na Anatel /
  Capitania antes de agir".

## Resumo rápido

| Item | Quem emite / onde | Obrigatório? (para veleiro de médio porte em navegação oceânica) | Custo achado | ids |
|---|---|---|---|---|
| Certificado de Operador Radiotelefonista (Restrito ORR / Geral ORG) | Anatel, prova online pelo SEC | O RGST exige certificado para estação do SLMM "quando associado ao GMDSS". A NORMAM-211 não exige certificado de operador do amador (a confirmar) | Gratuito | `radio-02`, `radio-05`, `radio-12`, `radio-15` |
| Licença de Estação de Navio (VHF, HF, EPIRB, AIS...) | Anatel, módulo MMAR do Mosaico | Sim, pela NORMAM-211, art. 4.23.8 | TFI incide (valor a confirmar); gov.br diz "gratuito" | `radio-16`, `radio-28`, `radio-30`, `radio-31` |
| MMSI (prefixo 710) | Anatel, na licença (etapa UIT/GMDSS) | Exigido para estação que participa do GMDSS e para codificar a EPIRB | sem custo próprio achado | `radio-34`, `radio-35`, `radio-37` |
| VHF com DSC + HF com DSC (ou satelital) + EPIRB 406 MHz | Equipamento homologado pela Anatel | Sim, art. 4.24.2 a) e tabela 4.35 | — | `radio-21`, `radio-25`, `radio-26` |
| Registro da EPIRB/PLB | INFOSAR (DECEA), conta gov.br | Sim para EPIRB (NORMAM-211, art. 4.23.6 e); conferido na inspeção naval | sem custo achado | `radio-38`, `radio-41`, `radio-26` |
| RYA SRC (VHF/DSC) | RYA, centros reconhecidos | Não substitui o certificado brasileiro: segundo o RYA, vale só em barco britânico | Exame £76 + curso | `radio-60`, `radio-62`, `radio-64` |
| LRC (MF/HF/satélite) | MCA (Reino Unido), desde 2025 | Exigido em barco britânico com MF/HF/satélite | a confirmar | `radio-66`, `radio-67` |
| Offshore Personal Survival (World Sailing) | MNA de cada país (no Brasil: nenhum curso listado) | Regatas Cat. 0, 1, 2: 30% da tripulação, mínimo 2, incluindo o comandante | RYA 2 dias; US Sailing online US$ 165 + prática | `radio-71`, `radio-85`, `radio-87`, `radio-90` |
| Primeiros socorros | Curso listado pela MNA, ou STCW A-VI/1-3 ou superior | Cat. 1: dois tripulantes com certificado dos últimos 5 anos | CBSN/CPSO no Brasil | `radio-81`, `radio-82`, `radio-58` |

Para quem está no Brasil, o caminho documentado é: CHA de Capitão-Amador (o rádio já cai na prova), Certificado de Operador
Radiotelefonista **Geral** na Anatel (o Restrito só vale em águas nacionais, `radio-04`), licença da estação com MMSI no MMAR e
EPIRB registrada no INFOSAR. Para regatas oceânicas: curso World Sailing de sobrevivência no exterior ou online (US Sailing) e
primeiros socorros pelo CBSN/CPSO (STCW).

## 1. Certificado de operador de rádio no Brasil (Anatel)

### Quem emite e para quem

- A Anatel aplica, por convênio com a Marinha, as provas de Operador Radiotelefonista nas categorias Geral e Restrito. As
  categorias de Radiotelegrafista ficam com a Marinha. ([Anatel, Operador Radiotelefonista](https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista),
  1º parágrafo, consultado em 2026-10-07 `radio-01`)
- Pela página da Anatel, qualquer pessoa física maior de idade residente no Brasil pode obter o certificado. Ele é gratuito,
  intransferível e não vence. ([Anatel, Operador Radiotelefonista](https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista),
  parágrafo antes de "Manuais de Questões", consultado em 2026-10-07 `radio-02`)
- O regulamento diz outra coisa sobre quem pode: brasileiros e portugueses com igualdade de direitos, maiores de 16 anos.
  ([Resolução Anatel nº 777/2025, RGST](https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777),
  art. 271, §1º, consultado em 2026-10-07 `radio-13`). Ver lacunas.

### Quando o certificado é exigido

- O RGST exige Certificado de Radiotelegrafista ou Radiotelefonista, emitido ou reconhecido pela Anatel, para operar estações
  do Serviço Limitado Móvel Marítimo (SLMM) "quando associado ao GMDSS".
  ([RGST](https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777), art. 271,
  caput, consultado em 2026-10-07 `radio-12`)
- Na NORMAM-211 não achei exigência de certificado de operador para o condutor amador: os arts. 4.23 e 4.24 tratam só de
  equipamento e licença da estação. Conclusão por ausência, a confirmar.
  ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), arts. 4.23 e 4.24,
  p. 4-11 a 4-14, consultado em 2026-10-07 `radio-15`)
- O material de apoio da Anatel diz que o serviço radiotelefônico da estação de navio para o qual basta o certificado Restrito
  pode ficar com um radiotelegrafista portador do Certificado RTE.
  ([Material de apoio, Exame de Radiotelefonista](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6),
  item 2.1.9.12, p. 20, consultado em 2026-10-07 `radio-14`)

### Categorias

- O Ato nº 3449/2026 define duas categorias: Operador de Rádio Geral (ORG) e Operador de Rádio Restrito (ORR). O ORR só pode
  operar estações no território, nas águas e no espaço aéreo nacionais. Para uma travessia, o adequado seria o ORG (inferência,
  a confirmar). ([Ato Anatel nº 3449, de 11/03/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
  Anexo, "Categorias de Operadores", consultado em 2026-10-07 `radio-04`)
- A ementa de Operação de rádio II (ORG) cobre todos os subsistemas e equipamentos do GMDSS. A Legislação II inclui as regras
  da SOLAS aplicáveis ao rádio. ([Ato nº 3449/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
  Anexo, tabela de ementas, consultado em 2026-10-07 `radio-07`)

### A prova

| Categoria | Matérias | Questões | Mínimo | Tempo |
|---|---|---|---|---|
| ORR | Operação de rádio I; Legislação de radiocomunicações I; Idioma | 10 por matéria | 5 por matéria | 30 min por matéria |
| ORG | Idioma; Operação de rádio II; Legislação de radiocomunicações II | 10 por matéria | 5 por matéria | 30 min por matéria |

Fonte da tabela: [Ato nº 3449/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
Anexo, tabela de matérias, consultado em 2026-10-07 (`radio-06`). Se o ORG também faz Operação I e Legislação I não ficou claro.

- As questões são objetivas, de "certo" ou "errado", e o certificado sai de graça após a aprovação.
  ([Ato nº 3449/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
  "Exames de Qualificação", consultado em 2026-10-07 `radio-05`)
- Aprovação numa matéria vale 12 meses. Para tentar de novo, espera-se pelo menos 8 dias. Faltar sem justificativa bloqueia
  novas inscrições por 30 dias. ([Ato nº 3449/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
  "Exames de Qualificação", consultado em 2026-10-07 `radio-08`)
- A prova de Idioma cobra só termos e frases náuticas básicas. Cada questão traz as traduções para inglês, espanhol e francês,
  e as três estão certas ou erradas juntas. ([Material de apoio, versão 2026-03](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6),
  seção 3.1, p. 29, consultado em 2026-10-07 `radio-11`)
- Quem tem o Curso Especial de Radioperador Geral (EROG) da Capitania, ou certos cursos de comunicações navais da Marinha, fica
  isento de todos os testes. O CROG (curso offshore da DPC) não está na lista.
  ([Ato nº 3449/2026](https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0),
  Anexo, parágrafo de isenção, consultado em 2026-10-07 `radio-09`)

### Como se inscrever

1. Entrar no [Sistema SEC](https://sistemas.anatel.gov.br/sec) com a conta gov.br e registrar a prova (gratuito).
   ([Anatel, Operador Radiotelefonista](https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista),
   consultado em 2026-10-07 `radio-03`)
2. Estar cadastrado como usuário externo no SEI da Anatel.
3. No dia, fazer a prova online por videoconferência. É preciso ter Microsoft Teams, câmera móvel e microfone, e não pode usar
   fone de ouvido. ([Manual do Candidato, versão 2026-04.1](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/0a5f21136202dc8e4135caab170cfb45),
   item 1, p. 1, consultado em 2026-10-07 `radio-10`)
4. Estudar pelo [Material de Apoio Radiotelefonista](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6)
   (versão 2026-03). Ele cobre legislação, operação, GMDSS, COSPAS-SARSAT, DSC e o SAR brasileiro.

## 2. Rádio a bordo pela NORMAM-211

### O veleiro de 32 pés é "médio porte" nas tabelas de rádio

- O Glossário define médio porte como comprimento inferior a 24 m, exceto as miúdas (até 6 m). Um veleiro de 32 pés tem cerca
  de 9,75 m e cai nas colunas "médio porte" das tabelas. O art. 1.7 chama a faixa de 6 a 12 m de "pequeno porte", mas as tabelas
  4.33 a 4.35 não têm essa coluna. ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  Glossário, p. VII, consultado em 2026-10-07 `radio-24`)

### Equipamento obrigatório (médio porte)

| Área | Exigência | Fonte |
|---|---|---|
| Interior | VHF fixo ou portátil apenas recomendado | art. 4.24.2 c, p. 4-14 (`radio-22`) |
| Costeira | VHF com DSC; na tabela: VHF fixo obrigatório e HF dispensado | art. 4.24.2 b, p. 4-14; tabela 4.34, p. 4-22 (`radio-22`, `radio-27`) |
| Oceânica | VHF com DSC; HF com DSC (pode ser trocado por telefone ou comunicador satelital: Iridium, Inmarsat, SPOT X, Iridium GO); EPIRB 406 MHz. Na tabela: HF SSB e VHF fixo obrigatórios | art. 4.24.2 a, p. 4-14; tabela 4.35, p. 4-23 e 4-24 (`radio-21`, `radio-25`, `radio-26`) |

- Veleiro com antena de VHF no tope do mastro precisa de antena de emergência para o caso de o mastro quebrar.
  ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), art. 4.24.2,
  p. 4-14, consultado em 2026-10-07 `radio-23`)
- Navegando, o VHF fica ligado e em escuta no canal 16, ou no 70 se for DSC.
  ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), art. 4.23.4 a,
  p. 4-12, consultado em 2026-10-07 `radio-19`)
- No HF, a chamada e escuta no Atlântico Sul é na frequência internacional de socorro ou em 4.125 kHz. Também podem ser usadas
  6.215, 8.255, 12.290 e 22.060 kHz, e 4.431,8 e 8.291,1, que são as frequências das estações costeiras de iates clubes e
  marinas. ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.4 b, p. 4-12, consultado em 2026-10-07 `radio-20`)
- Os equipamentos precisam ser registrados no órgão federal competente
  ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), art. 4.23.3, p. 4-12,
  consultado em 2026-10-07 `radio-17`). Também precisam seguir as normas da Anatel ou, se forem estrangeiros, ser homologados no
  país de origem ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.7, p. 4-13, consultado em 2026-10-07 `radio-18`).

### Licença de Estação

- Toda embarcação com equipamento de radiocomunicação precisa da Licença de Estação de Navio da Anatel. A norma ainda manda ir às
  "sedes regionais", mas hoje o pedido é online. ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.8, p. 4-13, consultado em 2026-10-07 `radio-16`)

### Rádio já cai nas provas da CHA

- **Arrais-Amador:** VHF fixo e portátil, procedimentos e frequências de rotina, socorro, urgência, segurança e trânsito.
  ([NORMAM-211, Anexo 5-A](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), item 3,
  alínea h, p. 5-A-8, consultado em 2026-10-07 `radio-50`)
- **Mestre-Amador:** VHF na navegação costeira, a Rede Nacional de Estações Costeiras (RENEC) e noções de EPIRB e AIS.
  ([NORMAM-211, Anexo 5-A](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), item 2,
  alíneas m e n, p. 5-A-6, consultado em 2026-10-07 `radio-51`)
- **Capitão-Amador:** comunicações na navegação oceânica, estações de terra, EPIRB e SART, e sobrevivência no mar.
  ([NORMAM-211, Anexo 5-A](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), item 1,
  assuntos 1.6 e 1.7, p. 5-A-3, consultado em 2026-10-07 `radio-52`)

## 3. Licença da estação e MMSI na Anatel

### Passo a passo

1. Cadastro no SEI da Anatel (formulário online, termo de concordância, RG e CPF).
2. Procuração eletrônica, se houver representante.
3. Acesso ao Mosaico em apps.anatel.gov.br/acesso com a conta gov.br.
4. Autorização do Serviço de Interesse Restrito (ou notificação, se já tiver).
5. Licenciamento da estação no módulo MMAR.

Fonte: [Anatel, Serviço Móvel Marítimo](https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo), itens 1 a 5,
consultado em 2026-10-07 (`radio-28`).

### Detalhes do licenciamento

- O MMAR tem os tipos de estação "Embarcação", para o equipamento instalado a bordo, e "Estação Móvel", para equipamento portátil
  ou transportável não fixado. ([Tutorial MMAR, junho/2026](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a),
  "Tipos de Estação", consultado em 2026-10-07 `radio-29`)
- O pedido pede a Capitania de registro, o número de inscrição da embarcação e se ela faz viagem internacional ou navega em mar
  aberto. ([Tutorial MMAR](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a),
  passo 7-A, consultado em 2026-10-07 `radio-33`)
- As licenças emitidas pelo módulo não vencem, exceto as de "Embarcação em Teste".
  ([Tutorial MMAR](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a),
  campo "Validade da Licença", consultado em 2026-10-07 `radio-32`)
- **Custo, em conflito:** o tutorial diz que o licenciamento é oneroso, com Taxa de Fiscalização de Instalação (TFI) e, se
  faltar Autorização de Uso de Radiofrequência, também o PPDUR ([Tutorial MMAR](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a),
  "Pedido de Inclusão (1/26)", consultado em 2026-10-07 `radio-30`). A página gov.br do serviço diz "gratuito para o cidadão",
  com prazo de até 30 dias corridos ([gov.br](https://www.gov.br/pt-br/servicos/obter-autorizacao-para-servico-limitado-movel-aeronautico-ou-maritimo),
  "Outras Informações", consultado em 2026-10-07 `radio-31`). Os valores não foram confirmados.

### MMSI e indicativo de chamada

- A estação do SLMM recebe um indicativo de chamada quando é licenciada pela primeira vez.
  ([RGST](https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777), art. 269,
  consultado em 2026-10-07 `radio-36`)
- Estações que participam do GMDSS precisam de MMSI, programado em todos os equipamentos que tenham essa função.
  ([RGST](https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777), art. 270,
  consultado em 2026-10-07 `radio-35`)
- No MMAR, quando o sistema identifica que a embarcação precisa de MMSI, entra a etapa "UIT/GMDSS": número de MMSI, contato de
  emergência enviado à UIT e capacidade de pessoas a bordo. ([Tutorial MMAR](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a),
  passos 10 e 11, consultado em 2026-10-07 `radio-34`)
- O MMSI brasileiro começa com 710, seguido de seis dígitos da estação (apêndice 43 do Regulamento Rádio da UIT). A EPIRB é
  codificada com ele. ([NORMAM-211/DPC](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.6 d, p. 4-13, consultado em 2026-10-07 `radio-37`)

## 4. EPIRB, PLB e busca e salvamento

- A EPIRB precisa ser de tipo aprovado (lista em cospas-sarsat.org), com liberação, flutuação e ativação automáticas e também
  ativação manual. ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.6 a e b, p. 4-12, consultado em 2026-10-07 `radio-40`) Ela transmite em 406 MHz: o COSPAS-SARSAT não processa
  121,5 MHz desde fevereiro de 2009. ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.23.6 c, p. 4-13, consultado em 2026-10-07 `radio-39`)
- Toda EPIRB deve ser cadastrada no INFOSAR, do DECEA, e mudanças de dono, endereço ou telefone precisam ser atualizadas.
  ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), art. 4.23.6 e e f,
  p. 4-13, consultado em 2026-10-07 `radio-38`) Na inspeção naval se conferem o funcionamento, a validade das baterias e o registro
  atualizado no INFOSAR. ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  tabela 4.35, nota (*), p. 4-24, consultado em 2026-10-07 `radio-26`)
- O [INFOSAR](https://infosar.decea.mil.br/) registra balizas 406 MHz (ELT, EPIRB, PLB) e dispositivos SEND, com login gov.br.
  ([INFOSAR](https://infosar.decea.mil.br/), página inicial, consultado em 2026-10-07 `radio-41`;
  [Central de Ajuda DECEA](https://ajuda.decea.mil.br/base-de-conhecimento/quais-os-tipos-de-balizas-de-emergencias-que-existem-para-aeronaves-e-embarcacoes/),
  consultado em 2026-10-07 `radio-43`) No cadastro, informa-se o código hexadecimal da baliza.
  ([Central de Ajuda DECEA](https://ajuda.decea.mil.br/sem-categoria/como-cadastrar-uma-baliza-406mhz-no-infosar/), consultado em
  2026-10-07 `radio-46`)
- Validade do registro: pela Central de Ajuda do DECEA (atualizada em 10/07/2026), o registro vale 2 anos e deve ser renovado.
  Um artigo de 2019 da mesma central diz que não expira. ([Central de Ajuda DECEA](https://ajuda.decea.mil.br/base-de-conhecimento/o-que-e-o-registro-infosar/),
  consultado em 2026-10-07 `radio-44`)
- O alerta chega ao Centro Brasileiro de Controle de Missão (BRMCC), que aciona o SALVAERO e o SALVAMAR.
  ([INFOSAR](https://infosar.decea.mil.br/), bloco "Emergência", consultado em 2026-10-07 `radio-42`) Baliza não registrada também
  gera emergência no BRMCC. ([Central de Ajuda DECEA](https://ajuda.decea.mil.br/base-de-conhecimento/no-caso-do-recebimento-do-sinal-de-emergencia-de-uma-baliza-406mhz-que-nao-esteja-registada-no-infosar-as-autoridades-de-resgate-irao-fazer-a-operacao-de-busca/),
  consultado em 2026-10-07 `radio-45`)
- Codificação: a EPIRB de embarcação não SOLAS (caso do veleiro de recreio) usa o MMSI ou o número de série. O PLB usa o número
  de série. Normalmente o fabricante ou revendedor faz a codificação. ([BRMCC, Codificação](https://www2.fab.mil.br/brmcc/index.php/codificacao),
  consultado em 2026-10-07 `radio-47`)
- O SALVAMAR é o Serviço de Busca e Salvamento da Marinha (Lei nº 7.273/1984) ([Com2ºDN, Salvamar Leste](https://www.marinha.mil.br/com2dn/salvamar-leste),
  consultado em 2026-10-07 `radio-49`). Atende 24 horas pelos sistemas de comunicações e pelo telefone **185**.
  ([CP Macaé, 185](https://www.marinha.mil.br/cpm/185), consultado em 2026-10-07 `radio-48`)

## 5. Equivalentes internacionais: RYA SRC e LRC

### SRC (VHF e VHF/DSC)

- O SRC é o certificado mínimo exigido por lei para operar VHF e VHF/DSC em embarcação de bandeira britânica.
  ([RYA, SRC](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), consultado em 2026-10-07 `radio-60`)
- O curso tem cerca de 10 horas mais o exame, online ou em sala. O exame é sempre em sala, sem experiência prévia e a partir de
  16 anos. ([RYA, SRC](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), Course overview, consultado em
  2026-10-07 `radio-61`)
- O exame tem prova escrita e prática em VHF, é feito num RYA Recognised Training Centre e custa £76, pagos ao RYA e separados do
  preço do curso. ([RYA, SRC](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), "SRC Exam" e "The exam
  fee", consultado em 2026-10-07 `radio-62`)
- Para o exame é preciso ter 16 anos e comprovar curso SRC num centro RYA, ou ter o RYA Restricted VHF, ou um certificado de
  radioperador aeronáutico. ([RYA, SRC](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), "Eligibility",
  consultado em 2026-10-07 `radio-63`)
- **Atenção:** o SRC segue o padrão harmonizado da CEPT, mas a "Authority to Operate" britânica restringe a validade a
  embarcações do Reino Unido. ([RYA, Licensing onboard electronics](https://www.rya.org.uk/regulations/licensing-onboard-electronics/),
  "Using the SRC abroad", consultado em 2026-10-07 `radio-64`) O Regulamento de Radiocomunicações exige operador com certificado
  emitido ou reconhecido pelo governo ao qual a estação está sujeita.
  ([RYA](https://www.rya.org.uk/regulations/licensing-onboard-electronics/), consultado em 2026-10-07 `radio-65`) Para barco de
  bandeira brasileira, isso aponta para a Anatel (`radio-12`).
- MMSI e indicativo de chamada são do país emissor. ([RYA](https://www.rya.org.uk/regulations/licensing-onboard-electronics/),
  "Call sign and MMSI", consultado em 2026-10-07 `radio-68`)

### LRC (MF/HF/satélite)

- O LRC é exigido em embarcação de recreio com MF, HF ou satélite. SRC e LRC não são certificados STCW.
  ([RYA](https://www.rya.org.uk/regulations/licensing-onboard-electronics/), "Maritime radio operator's certificates", consultado
  em 2026-10-07 `radio-66`)
- A página do RYA ainda cita a AMERC. A MCA informa que a AMERC emitiu certificados GMDSS até 21/04/2025. Desde 12/05/2025, quem
  conclui o curso LRC pede o certificado à MCA pelo formulário MSF 4354. ([MCA, MIN 716 Amendment 1](https://www.gov.uk/government/publications/min-716-mf-changes-to-the-gmdss-process-in-the-uk/min-716-mf-changes-to-the-gmdss-process-in-the-uk),
  seções 1.6 e 4.2, consultado em 2026-10-07 `radio-67`)
- Duração, preço e idade mínima do LRC não foram achados em fonte oficial (ver lacunas).

## 6. Sobrevivência e primeiros socorros

### World Sailing Offshore Special Regulations (OSR 2026-2027)

- A edição 2026-2027 vigora desde 1º/01/2026. A Versão 2 vale a partir de 1º/01/2027, e a Seção 6 não mudou.
  ([World Sailing, OSR](https://www.sailing.org/offshore-special-regulations/), consultado em 2026-10-07 `radio-69`)
- Categoria 0 são as regatas transoceânicas. Categoria 1 são as regatas longas e bem afastadas da costa, em que a tripulação
  precisa ser autossuficiente.
  ([OSR 2026-2027 v1](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
  regras 2.01.1 e 2.01.2, p. 12, consultado em 2026-10-07 `radio-70`)

| Regra OSR | Categoria | Exigência | id |
|---|---|---|---|
| 6.01.1 | 0 | Todos os tripulantes, incluindo o comandante, treinados nos tópicos da 6.02 nos 5 anos anteriores à largada | `radio-72` |
| 6.01.2 | 1 e 2 | **Pelo menos 30%, nunca menos de dois, incluindo o comandante (person in charge)** | `radio-71` |
| 6.01.3 | 3 (só 2 tripulantes) | Pelo menos um | `radio-73` |
| 6.01.4 | 0, 1, 2 | Certificado válido de curso World Sailing Approved Offshore Personal Survival é aceito como prova | `radio-74` |
| 6.01.5 | 0 a 3 | Reciclagem (refresher) até 2 anos depois do vencimento | `radio-76` |
| 6.04 | todas | Treino anual de homem ao mar e abandono | `radio-79` |
| 6.05.1 | 0 | Um tripulante com STCW A-VI/4-2 (Proficiency in Medical Care) | `radio-80` |
| 6.05.2 | 0 | Mais um tripulante com certificado de primeiros socorros dos últimos 5 anos | `radio-80` |
| 6.05.2 | 1 | **Pelo menos dois tripulantes com certificado de primeiros socorros dos últimos 5 anos** | `radio-81` |
| 6.05.2 | 2 | Um que conheça primeiros socorros, hipotermia, afogamento, RCP e comunicações, e outro com certificado | `radio-81` |
| 6.05.3 | 3 e 4 | Dois que conheçam primeiros socorros, hipotermia, afogamento, RCP e comunicações | `radio-83` |

Fonte: [OSR 2026-2027 v1](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
Seção 6, p. 39 e 40, consultado em 2026-10-07.

- Os 15 tópicos da 6.02 incluem comunicações de emergência (teoria e prática), balsa e abandono, hipotermia, homem ao mar,
  incêndio, mau tempo e organização de busca e salvamento.
  ([OSR v1](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
  6.02, p. 39, consultado em 2026-10-07 `radio-75`)
- O certificado vale 5 anos. ([OSR v1, Apêndice G](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
  item 6.3, p. 54, consultado em 2026-10-07 `radio-77`) O curso modelo tem dois dias de 8 horas, e a reciclagem cerca de 8 horas.
  ([OSR v1, Apêndice G](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
  Partes B e D, p. 59 e 60, consultado em 2026-10-07 `radio-78`)
- Para primeiros socorros vale um curso listado no site da World Sailing como reconhecido pela federação nacional, ou treinamento
  **STCW A-VI/1-3 (Elementary First Aid) ou nível STCW superior**.
  ([OSR v1](https://media.sailing.org/sailing/wp-content/uploads/2025/12/05110802/WS_Offshore_Special-Regulations_2026-2027_v1_wcover.pdf),
  6.05.2 a e b, p. 40, consultado em 2026-10-07 `radio-82`)
- A World Sailing recomenda **não** aceitar curso STCW de sobrevivência no lugar do Offshore Personal Survival. Cursos STCW de
  primeiros socorros são aceitos. ([World Sailing, Offshore Personal Survival](https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/),
  "STCW Courses", consultado em 2026-10-07 `radio-84`)
- O Brasil não aparece na lista da World Sailing de provedores de Offshore Personal Survival
  ([World Sailing](https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/offshore-personal-survival/),
  consultado em 2026-10-07 `radio-85`) nem na lista de primeiros socorros reconhecidos
  ([World Sailing, First Aid](https://www.sailing.org/inside-world-sailing/activities-services/technical-offshore/technical-services/technical-and-offshore-safety/offshore-safety/osr-recognised-first-aid-qualifications/),
  consultado em 2026-10-07 `radio-86`). As duas são conclusões por ausência.

### Cursos no exterior

- **RYA Offshore Personal Survival (RYA/World Sailing):** 2 dias em sala. O certificado atende à 6.01 nas Categorias 0, 1 e
  algumas da 2. ([RYA](https://www.rya.org.uk/course-finder/offshore-personal-survival-course-ryaworld-sailing/), consultado em
  2026-10-07 `radio-87`)
- **RYA Basic Sea Survival:** 1 dia, parte em piscina, sem idade mínima. Sozinho não atende à OSR.
  ([RYA](https://www.rya.org.uk/course-finder/basic-sea-survival-certificate/), consultado em 2026-10-07 `radio-88`)
- **RYA First Aid:** 1 dia, aprovado pela MCA. Cobre RCP com protocolo de afogamento, hipotermia, ajuda médica por VHF e resgate
  por helicóptero. É o curso britânico na lista da World Sailing. ([RYA](https://www.rya.org.uk/course-finder/first-aid-course/),
  consultado em 2026-10-07 `radio-89`; `radio-86`)
- **US Sailing Safety at Sea:** a US Sailing é sancionada pela World Sailing. O certificado International Offshore exige a parte
  teórica, que pode ser o curso online de 15 unidades (US$ 165 para não sócio), mais um dia prático presencial, e vale 5 anos.
  ([US Sailing](https://www.ussailing.org/education/adult/safety-at-sea-courses/), consultado em 2026-10-07 `radio-90`)
- **University of Southampton:** RYA Sea Survival de 1 dia por £155, com turma em 11/10/2026.
  ([Southampton Sport](https://www.southampton.ac.uk/sport/watersports-courses/theory/rya-sea-survival), consultado em 2026-10-07
  `radio-91`)

### No Brasil: cursos STCW e offshore da DPC (o caminho para primeiros socorros)

A DPC tem cursos de "Ensino Complementar (offshore)" para não aquaviários, dados por instituições privadas credenciadas.
([DPC, Cursos](https://www.marinha.mil.br/dpc/offshore-cursos), consultado em 2026-10-07 `radio-53`)

| Curso | Duração | Base STCW / IMO | Requisitos de matrícula | id |
|---|---|---|---|---|
| CBSN, Curso Básico de Segurança de Navio | 34 h (4 a 5 dias), validade 5 anos | Regra V/2 e Tabelas A-VI/1-1 a 1-4 (inclui primeiros socorros elementares) | mais de 18 anos, ensino fundamental, boa saúde | `radio-58` |
| CBSP, Curso Básico de Segurança de Plataforma | 40 h (5 dias) | Res. IMO A.1079(28); primeiros socorros elementares 6 h, sobrevivência pessoal 9 h | mais de 18 anos, ensino fundamental, boa saúde | `radio-57` |
| CPSO, Curso de Primeiros Socorros | 52 h (7 dias) | Seção A-VI/4, Tabela A-VI/4-1 | mais de 18 anos, saúde, CBSP nos últimos 5 anos | `radio-56` |
| CROG, Radioperador em GMDSS | 88 h (3 semanas) | Regra IV/2 (Radioperador Geral) | 18 anos, ensino médio, saúde, inglês e computação básicos | `radio-54`, `radio-55` |

Fontes: sinopses da DPC ([CBSN](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_20.pdf),
[CBSP](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_0.pdf),
[CPSO](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_11.pdf),
[CROG](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/cursos-offshore/SINOPSE_10.pdf)), consultado em 2026-10-07.

- Pela tabela do CBSN, ele cobriria o STCW A-VI/1-3 que a OSR 6.05.2 b aceita para primeiros socorros. O CPSO (A-VI/4-1) é de
  nível superior. Inferência: quem aceita é o organizador da regata, então confirmar antes (`radio-82`, `radio-58`, `radio-56`).
  Para a Categoria 0, o A-VI/4-2 não foi achado (ver lacunas).
- A [lista de instituições credenciadas da DPC](https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/Instituicoes_credenciadas_para_ministrar_Cursos_e_Treinamento_na_Modalidade_Presencial.pdf)
  (atualizada em 30/09/2026) tem CROG só no Rio e em Macaé. No Nordeste há CBSN e CBSP em Recife, Salvador, Aracaju e Fortaleza,
  e CBSP em Guamaré e Mossoró (RN). (consultado em 2026-10-07 `radio-59`)
- A NORMAM-211 põe no comandante a responsabilidade pelos medicamentos e recomenda a caixa de medicamentos (Anexo 4-C, item I)
  em barco de mar aberto com menos de 15 pessoas. ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf),
  art. 4.22, p. 4-11, consultado em 2026-10-07 `radio-92`) Para orientações de primeiros socorros, indica o app FICR da Cruz
  Vermelha. ([NORMAM-211](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), art. 4.21,
  Nota, p. 4-11, consultado em 2026-10-07 `radio-93`)

## 7. Locais conferidos (para o mapa)

| id | Entidade | Onde | O que oferece | Fonte |
|---|---|---|---|---|
| `online-anatel-cortf` | Anatel | Online | Exame ORR/ORG, gratuito | [página](https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista) |
| `se-rj-west-group-gmdss` | West Group | Rio de Janeiro / Macaé (RJ) | CROG/GMDSS (R$ 3.490 nos dados da página, `radio-94`), CPSO, CBSP | [página](https://westgroup.com.br/produto/gmdss-radio-operador/) |
| `ne-ba-jjr-solutions-salvador` | JJR Solutions | Salvador (BA) | CBSN/STCW, 5 dias, turma em 12/10/2026 (`radio-95`) | [página](https://jjrsolutions.com.br/cursos/10/stcw-cbsn-curso-basico-de-seguranca-de-navio?mudacid=2) |
| `ne-se-jjr-solutions-aracaju` | JJR Solutions | Aracaju (SE), Iate Clube de Aracaju | CBSN, CBSP | [página](https://jjrsolutions.com.br/cursos/10/stcw-cbsn-curso-basico-de-seguranca-de-navio?mudacid=3) |
| `ne-pe-seaman-nautica-recife` | Seaman Náutica | Recife (PE), Derby | CBSN/STCW, 34 h (`radio-96`) | [página](https://www.seaman.com.br/cursos.html) |
| `ex-uk-rya` | RYA | Reino Unido e centros reconhecidos | SRC, Sea Survival, First Aid, Offshore Personal Survival | [página](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/) |
| `ex-uk-southampton-rya-sea-survival` | University of Southampton | Southampton (Reino Unido) | RYA Sea Survival, £155 | [página](https://www.southampton.ac.uk/sport/watersports-courses/theory/rya-sea-survival) |
| `ex-us-ussailing-safety-at-sea` | US Sailing | Online + prática nos EUA | Safety at Sea International Offshore | [página](https://www.ussailing.org/education/adult/safety-at-sea-courses/) |

Ficaram de fora o Instituto de Ciências Náuticas e a RelyOn Nutec (credenciados para CROG pela DPC, `radio-59`), porque não
consegui conferir o site com o curso.

## A confirmar / lacunas

1. **Certificado de operador para o amador:** o RGST (art. 271) exige certificado para estação do SLMM "quando associado ao
   GMDSS", e a NORMAM-211 não exige nada do condutor amador (`radio-12`, `radio-15`). Falta a Anatel dizer se um VHF/DSC ou
   HF/DSC de recreio entra nessa regra. Perguntar pelo SEI ou pelo 1331.
2. **ORR ou ORG:** o ORR só vale em águas nacionais (`radio-04`). Na travessia, o ORG parece necessário (inferência).
3. **Quem pode obter o certificado:** a página da Anatel diz "maior de idade residente no Brasil" (`radio-02`). O RGST diz
   "brasileiros e portugueses... maiores de 16 anos" (`radio-13`). Os dois textos não batem.
4. **Matérias do ORG:** a tabela do Ato 3449/2026 não deixa claro se o ORG também faz Operação I e Legislação I (`radio-06`).
5. **Reconhecimento de certificado estrangeiro (SRC/LRC) pela Anatel:** o RGST fala em "emitido ou reconhecido", mas não achei
   procedimento. Pelo RYA, o SRC só vale em barco britânico (`radio-64`).
6. **Custos da licença de estação:** o tutorial MMAR fala em TFI e PPDUR, e o gov.br diz "gratuito" (`radio-30`, `radio-31`). Não
   conferi os valores do Fistel (Lei 5.070/1966, Anexo I) no texto vigente nem a TFF anual.
7. **MMSI:** quem gera o número no MMAR (Anatel ou requerente) e se ele sai na licença (`radio-34`). Também falta saber se o VHF
   portátil com DSC precisa de licença própria como "Estação Móvel" e se pode usar o MMSI do barco.
8. **PLB:** não achei se o PLB precisa de licença da Anatel além do registro no INFOSAR.
9. **Validade do registro no INFOSAR:** o artigo de 2026 diz 2 anos e o de 2019 diz que não expira (`radio-44`). Confirmar no
   [SAC DECEA](https://servicos.decea.mil.br/sac/?a=atd&c=334).
10. **Amador nos cursos da DPC:** as sinopses de CBSN, CBSP, CPSO e CROG só pedem idade, escolaridade e saúde (`radio-55`,
    `radio-57`, `radio-58`). Confirmar com cada escola se aceita navegador amador. O CBSN da JJR aparece com 40 h e a sinopse da
    DPC dá 34 h (`radio-95`).
11. **EROG e CROG:** o Ato 3449 isenta das provas quem tem EROG, mas não o CROG (`radio-09`). Não achei se o EROG ainda é oferecido
    nem se aceita amador.
12. **Sobrevivência World Sailing no Brasil:** não há curso brasileiro na lista da World Sailing (`radio-85`). Perguntar à CBVela.
    Opções achadas: RYA de 2 dias no exterior e US Sailing (teoria online + prática presencial).
13. **STCW A-VI/4-2 (Categoria 0):** não achei curso no Brasil acessível a amador. O CPSO é A-VI/4-1.
14. **Aceitação do CBSN/CPSO como primeiros socorros pela OSR 6.05.2 b:** o texto permite STCW A-VI/1-3 ou superior, mas quem
    decide é o organizador de cada regata (`radio-82`).
15. **LRC:** faltam duração, taxa da MCA e idade mínima em fonte oficial. A MIN 716 diz "more information will follow"
    (`radio-67`). Também não verifiquei centros RYA no Brasil, em Portugal ou nas Canárias.
16. **SALVAMAR regionais:** o 0800 do Salvamar Leste aparece de forma diferente em páginas da Marinha, e não conferi em fonte
    oficial atual a área SAR brasileira no Atlântico. O 185 está confirmado (`radio-48`).
17. **Licença de Estação na NORMAM-211:** a norma ainda manda ir às "sedes regionais da ANATEL" (`radio-16`), mas a Anatel hoje faz
    tudo online pelo MMAR (`radio-28`). Seguir o procedimento da Anatel.
