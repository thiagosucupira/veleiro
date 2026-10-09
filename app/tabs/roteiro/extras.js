/* Roteiro: certificações complementares; passo a passo para achar e agendar a prova; lista de Capitanias, Delegacias e Agências
   (data/locais.js, tipo 'orgao-maritimo'), com as mais próximas primeiro quando o usuário informou estado ou localização. */
(function () {
  'use strict';
  var h = VL.h;
  var R = VL.roteiro;

  /* ---------- complementares ---------- */
  R.complementares = function (alvo) {
    alvo.appendChild(h('h2', null, 'Certificações complementares'));
    alvo.appendChild(h('p', { class: 'lead' }, 'Não substituem a habilitação da Marinha, mas protegem você e a tripulação (e algumas regatas e rallies exigem). Escolha conforme a etapa em que você está.'));
    var grade = h('div', { class: 'rt-cards' });
    R.dados().complementares.forEach(function (c) {
      var card = h('article', { class: 'rt-card', 'data-intl': c.intl ? 'on' : null },
        h('header', null, VL.icon(c.icone || 'info', 22), h('h3', null, c.titulo)),
        h('p', { class: 'rt-card-resumo' }, c.resumo),
        h('p', { class: 'small' }, h('strong', null, 'Quando fazer: '), c.quando),
        R.lista(c.fatos));
      var custo = h('p', { class: 'small rt-card-custo' }, h('strong', null, 'Custo: '));
      if (c.custo.html) { custo.appendChild(h('span', { html: c.custo.html })); if (c.custo.ref) custo.appendChild(R.fonte(c.custo.ref)); }
      else custo.appendChild(document.createTextNode(c.custo.texto));
      card.appendChild(custo);
      var links = h('div', { class: 'btn-row' });
      (c.links.curso || []).forEach(function (l) { links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link(l.rota) }, VL.icon('livro', 16), l.rotulo)); });
      if (c.links.locais) links.appendChild(h('a', { class: 'btn btn-ghost btn-sm', href: VL.link('locais?tipos=' + c.links.locais.join(',')) }, VL.icon('mapa', 16), 'Onde fazer'));
      card.appendChild(links);
      grade.appendChild(card);
    });
    alvo.appendChild(grade);
  };

  /* ---------- agendar a prova ---------- */
  function passos(lista) {
    var ol = h('ol', { class: 'rt-passos' });
    lista.forEach(function (p, k) {
      var li = h('li', null,
        h('div', { class: 'rt-passo-n', 'aria-hidden': 'true' }, String(k + 1)),
        h('div', { class: 'rt-passo-c' },
          h('h4', null, p.titulo),
          p.texto ? h('p', null, p.texto) : null,
          p.fatos ? R.lista(p.fatos) : null,
          p.links ? h('p', { class: 'small' }, p.links.map(function (l) { return h('a', { href: l.url, target: '_blank', rel: 'noopener' }, l.txt); })) : null,
          p.aviso ? R.aviso(p.aviso) : null));
      ol.appendChild(li);
    });
    return ol;
  }

  function sigla(nome) { var m = /\(([^)]+)\)\s*$/.exec(nome); return m ? m[1] : ''; }
  function tipoOM(nome) {
    if (/^Capitania Fluvial/.test(nome)) return 'Capitania Fluvial';
    if (/^Capitania dos Portos/.test(nome)) return 'Capitania dos Portos';
    if (/^Delegacia Fluvial/.test(nome)) return 'Delegacia Fluvial';
    if (/^Delegacia/.test(nome)) return 'Delegacia';
    if (/^Agência Fluvial/.test(nome)) return 'Agência Fluvial';
    if (/^Agência/.test(nome)) return 'Agência';
    return 'Organização militar';
  }

  function capitanias(alvo) {
    var oms = R.locais().filter(function (l) { return (l.tipos || []).indexOf('orgao-maritimo') >= 0; });
    var caixa = h('div', { class: 'rt-oms' });
    alvo.appendChild(caixa);
    if (!oms.length) { caixa.appendChild(h('p', { class: 'vazio' }, 'A lista de Capitanias não foi carregada. Use a página oficial “Localize a Capitania Mais Próxima”, da DPC.')); return; }

    var estado = { uf: '', q: '', todas: false };
    var lista = h('ul', { class: 'rt-om-lista' });
    var info = h('p', { class: 'rt-om-info small muted', 'aria-live': 'polite' });
    var verMais = h('button', { type: 'button', class: 'btn btn-ghost btn-sm' });
    var selUF = h('select', { id: 'rt-om-uf', 'aria-label': 'Filtrar por estado' }, h('option', { value: '' }, 'Todos os estados'));
    var ufs = {};
    oms.forEach(function (l) { ufs[l.uf] = 1; });
    Object.keys(ufs).sort().forEach(function (u) { var nome = ((VL.data.ufs || []).filter(function (x) { return x.uf === u; })[0] || {}).nome; selUF.appendChild(h('option', { value: u }, (nome ? nome + ' (' + u + ')' : u))); });
    var busca = h('input', { type: 'search', id: 'rt-om-q', placeholder: 'Buscar por cidade ou nome', 'aria-label': 'Buscar Capitania por cidade ou nome', autocomplete: 'off' });
    selUF.addEventListener('change', function () { estado.uf = selUF.value; estado.todas = false; pintar(); });
    busca.addEventListener('input', function () { estado.q = VL.semAcento(busca.value.trim()); estado.todas = false; pintar(); });
    verMais.addEventListener('click', function () { estado.todas = !estado.todas; pintar(); });

    function pintar() {
      var base = R.base();
      var itens = oms.map(function (l) { return { l: l, d: base ? VL.distKm(base.lat, base.lon, l.lat, l.lon) : null }; });
      if (estado.uf) itens = itens.filter(function (x) { return x.l.uf === estado.uf; });
      if (estado.q) itens = itens.filter(function (x) { return VL.semAcento(x.l.nome + ' ' + x.l.cidade + ' ' + x.l.uf).indexOf(estado.q) >= 0; });
      itens.sort(function (a, b) {
        if (a.d != null && b.d != null) return a.d - b.d;
        return a.l.uf < b.l.uf ? -1 : a.l.uf > b.l.uf ? 1 : (a.l.nome < b.l.nome ? -1 : 1);
      });
      var filtrando = !!(estado.uf || estado.q);
      var limite = filtrando || estado.todas ? itens.length : 6;
      lista.innerHTML = '';
      itens.slice(0, limite).forEach(function (x, k) {
        var l = x.l;
        var contato = (l.contato || '').replace(/\s*\(Carta de Serviços[^)]*\)/, '');
        var li = h('li', { class: 'rt-om' + (k === 0 && x.d != null && !filtrando ? ' rt-om-perto' : '') },
          h('div', { class: 'rt-om-cab' },
            h('strong', null, h('span', { class: 'rt-om-sigla' }, sigla(l.nome) || l.nome), ' ', h('span', { class: 'muted' }, tipoOM(l.nome))),
            x.d != null ? h('span', { class: 'chip', title: 'Distância em linha reta, aproximada (' + (base.exata ? 'da sua localização' : 'a partir de ' + base.rotulo) + ')' }, VL.icon('local', 14), VL.fmt.distKm(x.d)) : null),
          h('p', { class: 'rt-om-nome small mb-0' }, l.nome.replace(/\s*\([^)]*\)\s*$/, '') + ' · ' + l.cidade + ', ' + l.uf),
          contato ? h('p', { class: 'rt-om-contato small muted mb-0' }, contato) : null,
          h('p', { class: 'small mb-0' }, l.site ? h('a', { href: l.site, target: '_blank', rel: 'noopener' }, 'Site oficial') : null));
        lista.appendChild(li);
      });
      if (!itens.length) lista.appendChild(h('li', { class: 'vazio' }, 'Nenhuma Capitania encontrada com esse filtro.'));
      info.textContent = base
        ? (filtrando ? itens.length + ' resultado(s)' : 'Mais próximas de ' + base.rotulo + (base.exata ? '' : ' (a partir da capital do estado)') + '. Distâncias em linha reta; a jurisdição é por município.')
        : (filtrando ? itens.length + ' resultado(s)' : 'Informe seu estado ou localização nas configurações para ver as mais próximas primeiro. Ordem atual: por estado.');
      verMais.hidden = filtrando || itens.length <= 6;
      verMais.textContent = estado.todas ? 'Mostrar só as primeiras' : 'Mostrar todas as ' + itens.length;
    }

    var cfg = R.configurado();
    caixa.appendChild(h('h3', null, 'Capitanias, Delegacias e Agências'));
    caixa.appendChild(h('p', null, 'São ' + oms.length + ' organizações militares nesta lista, de todo o litoral e das águas interiores. Contatos e horários mudam: confira o site antes de ir.'));
    if (!cfg.base) caixa.appendChild(h('p', { class: 'rt-convite small' }, 'Diga onde você vai velejar para ver a Capitania mais próxima primeiro. ',
      h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { VL.config.abrir(); } }, 'Abrir configurações')));
    caixa.appendChild(h('div', { class: 'rt-om-filtros' }, h('div', { class: 'field mb-0' }, selUF), h('div', { class: 'field mb-0' }, busca)));
    caixa.appendChild(info);
    caixa.appendChild(lista);
    caixa.appendChild(h('div', { class: 'btn-row mt-4' }, verMais));
    pintar();
    return { atualizar: pintar };
  }

  R.agendar = function (alvo) {
    var A = R.dados().agendamento;
    alvo.appendChild(h('h2', null, 'Como achar e agendar a prova em qualquer Capitania'));
    alvo.appendChild(h('p', { class: 'lead' }, 'O caminho é parecido em todo o Brasil. Os detalhes (horários, dias de prova, WhatsApp) mudam de Capitania para Capitania: confirme na que você escolher.'));
    var atual = 'am';
    var seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Escolha a habilitação' });
    var bAM = h('button', { type: 'button', 'aria-pressed': 'true' }, 'Arrais-Amador e Mestre-Amador');
    var bC = h('button', { type: 'button', 'aria-pressed': 'false' }, 'Capitão-Amador');
    seg.appendChild(bAM); seg.appendChild(bC);
    var corpo = h('div', { class: 'rt-agenda' });
    function pintar() {
      bAM.setAttribute('aria-pressed', String(atual === 'am')); bC.setAttribute('aria-pressed', String(atual === 'cpa'));
      corpo.innerHTML = '';
      corpo.appendChild(passos(atual === 'am' ? A.arrais_mestre : A.capitao));
    }
    bAM.addEventListener('click', function () { atual = 'am'; pintar(); });
    bC.addEventListener('click', function () { atual = 'cpa'; pintar(); });
    alvo.appendChild(seg);
    alvo.appendChild(corpo);
    pintar();
    alvo.appendChild(h('div', { class: 'rt-oficiais' }, h('h3', null, 'Páginas oficiais'),
      h('ul', { class: 'fontes-lista' }, A.oficiais.map(function (o) { return h('li', null, h('a', { href: o.url, target: '_blank', rel: 'noopener' }, o.txt)); }))));
    var caps = h('div', { class: 'rt-caps' });
    alvo.appendChild(caps);
    return capitanias(caps);
  };
})();
