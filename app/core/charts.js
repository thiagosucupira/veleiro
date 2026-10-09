/* Gráficos de progresso com Chart.js (carregado sob demanda), usando os tokens de cor do tema. */
(function () {
  'use strict';
  VL.charts = {};
  function cores() {
    return {
      ink: VL.cssVar('--ink'), ink2: VL.cssVar('--ink-2'), linha: VL.cssVar('--line'),
      magenta: VL.cssVar('--magenta'), ok: VL.cssVar('--ok'), erro: VL.cssVar('--erro'), aviso: VL.cssVar('--aviso'),
      mar: VL.cssVar('--sea-3'), papel: VL.cssVar('--paper'),
      serie: [VL.cssVar('--magenta'), VL.cssVar('--ok'), VL.cssVar('--ink-2'), VL.cssVar('--aviso'), VL.cssVar('--sea-3'), VL.cssVar('--erro')],
    };
  }
  VL.charts.cores = cores;
  /**
   * Cria um gráfico que se redesenha ao trocar o tema.
   * VL.charts.criar(canvas, (cores) => configChartJs) → Promise<Chart>
   */
  VL.charts.criar = function (canvas, fabricaConfig) {
    return VL.libs.chart().then(function (Chart) {
      var grafico = null;
      function desenhar() {
        if (grafico) grafico.destroy();
        var c = cores();
        Chart.defaults.font.family = VL.cssVar('--font') || 'sans-serif';
        Chart.defaults.color = c.ink2;
        Chart.defaults.borderColor = c.linha;
        var cfg = fabricaConfig(c);
        cfg.options = Object.assign({ responsive: true, maintainAspectRatio: false, animation: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 400 } }, cfg.options || {});
        grafico = new Chart(canvas, cfg);
      }
      desenhar();
      var off1 = VL.on('tema', function () { setTimeout(desenhar, 30); });
      var off2 = VL.on('settings', function () { setTimeout(desenhar, 30); });
      VL.aoSair(function () { off1(); off2(); if (grafico) grafico.destroy(); });
      return grafico;
    });
  };
  /** Caixa com altura fixa para o canvas (Chart.js responsivo precisa de contêiner com altura). */
  VL.charts.caixa = function (altura, rotulo) {
    var canvas = VL.h('canvas', { role: 'img', 'aria-label': rotulo || 'Gráfico' });
    var box = VL.h('div', { style: { position: 'relative', height: (altura || 260) + 'px', width: '100%' } }, canvas);
    return { box: box, canvas: canvas };
  };
})();
