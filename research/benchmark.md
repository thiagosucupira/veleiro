# Benchmark de cursos e materiais de referência

Comparação dos melhores cursos e materiais online de vela e de habilitação náutica, para o app "Veleiro: de leigo a transatlântico" igualar ou superar. Fontes consultadas em 2026-10-07.

- **Escopo:** RYA (Reino Unido), ASA/American Sailing (EUA), NauticEd (EUA/internacional) e cursos brasileiros de Arrais-, Mestre- e Capitão-Amador (online, presenciais e apps de simulado).
- **Método:** cada fato vem da página oficial de quem oferece o curso (RYA, ASA, NauticEd, escola ou loja de apps) ou da NORMAM-211/DPC. Os trechos literais que comprovam cada fato estão em `research/_work/research_benchmark.json`, pelo id (`benchmark-NN`).
- **Preços:** são os que as páginas públicas mostravam em 2026-10-07. Mudam sem aviso. Os de escolas e apps brasileiros são dados do vendedor, não da Marinha.
- **Análise própria:** as seções "Pontos fortes e fracos", a matriz de recursos e a lista final são avaliação nossa, a partir dos fatos citados. Não são fatos das fontes.
- **Aviso:** nenhuma dessas fontes substitui a NORMAM vigente. Para a prova, confirme na Capitania, Delegacia ou Agência.

## Resumo comparativo

| Referência | Estrutura | Recursos interativos de destaque | Avaliação | Preço público (consultado em 2026-10-07) |
|---|---|---|---|---|
| **RYA** (teoria online via RYA Interactive e centros) | Escada Competent Crew → Day Skipper → Coastal Skipper → Yachtmaster Offshore/Ocean; teorias de 40 h cada (`benchmark-01`, `benchmark-03`, `benchmark-06`, `benchmark-08`) | Exercícios interativos (ENS), prática de fala no rádio (SRC); nos centros, simuladores de chartplotter, VHF e radar (`benchmark-10`, `benchmark-12`, `benchmark-26`) | Prova final da teoria; SRC com prova escrita + prática presencial; Yachtmaster com exame prático e exigência de milhas (`benchmark-13`, `benchmark-21`, `benchmark-22`, `benchmark-23`) | Curso: definido por cada centro (`benchmark-13`). Ex.: Day Skipper online £275 (Navathome) (`benchmark-26`); taxa SRC £76 (`benchmark-13`) |
| **ASA** | ASA 101 → 108, com endossos (107 astronômica etc.) (`benchmark-29`, `benchmark-38`) | App Sailing Challenge (pontos de vela, vento aparente, noite com boias), OpenCPN no ASA 105 (`benchmark-35`, `benchmark-39`) | Prova escrita + demonstração na água; selo no Logbook (`benchmark-30`, `benchmark-36`, `benchmark-40`) | Intro online US$ 59; quizzes US$ 35; ASA 105 e 107 online US$ 419 cada (`benchmark-32`, `benchmark-33`, `benchmark-34`, `benchmark-36`) |
| **NauticEd** | Mais de 30 cursos em pacotes (Skipper, Bareboat, Captain) (`benchmark-43`, `benchmark-46`) | Animações HTML5 de regulagem, 3D, VR no Meta Quest, diário eletrônico e currículo (`benchmark-44`, `benchmark-45`, `benchmark-53`, `benchmark-55`) | Testes com tentativas ilimitadas; níveis por cursos + dias registrados; SLC com prova e avaliação prática (`benchmark-47`, `benchmark-48`, `benchmark-50`) | Grátis (2 cursos); US$ 39 a US$ 379 (`benchmark-44`, `benchmark-46`, `benchmark-49`, `benchmark-51`) |
| **Brasil – online** (ex.: eNauti) | Videoaulas por módulo do programa + questões + simulados + e-book (`benchmark-64`, `benchmark-69`, `benchmark-70`) | Pouca interatividade: vídeo, carta para imprimir, simulado (`benchmark-68`) | Simulados no estilo da prova (`benchmark-67`) | ARA R$ 69,99; MSA R$ 348; CPA R$ 982 (`benchmark-64`, `benchmark-68`, `benchmark-70`) |
| **Brasil – presencial/híbrido** | Arrais com 2 h de teoria + 4 h de prática obrigatórias; MSA e CPA em turmas noturnas ou online ao vivo (`benchmark-60`, `benchmark-75`, `benchmark-79`) | Barco real (lancha ou veleiro-escola), material de plotagem emprestado (`benchmark-76`, `benchmark-80`) | Prova na Capitania (40 questões; nota 5,0) (`benchmark-56`, `benchmark-57`, `benchmark-58`, `benchmark-92`) | ARA R$ 746 a R$ 1.350; MSA R$ 1.150 a R$ 1.390; CPA R$ 2.220 (dois módulos) a R$ 3.000 (`benchmark-76`, `benchmark-77`, `benchmark-78`, `benchmark-79`, `benchmark-81`, `benchmark-83`) |
| **Brasil – apps de simulado** | Banco de questões por assunto, simulado montável (`benchmark-85`, `benchmark-88`) | Modo prova cronometrado, estatística por assunto, explicações (`benchmark-87`) | Simulado | Grátis com anúncios/assinatura, ou R$ 6,99 (`benchmark-85`, `benchmark-87`, `benchmark-88`) |

## 1. RYA (Royal Yachting Association, Reino Unido)

### 1.1 Estrutura (cursos e módulos)

- O esquema de cruzeiro a vela da RYA tem cursos práticos (Start Yachting, Competent Crew, Day Skipper, Coastal Skipper) e cursos em terra (Essential Navigation and Seamanship, Day Skipper Theory, Coastal Skipper/Yachtmaster Offshore Theory, Marine Radio SRC, Yachtmaster Ocean Theory), que levam aos certificados Yachtmaster Coastal, Offshore e Ocean. ([fonte](https://www.rya.org.uk/training/sail-cruising-courses/), Sail cruising courses: seções 'Practical courses', 'Courses ashore' e 'RYA Yachtmaster® exams'; consultado em 2026-10-07; `benchmark-01`)
- A RYA descreve o Yachtmaster Offshore como apto a passagens de até 150 milhas da costa e o Yachtmaster Ocean como apto a navegar no mundo todo. ([fonte](https://www.rya.org.uk/training/sail-cruising-courses/), seção 'RYA Yachtmaster® exams'; consultado em 2026-10-07; `benchmark-02`)
- O RYA Day Skipper Theory tem 40 horas mais o tempo de exame e pode ser feito em sala, online ou a distância. ([fonte](https://www.rya.org.uk/course-finder/day-skipper-theory-course/), Course overview: 'Course length' e 'Course format'; consultado em 2026-10-07; `benchmark-03`)
- O RYA Day Skipper Theory é aberto a qualquer pessoa; experiência prática é desejável, mas não exigida, e não há idade mínima. ([fonte](https://www.rya.org.uk/course-finder/day-skipper-theory-course/), Course description; Course overview: 'Minimum age'; consultado em 2026-10-07; `benchmark-04`)
- O conteúdo do RYA Day Skipper Theory inclui marinharia, navegação costeira e pilotagem, trabalho na carta, cartas eletrônicas, determinação da posição, rumo a governar, meteorologia, marés e regras de prevenção de abalroamento. ([fonte](https://www.rya.org.uk/course-finder/day-skipper-theory-course/), seção 'Course content'; consultado em 2026-10-07; `benchmark-05`)
- O RYA Coastal Skipper/Yachtmaster Offshore Theory tem 40 horas mais exame, exige conhecimento no nível do Day Skipper Shorebased e pode ser feito em sala, online ou a distância. ([fonte](https://www.rya.org.uk/course-finder/coastal-skipperyachtmaster-offshore-theory-course/), Course overview; consultado em 2026-10-07; `benchmark-06`)
- O conteúdo do Coastal Skipper/Yachtmaster Offshore Theory inclui determinação da posição, traçado de rumos, marés, uso de almanaques e publicações do Almirantado, equipamentos eletrônicos de posição, previsões, traçado de sistemas meteorológicos e previsão com barômetro. ([fonte](https://www.rya.org.uk/course-finder/coastal-skipperyachtmaster-offshore-theory-course/), seção 'Course content'; consultado em 2026-10-07; `benchmark-07`)
- O RYA Yachtmaster Ocean Theory (40 horas mais exame) ensina navegação astronômica: esfera celeste, uso e cuidado do sextante, altura meridiana, retas do Sol, estrelas e outros astros, e planejamento de travessias oceânicas. ([fonte](https://www.rya.org.uk/course-finder/yachtmaster-ocean-theory-course/), Course overview e 'Course content'; consultado em 2026-10-07; `benchmark-08`)
- O Yachtmaster Ocean Theory também cobre meteorologia mundial, incluindo tempestades tropicais, e exige navegação no nível do Coastal Skipper/Yachtmaster Offshore Shorebased. ([fonte](https://www.rya.org.uk/course-finder/yachtmaster-ocean-theory-course/), Course description; Course overview: 'Required experience'; consultado em 2026-10-07; `benchmark-09`)
- O RYA Essential Navigation and Seamanship dura 16 horas em sala ou cerca de 8 a 10 horas online; vem com kit (carta, plotador, compasso de pontas, manual e exercícios) e, online, tem exercícios interativos. ([fonte](https://www.rya.org.uk/course-finder/essential-navigation-and-seamanship-course/), Course description; Course overview: 'Course length'; consultado em 2026-10-07; `benchmark-10`)
- O curso RYA Marine Radio SRC tem 10 horas mais exame; pode ser feito online ou em sala, mas o exame é presencial; idade mínima de 16 anos. ([fonte](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), Course overview; consultado em 2026-10-07; `benchmark-11`)

### 1.2 Recursos online e interativos

- O curso SRC online da RYA exige microfone e alto-falantes/fones, o que indica prática de fala no rádio dentro do curso. ([fonte](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), seção 'SRC online course' (requisitos técnicos); consultado em 2026-10-07; `benchmark-12`)
- A RYA Interactive (plataforma de cursos online da RYA) mudou para uma nova plataforma em abril de 2026: o site antigo fechou em 7/4/2026, com reabertura prevista até 14/4/2026, e o progresso dos alunos não foi transferido. ([fonte](https://www.rya.org.uk/training/rya-elearning/rya-interactive/), página 'RYA Interactive', aviso e FAQ; consultado em 2026-10-07; `benchmark-14`)
  - Obs.: A página não diz se a nova plataforma já abriu. Em 2026-10-07, www.ryainteractive.org abria só uma tela de login (SPA), sem conteúdo público.
- O acesso a um curso da RYA Interactive dura no máximo 12 meses a partir da matrícula; depois, a conta é apagada e a conclusão fica registrada no banco de dados da RYA. ([fonte](https://www.rya.org.uk/network/training-centres-and-instructors/online-course-data-protection/), seção 'Length of access'; consultado em 2026-10-07; `benchmark-15`)
- O e-book oficial RYA Day Skipper Shorebased Notes custa £14,99, é da edição de 2024 (atualizada em 2025), cobre navegação feita com aparelhos eletrônicos, segue o padrão de acessibilidade WCAG 2.0 AA e é lido no app 'RYA Books'. ([fonte](https://www.rya.org.uk/products/rya-day-skipper-shorebased-notes-ebook-1/), página do produto: preço, descrição e 'Product details'; consultado em 2026-10-07; `benchmark-17`)
  - Obs.: Preço, edição (2024), atualização (2025) e 'WCAG 2.0 AA' estão no bloco 'Product details' da mesma página.
- Imprensa do setor (Marine Industry News, 16/6/2026) relata que a RYA ensina a navegação eletrônica como método principal ('digital first'), mantendo a carta de papel como habilidade de reserva; o texto foi corrigido em 19/6/2026 para dizer que isso não é uma mudança nova. ([fonte](https://marineindustrynews.co.uk/rya-moves-to-digital-first-navigation-training-as-paper-charts-withdrawn/), corpo do artigo e nota de correção no fim; consultado em 2026-10-07; `benchmark-25`)
  - Obs.: Fonte não oficial. Não achei documento da RYA com data de vigência do 'digital first'.

Centros RYA que vendem a teoria online (exemplo: Navathome, centro reconhecido pela RYA; não é a RYA):

- A Navathome, centro de treinamento que vende o RYA Day Skipper online, cobra £275 e anuncia simuladores embutidos de chartplotter, rádio VHF e radar, curvas de maré interativas e acesso inicial de 6 meses. ([fonte](https://www.navathome.com/rya-day-skipper.aspx), bloco de oferta 'RYA DAY SKIPPER ONLINE TRAINING'; consultado em 2026-10-07; `benchmark-26`)
- No Day Skipper online da Navathome, o estudo leva cerca de 40 horas, com quizzes por módulo e avaliação final em duas partes de cerca de 1,5 hora cada. ([fonte](https://www.navathome.com/rya-day-skipper.aspx), seção 'Invigilated Assessment Information'; consultado em 2026-10-07; `benchmark-27`)
- O Yachtmaster Ocean online da Navathome custa £275, não exige sextante (usa lições animadas interativas) e termina com avaliação de 2 horas. ([fonte](https://www.navathome.com/rya-yachtmaster-ocean.aspx), bloco de oferta e 'Is this course right for you?'; consultado em 2026-10-07; `benchmark-28`)

### 1.3 Avaliação e exigência de experiência

- O exame SRC tem prova teórica escrita e avaliação prática no uso do VHF; a taxa de exame é de £76, paga à RYA, separada do preço do curso, que cada centro define. ([fonte](https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/), seções 'SRC Exam' e 'The exam fee'; consultado em 2026-10-07; `benchmark-13`)
- Segundo a RYA, para obter o certificado SRC após o curso online é preciso passar numa avaliação presencial. ([fonte](https://www.rya.org.uk/training/rya-elearning/), página 'RYA eLearning', seção 'Get qualified'; consultado em 2026-10-07; `benchmark-16`)
- O RYA Competent Crew é um curso prático de 5 dias, sem experiência prévia, com idade recomendada a partir de 12 anos. ([fonte](https://www.rya.org.uk/course-finder/competent-crew-practical-course/), Course overview; consultado em 2026-10-07; `benchmark-19`)
- O RYA Day Skipper prático (vela) dura 5 dias e exige antes 5 dias, 100 milhas e 4 horas noturnas a bordo de um veleiro, mais teoria no nível Day Skipper Shorebased; idade mínima 16. ([fonte](https://www.rya.org.uk/course-finder/day-skipper-practical-sailing/), Course overview; consultado em 2026-10-07; `benchmark-20`)
- Para o exame Yachtmaster Offshore, a RYA exige, nos últimos 10 anos: 50 dias de mar, 5 dias como comandante, 2.500 milhas e 5 passagens de mais de 60 milhas, sendo 2 noturnas e 2 como comandante. ([fonte](https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/), seção 'RYA Yachtmaster Offshore exam pre-requisites' > 'Minimum seatime'; consultado em 2026-10-07; `benchmark-21`)
- O exame prático Yachtmaster Offshore dura de 8 a 12 horas para um candidato e exige certificado de radioperador compatível com o GMDSS (como o SRC) e certificado de primeiros socorros. ([fonte](https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-offshore-exam/), seções 'Minimum exam duration' e 'Required certificates'; consultado em 2026-10-07; `benchmark-22`)
- Para o Yachtmaster Ocean, a RYA exige uma passagem qualificatória de pelo menos 600 milhas (200 delas a mais de 50 milhas de terra) e 96 horas, em posição de responsabilidade, e prova de navegação astronômica feita no mar (meridiana do Sol e checagem da agulha por astro). ([fonte](https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/), seção 'RYA Yachtmaster Ocean exam pre-requisites'; consultado em 2026-10-07; `benchmark-23`)
- O exame Yachtmaster Ocean é oral e escrito (cálculo de retas e meteorologia mundial) e dura cerca de 1,5 a 2 horas; o candidato entrega antes um relato da passagem qualificatória e os registros de navegação sem eletrônicos. ([fonte](https://www.rya.org.uk/training/certificates-of-competence/yachtmaster-ocean-exam/), descrição do exame e 'Exam duration'; consultado em 2026-10-07; `benchmark-24`)

### 1.4 Diário de bordo e preço

- A RYA vende o 'Yachtmaster Scheme Syllabus and Logbook' (G158), que reúne o programa do esquema e o diário de bordo de experiência, por £8,49. ([fonte](https://www.rya.org.uk/products/rya-day-skipper-shorebased-notes-ebook-1/), lista de produtos relacionados na página; consultado em 2026-10-07; `benchmark-18`)
  - Obs.: O código G158 aparece nas páginas dos exames Yachtmaster Offshore e Ocean.
- A RYA não publica preço único de curso: cada centro define o seu (`benchmark-13`). Os preços de referência acima são da Navathome (`benchmark-26`, `benchmark-28`) e da NauticEd, que também vende o Day Skipper Theory (`benchmark-54`).

### 1.5 Pontos fortes e fracos (análise própria)

- **Fortes:** escada clara do iniciante ao oceano, com exigências objetivas de milhas, dias e noites (`benchmark-20`, `benchmark-21`, `benchmark-23`). Teoria separada da prática, com o mesmo padrão de 40 h em cada nível (`benchmark-03`, `benchmark-06`, `benchmark-08`). Material oficial atualizado para navegação eletrônica e acessível (`benchmark-17`). Rádio com prática de fala (`benchmark-12`).
- **Fracos:** acesso por prazo limitado (12 meses na RYA Interactive; 6 meses na Navathome) (`benchmark-15`, `benchmark-26`). Troca de plataforma em 2026 apagou o progresso dos alunos (`benchmark-14`). Preço em libra, por centro (`benchmark-13`). Conteúdo voltado ao Reino Unido; não cobre a norma brasileira.

## 2. ASA (American Sailing)

### 2.1 Estrutura

- O ASA 101 (Keelboat Sailing 1) é para iniciantes sem pré-requisito e prepara para comandar um veleiro de quilha de 20 a 27 pés de dia, com vento de até 15 nós. ([fonte](https://americansailing.com/learn-to-sail/certifications/asa-101-keelboat-sailing-1/), seção 'WHAT YOU'LL LEARN'; consultado em 2026-10-07; `benchmark-29`)
- O ASA 108 Offshore Passagemaking exige 101, 103, 104, 105, 106 e 107/117 e cobre derrota ortodrômica e loxodrômica, rotas no Atlântico e no Pacífico, quartos de serviço, exercícios de emergência e navegação astronômica. ([fonte](https://americansailing.com/learn-to-sail/certifications/asa-108-offshore-passagemaking/), seções 'WHAT YOU'LL LEARN' e 'Prerequisites'; consultado em 2026-10-07; `benchmark-38`)

### 2.2 Cursos online, apps e recursos interativos

- Para o ASA 101, a ASA indica livro-texto (Sailing Made Easy), curso preparatório online, pacote de quizzes online e o app Sailing Challenge. ([fonte](https://americansailing.com/learn-to-sail/certifications/asa-101-keelboat-sailing-1/), seção 'STUDY MATERIALS'; consultado em 2026-10-07; `benchmark-31`)
- O 'Online Intro to Sailing' da ASA custa US$ 59 e tem 4 a 6 horas, 5 seções, 26 lições, 12 vídeos, 5 quizzes, prova final, certificado e acesso ilimitado; não dá selo no logbook. ([fonte](https://learn.americansailing.com/p/intro-to-sailing), cabeçalho do curso e FAQ; consultado em 2026-10-07; `benchmark-32`)
- O pacote de quizzes ASA 101/103/104 custa US$ 35 e tem mais de 100 questões; cada quiz avulso custa US$ 5. ([fonte](https://learn.americansailing.com/p/101-103-104-complete-bundle), página do pacote; consultado em 2026-10-07; `benchmark-33`)
- O ASA 105 Coastal Navigation online (feito com a Starpath) custa US$ 419, leva 40 a 60 horas, dá 1 ano de acesso e vale certificação ASA. ([fonte](https://americansailing.com/starpath/asa-105-coastal-navigation/), cabeçalho do curso e 'ASA & STARPATH ONLINE COURSES'; consultado em 2026-10-07; `benchmark-34`)
- O ASA 105 online ensina navegação tradicional e eletrônica ao mesmo tempo: o aluno resolve na carta de papel e depois no programa livre OpenCPN, com a carta de treino 18456tr. ([fonte](https://americansailing.com/starpath/asa-105-coastal-navigation/), seção 'Course Accessibility' / materiais; consultado em 2026-10-07; `benchmark-35`)
- O ASA 107 Celestial Navigation online custa US$ 419, exige o ASA 105, leva 40 a 60 horas, dá certificação e selo no logbook ao passar na prova final e não exige sextante. ([fonte](https://americansailing.com/starpath/asa-107-celestial-navigation/), cabeçalho, 'ASA 107 CERTIFICATION' e materiais; consultado em 2026-10-07; `benchmark-36`)
  - Obs.: 'A sextant is not required to work this course.' está no mesmo texto.
- Os cursos ASA/Starpath têm fórum de alunos acompanhado por instrutores em três fusos horários. ([fonte](https://americansailing.com/starpath/asa-107-celestial-navigation/), seção de suporte; consultado em 2026-10-07; `benchmark-37`)
- O app ASA Sailing Challenge é um jogo com módulos de pontos de vela, vento aparente, regulagem das velas, cambar e jibe, preferência de passagem (COLREG) e atracação; tem um percurso noturno guiado por boias iluminadas. ([fonte](https://americansailing.com/apps/sailing-challenge-app/), seções 'Learn To Be A Better Sailor!' e '5 Exciting & Challenging Sailing Levels'; consultado em 2026-10-07; `benchmark-39`)
- A ASA tem o app gratuito Go Sailing, que liga comandantes que precisam de tripulação a velejadores que querem embarcar. ([fonte](https://americansailing.com/apps/), bloco 'ASA's Go Sailing App'; consultado em 2026-10-07; `benchmark-41`)
- Os jogos educativos da ASA (palavras cruzadas, quebra-cabeça, 'Nautle', quiz, caça-palavras) exigem a assinatura A+. ([fonte](https://americansailing.com/games/), página 'Quizzes & Games'; consultado em 2026-10-07; `benchmark-42`)
  - Obs.: O texto aparece num bloco de acesso restrito da página; não conferi se todos os jogos estão bloqueados.

### 2.3 Avaliação e diário de bordo

- Na ASA, a certificação depende de demonstrar as habilidades na água e passar na prova escrita; o ASA 101 costuma durar dois dias inteiros, com cerca de 4 alunos por instrutor. ([fonte](https://americansailing.com/learn-to-sail/certifications/asa-101-keelboat-sailing-1/), seção 'frequently asked questions'; consultado em 2026-10-07; `benchmark-30`)
- Na ASA, o Logbook oficial registra cursos concluídos e horas de mar, é obrigatório no currículo e serve como currículo náutico para fretamento. ([fonte](https://americansailing.com/learn-to-sail/logbook/), página 'American Sailing Logbook'; consultado em 2026-10-07; `benchmark-40`)

### 2.4 Pontos fortes e fracos (análise própria)

- **Fortes:** o ASA 105 ensina papel e eletrônico lado a lado, com OpenCPN, programa livre (`benchmark-35`). O app Sailing Challenge transforma pontos de vela, vento aparente e preferência de passagem em jogo, com percurso noturno (`benchmark-39`). O Logbook é parte do sistema e serve de currículo (`benchmark-40`). Há app para achar tripulação (`benchmark-41`).
- **Fracos:** os cursos online de navegação são caros (US$ 419 cada) e dão só 1 ano de acesso (`benchmark-34`, `benchmark-36`). Os jogos ficam atrás de assinatura (`benchmark-42`). O curso introdutório não conta para certificação (`benchmark-32`). Tudo é em inglês e segue regras dos EUA.

## 3. NauticEd

### 3.1 Estrutura e preço

- A NauticEd oferece mais de 30 cursos online e para celular, de vela e motor, do básico ao avançado, e diz ser aprovada pela Guarda Costeira dos EUA (EDU-1 e EDU-3). ([fonte](https://www.nauticed.org/), página inicial, seções 'SAILING & POWERBOAT COURSES' e cabeçalho; consultado em 2026-10-07; `benchmark-43`)
  - Obs.: A aprovação USCG é afirmação da própria NauticEd ('APPROVED BY THE US COAST GUARD UNDER EDU-1 AND EDU-3'); não conferi na USCG.
- O pacote Captain Offshore da NauticEd tem 10 cursos (cerca de 82 horas) e custa US$ 379 (preço cheio US$ 440). ([fonte](https://www.nauticed.org/bundle/view/captain), cabeçalho do pacote; consultado em 2026-10-07; `benchmark-46`)
- O pacote Skipper Large Sailboats (2 cursos, cerca de 29 horas) custa US$ 148; com o curso e 10 dias registrados no diário, o aluno recebe o nível Skipper Large Keelboat. ([fonte](https://www.nauticed.org/bundle/view/skipper), cabeçalho e descrição do pacote; consultado em 2026-10-07; `benchmark-49`)
  - Obs.: Preço na mesma página: 'Price: $164.00 $148.00'.
- O curso Coastal Navigation da NauticEd custa US$ 39, leva cerca de 10 horas, inclui carta de treino para imprimir e dá acesso vitalício pelo site ou pelo app NauticEd. ([fonte](https://www.nauticed.org/sailing-courses/view/coastal-navigation), cabeçalho e 'Convenient Formats'; consultado em 2026-10-07; `benchmark-51`)
- A NauticEd vende o RYA Day Skipper Theory online por US$ 294 mais cerca de US$ 95 de material; a prova final é com consulta, corrigida por instrutor da RYA em 1 a 2 dias, e pode ser refeita. ([fonte](https://www.nauticed.org/sailing-courses/view/rya-day-skipper), cabeçalho e descrição da prova; consultado em 2026-10-07; `benchmark-54`)
  - Obs.: Preço na mesma página: 'Price: $294 + support materials (approx. $95 in the US and CAN)'.

### 3.2 Recursos interativos

- A NauticEd dá de graça os cursos Basic Sail Trim e Navigation Rules, além de diário de bordo eletrônico e gerador de currículo náutico. ([fonte](https://www.nauticed.org/free-online-boating-courses), seções 'FREE SAILING COURSES' e 'FREE LOGBOOK AND RESUME TOOL'; consultado em 2026-10-07; `benchmark-44`)
- O curso gratuito Basic Sail Trim da NauticEd usa animações interativas em HTML5 em que o aluno mexe nos controles de regulagem e vê o efeito do vento. ([fonte](https://www.nauticed.org/sailing-courses), item 'BASIC SAIL TRIM COURSE'; consultado em 2026-10-07; `benchmark-45`)
- O Coastal Navigation da NauticEd treina plotagem em papel, estima, marcação de três pontos, ponto por marcações sucessivas, conversão verdadeiro/magnético/agulha e corrente (set & drift). ([fonte](https://www.nauticed.org/sailing-courses/view/coastal-navigation), descrição inicial do curso; consultado em 2026-10-07; `benchmark-52`)
- O curso de vela em realidade virtual da NauticEd roda no óculos Meta Quest com o app MarineVerse (US$ 19,99; módulo de atracação pago à parte) e soma a experiência em VR ao currículo do aluno. ([fonte](https://www.nauticed.org/sailing-courses/view/virtual-reality-sailing), seções de preço e benefícios; consultado em 2026-10-07; `benchmark-53`)
  - Obs.: Mesma página: 'your VR sailing training and experience are added to your NauticEd online course curriculum and sailing resume'.
- O Advanced Sail Trim da NauticEd usa animações 3D para mostrar o vento agindo nas velas. ([fonte](https://www.nauticed.org/sailing-courses), item 'ADVANCED SAIL TRIM COURSE'; consultado em 2026-10-07; `benchmark-55`)
- A NauticEd tem um curso introdutório de navegação astronômica online em que o aluno faz uma meridiana ('noon shot') e determina a posição. ([fonte](https://www.nauticed.org/sailing-courses), item 'INTRODUCTORY CELESTIAL NAVIGATION COURSE'; consultado em 2026-10-07; `benchmark-90`)

### 3.3 Avaliação, níveis e licença

- Na NauticEd, quem conclui os 10 cursos do pacote Captain e registra 50 dias de navegação no diário eletrônico gratuito recebe o nível 'Captain Level III' no currículo. ([fonte](https://www.nauticed.org/bundle/view/captain), descrição do pacote; consultado em 2026-10-07; `benchmark-47`)
- Nos cursos da NauticEd não há prazo para terminar, as lições podem ser revistas à vontade e as provas podem ser refeitas quantas vezes forem precisas. ([fonte](https://www.nauticed.org/bundle/view/captain), quadro 'REMEMBER'; consultado em 2026-10-07; `benchmark-48`)
- O pacote Bareboat Charter Master (6 cursos, cerca de 53 horas) custa US$ 247 e, com 50 dias registrados, a prova SLC gratuita e uma avaliação prática de 6 horas, leva à licença internacional SLC da NauticEd; a prova SLC é refeita a cada 3 anos. ([fonte](https://www.nauticed.org/bundle/view/bareboatcharter), cabeçalho, 'SLC EXAMINATION COURSE' e nota sobre licença; consultado em 2026-10-07; `benchmark-50`)
  - Obs.: Preço: 'Price: $284.00 $247.00'. Avaliação: 'Most everything is online except for a 6-hour assessment of your skills and competence on the water.'

### 3.4 Pontos fortes e fracos (análise própria)

- **Fortes:** o melhor modelo de "competência = teoria + prática + experiência registrada": níveis que dependem de cursos e de dias no diário (`benchmark-47`, `benchmark-49`). Diário e currículo gratuitos (`benchmark-44`). Animações em que o aluno mexe nos controles (`benchmark-45`). Acesso vitalício e provas refeitas sem limite (`benchmark-48`, `benchmark-51`).
- **Fracos:** os níveis e a licença SLC são da própria empresa, não de governo (`benchmark-50`). O VR exige óculos e app pagos (`benchmark-53`). A carta de treino é dos EUA (`benchmark-51`).

## 4. Brasil: Arrais-, Mestre- e Capitão-Amador

### 4.1 O que a Marinha define e publica

- A prova de Arrais-Amador é eletrônica ou escrita, com 40 questões e no máximo 2 horas. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção I, item 3, alínea b, p. 5-A-7; consultado em 2026-10-07; `benchmark-56`)
- A prova de Mestre-Amador é eletrônica ou escrita, com 40 questões de múltipla escolha (4 com carta náutica) e no máximo 3 horas. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção I, item 2, alínea c, p. 5-A-4; consultado em 2026-10-07; `benchmark-57`)
- A prova de Capitão-Amador é escrita, com 40 questões e no máximo 4 horas. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção I, item 1, alínea b, p. 5-A-1; consultado em 2026-10-07; `benchmark-58`)
- Nas provas de Arrais-, Mestre- e Capitão-Amador, a nota máxima é 10,0 e aprova quem tira pelo menos 5,0. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção I: item 1, alínea c (p. 5-A-1); item 2, alínea d (p. 5-A-4); item 3, alínea c (p. 5-A-7); consultado em 2026-10-07; `benchmark-92`)
  - Obs.: O trecho citado é o do CPA (item 1 c). Nos itens 2 d e 3 c o texto termina com 'pontos na prova'.
- As provas de Mestre-Amador e de Arrais-Amador devem ser destruídas logo após a correção, para manter o sigilo do Banco de Questões; por isso não há provas oficiais de ARA/MSA publicadas. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção I, item 2, alínea g (p. 5-A-5) e item 3, alínea f (p. 5-A-7); consultado em 2026-10-07; `benchmark-59`)
  - Obs.: A conclusão 'não há provas oficiais publicadas' vem do levantamento em research/provas_antigas.md (seção 1).
- O treinamento obrigatório de Arrais-Amador tem 2 h de teoria, dada necessariamente no ambiente da embarcação, e 4 h de prática com a embarcação em movimento; logo, um curso só online não substitui o treinamento. ([fonte](https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf), Anexo 5-A, Seção II, item 1, alínea a, p. 5-A-9 e 5-A-10; consultado em 2026-10-07; `benchmark-60`)
  - Obs.: A conclusão 'curso só online não substitui' é leitura nossa do texto; a parte prática: 'Parte Prática - 4h A parte prática deverá ser ministrada pelo instrutor com a embarcação em movimento'.
- A DPC publica na página 'Exame para Categoria de Capitão Amador' as provas, gabaritos e listas de aprovados do CPA. ([fonte](https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador), lista de documentos da página (bloco 2026); consultado em 2026-10-07; `benchmark-61`)
  - Obs.: Inventário completo (2017–2026) em research/provas_antigas.md.
- O conteúdo do site da DPC está sob licença Creative Commons Atribuição-SemDerivações 3.0; o app pode linkar e citar as provas de CPA, mas não deve adaptá-las. ([fonte](https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador), rodapé da página; consultado em 2026-10-07; `benchmark-62`)
  - Obs.: A parte 'não deve adaptá-las' é interpretação da licença BY-ND; confirmar com quem cuida da licença do projeto.
- O app oficial 'Marinha do Brasil' no Google Play traz notícias, Rádio Marinha, concursos, cultura e história; a descrição não cita simulados nem estudo para a CHA. ([fonte](https://play.google.com/store/apps/details?id=br.gov.marinhaoficial.app&hl=pt_BR&gl=BR), seção 'Sobre este app'; consultado em 2026-10-07; `benchmark-63`)
  - Obs.: Página da loja (Google Play), não da Marinha. Não achei app oficial de simulado da Marinha.

### 4.2 Cursos online (EAD) e gratuitos

- O curso teórico online de Arrais e Motonauta da eNauti custa R$ 69,99 e traz 9 horas de videoaulas (ou 5 horas na versão resumida), cerca de 450 questões, 5 simulados, e-book e 1 ano de acesso. ([fonte](https://enauti.com/arrais/), bloco de compra no topo da página; consultado em 2026-10-07; `benchmark-64`)
- O curso de Arrais da eNauti tem 14 módulos: introdução, nomenclatura, manobras, regras de manobra, luzes/marcas/sinais sonoros, sinalização náutica, incêndio, primeiros socorros, sobrevivência e salvatagem, normas, meteorologia, navegação, comunicações e marés. ([fonte](https://enauti.com/arrais/), seção 'CONTEÚDO DO CURSO'; consultado em 2026-10-07; `benchmark-65`)
- A eNauti só cobre a teoria: avisa que Arrais e Motonauta exigem atestado de treinamento de escola credenciada pela Marinha e indica escolas para a prática. ([fonte](https://enauti.com/nossos-cursos/), seção 'ARRAIS AMADOR E MOTONAUTA'; consultado em 2026-10-07; `benchmark-66`)
- A eNauti vende por R$ 10 um simulado de Arrais/Motonauta que gera provas diferentes a cada vez, balanceadas por assunto, e diz ter banco de mais de 1.100 questões. ([fonte](https://enauti.com/nossos-cursos/), bloco 'SIMULADO PARA ARRAIS E MOTONAUTA'; consultado em 2026-10-07; `benchmark-67`)
  - Obs.: A origem das questões é afirmação do vendedor; a norma manda destruir as provas de ARA (ver benchmark sobre sigilo).
- O curso online de Mestre-Amador da eNauti custa R$ 348 e anuncia 16 horas, mais de 430 exercícios, carta náutica para imprimir e e-book com mais de 50 exercícios de navegação resolvidos. ([fonte](https://enauti.com/nossos-cursos/), bloco 'CURSO COMPLETO ONLINE DE MESTRE AMADOR'; consultado em 2026-10-07; `benchmark-68`)
  - Obs.: 'Igual à da prova' é afirmação do vendedor, não verificada.
- Na Hotmart, o curso de Mestre-Amador da eNauti tem 15 módulos (introdução, fundamentos da navegação, carta e publicações, estimada e costeira, instrumentos, GPS, estabilidade, marés, radar, meteorologia, comunicações, EPIRB/AIS, sobrevivência, sinalização, RIPEAM) e 3 simulados, com nota 4,8 em 108 avaliações. ([fonte](https://hotmart.com/pt-br/marketplace/produtos/curso-de-mestre-amador-online-completo/C49922602K), abas 'Conteúdo' e 'Avaliações'; consultado em 2026-10-07; `benchmark-69`)
- O pacote online de Capitão-Amador da eNauti custa R$ 982 e soma mais de 47 horas de videoaulas, mais de 900 exercícios e 3 e-books; os módulos avulsos são Navegação Eletrônica (R$ 347), Navegação Astronômica (R$ 419) e demais matérias (R$ 438). ([fonte](https://enauti.com/nossos-cursos/), seção 'CAPITÃO AMADOR'; consultado em 2026-10-07; `benchmark-70`)
- O módulo de Navegação Astronômica da eNauti para o CPA tem mais de 11 horas de teoria em vídeo e mais de 80 questões de provas anteriores resolvidas em vídeo. ([fonte](https://enauti.com/nossos-cursos/), bloco do curso de Navegação Astronômica; consultado em 2026-10-07; `benchmark-71`)
- O módulo de Navegação Eletrônica da eNauti para o CPA (R$ 347) resolve em vídeo questões de provas anteriores sobre radar e rosa de manobra e traz mais de 270 questões. ([fonte](https://enauti.com/nossos-cursos/), bloco do curso de Navegação Eletrônica; consultado em 2026-10-07; `benchmark-91`)
- A Cursa oferece um curso gratuito de Arrais-Amador e Motonauta de 13 h 43 min, com aulas em vídeo intercaladas por exercícios. ([fonte](https://cursa.app/pt/curso-gratuito/arrais-amador-e-motonauta-dgea), cabeçalho e lista de aulas; consultado em 2026-10-07; `benchmark-72`)
- O Clube do Arrais Amador publica um curso grátis de Arrais em 10 capítulos e simulados por tema (balizamento, RIPEAM, primeiros socorros), e avisa que é só um subsídio. ([fonte](https://clubedoarrais.com/curso-gratis-de-arrais-amador-online/), corpo da página e lista 'Simulados para Arrais Amador'; consultado em 2026-10-07; `benchmark-73`)
- A Escola Náutica Sampaio oferece um simulado online gratuito de Arrais com 15 questões de múltipla escolha. ([fonte](https://ead.escolanauticasampaio.com.br/habilitacao/simulado-online-arrais-amador/), 'Visão Geral'; consultado em 2026-10-07; `benchmark-74`)

### 4.3 Cursos presenciais e híbridos

- A Navegart (Rio/Niterói) vende o Arrais-Amador EAD por R$ 890: teoria na plataforma EAD, mais 2 h presenciais e 4 h de prática em lancha, com no máximo 5 alunos por aula. ([fonte](https://navegart.eco.br/arrais-amador-ead), página 'Arrais Amador EAD'; consultado em 2026-10-07; `benchmark-75`)
  - Obs.: Mesma página: 'R$ 890,00' e 'Máximo 5 alunos na lancha a cada aula.'
- O Mestre-Amador intensivo da Navegart tem 20 horas presenciais por R$ 1.390, com apostila, simulados e empréstimo de régua paralela, carta náutica e compassos. ([fonte](https://navegart.eco.br/mestre-amador-msa-intensivo), cabeçalho do curso e material; consultado em 2026-10-07; `benchmark-76`)
- Para Capitão-Amador, a Navegart divide o curso em Navegação Astronômica (17 h, R$ 1.050) e Navegação Eletrônica (24 h, R$ 1.170); em 2026-10-07 não havia turma marcada. ([fonte](https://navegart.eco.br/capitao-amador-modulo-1-navegacao-astronomica), cabeçalho e 'Próximas Turmas'; consultado em 2026-10-07; `benchmark-77`)
  - Obs.: Módulo 2: https://navegart.eco.br/capitao-amador-modulo-2-navegacao-eletronica-2 ('Carga Horária: 24 horas', 'Preço: R$ 1.170,00'). Ambas: 'Não há turma programada.'
- A CL Vela (Marina da Glória, Rio) cobra R$ 1.350 só pela aula prática de Arrais (6 h embarcadas, até 5 alunos); teoria e material são vendidos à parte. ([fonte](https://clvela.com.br/cursos/arrais-amador/), página do produto 'Arrais Amador Prático'; consultado em 2026-10-07; `benchmark-78`)
- O Mestre-Amador da CL Vela custa R$ 1.150, tem 21 horas ao vivo por videoconferência (terças e quartas à noite) e exige Arrais; a última turma de 2026 começa em 10/11. ([fonte](https://clvela.com.br/cursos/mestre-amador/), página do produto 'Mestre Amador'; consultado em 2026-10-07; `benchmark-79`)
- A Náutica Sete Mares (Urca, Rio) faz a prática de Arrais a bordo de um veleiro-escola, com 6 horas embarcadas, por R$ 897 à vista; inclui atestado, videoaulas e simulados. ([fonte](https://nauticasetemares.com.br/cursos/curso-arrais-amador/), seções 'Informações', 'Incluído no Curso' e preço; consultado em 2026-10-07; `benchmark-80`)
  - Obs.: 'aula prática intensiva a bordo de um veleiro escola' e '6 horas embarcadas' na mesma página. A página também diz que a GRU custa R$ 57,72 (dado da escola, não da Marinha).
- A Escola Náutica do Espírito Santo anuncia o Arrais por R$ 746 (de R$ 829,90), com 2 h de teoria na marina e 4 h de prática no canal de Vitória. ([fonte](https://www.escolanauticaes.com.br/cursos/arrais-amador/), preço e 'CARGA HORÁRIA'; consultado em 2026-10-07; `benchmark-81`)
- A Marina Sylvestre (Guarapiranga, São Paulo) combina 3,5 horas de teoria online em 6 módulos com 4 horas de prática embarcada no Arrais. ([fonte](https://www.marinasylvestre.com.br/arrais-amador/), resumo do curso; consultado em 2026-10-07; `benchmark-82`)
  - Obs.: Preço não visível na página consultada.
- O Tahiti Náutica Club oferece curso teórico de Capitão-Amador de cerca de 3 meses, duas noites por semana, por R$ 3.000, incluindo material e inscrição no exame. ([fonte](https://www.tahiticlub.com.br/site/cursos/capit%C3%A3o-amador.html), texto da página 'Capitão Amador'; consultado em 2026-10-07; `benchmark-83`)
  - Obs.: A página não tem data; valor 'R$ 3000,00'.
- A Navegantes do Sul vende um programa híbrido de Capitão-Amador (aulas online, vídeos, 'sala de aula na nuvem', aulas presenciais e práticas a bordo opcionais) por R$ 202,50. ([fonte](https://www.navegantesdosul.com.br/produto/capitao-amador/), página do produto; consultado em 2026-10-07; `benchmark-84`)
  - Obs.: Não ficou claro se R$ 202,50 é o programa inteiro ou uma parcela.

### 4.4 Apps de simulado

- O app 'Simulados Motonauta e Arrais' (Aplicativos Legais) é grátis com compras no app (assinaturas de R$ 14,90 e R$ 24,90; 'Simulados Premium' R$ 9,90), tem nota 4,8 com cerca de 1 mil avaliações na App Store e permite montar simulados com número de questões e tempo escolhidos, com histórico por assunto. ([fonte](https://apps.apple.com/br/app/simulados-motonauta-e-arrais/id1553348111), descrição, 'Classificações e Avaliações' e 'Compras dentro do app'; consultado em 2026-10-07; `benchmark-85`)
- Na Google Play, o mesmo app declara que não tem relação com a Marinha nem com o governo. ([fonte](https://play.google.com/store/apps/details?id=com.aplicativoslegais.simuladosmotonauta&hl=pt_BR&gl=BR), 'Sobre este app'; consultado em 2026-10-07; `benchmark-86`)
- O app 'Simulados Arrais e Motonauta' tem modo prova cronometrado e correção com explicações; na App Store cobra R$ 6,90/semana, R$ 19,90/mês ou R$ 99,90/ano e tem nota 4,8 (406 avaliações). ([fonte](https://apps.apple.com/br/app/simulados-arrais-e-motonauta/id1592568193), descrição e 'Compras dentro do app'; consultado em 2026-10-07; `benchmark-87`)
  - Obs.: Na Google Play (br.app.simulado.arrais, King Apps Ltda): nota 4,1, 155 avaliações, '10 mil+' downloads, com anúncios.
- O app 'Arrais-amador e Mestre-amador' (QuinhoDevs) custa R$ 6,99 na Google Play, cobre Motonauta, Arrais e Mestre com mais de 800 questões e foi atualizado em 18/8/2026. ([fonte](https://play.google.com/store/apps/details?id=br.com.quinhodevops.simuladoscha&hl=pt_BR&gl=BR), 'Sobre este app' e 'Atualizado em'; consultado em 2026-10-07; `benchmark-88`)
- O app 'Mare Alta - Arrais e Cursos' traz curso de Arrais em 11 módulos com videoaulas, banco de questões por módulo com resolução em vídeo e simulados; a última atualização é de 8/2/2024. ([fonte](https://play.google.com/store/apps/details?id=com.marealta2.app&hl=pt_BR&gl=BR), 'Sobre este app' e 'Atualizado em'; consultado em 2026-10-07; `benchmark-89`)
- Busca feita em 2026-10-07 na Google Play por "arrais amador", "mestre amador simulado", "capitão amador" e "navegação astronômica": não apareceu app brasileiro de simulado para Capitão-Amador. Apareceram apps de navegação astronômica em inglês ([busca](https://play.google.com/store/search?q=capit%C3%A3o%20amador&c=apps&hl=pt_BR&gl=BR), lista de resultados; consultado em 2026-10-07). Observação nossa, sem id.

### 4.5 Pontos fortes e fracos (análise própria)

- **Fortes:** preço baixo no online (`benchmark-64`, `benchmark-68`). Módulos seguem o programa da prova (`benchmark-65`, `benchmark-69`). Muitas questões e simulados (`benchmark-64`, `benchmark-67`). As escolas presenciais oferecem o barco real e a prática obrigatória (`benchmark-75`, `benchmark-80`).
- **Fracos:** quase só vídeo e PDF, sem simuladores interativos de carta, luzes ou astronômica. A origem das questões é afirmação do vendedor, enquanto a norma manda destruir as provas de ARA e MSA (`benchmark-59`, `benchmark-67`). Os apps cobram assinatura ou têm anúncios (`benchmark-85`, `benchmark-87`). Nenhum app cobre o CPA. Nenhum curso brasileiro achado liga a habilitação à prática de vela oceânica nem tem diário de bordo. Os cursos param na prova.

## 5. Matriz de recursos (análise própria, a partir dos fatos acima)

Legenda: **S** = tem (com id da prova); **–** = não achado nas páginas consultadas (não quer dizer que não exista).

| Recurso | RYA / centros | ASA | NauticEd | Brasil online | Apps BR |
|---|---|---|---|---|---|
| Carta náutica interativa / chartplotter simulado | S (`benchmark-26`) | S, via OpenCPN (`benchmark-35`) | parcial: carta para imprimir (`benchmark-51`) | – (carta para imprimir, `benchmark-68`) | – |
| Simulador de luzes à noite | – | S, percurso noturno com boias (`benchmark-39`) | – | – | – |
| Vento aparente / regulagem interativa | – | S (`benchmark-39`) | S (`benchmark-45`, `benchmark-55`) | – | – |
| Animação / 3D / VR | animações (`benchmark-28`) | S, jogo (`benchmark-39`) | S, 3D e VR (`benchmark-53`, `benchmark-55`) | – | – |
| Rádio VHF com prática | S (`benchmark-12`, `benchmark-26`) | – | – | – | – |
| Radar simulado | S (`benchmark-26`) | – | – | – | – |
| Astronômica sem sextante físico | S (`benchmark-28`) | S (`benchmark-36`) | introdutório (`benchmark-90`) | S, vídeo (`benchmark-71`) | – |
| Quizzes por módulo | S (`benchmark-27`) | S (`benchmark-32`, `benchmark-33`) | S (`benchmark-48`) | S (`benchmark-64`) | S (`benchmark-85`) |
| Prova ou simulado final online | S (`benchmark-27`) | S (`benchmark-32`) | S, prova SLC (`benchmark-50`) | S (`benchmark-67`) | S (`benchmark-87`) |
| Modo prova cronometrado | – | – | – | – | S (`benchmark-87`) |
| Estatística por assunto | – | – | – | – | S (`benchmark-85`, `benchmark-87`) |
| Diário de bordo / currículo | S, G158 (`benchmark-18`) | S (`benchmark-40`) | S, eletrônico (`benchmark-44`) | – | – |
| Níveis ligados à experiência registrada | S, milhas para o Yachtmaster (`benchmark-21`) | – | S (`benchmark-47`, `benchmark-49`) | – | – |
| Achar tripulação / embarque | – | S (`benchmark-41`) | – | – | – |
| Acesso sem prazo | – (12 meses, `benchmark-15`) | – (1 ano, `benchmark-34`) | S (`benchmark-48`) | – (1 ano, `benchmark-64`) | assinatura (`benchmark-87`) |
| Gratuito | – | parcial: app Go Sailing (`benchmark-41`) | parcial (`benchmark-44`) | parcial (`benchmark-72`, `benchmark-73`) | parcial (`benchmark-85`) |

## 6. O que o nosso app precisa ter para ser igual ou melhor (priorizado, análise própria)

### Prioridade 1: obrigatório para igualar

1. **Programa oficial como espinha dorsal.** Cada lição e cada questão ligada a um item do Anexo 5-A (ARA, MSA, CPA), com referência visível. Os cursos brasileiros seguem o programa, mas não mostram essa ligação (`benchmark-65`, `benchmark-69`). A RYA publica o conteúdo de cada curso (`benchmark-05`, `benchmark-07`, `benchmark-08`).
2. **Simulados no formato real.** ARA com 40 questões em 2 h; MSA com 40 questões, 4 com carta, em 3 h; CPA com 40 questões em 4 h; aprovação com 5,0 (`benchmark-56`, `benchmark-57`, `benchmark-58`, `benchmark-92`). Modo prova cronometrado, modo estudo, correção comentada e estatística por assunto, como os apps (`benchmark-85`, `benchmark-87`). Questões **autorais**, porque o banco de ARA e MSA é sigiloso (`benchmark-59`). Para CPA, link para as provas oficiais da DPC, sem adaptá-las (licença BY-ND) (`benchmark-61`, `benchmark-62`).
3. **Grátis, sem anúncio, sem login e offline, com acesso sem prazo.** É o que bate os apps com assinatura (`benchmark-87`), a RYA Interactive (12 meses, `benchmark-15`) e os cursos de 1 ano (`benchmark-34`, `benchmark-64`).
4. **Carta náutica interativa de treino (MSA/CPA).** Plotar rumo e marcação, ponto por duas marcações, estima, corrente e abatimento, e conversão Rv/Rm/Rag. Nível do chartplotter simulado da Navathome e do papel + OpenCPN do ASA 105 (`benchmark-26`, `benchmark-35`, `benchmark-52`). Os cursos brasileiros só dão carta para imprimir (`benchmark-68`).
5. **Simulador noturno de luzes, marcas e sinais sonoros (RIPEAM) e balizamento IALA B.** Só a ASA tem algo parecido, em jogo (`benchmark-39`). É o assunto com mais aulas no curso de Arrais da eNauti (`benchmark-65`).
6. **Aviso honesto sobre a prática obrigatória do Arrais.** São 2 h de teoria no ambiente da embarcação e 4 h de prática em escola credenciada; um curso online não substitui isso (`benchmark-60`, `benchmark-66`). Ligar à aba "Onde estudar".
7. **Navegação astronômica sem sextante físico.** Esfera celeste 3D, sextante virtual e cálculo guiado da meridiana com extratos do Almanaque Náutico, como na Navathome e no ASA 107 (`benchmark-28`, `benchmark-36`). Exercícios no formato das provas de CPA (`benchmark-61`).

### Prioridade 2: para superar

8. **Diário de bordo (logbook) e currículo náutico.** Registrar milhas, dias, noites e função (tripulante ou comandante), com exportação (JSON/CSV/PDF), como a ASA e a NauticEd (`benchmark-40`, `benchmark-44`). Barras de progresso rumo às metas da RYA como referência: pré-requisito do Day Skipper prático (5 dias, 100 milhas e 4 h noturnas a bordo); Yachtmaster Offshore com 50 dias, 2.500 milhas e 5 passagens de mais de 60 milhas; Yachtmaster Ocean com 600 milhas e 96 h (`benchmark-20`, `benchmark-21`, `benchmark-23`).
9. **Escada única do leigo ao transatlântico.** Ligar a habilitação brasileira à prática de vela e oceano. Níveis liberados por estudo **e** experiência registrada, como a NauticEd (`benchmark-47`, `benchmark-49`). Nenhum curso brasileiro achado faz isso.
10. **Mareação interativa e veleiro 3D.** Pontos de vela, vento real e aparente, regulagem, cambar e jibe (`benchmark-39`, `benchmark-45`, `benchmark-55`). Sem exigir óculos de VR (`benchmark-53`).
11. **Simulador de VHF/DSC.** Roteiros de MAYDAY, PAN-PAN e SÉCURITÉ, canais e DSC, como o SRC online e a Navathome (`benchmark-12`, `benchmark-26`).
12. **Calculadoras e mini-simuladores.** Marés (tábua da DHN e regra dos doze avos; a Navathome tem curvas de maré interativas), agulha, velocidade-tempo-distância, radar e rosa de manobra, assuntos do CPA (`benchmark-26`, `benchmark-91`).
13. **Navegação eletrônica primeiro, com papel de reserva.** GPS, chartplotter e AIS, com conferência manual. É a tendência relatada na RYA e o modelo do ASA 105 (`benchmark-25`, `benchmark-35`).
14. **Flashcards com repetição espaçada.** Para nomenclatura, luzes, balizamento e regras. Nenhuma das referências anuncia isso nas páginas consultadas.
15. **Trilha internacional opcional (RYA/ASA/ICC/SLC).** Mostrar equivalências, exigências e preços de referência, com links (`benchmark-21`, `benchmark-34`, `benchmark-50`).
16. **Achar tripulação e embarque.** Links e mapa de crew-finders e regatas, como o Go Sailing da ASA (`benchmark-41`).

### Prioridade 3: qualidade e confiança

17. **Acessibilidade WCAG 2.x AA** (o e-book da RYA declara WCAG 2.0 AA) (`benchmark-17`), em telas claras e escuras e no celular.
18. **Transparência de fontes e de versão.** Cada questão com referência normativa e data. Mostrar a versão da NORMAM usada. Os apps comerciais dizem "baseado em provas reais" sem como conferir (`benchmark-85`, `benchmark-88`).
19. **Exportar e importar o progresso.** Os dados ficam só no navegador, então é preciso um arquivo para trocar de aparelho. Hoje, a troca de plataforma da RYA apagou o progresso dos alunos (`benchmark-14`).
20. **Canal para dúvidas e correções.** Por exemplo, as Discussions do repositório, no lugar do fórum com instrutores da Starpath (`benchmark-37`).

## A confirmar / lacunas

- RYA Interactive: a RYA anunciou nova plataforma para abril de 2026, mas a página não diz se ela já abriu nem como se chama. Em 2026-10-07, www.ryainteractive.org só mostrava uma tela de login. Confirmar ([página](https://www.rya.org.uk/training/rya-elearning/rya-interactive/)).
- RYA "digital first": só achei imprensa do setor (Marine Industry News, com correção em 19/6/2026). Falta documento da RYA com o programa novo e a data de vigência.
- Preço oficial dos cursos online da RYA: a RYA diz que cada centro define o preço. Usamos a Navathome (£275) e a NauticEd (US$ 294 + material) como exemplos, não como preço da RYA.
- Starboard Brasil (starboardbr.com.br) e Mc Martins (mcmartins.com.br) apareceram em buscas com cursos de Mestre-Amador, mas os domínios não resolveram (DNS) em 2026-10-07. Os preços citados nas buscas ficaram de fora.
- A página da Hotmart do curso de Navegação Astronômica para CPA não carregou. Usamos a página da própria eNauti.
- Não achei app oficial de simulado da Marinha. O app "Marinha do Brasil" traz só notícias e informações. Confirmar com a DPC se existe simulado oficial ou prova eletrônica de demonstração.
- Valor da GRU do exame de Arrais (R$ 57,72): é dado da página da Náutica Sete Mares, não da Marinha. Conferir em normas.md ou na Capitania.
- Navegantes do Sul: não está claro se R$ 202,50 é o programa inteiro de Capitão-Amador ou uma parcela. Tahiti Náutica Club: página sem data e sem cidade explícita (cita a Capitania dos Portos de Santos).
- eNauti: a página do curso de Arrais diz "mais de 26.000 alunos (até Nov/2026)", data posterior à consulta. Provável erro da página.
- A origem das questões dos apps e cursos ("baseadas em provas reais", "obtidas ao longo de vários anos") é afirmação dos vendedores. A norma manda destruir as provas de ARA e MSA após a correção.
- NauticEd: a aprovação pela Guarda Costeira dos EUA (EDU-1/EDU-3) foi conferida só no site da própria NauticEd.
- ASA: os preços dos cursos práticos (ASA 101 etc.) são definidos por cada escola. Não há preço central.
- Licença das provas de CPA (CC BY-ND 3.0 no rodapé da DPC): confirmar se o app pode reproduzir questões inteiras com atribuição, ou se só deve linkar. A licença proíbe obras derivadas.
- Cartas náuticas: verificar a licença das cartas da DHN antes de usar trechos na carta interativa. Alternativa: carta de treino própria, fictícia ou de dados abertos.
- Não achei app brasileiro de simulado para Capitão-Amador (busca na Google Play em 2026-10-07). A App Store não foi varrida para CPA.
- Não verifiquei por dentro (com login) nenhum curso pago. Recursos como "simulador" ou "interativo" são o que as páginas de venda anunciam.
