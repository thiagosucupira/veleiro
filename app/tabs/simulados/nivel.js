/* Simulados: página do nível (#/simulados/<nivel>), prova cronometrada, prática por assunto,
   revisão das questões erradas e histórico de tentativas. */
(function () {
  'use strict';
  var h = VL.h;
  var S = VL.simulados = VL.simulados || {};
  var QTDS = [10, 20, 40];

  function trilhaNivel(n, atual) {
    var itens = [{ rotulo: 'Simulados', rota: 'simulados' }, { rotulo: n.nome, rota: 'simulados/' + n.id }];
    if (atual) itens.push({ rotulo: atual });
    return S.trilha(itens);
  }
  function rotaPratica(n, cfg) {
    var q = [];
    if (cfg.temas && cfg.temas.length) q.push('tema=' + cfg.temas.map(encodeURIComponent).join(','));
    q.push('n=' + cfg.n);
    if (cfg.so && cfg.so !== 'todas') q.push('so=' + cfg.so);
    return 'simulados/' + n.id + '/pratica?' + q.join('&');
  }
  function filtrar(banco, stats, cfg, temas) {
    var slugs = cfg.temas && cfg.temas.length ? cfg.temas : null;
    return S.visiveis(banco).filter(function (q) {
      if (slugs && slugs.indexOf(VL.slug(q.tema || 'Geral')) < 0) return false;
      var s = stats[q.id];
      if (cfg.so === 'ineditas') return !s;
      if (cfg.so === 'erradas') return s && s.u === 0;
      return true;
    });
  }

  /* ---------- Formulário "Praticar por assunto" ---------- */
  function formPratica(n, banco, stats, temas) {
    var chave = 'simulados.pratica.' + n.id;
    var salvo = VL.store.get(chave, null) || {};
    var existentes = temas.map(function (t) { return t.slug; });
    var cfg = {
      temas: (salvo.temas || []).filter(function (s) { return existentes.indexOf(s) >= 0; }),
      n: QTDS.indexOf(salvo.n) >= 0 ? salvo.n : 20,
      so: ['todas', 'ineditas', 'erradas'].indexOf(salvo.so) >= 0 ? salvo.so : 'todas',
    };
    var sec = h('section', { class: 'panel sim-pratica', id: 'pratica', 'aria-labelledby': 'sim-pratica-t', tabindex: '-1' },
      h('h2', { id: 'sim-pratica-t' }, 'Praticar por assunto'),
      h('p', { class: 'muted' }, 'Uma questão por vez, com a explicação logo depois de responder. Escolha um ou mais assuntos, ou deixe todos.'));
    var chips = h('div', { class: 'chip-list sim-chips' });
    var todosChip = h('button', { type: 'button', class: 'chip sim-chip', 'aria-pressed': String(!cfg.temas.length), onclick: function () { cfg.temas = []; atualizar(); } },
      h('span', null, 'Todos os assuntos'), h('span', { class: 'sim-chip-n' }, String(S.visiveis(banco).length)));
    chips.appendChild(todosChip);
    var botoesTema = temas.map(function (t) {
      var pct = t.frac == null ? 'sem respostas' : VL.fmt.pct(t.frac) + ' de acertos';
      var b = h('button', { type: 'button', class: 'chip sim-chip', 'aria-pressed': 'false', 'data-slug': t.slug,
        'aria-label': t.tema + ': ' + S.plural(t.total, 'questão', 'questões') + ', ' + pct,
        onclick: function () {
          var i = cfg.temas.indexOf(t.slug);
          if (i >= 0) cfg.temas.splice(i, 1); else cfg.temas.push(t.slug);
          atualizar();
        } },
        h('span', null, t.tema), h('span', { class: 'sim-chip-n' }, String(t.total)),
        t.frac == null ? null : h('span', { class: 'sim-chip-p', 'data-fraco': t.frac < 0.5 ? '1' : '0' }, VL.fmt.pct(t.frac)));
      chips.appendChild(b);
      return b;
    });
    sec.appendChild(h('fieldset', { class: 'sim-fs' }, h('legend', null, 'Assuntos'), chips,
      h('p', { class: 'small muted mb-0 sim-chips-leg' }, 'Em cada assunto: número de questões e, se você já respondeu, a porcentagem de acertos.')));
    sec.appendChild(h('div', { class: 'sim-pratica-opcoes' },
      h('div', { class: 'sim-opcao' }, h('p', { class: 'field-label', id: 'sim-qtd-l' }, 'Quantidade'),
        S.segmentado('Quantidade de questões', QTDS.map(function (q) { return { id: q, rotulo: String(q) }; }), cfg.n, function (v) { cfg.n = v; atualizar(); })),
      h('div', { class: 'sim-opcao' }, h('p', { class: 'field-label' }, 'Quais questões'),
        S.segmentado('Quais questões', [{ id: 'todas', rotulo: 'Todas' }, { id: 'ineditas', rotulo: 'Só inéditas' }, { id: 'erradas', rotulo: 'Só as que errei' }], cfg.so, function (v) { cfg.so = v; atualizar(); }))));
    var disp = h('p', { class: 'sim-disp', role: 'status', 'aria-live': 'polite' });
    var comecar = h('button', { type: 'button', class: 'btn btn-primary', onclick: function () {
      VL.store.set(chave, cfg);
      VL.go(rotaPratica(n, cfg));
    } }, VL.icon('play', 18), 'Começar a prática');
    sec.appendChild(h('div', { class: 'sim-pratica-fim' }, disp, comecar));
    function atualizar() {
      todosChip.setAttribute('aria-pressed', String(!cfg.temas.length));
      botoesTema.forEach(function (b) { b.setAttribute('aria-pressed', String(cfg.temas.indexOf(b.getAttribute('data-slug')) >= 0)); });
      var qtd = filtrar(banco, stats, cfg, temas).length;
      var vai = Math.min(qtd, cfg.n);
      comecar.disabled = !qtd;
      if (!qtd) disp.textContent = cfg.so === 'ineditas' ? 'Você já viu todas as questões com esses filtros. Escolha "Todas".' : (cfg.so === 'erradas' ? 'Nenhuma questão errada com esses filtros.' : 'Nenhuma questão com esses filtros.');
      else disp.textContent = S.plural(qtd, 'questão disponível', 'questões disponíveis') + '. A prática terá ' + S.plural(vai, 'questão', 'questões') + '.';
    }
    atualizar();
    return sec;
  }

  /* ---------- Histórico ---------- */
  function historico(n) {
    var ts = S.tentativas(n.id).reverse();
    var sec = h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-hist-t' }, h('h2', { id: 'sim-hist-t' }, 'Histórico de tentativas'));
    if (!ts.length) { sec.appendChild(h('p', { class: 'muted' }, 'Suas provas e práticas terminadas aparecem aqui, da mais recente para a mais antiga.')); return sec; }
    var LIM = 12;
    var tb = h('tbody', { role: 'rowgroup' });
    function linhas(todas) {
      tb.innerHTML = '';
      (todas ? ts : ts.slice(0, LIM)).forEach(function (t) {
        var nota = t.modo === 'prova';
        tb.appendChild(h('tr', { role: 'row' },
          h('td', { role: 'cell', class: 'sim-td-data' }, S.dataHora(t.data)),
          h('td', { role: 'cell', class: 'sim-td-modo' }, nota ? (n.oficial ? 'Prova oficial' : 'Simulado') : 'Prática'),
          h('td', { role: 'cell', class: 'sim-td-res' }, nota ? h('span', { class: 'sim-res', 'data-ok': t.aprovado ? '1' : '0' }, VL.icon(t.aprovado ? 'check' : 'fechar', 16), S.resultado(t)) : S.resultado(t)),
          h('td', { role: 'cell', class: 'sim-td-num' }, h('span', { class: 'visually-hidden' }, 'Duração: '), S.duracao(t.duracaoSeg))));
      });
    }
    linhas(false);
    sec.appendChild(h('div', { class: 'table-wrap sim-hist-wrap' }, h('table', { class: 'tabela sim-hist', role: 'table', 'aria-label': 'Histórico de tentativas de ' + n.nome },
      h('thead', { role: 'rowgroup' }, h('tr', { role: 'row' }, ['Data', 'Modo', 'Nota ou acertos', 'Duração'].map(function (t) { return h('th', { scope: 'col', role: 'columnheader' }, t); }))), tb)));
    if (ts.length > LIM) {
      var mais = h('button', { type: 'button', class: 'btn btn-ghost', 'aria-expanded': 'false', onclick: function () {
        var aberto = mais.getAttribute('aria-expanded') === 'true';
        linhas(!aberto); mais.setAttribute('aria-expanded', String(!aberto));
        mais.textContent = aberto ? 'Mostrar todas as ' + ts.length : 'Mostrar só as ' + LIM + ' mais recentes';
      } }, 'Mostrar todas as ' + ts.length);
      sec.appendChild(mais);
    }
    return sec;
  }

  function cartaoModo(icone, titulo, texto, acao) {
    return h('article', { class: 'sim-modo' }, h('div', { class: 'sim-modo-ic' }, VL.icon(icone, 22)), h('h3', null, titulo), h('p', { class: 'muted' }, texto), acao);
  }

  /* ---------- Página do nível ---------- */
  S.paginaNivel = function (raiz, n, rota) {
    S.titulo('Simulados de ' + n.nome);
    raiz.appendChild(trilhaNivel(n));
    var carregando = VL.ui.carregando('Abrindo o banco de questões…');
    raiz.appendChild(carregando);
    return Promise.all([S.banco(n.id), S.baralhos()]).then(function (res) {
      if (!raiz.isConnected) return;
      carregando.remove();
      var banco = res[0], decks = S.porNivel(res[1]).grupos[n.id] || [];
      var stats = VL.progress.todasQuestaoStats();
      var r = S.resumoBanco(banco, stats);
      var temas = S.temas(banco, stats);
      var lead = n.oficial ? 'Questões comentadas do nosso banco, escritas a partir do programa oficial da prova.' : 'Questões comentadas para fixar o conteúdo do curso. Este simulado usa um formato do app, não uma prova oficial.';
      if (r.total) lead += ' ' + S.plural(r.total, 'questão', 'questões') + ' em ' + S.plural(temas.length, 'assunto', 'assuntos') + '.';
      raiz.appendChild(VL.ui.cabecalho(n.nome, VL.esc(lead)));

      if (n.oficial) {
        var ficha = h('section', { class: 'sim-ficha-box', 'aria-labelledby': 'sim-ficha-t' }, h('h2', { id: 'sim-ficha-t' }, 'Como é a prova oficial'), S.fichaOficial(n, true));
        var nota = h('p', { class: 'small muted mb-0' });
        if (n.id === 'capitao') {
          nota.appendChild(document.createTextNode('A DPC publica as provas anteriores com gabarito. Resolva também as mais recentes.'));
          nota.appendChild(S.fonte('normas-90', 'fonte'));
          nota.appendChild(document.createTextNode(' '));
          nota.appendChild(h('a', { href: S.URL_CPA, target: '_blank', rel: 'noopener' }, 'Abrir a página das provas'));
        } else {
          nota.appendChild(document.createTextNode('As provas reais deste nível não são publicadas: são destruídas depois da correção. Por isso o nosso banco é próprio.'));
          nota.appendChild(S.fonte('normas-101', 'fonte'));
        }
        ficha.appendChild(nota);
        raiz.appendChild(ficha);
      }
      if (!r.total) {
        raiz.appendChild(S.vazioBanco(n));
        if (decks.length) raiz.appendChild(h('p', { class: 'mt-4' }, S.botaoLink('Estudar os flashcards de ' + n.nome, 'simulados/flashcards/' + n.id, 'btn-ghost', 'cartas')));
        raiz.appendChild(historico(n));
        raiz.appendChild(VL.ui.avisoLegal());
        return;
      }

      /* modos */
      var srsDeck = decks.length ? S.juntar(n.id, decks) : null;
      var fs = srsDeck ? VL.srs.stats(srsDeck) : null;
      raiz.appendChild(h('section', { class: 'sim-secao sim-secao-1', 'aria-labelledby': 'sim-modos' }, h('h2', { id: 'sim-modos', class: 'visually-hidden' }, 'Modos de estudo'),
        h('div', { class: 'sim-modos' },
          cartaoModo('relogio', n.oficial ? 'Prova no formato oficial' : 'Simulado cronometrado',
            Math.min(n.n, r.total) + ' questões sorteadas equilibrando os assuntos, ' + S.horas(n.minutos) + ' no relógio e correção comentada no fim.',
            S.botaoLink('Ver instruções e começar', 'simulados/' + n.id + '/prova', 'btn-primary')),
          cartaoModo('reiniciar', 'Revisar as que errei',
            r.erradas ? S.plural(r.erradas, 'questão', 'questões') + ' com erro na última vez que você respondeu. Acertou, ela sai da lista.' : 'Nenhuma questão errada agora. As que você errar aparecem aqui para revisar.',
            r.erradas ? S.botaoLink('Revisar ' + S.plural(r.erradas, 'questão', 'questões'), 'simulados/' + n.id + '/erradas', 'btn-ghost') : h('button', { type: 'button', class: 'btn btn-ghost', disabled: true }, 'Nada para revisar')),
          cartaoModo('cartas', 'Flashcards',
            fs ? fs.total + ' cartões: ' + fs.devidas + ' para revisar hoje e ' + fs.novas + ' novos.' : 'O baralho deste nível ainda está em preparação.',
            fs ? S.botaoLink('Estudar flashcards', 'simulados/flashcards/' + n.id, fs.devidas ? 'btn-primary' : 'btn-ghost') : h('button', { type: 'button', class: 'btn btn-ghost', disabled: true }, 'Em preparação')))));

      var form = formPratica(n, banco, stats, temas);
      raiz.appendChild(form);

      /* desempenho */
      var g1 = S.painelGrafico('Evolução das notas', 'Cada ponto é uma tentativa terminada. Nota de 0 a 10.');
      var g2 = S.painelGrafico('Aproveitamento por assunto', 'Do mais fraco, em cima, ao mais forte.');
      raiz.appendChild(h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-des-n' }, h('h2', { id: 'sim-des-n' }, 'Seu desempenho'),
        h('div', { class: 'grid-2 sim-graficos' }, g1.raiz, g2.raiz)));
      raiz.appendChild(historico(n));
      raiz.appendChild(VL.ui.avisoLegal());
      S.grafEvolucao(g1.corpo, n.id);
      S.grafTemas(g2.corpo, temas);

      if (rota.query.ir === 'pratica') setTimeout(function () { if (form.isConnected) { form.scrollIntoView({ block: 'start', behavior: S._reduzMovimento() ? 'auto' : 'smooth' }); form.focus({ preventScroll: true }); } }, 60);
      var intl = VL.settings.get('intl');
      var off = VL.on('settings', function (s) { if (s.intl !== intl) { intl = s.intl; VL.render(); } });
      VL.aoSair(off);
    });
  };

  /* ---------- Prova cronometrada ---------- */
  S.prova = function (raiz, n) {
    var nomeModo = n.oficial ? 'Prova no formato oficial' : 'Simulado cronometrado';
    S.titulo(nomeModo + ': ' + n.nome);
    raiz.appendChild(trilhaNivel(n, n.oficial ? 'Prova' : 'Simulado'));
    var carregando = VL.ui.carregando();
    raiz.appendChild(carregando);
    return S.banco(n.id).then(function (banco) {
      if (!raiz.isConnected) return;
      carregando.remove();
      var vis = S.visiveis(banco);
      if (!vis.length) { raiz.appendChild(VL.ui.cabecalho(nomeModo, VL.esc(n.nome))); raiz.appendChild(S.vazioBanco(n)); return; }
      var qtd = Math.min(n.n, vis.length);
      var tela = h('div', { class: 'sim-instrucoes' });
      raiz.appendChild(tela);
      tela.appendChild(VL.ui.cabecalho(nomeModo, VL.esc(n.nome + ' · ' + S.plural(qtd, 'questão', 'questões') + ' · ' + S.horas(n.minutos))));
      tela.appendChild(h('div', { class: 'sim-placa', role: 'group', 'aria-label': 'Resumo do simulado' },
        h('div', null, h('p', { class: 'sim-placa-v' }, String(qtd)), h('p', { class: 'sim-placa-l' }, 'questões')),
        h('div', null, h('p', { class: 'sim-placa-v' }, n.minutos >= 60 ? (n.minutos / 60) + ' h' : n.minutos + ' min'), h('p', { class: 'sim-placa-l' }, 'no relógio')),
        h('div', null, h('p', { class: 'sim-placa-v' }, VL.fmt.num(n.nota, 1)), h('p', { class: 'sim-placa-l' }, 'nota para aprovar'))));
      var lista = h('ul', { class: 'sim-regras' },
        h('li', null, qtd + ' questões sorteadas do nosso banco, equilibrando os assuntos.' + (qtd < n.n ? ' O banco deste nível ainda tem só ' + vis.length + ' questões; ' + (n.oficial ? 'a prova real tem ' + n.n + '.' : 'o simulado completo tem ' + n.n + '.') : '')),
        h('li', null, 'O relógio começa em ' + S.horas(n.minutos) + ' e não para. Quando zerar, a prova é entregue sozinha.'),
        h('li', null, 'Use o mapa numerado para ir e voltar entre as questões. Você pode mudar respostas até entregar. Questão em branco conta como errada.'),
        h('li', null, 'No fim: nota de 0 a 10, desempenho por assunto e a correção comentada de cada questão.'),
        h('li', null, 'Sair desta página ou recarregar cancela a prova. Ela não entra no histórico.'));
      tela.appendChild(h('section', { 'aria-labelledby': 'sim-regras-t' }, h('h2', { id: 'sim-regras-t', class: 'sim-h2' }, 'Como funciona este simulado'), lista));
      if (n.oficial) {
        var leve = h('ul', { class: 'sim-materiais' }, n.materiais.map(function (m) { return h('li', null, m); }));
        var fonteM = h('p', { class: 'small muted' }, 'Fonte:');
        fonteM.appendChild(S.fonte(n.fMateriais));
        tela.appendChild(h('section', { class: 'sim-ficha-box', 'aria-labelledby': 'sim-leve-t' }, h('h2', { id: 'sim-leve-t', class: 'sim-h2' }, 'Na prova real, o candidato leva'), leve, fonteM,
          n.id === 'arrais' ? null : h('p', { class: 'small mb-0' }, 'Treine com o mesmo material de desenho sobre a mesa, para chegar acostumado.')));
        if (n.id === 'mestre') {
          var totCarta = S.questoesCarta(n, vis).length;
          var nCarta = vis.length <= n.n ? totCarta : Math.min(n.carta.n, totCarta); /* banco pequeno: entram todas */
          var carta = h('p', { class: 'mb-0' }, 'Na prova real, quatro das 40 questões usam carta náutica.');
          carta.appendChild(S.fonte('normas-92', 'fonte'));
          carta.appendChild(document.createTextNode(nCarta
            ? ' Neste simulado, ' + (nCarta === 1 ? 'uma questão é um problema' : nCarta + ' questões são problemas') + ' de carta, com todos os dados no enunciado. Tenha papel, régua e compasso por perto.'
            : ' O nosso banco ainda não tem problemas de carta; treine a plotagem nas lições de navegação do curso.'));
          if (!nCarta && S.cursoTab(n)) { carta.appendChild(document.createTextNode(' ')); carta.appendChild(h('a', { href: VL.link(n.curso) }, 'Abrir o curso de ' + n.nome)); }
          tela.appendChild(VL.ui.callout('nota', 'Questões com carta náutica', carta));
        }
        if (n.id === 'capitao') {
          var pub = h('p', { class: 'mb-0' }, 'A DPC publica as provas anteriores de Capitão-Amador com gabarito.');
          pub.appendChild(S.fonte('normas-90', 'fonte'));
          pub.appendChild(document.createTextNode(' Depois deste simulado, resolva uma prova recente em papel, com o mesmo material e 4 horas no relógio. '));
          pub.appendChild(h('a', { href: S.URL_CPA, target: '_blank', rel: 'noopener' }, 'Abrir as provas na DPC'));
          tela.appendChild(VL.ui.callout('nota', 'Pratique também com as provas oficiais', pub));
        }
        tela.appendChild(VL.ui.callout('dica', 'Treine como no dia', 'Faça a prova de uma vez, sem consultar o curso nem o celular. O objetivo é descobrir o que você sabe de verdade.'));
      } else {
        tela.appendChild(VL.ui.callout('nota', 'Formato do app', 'Este tema não tem um formato oficial de prova. O simulado de ' + n.n + ' questões em ' + n.minutos + ' minutos serve para treinar sob tempo e achar os pontos fracos.'));
      }
      var comecar = h('button', { type: 'button', class: 'btn btn-primary sim-btn-grande' }, VL.icon('play', 18), n.oficial ? 'Começar a prova' : 'Começar o simulado');
      tela.appendChild(h('div', { class: 'btn-row mt-6' }, comecar, S.botaoLink('Voltar', 'simulados/' + n.id, 'btn-ghost')));
      comecar.addEventListener('click', function () {
        var qs = S.montarProva(n, vis);
        tela.remove();
        var area = h('div', { class: 'sim-quiz', tabindex: '-1' }, h('h1', { class: 'sim-h1-quiz' }, nomeModo + ': ' + n.nome));
        raiz.appendChild(area);
        var avisar = function (e) { e.preventDefault(); e.returnValue = ''; return ''; };
        window.addEventListener('beforeunload', avisar);
        var offP = VL.on('progresso', function (d) { if (d && d.tipo === 'tentativa' && d.tentativa && d.tentativa.modo === 'prova') { window.removeEventListener('beforeunload', avisar); } });
        VL.aoSair(function () { window.removeEventListener('beforeunload', avisar); offP(); });
        VL.quiz.prova(area, { questoes: qs, minutos: n.minutos, notaMinima: n.nota, nivel: n.id, titulo: S.plural(qs.length, 'questão', 'questões') + ' · aprova com ' + VL.fmt.num(n.nota, 1),
          aoTerminar: function () { VL.go('simulados/' + n.id); } });
        area.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      });
    });
  };

  /* ---------- Prática por assunto ---------- */
  S.pratica = function (raiz, n, rota) {
    S.titulo('Prática: ' + n.nome);
    raiz.appendChild(trilhaNivel(n, 'Prática'));
    var carregando = VL.ui.carregando();
    raiz.appendChild(carregando);
    var q = rota.query;
    var cfg = {
      temas: q.tema ? q.tema.split(',').map(function (s) { return VL.slug(s); }).filter(Boolean) : [],
      n: QTDS.indexOf(Number(q.n)) >= 0 ? Number(q.n) : 20,
      so: q.so === 'ineditas' || q.so === 'erradas' ? q.so : 'todas',
    };
    return S.banco(n.id).then(function (banco) {
      if (!raiz.isConnected) return;
      carregando.remove();
      if (!S.visiveis(banco).length) { raiz.appendChild(VL.ui.cabecalho('Prática: ' + n.nome)); raiz.appendChild(S.vazioBanco(n)); return; }
      var stats = VL.progress.todasQuestaoStats();
      var temas = S.temas(banco, stats);
      var nomes = temas.filter(function (t) { return cfg.temas.indexOf(t.slug) >= 0; }).map(function (t) { return t.tema; });
      var pool = filtrar(banco, stats, cfg, temas);
      var desc = [nomes.length ? nomes.join(', ') : 'Todos os assuntos'];
      if (cfg.so === 'ineditas') desc.push('só inéditas');
      if (cfg.so === 'erradas') desc.push('só as que errei');
      raiz.appendChild(h('header', { class: 'sim-quiz-cab' }, h('h1', { class: 'sim-h1-quiz' }, 'Prática: ' + n.nome), h('p', { class: 'muted mb-0' }, desc.join(' · '))));
      if (!pool.length) {
        raiz.appendChild(S.vazio('Nenhuma questão com esses filtros', cfg.so === 'ineditas' ? 'Você já viu todas as questões destes assuntos. Pratique com todas ou revise as que errou.' : 'Escolha outros assuntos ou mude a opção "Quais questões".',
          [S.botaoLink('Mudar os filtros', 'simulados/' + n.id + '?ir=pratica', 'btn-primary')]));
        return;
      }
      var qs = VL.quiz.sortear(pool, cfg.n);
      var area = h('div', { class: 'sim-quiz' });
      raiz.appendChild(area);
      VL.quiz.pratica(area, { questoes: qs, nivel: n.id, aoTerminar: function () { VL.go('simulados/' + n.id); } });
    });
  };

  /* ---------- Revisar as que errei ---------- */
  S.erradas = function (raiz, n) {
    S.titulo('Revisar as que errei: ' + n.nome);
    raiz.appendChild(trilhaNivel(n, 'Revisar as que errei'));
    var carregando = VL.ui.carregando();
    raiz.appendChild(carregando);
    return S.banco(n.id).then(function (banco) {
      if (!raiz.isConnected) return;
      carregando.remove();
      var stats = VL.progress.todasQuestaoStats();
      var pool = S.visiveis(banco).filter(function (q) { var s = stats[q.id]; return s && s.u === 0; });
      raiz.appendChild(h('header', { class: 'sim-quiz-cab' }, h('h1', { class: 'sim-h1-quiz' }, 'Revisar as que errei'),
        h('p', { class: 'muted mb-0' }, n.nome + ' · questões cujo último resultado foi erro')));
      if (!banco.length) { raiz.appendChild(S.vazioBanco(n)); return; }
      if (!pool.length) {
        raiz.appendChild(S.vazio('Nada para revisar', 'Você não tem questões erradas neste nível agora. Faça uma prática ou uma prova: o que você errar aparece aqui.',
          [S.botaoLink('Praticar por assunto', 'simulados/' + n.id + '?ir=pratica', 'btn-primary'), S.botaoLink('Voltar', 'simulados/' + n.id, 'btn-ghost')]));
        return;
      }
      /* primeiro as que você mais erra; depois as erradas mais recentemente */
      pool.sort(function (a, b) {
        var sa = stats[a.id], sb = stats[b.id];
        return (sa.a / sa.v) - (sb.a / sb.v) || String(sb.d || '').localeCompare(String(sa.d || ''));
      });
      var MAX = 40, sel = pool.slice(0, MAX);
      if (pool.length > MAX) raiz.appendChild(h('p', { class: 'small muted' }, 'Mostrando as ' + MAX + ' que você mais erra, de ' + pool.length + '. As outras entram na próxima rodada.'));
      var area = h('div', { class: 'sim-quiz' });
      raiz.appendChild(area);
      VL.quiz.pratica(area, { questoes: VL.embaralhar(sel), nivel: n.id, aoTerminar: function () { VL.go('simulados/' + n.id); } });
    });
  };
})();
