/* Aba "Onde estudar e praticar" (#/locais). Este arquivo só registra a aba; o resto vem sob demanda de
   tabs/locais/*.js, data/locais.js, data/geo/*.js e assets/css/tabs/locais.css.
   Rotas: #/locais  com filtros opcionais na query:
     q=<busca>  escopo=brasil|exterior|online|todos  regiao=Sul  uf=SP (ou pais=Portugal)
     tipo=cha,escola,clube,regata,rally,crew,charter,marina,intl,radio,seguranca,capitania  curso=arrais|mestre|capitao|oceano…
     id=<id do local>  abre o popup do local no mapa.
   Dados: data/locais.js (gerado por tools/build_locais.py). Mapa: Leaflet com base offline; OpenStreetMap só se o usuário ligar. */
(function () {
  'use strict';
  var BASE = 'tabs/locais/';
  VL.tabs.register({
    id: 'locais', titulo: 'Onde estudar e praticar', curto: 'Onde estudar', grupo: 'ferramentas', icone: 'mapa', ordem: 8,
    render: function (el, rota) {
      var raiz = VL.h('div', { class: 'loc' });
      el.appendChild(raiz);
      var espera = setTimeout(function () { if (!raiz.childNodes.length) raiz.appendChild(VL.ui.carregando('Abrindo os locais…')); }, 150);
      return Promise.all([
        VL.loadCSS('assets/css/tabs/locais.css'),
        VL.load([BASE + 'dados.js', BASE + 'mapa.js', BASE + 'tela.js']),
      ]).then(function () {
        clearTimeout(espera);
        if (!raiz.isConnected) return;
        raiz.innerHTML = '';
        return VL.locais.montar(raiz, rota);
      }, function (e) { clearTimeout(espera); throw e; });
    },
  });
})();
