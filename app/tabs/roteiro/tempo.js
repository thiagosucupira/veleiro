/* Roteiro: "Linha do tempo no seu ritmo". Escada (Gantt) em SVG com a duração de cada etapa, calculada a partir das horas de
   estudo e prática e do ritmo semanal (VL.settings 'ritmoHoras'), com o controle deslizante ali mesmo. A prova de Capitão-Amador
   aparece com a sua janela de calendário. */
(function () {
  'use strict';
  var h = VL.h;
  var R = VL.roteiro, S = R.S;

  function rotuloEixo(sem, passo) {
    if (sem === 0) return 'início';
    if (passo < 52) return Math.round(sem / 4.345) + (Math.round(sem / 4.345) === 1 ? ' mês' : ' meses');
    var a = sem / 52;
    return VL.fmt.num(a, a % 1 ? 1 : 0) + (a === 1 ? ' ano' : ' anos');
  }
  function curto(sem) {
    if (sem < 1) return '< 1 sem.';
    if (sem < 8) return Math.round(sem) + ' sem.';
    var m = sem / 4.345;
    if (m < 24) return Math.round(m) + ' meses';
    return VL.fmt.num(m / 12, 1) + ' anos';
  }

  /** Monta a seção. ctx = { selecionar(id, opts) }. Devolve { atualizar() }. */
  R.tempo = function (alvo, ctx) {
    var caixa = h('div', { class: 'rt-gantt' });
    var saida = h('output', { for: 'rt-ritmo', class: 'rt-ritmo-v' });
    var total = h('p', { class: 'rt-total', 'aria-live': 'polite' });
    var faixa = h('input', { type: 'range', id: 'rt-ritmo', min: '2', max: '20', step: '1', 'aria-describedby': 'rt-total' });
    total.id = 'rt-total';
    faixa.value = String(Math.max(2, Math.min(20, Math.round(R.ritmo()))));
    faixa.addEventListener('input', function () { VL.settings.set('ritmoHoras', Number(faixa.value)); });

    alvo.appendChild(h('h2', null, 'Linha do tempo no seu ritmo'));
    alvo.appendChild(h('p', { class: 'lead' }, 'Quanto tempo leva a escada inteira? Depende de quantas horas por semana você consegue dedicar ao estudo e à prática. Mexa no controle e veja o roteiro se ajustar.'));
    alvo.appendChild(h('div', { class: 'rt-ritmo' },
      h('label', { for: 'rt-ritmo', class: 'rt-ritmo-rot' }, 'Horas por semana para estudar e praticar'),
      h('div', { class: 'rt-ritmo-linha' }, faixa, saida), total));
    var inst = VL.ui.instrumento({ titulo: 'Cada barra é uma etapa; elas aparecem em sequência.' });
    inst.corpo.appendChild(caixa);
    inst.legenda.appendChild(h('span', { class: 'rt-leg-chaves', 'aria-hidden': 'true' },
      h('span', null, h('i', { class: 'rt-k rt-k-feita' }), 'concluída'),
      h('span', null, h('i', { class: 'rt-k rt-k-atual' }), 'você está aqui'),
      h('span', null, h('i', { class: 'rt-k rt-k-futura' }), 'a fazer'),
      h('span', null, h('i', { class: 'rt-k rt-k-espera' }), 'espera pela prova de Capitão')));
    alvo.appendChild(inst.raiz);

    var notas = h('div', { class: 'rt-notas-tempo' });
    notas.appendChild(h('p', { class: 'small muted' }, 'Como o gráfico é calculado: horas de estudo e de prática de cada etapa (estimativas do app) divididas pelo seu ritmo semanal. Cada dia de mar conta como ' + R.dados().horasPorDiaDeMar + ' horas, como no “dia a bordo” do RYA. ',
      R.fonte('internacional-51')));
    notas.appendChild(h('p', { class: 'small muted' }, 'Os degraus se sobrepõem na vida real (você pode estudar para o Mestre enquanto embarca como tripulante), e este gráfico soma tudo em sequência. Trate o total como um teto, e não como uma promessa. Ele depende também de achar barcos e janelas de tempo bom.'));
    notas.appendChild(R.lista([
      { html: '<strong>A prova de Capitão-Amador tem calendário.</strong> As inscrições ocorrem, em princípio, em fevereiro e agosto, com exames em abril e outubro; as datas podem mudar. A barra hachurada mostra uma espera típica, que pode ser de dois a oito meses conforme o dia em que você terminar de estudar. Aproveite essa espera para somar milhas.', ref: 'normas-77' },
      { html: 'Os exames de Arrais e de Mestre são programados por cada Capitania, Delegacia ou Agência: as datas variam de uma para outra.', ref: 'taxas-34' },
    ], 'rt-fatos-tempo'));
    alvo.appendChild(notas);

    var pat = null;

    function desenhar() {
      var etapas = R.etapas(), n = etapas.length;
      var W = Math.max(320, Math.min(1100, Math.round(caixa.clientWidth || 720)));
      var estreito = W < 620;
      var sem = etapas.map(function (e) { return R.semanas(e); });
      var ini = [], acum = 0;
      sem.forEach(function (s) { ini.push(acum); acum += s; });
      var totalSem = acum;
      var iCpa = -1; etapas.forEach(function (e, k) { if (e.tempo.calendario) iCpa = k; });
      var espera = R.dados().esperaProvaCapitaoSemanas;
      var dominio = Math.max(totalSem, iCpa >= 0 ? ini[iCpa] + sem[iCpa] + espera : 0);

      var padL = estreito ? 10 : 236, padR = estreito ? 38 : 84, topo = 38, alt = estreito ? 54 : 34;
      var area = W - padL - padR;
      var esc = area / dominio;
      var H = topo + n * alt + 14;
      var atual = R.indiceAtual();

      var svg = S('svg', { class: 'rt-gsvg', viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'group', 'aria-label': 'Linha do tempo das doze etapas no seu ritmo' });
      svg.appendChild(S('title', { text: 'Linha do tempo das doze etapas, no ritmo de ' + R.ritmo() + ' horas por semana' }));
      svg.appendChild(S('defs', null, S('pattern', { id: 'rt-hachura', patternUnits: 'userSpaceOnUse', width: 7, height: 7, patternTransform: 'rotate(45)' }, S('line', { x1: 0, y1: 0, x2: 0, y2: 7, class: 'rt-hach-l' }))));

      /* eixo */
      var passos = [4.345, 13.035, 26.07, 52, 104, 156, 260, 520], passo = passos[passos.length - 1];
      for (var p = 0; p < passos.length; p++) { if (dominio / passos[p] <= (estreito ? 5 : 9)) { passo = passos[p]; break; } }
      var eixo = S('g', { class: 'rt-eixo', 'aria-hidden': 'true' });
      for (var t = 0; t * passo <= dominio * 1.001; t++) {
        var x = padL + t * passo * esc;
        eixo.appendChild(S('line', { x1: x, y1: topo - 6, x2: x, y2: H - 10, class: 'rt-grade' }));
        eixo.appendChild(S('text', { x: x, y: topo - 12, 'text-anchor': t === 0 ? 'start' : 'middle', text: rotuloEixo(t * passo, passo) }));
      }
      svg.appendChild(eixo);

      /* linhas */
      etapas.forEach(function (e, k) {
        var y = topo + k * alt, estado = R.estadoDe(k);
        var bx = padL + ini[k] * esc, bw = Math.max(4, sem[k] * esc);
        var yb = estreito ? y + 30 : y + (alt - 14) / 2;
        var g = S('g', { class: 'rt-gl', tabindex: 0, role: 'link', 'data-id': e.id, 'data-estado': estado, 'aria-label': 'Etapa ' + e.n + ', ' + e.titulo + ', ' + R.durTxt(sem[k]) + '. Abrir a etapa.' });
        g.appendChild(S('rect', { x: 0, y: y, width: W, height: alt, class: 'rt-hit' }));
        g.appendChild(S('line', { x1: 0, y1: y + alt, x2: W, y2: y + alt, class: 'rt-fio' }));
        var tx = estreito ? 10 : 10, ty = estreito ? y + 18 : y + alt / 2 + 5;
        var rot = S('text', { x: tx, y: ty, class: 'rt-glab' });
        rot.appendChild(S('tspan', { class: 'rt-gn', text: e.n + '  ' }));
        rot.appendChild(S('tspan', { text: e.rotulo }));
        if (estado === 'atual') rot.appendChild(S('tspan', { class: 'rt-aqui', text: '  você está aqui' }));
        g.appendChild(rot);
        g.appendChild(S('rect', { x: bx, y: yb, width: bw, height: 14, rx: 3, class: 'rt-barra', 'data-estado': estado }));
        if (e.tipo === 'cha') g.appendChild(S('path', { d: 'M' + (bx + bw) + ' ' + (yb - 3) + 'l6 10l-6 10l-6-10z', class: 'rt-prova' }));
        var vtxt = curto(sem[k]);
        var vx = bx + bw + (e.tipo === 'cha' ? 12 : 8), anc = 'start';
        if (k === iCpa) vx = bx + bw + espera * esc + 8;
        if (vx > W - 6 - vtxt.length * 6.5) { vx = bx - 8; anc = 'end'; }
        g.appendChild(S('text', { x: estreito ? W - 46 : vx, y: estreito ? ty : yb + 11.5, class: 'rt-gval', 'text-anchor': estreito ? 'end' : anc, text: estreito ? vtxt : vtxt }));
        if (k === iCpa) {
          g.appendChild(S('rect', { x: bx + bw, y: yb, width: espera * esc, height: 14, rx: 3, class: 'rt-espera' }));
          if (!estreito && espera * esc > 120) g.appendChild(S('text', { x: bx + bw + 8, y: yb + 11, class: 'rt-gespera', text: 'janela da prova' }));
        }
        g.addEventListener('click', function (ev) { ev.preventDefault(); ctx.selecionar(e.id, { rolar: true, forcar: true }); });
        g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ctx.selecionar(e.id, { rolar: true, forcar: true }); } });
        svg.appendChild(g);
      });

      /* fim */
      var xf = padL + totalSem * esc;
      svg.appendChild(S('line', { x1: xf, y1: topo - 6, x2: xf, y2: H - 10, class: 'rt-fim' }));

      caixa.innerHTML = '';
      caixa.appendChild(svg);

      var horas = R.totalHoras();
      saida.textContent = VL.fmt.num(R.ritmo()) + ' h por semana';
      total.innerHTML = '';
      total.appendChild(document.createTextNode('As 12 etapas somam cerca de '));
      total.appendChild(h('strong', null, VL.fmt.num(Math.round(horas)) + ' horas'));
      total.appendChild(document.createTextNode(', ou '));
      total.appendChild(h('strong', null, R.durTxt(totalSem)));
      total.appendChild(document.createTextNode(' neste ritmo.'));
      if (document.activeElement !== faixa) faixa.value = String(Math.max(2, Math.min(20, Math.round(R.ritmo()))));
    }

    var ro = null;
    if (window.ResizeObserver) {
      var ultimo = 0;
      ro = new ResizeObserver(function () { var w = caixa.clientWidth; if (Math.abs(w - ultimo) >= 8) { ultimo = w; desenhar(); } });
      ro.observe(caixa);
    }
    desenhar();
    return { atualizar: desenhar, destruir: function () { if (ro) ro.disconnect(); } };
  };
})();
