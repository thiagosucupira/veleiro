/* Glossário: lista de termos (#/glossario?q=…&cat=…) com busca sem acento, filtro por categoria e índice A–Z. */
(function () {
  'use strict';
  var h = VL.h;
  var G = VL.glossario;
  var LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var volta = { hash: null, y: 0 }; /* para voltar à mesma altura da lista depois de abrir um termo */

  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  G.lista = function (raiz, rota) {
    var p = G.preparar(), g = p.g;
    var intl = !!VL.settings.get('intl');
    var est = { q: rota.query.q || '', cat: rota.query.cat && p.cat[rota.query.cat] ? rota.query.cat : '' };
    var visiveis = p.termos.filter(function (t) { return intl || !t.intl; });
    var comFig = visiveis.filter(function (t) { return t.figura; }).length;

    raiz.appendChild(VL.ui.cabecalho('Glossário',
      visiveis.length + ' termos náuticos em português, do casco à navegação astronômica, ' + comFig + ' deles com figura. ' +
      'Cada um traz relacionados e, quando há, a fonte e o simulador.'));
    raiz.appendChild(G.subnav('termos'));

    /* ---- busca ---- */
    var input = h('input', { type: 'search', id: 'gl-q', 'aria-label': 'Buscar no glossário',  class: 'gl-busca-input', value: est.q, autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'search',
      placeholder: intl ? 'Ex.: escota, maré, sheet' : 'Ex.: escota, maré, farol', 'aria-describedby': 'gl-status gl-dica' });
    var limpar = h('button', { type: 'button', class: 'btn btn-quiet btn-icon gl-busca-limpar', 'aria-label': 'Limpar a busca', hidden: !est.q,
      onclick: function () { input.value = ''; est.q = ''; atualizar(); input.focus(); } }, VL.icon('fechar', 18));
    var busca = h('div', { class: 'gl-busca', role: 'search' },
      h('label', { for: 'gl-q', class: 'gl-busca-rot' }, 'Buscar no glossário'),
      h('div', { class: 'gl-busca-campo' }, VL.icon('busca', 20), input, limpar),
      h('p', { id: 'gl-dica', class: 'gl-busca-dica' }, 'Busca por nome, sinônimo' + (intl ? ', termo em inglês' : '') + ' ou palavra da definição, sem precisar de acento.', h('span', { class: 'gl-so-teclado' }, ' Tecle ', h('kbd', null, '/'), ' para buscar de qualquer ponto da página.')));

    /* ---- categorias ---- */
    var chips = h('div', { class: 'gl-chips', role: 'group', 'aria-label': 'Filtrar por categoria' });
    var chipEls = {};
    [{ id: '', curto: 'Todas', nome: 'Todas as categorias' }].concat(g.categorias).forEach(function (c) {
      var n = h('span', { class: 'gl-chip-n' });
      var b = h('button', { type: 'button', class: 'chip gl-chip', 'aria-pressed': String(est.cat === c.id), title: c.nome,
        onclick: function () { est.cat = c.id; atualizar(true); } }, h('span', null, c.curto), n);
      chipEls[c.id] = { b: b, n: n };
      chips.appendChild(b);
    });

    var status = h('p', { id: 'gl-status', class: 'gl-status', role: 'status', 'aria-live': 'polite' });
    var lista = h('div', { class: 'gl-lista' });
    var az = h('nav', { class: 'gl-az', 'aria-label': 'Índice de A a Z' });
    var rodape = h('p', { class: 'gl-rodape muted' }, 'Falta um termo ou achou um erro? ', h('a', { href: VL.link('sobre') }, 'Veja como contribuir'), '.');
    raiz.appendChild(busca);
    raiz.appendChild(chips);
    raiz.appendChild(h('div', { class: 'gl-corpo' }, h('div', { class: 'gl-col' }, status, lista, rodape), az));
    raiz.appendChild(VL.ui.avisoLegal());

    /* ---- desenho ---- */
    var obs = null;
    function item(t, tok) {
      var cat = p.cat[t.categoria];
      var nome = h('a', { class: 'gl-item-nome', href: VL.link('glossario/termo/' + t.id), onclick: guardarVolta }, tok.length ? G.marcar(t.termo, tok) : t.termo);
      var cab = h('div', { class: 'gl-item-cab' }, nome,
        intl && t.en ? h('span', { class: 'gl-item-en', lang: 'en' }, tok.length ? G.marcar(t.en, tok) : t.en) : null);
      /* por que o termo apareceu: sinônimo ("Também") ou palavra ligada que não está na definição ("Relacionado") */
      var sin = null;
      var casa = function (x) { var n = G.norm(x); return tok.every(function (k) { return n.indexOf(k) >= 0; }); };
      if (tok.length && !tok.every(function (k) { return t._nt.indexOf(k) >= 0; })) {
        var s = (t.sin || []).filter(casa)[0];
        var r = s ? null : (t.busca || []).filter(function (x) { return casa(x) && t._nd.indexOf(G.norm(x)) === -1; })[0];
        if (s) sin = h('p', { class: 'gl-item-sin' }, 'Também: ', G.marcar(s, tok));
        else if (r) sin = h('p', { class: 'gl-item-sin' }, 'Relacionado: ', G.marcar(r, tok));
      }
      var def = h('p', { class: 'gl-item-def', html: t.def });
      if (tok.length) G.marcarEm(def, tok);
      var meta = h('p', { class: 'gl-item-meta' }, h('span', null, cat ? cat.curto : ''),
        t.figura ? h('span', null, 'figura') : null, t.widget ? h('span', null, 'simulador') : null,
        t.fonte ? h('span', null, 'com fonte') : null);
      return h('li', { class: 'gl-item' }, cab, sin, def, meta);
    }
    function guardarVolta() { volta.hash = location.hash; volta.y = window.pageYOffset; }

    function atualizar(deChip) {
      est.q = input.value;
      limpar.hidden = !est.q;
      var tok = G.tokens(est.q);
      var todos = G.buscar(est.q, '').filter(function (r) { return intl || !r.t.intl; });
      var porCat = {};
      todos.forEach(function (r) { porCat[r.t.categoria] = (porCat[r.t.categoria] || 0) + 1; });
      Object.keys(chipEls).forEach(function (id) {
        var c = chipEls[id], n = id ? (porCat[id] || 0) : todos.length;
        c.b.setAttribute('aria-pressed', String(est.cat === id));
        c.n.textContent = String(n);
        c.b.classList.toggle('gl-chip-vazio', n === 0 && est.cat !== id);
      });
      var res = est.cat ? todos.filter(function (r) { return r.t.categoria === est.cat; }) : todos;
      var catNome = est.cat ? p.cat[est.cat].nome : '';
      status.textContent = tok.length
        ? plural(res.length, 'termo', 'termos') + ' para “' + est.q.trim() + '”' + (catNome ? ' em ' + catNome : '')
        : plural(res.length, 'termo', 'termos') + (catNome ? ' em ' + catNome : '') + ', em ordem alfabética';
      lista.innerHTML = '';
      if (tok.length) lista.setAttribute('data-busca', ''); else lista.removeAttribute('data-busca');
      az.innerHTML = '';
      if (obs) { obs.disconnect(); obs = null; }
      if (!res.length) {
        lista.appendChild(h('div', { class: 'vazio gl-vazio' },
          h('p', null, 'Nenhum termo encontrado' + (tok.length ? ' para “' + est.q.trim() + '”' : '') + (catNome ? ' em ' + catNome : '') + '.'),
          h('p', { class: 'small' }, est.cat && todos.length ? 'Há ' + plural(todos.length, 'resultado', 'resultados') + ' em outras categorias.' : 'Tente outra palavra ou um sinônimo.'),
          h('div', { class: 'btn-row', style: { justifyContent: 'center' } },
            est.cat && todos.length ? h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { est.cat = ''; atualizar(true); } }, 'Buscar em todas as categorias') : null,
            tok.length ? h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { input.value = ''; atualizar(); input.focus(); } }, 'Limpar a busca') : null)));
      } else if (tok.length) {
        var ul = h('ul', { class: 'gl-itens', 'aria-label': 'Resultados da busca' });
        res.forEach(function (r) { ul.appendChild(item(r.t, tok)); });
        lista.appendChild(ul);
      } else {
        var grupos = {}, ordem = [];
        res.forEach(function (r) { var L = r.t._letra; if (!grupos[L]) { grupos[L] = []; ordem.push(L); } grupos[L].push(r.t); });
        ordem.forEach(function (L) {
          var ulL = h('ul', { class: 'gl-itens' });
          grupos[L].forEach(function (t) { ulL.appendChild(item(t, tok)); });
          lista.appendChild(h('section', { class: 'gl-grupo', 'aria-labelledby': 'gl-L-' + L },
            h('h2', { class: 'gl-letra', id: 'gl-L-' + L, tabindex: '-1' }, L), ulL));
        });
        LETRAS.forEach(function (L) {
          if (!grupos[L]) { az.appendChild(h('span', { class: 'gl-az-l', 'data-vazia': '1', 'aria-hidden': 'true' }, L)); return; }
          az.appendChild(h('button', { type: 'button', class: 'gl-az-l', 'data-l': L, 'aria-label': 'Ir para a letra ' + L + ' (' + plural(grupos[L].length, 'termo', 'termos') + ')',
            onclick: function () { var alvo = document.getElementById('gl-L-' + L); G.rolarAte(alvo); if (alvo) alvo.focus({ preventScroll: true }); } }, L));
        });
        if ('IntersectionObserver' in window) {
          obs = new IntersectionObserver(function (ents) {
            ents.forEach(function (e) {
              if (!e.isIntersecting) return;
              var L = e.target.id.slice(5);
              VL.$$('.gl-az-l[aria-current]', az).forEach(function (b) { b.removeAttribute('aria-current'); });
              var b = VL.$('.gl-az-l[data-l="' + L + '"]', az); if (b) b.setAttribute('aria-current', 'true');
            });
          }, { rootMargin: '-64px 0px -70% 0px' });
          VL.$$('.gl-letra', lista).forEach(function (el) { obs.observe(el); });
        }
      }
      az.hidden = !!tok.length || !res.length;
      /* endereço compartilhável sem redesenhar a página */
      var qs = [];
      if (est.q.trim()) qs.push('q=' + encodeURIComponent(est.q.trim()));
      if (est.cat) qs.push('cat=' + est.cat);
      var novo = '#/glossario' + (qs.length ? '?' + qs.join('&') : '');
      if (location.hash !== novo) { try { history.replaceState(null, '', novo); } catch (e) { /* file:// antigo */ } }
      if (deChip && window.pageYOffset > chips.offsetTop) G.rolarAte(chips);
    }

    var agendado = null;
    input.addEventListener('input', function () {
      if (agendado) cancelAnimationFrame(agendado);
      agendado = requestAnimationFrame(function () { agendado = null; atualizar(); });
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) { e.preventDefault(); input.value = ''; atualizar(); }
      if (e.key === 'Enter') { var primeiro = VL.$('.gl-item-nome', lista); if (primeiro && G.tokens(input.value).length) { e.preventDefault(); guardarVolta(); primeiro.click(); } }
    });
    function atalho(e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
      e.preventDefault(); input.focus(); input.select();
    }
    document.addEventListener('keydown', atalho);
    VL.aoSair(function () { document.removeEventListener('keydown', atalho); if (obs) obs.disconnect(); if (agendado) cancelAnimationFrame(agendado); });

    atualizar();
    if (volta.hash && volta.hash === location.hash && volta.y) {
      var y = volta.y;
      requestAnimationFrame(function () { window.scrollTo(0, y); });
    }
    volta.hash = null;
  };
})();
