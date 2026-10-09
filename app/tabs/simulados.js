/* Aba "Simulados e flashcards". Este arquivo só registra a aba e encaminha as rotas;
   o resto é carregado sob demanda de tabs/simulados/*.js e assets/css/tabs/simulados.css.
   Rotas:
     #/simulados                                  painel
     #/simulados/<nivel>                          página do nível (modos, prática por assunto, histórico)
     #/simulados/<nivel>/prova                    instruções + prova cronometrada (VL.quiz.prova)
     #/simulados/<nivel>/pratica?tema=a,b&n=20&so=ineditas|erradas   prática comentada (VL.quiz.pratica)
     #/simulados/<nivel>/erradas                  só as questões cujo último resultado foi erro
     #/simulados/flashcards                       baralhos por nível (VL.srs.stats)
     #/simulados/flashcards/<nivel|baralho>       sessão de estudo (VL.srs.mount); nível = todos os baralhos dele juntos
   Níveis: arrais, mestre, capitao (provas da Marinha) e vela, travessia, radio (formato do app). */
(function () {
  'use strict';
  var BASE = 'tabs/simulados/';
  var ARQUIVOS = [BASE + 'comum.js', BASE + 'graficos.js', BASE + 'painel.js', BASE + 'nivel.js', BASE + 'flashcards.js'];

  VL.tabs.register({
    id: 'simulados', titulo: 'Simulados e flashcards', curto: 'Simulados', grupo: 'ferramentas', icone: 'prova', ordem: 9,
    render: function (el, rota) {
      var raiz = VL.h('div', { class: 'sim' });
      el.appendChild(raiz);
      return Promise.all([VL.loadCSS('assets/css/tabs/simulados.css'), VL.load(ARQUIVOS)]).then(function () {
        if (!raiz.isConnected) return;
        var S = VL.simulados, p = rota.params;
        if (!p[0]) return S.painel(raiz, rota);
        if (p[0] === 'flashcards') return p[1] ? S.estudarBaralho(raiz, p[1]) : S.listaBaralhos(raiz);
        var n = S.nivel(p[0]);
        if (!n) return S.naoEncontrado(raiz);
        if (!p[1]) return S.paginaNivel(raiz, n, rota);
        if (p[1] === 'prova') return S.prova(raiz, n);
        if (p[1] === 'pratica') return S.pratica(raiz, n, rota);
        if (p[1] === 'erradas') return S.erradas(raiz, n);
        return S.naoEncontrado(raiz);
      });
    },
  });
})();
