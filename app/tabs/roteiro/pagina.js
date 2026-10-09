/* Roteiro: monta a página (cabeçalho, resumo de progresso, carta, painel da etapa, linha do tempo, complementares e agendamento)
   e liga os eventos (progresso, configurações, hash). */
(function () {
  'use strict';
  var h = VL.h;
  var R = VL.roteiro;

  var SECOES = { tempo: 'rt-tempo', complementares: 'rt-complementares', agendar: 'rt-agendar' };

  function melhorNota(nivel) {
    var m = null, aprov = false, praticas = 0;
    VL.progress.tentativas(nivel).forEach(function (t) {
      if (t.modo === 'prova') { var nota = t.nota != null ? Number(t.nota) : (t.total ? 10 * t.acertos / t.total : 0); if (m == null || nota > m) { m = nota; aprov = !!t.aprovado; } }
      else praticas++;
    });
    return { nota: m, aprovado: aprov, praticas: praticas };
  }

  R.montar = function (raiz, rota) {
    var etapas = R.etapas();
    var estado = { sel: null };
    var ctlPainel = null, ctlCarta = null, ctlTempo = null, ctlAgenda = null;
    var colunas = function () { return window.matchMedia && window.matchMedia('(min-width: 1040px)').matches; };

    /* ---------- esqueleto ---------- */
    var pagina = h('div', { class: 'rt-pagina' });
    var navChips = h('nav', { class: 'chip-list rt-nav', 'aria-label': 'Seções do roteiro' });
    [['Carta', null], ['Linha do tempo', 'tempo'], ['Complementares', 'complementares'], ['Agendar a prova', 'agendar']].forEach(function (s) {
      navChips.appendChild(h('a', { class: 'chip', href: '#/roteiro' + (s[1] ? '/' + s[1] : ''), onclick: function (ev) {
        ev.preventDefault();
        if (!s[1]) window.scrollTo({ top: 0, behavior: 'auto' }); else R.rolarPara(VL.$('#' + SECOES[s[1]]));
      } }, s[0]));
    });
    var cab = h('header', { class: 'rt-cab' },
      h('h1', null, 'Roteiro da habilitação'),
      h('p', { class: 'lead' }, 'A habilitação desenhada como uma derrota plotada numa carta: doze etapas, do zero ao comando de uma travessia do Atlântico. Toque num ponto para ver o que fazer, quanto custa e quanto tempo leva, no seu ritmo.'),
      navChips);
    var resumo = h('section', { class: 'rt-resumo', 'aria-label': 'Seu progresso' });
    var convite = h('div', { class: 'rt-convite-box' });
    var areaCarta = h('div', { class: 'rt-carta' });
    var inst = VL.ui.instrumento({ titulo: 'Carta estilizada para orientar o estudo: não serve para navegar.' });
    var corpoCarta = inst.corpo;
    corpoCarta.classList.add('rt-carta-corpo');
    areaCarta.appendChild(inst.raiz);
    var painelBox = h('section', { class: 'rt-painel', id: 'rt-painel', 'aria-label': 'Detalhes da etapa', 'aria-live': 'polite' });

    pagina.appendChild(cab);
    pagina.appendChild(h('div', { class: 'rt-resumo-area' }, resumo, convite));
    pagina.appendChild(areaCarta);
    pagina.appendChild(painelBox);
    raiz.appendChild(pagina);

    var secTempo = h('section', { class: 'rt-secao', id: 'rt-tempo' });
    var secComp = h('section', { class: 'rt-secao', id: 'rt-complementares' });
    var secAgenda = h('section', { class: 'rt-secao', id: 'rt-agendar' });
    raiz.appendChild(secTempo);
    raiz.appendChild(secComp);
    raiz.appendChild(secAgenda);
    raiz.appendChild(VL.ui.avisoLegal());

    /* ---------- resumo ---------- */
    function celula(titulo) { return h('div', { class: 'rt-cel' }, h('p', { class: 'rt-cel-t' }, titulo)); }
    function pintarResumo() {
      resumo.innerHTML = '';
      var n = etapas.length, ok = R.concluidas();
      var c1 = celula('Etapas concluídas');
      c1.appendChild(h('p', { class: 'stat-v' }, ok + ' de ' + n));
      c1.appendChild(VL.ui.medidor(ok / n, true));

      var c2 = celula('Cursos do app');
      [['arrais', 'Arrais'], ['mestre', 'Mestre'], ['capitao', 'Capitão']].forEach(function (c) {
        var r = VL.progress.resumoCurso(c[0]), f = r && r.total ? r.feitas / r.total : 0;
        c2.appendChild(h('div', { class: 'rt-mini' }, h('span', null, c[1]), VL.ui.medidor(f, true), h('span', { class: 'rt-mini-v' }, r ? VL.fmt.pct(f) : '—')));
      });

      var c3 = celula('Simulados');
      [['arrais', 'Arrais'], ['mestre', 'Mestre'], ['capitao', 'Capitão']].forEach(function (c) {
        var m = melhorNota(c[0]);
        var txt = m.nota != null ? 'melhor nota ' + VL.fmt.num(m.nota, 1) + (m.aprovado ? ', aprovado' : '') : (m.praticas ? m.praticas + (m.praticas === 1 ? ' prática' : ' práticas') : 'nenhum ainda');
        c3.appendChild(h('p', { class: 'rt-sim mb-0' }, h('a', { href: VL.link('simulados/' + c[0]) }, c[1]), h('span', { class: 'muted' }, ': ' + txt)));
      });

      var c4 = celula('Próximo passo');
      var atual = etapas[R.indiceAtual()];
      if (ok >= n) { c4.appendChild(h('p', { class: 'mb-0' }, 'Roteiro completo. Bons ventos.')); }
      else {
        c4.appendChild(h('p', { class: 'rt-prox mb-0' }, h('strong', null, atual.n + '. ' + atual.rotulo)));
        c4.appendChild(h('button', { type: 'button', class: 'btn btn-primary btn-sm', onclick: function () { selecionar(atual.id, { rolar: true }); } }, 'Ver esta etapa'));
      }
      [c1, c2, c3, c4].forEach(function (c) { resumo.appendChild(c); });

      convite.innerHTML = '';
      var cfg = R.configurado();
      if (!cfg.base || !cfg.ritmo) {
        convite.appendChild(h('p', { class: 'rt-convite small' },
          'Diga onde você vai velejar e quantas horas por semana tem: o roteiro mostra a Capitania mais próxima e recalcula os prazos. ',
          h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { VL.config.abrir(); } }, 'Abrir configurações')));
      }
    }

    /* ---------- seleção ---------- */
    function rolarAoPainel(forcar) {
      var r = painelBox.getBoundingClientRect(), vh = window.innerHeight;
      if (forcar || r.top < 60 || r.top > (colunas() ? vh : vh * 0.6)) R.rolarPara(painelBox, 70);
    }
    function selecionar(id, opt) {
      var e = R.etapa(id);
      if (!e) return;
      opt = opt || {};
      estado.sel = e.id;
      ctlPainel = R.painel(e, ctx);
      painelBox.innerHTML = '';
      painelBox.appendChild(ctlPainel.raiz);
      if (ctlCarta) ctlCarta.redesenhar();
      if (opt.hash !== false) {
        try { history.replaceState(null, '', '#/roteiro/' + e.id); } catch (x) { /* sem history API: mantém a seleção só na tela */ }
      }
      if (opt.rolar) {
        rolarAoPainel(opt.forcar);
        var t = VL.$('#rt-pt', painelBox);
        if (t) t.focus({ preventScroll: true });
      }
    }
    var ctx = { selecionar: selecionar, selecionada: function () { return estado.sel; } };

    /* ---------- estado inicial ---------- */
    var param = rota.params[0] || rota.query.secao || '';
    var inicial = R.etapa(param) || etapas[R.indiceAtual()];
    estado.sel = inicial.id;
    pintarResumo();
    ctlPainel = R.painel(inicial, ctx);
    painelBox.appendChild(ctlPainel.raiz);
    ctlCarta = R.carta(corpoCarta, ctx);
    ctlTempo = R.tempo(secTempo, ctx);
    R.complementares(secComp);
    ctlAgenda = R.agendar(secAgenda);

    /* ---------- eventos ---------- */
    var offs = [
      VL.on('progresso', function () {
        pintarResumo();
        if (ctlCarta) ctlCarta.redesenhar();
        if (ctlPainel) ctlPainel.atualizarEstado();
        if (ctlTempo) ctlTempo.atualizar();
      }),
      VL.on('settings', function () {
        pintarResumo();
        if (ctlCarta) ctlCarta.redesenhar();
        if (ctlPainel) ctlPainel.atualizarRitmo();
        if (ctlTempo) ctlTempo.atualizar();
        if (ctlAgenda && ctlAgenda.atualizar) ctlAgenda.atualizar();
      }),
    ];
    VL.aoSair(function () {
      offs.forEach(function (f) { f(); });
      if (ctlCarta) ctlCarta.destruir();
      if (ctlTempo) ctlTempo.destruir();
    });

    /* ---------- deep link ---------- */
    var secao = SECOES[param] || SECOES[rota.query.secao];
    if (secao) setTimeout(function () { R.rolarPara(VL.$('#' + secao)); }, 120);
    else if (R.etapa(param) && !colunas()) setTimeout(function () { R.rolarPara(painelBox, 70); }, 160);
  };
})();
