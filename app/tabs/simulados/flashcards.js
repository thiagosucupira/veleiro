/* Simulados: lista de baralhos (#/simulados/flashcards) e sessão de estudo (#/simulados/flashcards/<nivel|baralho>). */
(function () {
  'use strict';
  var h = VL.h;
  var S = VL.simulados = VL.simulados || {};

  function linhaBaralho(deck, rotulo, destaque) {
    var st = VL.srs.stats(deck);
    var primario = st.devidas > 0;
    return h('li', { class: 'sim-deck' + (destaque ? ' sim-deck-todos' : '') },
      h('div', { class: 'sim-deck-info' },
        h('h3', null, rotulo || deck.titulo),
        h('ul', { class: 'sim-deck-stats', 'aria-label': 'Situação do baralho' },
          h('li', null, h('strong', null, String(st.devidas)), ' para revisar hoje'),
          h('li', null, h('strong', null, String(st.novas)), st.novas === 1 ? ' nova' : ' novas'),
          h('li', null, h('strong', null, String(st.maduras)), st.maduras === 1 ? ' madura' : ' maduras'),
          h('li', { class: 'muted' }, S.plural(st.total, 'cartão', 'cartões'))),
        h('div', { class: 'sim-deck-meter', title: 'Cartões maduros (intervalo de 21 dias ou mais)' }, VL.ui.medidor(st.total ? st.maduras / st.total : 0, true))),
      h('a', { class: 'btn ' + (primario ? 'btn-primary' : 'btn-ghost'), href: VL.link('simulados/flashcards/' + (deck.parte || deck.id)), 'aria-label': 'Estudar ' + (rotulo || deck.titulo) }, 'Estudar'));
  }

  S.listaBaralhos = function (raiz) {
    S.titulo('Flashcards');
    raiz.appendChild(S.trilha([{ rotulo: 'Simulados', rota: 'simulados' }, { rotulo: 'Flashcards' }]));
    raiz.appendChild(VL.ui.cabecalho('Flashcards', 'Repetição espaçada: cada cartão volta no dia em que você está perto de esquecer. Poucos minutos por dia rendem mais do que horas de uma vez só.'));
    var carregando = VL.ui.carregando('Abrindo os baralhos…');
    raiz.appendChild(carregando);
    return S.baralhos().then(function (itens) {
      if (!raiz.isConnected) return;
      carregando.remove();
      if (!itens.length) {
        raiz.appendChild(S.vazio('Os baralhos ainda estão em preparação',
          'Os flashcards de cada nível são escritos e revisados pela comunidade. Enquanto isso, pratique com as questões comentadas.',
          [S.botaoLink('Ir aos simulados', 'simulados', 'btn-primary')]));
        raiz.appendChild(VL.ui.avisoLegal());
        return;
      }
      var limite = Number(VL.settings.get('novosPorDia')) || 20;
      raiz.appendChild(h('section', { class: 'sim-como', 'aria-labelledby': 'sim-como-t' },
        h('h2', { id: 'sim-como-t', class: 'sim-h2' }, 'Como estudar'),
        h('ol', null,
          h('li', null, 'Leia a frente do cartão e tente lembrar a resposta antes de virar.'),
          h('li', null, 'Vire o cartão com um toque, ou com ', h('kbd', null, 'Espaço'), ' ou ', h('kbd', null, 'Enter'), '.'),
          h('li', null, 'Avalie com honestidade: Errei, Difícil, Bom ou Fácil (teclas ', h('kbd', null, '1'), ' a ', h('kbd', null, '4'), '). Quanto mais fácil, mais tempo até ele voltar.'),
          h('li', null, 'Entram até ' + S.plural(limite, 'cartão novo', 'cartões novos') + ' por dia em cada nível (os baralhos de um nível dividem o mesmo limite). Mude o limite em Configurações.'))));
      var pn = S.porNivel(itens);
      var semBaralho = [];
      S.NIVEIS.forEach(function (n) {
        var g = pn.grupos[n.id];
        if (!g) { semBaralho.push(n.nome); return; }
        var lista = h('ul', { class: 'sim-decks' });
        var juntos = S.juntar(n.id, g);
        /* o nível inteiro é um baralho só (id = nível); com mais de um baralho, cada um também pode ser estudado à parte */
        if (g.length === 1) lista.appendChild(linhaBaralho(juntos, g[0].deck.titulo || n.nome));
        else {
          lista.appendChild(linhaBaralho(juntos, 'Todos os baralhos de ' + n.nome, true));
          g.forEach(function (it) { if (it.deck.id !== n.id) lista.appendChild(linhaBaralho(S.parte(n.id, g, it.deck.id))); });
        }
        raiz.appendChild(h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-fc-' + n.id }, h('h2', { id: 'sim-fc-' + n.id }, n.nome), lista));
      });
      if (pn.outros.length) {
        var l2 = h('ul', { class: 'sim-decks' });
        pn.outros.forEach(function (it) { l2.appendChild(linhaBaralho(it.deck)); });
        raiz.appendChild(h('section', { class: 'sim-secao', 'aria-labelledby': 'sim-fc-outros' }, h('h2', { id: 'sim-fc-outros' }, 'Outros baralhos'), l2));
      }
      if (semBaralho.length) raiz.appendChild(h('p', { class: 'small muted mt-6' }, 'Ainda sem baralho: ' + semBaralho.join(', ') + '.'));
      raiz.appendChild(VL.ui.avisoLegal());
    });
  };

  S.estudarBaralho = function (raiz, id) {
    var n = S.nivel(id);
    raiz.appendChild(S.trilha([{ rotulo: 'Simulados', rota: 'simulados' }, { rotulo: 'Flashcards', rota: 'simulados/flashcards' }, { rotulo: n ? n.nome : 'Baralho' }]));
    var carregando = VL.ui.carregando('Abrindo o baralho…');
    raiz.appendChild(carregando);
    var qtdBaralhos = 0;
    var achar = S.baralhos().then(function (itens) {
      if (n) {
        var g = S.porNivel(itens).grupos[id];
        qtdBaralhos = g ? g.length : 0;
        return g && g.length ? S.juntar(id, g) : null;
      }
      var it = itens.filter(function (x) { return x.deck.id === id || x.meta.id === id; })[0];
      if (!it) return S.baralho({ id: id });
      /* baralho de um nível: mesmo estado do "todos os baralhos" (ver S.parte) */
      var nvl = it.deck.nivel || it.meta.nivel, gr = nvl && S.nivel(nvl) ? S.porNivel(itens).grupos[nvl] : null;
      return (gr && S.parte(nvl, gr, it.deck.id)) || it.deck;
    });
    return achar.then(function (deck) {
      if (!raiz.isConnected) return;
      carregando.remove();
      if (!deck || !S.visiveis(deck.cartas).length) {
        S.titulo('Flashcards');
        raiz.appendChild(VL.ui.cabecalho('Flashcards' + (n ? ': ' + n.nome : '')));
        raiz.appendChild(S.vazio(n ? 'O baralho de ' + n.nome + ' ainda está em preparação' : 'Baralho não encontrado',
          n ? 'Os cartões deste nível estão sendo escritos. Enquanto isso, pratique com as questões comentadas.' : 'Confira o endereço ou escolha um baralho da lista.',
          [S.botaoLink('Ver os baralhos', 'simulados/flashcards', 'btn-primary'), n ? S.botaoLink('Praticar questões', 'simulados/' + n.id, 'btn-ghost') : null]));
        return;
      }
      var rotulo = n ? n.nome : deck.titulo;
      S.titulo('Flashcards: ' + rotulo);
      var atual = raiz.querySelector('.sim-trilha [aria-current="page"]'); if (atual) atual.textContent = rotulo;
      raiz.appendChild(h('header', { class: 'sim-quiz-cab' }, h('h1', { class: 'sim-h1-quiz' }, 'Flashcards: ' + rotulo)));
      var area = h('div', { class: 'sim-flash' });
      raiz.appendChild(area);
      /* linha de situação do núcleo: "<titulo> · N na fila de hoje" — sem repetir o nome do título da página */
      var nv = S.nivel(deck.nivel);
      var linha = n ? (qtdBaralhos > 1 ? qtdBaralhos + ' baralhos numa fila só' : 'Baralho do nível') : (nv ? nv.nome : 'Baralho');
      VL.srs.mount(area, deck, { titulo: linha, aoTerminar: function () { VL.go('simulados/flashcards'); } });
    });
  };
})();
