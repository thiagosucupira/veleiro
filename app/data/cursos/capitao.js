/* Curso Capitão-Amador — arquivo principal. Programa oficial: NORMAM-211/DPC, Anexo 5-A, itens 1.1 a 1.8. */
VL.dado('cursos/capitao', {
  id: 'capitao', titulo: 'Capitão-Amador', nivel: 'capitao', simulado: 'capitao', flashcards: 'capitao',
  resumo: 'Navegação oceânica, sem limite de afastamento da costa: a habilitação que permite levar um veleiro através do <span class="agua">Atlântico</span>. Navegação astronômica (passagem meridiana do Sol), navegação eletrônica e radar, estabilidade, meteorologia e oceanografia, comunicações e sobrevivência no mar.',
  prerequisitos: [
    { html: 'Ter a habilitação de Mestre-Amador dentro da validade no ato da inscrição.', ref: 'normas-48' },
    'Dominar carta náutica, rumos e marcações (curso de Mestre-Amador).',
    { html: 'A prova é nacional, em datas divulgadas pelas Capitanias: em princípio, inscrições em fevereiro e agosto e provas em abril e outubro. Confira o calendário antes.', ref: 'normas-77' },
  ],
  fontesGerais: [
    { txt: 'NORMAM-211/DPC, Anexo 5-A, item 1 (exame de Capitão-Amador)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf' },
    { txt: 'DPC — provas e gabaritos de Capitão-Amador', url: 'https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador' },
  ],
  partes: ['cursos/capitao-1', 'cursos/capitao-2', 'cursos/capitao-3'],
  modulos: [],
});
