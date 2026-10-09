/* Glossário: referências oficiais e de estudo (#/glossario/referencias), com a bibliografia das provas. */
(function () {
  'use strict';
  var h = VL.h;
  var G = VL.glossario;
  var TIPO = { pdf: 'PDF', zip: 'arquivo ZIP', pagina: 'página', app: 'aplicativo' };

  function dominio(url) { var m = /^https?:\/\/(?:www\.)?([^/]+)/.exec(url || ''); return m ? m[1] : ''; }

  function item(it, consultado) {
    var titulo = it.url
      ? h('a', { class: 'gl-ref-t', href: it.url, target: '_blank', rel: 'noopener' }, h('span', null, it.t), VL.icon('externo', 15))
      : h('span', { class: 'gl-ref-t gl-ref-t-sem' }, it.t);
    var meta = [it.org, TIPO[it.tipo] || null, it.url ? dominio(it.url) : 'sem link direto'].filter(Boolean);
    return h('li', { class: 'gl-ref' }, titulo, it.desc ? h('p', { class: 'gl-ref-desc' }, it.desc) : null,
      h('p', { class: 'gl-ref-meta', title: it.url ? 'Endereço conferido em ' + G.data(consultado) : null }, meta.join(' · ')));
  }

  function bibliografia(b, consultado) {
    var sec = h('section', { class: 'gl-ref-grupo', id: 'gl-ref-bib', 'aria-labelledby': 'gl-ref-bib-t' });
    sec.appendChild(h('h2', { id: 'gl-ref-bib-t' }, 'Bibliografia recomendada nas provas'));
    sec.appendChild(h('p', { class: 'gl-ref-intro' }, 'Livros e publicações que a NORMAM-211 recomenda para cada habilitação. Para efeito de prova, quando houver conflito com outras fontes, valem os da lista.'));
    sec.appendChild(h('blockquote', { class: 'gl-ref-cit' }, h('p', null, b.nota),
      h('footer', null, h('a', { href: b.fonte.url, target: '_blank', rel: 'noopener' }, b.fonte.txt, VL.icon('externo', 14)), '. Consultado em ' + G.data(consultado) + '.')));
    var painel = h('div', { class: 'gl-bib-painel', id: 'gl-bib-painel', role: 'region', 'aria-live': 'polite' });
    var seg = h('div', { class: 'segmented gl-bib-seg', role: 'group', 'aria-label': 'Escolha a habilitação' });
    function mostrar(lista) {
      VL.$$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-id') === lista.id)); });
      painel.innerHTML = '';
      painel.appendChild(h('p', { class: 'gl-bib-loc' }, lista.titulo + ': ' + lista.loc + ' · ' + lista.itens.length + ' títulos'));
      var ol = h('ol', { class: 'gl-bib' });
      lista.itens.forEach(function (x) {
        var li = h('li', null,
          x.url ? h('a', { class: 'gl-bib-t', href: x.url, target: '_blank', rel: 'noopener' }, x.t, VL.icon('externo', 14)) : h('span', { class: 'gl-bib-t' }, x.t),
          x.autor ? h('span', { class: 'gl-bib-a' }, x.autor) : null,
          x.url ? h('span', { class: 'gl-bib-pdf' }, 'PDF gratuito da DHN') : null);
        if (x.sic) li.appendChild(h('span', { class: 'gl-bib-sic' }, VL.ui.seloQ('a confirmar', x.sic), ' ', x.sic));
        ol.appendChild(li);
      });
      painel.appendChild(ol);
    }
    b.listas.forEach(function (l, i) {
      seg.appendChild(h('button', { type: 'button', 'data-id': l.id, 'aria-pressed': String(i === 0), 'aria-controls': 'gl-bib-painel', onclick: function () { mostrar(l); } }, l.titulo));
    });
    sec.appendChild(seg);
    sec.appendChild(painel);
    mostrar(b.listas[0]);
    return sec;
  }

  G.referencias = function (raiz) {
    var r = VL.data.referencias;
    var intl = !!VL.settings.get('intl');
    raiz.appendChild(VL.ui.cabecalho('Referências oficiais',
      'Normas, publicações náuticas da Marinha, meteorologia, busca e salvamento e os livros recomendados nas provas. Links conferidos em ' + G.data(r.consultado) + '.'));
    raiz.appendChild(G.subnav('referencias'));

    var grupos = r.grupos.filter(function (gp) { return intl || !gp.intl; });
    var indice = h('nav', { class: 'gl-ref-indice', 'aria-label': 'Nesta página' }, h('p', { class: 'gl-ref-indice-t' }, 'Nesta página'));
    var ol = h('ol');
    grupos.concat([{ id: 'bib', titulo: 'Bibliografia recomendada nas provas' }]).forEach(function (gp) {
      ol.appendChild(h('li', null, h('button', { type: 'button', class: 'gl-ref-ir', onclick: function () { var a = document.getElementById('gl-ref-' + gp.id); G.rolarAte(a); var t = a && VL.$('h2', a); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } } }, gp.titulo)));
    });
    indice.appendChild(ol);

    var corpo = h('div', { class: 'gl-ref-corpo' });
    corpo.appendChild(VL.ui.callout('nota', 'Antes de usar', 'Os endereços oficiais mudam de tempos em tempos. Se um link não abrir, procure pelo nome do documento no site da <a href="https://www.marinha.mil.br/dpc/normas-autoridade-maritima-brasileira" target="_blank" rel="noopener">DPC</a> ou do <a href="https://www.marinha.mil.br/chm/" target="_blank" rel="noopener">CHM</a> e avise o projeto. Regras e taxas: confirme sempre na Capitania.'));
    grupos.forEach(function (gp) {
      var sec = h('section', { class: 'gl-ref-grupo', id: 'gl-ref-' + gp.id, 'aria-labelledby': 'gl-ref-' + gp.id + '-t', 'data-intl': gp.intl ? 'on' : null });
      sec.appendChild(h('h2', { id: 'gl-ref-' + gp.id + '-t' }, gp.titulo));
      if (gp.intro) sec.appendChild(h('p', { class: 'gl-ref-intro' }, gp.intro));
      var ul = h('ul', { class: 'gl-refs' });
      gp.itens.forEach(function (it) { ul.appendChild(item(it, r.consultado)); });
      sec.appendChild(ul);
      corpo.appendChild(sec);
    });
    corpo.appendChild(bibliografia(r.bibliografia, r.consultado));
    corpo.appendChild(h('p', { class: 'gl-rodape muted' }, 'Achou um link quebrado ou uma referência melhor? ', h('a', { href: VL.link('sobre') }, 'Veja como contribuir'), '.'));
    raiz.appendChild(h('div', { class: 'gl-ref-layout' }, corpo, indice));
    raiz.appendChild(VL.ui.avisoLegal());
  };
})();
