/* Laboratório oculto (fora do menu): #/lab/<widget>?opts=<json> monta um widget isolado para teste. */
VL.tabs.register({
  id: 'lab', titulo: 'Laboratório de widgets', grupo: 'oculto', icone: 'config', ordem: 99,
  render: function (el, rota) {
    /* ferramenta de desenvolvimento: fora do índice de busca enquanto esta rota está aberta */
    var robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    VL.aoSair(function () { if (robots.parentNode) robots.parentNode.removeChild(robots); });
    var nome = rota.params[0];
    var opts = {};
    try { if (rota.query.opts) opts = JSON.parse(rota.query.opts); } catch (e) { opts = {}; }
    el.appendChild(VL.ui.cabecalho('Laboratório: ' + (nome || 'escolha um widget'), 'Página de teste para desenvolvedores. Use #/lab/&lt;nome&gt;?opts={...}'));
    if (!nome) return;
    var alvo = VL.h('div', { class: 'bloco-widget' });
    el.appendChild(alvo);
    return VL.widgets.mount(nome, alvo, opts);
  },
});
