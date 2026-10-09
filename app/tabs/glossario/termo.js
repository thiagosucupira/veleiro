/* Glossário: página de um termo (#/glossario/termo/<id>): definição, figura, fonte, simulador e relacionados. */
(function () {
  'use strict';
  var h = VL.h;
  var G = VL.glossario;

  function chipTermo(t) { return h('a', { class: 'chip gl-rel-chip', href: VL.link('glossario/termo/' + t.id) }, t.termo); }

  /** Figura com largura mínima legível; no celular, rola de lado dentro da moldura. */
  function figura(t) {
    var svg;
    try { svg = t.figura.svg; } catch (e) { console.error(e); return null; }
    if (!svg) return null;
    var vb = /viewBox="([\d.\-]+) ([\d.\-]+) ([\d.]+) ([\d.]+)"/.exec(svg);
    var largura = vb ? Number(vb[3]) : 480;
    var tela = h('div', { class: 'gl-fig-tela', html: svg });
    var s = VL.$('svg', tela);
    if (s) { s.style.minWidth = Math.round(largura * 0.8) + 'px'; s.setAttribute('focusable', 'false'); }
    var rol = h('div', { class: 'gl-fig-rolagem', tabindex: '0', role: 'group', 'aria-label': 'Figura: ' + (s ? s.getAttribute('aria-label') : t.termo) }, tela);
    var dica = h('p', { class: 'gl-fig-dica', hidden: true }, 'Arraste para o lado para ver a figura inteira.');
    /* legenda: a do dado; senão, o rótulo da figura, se não repetir a definição */
    var rotulo = s ? s.getAttribute('aria-label') || '' : '';
    var leg = t.figura.legenda || (rotulo && G.norm(rotulo).indexOf(G.norm(t.termo)) !== 0 ? rotulo + '.' : '');
    var nota = t.figura.destaque === false ? null : h('span', { class: 'gl-fig-nota' }, (leg ? ' ' : '') + 'Em magenta, o que este termo nomeia.');
    var fig = h('figure', { class: 'gl-figura' }, rol, dica, leg || nota ? h('figcaption', null, leg, nota) : null);
    function medir() { dica.hidden = !(rol.scrollWidth > rol.clientWidth + 4); }
    requestAnimationFrame(medir);
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(medir); ro.observe(rol); VL.aoSair(function () { ro.disconnect(); }); }
    return fig;
  }

  /** Botão que monta o simulador relacionado na própria página. */
  function simulador(t) {
    var w = t.widget;
    var caixa = h('div', { class: 'gl-sim' });
    var msg = h('p', { class: 'gl-sim-msg', role: 'status' });
    var btn = h('button', { type: 'button', class: 'btn btn-primary', 'aria-expanded': 'false', 'aria-controls': 'gl-sim-alvo',
      onclick: function () {
        btn.disabled = true;
        msg.textContent = 'Abrindo o simulador…';
        var src = 'widgets/' + w.w + '.js';
        (VL.widgets.existe(w.w) ? Promise.resolve() : VL.load(src)).then(function () {
          if (!VL.widgets.existe(w.w)) throw new Error('não registrado');
          var alvo = h('div', { id: 'gl-sim-alvo', class: 'bloco-widget gl-sim-alvo' });
          caixa.replaceChild(alvo, btn);
          msg.textContent = '';
          btn.setAttribute('aria-expanded', 'true');
          return VL.widgets.mount(w.w, alvo, w.opts || {}).then(function () { G.rolarAte(alvo); });
        }).catch(function () {
          btn.disabled = false;
          btn.hidden = true;
          msg.textContent = 'Este simulador ainda está sendo construído e chega numa próxima versão do app.';
        });
      } }, VL.icon('play', 16), w.rotulo || 'Abrir o simulador');
    caixa.appendChild(btn);
    caixa.appendChild(msg);
    return h('section', { class: 'gl-bloco', 'aria-label': 'Simulador relacionado' }, caixa);
  }

  G.paginaTermo = function (raiz, id) {
    var p = G.preparar();
    var t = G.achar(id);
    var intl = !!VL.settings.get('intl');
    if (t && t.intl && !intl) return soIntl(raiz, t);
    if (!t) return naoAchado(raiz, id, p);
    if (t.id !== id) { try { history.replaceState(null, '', '#/glossario/termo/' + t.id); } catch (e) { /* ignora */ } }
    var cat = p.cat[t.categoria];
    document.title = t.termo + ' — Glossário — Veleiro';

    raiz.appendChild(h('nav', { class: 'gl-trilha', 'aria-label': 'Você está em' },
      h('a', { href: VL.link('glossario') }, 'Glossário'), h('span', { 'aria-hidden': 'true' }, '/'),
      h('a', { href: VL.link('glossario?cat=' + t.categoria) }, cat.nome)));

    var art = h('article', { class: 'gl-termo', 'aria-labelledby': 'gl-termo-t' });
    var meta = h('div', { class: 'gl-termo-meta' });
    if (intl && t.en) meta.appendChild(h('p', null, h('span', { class: 'gl-meta-r' }, 'Em inglês'), h('span', { lang: 'en' }, t.en)));
    if (t.sin && t.sin.length) meta.appendChild(h('p', null, h('span', { class: 'gl-meta-r' }, 'Também se diz'), t.sin.join(', ')));
    art.appendChild(h('header', { class: 'gl-termo-cab' }, h('h1', { id: 'gl-termo-t' }, t.termo), meta.childNodes.length ? meta : null));

    var texto = h('div', { class: 'gl-termo-texto' }, h('p', { class: 'gl-def', html: t.def }));
    if (t.aconfirmar) texto.appendChild(h('p', { class: 'gl-aconfirmar' }, VL.ui.seloQ(), ' ', t.aconfirmar));
    var fontes = G.fontes(t, p.g.consultado);
    if (fontes) texto.appendChild(fontes);
    else texto.appendChild(VL.h('p', { class: 'fonte-ref' }, 'Termo de uso corrente entre velejadores; não encontramos uma fonte reconhecida que o defina. Conhece uma? ', VL.h('a', { href: VL.link('sobre?secao=contribuir') }, 'Contribua')));
    if (t.link) texto.appendChild(h('p', { class: 'gl-link-oficial' }, h('a', { href: t.link.url, target: '_blank', rel: 'noopener' }, t.link.txt, VL.icon('externo', 14))));
    art.appendChild(texto);

    if (t.figura) { var f = figura(t); if (f) art.appendChild(f); }
    if (t.widget) art.appendChild(simulador(t));

    var rel = (t.ver || []).map(function (v) { return p.porId[v]; }).filter(function (x) { return x && (intl || !x.intl); });
    if (rel.length) art.appendChild(h('section', { class: 'gl-bloco', 'aria-labelledby': 'gl-rel-t' },
      h('h2', { id: 'gl-rel-t', class: 'gl-bloco-t' }, 'Termos relacionados'), h('div', { class: 'chip-list' }, rel.map(chipTermo))));
    var ja = {};
    (t.ver || []).forEach(function (v) { ja[v] = 1; });
    var citado = (p.citadoEm[t.id] || []).filter(function (c) { return !ja[c]; }).map(function (c) { return p.porId[c]; }).filter(function (x) { return x && (intl || !x.intl); });
    if (citado.length) art.appendChild(h('section', { class: 'gl-bloco', 'aria-labelledby': 'gl-cit-t' },
      h('h2', { id: 'gl-cit-t', class: 'gl-bloco-t' }, 'Aparece também em'), h('div', { class: 'chip-list' }, citado.map(chipTermo))));

    /* vizinhos em ordem alfabética */
    var lista = p.termos.filter(function (x) { return intl || !x.intl; });
    var i = lista.indexOf(t), ant = lista[i - 1], prox = lista[i + 1];
    art.appendChild(h('nav', { class: 'gl-vizinhos', 'aria-label': 'Outros termos em ordem alfabética' },
      ant ? h('a', { class: 'gl-viz gl-viz-ant', href: VL.link('glossario/termo/' + ant.id), rel: 'prev' }, h('span', { class: 'gl-viz-r' }, 'Anterior'), h('span', null, ant.termo)) : h('span'),
      prox ? h('a', { class: 'gl-viz gl-viz-prox', href: VL.link('glossario/termo/' + prox.id), rel: 'next' }, h('span', { class: 'gl-viz-r' }, 'Próximo'), h('span', null, prox.termo)) : h('span')));
    raiz.appendChild(art);
    raiz.appendChild(VL.ui.avisoLegal());
  };

  /** Termo da trilha internacional com a trilha desligada nas configurações. */
  function soIntl(raiz, t) {
    raiz.appendChild(VL.ui.cabecalho(t.termo, 'Este termo faz parte da trilha internacional (RYA, ICC e regatas oceânicas), que está desligada nas suas configurações.'));
    raiz.appendChild(h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { VL.settings.set('intl', true); VL.render(); } }, 'Ligar a trilha internacional'),
      h('a', { class: 'btn btn-ghost', href: VL.link('glossario') }, 'Ver todos os termos')));
  }

  function naoAchado(raiz, id, p) {
    var q = String(id || '').replace(/-/g, ' ');
    var sug = G.buscar(q, '').slice(0, 6).map(function (r) { return r.t; });
    raiz.appendChild(VL.ui.cabecalho('Termo não encontrado', 'Não achamos “' + VL.esc(q) + '” no glossário. O endereço pode estar errado ou o termo ainda não foi escrito.'));
    raiz.appendChild(h('div', { class: 'btn-row' },
      h('a', { class: 'btn btn-primary', href: VL.link('glossario?q=' + encodeURIComponent(q)) }, 'Buscar no glossário'),
      h('a', { class: 'btn btn-ghost', href: VL.link('glossario') }, 'Ver todos os termos')));
    if (sug.length) raiz.appendChild(h('section', { class: 'gl-bloco' }, h('h2', { class: 'gl-bloco-t' }, 'Talvez você procure'), h('div', { class: 'chip-list' }, sug.map(chipTermo))));
  }
})();
