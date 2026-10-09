# NORMAM-211: qual texto prevalece (PDF consolidado x ZIP de anexos)

Data da checagem: 2026-10-09. Só fontes oficiais da Marinha/DPC. Resultado em `_work/desempate_4.json`.

## Conclusão

Prevalece o **PDF consolidado** (Rev. 1, Portaria DPC/DGN/MB nº 200, de 27/02/2026). Os ids programa-39, programa-46, programa-47 e extra-capitao-3-16 ficam **confirmado_com_correcao**: a claim original (texto do PDF) está certa, e o ZIP está defasado nos Anexos 5-A (itens de combustível) e 4-B (item 4.5). O ZIP não é uma revisão mais nova do texto.

Limite honesto: nenhuma portaria descreve em palavras "o item 4.5 passou de recomendável a obrigatório" ou "foram incluídos os itens de combustível". A conclusão vem de (a) o ato vigente aprovar o PDF, (b) a Folha de Registro listar as páginas alteradas, (c) comparação de versões oficiais datadas. É inferência documental forte, não citação direta de uma portaria.

## 1. Folha de Registro de Modificações (PDF, p. III)

| Mod. | Portaria | Vigência | Páginas afetadas (relevantes) |
|---|---|---|---|
| 1 | 127, 24/06/2024 | 01/07/2024 | Índice; Cap. 2; Cap. 4; 5-1 a 5-3 |
| 2 | 147, 17/12/2024 | 01/01/2025 | ...; 4-25; 5-5; 6-4; **5-A-8; 5-A-10 e 5-A-11; 5-E-2** |
| 3 | 173, 25/02/2025 | 27/02/2025 | 4-1; 4-5; 4-7; 4-22; 4-24; 4-25 |
| 4 | 179, 20/05/2025 | 20/05/2025 | 4-7 a 4-9; 4-13; 4-21; 4-23; 5-10; **3-B-2 e 3-B-3; 4-B-3** |
| 5 | 197, 23/01/2026 | 26/01/2026 | muitas páginas; An 1-C; An 2-A a 2-K; An 3-C a 3-E; **An 5-A e An 5-E** |
| Rev. 1 | 200, 27/02/2026 | 03/03/2026 | **somente 5-12** |

(A data da Portaria 147 na Folha e na página oficial da portaria é 17/12/2024; o PDF da portaria no ZIP de histórico traz "17 de julho de 2024" no corpo, divergência do próprio arquivo, sem efeito aqui.)

Leituras:
- **Anexo 4-B**: só a Mod. 4 toca o Anexo 4-B, e só a página 4-B-3. O item 4.5 (EPIRB) está exatamente na página 4-B-3 do PDF. Entre a consolidação da Mod. 1 (jul/2024, "É recomendável") e a Rev. 1 (PDF, "É obrigatório"), esse é o único trecho substantivo que muda no 4-B.
- **Anexo 5-A**: itens de combustível no PDF estão em 5-A-7 (3.1 a, VII-VIII), 5-A-9 (1.11-1.12) e 5-A-10 (2.8). A Mod. 2 lista 5-A-8, 5-A-10 e 5-A-11: mesmas três páginas com o mesmo espaçamento relativo (+2, +1), deslocadas em uma página (provável efeito da re-paginação da Mod. 5). A Mod. 2 também lista 5-E-2, e a página 5-E-2 do PDF traz os mesmos temas de combustível. O comparativo texto a texto entre a consolidação da Mod. 1 e o PDF Rev. 1 mostra como únicas mudanças de combustível exatamente VII-VIII, 1.11-1.12 e 2.8 (mais prazos de inscrição, que são outra alteração).
- A **Rev. 1 (Portaria 200)** só mexeu na p. 5-12, então não pode ter criado nem desfeito nada no 5-A ou no 4-B.

## 2. Página das NORMAM e portarias posteriores a 27/02/2026

- `https://www.marinha.mil.br/dpc/normas-autoridade-maritima-brasileira`: NORMAM 211 = "PORTARIA DPC/DGN/MB Nº 200, DE 27 DE FEVEREIRO DE 2026". Nenhuma portaria posterior da N-211 listada (a lista tem portarias posteriores de outras NORMAM: 101, 311, 401...).
- `https://www.marinha.mil.br/dpc/normam-211`: "Publicado em 06/03/2023", "Atualizado em 28/08/2026 - 13:47"; lista só a Portaria 200, o ZIP de anexos e o ZIP de portarias anteriores.
- Portaria 200 (HTML, via serviço local, o acesso direto dá desafio Cloudflare): "Aprova as Normas ... NORMAM-211/DPC", revoga a Portaria 197, vigor na assinatura; o link do ato é o próprio `normam-211.pdf`. Cada portaria da série (127, 147, 173, 179, 197, 200) revoga a anterior e aprova a versão completa então publicada no site. Portaria 200 é, portanto, o ato que aprova o texto do PDF.

## 3. Download de hoje e metadados

| Arquivo | Last-Modified (HTTP) | Interno |
|---|---|---|
| normam-211.pdf (assets.marinha.mil.br) | 05/03/2026 | PDF criado 03/03/2026 10:03; MD5 igual ao do acervo; 268 p.; Folha com Rev. 1 |
| NORMAM-211-Anexos_0.zip | 28/08/2026 | 38 arquivos .odt, sem número de revisão nem Folha de Registro |
| Historico-Portarias-Anteriores-NORMAM-211-DPC.zip | 09/03/2026 | só cartas de portaria (1 p.), sem texto das NORMAM |

Metadados `meta.xml` dos .odt (dc:date):
- **Anexo 4-B**: criado e salvo em 05/12/2023, 1 ciclo de edição. Nunca foi atualizado (nem pela Mod. 4).
- **Anexo 5-A**: salvo 06/03/2026 (2 ciclos). Esse lote de 06/03/2026 coincide com a lista da Mod. 5 (1-C, 2-A a 2-K, 3-C a 3-E, 5-A): editaram só o que a Mod. 5 mudou, sobre uma base que não tinha a Mod. 2. O 5-A do ZIP tem os prazos de inscrição novos (fev/ago, abr/out) que a consolidação da Mod. 1 não tinha (fev/jun, abr/ago), mas não tem os itens de combustível.
- **Anexo 5-E**: salvo 27/08/2026 (3 ciclos), único arquivo mais novo que o PDF. Esse .odt já contém "Pontos de ignição e de Fulgor dos combustíveis" e "Procedimentos para abastecimento (ventilação, uso do suspiro, etc)". O ZIP, portanto, fica internamente inconsistente: o atestado 5-E exige temas que o 5-A do mesmo ZIP não lista (o 5-E remete à "alínea (a) da Seção II do anexo 5-A").
- **Anexo 3-B**: salvo 01/07/2024. O PDF (Mod. 4 listou 3-B-2 e 3-B-3) traz regras de revisão de balsas (NORMAM-321, ISO 9650-1) e homologação estrangeira que não existem no .odt. Prova direta de que os .odt do ZIP não acompanham as modificações do PDF.
- Nenhum .odt do ZIP traz data de revisão ou número de revisão no texto/rodapé.

Capitania Fluvial de Tabatinga hospeda a consolidação da Mod. 1 (`.../cft/.../08 - NORMAM-211 NÃO COMERCIAL.pdf`, criada 01/07/2024, 279 p., Folha só com Mod. 1): 5-A sem combustível, 4-B 4.5 "É recomendável". Igual ao ZIP. Já o site da Delegacia de Guaíra (delguaira) hospeda o Anexo 5-E de 05/03/2026 com os temas de combustível (igual ao PDF); a versão de 21/02/2024 (site da Capitania dos Portos do Paraná, cppr) não tem.

## 4. Histórico de portarias

O ZIP de histórico só tem as cartas de portaria (2023 em diante com 1 página, sem o texto da NORMAM). Portarias 147, 173, 179, 197 e 200 (as duas últimas e a 147/173/179 também em HTML na DPC) mostram a cadeia de revogações e que o ato vigente é a 200. Nenhuma descreve o conteúdo alterado.

## 5. O que o ZIP ter data mais nova (28/08/2026) NÃO prova

A data do ZIP é de reenvio do pacote, não de uma revisão do texto. Dos arquivos que importam: 4-B (2023) e 5-A (06/03/2026) não foram tocados em agosto; o único .odt tocado em 27/08/2026 (5-E) concorda com o PDF no tema de combustível. Nenhuma portaria posterior a 27/02/2026 altera a N-211.

## 6. O que continuaria faltando para 100%

Um texto de portaria ou nota da DPC dizendo explicitamente "o 4.5 do 4-B passa a ser obrigatório" e "incluem-se os itens de combustível no 5-A". Não existe na página, nem no ZIP de histórico. Se se quiser confirmação textual, só pela DPC/CIAGA. Para o app, o texto a usar é o do PDF; em 4.5, vale citar também que a dotação de EPIRB por porte está no Cap. 4 (4.24.1 a, IV; 4.24.2 a, III).
