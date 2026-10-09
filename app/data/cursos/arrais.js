/* Curso Arrais-Amador — arquivo principal. Os módulos ficam nas partes (um autor por parte).
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 3.1 (prova) e Seção II (treinamento prático). */
VL.dado('cursos/arrais', {
  id: 'arrais', titulo: 'Arrais-Amador', nivel: 'arrais', simulado: 'arrais', flashcards: 'arrais',
  resumo: 'A primeira habilitação: conduzir embarcações em <span class="agua">águas interiores</span> (rios, lagos, baías e áreas abrigadas definidas por cada Capitania). Segue item por item o programa oficial da prova (NORMAM-211, Anexo 5-A) e prepara você para o treinamento prático obrigatório.',
  prerequisitos: [
    'Nenhum conhecimento prévio. Começamos do zero: partes do barco, nós, regras de navegação.',
    { html: 'Para a prova: 18 anos ou mais e saber ler e escrever.', ref: 'normas-50' },
    { html: 'Para a inscrição: atestado de treinamento prático de no mínimo 6 horas (2 h de teoria e 4 h de prática) numa escola náutica ou instrutor credenciado na Capitania. Veja o módulo sobre a prova.', ref: 'normas-58' },
  ],
  fontesGerais: [
    { txt: 'NORMAM-211/DPC (Marinha do Brasil), Capítulo 5 e Anexo 5-A', url: 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf' },
    { txt: 'DPC — Navegador Amador', url: 'https://www.marinha.mil.br/dpc/navegador-amador' },
  ],
  partes: ['cursos/arrais-1', 'cursos/arrais-2', 'cursos/arrais-3'],
  modulos: [],
});
