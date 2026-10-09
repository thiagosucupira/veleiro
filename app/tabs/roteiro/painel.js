/* Roteiro: painel de uma etapa (o que é, por que importa, pré-requisitos, documentos, custos, duração, metas de mar,
   checklist de competências e links). Fatos regulatórios sempre com fonte e selo; metas de mar são recomendação do app. */
(function () {
  'use strict';
  var h = VL.h;
  var R = VL.roteiro;

  var TIPOS = { curso: 'Curso de vela', embarque: 'Experiência de mar', cha: 'Habilitação da Marinha', comando: 'Comando' };
  var NOMES_SIM = { arrais: 'Arrais-Amador', mestre: 'Mestre-Amador', capitao: 'Capitão-Amador', vela: 'Vela prática', travessia: 'Travessia oceânica', radio: 'Rádio e segurança' };

  function sec(titulo, filhos, opts) {
    opts = opts || {};
    var d = h('details', { class: 'rt-sec' + (opts.cls ? ' ' + opts.cls : ''), open: opts.fechada ? null : true, 'data-intl': opts.intl ? 'on' : null },
      h('summary', null, h('h3', null, titulo), opts.contagem != null ? h('span', { class: 'rt-sec-n' }, String(opts.contagem)) : null),
      h('div', { class: 'rt-sec-corpo' }, filhos));
    return d;
  }

  function blocoPreco(g) {
    var f = R.faixa(g);
    var wrap = h('div', { class: 'rt-preco', 'data-intl': g.intl ? 'on' : null });
    if (!f) { wrap.appendChild(h('p', { class: 'small muted mb-0' }, g.rotulo + ': ainda sem preço público verificado.')); return wrap; }
    wrap.appendChild(h('p', { class: 'rt-faixa mb-0' }, h('strong', null, R.faixaTxt(f)), h('span', { class: 'rt-faixa-rot' }, g.rotulo)));
    var ul = h('ul', { class: 'rt-precos-lista' });
    f.pontos.forEach(function (p) {
      var l = p.local;
      var nome = l.site ? h('a', { href: l.site, target: '_blank', rel: 'noopener' }, l.nome.replace(/ — .*$/, '').replace(/ \(.*\)$/, '')) : h('span', null, l.nome);
      ul.appendChild(h('li', null, nome, h('span', { class: 'muted' }, ' (' + l.cidade.replace(/ \/.*$/, '').replace(/ \+.*$/, '') + (l.uf ? ', ' + l.uf : '') + '): '), h('strong', null, p.valor === 0 ? 'gratuito' : R.moeda(p.valor, p.moeda)), p.nota ? h('span', { class: 'muted' }, ' · ' + p.nota) : null));
    });
    wrap.appendChild(h('details', { class: 'rt-ver' }, h('summary', null, f.pontos.length === 1 ? 'Ver o preço usado' : 'Ver os ' + f.pontos.length + ' preços usados'), ul,
      h('p', { class: 'small muted mb-0' }, 'Preços públicos lidos nos sites ' + (f.de === f.ate ? 'em ' + VL.fmt.data(f.de + 'T12:00') : 'entre ' + VL.fmt.data(f.de + 'T12:00') + ' e ' + VL.fmt.data(f.ate + 'T12:00')) + '. Mudam com frequência e podem não incluir tudo: confirme com a escola.')));
    return wrap;
  }

  function secCusto(e) {
    var c = e.custo || {}, cont = h('div');
    if (c.oficial && c.oficial.length) { cont.appendChild(h('p', { class: 'rt-sub-t' }, 'Valores com fonte')); cont.appendChild(R.lista(c.oficial)); }
    var grupos = h('div', { class: 'rt-precos' });
    (c.grupos || []).forEach(function (g) { grupos.appendChild(blocoPreco(g)); });
    if (c.intl) grupos.appendChild(blocoPreco(Object.assign({ intl: true }, c.intl)));
    if (grupos.childNodes.length) cont.appendChild(grupos);
    if (c.texto) cont.appendChild(h('p', { class: 'mb-0' }, c.texto));
    if (c.aviso) {
      var p = h('p', { class: 'small muted mt-4 mb-0' }, c.aviso);
      (c.avisoRefs || []).forEach(function (r) { p.appendChild(R.fonte(r)); });
      cont.appendChild(p);
    }
    if (!c.oficial && !(c.grupos || []).length && !c.texto) cont.appendChild(h('p', { class: 'mb-0' }, 'Varia; veja escolas em “Onde estudar”.'));
    return sec('Quanto custa', cont);
  }

  function preencherTempo(corpo, e) {
    corpo.innerHTML = '';
    var sem = R.semanas(e), ritmo = R.ritmo(), cfg = R.configurado();
    corpo.appendChild(h('p', { class: 'rt-grande' }, h('strong', null, R.durTxt(sem)), ' no seu ritmo de ' + VL.fmt.num(ritmo) + ' h por semana' + (cfg.ritmo ? '' : ' (ritmo padrão)') + '.'));
    var ul = h('ul', { class: 'rt-horas' });
    if (e.tempo.estudoH) ul.appendChild(h('li', null, h('strong', null, e.tempo.estudoH + ' h'), ' de estudo'));
    if (e.tempo.praticaH) ul.appendChild(h('li', null, h('strong', null, e.tempo.praticaH + ' h'), ' de prática' + (e.tempo.marDias ? ' (' + e.tempo.marDias + ' dias a bordo × ' + R.dados().horasPorDiaDeMar + ' h' + (e.tempo.praticaH > e.tempo.marDias * R.dados().horasPorDiaDeMar ? ' + curso de sobrevivência' : '') + ')' : '')));
    ul.appendChild(h('li', null, h('strong', null, R.horas(e) + ' h'), ' no total'));
    corpo.appendChild(ul);
    var base = h('p', { class: 'small muted' }, 'Estimativa do app. ' + e.tempo.base + ' ');
    if (e.tempo.baseRef) base.appendChild(R.fonte(e.tempo.baseRef));
    corpo.appendChild(base);
    if (e.tempo.appCurso) {
      var min = R.dados().minutosCurso[e.tempo.appCurso];
      if (min) corpo.appendChild(h('p', { class: 'small muted' }, 'As lições do curso do app somam cerca de ' + VL.fmt.num(min / 60, 1) + ' h de leitura e exercícios.'));
    }
    if (e.tempo.calendario) {
      corpo.appendChild(R.aviso({ tipo: 'nota', titulo: 'A prova de Capitão tem calendário', html: 'As inscrições ocorrem, em princípio, em fevereiro e agosto, com provas em abril e outubro. Por isso, depois de estudar, pode haver uma espera de alguns meses até a prova. Use esse tempo para somar milhas (etapa 10).', refs: ['normas-77'] }));
    }
    corpo.appendChild(h('p', { class: 'small mb-0' }, h('a', { href: '#/roteiro/tempo', onclick: function (ev) { ev.preventDefault(); R.rolarPara(VL.$('#rt-tempo')); } }, 'Mudar o ritmo e ver a linha do tempo')));
  }

  /**
   * Monta o painel de uma etapa. ctx = { proxima(), todas() }.
   * Devolve { raiz, atualizarEstado(), atualizarRitmo() }.
   */
  R.painel = function (e, ctx) {
    var i = R.indice(e), n = R.etapas().length;
    var raiz = h('article', { class: 'rt-etapa', 'aria-labelledby': 'rt-pt', 'data-tipo': e.tipo });
    var estadoBox = h('div', { class: 'rt-estado' });
    var chips = h('div', { class: 'chip-list rt-chips' });
    var contador = h('span', { class: 'small muted' });
    var botaoConcluir = h('button', { type: 'button', class: 'btn' });
    var dica = h('p', { class: 'rt-dica small', hidden: true });

    function pintarEstado() {
      var feita = R.feita(e.id), atual = R.indiceAtual() === i;
      chips.innerHTML = '';
      chips.appendChild(h('span', { class: 'chip' }, TIPOS[e.tipo] || 'Etapa'));
      if (feita) chips.appendChild(h('span', { class: 'chip rt-chip-ok' }, VL.icon('check', 14), 'Concluída'));
      else if (atual) chips.appendChild(h('span', { class: 'chip rt-chip-aqui' }, 'Você está aqui'));
      chips.appendChild(h('span', { class: 'chip' }, VL.icon('relogio', 14), R.durTxt(R.semanas(e))));
      botaoConcluir.className = 'btn ' + (feita ? 'btn-ghost' : 'btn-primary');
      botaoConcluir.innerHTML = '';
      if (feita) botaoConcluir.appendChild(VL.icon('check', 18));
      botaoConcluir.appendChild(document.createTextNode(feita ? 'Etapa concluída (desfazer)' : 'Marcar etapa como concluída'));
      var total = (e.competencias || []).length, ok = R.competenciasFeitas(e);
      contador.textContent = total ? ok + ' de ' + total + ' competências marcadas' : '';
      dica.hidden = !(total && ok === total && !feita);
      if (!dica.hidden) dica.textContent = 'Todas as competências marcadas. Quando um instrutor ou comandante experiente confirmar, conclua a etapa.';
    }
    botaoConcluir.addEventListener('click', function () {
      var agora = !R.feita(e.id);
      VL.progress.etapa(e.id, agora);
      if (agora) VL.ui.toast('Etapa ' + e.n + ' concluída. ' + (i + 1 < n ? 'Próxima: ' + R.etapas()[i + 1].titulo + '.' : 'Você chegou ao fim do roteiro.'));
    });

    raiz.appendChild(h('header', { class: 'rt-pcab' },
      h('p', { class: 'rt-pn' }, 'Etapa ' + e.n + ' de ' + n),
      h('h2', { id: 'rt-pt', tabindex: '-1' }, e.titulo),
      chips,
      h('p', { class: 'rt-resumo-etapa' }, e.resumo)));

    estadoBox.appendChild(botaoConcluir);
    estadoBox.appendChild(contador);
    raiz.appendChild(estadoBox);
    raiz.appendChild(dica);

    raiz.appendChild(h('div', { class: 'rt-porque' }, h('h3', null, 'Por que importa'), h('p', { class: 'mb-0' }, e.porque)));
    (e.aviso || []).forEach(function (a) { raiz.appendChild(R.aviso(a)); });

    if (e.pre && e.pre.length) raiz.appendChild(sec('Antes de começar', R.lista(e.pre)));
    if (e.permite && e.permite.length) raiz.appendChild(sec(e.tipo === 'cha' ? 'O que esta habilitação permite' : 'O que a norma diz', R.lista(e.permite)));
    if (e.treino) raiz.appendChild(sec('Treinamento prático obrigatório', R.lista(e.treino)));
    if (e.calendario) raiz.appendChild(sec('Calendário da prova', R.lista(e.calendario)));
    if (e.docs && e.docs.length) raiz.appendChild(sec('Documentos', R.lista(e.docs), { fechada: e.tipo !== 'cha' ? false : true, contagem: e.docs.length }));
    if (e.prova && e.prova.length) raiz.appendChild(sec('A prova e depois dela', R.lista(e.prova), { fechada: true, contagem: e.prova.length }));
    (e.secoes || []).forEach(function (s) { raiz.appendChild(sec(s.titulo, R.lista(s.itens), { fechada: true, contagem: s.itens.length })); });

    raiz.appendChild(secCusto(e));

    var tempoCorpo = h('div');
    preencherTempo(tempoCorpo, e);
    raiz.appendChild(sec('Quanto tempo leva', tempoCorpo, { cls: 'rt-sec-tempo' }));

    /* experiência de mar */
    var mar = h('div');
    var pm = h('p', null, h('strong', null, e.mar.ref ? 'O que a norma pede: ' : 'Meta acumulada ao fim desta etapa: '), document.createTextNode(e.mar.texto.replace(/\.$/, '') + '. '));
    if (e.mar.ref) pm.appendChild(R.fonte(e.mar.ref));
    mar.appendChild(pm);
    mar.appendChild(R.aviso({ tipo: 'nota', titulo: 'Recomendação do app, não exigência legal', html: 'As metas de mar foram escolhidas pelo app, calibradas pelos critérios do RYA e da ASA. A NORMAM-211 exige a habilitação e a prova, e não pede milhas, dias ou noites de mar.', refs: ['normas-49'] }));
    if (e.bench && e.bench.itens.length) {
      mar.appendChild(h('details', { class: 'rt-ver', 'data-intl': 'on' }, h('summary', null, 'Referência do RYA e da ASA (trilha internacional)'), R.lista(e.bench.itens.map(function (x) { return { html: x.html, ref: x.ref }; }))));
    }
    raiz.appendChild(sec('Experiência de mar', mar));

    /* competências */
    if (e.competencias && e.competencias.length) {
      var ul = h('ul', { class: 'rt-checks' });
      e.competencias.forEach(function (c) {
        var chave = R.chave(e, c), id = 'rt-' + chave.replace(/\./g, '-');
        var cx = h('input', { type: 'checkbox', id: id, checked: R.feita(chave) });
        cx.addEventListener('change', function () { VL.progress.etapa(chave, cx.checked); });
        var li = h('li', null, cx, h('label', { for: id }, h('span', null, c.txt)));
        if (c.ref) li.lastChild.appendChild(R.fonte(c.ref));
        ul.appendChild(li);
      });
      raiz.appendChild(sec('Checklist de competências', [
        h('p', { class: 'small muted' }, 'Marque o que você realmente sabe fazer. O ideal é um instrutor ou comandante experiente confirmar. Fica salvo só neste aparelho.'), ul]));
    }

    /* links */
    var L = e.links || {}, links = h('div', { class: 'btn-row rt-links' });
    (L.curso || []).forEach(function (c) { links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link(c.rota) }, VL.icon('livro', 16), c.rotulo)); });
    if (L.simulado) links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link('simulados/' + L.simulado) }, VL.icon('prova', 16), 'Simulado: ' + (NOMES_SIM[L.simulado] || L.simulado)));
    if (L.flash) links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link('simulados/flashcards/' + L.flash) }, VL.icon('cartas', 16), 'Flashcards'));
    if (L.locais && L.locais.length) links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link('locais?' + R.consultaLocais(L.locais)) }, VL.icon('mapa', 16), 'Onde estudar e praticar'));
    if (e.tipo === 'cha') links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: '#/roteiro/agendar', onclick: function (ev) { ev.preventDefault(); R.rolarPara(VL.$('#rt-agendar')); } }, VL.icon('relogio', 16), 'Como agendar a prova'));
    var blocoLinks = [links];
    if (L.curso_id) {
      var rc = VL.progress.resumoCurso(L.curso_id);
      var frac = rc && rc.total ? rc.feitas / rc.total : 0;
      blocoLinks.unshift(h('div', { class: 'rt-curso-prog' }, h('span', { class: 'small' }, rc && rc.total ? 'Curso no app: ' + rc.feitas + ' de ' + rc.total + ' lições (' + VL.fmt.pct(frac) + ')' : 'Curso no app: ainda não aberto'), VL.ui.medidor(frac, true)));
    }
    raiz.appendChild(sec('Estude e pratique', blocoLinks));

    pintarEstado();
    return {
      raiz: raiz,
      atualizarEstado: pintarEstado,
      atualizarRitmo: function () { preencherTempo(tempoCorpo, e); pintarEstado(); },
    };
  };
})();
