/* Curso Mestre-Amador — arquivo principal. Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 2.1. */
VL.dado('cursos/mestre', {
  id: 'mestre', titulo: 'Mestre-Amador', nivel: 'mestre', simulado: 'mestre', flashcards: 'mestre',
  resumo: 'Navegação costeira: conduzir entre portos, dentro dos limites de visibilidade da costa e até 20 milhas dela. O centro do curso é a carta náutica: rumos, marcações, posição, corrente e maré, além de meteorologia costeira, radar, GNSS e comunicações.',
  prerequisitos: [
    { html: 'Ter a habilitação de Arrais-Amador dentro da validade (exigência para se inscrever na prova).', ref: 'normas-47' },
    'Ter feito o curso de Arrais-Amador deste app ou revisar RIPEAM, balizamento e marés.',
    'Material para treinar em casa: lápis, borracha, compasso de pontas secas, transferidor e régua paralela ou par de esquadros.',
  ],
  fontesGerais: [
    { txt: 'NORMAM-211/DPC, Anexo 5-A, item 2 (exame de Mestre-Amador)', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf' },
    { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN)', url: 'https://www.marinha.mil.br/dhn/' },
  ],
  partes: ['cursos/mestre-1', 'cursos/mestre-2', 'cursos/mestre-3'],
  modulos: [],
});
