/* Flashcards com repetição espaçada (algoritmo SM-2).
   Baralho: VL.dado('flashcards/<id>', {id, titulo, cartas:[{id, frente, verso, dica?, ref?, intl?, figura?:{svg}}]}) */
(function () {
  'use strict';
  var h = VL.h;
  var DIA = 86400000;
  function hoje() { return VL.hoje(); }
  function somaDias(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setTime(d.getTime() + n * DIA); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function estado() { return VL.store.get('srs', {}) || {}; }
  function salvar(s) { VL.store.set('srs', s); }
  function cartasVisiveis(deck) { var intl = VL.settings.get('intl'); return (deck.cartas || []).filter(function (c) { return intl || !c.intl; }); }

  /** Calcula o próximo estado SM-2. nota: 0 errei, 3 difícil, 4 bom, 5 fácil */
  function proximo(st, nota) {
    st = Object.assign({ ef: 2.5, int: 0, rep: 0, lapsos: 0 }, st || {});
    if (nota < 3) { st.rep = 0; st.int = 1; st.lapsos++; }
    else {
      if (st.rep === 0) st.int = nota === 5 ? 3 : 1;
      else if (st.rep === 1) st.int = nota === 3 ? 4 : (nota === 5 ? 8 : 6);
      else st.int = Math.max(1, Math.round(st.int * (nota === 3 ? Math.max(1.2, st.ef - 0.3) : (nota === 5 ? st.ef + 0.25 : st.ef))));
      st.rep++;
    }
    st.ef = Math.max(1.3, st.ef + (0.1 - (5 - nota) * (0.08 + (5 - nota) * 0.02)));
    st.due = somaDias(st.int);
    st.ult = hoje();
    return st;
  }
  function rotuloIntervalo(d) { return d <= 1 ? '1 dia' : (d < 30 ? d + ' dias' : (d < 365 ? Math.round(d / 30) + ' meses' : VL.fmt.num(d / 365, 1) + ' anos')); }

  VL.srs = {};
  VL.srs.stats = function (deck) {
    var s = estado()[deck.id] || {}, hj = hoje(), r = { total: 0, novas: 0, devidas: 0, aprendendo: 0, maduras: 0 };
    cartasVisiveis(deck).forEach(function (c) {
      r.total++;
      var st = s[c.id];
      if (!st) r.novas++;
      else { if (st.due <= hj) r.devidas++; if (st.int >= 21) r.maduras++; else r.aprendendo++; }
    });
    return r;
  };
  /** Previsão de revisões nos próximos n dias (para gráfico). */
  VL.srs.previsao = function (deck, n) {
    var s = estado()[deck.id] || {}, out = [];
    for (var i = 0; i < n; i++) out.push(0);
    cartasVisiveis(deck).forEach(function (c) {
      var st = s[c.id]; if (!st) return;
      var dias = Math.round((new Date(st.due + 'T12:00').getTime() - new Date(hoje() + 'T12:00').getTime()) / DIA);
      if (dias < 0) dias = 0;
      if (dias < n) out[dias]++;
    });
    return out;
  };

  /** Sessão de estudo. opts: {titulo, aoTerminar} */
  VL.srs.mount = function (el, deck, opts) {
    opts = opts || {};
    var limite = Number(VL.settings.get('novosPorDia')) || 20;
    var novosHoje = VL.store.get('srsNovos', {}) || {};
    if (novosHoje.d !== hoje()) novosHoje = { d: hoje() };
    var jaNovos = novosHoje[deck.id] || 0;
    var s = estado(); s[deck.id] = s[deck.id] || {};
    var hj = hoje();
    var todas = cartasVisiveis(deck);
    var devidas = todas.filter(function (c) { var st = s[deck.id][c.id]; return st && st.due <= hj; })
      .sort(function (a, b) { return s[deck.id][a.id].due < s[deck.id][b.id].due ? -1 : 1; });
    var novas = todas.filter(function (c) { return !s[deck.id][c.id]; }).slice(0, Math.max(0, limite - jaNovos));
    var fila = devidas.concat(novas);
    var feitas = 0;
    var raiz = h('div', { class: 'flash' });
    el.appendChild(raiz);

    function cabecalho() {
      var st = VL.srs.stats(deck);
      return h('div', { class: 'spread' },
        h('p', { class: 'muted mb-0' }, (opts.semTitulo ? '' : (opts.titulo || deck.titulo) + ' · ') + fila.length + ' na fila de hoje'),
        h('p', { class: 'muted mb-0 small' }, st.novas + ' novas · ' + st.aprendendo + ' aprendendo · ' + st.maduras + ' maduras'));
    }
    function passo() {
      raiz.innerHTML = '';
      if (!fila.length) return fim();
      var c = fila[0];
      var st = s[deck.id][c.id];
      raiz.appendChild(cabecalho());
      raiz.appendChild(VL.ui.medidor(feitas / (feitas + fila.length)));
      var frente = h('div', { class: 'flash-face' }, h('div', { class: 'flash-frente-txt', html: c.frente }), c.dica ? h('p', { class: 'flash-dica mb-0' }, 'Dica: ' + c.dica) : null, h('p', { class: 'flash-dica mb-0' }, 'Toque no cartão ou aperte espaço para virar.'));
      if (c.figura && c.figura.svg) { var fg = h('div'); fg.innerHTML = c.figura.svg; frente.insertBefore(fg, frente.firstChild); }
      var verso = h('div', { class: 'flash-face flash-face-verso' }, h('div', { html: c.verso }), c.ref ? h('p', { class: 'fonte-ref mb-0' }, 'Referência: ' + c.ref) : null);
      var carta = h('div', { class: 'flash-carta', tabindex: '0', role: 'button', 'aria-label': 'Virar cartão', 'data-virada': '0' }, h('div', { class: 'flash-inner' }, frente, verso));
      var notas = h('div', { class: 'flash-notas', hidden: true });
      [[0, 'Errei', 'btn-danger'], [3, 'Difícil', 'btn-ghost'], [4, 'Bom', 'btn-primary'], [5, 'Fácil', 'btn-ghost']].forEach(function (n, i) {
        var prev = proximo(st, n[0]);
        notas.appendChild(h('button', { type: 'button', class: 'btn ' + n[2], onclick: function () { avaliar(n[0]); } }, n[1], h('small', null, (i + 1) + ' · ' + (n[0] < 3 ? 'de novo hoje' : rotuloIntervalo(prev.int)))));
      });
      function virar() { carta.setAttribute('data-virada', carta.getAttribute('data-virada') === '1' ? '0' : '1'); notas.hidden = false; }
      carta.addEventListener('click', virar);
      raiz.appendChild(carta);
      raiz.appendChild(notas);
      function avaliar(nota) {
        var novo = !st;
        s[deck.id][c.id] = proximo(st, nota);
        salvar(s);
        if (novo) { novosHoje[deck.id] = (novosHoje[deck.id] || 0) + 1; VL.store.set('srsNovos', novosHoje); }
        fila.shift();
        if (nota < 3) fila.push(c); else feitas++;
        VL.progress.marcarEstudo();
        passo();
      }
      teclado = function (e) {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); virar(); }
        else if (!notas.hidden && /^[1-4]$/.test(e.key)) { avaliar([0, 3, 4, 5][Number(e.key) - 1]); }
      };
    }
    var teclado = null;
    var ouvinte = function (e) { if (teclado) teclado(e); };
    document.addEventListener('keydown', ouvinte);
    VL.aoSair(function () { document.removeEventListener('keydown', ouvinte); });

    function fim() {
      teclado = null;
      var st = VL.srs.stats(deck);
      var prev = VL.srs.previsao(deck, 7);
      raiz.appendChild(h('div', { class: 'resultado' },
        h('h2', null, feitas ? 'Sessão concluída: ' + feitas + (feitas === 1 ? ' cartão' : ' cartões') : 'Nada para revisar agora'),
        h('p', null, st.novas ? 'Ainda há ' + st.novas + ' cartões novos neste baralho. O limite diário de novos é ' + limite + ' (mude em Configurações).' : 'Você já viu todos os cartões deste baralho.'),
        h('p', { class: 'mb-0' }, 'Revisões nos próximos dias: ' + prev.map(function (n, i) { return (i === 0 ? 'hoje ' : (i === 1 ? 'amanhã ' : 'D+' + i + ' ')) + n; }).join(' · '))));
      var acoes = h('div', { class: 'btn-row' });
      if (st.novas) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { var nh = VL.store.get('srsNovos', {}) || {}; nh.d = hoje(); nh[deck.id] = Math.max(0, (nh[deck.id] || 0) - limite); VL.store.set('srsNovos', nh); el.innerHTML = ''; VL.srs.mount(el, deck, opts); } }, 'Estudar mais ' + Math.min(limite, st.novas) + ' novos'));
      if (opts.aoTerminar) acoes.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: opts.aoTerminar }, 'Voltar'));
      raiz.appendChild(acoes);
    }
    passo();
  };
  VL.srs._proximo = proximo; // exposto para testes
})();
