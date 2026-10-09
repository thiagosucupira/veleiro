/* Moldura do app: trilho de navegação, barra superior, gaveta no celular e inicialização. */
(function () {
  'use strict';
  var h = VL.h;
  var GRUPOS = [
    { id: 'rumo', titulo: 'Rumo' },
    { id: 'marinha', titulo: 'Habilitação da Marinha' },
    { id: 'mar', titulo: 'Mar aberto' },
    { id: 'ferramentas', titulo: 'Ferramentas' },
    { id: 'projeto', titulo: 'Projeto' },
  ];
  var CURSOS = { arrais: 'arrais', mestre: 'mestre', capitao: 'capitao', vela: 'vela', travessia: 'travessia', radio: 'radio' };

  function aoClicarNav() {
    var estava = gavetaAberta();
    fecharGaveta();
    if (estava) { var v = VL.$('#view'); if (v) v.focus({ preventScroll: true }); }   // o link da gaveta some; o foco vai ao conteúdo
  }
  function montarTrilho() {
    var rail = VL.$('#rail');
    rail.innerHTML = '';
    rail.appendChild(h('a', { class: 'brand', href: VL.link('roteiro') }, VL.marca(36),
      h('span', { class: 'brand-name' }, 'Veleiro', h('span', { class: 'brand-sub' }, 'de leigo a transatlântico'))));
    var abas = VL.tabs.all();
    var atual = VL.rota().aba;
    GRUPOS.forEach(function (g) {
      var itens = abas.filter(function (a) { return (a.grupo || 'ferramentas') === g.id; });
      if (!itens.length) return;
      var grupo = h('div', { class: 'nav-group', role: 'group', 'aria-labelledby': 'ng-' + g.id }, h('p', { class: 'nav-group-title', id: 'ng-' + g.id }, g.titulo));
      itens.forEach(function (a) {
        var medidor = null;
        if (CURSOS[a.id]) {
          var r = VL.progress.resumoCurso(CURSOS[a.id]);
          if (r && r.total && r.feitas) medidor = h('span', { class: 'nav-meter', title: r.feitas + ' de ' + r.total + ' lições' }, VL.fmt.pct(r.feitas / r.total));
        }
        grupo.appendChild(h('a', { class: 'nav-link', href: VL.link(a.id), 'aria-current': a.id === atual ? 'page' : null, onclick: aoClicarNav },
          VL.icon(a.icone || 'info', 20), h('span', null, a.curto || a.titulo), medidor));
      });
      rail.appendChild(h('nav', { 'aria-label': g.titulo }, grupo));
    });
    rail.appendChild(h('div', { class: 'rail-foot' },
      h('span', null, 'Código MIT · conteúdo CC BY-SA 4.0'),
      h('span', null, 'Não substitui instrução prática nem a habilitação oficial.')));
  }

  function iconeTema() {
    var t = VL.settings.get('tema');
    return t === 'claro' ? 'sol' : (t === 'escuro' ? 'lua' : 'auto');
  }
  function montarTopo() {
    var bar = VL.$('#topbar');
    bar.innerHTML = '';
    bar.appendChild(h('button', { type: 'button', class: 'btn btn-icon btn-quiet menu-btn', 'aria-label': 'Abrir menu', 'aria-controls': 'rail', 'aria-expanded': 'false', onclick: abrirGaveta }, VL.icon('menu')));
    var rota = VL.rota(), aba = VL.tabs.get(rota.aba) || VL.tabs.get('roteiro');
    bar.appendChild(h('p', { class: 'topbar-title' }, aba ? aba.titulo : 'Veleiro'));
    var temaBtn = h('button', { type: 'button', class: 'btn btn-icon btn-quiet', 'aria-label': 'Trocar tema (atual: ' + VL.settings.get('tema') + ')', title: 'Tema: automático, claro ou escuro', onclick: function () {
      var ordem = ['auto', 'claro', 'escuro'];
      var prox = ordem[(ordem.indexOf(VL.settings.get('tema')) + 1) % 3];
      VL.settings.set('tema', prox);   // emite 'settings' e 'tema'; o topo se refaz sozinho
      VL.ui.toast(prox === 'auto' ? 'Tema automático (segue o sistema)' : 'Tema ' + prox);
      var novo = VL.$('.topbar-actions .btn'); if (novo) novo.focus();
    } }, VL.icon(iconeTema()));
    bar.appendChild(h('div', { class: 'topbar-actions' }, temaBtn,
      h('button', { type: 'button', class: 'btn btn-icon btn-quiet', 'aria-label': 'Configurações', title: 'Configurações', onclick: function () { VL.config.abrir(); } }, VL.icon('config'))));
  }

  /* Gaveta (celular): o resto da página fica inerte enquanto ela está aberta; Tab circula dentro dela;
     Esc, o fundo escuro ou um link a fecham. Ao fechar por Esc ou pelo fundo, o foco volta ao botão de menu. */
  function gavetaAberta() { var app = VL.$('.app'); return !!app && app.getAttribute('data-drawer') === 'open'; }
  function definirInerte(sim) { var m = VL.$('.main'); if (!m) return; if (sim) m.setAttribute('inert', ''); else m.removeAttribute('inert'); }
  function abrirGaveta() {
    var app = VL.$('.app');
    app.setAttribute('data-drawer', 'open');
    app.appendChild(h('div', { class: 'drawer-scrim', onclick: function () { fecharGaveta(true); } }));
    definirInerte(true);
    var mb = VL.$('.menu-btn'); if (mb) mb.setAttribute('aria-expanded', 'true');
    var atual = VL.$('#rail a[aria-current="page"]') || VL.$('#rail a'); if (atual) atual.focus();
  }
  function fecharGaveta(voltarFoco) {
    var app = VL.$('.app');
    if (!app || app.getAttribute('data-drawer') !== 'open') return;
    app.removeAttribute('data-drawer');
    VL.$$('.drawer-scrim').forEach(function (x) { x.remove(); });
    definirInerte(false);
    var mb = VL.$('.menu-btn');
    if (mb) { mb.setAttribute('aria-expanded', 'false'); if (voltarFoco === true) mb.focus(); }
  }
  document.addEventListener('keydown', function (e) {
    if (!gavetaAberta()) return;
    if (e.key === 'Escape') { e.preventDefault(); fecharGaveta(true); return; }
    if (e.key !== 'Tab') return;
    var foco = VL.$$('#rail a[href], #rail button').filter(function (x) { return x.offsetParent !== null; });
    if (!foco.length) return;
    var primeiro = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || !VL.$('#rail').contains(document.activeElement))) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && (document.activeElement === ultimo || !VL.$('#rail').contains(document.activeElement))) { e.preventDefault(); primeiro.focus(); }
  });
  /* Se a janela crescer com a gaveta aberta, ela deixa de existir como gaveta: solta o resto da página. */
  window.addEventListener('resize', function () { if (gavetaAberta() && window.innerWidth > 960) fecharGaveta(); });

  function aoMudarRota() {
    if (VL.podeSair && !VL.podeSair()) return;
    var abaAntes = VL._ultimaAba;
    fecharGaveta();
    montarTrilho();
    montarTopo();
    VL.render();
    /* Trocou de aba: leva o foco ao conteúdo (leitor de tela anuncia a página nova; teclado não fica num link escondido). */
    if (VL._ultimaAba !== abaAntes) { var v = VL.$('#view'); if (v) v.focus({ preventScroll: true }); }
  }

  function iniciar() {
    VL.settings.aplicar();
    montarTrilho();
    montarTopo();
    window.addEventListener('hashchange', aoMudarRota);
    VL.on('progresso', function () { montarTrilho(); });
    VL.on('settings', function () { montarTrilho(); montarTopo(); });
    if (!location.hash) history.replaceState(null, '', '#/roteiro');
    VL.render();
    if (!VL.settings.get('onboarded')) setTimeout(VL.config.boasVindas, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
