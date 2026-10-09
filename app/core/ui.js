/* Componentes de interface compartilhados: toast, diálogo, selos, callouts, fontes, subnavegação. */
(function () {
  'use strict';
  var h = VL.h;
  VL.ui = {};

  VL.ui.toast = function (msg, ms) {
    var zona = VL.$('.toast-zona');
    if (!zona) { zona = h('div', { class: 'toast-zona', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(zona); }
    var t = h('div', { class: 'toast' }, msg);
    zona.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 3200);
  };

  /** Diálogo modal nativo. opts: {titulo, corpo (Node|string), acoes:[{rotulo, tipo, acao(dlg)->bool fecha?}], aoFechar} */
  VL.ui.dialogo = function (opts) {
    var dlg = h('dialog', { class: 'dlg', 'aria-labelledby': 'dlg-t' });
    var corpo = h('div', { class: 'dlg-corpo' },
      opts.titulo ? h('h2', { id: 'dlg-t' }, opts.titulo) : null,
      typeof opts.corpo === 'string' ? h('div', { html: opts.corpo }) : opts.corpo);
    var rodape = h('div', { class: 'dlg-rodape' });
    (opts.acoes || [{ rotulo: 'Fechar', tipo: 'primary' }]).forEach(function (a) {
      rodape.appendChild(h('button', {
        class: 'btn ' + (a.tipo ? 'btn-' + a.tipo : ''), type: 'button',
        onclick: function () { var r = a.acao ? a.acao(dlg) : true; if (r !== false) fechar(); },
      }, a.rotulo));
    });
    dlg.appendChild(corpo); dlg.appendChild(rodape);
    document.body.appendChild(dlg);
    function fechar() { try { dlg.close(); } catch (e) { /* já fechado */ } dlg.remove(); if (opts.aoFechar) opts.aoFechar(); }
    dlg.addEventListener('cancel', function (e) { if (opts.semEsc) e.preventDefault(); else { e.preventDefault(); fechar(); } });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.fechar = fechar;
    return dlg;
  };

  /** Selo "a confirmar" (bandeira Q). */
  VL.ui.seloQ = function (texto, titulo) {
    return h('span', { class: 'selo-q', title: titulo || 'Informação divergente entre fontes ou sem fonte oficial: confirme na Capitania/órgão emissor.' }, texto || 'a confirmar');
  };

  /** Callout: tipo = nota | seguranca | dica | aconfirmar | intl */
  VL.ui.callout = function (tipo, titulo, conteudo) {
    var icones = { seguranca: 'alerta', dica: 'check', nota: 'info', aconfirmar: 'alerta', intl: 'globo' };
    var c = h('aside', { class: 'callout callout-' + tipo, role: tipo === 'seguranca' ? 'note' : null },
      titulo ? h('div', { class: 'callout-title' }, VL.icon(icones[tipo] || 'info', 18), titulo) : null,
      typeof conteudo === 'string' ? h('div', { html: conteudo }) : conteudo);
    if (tipo === 'intl') c.setAttribute('data-intl', 'on');
    return c;
  };

  /**
   * Referência a um fato verificado do arquivo data/fontes.js (gerado de research/claims).
   * VL.ui.fonte('normas-03') → link "fonte" + selo "a confirmar" se o fato não foi confirmado por 2 verificadores.
   * Também aceita objeto {txt, url, status}.
   */
  VL.ui.fonte = function (ref) {
    var f = typeof ref === 'string' ? (VL.data.fontes && VL.data.fontes.fatos && VL.data.fontes.fatos[ref]) : ref;
    if (!f) return h('span', { class: 'fonte-ref' }, '');
    var wrap = h('span', { class: 'fonte-ref' }, ' ');
    wrap.appendChild(h('a', { href: f.url, target: '_blank', rel: 'noopener', title: (f.locator || '') + (f.consultado ? ' — consultado em ' + VL.fmt.data(f.consultado + 'T12:00') : '') }, f.txt || 'fonte'));
    if (f.status && f.status !== 'confirmado') {
      wrap.appendChild(document.createTextNode(' '));
      var selo = VL.ui.seloQ();
      if (typeof ref === 'string') { selo = VL.h('a', { href: VL.link('sobre/fontes?id=' + encodeURIComponent(ref)), class: 'selo-q-link', title: 'Ver a nota do verificador e o trecho da fonte' }, selo); }
      wrap.appendChild(selo);
    }
    return wrap;
  };

  /** Aviso legal/segurança padrão. */
  VL.ui.avisoLegal = function () {
    return h('p', { class: 'aviso-legal' },
      'Material educativo e comunitário. Não substitui instrução prática com instrutor habilitado nem a habilitação oficial emitida pela Marinha do Brasil. ',
      'Regras, taxas e procedimentos mudam: confirme na Capitania, Delegacia ou Agência antes da prova.');
  };

  /** Cabeçalho de página. */
  VL.ui.cabecalho = function (titulo, lead, extra) {
    return h('header', { class: 'page-head' }, h('h1', null, titulo), lead ? h('p', { class: 'lead', html: lead }) : null, extra || null);
  };

  /** Subnavegação em botões segmentados que alteram a rota. itens: [{id, rotulo, intl?}] */
  VL.ui.subnav = function (itens, atual, baseRota) {
    var nav = h('div', { class: 'segmented', role: 'tablist' });
    itens.forEach(function (it) {
      var b = h('button', { type: 'button', role: 'tab', 'aria-pressed': String(it.id === atual), 'aria-selected': String(it.id === atual), 'data-intl': it.intl ? 'on' : null, onclick: function () { VL.go(baseRota + '/' + it.id); } }, it.rotulo);
      nav.appendChild(b);
    });
    return nav;
  };

  /** Barra de progresso. */
  VL.ui.medidor = function (frac, ok, rotulo) {
    return h('div', { class: 'meter' + (ok ? ' meter-ok' : ''), role: 'progressbar', 'aria-label': rotulo || 'Progresso', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(frac * 100)) },
      h('span', { style: { width: Math.max(0, Math.min(100, frac * 100)) + '%' } }));
  };

  /** Carregando… */
  VL.ui.carregando = function (txt) { return h('p', { class: 'carregando', role: 'status' }, txt || 'Carregando…'); };

  /** Moldura de instrumento para simuladores/cenas. Retorna {raiz, corpo, legenda, controles}. */
  VL.ui.instrumento = function (opts) {
    opts = opts || {};
    var corpo = h('div', { class: 'instrumento-corpo' });
    var legenda = h('div', { class: 'instrumento-legenda' });
    var controles = h('div', { class: 'instrumento-controles' });
    var raiz = h('figure', { class: 'instrumento', style: { margin: 0 } }, corpo);
    if (opts.controlesAntes) raiz.insertBefore(controles, corpo); else raiz.appendChild(controles);
    raiz.appendChild(legenda);
    if (opts.titulo) legenda.appendChild(h('figcaption', null, opts.titulo));
    return { raiz: raiz, corpo: corpo, legenda: legenda, controles: controles };
  };

  /** Perda do contexto WebGL (celular com a aba em segundo plano, falta de memória de vídeo, GPU reiniciada).
   *  Os widgets 3D chamam VL.gl3d.vigiar(canvas, host, {restaurou, recriar, falhou}) logo depois de criar o renderer.
   *  - Ao perder: cancela o evento (sem isso o navegador não restaura), mostra um aviso sobre a cena e espera.
   *  - Se o navegador devolver o contexto: tira o aviso e chama restaurou() (o Three.js já recriou programas, texturas
   *    e buffers; o widget só precisa redimensionar e redesenhar).
   *  - Se não devolver em 3 s com a aba visível: chama recriar(), que deve montar a cena de novo (novo renderer) e
   *    devolver true; se devolver false (ou não existir), chama falhou(), que mostra a alternativa em 2D.
   *  Devolve {parar()}, que o widget chama ao destruir a cena. */
  VL.gl3d = {
    ESPERA_MS: 3000,
    TEXTO: 'A cena 3D foi interrompida pelo navegador (acontece quando a aba fica em segundo plano ou falta memória de vídeo). Recuperando…',
    /** Libera a GPU de um renderer descartado. Se o contexto já foi perdido não há o que forçar (e o Three.js avisaria no console). */
    soltar: function (renderer) {
      try {
        var gl = renderer.getContext();
        if (renderer.forceContextLoss && gl && !gl.isContextLost()) renderer.forceContextLoss();
      } catch (e) { /* ok */ }
    },
    vigiar: function (canvas, host, o) {
      o = o || {};
      var aviso = null, timer = 0, perdido = false, parado = false;
      function mostrar() {
        if (!host) return;
        try { if (window.getComputedStyle(host).position === 'static') host.style.position = 'relative'; } catch (e) { /* sem estilo */ }
        if (!aviso) { aviso = h('div', { class: 'gl-aviso', role: 'status' }); host.appendChild(aviso); }
        aviso.textContent = VL.gl3d.TEXTO;
      }
      function ocultar() { if (aviso && aviso.parentNode) aviso.parentNode.removeChild(aviso); aviso = null; }
      function armar() {
        clearTimeout(timer);
        if (!perdido || parado || document.hidden) return;   /* aba escondida: o navegador só devolve ao voltar */
        timer = setTimeout(desistir, VL.gl3d.ESPERA_MS);
      }
      function desistir() {
        if (!perdido || parado) return;
        parar();
        var ok = false;
        try { ok = o.recriar ? o.recriar() !== false : false; } catch (e) { ok = false; }
        if (!ok && o.falhou) o.falhou();
      }
      function perdeu(ev) {
        if (ev && ev.preventDefault) ev.preventDefault();
        perdido = true;
        mostrar();
        if (o.perdeu) o.perdeu();
        armar();
      }
      function voltou() {
        perdido = false; clearTimeout(timer); ocultar();
        if (o.restaurou) { try { o.restaurou(); } catch (e) { /* o widget pode já ter saído */ } }
      }
      function visivel() { if (perdido) armar(); }
      function parar() {
        parado = true; clearTimeout(timer); ocultar();
        canvas.removeEventListener('webglcontextlost', perdeu);
        canvas.removeEventListener('webglcontextrestored', voltou);
        document.removeEventListener('visibilitychange', visivel);
      }
      canvas.addEventListener('webglcontextlost', perdeu);
      canvas.addEventListener('webglcontextrestored', voltou);
      document.addEventListener('visibilitychange', visivel);
      return { parar: parar };
    },
  };

  /** Distância em km entre dois pontos (haversine). */
  VL.distKm = function (lat1, lon1, lat2, lon2) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (lat2 - lat1) * toR, dLon = (lon2 - lon1) * toR;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  };
})();
