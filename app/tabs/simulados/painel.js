/* Simulados: painel (#/simulados) com os níveis, o próximo passo sugerido, gráficos de desempenho e constância. */
(function () {
  'use strict';
  var h = VL.h;
  var S = VL.simulados = VL.simulados || {};

  function tile(rotulo, valor, sub) {
    return h('div', { class: 'sim-tile' }, h('p', { class: 'sim-tile-l' }, rotulo), h('p', { class: 'sim-tile-v' }, valor), sub ? h('p', { class: 'sim-tile-s' }, sub) : null);
  }

  function linhaAcao(icone, rotulo, rota, extra, desabilitado) {
    var conteudo = [VL.icon(icone, 20), h('span', { class: 'sim-acao-r' }, rotulo), extra != null ? h('span', { class: 'sim-acao-n' }, extra) : null];
    if (desabilitado) return h('li', null, h('span', { class: 'sim-acao', 'aria-disabled': 'true', title: desabilitado }, conteudo, h('span', { class: 'visually-hidden' }, ' (' + desabilitado + ')')));
    return h('li', null, h('a', { class: 'sim-acao', href: VL.link(rota) }, conteudo));
  }

  function cartaoNivel(n, banco, stats, temBaralho) {
    var r = S.resumoBanco(banco, stats);
    var ts = S.tentativas(n.id);
    var melhor = S.melhorNota(n.id);
    var art = h('article', { class: 'sim-nivel' + (n.oficial ? '' : ' sim-nivel-extra'), 'aria-labelledby': 'sn-' + n.id });
    art.appendChild(h('div', { class: 'sim-nivel-cab' },
      h('h3', { id: 'sn-' + n.id }, h('a', { href: VL.link('simulados/' + n.id) }, n.nome)),
      n.sigla ? h('span', { class: 'sim-sigla', title: 'Sigla da categoria' }, n.sigla) : null));
    var f = h('p', { class: 'sim-nivel-formato' });
    if (n.oficial) {
      f.appendChild(document.createTextNode('Prova oficial: ' + n.n + ' questões em até ' + n.tempo));
      f.appendChild(S.fonte(n.fQuestoes, 'fonte'));
      f.appendChild(document.createTextNode(' · aprova com ' + VL.fmt.num(n.nota, 1)));
      f.appendChild(S.fonte(n.fNota, 'fonte'));
    } else f.textContent = 'Formato do app: ' + n.n + ' questões em ' + n.minutos + ' minutos.';
    art.appendChild(f);

    if (!r.total) {
      art.appendChild(h('p', { class: 'sim-nivel-vazio' }, 'Banco de questões em preparação. Enquanto isso, estude as lições do curso.'));
      var c = S.cursoTab(n);
      art.appendChild(h('ul', { class: 'sim-acoes' },
        c ? linhaAcao('livro', 'Abrir o curso', c) : null,
        linhaAcao('cartas', 'Flashcards', 'simulados/flashcards/' + n.id, null, temBaralho ? null : 'baralho em preparação')));
      return art;
    }
    art.appendChild(h('dl', { class: 'sim-nums' },
      h('div', null, h('dt', null, 'No banco'), h('dd', null, String(r.total))),
      h('div', null, h('dt', null, 'Melhor nota'), h('dd', null, melhor == null ? '—' : VL.fmt.num(melhor, 1))),
      h('div', null, h('dt', null, 'Acertos'), h('dd', null, r.frac == null ? '—' : VL.fmt.pct(r.frac)))));
    art.appendChild(h('div', { class: 'sim-cobertura' },
      h('p', { class: 'small muted mb-0' }, 'Você já viu ' + r.vistas + ' de ' + r.total + ' questões'),
      VL.ui.medidor(r.vistas / r.total)));
    var ult = ts.slice(-3).reverse();
    if (ult.length) {
      art.appendChild(h('div', { class: 'sim-ultimas' }, h('p', { class: 'sim-mini-t' }, 'Últimas tentativas'),
        h('ul', null, ult.map(function (t) {
          return h('li', null, h('span', { class: 'sim-ult-d' }, S.dataCurta(t.data)), h('span', { class: 'sim-ult-m' }, t.modo === 'prova' ? 'Prova' : 'Prática'),
            h('span', { class: 'sim-ult-v' }, t.modo === 'prova' ? 'nota ' + VL.fmt.num(S.notaDe(t), 1) : t.acertos + ' de ' + t.total));
        }))));
    } else art.appendChild(h('p', { class: 'small muted mb-0 sim-ultimas' }, 'Nenhuma tentativa ainda.'));

    var acoes = h('div', { class: 'sim-nivel-acoes' },
      h('a', { class: 'btn btn-primary sim-btn-prova', href: VL.link('simulados/' + n.id + '/prova') }, VL.icon('relogio', 18), n.oficial ? 'Prova no formato oficial' : 'Simulado cronometrado'),
      h('ul', { class: 'sim-acoes' },
        linhaAcao('alvo', 'Praticar por assunto', 'simulados/' + n.id + '?ir=pratica'),
        linhaAcao('reiniciar', 'Revisar as que errei', 'simulados/' + n.id + '/erradas', r.erradas || null, r.erradas ? null : 'nenhuma errada agora'),
        linhaAcao('cartas', 'Flashcards', 'simulados/flashcards/' + n.id, null, temBaralho ? null : 'baralho em preparação')));
    art.appendChild(acoes);
    return art;
  }

  function proximoPasso(bancos, stats, srs) {
    var devidas = srs.reduce(function (s, d) { return s + VL.srs.stats(d).devidas; }, 0);
    if (devidas) return { txt: 'Você tem ' + S.plural(devidas, 'cartão', 'cartões') + ' de flashcards para revisar hoje. Leva poucos minutos e segura o que você já aprendeu.', rotulo: 'Revisar flashcards', rota: 'simulados/flashcards' };
    var todas = VL.progress.tentativas();
    var comBanco = S.NIVEIS.filter(function (n) { return bancos[n.id].length; });
    if (!comBanco.length) {
      var curso = S.cursoTab(S.nivel('arrais'));
      return curso ? { txt: 'Os bancos de questões ainda estão em preparação. Enquanto isso, comece pelas lições do curso de Arrais-Amador.', rotulo: 'Abrir o curso de Arrais-Amador', rota: curso } : null;
    }
    if (!todas.length) return { txt: 'Comece com uma prática curta: 10 questões de ' + comBanco[0].nome + ', com a explicação logo depois de cada resposta.', rotulo: 'Começar a prática', rota: 'simulados/' + comBanco[0].id + '/pratica?n=10' };
    var maisErros = null;
    comBanco.forEach(function (n) { var r = S.resumoBanco(bancos[n.id], stats); if (r.erradas && (!maisErros || r.erradas > maisErros.r.erradas)) maisErros = { n: n, r: r }; });
    if (maisErros && maisErros.r.erradas >= 5) return { txt: 'Refaça as ' + maisErros.r.erradas + ' questões de ' + maisErros.n.nome + ' que você errou da última vez. Errar e revisar é o jeito mais rápido de aprender.', rotulo: 'Revisar as que errei', rota: 'simulados/' + maisErros.n.id + '/erradas' };
    var ult = S.nivel(todas[todas.length - 1].nivel);
    if (ult && ult.oficial && S.melhorNota(ult.id) == null && bancos[ult.id].length >= 20) return { txt: 'Você já praticou ' + ult.nome + '. Experimente a prova no formato oficial, com relógio e correção no fim.', rotulo: 'Fazer a prova', rota: 'simulados/' + ult.id + '/prova' };
    if (maisErros) return { txt: 'Faltam ' + S.plural(maisErros.r.erradas, 'questão errada', 'questões erradas') + ' para revisar em ' + maisErros.n.nome + '.', rotulo: 'Revisar as que errei', rota: 'simulados/' + maisErros.n.id + '/erradas' };
    if (ult && bancos[ult.id].length) {
      var fraco = S.temas(bancos[ult.id], stats).filter(function (t) { return t.v; }).sort(function (a, b) { return a.frac - b.frac; })[0];
      if (fraco && fraco.frac < 0.8) return { txt: 'Seu assunto mais fraco em ' + ult.nome + ' é ' + fraco.tema + ' (' + VL.fmt.pct(fraco.frac) + ' de acertos). Pratique só ele.', rotulo: 'Praticar este assunto', rota: 'simulados/' + ult.id + '/pratica?tema=' + fraco.slug + '&n=10' };
    }
    return null;
  }

  function secaoDesempenho(bancos, stats) {
    var sec = h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-desemp' }, h('h2', { id: 'sim-desemp' }, 'Seu desempenho'));
    var niveis = S.NIVEIS.filter(function (n) { return bancos[n.id].length || VL.progress.tentativas(n.id).length; });
    if (!niveis.length) {
      sec.appendChild(S.vazio('Os gráficos aparecem quando houver questões', 'Assim que os bancos de questões forem publicados, sua evolução e seus assuntos mais fracos aparecem aqui.'));
      return sec;
    }
    var todas = VL.progress.tentativas();
    var salvo = VL.store.get('simulados.grafNivel', null);
    var atual = niveis.filter(function (n) { return n.id === salvo; })[0] ||
      (todas.length ? niveis.filter(function (n) { return n.id === todas[todas.length - 1].nivel; })[0] : null) || niveis[0];
    var g1 = S.painelGrafico('Evolução das notas', 'Cada ponto é uma tentativa terminada. Nota de 0 a 10.');
    var g2 = S.painelGrafico('Aproveitamento por assunto', 'Do mais fraco, em cima, ao mais forte.');
    function desenhar(id) {
      [g1.corpo, g2.corpo].forEach(function (c) {
        VL.$$('canvas', c).forEach(function (cv) { var ch = window.Chart && window.Chart.getChart(cv); if (ch) ch.destroy(); });
        c.innerHTML = '';
      });
      var n = S.nivel(id);
      var acoes = bancos[id].length ? [S.botaoLink('Praticar 10 questões', 'simulados/' + id + '/pratica?n=10', 'btn-primary')] : null;
      S.grafEvolucao(g1.corpo, id, { acoes: acoes });
      var temas = bancos[id].length ? S.temas(bancos[id], stats) : S.temasDeTentativas(id);
      S.grafTemas(g2.corpo, temas, { acoes: acoes });
      g2.raiz.querySelector('.sim-graf-t').textContent = 'Aproveitamento por assunto: ' + n.nome;
      g1.raiz.querySelector('.sim-graf-t').textContent = 'Evolução das notas: ' + n.nome;
    }
    sec.appendChild(h('div', { class: 'sim-filtro' }, h('span', { class: 'sim-filtro-l', id: 'sim-filtro-l' }, 'Nível'),
      S.segmentado('Nível dos gráficos', niveis.map(function (n) { return { id: n.id, rotulo: n.curto }; }), atual.id, function (id) {
        VL.store.set('simulados.grafNivel', id); desenhar(id);
      })));
    sec.appendChild(h('div', { class: 'grid-2 sim-graficos' }, g1.raiz, g2.raiz));
    sec._desenhar = function () { desenhar(atual.id); };
    return sec;
  }

  function secaoConstancia(srs, temBaralhos) {
    var sec = h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-const' }, h('h2', { id: 'sim-const' }, 'Constância'));
    var seq = VL.progress.sequencia(), melhor = S.melhorSequencia();
    var mapa = S.mapaCalor();
    var p1 = h('figure', { class: 'sim-graf sim-dias' },
      h('figcaption', null, h('span', { class: 'sim-graf-t' }, 'Dias de estudo'), h('span', { class: 'sim-graf-l' }, 'Conta lições concluídas, flashcards e simulados.')),
      h('div', { class: 'sim-seq' },
        h('p', { class: 'sim-seq-v' }, String(seq)),
        h('div', null, h('p', { class: 'sim-seq-l' }, seq === 1 ? 'dia seguido' : 'dias seguidos'),
          h('p', { class: 'small muted mb-0' }, seq ? 'Melhor sequência: ' + S.plural(melhor, 'dia', 'dias') + '.' : 'Estude hoje para começar uma sequência.'))),
      h('div', { class: 'sim-calor-wrap' }, mapa.svg),
      h('div', { class: 'spread sim-calor-rodape' }, h('p', { class: 'small muted mb-0' }, S.plural(mapa.ativos, 'dia', 'dias') + ' com estudo nas últimas 12 semanas'), mapa.legenda));
    var g = S.painelGrafico('Revisões de flashcards', 'Cartões que voltam em cada um dos próximos 7 dias.');
    if (!temBaralhos) g.corpo.appendChild(S.vazio('Baralhos em preparação', 'Os flashcards de cada nível estão sendo escritos. Quando chegarem, a agenda de revisões aparece aqui.'));
    else {
      var serie = [0, 0, 0, 0, 0, 0, 0];
      srs.forEach(function (d) { VL.srs.previsao(d, 7).forEach(function (v, i) { serie[i] += v; }); });
      S.grafPrevisao(g.corpo, serie, { acoes: [S.botaoLink('Abrir os flashcards', 'simulados/flashcards', 'btn-primary', 'cartas')] });
      if (serie.some(Boolean)) g.corpo.appendChild(h('p', { class: 'small mb-0 sim-graf-nota' }, h('a', { href: VL.link('simulados/flashcards') }, 'Ver todos os baralhos')));
    }
    sec.appendChild(h('div', { class: 'grid-2 sim-graficos' }, p1, g.raiz));
    return sec;
  }

  function calloutProvas() {
    var corpo = h('div');
    var p1 = h('p', null, 'As provas de Arrais-Amador e de Mestre-Amador não são publicadas: a norma manda destruí-las logo depois da correção, para proteger o banco de questões da Marinha.');
    p1.appendChild(S.fonte('normas-101', 'fonte'));
    corpo.appendChild(p1);
    corpo.appendChild(h('p', null, 'Por isso o nosso banco é próprio: questões escritas e revisadas pela comunidade a partir do programa oficial (NORMAM-211, Anexo 5-A), cada uma com explicação e referência. Ele treina o conteúdo, não decora a prova.'));
    var p3 = h('p', null, 'Já as provas de Capitão-Amador são publicadas pela DPC, com gabarito.');
    p3.appendChild(S.fonte('normas-90', 'fonte'));
    p3.appendChild(document.createTextNode(' Depois de treinar aqui, resolva as provas recentes em papel, com o relógio marcando 4 horas.'));
    corpo.appendChild(p3);
    corpo.appendChild(h('p', { class: 'mb-0' }, h('a', { class: 'btn btn-ghost btn-externo', href: S.URL_CPA, target: '_blank', rel: 'noopener' }, 'Provas de Capitão-Amador na DPC', VL.icon('externo', 16))));
    return VL.ui.callout('nota', 'Sobre as provas oficiais', corpo);
  }

  S.painel = function (raiz) {
    S.titulo('Simulados e flashcards');
    raiz.appendChild(VL.ui.cabecalho('Simulados e flashcards', 'Treine no formato das provas da Marinha, revise o que errou e fixe os termos com flashcards. Seu progresso fica salvo só neste aparelho.'));
    var carregando = VL.ui.carregando('Abrindo os bancos de questões…');
    raiz.appendChild(carregando);
    return Promise.all([S.bancos(), S.baralhos()]).then(function (res) {
      if (!raiz.isConnected) return;
      carregando.remove();
      var bancos = res[0], itens = res[1];
      var stats = VL.progress.todasQuestaoStats();
      var srs = S.baralhosSRS(itens);
      var grupos = S.porNivel(itens).grupos;

      /* resumo */
      var tot = { total: 0, vistas: 0, respostas: 0, acertos: 0 };
      S.NIVEIS.forEach(function (n) { var r = S.resumoBanco(bancos[n.id], stats); tot.total += r.total; tot.vistas += r.vistas; tot.respostas += r.respostas; tot.acertos += r.acertos; });
      var fs = srs.reduce(function (a, d) { var s = VL.srs.stats(d); a.devidas += s.devidas; a.novas += s.novas; return a; }, { devidas: 0, novas: 0 });
      var seq = VL.progress.sequencia();
      raiz.appendChild(h('section', { class: 'sim-resumo', 'aria-label': 'Resumo do seu estudo' },
        tile('Questões já vistas', String(tot.vistas), tot.total ? 'de ' + tot.total + ' nos bancos' : 'bancos em preparação'),
        tile('Aproveitamento geral', tot.respostas ? VL.fmt.pct(tot.acertos / tot.respostas) : '—', tot.respostas ? tot.acertos + ' acertos em ' + tot.respostas + ' respostas' : 'responda para medir'),
        tile('Sequência de estudo', S.plural(seq, 'dia', 'dias'), seq ? 'sem falhar um dia' : 'estude hoje para começar'),
        tile('Flashcards para hoje', String(fs.devidas), itens.length ? S.plural(fs.novas, 'cartão novo', 'cartões novos') + ' no total' : 'baralhos em preparação')));

      var passo = proximoPasso(bancos, stats, srs);
      if (passo) raiz.appendChild(h('div', { class: 'sim-proximo' },
        h('div', null, h('p', { class: 'sim-proximo-t' }, 'Próximo passo sugerido'), h('p', { class: 'mb-0' }, passo.txt)),
        S.botaoLink(passo.rotulo, passo.rota, 'btn-primary')));

      raiz.appendChild(h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-oficiais' },
        h('h2', { id: 'sim-oficiais' }, 'Provas da Marinha'),
        h('div', { class: 'sim-niveis' }, S.NIVEIS.filter(function (n) { return n.oficial; }).map(function (n) { return cartaoNivel(n, bancos[n.id], stats, !!grupos[n.id]); }))));
      raiz.appendChild(calloutProvas());
      raiz.appendChild(h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-extras' },
        h('h2', { id: 'sim-extras' }, 'Outros temas'),
        h('p', { class: 'muted sim-secao-lead' }, 'Questões para fixar o conteúdo dos cursos de vela, travessia e rádio. Não seguem uma prova oficial.'),
        h('div', { class: 'sim-niveis' }, S.NIVEIS.filter(function (n) { return !n.oficial; }).map(function (n) { return cartaoNivel(n, bancos[n.id], stats, !!grupos[n.id]); }))));

      var des = secaoDesempenho(bancos, stats);
      raiz.appendChild(des);
      raiz.appendChild(secaoConstancia(srs, itens.length > 0));
      raiz.appendChild(VL.ui.avisoLegal());
      if (des._desenhar) des._desenhar();

      /* a trilha internacional muda o que conta: redesenha a página */
      var intl = VL.settings.get('intl');
      var off = VL.on('settings', function (s) { if (s.intl !== intl) { intl = s.intl; VL.render(); } });
      VL.aoSair(off);
    });
  };
})();
