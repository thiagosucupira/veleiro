/* Glossário: utilidades compartilhadas (busca sem acento, destaque, cabeçalho, fontes). */
(function () {
  'use strict';
  var h = VL.h;
  var G = VL.glossario = VL.glossario || {};

  /* ---------- normalização ---------- */
  /** minúsculas, sem acento, sem apóstrofo; o resto vira espaço. */
  G.norm = function (s) {
    return VL.semAcento(String(s || '')).replace(/[’'`´]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  };
  G.semHtml = function (s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '); };
  G.data = function (iso) { return VL.fmt.data((iso || '2026-10-07') + 'T12:00'); };

  /* ---------- índice de busca ---------- */
  var prep = null;
  G.preparar = function () {
    var g = VL.data.glossario;
    if (prep && prep.g === g) return prep;
    var catNome = {};
    g.categorias.forEach(function (c) { catNome[c.id] = c; });
    var termos = g.termos.slice().sort(function (a, b) { return a.termo.localeCompare(b.termo, 'pt-BR', { sensitivity: 'base' }); });
    var porId = {}, citadoEm = {};
    termos.forEach(function (t, i) {
      porId[t.id] = t;
      t._i = i;
      t._nt = G.norm(t.termo);
      t._ns = (t.sin || []).concat(t.busca || []).map(G.norm);
      t._ne = G.norm(t.en);
      t._nd = G.norm(G.semHtml(t.def));
      t._tudo = [t._nt, t._ns.join(' '), t._ne, t._nd].join(' ');
      t._letra = (t._nt.charAt(0) || '#').toUpperCase();
    });
    termos.forEach(function (t) { (t.ver || []).forEach(function (v) { (citadoEm[v] = citadoEm[v] || []).push(t.id); }); });
    prep = { g: g, termos: termos, porId: porId, cat: catNome, citadoEm: citadoEm, alias: g.alias || {} };
    return prep;
  };
  G.achar = function (id) {
    var p = G.preparar();
    if (p.porId[id]) return p.porId[id];
    if (p.alias[id]) return p.porId[p.alias[id]];
    return null;
  };

  /** Busca: todas as palavras precisam aparecer; ordena por onde casou (termo > sinônimo > inglês > definição). */
  G.buscar = function (q, cat) {
    var p = G.preparar();
    var nq = G.norm(q), tok = nq ? nq.split(' ') : [];
    var lista = p.termos.filter(function (t) { return !cat || t.categoria === cat; });
    if (!tok.length) return lista.map(function (t) { return { t: t, s: 0 }; });
    var out = [];
    lista.forEach(function (t) {
      for (var i = 0; i < tok.length; i++) if (t._tudo.indexOf(tok[i]) === -1) return;
      var s = 1;
      var comeca = function (x) { return x === nq ? 3 : (x.indexOf(nq) === 0 ? 2 : (x.indexOf(nq) >= 0 ? 1 : 0)); };
      var ct = comeca(t._nt), cs = Math.max.apply(null, [0].concat(t._ns.map(comeca))), ce = t._ne ? comeca(t._ne) : 0;
      if (ct) s = 100 + ct * 30; else if (cs) s = 80 + cs * 10; else if (ce) s = 60 + ce * 8;
      else {
        var todasNoNome = tok.every(function (k) { return (t._nt + ' ' + t._ns.join(' ') + ' ' + t._ne).indexOf(k) >= 0; });
        s = todasNoNome ? 50 : (t._nd.indexOf(nq) >= 0 ? 20 : 10);
      }
      out.push({ t: t, s: s });
    });
    out.sort(function (a, b) { return b.s - a.s || a.t._i - b.t._i; });
    return out;
  };

  /* ---------- destaque sem acento ---------- */
  /** Divide um texto em pedaços marcados/não marcados conforme as palavras buscadas. */
  function faixas(texto, tok) {
    if (!tok.length) return [];
    var base = '', mapa = [];
    for (var i = 0; i < texto.length; i++) {
      var c = VL.semAcento(texto.charAt(i));
      for (var j = 0; j < c.length; j++) { base += c.charAt(j); mapa.push(i); }
    }
    var marc = [];
    tok.forEach(function (k) {
      if (!k) return;
      var de = 0, pos;
      while ((pos = base.indexOf(k, de)) >= 0) { marc.push([mapa[pos], mapa[pos + k.length - 1] + 1]); de = pos + k.length; }
    });
    marc.sort(function (a, b) { return a[0] - b[0]; });
    var unidas = [];
    marc.forEach(function (m) { var u = unidas[unidas.length - 1]; if (u && m[0] <= u[1]) u[1] = Math.max(u[1], m[1]); else unidas.push(m.slice()); });
    return unidas;
  }
  G.tokens = function (q) { var n = G.norm(q); return n ? n.split(' ').filter(function (k) { return k.length > 0; }) : []; };
  /** Texto simples com <mark>. */
  G.marcar = function (texto, tok) {
    var fx = faixas(texto, tok), frag = document.createDocumentFragment(), pos = 0;
    fx.forEach(function (f) {
      if (f[0] > pos) frag.appendChild(document.createTextNode(texto.slice(pos, f[0])));
      frag.appendChild(h('mark', null, texto.slice(f[0], f[1])));
      pos = f[1];
    });
    if (pos < texto.length) frag.appendChild(document.createTextNode(texto.slice(pos)));
    return frag;
  };
  /** Marca dentro de um elemento com HTML (percorre só os nós de texto). */
  G.marcarEm = function (el, tok) {
    if (!tok.length) return el;
    var nos = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()) nos.push(w.currentNode);
    nos.forEach(function (n) {
      if (!faixas(n.nodeValue, tok).length) return;
      n.parentNode.replaceChild(G.marcar(n.nodeValue, tok), n);
    });
    return el;
  };

  /* ---------- peças de interface ---------- */
  G.subnav = function (atual) {
    var itens = [{ id: 'termos', rotulo: 'Termos', rota: 'glossario' }, { id: 'referencias', rotulo: 'Referências oficiais', rota: 'glossario/referencias' }];
    var nav = h('nav', { class: 'gl-subnav', 'aria-label': 'Seções do glossário' });
    itens.forEach(function (it) { nav.appendChild(h('a', { href: VL.link(it.rota), 'aria-current': it.id === atual ? 'page' : null }, it.rotulo)); });
    return nav;
  };

  /** Lista de fontes oficiais de um termo: [{txt, url, loc}] */
  G.fontes = function (t, consultado) {
    var fs = t.fonte ? (Array.isArray(t.fonte) ? t.fonte : [t.fonte]) : [];
    if (!fs.length) return null;
    var ul = h('ul', { class: 'gl-fontes-lista' });
    fs.forEach(function (f) {
      ul.appendChild(h('li', null,
        h('a', { href: f.url, target: '_blank', rel: 'noopener' }, f.txt, VL.icon('externo', 14)),
        f.loc ? h('span', { class: 'gl-fonte-loc' }, ', ' + f.loc) : null));
    });
    return h('div', { class: 'gl-fontes' },
      h('p', { class: 'gl-fontes-t' }, fs.length > 1 ? 'Fontes' : 'Fonte'), ul,
      h('p', { class: 'gl-consulta' }, 'Consultado em ' + G.data(consultado) + '. Confirme na Capitania antes da prova se a norma mudou.'));
  };

  /** Rolagem suave até um elemento, respeitando movimento reduzido e a barra do topo. */
  G.rolarAte = function (el) {
    if (!el) return;
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var topo = (VL.$('#topbar') || { offsetHeight: 56 }).offsetHeight + 8;
    var y = el.getBoundingClientRect().top + window.pageYOffset - topo;
    window.scrollTo({ top: Math.max(0, y), behavior: reduz ? 'auto' : 'smooth' });
  };
})();
