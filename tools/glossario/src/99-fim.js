
  /* ===================== Montagem ===================== */
  function slug(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  var ids = {};
  T.forEach(function (x) { ids[x.id] = x; });
  /* Figuras: o SVG só é gerado quando alguém abre o termo. */
  T.forEach(function (x) {
    if (!x.fig) return;
    var f = x.fig, cache = null, fig = { legenda: x.legenda || null, destaque: x.nota !== false && !(f[1] == null || f[1] === 'nada' || f[1] === 'todas' || f[1] === 'todos') };
    Object.defineProperty(fig, 'svg', { enumerable: true, get: function () { if (cache === null) cache = F[f[0]](f[1]); return cache; } });
    x.figura = fig;
    delete x.fig; delete x.legenda; delete x.nota;
  });
  /* Sinônimos e palavras de busca viram ids alternativos (um curso pode linkar #/glossario/termo/estibordo).
     Os sinônimos vêm primeiro: se uma palavra serve a dois termos, ganha aquele de quem ela é sinônimo. */
  var alias = {};
  ['sin', 'busca'].forEach(function (campo) {
    T.forEach(function (x) {
      (x[campo] || []).forEach(function (s) { var k = slug(s); if (k && !ids[k] && !alias[k]) alias[k] = x.id; });
    });
  });
  VL.dado('glossario', { consultado: CONSULTA, categorias: CATS, termos: T, alias: alias, figuras: F });
  var indice = {};
  T.forEach(function (x) { indice[x.id] = x.termo; });
  Object.keys(alias).forEach(function (k) { indice[k] = ids[alias[k]].termo; });
  VL.dado('glossarioIndice', indice);
})();
