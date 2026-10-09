/* Player de cursos: visão geral, índice de módulos e lições, blocos de conteúdo e widgets.
   Curso: VL.dado('cursos/<id>', {
     id, titulo, nivel, resumo (HTML), publico?, cargaHoras?, prerequisitos?: [texto],
     fontesGerais?: [{txt, url}], simulado?: '<nivel>', flashcards?: '<deckId>',
     modulos: [{ id, titulo, resumo, intl?, licoes: [{ id, titulo, minutos, intl?, objetivos?: [..], blocos: [...] }] }]
   })
   Blocos ({t: tipo, ...}):
     {t:'p', html} | {t:'h', txt} | {t:'lista', itens:[html], ordenada?} | {t:'callout', tipo, titulo, html}
     {t:'figura', svg|html, legenda} | {t:'tabela', cab:[..], linhas:[[..]], legenda?}
     {t:'widget', w, opts?, legenda?} | {t:'check', questoes:[...], titulo?}
     {t:'fontes', itens:[{txt, url, ref?}]} | {t:'fato', ref, html} (fato regulatório com selo automático)
     {t:'flash', deck, txt?} | {t:'termos', ids:[...]} | {t:'html', html}
   Qualquer bloco aceita intl:true (some quando a trilha internacional está desligada). */
(function () {
  'use strict';
  var h = VL.h;
  VL.curso = {};

  function visivel(x) { return !x.intl || VL.settings.get('intl'); }
  function licoesLineares(curso) {
    var out = [];
    curso.modulos.forEach(function (m, mi) {
      if (!visivel(m)) return;
      (m.licoes || []).forEach(function (l) { if (visivel(l)) out.push({ m: m, l: l, mi: mi }); });
    });
    return out;
  }
  function minutosModulo(m) { return (m.licoes || []).filter(visivel).reduce(function (s, l) { return s + (l.minutos || 10); }, 0); }

  function renderBloco(b, curso, cont) {
    if (!visivel(b)) return null;
    var el;
    switch (b.t) {
      case 'p': el = h('div', { class: 'bloco', html: b.html }); break;
      case 'h': el = h('h2', null, b.txt); break;
      case 'lista':
        el = h(b.ordenada ? 'ol' : 'ul', { class: 'bloco' });
        (b.itens || []).forEach(function (it) { el.appendChild(h('li', { html: it })); });
        break;
      case 'callout': el = VL.ui.callout(b.tipo || 'nota', b.titulo, b.html || ''); break;
      case 'figura':
        el = h('figure', { class: 'bloco' }, h('div', { html: b.svg || b.html || '' }), b.legenda ? h('figcaption', { html: b.legenda }) : null);
        break;
      case 'tabela':
        var tb = h('tbody');
        (b.linhas || []).forEach(function (ln) { tb.appendChild(h('tr', null, ln.map(function (c) { return h('td', { html: String(c) }); }))); });
        el = h('div', { class: 'bloco' },
          h('div', { class: 'table-wrap' }, h('table', { class: 'tabela' }, b.cab ? h('thead', null, h('tr', null, b.cab.map(function (c) { return h('th', { html: String(c) }); }))) : null, tb)),
          b.legenda ? h('p', { class: 'small muted', html: b.legenda }) : null);
        break;
      case 'widget':
        var alvo = h('div');
        el = h('div', { class: 'bloco-widget' }, alvo, b.legenda ? h('p', { class: 'small muted mt-4', html: b.legenda }) : null);
        VL.widgets.mount(b.w, alvo, b.opts || {});
        break;
      case 'check':
        el = h('div');
        VL.quiz.check(el, b.questoes || [], { titulo: b.titulo });
        break;
      case 'fontes':
        el = h('div', { class: 'bloco' }, h('p', { class: 'small muted mb-0' }, 'Fontes'));
        var ul = h('ul', { class: 'fontes-lista' });
        (b.itens || []).forEach(function (f) {
          var li = h('li', null, f.url ? h('a', { href: f.url, target: '_blank', rel: 'noopener' }, f.txt || f.url) : f.txt);
          if (f.ref) li.appendChild(VL.ui.fonte(f.ref));
          ul.appendChild(li);
        });
        el.appendChild(ul);
        break;
      case 'fato':
        el = h('div', { class: 'bloco' });
        var pf = h('p', { class: 'mb-0', html: b.html });
        pf.appendChild(VL.ui.fonte(b.ref));
        el.appendChild(pf);
        break;
      case 'flash':
        el = h('div', { class: 'panel bloco row' }, VL.icon('cartas'), h('span', null, b.txt || 'Fixe estes termos com flashcards.'),
          h('a', { class: 'btn btn-sm btn-primary', href: VL.link('simulados/flashcards/' + b.deck) }, 'Abrir flashcards'));
        break;
      case 'termos':
        el = h('div', { class: 'bloco chip-list' });
        (b.ids || []).forEach(function (id) { el.appendChild(h('a', { class: 'chip', href: VL.link('glossario/termo/' + id) }, (VL.data.glossarioIndice && VL.data.glossarioIndice[id]) || id.replace(/-/g, ' '))); });
        break;
      default: el = h('div', { class: 'bloco', html: b.html || '' });
    }
    if (el && b.intl) el.setAttribute('data-intl', 'on');
    return el;
  }

  function indice(curso, tabId, atualId) {
    var nav = h('nav', { class: 'curso-indice', 'aria-label': 'Módulos de ' + curso.titulo, 'data-colapsado': atualId ? '1' : '0' });
    nav.appendChild(h('div', { class: 'spread' },
      h('h2', null, h('a', { href: VL.link(tabId), style: { color: 'inherit', textDecoration: 'none' } }, curso.titulo)),
      atualId ? h('button', { type: 'button', class: 'btn btn-sm btn-ghost curso-indice-btn', 'aria-expanded': 'false', onclick: function (e) { var fechado = nav.getAttribute('data-colapsado') === '1'; nav.setAttribute('data-colapsado', fechado ? '0' : '1'); e.currentTarget.setAttribute('aria-expanded', String(fechado)); } }, 'Módulos') : null));
    nav.appendChild(VL.ui.medidor(VL.progress.cursoFrac(curso), true));
    var n = 0;
    curso.modulos.forEach(function (m) {
      if (!visivel(m)) return;
      n++;
      var aberto = !atualId || atualId.indexOf(m.id + '.') === 0;
      var det = h('details', { class: 'modulo', open: aberto, 'data-intl': m.intl ? 'on' : null },
        h('summary', null, h('span', { class: 'modulo-num' }, String(n)), h('span', null, m.titulo), h('span', { class: 'modulo-meta' }, minutosModulo(m) + ' min')));
      var ul = h('ul', { class: 'licoes' });
      (m.licoes || []).forEach(function (l) {
        if (!visivel(l)) return;
        ul.appendChild(h('li', null, h('a', { href: VL.link(tabId + '/' + m.id + '/' + l.id), 'aria-current': (m.id + '.' + l.id) === atualId ? 'page' : null },
          h('span', { class: 'licao-marca', 'data-feita': VL.progress.licaoFeita(curso.id, m.id + '.' + l.id) ? '1' : '0', 'aria-hidden': 'true' }),
          h('span', null, l.titulo))));
      });
      det.appendChild(ul);
      nav.appendChild(det);
    });
    return nav;
  }

  function visaoGeral(el, curso, tabId, extras) {
    var frac = VL.progress.cursoFrac(curso);
    var lin = licoesLineares(curso);
    var proxima = lin.filter(function (x) { return !VL.progress.licaoFeita(curso.id, x.m.id + '.' + x.l.id); })[0] || lin[0];
    var totalMin = curso.modulos.filter(visivel).reduce(function (s, m) { return s + minutosModulo(m); }, 0);
    var wrap = h('div', { class: 'curso-visao' });
    wrap.appendChild(VL.ui.cabecalho(curso.titulo, curso.resumo));
    var acoes = h('div', { class: 'btn-row' });
    if (proxima) acoes.appendChild(h('a', { class: 'btn btn-primary', href: VL.link(tabId + '/' + proxima.m.id + '/' + proxima.l.id) }, frac > 0 ? 'Continuar: ' + proxima.l.titulo : 'Começar o curso'));
    if (curso.simulado) acoes.appendChild(h('a', { class: 'btn btn-ghost', href: VL.link('simulados/' + curso.simulado) }, VL.icon('prova', 18), 'Simulado'));
    if (curso.flashcards) acoes.appendChild(h('a', { class: 'btn btn-ghost', href: VL.link('simulados/flashcards/' + curso.flashcards) }, VL.icon('cartas', 18), 'Flashcards'));
    wrap.appendChild(acoes);
    wrap.appendChild(h('div', { class: 'grid-3 mt-6' },
      h('div', { class: 'stat' }, h('span', { class: 'stat-v' }, VL.fmt.pct(frac)), h('span', { class: 'stat-l' }, 'do curso concluído')),
      h('div', { class: 'stat' }, h('span', { class: 'stat-v' }, lin.length), h('span', { class: 'stat-l' }, 'lições em ' + curso.modulos.filter(visivel).length + ' módulos')),
      h('div', { class: 'stat' }, h('span', { class: 'stat-v' }, Math.round(totalMin / 60) + ' h'), h('span', { class: 'stat-l' }, 'de leitura e exercícios'))));
    if (extras) wrap.appendChild(extras);
    if (curso.prerequisitos && curso.prerequisitos.length) {
      var ul = h('ul');
      curso.prerequisitos.forEach(function (p) {
        var li = h('li', { html: typeof p === 'string' ? p : p.html });
        if (p && p.ref) li.appendChild(VL.ui.fonte(p.ref));
        ul.appendChild(li);
      });
      wrap.appendChild(h('div', { class: 'panel mt-6' }, h('h3', null, 'Antes de começar'), ul));
    }
    var grid = h('div', { class: 'curso-modulos-grid' });
    var n = 0;
    curso.modulos.forEach(function (m) {
      if (!visivel(m)) return;
      n++;
      var lic = (m.licoes || []).filter(visivel);
      var feitas = lic.filter(function (l) { return VL.progress.licaoFeita(curso.id, m.id + '.' + l.id); }).length;
      grid.appendChild(h('a', { class: 'curso-modulo-cartao', href: VL.link(tabId + '/' + m.id + '/' + (lic[0] ? lic[0].id : '')), 'data-intl': m.intl ? 'on' : null },
        h('span', { class: 'small muted' }, 'Módulo ' + n + ' · ' + lic.length + ' lições · ' + minutosModulo(m) + ' min'),
        h('h3', null, m.titulo),
        m.resumo ? h('p', { class: 'small mb-0', html: m.resumo }) : null,
        VL.ui.medidor(lic.length ? feitas / lic.length : 0, true)));
    });
    wrap.appendChild(h('h2', { class: 'mt-6' }, 'Módulos'));
    wrap.appendChild(grid);
    if (curso.fontesGerais && curso.fontesGerais.length) wrap.appendChild(renderBloco({ t: 'fontes', itens: curso.fontesGerais }, curso));
    wrap.appendChild(VL.ui.avisoLegal());
    el.appendChild(wrap);
  }

  function licao(el, curso, tabId, modId, licId) {
    var lin = licoesLineares(curso);
    var pos = -1;
    lin.forEach(function (x, i) { if (x.m.id === modId && x.l.id === licId) pos = i; });
    if (pos < 0) { lin.forEach(function (x, i) { if (pos < 0 && x.m.id === modId) pos = i; }); }
    if (pos < 0) { visaoGeral(el, curso, tabId); return; }
    var atual = lin[pos], l = atual.l, m = atual.m;
    var layout = h('div', { class: 'curso' });
    layout.appendChild(indice(curso, tabId, m.id + '.' + l.id));
    var cont = h('article', { class: 'curso-conteudo' });
    var modNum = curso.modulos.filter(visivel).indexOf(m) + 1;
    cont.appendChild(h('header', { class: 'licao-cabeca' },
      h('p', { class: 'licao-meta mb-0' }, h('span', null, 'Módulo ' + modNum + ': ' + m.titulo), h('span', null, (l.minutos || 10) + ' min')),
      h('h1', null, l.titulo)));
    if (l.objetivos && l.objetivos.length) {
      var ob = h('ul', { class: 'mb-0' });
      l.objetivos.forEach(function (o) { ob.appendChild(h('li', { html: o })); });
      cont.appendChild(h('div', { class: 'panel' }, h('p', { class: 'mb-0', style: { fontWeight: 700 } }, 'Ao final desta lição você vai saber:'), ob));
    }
    var prosa = h('div', { class: 'prose' });
    var largos = [];
    (l.blocos || []).forEach(function (b) {
      var bl = renderBloco(b, curso, cont);
      if (!bl) return;
      if (b.t === 'widget') { largos.push(bl); cont.appendChild(prosa); cont.appendChild(bl); prosa = h('div', { class: 'prose' }); }
      else prosa.appendChild(bl);
    });
    cont.appendChild(prosa);
    var chave = m.id + '.' + l.id;
    var feita = VL.progress.licaoFeita(curso.id, chave);
    var concluir = h('button', { type: 'button', class: 'btn ' + (feita ? 'btn-ghost' : 'btn-primary') }, feita ? VL.icon('check', 18) : null, feita ? 'Lição concluída' : 'Marcar lição como concluída');
    concluir.addEventListener('click', function () {
      var agora = !VL.progress.licaoFeita(curso.id, chave);
      VL.progress.licao(curso.id, chave, agora);
      VL.progress.salvarResumoCurso(curso);
      if (agora && lin[pos + 1]) VL.go(tabId + '/' + lin[pos + 1].m.id + '/' + lin[pos + 1].l.id);
      else VL.render();
    });
    var nav = h('nav', { class: 'licao-nav', 'aria-label': 'Navegação entre lições' });
    nav.appendChild(pos > 0 ? h('a', { class: 'btn btn-ghost', href: VL.link(tabId + '/' + lin[pos - 1].m.id + '/' + lin[pos - 1].l.id) }, VL.icon('esquerda', 18), lin[pos - 1].l.titulo) : h('span'));
    nav.appendChild(concluir);
    nav.appendChild(lin[pos + 1] ? h('a', { class: 'btn btn-ghost', href: VL.link(tabId + '/' + lin[pos + 1].m.id + '/' + lin[pos + 1].l.id) }, lin[pos + 1].l.titulo, VL.icon('direita', 18)) : (curso.simulado ? h('a', { class: 'btn btn-primary', href: VL.link('simulados/' + curso.simulado) }, 'Fazer o simulado') : h('span')));
    cont.appendChild(nav);
    cont.appendChild(VL.ui.avisoLegal());
    layout.appendChild(cont);
    el.appendChild(layout);
  }

  /** Monta o curso na aba. rota.params = [moduloId, licaoId]. extras: nó opcional para a visão geral. */
  VL.curso.mount = function (el, curso, tabId, rota, extras) {
    VL.progress.salvarResumoCurso(curso);
    var p = (rota && rota.params) || [];
    if (p[0]) licao(el, curso, tabId, p[0], p[1]);
    else visaoGeral(el, curso, tabId, extras);
  };
  VL.curso.renderBloco = renderBloco;
  VL.curso.licoesLineares = licoesLineares;

  /**
   * Carrega um curso. Se o arquivo principal tiver `partes: ['cursos/x-1', ...]`, carrega cada parte
   * (cada uma chama VL.dado('cursos/x-1', {modulos:[...]})) e concatena os módulos na ordem.
   */
  VL.curso.carregar = function (id) {
    return VL.carregarDado('cursos/' + id).then(function (curso) {
      if (!curso.partes || curso._montado) return curso;
      return Promise.all(curso.partes.map(function (p) { return VL.carregarDado(p); })).then(function (partes) {
        curso.modulos = (curso.modulos || []).slice();
        partes.forEach(function (pt) { curso.modulos = curso.modulos.concat(pt.modulos || []); });
        curso._montado = true;
        return curso;
      });
    });
  };

  /** Atalho para abas de curso: registra a aba e carrega data/cursos/<id>.js sob demanda. */
  VL.curso.aba = function (def) {
    VL.tabs.register({
      id: def.id, titulo: def.titulo, curto: def.curto, grupo: def.grupo, icone: def.icone, ordem: def.ordem, tituloPagina: def.titulo,
      render: function (el, rota) {
        el.appendChild(VL.ui.carregando());
        var extras = def.css ? def.css.map(VL.loadCSS) : [];
        return Promise.all(extras).then(function () { return VL.curso.carregar(def.curso); }).then(function (curso) {
          el.innerHTML = '';
          VL.curso.mount(el, curso, def.id, rota, def.extras ? def.extras(curso) : null);
        });
      },
    });
  };
})();
