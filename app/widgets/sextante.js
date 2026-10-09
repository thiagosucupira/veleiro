/* Widget "sextante" — o sextante náutico: o instrumento em 3D (Three.js), a observação do Sol pela
   luneta (canvas 2D) e as correções da altura, com exercício completo.

   Abas:
     instrumento → modelo 3D procedural (armação, limbo graduado, alidade, espelho grande e pequeno,
                   luneta, filtros, tambor micrométrico, alavanca, punho). Gire, toque nas peças e veja
                   o caminho da luz (princípio da dupla reflexão).
     observar    → visão pela luneta: leve o limbo inferior do Sol a tangenciar o horizonte, balance o
                   sextante e registre a altura instrumental (Hi). Também mede o erro instrumental.
     correcoes   → Hi → erro instrumental → depressão do horizonte → refração → semidiâmetro →
                   paralaxe → altura verdadeira (Ho), com cada correção explicada.
     exercicio   → 1) medir o erro instrumental, 2) observar o Sol, 3) corrigir a altura.

   opts (todas opcionais):
     { aba: 'instrumento' | 'observar' | 'correcoes' | 'exercicio'   (padrão 'instrumento'),
       abas: [...]                (quais abas mostrar; padrão todas),
       espelho: 'inteiro' | 'meio' (espelho pequeno de horizonte inteiro ou meio espelhado; padrão 'inteiro'),
       titulo: 'texto da legenda' }

   Exemplo de bloco de lição:
     { t: 'widget', w: 'sextante', opts: { aba: 'observar', espelho: 'meio' } }

   Fórmulas e fontes: depressão do horizonte dp = 1,76′·√h (h em metros) e refração de Bennett
   R = cot(aa + 7,31/(aa + 4,4)) em minutos, para 10 °C e 1010 hPa — as mesmas usadas pelo Nautical
   Almanac; semidiâmetro e paralaxe horizontal do Sol pela distância Terra–Sol do dia (Astronomical
   Almanac, fórmulas de baixa precisão). Nomes das peças e sequência das correções: Miguens, Navegação:
   a Ciência e a Arte, vol. II (DHN); Bowditch, The American Practical Navigator (NGA Pub. 9), cap. 16. */
(function () {
  'use strict';
  var h = VL.h;
  var RAD = Math.PI / 180;

  /* ------------------------------------------------------------------ matemática */
  function n360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function n180(x) { x = n360(x); return x > 180 ? x - 360 : x; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function solDia(iso) {
    var p = iso.split('-').map(Number), jd = Date.UTC(p[0], p[1] - 1, p[2]) / 86400000 + 2440587.5 + 0.5;
    var n = jd - 2451545.0, g = n360(357.528 + 0.9856003 * n);
    var r = 1.00014 - 0.01671 * Math.cos(g * RAD) - 0.00014 * Math.cos(2 * g * RAD);
    return { sd: 959.63 / r / 60, ph: 8.794 / r / 60 };
  }
  function dip(hm) { return 1.76 * Math.sqrt(Math.max(0, hm)); }
  function refr(ha) { var x = Math.max(ha, -0.9); return 1 / Math.tan((x + 7.31 / (x + 4.4)) * RAD); }
  function fatorTP(t, p) { return (p / 1010) * (283 / (273 + t)); }
  /** Cadeia de correções. ai em graus; ei, sd, ph em minutos; hm em metros. */
  function corrigir(ai, ei, hm, sd, ph, limbo, ftp) {
    var ao = ai + ei / 60, dp = dip(hm), aa = ao - dp / 60, R = refr(aa) * (ftp || 1), P = ph * Math.cos(aa * RAD);
    var s = limbo === 'sup' ? -sd : sd;
    return { ai: ai, ei: ei, ao: ao, dp: dp, aa: aa, R: R, SD: s, P: P, av: aa + (-R + s + P) / 60 };
  }
  /** Altura aparente do limbo inferior que corresponde a uma altura verdadeira do centro. */
  function aparenteLimbo(av, sd, ph) { var aa = av; for (var i = 0; i < 40; i++) aa = av - (-refr(aa) + sd + ph * Math.cos(aa * RAD)) / 60; return aa; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function rot(v, n, ang) {
    var c = Math.cos(ang), s = Math.sin(ang), d = dot(v, n), cx = cross(n, v);
    return [v[0] * c + cx[0] * s + n[0] * d * (1 - c), v[1] * c + cx[1] * s + n[1] * d * (1 - c), v[2] * c + cx[2] * s + n[2] * d * (1 - c)];
  }

  /** Testa WebGL sem acionar o Three.js (evita erros no console quando não há suporte). */
  function temWebGL() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ formatação */
  function num(x, c) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(c).replace('.', ','); }
  function gm(x, c) {
    c = c == null ? 1 : c;
    var neg = x < 0; x = Math.abs(x);
    var d = Math.floor(x + 1e-12), m = Number(((x - d) * 60).toFixed(c));
    if (m >= 60) { d += 1; m = 0; }
    return (neg ? '−' : '') + d + '° ' + (m < 10 ? '0' : '') + m.toFixed(c).replace('.', ',') + '′';
  }
  function fMinS(v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',') + '′'; }
  function fData(iso) { return iso.split('-').reverse().join('/'); }
  function parseNum(s) { s = String(s == null ? '' : s).trim().replace(/\s/g, '').replace('−', '-').replace(',', '.'); return /^[-+]?\d*\.?\d+$/.test(s) ? Number(s) : NaN; }
  /** Leitura do sextante: graus na alidade + minutos no tambor; negativa = fora do arco. */
  function leituraPartes(r) {
    var t = Math.round(r * 600) / 600, g = Math.floor(t + 1e-9), m = Math.round((t - g) * 600) / 10;
    if (m >= 60) { g += 1; m = 0; }
    return { g: g, m: m, t: t };
  }
  function fLeitura(r) {
    var p = leituraPartes(r);
    if (p.t < 0) return gm(-p.t) + ' fora do arco';
    return gm(p.t);
  }

  /* ------------------------------------------------------------------ peças */
  var PECAS = [
    { id: 'armacao', nome: 'Armação', en: 'frame', txt: 'O corpo do instrumento, rígido e leve. Tem a forma de um setor de 60° de círculo — a sexta parte, daí o nome "sextante". Tudo o mais é montado nela.' },
    { id: 'limbo', nome: 'Limbo (arco graduado)', en: 'arc', txt: 'O arco na base da armação, graduado em graus. Embora meça só 60° de círculo, é numerado até cerca de 120°: por causa da dupla reflexão, girar a alidade 1° faz a imagem andar 2°. Na borda fica a cremalheira (dentes) onde engrena o parafuso do tambor.' },
    { id: 'alidade', nome: 'Alidade (braço de índice)', en: 'index arm', txt: 'O braço móvel que gira em torno do centro do arco. Leva o espelho grande no eixo e, na outra ponta, o índice que marca os graus no limbo, o tambor e a alavanca.' },
    { id: 'espgrande', nome: 'Espelho grande (de índice)', en: 'index mirror', txt: 'Preso à alidade, gira com ela. Recebe a luz do astro e a manda para o espelho pequeno. Quando os dois espelhos estão paralelos, a leitura é zero.' },
    { id: 'esppequeno', nome: 'Espelho pequeno (do horizonte)', en: 'horizon glass', txt: 'Fixo na armação, na frente da luneta. No modelo tradicional, a metade do lado da armação é espelhada (mostra a imagem refletida do astro) e a outra metade é transparente (deixa ver o horizonte). No de horizonte inteiro, um espelho semitransparente mostra as duas imagens sobrepostas.' },
    { id: 'luneta', nome: 'Luneta', en: 'telescope', txt: 'Aumenta a imagem e mantém a linha de visada paralela à armação. Aponta para o horizonte através do espelho pequeno.' },
    { id: 'filtrosg', nome: 'Filtros do espelho grande', en: 'index shades', txt: 'Vidros escuros (vidros corados) entre os dois espelhos. Rebatidos sobre o caminho da luz, protegem o olho da luz do Sol refletida. Use sempre antes de apontar para o Sol.' },
    { id: 'filtrosp', nome: 'Filtros do espelho pequeno', en: 'horizon shades', txt: 'Vidros escuros na frente do espelho pequeno. Diminuem o brilho do horizonte quando há reflexo forte do Sol no mar.' },
    { id: 'tambor', nome: 'Tambor micrométrico', en: 'micrometer drum', txt: 'Gira um parafuso sem-fim que engrena na cremalheira do limbo. Uma volta completa move a alidade 1°; a escala do tambor dá os minutos (0′ a 60′) e o nônio ao lado, os décimos.' },
    { id: 'alavanca', nome: 'Alavanca de liberação', en: 'release clamp', txt: 'Apertada, solta o parafuso da cremalheira e a alidade corre livre ao longo do arco, para a aproximação grosseira. Solta, o ajuste fino é feito no tambor.' },
    { id: 'punho', nome: 'Punho (cabo)', en: 'handle', txt: 'Fica atrás da armação. Segura-se com a mão direita; a esquerda gira o tambor.' },
  ];
  function peca(id) { for (var i = 0; i < PECAS.length; i++) if (PECAS[i].id === id) return PECAS[i]; return null; }

  /* geometria (unidades: raio do arco ≈ 1) */
  var HM = [-0.32, -0.42];                 // espelho pequeno (no plano da armação)
  var ZL = 0.15;                           // plano da luz, acima da armação
  var GAMA = Math.atan2(HM[1], HM[0]) / RAD;   // direção espelho grande → pequeno
  var ALFA0 = (n360(GAMA) - 180) / 2;          // normal do espelho grande na leitura zero (≈ 26°)
  function anguloAlidade(r) { return -60 - r / 2; }

  VL.widgets.define('sextante', {
    css: ['assets/css/widgets/sextante.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var limpezas = [];
      var vivo = true;
      var intl = !!VL.settings.get('intl');
      function en(t) { return intl && t ? ' (' + t + ')' : ''; }
      var reduzMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var ABAS = [['instrumento', 'O instrumento'], ['observar', 'Observar o Sol'], ['correcoes', 'Correções'], ['exercicio', 'Exercício']]
        .filter(function (a) { return !opts.abas || opts.abas.indexOf(a[0]) >= 0; });
      if (!ABAS.length) ABAS = [['instrumento', 'O instrumento']];
      var st = { aba: ABAS.some(function (a) { return a[0] === opts.aba; }) ? opts.aba : ABAS[0][0] };
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'O sextante: o instrumento, a observação e as correções', controlesAntes: true });
      el.appendChild(ins.raiz);
      var segAba = h('div', { class: 'segmented sx-abas', role: 'group', 'aria-label': 'Parte do simulador' });
      ABAS.forEach(function (a) { segAba.appendChild(h('button', { type: 'button', 'data-v': a[0], 'aria-pressed': String(a[0] === st.aba), onclick: function () { irPara(a[0]); } }, a[1])); });
      if (ABAS.length > 1) ins.controles.appendChild(segAba);
      ins.legenda.appendChild(h('span', { class: 'sx-fonte' }, 'Fontes: Miguens, Navegação: a Ciência e a Arte, vol. II (DHN); Bowditch, NGA Pub. 9, cap. 16; correções como no Nautical Almanac (dp = 1,76′√h; refração de Bennett).'));
      var paineis = {}, apis = {};
      function irPara(a, dados) {
        st.aba = a;
        VL.$$('button', segAba).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === a)); });
        if (!paineis[a]) { paineis[a] = h('div', { class: 'sx-painel' }); ins.corpo.appendChild(paineis[a]); apis[a] = CONSTRUIR[a](paineis[a]) || {}; }
        Object.keys(paineis).forEach(function (k) { paineis[k].hidden = k !== a; if (apis[k] && apis[k].ativo) apis[k].ativo(k === a); });
        if (dados && apis[a].preencher) apis[a].preencher(dados);
      }
      function seg(rotulo, itens, valor, aoMudar) {
        var s = h('div', { class: 'segmented sx-seg', role: 'group', 'aria-label': rotulo });
        var api = { el: s, valor: valor, set: function (v) { api.valor = v; VL.$$('button', s).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); } };
        itens.forEach(function (it) { s.appendChild(h('button', { type: 'button', 'data-v': it[0], 'aria-pressed': String(it[0] === valor), onclick: function () { api.set(it[0]); if (aoMudar) aoMudar(it[0]); } }, it[1])); });
        return api;
      }
      function campoNum(o) {
        var i = h('input', { type: 'text', inputmode: 'decimal', class: 'sx-in', 'aria-label': o.rotulo, autocomplete: 'off' });
        var erro = h('span', { class: 'sx-erro-campo', 'aria-live': 'polite' });
        var lab = h('label', { class: 'sx-campo' }, h('span', { class: 'sx-leg' }, o.rotulo), h('span', { class: 'sx-ang' }, i, o.un ? h('span', { class: 'sx-un' }, o.un) : null), o.dica ? h('span', { class: 'sx-dica' }, o.dica) : null, erro);
        return {
          el: lab, input: i,
          get: function () { var v = parseNum(i.value); var ok = isFinite(v) && (o.min == null || v >= o.min) && (o.max == null || v <= o.max); i.setAttribute('aria-invalid', String(!ok)); erro.textContent = ok ? '' : (o.msg || 'Número inválido.'); return ok ? v : NaN; },
          set: function (v) { i.value = v == null || !isFinite(v) ? '' : (o.sinal && v > 0 ? '+' : '') + num(v, o.casas == null ? 1 : o.casas); i.removeAttribute('aria-invalid'); erro.textContent = ''; },
          on: function (fn) { i.addEventListener('input', fn); },
        };
      }
      function campoAng(o) {
        var g = h('input', { type: 'text', inputmode: 'numeric', class: 'sx-in sx-in-g', 'aria-label': o.rotulo + ': graus', autocomplete: 'off' });
        var m = h('input', { type: 'text', inputmode: 'decimal', class: 'sx-in sx-in-m', 'aria-label': o.rotulo + ': minutos', autocomplete: 'off' });
        var erro = h('span', { class: 'sx-erro-campo', 'aria-live': 'polite' });
        var fs = h('fieldset', { class: 'sx-campo' }, h('legend', { class: 'sx-leg' }, o.rotulo), h('span', { class: 'sx-ang' }, g, h('span', { class: 'sx-un' }, '°'), m, h('span', { class: 'sx-un' }, '′')), erro);
        return {
          el: fs,
          get: function () {
            var gv = parseNum(g.value), mv = m.value.trim() === '' ? 0 : parseNum(m.value);
            var ok = isFinite(gv) && gv >= 0 && gv <= 90 && Math.floor(gv) === gv && isFinite(mv) && mv >= 0 && mv < 60;
            g.setAttribute('aria-invalid', String(!ok)); m.setAttribute('aria-invalid', String(!ok));
            erro.textContent = ok ? '' : 'Graus inteiros de 0 a 90 e minutos de 0 a 59,9.';
            return ok ? gv + mv / 60 : NaN;
          },
          set: function (v) { var d = Math.floor(v + 1e-12), mi = Math.round((v - d) * 600) / 10; if (mi >= 60) { d++; mi = 0; } g.value = String(d); m.value = mi.toFixed(1).replace('.', ','); erro.textContent = ''; g.removeAttribute('aria-invalid'); m.removeAttribute('aria-invalid'); },
          on: function (fn) { g.addEventListener('input', fn); m.addEventListener('input', fn); },
        };
      }
      function passo(n, titulo, linhas, res, nota) {
        return h('li', { class: 'sx-passo' }, h('p', { class: 'sx-passo-t' }, h('span', { class: 'sx-passo-n' }, String(n)), titulo),
          (linhas || []).map(function (l) { return h('p', { class: 'sx-form' }, l); }), res ? h('p', { class: 'sx-res' }, res) : null, nota ? h('p', { class: 'sx-passo-nota' }, nota) : null);
      }
      function fb(ok, titulo, corpo) { return h('div', { class: 'explicacao sx-fb' }, h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, titulo), corpo); }

      /* ================================================================== 1. O INSTRUMENTO (3D) */
      function painelInstrumento(box) {
        box.appendChild(h('p', { class: 'sx-intro' }, 'O sextante mede o ângulo entre dois pontos — no mar, entre um astro e o horizonte. Gire o modelo com o dedo ou o mouse, toque numa peça (ou num nome da lista) e mova a alidade para ver como os espelhos trabalham.'));
        var grade = h('div', { class: 'sx-grade' });
        box.appendChild(grade);
        var cena = h('div', { class: 'sx-cena' });
        var canvasBox = h('div', { class: 'sx-canvas cena-3d', role: 'img', 'aria-label': 'Modelo 3D do sextante. Use a lista de peças para escolher uma peça.' });
        var rotulos = h('div', { class: 'sx-rotulos', 'aria-hidden': 'true' });
        var dica = h('div', { class: 'sx-dica3d' }, 'Arraste para girar. Pinça ou roda do mouse para aproximar. Toque numa peça.');
        cena.appendChild(canvasBox); cena.appendChild(rotulos);
        var lado = h('div', { class: 'sx-lado' });
        grade.appendChild(h('div', { class: 'sx-col-cena' }, cena, dica)); grade.appendChild(lado);
        /* controles */
        var lerOut = h('output', { class: 'sx-valor' });
        var lerIn = h('input', { type: 'range', min: '0', max: '120', step: '0.5', value: '40', 'aria-label': 'Leitura do sextante (posição da alidade)' });
        var swLuz = h('input', { type: 'checkbox', role: 'switch' }); swLuz.checked = true;
        var swNum = h('input', { type: 'checkbox', role: 'switch' }); swNum.checked = true;
        var btVista = h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, 'Vista de frente');
        var btTras = h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, 'Vista de trás');
        lado.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Mover a alidade'),
          h('label', { class: 'sx-linha-v' }, h('span', null, 'Leitura no limbo'), lerOut), lerIn,
          h('label', { class: 'switch sx-switch' }, swLuz, h('span', null, 'Mostrar o caminho da luz')),
          h('label', { class: 'switch sx-switch' }, swNum, h('span', null, 'Números nas peças')),
          h('div', { class: 'btn-row' }, btVista, btTras)));
        var lista = h('ol', { class: 'sx-pecas' });
        var info = h('div', { class: 'sx-info', 'aria-live': 'polite' });
        lado.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Peças'), lista, info));
        var luzTxt = h('p', { class: 'sx-dica' });
        lado.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Dupla reflexão'), luzTxt));
        var sel = null;
        PECAS.forEach(function (p, i) {
          lista.appendChild(h('li', null, h('button', { type: 'button', class: 'sx-peca', 'data-p': p.id, 'aria-pressed': 'false', onclick: function () { selecionar(sel === p.id ? null : p.id); } },
            h('span', { class: 'sx-peca-n' }, String(i + 1)), p.nome)));
        });
        function selecionar(id) {
          sel = id;
          VL.$$('.sx-peca', lista).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-p') === id)); });
          info.innerHTML = '';
          if (id) { var p = peca(id); info.appendChild(h('p', null, h('strong', null, p.nome + en(p.en) + '. '), p.txt)); }
          if (m3d) m3d.destacar(id);
        }
        function atualizarLeitura() {
          var r = +lerIn.value;
          lerOut.textContent = gm(r, 0).replace(' 00′', '');
          luzTxt.textContent = 'Com a alidade em ' + num(r, 1).replace(',0', '') + '°, os espelhos formam entre si ' + num(r / 2, 2).replace(/,?0+$/, '') + '°. O raio do astro, depois de refletir nos dois espelhos, sai desviado do dobro desse ângulo: ' + num(r, 1).replace(',0', '') + '°. É isso que o limbo mostra. O raio que vai do espelho grande ao pequeno nunca muda de direção.';
          if (m3d) m3d.leitura(r);
        }
        lerIn.addEventListener('input', atualizarLeitura);
        swLuz.addEventListener('change', function () { if (m3d) m3d.luz(swLuz.checked); });
        swNum.addEventListener('change', function () { if (m3d) m3d.numeros(swNum.checked); });
        btVista.addEventListener('click', function () { if (m3d) m3d.vista('frente'); });
        btTras.addEventListener('click', function () { if (m3d) m3d.vista('tras'); });
        lado.appendChild(VL.ui.callout('seguranca', 'Proteja os olhos', 'Nunca olhe para o Sol pela luneta sem rebater os filtros do espelho grande. A luz do Sol concentrada pela luneta pode causar dano permanente à vista.'));
        var m3d = null, tresT = null, recriacoes = 0;
        /* abre (ou reabre, depois de uma perda de contexto WebGL) o modelo 3D e devolve a ele leitura, luz, números e peça escolhida */
        function abrirModelo() {
          m3d = Modelo3D(tresT, canvasBox, rotulos, dica, function (id) { selecionar(id); }, {
            recriar: function () {
              if (!vivo || ++recriacoes > 2) return false;
              if (m3d) { m3d.destruir(); m3d = null; }
              rotulos.innerHTML = '';
              return abrirModelo();
            },
            falhou: function () { if (m3d) { m3d.destruir(); m3d = null; } rotulos.innerHTML = ''; semWebGL(); },
          });
          if (!m3d) return false;
          m3d.leitura(+lerIn.value); m3d.luz(swLuz.checked); m3d.numeros(swNum.checked);
          if (sel) m3d.destacar(sel);
          return true;
        }
        VL.libs.three().then(function (T) { if (!vivo) return; tresT = T; if (!abrirModelo()) semWebGL(); })
          .catch(function () { if (vivo) semWebGL(); });
        function semWebGL() {
          canvasBox.classList.remove('cena-3d'); canvasBox.classList.add('sx-sem3d');
          canvasBox.innerHTML = '';
          canvasBox.appendChild(h('p', { class: 'callout callout-aconfirmar' }, 'Seu navegador não abriu a cena 3D (WebGL). Abaixo, o sextante visto de frente; a lista de peças continua funcionando.'));
          var fig = h('div', { class: 'sx-fig2d' }); canvasBox.appendChild(fig);
          var desenhar = function () { fig.innerHTML = ''; fig.appendChild(figura2D(+lerIn.value, sel)); };
          lerIn.addEventListener('input', desenhar); lista.addEventListener('click', function () { setTimeout(desenhar, 0); });
          desenhar(); dica.hidden = true;
        }
        atualizarLeitura();
        return { ativo: function (on) { if (m3d) m3d.ativo(on); }, destruir: function () { if (m3d) m3d.destruir(); m3d = null; } };
      }

      /* ---------------------------------------------------------------- modelo 3D */
      function Modelo3D(T, canvasBox, rotulos, dica, aoTocar, perda) {
        var renderer;
        if (!temWebGL()) return null;
        try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false }); } catch (e) { return null; }
        if (!renderer || !renderer.getContext()) return null;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        canvasBox.appendChild(renderer.domElement);
        renderer.domElement.style.touchAction = 'none';
        var cssR = new T.CSS2DRenderer({ element: rotulos });
        var scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 1.5, 0.02, 40);
        var controls = new T.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false; controls.enableDamping = false; controls.minDistance = 1.3; controls.maxDistance = 8; controls.rotateSpeed = 0.8;
        var alvo = new T.Vector3(0.0, -0.43, 0.06);
        controls.target.copy(alvo);
        var geos = [], mats = [], texs = [], pick = [], porPeca = {}, marcadores = [];
        var sujo = true, raf = 0, visivel = true, ativo = true;
        function cor(tok) {
          var p = String(tok).split('|');
          if (p.length === 3) return new T.Color(VL.cssVar(p[0]) || '#888888').lerp(new T.Color(VL.cssVar(p[1]) || '#888888'), +p[2]);
          return new T.Color(VL.cssVar(tok) || '#888888');
        }
        function G(g) { geos.push(g); return g; }
        function M(tok, extra, idPeca) {
          var m = new T.MeshStandardMaterial(Object.assign({ color: cor(tok), metalness: 0.35, roughness: 0.5 }, extra || {}));
          m.userData.token = tok; mats.push(m);
          if (idPeca) (porPeca[idPeca] = porPeca[idPeca] || []).push(m);
          return m;
        }
        function malha(g, m, idPeca, pai) { var o = new T.Mesh(G(g), m); if (idPeca) { o.userData.peca = idPeca; pick.push(o); } (pai || scene).add(o); return o; }
        var luzHem = new T.HemisphereLight(cor('--nav-white'), cor('--ink-2'), 1.7); scene.add(luzHem);
        var luzDir = new T.DirectionalLight(cor('--nav-white'), 2.4); luzDir.position.set(2.5, 3, 4); scene.add(luzDir);
        var luzDir2 = new T.DirectionalLight(cor('--nav-white'), 0.8); luzDir2.position.set(-3, -1, -2); scene.add(luzDir2);
        var modelo = new T.Group(); scene.add(modelo);

        /* --- armação: setor com furos --- */
        var A1 = -53, A2 = -127, RO = 1.05, RH = 0.12;
        var forma = new T.Shape();
        forma.moveTo(RO * Math.cos(A1 * RAD), RO * Math.sin(A1 * RAD));
        forma.absarc(0, 0, RO, A1 * RAD, A2 * RAD, true);
        forma.lineTo(RH * Math.cos(A2 * RAD), RH * Math.sin(A2 * RAD));
        forma.absarc(0, 0, RH, A2 * RAD, A1 * RAD, true);
        forma.lineTo(RO * Math.cos(A1 * RAD), RO * Math.sin(A1 * RAD));
        function furo(rIn, rOut, b1, b2, w1, w2) {
          var pts = [], N = 14, i, r, a;
          function lo(rr) { return b1 + Math.asin(Math.min(0.9, w1 / rr)) / RAD; }
          function hi(rr) { return b2 - Math.asin(Math.min(0.9, w2 / rr)) / RAD; }
          for (i = 0; i <= N; i++) { r = rIn + (rOut - rIn) * i / N; a = lo(r); pts.push(new T.Vector2(r * Math.cos(a * RAD), r * Math.sin(a * RAD))); }
          for (i = 1; i <= N; i++) { a = lo(rOut) + (hi(rOut) - lo(rOut)) * i / N; pts.push(new T.Vector2(rOut * Math.cos(a * RAD), rOut * Math.sin(a * RAD))); }
          for (i = 1; i <= N; i++) { r = rOut - (rOut - rIn) * i / N; a = hi(r); pts.push(new T.Vector2(r * Math.cos(a * RAD), r * Math.sin(a * RAD))); }
          for (i = 1; i < N; i++) { a = hi(rIn) - (hi(rIn) - lo(rIn)) * i / N; pts.push(new T.Vector2(rIn * Math.cos(a * RAD), rIn * Math.sin(a * RAD))); }
          return new T.Path(pts);
        }
        forma.holes.push(furo(0.24, 0.46, -90, -53, 0.035, 0.05), furo(0.57, 0.85, -90, -53, 0.035, 0.05));
        forma.holes.push(furo(0.24, 0.46, -127, -90, 0.05, 0.035), furo(0.57, 0.85, -127, -90, 0.05, 0.035));
        var matArm = M('--land|--land-ink|0.5', { metalness: 0.6, roughness: 0.32 }, 'armacao');
        malha(new T.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 48 }), matArm, 'armacao', modelo);

        /* --- limbo graduado (textura de canvas numa coroa) --- */
        var RI_L = 0.9, RO_L = 1.035;
        var texCanvas = document.createElement('canvas'); texCanvas.width = texCanvas.height = 2048;
        var texLimbo = new T.CanvasTexture(texCanvas); texs.push(texLimbo);
        texLimbo.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        function desenharLimbo() {
          var c = texCanvas.getContext('2d'), S = texCanvas.width;
          c.clearRect(0, 0, S, S);
          function P(r, a) { return [(r * Math.cos(a * RAD) / RO_L + 1) / 2 * S, (1 - (r * Math.sin(a * RAD) / RO_L + 1) / 2) * S]; }
          c.fillStyle = VL.cssVar('--surface'); c.beginPath();
          c.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); c.fill();
          c.strokeStyle = VL.cssVar('--ink'); c.fillStyle = VL.cssVar('--ink');
          for (var g = -5; g <= 125; g++) {
            var a = anguloAlidade(g), L = g % 10 === 0 ? 0.06 : g % 5 === 0 ? 0.045 : 0.03;
            var p1 = P(RO_L - 0.004, a), p2 = P(RO_L - 0.004 - L, a);
            c.lineWidth = g % 10 === 0 ? 4 : g % 5 === 0 ? 3 : 2;
            c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke();
            if (g % 10 === 0 && g >= 0) {
              var pt = P(RO_L - 0.098, a);
              c.save(); c.translate(pt[0], pt[1]); c.rotate(-(a + 90) * RAD);
              c.font = '700 44px ' + (VL.cssVar('--font') || 'sans-serif'); c.textAlign = 'center'; c.textBaseline = 'middle';
              c.fillText(String(g), 0, 0); c.restore();
            }
          }
          c.lineWidth = 2; c.beginPath();
          var q1 = P(RO_L - 0.004, anguloAlidade(-5)); c.moveTo(q1[0], q1[1]);
          for (var gg = -5; gg <= 125; gg += 1) { var q = P(RO_L - 0.004, anguloAlidade(gg)); c.lineTo(q[0], q[1]); }
          c.stroke();
          texLimbo.needsUpdate = true;
        }
        desenharLimbo();
        var matLimbo = M('--surface', { map: texLimbo, metalness: 0.15, roughness: 0.55, color: new T.Color(0xffffff) }, 'limbo');
        matLimbo.userData.token = null;
        var limbo = malha(new T.RingGeometry(RI_L, RO_L, 160, 1, (A2 + 1) * RAD, (A1 - A2 - 2) * RAD), matLimbo, 'limbo', modelo);
        limbo.position.z = 0.0345;
        /* cremalheira: dentes finos na borda */
        var gDentes = new T.TorusGeometry(RO + 0.004, 0.009, 4, 200, (A1 - A2 - 2) * RAD);
        var dentes = malha(gDentes, M('--land|--land-ink|0.5', { metalness: 0.6, roughness: 0.3 }, 'limbo'), 'limbo', modelo);
        dentes.rotation.z = (A2 + 1) * RAD; dentes.position.z = 0.015;

        /* --- espelho pequeno, luneta, filtros, punho (fixos) --- */
        var matEsp = M('--sea-1|--sea-2|0.5', { metalness: 0.25, roughness: 0.12 }, 'esppequeno');
        var matVidro = M('--sea-1', { metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.32, depthWrite: false }, 'esppequeno');
        var matMold = M('--ink', { metalness: 0.4, roughness: 0.45 }, 'esppequeno');
        var gEP = new T.Group(); gEP.position.set(HM[0], HM[1], 0); modelo.add(gEP);
        /* normal refletora do espelho pequeno: bissetriz entre a direção ao espelho grande e a da luneta */
        var nEP = n360(GAMA + 180) / 2;
        var gEPm = new T.Group(); gEPm.rotation.z = (nEP + 180 - 90) * RAD; gEPm.position.z = 0; gEP.add(gEPm);
        malha(new T.BoxGeometry(0.13, 0.008, 0.08), matEsp, 'esppequeno', gEPm).position.set(0, 0, ZL - 0.04);
        malha(new T.BoxGeometry(0.13, 0.008, 0.08), matVidro, 'esppequeno', gEPm).position.set(0, 0, ZL + 0.04);
        malha(new T.BoxGeometry(0.15, 0.016, 0.012), matMold, 'esppequeno', gEPm).position.set(0, 0.006, ZL + 0.086);
        malha(new T.BoxGeometry(0.15, 0.016, 0.012), matMold, 'esppequeno', gEPm).position.set(0, 0.006, ZL - 0.086);
        malha(new T.BoxGeometry(0.06, 0.05, ZL - 0.12), matMold, 'esppequeno', gEP).position.set(0.01, 0.03, 0.03 + (ZL - 0.12) / 2);
        var matLun = M('--ink', { metalness: 0.5, roughness: 0.35 }, 'luneta');
        var tubo = malha(new T.CylinderGeometry(0.036, 0.036, 0.5, 32), matLun, 'luneta', modelo); tubo.rotation.z = Math.PI / 2; tubo.position.set(0.17, HM[1], ZL);
        var ocu = malha(new T.CylinderGeometry(0.03, 0.026, 0.12, 32), matLun, 'luneta', modelo); ocu.rotation.z = Math.PI / 2; ocu.position.set(0.48, HM[1], ZL);
        var obj = malha(new T.CylinderGeometry(0.042, 0.042, 0.04, 32), M('--ink-2', { metalness: 0.6, roughness: 0.3 }, 'luneta'), 'luneta', modelo); obj.rotation.z = Math.PI / 2; obj.position.set(-0.07, HM[1], ZL);
        malha(new T.BoxGeometry(0.07, 0.05, ZL - 0.06), matLun, 'luneta', modelo).position.set(0.31, HM[1], 0.03 + (ZL - 0.06) / 2);
        /* filtros do espelho grande: no caminho entre os espelhos */
        var u = [HM[0] / Math.hypot(HM[0], HM[1]), HM[1] / Math.hypot(HM[0], HM[1])], perp = [-u[1], u[0]];
        var matFg = [M('--ink-2', { transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.15 }, 'filtrosg'), M('--ok', { transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.15 }, 'filtrosg'), M('--land-ink', { transparent: true, opacity: 0.55, metalness: 0.1, roughness: 0.15 }, 'filtrosg')];
        var dists = [0.36, 0.4, 0.44], filtrosG = [];
        dists.forEach(function (t, i) {
          var q = [HM[0] * t, HM[1] * t];
          var piv = new T.Group(); piv.position.set(q[0] + perp[0] * 0.075, q[1] + perp[1] * 0.075, ZL); modelo.add(piv);
          var gl = malha(new T.BoxGeometry(0.11, 0.004, 0.09), matFg[i], 'filtrosg', piv);
          gl.rotation.z = Math.atan2(perp[1], perp[0]); gl.position.set(-perp[0] * 0.075, -perp[1] * 0.075, 0);
          malha(new T.CylinderGeometry(0.008, 0.008, 0.1, 10), M('--ink', null, 'filtrosg'), 'filtrosg', piv).rotation.x = Math.PI / 2;
          piv.rotation.z = i === 0 ? 0 : (i === 1 ? 1.6 : 1.75);
          filtrosG.push(piv);
        });
        var filtrosP = [];
        [0, 1, 2].forEach(function (i) {
          var piv = new T.Group(); piv.position.set(HM[0] - 0.12 - i * 0.014, HM[1] - 0.075, ZL + 0.04); modelo.add(piv);
          var gl = malha(new T.BoxGeometry(0.004, 0.08, 0.075), matFg[i], 'filtrosp', piv); gl.position.set(0, 0.075, 0);
          piv.rotation.z = i === 0 ? 0 : 1.5;
          filtrosP.push(piv);
          malha(new T.CylinderGeometry(0.007, 0.007, 0.09, 10), M('--ink', null, 'filtrosp'), 'filtrosp', piv).rotation.x = Math.PI / 2;
        });
        malha(new T.BoxGeometry(0.05, 0.03, ZL + 0.02), matMold, 'filtrosp', modelo).position.set(HM[0] - 0.13, HM[1] - 0.08, 0.03 + (ZL - 0.01) / 2 - 0.02);
        /* punho atrás */
        var matPunho = M('--land', { metalness: 0.05, roughness: 0.8 }, 'punho');
        var gPun = T.RoundedBoxGeometry ? new T.RoundedBoxGeometry(0.08, 0.36, 0.075, 3, 0.03) : new T.BoxGeometry(0.08, 0.36, 0.075);
        malha(gPun, matPunho, 'punho', modelo).position.set(0.12, -0.44, -0.15);
        malha(new T.BoxGeometry(0.05, 0.04, 0.12), M('--land-ink', { metalness: 0.5 }, 'punho'), 'punho', modelo).position.set(0.12, -0.28, -0.06);
        malha(new T.BoxGeometry(0.05, 0.04, 0.12), M('--land-ink', { metalness: 0.5 }, 'punho'), 'punho', modelo).position.set(0.12, -0.6, -0.06);

        /* --- alidade (gira) --- */
        var gAli = new T.Group(); modelo.add(gAli);
        var matAli = M('--ink-2', { metalness: 0.6, roughness: 0.35 }, 'alidade');
        malha(new T.BoxGeometry(0.86, 0.075, 0.018), matAli, 'alidade', gAli).position.set(0.43, 0, 0.045);
        malha(new T.CylinderGeometry(0.1, 0.1, 0.022, 40), matAli, 'alidade', gAli).rotation.x = Math.PI / 2;
        gAli.children[gAli.children.length - 1].position.z = 0.045;
        malha(new T.BoxGeometry(0.05, 0.11, 0.018), matAli, 'alidade', gAli).position.set(0.88, 0, 0.045);
        malha(new T.BoxGeometry(0.2, 0.016, 0.018), matAli, 'alidade', gAli).position.set(0.98, 0.05, 0.045);
        malha(new T.BoxGeometry(0.1, 0.12, 0.03), matAli, 'alidade', gAli).position.set(1.11, 0, 0.04);
        /* índice */
        var gInd = new T.BufferGeometry().setFromPoints([new T.Vector3(0.905, -0.012, 0), new T.Vector3(0.905, 0.012, 0), new T.Vector3(0.93, 0, 0)]);
        gInd.setIndex([0, 1, 2]); gInd.computeVertexNormals();
        malha(gInd, M('--magenta', { metalness: 0.1, roughness: 0.6, side: T.DoubleSide }, 'alidade'), 'alidade', gAli).position.z = 0.0552;
        /* espelho grande */
        var gEG = new T.Group(); gAli.add(gEG);
        var nLocal = ALFA0 + 60;   /* normal (lado de trás) no referencial da alidade */
        gEG.rotation.z = (nLocal - 90) * RAD;
        var matEG = M('--sea-1|--sea-2|0.5', { metalness: 0.25, roughness: 0.12 }, 'espgrande');
        malha(new T.BoxGeometry(0.2, 0.008, 0.19), matEG, 'espgrande', gEG).position.set(0, 0, ZL);
        malha(new T.BoxGeometry(0.22, 0.02, 0.21), M('--ink', { metalness: 0.4, roughness: 0.5 }, 'espgrande'), 'espgrande', gEG).position.set(0, 0.014, ZL);
        malha(new T.BoxGeometry(0.06, 0.04, ZL - 0.1), M('--ink', { metalness: 0.4 }, 'espgrande'), 'espgrande', gEG).position.set(0, 0.02, 0.055 + (ZL - 0.1) / 2);
        /* tambor e alavanca */
        var cTam = document.createElement('canvas'); cTam.width = 1024; cTam.height = 128;
        var texTam = new T.CanvasTexture(cTam); texs.push(texTam);
        function desenharTambor() {
          var c = cTam.getContext('2d');
          c.fillStyle = VL.cssVar('--surface'); c.fillRect(0, 0, 1024, 128);
          c.strokeStyle = c.fillStyle = VL.cssVar('--ink');
          for (var m = 0; m < 60; m++) {
            var x = 1024 - (m / 60) * 1024, L = m % 10 === 0 ? 56 : m % 5 === 0 ? 40 : 24;
            c.lineWidth = m % 5 === 0 ? 4 : 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, L); c.stroke();
            if (m % 10 === 0) { c.font = '700 40px sans-serif'; c.textAlign = 'center'; c.fillText(String(m), Math.min(1000, Math.max(24, x)), 104); }
          }
          texTam.needsUpdate = true;
        }
        desenharTambor();
        var matTam = M('--surface', { map: texTam, metalness: 0.2, roughness: 0.5, color: new T.Color(0xffffff) }, 'tambor'); matTam.userData.token = null;
        var gTam = new T.Group(); gTam.position.set(1.14, 0, 0.1); gAli.add(gTam);
        var tam = malha(new T.CylinderGeometry(0.06, 0.06, 0.05, 48, 1, true), matTam, 'tambor', gTam);
        malha(new T.CylinderGeometry(0.062, 0.062, 0.006, 48), M('--ink-2', { metalness: 0.6 }, 'tambor'), 'tambor', gTam).position.y = 0.028;
        malha(new T.CylinderGeometry(0.05, 0.062, 0.03, 48), M('--ink-2', { metalness: 0.6 }, 'tambor'), 'tambor', gTam).position.y = -0.04;
        var matAlav = M('--ink', { metalness: 0.5, roughness: 0.4 }, 'alavanca');
        malha(new T.BoxGeometry(0.22, 0.022, 0.024), matAlav, 'alavanca', gAli).position.set(1.02, -0.075, 0.075);
        malha(new T.BoxGeometry(0.03, 0.022, 0.05), matAlav, 'alavanca', gAli).position.set(0.92, -0.075, 0.055);

        /* --- marcadores numerados --- */
        var ancoras = {
          armacao: [[-0.176, -0.484, 0.04], modelo], limbo: [[-0.6, -0.84, 0.04], modelo], alidade: [[0.6, 0, 0.06], gAli],
          espgrande: [[0.02, 0.1, ZL + 0.1], gAli], esppequeno: [[HM[0] + 0.02, HM[1] + 0.13, ZL + 0.12], modelo], luneta: [[0.2, HM[1] + 0.06, ZL + 0.04], modelo],
          filtrosg: [[HM[0] * 0.4 + 0.08, HM[1] * 0.4 + 0.03, ZL + 0.06], modelo], filtrosp: [[HM[0] - 0.2, HM[1] - 0.1, ZL + 0.08], modelo],
          tambor: [[1.16, 0.11, 0.12], gAli], alavanca: [[0.97, -0.14, 0.08], gAli], punho: [[0.12, -0.44, -0.2], modelo],
        };
        PECAS.forEach(function (p, i) {
          var d = h('div', { class: 'sx-num3d', 'data-p': p.id }, String(i + 1));
          var o = new T.CSS2DObject(d); var a = ancoras[p.id];
          o.position.set(a[0][0], a[0][1], a[0][2]); a[1].add(o); marcadores.push(o);
        });

        /* --- caminho da luz --- */
        var gLuz = new T.Group(); modelo.add(gLuz);
        var matRaio = new T.MeshBasicMaterial({ color: cor('--magenta') }); matRaio.userData.token = '--magenta'; mats.push(matRaio);
        var matRaioH = new T.MeshBasicMaterial({ color: cor('--ok') }); matRaioH.userData.token = '--ok'; mats.push(matRaioH);
        var matSol = new T.MeshBasicMaterial({ color: cor('--nav-yellow') }); matSol.userData.token = '--nav-yellow'; mats.push(matSol);
        var solM = new T.Mesh(G(new T.SphereGeometry(0.05, 20, 14)), matSol); gLuz.add(solM);
        var rotSol = new T.CSS2DObject(h('div', { class: 'sx-rot3d' }, 'Sol')); rotSol.center.set(-0.25, 0.5); gLuz.add(rotSol);
        var rotHor = new T.CSS2DObject(h('div', { class: 'sx-rot3d sx-rot3d-h' }, 'do horizonte')); rotHor.center.set(0, 1.3); gLuz.add(rotHor);
        var rotOlho = new T.CSS2DObject(h('div', { class: 'sx-rot3d' }, 'olho')); rotOlho.center.set(-0.2, 0.5); gLuz.add(rotOlho);
        var rotAng = new T.CSS2DObject(h('div', { class: 'sx-rot3d sx-rot3d-ang' }, '')); rotAng.center.set(-0.1, 1.2); gLuz.add(rotAng);
        var tubos = [];
        function tuboEntre(a, b, m) { var c = new T.LineCurve3(a, b); var g = new T.TubeGeometry(c, 1, 0.006, 6, false); var o = new T.Mesh(g, m); gLuz.add(o); tubos.push(o); return o; }
        var leituraAtual = 40;
        function refazerLuz(r) {
          tubos.forEach(function (o) { gLuz.remove(o); o.geometry.dispose(); }); tubos = [];
          var P = new T.Vector3(0, 0, ZL), H = new T.Vector3(HM[0], HM[1], ZL), olho = new T.Vector3(0.62, HM[1], ZL);
          var d = new T.Vector3(Math.cos(r * RAD), -Math.sin(r * RAD), 0);
          var S0 = P.clone().sub(d.clone().multiplyScalar(0.5));
          tuboEntre(S0, P, matRaio); tuboEntre(P, H, matRaio); tuboEntre(H, olho, matRaio);
          var h0 = new T.Vector3(-0.95, HM[1], ZL + 0.04), h1 = new T.Vector3(0.62, HM[1], ZL + 0.04);
          tuboEntre(h0, h1, matRaioH);
          solM.position.copy(S0); rotSol.position.copy(S0); rotHor.position.copy(h0); rotOlho.position.copy(olho);
          rotAng.position.set(-0.05, 0.05, ZL);
          rotAng.element.textContent = 'leitura ' + num(r, 1).replace(',0', '') + '°';
        }
        /* --- interação --- */
        var ray = new T.Raycaster(), ptr = new T.Vector2(), ini = null;
        var dom = renderer.domElement;
        dom.addEventListener('pointerdown', function (ev) { ini = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
        dom.addEventListener('pointerup', function (ev) {
          if (!ini) return;
          var mov = Math.hypot(ev.clientX - ini.x, ev.clientY - ini.y); ini = null;
          if (mov > 7) return;
          var r = dom.getBoundingClientRect();
          ptr.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
          ray.setFromCamera(ptr, camera);
          var hit = ray.intersectObjects(pick, false).filter(function (x) { return x.object.visible; })[0];
          aoTocar(hit ? hit.object.userData.peca : null);
        });
        controls.addEventListener('change', marcar);
        var ro = new ResizeObserver(redimensionar); ro.observe(canvasBox);
        var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; if (visivel) marcar(); }) : null;
        if (io) io.observe(canvasBox);
        var offTema = VL.on('tema', function () { setTimeout(aplicarCores, 30); });
        function aplicarCores() {
          mats.forEach(function (m) { if (m.userData.token) m.color.copy(cor(m.userData.token)); });
          luzHem.color.set(VL.cssVar('--nav-white')); luzHem.groundColor.set(VL.cssVar('--ink-2'));
          renderer.setClearColor(cor('--paper'), 1);
          desenharLimbo(); desenharTambor();
          destacar(destaque);
          marcar();
        }
        var destaque = null;
        function destacar(id) {
          destaque = id;
          var mag = cor('--magenta');
          Object.keys(porPeca).forEach(function (k) { porPeca[k].forEach(function (m) { m.emissive.copy(k === id ? mag : new T.Color(0x000000)); m.emissiveIntensity = k === id ? 0.55 : 0; }); });
          marcadores.forEach(function (o) { o.element.classList.toggle('sx-num3d-sel', o.element.getAttribute('data-p') === id); });
          /* filtros rebatem quando escolhidos */
          filtrosG.forEach(function (p, i) { p.rotation.z = id === 'filtrosg' ? 0 : (i === 0 ? 0 : (i === 1 ? 1.6 : 1.75)); });
          filtrosP.forEach(function (p, i) { p.rotation.z = id === 'filtrosp' ? 0 : (i === 0 ? 0 : 1.5); });
          marcar();
        }
        var largura = 600;
        function redimensionar() {
          var w = canvasBox.clientWidth || 300, hh = canvasBox.clientHeight || 300;
          largura = w;
          renderer.setSize(w, hh, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
          cssR.setSize(w, hh); camera.aspect = w / hh; camera.updateProjectionMatrix();
          if (!camera.userData.ok) { vista('frente'); camera.userData.ok = true; }
          marcar();
        }
        function vista(qual) {
          var dir = qual === 'tras' ? new T.Vector3(-0.35, 0.18, -1) : new T.Vector3(0.32, 0.2, 1);
          var tan = Math.tan(camera.fov / 2 * RAD);
          var dist = Math.max(0.9 / tan, 0.8 / (tan * camera.aspect)) + 0.1;
          camera.position.copy(alvo).add(dir.normalize().multiplyScalar(clamp(dist, controls.minDistance, controls.maxDistance)));
          controls.target.copy(alvo); controls.update(); marcar();
        }
        function marcar() { sujo = true; if (!raf) raf = requestAnimationFrame(quadro); }
        function quadro() {
          raf = 0;
          if (!visivel || !ativo) return;
          if (sujo) { renderer.render(scene, camera); cssR.render(scene, camera); afastarMarcadores(); sujo = false; }
        }
        /* Os pinos numerados são projetados do 3D; ao girar o modelo dois deles podem cair quase no mesmo ponto da tela
           (ex.: 6 e 11). Depois de cada quadro, os que ficam a menos de DMIN px são afastados um do outro, só na tela
           (propriedade CSS `translate`, que o CSS2DRenderer não reescreve). */
        var vTmp = new T.Vector3();
        function afastarMarcadores() {
          var DMIN = 26, W = canvasBox.clientWidth || 300, H = canvasBox.clientHeight || 300, itens = [];
          marcadores.forEach(function (o) {
            o.element.style.translate = '';
            if (!o.visible) return;
            o.getWorldPosition(vTmp); vTmp.project(camera);
            if (vTmp.z > 1) return;
            itens.push({ el: o.element, x: (vTmp.x * 0.5 + 0.5) * W, y: (-vTmp.y * 0.5 + 0.5) * H, dx: 0, dy: 0 });
          });
          for (var it = 0; it < 6; it++) {
            var mexeu = false;
            for (var i = 0; i < itens.length; i++) for (var j = i + 1; j < itens.length; j++) {
              var a = itens[i], b = itens[j], ddx = (b.x + b.dx) - (a.x + a.dx), ddy = (b.y + b.dy) - (a.y + a.dy), d = Math.sqrt(ddx * ddx + ddy * ddy);
              if (d >= DMIN) continue;
              if (d < 0.5) { ddx = 0; ddy = 1; d = 1; }
              var f = (DMIN - d) / 2 / d;
              a.dx -= ddx * f; a.dy -= ddy * f; b.dx += ddx * f; b.dy += ddy * f; mexeu = true;
            }
            if (!mexeu) break;
          }
          itens.forEach(function (n) { if (n.dx || n.dy) n.el.style.translate = n.dx.toFixed(1) + 'px ' + n.dy.toFixed(1) + 'px'; });
        }
        renderer.setClearColor(cor('--paper'), 1);
        redimensionar();
        /* perda do contexto WebGL: aviso, restauração (Three.js recria os recursos) ou recriação do modelo (VL.gl3d, core/ui.js) */
        var vigia = VL.gl3d.vigiar(renderer.domElement, canvasBox, {
          restaurou: function () { largura = 0; redimensionar(); marcar(); },
          recriar: perda && perda.recriar,
          falhou: perda && perda.falhou,
        });
        return {
          leitura: function (r) {
            leituraAtual = r; gAli.rotation.z = (anguloAlidade(r) + 0) * RAD;
            var minutos = (r % 1) * 60; tam.rotation.y = -minutos * 6 * RAD;
            refazerLuz(r); marcar();
          },
          luz: function (on) { gLuz.visible = on; marcar(); },
          numeros: function (on) { marcadores.forEach(function (o) { o.visible = on; }); marcar(); },
          destacar: destacar, vista: vista,
          ativo: function (on) { ativo = on; if (on) { redimensionar(); marcar(); } },
          destruir: function () {
            if (raf) cancelAnimationFrame(raf);
            ro.disconnect(); if (io) io.disconnect(); offTema();
            tubos.forEach(function (o) { o.geometry.dispose(); });
            geos.forEach(function (g) { g.dispose(); }); mats.forEach(function (m) { m.dispose(); }); texs.forEach(function (t) { t.dispose(); });
            vigia.parar();
            controls.dispose(); renderer.dispose(); VL.gl3d.soltar(renderer);
            if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
            void leituraAtual; void largura; void dica;
          },
        };
      }

      /* figura 2D de reserva (sem WebGL) */
      function figura2D(r, sel) {
        var svg = h('svg', { viewBox: '-1.3 -0.3 2.6 1.55', class: 'svg-interativo sx-svg2d', role: 'img', 'aria-label': 'Sextante visto de frente, com a alidade em ' + r + '°.' });
        function P(rr, a) { return (rr * Math.cos(a * RAD)).toFixed(3) + ' ' + (-rr * Math.sin(a * RAD)).toFixed(3); }
        svg.appendChild(h('path', { d: 'M' + P(1.05, -53) + ' A1.05 1.05 0 0 1 ' + P(1.05, -127) + ' L' + P(0.12, -127) + ' A0.12 0.12 0 1 1 ' + P(0.12, -53) + ' Z', class: 'sx-2d-arm' + (sel === 'armacao' ? ' sx-2d-sel' : '') }));
        svg.appendChild(h('path', { d: 'M' + P(1.0, -56) + ' A1 1 0 0 1 ' + P(1.0, -124), class: 'sx-2d-limbo' + (sel === 'limbo' ? ' sx-2d-sel' : '') }));
        for (var g = 0; g <= 120; g += 10) { var a = anguloAlidade(g); svg.appendChild(h('line', { x1: (0.94 * Math.cos(a * RAD)).toFixed(3), y1: (-0.94 * Math.sin(a * RAD)).toFixed(3), x2: (1.0 * Math.cos(a * RAD)).toFixed(3), y2: (-1.0 * Math.sin(a * RAD)).toFixed(3), class: 'sx-2d-tick' })); }
        var aa = anguloAlidade(r);
        svg.appendChild(h('line', { x1: 0, y1: 0, x2: (1.12 * Math.cos(aa * RAD)).toFixed(3), y2: (-1.12 * Math.sin(aa * RAD)).toFixed(3), class: 'sx-2d-ali' + (sel === 'alidade' ? ' sx-2d-sel' : '') }));
        var ang = (ALFA0 - r / 2 + 90) * RAD;
        svg.appendChild(h('line', { x1: (-0.1 * Math.cos(ang)).toFixed(3), y1: (0.1 * Math.sin(ang)).toFixed(3), x2: (0.1 * Math.cos(ang)).toFixed(3), y2: (-0.1 * Math.sin(ang)).toFixed(3), class: 'sx-2d-esp' + (sel === 'espgrande' ? ' sx-2d-sel' : '') }));
        var a2 = (n360(GAMA + 180) / 2 + 90) * RAD;
        svg.appendChild(h('line', { x1: (HM[0] - 0.065 * Math.cos(a2)).toFixed(3), y1: (-HM[1] + 0.065 * Math.sin(a2)).toFixed(3), x2: (HM[0] + 0.065 * Math.cos(a2)).toFixed(3), y2: (-HM[1] - 0.065 * Math.sin(a2)).toFixed(3), class: 'sx-2d-esp' + (sel === 'esppequeno' ? ' sx-2d-sel' : '') }));
        svg.appendChild(h('rect', { x: -0.09, y: -HM[1] - 0.035, width: 0.62, height: 0.07, class: 'sx-2d-lun' + (sel === 'luneta' ? ' sx-2d-sel' : '') }));
        svg.appendChild(h('polyline', { points: (-Math.cos(r * RAD) * 1.2).toFixed(3) + ',' + (-Math.sin(r * RAD) * 1.2).toFixed(3) + ' 0,0 ' + HM[0] + ',' + (-HM[1]) + ' 0.6,' + (-HM[1]), class: 'sx-2d-luz' }));
        [['Espelho grande', 0.08, -0.12], ['Espelho pequeno', HM[0] - 0.05, -HM[1] - 0.08], ['Luneta', 0.2, -HM[1] - 0.06], ['Limbo', -0.15, 1.12]].forEach(function (t) { var n = h('text', { x: t[1], y: t[2], class: 'sx-2d-t' }); n.textContent = t[0]; svg.appendChild(n); });
        return svg;
      }

      /* ================================================================== 2. OCULAR (canvas 2D) */
      function Ocular(o) {
        o = o || {};
        var cv = h('canvas', { class: 'sx-ocular', tabindex: '0', role: 'slider', 'aria-label': 'Visão pela luneta. Arraste para cima ou para baixo para mover a imagem do Sol (tambor); para os lados para balançar o sextante. Teclas: setas para cima e para baixo (0,1′; com Shift, 1′), Page Up e Page Down (1°), setas para os lados (inclinar).' });
        var est = { leitura: 30, theta: 0, alvo: 'sol', espelho: opts.espelho === 'meio' ? 'meio' : 'inteiro', fov: 180, rastro: [], dicas: true };
        var cen = { HoC: 30, sd: 16, ph: 0.15, hm: 2.5, ei: 0, psi: 0 };
        var raf = 0, anim = null, ultimo = 0;
        function dipM() { return dip(cen.hm); }
        function HapC() { return aparenteLimbo(cen.HoC, cen.sd, cen.ph) + cen.sd / 60; }
        function ideal() { return cen.alvo === 'horizonte' ? -cen.ei / 60 : aparenteLimbo(cen.HoC, cen.sd, cen.ph) + dipM() / 60 - cen.ei / 60; }
        function base() {
          var e0 = -dipM() / 60 * RAD, F = [0, Math.sin(e0), Math.cos(e0)], V0 = [0, Math.cos(e0), -Math.sin(e0)];
          return { F: F, V0: V0, Rt: cross(V0, F) };
        }
        function refletir(v, theta) {
          var b = base(), th = theta * RAD;
          var Vt = [b.V0[0] * Math.cos(th) + b.Rt[0] * Math.sin(th), b.V0[1] * Math.cos(th) + b.Rt[1] * Math.sin(th), b.V0[2] * Math.cos(th) + b.Rt[2] * Math.sin(th)];
          var n = cross(b.F, Vt), A = (est.leitura + cen.ei / 60) * RAD;
          var s = rot(v, n, -A);
          return { x: Math.atan2(dot(s, b.Rt), dot(s, b.F)) / RAD * 60, y: Math.atan2(dot(s, b.V0), dot(s, b.F)) / RAD * 60 };
        }
        function dirAlt(alt, az) { return [Math.sin(az * RAD) * Math.cos(alt * RAD), Math.sin(alt * RAD), Math.cos(az * RAD) * Math.cos(alt * RAD)]; }
        function imagemSol(theta) { return refletir(dirAlt(HapC(), cen.psi / 60), theta == null ? est.theta : theta); }
        function horizonteRefl(theta) { var d = -dipM() / 60, t = theta == null ? est.theta : theta; return [refletir(dirAlt(d, -2), t), refletir(dirAlt(d, 2), t)]; }
        /** Afastamento do limbo inferior (ou do horizonte refletido) ao horizonte, em ′, positivo acima. */
        function afastamento(theta) {
          if (cen.alvo === 'horizonte') { var hr = horizonteRefl(theta); return (hr[0].y + hr[1].y) / 2; }
          return imagemSol(theta).y - cen.sd;
        }
        function desenhar() {
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          var S = Math.max(220, Math.min(460, cv.clientWidth || 320));
          if (cv.width !== Math.round(S * dpr)) { cv.width = Math.round(S * dpr); cv.height = Math.round(S * dpr); }
          var c = cv.getContext('2d');
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
          var escuro = VL.settings.temaEscuro();
          var cx = S / 2, cy = S / 2, R = S / 2 - 3, k = (2 * R) / est.fov;
          function X(x) { return cx + x * k; } function Y(y) { return cy - y * k; }
          c.clearRect(0, 0, S, S);
          c.fillStyle = VL.cssVar(escuro ? '--paper' : '--ink'); c.fillRect(0, 0, S, S);
          c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
          var ceu1 = VL.cssVar('--sea-1'), ceu2 = VL.cssVar('--sea-2'), mar = VL.cssVar('--sea-3'), onda = VL.cssVar('--sea-2'), tinta = VL.cssVar('--ink-2');
          function ceu() { var gr = c.createLinearGradient(0, 0, 0, cy); gr.addColorStop(0, ceu1); gr.addColorStop(1, ceu2); c.fillStyle = gr; c.fillRect(0, 0, S, S); }
          function marAbaixo(x1, y1, x2, y2) {
            var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, big = S * 4;
            var nx = uy, ny = -ux; if (ny < 0) { nx = -nx; ny = -ny; }
            c.fillStyle = mar; c.beginPath();
            c.moveTo(x1 - ux * big, y1 - uy * big); c.lineTo(x2 + ux * big, y2 + uy * big);
            c.lineTo(x2 + ux * big + nx * big, y2 + uy * big + ny * big); c.lineTo(x1 - ux * big + nx * big, y1 - uy * big + ny * big); c.closePath(); c.fill();
            c.strokeStyle = onda; c.lineWidth = 1;
            for (var i = 1; i < 7; i++) { var off = i * i * 3 + 4; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(x1 - ux * big + nx * off, y1 - uy * big + ny * off); c.lineTo(x2 + ux * big + nx * off, y2 + uy * big + ny * off); c.stroke(); }
            c.globalAlpha = 1;
            c.strokeStyle = tinta; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x1 - ux * big, y1 - uy * big); c.lineTo(x2 + ux * big, y2 + uy * big); c.stroke();
          }
          /* cena direta */
          ceu(); marAbaixo(0, cy, S, cy);
          /* cena refletida */
          c.save();
          var th = est.theta * RAD;
          if (est.espelho === 'meio') {
            /* metade espelhada: lado direito da linha de divisão, o mais perto da armação (a linha gira com o sextante) */
            var dx = Math.sin(th), dy = -Math.cos(th), nx = Math.cos(th), ny = Math.sin(th), big2 = S * 3;
            c.beginPath(); c.moveTo(cx + dx * big2, cy + dy * big2); c.lineTo(cx - dx * big2, cy - dy * big2);
            c.lineTo(cx - dx * big2 + nx * big2, cy - dy * big2 + ny * big2); c.lineTo(cx + dx * big2 + nx * big2, cy + dy * big2 + ny * big2); c.closePath();
            c.clip();
            ceu();
          } else c.globalAlpha = 0.55;
          var hr = horizonteRefl();
          if (Math.abs(hr[0].y) < est.fov * 1.5) marAbaixo(X(hr[0].x), Y(hr[0].y), X(hr[1].x), Y(hr[1].y));
          if (cen.alvo === 'sol') {
            /* filtros escurecem a imagem refletida */
            c.fillStyle = VL.cssVar(escuro ? '--paper' : '--ink'); c.globalAlpha = est.espelho === 'meio' ? 0.42 : 0.1; c.fillRect(0, 0, S, S); c.globalAlpha = est.espelho === 'meio' ? 1 : 0.95;
            est.rastro.forEach(function (p, i) { c.globalAlpha = 0.15 + 0.5 * i / est.rastro.length; c.fillStyle = VL.cssVar('--nav-yellow'); c.beginPath(); c.arc(X(p.x), Y(p.y), 1.6, 0, Math.PI * 2); c.fill(); });
            c.globalAlpha = 1;
            var im = imagemSol();
            c.fillStyle = VL.cssVar('--nav-yellow'); c.strokeStyle = VL.cssVar('--aviso');
            c.beginPath(); c.arc(X(im.x), Y(im.y), cen.sd * k, 0, Math.PI * 2); c.fill(); c.lineWidth = 1; c.stroke();
          }
          c.restore();
          if (est.espelho === 'meio') {
            c.strokeStyle = VL.cssVar('--ink-3'); c.lineWidth = 1.5;
            c.beginPath(); c.moveTo(cx - Math.sin(th) * R, cy + Math.cos(th) * R); c.lineTo(cx + Math.sin(th) * R, cy - Math.cos(th) * R); c.stroke();
          }
          c.restore();
          c.strokeStyle = VL.cssVar('--line'); c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
          cv.setAttribute('aria-valuenow', String(Math.round(est.leitura * 600) / 600));
          cv.setAttribute('aria-valuetext', 'Leitura ' + fLeitura(est.leitura) + ', sextante inclinado ' + num(est.theta, 1) + '°');
        }
        function mudou() { desenhar(); if (o.aoMudar) o.aoMudar(api); }
        function ajustar(dMin) { est.leitura = clamp(est.leitura + dMin / 60, -5, 125); mudou(); }
        /* ponteiro: vertical = tambor; horizontal = inclinar */
        var drag = null;
        cv.addEventListener('pointerdown', function (ev) { drag = { x: ev.clientX, y: ev.clientY, l: est.leitura, t: est.theta }; try { cv.setPointerCapture(ev.pointerId); } catch (e) { /* ok */ } cv.focus({ preventScroll: true }); });
        cv.addEventListener('pointermove', function (ev) {
          if (!drag) return;
          var S = cv.clientWidth || 320, k = (S - 6) / est.fov;
          est.leitura = clamp(drag.l + (ev.clientY - drag.y) / k / 60, -5, 125);
          if (!anim) { est.theta = clamp(drag.t + (ev.clientX - drag.x) * 0.03, -8, 8); registrarRastro(); }
          mudou();
        });
        function soltar() { drag = null; }
        cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
        cv.addEventListener('keydown', function (ev) {
          var k = ev.key, d = ev.shiftKey ? 1 : 0.1;
          if (k === 'ArrowUp') { ajustar(-d); ev.preventDefault(); }
          else if (k === 'ArrowDown') { ajustar(d); ev.preventDefault(); }
          else if (k === 'PageUp') { ajustar(-60); ev.preventDefault(); }
          else if (k === 'PageDown') { ajustar(60); ev.preventDefault(); }
          else if (k === 'ArrowLeft') { est.theta = clamp(est.theta - 0.5, -8, 8); registrarRastro(); mudou(); ev.preventDefault(); }
          else if (k === 'ArrowRight') { est.theta = clamp(est.theta + 0.5, -8, 8); registrarRastro(); mudou(); ev.preventDefault(); }
          else if (k === 'Home') { est.theta = 0; mudou(); ev.preventDefault(); }
        });
        function registrarRastro() { if (cen.alvo !== 'sol') return; est.rastro.push(imagemSol()); if (est.rastro.length > 70) est.rastro.shift(); }
        function amplitude() { var s = Math.max(0.2, Math.sin(Math.max(5, est.leitura) * RAD)); return clamp((est.fov * 0.36 / 60) / s, 0.8, 4); }
        function balancar(on) {
          if (on === false || anim) { if (anim) { cancelAnimationFrame(raf); raf = 0; anim = null; est.theta = 0; mudou(); } return false; }
          if (reduzMov) {
            /* sem animação: cada toque inclina um passo, mostrando o arco */
            var seq = [-1, -0.5, 0, 0.5, 1, 0], i = (api._passo = ((api._passo || 0) + 1) % seq.length);
            est.theta = seq[i] * amplitude(); registrarRastro(); mudou(); return false;
          }
          anim = { t0: 0 }; est.rastro = []; ultimo = 0;
          var f = function (t) {
            if (!anim) return;
            if (!anim.t0) anim.t0 = t;
            var s = (t - anim.t0) / 1000;
            est.theta = amplitude() * Math.sin(2 * Math.PI * s / 1.8);
            registrarRastro(); mudou();
            raf = requestAnimationFrame(f);
          };
          raf = requestAnimationFrame(f);
          void ultimo;
          return true;
        }
        var ro = new ResizeObserver(function () { desenhar(); }); ro.observe(cv);
        var offTema = VL.on('tema', function () { setTimeout(desenhar, 30); });
        var api = {
          el: cv, est: est, cen: cen,
          cenario: function (c) { Object.assign(cen, c); est.rastro = []; mudou(); },
          setLeitura: function (v) { est.leitura = v; est.rastro = []; mudou(); },
          setTheta: function (v) { est.theta = v; registrarRastro(); mudou(); },
          set: function (k, v) { est[k] = v; est.rastro = []; mudou(); },
          ajustar: ajustar, balancar: balancar, afastamento: afastamento, ideal: ideal, desenhar: desenhar,
          balancando: function () { return !!anim; },
          visivelSol: function () { var im = imagemSol(); return Math.abs(im.y) < est.fov / 2 + cen.sd && Math.abs(im.x) < est.fov / 2 + cen.sd; },
          imagemSol: imagemSol,
          destruir: function () { if (raf) cancelAnimationFrame(raf); anim = null; ro.disconnect(); offTema(); },
        };
        cen.alvo = 'sol';
        return api;
      }

      /* tira do tambor (SVG) */
      function Tambor() {
        var svg = h('svg', { viewBox: '0 0 300 54', class: 'sx-tambor', role: 'img', 'aria-label': 'Escala do tambor' });
        return {
          el: svg,
          desenhar: function (leitura) {
            svg.innerHTML = '';
            var p = leituraPartes(leitura), m = p.m;
            svg.appendChild(h('rect', { x: 0, y: 0, width: 300, height: 54, rx: 6, class: 'sx-tam-fundo' }));
            for (var d = -14; d <= 14; d++) {
              var v = Math.floor(m) + d, x = 150 + (v - m) * 10;
              if (x < 4 || x > 296) continue;
              var mm = ((v % 60) + 60) % 60, L = mm % 10 === 0 ? 18 : mm % 5 === 0 ? 13 : 8;
              svg.appendChild(h('line', { x1: x.toFixed(1), y1: 6, x2: x.toFixed(1), y2: 6 + L, class: 'sx-tam-tick' }));
              if (mm % 5 === 0) { var t = h('text', { x: x.toFixed(1), y: 40, 'text-anchor': 'middle', class: 'sx-tam-num' }); t.textContent = String(mm); svg.appendChild(t); }
            }
            svg.appendChild(h('line', { x1: 150, y1: 2, x2: 150, y2: 30, class: 'sx-tam-ind' }));
            svg.setAttribute('aria-label', 'Tambor em ' + num(m, 1) + ' minutos');
          },
        };
      }

      /* ================================================================== 3. OBSERVAR O SOL */
      function painelObservar(box) {
        box.appendChild(h('p', { class: 'sx-intro' }, 'Pela luneta você vê o horizonte direto e, pelo espelho pequeno, a imagem refletida do Sol. Mova a alidade e o tambor até o limbo inferior (a borda de baixo) do Sol apenas tocar o horizonte. Depois balance o sextante: o Sol desenha um arco, e a medida vale no ponto mais baixo do arco, com o instrumento na vertical.'));
        var grade = h('div', { class: 'sx-grade sx-grade-ob' });
        box.appendChild(grade);
        var colA = h('div', { class: 'sx-col-ocular' }), colB = h('div', { class: 'sx-lado' });
        grade.appendChild(colA); grade.appendChild(colB);
        var hoje = VL.hoje(), sd0 = solDia(hoje);
        var ctl = {};
        var oc = Ocular({ aoMudar: function () { atualizar(); } });
        colA.appendChild(oc.el);
        var legOc = h('p', { class: 'sx-dica sx-leg-oc' });
        colA.appendChild(legOc);
        var tam = Tambor();
        var leituraBig = h('p', { class: 'sx-leitura', 'aria-live': 'polite' });
        var partes = h('p', { class: 'sx-dica' });
        var estado = h('p', { class: 'sx-estado', 'aria-live': 'polite' });
        function bt(t, aria, fn) { return h('button', { type: 'button', class: 'btn btn-ghost sx-bt', 'aria-label': aria, onclick: fn }, t); }
        var btBal = h('button', { type: 'button', class: 'btn btn-ghost', 'aria-pressed': 'false' }, reduzMov ? 'Inclinar (passo a passo)' : 'Balançar o sextante');
        btBal.addEventListener('click', function () { var on = oc.balancar(); btBal.setAttribute('aria-pressed', String(!!on)); if (!reduzMov) btBal.textContent = on ? 'Parar e pôr na vertical' : 'Balançar o sextante'; });
        var incl = h('input', { type: 'range', min: '-6', max: '6', step: '0.1', value: '0', 'aria-label': 'Inclinação do sextante' });
        incl.addEventListener('input', function () { oc.setTheta(+incl.value); });
        var btReg = h('button', { type: 'button', class: 'btn btn-primary' }, 'Registrar leitura');
        var resultado = h('div', { 'aria-live': 'polite' });
        colB.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Leitura'), leituraBig, tam.el, partes,
          h('div', { class: 'sx-bts' },
            h('span', { class: 'sx-bts-g' }, h('span', { class: 'sx-bts-r' }, 'Alidade'), bt('−1°', 'Alidade menos 1 grau', function () { oc.ajustar(-60); }), bt('+1°', 'Alidade mais 1 grau', function () { oc.ajustar(60); })),
            h('span', { class: 'sx-bts-g' }, h('span', { class: 'sx-bts-r' }, 'Tambor'), bt('−1′', 'Tambor menos 1 minuto', function () { oc.ajustar(-1); }), bt('+1′', 'Tambor mais 1 minuto', function () { oc.ajustar(1); }),
              bt('−0,1′', 'Tambor menos um décimo de minuto', function () { oc.ajustar(-0.1); }), bt('+0,1′', 'Tambor mais um décimo de minuto', function () { oc.ajustar(0.1); }))),
          estado));
        colB.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Balançar'),
          h('p', { class: 'sx-dica' }, 'Gire o sextante um pouco em torno da linha de visada (ou arraste para os lados na luneta). O ponto mais baixo do arco é o sextante na vertical.'),
          btBal, h('label', { class: 'sx-linha-v' }, h('span', null, 'Inclinação'), ctl.inclOut = h('output', { class: 'sx-valor' })), incl,
          h('div', { class: 'btn-row' }, btReg), resultado));
        /* ajustes */
        var alvo = seg('Alvo', [['sol', 'Sol'], ['horizonte', 'Horizonte (erro instrumental)']], 'sol', function (v) { oc.cen.alvo = v; novaPosicao(); });
        var esp = seg('Espelho pequeno', [['inteiro', 'Horizonte inteiro'], ['meio', 'Meio espelhado']], oc.est.espelho, function (v) { oc.set('espelho', v); });
        var aum = seg('Campo da luneta', [['180', 'Campo de 3°'], ['90', 'Campo de 1,5°']], '180', function (v) { oc.set('fov', +v); });
        var hIn = h('input', { type: 'range', min: '1', max: '12', step: '0.1', value: '2.5', 'aria-label': 'Elevação do olho em metros' });
        var eiIn = h('input', { type: 'range', min: '-3', max: '3', step: '0.1', value: '1.2', 'aria-label': 'Erro instrumental em minutos' });
        var hOut = h('output', { class: 'sx-valor' }), eiOut = h('output', { class: 'sx-valor' });
        hIn.addEventListener('input', function () { oc.cenario({ hm: +hIn.value }); });
        eiIn.addEventListener('input', function () { oc.cenario({ ei: +eiIn.value }); });
        var btNovo = h('button', { type: 'button', class: 'btn btn-ghost' }, 'Novo Sol');
        btNovo.addEventListener('click', function () { oc.cenario({ HoC: 15 + Math.random() * 55, psi: (Math.random() * 2 - 1) * 8 }); novaPosicao(); });
        colB.appendChild(h('details', { class: 'sx-bloco sx-det' }, h('summary', null, 'Ajustes da observação'),
          h('div', { class: 'sx-campo' }, h('span', { class: 'sx-leg' }, 'O que observar'), alvo.el),
          h('div', { class: 'sx-campo' }, h('span', { class: 'sx-leg' }, 'Espelho pequeno'), esp.el),
          h('div', { class: 'sx-campo' }, h('span', { class: 'sx-leg' }, 'Luneta'), aum.el),
          h('label', { class: 'sx-linha-v' }, h('span', null, 'Elevação do olho'), hOut), hIn,
          h('label', { class: 'sx-linha-v' }, h('span', null, 'Erro instrumental do sextante (ei)'), eiOut), eiIn,
          h('div', { class: 'btn-row' }, btNovo)));
        box.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Como observar o Sol'),
          h('ol', { class: 'sx-ol' },
            h('li', null, 'Rebata os filtros do espelho grande antes de apontar para o Sol.'),
            h('li', null, 'Aproximação: com a alidade no zero, aponte para o Sol e vá descendo a alidade (apertando a alavanca) e o sextante até o horizonte aparecer. Ou ajuste a alidade para a altura prevista e aponte para o horizonte abaixo do Sol.'),
            h('li', null, 'Ajuste fino no tambor até o limbo inferior tocar o horizonte.'),
            h('li', null, 'Balance o sextante: no ponto mais baixo do arco o Sol deve só tocar o horizonte. Se ele cortar o horizonte, diminua a leitura; se ficar acima, aumente.'),
            h('li', null, 'No instante do toque, anote a hora do cronômetro (segundos importam) e depois a leitura.')),
          VL.ui.callout('seguranca', 'Olhos', 'Sem filtros, a luz do Sol pela luneta pode cegar. Confira os filtros antes de cada visada.')));
        function novaPosicao() {
          var id = oc.ideal();
          oc.setLeitura(oc.cen.alvo === 'horizonte' ? Math.round((Math.random() * 6 - 3) * 10) / 600 : Math.floor(id) - (Math.random() < 0.5 ? 0 : 0.5) + 0.25 * Math.random());
          incl.value = '0'; oc.setTheta(0); resultado.innerHTML = '';
        }
        function atualizar() {
          var L = oc.est.leitura, p = leituraPartes(L);
          leituraBig.textContent = 'Hi = ' + fLeitura(L);
          partes.textContent = 'Alidade em ' + p.g + '° no limbo · tambor em ' + num(p.m, 1) + '′' + (p.t < 0 ? ' (leitura negativa: índice antes do zero, "fora do arco")' : '');
          tam.desenhar(L);
          ctl.inclOut.textContent = num(oc.est.theta, 1) + '°';
          if (+incl.value !== Math.round(oc.est.theta * 10) / 10 && !oc.balancando()) incl.value = String(oc.est.theta);
          hOut.textContent = num(oc.cen.hm, 1) + ' m (depressão ' + num(dip(oc.cen.hm), 1) + '′)';
          eiOut.textContent = fMinS(oc.cen.ei);
          var af = oc.afastamento(), af0 = oc.afastamento(0);
          var nome = oc.cen.alvo === 'horizonte' ? 'O horizonte refletido' : 'O limbo inferior';
          if (oc.cen.alvo === 'sol' && !oc.visivelSol()) estado.textContent = 'O Sol está fora do campo, ' + (oc.imagemSol().y > 0 ? 'acima: aumente a leitura.' : 'abaixo: diminua a leitura.');
          else if (Math.abs(af0) < 0.25) estado.textContent = nome + ' toca o horizonte com o sextante na vertical.' + (Math.abs(oc.est.theta) > 0.3 ? ' Agora a inclinação o levantou ' + num(af - af0, 1) + '′.' : '');
          else estado.textContent = nome + ' está ' + num(Math.abs(af0), 1) + '′ ' + (af0 > 0 ? 'acima' : 'abaixo') + ' do horizonte (com o sextante na vertical).';
          legOc.textContent = oc.est.espelho === 'meio' ? 'Metade direita (a do lado da armação): espelho, com a imagem refletida escurecida pelos filtros. Metade esquerda: vidro transparente, com o horizonte direto.' : 'Espelho de horizonte inteiro: a imagem refletida aparece sobreposta à vista direta.';
        }
        btReg.addEventListener('click', function () {
          var L = oc.est.leitura, th = oc.est.theta, idl = oc.ideal(), err = (L - idl) * 60;
          resultado.innerHTML = '';
          if (oc.cen.alvo === 'horizonte') {
            var ei = -L * 60;
            resultado.appendChild(fb(Math.abs(err) <= 0.5, 'Leitura: ' + fLeitura(L),
              h('div', null, h('p', null, 'Com os horizontes alinhados, os espelhos estão paralelos. A leitura ' + (L < 0 ? 'ficou fora do arco: o erro instrumental é positivo' : L > 0 ? 'ficou no arco: o erro instrumental é negativo' : 'é zero: não há erro') + '. ei = ' + fMinS(ei) + '.'),
                h('p', { class: 'small muted' }, 'Erro de ajuste em relação ao alinhamento exato: ' + num(Math.abs(err), 1) + '′. O ei verdadeiro desta simulação é ' + fMinS(oc.cen.ei) + '.'))));
            return;
          }
          var ok = Math.abs(err) <= 1 && Math.abs(th) <= 1;
          var corpo = h('div', null,
            h('p', null, 'Leitura ideal (limbo tangente, sextante na vertical): ' + fLeitura(idl) + '. Sua leitura difere ' + fMinS(err) + '.'),
            Math.abs(th) > 1 ? h('p', null, 'O sextante estava inclinado ' + num(Math.abs(th), 1) + '°. Inclinado, a imagem sobe, e quem ajusta assim acaba com uma leitura maior do que a altura real: balance e registre no ponto mais baixo.') : null,
            h('p', { class: 'small muted' }, 'Erro instrumental desta simulação: ' + fMinS(oc.cen.ei) + ' · elevação do olho: ' + num(oc.cen.hm, 1) + ' m · SD do dia: ' + num(oc.cen.sd, 1) + '′.'),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { irPara('correcoes', { hi: Math.round(L * 600) / 600, ei: oc.cen.ei, hm: oc.cen.hm, sd: oc.cen.sd, limbo: 'inf', hoVerd: oc.cen.HoC }); } }, 'Corrigir esta altura')));
          resultado.appendChild(fb(ok, ok ? 'Boa visada: Hi = ' + fLeitura(L) : 'Hi = ' + fLeitura(L), corpo));
        });
        oc.cenario({ HoC: 38.6, sd: sd0.sd, ph: sd0.ph, hm: 2.5, ei: 1.2, psi: 4, alvo: 'sol' });
        novaPosicao();
        return { ativo: function (on) { if (!on && oc.balancando()) { oc.balancar(false); btBal.setAttribute('aria-pressed', 'false'); if (!reduzMov) btBal.textContent = 'Balançar o sextante'; } else oc.desenhar(); }, destruir: oc.destruir };
      }

      /* ================================================================== 4. CORREÇÕES */
      function painelCorrecoes(box) {
        box.appendChild(h('p', { class: 'sx-intro' }, 'A leitura do sextante (altura instrumental) ainda não é a altura verdadeira do astro. Ela é corrigida, nesta ordem, do erro do instrumento, da altura do olho acima do mar, da refração da atmosfera, do semidiâmetro (quando se mede uma borda) e da paralaxe.'));
        var grade = h('div', { class: 'sx-grade' }); box.appendChild(grade);
        var col1 = h('div', { class: 'sx-lado' }), col2 = h('div', { class: 'sx-lado' });
        grade.appendChild(col1); grade.appendChild(col2);
        var fHi = campoAng({ rotulo: 'Altura instrumental, Hi (ai)' + en('Hs') });
        var fEi = campoNum({ rotulo: 'Erro instrumental, ei' + en('IC'), un: '′', sinal: true, min: -20, max: 20, msg: 'Ex.: +1,2 ou −0,8' });
        var fHm = campoNum({ rotulo: 'Elevação do olho', un: 'm', min: 0, max: 60, msg: 'De 0 a 60 m' });
        var fDt = h('input', { type: 'date', class: 'sx-in sx-in-data', value: VL.hoje(), 'aria-label': 'Data da observação' });
        var fSd = campoNum({ rotulo: 'Semidiâmetro do Sol, SD', un: '′', min: 15, max: 17, msg: 'Entre 15,7′ e 16,3′' });
        var limbo = seg('Limbo', [['inf', 'Limbo inferior'], ['sup', 'Limbo superior']], 'inf', function () { calc(); });
        var swTP = h('input', { type: 'checkbox', role: 'switch' });
        var fT = campoNum({ rotulo: 'Temperatura do ar', un: '°C', min: -30, max: 50, casas: 0 });
        var fP = campoNum({ rotulo: 'Pressão', un: 'hPa', min: 900, max: 1060, casas: 0 });
        var boxTP = h('div', { class: 'sx-linha', hidden: true }, fT.el, fP.el);
        col1.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Dados da visada'),
          h('div', { class: 'sx-linha' }, fHi.el, fEi.el), h('div', { class: 'sx-linha' }, fHm.el, h('label', { class: 'sx-campo' }, h('span', { class: 'sx-leg' }, 'Data'), fDt), fSd.el), limbo.el,
          h('label', { class: 'switch sx-switch' }, swTP, h('span', null, 'Temperatura e pressão fora do padrão')), boxTP));
        var passos = h('ol', { class: 'sx-passos', 'aria-live': 'polite' });
        col1.appendChild(h('section', { class: 'sx-bloco' }, h('h4', null, 'Passo a passo'), passos));
        var res = h('div', { class: 'sx-res-box', 'aria-live': 'polite' });
        var graf = h('div', { class: 'sx-graf' });
        col2.appendChild(h('section', { class: 'sx-bloco sx-bloco-claro' }, h('h4', null, 'Resultado'), res));
        col2.appendChild(h('section', { class: 'sx-bloco sx-bloco-claro' }, h('h4', null, 'Refração em função da altura'), graf,
          h('p', { class: 'sx-dica' }, 'Perto do horizonte a refração cresce muito e varia com a temperatura e a pressão. Por isso se evitam alturas abaixo de uns 10° a 15°.')));
        col2.appendChild(VL.ui.callout('dica', 'No almanaque', 'Os almanaques náuticos trazem tábuas prontas: uma para a depressão do horizonte e outra, para o Sol, que já soma refração, semidiâmetro e paralaxe (no Nautical Almanac, a tábua A2). As tábuas do Almanaque Náutico da DHN podem diferir alguns décimos de minuto destas fórmulas.'));
        col2.appendChild(VL.ui.callout('intl', 'Nomes em inglês', 'Nos livros em inglês: Hs (sextant altitude) é a nossa altura instrumental (ai); IC (index correction) é o ei; Ha (apparent altitude) é a nossa altura aparente (aa); Ho (observed altitude) é a altura já toda corrigida, a nossa altura verdadeira (av). Cuidado: a nossa "altura observada" (ao = ai + ei) não é o Ho.'));
        fHi.set(38 + 21.4 / 60); fEi.set(1.2); fHm.set(2.5); fSd.set(Math.round(solDia(VL.hoje()).sd * 10) / 10); fT.set(10); fP.set(1010);
        var verd = null;
        fDt.addEventListener('change', function () { if (/^\d{4}-\d{2}-\d{2}$/.test(fDt.value)) { fSd.set(Math.round(solDia(fDt.value).sd * 10) / 10); calc(); } });
        swTP.addEventListener('change', function () { boxTP.hidden = !swTP.checked; calc(); });
        [fHi, fEi, fHm, fSd, fT, fP].forEach(function (f) { f.on(function () { verd = null; calc(); }); });
        function calc() {
          passos.innerHTML = ''; res.innerHTML = ''; graf.innerHTML = '';
          var hi = fHi.get(), ei = fEi.get(), hm = fHm.get(), sd = fSd.get(), ftp = 1;
          if (swTP.checked) { var t = fT.get(), p = fP.get(); if (isFinite(t) && isFinite(p)) ftp = fatorTP(t, p); }
          if (![hi, ei, hm, sd].every(isFinite)) { passos.appendChild(h('li', { class: 'sx-msg' }, 'Preencha os campos destacados.')); return; }
          var c = corrigir(hi, ei, hm, sd, 0.15, limbo.valor, ftp);
          passos.appendChild(passo(1, 'Erro instrumental' + en('index correction'), ['ao = Hi + ei = ' + gm(hi) + ' ' + fMinS(ei)], 'Altura observada, ao = ' + gm(c.ao),
            'Medido antes da visada, alinhando o horizonte refletido com o direto. Leitura fora do arco: ei positivo; no arco: negativo.'));
          passos.appendChild(passo(2, 'Depressão do horizonte' + en('dip'), ['dp = 1,76′ × √' + num(hm, 1) + ' = ' + num(c.dp, 1) + '′', 'aa = ao − dp'], 'Altura aparente, aa = ' + gm(c.aa),
            'Com o olho acima do mar, o horizonte visível fica abaixo do plano horizontal. Quanto mais alto o olho, maior a depressão. Sempre se subtrai.'));
          passos.appendChild(passo(3, 'Refração' + en('refraction'), ['R = cot(aa + 7,31 / (aa + 4,4)) = ' + num(c.R, 1) + '′' + (ftp !== 1 ? ' (× ' + num(ftp, 3) + ' pela temperatura e pressão)' : '')], '− ' + num(c.R, 1) + '′',
            'A atmosfera curva a luz e o astro parece mais alto do que está: sempre se subtrai. Fórmula de Bennett (1982), como no Nautical Almanac, para 10 °C e 1010 hPa.'));
          passos.appendChild(passo(4, 'Semidiâmetro' + en('semidiameter'), [limbo.valor === 'sup' ? 'Mediu a borda de cima: subtrai o raio aparente do Sol.' : 'Mediu a borda de baixo: soma o raio aparente do Sol para chegar ao centro.'], (c.SD >= 0 ? '+ ' : '− ') + num(Math.abs(c.SD), 1) + '′',
            'O SD do Sol vem no almanaque: cerca de 16,3′ em janeiro (Terra mais perto do Sol) e 15,8′ em julho.'));
          passos.appendChild(passo(5, 'Paralaxe' + en('parallax'), ['P = PH × cos aa = 0,15′ × cos ' + gm(c.aa) + ' = ' + num(c.P, 2) + '′'], '+ ' + num(c.P, 1) + '′',
            'Medimos da superfície, não do centro da Terra. Para o Sol, que está muito longe, é no máximo 0,15′; para a Lua chega a 1°.'));
          var total = -c.R + c.SD + c.P;
          res.appendChild(h('p', { class: 'sx-big' }, 'Ho = ' + gm(c.av)));
          res.appendChild(h('p', { class: 'sx-dica' }, 'Altura verdadeira (av)' + en('Ho') + '. Correção total depois da depressão: ' + fMinS(total) + '.'));
          var tab = h('table', { class: 'tabela sx-tab' }, h('tbody', null,
            [['Hi (leitura)', gm(hi)], ['ei', fMinS(ei)], ['dp', fMinS(-c.dp)], ['R', fMinS(-c.R)], ['SD', fMinS(c.SD)], ['P', fMinS(c.P)], ['Ho', gm(c.av)]].map(function (r) { return h('tr', null, h('th', null, r[0]), h('td', null, r[1])); })));
          res.appendChild(h('div', { class: 'table-wrap' }, tab));
          if (verd != null) res.appendChild(h('p', { class: 'sx-dica' }, 'A altura verdadeira usada na simulação era ' + gm(verd) + ': a diferença (' + fMinS((c.av - verd) * 60) + ') é o erro da sua visada.'));
          graf.appendChild(grafRefracao(c.aa, c.R));
        }
        function grafRefracao(aa, R) {
          var W = 320, H = 150, m = { l: 34, r: 10, t: 10, b: 26 };
          var svg = h('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'svg-interativo sx-grafico', role: 'img', 'aria-label': 'Gráfico da refração: cerca de 10′ a 5°, 5′ a 10°, 1′ a 45°. Sua altura: ' + gm(aa) + ', refração ' + num(R, 1) + '′.' });
          function X(a) { return m.l + a / 90 * (W - m.l - m.r); } function Y(r) { return H - m.b - Math.min(r, 12) / 12 * (H - m.t - m.b); }
          [0, 15, 30, 45, 60, 75, 90].forEach(function (a) { svg.appendChild(h('line', { x1: X(a), y1: m.t, x2: X(a), y2: H - m.b, class: 'sx-g-grade' })); var t = h('text', { x: X(a), y: H - 8, 'text-anchor': 'middle', class: 'sx-g-rot' }); t.textContent = a + '°'; svg.appendChild(t); });
          [0, 4, 8, 12].forEach(function (r) { svg.appendChild(h('line', { x1: m.l, y1: Y(r), x2: W - m.r, y2: Y(r), class: 'sx-g-grade' })); var t = h('text', { x: m.l - 5, y: Y(r) + 4, 'text-anchor': 'end', class: 'sx-g-rot' }); t.textContent = r + '′'; svg.appendChild(t); });
          var d = '';
          for (var a = 3; a <= 90; a += 0.5) d += (d ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(refr(a)).toFixed(1);
          svg.appendChild(h('path', { d: d, class: 'sx-g-curva' }));
          if (aa >= 0 && aa <= 90) svg.appendChild(h('circle', { cx: X(aa).toFixed(1), cy: Y(R).toFixed(1), r: 5, class: 'sx-g-pt' }));
          return svg;
        }
        calc();
        return {
          preencher: function (d) { fHi.set(d.hi); fEi.set(d.ei); fHm.set(d.hm); fSd.set(Math.round(d.sd * 10) / 10); limbo.set(d.limbo || 'inf'); verd = d.hoVerd != null ? d.hoVerd : null; calc(); box.scrollIntoView && box.scrollIntoView({ block: 'start', behavior: reduzMov ? 'auto' : 'smooth' }); },
        };
      }

      /* ================================================================== 5. EXERCÍCIO */
      function painelExercicio(box) {
        var cab = h('div', { class: 'sx-ex-cab' });
        var corpo = h('div', { class: 'sx-ex-corpo' });
        box.appendChild(cab); box.appendChild(corpo);
        var grade = h('div', { class: 'sx-grade sx-grade-ob' });
        var colA = h('div', { class: 'sx-col-ocular' }), colB = h('div', { class: 'sx-lado' });
        grade.appendChild(colA); grade.appendChild(colB);
        var oc = Ocular({ aoMudar: function () { atualizarLeitura(); } });
        colA.appendChild(oc.el);
        var tam = Tambor(); var lBig = h('p', { class: 'sx-leitura', 'aria-live': 'polite' });
        function bt(t, aria, fn) { return h('button', { type: 'button', class: 'btn btn-ghost sx-bt', 'aria-label': aria, onclick: fn }, t); }
        var btBal = h('button', { type: 'button', class: 'btn btn-ghost', 'aria-pressed': 'false' }, reduzMov ? 'Inclinar (passo a passo)' : 'Balançar o sextante');
        btBal.addEventListener('click', function () { var on = oc.balancar(); btBal.setAttribute('aria-pressed', String(!!on)); if (!reduzMov) btBal.textContent = on ? 'Parar e pôr na vertical' : 'Balançar o sextante'; });
        var btReg = h('button', { type: 'button', class: 'btn btn-primary' }, 'Registrar leitura');
        var instr = h('div', { class: 'sx-instr' });
        var etapaBox = h('div', { 'aria-live': 'polite' });
        var ctlObs = h('div', { class: 'sx-ctl-obs' });
        colB.appendChild(h('section', { class: 'sx-bloco' }, instr, lBig, tam.el, ctlObs, etapaBox));
        ctlObs.appendChild(h('div', { class: 'sx-bts' },
            h('span', { class: 'sx-bts-g' }, h('span', { class: 'sx-bts-r' }, 'Alidade'), bt('−1°', 'Alidade menos 1 grau', function () { oc.ajustar(-60); }), bt('+1°', 'Alidade mais 1 grau', function () { oc.ajustar(60); })),
            h('span', { class: 'sx-bts-g' }, h('span', { class: 'sx-bts-r' }, 'Tambor'), bt('−1′', 'Tambor menos 1 minuto', function () { oc.ajustar(-1); }), bt('+1′', 'Tambor mais 1 minuto', function () { oc.ajustar(1); }),
              bt('−0,1′', 'Tambor menos um décimo de minuto', function () { oc.ajustar(-0.1); }), bt('+0,1′', 'Tambor mais um décimo de minuto', function () { oc.ajustar(0.1); }))));
        ctlObs.appendChild(h('div', { class: 'btn-row' }, btBal, btReg));
        var x = {};
        function atualizarLeitura() { lBig.textContent = 'Leitura: ' + fLeitura(oc.est.leitura); tam.desenhar(oc.est.leitura); }
        function novo() {
          var hoje = new Date(Date.UTC(2026, 0, 1 + Math.floor(Math.random() * 365))).toISOString().slice(0, 10), s = solDia(hoje);
          x = { data: hoje, sd: Math.round(s.sd * 10) / 10, ph: 0.15, ei: Math.round((Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 2.2) * 10) / 10,
            hm: Math.round((1.8 + Math.random() * 3.5) * 10) / 10, HoC: Math.round((18 + Math.random() * 52) * 600) / 600, pontos: 0, etapa: 1 };
          oc.cenario({ HoC: x.HoC, sd: x.sd, ph: x.ph, hm: x.hm, ei: x.ei, psi: (Math.random() * 2 - 1) * 6, alvo: 'horizonte' });
          oc.set('espelho', opts.espelho === 'meio' ? 'meio' : 'inteiro');
          oc.setLeitura(Math.round((Math.random() * 8 - 4) * 10) / 600); oc.setTheta(0);
          corpo.innerHTML = '';
          corpo.appendChild(h('p', { class: 'sx-enun' }, 'Observação do Sol em ' + fData(x.data) + '. Elevação do olho: ' + num(x.hm, 1) + ' m. SD do Sol no almanaque: ' + num(x.sd, 1) + '′.'));
          corpo.appendChild(grade);
          etapa1();
        }
        function cabec() { cab.textContent = 'Etapa ' + Math.min(3, x.etapa) + ' de 3 · pontos: ' + x.pontos + ' de 3'; }
        function etapa1() {
          x.etapa = 1; cabec(); etapaBox.innerHTML = ''; ctlObs.hidden = false;
          instr.innerHTML = '';
          instr.appendChild(h('h4', null, 'Etapa 1 · Erro instrumental'));
          instr.appendChild(h('p', null, 'Aponte para o horizonte com a alidade perto do zero. O horizonte refletido aparece deslocado do direto. Ajuste o tambor até formarem uma linha só e registre.'));
          btReg.onclick = function () {
            var L = oc.est.leitura;
            etapaBox.innerHTML = '';
            var fEi = campoNum({ rotulo: 'Erro instrumental, ei (com sinal)', un: '′', sinal: true, min: -10, max: 10 });
            var btC = h('button', { type: 'button', class: 'btn btn-primary' }, 'Conferir');
            etapaBox.appendChild(h('div', { class: 'sx-sub' }, h('p', null, 'Sua leitura com os horizontes alinhados: ' + fLeitura(L) + '. Qual é o ei?'), fEi.el, btC));
            btReg.disabled = true;
            btC.onclick = function () {
              var v = fEi.get(); if (!isFinite(v)) return;
              var esperado = -L * 60, okSinal = Math.abs(v - esperado) <= 0.15, okAlinh = Math.abs(L * 60 + x.ei) <= 0.5;
              if (okSinal && okAlinh) x.pontos++;
              btC.disabled = true;
              etapaBox.appendChild(fb(okSinal && okAlinh, okSinal && okAlinh ? 'Certo.' : 'Veja a correção.',
                h('div', null,
                  h('p', null, 'Leitura ' + (L < 0 ? 'fora do arco → ei positivo' : 'no arco → ei negativo') + ': com a sua leitura, ei = ' + fMinS(esperado) + '. ' + (okSinal ? '' : 'Você escreveu ' + fMinS(v) + '.')),
                  h('p', null, 'O ei verdadeiro desta simulação é ' + fMinS(x.ei) + (okAlinh ? '; seu alinhamento foi bom.' : '; seu alinhamento ficou ' + num(Math.abs(L * 60 + x.ei), 1) + '′ fora.')),
                  h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: etapa2 }, 'Etapa 2: observar o Sol')))));
              x.eiAluno = okSinal ? v : x.ei;
              cabec();
            };
          };
          btReg.disabled = false;
        }
        function etapa2() {
          x.etapa = 2; cabec(); etapaBox.innerHTML = ''; btReg.disabled = false;
          oc.cenario({ alvo: 'sol' });
          var id = oc.ideal();
          oc.setLeitura(id - (0.3 + Math.random() * 0.25)); oc.setTheta((Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random()));
          instr.innerHTML = '';
          instr.appendChild(h('h4', null, 'Etapa 2 · Altura do Sol'));
          instr.appendChild(h('p', null, 'Filtros rebatidos. Leve o limbo inferior do Sol a tocar o horizonte. O sextante começa um pouco inclinado: balance para achar a vertical (o ponto mais baixo do arco) e registre.'));
          btReg.onclick = function () {
            var L = oc.est.leitura, th = oc.est.theta, err = (L - oc.ideal()) * 60;
            var ok = Math.abs(err) <= 1 && Math.abs(th) <= 1;
            if (ok) x.pontos++;
            x.hi = Math.round(L * 600) / 600; btReg.disabled = true;
            if (oc.balancando()) { oc.balancar(false); btBal.setAttribute('aria-pressed', 'false'); if (!reduzMov) btBal.textContent = 'Balançar o sextante'; }
            etapaBox.innerHTML = '';
            etapaBox.appendChild(fb(ok, ok ? 'Boa visada: Hi = ' + fLeitura(L) : 'Hi = ' + fLeitura(L),
              h('div', null, h('p', null, 'A leitura exata era ' + fLeitura(oc.ideal()) + ' (diferença ' + fMinS(err) + ').' + (Math.abs(th) > 1 ? ' O sextante estava inclinado ' + num(Math.abs(th), 1) + '° no registro: inclinado, a leitura sai maior.' : '')),
                h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: etapa3 }, 'Etapa 3: corrigir a altura')))));
            cabec();
          };
        }
        function etapa3() {
          x.etapa = 3; cabec(); etapaBox.innerHTML = ''; ctlObs.hidden = true;
          var c = corrigir(x.hi, x.eiAluno, x.hm, x.sd, x.ph, 'inf');
          instr.innerHTML = '';
          instr.appendChild(h('h4', null, 'Etapa 3 · Correções'));
          instr.appendChild(h('p', null, 'Hi = ' + gm(x.hi) + ' · ei = ' + fMinS(x.eiAluno) + ' · elevação do olho ' + num(x.hm, 1) + ' m · SD ' + num(x.sd, 1) + '′ · limbo inferior · paralaxe horizontal 0,15′. Calcule:'));
          var fDp = campoNum({ rotulo: 'Depressão, dp', un: '′', min: 0, max: 20 }), fR = campoNum({ rotulo: 'Refração, R', un: '′', min: 0, max: 40 });
          var fHo = campoAng({ rotulo: 'Altura verdadeira, Ho' });
          var btC = h('button', { type: 'button', class: 'btn btn-primary' }, 'Conferir');
          etapaBox.appendChild(h('div', { class: 'sx-sub' }, h('div', { class: 'sx-linha' }, fDp.el, fR.el), fHo.el, btC,
            h('p', { class: 'sx-dica' }, 'dp = 1,76′ √h · R = cot(aa + 7,31/(aa + 4,4)) · Ho = aa − R + SD + P')));
          btC.onclick = function () {
            var vD = fDp.get(), vR = fR.get(), vH = fHo.get();
            if (![vD, vR, vH].every(isFinite)) return;
            var ok1 = Math.abs(vD - c.dp) <= 0.15, ok2 = Math.abs(vR - c.R) <= 0.2, ok3 = Math.abs(vH - c.av) * 60 <= 0.4;
            if (ok1 && ok2 && ok3) x.pontos++;
            btC.disabled = true; cabec();
            var ol = h('ol', { class: 'sx-passos sx-passos-gab' });
            ol.appendChild(passo(1, 'ao = Hi + ei', [gm(x.hi) + ' ' + fMinS(x.eiAluno)], gm(c.ao)));
            ol.appendChild(passo(2, 'dp = 1,76′ × √' + num(x.hm, 1), [], num(c.dp, 1) + '′ → aa = ' + gm(c.aa)));
            ol.appendChild(passo(3, 'R para aa = ' + gm(c.aa), [], num(c.R, 1) + '′'));
            ol.appendChild(passo(4, 'Ho = aa − R + SD + P', [gm(c.aa) + ' − ' + num(c.R, 1) + '′ + ' + num(x.sd, 1) + '′ + ' + num(c.P, 1) + '′'], gm(c.av)));
            etapaBox.appendChild(fb(ok1 && ok2 && ok3, (ok1 && ok2 && ok3) ? 'Certo.' : 'Confira os passos.',
              h('div', null, h('ul', { class: 'sx-conf' },
                h('li', { 'data-ok': ok1 ? '1' : '0' }, 'Depressão: ' + (ok1 ? 'certo' : 'o correto é ' + num(c.dp, 1) + '′')),
                h('li', { 'data-ok': ok2 ? '1' : '0' }, 'Refração: ' + (ok2 ? 'certo' : 'o correto é ' + num(c.R, 1) + '′')),
                h('li', { 'data-ok': ok3 ? '1' : '0' }, 'Ho: ' + (ok3 ? 'certo' : 'o correto é ' + gm(c.av)))), ol,
                h('p', null, 'A altura verdadeira da simulação era ' + gm(x.HoC) + '. Diferença final: ' + fMinS((c.av - x.HoC) * 60) + ' — vem da visada e do ei.'),
                h('p', { class: 'sx-big' }, 'Resultado: ' + x.pontos + ' de 3 etapas'),
                h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novo }, 'Nova observação')))));
          };
        }
        novo();
        return { ativo: function (on) { if (!on && oc.balancando()) { oc.balancar(false); btBal.setAttribute('aria-pressed', 'false'); if (!reduzMov) btBal.textContent = 'Balançar o sextante'; } else oc.desenhar(); }, destruir: oc.destruir };
      }

      var CONSTRUIR = { instrumento: painelInstrumento, observar: painelObservar, correcoes: painelCorrecoes, exercicio: painelExercicio };
      irPara(st.aba);
      limpezas.push(VL.on('settings', function (s) { var n = !!(s && s.intl); if (n !== intl) { intl = n; } }));
      return function limpar() {
        vivo = false;
        Object.keys(apis).forEach(function (k) { try { if (apis[k].destruir) apis[k].destruir(); } catch (e) { /* ignora */ } });
        limpezas.forEach(function (f) { try { f(); } catch (e) { /* ignora */ } });
        el.innerHTML = '';
      };
    },
  });
})();
