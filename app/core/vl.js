/* Núcleo do app "Veleiro": namespace global VL, utilidades de DOM, armazenamento seguro,
   configurações, barramento de eventos, carregador sob demanda, registro de abas/widgets/dados
   e roteador por hash. Sem módulos ES: tudo funciona abrindo index.html via file://. */
(function () {
  'use strict';
  var VL = window.VL = window.VL || {};
  VL.versao = '1.0.0';
  /* Endereço do repositório público (preencha ao publicar; a aba Sobre mostra os links de relato se houver). */
  VL.projeto = VL.projeto || { repo: 'https://github.com/thiagosucupira/veleiro' };
  VL.data = VL.data || {};

  /* ---------- DOM ---------- */
  function appendKids(el, kids) {
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k == null || k === false) continue;
      if (Array.isArray(k)) { appendKids(el, k); continue; }
      el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
    }
  }
  /** h('div', {class:'x', onclick: fn, html:'<b>..</b>'}, filhos...) */
  VL.h = function (tag, attrs) {
    var svgTags = /^(svg|g|path|circle|line|rect|polygon|polyline|text|tspan|defs|marker|ellipse|use|clipPath|linearGradient|radialGradient|stop|pattern|title|foreignObject)$/;
    var el = svgTags.test(tag) ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
    if (attrs) {
      for (var a in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, a)) continue;
        var v = attrs[a];
        if (v == null || v === false) continue;
        if (a === 'html') el.innerHTML = v;
        else if (a === 'text') el.textContent = v;
        else if (a === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (a.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(a.slice(2), v);
        else if (a === 'class' && el instanceof SVGElement) el.setAttribute('class', v);
        else if (a === 'class') el.className = v;
        else if (v === true) el.setAttribute(a, '');
        else el.setAttribute(a, v);
      }
    }
    appendKids(el, Array.prototype.slice.call(arguments, 2));
    return el;
  };
  VL.$ = function (sel, root) { return (root || document).querySelector(sel); };
  VL.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  VL.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  VL.slug = function (s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  VL.semAcento = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  VL.embaralhar = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  VL.cssVar = function (nome) { return getComputedStyle(document.documentElement).getPropertyValue(nome).trim(); };

  /* ---------- Formatação PT-BR ---------- */
  VL.fmt = {
    num: function (n, casas) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas == null ? 2 : casas }); },
    pct: function (x) { return Math.round(x * 100) + '%'; },
    data: function (d) { var dt = d instanceof Date ? d : new Date(d); return dt.toLocaleDateString('pt-BR'); },
    min: function (seg) { var hh = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = Math.floor(seg % 60); var mm = (hh && m < 10 ? '0' : '') + m; return (hh ? hh + ':' : '') + mm + ':' + (s < 10 ? '0' : '') + s; },
    semanas: function (s) { if (s < 1) return 'menos de 1 semana'; if (s < 8) return Math.round(s) + (Math.round(s) === 1 ? ' semana' : ' semanas'); var m = s / 4.345; if (m < 24) return Math.round(m) + ' meses'; return VL.fmt.num(m / 12, 1) + ' anos'; },
    distKm: function (km) { return km < 10 ? VL.fmt.num(km, 1) + ' km' : VL.fmt.num(Math.round(km), 0) + ' km'; },
  };
  VL.hoje = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

  /* ---------- Armazenamento (localStorage com try/catch e fallback em memória) ---------- */
  var PREFIXO = 'veleiro.v1.';
  var memoria = {};
  VL.store = {
    get: function (k, padrao) {
      var raw;
      try { raw = window.localStorage.getItem(PREFIXO + k); } catch (e) { raw = memoria[k]; }
      if (raw == null) raw = memoria[k];
      if (raw == null) return padrao;
      try { return JSON.parse(raw); } catch (e) { return padrao; }
    },
    set: function (k, v) {
      var raw = JSON.stringify(v);
      memoria[k] = raw;
      try { window.localStorage.setItem(PREFIXO + k, raw); return true; } catch (e) { return false; }
    },
    remove: function (k) {
      delete memoria[k];
      try { window.localStorage.removeItem(PREFIXO + k); } catch (e) { /* sem armazenamento */ }
    },
    exportar: function () {
      var out = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf(PREFIXO) === 0) out[key.slice(PREFIXO.length)] = JSON.parse(localStorage.getItem(key));
        }
      } catch (e) {
        Object.keys(memoria).forEach(function (k) { try { out[k] = JSON.parse(memoria[k]); } catch (e2) { /* ignora */ } });
      }
      return out;
    },
    importar: function (obj) { Object.keys(obj || {}).forEach(function (k) { VL.store.set(k, obj[k]); }); },
    limparTudo: function () {
      memoria = {};
      try {
        var ks = [];
        for (var i = 0; i < localStorage.length; i++) { var key = localStorage.key(i); if (key && key.indexOf(PREFIXO) === 0) ks.push(key); }
        ks.forEach(function (key) { localStorage.removeItem(key); });
      } catch (e) { /* sem armazenamento */ }
    },
  };

  /* ---------- Barramento de eventos ---------- */
  var bus = document.createElement('span');
  VL.on = function (ev, fn) { var w = function (e) { fn(e.detail); }; bus.addEventListener(ev, w); return function () { bus.removeEventListener(ev, w); }; };
  VL.emit = function (ev, detail) { bus.dispatchEvent(new CustomEvent(ev, { detail: detail })); };

  /* ---------- Configurações do usuário ---------- */
  var PADRAO = {
    tema: 'auto',          // auto | claro | escuro
    intl: true,            // trilha internacional RYA/ICC/ASA ligada por padrão
    uf: '',                // região de base (opcional)
    cidade: '',
    lat: null, lon: null,  // coordenadas da base (opcional; via geolocalização ou capital da UF)
    ritmoHoras: 6,         // horas de estudo/prática por semana (opcional)
    novosPorDia: 20,       // flashcards novos por dia
    onboarded: false,
  };
  VL.settings = {
    all: function () { return Object.assign({}, PADRAO, VL.store.get('settings', {})); },
    get: function (k) { return VL.settings.all()[k]; },
    set: function (k, v) {
      var antes = VL.settings.get('tema');
      var s = VL.store.get('settings', {});
      if (typeof k === 'object') Object.assign(s, k); else s[k] = v;
      VL.store.set('settings', s);
      VL.settings.aplicar();
      VL.emit('settings', VL.settings.all());
      if (VL.settings.get('tema') !== antes) VL.emit('tema', { escuro: VL.settings.temaEscuro() });
    },
    aplicar: function () {
      var s = VL.settings.all(), html = document.documentElement;
      if (s.tema === 'claro') html.setAttribute('data-theme', 'light');
      else if (s.tema === 'escuro') html.setAttribute('data-theme', 'dark');
      else html.removeAttribute('data-theme');
      html.setAttribute('data-intl', s.intl ? 'on' : 'off');
      VL.settings._corBarra(s.tema);
    },
    /* Cor da barra do navegador (theme-color): acompanha o tema escolhido no app, não só o do sistema. */
    _corBarra: function (tema) {
      VL.$$('meta[name="theme-color"]').forEach(function (m) {
        if (!m.hasAttribute('data-orig')) m.setAttribute('data-orig', m.getAttribute('content'));
        if (tema === 'claro') m.setAttribute('content', '#f6f9fa');
        else if (tema === 'escuro') m.setAttribute('content', '#081521');
        else m.setAttribute('content', m.getAttribute('data-orig'));
      });
    },
    temaEscuro: function () {
      var t = document.documentElement.getAttribute('data-theme');
      if (t) return t === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
  };
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var avisaTema = function () { VL.emit('tema', { escuro: VL.settings.temaEscuro() }); };
    if (mq.addEventListener) mq.addEventListener('change', avisaTema); else if (mq.addListener) mq.addListener(avisaTema);
  }

  /* ---------- Carregador sob demanda (scripts clássicos e CSS) ---------- */
  var carregados = {};
  VL.load = function (srcs) {
    var lista = Array.isArray(srcs) ? srcs : [srcs];
    return lista.reduce(function (p, src) {
      return p.then(function () {
        if (carregados[src]) return carregados[src];
        carregados[src] = new Promise(function (ok, falha) {
          var s = document.createElement('script');
          s.src = src; s.async = false;
          s.onload = function () { ok(); };
          s.onerror = function () { delete carregados[src]; falha(new Error('Não foi possível carregar ' + src)); };
          document.head.appendChild(s);
        });
        return carregados[src];
      });
    }, Promise.resolve());
  };
  VL.loadCSS = function (href) {
    if (carregados[href]) return carregados[href];
    carregados[href] = new Promise(function (ok) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = href;
      l.onload = function () { ok(); }; l.onerror = function () { ok(); };
      document.head.appendChild(l);
    });
    return carregados[href];
  };
  VL.libs = {
    three: function () { return VL.load('assets/vendor/three.bundle.min.js').then(function () { return window.THREE; }); },
    leaflet: function () { return Promise.all([VL.loadCSS('assets/vendor/leaflet/leaflet.css'), VL.load('assets/vendor/leaflet/leaflet.js')]).then(function () { return window.L; }); },
    chart: function () { return VL.load('assets/vendor/chart.umd.min.js').then(function () { return window.Chart; }); },
    d3: function () { return VL.load('assets/vendor/d3.min.js').then(function () { return window.d3; }); },
  };

  /* ---------- Dados: cada arquivo data/<nome>.js chama VL.dado('<nome>', valor) ---------- */
  VL.dado = function (nome, valor) { VL.data[nome] = valor; VL.emit('dado', { nome: nome }); return valor; };
  /** Manifesto gerado por tools/build_manifesto.py: VL.data.manifesto = {dados:[...], widgets:[...]}.
      É só uma consulta (para a aba decidir se vale a pena pedir um arquivo opcional); carregarDado não depende dele. */
  VL.dadoExiste = function (nome) {
    var m = VL.data.manifesto;
    return !m || !m.dados || m.dados.indexOf(nome) >= 0;
  };
  VL.carregarDado = function (nome) {
    if (VL.data[nome] !== undefined) return Promise.resolve(VL.data[nome]);
    return VL.load('data/' + nome + '.js').then(function () {
      if (VL.data[nome] === undefined) throw new Error('Arquivo data/' + nome + '.js não registrou VL.dado("' + nome + '", …)');
      return VL.data[nome];
    });
  };

  /* ---------- Widgets: widgets/<nome>.js chama VL.widgets.define('<nome>', {mount}) ---------- */
  var widgetDefs = {};
  VL.widgets = {
    define: function (nome, def) { widgetDefs[nome] = def; },
    existe: function (nome) { return !!widgetDefs[nome]; },
    /** true se o arquivo widgets/<nome>.js existe (pelo manifesto) ou se o manifesto não está disponível */
    disponivel: function (nome) { var m = VL.data.manifesto; return !!widgetDefs[nome] || !m || !m.widgets || m.widgets.indexOf(nome) >= 0; },
    /** Monta um widget num elemento. Retorna Promise da função de limpeza (opcional). */
    mount: function (nome, el, opts) {
      if (!VL.widgets.disponivel(nome) && !/^#\/lab\//.test(location.hash)) {
        el.appendChild(VL.h('p', { class: 'vazio' }, 'Este simulador ainda está em construção.'));
        return Promise.resolve(null);
      }
      var p = widgetDefs[nome] ? Promise.resolve() : VL.load('widgets/' + nome + '.js');
      el.classList.add('widget', 'widget-' + nome);
      return p.then(function () {
        var def = widgetDefs[nome];
        if (!def) throw new Error('Widget "' + nome + '" não registrado');
        var pre = (def.css || []).map(VL.loadCSS);
        return Promise.all(pre).then(function () { return def.scripts ? VL.load(def.scripts) : null; });
      }).then(function () {
        var limpar = widgetDefs[nome].mount(el, opts || {});
        return Promise.resolve(limpar).then(function (fn) { if (typeof fn === 'function') VL.aoSair(fn); return fn; });
      }).catch(function (e) {
        console.error(e);
        el.appendChild(VL.h('p', { class: 'erro-carga' }, 'Não foi possível abrir este recurso interativo (' + nome + '). Recarregue a página.'));
      });
    },
  };

  /* ---------- Limpeza ao trocar de página (para cenas 3D, timers etc.) ---------- */
  var limpezas = [];
  VL.aoSair = function (fn) { limpezas.push(fn); };
  function limpar() {
    var l = limpezas; limpezas = [];
    l.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  /* ---------- Abas ---------- */
  var abas = [];
  VL.tabs = {
    /** VL.tabs.register({id, titulo, curto, grupo, icone, ordem, render(el, rota)}) */
    register: function (def) { abas = abas.filter(function (a) { return a.id !== def.id; }); abas.push(def); abas.sort(function (a, b) { return (a.ordem || 99) - (b.ordem || 99); }); VL.emit('abas', abas); },
    all: function () { return abas.slice(); },
    get: function (id) { for (var i = 0; i < abas.length; i++) if (abas[i].id === id) return abas[i]; return null; },
  };

  /* ---------- Roteador por hash: #/aba/param1/param2?chave=valor ---------- */
  VL.rota = function () {
    var raw = (location.hash || '').replace(/^#\/?/, '');
    var q = {}, partes = raw.split('?');
    if (partes[1]) partes[1].split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    var segs = partes[0].split('/').filter(Boolean).map(decodeURIComponent);
    return { aba: segs[0] || 'roteiro', params: segs.slice(1), query: q, hash: raw };
  };
  VL.go = function (caminho) { location.hash = '#/' + caminho.replace(/^#?\/?/, ''); };
  VL.link = function (caminho) { return '#/' + caminho.replace(/^#?\/?/, ''); };

  /* Proteção de saída: VL.protegerSaida(fn) — fn() devolve uma mensagem (pede confirmação) ou null.
     Limpa-se sozinha ao sair da página. Usado pela prova cronometrada. */
  var guarda = null, hashAtual = null, ignorar = false;
  VL.protegerSaida = function (fn) { guarda = fn; VL.aoSair(function () { if (guarda === fn) guarda = null; }); };
  VL.podeSair = function () {
    if (ignorar) { ignorar = false; return false; }
    if (!guarda || hashAtual === null || location.hash === hashAtual) return true;
    var msg = guarda();
    if (!msg || window.confirm(msg)) { guarda = null; return true; }
    ignorar = true; location.hash = hashAtual; return false;
  };
  var renderId = 0;
  VL.render = function () {
    var rota = VL.rota();
    hashAtual = location.hash;
    var aba = VL.tabs.get(rota.aba) || VL.tabs.get('roteiro');
    var view = document.getElementById('view');
    if (!aba || !view) return;
    limpar();
    var meu = ++renderId;
    view.innerHTML = '';
    view.setAttribute('aria-busy', 'true');
    VL.emit('rota', { aba: aba.id, rota: rota });
    document.title = (aba.tituloPagina || aba.titulo) + ' — Veleiro';
    var pronto = function () { if (meu === renderId) view.removeAttribute('aria-busy'); };
    try {
      Promise.resolve(aba.render(view, rota)).then(pronto, function (e) {
        console.error(e);
        if (meu !== renderId) return;
        view.innerHTML = '';
        var carga = e && /Não foi possível carregar/.test(e.message || '');
        var dica = !carga ? null : (location.protocol === 'file:'
          ? 'Confira se a pasta app/ está completa (o arquivo pode ter sido movido ou apagado).'
          : 'O servidor que entrega o app parou de responder ou você está sem internet. Se você abriu pelo ./run.sh, confira se ele continua rodando no terminal; depois tente de novo.');
        view.appendChild(VL.h('div', { class: 'vazio', role: 'alert' },
          VL.h('p', null, 'Esta página não abriu: ' + (e && e.message ? e.message : 'erro desconhecido') + '.'),
          dica ? VL.h('p', { class: 'small' }, dica) : null,
          VL.h('div', { class: 'btn-row', style: { justifyContent: 'center' } },
            VL.h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { location.reload(); } }, 'Tentar de novo'),
            VL.h('a', { class: 'btn btn-ghost', href: VL.link('roteiro') }, 'Voltar ao roteiro'))));
        pronto();
      });
    } catch (e) { console.error(e); pronto(); }
    var mudouAba = VL._ultimaAba !== aba.id;
    VL._ultimaAba = aba.id;
    if (mudouAba || !rota.query.manter) window.scrollTo(0, 0);
  };
  VL.estaAtual = function (id) { return renderId === id; };
})();
