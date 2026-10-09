/* Conversão de rumos e marcações: verdadeiro (Rv), magnético (Rmg) e da agulha (Rag).
   Declinação magnética (Dec mg, E/W, atualizada pelo ano a partir da anotação da carta) e desvio da agulha
   (Dag, E/W, pela tabela/curva de desvios, com interpolação). Rosa com três anéis (verdadeiro, magnético e
   da agulha): arraste a proa ou a marcação e leia o valor em cada anel. Modo exercício com problemas gerados
   (rumos, marcações, atualização da declinação, desvio por alinhamento) e resolução comentada.

   Convenção (Manual de Navegação da Marinha do Brasil, Vol. I, DHN, 2ª rev. 2023, item 3.2.5):
     Rv = Rmg ± Dec mg   e   Rmg = Rag ± Dag,  com E positivo e W negativo;
     valores aproximados a 0,5°; o desvio se obtém com a PROA (nunca com a marcação);
     ao entrar na curva com o Rag, usa-se o Rag como se fosse o Rmg (Manual, 3.2.5, exemplo 2).

   opts (todas opcionais):
     modo:        'explorar' (padrão) | 'exercicio'
     tipo:        'rumo' (padrão) | 'marcacao'
     conhecido:   'ag' (padrão) | 'mg' | 'v'   — qual valor o aluno conhece
     valor:       valor conhecido em graus (padrão 85)
     proa:        proa da agulha (Rag) usada nas marcações (padrão 110)
     ano:         ano da navegação (padrão: ano atual)
     declinacao:  {graus:22, min:10, lado:'W', ano:2025, varMin:7, varLado:'W'} (a mesma da carta-nautica)
     desvios:     tabela [[proa, desvio], …] com desvio E positivo/W negativo (padrão: exemplo de 30 em 30°)
     exercicio:   tipo inicial: 'rag-rv' (padrão) | 'rv-rag' | 'dec' | 'marc' | 'marc-inv' | 'alinhamento'

   Exemplo de bloco de lição:
     {t:'widget', w:'agulha-calc', opts:{conhecido:'v', valor:78}}
     {t:'widget', w:'agulha-calc', opts:{modo:'exercicio', exercicio:'marc'}} */
(function () {
  'use strict';
  var h = VL.h;
  var RAD = Math.PI / 180;

  var DEC_PADRAO = { graus: 22, min: 10, lado: 'W', ano: 2025, varMin: 7, varLado: 'W' };
  // tabela de desvios de EXEMPLO (agulha de antepara de um veleiro, já compensada: |Dag| ≤ 4°)
  var DESVIOS_PADRAO = [[0, -1], [30, 1], [60, 3], [90, 4], [120, 3], [150, 3], [180, 2], [210, 1], [240, -1], [270, -3], [300, -4], [330, -3]];

  /* ---------------- matemática e formatação ---------------- */
  function norm360(a) { a = a % 360; if (a < 0) a += 360; return Math.abs(a - 360) < 1e-9 ? 0 : a; }
  function difAng(a, b) { var d = norm360(a - b); return d > 180 ? d - 360 : d; }
  function meio(x) { var r = Math.round(Math.abs(x) * 2 + 1e-9) / 2; return x < 0 ? -r : r; }   // meio grau, simétrico para E e W
  function num(x, c) { return VL.fmt.num(x, c); }
  function fmtR(v) { // rumo/marcação: 085°, 098,5°
    var r = meio(norm360(v)); if (r >= 360) r -= 360;
    var i = Math.floor(r);
    return String(i).padStart(3, '0') + (r - i ? ',5' : '') + '°';
  }
  function fmtG(x) { x = Math.abs(meio(x)); return (x % 1 ? num(x, 1) : String(x)) + '°'; }   // 2,5°  23°
  function fmtEW(x) { x = meio(x); return x === 0 ? '0°' : fmtG(x) + ' ' + (x > 0 ? 'E' : 'W'); }
  function fmtGM(dec) {
    var a = Math.abs(dec), g = Math.floor(a + 1e-9), m = Math.round((a - g) * 60); if (m === 60) { g++; m = 0; }
    return g + '°' + String(m).padStart(2, '0') + "'" + (dec < 0 ? 'W' : dec > 0 ? 'E' : '');
  }
  function decBase(D) { return (D.graus + D.min / 60) * (D.lado === 'E' ? 1 : -1); }
  function varAnual(D) { return (D.varMin / 60) * (D.varLado === 'E' ? 1 : -1); }
  function decNoAno(D, ano) { return decBase(D) + varAnual(D) * (ano - D.ano); }
  function lerNum(v) { if (v == null) return NaN; v = String(v).trim().replace(',', '.').replace(/[\u2212\u2013]/g, '-'); return v === '' ? NaN : Number(v); }
  /** Lê "3E", "2,5 W", "-2", "+1" → número com E positivo. */
  function lerEW(v) {
    var s = String(v || '').trim().toUpperCase().replace(',', '.').replace('°', '').replace(/[\u2212\u2013]/g, '-');
    var m = s.match(/^([+-]?\d+(?:\.\d+)?)\s*([EWLO])?$/);
    if (!m) return NaN;
    var n = Number(m[1]);
    if (m[2] === 'E' || m[2] === 'L') n = Math.abs(n); else if (m[2] === 'W' || m[2] === 'O') n = -Math.abs(n);
    return n;
  }
  function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function escolha(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function intl(txt) { return VL.settings.get('intl') ? ' (' + txt + ')' : ''; }
  function decTexto(D) { return D.graus + '°' + String(D.min).padStart(2, '0') + "'" + D.lado + ' (' + D.ano + '), variação anual ' + D.varMin + "'" + D.varLado; }

  /** Desvio por interpolação linear na tabela. Devolve {v (exato), a:[proa, dsv], b:[proa, dsv], exato:bool}. */
  function desvioDe(tab, proa) {
    proa = norm360(proa);
    var n = tab.length;
    for (var i = 0; i < n; i++) {
      var a = tab[i], b = tab[(i + 1) % n], pa = a[0], pb = i + 1 < n ? b[0] : b[0] + 360;
      var p = proa < pa ? proa + 360 : proa;
      if (p >= pa && p <= pb) {
        if (Math.abs(p - pa) < 1e-9) return { v: a[1], a: a, b: a, exato: true, proa: proa };
        if (Math.abs(p - pb) < 1e-9) return { v: b[1], a: b, b: b, exato: true, proa: proa };
        return { v: a[1] + (p - pa) / (pb - pa) * (b[1] - a[1]), a: a, b: [pb, b[1]], exato: false, proa: proa };
      }
    }
    return { v: tab[0][1], a: tab[0], b: tab[0], exato: true, proa: proa };
  }
  function sinalTxt(x) { return x > 0 ? '+' + num(x, x % 1 ? 1 : 0) : x < 0 ? '−' + num(-x, -x % 1 ? 1 : 0) : '0'; }
  function n1(x) { return num(Math.round(x * 10) / 10, x % 1 ? 1 : 0); }
  function textoDesvio(info, rotEntrada) {
    // o Manual (3.2.5, exemplo 2) entra na curva com o Rag "como se fosse o Rumo Magnético"
    var e = rotEntrada + ' ' + fmtR(info.proa) + (rotEntrada === 'Rag' ? '; o Manual usa o Rag como se fosse o Rmg, porque a diferença de poucos graus quase não muda o desvio' : '');
    if (info.exato) return 'Entre na tabela com a proa (' + e + '): a tabela dá ' + fmtEW(info.v) + '.';
    var pa = info.a[0], pb = info.b[0], p = info.proa < pa ? info.proa + 360 : info.proa, da = info.a[1], db = info.b[1];
    return 'Entre na tabela com a proa (' + e + '). Ela fica entre ' + fmtR(pa) + ' (' + fmtEW(da) + ') e ' + fmtR(pb) + ' (' + fmtEW(db) + '). ' +
      'Interpolando, com E positivo e W negativo: ' + sinalTxt(da) + ' + ' + n1(p - pa) + '/' + n1(pb - pa) + ' × (' + sinalTxt(db) + ' − (' + sinalTxt(da) + ')) = ' +
      sinalTxt(Math.round(info.v * 10) / 10) + '; então Dag = ' + fmtEW(info.v) + ' (a meio grau).';
  }
  /** "+ 5° (E)" ao somar a correção x; "− 5° (E)" ao subtrair. */
  function somaTxt(x) { x = meio(x); return x === 0 ? ' ± 0°' : (x > 0 ? ' + ' : ' − ') + fmtG(x) + ' (' + (x > 0 ? 'E' : 'W') + ')'; }
  function subTxt(x) { x = meio(x); return x === 0 ? ' ± 0°' : (x > 0 ? ' − ' : ' + ') + fmtG(x) + ' (' + (x > 0 ? 'E' : 'W') + ')'; }
  function decAtualTxt(D, ano) {
    var dec = decNoAno(D, ano), n = ano - D.ano;
    if (n === 0) return 'A carta é do próprio ano: Dec mg = ' + fmtGM(decBase(D)) + ' ≈ ' + fmtEW(dec) + ' (a meio grau).';
    var inc = varAnual(D) * n;
    return 'Dec mg em ' + ano + ' = ' + fmtGM(decBase(D)) + ' (' + D.ano + ') ' + (n > 0 ? '+ ' : '− ') + Math.abs(n) + (Math.abs(n) === 1 ? ' ano' : ' anos') + ' × ' + D.varMin + "'" + D.varLado +
      ' = ' + fmtGM(decBase(D)) + (inc * (decBase(D) < 0 ? -1 : 1) >= 0 ? ' + ' : ' − ') + Math.round(Math.abs(inc) * 60) + "' = " + fmtGM(dec) + ' ≈ ' + fmtEW(dec) + ' (a meio grau).' +
      (D.varLado !== D.lado ? ' A variação anual tem sinal contrário ao da declinação: a declinação diminui com os anos.' : '');
  }

  VL.widgets.define('agulha-calc', {
    css: ['assets/css/widgets/agulha-calc.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var tabIni = (opts.desvios || DESVIOS_PADRAO).map(function (p) { return [norm360(+p[0]), +p[1]]; }).sort(function (a, b) { return a[0] - b[0]; });
      var est = {
        modo: opts.modo === 'exercicio' ? 'exercicio' : 'explorar',
        tipo: opts.tipo === 'marcacao' ? 'marcacao' : 'rumo',
        conhecido: ['ag', 'mg', 'v'].indexOf(opts.conhecido) >= 0 ? opts.conhecido : 'ag',
        valor: opts.valor != null && !isNaN(+opts.valor) ? norm360(+opts.valor) : 85,
        proa: opts.proa != null && !isNaN(+opts.proa) ? norm360(+opts.proa) : 110,
        ano: opts.ano || new Date().getFullYear(),
        dec: Object.assign({}, DEC_PADRAO, opts.declinacao || {}),
        tab: tabIni.map(function (p) { return p.slice(); }),
        manual: null,         // desvio digitado (E +) ou null = pela tabela
        ex: null, acertos: 0, tentativas: 0,
      };
      if (opts.tipo === 'marcacao' && opts.valor == null) est.valor = 327;

      var inst = VL.ui.instrumento({ titulo: 'Conversão de rumos e marcações (Manual de Navegação da MB, Vol. I, item 3.2.5)', controlesAntes: true });
      el.appendChild(inst.raiz);

      /* ---------------- controles do topo ---------------- */
      var modoSeg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['exercicio', 'Exercício']].forEach(function (m) {
        modoSeg.appendChild(h('button', { type: 'button', 'data-m': m[0], 'aria-pressed': String(est.modo === m[0]), onclick: function () { definirModo(m[0]); } }, m[1]));
      });
      var placar = h('span', { class: 'ag-placar', 'aria-live': 'polite' });
      inst.controles.appendChild(h('div', { class: 'ag-topo' }, modoSeg, placar));

      /* ---------------- estrutura ---------------- */
      var colRosa = h('div', { class: 'ag-col-rosa' });
      var colPainel = h('div', { class: 'ag-col-painel' });
      inst.corpo.appendChild(h('div', { class: 'ag-grade' }, colRosa, colPainel));

      /* ---------------- rosa de três anéis (SVG) ---------------- */
      var R1 = 132, R2 = 106, R3 = 80;
      var svg = h('svg', { class: 'ag-svg svg-interativo', viewBox: '-172 -176 344 352', role: 'group', 'aria-label': 'Rosa com três anéis: verdadeiro (externo), magnético (meio) e da agulha (interno). Arraste a linha da proa ou da marcação.' });
      var gAneis = h('g', { class: 'ag-aneis' });
      var gArcos = h('g', { class: 'ag-arcos' });
      var gBarco = h('g', { class: 'ag-barco' }, h('path', { d: 'M0 -30 C 9 -18 10 6 7 24 L -7 24 C -10 6 -9 -18 0 -30 Z', class: 'ag-casco' }));
      var gMarc = h('g', { class: 'ag-raio ag-raio-marc' });
      var linhaMarc = h('line', { x1: 0, y1: 0, class: 'ag-linha-marc' });
      var farol = h('g', { class: 'ag-farol' }, h('path', { d: 'M-4 6 L-2.5 -8 L2.5 -8 L4 6 Z', class: 'ag-farol-torre' }), h('path', { d: 'M0 -8 L9 -15 L9 -1 Z', class: 'ag-farol-luz' }));
      var alcaMarc = h('circle', { r: 11, class: 'ag-alca ag-alca-marc', tabindex: '0', role: 'slider', 'aria-label': 'Marcação do farol', 'aria-valuemin': '0', 'aria-valuemax': '359.5' });
      gMarc.appendChild(linhaMarc); gMarc.appendChild(farol); gMarc.appendChild(alcaMarc);
      var gProa = h('g', { class: 'ag-raio ag-raio-proa' });
      var linhaProa = h('line', { x1: 0, y1: 0, class: 'ag-linha-proa' });
      var alcaProa = h('circle', { r: 11, class: 'ag-alca', tabindex: '0', role: 'slider', 'aria-label': 'Proa do barco', 'aria-valuemin': '0', 'aria-valuemax': '359.5' });
      gProa.appendChild(linhaProa); gProa.appendChild(alcaProa);
      var gTags = h('g', { class: 'ag-tags' });
      var aviso = h('text', { class: 'ag-aviso-svg', 'text-anchor': 'middle', y: 58 });
      svg.appendChild(gAneis); svg.appendChild(gArcos); svg.appendChild(gBarco); svg.appendChild(gMarc); svg.appendChild(gProa); svg.appendChild(gTags); svg.appendChild(aviso);
      var legRosa = h('p', { class: 'ag-leg-rosa' });
      colRosa.appendChild(svg);
      colRosa.appendChild(legRosa);

      function pol(ang, r) { return { x: r * Math.sin(ang * RAD), y: -r * Math.cos(ang * RAD) }; }
      function anel(Rr, off, cls, nome) {
        var g = h('g', { class: 'ag-anel ' + cls });
        g.appendChild(h('circle', { r: Rr, class: 'ag-anel-c' }));
        var d = '';
        for (var a = 0; a < 360; a += 5) {
          var L = a % 10 === 0 ? 7 : 4, p0 = pol(a + off, Rr), p1 = pol(a + off, Rr - L);
          d += 'M' + p0.x.toFixed(2) + ' ' + p0.y.toFixed(2) + 'L' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2);
        }
        g.appendChild(h('path', { d: d, class: 'ag-anel-t' }));
        for (var b = 0; b < 360; b += 30) {
          var pt = pol(b + off, Rr - 15);
          g.appendChild(h('text', { x: pt.x.toFixed(1), y: pt.y.toFixed(1), dy: '0.35em', 'text-anchor': 'middle', class: 'ag-anel-n' }, b === 0 ? 'N' : String(b)));
        }
        // marca de norte do anel (triângulo para fora)
        var nl = pol(off - 3.2, Rr + 1), nr = pol(off + 3.2, Rr + 1), nt = pol(off, Rr + 11);
        g.appendChild(h('path', { d: 'M' + nl.x.toFixed(1) + ' ' + nl.y.toFixed(1) + 'L' + nt.x.toFixed(1) + ' ' + nt.y.toFixed(1) + 'L' + nr.x.toFixed(1) + ' ' + nr.y.toFixed(1) + 'Z', class: 'ag-anel-norte' }));
        g.appendChild(h('title', null, nome));
        return g;
      }
      function arco(r, a0, a1, cls) {
        var p0 = pol(a0, r), p1 = pol(a1, r), grande = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
        return h('path', { d: 'M' + p0.x.toFixed(2) + ' ' + p0.y.toFixed(2) + 'A' + r + ' ' + r + ' 0 ' + grande + ' ' + sweep + ' ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2), class: cls });
      }
      function tag(ang, r, txt, lado, cls, idx) {
        var p = pol(ang, r), larg = txt.length * 7.5 + 4, LIM = 168;
        function pos(ld) {
          var perp = { x: Math.cos(ang * RAD) * ld, y: Math.sin(ang * RAD) * ld };
          // linha quase horizontal: os rótulos dos três anéis ficariam um sobre o outro; escalona a distância
          var dist = Math.abs(perp.x) < 0.55 ? 20 + (idx || 0) * 17 : 17;
          var x = p.x + perp.x * dist, y = p.y + perp.y * dist;
          var anc = Math.abs(perp.x) < 0.3 ? 'middle' : perp.x > 0 ? 'start' : 'end';
          var xa = anc === 'start' ? x : anc === 'end' ? x - larg : x - larg / 2;
          return { x: x, y: y, anc: anc, cabe: xa >= -LIM && xa + larg <= LIM };
        }
        var q = pos(lado); if (!q.cabe) { var q2 = pos(-lado); if (q2.cabe) q = q2; }
        var g = h('g', { class: 'ag-tag ' + (cls || '') });
        g.appendChild(h('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 3.2, class: 'ag-tag-pt' }));
        g.appendChild(h('text', { x: q.x.toFixed(1), y: q.y.toFixed(1), dy: '0.35em', 'text-anchor': q.anc }, txt));
        return g;
      }

      /* afasta na vertical os rótulos que se sobrepõem (as três leituras ficam na mesma linha da proa) */
      function separarTags(g) {
        var ts = [].slice.call(g.querySelectorAll('text'));
        if (ts.length < 2) return;
        try {
          for (var volta = 0; volta < 8; volta++) {
            var mexeu = false;
            for (var i = 0; i < ts.length; i++) for (var j = i + 1; j < ts.length; j++) {
              var a = ts[i].getBBox(), b = ts[j].getBBox();
              var ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x), oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
              if (ox > 0 && oy > 0) {
                var cima = (b.y + b.height / 2) < (a.y + a.height / 2) ? -1 : 1, d = (oy + 1.5) * cima, y = parseFloat(ts[j].getAttribute('y')) + d;
                if (Math.abs(y) > 160) y -= 2 * d;   // não sai da rosa
                ts[j].setAttribute('y', y.toFixed(1)); mexeu = true;
              }
            }
            if (!mexeu) break;
          }
        } catch (e) { /* svg oculto: sem medidas */ }
      }

      /* ---------------- cálculo ---------------- */
      function calc(st) {
        st = st || est;
        var tab = st.tab || est.tab;
        var decEx = decNoAno(st.dec, st.ano), decR = meio(decEx), r = { decEx: decEx, dec: decR, manual: st.manual != null };
        function dag(proa) { var info = desvioDe(tab, proa); r.info = info; return st.manual != null ? meio(st.manual) : meio(info.v); }
        if (st.tipo === 'rumo') {
          if (st.conhecido === 'ag') { r.rag = st.valor; r.dag = dag(r.rag); r.entrada = 'Rag'; r.rmg = norm360(r.rag + r.dag); r.rv = norm360(r.rmg + decR); }
          else if (st.conhecido === 'mg') { r.rmg = st.valor; r.dag = dag(r.rmg); r.entrada = 'Rmg'; r.rag = norm360(r.rmg - r.dag); r.rv = norm360(r.rmg + decR); }
          else { r.rv = st.valor; r.rmg = norm360(r.rv - decR); r.dag = dag(r.rmg); r.entrada = 'Rmg'; r.rag = norm360(r.rmg - r.dag); }
        } else {
          r.rag = st.proa; r.dag = dag(r.rag); r.entrada = 'Rag'; r.rmg = norm360(r.rag + r.dag); r.rv = norm360(r.rmg + decR);
          if (st.conhecido === 'ag') { r.mag = st.valor; r.mmg = norm360(r.mag + r.dag); r.mv = norm360(r.mmg + decR); }
          else if (st.conhecido === 'mg') { r.mmg = st.valor; r.mag = norm360(r.mmg - r.dag); r.mv = norm360(r.mmg + decR); }
          else { r.mv = st.valor; r.mmg = norm360(r.mv - decR); r.mag = norm360(r.mmg - r.dag); }
        }
        return r;
      }

      /* ---------------- desenho da rosa ---------------- */
      var oculto = false;
      function desenharRosa(r, tipo) {
        while (gAneis.firstChild) gAneis.removeChild(gAneis.firstChild);
        while (gArcos.firstChild) gArcos.removeChild(gArcos.firstChild);
        while (gTags.firstChild) gTags.removeChild(gTags.firstChild);
        gAneis.appendChild(anel(R1, 0, 'ag-anel-v', 'Anel externo: rosa verdadeira (Nv)'));
        if (oculto) {
          gProa.style.display = 'none'; gMarc.style.display = 'none'; gBarco.style.display = 'none';
          aviso.textContent = 'A rosa com a solução aparece na correção.';
          legRosa.textContent = 'Anel externo: verdadeiro. Depois de corrigir, aparecem o anel magnético e o da agulha.';
          return;
        }
        aviso.textContent = '';
        gBarco.style.display = '';
        var offMg = r.dec, offAg = r.dec + r.dag;
        gAneis.appendChild(anel(R2, offMg, 'ag-anel-mg', 'Anel do meio: rosa magnética (Nmg)'));
        gAneis.appendChild(anel(R3, offAg, 'ag-anel-ag', 'Anel interno: rosa da agulha (Nag)'));
        // arcos da declinação (entre Nv e Nmg) e do desvio (entre Nmg e Nag)
        if (offMg) gArcos.appendChild(arco(R1 - 25, Math.min(0, offMg), Math.max(0, offMg), 'ag-arco-dec'));
        if (r.dag) gArcos.appendChild(arco(R2 - 25, Math.min(offMg, offAg), Math.max(offMg, offAg), 'ag-arco-dag'));
        gArcos.appendChild(h('line', { x1: 0, y1: 0, x2: pol(0, R1).x, y2: pol(0, R1).y, class: 'ag-norte-v' }));
        gArcos.appendChild(h('line', { x1: 0, y1: 0, x2: pol(offMg, R2).x.toFixed(1), y2: pol(offMg, R2).y.toFixed(1), class: 'ag-norte-mg' }));
        gArcos.appendChild(h('line', { x1: 0, y1: 0, x2: pol(offAg, R3).x.toFixed(1), y2: pol(offAg, R3).y.toFixed(1), class: 'ag-norte-ag' }));
        // proa
        gProa.style.display = '';
        var ap = pol(r.rv, R1 + 8);
        linhaProa.setAttribute('x2', ap.x.toFixed(1)); linhaProa.setAttribute('y2', ap.y.toFixed(1));
        alcaProa.setAttribute('cx', ap.x.toFixed(1)); alcaProa.setAttribute('cy', ap.y.toFixed(1));
        alcaProa.setAttribute('aria-valuenow', String(tipo === 'rumo' ? est.valor : est.proa));
        alcaProa.setAttribute('aria-valuetext', 'Rv ' + fmtR(r.rv) + ', Rmg ' + fmtR(r.rmg) + ', Rag ' + fmtR(r.rag));
        gBarco.setAttribute('transform', 'rotate(' + r.rv.toFixed(2) + ')');
        var lado = 1;
        gTags.appendChild(tag(r.rv, R1, 'Rv ' + fmtR(r.rv), lado, 'ag-tag-v', 0));
        gTags.appendChild(tag(r.rv, R2, 'Rmg ' + fmtR(r.rmg), lado, 'ag-tag-mg', 1));
        gTags.appendChild(tag(r.rv, R3, 'Rag ' + fmtR(r.rag), lado, 'ag-tag-ag', 2));
        if (tipo === 'marcacao' && r.mv != null) {
          gMarc.style.display = '';
          var am = pol(r.mv, R1 + 8), af = pol(r.mv, R1 + 24);
          linhaMarc.setAttribute('x2', af.x.toFixed(1)); linhaMarc.setAttribute('y2', af.y.toFixed(1));
          alcaMarc.setAttribute('cx', am.x.toFixed(1)); alcaMarc.setAttribute('cy', am.y.toFixed(1));
          var fp = pol(r.mv, R1 + 30);
          farol.setAttribute('transform', 'translate(' + fp.x.toFixed(1) + ' ' + fp.y.toFixed(1) + ')');
          alcaMarc.setAttribute('aria-valuenow', String(est.valor));
          alcaMarc.setAttribute('aria-valuetext', 'Mv ' + fmtR(r.mv) + ', Mmg ' + fmtR(r.mmg) + ', Mag ' + fmtR(r.mag));
          gTags.appendChild(tag(r.mv, R1, 'Mv ' + fmtR(r.mv), -1, 'ag-tag-v ag-tag-m', 0));
          gTags.appendChild(tag(r.mv, R2, 'Mmg ' + fmtR(r.mmg), -1, 'ag-tag-mg ag-tag-m', 1));
          gTags.appendChild(tag(r.mv, R3, 'Mag ' + fmtR(r.mag), -1, 'ag-tag-ag ag-tag-m', 2));
        } else gMarc.style.display = 'none';
        separarTags(gTags);
        legRosa.innerHTML = 'Leia cada valor no seu anel: <b>externo</b> = verdadeiro' + VL.esc(intl('true')) + ', <b>meio</b> = magnético' + VL.esc(intl('magnetic')) +
          ', <b>interno</b> = agulha' + VL.esc(intl('compass')) + '. O arco tracejado entre Nv e Nmg é a declinação (' + fmtEW(r.dec) + '); o pontilhado entre Nmg e Nag é o desvio (' + fmtEW(r.dag) + '). O desvio muda com a proa: gire o barco e veja o anel interno se mexer.';
      }

      /* ---------------- arrastar na rosa ---------------- */
      var arrasto = null;
      function angDoEvento(e) {
        var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        var m = svg.getScreenCTM(); if (!m) return null;
        var q = pt.matrixTransform(m.inverse());
        return { ang: norm360(Math.atan2(q.x, -q.y) / RAD), r: Math.hypot(q.x, q.y) };
      }
      function aplicarAngulo(qual, absV) {
        var r = calc();
        if (qual === 'proa') {
          if (est.tipo === 'rumo') {
            var off = est.conhecido === 'v' ? 0 : est.conhecido === 'mg' ? r.dec : r.dec + r.dag;
            est.valor = meio(norm360(absV - off));
          } else est.proa = meio(norm360(absV - r.dec - r.dag));
        } else {
          var off2 = est.conhecido === 'v' ? 0 : est.conhecido === 'mg' ? r.dec : r.dec + r.dag;
          est.valor = meio(norm360(absV - off2));
        }
        atualizar(true);
      }
      svg.addEventListener('pointerdown', function (e) {
        if (est.modo !== 'explorar') return;
        var a = angDoEvento(e); if (!a || a.r < 34) return;
        var r = calc(), qual = 'proa';
        if (est.tipo === 'marcacao' && Math.abs(difAng(a.ang, r.mv)) < Math.abs(difAng(a.ang, r.rv))) qual = 'marc';
        arrasto = { id: e.pointerId, qual: qual };
        try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
        e.preventDefault();
        aplicarAngulo(qual, a.ang);
      });
      svg.addEventListener('pointermove', function (e) {
        if (!arrasto || arrasto.id !== e.pointerId) return;
        var a = angDoEvento(e); if (a) aplicarAngulo(arrasto.qual, a.ang);
      });
      function soltar(e) { if (arrasto && arrasto.id === e.pointerId) { arrasto = null; atualizar(); } }
      svg.addEventListener('pointerup', soltar);
      svg.addEventListener('pointercancel', soltar);
      function teclas(qual) {
        return function (e) {
          var passo = e.shiftKey ? 10 : (e.altKey ? 0.5 : 1), d = 0;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = passo; else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -passo;
          else if (e.key === 'PageUp') d = 10; else if (e.key === 'PageDown') d = -10; else return;
          e.preventDefault();
          if (qual === 'proa' && est.tipo === 'marcacao') est.proa = norm360(est.proa + d); else est.valor = norm360(est.valor + d);
          atualizar();
        };
      }
      alcaProa.addEventListener('keydown', teclas('proa'));
      alcaMarc.addEventListener('keydown', teclas('marc'));

      /* ---------------- painel explorar ---------------- */
      var painelExp = h('div', { class: 'ag-painel-exp' });
      var painelEx = h('div', { class: 'ag-painel-ex' });
      colPainel.appendChild(painelExp); colPainel.appendChild(painelEx);

      var tipoSeg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Converter rumo ou marcação' });
      [['rumo', 'Rumo'], ['marcacao', 'Marcação']].forEach(function (t) {
        tipoSeg.appendChild(h('button', { type: 'button', 'data-t': t[0], onclick: function () {
          if (est.tipo === t[0]) return;
          est.tipo = t[0]; est.valor = t[0] === 'marcacao' ? 327 : 85; montarExplorar();
        } }, t[1]));
      });
      var conhSeg = h('div', { class: 'segmented ag-conh', role: 'group', 'aria-label': 'Qual valor você conhece' });
      ['ag', 'mg', 'v'].forEach(function (c) {
        conhSeg.appendChild(h('button', { type: 'button', 'data-c': c, onclick: function () {
          var r = calc();
          est.valor = est.tipo === 'rumo' ? (c === 'ag' ? r.rag : c === 'mg' ? r.rmg : r.rv) : (c === 'ag' ? r.mag : c === 'mg' ? r.mmg : r.mv);
          est.conhecido = c; montarExplorar();
        } }));
      });
      function campo(rot, attrs, suf, extraCls) {
        var inp = h('input', Object.assign({ type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false' }, attrs));
        return { el: h('label', { class: 'ag-campo' + (extraCls ? ' ' + extraCls : '') }, h('span', { class: 'ag-campo-rot' }, rot), h('span', { class: 'ag-campo-in' }, inp, suf ? h('span', { class: 'ag-suf' }, suf) : null)), inp: inp };
      }
      function selEW(val, rot) {
        var s = h('select', { 'aria-label': rot }, h('option', { value: 'W' }, 'W'), h('option', { value: 'E' }, 'E'));
        s.value = val; return s;
      }

      var cValor, cProa, saida, decOut, tabelaBox, curvaBox, dagModoSel, dagManual;
      function montarExplorar() {
        painelExp.innerHTML = '';
        VL.$$('button', tipoSeg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-t') === est.tipo)); });
        var nomes = est.tipo === 'rumo' ? { ag: 'Rag', mg: 'Rmg', v: 'Rv' } : { ag: 'Mag', mg: 'Mmg', v: 'Mv' };
        VL.$$('button', conhSeg).forEach(function (b) { var c = b.getAttribute('data-c'); b.textContent = nomes[c]; b.setAttribute('aria-pressed', String(c === est.conhecido)); b.setAttribute('aria-label', 'Conheço o ' + nomeLongo(est.tipo, c)); });
        painelExp.appendChild(h('div', { class: 'ag-linha' }, h('div', { class: 'ag-grupo' }, h('span', { class: 'ag-campo-rot' }, 'Converter'), tipoSeg), h('div', { class: 'ag-grupo' }, h('span', { class: 'ag-campo-rot' }, 'Eu conheço'), conhSeg)));
        var linhaV = h('div', { class: 'ag-linha' });
        if (est.tipo === 'marcacao') {
          cProa = campo('Proa da agulha (Rag)', { 'aria-label': 'Proa do barco lida na agulha, em graus', value: num(est.proa, 1).replace(/,0$/, '') }, '°');
          cProa.inp.addEventListener('input', function () { var v = lerNum(cProa.inp.value); if (!isNaN(v)) { est.proa = norm360(v); atualizar(false, cProa.inp); } });
          linhaV.appendChild(cProa.el);
        }
        cValor = campo(nomeLongo(est.tipo, est.conhecido, true), { 'aria-label': nomeLongo(est.tipo, est.conhecido) + ', em graus', value: num(est.valor, 1).replace(/,0$/, '') }, '°');
        cValor.inp.addEventListener('input', function () { var v = lerNum(cValor.inp.value); if (!isNaN(v)) { est.valor = norm360(v); atualizar(false, cValor.inp); } });
        linhaV.appendChild(cValor.el);
        painelExp.appendChild(linhaV);

        // declinação
        var D = est.dec;
        var cg = campo('Graus', { 'aria-label': 'Declinação da carta, graus', value: String(D.graus), size: 3 }, '°', 'ag-campo-curto');
        var cm = campo('Min', { 'aria-label': 'Declinação da carta, minutos', value: String(D.min), size: 3 }, "'", 'ag-campo-curto');
        var sl = selEW(D.lado, 'Lado da declinação (E ou W)');
        var ca = campo('Ano da carta', { 'aria-label': 'Ano da declinação na carta', value: String(D.ano), size: 4 }, null, 'ag-campo-ano');
        var cv = campo('Variação anual', { 'aria-label': 'Variação anual, minutos', value: String(D.varMin), size: 3 }, "'", 'ag-campo-curto');
        var sv = selEW(D.varLado, 'Lado da variação anual (E ou W)');
        var cn = campo('Ano da navegação', { 'aria-label': 'Ano em que você navega', value: String(est.ano), size: 4 }, null, 'ag-campo-ano');
        function lerDec() {
          var g = lerNum(cg.inp.value), m = lerNum(cm.inp.value), a = lerNum(ca.inp.value), v = lerNum(cv.inp.value), n = lerNum(cn.inp.value);
          if ([g, m, a, v, n].some(isNaN) || m >= 60 || g > 60) return;
          est.dec = { graus: g, min: m, lado: sl.value, ano: Math.round(a), varMin: v, varLado: sv.value }; est.ano = Math.round(n);
          atualizar(false, document.activeElement);
        }
        [cg, cm, ca, cv, cn].forEach(function (c) { c.inp.addEventListener('input', lerDec); });
        sl.addEventListener('change', lerDec); sv.addEventListener('change', lerDec);
        decOut = h('p', { class: 'ag-dec-out', 'aria-live': 'polite' });
        painelExp.appendChild(h('fieldset', { class: 'ag-fs' }, h('legend', null, 'Declinação magnética' + intl('variation') + ', como anotada na rosa da carta'),
          h('div', { class: 'ag-linha' }, cg.el, cm.el, h('label', { class: 'ag-campo' }, h('span', { class: 'ag-campo-rot' }, 'Lado'), sl), ca.el),
          h('div', { class: 'ag-linha' }, cv.el, h('label', { class: 'ag-campo' }, h('span', { class: 'ag-campo-rot' }, 'Lado'), sv), cn.el), decOut));

        // desvio
        dagModoSel = h('select', { 'aria-label': 'Origem do desvio' }, h('option', { value: 'tab' }, 'pela tabela de desvios'), h('option', { value: 'man' }, 'digitar o desvio'));
        dagModoSel.value = est.manual == null ? 'tab' : 'man';
        dagManual = campo('Desvio', { 'aria-label': 'Desvio da agulha: número e E ou W, por exemplo 3E ou 2,5W', placeholder: '3E', value: est.manual == null ? '' : num(Math.abs(est.manual), 1).replace(/,0$/, '') + (est.manual >= 0 ? 'E' : 'W') }, null, 'ag-campo-curto');
        dagManual.el.hidden = est.manual == null;
        dagModoSel.addEventListener('change', function () { if (dagModoSel.value === 'tab') { est.manual = null; dagManual.el.hidden = true; } else { dagManual.el.hidden = false; var v = lerEW(dagManual.inp.value); est.manual = isNaN(v) ? 0 : v; } atualizar(); });
        dagManual.inp.addEventListener('input', function () { var v = lerEW(dagManual.inp.value); if (!isNaN(v)) { est.manual = v; atualizar(false, dagManual.inp); } });
        painelExp.appendChild(h('fieldset', { class: 'ag-fs' }, h('legend', null, 'Desvio da agulha' + intl('deviation')),
          h('div', { class: 'ag-linha' }, h('label', { class: 'ag-campo' }, h('span', { class: 'ag-campo-rot' }, 'Obter'), dagModoSel), dagManual.el)));

        saida = h('div', { class: 'ag-saida', 'aria-live': 'polite' });
        painelExp.appendChild(saida);
        painelExp.appendChild(caixaMnemonico());
        atualizar();
      }
      function nomeLongo(tipo, c, comSigla) {
        var t = tipo === 'rumo' ? { ag: ['Rumo da agulha', 'Rag'], mg: ['Rumo magnético', 'Rmg'], v: ['Rumo verdadeiro', 'Rv'] } : { ag: ['Marcação da agulha', 'Mag'], mg: ['Marcação magnética', 'Mmg'], v: ['Marcação verdadeira', 'Mv'] };
        return comSigla ? t[c][0] + ' (' + t[c][1] + ')' : t[c][0];
      }
      function caixaMnemonico() {
        var intlOn = VL.settings.get('intl');
        return h('aside', { class: 'ag-mnemo' },
          h('p', { class: 'ag-mnemo-t' }, 'Para lembrar'),
          h('p', { html: '<b>Subindo</b> (agulha → magnético → verdadeiro): some cada correção com o sinal dela, <b>E positivo, W negativo</b>. <b>Descendo</b> (verdadeiro → magnético → agulha): faça a conta ao contrário, E subtrai e W soma.' }),
          h('p', { html: 'Um jeito de guardar: <b>AVES</b> = da <b>A</b>gulha para o <b>V</b>erdadeiro, <b>E</b> (leste) <b>S</b>oma. Ou desenhe o "calunga" do Manual (Figura 3.13): as linhas Nv, Nmg e Nag e a linha da proa, como na rosa ao lado.' }),
          intlOn ? h('p', { class: 'ag-intl', 'data-intl': 'on', html: 'Trilha internacional: true, variation, magnetic, deviation, compass. De compass para true, East soma: <i>CADET</i> (Compass ADd East = True).' }) : null,
          h('p', { class: 'ag-ref', html: 'Notação do Manual de Navegação da DHN (Vol. I, 2023): Dec mg para a declinação e Dag para o desvio. Outras apostilas usam abreviaturas diferentes (por exemplo, dmg e Dsv); a regra de sinais é a mesma.' }));
      }

      function linhaFormula(txt) { return h('li', { html: txt }); }
      function atualizar(_soRosa, manterFoco) {
        if (est.modo !== 'explorar') return;
        var r = calc();
        desenharRosa(r, est.tipo);
        if (cValor && manterFoco !== cValor.inp) cValor.inp.value = num(est.valor, 1).replace(/,0$/, '');
        if (cProa && manterFoco !== cProa.inp) cProa.inp.value = num(est.proa, 1).replace(/,0$/, '');
        escreverSaida(r); desenharTabela(r);
      }
      function escreverSaida(r) {
        if (!saida) return;
        decOut.textContent = decAtualTxt(est.dec, est.ano);
        saida.innerHTML = '';
        var cadeia = h('div', { class: 'ag-cadeia' });
        var itens = est.tipo === 'rumo' ? [['Rag', r.rag, 'agulha'], ['Rmg', r.rmg, 'magnético'], ['Rv', r.rv, 'verdadeiro']] : [['Mag', r.mag, 'agulha'], ['Mmg', r.mmg, 'magnética'], ['Mv', r.mv, 'verdadeira']];
        var conh = { ag: 0, mg: 1, v: 2 }[est.conhecido];
        itens.forEach(function (it, i) {
          if (i) cadeia.appendChild(h('div', { class: 'ag-elo' }, h('span', null, i === 1 ? '± Dag' : '± Dec mg'), h('b', null, i === 1 ? fmtEW(r.dag) : fmtEW(r.dec))));
          cadeia.appendChild(h('div', { class: 'ag-valor' + (i === conh ? ' ag-valor-conh' : '') }, h('span', { class: 'ag-valor-sig' }, it[0]), h('span', { class: 'ag-valor-num' }, fmtR(it[1])), h('span', { class: 'ag-valor-nome' }, i === conh ? 'conhecido' : it[2])));
        });
        saida.appendChild(cadeia);
        var ol = h('ol', { class: 'ag-passos' });
        ol.appendChild(linhaFormula(VL.esc(decAtualTxt(est.dec, est.ano))));
        var rotEnt = r.entrada;
        if (est.manual != null) ol.appendChild(linhaFormula('Desvio digitado: Dag = ' + fmtEW(r.dag) + '.'));
        else ol.appendChild(linhaFormula(VL.esc(textoDesvio(r.info, rotEnt))));
        if (est.tipo === 'rumo') {
          if (est.conhecido === 'ag') {
            ol.appendChild(linhaFormula('Rmg = Rag ± Dag = ' + fmtR(r.rag) + somaTxt(r.dag) + ' = <b>' + fmtR(r.rmg) + '</b>'));
            ol.appendChild(linhaFormula('Rv = Rmg ± Dec mg = ' + fmtR(r.rmg) + somaTxt(r.dec) + ' = <b>' + fmtR(r.rv) + '</b>'));
          } else if (est.conhecido === 'mg') {
            ol.appendChild(linhaFormula('Rv = Rmg ± Dec mg = ' + fmtR(r.rmg) + somaTxt(r.dec) + ' = <b>' + fmtR(r.rv) + '</b>'));
            ol.appendChild(linhaFormula('Rag = Rmg ± Dag = ' + fmtR(r.rmg) + subTxt(r.dag) + ' = <b>' + fmtR(r.rag) + '</b>'));
          } else {
            ol.appendChild(linhaFormula('Rmg = Rv ± Dec mg = ' + fmtR(r.rv) + subTxt(r.dec) + ' = <b>' + fmtR(r.rmg) + '</b>'));
            ol.appendChild(linhaFormula('Rag = Rmg ± Dag = ' + fmtR(r.rmg) + subTxt(r.dag) + ' = <b>' + fmtR(r.rag) + '</b>'));
          }
          if (est.conhecido !== 'v') ol.insertBefore(linhaFormula('Na carta só se traça o rumo verdadeiro: Rv ' + fmtR(r.rv) + '.'), null);
        } else {
          ol.appendChild(linhaFormula('O desvio vem da <b>proa</b> (Rag ' + fmtR(r.rag) + '), não da marcação: vale para todas as marcações tiradas nesta proa (Manual, 3.2.5 b).'));
          if (est.conhecido === 'ag') {
            ol.appendChild(linhaFormula('Mmg = Mag ± Dag = ' + fmtR(r.mag) + somaTxt(r.dag) + ' = <b>' + fmtR(r.mmg) + '</b>'));
            ol.appendChild(linhaFormula('Mv = Mmg ± Dec mg = ' + fmtR(r.mmg) + somaTxt(r.dec) + ' = <b>' + fmtR(r.mv) + '</b> (a marcação que se traça na carta)'));
          } else if (est.conhecido === 'mg') {
            ol.appendChild(linhaFormula('Mv = Mmg ± Dec mg = ' + fmtR(r.mmg) + somaTxt(r.dec) + ' = <b>' + fmtR(r.mv) + '</b>'));
            ol.appendChild(linhaFormula('Mag = Mmg ± Dag = ' + fmtR(r.mmg) + subTxt(r.dag) + ' = <b>' + fmtR(r.mag) + '</b>'));
          } else {
            ol.appendChild(linhaFormula('Mmg = Mv ± Dec mg = ' + fmtR(r.mv) + subTxt(r.dec) + ' = <b>' + fmtR(r.mmg) + '</b>'));
            ol.appendChild(linhaFormula('Mag = Mmg ± Dag = ' + fmtR(r.mmg) + subTxt(r.dag) + ' = <b>' + fmtR(r.mag) + '</b> (o que a agulha deve mostrar)'));
          }
          ol.appendChild(linhaFormula('Rumo verdadeiro do barco: Rv = Rag ± Dec mg ± Dag = ' + fmtR(r.rag) + somaTxt(r.dec) + somaTxt(r.dag) + ' = ' + fmtR(r.rv) + '.'));
        }
        saida.appendChild(ol);
        saida.appendChild(h('p', { class: 'ag-ref' }, 'Regras do Manual de Navegação da MB, Vol. I, item 3.2.5: só se traçam na carta rumos e marcações verdadeiros; a declinação (do local e do ano) vem da carta; o desvio vem da curva de desvios, pela proa; tudo aproximado a 0,5°.'));
      }

      /* ---------------- tabela e curva de desvios ---------------- */
      var blocoTab = h('div', { class: 'ag-tabela-bloco' });
      inst.corpo.appendChild(blocoTab);
      function desenharTabela(r) {
        blocoTab.innerHTML = '';
        var editavel = est.modo === 'explorar';
        var cab = h('div', { class: 'ag-tab-cab' },
          h('h4', null, 'Tabela e curva de desvios (exemplo)'),
          editavel ? h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { est.tab = tabIni.map(function (p) { return p.slice(); }); atualizar(); } }, 'Restaurar a tabela') : null);
        blocoTab.appendChild(cab);
        blocoTab.appendChild(h('p', { class: 'ag-tab-nota' }, 'Desvios de uma agulha de veleiro fictícia, já compensada. Cada agulha, em cada barco, tem a sua tabela: ela vem do Certificado de Compensação (modelo DHN-0108), feito por perito habilitado, ou de uma verificação por alinhamentos. ' +
          (editavel ? 'Você pode digitar a tabela do seu barco (ex.: 3E, 2W).' : '')));
        var grade = h('div', { class: 'ag-tab-grade', role: 'table', 'aria-label': 'Tabela de desvios por proa' });
        est.tab.forEach(function (p, i) {
          var cel = h('div', { class: 'ag-tab-cel', role: 'row' }, h('span', { class: 'ag-tab-proa', role: 'rowheader' }, fmtR(p[0])));
          if (editavel) {
            var inp = h('input', { type: 'text', value: fmtEW(p[1]).replace('°', '').replace(' ', ''), 'aria-label': 'Desvio na proa ' + fmtR(p[0]), inputmode: 'text', autocomplete: 'off', role: 'cell' });
            inp.addEventListener('change', function () { var v = lerEW(inp.value); if (!isNaN(v) && Math.abs(v) <= 30) { est.tab[i][1] = v; atualizar(); } else inp.value = fmtEW(est.tab[i][1]).replace('°', '').replace(' ', ''); });
            cel.appendChild(inp);
          } else cel.appendChild(h('span', { class: 'ag-tab-v', role: 'cell' }, fmtEW(p[1])));
          grade.appendChild(cel);
        });
        blocoTab.appendChild(grade);
        blocoTab.appendChild(curva(r));
      }
      function curva(r) {
        var W = 360, H = 156, x0 = 42, x1 = 350, y0 = 20, y1 = 130;
        var maxD = Math.max(5, Math.ceil(Math.max.apply(null, est.tab.map(function (p) { return Math.abs(p[1]); }))));
        function X(p) { return x0 + (p / 360) * (x1 - x0); }
        function Y(d) { return (y0 + y1) / 2 - d / maxD * (y1 - y0) / 2; }
        var s = h('svg', { class: 'ag-curva', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Curva de desvios: proa no eixo horizontal, desvio (E para cima, W para baixo) no vertical.' });
        var grid = '';
        for (var p = 0; p <= 360; p += 30) grid += 'M' + X(p).toFixed(1) + ' ' + y0 + 'V' + y1;
        s.appendChild(h('path', { d: grid, class: 'ag-curva-grade' }));
        s.appendChild(h('line', { x1: x0, x2: x1, y1: Y(0), y2: Y(0), class: 'ag-curva-zero' }));
        [maxD, -maxD].forEach(function (d) { s.appendChild(h('text', { x: x0 - 5, y: Y(d), dy: '0.35em', 'text-anchor': 'end', class: 'ag-curva-txt' }, maxD + '°' + (d > 0 ? 'E' : 'W'))); });
        s.appendChild(h('text', { x: x0 - 5, y: Y(0), dy: '0.35em', 'text-anchor': 'end', class: 'ag-curva-txt' }, '0'));
        for (var q = 0; q <= 360; q += 90) s.appendChild(h('text', { x: X(q), y: y1 + 18, 'text-anchor': 'middle', class: 'ag-curva-txt' }, String(q).padStart(3, '0')));
        var pts = est.tab.map(function (pp) { return X(pp[0]).toFixed(1) + ',' + Y(pp[1]).toFixed(1); });
        pts.push(X(360).toFixed(1) + ',' + Y(est.tab[0][1]).toFixed(1));
        if (est.tab[0][0] > 0) pts.unshift(X(0).toFixed(1) + ',' + Y(desvioDe(est.tab, 0).v).toFixed(1));
        s.appendChild(h('polyline', { points: pts.join(' '), class: 'ag-curva-linha' }));
        est.tab.forEach(function (pp) { s.appendChild(h('circle', { cx: X(pp[0]), cy: Y(pp[1]), r: 2.6, class: 'ag-curva-pt' })); });
        if (r && r.info && !r.manual && !oculto) {
          var px = X(r.info.proa), py = Y(r.info.v);
          s.appendChild(h('line', { x1: px, x2: px, y1: y0, y2: y1, class: 'ag-curva-cursor' }));
          s.appendChild(h('circle', { cx: px, cy: py, r: 4, class: 'ag-curva-marca' }));
          var txt = (r.entrada || 'proa') + ' ' + fmtR(r.info.proa) + ': ' + fmtEW(r.info.v);
          s.appendChild(h('text', { x: Math.min(x1 - 2, Math.max(x0 + 2, px + (px > 230 ? -6 : 6))), y: y0 - 4, 'text-anchor': px > 230 ? 'end' : 'start', class: 'ag-curva-rot' }, txt));
        }
        return s;
      }

      /* ---------------- exercícios ---------------- */
      var TIPOS = [
        ['rag-rv', 'Do rumo da agulha ao verdadeiro'],
        ['rv-rag', 'Do rumo verdadeiro ao da agulha'],
        ['dec', 'Atualizar a declinação pelo ano'],
        ['marc', 'Marcação da agulha para verdadeira'],
        ['marc-inv', 'Marcação verdadeira para da agulha'],
        ['alinhamento', 'Desvio da agulha por alinhamento'],
      ];
      function decAleatoria() {
        var D = { graus: randInt(14, 24), min: randInt(0, 11) * 5, lado: 'W', ano: randInt(2012, 2025) };
        if (Math.random() < 0.18) { D.varMin = randInt(1, 3); D.varLado = 'E'; } else { D.varMin = randInt(3, 9); D.varLado = 'W'; }
        return D;
      }
      function anoAleatorio(D) { var atual = new Date().getFullYear(); return Math.random() < 0.6 ? Math.max(atual, D.ano) : D.ano + randInt(0, 10); }
      function ewCampo(id, rot) { return { id: id, rot: rot, tipo: 'ew' }; }
      function angCampo(id, rot) { return { id: id, rot: rot, tipo: 'ang' }; }
      var gerar = {
        'rag-rv': function () {
          var D = decAleatoria(), ano = anoAleatorio(D), rag = randInt(0, 359);
          var st = { tipo: 'rumo', conhecido: 'ag', valor: rag, dec: D, ano: ano, manual: null }, r = calc(st);
          return {
            st: st, r: r,
            enunciado: 'Em ' + ano + ', você governa no <b>Rag ' + fmtR(rag) + '</b>. A rosa da carta traz <b>' + decTexto(D) + '</b>. Use a tabela de desvios abaixo. Qual o Rv que você está fazendo?',
            campos: [ewCampo('dec', 'Dec mg em ' + ano), ewCampo('dag', 'Dag'), angCampo('rmg', 'Rmg'), angCampo('rv', 'Rv')],
            certo: { dec: r.dec, dag: r.dag, rmg: r.rmg, rv: r.rv },
            passos: [decAtualTxt(D, ano), textoDesvio(r.info, 'Rag'), 'Rmg = Rag ± Dag = ' + fmtR(rag) + somaTxt(r.dag) + ' = ' + fmtR(r.rmg) + '.', 'Rv = Rmg ± Dec mg = ' + fmtR(r.rmg) + somaTxt(r.dec) + ' = ' + fmtR(r.rv) + '.'],
          };
        },
        'rv-rag': function () {
          var D = decAleatoria(), ano = anoAleatorio(D), rv = randInt(0, 359);
          var st = { tipo: 'rumo', conhecido: 'v', valor: rv, dec: D, ano: ano, manual: null }, r = calc(st);
          return {
            st: st, r: r,
            enunciado: 'Em ' + ano + ', você mediu na carta o rumo verdadeiro <b>Rv ' + fmtR(rv) + '</b> até o próximo ponto. A rosa traz <b>' + decTexto(D) + '</b>. Em que rumo da agulha você deve governar?',
            campos: [ewCampo('dec', 'Dec mg em ' + ano), angCampo('rmg', 'Rmg'), ewCampo('dag', 'Dag'), angCampo('rag', 'Rag')],
            certo: { dec: r.dec, rmg: r.rmg, dag: r.dag, rag: r.rag },
            passos: [decAtualTxt(D, ano), 'Rmg = Rv ± Dec mg = ' + fmtR(rv) + subTxt(r.dec) + ' = ' + fmtR(r.rmg) + ' (descendo: W soma, E subtrai).', textoDesvio(r.info, 'Rmg'), 'Rag = Rmg ± Dag = ' + fmtR(r.rmg) + subTxt(r.dag) + ' = ' + fmtR(r.rag) + '.'],
          };
        },
        'dec': function () {
          var D = decAleatoria(), ano = D.ano + randInt(1, 14), dec = decNoAno(D, ano);
          return {
            st: { tipo: 'rumo', conhecido: 'v', valor: 0, dec: D, ano: ano, manual: 0 },
            enunciado: 'A rosa de uma carta traz <b>' + decTexto(D) + '</b>. Qual a declinação magnética em <b>' + ano + '</b>? Responda em graus e minutos.',
            campos: [{ id: 'gm', rot: 'Dec mg em ' + ano, tipo: 'gm' }],
            certo: { gm: dec },
            passos: ['Anos desde a carta: ' + ano + ' − ' + D.ano + ' = ' + (ano - D.ano) + '.', 'Variação acumulada: ' + (ano - D.ano) + ' × ' + D.varMin + "'" + D.varLado + ' = ' + (ano - D.ano) * D.varMin + "'" + D.varLado + (((ano - D.ano) * D.varMin) >= 60 ? ' = ' + fmtGM((ano - D.ano) * D.varMin / 60).replace(/[EW]$/, '') + D.varLado : '') + '.',
              D.varLado === D.lado ? 'Mesmo lado da declinação (' + D.lado + '): soma. ' + decAtualTxt(D, ano) : 'Lado contrário ao da declinação: subtrai. ' + decAtualTxt(D, ano)],
          };
        },
        'marc': function () {
          var D = decAleatoria(), ano = anoAleatorio(D), rag = randInt(0, 359), mag = randInt(0, 359);
          var st = { tipo: 'marcacao', conhecido: 'ag', valor: mag, proa: rag, dec: D, ano: ano, manual: null }, r = calc(st);
          var obj = escolha(['o farol da Ponta do Vigia', 'a torre da igreja', 'a antena do Morro Alto', 'o farol da Ilha da Gaivota']);
          return {
            st: st, r: r,
            enunciado: 'Em ' + ano + ', no <b>Rag ' + fmtR(rag) + '</b>, você marca ' + obj + ' com a agulha: <b>Mag ' + fmtR(mag) + '</b>. A rosa traz <b>' + decTexto(D) + '</b>. Qual a marcação verdadeira que você vai traçar na carta?',
            campos: [ewCampo('dag', 'Dag'), angCampo('mmg', 'Mmg'), ewCampo('dec', 'Dec mg em ' + ano), angCampo('mv', 'Mv')],
            certo: { dag: r.dag, mmg: r.mmg, dec: r.dec, mv: r.mv },
            passos: ['O desvio é o da proa, não o da marcação. ' + textoDesvio(r.info, 'Rag') + (Math.abs(meio(desvioDe(est.tab, mag).v) - r.dag) >= 0.5 ? ' (Se você entrou com a marcação, ' + fmtR(mag) + ', achou ' + fmtEW(desvioDe(est.tab, mag).v) + ': esse é o erro mais comum.)' : ''),
              'Mmg = Mag ± Dag = ' + fmtR(mag) + somaTxt(r.dag) + ' = ' + fmtR(r.mmg) + '.', decAtualTxt(D, ano), 'Mv = Mmg ± Dec mg = ' + fmtR(r.mmg) + somaTxt(r.dec) + ' = ' + fmtR(r.mv) + '.'],
          };
        },
        'marc-inv': function () {
          var D = decAleatoria(), ano = anoAleatorio(D), rag = randInt(0, 359), mv = randInt(0, 359);
          var st = { tipo: 'marcacao', conhecido: 'v', valor: mv, proa: rag, dec: D, ano: ano, manual: null }, r = calc(st);
          return {
            st: st, r: r,
            enunciado: 'Em ' + ano + ', você quer saber que marcação da agulha deve ler para o farol quando ele estiver na <b>Mv ' + fmtR(mv) + '</b> (tirada da carta). O barco está no <b>Rag ' + fmtR(rag) + '</b>. A rosa traz <b>' + decTexto(D) + '</b>.',
            campos: [ewCampo('dec', 'Dec mg em ' + ano), angCampo('mmg', 'Mmg'), ewCampo('dag', 'Dag'), angCampo('mag', 'Mag')],
            certo: { dec: r.dec, mmg: r.mmg, dag: r.dag, mag: r.mag },
            passos: [decAtualTxt(D, ano), 'Mmg = Mv ± Dec mg = ' + fmtR(mv) + subTxt(r.dec) + ' = ' + fmtR(r.mmg) + '.', 'Desvio pela proa: ' + textoDesvio(r.info, 'Rag'), 'Mag = Mmg ± Dag = ' + fmtR(r.mmg) + subTxt(r.dag) + ' = ' + fmtR(r.mag) + '.'],
          };
        },
        'alinhamento': function () {
          var D = decAleatoria(), ano = anoAleatorio(D), mv = randInt(0, 359), decR = meio(decNoAno(D, ano));
          var rmg = norm360(mv - decR), dagV = randInt(-8, 8) / 2, rag = norm360(rmg - dagV);
          return {
            st: { tipo: 'rumo', conhecido: 'ag', valor: rag, dec: D, ano: ano, manual: dagV },
            enunciado: 'Dois faróis enfiados formam um alinhamento cuja direção verdadeira, tirada da carta, é <b>' + fmtR(mv) + '</b>. Em ' + ano + ' (rosa: ' + decTexto(D) + '), você governa exatamente sobre o alinhamento e a agulha mostra <b>Rag ' + fmtR(rag) + '</b>. Qual o desvio da agulha nessa proa?',
            campos: [ewCampo('dec', 'Dec mg em ' + ano), angCampo('rmg', 'Direção magnética'), ewCampo('dag', 'Dag')],
            certo: { dec: decR, rmg: rmg, dag: dagV },
            passos: [decAtualTxt(D, ano), 'Direção magnética do alinhamento: ' + fmtR(mv) + subTxt(decR) + ' = ' + fmtR(rmg) + '.', 'Governando sobre o alinhamento, o rumo magnético é ' + fmtR(rmg) + '. Dag = Rmg − Rag = ' + fmtR(rmg) + ' − ' + fmtR(rag) + ' = ' + sinalTxt(dagV) + '° → ' + fmtEW(dagV) + (dagV > 0 ? ' (o magnético é maior que o da agulha: desvio E).' : dagV < 0 ? ' (o magnético é menor que o da agulha: desvio W).' : '.'),
              'É assim que se levantam os desvios em veleiros com agulha de antepara (Manual, 3.2.4 h): por alinhamentos em várias proas.'],
          };
        },
      };

      var exSel = h('select', { 'aria-label': 'Tipo de exercício', onchange: function () { novoEx(exSel.value); } });
      TIPOS.forEach(function (t) { exSel.appendChild(h('option', { value: t[0] }, t[1])); });
      var exInputs = {}, exFb;
      function novoEx(tipo) {
        if (!gerar[tipo]) tipo = 'rag-rv';
        exSel.value = tipo;
        est.ex = gerar[tipo](); est.ex.tipo = tipo; est.ex.contado = false;
        oculto = true;
        renderEx();
      }
      function renderEx() {
        var ex = est.ex; painelEx.innerHTML = '';
        painelEx.appendChild(h('label', { class: 'ag-campo ag-campo-largo' }, h('span', { class: 'ag-campo-rot' }, 'Exercício'), exSel));
        painelEx.appendChild(h('div', { class: 'ag-enunciado', html: ex.enunciado }));
        exInputs = {};
        var linha = h('div', { class: 'ag-linha ag-ex-campos' });
        ex.campos.forEach(function (c) {
          if (c.tipo === 'ang') {
            var a = campo(c.rot, { 'aria-label': c.rot + ', em graus', placeholder: '000' }, '°');
            exInputs[c.id] = { tipo: 'ang', inp: a.inp, el: a.el }; linha.appendChild(a.el);
          } else if (c.tipo === 'ew') {
            var b = campo(c.rot, { 'aria-label': c.rot + ', valor em graus', placeholder: '0' }, '°', 'ag-campo-curto');
            var s = selEW('W', c.rot + ': E ou W');
            var box = h('div', { class: 'ag-ew' }, b.el, h('label', { class: 'ag-campo' }, h('span', { class: 'ag-campo-rot' }, 'Lado'), s));
            exInputs[c.id] = { tipo: 'ew', inp: b.inp, sel: s, el: box }; linha.appendChild(box);
          } else {
            var g = campo('Graus', { 'aria-label': c.rot + ', graus' }, '°', 'ag-campo-curto'), m = campo('Min', { 'aria-label': c.rot + ', minutos' }, "'", 'ag-campo-curto'), s2 = selEW('W', c.rot + ': E ou W');
            var box2 = h('div', { class: 'ag-ew' }, h('span', { class: 'ag-campo-rot ag-gm-rot' }, c.rot), g.el, m.el, h('label', { class: 'ag-campo' }, h('span', { class: 'ag-campo-rot' }, 'Lado'), s2));
            exInputs[c.id] = { tipo: 'gm', inp: g.inp, inpM: m.inp, sel: s2, el: box2 }; linha.appendChild(box2);
          }
        });
        painelEx.appendChild(linha);
        painelEx.appendChild(h('p', { class: 'ag-dica' }, 'Aproxime a declinação, o desvio, os rumos e as marcações a 0,5° (Manual, 3.2.5). Tolerância: ±0,5°.'));
        exFb = h('div', { class: 'ag-feedback', 'aria-live': 'polite' });
        painelEx.appendChild(h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: corrigir }, 'Corrigir'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { mostrar(null); } }, 'Ver solução'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { novoEx(est.ex.tipo); } }, 'Novo problema')));
        painelEx.appendChild(exFb);
        desenharExRosa();
        atualizarPlacar();
      }
      function desenharExRosa() {
        var ex = est.ex;
        if (oculto || !ex.st) { desenharRosa({ dec: 0, dag: 0, rv: 0 }, 'rumo'); }
        else {
          var r = calc(ex.st);
          desenharRosa(r, ex.st.tipo);
          gProa.style.display = ex.tipo === 'dec' ? 'none' : '';
          gBarco.style.display = ex.tipo === 'dec' ? 'none' : '';
        }
        desenharTabela(oculto ? null : calc(ex.st));
      }
      function lerResp() {
        var r = {}, falta = false;
        Object.keys(exInputs).forEach(function (k) {
          var c = exInputs[k];
          if (c.tipo === 'ang') { r[k] = lerNum(c.inp.value); if (isNaN(r[k])) falta = true; }
          else if (c.tipo === 'ew') { var v = lerNum(c.inp.value); if (isNaN(v)) falta = true; r[k] = Math.abs(v) * (c.sel.value === 'E' ? 1 : -1); }
          else { var g = lerNum(c.inp.value), m = lerNum(c.inpM.value); if (isNaN(g) || isNaN(m)) falta = true; r[k] = (Math.abs(g) + Math.abs(m) / 60) * (c.sel.value === 'E' ? 1 : -1); }
        });
        return falta ? null : r;
      }
      function confere(tipo, resp, certo) {
        if (tipo === 'ang') return Math.abs(difAng(resp, certo)) <= 0.5 + 1e-9;
        if (tipo === 'ew') return Math.abs(resp - certo) <= 0.5 + 1e-9;
        return Math.abs(resp - certo) * 60 <= 1.01;
      }
      function fmtCerto(tipo, v) { return tipo === 'ang' ? fmtR(v) : tipo === 'ew' ? fmtEW(v) : fmtGM(v); }
      function corrigir() {
        var resp = lerResp();
        if (!resp) { exFb.innerHTML = '<p>Preencha todos os campos (use 0 quando não houver correção).</p>'; return; }
        mostrar(resp);
      }
      function mostrar(resp) {
        var ex = est.ex, okTudo = true, linhas = [];
        ex.campos.forEach(function (c) {
          var certo = ex.certo[c.id], tipo = exInputs[c.id].tipo;
          if (resp) {
            var ok = confere(tipo, resp[c.id], certo); if (!ok) okTudo = false;
            exInputs[c.id].el.setAttribute('data-res', ok ? 'certa' : 'errada');
            linhas.push('<li data-ok="' + (ok ? 1 : 0) + '">' + VL.esc(c.rot) + ': ' + (ok ? 'certo' : 'o certo é ' + fmtCerto(tipo, certo) + (tipo === 'ew' && Math.abs(Math.abs(resp[c.id]) - Math.abs(certo)) <= 0.5 && Math.sign(resp[c.id]) !== Math.sign(certo) && certo !== 0 ? ' (o valor está bom, mas o lado E/W está trocado)' : '')) + '</li>');
          } else linhas.push('<li>' + VL.esc(c.rot) + ': ' + fmtCerto(tipo, certo) + '</li>');
        });
        if (resp && !ex.contado) { ex.contado = true; est.tentativas++; if (okTudo) est.acertos++; }
        var html = resp ? '<p class="ag-res" data-ok="' + (okTudo ? 1 : 0) + '">' + (okTudo ? 'Certo!' : 'Ainda não.') + '</p>' : '<p class="ag-res">Solução</p>';
        html += '<ul class="ag-res-lista">' + linhas.join('') + '</ul>';
        html += '<p class="ag-res-sub">Resolução comentada</p><ol class="ag-passos">' + ex.passos.map(function (p) { return '<li>' + VL.esc(p) + '</li>'; }).join('') + '</ol>';
        html += '<p class="ag-ref">Manual de Navegação da MB, Vol. I, itens 3.2.3 a 3.2.5. Na rosa, leia os valores em cada anel.</p>';
        exFb.innerHTML = html;
        oculto = false;
        desenharExRosa();
        atualizarPlacar();
      }
      function atualizarPlacar() { placar.textContent = est.modo === 'exercicio' ? 'Acertos: ' + est.acertos + ' de ' + est.tentativas : ''; }

      /* ---------------- modos ---------------- */
      function definirModo(m) {
        est.modo = m;
        VL.$$('button', modoSeg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
        painelExp.hidden = m !== 'explorar'; painelEx.hidden = m !== 'exercicio';
        svg.classList.toggle('ag-svg-fixo', m !== 'explorar');
        if (m === 'exercicio') { if (!est.ex) novoEx(opts.exercicio || 'rag-rv'); else { renderEx(); } }
        else { oculto = false; montarExplorar(); }
        atualizarPlacar();
      }

      var offSet = VL.on('settings', function () { if (est.modo === 'explorar') montarExplorar(); });
      definirModo(est.modo);
      return function () { offSet(); arrasto = null; };
    },
  });
})();
