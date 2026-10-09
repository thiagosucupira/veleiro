/* Roteiro: utilitários compartilhados (elementos SVG, fatos com selo, preços calculados dos locais, ritmo e progresso). */
(function () {
  'use strict';
  var h = VL.h;
  var R = VL.roteiro = VL.roteiro || {};
  var NS = 'http://www.w3.org/2000/svg';

  /** Cria elemento SVG: S('g', {class:'x', 'data-a':1, style:{...}, onclick:fn}, filhos...) */
  R.S = function (tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      for (var a in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, a)) continue;
        var v = attrs[a];
        if (v == null || v === false) continue;
        if (a === 'text') el.textContent = v;
        else if (a === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (a.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(a.slice(2), v);
        else el.setAttribute(a, v === true ? '' : v);
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      var k = arguments[i];
      if (k == null || k === false) continue;
      if (Array.isArray(k)) k.forEach(function (x) { if (x) el.appendChild(x); });
      else el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
    }
    return el;
  };

  /* ---------- dados ---------- */
  R.dados = function () { return VL.data.roteiro; };
  R.etapas = function () { return VL.data.roteiro.etapas; };
  /** Acha a etapa por id ou alias. */
  R.etapa = function (id) {
    if (!id) return null;
    var lista = R.etapas();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id || (lista[i].alias || []).indexOf(id) >= 0) return lista[i];
    }
    return null;
  };
  R.indice = function (e) { return R.etapas().indexOf(e); };

  /* ---------- progresso ---------- */
  R.feita = function (id) { return !!VL.progress.etapa(id); };
  R.chave = function (e, c) { return e.id + '.' + c.id; };
  R.competenciasFeitas = function (e) {
    var n = 0;
    (e.competencias || []).forEach(function (c) { if (R.feita(R.chave(e, c))) n++; });
    return n;
  };
  /** Índice da primeira etapa não concluída (a que "você está aqui"); se todas estão concluídas, a última. */
  R.indiceAtual = function () {
    var l = R.etapas();
    for (var i = 0; i < l.length; i++) if (!R.feita(l[i].id)) return i;
    return l.length - 1;
  };
  R.concluidas = function () {
    var n = 0;
    R.etapas().forEach(function (e) { if (R.feita(e.id)) n++; });
    return n;
  };
  R.estadoDe = function (i) {
    var e = R.etapas()[i];
    if (R.feita(e.id)) return 'feita';
    return i === R.indiceAtual() ? 'atual' : 'futura';
  };

  /* ---------- ritmo e duração ---------- */
  R.configurado = function () {
    var s = VL.store.get('settings', {}) || {};
    return { base: !!(s.uf || s.lat != null), ritmo: s.ritmoHoras != null, onboarded: !!s.onboarded };
  };
  R.ritmo = function () {
    var r = Number(VL.settings.get('ritmoHoras'));
    return r > 0 ? r : R.dados().ritmoPadrao;
  };
  R.horas = function (e) { return (e.tempo.estudoH || 0) + (e.tempo.praticaH || 0); };
  R.semanas = function (e) { return R.horas(e) / R.ritmo(); };
  R.totalHoras = function () { return R.etapas().reduce(function (s, e) { return s + R.horas(e); }, 0); };
  R.totalSemanas = function () { return R.totalHoras() / R.ritmo(); };
  R.durTxt = function (semanas) { return '≈ ' + VL.fmt.semanas(semanas); };

  /* ---------- formatação ---------- */
  var SIMB = { BRL: 'R$ ', EUR: '€ ', GBP: '£ ', USD: 'US$ ' };
  R.moeda = function (v, moeda) {
    var casas = Math.abs(v - Math.round(v)) > 0.001 ? 2 : 0;
    return (SIMB[moeda || 'BRL'] || '') + VL.fmt.num(v, casas);
  };

  /* ---------- fatos com selo ---------- */
  R.fato = function (ref) { return VL.data.fontes && VL.data.fontes.fatos && VL.data.fontes.fatos[ref]; };
  /** Link curto "fonte" (com a referência no título) e selo "a confirmar" quando o fato não foi confirmado. */
  R.fonte = function (ref) {
    var f = R.fato(ref);
    if (!f) return document.createTextNode('');
    var wrap = h('span', { class: 'rt-fonte' }, ' ');
    wrap.appendChild(h('a', {
      href: f.url, target: '_blank', rel: 'noopener',
      title: (f.txt || '') + (f.locator ? ' — ' + f.locator : '') + (f.consultado ? ' — consultado em ' + VL.fmt.data(f.consultado + 'T12:00') : ''),
    }, 'fonte'));
    if (f.status && f.status !== 'confirmado') {
      wrap.appendChild(document.createTextNode(' '));
      wrap.appendChild(h('a', { href: VL.link('sobre/fontes?id=' + encodeURIComponent(ref)), class: 'selo-q-link', title: 'Ver a nota do verificador e o trecho da fonte' }, VL.ui.seloQ()));
    }
    return wrap;
  };
  /** Lista de itens {html, ref?, intl?} com fonte. */
  R.lista = function (itens, classe) {
    var ul = h('ul', { class: 'rt-fatos' + (classe ? ' ' + classe : '') });
    (itens || []).forEach(function (it) {
      var li = h('li', { 'data-intl': it.intl ? 'on' : null }, h('span', { html: it.html }));
      if (it.ref) li.appendChild(R.fonte(it.ref));
      ul.appendChild(li);
    });
    return ul;
  };
  /** Callout com fontes opcionais (refs: ['id', ...]). */
  R.aviso = function (a) {
    var c = VL.ui.callout(a.tipo || 'nota', a.titulo, a.html);
    if (a.refs && a.refs.length) {
      var p = h('p', { class: 'small mb-0 mt-0' });
      a.refs.forEach(function (r) { p.appendChild(R.fonte(r)); });
      c.appendChild(p);
    }
    return c;
  };

  /* ---------- locais e preços ---------- */
  R.locais = function () { return (VL.data.locais && VL.data.locais.itens) || []; };
  var cacheLocais = null;
  R.local = function (id) {
    if (!cacheLocais || cacheLocais.n !== R.locais().length) {
      cacheLocais = { n: R.locais().length, map: {} };
      R.locais().forEach(function (l) { cacheLocais.map[l.id] = l; });
    }
    return cacheLocais.map[id] || null;
  };
  /** Calcula a faixa de preços de um grupo {pontos:[{local, valor, moeda?, nota?}]} usando só locais que existem em data/locais.js. */
  R.faixa = function (grupo) {
    var pts = [];
    (grupo.pontos || []).forEach(function (p) {
      var l = R.local(p.local);
      if (!l) return;
      pts.push({ local: l, valor: p.valor, moeda: p.moeda || 'BRL', nota: p.nota || '' });
    });
    if (!pts.length) return null;
    var porMoeda = {};
    pts.forEach(function (p) {
      var m = porMoeda[p.moeda] = porMoeda[p.moeda] || { moeda: p.moeda, min: Infinity, max: -Infinity };
      m.min = Math.min(m.min, p.valor); m.max = Math.max(m.max, p.valor);
    });
    var datas = pts.map(function (p) { return p.local.verificado_em; }).filter(Boolean).sort();
    return { pontos: pts.sort(function (a, b) { return a.valor - b.valor; }), moedas: Object.keys(porMoeda).map(function (k) { return porMoeda[k]; }), de: datas[0], ate: datas[datas.length - 1] };
  };
  R.faixaTxt = function (f) {
    return f.moedas.map(function (m) {
      if (m.min === m.max) return m.min === 0 ? 'gratuito' : R.moeda(m.min, m.moeda);
      return (m.min === 0 ? 'gratuito' : R.moeda(m.min, m.moeda)) + ' a ' + R.moeda(m.max, m.moeda);
    }).join(' · ');
  };

  /* Tipos do banco de locais (data/locais.js) -> ids dos filtros da aba Onde estudar (tabs/locais/dados.js, D.GRUPOS). */
  var TIPO_PARA_FILTRO = {
    'orgao-maritimo': 'capitania', 'preparatorio-cha': 'cha', 'escola-vela': 'escola', 'escola-rya': 'intl', 'escola-asa': 'intl',
    regata: 'regata', 'rally-oceanico': 'rally', 'crew-finder': 'crew', charter: 'charter', delivery: 'charter',
    'clube-nautico': 'clube', 'iate-clube': 'clube', marina: 'marina', 'radio-certificacao': 'radio', 'seguranca-sobrevivencia': 'seguranca',
  };
  /** Query para abrir #/locais já filtrado pelos tipos de uma etapa. Rallies e escolas RYA/ASA ficam fora do Brasil: escopo "todos". */
  R.consultaLocais = function (tipos) {
    var ids = [], fora = false;
    (tipos || []).forEach(function (t) {
      var f = TIPO_PARA_FILTRO[t];
      if (f && ids.indexOf(f) < 0) ids.push(f);
      if (t === 'rally-oceanico' || t === 'escola-rya' || t === 'escola-asa') fora = true;
    });
    return 'tipo=' + ids.join(',') + (fora ? '&escopo=todos' : '');
  };

  /* ---------- distância ---------- */
  /** Ponto de referência do usuário: localização salva, capital da UF, ou null. */
  R.base = function () {
    var s = VL.settings.all();
    if (s.lat != null && s.lon != null) return { lat: s.lat, lon: s.lon, rotulo: s.cidade ? s.cidade + (s.uf ? ', ' + s.uf : '') : (s.uf ? s.uf : 'sua localização'), exata: true };
    if (s.uf) {
      var u = (VL.data.ufs || []).filter(function (x) { return x.uf === s.uf; })[0];
      if (u) return { lat: u.lat, lon: u.lon, rotulo: s.cidade ? s.cidade + ', ' + s.uf : u.nome, exata: false };
    }
    return null;
  };

  /* ---------- rolagem ---------- */
  R.rolarPara = function (el, margem) {
    if (!el) return;
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var y = el.getBoundingClientRect().top + window.pageYOffset - (margem == null ? 72 : margem);
    window.scrollTo({ top: Math.max(0, y), behavior: reduz ? 'auto' : 'smooth' });
  };
})();
