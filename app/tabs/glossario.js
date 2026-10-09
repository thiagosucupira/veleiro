/* Aba "Glossário e referências". Este arquivo só registra a aba e encaminha as rotas;
   o resto vem sob demanda de tabs/glossario/*.js, data/glossario.js, data/referencias.js e
   assets/css/tabs/glossario.css.
   Rotas:
     #/glossario?q=<busca>&cat=<categoria>   lista com busca sem acento, filtro por categoria e índice A–Z
     #/glossario/termo/<id>                  página do termo (aceita sinônimos como id: #/glossario/termo/estibordo)
     #/glossario/referencias                 referências oficiais e bibliografia das provas
   Para linkar um termo de uma lição: bloco {t:'termos', ids:['escota', 'cambar']} (core/course.js). */
(function () {
  'use strict';
  var BASE = 'tabs/glossario/';
  var ARQUIVOS = [BASE + 'comum.js', BASE + 'lista.js', BASE + 'termo.js', BASE + 'referencias.js'];

  VL.tabs.register({
    id: 'glossario', titulo: 'Glossário e referências', curto: 'Glossário', grupo: 'ferramentas', icone: 'livro', ordem: 10,
    render: function (el, rota) {
      var raiz = VL.h('div', { class: 'gl' });
      el.appendChild(raiz);
      var p = rota.params;
      var ehRef = p[0] === 'referencias';
      var espera = setTimeout(function () { if (!raiz.childNodes.length) raiz.appendChild(VL.ui.carregando('Abrindo o glossário…')); }, 150);
      return Promise.all([
        VL.loadCSS('assets/css/tabs/glossario.css'),
        VL.load(ARQUIVOS),
        VL.carregarDado(ehRef ? 'referencias' : 'glossario'),
      ]).then(function () {
        clearTimeout(espera);
        if (!raiz.isConnected) return;
        raiz.innerHTML = '';
        var G = VL.glossario;
        if (ehRef) return G.referencias(raiz, rota);
        if (p[0] === 'termo' && p[1]) return G.paginaTermo(raiz, p[1], rota);
        return G.lista(raiz, rota);
      }, function (e) { clearTimeout(espera); throw e; });
    },
  });
})();
