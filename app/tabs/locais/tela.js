/* Aba "Onde estudar e praticar" — parte 3: a tela (filtros, "perto de mim", lista, mapa, tripulante, rodapé).
   Estado em `e`; tudo passa por atualizar(), que refiltra, recalcula contadores, redesenha lista e mapa. */
(function () {
  'use strict';
  var h = VL.h, D = VL.locais;
  var PASSO = 30;
  var LARGO = '(min-width: 961px)';

  function lado() { return window.matchMedia && window.matchMedia(LARGO).matches; }
  function reduz() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function dataBR(iso) { return iso ? VL.fmt.data(iso + 'T12:00') : ''; }
  function ufInfo(sigla) { var l = VL.data.ufs || []; for (var i = 0; i < l.length; i++) if (l[i].uf === sigla) return l[i]; return null; }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
  function dominio(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
  function isoParaBR(txt) { return String(txt || '').replace(/(\d{4})-(\d{2})-(\d{2})/g, function (m, a, b, c) { return c + '/' + b + '/' + a; }); }
  function intlLigado() { return VL.settings.get('intl') !== false; }

  /* ---------- peças pequenas ---------- */
  function miniPino(g, px) { return h('span', { class: 'loc-mini loc-c' + g.cor, 'aria-hidden': 'true', html: D.glifo(g.icone, px || 14) }); }

  function ondeTexto(r) {
    var d = r.d, partes = [];
    if (r.escopo === 'online') return d.cidade && d.cidade !== 'Online' ? d.cidade : 'Online';
    partes.push(d.cidade);
    if (r.escopo === 'brasil') { if (d.uf) partes.push(d.uf); }
    else { if (d.uf && d.uf !== d.cidade && String(d.pais || '').indexOf(d.uf) !== 0) partes.push(d.uf); if (d.pais) partes.push(d.pais); }
    return partes.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).join(', ');
  }

  function tiposDe(r) {
    var vistos = {}, out = [];
    r.d.tipos.forEach(function (t) {
      var g = D.GRUPOS.filter(function (x) { return x.tipos.indexOf(t) >= 0; })[0];
      if (!g || (g.intl && !intlLigado())) return;
      var rot = D.rotuloTipo(t);
      if (vistos[rot]) return; vistos[rot] = 1;
      out.push({ g: g, rotulo: rot });
    });
    return out;
  }

  function contatoNode(txt) {
    var seguro = VL.esc(txt).replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, '<a href="mailto:$1">$1</a>');
    return h('span', { html: seguro });
  }

  function linhaDl(rotulo, conteudo) {
    return [h('dt', null, rotulo), h('dd', null, conteudo)];
  }

  /** Ficha completa de um local. ctx: {popup, aoMapa} */
  function detalhe(r, ctx) {
    ctx = ctx || {};
    var d = r.d, urlSite = D.urlSegura(d.site), urlEv = D.urlSegura(d.fonte_url);
    var tipos = tiposDe(r);
    var precisao = { 'aprox-bairro': 'Posição aproximada no mapa (bairro).', 'aprox-cidade': 'Posição aproximada no mapa (centro da cidade).' }[d.coord_precisao];
    var cursos = (d.cursos || []).filter(Boolean);
    var MAXC = 6;
    var linhas = [];
    if (cursos.length) {
      var txt = cursos.slice(0, MAXC).join('; ') + (cursos.length > MAXC ? '; e mais ' + (cursos.length - MAXC) + ' (veja no site)' : '');
      linhas = linhas.concat(linhaDl('Cursos', txt));
    }
    if (d.pratica) linhas = linhas.concat(linhaDl('Prática', d.pratica));
    if (d.preco) linhas = linhas.concat(linhaDl('Preço público', h('span', null, isoParaBR(d.preco), h('span', { class: 'loc-aviso-preco' }, ' Preço divulgado pelo local; confirme antes de pagar.'))));
    if (d.contato) linhas = linhas.concat(linhaDl('Contato', contatoNode(d.contato)));
    if (urlSite) linhas = linhas.concat(linhaDl('Site', h('a', { href: urlSite, target: '_blank', rel: 'noopener' }, dominio(urlSite))));
    var verif = h('span', null, dataBR(d.verificado_em) || 'sem data');
    if (urlEv) verif.appendChild(h('span', null, ' · ', h('a', { href: urlEv, target: '_blank', rel: 'noopener' }, 'ver a página que comprova')));
    linhas = linhas.concat(linhaDl('Verificado em', verif));

    var acoes = h('div', { class: 'loc-acoes' });
    if (urlSite) acoes.appendChild(h('a', { class: 'btn btn-sm btn-primary', href: urlSite, target: '_blank', rel: 'noopener' }, 'Abrir o site', VL.icon('externo', 14)));
    if (!ctx.popup && r.mapa && ctx.aoMapa) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: function () { ctx.aoMapa(r); } }, VL.icon('local', 14), 'Ver no mapa'));

    var ev = d.evidencia ? h('details', { class: 'loc-evidencia' }, h('summary', null, 'O que a página diz'), h('p', null, '“' + d.evidencia + '”')) : null;

    return h('article', { class: 'loc-det' + (ctx.popup ? ' loc-det-popup' : '') },
      h('h3', { class: 'loc-det-nome' }, d.nome),
      h('p', { class: 'loc-det-onde' }, ondeTexto(r)),
      h('ul', { class: 'loc-tipos' }, tipos.map(function (t) { return h('li', null, miniPino(t.g, 12), t.rotulo); })),
      ctx.popup ? acoes : null,
      h('dl', { class: 'loc-dl' }, linhas),
      precisao ? h('p', { class: 'loc-nota' }, precisao) : (r.mapa ? null : h('p', { class: 'loc-nota' }, r.escopo === 'online' ? 'Atende online: não tem ponto no mapa.' : 'Sem ponto no mapa: o local das aulas não está confirmado.')),
      ev, ctx.popup ? null : acoes);
  }
  D.detalhe = detalhe;

  /* ---------- a tela ---------- */
  D.montar = function (raiz, rota) {
    raiz.appendChild(VL.ui.carregando('Abrindo os locais…'));
    return VL.carregarDado('locais').then(function (dados) {
      if (!raiz.isConnected) return;
      raiz.innerHTML = '';
      construir(raiz, rota, dados);
    });
  };

  function construir(raiz, rota, dados) {
    var regs = D.preparar(dados.itens || []);
    var porId = {}; regs.forEach(function (r) { porId[r.id] = r; });
    var e = Object.assign(D.estadoDaRota(rota.query), { soVisivel: false, ordem: 'nome', pos: null, limite: PASSO });
    var ctl = null, morto = false, ativo = null, filtrados = [], base = [];
    var refs = {};
    var ultimaVerif = regs.reduce(function (m, r) { return r.d.verificado_em && r.d.verificado_em > m ? r.d.verificado_em : m; }, '');

    VL.aoSair(function () { morto = true; if (ctl) ctl.destruir(); offSettings(); });
    var offSettings = VL.on('settings', function () { if (!morto && raiz.isConnected) { limparIntl(); atualizar({}); montarTripulante(); } });

    function filtroAtual() { return { q: e.q, escopo: e.escopo, regiao: e.regiao, geo: e.geo, grupos: e.grupos, curso: e.curso, intl: intlLigado() }; }
    function limparIntl() {
      if (intlLigado()) return;
      e.grupos = e.grupos.filter(function (g) { var x = D.grupo(g); return !(x && x.intl); });
      if (e.curso && D.CURSOS.some(function (c) { return c.id === e.curso && c.intl; })) e.curso = '';
    }
    limparIntl();

    /* ----- cabeçalho ----- */
    var totalUtil = regs.filter(function (r) { return intlLigado() || !r.soIntl; }).length;
    raiz.appendChild(VL.ui.cabecalho('Onde estudar e praticar',
      'Escolas de vela, preparatórios para a prova da Marinha, clubes, regatas, charter e Capitanias. Todo local abaixo tem site conferido. Isto não é ranking nem indicação: confirme preços, vagas e condições direto com o local.'));

    /* ----- busca + perto de mim ----- */
    var inputBusca = h('input', { type: 'search', id: 'loc-q', 'aria-label': 'Buscar locais por nome, cidade ou curso',  value: e.q, placeholder: 'Nome, cidade, curso ou palavra…', autocomplete: 'off', 'aria-describedby': 'loc-resumo',
      oninput: function () { e.q = inputBusca.value; e.limite = PASSO; atualizarAdiado(true); } });
    var btnPerto = h('button', { type: 'button', class: 'btn', 'aria-expanded': 'false', 'aria-controls': 'loc-perto', onclick: alternarPerto }, VL.icon('alvo', 18), 'Perto de mim');
    refs.perto = h('section', { class: 'loc-perto', id: 'loc-perto', hidden: true, 'aria-label': 'Ordenar por distância' });
    var topo = h('div', { class: 'loc-topo' },
      h('div', { class: 'loc-busca' }, h('label', { for: 'loc-q' }, 'Buscar'), h('div', { class: 'loc-busca-campo' }, VL.icon('busca', 18), inputBusca)),
      btnPerto);
    raiz.appendChild(topo);
    raiz.appendChild(refs.perto);

    /* ----- filtros ----- */
    refs.escopo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Onde fica' });
    refs.regioes = h('div', { class: 'chip-list', role: 'group', 'aria-label': 'Região do Brasil' });
    refs.geoSel = h('select', { id: 'loc-geo', onchange: function () { e.geo = refs.geoSel.value; e.limite = PASSO; atualizar({ ajustar: true }); } });
    refs.cursoSel = h('select', { id: 'loc-curso', onchange: function () { e.curso = refs.cursoSel.value; e.limite = PASSO; atualizar({ ajustar: true }); } });
    refs.ordemSel = h('select', { id: 'loc-ordem', onchange: function () { e.ordem = refs.ordemSel.value; atualizar({}); } });
    refs.tipos = h('div', { class: 'loc-chips', role: 'group', 'aria-label': 'Tipo de local' });
    refs.visivelCk = h('input', { type: 'checkbox', id: 'loc-visivel', onchange: function () { e.soVisivel = refs.visivelCk.checked; e.limite = PASSO; atualizar({}); } });
    refs.limpar = h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: limparFiltros }, 'Limpar filtros');
    refs.geoRot = h('label', { for: 'loc-geo' }, 'Estado');
    refs.geoCampo = h('div', { class: 'loc-campo' }, refs.geoRot, refs.geoSel);

    refs.det = h('details', { class: 'loc-filtros' },
      h('summary', null, VL.icon('filtro', 18), h('span', null, 'Filtros'), h('span', { class: 'loc-filtros-n', id: 'loc-filtros-n' })),
      h('div', { class: 'loc-filtros-corpo' },
        h('div', { class: 'loc-linha loc-linha-onde' },
          h('div', { class: 'loc-campo' }, h('span', { class: 'loc-rot' }, 'Onde fica'), refs.escopo),
          refs.regioes),
        h('div', { class: 'loc-linha loc-selects' },
          refs.geoCampo,
          h('div', { class: 'loc-campo' }, h('label', { for: 'loc-curso' }, 'Curso'), refs.cursoSel),
          h('div', { class: 'loc-campo' }, h('label', { for: 'loc-ordem' }, 'Ordenar por'), refs.ordemSel),
          h('div', { class: 'loc-campo loc-campo-limpar' }, refs.limpar)),
        h('div', { class: 'loc-linha' }, h('span', { class: 'loc-rot' }, 'Tipo de local (cada tipo tem uma cor e um desenho no mapa)'), refs.tipos)));
    if (lado()) refs.det.setAttribute('open', '');
    raiz.appendChild(refs.det);

    /* ----- resumo, mapa e lista ----- */
    refs.resumo = h('p', { class: 'loc-resumo', id: 'loc-resumo', role: 'status', 'aria-live': 'polite' });
    raiz.appendChild(h('div', { class: 'loc-resumo-linha' }, refs.resumo,
      h('label', { class: 'loc-ck', for: 'loc-visivel' }, refs.visivelCk, h('span', null, 'Na lista, só o que está visível no mapa'))));

    var inst = VL.ui.instrumento({ titulo: 'Mapa dos locais. Terra: Natural Earth. Estados: IBGE. Funciona sem internet.' });
    refs.mapaEl = h('div', { class: 'loc-mapa', tabindex: '-1' });
    inst.corpo.appendChild(refs.mapaEl);
    refs.osmCk = h('input', { type: 'checkbox', id: 'loc-osm', onchange: function () { if (ctl) ctl.osm(refs.osmCk.checked); } });
    inst.controles.appendChild(h('label', { class: 'switch loc-osm', for: 'loc-osm' }, refs.osmCk, h('span', null, 'Mapa detalhado (OpenStreetMap, precisa de internet)')));
    inst.controles.appendChild(h('p', { class: 'loc-osm-dica' }, 'Desligado, o app não baixa nada. Ligado, o navegador busca o mapa nos servidores do OpenStreetMap.'));
    refs.mapaCaixa = h('div', { class: 'loc-mapa-caixa' }, inst.raiz);

    refs.lista = h('ol', { class: 'loc-lista', 'aria-label': 'Locais encontrados' });
    refs.mais = h('div', { class: 'loc-mais' });
    refs.listaCaixa = h('div', { class: 'loc-lista-caixa' }, refs.lista, refs.mais);
    raiz.appendChild(h('div', { class: 'loc-grid' }, refs.mapaCaixa, refs.listaCaixa));

    refs.tripulante = h('section', { class: 'loc-trip', id: 'embarcar', 'aria-labelledby': 'loc-trip-t' });
    raiz.appendChild(refs.tripulante);
    raiz.appendChild(rodape());

    /* ----- filtros: ações ----- */
    function limparFiltros() {
      e.q = ''; e.escopo = 'brasil'; e.regiao = ''; e.geo = ''; e.grupos = []; e.curso = ''; e.soVisivel = false; e.limite = PASSO;
      inputBusca.value = ''; refs.visivelCk.checked = false;
      atualizar({ ajustar: true });
    }
    function trocarEscopo(id) { e.escopo = id; e.regiao = ''; e.geo = ''; e.limite = PASSO; atualizar({ ajustar: true }); }
    function trocarRegiao(id) { e.regiao = e.regiao === id ? '' : id; e.geo = ''; e.limite = PASSO; atualizar({ ajustar: true }); }
    function alternarGrupo(id) {
      var i = e.grupos.indexOf(id);
      if (i >= 0) e.grupos.splice(i, 1); else e.grupos.push(id);
      e.limite = PASSO; atualizar({ ajustar: true });
    }

    var adiado = null;
    function atualizarAdiado(ajustar) { clearTimeout(adiado); adiado = setTimeout(function () { if (!morto) atualizar({ ajustar: ajustar }); }, 180); }

    /* ----- construção dos controles com contadores ----- */
    function contar(lista, fn) { var m = {}; lista.forEach(function (r) { [].concat(fn(r)).forEach(function (k) { if (k !== '' && k != null) m[k] = (m[k] || 0) + 1; }); }); return m; }

    function desenharControles() {
      var f = filtroAtual();
      /* escopo */
      var cEsc = contar(D.filtrar(regs, f, 'escopo'), function (r) { return r.escopo; });
      var total = D.filtrar(regs, f, 'escopo').length;
      refs.escopo.innerHTML = '';
      D.ESCOPOS.forEach(function (s) {
        var n = s.id === 'todos' ? total : (cEsc[s.id] || 0);
        refs.escopo.appendChild(h('button', { type: 'button', 'aria-pressed': String(e.escopo === s.id), onclick: function () { trocarEscopo(s.id); } },
          s.rotulo + ' ', h('span', { class: 'loc-n' }, '(' + n + ')')));
      });
      /* regiões */
      refs.regioes.innerHTML = '';
      refs.regioes.hidden = e.escopo !== 'brasil';
      if (e.escopo === 'brasil') {
        var cReg = contar(D.filtrar(regs, f, 'regiao'), function (r) { return r.d.regiao; });
        D.REGIOES.forEach(function (rg) {
          var n = cReg[rg] || 0;
          refs.regioes.appendChild(h('button', { type: 'button', class: 'chip loc-chip-reg' + (n ? '' : ' loc-chip-vazio'), 'aria-pressed': String(e.regiao === rg), onclick: function () { trocarRegiao(rg); } },
            rg, h('span', { class: 'loc-n' }, n)));
        });
      }
      /* estado / país */
      var mostraGeo = e.escopo === 'brasil' || e.escopo === 'exterior';
      refs.geoCampo.hidden = !mostraGeo;
      if (mostraGeo) {
        refs.geoRot.textContent = e.escopo === 'brasil' ? 'Estado' : 'País';
        var cGeo = contar(D.filtrar(regs, f, 'geo'), function (r) { return D.geoDe(r); });
        var chaves = Object.keys(cGeo);
        if (e.geo && chaves.indexOf(e.geo) < 0) chaves.push(e.geo);
        chaves.sort(function (a, b) { return VL.semAcento(a) < VL.semAcento(b) ? -1 : 1; });
        refs.geoSel.innerHTML = '';
        refs.geoSel.appendChild(h('option', { value: '' }, e.escopo === 'brasil' ? 'Todos os estados' : 'Todos os países'));
        chaves.forEach(function (k) {
          var u = e.escopo === 'brasil' ? ufInfo(k) : null;
          refs.geoSel.appendChild(h('option', { value: k }, (u ? u.nome + ' (' + k + ')' : k) + ' — ' + (cGeo[k] || 0)));
        });
        refs.geoSel.value = e.geo;
      }
      /* curso */
      var cCur = contar(D.filtrar(regs, f, 'curso'), function (r) { return r.cursos; });
      refs.cursoSel.innerHTML = '';
      refs.cursoSel.appendChild(h('option', { value: '' }, 'Qualquer curso'));
      D.CURSOS.forEach(function (c) {
        if (c.intl && !intlLigado()) return;
        if (!cCur[c.id] && e.curso !== c.id) return;
        refs.cursoSel.appendChild(h('option', { value: c.id, 'data-intl': c.intl ? 'on' : null }, c.rotulo + ' — ' + (cCur[c.id] || 0)));
      });
      refs.cursoSel.value = e.curso;
      /* ordem */
      refs.ordemSel.innerHTML = '';
      refs.ordemSel.appendChild(h('option', { value: 'nome' }, 'Nome (A a Z)'));
      refs.ordemSel.appendChild(h('option', { value: 'estado' }, 'Região e estado'));
      if (e.pos) refs.ordemSel.appendChild(h('option', { value: 'distancia' }, 'Mais perto de ' + (e.pos.rotulo || 'mim')));
      refs.ordemSel.value = e.ordem;
      /* tipos */
      var cGr = contar(D.filtrar(regs, f, 'grupos'), function (r) { return r.grupos; });
      refs.tipos.innerHTML = '';
      D.GRUPOS.forEach(function (g) {
        if (g.intl && !intlLigado()) return;
        var n = cGr[g.id] || 0, ligado = e.grupos.indexOf(g.id) >= 0;
        if (!n && !ligado) return;
        refs.tipos.appendChild(h('button', { type: 'button', class: 'chip loc-chip' + (n ? '' : ' loc-chip-vazio'), title: g.desc, 'aria-pressed': String(ligado), onclick: function () { alternarGrupo(g.id); } },
          miniPino(g, 13), g.curto, h('span', { class: 'loc-n' }, n)));
      });
      /* selo de filtros ativos */
      var ativos = (e.q ? 1 : 0) + (e.escopo !== 'brasil' ? 1 : 0) + (e.regiao ? 1 : 0) + (e.geo ? 1 : 0) + e.grupos.length + (e.curso ? 1 : 0) + (e.soVisivel ? 1 : 0);
      var sel = VL.$('#loc-filtros-n', refs.det);
      if (sel) sel.textContent = ativos ? ativos + (ativos === 1 ? ' ativo' : ' ativos') : '';
      refs.limpar.disabled = !ativos;
    }

    /* ----- lista ----- */
    function dentroDoMapa(r) {
      if (!r.mapa || !ctl) return false;
      var b = ctl.limites();
      return r.lat <= b.norte && r.lat >= b.sul && r.lon <= b.leste && r.lon >= b.oeste;
    }

    function itemLista(r) {
      var g = D.grupoDoMarcador(r, e.grupos);
      var tipos = tiposDe(r).slice(0, 3).map(function (t) { return t.g.curto; });
      var dist = r.dist != null ? h('span', { class: 'loc-dist', title: 'Distância em linha reta' + (r.d.coord_precisao && r.d.coord_precisao !== 'exata' ? ' (posição aproximada)' : '') }, 'a ' + VL.fmt.distKm(r.dist)) : null;
      var corpo = h('div', { class: 'loc-item-corpo', hidden: true });
      var li = h('li', { class: 'loc-item' + (ativo === r ? ' ativo' : ''), 'data-id': r.id });
      var cab = h('button', { type: 'button', class: 'loc-item-cab', 'aria-expanded': 'false', onclick: function () { clicarItem(r, li, cab, corpo); } },
        miniPino(g, 15),
        h('span', { class: 'loc-item-txt' },
          h('span', { class: 'loc-item-nome' }, r.d.nome),
          h('span', { class: 'loc-item-sub' }, ondeTexto(r) + (r.mapa ? '' : (r.escopo === 'online' ? '' : ' · sem ponto no mapa'))),
          h('span', { class: 'loc-item-tipos' }, tipos.join(' · '))),
        dist);
      li.appendChild(cab); li.appendChild(corpo);
      return li;
    }

    function expandir(r, cab, corpo, abrir) {
      if (abrir && !corpo.firstChild) corpo.appendChild(detalhe(r, { aoMapa: verNoMapa }));
      corpo.hidden = !abrir;
      cab.setAttribute('aria-expanded', String(abrir));
    }

    function clicarItem(r, li, cab, corpo) {
      if (r.mapa && lado() && ctl) { marcarAtivo(r, true); ctl.abrir(r); return; }
      var abrir = corpo.hidden;
      expandir(r, cab, corpo, abrir);
      marcarAtivo(abrir ? r : null, false);
    }

    function verNoMapa(r) {
      if (!ctl) return;
      if (!lado()) refs.mapaCaixa.scrollIntoView({ block: 'start', behavior: reduz() ? 'auto' : 'smooth' });
      ctl.abrir(r);
    }

    function marcarAtivo(r, rolar) {
      ativo = r;
      VL.$$('.loc-item.ativo', refs.lista).forEach(function (x) { x.classList.remove('ativo'); });
      if (!r) return;
      var li = refs.lista.querySelector('[data-id="' + (window.CSS && CSS.escape ? CSS.escape(r.id) : r.id) + '"]');
      if (li) li.classList.add('ativo');
      if (rolar && li && lado()) {
        var cx = refs.listaCaixa, topo = li.offsetTop - cx.offsetTop;
        if (topo < cx.scrollTop || topo + li.offsetHeight > cx.scrollTop + cx.clientHeight) cx.scrollTo({ top: Math.max(0, topo - 8), behavior: reduz() ? 'auto' : 'smooth' });
      }
    }

    function desenharLista() {
      refs.lista.innerHTML = ''; refs.mais.innerHTML = '';
      if (!filtrados.length) {
        refs.lista.appendChild(h('li', { class: 'vazio loc-vazio' },
          h('p', null, e.soVisivel ? 'Nenhum local nesta parte do mapa. Afaste o mapa ou desligue “só o que está visível”.' : 'Nenhum local com esses filtros.'),
          h('button', { type: 'button', class: 'btn btn-sm', onclick: limparFiltros }, 'Limpar filtros')));
        return;
      }
      var n = Math.min(filtrados.length, e.limite);
      for (var i = 0; i < n; i++) refs.lista.appendChild(itemLista(filtrados[i]));
      if (n < filtrados.length) {
        refs.mais.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { e.limite += PASSO; desenharLista(); } },
          'Mostrar mais ' + Math.min(PASSO, filtrados.length - n) + ' (faltam ' + (filtrados.length - n) + ')'));
      }
    }

    function garantirNaLista(r) {
      var i = filtrados.indexOf(r);
      if (i >= 0 && i >= e.limite) { e.limite = i + 1; desenharLista(); }
    }

    /* ----- atualização geral ----- */
    function atualizar(opc) {
      opc = opc || {};
      if (!intlLigado() && e.escopo === 'exterior') { /* continua válido: charter, rally… */ }
      base = D.filtrar(regs, filtroAtual());
      var visiveis = base;
      if (e.soVisivel && ctl) visiveis = base.filter(dentroDoMapa);
      filtrados = D.ordenar(visiveis, e.ordem === 'distancia' && !e.pos ? 'nome' : e.ordem);
      desenharControles();
      desenharLista();
      var comPonto = base.filter(function (r) { return r.mapa; }).length;
      refs.resumo.textContent = plural(filtrados.length, 'local', 'locais') + (e.soVisivel ? ' na parte visível do mapa' : (filtrados.length === 1 ? ' encontrado' : ' encontrados')) +
        (e.soVisivel ? '' : ' · ' + comPonto + ' no mapa' + (base.length - comPonto ? ' · ' + (base.length - comPonto) + ' só na lista' : ''));
      if (ctl) {
        ctl.definir(base);
        if (opc.ajustar && !e.soVisivel) {
          var extras = e.pos ? [[e.pos.lat, e.pos.lon]] : [];
          var alvo = base;
          if (opc.ajustar === 'perto') alvo = D.ordenar(base.filter(function (r) { return r.mapa; }), 'distancia').slice(0, 6);
          ctl.ajustar(alvo, extras, opc.ajustar === 'perto' ? { maxZoom: 8 } : null);
        }
      }
      var qs = D.estadoParaQuery(e);
      try { history.replaceState(null, '', '#/locais' + (qs ? '?' + qs : '')); } catch (err) { /* sem history */ }
    }

    /* ----- perto de mim ----- */
    function baseSalva() {
      var s = VL.settings.all();
      if (s.lat != null && s.lon != null) return { lat: s.lat, lon: s.lon, rotulo: s.cidade || (ufInfo(s.uf) ? ufInfo(s.uf).nome : 'minha base') };
      var u = ufInfo(s.uf);
      if (u) return { lat: u.lat, lon: u.lon, rotulo: u.capital + ' (' + u.uf + ')' };
      return null;
    }

    function definirPos(p, rotuloStatus) {
      e.pos = p;
      D.calcularDistancias(regs, p);
      e.ordem = 'distancia'; e.limite = PASSO;
      if (ctl) ctl.usuario(p);
      atualizar({ ajustar: 'perto' });
      desenharPerto(rotuloStatus);
    }
    function pararPerto() {
      e.pos = null; D.calcularDistancias(regs, null);
      if (e.ordem === 'distancia') e.ordem = 'nome';
      if (ctl) ctl.usuario(null);
      atualizar({ ajustar: true });
      desenharPerto('');
    }
    function usarGeo(status) {
      if (!navigator.geolocation) { status.textContent = 'Este navegador não oferece localização. Escolha um estado abaixo.'; return; }
      status.textContent = 'Aguardando a permissão do navegador…';
      navigator.geolocation.getCurrentPosition(function (p) {
        /* arredonda a ~1 km: basta para ordenar e não guarda nada */
        var lat = Math.round(p.coords.latitude * 100) / 100, lon = Math.round(p.coords.longitude * 100) / 100;
        definirPos({ lat: lat, lon: lon, rotulo: 'você' }, 'Pronto: a lista está ordenada pela distância até você.');
      }, function (err) {
        status.textContent = err && err.code === 1 ? 'Você não permitiu a localização. Tudo bem: escolha um estado abaixo.' :
          'Não consegui obter a localização. Escolha um estado abaixo.';
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
    }

    function desenharPerto(msg) {
      var box = refs.perto;
      box.innerHTML = '';
      var status = h('p', { class: 'field-hint loc-perto-status', role: 'status' }, msg || '');
      var salva = baseSalva();
      var ufSel = h('select', { id: 'loc-perto-uf', 'aria-label': 'Escolher um estado', onchange: function () {
        var u = ufInfo(ufSel.value); if (!u) return;
        definirPos({ lat: u.lat, lon: u.lon, rotulo: u.capital + ' (' + u.uf + ')' }, 'Pronto: a lista está ordenada pela distância até ' + u.capital + ', capital de ' + u.nome + '.');
      } }, h('option', { value: '' }, 'Escolher um estado (usa a capital)'),
      (VL.data.ufs || []).map(function (u) { return h('option', { value: u.uf }, u.nome + ' — ' + u.capital); }));
      box.appendChild(h('p', { class: 'loc-perto-txt' }, 'A lista passa a mostrar primeiro os locais mais perto de você, com a distância em linha reta. A localização é usada só neste aparelho para fazer a conta: o app não envia a sua posição a ninguém e não guarda nada. Se preferir, use a sua base das Configurações ou escolha um estado.'));
      var acoes = h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn btn-primary btn-sm', onclick: function () { usarGeo(status); } }, VL.icon('alvo', 14), 'Usar a localização do aparelho'));
      if (salva) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-sm', onclick: function () { definirPos(salva, 'Pronto: a lista está ordenada pela distância até ' + salva.rotulo + '.'); } }, 'Usar minha base: ' + salva.rotulo));
      if (e.pos) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: pararPerto }, 'Parar de usar'));
      box.appendChild(acoes);
      box.appendChild(h('div', { class: 'loc-perto-uf' }, ufSel));
      if (!salva) box.appendChild(h('p', { class: 'field-hint' }, 'Dica: guarde sua base nas Configurações (engrenagem no alto) e ela aparece aqui.'));
      box.appendChild(status);
    }
    function alternarPerto() {
      var abrir = refs.perto.hidden;
      refs.perto.hidden = !abrir;
      btnPerto.setAttribute('aria-expanded', String(abrir));
      if (abrir) desenharPerto('');
    }

    /* ----- embarcar como tripulante ----- */
    function montarTripulante() {
      var s = refs.tripulante;
      s.innerHTML = '';
      var crew = regs.filter(function (r) { return r.grupos.indexOf('crew') >= 0 && (intlLigado() || !r.soIntl); });
      D.ordenar(crew, 'nome');
      var nReg = regs.filter(function (r) { return r.grupos.indexOf('regata') >= 0; }).length;
      var nRal = regs.filter(function (r) { return r.grupos.indexOf('rally') >= 0 && (intlLigado() || !r.soIntl); }).length;
      s.appendChild(h('h2', { id: 'loc-trip-t' }, 'Embarcar como tripulante'));
      s.appendChild(h('p', { class: 'lead' }, 'O jeito mais barato de ganhar milhas é embarcar no barco de outra pessoa. Regatas, entregas de barco e rallies precisam de gente a bordo.'));
      s.appendChild(h('div', { class: 'loc-trip-txt prose' },
        h('p', null, 'Quadros de tripulantes (crew finders) juntam comandantes que procuram gente e velejadores que procuram vaga. Muitas regatas mantêm a própria bolsa de tripulantes. Rallies publicam vagas para as travessias.'),
        VL.ui.callout('seguranca', 'Antes de aceitar uma vaga',
          '<ul><li>Converse com o comandante: qual é o trajeto, quanto tempo dura e quem paga o quê. Combine por escrito.</li>' +
          '<li>Pergunte pela habilitação dele, pelo equipamento de segurança do barco (coletes, balsa, rádio) e pelo seguro.</li>' +
          '<li>Comece por uma regata costeira ou por um passeio curto. Só parta para uma travessia longa depois de conhecer o barco e o comandante.</li>' +
          '<li>Desconfie de vaga que pede dinheiro adiantado sem contrato nem referências.</li></ul>')));
      s.appendChild(h('div', { class: 'btn-row loc-trip-atalhos' },
        h('button', { type: 'button', class: 'btn', onclick: function () { aplicarAtalho(['regata'], 'brasil'); } }, miniPino(D.grupo('regata'), 13), 'Ver as regatas (' + nReg + ')'),
        nRal ? h('button', { type: 'button', class: 'btn', onclick: function () { aplicarAtalho(['rally'], 'todos'); } }, miniPino(D.grupo('rally'), 13), 'Ver os rallies (' + nRal + ')') : null,
        h('button', { type: 'button', class: 'btn', onclick: function () { aplicarAtalho(['crew'], 'todos'); } }, miniPino(D.grupo('crew'), 13), 'Ver só os quadros de vagas (' + crew.length + ')')));
      var ul = h('ul', { class: 'loc-trip-lista' });
      D.ordenar(crew, 'nome').forEach(function (r) {
        var d = r.d, urlSite = D.urlSegura(d.site);
        ul.appendChild(h('li', { class: 'loc-trip-card' },
          h('h3', null, d.nome),
          h('p', { class: 'loc-trip-onde' }, r.escopo === 'online' ? 'Online' : ondeTexto(r)),
          h('p', null, D.resumir(d.pratica, 190)),
          h('div', { class: 'loc-acoes' },
            urlSite ? h('a', { class: 'btn btn-sm btn-primary', href: urlSite, target: '_blank', rel: 'noopener' }, 'Abrir o site', VL.icon('externo', 14)) : null,
            r.mapa ? h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: function () { aplicarAtalho([], 'todos', r); } }, VL.icon('local', 14), 'Ver no mapa') : null)));
      });
      s.appendChild(ul);
    }

    function aplicarAtalho(grupos, escopo, abrir) {
      e.q = ''; inputBusca.value = ''; e.regiao = ''; e.geo = ''; e.curso = ''; e.soVisivel = false; refs.visivelCk.checked = false;
      e.grupos = grupos.slice(); e.escopo = escopo; e.limite = PASSO;
      atualizar({ ajustar: !abrir });
      refs.mapaCaixa.scrollIntoView({ block: 'start', behavior: reduz() ? 'auto' : 'smooth' });
      if (abrir && ctl) ctl.abrir(abrir);
    }

    /* ----- rodapé ----- */
    function rodape() {
      return h('section', { class: 'loc-rodape', 'aria-labelledby': 'loc-rod-t' },
        h('h2', { id: 'loc-rod-t' }, 'Como os locais entram aqui'),
        h('div', { class: 'loc-rodape-cols' },
          h('div', null,
            h('h3', null, 'Critério de verificação'),
            h('p', null, 'Só entra local com site conferido. Cada ficha mostra a data da verificação e o link da página que comprova o que está escrito. Preços são os que o próprio local divulga, com a data da consulta. A última verificação da base foi em ' + (dataBR(ultimaVerif) || 'data não registrada') + '.'),
            h('p', null, 'Locais mudam de endereço, de preço e de agenda. Confirme sempre com o local, e as provas e taxas da Marinha na Capitania.')),
          h('div', null,
            h('h3', null, 'Sugerir um local ou corrigir um dado'),
            h('p', null, 'Conhece uma escola, um clube ou uma regata que falta? Viu um dado errado? Mande o nome, a cidade, o tipo e o link do site oficial. Sem site conferido o local não entra.'),
            h('p', null, h('a', { class: 'btn btn-sm', href: VL.link('sobre?secao=contribuir') }, 'Como contribuir')))),
        h('p', { class: 'loc-credito' }, 'Mapa base: Natural Earth (domínio público) e IBGE, desenhado no seu aparelho. O mapa detalhado opcional é © colaboradores do OpenStreetMap, ODbL. O app não usa nenhum serviço de mapas por padrão.'));
    }

    /* ----- partida ----- */
    montarTripulante();
    desenharPerto('');
    refs.visivelCk.checked = e.soVisivel;
    atualizar({});

    var abrindo = VL.ui.carregando('Abrindo o mapa…');
    abrindo.classList.add('loc-mapa-abrindo');
    refs.mapaEl.appendChild(abrindo);
    D.criarMapa(refs.mapaEl, {
      popup: function (r) { return detalhe(r, { popup: true }); },
      aoAbrir: function (r) { if (r) { garantirNaLista(r); marcarAtivo(r, true); } else marcarAtivo(null); },
      aoMover: function () { if (e.soVisivel) atualizar({}); },
      selecionados: function () { return e.grupos; },
      aoOsm: function (lig) { refs.osmCk.checked = lig; },
    }).then(function (c) {
      abrindo.remove();
      if (morto || !raiz.isConnected) { c.destruir(); return; }
      ctl = c;
      atualizar({ ajustar: true });
      var alvo = rota.query.id && porId[rota.query.id];
      if (alvo && alvo.mapa) setTimeout(function () { if (!morto) ctl.abrir(alvo); }, 400);
    }).catch(function (err) {
      console.error(err);
      abrindo.remove();
      refs.mapaEl.appendChild(h('p', { class: 'vazio' }, 'Não consegui abrir o mapa. A lista ao lado continua funcionando.'));
    });
  }
})();
