/* Simulados: gráficos de progresso (Chart.js via VL.charts) e mapa de calor dos dias de estudo (SVG). */
(function () {
  'use strict';
  var h = VL.h;
  var S = VL.simulados = VL.simulados || {};
  var DIA = 86400000;
  var SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  function reduzMovimento() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function chave(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* Dias "locais" desde a época, para o eixo de tempo cair à meia-noite local. */
  function diaLocal(iso) {
    var d = new Date(iso);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DIA + (d.getHours() * 60 + d.getMinutes()) / 1440;
  }
  function rotuloDia(v) { var d = new Date(Math.round(v) * DIA); return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0'); }
  function tooltipBase(c) {
    return { backgroundColor: c.ink, titleColor: c.papel, bodyColor: c.papel, borderWidth: 0, padding: 10, cornerRadius: 6, displayColors: true, boxPadding: 4 };
  }
  /* Rótulo de valor na ponta de cada barra, sempre em cor de texto. */
  function pluginValores(formatar) {
    return {
      id: 'simValores',
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx, meta = chart.getDatasetMeta(0), horiz = chart.options.indexAxis === 'y';
        ctx.save();
        ctx.fillStyle = VL.cssVar('--ink-2');
        ctx.font = '600 12px ' + (VL.cssVar('--font') || 'sans-serif');
        ctx.textBaseline = horiz ? 'middle' : 'bottom';
        ctx.textAlign = horiz ? 'left' : 'center';
        meta.data.forEach(function (el, i) {
          var v = chart.data.datasets[0].data[i];
          var txt = formatar(v, i);
          if (txt === '') return;
          if (horiz) ctx.fillText(txt, el.x + 6, el.y); else ctx.fillText(txt, el.x, el.y - 4);
        });
        ctx.restore();
      },
    };
  }
  function painelGrafico(titulo, legenda) {
    var corpo = h('div', { class: 'sim-graf-corpo' });
    var raiz = h('figure', { class: 'sim-graf' },
      h('figcaption', null, h('span', { class: 'sim-graf-t' }, titulo), legenda ? h('span', { class: 'sim-graf-l', html: legenda }) : null),
      corpo);
    return { raiz: raiz, corpo: corpo };
  }
  S.painelGrafico = painelGrafico;

  /** Evolução das notas de um nível: provas (cheio) e práticas (tracejado, vazado), com a linha da nota mínima. */
  S.grafEvolucao = function (alvo, nivel, opts) {
    opts = opts || {};
    var n = S.nivel(nivel);
    var ts = S.tentativas(nivel);
    if (!ts.length) {
      alvo.appendChild(S.vazio('Nenhuma tentativa de ' + n.nome + ' ainda',
        'Cada prova ou prática que você termina vira um ponto aqui. Comece com 10 questões.',
        opts.acoes || null));
      return null;
    }
    var provas = [], praticas = [];
    ts.forEach(function (t) {
      var p = { x: diaLocal(t.data), y: S.notaDe(t), t: t };
      (t.modo === 'prova' ? provas : praticas).push(p);
    });
    var xs = ts.map(function (t) { return diaLocal(t.data); });
    var min = Math.floor(Math.min.apply(null, xs)), max = Math.ceil(Math.max.apply(null, xs));
    if (max - min < 6) { var falta = 6 - (max - min); min -= Math.floor(falta / 2); max += Math.ceil(falta / 2); }
    var faixa = max - min;
    var maxTicks = (alvo.clientWidth || window.innerWidth) < 420 ? 4 : 7;
    var passo = [1, 2, 7, 14, 28, 56, 91, 182].filter(function (s) { return faixa / s <= maxTicks; })[0] || 365;
    var ultima = ts[ts.length - 1];
    var resumo = n.nome + ': ' + S.plural(ts.length, 'tentativa', 'tentativas') + '. Última nota ' + VL.fmt.num(S.notaDe(ultima), 1) + ' em ' + S.dataCurta(ultima.data) + '.';
    var cx = VL.charts.caixa(opts.altura || 250, 'Evolução das notas. ' + resumo);
    alvo.appendChild(cx.box);
    alvo.appendChild(h('p', { class: 'visually-hidden' }, resumo));
    return VL.charts.criar(cx.canvas, function (c) {
      var terra = VL.cssVar('--land-ink'), ink3 = VL.cssVar('--ink-3');
      var conjuntos = [];
      if (provas.length) conjuntos.push({
        label: n.oficial ? 'Prova no formato oficial' : 'Simulado cronometrado', data: provas,
        borderColor: c.magenta, backgroundColor: c.magenta, borderWidth: 2, pointRadius: 5, pointHoverRadius: 7,
        pointBorderColor: c.papel, pointBorderWidth: 2, tension: 0, borderJoinStyle: 'round', borderCapStyle: 'round',
      });
      if (praticas.length) conjuntos.push({
        label: 'Prática (nota pelos acertos)', data: praticas,
        borderColor: terra, backgroundColor: c.papel, borderWidth: 2, borderDash: [6, 4], pointRadius: 4.5, pointHoverRadius: 6.5,
        pointBorderColor: terra, pointBorderWidth: 2, tension: 0, borderJoinStyle: 'round',
      });
      conjuntos.push({
        label: 'Nota mínima (' + VL.fmt.num(n.nota, 1) + ')', data: [{ x: min, y: n.nota }, { x: max, y: n.nota }],
        borderColor: ink3, borderWidth: 1, borderDash: [3, 3], pointRadius: 0, pointHoverRadius: 0, pointHitRadius: 0, fill: false,
      });
      return {
        type: 'line',
        data: { datasets: conjuntos },
        options: {
          parsing: true,
          interaction: { mode: 'nearest', intersect: false, axis: 'xy' },
          scales: {
            x: { type: 'linear', min: min, max: max, grid: { color: c.linha, drawTicks: false }, border: { display: false },
              ticks: { stepSize: passo, callback: function (v) { return rotuloDia(v); }, maxRotation: 0, autoSkip: true, padding: 6 } },
            y: { min: 0, max: 10, grid: { color: c.linha, drawTicks: false }, border: { display: false },
              ticks: { stepSize: 2, padding: 6 }, title: { display: false } },
          },
          plugins: {
            legend: { position: 'bottom', align: 'start', labels: { usePointStyle: true, boxWidth: 26, padding: 14, color: c.ink2,
              /* amostra = traço da série (a cor do anel do ponto é a do papel e sumiria) */
              generateLabels: function (chart) {
                return chart.data.datasets.map(function (ds, i) {
                  return { text: ds.label, fillStyle: ds.borderColor, strokeStyle: ds.borderColor, lineWidth: 2, lineDash: ds.borderDash || [],
                    pointStyle: 'line', hidden: !chart.isDatasetVisible(i), datasetIndex: i, fontColor: c.ink2 };
                });
              } } },
            tooltip: Object.assign(tooltipBase(c), {
              filter: function (it) { return it.raw && it.raw.t; },
              callbacks: {
                title: function (its) { return its.length && its[0].raw.t ? S.dataHora(its[0].raw.t.data) : ''; },
                label: function (it) {
                  var t = it.raw.t;
                  return (t.modo === 'prova' ? 'Prova: nota ' + VL.fmt.num(S.notaDe(t), 1) : 'Prática: ' + t.acertos + ' de ' + t.total + ' (nota ' + VL.fmt.num(S.notaDe(t), 1) + ')');
                },
                afterLabel: function (it) { return 'Duração: ' + S.duracao(it.raw.t.duracaoSeg); },
              },
            }),
          },
        },
      };
    });
  };

  function quebrar(txt, max) {
    var palavras = String(txt).split(/\s+/), linhas = [], atual = '';
    palavras.forEach(function (p) {
      if ((atual + ' ' + p).trim().length > max && atual) { linhas.push(atual); atual = p; } else atual = (atual + ' ' + p).trim();
    });
    if (atual) linhas.push(atual);
    if (linhas.length > 1 && linhas[linhas.length - 1].length <= 3) { var ult = linhas.pop(); linhas[linhas.length - 1] += ' ' + ult; }
    if (linhas.length > 3) { linhas = linhas.slice(0, 3); linhas[2] = linhas[2].replace(/.{0,1}$/, '…'); }
    return linhas;
  }

  /** Aproveitamento por assunto (barras horizontais, do mais fraco ao mais forte). temas: saída de S.temas. */
  S.grafTemas = function (alvo, temas, opts) {
    opts = opts || {};
    var com = temas.filter(function (t) { return t.v > 0; }).sort(function (a, b) { return a.frac - b.frac || b.v - a.v; });
    var sem = temas.filter(function (t) { return !t.v; });
    if (!com.length) {
      alvo.appendChild(S.vazio('Sem respostas ainda', temas.length ? 'Responda algumas questões e veja aqui quais assuntos pedem mais estudo.' : 'Este nível ainda não tem questões no banco.', opts.acoes || null));
      return null;
    }
    var estreito = (alvo.clientWidth || window.innerWidth) < 400;
    var altura = Math.max(150, com.length * (estreito ? 44 : 36) + 44);
    var resumo = 'Aproveitamento por assunto, do mais fraco ao mais forte: ' + com.map(function (t) { return t.tema + ' ' + VL.fmt.pct(t.frac); }).join('; ') + '.';
    var cx = VL.charts.caixa(altura, resumo);
    alvo.appendChild(cx.box);
    if (sem.length) alvo.appendChild(h('p', { class: 'small muted sim-graf-nota' }, 'Ainda sem respostas: ' + sem.map(function (t) { return t.tema; }).join(', ') + '.'));
    return VL.charts.criar(cx.canvas, function (c) {
      return {
        type: 'bar',
        data: {
          labels: com.map(function (t) { return quebrar(t.tema, estreito ? 16 : 26); }),
          datasets: [{ label: 'Aproveitamento', data: com.map(function (t) { return Math.round(t.frac * 100); }),
            backgroundColor: c.magenta, hoverBackgroundColor: c.magenta, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: 'start',
            maxBarThickness: 22, categoryPercentage: 0.8, barPercentage: 0.9 }],
        },
        options: {
          indexAxis: 'y',
          layout: { padding: { right: 44 } },
          scales: {
            /* sem grade vertical: o valor já está escrito na ponta de cada barra */
            x: { min: 0, max: 100, grid: { display: false }, border: { color: c.linha },
              ticks: { stepSize: 25, callback: function (v) { return v + '%'; }, padding: 6 } },
            y: { grid: { display: false }, border: { color: c.linha }, ticks: { color: c.ink, padding: 6, autoSkip: false, font: { size: 12 } } },
          },
          plugins: {
            legend: { display: false },
            tooltip: Object.assign(tooltipBase(c), {
              displayColors: false,
              callbacks: {
                title: function (its) { return com[its[0].dataIndex].tema; },
                label: function (it) { var t = com[it.dataIndex]; return t.a + ' de ' + t.v + ' respostas certas (' + VL.fmt.pct(t.frac) + ')'; },
                afterLabel: function (it) { var t = com[it.dataIndex]; return t.total ? t.respondidas + ' de ' + t.total + ' questões do banco já vistas' : ''; },
              },
            }),
          },
        },
        plugins: [pluginValores(function (v) { return v + '%'; })],
      };
    });
  };

  /** Previsão de revisões de flashcards nos próximos 7 dias (barras). serie: [7 números]. */
  S.grafPrevisao = function (alvo, serie, opts) {
    opts = opts || {};
    var total = serie.reduce(function (a, b) { return a + b; }, 0);
    if (!total) {
      alvo.appendChild(S.vazio('Nenhuma revisão marcada', 'Quando você estuda um baralho, cada cartão ganha uma data para voltar. Elas aparecem aqui.', opts.acoes || null));
      return null;
    }
    var hoje = new Date(); hoje.setHours(12, 0, 0, 0);
    var rotulos = serie.map(function (_, i) {
      if (i === 0) return 'Hoje';
      if (i === 1) return 'Amanhã';
      var d = new Date(hoje.getTime() + i * DIA);
      return [SEMANA[d.getDay()], String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0')];
    });
    var resumo = 'Revisões previstas: ' + serie.map(function (v, i) { return (i === 0 ? 'hoje' : i === 1 ? 'amanhã' : 'em ' + i + ' dias') + ' ' + v; }).join(', ') + '.';
    var cx = VL.charts.caixa(opts.altura || 210, resumo);
    alvo.appendChild(cx.box);
    return VL.charts.criar(cx.canvas, function (c) {
      return {
        type: 'bar',
        data: { labels: rotulos, datasets: [{ label: 'Cartões para revisar', data: serie, backgroundColor: c.magenta, hoverBackgroundColor: c.magenta,
          borderRadius: { topLeft: 4, topRight: 4 }, borderSkipped: 'start', maxBarThickness: 24 }] },
        options: {
          layout: { padding: { top: 20 } },
          scales: {
            x: { grid: { display: false }, border: { color: c.linha }, ticks: { maxRotation: 0, autoSkip: false, font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: c.linha, drawTicks: false }, border: { display: false }, ticks: { precision: 0, padding: 6, maxTicksLimit: 5 } },
          },
          plugins: {
            legend: { display: false },
            tooltip: Object.assign(tooltipBase(c), { displayColors: false, callbacks: {
              title: function (its) { var r = rotulos[its[0].dataIndex]; return Array.isArray(r) ? r.join(' ') : r; },
              label: function (it) { return S.plural(it.raw, 'cartão para revisar', 'cartões para revisar'); },
            } }),
          },
        },
        plugins: [pluginValores(function (v) { return v ? String(v) : ''; })],
      };
    });
  };

  /** Atividade por dia: {AAAA-MM-DD: questões respondidas em simulados}. */
  function questoesPorDia() {
    var m = {};
    VL.progress.tentativas().forEach(function (t) { var d = new Date(t.data); if (isNaN(d)) return; var k = chave(d); m[k] = (m[k] || 0) + (t.total || 0); });
    return m;
  }
  S.melhorSequencia = function () {
    var dias = VL.progress.dias().slice().sort(), melhor = 0, atual = 0, ant = null;
    dias.forEach(function (k) {
      var t = new Date(k + 'T12:00').getTime();
      if (ant != null && Math.round((t - ant) / DIA) === 1) atual++; else if (ant == null || t !== ant) atual = 1;
      ant = t; if (atual > melhor) melhor = atual;
    });
    return melhor;
  };

  /** Mapa de calor das últimas 12 semanas (colunas = semanas, linhas = dias da semana, domingo em cima). */
  S.mapaCalor = function () {
    var semanas = 12, cel = 16, gap = 4, esq = 30, topo = 18;
    var estudo = {}; VL.progress.dias().forEach(function (k) { estudo[k] = 1; });
    var qd = questoesPorDia();
    var hoje = new Date(); hoje.setHours(12, 0, 0, 0);
    var inicio = new Date(hoje.getTime() - (hoje.getDay() + (semanas - 1) * 7) * DIA);
    var w = esq + semanas * (cel + gap) - gap + 12, alt = topo + 7 * (cel + gap) - gap;
    var svg = h('svg', { class: 'sim-calor', viewBox: '0 0 ' + w + ' ' + alt, role: 'img' });
    var ativos = 0, mesAnt = -1, rotAnt = null, colAnt = -9;
    [1, 3, 5].forEach(function (r) {
      svg.appendChild(h('text', { x: 0, y: topo + r * (cel + gap) + cel - 4, class: 'sim-calor-rot' }, SEMANA[r]));
    });
    for (var i = 0; i < semanas * 7; i++) {
      var d = new Date(inicio.getTime() + i * DIA);
      var col = Math.floor(i / 7), lin = i % 7;
      var x = esq + col * (cel + gap), y = topo + lin * (cel + gap);
      if (lin === 0 && d.getMonth() !== mesAnt) {
        {
          if (rotAnt && col - colAnt < 2) rotAnt.remove();
          rotAnt = svg.appendChild(h('text', { x: x, y: 11, class: 'sim-calor-rot' }, MESES[d.getMonth()]));
          colAnt = col;
        }
        mesAnt = d.getMonth();
      }
      if (d > hoje) continue;
      var k = chave(d), q = qd[k] || 0;
      var nivel = !estudo[k] && !q ? 0 : (q >= 40 ? 3 : (q >= 10 ? 2 : 1));
      if (nivel) ativos++;
      var ehHoje = k === chave(hoje);
      var r = h('rect', { x: x, y: y, width: cel, height: cel, rx: 3, class: 'sim-calor-c sim-calor-' + nivel + (ehHoje ? ' sim-calor-hoje' : '') });
      r.appendChild(h('title', null, SEMANA[d.getDay()] + ', ' + S.dataCurta(d.toISOString()) + (ehHoje ? ' (hoje)' : '') + ': ' +
        (nivel ? (q ? S.plural(q, 'questão em simulados', 'questões em simulados') : 'estudou (lições ou flashcards)') : 'sem estudo')));
      svg.appendChild(r);
    }
    svg.setAttribute('aria-label', 'Mapa dos dias de estudo nas últimas 12 semanas: ' + S.plural(ativos, 'dia', 'dias') + ' com estudo.');
    var legenda = h('div', { class: 'sim-calor-legenda', 'aria-hidden': 'true' }, h('span', null, 'Menos'),
      [0, 1, 2, 3].map(function (nv) { return h('svg', { width: 12, height: 12, viewBox: '0 0 12 12' }, h('rect', { width: 12, height: 12, rx: 2, class: 'sim-calor-' + nv })); }),
      h('span', null, 'Mais'));
    return { svg: svg, legenda: legenda, ativos: ativos };
  };
  S._reduzMovimento = reduzMovimento;
})();
