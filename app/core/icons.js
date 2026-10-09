/* Ícones em traço (24×24). VL.icon('nome', tamanho) devolve um <svg>. */
(function () {
  'use strict';
  var P = {
    rota: '<path d="M4 19c3-1 4-4 7-5s5 1 8-3"/><circle cx="4" cy="19" r="1.6"/><circle cx="11" cy="14" r="1.6"/><path d="M19 11l0-6m0 0l-3 2m3-2l3 2"/>',
    ancora: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 10h8M5 14c0 4 3 7 7 7s7-3 7-7"/><path d="M3 15l2-2 2 2M17 15l2-2 2 2"/>',
    leme: '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
    sextante: '<path d="M5 20L12 4l7 16"/><path d="M6.5 16.5a9 9 0 0 1 11 0"/><circle cx="12" cy="4" r="1.3"/><path d="M12 4v9"/>',
    vela: '<path d="M11 3v15"/><path d="M11 4c4 3 6 7 6 12h-6z"/><path d="M9 7c-2 3-3 6-3 9h3"/><path d="M3 19h18l-2 2H5z"/>',
    globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z"/>',
    radio: '<rect x="6" y="9" width="12" height="12" rx="2"/><path d="M10 9V3M9 13h6M9 17h3"/><path d="M14 4.5a4 4 0 0 1 4 4M14 2a6.5 6.5 0 0 1 6.5 6.5"/>',
    mapa: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    prova: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3"/><path d="M8.5 11l1.5 1.5L13 9.5M8.5 16.5l1.5 1.5L13 15"/><path d="M15 11h1M15 16.5h1"/>',
    livro: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v16H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M4 20.5A1.5 1.5 0 0 0 5.5 22H19v-3"/><path d="M8 7h7M8 10.5h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    lua: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16z" fill="currentColor"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    direita: '<path d="M9 5l7 7-7 7"/>',
    esquerda: '<path d="M15 5l-7 7 7 7"/>',
    baixo: '<path d="M5 9l7 7 7-7"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    filtro: '<path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/>',
    local: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    alvo: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    config: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    alerta: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
    cartas: '<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    estrela: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    seguranca: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    onda: '<path d="M2 12c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3M2 17c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pausa: '<path d="M8 5v14M16 5v14"/>',
    reiniciar: '<path d="M4 4v6h6"/><path d="M5.5 15a7 7 0 1 0 1.6-7.4L4 10"/>',
    download: '<path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5"/><path d="M5 20h14"/>',
    upload: '<path d="M12 20V9m0 0l-4.5 4.5M12 9l4.5 4.5"/><path d="M5 4h14"/>',
    coracao: '<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
  };
  window.VL = window.VL || {};
  VL.icon = function (nome, tam) {
    var t = tam || 20;
    var span = document.createElement('span');
    span.innerHTML = '<svg width="' + t + '" height="' + t + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[nome] || P.info) + '</svg>';
    return span.firstChild;
  };
  VL.iconNomes = Object.keys(P);
  /* Marca do projeto: vela sobre a linha de rumo em magenta */
  VL.marca = function (tam) {
    var t = tam || 34;
    var span = document.createElement('span');
    span.innerHTML = '<svg width="' + t + '" height="' + t + '" viewBox="0 0 40 40" aria-hidden="true">' +
      '<rect x="1" y="1" width="38" height="38" rx="9" fill="var(--ink)"/>' +
      '<path d="M20 7v20" stroke="var(--paper)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M21.5 8.5c5.5 4 8 9 8 16.5H21.5z" fill="var(--paper)"/>' +
      '<path d="M18.5 12c-3 3.5-4.5 8-4.5 13h4.5z" fill="var(--shoal-2)"/>' +
      '<path d="M7 30.5h26" stroke="var(--magenta)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 3"/>' +
      '</svg>';
    return span.firstChild;
  };
})();
