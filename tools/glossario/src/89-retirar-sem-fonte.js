  /* ===================== Regra "nada inventado" (2026-10-09) =====================
     Depois de aplicadas as fontes verificadas (80–87), retira do glossário publicado todo verbete que continue sem
     fonte reconhecida conferida por um verificador independente, e limpa as referências "ver" a ele.
     Os verbetes retirados ficam listados em research/glossario_retirados.md. */
  (function () {
    var fora = {};
    T.forEach(function (x) { if (!x.fonte || (Array.isArray(x.fonte) && !x.fonte.length)) fora[x.id] = 1; });
    for (var i = T.length - 1; i >= 0; i--) if (fora[T[i].id]) T.splice(i, 1);
    T.forEach(function (x) { if (x.ver) x.ver = x.ver.filter(function (v) { return !fora[v]; }); });
  })();
