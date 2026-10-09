/* Motor de questões: checagem de compreensão (nas lições), prática comentada e prova cronometrada.
   Formato da questão:
   { id, nivel, tema, enunciado (HTML), alternativas: [..4 ou 5..], correta: índice (0-based),
     explicacao (HTML), referencia (texto), fonte_url?, dificuldade?: 1|2|3,
     figura?: {svg} | {html} | {widget, opts}, fixa?: true (não embaralhar alternativas), intl?: true } */
(function () {
  'use strict';
  var h = VL.h;
  var LETRAS = ['A', 'B', 'C', 'D', 'E'];
  VL.quiz = {};

  function filtrarIntl(qs) { var intl = VL.settings.get('intl'); return qs.filter(function (q) { return intl || !q.intl; }); }
  function ordemAlternativas(q, embaralhar) {
    var idx = q.alternativas.map(function (_, i) { return i; });
    return embaralhar && !q.fixa ? VL.embaralhar(idx) : idx;
  }
  function figura(q) {
    if (!q.figura) return null;
    var f = h('div', { class: 'questao-figura' });
    if (q.figura.svg) f.innerHTML = q.figura.svg;
    else if (q.figura.html) f.innerHTML = q.figura.html;
    else if (q.figura.widget) VL.widgets.mount(q.figura.widget, f, q.figura.opts || {});
    if (q.figura.legenda) f.appendChild(h('p', { class: 'small muted' }, q.figura.legenda));
    return f;
  }
  function blocoExplicacao(q, acertou, escolhida, ordem) {
    var corretaLetra = LETRAS[ordem.indexOf(q.correta)];
    var ex = h('div', { class: 'explicacao', role: 'status' },
      h('p', { class: 'explicacao-res', 'data-ok': acertou ? '1' : '0' },
        escolhida == null ? 'Sem resposta. Correta: ' + corretaLetra + '.' : (acertou ? 'Correto.' : 'Incorreto. A resposta certa é ' + corretaLetra + '.')),
      h('div', { html: q.explicacao || '' }));
    if (q.referencia || q.fonte_url) {
      var r = h('p', { class: 'fonte-ref mb-0' }, 'Referência: ' + (q.referencia || ''));
      if (q.fonte_url) { r.appendChild(document.createTextNode(' ')); r.appendChild(h('a', { href: q.fonte_url, target: '_blank', rel: 'noopener' }, 'fonte')); }
      ex.appendChild(r);
    }
    ex.appendChild(h('p', { class: 'fonte-ref mb-0' }, 'Questão ' + q.id + ' · ', h('a', { href: VL.link('sobre?secao=contribuir') }, 'relatar erro')));
    return ex;
  }
  /** Desenha uma questão. modo: 'imediato' (corrige ao clicar) | 'prova' (só marca). */
  function desenharQuestao(q, num, opts) {
    var ordem = opts.ordem || ordemAlternativas(q, opts.embaralhar !== false);
    var raiz = h('section', { class: 'questao', 'data-qid': q.id, 'aria-labelledby': 'q-' + q.id + '-' + num });
    raiz.appendChild(h('div', { class: 'questao-enunciado', id: 'q-' + q.id + '-' + num },
      h('span', { class: 'questao-num' }, num + '.'), h('span', { html: q.enunciado })));
    var fig = figura(q); if (fig) raiz.appendChild(fig);
    var lista = h('ul', { class: 'alternativas', role: 'radiogroup', 'aria-labelledby': 'q-' + q.id + '-' + num });
    var botoes = [];
    ordem.forEach(function (orig, pos) {
      var b = h('button', { type: 'button', class: 'alternativa', role: 'radio', 'aria-checked': 'false', 'data-orig': String(orig) },
        h('span', { class: 'alternativa-letra', 'aria-hidden': 'true' }, LETRAS[pos]),
        h('span', { html: q.alternativas[orig] }));
      b.addEventListener('click', function () { if (!b.disabled) opts.aoEscolher(orig, b, botoes); });
      botoes.push(b);
      lista.appendChild(h('li', { role: 'none' }, b));
    });
    raiz.appendChild(lista);
    return { raiz: raiz, botoes: botoes, ordem: ordem };
  }
  function corrigirVisual(q, botoes, escolhida) {
    botoes.forEach(function (b) {
      var o = Number(b.getAttribute('data-orig'));
      b.disabled = true;
      if (o === q.correta) b.setAttribute('data-res', 'certa');
      else if (o === escolhida) b.setAttribute('data-res', 'errada');
    });
  }
  function tabelaTemas(porTema) {
    var temas = Object.keys(porTema).sort(function (a, b) { return porTema[a].a / porTema[a].t - porTema[b].a / porTema[b].t; });
    var tb = h('tbody');
    temas.forEach(function (t) {
      var x = porTema[t];
      tb.appendChild(h('tr', null, h('td', null, t), h('td', null, x.a + ' de ' + x.t), h('td', null, VL.fmt.pct(x.a / x.t))));
    });
    return h('div', { class: 'table-wrap' }, h('table', { class: 'tabela' },
      h('thead', null, h('tr', null, h('th', null, 'Assunto'), h('th', null, 'Acertos'), h('th', null, 'Aproveitamento'))), tb));
  }

  /** Checagem de compreensão dentro de uma lição: todas as questões visíveis, correção imediata. */
  VL.quiz.check = function (el, questoes, opts) {
    opts = opts || {};
    var qs = filtrarIntl(questoes || []);
    var box = h('section', { class: 'check-compreensao' }, h('h3', null, opts.titulo || 'Checagem de compreensão'));
    var feitas = 0, acertos = 0;
    var placar = h('p', { class: 'small muted mb-0' }, 'Responda para ver a explicação de cada alternativa.');
    qs.forEach(function (q, i) {
      var d = desenharQuestao(q, i + 1, {
        embaralhar: true,
        aoEscolher: function (orig, b, botoes) {
          var ok = orig === q.correta;
          b.setAttribute('aria-checked', 'true');
          corrigirVisual(q, botoes, orig);
          d.raiz.appendChild(blocoExplicacao(q, ok, orig, d.ordem));
          VL.progress.responder(q.id, ok);
          feitas++; if (ok) acertos++;
          placar.textContent = 'Você acertou ' + acertos + ' de ' + feitas + (feitas === qs.length ? '.' : ' até agora.');
          if (feitas === qs.length && opts.aoConcluir) opts.aoConcluir(acertos, qs.length);
        },
      });
      box.appendChild(d.raiz);
    });
    box.appendChild(placar);
    el.appendChild(box);
    return box;
  };

  /** Prática comentada: uma questão por vez, correção imediata, resumo no final. */
  VL.quiz.pratica = function (el, opts) {
    var qs = filtrarIntl(opts.questoes || []);
    var i = 0, acertos = 0, porTema = {}, erradas = [], inicio = Date.now();
    var raiz = h('div', { class: 'quiz' });
    el.appendChild(raiz);
    function passo() {
      raiz.innerHTML = '';
      if (i >= qs.length) return fim();
      var q = qs[i];
      raiz.appendChild(h('div', { class: 'spread' },
        h('p', { class: 'muted mb-0' }, (opts.titulo ? opts.titulo + ' · ' : '') + 'Questão ' + (i + 1) + ' de ' + qs.length),
        h('p', { class: 'muted mb-0' }, 'Acertos: ' + acertos)));
      raiz.appendChild(VL.ui.medidor(i / qs.length));
      var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { i++; passo(); } }, i + 1 < qs.length ? 'Próxima questão' : 'Ver resultado');
      var d = desenharQuestao(q, i + 1, {
        aoEscolher: function (orig, b, botoes) {
          var ok = orig === q.correta;
          b.setAttribute('aria-checked', 'true');
          corrigirVisual(q, botoes, orig);
          d.raiz.appendChild(blocoExplicacao(q, ok, orig, d.ordem));
          VL.progress.responder(q.id, ok);
          var t = porTema[q.tema || 'Geral'] = porTema[q.tema || 'Geral'] || { t: 0, a: 0 };
          t.t++; if (ok) { t.a++; acertos++; } else erradas.push(q);
          prox.hidden = false; prox.focus();
        },
      });
      raiz.appendChild(d.raiz);
      raiz.appendChild(h('div', { class: 'btn-row' }, prox,
        h('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { qs.length = i; fim(); } }, 'Encerrar agora')));
    }
    function fim() {
      raiz.innerHTML = '';
      var total = Object.keys(porTema).reduce(function (s, k) { return s + porTema[k].t; }, 0);
      if (total) VL.progress.registrarTentativa({ nivel: opts.nivel, modo: 'pratica', total: total, acertos: acertos, porTema: porTema, duracaoSeg: Math.round((Date.now() - inicio) / 1000) });
      raiz.appendChild(h('div', { class: 'resultado' },
        h('h2', null, total ? 'Você acertou ' + acertos + ' de ' + total + ' (' + VL.fmt.pct(acertos / total) + ')' : 'Nenhuma questão respondida'),
        h('p', { class: 'mb-0' }, total ? 'Os assuntos abaixo estão do mais fraco para o mais forte. Revise primeiro os de cima.' : 'Escolha um conjunto de questões para começar.')));
      if (total) raiz.appendChild(tabelaTemas(porTema));
      var acoes = h('div', { class: 'btn-row' });
      if (erradas.length) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { el.innerHTML = ''; VL.quiz.pratica(el, Object.assign({}, opts, { questoes: erradas, titulo: 'Refazer as que errei' })); } }, erradas.length === 1 ? 'Refazer a questão que errei' : 'Refazer as ' + erradas.length + ' que errei'));
      if (opts.aoTerminar) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { opts.aoTerminar({ acertos: acertos, total: total }); } }, 'Voltar'));
      raiz.appendChild(acoes);
    }
    passo();
  };

  /** Prova cronometrada no formato oficial. opts: {questoes, minutos, notaMinima (0–10), nivel, titulo, aoTerminar} */
  VL.quiz.prova = function (el, opts) {
    var qs = filtrarIntl(opts.questoes || []);
    var respostas = {}, ordens = {}, atual = 0, inicio = Date.now(), entregue = false;
    var limiteSeg = Math.round((opts.minutos || 60) * 60);
    qs.forEach(function (q) { ordens[q.id] = ordemAlternativas(q, true); });
    var relogio = h('span', { class: 'quiz-relogio', role: 'timer', 'aria-live': 'off' }, VL.fmt.min(limiteSeg));
    var mapa = h('div', { class: 'quiz-mapa', 'aria-label': 'Mapa de questões' });
    var area = h('div');
    var entregar = h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { confirmarEntrega(); } }, 'Entregar prova');
    var barra = h('div', { class: 'quiz-barra' }, VL.icon('relogio'), relogio, h('span', { class: 'muted' }, opts.titulo || ''), h('span', { style: { marginLeft: 'auto' } }, entregar));
    var raiz = h('div', { class: 'quiz' }, barra, h('div', { class: 'mt-4' }, mapa), area);
    el.appendChild(raiz);

    qs.forEach(function (q, i) {
      mapa.appendChild(h('button', { type: 'button', 'aria-label': 'Questão ' + (i + 1), onclick: function () { ir(i); } }, String(i + 1)));
    });
    function atualizarMapa() {
      VL.$$('button', mapa).forEach(function (b, i) {
        b.setAttribute('aria-current', String(i === atual));
        if (respostas[qs[i].id] != null) b.setAttribute('data-resp', '1');
      });
    }
    function ir(i) {
      atual = Math.max(0, Math.min(qs.length - 1, i));
      area.innerHTML = '';
      var q = qs[atual];
      var d = desenharQuestao(q, atual + 1, {
        ordem: ordens[q.id],
        aoEscolher: function (orig, b, botoes) {
          respostas[q.id] = orig;
          botoes.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
          atualizarMapa();
        },
      });
      if (respostas[q.id] != null) d.botoes.forEach(function (x) { if (Number(x.getAttribute('data-orig')) === respostas[q.id]) x.setAttribute('aria-checked', 'true'); });
      area.appendChild(d.raiz);
      area.appendChild(h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn btn-ghost', disabled: atual === 0, onclick: function () { ir(atual - 1); } }, VL.icon('esquerda', 18), 'Anterior'),
        h('button', { type: 'button', class: 'btn btn-ghost', disabled: atual === qs.length - 1, onclick: function () { ir(atual + 1); } }, 'Próxima', VL.icon('direita', 18))));
      atualizarMapa();
    }
    VL.protegerSaida(function () { return entregue ? null : 'A prova ainda não foi entregue. Sair agora descarta suas respostas. Sair mesmo assim?'; });
    var timer = setInterval(function () {
      var resta = limiteSeg - Math.round((Date.now() - inicio) / 1000);
      relogio.textContent = VL.fmt.min(Math.max(0, resta));
      if (resta <= 300) relogio.setAttribute('data-alerta', '1');
      if (resta <= 0) { VL.ui.toast('Tempo esgotado. Prova entregue.'); corrigir(); }
    }, 1000);
    VL.aoSair(function () { clearInterval(timer); });

    function confirmarEntrega() {
      var faltam = qs.filter(function (q) { return respostas[q.id] == null; }).length;
      VL.ui.dialogo({
        titulo: 'Entregar a prova?',
        corpo: faltam ? 'Você ainda tem ' + faltam + (faltam === 1 ? ' questão em branco' : ' questões em branco') + '. Questões em branco contam como erradas.' : 'Todas as questões estão respondidas.',
        acoes: [{ rotulo: 'Continuar a prova', tipo: 'ghost' }, { rotulo: 'Entregar', tipo: 'primary', acao: function () { corrigir(); } }],
      });
    }
    function corrigir() {
      if (entregue) return; entregue = true;
      clearInterval(timer);
      var acertos = 0, porTema = {};
      qs.forEach(function (q) {
        var ok = respostas[q.id] === q.correta;
        if (ok) acertos++;
        VL.progress.responder(q.id, ok);
        var t = porTema[q.tema || 'Geral'] = porTema[q.tema || 'Geral'] || { t: 0, a: 0 };
        t.t++; if (ok) t.a++;
      });
      var nota = qs.length ? Math.round((acertos / qs.length) * 100) / 10 : 0;
      var minima = opts.notaMinima == null ? 5 : opts.notaMinima;
      var aprovado = nota >= minima;
      var dur = Math.round((Date.now() - inicio) / 1000);
      VL.progress.registrarTentativa({ nivel: opts.nivel, modo: 'prova', total: qs.length, acertos: acertos, nota: nota, aprovado: aprovado, porTema: porTema, duracaoSeg: dur });
      raiz.innerHTML = '';
      raiz.appendChild(h('div', { class: 'resultado', 'data-aprovado': aprovado ? '1' : '0' },
        h('h2', null, 'Nota ' + VL.fmt.num(nota, 1) + ' — ' + (aprovado ? 'aprovado' : 'reprovado') + ' no simulado'),
        h('p', { class: 'mb-0' }, acertos + ' de ' + qs.length + ' questões certas em ' + VL.fmt.min(dur) + '. Nota mínima para aprovação: ' + VL.fmt.num(minima, 1) + '.')));
      raiz.appendChild(h('h3', { class: 'mt-6' }, 'Desempenho por assunto'));
      raiz.appendChild(tabelaTemas(porTema));
      raiz.appendChild(h('h3', { class: 'mt-6' }, 'Correção comentada'));
      var soErradas = h('label', { class: 'switch' }, h('input', { type: 'checkbox', onchange: function (e) { VL.$$('.questao[data-ok="1"]', raiz).forEach(function (x) { x.hidden = e.target.checked; }); } }), 'Mostrar só as que errei');
      raiz.appendChild(soErradas);
      qs.forEach(function (q, i) {
        var d = desenharQuestao(q, i + 1, { ordem: ordens[q.id], aoEscolher: function () {} });
        var esc = respostas[q.id];
        if (esc != null) d.botoes.forEach(function (b) { if (Number(b.getAttribute('data-orig')) === esc) b.setAttribute('aria-checked', 'true'); });
        corrigirVisual(q, d.botoes, esc);
        d.raiz.setAttribute('data-ok', esc === q.correta ? '1' : '0');
        d.raiz.appendChild(blocoExplicacao(q, esc === q.correta, esc, d.ordem));
        raiz.appendChild(d.raiz);
      });
      if (opts.aoTerminar) raiz.appendChild(h('div', { class: 'btn-row mt-6' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { opts.aoTerminar({ nota: nota, aprovado: aprovado }); } }, 'Voltar aos simulados')));
      window.scrollTo(0, 0);
    }
    ir(0);
  };

  /** Monta um conjunto de prova: n questões sorteadas, equilibrando assuntos (temas). */
  VL.quiz.sortear = function (questoes, n, filtroTemas) {
    var qs = filtrarIntl(questoes).filter(function (q) { return !filtroTemas || filtroTemas.indexOf(q.tema) >= 0; });
    var porTema = {};
    VL.embaralhar(qs).forEach(function (q) { (porTema[q.tema || 'Geral'] = porTema[q.tema || 'Geral'] || []).push(q); });
    var temas = Object.keys(porTema), out = [], k = 0;
    while (out.length < Math.min(n, qs.length)) {
      var t = porTema[temas[k % temas.length]];
      if (t.length) out.push(t.shift());
      k++;
      if (k > qs.length * 4) break;
    }
    return VL.embaralhar(out);
  };
})();
