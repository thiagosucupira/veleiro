/* Aba "Roteiro da habilitação": a escada do leigo à travessia transatlântica, desenhada como uma derrota plotada
   numa carta náutica estilizada. Este arquivo só registra a aba; o resto vem sob demanda de
   tabs/roteiro/*.js, data/roteiro.js, data/locais.js e assets/css/tabs/roteiro.css.
   Rotas:
     #/roteiro                       carta com a próxima etapa aberta
     #/roteiro/<etapa>               etapa aberta (id ou alias: vela-basica, cruzeiro, arrais, milhas-costeiras, mestre,
                                     skipper-diurno, skipper-noturno, travessias, capitao, offshore-tripulante,
                                     imediato-oceanico, transatlantica)
     #/roteiro/tempo | complementares | agendar     rola até a seção (também ?secao=...) */
(function () {
  'use strict';
  var BASE = 'tabs/roteiro/';
  var ARQUIVOS = [BASE + 'comum.js', BASE + 'carta.js', BASE + 'painel.js', BASE + 'tempo.js', BASE + 'extras.js', BASE + 'pagina.js'];

  VL.tabs.register({
    id: 'roteiro', titulo: 'Roteiro da habilitação', curto: 'Roteiro', grupo: 'rumo', icone: 'rota', ordem: 1,
    render: function (el, rota) {
      var raiz = VL.h('div', { class: 'rt' });
      el.appendChild(raiz);
      var espera = setTimeout(function () { if (!raiz.childNodes.length) raiz.appendChild(VL.ui.carregando('Plotando a derrota…')); }, 150);
      var locais = VL.carregarDado('locais').catch(function () { return null; });
      return Promise.all([VL.loadCSS('assets/css/tabs/roteiro.css'), VL.load(ARQUIVOS), VL.carregarDado('roteiro'), locais]).then(function () {
        clearTimeout(espera);
        if (!raiz.isConnected) return;
        raiz.innerHTML = '';
        VL.roteiro.montar(raiz, rota);
      }, function (e) { clearTimeout(espera); throw e; });
    },
  });
})();
